const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home.controller');

router.get('/menu/:alias/:empresa',homeController.getMenu);

router.post('/menusearch',homeController.getmenu_search);

module.exports = router;