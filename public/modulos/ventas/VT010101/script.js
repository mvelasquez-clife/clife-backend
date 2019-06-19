let ToolbarItemsToHide = ['FzaVtaSerieLabel','FzaVtaSerieCodigo','FzaVtaSerieNombre','FzaVtaEstadoLabel','FzaVtaEstado'];
let ToolbarItemsToDisable = ['FzaVtaCodigo','FzaVtaNombre','FzaVtaSerieCodigo','FzaVtaSerieNombre','FzaVtaEstado'];
IniciarComponentes = () => {
    Layout = new dhtmlXLayoutObject(document.body, '1C');
        Layout.cells('a').hideHeader();
    Toolbar = Layout.cells('a').attachToolbar();
        Toolbar.setIconsPath('/assets/images/icons/toolbar/');
        Toolbar.addText('FzaVtaLabel',null,'<b>Fuerza de Venta</b>');
        Toolbar.addInput('FzaVtaCodigo',null,null,60);
        Toolbar.addButton('FzaVtaBusca', null, null, 'ic-search.svg', null);
        Toolbar.addInput('FzaVtaNombre',null,null,200);
        Toolbar.addText('FzaVtaSerieLabel',null,'Serie');
        Toolbar.addInput('FzaVtaSerieCodigo',null,null,60);
        Toolbar.addInput('FzaVtaSerieNombre',null,null,60);
//color:#f44336
//ic-check-dis.svg
        Toolbar.addText('FzaVtaEstadoLabel',null,'Estado');
        Toolbar.addButtonTwoState('FzaVtaEstado', null, '<span style="color:#388e3c;">Vigente</span>', 'ic-check.svg', null);
        //ocultar iconos
        for(let i in ToolbarItemsToHide) Toolbar.hideItem(ToolbarItemsToHide[i]);
        for(let i in ToolbarItemsToDisable) Toolbar.disableItem(ToolbarItemsToDisable[i]);
}