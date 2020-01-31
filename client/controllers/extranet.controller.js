const path = require('path');
const bcrypt = require('bcrypt');
const oracledb = require('oracledb');
const dbParams = require('../../server/database');

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
            response.render(path.resolve('client/views/extranet/home.ejs'), { sesion: JSON.stringify(JSON.parse(sesion)) });
        }
        else response.redirect('/extranet/login');
    },
    login: (request, response) => {
        response.render(path.resolve('client/views/extranet/login.ejs'), {});
    },
    logout: (request, response) => {
        response.clearCookie(CookieId, { httpOnly: true });
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
            // go!
            response.render(path.resolve('client/views/extranet/detalle-pedido.ejs'), { sesion: JSON.stringify(JSON.parse(sesion)), pedido: pedido });
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
            let query = "select node_password \"hash\", st_cuenta_activada \"stact\", st_verifica_mail \"stmail\", co_cliente \"codigo\", de_nombre_comercial \"ncomercial\", de_razon_social \"rsocial\", fe_suscripcion \"fsuscripcion\", de_email \"email\", de_telefono \"telefono\", st_admin \"admin\", st_tipo_usuario \"tipo\" from cl_usuarios where de_email = :p_email and co_empresa = :p_empresa";
            let params = {
                p_email: { val: email },
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
        let { texto } = request.body;
        if (request.cookies[CookieId]) {
            let result;
            texto = texto.toUpperCase();
            try {
                let conn = await oracledb.getConnection(dbParams);
                let query = "select codigo \"codigo\", nombre \"nombre\" from table(pack_new_web_expo.f_buscar_clientes(:p_codigo,:p_empresa,:p_texto))";
                let params = {
                    p_codigo: { val: UserExpo.codigo },
                    p_empresa: { val: UserExpo.empresa },
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
// yrazonsocial||'@'||nvl(ydisponible,0)||'@'||nvl(yimpsolicitud, 0)||'@'||nvl(ydeuda, 0)||'@'||yestado||'@'||ymensaje||'@'||ynumdirecc||'@'||ycodireccion||'@'||ycocliente;
                sCliente = {
                    codigo: sCliente[8],
                    nombre: sCliente[0],
                    disponible: parseFloat(sCliente[1]),
                    solicitud: parseFloat(sCliente[2]),
                    deuda: parseFloat(sCliente[3]),
                    moneda: sCliente[9]
                };
                // verifica si hay pedido abierto
                query = "select codigo,moneda,importe,to_char(fecha,'dd/mm/yyyy') fecha,items from table(pack_new_web_expo.f_info_pedido(:p_tipo, :p_cliente, :p_empresa))";
                params = {
                    p_tipo: { val: sesion.tipo },
                    p_cliente: { val: cliente },
                    p_empresa: { val: 11 }
                };
                result = await conn.execute(query, params, responseParams);
                let sPedido;
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
                // cuenta corriente
                query = "select co_documento \"documento\", de_moneda \"moneda\", im_saldo \"deuda\", to_char(fec_venc,'yyyy-mm-dd') \"vence\", nu_dias_vencido \"dias\", " +
                    "de_cond_pago \"cpago\", de_vendedor \"vendedor\" from table(pack_new_clife_clientes.f_vt_fact_pendientes_cliente(:p_cliente, :p_empresa, :p_moneda))";
                params = {
                    p_cliente: cliente,
                    p_empresa: 11,
                    p_moneda: cmoneda
                };
                result = await conn.execute(query, params, responseParams);
                sCtacte = result.rows;
                // out
                conn.close();
                response.json({
                    data: {
                        cliente: sCliente,
                        pedido: sPedido,
                        ctacte: sCtacte
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
                if (o_resultado) {
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
                query = "select codigo, cmoneda, moneda, importe, to_char(fecha,'dd/mm/yyyy') fecha, items, vendedor, vigencia, cliente from table(pack_new_web_expo.f_datos_pedido(:p_tipo, :p_pedido, :p_empresa))";
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
                    productos: []
                };
                // carga detalle del pedido
                query = "select codigo \"codigo\",ean \"ean\",initcap(nombre) \"nombre\",cantidad \"cantidad\",cajas \"cajas\",pallets \"pallets\",importe \"importe\", " +
                    "difer \"difer\",tipo \"tipo\", familia \"familia\",pventa \"pventa\",promodsc \"promodsc\",clase \"clase\", unidcaja \"unidcaja\" from " + 
                    "table(pack_new_web_expo.f_detalle_pedido(:p_tipo, :p_empresa, :p_pedido))";
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
                // escribir
                conn.close();
                response.json({
                    pedido: dPedido,
                    cliente: dCliente
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
                    query = "select co_punto_venta \"pventa\", co_serie_listado \"serie\", co_listado_precios \"lista\", co_fuerza_venta \"fventa\" from vt_pre_pedi_c where co_pre_pedido = :p_pedido and co_empresa = :p_empresa";
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
                        p_pventa: { val: pventa },
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
                query = "select codigo \"codigo\",ean \"ean\",initcap(nombre) \"nombre\",cantidad \"cantidad\",cajas \"cajas\",pallets \"pallets\",importe \"importe\", " +
                    "difer \"difer\",tipo \"tipo\", familia \"familia\",pventa \"pventa\",promodsc \"promodsc\",clase \"clase\", unidcaja \"unidcaja\" from " +
                    "table(pack_new_web_expo.f_detalle_pedido(:p_tipo, :p_empresa, :p_pedido))";
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
                let query = "select codigo \"codigo\",ean \"ean\",initcap(nombre) \"nombre\",cantidad \"cantidad\",cajas \"cajas\",pallets \"pallets\",importe \"importe\", " +
                    "difer \"difer\",tipo \"tipo\", familia \"familia\",pventa \"pventa\",promodsc \"promodsc\",clase \"clase\", unidcaja \"unidcaja\" from " +
                    "table(pack_new_web_expo.f_detalle_pedido(:p_tipo, :p_empresa, :p_pedido))";
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
            const { pedido, productos } = request.body;
            const cEmpresa = sesion.tipo == 'E' ? UserExpo.empresa : UserNac.empresa;
            try {
                const conn = await oracledb.getConnection(dbParams);
                let mensajes = [];
                for (let producto of productos) {
                    //
                    let query = "call pack_new_web_expo.sp_titulo_gratuito_expo(:p_pedido, :p_empresa, :p_producto, :p_tipo, :p_difer, :o_codigo, :o_mensaje)";
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
                let query = "select codigo \"codigo\",ean \"ean\",initcap(nombre) \"nombre\",cantidad \"cantidad\",cajas \"cajas\",pallets \"pallets\",importe \"importe\", " +
                    "difer \"difer\",tipo \"tipo\", familia \"familia\",pventa \"pventa\",promodsc \"promodsc\",clase \"clase\", unidcaja \"unidcaja\" from " +
                    "table(pack_new_web_expo.f_detalle_pedido(:p_tipo, :p_empresa, :p_pedido))";
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
                query = "select codigo \"codigo\",ean \"ean\",initcap(nombre) \"nombre\",cantidad \"cantidad\",cajas \"cajas\",pallets \"pallets\",importe \"importe\", " +
                    "difer \"difer\",tipo \"tipo\", familia \"familia\",pventa \"pventa\",promodsc \"promodsc\",clase \"clase\", unidcaja \"unidcaja\" from " +
                    "table(pack_new_web_expo.f_detalle_pedido(:p_tipo, :p_empresa, :p_pedido))";
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
    }
};

module.exports = extranetController;