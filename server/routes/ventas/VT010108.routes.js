const express = require('express');
const router = express.Router();

const vt010108Controller = require('../../controllers/ventas/VT010108.controller');
 
    router.get('/gridcanalventa/:emp', vt010108Controller.GridCVenta);
    router.post('/savecventa', vt010108Controller.GuardarCVenta);
    ///////////////////////////////////////////////////////
   /* router.get('/list_estadotp', vt010108Controller.Listadoestadotp);
 
    router.post('/datos_cuota',vt010108Controller.FormCoutadata);
    router.post('/savecuotatnego',vt010108Controller.SaveCoutadata);*/
module.exports = router;