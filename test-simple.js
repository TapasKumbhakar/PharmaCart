// Simple test for medical records
const fetch = require('node-fetch');

async function testSimple() {
  try {
    console.log('Testing medical records test endpoint...');
    const response = await fetch('http://localhost:4242/api/medical-records/test');
    const data = await response.json();
    console.log('Test response:', data);
    
    if (data.success) {
      console.log('✅ Medical records routes are working!');
    } else {
      console.log('❌ Test failed');
    }
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testSimple();
