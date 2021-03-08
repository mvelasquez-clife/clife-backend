const express = require('express');
const router = express.Router();

const vt01040103Controller = require('../../controllers/ventas/VT01040103.controller');
router.get('/cargar-productos/:opcion/:empresa/:cadena/:producto', vt01040103Controller.mostrarProductos);
router.post('/mostrar-usuario-solicita/',vt01040103Controller.mostrarUsuario);
router.get('/mostrar-usuario-seleccion/:alias/:search',vt01040103Controller.mostrarUsuariosolicita);
router.get('/mostrar-usuario-presupuesto/:alias/:usuario/:centro_costo',vt01040103Controller.mostrarUsuariopsto);
router.get('/mostrar-catalogo-presupuesto/:empresa/:ingreso',vt01040103Controller.mostrarCatPspto);
router.get('/mostrar-tipo-entidad/',vt01040103Controller.mostrartipoEntidad);
router.get('/mostrar-moneda/',vt01040103Controller.mostrarMoneda);
router.get('/mostrar-entidad/:entidad/:empresa/:buscar',vt01040103Controller.mostrarEntidad);
router.get('/mostrar-direccion/:opcion/:empresa/:entidad',vt01040103Controller.mostrarDireccion);
router.post('/calcular-total-anual/',vt01040103Controller.calcularvtaAnual);
router.post('/calcular-total-pedido/',vt01040103Controller.calculartotPedido);
router.post('/calcular-total-requ/',vt01040103Controller.calculartotRequ);
router.get('/mostrar-requerimientos/:empresa/:usuario/:fec_ini/:fec_fin/:flag_pend/:flag_rech/:flag_aten',vt01040103Controller.mostrarlistReq);
router.get('/mostrar-requerimientos-detalle/:empresa/:requerimiento',vt01040103Controller.mostrarlistdetReq);

module.exports = router;