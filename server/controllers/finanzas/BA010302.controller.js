const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');

const responseParams = {
    outFormat: oracledb.OBJECT
};

const ba010302Controller = {
    listaCajas: (req, res) => {
        const { empresa } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                console.error(err);
                return;
            }
            const query = "select co_caja id,de_caja,de_moneda,co_libro,de_libro,co_cuenta,es_vigencia,to_char(fe_registro,'dd/mm/yyyy') from table(pack_new_finanzas_no_tocar.f_list_cajas(:p_empresa))";
            const params = {
                p_empresa: { val: empresa }
            };
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    console.error(error);
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderXml(result.rows));
            });
        });
    },
    listaFondos: (request,response) => {
        const { empresa, caja } = request.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                console.error(err);
                return;
            }
            const query = "select co_fondo,de_fondo,co_caja,de_moneda,im_disponible,st_cerrado,co_responsable,de_responsable,co_cuenta,co_ccosto,de_ccosto from table(pack_new_finanzas_no_tocar.f_list_fondo_fijo(:p_empresa,:p_caja))";
            const params = {
                p_empresa: { val: empresa },
                p_caja: { val: caja }
            };
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    console.error(error);
                    conn.close();
                    return;
                }
                response.set('Content-Type', 'text/xml');
                response.send(xmlParser.renderXml(result.rows));
            });
        });
    },
    fondoDetalle: (request, response) => {
        const { empresa, fondo } = request.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                console.error(err);
                return;
            }
            const query = "select co_fondo_fijo,nu_fondo_fijo,to_char(fe_inicio,'dd/mm/yyyy'),im_inicial,im_ingreso,im_egreso,im_saldo,es_vigencia,to_char(fe_cierre,'dd/mm/yyyy') from table(pack_new_finanzas_no_tocar.f_list_fondo_detalle(:p_empresa,:p_fondo))";
            const params = {
                p_empresa: { val: empresa },
                p_fondo: { val: fondo }
            };
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    console.error(error);
                    conn.close();
                    return;
                }
                response.set('Content-Type', 'text/xml');
                response.send(xmlParser.renderXml(result.rows));
            });
        });
    },
    fondoMovimientos: (request, response) => {
        const { empresa, fondo, numero } = request.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                console.error(err);
                return;
            }
            const query = "select * from table(pack_new_finanzas_no_tocar.f_list_fondo_movimiento(:p_empresa,:p_fondo,:p_numero))";
            const params = {
                p_empresa: { val: empresa },
                p_fondo: { val: fondo },
                p_numero: { val: numero }
            };
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    console.error(error);
                    conn.close();
                    return;
                }
                response.set('Content-Type', 'text/xml');
                response.send(xmlParser.renderXml(result.rows));
            });
        });
    }
};

module.exports = ba010302Controller;
