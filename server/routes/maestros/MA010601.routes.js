const express = require('express');
const router = express.Router();

const ma010601Controller = require('../../controllers/maestros/MA010601.controller');

router.get('/cargarsede/:emp', ma010601Controller.cargarsede);

router.get('/cargardepar/:emp', ma010601Controller.cargardepar);

router.get('/cargarsecc/:emp', ma010601Controller.cargarsecc);

router.get('/cargarofi/:emp', ma010601Controller.cargarofi);

router.post('/upsede-dep', ma010601Controller.updatesede);

router.get('/c_list_depar/:emp',ma010601Controller.c_list_depar);

router.get('/c_list_sede/:emp',ma010601Controller.c_list_sede);

//router.get('/c_list_depar/:emp',ma010601Controller.c_list_depar);

module.exports = router;