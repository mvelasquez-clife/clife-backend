const structs = {
    chatRibbon: {
        icons_path: '/assets/images/icons/chat/',
        items: [
            {
                type: 'block', mode: 'cols', list: [
                    { type: 'button', id: 'busqueda', text: '<span style="color:#43a047;">Conectado</span>', isbig: true, img: '../../../photos/' + usrJson.codigo + '/img_perfil/' + usrJson.codigo + '_profile.png' }
                ]
            },
            {
                type: 'block', list: [
                    { type: 'buttonSelect', text: '<b>' + usrJson.alias + '</b> (Conectado)', img: 'ic-online.svg', items: [
                        { id: 'online', text: 'Conectado' },
                        { id: 'standby', text: 'Ausente' },
                        { id: 'offline', text: 'Desconectado' },
                    ] },
                    { id: 'mensaje', type: 'input', width: 160 },
                    { type : 'group', list : [
                        { id: 'chat', type: 'button', text: '(0)', img: 'ic-message.svg' },
                        { id: 'nuevo', type: 'button', img: 'ic-add-user.svg', title: 'Agregar contacto', tooltip: 'Agregar usuario equis de' },
                        { id: 'grupo', type: 'button', img: 'ic-add-group.svg' }
                    ]}
                ]
            }
        ]
    }
};
mainRibbonOnClick = async (id) => {
    switch(id) {
        case 'nuevo':
            var output = await IniciarGridBusqueda(3, false, mainLayout);
            if(output) {
                const contacto = output.seleccion[0];
                contactosTree.insertNewChild(1,contacto.codigo,contacto.nombre,null,'ic-user-online.png');
                //abre un tab
                IniciarChat(contacto.codigo);
            }
            break;
    }
}
contactosTreeOnDblClick = (id) => {
    if(contactosTree.hasChildren(id) == 0) {
        IniciarChat(id);
    }
    return true;
}
IniciarChat = (id,name = contactosTree.getItemText(id)) => {
    if(!chatsTabbar.tabs(id)) {
        chatsTabbar.addTab(id, name, null, 0, true, true);
            chatsTabbar.tabs(id).attachHTMLString('<div class="dv-chat"><div id="chat-' + id + '" class="dv-chat-body"><div></div></div><div class="dv-chat-footer"><form class="chform" id="chform-' + id + '"><a href="#" id="btn-add-' + id + '" data-to="' + id + '" data-contact="0" data-nombre="' + name + '" class="btn-add"><img src="/assets/images/icons/chat/user-add/cyan.svg"></a><input type="text" id="chform-input-' + id + '" placeholder="Escribe un mensaje o pega una imagen aquí" data-to="' + id + '"/><button><img class="chform-button-image" src="/assets/images/icons/chat/send/cyan.svg"/></button><form></div></div>');
            const h = $('#chat-' + id).parent().height() - 50;
            const w = $('#chform-' + id).width() - 118;
            $('#chform-input-' + id).width(w);
            $('#chat-' + id).height(h);
            $('#chform-' + id).attr({
                'data-to': id
            }).on('submit', sendMessage);
            $('#btn-add-' + id).on('click', AgregarContacto);
            //
            $('#chform-input-' + id).pastableTextarea();
            $('#chform-input-' + id).on('pasteImage', function (ev, data){
                const divId = '#chat-' + ev.target.dataset.to;
                const mensaje = '<img src="' + data.dataURL + '" style="height:240px;">'
                const ds = {
                    emisor: {
                        id: parseInt(usrJson.codigo),
                        name: (usrJson.nombre ? usrJson.nombre : usrJson.fullname)
                    },
                    receptor: parseInt(ev.target.dataset.to),
                    empresa: usrJson.empresa,
                    mensaje: mensaje
                }
                EscribeMensajeSaliente(divId, usrJson.codigo, mensaje);
                socket.emit('message', ds);
            }).on('pasteImageError', function(ev, data){
                alert('Oops: ' + data.message);
                if(data.url){
                    alert('But we got its url anyway:' + data.url)
                }
            }).on('pasteText', function (ev, data){
                console.log("text: " + data.text);
            });
            //
        const usuario = { destino: parseInt(id), empresa: usrJson.empresa, origen: parseInt(usrJson.codigo) }
        socket.emit('iniciar', usuario);
    }
    else {
        chatsTabbar.tabs(id).setActive();
    }
}
sendMessage = (event) => {
    event.preventDefault();
    const dataset = event.currentTarget.dataset;
    const divId = '#chat-' + dataset.to;
    const inputId = 'chform-input-' + dataset.to;
    const mensaje = document.getElementById(inputId).value;
    if(mensaje != '') {
        const data = {
            emisor: {
                id: parseInt(usrJson.codigo),
                name: (usrJson.nombre ? usrJson.nombre : usrJson.fullname)
            },
            receptor: parseInt(dataset.to),
            empresa: usrJson.empresa,
            mensaje: mensaje
        }
        EscribeMensajeSaliente(divId, usrJson.codigo, mensaje);
        document.getElementById(inputId).value = '';
        socket.emit('message', data);
    }
}
EscribeMensajeEntrante = (divId, remitente, mensaje) => {
    const span = $('<span>').html(mensaje);
    if(span.has('img')) span.children('img').on('click', showImage).attr('title','Click para ampliar la imagen');
    $(divId).children('div').append(
        $('<div>').addClass('dv-message dv-message-in').append(
            $('<img>').attr('src','/assets/photos/' + remitente + '/img_perfil/' + remitente + '_profile.png')
        ).append(span)
    );
    $(divId).scrollTop($(divId)[0].scrollHeight);
}
EscribeMensajeSaliente = (divId, emisor, mensaje) => {
    const span = $('<span>').html(mensaje);
    if(span.has('img')) span.children('img').on('click', showImage).attr('title','Click para ampliar la imagen');
    $(divId).children('div').append(
        $('<div>').addClass('dv-message dv-message-out').append(span).append(
            $('<img>').attr('src','/assets/photos/' + emisor + '/img_perfil/' + emisor + '_profile.png')
        )
    );
    $(divId).scrollTop($(divId)[0].scrollHeight);
}
showImage = (event) => {
    const src = event.currentTarget.src;
    const win = window.open(src, '_blank');
    win.focus();
}
AgregarContacto = (event) => {
    event.preventDefault();
    const dataContacto = event.currentTarget.dataset;
    if(dataContacto.contact == '0') {
        dhtmlx.confirm({
            ok: 'Si, agregar',
            cancel: 'No',
            text: '¿Agregar a <b>' + dataContacto.nombre + '</b> a tu lista de contactos?',
            callback: (result) => {
                if(result) {
                    const params = {
                        usuario: parseInt(usrJson.codigo),
                        contacto: parseInt(dataContacto.to),
                        empresa: parseInt(usrJson.empresa)
                    };
                    $.post('/chat/agregar-contacto', params, (response) => {
                        if(response.state == 'success') {
                            dhtmlx.message('¡Contacto agregado!');
                            $('#btn-add-' + dataContacto.to).children('img').attr('src','/assets/images/icons/chat/user-contact/cyan.svg');
                            $('#btn-add-' + dataContacto.to).attr('data-contact',1);
                        }
                        else {
                            dhtmlx.message({
                                type: "error",
                                text: response.message
                            });
                        }
                    }, 'json');
                }
            }
        });
    }
    else dhtmlx.message({
        type: "error",
        text: 'El usuario seleccionado ya está en tu lista de contactos'
    });
}
CargarListaContactos = () => {
    const params = {
        usuario: usrJson.codigo,
        empresa: usrJson.empresa
    };
    $.post('/chat/lista-contactos', params, (response) => {
        if(response.state == 'success') {
            const contactos = response.contactos;
            for(var i in contactos) {
                const iContacto = contactos[i];
                if(iContacto != null) {
                    contactosTree.insertNewChild(1, iContacto.codigo, iContacto.nombre, null, 'ic-user-online.png');
                }
            }
        }
        //const contactos = res
    }, 'json');
}