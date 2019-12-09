const PARSE_FLOAT_ERROR = 0.000001;
let connection;
let CodigoProducto, CodigoGlobalFrac, iCodigoProducto;
let Peso, PesoTara = 0, PesoMedido = 0;

const FormPesoStruct = [
    { type: 'container', name: 'divPeso', label: 'Peso', inputWidth: 320, inputHeight: 160, labelWidth: 60, offsetLeft: 20, offsetTop: 10 },
    { type: 'button', name: 'buttonGrabar', value: 'Grabar', offsetLeft: 80 }
];

ToolbarProductosOnClick = (id) => {
    switch (id) {
        case 'BuscaCodigo':
            BuscarCodigoBarras();
            break;
        default: break;
    }
}
ComboTarasOnChange = async (value, text) => {
    if (GridLotes && GridLotes.getSelectedRowId()) {
        HabilitarPeso();
    }
    document.getElementById('sp-peso').innerHTML = '(cargando...)';
    let result;
    try {
        result = await $.ajax({
            url: BASE_URL + URL_MODULO + '/peso-tara',
            method: 'post',
            data: { tara: value },
            dataType: 'json'
        });
        if (result.error) {
            console.error(result.error);
            return;
        }
        PesoTara = result.data.peso;
        document.getElementById('sp-peso').innerHTML = PesoTara.toLocaleString('en-us');
    }
    catch (err) {
        console.error(err);
    }
}
GridLotesOnRowSelect = (rowId, colId) => {
    if (ComboTaras.getSelectedValue() != '0') {
        HabilitarPeso();
    }
}
GridProductosOnRowSelect = (rowId, colId) => {
    LayoutPrincipal.cells('b').detachObject();
    let rDocumento = GridProductos.cells(rowId,3).getValue();
    let rTipodoc = GridProductos.cells(rowId,6).getValue();
    let rProducto = GridProductos.cells(rowId,1).getValue();
    GridLotes = LayoutPrincipal.cells('b').attachGrid();
        GridLotes.setIconsPath('/assets/images/icons/grid/');
        GridLotes.setImagesPath('/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/');
        GridLotes.setHeader('ID,Lote,Ubicacion,Unid.Medida,Peso');
        GridLotes.attachHeader('#numeric_filter,#text_filter,#text_filter,#select_filter,#rspan');
        GridLotes.setInitWidths('40,70,120,80,50');
        GridLotes.setColTypes('ron,rotxt,rotxt,rotxt,ron');
        GridLotes.setColAlign('right,left,left,left,right');
        GridLotes.init();
    LayoutPrincipal.cells('b').progressOn();
    GridLotes.load(BASE_URL + URL_MODULO + '/globales-fraccionamiento-lote/' + usrJson.empresa + '/' + usrJson.codigo + '/' + CodigoGlobalFrac + '/' + rDocumento + '/' + rTipodoc + '/' + rProducto, () => {
        LayoutPrincipal.cells('b').progressOff();
    });
    GridLotes.attachEvent('onRowSelect', GridLotesOnRowSelect);
}
FormPesoOnButtonClick = async (id) => {
    switch (id) {
        case 'buttonGrabar':
            let productosRowId = GridProductos.getSelectedRowId();
            let lotesRowId = GridLotes.getSelectedRowId();
            let params = {
                empresa: usrJson.empresa,
                usuario: usrJson.codigo,
                global: CodigoGlobalFrac,
                documento: GridProductos.cells(productosRowId,3).getValue(),
                tipodoc: GridProductos.cells(productosRowId,6).getValue(),
                cotara: ComboTaras.getSelectedValue(),
                producto: CodigoProducto,
                pesotara: PesoTara,
                pesoinsumo: PesoMedido,
                lote: GridLotes.cells(lotesRowId,1).getValue(),
                ubicacion: GridLotes.cells(lotesRowId,2).getValue()
            };
            let result;
            try {
                result = await $.post({
                    url: BASE_URL + URL_MODULO + '/guarda-peso-insumo',
                    method: 'post',
                    data: params,
                    dataType: 'json'
                });
                if (result.error) {
                    console.error(result.error);
                    dhtmlx.alert({
                        type: 'alert-error',
                        text: result.error
                    });
                    return;
                }
                if (result.data.codigo == 1) {
                    CargaGridProductos(iCodigoProducto);
                    IniciarGridBultosProd(iCodigoProducto);
                    IniciarGridBultosSup(iCodigoProducto);
                }
                else {
                    dhtmlx.alert({
                        type: 'alert-error',
                        text: result.data.mensaje
                    });
                }
            }
            catch (err) {
                console.error(err);
            }
            break;
        default: break;
    }
}

CargaDatosTara = async () => {
    //combo de taras
    document.getElementById('dv-tara').innerHTML = '';
    ComboTaras = new dhtmlXCombo('dv-tara');
    ComboTaras.load(BASE_URL + URL_MODULO + '/combo-taras/' + CodigoProducto);
    ComboTaras.setComboText('Seleccione tara');
    ComboTaras.setComboValue('0');
    ComboTaras.attachEvent('onChange', ComboTarasOnChange);
}
CargaGridProductos = (codigo) => {
    GridProductos = LayoutPrincipal.cells('a').attachGrid();
    LayoutPrincipal.cells('b').detachObject();
    LayoutPrincipal.cells('b').attachHTMLString('<h1 class="h1-indicator">Seleccione un insumo y el lote para pesar</h1>')
        GridProductos.setIconsPath('/assets/images/icons/grid/');
        GridProductos.setImagesPath('/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/');
        GridProductos.setHeader('TipoDocumento,Código,Producto,Documento,Restantes,,');
        GridProductos.attachHeader('#select_filter,#text_filter,#text_filter,#text_filter,#numeric_filter,#rspan,#rspan');
        GridProductos.setInitWidths('140,100,200,100,40,0,0');
        GridProductos.setColTypes('rotxt,rotxt,rotxt,rotxt,ron,rotxt,rotxt');
        GridProductos.setColAlign('right,left,left,left,right,left,left');
        GridProductos.init();
    LayoutPrincipal.cells('a').progressOn();
    GridProductos.load(BASE_URL + URL_MODULO + '/globales-fraccionamiento/' + usrJson.empresa + '/' + usrJson.codigo + '/' + codigo, () => {
        let NumFilas = GridProductos.getRowsNum();
        if (NumFilas > 0) {
            CodigoProducto = GridProductos.cells2(0,1).getValue();
            CodigoGlobalFrac = GridProductos.cells2(0,5).getValue();
            CargaDatosTara();
        }
        LayoutPrincipal.cells('a').progressOff();
    });
    GridProductos.attachEvent('onRowSelect', GridProductosOnRowSelect);
    $('#LabelPeso').html('0.00g');
    $('#HelperPeso').html('Seleccione un insumo, lote y tara').css('color','#404040');
    $('#icon-peso').empty();
}
CargaGridBultosProd = (codigo) => {
    LayoutSecundario.cells('a').progressOn();
    GridBultosProd.load(BASE_URL + URL_MODULO + '/detalle-bultos-prod/' + usrJson.empresa + '/' + usrJson.codigo + '/' + codigo, () => {
        LayoutSecundario.cells('a').progressOff();
    });
}
IniciarGridBultosProd = (codigo) => {
    LayoutSecundario.cells('a').detachObject();
    GridBultosProd = LayoutSecundario.cells('a').attachGrid();
        GridBultosProd.setIconsPath('/assets/images/icons/grid/');
        GridBultosProd.setImagesPath('/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/');
        GridBultosProd.setHeader(',TipoDoc,Documento, N°Bulto,Tara,Codigo,Producto,Lote,Ubicacion,Completo');
        GridBultosProd.attachHeader('#rspan,#select_filter,#text_filter,#numeric_filter,#select_filter,#text_filter,#text_filter,#text_filter,#text_filter,#rspan');
        GridBultosProd.setInitWidths('30,160,100,60,90,100,240,80,80,30');
        GridBultosProd.setColTypes('ch,rotxt,rotxt,ron,rotxt,rotxt,rotxt,rotxt,rotxt,ch');
        GridBultosProd.init();
    CargaGridBultosProd(codigo);
}
CargaGridBultosSup = (codigo) => {
    LayoutSecundario.cells('b').progressOn();
    GridBultosSup.load(BASE_URL + URL_MODULO + '/detalle-bultos-sup/' + usrJson.empresa + '/' + usrJson.codigo + '/' + codigo, () => {
        LayoutSecundario.cells('b').progressOff();
    });
}
GridBultosSupOnCheck = (new_row,old_row,new_col_index) => {
    //
}
ToolbarSupOnClick = async (button) => {
    switch (button) {
        case 'CompletaFraccionamiento':
            let SelectedRowIds = GridBultosSup.getCheckedRows(0);
            if (SelectedRowIds != '') {
                let RowIds = SelectedRowIds.split(',');
                let vDocumentos = [];
                let vTipos = [];
                for (rowId of RowIds) {
                    vDocumentos.push(GridBultosSup.cells(rowId, 2).getValue());
                    vTipos.push(GridBultosSup.cells(rowId, 12).getValue());
                }
                let params = {
                    empresa: usrJson.empresa,
                    usuario: usrJson.codigo,
                    global: CodigoGlobalFrac,
                    tipos: vTipos.join('@'),
                    documentos: vDocumentos.join('@'),
                    cantidad: RowIds.length
                };
                let result;
                try {
                    result = await $.ajax({
                        url: BASE_URL + URL_MODULO + '/fraccionamiento-completo',
                        method: 'post',
                        data: params,
                        dataType: 'json'
                    });
                    if (result.error) {
                        dhtmlx.alert({
                            type: 'alert-error',
                            text: result.error
                        });
                        return;
                    }
                    else {
                        alert('Operación completada');
                        CargaGridProductos(iCodigoProducto);
                        IniciarGridBultosProd(iCodigoProducto);
                        IniciarGridBultosSup(iCodigoProducto);
                    }
                }
                catch (err) {
                    console.error(err);
                }
            }
            else {
                dhtmlx.alert({
                    type: 'alert-error',
                    text: 'Seleccione al menos una fila para continuar'
                });
            }
            break;
        default: break;
    }
}
IniciarGridBultosSup = (codigo) => {
    LayoutSecundario.cells('b').detachObject();
    GridBultosSup = LayoutSecundario.cells('b').attachGrid();
        GridBultosSup.setIconsPath('/assets/images/icons/grid/');
        GridBultosSup.setImagesPath('/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/');
        GridBultosSup.setHeader(',TipoDoc.,Documento,OK,Packing,Ini.Packing,Fin Packing,Usuario Packing,Entregado,UsuarioRecepciona,Fecha Recepcion,Co.Global,');
        GridBultosSup.attachHeader('#rspan,#select_filter,#text_filter,#rspan,#rspan,#text_filter,#text_filter,#text_filter,#rspan,#text_filter,#text_filter,#text_filter,#rspan');
        GridBultosSup.setInitWidths('30,160,100,30,30,70,70,240,30,240,70,80,0');
        GridBultosSup.setColTypes('ch,rotxt,rotxt,img,img,rotxt,rotxt,rotxt,img,rotxt,rotxt,rotxt,rotxt');
        GridBultosSup.init();
    GridBultosSup.attachEvent('onCheck', GridBultosSupOnCheck);
    CargaGridBultosSup(codigo);
    ConstruyeToolbarProd();
    ConstruyeToolbarSup();
}
ConstruyeToolbarProd = () => {
    GridBultosProdFooter = LayoutSecundario.cells('a').attachStatusBar({
        text: '<div id="prod-footer"></div>',
        height: 32,
        paging: false
    });
    $('#prod-footer').css('margin','0 -5px');
    ToolbarProd = new dhtmlXToolbarObject({
        parent: 'prod-footer',
        icons_path: '/assets/images/icons/toolbar/'
    });
    ToolbarProd.addButton('ImprimeLista',null,'Imprimir','ic-print.svg');
}
ConstruyeToolbarSup = () => {
    GridBultosSupFooter = LayoutSecundario.cells('b').attachStatusBar({
        text: '<div id="sup-footer"></div>',
        height: 32,
        paging: false
    });
    $('#sup-footer').css('margin','0 -5px');
    ToolbarSup = new dhtmlXToolbarObject({
        parent: 'sup-footer',
        icons_path: '/assets/images/icons/toolbar/'
    });
    ToolbarSup.addButton('CompletaFraccionamiento',null,'Fraccionamiento completo','ic-all.svg');
    ToolbarSup.attachEvent('onClick', ToolbarSupOnClick);
}
BuscarCodigoBarras = async () => {
    LayoutPrincipal.cells('a').detachObject();
    let global = ComboGlobales.getSelectedValue();
    let codigo = ToolbarProductos.getValue('CodigoBarras');
    //hay que cargar el codigo
    let result;
    try {
        result = await $.ajax({
            url: BASE_URL + URL_MODULO + '/carga-codigo-producto',
            method: 'post',
            data: {
                empresa: usrJson.empresa,
                global: global,
                producto: codigo
            },
            dataType: 'json'
        });
        if (result.error) {
            alert(result.error);
            return;
        }
        let iCodigo = result.data.codigo;
        iCodigoProducto = iCodigo;
        //layout inferior
        LayoutSecundario = LayoutPrincipal.cells('d').attachLayout('2U');
            LayoutSecundario.cells('a').hideHeader();
            LayoutSecundario.cells('b').hideHeader();
        //carga los grids
        CargaGridProductos(iCodigo);
        IniciarGridBultosProd(iCodigo);
        IniciarGridBultosSup(iCodigo);
    }
    catch (err) {
        console.error(err);
        alert('Ocurrió un error...');
    }
    /*if (codigo != '') {
        //layout inferior
        LayoutSecundario = LayoutPrincipal.cells('d').attachLayout('2U');
            LayoutSecundario.cells('a').hideHeader();
            LayoutSecundario.cells('b').hideHeader();
        //carga los grids
        CargaGridProductos(codigo);
        IniciarGridBultosProd(codigo);
        IniciarGridBultosSup(codigo);
    }
    else {
        dhtmlx.alert({
            type: 'alert-error',
            text: 'Debe leer o ingresar un código de barras para continuar'
        });
    }*/
}
ConfiguraFormPeso = () => {
    LayoutPrincipal.cells('c').detachObject();
    FormPeso = LayoutPrincipal.cells('c').attachForm();
    FormPeso.loadStruct(FormPesoStruct);
    FormPeso.attachEvent('onButtonClick', FormPesoOnButtonClick);
    //
    let DivPesoId = FormPeso.getContainer('divPeso').getAttribute('id');
    $('#' + DivPesoId).append(
        $('<span>').html('0.00g').addClass('label-peso').attr('id','LabelPeso').on('click', function() {
            let string = window.prompt('peso?');
            if (string != '') {
                ActualizarPeso(string);
            }
        })
    ).append(
        $('<p>').html('Primero debe pesar el insumo').addClass('helper-peso').attr('id','HelperPeso')
    ).append(
        $('<div>').attr('id','icon-peso')
    );
}
HabilitarPeso = () => {
    //$('#HelperPeso').html('Seleccione un insumo, lote y tara').css('color','#404040');
    /*let PesoReferencia = parseFloat(GridLotes.cells(GridLotes.getSelectedRowId(),4).getValue()) + PesoTara;
    let faltante = PesoReferencia - PesoMedido;
    $('#HelperPeso').html('Pesar más insumo - Faltante: ' + faltante.toLocaleString('en-us',{ minimumFractionDigits:4, maximumFractionDigits:4 }) + ' gramos').css('color','#e53935');
    $('#icon-peso').empty().append(
        $('<img>').attr('src', '/assets/images/icons/emojis/falta.jpg').addClass('img-emoji')
    );*/
    ActualizarPeso("0");
}
ActualizarPeso = (StringPeso) => {
    PesoMedido = parseFloat(StringPeso);
    $('#LabelPeso').html(PesoMedido.toLocaleString('en-us',{ minimumFractionDigits:4, maximumFractionDigits:4 }) + 'g');
    if (GridLotes) {
        let PesoReferencia = parseFloat(GridLotes.cells(GridLotes.getSelectedRowId(),4).getValue()) + PesoTara;
        if (Math.abs(PesoReferencia - PesoMedido) < PARSE_FLOAT_ERROR) {
            $('#HelperPeso').html('El peso es correcto!').css('color','#4caf50');
            $('#icon-peso').empty().append(
                $('<img>').attr('src', '/assets/images/icons/emojis/ok.jpg').addClass('img-emoji')
            );
        }
        else {
            if (PesoReferencia > PesoMedido) {
                let faltante = PesoReferencia - PesoMedido;
                $('#HelperPeso').html('Pesar más insumo - Faltante: ' + faltante.toLocaleString('en-us',{ minimumFractionDigits:4, maximumFractionDigits:4 }) + ' gramos').css('color','#e53935');
                $('#icon-peso').empty().append(
                    $('<img>').attr('src', '/assets/images/icons/emojis/falta.jpg').addClass('img-emoji')
                );
            }
            else {
                let sobrante = PesoMedido - PesoReferencia;
                $('#HelperPeso').html('Has excedido el peso - Sobrante: ' + sobrante.toLocaleString('en-us',{ minimumFractionDigits:4, maximumFractionDigits:4 }) + ' gramos').css('color','#7b1fa2');;
                $('#icon-peso').empty().append(
                    $('<img>').attr('src', '/assets/images/icons/emojis/excede.jpg').addClass('img-emoji')
                );
            }
        }
    }
}

//web socket
EscribirPeso = (message) => {
    /*let peso = parseFloat(message);
    $('#LabelPeso').html(peso.toLocaleString('en-us',{ minimumFractionDigits:4, maximumFractionDigits:4 }) + 'g');*/
    ActualizarPeso(message);
}

IniciarWebSocket = () => {
    connection = new WebSocket('ws://127.0.0.1:4444');
    //listeners del WebSocket
    connection.onopen = function () {
        console.log('Connected!');
        connection.send('start COM9');
    };
    // Log errors
    connection.onerror = function (error) {
        console.log('WebSocket Error ' + error);
        alert('WebSocket no disponible');
    };
    // Log messages from the server
    connection.onmessage = function (e) {
        //console.log('Server: ' + e.data);
        EscribirPeso(e.data);
    };
}

IniciarComponentes = () => {
    LayoutPrincipal = new dhtmlXLayoutObject(document.body, '4U');
        LayoutPrincipal.cells('a').hideHeader();
        LayoutPrincipal.cells('a').setWidth(600);
        LayoutPrincipal.cells('a').attachHTMLString('<div class="img-cover"><img src="/assets/images/otros/img-barcode.png" /></div>');
        LayoutPrincipal.cells('b').hideHeader();
        LayoutPrincipal.cells('b').setWidth(380);
        LayoutPrincipal.cells('b').attachHTMLString('<div class="img-cover"><img src="/assets/images/otros/img-lote.jpg" /></div>');
        LayoutPrincipal.cells('c').hideHeader();
        LayoutPrincipal.cells('d').hideHeader();
    //backgrounds
    ToolbarProductos = LayoutPrincipal.cells('a').attachToolbar();
        ToolbarProductos.setIconsPath('/assets/images/icons/toolbar/');
        ToolbarProductos.addText('LabelGlobales', null, 'Global');
        ToolbarProductos.addText('ComboGlobales', null, '<div id="dv-globales" class="dv-combo"></div>');
        ToolbarProductos.addText('LabelCodigoBarras', null, 'Cod.Barras');
        ToolbarProductos.addInput('CodigoBarras',null,null,120);
        ToolbarProductos.addButton('BuscaCodigo', null, 'Buscar', 'ic-search.svg');
        ToolbarProductos.attachEvent('onClick', ToolbarProductosOnClick);
    ComboGlobales = new dhtmlXCombo('dv-globales', 'combo', 140);
    ComboGlobales.load(BASE_URL + URL_MODULO + '/combo-globales/' + usrJson.empresa);
    ToolbarPesaje = LayoutPrincipal.cells('b').attachToolbar();
        ToolbarPesaje.setIconsPath('/assets/images/icons/toolbar/');
        ToolbarPesaje.addText('LabelTara', null, 'Taras');
        ToolbarPesaje.addText('ComboTara', null, '<div id="dv-tara" class="dv-combo"></div>');
        ToolbarPesaje.addText('LabelPeso', null, '<b>Peso (kg.)</b>');
        ToolbarPesaje.addText('InputPeso', null, '<span id="sp-peso" class="sp-input">(n.d.)</span>');
    ComboTaras = new dhtmlXCombo('dv-tara', 'combo', 140);
    ComboTaras.setComboText('-');
    ComboTaras.setComboValue('0');
    ConfiguraFormPeso();
    IniciarWebSocket();
}

$(IniciarComponentes);