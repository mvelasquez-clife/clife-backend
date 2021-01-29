const express = require('express');
const router = express.Router();

const po010411Controller = require('../../controllers/plantaindustrial/PO010411.controller');

router.get('/mostrar-especificacion/:empresa/:grupo/:flag/',po010411Controller.mostrarespecificacion);
router.get('/mostrar-especificacion-descontinuada/:empresa/',po010411Controller.mostrarespecDescontinuada);
router.get('/mostrar-especificacion-grupo/:empresa/:grupo/',po010411Controller.mostrarespecporgrupo);
router.post('/aprobar-especificacion/',po010411Controller.aprobaresp);

module.exports = router;