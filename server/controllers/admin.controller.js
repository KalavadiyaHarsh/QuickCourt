const User = require('../models/User');
const Venue = require('../models/Venue');
const Booking = require('../models/Booking');
const Court = require('../models/Court');

// Get admin dashboard statistics
const getAdminDashboard = async (req, res) => {
    try {
        // Role check is handled by middleware, so req.user will always be admin
        console.log('Admin user:', req.user);

        // Get total counts
        const totalUsers = await User.countDocuments();
        const totalVenues = await Venue.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const totalCourts = await Court.countDocuments();

        // Get recent users
        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('fullName email role status createdAt');

        // Get pending venues for approval
        const pendingVenues = await Venue.find({ status: 'pending' })
            .populate('owner', 'fullName email')
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name address status createdAt owner');

        // Get recent bookings
        const recentBookings = await Booking.find()
            .populate('user', 'fullName email')
            .populate('venue', 'name')
            .sort({ createdAt: -1 })
            .limit(5)
            .select('totalAmount paymentStatus bookingStatus createdAt');

        // Get revenue statistics
        const totalRevenue = await Booking.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        const monthlyRevenue = await Booking.aggregate([
            { 
                $match: { 
                    paymentStatus: 'paid',
                    createdAt: { 
                        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) 
                    } 
                } 
            },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        // Get user statistics by role
        const userStats = await User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);

        // Get venue statistics by status
        const venueStats = await Venue.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        res.json({
            success: true,
            data: {
                stats: {
                    totalUsers,
                    totalVenues,
                    totalBookings,
                    totalCourts,
                    totalRevenue: totalRevenue[0]?.total || 0,
                    monthlyRevenue: monthlyRevenue[0]?.total || 0
                },
                userStats,
                venueStats,
                recentUsers,
                pendingVenues,
                recentBookings
            }
        });

    } catch (error) {
        console.error('Error in getAdminDashboard:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: users
        });

    } catch (error) {
        console.error('Error in getAllUsers:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update user status (admin only)
const updateUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status } = req.body;

        if (!['active', 'suspended', 'pending'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be active, suspended, or pending'
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { status },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User status updated successfully',
            data: user
        });

    } catch (error) {
        console.error('Error in updateUserStatus:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get all venues (admin only)
const getAllVenues = async (req, res) => {
    try {
        const venues = await Venue.find()
            .populate('owner', 'fullName email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: venues
        });

    } catch (error) {
        console.error('Error in getAllVenues:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update venue status (admin only)
const updateVenueStatus = async (req, res) => {
    try {
        const { venueId } = req.params;
        const { status } = req.body;

        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be approved, rejected, or pending'
            });
        }

        const venue = await Venue.findByIdAndUpdate(
            venueId,
            { status },
            { new: true, runValidators: true }
        ).populate('owner', 'fullName email');

        if (!venue) {
            return res.status(404).json({
                success: false,
                message: 'Venue not found'
            });
        }

        res.json({
            success: true,
            message: 'Venue status updated successfully',
            data: venue
        });

    } catch (error) {
        console.error('Error in updateVenueStatus:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get all bookings (admin only)
const getAllBookings = async (req, res) => {
    try {
        const { page = 1, limit = 20, status = '' } = req.query;

        let query = {};
        if (status && status !== 'all') {
            query.bookingStatus = status;
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
        console.error('Error in getAllBookings:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    getAdminDashboard,
    getAllUsers,
    updateUserStatus,
    getAllVenues,
    updateVenueStatus,
    getAllBookings
}; 