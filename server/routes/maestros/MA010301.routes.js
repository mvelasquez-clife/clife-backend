const express = require('express');
const router = express.Router();

const ma010301Controller = require('../../controllers/maestros/MA010301.controller');

router.get('/cargar-paises', ma010301Controller.cargarPaises);
router.get('/cargar-departamentos/:pais', ma010301Controller.cargarDepartamentos);
router.get('/cargar-provincias/:pais/:departamento', ma010301Controller.cargarProvincias);

module.exports = router;
//