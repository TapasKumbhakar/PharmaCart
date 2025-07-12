// backend/server.js
// Simple Express backend for Stripe Checkout integration

const express = require('express');
const app = express();
const stripe = require('stripe')('sk_test_51RjgmqHFDC5C5ZfovoYeMvzF8emqPenxf9iA16UUYKjcaf1ZZf0fQCeYgs2d7gXQtr6xDKCQv7TXnDjhtfDR01ZY00PPAAX8G5'); // Replace with your Stripe Secret Key
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const { cartItems, shippingFee } = req.body;
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
      success_url: 'http://localhost:3000/payment-success',
      cancel_url: 'http://localhost:3000/cart',
    });
    console.log('Stripe session created:', session.id);
    res.json({ id: session.id });
  } catch (err) {
    console.error('Stripe session error:', err);
    res.status(500).json({ error: err.message, details: err });
  }
});

// --- Simple in-memory user store for demo ---
const users = [];

// Registration route
app.post('/api/register', (req, res) => {
  const { fullname, mobile, email, password, type } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  users.push({ fullname, mobile, email, password, type });
  res.json({ success: true });
});

// Login route
app.post('/api/login', (req, res) => {
  const { email, password, type } = req.body;
  const user = users.find(u => u.email === email && u.password === password && u.type === type);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ success: true, user });
});

app.listen(4242, () => console.log('Server running on port 4242'));
