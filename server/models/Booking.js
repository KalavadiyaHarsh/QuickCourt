const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    court: {
        type: mongoose.Schema.ObjectId,
        ref: 'Court',
        required: true
    },
    venue: {
        type: mongoose.Schema.ObjectId,
        ref: 'Venue',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    timeSlots: [{
        startTime: { type: String, required: true },
        endTime: { type: String, required: true }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    bookingStatus: {
        type: String,
        enum: ['confirmed', 'cancelled', 'completed'],
        default: 'confirmed'
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'wallet', 'cash'],
        required: true
    },
    transactionId: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent double booking for same court and time
bookingSchema.index({ court: 1, date: 1, 'timeSlots.startTime': 1 }, { unique: true });

// Calculate duration in hours
bookingSchema.virtual('duration').get(function () {
    return this.timeSlots.reduce((total, slot) => {
        const start = new Date(`2000-01-01T${slot.startTime}`);
        const end = new Date(`2000-01-01T${slot.endTime}`);
        return total + (end - start) / (1000 * 60 * 60);
    }, 0);
});

module.exports = mongoose.model('Booking', bookingSchema);