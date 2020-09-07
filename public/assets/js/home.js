/********************Estructura del Obcject Claendar para el idioma  español 
 * Agregar a la Vista     dhtmlXCalendarObject.prototype.lang = "pe";
 * */
dhtmlXCalendarObject.prototype.langData["pe"] = {
    dateformat: '%d-%m-%Y',
    monthesFNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    monthesSNames: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    daysFNames: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado"],
    daysSNames: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
    weekstart: 1,
    weekname: "w",
    today: "Hoy",
    clear: "Borrar"
};
/*******************************/
carga_nuevo_usuario = () => {
    Swal.fire({
        title: 'Hola, ' + usrJson.alias,
        text: 'Te damos la bienvenida a nuestra Plataforma virtual CLIFE CLOUD, a continuación ingrese sus datos personales para poder continuar, por favor...',
        width: 500,
    });
    crear_ventana(formini, 700, 500, 0);
};


/********************Etructura del Popup*/
var winChat, isMaximized = false;
function carga_estructura_pop(Pop) {
    Pop.attachList("name", [
        {id: 'profile', name: "<div id='list_usu' >Cuenta</div>"},
        Pop.separator,
        {id: 'messages', name: "<div id='list_usu' >Mensajes</div>"},
        {id: 'notifications', name: "<div id='list_usu' >Notificaciones</div>"},
        Pop.separator, // use this struct for separator
        {id: 'close_session', name: "<div id='list_usu_close' >Cerrar Sesión</div>"}
    ]);
}
/********************Funcion  del vento  "onClick"  de Popup */
pop_inclic = (id) => {
    switch (id) {
        case 'close_session':
            logout();
            break;
        case 'profile':
            crear_ventana(form_infperso, 700, 450, 1);
            break;
        default:
            null;
            break;
    }
};
/********************crea una Windows al hacer click en  Popup.items.profile */
crear_ventana = (form, width, height, stado) => {
    myWinsPerfil = new dhtmlXWindows();
    myWinsPerfil.createWindow({id: "w_cuenta", left: 0, top: 0, width: width, height: height, center: true});
    myWinsPerfil.window('w_cuenta').hideHeader();
    mySidebar = myWinsPerfil.window('w_cuenta').attachSidebar({width: 120, single_cell: false, template: "icons_text", icons_path: "assets/images/icons/iconsjhon/", items: sidebarjson});
    mySidebar.attachEvent("onSelect", function (id, lastId) {
        switch (id) {
            case 'side_infperso':
                f_side_infperso('', stado);
                break;
            case 'side_segu':
                f_side_segu('', stado);
                break;
            case 'side_person': console.log('form_personal');
                f_side_personaliza('', stado);
                break;
            default:
                null;
                break;
        }
        return true;
    });
    f_side_infperso(form, stado);
};

/********************Agrega el fomulario dentro del item Sidebar  'side_infperso' => Datos Personales*/
f_side_infperso = (form, st) => {
    form = mySidebar.cells("side_infperso").attachForm();
    form.loadStruct(form_cuenta);
    form.setSkin("material");   // ([]).forEach({});
    form.setItemValue('u_tipo_doc', JSON.parse(localStorage.getItem('usrjson')).tipodoc);
    form.setItemValue('u_documento', JSON.parse(localStorage.getItem('usrjson')).documento);
    form.setItemValue('u_nombres', JSON.parse(localStorage.getItem('usrjson')).nombre);
    form.setItemValue('u_apepat', JSON.parse(localStorage.getItem('usrjson')).apepat);
    form.setItemValue('u_apemat', JSON.parse(localStorage.getItem('usrjson')).apemat);
    form.setItemValue('u_fecnac', JSON.parse(localStorage.getItem('usrjson')).fecnaci);
    form.checkItem('u_sexo', JSON.parse(localStorage.getItem('usrjson')).sexo);
    form.setItemValue('u_mail', JSON.parse(localStorage.getItem('usrjson')).mailcorpo);
    form.setItemValue('u_tef_c', JSON.parse(localStorage.getItem('usrjson')).cellcorpo);
    form.setItemValue('u_mail_p', JSON.parse(localStorage.getItem('usrjson')).mailpers);
    form.setItemValue('u_tef_p', JSON.parse(localStorage.getItem('usrjson')).cellpers);
    st_edicion(form,st);
    if (st == 0) {
        console.log('S');
        form.hideItem('b_editc');
        form.showItem('b_salirc');
        form.enableItem('b_savec');
        // form.disableItem('u_tipo_doc');
        (['u_fecnac', 'u_tef_c', 'u_tef_p', 'u_mail', 'u_mail_p', 'u_sexo']).forEach((elem) => {
            if (elem === 'u_sexo') {
                form.enableItem(elem, 'M');
                form.enableItem(elem, 'F');
            } else {
                form.enableItem(elem);
            }
        });
    }
    form.attachEvent('onChange', function () { /////////////cambia a MAYUSCULAS al escribir
        form.setItemValue('u_apepat', form.getItemValue('u_apepat').toString().toUpperCase());
        form.setItemValue('u_nombres', form.getItemValue('u_nombres').toString().toUpperCase());
        form.setItemValue('u_apemat', form.getItemValue('u_apemat').toString().toUpperCase());
    });
    //  form_infperso.attachEvent("onInputChange", function (name, value, form) {
    //      if (value.indexOf("@") !== -1)  //devuelve -1 cuando no encuentra el valor buscado en un string
    //         form_infperso.setItemValue(name, form_infperso.getItemValue(name) + 'corporacionlife.com.pe');
    //  });
    form.attachEvent("onInputChange", function (name, value, form) {
        if (value.length === 8 && name === 'u_documento' && form.getItemValue('u_tipo_doc') === '1') {
            Swal.fire({title: 'Validando DNI ingresado!', allowEscapeKey: false, html: '<h4>Permitanos completar sus datos, Un momento porfavor</h4>', timer: 0, allowOutsideClick: false, onBeforeOpen: () => {
                    Swal.showLoading();
                }});
            var p = {dni: form.getItemValue('u_documento'),tipo : form.getItemValue('u_tipo_doc')};
            $.post(BASE_URL + "home/buscadni", p, function (res) {   
                if ((res.value).search('|') > 0){ 
                    let value = res.value.split('|');
                    form.setItemValue('u_apepat', value[0]);
                    form.setItemValue('u_apemat', value[1]);
                    form.setItemValue('u_nombres', value[2]);
                }
                Swal.close();
            }, "json");

        }
    });
    form.attachEvent("onButtonClick", (name) => {
        onclicFormInfo(name, form, st)
    });

};

/********************Agrega el fomulario dentro del item Sidebar  'side_segu' => Seguridad */
f_side_segu = (form, st) => {
    form = mySidebar.cells("side_segu").attachForm();
    form.loadStruct(form_segu);
    form.setSkin("material");
    form.hideItem('u_repit_pwd');
    form.setItemValue('u_alias', JSON.parse(localStorage.getItem('usrjson')).alias);
    form.setItemValue('u_mail_recu', JSON.parse(localStorage.getItem('usrjson')).mailcorpo);

    form.attachEvent("onButtonClick", (name) => {
        onclicFormInfo(name, form)
    });
};

/********************Agrega el fomulario dentro del item Sidebar  'side_person' => Personalizacion */
f_side_personaliza = (form, st) => {
    form = mySidebar.cells("side_person").attachForm();
    form.loadStruct(form_pesonaliza);
    form.setSkin("material");
    $('#photocharge').attr('src', folder_perfil);
    $('#fondocharge').attr('src', folder_fondo);
    var json = [{'id_form': '#eventFormperfil', datos: {'input_file': '#fphoto', 'div_content': 'file_name', 'ruta': JSON.parse(localStorage.getItem('usrjson')).codigo + '/img_perfil/' + JSON.parse(localStorage.getItem('usrjson')).codigo + '_profile.png', 'img_id': '#photo_img_'}},
        {'id_form': '#eventFormfondo', datos: {'input_file': '#ffondo', 'div_content': 'file_name', 'ruta': JSON.parse(localStorage.getItem('usrjson')).codigo + '/img_fondo/' + JSON.parse(localStorage.getItem('usrjson')).codigo + '_fondo.png', 'img_id': '#img_fondo_'}}];
    (json).forEach((elem) => {
        $(elem.id_form).submit(function (e) {
            e.preventDefault();
            var fd = new FormData(); //objecto FormData para estrucutra los campos enviados en el formulario
            var file = $(elem.datos.input_file).get(0).files[0];
            fd.append(elem.datos.div_content, file, elem.datos.ruta);
            $.ajax({
                url: BASE_URL + 'home/upload', data: fd, processData: false, cache: false, contentType: false, type: 'POST',
                success: function (data) {
                    if (data.state === 'success') {
                        if (elem.datos.img_id === '#img_fondo_')
                            $("#img_fondo_").css("background", 'url("' + data.src + '?' + new Date().getTime() + '")  no-repeat center'); //   $(elem.datos.img_id).css("background-image", 'url("' + data.src + '")');
                        else
                            $(elem.datos.img_id).attr('src', data.src + '?' + new Date().getTime());//por defecto Ajax actualiza <img> meduante GET y las guarda en cache. para poder ser actualizada una imagen se envia parametro adicional  => + '?' + new Date().getTime()
                    } else
                        Swal.fire({type: 'error', title: 'Algo paso...', text: data.error, footer: '<a href="#">El peso maximo es 2MB</a>'});//                    dhtmlx.message({                        title: "Close",                    type: "alert-warning",                    text: "You can't close this window!",                       callback: function () {                          dhtmlx.alert("Test alert");                     }                  });
                }
            }, 'json');
        });
    });
    form.attachEvent("onButtonClick", (name) => {
        onclicFormInfo(name, form)
    });
};
/********************* VERIFICA ST EDICION TOTAL ************/
st_edicion = (form,st) => { // console.log(JSON.parse(localStorage.getItem('usrjson')).st_editotal);
    if (JSON.parse(localStorage.getItem('usrjson')).st_editotal === 'N') {
        (['u_nombres', 'u_apepat', 'u_tipo_doc', 'u_documento', 'u_apemat']).forEach((elem) => {
            form.disableItem(elem);
        });
    } else {
        (['u_nombres', 'u_apepat', 'u_tipo_doc', 'u_documento', 'u_apemat']).forEach((elem) => {
            form.enableItem(elem);
        });
    }
};
/************Funcion onclic Formulario Info personal ************************************/
onclicFormInfo = async (name, form, st) => {
    switch (name) {
        case 'b_salirc':
            logout();
            break;
        case 'fsalirw': 
            myWinsPerfil.window('w_cuenta').close();
            break;
        case 'b_edits' :
            form.enableItem('u_passwd');
            form.showItem('u_repit_pwd');
            form.enableItem('u_repit_pwd');
            break;
        case 'b_saves':
            if (form.getItemValue('u_passwd') === form.getItemValue('u_repit_pwd')) {
                Swal.fire({title: 'Guardando contraseña!', html: '<h4>Un momento porfavor</h4>', timer: 0, allowOutsideClick: false, onBeforeOpen: () => {
                        Swal.showLoading();
                    }});
                let promise = new Promise((resolve, rejected) => {
                    var p = {clave: form.getItemValue('u_passwd'), emp: usrJson.empresa, user: usrJson.alias, mail: usrJson.mailcorpo};
                    $.post(BASE_URL + "auth/savepassword", p, function (res) {
                        return   resolve(res);
                    }, "json");
                });
                let result = await                 promise;
                switch (result.state) {
                    case 'success':
                        Swal.close();
                        Swal.fire({title: 'Conforme!', text: result.message, type: 'success'});
                        break;
                    default:
                        Swal.close();
                        Swal.fire({type: 'error', title: 'Error inesperado...', text: 'Intente mas tarde, porfavor, Si el problema persiste comunicarse con el area de Sistemas'});
                        break;
                }
            } else
                Swal.fire({type: 'error', title: 'Incorrecto...', text: 'Porfavor, las contraseñas deben ser iguales...'});
            break;
        case 'b_editc':
            st_edicion(form,st);
            (['u_fecnac', 'u_sexo', 'u_mail', 'u_mail_p', 'u_tef_c', 'u_tef_p', 'b_savec']).forEach((elem) => {
                if (elem === 'u_sexo')
                    (['F', 'M']).forEach((val) => {
                        form.enableItem(elem, val);
                    });
                form.enableItem(elem);
            });
            break;
        case 'b_savec':
            save_infoperso(form, st);

            break;
        default:
            null;
            break;
    }
};
/******************** Guarda datos  ****************/
save_infoperso = (form, st) => {
    Swal.fire({title: 'Guardando sus datos!', allowEscapeKey: false, html: '<h4>Un momento porfavor</h4>', timer: 0, allowOutsideClick: false, onBeforeOpen: () => {
            Swal.showLoading();
        }});
    var obj = {};
    obj['empresa'] = JSON.parse(localStorage.getItem('usrjson')).empresa, obj['codigo'] = JSON.parse(localStorage.getItem('usrjson')).codigo, obj['copersona'] = JSON.parse(localStorage.getItem('usrjson')).copersona;
    (['u_tipo_doc', 'u_documento', 'u_nombres', 'u_apepat', 'u_apemat', 'u_fecnac', 'u_sexo', 'u_mail', 'u_mail_p', 'u_tef_c', 'u_tef_p']).forEach((elm) => {
        if (elm === 'u_fecnac')
            obj[elm] = form.getCalendar(elm).getDate(true);
        else
            obj[elm] = form.getItemValue(elm);
    });
    $.post(BASE_URL + "home/update_datos", obj, function (res) {
        if (res.state !== 'error') {
            usernvo = {"copersona": res.coperson, "alias": JSON.parse(localStorage.getItem('usrjson')).alias, "empresa": JSON.parse(localStorage.getItem('usrjson')).empresa, "codigo": JSON.parse(localStorage.getItem('usrjson')).codigo, "tipodoc": JSON.parse(localStorage.getItem('usrjson')).tipodoc,
                "nombre": form.getItemValue('u_nombres'), "sexo": form.getItemValue('u_sexo'), "fecnaci": form.getCalendar('u_fecnac').getDate(true), "stadmin": JSON.parse(localStorage.getItem('usrjson')).stadmin,
                "apemat": form.getItemValue('u_apemat'), "apepat": form.getItemValue('u_apepat'), "ccosto": JSON.parse(localStorage.getItem('usrjson')).ccosto, "stwap": JSON.parse(localStorage.getItem('usrjson')).stwap, "fregistro": JSON.parse(localStorage.getItem('usrjson')).fregistro,
                "documento": form.getItemValue('u_documento'), "mailpers": form.getItemValue('u_mail_p'), "cellpers": form.getItemValue('u_tef_p'), "mailcorpo": form.getItemValue('u_mail'), "cellcorpo": form.getItemValue('u_tef_c'),
                "st_editotal": 'N'}
            localStorage.setItem('usrjson', JSON.stringify(usernvo));
            usrJson = JSON.parse(localStorage.getItem('usrjson')) || '';
            Swal.close();
            st = res.coperson;
            Swal.fire('Bien!', res.message, 'success').then((result) => { 
                if (result.value) {
                    if (st > 0) {
                        location.href = '/';
                    }
                }
            });
        } else
            Swal.fire({type: 'error', title: 'Algo salió mal...', text: 'No se pudo guardar sus Datos :' + res.message, footer: '<a href="#">Comuníquese con el area de Sistemas</a>'});
    }, "json");
};
/******************** Funcion para cerrar_Sesion se activa cuando hacen click en Popup.item.close_session  */
logout = () => {
    Swal.fire({
        title: 'Cerrar Sesión', type: 'info', allowOutsideClick: false, confirmButtonText: 'Aceptar', showCancelButton: true, cancelButtonText: 'Cancelar', html: '<h4>Deberá ingresar sus datos la próxima vez que ingrese al sistema.</h4>'
    }).then((result) => {
        if (result.value) {
            localStorage.clear(), location.href = "/";
        }
    });
};

/******************** Funcion manejador de plantillas para DhtmlxForm  
 * agreda Etiqueta  Div>img para mostrar el profile en el menu principal. => return '<div  id ="photo_usu"><img id="photo_img_"  ></div>'; 
 * agrega Etiqueta DIV>img>form para la subida de imagen en el Sidebar Personalizacion => '<div class="photoup"><img id="photocharge" /><form id="eventForm" action="" enctype="multipart/form-data" method="post"><input type="file" id="fphoto.............
 *         */
function  photo_usu(name, value) {
    switch (name) {
        case "user_photo":
            return '<div  id ="photo_usu"><img id="photo_img_"  ></div>';
            break;
        case "up_imgperfil" :
            return '<div class="photoup"><img id="photocharge" /><form id="eventFormperfil" action="" enctype="multipart/form-data" method="post"><input type="file" id="fphoto" name="upload" onchange="readURL(this);" ><p id="formp" class="classfont">Clic en la imagen o arrastre una nueva imagen</p><input id="fboton" type="submit" value="Cambiar Perfil"></form></div>';
            break;
        case "up_imgfondo":
            return '<div class="fondoup"><img id="fondocharge" /><form id="eventFormfondo" action="" enctype="multipart/form-data" method="post"><input type="file" id="ffondo" name="upload" onchange="readURL(this);" ><p id="formpf" class="classfont">Clic en la imagen o arrastre una nueva imagen</p><input id="fbotonf" type="submit" value="Cambiar Fondo"></form></div>';
            break;
        default:
            null;
            break;
    }
}

/******************** Funcion  readURL() se activa cuando onchange="readURL(this);" del form>input - file => verifica que la imagen subida sea type=imagen, ademas actualiza la imagen del fomulario    */
function readURL(input) { //funcion carga imagen al seleccionar
    var selector = input.id;
    var ext_file = $('#' + selector).val().split('.').pop().toLowerCase();
    if ($.inArray(ext_file, ['gif', 'png', 'jpg', 'jpeg']) == -1)
        Swal.fire({type: 'error', title: 'Archivo Incorrecto...', text: 'Esto no es una imagen', footer: '<a href="#">*** Tipos permitidos [gif, png, jpg, jpeg]</a>'});
    else
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var id_img = selector === 'fphoto' ? 'photocharge' : 'fondocharge';
            $('#' + id_img).attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

/******************** Se activa al leer la estructura (NOMBRES  , CENTRO DE COSTO) del Form = Formlogo  en el Menu Principal*/
doOnload = () => {
    Formlogo.setItemValue('user_name', JSON.parse(localStorage.getItem('usrjson')).nombre);
    Formlogo.setItemValue('name_ccostos', JSON.parse(localStorage.getItem('usrjson')).ncosto);
    var p = {co_usu: JSON.parse(localStorage.getItem('usrjson')).codigo};
    $.post(BASE_URL + "home/file_exist", p, function (res) {
        if (res.state !== 'error') {
            folder_perfil = res.srcperfil;
            folder_fondo = res.srcfondo;
            $("#photo_img_").attr("src", res.srcperfil);
            $("#img_fondo_").css("background", 'url("' + res.srcfondo + '") no-repeat center'); // $("#img_fondo_").attr("src", res.srcfondo);
            setTimeout(function () {
                $('.loader-container').addClass('done');
                $('.progress').addClass('done');
            }, 1000);
        } else
            Swal.fire({type: 'error', title: 'Algo salió mal...', text: 'No se pudo cargar su imagen de Perfil Error :' + res.error, footer: '<a href="#">suba una nueva imagen, si el problema continua, comuníquese con el area de Sistemas</a>'});
    }, "json");
};

/******************** Formato de plantilla para modificar los  items.template de DHTMLXFORM */
function   name_usu(name, value) {
    if (name === "user_name")
        return "<div class='user_name'>" + value + "</div>";
    if (name === "name_label")
        return "<div class='name_label'>" + value + "</div>";
    if (name === "name_ccostos")
        return "<div class='name_ccostos'>" + value + "</div>";
    if (name === 'title_usu')
        return '<p style="float:left;font-size: 20px !important;">Hola, </p><div class="title_usu">&nbsp;' + JSON.parse(localStorage.getItem('usrjson')).nombre + ' ' + JSON.parse(localStorage.getItem('usrjson')).apepat + ' ' + JSON.parse(localStorage.getItem('usrjson')).apemat + '</div>';
}

/******************** Funcion   attachEvent("onkeyup" ) en el input del Tollbar para buscar modulos.*/
inpu_onKeyup = (name, value) => {
    var obj = document.getElementById(name);
    if (value.length > 4) {
        if (myPop2) {
            busca_modulos(value);
        }
        var x = window.dhx4.absLeft(obj); // returns left position related to window
        var y = window.dhx4.absTop(obj); // returns top position related to window
        var w = obj.offsetWidth;
        var h = obj.offsetHeight;
        myPop2.show(x, y, w, h);
    } else {
        if (myPop2) {
            myPop2.clear();
            myPop2.attachList("name", [{id: 1, name: "Ingrese minimo 5 caracteres..."}]);
        }
    }
};

/*********************** Function muestra un Popup al posicionar el puntero en el Input de busqueda */
toolbaronfocus = (obj) => {
    if (myPop2) {
        myPop2.clear();
        myPop2.attachList("name", [{id: 1, name: "Ingrese minimo 5 caracteres..."}]);
        var x = window.dhx4.absLeft(obj); // returns left position related to window
        var y = window.dhx4.absTop(obj); // returns top position related to window
        var w = obj.offsetWidth;
        var h = obj.offsetHeight;
        myPop2.show(x, y, w, h);
    }
};



/**************************** Fujncion par los botones del Toolbar attachEvent("onClick") (b_hidemenu)  (b_mail) (Profile) */
toolbar_onclic = (name) => {
    switch (name) {
        case 'b_hidemenu':
            var state = mainLayout.cells("b").isCollapsed();
            state === true ? mainLayout.cells("b").expand() : mainLayout.cells("b").collapse();
            break;
        case 'b_mail' :
            window.open('https://mail.corporacionlife.com.pe', '_blank');
            break;
        default:
            null;
            break;
    }
}

/************************ Function para abrir con doble clic los elementos del menu principal  mainTree.attachEvent('onDblClick')*/
mainTreeOnDblClick = (id) => {
    if (!mainTree.hasChildren(id)) {
        mainLayout.cells("b").collapse();
        winId = "win-" + id;
        let replicaId = mainTree.getAttribute(id,'replica');
        if (!dhxWinmain.isWindow(winId)) {
            dhxWinmain.createWindow(winId, 0, 0, 1080, 550);
            dhxWinmain.window(winId).setText(mainTree.getItemText(id));
            dhxWinmain.window(winId).center();
            dhxWinmain.window(winId).attachURL("modulo/" + id + (replicaId ? ('/' + replicaId) : ''));
        }
    }
    return true;
};

/***************** Function  abre una ventana del modulo filtrado en el input del Toolbar myPop2.attachEvent("onClick") => Ddhtmlx Ppoup (myPop2 ) se muestra cuando se ingrasa mas de 5 letras en el input search */
pop_inclic2 = (id) => {    
    var selecmenu = myPop2.getItemData(id);
    mainLayout.cells("b").collapse();
    var winId = "win-" + selecmenu.id;
    if (!dhxWinmain.isWindow(winId)) {
        dhxWinmain.createWindow(winId, 0, 0, 1080, 550);
        dhxWinmain.window(winId).setText(selecmenu.name);
        dhxWinmain.window(winId).center();
        dhxWinmain.window(winId).attachURL("modulo/" + selecmenu.id);
    }
};

/**************************** Function lista los medulos mediante post con el backend creando dHTMLXPopup (myPop2)  */
busca_modulos = (value) => {
    var p = {alias: JSON.parse(localStorage.getItem('usrjson')).alias, empresa: JSON.parse(localStorage.getItem('usrjson')).empresa, txtsearch: value};
    $.post(BASE_URL + "home/menusearch", p, function (response) {
        rpta_search = response.state;
        myPop2.clear();
        myPop2.attachList("padre,flecha,name", response.data.l_items);
    }, "json");
};
//integración con el chat
AbrirChat = () => {
    winChatId = 'winChat';
    if(!dhxWinmain.isWindow(winChatId)) {
        winChat = dhxWinmain.createWindow(winChatId, 0, 0, 480, 640);
        winChat.setText('CloudChat v1.0');
        PosicionarWinChat();
        winChat.attachURL('/chat');
        winChat.denyMove();
        winChat.denyResize();
        winChat.attachEvent('onParkUp', (w) => {
            isMaximized = false;
            PosicionarWinChat();
        });
        winChat.attachEvent('onParkDown', (w) => {
            isMaximized = true;
            PosicionarWinChat();
        })
    }
}
PosicionarWinChat = () => {
    if(dhxWinmain.isWindow('winChat')) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        if(isMaximized) {
            winChat.setPosition(width - 480, height - 640);
        }
        else {
            winChat.setPosition(width - 480, height - 30);
        }
    }
}
const socket = io('http://192.168.11.138:3001',{
    query: {
        codigo: usrJson.codigo,
        empresa: usrJson.empresa
    }
});
socket.on('message', function (data) {
    if(!isMaximized) {
        dhtmlx.message({
            text: '<span style="font-weight:bold;">Nuevo mensaje de ' + (data.from.name ? data.from.name : data.from.id) + '</span><br>[' + (new Date()).toISOString().split('T')[0] + '] <span style="font-style:italic;">' + data.message + '</span>',
            expire: 10000
        })
    }
});