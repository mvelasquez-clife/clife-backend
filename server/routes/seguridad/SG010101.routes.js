const express = require('express');
const router = express.Router();

const sg010101Controller = require('../../controllers/seguridad/SG010101.controller');

router.get('/buscar-usuario/:usuario/:empresa',sg010101Controller.buscarUsuario);
router.post('/mostrar-usuario',sg010101Controller.mostrarUsuario);
router.post('/guardar-usuario',sg010101Controller.guardarUsuario);
router.post('/guardar-usuariov2',sg010101Controller.guardarUsuariov2);
router.get('/mostrar-permisos',sg010101Controller.mostrarPermisos);
router.post('/mostrar-permisos-usuario',sg010101Controller.mostrarPermisosUsuario);
router.post('/guardar-permiso',sg010101Controller.guardarPermiso);
router.post('/clonar-usuario',sg010101Controller.clonarUsuario);
router.get('/mostrar-empresa/:empresa/',sg010101Controller.mostrarEmpresa);
router.get('/mostrar-costo/:empresa/',sg010101Controller.mostrarccosto);
router.post('/replicar-usuario-empresa',sg010101Controller.replicarEmpresa);

module.exports = router;