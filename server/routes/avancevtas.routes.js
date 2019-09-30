const express = require('express');
const router = express.Router();

const avancevtasController = require('./../controllers/avancevtas.controller');
    router.get('/', avancevtasController.main);
    router.get('/carga-pedidos-dia/:dia/:empresa/:uactualiza/:modo', avancevtasController.CargaPedidosDia);

    router.post('/datos-tablero-control', avancevtasController.CargarDatosTableroControl);
    router.post('/cargar-datos-mes', avancevtasController.CargarDatosMes);
    router.post('/cargar-marcaciones', avancevtasController.CargaMarcaciones);
    router.post('/recarga-datos', avancevtasController.CargaNuevosDatos);

module.exports = router;
