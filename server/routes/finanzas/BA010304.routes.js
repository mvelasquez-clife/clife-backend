const express = require('express');
const router = express.Router();

const ba010304Controller = require('../../controllers/finanzas/BA010304.controller');

router.get('/buscar-planillas-cobranza/:empresa/:cobrador/:planilla/:desde/:hasta', ba010304Controller.buscarPlanillasCobranza);
router.get('/mostrar-pagos-efectivo/:empresa/:planilla', ba010304Controller.mostrarPagosEfectivo);
router.get('/mostrar-pagos-cheques/:empresa/:planilla', ba010304Controller.mostrarPagosCheques);
router.get('/mostrar-pagos-notas/:empresa/:planilla', ba010304Controller.mostrarPagosNotas);
router.get('/mostrar-depositos-planilla/:empresa/:planilla', ba010304Controller.mostrarDepositosPlanilla);

module.exports = router;
