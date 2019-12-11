const express = require('express');
const router = express.Router();

const vt010102Controller = require('../../controllers/ventas/VT010102.controller');
 
    router.get('/gridtiponego', vt010102Controller.GridTipoNegocio);
    router.get('/list_estadotp', vt010102Controller.Listadoestadotp);
    router.post('/savetnego', vt010102Controller.GuardarTipNego);
    router.post('/datos_cuota',vt010102Controller.FormCoutadata);
    router.post('/savecuotatnego',vt010102Controller.SaveCoutadata);
module.exports = router;