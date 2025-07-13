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

// Admin routes (you can add admin middleware later)
router.get('/', getAllAppointments);
router.put('/:appointmentId/status', updateAppointmentStatus);

module.exports = router;
