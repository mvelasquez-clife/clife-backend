const express = require('express');
const router = express.Router();

const viewerController = require('./../controllers/viewer.controller');

    router.get('/:empresa', viewerController.main);
    router.get('/archivo/:empresa/:documento', viewerController.MuestraDocumento);

    router.post('/buscar-documentos', viewerController.FiltrarDocumentos);

module.exports = router;
