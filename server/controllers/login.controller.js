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
                    "select co_persona,de_alias,co_empresa_usuario,co_usuario,co_tipo_doc_ide,de_nombres,de_sexo,fe_nacimiento,st_admin,de_apellido_paterno,de_apellido_materno,co_centro_costo,st_acceso_wap,de_nombre_costos,fe_registro,de_documento,de_mail_corpo,de_telefono_corpo,de_fullname from table(pw_datos_usuario_login.f_datos_usuario_login(:usuario,:clave))",
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
                    cellcorpo: result.rows[0].DE_TELEFONO_CORPO,
                    fullname: result.rows[0].DE_FULLNAME

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
