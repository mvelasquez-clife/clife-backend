const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');

const responseParams = {
    outFormat: oracledb.OBJECT
};

const ba010305Controller = {
    ComboPeriodos: (req, res) => {
        const { empresa } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                console.error(err);
                return;
            }
            const query = "select co_periodo value,de_periodo text from table(pack_new_maestros.f_list_combo_periodos(:empresa))";
            const params = {
                empresa: { val: empresa }
            };
            conn.execute(query, params, responseParams, (error, result) => {
                if(error) {
                    console.error(error);
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderCombo(result.rows));
            });
        });
    },
    ListaPlanillas: (req, res) => {
        const { empresa, cobrador, periodo } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                console.error(err);
                return;
            }
            const query = "select co_planilla_cobranza,co_caja,to_char(fe_creacion_planilla,'yyyy-mm-dd') fe_creacion_planilla,to_char(fe_cierre,'yyyy-mm-dd') fe_cierre,co_moneda,de_moneda,co_tipo_docu_administr,de_tipo_doc_admin,im_tarjeta,im_total,im_valores,im_deposito_total,im_diferencia,st_conciliado,st_liquidado,st_recibo,co_periodo,to_char(fe_aprobacion_cierre,'yyyy-mm-dd') fe_aprobacion_cierre,es_vigencia from table(pack_new_finanzas_no_tocar.f_list_plan_cobranza_cobr_per(:empresa,:cobrador,:periodo))";
            const params = {
                empresa: { val: empresa },
                cobrador: { val: cobrador },
                periodo: { val: periodo }
            };
            conn.execute(query, params, responseParams, (error, result) => {
                if(error) {
                    console.error(error);
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderXml(result.rows));
            });
        });
    },
    Grafico12: (req, res) => {
        const { empresa, cobrador, periodo } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: err
                });
                return;
            }
            const query = "select co_tipo_doc_administr codigo,de_tipo_doc_administr tipo,num_primero importe,num_segundo deposito from table(pack_new_finanzas_no_tocar.f_grafico_planillas_1(:empresa,:cobrador,:periodo))";
            const params = {
                empresa: { val: empresa },
                cobrador: { val: cobrador },
                periodo: { val: periodo }
            };
            conn.execute(query, params, responseParams, (error, result) => {
                if(error) {
                    res.json({
                        state: 'error',
                        message: error
                    });
                    conn.close();
                    return;
                }
                res.json({
                    state: 'success',
                    data: {
                        grafico: result.rows
                    }
                });
            });
        });
    },
    Grafico3: (req, res) => {
        const { empresa, cobrador, periodo } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: err
                });
                return;
            }
            const query = "select co_tipo_doc_administr codigo,de_tipo_doc_administr tipo,num_primero conciliadas,num_segundo planillas from table(pack_new_finanzas_no_tocar.f_grafico_planillas_2(:empresa,:cobrador,:periodo))";
            const params = {
                empresa: { val: empresa },
                cobrador: { val: cobrador },
                periodo: { val: periodo }
            };
            conn.execute(query, params, responseParams, (error, result) => {
                if(error) {
                    res.json({
                        state: 'error',
                        message: error
                    });
                    conn.close();
                    return;
                }
                res.json({
                    state: 'success',
                    data: {
                        grafico: result.rows
                    }
                });
            });
        });
    }
};

module.exports = ba010305Controller;