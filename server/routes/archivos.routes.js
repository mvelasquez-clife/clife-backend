const express = require('express');
const router = express.Router();

const archivosController = require('../controllers/archivos.controller');

router.get('/img-voucher/:cuenta/:periodo/:operacion', archivosController.descargarImagenVoucher);
router.post('/message-attach', archivosController.AdjuntarArchivoMensaje);

module.exports = router;