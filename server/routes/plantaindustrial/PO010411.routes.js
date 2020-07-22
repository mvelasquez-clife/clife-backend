const express = require('express');
const router = express.Router();

const po010411Controller = require('../../controllers/plantaindustrial/PO010411.controller');

router.get('/mostrar-especificacion/:empresa/:grupo/:flag/',po010411Controller.mostrarespecificacion);
router.post('/aprobar-especificacion/',po010411Controller.aprobaresp);

module.exports = router;