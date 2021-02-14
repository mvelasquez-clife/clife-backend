const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');
var fs = require('fs');
const path = require('path');
const o2x = require('object-to-xml');
const responseParams = {
    outFormat: oracledb.OBJECT,
    autoCommit: true
};


const po010208Controller = {

    mostrarformcosm: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "SELECT CO_FORMA_COSMETICA AS value, DE_FORMA_COSMETICA AS label FROM TABLE (PACK_NEW_DIRECCION_TECN.F_LIST_FORM_COSM())";
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
        const {empresa,usuario,alias,num_registro_nsoc,vigencia_ini,vigencia_ter,nombre,form_cosm,espec,tvu_com,tvu_prod,version,accion} = req.body;  
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: error.Error
                });
                return;
            }
            const query = "call PACK_NEW_DIRECCION_TECN.SP_NOTIFICACION_SANITARIA (:x_result,:x_de_result,:x_empresa,:x_usuario,:x_alias,:x_num_registro_nsoc,:x_vigencia_ini,:x_vigencia_ter,:x_nombre,:x_form_cosm,:x_co_espec,:tvu_com,:tvu_prod,:x_version,:x_accion)";
            const params = { 
                //parametros de salida
                x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                x_de_result: {dir: oracledb.BIND_OUT, type: oracledb.STRING },
                //parametros de entrada
                x_empresa: {val:empresa},
                x_usuario: {val:usuario},
                x_alias: {val:alias},
                x_num_registro_nsoc: {val:num_registro_nsoc},
                x_vigencia_ini: {val:vigencia_ini},
                x_vigencia_ter: {val:vigencia_ter},
                x_nombre: {val:nombre},
                x_form_cosm: {val:form_cosm},
                x_co_espec: {val:espec},
                tvu_com: {val:tvu_com},
                tvu_prod: {val:tvu_prod},
                x_version: {val:version},
                x_accion: {val:accion}
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
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "SELECT CO_NSOC,DE_NOMBRE_REGISTRADO,ES_ESTADO,FE_INICIO_VIGENCIA,FE_TERMINO_VIGENCIA,FE_COMERCIAL,FE_PRODUCCION,NU_REGISTRO,CO_FORMA_COSMETICA,CO_ESPEC_ANAL,DE_ESPEC_ANAL FROM TABLE (PACK_NEW_DIRECCION_TECN.F_LIST_NOT_SANIT(:x_buscador))";
            
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
        
    mostrarnsocvenc: (req, res) => {          
        const {} = req.params;  
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select * from table (pack_new_direccion_tecn.F_LIST_NOTI_RS)";
            
            const params = {
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_NSOC: 'No se encontró registro' }]));
            });
        });
    },

    CargarPdf: async (request, response) => {
            const mv = require('mv');
            const formidable = require('formidable');
            const fupload = require('./../../fupload');
            var form = new formidable.IncomingForm();
            form.parse(request, async function (err, fields, files) {
                if (err) {
                    response.json({
                        error: err
                    });
                    return;
                }
                const sFilename = 'Formula.pdf';
                var oldpath = files.pdf.path;
                var rfilename = fields.tipo+'_'+fields.nsoc+'.pdf';
                var rutaserv = 'public/files/direccion_tecnica/'+fields.tipo+'/nso_'+fields.nsoc+'.pdf';
                var newpath = fupload.tmppath + 'unsigned_' + rfilename;
                mv(oldpath, newpath, async function (err) {
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
    
    abrirPDF: async (req, res) => {    
        const {tipodoc,nsoc} = req.body;  
        const fupload = require('./../../fupload');
        // var opn = require('opn'); 
        var newpath = 'C:\\clife-backend\\public\\files\\direccion_tecnica\\'+tipodoc+'\\nso_'+nsoc+'.pdf';
        // let o_nombre ='public/files/direccion_tecnica/'+fields.tipo+'/nso_'+fields.nsoc+'.pdf';
        
        var rfilename = tipodoc+'_'+nsoc+'.pdf';
        var newpath = fupload.tmppath + 'unsigned_' + rfilename;
        fs.stat(newpath, async function(err) {
            if (!err) {    
                
                res.send({ 'state': 'success','message': "https://mail.corporacionlife.com.pe/service/home/~/?auth=co&loc=es&id=2972&part=2" });
                
            }
            else if (err.code === 'ENOENT') {                
                res.send({ 'error_query': 'Error' });
            }
        });

             
    },

    mostrarlistaformula: (req, res) => { 
        const {empresa,buscador,tipo,flag} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select * from table(pack_new_formulacion.f_list_formula(:x_empresa,:x_buscar,:x_tipo,:flag))";
            
            const params = {
                x_empresa: {val : empresa},
                x_buscar: {val : buscador},
                x_tipo: {val : tipo},
                flag: {val : flag},
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ DE_NOMBRE: 'No se encontraron coincidencias' }]));
            });
        });
    },

    mostrardetformcomponente: (req, res) => { 
            
        const {empresa,formula} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select * from table(pack_new_formulacion.f_list_form_det_comp(:x_empresa,:x_formula))";
            
            const params = {
                x_empresa: {val : empresa},
                x_formula: {val : formula},
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_PRODUCTO: 'No se encontraron coincidencias' }]));
            });
        });
    },
 
    mostrardetformtrazab: (req, res) => { 
            
        const {empresa,producto} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select * from table(pack_new_formulacion.f_list_form_det_traz(:x_empresa,:x_producto))";
            
            const params = {
                x_empresa: {val : empresa},
                x_producto: {val : producto},
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ DE_PRODCUCTO: 'No se encontraron coincidencias' }]));
            });
        });
    },
    
    mostrarhistorial: (req, res) => { 
            
        const {empresa,formula} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select * from table (pack_new_formulacion.f_list_form_det_hist(:x_empresa,:x_co_formula))";
            
            const params = {
                x_empresa: {val : empresa},
                x_co_formula: {val : formula},
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ FE_REGISTRA: 'No se encontraron coincidencias' }]));
            });
        });
    },
    

    mostrarformacosm: (req, res) => { 
            
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select * from ma_form_cosm where es_vigencia = 'Vigente' order by de_forma_cosmetica";
            
            const params = {
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_FORMA_COSMETICA: 'No se encontraron coincidencias' }]));
            });
        });
    },
    
    aprobarform: (req, res) => {        
        const {empresa,formula,producto,usuario,alias,vigencia} = req.body; 
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: err.Error
                });
                return;
            }
            const query = "call pack_new_formulacion.sp_grabar_estado_formu(:x_result,:x_de_result,:x_empresa,:x_co_formu,:x_co_prod,:x_co_usuario,:x_alias,:x_vigencia)";
            const params = { 
                //parametros de salida
                x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                x_de_result: {dir: oracledb.BIND_OUT, type: oracledb.STRING },
                //parametros de entrada
                x_empresa: {val:empresa},
                x_co_formu: {val:formula},
                x_co_prod: {val:producto},
                x_co_usuario: {val:usuario},
                x_alias: {val:alias},
                x_vigencia: {val:vigencia},
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

    mostrarespecificacion: (req, res) => { 
            
        const {empresa} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select de_nombre,co_especificacion,nu_version,es_vigencia,fe_creacion,fe_revisa,fe_aprueba,de_creador,de_revisado,de_aprueba,de_proveedor,co_proveedor from table (PACK_NEW_DIRECCION_TECN.f_list_especificacion_v2(:x_empresa))";
            
            const params = {
                x_empresa: {val : empresa}
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_PRODUCTO: 'No se encontraron coincidencias' }]));
            });
        });
    },
    
    mostrarespproducto: (req, res) => { 
         
        const {empresa,buscar,co_clase,co_familia,co_subfamilia,co_marca,co_submarca} = req.params; 
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "SELECT 0,CO_CATALOGO_PRODUCTO,DE_NOMBRE,DE_NOMBRE_MARCA,DE_NOMBRE_SUBMARCA,DE_NOMBRE_CLASE,DE_NOMBRE_FAMILIA,DE_NOMBRE_SUBFAMILIA,DE_NOMBRE_ESP,CO_ESPECIFICACION,NU_VERSION,es_vigencia,fe_creacion,fe_revisa,fe_aprueba,de_creador,de_revisado,de_aprueba,de_proveedor FROM TABLE (PACK_NEW_DIRECCION_TECN.F_LIST_PROD_ESPEC(:x_empresa,:x_buscar,:x_co_clase,:x_co_familia,:x_co_subfamilia,:x_co_marca,:x_co_submarca))";
            
            const params = {
                x_empresa: {val : empresa},
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

    grabarformacosm: (req, res) => {        
        const {co_forma,estado,des_forma,accion} = req.body;  
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: error.Error
                });
                return;
            }
            const query = "call PACK_NEW_DIRECCION_TECN.SP_GUARDAR_FORMA_COSM (:x_result,:x_de_result,:x_co_form,:x_estado,:x_desc_form,:x_accion)";
            const params = { 
                //parametros de salida
                x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                x_de_result: {dir: oracledb.BIND_OUT, type: oracledb.STRING },
                //parametros de entrada
                x_co_form: {val:co_forma},
                x_estado: {val:estado},
                x_desc_form: {val:des_forma},
                x_accion: {val:accion},
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
    
    mostrarprodporesp: (req, res) => {             
        const {empresa,especificacion,version} = req.params; 
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select co_producto,de_nombre,de_marca,de_submarca from table (pack_new_especificacion.f_list_prod_por_espc(:x_empresa,:x_espec,:x_version))";
            
            const params = {
                x_empresa: {val : empresa},
                x_espec: {val : especificacion},
                x_version: {val : version}
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : 1==1);
            });
        });
    },

    
    mostrarcaractgen: (req,res) =>{
        const {empresa,especificacion,version} = req.body;
        oracledb.getConnection(dbParams,(err,conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: error.Error
                });
                return;
            }
            const query = 'select TO_CHAR(DE_CARACTERIS_GENERALES) AS DE_CARACTERIS_GENERALES,TO_CHAR(DE_CONDIC_ALMACENAMIENTO) AS DE_CONDIC_ALMACENAMIENTO from table (pack_new_especificacion.f_list_caract_gener(:x_empresa,:x_espec,:x_version))';
            const params = {                
                x_empresa: { val: empresa },
                x_espec: {val : especificacion},
                x_version: {val : version}
            };
            conn.execute(query,params,responseParams,(error, result)=>{                
                if(error) {           
                    conn.close();
                    return;
                }
                var esp_caract;
                for(var i in result.rows) {
                    esp_caract = result.rows[i];                  
                }
                //comprobar si obtuve resultado
                if(esp_caract) {                   
                    res.json({
                        state: 'success',
                        data: {
                            caract: esp_caract
                        }                      
                    
                    });
                }
                else {
                    res.json({
                        state: 'error',
                        message: 'Sin registro'
                    });
                }
            });
        });
    },
    
    mostrarcaractdet: (req, res) => { 
            
        const {empresa,especificacion,version} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select * from table (pack_new_especificacion.f_list_caract_detalle(:x_empresa,:x_espec,:x_version))";
            
            const params = {
                x_empresa: {val : empresa},
                x_espec: {val : especificacion},
                x_version: {val : version}
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : 1==1);
            });
        });
    },
    
    mostrarensayo: (req, res) => { 
            
        const {empresa,especificacion,version} = req.params;  
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select co_metodo_anal,de_metodo,co_ensayo,de_ensayo,de_especificaciones,limit_min,limit_max,de_tipo_ensayo,des_objetivo_ensayo from table (pack_new_especificacion.f_list_ensayo(:x_empresa,:x_espec,:x_version))";
            
            const params = {
                x_empresa: {val : empresa},
                x_espec: {val : especificacion},
                x_version: {val : version}
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : 1==1);
            });
        });
    },

    mostrarespecreporte: async (request, response) => {        
            const { codigo,nombre,esp,marc,version} = request.params;
            try {
                const conn = await oracledb.getConnection(dbParams);
                let query = "select de_metodo,de_especificaciones from table (pack_new_especificacion.f_list_ensayo(11,:x_espec,:x_vers)) where de_tipo_ensayo not in ('MICROBIOLOGICO')";
                let params = {
                    x_espec: { val: esp },
                    x_vers: { val: version },
                };
                const result = await conn.execute(query, params, responseParams);
                const filas = result.rows;

                let query_n = "select de_metodo,de_especificaciones from table (pack_new_especificacion.f_list_ensayo(11,:x_espec,:x_vers)) where de_tipo_ensayo = 'MICROBIOLOGICO'";                
                const result_n = await conn.execute(query_n, params, responseParams);
                const filas_n = result_n.rows;

                let query_p = "select fe_creacion,de_creador,de_revisado,de_aprueba from table (pack_new_especificacion.f_list_caract_report(11,:x_espec,:x_vers))";                
                
                const result_p = await conn.execute(query_p, params, responseParams);
                const filas_p = result_p.rows;

                const pdfWriter = require('html-pdf');
                const ejs = require('ejs');
                // const d = new Date();
                const data = {
                    codigo : codigo,
                    nombre:nombre,
                    esp:esp,
                    marc:marc,
                    version:version,
                    filas:filas,
                    filas_n:filas_n,
                    filas_p:filas_p,
                };
                const html = await ejs.renderFile(path.resolve('client/views/modulos/plantaindustrial/po0102008-report1.ejs'), data);
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
                response.json({
                    error: err
                });
            }
        // }
        // else response.redirect('/intranet/login');
    },
    
    
    mostraranios: (req,res) =>{
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "select '0' as value, 'TODOS' as label from dual union select to_char(fe_inicio_vigencia,'yyyy') as value,to_char(fe_inicio_vigencia,'yyyy')as label from po_regi_sani_c group by to_char(fe_inicio_vigencia,'yyyy') order by value desc";
            const params = {                
            };
            conn.execute(query,params,responseParams,(error, result)=>{ 
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

    mostrarcontrolanio: (req, res) => { 
        const {} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select co_numero,cantidad from table (pack_new_direccion_tecn.f_list_control_gen())";
            
            const params = { };
            conn.execute(query,params,responseParams,(error, result)=>{                
                
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                if(result.rows.length > 0) {                
                    res.json({
                        state: 'success',
                        data: {
                            anio: result.rows
                        }   
                    });       
                }
                
            });
        });
    },
        
    mostrarcontrolreg: (req, res) => { 
        const {} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select co_anio,co_numero as mes,cantidad from table(pack_new_direccion_tecn.f_list_control_reg())";
            
            const params = { };
            conn.execute(query,params,responseParams,(error, result)=>{   
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                let data2012 = [],  data2013 = [],  data2014 = [], data2015 = [], data2016 = [], data2017 = [], data2018 = [], data2019 = [], datatot = [];
                for (var i in result.rows) {
                  result.rows[i].CO_ANIO == 2012  ?  data2012.push([result.rows[i].MES,result.rows[i].CANTIDAD]) : null ;
                  result.rows[i].CO_ANIO == 2013  ?  data2013.push([result.rows[i].MES,result.rows[i].CANTIDAD]) : null ;
                  result.rows[i].CO_ANIO == 2014  ?  data2014.push([result.rows[i].MES,result.rows[i].CANTIDAD]) : null ;
                  result.rows[i].CO_ANIO == 2015  ?  data2015.push([result.rows[i].MES,result.rows[i].CANTIDAD]) : null ;
                  result.rows[i].CO_ANIO == 2016  ?  data2016.push([result.rows[i].MES,result.rows[i].CANTIDAD]) : null ;
                  result.rows[i].CO_ANIO == 2017  ?  data2017.push([result.rows[i].MES,result.rows[i].CANTIDAD]) : null ;
                  result.rows[i].CO_ANIO == 2018  ?  data2018.push([result.rows[i].MES,result.rows[i].CANTIDAD]) : null ;
                  result.rows[i].CO_ANIO == 2019  ?  data2019.push([result.rows[i].MES,result.rows[i].CANTIDAD]) : null ;
                }
                datatot.push({ 'id': '2012', 'data': data2012 } ,
                {'id': '2013', 'data': data2013 } ,
                {'id': '2014', 'data': data2014 } ,
                {'id': '2015', 'data': data2015 } ,
                {'id': '2016', 'data': data2016 } ,
                {'id': '2017', 'data': data2017 } ,
                {'id': '2018', 'data': data2018 } ,
                {'id': '2019', 'data': data2019 } 
                );
                res.set('Content-Type', 'application/json');
                res.send(datatot);
                
            });
        });
    },

    mostrarcontrolmarc: (req, res) => { 
        const {} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select de_nombre,cantidad from table(pack_new_direccion_tecn.f_list_control_marcas())";
            
            const params = {};
            conn.execute(query,params,responseParams,(error, result)=>{                
                
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                if(result.rows.length > 0) {                
                    res.json({
                        state: 'success',
                        data: {
                            marca: result.rows
                        }   
                    });       
                }
                
            });
        });
    },

    mostrarmarcporanio: (req, res) => { 
        const {} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select co_anio,co_numero,cantidad from table(pack_new_direccion_tecn.f_list_control_marcas_anio())";
            
            const params = { };
            conn.execute(query,params,responseParams,(error, result)=>{   
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                let data2012 = [],  data2013 = [],  data2014 = [], data2015 = [], data2016 = [], data2017 = [], datatot = [];
                for (var i in result.rows) {
                  result.rows[i].CO_NUMERO == 'Hanna Caball'  ?  data2012.push([result.rows[i].CO_ANIO,result.rows[i].CANTIDAD]) : null ;
                  result.rows[i].CO_NUMERO == 'Placenta life'  ?  data2013.push([result.rows[i].CO_ANIO,result.rows[i].CANTIDAD]) : null ;
                  result.rows[i].CO_NUMERO == 'Placenta Life Naturals'  ?  data2014.push([result.rows[i].CO_ANIO,result.rows[i].CANTIDAD]) : null ;
                  result.rows[i].CO_NUMERO == 'Derma Life'  ?  data2015.push([result.rows[i].CO_ANIO,result.rows[i].CANTIDAD]) : null ;
                  result.rows[i].CO_NUMERO == 'Smoll'  ?  data2016.push([result.rows[i].CO_ANIO,result.rows[i].CANTIDAD]) : null ;
                  result.rows[i].CO_NUMERO == 'Tonno Plus'  ?  data2017.push([result.rows[i].CO_ANIO,result.rows[i].CANTIDAD]) : null ;
                }
                datatot.push({ 'id': 'Hanna Caball', 'data': data2012 } ,
                {'id': 'Placenta life', 'data': data2013 } ,
                {'id': 'Placenta Life Naturals', 'data': data2014 } ,
                {'id': 'Derma Life', 'data': data2015 } ,
                {'id': 'Smoll', 'data': data2016 } ,
                {'id': 'Tonno Plus', 'data': data2017 } 
                );
                res.set('Content-Type', 'application/json');
                res.send(datatot);
                
            });
        });
    },

    mostrarcontrolvenc: (req, res) => { 
        const {} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select co_anio,cantidad from table(pack_new_direccion_tecn.f_list_control_vencimiento())";
            
            const params = {};
            conn.execute(query,params,responseParams,(error, result)=>{                
                
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                if(result.rows.length > 0) {                
                    res.json({
                        state: 'success',
                        data: {
                            venc: result.rows
                        }   
                    });       
                }
                
            });
        });
    },

    mostrarvencporreg: (req, res) => { 
        const {periodo} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select fe_inicio_vigencia,fe_termino_vigencia,co_nsoc,co_espec_anal,de_nombre_registrado_nso from table(pack_new_direccion_tecn.f_list_reg_venc_por_anio(:x_anio))";
            
            const params = {
                x_anio: {val : periodo},
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ FE_INICIO_VIGENCIA: 'No se encontraron resultados' }]));
            });
        });
    },

    mostrarmarcdrive: (req, res) => { 
        const {id} = req.query;
        const {empresa} = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({'error_conexion': err.stack});
                return;
            }
            const responseParams = {
                outFormat: oracledb.OBJECT
            };
            const query2 = "SELECT co_menu_sistema as \"id\",de_nombre as \"text\",co_menu_replica \"replica\", case st_tipo when 'm' then 1 else 0 end as \"child\" from po_regi_sani_docu_menu where co_empresa = :empresa and co_antecesor = :codigo  order by de_nombre asc";
            const params2 = { empresa: {val: empresa},codigo: {val: id}};
            conn.execute(query2, params2, responseParams, (error, result) => {
                if (error) {
                    res.send({'error_query': error.stack});
                    conn.close();
                    return;
                }
                var arr = [];
                for (var i in result.rows) {
                    arr.push({
                        '@': result.rows[i]
                    });
                }
                res.set('Content-Type', 'text/xml');
                res.send(o2x({
                    '?xml version="1.0" encoding="utf-8"?': null,
                    tree: {
                        '@': {id: id == 'MAIN' ? 0 : id},
                        item: arr
                    }
                }));
            });
        });
    },

    mostrarproductopornsoc: (req, res) => {        
        const {co_nsoc} = req.body; 
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: error.Error
                });
                return;
            }
            const query = "select co_catalogo_producto from table(pack_new_direccion_tecn.F_GET_CATALOGO_PRODUCTO(:x_co_nsoc))";
            const params = { 
                x_co_nsoc:{val:co_nsoc},
            };
            conn.execute(query,params,responseParams,(error, result)=>{                
                if(error) {           
                    conn.close();
                    return;
                }
                var producto;
                for(var i in result.rows) {
                    producto = result.rows[i];                  
                }
                //comprobar si obtuve resultado
                if(producto) {                   
                    res.json({
                        state: 'success',
                        data: {
                            prod: producto
                        }                      
                    
                    });
                }
                else {
                    res.json({
                        state: 'error',
                        message: 'Sin registro'
                    });
                }
            });
        });
    },

    subirdocadjunto: (req, res) => {        
        const {empresa,entidad,tipo_doc,producto,doc,usuario} = req.body; 
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: error.Error
                });
                return;
            }
            const query = "select pack_new_attached.f_get_url_updload(:x_empresa,:x_entidad,:x_producto,:x_tipo_doc,:x_producto,:x_doc,:x_entidad,:x_usuario) as URL from dual";
            const params = { 
                x_empresa:{val:empresa},
                x_entidad:{val:entidad},
                x_tipo_doc:{val:tipo_doc},
                x_producto:{val:producto},
                x_doc:{val:doc},
                x_usuario:{val:usuario},
            };
            conn.execute(query,params,responseParams,(error, result)=>{                
                if(error) {           
                    conn.close();
                    return;
                }
                var url;
                for(var i in result.rows) {
                    url = result.rows[i];                  
                }
                //comprobar si obtuve resultado
                if(url) {                   
                    res.json({
                        state: 'success',
                        data: {
                            url_adj: url
                        }                      
                    
                    });
                }
                else {
                    res.json({
                        state: 'error',
                        message: 'Sin registro'
                    });
                }
            });
        });
    },

    mostrardocpormarca: (req, res) => { 
            
        const {} = req.params;  
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select nu_tipo_doc,co_nsoc,de_nombre_nsoc,de_nombre_fichero,de_marca,de_usuario,fe_registro,co_catalogo_producto from table(pack_new_direccion_tecn.F_LIST_DOCU_POR_MARCA())";
            
            const params = {
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : 1==1);
            });
        });
    },

    mostraradjporprod: (req, res) => {        
        const {empresa,usuario,producto,archivo,tipo_doc} = req.body; 
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: error.Error
                });
                return;
            }
            const query = "select pack_new_attached.f_get_url_file_prod(:x_empresa,:x_usuario,:x_prod,:x_tipo_doc,:x_arch,'') URl from dual";
            const params = { 
                x_empresa: {val:empresa},
                x_usuario: {val:usuario},
                x_prod: {val:producto},
                x_arch: {val:archivo},
                x_tipo_doc: {val:tipo_doc},
            };
            conn.execute(query,params,responseParams,(error, result)=>{                
                if(error) {           
                    conn.close();
                    return;
                }
                var url;
                for(var i in result.rows) {
                    url = result.rows[i];                  
                }
                //comprobar si obtuve resultado
                if(url) {                   
                    res.json({
                        state: 'success',
                        data: {
                            url_adj: url
                        }                      
                    
                    });
                }
                else {
                    res.json({
                        state: 'error',
                        message: 'Sin registro'
                    });
                }
            });
        });
    },

}

module.exports = po010208Controller;

