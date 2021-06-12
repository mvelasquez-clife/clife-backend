const path = require('path');
const bcrypt = require('bcrypt');
const oracledb = require('oracledb');
const crypto = require('crypto');
const dbParams = require('../../server/database');
const confParams = require('../../server/config/intranet');
const encParams = require('../../server/config/encrypt');
const responseParams = {
    outFormat: oracledb.OBJECT
};
const db = require('./../../server/libs/db-oracle');
const encargadosContratos = [7020557, 46455181, 44273152, 41544424];

const LifeController = {
    Login: (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            response.redirect('/intranet');
            return;
        }
        let data = {};
        if (request.cookies[confParams.cookieError]) {
            let error = request.cookies[confParams.cookieError];
            console.error(error);
            data.error = error;
            response.clearCookie(confParams.cookieError, { httpOnly: true });
        }
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
    RecuperaClave: (request, response) => {
        let data = {};
        response.render('./../client/views/intranet/recupera-clave.ejs', data);
    },
    AuthLogin: async (request, response) => {
        const { codigo, pswd, empresa } = request.body;
        let result;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select node_password \"hash\", st_intranet_activada \"stact\", st_verifica_mail \"stmail\", co_cliente \"codigo\", initcap(de_nombre_comercial) \"ncomercial\", " +
                "initcap(de_razon_social) \"rsocial\", fe_suscripcion \"fsuscripcion\", de_email \"email\", de_telefono \"telefono\", st_admin \"admin\", st_tipo_usuario \"tipo\", " +
                "co_empresa as \"empresa\", st_admin_rrhh \"admrrhh\", st_admin_documentac \"admdoc\" from cl_usuarios where co_cliente = :p_rucdni and co_empresa = :p_empresa";
            let params = {
                p_rucdni: { val: codigo },
                p_empresa: { val: empresa }
            };
            result = await conn.execute(query, params, responseParams);
            result = result.rows[0];
            // busca el puesto...
            query = "select nvl(ps.de_nombre, '(no asignado)') \"puesto\" from sg_usua_m us " +
                "left join ma_puesto_empr_m ps on us.co_puesto_empr = ps.co_puesto_empr and us.co_empresa_usuario = ps.co_empresa " +
                "where us.co_usuario = :p_rucdni and us.co_empresa_usuario = :p_empresa";
            params = {
                p_rucdni: { val: codigo },
                p_empresa: { val: empresa }
            };
            let puesto = await conn.execute(query, params, responseParams);
            puesto = puesto.rows[0];
            conn.close();
            // verificar si la cuenta esta activada y el email fue validado
            if (result.stact == 'S') {
                // compara la clave con el hash
                bcrypt.compare(pswd, result.hash, function (err, res) {
                    if (err) {
                        response.cookie(confParams.cookieError, 'Ocurrió un error. Intente nuevamente', { httpOnly: true });
                        response.redirect('/intranet/login');
                        return;
                    }
                    if (res) {
                        let sesion = result;
                        sesion.puesto = puesto.puesto;
                        delete sesion.hash;
                        delete sesion.stact;
                        delete sesion.stmail;
                        response.cookie(confParams.cookieAdmin, sesion.admrrhh, { httpOnly: true });
                        response.cookie(confParams.cookieIntranet, JSON.stringify(sesion), { httpOnly: true });
                        response.redirect('/intranet');
                        return;
                    }
                    response.cookie(confParams.cookieError, 'La clave ingresada es incorrecta.', { httpOnly: true });
                    response.redirect('/intranet/login');
                });
            }
            else {
                response.send('Tu cuenta no ha sido activada. Puedes activarla haciendo clic <a href="/intranet/activar-cuenta">aquí</a>');
            }
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
            let jsSess = JSON.parse(sess);
            let admrrhh = jsSess.admrrhh;
            let admdocs = jsSess.admdoc;
            let admin = admrrhh + admdocs;
            let data = { sesion: sess, admin: admin };
            response.render(path.resolve('client/views/intranet/home.ejs'), data);
        }
        else response.redirect('/intranet/login');
    },
    Documentos: (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            let sess = request.cookies[confParams.cookieIntranet];
            let jsSess = JSON.parse(sess);
            let admrrhh = jsSess.admrrhh;
            let admdocs = jsSess.admdoc;
            let admin = admrrhh + admdocs;
            let { tipo } = request.params;
            let id, codigo;
            // ubica el código a partir del tipo
            switch (tipo) {
                case 'boletas':
                    id = 'sidenav-boletas';
                    tipo = tipo[0].toUpperCase() + tipo.slice(1);
                    codigo = '801';
                    break;
                case 'cts':
                    id = 'sidenav-cts';
                    tipo = tipo.toUpperCase();
                    codigo = '802';
                    break;
                case 'informacion':
                    id = 'sidenav-informacion';
                    tipo = 'Información laboral para el trabajador';
                    codigo = '803';
                    break;
                case 'utilidades':
                    id = 'sidenav-utilidades';
                    tipo = 'Liquidación de Utilidades';
                    codigo = '804';
                    break;
                case 'contratos':
                    id = 'sidenav-contratos';
                    tipo = 'Contratos';
                    codigo = '69';
                    break;
                default: break;
            }
            let data = { sesion: sess, admin: admin, tipo: tipo, id: id, documento: codigo };
            response.render(path.resolve('client/views/intranet/documentos.ejs'), data);
        }
        else response.redirect('/intranet/login');
    },
    AprobacionContratos: (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            let sess = request.cookies[confParams.cookieIntranet];
            let jsSess = JSON.parse(sess);
            if (encargadosContratos.indexOf(jsSess.codigo) == -1) {
                response.send('No tiene permisos para acceder aquí');
                return;
            }
            let admrrhh = jsSess.admrrhh;
            let admdocs = jsSess.admdoc;
            let admin = admrrhh + admdocs;
            let data = { sesion: sess, admin: admin };
            response.render(path.resolve('client/views/intranet/aprobar-contratos.ejs'), data);
        }
        else response.redirect('/intranet/login');
    },
    RevisionContratos: (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            let sess = request.cookies[confParams.cookieIntranet];
            let jsSess = JSON.parse(sess);
            if (encargadosContratos.indexOf(jsSess.codigo) == -1) {
                response.send('No tiene permisos para acceder aquí');
                return;
            }
            let admrrhh = jsSess.admrrhh;
            let admdocs = jsSess.admdoc;
            let admin = admrrhh + admdocs;
            let data = { sesion: sess, admin: admin };
            response.render(path.resolve('client/views/intranet/revisar-contratos.ejs'), data);
        }
        else response.redirect('/intranet/login');
    },
    DatosPersonales: (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            let sess = request.cookies[confParams.cookieIntranet];
            let jsSess = JSON.parse(sess);
            let admrrhh = jsSess.admrrhh;
            let admdocs = jsSess.admdoc;
            let admin = admrrhh + admdocs;
            let data = { sesion: sess, admin: admin };
            response.render(path.resolve('client/views/intranet/perfil.ejs'), data);
        }
        else response.redirect('/intranet/login');
    },
    Personal: (request, response) => {
        if (request.cookies[confParams.cookieIntranet] && request.cookies[confParams.cookieAdmin] == 'S') {
            let sess = request.cookies[confParams.cookieIntranet];
            let jsSess = JSON.parse(sess);
            let admrrhh = jsSess.admrrhh;
            let admdocs = jsSess.admdoc;
            let admin = admrrhh + admdocs;
            let data = { sesion: sess, admin: admin, id: 'sidenav-personal' };
            response.render(path.resolve('client/views/intranet/personal.ejs'), data);
        }
        else response.redirect('/intranet/login');
    },
    SubirDocumentos: (request, response) => {
        if (request.cookies[confParams.cookieIntranet] && request.cookies[confParams.cookieAdmin] == 'S') {
            let sess = request.cookies[confParams.cookieIntranet];
            let jsSess = JSON.parse(sess);
            let admrrhh = jsSess.admrrhh;
            let admdocs = jsSess.admdoc;
            let admin = admrrhh + admdocs;
            let data = { sesion: sess, admin: admin, id: 'sidenav-subirdocs' };
            response.render(path.resolve('client/views/intranet/subirdocs.ejs'), data);
        }
        else response.redirect('/intranet/login');
    },
    EnvioMensajes: (request, response) => {
        if (request.cookies[confParams.cookieIntranet] && request.cookies[confParams.cookieAdmin] == 'S') {
            let sess = request.cookies[confParams.cookieIntranet];
            let jsSess = JSON.parse(sess);
            let admrrhh = jsSess.admrrhh;
            let admdocs = jsSess.admdoc;
            let admin = admrrhh + admdocs;
            let data = { sesion: sess, admin: admin, id: 'sidenav-mensajes' };
            response.render(path.resolve('client/views/intranet/envio-mensajes.ejs'), data);
        }
        else response.redirect('/intranet/login');
    },
    Eventos: (request, response) => {
        if (request.cookies[confParams.cookieIntranet] && request.cookies[confParams.cookieAdmin] == 'S') {
            let sess = request.cookies[confParams.cookieIntranet];
            let jsSess = JSON.parse(sess);
            let admrrhh = jsSess.admrrhh;
            let admdocs = jsSess.admdoc;
            let admin = admrrhh + admdocs;
            let data = { sesion: sess, admin: admin };
            response.render(path.resolve('client/views/intranet/eventos.ejs'), data);
        }
        else response.redirect('/intranet/login');
    },
    ReporteAcuse: (request, response) => {
        if (request.cookies[confParams.cookieIntranet] && request.cookies[confParams.cookieAdmin] == 'S') {
            let sess = request.cookies[confParams.cookieIntranet];
            let jsSess = JSON.parse(sess);
            let admrrhh = jsSess.admrrhh;
            let admdocs = jsSess.admdoc;
            let admin = admrrhh + admdocs;
            let data = { sesion: sess, admin: admin, id: 'sidenav-reportes' };
            response.render(path.resolve('client/views/intranet/reporte-acuses.ejs'), data);
        }
        else response.redirect('/intranet/login');
    },
    ReporteMarcaciones: (request, response) => {
        if (request.cookies[confParams.cookieIntranet] && request.cookies[confParams.cookieAdmin] == 'S') {
            let sess = request.cookies[confParams.cookieIntranet];
            let jsSess = JSON.parse(sess);
            let admrrhh = jsSess.admrrhh;
            let admdocs = jsSess.admdoc;
            let admin = admrrhh + admdocs;
            let data = { sesion: sess, admin: admin, id: 'sidenav-reportes' };
            response.render(path.resolve('client/views/intranet/reporte-marcaciones.ejs'), data);
        }
        else response.redirect('/intranet/login');
    },
    // peticiones ajax
    CargarDatosUsuario: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            let sesion = JSON.parse(request.cookies[confParams.cookieIntranet]);
            const conn = await oracledb.getConnection(dbParams);
            const query = "call pack_digitalizacion.sp_datos_usuario(:p_dni, :p_empresa, :o_apepat, :o_apemat, :o_nombres, :o_fechanac, :o_sexo, :o_telefono, :o_email, :o_area, :o_cargo)";
            const params = {
                p_dni: { val: sesion.codigo },
                p_empresa: { val: sesion.empresa },
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
            conn.close();
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
                let params = [
                    { name: 'rs', io: 'out', type: 'cursor' }
                ];
                let result = await db.resultSet('call pack_digitalizacion.sp_lista_empresas (:rs)', params);
                response.json({
                    data: {
                        empresas: result.rs
                    }
                });
            }
            catch (err) {
                response.json({
                    error: JSON.stringify(err)
                });
            }
        }
        else {
            response.json({
                error: 'No cuenta con permisos para acceder a esta opcion'
            });
        }
    },
    ListaPersonal: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const { empresa } = request.body;
            const conn = await oracledb.getConnection(dbParams);
            const query = "select * from table(pack_digitalizacion.f_personal_empresa(:p_empresa))";
            const params = {
                p_empresa: { val: empresa }
            };
            const result = await conn.execute(query, params, responseParams);
            const personal = result.rows;
            conn.close();
            response.json({
                data: {
                    personal: personal
                }
            });
        }
        else {
            response.json({
                error: 'No cuenta con permisos para acceder a esta opcion'
            });
        }
    },
    UploadPersonal: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const mv = require('mv');
            const formidable = require('formidable');
            const fupload = require('../../server/fupload');
            const xlsx = require('xlsx');
            //
            const sesion = JSON.parse(request.cookies[confParams.cookieIntranet]);
            var form = new formidable.IncomingForm();
            form.parse(request, async function (err, fields, files) {
                if (err) {
                    response.json({
                        error: err
                    });
                    return;
                }
                var oldpath = files.plantilla.path;
                var newpath = fupload.tmppath + files.plantilla.name;
                mv(oldpath, newpath, async function (err) {
                    // if (err) throw err;
                    if (err) {
                        response.json({
                            error: err
                        });
                    }
                    // leer el xlsx
                    var workbook = xlsx.readFile(newpath);
                    var sheet_name_list = workbook.SheetNames;
                    var xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], { raw: false });
                    // ahora verificar stocks e insertar
                    try {
                        const conn = await oracledb.getConnection(dbParams);
                        let mensajes = [];
                        for (let row of xlData) {
                            let arrFila = [];
                            for (let i in row) arrFila.push(row[i]);
                            //arregla la mugre fecha alv
                            let vFecha = arrFila[4].split('/');
                            let iAnio = parseInt(vFecha[2]);
                            let sFecha = vFecha[1].padStart(2, '0') + '/' + vFecha[0].padStart(2, '0') + '/' + (iAnio < 30 ? '20' : '19') + vFecha[2];
                            let params = {
                                p_dni: arrFila[0],
                                p_empresa: fields.empresa,
                                p_usu_reg: sesion.codigo,
                                p_apepat: arrFila[1],
                                p_apemat: arrFila[2],
                                p_nombres: arrFila[3],
                                p_fechanac: sFecha,
                                p_sexo: arrFila[5],
                                p_telefono: arrFila[6],
                                p_email: arrFila[7],
                                p_area: arrFila[8],
                                p_cargo: arrFila[9],
                                o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                                o_mensaje: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
                            };
                            // ejecutar el sp
                            let query = "call pack_digitalizacion.sp_registra_personal (:p_dni, :p_empresa, :p_usu_reg, :p_apepat, :p_apemat, :p_nombres, :p_fechanac, :p_sexo," +
                                ":p_telefono, :p_email, :p_area, :p_cargo, :o_codigo, :o_mensaje)";
                            let result = await conn.execute(query, params, responseParams);
                            const { o_codigo, o_mensaje } = result.outBinds;
                            mensajes.push({
                                codigo: o_codigo,
                                descripcion: o_mensaje
                            });
                        }
                        conn.close();
                        response.json({
                            mensajes: mensajes
                        });
                    }
                    catch (err) {
                        console.error(err);
                        response.json({
                            error: err
                        });
                    }
                });
            });
        }
        else {
            response.json({
                error: 'No cuenta con permisos para acceder a esta opcion'
            });
        }
    },
    ListaTiposDoc: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            try {
                /*const conn = await oracledb.getConnection(dbParams);
                const query = "select * from table(pack_digitalizacion.f_lista_tipos_doc)";
                const params = {};
                const result = await conn.execute(query, params, responseParams);
                response.json({
                    data: {
                        tiposdoc: result.rows
                    }
                });*/
                let params = [
                    { name: 'rs', io: 'out', type: 'cursor' }
                ];
                let result = await db.resultSet('call pack_digitalizacion.sp_lista_tipos_doc (:rs)', params);
                response.json({
                    data: {
                        tiposdoc: result.rs
                    }
                });
            }
            catch (err) {
                response.json({
                    error: JSON.stringify(err)
                });
            }
        }
        else {
            response.json({
                error: 'No cuenta con permisos para acceder a esta opcion'
            });
        }
    },
    RegistraCabeceraEnvio: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const { empresa, tipodoc, descripcion, finicio, ffin } = request.body;
            const sesion = JSON.parse(request.cookies[confParams.cookieIntranet]);
            try {
                const conn = await oracledb.getConnection(dbParams);
                const query = "call pack_digitalizacion.sp_registra_cabecera_envio (:p_empresa, :p_nombre, :p_tipodoc, :p_usureg, :p_empreg, :p_inicio, :p_fin, :o_codigo, :o_mensaje)";
                const params = {
                    p_empresa: empresa,
                    p_nombre: descripcion,
                    p_tipodoc: tipodoc,
                    p_usureg: sesion.codigo,
                    p_empreg: sesion.empresa,
                    p_inicio: finicio,
                    p_fin: ffin,
                    o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                    o_mensaje: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
                };
                const result = await conn.execute(query, params, responseParams);
                const { o_codigo, o_mensaje } = result.outBinds;
                conn.close();
                if (o_codigo == 0) {
                    response.json({
                        error: o_mensaje
                    });
                }
                else {
                    response.json({
                        data: {
                            codigo: o_codigo,
                            nombre: descripcion
                        }
                    });
                }
            }
            catch (err) {
                response.json({
                    error: JSON.stringify(err)
                });
            }
        }
        else {
            response.json({
                error: 'No cuenta con permisos para acceder a esta opcion'
            });
        }
    },
    ListaEnvios: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const { empresa, tipodoc } = request.body;
            try {
                const conn = await oracledb.getConnection(dbParams);
                const query = "select codigo \"codigo\", descripcion \"descripcion\", to_char(fecha, 'dd/mm/yyyy') \"fecha\", periodo \"periodo\", usuregistra \"usuregistra\", vigencia \"vigencia\" from table(pack_digitalizacion.f_lista_envios(:p_empresa, :p_tipodoc))";
                const params = {
                    p_empresa: empresa,
                    p_tipodoc: tipodoc
                };
                const result = await conn.execute(query, params, responseParams);
                conn.close();
                response.json({
                    data: {
                        envios: result.rows
                    }
                });
            }
            catch (err) {
                response.json({
                    error: JSON.stringify(err)
                });
            }
        }
        else {
            response.json({
                error: 'No cuenta con permisos para acceder a esta opcion'
            });
        }
    },
    DatosCliente: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            let { cliente, idx, envio, empresa } = request.body;
            if (cliente.indexOf('.') > -1) {
                try {
                    const scliente = cliente;
                    cliente = (cliente.split('.')[0]).split('_')[0];
                    const conn = await oracledb.getConnection(dbParams);
                    const query = "call pack_digitalizacion.sp_datos_cliente(:p_rucdni, :p_envio, :p_empresa, :o_codigo, :o_mensaje)";
                    const params = {
                        p_rucdni: cliente,
                        p_envio: envio,
                        p_empresa: empresa,
                        o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                        o_mensaje: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
                    };
                    const result = await conn.execute(query, params, responseParams);
                    const { o_codigo, o_mensaje } = result.outBinds;
                    conn.close();
                    if (o_codigo == 0) {
                        response.json({
                            error: o_mensaje,
                            data: { pos: idx }
                        });
                    }
                    else {
                        response.json({
                            data: {
                                pos: idx,
                                nombre: o_mensaje,
                                fname: scliente
                            }
                        });
                    }
                }
                catch (err) {
                    response.json({
                        error: JSON.stringify(err),
                        data: { pos: idx }
                    });
                }
            }
            else {
                response.json({
                    error: cliente + ': Nombre de archivo inválido',
                    data: { pos: idx }
                });
            }
        }
        else {
            response.json({
                error: 'No cuenta con permisos para acceder a esta opcion'
            });
        }
    },
    CargarPdf: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const mv = require('mv');
            const formidable = require('formidable');
            const fupload = require('../../server/fupload');
            const java = require('../../server/config/java');
            //
            const sesion = JSON.parse(request.cookies[confParams.cookieIntranet]);
            var form = new formidable.IncomingForm();
            form.parse(request, async function (err, fields, files) {
                if (err) {
                    response.json({
                        error: err
                    });
                    return;
                }
                const codusr = fields.codigo.split('_')[0];
                const sFilename = 'DIGI_' + fields.cenvio + '_' + codusr + '.pdf';
                const stipodoc = fields.tipodoc;
                var oldpath = files.pdf.path;
                var newpath = fupload.tmppath + 'unsigned_' + sFilename;
                mv(oldpath, newpath, async function (err) {
                    if (err) {
                        console.log('mv', err);
                        response.json({
                            error: err
                        });
                        return;
                    }
                    // firma el mugre pdf
                    const newpathsigned = fupload.tmppath + sFilename;
                    var exec = require('child_process').exec, child;
                    let command;
                    if (stipodoc == '801') {
                        command = 'java -jar ' + java.stamperNuevo + ' "' + newpath + '" "' + newpathsigned + '" BP';
                    }
                    else {
                        command = 'java -jar ' + java.stamper + ' "' + newpath + '" "' + newpathsigned + '"';
                    }
                    // stipodoc
                    child = exec(command, async function (error, stdout, stderr) {
                        if(stdout.indexOf('OK') == -1){
                            let serror = (error || stderr);
                            console.log('exec error: ' + serror);
                            response.json({
                                error: serror
                            });
                            return;
                        }
                        // genera la ruta del archivo alv
                        let folders = [fields.empresa, 'PERSONAL', codusr];
                        const sPath = 'X:' + fupload.winseparator + folders.join(fupload.winseparator) + fupload.winseparator + sFilename;
                        let remotePath = '/common/document' + fupload.linuxseparator + folders.join(fupload.linuxseparator);
                        // aqui subir con ftp-manager
                        const ftpmanager = require('../../server/libs/sftp-manager');
                        let result = await ftpmanager.upload(newpathsigned, remotePath + fupload.linuxseparator + sFilename);
                        if (result.error) {
                            response.json({
                                error: result.error
                            });
                            return;
                        } // fin ftp-manager
                        // guardar en la bd
                        try {
                            const conn = await oracledb.getConnection(dbParams);
                            // registra en el legajo de clientes
                            /*
                            let query = "call pack_new_attached.sp_save_adjunto_2(:o_codigo, :o_resultado, :p_empresa, :p_usuario, :p_tipo_enti, :p_cataenti, :p_archivo, " +
                                ":p_tipoarchivo, :p_ruta, :p_fichero, :p_extension, :p_descripcion, :p_tpdocu, :p_tipocarpeta, :p_nuitems)";
                            */
                            let tp_archivo = 9;
                            let query = "call pack_new_attached.sp_save_adjunto_2_new(:o_codigo, :o_resultado, :p_empresa, :p_usuario, :p_cataenti, :p_archivo, " +
                                ":p_tipoarchivo, :p_ruta, :p_fichero, :p_extension, :p_descripcion, :p_tpdocu)";
                            let params = {
                                o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                                o_resultado: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                                p_empresa: { val: fields.empresa },
                                p_usuario: { val: sesion.codigo },
                                p_cataenti: { val: codusr },
                                p_archivo: { val: codusr },
                                p_tipoarchivo: { val: tp_archivo },
                                p_ruta: { val: sPath },
                                p_fichero: { val: sFilename },
                                p_extension: { val: 'pdf' },
                                p_descripcion: { val: fields.envio },
                                p_tpdocu: { val: 639 }
                            };
                            let result = await conn.execute(query, params, responseParams);
                            let { o_codigo, o_resultado } = result.outBinds;
                            if (o_codigo == 0) {
                                conn.close();
                                response.json({
                                    error: o_resultado
                                });
                                return;
                            }
                            // registra el envío del documento
                            query = "call pack_digitalizacion.sp_carga_documento (:p_envio,:p_empresa,:p_personal,:p_item,:p_coarchivo,:p_tparchivo,:p_usuenvia,:p_emprenvia,:o_codigo,:o_resultado)";
                            params = {
                                p_envio: { val: fields.cenvio },
                                p_empresa: { val: fields.empresa },
                                p_personal: { val: codusr },
                                p_item: { val: o_codigo },
                                p_coarchivo: { val: codusr },
                                p_tparchivo: { val: tp_archivo },
                                p_usuenvia: { val: sesion.codigo },
                                p_emprenvia: { val: sesion.empresa },
                                o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                                o_resultado: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
                            };
                            result = await conn.execute(query, params, responseParams);
                            let resDb = result.outBinds;
                            // fin
                            conn.close();
                            // validar
                            if (resDb.o_codigo == 0) {
                                response.json({
                                    error: resDb.o_resultado
                                });
                                return;
                            }
                            // listijirillo
                            response.json({
                                codigo: codusr
                            });
                        }
                        catch (err) {
                            console.error(err);
                            response.json({
                                error: err
                            });
                        }
                    });
                }); // fin exec java
            });
        }
        else {
            response.json({
                error: 'No cuenta con permisos para acceder a esta opcion'
            });
        }
    },
    DescargaPdf: async (request, response) => {
        const { hash } = request.params;
        const decipher = crypto.createDecipher(encParams.algorytm, encParams.password);
        var decrypted = decipher.update(hash, encParams.param, encParams.charset);
        decrypted += decipher.final('utf8');
        const decParams = decrypted.split(encParams.separator);
        const envio = decParams[0];
        const empresa = decParams[1];
        const personal = decParams[2];
        const tipodoc = decParams[3];
        try {
            const conn = await oracledb.getConnection(dbParams);
            // verifica el acuse del documento
            let query = "call pack_digitalizacion.sp_info_fichero (:p_envio, :p_empresa, :p_usuario, :o_codigo, :o_mensaje, :o_ruta, :o_nombre, :o_fecha, :o_numero, :o_leido)";
            let params = {
                p_envio: { val: envio },
                p_empresa: { val: empresa },
                p_usuario: { val: personal },
                o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_mensaje: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                o_ruta: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                o_nombre: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                o_fecha: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                o_numero: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_leido: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            };
            let result = await conn.execute(query, params, responseParams);
            let { o_codigo, o_mensaje, o_ruta, o_nombre, o_fecha, o_numero, o_leido } = result.outBinds;
            if (o_codigo == 0) {
                response.json({
                    error: o_mensaje
                });
                return;
            }
            // verifica si el archivo fue leído o no
            if (o_leido == 'N') {
                const infoEquipo = 'IP: ' + request.ip + ' | Browser: ' + request.headers['user-agent'];
                query = "call pack_digitalizacion.sp_marca_doc_leido (:o_codigo, :o_resultado, :p_envio, :p_empresa, :p_usuario, :p_numero, :p_detalle)";
                params = {
                    o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                    o_resultado: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                    p_envio: { val: envio },
                    p_empresa: { val: empresa },
                    p_usuario: { val: personal },
                    p_numero: { val: o_numero },
                    p_detalle: { val: infoEquipo }
                };
                await conn.execute(query, params, responseParams);
                conn.close();
            }
            // descarga el pdf
            const ftpmanager = require('../../server/libs/sftp-manager');
            let ftpResult = await ftpmanager.download(o_ruta);
            if (ftpResult.error) {
                response.send(ftpResult.error);
                return;
            }
            let pdfPath = ftpResult.path;
            let vFilename = o_nombre.split('.');
            let nFilename = vFilename.length;
            let extension = vFilename[nFilename - 1].toLowerCase();
            const fs = require('fs');
            var stream = fs.ReadStream(pdfPath);
            switch (extension) {
                case 'pdf':
                    response.setHeader('Content-type', 'application/pdf');
                    break;
                case 'jpg':
                case 'jpeg':
                    response.setHeader('Content-type', 'image/jpeg');
                    break;
                default:
                    response.setHeader('Content-type', 'text/plain');
                    break;
            }
            stream.pipe(response);
        }
        catch (err) {
            console.error(err);
            response.send(JSON.stringify(err));
        }
    },
    DescargaPdfIperc: async (request, response) => {
        const { hash } = request.params;
        const decipher = crypto.createDecipher(encParams.algorytm, encParams.password);
        var decrypted = decipher.update(hash, encParams.param, encParams.charset);
        decrypted += decipher.final('utf8');
        const decParams = decrypted.split(encParams.separator);
        const area = decParams[0];
        try {
            // descarga el pdf
            let pdfPath = '/public/intranet/iperc/SST-IPER-' + area + '.pdf';
            const fs = require('fs');
            if (fs.existsSync(pdfPath)) {
                var stream = fs.ReadStream(pdfPath);
                response.setHeader('Content-type', 'application/pdf');
                stream.pipe(response);
            }
            else response.send('no se encontró el archivo ' + pdfPath);
        }
        catch (err) {
            console.error(err);
            response.json(err);
        }
    },
    NuevaPapeleta: (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            let sess = request.cookies[confParams.cookieIntranet];
            let jsSess = JSON.parse(sess);
            let admrrhh = jsSess.admrrhh;
            let admdocs = jsSess.admdoc;
            let admin = admrrhh + admdocs;
            let data = { sesion: sess, admin: admin };
            response.render(path.resolve('client/views/intranet/nueva-papeleta.ejs'), data);
        }
        else response.redirect('/intranet/login');
    },
    ListaPapeletas: (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            let sess = request.cookies[confParams.cookieIntranet];
            let jsSess = JSON.parse(sess);
            let admrrhh = jsSess.admrrhh;
            let admdocs = jsSess.admdoc;
            let admin = admrrhh + admdocs;
            let data = { sesion: sess, admin: admin };
            response.render(path.resolve('client/views/intranet/lista-papeletas.ejs'), data);
        }
        else response.redirect('/intranet/login');
    },
    InfoEquipo: (request, response) => {
        console.log('otra ip', request.ip);
        console.log(request.headers['user-agent']);
        response.send('ola ke ase');
    },
    TiposDocumento: (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            let sess = request.cookies[confParams.cookieIntranet];
            let jsSess = JSON.parse(sess);
            let admrrhh = jsSess.admrrhh;
            let admdocs = jsSess.admdoc;
            let admin = admrrhh + admdocs;
            let data = { sesion: sess, admin: admin };
            response.render(path.resolve('client/views/intranet/documentacion-tiposdocumento.ejs'), data);
        }
        else response.redirect('/intranet/login');
    },
    ListaMaestra: (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            let sess = request.cookies[confParams.cookieIntranet];
            let jsSess = JSON.parse(sess);
            let admrrhh = jsSess.admrrhh;
            let admdocs = jsSess.admdoc;
            let admin = admrrhh + admdocs;
            let data = { sesion: sess, admin: admin };
            response.render(path.resolve('client/views/intranet/documentacion-listamaestra.ejs'), data);
        }
        else response.redirect('/intranet/login');
    },
    AcuseDocumento: (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            let sess = request.cookies[confParams.cookieIntranet];
            let jsSess = JSON.parse(sess);
            let admrrhh = jsSess.admrrhh;
            let admdocs = jsSess.admdoc;
            let admin = admrrhh + admdocs;
            let data = { sesion: sess, admin: admin };
            response.render(path.resolve('client/views/intranet/documentacion-acuse.ejs'), data);
        }
        else response.redirect('/intranet/login');
    },
    AdministracionPermisos: (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            let sess = request.cookies[confParams.cookieIntranet];
            let jsSess = JSON.parse(sess);
            let admrrhh = jsSess.admrrhh;
            let admdocs = jsSess.admdoc;
            let admin = admrrhh + admdocs;
            let data = { sesion: sess, admin: admin };
            response.render(path.resolve('client/views/intranet/documentacion-admin.ejs'), data);
        }
        else response.redirect('/intranet/login');
    },
    AprobacionDocumentos: (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            let sess = request.cookies[confParams.cookieIntranet];
            let jsSess = JSON.parse(sess);
            let admrrhh = jsSess.admrrhh;
            let admdocs = jsSess.admdoc;
            let admin = admrrhh + admdocs;
            let data = { sesion: sess, admin: admin };
            response.render(path.resolve('client/views/intranet/documentacion-apruebadocs.ejs'), data);
        }
        else response.redirect('/intranet/login');
    },
    GuardarMensaje: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const { empresa, titulo, texto, tpenvio, destinatarios } = request.body;
            const sesion = JSON.parse(request.cookies[confParams.cookieIntranet]);
            try {
                const conn = await oracledb.getConnection(dbParams);
                // registra en el legajo de clientes
                let query = "call pack_digitalizacion.sp_crear_mensaje (:o_codigo, :o_mensaje, :p_empresa, :p_titulo, :p_texto, :p_tpenvio, :p_destinatarios, :p_usu_envia)";
                let params = {
                    o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                    o_mensaje: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                    p_empresa: { val: empresa },
                    p_titulo: { val: titulo },
                    p_texto: { val: texto },
                    p_tpenvio: { val: tpenvio },
                    p_destinatarios: { val: destinatarios },
                    p_usu_envia: { val: sesion.codigo }
                };
                let result = await conn.execute(query, params, responseParams);
                let { o_codigo, o_mensaje } = result.outBinds;
                conn.close();
                if (o_codigo == 0) {
                    response.json({
                        error: o_mensaje
                    });
                    return;
                }
                response.json({
                    state: 'OK'
                });
            }
            catch (err) {
                console.error(err);
                response.json({
                    error: err
                });
            }
        }
        else {
            response.json({
                error: 'No cuenta con permisos para acceder a esta opcion'
            });
        }
    },
    ListaMensajes: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const sesion = JSON.parse(request.cookies[confParams.cookieIntranet]);
            try {
                const conn = await oracledb.getConnection(dbParams);
                let query = "select * from table (pack_digitalizacion.f_lista_mensajes(:p_empresa, :p_usuario))";
                let params = {
                    p_empresa: { val: sesion.empresa },
                    p_usuario: { val: sesion.codigo }
                };
                const result = await conn.execute(query, params, responseParams);
                let mensajes = result.rows;
                conn.close();
                response.json({
                    data: {
                        mensajes: mensajes
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
        else {
            response.json({
                error: 'No cuenta con permisos para acceder a esta opcion'
            });
        }
    },
    ListaDocumentos: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const sesion = JSON.parse(request.cookies[confParams.cookieIntranet]);
            const { codigo } = request.body;
            try {
                const conn = await oracledb.getConnection(dbParams);
                let query = "select * from table (pack_digitalizacion.f_lista_documentos(:p_empresa, :p_codigo, :p_tipodoc))";
                let params = {
                    p_empresa: { val: sesion.empresa },
                    p_codigo: { val: sesion.codigo },
                    p_tipodoc: { val: codigo }
                };
                let result = await conn.execute(query, params, responseParams);
                const documentos = result.rows;
                conn.close();
                // verifica si debo agregar los nuevos documentos
                let odocumentos = [];
                // comprueba el codigo del usuario y muestra los contratos por aprobar
                let extra = null;
                if (codigo == 69 && encargadosContratos.indexOf(sesion.codigo) > -1) {
                    query = "select count(1) \"contratos\" from dg_documento_det det join dg_documento_cab cab on det.co_digital_documento = cab.co_digital_documento and det.co_empresa = cab.co_empresa where det.st_aprobado = 'N' and cab.co_tipo_doc_administr = 69";
                    params = [];
                    result = await db.select(query, params);
                    let contratos = result.rows[0].contratos;
                    if (contratos > 0) {
                        extra = contratos;
                    }
                }
                //
                const numDocumentos = documentos.length;
                for (let i = 0; i < numDocumentos; i++) {
                    let cipher = crypto.createCipher(encParams.algorytm, encParams.password);
                    let iDocumento = documentos[i];
                    let string = [iDocumento.CODIGO, iDocumento.EMPRESA, sesion.codigo, codigo].join(encParams.separator);
                    var encrypted = cipher.update(string, encParams.charset, encParams.param);
                    encrypted += cipher.final(encParams.param);
                    documentos[i].url = encrypted;
                }
                response.json({
                    data: {
                        documentos: documentos,
                        otros: odocumentos,
                        extra: extra
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
        else {
            response.json({
                error: 'No cuenta con permisos para acceder a esta opcion'
            });
        }
    },
    ResponsableCcosto: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const sesion = JSON.parse(request.cookies[confParams.cookieIntranet]);
            try {
                const conn = await oracledb.getConnection(dbParams);
                let query = "call pack_digitalizacion.sp_responsable_ccosto(:o_codigo, :o_resultado, :o_nombre, :p_usuario, :p_empresa)";
                let params = {
                    o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                    o_resultado: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                    o_nombre: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                    p_usuario: { val: sesion.codigo },
                    p_empresa: { val: sesion.empresa }
                };
                let result = await conn.execute(query, params, responseParams);
                let { o_codigo, o_resultado, o_nombre } = result.outBinds;
                conn.close();
                if (o_codigo == 1) {
                    response.json({
                        data: {
                            responsable: o_nombre
                        }
                    });
                }
                else {
                    response.json({
                        error: o_resultado
                    });
                }
            }
            catch (err) {
                console.error(err);
                response.json({
                    error: err
                });
            }
        }
        else {
            response.json({
                error: 'No cuenta con permisos para acceder a esta opcion'
            });
        }
    },
    GeneraPapeleta: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const sesion = JSON.parse(request.cookies[confParams.cookieIntranet]);
            const { desde, hasta, motivo, goce } = request.body;
            try {
                const conn = await oracledb.getConnection(dbParams);
                let query = "call pack_digitalizacion.sp_registra_papeleta(:o_codigo, :o_resultado, :p_usuario, :p_empresa, :p_desde, :p_hasta, :p_motivo, :p_goce)";
                let params = {
                    o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                    o_resultado: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                    p_usuario: { val: sesion.codigo },
                    p_empresa: { val: sesion.empresa },
                    p_desde: { val: desde },
                    p_hasta: { val: hasta },
                    p_motivo: { val: motivo },
                    p_goce: { val: goce }
                };
                let result = await conn.execute(query, params, responseParams);
                let { o_codigo, o_resultado } = result.outBinds;
                // busca datos del jefe
                query = "call pack_digitalizacion.sp_datos_jefe(:p_dni, :p_empresa, :o_nombre, :o_email)";
                params = {
                    p_dni: { val: sesion.codigo },
                    p_empresa: { val: sesion.empresa },
                    o_nombre: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                    o_email: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
                };
                result = await conn.execute(query, params, responseParams);
                let { o_nombre, o_email } = result.outBinds;
                conn.close();
                // notifica con un email
                // const nodemailer = require('nodemailer');
                const ejs = require('ejs');
                const smtp = require('../../server/config/smtp');
                // const transport = nodemailer.createTransport(smtp);
                const data = {
                    nombre: o_nombre,
                    solicita: sesion.rsocial,
                    asunto: motivo,
                    fecha: 'Desde ' + desde + (hasta ? (' - Hasta ' + hasta) : ''),
                    observaciones: goce == 'S' ? 'Permiso con goce de haber' : 'Permiso sujeto a descuento'
                };
                const html = await ejs.renderFile(path.resolve('client/views/intranet/mail_solpermiso.ejs'), data);
                const message = {
                    from: 'bi_sistemas@corporacionlife.com.pe',
                    to: o_email,
                    subject: 'Solicitud de permiso',
                    html: html
                };
                /*
                transport.sendMail(message, function(err, info) {
                    if (err) {
                        console.log(err)
                        response.send('no se pudo enviar el mail');
                        return;
                    }
                    response.send('Se envió el correo!');
                });
                */
                // respuesta del servidor
                if (o_codigo == 1) {
                    response.json({
                        result: 'ok'
                    });
                }
                else {
                    response.json({
                        error: o_resultado
                    });
                }
            }
            catch (err) {
                console.error(err);
                response.json({
                    error: err
                });
            }
        }
        else {
            response.json({
                error: 'No cuenta con permisos para acceder a esta opcion'
            });
        }
    },
    CargaPapeletasSolicitadas: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const sesion = JSON.parse(request.cookies[confParams.cookieIntranet]);
            try {
                let params = [
                    { name: 'empresa', io: 'in', value: sesion.empresa },
                    { name: 'codigo', io: 'in', value: sesion.codigo },
                    { name: 'rs', io: 'out', type: 'cursor' }
                ];
                let result = await db.resultSet('call pack_digitalizacion.sp_papeletas_solicitadas (:empresa,:codigo,:rs)', params);
                response.json({
                    data: {
                        papeletas: result.rs
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
        else {
            response.json({
                error: 'No cuenta con permisos para acceder a esta opcion'
            });
        }
    },
    CargaPapeletasAprobar: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const sesion = JSON.parse(request.cookies[confParams.cookieIntranet]);
            try {
                const conn = await oracledb.getConnection(dbParams);
                await conn.execute("alter session set nls_date_format = 'dd/mm/yyyy hh24:mi'", {}, responseParams);
                //
                let query = "select * from table(pack_digitalizacion.f_papeletas_aprobar(:p_empresa, :p_usuario))";
                let params = {
                    p_empresa: { val: sesion.empresa },
                    p_usuario: { val: sesion.codigo }
                };
                let result = await conn.execute(query, params, responseParams);
                let papeletas = result.rows;
                conn.close();
                response.json({
                    data: {
                        papeletas: papeletas
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
        else {
            response.json({
                error: 'No cuenta con permisos para acceder a esta opcion'
            });
        }
    },
    CargaReporteAcuse: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const { empresa, tipodoc, envio, periodo, usuario } = request.body;
            try {
                let params = [
                    { name: 'empresa', io: 'in', value: empresa },
                    { name: 'tipodoc', io: 'in', value: tipodoc },
                    { name: 'envio', io: 'in', value: envio },
                    { name: 'periodo', io: 'in', value: periodo },
                    { name: 'usuario', io: 'in', value: usuario },
                    { name: 'rs', io: 'out', type: 'cursor' }
                ];
                let result = await db.resultSet('call pack_digitalizacion.sp_reporte_acuse (:empresa,:tipodoc,:envio,:periodo,:usuario,:rs)', params);
                response.json({
                    data: {
                        reporte: result.rs
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
        else {
            response.json({
                error: 'No cuenta con permisos para acceder a esta opcion'
            });
        }
    },
    DatosPapeleta: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const sesion = JSON.parse(request.cookies[confParams.cookieIntranet]);
            const { papeleta } = request.body;
            try {
                const conn = await oracledb.getConnection(dbParams);
                let query = "call pack_digitalizacion.sp_datos_papeleta(:o_codigo, :o_resultado, :o_solicitante, :o_motivo, :o_fechahora, :o_goce, :o_respuesta, :o_observaciones, :p_papeleta, :p_usuario, :p_empresa)";
                let params = {
                    o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                    o_resultado: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                    o_solicitante: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                    o_motivo: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                    o_fechahora: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                    o_goce: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                    o_respuesta: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                    o_observaciones: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                    p_papeleta: { val: papeleta },
                    p_usuario: { val: sesion.codigo },
                    p_empresa: { val: sesion.empresa }
                };
                let result = await conn.execute(query, params, responseParams);
                let { o_codigo, o_resultado, o_solicitante, o_motivo, o_fechahora, o_goce, o_respuesta, o_observaciones } = result.outBinds;
                conn.close();
                if (o_codigo == 1) {
                    response.json({
                        data: {
                            papeleta: {
                                codigo: papeleta,
                                solicitante: o_solicitante,
                                motivo: o_motivo,
                                fechahora: o_fechahora,
                                goce: o_goce,
                                respuesta: o_respuesta,
                                observaciones: o_observaciones
                            }
                        }
                    });
                }
                else {
                    response.json({
                        error: o_resultado
                    });
                }
            }
            catch (err) {
                console.error(err);
                response.json({
                    error: err
                });
            }
        }
        else {
            response.json({
                error: 'No cuenta con permisos para acceder a esta opcion'
            });
        }
    },
    ResponderPapeleta: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const sesion = JSON.parse(request.cookies[confParams.cookieIntranet]);
            const { papeleta, respuesta, observaciones } = request.body;
            try {
                const conn = await oracledb.getConnection(dbParams);
                let query = "call pack_digitalizacion.sp_responder_papeleta (:o_codigo, :o_resultado, :p_papeleta, :p_empresa, :p_respuesta, :p_observaciones)";
                let params = {
                    o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                    o_resultado: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                    p_papeleta: { val: papeleta },
                    p_empresa: { val: sesion.empresa },
                    p_respuesta: { val: respuesta },
                    p_observaciones: { val: observaciones }
                };
                let result = await conn.execute(query, params, responseParams);
                let { o_codigo, o_resultado } = result.outBinds;
                // carga los datos de la papeleta
                query = "call pack_digitalizacion.sp_datos_papeleta_rpt (:p_papeleta, :p_empresa, :o_destinatario, :o_motivo, :o_email)";
                params = {
                    p_papeleta: { val: papeleta },
                    p_empresa: { val: sesion.empresa },
                    o_destinatario: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                    o_motivo: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                    o_email: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
                };
                result = await conn.execute(query, params, responseParams);
                let { o_destinatario, o_motivo, o_email } = result.outBinds;
                conn.close();
                // notifica con un email
                const nodemailer = require('nodemailer');
                const ejs = require('ejs');
                const smtp = require('../../server/config/smtp');
                const transport = nodemailer.createTransport(smtp);
                const data = {
                    nombre: o_destinatario,
                    responsable: sesion.rsocial,
                    asunto: o_motivo,
                    respuesta: (respuesta == 'S' ? 'Aprobado' : 'Desaprobado'),
                    observaciones: observaciones
                };
                const html = await ejs.renderFile(path.resolve('client/views/intranet/mail_rptpermiso.ejs'), data);
                const message = {
                    from: 'bi_sistemas@corporacionlife.com.pe',
                    to: o_email,
                    subject: 'Papeleta respondida',
                    html: html
                };
                transport.sendMail(message, function(err, info) {
                    if (err) {
                        console.log(err)
                        response.send('no se pudo enviar el mail');
                        return;
                    }
                    response.send('Se envió el correo!');
                });
                // envia notificacion push
                try {
                    var admin = require("firebase-admin");
                    var serviceAccount = require('../../server/config/fcm.json');
                    admin.initializeApp({
                        credential: admin.credential.cert(serviceAccount),
                        databaseURL: "https://clife-7c89b.firebaseio.com"
                    });
                    let registrationToken = 'eUUgo94aSGI:APA91bGV7i4Em8gn1LPOnhX1ksZDUR-ccc4bE1MvXb0ONnSra3rCRQLKsdSluk-LRhXzjP7MFXhxLDlcYgyk3NB0kE8rYjW_EUMVR0EnmYQ1iHT7Hv6gc8wDYM-zKgOwtMkNa9r70l8t';
                    var payload = {
                        notification: {
                            title: 'Papeleta respondida',
                            body: 'El permiso solicitado a ' + sesion.rsocial + ', con motivo: "' + o_motivo + '" ha sido ' + (respuesta == 'S' ? 'Aprobado' : 'Desaprobado')
                        }
                    };
                    var options = {
                        priority: 'high',
                        timeToLive: 60 * 60 *24
                    };
                    admin.messaging().sendToDevice(registrationToken, payload, options)
                    .then(function(res) {
                        console.log("Successfully sent message:", res);
                        response.send("Successfully sent message:" + res);
                    })
                    .catch(function(error) {
                        console.log("Error sending message:", error);
                        response.send("Error sending message:" + error);
                    });
                }
                catch (err) {
                    console.log('errorcito alv');
                }
                // fin
                if (o_codigo == 1) {
                    response.json({
                        res: 'ok'
                    });
                }
                else {
                    response.json({
                        error: o_resultado
                    });
                }
            }
            catch (err) {
                console.error(err);
                response.json({
                    error: err
                });
            }
        }
        else {
            response.json({
                error: 'No cuenta con permisos para acceder a esta opcion'
            });
        }
    },
    RegistrarEvento: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const sesion = JSON.parse(request.cookies[confParams.cookieIntranet]);
            const { empresa, descripcion, fechahora, lugar } = request.body;
            try {
                const conn = await oracledb.getConnection(dbParams);
                let query = "call pack_digitalizacion.sp_registra_evento(:o_codigo, :o_resultado, :p_empresa, :p_descripcion, :p_fecha, :p_lugar, :p_organiza)";
                let params = {
                    o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                    o_resultado: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                    p_empresa: { val: empresa },
                    p_descripcion: { val: descripcion },
                    p_fecha: { val: fechahora },
                    p_lugar: { val: lugar },
                    p_organiza: { val: sesion.codigo }
                };
                let result = await conn.execute(query, params, responseParams);
                let { o_codigo, o_resultado } = result.outBinds;
                conn.close();
                if (o_codigo > 0) {
                    response.json({
                        res: 'ok'
                    });
                }
                else {
                    response.json({
                        error: o_resultado
                    });
                }
            }
            catch (err) {
                console.error(err);
                response.json({
                    error: err
                });
            }
        }
        else {
            response.json({
                error: 'No cuenta con permisos para acceder a esta opcion'
            });
        }
    },
    ListaEventos: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const { empresa } = request.body;
            try {
                let params = [
                    { name: 'empresa', io: 'in', value: empresa },
                    { name: 'rs', io: 'out', type: 'cursor' }
                ];
                let result = await db.resultSet('call pack_digitalizacion.sp_lista_eventos (:empresa,:rs)', params);
                response.json({
                    data: {
                        eventos: result.rs
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
        else {
            response.json({
                error: 'No cuenta con permisos para acceder a esta opcion'
            });
        }
    },
    ListaPeriodos: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const { empresa } = request.body;
            try {
                /*const conn = await oracledb.getConnection(dbParams);
                const query = "select * from table (pack_digitalizacion.f_lista_periodos(:p_empresa))";
                const params = {
                    p_empresa: { val: empresa }
                };
                const result = await conn.execute(query, params, responseParams);*/
                let params = [
                    { name: 'empresa', io: 'in', value: empresa },
                    { name: 'rs', io: 'out', type: 'cursor' }
                ];
                let result = await db.resultSet('call pack_digitalizacion.sp_lista_periodos (:empresa,:rs)', params);
                response.json({
                    data: {
                        periodos: result.rs
                    }
                });
            }
            catch (err) {
                console.error(err);
                response.json({
                    error: JSON.stringify(err)
                });
            }
        }
        else {
            response.json({
                error: 'No cuenta con permisos para acceder a esta opcion'
            });
        }
    },
    ListaEventosHoy: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const sesion = JSON.parse(request.cookies[confParams.cookieIntranet]);
            try {
                let params = [
                    { name: 'empresa', io: 'in', value: sesion.empresa },
                    { name: 'personal', io: 'in', value: sesion.codigo },
                    { name: 'rs', io: 'out', type: 'cursor' }
                ];
                let result = await db.resultSet('call pack_digitalizacion.sp_lista_eventos_hoy (:empresa,:personal,:rs)', params);
                response.json({
                    data: {
                        eventos: result.rs
                    }
                });
            }
            catch (err) {
                console.error(err);
                response.json({
                    error: JSON.stringify(err)
                });
            }
        }
        else {
            response.json({
                error: 'No cuenta con permisos para acceder a esta opcion'
            });
        }
    },
    AsistentesEvento: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const { evento } = request.body;
            const sesion = JSON.parse(request.cookies[confParams.cookieIntranet]);
            try {
                let params = [
                    { name: 'empresa', io: 'in', value: sesion.empresa },
                    { name: 'evento', io: 'in', value: evento },
                    { name: 'rs', io: 'out', type: 'cursor' }
                ];
                let result = await db.resultSet('call pack_digitalizacion.sp_asistentes_evento (:empresa,:evento,:rs)', params);
                response.json({
                    data: {
                        asistentes: result.rs
                    }
                });
            }
            catch (err) {
                console.error(err);
                response.json({
                    error: JSON.stringify(err)
                });
            }
        }
        else {
            response.json({
                error: 'No cuenta con permisos para acceder a esta opcion'
            });
        }
    },
    PruebaMail: async (request, response) => {
        const nodemailer = require('nodemailer');
        const ejs = require('ejs');
        const smtp = require('../../server/config/smtp');
        const transport = nodemailer.createTransport(smtp);
        const data = {
            nombre: 'MIGUEL ALFONSO VELASQUEZ PORTUGAL',
            url: 'http://192.168.11.163:3000/assets/intranet/archivo.xlsx',
            periodo: 'Febrero 2020',
            envio: 'REMUNERACIONES LIFE 2020'
        };
        const html = await ejs.renderFile(path.resolve('client/views/intranet/mail_documento.ejs'), data);
        const message = {
            from: 'mvelasquez@corporacionlife.com.pe',
            to: 'bi_sistemas@corporacionlife.com.pe',
            subject: 'ola ke ase',
            html: html
        };
        transport.sendMail(message, function(err, info) {
            if (err) {
                console.log(err)
                response.send('no se pudo enviar el mail');
                return;
            }
            response.send('Se envió el correo!');
        });
        /*const data = { nombre: 'Alf!', url: 'http://192.168.11.163:3000/assets/intranet/archivo.xlsx' };
        response.render(path.resolve('client/views/intranet/mail_documento.ejs'), data);*/
    },
    PruebaFcm: (request, response) => {
        var admin = require("firebase-admin");
        var serviceAccount = require('../../server/config/fcm.json');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://clife-7c89b.firebaseio.com"
        });
        let registrationToken = 'eUUgo94aSGI:APA91bGV7i4Em8gn1LPOnhX1ksZDUR-ccc4bE1MvXb0ONnSra3rCRQLKsdSluk-LRhXzjP7MFXhxLDlcYgyk3NB0kE8rYjW_EUMVR0EnmYQ1iHT7Hv6gc8wDYM-zKgOwtMkNa9r70l8t';
        var payload = {
            notification: {
                title: 'ola ke ase',
                body: 'enviando mensajes o ke ase'
            }
        };
        var options = {
            priority: 'high',
            timeToLive: 60 * 60 *24
        };
        admin.messaging().sendToDevice(registrationToken, payload, options)
        .then(function(res) {
            console.log("Successfully sent message:", res);
            response.send("Successfully sent message:" + res);
        })
        .catch(function(error) {
            console.log("Error sending message:", error);
            response.send("Error sending message:" + error);
        });
    },
    CargaQrEvento: async (request, response) => {
        const QRCode = require('qrcode');
        const { evento, empresa, personal } = request.body;
        const string = [evento, empresa, personal].join('|');
        try {
            const base64 = await QRCode.toDataURL(string);
            response.json({
                data: {
                    base64: base64
                }
            });
        }
        catch (err) {
            response.json({
                error: err
            });
        }
    },
    PdfReporteAcuse: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const { empresa, tipodoc, envio, periodo, usuario } = request.params;
            const sesion = JSON.parse(request.cookies[confParams.cookieIntranet]);
            try {
                let params = [
                    { name: 'empresa', io: 'in', value: empresa },
                    { name: 'tipodoc', io: 'in', value: tipodoc },
                    { name: 'envio', io: 'in', value: envio },
                    { name: 'periodo', io: 'in', value: periodo },
                    { name: 'usuario', io: 'in', value: usuario },
                    { name: 'rs', io: 'out', type: 'cursor' }
                ];
                let result = await db.resultSet('call pack_digitalizacion.sp_reporte_acuse (:empresa,:tipodoc,:envio,:periodo,:usuario,:rs)', params);
                const filas = result.rs;
                // escribe el mugre pdf alv
                const pdfWriter = require('html-pdf');
                const ejs = require('ejs');
                const d = new Date();
                const data = {
                    fechahora: ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear() + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2),
                    filas: filas,
                    usuario: sesion.ncomercial
                };
                const html = await ejs.renderFile(path.resolve('client/views/intranet/pdf_acuse.ejs'), data);
                const pdfOptions = {
                    border: {
                        top: '0mm',
                        right: '20mm',
                        bottom: '0mm',
                        left: '5mm'
                    },
                    footer: {
                        height: '5mm',
                        contents: {
                            default: '<span style="color:#444;font-size:6px;">Página <b>{{page}}</b> de <b>{{pages}}</b></span>'
                        }
                    },
                    format: 'A4',
                    header: {
                        height: '10mm',
                        contents: '<span style="font-size:6px;text-align:left;vertical-align:middle;">Acuse de documentos</span>'
                    },
                    orientation: 'portrait',
                    zoomFactor: 0.5
                };
                pdfWriter.create(html, pdfOptions).toStream((err, stream) => {
                    if (err) return response.end(err.stack);
                    response.setHeader('Content-type', 'application/pdf');
                    // response.setHeader('Content-Disposition', 'attachment; filename="reporte.pdf');
                    stream.pipe(response);
                });
            }
            catch (err) {
                console.error(err);
                response.json({
                    error: err
                });
            }
        }
        else response.redirect('/intranet/login');
    },
    XlsxReporteAcuse: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const { empresa, tipodoc, envio, periodo, usuario } = request.params;
            const sesion = JSON.parse(request.cookies[confParams.cookieIntranet]);
            // jala los datos
            try {
                let params = [
                    { name: 'empresa', io: 'in', value: empresa },
                    { name: 'tipodoc', io: 'in', value: tipodoc },
                    { name: 'envio', io: 'in', value: envio },
                    { name: 'periodo', io: 'in', value: periodo },
                    { name: 'usuario', io: 'in', value: usuario },
                    { name: 'rs', io: 'out', type: 'cursor' }
                ];
                let result = await db.resultSet('call pack_digitalizacion.sp_reporte_acuse (:empresa,:tipodoc,:envio,:periodo,:usuario,:rs)', params);
                const filas = result.rs;
                // go!
                var Workbook = require('xlsx-workbook').Workbook;
                var workbook = new Workbook();
                var reporte = workbook.add("acuse");
                // encabezados
                reporte[0] = ['DNI', 'Apellidos y nombres', 'Periodo', 'Documento', 'Estado', 'Detalle lectura'];
                let i = 1;
                // reporte[fila][columna]
                for (let fila of filas) {
                    reporte[i] = [
                        fila.dni,
                        fila.nombre,
                        fila.periodo,
                        fila.documento != null ? (fila.documento + ' - ' + fila.descripcion) : '',
                        fila.estado == 'S' ? 'Leído' : (fila.estado == 'X' ? 'No enviado' : 'Pendiente'),
                        fila.detalle
                    ];
                    i++;
                }
                // automatically appends the '.xlsx' extension
                let fpath = './tmp/' + sesion.codigo + '.xlsx';
                workbook.save(fpath);
                response.setHeader('Content-Disposition', 'attachment; filename=reporte.xlsx');
                response.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                let filestream = require('fs').createReadStream(fpath);
                filestream.pipe(response);
            }
            catch (err) {
                response.send('Ocurrió un error: ' + JSON.stringify(err));
            }
        }
        else response.redirect('/intranet/login');
    },
    XlsxReportePersonal: async (request, response) => {
        try {
            const { empresa } = request.params;
            const sesion = JSON.parse(request.cookies[confParams.cookieIntranet]);
            const conn = await oracledb.getConnection(dbParams);
            const query = "select * from table(pack_digitalizacion.f_personal_empresa(:p_empresa))";
            const params = {
                p_empresa: { val: empresa }
            };
            const result = await conn.execute(query, params, responseParams);
            const personal = result.rows;
            // go!
            var Workbook = require('xlsx-workbook').Workbook;
            var workbook = new Workbook();
            var reporte = workbook.add("personal");
            // encabezados
            reporte[0] = ['DNI', 'Ap. Paterno', 'Ap. Materno', 'Nombres', 'e-mail', 'Teléfono', 'Área', 'Cargo', 'Estado'];
            let i = 1;
            // reporte[fila][columna]
            for (let fila of personal) {
                reporte[i] = [
                    fila.DOCIDEN,
                    fila.APEPAT,
                    fila.APEMAT,
                    fila.NOMBRES,
                    fila.EMAIL,
                    fila.TELEFONO,
                    fila.AREA,
                    fila.CARGO,
                    fila.VIGENCIA
                ];
                i++;
            }
            // automatically appends the '.xlsx' extension
            let fpath = './tmp/' + sesion.codigo + '.xlsx';
            workbook.save(fpath);
            response.setHeader('Content-Disposition', 'attachment; filename=reporte.xlsx');
            response.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            let filestream = require('fs').createReadStream(fpath);
            filestream.pipe(response);
        }
        catch (err) {
            response.send(JSON.stringify(err));
        }
    },
    VerificarDni: async (request, response) => {
        const { dni } = request.body;
        try {
            const conn = await oracledb.getConnection(dbParams);
            let query = "call pack_digitalizacion.sp_validar_dni (:p_dni, :o_codigo, :o_mensaje, :o_nombres, :o_rzsocial, :o_empresa, :o_email, :o_telefono)";
            let params = {
                p_dni: { val: dni },
                o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_mensaje: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                o_nombres: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                o_rzsocial: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                o_empresa: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_email: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                o_telefono: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            };
            const result = await conn.execute(query, params, responseParams);
            let { o_codigo, o_mensaje, o_nombres, o_rzsocial, o_empresa, o_email, o_telefono } = result.outBinds;
            conn.close();
            if (o_codigo == 1) {
                response.json({
                    data: {
                        nombres: o_nombres,
                        rzsocial: o_rzsocial,
                        empresa: o_empresa,
                        email: o_email,
                        telefono: o_telefono
                    }
                });
            }
            else {
                console.log(o_mensaje);
                response.json({
                    error: o_mensaje
                });
            }
        }
        catch (err) {
            console.log(err);
            response.json({
                error: err
            });
        }
    },
    RegistraUsuario: async (request, response) => {
        const { empresa, dni, nombres, rsocial, email, telefono, clave } = request.body;
        bcrypt.hash(clave, 12, async (err, hash) => {
            if (err) {
                response.json({
                    error: JSON.stringify(err)
                });
                return;
            }
            // almacena en la bd
            const conn = await oracledb.getConnection(dbParams);
            let query = "call pack_digitalizacion.sp_registra_usuario (:o_codigo, :o_mensaje, :p_dni, :p_empresa, :p_nombre, :p_rzsocial, :p_email, :p_telefono, :p_clave)";
            let params = {
                o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_mensaje: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                p_dni: { val: dni },
                p_empresa: { val: empresa },
                p_nombre: { val: nombres },
                p_rzsocial: { val: rsocial },
                p_email: { val: email },
                p_telefono: { val: telefono },
                p_clave: { val: hash }
            };
            const result = await conn.execute(query, params, responseParams);
            let { o_codigo, o_mensaje } = result.outBinds;
            conn.close();
            if (o_codigo == 1) {
                response.json({
                    success: true
                });
            }
            else {
                response.json({
                    error: o_mensaje
                });
            }
        });
    },
    PruebaQr: async (request, response) => {
        var QRCode = require('qrcode');
        /*
        QRCode.toDataURL('I am a pony!', function (err, url) {
            console.log(url);
            response.send('<img src="' + url + '" />');
        });*/
        const base64 = await QRCode.toDataURL('ola ke ase');
        response.send('<img src="' + base64 + '" />');
    },
    PruebaFtp: async (request, response) => {
        const ftpManager = require('../../server/libs/sftp-manager');
        /*
        // descarga ok
        const rutaFtp = '/domains/cspcomunicaciones.com/files/1/diarios/2020/02/12/cortes/306.jpg';
        const result = await ftpManager.Descargar(rutaFtp);
        if (result.error) {
            response.send('Error: ' + result.error);
        }
        else {
            response.send('Listo! Archivo guardado en "' + result.path + '"');
        }*/
        // subida
        const rutaLocal = 'D:\\files\\nodejs\\tmp\\unsigned_DIGI_41_46455181.pdf';
        const rutaRemota = '/domains/cspcomunicaciones.com/files/tmp/archivo.pdf';
        const result = await ftpManager.upload(rutaLocal, rutaRemota);
        if (result.error) {
            response.send('Error: ' + result.error);
        }
        else {
            response.send('Archivo subido alv');
        }
    },
    PruebaSms: async (request, response) => {
        let sms = require('./../../server/config/sms');
        var http = require("https");
        var btoa = require("btoa");
        var options = {
            "method": "POST",
            "hostname": 'https://api.labsmobile.com/json/send',
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Basic " + btoa(sms.username + ':' + sms.password),
                "Cache-Control": "no-cache"
            }
        };
        var req = http.request(options, function (res, err) {
            if (err) {
                console.error(err);
            }
            var chunks = [];
            res.on("data", function (chunk) {
                chunks.push(chunk);
            });
            res.on("end", function () {
                var body = Buffer.concat(chunks);
                console.log(body.toString());
            });
        });

        req.write(JSON.stringify({
            message: 'Text of the SMS message',
            tpoa: 'Sender',
            recipient: [
                { msisdn: '+51989845561' },
                { msisdn: '+51932819630' }
            ]
        }));
        req.send();
        response.json({
            gg: 'wp'
        });
    },
    EnviarSms: async (request, response) => {
        let { documentos, empresa, envio } = request.body;
        // let dblib = require('./../../server/libs/db-oracle');
        let query = "call pack_digitalizacion.sp_lista_telefonos (:documentos, :empresa, :telefonos)";
        let params = [
            { name: 'documentos', io: 'in', value: documentos },
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'telefonos', io: 'out', type: 'cursor' }
        ];
        let result = await db.resultSet(query, params);
        if (result.error) {
            response.json({
                error: result.error
            });
            return;
        }
        let telefonos = result.telefonos;
        let command = 'php /var/www/html/sms/sms.php "' + envio + '"';
        // let command = 'php D:\\desarrollo\\www\\sms\\sms.php ' + envio;
        for (let telefono of telefonos) {
            if (telefono != '') {
                command += ' ' + telefono.telefono;
            }
        }
        var exec = require('child_process').exec, child;
        child = exec(command, async function (error, stdout, stderr) {
            response.json({
                result: 'OK'
            });
        });
    },
    //
    CargaDatosDni: async (request, response) => {
        const { dni, telefono } = request.body;
        const conn = await oracledb.getConnection(dbParams);
        let query = "call pack_digitalizacion.sp_datos_dni(:p_dni, :p_empresa, :o_codigo, :o_nombre, :o_email)";
        let params = {
            p_dni: { val: dni },
            p_empresa: { val: 11 },
            o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
            o_nombre: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
            o_email: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
        };
        let result = await conn.execute(query, params, responseParams);
        const { o_codigo, o_nombre, o_email } = result.outBinds;
        if (o_codigo == 1) {
            // genera el pin
            const pin = Math.floor(Math.random() * (1 + 999999 - 100000)) + 100000;
            // registra la solicitud de cambio de clave
            query = 'call pack_digitalizacion.sp_asignar_pin(:p_dni, :p_empresa, :p_pin, :o_solicitud, :o_telefono, :p_telefono)';
            params = {
                p_dni: { val: dni },
                p_empresa: { val: 11 },
                p_pin: { val: pin },
                o_solicitud: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_telefono: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                p_telefono: { val: telefono }
            };
            result = await conn.execute(query, params, responseParams);
console.log(query, params);
            let { o_solicitud, o_telefono } = result.outBinds;
            conn.close();
            if (o_solicitud == 0) {
                response.json({
                    error: o_telefono
                });
                return;
            }
            if (o_solicitud == -1) {
                response.json({
                    error: o_telefono,
                    solicitar: true
                });
                return;
            }
            var encemail = o_email.split('@');
            // enviar pin al correo
            let command2 = 'php /var/www/laravel/reporter/artisan intralife:sendpsw ' + dni + ' 11 ' + pin;
            var exec = require('child_process').exec, child;
            child = exec(command2, async function (error, stdout, stderr) {
                console.log('child exec', stdout);
                /*response.json({
                    result: 'OK'
                });*/
            });
            // enviar el sms
            let command = 'php /var/www/html/sms/pin.php ' + o_telefono + ' ' + pin;
            var exec = require('child_process').exec, child;
            child = exec(command, async function (error, stdout, stderr) {
                console.log('child exec', stdout);
                response.json({
                    data: {
                        nombre: o_nombre,
                        solicitud: o_solicitud,
                        telefono: '******' + o_telefono.substr(6),
                        email: encemail[0].substr(0,6) + '**********@' + encemail[1]
                    }
                });
            });
            // enviar respuesta
            response.json({
                data: {
                    nombre: o_nombre,
                    solicitud: o_solicitud,
                    telefono: '******' + o_telefono.substr(6),
                    email: encemail[0].substr(0,6) + '**********@' + encemail[1]
                }
            });
            return;
        }
        conn.close();
        response.json({
            error: o_nombre
        });
    },
    ValidarPin: async (request, response) => {
        const { pin, solicitud } = request.body;
        const conn = await oracledb.getConnection(dbParams);
        let query = "call pack_digitalizacion.sp_validar_pin(:p_solicitud, :p_pin, :o_codigo, :o_mensaje)";
        let params = {
            p_solicitud: { val: solicitud },
            p_pin: { val: pin },
            o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
            o_mensaje: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
        };
        let result = await conn.execute(query, params, responseParams);
        const { o_codigo, o_mensaje } = result.outBinds;
        conn.close();
        if (o_codigo == -1) {
            response.json({
                error: o_mensaje,
                expira: true
            });
            return;
        }
        if (o_codigo == 0) {
            response.json({
                error: o_mensaje,
                expira: false
            });
            return;
        }
        response.json({
            data: {
                solicitud: o_codigo
            }
        });
    },
    ActualizarClave: async (request, response) => {
        let { dni, clave } = request.body;
        bcrypt.hash(clave, 12, async(err, hash) => {
            if (err) {
                response.json({
                    error: JSON.stringify(err)
                });
                return;
            }
            const conn = await oracledb.getConnection(dbParams);
            let query = "call pack_digitalizacion.sp_actualiza_clave(:p_dni, :p_empresa, :p_clave, :o_codigo, :o_mensaje)";
            let params = {
                p_dni: { val: dni },
                p_empresa: { val: 11 },
                p_clave: { val: hash },
                o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_mensaje: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            };
            let result = await conn.execute(query, params, responseParams);
            const { o_codigo, o_mensaje } = result.outBinds;
            conn.close();
            if (o_codigo == 0) {
                response.json({
                    error: o_mensaje
                });
                return;
            }
            response.json({
                result: 'ok'
            });
        });
    },
    // control documentario
    RegistraNuevoTipo: async (request, response) => {
        let { nombre, abrev, metodo, codigo, empresa } = request.body;
        //  ( in varchar2,  in varchar2,  varchar2,  in number,  in number,  out number,  out varchar2)
        let params = [
            { name: 'p_descripcion', io: 'in', value: nombre },
            { name: 'p_abreviatura', io: 'in', value: abrev },
            { name: 'p_metodo', io: 'in', value: metodo },
            { name: 'p_codigo', io: 'in', value: codigo },
            { name: 'p_empresa', io: 'in', value: empresa },
            { name: 'o_codigo', io: 'out', type: 'number' },
            { name: 'o_mensaje', io: 'out', type: 'string' }
        ];
        let query = 'call pack_digitalizacion.sp_registra_tipodoc (:p_descripcion, :p_abreviatura, :p_metodo, :p_codigo, :p_empresa, :o_codigo, :o_mensaje)';
        let result = await db.statement(query, params);
        if (result.error) {
            response.json({
                error: result.error
            });
            return;
        }
        if (result.out.o_codigo == 0) {
            response.json({
                error: result.out.o_mensaje
            });
            return;
        }
        response.json({
            codigo: result.out.o_codigo
        });
    },
    ListaCtrlTipos: async(request, response) => {
        let params = [
            { name: 'rs', io: 'out', type: 'cursor' }
        ];
        let result = await db.resultSet('call pack_digitalizacion.sp_lista_tipodoc (:rs)', params);
        response.json({
            data: {
                tipos: result.rs
            }
        });
    },
    DatosFormRegistroDocumento: async (request, response) => {
        let { empresa } = request.body;
        let params = [
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'areas', io: 'out', type: 'cursor' },
            { name: 'tipos', io: 'out', type: 'cursor' }
        ];
        let result = await db.resultSet('call pack_digitalizacion.sp_form_registra_documento (:empresa, :areas, :tipos)', params);
        response.json({
            data: {
                areas: result.areas,
                tipos: result.tipos
            }
        });
    },
    CargaCorrelativo: async (request, response) => {
        let { area, tipodoc, empresa } = request.body;
        let params = [
            { name: 'area', io: 'in', value: area },
            { name: 'tipodoc', io: 'in', value: tipodoc },
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'correlativo', io: 'out', type: 'number' }
        ];
        let result = await db.resultSet('call pack_digitalizacion.sp_carga_correlativo (:area, :tipodoc, :empresa, :correlativo)', params);
        response.json({
            data: {
                correlativo: result.correlativo
            }
        });
    },
    GuardaCabeceraDocumento: async (request, response) => {
        const mv = require('mv');
        const formidable = require('formidable');
        const form = new formidable.IncomingForm();
        form.parse(request, async function (err, fields, files) {
            let extension, adjuntar = false;
            if (err) {
                console.log('form.parse', err);
                response.json({
                    error: err
                });
                return;
            }
            // almacena en la bd
            let { tipodoc, area, resguardo, correlativo, version, nombre, fregistro, fvence, fisico, digital, usuario, empresa, adjunto } = fields;
            // recupera la extension del archivo
            if (adjunto == 'S') {
                extension = files.archivo.name.split('.');
                extension = extension[extension.length - 1];
                adjuntar = true;
            }
            else {
                extension = 'none';
            }
            let query = 'call pack_digitalizacion.sp_registra_documento (:tipodoc, :area, :resguardo, :correlativo, :version, :nombre, :fregistro, :fvence, :fisico, :digital, :usuario, :empresa, :extension, :ocodigo, :omensaje)';
            let params = [
                { name: 'tipodoc', io: 'in', value: tipodoc },
                { name: 'area', io: 'in', value: area },
                { name: 'resguardo', io: 'in', value: resguardo },
                { name: 'correlativo', io: 'in', value: correlativo },
                { name: 'version', io: 'in', value: version },
                { name: 'nombre', io: 'in', value: nombre },
                { name: 'fregistro', io: 'in', value: fregistro },
                { name: 'fvence', io: 'in', value: fvence },
                { name: 'fisico', io: 'in', value: fisico },
                { name: 'digital', io: 'in', value: digital },
                { name: 'usuario', io: 'in', value: usuario },
                { name: 'empresa', io: 'in', value: empresa },
                { name: 'extension', io: 'in', value: extension },
                { name: 'ocodigo', io: 'out', type: 'number' },
                { name: 'omensaje', io: 'out', type: 'string' }
            ];
            let result = await db.statement(query, params);
console.log(query, params);
            if (result.error) {
                response.json({
                    error: result.error
                });
                return;
            }
            if (result.out.ocodigo == 0) {
                response.json({
                    error: result.out.omensaje
                });
                return;
            }
            let fname;
            if (adjuntar) {
                fname = result.out.omensaje;
                // mueve el archivo a la carpeta correspondiente
                let oldpath = files.archivo.path;
                let newpath = [confParams.base_dir, empresa, resguardo, area].join(confParams.dir_separator);
                // crea el directorio
                const fs = require('fs');
                if (!fs.existsSync(newpath)) {
                    // crear recursivamente
                    fs.mkdirSync(newpath, { recursive: true });
                }
                // copia el archivo
                let fullfname = newpath + confParams.dir_separator + fname;
                mv(oldpath, fullfname, function (err) {
                    if (err) {
                        console.log('mv', err);
                        response.json({
                            codigo: fname,
                            alert: 'Se registró el documento, pero hubo un problema al guardar el archivo. Por favor, cargue nuevamente el archivo.'
                        });
                        return;
                    }
                    response.json({
                        codigo: fname
                    });
                });
            }
            else {
                response.json({
                    codigo: '-'
                });
            }
        });
    },
    RegistraNuevaVersionDocumento: async (request, response) => {
        const mv = require('mv');
        const formidable = require('formidable');
        const form = new formidable.IncomingForm();
        form.parse(request, async function (err, fields, files) {
            if (err) {
                console.log('form.parse', err);
                response.json({
                    error: err
                });
                return;
            }
            // recupera la extension del archivo
            let extension = files.archivo.name.split('.');
            extension = extension[extension.length - 1];
            // almacena en la bd
            let { key, nversion, fregistro, fvence, fisico, electronico, usuario, empresa } = fields;
            let params = [
                { name: 'key', io: 'in', value: key },
                { name: 'nversion', io: 'in', value: nversion },
                { name: 'fregistro', io: 'in', value: fregistro },
                { name: 'fvence', io: 'in', value: fvence },
                { name: 'fisico', io: 'in', value: fisico },
                { name: 'electronico', io: 'in', value: electronico },
                { name: 'usuario', io: 'in', value: usuario },
                { name: 'extension', io: 'in', value: extension },
                { name: 'codigo', io: 'out', type: 'number' },
                { name: 'resultado', io: 'out', type: 'string' }
            ];
            let result = await db.resultSet('call pack_digitalizacion.sp_registra_nversion_documento(:key, :nversion, :fregistro, :fvence, :fisico, :electronico, :usuario, :extension, :codigo, :resultado)', params);
            if (result.error) {
                response.json({
                    error: result.error
                });
                return;
            }
            let sout = result.resultado.split('|');
            let fname = sout[0];
            let resguardo = sout[1];
            let area = sout[2];
            // mueve el archivo a la carpeta correspondiente
            let oldpath = files.archivo.path;
            let newpath = [confParams.base_dir, empresa, resguardo, area].join(confParams.dir_separator);
            // crea el directorio
            const fs = require('fs');
            if (!fs.existsSync(newpath)) {
                // crear recursivamente
                fs.mkdirSync(newpath, { recursive: true });
            }
            // copia el archivo
            let fullfname = newpath + confParams.dir_separator + fname;
            mv(oldpath, fullfname, function (err) {
                if (err) {
                    console.log('mv', err);
                    response.json({
                        codigo: fname,
                        alert: 'Se registró el documento, pero hubo un problema al guardar el archivo. Por favor, cargue nuevamente el archivo.'
                    });
                    return;
                }
                response.json({
                    data: {
                        codigo: result.codigo,
                        resultado: fname
                    }
                });
            });
        });
    },
    CargaListaDocumentos: async (request, response) => {
        let { resguardo, area, empresa, ordarea } = request.body;
        if (typeof ordarea == 'undefined') ordarea = 0;
        let params = [
            { name: 'resguardo', io: 'in', value: resguardo },
            { name: 'area', io: 'in', value: area },
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'rs', io: 'out', type: 'cursor' },
            { name: 'ordarea', io: 'in', value: ordarea }
        ];
console.log('call pack_digitalizacion.sp_lista_documentos (:resguardo, :area, :empresa, :rs, :ordarea)', params);
        let result = await db.resultSet('call pack_digitalizacion.sp_lista_documentos (:resguardo, :area, :empresa, :rs, :ordarea)', params);
        response.json({
            data: {
                documentos: result.rs
            }
        });
    },
    ValidarNuevaVersionDocumento: async (request, response) => {
        let { codigo, empresa } = request.body;
        let params = [
            { name: 'documento', io: 'in', value: codigo },
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'codigo', io: 'out', type: 'number' },
            { name: 'resultado', io: 'out', type: 'string' }
        ];
        let result = await db.resultSet('call pack_digitalizacion.sp_valida_nversion_documento (:documento, :empresa, :codigo, :resultado)', params);
        if (result.error) {
            response.json({
                error: result.error
            });
            return;
        }
        response.json({
            data: {
                codigo: result.codigo,
                resultado: result.resultado
            }
        });
    },
    CargaHistorialVersiones: async (request, response) => {
        let { codigo, empresa } = request.body;
        let params = [
            { name: 'codigo', io: 'in', value: codigo },
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'nombre', io: 'out', type: 'string' },
            { name: 'rs', io: 'out', type: 'cursor' }
        ];
        let result = await db.resultSet('call pack_digitalizacion.sp_documento_versiones (:codigo, :empresa, :nombre, :rs)', params);
        if (result.error) {
            response.json({
                error: result.error
            });
            return;
        }
        response.json({
            data: {
                nombre: result.nombre,
                versiones: result.rs
            }
        });
    },
    ValidarTraspasoDocumento: async (request, response) => {
        let { codigo, empresa } = request.body;
        let params = [
            { name: 'codigo', io: 'in', value: codigo },
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'ocodigo', io: 'out', type: 'number' },
            { name: 'omensaje', io: 'out', type: 'string' },
            { name: 'rs', io: 'out', type: 'cursor' }
        ];
        let result = await db.resultSet('call pack_digitalizacion.sp_valida_traslado_documento (:codigo, :empresa, :ocodigo, :omensaje, :rs)', params);
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
            data: {
                out: result.omensaje,
                areas: result.rs
            }
        });
    },
    TraspasoDocumento: async (request, response) => {
        let { key, tpdestino, destino, usuario } = request.body;
        let params = [
            { name: 'key', io: 'in', value: key },
            { name: 'tpdestino', io: 'in', value: tpdestino },
            { name: 'destino', io: 'in', value: destino },
            { name: 'usuario', io: 'in', value: usuario },
            { name: 'ocodigo', io: 'out', type: 'number' },
            { name: 'oresultado', io: 'out', type: 'string' }
        ];
        let result = await db.resultSet('call pack_digitalizacion.sp_traslado_documento (:key, :tpdestino, :destino, :usuario, :ocodigo, :oresultado)', params);
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
            success: 'ok'
        });
    },
    ValidarAnulacionDocumento: async (request, response) => {
        let { codigo, empresa } = request.body;
        let params = [
            { name: 'codigo', io: 'in', value: codigo },
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'ocodigo', io: 'out', type: 'number' },
            { name: 'omensaje', io: 'out', type: 'string' }
        ];
        let result = await db.resultSet('call pack_digitalizacion.sp_valida_anulacion_documento (:codigo, :empresa, :ocodigo, :omensaje)', params);
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
            data: {
                out: result.omensaje
            }
        });
    },
    AnularDocumento: async (request, response) => {
        let { key, usuario } = request.body;
        let params = [
            { name: 'key', io: 'in', value: key },
            { name: 'usuario', io: 'in', value: usuario },
            { name: 'ocodigo', io: 'out', type: 'number' },
            { name: 'omensaje', io: 'out', type: 'string' }
        ];
        let result = await db.resultSet('call pack_digitalizacion.sp_anulacion_documento (:key, :usuario, :ocodigo, :omensaje)', params);
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
            result: 'ok'
        });
    },
    ValidarEdicionDocumento: async (request, response) => {
        let { codigo, empresa } = request.body;
        let params = [
            { name: 'codigo', io: 'in', value: codigo },
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'ocodigo', io: 'out', type: 'number' },
            { name: 'omensaje', io: 'out', type: 'string' }
        ];
        let result = await db.resultSet('call pack_digitalizacion.sp_valida_edicion_documento (:codigo, :empresa, :ocodigo, :omensaje)', params);
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
            data: {
                resultado: result.omensaje
            }
        });
    },
    EditarDocumento: async (request, response) => {
        let { key, usuario, nombre, fregistro, fvence, fisico, electronico } = request.body;
// p_key in varchar2, p_usuario in number, p_nombre varchar2, p_fregistro varchar2, p_fvence varchar2, p_fisico varchar2, p_electronico
        let params = [
            { name: 'key', io: 'in', value: key },
            { name: 'usuario', io: 'in', value: usuario },
            { name: 'nombre', io: 'in', value: nombre },
            { name: 'fregistro', io: 'in', value: fregistro },
            { name: 'fvence', io: 'in', value: fvence },
            { name: 'fisico', io: 'in', value: fisico },
            { name: 'electronico', io: 'in', value: electronico },
            { name: 'ocodigo', io: 'out', type: 'number' },
            { name: 'omensaje', io: 'out', type: 'string' }
        ];
        let result = await db.resultSet('call pack_digitalizacion.sp_edicion_documento (:key, :usuario, :nombre, :fregistro, :fvence, :fisico, :electronico, :ocodigo, :omensaje)', params);
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
            data: {
                resultado: result.omensaje
            }
        });
    },
    DescargaDocumento: async (request, response) => {
        const { ref } = request.query;
        const decodedKey = Buffer.from(ref, 'base64').toString('utf-8');
        const params = decodedKey.split('|');
        let codigo = params[0];
        let version = params[1];
        let empresa = params[2];
        let pdata = [
            { name: 'codigo', io: 'in', value: codigo },
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'version', io: 'in', value: version },
            { name: 'ocodigo', io: 'out', type: 'number' },
            { name: 'oresguardo', io: 'out', type: 'string' },
            { name: 'oarea', io: 'out', type: 'number' },
            { name: 'oarhcivo', io: 'out', type: 'string' }
        ];
        let query = 'call pack_digitalizacion.sp_path_documento_version (:codigo, :empresa, :version, :ocodigo, :oresguardo, :oarea, :oarhcivo)';
        let result = await db.resultSet(query, pdata);
        if (result.error) {
            response.json({
                error: result.error
            });
            return;
        }
        if (result.ocodigo == 0) {
            response.json({
                error2: result.omensaje
            });
            return;
        }
        const path = [confParams.base_dir, empresa, result.oresguardo, result.oarea, result.oarhcivo].join(confParams.dir_separator);
console.log('path', path);
        // descargar el archivo
        const fs = require('fs');
        if (fs.existsSync(path)) {
            var stream = fs.ReadStream(path);
            response.setHeader('Content-type', 'application/octet-stream');
            response.setHeader('Content-Disposition', 'attachment; filename="' + result.oarhcivo + '"');
            stream.pipe(response);
        }
        else {
            response.send('No se encontró el archivo o no existe');
        }
    },
    ListaCombos: async (request, response) => {
        let { empresa, area, combo } = request.body;
        let params = [
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'area', io: 'in', value: area },
            { name: 'combo', io: 'in', value: combo },
            { name: 'ocodigo', io: 'out', type: 'number' },
            { name: 'rs', io: 'out', type: 'cursor' }
        ];
        let result = await db.resultSet('call pack_digitalizacion.sp_combo_acuse_docs (:empresa, :area, :combo, :ocodigo, :rs)', params);
        if (result.error) {
            response.json({
                error: result.error
            });
            return;
        }
        if (result.ocodigo == 0) {
            response.json({
                error: 'No hay datos para mostrar'
            });
            return;
        }
        response.json({
            options: result.rs
        });
    },
    AcuseListaDocumentos: async (request, response) => {
        let { empresa, area, documento } = request.body;
        let params = [
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'documento', io: 'in', value: documento },
            { name: 'area', io: 'in', value: area },
            { name: 'ocodigo', io: 'out', type: 'number' },
            { name: 'omensaje', io: 'out', type: 'string' },
            { name: 'rs', io: 'out', type: 'cursor' }
        ];
        let result = await db.resultSet('call pack_digitalizacion.sp_acuse_docs (:empresa, :documento, :area, :ocodigo, :omensaje, :rs)', params);
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
            reporte: result.rs
        });
    },
    DescargaDocumentoAcuse: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const jsSession = JSON.parse(request.cookies[confParams.cookieIntranet]);
            const { ref } = request.query;
            const decodedKey = Buffer.from(ref, 'base64').toString('utf-8');
            const params = decodedKey.split('|');
            let codigo = params[0];
            let version = params[1];
            let empresa = params[2];
            // verifica los permisos y genera el acuse
            let infoEquipo = 'IP: ' + request.ip + ' | Browser: ' + request.headers['user-agent'];
            let pdata = [
                { name: 'empresa', io: 'in', value: empresa },
                { name: 'documento', io: 'in', value: codigo },
                { name: 'version', io: 'in', value: version },
                { name: 'personal', io: 'in', value: jsSession.codigo },
                { name: 'detalle', io: 'in', value: infoEquipo },
                { name: 'ocodigo', io: 'out', type: 'number' },
                { name: 'omensaje', io: 'out', type: 'string' }
            ];
            let query = 'call pack_digitalizacion.sp_check_acuse_doc (:empresa, :documento, :version, :personal, :detalle, :ocodigo, :omensaje)';
            let result = await db.resultSet(query, pdata);
            if (result.error) {
                response.send(result.error);
                return;
            }
            //
            pdata = [
                { name: 'codigo', io: 'in', value: codigo },
                { name: 'empresa', io: 'in', value: empresa },
                { name: 'version', io: 'in', value: version },
                { name: 'ocodigo', io: 'out', type: 'number' },
                { name: 'oresguardo', io: 'out', type: 'string' },
                { name: 'oarea', io: 'out', type: 'number' },
                { name: 'oarhcivo', io: 'out', type: 'string' }
            ];
            query = 'call pack_digitalizacion.sp_path_documento_version (:codigo, :empresa, :version, :ocodigo, :oresguardo, :oarea, :oarhcivo)';
            result = await db.resultSet(query, pdata);
            if (result.error) {
                response.send(result.error);
                return;
            }
            if (result.ocodigo == 0) {
                response.send(result.omensaje);
                return;
            }
            const path = [confParams.base_dir, empresa, result.oresguardo, result.oarea, result.oarhcivo].join(confParams.dir_separator);
            // descargar el archivo
            const fs = require('fs');
            var stream = fs.ReadStream(path);
            response.setHeader('Content-type', 'application/octet-stream');
            response.setHeader('Content-Disposition', 'attachment; filename="' + result.oarhcivo + '"');
            stream.pipe(response);
        }
        else {
            response.send('No tienes permisos para acceder a esta sección');
        }
    },
    CargaHistorialDocumento: async (request, response) => {
        let { key } = request.body;
        let params = [
            { name: 'key', io: 'in', value: key },
            { name: 'oresultado', io: 'out', type: 'number' },
            { name: 'odocumento', io: 'out', type: 'string' },
            { name: 'onombre', io: 'out', type: 'string' },
            { name: 'rs', io: 'out', type: 'cursor' }
        ];
        let query = 'call pack_digitalizacion.sp_historial_documento (:key, :oresultado, :odocumento, :onombre, :rs)';
        let result = await db.resultSet(query, params);
console.log(query, params);
        if (result.error) {
            response.json({
                error: result.error
            });
            return;
        }
        if (result.oresultado == 0) {
            response.json({
                error: result.odocumento
            });
            return;
        }
        response.json({
            data: {
                documento: result.odocumento,
                nombre: result.onombre,
                detalle: result.rs
            }
        });
    },
    // contratos
    CargarPdfUnsigned: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const mv = require('mv');
            const formidable = require('formidable');
            const fupload = require('../../server/fupload');
            //
            const sesion = JSON.parse(request.cookies[confParams.cookieIntranet]);
            var form = new formidable.IncomingForm();
            form.parse(request, async function (err, fields, files) {
                if (err) {
console.log('form.parse', err);
                    response.json({
                        error: err
                    });
                    return;
                }
                const vcodigo = fields.codigo.split('_');
                const numSplit = vcodigo.length;
                const codusr = vcodigo[0];
                const icodusr = parseInt(codusr);
                const esNuevo = vcodigo[numSplit - 1] == 'NUEVO';
                const sFilename = 'DIGI_' + fields.cenvio + '_' + icodusr + '.pdf';
console.log('files.pdf', files.pdf);
                var oldpath = files.pdf.path;
                var newpath = fupload.tmppath + 'unsigned_' + sFilename;
                mv(oldpath, newpath, async function (err) {
                    if (err) {
                        console.log('mv', err);
                        response.json({
                            error: err
                        });
                        return;
                    }
                    // firma el mugre pdf
                    /*
                    const newpathsigned = fupload.tmppath + sFilename;
                    var exec = require('child_process').exec, child;
                    child = exec('java -jar ' + java.stamper + ' "' + newpath + '" "' + newpathsigned + '"', async function (error, stdout, stderr) {
                        if(stdout.indexOf('OK') == -1){
                            let serror = (error || stderr);
                            console.log('exec error: ' + serror);
                            response.json({
                                error: serror
                            });
                            return;
                        }
                        */
                        // genera la ruta del archivo alv
                        let folders = [fields.empresa, 'PERSONAL', codusr];
                        const sPath = 'X:' + fupload.winseparator + folders.join(fupload.winseparator) + fupload.winseparator + sFilename;
                        /*
                        let remotePath = '/publico/document' + fupload.linuxseparator + folders.join(fupload.linuxseparator);
                        // aqui subir con ftp-manager
                        const ftpmanager = require('../../server/libs/ftp-manager');
                        let result = await ftpmanager.Subir(newpathsigned, remotePath + fupload.linuxseparator + sFilename);
                        if (result.error) {
                            response.json({
                                error: result.error
                            });
                            return;
                        } // fin ftp-manager
                        */
                        // guardar en la bd
                        try {
                            const conn = await oracledb.getConnection(dbParams);
                            // registra en el legajo de clientes
                            let tp_archivo = 9;
                            let query = "call pack_new_attached.sp_save_adjunto_2_new(:o_codigo, :o_resultado, :p_empresa, :p_usuario, :p_cataenti, :p_archivo, " +
                                ":p_tipoarchivo, :p_ruta, :p_fichero, :p_extension, :p_descripcion, :p_tpdocu)";
                            let params = {
                                o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                                o_resultado: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                                p_empresa: { val: fields.empresa },
                                p_usuario: { val: sesion.codigo },
                                p_cataenti: { val: codusr },
                                p_archivo: { val: codusr },
                                p_tipoarchivo: { val: tp_archivo },
                                p_ruta: { val: sPath },
                                p_fichero: { val: sFilename },
                                p_extension: { val: 'pdf' },
                                p_descripcion: { val: fields.envio },
                                p_tpdocu: { val: 639 }
                            };
console.log(query, params);
                            let result = await conn.execute(query, params, responseParams);
                            let { o_codigo, o_resultado } = result.outBinds;
                            if (o_codigo == 0) {
                                conn.close();
                                response.json({
                                    error: o_resultado
                                });
                                return;
                            }
                            // registra el envío del documento
                            var nuevo = esNuevo ? 'S' : 'N';
                            query = "call pack_digitalizacion.sp_carga_documento (:p_envio,:p_empresa,:p_personal,:p_item,:p_coarchivo,:p_tparchivo,:p_usuenvia," +
                                ":p_emprenvia,:o_codigo,:o_resultado,:p_contrato,:p_nuevo)";
                            params = {
                                p_envio: { val: fields.cenvio },
                                p_empresa: { val: fields.empresa },
                                p_personal: { val: codusr },
                                p_item: { val: o_codigo },
                                p_coarchivo: { val: codusr },
                                p_tparchivo: { val: tp_archivo },
                                p_usuenvia: { val: sesion.codigo },
                                p_emprenvia: { val: sesion.empresa },
                                o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                                o_resultado: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                                p_contrato: { val: 'S' },
                                p_nuevo: { val: nuevo }
                            };
console.log(query, params);
                            result = await conn.execute(query, params, responseParams);
                            let resDb = result.outBinds;
                            // fin
                            conn.close();
                            // validar
                            if (resDb.o_codigo == 0) {
                                response.json({
                                    error: resDb.o_resultado
                                });
                                return;
                            }
                            // listijirillo
                            response.json({
                                codigo: codusr
                            });
                        }
                        catch (err) {
                            console.error(err);
                            response.json({
                                error: err
                            });
                        }
                    // }); // fin exec java
                });
            });
        }
        else {
            response.json({
                error: 'No cuenta con permisos para acceder a esta opcion'
            });
        }
    },
    ListaAnios: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const jsSession = JSON.parse(request.cookies[confParams.cookieIntranet]);
            const { tipodoc } = request.query;
            let query = 'select distinct periodo.nu_anho "anio" ' +
                'from dg_documento_cab cabecera join ma_peri_m periodo on periodo.co_empresa = cabecera.co_empresa and periodo.co_periodo = cabecera.co_periodo ' +
                'where cabecera.co_tipo_doc_administr = :p_tipodoc and cabecera.co_empresa = :p_empresa order by periodo.nu_anho desc';
            let params = [
                { name: 'p_tipodoc', io: 'in', value: tipodoc },
                { name: 'p_empresa', io: 'in', value: jsSession.empresa }
            ];
console.log(query, params);
            let result = await db.select(query, params);
            response.json({
                data: result.rows
            });
        }
        else {
            response.json({
                error: 'No tienes permisos para acceder a esta sección'
            });
        }
    },
    ListaPeriodosTipodoc: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const jsSession = JSON.parse(request.cookies[confParams.cookieIntranet]);
            const { tipodoc, anio } = request.query;
            let query = 'select distinct periodo.co_periodo "value", periodo.de_nombre "text" ' +
                'from dg_documento_cab cabecera join ma_peri_m periodo on periodo.co_empresa = cabecera.co_empresa and periodo.co_periodo = cabecera.co_periodo ' +
                'where cabecera.co_tipo_doc_administr = :p_tipodoc and cabecera.co_empresa = :p_empresa and periodo.nu_anho = :p_anio and periodo.nu_mes > 0 ' +
                'order by periodo.co_periodo asc';
            let params = [
                { name: 'p_tipodoc', io: 'in', value: tipodoc },
                { name: 'p_empresa', io: 'in', value: jsSession.empresa },
                { name: 'p_anio', io: 'in', value: anio }
            ];
console.log(query, params);
            let result = await db.select(query, params);
            response.json({
                data: result.rows
            });
        }
        else {
            response.json({
                error: 'No tienes permisos para acceder a esta sección'
            });
        }
    },
    ListaDocumentosAprobacion: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const jsSession = JSON.parse(request.cookies[confParams.cookieIntranet]);
            const { tipodoc, periodo } = request.query;
            let query = 'call pack_digitalizacion.sp_documentos_aprobacion(:p_tipodoc, :p_periodo, :p_empresa, :rs)';
            let params = [
                { name: 'p_tipodoc', io: 'in', value: tipodoc },
                { name: 'p_periodo', io: 'in', value: periodo },
                { name: 'p_empresa', io: 'in', value: jsSession.empresa },
                { name: 'rs', io: 'out', type: 'cursor' }
            ];
            let result = await db.resultSet(query, params);
            let data = result.rs;
            for (let i in data) {
                let cipher = crypto.createCipher(encParams.algorytm, encParams.password);
                let encrypted = cipher.update(data[i].key, encParams.charset, encParams.param);
                encrypted += cipher.final(encParams.param);
                data[i].key = encrypted;
            }
            response.json({
                data: result.rs
            });
        }
        else {
            response.json({
                error: 'No tienes permisos para acceder a esta sección'
            });
        }
    },
    ListaDocumentosAprobados: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const jsSession = JSON.parse(request.cookies[confParams.cookieIntranet]);
            const { tipodoc, periodo } = request.query;
            let query = 'call pack_digitalizacion.sp_documentos_aprobados(:p_tipodoc, :p_periodo, :p_empresa, :rs)';
            let params = [
                { name: 'p_tipodoc', io: 'in', value: tipodoc },
                { name: 'p_periodo', io: 'in', value: periodo },
                { name: 'p_empresa', io: 'in', value: jsSession.empresa },
                { name: 'rs', io: 'out', type: 'cursor' }
            ];
            let result = await db.resultSet(query, params);
            let data = result.rs;
            for (let i in data) {
                let cipher = crypto.createCipher(encParams.algorytm, encParams.password);
                let encrypted = cipher.update(data[i].key, encParams.charset, encParams.param);
                encrypted += cipher.final(encParams.param);
                data[i].key = encrypted;
            }
            response.json({
                data: result.rs
            });
        }
        else {
            response.json({
                error: 'No tienes permisos para acceder a esta sección'
            });
        }
    },
    VerPdfUnsigned: async (request, response) => {
        const { key } = request.params;
        // importa parametros fupload
        const fupload = require('../../server/fupload');
        // desencriptar la key
        const decipher = crypto.createDecipher(encParams.algorytm, encParams.password);
        var decrypted = decipher.update(key, encParams.param, encParams.charset);
        decrypted += decipher.final('utf8');
        // recupera los parametros
        const vparams = decrypted.split('|');
        const envio = vparams[0];
        const empresa = vparams[1];
        const dni = vparams[2];
        // recupera ruta del archivo
        const pdfPath = fupload.tmppath + ['unsigned', 'DIGI', envio, dni].join('_') + '.pdf';
        // muestra el pdf
        const fs = require('fs');
        var stream = fs.ReadStream(pdfPath);
        response.setHeader('Content-type', 'application/pdf');
        stream.pipe(response);
    },
    AprobarContratos: async (request, response) => {
        const { keys } = request.body;
        const fupload = require('../../server/fupload');
        const numKeys = keys.length;
        const java = require('../../server/config/java');
        let completados = 0;
        if (numKeys > 0) {
            for (let key of keys) {
                let decipher = crypto.createDecipher(encParams.algorytm, encParams.password);
                let decrypted = decipher.update(key, encParams.param, encParams.charset);
                decrypted += decipher.final('utf8');
                // recupera los parametros
                let vparams = decrypted.split('|');
                let envio = vparams[0];
                let dni = vparams[2];
                let empresa = vparams[1];
                // recupera ruta del archivo
                let pdfPath = fupload.tmppath + ['unsigned', 'DIGI', envio, dni].join('_') + '.pdf';
                const sFilename = ['DIGI', envio, dni].join('_') + '.pdf';
                // firma el mugre pdf
                let newpathsigned = fupload.tmppath + sFilename;
                var exec = require('child_process').exec, child;
                child = exec('java -jar ' + java.stamperNuevo + ' "' + pdfPath + '" "' + newpathsigned + '" CT', async function (error, stdout, stderr) {
                    completados++;
                    if(stdout.indexOf('OK') == -1){
                        let serror = (error || stderr);
                        console.log('exec error: ' + serror);
                        response.json({
                            error: serror
                        });
                        return;
                    }
                    // sube al servidor de archivos
                    let folders = [empresa, 'PERSONAL', dni];
                    let remotePath = '/common/document' + fupload.linuxseparator + folders.join(fupload.linuxseparator);
                    // aqui subir con ftp-manager
                    const ftpmanager = require('../../server/libs/sftp-manager');
                    let result = await ftpmanager.upload(newpathsigned, remotePath + fupload.linuxseparator + sFilename);
                    if (result.error) {
                        response.json({
                            error: result.error
                        });
                        return;
                    } // fin ftp-manager
                    // actualiza el registro correspondiente
                    let query = "call pack_digitalizacion.sp_aprueba_documento_tipo(:p_documento, :p_usuario, :p_empresa, :o_codigo, :o_mensaje)";
                    let params = [
                        { name: 'p_documento', io:'in', value: envio },
                        { name: 'p_usuario', io:'in', value: dni },
                        { name: 'p_empresa', io:'in', value: empresa },
                        { name: 'o_codigo', io: 'out', type: 'number' },
                        { name: 'o_mensaje', io: 'out', type: 'string' }
                    ];
                    await db.statement(query, params);
                    if (completados == numKeys) {
                        response.json({
                            result: 'ok'
                        });
                    }
                }); // fin exec java
            }
        }
        else {
            response.json({
                error: 'No hay contratos para aprobar'
            });
        }
    },
    ListaPermisosDocumento: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const { documento, empresa, area } = request.query;
            let query = 'select "id", "tipo", "codigo", "nombre", "lectura", "creacion", "edicion", "aprobacion", "revision", "cautoriza", "usautoriza", "fecha" from table (pack_digitalizacion.f_lista_permisos_documento (:p_documento, :p_empresa, :p_area))';
            let params = [
                { name: 'p_documento', value: documento },
                { name: 'p_empresa', value: empresa },
                { name: 'p_area', value: area }
            ];
            let result = await db.select(query, params);
            if (result.error) {
                response.json({
                    error: result.error
                });
                return;
            }
            response.json({
                data: {
                    permisos: result.rows
                }
            });
        }
        else {
            response.json({
                error: 'No tienes permisos para acceder a esta sección'
            });
        }
    },
    ListaUsuariosPermisoDocumento: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            let { documento, area, permiso, tipo, puesto } = request.body;
            const jsSession = JSON.parse(request.cookies[confParams.cookieIntranet]);
            if (!area) area = 0;
            if (!puesto) puesto = 0;
            let query = 'call pack_digitalizacion.sp_combo_permisos_doc (:p_documento, :p_area, :p_empresa, :p_permiso, :p_tipo, :rs, :p_puesto)';
            let params = [
                { name: 'p_documento', io: 'in', value: documento },
                { name: 'p_area', io: 'in', value: area },
                { name: 'p_empresa', io: 'in', value: jsSession.empresa },
                { name: 'p_permiso', io: 'in', value: permiso },
                { name: 'p_tipo', io: 'in', value: tipo },
                { name: 'rs', io: 'out', type: 'cursor' },
                { name: 'p_puesto', io: 'in', value: puesto }
            ];
console.log(query, params);
            let result = await db.resultSet(query, params);
            if (result.error) {
                response.json({
                    error: result.error
                });
                return;
            }
            response.json({
                data: {
                    combo: result.rs
                }
            });
        }
        else {
            response.json({
                error: 'No tienes permisos para acceder a esta sección'
            });
        }
    },
    AsignarPermisosDocumento: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            let { documento, area, empresa, tipo, arearef, puestoref, usuref, lectura, crear, editar, aprueba, revisa } = request.body;
            const jsSession = JSON.parse(request.cookies[confParams.cookieIntranet]);
            let query = 'call pack_digitalizacion.sp_permiso_asignar (:p_documento, :p_area, :p_empresa, :p_tipo, :p_arearef, :p_puestoref, :p_usuref, '
                    + ':p_usureg, :p_empresareg, :p_lectura, :p_crear, :p_editar, :p_aprueba, :p_revisa, :o_codigo, :o_mensaje)';
            let params = [
                { name: 'p_documento', io: 'in', value: documento },
                { name: 'p_area', io: 'in', value: area },
                { name: 'p_empresa', io: 'in', value: empresa },
                { name: 'p_tipo', io: 'in', value: tipo },
                { name: 'p_arearef', io: 'in', value: arearef },
                { name: 'p_puestoref', io: 'in', value: puestoref },
                { name: 'p_usuref', io: 'in', value: usuref },
                { name: 'p_usureg', io: 'in', value: jsSession.codigo },
                { name: 'p_empresareg', io: 'in', value: jsSession.empresa },
                { name: 'p_lectura', io: 'in', value: lectura },
                { name: 'p_crear', io: 'in', value: crear },
                { name: 'p_editar', io: 'in', value: editar },
                { name: 'p_aprueba', io: 'in', value: aprueba },
                { name: 'p_revisa', io: 'in', value: revisa },
                { name: 'o_codigo', io: 'out', type: 'number' },
                { name: 'o_mensaje', io: 'out', type: 'string' }
            ];
            let result = await db.statement(query, params);
            if (result.error) {
                response.json({
                    error: result.error
                });
                return;
            }
            response.json({
                success: true
            });
        }
        else {
            response.json({
                error: 'No tienes permisos para acceder a esta sección'
            });
        }
    },
    ActualizaPermisosDocumento: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            let { permiso, empresa, lectura, crear, editar, aprueba } = request.body;
            let query = 'call pack_digitalizacion.sp_permiso_actualiza (:p_permiso, :p_empresa, :p_lectura, :p_crear, :p_editar, :p_aprueba, :o_codigo, :o_mensaje)';
            let params = [
                { name: 'p_permiso', io: 'in', value: permiso },
                { name: 'p_empresa', io: 'in', value: empresa },
                { name: 'p_lectura', io: 'in', value: lectura },
                { name: 'p_crear', io: 'in', value: crear },
                { name: 'p_editar', io: 'in', value: editar },
                { name: 'p_aprueba', io: 'in', value: aprueba },
                { name: 'o_codigo', io: 'out', type: 'number' },
                { name: 'o_mensaje', io: 'out', type: 'string' }
            ];
            let result = await db.statement(query, params);
            if (result.error) {
                response.json({
                    error: result.error
                });
                return;
            }
            response.json({
                success: true
            });
        }
        else {
            response.json({
                error: 'No tienes permisos para acceder a esta sección'
            });
        }
    },
    // ASISTENCIA ALV
    VerificaAsistencia: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const jsSession = JSON.parse(request.cookies[confParams.cookieIntranet]);
            let query = 'call pack_digitalizacion.sp_info_asistencia (:p_usuario, :p_empresa, :o_codigo, :o_mensaje, :o_lista)';
            let params = [
                { name: 'p_usuario', io: 'in', value: jsSession.codigo },
                { name: 'p_empresa', io: 'in', value: jsSession.empresa },
                { name: 'o_codigo', io: 'out', type: 'number' },
                { name: 'o_mensaje', io: 'out', type: 'string' },
                { name: 'o_lista', io: 'out', type: 'cursor' }
            ];
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
            response.json({
                codigo: result.o_codigo,
                marcas: result.o_lista,
                hora: result.o_mensaje
            });
        }
        else {
            response.json({
                error: 'No tienes permisos para acceder a esta sección'
            });
        }
    },
    RegistraMarcacion: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const jsSession = JSON.parse(request.cookies[confParams.cookieIntranet]);
            const infoEquipo = 'IP: ' + request.ip + ' | Browser: ' + request.headers['user-agent'];
            let query = 'call pack_digitalizacion.sp_registra_marcacion (:p_usuario, :p_empresa, :p_detalle, :o_codigo, :o_mensaje)';
            let params = [
                { name: 'p_usuario', io: 'in', value: jsSession.codigo },
                { name: 'p_empresa', io: 'in', value: jsSession.empresa },
                { name: 'p_detalle', io: 'in', value: infoEquipo },
                { name: 'o_codigo', io: 'out', type: 'number' },
                { name: 'o_mensaje', io: 'out', type: 'string' }
            ];
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
            response.json({
                secuencia: result.o_codigo
            });
        }
        else {
            response.json({
                error: 'No tienes permisos para acceder a esta sección'
            });
        }
    },
    ListaMarcaciones: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const { desde, hasta } = request.query;
            const jsSession = JSON.parse(request.cookies[confParams.cookieIntranet]);
            let query = 'select * from table (pack_digitalizacion.f_reporte_marcaciones(:p_empresa, :p_desde, :p_hasta)) order by nombre asc, dia asc';
            let params = [
                { name: 'p_empresa', io: 'in', value: jsSession.empresa },
                { name: 'p_desde', io: 'in', value: desde },
                { name: 'p_hasta', io: 'in', value: hasta }
            ];
            let result = await db.select(query, params);
            if (result.error) {
                response.json({
                    error: result.error
                });
                return;
            }
            response.json({
                marcaciones: result.rows
            });
        }
        else {
            response.json({
                error: 'No tienes permisos para acceder a esta sección'
            });
        }
    },
    InfoEdicionUsuario: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const { usuario, empresa } = request.query;
            let query = 'call pack_digitalizacion.sp_info_edicion_usr (:p_usuario, :p_empresa, :o_codigo, :o_mensaje, :o_apepat, :o_apemat, :o_nombres, :o_correo, :o_telefono, :o_area, :o_puesto, :o_areas, :o_puestos)';
            let params = [
                { name: 'p_usuario', io: 'in', value: usuario },
                { name: 'p_empresa', io: 'in', value: empresa },
                { name: 'o_codigo', io: 'out', type: 'number' },
                { name: 'o_mensaje', io: 'out', type: 'string' },
                { name: 'o_apepat', io: 'out', type: 'string' },
                { name: 'o_apemat', io: 'out', type: 'string' },
                { name: 'o_nombres', io: 'out', type: 'string' },
                { name: 'o_correo', io: 'out', type: 'string' },
                { name: 'o_telefono', io: 'out', type: 'string' },
                { name: 'o_area', io: 'out', type: 'number' },
                { name: 'o_puesto', io: 'out', type: 'number' },
                { name: 'o_areas', io: 'out', type: 'cursor' },
                { name: 'o_puestos', io: 'out', type: 'cursor' }
            ];
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
            response.json(result);
        }
        else {
            response.json({
                error: 'No tienes permisos para acceder a esta sección'
            });
        }
    },
    ComboPuestosPorArea: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const { empresa, area } = request.query;
            let query = 'select co_puesto_empr "value", de_nombre "text" from ma_puesto_empr_m where co_empresa = :p_empresa and co_area_empr = :p_area';
            let params = [
                { name: 'p_empresa', io: 'in', value: empresa },
                { name: 'p_area', io: 'in', value: area }
            ];
            let result = await db.select(query, params);
            if (result.error) {
                response.json({
                    error: result.error
                });
                return;
            }
            response.json({
                puestos: result.rows
            });
        }
        else {
            response.json({
                error: 'No tienes permisos para acceder a esta sección'
            });
        }
    },
    ActualizaDatosUsuario: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const { empresa, usuario, apepat, apemat, nombres, email, telefono, puesto } = request.body;
            let query = 'call pack_digitalizacion.sp_actualizar_info_usuario(:p_empresa, :p_usuario, :p_apepat, :p_apemat, :p_nombres, :p_email, :p_telefono, :p_puesto, :o_codigo, :o_mensaje)';
            let params = [
                { name: 'p_empresa', io: 'in', value: empresa },
                { name: 'p_usuario', io: 'in', value: usuario },
                { name: 'p_apepat', io: 'in', value: apepat },
                { name: 'p_apemat', io: 'in', value: apemat },
                { name: 'p_nombres', io: 'in', value: nombres },
                { name: 'p_email', io: 'in', value: email },
                { name: 'p_telefono', io: 'in', value: telefono },
                { name: 'p_puesto', io: 'in', value: puesto },
                { name: 'o_codigo', io: 'out', type: 'number' },
                { name: 'o_mensaje', io: 'out', type: 'string' }
            ];
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
            response.json({
                success: true
            });
        }
        else {
            response.json({
                error: 'No tienes permisos para acceder a esta sección'
            });
        }
    }
};

module.exports = LifeController;