const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');
const responseParams = {
    outFormat: oracledb.OBJECT,
    autoCommit: true
};

const vt01040103Controller = {
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
    
    mostrarUsuario: (req, res) => {      
        const {usuario} = req.body;   
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "select de_nombre_comercial from ma_cata_enti_m where co_catalogo_entidad = :co_usuario";
            
            const params = {co_usuario: {val : usuario}};
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

    calcularvtaAnual: (req, res) => {      
        const {empresa} = req.body;   
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "select nu_cant_solic from table(pack_new_requ_prod.f_devuelve_num_total_anual(:x_empresa))";
            
            const params = {x_empresa: {val : empresa}};
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
                            vta_anual: result.rows
                        }   
                    });       
                }
            });
        });
    },

    calculartotPedido: (req, res) => {      
        const {empresa,periodo} = req.body;   
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "select nu_cant_solic from table(pack_new_requ_prod.f_devuelve_num_tot_pedido(:x_empresa,:x_periodo))";
            
            const params = {x_empresa: {val : empresa},x_periodo: {val : periodo}};
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
                            tot_pedido: result.rows
                        }   
                    });       
                }
            });
        });
    },

    calculartotRequ: (req, res) => {      
        const {empresa,periodo} = req.body;   
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "select nu_cant_solic from table(pack_new_requ_prod.f_devuelve_num_tot_req(:x_empresa,:x_periodo))";
            
            const params = {x_empresa: {val : empresa},x_periodo: {val : periodo}};
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
                            tot_req: result.rows
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

    mostrarlistReq: (req, res) => {      
        const {empresa,usuario,fec_ini,fec_fin,flag_pend,flag_rech,flag_aten} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select * from table(pack_new_requ_prod.f_list_req_mkt_consulta (:x_empresa,:x_usuario,:x_fec_ini,:x_fec_fin,:x_flag_pend,:x_flag_rech,:x_flag_aten))";
             
            const params = {x_empresa: {val : empresa},x_usuario: {val : usuario},x_fec_ini: {val : fec_ini},x_fec_fin: {val : fec_fin},x_flag_pend: {val : flag_pend},x_flag_rech: {val : flag_rech},x_flag_aten: {val : flag_aten}};
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ FH_REQU: 'No se encontraron coincidencias' }]));
            });
        });
    }, 
    mostrarlistdetReq: (req, res) => {      
        const {empresa,requerimiento} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select co_producto,de_nombre,co_lote,de_ubicacion,nu_cant_solic,nu_cant_aten,nu_cant_pend,nu_cant_aprob ,'<b>'||im_precio_venta||'</b>','<b>'||im_sub_total||'</b>' from table(pack_new_requ_prod.f_list_req_mkt_consulta_det(:x_empresa,:x_co_requ))";
             
            const params = {x_empresa: {val : empresa},x_co_requ: {val : requerimiento}};
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
        const {opcion,empresa,cadena,producto} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select checkbox,co_codigo,de_descripcion,es_vigencia,de_detalle_1,de_detalle_2 from table(pack_new_sources.f_list_cata_prod(:x_id_opcion,:x_empresa,:x_cad_params,:x_busqueda))";
            
            const params = {x_id_opcion: {val : opcion},x_empresa: {val : empresa}, x_cad_params :{val: cadena}, x_busqueda: {val : '%'+producto+'%'}};
           
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_CODIGO: '', DE_DESCRIPCION: 'No se encontraron coincidencias' }]));
            });
        });
    },

    mostrarUsuariosolicita: (req, res) => {      
        const {alias,search} = req.params;  
       
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query1 = 'call pack_venta.sm_activar_empresa(:alias)';
            const params1 = {alias: {val: alias}};
            conn.execute(query1, params1, responseParams, (error, result) => {
                if (error) {
                    conn.close();
                    return;
                }
            });
            const query = "select co_catalogo_entidad,de_razon_social,de_centro_costo,co_centro_costo,de_alias,fe_sys,es_vigencia from table(pack_new_requ_prod.f_list_cata_enti_solicita(:x_search))";
            
            const params = {x_search: {val : search}};
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_CATALOGO_ENTIDAD: 'No se encontraron coincidencias', DE_RAZON_SOCIAL: '' }]));
            });
        });
    },
    
    mostrarUsuariopsto: (req, res) => {      
        const {alias,usuario,centro_costo} = req.params;  
       console.log(usuario,centro_costo);
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query1 = 'call pack_venta.sm_activar_empresa(:alias)';
            const params1 = {alias: {val: alias}};
            conn.execute(query1, params1, responseParams, (error, result) => {
                if (error) {
                    conn.close();
                    return;
                }
            });
            const query = "select de_razon_social, nu_saldo, nu_efectivo,nu_reservado,co_catal_psto from table(pack_new_requ_prod.f_list_cata_enti_presupuesto(:x_usuario,:x_centro_costo))";
            
            const params = {x_usuario: {val : usuario},x_centro_costo: {val : centro_costo}};
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_CATAL_PSTO: 'No se encontraron coincidencias', DE_RAZON_SOCIAL: '' }]));
            });
        });
    },

    mostrarCatPspto: (req, res) => {      
        const {empresa,ingreso} = req.params;
        console.log(empresa,ingreso);  
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select co_categ_ingreso_gasto,de_moti_requerimiento,case when st_costo ='N' then 0 else 1 end,co_cta_gasto,co_cata_pspto,de_nombre_pspto,de_desc_cta_contable,co_ing_gasto from table(pack_new_requ_prod.f_list_moti_ing_por_cgastos(:x_empresa,:x_ingreso))";
            
            const params = {x_empresa: {val : empresa},x_ingreso: {val : ingreso}};
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_CATEG_INGRESO_GASTO: 'No se encontraron coincidencias', DE_RAZON_SOCIAL: '' }]));
            });
        });
    },

    mostrarEntidad: (req, res) => {      
        const {entidad,empresa,buscar} = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select co_codigo,de_descripcion,es_vigencia,de_detalle_1 from table (pack_new_sources.f_list_cata_enti(:x_tipo_entidad,:x_empresa,1,'',:x_buscar))";
            
            const params = {x_tipo_entidad: {val : entidad},x_empresa: {val : empresa},x_buscar: {val : '%'+buscar+'%'}};
           
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_CATEG_INGRESO_GASTO: 'No se encontraron coincidencias', CO_CODIGO: '' }]));
            });
        });
    },

    mostrarDireccion: (req, res) => {      
        const {opcion,empresa,entidad} = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select co_codigo,de_descripcion,es_vigencia,de_detalle_1,de_detalle_2 from table(pack_new_sources.f_list_lupa_general(:x_id_opcion,:x_empresa,:x_cad_params))";
            
            const params = {x_id_opcion: {val : opcion},x_empresa: {val : empresa},x_cad_params: {val : entidad}};
           
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_CATEG_INGRESO_GASTO: 'No se encontraron coincidencias', CO_CODIGO: '' }]));
            });
        });
    },

    mostrartipoEntidad: (req, res) => {        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "select co_tipo_entidad AS VALUE,de_nombre AS LABEL from MA_tipo_enti_m where co_tipo_entidad in (2,3,4,5) order by de_nombre";
            
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

    mostrarMoneda: (req, res) => {        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "select co_moneda as value,de_nombre as label from ma_mone_m";
            
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

}

module.exports = vt01040103Controller;