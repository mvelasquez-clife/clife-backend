var codproducto,formproyecto,formcreado,codproyecto,nomproyecto,serieactividad,varAct,subtarea,co_subtarea,varEdit;

cargarAlerta = () => {  
  const params = {
      usuario: usrJson.codigo,
  };
  $.post(BASE_URL + 'PO010210/aviso-revisar/', params, function (res) {
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
    myGridbuscar.groupBy(0);
    myGridbuscar.setHeader('Cod.Proyecto,Nombre,Descripción,Actividad Pendiente,Responsable Actual,,Objetivo,F.Inicio,F.Fin,Estado,Cod.Producto,Producto,Responsable,Fecha Registro');
    myGridbuscar.setInitWidths('110,200,200,200,250,25,200,100,100,100,100,350,300,100');
    myGridbuscar.setColAlign('left,left,left,left,left,center,left,center,center,left,left,left,left,center');
    myGridbuscar.setColTypes('ed,ed,ed,ed,ed,img,ed,ed,ed,ed,ed,ed,ed,ed'); 
    myGridbuscar.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,,#text_filter,#text_filter,#text_filter,#combo_filter,#text_filter,#text_filter,#text_filter,#text_filter");
    myGridbuscar.setColumnIds('co_proyecto,proyecto,de_descripcion,de_actividad,res_actual,ver_proy,de_objetivo,fe_vigencia_inicio,fe_vigencia_fin,es_vigencia,co_catalogo_producto,producto,de_razon_social,fe_registra');    
    // co_proyecto,proyecto,de_descripcion,de_actividad,de_responsable_actual,de_objetivo,'ic-flecha.svg^Ver',fe_vigencia_inicio,fe_vigencia_fin,es_vigencia,co_catalogo_producto,producto,de_razon_social,fe_registra
    myGridbuscar.init();     
    myGridbuscar.clearAll(); 
    mainLayout.cells('a').progressOn();
    myGridbuscar.load( BASE_URL + 'PO010210/listar-proyectos/').then(function (text) {
        mainLayout.cells('a').progressOff();
        myGridbuscar.groupBy(0);
        let num_fila = myGridbuscar.getRowsNum();
        let iRowId;
        for(let i=0;i<num_fila;i++){
            iRowId = myGridbuscar.getRowId(i);
            data = myGridbuscar.getRowData(iRowId);
            if(data.de_actividad=='Sin actividad pendiente'){
                myGridbuscar.setRowColor(iRowId,"#AED6F1");
            }else{
                myGridbuscar.setRowColor(iRowId,"#EB984E");
            };
        }
      }); 
      
    myGridbuscar.attachEvent("onRowSelect", function (rowId,colId) {
        switch(colId) {
            case 5:
            data = myGridbuscar.getRowData(myGridbuscar.getSelectedRowId());    
            pro_cod = data.co_proyecto;
            pro_desc = data.proyecto;   
            codproducto = data.co_catalogo_producto;   
            codproyecto = pro_cod;
            nomproyecto = pro_desc;
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
        case '__proyfin':
            Terminado();
            break;
        default:
        null;
        break;
    }
};
OndocClick= async (id) => {
    switch (id) {
        case 'subir':          
            cargarAdjunto(codproducto,co_subtarea);
        break;     
        case 'actualizar':      
            cargarAdjuntoact(co_subtarea);
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
            if (sel_act.estado=='Pendiente'){
                cargarSubactividad(sel_act.nombre,sel_act.codact,sel_act.subcact,'S');
                actividadForm.setItemValue('act_nro',sel_act.codact);
                actividadForm.setItemValue('act_nombre',sel_act.nombre);
                actividadForm.setItemValue('act_desc',sel_act.desc);
                actividadForm.setItemValue('act_asig',sel_act.asig);
                actividadForm.setItemValue('act_estado',sel_act.estado);
                actividadForm.setItemValue('act_fecha',sel_act.fecha);
            }else{
                dhtmlx.alert({
                    title: 'Aviso',
                    type: 'alert-error',
                    text: 'Esta actividad ya fue atendida'
                });   
            }
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
            existeInvolucrado(codproyecto);
        break;   
        case 'saveact':  
           guardarActividad(codproyecto,'N','N','Pendiente','N','N','N','N');
            //codproyecto,accion,actividad,estado,var_actividad,actividad_ant,estado_ant,subtarea  
        break;
        case 'savesubact':           
            estado = actividadForm.getItemValue('act_estado');   
            activi_ant = actividadForm.getItemValue('act_actividad');             
            //pruebaEmail('email de pruebas');   
           guardarActividad(codproyecto,'N','N','Pendiente','S',activi_ant,estado,subtarea);  
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
        case 'atender':  
        sel_act = myGrid_act.getRowData(myGrid_act.getSelectedRowId());
        if (sel_act.estado=='Pendiente'){
            cargarSubactividad(sel_act.nombre,sel_act.codact,sel_act.subcact,'N');
        }else{
            dhtmlx.alert({
                title: 'Aviso',
                type: 'alert-error',
                text: 'Esta actividad ya fue atendida'
            });   
        }
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
            guardarusuarios(codproyecto,cadenausuario,cant_filas_guardar,'A');           
            break; 
        case 'eliminar':   
                col  = myGrid_usuario.getSelectedRowId();
                if(col) {
                    sel  = myGrid_usuario.getRowData(col);
                    dhtmlx.confirm("¿Está seguro?", function (result) {
                        if (result === Boolean(true)) {
                            guardarusuarios(codproyecto,sel.cod,1,'E');  
                        } 
                    });
                }else{
                    dhtmlx.confirm("Debe seleccionar un usuario", function (result) {
                    });
                }
        break;
        case 'verdcto':  
            sel = myGrid_act_doc.getRowData(myGrid_act_doc.getSelectedRowId());
            verDocumento(sel.codp,sel.fic);
        break;             
        case 'cerrar':   
            CerrarProyecto(codproyecto);    
        break;         
        case 'cact':          
            col  = myGrid_act.getSelectedRowId();
            if(col) {
                sel  = myGrid_act.getRowData(col);
                dhtmlx.confirm("¿Está seguro?", function (result) {                    
                    if (result === Boolean(true)) {
                        SetActividad(codproyecto,'C',sel.codact,sel.subcact);
                    }
                });
            }else{
                dhtmlx.confirm("Seleccione una actividad", function (result) {
                });
            }
        break;     
        case 'abrir':    
            col  = myGrid_act.getSelectedRowId();
            if(col) {
                sel  = myGrid_act.getRowData(col);
                dhtmlx.confirm("¿Está seguro?", function (result) {                    
                    if (result === Boolean(true)) {
                        SetActividad(codproyecto,'A',sel.codact,'1');
                    }
                });
            }else{
                dhtmlx.confirm("Seleccione una actividad", function (result) {
                });
            }
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

existeInvolucrado = (codigo) => {  
    const params = {
        usuario: usrJson.codigo,
        empresa: usrJson.empresa,
        co_proy: codigo
    };
    $.post(BASE_URL + 'PO010210/aviso-sin-usuarios/', params, function (res) {
      respuesta = res.data.respuesta;
      if (respuesta[0].RESPUESTA>0){
        cargarNuevo(codigo);
      }else{        
        dhtmlx.alert({
            title:'Aviso',
            type: 'alert-error',
            text: 'Este proyecto no tiene usuarios involucrados'
        });                      
        mainLayoutasig.cells("a").collapse();               
        mainLayoutasig.cells("b").collapse();                  
        mainLayoutasig.cells("c").expand();   
      }

    } , 'json');  
  
  };

cargarNuevo= async (codproyecto) => {
    varAct = 'N',
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbuscar", 0, 0, 750, 500);
    Wind_.window("wbuscar").setModal(true);
    Wind_.window("wbuscar").denyResize();
    Wind_.window("wbuscar").center(); 
    Wind_.window("wbuscar").setText('Nueva Actividad');
    mygridact = Winid_.attachLayout('2E');
    mygridact.cells('a').setText('Actividad');
    mygridact.cells('b').setText('Documentos');
    mygridact.cells('b').collapse();
    acttoolbar = mygridact.cells('a').attachToolbar(); 
    acttoolbar.setIconsPath('/assets/images/icons/');
    acttoolbar.addButton('saveact',null,'Guardar',"ic-acept.png","");
    acttoolbar.attachEvent('onClick', OnClicktoolbar);
    acttoolbar.setIconSize(18); 
    doctlbar = mygridact.cells('b').attachToolbar(); 
    doctlbar.setIconsPath('/assets/images/icons/');
    doctlbar.addButton('subir',null,'Subir Archivo',"ic-file.png","");
    doctlbar.addButton('eliminar',null,'Eliminar',"ic-delete.png","");
    doctlbar.addButton('actualizar',null,'Actualizar',"ic-refresh.png","");
    doctlbar.attachEvent('onClick', OndocClick);
    doctlbar.setIconSize(18); 
    myGrid_dcto = mygridact.cells('b').attachGrid();
    myGrid_dcto.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    myGrid_dcto.setIconsPath('/assets/images/icons/');
    myGrid_dcto.setHeader(',IDseq,Descripción,Responsable,Estado,Fecha Registro,Cod.producto,Fichero');
    myGrid_dcto.setColTypes('img,ro,ro,ro,ro,ro,ro,ro'); 
    myGrid_dcto.setInitWidths('30,0,300,300,80,80,0,0');
    myGrid_dcto.setColAlign('left,left,left,left,center,left,left,left');
    myGrid_dcto.setColumnIds('ver,id,,,,,codp,fic'); 
    myGrid_dcto.init();
    myGrid_dcto.attachEvent("onRowSelect", function (rowId,colId) {
        switch(colId) {
            case 0:
                sel = myGrid_dcto.getRowData(myGrid_dcto.getSelectedRowId());
                verDocumento(sel.codp,sel.fic);
                break;
            default: break;
        }
     });   
    actividadForm = mygridact.cells('a').attachForm(f_nuevo_registro);    
    actividadForm.setItemValue('act_estado', 'Pendiente');  
    actividadForm.setFontSize("10px");
    actividadForm.disableItem('act_estado');
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
    $.post(BASE_URL + 'PO010210/combo-usuarios/', params, function (res) {
        const valor = res.data.usuario;
        actividadForm.reloadOptions('act_asig', valor);
    } , 'json');
};

cargarSubactividad= async (asunto,codact,sbact,editar) => {
    varAct = 'S'
    subtarea = sbact;
    varEdit = editar;
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbuscar", 0, 0, 750, 500);
    Wind_.window("wbuscar").setModal(true);
    Wind_.window("wbuscar").denyResize();
    Wind_.window("wbuscar").center(); 
    Wind_.window("wbuscar").setText('Atender');
    mygridact = Winid_.attachLayout('2E');
    mygridact.cells('a').setText('Actividad');
    mygridact.cells('b').setText('Documentos');
    mygridact.cells('b').collapse();
    doctlbar = mygridact.cells('b').attachToolbar(); 
    doctlbar.setIconsPath('/assets/images/icons/');
    doctlbar.addButton('subir',null,'Subir Archivo',"ic-file.png","");
    doctlbar.addButton('eliminar',null,'Eliminar',"ic-delete.png","");
    doctlbar.addButton('actualizar',null,'Actualizar',"ic-refresh.png","");
    doctlbar.attachEvent('onClick', OndocClick);
    doctlbar.setIconSize(18); 
    myGrid_dcto = mygridact.cells('b').attachGrid();
    myGrid_dcto.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    myGrid_dcto.setIconsPath('/assets/images/icons/');
    myGrid_dcto.setHeader(',IDseq,Descripción,Responsable,Estado,Fecha Registro,Cod.producto,Fichero');
    myGrid_dcto.setColTypes('img,ro,ro,ro,ro,ro,ro,ro'); 
    myGrid_dcto.setInitWidths('30,0,300,300,80,80,0,0');
    myGrid_dcto.setColAlign('left,left,left,left,center,left,left,left');
    myGrid_dcto.setColumnIds('ver,id,,,,,codp,fic'); 
    myGrid_dcto.init();
    myGrid_dcto.attachEvent("onRowSelect", function (rowId,colId) {
        switch(colId) {
            case 0:
                sel = myGrid_dcto.getRowData(myGrid_dcto.getSelectedRowId());
                verDocumento(sel.codp,sel.fic);
                break;
            default: break;
        }
     });   
     cargarAdjuntoact(sbact);
    acttoolbar = mygridact.cells('a').attachToolbar(); 
    acttoolbar.setIconsPath('/assets/images/icons/');
    acttoolbar.addButton('savesubact',null,'Guardar',"ic-acept.png","");
    acttoolbar.attachEvent('onClick', OnClicktoolbar);
    acttoolbar.setIconSize(18); 
    actividadForm = mygridact.cells('a').attachForm(f_nuevo_registro);    
    actividadForm.setItemValue('act_estado', 1);  
    actividadForm.setFontSize("10px");
    actividadForm.setItemValue('act_nombre',asunto);   
    actividadForm.setItemValue('act_actividad',codact);    
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
    $.post(BASE_URL + 'PO010210/combo-usuarios/', params, function (res) {
        const valor = res.data.usuario;
        actividadForm.reloadOptions('act_asig', valor);
    } , 'json');
};

guardarusuarios = (codproyecto,cadenausuario,cant_filas_guardar,accion) => {  
    params = { 
        empresa: usrJson.empresa,
        usuario: usrJson.codigo,
        co_proy: codproyecto,
        cad_usuario: cadenausuario,
        cant_filas: cant_filas_guardar,
        accion : accion
    };    
    $.post(BASE_URL + "PO010210/guardar-usuarios", params, function (res) {
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
            usuarioAsignado(codproyecto);
        }
    }, "json");
};

SetActividad = (proyecto,accion,actividad,item) => {  
    params = { 
        empresa: usrJson.empresa,
        proyecto: proyecto,
        accion : accion,
        actividad : actividad,
        usuario : usrJson.codigo,
        item : item
    };    
    $.post(BASE_URL + "PO010210/set-actividad", params, function (res) {
        if (res.state=='error'){  
            dhtmlx.alert({
                title: 'Ocurrio un error',
                type: 'alert-error',
                text: res.error
            });   
        } else {
            dhtmlx.alert({
                title: 'Bien',
                text: res.mensaje
            });   
            mostrarActividades(proyecto);
        }
    }, "json");
};

CerrarProyecto = (proyecto) => {  
    params = { 
        empresa: usrJson.empresa,
        proyecto: proyecto,
        usuario : usrJson.codigo
    };    
    $.post(BASE_URL + "PO010210/cerrar-proyecto", params, function (res) {
        if (res.state=='error'){  
            dhtmlx.alert({
                title: 'Aviso',
                type: 'alert-error',
                text: res.error
            });   
        } else {
            dhtmlx.alert({
                title: 'Bien',
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

cargarAdjuntoact = (subtarea) => {  
    myGrid_dcto.clearAll(); 
    mygridact.cells('b').progressOn();
    myGrid_dcto.load( BASE_URL + 'PO010210/mostrar-actividad-documento/'+codproyecto+'/'+subtarea).then(function (text) {    
        mygridact.cells('b').progressOff();
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
    mainLayoutasig = mainLayoutcab.cells("a").attachLayout('3E');
    mainLayoutasig.cells('a').setText('Seguimiento'); 
    mainLayoutasig.cells("b").setText('Documentos'); 
    mainLayoutasig.cells("a").setHeight(600);
    dctotoolbar = mainLayoutasig.cells('a').attachToolbar(); 
    dctotoolbar.setIconsPath('/assets/images/icons/');
    dctotoolbar.addButton('nvoact',null,'Nuevo',"ic-add.svg","");
    dctotoolbar.addButton('editact',null,'Editar',"ic-edit.svg","");
    dctotoolbar.addButton('atender',null,'Atender',"ic-answer.svg","ic-answer.svg");
    dctotoolbar.addButton('abrir',null,'Abrir Actividad',"ic-abrir.svg","ic-abrir.svg");
    dctotoolbar.addButton('cact',null,'Cerrar Actividad',"ic-cerrar.svg","ic-cerrar.svg");
    dctotoolbar.addButton('cerrar',null,'Terminar Proyecto',"ic-fin.svg","ic-fin.svg");
    dctotoolbar.attachEvent('onClick', OnClicktoolbar);
    dctotoolbar.setIconSize(18); 
    myGrid_act = mainLayoutasig.cells('a').attachGrid();
    myGrid_act.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    myGrid_act.groupBy(0);
    myGrid_act.setHeader('Asunto,Proyecto,Sub Actividad,Actividad,Nombre,Descripción,Asignado a,Estado,Responsable,Fecha Registro'); 
    myGrid_act.setColTypes('ro,ro,ro,ro,ro,ro,ro,ro,ro,ro'); 
    myGrid_act.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#select_filter,#select_filter,#text_filter,#text_filter");
    myGrid_act.setInitWidths('0,0,80,0,0,600,300,80,300,100');
    myGrid_act.setColAlign('left,left,left,left,left,left,left,left,left,left');
    myGrid_act.setColumnIds('asun,codpro,subcact,codact,nombre,desc,asig,estado,resp,fecha'); 
    myGrid_act.init();  
    mostrarActividades(codproyecto);  
    actdoctoolbar = mainLayoutasig.cells('b').attachToolbar(); 
    actdoctoolbar.setIconsPath('/assets/images/icons/');
    actdoctoolbar.addButton('verdcto',null,'Ver Archivo',"ic-report.png","");
    actdoctoolbar.attachEvent('onClick', OnClicktoolbar);
    actdoctoolbar.setIconSize(18); 
    myGrid_act_doc = mainLayoutasig.cells('b').attachGrid();
    myGrid_act_doc.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    myGrid_act_doc.setIconsPath('/assets/images/icons/');
    myGrid_act_doc.setHeader(',IDseq,Descripción,Responsable,Estado,Fecha Registro,Cod.producto,Fichero');
    myGrid_act_doc.setColTypes('img,ro,ro,ro,ro,ro,ro,ro'); 
    myGrid_act_doc.setInitWidths('0,0,300,300,80,80,0,0');
    myGrid_act_doc.setColAlign('left,left,left,left,center,left,left,left');
    myGrid_act_doc.setColumnIds('ver,id,,,,,codp,fic'); 
    myGrid_act_doc.init();    
    myGrid_act.attachEvent("onRowSelect", function (id, ind) {
       data = myGrid_act.getRowData(myGrid_act.getSelectedRowId());
       myGrid_act_doc.clearAll(); 
       mainLayoutasig.cells('b').progressOn();
       myGrid_act_doc.load( BASE_URL + 'PO010210/mostrar-actividad-documento/'+data.codpro+'/'+data.subcact).then(function (text) {
            
            mainLayoutasig.cells('b').progressOff();
         });  
    });  
    mainLayoutasig.cells("c").setText('Usuarios Involucrados'); 
    asigtoolbar = mainLayoutasig.cells('c').attachToolbar(); 
    asigtoolbar.setIconsPath('/assets/images/icons/');
    asigtoolbar.addButton('addusuario',null,'Agregar',"ic-add.png","");
    asigtoolbar.addButton('eliminar',null,'Eliminar',"ic-delete.png","");
    asigtoolbar.addButton('aceptar',null,'Grabar',"ic-acept.png","");
    asigtoolbar.attachEvent('onClick', OnClicktoolbar);
    myGrid_usuario = mainLayoutasig.cells('c').attachGrid();
    myGrid_usuario.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    myGrid_usuario.setHeader(',Usuario,Estado');    
    myGrid_usuario.setInitWidths('0,300,100');
    myGrid_usuario.setColAlign('left,left,left');
    myGrid_usuario.setColTypes('ro,ro,ro'); 
    myGrid_usuario.setColumnIds('cod,nom,est'); 
    myGrid_usuario.init();   
    asigtoolbar.setIconSize(18); 
    mainLayoutcab.cells("b").setText('Productos Vinculados'); 
    mainLayoutcab.cells("b").collapse();
    mainLayoutasig.cells("c").collapse();
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
    mainLayoutasig.cells('c').progressOn();
    myGrid_usuario.load( BASE_URL + 'PO010210/listar-usuarios-asignado/'+proyecto).then(function (text) {
        mainLayoutasig.cells('c').progressOff();
      });  

}

mostrarActividades = (proyecto) => {    
    myGrid_act.clearAll(); 
    mainLayoutasig.cells('a').progressOn();
    myGrid_act.load( BASE_URL + 'PO010210/mostrar-actividades/'+proyecto).then(function (text) {
        myGrid_act.groupBy(0);
        mainLayoutasig.cells('a').progressOff();
        let iRowac;
        num_fila = myGrid_act.getRowsNum();
        for(let i=0;i<num_fila;i++){
            iRowac = myGrid_act.getRowId(i);
            data = myGrid_act.getRowData(iRowac);
            if(data.estado=='Pendiente'){
                myGrid_act.setRowColor(iRowac,"#F7D358");
            }else{
                if(data.estado=='Aprobado'||data.estado=='Revisado'){
                    myGrid_act.setRowColor(iRowac,"#90EE90");
                }else{
                    myGrid_act.setRowColor(iRowac,"#EC7063");
                }
            }
        }
      });  
}

cargarAdjunto = (codproducto,subact) => {     
    WinContainer = new dhtmlXWindows();
    WinDocumentoViewer = WinContainer.createWindow('WinDocumentoViewer', 320, 0, 750, 600);
    WinDocumentoViewer.keepInViewport();
    WinDocumentoViewer.center();   
    WinDocumentoViewer.setText('Mostrando documento ');
    const params = {
        empresa:usrJson.empresa,
        entidad:21,
        tipo_doc:663,
        producto:codproducto,
        doc:'DISENO',
        usuario:usrJson.codigo,
        proyecto:codproyecto+'_'+subact
    };
  $.post(BASE_URL + 'PO010210/subir-adjunto/', params, function (res) {
    const url = res.data.url_adj; 
    WinDocumentoViewer.attachURL(url.URL);
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
    $.post(BASE_URL + 'PO010210/guardar-proyecto/', params, function (res) {
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
                    title: 'Importante',
                    type:  'alert-error',
                    text:  'Debe agregar a los involucrados del proyecto'
                });  
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
                mainLayoutasig.cells("a").collapse();               
                mainLayoutasig.cells("b").collapse();                  
                mainLayoutasig.cells("c").expand();   
            }
        } , 'json');  
};

cargarSerie = () => {  
  const params = {
      empresa: usrJson.empresa,
  };
  $.post(BASE_URL + 'PO010210/extraer-serie/', params, function (res) {
    serie = res.data.serie;
    formproyecto.setItemValue('pry_nro',serie[0].SERIE);
  } , 'json');  

};

cargarSerieact = (codproyecto) => {  
    const params = {
        proyecto: codproyecto,
    };
    $.post(BASE_URL + 'PO010210/extraer-seriea/', params, function (res) {
      seriea = res.data.seriea;
      if(seriea[0].SERIEA==0) {
        serieactividad = 1;
      }else{
        serieactividad = seriea[0].SERIEA + 1;
      }
      actividadForm.setItemValue('act_nro','A000'+serieactividad);
    } , 'json');  
  
};
///prueba-email
pruebaEmail = (asunto,nomproyecto,nombre,desc) => {          
    const params = {
        asunto:asunto,
        nomproyecto:nomproyecto,
        nombre:nombre,
        desc:desc
    };
    $.post(BASE_URL + 'PO010210/prueba-email/', params, function (res) {
        } , 'json');  
};

guardarActividad = (codproyecto,accion,actividad,estado,var_actividad,actividad_ant,estado_ant,subtarea) => {      
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
        var_actividad:var_actividad,
        actividad_ant:actividad_ant,
        estado_ant:estado_ant,
        subtarea:subtarea
    };
    $.post(BASE_URL + 'PO010210/guardar-actividad/', params, function (res) {
            if (res.state=='error'){  
                dhtmlx.alert({
                    title: 'No se guardo el registro',
                    type: 'alert-error',
                    text: res.error
                });   
            } else {
                dhtmlx.alert({
                    title: 'Importante',
                    type: 'alert-error',
                    text: 'Adjuntar documento',
                });  
                dhtmlx.alert({
                    title: 'Actividad guardada',
                    text: res.mensaje
                });                   
                mostrarActividades(codproyecto); 
                mygridact.cells('a').collapse();
                co_subtarea = res.mensaje;
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
    // myGridbuscar.setHeader('Cod.Proyecto,Nombre,Descripción,Objetivo,Cod.Producto,Producto por,F.Inicio,F.Fin,Estado,Responsable,Fecha Registro,Responsable Actual');
    // myGridbuscar.setInitWidths('100,200,200,200,100,200,100,100,100,200,100,200');
    // myGridbuscar.setColAlign('left,left,left,left,left,left,left,left,left,left,left,left');
    // myGridbuscar.setColTypes('ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro'); 
    // myGridbuscar.setColumnIds('co_proyecto,proyecto,de_descripcion,de_objetivo,co_catalogo_producto,producto,fe_vigencia_inicio,fe_vigencia_fin,es_vigencia,de_razon_social,fe_registra,res_actual');      
    co_proyecto,proyecto,de_descripcion,de_actividad,de_responsable_actual,de_objetivo,'ic-flecha.svg^Ver',fe_vigencia_inicio,fe_vigencia_fin,es_vigencia,co_catalogo_producto,producto,de_razon_social,fe_registra
    myGridbuscar.setHeader('Cod.Proyecto,Nombre,Descripción,Actividad Pendiente,Responsable Actual,Objetivo,Cod.Producto,Producto por,F.Inicio,F.Fin,Estado,Responsable Proyecto,Fecha Registro');
    myGridbuscar.setInitWidths('100,200,200,500,200,200,100,200,100,100,100,200,100');
    myGridbuscar.setColAlign('left,left,left,left,left,left,left,left,left,left,left,left,left,left');
    myGridbuscar.setColTypes('ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro'); 
    myGridbuscar.setColumnIds('co_proyecto,proyecto,de_descripcion,de_actividad,res_actual,de_objetivo,co_catalogo_producto,producto,fe_vigencia_inicio,fe_vigencia_fin,es_vigencia,de_razon_social,fe_registra');   
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
    mainProddetalle.setHeader(',Cod.Producto,Descripción,Stock,Tipo,');
    mainProddetalle.setInitWidths('0,100,500,80,200,50');
    mainProddetalle.setColumnHidden(0,true);
    mainProddetalle.setColumnHidden(5,true);
    mainProddetalle.setColAlign('left,left,left,left,left,left');
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
    WinDocumentoViewer.center();   
    WinDocumentoViewer.setText('Ver Documento');
    const params = {
        empresa:usrJson.empresa,
        usuario:usrJson.codigo,
        producto:producto,
        archivo:archivo,
        tipo_doc:663,
    };
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

Terminado = () => {    
    mainLayout = tabbarinicio.cells("__proyfin").attachLayout('1C');    
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
    myGridbuscar.setHeader('Cod.Proyecto,Nombre,Descripción,Responsable,,Objetivo,F.Inicio,F.Fin,Estado,Cod.Producto,Producto,Fecha Registro');
    myGridbuscar.setInitWidths('110,300,300,200,25,200,100,100,100,100,350,100');
    myGridbuscar.setColAlign('left,left,left,left,center,left,center,center,left,left,left,center');
    myGridbuscar.setColTypes('ed,ed,ed,ed,img,ed,ed,ed,ed,ed,ed,ed'); 
    myGridbuscar.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter");
    myGridbuscar.setColumnIds('co_proyecto,proyecto,de_descripcion,de_razon_social,ver_proy,de_objetivo,fe_vigencia_inicio,fe_vigencia_fin,es_vigencia,co_catalogo_producto,producto,fe_registra'); 
    myGridbuscar.init();     
    myGridbuscar.clearAll(); 
    mainLayout.cells('a').progressOn();
    myGridbuscar.load( BASE_URL + 'PO010210/listar-proyectos-terminado/').then(function (text) {
        mainLayout.cells('a').progressOff();
        let num_fila = myGridbuscar.getRowsNum();
        let iRowId;
        for(let i=0;i<num_fila;i++){
            iRowId = myGridbuscar.getRowId(i);
            myGridbuscar.setRowColor(iRowId,"#ABEBC6");
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
            nomproyecto = pro_desc;
            tooolbar.setValue('idproyecto', pro_cod);
            tooolbar.setValue('nomproyecto', pro_desc);  
            cabecerAdjuntofin(data.co_catalogo_producto);
            usuarioAsignado(pro_cod);
            mostrarProdVinculados(data.co_catalogo_producto);
                break;
            default: break;
        }
     });

}
cabecerAdjuntofin = () => {   
    mainLayoutcab = mainLayout.cells('a').attachLayout('2U');   
    mainLayoutasig = mainLayoutcab.cells("a").attachLayout('3E');
    mainLayoutasig.cells('a').setText('Seguimiento'); 
    mainLayoutasig.cells("b").setText('Documentos'); 
    mainLayoutasig.cells("a").setHeight(600);
    myGrid_act = mainLayoutasig.cells('a').attachGrid();
    myGrid_act.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    myGrid_act.groupBy(0);
    myGrid_act.setHeader('Asunto,Proyecto,Sub Actividad,Actividad,Nombre,Descripción,N° Días,Asignado a,Estado,Responsable,Fecha Registro'); 
    myGrid_act.setColTypes('ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro'); 
    myGrid_act.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,,#select_filter,#select_filter,#text_filter,#text_filter");
    myGrid_act.setInitWidths('0,0,80,0,0,600,100,300,80,300,100');
    myGrid_act.setColAlign('left,left,left,left,left,left,center,left,left,left,left');
    myGrid_act.setColumnIds('asun,codpro,subcact,codact,nombre,desc,dias,asig,estado,resp,fecha'); 
    myGrid_act.init();  
    mostrarActividadesfin(codproyecto);  
    actdoctoolbar = mainLayoutasig.cells('b').attachToolbar(); 
    actdoctoolbar.setIconsPath('/assets/images/icons/');
    actdoctoolbar.addButton('verdcto',null,'Ver Archivo',"ic-report.png","");
    actdoctoolbar.attachEvent('onClick', OnClicktoolbar);
    actdoctoolbar.setIconSize(18); 
    myGrid_act_doc = mainLayoutasig.cells('b').attachGrid();
    myGrid_act_doc.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    myGrid_act_doc.setIconsPath('/assets/images/icons/');
    myGrid_act_doc.setHeader(',IDseq,Descripción,Responsable,Estado,Fecha Registro,Cod.producto,Fichero');
    myGrid_act_doc.setColTypes('img,ro,ro,ro,ro,ro,ro,ro'); 
    myGrid_act_doc.setInitWidths('0,0,300,300,80,80,0,0');
    myGrid_act_doc.setColAlign('left,left,left,left,center,left,left,left');
    myGrid_act_doc.setColumnIds('ver,id,,,,,codp,fic'); 
    myGrid_act_doc.init();    
    myGrid_act.attachEvent("onRowSelect", function (id, ind) {
        data = myGrid_act.getRowData(myGrid_act.getSelectedRowId());
        myGrid_act_doc.clearAll(); 
        mainLayoutasig.cells('b').progressOn();
        myGrid_act_doc.load( BASE_URL + 'PO010210/mostrar-actividad-documento/'+data.codpro+'/'+data.subcact).then(function (text) {
            
            mainLayoutasig.cells('b').progressOff();
        });  
    });  
    mainLayoutasig.cells("c").setText('Usuarios Involucrados'); 
    myGrid_usuario = mainLayoutasig.cells('c').attachGrid();
    myGrid_usuario.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    myGrid_usuario.setHeader(',Usuario,Estado');    
    myGrid_usuario.setInitWidths('0,300,100');
    myGrid_usuario.setColAlign('left,left,left');
    myGrid_usuario.setColTypes('ro,ro,ro'); 
    myGrid_usuario.setColumnIds('cod,nom,est'); 
    myGrid_usuario.init();   
    mainLayoutcab.cells("b").setText('Productos Vinculados'); 
    mainLayoutcab.cells("b").collapse();
    mainLayoutasig.cells("c").collapse();
    };


mostrarActividadesfin = (proyecto) => {    
    myGrid_act.clearAll(); 
    mainLayoutasig.cells('a').progressOn();
    myGrid_act.load( BASE_URL + 'PO010210/mostrar-actividades-fin/'+proyecto).then(function (text) {
        myGrid_act.groupBy(0);
        mainLayoutasig.cells('a').progressOff();
        let iRowac;
        num_fila = myGrid_act.getRowsNum();
        for(let i=0;i<num_fila;i++){
            iRowac = myGrid_act.getRowId(i);
            data = myGrid_act.getRowData(iRowac);
            if(data.estado=='Pendiente'){
                myGrid_act.setRowColor(iRowac,"#F7D358");
            }else{
                if(data.estado=='Aprobado'||data.estado=='Revisado'){
                    myGrid_act.setRowColor(iRowac,"#90EE90");
                }else{
                    myGrid_act.setRowColor(iRowac,"#EC7063");
                }
            }
        }
        });  
}