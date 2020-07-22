const express = require('express');
const router = express.Router();

const lo0101030402Controller = require('./../../controllers/logistica/LO0101030402.controller');

router.get('/mostrar-marca/',lo0101030402Controller.mostrarmarca);
router.get('/mostrar-submarca/',lo0101030402Controller.mostrarsubmarca);
router.get('/mostrar-clase/:empresa/',lo0101030402Controller.mostrarclase);
router.get('/mostrar-familia/:empresa/',lo0101030402Controller.mostrarfamilia);
router.get('/mostrar-subfamilia/:empresa/',lo0101030402Controller.mostrarsubfamilia);
router.get('/mostrar-almacen/:empresa/',lo0101030402Controller.mostraralmacen);
router.get('/mostrar-periodo/:empresa/',lo0101030402Controller.mostrarperiodo);
router.get('/mostrar-kardex/:empresa/:almacen/:periodo/:codprod/:deprod/:clase/:familia/:sfamilia/:marca/:smarca/:barra/',lo0101030402Controller.mostrarlistKardex);

module.exports = router;