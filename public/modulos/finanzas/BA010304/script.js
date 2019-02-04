toolbarListaPlanillasOnClick = async (id) => {
    switch(id) {
        case 'btBusca':
            var output = await IniciarGridBusqueda(2, false, mainLayout);
            toolbarListaPlanillas.setValue('ipRucdni', output.seleccion[0].codigo);
            toolbarListaPlanillas.setValue('ipNombre', output.seleccion[0].nombre);
            break;
        /*case 'btLimpiar':
            break;*/
        case 'btBuscar':
            const cobrador = toolbarListaPlanillas.getValue('ipRucdni');
            const planilla = toolbarListaPlanillas.getValue('ipPlanilla') ? toolbarListaPlanillas.getValue('ipPlanilla') : 'L';
            const fdesde = ipCalDesde.value;
            const fhasta = ipCalHasta.value;
            if(!gridListadoPlanillas) {
                gridListadoPlanillas = mainTabbar.tabs('planillas').attachGrid();
                //gridListadoPlanillas.setImagePath('/assets/images/icons/grid/');
                gridListadoPlanillas.setHeader('Planilla,Caja,Fecha creación planilla,Fecha cierre,comoneda,Moneda,cotpdoc,Tipo documento,Importe POS,Importe total,Importe valores,Depósito total,Diferencia,Conciliado,Liquidado,Recibo,Periodo,Fecha aprobación cierre,Vigencia');
                gridListadoPlanillas.setInitWidths('80,60,80,80,0,60,0,200,100,100,100,100,100,60,60,60,80,80,100');
                gridListadoPlanillas.attachHeader('#text_filter,#select_filter,#text_filter,#text_filter,#rspan,#select_filter,#rspan,#select_filter,#numeric_filter,#numeric_filter,#numeric_filter,#numeric_filter,#numeric_filter,#select_filter,#select_filter,#select_filter,#select_filter,#text_filter,#select_filter');
                gridListadoPlanillas.setColTypes('rotxt,rotxt,rotxt,rotxt,ron,rotxt,ron,ron,ron,ron,ron,ron,dyn,ch,ch,ch,ron,rotxt,rotxt');
                gridListadoPlanillas.setColAlign('left,left,left,left,center,left,center,left,right,right,right,right,right,center,center,center,right,left,left');
                gridListadoPlanillas.setColumnHidden(4,true);
                gridListadoPlanillas.setColumnHidden(6,true);
                gridListadoPlanillas.setNumberFormat('0,000.00',8);
                gridListadoPlanillas.setNumberFormat('0,000.00',9);
                gridListadoPlanillas.setNumberFormat('0,000.00',10);
                gridListadoPlanillas.setNumberFormat('0,000.00',11);
                gridListadoPlanillas.setNumberFormat('0,000.00',12);
                gridListadoPlanillas.init();
            }
            CargarListadoPlanillas(cobrador, planilla, fdesde, fhasta);
            break;
        case 'btSeguridad':
            break;
        case 'btAbrir':
            break;
        case 'btCerrar':
            break;
        case 'btXls':
            break;
        default: break;
    }
}
setSens = (inp, k) => {
    if (k == "min") {
        toolbarCalendar.setSensitiveRange(inp.value, null);
    } else {
        toolbarCalendar.setSensitiveRange(null, inp.value);
    }
}

//primer grid - listado de planillas
var primeraCargaLista = false;
CargarListadoPlanillas = (cobrador, planilla, fdesde, fhasta) => {
    gridListadoPlanillas.clearAll();
    mainTabbar.tabs('planillas').progressOn();
    if(primeraCargaLista) {
        gridListadoPlanillas.deleteColumn(2);
        gridListadoPlanillas.deleteColumn(0);
    }
    else primeraCargaLista = true;
    gridListadoPlanillas.load(BASE_URL + 'BA010304/buscar-planillas-cobranza/' + usrJson.empresa + '/' + cobrador + '/' + planilla + '/' + fdesde + '/' + fhasta, listadoPlanillasSuccess);
}
listadoPlanillasSuccess = () => {
    mainTabbar.tabs('planillas').progressOff();
    gridListadoPlanillas.insertColumn(1,'','img',30);
    gridListadoPlanillas.insertColumn(0,'','img',30);
    //6
    const numRows = gridListadoPlanillas.getRowsNum();
    for(var i = 0; i < numRows; i++) {
        const rowId = gridListadoPlanillas.getRowId(i);
        gridListadoPlanillas.cells(rowId,0).setValue('/assets/images/icons/grid/ic-detalle.svg^Ver detalle de la planilla');
        gridListadoPlanillas.cells(rowId,2).setValue('/assets/images/icons/grid/ic-print.svg^Imprimir planilla');
        gridListadoPlanillas.setCellTextStyle(rowId,2,'cursor:pointer;');
        gridListadoPlanillas.setCellTextStyle(rowId,0,'cursor:pointer;');
    }
    gridListadoPlanillas.attachEvent('onRowSelect', gridListadoPlanillasOnRowSelect)
    gridListadoPlanillas.attachEvent('onEditCell', (stage,rId,cInd,nValue,oValue) => {
        return false;
    });
}
gridListadoPlanillasOnRowSelect = (rowId, colId) => {
    const co_planilla = gridListadoPlanillas.cells(rowId,1).getValue();
    switch(colId) {
        case 0:
            winListaPlanillasDetalle = mainLayout.dhxWins.createWindow('winGridBusqueda',0,0,1200,480);
                winListaPlanillasDetalle.setText('Visualizando la planilla <span style="color:#009688;">' + co_planilla + '</span>');
                winListaPlanillasDetalle.setModal(true);
                winListaPlanillasDetalle.keepInViewport(true);
                winListaPlanillasDetalle.center();
            ConfigurarLayoutDetallePlanilla();
            break;
        case 2:
        break;
        default: break;
    }
}

//layout - detalle de planilla
var tabbarWinListaPlanillasDetalle, gridWinListaPlanillasPagosEfectivo, gridWinListaPlanillasValores, gridWinListaPlanillasNotas, gridWinListaPlanillasDepositos;
ConfigurarLayoutDetallePlanilla = () => {
    layoutWinListaPlanillas = winListaPlanillasDetalle.attachLayout('3L');
        layoutWinListaPlanillas.cells('a').setText('Resumen de la planilla');
        layoutWinListaPlanillas.cells('a').setWidth(500);
        layoutWinListaPlanillas.cells('a').fixSize(true,true);
        layoutWinListaPlanillas.cells('b').setText('Detalle de la planilla');
        layoutWinListaPlanillas.cells('b').fixSize(true,true);
        layoutWinListaPlanillas.cells('c').setText('Detalle de depósitos');
        layoutWinListaPlanillas.cells('c').fixSize(true,true);
    tabbarWinListaPlanillasDetalle = layoutWinListaPlanillas.cells('b').attachTabbar();
        tabbarWinListaPlanillasDetalle.addTab('efectivo','Efectivo',null,null,true);
        tabbarWinListaPlanillasDetalle.addTab('valores','Cheques/Letras');
        tabbarWinListaPlanillasDetalle.addTab('notas','Notas de crédito');
    gridWinListaPlanillasPagosEfectivo = tabbarWinListaPlanillasDetalle.tabs('efectivo').attachGrid();
        gridWinListaPlanillasPagosEfectivo.setHeader('Documento,Moneda,Importe cobranza,Tipo de cobro,Letra/cheque,Recibo entregado,Documento pago,Fecha vencimiento');
        gridWinListaPlanillasPagosEfectivo.setInitWidthsP('10,8,12,15,10,10,25,10');
        gridWinListaPlanillasPagosEfectivo.setColTypes('rotxt,rotxt,ron,rotxt,ch,ch,rotxt,rotxt');
        gridWinListaPlanillasPagosEfectivo.setColAlign('left,left,right,left,center,center,left,left');
        gridWinListaPlanillasPagosEfectivo.init();
    gridWinListaPlanillasValores = tabbarWinListaPlanillasDetalle.tabs('valores').attachGrid();
        gridWinListaPlanillasValores.setHeader('Cheque,Fecha,Cliente,Importe,Saldo,Banco,Moneda,Documento');
        gridWinListaPlanillasValores.setInitWidths('80,80,240,100,100,120,60,80');
        gridWinListaPlanillasValores.setColTypes('rotxt,rotxt,rotxt,ron,ron,rotxt,rotxt,rotxt');
        gridWinListaPlanillasValores.setColAlign('left,left,left,right,right,left,left,left');
        gridWinListaPlanillasValores.init();
    gridWinListaPlanillasNotas = tabbarWinListaPlanillasDetalle.tabs('notas').attachGrid();
        gridWinListaPlanillasNotas.setHeader('Nota crédito,Documento,Fecha,Cliente,Importe,Referencia');
        gridWinListaPlanillasNotas.setInitWidthsP('10,10,10,50,10,10');
        gridWinListaPlanillasNotas.setColTypes('rotxt,rotxt,rotxt,rotxt,ron,rotxt');
        gridWinListaPlanillasNotas.setColAlign('left,left,left,left,right,left');
        gridWinListaPlanillasNotas.init();
    gridWinListaPlanillasDepositos = layoutWinListaPlanillas.cells('c').attachGrid();
        gridWinListaPlanillasDepositos.setHeader('Banco,Conciliado,Nro.Cuenta,Nro.Comprobante,Importe,Fecha Registro,Transacción,Fecha Conciliación');
        gridWinListaPlanillasDepositos.setInitWidthsP('10,5,15,15,15,10,10,10');
        gridWinListaPlanillasDepositos.setColTypes('rotxt,ch,rotxt,rotxt,ron,rotxt,rotxt,rotxt');
        gridWinListaPlanillasDepositos.setColAlign('left,center,left,left,right,left,left,left');
        gridWinListaPlanillasDepositos.init();
}