const express = require('express');
const router = express.Router();

const awsController = require('../controllers/aws.controller');

router.get('/get-img', awsController.getImg);

module.exports = router;