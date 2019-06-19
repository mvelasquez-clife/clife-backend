const express = require('express');
const router = express.Router();

const intranetController = require('../controllers/intranet.controller');

router.get('/', intranetController.home);
router.get('/inicio', intranetController.inicio);
router.get('/resetpasword/:token', intranetController.resetpasword);
//vistas de cada modulo
router.get('/modulo/:id', intranetController.CargarModulo);
router.get('/modulo/:id/:ancestro', intranetController.CargarModulo);



module.exports = router;