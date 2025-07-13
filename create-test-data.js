// Create test data for admin panel
const fetch = require('node-fetch');

async function createTestData() {
  try {
    // First create a customer user
    console.log('1. Creating customer user...');
    const customerResponse = await fetch('http://localhost:4242/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullname: 'John Doe',
        email: 'john@example.com',
        mobile: '9876543210',
        password: 'customer123',
        type: 'Customer'
      })
    });
    
    const customerData = await customerResponse.json();
    console.log('Customer created:', customerData.success ? 'SUCCESS' : 'FAILED');
    
    if (customerData.success) {
      const customerToken = customerData.token;
      
      // Create test order
      console.log('2. Creating test order...');
      const orderResponse = await fetch('http://localhost:4242/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${customerToken}`
        },
        body: JSON.stringify({
          items: [
            { name: 'Paracetamol 500mg', quantity: 2, price: 30 },
            { name: 'Vitamin D3', quantity: 1, price: 150 }
          ],
          totalAmount: 210,
          shippingAddress: {
            street: '123 Main St',
            city: 'Mumbai',
            state: 'Maharashtra',
            zipCode: '400001',
            country: 'India'
          },
          paymentMethod: 'COD'
        })
      });
      
      const orderData = await orderResponse.json();
      console.log('Order created:', orderData.success ? 'SUCCESS' : 'FAILED');
      
      // Create test appointment
      console.log('3. Creating test appointment...');
      const appointmentResponse = await fetch('http://localhost:4242/api/appointments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${customerToken}`
        },
        body: JSON.stringify({
          patientName: 'John Doe',
          email: 'john@example.com',
          phone: '9876543210',
          preferredDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
          preferredTime: '10:00 AM',
          consultationType: 'General Consultation',
          symptoms: 'Fever and headache',
          medicalHistory: 'No major medical history'
        })
      });
      
      const appointmentData = await appointmentResponse.json();
      console.log('Appointment created:', appointmentData.success ? 'SUCCESS' : 'FAILED');
      
      // Create medical record in localStorage (since we're using simplified version)
      console.log('4. Creating test medical record...');
      const medicalRecord = {
        id: Date.now().toString(),
        patientName: 'John Doe',
        phone: '9876543210',
        recordType: 'Prescription',
        description: 'Blood pressure medication prescription',
        fileName: 'prescription_bp_medication.pdf',
        fileSize: 245760,
        fileType: 'application/pdf',
        uploadDate: new Date().toISOString(),
        recordNumber: `MR${Date.now()}`
      };
      
      console.log('Medical record created for localStorage:', medicalRecord.recordNumber);
      console.log('\n✅ Test data created successfully!');
      console.log('\nTo test admin panel:');
      console.log('1. Go to http://localhost:3000/login');
      console.log('2. Login with: admin@pharmacart.com / admin123');
      console.log('3. You will be redirected to admin panel');
      console.log('4. Add the medical record to localStorage by uploading via /upload page first');
    }
    
  } catch (error) {
    console.error('❌ Error creating test data:', error.message);
  }
}

createTestData();
