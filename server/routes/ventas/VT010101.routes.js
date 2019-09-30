const express = require('express');
const router = express.Router();

const vt010101Controller = require('../../controllers/ventas/VT010101.controller');

    router.get('/fzavta-vendedores/:empresa/:fzavta', vt010101Controller.CargaListaVendedoresFzavta);
    router.get('/fzavta-clientes-vendedor/:empresa/:vendedor/:fzavta', vt010101Controller.CargaListaClientesVendedorFzavta);
    router.get('/pagos-cliente-todos/:empresa/:cliente', vt010101Controller.CargaListaPagosPeriodos);
    router.get('/pagos-cliente-filtro/:alias/:empresa/:cliente/:fzavta/:vendedor', vt010101Controller.CargaListaUltimosPagosPeriodos);

    router.post('/asignar-linea-credito-masivo', vt010101Controller.AsignarLineaCreditoMasivo);
    router.post('/datos-solicitud-credito', vt010101Controller.CargaDatosSolicitudCredito);
    router.post('/asignar-linea-credito-cliente', vt010101Controller.AsignarLcredCliente);

module.exports = router;