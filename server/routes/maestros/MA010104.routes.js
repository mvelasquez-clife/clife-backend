const express = require('express');
const router = express.Router();

const ma010104Controller = require('../../controllers/maestros/MA010104.controller');

router.get('/cargardata/:emp', ma010104Controller.cargardata);

router.get('/c_list_estado/:emp',ma010104Controller.c_list_estado);

router.post('/update',ma010104Controller.update_emp);

//router.get('/cargardepar/:emp', ma010104Controller.cargardepar);
//
//router.get('/cargarsecc/:emp', ma010104Controller.cargarsecc);
//
//router.get('/cargarofi/:emp', ma010104Controller.cargarofi);
//
//router.post('/upsede-dep', ma010104Controller.updatesede);
//
//router.post('/upsecc-ofic', ma010104Controller.updatesecof); 
//
//router.get('/c_list_depar/:emp',ma010104Controller.c_list_depar);
//
//router.get('/c_list_sede/:emp',ma010104Controller.c_list_sede);
//
//router.get('/c_list_estado/:emp',ma010104Controller.c_list_estado);
//
//router.post('/c_estado', ma010104Controller.cambiaestado);

module.exports = router;