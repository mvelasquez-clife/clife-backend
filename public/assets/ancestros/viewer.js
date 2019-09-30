const structs = {
    Form: [
        { type: 'settings', labelWidth: 45, inputWidth: 100, position: 'label-left', offsetLeft: 12, offsetTop: 12 },
        { type: 'radio', name: 'busqueda', value: 'F', label: '<span class="text-primary">Búsqueda por fechas</span>', labelWidth: 180, position: 'label-right', checked: true, list:[
            { type: 'input', name: 'fechaDesde', label: 'Desde', offsetTop: 0 },
            { type: 'input', name: 'fechaHasta', label: 'Hasta' },
            { type: 'button', name: 'buscar', value: 'Busca documentos', offsetLeft: 58 }
        ] },
        { type: 'radio', name: 'busqueda', value: 'D', label: '<span class="text-success">Búsqueda por documento</span>', labelWidth: 180, position: 'label-right', list: [
            //{ type: 'label', labelWidth: 280, label: '<span class="text-primary">Ingrese el código del documento, o parte de este</span>', offsetTop: 0 },
            { type: 'input', name: 'documento', label: 'Código'/*, note: { text: 'Ingrese el documento' }*/, offsetTop: 0 },
            { type: 'button', name: 'verificar', value: 'Buscar por código', offsetLeft: 58 }
        ], offsetTop: 10 }
    ]
};
let Calendar, InputDesde, InputHasta;
let ListaDocumentos;

//metodos
IniciarComponentes = async () => {
    Layout = new dhtmlXLayoutObject(document.body, '3J');
        Layout.cells('a').setHeight(320);
        Layout.cells('a').setWidth(320);
        Layout.cells('a').setCollapsedText('<b class="text-danger p-1">Clic para refrescar la búsqueda</b>');
        Layout.cells('a').setText('Búsqueda de documentos');
        Layout.cells('b').hideHeader();
        Layout.cells('c').setText('Documentos encontrados');
    Form = Layout.cells('a').attachForm();
        Form.loadStruct(structs.Form);
    InputDesde = Form.getInput('fechaDesde');
        InputDesde.setAttribute('readOnly', 'true');
        InputDesde.onclick = function(){ setSens(InputHasta, 'max'); }
    InputHasta = Form.getInput('fechaHasta');
        InputHasta.setAttribute('readOnly', 'true');
        InputHasta.onclick = function(){ setSens(InputDesde, 'min'); }
    Calendar = new dhtmlXCalendarObject([InputDesde,InputHasta]);
        Calendar.setDateFormat("%d/%m/%Y");
    let iFecha = new Date();
        Form.setItemValue('fechaHasta', iFecha.toLocaleDateString('en-GB'));
        iFecha.setMonth(iFecha.getMonth() - 1);
        Form.setItemValue('fechaDesde', iFecha.toLocaleDateString('en-GB'));
    Form.attachEvent('onButtonClick', FormOnButtonClick);
}
setSens = (inp, k) => {
    if (k == 'min') Calendar.setSensitiveRange(inp.value, null);
    else Calendar.setSensitiveRange(null, inp.value);
}
BuscarTipo = (tipo) => {
    let nTipo = '';
    switch(tipo) {
        case '01': nTipo = 'Factura'; break;
        case '03': nTipo = 'Boleta'; break;
        case '07': nTipo = 'Nota de Crédito'; break;
        case '08': nTipo = 'Nota de Débito'; break;
        default: nTipo = 'X'; break;
    }
    return nTipo;
}
EscribirTreeViewDocumentos = () => {
    let EstructuraTree = [];
    let SubestructuraTree = [];
    let CantidadNodos = 0;
    let TipoActual = 'X';
    let CantidadDocumentos = ListaDocumentos.length;
    for(let i = 0; i < CantidadDocumentos; i++) {
        let iDocumento = ListaDocumentos[i];
        if(iDocumento.tipo != TipoActual) {
            if(i > 0) {
                EstructuraTree.push({
                    id: parseInt(TipoActual),
                    text: BuscarTipo(TipoActual) + ' (' + CantidadNodos + ')',
                    open: 0,
                    item: SubestructuraTree
                });
            }
            TipoActual = iDocumento.tipo;
            SubestructuraTree = [];
            CantidadNodos = 0;
        }
        SubestructuraTree.push({
            id: iDocumento.documento,
            text: iDocumento.documento
        })
        CantidadNodos++;
    }
    EstructuraTree.push({
        id: parseInt(TipoActual),
        text: BuscarTipo(TipoActual) + ' (' + CantidadNodos + ')',
        open: 0,
        item: SubestructuraTree
    });
    EstructuraTree = {
        id: 0, item: EstructuraTree
    };
    Tree = Layout.cells('c').attachTree();
        Tree.setImagePath('/assets/vendor/dhtmlx/skins/web/imgs/dhxtree_web/');
        Tree.parse(EstructuraTree, 'json');
        Tree.attachEvent('onClick', TreeOnClick);
    Layout.cells('a').collapse();
    Layout.cells('a').progressOff();
}

//eventos
FormOnButtonClick = async (id) => {
    let result;
    Layout.cells('a').progressOn();
    Layout.cells('b').detachObject();
    Layout.cells('b').detachToolbar();
    Layout.cells('c').detachObject();
    switch(id) {
        case 'buscar':
            try {
                result = await $.ajax({
                    url: '/viewer/buscar-documentos',
                    method: 'post',
                    data: {
                        desde: Form.getItemValue('fechaDesde'),
                        hasta: Form.getItemValue('fechaHasta'),
                        modo: 'F',
                        documento: '-',
                        empresa: empresa
                    },
                    dataType: 'json'
                });
                if(result.state == 'success') {
                    ListaDocumentos = result.data.documentos;
                    EscribirTreeViewDocumentos();
                }
                else {
                    console.error(result.message);
                }
            }
            catch(error) {
                console.error(error);
            }
            break;
        case 'verificar':
            try {
                result = await $.ajax({
                    url: '/viewer/buscar-documentos',
                    method: 'post',
                    data: {
                        desde: Form.getItemValue('fechaDesde'),
                        hasta: Form.getItemValue('fechaHasta'),
                        modo: 'D',
                        documento: Form.getItemValue('documento'),
                        empresa: empresa
                    },
                    dataType: 'json'
                });
                if(result.state == 'success') {
                    ListaDocumentos = result.data.documentos;
                    EscribirTreeViewDocumentos();
                    let tipos = Tree.getSubItems(0).split(',');
                    for(let i in tipos) {
                        let iTipo = parseInt(tipos[i]);
                        Tree.openItem(iTipo);
                    }
                }
                else {
                    console.error(result.message);
                }
            }
            catch(error) {
                console.error(error);
            }
            break;
        default: break;
    }
}
TreeOnClick = (id) => {
    if(Tree.hasChildren(id) == 0) {
        Layout.cells('b').detachToolbar();
        Toolbar = Layout.cells('b').attachToolbar();
            Toolbar.setIconsPath('/assets/images/icons/toolbar/');
            Toolbar.addText('lblDocumento', null, 'Mostrando documento <b>' + id + '</b>');
            Toolbar.addSeparator();
            Toolbar.addButton('btnDocumento', null, 'Nueva búsqueda', 'ic-goggles.svg', '');
            Toolbar.attachEvent('onClick', ToolbarOnClick);
        Layout.cells('b').attachURL('/viewer/archivo/' + empresa + '/' + id);
    }
}
ToolbarOnClick = (id) => {
    switch(id) {
        case 'btnDocumento':
            Layout.cells('a').expand();
            break;
        default: break;
    }
}
