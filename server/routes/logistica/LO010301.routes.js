const express = require('express');
const router = express.Router();

const lo010301Controller = require('./../../controllers/logistica/LO010301.controller');
    router.post('/ls-datos-iniciales', lo010301Controller.DatosIniciales);
    router.post('/dt-info-proveedor', lo010301Controller.InfoProveedor);

module.exports = router;