const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');
const responseParams = {
    outFormat: oracledb.OBJECT,
    autoCommit: true
};

const po010411Controller = {
    
    mostrarespecificacion: (req, res) => { 
        const {empresa,grupo,flag} = req.params;  
        console.log(empresa,grupo,flag);
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select de_nombre,co_especificacion,nu_version,es_vigencia,fe_creacion,fe_revisa,fe_aprueba,de_creador,de_revisado,de_aprueba,de_proveedor,co_proveedor,co_nsoc,de_nombre_registrado_nso,de_tipo from table (pack_new_especificacion.f_list_especificacion_v2(:x_empresa,:x_grupo,:x_flag))";
            
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
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_PRODUCTO: 'No se encontraron coincidencias' }]));
            });
        });
    },

    mostrarespecDescontinuada: (req, res) => { 
        const {empresa} = req.params;  
        console.log('jol');
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select de_nombre,co_especificacion,nu_version,es_vigencia,fe_creacion,fe_revisa,fe_aprueba,de_creador,de_revisado,de_aprueba,de_proveedor,co_proveedor,co_nsoc,de_nombre_registrado_nso,de_tipo from table (pack_new_especificacion.f_list_especificacion_desc(:x_empresa))";
            
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
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ DE_NOMBRE: 'No se encontraron coincidencias' }]));
            });
        });
    },

    mostrarespecporgrupo: (req, res) => { 
            
        const {empresa,grupo} = req.params;  
        
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select co_especificacion,de_nombre,co_espec_granel,co_nsoc,nu_version,es_vigencia,fe_creacion,fe_revisa,fe_aprueba,de_creador,de_revisado,de_aprueba,de_proveedor,co_proveedor,de_tipo from table (pack_new_especificacion.f_list_especificacion_grupo(:x_empresa,:x_grupo))";
            
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
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_PRODUCTO: 'No se encontraron coincidencias' }]));
            });
        });
    },

    aprobaresp: (req, res) => {        
        const {empresa,usuario,especificacion,proveedor,version,vigencia} = req.body;  
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: err.Error
                });
                return;
            }
            const query = "call pack_new_especificacion.sp_grabar_estado(:x_result,:x_de_result,:x_empresa,:x_usuario,:x_co_especificacion,:x_co_proveedor,:x_version,:x_vigencia)";
            const params = { 
                //parametros de salida
                x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                x_de_result: {dir: oracledb.BIND_OUT, type: oracledb.STRING },
                //parametros de entrada
                x_empresa: {val:empresa},
                x_usuario: {val:usuario},
                x_co_especificacion: {val:especificacion},
                x_co_proveedor: {val:proveedor},
                x_version: {val:version},
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
    validaraccion: (req, res) => {        
        const {empresa,usuario,serie} = req.body; 
        console.log(empresa,usuario);
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: err.Error
                });
                return;
            }
            const query = "select  nvl(rtrim (xmlagg (xmlelement (e, co_operacion || '@')).extract ('//text()'), ',') ,'NO') as de_descripcion from SG_usuarios_autoriza_serie where co_usuario = :x_usuario and co_empresa= :x_empresa and co_serie = :x_serie and CO_OPERACION in ('REVISA','APRUEBA') and co_tipo_doc_administr = 601";
            const params = { 
                //parametros de entrada
                x_empresa: {val:empresa},
                x_usuario: {val:usuario},
                x_serie: {val:serie},
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

}

module.exports = po010411Controller;
