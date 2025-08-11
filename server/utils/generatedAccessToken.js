const jwt = require('jsonwebtoken');

const generatedAccessToken = async (userId) => {
    const secretKey = process.env.SECRET_KEY_ACCESS_TOKEN || 'fallback_secret_key_for_testing_12345';
    const token = await jwt.sign(
        { id: userId },
        secretKey,
        { expiresIn: '5h' }
    );
    return token;
};

module.exports = generatedAccessToken;