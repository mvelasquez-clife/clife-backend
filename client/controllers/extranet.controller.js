const path = require('path');
const bcrypt = require('bcrypt');
const oracledb = require('oracledb');
const dbParams = require('../../server/database');
const mv = require('mv');
const formidable = require('formidable');
const fupload = require('../../server/fupload');
const xlsx = require('xlsx');
const db = require('../../server/libs/db-oracle');
const devmode = 'L'; // 'P' para produccion

const responseParams = {
    outFormat: oracledb.OBJECT
};

const saltRounds = 4;
const CookieId = 'sess-cookie';
const UserExpo = {
    alias: 'VILLARAN',
    codigo: 7865928,
    empresa: 11
};
const UserNac = {
    alias: 'ruthc',
    codigo: 40721489,
    empresa: 11
};

const extranetController = {
    home: (request, response) => {
        if (request.cookies[CookieId]) {
            let sesion = request.cookies[CookieId];
            let cliente = request.cookies['cliente'] ? request.cookies['cliente'] : '-';
            response.render(path.resolve('client/views/extranet/home.ejs'), { sesion: JSON.stringify(JSON.parse(sesion)), cliente: cliente });
        }
        else response.redirect('/extranet/login');
    },
    login: (request, response) => {
        let data = {};
        if (request.cookies['auth-err']) {
            data.errmsg = request.cookies['auth-err'];
        }
        response.render(path.resolve('client/views/extranet/login.ejs'), data);
    },
    logout: (request, response) => {
        response.clearCookie(CookieId, { httpOnly: true });
        response.clearCookie('cliente', { httpOnly: true });
        response.clearCookie('rgmail', { httpOnly: true });
        response.clearCookie('auth-err', { httpOnly: true });
        response.redirect('/extranet/login');
    },
    NuevoUsuario: (request, response) => {
        response.render(path.resolve('client/views/extranet/nuevo-usuario.ejs'));
    },
    ConfirmarUsuario: (request, response) => {
        let email = request.cookies['rgmail'];
        const data = { email: email };
        response.clearCookie('rgmail', { httpOnly: true });
        response.render(path.resolve('client/views/extranet/confirmar-usuario.ejs'), data);
    },
    PruebaRegistro: (request, response) => {
        response.cookie('rgmail','mvelasquez@corporacionlife.com.pe',{ httpOnly: true });
        response.redirect('/extranet/confirmar-usuario');
    },
    DetallePedido: (request, response) => {
        if (request.cookies[CookieId]) {
            let sesion = request.cookies[CookieId];
            const { pedido } = request.params;
            // verifica si hay results
            var mensajes = JSON.stringify([]);
            if (request.cookies['results']) {
                mensajes = request.cookies['results'];
                // response.clearCookie('results');
            }
            // go!
            response.render(path.resolve('client/views/extranet/detalle-pedido.ejs'), { sesion: JSON.stringify(JSON.parse(sesion)), pedido: pedido, mensajes: JSON.stringify(JSON.parse(mensajes)) });
        }
        else response.redirect('/extranet/login');
    },
    //
    AuthLogin: async (request, response) => {
        const { email, pswd } = request.body;
        let empresa = 11;
        let result;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select node_password \"hash\", st_cuenta_activada \"stact\", st_verifica_mail \"stmail\", co_cliente \"codigo\", de_nombre_comercial \"ncomercial\", de_razon_social \"rsocial\", fe_suscripcion \"fsuscripcion\", de_email \"email\", de_telefono \"telefono\", st_expo_admin \"admin\", st_tipo_usuario \"tipo\" from cl_usuarios where de_alias = :p_alias and co_empresa = :p_empresa and st_tipo_usuario in ('E', 'R')";
            let params = {
                p_alias: { val: email },
                p_empresa: { val: empresa }
            };
            result = await conn.execute(query, params, responseParams);
            result = result.rows[0];
            conn.close();
            if (result.stact == 'N') {
                response.cookie('auth-err','Su cuenta no está ativada. Utilice el enlace proporcionado en el correo de confirmación enviado al momento de su registro.', { httpOnly: true });
                response.redirect('/extranet/login');
                return;
            }
            if (result.stmail == 'N') {
                response.cookie('auth-err','Su correo electrónico no ha sido validado. Utilice el enlace proporcionado en el correo de confirmación enviado al momento de su registro.', { httpOnly: true });
                response.redirect('/extranet/login');
                return;
            }
            bcrypt.compare(pswd, result.hash, function(err, res) {
                if (err) {
                    response.cookie('auth-err','La clave ingresada es incorrecta.', { httpOnly: true });
                    response.redirect('/extranet/login');
                    return;
                }
                let sesion = result;
                delete sesion.hash;
                delete sesion.stact;
                delete sesion.stmail;
                response.cookie(CookieId, JSON.stringify(sesion), { httpOnly: true });
                response.redirect('/extranet');
           });
        }
        catch (err) {
            console.error(err);
            response.json(err);
            return;
        }
    },
    RegistraUsuario: (request, response) => {
        const { idnumber, email, pswd, rpswd } = request.body;
        // auth-sign-in
        let empresa = 11;
        try {
            if (pswd != rpswd) {
                // clave hasta el keke. haz redirect con mensaje de error
                response.json({
                    error: 'Las claves deben coincidir'
                });
                return;
            }
            // go!
            bcrypt.hash(pswd, saltRounds).then(async function(hash) {
                // registra en bd
                let conn = await oracledb.getConnection(dbParams);
                let query = "call pack_new_web_expo.sp_registra_cliente_web(:p_cliente, :p_empresa, :p_email, :p_clave, :o_codigo, :o_mensaje)";
                let params = {
                    p_cliente: { val: idnumber },
                    p_empresa: { val: empresa },
                    p_email: { val: email },
                    p_clave: { val: hash },
                    o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                    o_mensaje: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
                };
                let result = await conn.execute(query, params, responseParams);
                const { o_codigo, o_mensaje } = result.outBinds;
                conn.close();
                if (o_codigo == 1) {
                    response.cookie('context','registro',{ httpOnly: true });
                    response.redirect('/extranet/confirmar-usuario');
                }
                else {
                    response.json({
                        error: o_mensaje
                    });
                }
            });
        }
        catch (err) {
            console.error(err);
            response.json({
                error: err
            });
            return;
        }
    },
    BuscarClientes: async (request, response) => {
        let { texto, tipo } = request.body;
        if (request.cookies[CookieId]) {
            let result;
            texto = texto.toUpperCase();
            try {
                let conn = await oracledb.getConnection(dbParams);
                let query = "select codigo \"codigo\", nombre \"nombre\" from table(pack_new_web_expo.f_buscar_clientes(:p_codigo,:p_empresa,:p_texto))";
                let params = {
                    p_codigo: { val: tipo == 'E' ? UserExpo.codigo : UserNac.codigo },
                    p_empresa: { val: tipo == 'E' ? UserExpo.empresa : UserNac.empresa },
                    p_texto: { val: texto }
                };
                result = await conn.execute(query, params, responseParams);
                conn.close();
                response.json({
                    data: {
                        clientes: result.rows
                    }
                });
            }
            catch (err) {
                console.error(err);
                response.json({
                    error: err
                });
                return;
            }
        }
        else response.json({
            error: 'Su sesión expiró'
        });
    },
    DatosCliente: async (request, response) => {
        if (request.cookies[CookieId]) {
            const sesion = JSON.parse(request.cookies[CookieId]);
            const { cliente } = request.body;
            let query, params, result;
            try {
                const cmoneda = sesion.tipo == 'E' ? 2 : 1;
                const calias = sesion.tipo == 'E' ? UserExpo.alias : UserNac.alias;
                const conn = await oracledb.getConnection(dbParams);
                // estado del cliente
                let xdata = [calias, cliente, 34, cmoneda].join('@');
                query = "select pack_new_clife_clientes.f_v_ctacte_cliente(:p_data) \"out\" from dual";
                params = {
                    p_data: { val: xdata }
                };
                result = await conn.execute(query, params, responseParams);
                let sCliente = result.rows[0].out.split('@');
                sCliente = {
                    codigo: sCliente[8],
                    nombre: sCliente[0],
                    disponible: parseFloat(sCliente[1]),
                    solicitud: parseFloat(sCliente[2]),
                    deuda: parseFloat(sCliente[3]),
                    moneda: sCliente[9]
                };
                // verifica si hay pedido abierto
                let sPedido;
                if (sesion.tipo == 'E') {
                    query = "select codigo,moneda,importe,to_char(fecha,'dd/mm/yyyy') fecha,items from table(pack_new_web_expo.f_info_pedido(:p_tipo, :p_cliente, :p_empresa))";
                    params = {
                        p_tipo: { val: sesion.tipo },
                        p_cliente: { val: cliente },
                        p_empresa: { val: 11 }
                    };
                    result = await conn.execute(query, params, responseParams);
                    if (result.rows.length > 0) {
                        sPedido = {
                            codigo: result.rows[0].CODIGO,
                            moneda: result.rows[0].MONEDA,
                            importe: result.rows[0].IMPORTE,
                            fecha: result.rows[0].FECHA,
                            items: result.rows[0].ITEMS
                        };
                    }
                    else {
                        sPedido = {
                            codigo: 'x',
                            moneda: '-',
                            importe: 0,
                            fecha: '1970-01-01 00:00:00',
                            items: 0
                        };
                    }
                }
                else {
                    query = "select pack_new_web_expo.f_datos_pedido_nac(:p_alias, 0) out from dual";
                    params = {
                        p_alias: { val: UserNac.alias }
                    };
                    result = await conn.execute(query, params, responseParams);
                    if (result.rows.length > 0) {
                        let string = result.rows[0].OUT;
                        if (string != null) {
                            let { yserie, ydemoneda, yimpedido, yfecha, yitems, ynomcliente } = string.split;
                            sPedido = {
                                codigo: yserie,
                                moneda: ydemoneda,
                                importe: parseFloat(yimpedido),
                                fecha: yfecha,
                                items: parseInt(yitems),
                                nomcliente: ynomcliente
                            };
                        }
                        else {
                            sPedido = {
                                codigo: 'x',
                                moneda: '-',
                                importe: 0,
                                fecha: '1970-01-01 00:00:00',
                                items: 0
                            };
                        }
                    }
                    else {
                        sPedido = {
                            codigo: 'x',
                            moneda: '-',
                            importe: 0,
                            fecha: '1970-01-01 00:00:00',
                            items: 0
                        };
                    }
                }
                // cuenta corriente
                query = "select co_documento \"documento\", de_moneda \"moneda\", im_saldo \"deuda\", to_char(fec_venc,'yyyy-mm-dd') \"vence\", nu_dias_vencido \"dias\", " +
                    "de_cond_pago \"cpago\", de_vendedor \"vendedor\" from table(pack_new_clife_clientes.f_vt_fact_pendientes_cliente(:p_cliente, :p_empresa, :p_moneda)) order by fec_venc desc";
                params = {
                    p_cliente: cliente,
                    p_empresa: 11,
                    p_moneda: cmoneda
                };
                result = await conn.execute(query, params, responseParams);
                sCtacte = result.rows;
                // pedidos pendientes
                query = "call pack_new_web_expo.sp_pedidos_pendientes_cliente(:o_result, :o_mensaje, :o_pedidos, :p_cliente, :p_empresa)";
                params = [
                    { name: 'o_result', io: 'out', type: 'number' },
                    { name: 'o_mensaje', io: 'out', type: 'string' },
                    { name: 'o_pedidos', io: 'out', type: 'cursor' },
                    { name: 'p_cliente', io: 'in', value: cliente },
                    { name: 'p_empresa', io: 'in', value: UserExpo.empresa }
                ];
                result = await db.resultSet(query, params);
                var opedidos = [];
                if (result.o_result == 1) {
                    opedidos = result.o_pedidos;
                }
                // out
                conn.close();
                response.json({
                    data: {
                        cliente: sCliente,
                        pedido: sPedido,
                        ctacte: sCtacte,
                        pendientes: opedidos
                    }
                });
            }
            catch (err) {
                console.error(err);
                response.json({
                    error: err.message
                });
                return;
            }
        }
        else response.json({
            error: 'Su sesión expiró'
        });
    },
    RegistraPrePedido: async (request, response) => {
        if (request.cookies[CookieId]) {
            // const sesion = JSON.parse(request.cookies[CookieId]);
            const { cliente } = request.body;
            try {
                let conn = await oracledb.getConnection(dbParams);
                let query = "call pack_new_web_expo.sp_cabecera_pre_pedido(:p_alias, :p_empresa, :p_vendedor, :p_cliente, :p_moneda, :o_resultado, :o_pedido)";
                let params = {
                    p_alias: { val: UserExpo.alias },
                    p_empresa: { val: UserExpo.empresa },
                    p_vendedor: { val: UserExpo.codigo },
                    p_cliente: { val: cliente },
                    p_moneda: { val: 2 },
                    o_resultado: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                    o_pedido: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
                };
                const result = await conn.execute(query, params, responseParams);
                const { o_resultado, o_pedido } = result.outBinds;
                conn.close();
                if (o_resultado == 1) {
                    response.json({
                        pedido: o_pedido
                    });
                }
                else {
                    response.json({
                        error: o_pedido
                    });
                }
            }
            catch (err) {
                console.error(err);
                response.json({
                    error: err
                });
                return;
            }
        }
        else response.json({
            error: 'Su sesión expiró'
        });
    },
    DatosPedido: async (request, response) => {
        if (request.cookies[CookieId]) {
            const { pedido } = request.body;
            const sesion = JSON.parse(request.cookies[CookieId]);
            let query, params, result;
            let cAlias, cUsuario, cEmpresa;
            if (sesion.tipo == 'E') {
                cAlias = UserExpo.alias;
                cUsuario = UserExpo.codigo;
                cEmpresa = UserExpo.empresa;
            }
            else {
                cAlias = UserNac.alias;
                cUsuario = UserNac.codigo;
                cEmpresa = UserNac.empresa;
            }
            try {
                const conn = await oracledb.getConnection(dbParams);
                // carga datos del pedido
                query = "select codigo, cmoneda, moneda, importe, to_char(fecha,'dd/mm/yyyy') fecha, items, vendedor, vigencia, cliente, pedidogen, stliberac from table(pack_new_web_expo.f_datos_pedido(:p_tipo, :p_pedido, :p_empresa))";
                params = {
                    p_tipo: { val: sesion.tipo },
                    p_pedido: { val: pedido },
                    p_empresa: { val: cEmpresa }
                };
                result = await conn.execute(query, params, responseParams);
                if (result.rows.length == 0) {
                    response.json({
                        error: 'No se encontró el pedido especificado'
                    });
                    conn.close();
                    return;
                }
                result = result.rows[0];
                let dPedido = {
                    codigo: result.CODIGO,
                    cmoneda: result.CMONEDA,
                    moneda: result.MONEDA,
                    subtotal: result.IMPORTE,
                    fecha: result.FECHA,
                    items: result.ITEMS,
                    vendedor: result.VENDEDOR,
                    vigencia: result.VIGENCIA,
                    cliente: result.CLIENTE,
                    pedidogen: result.PEDIDOGEN ? result.PEDIDOGEN : 'x',
                    productos: []
                };
                // carga detalle del pedido
                query = "select codigo \"codigo\",ean \"ean\",initcap(nombre) \"nombre\",cantidad \"cantidad\",cajas \"cajas\",pallets \"pallets\",importe \"importe\", " +
                    "difer \"difer\",tipo \"tipo\", familia \"familia\",pventa \"pventa\",promodsc \"promodsc\",clase \"clase\", unidcaja \"unidcaja\", " + 
                    "cjsnivel \"cjsnivel\", maxniveles \"maxniveles\", paletsconf \"paletsconf\" from table(pack_new_web_expo.f_detalle_pedido(:p_tipo, :p_empresa, :p_pedido))";
                params = {
                    p_tipo: { val: sesion.tipo },
                    p_empresa: { val: cEmpresa },
                    p_pedido: { val: pedido }
                };
                result = await conn.execute(query, params, responseParams);
                dPedido.productos = result.rows;
                // carga datos del cliente
                query = "select co_cliente \"rucdni\", de_razon_social \"nombre\" from vt_clie_m where co_cliente = :p_cliente and co_empresa = :p_empresa";
                params = {
                    p_cliente: { val: dPedido.cliente },
                    p_empresa: { val: cEmpresa }
                };
                result = await conn.execute(query, params, responseParams);
                let dCliente = result.rows[0];
                // estado del pedido
                query = "call pack_new_web_expo.sp_estado_admin_pedido(:o_codigo, :o_estado, :p_prepedido, :p_empresa, :p_codigo)";
                params = [
                    { name: 'o_codigo', io: 'out', type: 'number' },
                    { name: 'o_estado', io: 'out', type: 'string' },
                    { name: 'p_prepedido', io: 'in', value: pedido },
                    { name: 'p_empresa', io: 'in', value: UserExpo.empresa },
                    { name: 'p_codigo', io: 'in', value: sesion.codigo }
                ];
                result = await db.resultSet(query, params);
                if (result.error) {
                    response.json({
                        error: result.error
                    });
                    return;
                }
                if (result.o_codigo == 0) {
                    response.json({
                        error: result.o_estado
                    });
                    return;
                }
                // escribir
                conn.close();
                response.json({
                    pedido: dPedido,
                    cliente: dCliente,
                    revision: result.o_estado
                });
            }
            catch (err) {
                console.error(err);
                response.json({
                    error: err
                });
                return;
            }
        }
        else response.json({
            error: 'Su sesión expiró'
        });
    },
    CatalogoProductos: async (request, response) => {
        if (request.cookies[CookieId]) {
            const { pedido } = request.body;
            const sesion = JSON.parse(request.cookies[CookieId]);
            const cEmpresa = sesion.tipo == 'E' ? UserExpo.empresa : UserNac.empresa;
            try {
                const conn = await oracledb.getConnection(dbParams);
                const query = "select codigo \"codigo\", ean \"ean\", cogrupo \"cogrupo\", initcap(nombre) \"nombre\", pvta \"pventa\", uncaja \"caja\", /*palletcaja*/ 100 \"pcaja\", " +
                    "stock \"stock\", cantidad \"cantidad\", 10 \"cjnivel\", pesopt \"pesopt\", largo \"largo\", ancho \"ancho\", alto \"alto\" from table(pack_new_web_expo.f_lista_productos(:p_tipo, :p_empresa, :p_pedido))";
                const params = {
                    p_tipo: { val: sesion.tipo },
                    p_empresa: { val: cEmpresa },
                    p_pedido: { val: pedido }
                };
                result = await conn.execute(query, params, responseParams);
                conn.close();
                response.json({
                    productos: result.rows
                });
            }
            catch (err) {
                console.error(err);
                response.json({
                    error: err
                });
                return;
            }
        }
        else response.json({
            error: 'Su sesión expiró'
        });
    },
    AgregarProductosExpo: async (request, response) => {
        if (request.cookies[CookieId]) {
            const sesion = JSON.parse(request.cookies[CookieId]);
            const cEmpresa = sesion.tipo == 'E' ? UserExpo.empresa : UserNac.empresa;
            const { productos, pedido } = request.body;
            let mensajes = [];
            try {
                const conn = await oracledb.getConnection(dbParams);
                let query;
                if (sesion.tipo == 'E') {
                    query = "select co_punto_venta \"pventa\", co_serie_listado \"serie\", co_listado_precios \"lista\", co_fuerza_venta \"fventa\" from vt_pre_pedi_t where co_pre_pedido = :p_pedido and co_empresa = :p_empresa";
                }
                else {
                    query = "select co_punto_venta \"pventa\", co_serie_listado \"serie\", co_listado_precios \"lista\", co_fuerza_venta \"fventa\" from vt_pedi_t where co_pedido = :p_pedido and co_empresa = :p_empresa";
                }
                let params = {
                    p_pedido: pedido,
                    p_empresa: cEmpresa
                };
                let result = await conn.execute(query, params, responseParams);
                let { pventa, serie, lista, fventa } = result.rows[0];
                //
                for (let producto of productos) {
                    let query = "call pack_new_web_expo.sp_agrega_producto_expo(:p_pedido, :p_empresa, :p_producto, :p_cantidad, :p_tpventa, :p_serielista, :p_fventa, :p_listaprec, :p_pventa, :o_codigo, :o_mensaje)";
                    let params = {
                        p_pedido: { val: pedido },
                        p_empresa: { val: cEmpresa },
                        p_producto: { val: producto.codigo },
                        p_cantidad: { val: producto.cantidad },
                        p_tpventa: { val: producto.tpventa },
                        p_serielista: { val: serie },
                        p_fventa: { val: fventa },
                        p_listaprec: { val: lista },
                        p_pventa: { val: producto.pventa },
                        //,
                        o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                        o_mensaje: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
                    };
                    let result = await conn.execute(query, params, responseParams);
                    const { o_codigo, o_mensaje } = result.outBinds;
                    if (o_codigo == 1) {
                        mensajes.push({ result: o_mensaje });
                    }
                    else {
                        mensajes.push({ error: o_mensaje });
                    }
                }
                // carga detalle del pedido
                /*
                query = "select codigo \"codigo\",ean \"ean\",initcap(nombre) \"nombre\",cantidad \"cantidad\",cajas \"cajas\",pallets \"pallets\",importe \"importe\", " +
                    "difer \"difer\",tipo \"tipo\", familia \"familia\",pventa \"pventa\",promodsc \"promodsc\",clase \"clase\", unidcaja \"unidcaja\", 100 \"pcaja\" from " +
                    "table(pack_new_web_expo.f_detalle_pedido(:p_tipo, :p_empresa, :p_pedido))";
                */
                query = "select codigo \"codigo\",ean \"ean\",initcap(nombre) \"nombre\",cantidad \"cantidad\",cajas \"cajas\",pallets \"pallets\",importe \"importe\", " +
                    "difer \"difer\",tipo \"tipo\", familia \"familia\",pventa \"pventa\",promodsc \"promodsc\",clase \"clase\", unidcaja \"unidcaja\", " + 
                    "cjsnivel \"cjsnivel\", maxniveles \"maxniveles\", paletsconf \"paletsconf\", 100 \"pcaja\" from table(pack_new_web_expo.f_detalle_pedido(:p_tipo, :p_empresa, :p_pedido))";
                params = {
                    p_tipo: { val: sesion.tipo },
                    p_empresa: { val: cEmpresa },
                    p_pedido: { val: pedido }
                };
                result = await conn.execute(query, params, responseParams);
                let detalle = result.rows;
                conn.close();
                response.json({
                    data: {
                        mensajes: mensajes,
                        detalle: detalle
                    }
                });
            }
            catch (err) {
                console.error(err);
                response.json({
                    error: err
                });
            }
        }
        else response.json({
            error: 'Su sesión expiró'
        });
    },
    EliminarProducto: async (request, response) => {
        if (request.cookies[CookieId]) {
            const sesion = JSON.parse(request.cookies[CookieId]);
            const { pedido, productos } = request.body;
            const cEmpresa = sesion.tipo == 'E' ? UserExpo.empresa : UserNac.empresa;
            try {
                const conn = await oracledb.getConnection(dbParams);
                let mensajes = [];
                for (let producto of productos) {
                    //
                    let query = "call pack_new_web_expo.sp_elimina_producto_expo(:p_pedido, :p_empresa, :p_producto, :p_tipo, :p_difer, :o_codigo, :o_mensaje)";
                    let params = {
                        p_pedido: { val: pedido },
                        p_empresa: { val: cEmpresa },
                        p_producto: { val: producto.codigo },
                        p_tipo: { val: producto.tipo },
                        p_difer: { val: producto.difer },
                        o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                        o_mensaje: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
                    };
                    let result = await conn.execute(query, params, responseParams);
                    const { o_codigo, o_mensaje } = result.outBinds;
                    if (o_codigo == 1) mensajes.push({ mensaje: o_mensaje });
                    else mensajes.push({ error: o_mensaje });
                }
                /*
                let query = "select codigo \"codigo\",ean \"ean\",initcap(nombre) \"nombre\",cantidad \"cantidad\",cajas \"cajas\",pallets \"pallets\",importe \"importe\", " +
                    "difer \"difer\",tipo \"tipo\", familia \"familia\",pventa \"pventa\",promodsc \"promodsc\",clase \"clase\", unidcaja \"unidcaja\", 100 \"pcaja\" from " +
                    "table(pack_new_web_expo.f_detalle_pedido(:p_tipo, :p_empresa, :p_pedido))";
                */
                query = "select codigo \"codigo\",ean \"ean\",initcap(nombre) \"nombre\",cantidad \"cantidad\",cajas \"cajas\",pallets \"pallets\",importe \"importe\", " +
                    "difer \"difer\",tipo \"tipo\", familia \"familia\",pventa \"pventa\",promodsc \"promodsc\",clase \"clase\", unidcaja \"unidcaja\", " + 
                    "cjsnivel \"cjsnivel\", maxniveles \"maxniveles\", paletsconf \"paletsconf\", 100 \"pcaja\" from table(pack_new_web_expo.f_detalle_pedido(:p_tipo, :p_empresa, :p_pedido))";
                let params = {
                    p_tipo: { val: sesion.tipo },
                    p_empresa: { val: cEmpresa },
                    p_pedido: { val: pedido }
                };
                let result = await conn.execute(query, params, responseParams);
                let detalle = result.rows;
                conn.close();
                response.json({
                    mensajes: mensajes,
                    detalle: detalle
                });
            }
            catch (err) {
                console.err(error);
                response.json({
                    error: err
                });
            }
        }
        else response.json({
            error: 'Su sesión expiró'
        });
    },
    ObsequiarProducto: async (request, response) => {
        if (request.cookies[CookieId]) {
            const sesion = JSON.parse(request.cookies[CookieId]);
            const { pedido, clave } = request.body;
            const cEmpresa = sesion.tipo == 'E' ? UserExpo.empresa : UserNac.empresa;
            // go
            let query = "call pack_new_web_expo.sp_titulo_gratuito_expo(:p_pedido, :p_empresa, :p_clave, :o_codigo, :o_mensaje)";
            let params = [
                { name: 'p_pedido', io: 'in', value: pedido },
                { name: 'p_empresa', io: 'in', value: cEmpresa },
                { name: 'p_clave', io: 'in', value: clave },
                { name: 'o_codigo', io: 'out', value: oracledb.BIND_OUT, type: oracledb.NUMBER },
                { name: 'o_mensaje', io: 'out', value: oracledb.BIND_OUT, type: oracledb.STRING }
            ];
            let result = db.statement(query, params);
            /*
            const query = "call pack_new_web_expo.sp_registra_pedido(:x_result,:x_de_result,:x_pedido,:x_empresa,:x_pre_pedido,:p_alias)";
            const params = [
                { name: 'x_result', io: 'out', type: 'number' },
                { name: 'x_de_result', io: 'out', type: 'string' },
                { name: 'x_pedido', io: 'out', type: 'string' },
                { name: 'x_empresa', io: 'in', value: empresa },
                { name: 'x_pre_pedido', io: 'in', value: prepedido },
                { name: 'p_alias', io: 'in', value: UserExpo.alias }
            ];
            const result = await db.statement(query, params);
            */
            if (result.o_codigo == 0) {
                response.json({
                    error: result.o_mensaje
                });
                return;
            }
            response.json({
                success: true
            });
        }
        else response.json({
            error: 'Su sesión expiró'
        });
    },
    ActualizarCantidad: async (request, response) => {
        if (request.cookies[CookieId]) {
            const sesion = JSON.parse(request.cookies[CookieId]);
            const { pedido, codigo, tipo, difer, cantidad } = request.body;
            const cEmpresa = sesion.tipo == 'E' ? UserExpo.empresa : UserNac.empresa;
            try {
                const conn = await oracledb.getConnection(dbParams);
                // actualizar cantidad
                let query = "call pack_new_web_expo.sp_actualiza_cantidad_expo(:p_pedido, :p_empresa, :p_producto, :p_tipo, :p_difer, :p_cantidad, :o_codigo, :o_mensaje)";
                let params = {
                    p_pedido: { val: pedido },
                    p_empresa: { val: cEmpresa },
                    p_producto: { val: codigo },
                    p_tipo: { val: tipo },
                    p_difer: { val: difer },
                    p_cantidad: { val: cantidad },
                    o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                    o_mensaje: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
                };
                let result = await conn.execute(query, params, responseParams);
                const { o_codigo, o_mensaje } = result.outBinds;
                if (o_codigo == 0) {
                    response.json({
                        error: o_mensaje
                    });
                    conn.close();
                    return;
                }
                // detalle del pedido
                /*
                query = "select codigo \"codigo\",ean \"ean\",initcap(nombre) \"nombre\",cantidad \"cantidad\",cajas \"cajas\",pallets \"pallets\",importe \"importe\", " +
                    "difer \"difer\",tipo \"tipo\", familia \"familia\",pventa \"pventa\",promodsc \"promodsc\",clase \"clase\", unidcaja \"unidcaja\", 100 \"pcaja\", paletsconf \"paletsconf\" from " +
                    "table(pack_new_web_expo.f_detalle_pedido(:p_tipo, :p_empresa, :p_pedido))";
                */
                query = "select codigo \"codigo\",ean \"ean\",initcap(nombre) \"nombre\",cantidad \"cantidad\",cajas \"cajas\",pallets \"pallets\",importe \"importe\", " +
                    "difer \"difer\",tipo \"tipo\", familia \"familia\",pventa \"pventa\",promodsc \"promodsc\",clase \"clase\", unidcaja \"unidcaja\", " + 
                    "cjsnivel \"cjsnivel\", maxniveles \"maxniveles\", paletsconf \"paletsconf\", 100 \"pcaja\" from table(pack_new_web_expo.f_detalle_pedido(:p_tipo, :p_empresa, :p_pedido))";
                params = {
                    p_tipo: { val: sesion.tipo },
                    p_empresa: { val: cEmpresa },
                    p_pedido: { val: pedido }
                };
                result = await conn.execute(query, params, responseParams);
                let detalle = result.rows;
                conn.close();
                response.json({
                    detalle: detalle
                });
            }
            catch (err) {
                console.error(err);
                response.json({
                    error: err
                });
                return;
            }
        }
        else response.json({
            error: 'Su sesión expiró'
        });
    },
    ActualizarCantidades: async (request, response) => {
        if (request.cookies[CookieId]) {
            const sesion = JSON.parse(request.cookies[CookieId]);
            const { pedido, productos } = request.body;
            const cEmpresa = sesion.tipo == 'E' ? UserExpo.empresa : UserNac.empresa;
            try {
                let query = "call pack_new_web_expo.sp_actualiza_cantidades_expo(:p_pedido, :p_productos, :p_empresa, :o_codigo, :o_mensaje)";
                let params = [
                    { name: 'p_pedido', io: 'in', value: pedido },
                    { name: 'p_productos', io: 'in', value: productos },
                    { name: 'p_empresa', io: 'in', value: cEmpresa },
                    { name: 'o_codigo', io: 'out', type: 'number' },
                    { name: 'o_mensaje', io: 'out', type: 'string' }
                ];
                let result = await db.resultSet(query, params);
                if (result.o_codigo == 0) {
                    response.json({
                        error: 'pack_new_web_expo.sp_actualiza_cantidades_expo: ' + result.o_mensaje
                    });
                    return;
                }
                // detalle del pedido
                /*
                query = "select codigo \"codigo\",ean \"ean\",initcap(nombre) \"nombre\",cantidad \"cantidad\",cajas \"cajas\",pallets \"pallets\",importe \"importe\", " +
                    "difer \"difer\",tipo \"tipo\", familia \"familia\",pventa \"pventa\",promodsc \"promodsc\",clase \"clase\", unidcaja \"unidcaja\", 100 \"pcaja\" from " +
                    "table(pack_new_web_expo.f_detalle_pedido(:p_tipo, :p_empresa, :p_pedido))";
                */
                query = "select codigo \"codigo\",ean \"ean\",initcap(nombre) \"nombre\",cantidad \"cantidad\",cajas \"cajas\",pallets \"pallets\",importe \"importe\", " +
                    "difer \"difer\",tipo \"tipo\", familia \"familia\",pventa \"pventa\",promodsc \"promodsc\",clase \"clase\", unidcaja \"unidcaja\", " + 
                    "cjsnivel \"cjsnivel\", maxniveles \"maxniveles\", paletsconf \"paletsconf\", 100 \"pcaja\" from table(pack_new_web_expo.f_detalle_pedido(:p_tipo, :p_empresa, :p_pedido))";
                params = [
                    { name: 'p_tipo', io: 'in', value: sesion.tipo },
                    { name: 'p_empresa', io: 'in', value: cEmpresa },
                    { name: 'p_pedido', io: 'in', value: pedido }
                ];
                result = await db.select(query, params, responseParams);
                let detalle = result.rows;
                let command = 'php /var/www/laravel/reporter/artisan exportacion:faltantes ' + pedido;
                // aqui enviar el correo
                if (devmode == 'L') {
console.log(command);
                    response.json({
                        detalle: detalle
                    });
                }
                else { // o sea, si está en 'P'
                    var exec = require('child_process').exec, child;
                    child = exec(command, async function (error, stdout, stderr) {
                        response.cookie('cliente', cliente);
                        response.json({
                            detalle: detalle
                        });
                    });
                }
            }
            catch (err) {
                console.error(err);
                response.json({
                    error: err
                });
                return;
            }
        }
        else response.json({
            error: 'Su sesión expiró'
        });
    },
    CargarXlsx: (request, response) => {
        if (request.cookies[CookieId]) {
            const sesion = JSON.parse(request.cookies[CookieId]);
            const cEmpresa = sesion.tipo == 'E' ? UserExpo.empresa : UserNac.empresa;
            var form = new formidable.IncomingForm();
            form.parse(request, async function (err, fields, files) {
                if (err) {
                    response.json(err);
                    return;
                }
                // cargar el catalogo de productos
                const pedido = fields.pedido;
                let catalogo = [];
                try {
                    const conn = await oracledb.getConnection(dbParams);
                    const query = "select codigo \"codigo\", ean \"ean\", cogrupo \"cogrupo\", initcap(nombre) \"nombre\", pvta \"pventa\", uncaja \"caja\", palletcaja \"pcaja\", " +
                        "stock \"stock\", cantidad \"cantidad\" from table(pack_new_web_expo.f_lista_productos(:p_tipo, :p_empresa, :p_pedido))";
                    const params = {
                        p_tipo: { val: sesion.tipo },
                        p_empresa: { val: cEmpresa },
                        p_pedido: { val: pedido }
                    };
                    result = await conn.execute(query, params, responseParams);
                    conn.close();
                    catalogo = result.rows;
                }
                catch (err) {
                    console.error(err);
                    response.json({
                        error: err
                    });
                    return;
                }
                // fin!
                var oldpath = files.plantilla.path;
                var newpath = fupload.tmppath + files.plantilla.name;
                mv(oldpath, newpath, async function (err) {
                    if (err) throw err;
                    let productos = new Map();
                    for (let producto of catalogo) {
                        productos.set(producto.ean + '', producto);
                    }
                    // ya tengo el catalogo de productos. ahora, debo leer el xlsx
                    var workbook = xlsx.readFile(newpath);
                    var sheet_name_list = workbook.SheetNames;
                    var xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
                    // ahora verificar stocks e insertar
                    try {
                        const conn = await oracledb.getConnection(dbParams);
                        let query;
                        if (sesion.tipo == 'E') {
                            query = "select co_punto_venta \"pventa\", co_serie_listado \"serie\", co_listado_precios \"lista\", co_fuerza_venta \"fventa\" from vt_pre_pedi_t where co_pre_pedido = :p_pedido and co_empresa = :p_empresa";
                        }
                        else {
                            query = "select co_punto_venta \"pventa\", co_serie_listado \"serie\", co_listado_precios \"lista\", co_fuerza_venta \"fventa\" from vt_pedi_t where co_pedido = :p_pedido and co_empresa = :p_empresa";
                        }
                        let params = {
                            p_pedido: pedido,
                            p_empresa: cEmpresa
                        };
                        let result = await conn.execute(query, params, responseParams);
                        let { pventa, serie, lista, fventa } = result.rows[0];
                        //
                        let mensajes = [];
                        let contadorrr = 0;
                        for (let row of xlData) {
contadorrr++;
                            let tpingreso = row['PRICE FOB US$'] == 0 ? 'P' : 'L';
                            let query = "call pack_new_web_expo.sp_agrega_producto_expo(:p_pedido, :p_empresa, :p_producto, :p_cantidad, :p_tpventa, :p_serielista, :p_fventa, :p_listaprec, :p_pventa, :o_codigo, :o_mensaje)";
                            if (productos.has(row.CODE + '')) {
                                let producto = productos.get(row.CODE + '');
                                // if (producto.stock >= row.QTY) {
                                // if (producto.stock >= 0) {
                                    let params = {
                                        p_pedido: { val: pedido },
                                        p_empresa: { val: cEmpresa },
                                        p_producto: { val: producto.codigo },
                                        p_cantidad: { val: row.QTY },
                                        p_tpventa: { val: tpingreso },
                                        p_serielista: { val: serie },
                                        p_fventa: { val: fventa },
                                        p_listaprec: { val: lista },
                                        p_pventa: { val: pventa },
                                        o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                                        o_mensaje: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
                                    };
                                    let result = await conn.execute(query, params, responseParams);
                                    const { o_codigo, o_mensaje } = result.outBinds;
                                    if (o_codigo == 1) {
                                        mensajes.push({ result: o_mensaje, codigo: row.CODE, nombre: row.DESCRIPTION, cantidad: row.QTY, tipo: tpingreso });
                                    }
                                    else {
                                        mensajes.push({ error: o_mensaje, codigo: row.CODE, nombre: row.DESCRIPTION, cantidad: row.QTY, tipo: tpingreso });
                                    }
                                /*}
                                else {
                                    mensajes.push({ error: 'El stock de ' + producto.nombre + ' es insuficiente' });
                                }*/
                            }
                            else {
                                let msgError = 'No se encontró el producto ' + row.CODE;
                                mensajes.push({ error: msgError, codigo: row.CODE, nombre: row.DESCRIPTION, cantidad: row.QTY, tipo: tpingreso });
                            }
                        }
                        conn.close();
                    }
                    catch (err) {
                        console.error(err);
                        response.json({
                            error: err.message
                        });
                    }
                    //
                    response.redirect('/extranet/detalle-pedido/' + pedido);
                    response.end();
                });
            });
            /*
            const { pedido } = request.body;
            console.log(request);
            const sesion = JSON.parse(request.cookies[CookieId]);
            const cEmpresa = sesion.tipo == 'E' ? UserExpo.empresa : UserNac.empresa;
            try {
                const conn = await oracledb.getConnection(dbParams);
                const query = "select codigo \"codigo\", ean \"ean\", cogrupo \"cogrupo\", initcap(nombre) \"nombre\", pvta \"pventa\", uncaja \"caja\", palletcaja \"pcaja\", " +
                    "stock \"stock\", cantidad \"cantidad\" from table(pack_new_web_expo.f_lista_productos(:p_tipo, :p_empresa, :p_pedido))";
                const params = {
                    p_tipo: { val: sesion.tipo },
                    p_empresa: { val: cEmpresa },
                    p_pedido: { val: pedido }
                };
                result = await conn.execute(query, params, responseParams);
                conn.close();
                response.json({
                    productos: result.rows
                });
            }
            catch (err) {
                console.error(err);
                response.json({
                    error: err
                });
                return;
            }*/
        }
        else response.json({
            error: 'Su sesión expiró'
        });
    },
    CerrarPedido: async (request, response) => {
        if (request.cookies[CookieId]) {
            const sesion = JSON.parse(request.cookies[CookieId]);
            const cEmpresa = sesion.tipo == 'E' ? UserExpo.empresa : UserNac.empresa;
            const { pedido, cliente } = request.body;
            try {
                let conn = await oracledb.getConnection(dbParams);
                let query = "call pack_new_web_expo.sp_cierra_pedido_expo(:p_pedido, :p_empresa, :o_codigo, :o_mensaje)";
                let params = {
                    p_pedido: { val: pedido },
                    p_empresa: { val: cEmpresa },
                    o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                    o_mensaje: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
                };
                const result = await conn.execute(query, params, responseParams);
                const { o_codigo, o_mensaje } = result.outBinds;
                conn.close();
                if (o_codigo == 1) {
                    let command = 'php /var/www/laravel/reporter/artisan extralife:sendmail ' + pedido;
                    // aqui enviar el correo
                    if (devmode == 'L') {
                        response.json({
                            mensaje: o_mensaje
                        });
                    }
                    else { // o sea, si está en 'P'
                        var exec = require('child_process').exec, child;
                        child = exec(command, async function (error, stdout, stderr) {
                            response.cookie('cliente', cliente);
                            response.json({
                                mensaje: o_mensaje
                            });
                        });
                    }
                }
                else {
                    response.json({
                        error: o_mensaje
                    });
                }
            }
            catch (err) {
                console.error(err);
                response.json({
                    error: err
                });
                return;
            }
        }
        else response.json({
            error: 'Su sesión expiró'
        });
    },
    // nuevos
    ListPedidosPendientes: async (request, response) => {
        const { empresa } = request.query;
        const query = "call pack_new_web_expo.sp_pedidos_pendientes(:p_result, :p_mensaje, :p_pedidos, :p_empresa)";
        const params = [
            { name: 'p_result', io: 'out', type: 'number' },
            { name: 'p_mensaje', io: 'out', type: 'string' },
            { name: 'p_pedidos', io: 'out', type: 'cursor' },
            { name: 'p_empresa', io: 'in', value: empresa }
        ];
        const result = await db.resultSet(query, params);
        if (result.error) {
            response.json({
                error: result.error
            });
            return;
        }
        if (result.p_result == 0) {
            response.json({
                error: result.p_mensaje
            });
            return;
        }
        response.json({
            pedidos: result.p_pedidos
        });
    },
    ProductosPedido: async (request, response) => {
        const { tipo, empresa, codigo } = request.query;
        const query = "call pack_new_web_expo.sp_productos_pedido(:x_result, :x_mensaje, :x_detalle, :x_tipo, :x_empresa, :x_codigo)";
        const params = [
            { name: 'x_result', io: 'out', type: 'number' },
            { name: 'x_mensaje', io: 'out', type: 'string' },
            { name: 'x_detalle', io: 'out', type: 'cursor' },
            { name: 'x_tipo', io: 'in', value: tipo },
            { name: 'x_empresa', io: 'in', value: empresa },
            { name: 'x_codigo', io: 'in', value: codigo }
        ];
        const result = await db.resultSet(query, params);
        if (result.error) {
            response.json({
                error: result.error
            });
            return;
        }
        if (result.x_result == 0) {
            response.json({
                error: result.x_mensaje
            });
            return;
        }
        response.json({
            pedidos: result.x_detalle
        });
    },
    ProcesarPrePedido: async (request, response) => {
        const { empresa, prepedido } = request.body;
        const query = "call pack_new_web_expo.sp_registra_pedido(:x_result,:x_de_result,:x_pedido,:x_empresa,:x_pre_pedido,:p_alias)";
        const params = [
            { name: 'x_result', io: 'out', type: 'number' },
            { name: 'x_de_result', io: 'out', type: 'string' },
            { name: 'x_pedido', io: 'out', type: 'string' },
            { name: 'x_empresa', io: 'in', value: empresa },
            { name: 'x_pre_pedido', io: 'in', value: prepedido },
            { name: 'p_alias', io: 'in', value: UserExpo.alias }
        ];
        const result = await db.statement(query, params);
        if (result.error) {
            response.json({
                error: result.error
                // error: 'Algunos productos no tienen stock'
            });
            return;
        }
        if (result.out.x_result == 0) {
            response.json({
                error: result.out.x_de_result
            });
            return;
        }
        // aqui enviar el correo
        let command = 'php /var/www/laravel/reporter/artisan exportacion:confirma_pedido ' + prepedido;
        if (devmode == 'L') {
console.log(command);
            response.json({
                pedido: result.out.x_pedido
            });
        }
        else {
            var exec = require('child_process').exec, child;
            child = exec(command, async function (error, stdout, stderr) {
                response.json({
                    pedido: result.out.x_pedido
                });
            });
        }
    },
    CheckInPedido: async (request, response) => {
        if (request.cookies[CookieId]) {
            let sesion = request.cookies[CookieId];
            const { prepedido } = request.params;
            response.render(path.resolve('client/views/extranet/checkout-pedido.ejs'), { sesion: JSON.stringify(JSON.parse(sesion)), prepedido: prepedido });
        }
        else response.redirect('/extranet/login');
    },
    CargaStockDetallePedido: async (request, response) => {
        //olakease
        if (request.cookies[CookieId]) {
            const { eans, prepedido, cliente } = request.query;
            const sesion = JSON.parse(request.cookies[CookieId]);
            let query = "select codigo \"codigo\", ean \"ean\", pvta \"pventa\", stock \"stock\", cantidad \"cantidad\", cjsnivel \"cjsnivel\", unidcaja \"unidcaja\", maxniveles \"maxniveles\" from table(pack_new_web_expo.f_productos_stock(:p_empresa, :p_pedido, :p_eans))";
            let params = [
                { name: 'p_empresa', io: 'in', value: UserExpo.empresa },
                { name: 'p_pedido', io: 'in', value: prepedido },
                { name: 'p_eans', io: 'in', value: eans }
            ];
            let result = await db.select(query, params);
            if (result.error) {
                response.json({
                    error: result.error
                });
                return;
            }
            let rproductos = result.rows;
            // carga los datos del cliente
            const cmoneda = sesion.tipo == 'E' ? 2 : 1;
            const calias = sesion.tipo == 'E' ? UserExpo.alias : UserNac.alias;
            let xdata = [calias, cliente, 34, 1].join('@');
            query = "select pack_new_clife_clientes.f_v_ctacte_cliente(:p_data) \"out\" from dual";
            params = [
                { name: 'p_data', io: 'in', value: xdata }
            ];
            result = await db.select(query, params);
            let sCliente = result.rows[0].out.split('@');
            sCliente = {
                codigo: sCliente[8],
                nombre: sCliente[0],
                disponible: parseFloat(sCliente[1]),
                solicitud: parseFloat(sCliente[2]),
                deuda: parseFloat(sCliente[3]),
                moneda: sCliente[9]
            };
            // verifica si hay solicitud de credito pendiente
            let cUsuario = sesion.tipo == 'E' ? UserExpo.codigo : UserNac.codigo;
            query = "select im_solicitado \"importe\", to_char(fe_solicitud,'dd/mm/yyyy hh24:mi') \"fecha\" from ba_soli_cred_m where co_vendedor = :p_vendedor and es_vigencia = 'Pendiente' and co_cliente = :p_cliente";
            params = [
                { name: 'p_vendedor', io: 'in', value: cUsuario },
                { name: 'p_cliente', io: 'in', value: cliente }
            ];
            result = await db.select(query, params);
            let dsolicitud = { existe: false };
            if (result.rows.length > 0) {
                dsolicitud = {
                    existe: true,
                    datos: result.rows[0]
                };
            }
            // go
            response.json({
                data: rproductos,
                cliente: sCliente,
                solicitud: dsolicitud
            });
        }
        else response.redirect('/extranet/login');
    },
    VerificaPedidoAdmin: async (request, response) => {
        if (request.cookies[CookieId]) {
            const { prepedido } = request.query;
            const sesion = JSON.parse(request.cookies[CookieId]);
            const query = "call pack_new_web_expo.sp_estado_admin_pedido(:o_codigo, :o_estado, :p_prepedido, :p_empresa, :p_codigo)";
            const params = [
                { name: 'o_codigo', io: 'out', type: 'number' },
                { name: 'o_estado', io: 'out', type: 'string' },
                { name: 'p_prepedido', io: 'in', value: prepedido },
                { name: 'p_empresa', io: 'in', value: UserExpo.empresa },
                { name: 'p_codigo', io: 'in', value: sesion.codigo }
            ];
            const result = await db.resultSet(query, params);
            if (result.error) {
                response.json({
                    error: result.error
                });
                return;
            }
            if (result.o_codigo == 0) {
                response.json({
                    error: result.o_estado
                });
                return;
            }
            response.json({
                estado: result.o_estado
            });
        }
        else response.json({
            error: 'No tiene permisos para acceder aquí'
        });
    },
    CabeceraSolicitudCredito: async (request, response) => {
        if (request.cookies[CookieId]) {
            const { cliente } = request.query;
            const query = "call pack_new_web_expo.sp_cabecera_solcrd(:o_codigo, :o_estado, :o_fventa, :o_cpago, :p_alias, :p_cliente)";
            const params = [
                { name: 'o_codigo', io: 'out', type: 'number' },
                { name: 'o_estado', io: 'out', type: 'string' },
                { name: 'o_fventa', io: 'out', type: 'cursor' },
                { name: 'o_cpago', io: 'out', type: 'cursor' },
                { name: 'p_alias', io: 'in', value: UserExpo.alias },
                { name: 'p_cliente', io: 'in', value: cliente }
            ];
            const result = await db.resultSet(query, params);
            if (result.error) {
                response.json({
                    error: result.error
                });
                return;
            }
            if (result.o_codigo == 0) {
                response.json({
                    error: result.o_estado
                });
                return;
            }
            response.json({
                fventa: result.o_fventa[0],
                cpago: result.o_cpago
            });
        }
        else response.json({
            error: 'No tiene permisos para acceder aquí'
        });
    },
    EnviarSolicitudCredito: async (request, response) => {
        if (request.cookies[CookieId]) {
            let { cliente, importe, inicial, fventa, cpago, observaciones } = request.body;
            if (!observaciones) observaciones = '-';
            const query = "call pack_new_web_expo.sp_envia_solicitud_credito (:o_result, :o_mensaje, :p_alias, :p_ruc, :p_importe, :p_inicial, :p_semanal, :p_fventa, :p_cpago, :p_moneda, :p_observacion)";
            const params = [
                { name: 'o_result', io: 'out', type: 'number' },
                { name: 'o_mensaje', io: 'out', type: 'string' },
                { name: 'p_alias', io: 'in', value: UserExpo.alias },
                { name: 'p_ruc', io: 'in', value: cliente },
                { name: 'p_importe', io: 'in', value: importe },
                { name: 'p_inicial', io: 'in', value: 0 },
                { name: 'p_semanal', io: 'in', value: inicial },
                { name: 'p_fventa', io: 'in', value: fventa },
                { name: 'p_cpago', io: 'in', value: cpago },
                { name: 'p_moneda', io: 'in', value: 2 },
                { name: 'p_observacion', io: 'in', value: observaciones }
            ];
            const result = await db.resultSet(query, params);
            if (result.error) {
                response.json({
                    error: result.error
                });
                return;
            }
            if (result.o_codigo == 0) {
                response.json({
                    error: result.o_estado
                });
                return;
            }
            response.json({
                success: true
            });
        }
        else response.json({
            error: 'No tiene permisos para acceder aquí'
        });
    },
    AbrePrePedido: async (request, response) => {
        if (request.cookies[CookieId]) {
            const { pedido, usuario } = request.body;
            const query = "call pack_new_web_expo.sp_abre_pre_pedido (:o_result, :o_mensaje, :p_pedido, :p_cliente)";
            const params = [
                { name: 'o_result', io: 'out', type: 'number' },
                { name: 'o_mensaje', io: 'out', type: 'string' },
                { name: 'p_pedido', io: 'in', value: pedido },
                { name: 'p_cliente', io: 'in', value: usuario }
            ];
            const result = await db.resultSet(query, params);
            if (result.error) {
                response.json({
                    error: result.error
                });
                return;
            }
            if (result.o_codigo == -1) {
                response.json({
                    error: result.o_estado
                });
                return;
            }
            response.json({
                success: true
            });
        }
        else response.json({
            error: 'No tiene permisos para acceder aquí'
        });
    },
    SolicitaLiberacionProductos: async (request, response) => {
        if (request.cookies[CookieId]) {
            const { pedido } = request.body;
            const query = "call pack_new_web_expo.sp_solicita_traslado (:o_result, :o_mensaje, :p_pedido, :p_empresa)";
            const params = [
                { name: 'o_result', io: 'out', type: 'number' },
                { name: 'o_mensaje', io: 'out', type: 'string' },
                { name: 'p_pedido', io: 'in', value: pedido },
                { name: 'p_empresa', io: 'in', value: UserExpo.empresa }
            ];
            const result = await db.resultSet(query, params);
            if (result.error) {
                response.json({
                    error: result.error
                });
                return;
            }
            if (result.o_codigo == -1) {
                response.json({
                    error: result.o_estado
                });
                return;
            }
            // aqui enviar el correo
            let command = 'php /var/www/laravel/reporter/artisan exportacion:transferencia ' + pedido;
            if (devmode == 'L') {
console.log(command);
                response.json({
                    success: true
                });
            }
            else {
                var exec = require('child_process').exec, child;
                child = exec(command, async function (error, stdout, stderr) {
                    response.json({
                        success: true
                    });
                });
            }
        }
        else response.json({
            error: 'No tiene permisos para acceder aquí'
        });
    },
    TrasladoProductos: (request, response) => {
        if (request.cookies[CookieId]) {
            let sesion = request.cookies[CookieId];
            let cliente = request.cookies['cliente'] ? request.cookies['cliente'] : '-';
            response.render(path.resolve('client/views/extranet/traslado.ejs'), { sesion: JSON.stringify(JSON.parse(sesion)), cliente: cliente });
        }
        else response.redirect('/extranet/login');
    },
    ListaProductosLiberacion: async (request, response) => {
        if (request.cookies[CookieId]) {
            const { pedido, ubicacion } = request.query;
            const query = "select * from table (pack_new_web_expo.f_productos_liberacion (:empresa, :almacen, :pedido, :ubicacion))";
            const params = [
                { name: 'empresa', io: 'in', value: UserExpo.empresa },
                { name: 'almacen', io: 'in', value: 'F' },
                { name: 'pedido', io: 'in', value: pedido },
                { name: 'ubicacion', io: 'in', value: ubicacion }
            ];
            const result = await db.select(query, params);
            response.json({
                productos: result.rows
            });
        }
        else response.json({
            error: 'No tiene permisos para acceder aquí'
        });
    },
    ListaUbicacionesTraslado: async (request, response) => {
        if (request.cookies[CookieId]) {
            const { producto } = request.query;
            const alias = 'VConde';
            const query = "call pack_new_web_expo.sp_ubicaciones_traslado(:alias,:producto,:origen,:destino)";
            const params = [
                { name: 'alias', io: 'in', value: alias },
                { name: 'producto', io: 'in', value: producto },
                { name: 'origen', io: 'out', type: 'cursor' },
                { name: 'destino', io: 'out', type: 'cursor' }
            ];
            const result = await db.resultSet(query, params);
            response.json({
                ubicaciones: result
            });
        }
        else response.json({
            error: 'No tiene permisos para acceder aquí'
        });
    },
    TrasladarProductos: async (request, response) => {
        if (request.cookies[CookieId]) {
            const sesion = JSON.parse(request.cookies[CookieId]);
            const { producto, lote, origen, cantidad, destino, prepedido } = request.body;
            //
            const qryalias = "call pack_new_web_expo.sp_alias_usr(:p_usuario,:p_empresa,:o_alias)";
            const prmalias = [
                { name: 'p_usuario', io: 'in', value: sesion.codigo },
                { name: 'p_empresa', io: 'in', value: UserExpo.empresa },
                { name: 'o_alias', io: 'out', type: 'string' }
            ];
            const rsalias = await db.resultSet(qryalias, prmalias);
            if (rsalias.error) {
                response.json({
                    error: rsalias.error
                });
                return;
            }
            if (rsalias.o_alias == 'x') {
                response.json({
                    error: 'Usuario incorrexto'
                });
                return;
            }
            //
            const alias = rsalias.o_alias;
            // const alias = 'VConde';
            const almacen = 'VILLA';
            const query = "call trans_almacenes_00.sp_traslado_ubicacion_exp(:ocodigo,:omensaje,:alias,:almacen,:producto,:lote,:origen,:cantidad,:destino,:prepedido)";
            const params = [
                { name: 'ocodigo', io: 'out', type: 'number' },
                { name: 'omensaje', io: 'out', type: 'string' },
                { name: 'alias', io: 'in', value: alias },
                { name: 'almacen', io: 'in', value: almacen },
                { name: 'producto', io: 'in', value: producto },
                { name: 'lote', io: 'in', value: lote },
                { name: 'origen', io: 'in', value: origen },
                { name: 'cantidad', io: 'in', value: cantidad },
                { name: 'destino', io: 'in', value: destino },
                { name: 'prepedido', io: 'in', value: prepedido }
            ];
            const result = await db.resultSet(query, params);
            if (result.error) {
                response.json({
                    error: result.error
                });
                return;
            }
            if (result.ocodigo == 0) {
                response.json({
                    error: result.omensaje
                });
                return;
            }
            response.json({
                success: true
            });
        }
        else response.json({
            error: 'No tiene permisos para acceder aquí'
        });
    },
    ListaPedidosTraslado: async (request, response) => {
        if (request.cookies[CookieId]) {
            const query = "call pack_new_web_expo.sp_prepedidos_traslado(:ocodigo,:omensaje,:opedidos)";
            const params = [
                { name: 'ocodigo', io: 'out', type: 'number' },
                { name: 'omensaje', io: 'out', type: 'string' },
                { name: 'opedidos', io: 'out', type: 'cursor' }
            ];
            const result = await db.resultSet(query, params);
            if (result.error) {
                response.json({
                    error: result.error
                });
                return;
            }
            if (result.ocodigo == 0) {
                response.json({
                    error: result.omensaje
                });
                return;
            }
            response.json({
                pedidos: result.opedidos
            });
        }
        else response.json({
            error: 'No tiene permisos para acceder aquí'
        });
    },
    ReporteTraslado: async (request, response) => {
        if (request.cookies[CookieId]) {
            let sesion = request.cookies[CookieId];
            const { pedido } = request.query;
            const query = "call pack_new_web_expo.sp_reporte_traslado(:pedido,:ocodigo,:omensaje,:oreporte)";
            const params = [
                { name: 'pedido', io: 'in', value: pedido },
                { name: 'ocodigo', io: 'out', type: 'number' },
                { name: 'omensaje', io: 'out', type: 'string' },
                { name: 'oreporte', io: 'out', type: 'cursor' }
            ];
            const result = await db.resultSet(query, params);
            if (result.ocodigo == -1) {
                response.send(result.omensaje);
                return;
            }
            response.render(path.resolve('client/views/extranet/reporte-traslado.ejs'), { sesion: JSON.stringify(JSON.parse(sesion)), reporte: JSON.stringify(result.oreporte), pedido: pedido });
        }
        else response.redirect('/extranet/login');
    },
    ListaPedidosValidos: async (request, response) => {
        if (request.cookies[CookieId]) {
            const sesion = JSON.parse(request.cookies[CookieId]);
            let cliente = sesion.admin == 'S' ? -1 : sesion.codigo;
            const query = "call pack_new_web_expo.sp_pedidos_listado(:cliente,:opedidos)";
            const params = [
                { name: 'cliente', io: 'in', value: cliente },
                { name: 'opedidos', io: 'out', type: 'cursor' }
            ];
            const result = await db.resultSet(query, params);
            if (result.error) {
                response.json({
                    error: result.error
                });
                return;
            }
            response.json({
                pedidos: result.opedidos
            });
        }
        else response.json({
            error: 'No tiene permisos para acceder aquí'
        });
    },
    ArchivosAdjuntos: (request, response) => {
        if (request.cookies[CookieId]) {
            const { pedido } = request.query;
            const sesion = JSON.parse(request.cookies[CookieId]);
            const fs = require('fs');
            const basepath = fupload.diskpath + pedido;
            if (!fs.existsSync(basepath)) {
                fs.mkdirSync(basepath, 0775);
            }
            fs.readdir(basepath, async function(err, files) {
                if (err) {
                    response.send(err.getMessage());
                    return;
                }
                let archivos = JSON.stringify(files);
                // carga el legajo de productos
                const query = "call pack_new_web_expo.sp_lista_archivos(:pedido,:empresa,:archivos)";
                const params = [
                    { name: 'pedido', io: 'in', value: pedido },
                    { name: 'empresa', io: 'in', value: UserExpo.empresa },
                    { name: 'archivos', io: 'out', type: 'cursor' }
                ];
                const result = await db.resultSet(query, params);
                const legajo = result.archivos;
                // fin
                response.render(path.resolve('client/views/extranet/archivos-adjuntos.ejs'), { archivos: archivos, pedido: pedido, sesion: JSON.stringify(sesion), legajo: JSON.stringify(legajo) });
            });
        }
        else response.json({
            error: 'No tiene permisos para acceder aquí'
        });
    },
    UploadAdjuntos: async (request, response) => {
        if (request.cookies[CookieId]) {
            var form = new formidable({multiples:true});
            form.parse(request, async function (err, fields, files) {
                if (err) {
                    response.json(err);
                    return;
                }
                // prepara las variables
                const pedido = fields.pedido;
                const basepath = fupload.diskpath + pedido + '/';
                const numArchivos = files.archivos.length;
                let contArchivos = 0;
                // recorre los archivos
                if (numArchivos > 0) {
                    for (let archivo of files.archivos) {
                        // genera la ruta destino
                        let filename = archivo.name;
                        // mover el archivo
                        var oldpath = archivo.path;
                        var newpath = basepath + filename;
                        mv(oldpath, newpath, async function (err) {
                            if (err) {
                                response.json({
                                    error: err
                                });
                                return;
                            }
                            // registra en la bd
                            const sesion = JSON.parse(request.cookies[CookieId]);
                            const query = "call pack_new_web_expo.sp_registra_archivo(:pedido,:empresa,:archivo,:usuario)";
                            const params = [
                                { name: 'pedido', io: 'in', value: pedido },
                                { name: 'empresa', io: 'in', value: UserExpo.empresa },
                                { name: 'archivo', io: 'in', value: filename },
                                { name: 'usuario', io: 'in', value: sesion.codigo }
                            ];
                            await db.resultSet(query, params);
                            // producto fue movido corretamente
                            contArchivos++;
                            if (contArchivos == numArchivos) {
                                response.redirect('/extranet/archivos-adjuntos?pedido=' + pedido);
                            }
                        });
                    }
                }
                else {
                    let archivo = files.archivos;
                    // genera la ruta destino
                    let filename = archivo.name;
                    // mover el archivo
                    var oldpath = archivo.path;
                    var newpath = basepath + filename;
                    mv(oldpath, newpath, async function (err) {
                        if (err) {
                            response.json({
                                error: err
                            });
                            return;
                        }
                        // registra en la bd
                        const sesion = JSON.parse(request.cookies[CookieId]);
                        const query = "call pack_new_web_expo.sp_registra_archivo(:pedido,:empresa,:archivo,:usuario)";
                        const params = [
                            { name: 'pedido', io: 'in', value: pedido },
                            { name: 'empresa', io: 'in', value: UserExpo.empresa },
                            { name: 'archivo', io: 'in', value: filename },
                            { name: 'usuario', io: 'in', value: sesion.codigo }
                        ];
                        await db.resultSet(query, params);
                        // producto fue movido corretamente
                        response.redirect('/extranet/archivos-adjuntos?pedido=' + pedido);
                    });
                }
            });
        }
        else response.json({
            error: 'Su sesión expiró'
        });
    },
    RetirarAdjunto: async (request, response) => {
        if (request.cookies[CookieId]) {
            const sesion = JSON.parse(request.cookies[CookieId]);
            const { pedido, archivo, id } = request.body;
            const fs = require('fs');
            const basepath = fupload.diskpath + pedido + '/' + archivo;
            if (!fs.existsSync(basepath)) {
                response.json({
                    error: 'El archivo especificado no existe'
                });
                return;
            }
            fs.unlinkSync(basepath);
            // registra en la bd
            const query = "call pack_new_web_expo.sp_elimina_archivo(:usuario,:archivo)";
            const params = [
                { name: 'usuario', io: 'in', value: sesion.codigo },
                { name: 'archivo', io: 'in', value: id }
            ];
            await db.resultSet(query, params);
            //
            response.json({
                success: true
            });
        }
        else response.json({
            error: 'No tiene permisos para acceder aquí'
        });
    },
    DescargaAdjunto: (request, response) => {
        if (request.cookies[CookieId]) {
            const { pedido, archivo } = request.query;
            const fs = require('fs');
            const basepath = fupload.diskpath + pedido + '/' + archivo;
            if (!fs.existsSync(basepath)) {
                response.send('El archivo especificado no existe');
                return;
            }
            response.download(basepath);
        }
        else response.send('No tiene permisos para acceder aquí');
    },
    HistorialPedidos: async (request, response) => {
        if (request.cookies[CookieId]) {
            const sesion = JSON.parse(request.cookies[CookieId]);
            if (sesion.admin == 'N') {
                response.json({
                    error: 'No tiene privilegios para acceder aquí'
                });
                return;
            }
            const query = "call pack_new_web_expo.sp_historial_pedidos(:opedidos)";
            const params = [
                { name: 'opedidos', io: 'out', type: 'cursor' }
            ];
            const result = await db.resultSet(query, params);
            const pedidos = result.opedidos;
            // 
            response.render(path.resolve('client/views/extranet/pedidos-historial.ejs'), { sesion: JSON.stringify(sesion), pedidos: JSON.stringify(pedidos) });
        }
        else response.json({
            error: 'No tiene permisos para acceder aquí'
        });
    },
    XlsReporteTraslado: async (request, response) => {
        let sesion = request.cookies[CookieId];
        const { pedido } = request.query;
        const query = "call pack_new_web_expo.sp_reporte_traslado(:pedido,:ocodigo,:omensaje,:oreporte)";
        const params = [
            { name: 'pedido', io: 'in', value: pedido },
            { name: 'ocodigo', io: 'out', type: 'number' },
            { name: 'omensaje', io: 'out', type: 'string' },
            { name: 'oreporte', io: 'out', type: 'cursor' }
        ];
        const result = await db.resultSet(query, params);
        if (result.ocodigo == -1) {
            response.send(result.omensaje);
            return;
        }
        // escribe archivo excel
        const wb = xlsx.utils.book_new();
        wb.SheetNames.push("reporte-traslado");
        //
        let ws = xlsx.utils.json_to_sheet(result.oreporte);
        wb.Sheets["reporte-traslado"] = ws;
        let wbbuf = xlsx.write(wb, {
            bookType: 'xlsx',
            bookSST: false,
            type: 'buffer'
        });
        response.writeHead(200, {
            'Content-Disposition': 'attachment;filename=traslado_' + pedido + '.xlsx',
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        response.end(wbbuf);
    },
    XlsProductosPedido: async (request, response) => {
        const { tipo, empresa, codigo } = request.query;
        const query = "call pack_new_web_expo.sp_productos_pedido(:x_result, :x_mensaje, :x_detalle, :x_tipo, :x_empresa, :x_codigo)";
        const params = [
            { name: 'x_result', io: 'out', type: 'number' },
            { name: 'x_mensaje', io: 'out', type: 'string' },
            { name: 'x_detalle', io: 'out', type: 'cursor' },
            { name: 'x_tipo', io: 'in', value: tipo },
            { name: 'x_empresa', io: 'in', value: empresa },
            { name: 'x_codigo', io: 'in', value: codigo }
        ];
        const result = await db.resultSet(query, params);
        if (result.error) {
            response.send(result.error);
            return;
        }
        if (result.x_result == 0) {
            response.send(result.x_mensaje);
            return;
        }
        // escribe archivo excel
        const wb = xlsx.utils.book_new();
        wb.SheetNames.push("detalle-pedido");
        //
        let ws = xlsx.utils.json_to_sheet(result.x_detalle);
        wb.Sheets["detalle-pedido"] = ws;
        let wbbuf = xlsx.write(wb, {
            bookType: 'xlsx',
            bookSST: false,
            type: 'buffer'
        });
        response.writeHead(200, {
            'Content-Disposition': 'attachment;filename=detalle_pedido.xlsx',
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        response.end(wbbuf);
    }
};

module.exports = extranetController;