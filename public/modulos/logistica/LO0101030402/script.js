var mainLayout,myFormdatos,maingrid,myToolbardatos;

Iniciokardex = () => {
    mainLayout = new dhtmlXLayoutObject(document.body, '2E'); 
    mainLayout.cells('a').hideHeader();
    mainLayout.cells('b').hideHeader();
    mainLayout.cells('a').setHeight(120);
    myFormdatos = mainLayout.cells('a').attachForm(f_filtro_producto);    
    myToolbardatos = mainLayout.cells('b').attachToolbar();
    myToolbardatos.setIconsPath('/assets/images/icons/');
    myToolbardatos.addButton('__comp',null,'Permisos',"unlock.png",null);
    myToolbardatos.addButton('__traz',null,'Exportar Data',"download.png",null);
    myToolbardatos.setAlign("left");
    myToolbardatos.setIconSize(48);
    maingrid = mainLayout.cells('b').attachGrid(); 
    maingrid.setHeader('Clase,Familia,Subfamilia,Marca,Submarca,Producto,Descripción Producto,Inicial,Ingresos,Egresos,Stock,Saldo,Disponible,Reservado,Cuarentena,En Fabricación,Cod.Clase,Cod.Familia,Cod.Subfamilia,Cod.Marca,Cod.Submarca');    
    maingrid.setInitWidths('100,100,100,100,100,100,300,100,100,100,100,100,100,100,100,100,100,100,100,100,100');
    maingrid.setColAlign('left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left');
    maingrid.setColTypes('ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro'); 
    maingrid.init();    
    myFormdatos.attachEvent("onButtonClick", async (name) => {
        switch (name) {
            case '_r_busc_k3':
                periodo = myFormdatos.getItemValue('_kd_per'),
                almacen = myFormdatos.getItemValue('_kd_alm'),
                codprod =  null,////myFormdatos.getItemValue('_kd_cod_prod'),
                deprod = myFormdatos.getItemValue('_kd_nombre'),
                clase =  null,//myFormdatos.getItemValue('_kd_clase'),
                familia =  null,//myFormdatos.getItemValue('_kd_fam'),
                sfamilia = null,//myFormdatos.getItemValue('_kd_sfam'),
                marca = null,//myFormdatos.getItemValue('_kd_mar'),
                smarca = null,//myFormdatos.getItemValue('_kd_smar'),
                barra = null,//myFormdatos.getItemValue('_kd_cod_bar'),
                buscarkardex(periodo,almacen,codprod,deprod,clase,familia,sfamilia,marca,smarca,barra);
                break;
            default:
                null;
                break;
        }
    });  
}


buscarkardex = (periodo,almacen,codprod,deprod,clase,familia,sfamilia,marca,smarca,barra) => {
    maingrid.clearAll(); 
    mainLayout.cells('b').progressOn();
    // maingrid.load( BASE_URL + 'LO0101030402/mostrar-kardex/'+usrJson.empresa+'/'+almacen+'/'+periodo+'/'+codprod+'/'+deprod+'/'+clase+'/'+familia).then(function (text) {
    maingrid.load( BASE_URL + 'LO0101030402/mostrar-kardex/'+usrJson.empresa+'/'+almacen+'/'+periodo+'/'+null+'/'+deprod+'/'+null+'/'+null+'/'+null+'/'+null+'/'+null+'/'+null).then(function (text) {
    mainLayout.cells('b').progressOff();
    });
};