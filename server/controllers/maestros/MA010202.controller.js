const oracledb = require('oracledb');
const dbParams = require('../../database');
const o2x = require('object-to-xml');

const responseParams = {
    outFormat: oracledb.OBJECT
};

const ma010202Controller = {
    cargarListaPeriodos: (req, res) => {
        const { empresa } = req.params; //cuando las variables se envian por url
        //const empresa = req.params.empresa;
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                console.error(err);
                return;
            }
            const query = "select CO_PERIODO,DE_PERIODO,NU_ANHO,ES_VIGENCIA from table(pack_new_periodos.f_list_periodos(:co_empresa))";
            const params = { 
                co_empresa: { val: empresa }
            };
            conn.execute(query, params, responseParams, (error, result) => {
                if(error) {
                    console.error(error);
                    conn.close();
                    return;
                }
                var arr = [];
                for(var i in result.rows) {
                    var iRow = result.rows[i];
                    var vCell = [];
                    for(var key in iRow) vCell.push(iRow[key]);
                    arr.push({
                        '@': { id: result.rows[i].CO_PERIODO },
                        cell: vCell
                    });
                }
                res.set('Content-Type', 'text/xml');
                res.send(o2x({
                    '?xml version="1.0" encoding="utf-8"?' : null,
                    rows: {
                        row: arr
                    }
                }));
            });
        });
    },
    guardarPeriodo: (req, res) => {
        const { modo, mes, anio, estado, nmes, empresa, coperiodo, pdia, udia } = req.body; //cuando las variables se envian por post
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                console.error(err);
                return;
            }
            const query = "call pack_new_periodos.sp_grabar_periodo(:p_accion,:p_coperiodo,:p_anio,:p_mes,:p_vigencia,:p_empresa,:p_pdia,:p_udia,:o_codigo,:o_resultado)";
console.log(query);
            const params = {
                p_accion: { val: modo },
                p_coperiodo: { val: coperiodo },
                p_anio: { val: anio },
                p_mes: { val: mes },
                p_vigencia: { val: estado },
                p_empresa: { val: empresa },
                p_pdia: { val: pdia },
                p_udia: { val: udia },
                //parametros de salida
                o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_resultado: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
            };
console.log(params);
            conn.execute(query, params, responseParams, (error, result) => {
                if(error) {
                    conn.close();
                    res.json({
                        state: 'error',
                        message: error.Error
                    });
                    return;
                }
                const { o_codigo, o_resultado } = result.outBinds;
                if(o_codigo == 1) res.json({
                    state: 'success',
                    message: o_resultado
                });
                else res.json({
                    state: 'error',
                    message: o_resultado
                });
            });
        });
    },
    cargarDatosPeriodo: (req, res) => {
        const { empresa, periodo } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: error.Error
                });
                return;
            }
            //
            const query = "select CO_PERIODO,NU_MES,NU_ANHO,ES_VIGENCIA,to_char(FE_PRIMER_DIA,'dd/mm/yyyy') FE_PRIMER_DIA,to_char(FE_ULTIMO_DIA,'dd/mm/yyyy') FE_ULTIMO_DIA from table(pack_new_periodos.f_list_periodos_by_id(:p_empresa, :p_coperiodo))";
            const params = {
                p_empresa: { val: empresa },
                p_coperiodo: { val: periodo }
            };
            conn.execute(query, params, responseParams, (error, result) => {
                if(error) {
                    conn.close();
                    return;
                }
                var o_periodo;
                for(var i in result.rows) {
                    o_periodo = result.rows[i];
                }
                //comprobar si obtuve resultado
                if(o_periodo) {
                    res.json({
                        state: 'success',
                        data: {
                            periodo: o_periodo
                        }
                    });
                }
                else {
                    res.json({
                        state: 'error',
                        message: 'El periodo indicado no existe'
                    });
                }
            });
        });
    },
    eliminarPeriodo: (req, res) => {
        const { empresa, periodo } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                console.error(err);
                return;
            }
            const query = "call pack_new_periodos.sp_eliminar_periodo(:p_periodo,:p_empresa,:o_codigo,:o_resultado)";
            const params = {
                p_periodo: { val: periodo },
                p_empresa: { val: empresa },
                //parametros de salida
                o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_resultado: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            };
            conn.execute(query, params, responseParams, (error, result) => {
                if(error) {
                    conn.close();
                    return;
                }
                const { o_codigo, o_resultado } = result.outBinds;
                if(o_codigo == 1) {
                    res.json({
                        state: 'success',
                        message: o_resultado
                    });
                }
                else {
                    res.json({
                        state: 'error',
                        message: o_resultado
                    });
                }
            });
        });
        //
    }
};

module.exports = ma010202Controller;