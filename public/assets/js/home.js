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
    form_infperso.setSkin("material");
    form_infperso.setItemValue('u_nombres', usrJson.nombre);
    form_infperso.setItemValue('u_apepat', usrJson.apepat);
    form_infperso.setItemValue('u_apemat', usrJson.apemat);
    form_infperso.setItemValue('u_fecnac', usrJson.fecnaci);
    form_infperso.checkItem('u_sexo', usrJson.sexo);
    form_infperso.setItemValue('u_mail', usrJson.mail);
    form_infperso.attachEvent('onChange', function () {
        form_infperso.setItemValue('u_apepat', form_infperso.getItemValue('u_apepat').toString().toUpperCase());
        form_infperso.setItemValue('u_nombres', form_infperso.getItemValue('u_nombres').toString().toUpperCase());
        form_infperso.setItemValue('u_apemat', form_infperso.getItemValue('u_apemat').toString().toUpperCase());
    });
    form_infperso.attachEvent("onInputChange", function (name, value, form) {
        if (value.indexOf("@") !== -1)  //devuelve -1 cuando no encuentra el valor buscado en un string
            form_infperso.setItemValue(name, form_infperso.getItemValue(name) + 'corporacionlife.com.pe');
    });
    form_infperso.attachEvent("onButtonClick", onclicFormInfo);

};

/********************Agrega el fomulario dentro del item Sidebar  'side_segu' => Seguridad */
f_side_segu = () => {
    form_seguridad = mySidebar.cells("side_segu").attachForm();
    form_seguridad.loadStruct(form_segu);
    form_seguridad.setSkin("material");
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

    var json = [{'id_form': '#eventFormperfil', datos: {'input_file': '#fphoto', 'div_content': 'file_name', 'ruta': usrJson.codigo + '/img_perfil/' + usrJson.codigo + '_profile.png', 'img_id': '#photo_img_'}},
        {'id_form': '#eventFormfondo', datos: {'input_file': '#ffondo', 'div_content': 'file_name', 'ruta': usrJson.codigo + '/img_fondo/' + usrJson.codigo + '_fondo.png', 'img_id': '#img_fondo_'}}];
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

/************Funcion onclic Formulario Info personal ************************************/
onclicFormInfo = (name) => {
    switch (name) {
        case 'fsalirw':
            myWinsPerfil.window('w_cuenta').close();
            break;
        case 'b_editc':
            (['u_nombres', 'u_apepat', 'u_apemat', 'u_fecnac', 'u_sexo', 'u_mail', 'u_mail_p', 'u_tef_c', 'u_tef_p', 'b_savec']).forEach((elem) => {
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
    var obj = {};    //{empresa, co_usuario, co_persona, co_tipo_doc, co_documento, apepat, apemat, nombres, sexo, fecnac, mailcor, mailper, celcor, celper}
    //obj['empresa']=usrJson.empresa;
    (['empresa','codigo','copersona']).forEach((elm) => { obj[elm] = usrJson.elm; });
    (['u_tipo_doc','u_documento','u_nombres', 'u_apepat', 'u_apemat', 'u_fecnac', 'u_sexo', 'u_mail', 'u_mail_p', 'u_tef_c', 'u_tef_p']).forEach((elm) => {
        obj[elm] = form_infperso.getItemValue(elm);
    });
    $.post(BASE_URL + "home/update_datos", obj, function (res) {
        console.log(res);
        if (res.state !== 'error') {
            Swal.fire('Bien!', res.message, 'success')
        } else
            Swal.fire({type: 'error', title: 'Algo salió mal...', text: 'No se pudo guardar sus Datos :' + res.message, footer: '<a href="#">Comuníquese con el area de Sistemas</a>'});
    }, "json");
};
/******************** Funcion para cerrar_Sesion se activa cuando hacen click en Popup.item.close_session  */
logout = () => {
    dhtmlx.confirm({
        ok: "Si, cerrar mi sesión",
        cancel: "No",
        text: "¿Desea cerrar la sesión? Deberá ingresar sus credenciales la próxima vez que desee acceder al sistema.",
        callback: (result) => {
            if (result) {
                localStorage.clear();
                location.href = "/";
            }
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
        Swal.fire({type: 'error', title: 'Archivo Incorrecto...', text: 'Esto no es uan imagen', footer: '<a href="#">tipos permitidos [gif, png, jpg, jpeg]</a>'});
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
    Formlogo.setItemValue('user_name', usrJson.nombre);
    Formlogo.setItemValue('name_ccostos', usrJson.ncosto);
    var p = {co_usu: usrJson.codigo};
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
        return '<p style="float:left;font-size: 20px !important;">Hola, </p><div class="title_usu">&nbsp;' + usrJson.nombre + ' ' + usrJson.apepat + ' ' + usrJson.apemat + '</div>';
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
        var winId = "win-" + id;
        if (!dhxWins.isWindow(winId)) {
            dhxWins.createWindow(winId, 0, 0, 1080, 550);
            dhxWins.window(winId).setText(mainTree.getItemText(id));
            dhxWins.window(winId).center();
            dhxWins.window(winId).attachURL("modulo/" + id);
        }
    }
    return true;
};

/***************** Function  abre una ventana del modulo filtrado en el input del Toolbar myPop2.attachEvent("onClick") => Ddhtmlx Ppoup (myPop2 ) se muestra cuando se ingrasa mas de 5 letras en el input search */
pop_inclic2 = (id) => {
    mainLayout.cells("b").collapse();
    var winId = "win-" + id;
    if (!dhxWins.isWindow(winId)) {
        dhxWins.createWindow(winId, 0, 0, 1080, 550);
        dhxWins.window(winId).setText(mainTree.getItemText(id));
        dhxWins.window(winId).center();
        dhxWins.window(winId).attachURL("modulo/" + id);
    }
};

/**************************** Function lista los medulos mediante post con el backend creando dHTMLXPopup (myPop2)  */
busca_modulos = (value) => {
    var p = {alias: usrJson.alias, empresa: usrJson.empresa, txtsearch: value};
    $.post(BASE_URL + "home/menusearch", p, function (response) {
        rpta_search = response.state;
        myPop2.clear();
        myPop2.attachList("padre,flecha,name", response.data.l_items);
    }, "json");
};
            