const structs = {
    FormAsignaLineaCred: [
        { type: 'settings', labelWidth: 80, offsetLeft: 16 },
        { label: 'Usuario autoriza', type: 'input', name: 'uautoriza', inputWidth: 200, offsetTop: 16 },
        { label: 'Cliente', type: 'input', name: 'rucdni', inputWidth:100 },
        { label: ' ', type: 'input', name: 'nombre', inputWidth: 280 },
        { label: 'Moneda', type: 'input', name: 'moneda', inputWidth: 160 },
        { label: 'Fuerza de venta', type: 'combo', name: 'fzaventa', inputWidth: 240, connector: '/api/CR0100/fuerzas-venta/' + usrJson.empresa },
        { label: 'Crédito autorizado', type: 'input', name: 'importe', inputWidth: 200 },
        { label: 'Observación autoriza', type: 'input', name: 'observacion', inputWidth: 320, rows: 3 }
    ],
    FormAuditoriaContacto: [
        { type: 'settings', labelWidth: 60, offsetLeft: 16, offsetTop: 8 },
        { type: 'label', name: 'titulo', label: '<span style="color:#0d47a1;">Registrar nuevo contacto</span>', labelWidth: 300, offsetTop: 16 },
        { type: 'hidden', name: 'modo', value: 'I' },
        { type: 'hidden', name: 'cliente' },
        { type: 'hidden', name: 'diferenciador' },
        { label: 'Tipo', type: 'combo', name: 'tipo', inputWidth: 120, offsetTop: 16, connector: '/api/CR0100/tipos-comunicacion' },
        { label: 'Número', type: 'input', name: 'numero', inputWidth: 160 },
        { label: 'Estado', type: 'combo', name: 'estado', inputWidth: 100, options: [
            { value: 'Vigente', text: 'Vigente', selected: true },
            { value: 'Retirado', text: 'Retirado' }
        ] },
        { type: 'block', blockOffset: 45, list: [
            { type: 'button', name: 'guardar', value: 'Guardar', offsetLeft: 16 },
            { type: 'newcolumn' },
            { type: 'button', name: 'limpiar', value: 'Limpiar' }
        ] }
    ],
    FormModificaNc: [
        { type: 'settings', position: 'label-right' },
        { type: 'block', blockOffset: 10, list: [
            { type: 'fieldset', label: '<span style="color:#1565c0;">Documento de venta registrado</span>', inputWidth: 470, offsetLeft: 1, list: [
                { type: 'settings', position: 'label-left' },
                { type: 'block', blockOffset: 0, list: [
                    { type: 'settings', position: 'label-left', offsetLeft: 8 },
                    { type: 'input', name: 'factura', label: 'Factura ', inputWidth: 75, offsetLeft: 1, labelWidth: 60 },
                    { type: 'newcolumn' },
                    { type: 'input', name: 'fecharegistro', label: 'Deuda ', offsetLeft: 12, inputWidth: 90 }
                ] },
                { type: 'block', blockOffset: 0, list: [
                    { type: 'settings', position: 'label-left', offsetLeft: 8 },
                    { type: 'input', name: 'codigonota', label: 'Nota créd. ', inputWidth: 85, offsetLeft: 1, labelWidth: 60 },
                    { type: 'newcolumn' },
                    { type: 'input', name: 'fecharegistro', label: 'Fe. registro ', inputWidth: 60 },
                    { type: 'newcolumn' },
                    { type: 'input', name: 'nrovoucher', label: 'Nro. voucher ', inputWidth: 60 }
                ] },
                { type: 'block', blockOffset: 0, offsetLeft: 1, list: [
                    { type: 'input', name: 'ruc', label: 'Cliente ', inputWidth: 75, labelWidth: 60 },
                    { type: 'newcolumn' },
                    { type: 'input', name: 'cliente', inputWidth: 280 }
                ] },
                { type: 'block', blockOffset: 0, offsetLeft: 1, list: [
                    { type: 'input', name: 'vcodigo', label: 'Vendedor ', inputWidth: 75, labelWidth: 60 },
                    { type: 'newcolumn' },
                    { type: 'input', name: 'vendedor', inputWidth: 280 }
                ] },
                { type: 'block', blockOffset: 0, offsetLeft: 1, list: [
                    { type: 'settings', position: 'label-left', offsetLeft: 12, inputWidth: 90 },
                    { type: 'input', name: 'importe', label: 'Importe ', offsetLeft: 0, labelWidth: 60 },
                    { type: 'newcolumn' },
                    { type: 'input', name: 'igv', label: 'IGV ' },
                    { type: 'newcolumn' },
                    { type: 'input', name: 'total', label: 'Total ' }
                ] }
            ] },
            { type: 'newcolumn' },
            { type: 'fieldset', label: '<span style="color:#009688;">Nuevo documento para amortizar</span>', labelWidth: 160, inputWidth: 470, offsetLeft: 8, list: [
                { type: 'settings', position: 'label-left', offsetTop: 3 },
                { type: 'block', blockOffset: 0, offsetLeft: 1, list: [
                    { type: 'settings' },
                    { type: 'input', name: 'periodo', label: 'Periodo ', inputWidth: 75, offsetLeft: 1, labelWidth: 60 },
                    { type: 'newcolumn' },
                    { type: 'input', name: 'fecha', label: 'Fecha ', offsetLeft: 12, inputWidth: 90 }
                ] },
                { type: 'block', blockOffset: 0, offsetLeft: 1, list: [
                    { type: 'settings' },
                    { type: 'input', name: 'nuevodoc', label: 'Documento ', inputWidth: 75, offsetLeft: 1, labelWidth: 60 },
                    { type: 'newcolumn' },
                    { type: 'input', name: 'nuevadeuda', label: 'Deuda ', offsetLeft: 12, inputWidth: 80 },
                    { type: 'newcolumn' },
                    { type: 'input', name: 'importetrs', label: 'Importe ', offsetLeft: 12, inputWidth: 80 }
                ] },
                { type: 'block', blockOffset: 0, offsetLeft: 1, list: [
                    { type: 'input', name: 'rcodigo', label: 'Cobrador ', inputWidth: 75, labelWidth: 60 },
                    { type: 'newcolumn' },
                    { type: 'input', name: 'recaudador', inputWidth: 280 }
                ] },
                { type: 'block', blockOffset: 0, offsetLeft: 1, offsetTop: 10, list: [
                    { type: 'button', name: 'transfiere', value: 'Grabar ', inputWidth: 75, labelWidth: 60, offsetLeft: 62 },
                    { type: 'newcolumn' },
                    { type: 'button', name: 'cancelar', value: 'Cancelar', inputWidth: 280, offsetLeft: 8 }
                ] }
            ] }
        ] }
    ]
};
let ClienteRes, TransferenciaRes, DestinatarioRes, AuditoriaRes;
let ToolbarTransferenciaOrigen, GridTransferenciaOrigen, ToolbarTransferenciaDestino, GridTransferenciaDestino;
let LayoutWinCtacte, LayoutWinAuditoria, FormWinAuditoria, GridWinAuditoria, GridMovimientosCompras, GridMovimientosPagos, ToolbarMovimientos, SliderPeriodos;
let RenderInicialGraficoMovimientos = true, PeriodosMovimientosCliente, DatosMovimientosCliente;
let WinDocumentoViewer, WinModificaNc, LayoutModificaNc, GridModificaNc;

IniciarComponentes = () => {
    Layout = new dhtmlXLayoutObject(document.body, '1C');
    Tabbar = Layout.cells('a').attachTabbar();
        Tabbar.addTab('ctacte', 'Cuenta Corriente Clientes', null, null, true);
        Tabbar.addTab('transferencia', 'Transferencia documentos');
        Tabbar.addTab('auditoria', 'Auditoría');
    //layout cuenta corriente
    ToolbarCtacte = Tabbar.tabs('ctacte').attachToolbar();
        ToolbarCtacte.setIconsPath('/assets/images/icons/toolbar/');
        ToolbarCtacte.addButton('alternaPanel', null, null, 'ic-menu.svg', null);
        ToolbarCtacte.addText('clienteLabel', null, 'Cliente');
        ToolbarCtacte.addInput('clienteRuc', null, null, 75);
        ToolbarCtacte.addInput('clienteNombre', null, null, 160);
        ToolbarCtacte.addButton('clienteBusca', null, null, 'ic-search.svg', null);
        ToolbarCtacte.addSeparator();
        ToolbarCtacte.addInput('fechaDesde', null, '', 75);
        ToolbarCtacte.addInput('fechaHasta', null, '', 75);
        ToolbarCtacte.addButton('clienteRecarga', null, 'Recargar', 'ic-refresh.svg', 'ic-refresh-dis.svg');
        ToolbarCtacte.addButtonTwoState('clienteCorporativo', null, '<span style="color:#f44336;">Cliente corporativo</span>', 'ic-check-dis.svg', null);
        ToolbarCtacte.addSeparator();
        ToolbarCtacte.addButton('letras', null, 'Letras', 'ic-letra.svg', null);
        ToolbarCtacte.addButton('cheques', null, 'Cheques', 'ic-cheque.svg', null);
        ToolbarCtacte.addButton('credito', null, 'Crédito cliente', 'ic-credito.svg', null);
        ToolbarCtacte.addButton('graficos', null, 'Movs. periodo', 'ic-estadistica.svg', null);
    ToolbarCtacte.disableItem('clienteRuc');
    ToolbarCtacte.disableItem('clienteNombre');
    ToolbarCtacte.disableItem('clienteRecarga');
    ToolbarCtacte.disableItem('letras');
    ToolbarCtacte.disableItem('cheques');
    ToolbarCtacte.disableItem('credito');
    ToolbarCtacte.disableItem('graficos');
    InputDesde = ToolbarCtacte.getInput('fechaDesde');
        InputDesde.setAttribute('readOnly', 'true');
        InputDesde.onclick = function(){ setSens(InputHasta, 'max'); }
    InputHasta = ToolbarCtacte.getInput('fechaHasta');
        InputHasta.setAttribute('readOnly', 'true');
        InputHasta.onclick = function(){ setSens(InputDesde, 'min'); }
    CalendarCtacte = new dhtmlXCalendarObject([InputDesde,InputHasta]);
        CalendarCtacte.setDateFormat("%d/%m/%Y");
    let iFecha = new Date();
    ToolbarCtacte.setValue('fechaHasta', iFecha.toLocaleDateString('en-GB'));
    iFecha.setMonth(iFecha.getMonth() - 6);
    ToolbarCtacte.setValue('fechaDesde', iFecha.toLocaleDateString('en-GB'));
    LayoutCtacte = Tabbar.tabs('ctacte').attachLayout('2U');
        LayoutCtacte.cells('a').hideHeader();
        LayoutCtacte.cells('b').hideHeader();
        LayoutCtacte.cells('b').setCollapsedText('<span style="color:#00796b;">Seleccione un cliente para visualizar</span>');
        LayoutCtacte.cells('b').collapse();
    LayoutCtacte.cells('a').attachHTMLString('<div class="div-empty div-ctacte"></div>');
    //layout transferencia
    LayoutTransferenciaDocumentos = Tabbar.tabs('transferencia').attachLayout('2U');
    LayoutTransferenciaDocumentos.cells('a').setText('Datos del vendedor origen');
        ToolbarTransferenciaOrigen = LayoutTransferenciaDocumentos.cells('a').attachToolbar();
        ToolbarTransferenciaOrigen.setIconsPath('/assets/images/icons/toolbar/');
        ToolbarTransferenciaOrigen.addText('origenLabel', null, 'Vendedor origen');
        ToolbarTransferenciaOrigen.addInput('origenRuc', null, null, 75);
        ToolbarTransferenciaOrigen.addInput('origenNombre', null, null, 160);
        ToolbarTransferenciaOrigen.addButton('origenBusca', null, null, 'ic-search.svg', null);
        ToolbarTransferenciaOrigen.addSeparator();
        ToolbarTransferenciaOrigen.addButton('origenTransfiere', null, 'Transferir', 'ic-transfer.svg', null);
        ToolbarTransferenciaOrigen.disableItem('origenRuc');
        ToolbarTransferenciaOrigen.disableItem('origenNombre');
        ToolbarTransferenciaOrigen.attachEvent('onClick', ToolbarTransferenciaOrigenOnClick);
    LayoutTransferenciaDocumentos.cells('b').setText('Datos del vendedor destino');
        ToolbarTransferenciaDestino = LayoutTransferenciaDocumentos.cells('b').attachToolbar();
        ToolbarTransferenciaDestino.setIconsPath('/assets/images/icons/toolbar/');
        ToolbarTransferenciaDestino.addText('destinoLabel', null, 'Vendedor destino');
        ToolbarTransferenciaDestino.addInput('destinoRuc', null, null, 75);
        ToolbarTransferenciaDestino.addInput('destinoNombre', null, null, 160);
        ToolbarTransferenciaDestino.addButton('destinoBusca', null, null, 'ic-search.svg', null);
        ToolbarTransferenciaDestino.disableItem('destinoRuc');
        ToolbarTransferenciaDestino.disableItem('destinoNombre');
        ToolbarTransferenciaDestino.attachEvent('onClick', ToolbarTransferenciaDestinoOnClick);
    //layout auditoria
    LayoutAuditoria = Tabbar.tabs('auditoria').attachLayout('1C');
        LayoutAuditoria.cells('a').hideHeader();
    ToolbarAuditoria = LayoutAuditoria.cells('a').attachToolbar();
        ToolbarAuditoria.setIconsPath('/assets/images/icons/toolbar/');
        ToolbarAuditoria.addText('auditoriaLabelCliente', null, 'Cliente');
        ToolbarAuditoria.addInput('auditoriaRuc', null, null, 75);
        ToolbarAuditoria.addInput('auditoriaNombre', null, null, 160);
        ToolbarAuditoria.addButton('auditoriaBusca', null, null, 'ic-search.svg', null);
        ToolbarAuditoria.addText('auditoriaLabelImporte', null, 'Importe mínimo');
        ToolbarAuditoria.addInput('auditoriaMinimo', null, null, 75);
        ToolbarAuditoria.addButton('auditoriaCargar', null, 'Buscar', 'ic-goggles.svg', null);
        ToolbarAuditoria.addSeparator();
        ToolbarAuditoria.addButton('auditoriaPermisos', null, 'Permisos', 'ic-shield.svg', null);
        ToolbarAuditoria.addButton('auditoriaConfirma', null, 'Confirmar', 'ic-ok.svg', 'ic-ok-dis.svg');
        ToolbarAuditoria.addButton('auditoriaGuardar', null, 'Guardar auditoría', 'ic-save.svg', 'ic-save-dis.svg');
        ToolbarAuditoria.addButton('auditoriaExportar', null, 'Exportar', 'ic-export.svg', 'ic-export-dis.svg');
        ToolbarAuditoria.disableItem('auditoriaRuc');
        ToolbarAuditoria.disableItem('auditoriaNombre');
        ToolbarAuditoria.disableItem('auditoriaConfirma');
        ToolbarAuditoria.disableItem('auditoriaGuardar');
        ToolbarAuditoria.disableItem('auditoriaExportar');
        ToolbarAuditoria.setValue('auditoriaMinimo', '0.01')
        ToolbarAuditoria.attachEvent('onclick', ToolbarAuditoriaOnClick);
    LayoutAuditoria.cells('a').attachHTMLString('<div class="div-empty div-auditoria"></div>');
    //crear el viewport
    WinContainer = new dhtmlXWindows();
    WinContainer.attachViewportTo(document.body);
    //asigna eventos de los objetos
    ToolbarCtacte.attachEvent('onClick', ToolbarCtacteOnClick);
    ToolbarCtacte.attachEvent('onBeforeStateChange', ToolbarCtacteOnBeforeStateChange);
}

//métodos
ResetLayout = () => {
    Tabbar.tabs('ctacte').detachObject();
    Tabbar.tabs('ctacte').attachHTMLString('<div class="div-empty div-ctacte"></div>');
    LayoutCtacte.cells('b').setCollapsedText('<span style="color:#00796b;">Seleccione un cliente para visualizar</span>');
}
setSens = (inp, k) => {
    if (k == 'min') CalendarCtacte.setSensitiveRange(inp.value, null);
    else CalendarCtacte.setSensitiveRange(null, inp.value);
}
EscribirSubgridPlanillas = (documento, moneda) => {
    LayoutCtacteSec.cells('a').detachObject();
    SubgridPlanillas = LayoutCtacteSec.cells('a').attachGrid();
        SubgridPlanillas.setIconsPath('/assets/images/icons/grid/');
        SubgridPlanillas.setHeader('Nro.Planilla,,Modo,Importe,Fe.Sistema,Nro.Cheque,Banco,Tp.Documento');
        SubgridPlanillas.setInitWidths('90,20,60,100,80,100,160,60');
        SubgridPlanillas.setColTypes('rotxt,img,rotxt,ron,rotxt,rotxt,rotxt,rotxt');
        SubgridPlanillas.setColAlign('left,center,left,right,left,left,left,left');
        SubgridPlanillas.setNumberFormat('0,000.00',3);
        SubgridPlanillas.init();
    SubgridPlanillas.load('/api/CR0100/planillas-documento/' + usrJson.empresa + '/' + ClienteRes.codigo + '/' + documento + '/' + moneda);
}
EscribirSubgridLetras = (documento) => {
    LayoutCtacteSec.cells('b').detachObject();
    SubgridLetras = LayoutCtacteSec.cells('b').attachGrid();
        SubgridLetras.setIconsPath('/assets/images/icons/grid/');
        SubgridLetras.setHeader('Nro.Letra,Fe.Registro,Importe,Estado,Código');
        SubgridLetras.setInitWidths('90,90,100,120,60');
        SubgridLetras.setColTypes('rotxt,rotxt,ron,rotxt,rotxt');
        SubgridLetras.setColAlign('left,left,right,left,left');
        SubgridLetras.setNumberFormat('0,000.00',2);
        SubgridLetras.init();
    SubgridLetras.load('/api/CR0100/letras-cheques/' + usrJson.empresa + '/' + documento);
}
EscribirSubgridNotas = (documento) => {
    LayoutCtacteSec.cells('c').detachObject();
    SubgridNotas = LayoutCtacteSec.cells('c').attachGrid();
        SubgridNotas.setIconsPath('/assets/images/icons/grid/');
        SubgridNotas.setHeader(',Nota Cred/Deb,,Nro.Guia,Importe,Concepto,Estado,Fecha');
        SubgridNotas.setInitWidths('20,90,20,90,100,160,80,90');
        SubgridNotas.setColTypes('img,rotxt,img,rotxt,ron,rotxt,rotxt,rotxt');
        SubgridNotas.setColAlign('center,left,center,left,right,left,left,left');
        SubgridNotas.setNumberFormat('0,000.00',4);
        SubgridNotas.init();
    SubgridNotas.load('/api/CR0100/notas-credito-debito/' + usrJson.empresa + '/' + documento, SubgridNotasOnLoad);
    SubgridNotas.attachEvent('onRowSelect', SubgridNotasOnRowSelect);
}

//llamadas ws
CargaCuentaCorriente = async () => {
    let fInicio = ToolbarCtacte.getValue('fechaDesde');
    let fFin = ToolbarCtacte.getValue('fechaHasta');
    LayoutCtacte.cells('b').setCollapsedText('<span style="color:#00796b;">Doble clic en un documento para cargar su información</span>');
    LayoutCtacte.cells('b').collapse();
    LayoutCtacte.cells('a').detachObject();
    GridCtacte = LayoutCtacte.cells('a').attachGrid();
        GridCtacte.setIconsPath('/assets/images/icons/grid/');
        GridCtacte.setHeader(',Fe.Registro,Nro.Pedido,,Fe.Vcto.,Nro.Documento,,Saldo,Egreso,Ingreso,,,Tp.Doc.,Vendedor,#cspan,T.C.,TD,Fe.Venc.Fact.,Concepto,Estado,Periodo,Moneda,Fza.Venta,#cspan,Recaudo,');
        GridCtacte.attachHeader('#rspan,#rspan,#text_filter,#rspan,#rspan,#text_filter,#rspan,#numeric_filter,#numeric_filter,#numeric_filter,#rspan,#rspan,#select_filter,#text_filter,#text_filter,#numeric_filter,#select_filter,#rspan,#text_filter,#select_filter,#select_filter,#select_filter,#rspan,#select_filter,#rspan,#rspan');
        GridCtacte.setInitWidths('20,80,90,20,80,90,20,100,100,100,25,25,60,90,240,60,60,80,120,90,80,100,40,160,40,0');
        GridCtacte.setColTypes('img,rotxt,rotxt,img,rotxt,rotxt,img,ron,ron,ron,img,img,rotxt,ron,rotxt,ron,rotxt,rotxt,rotxt,rotxt,ron,rotxt,rotxt,rotxt,rotxt,rotxt');
        GridCtacte.setColAlign('center,left,left,center,left,left,center,right,right,right,center,center,left,right,left,right,left,left,left,center,left,left,right,left,center,left');
        GridCtacte.setNumberFormat('0,000.00',7);
        GridCtacte.setNumberFormat('0,000.00',8);
        GridCtacte.setNumberFormat('0,000.00',9);
        GridCtacte.setNumberFormat('0.00',15);
        GridCtacte.init();
    GridCtacte.load('/api/CR0100/cuenta-corriente/' + usrJson.empresa + '/' + ClienteRes.codigo + '/' + encodeURIComponent(fInicio) + '/' + encodeURIComponent(fFin), GridCtacteOnLoad);
    //GridCtacte.attachEvent('onRowDblClicked', GridCtacteOnRowDblClicked);
    GridCtacte.attachEvent('onRowSelect', GridCtacteOnRowSelect);
}
GridCtacteOnRowSelect = async (rowId,colId) => {
    switch(colId) {
        case 3:
            break;
        case 6:
            let codigo = GridCtacte.cells(rowId,5).getValue();
            let empresa = usrJson.empresa;
            WinDocumentoViewer = WinContainer.createWindow('WinDocumentoViewer', 0, 0, 640, 640);
                WinDocumentoViewer.center();
                WinDocumentoViewer.keepInViewport();
                WinDocumentoViewer.setText('Mostrando documento ' + codigo);
                WinDocumentoViewer.attachURL('/viewer/archivo/' + empresa + '/' + codigo);
            break;
        case 10:
            LayoutCtacte.cells('b').detachObject();
            if(LayoutCtacte.cells('b').isCollapsed()) LayoutCtacte.cells('b').expand();
            LayoutCtacteSec = LayoutCtacte.cells('b').attachLayout('3E');
            LayoutCtacteSec.cells('a').setText('Planillas de cobranza');
            LayoutCtacteSec.cells('b').setText('Letras/Cheques');
            LayoutCtacteSec.cells('c').setText('Notas de crédito/débito');
            //genera las grids
            let documento = GridCtacte.cells(rowId,5).getValue();
            let moneda = GridCtacte.cells(rowId,23).getValue();
            EscribirSubgridPlanillas(documento,moneda);
            EscribirSubgridLetras(documento);
            EscribirSubgridNotas(documento);
            break;
        case 11:
            let cCliente = ClienteRes.codigo;
            let cVendedor = GridCtacte.cells(rowId,13).getValue();
            let nMeses = 6;
            let FzaVta = GridCtacte.cells(rowId,22).getValue();
            let nCliente = ClienteRes.rsocial;
            let lc = await AsignarLineaCreditoCliente(WinContainer,cCliente,cVendedor,nMeses,FzaVta);
            if(lc && lc.result == 'S') {
                dhtmlx.alert({
                    title: 'Asignar línea de crédito',
                    ok: 'Entendido',
                    text: 'Se asignó la línea de crédito al cliente <b>' + nCliente + '</b>'
                });
            }
            break;
        default: break;
    }
}
CargarDatosAuditoriaVendedor = () => {
    let minimo = ToolbarAuditoria.getValue('auditoriaMinimo');
    LayoutAuditoria.cells('a').detachObject();
    GridAuditoria = LayoutAuditoria.cells('a').attachGrid();
        GridAuditoria.setIconsPath('/assets/images/icons/grid/');
        GridAuditoria.setHeader('¿Auditoría?,Fecha registro,Tipo doc. administrativo,Documento,RUC/DNI,Cliente,,Saldo,Saldo auditoría,Observaciones,Diferencia,Usuario autoriza,Fecha auditoría,');
        GridAuditoria.attachHeader('#rspan,#text_filter,#select_filter,#text_filter,#text_filter,#text_filter,#rspan,#numeric_filter,#numeric_filter,#text_filter,#numeric_filter,#text_filter,#text_filter,#rspan');
        GridAuditoria.setInitWidths('60,80,100,90,90,240,30,100,100,160,100,240,90,0');
        GridAuditoria.setColTypes('ch,rotxt,rotxt,rotxt,rotxt,rotxt,img,ron,edn,ed,dyn,rotxt,rotxt,rotxt');
        GridAuditoria.setColAlign('center,left,left,left,left,left,center,right,right,left,right,left,left,left');
        GridAuditoria.setNumberFormat('0,000.00',7);
        GridAuditoria.setNumberFormat('0,000.00',8);
        GridAuditoria.setNumberFormat('0,000.00',10);
        GridAuditoria.setColumnHidden(13,true);
        GridAuditoria.init();
    LayoutAuditoria.cells('a').progressOn();
    GridAuditoria.load('/api/CR0100/auditoria-vendedor/' + usrJson.empresa + '/' + AuditoriaRes.codigo + '/' + (minimo == '' ? 0 : minimo), GridAuditoriaOnLoad);
    GridAuditoria.attachEvent('onRowSelect', GridAuditoriaOnRowSelect);
}
LimpiarFormularioContactos = () => {
    FormWinAuditoria.setItemLabel('titulo', '<span style="color:#0d47a1;">Registrar nuevo contacto</span>');
    FormWinAuditoria.setItemValue('diferenciador', '');
    FormWinAuditoria.setItemValue('modo', 'I');
    FormWinAuditoria.getCombo('tipo').setComboText('');
    FormWinAuditoria.getCombo('tipo').setComboValue('');
    FormWinAuditoria.setItemValue('numero', '');
    FormWinAuditoria.getCombo('estado').setComboText('Vigente');
    FormWinAuditoria.getCombo('estado').setComboValue('Vigente');
}
GeneraGraficoPeriodos = async () => {
    try {
        let result = await $.ajax({
            url: '/api/CR0100/movimientos-periodo',
            method: 'post',
            data: {
                cliente: ClienteRes.codigo,
                empresa: usrJson.empresa
            },
            dataType: 'json'
        });
        DatosMovimientosCliente = result.data.movimientos;
        RenderInicialGraficoMovimientos = true;
        //arma el gráfico
        PreparaGraficoMovimientosCliente();
    }
    catch(exception) {
        console.log(exception);
    }
}
PreparaGraficoMovimientosCliente = () => {
    let CantidadDatos = DatosMovimientosCliente.length;
    let ValorMinimoSlider, ValorMaximoSlider;
    if(RenderInicialGraficoMovimientos) {
        PeriodosMovimientosCliente = [];
        ValorMaximoSlider = CantidadDatos - 1;
        ValorMinimoSlider = ValorMaximoSlider - (ValorMaximoSlider >= 12 ? 12 : ValorMaximoSlider);
        //configura el slider
        SliderPeriodos = new dhtmlXSlider({
            parent: 'slider-periodos',
            step: 1,
            min: 0,
            max: ValorMaximoSlider,
            value: [ValorMinimoSlider, ValorMaximoSlider],
            range: true
        });
        SliderPeriodos.attachEvent('onSlideEnd', PreparaGraficoMovimientosCliente);
        SliderPeriodos.attachEvent('onChange', SliderPeriodosOnChange);
    }
    else {
        let values = SliderPeriodos.getValue();
        ValorMinimoSlider = values[0];
        ValorMaximoSlider = values[1];
    }
    let xCategorias = [];
    let MovimientosCompras = [];
    let MovimientosPagos = [];
    let MovimientosDeuda = [];
    let DeudaAcumulada = 0;
    for(let i = 0; i < CantidadDatos; i++) {
        let iDato = DatosMovimientosCliente[i];
            let ixCompra = parseFloat(iDato.compras);
            let ixPago = parseFloat(iDato.pagos);
            DeudaAcumulada = DeudaAcumulada + ixCompra - ixPago;
        if(RenderInicialGraficoMovimientos) {
            PeriodosMovimientosCliente.push({
                codigo: iDato.codigo,
                periodo: iDato.periodo
            });
        }
        if(ValorMinimoSlider <= i && i <= ValorMaximoSlider) {
            xCategorias.push(iDato.periodo);
            MovimientosCompras.push(ixCompra);
            MovimientosPagos.push(ixPago);
            MovimientosDeuda.push(DeudaAcumulada);
        }
    }
    ToolbarMovimientos.setItemText('movimientosPeriodoDesde', '<span class="span-label-movimiento-periodo span-label-right">' + PeriodosMovimientosCliente[ValorMinimoSlider].periodo + '</span>');
    ToolbarMovimientos.setItemText('movimientosPeriodoHasta', '<span class="span-label-movimiento-periodo span-label-left">' + PeriodosMovimientosCliente[ValorMaximoSlider].periodo + '</span>');
    RenderInicialGraficoMovimientos = false;
    $('#chart-periodos').highcharts({
        title: { text: 'Deuda del cliente' },
        xAxis: { categories: xCategorias },
        yAxis: {
            title: { text: 'Importe (S/)' },
            labels: { formatter: function () { return this.value; } }
        },
        tooltip: { formatter: function () { return '<b>' + this.series.name + '</b><br/>' + this.x + ': S/ ' + this.y.toLocaleString('en-us',{minimumFractionDigits:2,maximumFractionDigits:2}); } },
        plotOptions: {
            area: {
                fillOpacity: 0.5,
                point: {
                    events: {
                        click: (event) => {
                            LayoutWinCtacte.cells('b').detachObject();
                            GridMovimientosCompras = LayoutWinCtacte.cells('b').attachGrid();
                                GridMovimientosCompras.setHeader('Documento,Fecha,Concepto,Importe,Deuda');
                                GridMovimientosCompras.setInitWidthsP('15,15,40,15,15');
                                GridMovimientosCompras.setColTypes('rotxt,rotxt,rotxt,ron,dyn');
                                GridMovimientosCompras.setColAlign('left,left,left,right,right');
                                GridMovimientosCompras.setNumberFormat('0,000.00',3);
                                GridMovimientosCompras.setNumberFormat('0,000.00',4);
                                GridMovimientosCompras.init();
                                LayoutWinCtacte.cells('b').progressOn();
                                GridMovimientosCompras.load('/api/CR0100/compras-cliente-periodo/' + ClienteRes.codigo + '/' + event.point.category + '/' + usrJson.empresa, GridMovimientosComprasOnLoad);
                            LayoutWinCtacte.cells('c').detachObject();
                            GridMovimientosPagos = LayoutWinCtacte.cells('c').attachGrid();
                                GridMovimientosPagos.setHeader('Documento,Planilla,Fecha,Importe,Tipo');
                                GridMovimientosPagos.setInitWidthsP('15,15,15,25,30');
                                GridMovimientosPagos.setColTypes('rotxt,rotxt,rotxt,ron,rotxt');
                                GridMovimientosPagos.setColAlign('left,left,left,right,left');
                                GridMovimientosPagos.setNumberFormat('0,000.00',3);
                                GridMovimientosPagos.init();
                                GridMovimientosPagos.load('/api/CR0100/pagos-cliente-periodo/' + ClienteRes.codigo + '/' + event.point.category + '/' + usrJson.empresa);
                        }
                    }
                }
            }
        },
        credits: { enabled: false },
        series: [
            { name: 'Deuda acumulada', type: 'area', data: MovimientosDeuda },
            { name: 'Compras', type: 'column', data: MovimientosCompras },
            { name: 'Pagos', type: 'column', data: MovimientosPagos }
        ]
    });
}
//eventos
ToolbarCtacteOnClick = async (id) => {
    switch(id) {
        case 'alternaPanel':
            if(LayoutCtacte.cells('b').isCollapsed()) {
                LayoutCtacte.cells('b').expand();
                LayoutCtacte.cells('b').setWidth(480);
            }
            else {
                LayoutCtacte.cells('b').collapse();
            }
            break;
        case 'clienteRecarga':
            CargaCuentaCorriente();
            break;
        case 'clienteBusca':
            let output = await IniciarGridBusqueda(14, false, Layout);
            if(output) {
                ClienteRes = output.seleccion[0];
                ToolbarCtacte.setValue('clienteRuc', ClienteRes.codigo);
                ToolbarCtacte.setValue('clienteNombre', ClienteRes.rsocial);
                ToolbarCtacte.enableItem('clienteRecarga');
                ToolbarCtacte.enableItem('letras');
                ToolbarCtacte.enableItem('cheques');
                ToolbarCtacte.enableItem('credito');
                ToolbarCtacte.enableItem('graficos');
                CargaCuentaCorriente();
                if(ClienteRes.corporativo == 'N') {
                    ToolbarCtacte.setItemState('clienteCorporativo', false);
                    ToolbarCtacte.setItemImage('clienteCorporativo','ic-check-dis.svg');
                    ToolbarCtacte.setItemText('clienteCorporativo','<span style="color:#f44336;">Cliente corporativo</span>');
                }
                else {
                    ToolbarCtacte.setItemState('clienteCorporativo', true);
                    ToolbarCtacte.setItemImage('clienteCorporativo','ic-check.svg');
                    ToolbarCtacte.setItemText('clienteCorporativo','<span style="color:#388e3c;">Cliente corporativo</span>');
                }
            }
            break;
        case 'letras':
            let fInicio = ToolbarCtacte.getValue('fechaDesde');
            let fFin = ToolbarCtacte.getValue('fechaHasta');
            if(WinContainer.isWindow('WinCtacte')) {
                WinContainer.bringToTop();
                WinContainer.detachObject();
            }
            else {
                WinCtacte = WinContainer.createWindow('WinCtacte', 0, 0, 1080, 640);
            }
            WinCtacte.center();
            WinCtacte.setModal(true);
            WinCtacte.setText('Letras del cliente');
            SubgridWinCtacteL = WinCtacte.attachGrid();
                SubgridWinCtacteL.setIconsPath('/assets/images/icons/grid/');
                SubgridWinCtacteL.setHeader('Co.Letra,Documento,Moneda,Importes,#cspan,#cspan,Fe.Vence,Nro.Único,Nro. Control Banco,Cod.Banco,Fe.Giro,Cod.Garante,Estado,RUC/DNI,Cond. Pago Letra,Caja,Cod. Estado Letra,Cod.Recaudador,Cod.Usuario,Cod.Representante,Cod. Cargo Representante,Fe.Presentación,Fe.Depósito,Fe.Registro,Vigencia,Cod. Letra Banco,Aprobada,Cod.País,Nro.Descargos,Cod.Empresa,Selección,Centro Costo,Planilla,Cod.Moneda,Cod.Conversión,Moneda Referida,Periodo,Cod. Centro Costo Gasto,Consolidado documento,Impreso,Nro.Impresiones,Fe.Abono,Cod.Digitalización,Cod.Control,Motivo rechazo,Nro. Depósito Letra,Motivo Protesto,Fe.Protesto,Cod. Categ. Ingreso Gasto,Cod. Ingreso Gasto,Im. Gastos Bancarios,Nro.Depósito,Fe. Depósito Protesto,Nro. Depósito Protesto,Imp. Depósito Protesto,Fe.Anulación,Fe.Cancelación');
                SubgridWinCtacteL.attachHeader('#rspan,#rspan,#rspan,Monto,Subtotal,Saldo,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan');
                SubgridWinCtacteL.setInitWidths('80,90,80,100,100,100,80,30,80,60,80,60,120,90,60,60,80,90,90,90,60,80,80,80,90,60,30,60,60,60,30,60,90,60,60,60,80,60,120,30,60,80,60,80,100,60,160,80,60,60,100,60,80,60,100,80,80');
                SubgridWinCtacteL.setColTypes('rotxt,rotxt,rotxt,ron,ron,ron,rotxt,img,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,img,rotxt,ron,rotxt,img,rotxt,rotxt,rotxt,rotxt,rotxt,ron,rotxt,rotxt,img,ron,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,ron,ron,rotxt,rotxt,ron,rotxt,rotxt');
                SubgridWinCtacteL.setColAlign('left,left,left,right,right,right,left,center,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,center,left,right,left,center,left,left,left,left,left,right,left,left,center,right,left,left,left,left,left,left,left,left,left,right,right,left,left,right,left,left');
                SubgridWinCtacteL.setNumberFormat('0,000.00',3);
                SubgridWinCtacteL.setNumberFormat('0,000.00',4);
                SubgridWinCtacteL.setNumberFormat('0,000.00',5);
                SubgridWinCtacteL.setNumberFormat('0,000.00',50);
                SubgridWinCtacteL.setNumberFormat('0,000.00',54);
                SubgridWinCtacteL.init();
            SubgridWinCtacteL.load('/api/CR0100/lista-letras/' + usrJson.empresa + '/' + ClienteRes.codigo + '/' + encodeURIComponent(fInicio) + '/' + encodeURIComponent(fFin));
            break;
        case 'cheques':
            if(WinContainer.isWindow('WinCtacte')) {
                WinContainer.bringToTop();
                WinContainer.detachObject();
            }
            else {
                WinCtacte = WinContainer.createWindow('WinCtacte', 0, 0, 1080, 640);
            }
            WinCtacte.center();
            WinCtacte.setModal(true);
            WinCtacte.setText('Cheques del cliente');
            SubgridWinCtacteL = WinCtacte.attachGrid();
                SubgridWinCtacteL.setIconsPath('/assets/images/icons/grid/');
                SubgridWinCtacteL.setHeader('Número Cheque,Recaudador,#cspan,Moneda,Importe,Saldo,Banco,Estado,Periodo,Fecha Presentacion,Documentos relacionados,Fecha Depósito,Número Voucher,Código Planilla,Caja,Estado Cheque');
                //SubgridWinCtacteL.attachHeader('#rspan,#rspan,#rspan,Monto,Subtotal,Saldo,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan');
                SubgridWinCtacteL.setInitWidths('75,80,240,100,100,100,160,120,60,90,240,90,80,90,60,60');
                SubgridWinCtacteL.setColTypes('rotxt,rotxt,rotxt,rotxt,ron,ron,rotxt,rotxt,ron,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt');
                SubgridWinCtacteL.setColAlign('left,right,left,left,right,right,left,left,right,left,left,left,left,left,right,right');
                SubgridWinCtacteL.setNumberFormat('0,000.00',4);
                SubgridWinCtacteL.setNumberFormat('0,000.00',5);
                SubgridWinCtacteL.init();
            SubgridWinCtacteL.load('/api/CR0100/lista-cheques/' + usrJson.empresa + '/' + ClienteRes.codigo);
            //createWindow
            break;
        case 'credito':
            let fcInicio = ToolbarCtacte.getValue('fechaDesde');
            let fcFin = ToolbarCtacte.getValue('fechaHasta');
            if(WinContainer.isWindow('WinCtacte')) {
                WinContainer.bringToTop();
                WinContainer.detachObject();
            }
            else {
                WinCtacte = WinContainer.createWindow('WinCtacte', 0, 0, 1080, 640);
            }
            WinCtacte.center();
            WinCtacte.setModal(true);
            WinCtacte.setText('Crédito de clientes');
            TabbarLayoutCtacte = WinCtacte.attachTabbar();
                TabbarLayoutCtacte.addTab('solcred', 'Solicitudes de crédito', null, null, true);
                TabbarLayoutCtacte.addTab('lineacred', 'Línea de crédito');
            //tabbar solicitudes de credito
            SubgridWinCtacteL = TabbarLayoutCtacte.tabs('solcred').attachGrid();
                SubgridWinCtacteL.setIconsPath('/assets/images/icons/grid/');
                SubgridWinCtacteL.setHeader('Cliente,#cspan,Fuerza Venta,Moneda,Importe solicitado,Importe aprobado,Fecha solicitud,Vigencia,Usuario,Fecha vigencia crédito,Observaciones vendedor,Observaciones propias,Usuario autoriza,Código fuerza de venta,Fecha autoriza crédito,Código moneda,Código empresa,Código centro costo');
                SubgridWinCtacteL.attachHeader('#select_filter,#select_filter,#select_filter,#select_filter,#numeric_filter,#numeric_filter,#text_filter,#select_filter,#select_filter,#text_filter,#text_filter,#text_filter,#select_filter,#select_filter,#text_filter,#select_filter,#select_filter,#select_filter');
                SubgridWinCtacteL.setInitWidths('80,240,120,100,100,100,90,80,100,90,240,240,90,60,90,60,60,60');
                SubgridWinCtacteL.setColTypes('rotxt,rotxt,rotxt,rotxt,ron,ron,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt');
                SubgridWinCtacteL.setColAlign('left,left,left,left,right,right,left,left,left,left,left,left,left,left,left,left,left,left');
                SubgridWinCtacteL.setNumberFormat('0,000.00',4);
                SubgridWinCtacteL.setNumberFormat('0,000.00',5);
                SubgridWinCtacteL.init();
            SubgridWinCtacteL.load('/api/CR0100/lista-solicitudes-credito/' + usrJson.empresa + '/' + ClienteRes.codigo + '/' + encodeURIComponent(fcInicio) + '/' + encodeURIComponent(fcFin));
            //tabbar linea de credito
            ToolbarWinCtacte = TabbarLayoutCtacte.tabs('lineacred').attachToolbar();
                ToolbarWinCtacte.setIconsPath('/assets/images/icons/toolbar/');
                ToolbarWinCtacte.addButton('masivo', null,'Asignar crédito masivo', 'ic-credito-masivo.svg', '');
                //ToolbarWinCtacte.addButton('credfzavta', null,'Asignar crédito por cliente y fuerza de venta', 'ic-credito-fzavta.svg', '');
                ToolbarWinCtacte.attachEvent('onClick', ToolbarWinCtacteOnClick);
            SubgridWinCtacteR = TabbarLayoutCtacte.tabs('lineacred').attachGrid();
                SubgridWinCtacteR.setIconsPath('/assets/images/icons/grid/');
                SubgridWinCtacteR.setHeader('Cliente,#cspan,Fuerza venta,Moneda,Importe solicitado,Importe aprobado,Es permanente,Fecha registro,Fecha aprobación crédito,Fecha asignación,Vigencia,Observaciones autorizador,Observaciones solicitante');
                SubgridWinCtacteR.setInitWidths('90,240,120,100,100,100,30,90,90,90,80,200,200');
                SubgridWinCtacteR.setColTypes('rotxt,rotxt,rotxt,rotxt,ron,ron,img,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt');
                SubgridWinCtacteR.setColAlign('left,left,left,left,right,right,center,left,left,left,left,left,left');
                SubgridWinCtacteR.setNumberFormat('0,000.00',4);
                SubgridWinCtacteR.setNumberFormat('0,000.00',5);
                SubgridWinCtacteR.init();
            SubgridWinCtacteR.load('/api/CR0100/lista-linea-credito/' + usrJson.empresa + '/' + ClienteRes.codigo);
            break;
        case 'graficos':
            if(WinContainer.isWindow('WinCtacte')) {
                WinContainer.bringToTop();
                WinContainer.detachObject();
            }
            else {
                WinCtacte = WinContainer.createWindow('WinCtacte', 0, 0, 1080, 640);
            }
            WinCtacte.center();
            WinCtacte.setModal(true);
            WinCtacte.setText('Deuda del cliente por periodos');
            LayoutWinCtacte = WinCtacte.attachLayout('3T');
                LayoutWinCtacte.cells('a').hideHeader();
                LayoutWinCtacte.cells('a').setHeight(340);
                LayoutWinCtacte.cells('b').setText('Compras del periodo');
                LayoutWinCtacte.cells('c').setText('Pagos del periodo');
                LayoutWinCtacte.cells('a').attachHTMLString('<div id="chart-periodos" class="chart-div"></div>');
            ToolbarMovimientos = LayoutWinCtacte.attachToolbar();
                ToolbarMovimientos.addText('movimientosLabel', null, 'Visualizar periodos');
                ToolbarMovimientos.addText('movimientosPeriodoDesde', null, '');
                ToolbarMovimientos.addText('movimientosRange', null, '<div id="slider-periodos" class="dv-slider"></div>');
                ToolbarMovimientos.addText('movimientosPeriodoHasta', null, '');
            GeneraGraficoPeriodos();
            break;
        default: break;
    }
}
ToolbarCtacteOnBeforeStateChange = (id) => {
    return false;
}
GridCtacteOnLoad = () => {
    let num = GridCtacte.getRowsNum();
    for(let i = 0; i < num; i++) {
        let iRowId = GridCtacte.getRowId(i);
        if(parseFloat(GridCtacte.cells2(i,7).getValue()) > 0.01) {
            GridCtacte.setCellTextStyle(iRowId,7,'background-color:#ffebee;color:#d32f2f;');
        }
        GridCtacte.setCellTextStyle(iRowId,3,'cursor:pointer;');
        GridCtacte.setCellTextStyle(iRowId,6,'cursor:pointer;');
        GridCtacte.setCellTextStyle(iRowId,10,'cursor:pointer;');
        GridCtacte.setCellTextStyle(iRowId,11,'cursor:pointer;');
    }
    LayoutCtacte.cells('a').progressOff();
}
ToolbarWinCtacteOnClick = async (id) => {
    switch(id) {
        case 'masivo':
            let out = await IniciarFormularioSeguridad(112, Layout);
            if(out && out.result == 'S') {
                dhtmlx.confirm({
                    title: 'Confirmar acción',
                    ok: 'Si, continuar',
                    cancel: 'No',
                    text: '¿Está seguro de asignar crédito de forma masiva?',
                    callback: async () => {
                        let result;
                        try {
                            result = await $.ajax({
                                url: '/api/CR0100/credito-masivo',
                                method: 'post',
                                data: { alias: usrJson.alias },
                                dataType: 'json'
                            });
                            dhtmlx.alert('Operación completada');
                        }
                        catch(error) {
                            console.log(error);
                        }
                    }
                });
            }
            else console.log('fue p...');
            break;
        case 'credfzavta':
            WinCtacteSec = WinContainer.createWindow('WinCtacteSec', 0, 0, 480, 480);
                WinCtacteSec.setText('Asignar línea de crédito al cliente');
                WinCtacteSec.center();
                WinCtacteSec.bringToTop();
                WinCtacteSec.setModal(true);
            FormWinCtacte = WinCtacteSec.attachForm();
                FormWinCtacte.loadStruct(structs.FormAsignaLineaCred);
                FormWinCtacte.setItemValue('uautoriza', usrJson.nombre);
                FormWinCtacte.setItemValue('rucdni', ClienteRes.codigo);
                FormWinCtacte.setItemValue('nombre', ClienteRes.rsocial);
            break;
        default: break;
    }
}
ToolbarTransferenciaOrigenOnClick = async (id) => {
    switch(id) {
        case 'origenBusca':
            let output = await IniciarGridBusqueda(2, false, Layout);
            if(output) {
                TransferenciaRes = output.seleccion[0];
                ToolbarTransferenciaOrigen.setValue('origenRuc', TransferenciaRes.codigo);
                ToolbarTransferenciaOrigen.setValue('origenNombre', TransferenciaRes.nombre);
                GridTransferenciaOrigen = LayoutTransferenciaDocumentos.cells('a').attachGrid();
                    GridTransferenciaOrigen.setHeader(',Tipo documento,Código documento,Moneda,Saldo,Importe,RUC/DNI,Cliente,');
                    GridTransferenciaOrigen.attachHeader('#rspan,#text_filter,#text_filter,#select_filter,#numeric_filter,#numeric_filter,#text_filter,#text_filter,#rspan');
                    GridTransferenciaOrigen.setInitWidths('20,80,80,50,90,90,90,240,0');
                    GridTransferenciaOrigen.setColTypes('ch,rotxt,rotxt,rotxt,ron,ron,rotxt,rotxt,rotxt');
                    GridTransferenciaOrigen.setColAlign('center,left,left,left,right,right,right,left,left');
                    GridTransferenciaOrigen.setNumberFormat('0,000.00',4);
                    GridTransferenciaOrigen.setNumberFormat('0,000.00',5);
                    GridTransferenciaOrigen.setColumnHidden(8,true);
                    GridTransferenciaOrigen.init();
                    GridTransferenciaOrigen.load('/api/CR0100/dcumentos-transferencia/' + usrJson.empresa + '/' + TransferenciaRes.codigo);
            }
            break;
        case 'origenTransfiere':
            if(TransferenciaRes == null) {
                dhtmlx.alert({
                    title: 'No se puede transferir',
                    type: 'alert-error',
                    text: 'Para realizar la transferencia, debe buscar un vendedor y seleccionar al menos uno de sus documentos para transferir'
                });
                return;
            }
            if(DestinatarioRes == null) {
                dhtmlx.alert({
                    title: 'No se puede transferir',
                    type: 'alert-error',
                    text: 'Para continuar, deberá seleccionar un vendedor destino'
                });
                return;
            }
            if(TransferenciaRes.codigo == DestinatarioRes.codigo) {
                dhtmlx.alert({
                    title: 'No se puede transferir',
                    type: 'alert-error',
                    text: 'El vendedor destino no puede ser el mismo que el vendedor origen'
                });
                return;
            }
            //verifica que hayan documentos seleccionados
            let rows = GridTransferenciaOrigen.getCheckedRows(0);
            if(rows == '') {
                dhtmlx.alert({
                    title: 'No se puede transferir',
                    type: 'alert-error',
                    text: 'Seleccione al menos un documento para realizar la transferencia'
                });
                return;
            }
            let out = await IniciarFormularioSeguridad(105, Layout);
            if(out && out.result == 'S') {
                //vao!
                dhtmlx.confirm({
                    title: 'Transferencia de documentos',
                    ok: 'Si, continuar',
                    cancel: 'No',
                    text: '¿Transferir los documentos al vendedor ' + DestinatarioRes.nombre + '?',
                    callback: async (option) => {
                        let string = '';
                        let separadorPalabra = '@*@';
                        let separadorLinea = '@-@';
                        if(option) {
                            let ids = rows.split(',');
                            let cantidadIds = ids.length;
                            for(let i = 0; i < cantidadIds; i++) {
                                let iRowId = ids[i];
                                let substring = GridTransferenciaOrigen.cells(iRowId,2).getValue() + separadorPalabra + GridTransferenciaOrigen.cells(iRowId,6).getValue() + separadorPalabra + GridTransferenciaOrigen.cells(iRowId,8).getValue();
                                string += substring + separadorLinea
                            }
                            let result;
                            try {
                                result = await $.ajax({
                                    url: '/api/CR0100/transferencia-documentos',
                                    method: 'post',
                                    data: {
                                        vendedor: TransferenciaRes.codigo,
                                        cadena: string,
                                        cantidad: cantidadIds
                                    },
                                    dataType: 'json'
                                });
                                if(result.state == 'success') {
                                    dhtmlx.alert({
                                        title: 'Transferencia de documentos',
                                        text: 'Se completó la transferencia de ' + cantidadIds + ' documento(s)'
                                    });
                                }
                                else {
                                    dhtmlx.alert({
                                        title: 'Transferencia de documentos',
                                        type: 'alert-error',
                                        text: result.message
                                    });
                                }
                            }
                            catch(exception) {
                                console.log(exception);
                            }
                        }
                    }
                });
            }
            break;
        default: break;
    }
}
ToolbarTransferenciaDestinoOnClick = async (id) => {
    switch(id) {
        case 'destinoBusca':
            let output = await IniciarGridBusqueda(2, false, Layout);
            if(output) {
                DestinatarioRes = output.seleccion[0];
                ToolbarTransferenciaDestino.setValue('destinoRuc', DestinatarioRes.codigo);
                ToolbarTransferenciaDestino.setValue('destinoNombre', DestinatarioRes.nombre);
                GridTransferenciaDestino = LayoutTransferenciaDocumentos.cells('b').attachGrid();
                    GridTransferenciaDestino.setHeader(',Tipo documento,Código documento,Moneda,Saldo,Importe,RUC/DNI,Cliente,');
                    GridTransferenciaDestino.attachHeader('#rspan,#text_filter,#text_filter,#select_filter,#numeric_filter,#numeric_filter,#text_filter,#text_filter,#rspan');
                    GridTransferenciaDestino.setInitWidths('20,80,80,50,90,90,90,240,0');
                    GridTransferenciaDestino.setColTypes('ch,rotxt,rotxt,rotxt,ron,ron,rotxt,rotxt,rotxt');
                    GridTransferenciaDestino.setColAlign('center,left,left,left,right,right,right,left,left');
                    GridTransferenciaDestino.setNumberFormat('0,000.00',4);
                    GridTransferenciaDestino.setNumberFormat('0,000.00',5);
                    GridTransferenciaDestino.setColumnHidden(8,true);
                    GridTransferenciaDestino.init();
                    GridTransferenciaDestino.load('/api/CR0100/dcumentos-transferencia/' + usrJson.empresa + '/' + TransferenciaRes.codigo);
            }
            break;
        default: break;
    }
}
ToolbarAuditoriaOnClick = async (id) => {
    switch(id) {
        case 'auditoriaBusca':
            let output = await IniciarGridBusqueda(2, false, Layout);
            if(output) {
                AuditoriaRes = output.seleccion[0];
                ToolbarAuditoria.setValue('auditoriaRuc', AuditoriaRes.codigo);
                ToolbarAuditoria.setValue('auditoriaNombre', AuditoriaRes.nombre);
                CargarDatosAuditoriaVendedor();
            }
            break;
        case 'auditoriaCargar':
            CargarDatosAuditoriaVendedor();
            break;
        case 'auditoriaPermisos':
            let out = await IniciarFormularioSeguridad(106, Layout);
            if(out && out.result == 'S') {
                ToolbarAuditoria.enableItem('auditoriaConfirma');
                ToolbarAuditoria.enableItem('auditoriaGuardar');
                ToolbarAuditoria.enableItem('auditoriaExportar');
            }
            break;
        case 'auditoriaConfirma':
            let numFilas = GridAuditoria.getRowsNum();
            let toInsert = [];
            for(let i = 0; i < numFilas; i++) {
                let iObservacion = GridAuditoria.cells2(i,9).getValue();
                let iCliente = GridAuditoria.cells2(i,4).getValue();
                toInsert.push({cliente: iCliente, observacion: iObservacion});
            }
            try {
                let out = await $.ajax({
                    url: '/api/CR0100/confirmar-auditoria',
                    method: 'post',
                    data: {
                        empresa: usrJson.empresa,
                        vendedor: AuditoriaRes.codigo,
                        clientes: toInsert,
                        filas: numFilas
                    },
                    dataType: 'json'
                });
                if(out.state == 'success') {
                    dhtmlx.alert({
                        title: 'Operación completada',
                        text: 'Se guardaron los datos de la auditoría'
                    });
                }
                else {
                    dhtmlx.alert({
                        title: 'No se pudo completar la operación',
                        type: 'alert-error',
                        text: out.message
                    });
                }
            }
            catch(exception) {
                console.log(exception);
            }
            break;
        case 'auditoriaGuardar':
            dhtmlx.confirm({
                title: 'Confirmar acción',
                ok: 'Si, continuar',
                cancel: 'No',
                text: '¿Desea guardar la auditoría y comenzar una nueva?',
                callback: async (option) => {
                    if(option) {
                        let toRead = [];
                        let numRead = 0;
                        let numFilas = GridAuditoria.getRowsNum();
                        for(let i = 0; i < numFilas; i++) {
                            let iAuditoria = GridAuditoria.cells2(i,0).getValue();
                            if(iAuditoria == '1') {
                                toRead.push({
                                    observaciones: GridAuditoria.cells2(i,9).getValue(),
                                    cliente: GridAuditoria.cells2(i,4).getValue(),
                                    moneda: GridAuditoria.cells2(i,13).getValue(),
                                    documento: GridAuditoria.cells2(i,3).getValue(),
                                    saldo: GridAuditoria.cells2(i,7).getValue(),
                                    sauditoria: GridAuditoria.cells2(i,8).getValue(),
                                    fauditoria: GridAuditoria.cells2(i,12).getValue()
                                });
                                numRead++;
                            }
                        }
                        let result;
                        try {
                            result = await $.ajax({
                                url: '/api/CR0100/cerrar-auditoria',
                                method: 'post',
                                data: {
                                    empresa: usrJson.empresa,
                                    vendedor: AuditoriaRes.codigo,
                                    monto: ToolbarAuditoria.getValue('auditoriaMinimo'),
                                    usuario: usrJson.codigo,
                                    filas: toRead,
                                    cantidad: numRead
                                },
                                dataType: 'json'
                            });
                            if(result.state == 'success') {
                                dhtmlx.alert({
                                    title: 'Operación completada',
                                    text: 'Auditoría de documentos grabada correctamente'
                                });
                            }
                            else {
                                dhtmlx.alert({
                                    title: 'No se puede completar la operacion',
                                    type: 'alert-error',
                                    text: result.message
                                });
                            }
                        }
                        catch(exception) {
                            console.log(exception);
                        }
                    }
                }
            });
            break;
        default: break;
    }
}
GridAuditoriaOnLoad = () => {
    let numFilas = GridAuditoria.getRowsNum();
    for(let i = 0; i < numFilas; i++) {
        let iRowId = GridAuditoria.getRowId(i);
        if(GridAuditoria.cells(iRowId,0).getValue() == '1') {
            GridAuditoria.cells(iRowId,8).setBgColor('#e8f5e9');
        }
        else {
            GridAuditoria.cells(iRowId,8).setBgColor('#ffebee');
        }
        GridAuditoria.cells(iRowId,0).setDisabled(true);
        GridAuditoria.setCellTextStyle(iRowId,6,'cursor:pointer;');
        GridAuditoria.setCellTextStyle(iRowId,8,'cursor:text;');
        GridAuditoria.setCellTextStyle(iRowId,9,'cursor:text;');
    }
    LayoutAuditoria.cells('a').progressOff();
}
GridAuditoriaOnRowSelect = (rowId, colId) => {
    switch(colId) {
        case 0:
            return false;
        case 6:
            let cliente = GridAuditoria.cells(rowId,4).getValue();
            WinAuditoria = WinContainer.createWindow('WinAuditoria',0,0,720,320);
                WinAuditoria.center();
                WinAuditoria.setText('Información de contacto')
                WinAuditoria.setModal(true);
            LayoutWinAuditoria = WinAuditoria.attachLayout('2U');
                LayoutWinAuditoria.cells('a').hideHeader();
                LayoutWinAuditoria.cells('b').hideHeader();
            GridWinAuditoria = LayoutWinAuditoria.cells('a').attachGrid();
                GridWinAuditoria.setIconsPath('/assets/images/icons/grid/');
                GridWinAuditoria.setHeader(',Tipo comunicación,Número,Estado,,,');
                GridWinAuditoria.setInitWidthsP('8,30,45,17,0,0,0');
                GridWinAuditoria.setColTypes('img,ron,ron,ron,ron,ron,ron');
                GridWinAuditoria.setColAlign('center,left,left,left,left,left,left');
                GridWinAuditoria.init();
                GridWinAuditoria.load('/api/CR0100/lista-contactos-cliente/' + cliente);
                GridWinAuditoria.attachEvent('onRowSelect', GridWinAuditoriaOnRowSelect);
            FormWinAuditoria = LayoutWinAuditoria.cells('b').attachForm();
                FormWinAuditoria.loadStruct(structs.FormAuditoriaContacto);
                FormWinAuditoria.attachEvent('onButtonClick', FormWinAuditoriaOnButtonClick);
                FormWinAuditoria.setItemValue('cliente', cliente);
            break;
    }
}
GridWinAuditoriaOnRowSelect = (rowId,colId) => {
    if(colId == 0) {
        FormWinAuditoria.setItemLabel('titulo', '<span style="color:#009688;">Editar datos de contacto</span>');
        FormWinAuditoria.setItemValue('diferenciador', GridWinAuditoria.cells(rowId,5).getValue());
        FormWinAuditoria.setItemValue('modo', 'U');
        FormWinAuditoria.getCombo('tipo').setComboText(GridWinAuditoria.cells(rowId,1).getValue());
        FormWinAuditoria.getCombo('tipo').setComboValue(GridWinAuditoria.cells(rowId,6).getValue());
        FormWinAuditoria.setItemValue('numero', GridWinAuditoria.cells(rowId,2).getValue());
        FormWinAuditoria.getCombo('estado').setComboText(GridWinAuditoria.cells(rowId,3).getValue());
        FormWinAuditoria.getCombo('estado').setComboValue(GridWinAuditoria.cells(rowId,3).getValue());
    }
}
FormWinAuditoriaOnButtonClick = async (id) => {
    switch(id) {
        case 'limpiar':
            LimpiarFormularioContactos();
            break;
        case 'guardar':
            let result;
            try {
                result = await $.ajax({
                    url: '/api/CR0100/guardar-datos-contacto',
                    method: 'post',
                    data: {
                        modo: FormWinAuditoria.getItemValue('modo'),
                        cliente: FormWinAuditoria.getItemValue('cliente'),
                        diferenciador: FormWinAuditoria.getItemValue('diferenciador'),
                        tipo: FormWinAuditoria.getItemValue('tipo'),
                        numero: FormWinAuditoria.getItemValue('numero'),
                        estado: FormWinAuditoria.getItemValue('estado')
                    },
                    dataType: 'json'
                });
                if(result.state == 'success') {
                    dhtmlx.alert('Información del contacto actualizada');
                    GridWinAuditoria.clearAll();
                    GridWinAuditoria.load('/api/CR0100/lista-contactos-cliente/' + FormWinAuditoria.getItemValue('cliente'));
                    LimpiarFormularioContactos();
                }
            }
            catch(exception) {
                console.log(exception);
            }
            break;
        default: break;
    }
}
GridMovimientosComprasOnLoad = () => {
    let CantidadFilas = GridMovimientosCompras.getRowsNum();
    for(let i = 0; i < CantidadFilas; i++) {
        let iRowId = GridMovimientosCompras.getRowId(i);
        GridMovimientosCompras.setCellTextStyle(iRowId,0,'color:#1565c0;cursor:pointer;text-decoration:underline;');
    }
    LayoutWinCtacte.cells('b').progressOff();
}
SliderPeriodosOnChange = (args) => {
    let MinPeriodo = args[0];
    let MaxPeriodo = args[1];
    ToolbarMovimientos.setItemText('movimientosPeriodoDesde', '<span class="span-label-movimiento-periodo span-label-right">' + PeriodosMovimientosCliente[MinPeriodo].periodo + '</span>');
    ToolbarMovimientos.setItemText('movimientosPeriodoHasta', '<span class="span-label-movimiento-periodo span-label-left">' + PeriodosMovimientosCliente[MaxPeriodo].periodo + '</span>');
}
SubgridNotasOnLoad = () => {
    let CantidadNotas = SubgridNotas.getRowsNum();
    for(let i = 0; i < CantidadNotas; i++) {
        let iRowId = SubgridNotas.getRowId(i);
        SubgridNotas.setCellTextStyle(iRowId,2,'cursor:pointer;');
    }
}
SubgridNotasOnRowSelect = (rowId,colId) => {
    switch(colId) {
        case 2:
            if(WinContainer.isWindow('WinModificaNc')) {
                WinModificaNc.bringToTop();
            }
            else {
                WinModificaNc = WinContainer.createWindow('WinModificaNc',0,0,982,600);
                    WinModificaNc.keepInViewport();
                    WinModificaNc.center();
                    WinModificaNc.setModal(true);
                    WinModificaNc.setText('Nota de crédito');
                LayoutModificaNc = WinModificaNc.attachLayout('2E');
                    LayoutModificaNc.cells('a').hideHeader();
                    LayoutModificaNc.cells('b').setText('Modificar los importes de la nota de crédito');
                    LayoutModificaNc.cells('b').setHeight(230);
                GridModificaNc = LayoutModificaNc.cells('a').attachGrid();
                    GridModificaNc.setIconsPath('/assets/images/icons/grid/');
                    GridModificaNc.setHeader('Nota Crédito,Factura,Monto,Cliente,#cspan,Fecha,Importe,Moneda');
                    GridModificaNc.setInitWidths('80,80,100,90,320,80,100,80');
                    GridModificaNc.setColTypes('rotxt,rotxt,ron,rotxt,rotxt,rotxt,ron,rotxt');
                    GridModificaNc.setColAlign('left,left,right,right,left,left,right,left');
                    GridModificaNc.setNumberFormat('0,000.00',2);
                    GridModificaNc.setNumberFormat('0,000.00',6);
                    GridModificaNc.init();
                FormModificaNc = LayoutModificaNc.cells('b').attachForm();
                FormModificaNc.loadStruct(structs.FormModificaNc);
                //oliboli
            }
            break;
        default: break;
    }
}
