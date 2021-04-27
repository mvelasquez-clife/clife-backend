var codproducto;
Inicio = () => {
    mainLayout = tabbarinicio.cells("__registrar").attachLayout('1C');    
    mainLayout.cells('a').hideHeader(); 
    mainLayout.cells('a').attachHTMLString('<div class="div-empty div-artes"></div>');
    tooolbar = mainLayout.cells('a').attachToolbar();
    tooolbar.setIconsPath('/assets/images/icons/');
    tooolbar.addButton('__nuevo',null,'Nuevo',"ic-add3.png","ic-add3.png");
    tooolbar.addButton('__guardar',null,'Guardar',"ic-save-dis.png","ic-save-dis.png");
    tooolbar.addButton('__buscar',null,'Buscar',"ic-look.png","ic-look.png");
    tooolbar.disableItem('__guardar');
    tooolbar.attachEvent('onClick', OnClicktoolbar);
    tooolbar.setIconSize(32);    
}

// cargarImg = async () => {
//     try {
//         const params = {
//             producto: '08095090300123',
//         };
//         $.post(BASE_URL + 'PO010210/ver-img-producto/', params, function (res) {
//             var url = res.data.url; 
//             console.log(url[0].URL);
//             $('#dv-imagen').empty().append(
//                 $('<img>').attr('src', 'data:image/jpeg;base64,' + url[0].URL.b64).css({
//                     'display': 'block',
//                     'margin': '0 auto',
//                     'max-height': '100%',
//                     'max-width': '100%'
//                 })
//             );
//         } , 'json');  
//     }
//     catch (err) {
//         console.error(err);
//     }
// }

nuevoControlcambio = () => {
    mainLayout = tabbarinicio.cells("__registrar").attachLayout('2E');   
    mainLayoutcab = mainLayout.cells('a').attachLayout('2U'); 
    mainLayoutcab.cells('a').hideHeader();  
    mainLayoutcab.cells('b').hideHeader(); 
    mainLayoutcab.cells('a').setWidth(970);
    mainLayoutcab.cells('a').setHeight(300);
    tooolbar = mainLayoutcab.cells('a').attachToolbar();
    tooolbar.setIconsPath('/assets/images/icons/');
    tooolbar.addButton('__nuevo',null,'Nuevo',"ic-add3.png","ic-add3.png");
    tooolbar.addButton('__guardar',null,'Guardar',"ic-save2.png","ic-save2.png");
    tooolbar.addButton('__buscar',null,'Buscar',"ic-look.png","ic-look.png");
    tooolbar.attachEvent('onClick', OnClicktoolbar);
    tooolbar.setIconSize(32);    
    formcambios = mainLayoutcab.cells('a').attachForm(f_registracambio);
    formcambios.setFontSize("11px");
    tabbaridet = mainLayout.cells('b').attachTabbar();
    tabbaridet.addTab('__padre', 'Producto Padre', null, null, true);
    tabbaridet.addTab('__formula', 'Fórmula', null, null, true);
    tabbaridet.addTab('__adjunto', 'Adjuntos', null, null, true);
    tabbaridet.attachEvent ( "onSelect" , inicioOnSelect);  
}

inicioOnSelect= async (id) => {
    switch (id) {
        case '__registrar':
            Inicio();
            break;
        case '__revisar':
            mostrarArtes();
            break;
        case '__padre':
            cargarsustGrid(codproducto);
            break;
        case '__adjunto':
            cabecerAdjunto();
            break;
        default:
        null;
        break;
    }
};

OnClicktoolbar= async (id) => {
    switch (id) {
        case '__nuevo':  
            cargarProducto();
        break;    
        case 'b_busq':      
            if (myToolbar.getValue('in_busq').length>0){            
                cargarproductoporgrupo(myToolbar.getValue('in_busq').toUpperCase()); 
            }else{
                dhtmlx.confirm("El campo esta vacío", function (result) {});
            }
        break; 
        case 'b_close':  
            Wind_.window("wbuscar").close();
        break;    
        case 'b_check':  
            sel_producto = myGridbuscar.getRowData(myGridbuscar.getSelectedRowId());
            codproducto = sel_producto.cod;
            nuevoControlcambio();
            cargarFormulario(sel_producto.cod,sel_producto.marc,sel_producto.subm);
        break;  
        case 'subirdt':  
            cargarAdjunto(codproducto);
        break;  
        case '__guardar':  
            guardarArte(codproducto);
        break;  
        case '__buscar':  
            mostrarArtespendiente();
        break; 
        case '__orden':  
        console.log(myGridbuscar.getRowData(myGridbuscar.getSelectedRowId()));
            sel_producto = myGridbuscar.getRowData(myGridbuscar.getSelectedRowId());
            codproducto = sel_producto.cod;
            mostrarordenCompra(codproducto);
        break;
        default:
        null;
        break;
    }
};

cargarProducto = async () => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbuscar", 0, 0, 800, 500);
    Wind_.window("wbuscar").hideHeader();
    Wind_.window("wbuscar").setModal(true);
    Wind_.window("wbuscar").denyResize();
    Wind_.window("wbuscar").center(); 
    myToolbar = Wind_.window("wbuscar").attachToolbar();
    myToolbar.setIconsPath('/assets/images/icons/');
    myToolbar.addText(null, null, 'Producto a buscar : ');
    myToolbar.addInput('in_busq', null, '', 250);
    myToolbar.addSeparator(null, null);
    myToolbar.addButton('b_busq', null, '<i class="fas fa-search"></i> Buscar', null, null);
    myToolbar.addSeparator(null, null);
    myToolbar.addButton('b_check', null, 'Agregar', "ic-add.png", null);
    myToolbar.addSeparator(null, null);
    myToolbar.addButton('b_close', null, 'Cerrar', "ic-cancel-cd.png", null);
    myToolbar.attachEvent('onClick', OnClicktoolbar);
    myToolbar.attachEvent("onEnter", (id,clase_grupo) => {        
        if (myToolbar.getValue('in_busq').length>0){          
            cargarproductoporgrupo(myToolbar.getValue('in_busq').toUpperCase()); 
        }else{
            dhtmlx.confirm("El campo esta vacío", function (result) {});
        }
    });
    myGridbuscar = Winid_.attachGrid();
    myGridbuscar.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    myGridbuscar.setHeader('Cod.Producto,Descripción,Marca,Submarca');
    myGridbuscar.setInitWidths('100,500,150,150');
    myGridbuscar.setColAlign('left,left,left,left');
    myGridbuscar.setColTypes('ro,ro,ro,ro'); 
    myGridbuscar.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter");
    myGridbuscar.setColumnIds('cod,desc,marc,subm');      
    myGridbuscar.init();     
     
};

cargarproductoporgrupo = (buscar) => {  
  myGridbuscar.clearAll(); 
    Wind_.window("wbuscar").progressOn();
    myGridbuscar.load( BASE_URL + 'PO010210/listar-productos/'+buscar).then(function (text) {
        Wind_.window('wbuscar').progressOff();
        // cant_filas_l = myGridbuscar.getRowsNum();
    });  
};

cargarFormulario = (producto,marca,submarca) => {  
    formcambios.setItemValue('_ra_marca',marca);
    formcambios.setItemValue('_ra_submarca',submarca);
    const params = {
        producto: producto,
    };
    $.post(BASE_URL + 'PO010210/listar-detalle-prodhijo/', params, function (res) {
        var producto = res.data.detalleprod; 
        formcambios.setItemValue('_ra_marca',marca);
        formcambios.setItemValue('_ra_submarca',submarca);
        formcambios.setItemValue('_ra_cod_prodh',producto[0].CO_PRODUCTO);
        formcambios.setItemValue('_ra_descproh',producto[0].DE_NOMBRE_PRODUCTO);
        formcambios.setItemValue('_ra_arte',producto[0].CO_CODIGO_ARTE);
        formcambios.setItemValue('_ra_ean13',producto[0].CO_PRODUCTO);
        formcambios.setItemValue('_ra_ean14',producto[0].CO_CODIGO_EAN14);
        formcambios.setItemValue('_ra_usu_reg',usrJson.nombre);
        Wind_.window("wbuscar").close();
        mainLayoutcab.cells('b').attachURL("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkSp4Bqz4MKReMEuQQqmIONZLySP7hUpnwlw&usqp=CAU");
        cargarsustGrid(producto[0].CO_PRODUCTO);
        cabecerAdjunto(producto[0].CO_PRODUCTO);
    } , 'json');  

};

cargarsustGrid = (producto) => {  
    myGridpadre = tabbaridet.cells("__padre").attachLayout('1C');   
    myGridpadre.cells('a').hideHeader(); 
    gridProductop = myGridpadre.cells('a').attachGrid();
    gridProductop.setHeader('Código, Descripción,Marca,Submarca,Clase,Familia,Subfamilia,Estado');
    gridProductop.setInitWidths('100,450,150,150,150,150,150,150');
    gridProductop.setColAlign('left,left,left,left,left,left,left,left');
    gridProductop.setColTypes('ro,ro,ro,ro,ro,ro,ro,ro'); 
    gridProductop.init();     
    gridProductop.clearAll(); 
    myGridpadre.cells('a').progressOn();
    gridProductop.load( BASE_URL + 'PO010210/listar-producto-padre/'+producto).then(function (text) {
        myGridpadre.cells('a').progressOff();
      });  
  };

  cabecerAdjunto = () => {  
    myGridadjunto = tabbaridet.cells("__adjunto").attachLayout('1C');   
    myGridadjunto.cells('a').hideHeader(); 
    dctotoolbar = myGridadjunto.cells('a').attachToolbar(); 
    dctotoolbar.setIconsPath('/assets/images/icons/');
    dctotoolbar.addButton('verdcto',null,'Ver Archivo',"ic-look.png","");
    dctotoolbar.addButton('subirdt',null,'Subir Archivo',"ic-upload.png","");
    dctotoolbar.addButton('eliminar',null,'Eliminar Archivo',"ic-delete.png","");
    dctotoolbar.addButton('refresh',null,'Actualizar',"ic-refresh.png","");
    dctotoolbar.attachEvent('onClick', OnClicktoolbar);
    dctotoolbar.setIconSize(18); 
    myGrid_dcto = myGridadjunto.cells('a').attachGrid();
    myGrid_dcto.setHeader(',Nombre,Descripción,');    
    myGrid_dcto.setInitWidths('0,300,600,0');
    myGrid_dcto.setColAlign('left,left,left,left');
    myGrid_dcto.setColTypes('ro,ro,ro,ro'); 
    myGrid_dcto.setColumnIds('prod,nom,desc,ind'); 
    myGrid_dcto.init();      
};

cargarAdjunto = (codproducto) => {  
    WinContainer = new dhtmlXWindows();
    WinDocumentoViewer = WinContainer.createWindow('WinDocumentoViewer', 320, 0, 700, 500);
    WinDocumentoViewer.keepInViewport();
    WinDocumentoViewer.setText('Cargar Documento');
  const params = {
      producto: codproducto,
      usuario:  usrJson.codigo
  };
  $.post(BASE_URL + 'PO010210/subir-adjunto/', params, function (res) {
      var url = res.data.url; 
      console.log(url[0]);
      WinDocumentoViewer.attachURL(url[0].URL);
  } , 'json');  

};

guardarArte = (codproducto) => {  
   arte = formcambios.getItemValue('_ra_arte');
   motivo = formcambios.getItemValue('_ra_motivo');
   var inicio = formcambios.getItemValue('_ra_fe_ini').toLocaleDateString().replace('/', '-');
   var fin = formcambios.getItemValue('_ra_fe_fin').toLocaleDateString().replace('/', '-');
  const params = {
      empresa: usrJson.empresa,
      usuario:  usrJson.codigo,
      producto: codproducto,
      arte: arte,
      motivo:motivo,
      fe_ini:inicio,
      fe_fin:fin
  };
  console.log(params);
  $.post(BASE_URL + 'PO010210/guardar-arte/', params, function (res) {
        console.log(res); 
      if (res.state=='error'){  
        dhtmlx.alert({
            title: 'No se guardo el registro',
            type: 'alert-error',
            text: res.error
        });   
    } else {
        dhtmlx.alert({
            title: 'Correcto',
            text: 'Se guardo correctamente'
        });   
    }
  } , 'json');  

};

mostrarArtespendiente= async () => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbuscar", 0, 0, 800, 500);
    Wind_.window("wbuscar").setModal(true);
    Wind_.window("wbuscar").denyResize();
    Wind_.window("wbuscar").center(); 
    myGridbuscar = Winid_.attachGrid();
    myGridbuscar.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    myGridbuscar.setHeader('Codigo,Descripcion, Arte, Motivo,Creado por,Fecha Registro,,,,,Estado,,F.Inicio,F.Fin,,,,,');
    myGridbuscar.setInitWidths('100,300,150,150,150,150,0,0,0,0,100,0,100,100,0,0,0,0,0');
    myGridbuscar.setColAlign('left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left');
    myGridbuscar.setColTypes('ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro'); 
    // myGridbuscar.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter");
    myGridbuscar.setColumnIds(',,,,,,,,,,estado');      
    myGridbuscar.init();     
    myGridbuscar.clearAll(); 
    Wind_.window("wbuscar").progressOn();
    myGridbuscar.load( BASE_URL + 'PO010210/listar-artes-pendientes/').then(function (text) {
        Wind_.window("wbuscar").progressOff();
        let num_fila = myGridbuscar.getRowsNum();
        let iRowId;
        for(let i=0;i<num_fila;i++){
            iRowId = myGridbuscar.getRowId(i);
            data = myGridbuscar.getRowData(iRowId);
            if(data.estado=='Vigente'){
                myGridbuscar.setRowColor(iRowId,"#90EE90");
            }
        }
      });  
     
};

mostrarArtes= async () => {
    mainLayout = tabbarinicio.cells("__revisar").attachLayout('1C');
    mainLayout.cells('a').hideHeader();
    tooolbar = mainLayout.cells('a').attachToolbar();
    tooolbar.setIconsPath('/assets/images/icons/');
    tooolbar.addButton('__orden',null,'Orden de Compra',"ic-compra.png","ic-compra.png");
    tooolbar.addButton('__documentos',null,'Ver documentos',"ic-carpeta.png","ic-carpeta.png"); 
    tooolbar.attachEvent('onClick', OnClicktoolbar);  
    tooolbar.setIconSize(32);    
    myGridbuscar = mainLayout.cells('a').attachGrid();
    myGridbuscar.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    myGridbuscar.setHeader('Codigo,Descripcion, Arte, Motivo,Creado por,Fecha Registro,,,,,Estado,,F.Inicio,F.Fin,,,,,');
    myGridbuscar.setInitWidths('100,300,150,150,150,150,0,0,0,0,100,0,100,100,0,0,0,0,0');
    myGridbuscar.setColAlign('left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left');
    myGridbuscar.setColTypes('ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro'); 
    // myGridbuscar.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter");
    myGridbuscar.setColumnIds('cod,,,,,,,,,,estado');      
    myGridbuscar.init();     
    myGridbuscar.clearAll(); 
     mainLayout.cells('a').progressOn();
    myGridbuscar.load( BASE_URL + 'PO010210/listar-artes-pendientes/').then(function (text) {
         mainLayout.cells('a').progressOff();
        let num_fila = myGridbuscar.getRowsNum();
        let iRowId;
        for(let i=0;i<num_fila;i++){
            iRowId = myGridbuscar.getRowId(i);
            data = myGridbuscar.getRowData(iRowId);
            if(data.estado=='Vigente'){
                myGridbuscar.setRowColor(iRowId,"#90EE90");
            }
        }
      });  
     
};

mostrarordenCompra= async (codproducto) => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbuscar", 0, 0, 800, 500);
    Wind_.window("wbuscar").setModal(true);
    Wind_.window("wbuscar").denyResize();
    Wind_.window("wbuscar").center(); 
    myGridbuscar = Winid_.attachGrid();
    myGridbuscar.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    myGridbuscar.setHeader('co_orden_compra, co_catalogo_producto,nu_cantidad,im_precio_total,im_precio_unitario,nu_entregado,co_codigo_arte');
    myGridbuscar.setInitWidths('150, 300,100,100,100,100,150');
    myGridbuscar.setColAlign('left, left,center,center,center,center,left');
    myGridbuscar.setColTypes('ro,ro,ro,ro,ro,ro,ro'); 
    myGridbuscar.init();     
    myGridbuscar.clearAll(); 
    Wind_.window("wbuscar").progressOn();
    myGridbuscar.load( BASE_URL + 'PO010210/listar-orden-compra/'+codproducto).then(function (text) {
        Wind_.window("wbuscar").progressOff();
      });  
     
};