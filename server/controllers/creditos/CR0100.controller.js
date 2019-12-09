const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');

const responseParams = {
    outFormat: oracledb.OBJECT
};

const cr0100Controller = {
    CargaFuerzasVenta: async (req, res) => {
        let { empresa } = req.params;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select co_fuerza_venta \"value\",de_nombre \"text\" from vt_fuer_vent_m where co_empresa = :p_empresa and es_fuerza = 'Vigente' order by de_nombre";
            let params = {
                p_empresa: { val: empresa }
            };
            let result = await conn.execute(query, params, responseParams);
            res.json({
                options: result.rows
            });
        }
        catch(err) {
            console.log(err);
            res.json({
                state: 'error',
                message: err
            });
        }
    },
    CargaCuentaCorriente: async (req, res) => {
        let { empresa, cliente, desde, hasta } = req.params;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select vencido,to_char(fregistro,'dd/mm/yyyy') fregistro,pedido,ic_pedido,to_char(fvencimiento,'dd/mm/yyyy') fvencimiento,documento,ic_factura,saldo,egreso,ingreso,ic_busca,ic_credito,tpdocadmin,vendedor,nomvendedor,factor_conversion,abreviatura,to_char(fvence,'dd/mm/yyyy') fvence,concepto,vigencia,periodo,moneda,fuerza_venta,nombre,recaudo,comoneda from table(pack_new_cuenta_corriente.f_cuenta_corriente(:p_empresa, :p_cliente, :p_desde, :p_hasta))";
            let params = {
                p_empresa: { val: empresa },
                p_cliente: { val: cliente },
                p_desde: { val: desde },
                p_hasta: { val: hasta }
            };
            let result = await conn.execute(query, params, responseParams);
            res.set('Content-Type', 'text/xml');
            res.send(xmlParser.renderXml(result.rows));
        }
        catch(err) {
            console.log(err);
            res.json({
                state: 'error',
                message: err
            });
        }
    },
    CargaPlanillasDocumento: async (req, res) => {
        let { empresa, cliente, documento, moneda } = req.params;
        moneda = 1;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select planilla,ic_detalle,tipocobro,importe,to_char(fecha,'dd/mm/yyyy') fecha,docpago,banco,cotipodoc from table(pack_new_cuenta_corriente.f_planillas_documento(:p_empresa, :p_cliente, :p_documento, :p_moneda))";
            let params = {
                p_empresa: { val: empresa },
                p_cliente: { val: cliente },
                p_documento: { val: documento },
                p_moneda: { val: moneda }
            };
            let result = await conn.execute(query, params, responseParams);
            res.set('Content-Type', 'text/xml');
            res.send(xmlParser.renderXml(result.rows));
        }
        catch(err) {
            console.log(err);
            res.json({
                state: 'error',
                message: err
            });
        }
    },
    CargaLetrasCheques: async (req, res) => {
        let { empresa, documento } = req.params;
        moneda = 1;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select coletra,to_char(fregistro,'dd/mm/yyyy') fregistro,subtotal,estado,coestado from table(pack_new_cuenta_corriente.f_letras_cheques(:p_empresa, :p_documento))";
            let params = {
                p_empresa: { val: empresa },
                p_documento: { val: documento }
            };
            let result = await conn.execute(query, params, responseParams);
            res.set('Content-Type', 'text/xml');
            res.send(xmlParser.renderXml(result.rows));
        }
        catch(err) {
            console.log(err);
            res.json({
                state: 'error',
                message: err
            });
        }
    },
    CargaNotasCreditoDebito: async (req, res) => {
        let { empresa, documento } = req.params;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select ic_estado,codigo,ic_documento,guia,importe,concepto,vigencia,to_char(fregistro,'dd/mm/yyyy') fregistro from table(pack_new_cuenta_corriente.f_notas_debcred(:p_empresa, :p_documento))";
            let params = {
                p_empresa: { val: empresa },
                p_documento: { val: documento }
            };
            let result = await conn.execute(query, params, responseParams);
            res.set('Content-Type', 'text/xml');
            res.send(xmlParser.renderXml(result.rows));
        }
        catch(err) {
            console.log(err);
            res.json({
                state: 'error',
                message: err
            });
        }
    },
    CargaListaLetras: async (req, res) => {
        let { empresa, cliente, desde, hasta } = req.params;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select co_letra_cliente,co_documento,de_moneda,im_monto,im_subtotal,im_saldo,to_char(fe_vencimiento,'dd/mm/yyyy') fe_vencimiento,st_mumero_unico,nu_control_banco,co_banco,to_char(fe_giro,'dd/mm/yyyy') fe_giro,co_garante,de_letra,co_cliente,co_condicion_pago_letra,co_caja,co_estado_letra,co_recaudador,co_usuario,co_representante,co_cargo_representante,to_char(fe_presentacion_banco,'dd/mm/yyyy') fe_presentacion_banco,to_char(fe_deposito,'dd/mm/yyyy') fe_deposito,to_char(fe_registro,'dd/mm/yyyy') fe_registro,es_vigencia,co_letra_banco,st_aprobada,co_pais,nu_descargos,co_empresa,st_seleccion,co_centro_costo,co_planilla_cobranza,co_moneda,co_conversion,co_moneda_referida,co_periodo,co_centro_costo_gasto,de_consolidado_documento,st_impreso,nu_impresiones,to_char(fe_abono,'dd/mm/yyyy') fe_abono,co_digitalizacion,co_control,de_motivo_rechazo,nu_deposito_letra,de_motivo_protesto,to_char(fe_protesto,'dd/mm/yyyy') fe_protesto,co_categ_ingreso_gasto,co_ingreso_gasto,im_gastos_bancarios,nu_deposito,to_char(fe_deposito_protesto,'dd/mm/yyyy') fe_deposito_protesto,nu_deposito_protesto,im_deposito_protesto,to_char(fe_anulacion,'dd/mm/yyyy') fe_anulacion,to_char(fe_cancelacion,'dd/mm/yyyy') fe_cancelacion from table(pack_new_cuenta_corriente.f_cliente_letras(:p_empresa, :p_cliente, :p_desde, :p_hasta))";
            let params = {
                p_empresa: { val: empresa },
                p_cliente: { val: cliente },
                p_desde: { val: desde },
                p_hasta: { val: hasta }
            };
            let result = await conn.execute(query, params, responseParams);
            res.set('Content-Type', 'text/xml');
            res.send(xmlParser.renderXml(result.rows));
        }
        catch(err) {
            console.log(err);
            res.json({
                state: 'error',
                message: err
            });
        }
    },
    CargaListaCheques: async (req, res) => {
        let { empresa, cliente } = req.params;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select co_cheque_cobrar,co_recaudador,de_recaudador,de_moneda,im_monto,im_saldo_cuenta,de_banco,de_estado,co_periodo,to_char(fe_presentacion_banco,'dd/mm/yyyy') fe_presentacion_banco,de_relacion_documentos,to_char(fe_deposito,'dd/mm/yyyy') fe_deposito,co_voucher,co_planilla_cobranza,co_caja,co_estado_cheque from table(pack_new_cuenta_corriente.f_cliente_cheques(:p_empresa, :p_cliente))";
            let params = {
                p_empresa: { val: empresa },
                p_cliente: { val: cliente }
            };
            let result = await conn.execute(query, params, responseParams);
            res.set('Content-Type', 'text/xml');
            res.send(xmlParser.renderXml(result.rows));
        }
        catch(err) {
            console.log(err);
            res.json({
                state: 'error',
                message: err
            });
        }
    },
    CargaSolicitudesCredito: async (req, res) => {
        let { empresa, cliente, desde, hasta } = req.params;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select co_cliente,de_razon_social,de_fzavta,de_moneda,im_solicitado,im_aprobado,to_char(fe_solicitud,'dd/mm/yyyy') fe_solicitud,es_vigencia,de_alias,to_char(fe_vigencia_credito,'dd/mm/yyyy') fe_vigencia_credito,de_observaciones_vendedor,de_observaciones_propias,co_usuario_autorizador,co_fuerza_venta,to_char(fe_autorizacion_credito,'dd/mm/yyyy') fe_autorizacion_credito,co_moneda,co_empresa,co_centro_costo,co_solicitud_credito from table(pack_new_cuenta_corriente.f_solicitudes_credito(:p_empresa, :p_cliente, :p_desde, :p_hasta))";
            let params = {
                p_empresa: { val: empresa },
                p_cliente: { val: cliente },
                p_desde: { val: desde },
                p_hasta: { val: hasta }
            };
            let result = await conn.execute(query, params, responseParams);
            res.set('Content-Type', 'text/xml');
            res.send(xmlParser.renderXml(result.rows));
        }
        catch(err) {
            console.log(err);
            res.json({
                state: 'error',
                message: err
            });
        }
    },
    CargaLineaCredito: async (req, res) => {
        let { empresa, cliente } = req.params;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select co_cliente,de_cliente,de_fuerza_venta,de_moneda,im_linea_credito,im_linea_credito_final,st_permanente,to_char(fe_registro,'dd/mm/yyyy'),to_char(fe_aprobacion_credito,'dd/mm/yyyy'),to_char(fe_asignacion,'dd/mm/yyyy'),es_vigencia,de_observacion_autoriza,de_observacion_solicita from table(pack_new_cuenta_corriente.f_linea_credito(:p_empresa, :p_cliente))";
            let params = {
                p_empresa: { val: empresa },
                p_cliente: { val: cliente }
            };
            let result = await conn.execute(query, params, responseParams);
            res.set('Content-Type', 'text/xml');
            res.send(xmlParser.renderXml(result.rows));
        }
        catch(err) {
            console.log(err);
            res.json({
                state: 'error',
                message: err
            });
        }
    },
    AsignarCreditoMasivo: async (req, res) => {
        let { alias } = req.body;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "call ventas_10.sp_calculo_linea_credito(:p_alias)";
            let params = {
                p_alias: { val: alias }
            };
            await conn.execute(query, params, responseParams);
            res.json({
                state: 'success'
            });
        }
        catch(err) {
            console.log(err);
            res.json({
                state: 'error',
                message: err
            });
        }
    },
    ListaDocumentosTransferencia: async (req, res) => {
        let { empresa, cliente } = req.params;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select * from table(pack_new_cuenta_corriente.f_documentos_transferencia(:p_empresa, :p_cliente))";
            let params = {
                p_empresa: { val: empresa },
                p_cliente: { val: cliente }
            };
            let result = await conn.execute(query, params, responseParams);
            res.set('Content-Type', 'text/xml');
            res.send(xmlParser.renderXml(result.rows));
        }
        catch(err) {
            console.log(err);
            res.json({
                state: 'error',
                message: err
            });
        }
    },
    TransfiereDocumentos: async (req, res) => {
        let { vendedor, cadena, cantidad } = req.body;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "call pack_creditos.sp_transferir_docus(:p_cadena,:p_vendedor,:p_cantidad)";
            let params = {
                p_cadena: { val: cadena } ,
                p_vendedor: { val: vendedor },
                p_cantidad: { val: cantidad }
            };
            await conn.execute(query, params, responseParams);
            res.json({
                state: 'success'
            });
        }
        catch(err) {
            console.log(err);
            res.json({
                state: 'error',
                message: err
            });
        }
    },
    CargarAuditoriaVendedor: async (req, res) => {
        let { empresa, vendedor, importe } = req.params;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select st_auditoria,to_char(fe_registro_factura,'dd/mm/yyyy') fe_registro_factura,de_tipo_doc_administr,co_documento,nu_ruc_dni,de_cliente,ic_datos,im_saldo,im_saldo_auditoria,de_obser,im_diferencia,de_usuario_aut,to_char(fe_fecha_act_audit,'dd/mm/yyyy') fe_fecha_act_audit,co_moneda from table(pack_new_cuenta_corriente.f_auditoria_vendedor(:p_empresa, :p_vendedor, :p_importe))";
            let params = {
                p_empresa: { val: empresa },
                p_vendedor: { val: vendedor },
                p_importe: { val: importe }
            };
            let result = await conn.execute(query, params, responseParams);
            res.set('Content-Type', 'text/xml');
            res.send(xmlParser.renderXml(result.rows));
        }
        catch(err) {
            console.log(err);
            res.json({
                state: 'error',
                message: err
            });
        }
    },
    TiposComunicacion: async (req, res) => {
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = 'select co_tipo_comunicacion "value",de_nombre "text" from ma_tipo_comu_m order by de_nombre asc';
            let params = {};
            let result = await conn.execute(query, params, responseParams);
            res.json({
                options: result.rows
            });
        }
        catch(err) {
            console.log(err);
            res.json({
                state: 'error',
                message: err
            });
        }
    },
    ListaContactos: async(req, res) => {
        let { cliente } = req.params;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select * from table(pack_new_cuenta_corriente.f_lista_contacto(:p_cliente))";
            let params = {
                p_cliente: { val: cliente }
            };
            let result = await conn.execute(query, params, responseParams);
            res.set('Content-Type', 'text/xml');
            res.send(xmlParser.renderXml(result.rows));
        }
        catch(err) {
            console.log(err);
            res.json({
                state: 'error',
                message: err
            });
        }
    },
    GuardaDatosContacto: async (req, res) => {
        let { modo, cliente, diferenciador, tipo, numero, estado } = req.body;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "call pack_new_cuenta_corriente.sp_guarda_contacto(:p_modo,:p_cliente,:p_tipo,:p_numero,:p_estado,:p_diferenciador,:o_resultado,:o_mensaje)";
            let params = {
                p_modo: { val: modo },
                p_cliente: { val: cliente },
                p_tipo: { val: tipo },
                p_numero: { val: numero },
                p_estado: { val: estado },
                p_diferenciador: { val: diferenciador },
                o_resultado: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_mensaje: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            };
            await conn.execute(query, params, responseParams);
            res.json({
                state: 'success'
            });
        }
        catch(err) {
            console.log(err);
            res.json({
                state: 'error',
                message: err
            });
        }
    },
    ConfirmarAuditoria: async (req, res) => {
        let { empresa, vendedor, clientes, filas } = req.body;
        try {
            let conn = await oracledb.getConnection(dbParams);
            for(let i = 0; i < filas; i++) {
                let { cliente, observaciones } = clientes[i];
                let query = "call pack_new_cuenta_corriente.sp_confirma_auditoria(:p_empresa,:p_vendedor,:p_cliente,:p_observaciones,:o_resultado,:o_mensaje)";
                let params = {
                    p_empresa: { val: empresa },
                    p_vendedor: { val: vendedor },
                    p_cliente: { val: cliente },
                    p_observaciones: { val: observaciones },
                    o_resultado: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                    o_mensaje: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
                };
                await conn.execute(query, params, responseParams);
            }
            res.json({
                state: 'success'
            });
        }
        catch(err) {
            console.log(err);
            res.json({
                state: 'error',
                message: err
            });
        }
    },
    CierraAuditoria: async (req, res) => {
        let { empresa, vendedor, monto, usuario, filas, cantidad } = req.body;
        try {
            let query = "call pack_new_cuenta_corriente.sp_auditoria_cabecera(:p_empresa,:p_vendedor,:p_monto,:p_usuario,:o_unico)";
            let params = {
                p_empresa: { val: empresa },
                p_vendedor: { val: vendedor },
                p_monto: { val: monto },
                p_usuario: { val: usuario },
                o_unico: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
            };
            let result = await conn.execute(query, params, responseParams);
            let { o_unico } = result.outBinds;
            for(let i = 0; i < cantidad; i++) {
                let { observaciones, cliente, moneda, documento, saldo, sauditoria, fauditoria } = filas[i];
                let query = "call pack_new_cuenta_corriente.sp_auditoria_detalle(:p_cliente,:p_moneda,:p_empresa,:p_documento,:p_unico,:p_saldo,:p_saldoaud,:p_fecha,:p_observaciones)";
                let params = {
                    p_cliente: { val: cliente },
                    p_moneda: { val: moneda },
                    p_empresa: { val: empresa },
                    p_documento: { val: documento },
                    p_unico: { val: o_unico },
                    p_saldo: { val: saldo },
                    p_saldoaud: { val: sauditoria },
                    p_fecha: { val: fauditoria },
                    p_observaciones: { val: observaciones }
                };
                await conn.execute(query, params, responseParams);
            }
        }
        catch(err) {
            console.log(err);
            res.json({
                state: 'error',
                message: err
            });
        }
    },
    /*CargaListaPeriodos: async (req, res) => {
        let { empresa } = req.body;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = 'select co_periodo "value",de_nombre "text" from ma_peri_m where co_empresa = :p_empresa and co_periodo <= cast(to_char(sysdate,\'yyyymm\') as integer) order by co_periodo';
            let params = {
                p_empresa: { val: empresa }
            };
            let result = await conn.execute(query, params, responseParams);
            res.json({
                state: 'success',
                data: {
                    periodos: result.rows
                }
            });
        }
        catch(err) {
            console.log(err);
            res.json({
                state: 'error',
                message: err
            });
        }
    },*/
    CargarMovimientosPeriodo: async (req, res) => {
        let { cliente, empresa } = req.body;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = 'select cperiodo "codigo",nperiodo "periodo",compras "compras",pagos "pagos" from table(pack_new_cuenta_corriente.f_movimientos_periodo(:p_cliente, :p_empresa))';
            let params = {
                p_cliente: { val: cliente },
                p_empresa: { val: empresa }
            };
            let result = await conn.execute(query, params, responseParams);
            res.json({
                state: 'success',
                data: {
                    movimientos: result.rows
                }
            });
        }
        catch(err) {
            console.log(err);
            res.json({
                state: 'error',
                message: err
            });
        }
    },
    ComprasClientePeriodo: async(req, res) => {
        let { cliente, periodo, empresa } = req.params;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select ccd.co_documento,to_char(ccd.fe_registro,'dd/mm/yyyy'),ccd.de_concepto,round(ccd.im_egreso,2),round(ccd.im_saldo,2) from ba_cuen_corr_admi_clie_d ccd join ma_peri_m pdo on pdo.co_empresa = ccd.co_empresa and pdo.co_periodo = ccd.co_periodo where ccd.co_empresa = :p_empresa and ccd.co_cliente = :p_cliente and pdo.de_nombre = :p_periodo and ccd.co_tipo_doc_administr in ('01','03') order by ccd.fe_registro asc";
            let params = {
                p_empresa: { val: empresa },
                p_cliente: { val: cliente },
                p_periodo: { val: periodo }
            };
            let result = await conn.execute(query, params, responseParams);
            res.set('Content-Type', 'text/xml');
            res.send(xmlParser.renderXml(result.rows));
        }
        catch(err) {
            console.log(err);
            res.json({
                state: 'error',
                message: err
            });
        }
    },
    PagosClientePeriodo: async(req, res) => {
        let { cliente, periodo, empresa } = req.params;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select pcd.co_documento,pct.co_planilla_cobranza,to_char(pcd.fe_sys,'dd/mm/yyyy'),round(pcd.im_cobranza,2),tpc.de_nombre from ba_plan_cobr_d pcd join ba_plan_cobr_t pct on pct.co_empresa = pcd.co_empresa and pct.co_planilla_cobranza = pcd.co_planilla_cobranza join ma_tipo_cobr_m tpc on tpc.co_tipo_cobro = pcd.co_tipo_cobro join ma_peri_m pdo on pct.co_periodo = pdo.co_periodo and pct.co_empresa = pdo.co_empresa where pcd.co_cliente = :p_cliente and pct.co_empresa = :p_empresa and pdo.de_nombre = :p_periodo order by pcd.fe_sys asc";
            let params = {
                p_empresa: { val: empresa },
                p_cliente: { val: cliente },
                p_periodo: { val: periodo }
            };
            let result = await conn.execute(query, params, responseParams);
            res.set('Content-Type', 'text/xml');
            res.send(xmlParser.renderXml(result.rows));
        }
        catch(err) {
            console.log(err);
            res.json({
                state: 'error',
                message: err
            });
        }
    },
    InformacionSolicitud: async (request, response) => {
        let { solicitud, empresa } = request.body;
        let result;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let querySolicitud = "select sl.im_solicitado \"slc\",sl.im_semanal \"sem\",to_char(sl.fe_solicitud,'dd/mm/yyyy hh24:mi') \"fsl\",sl.de_observaciones_vendedor \"obs\",cp.de_nombre \"rsc\",initcap(ce.de_razon_social) \"vnd\",mo.de_nombre \"mon\",sl.co_cliente \"ccl\",initcap(cc.de_razon_social) \"cli\",sl.co_condicion_pago \"cpg\",sl.im_aprobado \"iap\",sl.im_semanal_aprobado \"sap\",sl.es_vigencia \"vig\",nvl(sl.de_observaciones_propias,'') \"obp\",sgum.de_alias \"alias\" from ba_soli_cred_m sl join ma_cata_enti_m ce on sl.co_vendedor = ce.co_catalogo_entidad join ma_cata_enti_m cc on sl.co_cliente = cc.co_catalogo_entidad join ma_cond_pago_m cp on sl.co_condicion_pago = cp.co_condicion_pago join ma_mone_m mo on sl.co_moneda = mo.co_moneda join sg_usua_m sgum on sl.co_vendedor = sgum.co_usuario and sl.co_empresa = sgum.co_empresa_usuario where sl.co_solicitud_credito = :p_solicitud and sl.co_empresa = :p_empresa";
            let paramsSolicitud = {
                p_empresa: { val: empresa },
                p_solicitud: { val: solicitud }
            };
            result = await conn.execute(querySolicitud, paramsSolicitud, responseParams);
            let info = result.rows[0];
            // carga las observaciones
            let queryObservaciones = "select co_documento doc, fe_fecha_act_audit fdc, de_obser obs from ba_cuen_corr_admi_clie_d where fe_fecha_act_audit is not null and co_empresa = :p_empresa and co_cliente = :p_cliente order by fe_fecha_act_audit asc";
            let paramsObservaciones = {
                p_empresa: { val: empresa },
                p_cliente: { val: info.ccl }
            };
            result = await conn.execute(queryObservaciones, paramsObservaciones, responseParams);
            let observaciones = result.rows;
            // carga el credito del cliente
            let xdata = [info.alias, info.ccl, 34, 1].join('@');
            let queryStatus = "call pack_new_cuenta_corriente.sp_validar_status_cliente2(:p_data,:o_out)";
            let paramsStatus = {
                p_data: { val: xdata },
                o_out: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            };
            result = await conn.execute(queryStatus, paramsStatus, responseParams);
            let { o_out } = result.outBinds;
            o_out = o_out.split('@');
            let lcredito = {
                disponible: parseFloat(o_out[1]),
                deuda: parseFloat(o_out[3])
            };
            response.json({
                state: 'success',
                data: {
                    solicitud: info,
                    observaciones: observaciones,
                    lcredito: lcredito
                }
            });
        }
        catch(err) {
            console.error(err);
            response.json({
                state: 'error',
                message: err
            });
        }
    },
    ComboResultado: async (request, response) => {
        let result;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select co_condicion_pago \"value\", de_nombre \"text\" from ma_cond_pago_m where es_vigencia= 'Vigente' order by nu_orden asc";
            let params = {};
            result = await conn.execute(query, params, responseParams);
            response.json({
                options: result.rows
            });
        }
        catch (err) {
            console.error(err);
            response.json({
                state: 'error',
                message: err
            });
        }
    },
    ComboCpago: (request, response) => {
        response.json({
            options: [
                { value: 'Pendiente', text: 'Pendiente' },
                { value: 'Anulado', text: 'Anulado' },
                { value: 'Aprobado', text: 'Aprobado' },
                { value: 'Desaprobado', text: 'Desaprobado' }
            ]
        });
    },
    ProcesarSolicitud: async (request, response) => {
        let { csl,cpg,vig,apr,sap,obs,emp,aut } = request.body;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "call pack_new_cuenta_corriente.sp_actualiza_solicitud(:p_cpago,:p_vigencia,:p_autoriza,:p_abrobado,:p_inicial,:p_observaciones,:p_solicitud,:p_empresa)";
            let params = {
                p_cpago: { val: cpg },
                p_vigencia: { val: vig },
                p_autoriza: { val: aut },
                p_abrobado: { val: apr },
                p_inicial: { val: sap },
                p_observaciones: { val: obs },
                p_solicitud: { val: csl },
                p_empresa: { val: emp }
            };
            await conn.execute(query, params, responseParams);
            // carga el fcm
            const fcmLib = require('fcm-node');
            const fcmParams = require('../../fcm');
            const fcm = new fcmLib(fcmParams.api_key);
            // carga datos de la solicitud
            let querySolicitud = "select co_cliente \"cliente\", co_vendedor \"vendedor\" from ba_soli_cred_m where co_solicitud_credito = :p_solicitud and co_empresa = :p_empresa";
            let paramsSolicitud = {
                p_solicitud: { val: csl },
                p_empresa: { val: emp }
            };
            result = await conn.execute(querySolicitud, paramsSolicitud, responseParams);
            let dsolicitud = result.rows[0];
            // carga los datos del cliente
            let queryCliente = "select co_catalogo_entidad \"rucdni\",de_razon_social \"rsoc\",de_nombre_comercial \"ncom\" from ma_cata_enti_m where co_catalogo_entidad = :p_cliente";
            let paramsCliente = {
                p_cliente: { val: dsolicitud.cliente }
            };
            result = await conn.execute(queryCliente, paramsCliente, responseParams);
            let dcliente = result.rows[0];
            //
            let notificar = false;
            let mensaje = 'Ocurrió un error';
            switch (vig) {
                case 'Aprobado':
                    notificar = true;
                    mensaje = 'La solicitud de crédito del cliente ' + dcliente.rucdni + ': ' + dcliente.rsoc + ' - ' + dcliente.ncom + ', fue aprobada por un importe de S/ ' + parseFloat(apr).toLocaleString('en-us',{minimumFractionDigits:2,maximumFractionDigits:2});
                    break;
                case 'Anulado':
                    notificar = true;
                    mensaje = 'La solicitud de crédito del cliente ' + dcliente.rucdni + ': ' + dcliente.rsoc + ' - ' + dcliente.ncom + ', fue anulada';
                    break;
                case 'Desaprobado':
                    mensaje = 'La solicitud de crédito del cliente ' + dcliente.rucdni + ': ' + dcliente.rsoc + ' - ' + dcliente.ncom + ', fue rechazada. Motivo: ' + obs;
                    notificar = true;
                    break;
                default: break;
            }
            if (notificar) {
                // carga token del vendedor
                let queryVendedor = "select de_fcm_token \"token\" from sg_usua_m where co_empresa_usuario = :p_empresa and co_usuario = :p_vendedor";
                let paramsVendedor = {
                    p_empresa: { val: emp },
                    p_vendedor: { val: dsolicitud.vendedor }
                };
                result = await conn.execute(queryVendedor, paramsVendedor, responseParams);
                let dvendedor = result.rows[0];
                if (dvendedor.token && dvendedor.token != '') {
                    // arma la notificacion
                    let message = {
                        to: dvendedor.token,
                        notification: {
                            title: 'Solicitud de crédito',
                            body: mensaje
                        }
                    };
                    fcm.send(message, function(err, res){
                        if (err) {
                            console.error(err);
                            response.json({
                                state: 'error',
                                message: err
                            });
                        }
                        else {
                            console.log('envío exitoso:',res);
                            response.json({
                                state: 'success'
                            });
                        }
                    });
                }
            }
            else {
                response.json({
                    state: 'success'
                });
            }
        }
        catch (err) {
            console.error(err);
            response.json({
                state: 'error',
                message: err
            });
        }
    }
};

module.exports = cr0100Controller;