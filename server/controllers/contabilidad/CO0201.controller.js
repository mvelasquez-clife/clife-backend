const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');

const responseParams = {
    outFormat: oracledb.OBJECT,
    autoCommit: true
};

const co0201Controller = {
    inicio: (request, response) => {
        // const { par1,par2,... } = request.params; // parametros por url
        // const { par1,par2,... } = request.body; // parametros por post
        response.json({
            state: true,
            data: {
                parametro: "hola",
                codigo: 1234
            }
        });
    },
    ejemplo: async (request,response) =>  {
        const { empresa } = request.params; // ...../empresa/usuario
        // const empresa = request.params.empresa;
        // const usuario = request.params.usuario;
        try {
            let conn = await oracledb.getConnection(dbParams);
            // let query = "select de_alias,co_usuario id,de_nombre from xx_pruebas_susy where co_empresa_usuario = :p_empresa and rownum < 20";
            let query = "select de_alias,co_usuario id,de_nombre from xx_pruebas_susy where nu_edad > :p_empresa and rownum < 30"
            let params = {
                p_empresa: { val: empresa }
            };
            let result = await conn.execute(query, params, responseParams);
            // result.rows
            response.set('Content-Type', 'text/xml');
            response.send(xmlParser.renderXml(result.rows));
        }
        catch(err) {
            console.log(err);
            response.json({
                state: 'error',
                message: err
            });
        }
    },
    guardarUsuario:  (req,res) => {
        const {accion,usuario,alias,nombre,email,telefono,edad} = req.body;
        oracledb.getConnection(dbParams,(err, conn) => {
            if (err){
                console.log(err);
                return;
            }
            const query = "call pack_new_sushy.sp_grabar_usuario (:x_accion,:x_co_usuario,:x_de_alias,:x_de_nombre,:x_de_email,:x_de_telefono,:x_nu_edad,:x_result,:x_de_result)";
            
            const params = {
                x_accion: { val: accion},
                x_co_usuario: { val: usuario },
                x_de_alias: { val: alias },
                x_de_nombre: { val: nombre },
                x_de_email: { val: email },
                x_de_telefono: { val: telefono },
                x_nu_edad: { val: edad },
                //parametros de salida
                x_result : {dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                x_de_result : { dir: oracledb.BIND_OUT, type: oracledb.STRING },
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

    cargarDatosUsuario: (req, res) => {
        const { usuario } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                res.json({
                    state: 'error',
                    message: error.Error
                });
                return;
            }
            //
            const query = "select DE_NOMBRE,DE_EMAIL,DE_TELEFONO,NU_EDAD,CO_USUARIO,DE_ALIAS from table(pack_new_sushy.f_list_usuario_by_id(:x_co_usuario))";
            const params = {
                x_co_usuario: { val: usuario }
            };
            conn.execute(query, params, responseParams, (error, result) => {                
                
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

    eliminarUsuario: (req, res) => {
        const { usuario } = req.body;
              
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                console.error(err);
                
                return;
            }
            const query = "call pack_new_sushy.SP_ELIMINAR_USUARIO(:x_co_usuario,:x_result,:x_de_result)";
            const params = {
                x_co_usuario: { val: usuario },
                //parametros de salida
                x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                x_de_result: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            };           

            conn.execute(query, params, responseParams, (error, result) => {
                if(error) {
                    conn.close();
                    return;
                }
                const { x_result, x_de_result } = result.outBinds;
                if(x_result == 1) {
                    res.json({
                        state: 'success',
                        message: x_de_result
                    });
                }
                else {
                    res.json({
                        state: 'error',
                        message: x_de_result
                    });
                }
            });
        });
        //
    }
}

module.exports = co0201Controller;