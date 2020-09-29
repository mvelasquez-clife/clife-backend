const xmlParser = require('./../../xml-parser');
const db = require('./../../libs/db-oracle');
const { resultSet } = require('./../../libs/db-oracle');
const { response } = require('express');

const co010401BController = {
    ComboPeriodos: async (request, response) => {
        const { empresa } = request.params;
        let params = [
            { name: 'empresa', value: empresa }
        ];
        let result = await db.select('select co_periodo "value", de_nombre "text", case es_vigencia when \'Vigente\' then \'ic-unlocked.svg\' else \'ic-locked.svg\' end "img", case es_vigencia when \'Vigente\' then \'ic-unlocked-dis.svg\' else \'ic-locked-dis.svg\' end "img_dis" from ma_peri_m where fe_primer_dia < sysdate and nu_mes <> 0 and co_empresa = :empresa order by co_periodo desc', params);
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
                    icono: row.icono,
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
                    { header: "&nbsp;", width: 40, css: "icono", option: "<img src='/assets/images/icons/toolbar/#icono#' border='0' style='margin-top: 4px;'>" },
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
        const { empresa, periodo, libro, usuario } = request.body;
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
        query = "select * from table(pack_new_conta_voucher.f_lis_bloqueos_x_lc(:p_empresa,:p_usuario,:p_libro))";
        params = [
            { name: 'p_empresa', value: empresa },
            { name: 'p_usuario', value: usuario },
            { name: 'p_libro', value: libro }
        ];
        result = await db.select(query, params);
        var restricciones = false;
        if (result.rows.length > 0) {
            restricciones = result.rows[0];
            response.json({
                vouchers: vouchers,
                restricciones: restricciones
            });
        }
        else {
            response.json({
                vouchers: vouchers
            });
        }
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
    },
    guardaDetalleVoucher: async(request, response) => {
        const { empresa, usuario, periodo, libro, voucher, filas, acciones, cuentas, vouchers, debe, haber, glosas, condtribs, alias, eliminar } = request.body;
        let query, params, result, resupd;
        if (filas > 0) {
            query = "call pack_new_conta_voucher.sp_grabar_det_voucher(:codigo,:mensaje,:empresa,:usuario,:periodo,:libro,:voucher,:filas,to_clob(:acciones),to_clob(:cuentas),to_clob(:vouchers),to_clob(:debe),to_clob(:haber),to_clob(:glosas),to_clob(:condtribs))";
            params = [
                { name: 'codigo', io: 'out', type: 'number' },
                { name: 'mensaje', io: 'out', type: 'string' },
                { name: 'empresa', io: 'in', value: empresa },
                { name: 'usuario', io: 'in', value: usuario },
                { name: 'periodo', io: 'in', value: periodo },
                { name: 'libro', io: 'in', value: libro },
                { name: 'voucher', io: 'in', value: voucher },
                { name: 'filas', io: 'in', value: filas },
                { name: 'acciones', io: 'in', value: acciones },
                { name: 'cuentas', io: 'in', value: cuentas },
                { name: 'vouchers', io: 'in', value: vouchers },
                { name: 'debe', io: 'in', value: debe },
                { name: 'haber', io: 'in', value: haber },
                { name: 'glosas', io: 'in', value: glosas },
                { name: 'condtribs', io: 'in', value: condtribs }
            ];
            resupd = await db.resultSet(query, params);
        }
        else {
            resupd = {
                codigo: 1,
                mensaje: 'Filas eliminadas'
            };
        }
        if (eliminar != '') {
            var rowsEliminar = eliminar.split('@');
            var numEliminar = rowsEliminar.length;
            query = "call pack_new_conta_voucher.sp_eliminar_det_voucher(:codigo,:mensaje,:empresa,:usuario,:periodo,:libro,:voucher,:covoucher)";
// x_empresa number,x_usuario number,x_periodo number,x_libro_contable number,x_nu_voucher number,x_co_voucher
            for (var i = 0; i < numEliminar; i++) {
                var iVoucher = rowsEliminar[i];
                params = [
                    { name: 'codigo', io: 'out', type: 'number' },
                    { name: 'mensaje', io: 'out', type: 'string' },
                    { name: 'empresa', io: 'in', value: empresa },
                    { name: 'usuario', io: 'in', value: usuario },
                    { name: 'periodo', io: 'in', value: periodo },
                    { name: 'libro', io: 'in', value: libro },
                    { name: 'voucher', io: 'in', value: voucher },
                    { name: 'covoucher', io: 'in', value: iVoucher }
                ];
                result = await db.statement(query, params);
            }
        }
        return response.json({
            codigo: resupd.codigo,
            mensaje: resupd.mensaje
        });
    },
    ComboMoneda: async (request, response) => {
        let query = 'select co_moneda as "value", de_nombre as "text" from ma_mone_m order by co_moneda asc';
        let params = [];
        let result = await db.select(query, params);
        return response.json({
            options: result.rows
        });
    },
    ComboTipoDocAdmin: async (request, response) => {
        const { libro } = request.params;
        let query = 'select co_tipo_docu_admi "codigo", de_tipo_docu_admi "tipo" from table(pack_new_conta_voucher.f_list_tipo_docu_voucher(:p_libro))';
        let params = [
            { name: 'p_libro', io: 'in', value: libro }
        ];
        let result = await db.select(query, params);
        let options = [];
        for (let row of result.rows) {
            options.push({
                value: row.codigo + '',
                text: {
                    descripcion: row.tipo,
                    codigo: row.codigo
                }
            });
        }
        let out = {
            template: {
                input: "#descripcion#",
                columns: [
                    { header: "Tipo Doc. Admin.", width: 240, css: "descripcion", option: "#descripcion#" },
                    { header: "ID", width: 60, css: "codigo", option: "#codigo#" }
                ]
            },
            options: options
        };
        response.json(out);
    },
    ComboTipoEntidad: async (request, response) => {
        const { libro } = request.params;
        let query = 'select co_tipo_entidad "codigo", de_tipo_entidad "descripcion" from table(pack_new_conta_voucher.f_list_tipo_enti_voucher(:p_libro))';
        let params = [
            { name: 'p_libro', io: 'in', value: libro }
        ];
        let result = await db.select(query, params);
        let options = [];
        for (let row of result.rows) {
            options.push({
                value: row.codigo + '',
                text: {
                    descripcion: row.descripcion,
                    codigo: row.codigo + ''
                }
            });
        }
        let out = {
            template: {
                input: "#descripcion#",
                columns: [
                    { header: "Tipo Entidad", width: 160, css: "descripcion", option: "#descripcion#" },
                    { header: "ID", width: 40, css: "codigo", option: "#codigo#" }
                ]
            },
            options: options
        };
        response.json(out);
    },
    ComboTipoDocIden: async (request, response) => {
        const { libro } = request.params;
        let query = 'select co_tipo_docu_ide "value", de_tipo_docu_ide "text" from table(pack_new_conta_voucher.f_list_tipo_docu_enti)';
        let params = [];
        let result = await db.select(query, params);
        response.json({
            options: result.rows
        });
    },
    ValidaNuevoVoucher: async (request, response) => {
        const { empresa, usuario, periodo, libro } = request.body;
        let query = "call pack_new_conta_voucher.sp_new_voucher_valid(:empresa, :usuario, :periodo, :libro, :o_codigo, :o_mensaje)";
        let params = [
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'usuario', io: 'in', value: usuario },
            { name: 'periodo', io: 'in', value: periodo },
            { name: 'libro', io: 'in', value: libro },
            { name: 'o_codigo', io: 'out', type: 'number' },
            { name: 'o_mensaje', io: 'out', type: 'string' }
        ];
        let result = await db.statement(query, params);
        if (result.o_codigo == 0) {
            return response.json({
                error: result.o_mensaje
            });
        }
        query = "select ST_FORMATO,NU_VOUCHER_NEXT,CO_MONEDA_EMPR,CO_CONVERSION,IM_TIPO_CAMBIO,DE_COLUMN_TIPO_DOCU_DEF,DE_COLUMN_TIPO_ENTI_DEF,DE_FOCUS_COLUMN,to_char(FE_SERVIDOR,'dd/mm/yyyy') FE_SERVIDOR from table(pack_new_conta_voucher.f_list_new_vouch_param(:empresa,:usuario,:periodo,:libro))";
        params = [
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'usuario', io: 'in', value: usuario },
            { name: 'periodo', io: 'in', value: periodo },
            { name: 'libro', io: 'in', value: libro }
        ];
        result = await db.select(query, params);
        if (result.rows.length == 0) {
            return response.json({
                error: 'No existen valores válidos para su solicitud'
            });
        }
        return response.json({
            data: result.rows[0]
        });
    },
    GrabarVoucher: async (request, response) => {
        let { empresa, usuario, periodo, libro, voucher, accion, tpdocadmin, coserie, deserie, numero, documento, fingreso, moneda, tpcambio, vigencia,
            fvencimiento, tpentidad, catalenti, formato, ctadocumento, esgasto, coingasto, categingasto, cuentagasto, catalpres, glosa, imtotal, iminafecto,
            esbanco, cobanco, copais, coctacte, cotrsbancaria, esdetraccion, docdetra, fdetra, imdetra, esccostodif, espercepcion, docpercep, porcpercep,
            impercep } = request.body;
        fingreso = fingreso ? fingreso : '01/01/1900';
        if (fingreso.indexOf(' ') > -1) {
            fingreso = fingreso.split(' ')[0];
        }
        // if (fingreso.indexOf(' ') == -1) fingreso = fingreso + ' 00:00';
        fvencimiento = fvencimiento ? fvencimiento : '01/01/1900';
        if (fvencimiento.indexOf(' ') > -1) {
            fvencimiento = fvencimiento.split(' ')[0];
        }
        // if (fvencimiento.indexOf(' ') == -1) fvencimiento = fvencimiento + ' 00:00';
        fdetra = fdetra ? fdetra : '01/01/1900';
        if (fdetra.indexOf(' ') > -1) {
            fdetra = fdetra.split(' ')[0];
        }
        // if (fdetra.indexOf(' ') == -1) fdetra = fdetra + ' 00:00';
        // elimina las comas (si las hubiera)
        tpcambio = tpcambio.replace(/,/, '');
        imtotal = imtotal.replace(/,/, '');
        iminafecto = iminafecto.replace(/,/, '');
        imdetra = imdetra.replace(/,/, '');
        impercep = impercep.replace(/,/, '');
        // go!
        let query = "call pack_new_conta_voucher.sp_grabar_cab_voucher_web(:accion, :empresa, :usuario, :periodo, :libro_contable, :nu_voucher, :co_tipo_doc_administr, :co_serie, :de_serie, :nu_documento, :co_documento, :fe_ingreso, :co_moneda, :nu_conversion_final, :es_vigencia, :fe_vencimiento, :co_tipo_entidad, :co_catalogo_entidad, :st_formato, :co_cuenta_documento, :st_gasto, :co_ingreso_gasto, :co_categ_ingreso_gasto, :co_cuenta_gasto, :co_catal_prespuesto, :de_glosa, :im_importe_total, :im_inafecto, :st_banco, :co_banco, :co_pais, :co_cuenta_corriente, :co_transa_bancaria_tran, :st_detraccion, :co_documento_detraccion, :fe_documento_detraccion, :im_monto_detraccion, :st_ccosto_dif, :st_percepcion, :co_documento_percepcion, :nu_porcentaje_percepcion, :im_percibido_percepcion, :o_codigo, :o_mensaje)";
        let params = [
            { name: 'accion', io: 'in', value: accion },
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'usuario', io: 'in', value: usuario },
            { name: 'periodo', io: 'in', value: periodo },
            { name: 'libro_contable', io: 'in', value: libro },
            { name: 'nu_voucher', io: 'in', value: voucher },
            { name: 'co_tipo_doc_administr', io: 'in', value: tpdocadmin },
            { name: 'co_serie', io: 'in', value: coserie },
            { name: 'de_serie', io: 'in', value: deserie },
            { name: 'nu_documento', io: 'in', value: numero },
            { name: 'co_documento', io: 'in', value: documento },
            { name: 'fe_ingreso', io: 'in', value: fingreso },
            { name: 'co_moneda', io: 'in', value: moneda },
            { name: 'nu_conversion_final', io: 'in', value: tpcambio },
            { name: 'es_vigencia', io: 'in', value: vigencia },
            { name: 'fe_vencimiento', io: 'in', value: fvencimiento },
            { name: 'co_tipo_entidad', io: 'in', value: tpentidad },
            { name: 'co_catalogo_entidad', io: 'in', value: catalenti },
            { name: 'st_formato', io: 'in', value: formato },
            { name: 'co_cuenta_documento', io: 'in', value: ctadocumento },
            { name: 'st_gasto', io: 'in', value: esgasto },
            { name: 'co_ingreso_gasto', io: 'in', value: coingasto },
            { name: 'co_categ_ingreso_gasto', io: 'in', value: categingasto },
            { name: 'co_cuenta_gasto', io: 'in', value: cuentagasto },
            { name: 'co_catal_prespuesto', io: 'in', value: catalpres },
            { name: 'de_glosa', io: 'in', value: glosa },
            { name: 'im_importe_total', io: 'in', value: imtotal },
            { name: 'im_inafecto', io: 'in', value: iminafecto },
            { name: 'st_banco', io: 'in', value: esbanco },
            { name: 'co_banco', io: 'in', value: cobanco },
            { name: 'co_pais', io: 'in', value: copais },
            { name: 'co_cuenta_corriente', io: 'in', value: coctacte },
            { name: 'co_transa_bancaria_tran', io: 'in', value: cotrsbancaria },
            { name: 'st_detraccion', io: 'in', value: esdetraccion },
            { name: 'co_documento_detraccion', io: 'in', value: docdetra },
            { name: 'fe_documento_detraccion', io: 'in', value: fdetra },
            { name: 'im_monto_detraccion', io: 'in', value: imdetra },
            { name: 'st_ccosto_dif', io: 'in', value: esccostodif },
            { name: 'st_percepcion', io: 'in', value: espercepcion },
            { name: 'co_documento_percepcion', io: 'in', value: docpercep },
            { name: 'nu_porcentaje_percepcion', io: 'in', value: porcpercep },
            { name: 'im_percibido_percepcion', io: 'in', value: impercep },
            { name: 'o_codigo', io: 'out', type: 'number' },
            { name: 'o_mensaje', io: 'out', type: 'string' }
        ];
console.log(query);
console.log(params);
        let result = await db.statement(query, params);
        console.log(result);
        if (result.out.o_codigo == 0) {
            response.json({
                error: result.out.o_mensaje
            });
        }
        else {
            response.json({
                mensaje: result.out.o_mensaje
            });
        }
    },
    CombosDetalleVoucher: async (request, response) => {
        const { libro } = request.body;
        let query, params, result;
        query = 'select co_tipo_entidad "value", de_tipo_entidad "text" from table(pack_new_conta_voucher.f_list_tipo_enti_voucher(:libro))';
        params = [
            { name: 'libro', io: 'in', value: libro }
        ];
        result = await db.select(query, params);
        let tipos = result.rows;
        // segundo query
        query = 'select co_cond_tributaria "value", de_cond_tributaria "text" from table(pack_new_conta_voucher.f_list_cond_tribu)';
        params = [];
        result = await db.select(query, params);
        let condiciones = result.rows;
        return response.json({
            data: {
                tipos: tipos,
                condiciones: condiciones
            }
        });
    }
};

module.exports = co010401BController;