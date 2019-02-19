const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chat.controller');

router.get('/', chatController.MostrarInterfaz);
router.post('/agregar-contacto', chatController.AgregarContacto);
router.post('/lista-contactos', chatController.ListaContactos);
router.post('/crear-grupo', chatController.GuardarGrupo);
router.post('/lista-grupos', chatController.ListaGrupos);
router.post('/miembros-grupo', chatController.MiembrosGrupo);

module.exports = router;