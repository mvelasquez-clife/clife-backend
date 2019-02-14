const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');

const responseParams = {
    outFormat: oracledb.OBJECT
};


const ma010601Controller = {
    updatesede: (req, res) => {
        const  {emp, codigo, nombre, vigencia, tipo} = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({state: 'error', message: err.stack});
                return;
            }
            const params = {emp_: emp, codigo_: codigo, nombre_: nombre, vigencia_: vigencia, tipo_: tipo, o_resultado: {dir: oracledb.BIND_OUT, type: oracledb.STRING}};
            var query = 'call PW_MA010106.SAVE_SED_PDTO(:emp_,:codigo_,:nombre_,:vigencia_,:tipo_,:o_resultado)';
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({sate: 'error', message: error.stack});
                    return;
                } else {
                    const {o_resultado} = result.outBinds;
                    res.json({
                        state: 'success',
                        message: o_resultado
                    });
                }
                conn.commit();
                conn.close();
            });
        });
    },
    cargarofi: (req, res) => {
        const  {emp} = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({'error_conexion': err.stack});
                return;
            }
            const query = 'Select CO_UNICO \"Codigo\",DE_NOMBRE \"Nombre\",CO_DPTO \"CodDepa\" ,  CO_SEDE  \"CodSede\", ES_VIGENCIA \"Vigencia\", CO_RESPONSABLE \"CodRespon\"   '
                    + ' ,DE_NOMBRE_COMERCIAL \"NomRespon\"     FROM TABLE(PW_MA010106.F_SECC_OFI(:p_empresa,:tipo) )  ';
            const params = {p_empresa: emp, tipo: 'oficina'};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({'error_query': error.stack});
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'application/json');
                res.send(result.rows);

            });
        });
    },
    cargarsecc: (req, res) => {
        const  {emp} = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({'error_conexion': err.stack});
                return;
            }
            const query = 'select CO_UNICO \"Codigo\" , DE_NOMBRE \"Nombre\",CO_DPTO \"CodDepa\" ,  CO_SEDE  \"CodSede\", ES_VIGENCIA \"Vigencia\",' +
                    ' CO_RESPONSABLE \"CodRespon\",DE_NOMBRE_COMERCIAL \"NomRespon\"     FROM TABLE(PW_MA010106.F_SECC_OFI(:p_empresa,:tipo) )        ';
            const params = {p_empresa: emp, tipo: 'seccion'};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({'error_query': error.stack});
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'application/json');
                res.send(result.rows);

            });
        });
    },
    cargardepar: (req, res) => {
        const  {emp} = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({'error_conexion': err.stack});
                return;
            }
            const query = 'SELECT  CO_UNICO  \"Codigo\",         DE_NOMBRE  \"Nombre\",           VIGENCIA  \"Vigencia\" FROM  TABLE(PW_MA010106.F_SED_DEPA(:p_empresa,:tipo) )   ';
            const params = {p_empresa: emp, tipo: 'depa'};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({'error_query': error.stack});
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'application/json');
                res.send(result.rows);

            });
        });
    },
    cargarsede: (req, res) => {
        const  {emp} = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({'error_conexion': err.stack});
                return;
            }
            const query = '  SELECT        CO_UNICO  \"Codigo\",         DE_NOMBRE  \"Nombre\",           VIGENCIA \"Vigencia\"  FROM TABLE(PW_MA010106.F_SED_DEPA(:p_empresa,:tipo) ) ';
            const params = {p_empresa: emp, tipo: 'sede'};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({'error_query': error.stack});

                    return;
                }
                res.set('Content-Type', 'application/json');
                res.send(result.rows);
                conn.close();
            });
        });
    },
    c_list_personal: (req, res) => {
        const  {emp} = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({'error_conexion': err.stack});
                return;
            }
            const query = '  SELECT        MA_EMPRESAS_SEDES_M.CO_SEDE  VALUE,            MA_EMPRESAS_SEDES_M.DE_SEDE  TEXT,            MA_EMPRESAS_SEDES_M.ES_VIGENCIA \"Vigencia\"  ' +
                    'FROM MA_EMPRESAS_SEDES_M     WHERE MA_EMPRESAS_SEDES_M.CO_EMPRESA = :p_empresa';
            const params = {p_empresa: emp};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({'error_query': error.stack});
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'application/xml');
                res.send(xmlParser.renderCombo(result.rows));

            });
        });
    },
    c_list_estado: (req, res) => {
        res.set('Content-Type', 'application/xml');
        res.send('<?xml version="1.0" encoding="utf-8"?><complete>  <option value="Vigente" selected="true" css="color:green">Vigente</option>  <option value="Retirado" css="color:red">Retirado</option></complete>');
    },
    c_list_sede: (req, res) => {
        const  {emp} = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({'error_conexion': err.stack});
                return;
            }
            const query = '  SELECT CO_UNICO AS  VALUE,    DE_NOMBRE AS TEXT,      VIGENCIA \"Vigencia\"  FROM  TABLE(PW_MA010106.F_SED_DEPA(:p_empresa,:tipo) )';
            const params = {p_empresa: emp,tipo : 'sede'};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({'error_query': error.stack});
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'application/xml');
                res.send(xmlParser.renderCombo(result.rows));

            });
        });
    },
    c_list_depar: (req, res) => {
        const  {emp} = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({'error_conexion': err.stack});
                return;
            }
            const query = 'SELECT CO_UNICO AS  VALUE,DE_NOMBRE AS  TEXT, VIGENCIA  \"Vigencia\" FROM TABLE(PW_MA010106.F_SED_DEPA(:p_empresa,:tipo) ) ';
            const params = {p_empresa: emp,tipo:'depa'};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({'error_query': error.stack});
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'application/xml');
                res.send(xmlParser.renderCombo(result.rows));

            });
        });
    },
    updatesecof: (req, res) => {
        const  {emp, tipo, codigo, nombre, coddepa, codsede, vigencia, respon} = req.body;         //console.log(req.body);
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                return res.send({state: 'error', message: err.stack});
            }
            const params = {nombre: nombre, codigo: codigo, vigencia: vigencia, tipo: tipo, emp: emp, respon: respon, depa: coddepa, sede: codsede, o_resultado: {dir: oracledb.BIND_OUT, type: oracledb.STRING}};
            var query = 'call PW_MA010106.SAVE_SECC_OFI(:emp, :codigo, :nombre, :vigencia, :depa, :sede , : respon , :tipo , :o_resultado )';
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({state: 'error', message: error.stack});
                    return;
                } else {
                    const {o_resultado} = result.outBinds;
                    res.json({state: 'success', message: o_resultado});
                }               // conn.commit();

            });
        });
    },
    cambiaestado: (req, res) => {
        const  {emp, codigo, vigencia, tipo} = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({state: 'error', message: err.stack});
                return;
            }
            var query = '  call PW_MA010106.SAVE_ESTADO_ALL(:emp, :codigo, :vigencia, :tipo, :o_resultado)';
            const params = {codigo: codigo, vigencia: vigencia, tipo: tipo, emp: emp, o_resultado: {dir: oracledb.BIND_OUT, type: oracledb.STRING}};
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    return  res.send({state: 'error', message: error.stack});
                } else {
                    const {o_resultado} = result.outBinds;
                    return  res.json({state: 'success', message: o_resultado});
                }

            });
        });
    }

};

module.exports = ma010601Controller;