// Simple test script to verify API endpoints
const fetch = require('node-fetch');

const API_BASE = 'http://localhost:4242/api';

async function testAPI() {
  console.log('🧪 Testing Backend API Integration...\n');

  try {
    const testEmail = `test${Date.now()}@example.com`;

    // Test 1: Register a new user
    console.log('1️⃣ Testing User Registration...');
    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullname: 'Test User',
        email: testEmail,
        mobile: '1234567890',
        password: 'password123',
        type: 'Customer'
      })
    });
    
    const registerData = await registerResponse.json();
    console.log('Registration Response:', registerData);
    
    if (registerData.success) {
      console.log('✅ Registration successful!');
      const token = registerData.token;
      
      // Test 2: Login with the same user
      console.log('\n2️⃣ Testing User Login...');
      const loginResponse = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: 'password123',
          type: 'Customer'
        })
      });
      
      const loginData = await loginResponse.json();
      console.log('Login Response:', loginData);
      
      if (loginData.success) {
        console.log('✅ Login successful!');
        
        // Test 3: Get user profile
        console.log('\n3️⃣ Testing Get Profile...');
        const profileResponse = await fetch(`${API_BASE}/auth/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const profileData = await profileResponse.json();
        console.log('Profile Response:', profileData);
        
        if (profileData.success) {
          console.log('✅ Profile retrieval successful!');
          
          // Test 4: Create an order
          console.log('\n4️⃣ Testing Order Creation...');
          const orderResponse = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
              items: [
                {
                  productId: 'test-product-1',
                  name: 'Test Medicine',
                  price: 100,
                  quantity: 2,
                  image: 'test-image.jpg'
                }
              ],
              totalAmount: 200,
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
          console.log('Order Response:', orderData);
          
          if (orderData.success) {
            console.log('✅ Order creation successful!');
            
            // Test 5: Get user orders
            console.log('\n5️⃣ Testing Get Orders...');
            const ordersResponse = await fetch(`${API_BASE}/orders/my-orders`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const ordersData = await ordersResponse.json();
            console.log('Orders Response:', ordersData);
            
            if (ordersData.success) {
              console.log('✅ Orders retrieval successful!');
              
              // Test 6: Create an appointment
              console.log('\n6️⃣ Testing Appointment Creation...');
              const appointmentResponse = await fetch(`${API_BASE}/appointments`, {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                  patientName: 'Test Patient',
                  email: testEmail,
                  phone: '1234567890',
                  dateOfBirth: '1990-01-01',
                  gender: 'Male',
                  consultationType: 'General Consultation',
                  preferredDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
                  symptoms: 'Test symptoms',
                  consultationFee: 300,
                  paymentMethod: 'Offline Payment / CASH'
                })
              });
              
              const appointmentData = await appointmentResponse.json();
              console.log('Appointment Response:', appointmentData);
              
              if (appointmentData.success) {
                console.log('✅ Appointment creation successful!');
                
                // Test 7: Get user appointments
                console.log('\n7️⃣ Testing Get Appointments...');
                const appointmentsResponse = await fetch(`${API_BASE}/appointments/my-appointments`, {
                  headers: { 'Authorization': `Bearer ${token}` }
                });
                
                const appointmentsData = await appointmentsResponse.json();
                console.log('Appointments Response:', appointmentsData);
                
                if (appointmentsData.success) {
                  console.log('✅ Appointments retrieval successful!');
                  console.log('\n🎉 ALL TESTS PASSED! Backend integration is working correctly.');
                } else {
                  console.log('❌ Appointments retrieval failed');
                }
              } else {
                console.log('❌ Appointment creation failed');
              }
            } else {
              console.log('❌ Orders retrieval failed');
            }
          } else {
            console.log('❌ Order creation failed');
          }
        } else {
          console.log('❌ Profile retrieval failed');
        }
      } else {
        console.log('❌ Login failed');
      }
    } else {
      console.log('❌ Registration failed');
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.log('\n🔧 Possible issues:');
    console.log('- Backend server not running (run: node backend/server.js)');
    console.log('- MongoDB not connected');
    console.log('- Port 4242 not accessible');
  }
}

// Run the test
testAPI();
