const express = require('express');
const router = express.Router();
const po010410Controller = require('../../controllers/plantaindustrial/PO010410.controller');

router.get('/mostrar-especificacion/:empresa/:grupo/:clase/:tipo/',po010410Controller.mostrarespecificacion);
router.get('/mostrar-productos/:empresa/:especificacion/:version/',po010410Controller.mostrarproductos);
router.get('/mostrar-caract-detalle/:empresa/:especificacion/:version/',po010410Controller.mostrarcaractdet);
router.post('/mostrar-caract-general/',po010410Controller.mostrarcaractgen);
router.get('/mostrar-ensayo/:empresa/:especificacion/:version/',po010410Controller.mostrarensayo);
router.get('/mostrar-complemento/:empresa/:especificacion/:version/',po010410Controller.mostrarcomplemento);
router.get('/mostrar-historial/:empresa/:especificacion/:version/',po010410Controller.mostrarhistorial);
router.get('/mostrar-documento/:empresa/:especificacion/:version/',po010410Controller.mostrararchivos);
router.get('/mostrar-producto-por-grupo/:nva_clase/:buscar/',po010410Controller.mostrarprodporgrupo);
router.get('/mostrar-version/:empresa/:especificacion/',po010410Controller.mostrarversion);
router.post('/guardar-productos/',po010410Controller.guardarproductos);
router.get('/mostrar-producto-por-espec/:empresa/:especificacion/:version/',po010410Controller.mostrarprodporesp);
router.get('/mostrar-proveedor/:empresa/:buscar/',po010410Controller.mostrarproveedor);
router.get('/mostrar-nsoc/',po010410Controller.mostrarnsoc);
router.post('/guardar-cabecera/',po010410Controller.guardarcabecera);
router.get('/mostrar-lista-caract/',po010410Controller.mostrarcaractsel);
router.get('/mostrar-ensayo-por-grupo/:grupo/',po010410Controller.mostrarensayoporgrupo);
router.get('/mostrar-complemento-por-grupo/:grupo/:buscar/',po010410Controller.mostrarcomplporgrupo);
router.get('/mostrar-log/:empresa/:guia/:version/',po010410Controller.mostrarlog);
router.get('/mostrar-prod-espec-por-grupo/:empresa/:grupo/',po010410Controller.prodespecporgrupo);
router.get('/mostrar-espec-por-producto/:empresa/:producto/:grupo/',po010410Controller.especporProducto);
router.post('/guardar-caracteristicas/',po010410Controller.guardarcaract);
router.post('/guardar-ensayo/',po010410Controller.guardarensayo);
router.post('/guardar-historial/',po010410Controller.guardarhistorial);
router.post('/copiar-especificacion/',po010410Controller.copiarespecificacion);
router.post('/mostrar-especificacion-copia/',po010410Controller.mostrarespecopia);
router.post('/mostrar-especificacion-pt/',po010410Controller.mostrarespecpt);
router.get('/mostrar-reporte/:esp/:vers/:codigo/:marc/:sub/:nom/',po010410Controller.mostrarespecreporte);
router.get('/mostrar-reporte2/:esp/:vers/:codigo/:marc/:sub/:nom/:tipo/:arte/',po010410Controller.mostrarespecreporten2);
router.get('/mostrar-reporte-dt1/:nombre/:esp/:version/',po010410Controller.mostrareportdt1);
router.post('/mostrar-adjunto-espec/',po010410Controller.mostraradjporprod);
router.post('/mostrar-nueva-espec/',po010410Controller.mostrarnuevaEspec);
router.post('/mostrar-subir-adjunto/',po010410Controller.mostrarsubiradj);
router.post('/mostrar-producto-por-espec-adj/',po010410Controller.mostrarproducporespec);

module.exports = router;