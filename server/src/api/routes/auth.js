import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { User, RefreshToken } from '../../db/models/index.js';
import sequelize from '../../db/index.js';
import { validateEmail, validatePassword, validateUsername } from '../validators.js';
import { requireAuth } from '../middleware/auth.js';
import {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRY,
  JWT_REFRESH_EXPIRY,
  BCRYPT_SALT_ROUNDS,
  AUTH_RATE_LIMIT_WINDOW_MS,
  AUTH_RATE_LIMIT_MAX_REQUESTS
} from '../../config/index.js';
import { isUsernameActive } from '../../socket/roomManager.js';

export const authRouter = Router();

const authLimiter = rateLimit({
  windowMs: AUTH_RATE_LIMIT_WINDOW_MS,
  max: AUTH_RATE_LIMIT_MAX_REQUESTS,
  message: { error: 'Too many attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiter only on login/register (brute force protection)
// Not on guest/refresh/logout/me

function generateAccessToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, username: user.username },
    JWT_ACCESS_SECRET,
    { expiresIn: JWT_ACCESS_EXPIRY }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { userId: user.id },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRY }
  );
}

function setRefreshTokenCookie(res, token) {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth'
  });
}

// POST /api/auth/guest
authRouter.post('/guest', async (req, res) => {
  try {
    const { username } = req.body;

    const usernameResult = validateUsername(username);
    if (!usernameResult.valid) {
      return res.status(400).json({ error: usernameResult.message });
    }

    // Check if username is taken by a registered user
    const existingUser = await User.findOne({
      where: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('username')),
        usernameResult.value.toLowerCase()
      )
    });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    // Check if username is active in any room
    if (isUsernameActive(usernameResult.value)) {
      return res.status(409).json({ error: 'Username is currently in use' });
    }

    const guestId = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const accessToken = jwt.sign(
      { userId: guestId, username: usernameResult.value, isGuest: true },
      JWT_ACCESS_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      accessToken,
      user: { id: guestId, username: usernameResult.value, isGuest: true }
    });
  } catch (err) {
    console.error('Guest login error:', err);
    res.status(500).json({ error: 'Guest login failed' });
  }
});

// POST /api/auth/register
authRouter.post('/register', authLimiter, async (req, res) => {
  try {
    const { email, password, username } = req.body;

    const emailResult = validateEmail(email);
    if (!emailResult.valid) {
      return res.status(400).json({ error: emailResult.message });
    }

    const passwordResult = validatePassword(password);
    if (!passwordResult.valid) {
      return res.status(400).json({ error: passwordResult.message });
    }

    const usernameResult = validateUsername(username);
    if (!usernameResult.valid) {
      return res.status(400).json({ error: usernameResult.message });
    }

    const existingEmail = await User.findOne({ where: { email: emailResult.value } });
    if (existingEmail) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const existingUsername = await User.findOne({
      where: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('username')),
        usernameResult.value.toLowerCase()
      )
    });
    if (existingUsername) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    const user = await User.scope('withPassword').create({
      email: emailResult.value,
      password: hashedPassword,
      username: usernameResult.value
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await RefreshToken.create({
      token: refreshToken,
      userId: user.id,
      expiresAt
    });

    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      accessToken,
      user: { id: user.id, email: user.email, username: user.username }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
authRouter.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.scope('withPassword').findOne({
      where: { email: email.trim().toLowerCase() }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await RefreshToken.create({
      token: refreshToken,
      userId: user.id,
      expiresAt
    });

    setRefreshTokenCookie(res, refreshToken);

    res.json({
      accessToken,
      user: { id: user.id, email: user.email, username: user.username }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/refresh
authRouter.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_REFRESH_SECRET);
    } catch (err) {
      await RefreshToken.destroy({ where: { token } });
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const storedToken = await RefreshToken.findOne({
      where: { token },
      include: [{ model: User.scope('withPassword') }]
    });

    if (!storedToken) {
      return res.status(401).json({ error: 'Refresh token not found' });
    }

    if (new Date() > storedToken.expiresAt) {
      await storedToken.destroy();
      return res.status(401).json({ error: 'Refresh token expired' });
    }

    const user = storedToken.User;

    // Token rotation: delete old, issue new
    await storedToken.destroy();

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await RefreshToken.create({
      token: newRefreshToken,
      userId: user.id,
      expiresAt
    });

    setRefreshTokenCookie(res, newRefreshToken);

    res.json({
      accessToken: newAccessToken,
      user: { id: user.id, email: user.email, username: user.username }
    });
  } catch (err) {
    console.error('Token refresh error:', err);
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

// POST /api/auth/logout
authRouter.post('/logout', async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      await RefreshToken.destroy({ where: { token } });
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth'
    });

    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// GET /api/auth/me
authRouter.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: { id: user.id, email: user.email, username: user.username }
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Failed to get user info' });
  }
});
