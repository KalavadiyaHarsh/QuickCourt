const express = require('express');
const {
    getProfile,
    updateProfile,
    getVenues,
    getVenue,
    getPopularVenues,
    getVenueCourts,
    getCourtAvailability,
    createBooking,
    getUserBookings,
    cancelBooking,
    addReview
} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/multer');

const router = express.Router();

// All routes are protected - user must be authenticated
router.use(protect);

// Profile routes
router.route('/profile')
    .get(getProfile)
    .put(updateProfile); // For regular updates (no files)

// Profile update with file upload
router.put('/profile/upload', upload.single('avatar'), updateProfile); // For updates with avatar

// Venue routes
router.get('/venues/popular', getPopularVenues);
router.get('/venues', getVenues);
router.get('/venues/:id', getVenue);
router.get('/venues/:venueId/courts', getVenueCourts);

// Court availability route
router.get('/courts/:courtId/availability', getCourtAvailability);

// Booking routes
router.route('/bookings')
    .get(getUserBookings)
    .post(createBooking);

router.put('/bookings/:id/cancel', cancelBooking);

// Review route
router.post('/venues/:venueId/reviews', addReview);

module.exports = router;