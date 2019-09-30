CargarGlobales = (periodo, descripcion) => {
    LayoutPrincipal.cells('b').detachObject();
    GridGlobales = LayoutPrincipal.cells('b').attachGrid();
        GridGlobales.setIconsPath('/assets/images/icons/grid/');
        GridGlobales.setImagesPath('/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/');
        GridGlobales.setHeader('Codigo,Documentos,Tinte,Almacen,Periodo,Estado,Usuario,Fecha');
        //GridGlobales.setInitWidths('30,60,100,240,80,80,40,180,80,100,320,60,160');
        GridGlobales.setColTypes('rotxt,ron,rotxt,rotxt,ron,rotxt,rotxt,rotxt');
        GridGlobales.setColAlign('right,right,center,left,right,left,left,left');
        GridGlobales.init();
        LayoutPrincipal.cells('b').progressOn();
        GridGlobales.load(BASE_URL + URL_MODULO + '/lista-globales-fraccionamientos/' + usrJson.empresa + '/' + periodo, () => {
            LayoutPrincipal.cells('b').progressOff();
        });
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
            let almacen = ComboAlmacen.getSelectedValue();
            if (almacen != '0') {
                let encodedDesde = ToolbarOrdenes.getValue('InputDesde');
                let encodeHasta = ToolbarOrdenes.getValue('InputHasta');
                let stintes = ToolbarOrdenes.getItemState('InputTipo') ? 'S' : 'N';
                LayoutPrincipal.cells('a').detachObject();
                GridOrdenes = LayoutPrincipal.cells('a').attachGrid();
                    GridOrdenes.setIconsPath('/assets/images/icons/grid/');
                    GridOrdenes.setImagesPath('/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/');
                    GridOrdenes.setHeader(',Periodo,Producto,#cspan,Lote,Cant.Program.,TipoDocumento,#cspan,Documento,Fecha,Solicita,DocumentoAncestro,#cspan');
                    GridOrdenes.setInitWidths('30,60,100,240,80,80,40,180,80,100,320,60,160');
                    GridOrdenes.setColTypes('ch,ron,rotxt,rotxt,rotxt,ron,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt');
                    GridOrdenes.setColAlign('center,right,right,left,right,right,right,left,left,left,left,right,left');
                    GridOrdenes.setNumberFormat('0,000',5);
                    GridOrdenes.init();
    //empresa,almacen,fdesde,fhasta,tintes
                GridOrdenes.load(BASE_URL + URL_MODULO + '/buscar-documentos/' + usrJson.empresa + '/' + almacen + '/' + encodedDesde + '/' + encodeHasta + '/' + stintes);
            }
            else {
                dhtmlx.alert({
                    type: 'alert-warning',
                    text: 'Debe seleccionar un almacén'
                });
            }
            break;
        default: break;
    }
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
        ToolbarOrdenes.addText('LabelDesde', null, 'Desde');
        ToolbarOrdenes.addInput('InputDesde', null, null, 64);
        ToolbarOrdenes.addText('LabelHasta', null, 'Hasta');
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