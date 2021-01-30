var grupo_prod,clase_grupo,tipo_bien,de_grupo,Winidc_,Windc_,mainLayout,myToolbardatos,tabbar,mainLayout_esp,myGrid_esp;
  
Inicio = () => {
    if (1==1){
        dhtmlx.alert({
            type: 'alert-error',
            text: 'No tienes acceso. Comunicarse con Sistemas'
        });
    }else{
    mainLayout = new dhtmlXLayoutObject(document.body, '1C'); 
    mainLayout.cells('a').hideHeader();
    mainLayout.cells('a').setHeight(60);
    myToolbardatos = mainLayout.cells('a').attachToolbar();
    myToolbardatos.setIconsPath('/assets/images/icons/');
    myToolbardatos.addButton('__detalle','right','Detalle',"ic-buskard.png",null);
    myToolbardatos.addButton('__print',null,'Imprimir',"print.png",null);
    myToolbardatos.addButton('__rev',null,'Revisar',"ic-buscar.png",null);
    myToolbardatos.addButton('__pass',null,'Aprobar',"ic-like.png",null);
    myToolbardatos.addButton('__fail',null,'Desaprobar',"ic-dislike.png",null);
    myToolbardatos.addButton('__inactive',null,'Anular',"ic-cancel-cd.png",null);
    // myToolbardatos.addButton('__pass',null,'Continuar Especificación',"ic-like.png.png",null);
    myToolbardatos.setAlign("left");
    myToolbardatos.setIconSize(32);
    myToolbardatos.attachEvent('onClick', onClickbar);
    tabbar = mainLayout.cells('a').attachTabbar();
    tabbar.addTab('__gran', 'GRANEL', null, null, true);
    tabbar.addTab('__prodterm', 'PROD.TERMINADO', null, null, true);
    tabbar.addTab('__matempaq', 'MATERIAL DE EMPAQUE', null, null, false);
    tabbar.addTab('__matpr', 'MATERIA PRIMA', null, null, false);
    tabbar.addTab('__otros', 'OTROS MATERIALES', null, null, false);
    tabbar.addTab('__descontinuados', 'ESPECIFICAIONES DESCONTINUADAS', null, null, false);
    tabbar.attachEvent ( "onSelect" , tabbarOnSelect);  
    // cargarEspec('__prodterm',4,2,10)    
    cargarEspec('__prodterm',4,2,10);
    }
}

onClickbar= async (id) => {    
    seleccione  = myGrid_esp.getRowData(myGrid_esp.getSelectedRowId());
    console.log(seleccione);
    switch (id) {
        case '__detalle':
            mostrardetalle();
            break;  
        case '__rev':
            aprobar(seleccione.cod,seleccione.codprov,seleccione.vers,'Revisada'); 
            break;                          
        case '__fail':  
            aprobar(seleccione.cod,seleccione.codprov,seleccione.vers,'Observada');      
        break;
        case '__inactive':     
            aprobar(seleccione.cod,seleccione.codprov,seleccione.vers,'Obsoleta');  
            break;
        case '__pass':   
            aprobar(seleccione.cod,seleccione.codprov,seleccione.vers,'Vigente');   
            break;
        default:
            null;
            break;
    }
};

tabbarOnSelect= async (id) => {
    switch (id) {
        case '__gran':        
            grupo_prod = 2;
            clase_grupo = 2;
            tipo_bien = 10; 
            de_grupo = '__gran';     
            cargarEspec(de_grupo,grupo_prod,clase_grupo,tipo_bien);
            break;   
        case '__prodterm':
            grupo_prod = 4;
            clase_grupo = 2;
            tipo_bien = 10; 
            de_grupo = '__prodterm';  
            cargarEspec(de_grupo,grupo_prod,clase_grupo,tipo_bien);
            break;
        case '__semi':
            cargarEspec('__semi',3,0,0);
            break;
        case '__prodenv':
            cargarEspec('__prodenv',4,2,9);
            break;
        case '__matempaq':
            grupo_prod = 5;
            clase_grupo = 0;
            tipo_bien = 0; 
            de_grupo = '__matempaq';  
            cargarEspec(de_grupo,grupo_prod,clase_grupo,tipo_bien);
            break;
        case '__otros':
            cargarEspec('__otros',6,0,0);
            break;
        case '__matpr':     
            grupo_prod = 1;
            clase_grupo = 0;
            tipo_bien = 0; 
            de_grupo = '__matpr';  
            cargarEspec(de_grupo,grupo_prod,clase_grupo,tipo_bien);
            break;  
        case '__descontinuados':
            cargarEspecdescontinuada('__descontinuados');
            break;
        default:
            null;
            break;
    }
};


cargarEspec = (tab,grupo) => {       
    mainLayout_esp = tabbar.cells(tab).attachLayout('1C');   
    myGrid_esp = mainLayout_esp.cells('a').attachGrid();
    mainLayout_esp.cells('a').hideHeader();
    myGrid_esp.setHeader('Descripción,Cod.Espec.,Ver.,Estado,F.Creación,F.Revisado,F.Aprobado,Creado por:,Revisado por:,Aprobado por:,Proveedor,Cod.Proveedor');
    myGrid_esp.setInitWidths('400,100,100,100,100,100,100,200,200,200,100,0');
    myGrid_esp.setColAlign('left,left,left,left,left,left,left,left,left,left,left,left');
    myGrid_esp.setColTypes('ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro'); 
    myGrid_esp.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter");     
    myGrid_esp.setColumnIds('desc,cod,vers,vig,fcrea,frev,fapr,crea,rev,aprob,prov,codprov');  
    myGrid_esp.init();    
    myGrid_esp.clearAll(); 
    mainLayout_esp.cells('a').progressOn();
    console.log('emp');
    console.log(usrJson.empresa);
    myGrid_esp.load( BASE_URL + 'PO010411/mostrar-especificacion/'+usrJson.empresa+'/'+grupo+'/'+'N').then(function (text) {
        mainLayout_esp.cells('a').progressOff();
        myToolbardatos.enableItem('__fail');
        myToolbardatos.enableItem('__rev');
        myToolbardatos.enableItem('__inactive');
    });
};

cargarEspecdescontinuada = (tab) => {       
    mainLayout_esp = tabbar.cells(tab).attachLayout('1C');   
    myGrid_esp = mainLayout_esp.cells('a').attachGrid();
    mainLayout_esp.cells('a').hideHeader();
    myGrid_esp.setHeader('Descripción,Cod.Espec.,Ver.,Estado,F.Creación,F.Revisado,F.Aprobado,Creado por:,Revisado por:,Aprobado por:,Proveedor,Cod.Proveedor');
    myGrid_esp.setInitWidths('400,100,100,100,100,100,100,200,200,200,100,0');
    myGrid_esp.setColAlign('left,left,left,left,left,left,left,left,left,left,left,left');
    myGrid_esp.setColTypes('ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro'); 
    myGrid_esp.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter");     
    myGrid_esp.setColumnIds('desc,cod,vers,vig,fcrea,frev,fapr,crea,rev,aprob,prov,codprov');  
    myGrid_esp.init();    
    myGrid_esp.clearAll(); 
    mainLayout_esp.cells('a').progressOn();
    console.log('empqq');
    console.log(usrJson.empresa);
    myGrid_esp.load( BASE_URL + 'PO010411/mostrar-especificacion-descontinuada/'+usrJson.empresa).then(function (text) {
        mainLayout_esp.cells('a').progressOff();
        myToolbardatos.disableItem('__fail');
        myToolbardatos.disableItem('__rev');
        myToolbardatos.disableItem('__inactive');
    });
};

mostrardetalle = async () => {
    Windc_ = new dhtmlXWindows();
    Winidc_ = Windc_.createWindow("wdet", 0, 0, 750, 500);
    Winidc_.setText("Detalle Especificación de Análisis - ");
    Windc_.window("wdet").setModal(true);
    // Windc_.window("wdet").denyResize();
    Windc_.window("wdet").center();    
    tabbar_det = Winidc_.attachTabbar();
    tabbar_det.addTab('presp', 'Productos Espec.', null, null, true);
    tabbar_det.addTab('crt', 'Características', null, null, true);
    tabbar_det.addTab('esy', 'Ensayos', null, null, false);
    tabbar_det.addTab('cpto', 'Complementos', null, null, false);
    tabbar_det.addTab('hst', 'Historial', null, null, false);
    tabbar_det.addTab('arc', 'Archivos Adjuntos', null, null, false);
    tabbar_det.attachEvent ( "onSelect" , detaOnSelect);
    sel  = myGrid_esp.getRowData(myGrid_esp.getSelectedRowId());
    cargarCaract(sel.cod,sel.vers);
};

detaOnSelect= async (id) => {
    sel  = myGrid_esp.getRowData(myGrid_esp.getSelectedRowId());
    console.log(sel);
    switch (id) {
        case 'presp':
            cargarespecProd(sel.cod,sel.vers);
            break;
        case 'crt':     
            cargarCaract(sel.cod,sel.vers);   
            break;
        case 'esy':     
            cargarEnsayo(sel.cod,sel.vers);  
            break;
        case 'cpto':     
            cargarCompto(sel.cod,sel.vers); 
            break;        
        case 'hst':     
            cargarHistorial(sel.cod,sel.vers); 
            break; 
        case 'arc':     
            cargarDocumento(sel.cod,sel.vers); 
            break;          
        default:
            null;
            break;
    }
};

cargarespecProd = (espec,version) => {  
    mainLayout_esprod = tabbar_det.cells('presp').attachLayout('1C');  
    mainLayout_esprod.cells('a').hideHeader();  
    myGrid_esprod = mainLayout_esprod.cells('a').attachGrid();
    myGrid_esprod.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    myGrid_esprod.setHeader(',Código,Descripción,Marca,Submarca');    
    myGrid_esprod.setInitWidths('50,100,700,200,200');
    myGrid_esprod.setColumnHidden(0,true);
    myGrid_esprod.setColAlign('left,left,left,left,left');
    myGrid_esprod.setColTypes('ch,ro,ro,ro,ro'); 
    myGrid_esprod.setColumnIds('chec,cod,desc,marc,subm');   
    myGrid_esprod.init();      
    myGrid_esprod.clearAll(); 
    mainLayout_esprod.cells('a').progressOn();
    myGrid_esprod.load( BASE_URL + 'PO010410/mostrar-producto-por-espec/'+usrJson.empresa+'/'+espec+'/'+version).then(function (text) {
        mainLayout_esprod.cells('a').progressOff();
    });
};


cargarCaract = (espec,version) => {  
    mainLayout_caract = tabbar_det.cells('crt').attachLayout('2E');  
    myFormdcaract = mainLayout_caract.cells('a').attachForm(form_caract);
    //CARGANDO PRIMERA PARTE DE CARACTERISTICAS
    const params = {
        empresa: usrJson.empresa,
        especificacion : espec,
        version : version
    };
    console.log(params);
    $.post(BASE_URL + 'PO010410/mostrar-caract-general/', params, function (res) {
        const caract = res.data.caract; 
        myFormdcaract.setItemValue('_ep_car_gen',caract.DE_CARACTERIS_GENERALES);
    } , 'json');
    mainLayout_caract.cells('a').hideHeader();  
    mainLayout_caract.cells('b').hideHeader();  
    myGrid_caract = mainLayout_caract.cells('b').attachGrid();
    myGrid_caract.setHeader(',,Característica,Detalle');    
    myGrid_caract.setInitWidths('0,0,200,200');
    myGrid_caract.setColAlign('left,left,left,left');
    myGrid_caract.setColTypes('ro,ro,ro,ro'); 
    myGrid_caract.setColumnHidden(0,true);
    myGrid_caract.setColumnHidden(1,true);
    myGrid_caract.init();      
    //CARGANDO SEGUNDA PARTE DE CARACTERISTICAS
    myGrid_caract.clearAll(); 
    mainLayout_caract.cells('b').progressOn();
    myGrid_caract.load( BASE_URL + 'PO010410/mostrar-caract-detalle/'+usrJson.empresa+'/'+espec+'/'+version).then(function (text) {
        mainLayout_caract.cells('b').progressOff();
    });
};

cargarEnsayo = (espec,version) => {  
    mainLayout_ensa = tabbar_det.cells('esy').attachLayout('1C');  
    mainLayout_ensa.cells('a').hideHeader();  
    myGrid_ensa = mainLayout_ensa.cells('a').attachGrid();    
    myGrid_ensa.setHeader(',Cod.met,Co.Método,Método,Co.Ensayo,Condiciones,Especificaciones,Especificaciones(Inglés),Rango/De,Rangos/A,Tipo de Ensayo,Objetivos de la Prueba');    
    myGrid_ensa.setInitWidths('0,0,70,200,80,200,400,400,70,70,150,300');
    myGrid_ensa.setColAlign('left,center,left,left,left,left,left,left,left,left,left.left');
    myGrid_ensa.setColTypes('ro,ro,ro,ro,ro,ro,ed,ed,ed,ed,ro,ro'); 
    myGrid_ensa.setColumnHidden(0,true);
    myGrid_ensa.setColumnHidden(1,true);
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
    myGrid_cpto = mainLayout_cpto.cells('a').attachGrid();
    myGrid_cpto.setHeader('Código,Material');    
    myGrid_cpto.setInitWidths('200,600');
    myGrid_cpto.setColAlign('left,left');
    myGrid_cpto.setColTypes('ro,ro'); 
    myGrid_cpto.init();      
    myGrid_cpto.clearAll(); 
    mainLayout_cpto.cells('a').progressOn();
    myGrid_cpto.load( BASE_URL + 'PO010410/mostrar-complemento/'+usrJson.empresa+'/'+espec+'/'+version).then(function (text) {
        mainLayout_cpto.cells('a').progressOff();
    });
};

cargarHistorial = (espec,version) => {  
    mainLayout_hist = tabbar_det.cells('hst').attachLayout('1C');  
    mainLayout_hist.cells('a').hideHeader();  
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

toolbarOnadj  = async (id) => {
    switch (id) {
        case 'verdcto':
            sel_adj  = myGrid_dcto.getRowData(myGrid_dcto.getSelectedRowId());
            verurladjunto(sel_adj.prod,sel_adj.nom,sel_adj.ind);
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

aprobar = (especificacion,proveedor,version,vigencia) => {
    params = {
        empresa: usrJson.empresa,
        usuario: usrJson.codigo,
        especificacion: especificacion,
        proveedor: proveedor,
        version: version,
        vigencia: vigencia
    };    
    dhtmlx.confirm("¿Está seguro?", function (result) {
        if (result === Boolean(true)) {
            $.post(BASE_URL + "PO010411/aprobar-especificacion", params, function (res) {
                console.log(res);
                if (res.state=='success'){
                    Swal.fire('Bien!', res.message, 'success');
                    cargarEspec(de_grupo,grupo_prod,clase_grupo,tipo_bien);
                } else {
                    Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se guardo el registro :' + res.message });
                }
            }, "json");
        }
    });
}