const { db } = require('./database');
const { hashPassword } = require('./authUtils');
const { v4: uuidv4 } = require('uuid');

const setupAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'chennakeshavareddy05@gmail.com';
    const adminPassword = 'Admin@123!'; // You should change this
    
    // Check if admin already exists
    db.get('SELECT * FROM users WHERE email = ?', [adminEmail], async (err, user) => {
      if (err) {
        console.error('Error checking admin user:', err);
        return;
      }
      
      if (user) {
        // Update existing user to admin role
        db.run(
          'UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?',
          ['admin', adminEmail],
          (err) => {
            if (err) {
              console.error('Error updating admin role:', err);
            } else {
              console.log(`✅ Admin role updated for: ${adminEmail}`);
            }
          }
        );
      } else {
        // Create new admin user
        try {
          const hashedPassword = await hashPassword(adminPassword);
          const adminId = uuidv4();
          
          db.run(
            'INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)',
            [adminId, adminEmail, hashedPassword, 'Admin User', 'admin'],
            (err) => {
              if (err) {
                console.error('Error creating admin user:', err);
              } else {
                console.log(`✅ Admin user created: ${adminEmail}`);
                console.log(`🔑 Password: ${adminPassword}`);
                console.log('⚠️  Please change the password after first login!');
              }
            }
          );
        } catch (hashError) {
          console.error('Error hashing admin password:', hashError);
        }
      }
    });
  } catch (error) {
    console.error('Error setting up admin:', error);
  }
};

// Run the setup
setupAdmin();
