var codigo,nombre, esp,desc_esp,cod_esp,version_esp,cod_form,Winidh_,Windh_,Winidt_,Windt_,Winidc_,Windc_,myToolbardatos_espec,myToolbardatos_formula,myGrid_historial,mainLayout_historial,buscar,flag,myGrid_acondic,myGrid_envasado,mainLayout_envasado,mainLayout_acondic,tabbar_formdet,tabbar_form,myFormdformu,mainLayoutform,mainLayout_aprform,tabbar,permiso_cataedit,html_general,myFormdatos_nso_esp,mainLayout_especificacion,myGrid_nso,myToolbar_nso,myGrid_ver,Winid_,Wind_,myToolbar_ver,tipo_doc,mainLayout_formula,tabbar,myToolbardatos_detalle,maingrid_search,myFormdatos_search,mainLayout_load,myToolbardatos_search,mainLayout_search,myGrid_lista,Wind_,maingrid,myFormdatos_prod,mainLayout_product,myFormdatos,myToolbardatos_register,mainLayout,myForm,myToolbardatos,mainLayout_register;

let WinDocumentoViewer;
permiso_cataedit = 'E';
Inicio = () => {
    mainLayout = tabbarinicio.cells("__register").attachLayout('1C');
    mainLayout_register = mainLayout.cells('a').attachLayout('3J');
    // mainLayout = tabbarinicio.tabs("__register").attachLayout('2U');
    // mainLayout_register.cells('a').hideHeader();
    // mainLayout_register.cells('b').hideHeader();
    // mainLayout_register.cells('c').hideHeader();
    mainLayout_register.cells('b').setCollapsedText('<span style="color:#00796b;">Ver Notificacion Sanitaria</span>');
    mainLayout_register.cells('b').collapse();
    mainLayout_register.cells('a').setText('');
    mainLayout_register.cells('b').setText('');
    mainLayout_register.cells('c').setText('Ver NSOC');
    mainLayout_register.cells('a').attachHTMLString('<div class="div-empty div-regsant"></div>');
    myToolbardatos_register = mainLayout_register.cells('a').attachToolbar();
    myToolbardatos_register.setIconsPath('/assets/images/icons/');
    myToolbardatos_register.addButton('__mostnso',null,'Mostrar NSOC',"ic-acept.png","");
    myToolbardatos_register.addButton('__mostesp',null,'Mostrar Especificaciones',"ic-noacept.png","");
    myToolbardatos_register.addButton('__nuevo',null,'Nuevo',"ic-add2.png","");
    // myToolbardatos_register.addButton('__save',null,'Guardar',"ic-save.png","");
    myToolbardatos_register.addButton('__nsoc',null,'Ver Registros NSOC',"ic-look.png","");
    myToolbardatos_register.addButton('__cosm',null,'Forma Cosmética',"ic-form.png","");
    myToolbardatos_register.addButton('__notif',null,'Notificaciones',"ic-calendar.png","");
    myToolbardatos_register.attachEvent('onClick', OnClicktoolbar);
    myToolbardatos_register.setIconSize(32);    
    maingrid = mainLayout_register.cells('a').attachGrid();     
    maingrid.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    maingrid.setHeader('NOMBRE ESPECIFICACIÓN, COD.ESPEC,VERSION,VIGENCIA,FEC.CREACION,FEC.REVISA,FE.APRUEBA,NOM.CREACION,NOM.REVISA,NOM.APRUEBA,NOM.PROVEEDOR');
    maingrid.setInitWidths('700,100,100,0,150,150,0,300,300,0,0');
    maingrid.setColAlign('left,center,center,center,center,center,center,left,left,left,left');
    maingrid.setColumnIds("despec,ccespec,version"); 
    maingrid.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter"); 
    maingrid.init();     
    mainLayout_register.cells('a').progressOn();  
    maingrid.load( BASE_URL + 'PO010208/mostrar-especificacion/'+usrJson.empresa).then(function (text) {
        mainLayout_register.cells('a').progressOff();
    });    
    mainLayout_register.cells('c').setHeight(200);
    tabbar_det = mainLayout_register.cells('c').attachTabbar();
    tabbar_det.addTab('presp', 'Productos Espec.', null, null, true);
    tabbar_det.addTab('crt', 'Características', null, null, false);
    tabbar_det.addTab('esy', 'Ensayos', null, null, false);
    // tabbar_det.addTab('cpto', 'Complementos', null, null, false);
    // tabbar_det.addTab('hst', 'Historial', null, null, false);
    tabbar_det.addTab('arc', 'Archivos Adjuntos', null, null, false);
    // tabbar_det.addTab('prod', 'Productos/SubProductos asociados', null, null, false);
    tabbar_det.attachEvent ( "onSelect" , detaOnSelect);     
    maingrid.attachEvent("onRowSelect", function (id, ind) {
        data = maingrid.getRowData(maingrid.getSelectedRowId())     
        version_esp = data.version;
        cod_esp = data.ccespec;
        desc_esp = data.despec;
        cargarespecProd(cod_esp,version_esp);
     });
},

detaOnSelect= async (id) => {
    if(version_esp>0){
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

mostrarNsoc = () =>{
    maingrid = mainLayout_register.cells('a').attachGrid();     
    maingrid.setHeader('Nro NSO,Descripción,Estado,Inicio Vigenia, Fin Vigencia,TVU Comercial, TVU Producción,Nro Registro,Forma Cosmética,Cod.Espec,Descripción');
    maingrid.setInitWidthsP('30,30,20,20,20,20,20,30,0,30,50');
    maingrid.setColTypes('ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro');
    maingrid.setColAlign("left,left,center,center,center,center,center,left,left,left,left");
    maingrid.setColumnIds("cod_nso,desc,estado,fec_ini,fec_fin,com,prod,nreg,fcos,esp,desp");
    maingrid.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter");
    maingrid.init();
    maingrid.clearAll();
    mainLayout_register.cells('a').progressOn();
    maingrid.load( BASE_URL + 'PO010208/mostrar-nso/'+ '|').then(function (text) {
        mainLayout_register.cells('a').progressOff();
    });
    maingrid.attachEvent("onRowSelect", function (id, ind) {
        data = maingrid.getRowData(maingrid.getSelectedRowId())     
        version_esp = 1;
        cod_esp = data.esp;
        cargarespecProd(cod_esp,version_esp);
        data = maingrid.getRowData(maingrid.getSelectedRowId())   
        console.log(data);
        codigo = data.cod_nso;
        nombre = data.desc;
        estado = data.estado;
        fecha_inicio= data.fec_ini;
        fecha_fin= data.fec_fin;        
        nregistro = data.nreg;
        fcos = data.fcos;
        esp = data.esp;
        deesp = data.desp;
        com = data.com;
        prod = data.prod;
        myFormdatos_nso = mainLayout_detalle_sub.cells("a").attachForm(f_rev_nso);
        myFormdatos_nso.setItemValue('_drt_nrosoc',codigo);
        myFormdatos_nso.setItemValue('_drt_nombre',nombre);
        myFormdatos_nso.setItemValue('_drt_estado',estado);
        myFormdatos_nso.setItemValue('_drt_fechadesde',fecha_inicio);
        myFormdatos_nso.setItemValue('_drt_fechahasta',fecha_fin);
        myFormdatos_nso.setItemValue('_drt_nroregistro',nregistro);
        myFormdatos_nso.setItemValue('_drt_formacosmetica',fcos);
        myFormdatos_nso.setItemValue('_drt_esp',esp);
        myFormdatos_nso.setItemValue('_drt_desp',deesp);
        myFormdatos_nso.setItemValue('_drt_tuv_com',com);
        myFormdatos_nso.setItemValue('_drt_tuv_prod',prod);
        
     });
}
Graficos = () => {
    mainLayout_search = tabbarinicio.cells("__graf").attachLayout('1C');  
    mainLayout_search.cells('a').attachHTMLString('<figure class="highcharts-figure"><div id="container"></div><p class="highcharts-description"></p></figure>');
    
    const params = {
    };
    $.post(BASE_URL + 'PO010208/mostrar-report-anio/', params, function (res) {
        const rep = res.data.rep; 
        console.log(rep.ANIO);
        // myFormdcaract.setItemValue('_ep_car_gen',caract.DE_CARACTERIS_GENERALES);
        // myFormdcaract.setItemValue('_ep_car_alm',caract.DE_CONDIC_ALMACENAMIENTO);
    } , 'json');  
    //grafico del modal
    $('#container').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Registros NSOC'
        },
        subtitle: {
            text: 'Corporación Life'
        },
        xAxis: {
            categories: [
                'Ene',
                'Feb',
                'Mar',
                'Abr',
                'May',
                'Jun',
                'Jul',
                'Ago',
                'Sep',
                'Oct',
                'Nov',
                'Dic'
            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} nsoc</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: '2015',
            data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5]
    
        }, {
            name: '2016',
            data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3]
    
        }, {
            name: '2017',
            data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]
    
        }, {
            name: '2018',
            data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]
    
        }]
    });
}
Buscar = () => { 
    // mainLayout_search = tabbarinicio.cells("__search").attachLayout('1C');  
    mainLayout_detalle_sub = mainLayout_register.cells('b').attachLayout('2E');    
    // mainLayout_load = mainLayout_search.cells('a').attachLayout('3J');
    // mainLayout_detalle_sub = mainLayout_load.cells('b').attachLayout('2E');
    mainLayout_detalle_sub.cells('a').setText('Detalle NSO');
    myFormdatos_nso = mainLayout_detalle_sub.cells("a").attachForm(f_rev_nso);
    // mainLayout_load.cells('c').setText('Notificaciones registradas');
    // mainLayout_detalle_sub.cells('a').setText('Detalle');
    // myFormdatos_search = mainLayout_load.cells('a').attachForm(f_consulta_notif);
    // mainLayout_load.cells('a').setHeight(100);
    // mainLayout_load.cells('a').setWidth(600);
    // maingrid_search = mainLayout_load.cells('c').attachGrid(); 
    // mainLayout_load.cells('c').setWidth(900);
    // maingrid_search.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    // maingrid_search.setHeader('CÓDIGO NSO,NOMBRE PRODUCTO,ESTADO,FE_INICIO_VIGENCIA,FE_TERMINO_VIGENCIA,TVU COMERCIAL,TVU PRODUCCION,NRO REGISTRO,CO_FORMA_COSMETICA,COD.ESPECIFICACIÓN,DESCRIPCION');
    // maingrid_search.setInitWidths('200,450,120,120,120,120,120,0,0,100,300');
    // maingrid_search.setColAlign('left,left,left,left,left,left,left,left,left,left,left,left'); 
    // maingrid_search.setColumnIds("cod_nso,desc,estado,fec_ini,fec_fin,com,prod,nreg,fcos,esp,desp");   
    // maingrid_search.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,,,#text_filter,#text_filter");
    // maingrid_search.init();  
    myToolbardatos_detalle = mainLayout_detalle_sub.cells('a').attachToolbar();
    mainLayout_detalle_sub.cells('b').hideHeader();
    mainLayout_detalle_sub.cells('b').setHeight(35);
    tabbar = mainLayout_detalle_sub.cells('b').attachTabbar();
    tabbar.addTab('s_formula', 'FÓRMULA', null, null, true);
    tabbar.addTab('s_especificaciones', 'ESPECIFICACIONES', null, null, false);
    tabbar.addTab('s_conreque', 'MATERIAL DE ENVASE', null, null, false);
    tabbar.addTab('s_revdevol', 'ROTULADO', null, null, false);  
    tabbar. attachEvent ( "onSelect" , doOnSelect ); 
    myToolbardatos_detalle.setIconsPath('/assets/images/icons/');
    // myToolbardatos_detalle.addButton('ver',null,'<b>Ver lista</b>',"ic-look.png","");  
    myToolbardatos_detalle.addButton('file',null,'<b>Ver documentos</b>',"ic-file.png",""); 
    myToolbardatos_detalle.addButton('__save',null,'Editar',"ic-edit2.png",""); 
    myToolbardatos_detalle.addButton('__save',null,'Guardar',"ic-save.png","");
    myToolbardatos_detalle.attachEvent('onClick', detalleOnClick);       
    myToolbardatos_detalle.setIconSize(32);    
    WinContainer = new dhtmlXWindows();
    // myFormdatos_search.attachEvent("onButtonClick", function (id_ind){
    //     buscar = myFormdatos_search.getItemValue('_drt_buscarnso').length>0 ? myFormdatos_search.getItemValue('_drt_buscarnso') : '|';
    //     cargarnso(buscar);
    // });
    var html = "";  
    html+='    <div class="form-group row mb-2">'
    html+='        <div class="col-sm-10 offset-lg-2">'
    html+='        <br>&nbsp&nbsp<button type="button" id="btn-loadfile" class="btnver btnbtnver-labeled btn-loadfile"><span class="btnver-label"><i class="fas fa-eye"></i></span>Ver documento</button>'
    // html+='            <a id="btn-loadfile" href="#" class="btn btn-sm btn-primary disabled"><i class="fa fa-upload"></i>Ver documento</a>'
    html+='        </div>'
    html+='   <div class="form-group row mb-2">'
    html+='   <br><a style="font: 400 15px Arial;">&nbsp&nbsp<i>Adjunta un documento<i><a>'
    html+='   </div>'  
    html+='   <div class="form-group row mb-2">'
    html+='   <input id="form-tipodoc" style="display: none;" class="col-sm-2 col-form-label" value ="?">'
    html+='   </div>'  
    html+='   <div class="form-group row mb-2">'
    html+='   &nbsp<input id="form-nsoc" style="display: none;" class="col-sm-2 col-form-label" value ="nsoc|">'
    html+='   </div>' 
    html+=' <div class="form-group row mb-2"><label for="form-archivos" class="col-sm-2 subir"><span class="btn-label2"><i class="fas fa-hand-pointer txtrblack"></i></span>Seleccionar archivo</label>&nbsp&nbsp&nbsp&nbsp&nbsp'
    html+='        &nbsp<button type="button" id="btn-upload" class="btn btn-labeled btn-upload"><span class="btn-label"><i class="fas fa-cloud-upload-alt"></i></span> Subir archivo</button>'
    html+='        <div class="col-sm-10">'
    html+='            <div class="custom-file">'
    html+='                <input type="file" style="display: none;" class="subir" id="form-archivos" accept="application/pdf" >'
    // html+='                &nbsp<label class="custom-file-label" for="form-archivos" data-browse="Buscar">No ha seleccionado archivos para subir</label>'
    html+='            </div>'
    html+='        </div>'
    html+='    </div>'
    html+='    <div class="form-group row mb-0">'
    html+='        <div class="col-sm-10 offset-lg-2">'
    html+='            <div  id="doc-container"></div>'
    html+='        </div>'
    html+='   </div>'
    html+='    </div> <script>'
    html+='            $(_ => {'
    html+='            console.log("sss");'
    html+='            $("#btn-upload").on("click", SubirArchivos);'
    html+='            $("#btn-loadfile").on("click", VerArchivo);'
    html+='            $("#form-archivos").on("change", SeleccionarArchivos);'
    html+='        }); </script>'
    html_general = html;
    // maingrid_search.attachEvent("onRowSelect", function (id, ind) {  
    //     mainLayout_detalle_sub.cells('b').setText("");
    //     mainLayout_detalle_sub.cells('b').collapse();
    //     data = maingrid_search.getRowData(maingrid_search.getSelectedRowId())   
    //     console.log(data);
    //     codigo = data.cod_nso;
    //     nombre = data.desc;
    //     estado = data.estado;
    //     fecha_inicio= data.fec_ini;
    //     fecha_fin= data.fec_fin;        
    //     nregistro = data.nreg;
    //     fcos = data.fcos;
    //     esp = data.esp;
    //     deesp = data.desp;
    //     com = data.com;
    //     prod = data.prod;
    //     myFormdatos_nso = mainLayout_detalle_sub.cells("a").attachForm(f_rev_nso);
    //     myFormdatos_nso.setItemValue('_drt_nrosoc',codigo);
    //     myFormdatos_nso.setItemValue('_drt_nombre',nombre);
    //     myFormdatos_nso.setItemValue('_drt_estado',estado);
    //     myFormdatos_nso.setItemValue('_drt_fechadesde',fecha_inicio);
    //     myFormdatos_nso.setItemValue('_drt_fechahasta',fecha_fin);
    //     myFormdatos_nso.setItemValue('_drt_nroregistro',nregistro);
    //     myFormdatos_nso.setItemValue('_drt_formacosmetica',fcos);
    //     myFormdatos_nso.setItemValue('_drt_esp',esp);
    //     myFormdatos_nso.setItemValue('_drt_desp',deesp);
    //     myFormdatos_nso.setItemValue('_drt_tuv_com',com);
    //     myFormdatos_nso.setItemValue('_drt_tuv_prod',prod);
    //     tabbar = mainLayout_detalle_sub.cells('b').attachTabbar();
    //     tabbar.addTab('s_formula', 'FÓRMULA', null, null, true);
    //     tabbar.addTab('s_especificaciones', 'ESPECIFICACIONES', null, null, false);
    //     tabbar.addTab('s_conreque', 'MATERIAL DE ENVASE', null, null, false);
    //     tabbar.addTab('s_revdevol', 'ROTULADO', null, null, false);  
    //     tabbar. attachEvent ( "onSelect" , doOnSelect ); 
    //     mainLayout_formula= tabbar.cells("s_formula").attachLayout('1C');
    //     mainLayout_especificacion= tabbar.cells("s_especificaciones").attachLayout('1C'); 
    //     var nso = myFormdatos_nso.getItemValue('_drt_nrosoc');
    //     // html = html.replace('?','FORMULA');
    //     // html = html.replace('nsoc|',nso).replace('?','FORMULA');
    //     myFormdatos_nso_det = mainLayout_formula.cells("a").attachHTMLString(html_general.replace('nsoc|',nso).replace('?','FORMULA'));
    //     mainLayout_formula.cells('a').setText('Archivos');
    //     myFormdatos_nso_esp = mainLayout_especificacion.cells("a").attachHTMLString(html_general.replace('nsoc|',nso).replace('?','ESPECIFICACIONES'));  
    //     mainLayout_especificacion.cells('a').setText('Archivos');
    // });

},

aprobarFormula = () => {
    mainLayout_aprform = tabbarinicio.cells("__formapr").attachLayout('1C');
    mainLayoutform = mainLayout_aprform.cells('a').attachLayout('2E');
    mainLayoutform.cells('a').hideHeader();
    mainLayoutform.cells('a').setHeight(60);
    myFormdformu = mainLayoutform.cells('a').attachForm(f_filtro_formula);
    myToolbardatos_formula = mainLayoutform.cells('b').attachToolbar();
    myToolbardatos_formula.setIconsPath('/assets/images/icons/');
    myToolbardatos_formula.addButton('__comp',null,'Componentes',"ic-doc.png",null);
    myToolbardatos_formula.addButton('__traz',null,'Trazabilidad',"ic-enfocar.png",null);
    myToolbardatos_formula.addButton('__hist',null,'Historial',"ic-historial.png",null);
    myToolbardatos_formula.addButton('__pass',null,'Aprobar',"ic-like.png",null);
    myToolbardatos_formula.addButton('__fail',null,'Rechazar',"ic-dislike.png",null);
    myToolbardatos_formula.addButton('__inactive',null,'Dar de baja',"ic-cancel-cd.png",null);
    myToolbardatos_formula.setAlign("left");
    myToolbardatos_formula.setIconSize(32);
    myToolbardatos_formula.attachEvent('onClick', onClicktoolbarform);
    tabbar_form = mainLayoutform.cells('b').attachTabbar();
    tabbar_form.addTab('__fabri', 'Fabricación', null, null, true);
    tabbar_form.addTab('__envasado', 'Envasado', null, null, false);
    tabbar_form.addTab('__acondic', 'Acondicionado', null, null, false);
    tabbar_form.attachEvent ( "onSelect" , formulaOnSelect);  
    cargarformula('__fabri','-',1,'N'); 
    myFormdformu.attachEvent("onChange", function (id_ind){ 
        myFormdformu.isItemChecked('_ch_todo') ? myFormdformu.disableItem('_ch_porap') : myFormdformu.enableItem('_ch_porap'); 
        myFormdformu.isItemChecked('_ch_porap') ? myFormdformu.disableItem('_ch_todo') : myFormdformu.enableItem('_ch_todo'); 
    });
    myFormdformu.attachEvent("onButtonClick", function (id_ind){
        buscar = myFormdformu.getItemValue('_fr_buscar').length>0 ? myFormdformu.getItemValue('_fr_buscar').toUpperCase() : '-';
        flag = myFormdformu.isItemChecked('_ch_todo')?'S':'N';
        console.log(flag);
        cargarformula('__fabri',buscar,1,flag);         
    });    
},

cargarventanaComp = async (formula,codigo,desc) => {
    Windc_ = new dhtmlXWindows();
    Winidc_ = Windc_.createWindow("wcomp", 0, 0, 800, 500);
    Winidc_.setText("Componentes - Producto: ("+codigo+") "+desc);
    Windc_.window("wcomp").setModal(true);
    Windc_.window("wcomp").denyResize();
    Windc_.window("wcomp").center();
    myGrid_componentes = Winidc_.attachGrid();
    myGrid_componentes.setHeader('Cod.Producto,Descripción,Cant.,UM,Cod.Integral,Estado');
    myGrid_componentes.setInitWidths('150,350,100,100,100,100');
    myGrid_componentes.setColAlign('left,left,left,left,left,left');
    myGrid_componentes.setColTypes('ro,ro,ro,ro,ro,ro'); 
    myGrid_componentes.init();     
    myGrid_componentes.clearAll(); 
    Windc_.window("wcomp").progressOn();
    myGrid_componentes.load( BASE_URL + 'PO010208/mostrar-detalle-form-componente/'+usrJson.empresa+'/'+formula).then(function (text) {
        Windc_.window('wcomp').progressOff();
    });   
};

cargarventanaTraz = async (codigo,desc) => {
    Windt_ = new dhtmlXWindows();
    Winidt_ = Windt_.createWindow("wtraz", 0, 0, 800, 500);
    Winidt_.setText("Trazabilidad - Producto: ("+codigo+") "+desc);
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
    myGrid_trazab.load( BASE_URL + 'PO010208/mostrar-detalle-form-trazab/'+usrJson.empresa+'/'+codigo).then(function (text) {
        Windt_.window('wtraz').progressOff();
    });  
};

cargarventanaHist = async (formula,codigo,desc) => {
    Windh_ = new dhtmlXWindows();
    Winidh_ = Windh_.createWindow("whist", 0, 0, 800, 500);
    Winidh_.setText("Historial - Producto: ("+codigo+") "+desc);
    Windh_.window("whist").setModal(true);
    Windh_.window("whist").denyResize();
    Windh_.window("whist").center();
    myGrid_historial = Winidh_.attachGrid();
    myGrid_historial.setHeader('Fecha,Ver.,Descripción de los cambios,Usuarios');
    myGrid_historial.setInitWidths('100,100,300,100');
    myGrid_historial.setColAlign('left,left,left,left');
    myGrid_historial.setColTypes('ro,ro,ro,ro'); 
    myGrid_historial.init(); 
    myGrid_historial.clearAll(); 
    Windh_.window("whist").progressOn();
    myGrid_historial.load( BASE_URL + 'PO010208/mostrar-historial/'+usrJson.empresa+'/'+formula).then(function (text) {    
        Windh_.window('whist').progressOff();
    });  
};

doOnSelect= async (id) => {
    var nso = myFormdatos_nso.getItemValue('_drt_nrosoc');
    switch (id) {
        case 's_formula':      
                myFormdatos_nso_esp = mainLayout_especificacion.cells("a").attachHTMLString("");    
                mainLayout_formula= tabbar.cells("s_formula").attachLayout('1C'); 
                myFormdatos_nso_det = mainLayout_formula.cells("a").attachHTMLString(html_general.replace('nsoc|',nso).replace('?','FORMULA'));
                mainLayout_formula.cells('a').setText('Archivos');
            break;
        case 's_especificaciones':
                myFormdatos_nso_det = mainLayout_formula.cells("a").attachHTMLString("");
                mainLayout_especificacion= tabbar.cells("s_especificaciones").attachLayout('1C'); 
                myFormdatos_nso_esp = mainLayout_especificacion.cells("a").attachHTMLString(html_general.replace('nsoc|',nso).replace('?','ESPECIFICACIONES'));  
                mainLayout_especificacion.cells('a').setText('Archivos');
                // console.log(html.replace('nsoc|',nso).replace('?','ESPECIFICACIONES'));
            break;
        default:
            null;
            break;
    }
};

formulaOnSelect= async (id) => {
    buscar = myFormdformu.getItemValue('_fr_buscar').length>0 ? myFormdformu.getItemValue('_fr_buscar').toUpperCase() : '-';
    flag = myFormdformu.isItemChecked('_ch_todo')?'S':'N';
    switch (id) {
        case '__fabri':     
            cargarformula('__fabri',buscar,1,flag);   
            break;
        case '__envasado':     
            cargarformula('__envasado',buscar,2,flag);  
            break;
        case '__acondic':     
            cargarformula('__acondic',buscar,3,flag); 
            break;            
        default:
            null;
            break;
    }
};

buscarnotificacion = async (name) => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbusq", 0, 0, 800, 500);
    Wind_.window("wbusq").hideHeader();
    Wind_.window("wbusq").setModal(true);
    Wind_.window("wbusq").denyResize();
    Wind_.window("wbusq").center();
    myToolbar_nso = Wind_.window("wbusq").attachToolbar();
    myToolbar_nso.addButton('b_close', null, '<i class="far fa-window-close txtred"></i> CERRAR ', null, null);
    myToolbar_nso.attachEvent("onClick", (id) => {
        (id === 'b_close') ? Wind_.window("wbusq").close() : console.log('hola');
    });
    myGrid_nso = Winid_.attachGrid();
    myGrid_nso.setHeader('Nro NSO,Descripción,Estado,Inicio Vigenia, Fin Vigencia,TVU Comercial, TVU Producción,Nro Registro,Forma Cosmética,Cod.Espec,Descripción');
    myGrid_nso.setInitWidthsP('30,30,20,20,20,20,20,30,0,30,50');
    myGrid_nso.setColTypes('ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro');
    myGrid_nso.setColAlign("left,left,center,center,center,center,center,left,left,left,left");
    myGrid_nso.setColumnIds("nsoc,desc,estado,inicio,fin,come,prod,nreg,fcos,esp,descesp");
    myGrid_nso.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter");
    myGrid_nso.clearAll();
    cargarnsogeneral(Wind_,'|');
    myGrid_nso.init();
    myGrid_nso.attachEvent("onRowSelect", function (id, ind) {
        data = myGrid_nso.getRowData(myGrid_nso.getSelectedRowId())
        cod = data.nsoc;
        desc = data.desc;
        estado = data.estado;
        inicio = data.inicio;
        fin = data.fin;
        res = data.res;
        fcos = data.fcos
        nregistro = data.nreg;
        espec = data.esp;
        descesp = data.descesp;
        tvucom=data.come;
        tvuprod=data.prod;
        myFormdatos = mainLayout_register.cells('a').attachForm(f_nuevo_registro);
        myFormdatos.attachEvent("onButtonClick", function (id_ind){
           verespecificaciones();
       });
        myFormdatos.setItemValue('_drt_nrosoc',cod);
        myFormdatos.setItemValue('_drt_nombre',desc);
        myFormdatos.setItemValue('_drt_fechadesde',inicio);
        myFormdatos.setItemValue('_drt_fechahasta',fin);
        myFormdatos.setItemValue('_drt_nroregistro',nregistro);
        myFormdatos.setItemValue('_drt_formacosmetica',fcos);
        myFormdatos.setItemValue('_drt_estado',estado);
        myFormdatos.setItemValue('_drt_esp',espec);
        myFormdatos.setItemValue('_drt_tuv_com',tvucom);
        myFormdatos.setItemValue('_drt_tuv_prod',tvuprod);
        //cargarProductosnsogeneral(nregistro);
        Wind_.window("wbusq").close();
    });
};


registrarnotificacion = async (name) => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbusq", 0, 0, 800, 500);
    Wind_.window("wbusq").hideHeader();
    Wind_.window("wbusq").setModal(true);
    Wind_.window("wbusq").denyResize();
    Wind_.window("wbusq").center();
    myToolbar_nso = Wind_.window("wbusq").attachToolbar();
    myToolbar_nso.setIconsPath('/assets/images/icons/');
    myToolbar_nso.addButton('b_close', null, '<i class="far fa-window-close txtred"></i> CERRAR ', null, null);
    myToolbar_nso.addButton('__save',null,'Guardar',"ic-save.png","");
    myToolbar_nso.setIconSize(32);
    myToolbar_nso.attachEvent("onClick", (id) => {
        (id === 'b_close') ? Wind_.window("wbusq").close() : console.log('hola');
    });
    myform_nso = Wind_.window("wbusq").attachForm(f_nuevo_registro);
    myform_nso.setItemValue('_drt_nombre',desc_esp);
    myform_nso.setItemValue('_drt_esp',cod_esp);
};

mostrarnsocven = async (name) => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbusq", 0, 0, 650, 500);
    Wind_.window("wbusq").setText('Registros prontos a vencer');
    Wind_.window("wbusq").setModal(true);
    Wind_.window("wbusq").denyResize();
    Wind_.window("wbusq").center();
    myGrid_nso = Winid_.attachGrid();
    myGrid_nso.setHeader('Nro NSO,Descripción,Fin Vigencia');
    myGrid_nso.setInitWidthsP('30,50,20');
    myGrid_nso.setColTypes('ro,ro,ro');
    myGrid_nso.setColAlign("left,left,center");
    myGrid_nso.init();    
    Wind_.window("wbusq").progressOn();
    myGrid_nso.clearAll(); 
    myGrid_nso.load( BASE_URL + 'PO010208/mostrar-nsoc-ven/').then(function (text) {
        Wind_.window("wbusq").progressOff();
    });
};

verProductosnso = async (name) => {
    var nso = myFormdatos_nso.getItemValue('_drt_nroregistro');
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbusq", 0, 0, 800, 500);
    Wind_.window("wbusq").hideHeader();
    Wind_.window("wbusq").setModal(true);
    Wind_.window("wbusq").denyResize();
    Wind_.window("wbusq").center();
    myToolbar_ver = Wind_.window("wbusq").attachToolbar();
    myToolbar_ver.addButton('b_close', null, '<i class="far fa-window-close txtred"></i> CERRAR ', null, null);
    myToolbar_ver.attachEvent("onClick", (id) => {
        (id === 'b_close') ? Wind_.window("wbusq").close() : cargarProductosnso(Wind_,nso);
    });
    // myToolbar_ver.attachEvent("onEnter", (id) => {
    //     cargarListaEntidad(Wind_, myToolbar_ver.getValue('in_busq').toUpperCase());
    // });
    myGrid_ver = Winid_.attachGrid();
    myGrid_ver.setHeader(',CÓDIGO PRODUCTO,DESCRIPCIÓN,MARCA,SUBMARCA,CLASE,FAMILIA,SUBFAMILIA');
    myGrid_ver.setInitWidths('0,150,400,100,100,100,100,100');
    myGrid_ver.setColAlign('left,left,left,left,left,left,left,left');
    myGrid_ver.setColTypes('rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,edn'); 
    myGrid_ver.setColumnIds("chh,cod_prod,desc,mar,sbmr,cla,fam,sbfa");   
    myGrid_ver.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter");
    myGrid_ver.clearAll();
    cargarProductosnso(Wind_,nso);
    myGrid_ver.init();
};

cargarFormacosm = async (name) => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wcosm", 0, 0, 550, 500);
    Wind_.window("wcosm").setText('Forma Cosmética');
    Wind_.window("wcosm").setModal(true);
    Wind_.window("wcosm").denyResize();
    Wind_.window("wcosm").center();
    myToolbar_cosm = Wind_.window("wcosm").attachToolbar();
    myToolbar_cosm.setIconsPath('/assets/images/icons/');
    myToolbar_cosm.addButton('nuevo',null,'Nuevo',"ic-check.png","");
    myToolbar_cosm.addButton('activar',null,'Activar',"ic-act.png","");
    myToolbar_cosm.addButton('desactivar',null,'Desactivar',"ic-inac.png","");
    myToolbar_cosm.attachEvent('onClick', onClickText);
    myToolbar_cosm.setIconSize(32);
    myGrid_cosm = Winid_.attachGrid();
    myGrid_cosm.setHeader('CÓDIGO,FORMA COSMÉTICA,VIGENCIA');
    myGrid_cosm.setInitWidths('100,300,100');
    myGrid_cosm.setColAlign('center,left,left');
    myGrid_cosm.attachHeader("#text_filter,#text_filter,#text_filter");
    myGrid_cosm.setColumnIds("cod,form,vig");
    myGrid_cosm.init();
    Wind_.window("wcosm").progressOn(); 
    myGrid_cosm.clearAll(); 
    myGrid_cosm.load( BASE_URL + 'PO010208/mostrar-formacosmetica/' ).then(function (text) {
        Wind_.window("wcosm").progressOff();
    });    
    
    myGrid_cosm.attachEvent("onRowSelect", function (id, ind) {
        data = myGrid_cosm.getRowData(myGrid_cosm.getSelectedRowId())
        cod_form = data.cod;
    });
};

cargartextFormacosm = async (name) => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wcosmt", 0, 0, 500, 200);
    Wind_.window("wcosmt").setText('Nueva Forma Cosmética');
    Wind_.window("wcosmt").setModal(true);
    Wind_.window("wcosmt").denyResize();
    Wind_.window("wcosmt").center();
    myToolbar_cosm = Wind_.window("wcosmt").attachToolbar();
    myToolbar_cosm.setIconsPath('/assets/images/icons/');
    myToolbar_cosm.addButton('__save',null,'Guardar',"ic-save.png","");
    myToolbar_cosm.attachEvent('onClick', onClickText);
    myToolbar_cosm.setIconSize(32);
    myFormdatos_cosm = Wind_.window("wcosmt").attachForm(f_cosmetica);
};

onClickText= async (id) => {
    switch (id) {
        case 'nuevo':     
            cargartextFormacosm();               
            break; 
        case 'activar': 
            guardarformcosm(cod_form,'Vigente','SinDesc','E');               
            break;
        case 'desactivar':     
            guardarformcosm(cod_form,'No Vigente','SinDesc','E');               
            break;     
        case '__save':     
            desc_form = myFormdatos_cosm.getItemValue('_drt_form_cosm');
            guardarformcosm('0','Vigente',desc_form,'G');               
            break;                 
        default:
            null;
            break;
    }
};


VerArchivo = async e => {
    var tipodoc = document.getElementById('form-tipodoc').value;
    var nsoc = myFormdatos_nso.getItemValue('_drt_nrosoc');
    console.log(tipodoc,nsoc);
    const params = {
        tipodoc :  tipodoc,
        nsoc : nsoc
    };
    $.post(BASE_URL + 'PO010208/ver-pdf/', params, function (res) {
        console.log(res);        
        if (res.state=='success'){            
            WinDocumentoViewer = WinContainer.createWindow('WinDocumentoViewer', 320, 0, 640, 640);
            WinDocumentoViewer.keepInViewport();
            WinDocumentoViewer.setText('Mostrando documento ' + tipodoc +' - '+nsoc);
            console.log(res);
            WinDocumentoViewer.attachURL(res.message);
        } else {
            Swal.fire({ type: 'error', title: 'Error..', text: 'El archivo no existe :' + res.message });
        }
    } , 'json');

},

OnClicktoolbar= async (id) => {
    switch (id) {
        case '__save':
        
        var nsoc = myFormdatos.getItemValue('_drt_nrosoc');
        var nombre_nso = myFormdatos.getItemValue('_drt_nombre');
        var form_cosm = myFormdatos.getItemValue('_drt_formacosmetica');
        var espec = myFormdatos.getItemValue('_drt_esp');
        console.log(espec,nombre_nso,nsoc,form_cosm);
        
        if (nsoc.length==0||myFormdatos.getItemValue('_drt_tuv_com')==null||myFormdatos.getItemValue('_drt_tuv_prod')==null||espec.length==0||myFormdatos.getItemValue('_drt_fechadesde')==null||myFormdatos.getItemValue('_drt_fechahasta')==null||nombre_nso.length==0||form_cosm.length==0){
            
            dhtmlx.confirm("Debe llenar el formulario", function (result) {
            });
        }else{
            var fecha_ini = myFormdatos.getItemValue('_drt_fechadesde').toLocaleDateString().replace('/', '-');
            var fecha_fin = myFormdatos.getItemValue('_drt_fechahasta').toLocaleDateString().replace('/', '-');
            var vu_com = myFormdatos.getItemValue('_drt_tuv_com').toLocaleDateString().replace('/', '-');
            var tvu_prod = myFormdatos.getItemValue('_drt_tuv_prod').toLocaleDateString().replace('/', '-');
            if(nsoc) {
                dhtmlx.confirm("¿Está seguro de guardar?", function (result) {
                    var cadena = ''
                    if (result === Boolean(true)) {
                            guardarnsoc(nsoc,fecha_ini,fecha_fin,nombre_nso,form_cosm,espec,vu_com,tvu_prod);
                    }
                });
            }
        }  
            break;
        case '__edit':
            if  (permiso_cataedit != 'S'){
                var output = await IniciarFormularioSeguridad(243, mainLayout);
                if (output.result === 'S') {
                    permiso_cataedit = 'S';
                    Inicio();
                    buscarnotificacion();
                }else{
                    permiso_cataedit = 'E';
                }
           }else{
            Inicio();
            buscarnotificacion();
           }
        break;
        case '__nuevo':  
            registrarnotificacion();
        break;
        case '__cosm':            
            cargarFormacosm();
        break;
        case '__notif':            
            mostrarnsocven();
        break;
        case '__nsoc':   
            mainLayout_register.cells('b').expand();
            Buscar();
        break;        
        case '__mostnso':
            Buscar();
            mostrarNsoc();
        break;    
        case '__mostesp':
            Inicio();
        break;        
        default:
            null;
            break;
    }
};

guardarnsoc = (nsoc,fecha_ini,fecha_fin,nombre_nso,form_cosm,espec,tvu_com,tvu_prod) => {
    console.log('s');
    params = {
        empresa: usrJson.empresa,
        usuario: usrJson.codigo,
        alias: usrJson.alias,
        num_registro_nsoc: nsoc,
        vigencia_ini:fecha_ini,
        vigencia_ter:fecha_fin,
        nombre: nombre_nso,
        form_cosm : form_cosm,
        espec: espec,
        tvu_com:tvu_com,
        tvu_prod:tvu_prod
    };
    $.post(BASE_URL + "PO010208/grabar-nsoc", params, function (res) {
        if (res.state=='success'){
            Swal.fire('Bien!', res.message, 'success');
            // myFormdatos.setItemValue('_r_nroreque','N° '+res.message_co+ ' Del ' +periodo_fun);
            // myFormdatos.setItemValue('_drt_resumen',cadena);
        } else {
            Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se guardo el registro :' + res.message });
        }
    }, "json");
}

guardarformcosm = (co_forma,estado,des_forma,accion) => {
    params = {
        co_forma: co_forma,
        estado: estado,
        des_forma: des_forma,
        accion: accion
    };
    console.log(co_forma,estado,des_forma,accion);
    $.post(BASE_URL + "PO010208/grabar-forma-cosm", params, function (res) {
        if (res.state=='success'){
            Swal.fire('Bien!', res.message, 'success');
            Wind_.window("wcosm").progressOn(); 
            myGrid_cosm.clearAll(); 
            myGrid_cosm.load( BASE_URL + 'PO010208/mostrar-formacosmetica/' ).then(function (text) {
                Wind_.window("wcosm").progressOff();
            });    
        } else {
            Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se guardo el registro :' + res.message });
        }
    }, "json");
}

inicioOnSelect= async (id) => {
    switch (id) {
        case '__register':
            Inicio();
            break;
        case '__search':
            Buscar();
            break;
        case '__formapr':
            aprobarFormula();
            break;
        case '__graf':
            Graficos();
            break;
        default:
            null;
            break;
    }
};

onClicktoolbarform= async (id) => {        
    seleccione  = myGrid_esprod.getRowData(myGrid_esprod.getSelectedRowId());
    console.log(seleccione);
    switch (id) {
        case '__comp':   
            // cargarventanaComp(seleccione.coform,seleccione.codprod,seleccione.desc);   
            cargarventanaComp(seleccione.cod,seleccione.cod,seleccione.desc);              
            break;
        case '__traz':  
            cargarventanaTraz(seleccione.cod,seleccione.desc); 
            break;
        case '__rep':   
            cargarReport(codigo,nombre, esp,seleccione.marc);                
            break;
        // case '__fail':  
        //     aprobar(seleccione.coform,seleccione.codprod,'Observada');      
        //     break;
        // case '__inactive':     
        //     aprobar(seleccione.coform,seleccione.codprod,'Obsoleta'); 
        //     break;
        // case '__pass':   
        //     aprobar(seleccione.coform,seleccione.codprod,'Vigente'); 
        //     break;
        default:
            null;
            break;
    }
};

detalleOnClick= async (id) => {
    switch (id) {
        case 'ver':
        verProductosnso();
            break;
        case 'file':
        mainLayout_detalle_sub.cells('a').collapse();
        break;
        default:
            null;
            break;
    }
};


mainToolbarOnClick= async (id) => {
    switch (id) {
        case 'ver':
            mainLayout_product.cells('b').collapse();
            mainLayout_product.cells('c').expand();
            break;
        case 'agregar':
            var cant_filas_l_total  = cant_filas_l ;
            data = '';
            for(let i=0;i<cant_filas_l_total;i++){
                data = maingrid.getRowData(i);
                if (data.che == 1) {
                    myGrid_lista.addRow(myGrid_lista.uid(),[0,data.cod_prod,data.desc,data.mar,data.sbmr,data.cla,data.fam,data.sbfa],1);
                }
            }
            break;        
        case 'desmarcar':
            maingrid.setCheckedRows(0,0);
        break;
        case 'marcar':
            maingrid.setCheckedRows(0,1);
        break;
        default:
            null;
            break;
    }
};

// OnclickLista = (id) => {
//     switch (id) {
//         case 'b_close':             
//             mainLayout_product.cells('c').collapse();
//             break;  
//         case 'desmarcar':
//             myGrid_lista.setCheckedRows(0,0);
//         break;
//         case 'marcar':
//             myGrid_lista.setCheckedRows(0,1);
//         break;        
//         case 'eliminar':
//             var to_fila_data_num_gri = myGrid_lista.getRowsNum();
//             console.log(to_fila_data_num_gri);
//             for(var i=1;i<to_fila_data_num_gri;i++){
//                 console.log('data');
//                 let iRowId_gri = myGrid_lista.getRowId(i);
//                 console.log(iRowId_gri);
//                 data = myGrid_lista.getRowData(iRowId_gri);
//                 if (data.chk == 1) {
//                     myGrid_lista.deleteRow(iRowId_gri);
//                     i = i - 1;
//                     to_fila_data_num_gri = to_fila_data_num_gri - 1;
//                 }
//             }
//         break;
//         default:
//             null;
//             break;
//     }
// };

cargarFamilia = () => {
    var val_co_clase = myFormdatos_prod.getItemValue('_drt_clase');
    const params = {
        co_clase :  val_co_clase
    };
    $.post(BASE_URL + 'PO010208/mostrar-familia/', params, function (res) {
        const valor = res.data.familia;
        myFormdatos_prod.reloadOptions('_drt_familia', valor);
        myFormdatos_prod.enableItem('_drt_familia');
    } , 'json');
}

cargarSubfamilia = () => {
    var val_co_familia = myFormdatos_prod.getItemValue('_drt_familia');
    var val_co_clase = myFormdatos_prod.getItemValue('_drt_clase');
    const params = {
        co_clase :  val_co_clase,
        co_familia :  val_co_familia
    };
    $.post(BASE_URL + 'PO010208/mostrar-subfamilia/', params, function (res) {
        const valor = res.data.subfamilia;
        myFormdatos_prod.reloadOptions('_drt_subfamilia', valor);
        myFormdatos_prod.enableItem('_drt_subfamilia');
    } , 'json');
}

cargarSubmarca = () => {
    var val_co_marca = myFormdatos_prod.getItemValue('_drt_marca');
    const params = {
        co_marca :  val_co_marca
    };
    $.post(BASE_URL + 'PO010208/mostrar-submarca/', params, function (res) {
        const valor = res.data.submarca;
        myFormdatos_prod.reloadOptions('_drt_submarca', valor);
        myFormdatos_prod.enableItem('_drt_submarca');
    } , 'json');
}

cargarProductos = (buscar,co_clase,co_familia,co_subfamilia,co_marca,co_submarca) => {    
    maingrid.clearAll(); 
    mainLayout_product.cells('b').progressOn();
    maingrid.load( BASE_URL + 'PO010208/mostrar-producto/'+ buscar+'/'+co_clase+'/'+co_familia+'/'+co_subfamilia+'/'+co_marca+'/'+co_submarca).then(function (text) {
    mainLayout_product.cells('b').progressOff();
        cant_filas_l = maingrid.getRowsNum();
    });
};

cargarespecific = (win) => { 
    win.window("wbuscar").progressOn();  
    maingrid.load( BASE_URL + 'PO010208/mostrar-especificacion/'+usrJson.empresa).then(function (text) {
        win.window("wbuscar").progressOff();
    });
};

cargarProductosnsogeneral = (nso) => {   
    myGrid_lista.clearAll(); 
    mainLayout_product.cells('c').progressOn();
    myGrid_lista.load( BASE_URL + 'PO010208/mostrar-productos-nso/'+nso).then(function (text) {
        mainLayout_product.cells('c').progressOff();
    });
    mainLayout_product.cells('a').collapse();
    mainLayout_product.cells('b').collapse();
};

cargarProductosnso = (win,nso) => {   
    win.window("wbusq").progressOn(); 
    myGrid_ver.clearAll(); 
    myGrid_ver.load( BASE_URL + 'PO010208/mostrar-productos-nso/'+nso ).then(function (text) {
        win.window("wbusq").progressOff();
    });    
};

cargarnsogeneral = (win,buscar) => {    
    win.window("wbusq").progressOn();
    myGrid_nso.clearAll(); 
    myGrid_nso.load( BASE_URL + 'PO010208/mostrar-nso/'+ buscar).then(function (text) {
        win.window("wbusq").progressOff();
    });
};

cargarnso = (buscar) => {    
    maingrid.clearAll(); 
    mainLayout_register.cells('a').progressOn();
    maingrid.load( BASE_URL + 'PO010208/mostrar-nso/'+ buscar).then(function (text) {
        mainLayout_register.cells('a').progressOff();
    });
};

cargarformula = (nombre,buscar,tipo,flag) => {  
    mainLayoutFormula = tabbar_form.cells(nombre).attachLayout('1C');    
    myGrid_formula = mainLayoutFormula.cells('a').attachGrid();
    mainLayoutFormula.cells('a').hideHeader();
    myGrid_formula.setHeader('Cod.Fórmula,Cod.Producto,Descripción,Ver.,Cant.,UExCj.Emb.,Estado,F.Creación,Creado por,Fecha Aprob.,Aprobado por,Marca,Sub Marca');
    myGrid_formula.setInitWidths('100,150,400,150,150,150,150,150,150,150,150,150,150');
    myGrid_formula.setColAlign('center,left,left,center,center,center,center,center,center,center,center,center,center');
    myGrid_formula.setColTypes('ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro'); 
    myGrid_formula.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter");
    myGrid_formula.setColumnIds('coform,codprod,desc'); 
    myGrid_formula.init();      
    myGrid_formula.clearAll(); 
    mainLayoutFormula.cells('a').progressOn();
    myGrid_formula.load( BASE_URL + 'PO010208/mostrar-lista-formula/'+usrJson.empresa+'/'+buscar+'/'+tipo+'/'+flag).then(function (text) {
        mainLayoutFormula.cells('a').progressOff();
    });
};

aprobar = (formula,producto,vigencia) => {
    params = {
        empresa: usrJson.empresa,
        formula: formula,
        producto: producto,
        usuario: usrJson.codigo,
        alias: usrJson.alias,
        vigencia: vigencia
    };    
    dhtmlx.confirm("¿Está seguro?", function (result) {
        if (result === Boolean(true)) {
            $.post(BASE_URL + "PO010208/aprobar-formula", params, function (res) {
                if (res.state=='success'){
                    Swal.fire('Hecho!', res.message, 'success');
                    cargarformula('__fabri','-',1,'N'); 
                } else {
                    Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se guardo el registro :' + res.message });
                }
            }, "json");
        }
    });
}

verespecificaciones = async () => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbuscar", 0, 0, 900, 600);
    win_dire = Wind_.window("wbuscar").attachLayout('1C');
    Winid_.setText("Especificaciones");
    Wind_.window("wbuscar").setModal(true);
    Wind_.window("wbuscar").denyResize();
    Wind_.window("wbuscar").center(); 
    myToolbar = Wind_.window("wbuscar").attachToolbar();
    myToolbar.setIconsPath('/assets/images/icons/');
    myToolbar.addButton('aceptar',null,'Aceptar',"ic-acept.png",""); 
    win_dire.cells('a').setText('Buscar Especificación');
    maingrid = win_dire.cells('a').attachGrid(); 
    maingrid.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    maingrid.setHeader('NOMBRE ESPECIFICACIÓN, COD.ESPEC,VERSION,VIGENCIA,FEC.CREACION,FEC.REVISA,FE.APRUEBA,NOM.CREACION,NOM.REVISA,NOM.APRUEBA,NOM.PROVEEDOR');
    maingrid.setInitWidths('300,100,100,0,150,150,150,300,300,300,300');
    maingrid.setColAlign('left,center,center,center,center,center,center,left,left,left,left,left');
    maingrid.setColumnIds("despec,ccespec"); 
    maingrid.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter"); 
    maingrid.init();     
    cargarespecific(Wind_);
    maingrid.attachEvent("onRowSelect", function (id, ind) {
        data = maingrid.getRowData(maingrid.getSelectedRowId());
        myFormdatos = mainLayout_register.cells('a').attachForm(f_nuevo_registro);
        myFormdatos.attachEvent("onButtonClick", function (id_ind){
            verespecificaciones();
        });
        myFormdatos.setItemValue('_drt_esp',data.ccespec);   
        myFormdatos.setItemValue('_drt_nombre',data.despec);    
     });
     
};

cargarespecProd = (espec,version) => {  
    mainLayout_esprod = tabbar_det.cells('presp').attachLayout('1C');  
    mainLayout_esprod.cells('a').hideHeader(); 
    prodtoolbar = mainLayout_esprod.cells('a').attachToolbar(); 
    prodtoolbar.setIconsPath('/assets/images/icons/');
    prodtoolbar.addButton('__comp',null,'Fórmula',"ic-doc.png",null);
    prodtoolbar.addButton('__traz',null,'Trazabilidad',"ic-enfocar.png",null);
    prodtoolbar.addButton('__rep',null,'Reporte',"print.png",null);
    // prodtoolbar.addButton('__hist',null,'Historial',"ic-historial.png",null);
    // prodtoolbar.attachEvent('onClick', toolbarOnProducto);
    prodtoolbar.attachEvent('onClick', onClicktoolbarform);
    prodtoolbar.setIconSize(32); 
    myGrid_esprod = mainLayout_esprod.cells('a').attachGrid();
    myGrid_esprod.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    myGrid_esprod.setHeader('Código,Descripción,Marca,Submarca');    
    myGrid_esprod.setInitWidths('300,600,200,200');
    myGrid_esprod.setColAlign('left,left,left,left');
    myGrid_esprod.setColTypes('ro,ro,ro,ro'); 
    myGrid_esprod.setColumnIds('cod,desc,marc,subm');   
    myGrid_esprod.init();      
    cargarprodporesp(espec,version);
};

cargarprodporesp = (espec,version) => {  
    myGrid_esprod.clearAll(); 
    mainLayout_esprod.cells('a').progressOn();
    myGrid_esprod.load( BASE_URL + 'PO010208/mostrar-producto-por-espec/'+usrJson.empresa+'/'+espec+'/'+version).then(function (text) {
        mainLayout_esprod.cells('a').progressOff();
    });
};

cargarCaract = (espec,version) => {  
    mainLayout_caract = tabbar_det.cells('crt').attachLayout('2E');  
    myFormdcaract = mainLayout_caract.cells('a').attachForm(form_caract);
    mainLayout_caract.cells('a').hideHeader();  
    mainLayout_caract.cells('a').setHeight(300); 
    mainLayout_caract.cells('b').hideHeader();
    myFormdcaract.setFontSize("11px");
    //CARGANDO PRIMERA PARTE DE CARACTERISTICAS
    const params = {
        empresa: usrJson.empresa,
        especificacion : espec,
        version : version
    };
    $.post(BASE_URL + 'PO010208/mostrar-caract-general/', params, function (res) {
        const caract = res.data.caract; 
        myFormdcaract.setItemValue('_ep_car_gen',caract.DE_CARACTERIS_GENERALES);
        myFormdcaract.setItemValue('_ep_car_alm',caract.DE_CONDIC_ALMACENAMIENTO);
    } , 'json');  
    myGrid_caract = mainLayout_caract.cells('b').attachGrid();
    myGrid_caract.setHeader(',Característica,Detalle');    
    myGrid_caract.setInitWidths('20,200,600');
    myGrid_caract.setColAlign('left,left,left');
    myGrid_caract.setColTypes('ro,ro,ed'); 
    myGrid_caract.setColumnIds('id,desc,det'); 
    myGrid_caract.init();      
    //CARGANDO SEGUNDA PARTE DE CARACTERISTICAS
    myGrid_caract.clearAll(); 
    mainLayout_caract.cells('b').progressOn();
    myGrid_caract.load( BASE_URL + 'PO010208/mostrar-caract-detalle/'+usrJson.empresa+'/'+espec+'/'+version).then(function (text) {
        mainLayout_caract.cells('b').progressOff();
    });
};

cargarEnsayo = (espec,version) => {  
    mainLayout_ensa = tabbar_det.cells('esy').attachLayout('1C');  
    mainLayout_ensa.cells('a').hideHeader();  
    myGrid_ensa = mainLayout_ensa.cells('a').attachGrid();
    myGrid_ensa.setHeader('Co.Método,Método,Co.Ensayo,Condiciones,Especificaciones, De, A,Tipo de Ensayo,Objetivos de la Prueba');    
    myGrid_ensa.setInitWidths('100,200,100,400,300,100,100,300,300');
    myGrid_ensa.setColAlign('left,left,left,left,left,left,left,left.left');
    myGrid_ensa.setColTypes('ro,ro,ro,ro,ed,ed,ed,ro,ro'); 
    myGrid_ensa.setColumnIds('comet,met,codens,ens,esp,min,max,tipens,objp'); 
    myGrid_ensa.init();      
    myGrid_ensa.clearAll(); 
    mainLayout_ensa.cells('a').progressOn();
    myGrid_ensa.load( BASE_URL + 'PO010208/mostrar-ensayo/'+usrJson.empresa+'/'+espec+'/'+version).then(function (text) {
        mainLayout_ensa.cells('a').progressOff();
    });
};

cargarReport = async (codigo,nombre, esp,marc) => {
    // var codigo = 'NMS001-237214';
    WinContainer = new dhtmlXWindows();
    WinDocumentoViewer = WinContainer.createWindow('WinDocumentoViewer', 320, 0, 800, 800);
//                WinDocumentoViewer.center();
        WinDocumentoViewer.keepInViewport();
        WinDocumentoViewer.setText('Mostrando documento ');
        WinDocumentoViewer.attachURL('/api/po010208/mostrar-reporte/'+codigo+'/'+nombre+'/'+esp+'/'+marc);
};
