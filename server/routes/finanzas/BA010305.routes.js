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
router.post('/registra-pago-planilla', ba010305Controller.RegistraPagoPlanilla);
router.get('/combo-planillas/:vendedor/:empresa', ba010305Controller.ComboPlanillas);
router.post('/combo-cuentas', ba010305Controller.ComboCuentasBancarias);
router.post('/guarda-deposito', ba010305Controller.GuardarDeposito);
router.post('/eliminar-pago', ba010305Controller.EliminarPago);
router.get('/lista-depositos/:vendedor/:empresa/:periodo', ba010305Controller.ListaDepositos);
router.post('/grafico-depositos', ba010305Controller.GraficoDepositos);
router.get('/lista-depositos-conciliacion/:empresa/:planilla', ba010305Controller.ListaDepositosConciliacion);
router.get('/lista-extractos-conciliacion/:cuenta/:transaccion', ba010305Controller.ListaExtractosConciliacion);
router.post('/conciliar-depositos', ba010305Controller.ConciliarDepositos);
router.get('/combo-series/:empresa', ba010305Controller.ComboSeries);
router.post('/genera-recibo', ba010305Controller.GeneraRecibo);
router.get('/lista-recibos/:empresa/:recaudador/:recibo', ba010305Controller.ListaRecibos);

module.exports = router;
