const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    console.log('Auth middleware - Token:', token ? 'Present' : 'Missing');
    console.log('Auth middleware - Headers:', req.headers.authorization);

    // Make sure token exists
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }

    try {
        // Verify token
        const secretKey = process.env.SECRET_KEY_ACCESS_TOKEN || 'fallback_secret_key_for_testing_12345';
        console.log('Auth middleware - Verifying token with secret:', secretKey ? 'Present' : 'Missing');
        const decoded = jwt.verify(token, secretKey);

        console.log('Auth middleware - Token decoded:', decoded);

        // Get user from token
        const user = await User.findById(decoded.id);

        console.log('Auth middleware - User found:', user ? 'Yes' : 'No');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: 'Please verify your email first'
            });
        }

        // Check if user is suspended
        if (user.status === 'suspended') {
            return res.status(403).json({
                success: false,
                message: 'Your account has been suspended'
            });
        }

        console.log('Auth middleware - Setting req.user:', user);
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired',
                code: 'TOKEN_EXPIRED'
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        console.log('Authorize middleware - req.user:', req.user);
        console.log('Authorize middleware - Required roles:', roles);
        console.log('Authorize middleware - User role:', req.user?.role);
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized to access this route`
            });
        }
        next();
    };
};