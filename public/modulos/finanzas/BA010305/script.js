var primeraCargaLista = false;
const structs = {
    formFiltro: [
        { type: 'settings', position: 'label-top' },
        { type: 'combo',offsetLeft: 8,name: 'periodo', width: '200', label: 'Periodo :', connector: BASE_URL + 'BA010305/combo-periodos/' + usrJson.empresa },
        { type: 'input', offsetLeft: 8, name: 'vendedor', width: '200', label: 'Nombre Vendedor:', value: 'Todos' },
        { type: 'hidden', name: 'codigo', value: '0' },
        { type: 'hidden', name: 'alias', value: usrJson.alias },
        { type: 'button', width: 120, offsetLeft: 6, className: 'bt-big', value: '<img src="/assets/images/icons/anim-search.svg"><span>Buscar</span>' ,name: 'buscar' }
    ],
    ribbonPlanillas: {
        icons_path: '/assets/images/icons/toolbar/',
        items: [
            {
                type:'block', text:'Opciones', mode:'cols', list:[
                    { type:'button', id:'busqueda', text:'Búsqueda', isbig: true, img: "ic-search.svg" },
                    { type:'button', id:'graficos', text:'Gráficos', isbig: true, img: "ic-chart.svg" },
                    { type:'button', id:'exportar', text:'Exportar', isbig: true, img: 'ic-export.svg' }
                ]
            },
            {
                type:'block', text:'Seguridad', list:[
                    { type:'button', id:'seguridad', text:'Seguridad' , img: 'ic-shield.svg', isbig: true },
                    { type:'button', id:'abrir', text:'Abrir planilla' , img: 'ic-open.svg', imgdis: 'ic-open-dis.svg', isbig: true },
                    { type:'button', id:'nueva', text:'Nueva planilla' , img: 'ic-add.svg', imgdis: 'ic-add-dis.svg', isbig: true },
                    { type:'button', id:'cerrar', text:'Cerrar planilla', img: 'ic-close.svg', imgdis: 'ic-close-dis.svg', isbig: true }
            ]},
            {
                type:'block', text:'Planilla', list:[
                    { type:'button', id:'conciliar', text:'Conciliación', img: 'ic-conciliacion.svg', imgdis: 'ic-conciliacion-dis.svg', isbig: true },
                    { type:'button', id:'recibo', text:'Generar recibo', img: 'ic-recibo.svg', imgdis: 'ic-recibo-dis.svg', isbig: true },
                    { type:'buttonSelect', id:'pago', text:'Registrar pago', img: 'ic-payment.svg', imgdis: 'ic-payment-dis.svg', isbig: true, items: [
                        { id: 'efectivo', text: 'Efectivo' },
                        { id: 'valores', text: 'Letra/cheque' }
                    ]},
                    { type:'button', id:'deposito', text:'Registrar depósito', img: 'ic-deposit.svg', imgdis: 'ic-deposit-dis.svg', isbig: true }
                ]
            }
        ]
    },
    formCreaPlanilla: [
        { type: 'settings', position: 'label-left', offsetLeft: 4, offsetTop: 4 },
        { type: 'block', blockOffset: 0, list: [
            { type: 'block', blockOffset: 0, list: [
                { type: 'label', label: '<img src="/assets/images/icons/window/ic-planilla-cobranza.svg" style="margin:24px 16px 12px;width:144px;"/>' }
            ] },
            { type: 'newcolumn' },
            { type: 'block', blockOffset: 0, list: [
                { type: 'settings', labelWidth: 60, inputWidth: 120, offsetBottom: 12 },
                { type: 'label', label: '<span id="sp-codigo-planilla">Listo para crear</span>', labelWidth: 230 },
                { type: 'combo', name: 'moneda', label: 'Moneda' },
                { type: 'input', label: 'Fe.Creación', name: 'fcrea' },
                { type: 'input', label: 'Importe', name: 'importe' },
                { type: 'input', label: 'Depósito', name: 'deposito' },
                { type: 'label', label: '<span id="sp-mensaje"></span>', labelWidth: 230, offsetTop: 8 },
            ] }
        ] },
        { type: 'block', blockOffset: 128, offsetTop: 0, list: [
            { type: 'button', name: 'aceptar', value: '<b>Aceptar</b>', offsetLeft: 6 },
            { type: 'newcolumn' },
            { type: 'button', name: 'cancelar', value: 'Cancelar', offsetLeft: 16 },
        ] },
    ]
};
var winListaPlanillasDetalle, winCrearPlanilla, formCrearPlanilla;

//formulario
formFiltroOnFocus = async (id) => {
    if(id == 'vendedor') {
        var output = await IniciarGridBusqueda(2, false, mainLayout);
        if(output) {
            const recaudador = output.seleccion[0];
            formFiltro.setItemValue('codigo', recaudador.codigo);
            formFiltro.setItemValue('vendedor', recaudador.nombre);
            formFiltro.setItemValue('alias', recaudador.alias);
        }
    }
}
formFiltroOnButtonClick = (name) => {
    switch(name) {
        case 'buscar':
            if(ribbonPlanillas) {
                console.log('puto el que lo lea');
            }
            else {
                ribbonPlanillas = mainTabbar.tabs('planillas').attachRibbon();
                    ribbonPlanillas.loadStruct(structs.ribbonPlanillas);
                    ribbonPlanillas.attachEvent('onClick', ribbonPlanillasOnClick);
            }
            ribbonPlanillas.disable('abrir');
            ribbonPlanillas.disable('cerrar');
            ribbonPlanillas.disable('conciliar');
            ribbonPlanillas.disable('recibo');
            mainLayout.cells('a').collapse();
            const periodo = formFiltro.getItemValue('periodo');
            const cobrador = formFiltro.getItemValue('codigo');
            CargarPlanillasCobranza(periodo, cobrador);
            GenerarGraficosPlanillas(periodo, cobrador);
            break;
        default: break;
    }
}

//grid planillas de cobranza
CargarPlanillasCobranza = (periodo, cobrador) => {
    mainLayout.cells('b').progressOn();
    if(gridPlanillas) {
        mainTabbar.tabs('planillas').detachObject();
        gridPlanillas = null;
    }
    gridPlanillas = mainTabbar.tabs('planillas').attachGrid();
        gridPlanillas.setHeader('Planilla,Caja,Fecha creación planilla,Fecha cierre,comoneda,Moneda,cotpdoc,Tipo documento,Importe POS,Importe total,Importe valores,Depósito total,Diferencia,Conciliado,Liquidado,Recibo,Periodo,Fecha aprobación cierre,Vigencia');
        gridPlanillas.setInitWidths('80,40,80,80,0,60,0,160,90,90,90,90,90,60,60,60,80,80,100');
        gridPlanillas.attachHeader('#text_filter,#select_filter,#text_filter,#text_filter,#rspan,#select_filter,#rspan,#select_filter,#numeric_filter,#numeric_filter,#numeric_filter,#numeric_filter,#numeric_filter,#select_filter,#select_filter,#select_filter,#select_filter,#text_filter,#select_filter');
        gridPlanillas.setColTypes('rotxt,rotxt,rotxt,rotxt,ron,rotxt,ron,ron,ron,ron,ron,ron,dyn,ch,ch,ch,ron,rotxt,rotxt');
        gridPlanillas.setColAlign('left,left,left,left,center,left,center,left,right,right,right,right,right,center,center,center,right,left,left');
        gridPlanillas.setColumnHidden(4,true);
        gridPlanillas.setColumnHidden(6,true);
        gridPlanillas.setNumberFormat('0,000.00',8);
        gridPlanillas.setNumberFormat('0,000.00',9);
        gridPlanillas.setNumberFormat('0,000.00',10);
        gridPlanillas.setNumberFormat('0,000.00',11);
        gridPlanillas.setNumberFormat('0,000.00',12);
        gridPlanillas.init();
    gridPlanillas.load(BASE_URL + 'BA010305/lista-planillas/' + usrJson.empresa + '/' + cobrador + '/' + periodo, gridPlanillasOnSuccess);
}
gridPlanillasOnSuccess = () => {
    primeraCargaLista = true;
    mainLayout.cells('b').progressOff();
    gridPlanillas.insertColumn(1,'','img',30);
    gridPlanillas.insertColumn(0,'','img',30);
    //
    const numRows = gridPlanillas.getRowsNum();
    for(var i = 0; i < numRows; i++) {
        const rowId = gridPlanillas.getRowId(i);
        gridPlanillas.cells(rowId,0).setValue('/assets/images/icons/grid/ic-detalle.svg^Ver detalle de la planilla');
        gridPlanillas.cells(rowId,2).setValue('/assets/images/icons/grid/ic-print.svg^Imprimir planilla');
        if(gridPlanillas.cells(rowId,15).getValue() == 0) {
            gridPlanillas.setCellTextStyle(rowId,1,'color:#f44336;font-style:italic;');
        }
        gridPlanillas.setCellTextStyle(rowId,2,'cursor:pointer;');
        gridPlanillas.setCellTextStyle(rowId,0,'cursor:pointer;');
    }
    gridPlanillas.attachEvent('onRowSelect', gridPlanillasOnRowSelect)
    gridPlanillas.attachEvent('onEditCell', (stage,rId,cInd,nValue,oValue) => {
        return false;
    });
}
gridPlanillasOnRowSelect = (rowId, colId) => {
    const co_planilla = gridPlanillas.cells(rowId,1).getValue();
    const vigencia = gridPlanillas.cells(rowId,20).getValue();
    switch(colId) {
        case 0:
            winListaPlanillasDetalle = mainLayout.dhxWins.createWindow('winGridBusqueda',0,0,1200,600);
                winListaPlanillasDetalle.setText('Visualizando la planilla <span style="color:#009688;">' + co_planilla + '</span>');
                winListaPlanillasDetalle.setModal(true);
                winListaPlanillasDetalle.keepInViewport(true);
                winListaPlanillasDetalle.center();
            ConfigurarLayoutDetallePlanilla(co_planilla);
            break;
        case 2:
        break;
        default: break;
    }
    if(vigencia == 'Vigente') {
        ribbonPlanillas.enable('cerrar');
    }
    else {
        ribbonPlanillas.disable('cerrar');
    }
}

//layout - detalle de planilla
var tabbarWinListaPlanillasDetalle, gridWinListaPlanillasPagosEfectivo, gridWinListaPlanillasValores, gridWinListaPlanillasNotas, gridWinListaPlanillasDepositos, tabbarWinListaPlanillasGraficos, winImagenVoucher, winExtractoBancario;
ConfigurarLayoutDetallePlanilla = (co_planilla) => {
    layoutWinListaPlanillas = winListaPlanillasDetalle.attachLayout('2U');
        layoutWinListaPlanillas.cells('a').setText('Detalle de la planilla');
        layoutWinListaPlanillas.cells('a').fixSize(true,true);
        layoutWinListaPlanillas.cells('b').setText('Detalle de depósitos');
        layoutWinListaPlanillas.cells('b').fixSize(true,true);
    tabbarWinListaPlanillasGraficos = layoutWinListaPlanillas.cells('a').attachTabbar();
        tabbarWinListaPlanillasGraficos.addTab('pie', 'Pagos de la planilla',null,null,true);
        tabbarWinListaPlanillasGraficos.addTab('histograma', 'Depósitos realizados');
        tabbarWinListaPlanillasGraficos.tabs('pie').attachHTMLString('<div id="dv-chart-pie" style="height:100%;width:100%;"><p>Gráfico circular</p></div>');
        tabbarWinListaPlanillasGraficos.tabs('histograma').attachHTMLString('<div id="dv-chart-histograma" style="height:100%;width:100%;"><p>Gráfico histograma pagos</p></div>');
    tabbarWinListaPlanillasDetalle = layoutWinListaPlanillas.cells('a').attachTabbar();
        tabbarWinListaPlanillasDetalle.addTab('efectivo','Efectivo',null,null,true);
        tabbarWinListaPlanillasDetalle.addTab('valores','Cheques/Letras');
        tabbarWinListaPlanillasDetalle.addTab('notas','Notas de crédito');
    gridWinListaPlanillasPagosEfectivo = tabbarWinListaPlanillasDetalle.tabs('efectivo').attachGrid();
        gridWinListaPlanillasPagosEfectivo.setHeader('Documento,Moneda,Importe cobranza,Tipo de cobro,Letra/cheque,Recibo entregado,Documento pago,Fecha vencimiento');
        gridWinListaPlanillasPagosEfectivo.setInitWidthsP('15,8,12,15,10,10,20,10');
        gridWinListaPlanillasPagosEfectivo.setColTypes('rotxt,rotxt,ron,rotxt,ch,ch,rotxt,rotxt');
        gridWinListaPlanillasPagosEfectivo.setColAlign('left,left,right,left,center,center,left,left');
        gridWinListaPlanillasPagosEfectivo.setNumberFormat('0,000.00',2);
        gridWinListaPlanillasPagosEfectivo.init();
    gridWinListaPlanillasValores = tabbarWinListaPlanillasDetalle.tabs('valores').attachGrid();
        gridWinListaPlanillasValores.setHeader('Cheque,Fecha,Cliente,Importe,Saldo,Banco,Moneda,Documento');
        gridWinListaPlanillasValores.setInitWidths('80,80,240,100,100,120,60,80');
        gridWinListaPlanillasValores.setColTypes('rotxt,rotxt,rotxt,ron,ron,rotxt,rotxt,rotxt');
        gridWinListaPlanillasValores.setColAlign('left,left,left,right,right,left,left,left');
        gridWinListaPlanillasValores.setNumberFormat('0,000.00',3);
        gridWinListaPlanillasValores.setNumberFormat('0,000.00',4);
        gridWinListaPlanillasValores.init();
    gridWinListaPlanillasNotas = tabbarWinListaPlanillasDetalle.tabs('notas').attachGrid();
        gridWinListaPlanillasNotas.setHeader('Nota crédito,Documento,Fecha,Cliente,Importe,Referencia');
        gridWinListaPlanillasNotas.setInitWidthsP('10,10,10,50,10,10');
        gridWinListaPlanillasNotas.setColTypes('rotxt,rotxt,rotxt,rotxt,ron,rotxt');
        gridWinListaPlanillasNotas.setColAlign('left,left,left,left,right,left');
        gridWinListaPlanillasNotas.setNumberFormat('0,000.00',4);
        gridWinListaPlanillasNotas.init();
    gridWinListaPlanillasDepositos = layoutWinListaPlanillas.cells('b').attachGrid();
        gridWinListaPlanillasDepositos.setHeader('Banco,Conciliado,Nro.Cuenta,Nro.Comprobante,Importe,Fecha Registro,Transacción,Fecha Conciliación,Periodo');
        gridWinListaPlanillasDepositos.setInitWidthsP('11,5,16,12,12,10,10,9,5');
        gridWinListaPlanillasDepositos.setColTypes('rotxt,ch,rotxt,rotxt,ron,rotxt,rotxt,rotxt,ron');
        gridWinListaPlanillasDepositos.setColAlign('left,center,left,left,right,left,left,left,left');
        gridWinListaPlanillasDepositos.setNumberFormat('0,000.00',4);
        gridWinListaPlanillasDepositos.init();
    //carga los datos alv
    CargarPagosEfectivo(co_planilla);
    CargarPagosLetrasCheques(co_planilla);
    CargarPagosPlanillasNotas(co_planilla);
    CargarPagosDepositos(co_planilla);
}

//grid pagos en efectivo
CargarPagosEfectivo = (co_planilla) => {
    tabbarWinListaPlanillasDetalle.tabs('efectivo').progressOn();
    gridWinListaPlanillasPagosEfectivo.load(BASE_URL + 'BA010304/mostrar-pagos-efectivo/' + usrJson.empresa + '/' + co_planilla, PagosEfectivoSuccess);
}
PagosEfectivoSuccess = () => {
    gridWinListaPlanillasPagosEfectivo.attachEvent('onEditCell', PagosEfectivoOnEditCell);
    tabbarWinListaPlanillasDetalle.tabs('efectivo').progressOff();
}
PagosEfectivoOnEditCell = (stage,rId,cInd,nValue,oValue) => {
    return false;
}

//grid pagos letras/cheques
CargarPagosLetrasCheques = (co_planilla) => {
    tabbarWinListaPlanillasDetalle.tabs('valores').progressOn();
    gridWinListaPlanillasValores.load(BASE_URL + 'BA010304/mostrar-pagos-cheques/' + usrJson.empresa + '/' + co_planilla, PagosLetrasChequesSuccess);
}
PagosLetrasChequesSuccess = () => {
    tabbarWinListaPlanillasDetalle.tabs('valores').progressOff();
}

//grid pagos notas de credito
CargarPagosPlanillasNotas = (co_planilla) => {
    tabbarWinListaPlanillasDetalle.tabs('notas').progressOn();
    gridWinListaPlanillasNotas.load(BASE_URL + 'BA010304/mostrar-pagos-notas/' + usrJson.empresa + '/' + co_planilla, PagosPlanillasNotasSuccess);
}
PagosPlanillasNotasSuccess = () => {
    tabbarWinListaPlanillasDetalle.tabs('notas').progressOff();
}

//grid depositos
CargarPagosDepositos = (co_planilla) => {
    layoutWinListaPlanillas.cells('b').progressOn();
    gridWinListaPlanillasDepositos.load(BASE_URL + 'BA010304/mostrar-depositos-planilla/' + usrJson.empresa + '/' + co_planilla, PagosDepositosSuccess);
}
PagosDepositosSuccess = () => {
    gridWinListaPlanillasDepositos.attachEvent('onEditCell', PagosDepositosOnEditCell);
    gridWinListaPlanillasDepositos.insertColumn(6,'','img',5);
    gridWinListaPlanillasDepositos.insertColumn(0,'','img',5);
    const numRows = gridWinListaPlanillasDepositos.getRowsNum();
    for(var i = 0; i < numRows; i++) {
        const rowId = gridWinListaPlanillasDepositos.getRowId(i);
        gridWinListaPlanillasDepositos.cells(rowId,0).setValue('/assets/images/icons/grid/ic-picture.svg^Ver imagen voucher');
        gridWinListaPlanillasDepositos.cells(rowId,7).setValue('/assets/images/icons/grid/ic-extracto.svg^Ver extracto bancario');
        gridWinListaPlanillasDepositos.setCellTextStyle(rowId,0,'cursor:pointer;');
        gridWinListaPlanillasDepositos.setCellTextStyle(rowId,7,'cursor:pointer;');
    }
    gridWinListaPlanillasDepositos.attachEvent('onRowSelect', gridWinListaPlanillasDepositosOnRowSelect);
    layoutWinListaPlanillas.cells('b').progressOff();
}
PagosDepositosOnEditCell = (stage,rId,cInd,nValue,oValue) => {
    return false;
}
gridWinListaPlanillasDepositosOnRowSelect = (rowId,colId) => {
    switch(colId) {
        case 0:
            winImagenVoucher = mainLayout.dhxWins.createWindow('winImagenVoucher',0,0,480,320);
                winImagenVoucher.setText('Mostrando imagen del voucher');
                winImagenVoucher.setModal(true);
                winImagenVoucher.keepInViewport(true);
                winImagenVoucher.center();
            const cuenta = gridWinListaPlanillasDepositos.cells(rowId,3).getValue();
            const operacion = gridWinListaPlanillasDepositos.cells(rowId,4).getValue();
            const periodo = gridWinListaPlanillasDepositos.cells(rowId,10).getValue();
            winImagenVoucher.attachURL('/files/img-voucher/' + cuenta + '/' + periodo + '/' + operacion);
            break;
        case 7:
            winExtractoBancario = mainLayout.dhxWins.createWindow('winExtractoBancario',0,0,480,320);
                winExtractoBancario.setText('Control depósitos');
                winExtractoBancario.setModal(true);
                winExtractoBancario.keepInViewport(true);
                winExtractoBancario.center();
            break;
    }
}

//ribbon - planillas de cobranza
ribbonPlanillasOnClick = async (id) => {
    switch(id) {
        case 'busqueda':
            if(mainLayout.cells('a').isCollapsed()) mainLayout.cells('a').expand();
            else mainLayout.cells('a').collapse();
            break;
        case 'graficos':
            if(mainLayout.cells('c').isCollapsed()) mainLayout.cells('c').expand();
            else mainLayout.cells('c').collapse();
            break;
        case 'seguridad':
            const windowId = 57;
            var output = await IniciarFormularioSeguridad(windowId, mainLayout);
            const jOutput = JSON.parse(output);
            if(jOutput && jOutput.result == 'S') {
                ribbonPlanillas.enable('abrir');
                ribbonPlanillas.enable('conciliar');
                ribbonPlanillas.enable('recibo');
            }
            else {
                ribbonPlanillas.disable('abrir');
                ribbonPlanillas.disable('conciliar');
                ribbonPlanillas.disable('recibo');
            }
            break;
        case 'nueva':
            CrearPlanillaCobranza();
            break;
        case 'cerrar':
            CerrarPlanillaCobranza();
            break;
        case 'abrir':
            const rowId = gridPlanillas.getSelectedRowId();
            if(rowId > -1) {
                const planilla = gridPlanillas.cells(rowId,1).getValue();
                const recaudador = formFiltro.getItemValue('codigo');
                dhtmlx.confirm('¿Desea abrir la planilla ' + planilla + '?', (result) => {
                    if(result) {
                        const params = {
                            planilla: planilla,
                            cobrador: recaudador,
                            empresa: usrJson.empresa
                        };
                        $.post(BASE_URL + 'BA010305/abrir-planilla', params, (response) => {
                            if(response.state == 'success') {
                                const iPeriodo = formFiltro.getItemValue('periodo');
                                CargarPlanillasCobranza(iPeriodo, recaudador);
                                dhtmlx.alert('Se abrió la planilla ' + planilla + '.');
                            }
                            else alert(response.message);
                        }, 'json');
                    }
                });
            }
            break;
        default: break;
    }
}

CerrarPlanillaCobranza = () => {
    const rowId = gridPlanillas.getSelectedRowId();
    if(rowId > -1) {
        const planilla = gridPlanillas.cells(rowId,1).getValue();
        const recaudador = formFiltro.getItemValue('codigo');
        const alias = formFiltro.getItemValue('alias');
        dhtmlx.confirm('¿Desea cerrar la planilla ' + planilla + '?', (result) => {
            if(result) {
                const params = {
                    alias: alias
                };
                $.post(BASE_URL + 'BA010305/cerrar-planilla', params, (response) => {
                    if(response.state == 'success') {
                        const iPeriodo = formFiltro.getItemValue('periodo');
                        const output = response.data;
                        if(output.resultado == 1) CargarPlanillasCobranza(iPeriodo, recaudador);
                        dhtmlx.alert(output.mensaje);
                    }
                    else alert(response.message);
                }, 'json');
            }
        });
    }
}

CrearPlanillaCobranza = () => {
    winCrearPlanilla = mainLayout.dhxWins.createWindow('winCrearPlanilla',0,0,480,320);
        winCrearPlanilla.setText('Crear planilla de cobranza');
        winCrearPlanilla.setModal(true);
        winCrearPlanilla.keepInViewport(true);
        winCrearPlanilla.center();
        winCrearPlanilla.button('close').hide();
        winCrearPlanilla.button('park').hide();
        winCrearPlanilla.button('minmax').hide();
    formCrearPlanilla = winCrearPlanilla.attachForm();
        formCrearPlanilla.loadStruct(structs.formCreaPlanilla, () => {
            const recaudador = formFiltro.getItemValue('codigo');
            const params = {
                empresa: usrJson.empresa,
                vendedor: recaudador
            };
            $.post(BASE_URL + 'BA010305/buscar-planilla-vigente', params, (response) => {
                if(response.state == 'success') {
                    if(response.data.resultado == 1) {
                        //existe una planilla!
                        const iPlanilla = response.data.planilla;
                        $('#sp-codigo-planilla').text(iPlanilla.codigo + ' abierta').css('color','#e53935');
                        formCrearPlanilla.getCombo('moneda').setComboText(iPlanilla.nmoneda);
                        formCrearPlanilla.setItemValue('fcrea', iPlanilla.fcreacion.substr(0,10));
                        formCrearPlanilla.setItemValue('importe', iPlanilla.importe.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}));
                        formCrearPlanilla.setItemValue('deposito', iPlanilla.deposito.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}));
                        $('#sp-mensaje').text('Primero cierre la planilla actual');
                        formCrearPlanilla.disableItem('aceptar');
                    }
                    else {
                        formCrearPlanilla.getCombo('moneda').load(BASE_URL + 'BA010305/lista-monedas/' + usrJson.empresa + '/' + recaudador);
                        formCrearPlanilla.setReadonly('moneda',true);
                        formCrearPlanilla.setReadonly('fcrea',true);
                        formCrearPlanilla.setReadonly('importe',true);
                        formCrearPlanilla.setReadonly('deposito',true);
                        //colocar valores por defecto
                        formCrearPlanilla.setItemValue('fcrea', new Date().toISOString().substr(0,10));
                        formCrearPlanilla.setItemValue('importe', "0.00");
                        formCrearPlanilla.setItemValue('deposito', "0.00");
                    }
                }
                else alert(response.message);
            }, 'json');
        });
        formCrearPlanilla.attachEvent('onButtonClick', formCrearPlanillaOnClick);
}

formCrearPlanillaOnClick = (id) => {
    switch(id) {
        case 'aceptar':
            formCrearPlanilla.disableItem('aceptar');
            const params = {
                empresa: usrJson.empresa,
                vendedor: formFiltro.getItemValue('codigo'),
                moneda: formCrearPlanilla.getCombo('moneda').getSelectedValue(),
                docadmin: 54,
                ptoventa: 1,
                cerrada: 0,
                covariable: 74
            };
            $.post(BASE_URL + 'BA010305/crear-nueva-planilla', params, (response) => {
                if(response.state == 'success') {
                    const out = response.data;
                    if(out.resultado == 1) {
                        const iPeriodo = formFiltro.getItemValue('periodo');
                        const iVendedor = formFiltro.getItemValue('codigo');
                        document.getElementById('sp-codigo-planilla').innerHTML = out.mensaje + ' creada';
                        document.getElementById('sp-mensaje').innerHTML = 'Planilla creada con éxito';
                        CargarPlanillasCobranza(iPeriodo, iVendedor);
                    }
                    else alert(out.mensaje);
                }
                else alert(response.message);
            }, 'json');
            break;
        case 'cancelar':
            winCrearPlanilla.close();
            break;
        default: break;
    }
}

GenerarGraficosPlanillas = (periodo, cobrador) => {
    //configura el formato de numeros en highcharts
    Highcharts.setOptions({
        lang: {
            thousandsSep: ','
        }
    });
    $('#dv-graficos').empty().append(
        $('<div>').attr('id','ch-div-1').addClass('ch-div')
    ).append(
        $('<div>').attr('id','ch-div-2').addClass('ch-div')
    ).append(
        $('<div>').attr('id','ch-div-3').addClass('ch-div')
    );
    const params = {
        empresa: usrJson.empresa,
        periodo: periodo,
        cobrador: cobrador
    };
    $.post(BASE_URL + 'BA010305/grafico-12', params, Grafico12Success, 'json');
    $.post(BASE_URL + 'BA010305/grafico-3', params, Grafico3Success, 'json');
}

Grafico12Success = (response) => {
    if(response.state == 'success') {
        const rows = response.data.grafico;
        const arr_g1 = [];
        const arr_g2_names = [];
        const arr_g2_s = [];
        const arr_g2_n = [];
        for(var i in rows) {
            const iRow = rows[i];
            const iImporte = parseFloat(iRow.IMPORTE);
            var iDeposito = parseFloat(iRow.DEPOSITO);
            arr_g1.push({
                codigo: iRow.CODIGO,
                name: iRow.TIPO,
                y: parseFloat(iImporte)
            });
            arr_g2_names.push(iRow.TIPO);
            //
            if(iDeposito > iImporte) iDeposito = iImporte;
            arr_g2_s.push(iDeposito);
            arr_g2_n.push(iImporte - iDeposito);
        }
        Highcharts.chart('ch-div-1', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Importes por tipo de planilla'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: 'S/ {point.y:,.2f} ({point.percentage:.2f} %)',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    },
                    showInLegend: true
                }
            },
            series: [{
                name: 'Tipos de planilla',
                colorByPoint: true,
                data: arr_g1
            }]
        });
        Highcharts.chart('ch-div-2', {
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Avance de depósitos'
            },
            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>S/ {point.y}</b> ({point.percentage:.2f}%)<br/>'
            },
            xAxis: {
                categories: arr_g2_names
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Depósitos porcentuales'
                }
            },
            legend: {
                reversed: true
            },
            plotOptions: {
                series: {
                    stacking: 'percent'
                },
                bar: {
                    dataLabels: {
                        enabled: true,
                        format: '{point.percentage:.2f}%',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    },
                }
            },
            series: [{
                name: 'Depositado',
                data: arr_g2_s
            }, {
                name: 'No depositado',
                data: arr_g2_n
            }]
        });
    }
    else alert(response.message);
}
Grafico3Success = (response) => {
    if(response.state == 'success') {
        const rows = response.data.grafico;
        const arr_g3_s = [];
        const arr_g3_n = [];
        const arr_g3_series = [];
        for(var i in rows) {
            const iRow = rows[i];
            arr_g3_s.push(parseInt(iRow.CONCILIADAS));
            arr_g3_n.push(parseInt(iRow.PLANILLAS) - parseInt(iRow.CONCILIADAS));
            arr_g3_series.push(iRow.TIPO);
        }
        Highcharts.chart('ch-div-3', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Conciliación de planillas'
            },
            xAxis: {
                categories: arr_g3_series
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Total planillas'
                }
            },
            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.2f}%)<br/>',
                shared: true
            },
            plotOptions: {
                column: {
                    stacking: 'percent'
                }
            },
            series: [{
                name: 'Conciliadas',
                data: arr_g3_s
            }, {
                name: 'Por conciliar',
                data: arr_g3_n
            }]
        });
    }
    else alert(response.message);
}