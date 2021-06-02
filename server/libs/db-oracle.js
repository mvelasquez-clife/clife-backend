const oracledb = require('oracledb');
const dbParams = require('./../database');
const responseParams = {
    outFormat: oracledb.OBJECT
};
const cursorParams = {
    outFormat: oracledb.OBJECT,
    resultSet: true
};
const types = {
    number: oracledb.NUMBER,
    string: oracledb.STRING,
    cursor: oracledb.CURSOR,
    date : oracledb.DATE,
    clob: oracledb.CLOB
};

module.exports = {
    select: (query, params) => { // devuelve un result set a partir de un select
        /*
        params = [
            { name: 'param', value: 1234 }
        ]
        */
        let parametros = {};
        for (let parametro of params) {
            parametros[parametro.name] = { val: parametro.value };
        }
        return new Promise((resolve, reject) => {
            oracledb.getConnection(dbParams, (err, conn) => {
                if (err) {
                    console.error(err);
                    resolve({
                        error: err.message
                    });
                }
                conn.execute(query, parametros, responseParams, (error, result) => {
                    if (error) {
                        console.error(error);
                        if (conn) conn.close();
                        resolve({
                            error: error.message
                        });
                        return;
                    }
                    conn.close();
                    resolve({
                        rows: result.rows ? result.rows : []
                    });
                });
            });
        });
    },
    statement: (query, params) => {
        /*
        params = [
            { name: 'param', io: 'in/out', type: 'number,string' }
        ]
        */
        let parametros = {};
        for (let parametro of params) {
            if (parametro.io == 'in') {
                parametros[parametro.name] = { val: parametro.value };
            }
            else {
                parametros[parametro.name] = {
                    dir: oracledb.BIND_OUT,
                    type: types[parametro.type]
                };
            }
        }
        return new Promise((resolve, reject) => {
            oracledb.getConnection(dbParams, (err, conn) => {
                if (err) {
                    console.error(err);
                    if (conn) conn.close();
                    resolve({
                        error: err.message
                    });
                }
                conn.execute(query, parametros, responseParams, (error, result) => {
                    conn.close();
                    if (error) {
                        resolve({
                            error: error.message
                        });
                    }
                    else {
                        resolve({
                            out: result.outBinds
                        });
                    }
                });
            });
        });
    },
    resultSet: async (query, params = []) => {
        let parametros = {};
        let output = {};
        for (let parametro of params) {
            if (parametro.io == 'in') {
                parametros[parametro.name] = { val: parametro.value };
            }
            else {
                parametros[parametro.name] = {
                    dir: oracledb.BIND_OUT,
                    type: types[parametro.type]
                };
            }
        }
        // go!
        try {
            const connection = await oracledb.getConnection(dbParams);
            const result = await connection.execute(query, parametros, cursorParams);
            //
            let outBinds = result.outBinds;
            for (let key in outBinds) {
                let resultSet = outBinds[key];
                // if (typeof outBinds[key] == 'object') {
                switch (parametros[key].type) {
                    case oracledb.CURSOR:
                        let array = [];
                        while (fila = await resultSet.getRow()) {
                            array.push(fila);
                        }
                        output[key] = array;
                        break;
                    case oracledb.CLOB:
                        output[key] = await outBinds[key].getData();
                        break;
                    default:
                        output[key] = outBinds[key];
                        break;
                }
            }
            connection.close();
        }
        catch (error) {
            output = {
                error: error.message
            };
        }
        return output;
    }
};