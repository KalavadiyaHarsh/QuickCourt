const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a court name'],
        trim: true
    },
    sport: {
        type: String,
        required: true,
        enum: [
            'badminton', 'tennis', 'table-tennis',
            'basketball', 'football', 'volleyball',
            'squash', 'cricket'
        ]
    },
    venue: {
        type: mongoose.Schema.ObjectId,
        ref: 'Venue',
        required: true
    },
    pricePerHour: {
        type: Number,
        required: [true, 'Please add price per hour'],
        min: [0, 'Price cannot be negative']
    },
    capacity: {
        type: Number,
        default: 2
    },
    operatingHours: {
        weekdays: {
            open: { type: String, default: '06:00' },
            close: { type: String, default: '22:00' }
        },
        weekends: {
            open: { type: String, default: '08:00' },
            close: { type: String, default: '20:00' }
        }
    },
    unavailableSlots: [{
        date: { type: Date, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        reason: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent duplicate court names per venue
courtSchema.index({ name: 1, venue: 1 }, { unique: true });

module.exports = mongoose.model('Court', courtSchema);