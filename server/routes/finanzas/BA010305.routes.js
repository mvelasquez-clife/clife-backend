const express = require('express');
const router = express.Router();

const ba010305Controller = require('../../controllers/finanzas/BA010305.controller');

router.get('/combo-periodos/:empresa', ba010305Controller.ComboPeriodos);
router.get('/lista-planillas/:empresa/:cobrador/:periodo', ba010305Controller.ListaPlanillas);
router.post('/grafico-12', ba010305Controller.Grafico12);
router.post('/grafico-3', ba010305Controller.Grafico3);
router.post('/buscar-planilla-vigente', ba010305Controller.BuscaPlanillaVigente);
router.get('/lista-monedas/:empresa/:vendedor', ba010305Controller.CargarListaMonedas);
router.post('/crear-nueva-planilla', ba010305Controller.CrearPlanillaCobranza);
router.post('/abrir-planilla', ba010305Controller.AbrirPlanillaCobranza);
router.post('/cerrar-planilla', ba010305Controller.CerrarPlanillaCobranza);
router.get('/combo-tipos-cobro', ba010305Controller.ComboTiposCobro);
router.get('/lista-documentos-cliente/:empresa/:ruc', ba010305Controller.ListaDocumentosPagoCliente);
router.get('/combo-bancos', ba010305Controller.ComboBancos);

module.exports = router;
