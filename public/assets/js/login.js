//const sendmail = require('sendmail')({
//    smtpHost:'mail.corporacionlife.com.pe',
//    smtpPort: 465
//});
//const nodemailer = require("nodemailer");



//$("form-olvidar").collapse('hide');
function FormLoginOnSubmit(event) {
    event.preventDefault();
    var p = {
        usuario: document.getElementById("usuario").value,
        clave: document.getElementById("clave").value
    };
    $.post(BASE_URL + "auth/login", p, function (response) {

        if (response.state == "success") {
            localStorage.setItem('jwt', response.data.token);
            localStorage.setItem('usrjson', JSON.stringify(response.data.usuario));
            location.reload();
        } else {
            dhtmlx.alert({
                title: "Ups!!.. algo salio mal",
                type: "alert-error",
                text: response.err
            });
        }
    }, "json");
}
//async function MailRecorder() {
//
//    // Generate test SMTP service account from ethereal.email
//    // Only needed if you don't have a real mail account for testing
//    //let account = await nodemailer.createTestAccount();
//
//    // create reusable transporter object using the default SMTP transport
//    let transporter = nodemailer.createTransport({
//        host: "mail.corporacionlife.com.pe",
//        port: 465,
//        secure: true, // true for 465, false for other ports
//        auth: {
//            user: "jtipismana@corporacionlife.com.pe", // generated ethereal user
//            pass: "25jesus254" // generated ethereal password
//        }
//    });
//
//    // setup email data with unicode symbols
//    let mailOptions = {
//        from: 'jtipismana@corporacionlife.com.pe>', // sender address
//        to: "jtipismana.rodicar@gmail.com", // list of receivers
//        subject: "Hello Mundo", // Subject line
//        text: "Hello world?", // plain text body
//        html: "<b>Hello world?</b>" // html body
//    };
//
//    // send mail with defined transport object
//    let info = await transporter.sendMail(mailOptions)
// location.reload();
//    console.log("Message sent: %s", info.messageId);
//    // Preview only available when sending through an Ethereal account
//    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//
//    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
//    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
//}

//MailRecorder().catch(console.error);
//onbuttonclic = async (tipo, nam, formu, dataview, wind, tollbar) => {
//    switch (nam) {
//        case 'b_save':
//            f_post_updates(tipo, formu.getItemValue('__codigo'), formu.getItemValue('__nombres'), formu.getItemValue('__depacod'), formu.getItemValue('__sedecod'), formu.getItemValue('__estado'), formu.getItemValue('__nrespon'), cod_respon, dataview, tollbar);
//            break;
//        case '__buscar' :
//            var W_b_respo = new dhtmlXWindows();
//            var output = await IniciarGridBusqueda(2, false, W_b_respo);
//            cod_respon = output.seleccion[0].codigo;
//            formu.setItemValue('__nrespon', output.seleccion[0].nombre);
//            break;
//        default:
//            wind.close();
//            break;
//    }
//
//};


async function  MailRecorder(e) {
    e.preventDefault();
    let timerInterval;
    Swal.fire({
        title: 'Enviando Correo de recuperación!',
        html: '<h3>Un momento porfavor</h3>',
        timer: 0,
        onBeforeOpen: () => {
            Swal.showLoading();
        }
    });
    let promise = new Promise((resolve, reject) => {
        var p = {
            mail: document.getElementById("mailrecorder").value
        };

        $.post(BASE_URL + "auth/sendmailforgot", p, function (res) {
//
                console.log(res);
            // return res;
//            if (res.state === 'success') {
                resolve(res);
//            Swal.fire('Enviado!!!', res.message, 'success');
//            location.href = "inicio";
//            } else {
//                reject(res);
////            Swal.fire({type: 'error', title: 'Algo salió mal...', text: 'No se pudo enviar el correo de recuperación :' + res.message, footer: '<a href="#">Intentelo nuevamente o verifique su correo.</a>'});
//            }
        }, "json");
    });
    try {
        let result = await promise;
    } catch (e) {
        console.log(e);
    }

    //console.log(p);

        if (result.state === 'success') {
            Swal.getContent().querySelector('h3').textContent = 'Correo Enviado...';
            timerInterval = setInterval(() => {
                clearInterval(timerInterval);
                location.href = "/";
            }, 2000);
     
    } else {
        console.log('error');
        clearInterval(timerInterval);
        Swal.fire({
            type: 'error',
            title: 'Error inesperado...',
            text: 'Intento mas tarde, porfavor...'
        });
    }


}



(function ($) {
    "use strict";


    /*==================================================================
     [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit', function () {
        var check = true;

        for (var i = 0; i < input.length; i++) {
            if (validate(input[i]) == false) {
                showValidate(input[i]);
                check = false;
            }
        }

        return check;
    });


    $('.validate-form .input100').each(function () {
        $(this).focus(function () {
            hideValidate(this);
        });
    });

    function validate(input) {
        if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        } else {
            if ($(input).val().trim() == '') {
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }

    /*==================================================================
     [ Show pass ]*/
    var showPass = 0;
    $('.btn-show-pass').on('click', function () {
        if (showPass == 0) {
            $(this).next('input').attr('type', 'text');
            $(this).find('i').removeClass('fa-eye');
            $(this).find('i').addClass('fa-eye-slash');
            showPass = 1;
        } else {
            $(this).next('input').attr('type', 'password');
            $(this).find('i').removeClass('fa-eye-slash');
            $(this).find('i').addClass('fa-eye');
            showPass = 0;
        }

    });


})(jQuery);