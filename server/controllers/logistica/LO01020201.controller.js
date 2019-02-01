const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');

const responseParams = {
    outFormat: oracledb.OBJECT
};

const lo01020201Controller = {
    
    cargarListaOrdenes: (req, res) => {
        const { empresa, fdesde, fhasta } = req.params;
        //
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                console.error(err);
                return;
            }
            const query = "SELECT t1.co_orden_compra,  t1.fe_emision ,t1.co_proveedor, t2.de_razon_social,t1.co_forma_pago,t4.de_nombre,t1.co_condicion_pago, t3.de_nombre,  t1.co_moneda_final, t1.im_conversion,t1.es_vigencia,t1.es_orden, t5.co_catalogo_producto,t6.de_producto,  t8.de_nombre_prod_prov,t7.co_codigo_antiguo,t5.co_codigo_arte,t7.st_quim_fiscal, t9.de_nombre,t6.de_clase, t6.de_familia,t6.de_subfamilia, t6.de_marca,t6.de_submarca, t5.nu_cantidad,t10.de_nombre, t5.im_precio_unitario, t5.im_precio_final, t11.de_nombre, t12.fe_sys,t13.fe_entrega, t13.de_observaciones,t12.co_guia_prov, t14.co_file_fisico_compra_final,t14.st_letras_registradas, t14.st_perc_reg,t14.co_voucher_fk, CASE  t14.co_file_fisico_compra_final  WHEN   NULL  THEN '00' ELSE pack_compras.f_letra_registrada (t1.co_empresa, t14.co_file_fisico_compra_final) END  AS letra, CASE  t14.co_file_fisico_compra_final  WHEN   NULL  THEN '00' ELSE pack_compras.f_notacredito_reg_proveedores (t1.co_empresa, t14.co_file_fisico_compra_final,t1.co_proveedor,'07') END AS notacredito, CASE  t14.co_file_fisico_compra_final  WHEN   NULL  THEN '00' ELSE pack_compras.f_notacredito_reg_proveedores (t1.co_empresa, t14.co_file_fisico_compra_final,t1.co_proveedor,'08') END AS notadebito, t17.co_guia_devolucion AS guiadevolucion, t13.co_rep_analisis,t13.co_esp_analisis,t22.st_situacion ,t21.st_conclusion,t13.fe_vencimiento, t22.de_observaciones, t18.de_razon_social, t1.de_obs,t1.fe_anula FROM lo_orde_comp_c t1  JOIN ma_cata_enti_m t2 ON t1.co_proveedor= t2.co_catalogo_entidad JOIN ma_cond_pago_prov_m t3 ON t1.co_condicion_pago = t3.co_condicion_pago JOIN ma_form_pago_m t4 ON t1.co_forma_pago = t4.co_forma_pago JOIN lo_orde_comp_d t5  ON t5.co_orden_compra = t1.co_orden_compra AND t5.co_empresa = t1.co_empresa  JOIN v_catalogo_producto t6 ON t6.co_catalogo_producto = t5.co_catalogo_producto JOIN ma_cata_prod_m t7 ON t7.co_catalogo_producto = t5.co_catalogo_producto LEFT JOIN lo_abast_prod_m t8 ON t8.co_empresa = t5.co_empresa  AND t8.co_proveedor = t5.co_proveedor AND t8.co_catalogo_producto =  t5.co_catalogo_producto and  t8.co_moneda = t1.co_moneda_final LEFT JOIN ma_tipo_bien_serv_m t9 ON t9.co_clas_bien_serv = t1.co_clas_bien_serv AND t9.co_tipo_bien_serv= t1.co_tipo_bien_serv JOIN  ma_unid_medi_m  t10 ON t10.co_unidad_medida = t7.co_unidad_medida JOIN ma_tipo_tran_m t11 ON t11.co_tipo_transaccion = t1.co_tipo_transaccion LEFT JOIN lo_guia_prov_c t12 ON t12.co_empresa = t1.co_empresa AND t12.co_orden_compra= t1.co_orden_compra JOIN lo_guia_prov_lote_m t13 ON t13.co_empresa = t12.co_empresa AND t13.co_orden_compra= t12.co_orden_compra AND t13.co_guia_prov = t12.co_guia_prov  AND t13.co_catalogo_producto = t5.co_catalogo_producto AND t13.co_orden_compra_detalle= t5.co_orden_compra_detalle LEFT JOIN ma_file_fisi_comp_d ta ON ta.co_empresa = t13.co_empresa AND ta.co_orden_compra= t13.co_orden_compra AND ta.co_guia_prov= t13.co_guia_prov and ta.co_catalogo_producto= t13.co_catalogo_producto and ta.co_orden_compra_detalle= t13.co_orden_compra_detalle LEFT JOIN ma_file_fisi_comp_c t14 ON t14.co_empresa = ta.co_empresa and ta.co_file_fisico_compra_final = t14.co_file_fisico_compra_final AND t14.co_orden_compra= ta.co_orden_compra LEFT JOIN lo_guia_prov_devo_c t17 ON t12.co_empresa = t1.co_empresa AND t17.co_orden_compra = t1.co_orden_compra  left JOIN lo_guia_prov_devo_d  t20 ON t20.co_empresa = t17.co_empresa AND t20.co_guia_devolucion = t17.co_guia_devolucion AND t20.co_catalogo_producto = t5.co_catalogo_producto  and t20.co_lote = t5.co_lote and t20.co_orden_compra_detalle= t5.co_orden_compra_detalle LEFT JOIN ma_cata_enti_m t18 ON  t18.co_catalogo_entidad= t1.co_usuario_anula LEFT JOIN po_proto_analisis_prod_m t21 ON  t21.co_empresa = t13.co_empresa  AND t21.co_orden_compra = t13.co_orden_compra AND  t21.co_orden_prod = t13.co_guia_prov AND t21.co_catalogo_producto = t13.co_catalogo_producto AND t21.nu_lote = t13.co_lote LEFT JOIN po_proto_analisis_prod_c t22 ON t22.co_empresa= t21.co_empresa AND t22.nu_protocolo_analisis = t21.nu_protocolo_analisis WHERE t1.co_empresa = :p_empresa AND t1.fe_registro >= :p_fdesde  AND  t1.fe_registro  <= :p_fhasta order by t1.fe_emision desc";
            const params = { 
                p_empresa: { val: empresa },
                p_fdesde: { val: fdesde },
                p_fhasta: { val: fhasta }
            };
            conn.execute(query, params, responseParams, (error, result) => {
                if(error) {
                    console.error(error);
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderXml(result.rows));
            });
        });
    }
};

module.exports = lo01020201Controller;