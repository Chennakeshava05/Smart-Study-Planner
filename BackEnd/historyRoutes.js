const express = require('express');
const { db } = require('./database');
const { authenticateToken } = require('./authRoutes');

const router = express.Router();

// Get user's previous study schedules
router.get('/schedules', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  
  db.all(
    'SELECT id, subject, topics, duration_hours, difficulty, generated_schedule, created_at FROM study_sessions WHERE user_id = ? ORDER BY created_at DESC',
    [userId],
    (err, rows) => {
      if (err) {
        console.error('Error fetching study sessions:', err);
        return res.status(500).json({ error: 'Failed to fetch study sessions' });
      }
      
      // Parse the JSON strings for each session
      const sessions = rows.map(row => ({
        ...row,
        topics: JSON.parse(row.topics),
        generated_schedule: JSON.parse(row.generated_schedule)
      }));
      
      res.json({ sessions });
    }
  );
});

// Get user's previous quiz sessions
router.get('/quizzes', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  
  db.all(
    'SELECT id, subject, topics, num_questions, difficulty, generated_quiz, user_answers, score, created_at FROM quiz_sessions WHERE user_id = ? ORDER BY created_at DESC',
    [userId],
    (err, rows) => {
      if (err) {
        console.error('Error fetching quiz sessions:', err);
        return res.status(500).json({ error: 'Failed to fetch quiz sessions' });
      }
      
      // Parse the JSON strings for each session
      const sessions = rows.map(row => ({
        ...row,
        topics: JSON.parse(row.topics),
        generated_quiz: JSON.parse(row.generated_quiz),
        user_answers: row.user_answers ? JSON.parse(row.user_answers) : null
      }));
      
      res.json({ sessions });
    }
  );
});

// Delete a study session
router.delete('/schedules/:sessionId', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const sessionId = req.params.sessionId;
  
  db.run(
    'DELETE FROM study_sessions WHERE id = ? AND user_id = ?',
    [sessionId, userId],
    function(err) {
      if (err) {
        console.error('Error deleting study session:', err);
        return res.status(500).json({ error: 'Failed to delete study session' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Study session not found' });
      }
      
      res.json({ message: 'Study session deleted successfully' });
    }
  );
});

// Delete a quiz session
router.delete('/quizzes/:sessionId', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const sessionId = req.params.sessionId;
  
  db.run(
    'DELETE FROM quiz_sessions WHERE id = ? AND user_id = ?',
    [sessionId, userId],
    function(err) {
      if (err) {
        console.error('Error deleting quiz session:', err);
        return res.status(500).json({ error: 'Failed to delete quiz session' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Quiz session not found' });
      }
      
      res.json({ message: 'Quiz session deleted successfully' });
    }
  );
});

// Get a specific study session for quiz generation
router.get('/schedules/:sessionId', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const sessionId = req.params.sessionId;
  
  db.get(
    'SELECT id, subject, topics, duration_hours, difficulty, generated_schedule, created_at FROM study_sessions WHERE id = ? AND user_id = ?',
    [sessionId, userId],
    (err, row) => {
      if (err) {
        console.error('Error fetching study session:', err);
        return res.status(500).json({ error: 'Failed to fetch study session' });
      }
      
      if (!row) {
        return res.status(404).json({ error: 'Study session not found' });
      }
      
      // Parse the JSON strings
      const session = {
        ...row,
        topics: JSON.parse(row.topics),
        generated_schedule: JSON.parse(row.generated_schedule)
      };
      
      res.json({ session });
    }
  );
});

module.exports = router;
