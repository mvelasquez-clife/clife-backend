const express = require('express');
const router = express.Router();

const LifeController = require('../controllers/intra-life.controller');
    router.get('/', LifeController.Home);
    router.get('/login', LifeController.Login);
    router.get('/logout', LifeController.Logout);
    router.get('/documentos/:tipo', LifeController.Documentos);
    router.get('/activar-cuenta', LifeController.ActivarCuenta);
    router.get('/recupera-clave', LifeController.RecuperaClave);
    router.get('/datos-personales', LifeController.DatosPersonales);
    router.get('/personal', LifeController.Personal);
    router.get('/subir-docs', LifeController.SubirDocumentos);
    router.get('/enviar-mensajes', LifeController.EnvioMensajes);
    router.get('/ver-documento/:hash', LifeController.DescargaPdf);
    router.get('/papeletas/nueva', LifeController.NuevaPapeleta);
    router.get('/papeletas/lista', LifeController.ListaPapeletas);
    router.get('/eventos', LifeController.Eventos);
    router.get('/reporte-acuse', LifeController.ReporteAcuse);
    router.get('/info-equipo', LifeController.InfoEquipo);
    router.get('/pdf-reporte-acuse/:empresa/:tipodoc/:envio/:periodo/:usuario', LifeController.PdfReporteAcuse);
    router.get('/xlsx-reporte-acuse/:empresa/:tipodoc/:envio/:periodo/:usuario', LifeController.XlsxReporteAcuse);
    router.get('/xls-reporte-usuarios/:empresa', LifeController.XlsxReportePersonal);
    // activacion de usuarios
    router.post('/validar-dni', LifeController.VerificarDni);
    router.post('/registra-usuario', LifeController.RegistraUsuario);
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

module.exports = router;