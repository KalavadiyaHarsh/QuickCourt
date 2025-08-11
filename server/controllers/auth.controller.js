const User = require('../models/User');
const sendEmailFun = require('../utils/sendEmail');
const VerificationEmail = require('../utils/verifyEmailTemplate');
const generatedAccessToken = require('../utils/generatedAccessToken');
const generatedRefreshToken = require('../utils/generatedRefreshToken');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register user with email verification
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email }).select('+password');
        if (existingUser) {
            if (existingUser.isVerified) {
                return res.status(400).json({
                    success: false,
                    message: 'User already exists with this email'
                });
            }
            // If user exists but not verified, update and resend OTP
            const otp = generateOTP();
            const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

            existingUser.fullName = fullName;
            existingUser.password = password;
            existingUser.role = role || 'user';
            existingUser.otp = otp;
            existingUser.otpExpire = otpExpire;

            await existingUser.save();

            // Send verification email
            const emailSent = await sendEmailFun(
                email,
                'Email Verification - QuickCourt',
                `Your OTP is: ${otp}`,
                VerificationEmail(fullName, otp)
            );

            if (!emailSent) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to send verification email'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'User updated. Please verify your email with the OTP sent to your inbox',
                data: {
                    userId: existingUser._id,
                    email: existingUser.email,
                    isVerified: false
                }
            });
        }

        // Generate OTP
        const otp = generateOTP();
        const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Create user
        const user = await User.create({
            fullName,
            email,
            password,
            role: role || 'user',
            otp,
            otpExpire,
            isVerified: false
        });

        // Send verification email
        const emailSent = await sendEmailFun(
            email,
            'Email Verification - QuickCourt',
            `Your OTP is: ${otp}`,
            VerificationEmail(fullName, otp)
        );

        if (!emailSent) {
            // Delete user if email fails
            await User.findByIdAndDelete(user._id);
            return res.status(500).json({
                success: false,
                message: 'Failed to send verification email'
            });
        }

        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please verify your email with the OTP sent to your inbox',
            data: {
                userId: user._id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                isVerified: false
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: error.message
        });
    }
};

// @desc    Verify email with OTP
// @route   POST /api/auth/verify-email
// @access  Public
exports.verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required'
            });
        }

        // Find user with OTP
        const user = await User.findOne({
            email,
            otp,
            otpExpire: { $gt: Date.now() }
        }).select('+otp +otpExpire');

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP or OTP has expired'
            });
        }

        // Verify user
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpire = undefined;
        await user.save();

        // Generate tokens
        const accessToken = await generatedAccessToken(user._id);
        const refreshToken = await generatedRefreshToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Email verified successfully',
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                    isVerified: true
                },
                accessToken,
                refreshToken
            }
        });

    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during email verification',
            error: error.message
        });
    }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const user = await User.findOne({ email, isVerified: false });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found or already verified'
            });
        }

        // Generate new OTP
        const otp = generateOTP();
        const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.otp = otp;
        user.otpExpire = otpExpire;
        await user.save();

        // Send verification email
        const emailSent = await sendEmailFun(
            email,
            'Email Verification - QuickCourt',
            `Your new OTP is: ${otp}`,
            VerificationEmail(user.fullName, otp)
        );

        if (!emailSent) {
            return res.status(500).json({
                success: false,
                message: 'Failed to send verification email'
            });
        }

        res.status(200).json({
            success: true,
            message: 'New OTP sent successfully to your email'
        });

    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while resending OTP',
            error: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Check if user exists
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if user is verified
        if (!user.isVerified) {
            // Generate and send new OTP for unverified users
            const otp = generateOTP();
            const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

            user.otp = otp;
            user.otpExpire = otpExpire;
            await user.save();

            const emailSent = await sendEmailFun(
                email,
                'Email Verification - QuickCourt',
                `Your OTP is: ${otp}`,
                VerificationEmail(user.fullName, otp)
            );

            return res.status(403).json({
                success: false,
                message: 'Please verify your email first. New OTP sent to your email.',
                needsVerification: true,
                email: user.email
            });
        }

        // Check password
        const isPasswordMatch = await user.matchPassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if user is suspended
        if (user.status === 'suspended') {
            return res.status(403).json({
                success: false,
                message: 'Your account has been suspended. Please contact support.'
            });
        }

        // Generate tokens
        const accessToken = await generatedAccessToken(user._id);
        const refreshToken = await generatedRefreshToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar,
                    isVerified: user.isVerified,
                    status: user.status
                },
                accessToken,
                refreshToken
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: error.message
        });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
    try {
        const userId = req.user.id;

        // Clear refresh token from database
        await User.findByIdAndUpdate(userId, {
            $unset: { refresh_token: 1 }
        });

        res.status(200).json({
            success: true,
            message: 'Logout successful'
        });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during logout',
            error: error.message
        });
    }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token is required'
            });
        }

        // Verify refresh token
        const refreshSecretKey = process.env.SECRET_KEY_REFRESH_TOKEN || 'fallback_refresh_token_key_for_testing_12345';
        const decoded = jwt.verify(refreshToken, refreshSecretKey);
        const user = await User.findById(decoded.id).select('+refresh_token');

        if (!user || user.refresh_token !== refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }

        // Generate new tokens
        const newAccessToken = await generatedAccessToken(user._id);
        const newRefreshToken = await generatedRefreshToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            data: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            }
        });

    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid or expired refresh token',
            error: error.message
        });
    }
};