const express = require('express');
const router = express.Router();

const loginController = require('../controllers/login.controller');

router.post('/login',loginController.doLogin);

module.exports = router;