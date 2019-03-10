const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');
const formidable = require('formidable');
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
                res.send({'error_conexion': err.stack});
                return;
            } //co_tipo_doc_ide as value ,de_abrevia as label
            const query = "    select CO_MONEDA  as value, DE_NOMBRE AS label    from MA_MONE_M    ";
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({'error_query': error.stack});
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, '1'));
            });
        });
    },

    savelinea: (req, res) => {
        const  {ucliente, u_autoriza, emp, fv, cmone, stper, obs, mont} = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({state: 'error_conec', message: err.stack});
                return;
            }

            const params = {ucliente: parseInt(ucliente), u_autoriza: parseInt(u_autoriza), emp: parseInt(emp), fv: fv, cmone: cmone, stper: stper, obs: obs, mont: parseFloat(mont),
                o_codresult: {dir: oracledb.BIND_OUT, type: oracledb.NUMBER}, o_deresultado: {dir: oracledb.BIND_OUT, type: oracledb.STRING}
            };
            // console.log(params);
            var query = 'call PW_MA010102.ASIGNA_LINEA_CREEDITO(:ucliente,:u_autoriza,:emp,:fv,:cmone,:stper,:obs,:mont,:o_codresult, :o_deresultado)';
            //       PROCEDURE sp_cata_enti_cliente_grabar                  (st_permiso_editar_cata_enti , x_empresa,    x_alias ,x_co_catalogo_entidad,x_de_razon_social,x_nu_documento   ,x_co_tipo_persona,x_co_tipo_doc_ide  ,x_de_procedencia,x_de_ape_paterno,x_de_ape_materno ,x_de_nombre     ,x_de_nombre_comercial,x_de_origen ,x_co_cliente ,x_co_tipo_cliente   ,x_st_recaudo  ,x_co_banco ,x_co_tipo_negocio  ,x_co_listado_precios,x_co_serie_listado ,x_st_agente_retenedor  ,x_st_agente_percepcion ,x_st_cliente_nvo  ,x_co_periodo_clien_nvo  ,x_st_cliente_corporativo ,x_co_cliente_corporativo ,x_im_credito_total ,x_im_deuda_total ,x_de_email ,x_de_webpage    ,x_es_vigencia_cliente ,x_fe_retiro_cliente,x_result out number,x_de_result out varchar2) AS
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({state: 'error_query', message: error.stack});
                    return;
                } else {
                    console.log(result.outBinds);
                    const {o_codresult, o_deresultado} = result.outBinds;
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
        const  {emp, cliente} = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({state: 'error', error_conexion: err.stack});
                return;
            }
            const query = "Select cl.co_moneda,cl.co_fuerza_venta,cl.IM_LINEA_CREDITO_FINAL,mone.DE_NOMBRE,cl.ES_VIGENCIA,to_char(cl.FE_APROBACION_CREDITO,'dd/mm/yyyy HH24:MI:SS'),cl.ST_PERMANENTE,cl.DE_OBSERVACION_AUTORIZA  from ba_line_cred_m cl  left join MA_MONE_M mone on mone.CO_MONEDA = cl.CO_MONEDA where CL.CO_EMPRESA=:emp AND CL.CO_CLIENTE = :cliente ";
            const params = {emp: emp, cliente: cliente};
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({'error_query': error.stack});
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderXml(result.rows));
            });
        });
    },
    list_lincredito: (req, res) => {
        const  {emp} = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({'error_conexion': err.stack});
                return;
            } //co_tipo_doc_ide as value ,de_abrevia as label
            const query = "  SELECT VT_FUER_VENT_M.CO_FUERZA_VENTA as value,             VT_FUER_VENT_M.DE_NOMBRE AS label     FROM VT_FUER_VENT_M     WHERE ( VT_FUER_VENT_M.CO_EMPRESA =:empresa ) and           ( ( VT_FUER_VENT_M.ES_FUERZA = 'Vigente' ) )   ";
            const params = {empresa: emp};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({'error_query': error.stack});
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, '1'));
            });
        });
    },

    list_datos_cliente: (req, res) => {
        const {emp, codigo} = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({state: 'error', message: err.stack});
                return;
            }//   RUC,DE_RAZ_SOCIAL,DE_NOMBRE,MONEDA,FE_REGIS,ES_VIGENCIA
            const query = ' SELECT * FROM TABLE(PACK_NEW_MAESTROS.F_LISTAR_CATA_ENTI_CLIENTE(:x_empresa,:x_cliente)) ';
            const params = {x_empresa: emp, x_cliente: codigo};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({state: 'error', 'message': error.stack});
                    return;
                }
                res.set('Content-Type', 'application/json');
                res.send(result.rows);
                conn.close();
            });
        });
    },
    gridcliente: (req, res) => {
        const  {emp, tipo, busqueda} = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({state: 'error', error_conexion: err.stack});
                return;
            }
            const query = '   SELECT * FROM TABLE(PACK_NEW_MAESTROS.F_LISTAR_CATA_ENTI(:xEmpresa,:xTipoEntidad,:xEstado,:xNom)) ';
            const params = {xEmpresa: emp, xTipoEntidad: tipo, xNom: busqueda.toUpperCase(), xEstado: '%'};
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({'error_query': error.stack});
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderXml(result.rows));
            });
        });
    },
    list_tipopers: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({'error_conexion': err.stack});
                return;
            } //co_tipo_doc_ide as value ,de_abrevia as label
            const query = "  SELECT MA_TIPO_PERS_M.CO_TIPO_PERSONA AS value,            MA_TIPO_PERS_M.DE_NOMBRE AS label,            MA_TIPO_PERS_M.DE_CLASE     FROM MA_TIPO_PERS_M   ";
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({'error_query': error.stack});
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
                res.send({'error_conexion': err.stack});
                return;
            } //co_tipo_doc_ide as value ,de_abrevia as label
            const query = " SELECT MA_ESTA_M.DE_NOMBRE  as LABEL,   MA_ESTA_M.DE_NOMBRE AS VALUE   FROM MA_ESTA_M     WHERE MA_ESTA_M.DE_TIPO_ESTADO = 'Clientes'            ";
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({'error_query': error.stack});
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
                res.send({'error_conexion': err.stack});
                return;
            } //co_tipo_doc_ide as value ,de_abrevia as label
            const query = "      SELECT VT_TIPO_NEGO_M.CO_TIPO_NEGOCIO as VALUE,            VT_TIPO_NEGO_M.DE_NOMBRE AS LABEL,            VT_TIPO_NEGO_M.ES_TIPO_NEGOCIO,            VT_TIPO_NEGO_M.DE_DESCRIPCION,            VT_TIPO_NEGO_M.FE_REGISTRO      FROM VT_TIPO_NEGO_M  ORDER BY VT_TIPO_NEGO_M.DE_NOMBRE ASC         ";
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({'error_query': error.stack});
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
                res.send({'error_conexion': err.stack});
                return;
            } //co_tipo_doc_ide as value ,de_abrevia as label
            const query = "    SELECT BA_BANC_M.CO_BANCO as VALUE,            BA_BANC_M.DE_NOMBRE AS LABEL,            BA_BANC_M.DE_ABREVIATURA      FROM BA_BANC_M     WHERE BA_BANC_M.ES_VIGENCIA = 'Vigente'         ";
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({'error_query': error.stack});
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
                res.send({'error_conexion': err.stack});
                return;
            } //co_tipo_doc_ide as value ,de_abrevia as label
            const query = "    SELECT MA_TIPO_CLIE_M.CO_TIPO_CLIENTE as VALUE,            MA_TIPO_CLIE_M.DE_NOMBRE AS LABEL,            MA_TIPO_CLIE_M.DE_OBSERVACIONES      FROM MA_TIPO_CLIE_M      ";
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({'error_query': error.stack});
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
        rs = [{VALUE: 'Interno', LABEL: 'Interno'}, {VALUE: 'Externo', LABEL: 'Externo'}];
        return   res.send(xmlParser.renderSelect(rs, '1'));

    },
    list_origen: (req, res) => {
        res.set('Content-Type', 'text/xml');
        rs = [{VALUE: 'Nacional', LABEL: 'Nacional'}, {VALUE: 'Extranjero', LABEL: 'Extranjero'}];
        return    res.send(xmlParser.renderSelect(rs, '1'));

    },

    update_data: (req, res) => {
        const  {st_permiso_editar_cata_enti, x_empresa, x_alias, x_co_catalogo_entidad, x_de_razon_social, x_nu_documento, x_co_tipo_persona,
            x_co_tipo_doc_ide, x_de_procedencia, x_de_ape_paterno, x_de_ape_materno, x_de_nombre, x_de_nombre_comercial, x_de_origen,
            x_co_cliente, x_co_tipo_cliente, x_st_recaudo, x_co_banco, x_co_tipo_negocio, x_co_listado_precios, x_co_serie_listado,
            x_st_agente_retenedor, x_st_agente_percepcion, x_st_cliente_nvo, x_co_periodo_clien_nvo, x_st_cliente_corporativo,
            x_co_cliente_corporativo, x_im_credito_total, x_im_deuda_total, x_de_email, x_de_webpage, x_es_vigencia_cliente, x_fe_retiro_cliente,
            x_St_Excep_Cred} = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({state: 'error_conec', message: err.stack});
                return;
            }

            const params = {st_permiso_editar_cata_enti: st_permiso_editar_cata_enti, x_empresa: parseInt(x_empresa), x_alias: x_alias, x_co_catalogo_entidad: parseInt(x_co_catalogo_entidad) === 0 ? null : parseInt(x_co_catalogo_entidad), x_de_razon_social: x_de_razon_social, x_nu_documento: x_nu_documento, x_co_tipo_persona: x_co_tipo_persona,
                x_co_tipo_doc_ide: x_co_tipo_doc_ide, x_de_procedencia: x_de_procedencia, x_de_ape_paterno: x_de_ape_paterno, x_de_ape_materno: x_de_ape_materno, x_de_nombre: x_de_nombre, x_de_nombre_comercial: x_de_nombre_comercial, x_de_origen: x_de_origen,
                x_co_cliente: parseInt(x_co_cliente) === 0 ? null : parseInt(x_co_cliente), x_co_tipo_cliente: parseInt(x_co_tipo_cliente) === 0 ? null : parseInt(x_co_tipo_cliente), x_st_recaudo: x_st_recaudo, x_co_banco: x_co_banco, x_co_tipo_negocio: x_co_tipo_negocio, x_co_listado_precios: parseInt(x_co_listado_precios) === 0 ? null : parseInt(x_co_listado_precios), x_co_serie_listado: parseInt(x_co_serie_listado) === 0 ? null : parseInt(x_co_serie_listado),
                x_st_agente_retenedor: x_st_agente_retenedor, x_st_agente_percepcion: x_st_agente_percepcion, x_st_cliente_nvo: x_st_cliente_nvo, x_co_periodo_clien_nvo: parseInt(x_co_periodo_clien_nvo), x_st_cliente_corporativo: x_st_cliente_corporativo,
                x_co_cliente_corporativo: parseInt(x_co_cliente_corporativo) === 0 ? null : parseInt(x_co_cliente_corporativo), x_im_credito_total: parseFloat(x_im_credito_total), x_im_deuda_total: parseFloat(x_im_deuda_total), x_de_email: x_de_email, x_de_webpage: x_de_webpage, x_es_vigencia_cliente: x_es_vigencia_cliente, x_fe_retiro_cliente: x_fe_retiro_cliente.length === 0 ? null : x_fe_retiro_cliente,
                x_St_Excep_Cred: x_St_Excep_Cred, o_xresultado: {dir: oracledb.BIND_OUT, type: oracledb.NUMBER}, o_deresultado: {dir: oracledb.BIND_OUT, type: oracledb.STRING}};
            console.log(params);
            var query = 'call PACK_NEW_MAESTROS.sp_cata_enti_cliente_grabar(:st_permiso_editar_cata_enti,:x_empresa,:x_alias,:x_co_catalogo_entidad,:x_de_razon_social,:x_nu_documento,:x_co_tipo_persona,:x_co_tipo_doc_ide,:x_de_procedencia,:x_de_ape_paterno,:x_de_ape_materno,:x_de_nombre,:x_de_nombre_comercial,:x_de_origen,:x_co_cliente,:x_co_tipo_cliente,:x_st_recaudo,:x_co_banco,:x_co_tipo_negocio,:x_co_listado_precios,:x_co_serie_listado,:x_st_agente_retenedor,:x_st_agente_percepcion,:x_st_cliente_nvo,:x_co_periodo_clien_nvo,:x_st_cliente_corporativo,:x_co_cliente_corporativo,:x_im_credito_total,:x_im_deuda_total,:x_de_email,:x_de_webpage,:x_es_vigencia_cliente,:x_fe_retiro_cliente,:x_St_Excep_Cred,:o_xresultado,:o_deresultado)';
            //       PROCEDURE sp_cata_enti_cliente_grabar                  (st_permiso_editar_cata_enti , x_empresa,    x_alias ,x_co_catalogo_entidad,x_de_razon_social,x_nu_documento   ,x_co_tipo_persona,x_co_tipo_doc_ide  ,x_de_procedencia,x_de_ape_paterno,x_de_ape_materno ,x_de_nombre     ,x_de_nombre_comercial,x_de_origen ,x_co_cliente ,x_co_tipo_cliente   ,x_st_recaudo  ,x_co_banco ,x_co_tipo_negocio  ,x_co_listado_precios,x_co_serie_listado ,x_st_agente_retenedor  ,x_st_agente_percepcion ,x_st_cliente_nvo  ,x_co_periodo_clien_nvo  ,x_st_cliente_corporativo ,x_co_cliente_corporativo ,x_im_credito_total ,x_im_deuda_total ,x_de_email ,x_de_webpage    ,x_es_vigencia_cliente ,x_fe_retiro_cliente,x_result out number,x_de_result out varchar2) AS
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({state: 'error_query', message: error.stack});
                    return;
                } else {
                    const {o_xresultado, o_deresultado} = result.outBinds;
                    diaActual = new Date();
                    res.json({state: 'success', codigo: o_xresultado, message: o_deresultado, nombre: x_de_nombre_comercial, estado: x_es_vigencia_cliente, asignado: 'Asignado', fecha: diaActual.getDate() + '/' + (parseInt(diaActual.getMonth()) + parseInt(1)) + '/' + diaActual.getFullYear()});
                }
                // conn.commit();

            });
        });
    },

    ////////////////////////////////////////////////////////////////////////--------------------------------------------------------------------------------
    upload: (req, res) => {
        var __req = req;// console.log(req);
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
                    res.json({state: 'alert', message: error});
                res.resume();
                return false;
            });
            formu.parse(req, function (err, fields, files) {
                if (!err)
                    res.json({state: 'success', src: '/assets/images/ma010104/' + files.file_name.name});
                else
                    res.json({state: 'alert', message: err});
            });
            return;
        }
    },
    file_exist: (req, res) => {
        const {emp} = req.body;
        var path_ = './public', FolferLogo = '/assets/images/ma010104/' + emp;
        var folder = path_ + FolferLogo;
        fs.ensureDir(folder, desiredMode).then(() => {
            var files = [fs.readdirSync(folder)];
            __srclogo = (files[0].length > 0) ? FolferLogo + '/' + files[0] : '/assets/images/icons/iconsjhon/camera.png';
            res.json({state: 'readfile', srclogo: __srclogo});
        }).catch(err => {
            console.error(err);
        });
    },

    c_list_estado: (req, res) => {
        res.set('Content-Type', 'application/xml');
        res.send('<?xml version="1.0" encoding="utf-8"?><complete>  <option value="Vigente" selected="true" css="color:green">Vigente</option>  <option value="Retirado" css="color:red">Retirado</option></complete>');
    },

    datos_empresa: (req, res) => {
        const  {emp} = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({state: 'error', error_conexion: err.stack});
                return;
            }//   RUC,DE_RAZ_SOCIAL,DE_NOMBRE,MONEDA,FE_REGIS,ES_VIGENCIA
            const query = '  SELECT   *   FROM TABLE(PW_MA010104.F_DATA_EMPRESA(:p_empresa) ) ';
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

    cargardata: (req, res) => {
        const  {emp} = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({state: 'error', error_conexion: err.stack});
                return;
            }
            const query = '  SELECT CO_DIRECCION_EMPRESA ,DE_DIRECCION,FE_SYS,CO_UBIGEO,ES_VIGENCIA,ST_PRINCIPAL,ST_PROPIO,DE_DIRECCION_CORTA,NPRINCIPAL,NUBIGEO  FROM TABLE(PW_MA010104.F_DATA_DIRECC(:p_empresa) ) ';
            const params = {p_empresa: emp};
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({state: 'error_conected', message: error.stack});
                    return;
                }
                var arr = [];
                for (var i in result.rows) {
                    var iRow = result.rows[i];
                    var vCell = [];
                    for (var key in iRow)
                        vCell.push(iRow[key]);
                    arr.push({
                        '@': {id: result.rows[i].CO_PERIODO},
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
        const  {emp, codigo, vigencia, tipo} = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({state: 'error', message: err.stack});
                return;
            }
            var query = '  call PW_MA010104.UPDATE_ESTADO(:emp, :codigo, :vigencia,:o_resultado)';
            const params = {codigo: codigo, vigencia: vigencia, emp: emp, o_resultado: {dir: oracledb.BIND_OUT, type: oracledb.STRING}};
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

module.exports = ma010102Controller;