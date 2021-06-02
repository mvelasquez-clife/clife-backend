const express = require('express');
const router = express.Router();

const extranetController = require('../controllers/extranet.controller');
    router.get('/', extranetController.home);
    router.get('/login', extranetController.login);
    router.get('/logout', extranetController.logout);
    router.get('/nuevo-usuario', extranetController.NuevoUsuario);
    router.get('/confirmar-usuario', extranetController.ConfirmarUsuario);
    router.get('/prueba-registro', extranetController.PruebaRegistro);
    router.get('/detalle-pedido/:pedido', extranetController.DetallePedido);
    //
    router.post('/auth-login', extranetController.AuthLogin);
    router.post('/auth-sign-in', extranetController.RegistraUsuario);
    router.post('/buscar-clientes', extranetController.BuscarClientes);
    router.post('/datos-cliente', extranetController.DatosCliente);
    router.post('/pre-pedido', extranetController.RegistraPrePedido);
    router.post('/datos-pedido', extranetController.DatosPedido);
    router.post('/catalogo-productos', extranetController.CatalogoProductos);
    router.post('/agregar-productos-expo', extranetController.AgregarProductosExpo);
    router.post('/eliminar-productos', extranetController.EliminarProducto);
    router.post('/obsequiar-productos', extranetController.ObsequiarProducto);
    router.post('/actualizar-cantidad-producto', extranetController.ActualizarCantidad);
    router.post('/actualizar-cantidades-producto', extranetController.ActualizarCantidades);
    router.post('/carga-xlsx', extranetController.CargarXlsx);
    router.post('/cerrar-pedido', extranetController.CerrarPedido);
    router.get('/revisar-pedido/:prepedido', extranetController.CheckInPedido);
    router.get('/carga-stock-detalle-pedido', extranetController.CargaStockDetallePedido);
    router.get('/verifica-pedido-admin', extranetController.VerificaPedidoAdmin);
    router.get('/carga-cabecera-pedido', extranetController.CabeceraSolicitudCredito);
    router.post('/enviar-solicitud-credito', extranetController.EnviarSolicitudCredito);
    //
    router.get('/pedidos-pendientes', extranetController.ListPedidosPendientes);
    router.get('/detalle-pedido', extranetController.ProductosPedido);
    router.post('/procesar-pre-pedido', extranetController.ProcesarPrePedido);
    router.post('/abrir-pre-pedido', extranetController.AbrePrePedido);
    router.post('/solicita-liberacion-productos', extranetController.SolicitaLiberacionProductos);
    // modulo para liberación de productos
    router.get('/liberacion-productos', extranetController.TrasladoProductos);
    router.get('/lista-productos-liberar', extranetController.ListaProductosLiberacion);
    router.get('/lista-ubicaciones', extranetController.ListaUbicacionesTraslado);
    router.post('/trasladar-productos', extranetController.TrasladarProductos);
    router.get('/lista-pedidos-traslado', extranetController.ListaPedidosTraslado);
    router.get('/reporte-traslado-productos', extranetController.ReporteTraslado);
    // adjuntos a pedidos
    router.get('/lista-pedidos-validos', extranetController.ListaPedidosValidos);
    router.get('/archivos-adjuntos', extranetController.ArchivosAdjuntos);
    router.post('/upload-adjuntos', extranetController.UploadAdjuntos);
    router.post('/retira-adjunto', extranetController.RetirarAdjunto);
    router.get('/descarga-adjunto', extranetController.DescargaAdjunto);
    router.get('/pedidos-cerrados', extranetController.HistorialPedidos);
    router.get('/xls-reporte-traslado', extranetController.XlsReporteTraslado);
    router.get('/xls-productos-pedido', extranetController.XlsProductosPedido);

module.exports = router;