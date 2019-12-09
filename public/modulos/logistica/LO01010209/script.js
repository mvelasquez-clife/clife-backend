CargarGlobales = (periodo, descripcion) => {
    LayoutPrincipal.cells('b').detachObject();
    GridGlobales = LayoutPrincipal.cells('b').attachGrid();
        GridGlobales.setIconsPath('/assets/images/icons/grid/');
        GridGlobales.setImagesPath('/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/');
        GridGlobales.setHeader('Codigo,Docs.,Tipo,Almacen,Periodo,Estado,Usuario,Fecha');
        GridGlobales.setInitWidths('60,40,60,240,60,80,320,70');
        GridGlobales.setColTypes('rotxt,ron,rotxt,rotxt,ron,rotxt,rotxt,rotxt');
        GridGlobales.setColAlign('left,right,left,left,right,left,left,left');
        GridGlobales.init();
        LayoutPrincipal.cells('b').progressOn();
        GridGlobales.attachEvent('onRowSelect', GridGlobalesOnRowSelect);
        GridGlobales.load(BASE_URL + URL_MODULO + '/lista-globales-fraccionamientos/' + usrJson.empresa + '/' + periodo, () => {
            LayoutPrincipal.cells('b').progressOff();
        });
    LayoutPrincipal.cells('c').detachObject();
}
GeneraOrdenFraccionamiento = async () => {
    let ahora = new Date();
        let iAnio = ahora.getFullYear();
        let iMes = ahora.getMonth() + 1;
    DataFraccionamiento.periodo = iAnio * 100 + iMes;
    let result
    try {
        result = await $.ajax({
            url: BASE_URL + URL_MODULO + '/genera-orden-frac',
            method: 'post',
            data: DataFraccionamiento,
            dataType: 'json'
        });
        if (result.error) {
            dhtmlx.alert({
                type: 'alert-error',
                text: result.error
            });
            return;
        }
        dhtmlx.alert({
            type: result.data.codigo == 1 ? 'alert-warning' : 'alert-error',
            text: result.data.mensaje
        });
        if (result.data.codigo == 1) {
            BuscaOrdenes();
            CargarGlobales(ComboPeriodo.getSelectedValue(), '');
        }
    }
    catch (err) {
        console.error(err);
    }
}
BuscaOrdenes = () => {
    let almacen = ComboAlmacen.getSelectedValue();
    if (almacen != '0') {
        let encodedDesde = ToolbarOrdenes.getValue('InputDesde');
        let encodeHasta = ToolbarOrdenes.getValue('InputHasta');
        let stintes = ToolbarOrdenes.getItemState('InputTipo') ? 'S' : 'N';
        LayoutPrincipal.cells('a').detachObject();
        GridOrdenes = LayoutPrincipal.cells('a').attachGrid();
            GridOrdenes.setIconsPath('/assets/images/icons/grid/');
            GridOrdenes.setImagesPath('/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/');
            GridOrdenes.setHeader(',Periodo,Producto,,Lote,Cant.Program.,TipoDocumento,,Documento,Fecha,Solicita,DocumentoAncestro,');
            GridOrdenes.attachHeader('#rspan,#select_filter,#text_filter,#text_filter,#text_filter,#numeric_filter,#select_filter,#select_filter,#text_filter,#text_filter,#select_filter,#select_filter,#select_filter');
            GridOrdenes.setInitWidths('30,60,100,280,80,80,40,180,100,70,240,60,160');
            GridOrdenes.setColTypes('ch,ron,rotxt,rotxt,rotxt,ron,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt');
            GridOrdenes.setColAlign('center,right,right,left,right,right,right,left,left,left,left,right,left');
            GridOrdenes.setNumberFormat('0,000',5);
            GridOrdenes.init();
            LayoutPrincipal.cells('a').progressOn();
        GridOrdenes.load(BASE_URL + URL_MODULO + '/buscar-documentos/' + usrJson.empresa + '/' + almacen + '/' + encodedDesde + '/' + encodeHasta + '/' + stintes, () => {
            LayoutPrincipal.cells('a').progressOff();
            DataFraccionamiento.almacen = almacen;
            DataFraccionamiento.tinte = stintes;
            DataFraccionamiento.cantidad = 0;
            DataFraccionamiento.documentos = [];
            DataFraccionamiento.tipos = [];
        });
    }
    else {
        dhtmlx.alert({
            type: 'alert-error',
            text: 'Debe seleccionar un almacén'
        });
    }
}

setSens = (inp, k) => {
    if (k == 'min') {
        CalendarRango.setSensitiveRange(inp.value, null);
    }
    else {
        CalendarRango.setSensitiveRange(null, inp.value);
    }
}
ToolbarOrdenesOnChange = (id, estado) => {
    switch (id) {
        case 'InputTipo':
            if (estado) {
                $('#sp-miscelaneos').removeClass('sp-enabled').removeAttr('tooltip');
                $('#sp-tintes').addClass('sp-enabled').attr('tooltip', 'Buscar tintes');
            }
            else {
                $('#sp-tintes').removeClass('sp-enabled').removeAttr('tooltip');
                $('#sp-miscelaneos').addClass('sp-enabled').attr('tooltip', 'Buscar tintes');
            }
            break;
        default: break;
    }
}
ToolbarOrdenesOnClick = (id) => {
    switch (id) {
        case 'ButtonBusca':
            BuscaOrdenes();
            break;
        default: break;
    }
}
FooterOrdenesOnClick = async (id) => {
    switch (id) {
        case 'BuscaUsuario':
            var output = await IniciarGridBusqueda(1001, false, LayoutPrincipal);
            if (output && output.seleccion.length > 0) {
                if (output.seleccion[0].vigencia == 'Vigente') {
                    UsuarioFraccionamiento = output.seleccion[0];
                    document.getElementById('sp-usrpicking').innerHTML = UsuarioFraccionamiento.operario;
                    FooterOrdenes.enableItem('GeneraFrac');
                    DataFraccionamiento.picker = UsuarioFraccionamiento.codigo;
                }
                else {
                    dhtmlx.alert({
                        type: 'alert-error',
                        text: 'El operario no se encuentra vigente'
                    });
                }
            }
            break;
        case 'GeneraFrac':
            if (GridOrdenes && GridOrdenes.getCheckedRows(0) != '') {
                const ordenesIds = GridOrdenes.getCheckedRows(0);
//x_empresa,x_periodo,x_usuario,x_almacen,x_tinte,x_cant_docus,x_cads_docus,x_cads_tipo_docu,x_usuario_picking
                let tipos = [], documentos = [];
                let ids = ordenesIds.split(',');
                for (rowId of ids) {
                    let iTipo = GridOrdenes.cells(rowId,6).getValue();
                    let iDocumento = GridOrdenes.cells(rowId,8).getValue();
                    tipos.push(iTipo);
                    documentos.push(iDocumento);
                }
                DataFraccionamiento.cantidad = ids.length;
                DataFraccionamiento.documentos = documentos.join('@');
                DataFraccionamiento.tipos = tipos.join('@');
                GeneraOrdenFraccionamiento();
            }
            else {
                dhtmlx.alert({
                    type: 'alert-error',
                    text: 'Seleccione al menos una orden para generar el fraccionamiento'
                });
            }
            break;
    }
},
GridGlobalesOnRowSelect = (rowId, colId) => {
    LayoutPrincipal.cells('c').detachObject();
    GridDocumentos = LayoutPrincipal.cells('c').attachGrid();
        GridDocumentos.setIconsPath('/assets/images/icons/grid/');
        GridDocumentos.setImagesPath('/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/');
        GridDocumentos.setHeader('Documento,TipoDoc,FechaRegistro,Reserva,Picking,UsuarioPicking,InicioPicking,FinPicking,Packing,InicioPacking,FinPacking,UsuarioPacking,FechaRegistro,UsuarioRegistra,FechaActualiza,UsuarioActualiza,ProductoEntregado,UsuarioRecepciona,FechaRecepciona,');
        GridDocumentos.attachHeader('#text_filter,#select_filter,#text_filter,#rspan,#rspan,#text_filter,#text_filter,#text_filter,#rspan,#text_filter,#text_filter,#text_filter,#text_filter,#select_filter,#text_filter,#select_filter,#rspan,#select_filter,#text_filter,#rspan');
        GridDocumentos.setInitWidths('100,180,70,30,30,240,70,70,30,70,70,240,70,240,70,240,30,240,70,0');
        GridDocumentos.setColTypes('rotxt,rotxt,rotxt,ch,ch,rotxt,rotxt,rotxt,ch,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,ch,rotxt,rotxt,rotxt');
        GridDocumentos.setColAlign('left,left,left,center,center,left,left,left,center,left,left,left,left,left,left,left,center,left,left,left');
        GridDocumentos.init();
        LayoutPrincipal.cells('c').progressOn();
        GridDocumentos.load(BASE_URL + URL_MODULO + '/lista-documentos-fraccionamiento/' + usrJson.empresa + '/' + rowId, () => {
            LayoutPrincipal.cells('c').progressOff();
        });
}

IniciarInterfaz = () => {
    LayoutPrincipal = new dhtmlXLayoutObject(document.body, '3L');
        LayoutPrincipal.cells('a').setText('Ordenes de Fabricación');
        LayoutPrincipal.cells('b').hideHeader();
        LayoutPrincipal.cells('c').setText('Reporte documento picking');
    ToolbarOrdenes = LayoutPrincipal.cells('a').attachToolbar();
        ToolbarOrdenes.setIconsPath('/assets/images/icons/toolbar/');
        ToolbarOrdenes.addText('LabelAlmacen', null, 'Almacén');
        ToolbarOrdenes.addText('ComboAlmacen', null, '<div id="dv-almacen" class="dv-combo"></div>');
        ToolbarOrdenes.addText('LabelDesde', null, 'Del');
        ToolbarOrdenes.addInput('InputDesde', null, null, 64);
        ToolbarOrdenes.addText('LabelHasta', null, 'al');
        ToolbarOrdenes.addInput('InputHasta', null, null, 64);
        ToolbarOrdenes.addButtonTwoState('InputTipo', null, null, 'ic-select.svg');
        ToolbarOrdenes.addText('LabelTintes', null, '<span id="sp-tintes" class="sp-toolbar sp-enabled">Tintes</span>');
        ToolbarOrdenes.addText('LabelMiscelaneos', null, '<span id="sp-miscelaneos" class="sp-toolbar">Miscelaneos</span>');
        ToolbarOrdenes.addButton('ButtonBusca', null, 'Buscar', 'ic-search.svg');
        ToolbarOrdenes.setItemState('InputTipo', true);
        ToolbarOrdenes.attachEvent('onStateChange', ToolbarOrdenesOnChange);
        ToolbarOrdenes.attachEvent('onClick', ToolbarOrdenesOnClick);
    ipCalDesde = ToolbarOrdenes.getInput('InputDesde');
        ipCalDesde.setAttribute('readOnly','true');
        ipCalDesde.onclick = () => {setSens(ipCalHasta,'max');};
    ipCalHasta = ToolbarOrdenes.getInput('InputHasta');
        ipCalHasta.setAttribute('readOnly','true');
        ipCalHasta.onclick = () => {setSens(ipCalDesde,'min');};
    CalendarRango = new dhtmlXCalendarObject([ipCalDesde, ipCalHasta]);
        CalendarRango.setDateFormat('%Y-%m-%d');
        CalendarRango.hideTime();
    ComboAlmacen = new dhtmlXCombo('dv-almacen', 'combo', 140);
        ComboAlmacen.load(BASE_URL + URL_MODULO + '/lista-almacenes/' + usrJson.empresa);
        ComboAlmacen.setComboValue('0');
        ComboAlmacen.setComboText('- Seleccione -');
    LayoutPrincipalFooter = LayoutPrincipal.cells('a').attachStatusBar({
        text: '<div id="footer-ordenes"></div>',
        height: 32,
        paging: false
    });
    $('#footer-ordenes').css('margin','0 -5px');
    FooterOrdenes = new dhtmlXToolbarObject({
        parent: 'footer-ordenes',
        icons_path: '/assets/images/icons/toolbar/'
    });
    FooterOrdenes.addText('LabelUsuario', null, 'Usuario picking');
    FooterOrdenes.addText('TextUsuario', null, '<span id="sp-usrpicking">(no seleccionado)</span>');
    FooterOrdenes.addButton('BuscaUsuario', null, 'Buscar', 'ic-search.svg');
    FooterOrdenes.addSeparator();
    FooterOrdenes.addButton('GeneraFrac', null, 'Generar', 'ic-generate.svg', 'ic-generate-dis.svg');
    FooterOrdenes.disableItem('GeneraFrac');
    FooterOrdenes.attachEvent('onClick', FooterOrdenesOnClick);
    //
    ToolbarReporte = LayoutPrincipal.cells('b').attachToolbar();
        ToolbarReporte.addText('LabelReporte', null, '<b>Reporte total picking</b>');
        ToolbarReporte.addSeparator();
        ToolbarReporte.addText('LabelPeriodo', null, 'Seleccione periodo');
        ToolbarReporte.addText('ComboPeriodo', null, '<div id="dv-periodo" class="dv-combo"></div>');
    ComboPeriodo = new dhtmlXCombo('dv-periodo', 'combo', 140);
        ComboPeriodo.load(BASE_URL + URL_MODULO + '/lista-periodos/' + usrJson.empresa, function() {
            let option = ComboPeriodo.getOptionByIndex(0);
            ComboPeriodo.setComboValue(option.value);
            ComboPeriodo.setComboText(option.text);
            ComboPeriodo.setChecked(0,true);
            CargarGlobales(option.value, option.text);
            ComboPeriodo.attachEvent('onChange', CargarGlobales);
        });
        ComboPeriodo.setComboText('- Seleccione -');
}
$(IniciarInterfaz);