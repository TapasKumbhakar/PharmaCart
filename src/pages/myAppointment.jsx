import React, { useState, useEffect } from 'react';
import { appointmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import './myOrder.css'; // Reusing the same styles

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();

  // Fetch user appointments on component mount
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }

      try {
        const response = await appointmentAPI.getUserAppointments();
        if (response.success) {
          setAppointments(response.appointments);
        }
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
        Swal.fire({
          icon: 'error',
          title: 'Failed to load appointments',
          text: error.message || 'Could not load your appointments. Please try again.',
          timer: 2000,
          showConfirmButton: false
        });
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
        const response = await appointmentAPI.cancelAppointment(appointmentId);
        if (response.success) {
          // Update the appointment in the local state
          setAppointments(appointments.map(appointment =>
            appointment._id === appointmentId
              ? { ...appointment, appointmentStatus: 'Cancelled' }
              : appointment
          ));

          Swal.fire({
            icon: 'success',
            title: 'Appointment Cancelled',
            text: 'Your appointment has been cancelled successfully.',
            timer: 2000,
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

  if (!isLoggedIn) {
    return (
      <div className="orders-container">
        <h1>My Appointments</h1>
        <div style={{ textAlign: 'center', marginTop: 50 }}>
          <p>Please log in to view your appointments.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="orders-container">
        <h1>My Appointments</h1>
        <div style={{ textAlign: 'center', marginTop: 50 }}>
          <p>Loading your appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h1>My Appointments</h1>
      {appointments.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: 50 }}>
          <p>You haven't booked any appointments yet.</p>
        </div>
      ) : (
        appointments.map((appointment) => (
          <div key={appointment._id} className="order-card">
            <div className="order-header">
              <h3>Appointment #{appointment.appointmentNumber}</h3>
              <span className={`order-status ${appointment.appointmentStatus.toLowerCase()}`}>
                {appointment.appointmentStatus}
              </span>
            </div>

            <div className="order-details">
              <p><strong>Patient:</strong> {appointment.patientName}</p>
              <p><strong>Doctor:</strong> {appointment.doctorName}</p>
              <p><strong>Consultation Type:</strong> {appointment.consultationType}</p>
              <p><strong>Date & Time:</strong> {new Date(appointment.preferredDate).toLocaleString()}</p>
              <p><strong>Symptoms:</strong> {appointment.symptoms}</p>
              <p><strong>Consultation Fee:</strong> ₹{appointment.consultationFee}</p>
              <p><strong>Payment Method:</strong> {appointment.paymentMethod}</p>
              <p><strong>Payment Status:</strong> {appointment.paymentStatus}</p>
              <p><strong>Booked On:</strong> {new Date(appointment.createdAt).toLocaleDateString()}</p>

              <div className="order-actions">
                {!['Completed', 'Cancelled'].includes(appointment.appointmentStatus) && (
                  <button onClick={() => handleCancel(appointment._id)}>Cancel</button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}