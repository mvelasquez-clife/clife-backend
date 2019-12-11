IniciarComponentes = () => {
    Layout = new dhtmlXLayoutObject(document.body, '1C');
    Layout.cells('a').hideHeader();
    carga_grilla_tiponego();
}


carga_grilla_tiponego = ()=>{
    GridTipoNego = Layout.cells('a').attachGrid();
    GridTipoNego.setIconsPath('/assets/images/icons/grid/');
    GridTipoNego.setHeader('Codigo,Nombre,Descripcion,Imp.Minimo,Estado,Cuota,Editar,Estado');
    GridTipoNego.setInitWidthsP('10,25,30,10,10,5,5,5');
    GridTipoNego.setColTypes('rotxt,rotxt,rotxt,ron,rotxt,img,img,img');
    GridTipoNego.setColAlign('left,left,left,right,center,center,center,center');
    GridTipoNego.setNumberFormat('0,000.00',3);
    GridTipoNego.init();
    Layout.cells('a').progressOn();
    GridTipoNego.load(BASE_URL + 'VT010102/gridtiponego'); 
    GridTipoNego.attachEvent('onRowSelect',GridTipoNegoOnRowSelect);
    Layout.cells('a').progressOff();
    _txtgrid(GridTipoNego, 4);

}


function _txtgrid(grid, column) {
    grid.attachEvent("onDataReady", function () {
        var ids = grid.getAllRowIds();
        var parte = ids.split(",");
        for (var i = 0; i < parte.length; i++) {
            switch (grid.cells(parte[i], column).getValue()) {
                case 'Vigente':
                    grid.setCellTextStyle(parte[i], "text-decoration: none;");
                    break;
                case 'Retirado':
                    grid.setRowTextStyle(parte[i], "text-decoration: line-through;color : red;");
                    break;
                default:
                    grid.setRowTextStyle(parte[i], " text-decoration: red underline overline wavy;");
                    break;
            }
        }
    });
}
GridTipoNegoOnRowSelect = (rowId, colId) => {//console.log(rowId, colId);
    cod_s =  GridTipoNego.cells(rowId,0).getValue(),   nom_s =  GridTipoNego.cells(rowId,1).getValue(), des_s =  GridTipoNego.cells(rowId,2).getValue(),     imp_s =  GridTipoNego.cells(rowId,3).getValue(),  est_s =  GridTipoNego.cells(rowId,4).getValue();
    // let ntipnego = GridTipoNego.cells(rowId,1).getValue();
    switch(colId){
        case 5 : mant_cuotatn(nom_s);break;
        case 6 : editar_tn(nom_s); break;
        case 7 : retirar_activar(); break;
    }
    
}

function editar_tn(nomtn) {
    dhxW12 = new dhtmlXWindows();
    WindowCouta = dhxW12.createWindow('w_edit',0,0,310,270);
    WindowCouta.center();
    WindowCouta.setText('Editando ' + nomtn);
    WindowCouta.setModal(true);
    WindowCouta.keepInViewport(true);
    let Layout1 = WindowCouta.attachLayout("1C");
    Layout1.cells('a').hideHeader();
    Layout1.cells('a').setWidth(640);
    Formedittp = Layout1.cells('a').attachForm(formedit);
    Formedittp.setItemValue('__cod',cod_s),Formedittp.setItemValue('__nom',nom_s),Formedittp.setItemValue('__des',des_s),Formedittp.setItemValue('__imp',imp_s),Formedittp.setItemValue('__sttn',est_s);
    //FormonButtonClic(name)
    Formedittp.attachEvent("onButtonClick",function (name) {FormonButtonClic(name);     
    });
}

function retirar_activar(){
    let estnew =  est_s === 'Vigente' ? 'Desactivar' : 'Activar';
    let p = {usuario : usrJson.alias, codigo: cod_s, nombre: nom_s, descripcion: des_s, monto: imp_s, estado:estnew }
    Swal.fire({ title: 'Cuidado!', text: '¿ Deseas '+ estnew + ' el Tipo de Negocio ' + nom_s + ' ?',icon: 'warning',showCancelButton: true,confirmButtonText: 'Estoy de acuerdo!.',cancelButtonText: 'No, cancelar!',reverseButtons: true
      }).then((result) => {
        if (result.value) {
            $.post(BASE_URL + "VT010102/savetnego", p, function (res) { 
                if (parseFloat(res.codsend) == '1') {
                    Swal.fire('Realizado!', res.txtsend,'success');
                    GridTipoNego.clearAll();
                    GridTipoNego.load(BASE_URL + 'VT010102/gridtiponego');
                }else Swal.fire('Cancelado', res.txtsend, 'error');
            }, "json"); 
        } else if (result.dismiss === Swal.DismissReason.cancel ) {
            Swal.fire('Cancelado', 'Operacion cancelada por el usuario', 'error');
        }
      });
}
function mant_cuotatn(nomtn){
    dhxW12 = new dhtmlXWindows();
    WindowCouta = dhxW12.createWindow('w_couta',0,0,280,390);
    WindowCouta.center();
    WindowCouta.setText('Cuota de ' + nomtn);
    WindowCouta.setModal(true);
    WindowCouta.keepInViewport(true);
    let Layout1 = WindowCouta.attachLayout("1C");
    Layout1.cells('a').hideHeader();
    //Layout1.cells('a').setWidth(640);
    Formcuotatp = Layout1.cells('a').attachForm(formcuota);
    Formcuotatp.attachEvent("onOptionsLoaded", function(name){
        let p = {emp : usrJson.empresa,cod : cod_s }
        $.post(BASE_URL + "VT010102/datos_cuota", p, function (res) {
            if (res.length > 0) {
                Formcuotatp.setItemValue('__cod', res[0].CO_TIPO_NEGOCIO);
                Formcuotatp.setItemValue('__nom', res[0].DE_NOMBRE);
                Formcuotatp.setItemValue('__mvenc', res[0].IM_VENCIDO);
                Formcuotatp.setItemValue('__mvencm', res[0].IM_VMES);
                Formcuotatp.setItemValue('__mvenc30', res[0].IM_VENCE_30);
                Formcuotatp.setItemValue('__mvenc60', res[0].IM_VENCE_60);
                Formcuotatp.setItemValue('__mvenc90', res[0].IM_VENCE_90);
                Formcuotatp.setItemValue('__mvsttn', res[0].ES_VIGENCIA);
            } 
        }, "json");
    });
    Formcuotatp.attachEvent("onButtonClick",function (name) {FButtonClic(name);     
    });
}

FButtonClic = (name)=>{
    switch(name){
        case 'b_save' :  
              let p = {empresa : usrJson.empresa ,usuario : usrJson.alias, codigo: cod_s, mvenc  : Formcuotatp.getItemValue('__mvenc'),
              mvencm  : Formcuotatp.getItemValue('__mvencm'),  mvenc30  : Formcuotatp.getItemValue('__mvenc30'),
              mvenc60  : Formcuotatp.getItemValue('__mvenc60'),  mvenc90  : Formcuotatp.getItemValue('__mvenc90'),
              mvsttn : Formcuotatp.getItemValue('__mvsttn') }
             $.post(BASE_URL + "VT010102/savecuotatnego", p, function (res) {//console.log(res);
                    if (parseFloat(res.codsend) == '1') {
                        Swal.fire('Realizado!', res.txtsend, 'success');
                        GridTipoNego.clearAll();
                        GridTipoNego.load(BASE_URL + 'VT010102/gridtiponego');
                    }else Swal.fire('Cancelado - Error', res.txtsend, 'error');
                WindowCouta.close();
                }, "json"); 
        break;
        case 'b_cancel' :
            WindowCouta.close();
        break;
    }
}

FormonButtonClic = (name)=>{
    switch(name){
        case 'b_save' :  
              let p = {usuario : usrJson.alias, codigo: parseInt(Formedittp.getItemValue('__cod')), nombre: Formedittp.getItemValue('__nom'), descripcion: Formedittp.getItemValue('__des'), monto: parseFloat(Formedittp.getItemValue('__imp')), estado:Formedittp.getItemValue('__sttn') }
             $.post(BASE_URL + "VT010102/savetnego", p, function (res) {//console.log(res);
                    if (parseFloat(res.codsend) == '1') {
                        Swal.fire('Realizado!', res.txtsend, 'success');
                        GridTipoNego.clearAll();
                        GridTipoNego.load(BASE_URL + 'VT010102/gridtiponego');
                    }else Swal.fire('Cancelado - Error', res.txtsend, 'error');
                WindowCouta.close();
                }, "json"); 
        break;
        case 'b_cancel' :
            WindowCouta.close();
        break;
    }
}



