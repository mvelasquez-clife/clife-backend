const express = require('express');
const router = express.Router();

const LifeController = require('../controllers/intra-life.controller');
    router.get('/', LifeController.Home);
    router.get('/login', LifeController.Login);
    router.get('/logout', LifeController.Logout);
    router.get('/activar-cuenta', LifeController.ActivarCuenta);
    //
    router.post('/auth-login', LifeController.AuthLogin);

module.exports = router;