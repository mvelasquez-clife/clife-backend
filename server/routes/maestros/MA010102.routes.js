const express = require('express');
const router = express.Router();

const ma010104Controller = require('../../controllers/maestros/MA010104.controller');

router.get('/cargardata/:emp', ma010104Controller.cargardata);

router.get('/c_list_estado/:emp',ma010104Controller.c_list_estado);

router.post('/update',ma010104Controller.update_data);

router.post('/file_exist',ma010104Controller.file_exist);

router.post('/upload',ma010104Controller.upload);

router.post('/datos_empresa',ma010104Controller.datos_empresa);

router.post('/c_estado', ma010104Controller.cambiaestado);

module.exports = router;