var pAccion, pPeriodo = '';
//estructuras
const formularioPeriodoStruct = [
    {type: 'settings', labelWidth: 60, inputWidth: 80, offsetLeft:15},
    {type: "combo", name: 'pmes', label: "Mes", options: [
        {text: 'Enero', value:'1'},
        {text: 'Febrero', value:'2'},
        {text: 'Marzo', value:'3'},
        {text: 'Abril', value:'4'},
        {text: 'Mayo', value:'5'},
        {text: 'Junio', value:'6'},
        {text: 'Julio', value:'7'},
        {text: 'Agosto', value:'8'},
        {text: 'Setiembre', value:'9'},
        {text: 'Octubre', value:'10'},
        {text: 'Noviembre', value:'11'},
        {text: 'Diciembre', value:'12'},
    ]},
    {type: "input", name: 'panio', label: "Año", inputWidth:160},
    {type: "combo", name: 'pestado', label: "Estado", options: [
        { text: 'Vigente', value: 'Vigente' },
        { text: 'Retirado', value: 'Retirado' }
    ]},
    {type: "block", blockOffset: 0, inputWidth:240, list: [
        {type: "button", name: 'fguardar', value: "Guardar"},
        {type: "newcolumn"},
        {type: "button", name: 'fcancelar', value: "Cancelar"}
    ]}
];

//grilla de periodos
cargarDatosGrilla = () => {
    mainLayout.cells("a").progressOn();
    grillaPeriodos.clearAll();
    grillaPeriodos.load(BASE_URL + 'MA010202/cargar-lista-periodos/' + usrJson.empresa, grillaPeriodosOnLoad);
}
grillaPeriodosOnLoad = () => {
    mainLayout.cells("a").progressOff();
}

//toolbar periodos
toolbarGrillaOnClick = (id) => {
    var co_periodo;
    switch(id) {
        case 'nuevo':
            pAccion = 'I';
            mainLayout.cells("b").expand();
            formularioPeriodo = mainLayout.cells("b").attachForm();
                formularioPeriodo.load(formularioPeriodoStruct);
                //formularioPeriodo.getInput('panio').attr('placeholder','Ingresa año');
                formularioPeriodo.attachEvent('onButtonClick', formularioPeriodoOnClick);
            break;
        case 'editar':
            pAccion = 'U';
            co_periodo = grillaPeriodos.getSelectedRowId();
            pPeriodo = co_periodo;
            if(co_periodo) {
                mainLayout.cells("b").expand();
                const params = {
                    empresa: usrJson.empresa,
                    periodo: co_periodo
                };
                $.post(BASE_URL + 'MA010202/cargar-datos-periodo', params, CargarDatosSuccess, 'json');
            }
            else alert('Primero debe elegi un periodo');
            break;
        case 'eliminar':
            co_periodo = grillaPeriodos.getSelectedRowId();
            if(co_periodo) {
                if(window.confirm('¿Seguro que desea eliminar el periodo?')) {
                    const params = {
                        empresa: usrJson.empresa,
                        periodo: co_periodo
                    };
                    $.post(BASE_URL + 'MA010202/eliminar-periodo', params, EliminarSuccess, 'json');
                }
            }
            else alert('Primero debe elegi un periodo');
            break;
        default: break;
    }
}

//formulario de periodos
formularioPeriodoOnClick = (id) => {
    switch(id) {
        case 'fguardar':
            const param = {
                modo: pAccion,
                mes: formularioPeriodo.getItemValue('pmes'),
                anio: formularioPeriodo.getItemValue('panio'),
                estado: formularioPeriodo.getItemValue('pestado'),
                nmes: formularioPeriodo.getCombo('pmes').getSelectedText(),
                empresa: usrJson.empresa,
                coperiodo: pPeriodo
            };
            $.post(BASE_URL + 'MA010202/guardar-periodo', param, GuardarPeriodoSuccess, 'json');
            // 
            break;
        case 'fcancelar':
            formularioPeriodo.setItemValue('panio', '');
            mainLayout.cells("b").collapse();
            break;
        default: break;
    }
}
GuardarPeriodoSuccess = (result) => {
    if(result.state == 'success') {
        dhtmlx.alert({
            title: "Operación completada",
            ok: "Aceptar",
            text: result.message
        });
        //actualizar la grilla
        cargarDatosGrilla();
        //esconder el formulario
        formularioPeriodo.setItemValue('panio', '');
        mainLayout.cells("b").collapse();
    }
    else {
        dhtmlx.alert({
            title: "Error",
            type: "alert-error",
            text: result.message
        });
    }
};
CargarDatosSuccess = (result) => {
    if(result.state == 'success') {
        const periodo = result.data.periodo;
        formularioPeriodo = mainLayout.cells("b").attachForm();
            formularioPeriodo.load(formularioPeriodoStruct);
            formularioPeriodo.attachEvent('onButtonClick', formularioPeriodoOnClick);
            //cargar los datos
            formularioPeriodo.setItemValue('panio', periodo.NU_ANHO);
            //
            const idxMes = formularioPeriodo.getCombo('pmes').getIndexByValue(periodo.NU_MES);
            formularioPeriodo.getCombo('pmes').selectOption(idxMes);
            const idxEstado = formularioPeriodo.getCombo('pestado').getIndexByValue(periodo.ES_VIGENCIA);
            formularioPeriodo.getCombo('pestado').selectOption(idxEstado);
    }
    else {
        dhtmlx.alert({
            title: "Error",
            type: "alert-error",
            text: result.message
        });
    }
}
EliminarSuccess = (result) => {
    if(result.state == 'success') {
        dhtmlx.alert({
            title: "Operación completada",
            ok: "Aceptar",
            text: result.message
        });
        cargarDatosGrilla();
    }
    else {
        dhtmlx.alert({
            title: "Error",
            type: "alert-error",
            text: result.message
        });
    }
}