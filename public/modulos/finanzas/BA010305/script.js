var primeraCargaLista = false;
const structs = {
    formFiltro: [
        { type: 'settings', position: 'label-top' },
        { type: 'combo',offsetLeft: 8,name: 'periodo', width: '200', label: 'Periodo :', connector: BASE_URL + 'BA010305/combo-periodos/' + usrJson.empresa },
        { type: 'input', offsetLeft: 8, name: 'vendedor', width: '200', label: 'Nombre Vendedor:', value: (usrJson.stadmin == 'S' ? 'Todos' : (usrJson.nombre + ' ' + usrJson.apepat + ' ' + usrJson.apemat)) },
        { type: 'hidden', name: 'codigo', value: (usrJson.stadmin == 'S' ? '0' : usrJson.codigo) },
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
                    { type:'button', id:'pago', text:'Registrar pago', img: 'ic-payment.svg', imgdis: 'ic-payment-dis.svg', isbig: true },
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
    ],
    formPagoCliente: [
        { type: 'settings', position: 'label-left', labelWidth: 80, offsetLeft: 12, offsetTop: 8 },
        { type: 'input', label: 'Cliente', name: 'cliente', offsetTop: 12, inputWidth: 360 },
        { type: 'hidden', name: 'ruc' },
        { type: 'container', label: 'Documento', name: 'docsContainer', inputWidth: 480, inputHeight: 260 },
        { type: 'combo', label: 'Tipo Pago', name: 'tpago', connector: '/api/BA010305/combo-tipos-cobro', inputWidth: 120 },
        { type: 'block', blockOffset: 128, offsetTop: 0, list: [
            { type: 'button', name: 'aceptar', value: '<b>Aceptar</b>', offsetLeft: 6 },
            { type: 'newcolumn' },
            { type: 'button', name: 'cancelar', value: 'Cancelar', offsetLeft: 16 },
        ] }
    ],
    formPagoClienteEfectivo: [
        { type: 'settings', position: 'label-left', offsetLeft: 4, offsetTop: 4 },
        { type: 'block', blockOffset: 0, list: [
            { type: 'block', blockOffset: 0, list: [
                { type: 'label', label: '<img src="/assets/images/icons/window/ic-planilla-cobranza.svg" style="margin:24px 16px 12px;width:144px;"/>' }
            ] },
            { type: 'newcolumn' },
            { type: 'block', blockOffset: 0, list: [
                { type: 'settings', labelWidth: 60, inputWidth: 120, offsetTop: 24 },
                { type: 'hidden', name: 'tpcobro' },
                { type: 'hidden', name: 'documento' },
                { type: 'label', label: 'Documento', labelWidth: 230, offsetTop: 32 },
                { type: 'label', label: '<span id="sp-codigo-documento"></span>', labelWidth: 230, offsetTop: 8 },
                { type: 'input', label: 'Importe', name: 'importe', offsetTop: 24 },
                { type: 'block', offsetLeft: 0, offsetTop: 24, inputWidth: 320, list: [
                    { type: 'button', name: 'aceptar', value: '<b>Registrar pago</b>', offsetLeft: 6 },
                    { type: 'newcolumn' },
                    { type: 'button', name: 'cancelar', value: 'Cancelar', offsetLeft: 8 },
                ] }
            ] }
        ] }
    ],
    formPagoClienteCheque: [
        { type: 'settings', position: 'label-left', offsetLeft: 4, offsetTop: 4 },
        { type: 'block', blockOffset: 0, list: [
            { type: 'block', blockOffset: 0, list: [
                { type: 'label', label: '<img src="/assets/images/icons/window/ic-planilla-cobranza.svg" style="margin:24px 16px 12px;width:144px;"/>' }
            ] },
            { type: 'newcolumn' },
            { type: 'block', blockOffset: 0, list: [
                { type: 'settings', labelWidth: 75, inputWidth: 120, offsetTop: 16 },
                { type: 'hidden', name: 'tpcobro' },
                { type: 'hidden', name: 'documento' },
                { type: 'label', label: 'Documento', labelWidth: 230, offsetTop: 24 },
                { type: 'label', label: '<span id="sp-codigo-documento"></span>', labelWidth: 230, offsetTop: 8 },
                { type: 'input', label: 'Importe', name: 'importe', offsetTop: 24 },
                { type: 'combo', label: 'Banco', name: 'banco', inputWidth: 160, connector: '/api/BA010305/combo-bancos' },
                { type: 'input', label: 'Nro.Comprobante', name: 'nrodoc' },
                { type: 'calendar', label: 'Vencimiento', name: 'fecha', dateFormat: '%Y-%m-%d' },
                { type: 'block', offsetLeft: 0, offsetTop: 24, inputWidth: 320, list: [
                    { type: 'button', name: 'aceptar', value: '<b>Registrar pago</b>', offsetLeft: 6 },
                    { type: 'newcolumn' },
                    { type: 'button', name: 'cancelar', value: 'Cancelar', offsetLeft: 8 },
                ] }
            ] }
        ] }
    ],
    formPagoClienteCertifRet: [
        { type: 'settings', position: 'label-left', offsetLeft: 4, offsetTop: 4 },
        { type: 'block', blockOffset: 0, list: [
            { type: 'block', blockOffset: 0, list: [
                { type: 'label', label: '<img src="/assets/images/icons/window/ic-planilla-cobranza.svg" style="margin:24px 16px 12px;width:144px;"/>' }
            ] },
            { type: 'newcolumn' },
            { type: 'block', blockOffset: 0, list: [
                { type: 'settings', labelWidth: 75, inputWidth: 120, offsetTop: 16 },
                { type: 'hidden', name: 'tpcobro' },
                { type: 'hidden', name: 'documento' },
                { type: 'label', label: 'Documento', labelWidth: 230, offsetTop: 24 },
                { type: 'label', label: '<span id="sp-codigo-documento"></span>', labelWidth: 230, offsetTop: 8 },
                { type: 'input', label: 'Importe', name: 'importe', inputWidth: 160, offsetTop: 24 },
                { type: 'input', label: 'Serie', name: 'serie', inputWidth: 80 },
                { type: 'input', label: 'Número', name: 'nrodoc', inputWidth: 80 },
                { type: 'calendar', label: 'Fecha', name: 'fecha', dateFormat: '%Y-%m-%d' },
                { type: 'block', offsetLeft: 0, offsetTop: 24, inputWidth: 320, list: [
                    { type: 'button', name: 'aceptar', value: '<b>Registrar pago</b>', offsetLeft: 6 },
                    { type: 'newcolumn' },
                    { type: 'button', name: 'cancelar', value: 'Cancelar', offsetLeft: 8 },
                ] }
            ] }
        ] }
    ],
    formDepositoPlanilla: [
        { type: 'settings', position: 'label-left', offsetLeft: 4, offsetTop: 4 },
        { type: 'block', blockOffset: 0, list: [
            { type: 'block', blockOffset: 0, list: [
                { type: 'settings', labelWidth: 75, inputWidth: 80, offsetTop: 12 },
                { type: 'hidden', name: 'vendedor' },
                { type: 'hidden', name: 'fname' },
                { type: 'combo', label: 'Planilla', name: 'planilla', inputWidth: 120, connector: '' },
                { type: 'combo', label: 'Banco', name: 'banco', inputWidth: 180, connector: '/api/BA010305/combo-bancos' },
                { type: 'combo', label: 'Cuenta', name: 'cuenta', inputWidth: 160 },
                { type: 'calendar', label: 'Fecha', name: 'fecha', dateFormat: '%Y-%m-%d' },
                { type: 'input', label: 'Nro.Operación', name: 'operacion' },
                { type: 'input', label: '<b style="color:#009688;">Importe</b>', name: 'importe', inputWidth: 100 },
                { type: 'button', name: 'aceptar', value: '<b>Registrar depósito</b>', offsetLeft: 24, offsetTop: 24 },
                { type: 'button', name: 'cancelar', value: 'Cancelar', offsetLeft: 24, offsetTop: 2 }
                /*{ type: 'block', offsetLeft: 0, offsetTop: 24, inputWidth: 20, offsetLeft: 16, list: [
                    { type: 'button', name: 'aceptar', value: '<b>Registrar depósito</b>', offsetLeft: 6 },
                    { type: 'newcolumn' },
                    { type: 'button', name: 'cancelar', value: 'Cancelar', offsetLeft: 8 },
                ] }*/
            ] },
            { type: 'newcolumn' },
            { type: 'block', blockOffset: 16, list: [
                { type: 'settings', labelWidth: 50, inputWidth: 120, offsetTop: 12 },
                { type: 'file', label: 'Voucher', name: 'voucher' },
                { type: 'container', label: '&nbsp;', name: 'preview', inputWidth: 200, offsetTop: 12 }
            ] }
        ] }
    ],
    formConciliacion: [
        { type: 'settings', position: 'label-left', labelWidth: 80, offsetLeft: 10 },
        { type: 'input',offsetLeft: 8,name: 'planilla', inputWidth: 200, label: 'Planilla:', offsetTop: 10 },
        { type: 'input', offsetLeft: 8, name: 'fecha', inputWidth: 80, label: 'Fecha: ', value: new Date().toISOString().split('T')[0] },
        { type: 'container', label: 'Documentos', name: 'conciliaciones', inputWidth: 360, inputHeight: 440 },
        { type: 'button', width: 120, offsetLeft: 90, className: 'bt-big', value: '<b>Conciliar</b>', name: 'conciliar', offsetTop: 15 }
    ],
    formReciboPlanilla: [
        { type: 'settings', position: 'label-left', labelWidth: 80, offsetLeft: 10 },
        { type: 'combo', offsetLeft: 8,name: 'serie', inputWidth: 120, label: 'Serie:', offsetTop: 10, connector: '/api/BA010305/combo-series/' + usrJson.empresa },
        { type: 'input', offsetLeft: 8,name: 'concepto', inputWidth: 240, label: 'Concepto:', offsetTop: 10 },
        { type: 'input', offsetLeft: 8,name: 'codigo', inputWidth: 100, label: 'Recaudador:', offsetTop: 10 },
        { type: 'input', offsetLeft: 8,name: 'recaudador', inputWidth: 260, label: '&nbsp;', offsetTop: 10 },
        { type: 'button', width: 144, offsetLeft: 90, className: 'bt-big', value: '<b>Generar recibo</b>', name: 'generar', offsetTop: 15 }
    ]
};
var winListaPlanillasDetalle, winCrearPlanilla, formCrearPlanilla, formPagoClientePagar, winDeposito, formDepositoPlanilla, winRecibo, formRecibo;

//formulario
formFiltroOnFocus = async (id) => {
    if(usrJson.stadmin == 'S') {
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
                if(usrJson.stadmin != 'S') {
                    ribbonPlanillas.hide('graficos');
                    ribbonPlanillas.hide('seguridad');
                    ribbonPlanillas.hide('abrir');
                    ribbonPlanillas.hide('conciliar');
                    ribbonPlanillas.hide('recibo');
                }
            }
            ribbonPlanillas.disable('abrir');
            ribbonPlanillas.disable('cerrar');
            ribbonPlanillas.disable('conciliar');
            ribbonPlanillas.disable('recibo');
            ribbonPlanillas.disable('pago');
            //ribbonPlanillas.disable('deposito');
            mainLayout.cells('a').collapse();
            const periodo = formFiltro.getItemValue('periodo');
            const cobrador = usrJson.stadmin != 'S' ? usrJson.codigo : formFiltro.getItemValue('codigo')
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
        gridPlanillas.setIconsPath('/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/');
        gridPlanillas.setColumnHidden(4,true);
        gridPlanillas.setColumnHidden(6,true);
        gridPlanillas.setNumberFormat('0,000.00',8);
        gridPlanillas.setNumberFormat('0,000.00',9);
        gridPlanillas.setNumberFormat('0,000.00',10);
        gridPlanillas.setNumberFormat('0,000.00',11);
        gridPlanillas.setNumberFormat('0,000.00',12);
        gridPlanillas.init();
    gridPlanillas.load(BASE_URL + 'BA010305/lista-planillas/' + usrJson.empresa + '/' + cobrador + '/' + periodo, gridPlanillasOnSuccess);
    //
    layoutDepositos.cells('a').detachObject();
    gridDepositos = layoutDepositos.cells('a').attachGrid();
        gridDepositos.setHeader('Comprobante,Planilla,Banco,Importe depósito,Depósito total planilla,Importe planilla,Cuenta,,Fecha depósito,Transacción bancaria,');
        gridDepositos.setInitWidths('100,100,240,120,120,120,150,30,90,100,30');
        gridDepositos.attachHeader('#text_filter,#text_filter,#select_filter,#numeric_filter,#numeric_filter,#numeric_filter,#select_filter,#rspan,#text_filter,#text_filter,#rspan');
        gridDepositos.setColTypes('rotxt,rotxt,rotxt,ron,ron,ron,rotxt,img,rotxt,rotxt,img');
        gridDepositos.setColAlign('right,left,left,right,right,right,left,center,left,left,left');
        gridDepositos.setIconsPath('/assets/images/icons/grid/');
        gridDepositos.setNumberFormat('0,000.00',3);
        gridDepositos.setNumberFormat('0,000.00',4);
        gridDepositos.setNumberFormat('0,000.00',5);
        gridDepositos.init();
    gridDepositos.load('/api/BA010305/lista-depositos/' + cobrador + '/' + usrJson.empresa + '/' + periodo, gridDepositosOnSuccess);
    //carga el grafico de periodos
    const params = {
        vendedor: cobrador,
        empresa: usrJson.empresa,
        periodo: periodo
    };
    $.post('/api/BA010305/grafico-depositos', params, (response) => {
        if(response.state == 'success') {
            $('#ch-depositos').highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: 1,//null,
                    plotShadow: false
                },
                title: {
                    text: 'Depósitos'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>S/ {point.y:.2f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    name: 'Importe depositado',
                    data: [
                        ['Depositado', parseFloat(response.data.deposito)],
                        ['Faltante', parseFloat(response.data.nodepo)]
                    ]
                }]
            });
        }
        else alert(response.message);
    }, 'json');
    //grid de depositos
    CargarRecibosCaja(cobrador);
}
CargarRecibosCaja = (cobrador) => {
    if(gridRecibosCaja) {
        mainTabbar.tabs('recibos').detachObject();
        gridRecibosCaja = null;
    }
    gridRecibosCaja = mainTabbar.tabs('recibos').attachGrid();
        gridRecibosCaja.setHeader('#,,Nro. recibo,Fecha registro,Código recaudador,Recaudador,Ingreso,Depósito,Recibido,Concepto,Código registra,Registra');
        gridRecibosCaja.setInitWidths('30,30,100,100,80,240,120,120,120,240,80,240');
        gridRecibosCaja.attachHeader('#rspan,"rspan,#text_filter,#text_filter,#text_filter,#text_filter,#numeric_filter,#numeric_filter,#numeric_filter,#text_filter,#text_filter,#text_filter');
        gridRecibosCaja.setColTypes('ron,img,rotxt,rotxt,ron,rotxt,ron,ron,dyn,rotxt,ron,rotxt');
        gridRecibosCaja.setColAlign('right,center,left,right,right,left,right,right,right,left,right,left');
        gridRecibosCaja.setIconsPath('/assets/images/icons/grid/');
        gridRecibosCaja.setNumberFormat('0,000.00',6);
        gridRecibosCaja.setNumberFormat('0,000.00',7);
        gridRecibosCaja.setNumberFormat('0,000.00',8);
        gridRecibosCaja.init();
        mainTabbar.tabs('recibos').progressOn();
        gridRecibosCaja.load('/api/BA010305/lista-recibos/' + usrJson.empresa + '/' + cobrador + '/R', gridRecibosCajaOnSuccess);
}
gridRecibosCajaOnSuccess = () => {
    const numRows = gridRecibosCaja.getRowsNum();
    for(var i = 0; i < numRows; i++) {
        gridRecibosCaja.cells2(i,0).setValue(i + 1);
        gridRecibosCaja.cells2(i,1).setValue('ic-print.svg^Imprimir recibo');
    }
    mainTabbar.tabs('recibos').progressOff();
}
gridDepositosOnSuccess = () => {
    gridDepositos.attachEvent('onRowSelect', (rowId, colId) => {
        if(colId == 10) {
            winImagenVoucher = mainLayout.dhxWins.createWindow('winImagenVoucher',0,0,480,320);
                winImagenVoucher.setText('Mostrando imagen del voucher');
                winImagenVoucher.setModal(true);
                winImagenVoucher.keepInViewport(true);
                winImagenVoucher.center();
            const cuenta = gridDepositos.cells(rowId,6).getValue();
            const operacion = gridDepositos.cells(rowId,0).getValue();
            const vFecha = gridDepositos.cells(rowId,8).getValue().split('-');
            winImagenVoucher.attachURL('/files/img-voucher/' + cuenta + '/' + vFecha[0] + vFecha[1] + '/' + operacion);
        }
    });
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
        gridPlanillas.cells(rowId,0).setValue('../../../../../../images/icons/grid/ic-detalle.svg^Ver detalle de la planilla');
        gridPlanillas.cells(rowId,2).setValue('../../../../../../images/icons/grid/ic-print.svg^Imprimir planilla');
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
    const liquidado = gridPlanillas.cells(rowId,16).getValue();
    const recibo = gridPlanillas.cells(rowId,17).getValue();
    const importe = gridPlanillas.cells(rowId,12).getValue();
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
        ribbonPlanillas.enable('pago');
    }
    else {
        ribbonPlanillas.disable('cerrar');
        ribbonPlanillas.disable('pago');
    }/*
    if(liquidado == 0 && recibo == 0 && (importe > 0 || vigencia == 'Vigente')) {
        ribbonPlanillas.enable('deposito');
    }
    else {
        ribbonPlanillas.disable('deposito');
    }*/
}

//layout - detalle de planilla
var tabbarWinListaPlanillasDetalle, gridWinListaPlanillasPagosEfectivo, gridWinListaPlanillasValores, gridWinListaPlanillasNotas, gridWinListaPlanillasDepositos, tabbarWinListaPlanillasGraficos, winImagenVoucher, winPago, tabbarPago, gridPagoDocumentos, winExtractoBancario;
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
        gridWinListaPlanillasPagosEfectivo.setHeader('Documento,Moneda,Importe cobranza,Tipo de cobro,Letra/cheque,Recibo entregado,Documento pago,Fecha vencimiento,');
        gridWinListaPlanillasPagosEfectivo.setInitWidthsP('15,8,12,15,10,10,14,11,0');
        gridWinListaPlanillasPagosEfectivo.setColTypes('rotxt,rotxt,ron,rotxt,ch,ch,rotxt,rotxt,ron');
        gridWinListaPlanillasPagosEfectivo.setColAlign('left,left,right,left,center,center,left,left,left');
        gridWinListaPlanillasPagosEfectivo.setNumberFormat('0,000.00',2);
        gridWinListaPlanillasPagosEfectivo.setColumnHidden(8);
        gridWinListaPlanillasPagosEfectivo.setIconsPath('/assets/images/icons/');
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
    gridWinListaPlanillasPagosEfectivo.attachEvent('onRowSelect', PagosEfectivoOnRowSelect);
    tabbarWinListaPlanillasDetalle.tabs('efectivo').progressOff();
    gridWinListaPlanillasPagosEfectivo.insertColumn(8,'','img',5);
    const nRows = gridWinListaPlanillasPagosEfectivo.getRowsNum();
    for(var i = 0; i < nRows; i++) {
        gridWinListaPlanillasPagosEfectivo.cells2(i,8).setValue('ic-close.svg^Eliminar pago');
    }
}
PagosEfectivoOnEditCell = (stage,rId,cInd,nValue,oValue) => {
    return false;
}
PagosEfectivoOnRowSelect = (rowId,colId) => {
    if(colId == 8) {
        dhtmlx.confirm({
            title: 'Eliminar pago',
            type: 'confirm-error',
            text: '¿Realmente desea eliminar este pago? Recuerde que no se puede deshacer esta operación',
            callback: (result) => {
                if(result) {
                    const params = {
                        vendedor: formFiltro.getItemValue('codigo'),
                        empresa: usrJson.empresa,
                        documento: gridWinListaPlanillasPagosEfectivo.cells(rowId,0).getValue(),
                        tpcobro: gridWinListaPlanillasPagosEfectivo.cells(rowId,9).getValue()
                    };
                    $.post('/api/BA010305/eliminar-pago', params, (response) => {
                        if(response.state == 'success') {
                            gridWinListaPlanillasPagosEfectivo.deleteRow(rowId);
                            dhtmlx.alert('¡Pago eliminado!');
                            const iPeriodo = formFiltro.getItemValue('periodo');
                            CargarPlanillasCobranza(iPeriodo, params.vendedor);
                        }
                    }, 'json');
                }
            }
        });
    }
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
            const vFecha = gridWinListaPlanillasDepositos.cells(rowId,6).getValue().split('-');
            winImagenVoucher.attachURL('/files/img-voucher/' + cuenta + '/' + vFecha[0] + vFecha[1] + '/' + operacion);
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
                const recaudador = usrJson.stadmin != 'S' ? usrJson.codigo : formFiltro.getItemValue('codigo')
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
        case 'pago':
            winPago = mainLayout.dhxWins.createWindow('winPago',0,0,640,480);
                winPago.setText('Ingresar pago a la planilla');
                winPago.setModal(true);
                winPago.keepInViewport(true);
                winPago.center();
            tabbarPago = winPago.attachTabbar();
                tabbarPago.addTab('cliente','Cliente',null,null,true);
            formPagoCliente = tabbarPago.cells('cliente').attachForm();
                formPagoCliente.load(structs.formPagoCliente);
                formPagoCliente.attachEvent('onFocus', formPagoClienteOnFocus);
                formPagoCliente.attachEvent('onButtonClick', formPagoClienteOnButtonClick);
                formPagoCliente.attachEvent('onChange', formPagoClienteOnChange);
            gridPagoDocumentos = new dhtmlXGridObject(formPagoCliente.getContainer('docsContainer'));
                gridPagoDocumentos.setHeader('Documento,Deuda,Vence,N.Unico,Estado,Banco,');
                gridPagoDocumentos.setInitWidthsP('25,25,15,10,10,10,0');
                gridPagoDocumentos.setColTypes('rotxt,ron,rotxt,rotxt,rotxt,rotxt,rotxt');
                gridPagoDocumentos.setColAlign('left,right,right,left,left,left,left');
                gridPagoDocumentos.setNumberFormat('S/ 0,000.00',1);
                gridPagoDocumentos.setColumnHidden(6, true);
                gridPagoDocumentos.setIconsPath('/assets/images/icons/grid/');
                gridPagoDocumentos.init();
                //gridPagoDocumentos.insertColumn(0,'','img',5);
            break;
        case 'deposito':
            winDeposito = mainLayout.dhxWins.createWindow('winPago',0,0,720,540);
                winDeposito.setText('Ingresar depósito');
                winDeposito.setModal(true);
                winDeposito.keepInViewport(true);
                winDeposito.center();
            formDepositoPlanilla = winDeposito.attachForm();
                structs.formDepositoPlanilla[1].list[0].list[3].connector = '/api/BA010305/combo-planillas/' + formFiltro.getItemValue('codigo') + '/' + usrJson.empresa;
                formDepositoPlanilla.loadStruct(structs.formDepositoPlanilla);
                formDepositoPlanilla.getInput('voucher').setAttribute('accept', 'image/*');
                formDepositoPlanilla.getContainer('preview').innerHTML = '<img id="img-preview" style="width:100%;">';
                formDepositoPlanilla.attachEvent('onChange', formDepositoPlanillaOnChange);
                formDepositoPlanilla.attachEvent('onButtonClick', formDepositoPlanillaOnButtonClick);
            break;
        case 'conciliar':
            const currRowId = gridPlanillas.getSelectedRowId();
            const coPlanilla = gridPlanillas.cells(currRowId,1).getValue();
            const conciliado = gridPlanillas.cells(currRowId,15).getValue();
            if(conciliado == '0') {
                winConciliacion = mainLayout.dhxWins.createWindow('winCrearPlanilla',0,0,1280,640);
                    winConciliacion.setText('Conciliación de depósitos - Planilla ' + coPlanilla);
                    winConciliacion.setModal(true);
                    winConciliacion.center();
                    winConciliacion.keepInViewport(true);
                layoutConciliacion = winConciliacion.attachLayout('3J');
                    layoutConciliacion.cells('a').hideHeader();
                    layoutConciliacion.cells('b').hideHeader();
                    layoutConciliacion.cells('b').setWidth(480);
                    layoutConciliacion.cells('c').hideHeader();
                gridConciliacionDepositos = layoutConciliacion.cells('a').attachGrid();
                    gridConciliacionDepositos.setHeader(',Banco,Cuenta,Comprobante,Importe,Fecha registro,Cod.Transaccion,Estado conciliacion,Fecha conciliacion,Extracto,Documento,Descripcion');
                    gridConciliacionDepositos.setInitWidths('30,80,160,80,90,80,80,80,80,100,80,240');
                    gridConciliacionDepositos.setColTypes('img,rotxt,rotxt,rotxt,ron,rotxt,rotxt,rotxt,rotxt,ron,rotxt,rotxt');
                    gridConciliacionDepositos.setColAlign('center,left,left,left,right,left,left,left,left,left,left,left');
                    gridConciliacionDepositos.setNumberFormat('S/ 0,000.00',4);
                    gridConciliacionDepositos.setIconsPath('/assets/images/icons/grid/');
                    gridConciliacionDepositos.init();
                    layoutConciliacion.cells('a').progressOn();
                    gridConciliacionDepositos.load('/api/BA010305/lista-depositos-conciliacion/' + usrJson.empresa + '/' + coPlanilla, gridConciliacionDepositosOnSuccess);
                gridConciliacionTransacciones = layoutConciliacion.cells('c').attachGrid();
                    gridConciliacionTransacciones.setHeader(',Extracto,Cuenta,Fecha,Concepto,Nro.Operacion,Importe abono,Importe cargo,Sucursal,Referencia,Tipo transaccion,Fecha conciliacion,Estado conciliacion,Clase doc.,Sugerido,Nro.Documento');
                    gridConciliacionTransacciones.setInitWidths('30,80,160,80,240,80,100,100,80,160,80,80,100,80,100,100');
                    gridConciliacionTransacciones.setColTypes('img,ron,rotxt,rotxt,rotxt,ron,ron,ron,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt');
                    gridConciliacionTransacciones.setColAlign('left,right,left,left,left,left,right,right,left,left,left,left,center,left,left,left');
                    gridConciliacionTransacciones.setNumberFormat('S/ 0,000.00',6);
                    gridConciliacionTransacciones.setNumberFormat('S/ 0,000.00',7);
                    gridConciliacionTransacciones.setIconsPath('/assets/images/icons/grid/');
                    gridConciliacionTransacciones.init();
                    gridConciliacionTransacciones.attachEvent('onRowSelect', gridConciliacionTransaccionesOnRowSelect);
                formConciliacion = layoutConciliacion.cells('b').attachForm();
                    formConciliacion.loadStruct(structs.formConciliacion);
                    formConciliacion.setItemValue('planilla', coPlanilla);
                    formConciliacion.attachEvent('onButtonClick', formConciliacionOnButtonClick);
                gridConciliacion = new dhtmlXGridObject(formConciliacion.getContainer('conciliaciones'));
                    gridConciliacion.setHeader(',Banco,Cuenta,Comprobante,Importe,Transaccion,Extracto');
                    gridConciliacion.setInitWidths('30,80,160,80,90,80,80');
                    gridConciliacion.setColTypes('img,rotxt,rotxt,rotxt,ron,rotxt,ron');
                    gridConciliacion.setColAlign('center,left,left,left,right,left,right');
                    gridConciliacion.setNumberFormat('S/ 0,000.00',4);
                    gridConciliacion.setIconsPath('/assets/images/icons/grid/');
                    gridConciliacion.init();
                    gridConciliacion.attachEvent('onRowSelect', gridConciliacionOnRowSelect);
            }
            else {
                dhtmlx.alert({
                    title: 'No se puede conciliar',
                    type: 'alert-error',
                    text: 'La planilla ' + gridPlanillas.cells(currRowId,1).getValue() + ' ya está conciliada'
                });
            }
            break;
        case 'recibo':
            winRecibo = mainLayout.dhxWins.createWindow('winRecibo',0,0,400,320);
                winRecibo.setText('Genera recibo de planilla');
                winRecibo.setModal(true);
                winRecibo.keepInViewport(true);
                winRecibo.center();
            formRecibo = winRecibo.attachForm();
                formRecibo.loadStruct(structs.formReciboPlanilla);
                formRecibo.setItemValue('codigo', formFiltro.getItemValue('codigo'));
                formRecibo.setItemValue('recaudador', formFiltro.getItemValue('vendedor'));
                formRecibo.attachEvent('onButtonClick', formReciboOnClick);
            break;
        default: break;
    }
}
gridConciliacionDepositosOnSuccess = () => {
    layoutConciliacion.cells('a').progressOff();
    const numFilas = gridConciliacionDepositos.getRowsNum();
    for(var i = 0; i < numFilas; i++) {
        const rowId = gridConciliacionDepositos.getRowId(i);
        gridConciliacionDepositos.setCellTextStyle(rowId,0,'cursor:pointer;');
    }
    gridConciliacionDepositos.attachEvent('onRowSelect', gridConciliacionDepositosOnRowSelect);
}
gridConciliacionDepositosOnRowSelect = (rowId, colId) => {
    if(colId == 0) {
        winImagenVoucher = mainLayout.dhxWins.createWindow('winImagenVoucher',0,0,480,320);
            winImagenVoucher.setText('Mostrando imagen del voucher');
            winImagenVoucher.setModal(true);
            winImagenVoucher.keepInViewport(true);
            winImagenVoucher.center();
        const cuenta = gridConciliacionDepositos.cells(rowId,2).getValue();
        const operacion = gridConciliacionDepositos.cells(rowId,3).getValue();
        const vFecha = gridConciliacionDepositos.cells(rowId,5).getValue().split('-');
        winImagenVoucher.attachURL('/files/img-voucher/' + cuenta + '/' + vFecha[0] + vFecha[1] + '/' + operacion);
    }
    else {
        const cuenta = gridConciliacionDepositos.cells(rowId,2).getValue();
        const transaccion = gridConciliacionDepositos.cells(rowId,6).getValue();
        layoutConciliacion.cells('c').progressOn();
        gridConciliacionTransacciones.clearAll();
        gridConciliacionTransacciones.load('/api/BA010305/lista-extractos-conciliacion/' + cuenta + '/' + transaccion, gridConciliacionTransaccionesOnSuccess);
    }
}
gridConciliacionTransaccionesOnSuccess = () => {
    layoutConciliacion.cells('c').progressOff();
    const numFilas = gridConciliacionTransacciones.getRowsNum();
    if(numFilas == 0) {
        dhtmlx.message({
            type: 'error',
            text: 'No hay extractos que coincidan en monto con el depósito seleccionado',
            expire: 5000
        });
    }
    else {
        for(var i = 0; i < numFilas; i++) {
            const rowId = gridConciliacionTransacciones.getRowId(i);
            const sugerido = gridConciliacionTransacciones.cells(rowId,14).getValue();
            gridConciliacionTransacciones.setCellTextStyle(rowId,0,'cursor:pointer;');
            switch(sugerido) {
                case 'V': //coincide en todo
                    gridConciliacionTransacciones.setRowColor(rowId,'#b2ebf2');
                    break;
                case 'T': //coincide en importe y fecha, pero no en nro operacion
                    gridConciliacionTransacciones.setRowColor(rowId,'#fff9c4');
                    break;
                default:break; //S, coincide solo en importe
            }
        }
    }
    //resalta las filas p
    ResaltarFilas();
}
gridConciliacionTransaccionesOnRowSelect = (rowId,colId) => {
    if(colId == 0) {
        const depRowId = gridConciliacionDepositos.getSelectedRowId();
        const transaccion = gridConciliacionDepositos.cells(depRowId,6).getValue();
        const extracto = gridConciliacionTransacciones.cells(rowId,1).getValue();
        //const conciliado = gridConciliacionDepositos.cells(depRowId,7).getValue();
        if(VerificaConciliacion(transaccion, extracto)) {
            const rowData = [
                'ic-delete.svg^Eliminar',
                gridConciliacionDepositos.cells(depRowId,1).getValue(),
                gridConciliacionDepositos.cells(depRowId,2).getValue(),
                gridConciliacionDepositos.cells(depRowId,3).getValue(),
                gridConciliacionDepositos.cells(depRowId,4).getValue(),
                gridConciliacionDepositos.cells(depRowId,6).getValue(),
                gridConciliacionTransacciones.cells(rowId,1).getValue()
            ];
            gridConciliacion.addRow(transaccion + '|' + extracto, rowData.join(','));
            //resalta las filas
            gridConciliacionDepositos.setRowColor(transaccion,'#c8e6c9');
            gridConciliacionTransacciones.setRowColor(extracto,'#c8e6c9');
        }
        else {
            dhtmlx.alert({
                title: 'No se puede conciliar',
                type: 'confirm-error',
                text: 'Ya ha asociado un extracto bancario para conciliar este depósito'
            });
        }
    }
}
formReciboOnClick = (name) => {
    switch(name) {
        case 'generar':
            dhtmlx.confirm({
                ok: 'Generar recibo',
                cancel: 'No',
                text: '¿Desea generar el recibo?',
                callback: (result) => {
                    if(result) {
                        winRecibo.progressOn();
                        var sDetalle = '';
                        const numRows = gridPlanillas.getRowsNum();
                        for(var i = 0; i < numRows; i++) {
                            const iPlanilla = gridPlanillas.cells2(i,1).getValue();
                            const iImporte = gridPlanillas.cells2(i,11).getValue();
                            const iDeposito = gridPlanillas.cells2(i,13).getValue();
                            const iValores = gridPlanillas.cells2(i,12).getValue();
                            const iFila = [iPlanilla, iImporte, iDeposito, iValores, ''].join('@*@');
                            sDetalle += iFila + '@-@';
                        }
                        const params = {
                            serie: formRecibo.getItemValue('serie'),
                            concepto: formRecibo.getItemValue('concepto'),
                            recaudador: formRecibo.getItemValue('codigo'),
                            detalle: sDetalle,
                            cantidad: numRows,
                            alias: usrJson.alias
                        };
                        $.post('/api/BA010305/genera-recibo', params, (response) => {
                            if(response.state == 'success') {
                                const recibo = response.data.recibo;
                                if(recibo != '') {
                                    alert('Se generó el recibo ' + recibo);
                                    winRecibo.progressOff();
                                    winRecibo.close();
                                    const iPeriodo = formFiltro.getItemValue('periodo');
                                    const recaudador = usrJson.stadmin != 'S' ? usrJson.codigo : formFiltro.getItemValue('codigo')
                                    CargarPlanillasCobranza(iPeriodo, recaudador);
                                    CargarRecibosCaja(recaudador);
                                }
                            }
                            else alert(response.message);
                        }, 'json');
                    }
                }
            });
            break;
        default: break;
    }
}
ResaltarFilas = () => {
    const numConciliaciones = gridConciliacion.getRowsNum();
    for(var i = 0; i < numConciliaciones; i++) {
        const iTransaccion = gridConciliacion.cells2(i,5).getValue();
        const iExtracto = gridConciliacion.cells2(i,6).getValue();
        if(gridConciliacionDepositos.doesRowExist(iTransaccion)) gridConciliacionDepositos.setRowColor(iTransaccion,'#c8e6c9');
        if(gridConciliacionTransacciones.doesRowExist(iExtracto)) gridConciliacionTransacciones.setRowColor(iExtracto,'#c8e6c9');
    }
}
gridConciliacionOnRowSelect = (rowId, colId) => {
    if(colId == 0) {
        dhtmlx.confirm({
            ok: 'Si, eliminar',
            cancel: 'No',
            text: '¿Desea anular esta conciliación?',
            callback: (result) => {
                if(result) {
                    gridConciliacion.deleteRow(rowId);
                }
            }
        });
    }
}
VerificaConciliacion = (transaccion, extracto) => {
    const numRows = gridConciliacion.getRowsNum();
    var existe = false;
    for(var i = 0; i < numRows; i++) {
        existe = existe || (gridConciliacion.cells2(i,5).getValue() == transaccion);
    }
    return !existe;
}
formConciliacionOnButtonClick = (name) => {
    switch(name) {
        case 'conciliar':
            dhtmlx.confirm({
                ok: 'Si, continuar',
                cancel: 'No',
                text: 'Se procederá a conciliar los depósitos seleccionados. Recuerde que no podrá deshacer esta operación. ¿Desea continuar?',
                callback: (result) => {
                    const ListaConciliacion = [];
                    //
                    const numRows = gridConciliacion.getRowsNum();
                    for(var i = 0; i < numRows; i++) {
                        ListaConciliacion.push(gridConciliacion.cells2(i,5).getValue() + '@' + gridConciliacion.cells2(i,6).getValue());
                    }
                    //
                    winConciliacion.progressOn();
                    const params = {
                        alias: usrJson.alias,
                        lista: JSON.stringify(ListaConciliacion)
                    };
                    $.post('/api/BA010305/conciliar-depositos', params, (response) => {
                        winConciliacion.progressOff();
                        if(response.state == 'success') {
                            dhtmlx.alert('Depósitos conciliados correctamente');
                            winConciliacion.close();
                            const iPeriodo = formFiltro.getItemValue('periodo');
                            const recaudador = usrJson.stadmin != 'S' ? usrJson.codigo : formFiltro.getItemValue('codigo')
                            CargarPlanillasCobranza(iPeriodo, recaudador);
                        }
                        else alert(response.message);
                    }, 'json');
                }
            });
            break;
    }
}
formDepositoPlanillaOnChange = (name, value) => {
    switch(name) {
        case 'banco':
            const params = {
                banco: value,
                empresa: usrJson.empresa,
                moneda: 1
            };
            $.post('/api/BA010305/combo-cuentas', params, (response) => {
                if(response.state == 'success') {
                    formDepositoPlanilla.getCombo('cuenta').setComboText('');
                    formDepositoPlanilla.getCombo('cuenta').setComboValue('');
                    formDepositoPlanilla.reloadOptions('cuenta', response.data);
                }
                else alert(response.message);
            }, 'json');
            break;
        case 'voucher':
            const file = formDepositoPlanilla.getInput('voucher').files[0];
            formDepositoPlanilla.setItemValue('fname', file.name);
            //tienes q redimensionar la imagen para q no pese mucho alv
            getBase64(file).then(
                data => $('#img-preview').attr('src', data)
            );
            break;
        default: break;
    }
}
getBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
formDepositoPlanillaOnButtonClick = (name) => {
    switch(name) {
        case 'aceptar':
            const params = {
                vendedor: formFiltro.getItemValue('codigo'),
                empresa: usrJson.empresa,
                planilla: formDepositoPlanilla.getItemValue('planilla'),
                banco: formDepositoPlanilla.getItemValue('banco'),
                cuenta: formDepositoPlanilla.getItemValue('cuenta'),
                fecha: formDepositoPlanilla.getItemValue('fecha', true),
                operacion: formDepositoPlanilla.getItemValue('operacion'),
                importe: formDepositoPlanilla.getItemValue('importe'),
                base64: $('#img-preview').attr('src'),
                name: formDepositoPlanilla.getItemValue('fname')
            };
            $.post('/api/BA010305/guarda-deposito', params, (response) => {
                if(response.state == 'success') {
                    dhtmlx.alert('Depósito registrado');
                    winDeposito.close();
                    const iPeriodo = formFiltro.getItemValue('periodo');
                    CargarPlanillasCobranza(iPeriodo, params.vendedor);
                }
                else alert(response.message);
            }, 'json');
            break;
        case 'cancelar':
            winDeposito.close();
            break;
        default: break;
    }
}
//
formPagoClienteOnFocus = async (id) => {
    if(id == 'cliente') {
        var output = await IniciarGridBusqueda(5, false, mainLayout, formFiltro.getItemValue('codigo'));
        if(output) {
            const cliente = output.seleccion[0];
            formPagoCliente.setItemValue('ruc', cliente.codigo);
            formPagoCliente.setItemValue('cliente', cliente.rsocial + ' - ' + cliente.ncomercial);
            gridPagoDocumentos.clearAll();
            //gridPagoDocumentos.deleteColumn(0);
            gridPagoDocumentos.load('/api/BA010305/lista-documentos-cliente/' + usrJson.empresa + '/' + cliente.codigo, () => {
                gridPagoDocumentos.insertColumn(0,'','img',5);
                const nRows = gridPagoDocumentos.getRowsNum();
                for(var i = 0; i < nRows; i++) {
                    gridPagoDocumentos.cells2(i,0).setValue(gridPagoDocumentos.cells2(i,6).getValue() == 'S' ? 'ic-ok.svg' : 'ic-danger.svg^No se puede pagar el documento porque ya se encuentra en el banco');
                }
            });
        }
    }
}
formPagoClienteOnButtonClick = (id) => {
    switch(id) {
        case 'aceptar':
            const tpago = formPagoCliente.getItemValue('tpago');
            MostrarFormularioPago(tpago, true);
            break;
        case 'cancelar':
            winPago.close();
            break;
        default: break;
    }
}
formPagoClienteOnChange = (name, value) => {
    switch(name) {
        case 'tpago':
            MostrarFormularioPago(value, false);
            break;
        default: break;
    }
}
MostrarFormularioPago = (tpago, showAlert) => {
    const rId = gridPagoDocumentos.getSelectedRowId();
    if(rId) {
        const documento = gridPagoDocumentos.cells(rId,1).getValue();
        if(gridPagoDocumentos.cells(rId,6).getValue() == 'N') {
            dhtmlx.alert({
                title: 'No se puede pagar este documento',
                type: 'confirm-error',
                text: 'El documento <b><i>' + documento + '</i></b> ya se encuentra en el banco'
            });
            return false;
        }
        if(!tpago) {
            dhtmlx.alert({
                title: 'No se puede continuar',
                type: 'confirm-error',
                text: 'Debe elegir un tipo de pago para continuar'
            });
            return false;
        }
        //abre una nueva pestaña
        IngresarPagoDocumento(tpago, documento);
    }
    else {
        if(showAlert) {
            dhtmlx.alert({
                title: 'No se puede continuar',
                type: 'confirm-error',
                text: 'Seleccione primero un documento para realizar el pago'
            });
        }
    }
}
IngresarPagoDocumento = (tpago, documento) => {
    if(tabbarPago.tabs('ingreso')) {
        tabbarPago.tabs('ingreso').setActive();
    }
    else {
        tabbarPago.addTab('ingreso','Pago',null,null,true);
    }
    tabbarPago.tabs('ingreso').detachObject();
    formPagoClientePagar = tabbarPago.tabs('ingreso').attachForm();
    switch(tpago) {
        case 1:
        case 10:
        case 11:
        case 15:
            formPagoClientePagar.loadStruct(structs.formPagoClienteEfectivo);
            break;
        case 3:
        case 6:
        case 7:
            formPagoClientePagar.loadStruct(structs.formPagoClienteCheque);
            break;
        case 4:
            formPagoClientePagar.loadStruct(structs.formPagoClienteCertifRet);
            break;
        default:
            break;
    }
    if(document.getElementById('sp-codigo-documento')) document.getElementById('sp-codigo-documento').innerHTML = documento;
    formPagoClientePagar.setItemValue('tpcobro', tpago);
    formPagoClientePagar.setItemValue('documento', documento);
    formPagoClientePagar.attachEvent('onButtonClick', formPagoClientePagarOnClick);
}
formPagoClientePagarOnClick = (id) => {
    switch(id) {
        case 'aceptar':
            const tpago = formPagoClientePagar.getItemValue('tpcobro');
            const params = {
                vendedor: formFiltro.getItemValue('codigo'),
                empresa: usrJson.empresa,
                tipo: tpago,
                documento: formPagoClientePagar.getItemValue('documento'),
                importe: formPagoClientePagar.getItemValue('importe'),
                banco: formPagoClientePagar.getItemValue('banco'),
                serieret: formPagoClientePagar.getItemValue('serie'),
                nrodoc: formPagoClientePagar.getItemValue('nrodoc'),
                regfecha: formPagoClientePagar.getItemValue('fecha',true)
            };
            $.post('/api/BA010305/registra-pago-planilla', params, (response) => {
                if(response.state == 'success') {
                    const iPeriodo = formFiltro.getItemValue('periodo');
                    const recaudador = usrJson.stadmin != 'S' ? usrJson.codigo : formFiltro.getItemValue('codigo')
                    winPago.close();
                    CargarPlanillasCobranza(iPeriodo, recaudador);
                    dhtmlx.alert('Pago registrado');
                }
            }, 'json');
            break;
        case 'cancelar':
            winPago.close();
            break;
        default: break;
    }
}
//

CerrarPlanillaCobranza = () => {
    const rowId = gridPlanillas.getSelectedRowId();
    if(rowId > -1) {
        const planilla = gridPlanillas.cells(rowId,1).getValue();
        const recaudador = usrJson.stadmin != 'S' ? usrJson.codigo : formFiltro.getItemValue('codigo')
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
            const recaudador = usrJson.stadmin != 'S' ? usrJson.codigo : formFiltro.getItemValue('codigo')
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
                        const iVendedor = usrJson.stadmin != 'S' ? usrJson.codigo : formFiltro.getItemValue('codigo')
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