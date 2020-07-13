const express = require('express');
const router = express.Router();

const co0201Controller = require('./../../controllers/contabilidad/CO010401B.controller');
    
router.get('/combo-periodos/:empresa', co0201Controller.ComboPeriodos);
router.get('/grid-vouchers/:empresa/:periodo/:libro/:voucher', co0201Controller.ListaVouchers);
router.get('/lista-tipos-docs/:empresa', co0201Controller.ListaTiposDoc);
router.get('/busca-documentos/:empresa/:opcion/:voucher/:desde/:hasta/:documento/:tipos', co0201Controller.ListaBuscaVoucher);
router.get('/grid-resumen-libros/:empresa', co0201Controller.GridResumenLibros);
router.get('/grid-resumen-vouchers/:empresa/:desde/:hasta/:libros', co0201Controller.GridResumenVouchers);
router.get('/grid-adjuntos-voucher/:empresa/:periodo/:libro', co0201Controller.GridAdjuntosVoucher);
router.post('/combo-libros', co0201Controller.ComboLibros);
router.post('/info-lista-vouchers', co0201Controller.InfoListaVouchers);
router.post('/info-voucher', co0201Controller.InformacionVoucher);

module.exports = router;