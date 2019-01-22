grillaPrincipalOnLoad = () => {
    mainLayout.cells("a").progressOff();
    dhtmlx.message({
		text: "Carga de datos completada",
		expire: -1
	})
}
grillaPrincipalDobleClic = (rowId, colId) => {
    if(colId == 0) {
        const nombre = grillaPrincipal.cells(rowId, 2).getValue();
        alert('Seleccionaste a ' + nombre);
    }
}