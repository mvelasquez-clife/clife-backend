const oracledb = require('oracledb');
const dbParams = require('../database');
const o2x = require('object-to-xml');

const responseParams = {
    outFormat: oracledb.OBJECT
};

const ad010102Controller = {
    getData: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                console.error(err);
                return;
            }
            const query = "select 'N' as col1, ta.co_periodo as col2, t3.de_nombre as col3, '201234' as col4, '9' as col5, ta.co_catalogo_producto as col6, td.co_tipo_existencia as col7, '53000000' as col8, tb.fe_movimiento as col9, tb.co_tipo_transaccion as col10, tb.co_tipo_docu_1 as col11, tb.co_documento1 as col12, tb.co_tipo_docu_2 as col13, tb.co_documento2 as col14, tb.co_documento3 as col15, tb.co_voucher_fk as col16, ta.nu_ingreso as col17, ta.nu_egreso as col18, ta.im_compra as col19, ta.im_precio_promedio as col20, ta.nu_tipo_cambio as col21, ta.im_venta as col22, t2.co_clas_bien_serv as col23, t2.de_nombre as col24, td.co_tipo_bien_serv as col25, td.de_nombre as col26, tb.co_tipo_doc_administr as col27, tc.de_nombre as col28, tc.co_unidad_medida as col29, t1.de_nombre as col30, t1.co_unidad_sunat as col31, tc.co_unidad_medida_inventario as col32, ta.co_numero_mov as col33, tb.nu_numero_mov as col34, tb.co_proveedor as col35, t4.de_razon_social as col36, ta.st_visible as col37, tm.de_nombre as col38, tm.de_nombre as col39, ma.de_nombre as col40, sm.de_nombre as col41, tc.st_vta_promo as col42, ta.co_lote as col43, ta.fe_vencimiento as col44, ta.co_empresa as col45, ta.co_almacen as col46, ta.fe_ingr_inve as col47, case tb.co_tipo_transaccion when '05' then ta.nu_ingreso * ta.im_precio_promedio when '41' then ta.nu_ingreso * ta.im_precio_promedio else ta.nu_ingreso * ta.im_compra end as col48, case tb.co_tipo_transaccion when '06' then ta.nu_egreso * ta.im_venta else ta.nu_egreso * ta.im_precio_promedio end as col49 from lo_alma_lote_segu_ubic_m ta join lo_movi_c tb on ta.co_empresa= tb.co_empresa and ta.co_numero_mov = tb.co_numero_mov join ma_cata_prod_m tc on ta.co_catalogo_producto = tc.co_catalogo_producto join ma_tipo_bien_serv_m td on tc.co_tipo_bien_serv = td.co_tipo_bien_serv AND tc.co_clas_bien_serv = td.co_clas_bien_serv join ma_unid_medi_m t1 on tc.co_unidad_medida = t1.co_unidad_medida join ma_clas_bien_serv_m t2  on td.co_clas_bien_serv= t2.co_clas_bien_serv join ma_tipo_tran_m t3 on tb.co_tipo_transaccion = t3.co_tipo_transaccion join ma_sub_fami_m ts on ts.co_familia = tc.co_familia and ts.co_subfamilia = tc.co_subfamilia and  ts.co_clase= tc.co_clase join ma_fami_m tm on  ts.co_familia = tm.co_familia and ts.co_clase = tm.co_clase left join ma_sub_marc_m sm  on tc.co_marca = sm.co_marca and tc.co_submarca = sm.co_submarca left join ma_marc_m ma on sm.co_marca = ma.co_marca left join ma_cata_enti_m t4 on tb.co_proveedor = t4.co_catalogo_entidad where ta.co_empresa = 11 and ta.co_almacen = 'APT01' and ta.co_periodo = 201810 and not tb.co_tipo_transaccion in ('42','43')";
            const params = {  };
            conn.execute(query, params, responseParams, (error, result) => {
                if(error) {
                    console.error(error);
                    conn.close();
                    return;
                }
                //gg wp
                var arr = [];
                for(var i in result.rows) {
                    var iRow = result.rows[i];
                    var vCell = [];
                    for(var key in iRow) vCell.push(iRow[key]);
                    arr.push({
                        '@': { id: result.rows[i].CODIGO },
                        cell: vCell
                    });
                }
                res.set('Content-Type', 'text/xml');
                res.send(o2x({
                    '?xml version="1.0" encoding="utf-8"?' : null,
                    rows: {
                        row: arr
                    }
                }));
            });
        });
    }
};

module.exports = ad010102Controller;