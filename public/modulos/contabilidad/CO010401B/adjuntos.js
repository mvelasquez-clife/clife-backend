function onAdjLibrosComplete(response) {
    if (response.error) {
        alert(response.error);
        return;
    }
    comboLibroAdjuntos.clearAll();
    comboLibroAdjuntos.load({ options: [{ value: 0, text: '- Seleccione libro -' }] });
    comboLibroAdjuntos.selectOption(0);
    var data = response;
    comboLibroAdjuntos.load(data);
}

function comboPeriodosAdjuntosOnChange(value, text) {
    comboLibroAdjuntos.clearAll();
    if (value == 0) {
        comboLibroAdjuntos.load({ options: [{ value: 0, text: '- No hay libros para el periodo seleccionado -' }] });
    }
    else {
        var params = {
            periodo: value,
            alias: usrJson.alias
        };
        comboLibroAdjuntos.clearAll();
        comboLibroAdjuntos.load({ options: [{ value: 0, text: '- Espere... -' }] });
        comboLibroAdjuntos.selectOption(0);
        $.post('/api/CO010401B/combo-libros', params, onAdjLibrosComplete, 'json');
    }
}

function toolbarAdjuntosOnClick(button) {
    switch (button) {
        case 'buscar':
            ConfiguraGridAdjuntos();
            CargarGridAdjuntos();
            break;
    }
}

function CargarGridAdjuntos() {
    var periodo = comboPeriodosAdjuntos.getSelectedValue();
    var libro = comboLibroAdjuntos.getSelectedValue();
    gridAdjuntos.clearAll();
    tabbar.tabs('adjuntos').progressOn();
    gridAdjuntos.load('/api/CO010401B/grid-adjuntos-voucher/' + usrJson.empresa + '/' + periodo + '/' + libro, function() {
        tabbar.tabs('adjuntos').progressOff();
    });
}

function ConfiguraGridAdjuntos() {
    gridAdjuntos = tabbar.tabs('adjuntos').attachGrid();
        gridAdjuntos.setImagePath('/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/');
        gridAdjuntos.setIconsPath('/assets/images/icons/grid/');
        gridAdjuntos.setHeader('Periodo,Nro.Voucher,Documento,Glosa,Moneda,T.Cambio,Total,Pdf?,,Xml?,,F.FileReg,Usu.Reg.V.Cab,F.Reg V.Cab,Usu.Upd.V.Cab,F.Upd.V.Cab,Ruta PDF,Ruta XML,Libro Contable,Cod.Proveedor,TipoDoc.Administr.');
        gridAdjuntos.setColTypes('ron,ron,rotxt,rotxt,rotxt,ron,ron,img,img,img,img,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt');
        gridAdjuntos.setInitWidths('60,60,80,240,80,100,100,50,30,50,30,70,120,70,240,70,160,160,60,70,60');
        gridAdjuntos.setColumnIds('co_periodo,nu_voucher,co_documento,de_glosa,de_moneda,im_tipo_cambio,im_total,st_file_pdf,btn_fpdf,st_file_xml,btn_fxml,fe_file_reg,de_usu_reg_voucher_cab,fe_reg_voucher_cab,de_usu_upd_voucher_cab,fe_upd_voucher_cab,de_ruta_file_pdf,de_ruta_file_xml,co_libro_contable,co_proveedor,co_tipo_docu_administr');
        gridAdjuntos.setColAlign('left,left,right,left,left,right,right,center,center,center,center,left,left,right,left,right,left,left,left,left,left');
        gridAdjuntos.setNumberFormat('0,000.00', 5);
        gridAdjuntos.setNumberFormat('0,000.00', 6);
    gridAdjuntos.init();
}

function ConfiguraTabbarAdjuntos() {
    toolbarAdjuntos = tabbar.tabs('adjuntos').attachToolbar();
        toolbarAdjuntos.setIconsPath('/assets/images/icons/toolbar/');
        toolbarAdjuntos.addText('cmbPeriodo', null, '<div id="cmb-periodo-adjuntos" class="dv-combo" style="width:120px;"></div>');
        toolbarAdjuntos.addText('cmbLibro', null, '<div id="cmb-libro-adjuntos" class="dv-combo" style="width:240px;"></div>');
        toolbarAdjuntos.addSeparator();
        toolbarAdjuntos.addButton('buscar', null, 'Buscar', 'ic-goggles.svg', 'ic-goggles-dis.svg')
        toolbarAdjuntos.attachEvent('onClick', toolbarAdjuntosOnClick);
    comboPeriodosAdjuntos = new dhtmlXCombo('cmb-periodo-adjuntos');
        comboPeriodosAdjuntos.load('/api/CO010401B/combo-periodos/' + usrJson.empresa, function () {
            comboPeriodosAdjuntos.selectOption(0);
            comboLibroAdjuntos.selectOption(0);
        });
        comboPeriodosAdjuntos.attachEvent('onChange', comboPeriodosAdjuntosOnChange);
    comboLibroAdjuntos = new dhtmlXCombo('cmb-libro-adjuntos');
        comboLibroAdjuntos.load({ options: [{ value: 0, text: '- Seleccione libro -' }] });
}