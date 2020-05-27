const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');

const responseParams = {
    outFormat: oracledb.OBJECT,
    autoCommit: true
};

const sg010203Controller = {

    mostrarListaUsuarios: (req, res) => {
        const {empresa} = req.params;  
       
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = 'SELECT CO_USUARIO,DE_ALIAS,DE_NOMBRE_COMERCIAL,DE_FECHA_REGISTRO,DE_ASIGNADO FROM TABLE(PACK_NEW_SEGURIDAD_USU.F_LIST_SG_USUARIO_MENU(:x_empresa))';
            
            const params = {  
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

    mostrarVersiones: (req, res) => {
    const {usuario,empresa} = req.params;
  
    oracledb.getConnection(dbParams, (err, conn) => {
        if (err) {
            res.send({ 'error_conexion': err.stack });
            return;
        }
        const query = "SELECT CO_ACCESO_MENU,FE_INGRESO FROM TABLE (PACK_NEW_SEGURIDAD_USU.F_LIST_SG_VERSION_USUARIO(:x_usuario,:x_empresa))";
        const params = { x_usuario: {val: usuario}, x_empresa: { val: empresa } };
        conn.execute(query, params, responseParams, (error, result) => {
            if (error) {
                res.send({ 'error_query': error.stack });
                conn.close();
                return;
            }
            res.set('Content-Type', 'text/xml');
            res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_EMPRESA: '', DE_EMPRESA: ''}]));
            
        });
    });
    },

    mostrarMenuCabecera: (req, res) => {        
    const {usuario,empresa,acceso_menu} = req.body;  
    oracledb.getConnection(dbParams, (err, conn) => {
        if(err) {
            res.json({
                state: 'error',
                message: error.Error
            });
            return;
        }
        const query = "SELECT CO_ACCESO_MENU,FE_INGRESO,FE_CIERRE,DE_MOTIVO_CIERRE,VIGENCIA,FE_SYS FROM TABLE (PACK_NEW_SEGURIDAD_USU.F_LIST_SG_MENU_C_USUARIO(:x_usuario,:x_empresa,:x_acceso_menu))";
        const params = { 
            x_usuario: {val: usuario}, 
            x_empresa: { val: empresa },
            x_acceso_menu: { val: acceso_menu}
        };
        conn.execute(query, params, responseParams, (error, result) => {
            conn.close();
            if (error) {
                res.send({ 'error_query': error.stack });
                return;
            }

            var menu_usuario;
            for(var i in result.rows) {
                menu_usuario = result.rows[i];                  
            }
            if(result.rows.length > 0) {                
                res.json({
                    state: 'success',
                    data: {
                        usuario: menu_usuario
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

    mostrarMenuDUsuario: (req, res) => {        
    const {empresa,acceso_menu} = req.params;  
    oracledb.getConnection(dbParams, (err, conn) => {
        if(err) {
            res.json({
                state: 'error',
                message: error.Error
            });
            return;
        }        
        const query = "SELECT 0,CO_MENU_SISTEMA ,DE_NOMBRE,ST_VISIBLE,ES_VIGENCIA FROM TABLE(PACK_NEW_SEGURIDAD_USU.F_LIST_ACCE_MENU_D(:x_empresa,:x_acceso_menu))";
        const params = { 
            x_empresa: { val: empresa },
            x_acceso_menu: { val: acceso_menu}
        };
        
        conn.execute(query, params, responseParams, (error, result) => {
            if (error) {
                res.send({ 'error_query': error.stack });
                conn.close();
                return;
            }
            res.set('Content-Type', 'text/xml');
            res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_EMPRESA: '', DE_EMPRESA: ''}]));
            
        });
    });
    },

    mostrarMenuSistema: (req, res) => {        
    const {empresa,acceso_menu} = req.params;  
    oracledb.getConnection(dbParams, (err, conn) => {
        if(err) {
            res.json({
                state: 'error',
                message: error.Error
            });
            return;
        }        
        const query = "SELECT 0,CO_MENU_SISTEMA ,DE_NOMBRE,ST_VISIBLE,ES_VIGENCIA FROM TABLE(PACK_NEW_SEGURIDAD_USU.F_LIST_MENU_SIST(:x_empresa,:x_acceso_menu))";
        const params = { 
            x_empresa: { val: empresa },
            x_acceso_menu: { val: acceso_menu}
        };
        conn.execute(query, params, responseParams, (error, result) => {
            if (error) {
                console.log(error);
                res.send({ 'error_query': error.stack });
                conn.close();
                return;
            }
            res.set('Content-Type', 'text/xml');
            res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_EMPRESA: '', DE_EMPRESA: ''}]));
            
        });
    });
    },
    
    grabarDetalleMenu: (req, res) => {        
        const {empresa,acce_menu,cant_filas_menu,cade_general} = req.body;  
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: error.Error
                });
                return;
            }
            const query = "call PACK_NEW_SEGURIDAD_USU.SP_SAVE_ACC_MENU_USUARIO (:x_result,:x_de_result,:x_empresa,:x_acce_menu,:x_cant_filas_menu,:x_cade_general)";
            const params = { 
                //parametros de salida
                x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                x_de_result: {dir: oracledb.BIND_OUT, type: oracledb.STRING },
                //parametros de entrada
                x_empresa: { val: empresa },
                x_acce_menu: { val: acce_menu},
                x_cant_filas_menu: { val: cant_filas_menu},
                x_cade_general: { val: cade_general}
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
                    message: x_de_result
                });
                else res.json({
                    state: 'error',
                    message: x_de_result
                });
            });
        });
    },
//x_empresa number,x_usuario number,x_asignar_nuevo in char,x_acceso_menu number,x_estado in varchar2, x_motivo_cierre in varchar2);
  
    guardarMenucabecera: (req, res) => {        
        //const {empresa,usuario,asignar_nuevo} = req.body;  
        const {empresa,usuario,asignar_nuevo,acceso_menu,estado,motivo_cierre} = req.body;  
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: error.Error
                });
                return;
            }
            const query = "call PACK_NEW_SEGURIDAD_USU.sp_guardar_menu_cabecera (:x_result,:x_de_result,:x_empresa,:x_usuario,:x_asignar_nuevo,:x_acceso_menu,:x_estado,:x_motivo_cierre)";
            const params = { 
                //parametros de salida
                x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                x_de_result: {dir: oracledb.BIND_OUT, type: oracledb.STRING },
                //parametros de entrada
                x_empresa: { val: empresa },
                x_usuario: { val: usuario},
                x_asignar_nuevo: { val: asignar_nuevo},
                x_acceso_menu: { val: acceso_menu},
                x_estado: { val: estado},
                x_motivo_cierre: { val: motivo_cierre}
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
                    message: x_de_result
                });
                else res.json({
                    state: 'error',
                    message: x_de_result
                });
            });
        });
    },
  
  guardarAccionmenu: (req, res) => {   
    const {empresa,acce_menu,cant_filas_menu,cade_general,accion} = req.body;  
    oracledb.getConnection(dbParams, (err, conn) => {
        if(err) {
            res.json({
                state: 'error',
                message: error.Error
            });
            return;
        }
        const query = "call PACK_NEW_SEGURIDAD_USU.SP_SAVE_MENU_D_USUARIO_ACTIVAR (:x_result,:x_de_result,:x_empresa,:x_acce_menu,:x_cant_filas_menu,:x_cade_general,:x_accion)";
        const params = { 
            //parametros de salida
            x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
            x_de_result: {dir: oracledb.BIND_OUT, type: oracledb.STRING },
            //parametros de entrada
            x_empresa: { val: empresa },
            x_acce_menu: { val: acce_menu},
            x_cant_filas_menu: { val: cant_filas_menu},
            x_cade_general: { val: cade_general},            
            x_accion: { val: accion}
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

module.exports = sg010203Controller;