const express = require('express');
const router = express.Router();

const WsController = require('./../controllers/ws.controller');

router.get('/rg-usr-alv', WsController.RegistraUsuario);
router.get('/obtener-token', WsController.ObtenerToken);
router.get('/lista-pedidos', WsController.ListaPedidos);

module.exports = router;