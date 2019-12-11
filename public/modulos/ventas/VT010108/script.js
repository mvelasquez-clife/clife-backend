IniciarComponentes = () => {
    Layout = new dhtmlXLayoutObject(document.body, '1C');
    Layout.cells('a').hideHeader();
    carga_grilla_canal();
    
}


carga_grilla_canal = ()=>{
    GridCaventa = Layout.cells('a').attachGrid();
    GridCaventa.setIconsPath('/assets/images/icons/grid/');
    GridCaventa.setHeader('Codigo,Nombre,Estado,T.Nego,Editar,Desactivar');
    GridCaventa.setInitWidthsP('10,25,10,10,10,10');
    GridCaventa.setColTypes('rotxt,rotxt,rotxt,img,img,img');
    GridCaventa.setColAlign('left,left,left,center,center,center,center,center');
    GridCaventa.init();
    Layout.cells('a').progressOn();
    GridCaventa.load(BASE_URL + 'VT010108/gridcanalventa/'+usrJson.empresa);//,GridTipoNegoOnLoad);
    GridCaventa.attachEvent('onRowSelect',GridCVentaOnRowSelect);
    Layout.cells('a').progressOff();
    _txtgrid(GridCaventa, 2);

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
GridCVentaOnRowSelect = (rowId, colId) => {//console.log(rowId, colId);
    cod_s =  GridCaventa.cells(rowId,0).getValue(),   nom_s =  GridCaventa.cells(rowId,1).getValue(),  est_s =  GridCaventa.cells(rowId,2).getValue();
    // let ntipnego = GridTipoNego.cells(rowId,1).getValue();
    switch(colId){
        case 3 : addtnepgocio(nom_s);break;
        case 4 : editar_cv(nom_s); break;
        case 5 : retirar_activar(); break;
    }
    
}

function retirar_activar(){
    let estnew =  est_s === 'Vigente' ? 'Desactivar' : 'Activar';
    //let p = {usuario : usrJson.alias, codigo: cod_s, nombre: nom_s, estado:estnew }
    let p = {emp : usrJson.empresa, usuario : usrJson.alias, codigo: cod_s, nombre: nom_s,  estado:estnew}
    Swal.fire({ title: 'Cuidado!', text: '¿ Deseas '+ estnew + ' el Canl de Venta ' + nom_s + ' ?',icon: 'warning',showCancelButton: true,confirmButtonText: 'Estoy de acuerdo!.',cancelButtonText: 'No, cancelar!',reverseButtons: true
      }).then((result) => {
        if (result.value) {
            $.post(BASE_URL + "VT010108/savecventa", p, function (res) { 
                if (parseFloat(res.codsend) == '1') {
                    Swal.fire('Realizado!', res.txtsend,'success');
                    GridCaventa.clearAll();
                    GridCaventa.load(BASE_URL + 'VT010108/gridcanalventa/'+usrJson.empresa);
                }else Swal.fire('Cancelado', res.txtsend, 'error');
            }, "json"); 
        } else if (result.dismiss === Swal.DismissReason.cancel ) {
            Swal.fire('Cancelado', 'Operacion cancelada por el usuario', 'error');
        }
      });
}

function editar_cv(nomtn) {
    dhxWcve = new dhtmlXWindows();
    WindowCventa = dhxWcve.createWindow('w_cventa',0,0,310,270);
    WindowCventa.center();
    WindowCventa.setText('Editando ' + nomtn);
    WindowCventa.setModal(true);
    WindowCventa.keepInViewport(true);
    let Layout1 = WindowCventa.attachLayout("1C");
    Layout1.cells('a').hideHeader();
    Layout1.cells('a').setWidth(640);
    Formeditcv = Layout1.cells('a').attachForm(formedit);
    Formeditcv.setItemValue('__cod',cod_s),Formeditcv.setItemValue('__nom',nom_s),Formeditcv.setItemValue('__sttn',est_s);
    Formeditcv.attachEvent("onButtonClick",function (name) {FormonButtonClic(name);     
    });
}

FormonButtonClic = (name)=>{
    switch(name){
        case 'b_save' :  
              let p = {emp : usrJson.empresa, usuario : usrJson.alias, codigo: parseInt(Formeditcv.getItemValue('__cod')), nombre: Formeditcv.getItemValue('__nom'),  estado:Formeditcv.getItemValue('__sttn') }
             $.post(BASE_URL + "VT010108/savecventa", p, function (res) {//console.log(res);
                    if (parseFloat(res.codsend) == '1') {
                        Swal.fire('Realizado!', res.txtsend, 'success');
                        GridCaventa.clearAll();
                        GridCaventa.load(BASE_URL + 'VT010108/gridcanalventa/'+usrJson.empresa);
                    }else Swal.fire('Cancelado - Error', res.txtsend, 'error');
                    WindowCventa.close();
                }, "json"); 
        break;
        case 'b_cancel' :
            WindowCventa.close();
        break;
    }
}

function addtnepgocio(nomtn){
    dhxW12 = new dhtmlXWindows();
    WindowAstn = dhxW12.createWindow('w_asgtneg',0,0,280,390);
    WindowAstn.center();
    WindowAstn.setText('Asignando Tipo de Negocio para  ' + nomtn);
    WindowAstn.setModal(true);
    WindowAstn.keepInViewport(true);
    let Layout1 = WindowAstn.attachLayout("1C");
    Layout1.cells('a').hideHeader();

    //Layout1.cells('a').setWidth(640);
    Formcuotasigtn = Layout1.cells('a').attachForm(formasigtnp);

    Formcuotasigtn.attachEvent("onOptionsLoaded", function(name){
        GridTipoNego =  new dhtmlXGridObject(Formcuotasigtn.getContainer("formasigtnp")); //Layout.cells('a').attachGrid();
        GridTipoNego.setIconsPath('/assets/images/icons/grid/');
        GridTipoNego.setHeader('#,Codigo,Nombre');
        GridTipoNego.setInitWidthsP('10,10,80');
        GridTipoNego.setColTypes('ch,rotxt,rotxt');
        GridTipoNego.setColAlign('left,left,left,right,center,center,center,center');
       // GridTipoNego.setNumberFormat('0,000.00',3);
        GridTipoNego.init();
        Layout.cells('a').progressOn();
        GridTipoNego.load(BASE_URL + 'VT010102/gridtiponego'); 
         
    });
    Formcuotatp.attachEvent("onButtonClick",function (name) {FButtonClic(name);     
    });

}
//////////////////////////////////////////////////////////////////////////////




FButtonClic = (name)=>{
    switch(name){
        case 'b_save' :  
              let p = {empresa : usrJson.empresa ,usuario : usrJson.alias, codigo: cod_s, mvenc  : Formcuotatp.getItemValue('__mvenc'),
              mvencm  : Formcuotatp.getItemValue('__mvencm'),  mvenc30  : Formcuotatp.getItemValue('__mvenc30'),
              mvenc60  : Formcuotatp.getItemValue('__mvenc60'),  mvenc90  : Formcuotatp.getItemValue('__mvenc90'),
              mvsttn : Formcuotatp.getItemValue('__mvsttn') }
             $.post(BASE_URL + "VT010108/savecuotatnego", p, function (res) {//console.log(res);
                    if (parseFloat(res.codsend) == '1') {
                        Swal.fire('Realizado!', res.txtsend, 'success');
                        GridTipoNego.clearAll();
                        GridTipoNego.load(BASE_URL + 'VT010108/gridtiponego');
                    }else Swal.fire('Cancelado - Error', res.txtsend, 'error');
                WindowCouta.close();
                }, "json"); 
        break;
        case 'b_cancel' :
            WindowCouta.close();
        break;
    }
}





