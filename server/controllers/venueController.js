const Venue = require('../models/Venue');
const Court = require('../models/Court');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');

// @desc    Get all venues
// @route   GET /api/v1/venues
// @access  Public
exports.getVenues = asyncHandler(async (req, res, next) => {
    // Copy req.query
    const reqQuery = { ...req.query, status: 'approved' };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    let query = Venue.find(JSON.parse(queryStr)).populate('courts');

    // Select fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Venue.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const venues = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        };
    }

    res.status(200).json({
        success: true,
        count: venues.length,
        pagination,
        data: venues
    });
});

// @desc    Get single venue
// @route   GET /api/v1/venues/:id
// @access  Public
exports.getVenue = asyncHandler(async (req, res, next) => {
    const venue = await Venue.findById(req.params.id)
        .populate({
            path: 'courts',
            select: 'name sport pricePerHour operatingHours'
        })
        .populate({
            path: 'reviews',
            select: 'rating comment user createdAt',
            populate: {
                path: 'user',
                select: 'fullName avatar'
            }
        });

    if (!venue) {
        return next(
            new ErrorResponse(`Venue not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: venue
    });
});

// @desc    Create venue
// @route   POST /api/v1/venues
// @access  Private (Facility Owner)
exports.createVenue = asyncHandler(async (req, res, next) => {
    // Add user to req.body
    req.body.owner = req.user.id;

    // Check for existing venue
    const existingVenue = await Venue.findOne({ owner: req.user.id });

    if (existingVenue) {
        return next(
            new ErrorResponse(
                `User ${req.user.id} has already created a venue`,
                400
            )
        );
    }

    // Geocode address
    const loc = await geocoder.geocode(req.body.address);
    req.body.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode
    };

    // Create venue
    const venue = await Venue.create(req.body);

    res.status(201).json({
        success: true,
        data: venue
    });
});

// @desc    Update venue
// @route   PUT /api/v1/venues/:id
// @access  Private (Facility Owner)
exports.updateVenue = asyncHandler(async (req, res, next) => {
    let venue = await Venue.findById(req.params.id);

    if (!venue) {
        return next(
            new ErrorResponse(`Venue not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is venue owner
    if (venue.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to update this venue`,
                401
            )
        );
    }

    venue = await Venue.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: venue
    });
});

// @desc    Delete venue
// @route   DELETE /api/v1/venues/:id
// @access  Private (Facility Owner or Admin)
exports.deleteVenue = asyncHandler(async (req, res, next) => {
    const venue = await Venue.findById(req.params.id);

    if (!venue) {
        return next(
            new ErrorResponse(`Venue not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is venue owner or admin
    if (venue.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to delete this venue`,
                401
            )
        );
    }

    await venue.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Get venues within a radius
// @route   GET /api/v1/venues/radius/:zipcode/:distance
// @access  Public
exports.getVenuesInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide distance by radius of Earth (3,963 mi / 6,378 km)
    const radius = distance / 3963;

    const venues = await Venue.find({
        location: {
            $geoWithin: { $centerSphere: [[lng, lat], radius] }
        },
        status: 'approved'
    });

    res.status(200).json({
        success: true,
        count: venues.length,
        data: venues
    });
});