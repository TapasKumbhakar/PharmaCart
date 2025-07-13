import React, { useState, useEffect } from 'react';
import { medicalRecordAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './myOrder.css'; // Reusing the same styles

export default function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Fetch user medical records on component mount
  useEffect(() => {
    const fetchRecords = () => {
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }

      try {
        // Get records from localStorage
        const allRecords = JSON.parse(localStorage.getItem('medicalRecords') || '[]');

        // Filter records if needed
        let filteredRecords = allRecords;
        if (filter) {
          filteredRecords = allRecords.filter(record => record.recordType === filter);
        }

        setRecords(filteredRecords);
      } catch (error) {
        console.error('Failed to fetch medical records:', error);
        Swal.fire({
          icon: 'error',
          title: 'Failed to load records',
          text: 'Could not load your medical records. Please try again.',
          timer: 2000,
          showConfirmButton: false
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [isLoggedIn, filter]);

  const handleDownload = (recordId, fileName) => {
    Swal.fire({
      icon: 'info',
      title: 'Download Feature',
      text: 'File download will be available when full file upload is implemented.',
      timer: 2000,
      showConfirmButton: false
    });
  };

  const handleDelete = async (recordId) => {
    try {
      const result = await Swal.fire({
        title: 'Delete Medical Record?',
        text: 'Are you sure you want to delete this medical record?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        // Remove from localStorage
        const allRecords = JSON.parse(localStorage.getItem('medicalRecords') || '[]');
        const updatedRecords = allRecords.filter(record => record.id !== recordId);
        localStorage.setItem('medicalRecords', JSON.stringify(updatedRecords));

        // Update local state
        setRecords(records.filter(record => record.id !== recordId));

        Swal.fire({
          icon: 'success',
          title: 'Record Deleted',
          text: 'Your medical record has been deleted successfully.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Delete record error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Deletion Failed',
        text: 'Failed to delete record. Please try again.',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return '🖼️';
    } else if (fileType === 'application/pdf') {
      return '📄';
    }
    return '📎';
  };

  if (!isLoggedIn) {
    return (
      <div className="orders-container">
        <h1>My Medical Records</h1>
        <div style={{ textAlign: 'center', marginTop: 50 }}>
          <p>Please log in to view your medical records.</p>
          <button 
            onClick={() => navigate('/login')}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="orders-container">
        <h1>My Medical Records</h1>
        <div style={{ textAlign: 'center', marginTop: 50 }}>
          <p>Loading your medical records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>My Medical Records</h1>
        <button 
          onClick={() => navigate('/upload')}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Upload New Record
        </button>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="filter" style={{ marginRight: '10px' }}>Filter by type:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          <option value="">All Records</option>
          <option value="Prescription">Prescription</option>
          <option value="Lab Report">Lab Report</option>
          <option value="X-Ray">X-Ray</option>
          <option value="MRI">MRI</option>
          <option value="CT Scan">CT Scan</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {records.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: 50 }}>
          <p>You haven't uploaded any medical records yet.</p>
          <button 
            onClick={() => navigate('/upload')}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Upload Your First Record
          </button>
        </div>
      ) : (
        records.map((record) => (
          <div key={record.id} className="order-card">
            <div className="order-header">
              <h3>{getFileIcon(record.fileType)} {record.fileName}</h3>
              <span className={`order-status ${record.recordType.toLowerCase().replace(' ', '-')}`}>
                {record.recordType}
              </span>
            </div>

            <div className="order-details">
              <p><strong>Record Number:</strong> {record.recordNumber}</p>
              <p><strong>Patient Name:</strong> {record.patientName}</p>
              <p><strong>Phone:</strong> {record.phone}</p>
              <p><strong>File Size:</strong> {formatFileSize(record.fileSize)}</p>
              <p><strong>Upload Date:</strong> {new Date(record.uploadDate).toLocaleDateString()}</p>

              {record.description && (
                <p><strong>Description:</strong> {record.description}</p>
              )}

              <div className="order-actions">
                <button
                  onClick={() => handleDownload(record.id, record.fileName)}
                  style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '10px'
                  }}
                >
                  Download
                </button>
                <button
                  onClick={() => handleDelete(record.id)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
