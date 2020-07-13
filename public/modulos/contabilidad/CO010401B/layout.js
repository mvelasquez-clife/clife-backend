function IniciarComponentes () {
    layout = new dhtmlXLayoutObject(document.body, '1C');
        layout.cells('a').hideHeader();
    tabbar = layout.cells('a').attachTabbar();
        tabbar.addTab('voucher', 'Voucher', null, null, true);
        tabbar.addTab('busqueda', 'Búsqueda general de documentos');
        tabbar.addTab('resumen', 'Resumen de vouchers');
        tabbar.addTab('adjuntos', 'Documentos adjuntos');
    // tabbar voucher
    ConfiguraTabbarVoucher();
    // tabbar de busqueda
    ConfiguraTabbarBusqueda();
    // tabbar de resumen
    ConfiguraTabbarResumen();
    // tabbar documentos adjuntados
    ConfiguraTabbarAdjuntos();
}