const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');

const responseParams = {
    outFormat: oracledb.OBJECT
};


const ma010104Controller = {
    update_emp: (req, res) => {
        const  {emp, codigo, direc, dcorta, stpropio,ubigeo} = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({state: 'error', message: err.stack});
                return;
            }
          
            const params = {emp_: emp, codigo_: codigo, direc: direc, dcort: dcorta, stpro: stpropio,ubige : ubigeo, o_resultado: {dir: oracledb.BIND_OUT, type: oracledb.STRING}};
              console.log(params);
            var query = 'call PW_MA010104.UPDATE_DATA(:emp_,:codigo_,:direc,:dcort,:stpro,:ubige,:o_resultado)';
            conn.execute(query, params, responseParams, (error, result) => {
                  conn.close();
                if (error) {
                    res.send({state: 'error', message: error.stack});
                    return;
                } else {
                    const {o_resultado} = result.outBinds;
                    res.json({
                        state: 'success',
                        message: o_resultado
                    });
                }
               // conn.commit();
              
            });
        });
    },
    c_list_estado: (req, res) => {
        res.set('Content-Type', 'application/xml');
        res.send('<?xml version="1.0" encoding="utf-8"?><complete>  <option value="Vigente" selected="true" css="color:green">Vigente</option>  <option value="Retirado" css="color:red">Retirado</option></complete>');
    },
    cargardata: (req, res) => {
        const  {emp} = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({state: 'error', error_conexion: err.stack});
                return;
            }
            const query = '  SELECT        CO_DIRECCION_EMPRESA ,DE_DIRECCION,FE_SYS,CO_UBIGEO,ES_VIGENCIA,ST_PRINCIPAL,ST_PROPIO,DE_DIRECCION_CORTA,NPRINCIPAL,NUBIGEO  FROM TABLE(PW_MA010104.F_DATA_DIRECC(:p_empresa) ) ';
            const params = {p_empresa: emp};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({'error_query': error.stack});

                    return;
                }
                res.set('Content-Type', 'application/json');
                res.send(result.rows); console.log(result.rows);
                conn.close();
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

module.exports = ma010104Controller;