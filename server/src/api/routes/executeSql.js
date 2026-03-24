import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { executeSQL } from '../../engines/sqlEngine.js';
import { getAllChallenges, getChallengeById } from '../../engines/sqlChallenges.js';

const router = Router();

const sqlRateLimiter = rateLimit({
  windowMs: 10_000,
  max: 10,
  message: { error: 'Too many SQL queries. Please wait a moment.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Run free-form query
router.post('/', sqlRateLimiter, async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid "query" field.' });
    }

    const result = await executeSQL(query);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// Get all challenges (without answers)
router.get('/challenges', (req, res) => {
  return res.json({ challenges: getAllChallenges() });
});

// Verify user's answer for a challenge
router.post('/verify', sqlRateLimiter, async (req, res) => {
  try {
    const { challengeId, query } = req.body;

    if (!challengeId || !query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Missing challengeId or query.' });
    }

    const challenge = getChallengeById(challengeId);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found.' });
    }

    // Execute user's query
    let userResult;
    try {
      userResult = await executeSQL(query);
    } catch (err) {
      return res.json({
        correct: false,
        userError: err.message,
        explanation: `❌ Query में error है: ${err.message}`,
        correctQuery: challenge.expectedQuery,
      });
    }

    // Execute expected query
    const expectedResult = await executeSQL(challenge.expectedQuery);

    // Compare results
    const isCorrect = compareResults(userResult, expectedResult);

    if (isCorrect) {
      return res.json({
        correct: true,
        userResult,
        explanation: `✅ बिल्कुल सही! आपकी query सही है।`,
        correctQuery: challenge.expectedQuery,
      });
    } else {
      return res.json({
        correct: false,
        userResult,
        expectedResult,
        explanation: `❌ गलत — आपकी query का result expected result से match नहीं करता।`,
        correctQuery: challenge.expectedQuery,
      });
    }
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

function compareResults(userResult, expectedResult) {
  // Both empty
  if (userResult.rowCount === 0 && expectedResult.rowCount === 0) return true;

  // Row count mismatch
  if (userResult.rowCount !== expectedResult.rowCount) return false;

  // Column count mismatch
  if (userResult.columns.length !== expectedResult.columns.length) return false;

  // Compare column names (case-insensitive)
  const userCols = userResult.columns.map(c => c.toLowerCase());
  const expectedCols = expectedResult.columns.map(c => c.toLowerCase());
  if (JSON.stringify(userCols) !== JSON.stringify(expectedCols)) return false;

  // Compare row data (stringify for deep comparison)
  const userRows = userResult.rows.map(r => JSON.stringify(r));
  const expectedRows = expectedResult.rows.map(r => JSON.stringify(r));

  // Check if same rows exist (order matters since expected has ORDER BY)
  if (JSON.stringify(userRows) !== JSON.stringify(expectedRows)) return false;

  return true;
}

export { router as executeSqlRouter };
