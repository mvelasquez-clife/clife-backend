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
    myLaouy_Sede.cells("a").hideHeader();
    myToolbarsede = myLaouy_Sede.cells("a").attachToolbar(base_tollbar);
    myToolbarsede.setIconSize(48);
    myToolbarsede.attachEvent("onClick", (id) => {
        ontollbarclic('sede', id, myDataViewsede, Codigo, Nombreold, myToolbarsede);
    });
    myLaouy_Sede.cells("a").attachHTMLString('<div id="data_conten"></div>');
    myLaouy_Sede.setSeparatorSize(0, 0);
    myLaouy_Sede.setSeparatorSize(1, 0);
    myDataViewsede = new dhtmlXDataView(struc_dataview);
    myLaouy_Sede.cells("a").progressOn();
    myDataViewsede.load(BASE_URL + 'MA010601/cargarsede/' + usrJson.empresa, "json");
    myLaouy_Sede.cells("a").progressOff();
//    myDataViewsede.attachEvent("onBeforeEditStart", (id) => {
//        onEditAntes(id, myDataViewsede);
//    });
    myDataViewsede.attachEvent("onEditKeyPress", (code) => {
        onEdit(code, myDataViewsede, 'sede', Codigo, Estado, Nombreold, myToolbarsede);
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
        ontollbarclic('depa', id, myDataViewdepar, Codigo, Nombreold, myToolbardeparta);
    });
    myLaouy_departa.cells("a").progressOn();
    myDataViewdepar = new dhtmlXDataView(struc_dataview);
    myDataViewdepar.load(BASE_URL + 'MA010601/cargardepar/' + usrJson.empresa, "json");
    myLaouy_departa.cells("a").progressOff();

    myDataViewdepar.attachEvent("onEditKeyPress", (code) => {
        onEdit(code, myDataViewdepar, 'depa', Codigo, Estado, Nombreold, myToolbardeparta);
    });
    myDataViewdepar.attachEvent("onAfterEditStop", (id) => {
        Nombrenew = myDataViewdepar.get(id).Nombre;
    });
    myDataViewdepar.attachEvent("onBeforeSelect", (id) => {
        onSelectAntes(id, myDataViewdepar, myToolbardeparta, estadook);
        return true;
    });
};

ontollbarclic = (tipo, id, dataview, cod, nom, tollbar) => {
    switch (id) {
        case '__edit':
            if (__id > 0)
                dataview.edit(dataview.getSelected());
            else
                Swal.fire({type: 'error', title: 'Ojo!...', text: 'Antes de Modificar debe seleccinar un item'});
            break;
        case '__anula':
            f_post_estado(tipo, cod, 'Retirado', dataview, nom, tollbar);
            break;
        case '__activar':
            f_post_estado(tipo, cod, 'Vigente', dataview, nom, tollbar);
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
        Codigo = dataview.get(id).Codigo;
        Nombreold = dataview.get(id).Nombre;
        Estado = dataview.get(id).Vigencia;
        tollbar.enableItem('__edit');
        if ((dataview.get(id).Vigencia).toUpperCase() === estadook.toUpperCase()) {
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

/******************  Con ENTER se confirma o cancela la edicion. Si es correcto se envia al bakend, caso contrario se carga los valores iniciales  *******************/
onEdit = (key, dataview, tipo, cod, vigen, namold, tollbar) => {
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
                onSelectAntes(id, dataview, tollbar, estadook);
            }

        });
    }
    return true;
};
/******************  Enviados valores para su modificacion en la bbdd. POST  *******************/
f_post_update = (tipo, cod, nom, esta) => {
    var p = {emp: usrJson.empresa, codigo: cod, nombre: nom, vigencia: esta, tipo: tipo};
    $.post(BASE_URL + "MA010601/upsede-dep", p, function (res) {
        if (res.state === 'success') {
            Swal.fire('Bien!', res.message, 'success')
        } else
            Swal.fire({type: 'error', title: 'Algo salió mal...', text: res.message});
    }, "json");
};

/*************** Cambia estado a los items ***********************************/
f_post_estado = (tipo, cod, new_esta, dataview, nom, tollbar) => {
    var p;
    if (tipo === 'sede' || tipo === 'depa') {
        p = {emp: usrJson.empresa, codigo: dataview.get(dataview.getSelected()).Codigo, vigencia: new_esta, tipo: tipo};
    } else {
        p = {emp: usrJson.empresa, codigo: dataview.get(dataview.getSelected()).Codigo, vigencia: new_esta, tipo: tipo};
    }

    $.post(BASE_URL + "MA010601/c_estado", p, function (res) {
        if (res.state !== 'error') {
            Swal.fire('Bien!', res.message, 'success');
            if (tipo === 'sede' || tipo === 'depa') {
                dataview.set(dataview.getSelected(), {$selected: true, id: dataview.getSelected(), Nombre: nom, Codigo: cod, Vigencia: new_esta});
                onSelectAntes(dataview.getSelected(), dataview, tollbar, estadook);
            } else {
                dataview.set(dataview.getSelected(), {$selected: true, id: dataview.getSelected(), Nombre: dataview.get(dataview.getSelected()).Nombre, CodDepa: dataview.get(dataview.getSelected()).CodDepa,
                    CodSede: dataview.get(dataview.getSelected()).CodSede, Codigo: dataview.get(dataview.getSelected()).Codigo, Vigencia: new_esta, NomRespon: dataview.get(dataview.getSelected()).NomRespon, CodRespon: dataview.get(dataview.getSelected()).CodRespon});
                onSelectAntesSecc(dataview.getSelected(), dataview, tollbar, estadook);
            }
        } else
            Swal.fire({type: 'error', title: 'Algo salió mal...', text: 'No se pudo cargar su imagen de Perfil Error :' + res.error, footer: '<a href="#">suba una nueva imagen, si el problema continua, comuníquese con el area de Sistemas</a>'});
    }, "json");
};

f_s_seccio = () => {
    var myLaouy_seccio = mySidebar.cells("s_seccio").attachLayout('1C');
    myLaouy_seccio.cells("a").hideHeader();
    myToolbarseccio = myLaouy_seccio.cells("a").attachToolbar(base_tollbar);//    myToolbarsede.disableItem("sede_activar"); 
    myToolbarseccio.setIconSize(48);
    myLaouy_seccio.cells("a").attachHTMLString('<div id="data_conten"></div>');
    myDataViewdsecci = new dhtmlXDataView({container: "data_conten", drag: false, select: true, type: {template: "<p class='centrarpdiv' >#Nombre#</p>", height: 60}, autowidth: true});
    myLaouy_seccio.cells("a").progressOn();
    myDataViewdsecci.load(BASE_URL + 'MA010601/cargarsecc/' + usrJson.empresa, "json");
    myLaouy_seccio.cells("a").progressOff();
    myToolbarseccio.attachEvent("onClick", (id) => {
        ontollbarclic_form('seccion', id, myDataViewdsecci, myToolbarseccio);
    });
    myDataViewdsecci.attachEvent("onBeforeSelect", (id) => {
        onSelectAntesSecc(id, myDataViewdsecci, myToolbarseccio, estadook);
        return true;
    });
};

f_s_oficina = () => {
    var myLaouy_ofic = mySidebar.cells("s_oficina").attachLayout('1C');
    myLaouy_ofic.cells("a").hideHeader();
    myToolbarofici = myLaouy_ofic.cells("a").attachToolbar(base_tollbar);
    myToolbarofici.setIconSize(48);
    myLaouy_ofic.cells("a").attachHTMLString('<div id="data_conten"></div>');
    myDataViewdofici = new dhtmlXDataView({container: "data_conten", drag: false, select: true, type: {template: "<p class='centrarpdiv' >#Nombre#</p>", height: 60}, autowidth: true});
    myLaouy_ofic.cells("a").progressOn();
    myDataViewdofici.load(BASE_URL + 'MA010601/cargarofi/' + usrJson.empresa, "json");
    myLaouy_ofic.cells("a").progressOff();
    myToolbarofici.attachEvent("onClick", (id) => {
        ontollbarclic_form('oficina', id, myDataViewdofici, myToolbarofici);
    });
    myDataViewdofici.attachEvent("onBeforeSelect", (id) => {
        onSelectAntesSecc(id, myDataViewdofici, myToolbarofici, estadook);
        return true;
    });
};

onSelectAntesSecc = (id, dataview, tollbar, estadook) => {
    __id = dataview.get(id).Codigo;
    if (__id >= 0) {
        tollbar.enableItem('__edit');
        if ((dataview.get(id).Vigencia).toUpperCase() === estadook.toUpperCase()) {
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

ontollbarclic_form = (tipo, id, dataview, tollbar, cod, nom) => {
    switch (id) {
        case '__edit':
            createFormulario(tipo, dataview, tollbar);
            break;
        case '__anula':
            f_post_estado(tipo, cod, 'Retirado', dataview, nom, tollbar);
            break;
        case '__activar':
            f_post_estado(tipo, cod, 'Vigente', dataview, nom, tollbar);
            break;
        default:
            null;
            break;
    }
};

createFormulario = (tipo, dataview, tollbar) => {
    var W_b_orden = new dhtmlXWindows();
    var W_b_ordenid = W_b_orden.createWindow("w_secc", 0, 0, 500, 350);
    W_b_orden.window("w_secc").hideHeader();
    W_b_orden.window("w_secc").setModal(true);
    W_b_orden.window("w_secc").denyResize();
    W_b_orden.window("w_secc").center();
    form = W_b_ordenid.attachForm(st_form_base);
    form.setSkin("material");
    form.setItemValue('__codigo', dataview.get(dataview.getSelected()).Codigo);
    form.setItemValue('__nombres', dataview.get(dataview.getSelected()).Nombre);
    form.setItemValue('__depacod', dataview.get(dataview.getSelected()).CodDepa);
    form.setItemValue('__sedecod', dataview.get(dataview.getSelected()).CodSede);
    form.setItemValue('__estado', (dataview.get(dataview.getSelected()).Vigencia));
    form.setItemValue('__nrespon', dataview.get(dataview.getSelected()).NomRespon);
    cod_respon = dataview.get(dataview.getSelected()).CodRespon;
    form.attachEvent("onButtonClick", (name) => {
        onbuttonclic(tipo, name, form, dataview, W_b_ordenid, tollbar);
    });
};

onbuttonclic = async (tipo, nam, formu, dataview, wind, tollbar) => {
    switch (nam) {
        case 'b_save':
            f_post_updates(tipo, formu.getItemValue('__codigo'), formu.getItemValue('__nombres'), formu.getItemValue('__depacod'), formu.getItemValue('__sedecod'), formu.getItemValue('__estado'), formu.getItemValue('__nrespon'), cod_respon, dataview, tollbar);
            break;
        case '__buscar' :
            var W_b_respo = new dhtmlXWindows();
            var output = await IniciarGridBusqueda(2, false, W_b_respo);
            cod_respon = output.seleccion[0].codigo;
            formu.setItemValue('__nrespon', output.seleccion[0].nombre);
            break;
        default:
            wind.close();
            break;
    }

};

f_post_updates = (tipo, cod, nom, depa, sede, esta, nrespo, respons, dataview, tollbar) => {
    var p = {emp: usrJson.empresa, codigo: cod, nombre: nom, vigencia: esta, tipo: tipo, coddepa: depa, codsede: sede, respon: respons};
    $.post(BASE_URL + "MA010601/upsecc-ofic", p, function (res) {
        if (res.state === 'success') {
            dataview.set(dataview.getSelected(), {$selected: true, id: dataview.getSelected(), Nombre: nom, CodDepa: depa, CodSede: sede, Codigo: cod, Vigencia: esta, NomRespon: nrespo, CodRespon: respons});
            onSelectAntesSecc(dataview.getSelected(), dataview, tollbar, estadook);
            Swal.fire('Bien!', res.message, 'success');
        } else
            Swal.fire({type: 'error', title: 'Algo salió mal...', text: 'Error :' + res.messsage});
    }, "json");
};