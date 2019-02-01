const express = require('express');
const router = express.Router();

const lo01020201Controller = require('../../controllers/logistica/LO01020201.controller');

router.get('cargar-lista-ordenes/:empresa/:fdesde/:fhasta', lo01020201Controller.cargarListaOrdenes);

module.exports = router;