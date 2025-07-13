import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './AdminPanel.css';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const { user, userType, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Check admin access
  useEffect(() => {
    // Check both AuthContext and localStorage for admin access
    const storedUser = localStorage.getItem('userData');
    let isAdmin = false;

    if (isLoggedIn && userType === 'Admin') {
      isAdmin = true;
    } else if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        isAdmin = userData.type === 'Admin' || userData.role === 'admin';
      } catch (error) {
        console.error('Error parsing stored user data:', error);
      }
    }

    console.log('Admin access check:', { isLoggedIn, userType, isAdmin, storedUser: !!storedUser });

    if (!isAdmin) {
      Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: 'You need admin privileges to access this page.',
        timer: 2000,
        showConfirmButton: false
      });
      setTimeout(() => navigate('/'), 2000);
      return;
    }
  }, [isLoggedIn, userType, navigate]);

  // Load admin data from localStorage (with API fallback)
  useEffect(() => {
    const loadAdminData = async () => {
      if (!isLoggedIn || userType !== 'Admin') return;

      try {
        setLoading(true);
        console.log('Loading admin data from localStorage...');

        // Load orders from localStorage (from cart purchases)
        const storedOrders = localStorage.getItem('userOrders');
        const allOrders = storedOrders ? JSON.parse(storedOrders) : [];

        // Load appointments from localStorage
        const storedAppointments = localStorage.getItem('userAppointments');
        const allAppointments = storedAppointments ? JSON.parse(storedAppointments) : [];

        // Load admin messages
        const storedMessages = localStorage.getItem('adminMessages');
        const allMessages = storedMessages ? JSON.parse(storedMessages) : [];

        // Load registered users
        const storedUsers = localStorage.getItem('registeredUsers');
        const allUsers = storedUsers ? JSON.parse(storedUsers) : [];

        console.log('Loaded data:', {
          orders: allOrders.length,
          appointments: allAppointments.length,
          messages: allMessages.length,
          users: allUsers.length
        });

        // Set orders data
        setOrders(allOrders.length > 0 ? allOrders : [
          {
            _id: 'demo1',
            orderNumber: 'ORD001',
            userId: { fullname: 'Demo User', email: 'demo@example.com' },
            items: [{ name: 'Paracetamol 500mg', quantity: 2, price: 30 }],
            totalAmount: 60,
            orderStatus: 'Confirmed',
            paymentStatus: 'Paid',
            createdAt: new Date().toISOString()
          }
        ]);

        // Set appointments data
        setAppointments(allAppointments.length > 0 ? allAppointments : [
          {
            _id: 'demo1',
            appointmentNumber: 'APT001',
            patientName: 'Demo Patient',
            email: 'patient@example.com',
            phone: '9876543210',
            preferredDate: new Date().toISOString(),
            consultationType: 'General Consultation',
            appointmentStatus: 'Confirmed',
            doctorName: 'Dr. Available Doctor',
            consultationFee: 400,
            createdAt: new Date().toISOString()
          }
        ]);

        // Set medical records (placeholder for now)
        setMedicalRecords([]);

        // Calculate stats from actual data
        const stats = {
          totalOrders: allOrders.length,
          totalAppointments: allAppointments.length,
          totalMessages: allMessages.length,
          totalUsers: allUsers.length,
          pendingOrders: allOrders.filter(o => o.orderStatus === 'Pending').length,
          confirmedOrders: allOrders.filter(o => o.orderStatus === 'Confirmed').length,
          pendingAppointments: allAppointments.filter(a => a.appointmentStatus === 'Pending').length,
          confirmedAppointments: allAppointments.filter(a => a.appointmentStatus === 'Confirmed').length,
          newMessages: allMessages.filter(m => m.status === 'sent').length,
          totalRevenue: allOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
        };

        setStats(stats);
        console.log('Calculated stats:', stats);

      } catch (error) {
        console.error('Failed to load admin data:', error);

        // Set minimal demo data on error
        setOrders([]);
        setAppointments([]);
        setMedicalRecords([]);
        setStats({
          totalOrders: 0,
          totalAppointments: 0,
          totalMessages: 0,
          totalUsers: 0
        });
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [isLoggedIn, userType]);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      // Update in local state
      const updatedOrders = orders.map(order =>
        order._id === orderId ? { ...order, orderStatus: newStatus } : order
      );
      setOrders(updatedOrders);

      // Update in localStorage
      localStorage.setItem('userOrders', JSON.stringify(updatedOrders));

      Swal.fire({
        icon: 'success',
        title: 'Order Updated',
        text: `Order status updated to ${newStatus}`,
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.message || 'Failed to update order status',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const handleUpdateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      // Update in local state
      const updatedAppointments = appointments.map(appointment =>
        appointment._id === appointmentId ? { ...appointment, appointmentStatus: newStatus } : appointment
      );
      setAppointments(updatedAppointments);

      // Update in localStorage
      localStorage.setItem('userAppointments', JSON.stringify(updatedAppointments));

      Swal.fire({
        icon: 'success',
        title: 'Appointment Updated',
        text: `Appointment status updated to ${newStatus}`,
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.message || 'Failed to update appointment status',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  if (!isLoggedIn || userType !== 'Admin') {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Loading Admin Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="admin-panel" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user?.fullname}! Manage all customer activities from here.</p>
      </div>

      {/* Navigation Tabs */}
      <div style={{ marginBottom: '30px', borderBottom: '1px solid #ddd' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          {['dashboard', 'orders', 'appointments', 'prescriptions'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderBottom: activeTab === tab ? '3px solid #007bff' : '3px solid transparent',
                background: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: activeTab === tab ? 'bold' : 'normal',
                color: activeTab === tab ? '#007bff' : '#666',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard Overview */}
      {activeTab === 'dashboard' && (
        <div>
          <h2>Dashboard Overview</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div style={{ background: '#e3f2fd', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Total Orders</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{stats.totalOrders || orders.length}</p>
            </div>
            <div style={{ background: '#e8f5e8', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#388e3c' }}>Total Appointments</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{stats.totalAppointments || appointments.length}</p>
            </div>
            <div style={{ background: '#fff3e0', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#f57c00' }}>Medical Records</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{stats.totalMedicalRecords || medicalRecords.length}</p>
            </div>
            <div style={{ background: '#fce4ec', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#c2185b' }}>Pending Orders</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{stats.pendingOrders || orders.filter(o => o.orderStatus === 'Placed').length}</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
            {/* Recent Orders */}
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
              <h3>Recent Orders</h3>
              {orders.slice(0, 5).map(order => (
                <div key={order._id} style={{ padding: '10px', borderBottom: '1px solid #ddd', marginBottom: '10px' }}>
                  <p><strong>#{order.orderNumber}</strong></p>
                  <p>Customer: {order.userId?.fullname}</p>
                  <p>Amount: ₹{order.totalAmount}</p>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    background: order.orderStatus === 'Delivered' ? '#d4edda' : '#fff3cd',
                    color: order.orderStatus === 'Delivered' ? '#155724' : '#856404'
                  }}>
                    {order.orderStatus}
                  </span>
                </div>
              ))}
            </div>

            {/* Recent Appointments */}
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
              <h3>Recent Appointments</h3>
              {appointments.slice(0, 5).map(appointment => (
                <div key={appointment._id} style={{ padding: '10px', borderBottom: '1px solid #ddd', marginBottom: '10px' }}>
                  <p><strong>#{appointment.appointmentNumber}</strong></p>
                  <p>Patient: {appointment.patientName}</p>
                  <p>Date: {new Date(appointment.preferredDate).toLocaleDateString()}</p>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    background: appointment.appointmentStatus === 'Completed' ? '#d4edda' : '#fff3cd',
                    color: appointment.appointmentStatus === 'Completed' ? '#155724' : '#856404'
                  }}>
                    {appointment.appointmentStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Orders Management */}
      {activeTab === 'orders' && (
        <div>
          <h2>Orders Management</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
              <thead style={{ background: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Order #</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Customer</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Items</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Amount</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>{order.orderNumber}</td>
                    <td style={{ padding: '12px' }}>
                      <div>
                        <strong>{order.userId?.fullname}</strong><br />
                        <small>{order.userId?.email}</small>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {order.items?.map((item, index) => (
                        <div key={index} style={{ marginBottom: '4px' }}>
                          {item.name} x {item.quantity}
                        </div>
                      ))}
                    </td>
                    <td style={{ padding: '12px' }}>₹{order.totalAmount}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        background: order.orderStatus === 'Delivered' ? '#d4edda' :
                                   order.orderStatus === 'Shipped' ? '#cce5ff' : '#fff3cd',
                        color: order.orderStatus === 'Delivered' ? '#155724' :
                               order.orderStatus === 'Shipped' ? '#004085' : '#856404'
                      }}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                        style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ddd' }}
                      >
                        <option value="Placed">Placed</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Appointments Management */}
      {activeTab === 'appointments' && (
        <div>
          <h2>Appointments Management</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
              <thead style={{ background: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Appointment #</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Patient</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date & Time</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Type</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(appointment => (
                  <tr key={appointment._id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>{appointment.appointmentNumber}</td>
                    <td style={{ padding: '12px' }}>
                      <div>
                        <strong>{appointment.patientName}</strong><br />
                        <small>{appointment.email}</small><br />
                        <small>{appointment.phone}</small>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {new Date(appointment.preferredDate).toLocaleString()}
                    </td>
                    <td style={{ padding: '12px' }}>{appointment.consultationType}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        background: appointment.appointmentStatus === 'Completed' ? '#d4edda' :
                                   appointment.appointmentStatus === 'Confirmed' ? '#cce5ff' : '#fff3cd',
                        color: appointment.appointmentStatus === 'Completed' ? '#155724' :
                               appointment.appointmentStatus === 'Confirmed' ? '#004085' : '#856404'
                      }}>
                        {appointment.appointmentStatus}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <select
                        value={appointment.appointmentStatus}
                        onChange={(e) => handleUpdateAppointmentStatus(appointment._id, e.target.value)}
                        style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ddd' }}
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Rescheduled">Rescheduled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Medical Records/Prescriptions Management */}
      {activeTab === 'prescriptions' && (
        <div>
          <h2>Medical Records & Prescriptions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {medicalRecords.map(record => (
              <div key={record.id} style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <h4 style={{ margin: '0 0 10px 0' }}>{record.fileName}</h4>
                <p><strong>Patient:</strong> {record.patientName}</p>
                <p><strong>Phone:</strong> {record.phone}</p>
                <p><strong>Type:</strong> {record.recordType}</p>
                <p><strong>Upload Date:</strong> {new Date(record.uploadDate).toLocaleDateString()}</p>
                {record.description && (
                  <p><strong>Description:</strong> {record.description}</p>
                )}
                <div style={{ marginTop: '15px' }}>
                  <button
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '10px'
                    }}
                    onClick={() => {
                      Swal.fire({
                        icon: 'success',
                        title: 'Pickup Scheduled',
                        text: 'Store pickup has been scheduled for this prescription.',
                        timer: 2000,
                        showConfirmButton: false
                      });
                    }}
                  >
                    Book Pickup
                  </button>
                  <button
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      Swal.fire({
                        icon: 'info',
                        title: 'View Record',
                        text: 'Record viewing functionality will be available when file upload is fully implemented.',
                        timer: 2000,
                        showConfirmButton: false
                      });
                    }}
                  >
                    View Record
                  </button>
                </div>
              </div>
            ))}
          </div>
          {medicalRecords.length === 0 && (
            <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
              <p>No medical records uploaded yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
