const express = require('express');
const router = express.Router();

const ba010302Controller = require('../../controllers/finanzas/BA010302.controller');

    router.get('/lista-cajas/:empresa', ba010302Controller.listaCajas);
    router.get('/lista-fondos/:empresa/:caja', ba010302Controller.listaFondos);
    router.get('/detalle-fondos/:empresa/:fondo', ba010302Controller.fondoDetalle);
    router.get('/movimientos-fondo/:empresa/:fondo/:numero', ba010302Controller.fondoMovimientos);

module.exports = router;
