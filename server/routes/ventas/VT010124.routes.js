const express = require('express');
const router = express.Router();

const vt010124Controller = require('../../controllers/ventas/VT010124.controller');

router.post('/ls-datos-iniciales', vt010124Controller.DatosIniciales);
router.get('/gridctacte/:cocliente/:empr', vt010124Controller.Gridctacte); 
router.get('/gridctactea11/:cocliente/:empr', vt010124Controller.Gridctactea11);  
router.get('/gridet/:doc/:empr', vt010124Controller.Gridetalle); 
router.get('/motidevo/', vt010124Controller.Motidevo); 
router.get('/motiprenc/', vt010124Controller.Motiprenc);
router.get('/list_almacen/:empr', vt010124Controller.ListAlm); 
router.post('/save-gdvl', vt010124Controller.Creagdvl);
router.post('/terminar-gdvl', vt010124Controller.Terminagdvl);
router.post('/data-dgv', vt010124Controller.Datadfevolu);
router.post('/data-pedido', vt010124Controller.Datapedido);
router.get('/gdvridet/:gdvl/:empr', vt010124Controller.Gridetalledvl); 
router.get('/g_listcamb/:empr/:gdvl/:xserie/:xlist/:xper/:xpto/:xprec', vt010124Controller.Gridlistprec); 
router.get('/gricambiodet/:gdvl/:empr', vt010124Controller.GriCambiodet); 
router.post('/list-nc', vt010124Controller.List_SerNC);
router.get('/concept_nc/:xemp/:xtipodoc/:xstrelac', vt010124Controller.Concept_nc);
router.post('/save-prenc', vt010124Controller.Creaprenotac);
router.post('/save-cambio', vt010124Controller.Cambiprodst);
router.get('/gridcliente/:xclient/:xemp', vt010124Controller.Gridcliente); 
module.exports = router;