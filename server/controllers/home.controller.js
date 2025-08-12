const Venue = require('../models/Venue');
const Court = require('../models/Court');
const Booking = require('../models/Booking');

// @desc    Get home page data (popular venues and sports)
// @route   GET /api/home
// @access  Public
exports.getHomeData = async (req, res) => {
    try {
        // Get popular venues (top rated with at least 1 review)
        const popularVenues = await Venue.aggregate([
            { $match: { status: 'approved', rating: { $gt: 0 } } },
            { $sort: { rating: -1, createdAt: -1 } },
            { $limit: 6 },
            {
                $project: {
                    name: 1,
                    description: 1,
                    'address.city': 1,
                    'address.state': 1,
                    photos: 1,
                    rating: 1
                }
            }
        ]);

        // Add sports and starting price for each popular venue
        for (let venue of popularVenues) {
            const courts = await Court.find({ venue: venue._id })
                .select('sport pricePerHour')
                .lean();

            venue.sportsAvailable = [...new Set(courts.map(court => court.sport))];
            venue.startingPrice = courts.length > 0 ? Math.min(...courts.map(court => court.pricePerHour)) : 0;
        }

        // Get popular sports (sports with most courts)
        const popularSports = await Court.aggregate([
            {
                $lookup: {
                    from: 'venues',
                    localField: 'venue',
                    foreignField: '_id',
                    as: 'venue'
                }
            },
            {
                $match: {
                    'venue.status': 'approved'
                }
            },
            {
                $group: {
                    _id: '$sport',
                    courtCount: { $sum: 1 },
                    venueCount: { $addToSet: '$venue._id' },
                    avgPrice: { $avg: '$pricePerHour' }
                }
            },
            {
                $addFields: {
                    venueCount: { $size: '$venueCount' }
                }
            },
            { $sort: { courtCount: -1 } },
            { $limit: 8 }
        ]);

        // Format popular sports data
        const sportsData = popularSports.map(sport => ({
            sport: sport._id,
            courtCount: sport.courtCount,
            venueCount: sport.venueCount,
            averagePrice: Math.round(sport.avgPrice * 100) / 100,
            displayName: sport._id.charAt(0).toUpperCase() + sport._id.slice(1).replace('-', ' ')
        }));

        // Get quick stats
        const totalVenues = await Venue.countDocuments({ status: 'approved' });
        const totalBookings = await Booking.countDocuments();
        const totalSports = await Court.distinct('sport').countDocuments();

        res.status(200).json({
            success: true,
            data: {
                popularVenues,
                popularSports: sportsData,
                stats: {
                    totalVenues,
                    totalBookings,
                    totalSports: totalSports || 0
                }
            }
        });
    } catch (error) {
        console.error('Get home data error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching home data',
            error: error.message
        });
    }
};

// @desc    Search venues with advanced filters
// @route   GET /api/home/search
// @access  Public
exports.searchVenues = async (req, res) => {
    try {
        const {
            q,           // search query
            sport,       // sport type
            city,        // city filter
            minPrice,    // minimum price per hour
            maxPrice,    // maximum price per hour
            rating,      // minimum rating
            amenities,   // comma-separated amenities
            page = 1,
            limit = 12
        } = req.query;

        // Build venue query
        let venueQuery = { status: 'approved' };

        // Text search
        if (q) {
            venueQuery.$or = [
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { 'address.city': { $regex: q, $options: 'i' } }
            ];
        }

        // City filter
        if (city) {
            venueQuery['address.city'] = { $regex: city, $options: 'i' };
        }

        // Rating filter
        if (rating) {
            venueQuery.rating = { $gte: parseFloat(rating) };
        }

        // Amenities filter
        if (amenities) {
            const amenityList = amenities.split(',').map(a => a.trim());
            venueQuery.amenities = { $in: amenityList };
        }

        // Get venues that match initial criteria
        let venues = await Venue.find(venueQuery)
            .select('name description address photos rating amenities createdAt')
            .lean();

        // Filter by sport and price at court level
        let filteredVenues = [];

        for (let venue of venues) {
            const courts = await Court.find({ venue: venue._id })
                .select('sport pricePerHour name')
                .lean();

            if (courts.length === 0) continue;

            // Filter by sport
            let relevantCourts = courts;
            if (sport) {
                relevantCourts = courts.filter(court => court.sport === sport);
                if (relevantCourts.length === 0) continue;
            }

            // Filter by price
            if (minPrice || maxPrice) {
                relevantCourts = relevantCourts.filter(court => {
                    const price = court.pricePerHour;
                    const minValid = !minPrice || price >= parseFloat(minPrice);
                    const maxValid = !maxPrice || price <= parseFloat(maxPrice);
                    return minValid && maxValid;
                });
                if (relevantCourts.length === 0) continue;
            }

            // Add court data to venue
            venue.courts = relevantCourts;
            venue.sportsAvailable = [...new Set(relevantCourts.map(court => court.sport))];
            venue.startingPrice = Math.min(...relevantCourts.map(court => court.pricePerHour));
            venue.courtCount = relevantCourts.length;

            filteredVenues.push(venue);
        }

        // Sort venues by rating (descending)
        filteredVenues.sort((a, b) => b.rating - a.rating);

        // Pagination
        const skip = (page - 1) * limit;
        const paginatedVenues = filteredVenues.slice(skip, skip + parseInt(limit));

        res.status(200).json({
            success: true,
            data: paginatedVenues,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(filteredVenues.length / limit),
                totalResults: filteredVenues.length,
                hasNextPage: skip + parseInt(limit) < filteredVenues.length,
                hasPrevPage: page > 1
            },
            filters: {
                appliedFilters: {
                    search: q || null,
                    sport: sport || null,
                    city: city || null,
                    minPrice: minPrice || null,
                    maxPrice: maxPrice || null,
                    rating: rating || null,
                    amenities: amenities ? amenities.split(',') : null
                }
            }
        });
    } catch (error) {
        console.error('Search venues error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while searching venues',
            error: error.message
        });
    }
};

// @desc    Get venue suggestions (for autocomplete)
// @route   GET /api/home/suggestions
// @access  Public
exports.getVenueSuggestions = async (req, res) => {
    try {
        const { q, limit = 5 } = req.query;

        if (!q || q.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Search query must be at least 2 characters long'
            });
        }

        const suggestions = await Venue.find({
            status: 'approved',
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { 'address.city': { $regex: q, $options: 'i' } }
            ]
        })
            .select('name address.city address.state')
            .limit(parseInt(limit))
            .lean();

        // Format suggestions
        const formattedSuggestions = suggestions.map(venue => ({
            id: venue._id,
            name: venue.name,
            location: `${venue.address.city}, ${venue.address.state}`,
            type: 'venue'
        }));

        // Also get city suggestions
        const citySuggestions = await Venue.distinct('address.city', {
            status: 'approved',
            'address.city': { $regex: q, $options: 'i' }
        });

        const formattedCities = citySuggestions.slice(0, 3).map(city => ({
            name: city,
            type: 'city'
        }));

        res.status(200).json({
            success: true,
            data: {
                venues: formattedSuggestions,
                cities: formattedCities
            }
        });
    } catch (error) {
        console.error('Get suggestions error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching suggestions',
            error: error.message
        });
    }
};

// @desc    Get available sports
// @route   GET /api/home/sports
// @access  Public
exports.getAvailableSports = async (req, res) => {
    try {
        const sports = await Court.aggregate([
            {
                $lookup: {
                    from: 'venues',
                    localField: 'venue',
                    foreignField: '_id',
                    as: 'venue'
                }
            },
            {
                $match: {
                    'venue.status': 'approved'
                }
            },
            {
                $group: {
                    _id: '$sport',
                    courtCount: { $sum: 1 },
                    venues: { $addToSet: '$venue._id' },
                    avgPrice: { $avg: '$pricePerHour' },
                    minPrice: { $min: '$pricePerHour' },
                    maxPrice: { $max: '$pricePerHour' }
                }
            },
            {
                $addFields: {
                    venueCount: { $size: '$venues' }
                }
            },
            {
                $project: {
                    sport: '$_id',
                    courtCount: 1,
                    venueCount: 1,
                    avgPrice: { $round: ['$avgPrice', 2] },
                    minPrice: 1,
                    maxPrice: 1,
                    displayName: {
                        $concat: [
                            { $toUpper: { $substr: ['$_id', 0, 1] } },
                            { $substr: ['$_id', 1, -1] }
                        ]
                    }
                }
            },
            { $sort: { courtCount: -1 } }
        ]);

        // Format sport names properly (handle hyphenated names)
        const formattedSports = sports.map(sport => ({
            ...sport,
            displayName: sport.sport
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
        }));

        res.status(200).json({
            success: true,
            data: formattedSports
        });
    } catch (error) {
        console.error('Get available sports error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching sports',
            error: error.message
        });
    }
};

// @desc    Get cities with venues
// @route   GET /api/home/cities
// @access  Public
exports.getAvailableCities = async (req, res) => {
    try {
        const cities = await Venue.aggregate([
            { $match: { status: 'approved' } },
            {
                $group: {
                    _id: {
                        city: '$address.city',
                        state: '$address.state'
                    },
                    venueCount: { $sum: 1 }
                }
            },
            {
                $project: {
                    city: '$_id.city',
                    state: '$_id.state',
                    venueCount: 1,
                    displayName: {
                        $concat: ['$_id.city', ', ', '$_id.state']
                    }
                }
            },
            { $sort: { venueCount: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: cities
        });
    } catch (error) {
        console.error('Get available cities error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching cities',
            error: error.message
        });
    }
};