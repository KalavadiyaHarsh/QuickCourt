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

        // Get recent venues
        const recentVenues = await Venue.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name address status createdAt');

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
                recentUsers,
                recentVenues,
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
        // Role check is handled by middleware
        const { page = 1, limit = 10, search = '', role = '', status = '' } = req.query;

        // Build query
        let query = {};
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        if (role && role !== 'all') {
            query.role = role;
        }
        if (status && status !== 'all') {
            query.status = status;
        }

        const skip = (page - 1) * limit;

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalUsers = await User.countDocuments(query);

        res.json({
            success: true,
            data: users,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalUsers / limit),
                totalUsers,
                hasNextPage: skip + users.length < totalUsers,
                hasPrevPage: page > 1
            }
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
        // Role check is handled by middleware
        const { userId } = req.params;
        const { status } = req.body;

        if (!['active', 'inactive', 'suspended'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be active, inactive, or suspended.'
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { status },
            { new: true }
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
        // Role check is handled by middleware
        const { page = 1, limit = 10, search = '', status = '', city = '' } = req.query;

        // Build query
        let query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        if (status && status !== 'all') {
            query.status = status;
        }
        if (city) {
            query['address.city'] = { $regex: city, $options: 'i' };
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
        // Role check is handled by middleware
        const { venueId } = req.params;
        const { status } = req.body;

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be pending, approved, or rejected.'
            });
        }

        const venue = await Venue.findByIdAndUpdate(
            venueId,
            { status },
            { new: true }
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
        // Role check is handled by middleware
        const { page = 1, limit = 10, status = '', paymentStatus = '' } = req.query;

        // Build query
        let query = {};
        if (status && status !== 'all') {
            query.bookingStatus = status;
        }
        if (paymentStatus && paymentStatus !== 'all') {
            query.paymentStatus = paymentStatus;
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