// backend/server.js
// Express backend with MongoDB integration for PharmaCart

const express = require('express');
const app = express();
const stripe = require('stripe')('sk_test_51RjgmqHFDC5C5ZfovoYeMvzF8emqPenxf9iA16UUYKjcaf1ZZf0fQCeYgs2d7gXQtr6xDKCQv7TXnDjhtfDR01ZY00PPAAX8G5'); // Replace with your Stripe Secret Key
const cors = require('cors');
const connectDB = require('./configs/database');

// Import routes
const authRoutes = require('./routers/authRoutes');
const orderRoutes = require('./routers/orderRoutes');
const appointmentRoutes = require('./routers/appointmentRoutes');
const medicalRecordRoutes = require('./routers/medicalRecordRoutes');

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/appointments', appointmentRoutes);

// Test route directly in server
app.get('/api/medical-records/test-direct', (req, res) => {
  res.json({ success: true, message: 'Direct route working!' });
});

app.use('/api/medical-records', medicalRecordRoutes);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

app.post('/create-checkout-session', async (req, res) => {
  const { cartItems, shippingFee, userId, orderData } = req.body;
  const line_items = cartItems.map(item => {
    // Extract number from price string (e.g., "MRP ₹30")
    let price = 0;
    if (typeof item.price === 'string') {
      const match = item.price.match(/(\d+)/);
      if (match) price = Number(match[1]);
    } else if (typeof item.price === 'number') {
      price = item.price;
    }
    return {
      price_data: {
        currency: 'inr',
        product_data: { name: item.name },
        unit_amount: Math.round(Number(price) * 100),
      },
      quantity: item.quantity,
    };
  });

  // Add shipping fee as a line item if applicable
  if (shippingFee && shippingFee > 0) {
    line_items.push({
      price_data: {
        currency: 'inr',
        product_data: { name: 'Shipping Fee (one-time charge)' },
        unit_amount: Math.round(Number(shippingFee) * 100),
      },
      quantity: 1,
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: 'http://localhost:3000/cart',
      metadata: {
        userId: userId || '',
        orderType: orderData?.type || 'order'
      }
    });
    console.log('Stripe session created:', session.id);
    res.json({ id: session.id });
  } catch (err) {
    console.error('Stripe session error:', err);
    res.status(500).json({ error: err.message, details: err });
  }
});

// Webhook endpoint for Stripe (optional - for handling successful payments)
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment successful:', session.id);
      // Here you can update order/appointment status in database
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

app.listen(4242, () => console.log('Server running on port 4242'));
