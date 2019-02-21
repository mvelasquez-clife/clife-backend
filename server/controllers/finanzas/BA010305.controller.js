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
    },
    BuscaPlanillaVigente: (req, res) => {
        const { empresa, vendedor } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: err
                });
                return;
            }
            const query = "call pack_new_cobranzas.sp_planilla_vigente(:p_empresa,:p_vendedor,:o_resultado,:o_planilla,:o_serie,:o_moneda,:o_periodo,:o_tipo_docu_administr,:o_total,:o_deposito_total,:o_fecreacion,:o_fecierre,:o_caja,:o_nmoneda)";
            const params = {
                p_empresa: { val: empresa },
                p_vendedor: { val: vendedor },
                o_resultado: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                o_planilla: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                o_serie: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_moneda: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_periodo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_tipo_docu_administr: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                o_total: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_deposito_total: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_fecreacion: { dir: oracledb.BIND_OUT, type: oracledb.DATE },
                o_fecierre: { dir: oracledb.BIND_OUT, type: oracledb.DATE },
                o_caja: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_nmoneda: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
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
                const { o_resultado, o_planilla, o_serie, o_moneda, o_periodo, o_tipo_docu_administr, o_total, o_deposito_total, o_fecreacion, o_fecierre, o_caja, o_nmoneda } = result.outBinds;
                //o_resultado
                res.json({
                    state: 'success',
                    data: {
                        resultado: o_resultado,
                        planilla: {
                            codigo: o_planilla,
                            serie: o_serie,
                            moneda: o_moneda,
                            periodo: o_periodo,
                            tpdoc: o_tipo_docu_administr,
                            importe: o_total,
                            deposito: o_deposito_total,
                            fcreacion: o_fecreacion,
                            fcierre: o_fecierre,
                            caja: o_caja,
                            nmoneda: o_nmoneda
                        }
                    }
                });
            });
        });
    },
    CargarListaMonedas: (req, res) => {
        const { empresa, vendedor } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: err
                });
                return;
            }
            const query = "select co_moneda value, de_nombre || ' - ' || de_abreviatura text from table(pack_new_cobranzas.f_monedas_recaudador(:p_empresa,:p_recaudador))";
            const params = {
                p_empresa: { val: empresa },
                p_recaudador: { val: vendedor }
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
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderCombo(result.rows));
            });
        });
    },
    CrearPlanillaCobranza: (req, res) => {
        const { empresa, vendedor, moneda, docadmin, ptoventa, cerrada, covariable } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: err
                });
                return;
            }
            const query = "call pack_new_cobranzas.sp_genera_planilla_wap(:p_empresa,:p_vendedor,:p_moneda,:p_docadmin,:p_ptoventa,:p_cerrada,:p_covariable,:o_resultado,:o_planilla)";
            const params = {
                p_empresa: { val: empresa },
                p_vendedor: { val: vendedor },
                p_moneda: { val: moneda },
                p_docadmin: { val: docadmin },
                p_ptoventa: { val: ptoventa },
                p_cerrada: { val: cerrada },
                p_covariable: { val: covariable },
                o_resultado: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_planilla: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
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
                const { o_resultado, o_planilla } = result.outBinds;
                res.json({
                    state: 'success',
                    data: {
                        resultado: o_resultado,
                        mensaje: o_planilla
                    }
                });
            });
        });
    },
    AbrirPlanillaCobranza: (req, res) => {
        const { planilla, cobrador, empresa } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: err
                });
                return;
            }
            const query = "call pack_new_cobranzas.sp_apertura_planilla(:p_empresa,:p_planilla,:p_vendedor)";
            const params = {
                p_empresa: { val: empresa },
                p_planilla: { val: planilla },
                p_vendedor: { val: cobrador }
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
                    state: 'success'
                });
            });
        });
    },
    CerrarPlanillaCobranza: (req, res) => {
        const { alias } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: err
                });
                return;
            }
            const query = "call pack_new_cobranzas.sp_cierra_planilla(:p_alias,:o_resultado,:o_mensaje)";
            const params = {
                p_alias: { val: alias },
                o_resultado: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_mensaje: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
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
                const { o_resultado, o_mensaje } = result.outBinds;
                res.json({
                    state: 'success',
                    data: {
                        resultado: o_resultado,
                        mensaje: o_mensaje
                    }
                });
            });
        });
    },
    ComboTiposCobro: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: err
                });
                return;
            }
            const query = "select co_tipo_cobro \"value\",de_nombre \"text\" from ma_tipo_cobr_m where st_vista_abono = 'S' order by co_tipo_cobro asc";
            const params = {};
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
                    options: result.rows
                });
            });
        });
    },
    ListaDocumentosPagoCliente: (req, res) => {
        const { empresa, ruc } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: err
                });
                return;
            }
            const query = "select co_documento,im_saldo,to_char(fec_venc,'yyyy-mm-dd'),nu_unico,st_letra,de_estadoletra,st_recaudo from table(pack_new_creditos_planilla.f_list_cta_cte(:p_empresa,:p_ruc))";
            const params = {
                p_empresa: { val: empresa },
                p_ruc: { val: ruc }
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
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderXml(result.rows));
            });
        });
    },
    ComboBancos: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: err
                });
                return;
            }
            const query = "select ta.co_banco \"value\",ta.de_nombre \"text\" from ba_banc_m ta join ma_pais_m tb on ta.co_pais = tb.co_pais where ta.es_vigencia = 'Vigente'";
            const params = {};
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
                    options: result.rows
                });
            });
        });
    },
    RegistraPagoPlanilla = (req, res) => {
        const { vendedor, tipo, documento, importe, banco, serieret, nrodoc, regfecha } = req.body;
        return res.json({
            state: 'error',
            message: 'ola ke ase'
        });
    }
};

module.exports = ba010305Controller;