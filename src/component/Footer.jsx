import React from "react";
import "./Footer.css"; // Import the CSS file
import logo  from "../assets/logo/pharmalogo.png"; // Adjust the path as necessary

const Footer = () => {
  const linkSections = [
    {
      title: "Quick Links",
      links: ["Home", "Best Sellers", "Offers & Deals", "Contact Us", "FAQs"],
    },
    {
      title: "Need Help?",
      links: [
        "Delivery Information",
        "Return & Refund Policy",
        "Payment Methods",
        "Track your Order",
        "Contact Us",
      ],
    },
    {
      title: "Follow Us",
      links: ["Instagram", "Twitter", "Facebook", "YouTube"],
    },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          {/* Logo + Description */}
          <div className="footer-brand">
            <div className="footer-logo">
              <img
                src = {logo} 
                alt="brand"
              />
              <h2 className="footer-brand-name">PharmaCart</h2>
            </div>
            <p className="footer-description">
             "PharmaCart is your trusted online destination for quality medicines, health products, and wellness essentials — delivered fast, safe, and reliably to your doorstep."


            </p>
          </div>

          {/* Links */}
          <div className="footer-links">
            {linkSections.map((section, index) => (
              <div key={index} className="footer-section">
                <h3 className="footer-section-title">{section.title}</h3>
                <ul>
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a href="#" className="footer-link">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <p className="footer-bottom">
          Copyright 2025 © PrebuiltUI All Right Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
