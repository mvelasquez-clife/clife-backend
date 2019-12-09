const express = require('express');
const router = express.Router();

const vt010102Controller = require('../../controllers/ventas/VT010102.controller');

    /*router.get('/fzavta-vendedores/:empresa/:fzavta', vt010101Controller.CargaListaVendedoresFzavta);
    router.get('/fzavta-clientes-vendedor/:empresa/:vendedor/:fzavta', vt010101Controller.CargaListaClientesVendedorFzavta);
    router.get('/pagos-cliente-todos/:empresa/:cliente', vt010101Controller.CargaListaPagosPeriodos);
    router.get('/pagos-cliente-filtro/:alias/:empresa/:cliente/:fzavta/:vendedor', vt010101Controller.CargaListaUltimosPagosPeriodos);

    router.post('/asignar-linea-credito-masivo', vt010101Controller.AsignarLineaCreditoMasivo);
    router.post('/datos-solicitud-credito', vt010101Controller.CargaDatosSolicitudCredito);
    router.post('/asignar-linea-credito-cliente', vt010101Controller.AsignarLcredCliente);
*/
    router.get('/gridtiponego', vt010102Controller.GridTipoNegocio);
    router.get('/list_estadotp', vt010102Controller.Listadoestadotp);
    router.post('/savetnego', vt010102Controller.GuardarTipNego);
    router.post('/datos_cuota',vt010102Controller.FormCoutadata);
    router.post('/savecuotatnego',vt010102Controller.SaveCoutadata);
module.exports = router;