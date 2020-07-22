const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');
var fs = require('fs');
const path = require('path');
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
        const {empresa,usuario,alias,num_registro_nsoc,vigencia_ini,vigencia_ter,nombre,form_cosm,espec,tvu_com,tvu_prod} = req.body;  
        console.log(empresa,usuario,alias,num_registro_nsoc,vigencia_ini,vigencia_ter,nombre,form_cosm,espec,tvu_com,tvu_prod);
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: error.Error
                });
                return;
            }
            const query = "call PACK_NEW_DIRECCION_TECN.SP_NOTIFICACION_SANITARIA (:x_result,:x_de_result,:x_empresa,:x_usuario,:x_alias,:x_num_registro_nsoc,:x_vigencia_ini,:x_vigencia_ter,:x_nombre,:x_form_cosm,:x_co_espec,:tvu_com,:tvu_prod)";
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
                tvu_prod: {val:tvu_prod}
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
        console.log(co_nso);
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
                    console.log('form.parse', err);
                    response.json({
                        error: err
                    });
                    return;
                }
                const sFilename = 'Formula.pdf';
                var oldpath = files.pdf.path;
                console.log(fields.nsoc);
                var rfilename = fields.tipo+'_'+fields.nsoc+'.pdf';
                var rutaserv = 'public/files/direccion_tecnica/'+fields.tipo+'/nso_'+fields.nsoc+'.pdf';
                var newpath = fupload.tmppath + 'unsigned_' + rfilename;
                mv(oldpath, newpath, async function (err) {
                    console.log('entro11');
                    if (err) {
                        console.log('mv', err);
                        response.json({
                            error: err
                        });
                    }
                    // console.log(newpath);
                    // const newpathsigned = fupload.tmppath + 'unsigned_' + rfilename;
                    // const ftpmanager = require('./../../libs/ftp-manager');
                    // let result = await ftpmanager.SubirRegistro(newpathsigned, rutaserv);
                    // if (result.error) {
                    //     response.json({ 
                    //         error: result.error
                    //     });
                    //     return;
                    // } // fin ftp-manager
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
                console.log('entra fs'); 
                
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
    
    mostrarespecificacion: (req, res) => { 
            
        const {empresa,grupo,clase,tipo} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select * from table (pack_new_especificacion.f_list_especificacion(:x_empresa,:x_grupo,:x_clase,:x_tipo))";
            
            const params = {
                x_empresa: {val : empresa},
                x_grupo: {val : grupo},
                x_clase: {val : clase},
                x_tipo: {val : tipo},
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
                    message: error.Error
                });
                return;
            }
            const query = "call pack_new_formulacion.sp_grabar_estado_formu (:x_result,:x_de_result,:x_empresa,:x_co_formu,:x_co_prod,:x_co_usuario,:x_alias,:x_vigencia)";
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
        console.log(empresa,buscar,co_clase,co_familia,co_subfamilia,co_marca,co_submarca);
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
        console.log(co_forma,estado,des_forma,accion);
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
        // if (request.cookies[confParams.cookieIntranet]) {
            const { codigo,nombre,esp,marc} = request.params;
            // const sesion = JSON.parse(request.cookies[confParams.cookieIntranet]);
            try {
                const conn = await oracledb.getConnection(dbParams);
                let query = "select de_metodo,de_ensayo,de_tipo_ensayo from table (pack_new_especificacion.f_list_ensayo(11,:x_espec,1))";
                let params = {
                    x_espec: { val: esp },
                };
                const result = await conn.execute(query, params, responseParams);
                const filas = result.rows;
                // let query = "select de_nombre,nu_ruc from ma_empr_m where co_empresa = :x_empresa";
                // let params = {
                //     x_empresa: { val: empresa }
                // };
                // const result_2 = await conn.execute(query, params, responseParams);
                // var empresa_dat;
                // var nombre,ruc;               
                // for(var i in result_2.rows) {
                //     empresa_dat = result_2.rows[i];                  
                // }
                // nombre = empresa_dat.DE_NOMBRE;
                // ruc = empresa_dat.NU_RUC;
                // pinta pdf
                const pdfWriter = require('html-pdf');
                const ejs = require('ejs');
                // const d = new Date();
                const data = {
                    codigo : codigo,
                    nombre:nombre,
                    esp:esp,
                    marc:marc,
                    filas:filas
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
                console.error(err);
                response.json({
                    error: err
                });
            }
        // }
        // else response.redirect('/intranet/login');
    },
    
    
    mostraranios: (req,res) =>{
        const {} = req.body;
        oracledb.getConnection(dbParams,(err,conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: error.Error
                });
                return;
            }
            const query = "SELECT to_char(fe_inicio_vigencia,'YYYY') anio ,to_char(fe_inicio_vigencia,'MM') mes,count(1) FROM PO_REGI_SANI_C where to_char(fe_inicio_vigencia,'YYYY')between 2015 and 2020 group by to_char(fe_inicio_vigencia,'YYYY'),to_char(fe_inicio_vigencia,'MM') order by to_char(fe_inicio_vigencia,'YYYY'),to_char(fe_inicio_vigencia,'MM')";
            const params = {                
            };
            conn.execute(query,params,responseParams,(error, result)=>{                
                if(error) {     
                    console.log(error);      
                    conn.close();
                    return;
                }
                var rep_anio;
                for(var i in result.rows) {
                    rep_anio = result.rows[i];                  
                }
                //comprobar si obtuve resultado
                if(rep_anio) {                   
                    res.json({
                        state: 'success',
                        data: {
                            rep: rep_anio
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

