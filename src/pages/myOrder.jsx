import React, { useState } from 'react';
import './myOrder.css'; // Optional: For custom styling
import paracetamolImg from '../assets/medicines/paracetamol-500-mg-tablet.png';
import dolo650Img from '../assets/medicines/dolo-paracetamol-650mg.webp'; 

const sampleOrders = [
  {
    id: 1,
    name: 'Paracetamol 500mg',
    date: '2025-07-01',
    status: 'Delivered',
    canReturn: true,
    image: paracetamolImg ,
  },
  {
    id: 2,
    name: 'Dolo 650mg Tablet',
    date: '2025-07-03',
    status: 'Shipped',
    canReturn: false,
    image: dolo650Img,
  },
];

export default function MyOrders() {
  const [ratings, setRatings] = useState({});

  const handleCancel = (id) => {
    alert(`Order #${id} cancelled`);
  };

  const handleReturn = (id) => {
    alert(`Return initiated for Order #${id}`);
  };

  const handleRating = (id, rating) => {
    setRatings({ ...ratings, [id]: rating });
  };

  return (
    <div className="orders-container">
      <h1>My Orders</h1>
      {sampleOrders.map((order) => (
        <div key={order.id} className="order-card">
          <img src={order.image} alt={order.name} />
          <div className="order-details">
            <h2>{order.name}</h2>
            <p><strong>Date:</strong> {order.date}</p>
            <p><strong>Status:</strong> {order.status}</p>
            
            <div className="order-actions">
              {order.status !== 'Delivered' && (
                <button onClick={() => handleCancel(order.id)}>Cancel</button>
              )}
              {order.canReturn && order.status === 'Delivered' && (
                <button onClick={() => handleReturn(order.id)}>Return</button>
              )}
            </div>

            <div className="rating-section">
              <span>Rate Product: </span>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => handleRating(order.id, star)}
                  style={{
                    cursor: 'pointer',
                    color: ratings[order.id] >= star ? '#FFD700' : '#ccc',
                    fontSize: '20px',
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

