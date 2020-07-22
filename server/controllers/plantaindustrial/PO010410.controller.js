const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');
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
            
        const {empresa,especificacion} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select * from table (pack_new_especificacion.f_list_version(:x_empresa,:x_especificacion))";
            
            const params = {
                x_empresa: {val : empresa},
                x_especificacion: {val : especificacion}
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
            const query = "select 0,co_metodo_anal,de_metodo,co_ensayo,de_ensayo,de_especificaciones,limit_min,limit_max,de_tipo_ensayo,des_objetivo_ensayo from table (pack_new_especificacion.f_list_ensayo(:x_empresa,:x_espec,:x_version))";
            
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
            
        const {empresa,especificacion} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select * from table (pack_new_especificacion.f_list_historial(:x_empresa,:x_espec))";
            
            const params = {
                x_empresa: {val : empresa},
                x_espec: {val : especificacion}
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
            
        const {grupo,tipo,clase,buscar} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select 0,co_producto,de_nombre,de_marca,de_submarca from table (pack_new_especificacion.f_list_prod_por_grupo_prod(:x_grupo_prod,:x_tipo_prod,:x_clas_prod,:x_buscar))";
            
            const params = {
                x_grupo_prod: {val : grupo},
                x_tipo_prod: {val : tipo},
                x_clas_prod: {val : clase},
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
        const {empresa,usuario,especificacion,version,proveedor,grupo,descripcion,serie,accion,tipo} = req.body; 
        console.log(empresa,usuario,especificacion,version,proveedor,grupo,descripcion,serie,accion);
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: error.Error
                });
                return;
            }
            const query = "call pack_new_especificacion.sp_grabar_especificacion(:x_result,:x_de_result,:x_empresa,:x_usuario,:x_co_especificacion,:x_version,:x_proveedor,:x_grupo_prod,:x_descripcion,:x_serie,:x_accion,:x_tipo_espec)";
            const params = { 
                //parametros de salida
                x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                x_de_result: {dir: oracledb.BIND_OUT, type: oracledb.STRING },
                //parametros de entrada
                x_empresa: {val:empresa},
                x_usuario: {val:usuario},
                x_co_especificacion: {val:especificacion},
                x_version: {val:version},
                x_proveedor: {val:proveedor},
                x_grupo_prod: {val:grupo},
                x_descripcion: {val:descripcion},
                x_serie: {val:serie},
                x_accion: {val:accion},
                x_tipo_espec: {val:tipo},
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
                    message: error.Error
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
            const query = "select 0,co_metodo_anal,de_metodo,co_ensayo,de_ensayo,co_tipo_ensayo,de_tipo_ensayo,des_objetivo_ensayo,nu_version,co_metodo_default,co_unidad_analisis,st_obligatorio,st_declarado,st_especificacion,st_guiamanufactura,st_estado from table(pack_new_especificacion.f_list_ensayo_general(:x_grupo_prod))";
            
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

    guardarcaract: (req, res) => {        
        const {empresa,usuario,alias,especificacion,version,cadena_cod_car,cadena_de_car,cantfilas,caract_gen,cond_alm} = req.body; 
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: error.Error
                });
                return;
            }
            
            const query = "call pack_new_especificacion.sp_grabar_caracteristica(:x_result,:x_de_result,:x_empresa,:x_usuario,:x_alias,:x_co_especificacion,:x_version,:x_cadena_cod_car,:x_cadena_de_car,:x_cant_filas,:x_caract_general,:x_cod_alm)";
            const params = { 
                //parametros de salida
                x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                x_de_result: {dir: oracledb.BIND_OUT, type: oracledb.STRING },
                //parametros de entrada
                x_empresa: {val:empresa},
                x_usuario: {val:usuario},
                x_alias: {val:alias},
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

    guardarensayo: (req, res) => {        
        const {empresa,usuario,especificacion,version,ensayo,metodo,cadespec,limmin,limmax,cantfilas} = req.body; 
        console.log(empresa,usuario,especificacion,version,ensayo,metodo,cadespec,limmin,limmax,cantfilas); 
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: error.Error
                });
                return;
            }
            const query = "call pack_new_especificacion.sp_grabar_ensayo(:x_result,:x_de_result,:x_empresa,:x_usuario,:x_co_especificacion,:x_version,:x_co_cadena_ensayo,:x_co_cadena_metodo,:x_cadena_espec,:x_cadena_lim_min,:x_cadena_lim_max,:x_cant_filas)";
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
    
    copiarespecificacion: (req, res) => {        
        const {accion,empresa,espec_orig,grupo_prod,version_orig,co_espec_nue,proveedor,desc,usuregistra,alias} = req.body; 
        console.log(accion,empresa,espec_orig,grupo_prod,version_orig,co_espec_nue,proveedor,desc,usuregistra,alias);
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: error.Error
                });
                return;
            }
            const query = "call pack_new_especificacion.sp_copia_espec_tecnica (:x_result,:x_de_result,:p_accion,:p_empresa,:p_espec_orig,:p_grupo_prod,:p_version_orig,:p_co_espec_nue,:p_proveedor,:p_desc,:p_usuregistra,:p_alias)";
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
        console.log(empresa,grupo,flag);
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
}

module.exports = po010410Controller;
