const fetch = require('node-fetch');

async function testPorts() {
  try {
    console.log('Testing port 4242...');
    const response1 = await fetch('http://localhost:4242/api/auth/profile');
    console.log('Port 4242 status:', response1.status);
    
    console.log('Testing port 4243...');
    const response2 = await fetch('http://localhost:4243/test');
    const data2 = await response2.json();
    console.log('Port 4243 response:', data2);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testPorts();
