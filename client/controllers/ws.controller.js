const db = require('./../../server/libs/db-oracle');
const pwmanager = require('./../../server/libs/password-manager');
const tknmanager = require('./../../server/libs/token-manager');
const DEFAULT_EMPRESA = 11;

const WsController = {
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
            { name: 'rs', io: 'out', type: 'cursor' }
        ];
        let result = await db.resultSet('call pack_web_service.sp_lista_precios (:empresa, :tipo, :lista, :rs)', params);
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
            data: rsOut
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
// ubigeo,covia,nomvia,cozona,nomzona,numero,interior,referencia,rucdni,o_codigo,o_mensaje 
        const { ubigeo, direccion, referencia, rucdni } = request.body;
        if (typeof ubigeo == 'undefined' || typeof direccion == 'undefined' || typeof referencia == 'undefined' || typeof rucdni == 'undefined') {
            response.status(401).json({
                error: 'Parámetros incorrectos'
            });
            return;
        }
        let params = [
            { name: 'codigo', io: 'out', type: 'number' },
            { name: 'mensaje', io: 'out', type: 'string' },
            { name: 'ubigeo', io: 'in', value: ubigeo },
            { name: 'direccion', io: 'in', value: direccion },
            { name: 'referencia', io: 'in', value: referencia },
            { name: 'rucdni', io: 'in', value: rucdni }
        ];
        let query = 'call pack_web_service.sp_registra_direccion (:codigo, :mensaje, :ubigeo, :direccion, :referencia, :rucdni)';
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
        let query = "call pack_web_service.sp_log_request (:request, :empresa, :usuario, :json, :mensaje)";
        let params = [
            { name: 'request', io: 'in', value: orderid },
            { name: 'empresa', io: 'in', value: tokenData.empresa },
            { name: 'usuario', io: 'in', value: tokenData.id },
            { name: 'json', io: 'in', value: jsparams },
            { name: 'mensaje', io: 'out', type: 'number' },
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
console.log(query, params);
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
            { name: 'usuario', io: 'in', value: tokenData.id },
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
    }
};

module.exports = WsController;