const xmlParser = require('./../../xml-parser');
const db = require('./../../libs/db-oracle');
const { response, request } = require('express');

const co010401BController = {
    ComboPeriodos: async (request, response) => {
        const { empresa } = request.params;
        let params = [
            { name: 'empresa', value: empresa }
        ];
        let result = await db.select('select co_periodo "value", de_nombre "text" from ma_peri_m where fe_primer_dia < sysdate and nu_mes <> 0 and co_empresa = :empresa order by co_periodo desc', params);
        result.rows.unshift({ value: 0, text: '- Periodo -' });
        response.json({
            options: result.rows
        });
    },
    ComboLibros: async (request, response) => {
        const { periodo, alias } = request.body;
        let query = "call pack_fix_temp_ma_empr.sp_libros_contables(:alias, :periodo, :rs)";
        let params = [
            { name: 'alias', io: 'in', value: alias },
            { name: 'periodo', io: 'in', value: periodo },
            { name: 'rs', io: 'out', type: 'cursor' }
        ];
        let result = await db.resultSet(query, params);
        let options = [];
        for (let row of result.rs) {
            options.push({
                value: row.id + '',
                text: {
                    codigo: row.codigo,
                    libro: row.libro,
                    cantidad: row.cantidad + '',
                    id: row.id + '',
                    cerrado: row.cerrado
                }
            });
        }
        let out = {
            template: {
                input: "#libro#",
                columns: [
                    { header: "Código", width: 60, css: "codigo", option: "#codigo#" },
                    { header: "Libro", width: 160, css: "libro", option: "#libro#" },
                    { header: "Cantidad", width: 60, css: "cantidad", option: "#cantidad#" },
                    { header: "ID", width: 60, css: "id", option: "#id#" },
                    { header: "Cerrado", width: 60, css: "cerrado", option: "<img src='/assets/images/icons/grid/#cerrado#' border='0' style='margin-top: 4px; margin-left: 2px;'>" }
                ]
            },
            options: options
        };
        response.json(out);
    },
    InfoListaVouchers: async (request, response) => {
        const { empresa, periodo, libro } = request.body;
        let query = 'select nu_voucher "voucher", co_documento "documento", im_importe_total "importe" from table(pack_new_conta_voucher.f_list_vouchers(:empresa, :periodo, :libro))';
        let params = [
            { name: 'empresa', value: empresa },
            { name: 'periodo', value: periodo },
            { name: 'libro', value: libro }
        ];
        let result = await db.select(query, params);
        let dataVouchers = [];
        /*
        let ulvoucher = 0;
        if (result.rows.length > 0) {
            ulvoucher = parseInt(result.rows[0].voucher);
        }
        */
        for (let row of result.rows) {
            dataVouchers.push({
                value: row.voucher,
                text: {
                    voucher: row.voucher + '',
                    documento: row.documento,
                    importe: row.importe.toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                }
            });
            // ulvoucher = parseInt(row.voucher);
        }
        // genera el combo de vouchers
        let vouchers = {
            template: {
                input: '#voucher#',
                columns: [
                    { header: "Voucher", width: 50, css: 'voucher', option: '#voucher#' },
                    { header: "Documento", width: 200, css: 'documento', option: '#documento#' },
                    { header: "Importe", width: 100, css: 'importe', option: '#importe#' }
                ]
            },
            options: dataVouchers
        };
        // carga la data del ultimo voucher
        /*
        let informacion;
        if (ulvoucher > 0) {
            query = "select co_prin_voucher, nu_voucher, co_tipo_doc_administr, co_serie, de_serie, nu_documento, co_documento, to_char(fe_ingreso,'dd/mm/yyyy') fe_ingreso, co_moneda, nu_conversion_final, es_vigencia, to_char(fe_vencimiento,'dd/mm/yyyy') fe_vencimiento, co_tipo_entidad, co_catalogo_entidad, nu_documento_entidad, de_catalogo_entidad, st_modificado, st_formato, co_cuenta_documento, de_cuenta_documento_obs, st_gasto, co_ingreso_gasto, co_categ_ingreso_gasto, de_ingreso_gasto_det, co_cuenta_gasto, co_catal_prespuesto, de_glosa, im_importe_total, im_inafecto, st_banco, de_banco, co_banco, co_pais, co_cuenta_corriente, de_cuenta_corriente, co_transa_bancaria_tran, st_detraccion, co_documento_detraccion, fe_documento_detraccion, im_monto_detraccion, st_ccosto_dif, im_diferencia, st_percepcion, co_documento_percepcion, nu_porcentaje_percepcion, im_percibido_percepcion, st_centro_costo_dif, de_usuario_reg, to_char(fe_usuario_reg,'dd/mm/yyyy hh24:mi') fe_usuario_reg, de_usuario_upd, to_char(fe_usuario_upd,'dd/mm/yyyy') fe_usuario_upd, co_tipo_doc_ide, de_cuenta_documento from table(pack_new_conta_voucher.f_list_voucher_cab(:empresa, :periodo, :libro, :voucher))";
            params = [
                { name: 'empresa', value: empresa },
                { name: 'periodo', value: periodo },
                { name: 'libro', value: libro },
                { name: 'voucher', value: ulvoucher }
            ];
            result = await db.select(query, params);
            if (result.rows.length > 0) {
                informacion = result.rows[0];
            }
            else {
                informacion = null;
            }
        }
        else {
            informacion = null;
        }
        */
        response.json({
            vouchers: vouchers/*,
            informacion: informacion*/
        });
    },
    InformacionVoucher: async (request, response) => {
        const { empresa, periodo, libro, voucher } = request.body;
        let query = "select co_prin_voucher, nu_voucher, co_tipo_doc_administr, co_serie, de_serie, nu_documento, co_documento, to_char(fe_ingreso,'dd/mm/yyyy') fe_ingreso, co_moneda, nu_conversion_final, es_vigencia, to_char(fe_vencimiento,'dd/mm/yyyy') fe_vencimiento, co_tipo_entidad, co_catalogo_entidad, nu_documento_entidad, de_catalogo_entidad, st_modificado, st_formato, co_cuenta_documento, de_cuenta_documento_obs, st_gasto, co_ingreso_gasto, co_categ_ingreso_gasto, de_ingreso_gasto_det, co_cuenta_gasto, co_catal_prespuesto, de_glosa, im_importe_total, im_inafecto, st_banco, de_banco, co_banco, co_pais, co_cuenta_corriente, de_cuenta_corriente, co_transa_bancaria_tran, st_detraccion, co_documento_detraccion, fe_documento_detraccion, im_monto_detraccion, st_ccosto_dif, im_diferencia, st_percepcion, co_documento_percepcion, nu_porcentaje_percepcion, im_percibido_percepcion, st_centro_costo_dif, de_usuario_reg, to_char(fe_usuario_reg,'dd/mm/yyyy hh24:mi') fe_usuario_reg, de_usuario_upd, to_char(fe_usuario_upd,'dd/mm/yyyy') fe_usuario_upd, co_tipo_doc_ide, de_cuenta_documento from table(pack_new_conta_voucher.f_list_voucher_cab(:empresa, :periodo, :libro, :voucher))";
        let params = [
            { name: 'empresa', value: empresa },
            { name: 'periodo', value: periodo },
            { name: 'libro', value: libro },
            { name: 'voucher', value: voucher }
        ];
        let result = await db.select(query, params);
        let informacion;
        if (result.rows.length > 0) {
            informacion = result.rows[0];
        }
        else {
            informacion = null;
        }
        response.json({
            informacion: informacion
        });
    },
    ListaVouchers: async (request, response) => {
        const { empresa, periodo, libro, voucher } = request.params;
        let query = "select case st_cuenta_destino when 'S' then 'ic-checked.gif' else 'ic-unchecked.gif' end,co_cuenta,de_cuenta,im_debe,im_haber,case st_cuenta_corriente when 'S' then 'ic-checked.gif' else 'ic-unchecked.gif' end,de_blanco_doc,co_documento,de_tipo_docu_admi,co_cuenta_padre,de_moneda,im_tipo_cambio,case st_manual when 'S' then 'ic-checked.gif' else 'ic-unchecked.gif' end,co_catalogo_entidad,de_catalogo_entidad,co_tipo_entidad,to_char(fe_registro,'dd/mm/yyyy') fe_registro,co_voucher,de_glosa_detalle,co_cond_tributaria from table(pack_new_conta_voucher.f_list_voucher_det(:empresa,:periodo,:libro,:voucher))";
        let params = [
            { name: 'empresa', value: empresa },
            { name: 'periodo', value: periodo },
            { name: 'libro', value: libro },
            { name: 'voucher', value: voucher }
        ];
        let result = await db.select(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderXml(result.rows));
    },
    ListaTiposDoc: async (request, response) => {
        const { empresa } = request.params;
        let query = "select 1,de_tipo_docu_admi,co_tipo_docu_admi ID from table(pack_new_conta_voucher.f_list_tipo_docu_docu(:empresa))";
        let params = [
            { name: 'empresa', value: empresa }
        ];
        let result = await db.select(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderXml(result.rows));
    },
    ListaBuscaVoucher: async (request, response) => {
        let { empresa, opcion, voucher, desde, hasta, documento, tipos } = request.params;
        let cadena = '';
        switch (opcion) {
            case '1':
                cadena = voucher;
                break;
            case '2':
                cadena = '';
                break;
            case '3':
                cadena = documento;
                break;
            default: break;
        }
        let query = "select de_voucher,to_char(fe_emision,'dd/mm/yyyy'),de_documento,de_tipo_docu,de_moneda,im_tipo_cambio,de_ruc,de_razon_social,to_char(fe_usuario_reg,'dd/mm/yyyy'),de_usuario_reg from table(pack_new_conta_voucher.f_list_tipo_vouc_find(:empresa,:opcion,:cadena,to_date('" + desde + "','dd/mm/yyyy'),to_date('" + hasta + "','dd/mm/yyyy'))) where co_tipo_docu in ('" + tipos.replace(/,/g, "','") + "')";
        let params = [
            { name: 'empresa', value: empresa },
            { name: 'opcion', value: opcion },
            { name: 'cadena', value: cadena }
        ];
        let result = await db.select(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderXml(result.rows));
    },
    GridResumenLibros: async (request, response) => {
        let { empresa } = request.params;
        let query = "select * from table(pack_new_conta_voucher.f_list_libr_cont_c(:empresa))";
        let params = [
            { name: 'empresa', value: empresa }
        ];
        let result = await db.select(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderXml(result.rows));
    },
    GridResumenVouchers: async (request, response) => {
        let { empresa, desde, hasta, libros } = request.params;
        let query = "select es_vigencia,co_prin_voucher,co_libro_contable,de_libro_contable,co_periodo,nu_voucher,to_char(fe_registro,'dd/mm/yyyy'),to_char(fe_vencimiento,'dd/mm/yyyy'),co_tipo_doc_administr,de_tipo_doc_administr,co_moneda,de_moneda,im_tipo_cambio,co_documento,im_total,im_inafecto,de_glosa,co_tipo_entidad,de_tipo_entidad,nu_documento,de_razon_social,case st_formato when 'S' then 'ic-checked.gif' else 'ic-unchecked.gif' end,co_cuenta_documento,de_cuenta_documento,de_cuenta_documento_obs,case st_detraccion when 'S' then 'ic-checked.gif' else 'ic-unchecked.gif' end,co_documento_detraccion,to_char(fe_documento_detraccion,'dd/mm/yyyy'),im_monto_detraccion,case st_percepcion when 'S' then 'ic-checked.gif' else 'ic-unchecked.gif' end,co_documento_percepcion,im_percibido_percepcion,nu_porcentaje_percepcion,case st_banco when 'S' then 'ic-checked.gif' else 'ic-unchecked.gif' end,de_banco,co_cuenta_corriente,de_cuenta_corriente,co_transa_bancaria_tran,case st_gasto when 'S' then 'ic-checked.gif' else 'ic-unchecked.gif' end,co_categ_ingreso_gasto,de_categ_ingreso_gasto,co_ingreso_gasto,de_ingreso_gasto,de_usuario_reg_cab,to_char(fe_reg_cab,'dd/mm/yyyy'),co_cuenta,de_cuenta,case st_cuenta_destino when 'S' then 'ic-checked.gif' else 'ic-unchecked.gif' end,case st_manual when 'S' then 'ic-checked.gif' else 'ic-unchecked.gif' end,im_debe,im_haber,co_documento_det,co_tipo_doc_administr_det,de_tipo_doc_administr_det,de_moneda_det,im_tipo_cambio_det,co_tipo_entidad_det,de_tipo_entidad_det,de_razon_social_det,id_cond_tribu,de_cond_tribu,de_glosa_det,de_usuario_upd_det,to_char(fe_upd_det,'dd/mm/yyyy') from table (pack_new_conta_voucher.f_list_voucher_res(:empresa,to_date(:desde,'dd/mm/yyyy'),to_date(:hasta,'dd/mm/yyyy'))) where co_libro_contable in (" + libros + ")";
        let params = [
            { name: 'empresa', value: empresa },
            { name: 'desde', value: desde },
            { name: 'hasta', value: hasta }
        ];
        let result = await db.select(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderXml(result.rows));
    },
    GridAdjuntosVoucher: async (request, response) => {
        let { empresa, periodo, libro } = request.params;
        let query = "select co_periodo,nu_voucher,co_documento,de_glosa,de_moneda,im_tipo_cambio,im_total,case st_file_pdf when 'S' then 'ic-checked.gif' else 'ic-unchecked.gif' end st_file_pdf,'ic-goggles.svg^Ver' btn_pdf,case st_file_xml when 'S' then 'ic-checked.gif' else 'ic-unchecked.gif' end st_file_xml,'ic-goggles.svg^Ver' btn_xml,to_char(fe_file_reg,'dd/mm/yyyy'),de_usu_reg_voucher_cab,to_char(fe_reg_voucher_cab,'dd/mm/yyyy'),de_usu_upd_voucher_cab,to_char(fe_upd_voucher_cab,'dd/mm/yyyy'),de_ruta_file_pdf,de_ruta_file_xml,co_libro_contable,co_proveedor,co_tipo_docu_administr from table(pack_new_conta_voucher.f_lis_reg_comp_voucher_file(:empresa,:libro,:periodo))";
        let params = [
            { name: 'empresa', value: empresa },
            { name: 'libro', value: libro },
            { name: 'periodo', value: periodo }
        ];
        let result = await db.select(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderXml(result.rows));
    }
};

module.exports = co010401BController;