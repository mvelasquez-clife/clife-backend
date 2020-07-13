var comboVoucherItems = 0;

function onLibrosComplete (response) {
    if (response.error) {
        alert(response.error);
        return;
    }
    var data = response;
    comboLibroVoucher.load(data);
}

function comboPeriodosVoucherOnChange (value, text) {
    comboLibroVoucher.clearAll();
    if (value == 0) {
        comboLibroVoucher.load({ options: [{ value: 0, text: '- Seleccione libro -' }] });
    }
    else {
        var params = {
            periodo: value,
            alias: usrJson.alias
        };
        $.post('/api/CO010401B/combo-libros', params, onLibrosComplete, 'json');
    }
}

function onVouchersComplete (response) {
    if (response.error) {
        alert(response.error);
        return;
    }
    var vouchers = response.vouchers;
    comboVoucherItems = vouchers.options.length;
    toolbarVoucher.setItemText('lblCount', comboVoucherItems);
    comboVoucher.load(vouchers);
    comboVoucher.selectOption(0);
}

function comboLibroVoucherOnChange(value, text) {
    comboVoucher.clearAll();
    var params = {
        empresa: usrJson.empresa,
        periodo: comboPeriodosVoucher.getSelectedValue(),
        libro: value
    };
    $.post('/api/CO010401B/info-lista-vouchers', params, onVouchersComplete, 'json');
    configuraGridVouchers();
}

function configuraGridVouchers() {
    if (gridVoucher == null) {
        gridVoucher = layoutVoucher.cells('b').attachGrid();
        gridVoucher.setImagePath("/assets/images/icons/grid/");
        gridVoucher.setIconsPath("/assets/images/icons/grid/");
        gridVoucher.setHeader('CtaDestino,Cuenta,Descripción,Debe,Haber,CtaCte,,Documento,TipoDoc.,Cta.Padre,Moneda,TipoCambio,Manual,RUC/DNI,Razón social,Tipo entidad,F.Registro,ID voucher,Glosa secundaria,Cond.Tributaria');
        gridVoucher.setInitWidths('60,80,200,100,100,60,100,80,160,80,100,100,60,90,320,80,80,80,200,120');
        gridVoucher.setColTypes('img,rotxt,rotxt,ron,ron,img,rotxt,rotxt,rotxt,rotxt,rotxt,ron,img,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt');
        gridVoucher.setColAlign('center,left,left,right,right,center,left,left,left,left,left,right,center,left,left,left,left,left,left,left');
        gridVoucher.setColumnIds('stdestino,cocuenta,decuenta,debe,haber,stctacte,blanco,documento,detipodoc,ctapadre,moneda,tpcambio,stmanual,rucdni,rzsocial,tipoenti,fregistro,voucher,glosa,condicion');
        gridVoucher.setNumberFormat('0,000.00', 3);
        gridVoucher.setNumberFormat('0,000.00', 4);
        gridVoucher.setNumberFormat('0,000.00', 11);
        gridVoucher.init();
    }
    else {
        gridVoucher.clearAll();
    }
}

function cargaDatosGridVouchers(periodo, libro, voucher) {
    layoutVoucher.cells('b').progressOn();
    gridVoucher.clearAll();
    gridVoucher.load('/api/CO010401B/grid-vouchers/' + [usrJson.empresa, periodo, libro, voucher].join('/'), function() {
        layoutVoucher.cells('b').progressOff();
    });
}

function comboVoucherOnChange (value, text) {
    var posicionActual = comboVoucher.getIndexByValue(value);
    habilitarControlesVoucher(posicionActual, comboVoucherItems);
    // oliboli
    cargarDatosVoucher(value);
}

function onDatosVoucherComplete(response) {
    var informacion = response.informacion;
    preparaFormularioVouchers(informacion);
    // habilitarControlesVoucher(0, comboVoucherItems);
    layoutVoucher.cells('a').progressOff();
}

function cargarDatosVoucher(voucher) {
    var params = {
        empresa: usrJson.empresa,
        periodo: comboPeriodosVoucher.getSelectedValue(),
        libro: comboLibroVoucher.getSelectedValue(),
        voucher: voucher
    };
    layoutVoucher.cells('a').progressOn();
    $.post('/api/CO010401B/info-voucher', params, onDatosVoucherComplete, 'json');
    cargaDatosGridVouchers(params.periodo, params.libro, voucher);
}

function preparaFormularioVouchers(informacion) {
console.log(informacion);
    $('#dv-form-voucher').empty().append(
        $('<table>').append(
            $('<tbody>').append(
                $('<tr>').append(
                    $('<td>').append(
                        '<label for="form-prin-voucher">Prin. Voucher</label><input class="input-text form-mr" id="form-prin-voucher" type="text" style="width:80px;">'
                    ).append(
                        '<label for="form-femision">Fe. Emisión</label><input class="input-text" type="text" id="form-femision" style="width:90px;"><span class="sp-calendar"><img id="ic-femision" src="/assets/images/icons/toolbar/ic-calendar.svg" height="16"></span>'
                    ).css('width', '44%')
                ).append(
                    $('<td>').append(
                        '<label for="form-vigencia">Estado</label><input class="input-text form-mr" id="form-vigencia" type="text" style="width:80px;">'
                    ).append(
                        '<label for="form-modificado">Modificado</label><input id="form-modificado" type="checkbox" class="form-mr">'
                    ).append(
                        '<label for="form-ccosto">¿Centro costo?</label><input id="form-ccosto" type="checkbox" class="form-mr">'
                    ).addClass('no-controls').css('width', '44%')
                ).append(
                    $('<td>').append(
                        '<label for="form-nom-usureg">Usu. registra</label>'
                    ).addClass('no-controls').css('width', '12%')
                )
            ).append(
                $('<tr>').append(
                    $('<td>').append(
                        '<label for="form-nrovoucher">Nro. Voucher</label><input class="input-text form-mr" id="form-nrovoucher" type="text style="width:80px;">'
                    ).append(
                        '<label for="form-moneda">Moneda</label><div id="dv-moneda" class="form-dhxcombo form-mr" style="width:100px;"></div><input class="input-text" id="form-tcambio" type="text" style="width:80px;">'
                    )
                ).append(
                    $('<td>').append(
                        '<label for="form-tpenti">Tipo entidad</label><div id="dv-tpenti" class="form-dhxcombo form-mr" style="width:120px;"></div>'
                    ).append(
                        '<div id="dv-tpdociden" class="form-dhxcombo form-mr" style="width:80px;"></div><input class="input-text" id="form-rucdni" type="text" style="width:100px;">'
                    )
                ).append(
                    $('<td>').append(
                        '<input class="input-text" id="form-nom-usureg" type="text" style="width:95%;">'
                    )
                )
            ).append(
                $('<tr>').append(
                    $('<td>').append(
                        '<label for="dv-tpdocumento">Tipo doc.</label><div id="dv-tpdocumento" class="form-dhxcombo form-mr" style="width:160px;"></div>'
                    ).append(
                        '<label for="form-codigodoc">Documento</label><input class="input-text" id="form-codigodoc" type="text" style="width:100px;">'
                    )
                ).append(
                    $('<td>').append(
                        '<label for="form-rsocial">Razón social</label><input class="input-text" id="form-rsocial" type="text" style="width:320px;">'
                    ).addClass('no-controls')
                ).append(
                    $('<td>').append(
                        '<input class="input-text" id="form-fregistro" type="text" style="width:80px;"><span class="sp-calendar"><img id="ic-fregistro" src="/assets/images/icons/toolbar/ic-calendar.svg" height="16"></span>'
                    )
                )
            ).append(
                $('<tr>').append(
                    $('<td>').append(
                        '<label for="form-seriedoc">Serie</label><input class="input-text form-mr" id="form-seriedoc" type="text" style="width:50px;">'
                    ).append(
                        '<label for="form-nrodoc">Número</label><input class="input-text" id="form-nrodoc" type="text" style="width:80px;">'
                    ).addClass('no-controls')
                ).append(
                    $('<td>').append(
                        '<label for="form-glosa">Glosa</label><input class="input-text" id="form-glosa" type="text" style="width:320px;">'
                    ).addClass('no-controls')
                ).append(
                    $('<td>').append(
                        '<label for="form-feupd">Usu. actualiza</label>'
                    ).addClass('no-controls')
                )
            ).append(
                $('<tr>').append(
                    $('<td>').append(
                        '<label for="form-imtotal">Importe total</label><input class="input-text form-mr" id="form-imtotal" type="text" style="width:100px;">'
                    ).append(
                        '<label for="form-iminafecto">Importe inafecto</label><input class="input-text" id="form-iminafecto" type="text" style="width:100px;">'
                    ).addClass('no-controls')
                ).append(
                    $('<td>').append(
                        '<label for="form-stbanco">¿Banco?</label><input id="form-stbanco" type="checkbox" class="form-mr">'
                    ).append(
                        '<label for="form-transaccion">ID transacción</label><input class="input-text" id="form-transaccion" type="text" style="width:120px;">'
                    ).addClass('no-controls')
                ).append(
                    $('<td>').append(
                        '<input class="input-text" id="form-usupd" type="text" style="width:80px;">'
                    ).addClass('no-controls')
                )
            ).append(
                $('<tr>').append(
                    $('<td>').append(
                        '<label for="form-stctacte">¿Cta. corriente?</label><input class="form-mr" id="form-stctacte" type="checkbox">'
                    ).append(
                        '<label for="form-fvencimiento">Fe. vence</label><input class="input-text" id="form-fvencimiento" type="text" style="width:80px;"><span class="sp-calendar"><img id="ic-fvencimiento" src="/assets/images/icons/toolbar/ic-calendar.svg" height="16"></span>'
                    )
                ).append(
                    $('<td>').append(
                        '<label for="form-banco">Banco</label><input class="input-text" id="form-banco" type="text" style="width:320px;">'
                    ).addClass('no-controls')
                ).append(
                    $('<td>').append(
                        '<input class="input-text" id="form-feupd" type="text" style="width:95%;">'
                    ).addClass('no-controls')
                )
            ).append(
                $('<tr>').append(
                    $('<td>').append(
                        '<label for="form-ctadocumento">Cta. documento</label><input class="input-text" id="form-ctadocumento" type="text" style="width:200px;">'
                    ).addClass('no-controls')
                ).append(
                    $('<td>').append(
                        '<label for="form-nroctacte">N° cuenta corriente</label><input class="input-text" id="form-nroctacte" type="text" style="width:320px;">'
                    ).addClass('no-controls')
                ).append(
                    $('<td>').attr('rowspan', 4)
                )
            ).append(
                $('<tr>').append(
                    $('<td>').append(
                        '<label for="form-obs-ctadocumento">Obs. cta. documento</label><input class="input-text" id="form-obs-ctadocumento" type="text" style="width:320px;">'
                    ).addClass('no-controls')
                ).append(
                    $('<td>').append(
                        '<label for="form-ctacte">Cuenta corriente</label><input class="input-text" id="form-ctacte" type="text" style="width:240px;">'
                    ).addClass('no-controls')
                )
            ).append(
                $('<tr>').append(
                    $('<td>').append(
                        '<label for="form-stgasto">Gasto</label><input id="form-stgasto" type="checkbox" class="form-mr">'
                    ).append(
                        '<input class="input-text" id="form-cta-documento" type="text" style="width:120px;">'
                    ).addClass('no-controls')
                ).append(
                    $('<td>').append(
                        '<label for="form-stdetraccion">Detracción</label><input id="form-stdetraccion" type="checkbox" class="form-mr">'
                    ).append(
                        '<label for="form-stpercepcion">Percepción</label><input id="form-stpercepcion" type="checkbox" class="form-mr">'
                    ).addClass('no-controls')
                )
            ).append(
                $('<tr>').append(
                    $('<td>').append(
                        '<label for="form-ingasto">Ingreso gasto</label><input class="input-text" id="form-ingasto" type="text" style="width:240px;">'
                    ).addClass('no-controls')
                ).append(
                    $('<td>').append(
                        '<label for="form-docdetraccion">Doc. detracción</label><input class="input-text form-mr" id="form-docdetraccion" type="text" style="width:120px;">'
                    ).append(
                        '<label for="form-docpercepcion">Doc. percepcción</label><input class="input-text" id="form-docpercepcion" type="text" style="width:120px;">'
                    ).addClass('no-controls')
                )
            ).append(
                $('<tr>').append(
                    $('<td>').append(
                        '<label for="form-ctagasto">Cta. gasto</label><input class="input-text form-mr" id="form-ctagasto" type="text" style="width:120px;">'
                    ).append(
                        '<label for="form-catalpres">ID catal. presupuesto</label><input class="input-text" id="form-catalpres" type="text" style="width:120px;">'
                    ).addClass('no-controls')
                ).append(
                    $('<td>').append(
                        '<label for="form-fdetraccion">F. detracción</label><input class="input-text" id="form-fdetraccion" type="text" style="width:80px;"><span class="sp-calendar form-mr"><img id="ic-fdetraccion" src="/assets/images/icons/toolbar/ic-calendar.svg" height="16"></span>'
                    ).append(
                        '<label for="form-porc-percepcion">% percepcción</label><input class="input-text" id="form-porc-percepcion" type="text" style="width:80px;">'
                    )
                ).append(
                    $('<td>').append(
                        '<label for="form-importe-diferencia">Diferencia</label>'
                    ).addClass('no-controls')
                )
            ).append(
                $('<tr>').append(
                    $('<td>').append(
                        '<label for="form-categ-ig">ID categ. ing. gasto</label><input class="input-text form-mr" id="form-categ-ig" type="text" style="width:120px;">'
                    ).append(
                        '<label for="form-id-ingasto">ID ing. gasto</label><input class="input-text" id="form-id-ingasto" type="text" style="width:120px;">'
                    ).addClass('no-controls')
                ).append(
                    $('<td>').append(
                        '<label for="form-importe-detra">Monto detracción</label><input class="input-text form-mr" id="form-importe-detra" type="text" style="width:120px;">'
                    ).append(
                        '<label for="form-importe-percep">Percibido percepción</label><input class="input-text" id="form-importe-percep" type="text" style="width:120px;">'
                    ).addClass('no-controls')
                ).append(
                    $('<td>').append(
                        '<input class="input-text" id="form-importe-diferencia" type="text" style="width:120px;">'
                    ).addClass('no-controls')
                )
            )
        )
    );
    // crear los controles alv
    calFemision = new dhtmlXCalendarObject({ input: 'form-femision', dateFormat: '%d/%m/%Y', button: 'ic-femision' });
    cmbMoneda = new dhtmlXCombo('dv-moneda', 'combo', 100);
    cmbTipoenti = new dhtmlXCombo('dv-tpenti', 'combo', 80);
    cmbTipodociden = new dhtmlXCombo('dv-tpdociden', 'combo', 120);
    cmbTipodoc = new dhtmlXCombo('dv-tpdocumento', 'combo', 160);
    calFregistro = new dhtmlXCalendarObject({ input: 'form-fregistro', dateFormat: '%d/%m/%Y %H:%i', button: 'ic-fregistro', enableTime: true });
    calFvence = new dhtmlXCalendarObject({ input: 'form-fvencimiento', dateFormat: '%d/%m/%Y', button: 'ic-fvencimiento', enableTime: true });
    calFdetraccion = new dhtmlXCalendarObject({ input: 'form-fdetraccion', dateFormat: '%d/%m/%Y', button: 'ic-fdetraccion', enableTime: true });
    // llena los campos
    if (informacion != null) {
        document.getElementById('form-prin-voucher').value = informacion.CO_PRIN_VOUCHER;
        document.getElementById('form-prin-voucher').readOnly = false;
        document.getElementById('form-femision').value = informacion.FE_INGRESO;
        document.getElementById('form-femision').readOnly = false;
        document.getElementById('form-vigencia').value = informacion.ES_VIGENCIA;
        document.getElementById('form-modificado').checked = informacion.ST_MODIFICADO == 'S';
        document.getElementById('form-ccosto').checked = informacion.ST_CCOSTO_DIF == 'S';
        document.getElementById('form-nrovoucher').value = informacion.NU_VOUCHER;
        document.getElementById('form-tcambio').value = parseFloat(informacion.NU_CONVERSION_FINAL).toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        document.getElementById('form-rucdni').value = informacion.NU_DOCUMENTO_ENTIDAD;
        document.getElementById('form-nom-usureg').value = informacion.DE_USUARIO_REG;
        document.getElementById('form-codigodoc').value = informacion.CO_DOCUMENTO;
        document.getElementById('form-rsocial').value = informacion.DE_CATALOGO_ENTIDAD;
        document.getElementById('form-fregistro').value = informacion.FE_USUARIO_REG;
        document.getElementById('form-seriedoc').value = informacion.DE_SERIE;
        document.getElementById('form-nrodoc').value = informacion.NU_DOCUMENTO;
        document.getElementById('form-glosa').value = informacion.DE_GLOSA;
        document.getElementById('form-imtotal').value = informacion.IM_IMPORTE_TOTAL.toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        document.getElementById('form-iminafecto').value = informacion.IM_INAFECTO.toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        document.getElementById('form-stbanco').checked = informacion.ST_BANCO == 'S';
        document.getElementById('form-transaccion').value = informacion.CO_TRANSA_BANCARIA_TRAN;
        document.getElementById('form-usupd').value = informacion.DE_USUARIO_UPD;
        document.getElementById('form-stctacte').checked = informacion.ST_FORMATO == 'S';
        document.getElementById('form-fvencimiento').value = informacion.FE_VENCIMIENTO;
        document.getElementById('form-banco').value = informacion.DE_BANCO;
        document.getElementById('form-feupd').value = informacion.FE_USUARIO_UPD;
        document.getElementById('form-ctadocumento').value = informacion.DE_CUENTA_DOCUMENTO;
        document.getElementById('form-nroctacte').value = informacion.CO_CUENTA_CORRIENTE;
        document.getElementById('form-obs-ctadocumento').value = informacion.DE_CUENTA_DOCUMENTO_OBS;
        document.getElementById('form-ctacte').value = informacion.DE_CUENTA_CORRIENTE;
        document.getElementById('form-stgasto').checked = informacion.ST_GASTO == 'S';
        document.getElementById('form-cta-documento').value = informacion.CO_CUENTA_DOCUMENTO;
        document.getElementById('form-stdetraccion').checked = informacion.ST_DETRACCION == 'S';
        document.getElementById('form-stpercepcion').checked = informacion.ST_PERCEPCION == 'S';
        document.getElementById('form-ingasto').value = informacion.DE_INGRESO_GASTO_DET;
        document.getElementById('form-docdetraccion').value = informacion.CO_DOCUMENTO_DETRACCION;
        document.getElementById('form-docpercepcion').value = informacion.CO_DOCUMENTO_PERCEPCION;
        document.getElementById('form-ctagasto').value = informacion.CO_CUENTA_GASTO;
        document.getElementById('form-catalpres').value = informacion.CO_CATAL_PRESPUESTO;
        document.getElementById('form-fdetraccion').value = informacion.FE_DOCUMENTO_DETRACCION;
        document.getElementById('form-porc-percepcion').value = informacion.NU_PORCENTAJE_PERCEPCION;
        document.getElementById('form-categ-ig').value = informacion.CO_CATEG_INGRESO_GASTO;
        document.getElementById('form-id-ingasto').value = informacion.CO_INGRESO_GASTO;
        document.getElementById('form-importe-detra').value = informacion.IM_MONTO_DETRACCION ? informacion.IM_MONTO_DETRACCION.toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';
        document.getElementById('form-importe-percep').value = informacion.IM_PERCIBIDO_PERCEPCION ? informacion.IM_PERCIBIDO_PERCEPCION.toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';
        document.getElementById('form-importe-diferencia').value = informacion.IM_DIFERENCIA ? informacion.IM_DIFERENCIA.toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';
    }
}

function habilitarControlesVoucher (posicion, tamano) {
    if (posicion == 0) {
        toolbarVoucher.disableItem('btnSiguiente');
        toolbarVoucher.disableItem('btnFin');
    }
    else {
        toolbarVoucher.enableItem('btnSiguiente');
        toolbarVoucher.enableItem('btnFin');
    }
    if (posicion < tamano - 1) {
        toolbarVoucher.enableItem('btnInicio');
        toolbarVoucher.enableItem('btnAnterior');
    }
    else {
        toolbarVoucher.disableItem('btnInicio');
        toolbarVoucher.disableItem('btnAnterior');
    }
}

function toolbarVoucherOnClick(id) {
    var posicionActual = comboVoucher.getSelectedIndex();
    switch (id) {
        case 'btnInicio':
            comboVoucher.selectOption(comboVoucherItems - 1);
            break;
        case 'btnAnterior':
            comboVoucher.selectOption(posicionActual + 1);
            break;
        case 'btnSiguiente':
            comboVoucher.selectOption(posicionActual - 1);
            break;
        case 'btnFin':
            comboVoucher.selectOption(0);
            break;
    }
}

function ConfiguraTabbarVoucher () {
    toolbarVoucher = tabbar.tabs('voucher').attachToolbar();
        toolbarVoucher.setIconsPath('/assets/images/icons/toolbar/');
        toolbarVoucher.addText('cmbPeriodo', null, '<div id="cmb-moneda-voucher" class="dv-combo" style="width:120px;"></div>');
        toolbarVoucher.addText('cmbLibro', null, '<div id="cmb-libro-voucher" class="dv-combo" style="width:240px;"></div>');
        toolbarVoucher.addSeparator();
        toolbarVoucher.addText('lblVoucher', null, '&nbsp;&nbsp;&nbsp;Voucher');
        toolbarVoucher.addButton('btnInicio', null, null, 'ic-start.svg', 'ic-start-dis.svg');
        toolbarVoucher.addButton('btnAnterior', null, null, 'ic-prev.svg', 'ic-prev-dis.svg');
        toolbarVoucher.addText('cmbVoucher', null, '<div id="cmb-voucher" class="dv-combo text-right" style="width:60px;"></div>');
        toolbarVoucher.addText('lblBarra', null, '/');
        toolbarVoucher.addText('lblCount', null, '0');
        toolbarVoucher.addButton('btnSiguiente', null, null, 'ic-next.svg', 'ic-next-dis.svg');
        toolbarVoucher.addButton('btnFin', null, null, 'ic-end.svg', 'ic-end-dis.svg');
        toolbarVoucher.disableItem('btnInicio');
        toolbarVoucher.disableItem('btnAnterior');
        toolbarVoucher.disableItem('btnSiguiente');
        toolbarVoucher.disableItem('btnFin');
        toolbarVoucher.attachEvent('onClick', toolbarVoucherOnClick);
    comboPeriodosVoucher = new dhtmlXCombo('cmb-moneda-voucher');
        comboPeriodosVoucher.load('/api/CO010401B/combo-periodos/' + usrJson.empresa, function () {
            comboPeriodosVoucher.selectOption(0);
            comboLibroVoucher.selectOption(0);
        });
        comboPeriodosVoucher.attachEvent('onChange', comboPeriodosVoucherOnChange);
    comboLibroVoucher = new dhtmlXCombo('cmb-libro-voucher');
        comboLibroVoucher.load({ options: [{ value: 0, text: '- Seleccione libro -' }] });
        comboLibroVoucher.attachEvent('onChange', comboLibroVoucherOnChange);
    comboVoucher = new dhtmlXCombo('cmb-voucher');
        comboVoucher.load({ options: [{ value: 0, text: '0' }] });
        comboVoucher.selectOption(0);
        comboVoucher.enableFilteringMode(true);
        comboVoucher.attachEvent('onChange', comboVoucherOnChange);
    layoutVoucher = tabbar.tabs('voucher').attachLayout('2E');
        layoutVoucher.cells('a').hideHeader();
        layoutVoucher.cells('b').hideHeader();
    // formVoucher = layoutVoucher.cells('a').attachForm();
    layoutVoucher.cells('a').attachHTMLString('<div id="dv-form-voucher"></div>');
}