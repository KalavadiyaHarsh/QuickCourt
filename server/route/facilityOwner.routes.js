const express = require('express');
const router = express.Router();
const facilityOwnerController = require('../controllers/facilityOwner.controller');
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Test endpoint without auth
router.get('/ping', (req, res) => {
    res.json({ success: true, message: 'Facility owner routes are accessible' });
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// All facility owner routes require authentication and facility_owner role
router.use(protect);
router.use(authorize('facility_owner'));

// Dashboard
router.get('/dashboard', facilityOwnerController.getFacilityOwnerDashboard);

// Test endpoint
router.get('/test', (req, res) => {
    res.json({ success: true, message: 'Facility owner routes are working' });
});

// Venue management
router.get('/venues', facilityOwnerController.getFacilityOwnerVenues);
router.post('/venues', upload.array('photos', 10), (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 5MB.'
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Too many files. Maximum is 10 files.'
            });
        }
    } else if (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    next();
}, facilityOwnerController.createVenue);
router.put('/venues/:venueId', facilityOwnerController.updateVenue);

// Court management
router.get('/courts', facilityOwnerController.getFacilityOwnerCourts);
router.post('/courts', facilityOwnerController.createCourt);

// Booking management
router.get('/bookings', facilityOwnerController.getFacilityOwnerBookings);

module.exports = router; 