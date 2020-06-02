var entidad, oldDocumentosRowId;

// funciones comunes

function setSens(calendar, inp, k) {
    if (k == 'min') {
        calendar.setSensitiveRange(inp.value, null);
    }
    else {
        calendar.setSensitiveRange(null, inp.value);
    }
}

// transferencias

function toolbarTransferenciasOnClick (id) {
    switch (id) {
        case 'TrfBusca':
            let moneda = comboTrfmonedas.getSelectedValue();
            let columna = comboTrfcolumna.getSelectedValue();
            let desde = encodeURIComponent(toolbarTransferencias.getValue('TrfDesde'));
            let hasta = encodeURIComponent(toolbarTransferencias.getValue('TrfHasta'));
            tabbar.tabs('transferencia').detachObject();
            gridTransferencia = tabbar.tabs('transferencia').attachGrid();
                gridTransferencia.setImagePath("/assets/images/icons/grid/");
                gridTransferencia.setHeader('co_empresa,co_documento,fe_emitido,co_catalogo_entidad,de_razon_social,im_ingreso,im_egreso,im_saldo,de_concepto,co_trans_banc_tran,co_moneda,fe_sys,co_libro_contable,co_periodo,nu_voucher,co_documento_ancestro,fe_vencimiento,es_vigencia,st_detraccion,st_aprobado,co_unico,de_url,co_tipo_doc_administr');
                gridTransferencia.setColTypes('rotxt,rotxt,rotxt,ron,rotxt,ron,ron,ron,rotxt,rotxt,ron,rotxt,ron,ron,rotxt,rotxt,rotxt,rotxt,img,img,rotxt,rotxt,rotxt');
                gridTransferencia.setNumberFormat(comboTrfmonedas.getSelectedText().split(' ')[0] + ' 0,000.00', 5);
                gridTransferencia.setNumberFormat(comboTrfmonedas.getSelectedText().split(' ')[0] + ' 0,000.00', 6);
                gridTransferencia.setNumberFormat(comboTrfmonedas.getSelectedText().split(' ')[0] + ' 0,000.00', 7);
                gridTransferencia.setInitWidths('60,100,80,100,240,120,120,120,320,100,60,80,60,80,80,80,80,80,30,30,60,160,50');
                gridTransferencia.setColAlign('left,left,left,right,left,right,right,right,left,left,left,left,left,right,left,left,left,left,center,center,left,left,center');
                gridTransferencia.init();
            tabbar.tabs('transferencia').progressOn();
            gridTransferencia.load('/api/LO010301/grid-pagos-transferencia/' + usrJson.empresa + '/' + moneda + '/' + columna + '/' + desde + '/' + hasta, function () {
                tabbar.tabs('transferencia').progressOff();
            });
            break;
        default: break;
    }
}

function EstructuraTransferencias () {
    toolbarTransferencias = tabbar.tabs('transferencia').attachToolbar();
        toolbarTransferencias.setIconsPath('/assets/images/icons/toolbar/');
        toolbarTransferencias.addText('lblMoneda', null, 'Moneda');
        toolbarTransferencias.addText('cmbMoneda', null, '<div id="cmb-trfmoneda" class="dv-combo" style="width:100px;"></div>');
        toolbarTransferencias.addText('lblColumna', null, 'Buscar por');
        toolbarTransferencias.addText('cmbMoneda', null, '<div id="cmb-trfcolumna" class="dv-combo" style="width:120px;"></div>');
        toolbarTransferencias.addText('lblDesde', null, 'Desde');
        toolbarTransferencias.addInput('TrfDesde', null, null, 100);
        toolbarTransferencias.addText('lblHasta', null, 'Hasta');
        toolbarTransferencias.addInput('TrfHasta', null, null, 100);
        toolbarTransferencias.addButton('TrfBusca', null, 'Buscar', 'ic-goggles.svg', 'ic-goggles-dis.svg');
    comboTrfmonedas = new dhtmlXCombo('cmb-trfmoneda');
    comboTrfcolumna = new dhtmlXCombo('cmb-trfcolumna');
    // colocar los calendarios
    calendarTrfinicio = toolbarTransferencias.getInput('TrfDesde');
        calendarTrfinicio.setAttribute('readOnly', true);
        calendarTrfinicio.onclick = function () { setSens(calendarTransferencia, calendarTrffin, 'max'); }
    calendarTrffin = toolbarTransferencias.getInput('TrfHasta');
        calendarTrffin.setAttribute('readOnly', true);
        calendarTrffin.onclick = function () { setSens(calendarTransferencia, calendarTrfinicio, 'min'); }
    calendarTransferencia = new dhtmlXCalendarObject([calendarTrfinicio, calendarTrffin]);
        calendarTransferencia.setDateFormat('%d/%m/%Y');
    toolbarTransferencias.setValue('TrfDesde', '01/01/2020');
    toolbarTransferencias.setValue('TrfHasta', '30/04/2020');
    toolbarTransferencias.attachEvent('onClick', toolbarTransferenciasOnClick);
}

// reportes tipo documento

function gridWinBuscaTpdocOnRowDblClicked (rowId, colId) {
    let data = gridWinBuscaTpdoc.getRowData(rowId);
    document.getElementById('lbl-tpdoc-cod').innerHTML = data.codigo;
    document.getElementById('lbl-tpdoc-desc').innerHTML = data.tpdocumento;
    winBuscaTpdoc.close();
}

function toolbarRepTpdocOnClick (name) {
    switch (name) {
        case 'btTpdocFiltro':
            winBuscaTpdoc = viewport.createWindow('winBuscaTpdoc', 0, 0, 640, 480);
            winBuscaTpdoc.setText('Tipo documento administrativo')
            winBuscaTpdoc.center();
            gridWinBuscaTpdoc = winBuscaTpdoc.attachGrid();
                gridWinBuscaTpdoc.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
                gridWinBuscaTpdoc.setIconsPath("/assets/images/icons/grid/");
                gridWinBuscaTpdoc.setHeader('Código,Tipo documento,Abreviatura,Bancario,Estado');
                gridWinBuscaTpdoc.attachHeader('#text_filter,#text_filter,#text_filter,#rspan,#select_filter');
                gridWinBuscaTpdoc.setColumnIds('codigo,tpdocumento,abreviatura,bancario,estado');
                gridWinBuscaTpdoc.setColTypes('rotxt,rotxt,rotxt,img,rotxt');
                gridWinBuscaTpdoc.setInitWidths('80,320,80,40,80');
                gridWinBuscaTpdoc.setColAlign('left,left,left,center,left');
                gridWinBuscaTpdoc.init();
            winBuscaTpdoc.progressOn();
            gridWinBuscaTpdoc.load('/api/LO010301/tipos-doc-admin', function() {
                winBuscaTpdoc.progressOff();
            });
            gridWinBuscaTpdoc.attachEvent('onRowDblClicked', gridWinBuscaTpdocOnRowDblClicked);
            break;
        case 'btTpdocBusca':
            let tpdoc = document.getElementById('lbl-tpdoc-cod').innerHTML;
            if (tpdoc != '') {
                generaGridReportesTpdoc();
            }
            else {
                alert('Debe seleccionar un tipo de documento');
            }
            break;
        default: break;
    }
}

function generaGridReportesTpdoc() {
    tabbar.tabs('reportes').detachObject();
    gridRepTpdoc = tabbar.tabs('reportes').attachGrid();
        gridRepTpdoc.setImagePath("/assets/images/icons/grid/");
        gridRepTpdoc.setHeader('Tp.Doc.,Documento,Documento,F.Emisión,RUC/DNI,Razón social,Ingreso,Egreso,Saldo,Concepto,Moneda,F.Vence,Doc.Banco,F.Sistema,Libro,Periodo,Voucher,Doc.Ancestro,Estado,Detracción');
        gridRepTpdoc.setColumnIds('tpdoc,documento1,documento2,femision,rucdni,rsocial,ingreso,egreso,saldo,concepto,moneda,fvence,docbanco,fsistema,libro,periodo,voucher,ancestro,estado,detraccion');
        gridRepTpdoc.setColTypes('rotxt,rotxt,rotxt,rotxt,ron,rotxt,ron,ron,ron,rotxt,rotxt,rotxt,rotxt,rotxt,ron,ron,ron,rotxt,rotxt,img');
        gridRepTpdoc.setNumberFormat('0,000.00', 6);
        gridRepTpdoc.setNumberFormat('0,000.00', 7);
        gridRepTpdoc.setNumberFormat('0,000.00', 8);
        gridRepTpdoc.setInitWidths('60,80,80,80,80,240,100,100,100,240,60,80,80,80,80,80,80,80,60,60');
        //gridRepTpdoc.setColAlign('right,left,right,right,right,right,right,left,right,left,right,right');
        gridRepTpdoc.init();
}

function EstructuraReportesTpdoc() {
    toolbarRepTpdoc = tabbar.tabs('reportes').attachToolbar();
        toolbarRepTpdoc.setIconsPath('/assets/images/icons/toolbar/');
        toolbarRepTpdoc.addText('lblDesde', null, 'Desde');
        toolbarRepTpdoc.addInput('RepTpdocDesde', null, null, 100);
        toolbarRepTpdoc.addText('lblHasta', null, 'Hasta');
        toolbarRepTpdoc.addInput('RepTpdocHasta', null, null, 100);
        toolbarRepTpdoc.addText('lblTpdocCodigo', null, 'Tipo documento');
        toolbarRepTpdoc.addText('ipTpdocCodigo', null, '<div id="lbl-tpdoc-cod" class="dv-label text-right" style="width:80px;"></div>');
        toolbarRepTpdoc.addButton('btTpdocFiltro', null, '', 'ic-search.svg');
        toolbarRepTpdoc.addText('ipTpdocDesc', null, '<div id="lbl-tpdoc-desc" class="dv-label" style="width:240px;"></div>');
        toolbarRepTpdoc.addButton('btTpdocBusca', null, 'Buscar', 'ic-goggles.svg', 'ic-goggles-dis.svg');
    // colocar los calendarios
    calendarRinicio = toolbarRepTpdoc.getInput('RepTpdocDesde');
        calendarRinicio.setAttribute('readOnly', true);
        calendarRinicio.onclick = function () { setSens(calendarRepTpdoc, calendarRfin, 'max'); }
    calendarRfin = toolbarRepTpdoc.getInput('RepTpdocHasta');
        calendarRfin.setAttribute('readOnly', true);
        calendarRfin.onclick = function () { setSens(calendarRepTpdoc, calendarRinicio, 'min'); }
    calendarRepTpdoc = new dhtmlXCalendarObject([calendarRinicio, calendarRfin]);
        calendarRepTpdoc.setDateFormat('%d/%m/%Y');
    toolbarRepTpdoc.setValue('RepTpdocDesde', '01/01/2020');
    toolbarRepTpdoc.setValue('RepTpdocHasta', '30/04/2020');
    toolbarRepTpdoc.attachEvent('onClick', toolbarRepTpdocOnClick);
}

// documentos aprobados por pagar

function generaGridCajasDisponibles() {
    gridDocsAprobCajas = layoutDocsAprob.cells('b').attachGrid();
        gridDocsAprobCajas.setImagePath("/assets/images/icons/grid/");
        gridDocsAprobCajas.setHeader('Caja,Moneda,Movimientos,Periodo,Inicial,Ingreso,Egreso,F.Cierre,Cierre,Estado,F.Inicio,F.Registro');
        gridDocsAprobCajas.setColumnIds('caja,moneda,movimientos,periodo,inicial,ingreso,egreso,fcierre,cierre,estado,finicio,fregistro');
        gridDocsAprobCajas.setColTypes('ron,rotxt,ron,ron,ron,ron,ron,rotxt,ron,rotxt,rotxt,rotxt');
        gridDocsAprobCajas.setNumberFormat('0,000.00', 2);
        gridDocsAprobCajas.setNumberFormat('0,000.00', 4);
        gridDocsAprobCajas.setNumberFormat('0,000.00', 5);
        gridDocsAprobCajas.setNumberFormat('0,000.00', 6);
        gridDocsAprobCajas.setNumberFormat('0,000.00', 8);
        gridDocsAprobCajas.setInitWidths('50,100,100,80,100,100,100,80,100,100,80,80');
        gridDocsAprobCajas.setColAlign('right,left,right,right,right,right,right,left,right,left,right,right');
    gridDocsAprobCajas.init();
    layoutDocsAprob.cells('b').progressOn();
    gridDocsAprobCajas.load('/api/LO010301/grid-docs-aprob-cajas/' + usrJson.alias, function() {
        layoutDocsAprob.cells('b').progressOff();
    });
}

function generaGridDocsCancelar() {
    gridDocsAprobDocumentos = layoutDocsAprob.cells('a').attachGrid();
        gridDocsAprobDocumentos.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
        gridDocsAprobDocumentos.setIconsPath("/assets/images/icons/grid/");
        gridDocsAprobDocumentos.setHeader('Moneda,F.Emisión,Documento,RUC/DNI,Raz.Social,Saldo,Ingreso,Egreso,Concepto,F.Vence,Doc.Banco,F.Sistema,Libro,Periodo,Voucher,Doc.Ancestro,Estado,Detracción');
        gridDocsAprobDocumentos.setColumnIds('moneda,femision,documento,rucdni,rsocial,saldo,ingreso,egreso,concepto,fvence,docbanco,fsistema,libro,periodo,voucher,docancestro,estado,detraccion');
        gridDocsAprobDocumentos.setColTypes('rotxt,rotxt,rotxt,rotxt,rotxt,ron,ron,ron,rotxt,rotxt,rotxt,rotxt,ron,ron,ron,rotxt,rotxt,img');
        gridDocsAprobDocumentos.setNumberFormat('0,000.00', 5);
        gridDocsAprobDocumentos.setNumberFormat('0,000.00', 6);
        gridDocsAprobDocumentos.setNumberFormat('0,000.00', 7);
        gridDocsAprobDocumentos.setInitWidths('60,80,80,90,240,100,100,100,240,80,80,80,60,70,60,80,80,60');
        gridDocsAprobDocumentos.setColAlign('left,left,left,right,left,right,right,right,left,left,left,left,left,left,left,left,left,center');
    gridDocsAprobDocumentos.init();
    layoutDocsAprob.cells('a').progressOn();
    gridDocsAprobDocumentos.load('/api/LO010301/grid-docs-aprob-cancelar/' + usrJson.empresa, function() {
        gridDocsAprobDocumentos.insertColumn(5,'Sel.','ch','30','asc','center','middle');
        layoutDocsAprob.cells('a').progressOff();
    });
}

function EstructuraDocsAprobsPagar() {
    // toolbarDocsAprob, layoutDocsAprob, gridDocsAprobCajas, gridDocsAprobDocumentos
    toolbarDocsAprob = tabbar.tabs('documentos').attachToolbar();
        toolbarDocsAprob.setIconsPath('/assets/images/icons/toolbar/');
        toolbarDocsAprob.addText('lblFecha', null, 'Fecha');
        toolbarDocsAprob.addInput('ipFecha', null, null, 80);
        toolbarDocsAprob.addText('lblTcambio', null, 'Tipo cambio');
        toolbarDocsAprob.addInput('ipTcambio', null, null, 60);
        toolbarDocsAprob.addSeparator();
        toolbarDocsAprob.addButton('btPagoMasivo', null, 'Pago masivo', 'ic-generate.svg', 'ic-generate-dis.svg');
        toolbarDocsAprob.addButton('btPermisos', null, 'Permisos', 'ic-shield.svg');
        toolbarDocsAprob.addButton('btAutorizar', null, 'Autorizar', 'ic-ok.svg', 'ic-ok-dis.svg');
    layoutDocsAprob = tabbar.tabs('documentos').attachLayout('2E');
    layoutDocsAprob.cells('a').setText('Documentos aprobados para cancelar');
    layoutDocsAprob.cells('b').setHeight('120');
    layoutDocsAprob.cells('b').setText('Cajas disponibles');
    // :alias
    generaGridCajasDisponibles();
    generaGridDocsCancelar();
}

// letras por pagar

function toolbarLpagarOnClick (id) {
    switch (id) {
        case 'LpagarBusca':
            let moneda = comboLmonedas.getSelectedValue();
            let columna = comboLcolumna.getSelectedValue();
            let desde = encodeURIComponent(toolbarLpagar.getValue('LpagarDesde'));
            let hasta = encodeURIComponent(toolbarLpagar.getValue('LpagarHasta'));
            tabbar.tabs('letras').detachObject();
                gridLpagar = tabbar.tabs('letras').attachGrid();
                gridLpagar.setImagePath("/assets/images/icons/grid/");
                gridLpagar.setHeader('co_empresa,co_documento,fe_emitido,co_catalogo_entidad,de_razon_social,im_ingreso,im_egreso,im_saldo,de_concepto,co_trans_banc_tran,co_moneda,fe_sys,co_libro_contable,co_periodo,nu_voucher,co_documento_ancestro,fe_vencimiento,es_vigencia,st_detraccion,st_aprobado,co_unico,de_url,co_tipo_doc_administr');
                gridLpagar.setColTypes('rotxt,rotxt,rotxt,ron,rotxt,ron,ron,ron,rotxt,rotxt,ron,rotxt,ron,ron,rotxt,rotxt,rotxt,rotxt,img,img,rotxt,rotxt,rotxt');
                gridLpagar.setNumberFormat(comboLmonedas.getSelectedText().split(' ')[0] + ' 0,000.00', 5);
                gridLpagar.setNumberFormat(comboLmonedas.getSelectedText().split(' ')[0] + ' 0,000.00', 6);
                gridLpagar.setNumberFormat(comboLmonedas.getSelectedText().split(' ')[0] + ' 0,000.00', 7);
                gridLpagar.setInitWidths('60,100,80,100,240,120,120,120,320,100,60,80,60,80,80,80,80,80,30,30,60,160,50');
                gridLpagar.setColAlign('left,left,left,right,left,right,right,right,left,left,left,left,left,right,left,left,left,left,center,center,left,left,center');
                gridLpagar.init();
            tabbar.tabs('letras').progressOn();
            gridLpagar.load('/api/LO010301/grid-letras-pagar/' + usrJson.empresa + '/' + moneda + '/' + columna + '/' + desde + '/' + hasta, function () {
                tabbar.tabs('letras').progressOff();
            });
            break;
        default: break;
    }
}

function EstructuraLetras() {
    toolbarLpagar = tabbar.tabs('letras').attachToolbar();
        toolbarLpagar.setIconsPath('/assets/images/icons/toolbar/');
        toolbarLpagar.addText('lblMoneda', null, 'Moneda');
        toolbarLpagar.addText('cmbMoneda', null, '<div id="cmb-lmoneda" class="dv-combo" style="width:100px;"></div>');
        toolbarLpagar.addText('lblColumna', null, 'Buscar por');
        toolbarLpagar.addText('cmbMoneda', null, '<div id="cmb-lcolumna" class="dv-combo" style="width:120px;"></div>');
        toolbarLpagar.addText('lblDesde', null, 'Desde');
        toolbarLpagar.addInput('LpagarDesde', null, null, 100);
        toolbarLpagar.addText('lblHasta', null, 'Hasta');
        toolbarLpagar.addInput('LpagarHasta', null, null, 100);
        toolbarLpagar.addButton('LpagarBusca', null, 'Buscar', 'ic-goggles.svg', 'ic-goggles-dis.svg');
    comboLmonedas = new dhtmlXCombo('cmb-lmoneda');
    comboLcolumna = new dhtmlXCombo('cmb-lcolumna');
    // colocar los calendarios
    calendarLinicio = toolbarLpagar.getInput('LpagarDesde');
        calendarLinicio.setAttribute('readOnly', true);
        calendarLinicio.onclick = function () { setSens(calendarLpagar, calendarLfin, 'max'); }
    calendarLfin = toolbarLpagar.getInput('LpagarHasta');
        calendarLfin.setAttribute('readOnly', true);
        calendarLfin.onclick = function () { setSens(calendarLpagar, calendarLinicio, 'min'); }
    calendarLpagar = new dhtmlXCalendarObject([calendarLinicio, calendarLfin]);
        calendarLpagar.setDateFormat('%d/%m/%Y');
    toolbarLpagar.setValue('LpagarDesde', '01/01/2020');
    toolbarLpagar.setValue('LpagarHasta', '30/04/2020');
    toolbarLpagar.attachEvent('onClick', toolbarLpagarOnClick);
}

// facturas por pagar

function toolbarFpagarOnClick (id) {
    switch (id) {
        case 'FpagarBusca':
            let moneda = comboFmonedas.getSelectedValue();
            let columna = comboFcolumna.getSelectedValue();
            let desde = encodeURIComponent(toolbarFpagar.getValue('FpagarDesde'));
            let hasta = encodeURIComponent(toolbarFpagar.getValue('FpagarHasta'));
            tabbar.tabs('fpagar').detachObject();
            gridFpagar = tabbar.tabs('fpagar').attachGrid();
                gridFpagar.setImagePath("/assets/images/icons/grid/");
                gridFpagar.setHeader('co_empresa,co_documento,fe_emitido,co_catalogo_entidad,de_razon_social,im_ingreso,im_egreso,im_saldo,de_concepto,co_trans_banc_tran,co_moneda,fe_sys,co_libro_contable,co_periodo,nu_voucher,co_documento_ancestro,fe_vencimiento,es_vigencia,st_detraccion,st_aprobado,co_unico,co_tipo_doc_administr,st_fact_nego,nu_numero_unico,fe_vcto_negociable');
                gridFpagar.setColTypes('ron,rotxt,rotxt,ron,rotxt,ron,ron,ron,rotxt,rotxt,ron,rotxt,ron,ron,rotxt,rotxt,rotxt,rotxt,img,img,rotxt,rotxt,img,rotxt,rotxt');
                gridFpagar.setNumberFormat(comboFmonedas.getSelectedText().split(' ')[0] + ' 0,000.00', 5);
                gridFpagar.setNumberFormat(comboFmonedas.getSelectedText().split(' ')[0] + ' 0,000.00', 6);
                gridFpagar.setNumberFormat(comboFmonedas.getSelectedText().split(' ')[0] + ' 0,000.00', 7);
                gridFpagar.setInitWidths('60,100,80,100,240,120,120,120,320,100,60,80,60,80,80,80,80,80,30,30,60,60,30,80,80');
                gridFpagar.setColAlign('left,left,left,right,left,right,right,right,left,left,left,left,left,right,left,left,left,left,center,center,left,left,center,left,left');
                gridFpagar.init();
            tabbar.tabs('fpagar').progressOn();
            gridFpagar.load('/api/LO010301/grid-facturas-pagar/' + usrJson.empresa + '/' + moneda + '/' + columna + '/' + desde + '/' + hasta, function () {
                tabbar.tabs('fpagar').progressOff();
            });
            break;
        default: break;
    }
}

function EstructuraFactpagar() {
    toolbarFpagar = tabbar.tabs('fpagar').attachToolbar();
        toolbarFpagar.setIconsPath('/assets/images/icons/toolbar/');
        toolbarFpagar.addText('lblMoneda', null, 'Moneda');
        toolbarFpagar.addText('cmbMoneda', null, '<div id="cmb-fmoneda" class="dv-combo" style="width:100px;"></div>');
        toolbarFpagar.addText('lblColumna', null, 'Buscar por');
        toolbarFpagar.addText('cmbMoneda', null, '<div id="cmb-fcolumna" class="dv-combo" style="width:120px;"></div>');
        toolbarFpagar.addText('lblDesde', null, 'Desde');
        toolbarFpagar.addInput('FpagarDesde', null, null, 100);
        toolbarFpagar.addText('lblHasta', null, 'Hasta');
        toolbarFpagar.addInput('FpagarHasta', null, null, 100);
        toolbarFpagar.addButton('FpagarBusca', null, 'Buscar', 'ic-goggles.svg', 'ic-goggles-dis.svg');
    comboFmonedas = new dhtmlXCombo('cmb-fmoneda');
    comboFcolumna = new dhtmlXCombo('cmb-fcolumna');
    // colocar los calendarios
    calendarFinicio = toolbarFpagar.getInput('FpagarDesde');
        calendarFinicio.setAttribute('readOnly', true);
        calendarFinicio.onclick = function () { setSens(calendarFpagar, calendarFfin, 'max'); }
    calendarFfin = toolbarFpagar.getInput('FpagarHasta');
        calendarFfin.setAttribute('readOnly', true);
        calendarFfin.onclick = function () { setSens(calendarFpagar, calendarFinicio, 'min'); }
    calendarFpagar = new dhtmlXCalendarObject([calendarFinicio, calendarFfin]);
        calendarFpagar.setDateFormat('%d/%m/%Y');
    toolbarFpagar.setValue('FpagarDesde', '01/01/2020');
    toolbarFpagar.setValue('FpagarHasta', '30/04/2020');
    toolbarFpagar.attachEvent('onClick', toolbarFpagarOnClick);
}

// facturas provisionadas

function CargarInfoProveedor() {
    let params = {
        empresa: usrJson.empresa,
        entidad: entidad.codigo,
        tipoenti: comboTpentis.getSelectedValue(),
        moneda: comboMonedas.getSelectedValue()
    };
    $.post('/api/LO010301/dt-info-proveedor', params, function (result) {
        console.log(result.data);
        document.getElementById('lbl-moneda').innerHTML = result.data.omoneda;
        document.getElementById('lbl-ingreso').innerHTML = result.data.oingreso.toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        document.getElementById('lbl-egreso').innerHTML = result.data.oegreso.toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        document.getElementById('lbl-saldo').innerHTML = result.data.osaldo.toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }, 'json');
}

function MostrarLayoutDetalle(row) {
    layoutDocumentosDetalle = layoutDocumentos.cells('b').attachLayout('4E');
        layoutDocumentosDetalle.cells('a').hideHeader();
        layoutDocumentosDetalle.cells('b').hideHeader();
        layoutDocumentosDetalle.cells('c').hideHeader();
        layoutDocumentosDetalle.cells('d').hideHeader();
    // genera las grids
    gridDocumentosDetalleA = layoutDocumentosDetalle.cells('a').attachGrid();
        gridDocumentosDetalleA.setHeader('co_letra,im_monto,fe_registro,es_vigencia,co_documento,co_empresa,de_nombre');
        gridDocumentosDetalleA.setColTypes('rotxt,ron,rotxt,rotxt,rotxt,ron,rotxt');
        gridDocumentosDetalleA.init();
        layoutDocumentosDetalle.cells('a').progressOn();
        gridDocumentosDetalleA.load('/api/LO010301/grid-letras-provisionadas/' + usrJson.empresa + '/' + row.documento, function () {
            layoutDocumentosDetalle.cells('a').progressOff();
        });
    gridDocumentosDetalleB = layoutDocumentosDetalle.cells('b').attachGrid();
        gridDocumentosDetalleB.setHeader('co_nota_cred_debi_compra,co_documento,co_guia_devo_prov,im_final,de_tipo,es_vigencia,fe_registro');
        gridDocumentosDetalleB.setColTypes('rotxt,rotxt,rotxt,ron,rotxt,rotxt,rotxt');
        gridDocumentosDetalleB.init();
        layoutDocumentosDetalle.cells('b').progressOn();
        gridDocumentosDetalleB.load('/api/LO010301/grid-notas-crdb/' + usrJson.empresa + '/' + row.documento + '/' + entidad.codigo, function () {
            layoutDocumentosDetalle.cells('b').progressOff();
        });
    gridDocumentosDetalleC = layoutDocumentosDetalle.cells('c').attachGrid();
        gridDocumentosDetalleC.setHeader('co_documento,co_documento,im_egreso,im_saldo,im_tipo_cambio,fe_emision,de_descripcion,co_prin_voucher');
        gridDocumentosDetalleC.setColTypes('rotxt,rotxt,ron,ron,ron,rotxt,rotxt,rotxt');
        gridDocumentosDetalleC.setNumberFormat('0,000.00', 2);
        gridDocumentosDetalleC.setNumberFormat('0,000.00', 3);
        gridDocumentosDetalleC.setNumberFormat('0,000.00', 4);
        gridDocumentosDetalleC.init();
        layoutDocumentosDetalle.cells('c').progressOn();
        gridDocumentosDetalleC.load('/api/LO010301/grid-ctacte-compras/' + usrJson.empresa + '/' + row.documento + '/' + entidad.codigo, function () {
            layoutDocumentosDetalle.cells('c').progressOff();
        });
    gridDocumentosDetalleD = layoutDocumentosDetalle.cells('d').attachGrid();
        gridDocumentosDetalleD.setHeader('Documento,Importe,Fecha,Origen,Concepto,Trans.Bancaria,TipoDoc.Admin.');
        gridDocumentosDetalleD.setColTypes('rotxt,ron,rotxt,rotxt,rotxt,rotxt,rotxt');
        gridDocumentosDetalleD.setNumberFormat('0,000.00', 1);
        gridDocumentosDetalleD.setInitWidths('120,100,80,120,240,80,80');
        gridDocumentosDetalleD.setColAlign('left,right,left,left,left,right,right');
        gridDocumentosDetalleD.init();
        layoutDocumentosDetalle.cells('d').progressOn();
    gridDocumentosDetalleD.load('/api/LO010301/grid-documentos-proveedor/' + usrJson.empresa + '/' + row.tpentidad + '/' + row.coclasif + '/' + entidad.codigo + '/' + row.documento + '/' + row.tpdocadmin, function () {
        layoutDocumentosDetalle.cells('d').progressOff();
    });
}

function gridDocumentosOnRowSelect (rowId, colId) {
    let iFila = gridDocumentos.getRowData(rowId);
    switch (colId) {
        case 0:
            break;
        case 1:
            break;
        case 2:
            if (rowId == oldDocumentosRowId) {
                if (layoutDocumentos.cells('b').isCollapsed()) {
                    layoutDocumentos.cells('b').expand();
                }
                else {
                    layoutDocumentos.cells('b').collapse();
                }
            }
            else {
                layoutDocumentos.cells('b').detachObject();
                if (layoutDocumentos.cells('b').isCollapsed()) layoutDocumentos.cells('b').expand();
                MostrarLayoutDetalle(iFila);
            }
            oldDocumentosRowId = rowId;
            break;
        /*case 5:
            break;
        case 13:
            break;*/
        default: break;
    }
}

function PreparaInterfazProveedor() {
    tabbar.tabs('provisionados').detachObject();
    tabbar.tabs('provisionados').progressOn();
    layoutDocumentos = tabbar.tabs('provisionados').attachLayout('2U');
        layoutDocumentos.cells('a').hideHeader();
        layoutDocumentos.cells('b').hideHeader();
        layoutDocumentos.cells('b').setText('Información');
        layoutDocumentos.cells('b').setWidth(400);
        layoutDocumentos.cells('b').collapse();
    toolbarGridDocumentos = layoutDocumentos.cells('a').attachToolbar();
        toolbarGridDocumentos.addText('lblResumen', null, '<b>Datos del proveedor</b>');
        toolbarGridDocumentos.addText('lblMoneda', null, 'Moneda');
        toolbarGridDocumentos.addText('ipMoneda', null, '<div id="lbl-moneda" class="dv-label" style="width:80px;"></div>');
        toolbarGridDocumentos.addText('lblIngreso', null, 'Ingreso');
        toolbarGridDocumentos.addText('ipIngreso', null, '<div id="lbl-ingreso" class="dv-label text-right" style="width:120px;"></div>');
        toolbarGridDocumentos.addText('lblEgreso', null, 'Egreso');
        toolbarGridDocumentos.addText('ipEgreso', null, '<div id="lbl-egreso" class="dv-label text-right" style="width:120px;"></div>');
        toolbarGridDocumentos.addText('lblSaldo', null, 'Saldo');
        toolbarGridDocumentos.addText('ipSaldo', null, '<div id="lbl-saldo" class="dv-label text-right" style="width:120px;"></div>');
    gridDocumentos = layoutDocumentos.cells('a').attachGrid();
        gridDocumentos.setImagePath("/assets/images/icons/grid/");
        gridDocumentos.setHeader('Fe.Emisión,Documento,Negociable,Concepto,Saldo,Ingreso,Egreso,Vencimiento,TipoDoc.Admi.,Nombre,Detracción,Vigencia,Periodo,Libro,Voucher,Nu.Único,Fe.Vence,TipoEnti.,Clasif.Enti.');
        gridDocumentos.setInitWidths('80,100,30,320,120,120,120,80,50,240,30,60,80,60,100,80,80,40,40');
        gridDocumentos.setColTypes('rotxt,rotxt,img,rotxt,ron,ron,ron,rotxt,rotxt,rotxt,img,rotxt,ron,ron,ron,ron,rotxt,rotxt,rotxt');
        gridDocumentos.setColAlign('left,left,center,left,right,right,right,left,left,left,center,left,right,left,left,left,left,left,left');
        gridDocumentos.setColumnIds('femision,documento,esnegociable,concepto,saldo,ingreso,egreso,vencimiento,tpdocadmin,nombre,detraccion,vigencia,periodo,libro,voucher,nunico,fvence,tpentidad,coclasif');
        gridDocumentos.setNumberFormat('0,000.00', 4);
        gridDocumentos.setNumberFormat('0,000.00', 5);
        gridDocumentos.setNumberFormat('0,000.00', 6);
        gridDocumentos.init();
        gridDocumentos.attachEvent('onRowSelect', gridDocumentosOnRowSelect);
}

function CargarDocumentosProveedor() {
    let moneda = comboMonedas.getSelectedValue();
    let tpentidad = comboTpentis.getSelectedValue();
    gridDocumentos.load('/api/LO010301/grid-docs-provisionados/' + usrJson.empresa + '/' + entidad.codigo + '/' + moneda + '/' + tpentidad, function () {
        gridDocumentos.insertColumn(0, 'Detalle', 'img', 30, 'text', 'center', 'center', null);
        gridDocumentos.insertColumn(1, 'Adjuntos', 'img', 30, 'text', 'center', 'center', null);
        gridDocumentos.insertColumn(2, 'Expandir/contraer', 'img', 30, 'text', 'center', 'center', null);
        let numFilas = gridDocumentos.getRowsNum();
        for (let i = 0; i < numFilas; i++) {
            let iRowId = gridDocumentos.getRowId(i);
            gridDocumentos.cells(iRowId, 0).setValue('/assets/images/icons/grid/ic-detalle.svg^Detalles');
            gridDocumentos.cells(iRowId, 1).setValue('/assets/images/icons/grid/ic-adjunto.svg^Adjuntos');
            gridDocumentos.cells(iRowId, 2).setValue('/assets/images/icons/grid/ic-expand.svg^Expandir/contraer');
            gridDocumentos.cells(iRowId, 5).setValue(gridDocumentos.cells(iRowId, 5).getTitle() == 'S' ? '/assets/images/icons/grid/ic-checked.gif^Si' : '/assets/images/icons/grid/ic-unchecked.gif^No');
            gridDocumentos.cells(iRowId, 13).setValue(gridDocumentos.cells(iRowId, 13).getTitle() == 'S' ? '/assets/images/icons/grid/ic-checked.gif^Si' : '/assets/images/icons/grid/ic-unchecked.gif^No');
            gridDocumentos.setCellTextStyle(iRowId, 0, 'cursor:pointer;');
            gridDocumentos.setCellTextStyle(iRowId, 1, 'cursor:pointer;');
            gridDocumentos.setCellTextStyle(iRowId, 2, 'cursor:pointer;');
            gridDocumentos.setCellTextStyle(iRowId, 5, 'cursor:pointer;');
            gridDocumentos.setCellTextStyle(iRowId, 13, 'cursor:pointer;');
        }
        /*gridDocumentos.setColumnExcellType(5, 'img');
        gridDocumentos.setColumnExcellType(13, 'img');*/
        //5,13
        //let ch = gridDocumentos.cells2(1,2).getTitle();
        tabbar.tabs('provisionados').progressOff();
    });
}

async function toolbarDocumentosOnClick (id) {
    switch (id) {
        case 'btnEntidad':
            // let tpentidad = comboTpentis.getSelectedValue();
            let tpentidad = 21;
            console.log(tpentidad);
            entidad = await IniciarGridBusqueda(21, false, layout);
            if (entidad.seleccion) {
                entidad = entidad.seleccion[0];
                document.getElementById('lbl-codigo').innerHTML = entidad.codigo;
                document.getElementById('lbl-rzsocial').innerHTML = entidad.rsocial;
                toolbarDocumentos.enableItem('btnBusca');
            }
            break;
        case 'btnBusca':
            PreparaInterfazProveedor();
            CargarInfoProveedor();
            CargarDocumentosProveedor();
            break;
        default: break;
    }
}

function EstructuraProvisionados () {
    toolbarDocumentos = tabbar.tabs('provisionados').attachToolbar();
        toolbarDocumentos.setIconsPath('/assets/images/icons/toolbar/');
        toolbarDocumentos.addText('lblMoneda', null, 'Moneda');
        toolbarDocumentos.addText('cmbMoneda', null, '<div id="cmb-moneda" class="dv-combo" style="width:100px;"></div>');
        toolbarDocumentos.addText('cmbTpenti', null, '<div id="cmb-tpenti" class="dv-combo" style="width:160px;"></div>');
        toolbarDocumentos.addText('lblRucdni', null, 'RUC/DNI');
        toolbarDocumentos.addText('lblCodigo', null, '<div id="lbl-codigo" class="dv-label text-right" style="width:120px;"></div>');
        toolbarDocumentos.addButton('btnEntidad', null, null, 'ic-search.svg');
        toolbarDocumentos.addText('lblRzsocial', null, '<div id="lbl-rzsocial" class="dv-label" style="width:480px;"></div>');
        toolbarDocumentos.addButton('btnBusca', null, 'Buscar', 'ic-goggles.svg', 'ic-goggles-dis.svg');
    toolbarDocumentos.attachEvent('onClick', toolbarDocumentosOnClick);
    toolbarDocumentos.disableItem('btnBusca');
        comboMonedas = new dhtmlXCombo('cmb-moneda');
        comboTpentis = new dhtmlXCombo('cmb-tpenti');
}

// iniciar vista

function ConfiguraLayout () {
    layout = new dhtmlXLayoutObject(document.body, '1C');
}

function ConfiguraTabbar () {
    tabbar = layout.cells('a').attachTabbar();
        tabbar.addTab('provisionados', 'Documentos provisionados', null, null, true);
        tabbar.addTab('fpagar', 'Facturas por pagar');
        tabbar.addTab('documentos', 'Docs. aprobados por pagar');
        tabbar.addTab('letras', 'Letras por pagar');
        tabbar.addTab('digidocs', 'Documentos digitales');
        tabbar.addTab('transferencia', 'Pagos por transferencias');
        tabbar.addTab('reportes', 'Reportes por tipo doc.');
    EstructuraProvisionados();
    EstructuraFactpagar();
    EstructuraDocsAprobsPagar();
    EstructuraLetras();
    // documentos digitales
    EstructuraTransferencias();
    EstructuraReportesTpdoc();
}

function onDatosIniciales (response) {
    let data = response.data;
    comboMonedas.load({ options: data.monedas });
    comboTpentis.load({ options: data.tpentidades });
    comboFmonedas.load({ options: data.monedas });
    comboFcolumna.load({ options: data.columnas });
    comboLmonedas.load({ options: data.monedas });
    comboLcolumna.load({ options: data.columnas });
    comboTrfmonedas.load({ options: data.monedas });
    comboTrfcolumna.load({ options: data.columnas });
    comboMonedas.selectOption(0);
    comboTpentis.selectOption(0);
    comboFmonedas.selectOption(0);
    comboFcolumna.selectOption(0);
    comboLmonedas.selectOption(0);
    comboLcolumna.selectOption(0);
    comboTrfmonedas.selectOption(0);
    comboTrfcolumna.selectOption(0);
    toolbarDocsAprob.setValue('ipFecha', data.fecha);
    toolbarDocsAprob.setValue('ipTcambio', data.tcambio);
    toolbarDocsAprob.getInput('ipTcambio').style.textAlign = 'right';
}

function IniciarComponentes () {
    viewport = new dhtmlXWindows();
    viewport.attachViewportTo(document.body);
    ConfiguraLayout();
    ConfiguraTabbar();
    $.post('/api/LO010301/ls-datos-iniciales', {}, onDatosIniciales, 'json');
}