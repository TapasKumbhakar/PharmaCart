const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const MedicalRecord = require('../models/MedicalRecord');

// Test route (no auth required)
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Medical records routes working!' });
});

// Get user medical records
router.get('/', authenticateToken, async (req, res) => {
  try {
    const records = await MedicalRecord.find({
      userId: req.userId,
      isActive: true
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      records,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalRecords: records.length,
        hasNext: false,
        hasPrev: false
      }
    });
  } catch (error) {
    console.error('Get medical records error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get medical records',
      details: error.message
    });
  }
});

// Simple upload endpoint (we'll handle file upload in frontend for now)
router.post('/upload', authenticateToken, async (req, res) => {
  try {
    const { patientName, phone, recordType, description, fileName, fileData } = req.body;

    const medicalRecord = new MedicalRecord({
      userId: req.userId,
      patientName,
      phone,
      fileName: fileName || 'uploaded-file.pdf',
      originalFileName: fileName || 'uploaded-file.pdf',
      fileType: 'application/pdf',
      fileSize: fileData ? fileData.length : 0,
      filePath: 'uploads/medical-records/' + (fileName || 'uploaded-file.pdf'),
      recordType: recordType || 'Prescription',
      description
    });

    await medicalRecord.save();

    res.status(201).json({
      success: true,
      message: 'Medical record uploaded successfully',
      record: medicalRecord
    });

  } catch (error) {
    console.error('Upload medical record error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload medical record',
      details: error.message
    });
  }
});

// Delete medical record
router.delete('/:recordId', authenticateToken, async (req, res) => {
  try {
    const { recordId } = req.params;

    const record = await MedicalRecord.findOne({
      _id: recordId,
      userId: req.userId
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Medical record not found'
      });
    }

    record.isActive = false;
    await record.save();

    res.json({
      success: true,
      message: 'Medical record deleted successfully'
    });

  } catch (error) {
    console.error('Delete medical record error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete medical record',
      details: error.message
    });
  }
});

module.exports = router;
