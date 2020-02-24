const express = require('express');
const router = express.Router();

const LifeController = require('../controllers/intra-life.controller');
    router.get('/', LifeController.Home);
    router.get('/login', LifeController.Login);
    router.get('/logout', LifeController.Logout);
    router.get('/documentos/:tipo', LifeController.Documentos);
    router.get('/activar-cuenta', LifeController.ActivarCuenta);
    router.get('/datos-personales', LifeController.DatosPersonales);
    router.get('/personal', LifeController.Personal);
    router.get('/subir-docs', LifeController.SubirDocumentos);
    router.get('/enviar-mensajes', LifeController.EnvioMensajes);
    //
    router.post('/auth-login', LifeController.AuthLogin);
    router.post('/cargar-datos', LifeController.CargarDatosUsuario);
    router.post('/lista-empresas', LifeController.ListaEmpresas);
    router.post('/lista-personal', LifeController.ListaPersonal);
    router.post('/upload-personal', LifeController.UploadPersonal);

module.exports = router;