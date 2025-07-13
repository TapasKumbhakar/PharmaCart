import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import './AdminMessages.css';

export default function AdminMessages() {
  const { isLoggedIn, user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [loading, setLoading] = useState(false);

  // Check if user is admin (multiple sources)
  const checkAdminAccess = () => {
    // Check AuthContext first
    if (user?.role === 'admin' || user?.type === 'Admin' || user?.email === 'admin@pharmacart.com') {
      return true;
    }

    // Check localStorage as fallback
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        return userData.type === 'Admin' || userData.role === 'admin' || userData.email === 'admin@pharmacart.com';
      } catch (error) {
        console.error('Error parsing stored user data:', error);
      }
    }

    return false;
  };

  const isAdmin = checkAdminAccess();

  // Load admin messages on component mount
  useEffect(() => {
    if (isLoggedIn && isAdmin) {
      loadMessages();
    }
  }, [isLoggedIn, isAdmin]);

  const loadMessages = () => {
    const adminMessages = localStorage.getItem('adminMessages');
    if (adminMessages) {
      const parsedMessages = JSON.parse(adminMessages);
      // Sort by creation date (newest first)
      parsedMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setMessages(parsedMessages);
    }
  };

  const updateMessageStatus = (messageId, status) => {
    const updatedMessages = messages.map(msg => 
      msg.id === messageId ? { ...msg, status } : msg
    );
    setMessages(updatedMessages);
    localStorage.setItem('adminMessages', JSON.stringify(updatedMessages));
    
    // Also update user messages if they exist
    const userMessages = localStorage.getItem('userMessages');
    if (userMessages) {
      const parsedUserMessages = JSON.parse(userMessages);
      const updatedUserMessages = parsedUserMessages.map(msg => 
        msg.id === messageId ? { ...msg, status } : msg
      );
      localStorage.setItem('userMessages', JSON.stringify(updatedUserMessages));
    }
  };

  const handleReply = async (messageId) => {
    if (!replyText.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Empty Reply',
        text: 'Please enter a reply message.',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    setLoading(true);

    try {
      const updatedMessages = messages.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            status: 'replied',
            adminReply: replyText,
            repliedAt: new Date().toISOString()
          };
        }
        return msg;
      });

      setMessages(updatedMessages);
      localStorage.setItem('adminMessages', JSON.stringify(updatedMessages));

      // Also update user messages
      const userMessages = localStorage.getItem('userMessages');
      if (userMessages) {
        const parsedUserMessages = JSON.parse(userMessages);
        const updatedUserMessages = parsedUserMessages.map(msg => {
          if (msg.id === messageId) {
            return {
              ...msg,
              status: 'replied',
              adminReply: replyText,
              repliedAt: new Date().toISOString()
            };
          }
          return msg;
        });
        localStorage.setItem('userMessages', JSON.stringify(updatedUserMessages));
      }

      setReplyText('');
      setSelectedMessage(null);

      Swal.fire({
        icon: 'success',
        title: 'Reply Sent!',
        text: 'Your reply has been sent to the customer.',
        timer: 2000,
        showConfirmButton: false
      });

    } catch (error) {
      console.error('Error sending reply:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Send Reply',
        text: 'Please try again.',
        timer: 2000,
        showConfirmButton: false
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (messageId) => {
    updateMessageStatus(messageId, 'read');
  };

  const closeMessage = (messageId) => {
    updateMessageStatus(messageId, 'closed');
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

  const filteredMessages = messages.filter(msg => {
    const statusMatch = filterStatus === 'all' || msg.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || msg.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  if (!isLoggedIn) {
    return (
      <div className="admin-messages-page">
        <div className="admin-container">
          <div className="access-denied">
            <h2>Access Denied</h2>
            <p>Please log in to access the admin panel.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="admin-messages-page">
        <div className="admin-container">
          <div className="access-denied">
            <h2>Admin Access Required</h2>
            <p>You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-messages-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Customer Messages</h1>
          <p>Manage and respond to customer support requests</p>
          <div className="admin-stats">
            <div className="stat-item">
              <span className="stat-number">{messages.length}</span>
              <span className="stat-label">Total Messages</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{messages.filter(m => m.status === 'sent').length}</span>
              <span className="stat-label">New Messages</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{messages.filter(m => m.status === 'replied').length}</span>
              <span className="stat-label">Replied</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{messages.filter(m => m.priority === 'high').length}</span>
              <span className="stat-label">High Priority</span>
            </div>
          </div>
        </div>

        <div className="admin-filters">
          <div className="filter-group">
            <label>Filter by Status:</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="sent">New Messages</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Filter by Priority:</label>
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>

        <div className="admin-content">
          {filteredMessages.length === 0 ? (
            <div className="empty-messages">
              <div className="empty-icon">📭</div>
              <h3>No Messages Found</h3>
              <p>No customer messages match your current filters.</p>
            </div>
          ) : (
            <div className="messages-grid">
              {filteredMessages.map((message) => (
                <div key={message.id} className="admin-message-card">
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

                  <div className="customer-info">
                    <div className="customer-detail">
                      <span className="detail-label">👤 Customer:</span>
                      <span className="detail-value">{message.userName}</span>
                    </div>
                    <div className="customer-detail">
                      <span className="detail-label">📧 Email:</span>
                      <span className="detail-value">{message.userEmail}</span>
                    </div>
                    <div className="customer-detail">
                      <span className="detail-label">📅 Sent:</span>
                      <span className="detail-value">
                        {new Date(message.createdAt).toLocaleDateString()} at {new Date(message.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  <div className="message-content">
                    <h4>Customer Message:</h4>
                    <p className="customer-message">{message.message}</p>
                    
                    {message.adminReply && (
                      <div className="admin-reply-display">
                        <h4>Your Reply:</h4>
                        <p className="admin-reply-text">{message.adminReply}</p>
                        <span className="reply-date">
                          Replied on {new Date(message.repliedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="message-actions">
                    {message.status === 'sent' && (
                      <button 
                        className="mark-read-btn"
                        onClick={() => markAsRead(message.id)}
                      >
                        <span className="btn-icon">👁️</span>
                        Mark as Read
                      </button>
                    )}
                    
                    {!message.adminReply && (
                      <button 
                        className="reply-btn"
                        onClick={() => setSelectedMessage(message.id)}
                      >
                        <span className="btn-icon">💬</span>
                        Reply
                      </button>
                    )}
                    
                    {message.status !== 'closed' && (
                      <button 
                        className="close-btn"
                        onClick={() => closeMessage(message.id)}
                      >
                        <span className="btn-icon">✅</span>
                        Close
                      </button>
                    )}
                  </div>

                  {selectedMessage === message.id && (
                    <div className="reply-form">
                      <h4>Reply to Customer:</h4>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply here..."
                        rows="4"
                      />
                      <div className="reply-actions">
                        <button 
                          className="send-reply-btn"
                          onClick={() => handleReply(message.id)}
                          disabled={loading}
                        >
                          {loading ? 'Sending...' : 'Send Reply'}
                        </button>
                        <button 
                          className="cancel-reply-btn"
                          onClick={() => {
                            setSelectedMessage(null);
                            setReplyText('');
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
