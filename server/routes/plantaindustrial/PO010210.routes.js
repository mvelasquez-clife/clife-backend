const express = require('express');
const router = express.Router();

const po010210Controller = require('../../controllers/plantaindustrial/PO010210.controller');

router.get('/listar-productos/:buscar/', po010210Controller.ListaProductos);
router.post('/listar-detalle-prodhijo/', po010210Controller.FormularioProductohijo);
router.get('/listar-producto-padre/:producto/', po010210Controller.ListaProductopadre);
router.post('/subir-adjunto/', po010210Controller.SubirAdjunto);
router.post('/guardar-arte/', po010210Controller.GuardarcambioArte);
router.get('/listar-artes-pendientes/', po010210Controller.ListaArtespendiente);
router.post('/ver-img-producto/', po010210Controller.verimgProducto);
router.get('/listar-orden-compra/:producto/', po010210Controller.ListarOrdencompra);


module.exports = router;