import React from 'react';
import './AdminPanel.css';

export default function AdminPanel() {
  return (
    <div className="admin-panel" style={{ padding: '32px', maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 32 }}>Admin Dashboard</h1>
      <div className="admin-sections" style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* Section 1: Customer Ordered Medicine */}
        <div className="admin-section" style={{ background: '#f3f4f6', borderRadius: 12, padding: 24, minWidth: 260, flex: 1 }}>
          <h2>Customer Ordered Medicine</h2>
          <ul style={{ marginTop: 16 }}>
            <li>Order #1001 - Paracetamol 500mg x 2 (Customer: Riya)</li>
            <li>Order #1002 - Amoxicillin 250mg x 1 (Customer: Aman)</li>
            <li>Order #1003 - Ibuprofen 400mg x 3 (Customer: Priya)</li>
          </ul>
        </div>
        {/* Section 2: Customer Booked Appointment */}
        <div className="admin-section" style={{ background: '#f3f4f6', borderRadius: 12, padding: 24, minWidth: 260, flex: 1 }}>
          <h2>Customer Booked Appointment</h2>
          <ul style={{ marginTop: 16 }}>
            <li>Appointment #A101 - Dr. Sharma (Customer: Riya, 12 July 2025)</li>
            <li>Appointment #A102 - Dr. Verma (Customer: Aman, 13 July 2025)</li>
            <li>Appointment #A103 - Dr. Gupta (Customer: Priya, 14 July 2025)</li>
          </ul>
        </div>
        {/* Section 3: Customers Uploaded Prescription */}
        <div className="admin-section" style={{ background: '#f3f4f6', borderRadius: 12, padding: 24, minWidth: 260, flex: 1 }}>
          <h2>Customers Uploaded Prescription</h2>
          <ul style={{ marginTop: 16 }}>
            <li>Prescription #P201 - Riya (Uploaded: 10 July 2025)</li>
            <li>Prescription #P202 - Aman (Uploaded: 11 July 2025)</li>
            <li>Prescription #P203 - Priya (Uploaded: 12 July 2025)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
