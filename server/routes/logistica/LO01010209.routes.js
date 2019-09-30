const express = require('express');
const router = express.Router();

const lo01010209Controller = require('../../controllers/logistica/LO01010209.controller');

router.get('/lista-almacenes/:empresa', lo01010209Controller.ListaAlmacenes);
router.get('/buscar-documentos/:empresa/:almacen/:fdesde/:fhasta/:tintes', lo01010209Controller.BuscarDocumentosFraccionar);
router.get('/lista-periodos/:empresa', lo01010209Controller.ListaPeriodos);
router.get('/lista-globales-fraccionamientos/:empresa/:periodo', lo01010209Controller.ListaGlobalFraccionamientos);

module.exports = router;