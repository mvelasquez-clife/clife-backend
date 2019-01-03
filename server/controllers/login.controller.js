const oracledb = require('oracledb');
const dbParams = require('../database');
const jwt = require('jsonwebtoken');

const jwtKey = require('../jwt');

const loginCtrl = {
    doLogin: (req, res) => {
        const {usuario, clave} = req.body;
        oracledb.getConnection(
            dbParams,
            (err, connection) => {
                if(err) {
                    console.log(err.message);
                    return;
                }
                connection.execute(
                    "select de_alias, co_empresa_usuario, co_usuario, de_nombre, st_admin, co_centro_costo, st_acceso_wap from sg_usua_m where de_alias = :usuario and de_clave_sistema = :clave and es_vigencia = 'Vigente' and st_acceso_wap = 'S'",
                    {
                        usuario: { val: usuario },
                        clave: { val: clave }
                    },
                    {
                        outFormat: oracledb.OBJECT,
                        maxRows: 1
                    },
                    (error, result) => {
                        connection.close();
                        if(error) {
                            console.error(error.message);
                            return res.json({
                                state: "error",
                                err: error
                            });
                        }
                        if(result.rows.length == 0) {
                            return res.json({
                                state: "error",
                                err: "Datos de autenticación incorrectos"
                            });
                        }
                        const user = {
                            alias: result.rows[0].DE_ALIAS,
                            empresa: result.rows[0].CO_EMPRESA_USUARIO,
                            codigo: result.rows[0].CO_USUARIO,
                            nombre: result.rows[0].DE_NOMBRE,
                            admin: result.rows[0].ST_ADMIN,
                            ccosto: result.rows[0].CO_CENTRO_COSTO
                        };
                        const token = jwt.sign(user, jwtKey, {
                            expiresIn: 86400
                        });
                        return res.json({
                            state: "success",
                            data: {
                                token: token,
                                usuario: user
                            }
                        }); 
                    }
                );
            }
        );
    }
};

module.exports = loginCtrl;