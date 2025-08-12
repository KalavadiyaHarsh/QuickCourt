const Venue = require('../models/Venue');
const Court = require('../models/Court');
const Booking = require('../models/Booking');
const User = require('../models/User');

// Get facility owner dashboard
const getFacilityOwnerDashboard = async (req, res) => {
    try {
        const facilityOwnerId = req.user._id;

        // Get total counts for this facility owner
        const totalVenues = await Venue.countDocuments({ owner: facilityOwnerId });
        const totalCourts = await Court.countDocuments({ 
            venue: { $in: await Venue.find({ owner: facilityOwnerId }).select('_id') }
        });
        const totalBookings = await Booking.countDocuments({
            venue: { $in: await Venue.find({ owner: facilityOwnerId }).select('_id') }
        });

        // Get recent venues
        const recentVenues = await Venue.find({ owner: facilityOwnerId })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name address status createdAt');

        // Get recent bookings
        const recentBookings = await Booking.find({
            venue: { $in: await Venue.find({ owner: facilityOwnerId }).select('_id') }
        })
            .populate('user', 'fullName email')
            .populate('venue', 'name')
            .sort({ createdAt: -1 })
            .limit(5)
            .select('totalAmount paymentStatus bookingStatus createdAt');

        // Calculate revenue for this facility owner
        const totalRevenue = await Booking.aggregate([
            { 
                $match: { 
                    paymentStatus: 'paid',
                    venue: { $in: await Venue.find({ owner: facilityOwnerId }).select('_id') }
                } 
            },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        const monthlyRevenue = await Booking.aggregate([
            { 
                $match: { 
                    paymentStatus: 'paid',
                    venue: { $in: await Venue.find({ owner: facilityOwnerId }).select('_id') },
                    createdAt: { 
                        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) 
                    } 
                } 
            },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        res.json({
            success: true,
            data: {
                stats: {
                    totalVenues,
                    totalCourts,
                    totalBookings,
                    totalRevenue: totalRevenue[0]?.total || 0,
                    monthlyRevenue: monthlyRevenue[0]?.total || 0
                },
                recentVenues,
                recentBookings
            }
        });

    } catch (error) {
        console.error('Error in getFacilityOwnerDashboard:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get facility owner's venues
const getFacilityOwnerVenues = async (req, res) => {
    try {
        const facilityOwnerId = req.user._id;
        const { page = 1, limit = 10, status = '' } = req.query;

        // Build query
        let query = { owner: facilityOwnerId };
        if (status && status !== 'all') {
            query.status = status;
        }

        const skip = (page - 1) * limit;

        const venues = await Venue.find(query)
            .populate('owner', 'fullName email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalVenues = await Venue.countDocuments(query);

        res.json({
            success: true,
            data: venues,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalVenues / limit),
                totalVenues,
                hasNextPage: skip + venues.length < totalVenues,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error('Error in getFacilityOwnerVenues:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Create new venue (facility owner only)
const createVenue = async (req, res) => {
    try {
        const facilityOwnerId = req.user._id;
        
        console.log('=== CREATE VENUE DEBUG ===');
        console.log('User ID:', facilityOwnerId);
        console.log('Request body:', req.body);
        console.log('Request files:', req.files);
        
        // Handle file uploads
        let photos = [];
        if (req.files && req.files.length > 0) {
            photos = req.files.map(file => `/uploads/${file.filename}`);
            console.log('Processed photos:', photos);
        }

        // Parse JSON fields
        let sportsAvailable = [];
        let amenities = [];
        
        if (req.body.sportsAvailable) {
            try {
                sportsAvailable = JSON.parse(req.body.sportsAvailable);
                console.log('Parsed sportsAvailable:', sportsAvailable);
            } catch (e) {
                console.log('JSON parse failed for sportsAvailable, trying string split');
                // If JSON parsing fails, try to split by comma
                if (typeof req.body.sportsAvailable === 'string') {
                    sportsAvailable = req.body.sportsAvailable.split(',').map(s => s.trim()).filter(s => s.length > 0);
                } else if (Array.isArray(req.body.sportsAvailable)) {
                    sportsAvailable = req.body.sportsAvailable;
                }
                console.log('Fallback sportsAvailable:', sportsAvailable);
            }
        }
        
        if (req.body.amenities) {
            try {
                amenities = JSON.parse(req.body.amenities);
                console.log('Parsed amenities:', amenities);
            } catch (e) {
                console.log('JSON parse failed for amenities, trying string split');
                // If JSON parsing fails, try to split by comma
                if (typeof req.body.amenities === 'string') {
                    amenities = req.body.amenities.split(',').map(a => a.trim()).filter(a => a.length > 0);
                } else if (Array.isArray(req.body.amenities)) {
                    amenities = req.body.amenities;
                }
                console.log('Fallback amenities:', amenities);
            }
        }

        // Validate required fields
        console.log('=== VALIDATION DEBUG ===');
        console.log('req.body.name:', req.body.name);
        console.log('req.body.city:', req.body.city);
        console.log('req.body.state:', req.body.state);
        console.log('All req.body keys:', Object.keys(req.body));
        console.log('All req.body values:', Object.values(req.body));
        
        if (!req.body.name || !req.body.city || !req.body.state) {
            console.log('Missing required fields validation failed');
            console.log('name exists:', !!req.body.name);
            console.log('city exists:', !!req.body.city);
            console.log('state exists:', !!req.body.state);
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: name, city, and state are required'
            });
        }

        if (sportsAvailable.length === 0) {
            console.log('Sports validation failed - no sports specified');
            return res.status(400).json({
                success: false,
                message: 'At least one sport must be specified'
            });
        }

        const venueData = {
            name: req.body.name,
            description: req.body.description || '',
            address: {
                street: req.body.street || '',
                city: req.body.city || '',
                state: req.body.state || '',
                zip: req.body.zip || ''
            },
            photos: photos,
            sportsAvailable: sportsAvailable,
            amenities: amenities,
            owner: facilityOwnerId,
            status: 'pending' // New venues start as pending
        };

        console.log('Final venue data to create:', venueData);

        const venue = await Venue.create(venueData);

        console.log('Venue created successfully:', venue._id);

        res.status(201).json({
            success: true,
            message: 'Venue created successfully',
            data: venue
        });

    } catch (error) {
        console.error('Error in createVenue:', error);
        
        // Handle specific MongoDB errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            console.log('Validation errors:', validationErrors);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: validationErrors
            });
        }

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'A venue with this name already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update venue (facility owner only)
const updateVenue = async (req, res) => {
    try {
        const facilityOwnerId = req.user._id;
        const { venueId } = req.params;

        // Check if venue belongs to this facility owner
        const venue = await Venue.findOne({ _id: venueId, owner: facilityOwnerId });

        if (!venue) {
            return res.status(404).json({
                success: false,
                message: 'Venue not found or access denied'
            });
        }

        const updatedVenue = await Venue.findByIdAndUpdate(
            venueId,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Venue updated successfully',
            data: updatedVenue
        });

    } catch (error) {
        console.error('Error in updateVenue:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get facility owner's bookings
const getFacilityOwnerBookings = async (req, res) => {
    try {
        const facilityOwnerId = req.user._id;
        const { page = 1, limit = 10, status = '', venueId = '' } = req.query;

        // Get venues owned by this facility owner
        const ownedVenues = await Venue.find({ owner: facilityOwnerId }).select('_id');

        // Build query
        let query = {
            venue: { $in: ownedVenues.map(v => v._id) }
        };

        if (status && status !== 'all') {
            query.bookingStatus = status;
        }

        if (venueId) {
            query.venue = venueId;
        }

        const skip = (page - 1) * limit;

        const bookings = await Booking.find(query)
            .populate('user', 'fullName email')
            .populate('venue', 'name address')
            .populate('court', 'name sport')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalBookings = await Booking.countDocuments(query);

        res.json({
            success: true,
            data: bookings,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalBookings / limit),
                totalBookings,
                hasNextPage: skip + bookings.length < totalBookings,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error('Error in getFacilityOwnerBookings:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get facility owner's courts
const getFacilityOwnerCourts = async (req, res) => {
    try {
        const facilityOwnerId = req.user._id;
        const { venueId = '', sport = '' } = req.query;

        // Get venues owned by this facility owner
        const ownedVenues = await Venue.find({ owner: facilityOwnerId }).select('_id');

        // Build query
        let query = {
            venue: { $in: ownedVenues.map(v => v._id) }
        };

        if (venueId) {
            query.venue = venueId;
        }

        if (sport) {
            query.sport = sport;
        }

        const courts = await Court.find(query)
            .populate('venue', 'name address')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: courts
        });

    } catch (error) {
        console.error('Error in getFacilityOwnerCourts:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Create new court (facility owner only)
const createCourt = async (req, res) => {
    try {
        const facilityOwnerId = req.user._id;
        const { venueId, courtName, sportType, pricingPerHour, operatingHoursStart, operatingHoursEnd } = req.body;

        // Check if venue belongs to this facility owner
        const venue = await Venue.findOne({ _id: venueId, owner: facilityOwnerId });

        if (!venue) {
            return res.status(404).json({
                success: false,
                message: 'Venue not found or access denied'
            });
        }

        // Map frontend fields to Court model fields
        const courtData = {
            name: courtName,
            sport: sportType,
            venue: venueId,
            pricePerHour: parseFloat(pricingPerHour),
            operatingHours: {
                weekdays: {
                    open: operatingHoursStart,
                    close: operatingHoursEnd
                },
                weekends: {
                    open: operatingHoursStart,
                    close: operatingHoursEnd
                }
            }
        };

        const court = await Court.create(courtData);

        // Populate venue info for response
        const populatedCourt = await Court.findById(court._id).populate('venue', 'name address');

        res.status(201).json({
            success: true,
            message: 'Court created successfully',
            data: populatedCourt
        });

    } catch (error) {
        console.error('Error in createCourt:', error);
        
        // Handle duplicate court name error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'A court with this name already exists in this venue'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    getFacilityOwnerDashboard,
    getFacilityOwnerVenues,
    createVenue,
    updateVenue,
    getFacilityOwnerBookings,
    getFacilityOwnerCourts,
    createCourt
}; 