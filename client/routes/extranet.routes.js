const express = require('express');
const router = express.Router();

const extranetController = require('../controllers/extranet.controller');
    router.get('/', extranetController.home);
    router.get('/login', extranetController.login);
    router.get('/nuevo-usuario', extranetController.NuevoUsuario);
    router.get('/confirmar-usuario', extranetController.ConfirmarUsuario);
    router.get('/prueba-registro', extranetController.PruebaRegistro);
    //
    router.post('/auth-login', extranetController.AuthLogin);
    router.post('/auth-sign-in', extranetController.RegistraUsuario);

module.exports = router;