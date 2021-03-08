const express = require('express');
const router = express.Router();

const po010411Controller = require('../../controllers/plantaindustrial/PO010411.controller');

router.get('/mostrar-especificacion/:empresa/:grupo/:flag/',po010411Controller.mostrarespecificacion);
router.get('/mostrar-especificacion-descontinuada/:empresa/',po010411Controller.mostrarespecDescontinuada);
router.get('/mostrar-especificacion-grupo/:empresa/:grupo/:producto/:filter',po010411Controller.mostrarespecporgrupo);
router.post('/aprobar-especificacion/',po010411Controller.aprobaresp);
router.post('/validad-permiso/',po010411Controller.validaraccion);

module.exports = router;