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
                    "select sg_usua_m.de_alias, sg_usua_m.co_empresa_usuario, sg_usua_m.co_usuario, ma_pers_m.de_nombres,ma_pers_m.de_sexo,to_char(ma_pers_m.fe_nacimiento,'dd/mm/yyyy') as \"fe_nacimiento\", st_admin,ma_pers_m.de_apellido_paterno,ma_pers_m.de_apellido_materno, sg_usua_m.co_centro_costo, sg_usua_m.st_acceso_wap,cc.de_nombre as nom_ccostos  from sg_usua_m  left join ma_cent_cost_m cc on cc.co_empresa= co_empresa_usuario and cc.co_centro_costo =sg_usua_m.co_centro_costo left join ma_pers_m on ma_pers_m.co_persona = sg_usua_m.co_persona where sg_usua_m.de_alias = :usuario and sg_usua_m.de_clave_sistema = :clave and sg_usua_m.es_vigencia = 'Vigente' and sg_usua_m.st_acceso_wap = 'S'",
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
                            nombre: result.rows[0].DE_NOMBRES,
                            apemat :result.rows[0].DE_APELLIDO_MATERNO,
                            apepat : result.rows[0].DE_APELLIDO_PATERNO,
                            sexo: result.rows[0].DE_SEXO,
                            fecnaci : result.rows[0].FE_NACIMIENTO,
                            admin: result.rows[0].ST_ADMIN,
                            ccosto: result.rows[0].CO_CENTRO_COSTO,
                            ncosto: result.rows[0].NOM_CCOSTOS
                        };
                        console.log(user);
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