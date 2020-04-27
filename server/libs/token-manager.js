const jwt = require('jsonwebtoken');
const params = require('./../config/jwt');

const TokenManager = {
    GeneraToken: (tokenData) => {
        return jwt.sign(tokenData, params.secret, params.expires);
    }
};

module.exports = TokenManager;