const express = require('express');
const LifeController = require('../controllers/intra-life.controller');
const DocumentacionController = require('../controllers/documentacion.controller');
const ProgramacionController = require('./../controllers/intra-life-evaluaciones.controller');
const EvaluacionesController = require('./../controllers/intra-life-evaluaciones.controller');

const router = express.Router();
    router.get('/', LifeController.Home);
    router.get('/login', LifeController.Login);
    router.get('/logout', LifeController.Logout);
    router.get('/documentos/:tipo', LifeController.Documentos);
    router.get('/aprobar-contratos', LifeController.AprobacionContratos);
    router.get('/contratos-aprobados', LifeController.RevisionContratos);
    router.get('/activar-cuenta', LifeController.ActivarCuenta);
    router.get('/recupera-clave', LifeController.RecuperaClave);
    router.get('/datos-personales', LifeController.DatosPersonales);
    router.get('/personal', LifeController.Personal);
    router.get('/subir-docs', LifeController.SubirDocumentos);
    router.get('/enviar-mensajes', LifeController.EnvioMensajes);
    router.get('/ver-documento/:hash', LifeController.DescargaPdf);
    router.get('/ver-iperc/:hash', LifeController.DescargaPdfIperc);
    router.get('/papeletas/nueva', LifeController.NuevaPapeleta);
    router.get('/papeletas/lista', LifeController.ListaPapeletas);
    router.get('/eventos', LifeController.Eventos);
    router.get('/reporte-acuse', LifeController.ReporteAcuse);
    router.get('/reporte-marcaciones', LifeController.ReporteMarcaciones);
    router.get('/info-equipo', LifeController.InfoEquipo);
    router.get('/pdf-reporte-acuse/:empresa/:tipodoc/:envio/:periodo/:usuario', LifeController.PdfReporteAcuse);
    router.get('/xlsx-reporte-acuse/:empresa/:tipodoc/:envio/:periodo/:usuario', LifeController.XlsxReporteAcuse);
    router.get('/xls-reporte-usuarios/:empresa', LifeController.XlsxReportePersonal);
    // activacion de usuarios
    router.post('/validar-dni', LifeController.VerificarDni);
    router.post('/registra-usuario', LifeController.RegistraUsuario);
    // control documentario
    router.get('/documentacion-tipos', LifeController.TiposDocumento);
    router.get('/documentacion-lista', LifeController.ListaMaestra);
    router.get('/documentacion-acuse', LifeController.AcuseDocumento);
    router.get('/documentacion-admin', LifeController.AdministracionPermisos);
    router.get('/documentacion-aprobar', LifeController.AprobacionDocumentos);
    // nuevo modulo de documentacion
    router.get('/documentacion', DocumentacionController.Home);
    router.get('/lista-documentos-usuario', DocumentacionController.ListaDocumentosUsuario);
    router.get('/visor-documento', DocumentacionController.VisorDocumento);
    router.get('/revision-documento-datos', DocumentacionController.RevisionDocumentoDatos);
    router.post('/documento-revision-actualiza', DocumentacionController.DocumentoRevisionActualiza);
    router.get('/aprobacion-documento-datos', DocumentacionController.AprobacionDocumentoDatos);
    router.post('/documento-aprobacion-actualiza', DocumentacionController.DocumentoAprobacionActualiza);
    router.post('/envia-correccion-pendiente', DocumentacionController.EnviaCorreccionPendiente);
    // nuevo modulo de evaluaciones
    router.get('/evaluacion-datos-cabecera', EvaluacionesController.EvaluacionDatosCabecera);
    router.post('/registra-evaluacion', EvaluacionesController.RegistraEvaluacionDocumento);
    router.get('/evaluaciones-documento', EvaluacionesController.ListaEvaluacionesDocumento);
    router.get('/evaluaciones-preguntas', EvaluacionesController.PreguntasEvaluacion);
    router.get('/lista-evaluados-evaluacion', EvaluacionesController.EvaluadosEvaluacion);
    router.get('/lista-evaluaciones-usuario', EvaluacionesController.EvaluacionesUsuario);
    router.get('/responder', EvaluacionesController.Responder);
    router.post('/comenzar-evaluacion', EvaluacionesController.ComenzarEvaluacion);
    router.post('/guarda-respuesta', EvaluacionesController.GuardaRespuesta);
    router.get('/datos-evaluacion', EvaluacionesController.DatosEvaluacion);
    router.post('/terminar-evaluacion', EvaluacionesController.FinalizarEvaluacion);
    router.get('/combo-evaluaciones', EvaluacionesController.ComboEvaluacionesDocumento);
    router.get('/lista-examenes', EvaluacionesController.CargaResultadosEvaluacion);
    router.get('/resumen-calificacion', EvaluacionesController.ResumenCalificacion);
    router.post('/calificar-examen', EvaluacionesController.CalificarExamen);
    router.get('/ver-calificacion-examen', EvaluacionesController.VerCalificacionExamen);
    router.get('/combos-evaluadores', EvaluacionesController.CombosEvaluadores);
    // vistas - modulo evaluaciones
    router.get('/evaluaciones/programar', EvaluacionesController.Programacion);
    router.get('/evaluaciones/resultados', EvaluacionesController.Resultados);
    router.get('/evaluaciones', EvaluacionesController.Evaluaciones);
    //
    router.post('/auth-login', LifeController.AuthLogin);
    router.post('/cargar-datos', LifeController.CargarDatosUsuario);
    router.post('/lista-empresas', LifeController.ListaEmpresas);
    router.post('/lista-personal', LifeController.ListaPersonal);
    router.post('/upload-personal', LifeController.UploadPersonal);
    router.post('/lista-tipos-doc', LifeController.ListaTiposDoc);
    router.post('/lista-envios', LifeController.ListaEnvios);
    router.post('/registra-cabecera-envio', LifeController.RegistraCabeceraEnvio);
    router.post('/datos-cliente', LifeController.DatosCliente);
    router.post('/cargar-pdf', LifeController.CargarPdf);
    router.post('/cargar-pdf-unsigned', LifeController.CargarPdfUnsigned);
    router.post('/enviar-mensaje', LifeController.GuardarMensaje);
    router.post('/lista-mensajes', LifeController.ListaMensajes);
    router.post('/lista-documentos', LifeController.ListaDocumentos);
    router.post('/responsable-ccosto', LifeController.ResponsableCcosto);
    router.post('/genera-papeleta', LifeController.GeneraPapeleta);
    router.post('/papeletas-solicitadas', LifeController.CargaPapeletasSolicitadas);
    router.post('/papeletas-aprobar', LifeController.CargaPapeletasAprobar);
    router.post('/datos-papeleta', LifeController.DatosPapeleta);
    router.post('/responder-papeleta', LifeController.ResponderPapeleta);
    router.post('/registra-evento', LifeController.RegistrarEvento);
    router.post('/lista-eventos', LifeController.ListaEventos);
    router.post('/carga-reporte-acuse', LifeController.CargaReporteAcuse);
    router.post('/lista-periodos', LifeController.ListaPeriodos);
    router.post('/eventos-hoy', LifeController.ListaEventosHoy);
    router.post('/lista-asistentes', LifeController.AsistentesEvento);
    router.post('/genera-qr', LifeController.CargaQrEvento);
    router.post('/send-sms', LifeController.EnviarSms);
    // edicion de usuarios
    router.get('/info-eduser', LifeController.InfoEdicionUsuario);
    router.get('/combo-puestos', LifeController.ComboPuestosPorArea);
    router.post('/confirma-edicion-usuario', LifeController.ActualizaDatosUsuario);
    //
    router.get('/prueba-email', LifeController.PruebaMail);
    router.get('/prueba-fcm', LifeController.PruebaFcm);
    router.get('/prueba-qr', LifeController.PruebaQr);
    router.get('/prueba-ftp', LifeController.PruebaFtp);
    router.get('/prueba-sms', LifeController.PruebaSms);
    // recuperacion de contraseña
    router.post('/cargar-datos-dni', LifeController.CargaDatosDni);
    router.post('/validar-pin', LifeController.ValidarPin);
    router.post('/actualizar-clave', LifeController.ActualizarClave);
    // documentos
    router.post('/registra-nuevo-tipo', LifeController.RegistraNuevoTipo);
    router.get('/lista-ctrl-tipos', LifeController.ListaCtrlTipos);
    router.post('/datos-form-rgdocumento', LifeController.DatosFormRegistroDocumento);
    router.post('/carga-correlativo', LifeController.CargaCorrelativo);
    router.post('/guarda-cabecera-documento', LifeController.GuardaCabeceraDocumento);
    router.post('/carga-lista-documentos', LifeController.CargaListaDocumentos);
    router.post('/validar-nversion-doc', LifeController.ValidarNuevaVersionDocumento);
    router.post('/registra-nversion-doc', LifeController.RegistraNuevaVersionDocumento);
    router.post('/historial-versiones-documento', LifeController.CargaHistorialVersiones);
    router.post('/validar-traspaso-doc', LifeController.ValidarTraspasoDocumento);
    router.post('/traspaso-documento', LifeController.TraspasoDocumento);
    router.post('/validar-anulacion-doc', LifeController.ValidarAnulacionDocumento);
    router.post('/anular-documento', LifeController.AnularDocumento);
    router.post('/validar-edicion-doc', LifeController.ValidarEdicionDocumento);
    router.post('/editar-doc', LifeController.EditarDocumento);
    router.get('/descarga-documento', LifeController.DescargaDocumento);
    router.post('/lista-combos', LifeController.ListaCombos);
    router.post('/acuse-documentos', LifeController.AcuseListaDocumentos);
    router.get('/descarga-documento-acuse', LifeController.DescargaDocumentoAcuse);
    router.post('/historial-vistas-documento', LifeController.CargaHistorialDocumento);
    // contratos
    router.get('/lista-anios-tipodoc', LifeController.ListaAnios);
    router.get('/lista-periodos-tipodoc', LifeController.ListaPeriodosTipodoc);
    router.get('/lista-documentos-aprobacion', LifeController.ListaDocumentosAprobacion);
    router.get('/lista-documentos-aprobados', LifeController.ListaDocumentosAprobados);
    router.get('/ver-contrato-uns/:key', LifeController.VerPdfUnsigned);
    router.post('/aprobar-contratos', LifeController.AprobarContratos);
    router.get('/lista-permisos-documento', LifeController.ListaPermisosDocumento);
    router.post('/combo-permisos-documento', LifeController.ListaUsuariosPermisoDocumento);
    router.post('/asigna-permisos-documento', LifeController.AsignarPermisosDocumento);
    router.post('/actualiza-permisos-documento', LifeController.ActualizaPermisosDocumento);
    // asistencia alv
    router.get('/asistencia-hoy', LifeController.VerificaAsistencia);
    router.post('/registra-marcacion', LifeController.RegistraMarcacion);
    router.get('/lista-marcaciones', LifeController.ListaMarcaciones);
    // apis asistencia
    router.get('/ws/asistencia-hoy', LifeController.WsVerificaAsistencia);
    router.post('/ws/registra-marcacion', LifeController.WsRegistraMarcacion);

module.exports = router;