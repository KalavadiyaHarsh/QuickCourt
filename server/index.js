require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

// Import routes
const authRoutes = require('./route/auth.routes');
const userRoutes = require('./route/user.routes');
const homeRoutes = require('./route/home.routes');
const adminRoutes = require('./route/admin.routes');
const facilityOwnerRoutes = require('./route/facilityOwner.routes');

// const venueRoutes = require('./route/venues');
// const bookingRoutes = require('./route/bookings');

// Initialize Express app
const app = express();

// Database connection
console.log('Attempting to connect to MongoDB...');
console.log('MongoDB URL:', process.env.MONGODB_URL ? 'Set' : 'Not set');

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('✅ Connected to MongoDB successfully');
        console.log('Database:', mongoose.connection.name);
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        console.error('Please check your MONGODB_URL environment variable');
    });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
console.log('Registering routes...');
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/home', homeRoutes);
app.use('/admin', adminRoutes);
app.use('/api/facility-owner', facilityOwnerRoutes);
console.log('✅ All routes registered successfully');

// Test endpoint to verify server is working
app.get('/test', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Server is working!',
        routes: ['/api/auth', '/api/users', '/api/home', '/admin', '/api/facility-owner'],
        timestamp: new Date().toISOString()
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'QuickCourt API is running',
        timestamp: new Date().toISOString()
    });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// Basic error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`🚀 QuickCourt Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
});