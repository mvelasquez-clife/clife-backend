const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home.controller');

router.get('/menu/:alias/:empresa',homeController.getMenu);

module.exports = router;