const User = require('../models/User');
const Venue = require('../models/Venue');
const Booking = require('../models/Booking');
const Court = require('../models/Court');
const Review = require('../models/Review');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                isVerified: user.isVerified,
                status: user.status,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching profile',
            error: error.message
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const { fullName, avatar } = req.body;

        const fieldsToUpdate = {};
        if (fullName) fieldsToUpdate.fullName = fullName;
        if (avatar) fieldsToUpdate.avatar = avatar;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            fieldsToUpdate,
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                isVerified: user.isVerified,
                status: user.status
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating profile',
            error: error.message
        });
    }
};

// @desc    Get all venues (with search and filters)
// @route   GET /api/users/venues
// @access  Private
exports.getVenues = async (req, res) => {
    try {
        const {
            search,
            sport,
            minPrice,
            maxPrice,
            rating,
            city,
            page = 1,
            limit = 10
        } = req.query;

        // Build query
        let query = { status: 'approved' };

        // Search by venue name or description
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by city
        if (city) {
            query['address.city'] = { $regex: city, $options: 'i' };
        }

        // Filter by rating
        if (rating) {
            query.rating = { $gte: parseFloat(rating) };
        }

        // Get venues with proper population
        let venues = await Venue.find(query)
            .populate({
                path: 'courts',
                match: sport ? { sport: sport } : {},
                select: 'sport pricePerHour name'
            })
            .select('name description address photos amenities rating createdAt')
            .lean();

        // Filter venues based on court criteria (sport and price)
        let filteredVenues = [];

        for (let venue of venues) {
            // If no courts found for this venue, skip it
            if (!venue.courts || venue.courts.length === 0) {
                continue;
            }

            let validCourts = venue.courts;

            // Apply price filtering
            if (minPrice || maxPrice) {
                validCourts = validCourts.filter(court => {
                    const price = court.pricePerHour;
                    const minValid = !minPrice || price >= parseFloat(minPrice);
                    const maxValid = !maxPrice || price <= parseFloat(maxPrice);
                    return minValid && maxValid;
                });
            }

            // If no courts meet the price criteria, skip this venue
            if (validCourts.length === 0) {
                continue;
            }

            // Add processed data to venue
            venue.courts = validCourts;
            venue.sportsAvailable = [...new Set(validCourts.map(court => court.sport))];
            venue.startingPrice = Math.min(...validCourts.map(court => court.pricePerHour));
            venue.courtCount = validCourts.length;

            filteredVenues.push(venue);
        }

        // Sort by rating (descending) then by creation date
        filteredVenues.sort((a, b) => {
            if (b.rating !== a.rating) {
                return b.rating - a.rating;
            }
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        // Pagination
        const skip = (page - 1) * limit;
        const paginatedVenues = filteredVenues.slice(skip, skip + parseInt(limit));

        res.status(200).json({
            success: true,
            data: paginatedVenues,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(filteredVenues.length / limit),
                totalVenues: filteredVenues.length,
                hasNextPage: skip + parseInt(limit) < filteredVenues.length,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Get venues error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching venues',
            error: error.message
        });
    }
};

// @desc    Get single venue details
// @route   GET /api/users/venues/:id
// @access  Private
exports.getVenue = async (req, res) => {
    try {
        const venue = await Venue.findOne({
            _id: req.params.id,
            status: 'approved'
        }).populate('owner', 'fullName email');

        if (!venue) {
            return res.status(404).json({
                success: false,
                message: 'Venue not found or not approved'
            });
        }

        // Get courts for this venue
        const courts = await Court.find({ venue: venue._id })
            .select('name sport pricePerHour capacity operatingHours');

        // Get reviews for this venue
        const reviews = await Review.find({ venue: venue._id })
            .populate('user', 'fullName avatar')
            .sort({ createdAt: -1 })
            .limit(10);

        const venueData = {
            ...venue.toObject(),
            courts,
            reviews,
            sportsAvailable: [...new Set(courts.map(court => court.sport))],
            totalReviews: reviews.length
        };

        res.status(200).json({
            success: true,
            data: venueData
        });
    } catch (error) {
        console.error('Get venue error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching venue',
            error: error.message
        });
    }
};

// @desc    Get popular venues
// @route   GET /api/users/venues/popular
// @access  Private
exports.getPopularVenues = async (req, res) => {
    try {
        const venues = await Venue.find({ status: 'approved' })
            .select('name description address photos rating')
            .sort({ rating: -1 })
            .limit(6)
            .lean();

        // Add starting price and sports available
        for (let venue of venues) {
            const courts = await Court.find({ venue: venue._id })
                .select('sport pricePerHour')
                .lean();

            venue.sportsAvailable = [...new Set(courts.map(court => court.sport))];
            venue.startingPrice = courts.length > 0 ? Math.min(...courts.map(court => court.pricePerHour)) : 0;
        }

        res.status(200).json({
            success: true,
            data: venues
        });
    } catch (error) {
        console.error('Get popular venues error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching popular venues',
            error: error.message
        });
    }
};

// @desc    Get courts for a venue
// @route   GET /api/users/venues/:venueId/courts
// @access  Private
exports.getVenueCourts = async (req, res) => {
    try {
        const { venueId } = req.params;
        const { sport } = req.query;

        let query = { venue: venueId };
        if (sport) {
            query.sport = sport;
        }

        const courts = await Court.find(query)
            .select('name sport pricePerHour capacity operatingHours unavailableSlots')
            .populate('venue', 'name address');

        if (!courts.length) {
            return res.status(404).json({
                success: false,
                message: 'No courts found for this venue'
            });
        }

        res.status(200).json({
            success: true,
            data: courts
        });
    } catch (error) {
        console.error('Get venue courts error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching courts',
            error: error.message
        });
    }
};

// @desc    Get available time slots for a court
// @route   GET /api/users/courts/:courtId/availability
// @access  Private
exports.getCourtAvailability = async (req, res) => {
    try {
        const { courtId } = req.params;
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: 'Date is required'
            });
        }

        const court = await Court.findById(courtId).populate('venue', 'name');

        if (!court) {
            return res.status(404).json({
                success: false,
                message: 'Court not found'
            });
        }

        const selectedDate = new Date(date);
        const dayOfWeek = selectedDate.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        // Get operating hours
        const operatingHours = isWeekend ? court.operatingHours.weekends : court.operatingHours.weekdays;

        // Get existing bookings for the date
        const existingBookings = await Booking.find({
            court: courtId,
            date: {
                $gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
                $lt: new Date(selectedDate.setHours(23, 59, 59, 999))
            },
            bookingStatus: { $ne: 'cancelled' }
        }).select('timeSlots');

        // Get unavailable slots
        const unavailableSlots = court.unavailableSlots.filter(slot =>
            new Date(slot.date).toDateString() === selectedDate.toDateString()
        );

        // Generate all possible time slots (1-hour intervals)
        const timeSlots = [];
        const startHour = parseInt(operatingHours.open.split(':')[0]);
        const endHour = parseInt(operatingHours.close.split(':')[0]);

        for (let hour = startHour; hour < endHour; hour++) {
            const startTime = `${hour.toString().padStart(2, '0')}:00`;
            const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;

            // Check if slot is available
            const isBooked = existingBookings.some(booking =>
                booking.timeSlots.some(slot =>
                    slot.startTime === startTime ||
                    (slot.startTime < startTime && slot.endTime > startTime)
                )
            );

            const isUnavailable = unavailableSlots.some(slot =>
                slot.startTime <= startTime && slot.endTime > startTime
            );

            timeSlots.push({
                startTime,
                endTime,
                isAvailable: !isBooked && !isUnavailable,
                price: court.pricePerHour
            });
        }

        res.status(200).json({
            success: true,
            data: {
                court: {
                    id: court._id,
                    name: court.name,
                    sport: court.sport,
                    venue: court.venue,
                    pricePerHour: court.pricePerHour
                },
                date,
                timeSlots
            }
        });
    } catch (error) {
        console.error('Get court availability error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while checking availability',
            error: error.message
        });
    }
};

// @desc    Create a booking
// @route   POST /api/users/bookings
// @access  Private
exports.createBooking = async (req, res) => {
    try {
        const { courtId, venueId, date, timeSlots, paymentMethod, transactionId } = req.body;

        // Validate required fields
        if (!courtId || !venueId || !date || !timeSlots || !Array.isArray(timeSlots) || timeSlots.length === 0 || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: 'Court ID, venue ID, date, time slots, and payment method are required'
            });
        }

        // Validate court exists
        const court = await Court.findById(courtId).populate('venue');
        if (!court) {
            return res.status(404).json({
                success: false,
                message: 'Court not found'
            });
        }

        // Validate venue matches
        if (court.venue._id.toString() !== venueId) {
            return res.status(400).json({
                success: false,
                message: 'Court does not belong to the specified venue'
            });
        }

        // Check if venue is approved
        if (court.venue.status !== 'approved') {
            return res.status(400).json({
                success: false,
                message: 'Venue is not approved for bookings'
            });
        }

        const bookingDate = new Date(date);

        // Check if date is not in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (bookingDate < today) {
            return res.status(400).json({
                success: false,
                message: 'Cannot book for past dates'
            });
        }

        // Check for conflicting bookings
        const conflictingBookings = await Booking.find({
            court: courtId,
            date: {
                $gte: new Date(bookingDate.setHours(0, 0, 0, 0)),
                $lt: new Date(bookingDate.setHours(23, 59, 59, 999))
            },
            bookingStatus: { $ne: 'cancelled' }
        });

        // Check for time slot conflicts
        for (let requestedSlot of timeSlots) {
            for (let existingBooking of conflictingBookings) {
                for (let existingSlot of existingBooking.timeSlots) {
                    if (
                        (requestedSlot.startTime >= existingSlot.startTime && requestedSlot.startTime < existingSlot.endTime) ||
                        (requestedSlot.endTime > existingSlot.startTime && requestedSlot.endTime <= existingSlot.endTime) ||
                        (requestedSlot.startTime <= existingSlot.startTime && requestedSlot.endTime >= existingSlot.endTime)
                    ) {
                        return res.status(409).json({
                            success: false,
                            message: `Time slot ${requestedSlot.startTime}-${requestedSlot.endTime} is already booked`
                        });
                    }
                }
            }
        }

        console.log(timeSlots);
        // Calculate total amount
        const totalHours = timeSlots.reduce((total, slot) => {
            const start = new Date(`2000-01-01T${slot.startTime}`);
            const end = new Date(`2000-01-01T${slot.endTime}`);
            return total + (end - start) / (1000 * 60 * 60);
        }, 0);

        const totalAmount = totalHours * court.pricePerHour;

        // Create booking
        const booking = await Booking.create({
            user: req.user.id,
            court: courtId,
            venue: venueId,
            date: bookingDate,
            timeSlots,
            totalAmount,
            paymentMethod,
            transactionId,
            paymentStatus: 'paid', // Assuming payment is processed
            bookingStatus: 'confirmed'
        });

        // Populate booking data for response
        await booking.populate([
            { path: 'court', select: 'name sport pricePerHour' },
            { path: 'venue', select: 'name address' }
        ]);

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: booking
        });
    } catch (error) {
        console.error('Create booking error:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                error: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while creating booking',
            error: error.message
        });
    }
};

// @desc    Get user bookings
// @route   GET /api/users/bookings
// @access  Private
exports.getUserBookings = async (req, res) => {
    try {
        const { status, date, page = 1, limit = 10 } = req.query;

        let query = { user: req.user.id };

        // Filter by status
        if (status) {
            query.bookingStatus = status;
        }

        // Filter by date
        if (date) {
            const filterDate = new Date(date);
            query.date = {
                $gte: new Date(filterDate.setHours(0, 0, 0, 0)),
                $lt: new Date(filterDate.setHours(23, 59, 59, 999))
            };
        }

        const skip = (page - 1) * limit;

        const bookings = await Booking.find(query)
            .populate('court', 'name sport')
            .populate('venue', 'name address')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        const totalBookings = await Booking.countDocuments(query);

        // Add additional info to bookings
        const bookingsWithDetails = bookings.map(booking => ({
            ...booking,
            canCancel: booking.bookingStatus === 'confirmed' && new Date(booking.date) > new Date()
        }));

        res.status(200).json({
            success: true,
            data: bookingsWithDetails,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalBookings / limit),
                totalBookings,
                hasNextPage: skip + parseInt(limit) < totalBookings,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Get user bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching bookings',
            error: error.message
        });
    }
};

// @desc    Cancel a booking
// @route   PUT /api/users/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            user: req.user.id
        }).populate('court', 'name sport').populate('venue', 'name');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if booking can be cancelled
        if (booking.bookingStatus !== 'confirmed') {
            return res.status(400).json({
                success: false,
                message: 'Only confirmed bookings can be cancelled'
            });
        }

        // Check if booking date is in the future
        if (new Date(booking.date) <= new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel bookings for past dates'
            });
        }

        // Update booking status
        booking.bookingStatus = 'cancelled';
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
            data: booking
        });
    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while cancelling booking',
            error: error.message
        });
    }
};

// @desc    Add review for a venue
// @route   POST /api/users/venues/:venueId/reviews
// @access  Private
exports.addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const { venueId } = req.params;

        // Validate input
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating is required and must be between 1 and 5'
            });
        }

        // Check if venue exists and is approved
        const venue = await Venue.findOne({ _id: venueId, status: 'approved' });
        if (!venue) {
            return res.status(404).json({
                success: false,
                message: 'Venue not found or not approved'
            });
        }

        // Check if user has booked this venue
        const hasBooking = await Booking.findOne({
            user: req.user.id,
            venue: venueId,
            bookingStatus: 'completed'
        });

        if (!hasBooking) {
            return res.status(400).json({
                success: false,
                message: 'You can only review venues where you have completed bookings'
            });
        }

        // Create review
        const review = await Review.create({
            user: req.user.id,
            venue: venueId,
            rating,
            comment
        });

        await review.populate('user', 'fullName avatar');

        res.status(201).json({
            success: true,
            message: 'Review added successfully',
            data: review
        });
    } catch (error) {
        console.error('Add review error:', error);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this venue'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while adding review',
            error: error.message
        });
    }
};