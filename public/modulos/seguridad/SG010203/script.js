var myToolbardatos,Wind_,myToolbar,myGrid,Winid_,myLaouy_Dat,myLaouy_Down,cod,mainGrid,mainGrid_down,mainGrid_down_l,acceso_menu,
to_fila_data_n,dato,Wind_Asignar,WinidAsignar_,varAsignar,mainToolbarDown,mainToolbarDown_l,base_tollbar,accion_menu,cant_filas,cant_filas_l,
de_estado,de_motivo_cierre,de_acceso_menu


buscarUsuario = async (name) => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbusq", 0, 0, 1000, 380);
    Wind_.window("wbusq").hideHeader();
    Wind_.window("wbusq").setModal(true);
    Wind_.window("wbusq").denyResize();
    Wind_.window("wbusq").center();
    myToolbar = Wind_.window("wbusq").attachToolbar();
    myToolbar.addButton('b_close', null, '<i class="far fa-window-close txtred"></i> CERRAR ', null, null);
    myToolbar.attachEvent("onClick", (id) => {
        (id === 'b_close') ? Wind_.window("wbusq").close() : console.log('hola');
    });
    myGrid = Winid_.attachGrid();
    myGrid.setHeader('Cod. Usuario,Alias,Usuario,Fecha Sys,Asignado');
    myGrid.setInitWidthsP('10,20,30,20,20');
    myGrid.setColTypes('ro,ro,ro,ro,ro');
    myGrid.setColumnIds("cod_usuario,de_alias,de_usuario,fec_sys,de_asignado");
    myGrid.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,#text_filter");
    myGrid.clearAll();
    cargarListaUsuario(Wind_);
    myGrid.init();
    myGrid.attachEvent("onRowSelect", function (id, ind) {  
        data = myGrid.getRowData(myGrid.getSelectedRowId())
        cod = data.cod_usuario;        
        if (data.de_asignado=='No Asignado'){
            dhtmlx.confirm("El usuario no tiene asignado Menú. ¿Desea asignarle un menú?", function (result) {
                if (result === Boolean(true)) {
                    varAsignar = 'S';
                    grabarmenuUsuario(cod,varAsignar);
                }
            });
        }
            Wind_.window("wbusq").close();
            carga_form_usuario(cod);
            myForm.setItemValue('b_usuario', data.de_usuario);
            myForm.setItemValue('b_registro', data.fec_sys);
            myForm.setItemValue('b_alias', data.de_alias);  
            myForm.setItemValue('b_codusuario', data.cod_usuario);  
            myForm.enableItem('b_registro');  
            myForm.enableItem('b_alias');  
    });
};

cargarListaUsuario = (win) => {   
    win.window("wbusq").progressOn();
    myGrid.clearAll();
    myGrid.load( BASE_URL + 'SG010203/mostrar-lista-usuario/'+ usrJson.empresa).then(function (text) {           
        win.window("wbusq").progressOff();
    }); 
};

function carga_form_usuario(cod){ 
    // console.log('si carga usuario');
    myLaouy_Dat = mainLayout.cells("b").attachLayout('3U');
    myToolbardatos = myLaouy_Dat.cells('b').attachToolbar(base_tollbar);
    myToolbardatos.setAlign("left");
    myToolbardatos.setIconSize(48); 
    myLaouy_Dat.cells("a").hideHeader();
    myLaouy_Dat.cells('a').setHeight(150);
    myLaouy_Dat.cells("b").hideHeader();
    myLaouy_Dat.cells('b').setHeight(150);
    myLaouy_Dat.cells('b').setWidth(900);   
    myLaouy_Dat.cells('a').setWidth(203);
    
    myToolbardatos.attachEvent("onClick", ontollbarclic);

    mainGrid = myLaouy_Dat.cells('a').attachGrid();    
    mainGrid.clearAll();
    mainGrid.setHeader('Cod.Acceso Menú, Fecha Ingreso');
    mainGrid.setInitWidths('100,100');
    mainGrid.setColAlign('center,center');
    mainGrid.setColTypes('rotxt,edn');      
    mainGrid.setColumnIds("co_acceso_menu,fe_ingreso");
    mainGrid.init();
    mostrarVersiones(cod);    
    mainGrid.attachEvent("onRowSelect", function (id, ind) { 
        myToolbardatos.disableItem('__save');
        data = mainGrid.getRowData(mainGrid.getSelectedRowId()) 
        acceso_menu= data.co_acceso_menu
            myFormMenuC = myLaouy_Dat.cells("b").attachForm(st_form_menu_cabecera);    
            const params = {
                usuario:  cod,
                empresa: usrJson.empresa,
                acceso_menu: data.co_acceso_menu
            };

        $.post(BASE_URL + 'SG010203/mostrar-menu-cabecera', params, cargaCabeceraVersion, 'json'); 
        
        myLaouy_Down = myLaouy_Dat.cells('c').attachLayout('2U');
        myLaouy_Down.cells('a').setText('Menú Sistema');
        mainToolbarDown_l = myLaouy_Down.cells('a').attachToolbar();
        mainToolbarDown_l.setIconsPath('/assets/images/icons/');
        mainToolbarDown_l.addButton('marcar_l',null,'Marcar',"ic-check.png","");
        mainToolbarDown_l.addButton('desmarcar_l',null,'Desmarcar',"ic-desck.png","");
        mainToolbarDown_l.addButton('agregar',null,'Agregar',"ic-add.png","");
        mainToolbarDown_l.attachEvent('onClick', mainToolbarOnClick);
        myLaouy_Down.cells('b').setText('Menú Usuario');
        mainToolbarDown = myLaouy_Down.cells('b').attachToolbar();
        mainToolbarDown.setIconsPath('/assets/images/icons/');
        mainToolbarDown.addButton('activar',null,'Activar',"ic-act.png","");
        mainToolbarDown.addButton('inactivar',null,'Desactivar',"ic-inac.png","");
        mainToolbarDown.addButton('marcar',null,'Marcar',"ic-check.png","");
        mainToolbarDown.addButton('desmarcar',null,'Desmarcar',"ic-desck.png","");
        mainToolbarDown.attachEvent('onClick', mainToolbarOnClick);
        
        mainGrid_down = myLaouy_Down.cells('b').attachGrid(); 
        mainGrid_down.clearAll();
        //Menu Usuario 
        mainGrid_down.setHeader('M,Cod. Menú Sistema, Detalle, Visible, Vigencia');
        mainGrid_down.setInitWidths('40,100,247,55,65');
        mainGrid_down.setColAlign('left,left,left,left,left');
        mainGrid_down.setColTypes('ch,rotxt,edn,ch,edn');    
        mainGrid_down.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");  
        mainGrid_down.setColumnIds("ci,co_menu_sist,detalle,visible,vigencia");
        mainGrid_down.attachHeader("&nbsp,#text_filter,#text_filter,&nbsp,&nbsp");
        mainGrid_down.init();
        mostrarDetalleUsuario(data.co_acceso_menu); 
        //Menu Sistema
       
        mainGrid_down_l = myLaouy_Down.cells('a').attachGrid(); 
        mainGrid_down_l.clearAll();        
        mainGrid_down_l.setHeader('M,Cod. Menú Sistema, Detalle, Visible, Vigencia');
        mainGrid_down_l.setInitWidths('40,100,247,55,65');
        mainGrid_down_l.setColAlign('left,left,left,left,left');
        mainGrid_down_l.setColTypes('ch,rotxt,edn,ch,edn');      
        mainGrid_down_l.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");  
        mainGrid_down_l.setColumnIds("de,co_menu_sist,detalle,visible,vigencia");
        mainGrid_down_l.attachHeader("&nbsp,#text_filter,#text_filter,&nbsp,&nbsp");
        mainGrid_down_l.init();
        mostrarMenuSistema(data.co_acceso_menu); 

    });   
}

mostrarVersiones = (cod) => {  
    myLaouy_Dat.cells('a').progressOn();
    mainGrid.load( BASE_URL + 'SG010203/mostrar-versiones/'+cod+'/'+usrJson.empresa, () => {
        
        myLaouy_Dat.cells('a').progressOff();
    });
};

mostrarDetalleUsuario = (acceso_menu) => {  
    myLaouy_Down.cells('b').progressOn();
    mainGrid_down.load( BASE_URL + 'SG010203/mostrar-menud-usuario/'+usrJson.empresa+'/'+acceso_menu, () => {        
        myLaouy_Down.cells('b').progressOff();
        cant_filas = mainGrid_down.getRowsNum();
    });
};

mostrarMenuSistema = (acceso_menu) => {  
    myLaouy_Down.cells('a').progressOn();
    mainGrid_down_l.load( BASE_URL + 'SG010203/mostrar-menu-sistema/'+usrJson.empresa+'/'+acceso_menu, () => { 
        myLaouy_Down.cells('a').progressOff();
        cant_filas_l = mainGrid_down_l.getRowsNum();
    });
};

agregarMenu = (num_filas_check,to_fila_data_n) => {    
    params = {
        empresa: usrJson.empresa,
        acce_menu: acceso_menu,
        cant_filas_menu: num_filas_check,
        cade_general: to_fila_data_n,      
    };
    console.log(params);
    $.post(BASE_URL + "SG010203/grabar-menu-sistema-detalle", params, function (res) {   
        console.log(res) ;  
        if (res.state=='success'){
            mainGrid_down.clearAll();
            mainGrid_down_l.clearAll();
            Swal.fire('Bien!', res.message, 'success'); 
            mostrarMenuSistema(acceso_menu);
            mostrarDetalleUsuario(acceso_menu); 
        } else {
            Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se guardó sus cambios  :' + res.message });
        }
    }, "json");
}
cargaCabeceraVersion = (result) => {
    const menu = result.data.usuario;
    myFormMenuC.setItemValue('_estado', menu.VIGENCIA);
    myFormMenuC.setItemValue('b_fec_sys', menu.FE_SYS); 
    myFormMenuC.setItemValue('b_fec_cierre', menu.FE_CIERRE);
    myFormMenuC.setItemValue('b_mot_cierre', menu.DE_MOTIVO_CIERRE);  
    if (myFormMenuC.getItemValue('_estado') === 'Vigente'){
        myFormMenuC.disableItem('b_mot_cierre')
    };
    myFormMenuC.attachEvent("onChange", function (id_ind){ 
        myFormMenuC.getItemValue('_estado') === 'Vigente'? myFormMenuC.disableItem('b_mot_cierre') : myFormMenuC.enableItem('b_mot_cierre'); 
        myToolbardatos.enableItem('__save');
    });    
}

grabaraccionMenu = (num_filas_check,to_fila_data_n,accion_menu) =>{
    params={
        empresa: usrJson.empresa,
        acce_menu: acceso_menu,
        cant_filas_menu: num_filas_check,
        cade_general: to_fila_data_n,  
        accion: accion_menu
    }
    console.log(params);
    $.post(BASE_URL + "SG010203/grabar-accion-menu", params, function (res) {   
        console.log(res) ;  
        if (res.state=='success'){
            mainGrid_down.clearAll();
            Swal.fire('Bien!', res.message, 'success'); 
            mostrarDetalleUsuario(acceso_menu); 
        } else {
            Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se guardó sus cambios  :' + res.message });
        }
    }, "json");
}

grabarmenuUsuario = (cod,varAsignar,de_acceso_menu,de_estado,de_motivo_cierre) => {    
    params = {
        empresa: usrJson.empresa,
        usuario: cod,
        asignar_nuevo: varAsignar,
        acceso_menu:de_acceso_menu,
        estado: de_estado,
        motivo_cierre:de_motivo_cierre,
    };
    $.post(BASE_URL + "SG010203/grabar-menu-cabecera", params, function (res) {   
        console.log(res) ;  
        if (res.state=='success'){
            Swal.fire('Bien!', res.message, 'success'); 
            carga_form_usuario(cod);
        } else {
            Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se guardó sus cambios  :' + res.message });
        }
    }, "json");
}

ontollbarclic = async (id) => {
    switch (id) {
        case '__nuevo':
            varAsignar = 'N';
            de_estado = '';
            de_motivo_cierre = '';
            de_acceso_menu = 0;
            dhtmlx.confirm("¿Desea crear un nuevo menú usuario?", function (result) {
                if (result === Boolean(true)) {
                    grabarmenuUsuario(cod,varAsignar,de_acceso_menu,de_estado,de_motivo_cierre);
                    carga_form_usuario(cod);
                }
            });
            break;
        case '__save':
            varAsignar = 'N';
            de_estado = myFormMenuC.getItemValue('_estado');
            de_motivo_cierre = myFormMenuC.getItemValue('b_mot_cierre');
            de_acceso_menu = acceso_menu;
            dhtmlx.confirm("¿Esta seguro de guardar los cambios?", function (result) {
                if (result === Boolean(true)) {
                    grabarmenuUsuario(cod,varAsignar,de_acceso_menu,de_estado,de_motivo_cierre);
                    carga_form_usuario(cod);
                }
            });
        default:
            null;
            break;
    }
};

mainToolbarOnClick = (id) => {
    switch (id) {
        case 'agregar':
            var to_fila_data_num = cant_filas_l,num_filas_check = 0;
            to_fila_data_n = '';
            data = '';
            console.log(to_fila_data_num);
            for(var i=0;i<to_fila_data_num;i++){                
                data = mainGrid_down_l.getRowData(i);                
                if (data.de == 1) {
                    to_fila_data_n+= data.de+'@'+data.co_menu_sist+'||'                     
                    num_filas_check= num_filas_check+ 1;
                }               
            }              
        agregarMenu(num_filas_check,to_fila_data_n); 
            break;
        case 'marcar_l':
            mainGrid_down_l.setCheckedRows(0,1);
            break;
        case 'desmarcar_l':
            mainGrid_down_l.setCheckedRows(0,0);
            break;
        case 'marcar':
            mainGrid_down.setCheckedRows(0,1);
            break;
        case 'desmarcar':
            mainGrid_down.setCheckedRows(0,0);
            break;
        case 'activar':  
            accion_menu = 'A';
            var to_fila_data_num,num_filas_check = 0
            to_fila_data_num = cant_filas;
            to_fila_data_n = '';
            data = '';
            for(var i=0;i<to_fila_data_num;i++){     
                data = mainGrid_down.getRowData(i);              
                if (data.ci == 1) {
                    console.log('holo');           
                    to_fila_data_n+= data.ci+'@'+data.co_menu_sist+'||'                     
                    num_filas_check= num_filas_check+ 1;
                }               
            }         
            grabaraccionMenu(num_filas_check,to_fila_data_n,accion_menu);
           
            break;
        case 'inactivar':
            accion_menu = 'D';
            var to_fila_data_num,num_filas_check = 0
            to_fila_data_num = cant_filas;
            to_fila_data_n = '';
            data = '';
            for(var i=0;i<to_fila_data_num;i++){                
                data = mainGrid_down.getRowData(i);                
                if (data.ci == 1) {
                    to_fila_data_n+= data.ci+'@'+data.co_menu_sist+'||'                     
                    num_filas_check= num_filas_check+ 1;
                }               
            }         
            console.log(num_filas_check,to_fila_data_n,accion_menu);
           grabaraccionMenu(num_filas_check,to_fila_data_n,accion_menu);
            break;
        default:
            null;
            break;
    }
}

