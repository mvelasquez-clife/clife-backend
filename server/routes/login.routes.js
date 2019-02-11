const express = require('express');
const router = express.Router();

const loginController = require('../controllers/login.controller');

router.post('/login',loginController.doLogin);

router.post('/sendmailforgot',loginController.forgot);

module.exports = router;