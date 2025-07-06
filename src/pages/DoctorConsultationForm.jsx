import React, { useState } from 'react';
import './DoctorConsultationForm.css';

export default function DoctorConsultationForm() {
  const [form, setForm] = useState({
    patientName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    consultationType: '',
    preferredDate: '',
    symptoms: '',
    attachReports: null,
  });

  const handleChange = e => {
    const { name, value, type, files } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // You can handle form submission here (API call, etc.)
    alert('Consultation request submitted!');
    setForm({
      patientName: '', email: '', phone: '', dob: '', gender: '', consultationType: '', preferredDate: '', symptoms: '', attachReports: null
    });
  };

  return (
    <div className="doctor-consultation-form-bg">
      <h1>Doctor Consultation Form</h1>
      <form className="doctor-consultation-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="patientName">Patient Name:</label>
          <input type="text" id="patientName" name="patientName" value={form.patientName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address:</label>
          <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number:</label>
          <input type="tel" id="phone" name="phone" value={form.phone} onChange={handleChange} required placeholder="+91-9876543210" />
        </div>
        <div className="form-group">
          <label htmlFor="dob">Date of Birth:</label>
          <input type="date" id="dob" name="dob" value={form.dob} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="gender">Gender:</label>
          <select id="gender" name="gender" value={form.gender} onChange={handleChange} required>
            <option value="">--Select--</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="consultationType">Consultation Type:</label>
          <select id="consultationType" name="consultationType" value={form.consultationType} onChange={handleChange} required>
            <option value="">--Select--</option>
            <option value="inperson">In‑Person</option>
            <option value="online">Online / Tele‑Consultation</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="preferredDate">Preferred Appointment Date:</label>
          <input type="date" id="preferredDate" name="preferredDate" value={form.preferredDate} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="symptoms">Brief Description of Symptoms / Reason for Consultation:</label>
          <textarea id="symptoms" name="symptoms" value={form.symptoms} onChange={handleChange} required></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="attachReports">Attach Medical Reports (optional):</label>
          <input type="file" id="attachReports" name="attachReports" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} />
        </div>
        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
}
