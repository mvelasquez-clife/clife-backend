const express = require('express');
const router = express.Router();

const WsController = require('./../controllers/ws.controller');

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

module.exports = router;