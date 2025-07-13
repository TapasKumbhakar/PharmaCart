const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appointmentNumber: {
    type: String,
    unique: true
  },
  patientName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  consultationType: {
    type: String,
    enum: ['General Consultation', 'Follow-up', 'Emergency', 'Specialist'],
    required: true
  },
  preferredDate: {
    type: Date,
    required: true
  },
  symptoms: {
    type: String,
    required: true
  },
  doctorName: {
    type: String,
    default: 'Dr. General Practitioner'
  },
  consultationFee: {
    type: Number,
    default: 300
  },
  paymentMethod: {
    type: String,
    enum: ['Offline Payment / CASH', 'Online Payment'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  appointmentStatus: {
    type: String,
    enum: ['Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'Rescheduled'],
    default: 'Scheduled'
  },
  stripeSessionId: {
    type: String
  },
  attachedReports: {
    type: String // File path or URL
  },
  doctorNotes: {
    type: String
  },
  prescription: {
    type: String
  }
}, {
  timestamps: true
});



module.exports = mongoose.model('Appointment', appointmentSchema);
