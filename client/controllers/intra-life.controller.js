const path = require('path');
const bcrypt = require('bcrypt');
const oracledb = require('oracledb');
const dbParams = require('../../server/database');
const confParams = require('../../server/config/intranet');
const Client = require('ftp');
const ftpAccess = require('../../server/ftp-access');
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
            let query = "select node_password \"hash\", st_cuenta_activada \"stact\", st_verifica_mail \"stmail\", co_cliente \"codigo\", initcap(de_nombre_comercial) \"ncomercial\", " +
                "initcap(de_razon_social) \"rsocial\", fe_suscripcion \"fsuscripcion\", de_email \"email\", de_telefono \"telefono\", st_admin \"admin\", st_tipo_usuario \"tipo\", " +
                "co_empresa as \"empresa\" from cl_usuarios where co_cliente = :p_rucdni and co_empresa = :p_empresa";
            let params = {
                p_rucdni: { val: codigo },
                p_empresa: { val: empresa }
            };
            result = await conn.execute(query, params, responseParams);
            result = result.rows[0];
            conn.close();
            // verificar si la cuenta esta activada y el email fue validado
            // compara la clave con el hash
            bcrypt.compare(pswd, result.hash, function (err, res) {
                if (err) {
                    response.cookie(confParams.cookieError, 'La clave ingresada es incorrecta.', { httpOnly: true });
                    response.redirect('/intranet/login');
                    return;
                }
                let sesion = result;
                delete sesion.hash;
                delete sesion.stact;
                delete sesion.stmail;
console.log(sesion);
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
                const conn = await oracledb.getConnection(dbParams);
                const query = "select * from table(pack_digitalizacion.f_lista_tipos_doc)";
                const params = {};
                const result = await conn.execute(query, params, responseParams);
                response.json({
                    data: {
                        tiposdoc: result.rows
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
                const query = "call pack_digitalizacion.sp_registra_cabecera_envio (:p_empresa, :p_nombre, :p_tipodoc, :p_usureg, :p_inicio, :p_fin, :o_codigo, :o_mensaje)";
                const params = {
                    p_empresa: empresa,
                    p_nombre: descripcion,
                    p_tipodoc: tipodoc,
                    p_usureg: sesion.codigo,
                    p_inicio: finicio,
                    p_fin: ffin,
                    o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                    o_mensaje: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
                };
                const result = await conn.execute(query, params, responseParams);
                const { o_codigo, o_mensaje } = result.outBinds;
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
                    cliente = cliente.split('.')[0];
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
                const sFilename = 'DIGI_' + fields.cenvio + '_' + fields.codigo + '.pdf';
                var oldpath = files.pdf.path;
                var newpath = fupload.tmppath + sFilename;
                mv(oldpath, newpath, async function (err) {
                    if (err) {
                        response.json({
                            error: err
                        });
                        return;
                    }
                    // genera la ruta del archivo alv
                    let folders = [fields.empresa, 'CLIENTES', fields.codigo];
                    const sPath = 'X:' + fupload.winseparator + folders.join(fupload.winseparator) + fupload.winseparator + sFilename;
                    const remotePath = '/publico/document' + fupload.linuxseparator + folders.join(fupload.linuxseparator) + fupload.linuxseparator + sFilename;
                    // subir archivo a la 248
                    const c = new Client();
                    c.on('ready', function() {
                        c.mkdir(remotePath, (error) => {
                            if (error) {
                                response.json({
                                    error: 'c.mkdir: ' + JSON.stringify(error)
                                });
                                return;
                            }
                            c.put(newpath, remotePath, async function(putError) {
                                if (putError) {
                                    response.json({
                                        error: 'c.put: ' + JSON.stringify(putError)
                                    });
                                    return;
                                }
                                c.end();
                                // registra en la bd
                                try {
                                    const conn = await oracledb.getConnection(dbParams);
                                    // registra en el legajo de clientes
                                    let query = "call pack_new_attached.sp_save_adjunto(:o_codigo, :o_resultado, :p_empresa, :p_usuario, :p_tipo_enti, :p_cataenti, :p_archivo, :p_tipoarchivo, " +
                                        ":p_ruta, :p_fichero, :p_extension, :p_descripcion, :p_tpdocu, :p_tipocarpeta, :p_nuitems)";
                                    let params = {
                                        o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                                        o_resultado: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                                        p_empresa: { val: fields.empresa },
                                        p_usuario: { val: sesion.codigo },
                                        p_tipo_enti: { val: 2 },
                                        p_cataenti: { val: fields.codigo },
                                        p_archivo: { val: fields.codigo },
                                        p_tipoarchivo: { val: 4 },
                                        p_ruta: { val: sPath },
                                        p_fichero: { val: sFilename },
                                        p_extension: { val: 'pdf' },
                                        p_descripcion: { val: fields.envio },
                                        p_tpdocu: { val: 639 },
                                        p_tipocarpeta: { val: 'CLIENTES' },
                                        p_nuitems: { val: 1 }
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
                                    query = "call pack_digitalizacion.sp_carga_documento (:p_envio,:p_empresa,:p_personal,:p_item,:p_coarchivo,:p_tparchivo,:p_usuenvia,:o_codigo,:o_resultado)";
                                    params = {
                                        p_envio: { val: fields.cenvio },
                                        p_empresa: { val: fields.empresa },
                                        p_personal: { val: fields.codigo },
                                        p_item: { val: o_codigo },
                                        p_coarchivo: { val: fields.codigo },
                                        p_tparchivo: { val: 4 },
                                        p_usuenvia: { val: sesion.codigo },
                                        o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                                        o_resultado: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
                                    };
                                    result = await conn.execute(query, params, responseParams);
                                    conn.close();
                                    // validar
                                    // result.outBinds
                                    if (result.outBinds.o_codigo == 0) {
                                        response.json({
                                            error: result.outBinds.o_resultado
                                        });
                                        return;
                                    }
                                    // listijirillo
                                    response.json({
                                        result: 'ok'
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
                    });
                    c.connect(ftpAccess);
                });
                /*
                var oldpath = files.pdf.path;
                var newpath = fupload.tmppath + files.pdf.name;
                mv(oldpath, newpath, async function (err) {
                    if (err) {
                        response.json({
                            error: err
                        });
                    }
                    // ahora verificar stocks e insertar
                    try {
                        const conn = await oracledb.getConnection(dbParams);
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
                */
            });
        }
        else {
            response.json({
                error: 'No cuenta con permisos para acceder a esta opcion'
            });
        }
    }
};

module.exports = LifeController;