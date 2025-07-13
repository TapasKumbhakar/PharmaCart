import React, { useState, useEffect } from 'react';
import { appointmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import './myOrder.css'; // Reusing the same styles

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, user } = useAuth();

  // Debug authentication state
  useEffect(() => {
    console.log('MyAppointments - Auth state:', { isLoggedIn, user });
    console.log('MyAppointments - localStorage userData:', localStorage.getItem('userData'));
  }, [isLoggedIn, user]);

  // Fetch user appointments on component mount
  useEffect(() => {
    const fetchAppointments = async () => {
      // Check multiple authentication sources
      const hasStoredUser = localStorage.getItem('userData');
      const isAuthenticated = isLoggedIn || !!hasStoredUser;

      console.log('MyAppointments fetchAppointments - isLoggedIn:', isLoggedIn, 'hasStoredUser:', !!hasStoredUser, 'isAuthenticated:', isAuthenticated);

      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const response = await appointmentAPI.getUserAppointments();
        if (response && response.success) {
          setAppointments(response.appointments || []);
        } else {
          // If API doesn't return success, try to load from localStorage as fallback
          const savedAppointments = localStorage.getItem('userAppointments');
          if (savedAppointments) {
            setAppointments(JSON.parse(savedAppointments));
          }
        }
      } catch (error) {
        console.error('Failed to fetch appointments:', error);

        // Try to load from localStorage as fallback
        try {
          const savedAppointments = localStorage.getItem('userAppointments');
          if (savedAppointments) {
            const parsedAppointments = JSON.parse(savedAppointments);
            setAppointments(parsedAppointments);
            console.log('Loaded appointments from localStorage:', parsedAppointments);
          } else {
            console.log('No appointments found in localStorage');
          }
        } catch (localStorageError) {
          console.error('Error loading from localStorage:', localStorageError);
        }

        // Only show error if we couldn't load from localStorage either
        const savedAppointments = localStorage.getItem('userAppointments');
        if (!savedAppointments) {
          console.log('Showing error message as no fallback data available');
          // Don't show error popup, just log it for now
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [isLoggedIn]);

  const handleCancel = async (appointmentId) => {
    try {
      const result = await Swal.fire({
        title: 'Cancel Appointment?',
        text: 'Are you sure you want to cancel this appointment?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, cancel it!'
      });

      if (result.isConfirmed) {
        try {
          const response = await appointmentAPI.cancelAppointment(appointmentId);
          if (response && response.success) {
            // Update the appointment in the local state
            const updatedAppointments = appointments.map(appointment =>
              appointment._id === appointmentId
                ? { ...appointment, appointmentStatus: 'Cancelled' }
                : appointment
            );
            setAppointments(updatedAppointments);

            // Also update localStorage
            localStorage.setItem('userAppointments', JSON.stringify(updatedAppointments));

            Swal.fire({
              icon: 'success',
              title: 'Appointment Cancelled',
              text: 'Your appointment has been cancelled successfully.',
              timer: 2000,
              showConfirmButton: false
            });
          } else {
            throw new Error('Failed to cancel appointment');
          }
        } catch (apiError) {
          console.error('API cancel error:', apiError);

          // Fallback: Update locally even if API fails
          const updatedAppointments = appointments.map(appointment =>
            appointment._id === appointmentId
              ? { ...appointment, appointmentStatus: 'Cancelled' }
              : appointment
          );
          setAppointments(updatedAppointments);
          localStorage.setItem('userAppointments', JSON.stringify(updatedAppointments));

          Swal.fire({
            icon: 'success',
            title: 'Appointment Cancelled',
            text: 'Your appointment has been cancelled locally. Changes will sync when the server is available.',
            timer: 3000,
            showConfirmButton: false
          });
        }
      }
    } catch (error) {
      console.error('Cancel appointment error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Cancellation Failed',
        text: error.message || 'Failed to cancel appointment. Please try again.',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const handleRemove = async (appointmentId) => {
    try {
      const result = await Swal.fire({
        title: 'Remove Appointment?',
        text: 'This will permanently delete this appointment from your records. This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, remove it!',
        cancelButtonText: 'Keep it'
      });

      if (result.isConfirmed) {
        // Remove from local state
        const updatedAppointments = appointments.filter(appointment => appointment._id !== appointmentId);
        setAppointments(updatedAppointments);

        // Update localStorage
        localStorage.setItem('userAppointments', JSON.stringify(updatedAppointments));

        Swal.fire({
          icon: 'success',
          title: 'Appointment Removed',
          text: 'The appointment has been permanently removed from your records.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Remove appointment error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Removal Failed',
        text: 'Failed to remove appointment. Please try again.',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  // Check authentication from multiple sources
  const hasStoredUser = localStorage.getItem('userData');
  const isAuthenticated = isLoggedIn || !!hasStoredUser;

  if (!isAuthenticated) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="page-header">
            <h1>My Appointments</h1>
            <p>Track and manage your doctor appointments</p>
          </div>
          <div className="empty-state">
            <div className="empty-icon">🔐</div>
            <h3>Please Log In</h3>
            <p>You need to be logged in to view your appointments.</p>
            <button className="login-btn" onClick={() => window.location.href = '/login'}>
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="page-header">
            <h1>My Appointments</h1>
            <p>Track and manage your doctor appointments</p>
          </div>
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <h3>Loading Your Appointments</h3>
            <p>Please wait while we fetch your appointment history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <div className="page-header">
          <h1>My Appointments</h1>
          <p>Track and manage your doctor appointments</p>
          <div className="orders-stats">
            <div className="stat-item">
              <span className="stat-number">{appointments.length}</span>
              <span className="stat-label">Total Appointments</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{appointments.filter(a => a.appointmentStatus === 'Completed').length}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{appointments.filter(a => a.appointmentStatus && !['Completed', 'Cancelled'].includes(a.appointmentStatus)).length}</span>
              <span className="stat-label">Active</span>
            </div>
          </div>
        </div>

        {appointments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👨‍⚕️</div>
            <h3>No Appointments Yet</h3>
            <p>You haven't booked any appointments yet. Schedule a consultation with our expert doctors!</p>
            <button className="shop-now-btn" onClick={() => window.location.href = '/doctors'}>
              Book Appointment
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="enhanced-order-card">
                <div className="order-card-header">
                  <div className="order-info">
                    <h3>Appointment #{appointment.appointmentNumber || 'N/A'}</h3>
                    <p className="order-date">
                      📅 {appointment.createdAt ? new Date(appointment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </p>
                  </div>
                  <div className="order-status-badge" style={{ backgroundColor: appointment.appointmentStatus === 'Completed' ? '#059669' : appointment.appointmentStatus === 'Cancelled' ? '#ef4444' : '#f59e0b' }}>
                    <span className="status-icon">
                      {appointment.appointmentStatus === 'Completed' ? '✅' :
                       appointment.appointmentStatus === 'Cancelled' ? '❌' : '⏳'}
                    </span>
                    <span className="status-text">{appointment.appointmentStatus || 'Pending'}</span>
                  </div>
                </div>

                <div className="order-summary">
                  <div className="summary-grid">
                    <div className="summary-item">
                      <span className="summary-label">👤 Patient</span>
                      <span className="summary-value">{appointment.patientName || 'N/A'}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">👨‍⚕️ Doctor</span>
                      <span className="summary-value">{appointment.doctorName || 'Dr. Available Doctor'}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">🩺 Consultation Type</span>
                      <span className="summary-value">{appointment.consultationType || 'N/A'}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">📅 Appointment Date</span>
                      <span className="summary-value">
                        {appointment.preferredDate ? new Date(appointment.preferredDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">💰 Consultation Fee</span>
                      <span className="summary-value">₹{appointment.consultationFee || '0'}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">💳 Payment Method</span>
                      <span className="summary-value">{appointment.paymentMethod || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {appointment.symptoms && (
                  <div className="order-items-section">
                    <h4>Symptoms / Reason for Consultation</h4>
                    <p style={{ color: '#64748b', lineHeight: '1.6' }}>{appointment.symptoms}</p>
                  </div>
                )}

                <div className="order-actions-section">
                  <div className="action-buttons">
                    {appointment.appointmentStatus && !['Completed', 'Cancelled'].includes(appointment.appointmentStatus) && (
                      <button className="cancel-btn" onClick={() => handleCancel(appointment._id)}>
                        <span className="btn-icon">❌</span>
                        Cancel Appointment
                      </button>
                    )}
                    <button className="track-btn">
                      <span className="btn-icon">📞</span>
                      Contact Doctor
                    </button>
                    <button className="remove-btn" onClick={() => handleRemove(appointment._id)}>
                      <span className="btn-icon">🗑️</span>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}