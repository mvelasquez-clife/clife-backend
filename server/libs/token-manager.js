const jwt = require('jsonwebtoken');
const params = require('./../config/jwt');

const TokenManager = {
    GeneraToken: (tokenData) => {
        return jwt.sign(tokenData, params.secret, params.expires);
    },
    ObtenerDatos: (token) => {
        let result;
        try {
            result = jwt.decode(token, params.secret);
        }
        catch (err) {
            result = {
                error: err
            };
        }
        return result;
    }
};

module.exports = TokenManager;