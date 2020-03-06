var formData, pAccion = 'I',setVar
IniciarComponentes = () => {
    console.log(usrJson);
    mainLayout = new dhtmlXLayoutObject({
        parent: document.body,
        pattern: '2U'
    });
    //
    mainLayout.cells('a').setText('Usuarios');
    mainLayout.cells('b').setText('Editar Usuario');
    // mainLayout.cells('b').hideHeader();
    // grillaPeriodos = mainLayout.cells("a").attachGrid();
    mainGrid = mainLayout.cells('a').attachGrid();
    mainGrid.setHeader('Alias,Codigo,Nombre');
    mainGrid.setInitWidths('120,90,320');
    mainGrid.setColAlign('left,left,left');
    mainGrid.setColTypes('rotxt,edn,ed');
    mainToolbar = mainLayout.cells('a').attachToolbar();
    mainToolbar.setIconsPath('/assets/images/icons/'); //images/icons/favicon.ico
    mainToolbar.addButton("eliminar", null, "Eliminar", "ic-delete.png", "");
    mainToolbar.addButton("editar", null, "Editar", "ic-edit.png", "");
    mainToolbar.attachEvent('onClick', mainToolbarOnClicksecB);
    
    mainGrid.init();
    cargarUsuario();
    //
    mainForm = mainLayout.cells('b').attachForm();
    mainForm.attachEvent('onButtonClick', formOnClick);
    //mainForm.load(formData);
    
    mainToolbar = mainLayout.cells('b').attachToolbar();
    mainToolbar.setIconsPath('/assets/images/icons/');
    mainToolbar.addButton('nuevo',null,'Nuevo usuario',"ic-add.png","");
    mainToolbar.addSeparator();
    mainToolbar.addButton('eliminar',null,'Eliminar usuario');
    // mainToolbar.addItem(null, itemData, pos, insertAfter);
    mainToolbar.attachEvent('onClick', mainToolbarOnClick);
}
cargarUsuario = () => {
    mainGrid.clearAll();
    mainLayout.cells('a').progressOn();
    mainGrid.load('/api/CO0201/ejemplo/' + usrJson.empresa, () => {
        mainLayout.cells('a').progressOff();
    });
}

// Formulario   

    formData = [
        {type: "settings", position: "label-left", labelWidth: 130, inputWidth: 450},
        {type: "fieldset", label: "Hola!", inputWidth: 340, list:[
           //{type: "radio", name: "type", label: "Registrarse", labelWidth: "auto", position: "label-right", checked: true, list:[
               {type: "input", label: "Nombre Completo:", name: 'cnom'},
                {type: "input", label: "Email:", name: 'cema'},
                {type: "input", label: "Telefono:", name: 'ctel'},
                {type: "input", label: "Edad:", name: 'ceda'},
                {type: "input", label: "Usuario:", name: 'cusu',id:'cusu'},
                {type: "password", label: "Alias:",name: 'cali'},
           // ]}
            
            {type: "button",name: 'fguardar', value: "Guardar usuario"}
        ]}
    ];



mainToolbarOnClick = (id) => {
    switch (id) {
        case 'nuevo':
            // dhtmlx.alert({
            //     title:"Important!",
            //     type:"alert-error",
            //     text:"Nuevo documento!"
            // });
            mainForm.load(formData);
            break;
        case 'eliminar':
            mainLayout.cells('b').attachHTMLString('<h1 style="color:crimson;">Eliminando ...</h1>');
            break;
        case 'fguardar':
            dhtmlx.alert({
                title:"Important!",
                type:"alert-error",
                text:"Nuevo documento!"
            });
            break;
    }
}

mainToolbarOnClicksecB = (id) => {
    uUsuario = mainGrid.getSelectedRowId();
    switch(id) {        
        case 'eliminar':
            if(uUsuario) {
                dhtmlx.confirm({
                    title: "Eliminar periodo",
                    type: "confirm-error",
                    text: "Esta seguro?",
                    ok: 'Si',
                    cancel: 'No',
                    callback: (respuesta) => {
                        if(respuesta) {
                            const params = {
                                usuario: uUsuario
                            };
                            $.post(BASE_URL + 'CO0201/eliminar-usuario', params, EliminarSuccess, 'json');
                            //mainLayout.cells('a').progressOn();
                        }
                    }
                });
            }
            else {
                alert('Primero debe elegir un usuario');
            }
            break;
        case 'editar':
            pAccion = 'U';
            setVar = 'Editar Usuario';
            // mainForm.setItemValue('type_la', setVar);
            mainForm.load(formData);
            if(uUsuario) {                
                const params = {
                    usuario: uUsuario
                };
                $.post(BASE_URL + 'CO0201/cargar-datos-usuario', params, CargarDatosSuccess, 'json');
            }
            else {
                alert('Debes elegir un usuario');
            }
            break;
        //default: break;
    }
}

EliminarSuccess = (result) => {
    if(result.state == 'success') {
        cargarUsuario();
        dhtmlx.alert({
            title: "Operación completada",
            ok: "Aceptar",
            text: result.message
        });
       // cargarDatosGrilla();
    }
    else {
        dhtmlx.alert({
            title: "Error",
            type: "alert-error",
            text: result.message
        });
    }
}

GuardarUsuario = (result) => {      

    if(result.state == 'success') {
        cargarUsuario();
        dhtmlx.alert({
            title: "Operación completada",
            ok: "Aceptar",
            text: result.message
        });
    }
    else {
        dhtmlx.alert({
            title: "Error",
            type: "alert-error",
            text: result.message
        });
    }
    mainLayout.cells('a').progressOff();
}

formOnClick = (id) => {
    switch (id) {
        case 'fguardar':
         // usuario,alias,nombre,email,telefono,fiscalziado,edad
        const param = {
            accion: pAccion,
            usuario: mainForm.getItemValue('cusu'),
            alias: mainForm.getItemValue('cali'),
            nombre: mainForm.getItemValue('cnom'),
            email: mainForm.getItemValue('cema'),
            telefono: mainForm.getItemValue('ctel'),
            edad: mainForm.getItemValue('ceda'),
        };
        console.log(param);
        $.post(BASE_URL + 'CO0201/guardar-usuario', param, GuardarUsuario, 'json');                
        //mainLayout.cells('a').progressOn();
        break;
        default: break;
    }
}

CargarDatosSuccess = (result) => {
    
    if(result.state == 'success') {
        const usuario = result.data.usuario;
        //cargar los datos
        mainForm.setItemValue('cnom', usuario.DE_NOMBRE);
        mainForm.setItemValue('cema', usuario.DE_EMAIL);
        mainForm.setItemValue('ctel', usuario.DE_TELEFONO);
        mainForm.setItemValue('ceda', usuario.NU_EDAD);
        mainForm.setItemValue('cusu', usuario.CO_USUARIO);
        mainForm.setItemValue('cali', usuario.DE_ALIAS);
        mainForm.disableItem('cusu');
    }
    else {
        dhtmlx.alert({
            title: "Error",
            type: "alert-error",
            text: result.message
        });
    }
}