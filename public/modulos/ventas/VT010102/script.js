/*let ToolbarItemsToHide = ['FzaVtaSerieLabel','FzaVtaSerieCodigo','FzaVtaSerieNombre','FzaVtaEstado','FzaVtaOpciones','FzaVtaMarcas', 'FzaVtaVendedores', 'FzaVtaAsignaLCLabel','FzaVtaAsignaLCMeses','FzaVtaAsignaLc'];
let ToolbarItemsToDisable = ['FzaVtaCodigo','FzaVtaNombre','FzaVtaSerieCodigo','FzaVtaSerieNombre','FzaVtaEstado'];

let FuerzaVentaRes;
let FuerzaVentaOpciones = [
    ['FuerzaVentaAgregar', 'obj', 'Agregar Fuerza de Venta', 'ic-add.svg'],
    ['FuerzaVentaEditar', 'obj', 'Editar Fuerza de Venta', 'ic-edit.svg'],
    ['FuerzaVentaEliminar', 'obj', 'Eliminar Fuerza de Venta', 'ic-delete.svg'],
    ['FuerzaVentaVendedor', 'obj', 'Añadir vendedor', 'ic-vendedor.svg'],
    ['FuerzaVentaMarcas', 'obj', 'Ver marcas', 'ic-lista.svg']
];
let structs = {
    FormWinCliente: [
        { type: 'settings', offsetLeft: 16 },
        { type: 'hidden', name: 'FormVendedor' },
        { label: '<span class="lbl-form-win-cliente">Parámetros de cálculo</span>', type: 'label', name: 'FormTitulo', offsetTop: 16 },
        { label: 'Factor', type: 'input', name: 'FormFactor', inputWidth: 60, offsetTop: 16 },
        { label: 'Histórico de pagos', type: 'input', name: 'FormHistoricoPagos', inputWidth:100 },
    ]
};*/

//let WindowVendedores, LayoutWindowVendedores, ToolbarWindowVendedores, GridWindowVendedores, LayoutWindowCreditos, GridClienteTodo, GridClienteFiltro, FormWinCliente;

IniciarComponentes = () => {
    Layout = new dhtmlXLayoutObject(document.body, '1C');
    Layout.cells('a').hideHeader();
    //Layout.cells('a').attachHTMLString('<div class="dv-background"></div>');
    carga_grilla_tiponego();
    /*Layout = new dhtmlXLayoutObject(document.body, '1C');
        Layout.cells('a').hideHeader();
        Layout.cells('a').attachHTMLString('<div class="dv-background"></div>');
        Toolbar = Layout.cells('a').attachToolbar();
        Toolbar.setIconsPath('/assets/images/icons/toolbar/');
        Toolbar.addText('FzaVtaLabel',null,'<b>Fuerza Venta</b>');
        Toolbar.addInput('FzaVtaCodigo',null,null,32);
        Toolbar.addButton('FzaVtaBusca', null, null, 'ic-search.svg', null);
        Toolbar.addInput('FzaVtaNombre',null,null,100);
        Toolbar.addText('FzaVtaSerieLabel',null,'Serie');
        Toolbar.addInput('FzaVtaSerieCodigo',null,null,40);
        Toolbar.addInput('FzaVtaSerieNombre',null,null,50);
        Toolbar.addButtonTwoState('FzaVtaEstado', null, '<span style="color:#388e3c;">Vigente</span>', 'ic-check.svg', 'ic-check.svg');
        Toolbar.addButtonSelect('FzaVtaOpciones', null, 'Opciones Fza. Venta', FuerzaVentaOpciones, 'ic-fzavta.svg', null);
        Toolbar.addSeparator();
        Toolbar.addText('FzaVtaAsignaLCLabel',null,'Nro. meses');
        Toolbar.addInput('FzaVtaAsignaLCMeses',null,'6',30);
        Toolbar.addButton('FzaVtaAsignaLc', null, 'Asignar línea crédito', 'ic-cash.svg', null);
        for(let i in ToolbarItemsToHide) Toolbar.hideItem(ToolbarItemsToHide[i]);
        for(let i in ToolbarItemsToDisable) Toolbar.disableItem(ToolbarItemsToDisable[i]);
        Toolbar.attachEvent('onClick', ToolbarOnClick);
        WinContainer = new dhtmlXWindows();
        WinContainer.attachViewportTo(document.body);*/
}


carga_grilla_tiponego = ()=>{
    GridTipoNego = Layout.cells('a').attachGrid();
    GridTipoNego.setIconsPath('/assets/images/icons/grid/');
    GridTipoNego.setHeader('Codigo,Nombre,Descripcion,Imp.Minimo,Estado,Cuota,Editar,Estado');
    //GridTipoNego.attachHeader('#rspan,#text_filter,#text_filter,#select_filter,#select_filter,#select_filter,#select_filter,#select_filter,#text_filter,#rspan,#rspan,#rspan');
    GridTipoNego.setInitWidthsP('10,25,30,10,10,5,5,5');
    GridTipoNego.setColTypes('rotxt,rotxt,rotxt,ron,rotxt,img,img,img');
    GridTipoNego.setColAlign('left,left,left,right,center,center,center,center');
    GridTipoNego.setNumberFormat('0,000.00',3);
    GridTipoNego.init();
    Layout.cells('a').progressOn();
    GridTipoNego.load(BASE_URL + 'VT010102/gridtiponego');//,GridTipoNegoOnLoad);
    GridTipoNego.attachEvent('onRowSelect',GridTipoNegoOnRowSelect);
    //GridTipoNego.cells("row1",0).setValue("newValue");
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
            Swal.fire('Cancelado1', 'Operacion cancelada por el usuario', 'error');
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
              mvsttn : Formedittp.getItemValue('__mvsttn') }
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




///////////////////////////////////////////////////////////////////////////////////////////eventos
ToolbarOnClick = async (id) => {
    switch(id) {
        case 'FzaVtaBusca':
            let output = await IniciarGridBusqueda(15, false, Layout);
            if(output) {
                FuerzaVentaRes = output.seleccion[0];
                for(let i in ToolbarItemsToHide) Toolbar.showItem(ToolbarItemsToHide[i]);
                Toolbar.setValue('FzaVtaCodigo', FuerzaVentaRes.codigo);
                Toolbar.setValue('FzaVtaNombre', FuerzaVentaRes.nombre);
                Toolbar.setValue('FzaVtaSerieCodigo', FuerzaVentaRes.cserie);
                Toolbar.setValue('FzaVtaSerieNombre', FuerzaVentaRes.nserie);
                if(FuerzaVentaRes.estado == 'Vigente') {
                    Toolbar.setItemText('FzaVtaEstado', '<span style="color:#388e3c;">' + FuerzaVentaRes.estado + '</span>');
                    Toolbar.setItemImageDis('FzaVtaEstado', 'ic-check.svg');
                    Toolbar.setItemState('FzaVtaEstado', false);
                }
                else {
                    Toolbar.setItemText('FzaVtaEstado', '<span style="color:#f44336;">' + FuerzaVentaRes.estado + '</span>');
                    Toolbar.setItemImageDis('FzaVtaEstado', 'ic-check-dis.svg');
                    Toolbar.setItemState('FzaVtaEstado', true);
                }
                CargarGridFuerzaVenta();
            }
            break;
        case 'FzaVtaAsignaLc':
            let CheckedRows = GridFuerzaVenta.getCheckedRows(0);
            if(CheckedRows == '') {
                dhtmlx.alert({
                    title: 'No se puede asignar línea de crédito',
                    type: 'alert-error',
                    text: 'Para asignar línea de crédito de forma masiva, debe seleccionar al menos una fila de la lista'
                });
                return false;
            }
            let NumeroMeses = Toolbar.getValue('FzaVtaAsignaLCMeses');
            if(NumeroMeses == '') {
                dhtmlx.alert({
                    title: 'No se puede asignar línea de crédito',
                    type: 'alert-error',
                    text: 'Especifique el número de meses'
                });
                return false;
            }
            //prepara to papu
            let out = await IniciarFormularioSeguridad(112, Layout);
            if(out && out.result == 'S') {
                let ArrayIds = CheckedRows.split(',');
                let CadenaVendedores = '';
                for(let i in ArrayIds) {
                    let iRowId = ArrayIds[i];
                    CadenaVendedores += GridFuerzaVenta.cells(iRowId,1).getValue() + '@';
                }
                let result = await $.ajax({
                    url: '/api/VT010101/asignar-linea-credito-masivo',
                    method: 'post',
                    data: {
                        empresa: usrJson.empresa,
                        alias: usrJson.alias,
                        cadena: CadenaVendedores,
                        cantidad: ArrayIds.length,
                        fzavta: FuerzaVentaRes.codigo,
                        meses: NumeroMeses
                    },
                    dataType: 'json'
                });
                if(result.state == 'success') {
                    dhtmlx.alert({
                        type: 'alert-error',
                        text: 'Se asignó la línea de crédito a los vendedores seleccionados'
                    });
                }
                else {
                    dhtmlx.alert({
                        title: 'No se puede asignar línea de crédito',
                        type: 'alert-error',
                        text: result.message
                    });
                }
            }
            break;
        default: break;
    }
}




//metodos
CargarGridFuerzaVenta = () => {
    Layout.cells('a').detachObject();
    GridFuerzaVenta = Layout.cells('a').attachGrid();
        GridFuerzaVenta.setIconsPath('/assets/images/icons/grid/');
        GridFuerzaVenta.setHeader(',Código,Vendedor,¿Lima?,¿Provincia?,¿Extranjero?,Estado,Estado Ventas,Fecha Línea Crédito,,,');
        GridFuerzaVenta.attachHeader('#rspan,#text_filter,#text_filter,#select_filter,#select_filter,#select_filter,#select_filter,#select_filter,#text_filter,#rspan,#rspan,#rspan');
        GridFuerzaVenta.setInitWidths('30,100,400,80,80,80,90,90,90,25,25,25');
        GridFuerzaVenta.setColTypes('ch,rotxt,rotxt,ch,ch,ch,rotxt,rotxt,rotxt,img,img,img');
        GridFuerzaVenta.setColAlign('center,right,left,center,center,center,left,left,left,center,center,center');
        GridFuerzaVenta.setNumberFormat('0,000.00',3);
        GridFuerzaVenta.init();
        GridFuerzaVenta.load('/api/VT010102/fzavta-vendedores/' + usrJson.empresa + '/' + FuerzaVentaRes.codigo, GridFuerzaVentaOnLoad);
        GridFuerzaVenta.attachEvent('onRowSelect', GridFuerzaVentaOnRowSelect);
        Layout.cells('a').progressOn();
}
CargarGridWindowVendedores = (cvendedor) => {
    LayoutWindowVendedores.cells('a').progressOn();
    GridWindowVendedores.clearAll();
    GridWindowVendedores.load('/api/VT010101/fzavta-clientes-vendedor/' + usrJson.empresa + '/' + cvendedor + '/' + FuerzaVentaRes.codigo, GridWindowVendedoresOnLoad);
}
//eventos
GridFuerzaVentaOnLoad = () => {
    let CantidadFilas = GridFuerzaVenta.getRowsNum();
    for(let i = 0; i < CantidadFilas; i++) {
        let iRowId = GridFuerzaVenta.getRowId(i);
        let iEstado = GridFuerzaVenta.cells(iRowId,6).getValue();
        let iEstadoVentas = GridFuerzaVenta.cells(iRowId,7).getValue();
        GridFuerzaVenta.cells(iRowId,3).setDisabled(true);
        GridFuerzaVenta.cells(iRowId,4).setDisabled(true);
        GridFuerzaVenta.cells(iRowId,5).setDisabled(true);
        if(iEstado == 'Vigente') {
            GridFuerzaVenta.cells(iRowId,6).setBgColor('#e8f5e9');
        }
        else {
            GridFuerzaVenta.setRowTextStyle(iRowId,'color:#e53935;');
            GridFuerzaVenta.cells(iRowId,6).setBgColor('#ffebee');
        }
        GridFuerzaVenta.cells(iRowId,7).setBgColor(iEstadoVentas == 'Vigente' ? '#e8f5e9' : '#ffebee');
        GridFuerzaVenta.setCellTextStyle(iRowId,9,'cursor:pointer;');
        GridFuerzaVenta.setCellTextStyle(iRowId,10,'cursor:pointer;');
        GridFuerzaVenta.setCellTextStyle(iRowId,11,'cursor:pointer;');
    }
    Layout.cells('a').progressOff();
}
GridFuerzaVentaOnRowSelect = (rowId, colId) => {
    let cvendedor = GridFuerzaVenta.cells(rowId,1).getValue();
    let nvendedor = GridFuerzaVenta.cells(rowId,2).getValue();
    switch(colId) {
        case 9:
            WindowVendedores = WinContainer.createWindow('WindowVendedores',0,0,720,640);
                WindowVendedores.center();
                WindowVendedores.setText('Clientes - ' + nvendedor);
                WindowVendedores.setModal(true);
                WindowVendedores.keepInViewport(true);
            LayoutWindowVendedores = WindowVendedores.attachLayout("1C");
                LayoutWindowVendedores.cells('a').hideHeader();
                LayoutWindowVendedores.cells('a').setWidth(640);
            GridWindowVendedores = LayoutWindowVendedores.cells('a').attachGrid();
                GridWindowVendedores.setIconsPath('/assets/images/icons/grid/');
                GridWindowVendedores.setHeader('RUC/DNI,Cliente,Línea crédito,Fecha asignación,,');
                GridWindowVendedores.attachHeader('#text_filter,#text_filter,#numeric_filter,#text_filter,#rspan,#rspan');
                GridWindowVendedores.setInitWidths('100,340,120,90,25,0');
                GridWindowVendedores.setColTypes('rotxt,rotxt,dyn,rotxt,img,rotxt');
                GridWindowVendedores.setColAlign('right,left,right,left,center,left');
                GridWindowVendedores.setNumberFormat('0,000.00',2);
                GridWindowVendedores.setColumnHidden(5,true);
                GridWindowVendedores.attachEvent('onRowSelect',GridWindowVendedoresOnRowSelect);
                GridWindowVendedores.init();
                CargarGridWindowVendedores(cvendedor);
            break;
        case 10:
            break;
        case 11:
            break;
        default: break;
    }
}
GridWindowVendedoresOnLoad = () => {
    let CantidadFilas = GridWindowVendedores.getRowsNum();
    for(let i = 0; i < CantidadFilas; i++) {
        let iRowId = GridWindowVendedores.getRowId(i);
        GridWindowVendedores.cells(iRowId,2).setDisabled(true);
        GridWindowVendedores.setCellTextStyle(iRowId,4,'cursor:pointer;');
    }
    LayoutWindowVendedores.cells('a').progressOff();
}
GridWindowVendedoresOnRowSelect = async (rowId, colId) => {
    if(colId == 4) {
        let cCliente = GridWindowVendedores.cells(rowId,0).getValue();
        let nCliente = GridWindowVendedores.cells(rowId,1).getValue();
        let cVendedor = GridWindowVendedores.cells(rowId,5).getValue();
        let nMeses = parseInt(Toolbar.getValue('FzaVtaAsignaLCMeses'));
        let lc = await AsignarLineaCreditoCliente(WinContainer,cCliente,cVendedor,nMeses,FuerzaVentaRes.codigo);
        if(lc && lc.result == 'S') {
            dhtmlx.alert({
				title: 'Asignar línea de crédito',
				ok: 'Entendido',
				text: 'Se asignó la línea de crédito al cliente <b>' + nCliente + '</b>'
			});
            CargarGridWindowVendedores(cVendedor);
        }
/*        LayoutWindowCreditos = LayoutWindowVendedores.cells('b').attachLayout('3E');
            LayoutWindowCreditos.cells('a').setText('Cliente: ' + GridWindowVendedores.cells(rowId,1).getValue());
            LayoutWindowCreditos.cells('a').setHeight(160);
            LayoutWindowCreditos.cells('b').hideHeader();
            LayoutWindowCreditos.cells('c').hideHeader();
        //formulario
        FormWinCliente = LayoutWindowCreditos.cells('b').attachForm();
console.log('rowId',GridFuerzaVenta.getSelectedRowId());
        FormWinCliente.setItemValue('FormWinCliente',GridFuerzaVenta.cells(GridFuerzaVenta.getSelectedRowId(),1).getValue());
        //oliboli
        //grid izquierda
        GridClienteTodo = LayoutWindowCreditos.cells('b').attachGrid();
            GridClienteTodo.setIconsPath('/assets/images/icons/grid/');
            GridClienteTodo.setHeader('Fza.Vta.,Vendedor,Periodo,Pagos,');
            GridClienteTodo.setInitWidths('50,200,60,80,0');
            GridClienteTodo.setColTypes('rotxt,rotxt,rotxt,ron,rotxt');
            GridClienteTodo.setColAlign('left,left,left,right,center');
            GridClienteTodo.setNumberFormat('0,000.00',3);
            GridClienteTodo.init();
            GridClienteTodo.load('/api/VT010101/pagos-cliente-todos/' + usrJson.empresa + '/' + GridWindowVendedores.cells(rowId,0).getValue());
        //grid derecha
        GridClienteFiltro = LayoutWindowCreditos.cells('c').attachGrid();
            GridClienteFiltro.setIconsPath('/assets/images/icons/grid/');
            GridClienteFiltro.setHeader('Fza.Vta.,Vendedor,Periodo,Pagos,');
            GridClienteFiltro.setInitWidths('50,200,60,80,0');
            GridClienteFiltro.setColTypes('rotxt,rotxt,rotxt,ron,rotxt');
            GridClienteFiltro.setColAlign('left,left,left,right,center');
            GridClienteFiltro.setNumberFormat('0,000.00',3);
            GridClienteFiltro.init();
            //GridClienteFiltro.load('/api/VT010101/fzavta-clientes-vendedor/' + usrJson.empresa + '/' + GridFuerzaVenta.cells().getValue() + '/' + GridWindowVendedores.cells(rowId,1).getValue() + '/' + FuerzaVentaRes.codigo);
*/
    }
}
