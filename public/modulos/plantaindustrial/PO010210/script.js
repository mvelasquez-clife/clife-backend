var codproducto,formproyecto,formcreado,codproyecto,serieactividad;

cargarAlerta = () => {  
  const params = {
      usuario: usrJson.codigo,
  };
  $.post(BASE_URL + 'PO010210/aviso-revisar/', params, function (res) {
    console.log(res.data.serie); 
    respuesta = res.data.respuesta;
    if (respuesta[0].RESPUESTA>0){
        dhtmlx.alert({
            title:'Aviso',
            type: 'alert-error',
            text: 'Ud. tiene actividades pendientes por revisar'
        });   
    }
  } , 'json');  

};
Inicio = () => {    
    cargarAlerta();
    mainLayout = tabbarinicio.cells("__buscar").attachLayout('1C');    
    mainLayout.cells('a').hideHeader(); 
    mainLayout.cells('a').attachHTMLString('<div class="div-empty div-artes"></div>');
    tooolbar = mainLayout.cells('a').attachToolbar();
    tooolbar.setIconsPath('/assets/images/icons/');    
    tooolbar.addText('clienteLabel', null, 'Nombre Proyecto');
    tooolbar.addInput('idproyecto', null, null, 75);
    tooolbar.addInput('nomproyecto', null, null, 160);
    tooolbar.addButton('__info', null, null, 'info.svg', null);
    tooolbar.addSeparator();
    tooolbar.addText('fechaLabel', null, 'Rango de fechas');
    tooolbar.addInput('fechaDesde', null, '', 75);
    tooolbar.addText('alLabel', null, 'al');
    tooolbar.addInput('fechaHasta', null, '', 75);
    tooolbar.addSeparator();
    tooolbar.addButton('__buscar', null, null, 'ic-search.svg', null);
    tooolbar.addSeparator();
    tooolbar.addButton('nuevo',null,'Nuevo',"ic-add.svg","ic-add-dis.svg");
    tooolbar.addSeparator();
    tooolbar.addButton('edit',null,'Editar',"ic-edit.svg","ic-edit.svg");
    // tooolbar.disableItem('idproyecto');
    // tooolbar.disableItem('nomproyecto');
    // tooolbar.disableItem('__guardar');
    tooolbar.attachEvent('onClick', OnClicktoolbar);
    InputDesde = tooolbar.getInput('fechaDesde');
        InputDesde.setAttribute('readOnly', 'true');
        InputDesde.onclick = function(){ setSens(InputHasta, 'max'); }
    InputHasta = tooolbar.getInput('fechaHasta');
        InputHasta.setAttribute('readOnly', 'true');
        InputHasta.onclick = function(){ setSens(InputDesde, 'min'); }
    CalendarCtacte = new dhtmlXCalendarObject([InputDesde,InputHasta]);
        CalendarCtacte.setDateFormat("%d/%m/%Y");
    let iFecha = new Date();
    tooolbar.setValue('fechaHasta', iFecha.toLocaleDateString('en-GB'));
    iFecha.setMonth(iFecha.getMonth() - 2);
    tooolbar.setValue('fechaDesde', iFecha.toLocaleDateString('en-GB'));
    tooolbar.setIconSize(18); 
    myGridbuscar = mainLayout.cells('a').attachGrid();
    myGridbuscar.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/"); 
    myGridbuscar.setIconsPath('/assets/images/icons/');
    myGridbuscar.setHeader('Cod.Proyecto,Nombre,Descripción,Objetivo,,Cod.Producto,Producto por,F.Inicio,F.Fin,Estado,Responsable,Fecha Registro,Responsable Actual');
    myGridbuscar.setInitWidths('110,200,200,200,25,100,200,100,100,100,350,100,300');
    myGridbuscar.setColAlign('left,left,left,left,center,left,left,left,left,left,left,left,left');
    myGridbuscar.setColTypes('ed,ed,ed,ed,img,ed,ed,ed,ed,ed,ed,ed,ed'); 
    myGridbuscar.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,,#text_filter,#text_filter,#text_filter,#text_filter,#combo_filter,#combo_filter,#text_filter,#text_filter");
    myGridbuscar.setColumnIds('co_proyecto,proyecto,de_descripcion,de_objetivo,ver_proy,co_catalogo_producto,producto,fe_vigencia_inicio,fe_vigencia_fin,es_vigencia,de_razon_social,fe_registra,res_actual');      
    myGridbuscar.init();     
    myGridbuscar.clearAll(); 
    mainLayout.cells('a').progressOn();
    myGridbuscar.load( BASE_URL + 'PO010210/listar-proyectos/').then(function (text) {
        mainLayout.cells('a').progressOff();
        let num_fila = myGridbuscar.getRowsNum();
        let iRowId;
        for(let i=0;i<num_fila;i++){
            iRowId = myGridbuscar.getRowId(i);
            data = myGridbuscar.getRowData(iRowId);
            if(data.es_vigencia=='Vigente'){
                myGridbuscar.setRowColor(iRowId,"#90EE90");
            }
        }
      }); 
      
    myGridbuscar.attachEvent("onRowSelect", function (rowId,colId) {
        switch(colId) {
            case 4:
            data = myGridbuscar.getRowData(myGridbuscar.getSelectedRowId());    
            pro_cod = data.co_proyecto;
            pro_desc = data.proyecto;   
            codproducto = data.co_catalogo_producto;   
            codproyecto = pro_cod;
            tooolbar.setValue('idproyecto', pro_cod);
            tooolbar.setValue('nomproyecto', pro_desc);  
            cabecerAdjunto(data.co_catalogo_producto);
            usuarioAsignado(pro_cod);
            // cargarsustGrid(data.co_catalogo_producto);
            mostrarProdVinculados(data.co_catalogo_producto);
            // cargarArchivos(data.codproyecto);
                break;
            default: break;
        }
     });

}

Gant = () => {    
    gantLayout = tabbarinicio.cells("__gant").attachLayout('1C');    
    gantLayout.cells('a').hideHeader();
    gantLayout.cells('a').attachHTMLString('<figure class="highcharts-figure"><div id="container2"></div><p class="highcharts-description"></p></figure>');
    
    $('#container2').highcharts({  
        
    chart: {
        type: 'columnrange',
        inverted: true
    },

    accessibility: {
        description: 'Image description: A column range chart compares the monthly temperature variations throughout 2017 in Vik I Sogn, Norway. The chart is interactive and displays the temperature range for each month when hovering over the data. The temperature is measured in degrees Celsius on the X-axis and the months are plotted on the Y-axis. The lowest temperature is recorded in March at minus 10.2 Celsius. The lowest range of temperatures is found in December ranging from a low of minus 9 to a high of 8.6 Celsius. The highest temperature is found in July at 26.2 Celsius. July also has the highest range of temperatures from 6 to 26.2 Celsius. The broadest range of temperatures is found in May ranging from a low of minus 0.6 to a high of 23.1 Celsius.'
    },

    title: {
        text: 'Nuevo Proyecto Sistemas'
    },

    subtitle: {
        text: 'Cumplimiento de metas'
    },

    xAxis: {
        categories: ['A0001', 'A0002', 'A0003', 'A0004']
    },

    yAxis: {
        title: {
        text: 'Días ( # )'
        }
    },

    tooltip: {
        valueSuffix: 'días'
    },

    plotOptions: {
        columnrange: {
        dataLabels: {
            enabled: true,
            format: 'Día{y}'
        }
        }
    },

    legend: {
        enabled: false
    },

    series: [{
        name: 'Tiempo de entrega',
        data: [
        [1, 3],
        [3, 5],
        [8, 10],
        [10, 17]
        ]
    }]
    
    });
    
}

panelProyecto = () => {
    mainLayoutcab = mainLayout.cells('a').attachLayout('3J');   
    mainLayoutext = mainLayoutcab.cells("b").attachLayout('2E'); 
    mainLayoutdet = mainLayoutext.cells("a").attachLayout('2U');   
    mainLayoutcab.cells('a').hideHeader();  
    mainLayoutcab.cells('b').hideHeader();  
    mainLayoutcab.cells('c').hideHeader(); 
    mainLayoutcab.cells('c').setWidth(715);
    mainLayoutcab.cells('c').setHeight(192);
    formcreado = mainLayoutcab.cells('a').attachForm(f_nuevo_proyect);
    formcreado.setFontSize("10px"); 
    // tooolbar = mainLayoutcab.cells('a').attachToolbar();
    // tooolbar.setIconsPath('/assets/images/icons/');
    // tooolbar.addButton('__nuevo',null,'Nuevo',"ic-add3.png","ic-add3.png");
    // tooolbar.addButton('__guardar',null,'Guardar',"ic-save2.png","ic-save2.png");
    // tooolbar.addButton('__buscar',null,'Buscar',"ic-look.png","ic-look.png");
    // tooolbar.attachEvent('onClick', OnClicktoolbar);
    // tooolbar.setIconSize(32);    
    // formcambios = mainLayoutcab.cells('a').attachForm(f_registracambio);
    // formcambios.setFontSize("11px");
    // tabbaridet = mainLayout.cells('b').attachTabbar();
    // tabbaridet.addTab('__padre', 'Producto Padre', null, null, true);
    // tabbaridet.addTab('__formula', 'Fórmula', null, null, true);
    // tabbaridet.addTab('__adjunto', 'Adjuntos', null, null, true);
    // tabbaridet.attachEvent ( "onSelect" , inicioOnSelect);  
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
        case '__gant':
            Gant();
            break;
        default:
        null;
        break;
    }
};

Onprodtoolbar= async (id) => {
    switch (id) {
        case 'b_close_prod':  
            Wind_.window("wbuscar").close();
        break;    
        case 'b_agregar':  
        console.log('hola');
        console.log(myGridbuscar.getSelectedRowId());
            sel_producto = myGridbuscar.getRowData(myGridbuscar.getSelectedRowId());
            formproyecto.setItemValue('pry_cod_prod',sel_producto.cod);
            formproyecto.setItemValue('pry_desc_prod',sel_producto.desc);
            Wind_.window("wbuscar").close();
        break;  
        case 'b_busq':      
            if (myToolbar.getValue('in_busq').length>0){            
                cargarproductoporgrupo(myToolbar.getValue('in_busq').toUpperCase()); 
            }else{
                dhtmlx.confirm("El campo esta vacío", function (result) {});
            }
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
        case '__info':  
            mostrarProyectodetalle(codproyecto);
        break;     
        case 'refresh':  
            cargarArchivos(codproyecto);
        break;      
        case 'editact':  
            sel_act = myGrid_act.getRowData(myGrid_act.getSelectedRowId());
            cargarNuevo(codproducto);
            actividadForm.setItemValue('act_nro',sel_act.codact);
            actividadForm.setItemValue('act_nombre',sel_act.nombre);
            actividadForm.setItemValue('act_desc',sel_act.desc);
            actividadForm.setItemValue('act_asig',sel_act.asig);
            actividadForm.setItemValue('act_estado',estado);
            actividadForm.setItemValue('act_fecha',fecha);
        break; 
        case 'nuevo':  
            cargarFormulario();
            cargarSerie();
            formproyecto.setItemValue('pry_cod_usuario',usrJson.codigo);
            formproyecto.setItemValue('pry_usuario',usrJson.nombre);
        break;   
        case 'b_check':  
            guardarProyecto();
        break;  
        case 'nvoact': 
            cargarNuevo(codproyecto);
        break;   
        case 'saveact':           
            let  cant_filas = 0,p=0;
            cant_filas = myGrid_dcto.getRowsNum();
            let d_grabar = '',cadena_idseq = '',cadena_observaciones = '';     
            for (let i = 0; i < cant_filas; i++) {
                let iRowId = myGrid_dcto.getRowId(i);
                if(iRowId){
                    d_grabar = myGrid_dcto.getRowData(iRowId);
                    if(d_grabar.chec == 1){
                        cadena_idseq += d_grabar.idseq +'@';
                        cadena_observaciones += d_grabar.idseq +'@';
                        p++;
                    }
                }
            }
            cant_filas = p;
            guardarActividad(codproyecto,'N','N','Pendiente',cadena_idseq,cadena_observaciones,cant_filas);  
        break;
        case 'next': 
            mygridact.cells('a').collapse()
        break;  
        case '__guardar':  
            guardarArte(codproducto);
        break;  
        case '__buscar':  
            Inicio();
        break;   
        case 'aprobar':  
            Aprobar();
        break;
        case '__orden':  
            sel_producto = mainProddetalle.getRowData(mainProddetalle.getSelectedRowId());
            codproducto = sel_producto.cod;
            mostrarordenCompra(codproducto);
        break;
        case 'addusuario':  
            buscarEntidad();
        break;  
        case 'aceptar':            
            let  cant_filas_guardar = 0,n=0;
            cant_filas_guardar = myGrid_usuario.getRowsNum();
            let cadenausuario = '';            
            for (let i = 0; i < cant_filas_guardar; i++) {
                let iRowId = myGrid_usuario.getRowId(i);
                if(iRowId){
                    data_grabar = myGrid_usuario.getRowData(iRowId);
                    cadenausuario += data_grabar.cod +'@';
                    n++;
                }
            }
            cant_filas_guardar = n;
            console.log(codproyecto,cadenausuario,cant_filas_guardar);
            guardarusuarios(codproyecto,cadenausuario,cant_filas_guardar);           
            break;  
        case 'g_doc':            
        let  cant_filas_doct = 0,m=0;
        cant_filas_doct = myGrid_dcto.getRowsNum();
        let cadena = '';            
        for (let i = 0; i < cant_filas_doct; i++) {
            let iRowId = myGrid_dcto.getRowId(i);
            if(iRowId){
                var data_grabar = myGrid_dcto.getRowData(iRowId);
                // cadena += data_grabar.cod +'@';
                console.log(data_grabar);
                m++;
            }
        }
        // cant_filas_guardar = n;
        // console.log(codproyecto,cadenausuario,cant_filas_guardar);
        // guardarusuarios(codproyecto,cadenausuario,cant_filas_guardar);           
        break;
        case 'verdcto':  
            console.log(myGrid_act_doc.getSelectedRowId());
            sel = myGrid_act_doc.getRowData(myGrid_act_doc.getSelectedRowId());
            verDocumento(sel.codp,sel.fic);
        break;     
        default:
        null;
        break;
    }
};

function addZero(i) {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
}

cargarNuevo= async (codproyecto) => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbuscar", 0, 0, 800, 500);
    Wind_.window("wbuscar").setModal(true);
    Wind_.window("wbuscar").denyResize();
    Wind_.window("wbuscar").center(); 
    Wind_.window("wbuscar").setText('Nueva Actividad');
    mygridact = Winid_.attachLayout('2U');
    mygridact.cells('a').setText('Documentos');
    mygridact.cells('b').setText('Actividad');
    dhtmlx.confirm("Debe elegir un documento", function (result) {
        if (result === Boolean(true)) {
        }
    });
    mygridact.cells('b').collapse();
    acttoolbar = mygridact.cells('b').attachToolbar(); 
    acttoolbar.setIconsPath('/assets/images/icons/');
    acttoolbar.addButton('saveact',null,'Guardar',"ic-acept.png","");
    acttoolbar.attachEvent('onClick', OnClicktoolbar);
    acttoolbar.setIconSize(18); 
    doctoolbar = mygridact.cells('a').attachToolbar(); 
    doctoolbar.setIconsPath('/assets/images/icons/');
    doctoolbar.addButton('next',null,'Siguiente',"ic-acept.png","");
    doctoolbar.attachEvent('onClick', OnClicktoolbar);
    doctoolbar.setIconSize(18); 
    myGrid_dcto = mygridact.cells('a').attachGrid();
    myGrid_dcto.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    myGrid_dcto.setHeader(',,Nombre,Fecha,Usuario'); 
    myGrid_dcto.setColTypes('ch,ro,ro,ro,ro');  
    myGrid_dcto.setInitWidths('30,0,450,100,300');
    myGrid_dcto.setColAlign('center,left,left,left,left');
    myGrid_dcto.setColumnIds('chec,idseq,nom,fec,usuario'); 
    myGrid_dcto.init();  
    myGrid_dcto.clearAll();
    mainLayoutext.cells("b").progressOn();
    myGrid_dcto.load( BASE_URL + 'PO010210/listar-documentos/'+codproyecto).then(function (text) {
        mainLayoutext.cells("b").progressOff();
    });
    actividadForm = mygridact.cells('b').attachForm(f_nuevo_registro);    
    actividadForm.setItemValue('act_estado', 'Pendiente');  
    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth()+1;
    var yyyy = hoy.getFullYear();
    dd=addZero(dd);
    mm=addZero(mm);
    fecha = yyyy+'-'+mm+'-'+dd; 
    actividadForm.setItemValue('act_fecha', fecha);
    cargarSerieact(codproyecto);
    const params = {
        proyecto:  codproyecto
    };
    console.log(codproyecto);
    $.post(BASE_URL + 'PO010210/combo-usuarios/', params, function (res) {
        console.log(res);
        const valor = res.data.usuario;
        actividadForm.reloadOptions('act_asig', valor);
    } , 'json');
    // myGridbuscar.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    // myGridbuscar.setHeader('co_orden_compra,co_catalogo_producto,nu_cantidad,im_precio_total,im_precio_unitario,nu_entregado,co_codigo_arte');
    // myGridbuscar.setInitWidths('150, 300,100,100,100,100,150');
    // myGridbuscar.setColAlign('left, left,center,center,center,center,left');
    // myGridbuscar.setColTypes('ro,ro,ro,ro,ro,ro,ro'); 
    // myGridbuscar.init();     
    // myGridbuscar.clearAll(); 
    // Wind_.window("wbuscar").progressOn();
    // myGridbuscar.load( BASE_URL + 'PO010210/listar-orden-compra/'+codproducto).then(function (text) {
    //     Wind_.window("wbuscar").progressOff();
    //   });       
};

guardarusuarios = (codproyecto,cadenausuario,cant_filas_guardar) => {  
    params = { 
        empresa: usrJson.empresa,
        co_proy: codproyecto,
        usuario: cadenausuario,
        cant_filas: cant_filas_guardar,
    };    
    $.post(BASE_URL + "PO010210/guardar-usuarios", params, function (res) {
        console.log(res); 
        if (res.error) {
            alert(res.error);
            return;
        }
        alert(res.mensaje);
        if (res.state=='error'){  
            dhtmlx.alert({
                title: 'No se guardo el registro',
                type: 'alert-error',
                text: res.error
            });   
        } else {
            dhtmlx.alert({
                title: 'Se guardo correctamente',
                text: res.mensaje
            });   
        }
    }, "json");
};

cargarFormulario = () => {  
    Wind_pyto = new dhtmlXWindows();
    Winid_ = Wind_pyto.createWindow("wformu", 0, 0, 720, 500);
    Wind_pyto.window("wformu").setText("Registrar Proyecto");
    Wind_pyto.window("wformu").setModal(true);
    Wind_pyto.window("wformu").denyResize();
    Wind_pyto.window("wformu").center(); 
    myToolbar = Wind_pyto.window("wformu").attachToolbar();
    myToolbar.setIconsPath('/assets/images/icons/');
    myToolbar.addButton('b_check', null, 'Guardar', "ic-save-dis.svg", null);
    myToolbar.attachEvent('onClick', OnClicktoolbar);
    formproyecto = Wind_pyto.window("wformu").attachForm(f_nuevo_proyect);
    formproyecto.setFontSize("11px"); 
    formproyecto.attachEvent("onButtonClick", async (name) => {
        switch (name) {
            case '__buscarentidad':
                // buscarEntidad();
                break;
            case 'pry_buscar_prod':
                cargarProducto();
                break;
            default:
                null;
                break;
        }
    });   
};

cargarProducto = async () => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbuscar", 0, 0, 800, 500);
    Wind_.window("wbuscar").setText("Vincular Producto");
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
    myToolbar.addButton('b_agregar', null, 'Agregar', "ic-add.png", null);
    myToolbar.attachEvent('onClick', Onprodtoolbar);
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

cargarsustGrid = (producto) => {  
    gridProductop = mainLayoutcab.cells('c').attachGrid();
    gridProductop.setHeader('Código, Descripción,Marca,Submarca,Clase,Familia,Subfamilia,Estado');
    gridProductop.setInitWidths('100,450,150,150,150,150,150,150');
    gridProductop.setColAlign('left,left,left,left,left,left,left,left');
    gridProductop.setColTypes('ro,ro,ro,ro,ro,ro,ro,ro'); 
    gridProductop.init();     
    gridProductop.clearAll(); 
    mainLayoutcab.cells('c').progressOn();
    gridProductop.load( BASE_URL + 'PO010210/listar-producto-padre/'+producto).then(function (text) {
        mainLayoutcab.cells('c').progressOff();
      });  
  };

  cabecerAdjunto = () => {   
    mainLayoutcab = mainLayout.cells('a').attachLayout('2U');   
    mainLayoutasig = mainLayoutcab.cells("a").attachLayout('4C');
    mainLayoutasig.cells("a").setText('Adjuntos'); 
    mainLayoutasig.cells("a").collapse();
    mainLayoutasig.cells("b").setText('Seguimiento'); 
    mainLayoutasig.cells("c").setText('Documentos'); 
    cargarAdjunto(codproducto);
    dctotoolbar = mainLayoutasig.cells('b').attachToolbar(); 
    dctotoolbar.setIconsPath('/assets/images/icons/');
    dctotoolbar.addButton('nvoact',null,'Nuevo',"ic-add.svg","");
    dctotoolbar.addButton('editact',null,'Editar',"ic-edit.svg","");
    dctotoolbar.addButton('aprobar',null,'Aprobar',"ic-like_.png","ic-like_.png");
    dctotoolbar.addButton('desaprobar',null,'Rechazar',"ic-dislike_.png","ic-dislike_.png");
    dctotoolbar.attachEvent('onClick', OnClicktoolbar);
    dctotoolbar.setIconSize(18); 
    myGrid_act = mainLayoutasig.cells('b').attachGrid();
    myGrid_act.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    myGrid_act.setHeader('Proyecto,Actividad,Nombre,Descripción,Asignado a,Estado,Responsable,Fecha Registro'); 
    myGrid_act.setColTypes('ro,ro,ro,ro,ro,ro,ro,ro'); 
    myGrid_act.setInitWidths('0,80,300,300,300,80,300,100');
    myGrid_act.setColAlign('left,left,left,left,left,left,left,left');
    myGrid_act.setColumnIds('codpro,codact,nombre,desc,asig,estado,resp,fecha'); 
    myGrid_act.init();  
    mostrarActividades(codproyecto);  
    actdoctoolbar = mainLayoutasig.cells('c').attachToolbar(); 
    actdoctoolbar.setIconsPath('/assets/images/icons/');
    actdoctoolbar.addButton('verdcto',null,'Ver Archivo',"ic-look.png","");
    actdoctoolbar.attachEvent('onClick', OnClicktoolbar);
    actdoctoolbar.setIconSize(18); 
    myGrid_act_doc = mainLayoutasig.cells('c').attachGrid();
    myGrid_act_doc.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    myGrid_act_doc.setHeader('IDseq,Descripción,Responsable,Estado,Fecha Registro,Observaciones,Cod.producto,Fichero');
    myGrid_act_doc.setColTypes('ro,ro,ro,ro,ro,ro,ro,ro'); 
    myGrid_act_doc.setInitWidths('0,300,300,80,80,300,0,0');
    myGrid_act_doc.setColAlign('left,left,left,center,left,left,left,left');
    myGrid_act_doc.setColumnIds('id,,,,,,codp,fic'); 
    myGrid_act_doc.init();    
    myGrid_act.attachEvent("onRowSelect", function (id, ind) {
       data = myGrid_act.getRowData(myGrid_act.getSelectedRowId());
       myGrid_act_doc.clearAll(); 
       mainLayoutasig.cells('c').progressOn();
       myGrid_act_doc.load( BASE_URL + 'PO010210/mostrar-actividad-documento/'+data.codpro+'/'+data.codact).then(function (text) {
           mainLayoutasig.cells('c').progressOff();
         });  
    });  
    mainLayoutasig.cells("d").setText('Usuarios Involucrados'); 
    asigtoolbar = mainLayoutasig.cells('d').attachToolbar(); 
    asigtoolbar.setIconsPath('/assets/images/icons/');
    asigtoolbar.addButton('addusuario',null,'Agregar',"ic-add.png","");
    asigtoolbar.addButton('aceptar',null,'Grabar',"ic-acept.png","");
    asigtoolbar.addButton('eliminar',null,'Eliminar',"ic-delete.png","");
    asigtoolbar.attachEvent('onClick', OnClicktoolbar);
    myGrid_usuario = mainLayoutasig.cells('d').attachGrid();
    myGrid_usuario.setHeader(',Usuario,Estado,Motivo');    
    myGrid_usuario.setInitWidths('0,300,100,300');
    myGrid_usuario.setColAlign('left,left,left,left');
    myGrid_usuario.setColTypes('ro,ro,ro,ro'); 
    myGrid_usuario.setColumnIds('cod,nom,est,mot'); 
    myGrid_usuario.init();   
    asigtoolbar.setIconSize(18); 
    mainLayoutcab.cells("b").setText('Productos Vinculados'); 
    mainLayoutcab.cells("b").collapse();
    mainLayoutasig.cells("d").collapse();
};

Aprobar = async () => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("waprob", 0, 0, 600, 210);
    Wind_.window("waprob").hideHeader();
    Wind_.window("waprob").setModal(true);
    Wind_.window("waprob").denyResize();
    Wind_.window("waprob").center(); 
    myToolbar = Wind_.window("waprob").attachToolbar();
    myToolbar.setIconsPath('/assets/images/icons/');
    myToolbar.addButton('b_guardar', null, 'Guardar', "ic-acept.png", null);
    myToolbar.addSeparator(null, null);
    myToolbar.addButton('b_desbloquear', null, 'Permisos', "unlock.png", null);
    myToolbar.addSeparator(null, null);
    myToolbar.addButton('b_close', null, 'Cerrar', "ic-cancel-cd.png", null);
    myToolbar.addSeparator(null, null);
    // myToolbar.attachEvent('onClick',toolbarOnptr);
    myFormdatos_pat = Wind_.window("waprob").attachForm(f_aprobacion); 
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

usuarioAsignado = (proyecto) => {    
    myGrid_usuario.clearAll(); 
    mainLayoutasig.cells('d').progressOn();
    myGrid_usuario.load( BASE_URL + 'PO010210/listar-usuarios-asignado/'+proyecto).then(function (text) {
        mainLayoutasig.cells('d').progressOff();
      });  

}

mostrarActividades = (proyecto) => {    
    myGrid_act.clearAll(); 
    mainLayoutasig.cells('b').progressOn();
    myGrid_act.load( BASE_URL + 'PO010210/mostrar-actividades/'+proyecto).then(function (text) {
        mainLayoutasig.cells('b').progressOff();
      });  
}

cargarAdjunto = (codproducto) => {  
    console.log('codproducto');
    const params = {
        empresa:usrJson.empresa,
        entidad:21,
        tipo_doc:663,
        producto:codproducto,
        doc:'DISENO',
        usuario:usrJson.codigo,
        proyecto:codproyecto
    };
  $.post(BASE_URL + 'PO010210/subir-adjunto/', params, function (res) {
    const url = res.data.url_adj; 
    mainLayoutasig.cells("a").attachURL(url.URL);
  } , 'json');  

};

guardarProyecto = () => {  
    arte = 'SIN ARTE';
    motivo = formproyecto.getItemValue('pry_obj');
    objetivo = formproyecto.getItemValue('pry_obj');
    nombre = formproyecto.getItemValue('pry_nombre');
    descripcion = formproyecto.getItemValue('pry_desc');
    codproducto = formproyecto.getItemValue('pry_cod_prod');
    descproducto = formproyecto.getItemValue('pry_desc_prod');   
    var inicio = formproyecto.getItemValue('pry_inicio').toLocaleDateString().replace('/', '-');
    var fin = formproyecto.getItemValue('pry_fin').toLocaleDateString().replace('/', '-');
    const params = {
        empresa: usrJson.empresa,
        usuario:  usrJson.codigo,
        alias:  usrJson.alias,
        objetivo: objetivo,
        nombre: nombre,
        descripcion: descripcion,
        producto: codproducto,
        arte: arte,
        motivo:motivo,
        fe_ini:inicio,
        fe_fin:fin
    };
    console.log(codproducto);
    $.post(BASE_URL + 'PO010210/guardar-proyecto/', params, function (res) {
            console.log(res); 
            if (res.error) {
                return;
            }
            if (res.state=='error'){  
                dhtmlx.alert({
                    title: 'No se guardo el registro',
                    type: 'alert-error',
                    text: res.error
                });   
            } else {
                dhtmlx.alert({
                    title: 'Se guardo correctamente',
                    text: res.mensaje
                });   
                Wind_pyto.window("wformu").close();
                codproyecto = res.mensaje;
                tooolbar.setValue('idproyecto', codproyecto);
                tooolbar.setValue('nomproyecto', nombre);  
                cabecerAdjunto(codproducto);
                usuarioAsignado(codproyecto);
                mostrarProdVinculados(codproducto);

            }
        } , 'json');  
};

cargarSerie = () => {  
  const params = {
      empresa: usrJson.empresa,
  };
  $.post(BASE_URL + 'PO010210/extraer-serie/', params, function (res) {
    console.log(res.data.serie); 
    serie = res.data.serie;
    formproyecto.setItemValue('pry_nro',serie[0].SERIE);
  } , 'json');  

};

cargarSerieact = (codproyecto) => {  
    const params = {
        proyecto: codproyecto,
    };
    $.post(BASE_URL + 'PO010210/extraer-seriea/', params, function (res) {
      console.log(res.data.seriea); 
      seriea = res.data.seriea;
      if(seriea[0].SERIEA==0) {
        serieactividad = 1;
      }else{
        serieactividad = seriea[0].SERIEA + 1;
      }
      actividadForm.setItemValue('act_nro','A000'+serieactividad);
    } , 'json');  
  
};

guardarActividad = (codproyecto,accion,actividad,estado,cadena_idseq,cadena_observaciones,cant_filas) => {      
    nombre = actividadForm.getItemValue('act_nombre');
    desc = actividadForm.getItemValue('act_desc');
    asignado = actividadForm.getItemValue('act_asig'); 
    const params = {
        empresa: usrJson.empresa,
        proyecto: codproyecto,
        accion: accion,
        actividad: actividad,
        usuario:  usrJson.codigo,
        asignado: asignado,
        estado: estado,
        descripcion: desc,
        nombre: nombre,
        cadena_idseq:cadena_idseq,
        cadena_observaciones:cadena_observaciones,
        cant_filas:cant_filas,
    };
    $.post(BASE_URL + 'PO010210/guardar-actividad/', params, function (res) {
            console.log(res.state); 
            if (res.state=='error'){  
                dhtmlx.alert({
                    title: 'No se guardo el registro',
                    type: 'alert-error',
                    text: res.error
                });   
            } else {
                dhtmlx.alert({
                    title: 'Se guardo correctamente',
                    text: res.mensaje
                });   
                Wind_.window("wbuscar").close();
                mostrarActividades(codproyecto); 
            }
        } , 'json');  
};

mostrarProyregistrado= async () => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbuscar", 0, 0, 800, 500);
    Wind_.window("wbuscar").hideHeader();
    Wind_.window("wbuscar").setModal(true);
    Wind_.window("wbuscar").denyResize();
    Wind_.window("wbuscar").center(); 
    myGridbuscar = Winid_.attachGrid();
    myGridbuscar.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    myGridbuscar.setHeader('Cod.Proyecto,Nombre,Descripción,Objetivo,Cod.Producto,Producto por,F.Inicio,F.Fin,Estado,Responsable,Fecha Registro,Responsable Actual');
    myGridbuscar.setInitWidths('100,200,200,200,100,200,100,100,100,200,100,200');
    myGridbuscar.setColAlign('left,left,left,left,left,left,left,left,left,left,left,left');
    myGridbuscar.setColTypes('ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro'); 
    myGridbuscar.setColumnIds('co_proyecto,proyecto,de_descripcion,de_objetivo,co_catalogo_producto,producto,fe_vigencia_inicio,fe_vigencia_fin,es_vigencia,de_razon_social,fe_registra,res_actual');      
    myGridbuscar.init();     
    myGridbuscar.clearAll(); 
    Wind_.window("wbuscar").progressOn();
    myGridbuscar.load( BASE_URL + 'PO010210/listar-proyectos/').then(function (text) {
        Wind_.window("wbuscar").progressOff();
        let num_fila = myGridbuscar.getRowsNum();
        let iRowId;
        for(let i=0;i<num_fila;i++){
            iRowId = myGridbuscar.getRowId(i);
            data = myGridbuscar.getRowData(iRowId);
            if(data.es_vigencia=='Vigente'){
                myGridbuscar.setRowColor(iRowId,"#90EE90");
            }
        }
      });  
      myGridbuscar.attachEvent("onRowSelect", function (id, ind) {
        data = myGridbuscar.getRowData(myGridbuscar.getSelectedRowId())    
        pro_cod = data.co_proyecto;
        pro_desc = data.proyecto;   
        codproducto = data.co_catalogo_producto;    
        Wind_.window("wbuscar").close();
        tooolbar.setValue('idproyecto', pro_cod);
        tooolbar.setValue('nomproyecto', pro_desc);        
        panelProyecto();
        formcreado.setItemValue('pry_nro',data.co_proyecto);
        formcreado.setItemValue('pry_nombre',data.proyecto);
        formcreado.setItemValue('pry_desc',pro_desc);
        formcreado.setItemValue('pry_obj',data.de_objetivo);
        formcreado.setItemValue('pry_cod_prod',data.co_catalogo_producto);
        formcreado.setItemValue('pry_desc_prod',data.producto);
        formcreado.setItemValue('pry_inicio',data.fe_vigencia_inicio);
        formcreado.setItemValue('pry_fin',data.fe_vigencia_fin);
        formcreado.setItemValue('pry_cod_usuario',usrJson.codigo);
        formcreado.setItemValue('pry_usuario',data.de_razon_social);
        cargarsustGrid(data.co_catalogo_producto);
        mostrarProdVinculados(data.co_catalogo_producto);
        cabecerAdjunto(data.co_catalogo_producto);
        // cargarArchivos(pro_cod);
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

mostrarProdVinculados= async (producto) => {
    mainLayoutext = mainLayoutcab.cells("b").attachLayout('2E'); 
    // mainLayoutextc = mainLayoutext.cells("a").attachLayout('2E')
    mainLayoutdet = mainLayoutext.cells("a").attachLayout('2U'); 
    mainProdcabecera = mainLayoutdet.cells('a').attachGrid();
    mainLayoutdet.cells('a').setText('Productos');
    mainLayoutext.cells('b').setText('Reporte');
    mainLayoutdet.cells('b').collapse();
    mainLayoutext.cells('b').collapse();
    mainProdcabecera.setHeader('Codigo,Descripcion,Estado');
    mainProdcabecera.setInitWidths('100,520,100');
    mainProdcabecera.setColAlign('left,left,left');
    mainProdcabecera.setColTypes('ro,ro,ro'); 
    mainProdcabecera.setColumnIds('cod,nombre,estado');      
    mainProdcabecera.init();     
    mainProdcabecera.clearAll(); 
    mainLayoutdet.cells('a').progressOn();
    mainProdcabecera.load( BASE_URL + 'PO010210/listar-productos-vinculados/'+producto).then(function (text) {
        mainLayoutdet.cells('a').progressOff();
      });  
    mainLayoutdet.cells('b').setText('Componentes');
    mainLayoutdet.cells('a').collapse();
    mainProddetalle = mainLayoutdet.cells('b').attachGrid();
    mainProddetalle.setHeader(',Cod.Producto,Descripción,Tipo,,Stock');
    mainProddetalle.setInitWidths('0,100,500,200,0,50');
    mainProddetalle.setColumnHidden(0,true);
    mainProddetalle.setColumnHidden(4,true);
    mainProddetalle.setColAlign('left,left,left,left,left,leftleft');
    mainProddetalle.setColTypes('ro,ro,ro,ro,ro,ro,ro');   
    mainProddetalle.setColumnIds('cod,nombre,estado,stock'); 
    mainProddetalle.init();  
    mainProdcabecera.attachEvent("onRowSelect", function (id, ind) {
    data = mainProdcabecera.getRowData(mainProdcabecera.getSelectedRowId()); 
    mainLayoutdet.cells('a').collapse();      
    mostrarComponentes(data.cod);
    });
};

mostrarComponentes= async (producto) => { 
    mainProddetalle.clearAll(); 
    mainLayoutdet.cells('b').progressOn();
    mainProddetalle.load( BASE_URL + 'PO010210/listar-formula/'+usrJson.empresa+'/'+producto).then(function (text) {
        mainLayoutdet.cells('b').progressOff();
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
    myGridbuscar.setHeader('co_orden_compra,co_catalogo_producto,nu_cantidad,im_precio_total,im_precio_unitario,nu_entregado,co_codigo_arte');
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

cargarArchivos = (codproyecto) => {  
    myGrid_dcto.clearAll();
    mainLayoutext.cells("b").progressOn();
    myGrid_dcto.load( BASE_URL + 'PO010210/listar-documentos/'+codproyecto).then(function (text) {
        mainLayoutext.cells("b").progressOff();
    });
};

buscarEntidad = async (name) => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbusq", 0, 0, 800, 500);
    Wind_.window("wbusq").hideHeader();
    Wind_.window("wbusq").setModal(true);
    Wind_.window("wbusq").denyResize();
    Wind_.window("wbusq").center();
    myToolbar = Wind_.window("wbusq").attachToolbar();
    myToolbar.setIconsPath('/assets/images/icons/');    
    myToolbar.addText(null, null, 'ENTIDAD : ');
    myToolbar.addInput('in_busq', null, '', 200);
    myToolbar.addSeparator(null, null);    
    myToolbar.addButton('b_busq', null, 'Buscar', 'ic-search.svg', null);
    myToolbar.addSeparator();
    myToolbar.addButton('b_close', null, 'Cerrar', 'ic-close.svg', 'ic-close-dis.svg');
    myToolbar.attachEvent("onClick", (id) => {
        (id === 'b_close') ? Wind_.window("wbusq").close() : cargarListaEntidad(Wind_, myToolbar.getValue('in_busq'));
    });
    myToolbar.attachEvent("onEnter", (id) => {
        cargarListaEntidad(Wind_, myToolbar.getValue('in_busq').toUpperCase());
    });
};


cargarListaEntidad = (win,valor) => {
    myGrid = Winid_.attachGrid();
    myGrid.setHeader('Código,Razón Social');
    myGrid.setInitWidthsP('30,70');
    myGrid.setColTypes('ro,ro');
    myGrid.setColumnIds("cod_entidad,raz_social_cata");
    myGrid.attachHeader("#text_filter,#text_filter");
    myGrid.clearAll();
    myGrid.init();
    myGrid.attachEvent("onRowSelect", function (id, ind) {
        data = myGrid.getRowData(myGrid.getSelectedRowId())
        cod = data.cod_entidad;
        raz_soc_cata = data.raz_social_cata;
        myGrid_usuario.addRow(myGrid_usuario.uid(),[cod,raz_soc_cata,'Vigente',''],1);
    });
    win.window("wbusq").progressOn();
    myGrid.clearAll();
    myGrid.load( BASE_URL + 'PO010210/listar-entidad/'+ valor).then(function (text) {
        win.window("wbusq").progressOff();
    });
};


mostrarProyectodetalle = async (proyecto) => {
    console.log('saq: '+codproducto)
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbusq", 0, 0, 1000, 500);
    win_info = Wind_.window("wbusq").attachLayout('2E');
    Wind_.window("wbusq").setText(proyecto+'/ '+codproducto);
    Wind_.window("wbusq").setModal(true);
    Wind_.window("wbusq").denyResize();
    Wind_.window("wbusq").center();
    win_info.cells('a').hideHeader();
    win_info.cells('b').setText('Sustitutos');
    win_info.cells('a').setHeight(100);
    myGrid = win_info.cells('a').attachGrid();
    myGrid.setHeader('Cod.Proyecto,Nombre,Descripción,Objetivo,Cod.Producto,Producto por,F.Inicio,F.Fin,Estado,Responsable,Fecha Registro');
    myGrid.setInitWidths('110,200,200,200,100,200,100,100,100,350,100');
    myGrid.setColAlign('left,left,left,left,left,left,left,left,left,left,left');
    myGrid.setColTypes('ed,ed,ed,ed,ed,ed,ed,ed,ed,ed,ed'); 
    myGrid.clearAll();
    myGrid.init();
    win_info.cells('a').progressOn();
    myGrid.load( BASE_URL + 'PO010210/mostrar-detalle-proyecto/'+ proyecto).then(function (text) {
        win_info.cells('a').progressOff();
    });
    gridProductop = win_info.cells('b').attachGrid();
    gridProductop.setHeader('Código, Descripción,Marca,Submarca,Clase,Familia,Subfamilia,Estado');
    gridProductop.setInitWidths('180,450,150,150,150,150,150,150');
    gridProductop.setColAlign('left,left,left,left,left,left,left,left');
    gridProductop.setColTypes('ro,ro,ro,ro,ro,ro,ro,ro'); 
    gridProductop.init();     
    gridProductop.clearAll(); 
    win_info.cells('b').progressOn();
    gridProductop.load( BASE_URL + 'PO010210/listar-producto-padre/'+codproducto).then(function (text) {
        win_info.cells('b').progressOff();
      });  
};

verDocumento = (producto,archivo) => {
    WinContainer = new dhtmlXWindows();
    WinDocumentoViewer = WinContainer.createWindow('WinDocumentoViewer', 320, 0, 750, 600);
    WinDocumentoViewer.keepInViewport();
    WinDocumentoViewer.setText('Ver Documento');
    const params = {
        empresa:usrJson.empresa,
        usuario:usrJson.codigo,
        producto:producto,
        archivo:archivo,
        tipo_doc:663,
    };
    console.log(params);
    $.post(BASE_URL + 'PO010208/mostrar-documento-por-producto/', params, function (res) {
        const url = res.data.url_adj; 
        WinDocumentoViewer.attachURL(url.URL);
    } , 'json'); 
};

guardardocumento = (codproyecto,cadenausuario,cant_filas_guardar) => {  
    params = { 
        empresa: usrJson.empresa,
        co_proy: codproyecto,
        usuario: cadenausuario,
        cadena_docu: cadena_docu,
        cadena_asignada: cadena_asignada,
        cadena_observ: cadena_observ,
        cadena_cerrado: cadena_cerrado,
        cadena_reasignado: cadena_reasignado,
        cant_filas: cant_filas_guardar,
        cadena_idseq: cadena_idseq,
    };    
    $.post(BASE_URL + "PO010210/guardar-usuarios", params, function (res) {
        console.log(res); 
        if (res.error) {
            alert(res.error);
            return;
        }
        alert(res.mensaje);
        if (res.state=='error'){  
            dhtmlx.alert({
                title: 'No se guardo el registro',
                type: 'alert-error',
                text: res.error
            });   
        } else {
            dhtmlx.alert({
                title: 'Se guardo correctamente',
                text: res.mensaje
            });   
        }
    }, "json");
};


