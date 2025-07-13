const fetch = require('node-fetch');

async function testDirect() {
  try {
    console.log('Testing direct route...');
    const response = await fetch('http://localhost:4242/api/medical-records/test-direct');
    const data = await response.json();
    console.log('Direct route response:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testDirect();
