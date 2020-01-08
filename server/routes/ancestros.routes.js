const express = require('express');
const router = express.Router();

const ancestroController = require('../controllers/ancestros.controller');

    router.post('/datos-modal-seguridad', ancestroController.cargaDatosVentanaSeguridad);
    router.get('/datos-modal-busqueda/:id/:empresa', ancestroController.getGridPruebaData);
    router.get('/datos-modal-busqueda/:id/:empresa/:param', ancestroController.getGridPruebaData);
    router.post('/validar-clave', ancestroController.validarClave);

    // visor de documentos
    router.get('/lista-archivos/:empresa/:archivo/:tpdocumento/:codigo', ancestroController.listaArchivos);
    router.post('/carga-imagen', ancestroController.cargaArchivo);
    router.post('/datos-adjunto', ancestroController.datosAdjunto);
    router.post('/guardar-adjunto', ancestroController.guardarAdjunto);

module.exports = router;