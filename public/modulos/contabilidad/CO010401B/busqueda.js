var structs = {
    formBusqueda: [
        { type: 'settings', position: 'label-left', labelWidth: 60, offsetLeft: 8, offsetTop: 0 },
        { type: 'fieldset', label: 'Criterio de búsqueda', inputWidth: 340, list: [
            { type: 'settings', position: 'label-left', labelWidth: 80, offsetLeft: 0 },
            { type: 'radio', name: 'modo', label: 'Nro. voucher', labelWidth: 'auto', value: '1', list: [
                { type: 'input', name: 'voucher', label: 'Voucher' }
            ], checked: true },
            { type: 'radio', name: 'modo', label: 'Rango de fechas', labelWidth: 'auto', value: '2', list: [
                { type: 'calendar', name: 'desde', label: 'Desde', enableTodayButton: true, dateFormat: '%d/%m/%Y', inputWidth: 80 },
                { type: 'calendar', name: 'hasta', label: 'Hasta', enableTodayButton: true, dateFormat: '%d/%m/%Y', inputWidth: 80 }
            ] },
            { type: 'radio', name: 'modo', label: 'Nro. de documento', labelWidth: 'auto', value: '3', list: [
                { type: 'input', name: 'documento', label: 'Documento' }
            ] },
            { type: 'container', name: 'tipodoc', label: 'Tipo de documento', labelWidth: 'auto', offsetTop: 8, position: 'label-top', inputWidth: 290, inputHeight: 320 },
            { type: 'label', offsetTop: 0, offsetLeft: 0, list: [
                { type: 'button', name: 'buscar', value: 'Buscar' },
                { type: 'newcolumn' },
                { type: 'button', name: 'exportar', value: 'Exportar', offsetLeft: 8 }
            ] }
        ] }
    ]
};

function chAll(event) {
    var checked = document.getElementById('ch-all').checked;
    gridTipoDocs.setCheckedRows(0, checked ? 1 : 0);
}

function crearGridDocumentos() {
    layoutBusqueda.cells('b').detachObject();
        layoutBusqueda.cells('b').attachStatusBar({
            paging: true,
            text: "<div id='paginacion'></div>"
        });
    gridBusqueda = layoutBusqueda.cells('b').attachGrid();
        gridBusqueda.setHeader('Voucher,F.Rmisión,Documento,Tipo,Moneda,TipoCambio,RUC/DNI,Razón social,F.Registro,Usuario Registra');
        gridBusqueda.setImagePath('/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/');
        gridBusqueda.setIconsPath('/assets/images/icons/grid/');
        gridBusqueda.setInitWidths('100,80,120,100,80,80,120,320,80,240');
        gridBusqueda.setColTypes('rotxt,rotxt,rotxt,rotxt,rotxt,ron,rotxt,rotxt,rotxt,rotxt');
        gridBusqueda.setColAlign('left,left,left,left,left,right,right,left,left,left');
        gridBusqueda.setColumnIds('voucher,femision,documento,tipodoc,moneda,tpcambio,rucdni,rsocial,fregistro,usureg');
        gridBusqueda.setNumberFormat('0,000.00', 5);
        gridBusqueda.init();
    gridBusqueda.enablePaging(true, 100, 10, 'paginacion');
    gridBusqueda.setPagingSkin('toolbar');
}

function cargaGridBusqueda(url) {
    layoutBusqueda.cells('b').progressOn();
    gridBusqueda.load(url, function() {
        layoutBusqueda.cells('b').progressOff();
    });
}

function formBusquedaOnButtonClick (button) {
    switch (button) {
        case 'buscar':
            var modo = formBusqueda.getCheckedValue('modo');
            var voucher = formBusqueda.getItemValue('voucher');
            var desde = formBusqueda.getItemValue('desde', true);
            var hasta = formBusqueda.getItemValue('hasta', true);
            var voucher = formBusqueda.getItemValue('voucher');
            var documento = formBusqueda.getItemValue('documento');
            var tipos = gridTipoDocs.getCheckedRows(0);
            if (modo == '1') {
                if (voucher == '') {
                    alert('Debe ingresar un número de voucher para buscar');
                    return;
                }
                desde = encodeURIComponent('01/01/1990');
                hasta = encodeURIComponent('01/01/1990');
                documento = '-';
            }
            else if (modo == '2') {
                if (desde == '' || hasta == '') {
                    alert('Debe definir una fecha inicial y final para la búsqueda');
                    return;
                }
                voucher = '-';
                documento = '-';
                desde = encodeURIComponent(desde);
                hasta = encodeURIComponent(hasta);
            }
            else if (modo == '3') {
                if (documento == '') {
                    alert('Debe ingresar el número de documento para buscar');
                    return;
                }
                voucher = '-';
                desde = encodeURIComponent('01/01/1990');
                hasta = encodeURIComponent('01/01/1990');
            }
            if (tipos == '') {
                alert('Debe seleccionar al menos un tipo de documento para realizar la búsqueda');
                return;
            }
            var url = '/api/CO010401B/busca-documentos/' + usrJson.empresa + '/' + modo + '/' + voucher + '/' + desde + '/' + hasta + '/' + documento + '/' + tipos;
            crearGridDocumentos();
            cargaGridBusqueda(url);
            break;
        case 'exportar':
            break;
        default: break;
    }
}

function ConfiguraTabbarBusqueda () {
    layoutBusqueda = tabbar.tabs('busqueda').attachLayout('2U');
        layoutBusqueda.cells('a').setWidth(360);
        layoutBusqueda.cells('a').hideHeader();
        layoutBusqueda.cells('b').hideHeader();
    formBusqueda = layoutBusqueda.cells('a').attachForm();
        formBusqueda.loadStruct(structs.formBusqueda);
        formBusqueda.attachEvent('onButtonClick', formBusquedaOnButtonClick);
    gridTipoDocs = new dhtmlXGridObject(formBusqueda.getContainer('tipodoc'));
        gridTipoDocs.setImagePath('/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/');
        gridTipoDocs.setIconsPath('/assets/images/icons/grid/');
        gridTipoDocs.setHeader('<input type="checkbox" id="ch-all" style="margin-left:-3px;" checked>,Tipo documento,ID');
        gridTipoDocs.attachHeader('#rspan,#text_filter,#text_filter');
        gridTipoDocs.setInitWidths('30,200,40');
        gridTipoDocs.setColTypes('ch,rotxt,rotxt');
        gridTipoDocs.setColAlign('center,left,left');
        gridTipoDocs.setColumnIds('check,tipo,codigo');
    gridTipoDocs.init();
    gridTipoDocs.load('/api/CO010401B/lista-tipos-docs/' + usrJson.empresa);
    $('#ch-all').on('click', chAll);
}