// Create admin user for testing
const fetch = require('node-fetch');

async function createAdmin() {
  try {
    console.log('Creating admin user...');
    const response = await fetch('http://localhost:4242/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullname: 'Admin User',
        email: 'admin@pharmacart.com',
        mobile: '9999999999',
        password: 'admin123',
        type: 'Admin'
      })
    });
    
    const data = await response.json();
    console.log('Admin creation response:', data);
    
    if (data.success) {
      console.log('✅ Admin user created successfully!');
      console.log('Email: admin@pharmacart.com');
      console.log('Password: admin123');
      console.log('Token:', data.token);
    } else {
      console.log('❌ Failed to create admin:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  }
}

createAdmin();
