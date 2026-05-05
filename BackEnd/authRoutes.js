const express = require('express');
const { db } = require('./database');
const { 
  validatePassword, 
  hashPassword, 
  comparePassword, 
  generateToken, 
  verifyToken,
  generateResetToken,
  validateEmail
} = require('./authUtils');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Signup endpoint
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }
    
    if (!validateEmail(email)) {
      return res.status(400).json({ 
        error: 'Please provide a valid email address' 
      });
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        error: 'Password requirements not met',
        details: passwordValidation.errors
      });
    }
    
    // Check if user already exists
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (row) {
        return res.status(409).json({ 
          error: 'User with this email already exists' 
        });
      }
      
      // Create new user
      try {
        const hashedPassword = await hashPassword(password);
        const userId = uuidv4();
        
        db.run(
          'INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)',
          [userId, email, hashedPassword, name || null],
          function(err) {
            if (err) {
              return res.status(500).json({ error: 'Failed to create user' });
            }
            
            // Generate token
            const token = generateToken(userId, email);
            
            res.status(201).json({
              message: 'User created successfully',
              token,
              user: {
                id: userId,
                email,
                name: name || null
              }
            });
          }
        );
      } catch (hashError) {
        res.status(500).json({ error: 'Failed to process password' });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }
    
    // Find user
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!user) {
        return res.status(401).json({ 
          error: 'Invalid email or password' 
        });
      }
      
      // Check if user is active
      if (!user.is_active) {
        return res.status(401).json({ 
          error: 'Account has been deactivated' 
        });
      }
      
      // Compare password
      try {
        const isValidPassword = await comparePassword(password, user.password);
        
        if (!isValidPassword) {
          return res.status(401).json({ 
            error: 'Invalid email or password' 
          });
        }
        
        // Update last login
        db.run(
          'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
          [user.id]
        );
        
        // Generate token
        const token = generateToken(user.id, user.email);
        
        res.json({
          message: 'Login successful',
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isAdmin: user.role === 'admin'
          }
        });
      } catch (compareError) {
        res.status(500).json({ error: 'Authentication failed' });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout endpoint (client-side token removal, but we can add server-side tracking if needed)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

// Forgot password endpoint
router.post('/forgot-password', (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        error: 'Email is required' 
      });
    }
    
    if (!validateEmail(email)) {
      return res.status(400).json({ 
        error: 'Please provide a valid email address' 
      });
    }
    
    // Check if user exists
    db.get('SELECT id FROM users WHERE email = ?', [email], (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!user) {
        // Don't reveal if email exists or not for security
        return res.json({ 
          message: 'If an account with that email exists, a password reset link has been sent' 
        });
      }
      
      // Generate reset token
      const resetToken = generateResetToken();
      const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now
      
      // Store reset token
      db.run(
        'INSERT INTO password_reset_tokens (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)',
        [uuidv4(), user.id, resetToken, expiresAt.toISOString()],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to generate reset token' });
          }
          
          // In a real application, you would send an email here
          // For now, we'll just return the token (for testing purposes)
          res.json({ 
            message: 'Password reset token generated',
            resetToken, // Remove this in production and send via email
            expiresIn: '1 hour'
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Reset password endpoint
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ 
        error: 'Reset token and new password are required' 
      });
    }
    
    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        error: 'Password requirements not met',
        details: passwordValidation.errors
      });
    }
    
    // Find valid reset token
    db.get(
      'SELECT user_id FROM password_reset_tokens WHERE token = ? AND expires_at > datetime("now")',
      [token],
      async (err, resetData) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        if (!resetData) {
          return res.status(400).json({ 
            error: 'Invalid or expired reset token' 
          });
        }
        
        // Hash new password
        try {
          const hashedPassword = await hashPassword(newPassword);
          
          // Update user password
          db.run(
            'UPDATE users SET password = ?, updated_at = datetime("now") WHERE id = ?',
            [hashedPassword, resetData.user_id],
            function(err) {
              if (err) {
                return res.status(500).json({ error: 'Failed to update password' });
              }
              
              // Delete used reset token
              db.run(
                'DELETE FROM password_reset_tokens WHERE token = ?',
                [token]
              );
              
              res.json({ 
                message: 'Password reset successful' 
              });
            }
          );
        } catch (hashError) {
          res.status(500).json({ error: 'Failed to process password' });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
  
  req.user = decoded;
  next();
};

// Get current user info
router.get('/me', authenticateToken, (req, res) => {
  db.get(
    'SELECT id, email, name, created_at FROM users WHERE id = ?',
    [req.user.userId],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({ user });
    }
  );
});

module.exports = {
  router,
  authenticateToken
};
