const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    venue: {
        type: mongoose.Schema.ObjectId,
        ref: 'Venue',
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Please add a rating between 1 and 5']
    },
    comment: {
        type: String,
        maxlength: [500, 'Review cannot be more than 500 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent user from submitting more than one review per venue
reviewSchema.index({ venue: 1, user: 1 }, { unique: true });

// Update venue rating after save or delete
reviewSchema.post('save', async function () {
    await this.model('Venue').getAverageRating(this.venue);
});

reviewSchema.post('remove', async function () {
    await this.model('Venue').getAverageRating(this.venue);
});

module.exports = mongoose.model('Review', reviewSchema);