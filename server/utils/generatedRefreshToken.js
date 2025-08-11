const jwt = require('jsonwebtoken');

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_KEY_REFRESH_TOKEN, {
        expiresIn: '7d'
    });
};

module.exports = generateRefreshToken;