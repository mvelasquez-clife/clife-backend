onselect_sidebar = (id, lastId) => {
    __id = 0;
    switch (id) {
        case 's_sede':
            f_s_sede();
            break;
        case 's_departa':
            f_s_departa();
            break;
        case 's_seccio':
            f_s_seccio();
            break;
        case 's_oficina' :
            f_s_oficina();
            break;
        default:
            null;
            break;
    }
    return true;
};

f_s_sede = () => {
    var myLaouy_Sede = mySidebar.cells("s_sede").attachLayout('1C');
    myLaouy_Sede.cells("a").hideHeader();    // myLaouy_Sede.cells("b").hideHeader();
    myToolbarsede = myLaouy_Sede.cells("a").attachToolbar(base_tollbar);
    myToolbarsede.setIconSize(48);
    myToolbarsede.attachEvent("onClick", (id) => {
        ontollbarclic(id, myDataViewsede);
    });   // form_s_sede = myLaouy_Sede.cells("b").attachForm(st_form_s_sede);     form_s_sede.setSkin("material");
    myLaouy_Sede.cells("a").attachHTMLString('<div id="data_conten"></div>');
    myLaouy_Sede.setSeparatorSize(0, 0);
    myLaouy_Sede.setSeparatorSize(1, 0);
    myDataViewsede = new dhtmlXDataView(struc_dataview);
    myLaouy_Sede.cells("a").progressOn();
    myDataViewsede.load(BASE_URL + 'MA010601/cargarsede/' + usrJson.empresa, "json");
    myLaouy_Sede.cells("a").progressOff();
    myDataViewsede.attachEvent("onBeforeEditStart", (id) => {
        onEditAntes(id, myDataViewsede);
    });
    myDataViewsede.attachEvent("onEditKeyPress", (code) => {
        onEdit(code, myDataViewsede, 'sede', Codigo, Estado, Nombreold, __id);
    });
    myDataViewsede.attachEvent("onAfterEditStop", (id) => {
        Nombrenew = myDataViewsede.get(id).Nombre;
    });
    myDataViewsede.attachEvent("onBeforeSelect", (id) => {
        onSelectAntes(id, myDataViewsede, myToolbarsede, estadook);
        return true;
    });
};

f_s_departa = () => {
    var myLaouy_departa = mySidebar.cells("s_departa").attachLayout('1C');
    myLaouy_departa.cells("a").hideHeader(); //    myLaouy_departa.cells("b").hideHeader();
    myLaouy_departa.setSeparatorSize(0, 0);
    myLaouy_departa.setSeparatorSize(1, 0);
    myLaouy_departa.cells("a").attachHTMLString('<div id="data_conten"></div>'); //    form_s_departa = myLaouy_departa.cells("b").attachForm(st_form_s_departa);    form_s_departa.setSkin("material");
    myToolbardeparta = myLaouy_departa.cells("a").attachToolbar(base_tollbar);
    myToolbardeparta.setIconSize(48);
    myToolbardeparta.attachEvent("onClick", (id) => {
        ontollbarclic(id, myDataViewdepar);
    }); //se uso la funcion interna para no usar muchos codigo.
    mySidebar.cells("s_departa").progressOn();
    myDataViewdepar = new dhtmlXDataView(struc_dataview);
    myDataViewdepar.load(BASE_URL + 'MA010601/cargardepar/' + usrJson.empresa, "json");
    mySidebar.cells("s_departa").progressOff();
    myDataViewdepar.attachEvent("onBeforeEditStart", (id) => {
        onEditAntes(id, myDataViewdepar);
    });
    myDataViewdepar.attachEvent("onEditKeyPress", (code) => {
        onEdit(code, myDataViewdepar, 'depa', Codigo, Estado, Nombreold, __id);
    });
    myDataViewdepar.attachEvent("onAfterEditStop", (id) => {
        Nombrenew = myDataViewdepar.get(id).Nombre;
    });
    myDataViewdepar.attachEvent("onBeforeSelect", (id) => {
        onSelectAntes(id, myDataViewdepar, myToolbardeparta, estadook);
        return true;
    });
};

ontollbarclic = (id, dataview) => {
    switch (id) {
        case '__edit':
            if (__id > 0)
                dataview.edit(dataview.getSelected());
            else
                Swal.fire({type: 'error', title: 'Ojol...', text: 'Antes de Modificar debe seleccinar un item'});
            break;
        default:
            null;
            break;
    }
};
/****************** Verificar el Codigo = __id  sea mayor a CERO. y se activa los botones del Tollbar *******************/
onSelectAntes = (id, dataview, tollbar, estadook) => {
    __id = dataview.get(id).Codigo;
    if (__id > 0) {
        tollbar.enableItem('__edit');
        if (dataview.get(id).Vigencia === estadook) {
            tollbar.enableItem('__anula');
            tollbar.disableItem('__activar');
        } else {
            tollbar.disableItem('__anula');
            tollbar.enableItem('__activar');
        }
    } else {
        (['__anula', '__activar', '__edit']).forEach((elem) => {
            tollbar.disableItem(elem);
        });
    }
};
/******************  Capturo los Valores Iniciales  *******************/
onEditAntes = (id, dataview) => {
    if (dataview.get(id).Codigo > 0) {
        Codigo = dataview.get(id).Codigo;
        Nombreold = dataview.get(id).Nombre;
        Estado = dataview.get(id).Vigencia;
    }
};
/******************  Con ENTER se confirma o cancela la edicion. Si es correcto se envia al bakend, caso contrario se carga los valores iniciales  *******************/
onEdit = (key, dataview, tipo, cod, vigen, namold, ids) => {
    if (key === 13) {
        dataview.stopEdit();
        Swal.fire({
            title: '<strong><u>Confirma el cambio</u></strong>',
            type: 'info', html: 'Nuevo nombre :<b>' + Nombrenew + '</b>,</br> Anterior : <b>' + namold + '</br>',
            showCloseButton: true, showCancelButton: true, focusConfirm: false,
            confirmButtonText: '<i class="fa fa-thumbs-up"></i> Aceptar!',
            cancelButtonText: '<i class="fa fa-thumbs-down"></i>'
        }).then((result) => {
            if (result.value) {
                f_post_update(tipo, cod, Nombrenew, vigen);
            } else {
                dataview.set(dataview.getSelected(), {$selected: true, id: dataview.getSelected(), Nombre: namold, Codigo: cod, Vigencia: vigen});
            }

        });
    }
    return true;
};
/******************  Enviados valores para su modificacion en la bbdd. POST  *******************/
f_post_update = (tipo, cod, nom, esta) => {
    var p = {emp: usrJson.empresa, codigo: cod, nombre: nom, vigencia: esta, tipo: tipo};
    $.post(BASE_URL + "MA010601/upsede-dep", p, function (res) {
        if (res.state !== 'error') {
            Swal.fire('Bien!', res.message, 'success')
        } else
            Swal.fire({type: 'error', title: 'Algo salió mal...', text: 'No se pudo cargar su imagen de Perfil Error :' + res.error, footer: '<a href="#">suba una nueva imagen, si el problema continua, comuníquese con el area de Sistemas</a>'});
    }, "json");
};




f_s_seccio = () => {
    var myLaouy_seccio = mySidebar.cells("s_seccio").attachLayout('1C');
    myLaouy_seccio.cells("a").hideHeader(); //    myLaouy_seccio.cells("b").hideHeader();     form_s_seccio = myLaouy_seccio.cells("b").attachForm(st_form_s_seccio);     form_s_seccio.setSkin("material");
    myToolbarseccio = myLaouy_seccio.cells("a").attachToolbar(base_tollbar);//    myToolbarsede.disableItem("sede_activar"); 
    myToolbarseccio.setIconSize(48);
    myLaouy_seccio.cells("a").attachHTMLString('<div id="data_conten"></div>');
    myDataViewdsecci = new dhtmlXDataView({container: "data_conten", drag: false, select: true, type: {template: "<p class='centrarpdiv' >#Nombre#</p>", height: 60}, autowidth: true});
    myDataViewdsecci.load(BASE_URL + 'MA010601/cargarsecc/' + usrJson.empresa, "json");
//    myDataViewdsecci.attachEvent("onBeforeSelect", function (id) { //                        console.log('select acti  de DW:FASE' + id);
//        console.log(myDataViewdsecci.get(id).Codigo);
//    });
    myToolbarseccio.attachEvent("onClick", (id) => {
        ontollbarclic_form(id, myDataViewdsecci);
    });
    myDataViewdsecci.attachEvent("onBeforeSelect", (id) => {
        onSelectAntesSecc(id, myDataViewdsecci, myToolbarseccio, estadook);
        return true;
    });

    /*   var W_b_orden = new dhtmlXWindows();
     var W_b_ordenid = W_b_orden.createWindow("w_b_orden", 0, 0, 1200, 540);
     // W_b_orden.window("w_b_orden").hideHeader();
     W_b_orden.window("w_b_orden").setModal(true);
     W_b_orden.window("w_b_orden").denyResize();
     W_b_orden.window("w_b_orden").center();
     W_b_ordenid.setText("Busque una Orden de Producción");*/

};
f_s_oficina = () => {
    var myLaouy_ofic = mySidebar.cells("s_oficina").attachLayout('2U');
    myLaouy_ofic.cells("a").hideHeader();
    myLaouy_ofic.cells("b").hideHeader();
    form_s_oficina = myLaouy_ofic.cells("b").attachForm(st_form_s_oficina);

    form_s_oficina.setSkin("material");
    myToolbarofici = myLaouy_ofic.cells("a").attachToolbar(base_tollbar);
//    myToolbarsede.disableItem("sede_activar"); 
    myToolbarofici.setIconSize(48);
    myLaouy_ofic.cells("a").attachHTMLString('<div id="data_conten"></div>');

    var myDataViewdofici = new dhtmlXDataView({container: "data_conten", drag: false, select: true, type: {template: "<p class='centrarpdiv' >#Nombre#</p>", height: 60}, autowidth: true});
    myDataViewdofici.load(BASE_URL + 'MA010601/cargarofi/' + usrJson.empresa, "json");
    myDataViewdofici.attachEvent("onBeforeSelect", function (id) { //                        console.log('select acti  de DW:FASE' + id);
        console.log(myDataViewdofici.get(id).Codigo);
    });

};

onSelectAntesSecc = (id, dataview, tollbar, estadook) => {
    __id = dataview.get(id).Codigo;
    if (__id > 0) {
        tollbar.enableItem('__edit');
        if (dataview.get(id).Vigencia === estadook) {
            tollbar.enableItem('__anula');
            tollbar.disableItem('__activar');
        } else {
            tollbar.disableItem('__anula');
            tollbar.enableItem('__activar');
        }

    } else {
        (['__anula', '__activar', '__edit']).forEach((elem) => {
            tollbar.disableItem(elem);
        });
    }
};

ontollbarclic_form = (id, dataview) => {
    switch (id) {
        case '__edit':
            createFormulario(dataview);
            break;
        default:
            null;
            break;
    }
};

createFormulario = (dataview, form) => {
    var W_b_orden = new dhtmlXWindows();
    var W_b_ordenid = W_b_orden.createWindow("w_secc", 0, 0, 700, 400);
    //W_b_orden.window("w_b_orden").hideHeader();
    W_b_orden.window("w_secc").setModal(true);
    W_b_orden.window("w_secc").denyResize();
    W_b_orden.window("w_secc").center();
    form = W_b_ordenid.attachForm(st_form_base);
    form.setSkin("material");
    console.log(dataview.get(dataview.getSelected()));
    form.setItemValue('__codigo', dataview.get(dataview.getSelected()).Codigo);
    form.setItemValue('__nombres', dataview.get(dataview.getSelected()).Nombre);
    form.setItemValue('__nombres', dataview.get(dataview.getSelected()).Nombre);
};