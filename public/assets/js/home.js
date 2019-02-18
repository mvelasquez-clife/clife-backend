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

/********************Etructura del Popup*/
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
            crear_ventana();
            break;
        default:
            null;
            break;
    }
};
/********************crea una Windows al hacer click en  Popup.items.profile */
crear_ventana = () => {
    myWinsPerfil = new dhtmlXWindows();
    myWinsPerfil.createWindow({id: "w_cuenta", left: 0, top: 0, width: 700, height: 450, center: true});
    myWinsPerfil.window('w_cuenta').hideHeader();
    mySidebar = myWinsPerfil.window('w_cuenta').attachSidebar({width: 120, single_cell: false, template: "icons_text", icons_path: "assets/images/icons/iconsjhon/", items: sidebarjson});
    mySidebar.attachEvent("onBeforeSelect", function (id, lastId) {
        switch (id) {
            case 'side_infperso':
                f_side_infperso();
                break;
            case 'side_segu':
                f_side_segu();
                break;
            case 'side_person':
                f_side_personaliza();
                break;
            default:
                null;
                break;
        }
        return true;
    });
    f_side_infperso();
};

/********************Agrega el fomulario dentro del item Sidebar  'side_infperso' => Datos Personales*/
f_side_infperso = () => {
    form_infperso = mySidebar.cells("side_infperso").attachForm();
    form_infperso.loadStruct(form_cuenta);
    form_infperso.setSkin("material");   // ([]).forEach({});
    form_infperso.setItemValue('u_tipo_doc', JSON.parse(localStorage.getItem('usrjson')).tipodoc);
    form_infperso.setItemValue('u_documento', JSON.parse(localStorage.getItem('usrjson')).documento);
    form_infperso.setItemValue('u_nombres', JSON.parse(localStorage.getItem('usrjson')).nombre);
    form_infperso.setItemValue('u_apepat', JSON.parse(localStorage.getItem('usrjson')).apepat);
    form_infperso.setItemValue('u_apemat', JSON.parse(localStorage.getItem('usrjson')).apemat);
    form_infperso.setItemValue('u_fecnac', JSON.parse(localStorage.getItem('usrjson')).fecnaci);
    form_infperso.checkItem('u_sexo', JSON.parse(localStorage.getItem('usrjson')).sexo);
    form_infperso.setItemValue('u_mail', JSON.parse(localStorage.getItem('usrjson')).mailcorpo);
    form_infperso.setItemValue('u_tef_c', JSON.parse(localStorage.getItem('usrjson')).cellcorpo);
    form_infperso.setItemValue('u_mail_p', JSON.parse(localStorage.getItem('usrjson')).mailpers);
    form_infperso.setItemValue('u_tef_p', JSON.parse(localStorage.getItem('usrjson')).cellpers);
    st_edicion();
    form_infperso.attachEvent('onChange', function () { /////////////cambia a MAYUSCULAS al escribir
        form_infperso.setItemValue('u_apepat', form_infperso.getItemValue('u_apepat').toString().toUpperCase());
        form_infperso.setItemValue('u_nombres', form_infperso.getItemValue('u_nombres').toString().toUpperCase());
        form_infperso.setItemValue('u_apemat', form_infperso.getItemValue('u_apemat').toString().toUpperCase());
    });
    //  form_infperso.attachEvent("onInputChange", function (name, value, form) {
    //      if (value.indexOf("@") !== -1)  //devuelve -1 cuando no encuentra el valor buscado en un string
    //         form_infperso.setItemValue(name, form_infperso.getItemValue(name) + 'corporacionlife.com.pe');
    //  });
    form_infperso.attachEvent("onButtonClick", onclicFormInfo);

};

/********************Agrega el fomulario dentro del item Sidebar  'side_segu' => Seguridad */
f_side_segu = () => {
    form_seguridad = mySidebar.cells("side_segu").attachForm();
    form_seguridad.loadStruct(form_segu);
    form_seguridad.setSkin("material");
    form_seguridad.hideItem('u_repit_pwd');
    form_seguridad.setItemValue('u_alias', JSON.parse(localStorage.getItem('usrjson')).alias);
    form_seguridad.setItemValue('u_mail_recu', JSON.parse(localStorage.getItem('usrjson')).mailcorpo);

    form_seguridad.attachEvent("onButtonClick", onclicFormInfo);
};

/********************Agrega el fomulario dentro del item Sidebar  'side_person' => Personalizacion */
f_side_personaliza = () => {

    var form_personal = mySidebar.cells("side_person").attachForm();
    form_personal.loadStruct(form_pesonaliza);
    form_personal.setSkin("material");
    $('#photocharge').attr('src', folder_perfil);
    $('#fondocharge').attr('src', folder_fondo);
    form_personal.attachEvent("onButtonClick", onclicFormInfo);

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
};
/********************* VERIFICA ST EDICION TOTAL ************/
st_edicion = () => { // console.log(JSON.parse(localStorage.getItem('usrjson')).st_editotal);
    if (JSON.parse(localStorage.getItem('usrjson')).st_editotal === 'N') {
        (['u_nombres', 'u_apepat', 'u_tipo_doc', 'u_documento', 'u_apemat']).forEach((elem) => {
            form_infperso.disableItem(elem);
        });
    } else {
        (['u_nombres', 'u_apepat', 'u_tipo_doc', 'u_documento', 'u_apemat']).forEach((elem) => {
            form_infperso.enableItem(elem);
        });
    }
};
/************Funcion onclic Formulario Info personal ************************************/
onclicFormInfo = async (name) => {
    switch (name) {
        case 'fsalirw':
            myWinsPerfil.window('w_cuenta').close();
            break;
        case 'b_edits' :
            form_seguridad.enableItem('u_passwd');
            form_seguridad.showItem('u_repit_pwd');
            form_seguridad.enableItem('u_repit_pwd');
            break;
        case 'b_saves':
            if (form_seguridad.getItemValue('u_passwd') === form_seguridad.getItemValue('u_repit_pwd')) {
                Swal.fire({title: 'Guardando contraseña!', html: '<h4>Un momento porfavor</h4>', timer: 0, allowOutsideClick: false, onBeforeOpen: () => {
                        Swal.showLoading();
                    }});
                let promise = new Promise((resolve, rejected) => {
                    var p = {clave: form_seguridad.getItemValue('u_passwd'), emp: usrJson.empresa, user: usrJson.alias, mail: usrJson.mailcorpo};
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
            st_edicion();
            (['u_fecnac', 'u_sexo', 'u_mail', 'u_mail_p', 'u_tef_c', 'u_tef_p', 'b_savec']).forEach((elem) => {
                if (elem === 'u_sexo')
                    (['F', 'M']).forEach((val) => {
                        form_infperso.enableItem(elem, val);
                    });
                form_infperso.enableItem(elem);
            });
            break;
        case 'b_savec':
            save_infoperso();
            break;
        default:
            null;
            break;
    }
};
/******************** Guarda datos  ****************/
save_infoperso = () => {
    var obj = {};
    obj['empresa'] = JSON.parse(localStorage.getItem('usrjson')).empresa, obj['codigo'] = JSON.parse(localStorage.getItem('usrjson')).codigo, obj['copersona'] = JSON.parse(localStorage.getItem('usrjson')).copersona;
    (['u_tipo_doc', 'u_documento', 'u_nombres', 'u_apepat', 'u_apemat', 'u_fecnac', 'u_sexo', 'u_mail', 'u_mail_p', 'u_tef_c', 'u_tef_p']).forEach((elm) => {
        if (elm === 'u_fecnac')
            obj[elm] = form_infperso.getCalendar(elm).getDate(true);
        else
            obj[elm] = form_infperso.getItemValue(elm);
    });
    $.post(BASE_URL + "home/update_datos", obj, function (res) {
        if (res.state !== 'error') {
            usernvo = {"copersona": JSON.parse(localStorage.getItem('usrjson')).copersona, "alias": JSON.parse(localStorage.getItem('usrjson')).alias, "empresa": JSON.parse(localStorage.getItem('usrjson')).empresa, "codigo": JSON.parse(localStorage.getItem('usrjson')).codigo, "tipodoc": JSON.parse(localStorage.getItem('usrjson')).tipodoc,
                "nombre": form_infperso.getItemValue('u_nombres'), "sexo": form_infperso.getItemValue('u_sexo'), "fecnaci": form_infperso.getCalendar('u_fecnac').getDate(true), "stadmin": JSON.parse(localStorage.getItem('usrjson')).stadmin,
                "apemat": form_infperso.getItemValue('u_apemat'), "apepat": form_infperso.getItemValue('u_apepat'), "ccosto": JSON.parse(localStorage.getItem('usrjson')).ccosto, "stwap": JSON.parse(localStorage.getItem('usrjson')).stwap, "fregistro": JSON.parse(localStorage.getItem('usrjson')).fregistro,
                "documento": JSON.parse(localStorage.getItem('usrjson')).documento, "mailpers": form_infperso.getItemValue('u_mail_p'), "cellpers": form_infperso.getItemValue('u_tef_p'), "mailcorpo": form_infperso.getItemValue('u_mail'), "cellcorpo": form_infperso.getItemValue('u_tef_c'),
                "st_editotal": 'N'}

            localStorage.setItem('usrjson', JSON.stringify(usernvo));
            Swal.fire('Bien!', res.message, 'success');
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
        if (!dhxWinmain.isWindow(winId)) {
            dhxWinmain.createWindow(winId, 0, 0, 1080, 550);
            dhxWinmain.window(winId).setText(mainTree.getItemText(id));
            dhxWinmain.window(winId).center();
            dhxWinmain.window(winId).attachURL("modulo/" + id);
        }
    }
    return true;
};

/***************** Function  abre una ventana del modulo filtrado en el input del Toolbar myPop2.attachEvent("onClick") => Ddhtmlx Ppoup (myPop2 ) se muestra cuando se ingrasa mas de 5 letras en el input search */
pop_inclic2 = (id) => {
    mainLayout.cells("b").collapse();
    var winId = "win-" + id;
    if (!dhxWinmain.isWindow(winId)) {
        dhxWinmain.createWindow(winId, 0, 0, 1080, 550);
        dhxWinmain.window(winId).setText(mainTree.getItemText(id));
        dhxWinmain.window(winId).center();
        dhxWinmain.window(winId).attachURL("modulo/" + id);
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
            