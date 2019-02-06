const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home.controller');

router.get('/menu/:alias/:empresa',homeController.getMenu);

router.post('/menusearch',homeController.getmenu_search);

router.post('/upload',homeController.upload);

router.post('/file_exist',homeController.file_exist);

router.post('/update_datos',homeController.update_datos);

router.get('/list_tipodoc',homeController.list_tipodoc);


module.exports = router;