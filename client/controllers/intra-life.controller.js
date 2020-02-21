const path = require('path');
const bcrypt = require('bcrypt');
const oracledb = require('oracledb');
const dbParams = require('../../server/database');
const confParams = require('../../server/config/intranet');
const responseParams = {
    outFormat: oracledb.OBJECT
};

const LifeController = {
    Login: (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            response.redirect('/intranet');
            return;
        }
        let data = {};
        response.render(path.resolve('client/views/intranet/login.ejs'), data);
    },
    Logout: (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            response.clearCookie(confParams.cookieIntranet, { httpOnly: true });
            response.clearCookie(confParams.cookieError, { httpOnly: true });
            response.clearCookie(confParams.cookieAdmin, { httpOnly: true });
        }
        response.redirect('/intranet');
    },
    ActivarCuenta: (request, response) => {
        let data = {};
        response.render(path.resolve('client/views/intranet/alta.ejs'), data);
    },
    AuthLogin: async (request, response) => {
        const { codigo, pswd } = request.body;
        let empresa = 11;
        let result;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select node_password \"hash\", st_cuenta_activada \"stact\", st_verifica_mail \"stmail\", co_cliente \"codigo\", initcap(de_nombre_comercial) \"ncomercial\", initcap(de_razon_social) \"rsocial\", fe_suscripcion \"fsuscripcion\", de_email \"email\", de_telefono \"telefono\", st_admin \"admin\", st_tipo_usuario \"tipo\" from cl_usuarios where co_cliente = :p_rucdni and co_empresa = :p_empresa";
            let params = {
                p_rucdni: { val: codigo },
                p_empresa: { val: empresa }
            };
            result = await conn.execute(query, params, responseParams);
            result = result.rows[0];
console.log(result);
            conn.close();
            // verificar si la cuenta esta activada y el email fue validado
            // compara la clave con el hash
            bcrypt.compare(pswd, result.hash, function (err, res) {
                if (err) {
console.error('pswd:', pswd);
console.error('result.hash:', result.hash);
                    response.cookie(confParams.cookieError, 'La clave ingresada es incorrecta.', { httpOnly: true });
                    response.redirect('/intranet/login');
                    return;
                }
                let sesion = result;
                delete sesion.hash;
                delete sesion.stact;
                delete sesion.stmail;
                response.cookie(confParams.cookieAdmin, sesion.admin, { httpOnly: true });
                response.cookie(confParams.cookieIntranet, JSON.stringify(sesion), { httpOnly: true });
                response.redirect('/intranet');
            });
        }
        catch (err) {
            console.error(err);
            response.json(err);
            return;
        }
    },
    Home: (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            let sess = request.cookies[confParams.cookieIntranet];
            let admin = request.cookies[confParams.cookieAdmin] ? request.cookies[confParams.cookieAdmin] : 'N';console.log(admin);
            let data = { sesion: sess, admin: admin };
            response.render(path.resolve('client/views/intranet/home.ejs'), data);
        }
        else response.redirect('/intranet/login');
    },
    Documentos: (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            let sess = request.cookies[confParams.cookieIntranet];
            let admin = request.cookies[confParams.cookieAdmin] ? request.cookies[confParams.cookieAdmin] : 'N';
            let { tipo } = request.params;
            let id;
            // ubica el código a partir del tipo
            switch (tipo) {
                case 'boletas':
                    id = 'sidenav-boletas';
                    break;
                case 'contratos':
                    id = 'sidenav-contratos';
                    break;
                case 'memorandos':
                    id = 'sidenav-memorandos';
                    break;
                default: break;
            }
            tipo = tipo[0].toUpperCase() + tipo.slice(1);
            let data = { sesion: sess, admin: admin, tipo: tipo, id: id };
            response.render(path.resolve('client/views/intranet/documentos.ejs'), data);
        }
        else response.redirect('/intranet/login');
    },
    DatosPersonales: (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            let sess = request.cookies[confParams.cookieIntranet];
            let admin = request.cookies[confParams.cookieAdmin] ? request.cookies[confParams.cookieAdmin] : 'N';
            let data = { sesion: sess, admin: admin };
            response.render(path.resolve('client/views/intranet/perfil.ejs'), data);
        }
        else response.redirect('/intranet/login');
    },
    Personal: (request, response) => {
        if (request.cookies[confParams.cookieIntranet] && request.cookies[confParams.cookieAdmin] == 'S') {
            let sess = request.cookies[confParams.cookieIntranet];
            let admin = request.cookies[confParams.cookieAdmin] ? request.cookies[confParams.cookieAdmin] : 'N';
            let data = { sesion: sess, admin: admin, id: 'sidenav-personal' };
            response.render(path.resolve('client/views/intranet/personal.ejs'), data);
        }
        else response.redirect('/intranet/login');
    },
    SubirDocumentos: (request, response) => {
        if (request.cookies[confParams.cookieIntranet] && request.cookies[confParams.cookieAdmin] == 'S') {
            let sess = request.cookies[confParams.cookieIntranet];
            let admin = request.cookies[confParams.cookieAdmin] ? request.cookies[confParams.cookieAdmin] : 'N';
            let data = { sesion: sess, admin: admin, id: 'sidenav-subirdocs' };
            response.render(path.resolve('client/views/intranet/subirdocs.ejs'), data);
        }
        else response.redirect('/intranet/login');
    },
    EnvioMensajes: (request, response) => {
        if (request.cookies[confParams.cookieIntranet] && request.cookies[confParams.cookieAdmin] == 'S') {
            let sess = request.cookies[confParams.cookieIntranet];
            let admin = request.cookies[confParams.cookieAdmin] ? request.cookies[confParams.cookieAdmin] : 'N';
            let data = { sesion: sess, admin: admin, id: 'sidenav-mensajes' };
            response.render(path.resolve('client/views/intranet/envio-mensajes.ejs'), data);
        }
        else response.redirect('/intranet/login');
    },
    // peticiones ajax
    CargarDatosUsuario: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            let sesion = JSON.parse(request.cookies[confParams.cookieIntranet]);
            const conn = await oracledb.getConnection(dbParams);
            const query = "call pack_digitalizacion.sp_datos_usuario(:p_dni, :o_apepat, :o_apemat, :o_nombres, :o_fechanac, :o_sexo, :o_telefono, :o_email, :o_area, :o_cargo)";
            const params = {
                p_dni: { val: sesion.codigo },
                o_apepat: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                o_apemat: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                o_nombres: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                o_fechanac: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                o_sexo: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                o_telefono: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                o_email: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                o_area: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                o_cargo: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            };
            const result = await conn.execute(query, params, responseParams);
            const { o_apepat, o_apemat, o_nombres, o_fechanac, o_sexo, o_telefono, o_email, o_area, o_cargo } = result.outBinds;
            response.json({
                data: {
                    apepat: o_apepat,
                    apemat: o_apemat,
                    nombres: o_nombres,
                    fechanac: o_fechanac,
                    sexo: o_sexo,
                    telefono: o_telefono,
                    email: o_email,
                    area: o_area,
                    cargo: o_cargo
                }
            });
        }
    },
    ListaEmpresas: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            try {
                const conn = await oracledb.getConnection(dbParams);
                const query = "select * from table(pack_digitalizacion.f_lista_empresas)";
                const params = {};
                const result = await conn.execute(query, params, responseParams);
                response.json({
                    data: {
                        empresas: result.rows
                    }
                });
            }
            catch (err) {
                response.json({
                    error: JSON.stringify(err)
                });
            }
        }
    }
};

module.exports = LifeController;