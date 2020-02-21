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
    Home: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            let sess = request.cookies[confParams.cookieIntranet];
            let data = { sesion: sess };
            response.render(path.resolve('client/views/intranet/home.ejs'), data);
        }
        else response.redirect('/intranet/login');
    }
};

module.exports = LifeController;