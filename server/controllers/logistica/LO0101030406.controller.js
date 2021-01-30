const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');
const responseParams = {
    outFormat: oracledb.OBJECT,
    autoCommit: true
};

const lo0101030406Controller = {
    mostrarlistKardex: (req, res) => { 
         
        const {empresa,periodo} = req.params;  
        console.log(empresa,periodo);
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "select de_clase,de_familia,de_subfamilia,de_marca,de_submarca,co_producto,de_producto,nu_inventario_inicial,nu_ingresos,nu_egresos,nu_cuarentena,nu_reservado,nu_saldo,nu_real,nu_saldo_pedido,nu_reservado_pedido,nu_fabricacion,co_clase,co_familia,co_subfamilia,co_marca,co_submarca from table(PACK_NEW_KARDEX3.LIS_VIEW_KARDEX3(:x_empresa,:x_periodo))";
            
            const params = {
                x_empresa  : {val : empresa},
                x_periodo: {val : periodo},
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

module.exports = lo0101030406Controller;