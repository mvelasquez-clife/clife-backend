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

function carga_estructura_pop() {
    myPop.attachList("name", [
        {id: 'profile', name: "<div id='list_usu' >Cuenta</div>"},
        myPop.separator,
        {id: 'messages', name: "<div id='list_usu' >Mensajes</div>"},
        {id: 'notifications', name: "<div id='list_usu' >Notificaciones</div>"},
        myPop.separator, // use this struct for separator
        {id: 'close_session', name: "<div id='list_usu_close' >Cerrar Sesión</div>"}
    ]);
}

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
crear_ventana = () => {
    var myWins = new dhtmlXWindows();
    var confwin = myWins.createWindow({id: "w_cuenta", left: 0, top: 0, width: 700, height: 450, center: true});
    myWins.window('w_cuenta').hideHeader();
    mySidebar = myWins.window('w_cuenta').attachSidebar({width: 120, template: "icons_text", icons_path: "assets/images/icons/iconsjhon/", items: sidebarjson});
    mySidebar.attachEvent("onSelect", function (id, lastId) {
        switch (id) {
            case 'side_infperso':
                f_side_infperso();
                break;
            case 'side_segu':
                //f_side_segu();
                break;
            case 'side_person':
                //f_side_person();
                break;
            default:

                break;
        }
    });
    f_side_infperso();
};
f_side_infperso = () => {
    var form_infperso = mySidebar.cells("side_infperso").attachForm();
    form_infperso.loadStruct(form_cuenta);
    form_infperso.setSkin("material");
    form_infperso.setItemValue('u_nombres', usrJson.nombre);
    form_infperso.setItemValue('u_apepat', usrJson.apepat);
    form_infperso.setItemValue('u_apemat', usrJson.apemat);
    form_infperso.setItemValue('u_fecnac', usrJson.fecnaci);
    form_infperso.checkItem('u_sexo', usrJson.de_sexo);
    console.log( usrJson);
    /*jquery animacion form*/
    $('#eventForm').submit(function (e) {
        e.preventDefault();
        var fd = new FormData(this);
        $.ajax({
            url: BASE_URL + 'home/upload', data: fd, processData: false, contentType: false, type: 'POST',
            success: function (data) {
                console.log(data);
            }
        });
    });
    /*fin jquery animacion form*/
};
function readURL(input) { //funcion carga imagen al seleccionar
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#photocharge').attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}
f_side_segu = () => {
    var form_infperso = mySidebar.cells("side_infperso").attachForm();
    form_infperso.loadStruct(form_cuenta);
};
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
function  photo_usu(name, value) {
    if (name === "user_photo")
        return '<div id ="photo_usu"><img id="photo_img_"  ></div>';
}

doOnload = () => {
    Formlogo.setItemValue('user_name', usrJson.nombre);
    Formlogo.setItemValue('name_ccostos', usrJson.ncosto);

    var p = {co_usu: usrJson.codigo, tipo: 'profile', name: usrJson.codigo + '_profile.png'};
    $.post(BASE_URL + "home/file_exist", p, function (response) {
        $("#photo_img_").attr("src", response.folder);
    }, "json");
};
function   name_usu(name, value) {
    if (name === "user_name")
        return "<div class='user_name'>" + value + "</div>";
    if (name === "name_label")
        return "<div class='name_label'>" + value + "</div>";
    if (name === "name_ccostos")
        return "<div class='name_ccostos'>" + value + "</div>";
}

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
}

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
carga_moduloonclick = (id) => {

}
busca_modulos = (value) => {
    var p = {alias: usrJson.alias, empresa: usrJson.empresa, txtsearch: value};
    $.post(BASE_URL + "home/menusearch", p, function (response) {
        rpta_search = response.state;
        myPop2.clear();
        myPop2.attachList("padre,flecha,name", response.data.l_items);
    }, "json");
};
            