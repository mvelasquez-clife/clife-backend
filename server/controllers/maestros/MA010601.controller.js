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
                res.send({'error_conexion': err.stack});
                return;
            }
            if (tipo === 'sede')
                var query = '  UPDATE  MA_EMPRESAS_SEDES_M SET DE_SEDE  = :nombre, ES_VIGENCIA =:vigencia  WHERE CO_EMPRESA =:emp  AND CO_SEDE = :codigo';
            else
                var query = '  UPDATE  MA_EMPRESAS_DPTOS_M SET DE_DPTO  = :nombre, ES_VIGENCIA =:vigencia  WHERE CO_EMPRESA =:emp  AND CO_DPTO = :codigo';
            const params = {nombre: nombre, codigo: codigo, vigencia: vigencia, emp: emp};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({'error_query': error.stack});
                    return;
                } else {
                    res.json({
                        state: 'success',
                        message: 'Datos Grabados correctamente'
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
            const query = 'Select OFIC.CO_OFICINA \"Codigo\",OFIC.DE_OFICINA \"Nombre\",OFIC.CO_DPTO \"CodDepa\" ,  OFIC.CO_SEDE  \"CodSede\", OFIC.ES_VIGENCIA \"Vigencia\", NVL(OFIC.CO_RESPONSABLE,0) \"CodRespon\"   '
                    + ' ,NVL(CATA.DE_NOMBRE_COMERCIAL,\'SIN RESPONSABLE\') \"NomRespon\"     FROM MA_EMPRESAS_OFIC_M  OFIC left join MA_CATA_ENTI_M CATA ON CATA.CO_CATALOGO_ENTIDAD =OFIC.CO_RESPONSABLE WHERE OFIC.CO_EMPRESA=:p_empresa ORDER BY OFIC.DE_OFICINA         ';
            const params = {p_empresa: emp};
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
            const query = 'select SECC.CO_SECCION \"Codigo\",SECC.DE_SECCION \"Nombre\",SECC.CO_DPTO \"CodDepa\" ,  SECC.CO_SEDE  \"CodSede\", SECC.ES_VIGENCIA \"Vigencia\", NVL(SECC.CO_RESPONSABLE,0) \"CodRespon\",NVL(CATA.DE_NOMBRE_COMERCIAL,\'SIN RESPONSABLE\') \"NomRespon\"     FROM MA_EMPRESAS_SECC_M  SECC left join MA_CATA_ENTI_M CATA ON CATA.CO_CATALOGO_ENTIDAD =SECC.CO_RESPONSABLE WHERE SECC.CO_EMPRESA=:p_empresa ORDER BY SECC.DE_SECCION    ';
            const params = {p_empresa: emp};
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
            const query = 'SELECT  MA_EMPRESAS_DPTOS_M.CO_DPTO  \"Codigo\",           MA_EMPRESAS_DPTOS_M.DE_DPTO  \"Nombre\",            MA_EMPRESAS_DPTOS_M.ES_VIGENCIA  \"Vigencia\"  ' +
                    'FROM MA_EMPRESAS_DPTOS_M     WHERE MA_EMPRESAS_DPTOS_M.CO_EMPRESA = :p_empresa    ';
            const params = {p_empresa: emp};
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
            const query = '  SELECT        MA_EMPRESAS_SEDES_M.CO_SEDE  \"Codigo\",            MA_EMPRESAS_SEDES_M.DE_SEDE  \"Nombre\",            MA_EMPRESAS_SEDES_M.ES_VIGENCIA \"Vigencia\"  ' +
                    'FROM MA_EMPRESAS_SEDES_M     WHERE MA_EMPRESAS_SEDES_M.CO_EMPRESA = :p_empresa';
            const params = {p_empresa: emp};
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
    c_list_depar: (req, res) => {
        const  {emp} = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({'error_conexion': err.stack});
                return;
            }
            const query = 'SELECT  MA_EMPRESAS_DPTOS_M.CO_DPTO  VALUE,           MA_EMPRESAS_DPTOS_M.DE_DPTO TEXT,            MA_EMPRESAS_DPTOS_M.ES_VIGENCIA  \"Vigencia\"  ' +
                    'FROM MA_EMPRESAS_DPTOS_M     WHERE MA_EMPRESAS_DPTOS_M.CO_EMPRESA = :p_empresa    ';
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
    updatesecof: (req, res) => {
        const  {emp, tipo, codigo, nombre, coddepa, codsede, vigencia, respon} = req.body;         //console.log(req.body);
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({state: 'error', 'message': err.stack});
                return;
            }
            if (tipo === 'seccion')
                var query = '  UPDATE  MA_EMPRESAS_SECC_M SET DE_SECCION  = :nombre, ES_VIGENCIA =:vigencia,CO_DPTO =:depa,CO_SEDE = :sede,CO_RESPONSABLE=:respon  WHERE CO_EMPRESA =:emp  AND CO_SECCION = :codigo';
            else
                var query = '  UPDATE  MA_EMPRESAS_OFIC_M SET DE_OFICINA  = :nombre, ES_VIGENCIA =:vigencia,CO_DPTO =:depa,CO_SEDE = :sede,CO_RESPONSABLE=:respon  WHERE CO_EMPRESA =:emp  AND CO_OFICINA = :codigo';
            const params = {nombre: nombre, codigo: codigo, vigencia: vigencia, emp: emp, respon: respon, depa: coddepa, sede: codsede};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({state: 'error', 'message': error.stack});
                    return;
                } else {
                    res.json({
                        state: 'success',
                        message: 'Datos Grabados correctamente'
                    });
                }
                conn.commit();
                conn.close();
            });
        });
    },
    cambiaestado: (req, res) => {
        const  {emp, codigo, vigencia, tipo} = req.body;
        console.log(req.body);
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({state: 'error', 'message': err.stack});
                return;
            }
            switch (tipo) {
                case 'sede':
                    var query = '  UPDATE  MA_EMPRESAS_SEDES_M SET  ES_VIGENCIA =:vigencia  WHERE CO_EMPRESA =:emp  AND CO_SEDE = :codigo';
                    break;
                case  'depa':
                    var query = '  UPDATE  MA_EMPRESAS_DPTOS_M SET  ES_VIGENCIA =:vigencia  WHERE CO_EMPRESA =:emp  AND CO_DPTO = :codigo';
                    break;
                case  'seccion':
                    var query = '  UPDATE  MA_EMPRESAS_SECC_M SET  ES_VIGENCIA =:vigencia  WHERE CO_EMPRESA =:emp  AND CO_SECCION = :codigo';
                    break;
                case  'oficina':
                    var query = '  UPDATE  MA_EMPRESAS_OFIC_M SET  ES_VIGENCIA =:vigencia  WHERE CO_EMPRESA =:emp  AND CO_OFICINA = :codigo';
                    break;
                default:
                    null;
                    break;
            }
            const params = {codigo: codigo, vigencia: vigencia, emp: emp};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({state: 'error', 'message': error.stack});
                    return;
                } else {
                    res.json({
                        state: 'success',
                        message: 'Datos Grabados correctamente'
                    });
                }
                conn.commit();
                conn.close();
            });
        });
    }

};

module.exports = ma010601Controller;