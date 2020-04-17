var entidad;

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
function PreparaInterfazProveedor() {
    tabbar.tabs('provisionados').detachObject();
    tabbar.tabs('provisionados').progressOn();
    layoutDocumentos = tabbar.tabs('provisionados').attachLayout('1C');
        layoutDocumentos.cells('a').hideHeader();
    toolbarGridDocumentos = layoutDocumentos.cells('a').attachToolbar();
        toolbarGridDocumentos.addText('lblResumen', null, 'Datos del proveedor');
        toolbarGridDocumentos.addText('lblMoneda', null, 'Moneda');
        toolbarGridDocumentos.addText('ipMoneda', null, '<div id="lbl-moneda" class="dv-label" style="width:80px;"></div>');
        toolbarGridDocumentos.addText('lblIngreso', null, 'Ingreso');
        toolbarGridDocumentos.addText('ipIngreso', null, '<div id="lbl-ingreso" class="dv-label text-right" style="width:120px;"></div>');
        toolbarGridDocumentos.addText('lblEgreso', null, 'Egreso');
        toolbarGridDocumentos.addText('ipEgreso', null, '<div id="lbl-egreso" class="dv-label text-right" style="width:120px;"></div>');
        toolbarGridDocumentos.addText('lblSaldo', null, 'Saldo');
        toolbarGridDocumentos.addText('ipSaldo', null, '<div id="lbl-saldo" class="dv-label text-right" style="width:120px;"></div>');
    gridDocumentos = layoutDocumentos.cells('a').attachGrid();
}

function CargarDocumentosProveedor () {
    tabbar.tabs('provisionados').progressOff();
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
}

function onDatosIniciales (response) {
    let data = response.data;
    comboMonedas.load({ options: data.monedas });
    comboTpentis.load({ options: data.tpentidades });
    comboMonedas.selectOption(0);
    comboTpentis.selectOption(0);
}

function IniciarComponentes () {
    viewport = new dhtmlXWindows();
    viewport.attachViewportTo(document.body);
    ConfiguraLayout();
    ConfiguraTabbar();
    $.post('/api/LO010301/ls-datos-iniciales', {}, onDatosIniciales, 'json');
}