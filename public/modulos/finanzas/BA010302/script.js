IniciarInterfaz = () => {
    mainLayout = new dhtmlXLayoutObject(document.body, '1C');
    mainLayout.cells('a').hideHeader();
    mainTabbar = mainLayout.cells('a').attachTabbar();
    mainTabbar.addTab('fondofijo', 'Fondo fijo', null, null, true);
    mainTabbar.addTab('transferencia', 'Transferencia a contabilidad');
    mainTabbar.addTab('procesos', 'Procesos tipo documento');
    //
    toolbarFondoFijo = mainTabbar.tabs('fondofijo').attachToolbar();
        toolbarFondoFijo.setIconsPath('/assets/images/icons/');
        toolbarFondoFijo.addText('lblCaja',null,'Caja');
        toolbarFondoFijo.addInput('txCaja',null,null,160);
        toolbarFondoFijo.addButton('btBsqCaja', null, '', 'ic-search.svg', '');
        toolbarFondoFijo.addSeparator();
        toolbarFondoFijo.addText('lblFondo', null, 'Fondo Fijo');
        toolbarFondoFijo.addInput('txFondo', null, null, 240);
        toolbarFondoFijo.addButton('btBsqFondo', null, '', 'ic-search.svg', '');
        toolbarFondoFijo.attachEvent('onClick', toolbarFondoFijoOnClick);
        toolbarFondoFijo.disableItem('txCaja');
        toolbarFondoFijo.disableItem('txFondo');
}

SeleccionarCaja = () => {
    WinCaja = mainLayout.dhxWins.createWindow('WinCaja', 0, 0, 800, 480);
        WinCaja.setText('Cajas disponibles y vigentes');
        WinCaja.setModal(true);
        WinCaja.keepInViewport(true);
        WinCaja.center();
    gridCaja = WinCaja.attachGrid();
        gridCaja.setHeader('Codigo,Nombre,Moneda,Libro,#cspan,Cuenta,Estado,Registrado');
        gridCaja.setColumnIds('caja,nombre,moneda,libro,nlibro,cuenta,estado,fecha');
        gridCaja.setInitWidths('60,200,60,40,160,80,60,90');
        gridCaja.setColTypes('ron,rotxt,ron,ron,rotxt,ron,rotxt,rotxt');
        gridCaja.setColAlign('left,left,left,right,left,left,left,left');
        gridCaja.init();
        gridCaja.load(BASE_URL + 'BA010302/lista-cajas/' + usrJson.empresa);
    gridCaja.attachEvent('onRowDblClicked', gridCajaOnRowDblClicked);
}

SeleccionarFondo = () => {
    winFondoFijo = mainLayout.dhxWins.createWindow('winFondoFijo', 0, 0, 960, 480);
        winFondoFijo.setText('Fondo Fijo de la ' + Caja.nombre);
        winFondoFijo.setModal(true);
        winFondoFijo.keepInViewport(true);
        winFondoFijo.center();
    gridFondoFijo = winFondoFijo.attachGrid();
        gridFondoFijo.setHeader('Fondo Fijo,#cspan,Caja,Moneda,Disponible,Cerrado,Responsable,#cspan,Cuenta,Centro Costo,#cspan');
        gridFondoFijo.attachHeader('#text_filter,#text_filter,#select_filter,#text_filter,#numeric_filter,#select_filter,#text_filter,#text_filter,#text_filter,#select_filter,#select_filter');
        gridFondoFijo.setColumnIds('fondofijo,nfondofijo,caja,moneda,disponible,cerrado,responsable,nresponsable,cuenta,ccosto,nccosto');
        gridFondoFijo.setInitWidths('40,200,40,60,80,30,80,240,60,60,120');
        gridFondoFijo.setColTypes('ron,rotxt,ron,rotxt,ron,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt');
        gridFondoFijo.setColAlign('right,left,left,left,right,center,right,left,left,left,right,left');
        gridFondoFijo.setNumberFormat('0,000.00',4);
        gridFondoFijo.init();
        gridFondoFijo.load(BASE_URL + 'BA010302/lista-fondos/' + usrJson.empresa + '/' + Caja.caja);
        gridFondoFijo.attachEvent('onRowDblClicked', gridFondoFijoOnRowDblClicked);
}

// eventos

toolbarFondoFijoOnClick = (id) => {
    switch (id) {
        case 'btBsqCaja':
            SeleccionarCaja();
            break;
        case 'btBsqFondo':
            if (Caja) {
                SeleccionarFondo();
            }
            else {
                dhtmlx.alert({
                    type: 'alert-error',
                    text: 'Primero seleccione una caja'
                });
            }
            break;
        default: break;
    }
}

gridCajaOnRowDblClicked = (rowId, colId) => {
    Caja = gridCaja.getRowData(rowId);
    toolbarFondoFijo.setValue('txCaja', Caja.nombre);
    WinCaja.close();
}

gridFondoFijoOnRowDblClicked = (rowId, colId) => {
    FondoFijo = gridFondoFijo.getRowData(rowId);
    toolbarFondoFijo.setValue('txFondo', FondoFijo.nfondofijo);
    winFondoFijo.close();
    mainTabbar.tabs('fondofijo').detachObject();
    layoutFondoFijo = mainTabbar.tabs('fondofijo').attachLayout('2U');
        layoutFondoFijo.cells('a').setText('Detalle Fondo Fijo');
        layoutFondoFijo.cells('b').setText('Movimientos Fondo Fijo');
        layoutFondoFijo.cells('b').collapse();
    gridDetalle = layoutFondoFijo.cells('a').attachGrid();
        gridDetalle.setHeader('Código,Número,Apertura,Inicial,Ingreso,Egreso,Saldo,Estado,Cierre');
        gridDetalle.attachHeader('#text_filter,#text_filter,#numeric_filter,#numeric_filter,#numeric_filter,#numeric_filter,#numeric_filter,#select_filter,#text_filter');
        gridDetalle.setColumnIds('codigo,numero,apertura,inicial,ingreso,egreso,saldo,estado,cierre');
        gridDetalle.setInitWidths('60,60,80,100,100,100,100,60,80');
        gridDetalle.setColTypes('ron,ron,rotxt,ron,ron,ron,ron,rotxt,rotxt');
        gridDetalle.setColAlign('left,left,left,right,right,right,right,left,left');
        gridDetalle.setNumberFormat('0,000.00', 3);
        gridDetalle.setNumberFormat('0,000.00', 4);
        gridDetalle.setNumberFormat('0,000.00', 5);
        gridDetalle.setNumberFormat('0,000.00', 6);
        gridDetalle.init();
        layoutFondoFijo.cells('a').progressOn();
        gridDetalle.load(BASE_URL + 'BA010302/detalle-fondos/' + usrJson.empresa + '/' + FondoFijo.fondofijo, gridDetalleOnLoad);
        gridDetalle.attachEvent('onRowDblClicked', gridDetalleOnRowDblClicked);
}

gridDetalleOnLoad = () => {
    let numFilas = gridDetalle.getRowsNum();
    for (let i = 0; i < numFilas; i++) {
        let iRowId = gridDetalle.getRowId(i);
        if (gridDetalle.cells(iRowId, 7).getValue() == 'Vigente') {
            gridDetalle.setCellTextStyle(iRowId, 7, 'color:#4caf50;');
        }
        else {
            for (let j = 0; j < 9; j++) {
                gridDetalle.setCellTextStyle(iRowId, j, 'color:#f44336;');
            }
        }
    }
    layoutFondoFijo.cells('a').progressOff();
}

gridDetalleOnRowDblClicked = (rowId, colId) => {
    let movimiento = gridDetalle.getRowData(rowId);
}