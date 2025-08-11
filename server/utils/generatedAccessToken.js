const jwt = require('jsonwebtoken');

const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_KEY_ACCESS_TOKEN, {
        expiresIn: '5h'
    });
};

module.exports = generateAccessToken;