const express = require('express');
const router = express.Router();

const po010210Controller = require('../../controllers/plantaindustrial/PO010210.controller');

router.get('/listar-productos/:buscar/', po010210Controller.ListaProductos);
router.post('/listar-detalle-prodhijo/', po010210Controller.FormularioProductohijo);
router.get('/listar-producto-padre/:producto/', po010210Controller.ListaProductopadre);
router.post('/subir-adjunto/', po010210Controller.SubirAdjunto);
router.post('/guardar-proyecto/', po010210Controller.GuardarProyecto);
router.get('/listar-proyectos/', po010210Controller.ListarProyecto);
router.post('/ver-img-producto/', po010210Controller.verimgProducto);
router.post('/extraer-serie/', po010210Controller.serieProyecto);
router.get('/listar-orden-compra/:producto/', po010210Controller.ListarOrdencompra);
router.get('/listar-productos-vinculados/:producto/', po010210Controller.ListarProdVinculados);
router.get('/listar-documentos/:producto/', po010210Controller.ListarDocumentos);
router.get('/listar-entidad/:codigo/', po010210Controller.ListarEntidad);
router.post('/guardar-usuarios/', po010210Controller.Guardarusuarios);
router.get('/listar-usuarios-asignado/:proyecto/', po010210Controller.ListarUsuariosAsignado);
router.get('/mostrar-detalle-proyecto/:proyecto/', po010210Controller.MostrardetalleProyecto);
router.get('/combo-usuarios/:proyecto/', po010210Controller.ComboUsuarios);
router.post('/guardar-documento/', po010210Controller.Guardardocumento);



module.exports = router;