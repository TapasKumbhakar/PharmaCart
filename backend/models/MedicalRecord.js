const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recordNumber: {
    type: String,
    unique: true
  },
  patientName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  fileName: {
    type: String,
    required: true
  },
  originalFileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  recordType: {
    type: String,
    enum: ['Prescription', 'Lab Report', 'X-Ray', 'MRI', 'CT Scan', 'Other'],
    default: 'Prescription'
  },
  description: {
    type: String,
    trim: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Generate record number before saving
medicalRecordSchema.pre('save', async function(next) {
  if (!this.recordNumber) {
    const count = await mongoose.model('MedicalRecord').countDocuments();
    this.recordNumber = `MR${Date.now()}${count + 1}`;
  }
  next();
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
