var tree_menu,tree_tipo,tree_nom,maingrid_venc,codigo,nombre, esp,desc_esp,cod_esp,version_esp,cod_form,Winidh_,Windh_,Winidt_,Windt_,Winidc_,Windc_,myToolbardatos_espec,myToolbardatos_formula,myGrid_historial,mainLayout_historial,buscar,flag,myGrid_acondic,myGrid_envasado,mainLayout_envasado,mainLayout_acondic,tabbar_formdet,tabbar_form,myFormdformu,mainLayoutform,mainLayout_aprform,tabbar,permiso_cataedit,html_general,myFormdatos_nso_esp,mainLayout_especificacion,myGrid_nso,myToolbar_nso,myGrid_ver,Winid_,Wind_,myToolbar_ver,tipo_doc,mainLayout_formula,tabbar,myToolbardatos_detalle,maingrid_search,myFormdatos_search,mainLayout_load,myToolbardatos_search,mainLayout_search,myGrid_lista,Wind_,maingrid,myFormdatos_prod,mainLayout_product,myFormdatos,myToolbardatos_register,mainLayout,myForm,myToolbardatos,mainLayout_register;
let WinDocumentoViewer='';
permiso_cataedit = 'E';
Inicio_nso = () => {
    console.log('s');
    mostrarnsocven();
    Inicio ();
};

Inidrive = () => {
    mainLayout_drive = tabbarinicio.cells("__drive").attachLayout('2U');
    mainLayout_drive.cells('a').setText('Archivos');
    mainLayout_drive.cells('b').setText('Visor');
    mainTree = mainLayout_drive.cells("a").attachTree();
    mainTree.setImagePath("/assets/vendor/dhtmlx/skins/web/imgs/dhxtree_web/");
    mainTree.setXMLAutoLoading(BASE_URL + 'PO010208/mostrar-drive-marcas/' + usrJson.empresa);
    mainTree.enableTreeLines(true);
    mainTree.load(BASE_URL + 'PO010208/mostrar-drive-marcas/'  + usrJson.empresa + '?id=MAIN');
    mainTree.attachEvent('onDblClick', mainTreeOnDblClick);
    mainTree.attachEvent('onClick', function(id){
        tree_menu = id;
    });
    mainLayout_drive.cells('a').setWidth(350);
    toolbar_menu = mainLayout_drive.cells('a').attachToolbar(); 
    toolbar_menu.setIconsPath('/assets/images/icons/');
    toolbar_menu.addButton('subirdt',null,'Subir Archivo',"ic-upload3.png","");
    toolbar_menu.attachEvent('onClick', mainToolbarTree);
    toolbar_menu.setIconSize(32);
    toolbar_drive = mainLayout_drive.cells('b').attachToolbar(); 
    toolbar_drive.setIconsPath('/assets/images/icons/');
    toolbar_drive.addButton('verdcto',null,'Ver Archivo',"ic-look.png","");
    toolbar_drive.attachEvent('onClick', mainToolbarTree);
    toolbar_drive.setIconSize(32);
    maingrid_drive = mainLayout_drive.cells('b').attachGrid();     
    maingrid_drive.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    maingrid_drive.setHeader('NSOC,Descripcion,Nombre Archivo,Marca,Usuario,Fecha Registro,,');
    maingrid_drive.setInitWidths('150,300,300,100,100,100,0,0');
    maingrid_drive.setColAlign('left,left,left,left,left,left,left,left');
    maingrid_drive.setColumnIds('nsoc,desc,nom,marc,usu,fecha,tipo,prod');
    maingrid_drive.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter"); 
    maingrid_drive.init(); 
    maingrid_drive.attachEvent("onRowSelect", function (id, ind) {  
        data = maingrid_drive.getRowData(maingrid_drive.getSelectedRowId());
        tree_tipo=data.tipo;
        tree_nom=data.nom;
        tree_prod = data.prod
    });  
};

mainToolbarTree = (id) => {
    switch (id) { 
        case 'subirdt': 
            mainTreeuploadClick();    
            break;
        case 'verdcto': 
            mainTreegetUrlClick();    
            break;            
        default:
            null;
            break;
    }
};

mainTreeuploadClick = (id) => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wmenu", 0, 0, 800, 500);
    Winid_.setText("Subir Documento");
    Wind_.window("wmenu").setModal(true);
    Wind_.window("wmenu").denyResize();
    Wind_.window("wmenu").center(); 
    myGridrsdoc = Winid_.attachGrid();
    myGridrsdoc.setHeader('NSO,Descripción,Estado,Inicio Vigenia, Fin Vigencia,TVU Comercial, TVU Producción,Nro Registro,Forma Cosmética,Cod.Espec,Descripción');
    myGridrsdoc.attachHeader("#text_filter,#text_filter");
    myGridrsdoc.setInitWidths('120,700,0,0,0,0,0,0,0,0,0');
    myGridrsdoc.setColAlign('left,left,left,left,left,left,left,left,left,left,left,left');
    myGridrsdoc.setColTypes('ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro'); 
    myGridrsdoc.setColumnIds('cod,desc');      
    myGridrsdoc.init(); 
    Wind_.window("wmenu").progressOn();
    myGridrsdoc.clearAll(); 
    myGridrsdoc.load( BASE_URL + 'PO010208/mostrar-nso/'+ '|').then(function (text) {
        Wind_.window("wmenu").progressOff();
    });
    myGridrsdoc.attachEvent("onRowSelect", function (id, ind) {  
        data = myGridrsdoc.getRowData(myGridrsdoc.getSelectedRowId());
        console.log(data.cod);
        Wind_.window("wmenu").close();
        WinContainer = new dhtmlXWindows();
        WinDocumentoViewer = WinContainer.createWindow('WinDocumentoViewer', 320, 0, 680, 280);
        WinDocumentoViewer.keepInViewport();
        WinDocumentoViewer.setText('Subir Documento');
        const parametros = {
            co_nsoc:data.cod,
            co_menu:tree_menu
        };
        $.post(BASE_URL + 'PO010208/mostrar-producto-por-nsoc/', parametros, function (res) {
            console.log(res);
            const producto = res.data.prod;
            const params = {
                empresa:usrJson.empresa,
                entidad:20,
                tipo_doc:657,
                producto:producto.CO_CATALOGO_PRODUCTO,
                doc:'DIRETECN',
                usuario:usrJson.codigo
            };
            $.post(BASE_URL + 'PO010208/subir-adjunto/', params, function (res) {
                const url = res.data.url_adj; 
                console.log(url.URL);
                WinDocumentoViewer.attachURL(url.URL);
            } , 'json');  
        } , 'json');  
     });  
};

mainTreegetUrlClick = (id) => {
    WinContainer = new dhtmlXWindows();
    WinDocumentoViewer = WinContainer.createWindow('WinDocumentoViewer', 320, 0, 750, 600);
    WinDocumentoViewer.keepInViewport();
    WinDocumentoViewer.setText('Ver Documento');
    const params = {
        empresa:usrJson.empresa,
        usuario:usrJson.codigo,
        producto:tree_prod,
        archivo:tree_nom,
        tipo_doc:tree_tipo,
    };
    console.log(params);
    $.post(BASE_URL + 'PO010208/mostrar-documento-por-producto/', params, function (res) {
        const url = res.data.url_adj; 
        console.log(url.URL);
        WinDocumentoViewer.attachURL(url.URL);
    } , 'json'); 
};

mainTreeOnDblClick = (id) => {  
    mainLayout_drive.cells('b').progressOn();  
    maingrid_drive.load( BASE_URL + 'PO010208/mostrar-documento-por-marca/'+tree_menu+'/'+id).then(function (text) {
        mainLayout_drive.cells('b').progressOff();
    });        
};

Inicio = () => {
    mainLayout = tabbarinicio.cells("__register").attachLayout('1C');
    mainLayout_register = mainLayout.cells('a').attachLayout('3J');
    mainLayout_register.cells('b').setCollapsedText('<span style="color:#00796b;">Ver Notificacion Sanitaria</span>');
    mainLayout_register.cells('b').collapse();
    mainLayout_register.cells('a').hideHeader();
    mainLayout_register.cells('b').setText('');
    mainLayout_register.cells('c').setText('Detalle Especificación');
    mainLayout_register.cells('a').attachHTMLString('<div class="div-empty div-regsant"></div>');
    myToolbardatos_register = mainLayout_register.cells('a').attachToolbar();
    mainLayout_register.cells('c').collapse();
    myToolbardatos_register.setIconsPath('/assets/images/icons/');
    myToolbardatos_register.addButton('__mostnso',null,'Mostrar NSOC',"ic-doc.png","ic-doc.png");
    myToolbardatos_register.addButton('__mostesp',null,'Mostrar Especificaciones',"ic-register.png","ic-register.png");
    myToolbardatos_register.addButton('__nuevo',null,'Nuevo',"ic-add2.png","ic-add2.png");
    myToolbardatos_register.addButton('__nsoc',null,'Ver Registros NSOC',"ic-look.png","ic-look.png");
    myToolbardatos_register.addButton('__cosm',null,'Forma Cosmética',"ic-form.png","ic-form.png");
    myToolbardatos_register.addButton('__notif',null,'Notificaciones',"ic-calendar.png","ic-calendar.png");
    myToolbardatos_register.attachEvent('onClick', OnClicktoolbar);
    myToolbardatos_register.setIconSize(32);    
    myToolbardatos_register.disableItem('__nsoc');
    myToolbardatos_register.disableItem('__cosm');
    myToolbardatos_register.disableItem('__notif');
    maingrid = mainLayout_register.cells('a').attachGrid();     
    maingrid.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    maingrid.setHeader('NOMBRE ESPECIFICACIÓN, COD.ESPEC,VERSION,VIGENCIA,FEC.CREACION,FEC.REVISA,FE.APRUEBA,NOM.CREACION,NOM.REVISA,NOM.APRUEBA,NOM.PROVEEDOR');
    maingrid.setInitWidths('500,100,80,0,120,120,0,250,250,0,0');
    maingrid.setColAlign('left,center,center,center,center,center,center,left,left,left,left');
    maingrid.setColumnIds("despec,ccespec,version"); 
    maingrid.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter"); 
    maingrid.init();     
    mainLayout_register.cells('a').progressOn();  
    maingrid.load( BASE_URL + 'PO010208/mostrar-especificacion/'+usrJson.empresa).then(function (text) {
        mainLayout_register.cells('a').progressOff();
    });    
    mainLayout_register.cells('c').setHeight(280);
    tabbar_det = mainLayout_register.cells('c').attachTabbar();
    tabbar_det.addTab('presp', 'Productos Espec.', null, null, true);
    tabbar_det.addTab('crt', 'Características', null, null, false);
    tabbar_det.addTab('esy', 'Ensayos', null, null, false);
    tabbar_det.addTab('arc', 'Archivos Adjuntos', null, null, false);
    tabbar_det.attachEvent ( "onSelect" , detaOnSelect);     
    maingrid.attachEvent("onRowSelect", function (id, ind) {
        mainLayout_register.cells('c').expand();
        data = maingrid.getRowData(maingrid.getSelectedRowId())     
        version_esp = data.version;
        cod_esp = data.ccespec;
        codigo = data.cod_nso;
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
    maingrid.setInitWidthsP('10,30,5,10,10,10,10,0,0,5,50');
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
        mainLayout_register.cells('c').expand();
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

regAnios  = () =>{
    mainLayout_reg = tabbarinicio.cells('__reg').attachLayout('1C');  
    mainLayout_reg.cells('a').hideHeader();
    mainLayout_reg.cells('a').attachHTMLString('<figure class="highcharts-figure"><div id="container"></div><p class="highcharts-description"></p></figure>');
    Graficosporanio();
}

regMarca = () =>{
    mainLayout_ma = tabbarinicio.cells('__marca').attachLayout('1C');  
    mainLayout_ma.cells('a').hideHeader();
    mainLayout_ma.cells('a').attachHTMLString('<figure class="highcharts-figure"><div id="container2"></div><p class="highcharts-description"></p></figure>');
    
    Graficospormarca();
}

regVenc = () =>{
    mainLayout_ma = tabbarinicio.cells('__fecven').attachLayout('2U');  
    mainLayout_ma.cells('a').hideHeader();
    mainLayout_ma.cells('b').setWidth(550);
    mainLayout_ma.cells('b').setText('Detalle');
    mainLayout_ma.cells('b').collapse();
    mainLayout_ma.cells('a').attachHTMLString('<figure class="highcharts-figure"><div id="container3" style="height:70%;width:70%;margin:0 auto;padding:20px 3px;box-sizing:border-box;align:left"></div><p class="highcharts-description"></p></figure>');
    maingrid_venc = mainLayout_ma.cells('b').attachGrid();
    maingrid_venc.setHeader('Fec.Autorización,Fec.Vencimiento,NSO,Cod.Espec.,Nombre Producto');
    maingrid_venc.setInitWidths('100,100,100,100,300');
    maingrid_venc.setColAlign('center,center,left,center,left'); 
    // maingrid_venc.setColumnIds("cod_nso,desc,estado,fec_ini,fec_fin,com,prod,nreg,fcos,esp,desp");   
    // maingrid_venc.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,,,#text_filter,#text_filter");
    maingrid_venc.init();  
    Graficosporvenc();
}

Graficosporanio = () => {
    const params = {};
    let Etiquetas = [];
    let Valores = [];
    let datadrill = []
    $.post(BASE_URL + 'PO010208/mostrar-control-anio/', params, function (res) { 
        const valor = res.data.anio;
        console.log(valor);
        for(let i in valor) {
            let iPeriodo = valor[i];
            Etiquetas.push(iPeriodo.CO_NUMERO);
            Valores.push({'name': iPeriodo.CO_NUMERO,'y': iPeriodo.CANTIDAD, 'drilldown': iPeriodo.CO_NUMERO});
         
        }
        $.post(BASE_URL + 'PO010208/mostrar-control-anio-det/', params, function (res) { 
            datadrill = res;
            console.log(datadrill);
        //grafico del modal
        $('#container').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'Registros de NSO'
            },
            subtitle: {
                text: 'Corporación Life'
            },
            xAxis: {
                type: 'category'
            },
            yAxis: {
                min: 0,
                max: 100,
                title: {
                    text: ''
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:1f} </b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            series: [
                {name: 'Número de registros',
                colorByPoint: false,
                data: Valores}
            ],
            
            drilldown: {
                series: datadrill
            }
        });
        } , 'json');  
    } , 'json');  
}

Graficospormarca = () => {
    console.log('marca')
    const params = {};
    let Etiquetas = [];
    let Valores = [];
    let datadrill = []
    $.post(BASE_URL + 'PO010208/mostrar-control-marca/', params, function (res) { 
        const valor = res.data.marca;
        console.log(valor);
        for(let i in valor) {
            let iPeriodo = valor[i];
            Etiquetas.push(iPeriodo.DE_NOMBRE);
            Valores.push({'name': iPeriodo.DE_NOMBRE,'y': iPeriodo.CANTIDAD, 'drilldown': iPeriodo.DE_NOMBRE});
         
        }
        $.post(BASE_URL + 'PO010208/mostrar-control-marca-det/', params, function (res) { 
            datadrill = res;
            console.log(datadrill);
        // grafico del modal
        $('#container2').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'Registro por Marca'
            },
            subtitle: {
                text: 'Corporación Life'
            },
            xAxis: {
                type: 'category'
            },
            yAxis: {
                min: 0,
                max: 100,
                title: {
                    text: ''
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:1f} </b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            series: [
                {name: 'Marcas registradas',
                colorByPoint: true,
                data: Valores}
            ],
            
            drilldown: {
                series: datadrill
            }
        });
        } , 'json');  
    } , 'json'); 
}

Graficosporvenc = () => {
    console.log('marca')
    const params = {};
    let Etiquetas = [];
    let Valores = [];
    $.post(BASE_URL + 'PO010208/mostrar-control-vencimiento/', params, function (res) { 
        const valor = res.data.venc;
        console.log(valor);
        for(let i in valor) {
            let iPeriodo = valor[i];
            Etiquetas.push(iPeriodo.CO_ANIO);
            Valores.push({'name': iPeriodo.CO_ANIO,'y': iPeriodo.CANTIDAD});
         
        }

        $('#container3').highcharts({
            
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: 'Vencimiento de Registros NSO'
        },
        plotOptions: {
            series: {
                cursor: 'pointer',
                point: {
                    events: {
                        click: function () {
                            fecvtoporanio(this.category);
                        }
                    }
                }
            }
        },
        xAxis: [{
            categories: Etiquetas,
            crosshair: true
        }],
        yAxis: [{
            min: 0,
            max: 100,
            title: {
                text: ''
            }
        }],
        tooltip: {
            shared: true
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 120,
            verticalAlign: 'top',
            y: 100,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        series: [
                {name: 'Vencimiento de Registro NSO',
                colorByPoint: true,
                data: Valores}]
            // chart: {
            //     type: 'column'
            // },
            // title: {
            //     text: 'Registro por Marca'
            // },
            // subtitle: {
            //     text: 'Corporación Life'
            // },
            // xAxis: {
            //     categories: Etiquetas,
            // },
            // yAxis: {
            //     min: 0,
            //     max: 100,
            //     title: {
            //         text: ''
            //     }
            // },
            // tooltip: {
            //     headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            //     pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            //         '<td style="padding:0"><b>{point.y:1f} </b></td></tr>',
            //     footerFormat: '</table>',
            //     shared: true,
            //     useHTML: true
            // },
            // plotOptions: {
            //     series: {
            //         cursor: 'pointer',
            //         events: {
            //             click: function (event) {
            //                 alert('Category: ' + this.category + ', value: ' + this.y);
            //             }
            //         }
            //     }
            // },
            // series: [
            //     {name: 'Vencimiento de Registro NSO',
            //     colorByPoint: true,
            //     data: Valores}
            // ],
            
            
        });
    } , 'json'); 
}

Buscar = () => { 
    // mainLayout_search = tabbarinicio.cells("__search").attachLayout('1C');  
    mainLayout_detalle_sub = mainLayout_register.cells('b').attachLayout('1C');    
    // mainLayout_load = mainLayout_search.cells('a').attachLayout('3J');
    // mainLayout_detalle_sub = mainLayout_load.cells('b').attachLayout('2E');
    mainLayout_detalle_sub.cells('a').setText('Detalle NSOC');
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
    // tabbar = mainLayout_detalle_sub.cells('b').attachTabbar();
    // tabbar.addTab('s_formula', 'FÓRMULA', null, null, true);
    // tabbar.addTab('s_especificaciones', 'ESPECIFICACIONES', null, null, false);
    // tabbar.addTab('s_conreque', 'MATERIAL DE ENVASE', null, null, false);
    // tabbar.addTab('s_revdevol', 'ROTULADO', null, null, false);  
    // tabbar. attachEvent ( "onSelect" , doOnSelect ); 
    myToolbardatos_detalle.setIconsPath('/assets/images/icons/');
    // myToolbardatos_detalle.addButton('ver',null,'<b>Ver lista</b>',"ic-look.png","");  
    // myToolbardatos_detalle.addButton('file',null,'<b>Ver documentos</b>',"ic-file.png",""); 
    myToolbardatos_detalle.addButton('__save',null,'Editar',"ic-edit2.png",""); 
    myToolbardatos_detalle.addButton('__save',null,'Guardar',"ic-save.png","");
    myToolbardatos_detalle.addButton('minimizar',null,'Ocultar',"ic-hide.png","");
    myToolbardatos_detalle.attachEvent('onClick', detalleOnClick);       
    myToolbardatos_detalle.setIconSize(18);    
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
    myGrid_componentes.setInitWidths('150,350,100,50,100,100');
    myGrid_componentes.setColAlign('left,left,right,right,left,left');
    myGrid_componentes.setColTypes('ro,ro,ro,ro,ro,ro'); 
    myGrid_componentes.setNumberFormat("0.00",2,".",",");  
    myGrid_componentes._in_header_stat_sum=function(tag,index,data){       
        var calck=function(){                              
            var sum=0;                                     
            this.forEachRow(function(id){                   
                sum+=this.cellById(id,index).getValue()*1;     
            })
        return this._aplNF(sum,0);
        }
        this._stat_in_header(tag,calck,index,data);            
    }
    myGrid_componentes.attachFooter(",TOTAL,#stat_sum,kg,,",["","","text-align:right;","text-align:right;","",""]);
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
    Winid_ = Wind_.createWindow("wbusq", 0, 0, 1000, 500);
    Wind_.window("wbusq").setText('Nuevo Registro');
    // Wind_.window("wbusq").hideHeader();
    Wind_.window("wbusq").setModal(true);
    Wind_.window("wbusq").denyResize();
    Wind_.window("wbusq").center();
    myToolbar_nso = Wind_.window("wbusq").attachToolbar();
    myToolbar_nso.setIconsPath('/assets/images/icons/');
    // myToolbar_nso.addButton('b_close', null, '<i class="far fa-window-close txtred"></i> CERRAR ', null, null);
    myToolbar_nso.addButton('__save',null,'Guardar',"ic-save.png","");
    myToolbar_nso.setIconSize(32);
    // myToolbar_nso.attachEvent("onClick", (id) => {
    //     (id === 'b_close') ? Wind_.window("wbusq").close() : console.log('hola');
    // });
    
    myToolbar_nso.attachEvent('onClick', OnClicktoolbar);
    myform_nso = Wind_.window("wbusq").attachForm(f_nuevo_registro);
    myform_nso.setItemValue('_drt_nombre',desc_esp);
    myform_nso.setItemValue('_drt_esp',cod_esp);
    myform_nso.setItemValue('_drt_vers',version_esp);
    
};

mostrarnsocven = async (name) => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbusq", 0, 0, 650, 250);
    Wind_.window("wbusq").setText('Importante!');
    Wind_.window("wbusq").setModal(true);
    Wind_.window("wbusq").denyResize();
    Wind_.window("wbusq").center();
    myToolbar_venc = Wind_.window("wbusq").attachToolbar();
    myToolbar_venc.setIconsPath('/assets/images/icons/');
    myToolbar_venc.addButton('_fcv',null,'<b>Registros prontos a vencer</b>',"","alerta.png");
    myToolbar_venc.setIconSize(32);
    myToolbar_venc.disableItem('_fcv');
    myGrid_nso = Winid_.attachGrid();
    myGrid_nso.setHeader('Nro NSO,Descripción,Fin Vigencia');
    myGrid_nso.setInitWidthsP('30,50,20');
    myGrid_nso.setColTypes('ro,ro,ro');
    myGrid_nso.setColAlign("left,left,center");
    myGrid_nso.setColumnIds("nsoc,desc,fec");
    myGrid_nso.setColumnColor("#d5f1ff,#d5f1ff,#FE642E");
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
        
        var nsoc = myform_nso.getItemValue('_drt_nrosoc');
        var nombre_nso = myform_nso.getItemValue('_drt_nombre');
        var form_cosm = myform_nso.getItemValue('_drt_formacosmetica');
        var espec = myform_nso.getItemValue('_drt_esp');
        var version = myform_nso.getItemValue('_drt_vers');
        console.log(espec,nombre_nso,nsoc,form_cosm,version);
        
        if (nsoc.length==0||myform_nso.getItemValue('_drt_tuv_com')==null||myform_nso.getItemValue('_drt_tuv_prod')==null||espec.length==0||myform_nso.getItemValue('_drt_fechadesde')==null||myform_nso.getItemValue('_drt_fechahasta')==null||nombre_nso.length==0||form_cosm.length==0){
            
            dhtmlx.confirm("Debe llenar el formulario", function (result) {
            });
        }else{
            var fecha_ini = myform_nso.getItemValue('_drt_fechadesde').toLocaleDateString().replace('/', '-');
            var fecha_fin = myform_nso.getItemValue('_drt_fechahasta').toLocaleDateString().replace('/', '-');
            var vu_com = myform_nso.getItemValue('_drt_tuv_com');
            var tvu_prod = myform_nso.getItemValue('_drt_tuv_prod');
            if(nsoc) {
                dhtmlx.confirm("¿Está seguro de guardar?", function (result) {
                    var cadena = ''
                    if (result === Boolean(true)) {
                            console.log();
                            guardarnsoc(nsoc,fecha_ini,fecha_fin,nombre_nso,form_cosm,espec,vu_com,tvu_prod,version);
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
            Inicio();
            mostrarNsoc();
            myToolbardatos_register.enableItem('__nsoc');
            myToolbardatos_register.enableItem('__cosm');
            myToolbardatos_register.enableItem('__notif');
        break;    
        case '__mostesp':
            Inicio();
        break;        
        default:
            null;
            break;
    }
};

guardarnsoc = (nsoc,fecha_ini,fecha_fin,nombre_nso,form_cosm,espec,tvu_com,tvu_prod,version) => {
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
        tvu_prod:tvu_prod,
        version:version
    };
    $.post(BASE_URL + "PO010208/grabar-nsoc", params, function (res) {
        if (res.state=='success'){
            Swal.fire('Bien!', res.message, 'success');
            Inicio();
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
        case '__drive':
            Inidrive();
            break;
        case '__register':
            Inicio();
            break;
        case '__search':
            Buscar();
            break;
        case '__formapr':
            aprobarFormula();
            break;
        case '__reg':
            regAnios();
            break;
        case '__marca':
            regMarca();
            break;
        case '__fecven':
            regVenc();
            break;
        default:
            null;
            break;
    }
};

onClicktoolbarform= async (id) => {        
    seleccione  = myGrid_esprod.getRowData(myGrid_esprod.getSelectedRowId());
    switch (id) {
        case '__comp':   
            // cargarventanaComp(seleccione.coform,seleccione.codprod,seleccione.desc);   
            cargarventanaComp(seleccione.cod,seleccione.cod,seleccione.desc);              
            break;
        case '__traz':  
            cargarventanaTraz(seleccione.cod,seleccione.desc); 
            break;
        case '__rep':   
            cargarReport(codigo,nombre, esp,seleccione.marc,version_esp);                
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
        case 'minimizar':   
            mainLayout_register.cells('b').collapse();
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

fecvtoporanio = (periodo) => {    
    console.log(periodo); 
    console.log('periodo');
    mainLayout_ma.cells('b').expand();
    maingrid_venc.clearAll(); 
    mainLayout_ma.cells('b').progressOn();
    maingrid_venc.load( BASE_URL + 'PO010208/mostrar-vencimiento-nso-por-periodo/'+ periodo).then(function (text) {
        mainLayout_ma.cells('b').progressOff();
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
    mainLayout_caract.cells('b').setText('Detalle');
    mainLayout_caract.cells('a').expand();
    myFormdcaract.setFontSize("10px");
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
    myGrid_caract.setInitWidths('0,200,200');
    myGrid_caract.setColAlign('left,left,left');
    myGrid_caract.setColTypes('ro,ro,ro'); 
    myGrid_caract.setColumnHidden(0,true);
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

cargarDocumento = (espec,version) => {  
    mainLayout_dcto = tabbar_det.cells('arc').attachLayout('1C');  
    mainLayout_dcto.cells('a').hideHeader(); 
    dctotoolbar = mainLayout_dcto.cells('a').attachToolbar(); 
    dctotoolbar.setIconsPath('/assets/images/icons/');
    dctotoolbar.addButton('verdcto',null,'Ver Archivo',"ic-look.png","");
    dctotoolbar.attachEvent('onClick', toolbarOnadj);
    dctotoolbar.setIconSize(32); 
    myGrid_dcto = mainLayout_dcto.cells('a').attachGrid();
    myGrid_dcto.setHeader(',Nombre,Descripción');    
    myGrid_dcto.setInitWidths('0,300,600');
    myGrid_dcto.setColAlign('left,left,left');
    myGrid_dcto.setColTypes('ro,ro,ro'); 
    myGrid_dcto.setColumnIds('prod,nom,desc'); 
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
            verurladjunto(sel_adj.prod,sel_adj.nom);
            break;    
        default:
            null;
            break;
    }
};

verurladjunto = async (prod,archivo) => {
    WinContainer = new dhtmlXWindows();
    WinDocumentoViewer = WinContainer.createWindow('WinDocumentoViewer', 320, 0, 700, 800);
    WinDocumentoViewer.keepInViewport();
    WinDocumentoViewer.setText('Mostrando documento ');
    const params = {
        producto:prod,
        archivo: archivo,
    };
    $.post(BASE_URL + 'PO010410/mostrar-adjunto-espec/', params, function (res) {
        const url = res.data.url_adj; 
        console.log(url.URL);
        WinDocumentoViewer.attachURL(url.URL);
    } , 'json');  
    
};

cargarReport = async (codigo,nombre, esp,marc,version) => {
    console.log(codigo,nombre, esp,marc,version);
    WinContainer = new dhtmlXWindows();
    WinDocumentoViewer = WinContainer.createWindow('WinDocumentoViewer', 320, 0, 800, 600);
    WinDocumentoViewer.center();
    WinDocumentoViewer.keepInViewport();
    WinDocumentoViewer.setText('Mostrando documento ');
    WinDocumentoViewer.attachURL('/api/po010208/mostrar-reporte/'+codigo+'/'+nombre+'/'+esp+'/'+marc+'/'+version);
};


cargarespReport = async (esp,vers,cod,nom,fcrea,frev,fapr,crea,rev,aprob,marc,sub,prov,nsoc) => {
    WinContainer = new dhtmlXWindows();
    WinDocumentoViewer = WinContainer.createWindow('WinDocumentoViewer', 320, 0, 800, 800);
    WinDocumentoViewer.keepInViewport();
    WinDocumentoViewer.setText('Mostrando documento ');
    WinDocumentoViewer.attachURL('/api/po010410/mostrar-reporte/'+esp+'/'+vers+'/'+cod+'/'+nom+'/'+fcrea+'/'+frev+'/'+fapr+'/'+crea+'/'+rev+'/'+aprob+'/'+marc+'/'+sub+'/'+prov+'/'+nsoc);
};