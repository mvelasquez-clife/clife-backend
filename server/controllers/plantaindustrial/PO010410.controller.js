const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');
var fs = require('fs');
const path = require('path');
const responseParams = {
    outFormat: oracledb.OBJECT,
    autoCommit: true
};

const po010410Controller = {
            
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
    
    mostrarversion: (req, res) => { 
            
        const {empresa,especificacion,flag} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select * from table (pack_new_especificacion.f_list_version(:x_empresa,:x_especificacion,:x_flag))";
            
            const params = {
                x_empresa: {val : empresa},
                x_especificacion: {val : especificacion},
                x_flag: {val : flag}
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_ESPEC_ANAL: 'No se encontraron coincidencias' }]));
            });
        });
    },

    mostrarproductos: (req, res) => { 
            
        const {empresa,especificacion,version} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select co_producto,de_nombre from table (pack_new_especificacion.f_list_producto(:x_empresa,:x_espec,:x_version))";
            
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
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_CATALOGO_PRODUCTO: 'No se encontraron coincidencias' }]));
            });
        });
    },

    mostrarcaractgen: (req,res) =>{
        const {empresa,especificacion,version} = req.body;
        oracledb.getConnection(dbParams,(err,conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: err.Error
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
            const query = "select 0,co_caract,de_nombre_caract,de_detalle_caract from table (pack_new_especificacion.f_list_caract_detalle(:x_empresa,:x_espec,:x_version))";
            
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
            const query = "select 0,co_metodo,co_metodo_anal,de_metodo,co_ensayo,de_especificaciones,limit_min,limit_max,de_especificaciones_ingles,de_ensayo,de_abreviatura,de_tipo_ensayo,des_objetivo_ensayo,de_tecn_anal from table (pack_new_especificacion.f_list_ensayo(:x_empresa,:x_espec,:x_version))";
            
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
    
    mostrarcomplemento: (req, res) => { 
            
        const {empresa,especificacion,version} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select 0,co_producto,de_nombre from table (pack_new_especificacion.f_list_complemento(:x_empresa,:x_espec,:x_version))";
            
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
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : 1 == 1);
            });
        });
    },
    
    mostrarhistorial: (req, res) => { 
            
        const {empresa,especificacion,version} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select co_numdoc,nu_version_doc,fe_registro,de_observacion,nom_usuario,co_tipodoc from table (pack_new_especificacion.f_list_historial(:x_empresa,:x_espec,:x_version))";
            
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
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_NUMDOC: 'No se encontraron coincidencias' }]));
            });
        });
    },
    
    mostrararchivos: (req, res) => { 
            
        const {empresa,especificacion,version} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select * from table (pack_new_especificacion.f_list_documento(:x_empresa,:x_espec,:x_version))";
            
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
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ DE_NOM_ARCHIVO: 'No se encontraron coincidencias' }]));
            });
        });
    },

    mostrarprodporgrupo: (req, res) => { 
            
        const {nva_clase,buscar} = req.params;  
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select 0,co_producto,de_nombre,de_marca,de_submarca from table (pack_new_especificacion.f_list_prod_por_grupo_prod(:x_clas_prod,:x_buscar))";
            // const query = "select 0,co_producto,de_nombre,de_marca,de_submarca from table (pack_new_especificacion.f_list_prod_por_grupo_prod(:x_grupo_prod,:x_tipo_prod,:x_clas_prod,:x_buscar))";
            
            const params = {
                // x_grupo_prod: {val : grupo},
                // x_tipo_prod: {val : tipo},
                x_clas_prod: {val : nva_clase},
                x_buscar: {val : buscar}                
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

    guardarcabecera: (req, res) => {        
        const {empresa,alias,usuario,especificacion,version,proveedor,grupo,descripcion,serie,accion,tipo_material,arte,princ_activo,inci,cas,prod,origen,fabricante} = req.body; 
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: error.Error
                });
                return;
            }
            const query = "call pack_new_especificacion.sp_grabar_especificacion(:x_result,:x_de_result,:x_empresa,:x_alias,:x_usuario,:x_co_especificacion,:x_version,:x_proveedor,:x_grupo_prod,:x_descripcion,:x_serie,:x_accion,:x_tipo_material,:x_arte,:x_princ_activo,:x_inci,:x_cas,:x_prod,:x_origen,:x_fabricante)";
            const params = { 
                //parametros de salida
                x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                x_de_result: {dir: oracledb.BIND_OUT, type: oracledb.STRING },
                //parametros de entrada
                x_empresa: {val:empresa},
                x_alias: {val:alias},
                x_usuario: {val:usuario},
                x_co_especificacion: {val:especificacion},
                x_version: {val:version},
                x_proveedor: {val:proveedor},
                x_grupo_prod: {val:grupo},
                x_descripcion: {val:descripcion},
                x_serie: {val:serie},
                x_accion: {val:accion},
                x_tipo_material: {val:tipo_material},
                x_arte: {val:arte},
                x_princ_activo: {val:princ_activo},
                x_inci: {val:inci},
                x_cas: {val:cas},
                x_prod: {val:prod},
                x_origen : {val:origen},
                x_fabricante : {val:fabricante}
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
        

    guardarproductos: (req, res) => {        
        const {empresa,usuario,especificacion,version,cadena,cantfilas} = req.body; 
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: err.Error
                });
                return;
            }
            const query = "call pack_new_especificacion.sp_grabar_producto(:x_result,:x_de_result,:x_empresa,:x_usuario,:x_co_especificacion,:x_version,:x_cadena_prod,:x_cant_filas)";
            const params = { 
                //parametros de salida
                x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                x_de_result: {dir: oracledb.BIND_OUT, type: oracledb.STRING },
                //parametros de entrada
                x_empresa: {val:empresa},
                x_usuario: {val:usuario},
                x_co_especificacion: {val:especificacion},
                x_version: {val:version},
                x_cadena_prod: {val:cadena},
                x_cant_filas: {val:cantfilas},
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
            const query = "select 0,co_producto,de_nombre,de_marca,de_submarca from table (pack_new_especificacion.f_list_prod_por_espc(:x_empresa,:x_espec,:x_version))";
            
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

    mostrarproveedor: (req, res) => { 
            
        const {empresa,buscar} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select * from table (pack_new_especificacion.f_list_proveedor(:x_empresa,:x_buscar))";
            
            const params = {
                x_empresa: {val : empresa},
                x_buscar: {val : buscar},
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_CATALOGO_ENTIDAD: 'No se encontraron coincidencias' }]));
            });
        });
    },
    
    mostrarnsoc: (req, res) => { 
            
        const {} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select co_nsoc,to_char(de_nombre_registrado) from table (pack_new_especificacion.f_list_nsoc())";
            
            const params = {
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_NSOC: 'No se encontraron coincidencias' }]));
            });
        });
    },
    
    mostrarcaractsel: (req, res) => { 
            
        const {} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select 0, co_caract,de_nombre_caract,de_tipo_caract from table (pack_new_especificacion.f_list_caract_producto)";
            
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

    
    mostrarensayoporgrupo: (req, res) => { 
            
        const {grupo} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select 0,co_metodo_anal,de_metodo,co_ensayo,de_ensayo,co_tipo_ensayo,de_tipo_ensayo,des_objetivo_ensayo,nu_version,co_metodo_default,de_abreviatura,st_obligatorio,st_declarado,st_especificacion,st_guiamanufactura,st_estado,de_tecn_anal from table(pack_new_especificacion.f_list_ensayo_general(:x_grupo_prod))";
            
            const params = {
                x_grupo_prod: {val : grupo}              
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ co_metodo_anal: 'No se encontraron coincidencias' }]));
            });
        });
    },

    mostrarcomplporgrupo: (req, res) => { 
            
        const {grupo,buscar} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select 0,co_producto,de_nombre,de_abreviatura from table(pack_new_especificacion.f_list_complemento_general(:x_grupo_prod,:x_buscar))";
            
            const params = {
                x_grupo_prod: {val : grupo}, 
                x_buscar: {val : buscar}           
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ co_producto: 'No se encontraron coincidencias' }]));
            });
        });
    },

    mostrarlog: (req, res) => { 
            
        const {empresa,guia,version} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select * from table (pack_new_especificacion.f_list_hist_log(:x_empresa,:x_guia,:x_version))";
            
            const params = {
                x_empresa: {val : empresa},
                x_guia: {val : guia},
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
    
    prodespecporgrupo: (req, res) => { 
            
        const {empresa,grupo,filter} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select co_producto,de_nombre,de_especificacion,de_nombre_tipo,de_principio_activo,de_nombre_inci,co_codigo_antiguo,de_vigencia from table(pack_new_especificacion.f_list_producto_por_grupo(:x_empresa,:x_grupo,:x_filter))";
            
            const params = {
                x_empresa: {val : empresa},
                x_grupo: {val : grupo},
                x_filter: {val : filter}
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

    especporProducto: (req, res) => { 
            
        const {empresa,producto,grupo,flag} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select co_especificacion,de_nombre,nu_version,es_vigencia,de_proveedor,co_arte,fe_creacion,de_creador,fe_revisa,de_revisado,fe_aprueba,de_aprueba,co_proveedor,de_principio_activo,de_nombre_inci,de_codigo_cas,de_fabricante,de_origen from table(pack_new_especificacion.f_list_espec_por_producto(:x_empresa,:x_co_producto,:x_grupo,:x_flag))";
            
            const params = {
                x_empresa: {val : empresa},
                x_co_producto: {val : producto},
                x_grupo: {val : grupo},
                x_flag: {val : flag}
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

    guardarcaract: (req, res) => {        
        const {empresa,usuario,alias,especificacion,version,cadena_cod_car,cadena_de_car,cantfilas,caract_gen,cond_alm} = req.body; 
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: err.Error
                });
                return;
            }
            
            const query = "call pack_new_especificacion.sp_grabar_caracteristica(:x_result,:x_de_result,:x_empresa,:x_alias,:x_usuario,:x_co_especificacion,:x_version,:x_cadena_cod_car,:x_cadena_de_car,:x_cant_filas,:x_caract_general,:x_cod_alm)";
            const params = { 
                //parametros de salida
                x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                x_de_result: {dir: oracledb.BIND_OUT, type: oracledb.STRING },
                //parametros de entrada
                x_empresa: {val:empresa},
                x_alias: {val:alias},
                x_usuario: {val:usuario},
                x_co_especificacion: {val:especificacion},
                x_version: {val:version},
                x_cadena_cod_car: {val:cadena_cod_car},
                x_cadena_de_car: {val:cadena_de_car},
                x_cant_filas: {val:cantfilas},
                x_caract_general: {val:caract_gen},
                x_cod_alm: {val:cond_alm},
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
 
    habilitargrupos: (req, res) => {        
        const {empresa,usuario,accion} = req.body; 
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: err.Error
                });
                return;
            }
            const query = "select nvl(rtrim (xmlagg (xmlelement (e, de_descripcion || '@')).extract ('//text()'), ',') ,'NO') as de_descripcion from table (pack_new_especificacion.F_ACCESO_POR_USUARIO(:x_usuario,:x_empresa,:x_accion))";
            const params = { 
                //parametros de entrada
                x_empresa: {val:empresa},
                x_usuario: {val:usuario},
                x_accion: {val:accion},
            };
            conn.execute(query,params,responseParams,(error, result)=>{                
                if(error) {           
                    conn.close();
                    return;
                }
                var resultado;
                for(var i in result.rows) {
                    resultado = result.rows[i];                  
                }
                //comprobar si obtuve resultado
                if(resultado) {                   
                    res.json({
                        state: 'success',
                        data: {
                            resul: resultado
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
    
    guardarensayo: (req, res) => {        
        const {empresa,usuario,especificacion,version,ensayo,metodo,cadespec,limmin,limmax,cadespecingl,cantfilas} = req.body; 
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: err.Error
                });
                return;
            }
            const query = "call pack_new_especificacion.sp_grabar_ensayo_v2(:x_result,:x_de_result,:x_empresa,:x_usuario,:x_co_especificacion,:x_version,:x_co_cadena_ensayo,:x_co_cadena_metodo,:x_cadena_espec,:x_cadena_lim_min,:x_cadena_lim_max,:x_cadena_espec_ingl,:x_cant_filas)";
            const params = { 
                //parametros de salida
                x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                x_de_result: {dir: oracledb.BIND_OUT, type: oracledb.STRING },
                //parametros de entrada
                x_empresa: {val:empresa},
                x_usuario: {val:usuario},
                x_co_especificacion: {val:especificacion},
                x_version: {val:version},
                x_co_cadena_ensayo: {val:ensayo},
                x_co_cadena_metodo: {val:metodo},
                x_cadena_espec: {val:cadespec},
                x_cadena_lim_min: {val:limmin},
                x_cadena_lim_max: {val:limmax},
                x_cadena_espec_ingl: {val:cadespecingl},
                x_cant_filas: {val:cantfilas},
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

    guardarcompto: (req, res) => {        
        const {empresa,especificacion,alias,version,cadena,cantfilas} = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: err.Error
                });
                return;
            }
            const query = "call pack_new_especificacion.sp_grabar_complemento(:x_result,:x_de_result,:x_empresa,:x_alias,:x_co_especificacion,:x_version,:x_cadena_cod_prod,:x_cant_filas)";
            const params = { 
                //parametros de salida
                x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                x_de_result: {dir: oracledb.BIND_OUT, type: oracledb.STRING },
                //parametros de entrada
                x_empresa: {val:empresa},
                x_co_especificacion: {val:especificacion},
                x_alias: {val:alias},
                x_version: {val:version},
                x_cadena_cod_prod: {val:cadena},  
                x_cant_filas: {val:cantfilas},
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
 
    vincularEPT: (req, res) => {        
        const {codigo_pt,codigo} = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: err.Error
                });
                return;
            }
            const query = "update po_espec_anal_cab set co_espec_anal_pt = :x_codigo_pt where co_espec_anal = :x_codigo";
            const params = { 
                x_codigo_pt: {val:codigo_pt},
                x_codigo: {val:codigo},
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                else res.json({
                    state: 'success'
                });
    
            });
        });
    },   

    guardarhistorial: (req, res) => {        
        const {empresa,usuario,especificacion,version,observacion} = req.body; 
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: err.Error
                });
                return;
            }
            const query = "call pack_new_especificacion.sp_grabar_historial(:x_result,:x_de_result,:x_empresa,:x_usuario,:x_co_especificacion,:x_version,:x_obser)";
            const params = { 
                //parametros de salida
                x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                x_de_result: {dir: oracledb.BIND_OUT, type: oracledb.STRING },
                //parametros de entrada
                x_empresa: {val:empresa},
                x_usuario: {val:usuario},
                x_co_especificacion: {val:especificacion},
                x_version: {val:version},
                x_obser: {val:observacion},
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

    copiarespecificacion: (req, res) => {        
        const {accion,empresa,espec_orig,grupo_prod,version_orig,co_espec_nue,proveedor,desc,usuregistra,alias,tipo_version,catalogo_prod,observacion} = req.body; 
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: err.Error
                });
                return;
            }
            const query = "call pack_new_especificacion.sp_copia_espec_tecnica (:x_result,:x_de_result,:p_accion,:p_empresa,:p_espec_orig,:p_grupo_prod,:p_version_orig,:p_co_espec_nue,:p_proveedor,:p_desc,:p_usuregistra,:p_alias,:p_tipo_version,:p_catalogo_prod,:p_observacion)";
            const params = { 
                //parametros de salida
                x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                x_de_result: {dir: oracledb.BIND_OUT, type: oracledb.STRING },
                //parametros de entrada
                p_accion: {val:accion},
                p_empresa: {val:empresa},
                p_espec_orig: {val:espec_orig},
                p_grupo_prod: {val:grupo_prod},
                p_version_orig: {val:version_orig},
                p_co_espec_nue: {val:co_espec_nue},
                p_proveedor: {val:proveedor},
                p_desc: {val:desc},
                p_usuregistra: {val:usuregistra},
                p_alias: {val:alias},
                p_tipo_version: {val:tipo_version},
                p_catalogo_prod: {val:catalogo_prod},
                p_observacion: {val:observacion},
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
    
    mostrarespecopia: (req, res) => { 
        const {empresa,grupo,flag} = req.body; 
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "select  co_especificacion\"value\",de_nombre \"text\" from table (pack_new_especificacion.f_list_especificacion_v2(:x_empresa,:x_grupo,:x_flag))";
            
            const params = {
                x_empresa: {val : empresa},
                x_grupo: {val : grupo},
                x_flag: {val : flag},
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
                            copia: result.rows
                        }   
                    });       
                }
            });
        });
    }, 

    mostrarespecpt: (req, res) => { 
        const {espec,grupo} = req.body; 
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "select co_especificacion from table(pack_new_especificacion.f_devuelve_co_espec_pt(:x_co_espec,:x_co_grupo))";
            
            const params = {
                x_co_espec: {val : espec},
                x_co_grupo: {val : grupo}
            };
            
            conn.execute(query,params,responseParams,(error, result)=>{                
                if(error) {           
                    conn.close();
                    return;
                }
                var espec;
                for(var i in result.rows) {
                    espec = result.rows[i];                  
                }
                //comprobar si obtuve resultado
                if(espec) {                   
                    res.json({
                        state: 'success',
                        data: {
                            espec_pt: espec
                        }                      
                    
                    });
                }
                else {
                    res.json({
                        state: 'unsuccess',
                        data: {
                            espec_pt: espec
                        } 
                    });
                }
            });
        });
    }, 

    mostrarproducporespec: (req, res) => { 
        const {espec,version} = req.body; 
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "select f_devuelve_producto_por_espec(:x_co_espec,:x_co_version) as co_catalogo_producto from dual";
            
            const params = {
                x_co_espec: {val : espec},
                x_co_version: {val : version}
            };
            
            conn.execute(query,params,responseParams,(error, result)=>{                
                if(error) {           
                    conn.close();
                    return;
                }
                var espec;
                for(var i in result.rows) {
                    espec = result.rows[i];                  
                }
                //comprobar si obtuve resultado
                if(espec) {                   
                    res.json({
                        state: 'success',
                        data: {
                            espec_pt: espec
                        }                      
                    
                    });
                }
                else {
                    res.json({
                        state: 'unsuccess',
                        data: {
                            espec_pt: espec
                        } 
                    });
                }
            });
        });
    }, 

    mostrarespecreporte: async (request, response) => {       
        const {esp,vers,codigo,marc,sub,nom,grupo,nom_prod} = request.params;
        try {
            const conn = await oracledb.getConnection(dbParams);
            //let query = "select de_metodo,de_ensayo,de_tipo_ensayo,de_especificaciones,limit_min,limit_max from table (pack_new_especificacion.f_list_ensayo(11,:x_espec,:x_version))";
            let query = "select de_metodo,de_ensayo,de_especificaciones,de_abreviatura from table (pack_new_especificacion.f_list_ensayo_report(11,:x_espec,:x_version))";
            let params = {
                x_espec: { val: esp },
                x_version: { val: vers },
            };
            const result = await conn.execute(query, params, responseParams);
            const filas = result.rows;
            let query2 = 'select to_char(de_nombre) de_nombre,fe_creacion,fe_revisa,fe_aprueba,de_creador,de_revisado,de_aprueba,de_proveedor,to_char(de_caracteris_generales) DE_CARACTERIS_GENERALES,to_char(de_condic_almacenamiento) de_condic_almacenamiento,co_nsoc from table (pack_new_especificacion.f_list_caract_report(:x_empresa,:x_espec,:x_version))';
            let params2 = {
                x_empresa: { val: 11 },
                x_espec: { val: esp },
                x_version: { val: vers },
            };
            const result2 = await conn.execute(query2, params2, responseParams);
            const filas2 = result2.rows;
        
            filas2.forEach(fila => {
                let value = fila.DE_CARACTERIS_GENERALES;
                if (value && value.length > 0) {
                    fila.DE_CARACTERIS_GENERALES = value.replace(/\r\n/g, '<br />');
                }
            });
            const pdfWriter = require('html-pdf');
            const ejs = require('ejs');
            const data = {
                codigo : codigo,
                esp:esp,
                vers:vers,
                marc:marc,
                sub:sub,
                filas:filas,                
                filas2: filas2,
                nom:nom,
                grupo:grupo,
                nom_prod:nom_prod
            };
            const html = await ejs.renderFile(path.resolve('client/views/modulos/plantaindustrial/PO010410-report1.ejs'), data);
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
                        default: '<span style="color:#444;text-align:right;font-size:8px;">Página <b>{{page}}</b> de <b>{{pages}}</b></span>'
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
},

mostrarespecreporten2: async (request, response) => {       
    const {empresa,usuario,esp,vers,codigo,marc,sub,nom,grupo} = request.params;
    try {
        const conn = await oracledb.getConnection(dbParams);
        let query = "select de_metodo,de_ensayo,de_especificaciones,de_abreviatura from table (pack_new_especificacion.f_list_ensayo_report(11,:x_espec,:x_version))";
        let params = {
            x_espec: { val: esp },
            x_version: { val: vers },
        };
        const result = await conn.execute(query, params, responseParams);
        const filas = result.rows;
        query = 'select to_char(de_nombre) de_nombre,fe_creacion,fe_revisa,fe_aprueba,de_creador,de_revisado,de_aprueba,de_proveedor,to_char(de_caracteris_generales) DE_CARACTERIS_GENERALES,to_char(de_condic_almacenamiento) de_condic_almacenamiento,co_nsoc from table (pack_new_especificacion.f_list_caract_report_v2(:x_empresa,:x_usuario,:x_grupo,:x_espec,:x_version))';
        let params2 = {
            x_empresa: { val: empresa },
            x_usuario: { val: usuario },
            x_grupo: { val: grupo },
            x_espec: { val: esp },
            x_version: { val: vers },
        };
        const result2 = await conn.execute(query, params2, responseParams);
        const filas2 = result2.rows;
        filas2.forEach(fila => {
            let value = fila.DE_CARACTERIS_GENERALES;
            if (value && value.length > 0) {
                fila.DE_CARACTERIS_GENERALES = value.replace(/\r\n/g, '<br />');
            }
        });
        query = "select de_detalle_caract from table (pack_new_especificacion.f_list_caract_detalle_report(:x_empresa,:x_espec,:x_version))";
        let params3 = {
            x_empresa: { val: empresa },
            x_espec: { val: esp },
            x_version: { val: vers },
        };
        const result3 = await conn.execute(query, params3, responseParams);
        const filas3 = result3.rows;
        query = "select de_nombre,de_proveedor,de_nombre_inci,de_codigo_cas,de_fabricante,de_origen,co_arte,de_principio_activo,de_nombre_prod_prov from table (pack_new_especificacion.f_list_producto(:x_empresa,:x_espec,:x_version))";
        const result4 = await conn.execute(query, params3, responseParams);
        const filas4 = result4.rows;        
        const pdfWriter = require('html-pdf');
        const ejs = require('ejs');
        // const d = new Date();
        const data = {
            codigo : codigo,
            esp:esp,
            vers:vers,
            marc:marc,
            sub:sub,
            grupo:grupo,
            filas:filas,                
            filas2:filas2,
            filas3:filas3,
            filas4:filas4,
            nom:nom,
        };
        const html = await ejs.renderFile(path.resolve('client/views/modulos/plantaindustrial/PO010410-report2.ejs'), data);
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
                    default:'<span style="color:#444;text-align:right;font-size:8px;">Página <b>{{page}}</b> de <b>{{pages}}</b></span>'
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
},

    mostrarsubiradj: (req, res) => {        
        const {prod,usuario,cad_esp} = req.body; 
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: err.Error
                });
                return;
            }
            const query = "select pack_new_attached.f_get_url_updload_new_v2(11,19,20123487541,'601',:x_prod,'ESPECPROD',19,:x_usuario,:x_cad_esp) as URL from dual";
            //const query = "select pack_new_attached.f_get_url_updload_new(11,19,20123487541,'601','80701680700344','ESPECPROD',19,:x_usuario,'ETMP-602_1') as URL from dual";
            const params = { 
                x_prod:{val:prod},
                x_usuario:{val:usuario},
                x_cad_esp:{val:cad_esp},
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

    mostraradjporprod: (req, res) => {        
        const {usuario,producto,archivo,indicador} = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: err.Error
                });
                return;
            }
            const query = "select pack_new_attached.f_get_url_file_prod(11,:x_usuario,:x_prod,601,:x_arch,:x_indicador) URl from dual";
            const params = { 
                x_usuario: {val:usuario},
                x_prod: {val:producto},
                x_arch: {val:archivo},
                x_indicador: {val:indicador},
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

    mostrarnuevaEspec: (req, res) => {        
        const {grupo} = req.body; 
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: err.Error
                });
                return;
            }
            const query = "select co_especificacion from table(pack_new_especificacion.f_devuelve_nvo_co_espec(:x_co_grupo))";
            const params = { 
                x_co_grupo: {val:grupo},
            };
            conn.execute(query,params,responseParams,(error, result)=>{                
                if(error) {           
                    conn.close();
                    return;
                }
                var co_espec;
                for(var i in result.rows) {
                    co_espec = result.rows[i];                  
                }
                //comprobar si obtuve resultado
                if(co_espec) {                   
                    res.json({
                        state: 'success',
                        data: {
                            co_espec_nvo: co_espec
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

    eliminarArchivo: (req, res) => {        
        const {empresa,usuario,alias,espec,version,producto,nombre} = req.body; 
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: err.Error
                });
                return;
            }
            const query = "call pack_new_especificacion.sp_eliminar_documento(:x_result,:x_de_result,:x_empresa,:x_co_usuario,:x_alias,:x_co_espec,:x_version,:x_co_producto,:x_de_archivo)";
            const params = { 
                //parametros de salida
                x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                x_de_result: {dir: oracledb.BIND_OUT, type: oracledb.STRING },
                //parametros de entrada
                x_empresa: {val:empresa},
                x_co_usuario: {val:usuario},
                x_alias: {val:alias},
                x_co_espec: {val:espec},
                x_version: {val:version},
                x_co_producto: {val:producto},
                x_de_archivo: {val:nombre},
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

    eliminarEspecificacion: (req, res) => {        
        const {empresa,usuario,alias,espec,version} = req.body; 
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: err.Error
                });
                return;
            }
            const query = "call pack_new_especificacion.sp_eliminar_especificacion(:x_result,:x_de_result,:x_empresa,:x_co_usuario,:x_alias,:x_co_espec,:x_version)";
            const params = { 
                //parametros de salida
                x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                x_de_result: {dir: oracledb.BIND_OUT, type: oracledb.STRING },
                //parametros de entrada
                x_empresa: {val:empresa},
                x_co_usuario: {val:usuario},
                x_alias: {val:alias},
                x_co_espec: {val:espec},
                x_version: {val:version},
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

    mostrareportdt1: async (request, response) => {        
        const { nombre,esp,version} = request.params;
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
            const pdfWriter = require('html-pdf');
            const ejs = require('ejs');
            // const d = new Date();
            const data = {
                nombre:nombre,
                esp:esp,
                filas:filas,
                filas_n:filas_n,
            };
            const html = await ejs.renderFile(path.resolve('client/views/modulos/plantaindustrial/po010410-dt1.ejs'), data);
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
    }, 

    exportarxls: async (request, response) => {        
        const { empresa,grupo_prod } = request.params;
        try {
            const conn = await oracledb.getConnection(dbParams);
            let query = "select * from table(pack_new_especificacion.f_reporte_espec_xls(:x_empresa,:x_grupo))";
            let params = {
                x_empresa: { val: empresa },
                x_grupo: { val: grupo_prod }
            };
            const result = await conn.execute(query, params, responseParams);
            const personal = result.rows;
            var Workbook = require('xlsx-workbook').Workbook;
            var workbook = new Workbook();
            var reporte = workbook.add("Especificaiones");
            // encabezados
            reporte[0] = ['COD.PRODUCTO','NOMBRE PRODUCTO','ESTADO PRODUCTO', 'COD.ESPEC','VERSION','DESCRIPCION','COD.ARTE', 'VIGENCIA','TIPO','FE_CREACION','CREADO','FE_REVISA','REVISADO','F_APRUEBA','APROBADO','PROVEEDOR','MOTIVO CAMBIO'];
            
            let i = 1;
            // reporte[fila][columna]
            for (let fila of personal) {
                reporte[i] = [
                    fila.CO_CATALOGO_PRODUCTO ,
                    fila.DE_NOMBRE_PRODUCTO,
                    fila.ES_CATALOGO ,
                    fila.CO_ESPECIFICACION ,
                    fila.NU_VERSION,
                    fila.DE_NOMBRE,
                    fila.DE_CODIGO_ARTE,
                    fila.ES_VIGENCIA ,
                    fila.DE_TIPO,
                    fila.FE_CREACION ,
                    fila.DE_CREADOR,
                    fila.FE_REVISA ,
                    fila.DE_REVISADO,
                    fila.FE_APRUEBA ,
                    fila.DE_APRUEBA,
                    fila.DE_PROVEEDOR,
                    fila.DE_OBSERV
                ];
                i++;
            }
            // automatically appends the '.xlsx' extension
            let fpath = './tmp/' + empresa + '.xlsx';
            workbook.save(fpath);
            response.setHeader('Content-Disposition', 'attachment; filename=especificaciones.xlsx');
            response.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            let filestream = require('fs').createReadStream(fpath);
            filestream.pipe(response);
        }
        catch (err) {
            response.send(JSON.stringify(err));
        }
    }, 

    alertacodiseno: (req, res) => {     
        const {producto} = req.body; 
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: err.Error
                });
                return;
            }
            
            const query = "select f_alerta_codigo_arte(:xproducto) as alerta from dual";
            const params = { 
                xproducto: {val:producto},
            };
            conn.execute(query, params, responseParams, (error, result) => {
                if(error) {           
                    conn.close();
                    return;
                }
                var alert;
                for(var i in result.rows) {
                    alert = result.rows[i];                  
                }
                //comprobar si obtuve resultado
                if(alert) {                   
                    res.json({
                        state: 'success',
                        data: {
                            esp_alert: alert
                        }                      
                    
                    });
                }
                else {
                    res.json({
                        state: 'unsuccess',
                        data: {
                            esp_alert: alert
                        } 
                    });
                }
            });
        });
    }, 

    mostrartipoptr: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "select co_tipo as value,de_nombre as label from ma_tipo_patr";
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
    guardarpatron: (req, res) => {        
        const {empresa,usuario,especificacion,version,patron,observacion,fecha,orden,accion} = req.body; 
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: err.Error
                });
                return;
            }
            const query = "call pack_new_especificacion.sp_grabar_patron(:x_result,:x_de_result,:x_empresa,:x_usuario,:x_co_especificacion,:x_version,:x_patron,:x_obser,:x_fec_vigencia,:x_orden,:x_accion)";
            const params = { 
                //parametros de salida
                x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                x_de_result: {dir: oracledb.BIND_OUT, type: oracledb.STRING },
                //parametros de entrada
                x_empresa: {val:empresa},
                x_usuario: {val:usuario},
                x_co_especificacion: {val:especificacion},
                x_version: {val:version},
                x_patron: {val:patron},
                x_obser: {val:observacion},
                x_fec_vigencia: {val:fecha},
                x_orden: {val:orden},
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
       
    guardarestadopatron: (req, res) => {        
        const {empresa,usuario,especificacion,version,orden,accion} = req.body; 
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: err.Error
                });
                return;
            }
            const query = "call pack_new_especificacion.sp_grabar_estado_patron(:x_result,:x_de_result,:x_empresa,:x_usuario,:x_co_especificacion,:x_version,:x_orden ,:x_accion_aprobar)";
            const params = { 
                //parametros de salida
                x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                x_de_result: {dir: oracledb.BIND_OUT, type: oracledb.STRING },
                //parametros de entrada
                x_empresa: {val:empresa},
                x_usuario: {val:usuario},
                x_co_especificacion: {val:especificacion},
                x_version: {val:version},
                x_orden: {val:orden},
                x_accion_aprobar: {val:accion},
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

    mostrarpatrones: (req, res) => { 
            
        const {empresa,especificacion,version} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select co_orden,co_tipo,de_nombre_tipo,fe_creacion,de_creador,fe_vencimiento,fe_aprueba,de_aprueba,es_vigencia,de_observ from table(pack_new_especificacion.f_list_patron(:x_empresa,:x_espec,:x_version))";
            
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
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_NUMDOC: 'No se encontraron coincidencias' }]));
            });
        });
    },

    mostrarpatronespend: (req, res) => { 
            
        const {empresa} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select co_catalogo_producto,co_espec_anal,nu_version,co_orden,co_tipo,de_nombre_tipo,fe_creacion,de_creador,fe_vencimiento,es_vigencia,de_observ from table(pack_new_especificacion.f_list_patron_pendiente(:x_empresa))";
            
            const params = {
                x_empresa: {val : empresa},
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_NUMDOC: 'No se encontraron coincidencias' }]));
            });
        });
    },

    mostrarespecObservadas: (req, res) => { 
            
        const {empresa,grupo} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select co_numdoc,nu_version_doc,st_estado,de_observacion,fe_registro,nom_usuario from table (pack_new_especificacion.f_list_espec_observadas(:x_empresa,:x_grupo))";
            
            const params = {
                x_empresa: {val : empresa},
                x_grupo: {val : grupo},
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_NUMDOC: 'No se encontraron coincidencias' }]));
            });
        });
    },
    
    enviardt: (req, res) => {        
        const {codigo,version} = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: err.Error
                });
                return;
            }
            const query = "update po_espec_anal_cab set st_enviardt = 'S' where co_espec_anal = :x_codigo and nu_version = :x_version and co_grupo_produccion = 4";
            const params = { 
                x_codigo: {val:codigo},
                x_version: {val:version}
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                else res.json({
                    state: 'success'
                });
    
            });
        });
    },   
}

module.exports = po010410Controller;
