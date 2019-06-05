const express = require('express');
const router = express.Router();

const ma010102Controller = require('../../controllers/maestros/MA010102.controller');

router.get('/list_tipopers', ma010102Controller.list_tipopers);

router.get('/rubro', ma010102Controller.rubro);

router.get('/documentos/:cliente/:emp', ma010102Controller.documentos);

router.get('/list_procedencia', ma010102Controller.list_procedencia);

router.get('/list_origen', ma010102Controller.list_origen);

router.get('/list_tipocliente', ma010102Controller.list_tipocliente);

router.get('/grid_linea/:emp/:cliente', ma010102Controller.grid_linea);

router.get('/list_banco', ma010102Controller.list_banco);

router.get('/cargo_repre', ma010102Controller.cargo_repre); 

router.get('/tipocta', ma010102Controller.tipocta); 

router.get('/list_tiponego', ma010102Controller.list_tiponego);

router.get('/list_estadocleinte', ma010102Controller.list_estadocleinte);

router.get('/list_lincredito/:emp', ma010102Controller.list_lincredito);

router.get('/via', ma010102Controller.via);

router.get('/combo_gridfz_nom/:empre', ma010102Controller.combo_gridfz_nom);

router.get('/modogaran', ma010102Controller.modogaran);

router.get('/zona', ma010102Controller.zona);

router.get('/fzvta/:emp', ma010102Controller.fzvta);

router.get('/zncomercial/:emp', ma010102Controller.zncomercial);

router.get('/garante/:cocliente', ma010102Controller.garante);

router.get('/contactos/:cocliente', ma010102Controller.contactos);

router.get('/cuentas/:cocliente', ma010102Controller.cuentas);

router.get('/giro_nego/:cocliente', ma010102Controller.giro_nego);

router.get('/data_antec/:cocliente/:empr', ma010102Controller.data_antec); 

router.get('/data_comu/:cocliente/:empr', ma010102Controller.data_comu); 

router.get('/dvisita', ma010102Controller.dvisita);

router.get('/dcobranza', ma010102Controller.dcobranza);

router.get('/list_moneda', ma010102Controller.list_moneda);

router.get('/list_operador', ma010102Controller.list_operador); 

router.get('/cargafzvta/:co_direccion/:emp/:zncomer', ma010102Controller.cargafzvta);

router.get('/cargardirecc/:xcodigo', ma010102Controller.cargardirecc);

router.get('/datosdirecc/:xdirecc', ma010102Controller.datosdirecc);

router.get('/c_list_estado',ma010102Controller.c_list_estado);

router.get('/gridcliente/:emp/:tipo/:busqueda', ma010102Controller.gridcliente);

router.get('/gridfz/:coddirecc/:empresa', ma010102Controller.gridfz);

router.get('/gridfz_fvta_d/:coddirecc/:empresa/:cozona', ma010102Controller.gridfz_fvta_d);

router.post('/list_datos_cliente', ma010102Controller.list_datos_cliente);

router.post('/grabantece', ma010102Controller.grabantece); 

router.post('/grabacomu', ma010102Controller.grabacomu); 

router.post('/grabagironego', ma010102Controller.grabagironego); 

router.post('/grabacuentas', ma010102Controller.grabacuentas); 

router.post('/grabagarantes', ma010102Controller.grabagarantes);  

router.post('/update_fv', ma010102Controller.update_fv); 

router.post('/documentosup/:cliente/:emp', ma010102Controller.documentosup);

router.post('/docu_clear/:cliente/:emp/:file', ma010102Controller.docu_clear);

router.post('/updatezon_comer', ma010102Controller.updatezon_comer);

router.post('/update', ma010102Controller.update_data);

router.post('/grabadirec', ma010102Controller.grabadirec);

router.post('/data_fz_cc', ma010102Controller.data_fz_cc); 

router.post('/savelinea', ma010102Controller.savelinea);



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