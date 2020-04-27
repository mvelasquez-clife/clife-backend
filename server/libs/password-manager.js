const bcrypt = require('bcrypt');
const params = require('./../config/bcrypt');
const { resultSet } = require('./db-oracle');

module.exports = {
    encriptar: (clave) => {
        return new Promise((resolve, reject) => {
            bcrypt.hash(clave, params.saltRounds, function (err, hash) {
                if (err) {
                    reject({
                        error: err
                    });
                    return;
                }
                resolve({
                    result: hash
                });
            });
        });
    },
    validar: (clave, hash) => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(clave, hash, (err, result) => {
                if (err) {
                    reject({
                        error: err
                    });
                    return;
                }
                resolve({
                    result: result
                });
            });
        });
    }
};