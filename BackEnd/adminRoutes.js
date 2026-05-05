const express = require('express');
const { db } = require('./database');
const { authenticateToken } = require('./authRoutes');

const router = express.Router();

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.email !== process.env.ADMIN_EMAIL) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Get all users with their activity statistics
router.get('/users', authenticateToken, requireAdmin, (req, res) => {
  const query = `
    SELECT 
      u.id, u.email, u.name, u.role, u.is_active, u.last_login, u.created_at,
      COUNT(DISTINCT s.id) as schedule_count,
      COUNT(DISTINCT q.id) as quiz_count,
      MAX(s.created_at) as last_schedule,
      MAX(q.created_at) as last_quiz
    FROM users u
    LEFT JOIN study_sessions s ON u.id = s.user_id
    LEFT JOIN quiz_sessions q ON u.id = q.user_id
    GROUP BY u.id, u.email, u.name, u.role, u.is_active, u.last_login, u.created_at
    ORDER BY u.created_at DESC
  `;
  
  db.all(query, (err, rows) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
    
    res.json({ users: rows });
  });
});

// Get detailed activity for a specific user
router.get('/users/:userId/activity', authenticateToken, requireAdmin, (req, res) => {
  const userId = req.params.userId;
  
  const query = `
    SELECT 
      'schedule' as type,
      id,
      subject,
      topics,
      duration_hours,
      difficulty,
      created_at
    FROM study_sessions 
    WHERE user_id = ?
    UNION ALL
    SELECT 
      'quiz' as type,
      id,
      subject,
      topics,
      num_questions as duration_hours,
      difficulty,
      created_at
    FROM quiz_sessions 
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;
  
  db.all(query, [userId, userId], (err, rows) => {
    if (err) {
      console.error('Error fetching user activity:', err);
      return res.status(500).json({ error: 'Failed to fetch user activity' });
    }
    
    // Parse JSON strings
    const activities = rows.map(row => ({
      ...row,
      topics: JSON.parse(row.topics)
    }));
    
    res.json({ activities });
  });
});

// Update user role (promote/demote admin)
router.put('/users/:userId/role', authenticateToken, requireAdmin, (req, res) => {
  const userId = req.params.userId;
  const { role } = req.body;
  
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  
  db.run(
    'UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [role, userId],
    function(err) {
      if (err) {
        console.error('Error updating user role:', err);
        return res.status(500).json({ error: 'Failed to update user role' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({ message: 'User role updated successfully' });
    }
  );
});

// Activate/deactivate user
router.put('/users/:userId/status', authenticateToken, requireAdmin, (req, res) => {
  const userId = req.params.userId;
  const { is_active } = req.body;
  
  db.run(
    'UPDATE users SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [is_active, userId],
    function(err) {
      if (err) {
        console.error('Error updating user status:', err);
        return res.status(500).json({ error: 'Failed to update user status' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({ message: 'User status updated successfully' });
    }
  );
});

// Get application statistics
router.get('/stats', authenticateToken, requireAdmin, (req, res) => {
  const queries = {
    totalUsers: 'SELECT COUNT(*) as count FROM users',
    activeUsers: 'SELECT COUNT(*) as count FROM users WHERE is_active = 1',
    totalSchedules: 'SELECT COUNT(*) as count FROM study_sessions',
    totalQuizzes: 'SELECT COUNT(*) as count FROM quiz_sessions',
    recentActivity: `
      SELECT 
        u.email,
        'schedule' as type,
        s.subject,
        s.created_at
      FROM study_sessions s
      JOIN users u ON s.user_id = u.id
      UNION ALL
      SELECT 
        u.email,
        'quiz' as type,
        q.subject,
        q.created_at
      FROM quiz_sessions q
      JOIN users u ON q.user_id = u.id
      ORDER BY created_at DESC
      LIMIT 10
    `
  };
  
  const stats = {};
  let completed = 0;
  const totalQueries = Object.keys(queries).length;
  
  Object.entries(queries).forEach(([key, query]) => {
    if (key === 'recentActivity') {
      db.all(query, (err, rows) => {
        if (err) {
          console.error(`Error fetching ${key}:`, err);
          stats[key] = [];
        } else {
          stats[key] = rows;
        }
        
        if (++completed === totalQueries) {
          res.json(stats);
        }
      });
    } else {
      db.get(query, (err, row) => {
        if (err) {
          console.error(`Error fetching ${key}:`, err);
          stats[key] = 0;
        } else {
          stats[key] = row.count;
        }
        
        if (++completed === totalQueries) {
          res.json(stats);
        }
      });
    }
  });
});

module.exports = router;
