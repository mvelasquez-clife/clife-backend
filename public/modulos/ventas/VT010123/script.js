CargarDatosGridTipos = () => {
    gridTipos.clearAll();
    mainTabbar.tabs('promociones').progressOn();
    gridTipos.load('/api/VT010123/lista-bonificaciones/' + usrJson.empresa, gridTiposOnLoad);
}
gridTiposOnLoad = () => {
    mainTabbar.tabs('promociones').progressOff();
}

console.log('%cINICIADO EL MÓDULO DE VENTAS', 'background:#009688;color:#f8f8f8;text-decoration:underline;padding:4px;margin:0;');
console.log('%cHora inicio: ' + (new Date().toLocaleString('es-PE', {})), 'background:#3f51b5;color:#ffffff;padding:4px;');