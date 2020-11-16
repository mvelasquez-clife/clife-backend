const fs = require('fs');
const path = require('path');

module.exports = {
    log: (tipo, mensaje) => {
        let ahora = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ')[0];
        let ruta = path.resolve('../../logs/' + tipo + '/' + ahora + '.log');
        return new Promise((resolve, reject) => {
            fs.writeFile(ruta, mensaje, {
                    encoding: 'utf8',
                    flag: 'a' // flag that specifies that it will append stuff
                },() => {
                    resolve(true);
                }
            );
        });
    }
};