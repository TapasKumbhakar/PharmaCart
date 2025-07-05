import React from 'react'
import { useParams } from 'react-router-dom'
import './Product.css'

export default function Product(props) {
     const {id} = useParams();
     const p = props.product;
     const get = p.find((p) => p.id === parseInt(id,10));
     if (!get) {
        return <div style={{padding: '40px', textAlign: 'center', color: '#e11d48', fontWeight: 600}}>Product not found.</div>;
     }
  return (
    <div className="product-container">
        <img className="product-image" src={get.img} alt={get.name} />
        <h1 className="product-title">{get.name}</h1>
        <p className="product-desc">{get.desc}</p>
        <p className="product-price">Price: {get.price}</p>
        <button className="product-btn">Add to Cart</button>
    </div>
  )
}
