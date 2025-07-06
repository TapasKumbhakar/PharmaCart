import React ,{useEffect , useState} from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
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
import paracetamolImg from './assets/medicines/paracetamol-500-mg-tablet.png';
import ibuprofenImg from './assets/medicines/ibuprofen-400mg-tablets-1740783905Ibuprofen-400mg-Tablets.png';
import amoxicillinImg from './assets/medicines/amoxicillin-capsules-500mg.png';
import cetirizineImg from './assets/medicines/Cetirizine-HCl-10-mg-Tablet.png';
import metforminImg from './assets/medicines/metformin-500mg.png';
import azithromycinImg from './assets/medicines/azithromycin - Copy.png';
import Pantoprazole from './assets/medicines/pantoprazole.png';
import Ciprofloxacin from './assets/medicines/ciprofloxacin.png';
import Montelukast from './assets/medicines/Montelkast.png';
import Aspirin from './assets/medicines/images.jpeg';
import Loratadine from './assets/medicines/lornasin-10-tab-500x500.webp';

function App() {
  const products = [
    {
      id: 1,
      name: 'Paracetamol',
      desc: 'Pain reliever and a fever reducer.',
      img: paracetamolImg,
      price: 'MRP ₹30'
    },
    {
      id: 2,
      name: 'Ibuprofen',
      desc: 'Nonsteroidal anti-inflammatory drug (NSAID).',
      img: ibuprofenImg,
      price: 'MRP ₹45'
    },
    {
      id: 3,
      name: 'Amoxicillin',
      desc: 'Antibiotic used to treat bacterial infections.',
      img: amoxicillinImg,
      price: 'MRP ₹120'
    },
    {
      id: 4,
      name: 'Cetirizine',
      desc: 'Antihistamine used for allergy relief.',
      img: cetirizineImg,
      price: 'MRP ₹25'
    },
    {
      id: 5,
      name: 'Metformin',
      desc: 'Used to treat type 2 diabetes.',
      img: metforminImg,
      price: 'MRP ₹60'
    },
    {
      id: 6,
      name: 'Azithromycin',
      desc: 'Antibiotic for various bacterial infections.',
      img: azithromycinImg,
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
      img: Aspirin,
      price: 'MRP ₹40'
    },
    {
      id: 9,
      name: 'Ciprofloxacin',
      desc: 'Antibiotic for bacterial infections.',
      img: Ciprofloxacin,
      price: 'MRP ₹110'
    },
    {
      id: 10,
      name: 'Loratadine',
      desc: 'Antihistamine for allergy relief.',
      img: Loratadine,
      price: 'MRP ₹28'
    },
    {
      id: 11,
      name: 'Pantoprazole',
      desc: 'Reduces stomach acid, used for GERD.',
      img: Pantoprazole,
      price: 'MRP ₹55'
    },
    {
      id: 12,
      name: 'Montelukast',
      desc: 'Used for allergies and asthma.',
      img: Montelukast,
      price: 'MRP ₹90'
    },
  ];

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
      />
      <Routes>
        <Route path = "/" element ={<Home products={products}/>}  />
        <Route path = "/Card-Container" element ={<CardContainer product={products}/>}  />
        <Route path = "/login" element ={<Login />}  />
        <Route path = "/register" element ={<Signup />} />
        <Route path = "/cart" element ={<Cart />}  />
        <Route path = "/id/:id" element ={<Product product={products}/>}  />
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
