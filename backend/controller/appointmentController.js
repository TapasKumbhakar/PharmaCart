const Appointment = require('../models/Appointment');
const User = require('../models/User');

// Create new appointment
const createAppointment = async (req, res) => {
  try {
    const { 
      patientName, 
      email, 
      phone, 
      dateOfBirth, 
      gender, 
      consultationType, 
      preferredDate, 
      symptoms, 
      doctorName,
      consultationFee,
      paymentMethod,
      stripeSessionId,
      attachedReports
    } = req.body;

    // Generate appointment number
    const appointmentCount = await Appointment.countDocuments();
    const appointmentNumber = `APT${Date.now()}${appointmentCount + 1}`;

    const appointment = new Appointment({
      userId: req.userId,
      appointmentNumber: appointmentNumber,
      patientName,
      email,
      phone,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      consultationType,
      preferredDate: new Date(preferredDate),
      symptoms,
      doctorName: doctorName || 'Dr. General Practitioner',
      consultationFee: consultationFee || 300,
      paymentMethod,
      stripeSessionId,
      attachedReports,
      paymentStatus: paymentMethod === 'Online Payment' ? 'Paid' : 'Pending'
    });

    await appointment.save();

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment
    });

  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to book appointment',
      details: error.message
    });
  }
};

// Get user appointments
const getUserAppointments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const appointments = await Appointment.find({ userId: req.userId })
      .sort({ preferredDate: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'fullname email');

    const totalAppointments = await Appointment.countDocuments({ userId: req.userId });

    res.json({
      success: true,
      appointments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalAppointments / limit),
        totalAppointments,
        hasNext: page < Math.ceil(totalAppointments / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get user appointments error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get appointments',
      details: error.message
    });
  }
};

// Get single appointment
const getAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findOne({ 
      _id: appointmentId, 
      userId: req.userId 
    }).populate('userId', 'fullname email');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      appointment
    });

  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get appointment',
      details: error.message
    });
  }
};

// Update appointment status (for admin/doctor)
const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { appointmentStatus, doctorNotes, prescription } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { 
        appointmentStatus, 
        doctorNotes, 
        prescription,
        ...(appointmentStatus === 'Completed' && { paymentStatus: 'Paid' })
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      message: 'Appointment status updated successfully',
      appointment
    });

  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update appointment status',
      details: error.message
    });
  }
};

// Cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findOne({ 
      _id: appointmentId, 
      userId: req.userId 
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
    }

    // Check if appointment can be cancelled
    if (['Completed', 'Cancelled'].includes(appointment.appointmentStatus)) {
      return res.status(400).json({
        success: false,
        error: 'Appointment cannot be cancelled at this stage'
      });
    }

    appointment.appointmentStatus = 'Cancelled';
    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      appointment
    });

  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel appointment',
      details: error.message
    });
  }
};

// Reschedule appointment
const rescheduleAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { preferredDate } = req.body;

    const appointment = await Appointment.findOne({ 
      _id: appointmentId, 
      userId: req.userId 
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
    }

    // Check if appointment can be rescheduled
    if (['Completed', 'Cancelled'].includes(appointment.appointmentStatus)) {
      return res.status(400).json({
        success: false,
        error: 'Appointment cannot be rescheduled at this stage'
      });
    }

    appointment.preferredDate = new Date(preferredDate);
    appointment.appointmentStatus = 'Rescheduled';
    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment rescheduled successfully',
      appointment
    });

  } catch (error) {
    console.error('Reschedule appointment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reschedule appointment',
      details: error.message
    });
  }
};

// Get all appointments (admin only)
const getAllAppointments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const date = req.query.date;

    let filter = {};
    if (status) filter.appointmentStatus = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.preferredDate = { $gte: startDate, $lt: endDate };
    }

    const appointments = await Appointment.find(filter)
      .sort({ preferredDate: 1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'fullname email mobile');

    const totalAppointments = await Appointment.countDocuments(filter);

    res.json({
      success: true,
      appointments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalAppointments / limit),
        totalAppointments,
        hasNext: page < Math.ceil(totalAppointments / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get all appointments error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get appointments',
      details: error.message
    });
  }
};

module.exports = {
  createAppointment,
  getUserAppointments,
  getAppointment,
  updateAppointmentStatus,
  cancelAppointment,
  rescheduleAppointment,
  getAllAppointments
};
