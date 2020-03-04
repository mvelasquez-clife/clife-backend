const express = require('express');
const router = express.Router();

const co0201Controller = require('../../controllers/contabilidad/CO0201.controller');

router.get('/home',co0201Controller.inicio);
router.get('/ejemplo/:empresa', co0201Controller.ejemplo);
router.post('/guardar-usuario', co0201Controller.guardarUsuario);
router.post('/eliminar-usuario', co0201Controller.eliminarUsuario);
router.post('/cargar-datos-usuario', co0201Controller.cargarDatosUsuario);

module.exports = router;