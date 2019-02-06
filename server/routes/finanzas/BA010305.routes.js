const express = require('express');
const router = express.Router();

const ba010305Controller = require('../../controllers/finanzas/BA010305.controller');

router.get('/combo-periodos/:empresa', ba010305Controller.ComboPeriodos);
router.get('/lista-planillas/:empresa/:cobrador/:periodo', ba010305Controller.ListaPlanillas);
router.post('/grafico-12', ba010305Controller.Grafico12);
router.post('/grafico-3', ba010305Controller.Grafico3);

module.exports = router;
