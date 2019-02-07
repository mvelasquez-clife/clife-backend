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
            if (err) {
                console.log(err.message);
                return;
            }
            connection.execute(
                    "SELECT CO_PERSONA,DE_ALIAS,CO_EMPRESA_USUARIO,CO_USUARIO,CO_TIPO_DOC_IDE,DE_NOMBRES,DE_SEXO,FE_NACIMIENTO,ST_ADMIN,DE_APELLIDO_PATERNO,DE_APELLIDO_MATERNO,CO_CENTRO_COSTO,ST_ACCESO_WAP,DE_NOMBRE_COSTOS,FE_REGISTRO,DE_DOCUMENTO,DE_MAIL_CORPO,DE_TELEFONO_CORPO FROM TABLE(PW_DATOS_USUARIO_LOGIN.F_DATOS_USUARIO_LOGIN(:usuario,:clave))",
                    {
                        usuario: {val: usuario},
                        clave: {val: clave}
                    },
                    {
                        outFormat: oracledb.OBJECT,
                        maxRows: 1
                    },
                    (error, result) => {
                connection.close();
                if (error) {
                    //console.error(error.message);
                    return res.json({
                        state: "error",
                        err: error.message
                    });
                }
                if (result.rows.length == 0) {
                    return res.json({
                        state: "error",
                        err: "Datos de autenticación incorrectos"
                    });
                }
                const user = {
                    copersona: result.rows[0].CO_PERSONA,
                    alias: result.rows[0].DE_ALIAS,
                    empresa: result.rows[0].CO_EMPRESA_USUARIO,
                    codigo: result.rows[0].CO_USUARIO,
                    tipodoc: result.rows[0].CO_TIPO_DOC_IDE,
                    nombre: result.rows[0].DE_NOMBRES,
                    sexo: result.rows[0].DE_SEXO,
                    fecnaci: result.rows[0].FE_NACIMIENTO,
                    stadmin: result.rows[0].ST_ADMIN,
                    apemat: result.rows[0].DE_APELLIDO_MATERNO,
                    apepat: result.rows[0].DE_APELLIDO_PATERNO,
                    ccosto: result.rows[0].CO_CENTRO_COSTO,
                    stwap: result.rows[0].ST_ACCESO_WAP,
                    ncosto: result.rows[0].NOM_CCOSTOS,
                    fregistro: result.rows[0].FE_REGISTRO,
                    documento: result.rows[0].DE_DOCUMENTO,
                    mailcorpo: result.rows[0].DE_MAIL_CORPO,
                    cellcorpo: result.rows[0].DE_TELEFONO_CORPO

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
