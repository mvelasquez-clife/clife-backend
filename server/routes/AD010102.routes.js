const express = require('express');
const router = express.Router();

const ad010102Controller = require('../controllers/AD010102.controller');

router.get('/grid', ad010102Controller.getData);

module.exports = router;