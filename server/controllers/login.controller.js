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
                    "select sg_usua_m.de_alias, sg_usua_m.co_empresa_usuario, co_usuario, sg_usua_m.de_nombre, st_admin, sg_usua_m.co_centro_costo, sg_usua_m.st_acceso_wap,cc.de_nombre as nom_ccostos  from sg_usua_m  left join ma_cent_cost_m cc on cc.co_empresa= co_empresa_usuario and cc.co_centro_costo =sg_usua_m.co_centro_costo where sg_usua_m.de_alias = :usuario and sg_usua_m.de_clave_sistema = :clave and sg_usua_m.es_vigencia = 'Vigente' and sg_usua_m.st_acceso_wap = 'S'",
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
                            //console.error(error.message);
                            return res.json({
                                state: "error",
                                err: error.message
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
                            ccosto: result.rows[0].CO_CENTRO_COSTO,
                             ncosto: result.rows[0].NOM_CCOSTOS
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