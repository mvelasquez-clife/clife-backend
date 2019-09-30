const structs = {
    FormUbicacion: [
        {type: 'settings', labelWidth: 75, offsetLeft: 10, offsetTop: 10},
        {type: 'hidden', name: 'frCliente'},
        {type: 'hidden', name: 'frCodigo'},
        {type: 'input', label: 'Ubigeo', name: 'frUbigeo', inputWidth: 160},
        {type: 'input', label: 'Dirección', name: 'frDireccion', inputWidth: 400},
        {type: 'button', value: 'Buscar', name: 'btBuscar', offsetLeft: 86},
        {type: 'container', name: 'mapCanvas', label: 'Ubicación', inputWidth: 960, inputHeight: 400},
        {type: 'input', label: 'Latitud', name: 'frLatitud', inputWidth: 120},
        {type: 'input', label: 'Longitud', name: 'frLongitud', inputWidth: 120},
        {type: 'input', label: 'Dir. SUNAT', name: 'frDireSunat', inputWidth: 480},
        {type: 'block', offsetLeft: 55, offsetTop: 0, list: [
            {type: 'button', value: 'Guardar ubicación', name: 'btGuardar'},
            {type: 'newcolumn'},
            {type: 'button', value: 'Observar', name: 'btObservar'}
        ]}
    ]
};

GridClientesOnLoad = () => {
    let NroFilas = GridClientes.getRowsNum();
    for(let i = 0; i < NroFilas; i++) {
        let iRowId = GridClientes.getRowId(i);
        GridClientes.setCellTextStyle(iRowId,0,'color:#1565c0;cursor:pointer;text-decoration:underline;');
    }
}
ToolbarOnClick = async (id) => {
    switch(id) {
        case 'BuscaVendedor':
            let output = await IniciarGridBusqueda(2, false, Layout);
            if(output) {
                VendedorSeleccionado = output.seleccion[0];
                Toolbar.setValue('CodigoVendedor', VendedorSeleccionado.codigo);
                Toolbar.setValue('NombreVendedor', VendedorSeleccionado.nombre);
                GridClientes.clearAll();
                GridClientes.load('/coordenadas/carga-lista-clientes/' + VendedorSeleccionado.codigo + '/' + usrJson.empresa, GridClientesOnLoad);
            }
            break;
        default: break;
    }
}
GridClientesOnRowSelect = async (rowId, colId) => {
    GridDirecciones.clearAll();
    let cliente = GridClientes.cells(rowId,0).getValue();
    Layout.cells('c').expand();
    GridDirecciones.load('/coordenadas/carga-lista-direcciones/' + cliente, GridDireccionesOnLoad);
}
GridDireccionesOnLoad = () => {
    let NroFilas = GridDirecciones.getRowsNum();
    for(let i = 0; i < NroFilas; i++) {
        let iRowId = GridDirecciones.getRowId(i);
        let iEstado = GridDirecciones.cells(iRowId,3).getValue();
        let iLatitud = GridDirecciones.cells(iRowId,4).getValue();
        let iLongitud = GridDirecciones.cells(iRowId,5).getValue();
        if(iLatitud != '' && iLongitud != '') {
            GridDirecciones.setRowColor(iRowId,'#c8e6c9');
        }
        else {
            GridDirecciones.setRowColor(iRowId,'#ffcdd2');
        }
        if(iEstado != 'Vigente') {
            GridDirecciones.setCellTextStyle(iRowId,1,'color:#e53935;cursor:pointer;text-decoration:underline;');
            GridDirecciones.setCellTextStyle(iRowId,2,'color:#e53935;');
        }
        else {
            GridDirecciones.setCellTextStyle(iRowId,1,'color:#1565c0;cursor:pointer;text-decoration:underline;');
        }
    }
}
FormUbicacionOnButtonClick = (button) => {
    switch(button) {
        case 'btBuscar':
            CalcularCoordenadas();
            break;
        case 'btGuardar':
            GuardarInformacionGeografica();
            break;
        case 'btObservar':
            ObservarDireccion();
            break;
        default: break;
    }
}
function MarkerDragEnd(event) {
    FormUbicacion.setItemValue('frLatitud', event.latLng.lat());
    FormUbicacion.setItemValue('frLongitud', event.latLng.lng());
}
CalcularCoordenadas = () => {
    if(Marker) {
        Marker.setMap(null);
    }
    var direccion = FormUbicacion.getItemValue('frDireccion');
    if(direccion != '') {
        geocoder.geocode({'address': direccion}, function(results, status) {
            if (status === 'OK') {
                map.setCenter(results[0].geometry.location);
                Marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location,
                    draggable: true
                });
                Marker.addListener('dragend', MarkerDragEnd);
                FormUbicacion.setItemValue('frLatitud', results[0].geometry.location.lat());
                FormUbicacion.setItemValue('frLongitud', results[0].geometry.location.lng());
            }
            else {
                alert('No se pudo calcular las coordenadas: ' + status);
            }
        });
    }
}
GuardarInformacionGeografica = async () => {
    let result;
    let iCliente = FormUbicacion.getItemValue('frCliente');
    try {
        result = await $.ajax({
            url: '/coordenadas/guardar-info-coordenadas',
            method: 'post',
            data: {
                cliente: iCliente,
                direccion: FormUbicacion.getItemValue('frCodigo'),
                latitud: FormUbicacion.getItemValue('frLatitud'),
                longitud: FormUbicacion.getItemValue('frLongitud'),
                dsunat: FormUbicacion.getItemValue('frDireSunat')
            },
            dataType: 'json'
        });
        if(result.error) {
            alert(result.error);
            return;
        }
        GridDirecciones.clearAll();
        GridDirecciones.load('/coordenadas/carga-lista-direcciones/' + iCliente, GridDireccionesOnLoad);
        alert('Coordenadas almacenadas!');

    }
    catch(err) {
        console.error(err);
        return;
    }
}
ObservarDireccion = async () => {
    let result;
    let iCliente = FormUbicacion.getItemValue('frCliente');
    let iDireccion = FormUbicacion.getItemValue('frCodigo');
    try {
        result = await $.ajax({
            url: '/coordenadas/observar-direccion',
            method: 'post',
            data: {
                cliente: iCliente,
                direccion: iDireccion
            },
            dataType: 'json'
        });
        if(result.error) {
            alert(result.error);
            return;
        }
        GridDirecciones.clearAll();
        GridDirecciones.load('/coordenadas/carga-lista-direcciones/' + iCliente, GridDireccionesOnLoad);
        alert('Dirección observada!');

    }
    catch(err) {
        console.error(err);
        return;
    }
}
GridDireccionesOnRowSelect = async (rowId, colId) => {
    Layout.cells('b').detachObject();
    FormUbicacion = Layout.cells('b').attachForm();
        FormUbicacion.loadStruct(structs.FormUbicacion);
    let result;
    try {
        result = await $.ajax({
            url: '/coordenadas/info-direccion',
            method: 'post',
            data: { codireccion: rowId },
            dataType: 'json'
        });
        if(result.error) {
            alert(result.error);
            return;
        }
        let direccion = result.data.direccion;
        FormUbicacion.setItemValue('frCliente', direccion.cliente);
        FormUbicacion.setItemValue('frCodigo', direccion.codigo);
        FormUbicacion.setItemValue('frUbigeo', direccion.ubigeo);
        FormUbicacion.setItemValue('frDireccion', direccion.direccion);
        FormUbicacion.setItemValue('frLatitud', direccion.latitud);
        FormUbicacion.setItemValue('frLongitud', direccion.longitud);
        FormUbicacion.setItemValue('frDireSunat', result.data.dsunat);
        FormUbicacion.attachEvent('onButtonClick', FormUbicacionOnButtonClick);
        //
        let center = {
            lat:-12.091675,
            lng:-77.027384
        };
        if(direccion.latitud && direccion.longitud && direccion.latitud != '' && direccion.longitud != '') {
            center = {
                lat: parseFloat(direccion.latitud),
                lng: parseFloat(direccion.longitud)
            };
        }
        let MapId = FormUbicacion.getContainer('mapCanvas').id;
        map = new google.maps.Map(document.getElementById(MapId), {
            zoom: 18,
            center: center
        });
        if(direccion.latitud != '' && direccion.longitud != '') {
            Marker = new google.maps.Marker({
                map: map,
                position: center,
                draggable: true
            });
            Marker.addListener('dragend', MarkerDragEnd);
        }
        geocoder = new google.maps.Geocoder();
    }
    catch(err) {
        console.error(err);
    }
}

IniciarComponentes = () => {
    console.log('%c*** Tablero de avance de ventas ***', 'background:#009688;color:#ffffff;cursor:pointer;font-size:13px;');
    //prepara el layout
    Layout = new dhtmlXLayoutObject(document.body, '3J');
        Layout.cells('a').setWidth(420);
        Layout.cells('a').setText('Seleccione un cliente');
        Layout.cells('c').setText('Seleccione una direccion');
        Layout.cells('c').collapse();
    Toolbar = Layout.attachToolbar();
        Toolbar.setIconsPath('/assets/images/icons/toolbar/');
        Toolbar.addText('lblVendedor',null,'Vendedor');
        Toolbar.addInput('CodigoVendedor', null, null, 80);
        Toolbar.addInput('NombreVendedor', null, null, 320);
        Toolbar.addButton('BuscaVendedor', null, 'Buscar', 'ic-search.svg', null);
        Toolbar.attachEvent('onClick', ToolbarOnClick);
    GridClientes = Layout.cells('a').attachGrid();
        GridClientes.setIconsPath('/assets/images/icons/grid/');
        GridClientes.setHeader('RUC,Razón Social,Nombre Comercial');
        GridClientes.setInitWidths('80,240,80');
        GridClientes.setColTypes('rotxt,rotxt,rotxt');
        GridClientes.setColAlign('right,left,left');
        GridClientes.init();
        GridClientes.attachEvent('onRowSelect', GridClientesOnRowSelect);
    GridDirecciones = Layout.cells('c').attachGrid();
        GridDirecciones.setIconsPath('/assets/images/icons/grid/');
        GridDirecciones.setHeader(',Ubigeo,Direccion,,,');
        GridDirecciones.setInitWidths('20,98,300,0,0,0');
        GridDirecciones.setColTypes('img,rotxt,rotxt,rotxt,ron,ron');
        GridDirecciones.setColAlign('center,left,left,left,left,right');
        GridDirecciones.init();
        GridDirecciones.attachEvent('onRowSelect', GridDireccionesOnRowSelect);
}