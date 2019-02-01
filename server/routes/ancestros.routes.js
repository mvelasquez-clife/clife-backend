const express = require('express');
const router = express.Router();

const ancestroController = require('../controllers/ancestros.controller');

router.post('/datos-modal-seguridad', ancestroController.cargaDatosVentanaSeguridad);
router.get('/datos-modal-busqueda/:id/:empresa', ancestroController.getGridPruebaData);

module.exports = router;