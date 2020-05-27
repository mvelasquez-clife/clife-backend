const express = require('express');
const router = express.Router();

const ba010302Controller = require('../../controllers/finanzas/BA010302.controller');

    router.get('/lista-cajas/:empresa', ba010302Controller.listaCajas);
    router.get('/lista-fondos/:empresa/:caja', ba010302Controller.listaFondos);
    router.get('/detalle-fondos/:empresa/:fondo', ba010302Controller.fondoDetalle);
    router.get('/movimientos-fondo/:empresa/:fondo/:numero', ba010302Controller.fondoMovimientos);
    //
    router.post('/datos-form-edicion', ba010302Controller.datosFormEdicion);
    router.get('/lista-ingreso-gasto/:empresa/:categig', ba010302Controller.listaIngresoGasto);
    router.get('/lista-cuentas/:empresa/:moneda', ba010302Controller.listaCuentas);
    router.post('/actualiza-fondo-fijo', ba010302Controller.actualizaMovimiento);

module.exports = router;
