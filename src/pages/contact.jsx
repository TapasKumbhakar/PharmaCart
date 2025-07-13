import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import './contact.css';

export default function Contact() {
  const { isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium'
  });
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load previous messages on component mount
  useEffect(() => {
    if (isLoggedIn) {
      const savedMessages = localStorage.getItem('userMessages');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    }
  }, [isLoggedIn]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      Swal.fire({
        icon: 'warning',
        title: 'Please Log In',
        text: 'You need to be logged in to send messages.',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    setLoading(true);

    try {
      // Create message object
      const messageId = 'MSG' + Date.now();
      const newMessage = {
        id: messageId,
        ...formData,
        status: 'sent',
        createdAt: new Date().toISOString(),
        adminReply: null,
        repliedAt: null
      };

      // Save to localStorage (user messages)
      const existingMessages = JSON.parse(localStorage.getItem('userMessages') || '[]');
      existingMessages.push(newMessage);
      localStorage.setItem('userMessages', JSON.stringify(existingMessages));

      // Save to admin messages (for admin panel)
      const adminMessages = JSON.parse(localStorage.getItem('adminMessages') || '[]');
      adminMessages.push({
        ...newMessage,
        userId: localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).id : 'unknown',
        userName: formData.name,
        userEmail: formData.email
      });
      localStorage.setItem('adminMessages', JSON.stringify(adminMessages));

      // Update local state
      setMessages(existingMessages);

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        priority: 'medium'
      });

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Message Sent!',
        text: `Your message #${messageId} has been sent to our support team. We'll get back to you soon.`,
        timer: 3000,
        showConfirmButton: false
      });

      // Switch to messages tab
      setActiveTab('messages');

    } catch (error) {
      console.error('Error sending message:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Send',
        text: 'Failed to send message. Please try again.',
        timer: 2000,
        showConfirmButton: false
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent': return '#f59e0b';
      case 'read': return '#3b82f6';
      case 'replied': return '#059669';
      case 'closed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent': return '📤';
      case 'read': return '👁️';
      case 'replied': return '💬';
      case 'closed': return '✅';
      default: return '📋';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#dc2626';
      case 'medium': return '#f59e0b';
      case 'low': return '#059669';
      default: return '#6b7280';
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <h1>Customer Support</h1>
          <p>Get help with your orders, appointments, and general inquiries</p>
        </div>

        <div className="contact-tabs">
          <button
            className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            <span className="tab-icon">📝</span>
            Send Message
          </button>
          {isLoggedIn && (
            <button
              className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveTab('messages')}
            >
              <span className="tab-icon">💬</span>
              My Messages ({messages.length})
            </button>
          )}
          <button
            className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            <span className="tab-icon">📞</span>
            Contact Info
          </button>
        </div>

        <div className="contact-content">
          {activeTab === 'contact' && (
            <div className="contact-form-section">
              <h2>Send us a Message</h2>
              <form className="enhanced-contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="priority">Priority</label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                    >
                      <option value="low">Low - General inquiry</option>
                      <option value="medium">Medium - Order/Appointment issue</option>
                      <option value="high">High - Urgent medical concern</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Please describe your issue in detail..."
                    rows="6"
                    required
                  ></textarea>
                </div>

                <button type="submit" disabled={loading} className="send-btn">
                  {loading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">📤</span>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'messages' && isLoggedIn && (
            <div className="messages-section">
              <h2>Your Messages</h2>
              {messages.length === 0 ? (
                <div className="empty-messages">
                  <div className="empty-icon">💬</div>
                  <h3>No Messages Yet</h3>
                  <p>You haven't sent any messages to our support team.</p>
                  <button
                    className="send-first-btn"
                    onClick={() => setActiveTab('contact')}
                  >
                    Send Your First Message
                  </button>
                </div>
              ) : (
                <div className="messages-list">
                  {messages.map((message) => (
                    <div key={message.id} className="message-card">
                      <div className="message-header">
                        <div className="message-info">
                          <h3>#{message.id}</h3>
                          <span className="message-subject">{message.subject}</span>
                        </div>
                        <div className="message-meta">
                          <span
                            className="priority-badge"
                            style={{ backgroundColor: getPriorityColor(message.priority) }}
                          >
                            {message.priority.toUpperCase()}
                          </span>
                          <span
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(message.status) }}
                          >
                            <span className="status-icon">{getStatusIcon(message.status)}</span>
                            {message.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="message-content">
                        <p><strong>Your Message:</strong></p>
                        <p className="message-text">{message.message}</p>

                        {message.adminReply && (
                          <div className="admin-reply">
                            <p><strong>Support Team Reply:</strong></p>
                            <p className="reply-text">{message.adminReply}</p>
                            <span className="reply-date">
                              Replied on {new Date(message.repliedAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="message-footer">
                        <span className="message-date">
                          Sent on {new Date(message.createdAt).toLocaleDateString()} at {new Date(message.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'info' && (
            <div className="contact-info-section">
              <h2>Get in Touch</h2>
              <div className="contact-methods">
                <div className="contact-method">
                  <div className="method-icon">📧</div>
                  <div className="method-details">
                    <h3>Email Support</h3>
                    <p>For general inquiries and support</p>
                    <a href="mailto:support@PharmaCart.com">support@PharmaCart.com</a>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">📞</div>
                  <div className="method-details">
                    <h3>Phone Support</h3>
                    <p>Available 24/7 for urgent matters</p>
                    <a href="tel:+919876543210">+91 98765 43210</a>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">💬</div>
                  <div className="method-details">
                    <h3>Live Chat</h3>
                    <p>Quick responses during business hours</p>
                    <span>Mon-Fri: 9 AM - 6 PM</span>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">🏥</div>
                  <div className="method-details">
                    <h3>Emergency</h3>
                    <p>For medical emergencies</p>
                    <a href="tel:108">Call 108</a>
                  </div>
                </div>
              </div>

              <div className="faq-section">
                <h3>Frequently Asked Questions</h3>
                <div className="faq-list">
                  <div className="faq-item">
                    <h4>How long does delivery take?</h4>
                    <p>Standard delivery takes 2-3 business days. Express delivery is available for urgent orders.</p>
                  </div>
                  <div className="faq-item">
                    <h4>Can I cancel my appointment?</h4>
                    <p>Yes, you can cancel appointments up to 2 hours before the scheduled time.</p>
                  </div>
                  <div className="faq-item">
                    <h4>What payment methods do you accept?</h4>
                    <p>We accept cash on delivery, online payments via Stripe, and all major credit/debit cards.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
