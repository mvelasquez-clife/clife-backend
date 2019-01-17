const express = require('express');
const router = express.Router();

const ad010201Controller = require('../controllers/AD010201.controller');

router.get('/carga-datos', ad010201Controller.cargarDatos);

module.exports = router;
