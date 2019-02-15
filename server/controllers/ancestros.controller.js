const oracledb = require('oracledb');
const dbParams = require('../database');
const xmlParser = require('../xml-parser');

const responseParams = {
    outFormat: oracledb.OBJECT
};

const ancestroController = {
    cargaDatosVentanaSeguridad: (req, res) => {
        const { id, empresa, usuario } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                console.error(err);
                return;
            }
            const query = "call pack_new_seguridad.sp_tabla_sist_m_param_return(:p_tabla,:p_usuario,:p_empresa,:o_titulo,:o_distabla,:o_disusuario)";
            const params = {
                p_tabla: { val: id },
                p_usuario: { val: usuario },
                p_empresa: { val: empresa },
                o_titulo: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                o_distabla: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                o_disusuario: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            };
            conn.execute(query, params, responseParams, (error, result) => {
                if(error) {
                    conn.close();
                    res.json({
                        state: 'error',
                        message: error.Error
                    });
                    return;
                }
                const { o_titulo, o_distabla, o_disusuario } = result.outBinds;
                res.json({
                    state: 'success',
                    data: {
                        titulo: o_titulo,
                        distabla: o_distabla,
                        disusuario: o_disusuario
                    }
                });
            });
        });
    },

    getGridPruebaData: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            const { id, empresa } = req.params;
            if(err) {
                res.json({
                    state: 'error',
                    message: err.stack
                });
                return;
            }
            const query = "select * from table (pack_new_sources.f_list_lupa_general(:p_id, :p_empresa, :p_extra))";
            const params = {
                p_id: { val: id },
                p_empresa: { val: empresa },
                p_extra: { val: '' }
            };
            conn.execute(query, params, responseParams, (error, result) => {
                if(error) {
                    conn.close();
                    res.json({
                        state: 'error',
                        message: error.stack
                    });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderXml(result.rows));
            });
        });
    },

    validarClave: (req, res) => {
        const { alias, empresa, tabla, clave } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                console.error(err);
                return;
            }
            const query = "call PACK_NEW_SEGURIDAD.Sp_ValidarAutorizacion (:p_alias, :p_empresa, :p_tabla, :p_clave, :o_resultado)";
            const params = {
                p_alias: { val: alias },
                p_empresa: { val: empresa },
                p_tabla: { val: tabla },
                p_clave: { val: clave },
                o_resultado: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            };
            conn.execute(query, params, responseParams, (error, result) => {
                if(error) {
                    conn.close();
                    res.json({
                        state: 'error',
                        message: error
                    });
                    return;
                }
                const { o_resultado } = result.outBinds;
                if(o_resultado == 'S') {
                    res.json({
                        state: 'success'
                    });
                }
                else {
                    res.json({
                        state: 'error',
                        message: 'El usuario y/o clave son incorrectos'
                    });
                }
            });
        });
    }
};

module.exports = ancestroController;