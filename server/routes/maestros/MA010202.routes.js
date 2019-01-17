const express = require('express');
const router = express.Router();

const ma010202Controller = require('../../controllers/maestros/MA010202.controller');

router.get('/cargar-lista-periodos/:empresa', ma010202Controller.cargarListaPeriodos);
router.post('/guardar-periodo', ma010202Controller.guardarPeriodo);
router.post('/cargar-datos-periodo', ma010202Controller.cargarDatosPeriodo);
router.post('/eliminar-periodo', ma010202Controller.eliminarPeriodo);

module.exports = router;