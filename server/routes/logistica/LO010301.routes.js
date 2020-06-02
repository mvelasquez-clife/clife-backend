const express = require('express');
const router = express.Router();

const lo010301Controller = require('./../../controllers/logistica/LO010301.controller');
    router.post('/ls-datos-iniciales', lo010301Controller.DatosIniciales);
    router.post('/dt-info-proveedor', lo010301Controller.InfoProveedor);
    //
    router.get('/grid-docs-provisionados/:empresa/:entidad/:moneda/:tipoenti', lo010301Controller.DocumentosProvisionados);
    router.get('/grid-letras-provisionadas/:empresa/:documento', lo010301Controller.LetrasProvisionadas);
    router.get('/grid-notas-crdb/:empresa/:documento/:entidad', lo010301Controller.NotasCredDeb);
    router.get('/grid-ctacte-compras/:empresa/:documento/:entidad', lo010301Controller.CtaCteCompras);
    router.get('/grid-documentos-proveedor/:empresa/:tipoenti/:coclasifica/:entidad/:documento/:tpdocadmin', lo010301Controller.DocumentosProv);

    router.get('/grid-facturas-pagar/:empresa/:moneda/:columna/:desde/:hasta', lo010301Controller.FacturasPagar);
    router.get('/grid-letras-pagar/:empresa/:moneda/:columna/:desde/:hasta', lo010301Controller.LetrasPagar);
    router.get('/grid-pagos-transferencia/:empresa/:moneda/:columna/:desde/:hasta', lo010301Controller.PagosTransferencia);
    router.get('/grid-docs-aprob-cajas/:alias', lo010301Controller.DocsAprobCajas);
    router.get('/grid-docs-aprob-cancelar/:empresa', lo010301Controller.DocsAprobCancelar);
    router.get('/tipos-doc-admin', lo010301Controller.TiposDocAdmin);

module.exports = router;