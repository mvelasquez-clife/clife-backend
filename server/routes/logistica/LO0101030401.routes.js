const express = require('express');
const router = express.Router();

const lo0101030401Controller = require('./../../controllers/logistica/LO0101030401.controller');

router.get('/mostrar-filtro/',lo0101030401Controller.mostrarfiltro);
router.get('/mostrar-producto/:empresa/:filtro/:buscador/',lo0101030401Controller.mostrarProductos);
router.post('/mostrar-periodo/',lo0101030401Controller.mostrarPeriodo);
router.get('/mostrar-almacen/:empresa/:periodo/:producto/',lo0101030401Controller.mostrarAlmaporprod);
router.get('/mostrar-detalle-almacen/:empresa/:periodo/:almacen/:producto/',lo0101030401Controller.mostrardetalleAlmapr);
router.get('/mostrar-detalledos-almacen/:empresa/:periodo/:almacen/:producto/:transaccion/',lo0101030401Controller.mostrardetalleAlmase);
router.get('/mostrar-detalleter-almacen/:empresa/:periodo/:almacen/:producto/',lo0101030401Controller.mostrardetalleAlmater);
router.post('/mostrar-transaccion/',lo0101030401Controller.mostrartipotrans);
router.get('/mostrar-insumos-empaques/:empresa/:periodo/:producto/',lo0101030401Controller.mostrarinsyemp);
router.get('/mostrar-reserva-pedidos/:empresa/:almacen/:producto/',lo0101030401Controller.mostrarpedres);
router.get('/mostrar-detalleuno-reserva/:empresa/:periodo/:almacen/:producto/',lo0101030401Controller.mostrardetprires);
router.get('/mostrar-detalledos-reserva/:empresa/:periodo/:almacen/:producto/',lo0101030401Controller.mostrardetsegres);
router.get('/mostrar-cambio-ubicaciones/:empresa/:periodo/:almacen/:producto/',lo0101030401Controller.mostrarcambioubi);
router.get('/mostrar-movimientos/:empresa/:periodo/:almacen/:producto/',lo0101030401Controller.mostrarmovimientos);
router.get('/pdf-reporte-uno/:movimiento/:empresa/:transacc/:periodo/:coddoc1/', lo0101030401Controller.PdfReporteuno);

module.exports = router;