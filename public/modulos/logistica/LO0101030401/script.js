var filtro,buscador,myGrid_resumen,myGrid_movimiento,myGrid_cambio,de_transaccion,myGrid_detalleprod,desc_producto,win_detalle,transaccion,myGrid_pedres,myToolbar_pedres,producto,almacen,periodo,myToolbar_resumen,Winid_,Wind_,myFormdatos_transaccion,maingridalma_2,maingridtran,codigoprod,maingridalma,mainLayout_tran,mainLayout,mainLayout_prod,myFormdatos,maingridprod,mainLayout_per,myFormdatos_periodo,myToolbardatos_periodo;
var inicio='N',
Iniciokardex = () => {
    mainLayout = new dhtmlXLayoutObject(document.body, '3U'); 
    mainLayout.cells('a').setWidth(800);
    mainLayout_prod= mainLayout.cells('a').attachLayout('2E');
    mainLayout_prod.cells('a').hideHeader();
    mainLayout_prod.cells('b').hideHeader();
    myFormdatos = mainLayout_prod.cells('a').attachForm(f_filtro_producto);
    mainLayout_prod.cells('a').setHeight(50);
    maingridprod = mainLayout_prod.cells('b').attachGrid(); 
    maingridprod.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    maingridprod.setHeader('Producto,Cod Producto,Clase,Familia,Cod.Barras Prod.,Marca,Sub Marca,Clase Bien Serv.,Tipo Bien Serv.,Nombre Inci,De Nombre Reg San, Nu Reg Sanit,Codigo Integral,De Principio Activo, St Analisis, Codigo Cas, St Activo FIjo,St Analisis Microb,St Quim Fiscal,St Gestion Stock, St Archivos,St Formula,St Sustituto');
    maingridprod.setColumnIds("desc,codprod,estado,inicio,fin,nreg,fcos");
    maingridprod.setInitWidths('400,200,300,300,300,300,300,300,300,300,300,300,100,100,100,200,100,100,100,130,100,100,100,100,100');
    maingridprod.setColTypes("ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro, ro,ro,ro,ch,ro,ch,ch,ch,ch,ch,ch,ch"); 
    maingridprod.setColAlign('left,center,left,left,center,left,left,left,left,left,left,left,center,center,center,center,center,center,center,center,center,center,center,center,center');
    maingridprod.setEditable(false);
    maingridprod.init();
    mainLayout_per = mainLayout.cells('b').attachLayout('3E');
    mainLayout_per.cells('a').hideHeader();
    mainLayout_per.cells('c').hideHeader();
    mainLayout_per.cells('a').setHeight(50);
    myFormdatos_periodo = mainLayout_per.cells('a').attachForm(f_periodo);
    maingridalma = mainLayout_per.cells('b').attachGrid(); 
    mainLayout_per.cells('b').setText('Almacen');
    mainLayout_per.cells('b').setHeight(150);
    myToolbardatos_periodo = mainLayout_per.cells('c').attachToolbar();
    myToolbardatos_periodo.setIconsPath('/assets/images/icons/');
    myToolbardatos_periodo.addButton('pedres',null,'<b>Reserva de pedidos - Productos Terminados</b>',"ic-look.png","");  
    myToolbardatos_periodo.addButton('insures',null,'<b>Reserva de Insumos y Empaques</b>',"ic-resumen.png","");  
    myToolbardatos_periodo.addButton('detalle',null,'<b>Detalle de reservas</b>',"ic-buskard.png",""); 
    myToolbardatos_periodo.attachEvent('onClick', Onclick); 
    maingridper = mainLayout_per.cells('c').attachGrid(); 
    maingridper.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    maingridper.setHeader('Real,Cuarentena,Reservado,Disponible,Fabricación,St.Disponible, Promedio');
    maingridper.setInitWidths('100,100,100,100,100,100,100');
    maingridper.setColAlign('right,right,right,right,right,center,right');
    maingridper.setColTypes("edn,edn,edn,edn,edn,ch,edn");    
    maingridper.setNumberFormat("0,000.00",0,".",",");   
    maingridper.setNumberFormat("0,000.00",1,".",",");   
    maingridper.setNumberFormat("0,000.00",2,".",",");   
    maingridper.setNumberFormat("0,000.00",3,".",",");  
    maingridper.setNumberFormat("0,000.00",4,".",",");  
    maingridper.setNumberFormat("0,000.00",6,".",",");  
    maingridper.setEditable(false);
    maingridper.init();
    maingridalma.setHeader('Código,Almacen,Saldo,Periodo,Producto');
    maingridalma.setInitWidths('100,400,200,0,0');
    maingridalma.setColAlign('center,left,right,left,left');
    maingridalma.setColumnIds("codalm,alma,saldo,peri,codprod");
    maingridalma.setColTypes("ro,ro,edn,ro,ro");    
    maingridalma.setNumberFormat("0,000.00",2,".",",");   
    maingridalma.setEditable(false);
    maingridalma.init();
    mainLayout_tran= mainLayout.cells('c').attachLayout('3U');
    mainLayout_info = mainLayout_tran.cells('a').attachLayout('2E');
    myFormdatos_transaccion = mainLayout_info.cells('a').attachForm(f_transaccion);  
    mainLayout_info.cells('a').hideHeader();
    mainLayout_info.cells('b').hideHeader();
    mainLayout_tran.cells('b').hideHeader();
    mainLayout_tran.cells('c').hideHeader();
    mainLayout_info.cells('a').setWidth(410);
    mainLayout_info.cells('b').setHeight(30);
    myToolbardatos_info = mainLayout_info.cells('b').attachToolbar();
    myToolbardatos_info.setIconsPath('/assets/images/icons/');
    myToolbardatos_info.addButton('cambio',null,'<b>Cambio de Ubicaciones</b>',"ic-giveback.png","");  
    myToolbardatos_info.addButton('movimiento',null,'<b>Ver todos los movimientos</b>',"ic-buscar.png","");  
    myToolbardatos_info.attachEvent('onClick', Onclickinfo); 
    maingridtran = mainLayout_tran.cells('b').attachGrid(); 
    maingridalma_2 = mainLayout_tran.cells('c').attachGrid(); 
    maingridtran.setHeader('Ubicación,Lote,Inicial,Saldo,F.Vencimiento,Real, Cuarentena,Reserva,Análisis,Prioridad,F.Salida Programada');
    maingridtran.setInitWidths('100,100,100,100,120,100,100,100,100,100,150');
    maingridtran.setColAlign('center,center,right,right,center,right,right,right,center,center,center');
    maingridtran.setColTypes("ro,ro,edn,edn,ro,edn,edn,edn,edn,center,center");    
    maingridtran.setNumberFormat("0,000.00",2,".",",");   
    maingridtran.setNumberFormat("0,000.00",3,".",",");   
    maingridtran.setNumberFormat("0,000.00",5,".",",");  
    maingridtran.setNumberFormat("0,000.00",6,".",",");  
    maingridtran.setNumberFormat("0,000.00",7,".",",");  
    maingridtran.setNumberFormat("0,000.00",8,".",",");  
    maingridtran._in_header_stat_sum=function(tag,index,data){       
        var calck=function(){                              
            var sum=0;                                     
            this.forEachRow(function(id){                   
                sum+=this.cellById(id,index).getValue()*1;     
            })
        return this._aplNF(sum,0);
        }
        this._stat_in_header(tag,calck,index,data);            
    }
    maingridtran.attachFooter(",,,#stat_sum,,#stat_sum,#stat_sum",["","","","text-align:right;",,"text-align:right;","text-align:right;"]);
    maingridtran.setEditable(false);
    maingridtran.init(); 
    maingridalma_2.setHeader('N° Movimiento,F.Movimiento,Tipo Transacción,Num.Ingreso,Num.Egreso,Lote,Ubicación,Documento 1,T.Documento 1,F.Documento 1,Documento 2,T.Documento 2,F.Documento 2,Cod.Documento3,Vigencia,Cod.Pedido,Voucher,Cod.Producto,Cod.Almacen,Periodo,Cod.Tipo Doc. 1,Cod.Tipo Doc. 2');
    maingridalma_2.setInitWidths('100,120,200,100,100,100,100,120,120,120,120,120,120,120,120,120,120,120,120,120,120,120');
    maingridalma_2.setColAlign('center,center,left,right,right,center,center,center,center,center,center,center,center,center,center,left,center,center,center,center,left,center,center,center');
    maingridalma_2.setColTypes("ro,ro,ro,edn,edn,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro");    
    maingridalma_2.setNumberFormat("0,000.00",3,".",",");   
    maingridalma_2.setNumberFormat("0,000.00",4,".",",");   
    maingridalma_2._in_header_stat_sum=function(tag,index,data){       
        var calck=function(){                              
            var sum=0;                                     
            this.forEachRow(function(id){                   
                sum+=this.cellById(id,index).getValue()*1;     
            })
        return this._aplNF(sum,0);
        }
        this._stat_in_header(tag,calck,index,data);            
    }
    maingridalma_2.attachFooter(",,,#stat_sum,#stat_sum",["","","","text-align:right;","text-align:right;"]);
    maingridalma_2.setEditable(false);    
    maingridalma_2.init();
    
    myFormdatos.attachEvent("onEnter", (id) => {
        filtro = myFormdatos.getItemValue('_kd_filtro');
        buscador = myFormdatos.getItemValue('_kd_buscar'); 
        myFormdatos_transaccion.reloadOptions('_kd_nombre_producto', '');
        myFormdatos_transaccion.reloadOptions('_kd_tipotrans', '');
        myFormdatos_periodo.reloadOptions('_kd_periodo', ''); 
        if(buscador.length==0){
            dhtmlx.confirm("Debe llenar el campo buscar", function (result) {
                return;
             }); return;
        }       
        maingridprod.clearAll();
        maingridper.clearAll();
        maingridalma.clearAll();
        maingridtran.clearAll();
        maingridalma_2.clearAll();
        almacen = '0';
        cargarProductos(buscador,filtro);
    });

    maingridprod.attachEvent("onRowSelect", function (id, ind) {
        myFormdatos_transaccion.reloadOptions('_kd_tipotrans', '');
        myFormdatos_periodo.reloadOptions('_kd_periodo', ''); 
        maingridper.clearAll();
        maingridalma.clearAll();
        maingridtran.clearAll();
        maingridalma_2.clearAll();
        data = maingridprod.getRowData(maingridprod.getSelectedRowId())
        codproducto = data.codprod;
        producto = codproducto;
        descripcion = data.desc;
        desc_producto = descripcion;
        myFormdatos_transaccion.setItemValue('_kd_nombre_producto',data.desc);
        almacen = '0';
        periodo = '0';
        cargarPeriodo(codproducto);
    });
    myFormdatos_periodo.attachEvent("onButtonClick", function (id_ind){
        almacen = '0';
        cargarAlmacen(codproducto);
    });
    myFormdatos_periodo.attachEvent("onChange", async (name) => {
        switch (name) {
            case '_kd_periodo':
                codigoprod = codproducto;
                almacen = '0';
                cargarAlmacen(codigoprod);
                break;
            default:
                null;
                break;
        }
    });
    
    myFormdatos_transaccion.attachEvent("onChange", async (name) => {
        switch (name) {
            case '_kd_tipotrans':
                transaccion = myFormdatos_transaccion.getItemValue('_kd_tipotrans'); 
                cargardet2Alma(codproducto,periodo,almacen,transaccion);
                break;
            default:
                null;
                break;
        }
    });
    maingridalma.attachEvent("onRowSelect", function (id, ind) {
        data = maingridalma.getRowData(maingridalma.getSelectedRowId())
        codproducto = data.codprod;
        periodo = data.peri;
        almacen = data.codalm;        
        cargardetAlma(codproducto,periodo,almacen);
        cargardet3Alma(codproducto,periodo,almacen);
        transaccion = myFormdatos_transaccion.getItemValue('_kd_tipotrans');  
        cargardet2Alma(codproducto,periodo,almacen,'-');
    });
}

cargarProductos = () => {    
    maingridprod.clearAll(); 
    mainLayout_prod.cells('b').progressOn();
    maingridprod.load( BASE_URL + 'LO0101030401/mostrar-producto/'+  usrJson.empresa+'/'+filtro+'/'+buscador).then(function (text) {
        mainLayout_prod.cells('b').progressOff();
    });
};

cargartransaccion = (codproducto,periodo,almacen) => {
    const params = {
        empresa : usrJson.empresa,
        periodo: periodo,
        almacen: almacen,
        producto: codproducto,
    };
    $.post(BASE_URL + 'LO0101030401/mostrar-transaccion/', params, function (res) {
        const valor = res.data.transaccion;
        myFormdatos_transaccion.reloadOptions('_kd_tipotrans', valor);
    } , 'json');
}

cargarPeriodo = (codproducto) => {
    const params = {
        empresa : usrJson.empresa,
        co_producto:  codproducto
    };
    $.post(BASE_URL + 'LO0101030401/mostrar-periodo/', params, function (res) {
        const valor = res.data.periodo;
        myFormdatos_periodo.reloadOptions('_kd_periodo', valor);
    } , 'json');
}


cargarAlmacen = (codproducto) => {    
    periodo = myFormdatos_periodo.getItemValue('_kd_periodo');
    maingridalma.clearAll(); 
    mainLayout_per.cells('b').progressOn();
    maingridalma.load( BASE_URL + 'LO0101030401/mostrar-almacen/'+ usrJson.empresa+'/'+periodo+'/'+codproducto).then(function (text) {
        mainLayout_per.cells('b').progressOff();
    });
};

cargardetAlma = (codproducto,periodo,almacen) => {    
    maingridtran.clearAll(); 
    mainLayout_tran.cells('b').progressOn();
    maingridtran.load( BASE_URL + 'LO0101030401/mostrar-detalle-almacen/'+ usrJson.empresa+'/'+periodo+'/'+almacen+'/'+codproducto).then(function (text) {
        mainLayout_tran.cells('b').progressOff();
    });
};

cargardet2Alma = (codproducto,periodo,almacen,transaccion) => {    
    maingridalma_2.clearAll(); 
    mainLayout_tran.cells('c').progressOn();
    maingridalma_2.load( BASE_URL + 'LO0101030401/mostrar-detalledos-almacen/'+ usrJson.empresa+'/'+periodo+'/'+almacen+'/'+codproducto+'/'+transaccion).then(function (text) {
        mainLayout_tran.cells('c').progressOff();
    });
};

cargardet3Alma = (codproducto,periodo,almacen) => {     
    cargartransaccion(codproducto,periodo,almacen);   
    maingridper.clearAll(); 
    mainLayout_per.cells('c').progressOn();
    maingridper.load( BASE_URL + 'LO0101030401/mostrar-detalleter-almacen/'+ usrJson.empresa+'/'+periodo+'/'+almacen+'/'+codproducto).then(function (text) {
        mainLayout_per.cells('c').progressOff();
    });
};

Onclick = (id) => {
    switch (id) {
        case 'insures':             
            mostrarinsures();
            break; 
        case 'pedres':             
            mostrarpedres();
            break;   
        case 'detalle':             
            mostrardetalleres();
            break;   
        default:
            null;
            break;
    }
};

Onclickinfo= (id) => {
    switch (id) {
        case 'cambio':             
            mostrarcambio();
            break; 
        case 'movimiento':             
            mostrarmovimiento();
            break;   
        default:
            null;
            break;
    }
};

mostrarinsures = async () => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("winsures", 0, 0, 800, 500);
    Winid_.setText("Reserva de Insumos y empaques "+"PRODUCTO: "+producto+"-"+desc_producto);
    Wind_.window("winsures").setModal(true);
    Wind_.window("winsures").denyResize();
    Wind_.window("winsures").center(); 
    myGrid_resumen = Winid_.attachGrid();
    myGrid_resumen.setHeader('F.Inicio,Orden Trabajo,Lote,Cantidad,Estado');
    myGrid_resumen.setInitWidthsP('20,20,20,20,20');
    myGrid_resumen.setColTypes('ro,ro,ro,ro,ro');
    myGrid_resumen.setColAlign('center,left,center,center,left');
    myGrid_resumen.setEditable(false);
    myGrid_resumen.clearAll();
    cargarinsumos(Wind_);
    myGrid_resumen.init();    
};

mostrarpedres = async () => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("winpedres", 0, 0, 800, 500);
    Winid_.setText("Reserva de pedidos - Productos Terminados "+"PRODUCTO: "+producto+"-"+desc_producto);
    Wind_.window("winpedres").setModal(true);
    Wind_.window("winpedres").denyResize();
    Wind_.window("winpedres").center(); 
    myGrid_pedres = Winid_.attachGrid();
    myGrid_pedres.setHeader('Cantidad,Pedido,F.Entrega,Cod.Cliente,Cliente,Total,Vigencia,F.Cierre,Cod.Vendedor,Vendedor,F.Pedido,Facturación');
    myGrid_pedres.setInitWidthsP('20,20,20,20,30,20,30,30,30,20,30,30');
    myGrid_pedres.setColTypes('ro,ro,ro,ro,ro,edn,ro,ro,ro,ro,ro,ro');
    myGrid_pedres.setColAlign('center,left,center,center,left,center,left,center,center,left,center,left');
    myGrid_pedres.setNumberFormat("0,000.00",5,".",",");   
    myGrid_pedres.setEditable(false);
    myGrid_pedres.clearAll();
    cargarpedido(Wind_);
    myGrid_pedres.init();    
};

mostrardetalleres = async () => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("windetalle", 0, 0, 800, 500);
    win_detalle = Wind_.window("windetalle").attachLayout('2E');
    Winid_.setText("Reservas de Producto");
    Wind_.window("windetalle").setModal(true);
    Wind_.window("windetalle").denyResize();
    Wind_.window("windetalle").center(); 
    win_detalle.cells("a").setText('PRODUCTO:      '+producto+'-'+desc_producto);
    win_detalle.cells("b").setText('DISPONIBILIDAD DEL PRODUCTO');
    myGrid_detalleprod = win_detalle.cells("a").attachGrid();
    myGrid_detalleprod.setHeader('Lote,Ubicación,F.Documento,Cod.Documento,Cant.Solicitado,Cant.Atendido,Cant.Reservado,Cod.Doc.Referencia');
    myGrid_detalleprod.setInitWidthsP('20,20,20,20,20,20,20,20');
    myGrid_detalleprod.setColAlign('center,center,center,center,right,right,right,center');
    myGrid_detalleprod.setEditable(false);
    myGrid_detalleprod._in_header_stat_sum=function(tag,index,data){       
        var calck=function(){                              
            var sum=0;                                     
            this.forEachRow(function(id){                   
                sum+=this.cellById(id,index).getValue()*1;     
            })
        return this._aplNF(sum,0);
        }
        this._stat_in_header(tag,calck,index,data);            
    }
    myGrid_detalleprod.attachFooter(",,,Totales,#stat_sum,#stat_sum,#stat_sum",["","","","text-align:right;","text-align:right;","text-align:right;","text-align:right;"]);
    cargardetalleprod(Wind_);
    myGrid_detalleprod.init();
    myGrid_dispprod = win_detalle.cells("b").attachGrid();
    myGrid_dispprod.setHeader('Lote,Ubicación,Reserva,Saldo,Prioridad,F.Vencimiento,Vigencia,Concentración');
    myGrid_dispprod.setInitWidthsP('20,20,20,20,20,20,20,20');
    myGrid_dispprod.setColAlign('center,center,right,right,left,center,left,right');
    myGrid_dispprod.setEditable(false);    
    myGrid_dispprod._in_header_stat_sum=function(tag,index,data){       
        var calck=function(){                              
            var sum=0;                                     
            this.forEachRow(function(id){                   
                sum+=this.cellById(id,index).getValue()*1;     
            })
        return this._aplNF(sum,0);
        }
        this._stat_in_header(tag,calck,index,data);            
    }
    myGrid_dispprod.attachFooter(" , Totales,#stat_sum,#stat_sum",[,"text-align:right;","text-align:right;","text-align:right;"]);
    cargardisprod(Wind_);
    myGrid_dispprod.init();
};

mostrarcambio = async () => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wincambio", 0, 0, 800, 500);
    Winid_.setText("Cambio de Ubicaciones "+"PRODUCTO: "+producto+"-"+desc_producto);
    Wind_.window("wincambio").setModal(true);
    Wind_.window("wincambio").denyResize();
    Wind_.window("wincambio").center(); 
    myGrid_cambio = Winid_.attachGrid();
    myGrid_cambio.setHeader('N° Movimiento,F.Movimiento,Lote,Ubicación,Ingreso,Cod.Ubicación,Egreso,Observaciones,F.Cambio');
    myGrid_cambio.setInitWidthsP('30,30,30,30,30,30,30,100,30');
    myGrid_cambio.setColTypes('ro,ro,ro,ro,edn,ro,edn,ro,ro');
    myGrid_cambio.setColAlign('center,center,center,center,right,center,right,left,center');
    myGrid_cambio.setNumberFormat("0,000.00",4,".",",");   
    myGrid_cambio.setNumberFormat("0,000.00",6,".",",");   
    myGrid_cambio.setEditable(false);
    myGrid_cambio.clearAll();
    cargarcambio(Wind_);
    myGrid_cambio.init();    
};


mostrarmovimiento = async () => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("winmovimiento", 0, 0, 800, 500);
    Winid_.setText("Movimientos de Producto "+"PRODUCTO: "+producto+"-"+desc_producto);
    Wind_.window("winmovimiento").setModal(true);
    Wind_.window("winmovimiento").denyResize();
    Wind_.window("winmovimiento").center(); 
    myGrid_movimiento = Winid_.attachGrid();
    myGrid_movimiento.setHeader('Ubicación,Lote,Inicial,Saldo,F.Vencimiento,Real,Cuarentena,Reserva,Cod.Análisis,Prioridad,F.Salida Programada');
    myGrid_movimiento.setInitWidthsP('30,30,20,20,30,20,20,20,30,30,30');
    myGrid_movimiento.setColTypes('ro,ro,edn,edn,ro,edn,edn,edn,ro,ro,ro');
    myGrid_movimiento.setColAlign('center,center,right,right,center,right,right,right,center,center,center');
    myGrid_movimiento.setNumberFormat("0,000.00",2,".",",");   
    myGrid_movimiento.setNumberFormat("0,000.00",3,".",",");   
    myGrid_movimiento.setNumberFormat("0,000.00",5,".",",");   
    myGrid_movimiento.setNumberFormat("0,000.00",6,".",",");   
    myGrid_movimiento.setNumberFormat("0,000.00",7,".",",");   
    myGrid_movimiento.setEditable(false);
    myGrid_movimiento.clearAll();
    cargarmovimiento(Wind_);
    myGrid_movimiento.init();    
};

cargarinsumos = (win) => {
    win.window("winsures").progressOn();
    myGrid_resumen.clearAll();
    myGrid_resumen.load( BASE_URL + 'LO0101030401/mostrar-insumos-empaques/'+ usrJson.empresa+'/'+periodo+'/'+producto).then(function (text) {
        win.window("winsures").progressOff();
    });
};


cargarpedido = (win) => {
    win.window("winpedres").progressOn();
    myGrid_pedres.clearAll();
    myGrid_pedres.load( BASE_URL + 'LO0101030401/mostrar-reserva-pedidos/'+ usrJson.empresa+'/'+almacen+'/'+producto).then(function (text) {
        win.window("winpedres").progressOff();
    });
};

cargardetalleprod = (win) => {
    win.window("windetalle").progressOn();
    myGrid_detalleprod.clearAll();
    myGrid_detalleprod.load( BASE_URL + 'LO0101030401/mostrar-detalleuno-reserva/'+ usrJson.empresa+'/'+periodo+'/'+almacen+'/'+producto).then(function (text) {
        win.window("windetalle").progressOff();
    });
};

cargardisprod = (win) => {
    win.window("windetalle").progressOn();
    myGrid_dispprod.clearAll();
    myGrid_dispprod.load( BASE_URL + 'LO0101030401/mostrar-detalledos-reserva/'+ usrJson.empresa+'/'+periodo+'/'+almacen+'/'+producto).then(function (text) {
        win.window("windetalle").progressOff();
    });
};

cargarcambio = (win) => {
    win.window("wincambio").progressOn();
    myGrid_cambio.clearAll();
    myGrid_cambio.load( BASE_URL + 'LO0101030401/mostrar-cambio-ubicaciones/'+ usrJson.empresa+'/'+periodo+'/'+almacen+'/'+producto).then(function (text) {
        win.window("wincambio").progressOff();
    });
};

cargarmovimiento = (win) => {
    win.window("winmovimiento").progressOn();
    myGrid_movimiento.clearAll();
    myGrid_movimiento.load( BASE_URL + 'LO0101030401/mostrar-movimientos/'+ usrJson.empresa+'/'+periodo+'/'+almacen+'/'+producto).then(function (text) {
        win.window("winmovimiento").progressOff();
    });
};