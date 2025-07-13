// Test medical records with auth
const fetch = require('node-fetch');

async function testMedical() {
  try {
    // Register and get token
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
    console.log('Registration:', registerData.success ? 'SUCCESS' : 'FAILED');
    
    if (registerData.success) {
      const token = registerData.token;
      
      // Test upload
      console.log('Testing upload...');
      const uploadResponse = await fetch('http://localhost:4242/api/medical-records/upload', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          patientName: 'Test Patient',
          phone: '1234567890',
          recordType: 'Prescription',
          description: 'Test upload',
          fileName: 'test.pdf',
          fileData: 'test data'
        })
      });
      
      const uploadData = await uploadResponse.json();
      console.log('Upload:', uploadData.success ? 'SUCCESS' : 'FAILED');
      if (!uploadData.success) {
        console.log('Upload error:', uploadData.error);
      }
      
      // Test get records
      console.log('Testing get records...');
      const getResponse = await fetch('http://localhost:4242/api/medical-records', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const getData = await getResponse.json();
      console.log('Get records:', getData.success ? 'SUCCESS' : 'FAILED');
      if (getData.success) {
        console.log('Records count:', getData.records.length);
      }
    }
    
  } catch (error) {
    console.error('Test error:', error.message);
  }
}

testMedical();
