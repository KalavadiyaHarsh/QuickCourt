require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Import routes
const authRoutes = require('./route/auth.routes');
// const userRoutes = require('./route/users');
// const venueRoutes = require('./route/venues');
// const bookingRoutes = require('./route/bookings');

// Initialize Express app
const app = express();

// Database connection
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/venues', venueRoutes);
// app.use('/api/bookings', bookingRoutes);

// Basic error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});