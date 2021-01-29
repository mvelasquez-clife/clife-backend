const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');
var fs = require('fs');
const path = require('path');
const responseParams = {
    outFormat: oracledb.OBJECT,
    autoCommit: true
};

const lo0101030401Controller = {

    mostrarfiltro: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "SELECT NU_TIPO_FILTRO AS value,DE_TIPO_FILTRO AS label FROM TABLE(PACK_NEW_KARDEX.F_LIS_FILTRO_PROD())";
            const params = { };
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

    mostrarProductos: (req, res) => { 
         
        const {empresa,filtro,buscador} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "SELECT DE_PRODUCTO,CO_PRODUCTO,DE_CLASE,DE_FAMILIA ,CO_CODIGO_BARRAS,DE_MARCA,DE_SUB_MARCA,DE_CLASE_BIEN_SERV,DE_TIPO_BIEN_SERV,DE_PRODUCTO_INCI, DE_PRODUCTO_REG_SAN,NU_PRODUCTO_REG_SAN,CO_CODIGO_INTEGRA,DE_PRINCIPIO_ACTIVO, CASE WHEN ST_ANALISIS = 'N' THEN '0' ELSE '1' END,CO_CODIGO_CAS,CASE WHEN ST_ACTIVO_FIJO  = 'N' THEN '0' ELSE '1' END,CASE WHEN ST_ANALISIS_MICROBIOLOGICO = 'N' THEN '0' ELSE '1' END,CASE WHEN ST_QUIMICO_FISCAL  = 'N' THEN '0' ELSE '1' END,CASE WHEN ST_GESTION_STOCK = 'N' THEN '0' ELSE '1' END,CASE WHEN ST_ARCHIVOS  = 'N' THEN '0' ELSE '1' END,CASE WHEN ST_FORMULACION = 'N' THEN '0' ELSE '1' END,CASE WHEN ST_SUSTITUTO  = 'N' THEN '0' ELSE '1' END,ES_VIGENCIA,CO_CLASE,CO_FAMILIA FROM TABLE(PACK_NEW_KARDEX.F_LIS_PROD_RESULT_01(:x_empresa ,:x_tipo_filtro ,:x_texto_filtro))";
            
            const params = {
                x_empresa  : {val : empresa},
                x_tipo_filtro: {val : filtro},
                x_texto_filtro: {val : buscador},
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    console.log(error);
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ DE_PRODUCTO: 'No se encontraron coincidencias' }]));
            });
        });
    },

    mostrarPeriodo: (req, res) => { 
        const {empresa,co_producto} = req.body;   
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "select co_periodo \"value\",de_periodo \"text\" from table(pack_new_kardex.f_lis_peri_x_prod(:x_empresa,:x_prod))";
            
            const params = {
                x_empresa  : {val : empresa},
                x_prod: {val : co_producto},
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                if(result.rows.length > 0) {                
                    res.json({
                        state: 'success',
                        data: {
                            periodo: result.rows
                        }   
                    });       
                }
            });
        });
         
    },

    mostrarAlmaporprod: (req, res) => { 
         
        const {empresa,periodo,producto} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select co_almacen,de_almacen,nu_saldo,co_periodo,co_producto from table(pack_new_kardex.f_lis_alma_x_prod_peri(:x_empresa,:x_periodo,:x_prod))";
            
            const params = {
                x_empresa  : {val : empresa},
                x_periodo: {val : periodo},
                x_prod: {val : producto},
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    console.log(error);
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_ALMACEN: 'No se encontraron coincidencias' }]));
            });
        });
    },

    mostrardetalleAlmapr: (req, res) => { 

        const {empresa,periodo,almacen,producto} = req.params;  
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select de_ubicacion,co_lote,nu_inicial,nu_saldo,TO_CHAR(fe_vencimiento, 'dd/mm/yyyy'),nu_real,nu_cuarentena,nu_reserva,co_re_analisis,nu_prioridad,TO_CHAR(fe_salida_programada, 'dd/mm/yyyy') from table(pack_new_kardex.f_lis_alma_peri_prod_det_01(:x_empresa,:x_periodo,:x_alma,:x_prod ))";
            
            const params = {
                x_empresa  : {val : empresa},
                x_periodo: {val : periodo},
                x_alma: {val : almacen},
                x_prod: {val : producto},
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    console.log(error);
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ de_ubicacion: 'No se encontraron coincidencias' }]));
            });
        });
    },

    mostrardetalleAlmase: (req, res) => { 

        const {empresa,periodo,almacen,producto,transaccion} = req.params;  
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select co_numero_mov,TO_CHAR(fe_movimiento, 'dd/mm/yyyy'),de_tipo_transaccion,nu_ingreso,nu_egreso,co_lote,de_ubicacion,co_docu_1,de_tipo_docu_1,TO_CHAR(fe_docu_1, 'dd/mm/yyyy'),co_docu_2,de_tipo_docu_2,TO_CHAR(fe_docu_2, 'dd/mm/yyyy'),co_docu_3,es_vigencia,co_pedido,co_prin_voucher,co_producto,co_almacen,co_periodo,co_tipo_docu_1,co_tipo_docu_2 from table(pack_new_kardex.f_lis_alma_peri_prod_det_02(:x_empresa,:x_periodo ,:x_alma ,:x_prod ,:x_transaccion))";
         
            const params = {
                x_empresa  : {val : empresa},
                x_periodo: {val : periodo},
                x_alma: {val : almacen},
                x_prod: {val : producto},
                x_transaccion: {val :transaccion},
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    console.log(error);
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ co_numero_mov: 'No se encontraron coincidencias' }]));
            });
        });
    },

    mostrardetalleAlmater: (req, res) => { 

        const {empresa,periodo,almacen,producto} = req.params;  
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select nu_real,nu_cuarentena,nu_reservado,nu_saldo,nu_fabricacion,case when st_disponible = 'N' then '0' else '1' end,im_prec_promedio from table(pack_new_kardex.f_lis_alma_peri_prod_det_00(:x_empresa,:x_periodo,:x_alma,:x_prod ))";
         
            const params = {
                x_empresa  : {val : empresa},
                x_periodo: {val : periodo},
                x_alma: {val : almacen},
                x_prod: {val : producto},
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    console.log(error);
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ nu_real: 'No se encontraron coincidencias' }]));
            });
        });
    },

    mostrartipotrans: (req, res) => { 
        const {empresa,periodo,almacen,producto} = req.body; 
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "select co_tipo_transaccion \"value\",de_tipo_transaccion  \"text\" from table(pack_new_kardex.f_lis_tipo_tran_al_pe_pr(:x_empresa,:x_periodo,:x_alma,:x_prod))";
            
            const params = {
                x_empresa  : {val : empresa},
                x_periodo: {val : periodo},
                x_alma: {val : almacen},
                x_prod: {val : producto},
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                if(result.rows.length > 0) {                
                    res.json({
                        state: 'success',
                        data: {
                            transaccion: result.rows
                        }   
                    });       
                }
            });
        });
         
    },

    mostrarinsyemp: (req, res) => { 

        const {empresa,periodo,producto} = req.params;  

        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select TO_CHAR(fe_inicio_plan, 'dd/mm/yyyy'),co_orden_trabajo,co_lote,nu_cantidad_programada,de_estado from table(pack_new_kardex.f_lis_prod_orde_trab_proceso(:x_empresa,:x_periodo,:x_prod))";
            
            const params = {
                x_empresa  : {val : empresa},
                x_periodo: {val : periodo},
                x_prod: {val : producto},
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ fe_inicio_plan: 'No se encontraron coincidencias' }]));
            });
        });
    },

    mostrarpedres: (req, res) => { 

        const {empresa,almacen,producto} = req.params;  

        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select nu_cantidad,co_pedido,TO_CHAR(fe_entrega, 'dd/mm/yyyy'),co_cliente,de_cliente,im_total,es_vigencia,TO_CHAR(fe_cierre, 'dd/mm/yyyy'),co_vendedor,de_vendedor,TO_CHAR(fe_pedido, 'dd/mm/yyyy'),de_packing_facturacion from table(pack_new_kardex.f_lis_pedidos_pend(:x_empresa ,:x_alma ,:x_prod))";
            
            const params = {
                x_empresa  : {val : empresa},
                x_alma: {val : almacen},
                x_prod: {val : producto},
            };

            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ nu_cantidad: 'No se encontraron coincidencias' }]));
            });
        });
    },

    mostrardetprires: (req, res) => { 

        const {empresa,periodo,almacen,producto} = req.params;  

        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select co_lote,de_ubicacion,TO_CHAR(fe_documento, 'dd/mm/yyyy'),co_documento,nu_cant_solicitado,nu_cant_atendido,nu_cant_reservado,co_documento_referencia from table(pack_new_kardex.f_lis_reser_prod_det_01(:x_empresa,:x_periodo,:x_almacen,:x_prod))";
            
            const params = {
                x_empresa  : {val : empresa},
                x_periodo: {val : periodo},
                x_almacen: {val : almacen},
                x_prod: {val : producto},
            };

            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ co_lote: 'No se encontraron coincidencias' }]));
            });
        });
    },
    
    mostrardetsegres: (req, res) => { 

        const {empresa,periodo,almacen,producto} = req.params;  

        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select co_lote,de_ubicacion,nu_reserva,nu_saldo,nu_prioridad,TO_CHAR(fe_vencimiento, 'dd/mm/yyyy'),es_vencido,nu_concentracion from table(pack_new_kardex.f_lis_reser_prod_det_02(:x_empresa,:x_periodo,:x_almacen,:x_prod))";
            
            const params = {
                x_empresa  : {val : empresa},
                x_periodo: {val : periodo},
                x_almacen: {val : almacen},
                x_prod: {val : producto},
            };

            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ co_lote: 'No se encontraron coincidencias' }]));
            });
        });
    },
    
    mostrarcambioubi: (req, res) => { 

        const {empresa,periodo,almacen,producto} = req.params;  

        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select co_numero_mov,TO_CHAR(fe_movimiento, 'dd/mm/yyyy'),co_lote,de_ubicacion,nu_ingreso,de_ubicacion_nva,nu_egreso,de_observaciones,TO_CHAR(fe_cambio, 'dd/mm/yyyy') from table(pack_new_kardex.f_lis_cambio_ubic_prod(:x_empresa,:x_periodo,:x_almacen,:x_prod))";
          
            const params = {
                x_empresa  : {val : empresa},
                x_periodo: {val : periodo},
                x_almacen: {val : almacen},
                x_prod: {val : producto},
            };

            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ co_numero_mov: 'No se encontraron coincidencias' }]));
            });
        });
    },

    mostrarmovimientos: (req, res) => { 

        const {empresa,periodo,almacen,producto} = req.params;  

        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select de_ubicacion,co_lote,nu_inicial,nu_saldo,TO_CHAR(fe_vencimiento, 'dd/mm/yyyy'),nu_real,nu_cuarentena,nu_reserva,co_re_analisis,nu_prioridad,TO_CHAR(fe_salida_programada, 'dd/mm/yyyy') from table(pack_new_kardex.f_lis_all_movi_prod(:x_empresa,:x_periodo,:x_almacen,:x_prod))";
          
            const params = {
                x_empresa  : {val : empresa},
                x_periodo: {val : periodo},
                x_almacen: {val : almacen},
                x_prod: {val : producto},
            };

            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ de_ubicacion: 'No se encontraron coincidencias' }]));
            });
        });
    },
    
    PdfReporteuno: async (request, response) => {
        // if (request.cookies[confParams.cookieIntranet]) {
            const { movimiento,empresa,transacc,periodo,coddoc1 } = request.params;
            // const sesion = JSON.parse(request.cookies[confParams.cookieIntranet]);
            try {
                const conn = await oracledb.getConnection(dbParams);
                let query = "select * from table(pack_new_kardex.f_lis_lis_vt_pedi_prod(:x_movimiento))";
                let params = {
                    x_movimiento: { val: movimiento }
                };
                const result = await conn.execute(query, params, responseParams);
                const filas = result.rows;
                query = "select de_nombre,nu_ruc from ma_empr_m where co_empresa = :x_empresa";
                params = {
                    x_empresa: { val: empresa }
                };
                const result_2 = await conn.execute(query, params, responseParams);
                var empresa_dat;
                var nombre,ruc;               
                for(var i in result_2.rows) {
                    empresa_dat = result_2.rows[i];                  
                }
                nombre = empresa_dat.DE_NOMBRE;
                ruc = empresa_dat.NU_RUC;
                // pinta pdf
                const pdfWriter = require('html-pdf');
                const ejs = require('ejs');
                // const d = new Date();
                const data = {
                    nombre: nombre,
                    ruc: ruc,
                    filas: filas,
                    movimiento:movimiento,
                    transacc:transacc,
                    periodo:periodo,
                    coddoc1:coddoc1
                    // usuario: sesion.ncomercial
                };
                const html = await ejs.renderFile(path.resolve('client/views/modulos/logistica/kardex1-report-1.ejs'), data);
                const pdfOptions = {
                    border: {
                        top: '0mm',
                        right: '20mm',
                        bottom: '0mm',
                        left: '5mm'
                    },
                    footer: {
                        height: '5mm',
                        contents: {
                            default: '<span style="color:#444;font-size:6px;">Página <b>{{page}}</b> de <b>{{pages}}</b></span>'
                        }
                    },
                    format: 'A4',
                    header: {
                        height: '10mm',
                        contents: '<span style="font-size:6px;text-align:left;vertical-align:middle;"> </span>'
                    },
                    orientation: 'portrait',
                    zoomFactor: 0.5
                };
                pdfWriter.create(html, pdfOptions).toStream((err, stream) => {
                    if (err) return response.end(err.stack);
                    response.setHeader('Content-type', 'application/pdf');
                    // response.setHeader('Content-Disposition', 'attachment; filename="reporte.pdf');
                    stream.pipe(response);
                });
            }
            catch (err) {
                console.error(err);
                response.json({
                    error: err
                });
            }
        // }
        // else response.redirect('/intranet/login');
    },
}

module.exports = lo0101030401Controller;