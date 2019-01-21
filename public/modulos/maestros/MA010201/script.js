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
    {type: "calendar", name: 'pinicio', label: "Fe.Inicio", inputWidth:160, dateFormat:'%d/%m/%Y'},
    {type: "calendar", name: 'pfin', label: "Fe.Fin", inputWidth:160, dateFormat:'%d/%m/%Y'},
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

//toolbar
toolbarGrillaOnClick = (id) => {
    pPeriodo = grillaPeriodos.getSelectedRowId();
console.log(pPeriodo);
    switch(id) {
        case 'nuevo':
            pAccion = 'I';
            MostrarFormulario();
            break;
        case 'editar':
            pAccion = 'U';
            if(pPeriodo) {
                MostrarFormulario();
                //cargar los datos del periodo
                const params = {
                    empresa: usrJson.empresa,
                    periodo: pPeriodo
                };
                $.post(BASE_URL + 'MA010202/cargar-datos-periodo', params, CargarDatosSuccess, 'json');
            }
            else {
                alert('Primero debe elegir un periodo');
            }
            break;
        case 'eliminar':
            if(pPeriodo) {
                dhtmlx.confirm({
                    title: "Eliminar periodo",
                    type: "confirm-error",
                    text: "Está a punto de eliminar un periodo. No se podrán deshacer los cambios, ¿está seguro?",
                    ok: 'Sin miedo',
                    cancel: 'No',
                    callback: (respuesta) => {
                        if(respuesta) {
                            const params = {
                                empresa: usrJson.empresa,
                                periodo: pPeriodo
                            };
                            $.post(BASE_URL + 'MA010202/eliminar-periodo', params, EliminarSuccess, 'json');
                            mainLayout.cells('a').progressOn();
                        }
                    }
                });
            }
            else {
                alert('Primero debe elegir un periodo');
            }
            break;
        default: break;
    }
}

//formulario
MostrarFormulario = () => {
    modalFormulario = mainLayout.dhxWins.createWindow('modalFormulario',0,0,640,480);
        modalFormulario.center();
        modalFormulario.keepInViewport(true);
        modalFormulario.setModal(true);
        modalFormulario.setText('Nuevo periodo');
        modalFormulario.button('close').hide();
        modalFormulario.button('park').hide();
        modalFormulario.button('minmax').hide();
    formularioPeriodo = modalFormulario.attachForm();
        formularioPeriodo.attachEvent('onButtonClick', formularioPeriodoOnClick);
        formularioPeriodo.load(formularioPeriodoStruct);
}
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
                coperiodo: pPeriodo,
                pdia: formularioPeriodo.getCalendar('pinicio').getDate(true),
                udia: formularioPeriodo.getCalendar('pfin').getDate(true)
            };
            $.post(BASE_URL + 'MA010202/guardar-periodo', param, GuardarPeriodoSuccess, 'json');
            modalFormulario.progressOn();
            break;
        case 'fcancelar':
            modalFormulario.close();
            break;
        default: break;
    }
}
CargarDatosSuccess = (result) => {
    if(result.state == 'success') {
        const periodo = result.data.periodo;
        //cargar los datos
        formularioPeriodo.setItemValue('panio', periodo.NU_ANHO);
        const idxMes = formularioPeriodo.getCombo('pmes').getIndexByValue(periodo.NU_MES);
        formularioPeriodo.getCombo('pmes').selectOption(idxMes);
        const idxEstado = formularioPeriodo.getCombo('pestado').getIndexByValue(periodo.ES_VIGENCIA);
        formularioPeriodo.getCombo('pestado').selectOption(idxEstado);
        formularioPeriodo.setItemValue('pinicio', periodo.FE_PRIMER_DIA);
        formularioPeriodo.setItemValue('pfin', periodo.FE_ULTIMO_DIA);
    }
    else {
        dhtmlx.alert({
            title: "Error",
            type: "alert-error",
            text: result.message
        });
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
        modalFormulario.close();
    }
    else {
        dhtmlx.alert({
            title: "Error",
            type: "alert-error",
            text: result.message
        });
    }
    modalFormulario.progressOff();
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
    mainLayout.cells('a').progressOff();
}