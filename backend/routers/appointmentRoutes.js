const express = require('express');
const router = express.Router();
const { 
  createAppointment, 
  getUserAppointments, 
  getAppointment, 
  updateAppointmentStatus, 
  cancelAppointment, 
  rescheduleAppointment,
  getAllAppointments 
} = require('../controller/appointmentController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// User routes
router.post('/', createAppointment);
router.get('/my-appointments', getUserAppointments);
router.get('/:appointmentId', getAppointment);
router.put('/:appointmentId/cancel', cancelAppointment);
router.put('/:appointmentId/reschedule', rescheduleAppointment);

// Admin routes
router.get('/admin/all', getAllAppointments);
router.put('/admin/:appointmentId/update', updateAppointmentStatus);

module.exports = router;
