// Simple test to verify the backend is working
const fetch = require('node-fetch');

async function simpleTest() {
  console.log('🧪 Testing Backend...');
  
  try {
    // Test 1: Register a user
    console.log('1. Testing registration...');
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
    console.log('✅ Registration:', registerData.success ? 'SUCCESS' : 'FAILED');
    
    if (registerData.success) {
      const token = registerData.token;
      
      // Test 2: Create an order
      console.log('2. Testing order creation...');
      const orderResponse = await fetch('http://localhost:4242/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          items: [
            {
              productId: 'test-1',
              name: 'Test Medicine',
              price: 100,
              quantity: 1,
              image: 'test.jpg'
            }
          ],
          totalAmount: 100,
          shippingFee: 0,
          paymentMethod: 'Cash On Delivery',
          shippingAddress: {
            street: 'Test Street',
            city: 'Test City',
            state: 'Test State',
            zipCode: '123456',
            country: 'India'
          }
        })
      });
      
      const orderData = await orderResponse.json();
      console.log('✅ Order creation:', orderData.success ? 'SUCCESS' : 'FAILED');
      if (!orderData.success) {
        console.log('❌ Order error:', orderData.error);
      } else {
        console.log('📦 Order number:', orderData.order.orderNumber);
      }
      
      // Test 3: Create an appointment
      console.log('3. Testing appointment creation...');
      const appointmentResponse = await fetch('http://localhost:4242/api/appointments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          patientName: 'Test Patient',
          email: registerData.user.email,
          phone: '1234567890',
          dateOfBirth: '1990-01-01',
          gender: 'Male',
          consultationType: 'General Consultation',
          preferredDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          symptoms: 'Test symptoms',
          consultationFee: 300,
          paymentMethod: 'Offline Payment / CASH'
        })
      });
      
      const appointmentData = await appointmentResponse.json();
      console.log('✅ Appointment creation:', appointmentData.success ? 'SUCCESS' : 'FAILED');
      if (!appointmentData.success) {
        console.log('❌ Appointment error:', appointmentData.error);
      } else {
        console.log('📅 Appointment number:', appointmentData.appointment.appointmentNumber);
      }
      
      console.log('\n🎉 All tests completed!');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

simpleTest();
