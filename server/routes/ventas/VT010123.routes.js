const express = require('express');
const router = express.Router();

const vt010123Controller = require('../../controllers/ventas/VT010123.controller');
router.get('/lista-bonificaciones/:empresa',vt010123Controller.CargaListaBonificaciones);

module.exports = router;