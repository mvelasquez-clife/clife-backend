const { resultSet } = require('./../../server/libs/db-oracle');
const db = require('./../../server/libs/db-oracle');
const pwmanager = require('./../../server/libs/password-manager');
const tknmanager = require('./../../server/libs/token-manager');
const xlsx = require('xlsx');
const DEFAULT_EMPRESA = 11;
const DEFAULT_VENDEDOR = 199;
const DEFAULT_TIPOLISTA = 5;
const DEFAULT_COLISTA = 32;

const WsController = {
    // vistas
    Home: (request, response) => {
        const path = require('path');
        response.render(path.resolve('client/views/ws/home.ejs'));
    },
    CargaDepositos: (request, response) => {
        const path = require('path');
        response.render(path.resolve('client/views/ws/depositos.ejs'));
    },
    ListaPedidosRealizados: async (request, response) => {
        const path = require('path');
        response.render(path.resolve('client/views/ws/pedidos.ejs'));
    },
    VerStockProductos: async (request, response) => {
        const path = require('path');
        response.render(path.resolve('client/views/ws/stocks.ejs'));
    },
    VerListaPrecios: async (request, response) => {
        const path = require('path');
        response.render(path.resolve('client/views/ws/lisprecios.ejs'));
    },
    VerPlanillasCobranza: async (request, response) => {
        const path = require('path');
        response.render(path.resolve('client/views/ws/planillas.ejs'));
    },
    IngresoManualPedidos: async (request, response) => {
        const path = require('path');
        response.render(path.resolve('client/views/ws/rgpedido.ejs'));
    },
    IngresoManualPedidosExtend: async (request, response) => {
        const path = require('path');
        response.render(path.resolve('client/views/ws/rgpedido-extend.ejs'));
    },
    ReportePedidos: async (request, response) => {
        const path = require('path');
        response.render(path.resolve('client/views/ws/reporte-pedidos.ejs'));
    },
    ReporteVentas: async (request, response) => {
        const path = require('path');
        response.render(path.resolve('client/views/ws/reporte-ventas.ejs'));
    },
    UploadArchivoDeposito: async (request, response) => {
        const formidable = require('formidable');
        const mv = require('mv');
        const fupload = require('../../server/fupload');
        const form = new formidable.IncomingForm();
        form.parse(request, async function (err, fields, files) {
            if (err) {
                response.json({
                    error: err.getMessage()
                });
                return;
            }
            const xlsx = require('xlsx');
            const pasarela = fields.pasarela;
            const oldpath = files.archivo.path;
            const newpath = fupload.tmppath + files.archivo.name;
            const alias = 'CCARRITOVTEX11';
            mv(oldpath, newpath, async function (mverr) {
                let arr_documentos = [];
                if (mverr) {
                    response.json({
                        error: mverr.getMessage()
                    });
                    return;
                }
                const fs = require('fs');
                if (pasarela == 'PU') {
                    let workbook = xlsx.readFile(newpath, {
                        type: 'binary', cellDates: true, dateNF: "dd/mm/yyyy;@", sheetStubs: true
                    });
                    let sheet_name_list = workbook.SheetNames;
                    let xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
                    // lee los datos útiles
                    let vDetalle = [];
                    let keys = [];
                    for (let row of xlData) {
                        if (keys.length == 0) {
                            keys = Object.keys(row);
                        }
                        // solo procesa las transacciones válidas
                        if (row[keys[12]] == 'CAPTURED') {
                            let transaccion = row[keys[0]];
                            let orderid = row[keys[1]];
                            // let fcreacion = row[keys[2]];
                            let fcreacion = new Date();
                            // let factualiza = row[keys[3]];
                            let factualiza = new Date();
                            let vreferencia = row[keys[4]];
                            let nom_cliente = row[keys[6]];
                            let email = row[keys[7]];
                            let monto = row[keys[8]];
                            let moneda = row[keys[9]];
                            let valor_proceso = row[keys[10]];
                            let moneda_proceso = row[keys[11]];
                            let medio_pago = row[keys[13]];
                            let tipo_tarjeta = row[keys[14]];
                            let banco_emisor = row[keys[16]];
                            let trazabilidad = row['C?digo de trazabilidad'];
                            let aliado = row['id aliado'] ? row['id aliado'] : '';
                            // formatea las fechas
                            let referencia = vreferencia.split('-')[1];
                            let creacion = fcreacion.getDate().toString().padStart(2,'0') + "-" + (fcreacion.getMonth() + 1).toString().padStart(2,'0') + "-" + fcreacion.getFullYear() + " " + fcreacion.getHours().toString().padStart(2,'0') + ":" + fcreacion.getMinutes().toString().padStart(2,'0');
                            let actualiza = factualiza.getDate().toString().padStart(2,'0') + "-" + (factualiza.getMonth() + 1).toString().padStart(2,'0') + "-" + factualiza.getFullYear() + " " + factualiza.getHours().toString().padStart(2,'0') + ":" + factualiza.getMinutes().toString().padStart(2,'0');
                            // registra en tabla detalle
                            let query = "call pack_sistmovil.sp_reg_trs_payu (:o_codigo,:o_mensaje,:p_transaccion,:p_orderid,:p_creacion,:p_actualiza,:p_referencia,:p_nom_cliente,:p_email,:p_monto,:p_moneda,:p_valor_proceso,:p_moneda_proceso,:p_medio_pago,:p_tipo_tarjeta,:p_banco_emisor,:p_trazabilidad,:p_aliado)";
                            let params = [
                                { name: 'o_codigo', io: 'out', type: 'number' },
                                { name: 'o_mensaje', io: 'out', type: 'string' },
                                { name: 'p_transaccion', io: 'in', value: transaccion },
                                { name: 'p_orderid', io: 'in', value: orderid },
                                { name: 'p_creacion', io: 'in', value: creacion },
                                { name: 'p_actualiza', io: 'in', value: actualiza },
                                { name: 'p_referencia', io: 'in', value: vreferencia },
                                { name: 'p_nom_cliente', io: 'in', value: nom_cliente },
                                { name: 'p_email', io: 'in', value: email },
                                { name: 'p_monto', io: 'in', value: monto },
                                { name: 'p_moneda', io: 'in', value: moneda },
                                { name: 'p_valor_proceso', io: 'in', value: valor_proceso },
                                { name: 'p_moneda_proceso', io: 'in', value: moneda_proceso },
                                { name: 'p_medio_pago', io: 'in', value: medio_pago },
                                { name: 'p_tipo_tarjeta', io: 'in', value: tipo_tarjeta },
                                { name: 'p_banco_emisor', io: 'in', value: banco_emisor },
                                { name: 'p_trazabilidad', io: 'in', value: trazabilidad },
                                { name: 'p_aliado', io: 'in', value: aliado }
                            ];
                            let result = await db.resultSet(query, params);
                            if (result.o_codigo == 1) vDetalle.push([monto, referencia, transaccion].join('|'));
                            arr_documentos.push(referencia);
                        }
                    }
                    let coplanilla = 'X';
                    if (vDetalle.length > 0) {
                        let detalle = vDetalle.join('@');
                        // llama al pinche sp xd
                        let params = [
                            { name: 'o_codigo', io: 'out', type: 'number' },
                            { name: 'o_mensaje', io: 'out', type: 'string' },
                            { name: 'o_planilla', io: 'out', type: 'cursor' },
                            { name: 'p_alias', io: 'in', value: alias },
                            { name: 'p_detalle', io: 'in', value: detalle },
                            { name: 'p_pasarela', io: 'in', value: pasarela }
                        ];
                        let query = 'call pack_sistmovil.sp_registra_pago_planilla (:o_codigo, :o_mensaje, :o_planilla, :p_alias, to_clob(:p_detalle), :p_pasarela)';
                        let result = await db.resultSet(query, params);
                        if (result.error) {
                            response.json({
                                error: result.error
                            });
                            return;
                        }
                        if (result.o_codigo == -1) {
                            response.json({
                                error: result.o_mensaje
                            });
                            return;
                        }
                        if (result.o_codigo == 0) {
                            response.json({
                                error: 'Ocurrió un error al registrar los pagos'
                            });
                            return;
                        }
                        coplanilla = result.o_mensaje;
                    }
                    // carga planillas de los documentos
                    let params = [
                        { name: 'p_detalle', io: 'in', value: arr_documentos.join('@') },
                        { name: 'o_datos', io: 'out', type: 'cursor' }
                    ];
                    let query = 'call pack_web_service.sp_reporte_transacciones (:p_detalle, :o_datos)';
                    let result = await db.resultSet(query, params);
                    // devuelve los datos plox
                    response.json({
                        planilla: coplanilla,
                        detalle: result.o_datos
                    });
                    return;
                }
                else if (pasarela == 'PE') {
                    let workbook = xlsx.readFile(newpath, {
                        type: 'binary', cellDates: true, dateNF: "dd/mm/yyyy;@"
                    });
                    let sheet_name_list = workbook.SheetNames;
                    let xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
                    // lee los datos útiles
                    let vDetalle = [];
                    for (var row of xlData) {
                        let orden_comercio = row['__EMPTY_3'];
                        if (orden_comercio && orden_comercio.indexOf('-') > -1) {
                            // captura las demas variables
                            let cip = row['__EMPTY'];
                            let moneda = row['__EMPTY_6'];
                            let monto = row['__EMPTY_7'];
                            let femision = row['__EMPTY_9'];
                            let fcancelacion = row['__EMPTY_11'];
                            let origen_cancela = row['__EMPTY_12'];
                            let agencia = row['__EMPTY_13'] || '';
                            let nom_cliente = row['__EMPTY_14'];
                            let ape_cliente = row['__EMPTY_15'];
                            let desc_cliente = row['__EMPTY_16'];
                            let tipo_doc = row['__EMPTY_17'];
                            let documento_iden = row['__EMPTY_18'];
                            let alias_cliente = row['__EMPTY_19'];
                            let telefono = row['__EMPTY_20'];
                            let concepto_pago = row['__EMPTY_21'];
                            let orderid = row['__EMPTY_26'];
                            let email = row['__EMPTY_27'];
                            // formatea las fechas
                            let emision = femision.getDate().toString().padStart(2,'0') + "-" + (femision.getMonth() + 1).toString().padStart(2,'0') + "-" + femision.getFullYear() + " " + femision.getHours().toString().padStart(2,'0') + ":" + femision.getMinutes().toString().padStart(2,'0');
                            let cancelacion = fcancelacion.getDate().toString().padStart(2,'0') + "-" + (fcancelacion.getMonth() + 1).toString().padStart(2,'0') + "-" + fcancelacion.getFullYear() + " " + fcancelacion.getHours().toString().padStart(2,'0') + ":" + fcancelacion.getMinutes().toString().padStart(2,'0');
                            // registra en tabla detalle
                            let query = "call pack_sistmovil.sp_reg_trs_pagoefectivo (:o_codigo,:p_cip,:p_orden_comercio,:p_moneda,:p_monto,:p_emision,:p_cancelacion,:p_origen_cancela,:p_agencia,:p_nom_cliente,:p_ape_cliente,:p_desc_cliente,:p_tipo_doc,:p_documento_iden,:p_alias_cliente,:p_telefono,:p_concepto_pago,:p_orderid,:p_email)";
                            let params = [
                                { name: 'o_codigo', io: 'out', type: 'number' },
                                { name: 'p_cip', io: 'in', value: cip },
                                { name: 'p_orden_comercio', io: 'in', value: orden_comercio },
                                { name: 'p_moneda', io: 'in', value: moneda },
                                { name: 'p_monto', io: 'in', value: monto },
                                { name: 'p_emision', io: 'in', value: emision },
                                { name: 'p_cancelacion', io: 'in', value: cancelacion },
                                { name: 'p_origen_cancela', io: 'in', value: origen_cancela },
                                { name: 'p_agencia', io: 'in', value: agencia ? agencia : '' },
                                { name: 'p_nom_cliente', io: 'in', value: nom_cliente },
                                { name: 'p_ape_cliente', io: 'in', value: ape_cliente },
                                { name: 'p_desc_cliente', io: 'in', value: desc_cliente },
                                { name: 'p_tipo_doc', io: 'in', value: tipo_doc },
                                { name: 'p_documento_iden', io: 'in', value: documento_iden },
                                { name: 'p_alias_cliente', io: 'in', value: alias_cliente },
                                { name: 'p_telefono', io: 'in', value: telefono },
                                { name: 'p_concepto_pago', io: 'in', value: concepto_pago },
                                { name: 'p_orderid', io: 'in', value: orderid },
                                { name: 'p_email', io: 'in', value: email }
                            ];
                            let result = await db.resultSet(query, params);
                            if (result.o_codigo == 1) vDetalle.push([monto, orderid, cip].join('|'));
                            arr_documentos.push(orderid);
                        }
                    }
                    let coplanilla = 'X';
                    if (vDetalle.length > 0) {
                        let detalle = vDetalle.join('@');
                        // llama al pinche sp xd
                        let params = [
                            { name: 'o_codigo', io: 'out', type: 'number' },
                            { name: 'o_mensaje', io: 'out', type: 'string' },
                            { name: 'o_planilla', io: 'out', type: 'cursor' },
                            { name: 'p_alias', io: 'in', value: alias },
                            { name: 'p_detalle', io: 'in', value: detalle },
                            { name: 'p_pasarela', io: 'in', value: pasarela }
                        ];
                        let query = 'call pack_sistmovil.sp_registra_pago_planilla (:o_codigo, :o_mensaje, :o_planilla, :p_alias, :p_detalle, :p_pasarela)';
                        let result = await db.resultSet(query, params);
                        if (result.error) {
                            response.json({
                                error: result.error
                            });
                            return;
                        }
                        if (result.o_codigo == -1) {
                            response.json({
                                error: result.o_mensaje
                            });
                            return;
                        }
                        if (result.o_codigo == 0) {
                            response.json({
                                error: 'Ocurrió un error al registrar los pagos'
                            });
                            return;
                        }
                        coplanilla = result.o_mensaje;
                    }
                    // carga planillas de los documentos
                    let params = [
                        { name: 'p_detalle', io: 'in', value: arr_documentos.join('@') },
                        { name: 'o_datos', io: 'out', type: 'cursor' }
                    ];
                    let query = 'call pack_web_service.sp_reporte_transacciones (:p_detalle, :o_datos)';
                    let result = await db.resultSet(query, params);
                    // devuelve los datos plox
                    response.json({
                        planilla: coplanilla,
                        detalle: result.o_datos
                    });
                    return;
                }
                else {
                    response.json({
                        error: 'Pasarela "' + pasarela + '" no soportada'
                    });
                }
                fs.unlinkSync(newpath);
                return;
            });
        });
    },
    CargaPedidosRealizados: async (request, response) => {
        const { desde, hasta, cliente } = request.query;
        const empresa = 11;
        let params = [
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'desde', io: 'in', value: desde },
            { name: 'hasta', io: 'in', value: hasta },
            { name: 'cliente', io: 'in', value: cliente },
            { name: 'codigo', io: 'out', type: 'number' },
            { name: 'mensaje', io: 'out', type: 'string' },
            { name: 'pedidos', io: 'out', type: 'cursor' }
        ];
        let result = await db.resultSet('call pack_web_service.sp_lista_pedidos(:empresa, :desde, :hasta, :cliente, :codigo, :mensaje, :pedidos)', params);
        if (result.error) {
            response.json({
                error: result.error
            });
            return;
        }
        if (result.codigo == -1) {
            response.json({
                error: result.out.mensaje
            });
            return;
        }
        response.json({
            pedidos: result.pedidos
        });
    },
    DatosPedido: async (request, response) => {
        const { pedido } = request.query;
        const empresa = 11;
        let params = [
            { name: 'pedido', io: 'in', value: pedido },
            { name: 'codigo', io: 'out', type: 'number' },
            { name: 'mensaje', io: 'out', type: 'string' },
            { name: 'cabecera', io: 'out', type: 'cursor' },
            { name: 'detalle', io: 'out', type: 'cursor' }
        ];
        let result = await db.resultSet('call pack_web_service.sp_detalle_pedido(:pedido, :codigo, :mensaje, :cabecera, :detalle)', params);
        if (result.error) {
            response.json({
                error: result.error
            });
            return;
        }
        if (result.codigo == -1) {
            response.json({
                error: result.out.mensaje
            });
            return;
        }
        if (result.cabecera.length == 0) {
            response.json({
                error: 'El pedido es incorrecto'
            });
            return;
        }
        var cabecera = result.cabecera[0];
        response.json({
            cabecera: cabecera,
            detalle: result.detalle
        });
    },
    KardexProductos: async (request, response) => {
        let { empresa, tipo, lista, almacen } = request.query;
        if (typeof tipo == 'undefined' || typeof lista == 'undefined' || typeof almacen == 'undefined') {
            response.status(401).json({
                error: 'Parámetros incorrectos'
            });
            return;
        }
        let params = [
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'tipo', io: 'in', value: tipo },
            { name: 'lista', io: 'in', value: lista },
            { name: 'almacen', io: 'in', value: almacen },
            { name: 'rs', io: 'out', type: 'cursor' }
        ];
        let result = await db.resultSet('call pack_web_service.sp_kardex (:empresa, :tipo, :lista, :almacen, :rs)', params);
        if (result.error) {
            response.status(401).json({
                error: result.error
            });
            return;
        }
        response.json({
            data: result.rs
        });
    },
    DetalleListas: async (request, response) => {
        let empresa = DEFAULT_EMPRESA;
        let tipo = DEFAULT_TIPOLISTA;
        let lista = DEFAULT_COLISTA;
        let params = [
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'tipo', io: 'in', value: tipo },
            { name: 'lista', io: 'in', value: lista },
            { name: 'rs', io: 'out', type: 'cursor' }
        ];
        let result = await db.resultSet('call pack_web_service.sp_detalle_listas (:empresa, :tipo, :lista, :rs)', params);
        if (result.error) {
            response.status(401).json({
                error: result.error
            });
            return;
        }
        response.json({
            listas: result.rs
        });
    },
    CargaListaPrecios: async (request, response) => {
        const { lista } = request.query;
        let empresa = DEFAULT_EMPRESA;
        let tipo = DEFAULT_TIPOLISTA;
        let colista = DEFAULT_COLISTA;
        let query = "call pack_web_service.sp_lista_precios (:empresa, :tipo, :lista, :rs, :o_nombre, :o_serie, :o_desde, :o_hasta, :serie)";
        let params = [
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'tipo', io: 'in', value: tipo },
            { name: 'lista', io: 'in', value: colista },
            { name: 'rs', io: 'out', type: 'cursor' },
            { name: 'o_nombre', io: 'out', type: 'string' },
            { name: 'o_serie', io: 'out', type: 'number' },
            { name: 'o_desde', io: 'out', type: 'string' },
            { name: 'o_hasta', io: 'out', type: 'string' },
            { name: 'serie', io: 'in', value: lista }
        ];
        let result = await db.resultSet(query, params);
        if (result.error) {
            response.status(401).json({
                error: result.error
            });
            return;
        }
        // corrige la ptmr
        let rsOut = [];
        for (let row of result.rs) {
            row.precVentaSinIgv = row.precVentaSinIgv.toFixed(2);
            rsOut.push(row);
        }
        // fin
        response.json({
            data: rsOut,
            lista: result.o_nombre,
            serie: result.o_serie,
            desde: result.o_desde,
            hasta: result.o_hasta
        });
    },
    // apis
    RegistraUsuario: async (request, response) => {
        const { empresa, alias, clave } = request.query;
        let hash = await pwmanager.encriptar(clave);
        if (hash.error) {
            response.json({
                error: hash.error
            });
        }
        let params = [
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'alias', io: 'in', value: alias },
            { name: 'password', io: 'in', value: hash.result },
            { name: 'codigo', io: 'out', type: 'number' },
            { name: 'mensaje', io: 'out', type: 'string' }
        ];
        let result = await db.statement('call pack_web_service.sp_registra_usuario(:empresa, :alias, :password, :codigo, :mensaje)', params);
        if (result.error) {
            response.json({
                error: result.error
            });
            return;
        }
        if (result.out.codigo == 0) {
            response.json({
                error: result.out.mensaje
            });
            return;
        }
        response.json({
            success: true
        });
    },
    ObtenerToken: async (request, response) => {
        const { alias, empresa, clave } = request.query;
        if (typeof empresa == 'undefined') {
            empresa = DEFAULT_EMPRESA;
        }
        let params = [
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'alias', io: 'in', value: alias },
            { name: 'codigo', io: 'out', type: 'number' },
            { name: 'mensaje', io: 'out', type: 'string' }
        ];
        let result = await db.statement('call pack_web_service.sp_autenticar (:empresa, :alias, :codigo, :mensaje)', params);
        if (result.error) {
            response.status(401).json({
                error: result.error
            });
            return;
        }
        if (result.out.codigo == 0) {
            response.status(401).json({
                error: result.out.mensaje
            });
            return;
        }
        let compare = await pwmanager.validar(clave, result.out.mensaje);
        if (compare.error) {
            response.status(401).json({
                error: compare.error
            });
            return;
        }
        if (!compare.result) {
            response.status(401).json({
                error: 'La contraseña es incorrecta'
            });
            return;
        }
        // devuelve el token pex
        let tokenData = {
            id: result.out.codigo,
            empresa: empresa,
            alias: alias
        };
        let token = tknmanager.GeneraToken(tokenData);
        response.json({
            token: token
        });
    },
    ListaPrecios: async (request, response) => {
        let token = request.headers['authorization'];
        if (!token) {
            response.status(401).send({
                error: 'Es necesario el token de autenticación'
            });
            return;
        }
        let tokenData = tknmanager.ObtenerDatos(token);
        if (tokenData.error) {
            response.status(401).send({
                error: tokenData.error
            });
            return;
        }
        let { empresa, tipo, lista } = request.query;
        if (typeof tipo == 'undefined' || typeof lista == 'undefined') {
            response.status(401).json({
                error: 'Parámetros incorrectos'
            });
            return;
        }
        if (typeof empresa == 'undefined') {
            empresa = tokenData.empresa;
        }
        let params = [
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'tipo', io: 'in', value: tipo },
            { name: 'lista', io: 'in', value: lista },
            { name: 'rs', io: 'out', type: 'cursor' },
            { name: 'o_nombre', io: 'out', type: 'string' },
            { name: 'o_serie', io: 'out', type: 'number' },
            { name: 'o_desde', io: 'out', type: 'string' },
            { name: 'o_hasta', io: 'out', type: 'string' }
        ];
        let result = await db.resultSet('call pack_web_service.sp_lista_precios (:empresa, :tipo, :lista, :rs, :o_nombre, :o_serie, :o_desde, :o_hasta)', params);
        if (result.error) {
            response.status(401).json({
                error: result.error
            });
            return;
        }
        // corrige la ptmr
        let rsOut = [];
        for (let row of result.rs) {
            row.precVentaSinIgv = row.precVentaSinIgv.toFixed(2);
            rsOut.push(row);
        }
        // fin
        response.json({
            data: rsOut,
            lista: result.o_nombre,
            serie: result.o_serie,
            desde: result.o_desde,
            hasta: result.o_hasta
        });
    },
    ListaAlmacenes: async (request, response) => {
        let token = request.headers['authorization'];
        if (!token) {
            response.status(401).send({
                error: 'Es necesario el token de autenticación'
            })
            return;
        }
        let tokenData = tknmanager.ObtenerDatos(token);
        if (tokenData.error) {
            response.status(401).send({
                error: tokenData.error
            });
            return;
        }
        let { empresa, tipo } = request.query;
        if (typeof tipo == 'undefined') {
            response.status(401).json({
                error: 'Parámetros incorrectos'
            });
            return;
        }
        if (typeof empresa == 'undefined') {
            empresa = tokenData.empresa;
        }
        let params = [
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'tipo', io: 'in', value: tipo },
            { name: 'rs', io: 'out', type: 'cursor' }
        ];
        let result = await db.resultSet('call pack_web_service.sp_lista_almacenes (:empresa, :tipo, :rs)', params);
        if (result.error) {
            response.status(401).json({
                error: result.error
            });
            return;
        }
        response.json({
            data: result.rs
        });
    },
    Kardex: async (request, response) => {
        let token = request.headers['authorization'];
        if (!token) {
            response.status(401).send({
                error: 'Es necesario el token de autenticación'
            })
            return;
        }
        let tokenData = tknmanager.ObtenerDatos(token);
        if (tokenData.error) {
            response.status(401).send({
                error: tokenData.error
            });
            return;
        }
        let { empresa, tipo, lista, almacen } = request.query;
        if (typeof tipo == 'undefined' || typeof lista == 'undefined' || typeof almacen == 'undefined') {
            response.status(401).json({
                error: 'Parámetros incorrectos'
            });
            return;
        }
        if (typeof empresa == 'undefined') {
            empresa = tokenData.empresa;
        }
        let params = [
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'tipo', io: 'in', value: tipo },
            { name: 'lista', io: 'in', value: lista },
            { name: 'almacen', io: 'in', value: almacen },
            { name: 'rs', io: 'out', type: 'cursor' }
        ];
        let result = await db.resultSet('call pack_web_service.sp_kardex (:empresa, :tipo, :lista, :almacen, :rs)', params);
        if (result.error) {
            response.status(401).json({
                error: result.error
            });
            return;
        }
        response.json({
            data: result.rs
        });
    },
    Tracking: async (request, response) => {
        let token = request.headers['authorization'];
        if (!token) {
            response.status(401).send({
                error: 'Es necesario el token de autenticación'
            })
            return;
        }
        let tokenData = tknmanager.ObtenerDatos(token);
        if (tokenData.error) {
            response.status(401).send({
                error: tokenData.error
            });
            return;
        }
        console.log(tokenData);
        let { empresa, pedido } = request.query;
        if (typeof pedido == 'undefined') {
            response.status(401).json({
                error: 'Parámetros incorrectos'
            });
            return;
        }
        if (typeof empresa == 'undefined') {
            empresa = tokenData.empresa;
        }
        let params = [
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'codigo', io: 'in', value: pedido },
            { name: 'estado', io: 'out', type: 'string' },
            { name: 'pedido', io: 'out', type: 'string' },
            { name: 'fechaPedido', io: 'out', type: 'string' },
            { name: 'picking', io: 'out', type: 'string' },
            { name: 'packing', io: 'out', type: 'string' },
            { name: 'fechaPacking', io: 'out', type: 'string' },
            { name: 'facturado', io: 'out', type: 'string' },
            { name: 'fechaFacturado', io: 'out', type: 'string' },
            { name: 'enviado', io: 'out', type: 'string' },
            { name: 'fechaEnvio', io: 'out', type: 'string' }
// o_estado, o_pedido, o_fechaped, o_picking, o_packing, o_fepacking, o_facturacion, o_fefacturacion, o_enviado, o_feenvio
        ];
        let result = await db.statement('call pack_web_service.sp_status_pedido (:empresa, :codigo, :estado, :pedido, :fechaPedido, :picking, :packing, ' +
            ':fechaPacking, :facturado, :fechaFacturado, :enviado, :fechaEnvio)', params);
        if (result.error) {
            response.status(401).json({
                error: result.error
            });
            return;
        }
        result.out.picking = result.out.picking == 'S' ? true : false;
        result.out.packing = result.out.packing == 'S' ? true : false;
        result.out.facturado = result.out.facturado == 'S' ? true : false;
        result.out.enviado = result.out.enviado == 'S' ? true : false;
        response.json({
            data: result.out
        });
    },
    ListaTiposDocumento: async (request, response) => {
        let token = request.headers['authorization'];
        if (!token) {
            response.status(401).send({
                error: 'Es necesario el token de autenticación'
            })
            return;
        }
        let params = [
            { name: 'rs', io: 'out', type: 'cursor' }
        ];
        let result = await db.resultSet('call pack_web_service.sp_tipos_docu_iden (:rs)', params);
        if (result.error) {
            response.status(401).json({
                error: result.error
            });
            return;
        }
        response.json({
            data: result.rs
        });
    },
    RegistraCliente: async (request, response) => {
        let token = request.headers['authorization'];
        if (!token) {
            response.status(401).send({
                error: 'Es necesario el token de autenticación'
            })
            return;
        }
        let tokenData = tknmanager.ObtenerDatos(token);
        if (tokenData.error) {
            response.status(401).send({
                error: tokenData.error
            });
            return;
        }
        let { empresa, rucdni, nombre1, nombre2, nombre3, tipodoc, email, telefono } = request.body;
        if (typeof rucdni == 'undefined' || typeof nombre1 == 'undefined' || typeof nombre2 == 'undefined' ||
            typeof tipodoc == 'undefined' || typeof email == 'undefined' || typeof telefono == 'undefined') {
            response.status(401).json({
                error: 'Parámetros incorrectos'
            });
            return;
        }
        if (typeof empresa == 'undefined') {
            empresa = tokenData.empresa;
        }
        let params = [
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'rucdni', io: 'in', value: rucdni },
            { name: 'nombre1', io: 'in', value: nombre1 },
            { name: 'nombre2', io: 'in', value: nombre2 },
            { name: 'nombre3', io: 'in', value: nombre3 },
            { name: 'tipodoc', io: 'in', value: tipodoc },
            { name: 'email', io: 'in', value: email },
            { name: 'telefono', io: 'in', value: telefono },
            { name: 'codigo', io: 'out', type: 'number' },
            { name: 'mensaje', io: 'out', type: 'string' }
        ];
        let query = 'call pack_web_service.sp_registra_cliente (:empresa, :rucdni, :nombre1, :nombre2, :nombre3, :tipodoc, :email, :telefono, :codigo, :mensaje)';
        let result = await db.statement(query, params);
        if (result.error) {
            response.json({
                error: result.error
            });
            return;
        }
        if (result.out.codigo == 0) {
            response.json({
                error: result.out.mensaje
            });
            return;
        }
        response.json({
            result: 'OK'
        });
    },
    ListaDepartamentos: async (request, response) => {
        let token = request.headers['authorization'];
        if (!token) {
            response.status(401).send({
                error: 'Es necesario el token de autenticación'
            })
            return;
        }
        let params = [
            { name: 'rs', io: 'out', type: 'cursor' }
        ];
        let query = 'call pack_web_service.sp_lista_departamentos (:rs)';
        let result = await db.resultSet(query, params);
        if (result.error) {
            response.json({
                error: result.error
            });
            return;
        }
        response.json({
            data: result.rs
        });
    },
    ListaProvincias: async (request, response) => {
        let token = request.headers['authorization'];
        if (!token) {
            response.status(401).send({
                error: 'Es necesario el token de autenticación'
            })
            return;
        }
        const { departamento } = request.query;
        if (typeof departamento == 'undefined') {
            response.status(401).json({
                error: 'Parámetros incorrectos'
            });
            return;
        }
        let params = [
            { name: 'departamento', io: 'in', value: departamento },
            { name: 'rs', io: 'out', type: 'cursor' }
        ];
        let query = 'call pack_web_service.sp_lista_provincias (:rs, :departamento)';
        let result = await db.resultSet(query, params);
        if (result.error) {
            response.json({
                error: result.error
            });
            return;
        }
        response.json({
            data: result.rs
        });
    },
    ListaDistritos: async (request, response) => {
        let token = request.headers['authorization'];
        if (!token) {
            response.status(401).send({
                error: 'Es necesario el token de autenticación'
            })
            return;
        }
        const { departamento, provincia } = request.query;
        if (typeof departamento == 'undefined' || typeof provincia == 'undefined') {
            response.status(401).json({
                error: 'Parámetros incorrectos'
            });
            return;
        }
        let params = [
            { name: 'provincia', io: 'in', value: provincia },
            { name: 'departamento', io: 'in', value: departamento },
            { name: 'rs', io: 'out', type: 'cursor' }
        ];
        let query = 'call pack_web_service.sp_lista_distritos (:rs, :provincia, :departamento)';
        let result = await db.resultSet(query, params);
        if (result.error) {
            response.json({
                error: result.error
            });
            return;
        }
        response.json({
            data: result.rs
        });
    },
    ListaViasZonas: async (request, response) => {
        let token = request.headers['authorization'];
        if (!token) {
            response.status(401).send({
                error: 'Es necesario el token de autenticación'
            })
            return;
        }
        let tokenData = tknmanager.ObtenerDatos(token);
        if (tokenData.error) {
            response.status(401).send({
                error: tokenData.error
            });
            return;
        }
        let params = [
            { name: 'vias', io: 'out', type: 'cursor' },
            { name: 'zonas', io: 'out', type: 'cursor' }
        ];
        let query = 'call pack_web_service.sp_lista_vias_zonas (:vias, :zonas)';
        let result = await db.resultSet(query, params);
        if (result.error) {
            response.json({
                error: result.error
            });
            return;
        }
        response.json(result);
    },
    DireccionesCliente: async (request, response) => {
        let token = request.headers['authorization'];
        if (!token) {
            response.status(401).send({
                error: 'Es necesario el token de autenticación'
            })
            return;
        }
        let tokenData = tknmanager.ObtenerDatos(token);
        if (tokenData.error) {
            response.status(401).send({
                error: tokenData.error
            });
            return;
        }
        const { rucdni } = request.query;
        if (typeof rucdni == 'undefined') {
            response.status(401).json({
                error: 'Parámetros incorrectos'
            });
            return;
        }
        let params = [
            { name: 'rucdni', io: 'in', value: rucdni },
            { name: 'rs', io: 'out', type: 'cursor' }
        ];
        let query = 'call pack_web_service.sp_direcciones_cliente (:rucdni, :rs)';
        let result = await db.resultSet(query, params);
        if (result.error) {
            response.json({
                error: result.error
            });
            return;
        }
        response.json({
            data: result.rs
        });
    },
    RegistraDireccion: async (request, response) => {
        let token = request.headers['authorization'];
        if (!token) {
            response.status(401).send({
                error: 'Es necesario el token de autenticación'
            })
            return;
        }
        let tokenData = tknmanager.ObtenerDatos(token);
        if (tokenData.error) {
            response.status(401).send({
                error: tokenData.error
            });
            return;
        }
        const json = JSON.stringify(request.body);
        // log de la direccion
        let query = 'call pack_web_service.sp_log_direccion (:empresa, :json, :codigo, :mensaje)';
        let params = [
            { name: 'empresa', io: 'in', value: tokenData.empresa },
            { name: 'json', io: 'in', value: json },
            { name: 'codigo', io: 'out', type: 'number' },
            { name: 'mensaje', io: 'out', type: 'string' }
        ];
        await db.statement(query, params);
// ubigeo,covia,nomvia,cozona,nomzona,numero,interior,referencia,rucdni,o_codigo,o_mensaje 
        const { ubigeo, direccion, referencia, rucdni } = request.body;
        if (typeof ubigeo == 'undefined' || typeof direccion == 'undefined' || typeof referencia == 'undefined' || typeof rucdni == 'undefined') {
            response.status(401).json({
                error: 'Parámetros incorrectos'
            });
            return;
        }
        params = [
            { name: 'codigo', io: 'out', type: 'number' },
            { name: 'mensaje', io: 'out', type: 'string' },
            { name: 'ubigeo', io: 'in', value: ubigeo },
            { name: 'direccion', io: 'in', value: direccion },
            { name: 'referencia', io: 'in', value: referencia },
            { name: 'rucdni', io: 'in', value: rucdni }
        ];
        query = 'call pack_web_service.sp_registra_direccion (:codigo, :mensaje, :ubigeo, :direccion, :referencia, :rucdni)';
        let result = await db.statement(query, params);
        if (result.error) {
            response.json({
                error: result.error
            });
            return;
        }
        if (result.out.codigo == 0) {
            response.json({
                error: result.out.mensaje
            });
            return;
        }
        response.json({
            result: {
                id: result.out.codigo
            }
        });
    },
    DatosCliente: async (request, response) => {
        let token = request.headers['authorization'];
        if (!token) {
            response.status(401).send({
                error: 'Es necesario el token de autenticación'
            })
            return;
        }
        let tokenData = tknmanager.ObtenerDatos(token);
        if (tokenData.error) {
            response.status(401).send({
                error: tokenData.error
            });
            return;
        }
        const { cliente } = request.query;
        if (typeof cliente == 'undefined') {
            response.status(401).json({
                error: 'Parámetros incorrectos'
            });
            return;
        }
        let params = [
            { name: 'dni', io: 'in', value: cliente },
            { name: 'empresa', io: 'in', value: tokenData.empresa },
            { name: 'rucdni', io: 'out', type: 'string' },
            { name: 'rsocial', io: 'out', type: 'string' },
            { name: 'ncomercial', io: 'out', type: 'string' },
            { name: 'email', io: 'out', type: 'string' },
            { name: 'telefono', io: 'out', type: 'string' }
        ];
        let query = 'call pack_web_service.sp_datos_cliente (:dni, :empresa, :rucdni, :rsocial, :ncomercial, :email, :telefono)';
        let result = await db.statement(query, params);
        if (result.error) {
            response.json({
                error: result.error
            });
            return;
        }
        if (result.out.rucdni == '0') {
            response.json({
                error: result.out.rsocial
            });
            return;
        }
        response.json({
            result: result.out
        });
    },
    RegistraPedido: async (request, response) => {
        let token = request.headers['authorization'];
        if (!token) {
            response.status(401).send({
                error: 'Es necesario el token de autenticación'
            })
            return;
        }
        let tokenData = tknmanager.ObtenerDatos(token);
        if (tokenData.error) {
            response.status(401).send({
                error: tokenData.error
            });
            return;
        }
        let jsparams = JSON.stringify(request.body);
        const { cliente, direccion, fecha, factura, flete, orderid, sispago, observaciones, detalle, pagoid, fepago, deposito, comision, igv, pventa } = request.body;
        if (typeof cliente == 'undefined' || typeof direccion == 'undefined' || typeof fecha == 'undefined' || typeof factura == 'undefined' ||
            typeof flete == 'undefined' || typeof orderid == 'undefined' || typeof sispago == 'undefined' || typeof detalle == 'undefined' ||
            typeof pagoid == 'undefined' || typeof fepago == 'undefined' || typeof deposito == 'undefined' || typeof comision == 'undefined' ||
            typeof igv == 'undefined' || typeof pventa == 'undefined') {
            response.status(401).json({
                error: 'Parámetros incorrectos'
            });
            return;
        }
        if (typeof observaciones == 'undefined') {
            observaciones = '';
        }
        // graba el log de la peticion
        let query = "call pack_web_service.sp_log_request (:request, :empresa, :usuario, :json, :codigo, :mensaje)";
        let params = [
            { name: 'request', io: 'in', value: orderid },
            { name: 'empresa', io: 'in', value: tokenData.empresa },
            { name: 'usuario', io: 'in', value: 8 },
            { name: 'json', io: 'in', value: jsparams },
            { name: 'codigo', io: 'out', type: 'number' },
            { name: 'mensaje', io: 'out', type: 'string' }
        ];
        await db.statement(query, params);
        // genera el pedido
        params = [
            { name: 'codigo', io: 'out', type: 'number' },
            { name: 'mensaje', io: 'out', type: 'string' },
            { name: 'cliente', io: 'in', value: cliente },
            { name: 'direccion', io: 'in', value: direccion },
            { name: 'fecha', io: 'in', value: fecha },
            { name: 'factura', io: 'in', value: factura },
            { name: 'flete', io: 'in', value: flete },
            { name: 'orderid', io: 'in', value: orderid },
            { name: 'sispago', io: 'in', value: sispago },
            { name: 'observaciones', io: 'in', value: observaciones },
            { name: 'detalle', io: 'in', value: detalle },
            { name: 'pagoid', io: 'in', value: pagoid },
            { name: 'fepago', io: 'in', value: fepago },
            { name: 'deposito', io: 'in', value: deposito },
            { name: 'comision', io: 'in', value: comision },
            { name: 'igv', io: 'in', value: igv },
            { name: 'pventa', io: 'in', value: pventa }
        ];
        query = 'call pack_web_service.sp_registra_pedido (:codigo, :mensaje, :cliente, :direccion, :fecha, :factura, :flete, :orderid, :sispago, :observaciones, ' +
            ':detalle, :pagoid, :fepago, :deposito, :comision, :igv, :pventa)';
        let result = await db.statement(query, params);
        // listo
        if (result.error) {
            response.json({
                error: result.error
            });
            return;
        }
        if (result.out.codigo == 0) {
            response.json({
                error: result.out.mensaje
            });
            return;
        }
        // grabar el log del pedido
        let pedido = result.out.mensaje;
        query = "call pack_web_service.sp_log_pedido (:pedido, :empresa, :json, :usuario, :mensaje)";
        params = [
            { name: 'pedido', io: 'in', value: pedido },
            { name: 'empresa', io: 'in', value: tokenData.empresa },
            { name: 'json', io: 'in', value: jsparams },
            { name: 'usuario', io: 'in', value: 8 },
            { name: 'mensaje', io: 'out', type: 'number' },
        ];
        await db.statement(query, params);
        // fin
        response.json({
            pedido: pedido
        });
    },
    TiposCobro: async (request, response) => {
        let token = request.headers['authorization'];
        if (!token) {
            response.status(401).send({
                error: 'Es necesario el token de autenticación'
            })
            return;
        }
        let tokenData = tknmanager.ObtenerDatos(token);
        if (tokenData.error) {
            response.status(401).send({
                error: tokenData.error
            });
            return;
        }
        let params = [
            { name: 'rs', io: 'out', type: 'cursor' }
        ];
        let query = 'call pack_web_service.sp_tipos_cobro (:rs)';
        let result = await db.resultSet(query, params);
        if (result.error) {
            response.json({
                error: result.error
            });
            return;
        }
        response.json({
            data: result.rs
        });
    },
    MatchPedido: async (request, response) => {
        let token = request.headers['authorization'];
        if (!token) {
            response.status(401).send({
                error: 'Es necesario el token de autenticación'
            })
            return;
        }
        let tokenData = tknmanager.ObtenerDatos(token);
        if (tokenData.error) {
            response.status(401).send({
                error: tokenData.error
            });
            return;
        }
        const { orderid } = request.body;
        let query = 'call pack_web_service.sp_match_pedido (:orderid, :codigo, :pedido)';
        let params = [
            { name: 'orderid', io: 'in', value: orderid },
            { name: 'codigo', io: 'out', type: 'number' },
            { name: 'pedido', io: 'out', type: 'string' }
        ];
        let result = await db.statement(query, params);
        if (result.error) {
            response.json({
                error: result.error
            });
            return;
        }
        if (result.out.codigo == 0) {
            response.json({
                error: result.out.pedido
            });
            return;
        }
        response.json({
            pedido: result.out.pedido
        });
    },
    ListaPlanillas: async (request, response) => {
        const { desde, hasta } = request.query;
        let query = "call pack_web_service.sp_planillas_cobranza (:empresa, :recaudador, :desde, :hasta, :rs)";
        let params = [
            { name: 'empresa', io: 'in', value: DEFAULT_EMPRESA },
            { name: 'recaudador', io: 'in', value: DEFAULT_VENDEDOR },
            { name: 'desde', io: 'in', value: desde },
            { name: 'hasta', io: 'in', value: hasta },
            { name: 'rs', io: 'out', type: 'cursor' }
        ];
        let result = await db.resultSet(query, params);
        if (result.error) {
            response.json({
                error: result.error
            });
            return;
        }
        response.json({
            planillas: result.rs
        });
    },
    DetallePlanilla: async (request, response) => {
        const { planilla } = request.query;
        let query = "call pack_web_service.sp_detalle_panilla (:empresa, :planilla, :rs)";
        let params = [
            { name: 'empresa', io: 'in', value: DEFAULT_EMPRESA },
            { name: 'planilla', io: 'in', value: planilla },
            { name: 'rs', io: 'out', type: 'cursor' }
        ];
        let result = await db.resultSet(query, params);
        if (result.error) {
            response.json({
                error: result.error
            });
            return;
        }
        response.json({
            detalle: result.rs
        });
    },
    DatosListaPrecios: async (request, response) => {
        const { fecha } = request.query;
        let query = "call pack_web_service.sp_datos_lista (:lista, :empresa, :fecha, :olista, :oserie, :onombre, :oinicio, :ofin)";
        let params = [
            { name: 'lista', io: 'in', value: DEFAULT_COLISTA },
            { name: 'empresa', io: 'in', value: DEFAULT_EMPRESA },
            { name: 'fecha', io: 'in', value: fecha },
            { name: 'olista', io: 'out', type: 'number' },
            { name: 'oserie', io: 'out', type: 'number' },
            { name: 'onombre', io: 'out', type: 'string' },
            { name: 'oinicio', io: 'out', type: 'string' },
            { name: 'ofin', io: 'out', type: 'string' }
        ];
        let result = await db.resultSet(query, params);
        if (result.error) {
            response.json({
                error: result.error
            });
            return;
        }
        response.json({
            datos: result
        });
    },
    VerificaOrderId: async (request, response) => {
        let token = request.headers['authorization'];
        if (!token) {
            response.status(401).send({
                error: 'Es necesario el token de autenticación'
            });
            return;
        }
        let tokenData = tknmanager.ObtenerDatos(token);
        if (tokenData.error) {
            response.status(401).send({
                error: tokenData.error
            });
            return;
        }
        const { orderid } = request.query;
        let query = "call pack_web_service.sp_verifica_orderid (:orderid, :codigo, :resultado, :json)";
        let params = [
            { name: 'orderid', io: 'in', value: orderid },
            { name: 'codigo', io: 'out', type: 'number' },
            { name: 'resultado', io: 'out', type: 'string' },
            { name: 'json', io: 'out', type: 'clob' }
        ];
        let result = await db.resultSet(query, params);
        if (result.error) {
            response.json({
                error: result.error
            });
            return;
        }
        if (result.codigo == -1) {
            response.json({
                error: result.resultado
            });
            return;
        }
        response.json({
            data: result.json
        });
    },
    CargaDatosProducto: async (request, response) => {
        let token = request.headers['authorization'];
        if (!token) {
            response.status(401).send({
                error: 'Es necesario el token de autenticación'
            });
            return;
        }
        let tokenData = tknmanager.ObtenerDatos(token);
        if (tokenData.error) {
            response.status(401).send({
                error: tokenData.error
            });
            return;
        }
        const { producto, colista, serielista } = request.query;
        let query = "call pack_web_service.sp_datos_producto (:producto,:colista,:serielista,:ocodigo,:odescripcion,:opventa,:odescuento)";
        let params = [
            { name: 'producto', io: 'in', value: producto },
            { name: 'colista', io: 'in', value: colista },
            { name: 'serielista', io: 'in', value: serielista },
            { name: 'ocodigo', io: 'out', type: 'string' },
            { name: 'odescripcion', io: 'out', type: 'string' },
            { name: 'opventa', io: 'out', type: 'number' },
            { name: 'odescuento', io: 'out', type: 'number' }
        ];
        let result = await db.resultSet(query, params);
        if (result.error) {
            response.json({
                error: result.error
            });
            return;
        }
        if (result.codigo == -1) {
            response.json({
                error: result.odescripcion
            });
            return;
        }
        response.json({
            codigo: result.ocodigo,
            descripcion: result.odescripcion,
            pventa: result.opventa,
            descuento: result.odescuento
        });
    },
    CargaDatosProducto: async (request, response) => {
        const { desde, hasta, marca, submarca } = request.query;
        let query = "call pack_web_service.sp_reporte_productos (:desde,:hasta,:marcas,:submacas,:oreporte)";
        let params = [
            { name: 'desde', io: 'in', value: desde },
            { name: 'hasta', io: 'in', value: hasta },
            { name: 'marcas', io: 'in', value: marca },
            { name: 'submacas', io: 'in', value: submarca },
            { name: 'oreporte', io: 'out', type: 'cursor' }
        ];
        let result = await db.resultSet(query, params);
        if (result.error) {
            response.json({
                error: result.error
            });
            return;
        }
        response.json({
            datos: result.oreporte
        });
    },
    CargaDatosVentas: async (request, response) => {
        const { desde, hasta } = request.query;
        let query = "call pack_web_service.sp_reporte_ventas (:desde,:hasta,:oreporte)";
        let params = [
            { name: 'desde', io: 'in', value: desde },
            { name: 'hasta', io: 'in', value: hasta },
            { name: 'oreporte', io: 'out', type: 'cursor' }
        ];
        let result = await db.resultSet(query, params);
        if (result.error) {
            response.json({
                error: result.error
            });
            return;
        }
        response.json({
            datos: result.oreporte
        });
    },
    XlsReporteVentas: async (request, response) => {
        const { desde, hasta } = request.query;
        let query = "call pack_web_service.sp_reporte_ventas (:desde,:hasta,:oreporte)";
        let params = [
            { name: 'desde', io: 'in', value: desde },
            { name: 'hasta', io: 'in', value: hasta },
            { name: 'oreporte', io: 'out', type: 'cursor' }
        ];
        let result = await db.resultSet(query, params);
        if (result.error) {
            response.json({
                error: result.error
            });
            return;
        }
        // escribe archivo excel
        const wb = xlsx.utils.book_new();
        wb.SheetNames.push("reporte-ventas");
        //
        let ws = xlsx.utils.json_to_sheet(result.oreporte);
        wb.Sheets["reporte-ventas"] = ws;
        let wbbuf = xlsx.write(wb, {
            bookType: 'xlsx',
            bookSST: false,
            type: 'buffer'
        });
        response.writeHead(200, {
            'Content-Disposition': 'attachment;filename=reporte_ventas.xlsx',
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        response.end(wbbuf);
    },
    XlsListaPrecios: async (request, response) => {
        const { desde, hasta } = request.query;
        /*
        const { lista } = request.query;
        let empresa = DEFAULT_EMPRESA;
        let tipo = DEFAULT_TIPOLISTA;
        let colista = DEFAULT_COLISTA;
        let query = "call pack_web_service.sp_lista_precios (:empresa, :tipo, :lista, :rs, :o_nombre, :o_serie, :o_desde, :o_hasta, :serie)";
        let params = [
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'tipo', io: 'in', value: tipo },
            { name: 'lista', io: 'in', value: colista },
            { name: 'rs', io: 'out', type: 'cursor' },
            { name: 'o_nombre', io: 'out', type: 'string' },
            { name: 'o_serie', io: 'out', type: 'number' },
            { name: 'o_desde', io: 'out', type: 'string' },
            { name: 'o_hasta', io: 'out', type: 'string' },
            { name: 'serie', io: 'in', value: lista }
        ];
        let result = await db.resultSet(query, params);
        if (result.error) {
            response.status(401).json({
                error: result.error
            });
            return;
        }
        // corrige la ptmr
        let rsOut = [];
        for (let row of result.rs) {
            row.precVentaSinIgv = row.precVentaSinIgv.toFixed(2);
            rsOut.push(row);
        }
        // fin
        response.json({
            data: rsOut,
            lista: result.o_nombre,
            serie: result.o_serie,
            desde: result.o_desde,
            hasta: result.o_hasta
        });
        */
        const { lista } = request.query;
        let empresa = DEFAULT_EMPRESA;
        let tipo = DEFAULT_TIPOLISTA;
        let colista = DEFAULT_COLISTA;
        let query = "call pack_web_service.sp_lista_precios (:empresa, :tipo, :lista, :rs, :o_nombre, :o_serie, :o_desde, :o_hasta, :serie)";
        let params = [
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'tipo', io: 'in', value: tipo },
            { name: 'lista', io: 'in', value: colista },
            { name: 'rs', io: 'out', type: 'cursor' },
            { name: 'o_nombre', io: 'out', type: 'string' },
            { name: 'o_serie', io: 'out', type: 'number' },
            { name: 'o_desde', io: 'out', type: 'string' },
            { name: 'o_hasta', io: 'out', type: 'string' },
            { name: 'serie', io: 'in', value: lista }
        ];
        let result = await db.resultSet(query, params);
        // escribe archivo excel
        const wb = xlsx.utils.book_new();
        wb.SheetNames.push("lista-precios");
        //
        let ws = xlsx.utils.json_to_sheet(result.rs);
        wb.Sheets["lista-precios"] = ws;
        let wbbuf = xlsx.write(wb, {
            bookType: 'xlsx',
            bookSST: false,
            type: 'buffer'
        });
        response.writeHead(200, {
            'Content-Disposition': 'attachment;filename=lista_precios.xlsx',
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        response.end(wbbuf);
    }
};

module.exports = WsController;