import React, { useState } from 'react';
import { Route, Routes } from "react-router-dom";
import Login from './component/login';
import Signup from './admin/signup';
import Navbar from './component/Navbar';
import Cart from './pages/cart';
import Home from './pages/Home';
import CardContainer from './component/Card-Container';
import Product from './pages/Product';
import Contact from './pages/contact';
import Doctors from './pages/Doctors';
import Store from './pages/store';
import DoctorConsultationForm from './pages/DoctorConsultationForm';
import Upload from './pages/upload';
import dolo650Img from './assets/medicines/dolo-paracetamol-650mg.webp';

function App() {
  const products = [
    {
      id: 1,
      name: 'Paracetamol',
      desc: 'Pain reliever and a fever reducer.',
      img: 'data:image/jpeg;base64,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',
      price: 'MRP ₹30'
    },
    {
      id: 2,
      name: 'Ibuprofen',
      desc: 'Nonsteroidal anti-inflammatory drug (NSAID).',
      img: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=400&q=80',
      price: 'MRP ₹45'
    },
    {
      id: 3,
      name: 'Amoxicillin',
      desc: 'Antibiotic used to treat bacterial infections.',
      img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
      price: 'MRP ₹120'
    },
    {
      id: 4,
      name: 'Cetirizine',
      desc: 'Antihistamine used for allergy relief.',
      img: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=400&q=80',
      price: 'MRP ₹25'
    },
    {
      id: 5,
      name: 'Metformin',
      desc: 'Used to treat type 2 diabetes.',
      img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
      price: 'MRP ₹60'
    },
    {
      id: 6,
      name: 'Azithromycin',
      desc: 'Antibiotic for various bacterial infections.',
      img: 'https://images.unsplash.com/photo-1510626176961-4b57d4fbad04?auto=format&fit=crop&w=400&q=80',
      price: 'MRP ₹150'
    },
    {
      id: 7,
      name: 'Dolo 650',
      desc: 'Commonly used for fever and mild pain.',
      img:  dolo650Img ,
      price: 'MRP ₹35'
    },
    {
      id: 8,
      name: 'Aspirin',
      desc: 'Used to reduce pain, fever, or inflammation.',
      img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
      price: 'MRP ₹40'
    },
    {
      id: 9,
      name: 'Ciprofloxacin',
      desc: 'Antibiotic for bacterial infections.',
      img: 'https://images.unsplash.com/photo-1516815231357-1c1b6e1b8a49?auto=format&fit=crop&w=400&q=80',
      price: 'MRP ₹110'
    },
    {
      id: 10,
      name: 'Loratadine',
      desc: 'Antihistamine for allergy relief.',
      img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
      price: 'MRP ₹28'
    },
    {
      id: 11,
      name: 'Pantoprazole',
      desc: 'Reduces stomach acid, used for GERD.',
      img: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
      price: 'MRP ₹55'
    },
    {
      id: 12,
      name: 'Montelukast',
      desc: 'Used for allergies and asthma.',
      img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      price: 'MRP ₹90'
    },
  ];



  // Cart state with quantity and localStorage persistence
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('pharmacart_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Add to cart handler (increase quantity if exists)
  const addToCart = (product) => {
    setCartItems((prev) => {
      const found = prev.find((item) => item.id === product.id);
      if (found) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Remove from cart handler (remove all)
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Increase quantity
  const increaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrease quantity (remove if 1)
  const decreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Save cart to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('pharmacart_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Search state and logic lifted from Home.jsx
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) {
      setSearchResult(null);
      return;
    }
    const found = products.find(
      (item) => item.name.toLowerCase() === search.trim().toLowerCase()
    );
    setSearchResult(found ? found : 'notfound');
  };

  return (
    <>
      <Navbar
        search={search}
        setSearch={setSearch}
        searchResult={searchResult}
        setSearchResult={setSearchResult}
        handleSearch={handleSearch}
        products={products}
        cartCount={cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)}
      />
      <Routes>
        <Route path = "/" element ={<Home products={products}/>}  />
        <Route path = "/Card-Container" element ={<CardContainer product={products}/>}  />
        <Route path = "/login" element ={<Login />}  />
        <Route path = "/register" element ={<Signup />} />
        <Route path = "/cart" element ={<Cart cartItems={cartItems} removeFromCart={removeFromCart} increaseQuantity={increaseQuantity} decreaseQuantity={decreaseQuantity} />}  />
        <Route path = "/id/:id" element ={<Product product={products} addToCart={addToCart} cartItems={cartItems} increaseQuantity={increaseQuantity} decreaseQuantity={decreaseQuantity} />}  />
        <Route path = "/contact" element ={<Contact />}  />
        <Route path = "/doctors" element ={<Doctors />}  />
        <Route path = "/store" element ={<Store />}  />
        <Route path = "/doctor-consultation" element ={<DoctorConsultationForm />}  />
        <Route path = "/upload" element ={<Upload />}  />
      </Routes>
    </>
  );
}

export default App;
