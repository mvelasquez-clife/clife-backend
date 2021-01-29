const path = require('path');
const confParams = require('../../server/config/intranet');
const db = require('./../../server/libs/db-oracle');

const DocumentacionController = {
    Home: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            let sess = request.cookies[confParams.cookieIntranet];
            let jsSess = JSON.parse(sess);
            let admrrhh = jsSess.admrrhh;
            let admdocs = jsSess.admdoc;
            let admin = admrrhh + admdocs;
            let data = { sesion: sess, admin: admin };
            response.render(path.resolve('client/views/intranet/documentacion-home.ejs'), data);
        }
        else response.redirect('/intranet/login');
    },
    ListaDocumentosUsuario: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const sesion = JSON.parse(request.cookies[confParams.cookieIntranet]);
            const query = "select documento \"documento\", nomdocumento \"nomdocumento\", area \"area\", coarea \"coarea\", lectura \"lectura\", edicion \"edicion\", aprobacion \"aprobacion\", revision \"revision\", version \"version\", vigencia \"vigencia\" from table (pack_digitalizacion.f_documentos_permitidos(:p_usuario, :p_empresa))";
            const params = [
                { name: 'p_usuario', io: 'in', value: sesion.codigo },
                { name: 'p_empresa', io: 'in', value: sesion.empresa }
            ];
            let result = await db.select(query, params);
            response.json({
                data: {
                    documentos: result.rows
                }
            });
        }
        else response.json({
            error: 'No tienes permisos para acceder a esta información'
        });
    },
    VisorDocumento: async (request, response) => {
        const { ref } = request.query;
        const decodedKey = Buffer.from(ref, 'base64').toString('utf-8');
        const params = decodedKey.split('|');
        let codigo = params[0];
        let version = params[1];
        let empresa = params[2];
console.log(codigo, version, empresa);
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
        // descargar el archivo
        const fs = require('fs');
        if (fs.existsSync(path)) {
            var stream = fs.ReadStream(path);
            response.setHeader('Content-type', 'application/pdf');
            response.setHeader('Content-Disposition', 'inline; filename="' + result.oarhcivo + '"');
            stream.pipe(response);
        }
        else {
            response.send('No se encontró el archivo o no existe');
        }
    },
    RevisionDocumentoDatos: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const { codigo, version } = request.query;
            const sesion = JSON.parse(request.cookies[confParams.cookieIntranet]);
            const query = "call pack_digitalizacion.sp_documento_revision_datos(:p_documento, :p_empresa, :p_version, :o_result, :o_documento, :o_nomdocumento, :o_version, " +
                ":o_usureg, :o_areadoc, :o_vigencia, :o_fregistro, :o_fvencimiento, :o_fisico, :o_electronico, :o_observaciones)";
            const params = [
                { name: 'p_documento', io: 'in', value: codigo },
                { name: 'p_empresa', io: 'in', value: sesion.empresa },
                { name: 'p_version', io: 'in', value: version },
                { name: 'o_result', io: 'out', type: 'number' },
                { name: 'o_documento', io: 'out', type: 'string' },
                { name: 'o_nomdocumento', io: 'out', type: 'string' },
                { name: 'o_version', io: 'out', type: 'number' },
                { name: 'o_usureg', io: 'out', type: 'string' },
                { name: 'o_areadoc', io: 'out', type: 'string' },
                { name: 'o_vigencia', io: 'out', type: 'string' },
                { name: 'o_fregistro', io: 'out', type: 'string' },
                { name: 'o_fvencimiento', io: 'out', type: 'string' },
                { name: 'o_fisico', io: 'out', type: 'string' },
                { name: 'o_electronico', io: 'out', type: 'string' },
                { name: 'o_observaciones', io: 'out', type: 'string' }
            ];
            let result = await db.resultSet(query, params);
            if (result.error) {
                response.json({
                    error: result.error
                });
                return;
            }
            if (result.o_result == 0) {
                response.json({
                    error: result.o_nomdocumento
                });
                return;
            }
            response.json({
                data: result
            });
        }
        else response.json({
            error: 'No tienes permisos para acceder a esta información'
        });
    },
    DocumentoRevisionActualiza: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const { key, respuesta, observaciones } = request.body;
            const sesion = JSON.parse(request.cookies[confParams.cookieIntranet]);
            const query = "call pack_digitalizacion.sp_documento_revision (:p_key, :p_aprobar, :p_observaciones, :p_usuario, :o_codigo, :o_mensaje)";
            const params = [
                { name: 'p_key', io: 'in', value: key },
                { name: 'p_aprobar', io: 'in', value: respuesta },
                { name: 'p_usuario', io: 'in', value: sesion.codigo },
                { name: 'p_observaciones', io: 'in', value: observaciones },
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
            response.json({
                data: result
            });
        }
        else response.json({
            error: 'No tienes permisos para acceder a esta información'
        });
    },
    AprobacionDocumentoDatos: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const { codigo, version } = request.query;
            const sesion = JSON.parse(request.cookies[confParams.cookieIntranet]);
            const query = "call pack_digitalizacion.sp_documento_aprobacion_datos(:p_documento, :p_empresa, :p_version, :o_documento, :o_nomdocumento, :o_version, " +
                ":o_usureg, :o_areadoc, :o_vigencia, :o_fregistro, :o_fvencimiento, :o_fisico, :o_electronico, :o_observaciones)";
            const params = [
                { name: 'p_documento', io: 'in', value: codigo },
                { name: 'p_empresa', io: 'in', value: sesion.empresa },
                { name: 'p_version', io: 'in', value: version },
                { name: 'o_documento', io: 'out', type: 'string' },
                { name: 'o_nomdocumento', io: 'out', type: 'string' },
                { name: 'o_version', io: 'out', type: 'number' },
                { name: 'o_usureg', io: 'out', type: 'string' },
                { name: 'o_areadoc', io: 'out', type: 'string' },
                { name: 'o_vigencia', io: 'out', type: 'string' },
                { name: 'o_fregistro', io: 'out', type: 'string' },
                { name: 'o_fvencimiento', io: 'out', type: 'string' },
                { name: 'o_fisico', io: 'out', type: 'string' },
                { name: 'o_electronico', io: 'out', type: 'string' },
                { name: 'o_observaciones', io: 'out', type: 'string' }
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
                data: result
            });
        }
        else response.json({
            error: 'No tienes permisos para acceder a esta información'
        });
    },
    DocumentoAprobacionActualiza: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const { key, respuesta, observaciones } = request.body;
            const sesion = JSON.parse(request.cookies[confParams.cookieIntranet]);
            const query = "call pack_digitalizacion.sp_documento_aprobacion (:p_key, :p_aprobar, :p_observaciones, :p_usuario, :o_codigo, :o_mensaje)";
            const params = [
                { name: 'p_key', io: 'in', value: key },
                { name: 'p_aprobar', io: 'in', value: respuesta },
                { name: 'p_observaciones', io: 'in', value: observaciones },
                { name: 'p_usuario', io: 'in', value: sesion.codigo },
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
            response.json({
                data: result
            });
        }
        else response.json({
            error: 'No tienes permisos para acceder a esta información'
        });
    },
    EnviaCorreccionPendiente: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const formidable = require('formidable');
            const mv = require('mv');
            var form = new formidable.IncomingForm();
            form.parse(request, async function (err, fields, files) {
                if (err) {
                    response.json({
                        error: err
                    });
                    return;
                }
                const key = fields.key;
                // guardar en la bd
                const query = "call pack_digitalizacion.sp_corrige_pendiente (:p_key, :o_codigo, :o_mensaje, :o_extra)";
                const params = [
                    { name: 'p_key', io: 'in', value: key },
                    { name: 'o_codigo', io: 'out', type: 'number' },
                    { name: 'o_mensaje', io: 'out', type: 'string' },
                    { name: 'o_extra', io: 'out', type: 'string' }
                ];
                let result = await db.resultSet(query, params);
                if (result.error) {
                    response.json({
                        error: result.error
                    });
                    return;
                }
                if (result.o_codigo == 0) {
                    response.json({
                        error: result.o_mensaje
                    });
                    return;
                }
                var finalFilePath = confParams.base_dir + result.o_mensaje;
                var finalFileName = result.o_extra;
                var randomId = (Math.floor(Math.random() * 1000) + 1) + '_';
                var fileFullPath = finalFilePath + finalFileName;
                var movedFullPath = finalFilePath + randomId + finalFileName;
                // cambia el nombre del archivo anterior
                mv(fileFullPath, movedFullPath, async function (err) {
                    if (err) {
                        console.log('mv', err);
                        response.json({
                            error: err
                        });
                        return;
                    }
                    var oldPath = files.archivo.path;
                    mv(oldPath, fileFullPath, async function (err) {
                        if (err) {
                            console.log('mv', err);
                            response.json({
                                error: err
                            });
                            return;
                        }
                        response.json({
                            success: true
                        });
                    });
                });
                // renombra el nuevo archivo
                fs.renameSync(oldPath, fileFullPath);
            });
        }
        else response.json({
            error: 'No tienes permisos para acceder a esta información'
        });
    }
};

module.exports = DocumentacionController;