const express = require('express');
const router = express.Router();

const ma010102Controller = require('../../controllers/maestros/MA010102.controller');

router.get('/list_tipopers',ma010102Controller.list_tipopers);

router.get('/list_procedencia',ma010102Controller.list_procedencia);

router.get('/list_origen',ma010102Controller.list_origen);

router.get('/list_tipocliente',ma010102Controller.list_tipocliente);

router.get('/grid_linea/:emp/:cliente',ma010102Controller.grid_linea);

router.get('/list_banco',ma010102Controller.list_banco);

router.get('/list_tiponego',ma010102Controller.list_tiponego);

router.get('/list_estadocleinte',ma010102Controller.list_estadocleinte);

router.get('/list_lincredito/:emp',ma010102Controller.list_lincredito);

router.get('/gridcliente/:emp/:tipo/:busqueda', ma010102Controller.gridcliente);

router.post('/list_datos_cliente',ma010102Controller.list_datos_cliente);

router.post('/update',ma010102Controller.update_data);

router.post('/savelinea',ma010102Controller.savelinea);

router.get('/list_moneda',ma010102Controller.list_moneda);


//------------------------------------------
//router.get('/cargardata/:emp', ma010104Controller.cargardata);
//
//router.get('/c_list_estado/:emp',ma010104Controller.c_list_estado);
//

//
//router.post('/file_exist',ma010104Controller.file_exist);
//
//router.post('/upload',ma010104Controller.upload);
//
//router.post('/datos_empresa',ma010104Controller.datos_empresa);
//
//router.post('/c_estado', ma010104Controller.cambiaestado);

module.exports = router;