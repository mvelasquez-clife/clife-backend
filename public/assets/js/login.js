
async function valida_token(tok) {
    Swal.fire({
        title: 'Validando token de seguridad!', html: '<h4>Un momento porfavor</h4>', timer: 0, allowOutsideClick: false, onBeforeOpen: () => {
            Swal.showLoading();
        }
    });
    let promise = new Promise((resolve, rejected) => {
        var p = {token: tok};
        $.post(BASE_URL + "auth/validatetoken", p, function (res) {
            return   resolve(res);
        }, "json");
    });
    let result = await promise;
    setTimeout(() => {
        switch (result.state) {
            case 'success':
                mailenv = result.response.mail;
                if (result.res.length === 1) {
                    (result.res).forEach((val) => {
                        $("#selcusuario").append(new Option(val.DE_ALIAS, val.CO_EMPRESA_USUARIO, true, false));
                    });
                    $("#selecdiv").hide();
                } else {
                    (result.res).forEach((val) => {
                        $("#selcusuario").append(new Option(val.DE_ALIAS, val.CO_EMPRESA_USUARIO));
                    });
                }
                Swal.close();
                Swal.fire({type: 'success', title: ' <font style="font-size: 0.7em;">Hola, <b>' + result.response.user + '</b> a  continuación ingresa tu nueva contraseña.</font>', text: result.message, allowOutsideClick: false, confirmButtonText: 'Aceptar'}).then((result) => {
                    if (result.value) {
                        setTimeout(() => {
                            $("#overlay").fadeOut(500, 'swing');
                        }, 500);
                    }
                });
                break;
            default:
                Swal.close();
                Swal.fire({type: 'warning', title: 'Token inválido...', text: result.message, allowOutsideClick: false, confirmButtonText: 'Aceptar'}).then((result) => {
                    if (result.value) {
                        setTimeout(() => {
                            location.href = "/";
                        }, 1000);
                    }
                });
                break;
        }
    }, 1000);
}

async function save_recuperacion(event) {
    event.preventDefault();
    Swal.fire({title: 'Guardando contraseña!', html: '<h4>Un momento porfavor</h4>', timer: 0, allowOutsideClick: false, onBeforeOpen: () => {
            Swal.showLoading();
        }});
    let promise = new Promise((resolve, rejected) => {
        var p = {clave: $("#nclave").val(), emp: $("#selcusuario").val(), user: $("#selcusuario option:selected").text(), mail: mailenv};
        $.post(BASE_URL + "auth/savepassword", p, function (res) {
            return   resolve(res);
        }, "json");
    });
    let result = await promise;
    switch (result.state) {
        case 'success':
            Swal.close();
            Swal.fire({title: 'Conforme!', text: result.message, type: 'success', allowOutsideClick: false, confirmButtonText: 'Ingresar al Sistema'}).then((result) => {
                if (result.value) {
                    location.href = "/";
                }
            });
            break;
        case 'nomail':
            Swal.close();
            Swal.fire({type: 'error', title: 'Verifique su correo corporativo!', text: result.message});
            break;
        default:
            Swal.close();
            Swal.fire({type: 'error', title: 'Error inesperado...', text: 'Intente mas tarde, porfavor, Si el problema persiste comunicarse con el area de Sistemas'});
            break;
    }

}


function FormLoginOnSubmit() {
    var p = {usuario: document.getElementById("usuario").value, clave: document.getElementById("clave").value};
    $.post(BASE_URL + "auth/login", p, function (response) {
        resultado = response.state;
        if (response.state == "success") {
            localStorage.setItem('jwt', response.data.token);
            localStorage.setItem('usrjson', JSON.stringify(response.data.usuario));
            location.reload();
        } else {
            Swal.fire({type: 'error', title: 'Verifica tu contreaseña </br>', text: response.message});
        }
    }, "json");
}


async function  MailRecorder(e) {
    e.preventDefault();
    Swal.fire({title: 'Enviando Correo de recuperación!...', html: '<h4>Un momento porfavor</h4>', timer: 0, allowOutsideClick: false, onBeforeOpen: () => {
            Swal.showLoading();
        }});
    let promise = new Promise((resolve, rejected) => {
        var p = {mail: document.getElementById("mailrecorder").value};
        $.post(BASE_URL + "auth/sendmailforgot", p, function (res) {
            return   resolve(res);
        }, "json");
    });

    let result = await promise;

    switch (result.state) {
        case 'success':
            Swal.close();
            Swal.fire({title: 'Ya casi terminamos!', html: result.message, type: 'success', allowOutsideClick: false, confirmButtonText: 'Aceptar'}).then((result) => {
                if (result.value) {
                    setTimeout(() => {
                        location.href = "/";
                    }, 1000);
                }
            });
            break;
        case 'nomail':
            Swal.close();
            Swal.fire({type: 'error', title: 'Verifique su correo corporativo!', html: result.message, footer: '*** Actualice su correo presencialmente en el Área de Sistemas'});
            break;
        default:
            Swal.close();
            Swal.fire({type: 'error', title: 'Error inesperado...', html: 'Intento mas tarde, porfavor, Si el problema persiste comunicarse con el area de Sistemas  => ' + result.err});
            break;
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