const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');

const responseParams = {
    outFormat: oracledb.OBJECT
};

const ba010304Controller = {
    buscarPlanillasCobranza: (req, res) => {
        const { empresa, cobrador, planilla, desde, hasta } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                console.error(err);
                return;
            }
            //const query = "select co_planilla_cobranza,co_caja,to_char(fe_creacion_planilla,'yyyy-mm-dd') fe_creacion_planilla,to_char(fe_cierre,'yyyy-mm-dd') fe_cierre,co_moneda,de_moneda,co_tipo_docu_administr,de_tipo_doc_admin,im_tarjeta,im_total,im_valores,im_deposito_total,im_diferencia,st_conciliado,st_liquidado,st_recibo,co_periodo,to_char(fe_aprobacion_cierre,'yyyy-mm-dd') fe_aprobacion_cierre,es_vigencia from table(pack_new_finanzas_no_tocar.f_list_plan_cobranza(:p_empresa,:p_cobrador,:p_planilla,:p_desde,:p_hasta))";
            const query = "select co_planilla_cobranza,co_caja,to_char(fe_creacion_planilla,'yyyy-mm-dd') fe_creacion_planilla,to_char(fe_cierre,'yyyy-mm-dd') fe_cierre,co_moneda,de_moneda,co_tipo_docu_administr,de_tipo_doc_admin,im_tarjeta,im_total,im_valores,im_deposito_total,im_diferencia,st_conciliado,st_liquidado,st_recibo,co_periodo,to_char(fe_aprobacion_cierre,'yyyy-mm-dd') fe_aprobacion_cierre,es_vigencia from table(pack_new_finanzas_no_tocar.f_list_plan_cobranza_v2(:p_empresa,:p_cobrador,:p_planilla,:p_desde,:p_hasta))";
            const params = {
                p_empresa: { val: empresa },
                p_cobrador: { val: cobrador },
                p_planilla: { val: planilla },
                p_desde: { val: desde },
                p_hasta: { val: hasta }
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

    mostrarPagosEfectivo: (req, res) => {
        const { empresa, planilla } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                console.error(err);
                return;
            }
            const query = "select * from table(pack_new_finanzas_no_tocar.f_list_planilla_efectivo(:p_empresa,:p_planilla))";
            const params = {
                p_empresa: { val: empresa },
                p_planilla: { val: planilla }
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

    mostrarPagosCheques: (req, res) => {
        const { empresa, planilla } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                console.error(err);
                return;
            }
            const query = "select * from table(pack_new_finanzas_no_tocar.f_list_planilla_cheques(:p_empresa,:p_planilla))";
            const params = {
                p_empresa: { val: empresa },
                p_planilla: { val: planilla }
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

    mostrarPagosNotas: (req, res) => {
        const { empresa, planilla } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                console.error(err);
                return;
            }
            const query = "select * from table(pack_new_finanzas_no_tocar.f_list_planilla_notas(:p_empresa,:p_planilla))";
            const params = {
                p_empresa: { val: empresa },
                p_planilla: { val: planilla }
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

    mostrarDepositosPlanilla: (req, res) => {
        const { empresa, planilla } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                console.error(err);
                return;
            }
            const query = "select * from table(pack_new_finanzas_no_tocar.f_list_planilla_depositos(:p_empresa,:p_planilla))";
            const params = {
                p_empresa: { val: empresa },
                p_planilla: { val: planilla }
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
    }
};

module.exports = ba010304Controller;
