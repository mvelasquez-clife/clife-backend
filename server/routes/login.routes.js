const express = require('express');
const router = express.Router();

const loginController = require('../controllers/login.controller');

router.post('/login', loginController.doLogin);

router.post('/sendmailforgot', loginController.forgot);

router.post('/validatetoken', loginController.validatetoken);

router.post('/savepassword', loginController.savepassword);

module.exports = router;