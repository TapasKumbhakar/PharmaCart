import React from 'react';
import './Card-Container.css';
import { useNavigate } from 'react-router-dom';
// import paracetamolImg from '../assets/medicines/paracetamol-500-mg-tablet.png';
// import ibuprofenImg from '../assets/medicines/ibuprofen-400mg-tablets-1740783905Ibuprofen-400mg-Tablets.png';
// import amoxicillinImg from '../assets/medicines/amoxicillin.png';
// import cetirizineImg from '../assets/medicines/cetirizine.png';
// import metforminImg from '../assets/medicines/metformin.png';
// import azithromycinImg from '../assets/medicines/azithromycin.png';

const defaultProducts = [
  // {
  //   id: 1,
  //   name: 'Paracetamol',
  //   desc: 'Pain reliever and a fever reducer.',
  //   img: paracetamolImg,
  //   price: 'MRP ₹30'
  // },
  // {
  //   id: 2,
  //   name: 'Ibuprofen',
  //   desc: 'Nonsteroidal anti-inflammatory drug (NSAID).',
  //   img: ibuprofenImg,
  //   price: 'MRP ₹45'
  // },
  // {
  //   id: 3,
  //   name: 'Amoxicillin',
  //   desc: 'Antibiotic used to treat bacterial infections.',
  //   img: amoxicillinImg,
  //   price: 'MRP ₹120'
  // },
  // {
  //   id: 4,
  //   name: 'Cetirizine',
  //   desc: 'Antihistamine used for allergy relief.',
  //   img: cetirizineImg,
  //   price: 'MRP ₹25'
  // },
  // {
  //   id: 5,
  //   name: 'Metformin',
  //   desc: 'Used to treat type 2 diabetes.',
  //   img: metforminImg,
  //   price: 'MRP ₹60'
  // },
  // {
  //   id: 6,
  //   name: 'Azithromycin',
  //   desc: 'Antibiotic for various bacterial infections.',
  //   img: azithromycinImg,
  //   price: 'MRP ₹150'
  // },
];

export default function CardContainer(props) {
  const navigate = useNavigate();
  const products = Array.isArray(props.product) && props.product.length > 0 ? props.product : defaultProducts;

  return (
    <div className="card-container">
      <div className="banner-section" style={{background: 'linear-gradient(90deg, #059669 60%, #34d399 100%)'}}>
        <h1>Medicines</h1>
        <p>Order genuine medicines and health essentials online, delivered to your door.</p>
      </div>
      {/* <h2>Medicine</h2> */}
      <div className="card-list">
        {products.map(product => (
          <div className="card" key={product.id} onClick={() => navigate(`/id/${product.id}`)}>
            <div className="img-box">
              <img src={product.img} alt={product.name} style={{maxWidth: '100%', maxHeight: '100%', borderRadius: 8}} />
            </div>
            <div className='card-container-content'>
              <h3>{product.name}</h3>
              <p>{product.desc}</p>
              <p style={{fontWeight: 600, color: '#4f46e5', margin: '8px 0'}}>{product.price}</p>
              {/* <button className="add-to-cart-btn">Add to Cart</button> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
