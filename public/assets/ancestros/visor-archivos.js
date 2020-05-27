/*
config = {
    filtro: 'B20-4040',
    maximo: 1, // cuántos archivos como máximo están permitidos para el file
    minimo: 1, // cuántos archivos como mínimo están permitidos para el file
    lectura: {
        empresa: 11,
        archivo: '46455181',
        tpdocumento: '03'
    },
    escritura: {
        usuario: 8,
        documento: movimiento.documento,
        destino: 'PROVEEDORES',
        tpdocadm: '03',
        catalenti: '46455181',
        periodo: '201912'
    },
    default: 0 // por defecto cargará el archivo en la posición indicada. si no se desa cargar, enviar false
}
*/
var winArchivos, layoutArchivos, gridArchivos, toolbarArchivos;
var parentContainer, parametrosGlobales, parametrosSubida;
var winSubida, layoutSubida, formSubida;
var base64;

const structs = {
    formSubida: [
        { type: 'settings', labelWidth:70, offsetLeft: 15 },
        { type: 'file', name: 'archivo', label: 'Seleccione archivo', offsetTop: 10 },
        { type: 'hidden', name: 'nombre' },
        { type: 'hidden', name: 'tpcarpeta' },
        { type: 'hidden', name: 'ext' },
        { type: 'input', name: 'descripcion', label: 'Descripción', rows: 3, inputWidth: 320 },
        { type: 'radio', name: 'adjunto', label: 'Adjunto del documento principal', value: 'S', position: 'label-right', offsetLeft: 70, labelWidth: 320, checked: true },
        { type: 'radio', name: 'adjunto', label: 'Adjunto referencial del documento', value: 'N', position: 'label-right', offsetLeft: 70, labelWidth: 320 },
        { type: 'input', name: 'gcomo', label: 'Guardar como', inputWidth: 240 },
        { type: 'input', name: 'referencias', label: 'Referencias', inputWidth: 240 },
        { type: 'block', offsetLeft: 53, list: [
            { type: 'button', name: 'adjuntar', value: 'Adjuntar' },
            { type: 'newcolumn' },
            { type: 'button', name: 'cancelar', value: 'Cancelar' }
        ] }
    ]
};

AbrirVisor = (params, container) => {
    parametrosGlobales = params;
    parentContainer = container;
    winArchivos = container.createWindow('winArchivos', 0, 0, 1080, 600);
        winArchivos.setText('Visor de documentos');
        winArchivos.setModal(true);
        winArchivos.keepInViewport(true);
        winArchivos.center();
    // layoutArchivos, gridArchivos, toolbarArchivos
    layoutArchivos = winArchivos.attachLayout('2U');
        layoutArchivos.cells('a').setWidth(240);
        layoutArchivos.cells('a').setText('Buscando archivos')
        layoutArchivos.cells('b').hideHeader();
        layoutArchivos.cells('b').attachHTMLString('<div id="dv-imagen" style="background-color:#3f51b5;height:100%;width:100%;"></div>');
    gridArchivos = layoutArchivos.cells('a').attachGrid();
        gridArchivos.setHeader('Archivo,Nro.,');
        gridArchivos.attachHeader('#text_filter,#numeric_filter,#rspan');
        gridArchivos.setColumnIds('archivo,numero,ruta');
        gridArchivos.setInitWidths('180,40,0');
        gridArchivos.setColTypes('rotxt,ron,rotxt');
        gridArchivos.setColAlign('left,right,left');
        gridArchivos.init();
        gridArchivos.load('/api/ancestros/lista-archivos/' + params.lectura.empresa + '/' + params.lectura.archivo + '/' + params.lectura.tpdocumento + '/' + (params.filtro ? params.filtro : 'x'), gridArchivosOnLoad);
        gridArchivos.attachEvent('onRowDblClicked', gridArchivosOnRowDblClicked);
    toolbarArchivos = layoutArchivos.cells('b').attachToolbar();
        toolbarArchivos.setIconsPath('/assets/images/icons/toolbar/');
        toolbarArchivos.addButton('nuevo', null, 'Agregar', 'ic-add.svg', 'ic-add-dis.svg');
        toolbarArchivos.addButton('eliminar', null, 'Eliminar', 'ic-elimina.svg', 'ic-elimina-dis.svg');
        toolbarArchivos.addSeparator();
        toolbarArchivos.addText('label', null, '<span id="label-archivo">(Seleccione un archivo)</span>');
        toolbarArchivos.disableItem('nuevo');
        toolbarArchivos.disableItem('eliminar');
        toolbarArchivos.attachEvent('onClick', toolbarArchivosOnClick);
}

gridArchivosOnRowDblClicked = async (rowId, colId) => {
    let archivo = gridArchivos.getRowData(rowId);
    let result;
    try {
        result = await $.ajax({
            url: '/api/ancestros/carga-imagen',
            method: 'post',
            data: {
                ruta: archivo.ruta
            },
            dataType: 'json'
        });
        //
        $('#label-archivo').html('Mostrando: <b>' + archivo.archivo + '</b>');
        $('#dv-imagen').empty().append(
            $('<img>').attr('src', 'data:image/jpeg;base64,' + result.data.b64).css({
                'display': 'block',
                'margin': '0 auto',
                'max-height': '100%',
                'max-width': '100%'
            })
        );
    }
    catch (err) {
        console.error(err);
    }
}

gridArchivosOnLoad = () => {
    let numFilas = gridArchivos.getRowsNum();
    if (!parametrosGlobales.maximo || numFilas < parametrosGlobales.maximo) {
        toolbarArchivos.enableItem('nuevo');
        if (numFilas == 0) {
            gridArchivos.addRow('no','Documento sin adjuntos,0,');
            gridArchivos.setCellTextStyle('no',0,'color:#808080;');
            gridArchivos.setCellTextStyle('no',1,'color:#808080;');
        }
    }
}

toolbarArchivosOnClick = async (id) => {
    switch (id) {
        case 'nuevo':
            let result = await AbreCuadroCarga(parametrosGlobales.escritura, parentContainer);
            if (result) {
                gridArchivos.clearAll();
                gridArchivos.load('/api/ancestros/lista-archivos/' + parametrosGlobales.lectura.empresa + '/' + parametrosGlobales.lectura.archivo + '/' + parametrosGlobales.lectura.tpdocumento + '/' + (parametrosGlobales.filtro ? parametrosGlobales.filtro : 'x'), gridArchivosOnLoad);
            }
            break;
    }
}

formSubidaOnChange = (event) => {
console.log(parametrosSubida);
    let fullPath = formSubida.getInput('archivo').value;
    let startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
    let filename = fullPath.substring(startIndex);
    if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
        filename = filename.substring(1);
    }
    let extension = filename.substring(filename.lastIndexOf('.') + 1);
    let nomarchivo = formSubida.getItemValue('nombre');
    formSubida.setItemValue('gcomo', nomarchivo + '.' + extension);
    formSubida.setItemValue('ext', extension);
    // previsualiza el archivo
    var file = formSubida.getInput('archivo').files[0],
    reader = new FileReader();
    switch (extension) {
        case 'png':
            reader.readAsDataURL(file);
            reader.onloadend = function () {
                base64 = reader.result;
                $('#dv-preview').empty().append(
                    $('<img>').attr('src', 'data:image/png;base64,' + base64.replace(/^data:.+;base64,/, '')).css({
                        'display': 'block',
                        'margin': '0 auto',
                        'max-height': '100%',
                        'max-width': '100%'
                    })
                );
            };
            break;
        case 'jpg':
        case 'jpeg':
            reader.readAsDataURL(file);
            reader.onloadend = function () {
                base64 = reader.result;
                $('#dv-preview').empty().append(
                    $('<img>').attr('src', 'data:image/jpeg;base64,' + base64.replace(/^data:.+;base64,/, '')).css({
                        'display': 'block',
                        'margin': '0 auto',
                        'max-height': '100%',
                        'max-width': '100%'
                    })
                );
            };
            break;
    }
}

AbreCuadroCarga = (params, container) => {
    parametrosSubida = params;
    return new Promise(resolve => {
        if (container.isWindow('winSubida')) {
            winSubida.bringToTop();
        }
        else {
            winSubida = container.createWindow('winSubida', 0, 0, 960, 400);
                winSubida.center();
                winSubida.keepInViewport(true);
                winSubida.setModal(true);
                winSubida.setText('Añadir adjuntos');
                winSubida.button('close').hide();
                winSubida.button('park').hide();
                winSubida.button('minmax').hide();
            // resolve(json), resolve(null)
            layoutSubida = winSubida.attachLayout('2U');
                layoutSubida.cells('a').setText('Datos del adjunto');
                layoutSubida.cells('a').setWidth(480);
                layoutSubida.cells('b').hideHeader();
                layoutSubida.cells('b').attachHTMLString('<div id="dv-preview" style="background-color:#d0d0d0;height:100%;width:100%;"></div>')
            formSubida = layoutSubida.cells('a').attachForm();
                formSubida.loadStruct(structs.formSubida);
                formSubida.getInput('archivo').addEventListener('change', formSubidaOnChange);
                formSubida.attachEvent('onButtonClick', (name) => {
                    switch (name) {
                        case 'adjuntar':
                            layoutSubida.cells('a').progressOn();
                            let data = {
                                empresa: usrJson.empresa,
                                documento: parametrosSubida.documento,
                                ext: formSubida.getItemValue('ext'),
                                cousuario: parametrosSubida.usuario,
                                tipoenti: parametrosSubida.tipoenti,
                                catalenti: parametrosSubida.catalenti,
                                tipoarchivo: formSubida.getItemValue('tpcarpeta'),
                                descripcion: formSubida.getItemValue('descripcion'),
                                tipodoc: parametrosSubida.tpdocadm,
                                tipocarpeta: parametrosSubida.destino,
                                periodo: parametrosSubida.periodo,
                                base64: base64
                            };
                            $.post('/api/ancestros/guardar-adjunto', data, (result) => {
                                layoutSubida.cells('a').progressOff();
                                if (result.data.codigo == 1) {
                                    winSubida.close();
                                    dhtmlx.alert({
                                        type: 'alert-warning',
                                        text: result.data.resultado
                                    });
                                    resolve(true);
                                }
                                else {
                                    dhtmlx.alert({
                                        type: 'alert-error',
                                        text: result.data.resultado
                                    });
                                }
                            }, 'json').fail(() => {
                                layoutSubida.cells('a').progressOff();
                                dhtmlx.alert({
                                    type: 'alert-error',
                                    text: 'Ocurrió un error al procesar el archivo'
                                });
                            });
                            break;
                        case 'cancelar':
                            winSubida.close();
                            resolve(false);
                            break;
                        default: break;
                    }
                });
            // carga info para el adjunto
            let p = {
                tpdocumento: params.tpdocadm,
                documento: params.documento,
                archivo: params.catalenti,
                tpcarpeta: params.destino
            };
            $.post('/api/ancestros/datos-adjunto', p, DatosAdjuntoOnReady, 'json');
        }
    });
}

DatosAdjuntoOnReady = (result, error) => {
    let data = result.data;
    formSubida.setItemValue('descripcion', data.descripcion);
    formSubida.setItemValue('gcomo', data.nombre);
    formSubida.setItemValue('nombre', data.nombre);
    formSubida.setItemValue('tpcarpeta', data.tpcarpeta);
}