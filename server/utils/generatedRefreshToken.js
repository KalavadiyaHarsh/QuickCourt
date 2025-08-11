const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generatedRefreshToken = async (userId) => {
    const secretKey = process.env.SECRET_KEY_REFRESH_TOKEN || 'fallback_refresh_token_key_for_testing_12345';
    const token = await jwt.sign(
        { id: userId },
        secretKey,
        { expiresIn: '7d' }
    );

    const updateRefreshTokenUser = await User.updateOne(
        { _id: userId },
        { refresh_token: token }
    );

    return token;
};

module.exports = generatedRefreshToken;