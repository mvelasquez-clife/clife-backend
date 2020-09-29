var comboVoucherItems = 0;
var cantNuevas = 0;
var filasEliminar = [];
var validaciones = null;

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

function habilitaControlesFormulario() {
    if (validaciones != null) {
        // banco
        if (validaciones.ST_BANCO == 'S') {
            $('#form-stbanco').show().prev().show();
            $('#form-transaccion').show().prev().show();
            $('#form-banco').show().prev().show();
            $('#form-nroctacte').show().prev().show();
            $('#form-ctacte').show().prev().show();
            // $('#btn-banco').show();
            // $('#btn-elimina-banco').show();
        }
        else {
            $('#form-stbanco').hide().prev().hide();
            $('#form-transaccion').hide().prev().hide();
            $('#form-banco').hide().prev().hide();
            $('#form-nroctacte').hide().prev().hide();
            $('#form-ctacte').hide().prev().hide();
            $('#btn-banco').remove();
            $('#btn-elimina-banco').remove();
        }
        // banco
        if (validaciones.ST_GASTO == 'S') {
            $('#form-stgasto').show().prev().show();
            $('#form-stctacte').show().prev().show();
            $('#ic-fvencimiento').parent().show().prev().show().prev().show();
            $('#form-ingasto').show().prev().show();
            $('#form-ctagasto').show().prev().show();
            $('#form-catalpres').show().prev().show();
            $('#form-categ-ig').show().prev().show();
            $('#form-id-ingasto').show().prev().show();
            $('#form-ingasto').parent().show();
        }
        else {
            $('#form-stgasto').hide().prev().hide();
            $('#form-stctacte').hide().prev().hide();
            $('#ic-fvencimiento').parent().hide().prev().hide().prev().hide();
            $('#form-ingasto').hide().prev().hide();
            $('#form-ctagasto').hide().prev().hide();
            $('#form-catalpres').hide().prev().hide();
            $('#form-categ-ig').hide().prev().hide();
            $('#form-id-ingasto').hide().prev().hide();
            $('#form-ingasto').parent().hide();
        }
        // banco
        if (validaciones.ST_CTA_CTE == 'S') {
            $('#form-stctacte').show().prev().show();
            $('#ic-fvencimiento').parent().show().prev().show().prev().show();
            $('#form-ctadocumento').show().prev().show();
            $('#form-obs-ctadocumento').show().prev().show();
            $('#form-cta-documento').show();
            $('#form-ctadocumento').parent().show();
        }
        else {
            $('#form-stctacte').hide().prev().hide();
            $('#ic-fvencimiento').parent().hide().prev().hide().prev().hide();
            $('#form-ctadocumento').hide().prev().hide();
            $('#form-obs-ctadocumento').hide().prev().hide();
            $('#form-cta-documento').hide();
            $('#form-ctadocumento').parent().hide();
        }
        // banco
        if (validaciones.ST_DETRACCION == 'S') {
            $('#form-stdetraccion').show().prev().show();
            $('#form-docdetraccion').show().prev().show();
            $('#ic-fdetraccion').parent().show().prev().show().prev().show();
            $('#form-importe-detra').show().prev().show();
        }
        else {
            $('#form-stdetraccion').hide().prev().hide();
            $('#form-docdetraccion').hide().prev().hide();
            $('#ic-fdetraccion').parent().hide().prev().hide().prev().hide();
            $('#form-importe-detra').hide().prev().hide();
        }
        // banco
        if (validaciones.ST_PERCEPCION == 'S') {
            $('#form-stpercepcion').show().prev().show();
            $('#form-docpercepcion').show().prev().show();
            $('#form-porc-percepcion').show().prev().show().prev().show();
            $('#form-importe-percep').show().prev().show();
        }
        else {
            $('#form-stpercepcion').hide().prev().hide();
            $('#form-docpercepcion').hide().prev().hide();
            $('#form-porc-percepcion').hide().prev().hide().prev().hide();
            $('#form-importe-percep').hide().prev().hide();
        }
    }
}

function onVouchersComplete (response) {
    validaciones = null;
    if (response.error) {
        alert(response.error);
        return;
    }
    var vouchers = response.vouchers;
    comboVoucherItems = vouchers.options.length;
    toolbarVoucher.setItemText('lblCount', comboVoucherItems);
    comboVoucher.load(vouchers);
    comboVoucher.selectOption(0);
    // verificaciones
    if (response.restricciones) {
        validaciones = response.restricciones;
    }
}

function comboLibroVoucherOnChange(value, text) {
    comboVoucher.clearAll();
    var params = {
        empresa: usrJson.empresa,
        periodo: comboPeriodosVoucher.getSelectedValue(),
        libro: value,
        usuario: usrJson.codigo
    };
    $.post('/api/CO010401B/info-lista-vouchers', params, onVouchersComplete, 'json');
    configuraGridVouchers();
}

async function gridVoucherOnRowSelect(rowId, colId) {
    if (rowId.startsWith('nrow_')) {
        switch (colId) {
            case 2:
                var result = await IniciarGridBusqueda(2001, false, layout, usrJson.alias);
                if (result.seleccion) {
                    var cuenta = result.seleccion[0];
                    // ch,codigo,descripcion,moneda,destino,estado,ctacte,ctapadre,tpcambio,hoy,comoneda
                    gridVoucher.cells(rowId, 0).setValue(cuenta.destino == 'S' ? 'ic-checked.gif^Sí' : 'ic-unchecked.gif^No');
                    gridVoucher.cells(rowId, 1).setValue(cuenta.codigo);
                    gridVoucher.cells(rowId, 3).setValue(cuenta.descripcion);
                    gridVoucher.cells(rowId, 6).setValue(cuenta.ctacte == 'S' ? 'ic-checked.gif^Sí' : 'ic-unchecked.gif^No');
                    gridVoucher.cells(rowId, 10).setValue(cuenta.ctapadre);
                    gridVoucher.cells(rowId, 11).setValue(cuenta.moneda);
                    gridVoucher.cells(rowId, 12).setValue(cuenta.tpcambio);
                    gridVoucher.cells(rowId, 17).setValue(cuenta.hoy);
                }
                console.log(result);
                break;
        }
    }
}

function gridVoucherOnEditCell(stage, rowId, colId, newVal, oldVal) {
    if (stage == 2) {
        switch (colId) {
            case 4:
            case 5:
                calcularDiferenciaVoucher();
                break;
        }
        if (!rowId.startsWith('nrow_') && newVal != oldVal) {
            gridVoucher.cells(rowId, 22).setValue(1);
            gridVoucher.setRowColor(rowId, '#fffde7');
        }
    }
    return true;
}

function configuraGridVouchers() {
    layoutVoucher.cells('b').detachObject();
    gridVoucher = layoutVoucher.cells('b').attachGrid();
        gridVoucher.setImagePath('/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/');
        gridVoucher.setIconsPath('/assets/images/icons/grid/');
        gridVoucher.setHeader('CtaDestino,Cuenta,Descripción,Debe,Haber,CtaCte,,Documento,TipoDoc.,Cta.Padre,Moneda,TipoCambio,Manual,RUC/DNI,Razón social,Tipo entidad,F.Registro,ID voucher,Glosa secundaria,Cond.Tributaria');
        gridVoucher.setInitWidths('60,80,200,100,100,60,100,80,160,80,100,100,60,90,320,80,80,80,200,120');
        gridVoucher.setColTypes('img,rotxt,rotxt,ron,ron,img,rotxt,rotxt,rotxt,rotxt,rotxt,ron,img,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt');
        gridVoucher.setColAlign('center,left,left,right,right,center,left,left,left,left,left,right,center,left,left,left,left,left,left,left');
        gridVoucher.setColumnIds('stdestino,cocuenta,decuenta,debe,haber,stctacte,blanco,documento,detipodoc,ctapadre,moneda,tpcambio,stmanual,rucdni,rzsocial,tipoenti,fregistro,voucher,glosa,condicion');
        gridVoucher.setNumberFormat('0,000.00', 3);
        gridVoucher.setNumberFormat('0,000.00', 4);
        gridVoucher.setNumberFormat('0,000.00', 11);
    gridVoucher.init();
    gridVoucher.attachEvent('onRowSelect', gridVoucherOnRowSelect);
    gridVoucher.attachEvent('onEditCell', gridVoucherOnEditCell);
}

function calcularDiferenciaVoucher() {
    var numFilas = gridVoucher.getRowsNum();
    var delta = 0;
    for (var i = 0; i < numFilas; i++) {
        var iRowId = gridVoucher.getRowId(i);
        var iRowData = gridVoucher.getRowData(iRowId);
        var iDebe = iRowData.debe == '' ? 0 : parseFloat(iRowData.debe);
        var iHaber = iRowData.haber == '' ? 0 : parseFloat(iRowData.haber);
        delta += (iDebe - iHaber);
    }
    if (Math.round(delta, 2) != 0) {
        $('#lbl-cuadrado').text('Voucher descuadrado').css('color', '#f44336');
        if (delta > 0) {
            $('#lbl-diferencia').text(delta.toLocaleString('en-us', {minimumFractionDigits:2,maximumFractionDigits:2}) + ' en el debe').css('color', '#f44336');
        }
        else {
            $('#lbl-diferencia').text(Math.abs(delta).toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' en el debe').css('color', '#f44336');
        }
    }
    else {
        $('#lbl-cuadrado').text('Voucher cuadrado').css('color', '#000000');
        $('#lbl-diferencia').text('').css('color', '#000000');
    }
}

function validarFilaEdicion(iRowData) {
    var ls_cuenta = iRowData.cocuenta;
    var ld_debe = iRowData.debe == '' ? 0 : parseFloat(iRowData.debe);
    var ld_haber = iRowData.haber == '' ? 0 : parseFloat(iRowData.haber);
    var ls_co_voucher = iRowData.voucher;
    var ls_glosa = iRowData.glosa == '' ? '(VACIO)' : iRowData.glosa;
    var ls_cond_trib = iRowData.condicion == '' ? 0 : iRowData.condicion;
    // validar plox
    if (ls_cuenta == '') {
        return {
            error: 'Debe ingresar la cuenta contable'
        };
    }
    if (ld_debe < 0) {
        return {
            error: 'Debe ingresar un importe valido en el DEBE'
        };
    }
    if (ld_haber < 0) {
        return {
            error: 'Debe ingresar un importe valido en el HABER'
        };
    }
    if (ld_debe == 0 && ld_haber == 0) {
        return {
            error: 'Debe ingresar el monto en el DEBE/HABER'
        };
    }
    return {
        cuenta: ls_cuenta,
        debe: ld_debe,
        haber: ld_haber,
        voucher: ls_co_voucher,
        glosa: ls_glosa,
        condicion: ls_cond_trib
    };
}

function onVoucherRegistrado(response) {
    if (response.codigo == 1) {
        dhtmlx.alert({
            title: 'No se puede procesar',
            text: response.mensaje
        });
        habilitaEdicionVoucher(false);
        var periodo = comboPeriodosVoucher.getSelectedValue();
        var libro = comboLibroVoucher.getSelectedValue();
        var voucher = comboVoucher.getSelectedValue();
        cargarDatosGridVoucher(periodo, libro, voucher);
    }
    else {
        dhtmlx.alert({
            title: 'No se puede procesar',
            type: 'alert-error',
            text: response.mensaje
        });
    }
    layoutVoucher.cells('b').progressOff();
}

function registraDetalleVoucher() {
    layoutVoucher.cells('b').progressOn();
    var li_cant_rows = 0;
    var li_eliminar_rows = 0;
    var ls_cad_accion = '';
    var ls_cad_cuenta = '';
    var ls_cad_debe = '';
    var ls_cad_haber = '';
    var ls_cad_glosa = '';
    var ls_cad_cond_trib = '';
    var ls_cad_co_voucher = '';
    var ls_cad_rem_vouchers = '';
    var insertedRowIds = gridVoucher.getCheckedRows(21);
    insertedRowIds = insertedRowIds == '' ? [] : insertedRowIds.split(',');
    var numInserted = insertedRowIds.length;
    var updatedRowIds = gridVoucher.getCheckedRows(22);
    updatedRowIds = updatedRowIds == '' ? [] : updatedRowIds.split(',');
    var numUpdated = updatedRowIds.length;
    var numDeleted = filasEliminar.length;
    // prepara las filas nuevas
    for (var i = 0; i < numInserted; i++) {
        var iRowId = insertedRowIds[i];
        var iRowData = gridVoucher.getRowData(iRowId);
        var validacion = validarFilaEdicion(iRowData);
        if (validacion.error) {
            gridVoucher.selectRow(iRowId);
            dhtmlx.alert({
                title: 'No se puede procesar',
                type: 'alert-error',
                text: validacion.error
            });
            return;
        }
        ls_cad_accion += 'I@';
        ls_cad_cuenta += (validacion.cuenta + '@');
        ls_cad_debe += (validacion.debe + '@');
        ls_cad_haber += (validacion.haber + '@');
        ls_cad_co_voucher += (validacion.voucher + '@');
        ls_cad_glosa += (validacion.glosa + '@');
        // ls_cad_cond_trib += (validacion.condicion + '@');
        ls_cad_cond_trib += (gridVoucher.cells(iRowId,20).getCellCombo().getSelectedValue());
        li_cant_rows++;
    }
    // prepara las filas para actualizar
    for (var i = 0; i < numUpdated; i++) {
        var iRowId = updatedRowIds[i];
        var iRowData = gridVoucher.getRowData(iRowId);
        var validacion = validarFilaEdicion(iRowData);
        if (validacion.error) {
            gridVoucher.selectRow(iRowId);
            dhtmlx.alert({
                title: 'No se puede procesar',
                type: 'alert-error',
                text: validacion.error
            });
            return;
        }
        ls_cad_accion += 'U@';
        ls_cad_cuenta += (validacion.cuenta + '@');
        ls_cad_debe += (validacion.debe + '@');
        ls_cad_haber += (validacion.haber + '@');
        ls_cad_co_voucher += (validacion.voucher + '@');
        ls_cad_glosa += (validacion.glosa + '@');
        ls_cad_cond_trib += (validacion.condicion + '@');
        li_cant_rows++;
    }
    // prepara las filas para eliminar
    for (var i = 0; i < numDeleted; i++) {
        var iRowData = filasEliminar[i];
        ls_cad_rem_vouchers += ((ls_cad_rem_vouchers != '' ? '@' : '') + iRowData.voucher);
        li_eliminar_rows++;
    }
    // verifica si hay filas para grabar
    if (li_cant_rows + li_eliminar_rows > 0) {
        var params = {
            empresa: usrJson.empresa,
            usuario: usrJson.codigo,
            periodo: comboPeriodosVoucher.getSelectedValue(),
            libro: comboLibroVoucher.getSelectedValue(),
            voucher: comboVoucher.getSelectedValue(),
            filas: li_cant_rows,
            acciones: ls_cad_accion,
            cuentas: ls_cad_cuenta,
            vouchers: ls_cad_co_voucher,
            debe: ls_cad_debe,
            haber: ls_cad_haber,
            glosas: ls_cad_glosa,
            condtribs: ls_cad_cond_trib,
            alias: usrJson.alias,
            eliminar: ls_cad_rem_vouchers
        };
        $.post('/api/CO010401B/guarda-detalle-voucher', params, onVoucherRegistrado, 'json').fail(function(error) {
            dhtmlx.alert({
                title: 'Error',
                type: 'alert-error',
                text: 'Ocurrió un error inesperado'
            });
            layoutVoucher.cells('b').progressOff();
        });
    }
    else {
        dhtmlx.alert({
            title: 'Error',
            type: 'alert-error',
            text: 'No hay nada agregado o modificado para grabar'
        });
        layoutVoucher.cells('b').progressOff();
    }
}

function toolbarDetalleOnClick(button) {
    var iRowId = gridVoucher.getSelectedRowId();
    switch (button) {
        case 'insertar':
            var newId = 'nrow_' + cantNuevas;
            gridVoucher.addRow(newId, 'ic-unchecked.gif,,ic-search.svg,,0,,,,,,');
            // cambia los tipos de celda
            gridVoucher.setCellExcellType(newId, 1, 'edn'); //debe
            gridVoucher.setCellExcellType(newId, 4, 'edn'); //debe
            gridVoucher.setCellExcellType(newId, 5, 'edn'); //haber
            gridVoucher.setCellExcellType(newId, 6, 'img'); //cta.cte.
            gridVoucher.setCellExcellType(newId, 8, 'ed'); //documento
            gridVoucher.setCellExcellType(newId, 9, 'ed'); //tipodoc
            gridVoucher.setCellExcellType(newId, 14, 'edn');
            gridVoucher.setCellExcellType(newId, 15, 'ed');
            // gridVoucher.setCellExcellType(newId, 16, 'ed');
            gridVoucher.setCellExcellType(newId, 16, 'combo');
            gridVoucher.setCellExcellType(newId, 17, 'ed');
            gridVoucher.setCellExcellType(newId, 18, 'ed');
            gridVoucher.setCellExcellType(newId, 19, 'ed');
            // gridVoucher.setCellExcellType(newId, 20, 'ed');
            gridVoucher.setCellExcellType(newId, 20, 'combo');
            gridVoucher.cells(newId, 4).setValue(0);
            gridVoucher.cells(newId, 5).setValue(0);
            gridVoucher.cells(newId, 6).setValue('ic-unchecked.gif');
            gridVoucher.cells(newId, 13).setValue('ic-checked.gif');
            gridVoucher.cells(newId, 21).setValue(1);
            cantNuevas++;
            // rellenar combo tipo entidad
            var combo_tpenti = gridVoucher.cells(newId, 16).getCellCombo();
            combo_tpenti.addOption(0, '- Seleccione -');
            // rellenar combo condicion tributaria
            var combo_ctrib = gridVoucher.cells(newId, 20).getCellCombo();
            // carga datos para llenar los combos
            $.post('/api/CO010401B/combos-detalle-voucher', { libro: comboLibroVoucher.getSelectedValue() }, function(response) {
                if (response.error) {
                    alert(response.error);
                    return;
                }
                // llenar combo de tipos
                var tipos = response.data.tipos;
                var numTipos = tipos.length;
                for (var i = 0; i < numTipos; i++) {
                    let iTipo = tipos[i];
                    combo_tpenti.addOption(iTipo.value, iTipo.text);
                }
                // llenar combo de condiciones
                var condiciones = response.data.condiciones;
                var numCondiciones = condiciones.length;
                for (var i = 0; i < numCondiciones; i++) {
                    let iCondicion = condiciones[i];
                    combo_ctrib.addOption(iCondicion.value, iCondicion.text);
                }
            }, 'json');
            break;
        case 'eliminar':
            if (!iRowId.startsWith('nrow_')) {
                dhtmlx.confirm({
                    title: 'Atención',
                    type: 'confirm-error',
                    text: '¿Está seguro de eliminar el movimiento seleccionado?',
                    callback: function (result) {
                        if (result) {
                            if (!iRowId.startsWith('nrow_')) {
                                filasEliminar.push(gridVoucher.getRowData(iRowId));
                            }
                            gridVoucher.deleteRow(iRowId);
                            calcularDiferenciaVoucher();
                            // gridVoucher.setRowColor(iRowId, '#ef9a9a');
                            dhtmlx.alert({
                                title: 'Movimiento eliminado',
                                ok: 'Entendido',
                                text: 'El movimiento fue marcado para eliminación. Recuerde guardar los cambios'
                            });
                        }
                    }
                });
            }
            else {
                gridVoucher.deleteRow(iRowId);
            }
            break;
        case 'grabar':
            registraDetalleVoucher();
            break;
        case 'cancelar':
            layoutVoucher.cells('b').progressOn();
            var periodo = comboPeriodosVoucher.getSelectedValue();
            var libro = comboLibroVoucher.getSelectedValue();
            var voucher = comboVoucher.getSelectedValue();
            cargarDatosGridVoucher(periodo, libro, voucher);
            break;
    }
}

function cargarDatosGridVoucher(periodo, libro, voucher) {
    configuraGridVouchers();
    layoutVoucher.cells('b').progressOn();
    gridVoucher.clearAll();
    gridVoucher.load('/api/CO010401B/grid-vouchers/' + [usrJson.empresa, periodo, libro, voucher].join('/'), function () {
        gridVoucher.insertColumn(2, '', 'img', 30);
        gridVoucher.insertColumn(21, '', 'ch', 0);
        gridVoucher.insertColumn(22, '', 'ch', 0);
        gridVoucher.setColWidth(21, 0);
        gridVoucher.setColWidth(22, 0);
        gridVoucher.setColumnId(21, 'inserted');
        gridVoucher.setColumnId(22, 'updated');
        cantNuevas = 0;
        calcularDiferenciaVoucher();
        layoutVoucher.cells('b').progressOff();
        //
        var numFilas = gridVoucher.getRowsNum();
        for (var i = 0; i < numFilas; i++) {
            var iRowId = gridVoucher.getRowId(i);
            gridVoucher.cells(iRowId, 2).setValue('ic-blank.png');
            gridVoucher.cells(iRowId, 21).setValue(0);
            gridVoucher.cells(iRowId, 22).setValue(0);
        }
    });
}

function cargaDatosGridVouchers(periodo, libro, voucher) {
    layoutVoucher.cells('b').detachToolbar();
    toolbarDetalle = layoutVoucher.cells('b').attachToolbar();
        toolbarDetalle.setIconsPath('/assets/images/icons/toolbar/');
        toolbarDetalle.addText('lbCuadrado', null, '<label id="lbl-cuadrado" style="font-weight:bold;width:100px;">Voucher cuadrado</label>');
        toolbarDetalle.addSeparator();
        toolbarDetalle.addButton('insertar', null, 'Insertar', 'ic-add.svg', 'ic-add-dis.svg');
        toolbarDetalle.addButton('eliminar', null, 'Eliminar', 'ic-close.svg', 'ic-close-dis.svg');
        toolbarDetalle.addButton('grabar', null, 'Grabar', 'ic-save.svg', 'ic-save-dis.svg');
        toolbarDetalle.addButton('cancelar', null, 'Cancelar', 'ic-disabled.svg', 'ic-disabled-dis.svg');
        toolbarDetalle.addText('lbDiferencia', null, '<label id="lbl-diferencia" style="font-weight:bold;width:100px;"></label>');
        // deshabilitar los controles
        toolbarDetalle.disableItem('insertar');
        toolbarDetalle.disableItem('eliminar');
        toolbarDetalle.disableItem('grabar');
        toolbarDetalle.disableItem('cancelar');
        // evento
        toolbarDetalle.attachEvent('onClick', toolbarDetalleOnClick);
    cargarDatosGridVoucher(periodo, libro, voucher);
}

function comboVoucherOnChange (value, text) {
    var posicionActual = comboVoucher.getIndexByValue(value);
    habilitarControlesVoucher(posicionActual, comboVoucherItems);
    cargarDatosVoucher(value);
}

function habilitarControles(informacion) {
    // console.log(informacion);
    // if (informacion.ST_GASTO)
}

function habilitarControlesBase(estado) {
    // actualiza los controles secundarios
    habilitarControlesCtaCte(estado);
    habilitarControlesGasto(estado);
    habilitarControlesBanco(estado);
    habilitarControlesDetraccion(estado);
    habilitarControlesPercepcion(estado);
    estado = !estado;
    // combos
    if (estado) {
        cmbMoneda.disable();
        cmbTipodoc.disable();
        cmbTipoenti.disable();
        cmbTipodociden.disable();
        $('#btn-rsocial').hide();
        $('#btn-elimina-rsocial').hide();
        $('#btn-banco').hide();
        $('#btn-elimina-banco').hide();
        $('#btn-ctadoc').hide();
        $('#btn-elimina-ctadoc').hide();
        $('#btn-ingasto').hide();
        $('#btn-elimina-ingasto').hide();
    }
    else {
        cmbMoneda.enable();
        cmbTipodoc.enable();
        cmbTipoenti.enable();
        cmbTipodociden.enable();
        $('#btn-rsocial').show();
        $('#btn-elimina-rsocial').show();
        $('#btn-banco').show();
        $('#btn-elimina-banco').show();
        $('#btn-ctadoc').show();
        $('#btn-elimina-ctadoc').show();
        $('#btn-ingasto').show();
        $('#btn-elimina-ingasto').show();
    }
    // calendarios
    document.getElementById('form-femision').disabled = estado;
    document.getElementById('form-fregistro').disabled = estado;
    document.getElementById('form-fvencimiento').disabled = estado;
    document.getElementById('form-fdetraccion').disabled = estado;
    // checks
    document.getElementById('form-modificado').disabled = estado;
    document.getElementById('form-ccosto').disabled = estado;
    document.getElementById('form-stbanco').disabled = estado;
    document.getElementById('form-stctacte').disabled = estado;
    document.getElementById('form-stgasto').disabled = estado;
    document.getElementById('form-stdetraccion').disabled = estado;
    document.getElementById('form-stpercepcion').disabled = estado;
    document.getElementById('form-modificado').disabled = estado;
    // otros inputs
    document.getElementById('form-prin-voucher').disabled = estado;
    document.getElementById('form-nrovoucher').disabled = estado;
    document.getElementById('form-tcambio').disabled = estado;
    document.getElementById('form-codigodoc').disabled = estado;
    document.getElementById('form-seriedoc').disabled = estado;
    document.getElementById('form-nrodoc').disabled = estado;
    document.getElementById('form-imtotal').disabled = estado;
    document.getElementById('form-iminafecto').disabled = estado;
    //
    document.getElementById('form-vigencia').disabled = estado;
    document.getElementById('form-rucdni').disabled = estado;
    document.getElementById('form-rsocial').disabled = estado;
    document.getElementById('form-glosa').disabled = estado;
    document.getElementById('form-nom-usureg').disabled = estado;
    document.getElementById('form-usupd').disabled = estado;
    document.getElementById('form-feupd').disabled = estado;
    document.getElementById('form-importe-diferencia').disabled = estado;
}

function habilitarControlesCtaCte(estado) {
    if (estado) {
        $('#btn-ctadoc').show();
        $('#btn-elimina-ctadoc').show();
    }
    else {
        $('#btn-ctadoc').hide();
        $('#btn-elimina-ctadoc').hide();
    }
    estado = !estado;
    document.getElementById('form-ctadocumento').disabled = estado;
    document.getElementById('form-obs-ctadocumento').disabled = estado;
    document.getElementById('form-cta-documento').disabled = estado;
}

function habilitarControlesGasto(estado) {
    if (estado) {
        $('#btn-ingasto').show();
        $('#btn-elimina-ingasto').show();
    }
    else {
        $('#btn-ingasto').hide();
        $('#btn-elimina-ingasto').hide();
    }
    estado = !estado;
    document.getElementById('form-ingasto').disabled = estado;
    document.getElementById('form-ctagasto').disabled = estado;
    document.getElementById('form-catalpres').disabled = estado;
    document.getElementById('form-categ-ig').disabled = estado;
    document.getElementById('form-id-ingasto').disabled = estado;
}

function habilitarControlesBanco(estado) {
    if (estado) {
        $('#btn-banco').show();
        $('#btn-elimina-banco').show();
    }
    else {
        $('#btn-banco').hide();
        $('#btn-elimina-banco').hide();
    }
    estado = !estado;
    document.getElementById('form-transaccion').disabled = estado;
    document.getElementById('form-banco').disabled = estado;
    document.getElementById('form-nroctacte').disabled = estado;
    document.getElementById('form-ctacte').disabled = estado;
}

function habilitarControlesDetraccion(estado) {
    var estado = !estado;
    document.getElementById('form-docdetraccion').disabled = estado;
    document.getElementById('form-fdetraccion').disabled = estado;
    document.getElementById('form-importe-detra').disabled = estado;
}

function habilitarControlesPercepcion(estado) {
    var estado = !estado;
    document.getElementById('form-docpercepcion').disabled = estado;
    document.getElementById('form-porc-percepcion').disabled = estado;
    document.getElementById('form-importe-percep').disabled = estado;
}

function onDatosVoucherComplete(response) {
    var libro = comboLibroVoucher.getSelectedValue();
    var informacion = response.informacion;
    preparaFormularioVouchers(informacion);
    document.getElementById('form-modo').value = 'V';
    // carga combo de monedas
    cmbMoneda.load('/api/CO010401B/combo-monedas', function() {
        var index = cmbMoneda.getIndexByValue(informacion.CO_MONEDA);
        cmbMoneda.selectOption(index);
    });
    // carga combo tipos de documento
    cmbTipodoc.load('/api/CO010401B/combo-tipo-docadmin/' + libro, function () {
        var index = cmbTipodoc.getIndexByValue(informacion.CO_TIPO_DOC_ADMINISTR);
        cmbTipodoc.selectOption(index);
    });
    // carga combo tipo entidad
    cmbTipoenti.load('/api/CO010401B/combo-tipo-entidad/' + libro, function () {
        var index = cmbTipoenti.getIndexByValue(informacion.CO_TIPO_ENTIDAD);
        cmbTipoenti.selectOption(index);
    });
    // carga combo tipo de documento
    cmbTipodociden.load('/api/CO010401B/combo-tipo-dociden', function () {
        var index = cmbTipodociden.getIndexByValue(informacion.CO_TIPO_DOC_IDE);
        cmbTipodociden.selectOption(index);
    });
    // habilitar grupos de botones segUn datos del voucher
    habilitarControles(informacion);
    // habilitarControles
    habilitarControlesBase(false);
    layoutVoucher.cells('a').progressOff();
    toolbarVoucher.enableItem('nuevo');
    toolbarVoucher.enableItem('editar');
    toolbarVoucher.enableItem('anular');
    habilitaControlesFormulario();
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

async function buscaRazonSocial() {
    var tpentidad = cmbTipoenti.getSelectedValue();
    console.log('tpentidad:', tpentidad);
    var result = await IniciarGridBusqueda(2002, false, layout, tpentidad);
    if (result.seleccion && result.seleccion.length > 0) {
        var opcion = result.seleccion[0];
        document.getElementById('form-rucdni').value = opcion.codigo;
        document.getElementById('form-rsocial').value = opcion.rsocial;
    }
}

async function buscaBanco() {
    var parametro = '8|' + cmbMoneda.getSelectedValue() + '@' + comboLibroVoucher.getSelectedValue();
    var result = await IniciarGridBusqueda(2003, false, layout, parametro);
    if (result.seleccion && result.seleccion.length > 0) {
        var opcion = result.seleccion[0];
        document.getElementById('form-cobanco').value = opcion.codigo.split('/')[1];
        document.getElementById('form-copais').value = opcion.codigo.split('/')[0];
        document.getElementById('form-banco').value = opcion.detalle2;
        document.getElementById('form-nroctacte').value = opcion.descripcion.split(' : ')[1];
        document.getElementById('form-ctacte').value = opcion.detalle1;
    }
}

async function buscaCtaCte() {
    var parametro = '7|' + cmbMoneda.getSelectedValue() + '@' + cmbTipodoc.getSelectedValue() + '@' + cmbTipoenti.getSelectedValue() + '@' + comboLibroVoucher.getSelectedValue();
    var result = await IniciarGridBusqueda(2004, false, layout, parametro);
    if (result.seleccion && result.seleccion.length > 0) {
        var opcion = result.seleccion[0];
        document.getElementById('form-cta-documento').value = opcion.codigo;
        document.getElementById('form-ctadocumento').value = opcion.descripcion;
        document.getElementById('form-obs-ctadocumento').value = opcion.detalle1;
        var splitGasto = opcion.detalle2.split('@@');
        if (splitGasto.length > 2 && splitGasto[2].toLowerCase() != 'vacio') {
            document.getElementById('form-stgasto').checked = true;
            habilitarControlesGasto(true);
            document.getElementById('form-categ-ig').value = splitGasto[0];
            document.getElementById('form-id-ingasto').value = splitGasto[1];
            document.getElementById('form-ingasto').value = splitGasto[2];
            document.getElementById('form-ctagasto').value = splitGasto[3];
            if (splitGasto[4].toLowerCase() != 'vacio') {
                document.getElementById('form-catalpres').value = splitGasto[4];
            }
        }
    }
}

async function buscaIngresoGasto() {
    var parametro = '9|' + cmbMoneda.getSelectedValue();
    var result = await IniciarGridBusqueda(2005, false, layout, parametro);
    var splitGasto1, splitGasto2, splitGasto3;
    if (result.seleccion && result.seleccion.length > 0) {
        var opcion = result.seleccion[0];
        splitGasto1 = opcion.codigo.split(' : ');
        splitGasto2 = opcion.detalle1.split(' : ');
        splitGasto3 = opcion.detalle2.split(' : ');
        console.log(opcion);
        document.getElementById('form-categ-ig').value = splitGasto1[0];
        document.getElementById('form-id-ingasto').value = splitGasto1[1];
        document.getElementById('form-ingasto').value = splitGasto3[1];
        document.getElementById('form-ctagasto').value = splitGasto3[0];
        if (splitGasto2[0].toLowerCase() != '') {
            document.getElementById('form-catalpres').value = splitGasto2[0];
        }
    }
}

async function buscaSeriedoc() {
    var parametro = '10|' + cmbMoneda.getSelectedValue() + '@' + cmbTipodoc.getSelectedValue() + '@' + cmbTipoenti.getSelectedValue() + '@' + comboLibroVoucher.getSelectedValue();
    var result = await IniciarGridBusqueda(2006, false, layout, parametro);
    if (result.seleccion && result.seleccion.length > 0) {
        var opcion = result.seleccion[0];
        document.getElementById('form-coserie').value = opcion.codigo;
        document.getElementById('form-seriedoc').value = opcion.descripcion;
        document.getElementById('form-nrodoc').value = opcion.detalle1;
        document.getElementById('form-codigodoc').value = opcion.descripcion + '-' + opcion.detalle1;
    }
}


function preparaFormularioVouchers(informacion) {
    $('#dv-form-voucher').empty().append(
        $('<table>').append(
            $('<tbody>').append(
                $('<tr>').append(
                    $('<td>').append(
                        $('<input>').attr({
                            type: 'hidden',
                            id: 'form-modo'
                        }).val('V')
                    ).append(
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
                        '<label for="form-nrovoucher">Nro. Voucher</label><input class="input-text form-mr" id="form-nrovoucher" type="text" style="width:40px;">'
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
                    ).append(
                        $('<a>').append(
                            $('<img>').attr('src', '/assets/images/icons/toolbar/ic-search.svg')
                        ).attr({
                            href: 'javascript:void(0)',
                            id: 'btn-rsocial'
                        }).addClass('form-button-img').hide()
                    ).append(
                        $('<a>').append(
                            $('<img>').attr('src', '/assets/images/icons/toolbar/ic-disabled.svg')
                        ).attr({
                            href: 'javascript:void(0)',
                            id: 'btn-elimina-rsocial'
                        }).addClass('form-button-img').hide()
                    ).addClass('no-controls')
                ).append(
                    $('<td>').append(
                        '<input class="input-text" id="form-fregistro" type="text" style="width:80px;"><span class="sp-calendar"><img id="ic-fregistro" src="/assets/images/icons/toolbar/ic-calendar.svg" height="16"></span>'
                    )
                )
            ).append(
                $('<tr>').append(
                    $('<td>').append(
                        '<label for="form-seriedoc">Serie</label><input class="input-text" id="form-seriedoc" type="text" style="width:50px;">'
                    ).append(
                        $('<a>').append(
                            $('<img>').attr('src', '/assets/images/icons/toolbar/ic-search.svg')
                        ).attr({
                            href: 'javascript:void(0)',
                            id: 'btn-coserie'
                        }).addClass('form-button-img').hide()
                    ).append(
                        $('<a>').append(
                            $('<img>').attr('src', '/assets/images/icons/toolbar/ic-disabled.svg')
                        ).attr({
                            href: 'javascript:void(0)',
                            id: 'btn-elimina-coserie'
                        }).addClass('form-button-img form-mr').hide()
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
                        '<label for="form-stbanco">¿Banco?</label><input id="form-stbanco" type="checkbox">'
                    ).append(
                        $('<a>').append(
                            $('<img>').attr('src', '/assets/images/icons/toolbar/ic-search.svg')
                        ).attr({
                            href: 'javascript:void(0)',
                            id: 'btn-banco'
                        }).addClass('form-button-img').hide()
                    ).append(
                        $('<a>').append(
                            $('<img>').attr('src', '/assets/images/icons/toolbar/ic-disabled.svg')
                        ).attr({
                            href: 'javascript:void(0)',
                            id: 'btn-elimina-banco'
                        }).addClass('form-button-img form-mr').hide()
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
                    ).append(
                        $('<input>').attr({
                            type: 'hidden',
                            id: 'form-cobanco'
                        })
                    ).append(
                        $('<input>').attr({
                            type: 'hidden',
                            id: 'form-copais'
                        })
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
                    ).append(
                        $('<a>').append(
                            $('<img>').attr('src', '/assets/images/icons/toolbar/ic-search.svg')
                        ).attr({
                            href: 'javascript:void(0)',
                            id: 'btn-ctadoc'
                        }).addClass('form-button-img').hide()
                    ).append(
                        $('<a>').append(
                            $('<img>').attr('src', '/assets/images/icons/toolbar/ic-disabled.svg')
                        ).attr({
                            href: 'javascript:void(0)',
                            id: 'btn-elimina-ctadoc'
                        }).addClass('form-button-img form-mr').hide()
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
                    ).append(
                        $('<input>').attr({
                            type: 'hidden',
                            id: 'form-coserie'
                        })
                    ).append(
                        $('<input>').attr({
                            type: 'hidden',
                            id: 'form-cocatalenti'
                        })
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
                    ).append(
                        $('<a>').append(
                            $('<img>').attr('src', '/assets/images/icons/toolbar/ic-search.svg')
                        ).attr({
                            href: 'javascript:void(0)',
                            id: 'btn-ingasto'
                        }).addClass('form-button-img').hide()
                    ).append(
                        $('<a>').append(
                            $('<img>').attr('src', '/assets/images/icons/toolbar/ic-disabled.svg')
                        ).attr({
                            href: 'javascript:void(0)',
                            id: 'btn-elimina-ingasto'
                        }).addClass('form-button-img form-mr').hide()
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
    cmbTipoenti = new dhtmlXCombo('dv-tpenti', 'combo', 120);
    cmbTipodociden = new dhtmlXCombo('dv-tpdociden', 'combo', 80);
    cmbTipodoc = new dhtmlXCombo('dv-tpdocumento', 'combo', 160);
    calFregistro = new dhtmlXCalendarObject({ input: 'form-fregistro', dateFormat: '%d/%m/%Y %H:%i', button: 'ic-fregistro', enableTime: true });
    calFvence = new dhtmlXCalendarObject({ input: 'form-fvencimiento', dateFormat: '%d/%m/%Y', button: 'ic-fvencimiento', enableTime: true });
    calFdetraccion = new dhtmlXCalendarObject({ input: 'form-fdetraccion', dateFormat: '%d/%m/%Y', button: 'ic-fdetraccion', enableTime: true });
    // asigna eventos de los checkboxes
    $('#form-stbanco').change(function() {
        habilitarControlesBanco(document.getElementById('form-stbanco').checked);
    });
    $('#form-stctacte').change(function () {
        habilitarControlesCtaCte(document.getElementById('form-stctacte').checked);
    });
    $('#form-stgasto').change(function () {
        habilitarControlesGasto(document.getElementById('form-stgasto').checked);
    });
    $('#form-stdetraccion').change(function () {
        habilitarControlesDetraccion(document.getElementById('form-stdetraccion').checked);
    });
    $('#form-stpercepcion').change(function () {
        habilitarControlesPercepcion(document.getElementById('form-stpercepcion').checked);
    });
    // eventos de los botones de busqueda
    $('#btn-rsocial').on('click', buscaRazonSocial);
    $('#btn-banco').on('click', buscaBanco);
    $('#btn-ctadoc').on('click', buscaCtaCte);
    $('#btn-ingasto').on('click', buscaIngresoGasto);
    $('#btn-coserie').on('click', buscaSeriedoc);
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

function habilitaEdicionVoucher(status) {
    if (status) {
        // habilita toolbar superior
        toolbarVoucher.disableItem('nuevo');
        toolbarVoucher.disableItem('editar');
        toolbarVoucher.enableItem('grabar');
        toolbarVoucher.enableItem('cancelar');
        toolbarVoucher.disableItem('anular');
        // habilita toolbar inferior
        toolbarDetalle.enableItem('insertar');
        toolbarDetalle.enableItem('eliminar');
        toolbarDetalle.enableItem('grabar');
        toolbarDetalle.enableItem('cancelar');
        // cambiar el tipo de las celdas
        var numFilas = gridVoucher.getRowsNum();
        for (var i = 0; i < numFilas; i++) {
            var iRowId = gridVoucher.getRowId(i);
            gridVoucher.setCellExcellType(iRowId, 4, 'edn');
            gridVoucher.setCellExcellType(iRowId, 5, 'edn');
            gridVoucher.setCellExcellType(iRowId, 8, 'ed');
            gridVoucher.setCellExcellType(iRowId, 9, 'ed');
            gridVoucher.setCellExcellType(iRowId, 14, 'edn');
            gridVoucher.setCellExcellType(iRowId, 15, 'ed');
            gridVoucher.setCellExcellType(iRowId, 16, 'ed');
            gridVoucher.setCellExcellType(iRowId, 17, 'ed');
            gridVoucher.setCellExcellType(iRowId, 18, 'ed');
            gridVoucher.setCellExcellType(iRowId, 19, 'ed');
            gridVoucher.setCellExcellType(iRowId, 20, 'ed');
        }
    }
    else {
        // deshabilita toolbar superior
        toolbarVoucher.enableItem('nuevo');
        toolbarVoucher.enableItem('editar');
        toolbarVoucher.disableItem('grabar');
        toolbarVoucher.disableItem('cancelar');
        toolbarVoucher.enableItem('anular');
        // deshabilita toolbar inferior
        toolbarDetalle.disableItem('insertar');
        toolbarDetalle.disableItem('eliminar');
        toolbarDetalle.disableItem('grabar');
        toolbarDetalle.disableItem('cancelar');
        // cambiar el tipo de las celdas
        var numFilas = gridVoucher.getRowsNum();
        for (var i = 0; i < numFilas; i++) {
            var iRowId = gridVoucher.getRowId(i);
            gridVoucher.setCellExcellType(iRowId, 4, 'ron');
            gridVoucher.setCellExcellType(iRowId, 5, 'ron');
            gridVoucher.setCellExcellType(iRowId, 8, 'rotxt');
            gridVoucher.setCellExcellType(iRowId, 9, 'rotxt');
            gridVoucher.setCellExcellType(iRowId, 14, 'ron');
            gridVoucher.setCellExcellType(iRowId, 15, 'rotxt');
            gridVoucher.setCellExcellType(iRowId, 16, 'rotxt');
            gridVoucher.setCellExcellType(iRowId, 17, 'rotxt');
            gridVoucher.setCellExcellType(iRowId, 18, 'rotxt');
            gridVoucher.setCellExcellType(iRowId, 19, 'rotxt');
            gridVoucher.setCellExcellType(iRowId, 20, 'rotxt');
        }
    }
}

function habilitarFormularioNuevo() {
    document.getElementById('form-modo').value = 'I';
    habilitarControlesBase(true);
    // alterna botones del toolbar
    toolbarVoucher.disableItem('nuevo');
    toolbarVoucher.disableItem('editar');
    toolbarVoucher.enableItem('grabar');
    toolbarVoucher.enableItem('cancelar');
    toolbarVoucher.disableItem('anular');
    // resetea los campos de texto
    // calendarios
    document.getElementById('form-femision').value = '';
    document.getElementById('form-fregistro').value = '';
    document.getElementById('form-fvencimiento').value = '';
    document.getElementById('form-fdetraccion').value = '';
    // checks
    document.getElementById('form-modificado').value = '';
    document.getElementById('form-ccosto').value = '';
    document.getElementById('form-stbanco').value = '';
    document.getElementById('form-stctacte').value = '';
    document.getElementById('form-stgasto').value = '';
    document.getElementById('form-stdetraccion').value = '';
    document.getElementById('form-stpercepcion').value = '';
    document.getElementById('form-modificado').value = '';
    // otros inputs
    document.getElementById('form-nrovoucher').disabled = true;
    document.getElementById('form-prin-voucher').value = '';
    document.getElementById('form-nrovoucher').value = '';
    document.getElementById('form-tcambio').value = '';
    document.getElementById('form-codigodoc').value = '';
    document.getElementById('form-seriedoc').value = '';
    document.getElementById('form-nrodoc').value = '';
    document.getElementById('form-imtotal').value = '';
    document.getElementById('form-iminafecto').value = '';
    //
    document.getElementById('form-vigencia').value = '';
    document.getElementById('form-rucdni').value = '';
    document.getElementById('form-rsocial').value = '';
    document.getElementById('form-glosa').value = '';
    document.getElementById('form-nom-usureg').value = '';
    document.getElementById('form-usupd').value = '';
    document.getElementById('form-feupd').value = '';
    document.getElementById('form-importe-diferencia').value = '';
    // habilita los botones de busqueda
    document.getElementById('form-ctadocumento').value = '';
    document.getElementById('form-obs-ctadocumento').value = '';
    document.getElementById('form-cta-documento').value = '';
    // ingreso gasto
    document.getElementById('form-ingasto').value = '';
    document.getElementById('form-ctagasto').value = '';
    document.getElementById('form-catalpres').value = '';
    document.getElementById('form-categ-ig').value = '';
    document.getElementById('form-id-ingasto').value = '';
    // banco
    document.getElementById('form-transaccion').value = '';
    document.getElementById('form-banco').value = '';
    document.getElementById('form-nroctacte').value = '';
    document.getElementById('form-ctacte').value = '';
    // detraccion
    document.getElementById('form-docdetraccion').value = '';
    document.getElementById('form-fdetraccion').value = '';
    document.getElementById('form-importe-detra').value = '';
    // percepcion
    document.getElementById('form-docpercepcion').value = '';
    document.getElementById('form-porc-percepcion').value = '';
    document.getElementById('form-importe-percep').value = '';
    // deshabilita los checboxes
    document.getElementById('form-stbanco').checked = false;
    document.getElementById('form-stgasto').checked = false;
    document.getElementById('form-stdetraccion').checked = false;
    document.getElementById('form-stpercepcion').checked = false;
    habilitarControlesBanco(false);
    habilitarControlesGasto(false);
    habilitarControlesDetraccion(false);
    habilitarControlesPercepcion(false);
    // limpia el detalle
    gridVoucher.clearAll();
}

function onValidarNuevoVoucherSuccess(response) {
    if (response.error) {
        alert(response.error);
        return;
    }
    habilitarFormularioNuevo();
    var nvoucher = response.data;
    var idxmoneda = cmbMoneda.getIndexByValue(nvoucher.CO_MONEDA_EMPR);
    var idxtipodocadmin = cmbTipodoc.getIndexByValue(nvoucher.DE_COLUMN_TIPO_DOCU_DEF);
    var idxtipoenti = cmbTipoenti.getIndexByValue(nvoucher.DE_COLUMN_TIPO_ENTI_DEF);
    var fechaServidor = nvoucher.FE_SERVIDOR.split('T')[0];
    var habilitaCtaCte = nvoucher.ST_FORMATO == 'S';
    $('#btn-coserie').show();
    $('#btn-elimina-coserie').show();
    // setear los valores
    document.getElementById('form-vigencia').value = 'Pendiente';
    document.getElementById('form-tcambio').value = parseFloat(nvoucher.IM_TIPO_CAMBIO).toLocaleString('en-us', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
    document.getElementById('form-nom-usureg').value = usrJson.alias;
    cmbMoneda.selectOption(idxmoneda);
    document.getElementById('form-stctacte').checked = habilitaCtaCte;
    habilitarControlesCtaCte(habilitaCtaCte);
    document.getElementById('form-nrovoucher').value = nvoucher.NU_VOUCHER_NEXT;
    document.getElementById('form-fregistro').value = fechaServidor;
    document.getElementById('form-femision').value = fechaServidor;
    document.getElementById('form-iminafecto').value = '0.00';
    cmbTipodoc.selectOption(idxtipodocadmin);
    cmbTipoenti.selectOption(idxtipoenti);
}

function validarNuevoVoucher() {
    var params = {
        empresa: usrJson.empresa,
        usuario: usrJson.codigo,
        periodo: comboPeriodosVoucher.getSelectedValue(),
        libro: comboLibroVoucher.getSelectedValue()
    };
    $.post('/api/CO010401B/validar-nuevo-voucher', params, onValidarNuevoVoucherSuccess, 'json');
}

async function toolbarVoucherOnClick(id) {
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
        case 'nuevo':
            validarNuevoVoucher();
            break;
        case 'editar':
            var out = await IniciarFormularioSeguridad(205, layout);
            if (out.result == 'S') {
                filasEliminar = [];
                habilitaEdicionVoucher(true);
                habilitarControlesBase(true);
                document.getElementById('form-modo').value = 'U';
            }
            break;
        case 'grabar':
            grabarCabeceraVoucher();
            break;
        case 'cancelar':
            /*
            comboVoucher.selectOption(posicionActual);
            */
            habilitaEdicionVoucher(false);
            comboVoucherOnChange(comboVoucher.getSelectedValue(), '');
            break;
        case 'anular':
            break;
    }
}

function grabarCabeceraVoucher() {
    var params = {
        empresa: usrJson.empresa,
        usuario: usrJson.codigo,
        periodo: comboPeriodosVoucher.getSelectedValue(),
        libro: comboLibroVoucher.getSelectedValue(),
        voucher: comboVoucher.getSelectedValue(),
        accion: document.getElementById('form-modo').value,
        tpdocadmin: cmbTipodoc.getSelectedValue(),
        coserie: document.getElementById('form-coserie').value,
        deserie: document.getElementById('form-seriedoc').value,
        numero: document.getElementById('form-nrodoc').value,
        documento: document.getElementById('form-codigodoc').value,
        fingreso: document.getElementById('form-fregistro').value,
        moneda: cmbMoneda.getSelectedValue(),
        tpcambio: document.getElementById('form-tcambio').value,
        vigencia: document.getElementById('form-vigencia').value,
        fvencimiento: document.getElementById('form-fvencimiento').value,
        tpentidad: cmbTipoenti.getSelectedValue(),
        catalenti: document.getElementById('form-rucdni').value,
        formato: document.getElementById('form-stctacte').checked ? 'S' : 'N',
        ctadocumento: document.getElementById('form-cta-documento').value,
        esgasto: document.getElementById('form-stgasto').checked ? 'S' : 'N',
        coingasto: document.getElementById('form-id-ingasto').value,
        categingasto: document.getElementById('form-categ-ig').value,
        cuentagasto: document.getElementById('form-ctagasto').value,
        catalpres: document.getElementById('form-catalpres').value,
        glosa: document.getElementById('form-glosa').value,
        imtotal: document.getElementById('form-imtotal').value,
        iminafecto: document.getElementById('form-iminafecto').value,
        esbanco: document.getElementById('form-stbanco').checked ? 'S' : 'N',
        cobanco: document.getElementById('form-cobanco').value,
        copais: document.getElementById('form-copais').value,
        coctacte: document.getElementById('form-nroctacte').value,
        cotrsbancaria: document.getElementById('form-transaccion').value,
        esdetraccion: document.getElementById('form-stdetraccion').checked ? 'S' : 'N',
        docdetra: document.getElementById('form-docdetraccion').value,
        fdetra: document.getElementById('form-fdetraccion').value,
        imdetra: document.getElementById('form-importe-detra').value,
        esccostodif: document.getElementById('form-ccosto').checked ? 'S' : 'N',
        espercepcion: document.getElementById('form-stpercepcion').checked ? 'S' : 'N',
        docpercep: document.getElementById('form-docpercepcion').value,
        porcpercep: document.getElementById('form-porc-percepcion').value,
        impercep: document.getElementById('form-importe-percep').value
    };
    $.post('/api/CO010401B/guarda-voucher', params, function(response) {
        if (response.error) {
            alert(response.error);
            return;
        }
        alert(response.mensaje);
        // carga los datos del voucher
        comboVoucher.clearAll();
        var qparams = {
            empresa: usrJson.empresa,
            periodo: comboPeriodosVoucher.getSelectedValue(),
            libro: params.libro,
            usuario: usrJson.codigo
        };
        $.post('/api/CO010401B/info-lista-vouchers', qparams, function(qresponse) {
            if (qresponse.error) {
                alert(qresponse.error);
                return;
            }
            // go prruno
            configuraGridVouchers();
            // recarga combo de vouchers
            var vouchers = qresponse.vouchers;
            var comboVoucherItems = vouchers.options.length;
            toolbarVoucher.setItemText('lblCount', comboVoucherItems);
            comboVoucher.load(vouchers);
            // identifica el indice del voucher actual
            var idxvoucher = comboVoucher.getIndexByValue(params.voucher);
            comboVoucher.selectOption(idxvoucher);
            // reinicia formulario de vouchers
            habilitarControlesVoucher(idxvoucher, comboVoucherItems);
            cargarDatosVoucher(params.voucher);
        }, 'json');
    }, 'json');
}

function ConfiguraTabbarVoucher () {
    toolbarVoucher = tabbar.tabs('voucher').attachToolbar();
        toolbarVoucher.setIconsPath('/assets/images/icons/toolbar/');
        toolbarVoucher.addText('cmbPeriodo', null, '<div id="cmb-periodo-voucher" class="dv-combo" style="width:120px;"></div>');
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
        toolbarVoucher.addSeparator();
        toolbarVoucher.addButton('nuevo', null, 'Nuevo', 'ic-add.svg', 'ic-add-dis.svg');
        toolbarVoucher.addButton('editar', null, 'Editar', 'ic-generate.svg', 'ic-generate-dis.svg');
        toolbarVoucher.addButton('grabar', null, 'Grabar', 'ic-save.svg', 'ic-save-dis.svg');
        toolbarVoucher.addButton('cancelar', null, 'Cancelar', 'ic-close.svg', 'ic-close-dis.svg');
        toolbarVoucher.addButton('anular', null, 'Anular', 'ic-disabled.svg', 'ic-disabled-dis.svg');
        // deshabilitar algunos controles
        toolbarVoucher.disableItem('btnInicio');
        toolbarVoucher.disableItem('btnAnterior');
        toolbarVoucher.disableItem('btnSiguiente');
        toolbarVoucher.disableItem('nuevo');
        toolbarVoucher.disableItem('editar');
        toolbarVoucher.disableItem('grabar');
        toolbarVoucher.disableItem('cancelar');
        toolbarVoucher.disableItem('anular');
        toolbarVoucher.attachEvent('onClick', toolbarVoucherOnClick);
    comboPeriodosVoucher = new dhtmlXCombo('cmb-periodo-voucher', 'combo', null, 'image');
        comboPeriodosVoucher.setImagePath('/assets/images/icons/toolbar/');
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
        layoutVoucher.cells('a').setHeight(310);
    layoutVoucher.cells('a').attachHTMLString('<div id="dv-form-voucher"></div>');
}