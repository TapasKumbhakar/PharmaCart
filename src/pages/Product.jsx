
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './Product.css';

export default function Product(props) {
  const { id } = useParams();
  const p = props.product;
  const [added, setAdded] = useState(false);
  const get = p.find((p) => p.id === parseInt(id, 10));
  const cartItem = Array.isArray(props.cartItems) ? props.cartItems.find((item) => item.id === get?.id) : null;

  if (!get) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#e11d48', fontWeight: 600 }}>
        Product not found.
      </div>
    );
  }

  const handleAddToCart = () => {
    if (props.addToCart) {
      props.addToCart(get);
      setAdded(true);
      setTimeout(() => setAdded(false), 1000);
    }
  };

  return (
    <div className="product-container">
      <img className="product-image" src={get.img} alt={get.name} />
      <h1 className="product-title">{get.name}</h1>
      <p>Description</p>
      <p className="product-desc">{get.desc}</p>
      <p className="product-price">Price: {get.price}</p>
      <div className="product-qty-controls" style={{justifyContent:'center', marginBottom:16}}>
        {(!cartItem || cartItem.quantity === 0) ? (
          <button className="product-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        ) : (
          <>
            <button className="product-qty-btn" onClick={() => props.decreaseQuantity && props.decreaseQuantity(get.id)}>-</button>
            <span className="product-qty-value">{cartItem.quantity}</span>
            <button className="product-qty-btn plus" onClick={() => props.increaseQuantity && props.increaseQuantity(get.id)}>+</button>
          </>
        )}
      </div>
      {added && (
        <div style={{marginTop: 8, color: '#059669', fontWeight: 600, fontSize: 16, background: '#e0f7ef', padding: '8px 18px', borderRadius: 8}}>
          Your medicine has been added to cart.
        </div>
      )}
    </div>
  );
}
