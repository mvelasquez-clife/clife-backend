const express = require('express');
const router = express.Router();

const po010208Controller = require('../../controllers/plantaindustrial/PO010208.controller');

router.get('/mostrar-clase/',po010208Controller.mostrarclase);
router.get('/mostrar-marca/',po010208Controller.mostrarmarca);
router.post('/mostrar-familia/',po010208Controller.mostrarfamilia);
router.post('/mostrar-subfamilia/',po010208Controller.mostrarsubfamilia);
router.post('/mostrar-submarca/',po010208Controller.mostrarsubmarca);
router.get('/mostrar-producto/:buscar/:co_clase/:co_familia/:co_subfamilia/:co_marca/:co_submarca/',po010208Controller.mostrarProductos);
router.post('/grabar-nsoc/',po010208Controller.grabarnsoc);
router.get('/mostrar-nso/:buscador/',po010208Controller.mostrarnso);
router.post('/cargar-pdf/',po010208Controller.CargarPdf);
router.post('/ver-pdf/',po010208Controller.abrirPDF);
router.get('/mostrar-productos-nso/:co_nso/',po010208Controller.mostrarproductosnso);


module.exports = router;