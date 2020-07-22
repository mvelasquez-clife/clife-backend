var version_prov,version_esp,cod_esp,win_desc,form_tipo,form_cod,form_vers,form_vig,form_codprov,form_prov,form_desc,form_fcrea,form_crea,form_frev,form_rev,form_fapr,form_aprob,form_coesp,serie,num_fila,data_n,data,cant_filas_n,cant_filas_l,de_grupo,clase_grupo,grupo_prod,tipo_bien,myGrid_version,myGrid_prod,mainLayout_prod,myGrid_hist,mainLayout_hist,myGrid_cpto,mainLayout_cpto,myGrid_ensa,mainLayout_ensa,myGrid_caract,myFormdcaract,mainLayout_caract,myFormdformu,mainLayout,tabbar,mainLayout_group,myGrid_group,tabbar_det
var nuev = '';
Inicio = () => {
    mainLayout = new dhtmlXLayoutObject(document.body, '3J'); 
    mainLayout.cells('a').hideHeader();
    mainLayout.cells('b').hideHeader();
    mainLayout.cells('a').setHeight(80);
    mainLayout.cells('b').setHeight(1000);
    mainLayout.cells('c').setWidth(650);
    myFormdformu = mainLayout.cells('a').attachForm(f_filtro_busqueda);   
    tabbar = mainLayout.cells('c').attachTabbar();
    tabbar.addTab('__gran', 'GRANEL', null, null, true);
    tabbar.addTab('__insu', 'INSUMOS INTERNOS', null, null, false);
    tabbar.addTab('__matpr', 'MATERIA PRIMA', null, null, false);
    tabbar.addTab('__emp', 'EMPAQUES', null, null, false);
    tabbar.addTab('__otros', 'OTROS MATERIALES', null, null, false);
    tabbar.attachEvent ( "onSelect" , inicioOnSelect); 
    mainLayout_det = mainLayout.cells('b').attachLayout('2E');
    mainLayout_det.cells('a').setText('Versiones');
    mainLayout_det.cells('a').setHeight(150);
    esptoolbar = mainLayout_det.cells('a').attachToolbar(); 
    esptoolbar.setIconsPath('/assets/images/icons/');
    esptoolbar.addButton('verdet',null,'Ver Detalle',"ic-buskard.png","");
    esptoolbar.addButton('copiar',null,'Copiar Versión',"ic-add2.png","");
    esptoolbar.attachEvent('onClick', mainToolbarOnClick);
    esptoolbar.setIconSize(18);
    myGrid_version= mainLayout_det.cells('a').attachGrid();
    myGrid_version.setSizes ("8px");
    myGrid_version.setHeader('Cod.Espec,Ver.,Estado,Proveedor,Cod.Proveedor');
    myGrid_version.setInitWidths('100,80,100,400,0');
    myGrid_version.setColAlign('left,left,left,left');
    myGrid_version.setColumnIds('cod,vers,estado,proveedor,codprov');     
    myGrid_version.init();    
    myGrid_version.attachEvent("onRowSelect", function (id, ind) {  
        data = myGrid_version.getRowData(myGrid_version.getSelectedRowId());
        version_esp = data.vers;
        version_prov = data.codprov;
        cod_esp = form_cod; 
        console.log(version_esp,cod_esp);
        iniciotabs();
        cargarespecProd(form_cod,version_esp);
     });  
    iniciotabs();
    grupo_prod = 4;
    clase_grupo = 2;
    tipo_bien = 10;
    de_grupo = '__gran';
    serie = 'ETGR';
    cargarespecific('__gran',4);
    cargarespecProd();
    
    
}

iniciotabs= () => {
    tabbar_det = mainLayout_det.cells('b').attachTabbar();
    tabbar_det.addTab('presp', 'Productos Espec.', null, null, true);
    tabbar_det.addTab('crt', 'Características', null, null, false);
    tabbar_det.addTab('esy', 'Ensayos', null, null, false);
    tabbar_det.addTab('cpto', 'Complementos', null, null, false);
    tabbar_det.addTab('hst', 'Historial', null, null, false);
    tabbar_det.addTab('arc', 'Archivos Adjuntos', null, null, false);
    tabbar_det.addTab('prod', 'Productos/SubProductos asociados', null, null, false);
    tabbar_det.attachEvent ( "onSelect" , detaOnSelect); 
}

mainToolbarOnClick= async (id) => {    
    switch (id) { 
        case 'verprod':     
            break;
        case 'verdet':    
            verdetespecif('edit',de_grupo);
            break;      
        case 'copiar':
            col  = myGrid_version.getSelectedRowId();
            if(col) {
                sel  = myGrid_version.getRowData(col);
                versioninput();
            }else{
                dhtmlx.confirm("Debe seleccionar una versión", function (result) {
                });
            }
            break;                
        default:
            null;
            break;
    }
};



inicioOnSelect= async (id) => {
    buscar = myFormdformu.getItemValue('_ep_buscar').length>0 ? myFormdformu.getItemValue('_ep_buscar').toUpperCase() : '-';
    // flag = myFormdformu.isItemChecked('_ch_todo')?'S':'N';    
    switch (id) {
        case '__gran':     
            serie = 'ETGR';
            grupo_prod = 4;
            clase_grupo = 2;
            tipo_bien = 10; 
            de_grupo = '__gran';
            cargarespecific(de_grupo,grupo_prod);        
            break;   
        // case '__gran':     
        //     serie = 'ETGR';
        //     grupo_prod = 2;
        //     clase_grupo = 2;
        //     tipo_bien = 6; 
        //     de_grupo = '__gran';
        //     cargarespecific(de_grupo,grupo_prod);             
        //     break;   
        case '__matpr':     
            serie = 'ETMP';
            de_grupo = '__matpr';
            grupo_prod = 1;
            clase_grupo = 1;
            tipo_bien = 1; 
            cargarespecific(de_grupo,grupo_prod); 
            break;   
        case '__emp':     
            grupo_prod = 5;
            de_grupo = '__emp'; 
            serie = 'ETME';
            cargarespecific(de_grupo,grupo_prod); 
            break;
        case '__insu':  
            serie = 'ETII';
            de_grupo = '__insu';
            grupo_prod = 3;
            clase_grupo = 2;
            tipo_bien = 7;    
            cargarespecific(de_grupo,grupo_prod); 
            break;  
        case '__otros':   
            grupo_prod = 6;
            de_grupo = '__otros'; 
            serie = 'ETOM';  
            cargarespecific('__otros',6,0,0); 
            break;                     
        default:
            null;
            break;
    }
};

detaOnSelect= async (id) => {
    if(version_esp.length>0){
        switch (id) {
            case 'presp':
                cargarespecProd(cod_esp,version_esp);
                break;
            case 'crt':     
                cargarCaract(cod_esp,version_esp);   
                break;
            case 'esy':     
                cargarEnsayo(cod_esp,version_esp);  
                break;
            case 'cpto':     
                cargarCompto(cod_esp,version_esp); 
                break;        
            case 'hst':     
                cargarHistorial(cod_esp); 
                break; 
            case 'arc':     
                cargarDocumento(cod_esp,version_esp); 
                break;          
            case 'prod':     
                cargarProducto(cod_esp,version_esp); 
                break;        
            default:
                null;
                break;
        }
    }else{
        dhtmlx.confirm("Elegir especificacion", function (result) {
            if (result === Boolean(true)) {
            }
        });
    }
};

toolbarOnProducto= async (id) => {
    sel  = myGrid_group.getRowData(myGrid_group.getSelectedRowId());
    switch (id) {
        case 'verprod':
            verproducto();
            break;       
        case 'guardar':
            let  cant_filas_guardar = 0;
            let cadena = '',data_grabar;
            cant_filas_guardar = myGrid_esprod.getRowsNum();
            console.log('cantidad: ' +cant_filas_guardar);
            if (cant_filas_guardar ==0){
                dhtmlx.confirm("Ingresa productos", function (result) {
                    if (result === Boolean(true)) {
                    }
                });
            }else{
                for (let i = 1; i < cant_filas_guardar; i++) {
                    console.log(i);
                    let iRowId = myGrid_esprod.getRowId(i);
                    data_grabar = myGrid_esprod.getRowData(iRowId);
                    console.log(data_grabar.cod);
                    cadena += data_grabar.cod +'@';
                }

                guardarprod(sel.cod,version_esp,cadena,cant_filas_guardar-1);
            }
            break;     
        default:
            null;
            break;
    }
};

cargarespecific = (nombre,grupo) => {  
    mainLayout_group = tabbar.cells(nombre).attachLayout('1C');    
    myGrid_group = mainLayout_group.cells('a').attachGrid();
    mainLayout_group.cells('a').hideHeader();
    mytoolbar = mainLayout_group.cells('a').attachToolbar();  
    mytoolbar.setIconsPath('/assets/images/icons/');
    mytoolbar.addButton('nuevo',null,'Nuevo',"ic-add3.png","ic-add3.png");
    mytoolbar.addButton('historial',null,'Historial de cambios',"ic-historial.png","");
    mytoolbar.addButton('copiar',null,'Copiar Especificación',"ic-copy.png","");
    mytoolbar.attachEvent ( "onClick" , onClickaction); 
    mytoolbar.setIconSize(32);    
    myGrid_group.setHeader('Descripción,Cod.Espec.,Ver.,Estado,F.Creación,F.Revisado,F.Aprobado,Creado por:,Revisado por:,Aprobado por:,Proveedor,Cod.Proveedor,Cod.NSOC,Nombre NSOC,Tipo');
    myGrid_group.setInitWidths('400,100,100,100,100,100,100,100,100,100,150,0,150,300,100');
    myGrid_group.setColAlign('left,left,left,left,left,left,left,left,left,left,left,left,left,left,left');
    myGrid_group.setColTypes('ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro'); 
    myGrid_group.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,,#text_filter,#text_filter,#text_filter");     
    myGrid_group.setColumnIds('desc,cod,vers,vig,fcrea,frev,fapr,crea,rev,aprob,prov,codprov,coesp,desp,tip');  
    myGrid_group.init();      
    myGrid_group.clearAll(); 
    mainLayout_group.cells('a').progressOn();
    myGrid_group.load( BASE_URL + 'PO010411/mostrar-especificacion/'+usrJson.empresa+'/'+grupo+'/'+'TODOS').then(function (text) {
        mainLayout_group.cells('a').progressOff();
        num_fila = myGrid_group.getRowsNum();
    });
    myGrid_group.attachEvent("onRowSelect", function (id, ind) {
        data = myGrid_group.getRowData(myGrid_group.getSelectedRowId())     
        mainLayout_det.cells('a').setText('Descripción: '+data.desc+' ('+data.cod+')');
        win_desc = data.desc+" ("+data.cod+")"+" Vers."+data.vers;
        form_cod = data.cod;
        form_vers = data.vers;
        form_vig = data.vig;
        form_codprov = data.codprov;
        form_prov = data.prov;
        form_desc = data.desc;
        form_fcrea = data.fcrea;
        form_crea = data.crea;
        form_frev = data.frev;
        form_rev = data.rev;
        form_fapr = data.fapr;
        form_aprob = data.aprob;     
        form_coesp = data.coesp;        
        form_tipo = data.tip
        tabbar_det.tabs('presp').show();
        tabbar_det.tabs('crt').show();
        tabbar_det.tabs('esy').show();
        tabbar_det.tabs('cpto').show();
        tabbar_det.tabs('hst').show();
        tabbar_det.tabs('arc').show();
        tabbar_det.tabs('prod').show();
        version_esp = data.vers;
        cod_esp = form_cod; 
        cargarversiones(data.cod);
        console.log(data.cod,data.vers);
        iniciotabs();
        cargarespecProd(data.cod,data.vers);
     });
};

cargarCaract = (espec,version) => {  
    mainLayout_caract = tabbar_det.cells('crt').attachLayout('2E');  
    myFormdcaract = mainLayout_caract.cells('a').attachForm(form_caract);
    myFormdcaract.setFontSize("9px");
    cartoolbar = mainLayout_caract.cells('a').attachToolbar(); 
    cartoolbar.setIconsPath('/assets/images/icons/');
    cartoolbar.addButton('vercaract',null,'Agregar Características',"ic-add.png","");
    cartoolbar.addButton('aceptar',null,'Aceptar',"ic-acept.png","");
    cartoolbar.attachEvent('onClick', toolbarOnCaract);
    cartoolbar.setIconSize(18);
    mainLayout_caract.cells('a').hideHeader();  
    mainLayout_caract.cells('b').hideHeader();
    //CARGANDO PRIMERA PARTE DE CARACTERISTICAS
    const params = {
        empresa: usrJson.empresa,
        especificacion : espec,
        version : version
    };
    $.post(BASE_URL + 'PO010410/mostrar-caract-general/', params, function (res) {
        const caract = res.data.caract; 
        myFormdcaract.setItemValue('_ep_car_gen',caract.DE_CARACTERIS_GENERALES);
        myFormdcaract.setItemValue('_ep_car_alm',caract.DE_CONDIC_ALMACENAMIENTO);
    } , 'json');  
    myGrid_caract = mainLayout_caract.cells('b').attachGrid();
    myGrid_caract.setHeader(',Característica,Detalle');    
    myGrid_caract.setInitWidths(',200,600');
    myGrid_caract.setColAlign('left,left,left');
    myGrid_caract.setColTypes('ro,ro,ed'); 
    myGrid_caract.setColumnIds('id,desc,det'); 
    myGrid_caract.init();      
    //CARGANDO SEGUNDA PARTE DE CARACTERISTICAS
    myGrid_caract.clearAll(); 
    mainLayout_caract.cells('b').progressOn();
    myGrid_caract.load( BASE_URL + 'PO010410/mostrar-caract-detalle/'+usrJson.empresa+'/'+espec+'/'+version).then(function (text) {
        mainLayout_caract.cells('b').progressOff();
    });
};

toolbarOnCaract = async (id) => {
    sel  = myGrid_group.getRowData(myGrid_group.getSelectedRowId());
    switch (id) {
        case 'vercaract':
            vercaracteristicas();
            break;       
        case 'aceptar':            
            let  cant_filas_guardar = 0;
            let cadenacod = '',cadenadet='',data_grabar,caract_gen,cond_alm;
            cant_filas_guardar = myGrid_caract.getRowsNum();
            if (cant_filas_guardar ==0){
                dhtmlx.confirm("Características no ingresadas", function (result) {
                    if (result === Boolean(true)) {
                    }
                });
            }else{
                for (let i = 1; i < cant_filas_guardar; i++) {
                    let iRowId = myGrid_caract.getRowId(i);
                    data_grabar = myGrid_caract.getRowData(iRowId);
                    cadenacod += data_grabar.id +'@';
                    cadenadet += data_grabar.det +'@';
                }
                caract_gen = myFormdcaract.getItemValue('_ep_car_gen');
                cond_alm = myFormdcaract.getItemValue('_ep_car_alm');
                guardarcaract(sel.cod,version_esp,cadenacod,cadenadet,cant_filas_guardar-1,caract_gen,cond_alm);
            }
            break;     
        default:
            null;
            break;
    }
};

toolbarOnensayo = async (id) => {
    sel  = myGrid_group.getRowData(myGrid_group.getSelectedRowId());
    switch (id) {
        case 'cargaren':
            verensayo();
            break;       
        case 'aceptar':       
            let  cant_filas_guardar = 0;
            let cadenaensayo = '',cadenametodo='',cadenaespec='',limmax='',limmin='',data_grabar;
            cant_filas_guardar = myGrid_ensa.getRowsNum();
            if (cant_filas_guardar ==0){
                dhtmlx.confirm("Sin ensayos", function (result) {
                    if (result === Boolean(true)) {
                    }
                });
            }else{
                for (let i = 1; i < cant_filas_guardar; i++) {
                    let iRowId = myGrid_ensa.getRowId(i);
                    data_grabar = myGrid_ensa.getRowData(iRowId);
                    cadenaensayo += data_grabar.codens +'@';
                    cadenametodo += data_grabar.comet +'@';
                    cadenaespec += data_grabar.esp +'@';
                    limmax += data_grabar.max +'@';
                    limmin += data_grabar.min +'@';
                }
                console.log(sel.cod,sel.vers,cadenaensayo,cadenametodo,cadenaespec,limmin,limmax,cant_filas_guardar-1);
                guardarensayo(sel.cod,version_esp,cadenaensayo,cadenametodo,cadenaespec,limmin,limmax,cant_filas_guardar-1);
            }
            break;     
        default:
            null;
            break;
    }
};

cargarEnsayo = (espec,version) => {  
    mainLayout_ensa = tabbar_det.cells('esy').attachLayout('1C');  
    mainLayout_ensa.cells('a').hideHeader();  
    enstoolbar = mainLayout_ensa.cells('a').attachToolbar(); 
    enstoolbar.setIconsPath('/assets/images/icons/');
    enstoolbar.addButton('cargaren',null,'Agregar Ensayo',"ic-add.png","");
    enstoolbar.addButton('aceptar',null,'Aceptar',"ic-acept.png","");
    enstoolbar.attachEvent('onClick', toolbarOnensayo);
    enstoolbar.setIconSize(18);
    myGrid_ensa = mainLayout_ensa.cells('a').attachGrid();
    myGrid_ensa.setHeader(',Co.Método,Método,Co.Ensayo,Condiciones,Especificaciones, De, A,Tipo de Ensayo,Objetivos de la Prueba');    
    myGrid_ensa.setInitWidths('50,100,200,100,400,300,100,100,300,300');
    myGrid_ensa.setColAlign('center,left,left,left,left,left,left,left,left.left');
    myGrid_ensa.setColTypes('ch,ro,ro,ro,ro,ed,ed,ed,ro,ro'); 
    myGrid_ensa.setColumnIds('chec,comet,met,codens,ens,esp,min,max,tipens,objp'); 
    myGrid_ensa.init();      
    myGrid_ensa.clearAll(); 
    mainLayout_ensa.cells('a').progressOn();
    myGrid_ensa.load( BASE_URL + 'PO010410/mostrar-ensayo/'+usrJson.empresa+'/'+espec+'/'+version).then(function (text) {
        mainLayout_ensa.cells('a').progressOff();
    });
};

cargarCompto = (espec,version) => {  
    mainLayout_cpto = tabbar_det.cells('cpto').attachLayout('1C');  
    mainLayout_cpto.cells('a').hideHeader();  
    comptoolbar = mainLayout_cpto.cells('a').attachToolbar(); 
    comptoolbar.setIconsPath('/assets/images/icons/');
    comptoolbar.addButton('cargarcmp',null,'Agregar Complemento',"ic-add.png","");
    comptoolbar.addButton('aceptar',null,'Aceptar',"ic-acept.png","");
    comptoolbar.attachEvent('onClick', toolbarOncmpt);
    comptoolbar.setIconSize(18);
    myGrid_cpto = mainLayout_cpto.cells('a').attachGrid();
    myGrid_cpto.setHeader(',Código,Material');    
    myGrid_cpto.setInitWidths('50,200,600');
    myGrid_cpto.setColAlign('center,left,left');
    myGrid_cpto.setColTypes('ch,ro,ro'); 
    myGrid_cpto.setColumnIds('chec,cod,mat'); 
    myGrid_cpto.init();      
    myGrid_cpto.clearAll(); 
    mainLayout_cpto.cells('a').progressOn();
    myGrid_cpto.load( BASE_URL + 'PO010410/mostrar-complemento/'+usrJson.empresa+'/'+espec+'/'+version).then(function (text) {
        mainLayout_cpto.cells('a').progressOff();
    });
};

cargarHistorial = (espec) => {  
    mainLayout_hist = tabbar_det.cells('hst').attachLayout('1C');  
    mainLayout_hist.cells('a').hideHeader();  
    histoolbar = mainLayout_hist.cells('a').attachToolbar(); 
    histoolbar.setIconsPath('/assets/images/icons/');
    histoolbar.addButton('cargarcmp',null,'Agregar',"ic-add.png","");
    histoolbar.attachEvent('onClick', toolbarOnhist);
    histoolbar.setIconSize(18);
    myGrid_hist = mainLayout_hist.cells('a').attachGrid();
    myGrid_hist.setHeader('N°Doc,Versión,Fecha,Descripción de los cambios,Usuario,Tipo Doc.');    
    myGrid_hist.setInitWidths('80,80,100,500,300,100');
    myGrid_hist.setColAlign('left,left,left,left,left,left');
    myGrid_hist.setColTypes('ro,ro,ro,ro,ro,ro'); 
    myGrid_hist.init();      
    myGrid_hist.clearAll(); 
    mainLayout_hist.cells('a').progressOn();
    myGrid_hist.load( BASE_URL + 'PO010410/mostrar-historial/'+usrJson.empresa+'/'+espec).then(function (text) {
        mainLayout_hist.cells('a').progressOff();
    });
};

cargarDocumento = (espec,version) => {  
    mainLayout_dcto = tabbar_det.cells('arc').attachLayout('1C');  
    mainLayout_dcto.cells('a').hideHeader();  
    myGrid_dcto = mainLayout_dcto.cells('a').attachGrid();
    myGrid_dcto.setHeader('Nombre,Descripción');    
    myGrid_dcto.setInitWidths('300,600');
    myGrid_dcto.setColAlign('left,left');
    myGrid_dcto.setColTypes('ro,ro'); 
    myGrid_dcto.init();      
    myGrid_dcto.clearAll(); 
    mainLayout_dcto.cells('a').progressOn();
    myGrid_dcto.load( BASE_URL + 'PO010410/mostrar-documento/'+usrJson.empresa+'/'+espec+'/'+version).then(function (text) {
        mainLayout_dcto.cells('a').progressOff();
    });
};

cargarProducto = (espec,version) => {  
    mainLayout_prod = tabbar_det.cells('prod').attachLayout('1C');  
    mainLayout_prod.cells('a').hideHeader();  
    myGrid_prod = mainLayout_prod.cells('a').attachGrid();
    myGrid_prod.setHeader('Código,Producto/Material');    
    myGrid_prod.setInitWidths('300,600');
    myGrid_prod.setColAlign('left,left');
    myGrid_prod.setColTypes('ro,ro'); 
    myGrid_prod.init();      
    myGrid_prod.clearAll(); 
    mainLayout_prod.cells('a').progressOn();
    myGrid_prod.load( BASE_URL + 'PO010410/mostrar-productos/'+usrJson.empresa+'/'+espec+'/'+version).then(function (text) {
        mainLayout_prod.cells('a').progressOff();
    });
};

cargarespecProd = (espec,version) => {  
    console.log('entras');
    mainLayout_esprod = tabbar_det.cells('presp').attachLayout('1C');  
    mainLayout_esprod.cells('a').hideHeader();  
    prodtoolbar = mainLayout_esprod.cells('a').attachToolbar(); 
    prodtoolbar.setIconsPath('/assets/images/icons/');
    prodtoolbar.addButton('verprod',null,'Agregar Productos',"ic-add.png","");
    prodtoolbar.addButton('guardar',null,'Aceptar',"ic-acept.png","");
    prodtoolbar.attachEvent('onClick', toolbarOnProducto);
    prodtoolbar.setIconSize(18);
    myGrid_esprod = mainLayout_esprod.cells('a').attachGrid();
    myGrid_esprod.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    myGrid_esprod.setHeader(',Código,Descripción,Marca,Submarca');    
    myGrid_esprod.setInitWidths('50,300,600,200,200');
    myGrid_esprod.setColAlign('left,left,left,left,left');
    myGrid_esprod.setColTypes('ch,ro,ro,ro,ro'); 
    myGrid_esprod.setColumnIds('chec,cod,desc,marc,subm');   
    myGrid_esprod.init();      
    cargarprodporesp(espec,version);
};

verproducto = async () => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbuscar", 0, 0, 800, 500);
    Winid_.setText("Agregar Producto");
    Wind_.window("wbuscar").setModal(true);
    Wind_.window("wbuscar").denyResize();
    Wind_.window("wbuscar").center(); 
    myToolbar = Wind_.window("wbuscar").attachToolbar();
    myToolbar.setIconsPath('/assets/images/icons/');
    myToolbar.addText(null, null, 'Producto a buscar : ');
    myToolbar.addInput('in_busq', null, '', 250);
    myToolbar.addSeparator(null, null);
    myToolbar.addButton('b_busq', null, '<i class="fas fa-search"></i> BUSCAR', null, null);
    myToolbar.addSeparator(null, null);
    myToolbar.addButton('b_check', null, 'AGREGAR', "ic-add.png", null);
    myToolbar.addSeparator(null, null);
    myToolbar.addButton('marcar',null,'MARCAR',"ic-marcar.png","");
    myToolbar.addSeparator(null, null);
    myToolbar.addButton('desmarcar',null,'DESMARCAR',"ic-desmarcar.png","");
    myToolbar.attachEvent('onClick', prodgrupoToolbar);
    myToolbar.attachEvent("onEnter", (id) => {        
        if (myToolbar.getValue('in_busq').length>0){            
            cargarproductoporgrupo(myToolbar.getValue('in_busq').toUpperCase()); 
        }else{
            dhtmlx.confirm("El campo esta vacío", function (result) {});
        }
    });
    myGridbuscar = Winid_.attachGrid();
    myGridbuscar.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    myGridbuscar.setHeader(',Cod.Producto,Descripción,Marca,Submarca');
    myGridbuscar.setInitWidths('50,100,500,150,150');
    myGridbuscar.setColAlign('center,left,left,left,left');
    myGridbuscar.setColTypes('ch,ro,ro,ro,ro'); 
    myGridbuscar.attachHeader(",#text_filter,#text_filter,#text_filter,#text_filter");
    myGridbuscar.setColumnIds('chec,cod,desc,marc,subm');      
    myGridbuscar.init();     
     
};

cargarproductoporgrupo = (buscar) => {  
  myGridbuscar.clearAll(); 
    Wind_.window("wbuscar").progressOn();
    myGridbuscar.load( BASE_URL + 'PO010410/mostrar-producto-por-grupo/'+grupo_prod+'/'+tipo_bien+'/'+clase_grupo+'/'+buscar).then(function (text) {
        Wind_.window('wbuscar').progressOff();
        cant_filas_l = myGridbuscar.getRowsNum();
    });  
};

onClickaction = async (id) => {
    serie_grabar = serie;
    switch (id) {
        case 'nuevo':
            nuev = 'S';
            verdetespecif('nuevo',de_grupo);
            break;   
        case 'historial':
            sel  = myGrid_group.getRowData(myGrid_group.getSelectedRowId());
            cargarlog(sel.vers,sel.cod);                
            break; 
        case 'copiar':
            col  = myGrid_group.getSelectedRowId();
            if(col) {
                sel  = myGrid_group.getRowData(col);
                especinput();
            }else{
                dhtmlx.confirm("Debe seleccionar una especificación", function (result) {
                });
            }
            break;   
        default:
            null;
            break;
    }
};

prodgrupoToolbar = async (id) => {
    switch (id) {
        case 'b_busq':
            if (myToolbar.getValue('in_busq').length>0){            
                cargarproductoporgrupo(myToolbar.getValue('in_busq').toUpperCase()); 
            }else{
                dhtmlx.confirm("El campo esta vacío", function (result) {});
            }
            break;    
        case 'b_check':
            var cant_filas_l_total  = cant_filas_l ;
            var cant_filas_n = 0;
            data = '';
            data_n = '';
            for(let i=0;i<cant_filas_l_total;i++){
                data = myGridbuscar.getRowData(i);
                if (data.chec == 1) {
                    myGrid_esprod.addRow(myGrid_esprod.uid(),[0,data.cod,data.desc,data.marc,data.subm],1);
                }      
            }     

            cant_filas_n = myGrid_esprod.getRowsNum();
            let iRowId_gri,iRowId;
            for(let n=1;n<cant_filas_n;n++){
                iRowId_gri = myGrid_esprod.getRowId(n);
                data_n = myGrid_esprod.getRowData(iRowId_gri);
                for(let i=1;i<cant_filas_n;i++){
                    iRowId = myGrid_esprod.getRowId(i);
                    data = myGrid_esprod.getRowData(iRowId);
                    if(iRowId!=iRowId_gri){
                        if (data_n.cod==data.cod){
                            myGrid_esprod.deleteRow(iRowId);
                            i = i - 1;
                            n = n - 1;
                            cant_filas_n = cant_filas_n - 1;
                        }
                    }
                }
            }            

            break; 
        case 'marcar':
            myGridbuscar.setCheckedRows(0,1);            
            break;    
        case 'desmarcar':
            myGridbuscar.setCheckedRows(0,0);            
            break;          
        default:
        null;
        break;
    }
};

cargarversiones = (espec) => {   
    myGrid_version.clearAll(); 
    mainLayout_det.cells('b').progressOn();
    myGrid_version.load( BASE_URL + 'PO010410/mostrar-version/'+usrJson.empresa+'/'+espec).then(function (text) {
        mainLayout_det.cells('b').progressOff();
    });
};

copiarespecificacion = (accion,espec_orig,grupo_prod,version_orig,co_espec_nue,proveedor,desc) => {   
    params = {
        accion: accion,
        empresa: usrJson.empresa,
        espec_orig: espec_orig,
        grupo_prod: grupo_prod,
        version_orig: version_orig,
        co_espec_nue: co_espec_nue,
        proveedor: proveedor,
        desc: desc,
        usuregistra: usrJson.codigo,
        alias: usrJson.alias
    };    
    console.log(params);
    $.post(BASE_URL + "PO010410/copiar-especificacion", params, function (res) {
        console.log(res);
        if (res.state=='success'){
            Swal.fire('Bien!', res.message, 'success');
            cargarespecific(de_grupo,grupo_prod);
        } else {
            Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se guardo el registro :' + res.message });
        }
    }, "json");
};

guardarprod = (especificacion,version,cadena,cantfilas) => {   
    params = {
        empresa: usrJson.empresa,
        usuario: usrJson.codigo,
        especificacion: especificacion,
        version: version,
        cadena: cadena,
        cantfilas: cantfilas
    };    
    $.post(BASE_URL + "PO010410/guardar-productos", params, function (res) {
        console.log(res);
        if (res.state=='success'){
            Swal.fire('Bien!', res.message, 'success');
            cargarespecific(de_grupo,grupo_prod);
        } else {
            Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se guardo el registro :' + res.message });
        }
    }, "json");
};

guardarcaract = (especificacion,version,cadena_cod_car,cadena_de_car,cantfilas,caract_gen,cond_alm) => {  
    params = {
        empresa: usrJson.empresa,
        usuario: usrJson.codigo,
        alias: usrJson.alias,
        especificacion: especificacion,
        version: version,
        cadena_cod_car: cadena_cod_car,
        cadena_de_car: cadena_de_car,
        cantfilas: cantfilas,
        caract_gen: caract_gen,
        cond_alm: cond_alm
    };    
    $.post(BASE_URL + "PO010410/guardar-caracteristicas", params, function (res) {
        console.log(res);
        if (res.state=='success'){
            Swal.fire('Bien!', res.message, 'success');
            cargarCaract(especificacion,version); 
        } else {
            Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se guardo el registro :' + res.message });
        }
    }, "json");
};

guardarensayo = (especificacion,version,ensayo,metodo,cadespec,limmin,limmax,cantfilas) => {   
    console.log(especificacion,version,ensayo,metodo,cadespec,limmin,limmax,cantfilas);  
    params = {
        empresa: usrJson.empresa,
        usuario: usrJson.codigo,
        especificacion: especificacion,
        version:version,
        ensayo: ensayo,
        metodo: metodo,
        cadespec: cadespec,
        limmin: limmin,
        limmax: limmax,
        cantfilas: cantfilas
    };    
    $.post(BASE_URL + "PO010410/guardar-ensayo", params, function (res) {
        console.log(res);
        if (res.state=='success'){
            Swal.fire('Bien!', res.message, 'success');
            cargarEnsayo(especificacion,version); 
        } else {
            Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se guardo el registro :' + res.message });
        }
    }, "json");
};

cargarprodporesp = (espec,version) => {  
    myGrid_esprod.clearAll(); 
    mainLayout_esprod.cells('a').progressOn();
    myGrid_esprod.load( BASE_URL + 'PO010410/mostrar-producto-por-espec/'+usrJson.empresa+'/'+espec+'/'+version).then(function (text) {
        mainLayout_esprod.cells('a').progressOff();
    });
};

buscarprov = async (name) => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbusq", 0, 0, 450, 500);
    Wind_.window("wbusq").setModal(true);
    Wind_.window("wbusq").denyResize();
    Wind_.window("wbusq").center();
    Winid_.setText("Proveedor");
    myToolbar = Wind_.window("wbusq").attachToolbar();
    myToolbar.addText(null, null, 'Proveedor: ');
    myToolbar.addInput('in_busq', null, '', 250);
    myToolbar.addSeparator(null, null);
    myToolbar.attachEvent("onEnter", (id) => {
        if (myToolbar.getValue('in_busq').length>0){            
            cargarproveedores(Wind_,myToolbar.getValue('in_busq').toUpperCase());
        }else{
            dhtmlx.confirm("El campo esta vacío", function (result) {});
        }
    });
    myGrid = Winid_.attachGrid();
    myGrid.setHeader('Cod. Usuario,Razón Social');
    myGrid.setInitWidthsP('30,70');
    myGrid.setColTypes('ro,ro');
    myGrid.setColumnIds("cod_usuario,raz_social");
    myGrid.attachHeader("#text_filter,#text_filter");
    myGrid.clearAll();
    myGrid.init();
    myGrid.attachEvent("onRowSelect", function (id, ind) {
        data = myGrid.getRowData(myGrid.getSelectedRowId())
        cod = data.cod_usuario;
        prov = data.raz_social;
        myFormespecf.setItemValue('ep_provcod',cod);
        myFormespecf.setItemValue('ep_proveedor',prov);
        Wind_.window("wbusq").close();
    });
};

cargarproveedores = (win,buscar) => {
    win.window("wbusq").progressOn();
    myGrid.clearAll();
    myGrid.load( BASE_URL + 'PO010410/mostrar-proveedor/'+ usrJson.empresa+'/'+buscar).then(function (text) {
        win.window("wbusq").progressOff();
    });
};

buscarnsoc = async (name) => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbusq", 0, 0, 450, 500);
    Wind_.window("wbusq").setModal(true);
    Wind_.window("wbusq").denyResize();
    Wind_.window("wbusq").center();
    Winid_.setText("NSOC");
    myGrid = Winid_.attachGrid();
    myGrid.setHeader('Cod. NSOC,Descripción');
    myGrid.setInitWidthsP('30,70');
    myGrid.setColTypes('ro,ro');
    myGrid.setColumnIds("cod,desc");
    myGrid.attachHeader("#text_filter,#text_filter");
    myGrid.clearAll();
    myGrid.init();
    Wind_.window("wbusq").progressOn();
    myGrid.clearAll();
    myGrid.load( BASE_URL + 'PO010410/mostrar-nsoc/').then(function (text) {
        Wind_.window("wbusq").progressOff();
    });
    myGrid.attachEvent("onRowSelect", function (id, ind) {
        data = myGrid.getRowData(myGrid.getSelectedRowId())
        cod = data.cod;
        myFormespecf.setItemValue('ep_nsoc',cod);
        Wind_.window("wbusq").close();
    });
};

guardarcabecera = (especificacion,version,proveedor,grupo,descripcion,serie,accion,descproveedor,tipo_espec) => {   
    params = {
        empresa: usrJson.empresa,
        usuario: usrJson.codigo,
        especificacion: especificacion,
        version: version,
        proveedor: proveedor,
        grupo: grupo,
        descripcion: descripcion,
        serie:serie,
        accion:accion,
        tipo:tipo_espec
    };    
    $.post(BASE_URL + "PO010410/guardar-cabecera", params, function (res) {
        console.log(especificacion,grupo_prod,clase_grupo,tipo_bien);
        if (res.state=='success'){
            Swal.fire('Bien!', res.message, 'success');
            cargarespecific(de_grupo,grupo_prod);
            // cargarespecific(de_grupo,grupo_prod,clase_grupo,tipo_bien);  
            // tabbar_det.tabs('presp').show();
            // tabbar_det.tabs('crt').show();
            // tabbar_det.tabs('esy').show();
            // tabbar_det.tabs('cpto').show();
            // tabbar_det.tabs('hst').show();
            // tabbar_det.tabs('arc').show();
            // tabbar_det.tabs('prod').show();
            // myFormespecf.setItemValue('ep_provcod','');
            // myFormespecf.setItemValue('ep_proveedor','');
            // myFormespecf.setItemValue('ep_desc','');
            // if (nuev == 'E'){
            //     myFormespecf.setItemValue('ep_provcod',proveedor);
            //     myFormespecf.setItemValue('ep_proveedor',descproveedor);
            //     myFormespecf.setItemValue('ep_desc',descripcion);
            // }
        } else {
            Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se guardo el registro :' + res.message });
        }
    }, "json");
};

verdetespecif = async (condic,de_grupo) => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbuscar", 0, 0, 600, 400);
    Wind_.window("wbuscar").setModal(true);
    Wind_.window("wbuscar").denyResize();
    Wind_.window("wbuscar").center();     
    myToolbar = Wind_.window("wbuscar").attachToolbar();
    myToolbar.setIconsPath('/assets/images/icons/');
    myToolbar.addButton('save', null, 'Guardar', "ic-save2.png", null);
    myToolbar.addSeparator(null, null);
    myToolbar.addButton('edit',null,'Editar',"ic-edit3.png","");
    myToolbar.attachEvent('onClick', onClickDetesp);  
    myFormespecf = Wind_.window("wbuscar").attachForm(form_especf);
    if (de_grupo == '__gran'){
        console.log(de_grupo);
        myFormespecf.showItem('ep_tipo');
    }else{
        console.log(de_grupo+'1');
        myFormespecf.hideItem('ep_tipo');
    };
    if (condic=='edit'){
        Winid_.setText(win_desc);
        myFormespecf.setItemValue('ep_codigo',form_cod);
        myFormespecf.setItemValue('ep_version',form_vers);
        myFormespecf.setItemValue('ep_estado',form_vig);
        myFormespecf.setItemValue('ep_provcod',form_codprov);
        myFormespecf.setItemValue('ep_proveedor',form_prov);
        myFormespecf.setItemValue('ep_desc',form_desc);
        myFormespecf.setItemValue('ep_fecc',form_fcrea);
        myFormespecf.setItemValue('ep_crea',form_crea);
        myFormespecf.setItemValue('ep_fecrev',form_frev);
        myFormespecf.setItemValue('ep_rev',form_rev);
        myFormespecf.setItemValue('ep_fecapro',form_fapr);
        myFormespecf.setItemValue('ep_aprob',form_aprob);     
        myFormespecf.setItemValue('ep_nsoc',form_coesp);     
        myFormespecf.setItemValue('ep_tipo',form_tipo); 
          
    }else{        
        Winid_.setText('Crear nueva especificación');
        myFormespecf.disableItem('ep_codigo'),myFormespecf.disableItem('ep_version');
        myFormespecf.disableItem('ep_estado'),myFormespecf.setReadonly('ep_provcod',false);
        myFormespecf.setReadonly('ep_proveedor',false),myFormespecf.setReadonly('ep_desc',false);
        myFormespecf.disableItem('ep_fecc'),myFormespecf.disableItem('ep_crea');
        myFormespecf.disableItem('ep_fecrev'),myFormespecf.disableItem('ep_rev');
        myFormespecf.disableItem('ep_fecapro'),myFormespecf.disableItem('ep_aprob');
        myFormespecf.enableItem('buscarprov'),myFormespecf.disableItem('buscarnsoc');
        myFormespecf.clear();
        // mytoolbar.enableItem('save');
    }
    myFormespecf.attachEvent("onButtonClick", async (name) => {
        switch (name) {
            case 'buscarprov':
                buscarprov();
                break;
            case 'buscarnsoc':
                buscarnsoc();
                break;
            default:
                null;
                break;
        }
    });
};


onClickDetesp = async (id) => {
    switch (id) {
        case 'save':
            proveedor = myFormespecf.getItemValue('ep_provcod');
            descproveedor = myFormespecf.getItemValue('ep_proveedor');
            nsoc = myFormespecf.getItemValue('ep_nsoc');
            descripcion = myFormespecf.getItemValue('ep_desc');
            tipo_espec = myFormespecf.getItemValue('ep_tipo');
            console.log(nuev,proveedor,nsoc,descripcion,tipo_espec);
            if (nuev == 'S'){
                console.log('1');
                console.log(nuev);
                guardarcabecera(11,1,proveedor,grupo_prod,descripcion,serie,nuev,descproveedor,tipo_espec);
            }else{ 
                console.log('2');
                console.log(nuev);
                version = myFormespecf.getItemValue('ep_version');
                especificacion = myFormespecf.getItemValue('ep_codigo');
                guardarcabecera(especificacion,version,proveedor,grupo_prod,descripcion,serie,nuev,descproveedor,tipo_espec);
            };
            break;    
            case 'edit': 
                nuev = 'E';     
                myFormespecf.enableItem('buscarprov');   
                myFormespecf.setReadonly('ep_desc',false);         
                break; 
        default:
            null;
            break;
    }
};

vercaracteristicas = async () => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbuscar", 0, 0, 500, 500);
    Winid_.setText("Características");
    Wind_.window("wbuscar").setModal(true);
    Wind_.window("wbuscar").denyResize();
    Wind_.window("wbuscar").center(); 
    myToolbar = Wind_.window("wbuscar").attachToolbar();
    myToolbar.setIconsPath('/assets/images/icons/');
    myToolbar.addButton('b_check', null, 'AGREGAR', "ic-add.png", null);
    myToolbar.addSeparator(null, null);
    myToolbar.addButton('marcar',null,'MARCAR',"ic-marcar.png","");
    myToolbar.addSeparator(null, null);
    myToolbar.addButton('desmarcar',null,'DESMARCAR',"ic-desmarcar.png","");
    myToolbar.attachEvent('onClick', carselOnToolbar);
    // myToolbar.attachEvent("onEnter", (id) => {
    //     cargarproductoporgrupo(myToolbar.getValue('in_busq').toUpperCase());
    // });
    myGridcaractsel = Winid_.attachGrid();
    myGridcaractsel.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    myGridcaractsel.setHeader(',,Característica,Descripción');
    myGridcaractsel.setInitWidths('50,0,200,400');
    myGridcaractsel.setColAlign('center,left,left,left');
    myGridcaractsel.setColTypes('ch,ro,ro,ro'); 
    myGridcaractsel.attachHeader(",,#text_filter,#text_filter");
    myGridcaractsel.setColumnIds('chec,cod,car,desc');      
    myGridcaractsel.init();     
    myGridcaractsel.clearAll(); 
      Wind_.window("wbuscar").progressOn();
      myGridcaractsel.load( BASE_URL + 'PO010410/mostrar-lista-caract/').then(function (text) {
          Wind_.window('wbuscar').progressOff();
          cant_filas_l = myGridcaractsel.getRowsNum();
      });  
     
};

verensayo = async () => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbuscar", 0, 0, 800, 500);
    Winid_.setText("Ensayos");
    Wind_.window("wbuscar").setModal(true);
    Wind_.window("wbuscar").denyResize();
    Wind_.window("wbuscar").center(); 
    myToolbar = Wind_.window("wbuscar").attachToolbar();
    myToolbar.setIconsPath('/assets/images/icons/');
    myToolbar.addButton('b_check', null, 'AGREGAR', "ic-add.png", null);
    myToolbar.addSeparator(null, null);
    myToolbar.addButton('marcar',null,'MARCAR',"ic-marcar.png","");
    myToolbar.addSeparator(null, null);
    myToolbar.addButton('desmarcar',null,'DESMARCAR',"ic-desmarcar.png","");
    myToolbar.attachEvent('onClick', ensayoOnToolbar);
    myGridensaysel = Winid_.attachGrid();
    myGridensaysel.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    myGridensaysel.setHeader(',Método Análisis,Método,Cod.Ensayo,Ensayo,Cod.Tipo Ensayo,Tipo Ensayo,Obj.Ensayo,Num.Versión,Cod.Método,Unid.Análisis,ST_Obligatorio,ST_DECLARADO,ST_Especificación,ST_Guia,ST_Estado');
    myGridensaysel.setInitWidths('50,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200');
    myGridensaysel.setColAlign('center,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left');
    myGridensaysel.setColTypes('ch,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro'); 
    myGridensaysel.attachHeader(",#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter");
    myGridensaysel.setColumnIds('chec,comet,met,codens,ens,cotipo,tipens,obj,num,codmet');      
    myGridensaysel.init();   
    myGridensaysel.clearAll(); 
    Wind_.window("wbuscar").progressOn();
    myGridensaysel.load( BASE_URL + 'PO010410/mostrar-ensayo-por-grupo/'+grupo_prod).then(function (text) {
        Wind_.window('wbuscar').progressOff();
        cant_filas_l = myGridensaysel.getRowsNum();
    });      
};


vercomplemento = async () => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbuscar", 0, 0, 800, 500);
    Winid_.setText("Complemento");
    Wind_.window("wbuscar").setModal(true);
    Wind_.window("wbuscar").denyResize();
    Wind_.window("wbuscar").center(); 
    myToolbar = Wind_.window("wbuscar").attachToolbar();
    myToolbar.setIconsPath('/assets/images/icons/');
    myToolbar.addText(null, null, 'Producto a buscar : ');
    myToolbar.addInput('in_busq', null, '', 250);
    myToolbar.addSeparator(null, null);
    myToolbar.addButton('b_busq', null, '<i class="fas fa-search"></i> BUSCAR', null, null);
    myToolbar.addSeparator(null, null);
    myToolbar.addButton('b_check', null, 'AGREGAR', "ic-add.png", null);
    myToolbar.addSeparator(null, null);
    myToolbar.addButton('marcar',null,'MARCAR',"ic-marcar.png","");
    myToolbar.addSeparator(null, null);
    myToolbar.addButton('desmarcar',null,'DESMARCAR',"ic-desmarcar.png","");
    myToolbar.attachEvent('onClick', cpmtOnToolbar);
    myToolbar.attachEvent("onEnter", (id) => {
        if (myToolbar.getValue('in_busq').length>0){            
            cargarcmpt(myToolbar.getValue('in_busq').toUpperCase()); 
        }else{
            dhtmlx.confirm("El campo esta vacío", function (result) {});
        }
    });
    myGridbuscar = Winid_.attachGrid();
    myGridbuscar.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    myGridbuscar.setHeader(',Cod.Producto,Descripción,U.M');
    myGridbuscar.setInitWidths('50,100,600,100');
    myGridbuscar.setColAlign('center,left,left,center');
    myGridbuscar.setColTypes('ch,ro,ro,ro'); 
    myGridbuscar.setColumnIds('chec,cod,desc,um');      
    myGridbuscar.init();     
     
};

agregarhistoria = async () => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbuscar", 0, 0, 500, 250);
    Winid_.setText("Historial");
    Wind_.window("wbuscar").setModal(true);
    Wind_.window("wbuscar").denyResize();
    Wind_.window("wbuscar").center(); 
    myToolbar = Wind_.window("wbuscar").attachToolbar();
    myToolbar.setIconsPath('/assets/images/icons/');
    myToolbar.addButton('b_guardar', null, 'Guardar', "ic-acept.png", null);
    myToolbar.addSeparator(null, null);
    myToolbar.attachEvent('onClick',toolbarOnhist);
    myFormdatos_cosm = Wind_.window("wbuscar").attachForm(f_historia);     
};

especinput = async () => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbuscar", 0, 0, 500, 250);
    Winid_.setText("Copiar Especificación - "+win_desc);
    Wind_.window("wbuscar").setModal(true);
    Wind_.window("wbuscar").denyResize();
    Wind_.window("wbuscar").center(); 
    myToolbar = Wind_.window("wbuscar").attachToolbar();
    myToolbar.setIconsPath('/assets/images/icons/');
    myToolbar.addButton('b_guardar', null, 'Guardar', "ic-acept.png", null);
    myToolbar.addSeparator(null, null);
    myToolbar.attachEvent('onClick',toolbarOninput);
    myFormdatos_input = Wind_.window("wbuscar").attachForm(f_copiaespec);     
};

cargarespecopia = (grupo,flag) => {
    const params = {
        empresa : usrJson.empresa,
        grupo: grupo,
        flag: flag,
    };
    console.log(params);
    $.post(BASE_URL + 'PO010410/mostrar-especificacion-copia/', params, function (res) {
        console.log(res);
        const valor = res.data.copia;
        myFormdatos_inputvers.reloadOptions('_et_cod', valor);
    } , 'json');
}

versioninput = async () => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbuscar", 0, 0, 500, 250);
    Winid_.setText("Copiar Versión - "+win_desc);
    Wind_.window("wbuscar").setModal(true);
    Wind_.window("wbuscar").denyResize();
    Wind_.window("wbuscar").center(); 
    myToolbar = Wind_.window("wbuscar").attachToolbar();
    myToolbar.setIconsPath('/assets/images/icons/');
    myToolbar.addButton('b_guardar', null, 'Guardar', "ic-acept.png", null);
    myToolbar.addSeparator(null, null);
    myToolbar.attachEvent('onClick',toolbarOninputvers);
    myFormdatos_inputvers = Wind_.window("wbuscar").attachForm(f_copiavers); 
    cargarespecopia(grupo_prod,'S');    
};

cargarlog = async (version,espec) => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbuscar", 0, 0, 500, 500);
    Winid_.setText("Historial de cambios");
    Wind_.window("wbuscar").setModal(true);
    Wind_.window("wbuscar").denyResize();
    Wind_.window("wbuscar").center(); 
    myGridlog = Winid_.attachGrid();
    myGridlog.setHeader('Acción,Fecha,Evento,Usuario');
    myGridlog.setInitWidths('100,100,400,200');
    myGridlog.setColAlign('center,center,left,left');
    myGridlog.setColTypes('ro,ro,ro,ro');     
    myGridlog.init();     
    myGridlog.clearAll(); 
      Wind_.window("wbuscar").progressOn();
      myGridlog.load( BASE_URL + 'PO010410/mostrar-log/'+usrJson.empresa+'/'+espec+'/'+version).then(function (text) {
          Wind_.window('wbuscar').progressOff();
      });       
};

carselOnToolbar = async (id) => {
    switch (id) {
        case 'b_check':
            var cant_filas_l_total  = cant_filas_l ;
            var cant_filas_n = 0;
            data = '';
            data_n = '';
            for(let i=0;i<cant_filas_l_total;i++){
                data = myGridcaractsel.getRowData(i);
                console.log(data);
                if (data.chec == 1) {
                    myGrid_caract.addRow(myGrid_caract.uid(),[data.cod,data.car,''],1);
                }      
            }     

            cant_filas_n = myGrid_caract.getRowsNum();
            console.log(cant_filas_n);
            let iRowId_gri,iRowId;
            for(let n=1;n<cant_filas_n;n++){
                iRowId_gri = myGrid_caract.getRowId(n);
                console.log(iRowId_gri);
                data_n = myGrid_caract.getRowData(iRowId_gri);
                console.log(data_n);
                for(let i=1;i<cant_filas_n;i++){
                    iRowId = myGrid_caract.getRowId(i);
                    data = myGrid_caract.getRowData(iRowId);
                    console.log(data);
                    if(iRowId!=iRowId_gri){
                        if (data_n.id==data.id){
                            myGrid_caract.deleteRow(iRowId);
                            i = i - 1;
                            n = n - 1;
                            cant_filas_n = cant_filas_n - 1;
                        }
                    }
                }
            }            

            break; 
        case 'marcar':
            myGridcaractsel.setCheckedRows(0,1);            
            break;    
        case 'desmarcar':
            myGridcaractsel.setCheckedRows(0,0);            
            break;          
        default:
        null;
        break;
    }
};


ensayoOnToolbar = async (id) => {
    switch (id) {  
        case 'b_check':
            var cant_filas_l_total  = cant_filas_l ;
            var cant_filas_n = 0;
            data = '';
            data_n = '';
            for(let i=0;i<cant_filas_l_total;i++){
                data = myGridensaysel.getRowData(i);
                if (data.chec == 1) {
                    myGrid_ensa.addRow(myGrid_ensa.uid(),[0,data.codmet,data.met,data.codens,data.ens,,,,data.tipens,data.obj],1);
                }      
            }     

            cant_filas_n = myGrid_ensa.getRowsNum();
            let iRowId_gri,iRowId;
            console.log(cant_filas_n);
            for(let n=1;n<cant_filas_n;n++){
                iRowId_gri = myGrid_ensa.getRowId(n);
                data_n = myGrid_ensa.getRowData(iRowId_gri);
                console.log(data_n);
                for(let i=1;i<cant_filas_n;i++){
                    iRowId = myGrid_ensa.getRowId(i);
                    data = myGrid_ensa.getRowData(iRowId);
                    if(iRowId!=iRowId_gri){
                        if (data_n.codens==data.codens){
                            myGrid_ensa.deleteRow(iRowId);
                            i = i - 1;
                            n = n - 1;
                            cant_filas_n = cant_filas_n - 1;
                        }
                    }
                }
            }            

            break; 
        case 'marcar':
            myGridensaysel.setCheckedRows(0,1);            
            break;    
        case 'desmarcar':
            myGridensaysel.setCheckedRows(0,0);            
            break;          
        default:
        null;
        break;
    }
};

toolbarOncmpt  = async (id) => {
    switch (id) {
        case 'cargarcmp':
            vercomplemento();
            break;       
        case 'aceptar':
            break;     
        default:
            null;
            break;
    }
};

toolbarOninput  = async (id) => {
    switch (id) { 
        case 'b_guardar':            
            desc = myFormdatos_input.getItemValue('_et_desc');
            //(accion,espec_orig,grupo_prod,version_orig,co_espec_nue,proveedor,desc) 
            if (desc.length>0){
                copiarespecificacion('ce',sel.cod,grupo_prod,sel.vers,'11',sel.codprov,desc)
            }else{
                dhtmlx.confirm("Campo vacío", function (result) {
                });
            }
            break;  
        default:
            null;
            break;
    }
};

toolbarOninputvers  = async (id) => {
    switch (id) { 
        case 'b_guardar':   
            console.log('a');        
            cod = myFormdatos_inputvers.getItemValue('_et_cod');
            desc = myFormdatos_inputvers.getItemValue('_et_desc');
            console.log(cod,desc,sel.cod,grupo_prod,sel.vers,'11',sel.codprov,desc);
            if (desc.length>0){
                copiarespecificacion('cv',sel.cod,grupo_prod,sel.vers,cod,version_prov,desc)
            }else{
                dhtmlx.confirm("Campo vacío", function (result) {
                });
            }
            break;  
        default:
            null;
            break;
    }
};

toolbarOnhist  = async (id) => {
    switch (id) {
        case 'cargarcmp':
            agregarhistoria();
            break;     
        case 'b_guardar':
            console.log(myToolbar.getValue('in_busq').toUpperCase());
            //agregarhistoria();
            break;  
        default:
            null;
            break;
    }
};

cpmtOnToolbar = async (id) => {
    switch (id) {
        case 'b_busq':
            if (myToolbar.getValue('in_busq').length>0){            
                cargarcmpt(myToolbar.getValue('in_busq').toUpperCase()); 
            }else{
                dhtmlx.confirm("El campo esta vacío", function (result) {});
            }
            break; 
        case 'b_check':
            var cant_filas_l_total  = cant_filas_l ;
            var cant_filas_n = 0;
            data = '';
            data_n = '';
            for(let i=0;i<cant_filas_l_total;i++){
                data = myGridbuscar.getRowData(i);
                console.log(data);
                if (data.chec == 1) {
                    myGrid_cpto.addRow(myGrid_cpto.uid(),[0,data.cod,data.desc],1);
                }      
            }     

            cant_filas_n = myGrid_cpto.getRowsNum();
            console.log(cant_filas_n);
            let iRowId_gri,iRowId;
            for(let n=1;n<cant_filas_n;n++){
                iRowId_gri = myGrid_cpto.getRowId(n);
                console.log(iRowId_gri);
                data_n = myGrid_cpto.getRowData(iRowId_gri);
                console.log(data_n);
                for(let i=1;i<cant_filas_n;i++){
                    iRowId = myGrid_cpto.getRowId(i);
                    data = myGrid_cpto.getRowData(iRowId);
                    console.log(data);
                    if(iRowId!=iRowId_gri){
                        if (data_n.cod==data.cod){
                            myGrid_cpto.deleteRow(iRowId);
                            i = i - 1;
                            n = n - 1;
                            cant_filas_n = cant_filas_n - 1;
                        }
                    }
                }
            }            

            break; 
        case 'marcar':
            myGridbuscar.setCheckedRows(0,1);            
            break;    
        case 'desmarcar':
            myGridbuscar.setCheckedRows(0,0);            
            break;          
        default:
        null;
        break;
    }
};

cargarcmpt = (buscar) => {  
    myGridbuscar.clearAll(); 
    myGridbuscar.attachHeader(",#text_filter,#text_filter,");
    Wind_.window("wbuscar").progressOn();
    myGridbuscar.load( BASE_URL + 'PO010410/mostrar-complemento-por-grupo/'+grupo_prod+'/'+buscar).then(function (text) {        
        Wind_.window('wbuscar').progressOff();
        cant_filas_l = myGridbuscar.getRowsNum();
    });  
};