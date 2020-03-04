const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');
const responseParams = {
    outFormat: oracledb.OBJECT,
    autoCommit: true
};
var fs = require('fs');
var pdf = require('html-pdf');
var html = fs.readFileSync('client/views/modulos/logistica/LO0107Plantilla.ejs', 'utf8');
var options = { format: 'Letter' };

var users = [
    {
        name:"Shyam",
        age:"26"
    },
    {
        name:"Navjot",
        age:"26"
    },
    {
        name:"Vitthal",
        age:"26"
    }
]
var document   = {   
    html :  html ,    
    users: users,
    path : "public/files/logistica/LO0107/reporte.pdf" 
} ;
// var test = 'A';
// // Paquete requerido
// var  pdf  = require('pdf-creator-node'); 
// var  fs  = require('fs') ; 
 
// //  Leer plantilla HTML
// var  html  = fs.readFileSync('client/views/modulos/logistica/LO0107Plantilla.ejs' , 'utf8' ) ;

// var options = {
//     format: "A3",
//     orientation: "portrait",
//     border: "10mm",
//     header: {
//         height: "45mm",
//         contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
//     },
//     "footer": {
//         "height": "28mm",
//         "contents": {
//         first: 'Cover page',
//         2: 'Second page', // Any page number is working. 1-based index
//         default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
//         last: 'Last Page'
//     } }
// };




const lo0107Controller = {
    mostraralmacen: (req, res) => {
        const {empresa} = req.params; 
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "SELECT CO_ALMACEN AS value,DE_NOMBRE AS label FROM TABLE(PACK_NEW_REQU_PROD.F_LIST_ALMA(:x_emp))";
            const params = { x_emp: { val: empresa }};
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

    mostraringreso: (req, res) => {        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "SELECT CO_CATEG_INGRESO_GASTO AS value,DE_NOMBRE AS label FROM TABLE(PACK_NEW_REQU_PROD.F_LIST_ING_GASTO())";
            
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
    
    mostrarmotivo: (req, res) => {      
        const {ingreso_gasto} = req.body;   
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "SELECT CO_MOTI_REQUERIMIENTO \"value\",DE_MOTI_REQUERIMIENTO \"text\" FROM TABLE(PACK_NEW_REQU_PROD.F_LIST_MOTI_POR_INGR(:x_ingreso_gasto))";
            
            const params = {x_ingreso_gasto: {val : ingreso_gasto}};
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
                            usuario: result.rows
                        }   
                    });       
                }
            });
        });
    },

    seleccionpersonal: (req, res) => {      
        const {empresa} = req.params;  
       
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "SELECT CO_CATALOGO_ENTIDAD,DE_RAZON_SOCIAL FROM TABLE(PACK_NEW_REQU_PROD.F_LIST_PERSONA(:x_empresa))";
            
            const params = {x_empresa: {val : empresa}};
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_CATALOGO_ENTIDAD: '', DE_RAZON_SOCIAL: 'No se encontraron coincidencias' }]));
            });
        });
    },

    seleccionccosto: (req, res) => {      
        const {empresa} = req.params;  
       
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "SELECT CO_CENTRO_COSTO, DE_NOMBRE FROM TABLE (PACK_NEW_REQU_PROD.F_LIST_CCOSTO(:x_empresa))";
            
            const params = {x_empresa: {val : empresa}};
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_CENTRO_COSTO: '', DE_NOMBRE: 'No se encontraron coincidencias' }]));
            });
        });
    }, 

    seleccionentidad: (req, res) => {    
        const {valor} = req.params;   
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "SELECT CO_CATALOGO_ENTIDAD,DE_RAZON_SOCIAL FROM TABLE (PACK_NEW_REQU_PROD.F_LIST_CATA_ENTI(:x_valor))";
            
            const params = { x_valor: {val: valor}};
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_CATALOGO_ENTIDAD: '', DE_RAZON_SOCIAL: 'No se encontraron coincidencias' }]));
            });
        });
    }, 
    
    mostrarProductos: (req, res) => {      
        const {empresa,periodo,almacen,ubicacion} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "SELECT 0,CO_CATALOGO_PRODUCTO,DE_NOMBRE,DE_UBICACION,DE_ABREVIATURA,NU_SALDO,CO_LOTE,MARCA,SUBMARCA,CLASE,FAMILIA,SUBFAMILIA FROM TABLE (PACK_NEW_REQU_PROD.F_SALDO_MATE_ALM_CUAR(:x_empresa,:x_periodo,:x_almacen,:x_ubicacion))";
            
            const params = {x_empresa: {val : empresa},x_periodo: {val : periodo}, x_almacen :{val: almacen}, x_ubicacion: {val : ubicacion}};
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_CATALOGO_PRODUCTO: '', DE_NOMBRE: 'No se encontraron coincidencias' }]));
            });
        });
    },

    mostrarDirecciones: (req, res) => {      
        const {catalogo_entidad} = req.params;  
       
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "SELECT CO_DIRECCION_ENTIDAD,DE_PAIS,DE_DIRECCION,DE_REFERENCIAS FROM TABLE(PACK_NEW_MAESTROS.F_LISTAR_CATA_ENTI_DIRE_GRID(:x_catalogo_entidad))";
            
            const params = {x_catalogo_entidad: {val : catalogo_entidad}};
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_DIRECCION_ENTIDAD: '', DE_PAIS: 'No se encontraron coincidencias' }]));
            });
        });
    },
    
    mostrarFzaventa: (req, res) => {      
        const {direccion_entidad,empresa} = req.params;  
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "SELECT CO_ZONA_COMERCIAL,DE_ZONA_COMERCIAL,CO_FUERZA_VENTA,DE_FUERZA_VENTA FROM TABLE(PACK_NEW_MAESTROS.F_LISTAR_DIRE_ZC_FV_VIEW_GRID(:x_direccion_entidad,:x_empresa))";
            
            const params = {x_direccion_entidad: {val : direccion_entidad},x_empresa: {val : empresa}};
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ ZONA_COMERCIAL: '', DE_ZONA_COMERCIAL: 'No se encontraron coincidencias' }]));
            });
        });
    },

    mostrarSecuenc: (req, res) => {      
        const {almacen,empresa} = req.body;   
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "SELECT DE_SERIE,MAX_CANT FROM TABLE (PACK_NEW_REQU_PROD.F_SERIE_REQUE(:x_co_almacen,:x_empresa))";
            
            const params = {
                x_co_almacen: {val : almacen},
                x_empresa: {val : empresa},            
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                
                var secuencia;
                for(var i in result.rows) {
                    secuencia = result.rows[i];                  
                }
                if(result.rows.length > 0) {                
                    res.json({
                        state: 'success',
                        data: {
                            almacen: secuencia
                        }                             
                    
                    });       
                }
                else {
                    res.json({
                        state: 'error',
                        message: '0'
                    });
                }
            });
        });
    },
    mostrarreferencia: (req, res) => {        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "SELECT CO_TIPO_DOC_ADMINISTR AS value,DE_NOMBRE AS label FROM TABLE(PACK_NEW_REQU_PROD.F_LIST_REFE())";
            
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
    
    mostrarPeriodo: (req, res) => {  
        const {empresa} = req.body;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "SELECT CO_PERIODO,CO_PERIODO FROM TABLE (PACK_NEW_REQU_PROD.F_OBTERNER_PERIODO(:x_empresa))";
            
            const params = {
                x_empresa: {val : empresa},            
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }                
                var co_periodo;
                for(var i in result.rows) {
                    co_periodo = result.rows[i];                  
                }
                if(result.rows.length > 0) {                
                    res.json({
                        state: 'success',
                        data: {
                            periodo: co_periodo
                        }                             
                    
                    });       
                }
                else {
                    res.json({
                        state: 'error',
                        message: '0'
                    });
                }
            });
        });
    },

    grabarRequerimiento: (req, res) => {        
        const {action,empresa,co_almacen,reque_temp,fec_reque,co_entidad,co_tipodoc,co_nrodocref,co_tiporeq,co_estado,de_observ,
               co_motivo,solicita,centro_costos,check_cuarentena,check_ubicacion,co_fza_venta,co_zona_com,cadena_codigo_prod,cadena_cant_solicitada,cadena_lote,
               cadena_ubicacion,cant_filas_prod} = req.body;  

        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: error.Error
                });
                return;
            }
            const query = "call PACK_NEW_REQU_PROD.SP_SAVE_NVO_REQUE_MAT (:x_result,:x_de_result,:x_co_result,:x_action,:x_empresa,:x_co_almacen,:x_reque_temp,:x_fec_reque,:x_co_entidad,:x_co_tipodoc,:x_co_nrodocref,:x_co_tiporeq,:x_co_estado,:x_de_observ,:x_co_motivo,:x_solicita,:x_centro_costos,:x_check_cuarentena,:x_check_ubicacion,:x_co_fza_venta,:x_co_zona_com,:x_cadena_codigo_prod,:x_cadena_cant_solicitada,:x_cadena_lote,:x_cadena_ubicacion,:x_cant_filas_prod)";
            const params = { 
                //parametros de salida
                x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                x_de_result: {dir: oracledb.BIND_OUT, type: oracledb.STRING },
                x_co_result :{dir: oracledb.BIND_OUT, type: oracledb.STRING},
                //parametros de entrada
                x_action: {val:action},
                x_empresa: { val: empresa },
                x_co_almacen: { val: co_almacen},
                x_reque_temp: { val: reque_temp},
                x_fec_reque: { val: fec_reque},
                x_co_entidad: { val: co_entidad},
                x_co_tipodoc: { val: co_tipodoc},
                x_co_nrodocref: { val: co_nrodocref},
                x_co_tiporeq: { val: co_tiporeq},
                x_co_estado: { val: co_estado},
                x_de_observ: { val: de_observ},
                x_co_motivo: { val: co_motivo},
                x_solicita: { val: solicita},
                x_centro_costos: { val: centro_costos},
                x_check_cuarentena: { val: check_cuarentena},
                x_check_ubicacion: { val: check_ubicacion},
                x_co_fza_venta: { val: co_fza_venta},
                x_co_zona_com: { val: co_zona_com},
                x_cadena_codigo_prod: { val: cadena_codigo_prod},
                x_cadena_cant_solicitada: { val: cadena_cant_solicitada},
                x_cadena_lote: { val: cadena_lote},
                x_cadena_ubicacion: { val: cadena_ubicacion},
                x_cant_filas_prod: { val: cant_filas_prod}
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
    
                const { x_result, x_de_result, x_co_result } = result.outBinds;
                if(x_result == 1) res.json({
                    state: 'success',
                    message: x_de_result,
                    message_co:x_co_result
                });
                else res.json({
                    state: 'error',
                    message: x_de_result
                });
            });
        });
    },

    buscarcabeceraRequ: (req, res) => {    
        const {empresa,almacen,fecha_d,fecha_h,flag_pend,flag_rech,flag_ate} = req.params;  
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            // const query = "SELECT FECHA,CO_REQUERIMIENTO,CO_TIPO_DOCREF, CO_SOLICITA,FECH_REQUE, DE_MOTI_REQUERIMIENTO,CO_SIT_REQUERIMIENTO,ES_RECEPCION_REQUERIMIENTO,FH_CONFIRMA_RECEPCION,FH_AUTORIZA,FH_ATENCION,DE_OBSERVACIONES,CO_AUTORIZA,FE_SYS,CO_ENTIDAD_REF,ALMACEN_ORIGEN,ALMACEN_DESTINO FROM TABLE (PACK_NEW_REQU_PROD.F_LIST_REQU_MAT_C_CONS (:x_empresa,:x_almacen,:x_fech_desde,:x_fech_hasta,:x_flag_pend,:x_flag_rech,:x_flag_aten))";
            
            const query = "SELECT FECHA,CO_REQUERIMIENTO,IMPORTE,CO_TIPO_DOCREF, CO_SOLICITA,FECH_REQUE, DE_MOTI_REQUERIMIENTO,CO_SIT_REQUERIMIENTO,ES_RECEPCION_REQUERIMIENTO,FH_CONFIRMA_RECEPCION,FH_AUTORIZA,FH_ATENCION,DE_OBSERVACIONES,CO_AUTORIZA,FE_SYS,CO_ENTIDAD_REF,ALMACEN_ORIGEN,ALMACEN_DESTINO FROM TABLE (PACK_NEW_REQU_PROD.F_LIST_REQU_MAT_C_CONS (:x_empresa,:x_almacen,:x_fech_desde,:x_fech_hasta,:x_flag_pend,:x_flag_rech,:x_flag_aten))";
            
            const params = {
                x_empresa: {val : empresa}, 
                x_almacen :{val: almacen},
                x_fech_desde: {val : fecha_d},
                x_fech_hasta: {val : fecha_h},
                x_flag_pend: {val : flag_pend}, 
                x_flag_rech :{val: flag_rech},
                x_flag_aten: {val : flag_ate}
            
            };

            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ FECHA: '', CO_REQUERIMIENTO: 'Sin resultados' }]));
            });
        });
    },

    buscardetalleRequ: (req, res) => {    
        const {empresa,almacen,requerimiento} = req.params;  
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "SELECT 0,CO_PRODUCTO,DE_NOMBRE,CO_LOTE,DE_UBICACION,NU_CANT_SOLIC,NU_CANT_ATEN,NU_CANT_PEND,NU_CANT_APROB FROM TABLE( pack_new_requ_prod.F_LIST_REQU_MAT_D_CONS(:x_empresa,:x_almacen,:x_co_requerimiento))";
            
            const params = {
                x_empresa: {val : empresa}, 
                x_almacen :{val: almacen},
                x_co_requerimiento: {val : requerimiento}            
            };

            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ DE_NOMBRE: '', CO_PRODUCTO: 'Sin resultados' }]));
            });
        });
    },
    
    buscarguiaProd: (req, res) => {    
        const {empresa,almacen,requerimiento,producto} = req.params;  
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "SELECT CO_NUMERO_MOV,CO_GUIA_REMISION,ES_ATENCION FROM TABLE (PACK_NEW_REQU_PROD.F_LIST_REQU_MAT_POR_PROD(:x_empresa,:x_almacen,:x_co_requerimiento,:x_co_producto))";
            
            const params = {
                x_empresa: {val : empresa}, 
                x_almacen :{val: almacen},
                x_co_requerimiento: {val : requerimiento},
                x_co_producto: {val : producto}              
            };

            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_NUMERO_MOV: '', CO_GUIA_REMISION: 'Sin resultados' }]));
            });
        });
    },

    grabarestadoRequerimiento: (req, res) => {        
        const {empresa,co_usuario,co_almacen,co_requerimiento,co_estado,co_motivo} = req.body;  

        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: error.Error
                });
                return;
            }
            const query = "call PACK_NEW_REQU_PROD.SP_SAVE_ESTADO_REQUE_MAT (:x_result,:x_de_result,:x_empresa,:x_co_usuario,:x_co_almacen,:x_co_requerimiento,:x_estado,:x_motivo)";
            const params = { 
                //parametros de salida
                x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                x_de_result: {dir: oracledb.BIND_OUT, type: oracledb.STRING },
                //parametros de entrada
                x_empresa: { val: empresa },
                x_co_usuario: { val: co_usuario},
                x_co_almacen: { val: co_almacen},
                x_co_requerimiento: { val: co_requerimiento},
                x_estado: { val: co_estado},
                x_motivo: { val: co_motivo}
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
    
                const { x_result, x_de_result } = result.outBinds;
                if(x_result == 1) res.json({
                    state: 'success',
                    message: x_de_result,
                });
                else res.json({
                    state: 'error',
                    message: x_de_result
                });
            });
        });
    },
     
    mostrarmotivoDevol: (req, res) => {      
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "SELECT CO_MOTIVO_DEVOLUCION AS Value,DE_MOTIVO_DEVOLUCION AS label FROM TABLE(PACK_NEW_REQU_PROD.F_LIST_MOTIVO_DEVOLUCION())";
            
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderComboGrid(result.rows, 0));
                
            });
        });
    },  
    buscardetallereqDevol: (req, res) => {    
        const {empresa,almacen,requerimiento} = req.params;  
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "SELECT CO_PRODUCTO,DE_NOMBRE,CANT_ATEN,CANT_DEV,CO_LOTE,DE_UBICACION,CO_MOTIVO_DEVOLUCION FROM TABLE( pack_new_requ_prod.F_LIST_REQU_MAT_DEVOLUCION(:x_empresa,:x_almacen,:x_co_requerimiento))";
            
            const params = {
                x_empresa: {val : empresa}, 
                x_almacen :{val: almacen},
                x_co_requerimiento: {val : requerimiento}            
            };

            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ DE_NOMBRE: '', CO_PRODUCTO: 'Sin resultados' }]));
            });
        });
    },

    generarPdf: (req, res) =>{
        pdf.create(contenido).toFile('./salida.pdf', function(err, res) {
            if (err){
                console.log(err);
            } else {
                console.log(res);
            }
        });
    },

    
    consultaRequerimiento: (req, res) => {    
        const {empresa,almacen,fecha_d,fecha_h,flag_pend,flag_rech,flag_ate} = req.params;  
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }

            const query = "SELECT FECHA, CO_REQUERIMIENTO, CASE WHEN PRECIO_TOTAL IS NULL THEN '0' ELSE PRECIO_TOTAL END PRECIO_TOTAL,CO_TIPO_DOC ,CO_ENTIDAD,FECHA_REQU,MOTIVO,CO_SIT_REQUERIMIENTO,CO_ESTADO_REQUERIMIENTO,FH_AUTORIZA,FH_ATENCION,DE_OBSERVACIONES,CO_AUTORIZA,REGISTRADO,FECHA_REG,DE_SIT_REQUERIMIENTO,ALMACEN_ORIGEN,CASE WHEN ALMACEN_DESTINO IS NOT NULL THEN ALMACEN_DESTINO ELSE ' ' END ALMACEN_DESTINO ,CO_PRODUCTO,CO_LOTE,DE_UBICACION,IMPORTE_PRODUCTO FROM TABLE (PACK_NEW_REQU_PROD.F_LIST_REQU_DETALLE (:x_empresa,:x_almacen,:x_fech_desde,:x_fech_hasta,:x_flag_pend,:x_flag_rech,:x_flag_aten))";
            
            const params = {
                x_empresa: {val : empresa}, 
                x_almacen :{val: almacen},
                x_fech_desde: {val : fecha_d},
                x_fech_hasta: {val : fecha_h},
                x_flag_pend: {val : flag_pend}, 
                x_flag_rech :{val: flag_rech},
                x_flag_aten: {val : flag_ate}            
            };

            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ FECHA: '', CO_REQUERIMIENTO: 'Sin resultados' }]));
            });
        });
    },
    convertirPDF: (req, res) => {    
        // pdf.create(html, options).toFile('public/files/logistica/LO0107/reporte.pdf', function(err, res1) {
        //     if (err) return console.log(err);   
        //     var opn = require('opn');  
        //     opn('public/files/logistica/LO0107/reporte.pdf',{app: 'chrome'}); 
        //     res.json({data: res1} );
        //   });
          pdf.create(document, options).then(res => {
            console.log(res)
        }).catch(error => {
            console.error(error)
        });

    },

    

}

module.exports = lo0107Controller;