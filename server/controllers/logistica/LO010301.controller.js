const xmlParser = require('./../../xml-parser');
const db = require('./../../libs/db-oracle');
// const { request, response } = require('express');

const lo010301Controller = {
    DatosIniciales: async (request, response) => {
        // carga el combo de monedas
        let params = [
            { name: 'monedas', io: 'out', type: 'cursor' },
            { name: 'tpsenti', io: 'out', type: 'cursor' },
            { name: 'fecha', io: 'out', type: 'string' },
            { name: 'tcambio', io: 'out', type: 'number' }
        ];
        let result = await db.resultSet('call pack_new_ctacte_prov.sp_datos_iniciales(:monedas, :tpsenti, :fecha, :tcambio)', params);
        response.json({
            data: {
                monedas: result.monedas,
                tpentidades: result.tpsenti,
                columnas: [
                    { value: 1, text: 'Fecha ingreso' },
                    { value: 2, text: 'Fecha vencimiento' },
                    { value: 3, text: 'Fecha sistema' }
                ],
                fecha: result.fecha,
                tcambio: result.tcambio
            }
        });
    },
    InfoProveedor: async (request, response) => {
        const { empresa, entidad, tipoenti, moneda } = request.body;
        let params = [
            { name: 'empresa', io: 'in', value: parseInt(empresa) },
            { name: 'entidad', io: 'in', value: parseInt(entidad) },
            { name: 'tipoenti', io: 'in', value: parseInt(tipoenti) },
            { name: 'moneda', io: 'in', value: parseInt(moneda) },
            { name: 'ocodigo', io: 'out', type: 'number' },
            { name: 'omensaje', io: 'out', type: 'string' },
            { name: 'omoneda', io: 'out', type: 'string' },
            { name: 'oingreso', io: 'out', type: 'number' },
            { name: 'oegreso', io: 'out', type: 'number' },
            { name: 'osaldo', io: 'out', type: 'number' }
        ];
        let result = await db.statement("call pack_new_ctacte_prov.sp_info_proveedor(:empresa, :entidad, :tipoenti, :moneda, :ocodigo, :omensaje, :omoneda, :oingreso, :oegreso, :osaldo)", params);
        response.json({
            data: result.out
        });
    },
    DocumentosProvisionados: async (request, response) => {
        const { empresa, entidad, moneda, tipoenti } = request.params;
        let query = 'call pack_new_ctacte_prov.sp_documentos_provisionados (:empresa, :entidad, :moneda, :tipoenti, :rs)';
        let params = [
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'entidad', io: 'in', value: entidad },
            { name: 'moneda', io: 'in', value: moneda },
            { name: 'tipoenti', io: 'in', value: tipoenti },
            { name: 'rs', io: 'out', type: 'cursor' }
        ];
        let result = await db.resultSet(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderXml(result.rs));
    },
    LetrasProvisionadas: async (request, response) => {
        const { empresa, documento } = request.params;
        let query = 'call pack_new_ctacte_prov.sp_letras_prov (:empresa, :documento, :rs)';
        let params = [
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'documento', io: 'in', value: documento },
            { name: 'rs', io: 'out', type: 'cursor' }
        ];
        let result = await db.resultSet(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderXml(result.rs));
    },
    NotasCredDeb: async (request, response) => {
        const { empresa, documento, entidad } = request.params;
        let query = 'call pack_new_ctacte_prov.sp_notas_crdb (:empresa, :documento, :entidad, :rs)';
        let params = [
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'documento', io: 'in', value: documento },
            { name: 'entidad', io: 'in', value: entidad },
            { name: 'rs', io: 'out', type: 'cursor' }
        ];
        let result = await db.resultSet(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderXml(result.rs));
    },
    CtaCteCompras: async (request, response) => {
        const { empresa, documento, entidad } = request.params;
        let query = 'call pack_new_ctacte_prov.sp_ctacte_compras (:empresa, :documento, :entidad, :rs)';
        let params = [
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'documento', io: 'in', value: documento },
            { name: 'entidad', io: 'in', value: entidad },
            { name: 'rs', io: 'out', type: 'cursor' }
        ];
        let result = await db.resultSet(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderXml(result.rs));
    },
    DocumentosProv: async (request, response) => {
        const { empresa, tipoenti, coclasifica, entidad, documento, tpdocadmin } = request.params;
        let query = 'call pack_new_ctacte_prov.sp_documentos_proveedor (:empresa, :tipoenti, :coclasifica, :entidad, :documento, :tpdocadmin, :rs)';
        let params = [
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'tipoenti', io: 'in', value: tipoenti },
            { name: 'coclasifica', io: 'in', value: coclasifica },
            { name: 'entidad', io: 'in', value: entidad },
            { name: 'documento', io: 'in', value: documento },
            { name: 'tpdocadmin', io: 'in', value: tpdocadmin },
            { name: 'rs', io: 'out', type: 'cursor' }
        ];
        let result = await db.resultSet(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderXml(result.rs));
    },
    FacturasPagar: async (request, response) => {
        const { empresa, moneda, columna, desde, hasta } = request.params;
        let query = 'call pack_new_ctacte_prov.sp_facturas_pagar (:empresa, :moneda, :columna, :desde, :hasta, :resultset)';
        let params = [
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'moneda', io: 'in', value: moneda },
            { name: 'columna', io: 'in', value: columna },
            { name: 'desde', io: 'in', value: desde },
            { name: 'hasta', io: 'in', value: hasta },
            { name: 'resultset', io: 'out', type: 'cursor' }
        ];
        let result = await db.resultSet(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderXml(result.resultset));
    },
    LetrasPagar: async (request, response) => {
        const { empresa, moneda, columna, desde, hasta } = request.params;
        let query = 'call pack_new_ctacte_prov.sp_letras_pagar (:empresa, :moneda, :columna, :desde, :hasta, :resultset)';
        let params = [
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'moneda', io: 'in', value: moneda },
            { name: 'columna', io: 'in', value: columna },
            { name: 'desde', io: 'in', value: desde },
            { name: 'hasta', io: 'in', value: hasta },
            { name: 'resultset', io: 'out', type: 'cursor' }
        ];
        let result = await db.resultSet(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderXml(result.resultset));
    },
    PagosTransferencia: async (request, response) => {
        const { empresa, moneda, columna, desde, hasta } = request.params;
        let query = 'call pack_new_ctacte_prov.sp_pagos_transferencias (:empresa, :moneda, :columna, :desde, :hasta, :resultset)';
        let params = [
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'moneda', io: 'in', value: moneda },
            { name: 'columna', io: 'in', value: columna },
            { name: 'desde', io: 'in', value: desde },
            { name: 'hasta', io: 'in', value: hasta },
            { name: 'resultset', io: 'out', type: 'cursor' }
        ];
        let result = await db.resultSet(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderXml(result.resultset));
    },
    DocsAprobCajas: async (request, response) => {
        const { alias } = request.params;
        let query = 'call pack_new_ctacte_prov.sp_lista_cajas (:alias, :resultset)';
        let params = [
            { name: 'alias', io: 'in', value: alias },
            { name: 'resultset', io: 'out', type: 'cursor' }
        ];
        let result = await db.resultSet(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderXml(result.resultset));
    },
    DocsAprobCancelar: async (request, response) => {
        const { empresa } = request.params;
        let query = 'call pack_new_ctacte_prov.sp_documentos_cancelar (:empresa, :resultset)';
        let params = [
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'resultset', io: 'out', type: 'cursor' }
        ];
        let result = await db.resultSet(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderXml(result.resultset));
    },
    TiposDocAdmin: async (request, response) => {
        const { alias } = request.params;
        let query = 'call pack_new_ctacte_prov.sp_tipos_doc_admin (:resultset)';
        let params = [
            { name: 'resultset', io: 'out', type: 'cursor' }
        ];
        let result = await db.resultSet(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderXml(result.resultset));
    },
    AprobarPagoDocumentos: async (request, response) => {
        const { documentos } = request.body;
        for (let documento of documentos) {
            let xdata = [documento.codigo, documento.caja, documento.proveedor, documento.moneda, documento.unico, documento.pago, documento.tcambio].join('@*@');
            let query = 'call pack_caja2.sp_au_pago_caja_prov(:xdata)';
            let params = [
                { name: 'xdata', io: 'in', value: xdata }
            ];
            await db.statement(query, params);
        }
        response.json({
            success: true
        });
    },
    GeneraUrlVisor: async (request, response) => {
        const { empresa, proveedor, tipodoc, documento } = request.body;
        let query = 'select pack_new_attached.f_get_url(:empresa,:proveedor,:tipodoc,:documento) "url" from dual';
        let params = [
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'proveedor', io: 'in', value: proveedor },
            { name: 'tipodoc', io: 'in', value: tipodoc },
            { name: 'documento', io: 'in', value: documento }
        ];
        let result = await db.select(query, params);
        response.json(result);
    },
    ReportesTipodoc: async (request, response) => {
        const { empresa, tipodoc, desde, hasta } = request.params;
        let query = 'call pack_new_ctacte_prov.sp_reportes_tipodoc (:empresa, :tipodoc, :desde, :hasta, :resultset)';
        let params = [
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'tipodoc', io: 'in', value: tipodoc },
            { name: 'desde', io: 'in', value: desde },
            { name: 'hasta', io: 'in', value: hasta },
            { name: 'resultset', io: 'out', type: 'cursor' }
        ];
        let result = await db.resultSet(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderXml(result.resultset));
    },
    BuscarCuentaCorriente: async (request, response) => {
        const { moneda } = request.params;
        let query = 'call pack_new_ctacte_prov.sp_lupa_ctacte (:moneda, :resultset)';
        let params = [
            { name: 'moneda', io: 'in', value: moneda },
            { name: 'resultset', io: 'out', type: 'cursor' }
        ];
        let result = await db.resultSet(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderXml(result.resultset));
    },
    ProcesarPagosTransferencias: async (request, response) => {
        const { datos } = request.body;
        let out = [];
        for (let fila of datos) {
            let query = 'call pack_new_ctacte_prov.sp_procesar_pago_trf (:rucdni,:tipoenti,:clasenti,:documento,:moneda,:cuenta,:banco,:pais,:importe,:empresa,:usuario,:ocodigo,:omensaje)';
            let params = [
                { name: 'rucdni', io: 'in', value: fila.rucdni },
                { name: 'tipoenti', io: 'in', value: fila.tipoenti },
                { name: 'clasenti', io: 'in', value: fila.clasenti },
                { name: 'documento', io: 'in', value: fila.documento },
                { name: 'moneda', io: 'in', value: fila.moneda },
                { name: 'cuenta', io: 'in', value: fila.cuenta },
                { name: 'banco', io: 'in', value: fila.banco },
                { name: 'pais', io: 'in', value: fila.pais },
                { name: 'importe', io: 'in', value: fila.importe },
                { name: 'empresa', io: 'in', value: fila.empresa },
                { name: 'usuario', io: 'in', value: fila.usuario },
                { name: 'ocodigo', io: 'out', type: 'number' },
                { name: 'omensaje', io: 'out', type: 'string' }
            ];
            let result = await db.resultSet(query, params);
            out.push(result.ocodigo);
        }
        response.json({
            result: out
        });
    }
};

module.exports = lo010301Controller;