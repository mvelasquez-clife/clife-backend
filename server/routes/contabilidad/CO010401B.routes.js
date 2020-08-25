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
router.post('/guarda-detalle-voucher', co0201Controller.guardaDetalleVoucher);
//
router.get('/combo-monedas', co0201Controller.ComboMoneda);
router.get('/combo-tipo-docadmin/:libro', co0201Controller.ComboTipoDocAdmin);
router.get('/combo-tipo-entidad/:libro', co0201Controller.ComboTipoEntidad);
router.get('/combo-tipo-dociden', co0201Controller.ComboTipoDocIden);
router.post('/validar-nuevo-voucher', co0201Controller.ValidaNuevoVoucher);
router.post('/guarda-voucher', co0201Controller.GrabarVoucher);

module.exports = router;