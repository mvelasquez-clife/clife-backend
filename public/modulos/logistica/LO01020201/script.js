//toolbar principal
setSens = (inp, k) => {
    if (k == "min") {
        toolbarCalendar.setSensitiveRange(inp.value, null);
    } else {
        toolbarCalendar.setSensitiveRange(null, inp.value);
    }
}
toolbarPrincipalOnClick = (id) => {
    switch(id) {
        case 'calFiltra':
            CargarOrdenesCompra();
            break;
    }
}

//grid ordenes de compra
CargarOrdenesCompra = () => {
    tabbarPrincipal.tabs('ocs').progressOn();
    gridOrdenes.load(BASE_URL + 'LO01020201/cargar-lista-ordenes/' + usrJson.empresa + '/' + ipCalDesde.value + '/' + ipCalHasta.value, OrdenesCompraSuccess);
}

OrdenesCompraSuccess = () => {
    tabbarPrincipal.tabs('ocs').progressOff();
}

MuestraFormularioBusqueda = async () => {
    var output = await IniciarGridBusqueda(1, false, mainLayout);
    console.log(output);
}