var FormularioSeguridad;
const FormularioSeguridadStruct = [
    { type: 'settings', position: 'label-left', offsetLeft: 4, offsetTop: 4 },
    { type: 'label', label: '<span id="sp-titulo" style="background-color:#272727;display:inline-block;margin:0 25px;font-size:16px;padding:8px;text-align:center;width:375px;">Validando permisos...</span>', offsetLeft: 16, offsetTop: 12, labelWidth:425 },
    { type: 'label', label: '<span style="color:#808080;display:inline-block;font-size:12px;text-align:center;width:450px;">A continuación, deberá ingresar su usuario y contraseña para continuar</span>', labelWidth:454 },
    { type: 'block', blockOffset: 0, list: [
        { type: 'block', blockOffset: 0, list: [
            { type: 'input', label: 'Usuario', name: 'fsUsuario', labelWidth: 60, inputWidth: 120, offsetTop: 18, value: usrJson.alias },
            { type: 'password', label: 'Clave', name: 'fsClave', labelWidth: 60, inputWidth: 120, offsetTop: 24 },
        ] },
        { type: 'newcolumn' },
        { type: 'block', blockOffset: 0, list: [
            { type: 'label', offsetLeft: 48, label: '<img src="/assets/images/icons/ic-lock.svg" style="width:144px"/>' }
        ] }
    ] },
    { type: 'block', blockOffset: 128, offsetTop: 12, list: [
        { type: 'button', name: 'fsAceptar', value: '<b>Aceptar</b>', offsetLeft: 6 },
        { type: 'newcolumn' },
        { type: 'button', name: 'fsCancelar', value: 'Cancelar', offsetLeft: 16 },
    ] },
];

IniciarFormularioSeguridad = (windowId, container) => {
    return new Promise(resolve => {
        winFormularioSeguridad = container.dhxWins.createWindow('winFormularioSeguridad',0,0,480,320);
            winFormularioSeguridad.center();
            winFormularioSeguridad.keepInViewport(true);
            winFormularioSeguridad.setModal(true);
            winFormularioSeguridad.setText('Esta acción requiere permisos');
            winFormularioSeguridad.button('close').hide();
            winFormularioSeguridad.button('park').hide();
            winFormularioSeguridad.button('minmax').hide();
        FormularioSeguridad = winFormularioSeguridad.attachForm();
            FormularioSeguridad.load(FormularioSeguridadStruct);
            const params = {
                id: windowId,
                empresa: usrJson.empresa,
                usuario: usrJson.codigo
            };
            $.post('/api/ancestros/datos-modal-seguridad', params, (result) => {
                if(result.state == 'success') {
                    const data = result.data;
                    document.getElementById('sp-titulo').innerHTML = data.titulo ? data.titulo : 'Ventana no encontrada';
                    document.getElementById('sp-titulo').style.color = '#f8f8f8';
                    document.getElementById('sp-titulo').style.backgroundColor = data.distabla == 'S' ? '#4caf50' : '#e53935';
                    if(data.disusuario == 'S') {
                        FormularioSeguridad.enableItem('fsUsuario');
                        FormularioSeguridad.enableItem('fsClave');
                        FormularioSeguridad.enableItem('fsAceptar');
                    }
                    else {
                        FormularioSeguridad.disableItem('fsUsuario');
                        FormularioSeguridad.disableItem('fsClave');
                        FormularioSeguridad.disableItem('fsAceptar');
                    }
                    FormularioSeguridad.attachEvent('onButtonClick', (buttonId) => {
                        switch(buttonId) {
                            case 'fsAceptar':
                                //ajax
                                /*if(data.disusuario == 'S') {
                                    const pOut = {
                                        id: windowId,
                                        result: 'S'
                                    };
                                    winFormularioSeguridad.close();
                                    resolve(JSON.stringify(pOut));
                                }
                                else resolve(null);*/
                                winFormularioSeguridad.progressOn();
                                const params = {
                                    alias: FormularioSeguridad.getItemValue('fsUsuario'),
                                    empresa: usrJson.empresa,
                                    tabla: windowId,
                                    clave: FormularioSeguridad.getItemValue('fsClave')
                                };
                                $.post('/api/ancestros/validar-clave', params, (response) => {
                                    if(response.state == 'success') {
                                        const pOut = {
                                            id: windowId,
                                            result: 'S'
                                        };
                                        if(winFormularioSeguridad) winFormularioSeguridad.progressOff();
                                        winFormularioSeguridad.close();
                                        resolve(JSON.stringify(pOut));
                                    }
                                    else {
                                        alert(response.result);
                                    }
                                }, 'json');
                                //.always(() => {
                                 //   if(winFormularioSeguridad) winFormularioSeguridad.progressOff();
                                //});
                                break;
                            case 'fsCancelar':
                                FormularioSeguridad.setItemValue('fsUsuario','');
                                FormularioSeguridad.setItemValue('fsClave','');
                                winFormularioSeguridad.close();
                                resolve(null);
                                break;
                            default:
                                resolve(null);
                                break;
                        }
                    });
                }
            }, 'json').fail((error) => {
                resolve(null);
            });
    });
}