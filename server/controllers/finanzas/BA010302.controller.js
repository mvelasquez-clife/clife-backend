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
            const query = "select '',case st_conta_aprob when 'S' then 'ic-checked.gif^Aprobado' else 'ic-unchecked.gif^Desaprobado' end,to_char(fe_movimiento,'dd/mm/yyyy'),co_documento,'ic-pedido.svg^Ver archivos',de_razon_social,im_ingreso,im_egreso,de_moneda,nu_tipo_cambio,im_original,de_concepto,co_cuenta_gasto,de_descripcion,st_contabi,st_imagen,co_periodo,co_empresa,co_libro_contable,st_tran_conta,co_prin_voucher,co_cuenta_documento,de_observaciones,co_categ_ingreso_gasto,co_ingreso_gasto,de_gasto,co_fondo_fijo,im_saldo,nu_fondo_fijo,co_clasificacion_entidad,co_tipo_entidad,co_catalogo_entidad,co_tipo_doc_administr,st_ingreso_egreso,co_catal_prespuesto,co_centro_costo_soli,co_usuario_soli,control,de_tipo,nu_documento,de_serie,co_form_documento,0 cero,co_moneda from table(pack_new_finanzas_no_tocar.f_list_fondo_movimiento(:p_empresa,:p_fondo,:p_numero))";
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
    },
    //
    datosFormEdicion: async (request, response) => {
        try {
            const conn = await oracledb.getConnection(dbParams);
            // cargar las categorias
            const queryCategIg = "select co_categ_ingreso_gasto \"value\",de_nombre \"text\" from co_cate_ingr_gast_m where es_vigencia = 'Vigente' and st_ing_gasto = 'S' order by de_nombre asc";
            let result = await conn.execute(queryCategIg, {}, responseParams);
            let categoriasig = result.rows;
            // cargar las monedas
            const queryMonedas = "select co_moneda \"value\",de_nombre \"text\" from ma_mone_m order by de_nombre asc";
            result = await conn.execute(queryMonedas, {}, responseParams);
            let monedas = result.rows;
            // escribe la salida
            response.json({
                data: {
                    categig: categoriasig,
                    monedas: monedas
                }
            });
        }
        catch (err) {
            response.json(err);
            console.error(err);
        }
    },
    listaIngresoGasto: async (request, response) => {
        const { empresa, categig } = request.params;
        let conn;
        try {
            conn = await oracledb.getConnection(dbParams);
            const query = "select 0 seleccion,de_gasto,case st_centro_costo when 'S' then 'ic-checked.gif^Si' else 'ic-unchecked.gif^No' end,co_cuenta_gasto,co_catal_prespuesto,de_nombre,de_descripcion,co_ingreso_gasto,co_categ_ingreso_gasto,co_driver_concepto from table(pack_new_finanzas_no_tocar.f_list_ingreso_gasto(:p_empresa,:p_categig))";
            const params = {
                p_empresa: { val: empresa },
                p_categig: { val: categig }
            };
            const result = await conn.execute(query, params, responseParams);
            response.set('Content-Type', 'text/xml');
            response.send(xmlParser.renderXml(result.rows));
        }
        catch (err) {
            console.error(err);
        }
    },
    listaCuentas: async (request, response) => {
        const { empresa, moneda } = request.params;
        let conn;
        try {
            conn = await oracledb.getConnection(dbParams);
            const query = "select 0 seleccion,t1.co_cuenta_documento,t1.de_descripcion,t1.co_moneda,t1.co_libro_contable from co_cuen_docu_c t1 where t1.co_empresa = :p_empresa and t1.co_moneda = :p_moneda";
            const params = {
                p_empresa: { val: empresa },
                p_moneda: { val: moneda }
            };
            const result = await conn.execute(query, params, responseParams);
            response.set('Content-Type', 'text/xml');
            response.send(xmlParser.renderXml(result.rows));
        }
        catch (err) {
            console.error(err);
        }
    }
};

module.exports = ba010302Controller;
