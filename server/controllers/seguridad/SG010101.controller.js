const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');

const responseParams = {
    outFormat: oracledb.OBJECT,
    autoCommit: true
};

const sg010101Controller = {
        

    buscarUsuario: (req, res) => {
        const { usuario, empresa } = req.params;  
       
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = 'SELECT CO_USUARIO,NU_DOCUMENTO,DE_NOMBRE,DE_RAZON_SOCIAL,DE_NOMBRE_COMERCIAL,DE_SYS FROM TABLE(PACK_NEW_SEGURIDAD_USU.F_LIST_USUARIO_BY_ID(:x_search_usuario,:x_empresa))';
            //  sg_tipo_docu: { val: tipo_docu},
            const params = { 
                x_search_usuario: { val: usuario }, 
                x_empresa : { val: empresa} 
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_CATALOGO_ENTIDAD: '', DE_RAZON_SOCIAL: 'No se encontraron coincidencias', ES_VIGENCIA: '', DE_NOMBRE_COMERCIAL: 'No se encontraron coincidencias', SITUACION_ENTIDAD: '', NOM_VISTA: 'No se encontraron coincidencias' }]));
            });
        });
    },

    mostrarPermisos: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = 'SELECT CO_TABLA, NOM_TABLA , INTERNO FROM TABLE(PACK_NEW_SEGURIDAD_USU.F_LIST_MA_PERMISOS())';
            const params = { 
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_CATALOGO_ENTIDAD: '', DE_RAZON_SOCIAL: 'No se encontraron coincidencias', ES_VIGENCIA: '', DE_NOMBRE_COMERCIAL: 'No se encontraron coincidencias', SITUACION_ENTIDAD: '', NOM_VISTA: 'No se encontraron coincidencias' }]));
            });
        });
    },
    mostrarUsuario: (req,res) =>{
        const {usuario,empresa} = req.body;
        oracledb.getConnection(dbParams,(err,conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: error.Error
                });
                return;
            }
            const query = 'SELECT CO_USUARIO, NRO_DOCUMENTO, TIPO_DOC_IDENT, TIPO_PERSONA,VIGENCIA,USU_APE_PATERNO,USU_APE_MATERNO,USU_NOMBRE,USU_ORIGEN,PROCEDENCIA,FEC_REGISTRO,RAZ_SOCIAL,NOM_COMER,CO_CENTRO_COSTO,FE_SYS,ST_ACCESO_WAP,ST_ACCESO_SISTEMA,ST_ADMIN,ES_VIGENCIA,FE_VIGENCIA,DE_CORREO,DE_CLAVE_WAP,DE_CLAVE_SISTEMA,DE_ALIAS,ST_CARGO FROM TABLE(PACK_NEW_SEGURIDAD_USU.F_LIST_USUARIO_BY_USERID(:x_co_usuario,:x_empresa))';
            const params = {                
                x_co_usuario: { val: usuario },
                x_empresa: {val : empresa}
            };
            conn.execute(query,params,responseParams,(error, result)=>{
                
                if(error) {           
                    conn.close();
                    return;
                }
                var o_usuario;
                for(var i in result.rows) {
                    o_usuario = result.rows[i];                  
                }
                //comprobar si obtuve resultado
                if(o_usuario) {                   
                    res.json({
                        state: 'success',
                        data: {
                            usuario: o_usuario
                        }                      
                    
                    });
                }
                else {
                    res.json({
                        state: 'error',
                        message: 'El usuario indicado no existe'
                    });
                }
            });
        });
    },

    mostrarPermisosUsuario: (req,res) =>{
        const {usuario,empresa,cod_tabla} = req.body;
        oracledb.getConnection(dbParams,(err,conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: error.Error
                });
                return;
            }
            const query = 'SELECT SPD_USUARIO,SPD_TABLA,SPD_CLAVE,SPD_ACTIVO FROM TABLE (PACK_NEW_SEGURIDAD_USU.F_LIST_PERMISO_BY_USUARIO(:x_usuario,:x_empresa,:x_cod_tabla))';
            const params = {                
                x_usuario: { val: usuario },
                x_empresa: {val : empresa},
                x_cod_tabla: {val : cod_tabla},
            };
            conn.execute(query,params,responseParams,(error, result)=>{
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }

                var permiso_usuario;
                for(var i in result.rows) {
                    permiso_usuario = result.rows[i];                  
                }
                if(result.rows.length > 0) {                
                    res.json({
                        state: 'success',
                        data: {
                            usuario: permiso_usuario
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

    mostrarEmpresa: (req,res) =>{
        const {empresa} = req.params;  
       
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = 'SELECT CO_EMPRESA,DE_NOMBRE,NRO_RUC FROM TABLE (PACK_NEW_SEGURIDAD_USU.F_LIST_MA_EMPRESAS(:x_empresa))';
          
            const params = { 
                x_empresa: { val: empresa }
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_EMPRESA: '', DE_EMPRESA: ''}]));
            });
        });
    },

    mostrarccosto: (req, res) => {
        const {empresa} = req.params; 
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "SELECT CO_CENTRO_COSTO AS value,CO_CENTRO_COSTO AS label FROM TABLE(PACK_NEW_SEGURIDAD_USU.F_LIST_MA_CENTRO_COSTO(:x_empresa))";
            const params = { x_empresa: { val: empresa }};
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

    guardarUsuario:  (req,res) => {

        const {tipo_docu,nro_docu,tipo_pers,vigencia,raz_soc,nom_com,ape_pat,ape_mat,nombre,proced,origen,regist} = req.body;
        
        oracledb.getConnection(dbParams,(err, conn) => {
            if (err){
                console.log(err);
                return;
            }
            const query = "call PACK_NEW_SEGURIDAD_USU.sp_grabar_usuario (:sg_tipo_docu,:sg_nro_docu,:sg_tipo_pers,:sg_vigencia,:sg_razon_soc,:sg_nombre_com,:sg_ape_pat,:sg_ape_mat,:sg_nombre,:sg_proce,:sg_origen,:sg_regist,:u_resultado,:u_codresult)";
            
            const params = {
                sg_tipo_docu: { val: tipo_docu},
                sg_nro_docu: { val: nro_docu },
                sg_tipo_pers: { val: tipo_pers },
                sg_vigencia: { val: vigencia },
                sg_razon_soc: { val: raz_soc },
                sg_nombre_com: { val: nom_com },
                sg_ape_pat: { val: ape_pat },
                sg_ape_mat: { val: ape_mat },
                sg_nombre: { val: nombre },
                sg_proce: { val: proced },
                sg_origen: { val: origen },
                sg_regist: { val: regist },
                //parametros de salida
                u_resultado : {dir: oracledb.BIND_OUT, type: oracledb.STRING },
                u_codresult : { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
            };
            conn.execute(query, params, responseParams, (error, result) => {
                if(error) {
                    conn.close();
                    res.json({
                        state: 'error',
                        message: error.Error
                    });
                    return;
                }
                const { u_codresult, u_resultado } = result.outBinds;
                if(u_codresult == 1) res.json({
                    state: 'success',
                    message: u_resultado
                });
                else res.json({
                    state: 'error',
                    message: u_resultado
                });
                
            });
            
        });
    },

    guardarUsuariov2:  (req,res) => {

        const {permiso_editar,empresa,alias,co_catalogo_entidad,de_razon_social,nu_documento,co_tipo_persona,co_tipo_doc_ide,de_procedencia,
            de_ape_paterno,de_ape_materno,de_nombre,de_nombre_comercial,de_origen,st_usuario_nvo,st_usuario_upd,de_email,
            clave_wap,acceso_sis,de_fec_vig,centro_costo,de_admin,de_cargo,vigencia,clavewap,clavesist} = req.body;
           
        oracledb.getConnection(dbParams,(err, conn) => {
            if (err){
                console.log(err);
                return;
            }
            const query = "call PACK_NEW_SEGURIDAD_USU.sp_cata_enti_usuario_grabar (:permiso_editar_usuario,:x_empresa,:x_alias,:x_co_catalogo_entidad,:x_de_razon_social,:x_nu_documento,:x_co_tipo_persona,:x_co_tipo_doc_ide,:x_de_procedencia,:x_de_ape_paterno,:x_de_ape_materno,:x_de_nombre,:x_de_nombre_comercial,:x_de_origen,:x_st_usuario_nvo,:x_st_usuario_upd,:x_de_email,:x_clave_wap,:x_acceso_sis,:x_de_fec_vig,:x_centro_costo,:x_de_admin,:x_de_cargo,:x_vigencia,:x_clavewap,:x_clavesist,:x_result,:x_de_result)";
            
            const params = {
                permiso_editar_usuario: { val: permiso_editar},
                x_empresa: { val: empresa },
                x_alias: { val: alias },
                x_co_catalogo_entidad: { val: co_catalogo_entidad },
                x_de_razon_social: { val: de_razon_social },
                x_nu_documento: { val: nu_documento},
                x_co_tipo_persona: { val: co_tipo_persona },
                x_co_tipo_doc_ide: { val: co_tipo_doc_ide },
                x_de_procedencia: { val: de_procedencia },
                x_de_ape_paterno: { val: de_ape_paterno },
                x_de_ape_materno: { val: de_ape_materno },
                x_de_nombre: { val: de_nombre },
                x_de_nombre_comercial: { val: de_nombre_comercial },
                x_de_origen: { val: de_origen },
                x_st_usuario_nvo: { val: st_usuario_nvo },
                x_st_usuario_upd: { val: st_usuario_upd },
                x_de_email: { val: de_email },
                x_clave_wap: { val: clave_wap },
                x_acceso_sis: { val: acceso_sis },
                x_de_fec_vig: { val: de_fec_vig},
                x_centro_costo : { val: centro_costo},
                x_de_admin: { val: de_admin },
                x_de_cargo: { val: de_cargo},
                x_vigencia: { val: vigencia },
                x_clavewap:  { val: clavewap },
                x_clavesist:  { val: clavesist },
                //parametros de salida
                x_result :{ dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                x_de_result :  {dir: oracledb.BIND_OUT, type: oracledb.STRING },
            };
               
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ state: 'error_query', message: error.stack });
                    return;
                } else {
                    const { x_result, x_de_result } = result.outBinds;
                    if(x_result>0) res.json({
                        state: 'success',
                        message: x_de_result,
                        codigo: x_result
                    });
                    else res.json({
                        state: 'error',
                        message: x_de_result,
                        codigo: x_result
                    });

                    // const { x_result, x_de_result } = result.outBinds;
                    // objtype = x_de_result.split("@");
                    // ///    diaActual = new Date();
                    // res.json({ state: 'success', codigo: x_result, message:  objtype[0], nombre: x_result + ' ' + de_razon_social });
                }
            });
            
        });
    },
    guardarPermiso:  (req,res) => {

        const {empresa,usuario,tab_sist,clave,activo} = req.body;
        oracledb.getConnection(dbParams,(err, conn) => {
            if (err){
                console.log(err);
                return;
            }            
            const query = "call PACK_NEW_SEGURIDAD_USU.sp_sg_perm_modi_grabar(:x_empresa,:x_usuario,:x_tab_sist,:x_clave,:st_activo,:x_result,:x_de_result)";
            
            const params = {
                x_empresa: { val: empresa},
                x_usuario: { val: usuario},
                x_tab_sist: { val: tab_sist},
                x_clave: { val: clave},
                st_activo: { val: activo},
                //parametros de salida
                x_de_result : {dir: oracledb.BIND_OUT, type: oracledb.STRING },
                x_result : { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
            };
            conn.execute(query, params, responseParams, (error, result) => {
                if(error) {
                    conn.close();
                    res.json({
                        state: 'error',
                        message: error.Error
                    });
                    return;
                }
                const { x_result, x_de_result } = result.outBinds;
                if(x_result == 1) res.json({
                    state: 'success',
                    message: x_de_result
                });
                else res.json({
                    state: 'error',
                    message: x_de_result
                });
                
            });
            
        });
    },
    
    clonarUsuario:  (req,res) => {
        //x_result out,x_de_result out,x_empresa,x_st_opcion_clonar in,x_usuario_source,x_usuario_destino
        const {empresa,opcion,usuario_source,usuario_destino} = req.body;
        oracledb.getConnection(dbParams,(err, conn) => {
            if (err){
                console.log(err);
                return;
            }            
            const query = "call PACK_NEW_SEGURIDAD_USU.sp_clonar_usu_por_usuario(:x_result,:x_de_result,:x_empresa,:x_st_opcion_clonar,:x_usuario_source,:x_usuario_destino)";
            
            const params = {
                //parametros de salida
                x_result : { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                x_de_result : {dir: oracledb.BIND_OUT, type: oracledb.STRING },
                //parametros de salida
                x_empresa: { val: empresa},
                x_st_opcion_clonar: { val: opcion},
                x_usuario_source: { val: usuario_source},
                x_usuario_destino: { val: usuario_destino}
            };
            conn.execute(query, params, responseParams, (error, result) => {
                if(error) {
                    conn.close();
                    res.json({
                        state: 'error',
                        message: error.Error
                    });
                    return;
                }
                const { x_result, x_de_result } = result.outBinds;
                if(x_result == 1) res.json({
                    state: 'success',
                    message: x_de_result
                });
                else res.json({
                    state: 'error',
                    message: x_de_result
                });
                
            });
            
        });
    },
    
    replicarEmpresa:  (req,res) => {
        const {usuario,empresa_source,empresa_destino} = req.body;
        console.log(usuario,empresa_source,empresa_destino);
        oracledb.getConnection(dbParams,(err, conn) => {
            if (err){
                console.log(err);
                return;
            }
            const query = "call PACK_NEW_SEGURIDAD_USU.SP_HEREDAR_USU_X_EMP (:x_result,:x_de_result,:x_usuario,:x_empresa_source,:x_empresa_destino)";
            
            const params = {
                //parametros de salida
                x_result : { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                x_de_result : {dir: oracledb.BIND_OUT, type: oracledb.STRING },

                x_usuario: { val: usuario},
                x_empresa_source: { val: empresa_source },
                x_empresa_destino: { val: empresa_destino },
            };

            conn.execute(query, params, responseParams, (error, result) => {
                if(error) {
                    console.log('entra aqui');
                    conn.close();
                    res.json({
                        state: 'error',
                        message: error.Error
                    });
                    return;
                }
                const { x_result, x_de_result } = result.outBinds;
                if(x_result == 1) res.json({
                    state: 'success',
                    message: x_de_result
                });
                else res.json({
                    state: 'error',
                    message: x_de_result
                });
                
            });
            
        });
    },
}

module.exports = sg010101Controller;