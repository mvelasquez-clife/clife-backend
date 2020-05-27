const express = require('express');
const router = express.Router();

const sg010203Controller = require('../../controllers/seguridad/SG010203.controller');

router.get('/mostrar-lista-usuario/:empresa',sg010203Controller.mostrarListaUsuarios);
router.get('/mostrar-versiones/:usuario/:empresa/',sg010203Controller.mostrarVersiones);
router.post('/mostrar-menu-cabecera',sg010203Controller.mostrarMenuCabecera);
router.get('/mostrar-menud-usuario/:empresa/:acceso_menu/',sg010203Controller.mostrarMenuDUsuario);
router.get('/mostrar-menu-sistema/:empresa/:acceso_menu/',sg010203Controller.mostrarMenuSistema);
router.post('/grabar-menu-sistema-detalle',sg010203Controller.grabarDetalleMenu);
router.post('/grabar-menu-cabecera',sg010203Controller.guardarMenucabecera);
router.post('/grabar-accion-menu',sg010203Controller.guardarAccionmenu);

module.exports = router;