const express = require('express');
const router = express.Router();

const carteraController = require('../controllers/cartera.controller');

router.get('/vendedores/:empresa', carteraController.listaVendedores);
router.post('/ruta', carteraController.rutaVendedor);

module.exports = router;