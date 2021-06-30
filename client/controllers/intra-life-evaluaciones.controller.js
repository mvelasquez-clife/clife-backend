const path = require('path');
const confParams = require('../../server/config/intranet');
const { select } = require('./../../server/libs/db-oracle');
const db = require('./../../server/libs/db-oracle');

const EvaluacionesController = {
    Programacion: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            let sess = request.cookies[confParams.cookieIntranet];
            let jsSess = JSON.parse(sess);
            let admrrhh = jsSess.admrrhh;
            let admdocs = jsSess.admdoc;
            let admin = admrrhh + admdocs;
            let data = { sesion: sess, admin: admin };
            response.render(path.resolve('client/views/intranet/evaluacion-programar'), data);
        }
        else response.redirect('/intranet/evaluaciones');
    },
    Evaluaciones: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            let sess = request.cookies[confParams.cookieIntranet];
            let jsSess = JSON.parse(sess);
            let admrrhh = jsSess.admrrhh;
            let admdocs = jsSess.admdoc;
            let admin = admrrhh + admdocs;
            let data = { sesion: sess, admin: admin };
            response.render(path.resolve('client/views/intranet/evaluaciones'), data);
        }
        else response.redirect('/intranet/evaluaciones');
    },
    Resultados: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            let sess = request.cookies[confParams.cookieIntranet];
            let jsSess = JSON.parse(sess);
            let admrrhh = jsSess.admrrhh;
            let admdocs = jsSess.admdoc;
            let admin = admrrhh + admdocs;
            let data = { sesion: sess, admin: admin };
            response.render(path.resolve('client/views/intranet/evaluacion-resultados'), data);
        }
        else response.redirect('/intranet/evaluaciones');
    },
    Responder: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            let sess = request.cookies[confParams.cookieIntranet];
            let jsSess = JSON.parse(sess);
            let { key } = request.query;
            let values = Buffer.from(key, "base64").toString("utf8").split('|');
            let p_id = parseInt(values[0]);
            let p_evaluacion = parseInt(values[1]);
            let p_documento = values[2];
            // carga el estado actual de la encuesta
            let query = "call pack_digitalizacion.sp_estado_evaluacion (:o_codigo, :o_estado, :p_id, :p_evaluacion, :p_documento, :p_empresa, :p_usuario)";
            let params = [
                { name: 'o_codigo', io: 'out', type: 'number' },
                { name: 'o_estado', io: 'out', type: 'string' },
                { name: 'p_id', io: 'in', value: p_id },
                { name: 'p_evaluacion', io: 'in', value: p_evaluacion },
                { name: 'p_documento', io: 'in', value: p_documento },
                { name: 'p_empresa', io: 'in', value: jsSess.empresa },
                { name: 'p_usuario', io: 'in', value: jsSess.codigo }
            ];
            let result = await db.resultSet(query, params);
            let data = {
                sesion: sess,
                id: p_id,
                evaluacion: p_evaluacion,
                documento: p_documento
            };
            switch (result.o_codigo) {
                case 0: // hay que crear la cabecera del examen
                    query = "call pack_digitalizacion.sp_habilita_evaluacion_usuario (:o_codigo, :o_estado, :p_id, :p_evaluacion, :p_documento, :p_empresa, :p_usuario)";
                    params = [
                        { name: 'o_codigo', io: 'out', type: 'number' },
                        { name: 'o_estado', io: 'out', type: 'string' },
                        { name: 'p_id', io: 'in', value: p_id },
                        { name: 'p_evaluacion', io: 'in', value: p_evaluacion },
                        { name: 'p_documento', io: 'in', value: p_documento },
                        { name: 'p_empresa', io: 'in', value: jsSess.empresa },
                        { name: 'p_usuario', io: 'in', value: jsSess.codigo }
                    ];
                    result = await db.resultSet(query, params);
                    if (result.error) {
                        response.send(result.error);
                        return;
                    }
                    if (result.o_codigo == 0) {
                        response.send(result.o_estado);
                        return;
                    }
                    data.id = result.o_codigo;
                    response.render(path.resolve('client/views/intranet/evaluacion-comenzar'), data);
                    break;
                case 1: // la cabecera está creada. comenzar el cuestionario
                    if (result.o_estado == 'Pendiente') {
                        response.render(path.resolve('client/views/intranet/evaluacion-comenzar'), data);
                    }
                    else {
                        query = "call pack_digitalizacion.sp_datos_pregunta (:o_codigo, :o_mensaje, :o_detalle, :o_claves, :p_id, :p_evaluacion, :p_documento, :p_empresa, :p_usuario)";
                        params = [
                            { name: 'o_codigo', io: 'out', type: 'number' },
                            { name: 'o_mensaje', io: 'out', type: 'string' },
                            { name: 'o_detalle', io: 'out', type: 'cursor' },
                            { name: 'o_claves', io: 'out', type: 'cursor' },
                            { name: 'p_id', io: 'in', value: p_id },
                            { name: 'p_evaluacion', io: 'in', value: p_evaluacion },
                            { name: 'p_documento', io: 'in', value: p_documento },
                            { name: 'p_empresa', io: 'in', value: jsSess.empresa },
                            { name: 'p_usuario', io: 'in', value: jsSess.codigo }
                        ];
                        result = await db.resultSet(query, params);
                        if (result.error) {
                            response.send(result.error);
                            return;
                        }
                        if (result.o_codigo == 0) {
                            response.render(path.resolve('client/views/intranet/evaluacion-finalizada'), data);
                            return;
                        }
                        var pregunta = {
                            datos: result.o_detalle[0],
                            claves: result.o_claves
                        };
                        data.pregunta = JSON.stringify(pregunta);
                        response.render(path.resolve('client/views/intranet/evaluacion-responder'), data);
                    }
                    break;
                case -1:
                    response.send(result.o_estado);
                    break;
            }
            // response.render(path.resolve('client/views/intranet/evaluacion-responder'), data);
        }
        else response.redirect('/intranet/evaluaciones');
    },
    EvaluacionDatosCabecera: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const { documento } = request.query;
            const sesion = JSON.parse(request.cookies[confParams.cookieIntranet]);
            const query = "call pack_digitalizacion.sp_evaluacion_cabecera (:o_codigo, :o_mensaje, :o_info, :o_tipos, :p_empresa, :p_documento)";
            const params = [
                { name: 'o_codigo', io: 'out', type: 'number' },
                { name: 'o_mensaje', io: 'out', type: 'string' },
                { name: 'o_info', io: 'out', type: 'cursor' },
                { name: 'o_tipos', io: 'out', type: 'cursor' },
                { name: 'p_empresa', io: 'in', value: sesion.empresa },
                { name: 'p_documento', io: 'in', value: documento }
            ];
            let result = await db.resultSet(query, params);
            if (result.error) {
                response.json({
                    error: result.error
                });
                return;
            }
            if (result.o_info.length > 0) {
                response.json({
                    info: result.o_info[0],
                    tipos: result.o_tipos
                });
                return;
            }
            response.json({
                error: result.o_mensaje
            });
            return;
        }
        else response.json({
            error: 'No tienes permisos para acceder a esta información'
        });
    },
    RegistraEvaluacionDocumento: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const { documento, empresa, descripcion, duracion, restringido, evaluadores, preguntas } = request.body;
            const sesion = JSON.parse(request.cookies[confParams.cookieIntranet]);
            let query, params, result;
            // graba la cabecera y recupera el codigo de la evaluacion
            query = "call pack_digitalizacion.sp_registra_evaluacion_cab (:o_codigo, :o_mensaje, :p_documento, :p_empresa, :p_descripcion, :p_duracion, :p_restringido, :p_usureg, :p_empreg)";
            params = [
                { name: 'o_codigo', io: 'out', type: 'number' },
                { name: 'o_mensaje', io: 'out', type: 'string' },
                { name: 'p_documento', io: 'in', value: documento },
                { name: 'p_empresa', io: 'in', value: empresa },
                { name: 'p_descripcion', io: 'in', value: descripcion },
                { name: 'p_duracion', io: 'in', value: duracion },
                { name: 'p_restringido', io: 'in', value: restringido },
                { name: 'p_usureg', io: 'in', value: sesion.codigo },
                { name: 'p_empreg', io: 'in', value: sesion.empresa }
            ];
            result = await db.resultSet(query, params);
            if (result.error) {
                response.json({
                    error: result.error
                });
                return;
            }
            let evaluacion = result.o_codigo;
            if (evaluacion == 0) {
                response.json({
                    error: result.o_mensaje
                });
                return;
            }
            // asigna los evaluadores
            //
            // guarda las respuestas
            let index = 1;
            for (let pregunta of preguntas) {
                // organiza y concatena las opciones
                let ropciones = [];
                let npregunta = 1;
                if (pregunta.opciones) {
                    for (let opcion of pregunta.opciones) {
                        // numero~correcto~texto
                        ropciones.push([npregunta, (opcion.correcto == 'true' ? 'S' : 'N'), opcion.texto].join('~'));
                        npregunta++;
                    }
                }
                // registra la pregunta
                query = "call pack_digitalizacion.sp_registra_evaluacion_det (:o_codigo, :o_mensaje, :p_evaluacion, :p_documento, :p_empresa, :p_orden, :p_tipopreg, :p_enunciado, :p_usureg, :p_empreg, :p_opciones)";
                params = [
                    { name: 'o_codigo', io: 'out', type: 'number' },
                    { name: 'o_mensaje', io: 'out', type: 'string' },
                    { name: 'p_evaluacion', io: 'in', value: evaluacion },
                    { name: 'p_documento', io: 'in', value: documento },
                    { name: 'p_empresa', io: 'in', value: empresa },
                    { name: 'p_orden', io: 'in', value: index },
                    { name: 'p_tipopreg', io: 'in', value: pregunta.ctipo },
                    { name: 'p_enunciado', io: 'in', value: pregunta.texto },
                    { name: 'p_usureg', io: 'in', value: sesion.codigo },
                    { name: 'p_empreg', io: 'in', value: sesion.empresa },
                    { name: 'p_opciones', io: 'in', value: (ropciones.length > 0 ? ropciones.join('|') : '-') }
                ];
                result = await db.resultSet(query, params);
                if (result.o_codigo == 0) console.error(result.o_mensaje);
                index++;
            }
            response.json({
                result: 'OK'
            });
        }
        else response.json({
            error: 'No tienes permisos para acceder a esta información'
        });
    },
    ListaEvaluacionesDocumento: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const { documento, empresa } = request.query;
            const query = "call pack_digitalizacion.sp_evaluaciones_documento (:o_codigo, :o_mensaje, :o_evaluaciones, :p_documento, :p_empresa)";
            const params = [
                { name: 'o_codigo', io: 'out', type: 'number' },
                { name: 'o_mensaje', io: 'out', type: 'string' },
                { name: 'o_evaluaciones', io: 'out', type: 'cursor' },
                { name: 'p_documento', io: 'in', value: documento },
                { name: 'p_empresa', io: 'in', value: empresa }
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
            response.json({
                evaluaciones: result.o_evaluaciones
            });
        }
        else response.json({
            error: 'No tienes permisos para acceder a esta información'
        });
    },
    PreguntasEvaluacion: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const { evaluacion, empresa } = request.query;
            const query = "call pack_digitalizacion.sp_preguntas_evaluacion (:o_codigo, :o_mensaje, :o_preguntas, :p_evaluacion, :p_empresa)";
            const params = [
                { name: 'o_codigo', io: 'out', type: 'number' },
                { name: 'o_mensaje', io: 'out', type: 'string' },
                { name: 'o_preguntas', io: 'out', type: 'cursor' },
                { name: 'p_evaluacion', io: 'in', value: evaluacion },
                { name: 'p_empresa', io: 'in', value: empresa }
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
            response.json({
                preguntas: result.o_preguntas
            });
        }
        else response.json({
            error: 'No tienes permisos para acceder a esta información'
        });
    },
    EvaluadosEvaluacion: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const { evaluacion, empresa } = request.query;
            const query = "select distinct * from table(pack_digitalizacion.f_lista_evaluados(:p_evaluacion, :p_empresa)) order by \"usuario\" asc";
            const params = [
                { name: 'p_evaluacion', io: 'in', value: evaluacion },
                { name: 'p_empresa', io: 'in', value: empresa }
            ];
            let result = await db.select(query, params);
            if (result.error) {
                response.json({
                    error: result.error
                });
                return;
            }
            response.json({
                evaluados: result.rows
            });
        }
        else response.json({
            error: 'No tienes permisos para acceder a esta información'
        });
    },
    EvaluacionesUsuario: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const sesion = JSON.parse(request.cookies[confParams.cookieIntranet]);
            const query = "call pack_digitalizacion.sp_evaluaciones_pendientes(:o_codigo, :o_mensaje, :o_evaluaciones, :p_usuario, :p_empresa)";
            const params = [
                { name: 'o_codigo', io: 'out', type: 'number' },
                { name: 'o_mensaje', io: 'out', type: 'string' },
                { name: 'o_evaluaciones', io: 'out', type: 'cursor' },
                { name: 'p_usuario', io: 'in', value: sesion.codigo },
                { name: 'p_empresa', io: 'in', value: sesion.empresa }
            ];
            let result = await db.resultSet(query, params);
            if (result.error) {
                response.json({
                    error: result.error
                });
                return;
            }
            response.json({
                evaluaciones: result.o_evaluaciones
            });
        }
        else response.json({
            error: 'No tienes permisos para acceder a esta información'
        });
    },
    ComenzarEvaluacion: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const { id, evaluacion, documento } = request.body;
            const sesion = JSON.parse(request.cookies[confParams.cookieIntranet]);
            const query = "call pack_digitalizacion.sp_comenzar_evaluacion(:o_codigo, :o_mensaje, :p_identificador, :p_evaluacion, :p_control_documento, :p_empresa, :p_usuario)";
            const params = [
                { name: 'o_codigo', io: 'out', type: 'number' },
                { name: 'o_mensaje', io: 'out', type: 'string' },
                { name: 'p_identificador', io: 'in', value: id },
                { name: 'p_evaluacion', io: 'in', value: evaluacion },
                { name: 'p_control_documento', io: 'in', value: documento },
                { name: 'p_empresa', io: 'in', value: sesion.empresa },
                { name: 'p_usuario', io: 'in', value: sesion.codigo }
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
            response.json({
                success: true
            });
        }
        else response.json({
            error: 'No tienes permisos para acceder a esta información'
        });
    },
    GuardaRespuesta: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const { id, evaluacion, documento, numero, respuesta } = request.body;
            const sesion = JSON.parse(request.cookies[confParams.cookieIntranet]);
            const query = "call pack_digitalizacion.sp_graba_respuesta(:o_codigo, :o_mensaje, :p_identificador, :p_evaluacion, :p_control_documento, :p_empresa, :p_usuario, :p_pregunta, :p_respuesta)";
            const params = [
                { name: 'o_codigo', io: 'out', type: 'number' },
                { name: 'o_mensaje', io: 'out', type: 'string' },
                { name: 'p_identificador', io: 'in', value: id },
                { name: 'p_evaluacion', io: 'in', value: evaluacion },
                { name: 'p_control_documento', io: 'in', value: documento },
                { name: 'p_empresa', io: 'in', value: sesion.empresa },
                { name: 'p_usuario', io: 'in', value: sesion.codigo },
                { name: 'p_pregunta', io: 'in', value: numero },
                { name: 'p_respuesta', io: 'in', value: respuesta }
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
            response.json({
                success: true
            });
        }
        else response.json({
            error: 'No tienes permisos para acceder a esta información'
        });
    },
    DatosEvaluacion: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const { evaluacion, documento } = request.query;
            const sesion = JSON.parse(request.cookies[confParams.cookieIntranet]);
            const query = "call pack_digitalizacion.sp_nombre_evaluacion(:o_codigo, :o_nombre, :o_duracion, :p_evaluacion, :p_documento, :p_empresa)";
            const params = [
                { name: 'o_codigo', io: 'out', type: 'number' },
                { name: 'o_nombre', io: 'out', type: 'string' },
                { name: 'o_duracion', io: 'out', type: 'number' },
                { name: 'p_evaluacion', io: 'in', value: evaluacion },
                { name: 'p_documento', io: 'in', value: documento },
                { name: 'p_empresa', io: 'in', value: sesion.empresa }
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
            response.json({
                info: {
                    nombre: result.o_nombre,
                    duracion: result.o_duracion
                }
            });
        }
        else response.json({
            error: 'No tienes permisos para acceder a esta información'
        });
    },
    FinalizarEvaluacion: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const { id, evaluacion, documento } = request.body;
            const sesion = JSON.parse(request.cookies[confParams.cookieIntranet]);
            const query = "call pack_digitalizacion.sp_finaliza_evaluacion(:o_codigo, :o_estado, :p_identificador, :p_evaluacion, :p_documento, :p_empresa, :p_usuario)";
            const params = [
                { name: 'o_codigo', io: 'out', type: 'number' },
                { name: 'o_estado', io: 'out', type: 'string' },
                { name: 'p_identificador', io: 'in', value: id },
                { name: 'p_evaluacion', io: 'in', value: evaluacion },
                { name: 'p_documento', io: 'in', value: documento },
                { name: 'p_empresa', io: 'in', value: sesion.empresa },
                { name: 'p_usuario', io: 'in', value: sesion.codigo}
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
                    error: result.o_estado
                });
                return;
            }
            response.json({
                success: true
            });
        }
        else response.json({
            error: 'No tienes permisos para acceder a esta información'
        });
    },
    ComboEvaluacionesDocumento: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const { documento, empresa } = request.query;
            const query = 'select co_evaluacion "value", de_nombre_evaluacion "text" from dg_evaluacion_m where co_control_documento = :p_documento and co_empresa = :p_empresa';
            const params = [
                { name: 'p_documento', io: 'in', value: documento },
                { name: 'p_empresa', io: 'in', value: empresa }
            ];
            let result = await db.select(query, params);
            if (result.error) {
                response.json({
                    error: result.error
                });
                return;
            }
            response.json({
                options: result.rows
            });
        }
        else response.json({
            error: 'No tienes permisos para acceder a esta información'
        });
    },
    CargaResultadosEvaluacion: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const { evaluacion, empresa } = request.query;
            const query = "call pack_digitalizacion.sp_resultados_evaluacion(:o_codigo, :o_mensaje, :o_examenes, :p_evaluacion, :p_empresa)";
            const params = [
                { name: 'o_codigo', io: 'out', type: 'number' },
                { name: 'o_mensaje', io: 'out', type: 'string' },
                { name: 'o_examenes', io: 'out', type: 'cursor' },
                { name: 'p_evaluacion', io: 'in', value: evaluacion },
                { name: 'p_empresa', io: 'in', value: empresa }
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
            response.json({
                examenes: result.o_examenes
            });
        }
        else response.json({
            error: 'No tienes permisos para acceder a esta información'
        });
    },
    ResumenCalificacion: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const { identificador, evaluacion, documento, empresa, usuario } = request.query;
            const query = "call pack_digitalizacion.sp_resumen_calificacion (:o_codigo, :o_mensaje, :o_resumen, :p_identificador, :p_evaluacion, :p_documento, :p_empresa, :p_usuario)";
            const params = [
                { name: 'o_codigo', io: 'out', type: 'number' },
                { name: 'o_mensaje', io: 'out', type: 'string' },
                { name: 'o_resumen', io: 'out', type: 'cursor' },
                { name: 'p_identificador', io: 'in', value: identificador },
                { name: 'p_evaluacion', io: 'in', value: evaluacion },
                { name: 'p_documento', io: 'in', value: documento },
                { name: 'p_empresa', io: 'in', value: empresa },
                { name: 'p_usuario', io: 'in', value: usuario }
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
            response.json({
                resumen: result.o_resumen
            });
        }
        else response.json({
            error: 'No tienes permisos para acceder a esta información'
        });
    },
    CalificarExamen: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const { identificador, evaluacion, documento, empresa, usuario, calificaciones } = request.body;
            const query = "call pack_digitalizacion.sp_calificar_evaluacion (:o_codigo, :o_mensaje, :p_identificador, :p_evaluacion, :p_documento, :p_empresa, :p_usuario, :p_calificaciones)";
            const params = [
                { name: 'o_codigo', io: 'out', type: 'number' },
                { name: 'o_mensaje', io: 'out', type: 'string' },
                { name: 'p_identificador', io: 'in', value: identificador },
                { name: 'p_evaluacion', io: 'in', value: evaluacion },
                { name: 'p_documento', io: 'in', value: documento },
                { name: 'p_empresa', io: 'in', value: empresa },
                { name: 'p_usuario', io: 'in', value: usuario },
                { name: 'p_calificaciones', io: 'in', value: calificaciones }
            ];
console.log(query, params);
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
            response.json({
                success: true
            });
        }
        else response.json({
            error: 'No tienes permisos para acceder a esta información'
        });
    },
    VerCalificacionExamen: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const { identificador, evaluacion, documento, empresa, usuario } = request.query;
            const query = "call pack_digitalizacion.sp_calificacion_examen (:o_codigo, :o_mensaje, :o_resumen, :o_calificacion, :p_identificador, :p_evaluacion, :p_documento, :p_empresa, :p_usuario)";
            const params = [
                { name: 'o_codigo', io: 'out', type: 'number' },
                { name: 'o_mensaje', io: 'out', type: 'string' },
                { name: 'o_resumen', io: 'out', type: 'cursor' },
                { name: 'o_calificacion', io: 'out', type: 'number' },
                { name: 'p_identificador', io: 'in', value: identificador },
                { name: 'p_evaluacion', io: 'in', value: evaluacion },
                { name: 'p_documento', io: 'in', value: documento },
                { name: 'p_empresa', io: 'in', value: empresa },
                { name: 'p_usuario', io: 'in', value: usuario }
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
            response.json({
                resumen: result.o_resumen,
                calificacion: result.o_calificacion
            });
        }
        else response.json({
            error: 'No tienes permisos para acceder a esta información'
        });
    },
    CombosEvaluadores: async (request, response) => {
        if (request.cookies[confParams.cookieIntranet]) {
            const { combo, empresa, area, puesto } = request.query;
            const query = "call pack_digitalizacion.sp_combos_evaluadores (:o_codigo, :o_mensaje, :o_combo, :p_combo, :p_empresa, :p_area, :p_puesto)";
            const params = [
                { name: 'o_codigo', io: 'out', type: 'number' },
                { name: 'o_mensaje', io: 'out', type: 'string' },
                { name: 'o_combo', io: 'out', type: 'cursor' },
                { name: 'p_combo', io: 'in', value: combo },
                { name: 'p_empresa', io: 'in', value: empresa },
                { name: 'p_area', io: 'in', value: area },
                { name: 'p_puesto', io: 'in', value: puesto }
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
                combo: result.o_combo
            });
        }
        else response.json({
            error: 'No tienes permisos para acceder a esta información'
        });
    }
};

module.exports = EvaluacionesController;