const structs = {
    formFiltro: [
        { type: 'settings', position: 'label-top' },
        { type: 'combo',offsetLeft: 8,name: 'periodo', width: '200', label: 'Periodo :', connector: BASE_URL + 'BA010305/combo-periodos/' + usrJson.empresa },
        { type: 'input', offsetLeft: 8, name: 'vendedor', width: '200', label: 'Nombre Vendedor:', value: 'Todos' },
        { type: 'hidden', name: 'codigo', value: 0 },
        { type: 'button', width: 120, offsetLeft: 6, className: 'bt-big', value: '<img src="/assets/images/icons/anim-search.svg"><span>Buscar</span>' ,name: 'buscar' }
    ]
};

//formulario
formFiltroOnFocus = async (id) => {
    if(id == 'vendedor') {
        var output = await IniciarGridBusqueda(2, false, mainLayout);
        if(output) {
            const recaudador = output.seleccion[0];
            formFiltro.setItemValue('codigo', recaudador.codigo);
            formFiltro.setItemValue('vendedor', recaudador.nombre);
        }
    }
}