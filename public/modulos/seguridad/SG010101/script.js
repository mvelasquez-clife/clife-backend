var usuarionvoAct= 'S',raz_social,co_catalogo_entidad , usuarioupdAct = 'N',cod = 0,per_usuario = 0,cod_tabla, 
myFormPermisos,myFormClonar, myToolbardatos,myLaouy_Dat, myLayou_antec, mainLayout, myFormdatos, mySidebar, WindClonar_,WindC_,
base_tollbar, myForm, Wind_,permiso_cataedit = 'E', data, co_cata_entidad = 0, nom_clien_corpo = '';
var ini_clon,cod_1 ,raz_social_1,ini='usuario',opcionClonar,c_usuario_source,alias,de_empresa;

buscarUsuario = async (name) => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbusq", 0, 0, 1000, 380);
    Wind_.window("wbusq").hideHeader();
    Wind_.window("wbusq").setModal(true);
    Wind_.window("wbusq").denyResize();
    Wind_.window("wbusq").center();
    myToolbar = Wind_.window("wbusq").attachToolbar();
    myToolbar.addText(null, null, 'Usuario a buscar : ');
    myToolbar.addInput('in_busq', null, '', 250);
    myToolbar.addSeparator(null, null);
    myToolbar.addButton('b_busq', null, '<i class="fas fa-search"></i> BUSCAR', null, null);
    myToolbar.addSeparator(null, null);
    myToolbar.addButton('b_close', null, '<i class="far fa-window-close txtred"></i> CERRAR ', null, null);
    myToolbar.attachEvent("onClick", (id) => {
        (id === 'b_close') ? Wind_.window("wbusq").close() : onBuscaUsuario(Wind_, myToolbar.getValue('in_busq'),ini);
    });
    myToolbar.attachEvent("onEnter", (id) => {
        onBuscaUsuario(Wind_, myToolbar.getValue('in_busq').toUpperCase(),ini);
    });
    myGrid = Winid_.attachGrid();
    myGrid.setHeader('Cód. Usuario,Nro Documento,Tipo Documento,Razón Social,Nombre Comercial,F.Sys');
    myGrid.setInitWidthsP('10,10,10,30,30,10');
    myGrid.setColTypes('ro,ro,ro,ro,ro,ro');
    myGrid.setColumnHidden(0, true);

    myGrid.setColumnIds("cod_usuario,nu_documento,tipo_doc,raz_social,nom_com,fec_sys");
    myGrid.init();
    myGrid.attachEvent("onRowSelect", function (id, ind) {  
        data = myGrid.getRowData(myGrid.getSelectedRowId())
        cod = data.cod_usuario,raz_social=data.raz_social;
            Wind_.window("wbusq").close();
            _async_form(cod,raz_social);
            myForm.setItemValue('b_usuario', data.raz_social);
            myForm.setItemValue('b_codusuario', data.cod_usuario);     
    });
};

function carga_form_usuario(cod){ 
    // console.log('si carga usuario');
    myLaouy_Dat = mySidebar.cells("s_datos").attachLayout('1C');
    myToolbardatos = myLaouy_Dat.cells("a").attachToolbar(base_tollbar);
    myToolbardatos.setIconSize(48);
    myLaouy_Dat.cells("a").hideHeader();
    myToolbardatos.attachEvent("onClick", ontollbarclic);
    myFormdatos = myLaouy_Dat.cells("a").attachForm(f_datos_usuario);
    const params = {
        usuario: cod,
        empresa: usrJson.empresa
    };
    $.post(BASE_URL + 'SG010101/mostrar-usuario', params, CargarDatosSuccess, 'json');  
}

async function _async_form(cod,raz_social) {
    cod_1 = cod ,raz_social_1 = raz_social;
    myForm.setItemValue('b_usuario', raz_social_1);
    myForm.setItemValue('b_codusuario', cod_1);
    carga_form_usuario(cod);
}

IniciarPermisos = () => {
    cod = myForm.getItemValue('b_codusuario'),
    raz_social = myForm.getItemValue('b_usuario'); 
    myLaouy_Dat = mySidebar.cells("s_datos").attachLayout('2U');
    myLaouy_Dat.cells('a').setText('Tablas del Sistema');
    myLaouy_Dat.cells('b').setText('Permisos');
    myToolbardatos = myLaouy_Dat.attachToolbar(base_tollbar);
    myToolbardatos.setIconSize(48);
    myToolbardatos.attachEvent("onClick", ontollbarclicPermisos);    
    mainGrid = myLaouy_Dat.cells('a').attachGrid();    
    mainGrid.clearAll();
    mainGrid.setHeader('Cod. Tabla,Nombre Tabla,Interno'); 
    mainGrid.setInitWidths('77,220,200');
    mainGrid.setColAlign('left,left,left');
    mainGrid.setColTypes('rotxt,edn,ed');      
    mainGrid.setColumnIds("cod_tabla,nom_tabla,interno"); 
    mainGrid.attachHeader("#number_filter,#text_filter,&nbsp");
    mainGrid.init();
    cargarUsuario();
    mainGrid.attachEvent("onRowSelect", function (id, ind) {  

    data = mainGrid.getRowData(mainGrid.getSelectedRowId())   
        myFormPermisos = myLaouy_Dat.cells("b").attachForm(f_permisos_usuario);   
        myFormPermisos.setItemValue('_codusuario',cod),myFormPermisos.setReadonly('_codusuario',true); 
        myFormPermisos.setItemValue('_codtabla',data.cod_tabla),myFormPermisos.setReadonly('_codtabla',true); 
        const params = {
            usuario:  cod,
            empresa: usrJson.empresa,
            cod_tabla: data.cod_tabla
        };
        $.post(BASE_URL + 'SG010101/mostrar-permisos-usuario', params, cargarPermisos, 'json');  
    });        
}


ClonarInicia = () => {
    // cod = myForm.getItemValue('b_codusuario'),
    // raz_social = myForm.getItemValue('b_usuario'); 
    myLaouy_Dat = mySidebar.cells("s_datos").attachLayout('2U');
    myLaouy_Dat.cells('a').setText('Usuario');
    myLaouy_Dat.cells('b').setText('Clonar Usuario');
    myToolbardatos = myLaouy_Dat.attachToolbar(base_tollbar);
    myToolbardatos.setIconSize(48);
    myToolbardatos.attachEvent("onClick", ontollbarclicClonar);    
    mainGrid = myLaouy_Dat.cells('a').attachGrid();    
    mainGrid.clearAll();
    mainGrid.setHeader('Cód.Usuario,Nro.Documento,Tipo Entidad,Tipo Documento,Razón Social,Nombre Comercial,F.Sys');
    mainGrid.setInitWidths('80,100,80,0,200,0,10');
    mainGrid.setColAlign('left,left,left,left,left,left,left');
    mainGrid.setColTypes('rotxt,edn,ed,edn,ed,edn,ed');      
    mainGrid.setColumnIds("cod_usuario,nu_documento,enti_tipo,tipo_doc,raz_social,nom_com,fec_sys");
    myToolbar = myLaouy_Dat.cells('a').attachToolbar();
    myToolbar.addInput('on_buscar', null, '', 250);
    myToolbar.addSeparator(null, null);
    myToolbar.addButton('but_busq', null, '<i class="fas fa-search"></i> BUSCAR', null, null);
    myToolbar.addSeparator(null, null);
    mainGrid.setColumnHidden(3, true);
    mainGrid.setColumnHidden(5, true);
    mainGrid.setColumnHidden(6, true);
    mainGrid.init();
    myToolbar.attachEvent("onEnter", (id) => {
        ini_clon = '';
        onBuscaUsuario(mainGrid, myToolbar.getValue('on_buscar').toUpperCase(),ini_clon);
    });

    mainGrid.attachEvent("onRowSelect", function (id, ind) {  
    data = mainGrid.getRowData(mainGrid.getSelectedRowId())   
    c_usuario_source = data.cod_usuario;
    myFormClonar = myLaouy_Dat.cells("b").attachForm(f_clonar_usuario);
            myFormClonar.attachEvent("onChange", function (id_ind){ 
                myFormClonar.isItemChecked('_p_sobre') ? myFormClonar.disableItem('_p_adic') : myFormClonar.enableItem('_p_adic'); 
                myFormClonar.isItemChecked('_p_adic') ? myFormClonar.disableItem('_p_sobre') : myFormClonar.enableItem('_p_sobre'); 
            });
    });  

    
}

ReplicarInicia = () => { 
    cod= myForm.getItemValue('b_codusuario'),
    alias = myForm.getItemValue('b_alias'); 
    myLaouy_Dat = mySidebar.cells("s_datos").attachLayout('1C');
    myLaouy_Dat.cells('a').setText('Empresa');
    myToolbardatos = myLaouy_Dat.attachToolbar(base_tollbar);
    myToolbardatos.setIconSize(48);
    myToolbardatos.attachEvent("onClick", ontollbarclicReplicar);    
    mainGrid = myLaouy_Dat.cells('a').attachGrid();    
    mainGrid.clearAll();
    mainGrid.setHeader('Cód. Empresa,Empresa, Nro. RUC');
    mainGrid.setInitWidths('100,420,420');
    mainGrid.setColAlign('center,center,center');
    mainGrid.setColTypes('rotxt,edn,edn');      
    mainGrid.setColumnIds("co_empresa,de_empresa,no_ruc");
    mainGrid.attachHeader("#number_filter,#text_filter,#number_filter");
    myToolbar = myLaouy_Dat.cells('a').attachToolbar();
    mainGrid.init();
    cargaEmpresa();    
    // de_empresa = '';   
    mainGrid.attachEvent("onRowSelect", function (id, ind) {  
        data = mainGrid.getRowData(mainGrid.getSelectedRowId())   
        de_empresa = data.co_empresa;
    });   
}

cargarPermisos = (result) => {
    if (result.message == '0'){
        myFormPermisos.setItemValue('_claveacceso', '');
        myFormPermisos.uncheckItem('_activo');
    }else{
        const permiso = result.data.usuario;
        myFormPermisos.setItemValue('_codusuario', permiso.SPD_USUARIO);
        myFormPermisos.setItemValue('_codtabla', permiso.SPD_TABLA); 
        myFormPermisos.setItemValue('_claveacceso', permiso.SPD_CLAVE);
        permiso.SPD_ACTIVO.toUpperCase() == 'S' ? myFormPermisos.checkItem('_activo'): myFormPermisos.uncheckItem('_activo');
    }        
}

cargarUsuario = () => {
    myLaouy_Dat.cells('a').progressOn();
    mainGrid.load( BASE_URL + 'SG010101/mostrar-permisos/', () => {
        myLaouy_Dat.cells('a').progressOff();
    });
}

cargaEmpresa = () => {
    myLaouy_Dat.cells('a').progressOn();
    mainGrid.load( BASE_URL + 'SG010101/mostrar-empresa/'+ usrJson.empresa,()=>{  
        myLaouy_Dat.cells('a').progressOff();
    });
}

onBuscaUsuario = (win, value, ini) => { 
    if (ini == 'usuario'){
        if (value.length > 0) {
            win.window("wbusq").progressOn();
            myGrid.clearAll();
            myGrid.load( BASE_URL + 'SG010101/buscar-usuario/'+ value +'/'+ usrJson.empresa).then(function (text) {           
                win.window("wbusq").progressOff();
            }); 
        } else {
            Swal.fire({ type: 'warning', text: 'Ingrese correctamente un nombre o documento...', showConfirmButton: false, timer: 1500 });
        }
    }else{ 
        if (value.length > 0) {
            mainGrid.clearAll();
            myLaouy_Dat.cells('a').progressOn();
            mainGrid.load( BASE_URL + 'SG010101/buscar-usuario/'+ value +'/'+ usrJson.empresa).then(function (text) {           
                myLaouy_Dat.cells('a').progressOff();
            }); 
        } else {
            Swal.fire({ type: 'warning', text: 'Ingrese correctamente un nombre o documento...', showConfirmButton: false, timer: 1500 });
        }

    }

};

CargarDatosSuccess = (result) => {
    const usuario = result.data.usuario;    
    myForm.setItemValue('b_usuario', usuario.RAZ_SOCIAL);
    myForm.setItemValue('b_codusuario', usuario.CO_USUARIO);
    myForm.setItemValue('b_registro', usuario.FE_SYS);
    myForm.setItemValue('b_estado', usuario.ES_VIGENCIA);
    myForm.setItemValue('b_alias', usuario.DE_ALIAS);
   
    myFormdatos.setItemValue('_nudocumento', usuario.NRO_DOCUMENTO);
    myFormdatos.setItemValue('_tipodoc', usuario.TIPO_DOC_IDENT);
    myFormdatos.setItemValue('_tipoper', usuario.TIPO_PERSONA);
    myFormdatos.setItemValue('_vigencia', usuario.VIGENCIA);
    myFormdatos.setItemValue('_apepat', usuario.USU_APE_PATERNO);
    myFormdatos.setItemValue('_apemat', usuario.USU_APE_MATERNO);
    myFormdatos.setItemValue('_nombres', usuario.USU_NOMBRE);
    myFormdatos.setItemValue('_fredcata', usuario.FEC_REGISTRO);
    myFormdatos.setItemValue('_procedencia',usuario.PROCEDENCIA)
    myFormdatos.setItemValue('_razsocial', usuario.RAZ_SOCIAL);
    myFormdatos.setItemValue('_nomcomer', usuario.NOM_COMER); 
    myFormdatos.setItemValue('_alias', usuario.DE_ALIAS);
    myFormdatos.setItemValue('_centrocosto', usuario.CO_CENTRO_COSTO);
    myFormdatos.setItemValue('_fecregistro', usuario.FE_SYS);
    myFormdatos.setItemValue('_estado', usuario.ES_VIGENCIA);
    myFormdatos.setItemValue('_fecvig', usuario.FE_VIGENCIA);
    myFormdatos.setItemValue('_correo', usuario.DE_CORREO);
    myFormdatos.setItemValue('_clasist', usuario.DE_CLAVE_SISTEMA);
    myFormdatos.setItemValue('_clawap', usuario.DE_CLAVE_WAP);
    usuario.ST_ACCESO_WAP.toUpperCase() === 'S' ? myFormdatos.checkItem('_accewap') :  myFormdatos.uncheckItem('_accewap');
    usuario.ST_ACCESO_SISTEMA.toUpperCase() === 'S' ? myFormdatos.checkItem('_accesist') :  myFormdatos.uncheckItem('_accesist');
    usuario.ST_ADMIN.toUpperCase() === 'S' ? myFormdatos.checkItem('_admin') :  myFormdatos.uncheckItem('_admin');
    usuario.ST_CARGO.toUpperCase() === 'S' ? myFormdatos.checkItem('_jfarea') :  myFormdatos.uncheckItem('_jfarea');
    myFormdatos.checkItem('st_personales'),myFormdatos.checkItem('st_generales_personales');

    myFormdatos.attachEvent("onChange", function (id_ind){ 
        myFormdatos.isItemChecked('_accewap') ? myFormdatos.enableItem('_clawap') : myFormdatos.disableItem('_clawap'); 
        myFormdatos.isItemChecked('_accesist') ? myFormdatos.enableItem('_clasist') : myFormdatos.disableItem('_clasist'); 
    });

};

ontollbarclic = async (id) => {
    switch (id) {
        case '__nuevo':
            var output = await IniciarFormularioSeguridad(58, mainLayout);
            if (output.result === 'S') {
                permiso_cataedit = 'S';
            }else{
                permiso_cataedit = 'E';
            }
            usuarionvoAct = 'S',
            usuarioupdAct = 'N',
            myToolbardatos.disableItem('__edit'), 
            myToolbardatos.disableItem('__user'), 
            myFormdatos.clear();
            myFormdatos.checkItem('st_personales'), myFormdatos.enableItem('st_personales'),myFormdatos.enableItem('st_generales_personales'), myFormdatos.checkItem('st_generales_personales');
            myForm.setItemValue('b_usuario', ''), myForm.setItemValue('b_estado', ''), myForm.setItemValue('b_registro', ''), myForm.setItemValue('b_codusuario', '');
            myToolbardatos.enableItem('__save'),myFormdatos.enableItem('_nudocumento');myFormdatos.enableItem('_tipodoc'),myFormdatos.enableItem('_razsocial'),myFormdatos.enableItem('_nomcomer'),myFormdatos.enableItem('_procedencia'),myFormdatos.enableItem('_origen'),myFormdatos.enableItem('_tipoper'),myFormdatos.enableItem('_vigencia');
            myFormdatos.enableItem('_correo'),myFormdatos.enableItem('_fecvig'),myFormdatos.enableItem('_estado'),myFormdatos.enableItem('_admin');
            myFormdatos.enableItem('_clawap'),myFormdatos.enableItem('_accewap'),myFormdatos.enableItem('_clasist'),myFormdatos.enableItem('_accesist'),myFormdatos.enableItem('_centrocosto');
            myFormdatos.setReadonly('_razsocial', false),myFormdatos.setReadonly('_nomcomer', false);
            co_catalogo_entidad = -1;
            break;
        case'__edit':
            
            var output = await IniciarFormularioSeguridad(58, mainLayout);
            if (output.result === 'S') {
                permiso_cataedit = 'S'; 
                myToolbardatos.enableItem('__save');
                myToolbardatos.disableItem('__edit');
            }else{
                permiso_cataedit = 'E';
                myToolbardatos.enableItem('__edit');
            }
            usuarionvoAct = 'N',
            usuarioupdAct = 'S',
            co_catalogo_entidad =myFormdatos.getItemValue('_nudocumento');  
            myToolbardatos.disableItem('__user'), 
            myFormdatos.checkItem('st_personales'), myFormdatos.enableItem('st_personales');
            myFormdatos.enableItem('_accesist'), myFormdatos.enableItem('_accewap');
            myFormdatos.checkItem('st_generales_personales'), myFormdatos.enableItem('st_generales_personales');
            myFormdatos.disableItem('_nudocumento');
            break;
        case'__save':           
            grabar_usuario();
            break;
        case'__permisos':
            IniciarPermisos(); 
            myToolbardatos.disableItem('__nuevo'),
            myToolbardatos.enableItem('__save'),
            myToolbardatos.disableItem('__edit'),
            myToolbardatos.enableItem('__user');
            break;
        case '__clonarusuario':
            ClonarInicia();
            myToolbardatos.disableItem('__nuevo'),
            myToolbardatos.enableItem('__save'),
            myToolbardatos.disableItem('__edit'),
            myToolbardatos.enableItem('__user');
            break; 
        case '__replicaremp':
            ReplicarInicia();
            myToolbardatos.disableItem('__nuevo'),
            myToolbardatos.enableItem('__save'),
            myToolbardatos.disableItem('__edit'),
            myToolbardatos.enableItem('__user');
            break; 
        default:
            null;
            break;
    }
};

ontollbarclicPermisos = async (id) => {       
    cod= myForm.getItemValue('b_codusuario'),
    raz_social = myForm.getItemValue('b_usuario'); 
    switch (id) {            
        case'__user':
            myToolbardatos.enableItem('__edit'), 
            myToolbardatos.disableItem('__save'),     
            myToolbardatos.disableItem('__user'), 
            _async_form(cod_1,raz_social_1);
            break;
        case'__save':
            myToolbardatos.disableItem('__edit'), 
            myToolbardatos.enableItem('__save'),     
            myToolbardatos.enableItem('__user'), 
            grabar_permisos();
            break;
        case'__permisos':
            IniciarPermisos(); 
            myToolbardatos.disableItem('__nuevo'),
            myToolbardatos.enableItem('__save'),
            myToolbardatos.disableItem('__edit'),  
            myToolbardatos.enableItem('__user');
            break;
        case '__clonarusuario':
            ClonarInicia();
            myToolbardatos.disableItem('__nuevo'),
            myToolbardatos.enableItem('__save'),
            myToolbardatos.disableItem('__edit'),
            myToolbardatos.enableItem('__user');
            break;
        case '__replicaremp':
            ReplicarInicia();
            myToolbardatos.disableItem('__nuevo'),
            myToolbardatos.enableItem('__save'),
            myToolbardatos.disableItem('__edit'),
            myToolbardatos.enableItem('__user');
            break; 
        default:
            null;
            break;
    }
};

ontollbarclicClonar = async (id) => {       
    cod= myForm.getItemValue('b_codusuario'),
    raz_social = myForm.getItemValue('b_usuario'); 
    switch (id) {            
        case'__user':
            myToolbardatos.enableItem('__edit'), 
            myToolbardatos.disableItem('__save'),     
            myToolbardatos.disableItem('__user'), 
            _async_form(cod_1,raz_social_1);
            break;
        case'__save':
            myToolbardatos.disableItem('__edit'), 
            myToolbardatos.enableItem('__save'),     
            myToolbardatos.enableItem('__user'),
            clonar_usuario();
            break;
        case'__permisos':
            IniciarPermisos(); 
            myToolbardatos.disableItem('__nuevo'),
            myToolbardatos.enableItem('__save'),
            myToolbardatos.disableItem('__edit'),  
            myToolbardatos.enableItem('__user');
            break;
        case '__clonarusuario':
            ClonarInicia();
            myToolbardatos.disableItem('__nuevo'),
            myToolbardatos.enableItem('__save'),
            myToolbardatos.disableItem('__edit'),
            myToolbardatos.enableItem('__user');
            break;
        case '__replicaremp':
            ReplicarInicia();
            myToolbardatos.disableItem('__nuevo'),
            myToolbardatos.enableItem('__save'),
            myToolbardatos.disableItem('__edit'),
            myToolbardatos.enableItem('__user');
            break; 
        default:
            null;
            break;
    }
};


ontollbarclicReplicar = async (id) => {       
    cod= myForm.getItemValue('b_codusuario'),
    alias = myForm.getItemValue('b_alias'); 
    switch (id) {            
        case'__user':
            myToolbardatos.enableItem('__edit'), 
            myToolbardatos.disableItem('__save'),     
            myToolbardatos.disableItem('__user'), 
            _async_form(cod_1,raz_social_1);
            break;
        case'__save':        
            if (de_empresa){                
                myToolbardatos.disableItem('__edit'), 
                myToolbardatos.enableItem('__save'),     
                myToolbardatos.enableItem('__user'),
                replicarUsuarioporEmpresa();
            }else{
                dhtmlx.alert({
                    title: "Error",
                    type: "alert-error",
                    text: "Eliga una empresa"
                });
            }
            break;
        case'__permisos':
            IniciarPermisos(); 
            myToolbardatos.disableItem('__nuevo'),
            myToolbardatos.enableItem('__save'),
            myToolbardatos.disableItem('__edit'),  
            myToolbardatos.enableItem('__user');
            break;
        case '__clonarusuario':
            ClonarInicia();
            myToolbardatos.disableItem('__nuevo'),
            myToolbardatos.enableItem('__save'),
            myToolbardatos.disableItem('__edit'),
            myToolbardatos.enableItem('__user');
            break;
        case '__replicaremp':
            myToolbardatos.disableItem('__nuevo'),
            myToolbardatos.enableItem('__save'),
            myToolbardatos.disableItem('__edit'),
            myToolbardatos.enableItem('__user');
            break; 
        default:
            null;
            break;
    }
};


grabar_usuario = () =>{    
    p = {
        permiso_editar: permiso_cataedit, empresa: usrJson.empresa, alias: usrJson.alias, co_catalogo_entidad: co_catalogo_entidad,
        de_razon_social: myFormdatos.getItemValue('_razsocial'), nu_documento: myFormdatos.getItemValue('_nudocumento'),
        co_tipo_persona: myFormdatos.getItemValue('_tipoper'), co_tipo_doc_ide: myFormdatos.getItemValue('_tipodoc'), 
        de_procedencia: myFormdatos.getItemValue('_procedencia'), de_ape_paterno: myFormdatos.getItemValue('_apepat'), 
        de_ape_materno: myFormdatos.getItemValue('_apemat'), de_nombre: myFormdatos.getItemValue('_nombres'), 
        de_nombre_comercial: myFormdatos.getItemValue('_nomcomer'), de_origen: myFormdatos.getItemValue('_origen'), 
        st_usuario_nvo: usuarionvoAct,st_usuario_upd: usuarioupdAct,
        de_email: myFormdatos.getItemValue('_correo'),
        clave_wap: myFormdatos.isItemChecked('_accewap') ? 'S' : 'N',
        de_fec_vig :myFormdatos.getItemValue('_fecvig').toLocaleDateString(),
        centro_costo:myFormdatos.getItemValue('_centrocosto'),
        acceso_sis: myFormdatos.isItemChecked('_accesist') ?'S' : 'N',
        de_admin: myFormdatos.isItemChecked('_admin') ? 'S' : 'N',
        de_cargo: myFormdatos.isItemChecked('_jfarea') ? 'S' : 'N',
        vigencia: myFormdatos.getItemValue('_estado'),
        clavesist: myFormdatos.isItemChecked('_accesist') ? myFormdatos.getItemValue('_clasist') : '',
        clavewap: myFormdatos.isItemChecked('_accewap') ? myFormdatos.getItemValue('_clawap') : '',
    };
    console.log(p);
    if (((p.clave_wap =='S') && (p.clavewap.length==0))||((p.acceso_sis =='S') && (p.clavesist.length==0)))
    {
        dhtmlx.alert({
            title: "Error",
            type: "alert-error",
            text: "Ingresa clave"
        });
    } else{
    $.post(BASE_URL + "SG010101/guardar-usuariov2", p, function (res) {
        console.log('aqui');
        console.log(res);
        if (parseFloat(res.codigo) > 0) {
            permiso_cataedit = 'N',myToolbardatos.disableItem('__save'), myToolbardatos.enableItem('__edit');
            Swal.fire('Bien!', res.message, 'success'); 

            carga_form_usuario(res.codigo);
            myToolbardatos.disableItem('__edit'), 
            myToolbardatos.enableItem('__save'), 
            myToolbardatos.disableItem('__user'), 
            myFormdatos.checkItem('st_personales'), myFormdatos.enableItem('st_personales');
            myFormdatos.disableItem('_nudocumento'); 
        } else {
            Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se guardó sus cambios  :' + res.message });
        }
    }, "json");
  }
};

replicarUsuarioporEmpresa = ()=>{
// console.log(myFormClonar.getItemValue('_p_sobre'));
// usuario,empresa_source,empresa_destino

p = {
    usuario: cod,
    empresa_source: usrJson.empresa,
    empresa_destino: de_empresa,
};

    console.log(p);
    $.post(BASE_URL + "SG010101/replicar-usuario-empresa", p, function (res) {   
        console.log(res);    
        if (res.state=='success') {
            Swal.fire('Bien!', res.message, 'success'); 
        } else {
            Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se guardó sus cambios  :' + res.message });
        }
    }, "json");
};

clonar_usuario = () =>{
    console.log(myFormClonar.getItemValue('_p_sobre'));
    p = {empresa: usrJson.empresa,
        opcion:  myFormClonar.isItemChecked('_p_sobre') ? 'S' : 'A',
        usuario_source: c_usuario_source,
        usuario_destino: cod,    
    };
    if((myFormClonar.isItemChecked('_p_sobre')) == 0 && (myFormClonar.isItemChecked('_p_adic') == 0)){
        dhtmlx.alert({
            title: "Error",
            type: "alert-error",
            text: "Selecciona una opción"
        });
    }else{
        //empresa,opcion,usuario_source,usuario_destino
        $.post(BASE_URL + "SG010101/clonar-usuario", p, function (res) {       
            if (res.state =='success') {
                Swal.fire('Bien!', res.message, 'success'); 
            } else {
                Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se guardó sus cambios  :' + res.message });
            }
        }, "json");
    }   
};

grabar_permisos = () =>{
    
    p = {empresa: usrJson.empresa,
        usuario: myFormPermisos.getItemValue('_codusuario'),
        tab_sist: myFormPermisos.getItemValue('_codtabla'),
        clave: myFormPermisos.getItemValue('_claveacceso'),
        activo:myFormPermisos.isItemChecked('_activo') ? 'S' : 'N',

    };
    console.log(p);
    if (((p.tab_sist.length ==0) && (p.clave.length==0)))
    {
        dhtmlx.alert({
            title: "Error",
            type: "alert-error",
            text: "Ingresa clave y/o código de tabla"
        });
    } else{
    $.post(BASE_URL + "SG010101/guardar-permiso", p, function (res) {       
        if (res.state =='success') {
            Swal.fire('Bien!', res.message, 'success'); 
        } else {
            Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se guardó sus cambios  :' + res.message });
        }
    }, "json");
  }
};
