Inicio = () => {
    mainLayout = tabbarinicio.cells("kardex3").attachLayout('1C');
    maink3 = mainLayout.cells('a').attachLayout('2E');
    maink3.cells('a').hideHeader();
    maink3.cells('b').hideHeader();
    maink3.cells('a').setHeight(50);
    myFormdatos = maink3.cells('a').attachForm(f_kardex_3);
    maingridk3 = maink3.cells('b').attachGrid();
    maingridk3.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    maingridk3.setHeader('F.Movimiento,Tipo Mov.,Cod.Producto,Des.Producto,Lote,F.Vencimiento, Cant Ingreso, Cant Egreso, Costo Ingreso, Costo Promedio');
    // maingridk3.setColumnIds("desc,codprod,estado,inicio,fin,nreg,fcos");
    maingridk3.setInitWidths('400,200,300,300,300,300,300,300,300,300,300,300,100,100,100,200,100,100,100,130,100,100,100,100,100');
    maingridk3.init(); 
    myFormdatos.attachEvent("onButtonClick", async (name) => {
        switch (name) {
            case '_r_busc_k3':
                maink3.cells('b').progressOn();               
            break;
            default:
                null;
                break;
        }
    });  
};