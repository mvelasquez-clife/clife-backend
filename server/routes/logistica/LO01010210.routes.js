const express = require('express');
const router = express.Router();

const lo01010210Controller = require('../../controllers/logistica/LO01010210.controller');

    router.get('/globales-fraccionamiento/:empresa/:usuario/:codigo', lo01010210Controller.ListaGlobalesFraccionamiento);
    router.get('/globales-fraccionamiento-lote/:empresa/:usuario/:global/:documento/:tipodoc/:producto', lo01010210Controller.ListaFraccionamientoLote);
    router.get('/combo-globales/:empresa', lo01010210Controller.ComboGlobales);
    router.get('/combo-taras/:producto', lo01010210Controller.ComboTaras);
    router.get('/detalle-bultos-prod/:empresa/:usuario/:codigo', lo01010210Controller.DetalleGridBultosProd);
    router.get('/detalle-bultos-sup/:empresa/:usuario/:codigo', lo01010210Controller.DetalleGridBultosSup);
    
    router.post('/carga-codigo-producto', lo01010210Controller.CargaCodigoProducto);
    router.post('/peso-tara', lo01010210Controller.PesoTara);
    router.post('/guarda-peso-insumo', lo01010210Controller.RegistraPesoTaraProducto);
    router.post('/fraccionamiento-completo', lo01010210Controller.FraccionamientoCompleto);

module.exports = router;