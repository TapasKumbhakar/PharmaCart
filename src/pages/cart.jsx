import React from 'react';
import './cart.css';

export default function Cart() {
  return (
    <div className="cart-container">
      <div className="cart-content">
        <h2>Your Cart </h2>
        <p>0 items in your cart.</p>
        <p>You should add items..</p>
      </div>
    </div>
  );
}
