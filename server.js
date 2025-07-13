const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4242;

// Initialize Stripe with a test key (for demo purposes)
let stripe;
try {
  stripe = require('stripe')('sk_test_51RjgmqHFDC5C5Zfo6KUqHvC1GgIr1fzFgHKk3a2PS0MiTs7mszOPl9VsAW9A9XWRf0MYFGt5a44rjJ8GzGMMvhWu00CeDMj8M2');
  console.log('✅ Stripe initialized successfully');
} catch (error) {
  console.error('❌ Stripe initialization failed:', error.message);
}

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from React app
  credentials: true
}));
app.use(express.json());

// Create checkout session endpoint
app.post('/create-checkout-session', async (req, res) => {
  try {
    console.log('📝 Received request body:', req.body);

    const { cartItems, shippingFee } = req.body;

    // Validate Stripe initialization
    if (!stripe) {
      console.error('❌ Stripe not initialized');
      return res.status(500).json({ error: 'Payment service not available' });
    }

    // Validate cart items
    if (!cartItems || cartItems.length === 0) {
      console.error('❌ Empty cart');
      return res.status(400).json({ error: 'Cart is empty' });
    }

    console.log('✅ Creating checkout session for:', cartItems.length, 'items');

    // Create line items for Stripe
    const lineItems = [];

    for (const item of cartItems) {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 1;
      const unitAmount = Math.round(price * 100); // Convert to paise

      console.log(`📦 Item: ${item.name}, Price: ₹${price}, Quantity: ${quantity}`);

      if (unitAmount <= 0) {
        console.error(`❌ Invalid price for item: ${item.name} - ₹${price}`);
        return res.status(400).json({ error: `Invalid price for item: ${item.name}` });
      }

      lineItems.push({
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.name,
            description: `Medicine - ${item.name}`,
          },
          unit_amount: unitAmount,
        },
        quantity: quantity,
      });
    }

    // Add shipping fee if applicable
    if (shippingFee && shippingFee > 0) {
      console.log(`🚚 Adding shipping fee: ₹${shippingFee}`);
      lineItems.push({
        price_data: {
          currency: 'inr',
          product_data: {
            name: 'Shipping Fee',
            description: 'Delivery charges',
          },
          unit_amount: Math.round(shippingFee * 100),
        },
        quantity: 1,
      });
    }

    console.log('💳 Creating Stripe session with', lineItems.length, 'line items');

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/cart',
      metadata: {
        source: 'pharmacart',
        itemCount: cartItems.length.toString()
      }
    });

    console.log('✅ Checkout session created successfully:', session.id);
    res.json({ id: session.id });

  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    res.status(500).json({
      error: error.message || 'Failed to create checkout session',
      type: error.type || 'unknown_error',
      details: error.stack
    });
  }
});

// Retrieve checkout session (for success page)
app.get('/checkout-session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.json(session);
  } catch (error) {
    console.error('Error retrieving session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook endpoint for Stripe events (optional but recommended for production)
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = 'whsec_...'; // Replace with your webhook secret

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment successful:', session.id);
      // Here you can update your database, send confirmation emails, etc.
      break;
    case 'payment_intent.payment_failed':
      const paymentIntent = event.data.object;
      console.log('Payment failed:', paymentIntent.id);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Stripe server is running!',
    port: PORT,
    endpoints: [
      'POST /create-checkout-session - Create payment session',
      'GET /checkout-session/:sessionId - Retrieve session details',
      'POST /webhook - Stripe webhook handler'
    ],
    stripe: {
      version: stripe.VERSION,
      connected: true
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Stripe server running on http://localhost:${PORT}`);
  console.log('📝 Available endpoints:');
  console.log('   GET  / - Health check');
  console.log('   POST /create-checkout-session - Create payment session');
  console.log('   GET  /checkout-session/:id - Retrieve session');
  console.log('   POST /webhook - Stripe webhook handler');
  console.log('');
  console.log('💳 Stripe Configuration:');
  console.log('   Currency: INR (Indian Rupees)');
  console.log('   Payment Methods: Card');
  console.log('   Success URL: http://localhost:3000/payment-success');
  console.log('   Cancel URL: http://localhost:3000/cart');
  console.log('');
  console.log('🔧 To start the server:');
  console.log('   npm install express cors stripe');
  console.log('   node server.js');
});

module.exports = app;
