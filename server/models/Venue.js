const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
        coordinates: {
            type: [Number], // [longitude, latitude]
            index: '2dsphere'
        }
    },
    photos: {
        type: [String],
        default: []
    },
    amenities: {
        type: [String],
        enum: [
            'parking', 'showers', 'lockers',
            'cafeteria', 'wifi', 'equipment-rental'
        ],
        default: []
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    rejectionReason: {
        type: String,
        select: false
    },
    rating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must not be more than 5'],
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Virtual field to populate courts
venueSchema.virtual('courts', {
    ref: 'Court',
    localField: '_id',
    foreignField: 'venue'
});

// Ensure virtual fields are serialized
venueSchema.set('toJSON', { virtuals: true });
venueSchema.set('toObject', { virtuals: true });

// Calculate average rating for venue
venueSchema.statics.getAverageRating = async function (venueId) {
    const obj = await this.aggregate([
        {
            $match: { _id: venueId }
        },
        {
            $lookup: {
                from: 'reviews',
                localField: '_id',
                foreignField: 'venue',
                as: 'reviews'
            }
        },
        {
            $addFields: {
                averageRating: { $avg: '$reviews.rating' }
            }
        }
    ]);

    try {
        await this.model('Venue').findByIdAndUpdate(venueId, {
            rating: obj[0]?.averageRating || 0
        });
    } catch (err) {
        console.error(err);
    }
};

module.exports = mongoose.model('Venue', venueSchema);