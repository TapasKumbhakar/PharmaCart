// Test the Order model directly
const mongoose = require('mongoose');
const Order = require('./backend/models/Order');

async function testModel() {
  try {
    await mongoose.connect('mongodb://localhost:27017/pharmacart');
    console.log('Connected to MongoDB');
    
    // Create a test order
    const order = new Order({
      userId: new mongoose.Types.ObjectId(),
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
    });
    
    console.log('Order before save:', order);
    console.log('Order number before save:', order.orderNumber);
    
    await order.save();
    
    console.log('Order after save:', order);
    console.log('Order number after save:', order.orderNumber);
    
    await mongoose.connection.close();
    console.log('Test completed successfully!');
    
  } catch (error) {
    console.error('Error:', error);
    await mongoose.connection.close();
  }
}

testModel();
