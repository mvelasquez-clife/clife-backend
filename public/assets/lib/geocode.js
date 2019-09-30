ComboPaisOnChange = (pais, text) => {
    ComboDepartamento.clearAll();
    ComboDepartamento.setComboText('');
    ComboDepartamento.setComboValue('');
    ComboProvincia.clearAll();
    ComboProvincia.setComboText('');
    ComboProvincia.setComboValue('');
    ComboDistrito.clearAll();
    ComboDistrito.setComboText('');
    ComboDistrito.setComboValue('');
    ComboDepartamento.load('/coordenadas/geocode/lista-departamentos/' + pais);
}
ComboDepartamentoOnChange = (departamento, text) => {
    let pais = ComboPais.getSelectedValue();
    ComboProvincia.clearAll();
    ComboProvincia.setComboText('');
    ComboProvincia.setComboValue('');
    ComboDistrito.clearAll();
    ComboDistrito.setComboText('');
    ComboDistrito.setComboValue('');
    ComboProvincia.load('/coordenadas/geocode/lista-provincias/' + pais + '/' + departamento);
}
ComboProvinciaOnChange = (provincia, text) => {
    let pais = ComboPais.getSelectedValue();
    let departamento = ComboDepartamento.getSelectedValue();
    ComboDistrito.clearAll();
    ComboDistrito.setComboText('');
    ComboDistrito.setComboValue('');
    ComboDistrito.load('/coordenadas/geocode/lista-distritos/' + pais + '/' + departamento + '/' + provincia);
}
ComboDistritoOnChange = (ubigeo, distrito) => {
    CargarListaDirecciones(ubigeo, distrito);
}
ComboVendedorOnChange = (vendedor, nombre) => {
    CargarListaDireccionesVendedor(vendedor, nombre);
}
CargarListaDireccionesVendedor = (vendedor, nombre) => {
    Layout.cells('a').setText('Clientes - ' + nombre);
    Layout.cells('a').detachObject();
    GridDirecciones = Layout.cells('a').attachGrid();
        GridDirecciones.setIconsPath('/assets/images/icons/grid/');
        GridDirecciones.setImagePath("/assets/vendor/dhtmlx/codebase/imgs/");
        GridDirecciones.setHeader(',,,,Cliente,Distrito,Direccion');
        GridDirecciones.attachHeader('#rspan,#rspan,#rspan,#rspan,#text_filter,#select_filter,#text_filter');
        GridDirecciones.setInitWidths('0,0,20,20,200,90,320');
        GridDirecciones.setColTypes('rotxt,rotxt,img,ch,rotxt,rotxt,rotxt');
        GridDirecciones.setColAlign('left,left,center,center,left,left,left');
    GridDirecciones.init();
    Layout.cells('a').progressOn();
    GridDirecciones.load('/coordenadas/geocode/lista-direcciones-vendedor/' + vendedor, CargaMarkersDirecciones);
    GridDirecciones.attachEvent('onRowSelect', GridDireccionesOnRowSelect);
    LimpiarListaMarcadores();
}
CargarListaDirecciones = (ubigeo, distrito) => {
    Layout.cells('a').setText('Clientes - ' + distrito);
    Layout.cells('a').detachObject();
    GridDirecciones = Layout.cells('a').attachGrid();
        GridDirecciones.setIconsPath('/assets/images/icons/grid/');
        GridDirecciones.setImagePath("/assets/vendor/dhtmlx/codebase/imgs/");
        GridDirecciones.setHeader(',,,,Cliente,Distrito,Direccion');
        GridDirecciones.attachHeader('#rspan,#rspan,#rspan,#rspan,#text_filter,#select_filter,#text_filter');
        GridDirecciones.setInitWidths('0,0,20,20,200,90,320');
        GridDirecciones.setColTypes('rotxt,rotxt,img,ch,rotxt,rotxt,rotxt');
        GridDirecciones.setColAlign('left,left,center,center,left,left,left');
    GridDirecciones.init();
    Layout.cells('a').progressOn();
    GridDirecciones.load('/coordenadas/geocode/lista-direcciones/' + ubigeo, CargaMarkersDirecciones);
    LimpiarListaMarcadores();
}
GridDireccionesOnRowSelect = (rowId, colId) => {
    switch(colId) {
        case 6:
            if(Markers.has(rowId)) {
                let thisMarker = Markers.get(rowId);
                map.panTo(thisMarker.position);
                map.setZoom(14);
            }
            else {
                let thisDistrito = GridDirecciones.cells(rowId,5).getValue();
                dhtmlx.confirm({
                    title: 'No se pudo geolocalizar',
                    ok: 'Colocar marcador',
                    cancel: 'No',
                    text: 'No se pudo geolocalizar la dirección. ¿Desea ingresar el marcador manualmente? Se colocará un marcador en "<i>' + thisDistrito + '</i>"',
                    callback: (result) => {
                        if(result) {
                            geocoder = new google.maps.Geocoder();
                            geocoder.geocode({
                                address: thisDistrito
                            }, function(results, status) {
                                if (status === 'OK') {
                                    let point = results[0].geometry.location;
                                    //agrega el marker
                                    AuxMarker = new google.maps.Marker({
                                        map: map,
                                        position: point,
                                        draggable: true,
                                        title: 'Nuevo marcador',
                                        icon: {
                                            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                                        },
                                        data: { codigo: rowId },
                                        zIndex: 1000
                                    });
                                    //centra el mapa
                                    map.panTo(point);
                                    map.setZoom(12);
                                }
                                else {
                                    alert('No se pudo calcular las coordenadas: ' + status);
                                }
                            });
                        }
                    }
                });
            }
            let thisDireccion = GridDirecciones.cells(rowId,6).getValue();
            ToolbarMap.setValue('mtDireccion', thisDireccion);
            break;
        default: break;
    }
}
CargaMarkersDirecciones = () => {
    Layout.cells('a').progressOff();
    let NumFilas = GridDirecciones.getRowsNum();
    //
    for(let i = 0; i < NumFilas; i++) {
        let iRowId = GridDirecciones.getRowId(i);
        GridDirecciones.setCellTextStyle(iRowId,6,'cursor:pointer;text-decoration:underline;');
    }
    //
    /*let departamento = ComboDepartamento.getSelectedText().toUpperCase();
    let distrito = ComboDistrito.getSelectedText().toUpperCase();
    let provincia = ComboProvincia.getSelectedText().toUpperCase();
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        address: distrito + ' ' + provincia
    }, function(results, status) {
        if (status === 'OK') {
            map.panTo(results[0].geometry.location);
            map.setZoom(12);
        }
        else {
            alert('No se pudo calcular las coordenadas: ' + status);
        }
    });*/
    //
    let distrito = '';
    LimpiarListaMarcadores();
    Markers = new Map();
    AgregaMarcador(NumFilas,0,distrito);
}
LimpiarListaMarcadores = () => {
    if(Markers) {
        for(let [codigo, marker] of Markers) {
            marker.setMap(null);
        }
        Markers.clear();
    }
    if(AuxMarker) {
        AuxMarker.setMap(null);
        AuxMarker = null;
    }
}
function MarkerOnClick() {
    let marker = $(this);
    let iRowId = marker[0].data.codigo;
console.log('seleccionar',iRowId);
    GridDirecciones.selectRow(iRowId);
}
AgregaMarcador = async (cantidad,indice,xdistrito) => {
    if(indice < cantidad) {
        let iRowId = GridDirecciones.getRowId(indice);
        let iRsocial = GridDirecciones.cells(iRowId,4).getValue();
        let distrito = GridDirecciones.cells(iRowId,5).getValue();
        let iDireccion = GridDirecciones.cells(iRowId,6).getValue();
        //
        GridDirecciones.cells(iRowId,2).setValue('ic-hourglass.svg^Procesando...' + iDireccion);
        geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            address: iDireccion,
            componentRestrictions: {
                country: 'PE',
                locality: distrito
            }
        }, function(results, status) {
            if (status === 'OK') {
                let point = results[0].geometry.location;
                GridDirecciones.cells(iRowId,2).setValue('ic-done.svg^' + iDireccion);
                GridDirecciones.cells(iRowId,3).setValue(1);
                let iMarker = new google.maps.Marker({
                    map: map,
                    position: point,
                    draggable: true,
                    title: iDireccion + '\nCliente: ' + iRsocial,
                    data: { codigo: iRowId }
                });
                iMarker.addListener('click', MarkerOnClick);
                Markers.set(iRowId, iMarker);
            }
            else {
                GridDirecciones.cells(iRowId,2).setValue('ic-danger.svg^ERR: ' + status);
                GridDirecciones.cells(iRowId,3).setValue(0);
            }
            setTimeout(function() {
                AgregaMarcador(cantidad,indice + 1,distrito);
            }, 500);
        });
    }
    else return;
}
ToolbarOnClick = async (id) => {
    switch(id) {
        case 'GuardaCoordenadas':
            let NumFilas = GridDirecciones.getRowsNum();
            let resultado = [];
            for(let i = 0; i < NumFilas; i++) {
                let iRowId =  GridDirecciones.getRowId(i);
                if(GridDirecciones.cells(iRowId,3).getValue() == '1') {
                    let iMarker = Markers.get(iRowId);
                    resultado.push({
                        codigo: iRowId,
                        latitud: iMarker.position.lat(),
                        longitud: iMarker.position.lng()
                    });
                }
            }
console.log(resultado);
            let result;
            try {
                result = await $.ajax({
                    url: '/coordenadas/geocode/guardar-coordenadas-direccion',
                    method: 'post',
                    data: { direcciones: JSON.stringify(resultado) },
                    dataType: 'json'
                });
                if(result.error) {
                    alert(result.error);
                    return;
                }
/*                let cDireccion = ComboDistrito.getSelectedValue();
                let dDireccion = ComboDistrito.getSelectedText();
                CargarListaDirecciones(cDireccion,dDireccion);
*/
                let thisVendedor = ComboVendedor.getSelectedValue();
                let thisNomVendedor = ComboVendedor.getSelectedText();
                LimpiarListaMarcadores();
                CargarListaDireccionesVendedor(thisVendedor,thisNomVendedor);
            }
            catch(err) {
                console.error(err);
            }
            break;
        default: break;
    }
}

ToolbarMapOnClick = (id) => {
    switch(id) {
        case 'BuscaCoordenadas':
            let iRowId = GridDirecciones.getSelectedRowId();
            let thisDireccion = ToolbarMap.getValue('mtDireccion');
            geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                address: thisDireccion
            }, function(results, status) {
                if (status === 'OK') {
                    let point = results[0].geometry.location;
                    //agrega el marker
                    if(AuxMarker) {
                        AuxMarker.setMap(null);
                        AuxMarker = null;
                    }
                    AuxMarker = new google.maps.Marker({
                        map: map,
                        position: point,
                        draggable: true,
                        title: 'Nuevo marcador',
                        icon: {
                            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                        },
                        data: { codigo: iRowId },
                        zIndex: 1000
                    });
                    //centra el mapa
                    map.panTo(point);
                    map.setZoom(12);
                }
                else {
                    alert('No se pudo calcular las coordenadas: ' + status);
                }
            });
            break;
        case 'GuardaMarcador':
            if(AuxMarker) {
                let iCoDire = AuxMarker.data.codigo;
                if(Markers.has(iCoDire)) {
                    dhtmlx.confirm({
                        title: 'Sobreescribir marcador',
                        ok: 'Sobreescribir',
                        cancel: 'No',
                        text: 'Ya existe un marcador para la dirección seleccionada. ¿Desea sobreescribirlo?',
                        callback: (result) => {
                            if(result) {
                                //elimina el marcador actual
                                Markers.get(iCoDire).setMap(null);
                                //inserta un nuevo marcador
                                let iRsocial = GridDirecciones.cells(iCoDire,4).getValue();
                                let iDireccion = GridDirecciones.cells(iCoDire,6).getValue();
                                let iMarker = new google.maps.Marker({
                                    map: map,
                                    position: AuxMarker.position,
                                    draggable: true,
                                    title: iDireccion + '\nCliente: ' + iRsocial,
                                    data: { codigo: iCoDire }
                                });
                                iMarker.addListener('click', MarkerOnClick);
                                Markers.set(iCoDire, iMarker);
                                AuxMarker.setMap(null);
                                AuxMarker = null;
                                GridDirecciones.cells(iCoDire,2).setValue('ic-done.svg^');
                                GridDirecciones.cells(iCoDire,3).setValue(1);
                            }
                        }
                    });
                }
                else {
                    let iRsocial = GridDirecciones.cells(iCoDire,4).getValue();
                    let iDireccion = GridDirecciones.cells(iCoDire,6).getValue();
                    let iMarker = new google.maps.Marker({
                        map: map,
                        position: AuxMarker.position,
                        draggable: true,
                        title: iDireccion + '\nCliente: ' + iRsocial,
                        data: { codigo: iCoDire }
                    });
                    iMarker.addListener('click', MarkerOnClick);
                    Markers.set(iCoDire, iMarker);
                    AuxMarker.setMap(null);
                    AuxMarker = null;
                    GridDirecciones.cells(iCoDire,2).setValue('ic-done.svg^');
                    GridDirecciones.cells(iCoDire,3).setValue(1);
                }
            }
            else {
                alert('No ha colocado el marcador para la dirección seleccionada');
            }
            break;
        default: break;
    }
}

IniciarComponentes = () => {
    console.log('%c*** Importación de coordenadas ***', 'background:#009688;color:#ffffff;cursor:pointer;font-size:13px;');
    //prepara el layout
    Layout = new dhtmlXLayoutObject(document.body, '2U');
        Layout.cells('a').setWidth(600);
        Layout.cells('a').setText('Clientes por distrito');
        Layout.cells('b').hideHeader();
        Layout.cells('b').attachHTMLString('<div id="map-canvas" class="map-canvas"></div>');
    Toolbar = Layout.attachToolbar();
        Toolbar.setIconsPath('/assets/images/icons/toolbar/');
        /*Toolbar.addText('lblPais',null,'País');
        Toolbar.addText('cmbPais', null, '<div class="cmb-pais" id="cmb-pais"></div>');
        Toolbar.addText('lblDepartamento',null,'Departamento');
        Toolbar.addText('cmbDepartamento', null, '<div class="cmb-pais" id="cmb-departamento"></div>');
        Toolbar.addText('lblProvincia',null,'Provincia');
        Toolbar.addText('cmbProvincia', null, '<div class="cmb-pais" id="cmb-provincia"></div>');
        Toolbar.addText('lblDistrito',null,'Distrito');
        Toolbar.addText('cmbDistrito', null, '<div class="cmb-pais" id="cmb-distrito"></div>');*/
        //Toolbar.addButton('BuscaDirecciones', null, 'Buscar', 'ic-search.svg', null);
        Toolbar.addText('lblVendedor',null,'Vendedor');
        Toolbar.addText('cmbVendedor', null, '<div class="cmb-pais" id="cmb-vendedor"></div>');
        Toolbar.addSeparator();
        Toolbar.addText('lblGuardar',null,'Una vez cargadas las coordenadas, utilice la opción ');
        Toolbar.addButton('GuardaCoordenadas', null, 'Guardar', 'ic-save-dis.svg', null);
        Toolbar.attachEvent('onClick', ToolbarOnClick);
    ToolbarMap = Layout.cells('b').attachToolbar();
        ToolbarMap.addText('mtLblDireccion',null,'Dirección');
        ToolbarMap.setIconsPath('/assets/images/icons/toolbar/');
        ToolbarMap.addInput('mtDireccion',null,null,400);
        ToolbarMap.addButton('BuscaCoordenadas', null, 'Buscar', 'ic-search.svg', null);
        ToolbarMap.addSeparator();
        ToolbarMap.addButton('GuardaMarcador', null, 'Confirmar', 'ic-save.svg', null);
        ToolbarMap.attachEvent('onClick', ToolbarMapOnClick);
    /*ComboPais = new dhtmlXCombo("cmb-pais", "cmbPais", 160);
    ComboDepartamento = new dhtmlXCombo("cmb-departamento", "cmbDepartamento", 160);
    ComboProvincia = new dhtmlXCombo("cmb-provincia", "cmbProvincia", 160);
    ComboDistrito = new dhtmlXCombo("cmb-distrito", "cmbDistrito", 160);
    //
    ComboPais.load('/coordenadas/geocode/lista-paises');
    ComboPais.attachEvent('onChange', ComboPaisOnChange);
    ComboDepartamento.attachEvent('onChange', ComboDepartamentoOnChange);
    ComboProvincia.attachEvent('onChange', ComboProvinciaOnChange);
    ComboDistrito.attachEvent('onChange', ComboDistritoOnChange);*/
    ComboVendedor = new dhtmlXCombo("cmb-vendedor", "cmbVendedor", 240);
    ComboVendedor.load('/coordenadas/geocode/lista-vendedores');
    ComboVendedor.attachEvent('onChange', ComboVendedorOnChange);
    //
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 18,
        center: {
            lat:-12.091675,
            lng:-77.027384
        }
    });
}