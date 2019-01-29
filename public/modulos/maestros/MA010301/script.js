//tabbar
tabsPrincipalSelected = (id,lastId) => {
    switch(id) {
        case 'pais':
            tabsPrincipal.tabs('departamentos').disable();
            tabsPrincipal.tabs('provincias').disable();
            tabsPrincipal.tabs('distritos').disable();
            break;
        case 'departamentos':
            tabsPrincipal.tabs('provincias').disable();
            tabsPrincipal.tabs('distritos').disable();
            break;
        case 'provincias':
            tabsPrincipal.tabs('distritos').disable();
            break;
        default: break;
    }
    return true;
}

//grid paises
CargarListaPaises = () => {
    gridPaises.clearAll();
    tabsPrincipal.tabs('pais').progressOn();
    gridPaises.load(BASE_URL + 'MA010301/cargar-paises', CargarPaisesSuccess);
}
CargarPaisesSuccess = () => {
    tabsPrincipal.tabs('pais').progressOff();
    gridPaises.attachEvent('onRowDblClicked', gridPaisesDobleClick);
}
gridPaisesDobleClick = (rowId, colId) => {
    tabsPrincipal.tabs('departamentos').enable();
    tabsPrincipal.tabs('departamentos').setActive();
    const pais = rowId;
    CargarDepartamentos(pais);
}

//grid departamentos
CargarDepartamentos = (pais) => {
    tabsPrincipal.tabs('departamentos').progressOn();
    gridDepartamentos.clearAll();
    gridDepartamentos.load(BASE_URL + 'MA010301/cargar-departamentos/' + pais, CargarDepartamentosSuccess);
}
CargarDepartamentosSuccess = () => {
    tabsPrincipal.tabs('departamentos').progressOff();
    gridDepartamentos.attachEvent('onRowDblClicked', gridDepartamentosDobleClick);
}
gridDepartamentosDobleClick = (rowId, colId) => {
    tabsPrincipal.tabs('provincias').enable();
    tabsPrincipal.tabs('provincias').setActive();
    const pais = gridDepartamentos.cells(rowId,3).getValue();
    const departamento = gridDepartamentos.cells(rowId,0).getValue();
    CargarProvincias(pais, departamento);
}

//grid provincias
CargarProvincias = (pais, departamento) => {
    tabsPrincipal.tabs('provincias').progressOn();
    gridProvincias.clearAll();
    gridProvincias.load(BASE_URL + 'MA010301/cargar-provincias/' + pais + '/' + departamento, CargarProvinciasSuccess);
}
CargarProvinciasSuccess = () => {
    tabsPrincipal.tabs('provincias').progressOff();
}

//toolbar
toolbarGrillaOnClick = async (id) => {
    switch(id) {
        case 'permisos':
            const windowId = 151;
            var output = await IniciarFormularioSeguridad(windowId, mainLayout);
            const jOutput = JSON.parse(output);
            if(jOutput && jOutput.result == 'S') {
                toolbar.enableItem('nah');
            }
            else {
                toolbar.disableItem('nah');
            }
            break;
        case 'nah':
            alert('Alerta de prueba');
            break;
        default: break;
    }
}