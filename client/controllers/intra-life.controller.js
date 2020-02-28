const path = require('path');
const bcrypt = require('bcrypt');
const oracledb = require('oracledb');
const Client = require('ftp');
const crypto = require('crypto');
const dbParams = require('../../server/database');
const confParams = require('../../server/config/intranet');
const ftpAccess = require('../../server/ftp-access');
const encParams = require('../../server/config/encrypt');
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
                    let remotePath = '/publico/document' + fupload.linuxseparator + folders.join(fupload.linuxseparator);
                    // subir con curl
                    const fs = require('fs');
                    const fileData = fs.readFileSync(newpath);
                    const base64 = fileData.toString('base64'); //codifica el pdf a base 64
                    const { Curl } = require('node-libcurl');
                    const curl = new Curl();
                    const url = 'http://192.168.0.248/uploader/index.php';
                    curl.setOpt(Curl.option.URL, url);
                    curl.setOpt(Curl.option.POSTFIELDS, 'path=' + remotePath + '&filename=' + sFilename + '&b64=' + encodeURIComponent(base64));
                    curl.setOpt(Curl.option.VERBOSE, true);
                    curl.on('end', async (statusCode, body) => {
                        // guardar en la bd
                        try {
                            const conn = await oracledb.getConnection(dbParams);
                            // registra en el legajo de clientes
                            let query = "call pack_new_attached.sp_save_adjunto(:o_codigo, :o_resultado, :p_empresa, :p_usuario, :p_tipo_enti, :p_cataenti, :p_archivo, " +
                                ":p_tipoarchivo, :p_ruta, :p_fichero, :p_extension, :p_descripcion, :p_tpdocu, :p_tipocarpeta, :p_nuitems)";
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
                    curl.on('error', curl.close.bind(curl));
                    curl.perform();
                });
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
        // response.send(envio + ' - ' + empresa + ' - ' + personal);
        try {
            const conn = await oracledb.getConnection(dbParams);
            // registra en el legajo de clientes
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
                console.log(query, params);
            }
            // out!
            if (o_codigo == 0) {
                response.send('error: ' + o_mensaje);
                return;
            }
            response.send(JSON.stringify({
                ruta: o_ruta, nombre: o_nombre, fecha: o_fecha, numero: o_numero, leido: o_leido
            }));
        }
        catch (err) {
            console.error(err);
            response.send(JSON.stringify(err));
        }
    },
    InfoEquipo: (request, response) => {
console.log('otra ip', request.ip);
console.log(request.headers['user-agent']);
        response.send('ola ke ase');
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
                if (o_codigo == 0) {
                    conn.close();
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
                response.json({
                    data: {
                        mensajes: result.rows
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
            try {
                const conn = await oracledb.getConnection(dbParams);
                let query = "select * from table (pack_digitalizacion.f_lista_documentos(:p_empresa, :p_codigo, :p_tipodoc))";
                let params = {
                    p_empresa: { val: sesion.empresa },
                    p_codigo: { val: sesion.codigo },
                    p_tipodoc: { val: '801' }
                };
                const result = await conn.execute(query, params, responseParams);
                const documentos = result.rows;
                const numDocumentos = documentos.length;
                const cipher = crypto.createCipher(encParams.algorytm, encParams.password);
                for (let i = 0; i < numDocumentos; i++) {
                    let iDocumento = documentos[i];
                    let string = [iDocumento.CODIGO, iDocumento.EMPRESA, sesion.codigo].join(encParams.separator);
                    var encrypted = cipher.update(string, encParams.charset, encParams.param);
                    encrypted += cipher.final(encParams.param);
                    documentos[i].url = encrypted;
                }
                response.json({
                    data: {
                        documentos: documentos
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
    }
};

module.exports = LifeController;