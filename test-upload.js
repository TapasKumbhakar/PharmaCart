// Test medical records upload endpoint
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');

async function testUpload() {
  try {
    // First, register and login to get a token
    console.log('1. Registering user...');
    const registerResponse = await fetch('http://localhost:4242/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullname: 'Test User',
        email: `test${Date.now()}@example.com`,
        mobile: '1234567890',
        password: 'password123',
        type: 'Customer'
      })
    });
    
    const registerData = await registerResponse.json();
    console.log('Registration response:', registerData);
    
    if (registerData.success) {
      const token = registerData.token;
      console.log('Token received:', token ? 'Yes' : 'No');
      
      // Test the medical records endpoint
      console.log('\n2. Testing medical records endpoint...');
      const testResponse = await fetch('http://localhost:4242/api/medical-records', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('Medical records endpoint status:', testResponse.status);
      const testData = await testResponse.text();
      console.log('Medical records response:', testData.substring(0, 200));
      
      // Test upload endpoint specifically
      console.log('\n3. Testing upload endpoint...');
      const uploadResponse = await fetch('http://localhost:4242/api/medical-records/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('Upload endpoint status:', uploadResponse.status);
      const uploadData = await uploadResponse.text();
      console.log('Upload response:', uploadData.substring(0, 200));
    }
    
  } catch (error) {
    console.error('Test error:', error.message);
  }
}

testUpload();
