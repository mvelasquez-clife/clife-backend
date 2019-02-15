BeforeSelectDataview = (id) => {
    myToolBar.enableItem('__edit');
    var data = myDataView.get(id);
    //console.log(data);
    if (data.CO_DIRECCION_EMPRESA > 0) {
//        cod = data.CO_DIRECCION_EMPRESA;
//        ndirecold = data.DE_DIRECCION;
//        ncorta = data.DE_DIRECCION_CORTA;
//        ubigeo = data.CO_UBIGEO;
//        estado = data.ES_VIGENCIA;
//        stprinci = data.ST_PRINCIPAL;
//        stpropio = data.ST_PROPIO;
//        nubigeo = data.NUBIGEO;
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
            if (data.CO_DIRECCION_EMPRESA > 0)
                createFormulario(data);
            else
                Swal.fire({type: 'error', title: 'Ojo!...', text: 'Antes de Modificar debe seleccinar un item'});
            break;
        case '__anula':
            f_post_estado((myDataView.get(myDataView.getSelected())).CO_DIRECCION_EMPRESA, 'Retirado');
            break;
        case '__activar':
            f_post_estado((myDataView.get(myDataView.getSelected())).CO_DIRECCION_EMPRESA, 'Vigente');
            break;
        default:
            null;
            break;
    }
};

createFormulario = () => {
    var W_b_orden = new dhtmlXWindows();
    var W_b_ordenid = W_b_orden.createWindow("w_secc", 0, 0, 520, 380);
    W_b_orden.window("w_secc").hideHeader();
    W_b_orden.window("w_secc").setModal(true);
    W_b_orden.window("w_secc").denyResize();
    W_b_orden.window("w_secc").center();
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

//    cod_respon = myDataView.get(myDataView.getSelected()).CodRespon;
    form.attachEvent("onButtonClick", (name) => {
        onbuttonclic(name, W_b_ordenid, form, W_b_orden.window("w_secc"));
    });
};

onbuttonclic = async (nam, wind, formu, winid) => {
    switch (nam) {
        case 'b_save':
            st_pro = form.isItemChecked('__propio') ? 'S' : 'N';
            winid.progressOn();
            f_post_updates(formu.getItemValue('__cod'), formu.getItemValue('__direcc'), formu.getItemValue('__corta'), st_pro, ubigeo, formu.getItemValue('__nubigeo'), nrpincipal);
            winid.progressOff();
            break;
        case '__buscar' :            //var W_b_respo = new dhtmlXWindows();
            var output = await IniciarGridBusqueda(4, false, mainLayout); console.log(output);
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
f_post_updates = (cod, dir, cor, tpro, ubi, nubi, nprin) => {
    var p = {emp: usrJson.empresa, codigo: cod, direc: dir, dcorta: cor, stpropio: tpro, ubigeo: ubi};
    $.post(BASE_URL + "MA010104/update", p, function (res) {
        console.log(res);
        if (res.state === 'success') {
            myDataView.set(myDataView.getSelected(), {$selected: true, id: myDataView.getSelected(), CO_DIRECCION_EMPRESA: cod, DE_DIRECCION: dir, NUBIGEO: nubi, DE_DIRECCION_CORTA: cor,
                NPRINCIPAL: nprin, CO_UBIGEO: ubi, ST_PROPIO: tpro, ES_VIGENCIA: myDataView.get(myDataView.getSelected()).ES_VIGENCIA, ST_PRINCIPAL: st_prin
            });
            console.log(myDataView.get(myDataView.getSelected()));
            onSelectAntes(myDataView.getSelected(), myDataView, myToolBar, estadook);
            Swal.fire('Bien!', res.message, 'success');
        } else
            Swal.fire({type: 'error', title: 'Algo salió mal...', text: 'Error :' + res.message});
    }, "json");
};
onSelectAntes = (id, dataview, tollbar, estadook) => {
    //__id = dataview.get(id).CO_DIRECCION_EMPRESA;
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
    // if (name == "f_ruc")
    return "<div class='classfont'>" + value + "</div>";
}
;
function  photo_usu(name, value) {
    switch (name) {
        case "up_imgperfil" :
            return '<div class="photoup"><img id="photocharge" /><form id="eventFormperfil" action="" enctype="multipart/form-data" method="post"><input type="file" id="fphoto" name="upload" onchange="readURL(this);" ><p id="formp" class="classfont">Clic en la imagen o arrastre una nueva imagen</p><input id="fboton" type="submit" value="Cambiar Perfil"></form></div>';
            break;
        default:
            null;
            break;
    }
}
;


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
