import React, { useRef } from "react";
import "./Store.css";

const stores = [
  {
    name: "Pharma Cart - Kakdwip",
    location: "Near Bus Stand, Kakdwip, West Bengal, PIN - 743347",
    whatsapp: "+919812345678",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29497.6890193932!2d88.1705205!3d22.0881826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a025a6e758c9e55%3A0xa75119e4fbbac2ce!2sKakdwip%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1690891288556!5m2!1sen!2sin",
  },
  {
    name: "Pharma Cart - Kolkata",
    location: "Park Street, Kolkata, West Bengal, PIN- 700016",
    whatsapp: "+919876543210",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.035610837508!2d88.3486335!3d22.5576271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0277b700000001%3A0xa5c1445f7df5a3b0!2sPark%20Street%2C%20Kolkata!5e0!3m2!1sen!2sin!4v1690891388888!5m2!1sen!2sin",
  },
];

const Store = () => {
  const formRefs = useRef([]);

  const handleSubmit = (e, storeName, idx) => {
    e.preventDefault();
    const form = formRefs.current[idx];
    const inputs = form.querySelectorAll("input");
    const data = {
      store: storeName,
      name: inputs[0].value,
      phone: inputs[1].value,
      pickupTime: inputs[2].value,
      prescription: inputs[3].files[0]?.name || "No file",
    };
    // eslint-disable-next-line no-alert
    alert(
      `Pickup reserved at ${data.store} for ${data.name}\nPrescription: ${data.prescription}`
    );
    form.reset();
  };

  return (
    <div className="store-list">
      {stores.map((store, idx) => (
        <div className="store-card" key={store.name}>
          <h3>{store.name}</h3>
          <p>{store.location}</p>
          <div className="button-group">
            <a
              className="whatsapp-btn"
              href={`https://wa.me/${store.whatsapp.replace("+", "")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact on WhatsApp
            </a>
            <a
              className="maps-btn"
              href={store.mapEmbed.replace("/embed?", "/?")}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on Google Maps
            </a>
          </div>
          <iframe
            className="store-map"
            src={store.mapEmbed}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            title={store.name}
          ></iframe>
          <form
            className="pickup-form"
            ref={el => (formRefs.current[idx] = el)}
            onSubmit={e => handleSubmit(e, store.name, idx)}
            data-store={store.name}
          >
            <h4>Reserve for Pickup</h4>
            <input type="text" placeholder="Your Name" required />
            <input type="tel" placeholder="Phone Number" required />
            <input type="datetime-local" required />
            <label className="upload-label">Upload Prescription</label>
            <input type="file" accept=".jpg,.png,.pdf" required />
            <button type="submit">Book Pickup</button>
          </form>
        </div>
      ))}
    </div>
  );
};

export default Store;
