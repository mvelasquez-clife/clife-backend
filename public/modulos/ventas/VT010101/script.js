let ToolbarItemsToHide = ['FzaVtaSerieLabel','FzaVtaSerieCodigo','FzaVtaSerieNombre','FzaVtaEstadoLabel','FzaVtaEstado'];
let ToolbarItemsToDisable = ['FzaVtaCodigo','FzaVtaNombre','FzaVtaSerieCodigo','FzaVtaSerieNombre','FzaVtaEstado'];

let FuerzaVentaRes;

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
        Toolbar.addText('FzaVtaEstadoLabel',null,'Estado');
        Toolbar.addButtonTwoState('FzaVtaEstado', null, '<span style="color:#388e3c;">Vigente</span>', 'ic-check.svg', 'ic-check.svg');
        for(let i in ToolbarItemsToHide) Toolbar.hideItem(ToolbarItemsToHide[i]);
        for(let i in ToolbarItemsToDisable) Toolbar.disableItem(ToolbarItemsToDisable[i]);
        Toolbar.attachEvent('onClick', ToolbarOnClick);
}
//eventos
ToolbarOnClick = async (id) => {
    switch(id) {
        case 'FzaVtaBusca':
            let output = await IniciarGridBusqueda(15, false, Layout);
            if(output) {
                FuerzaVentaRes = output.seleccion[0];
                for(let i in ToolbarItemsToHide) Toolbar.showItem(ToolbarItemsToHide[i]);
                Toolbar.setValue('FzaVtaCodigo', FuerzaVentaRes.codigo);
                Toolbar.setValue('FzaVtaNombre', FuerzaVentaRes.nombre);
                Toolbar.setValue('FzaVtaSerieCodigo', FuerzaVentaRes.cserie);
                Toolbar.setValue('FzaVtaSerieNombre', FuerzaVentaRes.nserie);
                if(FuerzaVentaRes.estado == 'Vigente') {
                    Toolbar.setItemText('FzaVtaEstado', '<span style="color:#388e3c;">' + FuerzaVentaRes.estado + '</span>');
                    Toolbar.setItemImageDis('FzaVtaEstado', 'ic-check.svg');
                    Toolbar.setItemState('FzaVtaEstado', false);
                }
                else {
                    Toolbar.setItemText('FzaVtaEstado', '<span style="color:#f44336;">' + FuerzaVentaRes.estado + '</span>');
                    Toolbar.setItemImageDis('FzaVtaEstado', 'ic-check-dis.svg');
                    Toolbar.setItemState('FzaVtaEstado', true);
                }
            }
            break;
        default: break;
    }
}
