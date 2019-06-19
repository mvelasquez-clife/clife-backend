const express = require('express');
const router = express.Router();

const cr0100Controller = require('../../controllers/creditos/CR0100.controller');

    router.get('/cuenta-corriente/:empresa/:cliente/:desde/:hasta', cr0100Controller.CargaCuentaCorriente);
    router.get('/planillas-documento/:empresa/:cliente/:documento/:moneda', cr0100Controller.CargaPlanillasDocumento);
    router.get('/letras-cheques/:empresa/:documento', cr0100Controller.CargaLetrasCheques);
    router.get('/notas-credito-debito/:empresa/:documento', cr0100Controller.CargaNotasCreditoDebito);
    router.get('/lista-letras/:empresa/:cliente/:desde/:hasta', cr0100Controller.CargaListaLetras);
    router.get('/lista-cheques/:empresa/:cliente', cr0100Controller.CargaListaCheques);
    router.get('/lista-solicitudes-credito/:empresa/:cliente/:desde/:hasta', cr0100Controller.CargaSolicitudesCredito);
    router.get('/lista-linea-credito/:empresa/:cliente', cr0100Controller.CargaLineaCredito);
    router.get('/credito-masivo', cr0100Controller.AsignarCreditoMasivo);
    router.get('/fuerzas-venta/:empresa', cr0100Controller.CargaFuerzasVenta);
    router.get('/dcumentos-transferencia/:empresa/:cliente', cr0100Controller.ListaDocumentosTransferencia);
    router.get('/auditoria-vendedor/:empresa/:vendedor/:importe', cr0100Controller.CargarAuditoriaVendedor);
    router.get('/tipos-comunicacion', cr0100Controller.TiposComunicacion);
    router.get('/lista-contactos-cliente/:cliente', cr0100Controller.ListaContactos);
    router.get('/compras-cliente-periodo/:cliente/:periodo/:empresa', cr0100Controller.ComprasClientePeriodo);
    router.get('/pagos-cliente-periodo/:cliente/:periodo/:empresa', cr0100Controller.PagosClientePeriodo);

    router.post('/transferencia-documentos', cr0100Controller.TransfiereDocumentos);
    router.post('/guardar-datos-contacto', cr0100Controller.GuardaDatosContacto);
    router.post('/confirmar-auditoria', cr0100Controller.ConfirmarAuditoria);
    router.post('/cerrar-auditoria', cr0100Controller.CierraAuditoria);
    router.post('/movimientos-periodo', cr0100Controller.CargarMovimientosPeriodo);
    //router.post('/lista-periodos', cr0100Controller.CargaListaPeriodos);

module.exports = router;