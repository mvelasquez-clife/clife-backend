const express = require('express');
const router = express.Router();

const ba010304Controller = require('../../controllers/finanzas/BA010304.controller');

router.get('/buscar-planillas-cobranza/:empresa/:cobrador/:planilla/:desde/:hasta', ba010304Controller.buscarPlanillasCobranza);

module.exports = router;
