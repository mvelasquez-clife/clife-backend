const express = require('express');
const router = express.Router();

const po010208Controller = require('../../controllers/plantaindustrial/PO010208.controller');

router.get('/mostrar-forma-cosmetica/',po010208Controller.mostrarformcosm);
router.get('/mostrar-clase/',po010208Controller.mostrarclase);
router.get('/mostrar-marca/',po010208Controller.mostrarmarca);
router.post('/mostrar-familia/',po010208Controller.mostrarfamilia);
router.post('/mostrar-subfamilia/',po010208Controller.mostrarsubfamilia);
router.post('/mostrar-submarca/',po010208Controller.mostrarsubmarca);
router.get('/mostrar-producto/:buscar/:co_clase/:co_familia/:co_subfamilia/:co_marca/:co_submarca/',po010208Controller.mostrarProductos);
router.post('/grabar-nsoc/',po010208Controller.grabarnsoc);
router.get('/mostrar-nso/:buscador/',po010208Controller.mostrarnso);
router.post('/cargar-pdf/',po010208Controller.CargarPdf);
router.post('/ver-pdf/',po010208Controller.abrirPDF);
router.get('/mostrar-productos-nso/:co_nso/',po010208Controller.mostrarproductosnso);
router.get('/mostrar-lista-formula/:empresa/:buscador/:tipo/:flag/',po010208Controller.mostrarlistaformula);
router.get('/mostrar-detalle-form-componente/:empresa/:formula/',po010208Controller.mostrardetformcomponente);
router.get('/mostrar-detalle-form-trazab/:empresa/:producto/',po010208Controller.mostrardetformtrazab);
router.get('/mostrar-historial/:empresa/:formula/:version/',po010208Controller.mostrarhistorial);
router.get('/mostrar-formacosmetica/',po010208Controller.mostrarformacosm);
router.post('/aprobar-formula/',po010208Controller.aprobarform);
router.get('/mostrar-especificacion/:empresa/',po010208Controller.mostrarespecificacion);
router.get('/mostrar-espec-producto/:empresa/:buscar/:co_clase/:co_familia/:co_subfamilia/:co_marca/:co_submarca/',po010208Controller.mostrarespproducto);
router.post('/grabar-forma-cosm/',po010208Controller.grabarformacosm);
router.get('/mostrar-nsoc-ven/',po010208Controller.mostrarnsocvenc);
router.get('/mostrar-producto-por-espec/:empresa/:especificacion/:version/',po010208Controller.mostrarprodporesp);
router.get('/mostrar-caract-detalle/:empresa/:especificacion/:version/',po010208Controller.mostrarcaractdet);
router.post('/mostrar-caract-general/',po010208Controller.mostrarcaractgen);
router.get('/mostrar-ensayo/:empresa/:especificacion/:version/',po010208Controller.mostrarensayo);
router.get('/mostrar-reporte/:codigo/:nombre/:esp/:marc/:version/',po010208Controller.mostrarespecreporte);
router.post('/mostrar-control-anio-det/',po010208Controller.mostrarcontrolreg);
router.post('/mostrar-control-anio/',po010208Controller.mostrarcontrolanio);
router.post('/mostrar-control-marca/',po010208Controller.mostrarcontrolmarc);
router.post('/mostrar-control-marca-det/',po010208Controller.mostrarmarcporanio);
router.post('/mostrar-control-vencimiento/',po010208Controller.mostrarcontrolvenc);
router.get('/mostrar-vencimiento-nso-por-periodo/:periodo/',po010208Controller.mostrarvencporreg);
router.get('/mostrar-drive-marcas/:empresa/',po010208Controller.mostrarmarcdrive);
router.post('/subir-adjunto/',po010208Controller.subirdocadjunto);
router.post('/mostrar-producto-por-nsoc/',po010208Controller.mostrarproductopornsoc);
router.get('/mostrar-documento-por-marca/:tipo_doc/:menu',po010208Controller.mostrardocpormarca);
router.post('/mostrar-documento-por-producto/',po010208Controller.mostraradjporprod)

module.exports = router;