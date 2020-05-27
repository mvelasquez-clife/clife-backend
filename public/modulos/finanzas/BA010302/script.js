const ba010302Structs = {
    formEditar: [
        { type: 'settings', labelWidth: 80, offsetLeft: 16, inputWidth: 80 },
        { type: 'block', blockOffset: 0, offsetLeft: 16, offsetTop: 10, inputWidth: 800, labelWidth:0, list: [
            { type: 'calendar', label: 'Fecha emisión', name: 'fmovimiento', offsetLeft:0, dateFormat: '%d/%m/%Y' },
            { type: 'newcolumn' },
            { type: 'input', label: 'Importe', name: 'importe', labelWidth: 48, offsetLeft: 12, inputWidth: 100 },
            { type: 'newcolumn' },
            { type: 'input', label: 'Tipo cambio', name: 'tcambio', labelWidth: 70, offsetLeft: 12 },
            { type: 'newcolumn' },
            { type: 'checkbox', label: '<span style="color:#1565c0;font-weight:bold;">Aprobar fondo fijo</span>', name: 'aprobado', labelWidth: 120, offsetLeft: 24, position: 'label-left' }
        ] },
        { type: 'combo', label: 'Categoría', name: 'categoria', inputWidth: 240 },
        { type: 'container', label: 'Descr. gasto', name: 'ctgasto', inputHeight: 200, inputWidth: 720 },
        { type: 'combo', label: 'Moneda', name: 'moneda', inputWidth: 120 },
        { type: 'container', label: 'Cuenta', name: 'ctcuenta', inputHeight: 160, inputWidth: 640, offsetTop: 8 },
        { type: 'block', blockOffset: 64, inputWidth: 400, list: [
            { type: 'button', name: 'actualizar', value: 'Confirmar cambios' },
            { type: 'newcolumn' },
            { type: 'button', name: 'cancelar', value: 'Cancelar' }
        ] }
    ]
};

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

MostrarVentanaEdicion = async (params) => {
    winEditar = mainLayout.dhxWins.createWindow('winEditar', 0, 0, 880, 565);
        winEditar.setText('Editar movimiento');
        winEditar.center();
        winEditar.keepInViewport(true);
        winEditar.setModal(true);
    formEditar = winEditar.attachForm();
        formEditar.loadStruct(ba010302Structs.formEditar);
        formEditar.setItemValue('fmovimiento', params.fecha);
        formEditar.setItemValue('importe', params.importe);
        formEditar.setItemValue('tcambio', params.tpcambio);
    formEditar.attachEvent('onButtonClick', formEditarOnButtonClick);
    formEditar.attachEvent('onChange', (name, value) => {
        switch (name) {
            case 'moneda':
                gridCuenta.clearAll();
                gridCuenta.load(BASE_URL + 'BA010302/lista-cuentas/' + usrJson.empresa + '/' + value, () => {
                    let numFilas = gridCuenta.getRowsNum();
                    for (let i = 0; i < numFilas; i++) {
                        let iRowId = gridCuenta.getRowId(i);
                        let iRowData = gridCuenta.getRowData(iRowId);
                        if (iRowData.codigo == params.cuenta) {
                            gridCuenta.cells(iRowId, 0).setValue(1);
                            gridCuenta.setRowTextStyle(iRowId, 'color:#1976d2;background-color:#fff9c4;');
                            gridCuenta.showRow(iRowId);
                            ultimoCuenta = iRowId;
                            i = numFilas;
                        }
                    }
                });
                break;
            case 'categoria':
                gridIngasto.clearAll();
                gridIngasto.load(BASE_URL + 'BA010302/lista-ingreso-gasto/' + usrJson.empresa + '/' + value, () => {
                    let numFilas = gridIngasto.getRowsNum();
                    for (let i = 0; i < numFilas; i++) {
                        let iRowId = gridIngasto.getRowId(i);
                        let iRowData = gridIngasto.getRowData(iRowId);
                        if (iRowData.coingasto == params.codigoig && iRowData.categig == params.categig) {
                            gridIngasto.cells(iRowId, 0).setValue(1);
                            gridIngasto.setRowTextStyle(iRowId, 'color:#1976d2;background-color:#fff9c4;');
                            gridIngasto.showRow(iRowId);
                            ultimoIg = iRowId;
                            i = numFilas;
                        }
                    }
                });
                break;
            default: break;
        }
    });
    gridIngasto = new dhtmlXGridObject(formEditar.getContainer('ctgasto'));
        gridIngasto.setImagePath('/assets/vendor/dhtmlx/codebase/imgs/dhxgrid_skyblue/');
        gridIngasto.setIconsPath('/assets/images/icons/grid/');
        gridIngasto.setHeader(',Ingreso/gasto,C.costo,Cta.Gasto,Catal.Pspto.,Nombre Presupuesto,Cta.Contable,Cod.Ing.Gasto,Categ.Ing.Gasto,Driver');
    gridIngasto.attachHeader('#rspan,#text_filter,#select_filter,#select_filter,#select_filter,#text_filter,#select_filter,#select_filter,#select_filter,#select_filter');
        gridIngasto.setColumnIds('selected,ingasto,ccosto,ctagasto,catalpres,nompres,cuenta,coingasto,categig,driver');
        gridIngasto.setInitWidths('30,180,30,60,40,180,180,40,40,40');
        gridIngasto.setColTypes('ra,rotxt,img,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt');
        gridIngasto.setStyle(null,'color:#808080;',null,null);
        gridIngasto.init();
        gridIngasto.attachEvent('onCheck', gridIngastoOnCheck);
    gridCuenta = new dhtmlXGridObject(formEditar.getContainer('ctcuenta'));
        gridCuenta.setImagePath('/assets/vendor/dhtmlx/codebase/imgs/dhxgrid_skyblue/');
        gridCuenta.setIconsPath('/assets/images/icons/grid/');
        gridCuenta.setHeader(',Codigo,Detalle,Documento,TipoDoc.,Prefijo,Moneda,Libro');
        gridCuenta.attachHeader('#rspan,#text_filter,#text_filter,#text_filter,#select_filter,#select_filter,#select_filter,#text_filter');
        gridCuenta.setColumnIds('selected,codigo,detalle,documento,tipodoc,prefijo,moneda,libro');
        gridCuenta.setInitWidths('30,40,210,180,40,40,40,40');
        gridCuenta.setColTypes('ra,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt');
        gridCuenta.setStyle(null,'color:#808080;',null,null);
        gridCuenta.init();
        gridCuenta.attachEvent('onCheck', gridCuentaOnCheck);
    // carga los componentes del formulario´
    let result;
    try {
        result = await $.ajax({
            url: '/api/BA010302/datos-form-edicion',
            method: 'post',
            dataType: 'json'
        });
        if (result.error) {
            console.error(result.error);
            alert(result.error);
            return;
        }
        //
        formEditar.reloadOptions('moneda', result.data.monedas);
        formEditar.reloadOptions('categoria', result.data.categig);
        formEditar.getCombo('moneda').selectOption(formEditar.getCombo('moneda').getOption(params.moneda).index);
        formEditar.getCombo('categoria').selectOption(formEditar.getCombo('categoria').getOption(params.categig).index);
    }
    catch (err) {
        console.error(err);
    }
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
    toolbarMovimientos = layoutFondoFijo.cells('b').attachToolbar();
        toolbarMovimientos.setIconsPath('/assets/images/icons/toolbar/');
        toolbarMovimientos.addText('detalle',null,'<b id="span-detalle" style="color:#3f51b5;">Seleccione un Fondo Fijo</b>');
        toolbarMovimientos.addSeparator();
        toolbarMovimientos.addText('instrucciones',null,'<i>Seleccione una opción&nbsp;</i>');
        toolbarMovimientos.addButton('permisos', null, 'Permisos', 'ic-shield.svg', '');
        toolbarMovimientos.addButton('eliminar', null, 'Eliminar', 'ic-elimina.svg', 'ic-elimina-dis.svg');
        toolbarMovimientos.disableItem('eliminar');
        toolbarMovimientos.attachEvent('onClick', toolbarMovimientosOnClick);
}

toolbarMovimientosOnClick = async (id) => {
    switch (id) {
        case 'permisos':
            let out = await IniciarFormularioSeguridad(134, mainLayout);
            if (out && out.result == 'S') {
                let numFilas = gridMovimientos.getRowsNum();
                for (let i = 0; i < numFilas; i++) {
                    let iRowId = gridMovimientos.getRowId(i);
                    let iRowData = gridMovimientos.getRowData(iRowId);
                    if (iRowData.coformdoc) {
                        gridMovimientos.cells(iRowId,0).setValue('ic-editar.png^Editar');
                        gridMovimientos.cells(iRowId,42).setValue(1);
                    }
                    else {
                        gridMovimientos.cells(iRowId,0).setValue('ic-blank.svg^-');
                    }
                }
            }
            break;
    }
}

gridDetalleOnLoad = () => {
    let numFilas = gridDetalle.getRowsNum();
    for (let i = 0; i < numFilas; i++) {
        let iRowId = gridDetalle.getRowId(i);
        if (gridDetalle.cells(iRowId, 7).getValue() == 'Vigente') {
            for (let j = 0; j < 9; j++) {
                if (j == 7) gridDetalle.setCellTextStyle(iRowId, j, 'color:#4caf50;font-weight:bold;');
                else gridDetalle.setCellTextStyle(iRowId, j, 'color:#3f51b5;');
            }
        }
    }
    layoutFondoFijo.cells('a').progressOff();
}

gridDetalleOnRowDblClicked = (rowId, colId) => {
    let detalle = gridDetalle.getRowData(rowId);
    layoutFondoFijo.cells('a').collapse();
    layoutFondoFijo.cells('b').expand();
    gridMovimientos = layoutFondoFijo.cells('b').attachGrid();
        gridMovimientos.setIconsPath('/assets/images/icons/grid/');
        gridMovimientos.setHeader(',Aprob. Conta,Fecha,Documento,,Razón Social,Imp. ingreso,Imp. egreso,Moneda,Tipo cambio,Imp. original,Concepto,Cuenta gasto,Cuenta contable,Contabilidad,Imagen,Periodo,Empresa,Libro contable,Transfiere,Prin voucher,Cta. Dcto.,Formato utilizado,Categ. Ing. Gasto,Co Ing. Gasto,Definicion del gasto,Co F. Fijo,Imp. saldo,N° F. Fijo,N° clas.,Tipo entidad,N° RUC,Tipo Doc Adm,St Ing. Egr.,Catal Pspto,Centro soli,Usuario soli,N° control,De tipo,N°,Serie,,,');
        gridMovimientos.attachHeader('#rspan,#rspan,#text_filter,#text_filter,#rspan,#text_filter,#numeric_filter,#numeric_filter,#select_filter,#numeric_filter,#numeric_filter,#text_filter,#select_filter,#text_filter,#rspan,#rspan,#select_filter,#select_filter,#select_filter,#rspan,#text_filter,#select_filter,#text_filter,#select_filter,#select_filter,#text_filter,#text_filter,#numeric_filter,#text_filter,#select_filter,#select_filter,#text_filter,#select_filter,#rspan,#select_filter,#select_filter,#select_filter,#numeric_filter,#text_filter,#numeric_filter,#text_filter,#rspan,#rspan,#rspan');
        gridMovimientos.setColumnIds('edicion,ctaprob,fecha,documento,boton,rsocial,ingreso,egreso,moneda,tpcambio,original,concepto,cuentagasto,descripcion,scontabilidad,simagen,periodo,empresa,libro,stransaccion,cvoucher,cuentadoc,observaciones,categig,codigoig,gasto,fondo,saldo,numero,clasenti,tpenti,catalenti,tpdocumento,singegr,catalpres,ccostosoli,usuariosoli,control,tipo,numdoc,seriedoc,coformdoc,editable,comoneda');
        gridMovimientos.setInitWidths('30,30,80,80,30,240,100,100,40,60,100,320,60,160,30,30,80,60,80,30,80,80,160,80,80,160,60,100,60,80,80,80,60,30,80,80,80,60,120,100,80,0,0,0');
    gridMovimientos.setColTypes('img,img,rotxt,rotxt,img,rotxt,ron,ron,rotxt,ron,ron,rotxt,rotxt,rotxt,rotxt,rotxt,ron,ron,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,ron,ron,ron,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,ron,rotxt,ron,ron,ron');
    gridMovimientos.setColAlign('left,left,left,left,center,left,right,right,left,left,right,left,left,left,center,center,left,left,left,center,left,left,left,left,left,left,left,right,left,left,left,left,left,center,left,left,left,left,left,left,left,left,left,left');
        gridMovimientos.setNumberFormat('0,000.00', 6);
        gridMovimientos.setNumberFormat('0,000.00', 7);
        gridMovimientos.setNumberFormat('0,000.00', 9);
        gridMovimientos.setNumberFormat('0,000.00', 10);
        gridMovimientos.setNumberFormat('0,000.00', 27);
        gridMovimientos.init();
    layoutFondoFijo.cells('b').progressOn();
    gridMovimientos.load(BASE_URL + 'BA010302/movimientos-fondo/' + usrJson.empresa + '/' + detalle.codigo + '/' + detalle.numero, layoutFondoFijoOnLoad);
    gridMovimientos.attachEvent('onRowSelect', gridMovimientosOnRowSelect);
    $('#span-detalle').text('Fondo Fijo ' + detalle.codigo + ' - ' + detalle.numero);
}

layoutFondoFijoOnLoad = () => {
    let numFilas = gridMovimientos.getRowsNum();
    for (let i = 0; i < numFilas; i++) {
        let iRowId = gridMovimientos.getRowId(i);
        let iRowData = gridMovimientos.getRowData(iRowId);
        gridMovimientos.setCellTextStyle(iRowId,0,'cursor:pointer;');
        gridMovimientos.setCellTextStyle(iRowId,4,'cursor:pointer;');
        // gridMovimientos
        if (iRowData.coformdoc) {
            gridMovimientos.cells(iRowId,0).setValue('ic-editar-dis.png^Se requiere permisos');
        }
        else {
            gridMovimientos.cells(iRowId,0).setValue('ic-blank.svg^-');
        }
    }
    layoutFondoFijo.cells('b').progressOff();
}

gridMovimientosOnRowSelect = async (rowId, colId) => {
    let movimiento = gridMovimientos.getRowData(rowId);
    switch (colId) {
        case 0:
            if (movimiento.editable == 1) {
                let params = {
                    fecha: movimiento.fecha,
                    moneda: movimiento.comoneda,
                    importe: movimiento.egreso,
                    tpcambio: movimiento.tpcambio,
                    cuenta: movimiento.cuentadoc,
                    categig: movimiento.categig,
                    codigoig: movimiento.codigoig
                };
                MostrarVentanaEdicion(params);
            }
            break;
        case 4:
            const params = {
                filtro: movimiento.documento,
                maximo: 1, // cuántos archivos como máximo están permitidos para el file. por defecto es cero
                // minimo: 1, // cuántos archivos como mínimo están permitidos para el file. por defecto es cero
                lectura: {
                    empresa: usrJson.empresa,
                    archivo: movimiento.catalenti,
                    tpdocumento: movimiento.tpdocumento
                },
                escritura: {
                    usuario: 8,
                    documento: movimiento.documento,
                    destino: 'PROVEEDORES',
                    tpdocadm: movimiento.tpdocumento,
                    catalenti: movimiento.catalenti,
                    periodo: movimiento.periodo,
                    tipoenti: movimiento.tpenti
                },
                default: 0
            }
            AbrirVisor(params, mainLayout.dhxWins);
            break;
        default: break;
    }
}

formEditarOnButtonClick = async (name) => {
    switch (name) {
        case 'actualizar':
            let mvData = gridMovimientos.getRowData(gridMovimientos.getSelectedRowId());
            let igData = gridIngasto.getRowData(ultimoIg);
            let ctData = gridCuenta.getRowData(ultimoCuenta);
            let data = {
                // campos para validacion
                empresa: usrJson.empresa,
                alias: usrJson.alias,
                cofondo: mvData.fondo,
                nufondo: mvData.numero,
                periodo: mvData.periodo,
                documento: mvData.documento,
                catalenti: mvData.catalenti,
                // campos a actualizar
                aprobado: formEditar.isItemChecked('aprobado') ? 'S' : 'N',
                cuentadoc: ctData.codigo,
                importe: formEditar.getItemValue('importe'),
                moneda: formEditar.getItemValue('moneda'),
                tpcambio: formEditar.getItemValue('tcambio'),
                fecha: formEditar.getCalendar('fmovimiento').getFormatedDate('%d/%m/%Y'),
                categig: igData.categig,
                coingasto: igData.coingasto,
                catalpres: igData.catalpres,
                // concepto: xxx,
                usvalida: usrJson.codigo
            };
            let result;
            try {
                result = await $.ajax({
                    url: '/api/BA010302/actualiza-fondo-fijo',
                    method: 'post',
                    data: data,
                    dataType: 'json'
                });
                if (result.error) {
                    alert(result.error);
                    return;
                }
                gridMovimientos.clearAll();
                layoutFondoFijo.cells('b').progressOn();
                gridMovimientos.load(BASE_URL + 'BA010302/movimientos-fondo/' + usrJson.empresa + '/' + mvData.fondo + '/' + mvData.numero, layoutFondoFijoOnLoad);
                alert('Se grabó el movimiento');
                winEditar.close();
            }
            catch (err) {
                alert(err);
            }
            break;
        case 'cancelar':
            break;
        default: break;
    }
}

gridIngastoOnCheck = (rowId, colId, state) => {
    if (ultimoIg) {
        gridIngasto.setRowTextStyle(ultimoIg, 'color:#808080;background-color:inherit;');
    }
    if (state) {
        gridIngasto.setRowTextStyle(rowId, 'color:#1976d2;background-color:#fff9c4;');
    }
    ultimoIg = rowId;
}
gridCuentaOnCheck = (rowId, colId, state) => {
    if (ultimoCuenta) {
        gridCuenta.setRowTextStyle(ultimoCuenta, 'color:#808080;background-color:inherit;');
    }
    if (state) {
        gridCuenta.setRowTextStyle(rowId, 'color:#1976d2;background-color:#fff9c4;');
    }
    ultimoCuenta = rowId;
}
