const express = require('express');
const {
    getHomeData,
    searchVenues,
    getVenueSuggestions,
    getAvailableSports,
    getAvailableCities
} = require('../controllers/home.controller');

const router = express.Router();

// Public routes - no authentication required
router.get('/', getHomeData);
router.get('/search', searchVenues);
router.get('/suggestions', getVenueSuggestions);
router.get('/sports', getAvailableSports);
router.get('/cities', getAvailableCities);

module.exports = router;