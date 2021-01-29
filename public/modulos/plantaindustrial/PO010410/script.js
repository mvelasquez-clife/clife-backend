var ind_grupo,ind_pt,message_pt,nom_report,nva_clase,varprov,version_prov,version_esp,cod_esp,win_desc,form_tipo,form_cod,form_vers,form_vig,form_codprov,form_prov,form_desc,form_fcrea,form_crea,form_frev,form_rev,form_fapr,form_aprob,form_coesp,serie,num_fila,data_n,data,cant_filas_n,cant_filas_l,de_grupo,clase_grupo,grupo_prod,tipo_bien,myGrid_version,myGrid_prod,mainLayout_prod,myGrid_hist,mainLayout_hist,myGrid_cpto,mainLayout_cpto,myGrid_ensa,mainLayout_ensa,myGrid_caract,myFormdcaract,mainLayout_caract,myFormdformu,mainLayout,tabbar,mainLayout_group,myGrid_group,tabbar_det
var st_vers,flag;
var nuev = '';
ind_grupo ='E';
Inicio = () => {
    mainLayout = new dhtmlXLayoutObject(document.body, '2U');
    mainLayout.cells('a').setText('Especificaciones');
    tabbar = mainLayout.cells('a').attachTabbar();
    tabbar.addTab('__ept', 'PRODUCTO TERMINADO', null, null, true);
    tabbar.addTab('__gran', 'GRANEL', null, null, true);
    tabbar.addTab('__insu', 'INSUMOS INTERNOS', null, null, false);
    tabbar.addTab('__matpr', 'MATERIA PRIMA', null, null, false);
    tabbar.addTab('__emp', 'EMPAQUES', null, null, false);
    tabbar.attachEvent ( "onSelect" , inicioOnSelect); 
    mainLayout.cells('a').setWidth(740);
    mainLayout_det = mainLayout.cells('b').attachLayout('2E');
    mainLayout.cells('b').collapse();
    mainLayout.cells('b').setText('Detalle');
    mainLayout_det.cells('b').setText('Detalle');
    mainLayout_det.cells('a').setText('Versiones');
    esptoolbar = mainLayout_det.cells('a').attachToolbar(); 
    esptoolbar.setIconsPath('/assets/images/icons/');
    esptoolbar.addButton('verdet',null,'Ver Detalle',"ic-buskard.png","");
    esptoolbar.addButton('copiar',null,'Nueva Versión',"ic-add2.png","");
    esptoolbar.addButton('espec',null,'Copiar Especificación',"ic-copy.png","");
    esptoolbar.addButton('descontinuar',null,'Descontinuar',"ic-cancel.png","");
    esptoolbar.addButton('minimizar',null,'Ocultar',"ic-hide.png","");
    esptoolbar.addButton('maximizar',null,'Maximizar',"ic-expand.png","");
    esptoolbar.addButton('info',null,'',"ic-info.png","");  
    esptoolbar.attachEvent('onClick', mainToolbarOnClick);
    esptoolbar.setIconSize(18);
    myGrid_version= mainLayout_det.cells('a').attachGrid();
    myGrid_version.setSizes ("8px");
    myGrid_version.setHeader('Cod.Espec,Ver.,Estado,Proveedor,Cod.Proveedor,Tipo Espec.');
    myGrid_version.setInitWidths('100,80,100,400,0,400');
    myGrid_version.setColAlign('left,left,left,left,left');
    myGrid_version.setColumnIds('cod,vers,estado,proveedor,codprov,tipoesp');     
    myGrid_version.init();   
    iniciotabs();
    grupo_prod = 2;
    clase_grupo = 2;
    tipo_bien = 10;
    de_grupo = '__gran';
    serie = 'ETGR';
    nom_report = 'ESPECIFICACIONES TECNICAS DE GRANEL';
    cargarespecific('__gran',2);
    // cargarespecProd();
    
    
}

iniciotabs= () => {
    tabbar_det = mainLayout_det.cells('b').attachTabbar();
    if (grupo_prod==1||grupo_prod==5){
        tabbar_det.addTab('crt', 'Características', null, null, true);
    }else{
        tabbar_det.addTab('presp', 'Productos Espec.', null, null, true);
        tabbar_det.addTab('crt', 'Características', null, null, false);
    }
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
        case 'minimizar':   
            mainLayout.cells('b').collapse();
            break;      
        case 'maximizar':  
            mainLayout.cells('a').collapse();
            break;      
        case 'copiar':
            console.log(ind_grupo);
            if (ind_grupo == 'P'){
                col  = myGrid_espvers.getSelectedRowId();
                sel  = myGrid_espvers.getRowData(col);
                sel_grid = myGrid_espvers.getRowData(myGrid_espvers.getSelectedRowId());
                suma =Sumar(sel_grid.vers,1);
                versioninput(sel_grid.cod,suma,sel_grid.codprov,sel_grid.proveedor,sel_grid.nom);
            }else{
                col  = myGrid_version.getSelectedRowId();
                sel  = myGrid_version.getRowData(col);
                sel_grid = myGrid_group.getRowData(myGrid_group.getSelectedRowId());
                suma =Sumar(sel_grid.vers,1);
                versioninput(sel_grid.cod,suma,sel_grid.codprov,sel_grid.prov,sel_grid.desc);
            }

            break;    
        case 'info':
            if(ind_pt=='S'){
                dhtmlx.confirm("La especificación esta vinculada con: "+message_pt, function (result) {});
            }else{
                dhtmlx.confirm("No existe version Granel", function (result) {});                
            }
            break;     
        case 'espec':
            col  = myGrid_espvers.getSelectedRowId();
            if(col) {
                sel  = myGrid_espvers.getRowData(col);
                especinput();
            }else{
                dhtmlx.confirm("Debe seleccionar una especificación", function (result) {
                });
            }
            break;      
        case 'descontinuar':  
            sel_grid = myGrid_group.getRowData(myGrid_group.getSelectedRowId());
            var output = await IniciarFormularioSeguridad(265, mainLayout);
            if (output.result === 'S') {
                descontinuar(sel_grid.cod,sel_grid.vers,sel_grid.codprov);
            }else{
                var permiso_cataedit = 'E';
            }
        default:
            null;
            break;
    }
};


function Sumar(a,b){
    return parseInt(a)+parseInt(b);
  }

inicioOnSelect= async (id) => {
   // buscar = myFormdformu.getItemValue('_ep_buscar').length>0 ? myFormdformu.getItemValue('_ep_buscar').toUpperCase() : '-';
    // flag = myFormdformu.isItemChecked('_ch_todo')?'S':'N';    
    switch (id) {
        case '__gran':     
            serie = 'ETGR';
            nom_report = 'ESPECIFICACIONES TECNICAS DE GRANEL';
            grupo_prod = 2;
            clase_grupo = 2;
            tipo_bien = 10; 
            de_grupo = '__gran';
            cargarespecific(de_grupo,grupo_prod);        
            break;   
        case '__ept':     
            serie = 'ETPT';
            nom_report = 'ESPECIFICACIONES TECNICAS DE PRODUCTO TERMINADO';
            grupo_prod = 4;
            clase_grupo = 2;
            tipo_bien = 10; 
            de_grupo = '__ept';
            cargarespecific(de_grupo,grupo_prod);             
            break;   
        case '__matpr':     
            serie = 'ETMP';
            nom_report = 'ESPECIFICACIONES TECNICAS DE MATERIA PRIMA';
            de_grupo = '__matpr';
            grupo_prod = 1;
            clase_grupo = 1;
            tipo_bien = 1; 
            cargarprodespecgrupo(de_grupo,grupo_prod); 
            break;   
        case '__emp':     
            grupo_prod = 5;
            de_grupo = '__emp'; 
            serie = 'ETME';
            nom_report = 'ESPECIFICACIONES TECNICAS DEL MATERIAL DE EMPAQUE';
            cargarprodespecgrupo(de_grupo,grupo_prod); 
            break;
        case '__insu':  
            serie = 'ETII';
            nom_report = 'ESPECIFICACIONES TECNICAS DE INSUMO INTERNO ';
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
    console.log(st_vers);
    if(version_esp.length>0){
        switch (id) {
            case 'presp':
                cargarespecProd(cod_esp,version_esp,st_vers);
                break;
            case 'crt':     
                cargarCaract(cod_esp,version_esp,st_vers);   
                break;
            case 'esy':     
                cargarEnsayo(cod_esp,version_esp,st_vers);  
                break;
            case 'cpto':     
                cargarCompto(cod_esp,version_esp,st_vers); 
                break;        
            case 'hst':     
                cargarHistorial(cod_esp,version_esp,st_vers); 
                break; 
            case 'arc':     
                cargarDocumento(cod_esp,version_esp,st_vers); 
                break;   
            case 'arcdt':     
                cargarDocumentodt(cod_esp,version_esp,st_vers); 
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
        case 'verspro':
            if (grupo_prod==5){
                subpr = myGrid_prod.getRowData(myGrid_prod.getSelectedRowId());
            }else{
                subpr = myGrid_esprod.getRowData(myGrid_esprod.getSelectedRowId());
            }
            cargarsubproductos(subpr.cod,subpr.desc);
            break;
        case 'verprod':
            verproducto(grupo_prod);
            break;       
        case 'eliminar':
            let to_fila_data_num_gri = myGrid_esprod.getRowsNum();
            console.log(to_fila_data_num_gri);
            for(var i=0;i<to_fila_data_num_gri;i++){
                console.log('data');
                let iRowId_gri = myGrid_esprod.getRowId(i);
                console.log(iRowId_gri);
                data = myGrid_esprod.getRowData(iRowId_gri);
                if (data.chec == 1) {
                    myGrid_esprod.deleteRow(iRowId_gri);
                    i = i - 1;
                    to_fila_data_num_gri = to_fila_data_num_gri - 1;
                }
            }
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
                }console.log(cadena);

                guardarprod(sel.cod,version_esp,cadena,cant_filas_guardar-1);
            }
            break;     
        default:
            null;
            break;
    }
};

cargarespecific = (nombre,grupo) => { 
    ind_grupo = 'E';    
    console.log(ind_grupo);
    nom_report = nom_report;
    mainLayout_group = tabbar.cells(nombre).attachLayout('1C');    
    myGrid_group = mainLayout_group.cells('a').attachGrid();
    mainLayout_group.cells('a').hideHeader();
    mytoolbar = mainLayout_group.cells('a').attachToolbar();  
    mytoolbar.setIconsPath('/assets/images/icons/');
    if (grupo!=2){
        mytoolbar.addButton('nuevo',null,'Nuevo',"ic-add3.png","ic-add3.png");
        mytoolbar.addButton('copiar',null,'Copiar Especificación',"ic-copy.png","");
    }
    mytoolbar.addButton('historial',null,'Historial de cambios',"ic-historial.png","");
    mytoolbar.addButton('print',null,'Imprimir',"print.png","");
    mytoolbar.attachEvent ( "onClick" , onClickaction); 
    mytoolbar.setIconSize(32);    
    myGrid_group.setHeader('Cod.Espec.,Descripción,Cod.Espec. Granel,Cod.NSOC,Ver.,Estado,F.Creación,F.Revisado,F.Aprobado,Creado por:,Revisado por:,Aprobado por:,Proveedor,Cod.Proveedor,Tipo');
    myGrid_group.setInitWidths('80,400,80,150,50,80,80,80,80,200,200,200,200,0,100');
    myGrid_group.setColAlign('left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left');
    myGrid_group.setColTypes('ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro'); 
    myGrid_group.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,,#text_filter,#text_filter");     
    myGrid_group.setColumnIds('cod,desc,cgranel,coesp,vers,vig,fcrea,frev,fapr,crea,rev,aprob,prov,codprov,tip');  
    myGrid_group.init();      
    myGrid_group.clearAll(); 
    mainLayout_group.cells('a').progressOn();
    mainLayout.cells('b').collapse();
    if(grupo_prod!=4){        
        myGrid_group.setColumnHidden(2,true);
    }
    myGrid_group.load( BASE_URL + 'PO010411/mostrar-especificacion-grupo/'+usrJson.empresa+'/'+grupo).then(function (text) {
        mainLayout_group.cells('a').progressOff();
        num_fila = myGrid_group.getRowsNum();
        let iRowId;
        for(let i=0;i<num_fila;i++){
            iRowId = myGrid_group.getRowId(i);
            data = myGrid_group.getRowData(iRowId);
            if(data.vig=='Vigente'){
                myGrid_group.setRowColor(iRowId,"#90EE90");
            }else{
                if(data.vig=='Por Aprobar'||data.vig=='Revisada'){
                    myGrid_group.setRowColor(iRowId,"#F7D358");
                }else{
                    myGrid_group.setRowColor(iRowId,"red");
                }
            }
        }
    });
    myGrid_group.attachEvent("onRowSelect", function (id, ind) {
        mainLayout.cells('b').expand();
        mainLayout_det.cells('a').expand();
        mainLayout_det.cells('b').collapse();
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
        form_tipo = data.tip;    
        iniciotabs();
        tabbar_det.tabs('presp').show();
        tabbar_det.tabs('crt').show();
        tabbar_det.tabs('esy').show();
        tabbar_det.tabs('cpto').show();
        tabbar_det.tabs('hst').show();
        // tabbar_det.tabs('arc').show();
        tabbar_det.tabs('prod').show();
        version_esp = data.vers;
        cod_esp = form_cod; 
        cargarversiones(data.cod);    
        cargarespecProd(data.cod,data.vers,form_vig);
     });
};

cargarprodespecgrupo = (nombre,grupo) => { 
    ind_grupo = 'P';
    nom_report = nom_report;
    mainLayout_group = tabbar.cells(nombre).attachLayout('1C');    
    myGrid_group = mainLayout_group.cells('a').attachGrid();
    mainLayout_group.cells('a').hideHeader();
    mytoolbar = mainLayout_group.cells('a').attachToolbar();  
    mytoolbar.setIconsPath('/assets/images/icons/');
    mytoolbar.addButton('nuevo',null,'Nuevo',"ic-add3.png","ic-add3.png");
    mytoolbar.addButton('historial',null,'Historial de cambios',"ic-historial.png","");
    mytoolbar.addButton('print',null,'Imprimir',"print.png","");
    mytoolbar.attachEvent ( "onClick" , onClickaction); 
    mytoolbar.setIconSize(32);    
    myGrid_group.setHeader('Cod.Producto,Descripción,Inci,Cod.Cas,Vigencia');
    myGrid_group.setInitWidths('150,500,600,100,100');
    myGrid_group.setColAlign('left,left,left,left,left');
    myGrid_group.setColTypes('ro,ro,ro,ro,ro'); 
    myGrid_group.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,#text_filter");     
    myGrid_group.setColumnIds('cod,desc,inci,cas,vig');  
    myGrid_group.init();      
    myGrid_group.clearAll(); 
    mainLayout_group.cells('a').progressOn();
    mainLayout.cells('b').collapse();
    myGrid_group.load( BASE_URL + 'PO010410/mostrar-prod-espec-por-grupo/'+usrJson.empresa+'/'+grupo).then(function (text) {
        mainLayout_group.cells('a').progressOff();
        num_fila = myGrid_group.getRowsNum();
        let iRowId;
        for(let i=0;i<num_fila;i++){
            iRowId = myGrid_group.getRowId(i);
            data = myGrid_group.getRowData(iRowId);
            if(data.vig=='Vigente'){
                myGrid_group.setRowColor(iRowId,"#90EE90");
            }else{
                    myGrid_group.setRowColor(iRowId,"red");
            }
        }
    });
    myGrid_group.attachEvent("onRowSelect", function (id, ind) {            
        mainLayout.cells('b').expand();
        mainLayout_det.cells('a').expand();
        mainLayout_det.cells('b').collapse();
        mainLayout_det.cells('a').setWidth(650);  
        data = myGrid_group.getRowData(myGrid_group.getSelectedRowId())     
        mainLayout_det.cells('a').setText('Descripción: '+data.desc+' ('+data.cod+')');   
        cargarespecversProducto(data.cod,grupo);
        iniciotabs();
        // cargarespecProd(data.cod,data.vers,form_vig);
     });
};

cargarCaract = (espec,version,estado) => {  
    console.log(espec,version,estado);
    mainLayout_caract = tabbar_det.cells('crt').attachLayout('2U');  
    myFormdcaract = mainLayout_caract.cells('a').attachForm(form_caract);
    myFormdcaract.setFontSize("12px");
    mainLayout_caract.cells('b').collapse();
    // mainLayout_caract.cells('a').setHeight(600);
    mainLayout_caract.cells('a').setText('Carac. Generales');  
    mainLayout_caract.cells('b').setText('Detalle');
    if (estado == 'Por Aprobar'){
        cartoolbar = mainLayout_caract.cells('a').attachToolbar(); 
        cartoolbar.setIconsPath('/assets/images/icons/');
        cartoolbar.addButton('aceptar',null,'Aceptar',"ic-acept.png","");
        cartoolbar.attachEvent('onClick', toolbarOnCaract);
        cartoolbar.setIconSize(18);
        car_dettoolbar = mainLayout_caract.cells('b').attachToolbar(); 
        car_dettoolbar.setIconsPath('/assets/images/icons/');
        car_dettoolbar.addButton('vercaract',null,'Agregar Características',"ic-add.png","");
        car_dettoolbar.addButton('eliminar',null,'Eliminar',"ic-delete.png","");
        car_dettoolbar.addButton('aceptar',null,'Aceptar',"ic-acept.png","");
        car_dettoolbar.attachEvent('onClick', toolbarOnCaract);
        car_dettoolbar.setIconSize(18);
    }
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
    myGrid_caract.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    myGrid_caract.setHeader(',,Característica,Detalle');    
    if (estado == 'Por Aprobar'){
        myGrid_caract.setInitWidths('50,0,200,600');
    }else{
        myGrid_caract.setInitWidths('0,0,200,600');
    }
    myGrid_caract.setColAlign('left,left,left,left');
    myGrid_caract.setColTypes('ch,ro,ro,ed'); 
    myGrid_caract.setColumnIds('chec,id,desc,det'); 
    myGrid_caract.init();      
    //CARGANDO SEGUNDA PARTE DE CARACTERISTICAS
    myGrid_caract.clearAll(); 
    mainLayout_caract.cells('b').progressOn();
    myGrid_caract.load( BASE_URL + 'PO010410/mostrar-caract-detalle/'+usrJson.empresa+'/'+espec+'/'+version).then(function (text) {
        mainLayout_caract.cells('b').progressOff();
    });
};

toolbarOnCaract = async (id) => {
    if (grupo_prod==5||grupo_prod==1){
        sel  = myGrid_espvers.getRowData(myGrid_espvers.getSelectedRowId());
    }else{
        sel  = myGrid_group.getRowData(myGrid_group.getSelectedRowId());}
    switch (id) {
        case 'vercaract':
            vercaracteristicas();
            break;     
        case 'eliminar':
            var to_fila_data_num_gri = myGrid_caract.getRowsNum();
            console.log(to_fila_data_num_gri);
            for(var i=1;i<to_fila_data_num_gri;i++){
                console.log('data');
                let iRowId_gri = myGrid_caract.getRowId(i);
                console.log(iRowId_gri);
                data = myGrid_caract.getRowData(iRowId_gri);
                if (data.chec == 1) {
                    myGrid_caract.deleteRow(iRowId_gri);
                    i = i - 1;
                    to_fila_data_num_gri = to_fila_data_num_gri - 1;
                }
            }
        break;  
        case 'aceptar':            
            let  cant_filas_guardar = 0;
            cant_filas_guardar = myGrid_caract.getRowsNum();
            let cadenacod = '',cadenadet='',data_grabar,caract_gen,cond_alm;            
            caract_gen = myFormdcaract.getItemValue('_ep_car_gen');
            cond_alm = myFormdcaract.getItemValue('_ep_car_alm');
            console.log(cant_filas_guardar);
            for (let i = 1; i < cant_filas_guardar; i++) {
                iRowId = myGrid_caract.getRowId(i);
                console.log(i);
                console.log(iRowId);
                data_grabar = myGrid_caract.getRowData(iRowId);
                cadenacod += data_grabar.id +'@';
                cadenadet += data_grabar.det +'@';
            }
            console.log(cadenacod,cadenadet,cant_filas_guardar);
            guardarcaract(sel.cod,version_esp,cadenacod,cadenadet,cant_filas_guardar-1,caract_gen,cond_alm);
           
            break;     
        default:
            null;
            break;
    }
};

toolbarOnensayo = async (id) => {
    if(grupo_prod==5){
        sel  = myGrid_espvers.getRowData(myGrid_espvers.getSelectedRowId());        
    }else{
        sel  = myGrid_group.getRowData(myGrid_group.getSelectedRowId());
    }
    switch (id) {
        case 'cargaren':
            verensayo();
            break;
        case 'eliminar':
            let to_fila_data_num_gri = myGrid_ensa.getRowsNum();
            for(var i=0;i<to_fila_data_num_gri;i++){
                console.log('data');
                let iRowId_gri = myGrid_ensa.getRowId(i);
                console.log(iRowId_gri);
                data = myGrid_ensa.getRowData(iRowId_gri);
                if (data.chec == 1) {
                    myGrid_ensa.deleteRow(iRowId_gri);
                    i = i - 1;
                    to_fila_data_num_gri = to_fila_data_num_gri - 1;
                }
            }
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
                console.log(cant_filas_guardar);
                    for (let i = 0; i < cant_filas_guardar; i++) {
                        let iRowId = myGrid_ensa.getRowId(i);
                        data_grabar = myGrid_ensa.getRowData(iRowId);
                        cadenaensayo += data_grabar.codens +'@';
                        cadenametodo += data_grabar.codmet +'@';
                        cadenaespec += data_grabar.esp +'@';
                        limmax += data_grabar.max +'@';
                        limmin += data_grabar.min +'@';
                }
                console.log(sel.cod,sel.vers,cadenaensayo,cadenametodo,cadenaespec,limmin,limmax,cant_filas_guardar);
                guardarensayo(sel.cod,version_esp,cadenaensayo,cadenametodo,cadenaespec,limmin,limmax,cant_filas_guardar);
            }
            break;     
        default:
            null;
            break;
    }
};

cargarEnsayo = (espec,version,estado) => {  
    mainLayout_ensa = tabbar_det.cells('esy').attachLayout('1C');  
    mainLayout_ensa.cells('a').hideHeader();      
    if (estado == 'Por Aprobar'){
    enstoolbar = mainLayout_ensa.cells('a').attachToolbar(); 
    enstoolbar.setIconsPath('/assets/images/icons/');
    enstoolbar.addButton('cargaren',null,'Agregar Ensayo',"ic-add.png","");
    enstoolbar.addButton('eliminar',null,'Eliminar',"ic-delete.png","");
    enstoolbar.addButton('aceptar',null,'Aceptar',"ic-acept.png","");
    enstoolbar.attachEvent('onClick', toolbarOnensayo);
    enstoolbar.setIconSize(18);
     }
    myGrid_ensa = mainLayout_ensa.cells('a').attachGrid();
    myGrid_ensa.setHeader(',Cod.met,Co.Método,Método,Co.Ensayo,Condiciones,Especificaciones,Especificaciones(Inglés),Rango/De,Rangos/A,Tipo de Ensayo,Objetivos de la Prueba');    
    myGrid_ensa.setInitWidths('30,0,70,400,80,200,400,400,70,70,150,300');
    myGrid_ensa.setColAlign('left,center,left,left,left,left,left,left,left,left,left.left');
    myGrid_ensa.setColTypes('ch,ro,ro,ro,ro,ro,ed,ed,ed,ed,ro,ro'); 
    myGrid_ensa.setColumnIds('chec,codmet,comet,met,codens,ens,esp,espin,min,max,tipens,objp'); 
    myGrid_ensa.setColumnHidden(0,true);
    myGrid_ensa.init();      
    myGrid_ensa.clearAll(); 
    mainLayout_ensa.cells('a').progressOn();
    myGrid_ensa.load( BASE_URL + 'PO010410/mostrar-ensayo/'+usrJson.empresa+'/'+espec+'/'+version).then(function (text) {
        mainLayout_ensa.cells('a').progressOff();
    });  
    if (estado == 'Por Aprobar'){
        myGrid_ensa.setColumnHidden(0,false);
    }
    myGrid_ensa.attachEvent("onEnter", (id) => {
        data = myGrid_ensa.getRowData(myGrid_ensa.getSelectedRowId())
        cuali = data.esp;
        cuantiuno = data.min;
        cuantidos = data.max;
        if (cuali.length>0&&(cuantiuno.length>0||cuantidos.length>0)){
            dhtmlx.confirm("El ensayo solo puede ser cuantitativa o cualitativa", function (result) {
                var new_data = {"esp":""};
                var new_data_ingles = {"espin":""};
                myGrid_ensa.setRowData(id,new_data);
                myGrid_ensa.setRowData(id,new_data_ingles);
        });
    }
    });
};

cargarCompto = (espec,version,estado) => {  
    mainLayout_cpto = tabbar_det.cells('cpto').attachLayout('1C');  
    mainLayout_cpto.cells('a').hideHeader();      
    if (estado == 'Por Aprobar'){
    comptoolbar = mainLayout_cpto.cells('a').attachToolbar(); 
    comptoolbar.setIconsPath('/assets/images/icons/');
    comptoolbar.addButton('cargarcmp',null,'Agregar Complemento',"ic-add.png","");
    comptoolbar.addButton('aceptar',null,'Aceptar',"ic-acept.png","");
    comptoolbar.attachEvent('onClick', toolbarOncmpt);
    comptoolbar.setIconSize(18);
    }
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

cargarHistorial = (espec,version,estado) => {  
    mainLayout_hist = tabbar_det.cells('hst').attachLayout('1C');  
    mainLayout_hist.cells('a').hideHeader();  
    if (estado == 'Por Aprobar'){
    histoolbar = mainLayout_hist.cells('a').attachToolbar(); 
    histoolbar.setIconsPath('/assets/images/icons/');
    histoolbar.addButton('cargarcmp',null,'Agregar',"ic-add.png","");
    histoolbar.attachEvent('onClick', toolbarOnhist);
    histoolbar.setIconSize(18);
    }
    myGrid_hist = mainLayout_hist.cells('a').attachGrid();
    myGrid_hist.setHeader('N°Doc,Versión,Fecha,Descripción de los cambios,Usuario,Tipo Doc.');    
    myGrid_hist.setInitWidths('80,80,100,500,300,100');
    myGrid_hist.setColAlign('left,left,left,left,left,left');
    myGrid_hist.setColTypes('ro,ro,ro,ro,ro,ro'); 
    myGrid_hist.init();      
    myGrid_hist.clearAll(); 
    mainLayout_hist.cells('a').progressOn();
    myGrid_hist.load( BASE_URL + 'PO010410/mostrar-historial/'+usrJson.empresa+'/'+espec+'/'+version).then(function (text) {
        mainLayout_hist.cells('a').progressOff();
    }); 
};

cargarDocumento = (espec,version) => {  
    mainLayout_dcto = tabbar_det.cells('arc').attachLayout('1C');  
    mainLayout_dcto.cells('a').hideHeader(); 
    dctotoolbar = mainLayout_dcto.cells('a').attachToolbar(); 
    dctotoolbar.setIconsPath('/assets/images/icons/');
    dctotoolbar.addButton('verdcto',null,'Ver Archivo',"ic-look.png","");
    dctotoolbar.addButton('subirdt',null,'Subir Archivo',"ic-upload.png","");
    dctotoolbar.addButton('refresh',null,'Actualizar',"ic-refresh.png","");
    dctotoolbar.attachEvent('onClick', toolbarOnadj);
    dctotoolbar.setIconSize(18); 
    myGrid_dcto = mainLayout_dcto.cells('a').attachGrid();
    myGrid_dcto.setHeader(',Nombre,Descripción,');    
    myGrid_dcto.setInitWidths('0,300,600,0');
    myGrid_dcto.setColAlign('left,left,left,left');
    myGrid_dcto.setColTypes('ro,ro,ro,ro'); 
    myGrid_dcto.setColumnIds('prod,nom,desc,ind'); 
    myGrid_dcto.init();      
    myGrid_dcto.clearAll(); 
    mainLayout_dcto.cells('a').progressOn();
    myGrid_dcto.load( BASE_URL + 'PO010410/mostrar-documento/'+usrJson.empresa+'/'+espec+'/'+version).then(function (text) {
        mainLayout_dcto.cells('a').progressOff();
    });
};

cargarDocumentodt = () => {  
    mainLayout_dctodt = tabbar_det.cells('arcdt').attachLayout('1C');  
    mainLayout_dctodt.cells('a').hideHeader(); 
    dctotoolbar = mainLayout_dctodt.cells('a').attachToolbar(); 
    dctotoolbar.setIconsPath('/assets/images/icons/');
    dctotoolbar.addButton('verdctodt',null,'Ver',"ic-look.png","");
    dctotoolbar.attachEvent('onClick', toolbarOnadj);
    dctotoolbar.setIconSize(18); 
    myGrid_dctodt = mainLayout_dctodt.cells('a').attachGrid();
    myGrid_dctodt.setHeader(',Nombre,Descripción');    
    myGrid_dctodt.setInitWidths('0,300,600');
    myGrid_dctodt.setColAlign('left,left,left');
    myGrid_dctodt.setColTypes('ro,ro,ro'); 
    myGrid_dctodt.setColumnIds('prod,nom,desc'); 
    myGrid_dctodt.init();      
};
cargarProducto = (espec,version) => {  
    mainLayout_prod = tabbar_det.cells('prod').attachLayout('1C');  
    mainLayout_prod.cells('a').hideHeader();  
    prodtoolbar = mainLayout_prod.cells('a').attachToolbar(); 
    prodtoolbar.setIconsPath('/assets/images/icons/');
    prodtoolbar.addButton('verspro',null,'Ver SubProductos',"ic-look.png","");
    prodtoolbar.attachEvent('onClick', toolbarOnProducto);
    prodtoolbar.setIconSize(18);
    myGrid_prod = mainLayout_prod.cells('a').attachGrid();
    myGrid_prod.setHeader('Código,Producto/Material');    
    myGrid_prod.setInitWidths('300,600');
    myGrid_prod.setColAlign('left,left');
    myGrid_prod.setColumnIds('cod,desc');
    myGrid_prod.setColTypes('ro,ro'); 
    myGrid_prod.init();      
    myGrid_prod.clearAll(); 
    mainLayout_prod.cells('a').progressOn();
    myGrid_prod.load( BASE_URL + 'PO010410/mostrar-productos/'+usrJson.empresa+'/'+espec+'/'+version).then(function (text) {
        mainLayout_prod.cells('a').progressOff();
    });

};

cargarespecProd = (espec,version,estado) => {  
    mainLayout_esprod = tabbar_det.cells('presp').attachLayout('1C');  
    mainLayout_esprod.cells('a').hideHeader();  
    myGrid_esprod = mainLayout_esprod.cells('a').attachGrid();
    prodtoolbar = mainLayout_esprod.cells('a').attachToolbar(); 
    prodtoolbar.setIconsPath('/assets/images/icons/');
    prodtoolbar.addButton('verspro',null,'Ver SubProductos',"ic-look.png","");
    prodtoolbar.attachEvent('onClick', toolbarOnProducto);
    prodtoolbar.setIconSize(18);
    myGrid_esprod.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    myGrid_esprod.setHeader(',Código,Descripción,Marca,Submarca');    
    myGrid_esprod.setInitWidths('50,100,700,200,200');
    myGrid_esprod.setColumnHidden(0,true);
    myGrid_esprod.setColAlign('left,left,left,left,left');
    myGrid_esprod.setColTypes('ch,ro,ro,ro,ro'); 
    myGrid_esprod.setColumnIds('chec,cod,desc,marc,subm');   
    myGrid_esprod.init();      
    cargarprodporesp(espec,version);
    if (estado=='Por Aprobar'){
        myGrid_esprod.setColumnHidden(0,false);
        prodtoolbar.addButton('verprod',null,'Agregar Productos',"ic-add.png","");
        prodtoolbar.addButton('eliminar',null,'Eliminar',"ic-delete.png","");
        prodtoolbar.addButton('guardar',null,'Aceptar',"ic-acept.png","");
    }
};

verproducto = async (grupo_prod) => {
    nva_clase = grupo_prod;
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
    myToolbar.attachEvent("onEnter", (id,clase_grupo) => {        
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
    // myGridbuscar.load( BASE_URL + 'PO010410/mostrar-producto-por-grupo/'+grupo_prod+'/'+tipo_bien+'/'+clase_grupo+'/'+buscar).then(function (text) {
    myGridbuscar.load( BASE_URL + 'PO010410/mostrar-producto-por-grupo/'+nva_clase+'/'+buscar).then(function (text) {
        Wind_.window('wbuscar').progressOff();
        cant_filas_l = myGridbuscar.getRowsNum();
    });  
};

onClickaction = async (id) => {     
    console.log('k1: '+nom_report);
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
        case 'print':
            if(grupo_prod==5){
                sel  = myGrid_espvers.getRowData(myGrid_espvers.getSelectedRowId());
                sel2  = myGrid_group.getRowData(myGrid_group.getSelectedRowId());
                cargarReport(sel.cod,sel.vers,sel2.cod,1,1,nom_report,grupo_prod,sel.tipo,sel.arte);
            }else{
                sel  = myGrid_group.getRowData(myGrid_group.getSelectedRowId());
                sel2  = myGrid_esprod.getRowData(myGrid_esprod.getSelectedRowId());
                sel3  = myGrid_version.getRowData(myGrid_version.getSelectedRowId());
                sel.coesp = sel.coesp.length==0 ? 'No aplica' : sel.coesp;
                sel2.marc = sel2.marc.length==0 ? '-' : sel2.marc;
                sel2.subm = sel2.subm.length==0 ? '-' : sel2.subm;
                cargarReport(sel.cod,sel3.vers,sel2.cod,sel2.marc,sel2.subm,nom_report,grupo_prod);
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
            Wind_.window("wbuscar").close();
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
    if (grupo_prod == 4){
        const params = {
            espec : espec,
            grupo: 2,
        };
        console.log(params);
        $.post(BASE_URL + 'PO010410/mostrar-especificacion-pt/', params, function (res) {  
            if (res.state=='unsuccess'){      
                ind_pt = 'N';
                console.log('ass');
            } else {
                const valor = res.data.espec_pt;
                ind_pt = 'S';
                message_pt = valor.CO_ESPECIFICACION;
            }
        } , 'json');
    }
    if(ind_grupo=='E'){
        esptoolbar.showItem('info');
        esptoolbar.hideItem('espec');
    }
    mainLayout_det.cells('b').progressOn();
    myGrid_version= mainLayout_det.cells('a').attachGrid();
    myGrid_version.setSizes ("8px");
    myGrid_version.setHeader('Cod.Espec,Ver.,Estado,Proveedor,Cod.Proveedor,Tipo Espec.');
    myGrid_version.setInitWidths('100,80,100,400,0,400');
    myGrid_version.setColAlign('left,left,left,left,left');
    myGrid_version.setColumnIds('cod,vers,estado,proveedor,codprov,tipoesp');     
    myGrid_version.init();    
    myGrid_version.clearAll();
    myGrid_version.attachEvent("onRowSelect", function (id, ind) {  
        data = myGrid_version.getRowData(myGrid_version.getSelectedRowId());
        version_esp = data.vers;
        version_prov = data.codprov;
        st_vers = data.estado;
        cod_esp = form_cod; 
        console.log(version_esp,cod_esp);
        iniciotabs();
        mainLayout_det.cells('b').expand();
        mainLayout_det.cells('a').setHeight(200);
        cargarespecProd(form_cod,version_esp,st_vers);
     });  
    myGrid_version.clearAll(); 
    myGrid_version.load( BASE_URL + 'PO010410/mostrar-version/'+usrJson.empresa+'/'+espec).then(function (text) {
        mainLayout_det.cells('b').progressOff();
        num_fila_vers = myGrid_version.getRowsNum();
        let iRowId;
        for(let i=0;i<num_fila_vers;i++){
            iRowId = myGrid_version.getRowId(i);
            data = myGrid_version.getRowData(iRowId);
            if(data.estado=='Vigente'){
                myGrid_version.setRowColor(iRowId,"#90EE90");
            }else{
                if(data.estado=='Por Aprobar'||data.estado=='Revisada'){
                    myGrid_version.setRowColor(iRowId,"#F7D358");
                }else{
                    myGrid_version.setRowColor(iRowId,"red");
                }
            }
        }
    });
};

cargarespecversProducto = (prod,grupo) => {   
    esptoolbar.showItem('espec');
    esptoolbar.hideItem('info');
    mainLayout_det.cells('a').progressOn();
    myGrid_espvers= mainLayout_det.cells('a').attachGrid();
    myGrid_espvers.clearAll(); 
    myGrid_espvers.setSizes ("8px");
    myGrid_espvers.setHeader('Cod.Espec,Nombre,Ver.,Estado,F.Creación,Creado por,F.Revisado,Revisado por,F.Aprobado,Aprobado por,Proveedor,Cod.Proveedor,Tipo Material,Arte,Inci,Cod.Cas,Fabricante,Origen');
    myGrid_espvers.setInitWidths('100,200,80,80,80,200,80,200,80,200,200,0,200,100,200,100,200,100');
    myGrid_espvers.setColAlign('left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left');
    myGrid_espvers.setColumnIds('cod,nom,vers,estado,cc,cp,rr,rp,ff,fp,proveedor,codprov,tipo,arte');
    myGrid_espvers.init();  
    myGrid_espvers.clearAll(); 
    myGrid_espvers.attachEvent("onRowSelect", function (id, ind) {  
        data = myGrid_espvers.getRowData(myGrid_espvers.getSelectedRowId());  
        win_desc = data.nom+" "+data.cod+" Vers."+data.vers;
        version_esp = data.vers;
        version_prov = data.codprov;
        st_vers = data.estado;
        cod_esp = data.cod; 
        iniciotabs();
        mainLayout_det.cells('b').expand();
        mainLayout_det.cells('a').setHeight(220);
        cargarCaract(cod_esp,version_esp,st_vers); 
        form_cod = data.cod;
        form_vers = data.vers;
        form_vig = data.estado;
        form_codprov = data.codprov;
        form_prov = data.proveedor;
        form_desc = data.nom;
        form_fcrea = data.cc;
        form_crea = data.cp;
        form_frev = data.rr;
        form_rev = data.rp;
        form_fapr = data.ff;
        form_aprob = data.fp;     
        form_coesp = data.cod;    
     }); 
    myGrid_espvers.load( BASE_URL + 'PO010410/mostrar-espec-por-producto/'+usrJson.empresa+'/'+prod+'/'+grupo).then(function (text) {
        mainLayout_det.cells('a').progressOff();
        num_fila_vers = myGrid_espvers.getRowsNum();
        let iRowId;
        for(let i=0;i<num_fila_vers;i++){
            iRowId = myGrid_espvers.getRowId(i);
            data = myGrid_espvers.getRowData(iRowId);
            if(data.estado=='Vigente'){
                myGrid_espvers.setRowColor(iRowId,"#90EE90");
            }else{
                if(data.estado=='Por Aprobar'||data.estado=='Revisada'){
                    myGrid_espvers.setRowColor(iRowId,"#F7D358");
                }else{
                    myGrid_espvers.setRowColor(iRowId,"red");
                }
            }
        }
    });
};

copiarespecificacion = (accion,espec_orig,grupo_prod,version_orig,co_espec_nue,proveedor,desc,tipo_vers,catalogo_prod) => {   
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
        alias: usrJson.alias,
        tipo_version: tipo_vers,
        catalogo_prod: catalogo_prod
    };    
    console.log(params);
    $.post(BASE_URL + "PO010410/copiar-especificacion", params, function (res) {
        console.log(res);
        if (res.state=='success'){
            Swal.fire('Bien!', res.message, 'success');
            if(grupo_prod==1||grupo_prod==5){
                cargarprodespecgrupo(de_grupo,grupo_prod);
            }else{
                cargarespecific(de_grupo,grupo_prod);
            }
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
            myGrid_esprod.clearAll(); 
            cargarespecProd(especificacion,version,'Por Aprobar');
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
            myGrid_caract.clearAll(); 
            cargarCaract(especificacion,version,'Por Aprobar'); 
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
            myGrid_ensa.clearAll(); 
            cargarEnsayo(especificacion,version,'Por Aprobar'); 
        } else {
            Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se guardo el registro :' + res.message });
        }
    }, "json");
};


guardarhistorial = (especificacion,version,observacion) => {   
    console.log(especificacion,version,observacion); 
    params = {
        empresa: usrJson.empresa,
        usuario: usrJson.codigo,
        especificacion: especificacion,
        version:version,
        observacion: observacion
    };    
    $.post(BASE_URL + "PO010410/guardar-historial", params, function (res) {
        console.log(res);
        if (res.state=='success'){
            Swal.fire('Bien!', res.message, 'success');
            cargarHistorial(especificacion,version,'Por Aprobar'); 
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

buscarprov = async (varprov) => {
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
        if (varprov=='nvo' ){
            myFormdatos_input.setItemValue('ep_provcod',cod);
            myFormdatos_input.setItemValue('ep_proveedor',prov);
        }else{
            myFormespecf.setItemValue('ep_provcod',cod);
            myFormespecf.setItemValue('ep_proveedor',prov);
        }
        Wind_.window("wbusq").close();
    });
};

buscarprod = async (varprov) => {
    nva_clase =grupo_prod;
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbusq", 0, 0, 750, 500);
    Wind_.window("wbusq").setModal(true);
    Wind_.window("wbusq").denyResize();
    Wind_.window("wbusq").center();
    Winid_.setText("Producto/Material");
    myToolbar = Wind_.window("wbusq").attachToolbar();
    myToolbar.addText(null, null, 'Producto: ');
    myToolbar.addInput('in_busq', null, '', 250);
    myToolbar.addSeparator(null, null);
    myToolbar.attachEvent("onEnter", (id) => {
        if (myToolbar.getValue('in_busq').length>0){            
            cargaresproducto(Wind_,myToolbar.getValue('in_busq').toUpperCase());
        }else{
            dhtmlx.confirm("El campo esta vacío", function (result) {});
        }
    });
    myGrid = Winid_.attachGrid();
    myGrid.setSizes ("8px");
    myGrid.setHeader(',Cod. Producto,Descripción');
    myGrid.setInitWidthsP('0,20,100');
    myGrid.setColTypes('ro,ro,ro');
    myGrid.setColumnIds(",cod_producto,prod_desc");
    myGrid.attachHeader(",#text_filter,#text_filter");
    myGrid.clearAll();
    myGrid.init();
    myGrid.attachEvent("onRowSelect", function (id, ind) {
        data = myGrid.getRowData(myGrid.getSelectedRowId())
        cod = data.cod_producto;
        prod = data.prod_desc;
        if (varprov=='nvo' ){
            myFormdatos_input.setItemValue('ep_prod',cod);
            myFormdatos_input.setItemValue('ep_producto',prod);
        }else{
            myFormespecf.setItemValue('ep_prod',cod);
            myFormespecf.setItemValue('ep_producto',prod);
        }
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

cargaresproducto = (win,buscar) => {  
    console.log(nva_clase);
    win.window("wbusq").progressOn();
    myGrid.clearAll();
    myGrid.load( BASE_URL + 'PO010410/mostrar-producto-por-grupo/'+nva_clase+'/'+buscar).then(function (text) {
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

guardarcabecera = (especificacion,version,proveedor,grupo,descripcion,serie,accion) => {   
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
                buscarprov('ext');
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
                guardarcabecera(11,1,proveedor,grupo_prod,descripcion,serie,nuev);
            }else{ 
                console.log('2');
                console.log(nuev);
                version = myFormespecf.getItemValue('ep_version');
                especificacion = myFormespecf.getItemValue('ep_codigo');
                guardarcabecera(especificacion,version,proveedor,grupo_prod,descripcion,serie,nuev);
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
    myGridensaysel.setInitWidths('50,80,200,80,200,80,200,200,200,80,80,80,80,80,80,80,80');
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
    Winid_ = Wind_.createWindow("wbuscar", 0, 0, 750, 320);
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
    mostrarnvaEspec(grupo_prod,'C');
    myFormdatos_input.hideItem('ep_tipo');
    if(grupo_prod==1||grupo_prod==5){
        myFormdatos_input.showItem('ep_prod');
        myFormdatos_input.showItem('ep_producto');
        myFormdatos_input.showItem('buscarprod');
    }else{
        myFormdatos_input.hideItem('ep_prod');
    }
    myFormdatos_input.attachEvent("onButtonClick", async (name) => {
        switch (name) {
            case 'buscarprov':
                buscarprov('nvo');
                break;
            case 'buscarprod':
                buscarprod('nvo');
                break;
            default:
                null;
                break;
        }
    });  
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

versioninput = async (cod,suma,codprov,prov,desc) => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbuscar", 0, 0, 750, 450);
    Winid_.setText("Nueva Versión - "+win_desc);
    Wind_.window("wbuscar").setModal(true);
    Wind_.window("wbuscar").denyResize();
    Wind_.window("wbuscar").center(); 
    myToolbar = Wind_.window("wbuscar").attachToolbar();
    myToolbar.setIconsPath('/assets/images/icons/');
    myToolbar.addButton('b_guardar', null, 'Guardar', "ic-acept.png", null);
    myToolbar.addSeparator(null, null);
    myToolbar.attachEvent('onClick',toolbarOninputvers);
    myFormdatos_inputvers = Wind_.window("wbuscar").attachForm(f_copiaespec); 
    myFormdatos_inputvers.setItemValue('ep_provcod',codprov);
    myFormdatos_inputvers.setItemValue('ep_proveedor',prov);
    myFormdatos_inputvers.setItemValue('_ep_num',cod);
    myFormdatos_inputvers.setItemValue('_ep_ver',suma);
    myFormdatos_inputvers.setItemValue('_et_desc',desc);
    myFormdatos_inputvers.showItem('_et_mot');
    if(grupo_prod==4){
        myFormdatos_inputvers.showItem('ep_tipo');
    }else{
        myFormdatos_inputvers.hideItem('ep_tipo');
    }
    cargarespecopia(grupo_prod,'S');  
    myFormdatos_inputvers.attachEvent("onChange", function (){
        myFormdatos_inputvers.isItemChecked('ep_tipo') ? mostrarnvaEspec(2,'V') : myFormdatos_inputvers.setItemValue('_ep_num',cod),myFormdatos_inputvers.setItemValue('_ep_ver',suma);
        
    });  
    myFormdatos_inputvers.attachEvent("onButtonClick", async (name) => {
        switch (name) {
            case 'buscarprov':
                buscarprov('nvovers');
                break;
            case 'buscarprod':
                // buscarprod();
                break;
            default:
                null;
                break;
        }
    });  
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
                    myGrid_caract.addRow(myGrid_caract.uid(),[0,data.cod,data.car,''],1);
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
            Wind_.window("wbuscar").close();
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
                    myGrid_ensa.addRow(myGrid_ensa.uid(),[0,data.codmet,data.comet,data.met,data.codens,data.ens,,,,,data.tipens,data.obj],1);
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
            Wind_.window("wbuscar").close();
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
            form_prov = myFormdatos_input.getItemValue('ep_provcod');
            cat_prod = myFormdatos_input.getItemValue('ep_prod');
            tipo_vers = 'N';  
            //(accion,espec_orig,grupo_prod,version_orig,co_espec_nue,proveedor,desc) 
                if (grupo_prod==1||grupo_prod==5){
                    console.log(sel);
                    if (desc.length>0&&form_prov.length>0&&cat_prod.length>0){
                        copiarespecificacion('ce',sel.cod,grupo_prod,sel.vers,'11',form_prov,desc,tipo_vers,cat_prod);
                    }else{
                        dhtmlx.confirm("Debe llenar todos los campos", function (result) { });
                    }
                }else{
                    if (desc.length>0&&form_prov.length>0){
                        copiarespecificacion('ce',sel.cod,grupo_prod,sel.vers,'11',form_prov,desc,tipo_vers,cat_prod);
                    }else{
                        dhtmlx.confirm("Debe llenar todos los campos", function (result) { });
                    }
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
            tipo_vers = myFormdatos_inputvers.isItemChecked('ep_tipo')?'I':'N';  
            // sel2 = myGrid_version.getRowData(myGrid_version.getSelectedRowId());
            // console.log(sel.cod,grupo_prod,sel2.vers,cod,sel2.codprov,desc);
            if (ind_pt=='S'&&tipo_vers=='I'){
                dhtmlx.confirm("Especificación vinculada con: "+message_pt, function (result) {
                });
            }else{
            if (desc.length>0){
                if (ind_grupo=='P'){                    
                    copiarespecificacion('cv',sel_grid.cod,grupo_prod,sel_grid.vers,sel_grid.cod,sel_grid.codprov,desc,tipo_vers,12);
                    console.log('cv',sel_grid.cod,grupo_prod,sel_grid.vers,sel_grid.cod,sel_grid.codprov,desc,tipo_vers);
                }else{
                    copiarespecificacion('cv',sel.cod,grupo_prod,sel.vers,sel.cod,sel.codprov,desc,tipo_vers,12);
                }
                
            }else{
                dhtmlx.confirm("Campo vacío", function (result) {
                });
            }}
            break;  
        default:
            null;
            break;
    }
};

toolbarOnhist  = async (id) => {
    sel  = myGrid_group.getRowData(myGrid_group.getSelectedRowId());
    switch (id) {
        case 'cargarcmp':
            agregarhistoria();
            break;     
        case 'b_guardar':
            console.log('a');
            var obsv = myFormdatos_cosm.getItemValue('_et_historial');
            guardarhistorial(sel.cod,version_esp,obsv);
            break;  
        default:
            null;
            break;
    }
};

toolbarOnadj  = async (id) => {
    switch (id) {
        case 'verdcto':
            sel_adj  = myGrid_dcto.getRowData(myGrid_dcto.getSelectedRowId());
            verurladjunto(sel_adj.prod,sel_adj.nom,sel_adj.ind);
            break;   
        case 'verdctodt':
            sel  = myGrid_group.getRowData(myGrid_group.getSelectedRowId());
            sel2 = myGrid_version.getRowData(myGrid_version.getSelectedRowId());
            cargardt1(sel.cod,sel2.vers,sel.desc);
            break;   
        case 'subirdt':
            if(grupo_prod==1||grupo_prod==5){
                sel  = myGrid_group.getRowData(myGrid_group.getSelectedRowId());
                sel2 = myGrid_espvers.getRowData(myGrid_espvers.getSelectedRowId());
                subiradjunto(sel2.cod,sel2.vers,sel.cod);
            }else{
                sel  = myGrid_group.getRowData(myGrid_group.getSelectedRowId());
                sel2 = myGrid_version.getRowData(myGrid_version.getSelectedRowId());
                const params = {
                    espec: sel.cod,
                    version:sel2.vers,
                };
                $.post(BASE_URL + 'PO010410/mostrar-producto-por-espec-adj/', params, function (res) {                    
                    const valor = res.data.espec_pt;
                    producto = valor.CO_CATALOGO_PRODUCTO;
                    if(res.state=='unsuccess'||producto=='N'){
                        dhtmlx.confirm("La especificación no tiene producto vinculado", function (result) {});                     
                    }else{
                        subiradjunto(sel.cod,sel2.vers,producto);
                    };
                } , 'json');  
            }
            break; 
        case 'refresh':
            cargarDocumento(cod_esp,version_esp,st_vers);               
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

verurladjunto = async (prod,archivo,indicador) => {
    WinContainer = new dhtmlXWindows();
    WinDocumentoViewer = WinContainer.createWindow('WinDocumentoViewer', 320, 0, 800, 600);
    WinDocumentoViewer.setModal(true);
    WinDocumentoViewer.center();    
    WinDocumentoViewer.keepInViewport();
    WinDocumentoViewer.setText('Mostrando documento ');
    const params = {
        usuario: usrJson.codigo,
        producto:prod,
        archivo: archivo,
        indicador:indicador
    };
    $.post(BASE_URL + 'PO010410/mostrar-adjunto-espec/', params, function (res) {
        const url = res.data.url_adj; 
        console.log(url.URL);
        WinDocumentoViewer.attachURL(url.URL);
    } , 'json');  
    
};

subiradjunto = async (espec,vers,prod) => {
    WinContainer = new dhtmlXWindows();
    WinDocumentoViewer = WinContainer.createWindow('WinDocumentoViewer', 320, 0, 680, 280);
    WinDocumentoViewer.keepInViewport();
    WinDocumentoViewer.setText('Mostrando documento ');
    const params = {
        prod: prod,
        usuario: usrJson.codigo,
        cad_esp:espec+'_'+vers,
    };
    $.post(BASE_URL + 'PO010410/mostrar-subir-adjunto/', params, function (res) {
        const url = res.data.url_adj; 
        console.log(url.URL);
        WinDocumentoViewer.attachURL(url.URL);
    } , 'json');  
    
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

cargarReport = async (esp,vers,cod,marc,sub,nom_report,grupo_prod,tipo,arte) => {
    WinContainer = new dhtmlXWindows();
    WinDocumentoViewer = WinContainer.createWindow('WinDocumentoViewer', 320, 0, 800, 600);
    WinDocumentoViewer.setModal(true);
    WinDocumentoViewer.center();    
    WinDocumentoViewer.keepInViewport();
    WinDocumentoViewer.setText('Mostrando documento ');
    if (grupo_prod==1||grupo_prod==5){
        WinDocumentoViewer.attachURL('/api/po010410/mostrar-reporte2/'+esp+'/'+vers+'/'+cod+'/'+marc+'/'+sub+'/'+nom_report+'/'+tipo+'/'+arte);
    }else{
        WinDocumentoViewer.attachURL('/api/po010410/mostrar-reporte/'+esp+'/'+vers+'/'+cod+'/'+marc+'/'+sub+'/'+nom_report);
    }
};

cargardt1 = async (esp,vers,nom) => {
    console.log(esp,vers,nom);
    WinContainer = new dhtmlXWindows();
    WinDocumentoViewer = WinContainer.createWindow('WinDocumentoViewer', 320, 0, 800, 800);
    WinDocumentoViewer.keepInViewport();
    WinDocumentoViewer.setText('Mostrando documento ');
    WinDocumentoViewer.attachURL('/api/po010410/mostrar-reporte-dt1/'+nom+'/'+esp+'/'+vers);
};

descontinuar = (espec,version,proveedor,) => {
    params = {
        empresa: usrJson.empresa,
        usuario: usrJson.codigo,
        especificacion: espec,
        proveedor: proveedor,
        version: version,
        vigencia: 'Descontinuada'
    };    
    dhtmlx.confirm("¿Está seguro?", function (result) {
        if (result === Boolean(true)) {
            $.post(BASE_URL + "PO010411/aprobar-especificacion", params, function (res) {
                console.log(res);
                if (res.state=='success'){
                    Swal.fire('Hecho!', res.message, 'success');
                } else {
                    Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'Comunicarse con Sistemas'});
                }
            }, "json");
        }
    });
}

mostrarnvaEspec = async (grupo,tipo) => {
    const params = {
        grupo:grupo,
    };
    $.post(BASE_URL + 'PO010410/mostrar-nueva-espec/', params, function (res) {
        const co_espec = res.data.co_espec_nvo; 
        console.log(co_espec.CO_ESPECIFICACION);
        if (tipo=='V'){
            myFormdatos_inputvers.setItemValue('_ep_num',co_espec.CO_ESPECIFICACION);  
            myFormdatos_inputvers.setItemValue('_ep_ver',1);  
        }else{
            myFormdatos_input.setItemValue('_ep_num',co_espec.CO_ESPECIFICACION);
            myFormdatos_input.setItemValue('_ep_ver',1);   
        }
    } , 'json');  
    
};

cargarsubproductos = async (cod,desc) => {
    Windt_ = new dhtmlXWindows();
    Winidt_ = Windt_.createWindow("wtraz", 0, 0, 800, 500);
    Winidt_.setText("SubProductos asociados: ("+cod+") "+desc);
    Windt_.window("wtraz").setModal(true);
    Windt_.window("wtraz").denyResize();
    Windt_.window("wtraz").center();
    myGrid_trazab = Winidt_.attachGrid();
    myGrid_trazab.setHeader(',Cod.Producto,Descripción,Tipo,');
    myGrid_trazab.setInitWidths('0,100,500,200,0');
    myGrid_trazab.setColumnHidden(0,true);
    myGrid_trazab.setColumnHidden(4,true);
    myGrid_trazab.setColAlign('left,left,left,left,left,left');
    myGrid_trazab.setColTypes('ro,ro,ro,ro,ro,ro');
    myGrid_trazab.init();     
    myGrid_trazab.clearAll(); 
    Windt_.window("wtraz").progressOn();
    myGrid_trazab.load( BASE_URL + 'PO010208/mostrar-detalle-form-trazab/'+usrJson.empresa+'/'+cod).then(function (text) {
        Windt_.window('wtraz').progressOff();
    });  
};