const express = require('express');
const router = express.Router();

const WsController = require('./../controllers/ws.controller');

    // vistas ws 17-02-2021
    router.get('/', WsController.Home);
    router.get('/carga-depositos', WsController.CargaDepositos);
    router.post('/carga-depositos/upload', WsController.UploadArchivoDeposito);
    router.get('/pedidos-realizados', WsController.ListaPedidosRealizados);
    router.get('/pedidos-realizados/lista', WsController.CargaPedidosRealizados);
    router.get('/datos-pedido', WsController.DatosPedido);
    router.get('/stock-productos', WsController.VerStockProductos);
    router.get('/stock-productos/carga-stocks', WsController.KardexProductos);
    router.get('/lista-precios', WsController.VerListaPrecios);
    router.get('/lista-precios/ls-listas', WsController.DetalleListas);
    router.get('/lista-precios/ver-lista-precios', WsController.CargaListaPrecios);
    // primeros
    router.get('/rg-usr-alv', WsController.RegistraUsuario);
    router.get('/obtener-token', WsController.ObtenerToken);
    router.get('/lista-precios', WsController.ListaPrecios);
    router.get('/lista-almacenes', WsController.ListaAlmacenes);
    router.get('/kardex', WsController.Kardex);
    router.get('/tracking', WsController.Tracking);
    // nuevos 19-04-2020
    router.get('/lista-tipos-documento', WsController.ListaTiposDocumento);
    router.post('/registra-cliente', WsController.RegistraCliente);
    router.get('/direcciones-cliente', WsController.DireccionesCliente);
    router.get('/lista-departamentos', WsController.ListaDepartamentos);
    router.get('/lista-provincias', WsController.ListaProvincias);
    router.get('/lista-distritos', WsController.ListaDistritos);
    router.get('/lista-vias-zonas', WsController.ListaViasZonas);
    router.post('/registra-direccion', WsController.RegistraDireccion);
    // nuevos 09-05-2020
    router.get('/datos-cliente', WsController.DatosCliente);
    // mas nuevos 11-05-2020
    router.post('/registra-pedido', WsController.RegistraPedido);
    // ultra nuevos 19-06-2020
    router.get('/tipos-cobro', WsController.TiposCobro);
    router.put('/buscar-pedido', WsController.MatchPedido);
    router.get('/planillas-cobranza', WsController.VerPlanillasCobranza);
    router.get('/lista-planillas', WsController.ListaPlanillas);
    router.get('/planillas-cobranza/detalle-planilla', WsController.DetallePlanilla);
    router.get('/ingreso-pedidos', WsController.IngresoManualPedidos);
    router.get('/ingreso-pedidos-extendido', WsController.IngresoManualPedidosExtend);
    router.get('/verifica-orderid', WsController.VerificaOrderId);
    router.get('/datos-lista-precios', WsController.DatosListaPrecios);
    router.get('/carga-datos-producto', WsController.CargaDatosProducto);
    // reporte de productos
    router.get('/reporte-productos', WsController.ReportePedidos);
    router.get('/carga-datos-reporte', WsController.CargaDatosProducto);
    // reporte de ventas
    router.get('/reporte-ventas', WsController.ReporteVentas);
    router.get('/carga-datos-repventas', WsController.CargaDatosVentas);
    router.get('/xls-repventas', WsController.XlsReporteVentas);
    router.get('/exportar-lista-precios', WsController.XlsListaPrecios);

module.exports = router;