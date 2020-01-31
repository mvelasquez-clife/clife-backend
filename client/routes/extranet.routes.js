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

module.exports = router;