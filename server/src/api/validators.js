export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, message: 'Email is required' };
  }

  const trimmed = email.trim().toLowerCase();

  if (trimmed.length > 255) {
    return { valid: false, message: 'Email must not exceed 255 characters' };
  }

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(trimmed)) {
    return { valid: false, message: 'Invalid email format' };
  }

  return { valid: true, value: trimmed };
}

export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Password is required' };
  }

  const errors = [];

  if (password.length < 8) {
    errors.push('at least 8 characters');
  }
  if (password.length > 128) {
    errors.push('no more than 128 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('at least one number');
  }

  if (errors.length > 0) {
    return {
      valid: false,
      message: `Password must contain: ${errors.join(', ')}`
    };
  }

  return { valid: true };
}

export function validateUsername(username) {
  if (!username || typeof username !== 'string') {
    return { valid: false, message: 'Username is required' };
  }

  const trimmed = username.trim();

  if (trimmed.length < 2 || trimmed.length > 30) {
    return { valid: false, message: 'Username must be 2-30 characters' };
  }

  if (!/^[a-zA-Z0-9_\- ]+$/.test(trimmed)) {
    return { valid: false, message: 'Username can only contain letters, numbers, spaces, hyphens and underscores' };
  }

  if (/^\s|\s$/.test(trimmed)) {
    return { valid: false, message: 'Username cannot start or end with a space' };
  }

  const reserved = ['admin', 'root', 'system', 'moderator', 'username', 'guest', 'null', 'undefined'];
  if (reserved.includes(trimmed.toLowerCase())) {
    return { valid: false, message: 'This username is not allowed' };
  }

  return { valid: true, value: trimmed };
}
