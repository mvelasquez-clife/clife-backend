function setSens(inp, k) {
    if (k == 'min') {
        calResumen.setSensitiveRange(inp.value, null);
    }
    else {
        calResumen.setSensitiveRange(null, inp.value);
    }
}

function chAllLibros(event) {
    var checked = document.getElementById('ch-all-libros').checked;
    gridLibros.setCheckedRows(0, checked ? 1 : 0);
}

function ConfiguraGridLibros() {
    layoutResumen.cells('a').detachObject();
    gridLibros = layoutResumen.cells('a').attachGrid();
        gridLibros.setHeader('<input type="checkbox" id="ch-all-libros" style="margin-left:-3px;" checked>,Libro contable,ID');
        gridLibros.setImagePath('/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/');
        gridLibros.setIconsPath('/assets/images/icons/grid/');
        gridLibros.setInitWidths('40,200,60');
        gridLibros.setColTypes('ch,rotxt,ron');
        gridLibros.setColAlign('center,left,right');
        gridLibros.setColumnIds('sel,descripcion,libro');
    gridLibros.init();
}

function CargaDatosGridLibros() {
    gridLibros.clearAll();
    layoutResumen.cells('a').progressOn();
    gridLibros.load('/api/CO010401B/grid-resumen-libros/' + usrJson.empresa, function() {
        layoutResumen.cells('a').progressOff();
    });
    $('#ch-all-libros').on('click', chAllLibros);
}

function ConfiguraGridResumenVoucher() {
    layoutResumen.cells('b').detachObject();
        layoutResumen.cells('b').attachStatusBar({
            paging: true,
            text: "<div id='res-vouchers-pag'></div>"
        });
    gridVouchers = layoutResumen.cells('b').attachGrid();
        gridVouchers.setHeader('Estado,ID Voucher,ID Lib. Contable,Libro Contable,Periodo,Voucher,F. Registro,F. Vencimiento,Tipo Doc.,Tipo Doc Administrativo,ID Moneda,Moneda,Tipo Cambio,Documento,Total,Inafecto,Glosa,ID T.Entidad,Tipo Entidad,Nro.Documento,Razon Social,Formato,ID Cta Documento,Cuenta Documento,Cta Documento Obs,Detraccion,Doc. Detraccion,F. Detraccion,Monto Detraccion,Percepcion,Doc. Percepcion,Percibido Percepcion,% Percepcion,Banco,Banco,Cuenta Corriente,Descripcion Cta Corriente,Transa Bancaria,Gasto,ID Categ Ingreso Gasto,Categ Ingreso Gasto,ID Ingreso Gasto,Ingreso/Gasto,Usuario Reg Cab,F. Reg Cab,ID Cuenta,Descripcion de la Cuenta,Cuenta Destino,Manual,Debe,Haber,Documento Det,ID Tipo Doc Det,Tipo Doc Det,Moneda Det,Tipo Cambio,ID T. Entidad,Tipo Entidad Det,Razon Social Det,ID Cond Tribu,Cond Tribu,Glosa Detalle,Usuario Upd Det,F. Upd Det');
        gridVouchers.setImagePath('/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/');
        gridVouchers.setIconsPath('/assets/images/icons/grid/');
        gridVouchers.setColTypes('rotxt,rotxt,rotxt,rotxt,ron,ron,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,ron,rotxt,ron,ron,rotxt,rotxt,rotxt,rotxt,rotxt,img,rotxt,rotxt,rotxt,img,rotxt,rotxt,ron,img,rotxt,ron,ron,img,rotxt,rotxt,rotxt,rotxt,img,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,img,img,ron,ron,rotxt,rotxt,rotxt,rotxt,ron,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt');
        gridVouchers.setInitWidths('60,80,50,160,60,60,75,75,40,160,40,80,60,100,100,100,200,50,160,80,240,45,60,160,160,45,75,75,100,45,60,100,80,45,160,100,200,100,45,60,240,60,160,240,70,60,240,45,45,100,100,80,60,160,80,80,70,160,240,60,120,240,240,70');
        gridVouchers.setColumnIds('es_vigencia,co_prin_voucher,co_libro_contable,de_libro_contable,co_periodo,nu_voucher,fe_registro,fe_vencimiento,co_tipo_doc_administr,de_tipo_doc_administr,co_moneda,de_moneda,im_tipo_cambio,co_documento,im_total,im_inafecto,de_glosa,co_tipo_entidad,de_tipo_entidad,nu_documento,de_razon_social,st_formato,co_cuenta_documento,de_cuenta_documento,de_cuenta_documento_obs,st_detraccion,co_documento_detraccion,fe_documento_detraccion,im_monto_detraccion,st_percepcion,co_documento_percepcion,im_percibido_percepcion,nu_porcentaje_percepcion,st_banco,de_banco,co_cuenta_corriente,de_cuenta_corriente,co_transa_bancaria_tran,st_gasto,co_categ_ingreso_gasto,de_categ_ingreso_gasto,co_ingreso_gasto,de_ingreso_gasto,de_usuario_reg_cab,fe_reg_cab,co_cuenta,de_cuenta,st_cuenta_destino,st_manual,im_debe,im_haber,co_documento_det,co_tipo_doc_administr_det,de_tipo_doc_administr_det,de_moneda_det,im_tipo_cambio_det,co_tipo_entidad_det,de_tipo_entidad_det,de_razon_social_det,id_cond_tribu,de_cond_tribu,de_glosa_det,de_usuario_upd_det,fe_upd_det');
        gridVouchers.setColAlign('left,right,right,left,right,right,left,left,right,left,right,left,right,right,right,right,left,right,left,right,left,center,right,left,left,center,right,left,right,center,right,right,right,center,left,right,left,right,center,right,left,right,left,left,left,right,left,center,center,right,right,right,right,left,left,right,right,left,left,right,left,left,left,left');
        gridVouchers.setNumberFormat('0,000.00', 12);
        gridVouchers.setNumberFormat('0,000.00', 14);
        gridVouchers.setNumberFormat('0,000.00', 15);
        gridVouchers.setNumberFormat('0,000.00', 28);
        gridVouchers.setNumberFormat('0,000.00', 31);
        gridVouchers.setNumberFormat('0,000.00', 32);
        gridVouchers.setNumberFormat('0,000.00', 49);
        gridVouchers.setNumberFormat('0,000.00', 50);
        gridVouchers.setNumberFormat('0,000.00', 55);
    gridVouchers.init();
    gridVouchers.enablePaging(true, 500, 10, 'res-vouchers-pag');
    gridVouchers.setPagingSkin('toolbar');
}

function CargaDatosGridResumenVoucher() {
    var empresa = usrJson.empresa;
    var desde = encodeURIComponent(toolbarResumen.getValue('calDesde'));
    var hasta = encodeURIComponent(toolbarResumen.getValue('calHasta'));
    var tipos = gridLibros.getCheckedRows(0);
    gridVouchers.clearAll();
    layoutResumen.cells('b').progressOn();
    gridVouchers.load('/api/CO010401B/grid-resumen-vouchers/' + empresa + '/' + desde + '/' + hasta + '/' + tipos, function() {
        layoutResumen.cells('b').progressOff();
    });
}

function toolbarResumenOnClick(item) {
    switch (item) {
        case 'buscar':
            ConfiguraGridResumenVoucher();
            CargaDatosGridResumenVoucher();
            break;
        default: break;
    }
}

function ConfiguraTabbarResumen() {
    layoutResumen = tabbar.tabs('resumen').attachLayout('2U');
        layoutResumen.cells('a').hideHeader();
        layoutResumen.cells('a').setWidth(320);
        layoutResumen.cells('b').hideHeader();
    toolbarResumen = tabbar.tabs('resumen').attachToolbar();
        toolbarResumen.setIconsPath('/assets/images/icons/toolbar/');
        toolbarResumen.addText('lblDesde', null, 'Rango de fechas');
        toolbarResumen.addInput('calDesde', null, '', 75);
        toolbarResumen.addText('lblHasta', null, 'al');
        toolbarResumen.addInput('calHasta', null, '', 75);
        toolbarResumen.addButton('buscar', null, 'Buscar', 'ic-goggles.svg', 'ic-goggles-dis.svg');
        toolbarResumen.attachEvent('onClick', toolbarResumenOnClick);
    calResumenDesde = toolbarResumen.getInput('calDesde');
        calResumenDesde.setAttribute('readOnly', 'true');
        calResumenDesde.onclick = function () { setSens(calResumenHasta, 'max'); }
    calResumenHasta = toolbarResumen.getInput('calHasta');
        calResumenHasta.setAttribute('readOnly', 'true');
        calResumenHasta.onclick = function () { setSens(calResumenDesde, 'min'); }
    calResumen = new dhtmlXCalendarObject([calResumenDesde, calResumenHasta]);
        calResumen.setDateFormat('%d/%m/%Y');
    toolbarResumen.setValue('calDesde', '01/01/2020');
    toolbarResumen.setValue('calHasta', '07/01/2020');
    ConfiguraGridLibros();
    CargaDatosGridLibros();
}