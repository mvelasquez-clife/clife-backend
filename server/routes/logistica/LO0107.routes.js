const express = require('express');
const router = express.Router();

const lo0107Controller = require('../../controllers/logistica/LO0107.controller');

router.get('/mostrar-almacen/:empresa/',lo0107Controller.mostraralmacen);
router.get('/mostrar-ingreso/',lo0107Controller.mostraringreso);
router.post('/mostrar-motivo/',lo0107Controller.mostrarmotivo);
router.get('/seleccion-personal/:empresa/',lo0107Controller.seleccionpersonal);
router.get('/seleccion-costos/:empresa/',lo0107Controller.seleccionccosto);
router.get('/seleccion-entidad/:valor/',lo0107Controller.seleccionentidad);
router.get('/mostrar-productos/:empresa/:periodo/:almacen/:ubicacion/',lo0107Controller.mostrarProductos);
router.get('/mostrar-direcciones/:catalogo_entidad/',lo0107Controller.mostrarDirecciones);
router.get('/mostrar-fzaventa/:direccion_entidad/:empresa/',lo0107Controller.mostrarFzaventa);
router.post('/mostrar-secuencia/',lo0107Controller.mostrarSecuenc);
router.get('/mostrar-referencia/',lo0107Controller.mostrarreferencia);
router.post('/grabar-requerimiento/',lo0107Controller.grabarRequerimiento);
router.post('/mostrar-periodo/',lo0107Controller.mostrarPeriodo);
router.get('/mostrar-cabecera-requerimiento/:empresa/:almacen/:fecha_d/:fecha_h/:flag_pend/:flag_rech/:flag_ate/',lo0107Controller.buscarcabeceraRequ);
router.get('/mostrar-detalle-requerimiento/:empresa/:almacen/:requerimiento/',lo0107Controller.buscardetalleRequ);
router.get('/mostrar-guia-producto/:empresa/:almacen/:requerimiento/:producto/',lo0107Controller.buscarguiaProd);
router.post('/grabar-estado-requerimiento/',lo0107Controller.grabarestadoRequerimiento);
router.get('/mostrar-motivo-devolucion/',lo0107Controller.mostrarmotivoDevol);
router.get('/mostrar-detalle-requerimiento-devol/:empresa/:almacen/:requerimiento/',lo0107Controller.buscardetallereqDevol);
router.get('/consulta-requerimiento/:empresa/:almacen/:fecha_d/:fecha_h/:flag_pend/:flag_rech/:flag_ate/',lo0107Controller.consultaRequerimiento);
router.post('/businesscard.pdf',lo0107Controller.convertirPDF);

module.exports = router;