const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');
const formidable = require('formidable');
const moment = require('moment');
const o2x = require('object-to-xml');
var fs = require('fs-extra');
const desiredMode = 0o2775;
const responseParams = {
    outFormat: oracledb.OBJECT
};
const ma010102Controller = {
    list_moneda: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            } //co_tipo_doc_ide as value ,de_abrevia as label
            const query = "    select CO_MONEDA  as value, DE_NOMBRE AS label    from MA_MONE_M    ";
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, '1'));
            });
        });
    },

    cargafzvta: (req, res) => {
        const { co_direccion, emp, zncomer } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            } //co_tipo_doc_ide as value ,de_abrevia as label
            const query = "SELECT * FROM TABLE(PACK_NEW_MAESTROS.F_LISTAR_CATA_ENTI_FV_X_ZC_D(:x_co_direccion,:x_empresa,:x_zona_comercial))  ";
            const params = { x_co_direccion: co_direccion, x_empresa: emp, x_zona_comercial: zncomer };
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ state: 'error', 'message': error.stack });
                    return;
                }
                res.set('Content-Type', 'application/json');
                res.send(result.rows);
                //console.log(req);
                conn.close();
            });
        });
    },
    savelinea: (req, res) => {
        const { ucliente, u_autoriza, emp, fv, cmone, stper, obs, mont } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error_conec', message: err.stack });
                return;
            }

            const params = {
                ucliente: parseInt(ucliente), u_autoriza: parseInt(u_autoriza), emp: parseInt(emp), fv: fv, cmone: cmone, stper: stper, obs: obs, mont: parseFloat(mont),
                o_codresult: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }, o_deresultado: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            };
            // console.log(params);
            var query = 'call PW_MA010102.ASIGNA_LINEA_CREDITO(:ucliente,:u_autoriza,:emp,:fv,:cmone,:stper,:obs,:mont,:o_codresult, :o_deresultado)';
            //       PROCEDURE sp_cata_enti_cliente_grabar                  (st_permiso_editar_cata_enti , x_empresa,    x_alias ,x_co_catalogo_entidad,x_de_razon_social,x_nu_documento   ,x_co_tipo_persona,x_co_tipo_doc_ide  ,x_de_procedencia,x_de_ape_paterno,x_de_ape_materno ,x_de_nombre     ,x_de_nombre_comercial,x_de_origen ,x_co_cliente ,x_co_tipo_cliente   ,x_st_recaudo  ,x_co_banco ,x_co_tipo_negocio  ,x_co_listado_precios,x_co_serie_listado ,x_st_agente_retenedor  ,x_st_agente_percepcion ,x_st_cliente_nvo  ,x_co_periodo_clien_nvo  ,x_st_cliente_corporativo ,x_co_cliente_corporativo ,x_im_credito_total ,x_im_deuda_total ,x_de_email ,x_de_webpage    ,x_es_vigencia_cliente ,x_fe_retiro_cliente,x_result out number,x_de_result out varchar2) AS
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ state: 'error_query', message: error.stack });
                    return;
                } else {
                    console.log(result.outBinds);
                    const { o_codresult, o_deresultado } = result.outBinds;
                    diaActual = new Date();
                    res.json({
                        state: 'success', codigo: o_codresult, message: o_deresultado, fecha: diaActual.getDate() + '/' + (parseInt(diaActual.getMonth()) + parseInt(1)) + '/' + diaActual.getFullYear()
                    });
                }
                // conn.commit();

            });
        });
    },
    grid_linea: (req, res) => {
        const { emp, cliente } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "Select cl.co_moneda,cl.co_fuerza_venta,cl.IM_LINEA_CREDITO_FINAL,mone.DE_NOMBRE,cl.ES_VIGENCIA,to_char(cl.FE_APROBACION_CREDITO,'dd/mm/yyyy HH24:MI:SS'),cl.ST_PERMANENTE,cl.DE_OBSERVACION_AUTORIZA  from ba_line_cred_m cl  left join MA_MONE_M mone on mone.CO_MONEDA = cl.CO_MONEDA where CL.CO_EMPRESA=:emp AND CL.CO_CLIENTE = :cliente ";
            const params = { emp: emp, cliente: cliente };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderXml(result.rows));
            });
        });
    },
    combo_gridfz_nom: (req, res) => {
        const { empre } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            } //co_tipo_doc_ide as value ,de_abrevia as label
            const query = "    SELECT VT_ZONA_COME_C.CO_ZONA_COMERCIAL, VT_ZONA_COME_C.DE_NOMBRE ,VT_ZONA_COME_C.ES_VIGENCIA FROM VT_ZONA_COME_C where VT_ZONA_COME_C.CO_EMPRESA =:xemp   ORDER BY VT_ZONA_COME_C.DE_NOMBRE ASC   ";
            const params = { xemp: empre };
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                console.log(result.rows);
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderComboAll(result.rows));
            });
        });
    },
    via: (req, res) => {
        // const  {emp} = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            } //co_tipo_doc_ide as value ,de_abrevia as label
            const query = "   SELECT MA_VIAS_M.CO_VIA AS value,            MA_VIAS_M.DE_NOMBRE  || '('|| MA_VIAS_M.DE_ABREVIATURA||')' AS label      FROM MA_VIAS_M     ";
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, '1'));
            });
        });
    },
    zncomercial: (req, res) => {
        const { emp } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            } //co_tipo_doc_ide as value ,de_abrevia as label
            const query = "SELECT VT_ZONA_COME_C.CO_ZONA_COMERCIAL AS value,VT_ZONA_COME_C.DE_NOMBRE AS label  ,VT_ZONA_COME_C.ES_VIGENCIA FROM VT_ZONA_COME_C WHERE VT_ZONA_COME_C.CO_EMPRESA =:x_empresa             ORDER BY VT_ZONA_COME_C.DE_NOMBRE ASC ";
            const params = { x_empresa: emp };
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ state: 'error', 'message': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, '1'));
                //console.log(req);
                conn.close();
            });
        });
    },
    fzvta: (req, res) => {
        const { emp } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            } //co_tipo_doc_ide as value ,de_abrevia as label
            const query = " SELECT VT_FUER_VENT_M.CO_FUERZA_VENTA  AS value,    VT_FUER_VENT_M.DE_NOMBRE AS label  , VT_FUER_VENT_M.ES_FUERZA    FROM VT_FUER_VENT_M WHERE  VT_FUER_VENT_M.CO_EMPRESA = :xemp  ORDER BY VT_FUER_VENT_M.DE_NOMBRE   ";
            const params = { xemp: emp };
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }                 //console.log(result.rows);
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, '1'));
                conn.close();
            });
        });
    },
    dvisita: (req, res) => {
        res.set('Content-Type', 'text/xml');
        rows = [{ VALUE: 'Lunes 1', LABEL: 'Lunes 1' }, { VALUE: 'Martes 2', LABEL: 'Martes 2' }, { VALUE: 'Miercoles 3', LABEL: 'Miercoles 3' },
        { VALUE: 'Jueves 4', LABEL: 'Jueves 4' }, { VALUE: 'Viernes 5', LABEL: 'Viernes 5' }, { VALUE: 'Sabado 6', LABEL: 'Sabado 6' }, { VALUE: 'Domingo 1', LABEL: 'Domingo 1' }, { VALUE: 'Lunes 7', LABEL: 'Lunes 7' },
        { VALUE: 'Martes 8', LABEL: 'Martes 8' }, { VALUE: 'Miercoles 9', LABEL: 'Miercoles 9' }, { VALUE: 'Jueves 10', LABEL: 'Jueves 10' }, { VALUE: 'Viernes 11', LABEL: 'Viernes 11' }, { VALUE: 'Sabado 12', LABEL: 'Sabado 12' }, { VALUE: 'Domingo 2', LABEL: 'Domingo 2' }];
        res.send(xmlParser.renderSelect(rows, '1'));
    },
    dcobranza: (req, res) => {
        res.set('Content-Type', 'text/xml');
        rows = [{ VALUE: 'Lunes 1', LABEL: 'Lunes 1' }, { VALUE: 'Martes 2', LABEL: 'Martes 2' }, { VALUE: 'Miercoles 3', LABEL: 'Miercoles 3' },
        { VALUE: 'Jueves 4', LABEL: 'Jueves 4' }, { VALUE: 'Viernes 5', LABEL: 'Viernes 5' }, { VALUE: 'Sabado 6', LABEL: 'Sabado 6' }, { VALUE: 'Domingo 1', LABEL: 'Domingo 1' }, { VALUE: 'Lunes 7', LABEL: 'Lunes 7' },
        { VALUE: 'Martes 8', LABEL: 'Martes 8' }, { VALUE: 'Miercoles 9', LABEL: 'Miercoles 9' }, { VALUE: 'Jueves 10', LABEL: 'Jueves 10' }, { VALUE: 'Viernes 11', LABEL: 'Viernes 11' }, { VALUE: 'Sabado 12', LABEL: 'Sabado 12' }, { VALUE: 'Domingo 2', LABEL: 'Domingo 2' }];
        res.send(xmlParser.renderSelect(rows, '1'));
    },
    modogaran: (req, res) => {
        //const  {emp} = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            } //co_tipo_doc_ide as value ,de_abrevia as label
            const query = "    SELECT DE_NOMBRE  AS label,  CO_MODO_GARANTIA AS value      FROM MA_MODO_GTIA_M     ";
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, '1'));
            });
        });
    },
    zona: (req, res) => {
        //const  {emp} = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            } //co_tipo_doc_ide as value ,de_abrevia as label
            const query = "    SELECT MA_ZONA_M.DE_NOMBRE || '('|| MA_ZONA_M.DE_ABREVIATURA ||')' AS label,             MA_ZONA_M.CO_ZONA AS value      FROM MA_ZONA_M     ";
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, '1'));
            });
        });
    },
    list_lincredito: (req, res) => {
        const { emp } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            } //co_tipo_doc_ide as value ,de_abrevia as label
            const query = "  SELECT VT_FUER_VENT_M.CO_FUERZA_VENTA as value,             VT_FUER_VENT_M.DE_NOMBRE AS label     FROM VT_FUER_VENT_M     WHERE ( VT_FUER_VENT_M.CO_EMPRESA =:empresa ) and           ( ( VT_FUER_VENT_M.ES_FUERZA = 'Vigente' ) )   ";
            const params = { empresa: emp };
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, '1'));
            });
        });
    },
    cargardirecc: (req, res) => {
        const { xcodigo } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', message: err.stack });
                return;
            }//   RUC,DE_RAZ_SOCIAL,DE_NOMBRE,MONEDA,FE_REGIS,ES_VIGENCIA
            const query = ' SELECT * FROM TABLE(PACK_NEW_MAESTROS.F_LISTAR_CATA_ENTI_DIRE_GRID(:xcodigo)) ';
            const params = { xcodigo: xcodigo };
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ state: 'error', 'message': error.stack });
                    return;
                }
                res.set('Content-Type', 'application/json');
                res.send(result.rows);
                //console.log(req);
                conn.close();
            });
        });
    },
    datosdirecc: (req, res) => {
        const { xdirecc } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', message: err.stack });
                return;
            }//   RUC,DE_RAZ_SOCIAL,DE_NOMBRE,MONEDA,FE_REGIS,ES_VIGENCIA
            const query = ' SELECT * FROM TABLE(PACK_NEW_MAESTROS.F_LISTAR_CATA_ENTI_DIRE_FORM(:xdirecc)) ';
            const params = { xdirecc: xdirecc };
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ state: 'error', 'message': error.stack });
                    return;
                }
                res.set('Content-Type', 'application/json');
                res.send(result.rows); //console.log(req);
                conn.close();
            });
        });
    },
    data_fz_cc: (req, res) => {
        const { co_direccion, emp } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', message: err.stack });
                return;
            }//   RUC,DE_RAZ_SOCIAL,DE_NOMBRE,MONEDA,FE_REGIS,ES_VIGENCIA
            const query = ' SELECT * FROM TABLE(PACK_NEW_MAESTROS.F_LISTAR_DIRE_ZC_FV_VIEW_GRID(:xco_direccion,:x_empresa))';
            const params = { x_empresa: emp, xco_direccion: co_direccion };
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ state: 'error', 'message': error.stack });
                    return;
                }
                res.set('Content-Type', 'application/json');
                res.send(result.rows);
                conn.close();
            });
        });
    },
    list_datos_cliente: (req, res) => {
        const { emp, codigo } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', message: err.stack });
                return;
            }//   RUC,DE_RAZ_SOCIAL,DE_NOMBRE,MONEDA,FE_REGIS,ES_VIGENCIA
            const query = ' SELECT * FROM TABLE(PACK_NEW_MAESTROS.F_LISTAR_CATA_ENTI_CLIENTE(:x_empresa,:x_cliente)) ';
            const params = { x_empresa: emp, x_cliente: codigo };
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ state: 'error', 'message': error.stack });
                    return;
                }
                res.set('Content-Type', 'application/json');
                res.send(result.rows);
                conn.close();
            });
        });
    },
    gridfz_fvta_d: (req, res) => {
        const { coddirecc, empresa, cozona } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = 'SELECT * FROM TABLE(PACK_NEW_MAESTROS.F_FV_X_ZC_D_W(:xcoddirecc,:xemp,:xcozona)) ';
            const params = { xcoddirecc: coddirecc, xemp: empresa, xcozona: cozona };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderXml(result.rows));
            });
        });
    },
    gridfz: (req, res) => {
        const { coddirecc, empresa } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = '  SELECT * FROM TABLE(PACK_NEW_MAESTROS.F_ZC_WEB(:xcoddirecc,:xemp)) ';
            const params = { xcoddirecc: coddirecc, xemp: empresa };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderXml(result.rows));
            });
        });
    },
    giro_nego: (req, res) => {
        const { cocliente } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = '  SELECT * FROM TABLE(PACK_NEW_MAESTROS.F_L_LIST_GIRO_NEG_W_WEB(:xcliente)) ';
            const params = { xcliente: cocliente };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderXml(result.rows));
            });
        });
    },
    garante: (req, res) => {
        const { cocliente } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = '  SELECT * FROM TABLE(PACK_NEW_MAESTROS.F_L_GARANTE_WEB(:xcliente)) ';
            const params = { xcliente: cocliente };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                if (result.rows.length > 0) {
                    res.set('Content-Type', 'text/xml');
                    res.send(xmlParser.renderXml(result.rows));
                }
            });
        });
    },

    contactos: (req, res) => {
        const { cocliente } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = 'SELECT * FROM TABLE(PACK_NEW_MAESTROS.F_L_CONTACTO_WEB(:xcliente)) ';
            const params = { xcliente: cocliente };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                if (result.rows.length > 0) {
                    res.set('Content-Type', 'text/xml');
                    res.send(xmlParser.renderXml(result.rows));
                }
            });
        });
    },
    cuentas: (req, res) => {
        const { cocliente } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = 'SELECT * FROM TABLE(PACK_NEW_MAESTROS.F_L_CUENTAS_WEB(:xcliente)) ';
            const params = { xcliente: cocliente };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                if (result.rows.length > 0) {
                    res.set('Content-Type', 'text/xml');
                    res.send(xmlParser.renderXml(result.rows));
                }
            });
        });
    },
    gridcliente: (req, res) => {
        const { emp, tipo, busqueda } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = '   SELECT * FROM TABLE(PACK_NEW_MAESTROS.F_LISTAR_CATA_ENTI(:xEmpresa,:xTipoEntidad,:xEstado,:xNom)) ';
            const params = { xEmpresa: emp, xTipoEntidad: tipo, xNom: '%' + busqueda.toUpperCase() + '%', xEstado: '%' };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderXml(result.rows));
            });
        });
    },
    rubro: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            } //co_tipo_doc_ide as value ,de_abrevia as label
            const query = "  SELECT MA_RUBR_M.CO_RUBRO AS value,  MA_RUBR_M.DE_NOMBRE AS label  FROM MA_RUBR_M   ";
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, '1'));
            });
        });
    },
    list_tipopers: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            } //co_tipo_doc_ide as value ,de_abrevia as label
            const query = "  SELECT MA_TIPO_PERS_M.CO_TIPO_PERSONA AS value,            MA_TIPO_PERS_M.DE_NOMBRE AS label,            MA_TIPO_PERS_M.DE_CLASE     FROM MA_TIPO_PERS_M   ";
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, '1'));
            });
        });
    },
    list_estadocleinte: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            } //co_tipo_doc_ide as value ,de_abrevia as label
            const query = " SELECT MA_ESTA_M.DE_NOMBRE  as LABEL,   MA_ESTA_M.DE_NOMBRE AS VALUE   FROM MA_ESTA_M     WHERE MA_ESTA_M.DE_TIPO_ESTADO = 'Clientes'            ";
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, '1'));
            });
        });
    },
    cargo_repre: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            } //co_tipo_doc_ide as value ,de_abrevia as label
            const query = " SELECT DE_NOMBRE   as LABEL,CO_CARGO_REPRESENTANTE  AS VALUE   FROM MA_CARG_REPR_M ";
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, '1'));
            });
        });
    },
    list_tiponego: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            } //co_tipo_doc_ide as value ,de_abrevia as label
            const query = "      SELECT VT_TIPO_NEGO_M.CO_TIPO_NEGOCIO as VALUE,            VT_TIPO_NEGO_M.DE_NOMBRE AS LABEL,            VT_TIPO_NEGO_M.ES_TIPO_NEGOCIO,            VT_TIPO_NEGO_M.DE_DESCRIPCION,            VT_TIPO_NEGO_M.FE_REGISTRO      FROM VT_TIPO_NEGO_M  ORDER BY VT_TIPO_NEGO_M.DE_NOMBRE ASC         ";
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, '1'));
            });
        });
    },
    list_banco: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            } //co_tipo_doc_ide as value ,de_abrevia as label
            const query = "    SELECT BA_BANC_M.CO_BANCO as VALUE,            BA_BANC_M.DE_NOMBRE AS LABEL,            BA_BANC_M.DE_ABREVIATURA      FROM BA_BANC_M     WHERE BA_BANC_M.ES_VIGENCIA = 'Vigente'         ";
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, '1'));
            });
        });
    },
    list_tipocliente: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            } //co_tipo_doc_ide as value ,de_abrevia as label
            const query = "    SELECT MA_TIPO_CLIE_M.CO_TIPO_CLIENTE as VALUE,            MA_TIPO_CLIE_M.DE_NOMBRE AS LABEL,            MA_TIPO_CLIE_M.DE_OBSERVACIONES      FROM MA_TIPO_CLIE_M      ";
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, '1'));
            });
        });
    },
    list_procedencia: (req, res) => {
        res.set('Content-Type', 'text/xml');
        rs = [{ VALUE: 'Interno', LABEL: 'Interno' }, { VALUE: 'Externo', LABEL: 'Externo' }];
        return res.send(xmlParser.renderSelect(rs, '1'));
    },
    list_origen: (req, res) => {
        res.set('Content-Type', 'text/xml');
        rs = [{ VALUE: 'Nacional', LABEL: 'Nacional' }, { VALUE: 'Extranjero', LABEL: 'Extranjero' }];
        return res.send(xmlParser.renderSelect(rs, '1'));
    },
    update_fv: (req, res) => {
        const { x_empresa, x_usuario, x_co_direccion_entidad, x_zona_comercial, x_cadena_zona_fv, x_cant_filas } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error_conec', message: err.stack });
                return;
            }
            const params = {
                x_empresa: parseInt(x_empresa), x_usuario: parseInt(x_usuario), x_co_direccion_entidad: x_co_direccion_entidad,
                x_zona_comercial: parseInt(x_zona_comercial), x_cadena_zona_fv: x_cadena_zona_fv,
                x_cant_filas: parseInt(x_cant_filas), x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                x_de_result: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            };
            var query = 'call PACK_NEW_MAESTROS.sp_cata_enti_dire_zc_fv_grabar( :x_empresa,:x_usuario,:x_co_direccion_entidad,:x_zona_comercial,:x_cadena_zona_fv,:x_cant_filas, :x_result,:x_de_result)';
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ state: 'error_query', message: error.stack });
                    return;
                } else {
                    const { x_result, x_de_result } = result.outBinds;
                    diaActual = new Date();
                    res.json({ state: 'success', codigo: x_result, message: x_de_result, fe_upd: moment().format() });
                }
            });
        });
    },
    grabacontacto: (req, res) => {
        const { xoption,x_co_catalogo, x_cargo_repre,x_co_repre ,  x_apellidos, x_nombres, x_mail, x_telefono,  x_estado} = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error_conec', message: err.stack });
                return;
            }
            const params = {
                xoption: xoption, x_cargo_repre: parseInt(x_cargo_repre),x_co_repre :x_co_repre, x_co_catalogo: parseInt(x_co_catalogo), x_apellidos: x_apellidos,
                x_nombres: x_nombres, x_mail: x_mail, x_telefono: x_telefono, x_estado: x_estado,
                x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }, x_de_result: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            };
            var query = 'CALL PACK_NEW_MAESTROS.SP_SAVE_CONTACTO_WEB(:xoption,:x_cargo_repre,:x_co_catalogo,:x_co_repre,:x_apellidos,:x_nombres,:x_mail,:x_telefono,:x_estado,:x_result,:x_de_result)';
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ state: 'error_query', message: error.stack });
                    return;
                } else {
                    const { x_result, x_de_result } = result.outBinds;
                    diaActual = new Date();
                    res.json({ state: 'success', codigo: x_result, message: x_de_result, fe_reg: moment().format('DD-MM-YYYY HH:mm:ss') });
                }
            });
        });
    },
    grabagarantes: (req, res) => {
        const { xoption, x_cogarante, x_co_catalogo, x_apellidos, x_nombres, x_direccion, x_nudocumento, x_telefono, x_aval_perma, x_vigencia,
            x_tipodoc, x_capacidad, x_co_modogara } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error_conec', message: err.stack });
                return;
            }
            const params = {
                xoption: xoption, x_cogarante: parseInt(x_cogarante), x_co_catalogo: parseInt(x_co_catalogo), x_apellidos: x_apellidos, x_nombres: x_nombres, x_direccion: x_direccion,
                x_nudocumento: x_nudocumento, x_telefono: x_telefono, x_aval_perma: x_aval_perma, x_vigencia: x_vigencia, x_tipodoc: x_tipodoc, x_capacidad: parseInt(x_capacidad),
                x_co_modogara: x_co_modogara, x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }, x_de_result: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            };
            var query = 'CALL PACK_NEW_MAESTROS.SP_SAVE_GARANTE_WEB(:xoption,:x_cogarante, :x_co_catalogo, :x_apellidos, :x_nombres, :x_direccion, :x_nudocumento, :x_telefono, :x_aval_perma, :x_vigencia,:x_tipodoc, :x_capacidad, :x_co_modogara,:x_result,:x_de_result)';
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ state: 'error_query', message: error.stack });
                    return;
                } else {
                    const { x_result, x_de_result } = result.outBinds;
                    diaActual = new Date();
                    res.json({ state: 'success', cogarante: x_result, message: x_de_result, fe_reg: moment().format('DD-MM-YYYY HH:mm:ss') });
                }
            });
        });
    },
    grabagironego: (req, res) => {
        /*xoption : _option,x_co_catalogo_entidad :cocliente , xcorubro :  myForm_giro.getItemValue('_giro'),xdetalle :  myForm_giro.getItemValue('giro_detalle'),
                    xvigencia :  myForm_giro.getItemValue('giro_stado')*/
        const { xoption, x_co_catalogo_entidad, xcorubro, xdetalle, xvigencia } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error_conec', message: err.stack });
                return;
            }
            const params = {
                xoption: xoption, x_co_catalogo_entidad: parseInt(x_co_catalogo_entidad), xcorubro: parseInt(xcorubro), xdetalle: xdetalle, xvigencia: xvigencia,
                x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }, x_de_result: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            };
            var query = 'CALL PACK_NEW_MAESTROS.SP_SAVE_RUBRO_WEB ( :xoption,:x_co_catalogo_entidad,:xcorubro,:xdetalle,:xvigencia,:x_result,:x_de_result)';
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ state: 'error_query', message: error.stack });
                    return;
                } else {
                    const { x_result, x_de_result } = result.outBinds;
                    diaActual = new Date();
                    res.json({ state: 'success', codigo: x_result, message: x_de_result, fe_reg: moment().format('DD-MM-YYYY HH:mm:ss') });
                }
            });
        });
    },
    updatezon_comer: (req, res) => {
        const { x_empresa, x_usuario, x_co_direccion_entidad, x_cadena_zona, x_cant_filas } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error_conec', message: err.stack });
                return;
            }
            const params = {
                x_empresa: parseInt(x_empresa), x_usuario: parseInt(x_usuario), x_co_direccion_entidad: x_co_direccion_entidad,
                x_cadena_zona: x_cadena_zona, x_cant_filas: parseInt(x_cant_filas), x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                x_de_result: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            };
            var query = 'call PACK_NEW_MAESTROS.sp_cata_enti_dire_zc_grabar ( :x_empresa,:x_usuario,:x_co_direccion_entidad,:x_cadena_zona,:x_cant_filas, :x_result,:x_de_result)';
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ state: 'error_query', message: error.stack });
                    return;
                } else {
                    const { x_result, x_de_result } = result.outBinds;
                    diaActual = new Date();
                    res.json({ state: 'success', codigo: x_result, message: x_de_result });
                }
            });
        });
    },

    update_data: (req, res) => {
        const { st_permiso_editar_cata_enti, x_empresa, x_alias, x_co_catalogo_entidad, x_de_razon_social, x_nu_documento, x_co_tipo_persona,
            x_co_tipo_doc_ide, x_de_procedencia, x_de_ape_paterno, x_de_ape_materno, x_de_nombre, x_de_nombre_comercial, x_de_origen,
            x_co_cliente, x_co_tipo_cliente, x_st_recaudo, x_co_banco, x_co_tipo_negocio, x_co_listado_precios, x_co_serie_listado,
            x_st_agente_retenedor, x_st_agente_percepcion, x_st_cliente_nvo, x_co_periodo_clien_nvo, x_st_cliente_corporativo,
            x_co_cliente_corporativo, x_im_credito_total, x_im_deuda_total, x_de_email, x_de_webpage, x_es_vigencia_cliente, x_fe_retiro_cliente,
            x_St_Excep_Cred } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error_conec', message: err.stack });
                return;
            }

            const params = {
                st_permiso_editar_cata_enti: st_permiso_editar_cata_enti, x_empresa: parseInt(x_empresa), x_alias: x_alias, x_co_catalogo_entidad: parseInt(x_co_catalogo_entidad) === 0 ? null : parseInt(x_co_catalogo_entidad), x_de_razon_social: x_de_razon_social, x_nu_documento: x_nu_documento, x_co_tipo_persona: x_co_tipo_persona,
                x_co_tipo_doc_ide: x_co_tipo_doc_ide, x_de_procedencia: x_de_procedencia, x_de_ape_paterno: x_de_ape_paterno, x_de_ape_materno: x_de_ape_materno, x_de_nombre: x_de_nombre, x_de_nombre_comercial: x_de_nombre_comercial, x_de_origen: x_de_origen,
                x_co_cliente: parseInt(x_co_cliente) === 0 ? null : parseInt(x_co_cliente), x_co_tipo_cliente: parseInt(x_co_tipo_cliente) === 0 ? null : parseInt(x_co_tipo_cliente), x_st_recaudo: x_st_recaudo, x_co_banco: x_co_banco, x_co_tipo_negocio: x_co_tipo_negocio, x_co_listado_precios: parseInt(x_co_listado_precios) === 0 ? null : parseInt(x_co_listado_precios), x_co_serie_listado: parseInt(x_co_serie_listado) === 0 ? null : parseInt(x_co_serie_listado),
                x_st_agente_retenedor: x_st_agente_retenedor, x_st_agente_percepcion: x_st_agente_percepcion, x_st_cliente_nvo: x_st_cliente_nvo, x_co_periodo_clien_nvo: parseInt(x_co_periodo_clien_nvo), x_st_cliente_corporativo: x_st_cliente_corporativo,
                x_co_cliente_corporativo: parseInt(x_co_cliente_corporativo) === 0 ? null : parseInt(x_co_cliente_corporativo), x_im_credito_total: parseFloat(x_im_credito_total), x_im_deuda_total: parseFloat(x_im_deuda_total), x_de_email: x_de_email, x_de_webpage: x_de_webpage, x_es_vigencia_cliente: x_es_vigencia_cliente, x_fe_retiro_cliente: x_fe_retiro_cliente.length === 0 ? null : x_fe_retiro_cliente,
                x_St_Excep_Cred: x_St_Excep_Cred, o_xresultado: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }, o_deresultado: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            };
            console.log(params);
            var query = 'call PACK_NEW_MAESTROS.sp_cata_enti_cliente_grabar(:st_permiso_editar_cata_enti,:x_empresa,:x_alias,:x_co_catalogo_entidad,:x_de_razon_social,:x_nu_documento,:x_co_tipo_persona,:x_co_tipo_doc_ide,:x_de_procedencia,:x_de_ape_paterno,:x_de_ape_materno,:x_de_nombre,:x_de_nombre_comercial,:x_de_origen,:x_co_cliente,:x_co_tipo_cliente,:x_st_recaudo,:x_co_banco,:x_co_tipo_negocio,:x_co_listado_precios,:x_co_serie_listado,:x_st_agente_retenedor,:x_st_agente_percepcion,:x_st_cliente_nvo,:x_co_periodo_clien_nvo,:x_st_cliente_corporativo,:x_co_cliente_corporativo,:x_im_credito_total,:x_im_deuda_total,:x_de_email,:x_de_webpage,:x_es_vigencia_cliente,:x_fe_retiro_cliente,:x_St_Excep_Cred,:o_xresultado,:o_deresultado)';
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ state: 'error_query', message: error.stack });
                    return;
                } else {
                    const { o_xresultado, o_deresultado } = result.outBinds;
                    diaActual = new Date();
                    res.json({ state: 'success', codigo: o_xresultado, message: o_deresultado, nombre: x_co_catalogo_entidad + ' ' + x_de_razon_social, estado: x_es_vigencia_cliente, asignado: 'Asignado', fecha: diaActual.getDate() + '/' + (parseInt(diaActual.getMonth()) + parseInt(1)) + '/' + diaActual.getFullYear() });
                }
                // conn.commit();

            });
        });
    },
    grabadirec: (req, res) => {
        const { x_alias,
            x_co_usuario,
            x_co_direccion_entidad,
            x_co_catalogo_entidad,
            x_co_ubigeo,
            x_co_via,
            x_co_zona,
            x_de_nombre_zona,
            x_de_nombre_via,
            x_nu_numero,
            x_de_interior,
            x_de_referencias,
            x_nu_local_principal,
            x_de_codigo_postal, x_es_registro, x_de_altitud,
            x_de_latitud,
            x_de_zoom, x_de_hora_ini_atencion,
            x_de_hora_fin_atencion, x_st_erased, x_cadena, x_cant_filas } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error_conec', message: err.stack });
                return;
            }

            const params = {
                x_alias: x_alias,
                x_co_usuario: parseInt(x_co_usuario),
                x_co_direccion_entidad: x_co_direccion_entidad,
                x_co_catalogo_entidad: parseInt(x_co_catalogo_entidad),
                x_co_ubigeo: x_co_ubigeo,
                x_co_via: parseInt(x_co_via),
                x_co_zona: parseInt(x_co_zona),
                x_de_nombre_zona: x_de_nombre_zona,
                x_de_nombre_via: x_de_nombre_via,
                x_nu_numero: parseInt(x_nu_numero),
                x_de_interior: x_de_interior,
                x_de_referencias: x_de_referencias,
                x_nu_local_principal: parseInt(x_nu_local_principal),
                x_de_codigo_postal: x_de_codigo_postal, x_es_registro: x_es_registro, x_de_altitud: x_de_altitud,
                x_de_latitud: x_de_latitud,
                x_de_zoom: x_de_zoom, x_de_hora_ini_atencion: new Date(1970, 1, 1, (x_de_hora_ini_atencion).split(':')[0] - 5, (x_de_hora_ini_atencion).split(':')[1], 0),
                x_de_hora_fin_atencion: new Date(1970, 1, 1, (x_de_hora_fin_atencion).split(':')[0] - 5, (x_de_hora_fin_atencion).split(':')[1], 0), x_st_erased: x_st_erased, x_cadena: x_cadena, x_cant_filas: parseInt(x_cant_filas), o_xresultado: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }, o_deresultado: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            };
            console.log(params);
            var query = 'call PACK_NEW_MAESTROS.sp_cata_enti_dire_grabar (:x_alias,:x_co_usuario,:x_co_direccion_entidad,:x_co_catalogo_entidad, :x_co_ubigeo, :x_co_via, :x_co_zona, :x_de_nombre_zona, :x_de_nombre_via, :x_nu_numero, :x_de_interior, :x_de_referencias, :x_nu_local_principal, :x_de_codigo_postal, :x_es_registro, :x_de_altitud, :x_de_latitud, :x_de_zoom, :x_de_hora_ini_atencion, :x_de_hora_fin_atencion, :x_st_erased, :x_cadena, :x_cant_filas, :o_xresultado, :o_deresultado)';
            //       PROCEDURE sp_cata_enti_cliente_grabar                  (st_permiso_editar_cata_enti , x_empresa,    x_alias ,x_co_catalogo_entidad,x_de_razon_social,x_nu_documento   ,x_co_tipo_persona,x_co_tipo_doc_ide  ,x_de_procedencia,x_de_ape_paterno,x_de_ape_materno ,x_de_nombre     ,x_de_nombre_comercial,x_de_origen ,x_co_cliente ,x_co_tipo_cliente   ,x_st_recaudo  ,x_co_banco ,x_co_tipo_negocio  ,x_co_listado_precios,x_co_serie_listado ,x_st_agente_retenedor  ,x_st_agente_percepcion ,x_st_cliente_nvo  ,x_co_periodo_clien_nvo  ,x_st_cliente_corporativo ,x_co_cliente_corporativo ,x_im_credito_total ,x_im_deuda_total ,x_de_email ,x_de_webpage    ,x_es_vigencia_cliente ,x_fe_retiro_cliente,x_result out number,x_de_result out varchar2) AS
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ state: 'error_query', message: error.stack });
                    return;
                } else {
                    const { o_xresultado, o_deresultado } = result.outBinds;
                    diaActual = new Date();
                    res.json({ state: 'success', codigo: o_xresultado, message: o_deresultado });
                }
                // conn.commit();

            });
        });
    },
    ////////////////////////////////////////////////////////////////////////--------------------------------------------------------------------------------
    upload: (req, res) => {
        var __req = req; // console.log(req);
        var __src, __file;
        if (req.method.toLowerCase() == 'post') {
            var formu = new formidable.IncomingForm();
            formu.maxFileSize = 2 * 1024 * 1024;
            formu.on('fileBegin', function (name, file) {
                file.path = './public/assets/images/' + file.name;
            });
            formu.on('file', function (name, file) {
                __file = file;
            });
            formu.on('error', function (error) { // I thought this would handle the upload error
                if (error)
                    res.json({ state: 'alert', message: error });
                res.resume();
                return false;
            });
            formu.parse(req, function (err, fields, files) {
                if (!err)
                    res.json({ state: 'success', src: '/assets/images/ma010104/' + files.file_name.name });
                else
                    res.json({ state: 'alert', message: err });
            });
            return;
        }
    },
    file_exist: (req, res) => {
        const { emp } = req.body;
        var path_ = './public', FolferLogo = '/assets/images/ma010104/' + emp;
        var folder = path_ + FolferLogo;
        fs.ensureDir(folder, desiredMode).then(() => {
            var files = [fs.readdirSync(folder)];
            __srclogo = (files[0].length > 0) ? FolferLogo + '/' + files[0] : '/assets/images/icons/iconsjhon/camera.png';
            res.json({ state: 'readfile', srclogo: __srclogo });
        }).catch(err => {
            console.error(err);
        });
    },
    c_list_estado: (req, res) => {
        res.set('Content-Type', 'application/xml');
        res.send('<?xml version="1.0" encoding="utf-8"?><data><item value="Vigente" label="Vigente" /><item value="Retirado" label="Retirado" /></data>');
    },
    datos_empresa: (req, res) => {
        const { emp } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }//   RUC,DE_RAZ_SOCIAL,DE_NOMBRE,MONEDA,FE_REGIS,ES_VIGENCIA
            const query = '  SELECT   *   FROM TABLE(PW_MA010104.F_DATA_EMPRESA(:p_empresa) ) ';
            const params = { p_empresa: emp };
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'application/json');
                res.send(result.rows);
                conn.close();
            });
        });
    },
    cargardata: (req, res) => {
        const { emp } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = '  SELECT CO_DIRECCION_EMPRESA ,DE_DIRECCION,FE_SYS,CO_UBIGEO,ES_VIGENCIA,ST_PRINCIPAL,ST_PROPIO,DE_DIRECCION_CORTA,NPRINCIPAL,NUBIGEO  FROM TABLE(PW_MA010104.F_DATA_DIRECC(:p_empresa) ) ';
            const params = { p_empresa: emp };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ state: 'error_conected', message: error.stack });
                    return;
                }
                var arr = [];
                for (var i in result.rows) {
                    var iRow = result.rows[i];
                    var vCell = [];
                    for (var key in iRow)
                        vCell.push(iRow[key]);
                    arr.push({
                        '@': { id: result.rows[i].CO_PERIODO },
                        cell: vCell
                    });
                }
                res.set('Content-Type', 'text/xml');
                res.send(o2x({
                    '?xml version="1.0" encoding="utf-8"?': null,
                    rows: {
                        row: arr
                    }
                }));
            });
        });
    },
    cambiaestado: (req, res) => {
        const { emp, codigo, vigencia, tipo } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', message: err.stack });
                return;
            }
            var query = '  call PW_MA010104.UPDATE_ESTADO(:emp, :codigo, :vigencia,:o_resultado)';
            const params = { codigo: codigo, vigencia: vigencia, emp: emp, o_resultado: { dir: oracledb.BIND_OUT, type: oracledb.STRING } };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    return res.send({ state: 'error', message: error.stack });
                } else {
                    const { o_resultado } = result.outBinds;
                    return res.json({ state: 'success', message: o_resultado });
                }

            });
        });
    }

};
module.exports = ma010102Controller;