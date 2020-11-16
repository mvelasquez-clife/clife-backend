const express = require('express');
const router = express.Router();

const vt010124Controller = require('../../controllers/ventas/VT010124.controller');

router.post('/ls-datos-iniciales', vt010124Controller.DatosIniciales);
router.get('/gridctacte/:cocliente/:empr', vt010124Controller.Gridctacte); 
router.get('/gridet/:doc/:empr', vt010124Controller.Gridetalle); 
router.get('/motidevo/', vt010124Controller.Motidevo); 
router.get('/motiprenc/', vt010124Controller.Motiprenc);
router.get('/list_almacen/:empr', vt010124Controller.ListAlm); 
router.post('/save-gdvl', vt010124Controller.Creagdvl);
router.post('/data-dgv', vt010124Controller.Datadfevolu);
router.get('/gdvridet/:gdvl/:empr', vt010124Controller.Gridetalledvl); 
router.post('/list-nc', vt010124Controller.List_SerNC);
router.get('/concept_nc/:xemp/:xtipodoc/:xstrelac', vt010124Controller.Concept_nc);
router.post('/save-prenc', vt010124Controller.Creaprenotac);
module.exports = router;