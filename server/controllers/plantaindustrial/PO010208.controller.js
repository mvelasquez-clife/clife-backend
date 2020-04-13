const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');
// const bcrypt = require('bcrypt');
// const crypto = require('crypto');
// const curlHost = '192.168.1.202';
var fs = require('fs');
const responseParams = {
    outFormat: oracledb.OBJECT,
    autoCommit: true
};

const po010208Controller = {
    
    mostrarclase: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "SELECT CO_CLASE AS value,DE_NOMBRE AS label FROM TABLE(PACK_NEW_DIRECCION_TECN.F_LIST_CLASE())";
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
    mostrarmarca: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "SELECT CO_MARCA AS value,DE_NOMBRE AS label FROM TABLE(PACK_NEW_DIRECCION_TECN.F_LIST_MARCA())";
            const params = { };
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, '0'));
            });
        });
    },

    mostrarfamilia: (req, res) => {      
        const {co_clase} = req.body;   
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "SELECT CO_FAMILIA \"value\",DE_NOMBRE \"text\" FROM TABLE(PACK_NEW_DIRECCION_TECN.F_LIST_FAMILIA(:x_co_clase))";
            
            const params = {x_co_clase: {val : co_clase}};

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
                            familia: result.rows
                        }   
                    });       
                }
            });
        });
    },

    mostrarsubfamilia: (req, res) => {      
        const {co_clase,co_familia} = req.body;   
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "SELECT CO_SUBFAMILIA \"value\",DE_NOMBRE \"text\" FROM TABLE(PACK_NEW_DIRECCION_TECN.F_LIST_SUBFAMILIA(:x_co_clase,:x_co_familia))";
            
            const params = {x_co_clase: {val : co_clase},x_co_familia: {val : co_familia}};

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
                            subfamilia: result.rows
                        }   
                    });       
                }
            });
        });
    },

    mostrarsubmarca: (req, res) => {      
        const {co_marca} = req.body;   
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "SELECT CO_SUBMARCA \"value\",DE_NOMBRE \"text\" FROM TABLE(PACK_NEW_DIRECCION_TECN.F_LIST_SUBMARCA(:x_co_marca))";
            
            const params = {x_co_marca: {val : co_marca}};

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
                            submarca: result.rows
                        }   
                    });       
                }
            });
        });
    },

    mostrarProductos: (req, res) => { 
         
        const {buscar,co_clase,co_familia,co_subfamilia,co_marca,co_submarca} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "SELECT 0,CO_CATALOGO_PRODUCTO,DE_NOMBRE,DE_NOMBRE_MARCA,DE_NOMBRE_SUBMARCA,DE_NOMBRE_CLASE,DE_NOMBRE_FAMILIA,DE_NOMBRE_SUBFAMILIA FROM TABLE (PACK_NEW_DIRECCION_TECN.F_LIST_PRODUCTO(:x_buscar,:x_co_clase,:x_co_familia,:x_co_subfamilia,:x_co_marca,:x_co_submarca))";
            
            const params = {
                x_buscar: {val : buscar},
                x_co_clase: {val : co_clase},
                x_co_familia: {val : co_familia},
                x_co_subfamilia: {val : co_subfamilia},
                x_co_marca: {val : co_marca},
                x_co_submarca: {val : co_submarca}
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_CATALOGO_PRODUCTO: 'No se encontraron coincidencias' }]));
            });
        });
    },

    grabarnsoc: (req, res) => {        
        const {empresa,num_registro,cant_filas_prod,cadena_productos,vigencia_ini,vigencia_ter} = req.body;  
  
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: error.Error
                });
                return;
            }
            const query = "call PACK_NEW_DIRECCION_TECN.SP_NOTIFICACION_SANITARIA (:x_result,:x_de_result,:x_empresa,:x_num_registro,:x_cant_filas_prod,:x_cadena_productos,:x_vigencia_ini,:x_vigencia_ter)";
            const params = { 
                //parametros de salida
                x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                x_de_result: {dir: oracledb.BIND_OUT, type: oracledb.STRING },
                //parametros de entrada
                x_empresa: {val:empresa},
                x_num_registro: {val:num_registro},
                x_cant_filas_prod: {val:cant_filas_prod},
                x_cadena_productos: {val:cadena_productos},//,x_vigencia_ini varchar2,x_vigencia_ter varchar2
                x_vigencia_ini: {val:vigencia_ini},
                x_vigencia_ter: {val:vigencia_ter},
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
    
    mostrarnso: (req, res) => {          
        const {buscador} = req.params;  
        console.log(buscador);
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "SELECT NU_REGISTRO,DE_NOMBRE_REGISTRADO,ES_ESTADO,FE_INICIO_VIGENCIA,FE_TERMINO_VIGENCIA,DE_RESUMEN FROM TABLE (PACK_NEW_DIRECCION_TECN.F_LIST_NOT_SANIT(:x_buscador))";
            
            const params = {
                x_buscador: {val : buscador}
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ NU_REGISTRO: 'No se encontraron coincidencias' }]));
            });
        });
    },
    
    mostrarproductosnso: (req, res) => {          
        const {co_nso} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "SELECT 0,CO_CATALOGO_PRODUCTO,DE_NOMBRE,DE_NOMBRE_MARCA,DE_NOMBRE_SUBMARCA,DE_NOMBRE_CLASE,DE_NOMBRE_FAMILIA,DE_NOMBRE_SUBFAMILIA FROM TABLE (PACK_NEW_DIRECCION_TECN.F_LIST_PRODUCTO_NSO(:x_co_nso))";
            
            const params = {
                x_co_nso: {val : co_nso}
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_CATALOGO_PRODUCTO: 'No se encontró registro' }]));
            });
        });
    },
    
    CargarPdf: async (request, response) => {
            const mv = require('mv');
            const formidable = require('formidable');
            var form = new formidable.IncomingForm();
            form.parse(request, async function (err, fields, files) {
                if (err) {
                    console.log('form.parse', err);
                    response.json({
                        error: err
                    });
                    return;
                }
                const sFilename = 'Formula.pdf';
                var oldpath = files.pdf.path;
                console.log(fields.nsoc);
                var newpath = 'public/files/direccion_tecnica/'+fields.tipo+'/nso_'+fields.nsoc+'.pdf';
                
                mv(oldpath, newpath, async function (err) {
                    console.log('entro11');
                    if (err) {
                        console.log('mv', err);
                        response.json({
                            error: err
                        });
                    }
                    response.json({
                        result: 'ok'
                    });
                });
            });
        
    },
    
    abrirPDF: (req, res) => {    
        const {tipodoc,nsoc} = req.body;  
        var opn = require('opn'); 

        fs.stat('public/files/direccion_tecnica/'+tipodoc+'/nso_'+nsoc+'.pdf', function(err) {
            if (!err) { 
                opn('public/files/direccion_tecnica/'+tipodoc+'/nso_'+nsoc+'.pdf',{app: 'chrome'});
            }
            else if (err.code === 'ENOENT') {                
                res.send({ 'error_query': 'Error' });
            }
        });
             
    },


}

module.exports = po010208Controller;

