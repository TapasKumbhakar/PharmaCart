// Simple test for order creation
const fetch = require('node-fetch');

async function testOrder() {
  try {
    // First register a user
    const registerResponse = await fetch('http://localhost:4242/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullname: 'Test User',
        email: 'test@example.com',
        mobile: '1234567890',
        password: 'password123',
        type: 'Customer'
      })
    });

    const registerData = await registerResponse.json();
    console.log('Register response:', registerData);

    if (!registerData.success) {
      // If registration fails, try to login
      const loginResponse = await fetch('http://localhost:4242/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
          type: 'Customer'
        })
      });

      const loginData = await loginResponse.json();
      console.log('Login response:', loginData);
      var token = loginData.token;
    } else {
      var token = registerData.token;
    }

    if (token) {
      
      // Now try to create an order
      const orderResponse = await fetch('http://localhost:4242/api/orders', {
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
      console.log('Order response:', orderData);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testOrder();
