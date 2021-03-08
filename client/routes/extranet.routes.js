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

module.exports = router;