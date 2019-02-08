const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');

const responseParams = {
    outFormat: oracledb.OBJECT
};


const ma010601Controller = {
    updatesede: (req, res) => {
        const  {emp, codigo, nombre, vigencia, tipo} = req.body;
        console.log(req.body);
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
//                res.set('Content-Type', 'application/json');
//                res.send(res.json({
//                    state: 'success',
//                    message: 'Datos Grabados correctamente'
//                }));

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
            const query = '  SELECT MA_EMPRESAS_DPTOS_M.DE_DPTO,    ' +
                    '   MA_EMPRESAS_SEDES_M.DE_SEDE,    ' +
                    '   MA_EMPRESAS_OFIC_M.CO_OFICINA  \"Codigo\",    ' +
                    '   MA_EMPRESAS_OFIC_M.DE_OFICINA  \"Nombre\",    ' +
                    '   MA_EMPRESAS_OFIC_M.CO_SEDE,    ' +
                    '   MA_EMPRESAS_OFIC_M.CO_DPTO,    ' +
                    '   MA_EMPRESAS_OFIC_M.ES_VIGENCIA   \"Vigencia\"  ' +
                    'FROM MA_EMPRESAS_DPTOS_M,    ' +
                    '    MA_EMPRESAS_SEDES_M,    ' +
                    '    MA_EMPRESAS_OFIC_M   ' +
                    'WHERE ( MA_EMPRESAS_OFIC_M.CO_EMPRESA = MA_EMPRESAS_SEDES_M.CO_EMPRESA ) and   ' +
                    '     ( MA_EMPRESAS_OFIC_M.CO_SEDE = MA_EMPRESAS_SEDES_M.CO_SEDE ) and   ' +
                    '    ( MA_EMPRESAS_OFIC_M.CO_EMPRESA = MA_EMPRESAS_DPTOS_M.CO_EMPRESA ) and   ' +
                    '    ( MA_EMPRESAS_OFIC_M.CO_DPTO = MA_EMPRESAS_DPTOS_M.CO_DPTO ) and   ' +
                    '    ( ( MA_EMPRESAS_OFIC_M.CO_EMPRESA = :p_empresa ) )       ';
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
            const query = '  SELECT   ' +
                    '   MA_EMPRESAS_SECC_M.CO_SECCION  \"Codigo\",     ' +
                    '   MA_EMPRESAS_SECC_M.DE_SECCION  \"Nombre\",      ' +
                    '    MA_EMPRESAS_SECC_M.CO_DPTO,   ' +
                    '    MA_EMPRESAS_SECC_M.CO_SEDE,   ' +
                    '    MA_EMPRESAS_SECC_M.ES_VIGENCIA  \"Vigencia\"  , ' +
                    '    MA_EMPRESAS_SECC_M.CO_RESPONSABLE,   ' +
                    '    MA_EMPRESAS_DPTOS_M.DE_DPTO,   ' +
                    '    MA_EMPRESAS_SEDES_M.DE_SEDE  ' +
                    'FROM MA_EMPRESAS_SECC_M,   ' +
                    '     MA_EMPRESAS_DPTOS_M,   ' +
                    '     MA_EMPRESAS_SEDES_M  ' +
                    ' WHERE ( MA_EMPRESAS_SECC_M.CO_EMPRESA = MA_EMPRESAS_DPTOS_M.CO_EMPRESA ) and  ' +
                    '       ( MA_EMPRESAS_SECC_M.CO_DPTO = MA_EMPRESAS_DPTOS_M.CO_DPTO ) and  ' +
                    '       ( MA_EMPRESAS_SECC_M.CO_EMPRESA = MA_EMPRESAS_SEDES_M.CO_EMPRESA ) and  ' +
                    '       ( MA_EMPRESAS_SECC_M.CO_SEDE = MA_EMPRESAS_SEDES_M.CO_SEDE ) and  ' +
                    '       ( ( MA_EMPRESAS_SECC_M.CO_EMPRESA = :p_empresa ) )       ';
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
                res.set('Content-Type', 'application/json');
                res.send( xmlParser.renderCombo(result.rows));

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
                res.set('Content-Type', 'application/json');
                res.send( xmlParser.renderFormCombo(result.rows));

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
    }

};

module.exports = ma010601Controller;