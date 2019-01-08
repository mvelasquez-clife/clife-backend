const express = require('express');
const router = express.Router();

const intranetController = require('../controllers/intranet.controller');

router.get('/', intranetController.home);
router.get('/inicio', intranetController.inicio);
router.get('/modulo/:id', intranetController.CargarModulo);

module.exports = router;