const MedicalRecord = require('../models/MedicalRecord');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/medical-records';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images and PDFs
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only images and PDF files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Upload medical record
const uploadMedicalRecord = async (req, res) => {
  try {
    const { patientName, phone, recordType, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const medicalRecord = new MedicalRecord({
      userId: req.userId,
      patientName,
      phone,
      fileName: file.filename,
      originalFileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      filePath: file.path,
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
};

// Get user medical records
const getUserMedicalRecords = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const recordType = req.query.recordType;

    const filter = { userId: req.userId, isActive: true };
    if (recordType) {
      filter.recordType = recordType;
    }

    const records = await MedicalRecord.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'fullname email');

    const totalRecords = await MedicalRecord.countDocuments(filter);

    res.json({
      success: true,
      records,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords,
        hasNext: page < Math.ceil(totalRecords / limit),
        hasPrev: page > 1
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
};

// Get single medical record
const getMedicalRecord = async (req, res) => {
  try {
    const { recordId } = req.params;

    const record = await MedicalRecord.findOne({ 
      _id: recordId, 
      userId: req.userId,
      isActive: true 
    }).populate('userId', 'fullname email');

    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Medical record not found'
      });
    }

    res.json({
      success: true,
      record
    });

  } catch (error) {
    console.error('Get medical record error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get medical record',
      details: error.message
    });
  }
};

// Download medical record file
const downloadMedicalRecord = async (req, res) => {
  try {
    const { recordId } = req.params;

    const record = await MedicalRecord.findOne({ 
      _id: recordId, 
      userId: req.userId,
      isActive: true 
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Medical record not found'
      });
    }

    const filePath = path.resolve(record.filePath);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    res.download(filePath, record.originalFileName);

  } catch (error) {
    console.error('Download medical record error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to download medical record',
      details: error.message
    });
  }
};

// Delete medical record
const deleteMedicalRecord = async (req, res) => {
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

    // Soft delete
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
};

module.exports = {
  upload,
  uploadMedicalRecord,
  getUserMedicalRecords,
  getMedicalRecord,
  downloadMedicalRecord,
  deleteMedicalRecord
};
