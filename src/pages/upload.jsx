import React, { useRef, useState } from 'react';
import styles from './upload.module.css';

const Upload = () => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const fileInputRef = useRef();


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

  const handleSubmit = (e) => {
    e.preventDefault();
    const file = fileInputRef.current.files[0];
    if (!file) {
      alert('Please upload a file.');
      return;
    }
    alert(`Prescription uploaded successfully for ${name}`);
    setName('');
    setPhone('');
    setPreviewUrl(null);
    setPreviewType(null);
    fileInputRef.current.value = '';
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
          <label htmlFor="file">Upload Prescription (Image or PDF) <span style={{color:'red'}}>*</span></label>
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
          <button type="submit">Upload</button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
