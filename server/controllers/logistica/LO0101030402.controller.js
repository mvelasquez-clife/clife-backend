const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');
const responseParams = {
    outFormat: oracledb.OBJECT,
    autoCommit: true
};

const lo0101030402Controller = {

    mostrarfiltro: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "SELECT NU_TIPO_FILTRO AS value,DE_TIPO_FILTRO AS label FROM TABLE(PACK_NEW_KARDEX.F_LIS_FILTRO_PROD())";
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
            const query = "select '0' AS value ,'--Seleccionar' AS label from dual union select co_filtro AS value ,de_filtro AS label from table(pack_new_kardex_2.f_lis_filtr_k2_ma)";
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
    mostrarsubmarca: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "select '0' AS value ,'--Seleccionar' AS label from dual union select co_filtro AS value ,de_filtro AS label from table(pack_new_kardex_2.f_lis_filtr_k2_sma)";
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

        const {empresa} = req.params;  

        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "select '0' AS value ,'--Seleccionar' AS label from dual union select co_filtro AS value ,de_filtro AS label from table(pack_new_kardex_2.f_lis_filtr_k2_cla(:x_empresa))";
            
            const params = {
                x_empresa  : {val : empresa}
            };

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
    mostrarfamilia: (req, res) => {

        const {empresa} = req.params;  

        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "select '0' AS value ,'--Seleccionar' AS label from dual union select co_filtro AS value,de_filtro AS label from table(pack_new_kardex_2.f_lis_filtr_k2_fam(:x_empresa))";
            
            const params = {
                x_empresa  : {val : empresa}
            };

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
    mostrarsubfamilia: (req, res) => {

        const {empresa} = req.params;

        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "select '0' AS value ,'--Seleccionar' AS label from dual union select co_filtro AS value,de_filtro AS label from table(pack_new_kardex_2.f_lis_filtr_k2_sfam(:x_empresa))";
            
            const params = {
                x_empresa  : {val : empresa}
            };

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
    mostrarperiodo: (req, res) => {

        const {empresa} = req.params;

        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "select '0' AS value ,'' AS label from dual union select co_filtro AS value,de_filtro AS label from table(pack_new_kardex_2.f_lis_filtr_k2_sfam(:x_empresa))";
            
            const params = {
                x_empresa  : {val : empresa}
            };

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
    mostraralmacen: (req, res) => {

        const {empresa} = req.params;

        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "select co_almacen AS value,de_almacen AS label from table(pack_new_kardex_2.f_lis_alma_k2(:x_empresa))";
            
            const params = {
                x_empresa  : {val : empresa}
            };

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
    mostrarperiodo: (req, res) => {

        const {empresa} = req.params;

        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "select co_periodo AS value,de_periodo AS label from table(pack_new_kardex_2.f_lis_peri_k2(:x_empresa))";
            
            const params = {
                x_empresa  : {val : empresa}
            };

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
    
    mostrarlistKardex: (req, res) => { 
         
        const {empresa,almacen,periodo,codprod,deprod,clase,familia,sfamilia,marca,smarca,barra} = req.params;  
        console.log(empresa,almacen,periodo,codprod,deprod,clase,familia,sfamilia,marca,smarca,barra);
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select de_clase,de_familia,de_subfamilia,de_marca,de_submarca,co_producto,de_producto,nu_inventario_inicial,nu_ingresos,nu_egresos,nu_cuarentena,nu_reservado,nu_saldo,nu_real,nu_saldo_pedido,nu_reservado_pedido,nu_fabricacion,co_clase,co_familia,co_subfamilia,co_marca,co_submarca from table(pack_new_kardex_2.f_lis_kardex_02_a(:x_empresa,:x_almacen,:x_periodo,:x_co_prod,:x_de_prod,:x_clase,:x_familia,:x_sfamilia,:x_marca,:x_smarca ,:x_barras))";
            
            const params = {
                x_empresa  : {val : empresa},
                x_almacen: {val : almacen},
                x_periodo: {val : periodo},
                x_co_prod: {val : null},
                x_de_prod: {val : deprod},
                x_clase: {val : null},
                x_familia: {val : null},
                x_sfamilia: {val : null},
                x_marca: {val : null},
                x_smarca: {val : null},
                x_barras: {val : null},
            };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    console.log(error);
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ de_clase: 'No se encontraron coincidencias' }]));
            });
        });
    },
    
}

module.exports = lo0101030402Controller;