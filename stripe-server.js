const express = require('express');
const cors = require('cors');
// Use environment variable or fallback to test key
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_51RjgmqHFDC5C5Zfo6KUqHvC1GgIr1fzFgHKk3a2PS0MiTs7mszOPl9VsAW9A9XWRf0MYFGt5a44rjJ8GzGMMvhWu00CeDMj8M2';
const stripe = require('stripe')(STRIPE_SECRET_KEY);

const app = express();
const PORT = 4242;

// Middleware
app.use(cors());
app.use(express.json());

// Create checkout session endpoint
app.post('/create-checkout-session', async (req, res) => {
  try {
    console.log('📝 Received checkout session request:', JSON.stringify(req.body, null, 2));

    const { cartItems, shippingFee, orderData, successUrl, cancelUrl } = req.body;

    // Validate required fields
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      throw new Error('Cart items are required and must be a non-empty array');
    }

    // Calculate total amount
    const itemsTotal = cartItems.reduce((sum, item) => {
      const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
      const quantity = item.quantity || 1;
      return sum + (price * quantity);
    }, 0);

    const totalAmount = itemsTotal + (shippingFee || 0);
    console.log('💰 Calculated total amount:', totalAmount);

    // Create line items for Stripe
    const lineItems = cartItems.map(item => {
      const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
      const quantity = item.quantity || 1;

      return {
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.name || 'Unknown Item',
          },
          unit_amount: Math.round(price * 100), // Convert to paise
        },
        quantity: quantity,
      };
    });

    // Add shipping fee if applicable
    if (shippingFee && shippingFee > 0) {
      lineItems.push({
        price_data: {
          currency: 'inr',
          product_data: {
            name: 'Shipping Fee',
          },
          unit_amount: Math.round(shippingFee * 100),
        },
        quantity: 1,
      });
    }

    console.log('📦 Line items for Stripe:', JSON.stringify(lineItems, null, 2));

    // Determine success and cancel URLs based on order type
    let sessionSuccessUrl = successUrl || 'http://localhost:3000/payment-success';
    let sessionCancelUrl = cancelUrl || 'http://localhost:3000/cart';

    // If this is an appointment payment, use appropriate URLs
    if (orderData && orderData.type === 'appointment') {
      sessionSuccessUrl = successUrl || 'http://localhost:3000/payment-success?type=appointment';
      sessionCancelUrl = cancelUrl || 'http://localhost:3000/doctor-consultation';
    }

    console.log('🔗 Success URL:', sessionSuccessUrl);
    console.log('🔗 Cancel URL:', sessionCancelUrl);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${sessionSuccessUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: sessionCancelUrl,
      metadata: {
        totalAmount: totalAmount.toString(),
        itemCount: cartItems.length.toString(),
        orderType: orderData?.type || 'order',
        ...(orderData?.type === 'appointment' && {
          patientName: orderData.appointmentData?.patientName || '',
          consultationType: orderData.appointmentData?.consultationType || ''
        })
      }
    });

    console.log('✅ Stripe session created successfully:', session.id);
    res.json({ id: session.id });
  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    console.error('Error details:', {
      message: error.message,
      type: error.type,
      code: error.code,
      stack: error.stack
    });
    res.status(500).json({
      error: error.message,
      type: error.type || 'unknown_error',
      details: 'Check server logs for more information'
    });
  }
});

// Get checkout session details endpoint
app.get('/checkout-session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    res.json({
      id: session.id,
      payment_intent: session.payment_intent,
      amount_total: session.amount_total,
      currency: session.currency,
      payment_status: session.payment_status,
      metadata: session.metadata
    });
  } catch (error) {
    console.error('Error retrieving session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test Stripe connection endpoint
app.get('/test-stripe', async (req, res) => {
  try {
    // Test Stripe connection by listing payment methods
    const paymentMethods = await stripe.paymentMethods.list({
      type: 'card',
      limit: 1,
    });

    res.json({
      message: 'Stripe connection successful!',
      stripe_connected: true,
      api_version: stripe.VERSION
    });
  } catch (error) {
    console.error('Stripe connection test failed:', error);
    res.status(500).json({
      message: 'Stripe connection failed',
      stripe_connected: false,
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Stripe server is running!',
    port: PORT,
    endpoints: [
      'GET /test-stripe',
      'POST /create-checkout-session',
      'GET /checkout-session/:sessionId'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 Stripe server starting...');
  console.log(`📍 Server running on http://localhost:${PORT}`);
  console.log('📝 Available endpoints:');
  console.log('   GET  / - Health check');
  console.log('   POST /create-checkout-session - Create payment session');
  console.log('   GET  /checkout-session/:sessionId - Get session details');
  console.log('');
  console.log('🔑 Stripe configuration:');
  console.log('   Using test secret key:', stripe.apiKey ? 'sk_test_***' : 'NOT SET');
  console.log('   Ready to accept payments!');
  console.log('');
  console.log('💡 Test cards:');
  console.log('   Success: 4242 4242 4242 4242');
  console.log('   Declined: 4000 0000 0000 0002');
  console.log('   Expired: 4000 0000 0000 0069');
});

module.exports = app;
