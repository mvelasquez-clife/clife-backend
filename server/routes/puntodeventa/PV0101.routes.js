const express = require('express');
const router = express.Router();

const pv00101Controller = require('../../controllers/puntodeventa/PV0101.controller');


router.post('/carga_empresa/',pv00101Controller.carga_empresa);
/*
router.get('/mostrar-forma-cosmetica/',pv00101Controller.mostrarformcosm);
router.get('/mostrar-clase/',pv00101Controller.mostrarclase);
router.get('/mostrar-marca/',pv00101Controller.mostrarmarca);
router.post('/mostrar-familia/',pv00101Controller.mostrarfamilia);
router.post('/mostrar-subfamilia/',pv00101Controller.mostrarsubfamilia);
router.post('/mostrar-submarca/',pv00101Controller.mostrarsubmarca);
router.get('/mostrar-producto/:buscar/:co_clase/:co_familia/:co_subfamilia/:co_marca/:co_submarca/',pv00101Controller.mostrarProductos);
router.post('/grabar-nsoc/',pv00101Controller.grabarnsoc);
router.get('/mostrar-nso/:buscador/',pv00101Controller.mostrarnso);
router.post('/cargar-pdf/',pv00101Controller.CargarPdf);
router.post('/ver-pdf/',pv00101Controller.abrirPDF);
router.get('/mostrar-productos-nso/:co_nso/',pv00101Controller.mostrarproductosnso);
*/


module.exports = router;