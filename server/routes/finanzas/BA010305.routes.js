const express = require('express');
const router = express.Router();

const ba010305Controller = require('../../controllers/finanzas/BA010305.controller');

router.get('/combo-periodos/:empresa', ba010305Controller.ComboPeriodos);

module.exports = router;
