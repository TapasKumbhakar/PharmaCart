
import React from 'react';
import './cart.css';

export default function Cart({ cartItems = [], removeFromCart, increaseQuantity, decreaseQuantity }) {
  return (
    <div className="cart-container">
      <div className="cart-content">
        <h2>Your Cart</h2>
        {cartItems.length === 0 ? (
          <>
            <p>0 items in your cart.</p>
            <p>You should add items..</p>
          </>
        ) : (
          <>
            <p>{cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)} item(s) in your cart.</p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {cartItems.map((item) => (
                <li key={item.id} style={{ marginBottom: 20, borderBottom: '1px solid #eee', paddingBottom: 10, display: 'flex', alignItems: 'center' }}>
                  <img src={item.img} alt={item.name} style={{ width: 60, height: 60, objectFit: 'contain', borderRadius: 8, marginRight: 16 }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 600 }}>{item.name}</span> <span style={{ color: '#059669', fontWeight: 500 }}>{item.price}</span>
                    <div style={{ color: '#555', fontSize: 14 }}>{item.desc}</div>
                  </div>
                  <div className="product-qty-controls" style={{justifyContent:'center', marginRight: 10}}>
                    <button className="product-qty-btn" onClick={() => decreaseQuantity && decreaseQuantity(item.id)}>-</button>
                    <span className="product-qty-value">{item.quantity}</span>
                    <button className="product-qty-btn plus" onClick={() => increaseQuantity && increaseQuantity(item.id)}>+</button>
                  </div>
                  <button
                    onClick={() => removeFromCart && removeFromCart(item.id)}
                    style={{
                      background: '#ef4444',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '6px 14px',
                      marginLeft: 12,
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
