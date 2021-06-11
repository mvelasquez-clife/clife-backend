var de_grupo,grupo_prod,ind_grupo,ind_pt,accion_ptr,message_pt,nom_report,nva_clase,varprov,version_prov,version_esp,cod_esp,win_desc,form_tipo,form_cod,form_vers,form_vig,form_codprov,form_prov,form_desc,form_fcrea,form_crea,form_frev,form_rev,form_fapr,form_aprob,form_coesp,serie,num_fila,data_n,data,cant_filas_n,cant_filas_l,de_grupo,clase_grupo,grupo_prod,tipo_bien,myGrid_version,myGrid_prod,mainLayout_prod,myGrid_hist,mainLayout_hist,myGrid_cpto,mainLayout_cpto,myGrid_ensa,mainLayout_ensa,myGrid_caract,myFormdcaract,mainLayout_caract,myFormdformu,mainLayout,tabbar,mainLayout_group,myGrid_group,tabbar_det
var st_vers,flag,permiso_cataedit = '';
var nuev = '';
ind_grupo ='E';
Inicio = () => { 
    const params = {
        empresa: usrJson.empresa,
        usuario : usrJson.codigo,
        accion: 'ELABORA'
    };
    $.post(BASE_URL + 'PO010410/habilitar-acceso/', params, function (res) { 
        const result = res.data.resul; 
        if (result.DE_DESCRIPCION=='NO'){
            dhtmlx.alert({
                type: 'alert-error',
                text: 'No tienes acceso. Comunicarse con Sistemas'
            });
        }else{
            mainLayout = new dhtmlXLayoutObject(document.body, '2U');
            mainLayout.cells('a').setText('Especificaciones');
            tabbar = mainLayout.cells('a').attachTabbar();   
            var array,nombre,id,num;
            var arrayDescrip = result.DE_DESCRIPCION.split("@");
            for(let i=0;i<arrayDescrip.length-1;i++){
                array = result.DE_DESCRIPCION.split("@")[i];
                nombre = array.split("||")[1];
                id = array.split("||")[0];
                tabbar.addTab(id, nombre, null, null, true);
                grupo_prod = array.split("||")[2];
                de_grupo = id;
                nom_report = array.split("||")[4];
                serie = array.split("||")[5]; 
            } 
            if (grupo_prod==5||grupo_prod==1){
                cargarprodespecgrupo(id,grupo_prod);
            }else{
                cargarespecific(id,grupo_prod,'N','N');
            };
            tabbar.attachEvent ( "onSelect" , inicioOnSelect); 
            mainLayout.cells('a').setWidth(740);
            mainLayout_det = mainLayout.cells('b').attachLayout('2E');
            mainLayout.cells('b').collapse();
            mainLayout.cells('b').setText('Detalle');
            mainLayout_det.cells('b').setText('Detalle');
            mainLayout_det.cells('a').setText('Versiones');
            esptoolbar = mainLayout_det.cells('a').attachToolbar(); 
            esptoolbar.setIconsPath('/assets/images/icons/');
            esptoolbar.addButton('verdet',null,'Editar',"ic-buskard.png","");
            esptoolbar.addButton('copiar',null,'Nueva Versión',"ic-add2.png","");
            esptoolbar.addButton('espec',null,'Copiar Especificación',"ic-copy.png","");
            esptoolbar.addButton('filtrar',null,'Mostrar todo',"no-filter.png","");  
            esptoolbar.addButton('info',null,'',"ic-info.png","");  
            esptoolbar.addButton('minimizar',null,'Ocultar',"ic-hide.png","");
            esptoolbar.addButton('maximizar',null,'Maximizar',"ic-expand.png","");
            esptoolbar.addButton('eliminar',null,'Eliminar Especificación',"ic-delete.png","ic-delete.png");
            esptoolbar.addButton('descontinuar',null,'Descontinuar',"ic-cancel.png","");
            esptoolbar.attachEvent('onClick', mainToolbarOnClick);
            esptoolbar.setIconSize(18);
            esptoolbar.disableItem('eliminar');
            myGrid_version= mainLayout_det.cells('a').attachGrid();
            myGrid_version.setSizes ("8px");
            myGrid_version.setHeader('Cod.Espec,Nombre,Ver.,Estado,Proveedor,Cod.Proveedor,Tipo Espec.,F.Creación,Creado por,F.Revisado,Revisado por,F.Aprobado,Aprobado por');
            myGrid_version.setInitWidths('100,200,80,100,400,0,150,80,200,80,200,80,200');
            myGrid_version.setColAlign('left,left,left,left,left,left,left,left,left,left,left,left');
            myGrid_version.setColumnIds('cod,nom,vers,estado,proveedor,codprov,tipoesp,cc,cp,rr,rp,ff,fp');  
            myGrid_version.setColTypes('ed,ed,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro');    
            myGrid_version.init();   
            iniciotabs();
        };
    } , 'json');      
}

iniciotabs= () => {
    tabbar_det = mainLayout_det.cells('b').attachTabbar();
    if (grupo_prod==1||grupo_prod==5){
        tabbar_det.addTab('crt', 'Características', null, null, true);
        tabbar_det.addTab('cpto', 'Complementos', null, null, false);
        tabbar_det.addTab('ptr', 'Patrones', null, null, false);
        tabbar_det.addTab('prod', 'Productos/SubProductos asociados', null, null, false);
    }else{
        tabbar_det.addTab('presp', 'Productos Espec.', null, null, true);
        tabbar_det.addTab('crt', 'Características', null, null, false);
    }
    tabbar_det.addTab('esy', 'Ensayos', null, null, false);
    tabbar_det.addTab('hst', 'Historial', null, null, false);
    tabbar_det.addTab('arc', 'Archivos Adjuntos', null, null, false);
    tabbar_det.attachEvent ( "onSelect" , detaOnSelect); 
}

mainToolbarOnClick= async (id) => {    
    switch (id) { 
        case 'verdet':    
            if (de_grupo == '__matpr'||de_grupo == '__emp'){
                col  = myGrid_espvers.getSelectedRowId();
                if(col) {
                    verdetespecif('edit',de_grupo);  
                }else{
                    dhtmlx.confirm("Debe seleccionar una especificación", function (result) {
                    });
                }
            }else{ 
                col  = myGrid_version.getSelectedRowId();
                if(col) {
                    verdetespecif('edit',de_grupo);   
                }else{
                    dhtmlx.confirm("Debe seleccionar una especificación", function (result) {
                    });
                }          
            }
            break;   
        case 'minimizar':   
            mainLayout.cells('b').collapse();
            break;      
        case 'maximizar':  
            mainLayout.cells('a').collapse();
            break;      
        case 'copiar':
            if (ind_grupo == 'P'){
                col  = myGrid_espvers.getSelectedRowId();
                if(col) {
                    sel  = myGrid_espvers.getRowData(col);
                    sel_grid = myGrid_espvers.getRowData(myGrid_espvers.getSelectedRowId());
                    suma =Sumar(sel_grid.vers,1);
                    versioninput(sel_grid.cod,suma,sel_grid.codprov,sel_grid.proveedor,sel_grid.nom);
                }else{
                    dhtmlx.confirm("Debe seleccionar una especificación", function (result) {
                    });
                }
            }else{
                col  = myGrid_version.getSelectedRowId();
                if(col) {
                    sel  = myGrid_version.getRowData(col);
                    sel_grid = myGrid_group.getRowData(myGrid_group.getSelectedRowId());
                    suma =Sumar(sel_grid.vers,1);
                    versioninput(sel_grid.cod,suma,sel_grid.codprov,sel_grid.prov,sel_grid.desc);
                }else{
                    dhtmlx.confirm("Debe seleccionar una especificación", function (result) {
                    });
                }
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
        case 'filtrar':
            if(grupo_prod==5||grupo_prod==1){      
                data = myGrid_group.getRowData(myGrid_group.getSelectedRowId())     
                cargarespecversProducto(data.cod,grupo_prod,'S');
            }else{
                data = myGrid_group.getRowData(myGrid_group.getSelectedRowId());
                cargarversiones(data.cod,'S');
            }
            break;''
        case 'eliminar':    
            if (de_grupo == '__matpr'||de_grupo == '__emp'){
                col  = myGrid_espvers.getSelectedRowId();
                if(col) {
                    sel = myGrid_espvers.getRowData(col);
                    eliminarEspecificacion(sel.cod,sel.vers);  
                }else{
                    dhtmlx.confirm("Debe seleccionar una especificación", function (result) {
                    });
                }
            }else{ 
                col  = myGrid_version.getSelectedRowId();
                if(col) {
                    sel = myGrid_version.getRowData(col);
                    eliminarEspecificacion(sel.cod,sel.vers);   
                }else{
                    dhtmlx.confirm("Debe seleccionar una especificación", function (result) {
                    });
                }          
            }
        break;
        default:
            null;
            break;
    }
};


function Sumar(a,b){
    return parseInt(a)+parseInt(b);
  }

inicioOnSelect= async (id) => {
    switch (id) {
        case '__gran':     
            serie = 'ETGR';
            nom_report = 'ESPECIFICACIONES TECNICAS DE GRANEL';
            grupo_prod = 2;
            clase_grupo = 2;
            tipo_bien = 10; 
            de_grupo = '__gran';
            cargarespecific(de_grupo,grupo_prod,'N','N');        
            break;   
        case '__ept':     
            serie = 'ETPT';
            nom_report = 'ESPECIFICACIONES TECNICAS DE PRODUCTO TERMINADO';
            grupo_prod = 4;
            clase_grupo = 2;
            tipo_bien = 10; 
            de_grupo = '__ept';
            cargarespecific(de_grupo,grupo_prod,'N','N');             
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
            nom_report = 'ESPECIFICACIONES TECNICAS DE INSUMO INTERNO';
            de_grupo = '__insu';
            grupo_prod = 3;
            clase_grupo = 2;
            tipo_bien = 7;    
            cargarespecific(de_grupo,grupo_prod,'N','N'); 
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
            case 'ptr':    
                cargarPatrones(cod_esp,version_esp); 
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
            for(var i=0;i<to_fila_data_num_gri;i++){
                let iRowId_gri = myGrid_esprod.getRowId(i);
                if(iRowId_gri){
                    data = myGrid_esprod.getRowData(iRowId_gri);
                    if (data.chec == 1) {
                        myGrid_esprod.deleteRow(iRowId_gri);
                        i = i - 1;
                        to_fila_data_num_gri = to_fila_data_num_gri - 1;
                    }
                }
            }
        break;
        case 'guardar':
            let  cant_filas_guardar = 0;
            let cadena = '',data_grabar;
            let n=0;
            cant_filas_guardar = myGrid_esprod.getRowsNum();
            if (cant_filas_guardar ==0){
                dhtmlx.confirm("Ingresa productos", function (result) {
                    if (result === Boolean(true)) {
                    }
                });
            }else{
                for (let i = 0; i < cant_filas_guardar; i++) {
                    let iRowId = myGrid_esprod.getRowId(i);
                    if(iRowId){
                        data_grabar = myGrid_esprod.getRowData(iRowId);
                        cadena += data_grabar.cod +'@';
                        n++;
                    }
                }
                cant_filas_guardar = n;
                guardarprod(sel.cod,version_esp,cadena,cant_filas_guardar);
            }
            break;     
        default:
            null;
            break;
    }
};

cargarespecific = (nombre,grupo,prod,filter) => { 
    ind_grupo = 'E';    
    nom_report = nom_report;
    mainLayout_group = tabbar.cells(nombre).attachLayout('1C');    
    myGrid_group = mainLayout_group.cells('a').attachGrid();
    mainLayout_group.cells('a').hideHeader();
    mytoolbar = mainLayout_group.cells('a').attachToolbar();  
    mytoolbar.setIconsPath('/assets/images/icons/');
    if (grupo!=2){
        mytoolbar.addButton('nuevo',null,'Nuevo',"ic-add3.png","ic-add3.png");
        mytoolbar.addButton('copiar',null,'Copiar Especificación',"ic-copy.png","");
    };
    mytoolbar.addButton('historial',null,'Historial de cambios',"ic-historial.png","");
    mytoolbar.addButton('print',null,'Imprimir',"print.png","");
    mytoolbar.attachEvent ( "onClick" , onClickaction); 
    mytoolbar.setIconSize(32);    
    myGrid_group.setHeader('Cod.Espec.,Descripción,Espec.Vinculada,Cod.NSOC,Ver.,Estado,F.Creación,F.Revisado,F.Aprobado,Creado por:,Revisado por:,Aprobado por:,Proveedor,Cod.Proveedor,Tipo');
    myGrid_group.setInitWidths('80,400,80,150,50,80,80,80,80,200,200,200,200,0,100');
    myGrid_group.setColAlign('left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left');
    myGrid_group.setColTypes('ed,ed,ed,ed,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro'); 
    myGrid_group.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#select_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,,#text_filter,#text_filter");     
    myGrid_group.setColumnIds('cod,desc,cgranel,coesp,vers,vig,fcrea,frev,fapr,crea,rev,aprob,prov,codprov,tip');  
    if(grupo==2||grupo==4||grupo==3){
        if(grupo==2){
            mytoolbar.addButton('asignar',null,'Asignar Especificación',"ic-register.png","");
        }
        if(grupo==4){
            mytoolbar.addButton('obser',null,'Espec. Observadas',"ic-fail.png","");
        }
        mytoolbar.addButton('busprod',null,'Buscar por Producto',"ic-look.png","");
        mytoolbar.addButton('refresh',null,'Actualizar',"ic-refresh.png","");
        mytoolbar.addButton('filter',null,'Espec. anuladas/obsoletas',"filter.png","");
        myGrid_group.setColumnHidden(13,true),myGrid_group.setColumnHidden(12,true),myGrid_group.setColumnHidden(14,true);
    }
    myGrid_group.init();      
    myGrid_group.clearAll(); 
    mainLayout_group.cells('a').progressOn();
    mainLayout.cells('b').collapse();
    myGrid_group.load( BASE_URL + 'PO010411/mostrar-especificacion-grupo/'+usrJson.empresa+'/'+grupo+'/'+prod+'/'+filter).then(function (text) {
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
                    myGrid_group.setRowColor(iRowId,"#f44336");
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
        form_arte ='';
        form_inci = '';
        form_cas='';
        form_tmat= ''; 
        iniciotabs();
        tabbar_det.tabs('presp').show();
        tabbar_det.tabs('crt').show();
        tabbar_det.tabs('esy').show();
        // tabbar_det.tabs('cpto').show();
        tabbar_det.tabs('hst').show();
        version_esp = data.vers;
        cod_esp = form_cod; 
        cargarversiones(data.cod,'N');    
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
    mytoolbar.addButton('export',null,'Exportar',"ic-excel.png","");
    mytoolbar.addButton('filter',null,'Incluir códigos anulados/sin especificación',"filter.png","");
    mytoolbar.attachEvent ( "onClick" , onClickaction); 
    mytoolbar.setIconSize(32);    
    myGrid_group.setHeader('Cod.Producto,Descripción,C/Especificación,Tipo Producto,Tipo Material,Inci,Cod.Antiguo,Vigencia');    
    myGrid_group.setInitWidths('150,500,200,200,200,200,100,100');
    myGrid_group.setColAlign('left,left,left,left,left,left,left,left');
    myGrid_group.setColTypes('ed,ed,ro,ro,ro,ro,ro,ro'); 
    myGrid_group.attachHeader("#text_filter,#text_filter,#select_filter,#select_filter,#text_filter,#text_filter,#text_filter,#select_filter");     
    myGrid_group.setColumnIds('cod,desc,c_esp,tprd,tmat,inci,cant,vig');  
    myGrid_group.init(); 
    if(grupo==5){
        mytoolbar.addButton('patr',null,'Patrones sin recepción',"ic-register.png","ic-register.png");
        
    }else{
        myGrid_group.setColumnHidden(4,true);
    }     
    mainLayout.cells('b').collapse();
    cargargrillaespec(grupo,1);
    myGrid_group.attachEvent("onRowSelect", function (id, ind) {            
        mainLayout.cells('b').expand();
        mainLayout_det.cells('a').expand();
        mainLayout_det.cells('b').collapse();
        mainLayout_det.cells('a').setWidth(650);  
        data = myGrid_group.getRowData(myGrid_group.getSelectedRowId())     
        mainLayout_det.cells('a').setText('Descripción: '+data.desc+' ('+data.cod+')');   
        cargarespecversProducto(data.cod,grupo,'N');
        iniciotabs();
        alertacodiseno(data.cod);
        // cargarespecProd(data.cod,data.vers,form_vig);
     });
};

cargargrillaespec = (grupo,filter) => {  
    myGrid_group.clearAll(); 
    mainLayout_group.cells('a').progressOn();
    myGrid_group.load( BASE_URL + 'PO010410/mostrar-prod-espec-por-grupo/'+usrJson.empresa+'/'+grupo+'/'+filter).then(function (text) {
        mainLayout_group.cells('a').progressOff();
        num_fila = myGrid_group.getRowsNum();
        let iRowId;
        for(let i=0;i<num_fila;i++){
            iRowId = myGrid_group.getRowId(i);
            data = myGrid_group.getRowData(iRowId);
            if(data.vig=='Vigente'){
                myGrid_group.setRowColor(iRowId,"#90EE90");
            }else{
                    myGrid_group.setRowColor(iRowId,"#f44336");
            }
        }
    });
};
cargarCaract = (espec,version,estado) => {  
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
            for(var i=0;i<to_fila_data_num_gri;i++){
                let iRowId_gri = myGrid_caract.getRowId(i);
                if(iRowId_gri){
                    data = myGrid_caract.getRowData(iRowId_gri);
                    if (data.chec == 1) {
                        myGrid_caract.deleteRow(iRowId_gri);
                        i = i - 1;
                        to_fila_data_num_gri = to_fila_data_num_gri - 1;
                    }
                }
            }
        break;  
        case 'aceptar':            
            let  cant_filas_guardar = 0,n=0;
            cant_filas_guardar = myGrid_caract.getRowsNum();
            let cadenacod = '',cadenadet='',data_grabar,caract_gen,cond_alm;            
            caract_gen = myFormdcaract.getItemValue('_ep_car_gen');
            cond_alm = myFormdcaract.getItemValue('_ep_car_alm');
            for (let i = 0; i < cant_filas_guardar; i++) {
                let iRowId = myGrid_caract.getRowId(i);
                if(iRowId){
                    data_grabar = myGrid_caract.getRowData(iRowId);
                    cadenacod += data_grabar.id +'@';
                    cadenadet += data_grabar.det +'@';
                    n++;
                }
            }
            cant_filas_guardar = n;
            guardarcaract(sel.cod,version_esp,cadenacod,cadenadet,cant_filas_guardar,caract_gen,cond_alm);
           
            break;     
        default:
            null;
            break;
    }
};

toolbarOnensayo = async (id) => {
    if(grupo_prod==5||grupo_prod==1){
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
                let iRowId_gri = myGrid_ensa.getRowId(i);
                if(iRowId_gri){
                    data = myGrid_ensa.getRowData(iRowId_gri);
                    if (data.chec == 1) {
                        myGrid_ensa.deleteRow(iRowId_gri);
                        i = i - 1;
                        to_fila_data_num_gri = to_fila_data_num_gri - 1;
                    }
                }
            }
            break; 
        case 'aceptar':       
            let  cant_filas_guardar = 0,n=0;
            let cadenaensayo = '',cadenametodo='',cadenaespec='',limmax='',limmin='',cadenaespecingl='',data_grabar;
            cant_filas_guardar = myGrid_ensa.getRowsNum();
            if (cant_filas_guardar ==0){
                dhtmlx.confirm("Sin ensayos", function (result) {
                    if (result === Boolean(true)) {
                    }
                });
            }else{
                for (let i = 0; i < cant_filas_guardar; i++) {
                    let iRowId = myGrid_ensa.getRowId(i);
                    if(iRowId){
                        data_grabar = myGrid_ensa.getRowData(iRowId);
                        cadenaensayo += data_grabar.codens +'@';
                        cadenametodo += data_grabar.codmet +'@';
                        cadenaespec += data_grabar.esp +'@';
                        limmax += data_grabar.max +'@';
                        limmin += data_grabar.min +'@';
                        cadenaespecingl += data_grabar.espin +'@';
                        n++;
                    }
                }
                cant_filas_guardar = n;
                guardarensayo(sel.cod,version_esp,cadenaensayo,cadenametodo,cadenaespec,limmin,limmax,cadenaespecingl,cant_filas_guardar);
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
    myGrid_ensa.setHeader(',Cod.met,Co.Método,Método,Co.Ensayo,Especificaciones,Rango/De,Rangos/A,Especificaciones(Inglés),Condiciones,Unid.Análisis,Tipo de Ensayo,Objetivos de la Prueba,Técnica');    
    myGrid_ensa.setInitWidths('30,0,70,400,80,400,70,70,400,200,70,150,300,100');
    myGrid_ensa.setColAlign('left,center,left,left,center,left,left,left,left,left,center,left,left,left');
    myGrid_ensa.setColTypes('ch,ro,ro,ro,ro,ed,ed,ed,ed,ro,ro,ro,ro,ro'); 
    myGrid_ensa.setColumnIds('chec,codmet,comet,met,codens,esp,min,max,espin,ens,um,tipens,objp,tecn'); 
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
    myGrid_cpto = mainLayout_cpto.cells('a').attachGrid();
    myGrid_cpto.setHeader(',Código,Material');    
    myGrid_cpto.setInitWidths('50,200,600');
    myGrid_cpto.setColAlign('center,left,left');
    myGrid_cpto.setColTypes('ch,ed,ro'); 
    myGrid_cpto.setColumnIds('chec,cod,mat'); 
    myGrid_cpto.setColumnHidden(0,true);
    myGrid_cpto.init();      
    myGrid_cpto.clearAll(); 
    mainLayout_cpto.cells('a').progressOn();
    myGrid_cpto.load( BASE_URL + 'PO010410/mostrar-complemento/'+usrJson.empresa+'/'+espec+'/'+version).then(function (text) {
        mainLayout_cpto.cells('a').progressOff();
    });      
    if (estado == 'Por Aprobar'){
    myGrid_cpto.setColumnHidden(0,false);
    comptoolbar = mainLayout_cpto.cells('a').attachToolbar(); 
    comptoolbar.setIconsPath('/assets/images/icons/');
    comptoolbar.addButton('cargarcmp',null,'Agregar Complemento',"ic-add.png","");
    comptoolbar.addButton('aceptar',null,'Aceptar',"ic-acept.png","");
    comptoolbar.addButton('eliminar',null,'Eliminar',"ic-delete.png","");
    comptoolbar.attachEvent('onClick', toolbarOncmpt);
    comptoolbar.setIconSize(18);
    }
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


cargarPatrones = (espec,version) => {  
    mainLayout_pat = tabbar_det.cells('ptr').attachLayout('1C');  
    mainLayout_pat.cells('a').hideHeader();  
    patoolbar = mainLayout_pat.cells('a').attachToolbar(); 
    patoolbar.setIconsPath('/assets/images/icons/');
    patoolbar.addButton('addptr',null,'Agregar patrón',"ic-add.png","");
    patoolbar.addButton('editar',null,'Editar',"ic-edit3.png","");
    patoolbar.addButton('eliminar',null,'Eliminar',"ic-delete.png","");
    patoolbar.addButton('aprobar',null,'Recibir',"ic-acept.png","");
    patoolbar.attachEvent('onClick', toolbarOnptr);
    patoolbar.setIconSize(18);
    myGrid_patr = mainLayout_pat.cells('a').attachGrid();
    myGrid_patr.setHeader('Orden,Co_Tipo,Tipo,F. Creación,Creado por:,F. Vencimiento,F. Recepción,Recepcionado por:,Estado,Observación');    
    myGrid_patr.setInitWidths('0,0,100,100,300,100,100,300,100,250');
    myGrid_patr.setColAlign('left,left,left,center,left,center,center,left,center,left');
    myGrid_patr.setColTypes('ro,ro,ro,ro,ro,ro,ro,ro,ro,ro'); 
    myGrid_patr.setColumnIds('orden,co_tipo,tipo,fcrea,crea,fvig,fapro,apro,est,obs'); 
    myGrid_patr.init();      
    myGrid_patr.clearAll(); 
    mainLayout_pat.cells('a').progressOn();
    myGrid_patr.load( BASE_URL + 'PO010410/mostrar-patrones/'+usrJson.empresa+'/'+espec+'/'+version).then(function (text) {
        mainLayout_pat.cells('a').progressOff();
    }); 
};

cargarDocumento = (espec,version) => {  
    mainLayout_dcto = tabbar_det.cells('arc').attachLayout('1C');  
    mainLayout_dcto.cells('a').hideHeader(); 
    dctotoolbar = mainLayout_dcto.cells('a').attachToolbar(); 
    dctotoolbar.setIconsPath('/assets/images/icons/');
    dctotoolbar.addButton('verdcto',null,'Ver Archivo',"ic-look.png","");
    dctotoolbar.addButton('subirdt',null,'Subir Archivo',"ic-upload.png","");
    dctotoolbar.addButton('eliminar',null,'Eliminar Archivo',"ic-delete.png","");
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

eliminarDocumento = (espec,version,producto,nombre) => {  
    params = {
        empresa: usrJson.empresa,
        usuario: usrJson.codigo,
        alias: usrJson.alias,
        espec: espec,
        version: version,
        producto: producto,
        nombre: nombre,
    };         
    dhtmlx.confirm("¿Está seguro?", function (result) {
        if (result === Boolean(true)) {
            $.post(BASE_URL + "PO010410/eliminar-archivo", params, function (res) {
                if (res.state=='success'){
                    Swal.fire('Bien!', res.message, 'success');
                    cargarDocumento(espec,version);
                } else {
                    Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se guardo el registro :' + res.message });
                }
            }, "json");
        }
    });
};

eliminarEspecificacion = (espec,version) => {  
    params = {
        empresa: usrJson.empresa,
        usuario: usrJson.codigo,
        alias: usrJson.alias,
        espec: espec,
        version: version,
    };    
    dhtmlx.confirm("¿Está seguro?", function (result) {
        if (result === Boolean(true)) {
            $.post(BASE_URL + "PO010410/eliminar-especificacion", params, function (res) {
                if (res.state=='success'){
                    Swal.fire('Bien!', res.message, 'success');  
                    if(grupo_prod==5||grupo_prod==1){      
                        cargarprodespecgrupo(de_grupo,grupo_prod); 
                    }else{
                        cargarespecific(de_grupo,grupo_prod,'N','N');  
                    }
                } else {
                    Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se guardo el registro :' + res.message });
                }
            }, "json");
        }
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
    col  = myGrid_group.getRowData(myGrid_group.getSelectedRowId());
    mainLayout_prod = tabbar_det.cells('prod').attachLayout('1C');  
    mainLayout_prod.cells('a').hideHeader();  
    prodtoolbar = mainLayout_prod.cells('a').attachToolbar(); 
    prodtoolbar.setIconsPath('/assets/images/icons/');
    prodtoolbar.addButton('verspro',null,'Ver SubProductos',"ic-look.png","");
    prodtoolbar.attachEvent('onClick', toolbarOnProducto);
    prodtoolbar.setIconSize(18);
    myGrid_prod = mainLayout_prod.cells('a').attachGrid();
    myGrid_prod.setHeader(',Cod.Producto,Descripción,Tipo,');    
    myGrid_prod.setInitWidths('0,100,500,200,0');
    myGrid_prod.setColumnHidden(0,true);
    myGrid_prod.setColumnHidden(4,true);
    myGrid_prod.setColAlign('left,left,left,left,left,left');
    myGrid_prod.setColTypes('ed,ed,ed,ed,ed,ed'); 
    myGrid_prod.init();      
    myGrid_prod.clearAll(); 
    mainLayout_prod.cells('a').progressOn();
    //myGrid_prod.load( BASE_URL + 'PO010410/mostrar-productos/'+usrJson.empresa+'/'+espec+'/'+version).then(function (text) {
    myGrid_prod.load( BASE_URL + 'PO010208/mostrar-detalle-form-trazab/'+usrJson.empresa+'/'+col.cod).then(function (text) {
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
    myGrid_esprod.setColTypes('ch,ed,ed,ro,ro'); 
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
    myGridbuscar.load( BASE_URL + 'PO010410/mostrar-producto-por-grupo/'+nva_clase+'/'+buscar).then(function (text) {
        Wind_.window('wbuscar').progressOff();
        cant_filas_l = myGridbuscar.getRowsNum();
    });  
};

onClickaction = async (id) => {     
    serie_grabar = serie;
    switch (id) {
        case 'nuevo':
            nuev = 'S';
            if(grupo_prod==1||grupo_prod==5){
                col  = myGrid_group.getSelectedRowId();
                if(col) {
                    verdetespecif('nuevo',de_grupo);
                }else{
                    dhtmlx.confirm("Debe seleccionar un producto", function (result) {
                    });
                }
            }else{
                verdetespecif('nuevo',de_grupo);
            }
        break;
        case 'historial':
            sel  = myGrid_group.getSelectedRowId();
            if(sel) {
                sel  = myGrid_group.getRowData(myGrid_group.getSelectedRowId());
                cargarlog(sel.vers,sel.cod);   
            }else{
                dhtmlx.confirm("Debe seleccionar una especificación", function (result) {
                });
            }
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
            if(grupo_prod==1||grupo_prod==5){
                rpt2  = myGrid_group.getSelectedRowId();
                if(rpt2) {
                    rp1  = myGrid_espvers.getSelectedRowId();
                    if(rp1){
                        sel  = myGrid_espvers.getRowData(myGrid_espvers.getSelectedRowId());
                        sel2  = myGrid_group.getRowData(myGrid_group.getSelectedRowId());
                        cargarReport(sel.cod,sel.vers,sel2.cod,1,1,nom_report,grupo_prod,1);
                    }else{
                        dhtmlx.confirm("Debe seleccionar una versión", function (result) {
                        });
                    }
                }else{
                    dhtmlx.confirm("Debe seleccionar un producto", function (result) {
                    });
                }
            }else{
                rpt2  = myGrid_group.getSelectedRowId();
                if(rpt2) {
                    rp1  = myGrid_version.getSelectedRowId();
                    if(rp1){
                        rp3  = myGrid_esprod.getSelectedRowId();
                        if(rp3){
                        sel  = myGrid_group.getRowData(myGrid_group.getSelectedRowId());
                        sel2  = myGrid_esprod.getRowData(myGrid_esprod.getSelectedRowId());
                        sel3  = myGrid_version.getRowData(myGrid_version.getSelectedRowId());
                        sel.coesp = sel.coesp.length==0 ? 'No aplica' : sel.coesp;
                        sel2.marc = sel2.marc.length==0 ? '-' : sel2.marc;
                        sel2.subm = sel2.subm.length==0 ? '-' : sel2.subm;
                        cargarReport(sel.cod,sel3.vers,sel2.cod,sel2.marc,sel2.subm,nom_report,grupo_prod,sel2.desc);
                        }else{
                                dhtmlx.confirm("Debe seleccionar un producto", function (result) {
                            });
                        }
                    }else{
                        dhtmlx.confirm("Debe seleccionar una versión", function (result) {
                        });
                    }
                }else{
                    dhtmlx.confirm("Debe seleccionar una especificación", function (result) {
                    });
                }
            }
            break;  
        case 'asignar':
            col  = myGrid_group.getSelectedRowId();
            if(col) {
                mostrarespecPT();
            }else{
                dhtmlx.confirm("Debe seleccionar una especificación granel", function (result) {
                });
            }
            break;
        case 'obser':
            especObservadas(grupo_prod);
            break;
        case 'busprod':
            buscarespProd(grupo_prod);
            break;
        case 'filter':
            if(grupo_prod==1||grupo_prod==5){
                cargargrillaespec(grupo_prod,2);
            }else{
                cargarespecific(de_grupo,grupo_prod,'N','S');                  
            }         
            break;    
        case 'refresh':            
            cargarespecific(de_grupo,grupo_prod,'N','N');  
            break;             
        case 'export':    
            cargaReportexls(grupo_prod);
            WinDocumentoViewer.hide();
            break;                  
        case 'patr':    
            patrPendientes(grupo_prod);
            break;      
        default:
            null;
            break;
    }
};

cargaReportexls = async (grupo_prod) => {
    WinContainer = new dhtmlXWindows();
    WinDocumentoViewer = WinContainer.createWindow('WinDocumentoViewer', 0, 0, 0, 0);
    WinDocumentoViewer.keepInViewport();
    WinDocumentoViewer.setText('Mostrando documento ');
    WinDocumentoViewer.attachURL('/api/po010410/xls-reporte/'+usrJson.empresa+'/'+ grupo_prod); 

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

patrPendientes = async (grupo_prod) => {
    nva_clase = grupo_prod;
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbuscar", 0, 0, 800, 500);
    Winid_.setText("Patrones no recepcionados");
    Wind_.window("wbuscar").setModal(true);
    Wind_.window("wbuscar").denyResize();
    Wind_.window("wbuscar").center();       
    myGrid_patr = Wind_.window("wbuscar").attachGrid();
    myGrid_patr.setHeader('Cod.Producto,Especificación,Versión,Orden,Co_Tipo,Tipo,F. Creación,Creado por:,F. Vencimiento,Estado,Observación');    
    myGrid_patr.setInitWidths('150,100,80,0,0,120,100,300,100,100,250');
    myGrid_patr.setColAlign('left,left,center,left,left,left,center,left,center,center,left');
    myGrid_patr.setColTypes('ed,ed,ro,ro,ro,ro,ro,ro,ro,ro,ro'); 
    myGrid_patr.setColumnIds('prod,espec,vers,orden,co_tipo,tipo,fcrea,crea,fvig,est,obs'); 
    myGrid_patr.init();      
    myGrid_patr.clearAll(); 
    Wind_.window("wbuscar").progressOn();
    myGrid_patr.load( BASE_URL + 'PO010410/mostrar-patrones-pendiente/'+usrJson.empresa).then(function (text) {
        Wind_.window("wbuscar").progressOff();
    }); 
};

buscarespProd = async (grupo_prod) => {
    nva_clase = grupo_prod;
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbuscar", 0, 0, 800, 500);
    Winid_.setText("Buscar por Producto");
    Wind_.window("wbuscar").setModal(true);
    Wind_.window("wbuscar").denyResize();
    Wind_.window("wbuscar").center(); 
    myToolbar = Wind_.window("wbuscar").attachToolbar();
    myToolbar.setIconsPath('/assets/images/icons/');
    myToolbar.addText(null, null, 'Producto a buscar : ');
    myToolbar.addInput('in_busq', null, '', 250);
    myToolbar.addSeparator(null, null);
    myToolbar.addButton('b_busq', null, '<i class="fas fa-search"></i> BUSCAR', null, null);
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
    myGridbuscar.setInitWidths('0,100,500,150,150');
    myGridbuscar.setColAlign('left,left,left,left,left');
    myGridbuscar.setColTypes('ro,ro,ro,ro,ro'); 
    myGridbuscar.attachHeader(",#text_filter,#text_filter,#text_filter,#text_filter");
    myGridbuscar.setColumnIds(',cod,desc,marc,subm');      
    myGridbuscar.init();     
    myGridbuscar.attachEvent("onRowSelect", function (id, ind) {
       data = myGridbuscar.getRowData(myGridbuscar.getSelectedRowId());
       cargarespecific(de_grupo,grupo_prod,data.cod,'N'); 
       Wind_.window("wbuscar").close();
    });  
};

especObservadas = async (grupo_prod) => {
    nva_clase = grupo_prod;
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbuscar", 0, 0, 800, 500);
    Winid_.setText("Especificaciones Observadas");
    Wind_.window("wbuscar").setModal(true);
    Wind_.window("wbuscar").denyResize();
    Wind_.window("wbuscar").center(); 
    myGrid_hist = Winid_.attachGrid();
    myGrid_hist.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    myGrid_hist.setHeader('N°Doc,Versión,Estado,Observaciones,Fecha,Usuario');    
    myGrid_hist.setInitWidths('80,80,100,500,80,250');
    myGrid_hist.setColAlign('left,center,center,left,center,left');
    myGrid_hist.setColTypes('ro,ro,ro,ro,ro,ro');          
    myGrid_hist.init();         
    myGrid_hist.clearAll(); 
    Winid_.progressOn();
    myGrid_hist.load( BASE_URL + 'PO010410/mostrar-espec-observ/'+usrJson.empresa+'/'+grupo_prod).then(function (text) {
        Winid_.progressOff();
    });
};

cargarversiones = (espec,flag) => { 
    esptoolbar.disableItem('eliminar');
    if (grupo_prod == 4){
        const params = {
            espec : espec,
            grupo: 2,
        };
        $.post(BASE_URL + 'PO010410/mostrar-especificacion-pt/', params, function (res) {  
            if (res.state=='unsuccess'){      
                ind_pt = 'N';
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
    myGrid_version.setSizes("8px");
    myGrid_version.setHeader('Cod.Espec,Nombre,Ver.,Estado,Proveedor,Cod.Proveedor,Tipo Espec.,F.Creación,Creado por,F.Revisado,Revisado por,F.Aprobado,Aprobado por');
    myGrid_version.setInitWidths('100,200,80,100,400,0,150,80,200,80,200,80,200');
    myGrid_version.setColAlign('left,left,left,left,left,left,left,left,left,left,left,left');
    myGrid_version.setColumnIds('cod,nom,vers,estado,proveedor,codprov,tipoesp,cc,cp,rr,rp,ff,fp'); 
    myGrid_version.setColTypes('ed,ed,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro');     
    myGrid_version.init();    
    myGrid_version.clearAll();
    if(grupo_prod==2||grupo_prod==4){
        myGrid_version.setColumnHidden(4,true),
        myGrid_version.setColumnHidden(6,true);
    }
    myGrid_version.attachEvent("onRowSelect", function (id, ind) {  
        data = myGrid_version.getRowData(myGrid_version.getSelectedRowId());   
        win_desc = data.nom+" ("+data.cod+")"+" Vers."+data.vers;     
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
        version_esp = data.vers;
        version_prov = data.codprov;
        st_vers = data.estado;
        cod_esp = form_cod; 
        iniciotabs();
        mainLayout_det.cells('b').expand();
        mainLayout_det.cells('a').setHeight(200);
        cargarespecProd(form_cod,version_esp,st_vers);
        if(data.estado=='Por Aprobar'){            
            esptoolbar.enableItem('eliminar');
        }else{    
            esptoolbar.disableItem('eliminar');
        };
     });  
    myGrid_version.clearAll(); 
    myGrid_version.load( BASE_URL + 'PO010410/mostrar-version/'+usrJson.empresa+'/'+espec+'/'+flag).then(function (text) {
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
                    myGrid_version.setRowColor(iRowId,"#f44336");
                }
            }
        }
    });
};

cargarespecversProducto = (prod,grupo,flag) => {   
    esptoolbar.disableItem('eliminar');
    esptoolbar.showItem('espec');
    esptoolbar.hideItem('info');
    mainLayout_det.cells('a').progressOn();
    myGrid_espvers= mainLayout_det.cells('a').attachGrid();
    myGrid_espvers.clearAll(); 
    myGrid_espvers.setSizes ("8px");
    myGrid_espvers.setHeader('Cod.Espec,Nombre,Ver.,Estado,Proveedor,Arte,F.Creación,Creado por,F.Revisado,Revisado por,F.Aprobado,Aprobado por,Cod.Proveedor,Tipo Material,Inci,Cod.Cas,Fabricante,Origen');
    myGrid_espvers.setInitWidths('100,200,80,80,200,100,80,200,80,200,80,200,0,200,200,100,200,100');
    myGrid_espvers.setColAlign('left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left');
    myGrid_espvers.setColumnIds('cod,nom,vers,estado,proveedor,arte,cc,cp,rr,rp,ff,fp,codprov,tipo,inci,cas,fab,orig');
    myGrid_espvers.setColTypes('ed,ed,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro');     
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
        form_arte =data.arte;
        form_inci = data.inci;
        form_cas= data.cas;
        form_tmat= data.tipo; 
        form_orig= data.orig; 
        form_fab= data.fab; 
        if(data.estado=='Por Aprobar'){            
            esptoolbar.enableItem('eliminar');
        }else{    
            esptoolbar.disableItem('eliminar');
        };
     }); 
    myGrid_espvers.load( BASE_URL + 'PO010410/mostrar-espec-por-producto/'+usrJson.empresa+'/'+prod+'/'+grupo+'/'+flag).then(function (text) {
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
                    myGrid_espvers.setRowColor(iRowId,"#f44336");
                }
            }
        }
    });
};

copiarespecificacion = (accion,espec_orig,grupo_prod,version_orig,co_espec_nue,proveedor,desc,tipo_vers,catalogo_prod,observacion) => {   
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
        catalogo_prod: catalogo_prod,
        observacion:observacion
    };    
    $.post(BASE_URL + "PO010410/copiar-especificacion", params, function (res) {
        if (res.state=='success'){
            Swal.fire('Bien!', res.message, 'success');
            if(grupo_prod==1||grupo_prod==5){
                cargarprodespecgrupo(de_grupo,grupo_prod);
            }else{
                cargarespecific(de_grupo,grupo_prod,'N','N');
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
        if (res.state=='success'){
            Swal.fire('Bien!', res.message, 'success');
            myGrid_caract.clearAll(); 
            cargarCaract(especificacion,version,'Por Aprobar'); 
        } else {
            Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se guardo el registro :' + res.message });
        }
    }, "json");
};

guardarensayo = (especificacion,version,ensayo,metodo,cadespec,limmin,limmax,cadespecingl,cantfilas) => { 
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
        cadespecingl:cadespecingl,
        cantfilas: cantfilas
    };    
    $.post(BASE_URL + "PO010410/guardar-ensayo", params, function (res) {
        if (res.state=='success'){
            Swal.fire('Bien!', res.message, 'success'); 
            myGrid_ensa.clearAll(); 
            cargarEnsayo(especificacion,version,'Por Aprobar'); 
        } else {
            Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se guardo el registro :' + res.message });
        }
    }, "json");
};

guardarcomplemento = (especificacion,version,cadena,cantfilas) => {   
    params = {
        empresa: usrJson.empresa,
        especificacion: especificacion,
        alias: usrJson.alias,
        version:version,
        cadena: cadena,
        cantfilas: cantfilas
    };    
    $.post(BASE_URL + "PO010410/guardar-complemento", params, function (res) {
        if (res.state=='success'){
            Swal.fire('Bien!', res.message, 'success'); 
            myGrid_cpto.clearAll(); 
            cargarCompto(especificacion,version,'Por Aprobar'); 
        } else {
            Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se guardo el registro :' + res.message });
        }
    }, "json");
};

guardarhistorial = (especificacion,version,observacion) => {   
    params = {
        empresa: usrJson.empresa,
        usuario: usrJson.codigo,
        especificacion: especificacion,
        version:version,
        observacion: observacion
    };    
    $.post(BASE_URL + "PO010410/guardar-historial", params, function (res) {
        if (res.state=='success'){
            Swal.fire('Bien!', res.message, 'success');
            cargarHistorial(especificacion,version,'Por Aprobar'); 
        } else {
            Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se guardo el registro :' + res.message });
        }
    }, "json");
};

guardarpatron = (especificacion,version,patron,observacion,fecha,orden,accion) => {   
    params = {
        empresa: usrJson.empresa,
        usuario: usrJson.codigo,
        especificacion: especificacion,
        version:version,
        patron:patron,
        observacion: observacion,
        fecha:fecha,
        orden:orden,
        accion:accion
    };    
    console.log(params);
    $.post(BASE_URL + "PO010410/guardar-patron", params, function (res) {
        if (res.state=='success'){
            dhtmlx.alert({
                title: 'Correcto',
                text: res.message
            });   
            cargarPatrones(especificacion,version);             
            Wind_.window("wbuscar").close();
        } else {
            dhtmlx.alert({
                title: 'Correcto',
                type:'alert-error',
                text: res.message
            });     
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
        }else {
            if (varprov=='nvovers' ){
            myFormdatos_inputvers.setItemValue('ep_provcod',cod);
            myFormdatos_inputvers.setItemValue('ep_proveedor',prov);
        }else{
            myFormespecf.setItemValue('ep_provcod',cod);
            myFormespecf.setItemValue('ep_proveedor',prov);
        }}
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

mostrarespecPT = async (varprov) => {
    nva_clase =grupo_prod;
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbusq", 0, 0, 750, 500);
    Wind_.window("wbusq").setModal(true);
    Wind_.window("wbusq").denyResize();
    Wind_.window("wbusq").center();
    Winid_.setText("Especificaciones de Producto Terminado");
    myGrid = Winid_.attachGrid();
    myGrid.setHeader('Cod.Espec.,Descripción,Cod.Espec. Granel,Cod.NSOC,Ver.,Estado,F.Creación,F.Revisado,F.Aprobado,Creado por:,Revisado por:,Aprobado por:,Proveedor,Cod.Proveedor,Tipo');
    myGrid.setInitWidths('80,400,80,150,50,80,80,80,80,200,200,200,200,0,100');
    myGrid.setColAlign('left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left');
    myGrid.setColTypes('ed,ed,ed,ed,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro'); 
    myGrid.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,,#text_filter,#text_filter");     
    myGrid.setColumnIds('cod,desc,cgranel,coesp,vers,vig,fcrea,frev,fapr,crea,rev,aprob,prov,codprov,tip');  
    myGrid.init();    
    myGrid.setColumnHidden(6,true),myGrid.setColumnHidden(7,true),myGrid.setColumnHidden(8,true),myGrid.setColumnHidden(9,true),myGrid.setColumnHidden(10,true);
    myGrid.setColumnHidden(11,true),myGrid.setColumnHidden(12,true),myGrid.setColumnHidden(13,true),myGrid.setColumnHidden(14,true);
    Wind_.window("wbusq").progressOn();
    myGrid.load( BASE_URL + 'PO010411/mostrar-especificacion-grupo/'+usrJson.empresa+'/'+4+'/'+'N'+'/'+'N').then(function (text) {
        Wind_.window("wbusq").progressOff();
        num_fila = myGrid.getRowsNum();
        let iRowId;
        for(let i=0;i<num_fila;i++){
            iRowId = myGrid.getRowId(i);
            data = myGrid.getRowData(iRowId);
            if(data.vig=='Vigente'){
                myGrid.setRowColor(iRowId,"#90EE90");
            }else{
                if(data.vig=='Por Aprobar'||data.vig=='Revisada'){
                    myGrid.setRowColor(iRowId,"#F7D358");
                }else{
                    myGrid.setRowColor(iRowId,"#f44336");
                }
            }
        }
    });   
    myGrid.attachEvent("onRowSelect", function (id, ind) {
        data = myGrid.getRowData(myGrid.getSelectedRowId())
        cod = data.cod;  
        cod_gran = myGrid_group.getSelectedRowId();
        sel_gran = myGrid_group.getRowData(cod_gran);
        params = {
            codigo_pt: cod,
            codigo: sel_gran.cod,
        };    
        $.post(BASE_URL + "PO010410/vincular-especificacion", params, function (res) {
            if (res.state=='success'){
                Swal.fire('Bien!', res.message, 'success');  
                Wind_.window("wbusq").close();   
                cargarespecific(de_grupo,grupo_prod,'N','N');
            } else {
                Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se guardo el registro :' });
            }
        }, "json");

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

guardarcabecera = (especificacion,version,proveedor,grupo,descripcion,serie,accion,tipo_material,arte,princ_activo,inci,cas,prod,origen,fabricante) => {   
    params = {
        empresa: usrJson.empresa,
        alias: usrJson.alias,
        usuario: usrJson.codigo,
        especificacion: especificacion,
        version: version,
        proveedor: proveedor,
        grupo: grupo,
        descripcion: descripcion,
        serie:serie,
        accion:accion,
        tipo_material:tipo_material,
        arte:arte,
        princ_activo:princ_activo,
        inci:inci,
        cas:cas,
        prod:prod,
        origen:origen,
        fabricante:fabricante
    };      
    $.post(BASE_URL + "PO010410/guardar-cabecera", params, function (res) {
        if (res.state=='success'){
            Swal.fire('Bien!', res.message, 'success');            
            if(grupo_prod==1||grupo_prod==5){
                    cargarprodespecgrupo(de_grupo,grupo_prod);
            }else{
                cargarespecific(de_grupo,grupo_prod,'N','N');
            }
        } else {
            Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se guardo el registro :' + res.message });
        }
    }, "json");
};

verdetespecif = async (condic,de_grupo) => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbuscar", 0, 0, 520, 500);
    Wind_.window("wbuscar").setModal(true);
    Wind_.window("wbuscar").denyResize();
    Wind_.window("wbuscar").center();     
    myToolbar = Wind_.window("wbuscar").attachToolbar();
    myToolbar.setIconsPath('/assets/images/icons/');
    myToolbar.addButton('save', null, '<b>Guardar</b>', "ic-save2.png", "ic-save2.png");
    myToolbar.addSeparator(null, null);
    myToolbar.addButton('edit',null,'<b>Editar</b>',"ic-edit3.png","ic-edit3.png");
    myToolbar.setIconSize(32);
    myToolbar.attachEvent('onClick', onClickDetesp);  
    myFormespecf = Wind_.window("wbuscar").attachForm(form_especf);
    if (de_grupo == '__ept'){
       myFormespecf.hideItem('ep_provcod');
       myFormespecf.hideItem('buscarprov');
       myFormespecf.hideItem('ep_proveedor');
    }else if (de_grupo == '__emp'){
        myFormespecf.showItem('ep_tm');
        myFormespecf.showItem('ep_arte');
    }if (de_grupo == '__matpr'){
        myFormespecf.showItem('ep_pact');
        myFormespecf.showItem('ep_inci');
        myFormespecf.showItem('ep_cas');
        myFormespecf.showItem('ep_fab');
        myFormespecf.showItem('ep_orig');
    };
    
    if (condic=='edit'){
        Winid_.setText(win_desc);
        myToolbar.disableItem('save');
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
        myFormespecf.setItemValue('ep_tm',form_tmat); 
        myFormespecf.setItemValue('ep_cas',form_cas); 
        myFormespecf.setItemValue('ep_inci',form_inci); 
        myFormespecf.setItemValue('ep_fab',form_fab); 
        myFormespecf.setItemValue('ep_orig',form_orig); 
        myFormespecf.setItemValue('ep_arte',form_arte);
        myFormespecf.setItemValue('ep_pact',form_tmat);
        if (de_grupo == '__matpr'||de_grupo == '__emp'){
            col  = myGrid_group.getSelectedRowId();
            if(col) {
                sel  = myGrid_group.getRowData(col);
                myFormespecf.setItemValue('cod_producto',sel.cod);
            }else{
                dhtmlx.confirm("Debe seleccionar un producto y especificación", function (result) {
                });
            }
        }
    }else{        
        Winid_.setText('Crear nueva especificación');
        myToolbar.disableItem('edit');
        myFormespecf.disableItem('ep_codigo'),myFormespecf.disableItem('ep_version');
        myFormespecf.disableItem('ep_estado'),myFormespecf.setReadonly('ep_provcod',false);
        myFormespecf.setReadonly('ep_proveedor',false),myFormespecf.setReadonly('ep_desc',false);
        myFormespecf.disableItem('ep_fecc'),myFormespecf.disableItem('ep_crea');
        myFormespecf.disableItem('ep_fecrev'),myFormespecf.disableItem('ep_rev');
        myFormespecf.disableItem('ep_fecapro'),myFormespecf.disableItem('ep_aprob');
        myFormespecf.enableItem('buscarprov'),myFormespecf.disableItem('buscarnsoc');
        myFormespecf.clear();
        // mytoolbar.enableItem('save');
        if (de_grupo == '__matpr'||de_grupo == '__emp'){
            col  = myGrid_group.getSelectedRowId();
            if(col) {
                sel  = myGrid_group.getRowData(col);
                Winid_.setText('Crear nueva especificación: '+sel.cod+"-"+sel.desc);
                myFormespecf.setItemValue('cod_producto',sel.cod);
            }else{
                dhtmlx.confirm("Debe seleccionar un producto", function (result) {
                });
            }
        }
        mostrarnvaEspec(grupo_prod,'NVO');
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
            if(grupo_prod == 4){
                proveedor = "0";
            }else{
                proveedor = myFormespecf.getItemValue('ep_provcod');
            }
            descproveedor = myFormespecf.getItemValue('ep_proveedor');
            nsoc = myFormespecf.getItemValue('ep_nsoc');
            descripcion = myFormespecf.getItemValue('ep_desc');
            tipo_espec = myFormespecf.getItemValue('ep_tipo');
            tipo_material = myFormespecf.getItemValue('ep_tm');
            arte = myFormespecf.getItemValue('ep_arte');
            princ_activo = myFormespecf.getItemValue('ep_pact');
            inci = myFormespecf.getItemValue('ep_inci');
            cas = myFormespecf.getItemValue('ep_cas');
            prod = myFormespecf.getItemValue('cod_producto');
            origen = myFormespecf.getItemValue('ep_orig');
            fabricante = myFormespecf.getItemValue('ep_fab');
            if(proveedor.length==0||descripcion.length==0){
                dhtmlx.alert({
                    type: 'alert-error',
                    text: 'Debe llenar el formulario'
                });
            }else{
                if (nuev == 'S'){
                    guardarcabecera(11,1,proveedor,grupo_prod,descripcion,serie,nuev,tipo_material,arte,princ_activo,inci,cas,prod,origen,fabricante);
                }else{ 
                    version = myFormespecf.getItemValue('ep_version');
                    especificacion = myFormespecf.getItemValue('ep_codigo');
                    guardarcabecera(especificacion,version,proveedor,grupo_prod,descripcion,serie,nuev,tipo_material,arte,princ_activo,inci,cas,prod,origen,fabricante);
                };
            }
            break;    
            case 'edit': 
                nuev = 'E';     
                myToolbar.enableItem('save');
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
    myGridensaysel.setHeader(',Método Análisis,Método,Cod.Ensayo,Ensayo,Cod.Tipo Ensayo,Tipo Ensayo,Obj.Ensayo,Num.Versión,Cod.Método,Unid.Análisis,Obligatorio,Declarado,Para Especificación,Guía,Estado,Técnica');
    myGridensaysel.setInitWidths('50,80,200,80,200,0,200,200,0,0,80,80,80,80,80,80,100');
    myGridensaysel.setColAlign('center,left,left,left,left,left,left,left,left,left,center,center,center,center,center,center,center');
    myGridensaysel.setColTypes('ch,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro'); 
    myGridensaysel.attachHeader(",#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter");
    myGridensaysel.setColumnIds('chec,comet,met,codens,ens,cotipo,tipens,obj,num,codmet,um,,,,,,tec');      
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

function addZero(i) {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
}

agregarpatron = async (tipo,vig,obs,accion) => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbuscar", 0, 0, 600, 210);
    Wind_.window("wbuscar").hideHeader();
    Wind_.window("wbuscar").setModal(true);
    Wind_.window("wbuscar").denyResize();
    Wind_.window("wbuscar").center(); 
    myToolbar = Wind_.window("wbuscar").attachToolbar();
    myToolbar.setIconsPath('/assets/images/icons/');
    myToolbar.addButton('b_guardar', null, 'Guardar', "ic-acept.png", null);
    myToolbar.addSeparator(null, null);
    myToolbar.addButton('b_desbloquear', null, 'Permisos', "unlock.png", null);
    myToolbar.addSeparator(null, null);
    myToolbar.addButton('b_close', null, 'Cerrar', "ic-cancel-cd.png", null);
    myToolbar.addSeparator(null, null);
    myToolbar.attachEvent('onClick',toolbarOnptr);
    myFormdatos_pat = Wind_.window("wbuscar").attachForm(f_patrones); 
    var hoy = new Date();
    var dd = hoy.getDate(), mm = hoy.getMonth() + 1,yyyy = hoy.getFullYear()+1;
    dd=addZero(dd);
    mm=addZero(mm);
    fecha = yyyy+'-'+mm+'-'+dd; 
    myFormdatos_pat.setItemValue('_et_fec_vig',fecha);
    accion_ptr = accion;
    if(accion == 'U'){        
        myFormdatos_pat.setItemValue('_et_fec_vig',vig);
        myFormdatos_pat.enableItem('_et_fec_vig');
        myFormdatos_pat.setItemValue('_et_tipo',tipo);
        myFormdatos_pat.setItemValue('_et_obs_pat',obs);
    }
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
    if(grupo_prod==4){
        myFormdatos_input.hideItem('ep_proveedor');
        myFormdatos_input.hideItem('ep_provcod');
        myFormdatos_input.hideItem('buscarprov');
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
    $.post(BASE_URL + 'PO010410/mostrar-especificacion-copia/', params, function (res) {
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
                if (data.chec == 1) {
                    myGrid_caract.addRow(myGrid_caract.uid(),[0,data.cod,data.car,''],1);
                }      
            }     

            cant_filas_n = myGrid_caract.getRowsNum();
            let iRowId_gri,iRowId;
            for(let n=1;n<cant_filas_n;n++){
                iRowId_gri = myGrid_caract.getRowId(n);
                data_n = myGrid_caract.getRowData(iRowId_gri);
                for(let i=1;i<cant_filas_n;i++){
                    iRowId = myGrid_caract.getRowId(i);
                    data = myGrid_caract.getRowData(iRowId);
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
                    myGrid_ensa.addRow(myGrid_ensa.uid(),[0,data.codmet,data.comet,data.met,data.codens,,,,,data.ens,data.um,data.tipens,data.obj,data.tec],1);
                }      
            } 
            cant_filas_n = myGrid_ensa.getRowsNum();
            let iRowId_gri,iRowId;
            for(let n=1;n<cant_filas_n;n++){
                iRowId_gri = myGrid_ensa.getRowId(n);
                data_n = myGrid_ensa.getRowData(iRowId_gri);
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
    if(grupo_prod==5||grupo_prod==1){
        sel  = myGrid_espvers.getRowData(myGrid_espvers.getSelectedRowId());        
    }else{
        sel  = myGrid_group.getRowData(myGrid_group.getSelectedRowId());
    }
    switch (id) {
        case 'cargarcmp':
            vercomplemento();
            break;    
        case 'eliminar':            
            let to_fila_data_num_gri = myGrid_cpto.getRowsNum();
            for(var i=0;i<to_fila_data_num_gri;i++){
                let iRowId_gri = myGrid_cpto.getRowId(i);
                if(iRowId_gri){
                    data = myGrid_cpto.getRowData(iRowId_gri);
                    if (data.chec == 1) {
                        myGrid_cpto.deleteRow(iRowId_gri);
                        i = i - 1;
                        to_fila_data_num_gri = to_fila_data_num_gri - 1;
                    }
                }
            }
            break;   
        case 'aceptar':                  
            let  cant_filas_guardar = 0,n=0;
            let data_grabar,cadena='';
            cant_filas_guardar = myGrid_cpto.getRowsNum();
            for (let i = 0; i < cant_filas_guardar; i++) {
                let iRowId = myGrid_cpto.getRowId(i);
                if(iRowId){
                    data_grabar = myGrid_cpto.getRowData(iRowId);
                    cadena += data_grabar.cod +'@';
                    n++;
                }
            }
            cant_filas_guardar = n;
            guardarcomplemento(sel.cod,version_esp,cadena,cant_filas_guardar);
            
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
                if (grupo_prod==1||grupo_prod==5){
                    if (desc.length>0&&form_prov.length>0&&cat_prod.length>0){
                        copiarespecificacion('ce',sel.cod,grupo_prod,sel.vers,'11',form_prov,desc,tipo_vers,cat_prod,'11');
                    }else{
                        dhtmlx.confirm("Debe llenar todos los campos", function (result) { });
                    }
                }else{
                    if(grupo_prod==4){
                        form_prov = '0';
                    }
                    if (desc.length>0&&form_prov.length>0){
                        copiarespecificacion('ce',sel.cod,grupo_prod,sel.vers,'11',form_prov,desc,tipo_vers,cat_prod,'11');
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
            cod = myFormdatos_inputvers.getItemValue('_et_cod');
            desc = myFormdatos_inputvers.getItemValue('_et_desc');   
            tipo_vers = myFormdatos_inputvers.isItemChecked('ep_tipo')?'I':'N';  
            obs = myFormdatos_inputvers.getItemValue('_et_mot');
            if (ind_pt=='S'&&tipo_vers=='I'){
                dhtmlx.confirm("Especificación vinculada con: "+message_pt, function (result) {
                });
            }else{
            if (desc.length>0){
                if (ind_grupo=='P'){                    
                    copiarespecificacion('cv',sel_grid.cod,grupo_prod,sel_grid.vers,sel_grid.cod,sel_grid.codprov,desc,tipo_vers,12,obs);
                }else{
                    copiarespecificacion('cv',sel.cod,grupo_prod,sel.vers,sel.cod,sel.codprov,desc,tipo_vers,12,obs);
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
            var obsv = myFormdatos_cosm.getItemValue('_et_historial');
            if(grupo_prod==1||grupo_prod==5){
                sel = myGrid_espvers.getRowData(myGrid_espvers.getSelectedRowId());
                guardarhistorial(sel.cod,sel.vers,obsv);
            }else{
                guardarhistorial(sel.cod,version_esp,obsv);
            };
            break;  
        default:
            null;
            break;
    }
};

toolbarOnptr  = async (id) => {
    switch (id) {
        case 'aprobar':            
            ptr = myGrid_patr.getSelectedRowId();
            if(ptr) {
                ptr = myGrid_patr.getRowData(myGrid_patr.getSelectedRowId());
                sel = myGrid_espvers.getRowData(myGrid_espvers.getSelectedRowId());
                var output = await IniciarFormularioSeguridad(280, mainLayout);
                if (output.result === 'S') {
                    aprobarPatron(sel.cod,sel.vers,ptr.orden,'Recibido');
                };
            }else{
                dhtmlx.confirm("Debe seleccionar un patrón", function (result) {
                });
            }      
            break;     
        case 'addptr':
            agregarpatron(0,0,0,'I');
            break;     
        case 'b_close':
            Wind_.window("wbuscar").close();
            break; 
        case 'eliminar':  
            ptr = myGrid_patr.getSelectedRowId();
            if(ptr) {
                ptr = myGrid_patr.getRowData(myGrid_patr.getSelectedRowId());
                sel = myGrid_espvers.getRowData(myGrid_espvers.getSelectedRowId());
                aprobarPatron(sel.cod,sel.vers,ptr.orden,'Obsoleto');
            }else{
                dhtmlx.confirm("Debe seleccionar un patrón", function (result) {
                });
            }      
            break; 
        case 'b_guardar':
            var obsv = myFormdatos_pat.getItemValue('_et_obs_pat');
            var patron = myFormdatos_pat.getItemValue('_et_tipo');
            var fecha = myFormdatos_pat.getItemValue('_et_fec_vig').toLocaleDateString().replace('/', '-');;
            sel = myGrid_espvers.getRowData(myGrid_espvers.getSelectedRowId());
            console.log(sel);
            if (accion_ptr=='U'){
                ptr = myGrid_patr.getRowData(myGrid_patr.getSelectedRowId());
                orden = ptr.orden;
            }else{orden=1;}
            guardarpatron(sel.cod,sel.vers,patron,obsv,fecha,orden,accion_ptr);
            break;  
        case 'b_desbloquear':
            var output = await IniciarFormularioSeguridad(281, mainLayout);
            if (output.result === 'S') {
                myFormdatos_pat.enableItem('_et_fec_vig');
            };
            break; 
        case 'editar':
            ptr = myGrid_patr.getSelectedRowId();
            if(ptr) {
                ptr = myGrid_patr.getRowData(myGrid_patr.getSelectedRowId());
                var output = await IniciarFormularioSeguridad(281, mainLayout);
                if (output.result === 'S') {
                    agregarpatron(ptr.co_tipo,ptr.fvig,ptr.obs,'U');
                };
            }else{
                dhtmlx.confirm("Debe seleccionar un patrón", function (result) {
                });
            }  
            break; 
        default:
            null;
            break;
    }
};

aprobarPatron = (espec,version,orden,accion) => {  
    params = {
        empresa: usrJson.empresa,
        usuario: usrJson.codigo,
        especificacion: espec,
        version: version,
        orden:orden,
        accion:accion
    };    
    dhtmlx.confirm("¿Está seguro?", function (result) {
        if (result === Boolean(true)) {
            $.post(BASE_URL + "PO010410/guardar-estado-patron", params, function (res) {
                if (res.state=='success'){  
                    dhtmlx.alert({
                        title: 'Correcto',
                        text: res.message
                    });             
                    cargarPatrones(espec,version); 
                } else {
                    dhtmlx.alert({
                        title: 'No se guardo el registro',
                        type: 'alert-error',
                        text: res.message
                    });

                }
            }, "json");
        }
    });
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
        case 'eliminar':            
            col  = myGrid_dcto.getSelectedRowId();
            if(col) {
                col_adj = myGrid_dcto.getRowData(myGrid_dcto.getSelectedRowId());
                eliminarDocumento(cod_esp,version_esp,col_adj.prod,col_adj.nom);  
            }else{
                dhtmlx.confirm("Debe seleccionar un archivo", function (result) {
                });
            }             
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
                if (data.chec == 1) {
                    myGrid_cpto.addRow(myGrid_cpto.uid(),[0,data.cod,data.desc],1);
                }      
            }     

            cant_filas_n = myGrid_cpto.getRowsNum();
            let iRowId_gri,iRowId;
            for(let n=1;n<cant_filas_n;n++){
                iRowId_gri = myGrid_cpto.getRowId(n);
                data_n = myGrid_cpto.getRowData(iRowId_gri);
                for(let i=1;i<cant_filas_n;i++){
                    iRowId = myGrid_cpto.getRowId(i);
                    data = myGrid_cpto.getRowData(iRowId);
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
        WinDocumentoViewer.attachURL(url.URL);
    } , 'json');  
    
};

subiradjunto = async (espec,vers,prod) => {
    WinContainer = new dhtmlXWindows();
    WinDocumentoViewer = WinContainer.createWindow('WinDocumentoViewer', 320, 0, 750, 600);
    WinDocumentoViewer.keepInViewport();
    WinDocumentoViewer.setText('Mostrando documento ');
    const params = {
        prod: prod,
        usuario: usrJson.codigo,
        cad_esp:espec+'_'+vers,
    };
    $.post(BASE_URL + 'PO010410/mostrar-subir-adjunto/', params, function (res) {
        const url = res.data.url_adj; 
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
 
cargarReport = async (esp,vers,cod,marc,sub,nom_report,grupo_prod,nom_prod) => {    
    WinContainer = new dhtmlXWindows();
    WinDocumentoViewer = WinContainer.createWindow('WinDocumentoViewer', 320, 0, 800, 600);
    WinDocumentoViewer.setModal(true);
    WinDocumentoViewer.center();    
    WinDocumentoViewer.keepInViewport();
    WinDocumentoViewer.setText('Mostrando documento ');
    if (grupo_prod==1||grupo_prod==5){
        WinDocumentoViewer.attachURL('/api/po010410/mostrar-reporte2/'+usrJson.empresa+'/'+usrJson.codigo+'/'+esp+'/'+vers+'/'+cod+'/'+marc+'/'+sub+'/'+nom_report+'/'+grupo_prod);
    }else{
        WinDocumentoViewer.attachURL('/api/po010410/mostrar-reporte/'+esp+'/'+vers+'/'+cod+'/'+marc+'/'+sub+'/'+nom_report+'/'+grupo_prod+'/'+nom_prod);
    }
};

cargardt1 = async (esp,vers,nom) => {
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
        if (tipo=='V'){
            myFormdatos_inputvers.setItemValue('_ep_num',co_espec.CO_ESPECIFICACION);  
            myFormdatos_inputvers.setItemValue('_ep_ver',1);  
        }else if(tipo=='NVO'){
            myFormespecf.setItemValue('ep_codigo',co_espec.CO_ESPECIFICACION);
            myFormespecf.setItemValue('ep_version',1);   
            myFormespecf.setItemValue('ep_estado','Por Aprobar');   
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

alertacodiseno = async (producto) => {  
    params = {
        producto: producto,
    };    
    $.post(BASE_URL + "PO010410/alerta-codiseno", params, function (res) {
        const result = res.data.esp_alert;

        if (result.ALERTA!='NO'){
            dhtmlx.alert({
                type: 'alert-error',
                text: result.ALERTA
            });}

    }, "json");
};