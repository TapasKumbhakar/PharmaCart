import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { medicalRecordAPI } from '../services/api';
import Swal from 'sweetalert2';
import styles from './upload.module.css';

const Upload = () => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [recordType, setRecordType] = useState('Prescription');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setPreviewUrl(null);
      setPreviewType(null);
      return;
    }
    const fileURL = URL.createObjectURL(file);
    if (file.type.startsWith('image/')) {
      setPreviewUrl(fileURL);
      setPreviewType('image');
    } else if (file.type === 'application/pdf') {
      setPreviewUrl(fileURL);
      setPreviewType('pdf');
    } else {
      setPreviewUrl('Unsupported file type');
      setPreviewType('unsupported');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      Swal.fire({
        icon: 'warning',
        title: 'Please log in',
        text: 'You must be logged in to upload medical records.',
        timer: 1800,
        showConfirmButton: false
      });
      setTimeout(() => navigate('/login'), 1800);
      return;
    }

    const file = fileInputRef.current.files[0];
    if (!file) {
      Swal.fire({
        icon: 'warning',
        title: 'No file selected',
        text: 'Please select a file to upload.',
        timer: 1500,
        showConfirmButton: false
      });
      return;
    }

    setLoading(true);

    try {
      // Store the record information in localStorage for now
      const recordData = {
        id: Date.now().toString(),
        patientName: name,
        phone: phone,
        recordType: recordType,
        description: description,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadDate: new Date().toISOString(),
        recordNumber: `MR${Date.now()}`
      };

      // Get existing records from localStorage
      const existingRecords = JSON.parse(localStorage.getItem('medicalRecords') || '[]');
      existingRecords.push(recordData);
      localStorage.setItem('medicalRecords', JSON.stringify(existingRecords));

      Swal.fire({
        icon: 'success',
        title: 'Upload Successful!',
        text: `Medical record uploaded successfully for ${name}`,
        timer: 2000,
        showConfirmButton: false
      });

      // Reset form
      setName('');
      setPhone('');
      setRecordType('Prescription');
      setDescription('');
      setPreviewUrl(null);
      setPreviewType(null);
      fileInputRef.current.value = '';

      // Navigate to medical records page after 2 seconds
      setTimeout(() => navigate('/medical-records'), 2000);

    } catch (error) {
      console.error('Upload error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: 'Failed to upload medical record. Please try again.',
        timer: 2000,
        showConfirmButton: false
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f6fb' }}>
      <div className={styles['upload-container']}>
        <h2 className={styles['upload-title']}>Upload Prescription</h2>
        <form className={styles['upload-form']} onSubmit={handleSubmit}>
          <label htmlFor="name">Name <span style={{color:'red'}}>*</span></label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <label htmlFor="phone">Phone <span style={{color:'red'}}>*</span></label>
          <input
            id="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
          />

          <label htmlFor="recordType">Record Type</label>
          <select
            id="recordType"
            value={recordType}
            onChange={e => setRecordType(e.target.value)}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          >
            <option value="Prescription">Prescription</option>
            <option value="Lab Report">Lab Report</option>
            <option value="X-Ray">X-Ray</option>
            <option value="MRI">MRI</option>
            <option value="CT Scan">CT Scan</option>
            <option value="Other">Other</option>
          </select>

          <label htmlFor="description">Description (Optional)</label>
          <textarea
            id="description"
            placeholder="Add any additional notes about this record"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', resize: 'vertical' }}
          />

          <label htmlFor="file">Upload Medical Record (Image or PDF) <span style={{color:'red'}}>*</span></label>
          <input
            id="file"
            type="file"
            accept="image/*,application/pdf"
            ref={fileInputRef}
            onChange={handleFileChange}
            required
          />
          <div className={styles.preview} style={{ width: '100%' }}>
            {previewType === 'image' && <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: 180, borderRadius: 8 }} />}
            {previewType === 'pdf' && (
              <iframe src={previewUrl} title="PDF Preview" style={{ width: '100%', height: 180, borderRadius: 8, border: 'none' }} />
            )}
            {previewType === 'unsupported' && (
              <span>{previewUrl}</span>
            )}
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Medical Record'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
