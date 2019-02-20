BeforeSelectDataview = (id) => {
    myToolBar.enableItem('__edit');
    var data = myDataView.get(id);
    if (data.CO_DIRECCION_EMPRESA > 0) {
        if ((data.ES_VIGENCIA).toUpperCase() === estadook) {
            myToolBar.enableItem('__anula');
            myToolBar.disableItem('__activar');
        } else {
            myToolBar.disableItem('__anula');
            myToolBar.enableItem('__activar');
        }
        (data.ST_PRINCIPAL).toUpperCase() === 'S' ? myToolBar.disableItem('__principal') : myToolBar.enableItem('__principal');
    } else {
        (['__anula', '__activar', '__edit', '__principal']).forEach((elem) => {
            myToolBar.disableItem(elem);
        });
    }
};
ontollbarclic = (id) => {
    var data = myDataView.get(myDataView.getSelected());
    switch (id) {
        case '__edit':
            Swal.fire({
                text: '¿Desea Modificar esta dirección?', type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'Si'
            }).then((result) => {
                if (result.value) {
                    if (data.CO_DIRECCION_EMPRESA > 0)
                        createFormulario(data);
                    else
                        Swal.fire({type: 'error', title: 'Ojo!...', text: 'Antes de Modificar debe seleccinar un item'});
                }
            });
            break;
        case '__anula':
            Swal.fire({
                text: '¿Desea anular esta dirección?', type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'Si'
            }).then((result) => {
                if (result.value) {
                    f_post_estado(myDataView.getSelected(), 'Retirado', myDataView, myToolBar);
                }
            });
            break;
        case '__activar':
            Swal.fire({
                text: '¿Desea activar esta dirección?', type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'Si'
            }).then((result) => {
                if (result.value) {
                    f_post_estado(myDataView.getSelected(), 'Vigente', myDataView, myToolBar);
                }
            });
            break;
        case '__principal' :
            Swal.fire({
                text: '¿Desea asignar direccion Principal a esta dirección?', type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'Si'
            }).then((result) => {
                if (result.value) {
                    f_post_estado(myDataView.getSelected(), 'Principal', myDataView, myToolBar);
                }
            });

            break;
        case '__nuevo' :
            f_post_new(myDataView, myToolBar);
            break;
        default:
            null;
            break;
    }
};

/*************** NUEVA DIRECCION **********/
f_post_new = () => {
    var Win_ = new dhtmlXWindows();
    var Winid_ = Win_.createWindow("w1", 0, 0, 520, 380);
    Win_.window("w1").hideHeader();
    Win_.window("w1").setModal(true);
    Win_.window("w1").denyResize();
    Win_.window("w1").center();
    form = Winid_.attachForm(st_form_edit);
    form.setSkin("material");
    form.hideItem('__cod');
    form.setItemValue('__cod', '0');
    nrpincipal = 'N';
    form.attachEvent("onButtonClick", (name) => {
        onbuttonclic('nuevo', name, Winid_, form, Win_.window("w1"));
    });
};
/*************** Cambia estado a los items ***********************************/
f_post_estado = (id, new_esta, dataview, tollbar) => {
    mainLayout.cells("b").progressOn();
    var p = {emp: usrJson.empresa, codigo: dataview.get(id).CO_DIRECCION_EMPRESA, vigencia: new_esta};
    $.post(BASE_URL + "MA010104/c_estado", p, function (res) {

        if (res.state !== 'error') {
            if (new_esta.toUpperCase() === 'PRINCIPAL') {
                myDataView.clearAll();
                myDataView.load(BASE_URL + 'MA010104/cargardata/' + usrJson.empresa, "json");
                myToolBar.disableItem('__principal');
            } else {
                dataview.set(id, {$selected: true, id: id, CO_DIRECCION_EMPRESA: dataview.get(id).CO_DIRECCION_EMPRESA, DE_DIRECCION: dataview.get(id).DE_DIRECCION, NUBIGEO: dataview.get(id).NUBIGEO, DE_DIRECCION_CORTA: dataview.get(id).DE_DIRECCION_CORTA,
                    NPRINCIPAL: dataview.get(id).ST_PRINCIPAL === 'S' ? 'PRINCIPAL' : ' ', CO_UBIGEO: dataview.get(id).CO_UBIGEO, ST_PROPIO: dataview.get(id).ST_PROPIO, ES_VIGENCIA: new_esta, ST_PRINCIPAL: dataview.get(id).ST_PRINCIPAL
                });
                onSelectAntes(id, dataview, tollbar, estadook);
            }
            Swal.fire('Bien!', res.message, 'success');
        } else
            Swal.fire({type: 'error', title: 'Algo salió mal...', text: 'No se pudoActualizar sus cambios  :' + res.message});
    }, "json");
    mainLayout.cells("b").progressOff();
};

createFormulario = () => {
    var W_b_orden = new dhtmlXWindows();
    var W_b_ordenid = W_b_orden.createWindow("w__", 250, 80, 520, 380);
    W_b_orden.window("w__").hideHeader();
    W_b_orden.window("w__").setModal(true);
    W_b_orden.window("w__").denyResize();
    //W_b_orden.window("w__").center();
    form = W_b_ordenid.attachForm(st_form_edit);
    form.setSkin("material");
    form.setItemValue('__cod', myDataView.get(myDataView.getSelected()).CO_DIRECCION_EMPRESA);
    form.setItemValue('__direcc', myDataView.get(myDataView.getSelected()).DE_DIRECCION);
    form.setItemValue('__nubigeo', myDataView.get(myDataView.getSelected()).NUBIGEO);
    form.setItemValue('__corta', myDataView.get(myDataView.getSelected()).DE_DIRECCION_CORTA);
    st_prin = myDataView.get(myDataView.getSelected()).ST_PRINCIPAL;
    nrpincipal = st_prin === 'S' ? 'PRINCIPAL' : ' ';
    myDataView.get(myDataView.getSelected()).ST_PROPIO === 'S' ? form.checkItem('__propio') : form.uncheckItem('__propio');
    ubigeo = myDataView.get(myDataView.getSelected()).CO_UBIGEO;
    form.attachEvent("onButtonClick", (name) => {
        onbuttonclic('update', name, W_b_ordenid, form, W_b_orden.window("w__"));
    });
};

onbuttonclic = async (accion, nam, wind, formu, winid) => {
    switch (nam) {
        case 'b_save':
            st_pro = form.isItemChecked('__propio') ? 'S' : 'N';
            winid.progressOn();
            f_post_updates(accion, formu.getItemValue('__cod'), formu.getItemValue('__direcc'), formu.getItemValue('__corta'), st_pro, ubigeo, formu.getItemValue('__nubigeo'), nrpincipal);
            winid.progressOff();
            wind.close();
            break;
        case '__buscar' :            //var W_b_respo = new dhtmlXWindows();
            var output = await IniciarGridBusqueda(4, false, mainLayout);
            if (output !== null) {
                ubigeo = output.seleccion[0].ubigeo;
                formu.setItemValue('__nubigeo', output.seleccion[0].descripcion);
            }
            break;
        default:
            wind.close();
            break;
    }
};

f_post_updates = (acci, cod, dir, cor, tpro, ubi, nubi, nprin) => {
    var p = {accion: acci, emp: usrJson.empresa, codigo: cod, direc: dir, dcorta: cor, stpropio: tpro, ubigeo: ubi};
    $.post(BASE_URL + "MA010104/update", p, function (res) {
        if (acci === 'nuevo') {
            if (res.state === 'success') {
                myDataView.clearAll();
                myDataView.load(BASE_URL + 'MA010104/cargardata/' + usrJson.empresa, "json");
            }
        } else {
            if (res.state === 'success') {
                myDataView.set(myDataView.getSelected(), {$selected: true, id: myDataView.getSelected(), CO_DIRECCION_EMPRESA: cod, DE_DIRECCION: dir, NUBIGEO: nubi, DE_DIRECCION_CORTA: cor,
                    NPRINCIPAL: nprin, CO_UBIGEO: ubi, ST_PROPIO: tpro, ES_VIGENCIA: myDataView.get(myDataView.getSelected()).ES_VIGENCIA, ST_PRINCIPAL: st_prin
                });
                onSelectAntes(myDataView.getSelected(), myDataView, myToolBar, estadook);
                Swal.fire('Bien!', res.message, 'success');
            }
        }
        if (res.state !== 'success')
            Swal.fire({type: 'error', title: 'Algo salió mal...', text: 'Error :' + res.message});
    }, "json");
};

onSelectAntes = (id, dataview, tollbar, estadook) => {
    if (dataview.get(id).CO_DIRECCION_EMPRESA >= 0) {
        tollbar.enableItem('__edit');
        if ((dataview.get(id).ES_VIGENCIA).toUpperCase() === estadook.toUpperCase()) {
            tollbar.enableItem('__anula');
            tollbar.disableItem('__activar');
        } else {
            tollbar.disableItem('__anula');
            tollbar.enableItem('__activar');
        }
        (dataview.get(id).ST_PRINCIPAL).toUpperCase() === 'S' ? tollbar.disableItem('__principal') : tollbar.enableItem('__principal');
    } else {
        (['__anula', '__activar', '__edit', '__principal']).forEach((elem) => {
            tollbar.disableItem(elem);
        });
    }
};
function style(name, value) {
    if (name === 'f_cliente')
    return "<div class='nomcliente'>" + value + "</div>";
else 
        return "<div class='s_estado'>" + value + "</div>";
}

function  photo_usu(name, value) {
    switch (name) {
        case "up_imgperfil" :
            return '<div class="photoup"><img id="emp_img_" /><form id="eventFormemp" action="" enctype="multipart/form-data" method="post"><input type="file" id="fileemp" name="upload" onchange="readURL(this);" ><p id="formp" class="classfont">Clic en la imagen o arrastre una nueva imagen</p><input id="fboton" type="submit" value="Cambiar Perfil"></form></div>';
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
            //  var id_img = selector === 'fphoto' ? 'photocharge' : 'fondocharge';
            $('#emp_img_').attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}
doOnload = () => {
    var p = {emp: JSON.parse(localStorage.getItem('usrjson')).empresa};
    $.post(BASE_URL + "MA010104/datos_empresa", p, function (res) {
        if (res.length > 0) {
            myForm.setItemValue('f_ruc', res[0].RUC);
            myForm.setItemValue('f_nombre', res[0].DE_NOMBRE);
            myForm.setItemValue('f_razsocial', res[0].DE_RAZ_SOCIAL);
            myForm.setItemValue('f_moneda', res[0].MONEDA);
            myForm.setItemValue('f_registro', res[0].FE_REGIS);
            myForm.setItemValue('f_estado', res[0].ES_VIGENCIA);
        }
    }, "json");

    $.post(BASE_URL + "MA010104/file_exist", p, function (res) {
        if (res.state !== 'error') {
            $("#emp_img_").attr("src", res.srclogo);
        } else
            Swal.fire({type: 'error', title: 'Algo salió mal...', text: 'No se pudo cargar su imagen de Perfil Error :' + res.error, footer: '<a href="#">suba una nueva imagen, si el problema continua, comuníquese con el area de Sistemas</a>'});
    }, "json");
    var json = [{'id_form': '#eventFormemp', datos: {'input_file': '#fileemp', 'div_content': 'file_name', 'ruta': 'ma010104/' + JSON.parse(localStorage.getItem('usrjson')).empresa + '/' + JSON.parse(localStorage.getItem('usrjson')).empresa + '_logo.png', 'img_id': '#emp_img_'}}];
    (json).forEach((elem) => {
        $(elem.id_form).submit(function (e) {
            e.preventDefault();
            Swal.fire({title: 'Subiendo Imagen!', html: '<h4>Un momento porfavor</h4>', timer: 0, allowOutsideClick: false, onBeforeOpen: () => {
                    Swal.showLoading();
                }});
            var fd = new FormData(); //objecto FormData para estrucutra los campos enviados en el formulario
            var file = $(elem.datos.input_file).get(0).files[0]; //console.log(file);
            fd.append(elem.datos.div_content, file, elem.datos.ruta);
            $.ajax({
                url: BASE_URL + 'MA010104/upload', data: fd, processData: false, cache: false, contentType: false, type: 'POST',
                success: function (data) { //console.log('data');
                    if (data.state !== 'success')
                        Swal.fire({type: 'error', title: 'Algo paso...', text: data.error, footer: '<a href="#">El peso maximo es 2MB</a>'});//                    dhtmlx.message({                        title: "Close",                    type: "alert-warning",                    text: "You can't close this window!",                       callback: function () {                          dhtmlx.alert("Test alert");                     }                  });
                    else
                        Swal.fire({title: 'Conforme!', text: 'Imagen subida.', type: 'success', allowOutsideClick: false, confirmButtonText: 'Ingresar al Sistema'});
                }
            }, 'json');
        });
    });
};

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
