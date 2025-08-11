const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth');

// Test route to debug authentication
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Admin test route accessed',
        user: req.user,
        headers: req.headers.authorization ? 'Present' : 'Missing'
    });
});

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Admin dashboard
router.get('/dashboard', adminController.getAdminDashboard);

// User management
router.get('/users', adminController.getAllUsers);
router.put('/users/:userId/status', adminController.updateUserStatus);

// Venue management
router.get('/venues', adminController.getAllVenues);
router.put('/venues/:venueId/status', adminController.updateVenueStatus);

// Booking management
router.get('/bookings', adminController.getAllBookings);

module.exports = router; 