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
var listaContactos = [];
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
            chatsTabbar.tabs(id).attachHTMLString('<div id="div-' + id + '"></div>');
            $('#div-' + id).append(
                $('<div>').append(
                    $('<div>')
                ).addClass('dv-chat-body').attr('id','chat-' + id)
            ).append(
                $('<div>').append(
                    $('<form>').append(
                        $('<a>').append(
                            $('<img>').attr('src', '/assets/images/icons/chat/user-add/cyan.svg')
                        ).attr({
                            'id': 'btn-add-' + id,
                            'href': '#',
                            'data-to': id,
                            'data-contact': 0,
                            'data-nombre': name
                        }).addClass('btn-add')
                    ).append(
                        $('<label>').append(
                            $('<img>').attr('src', '/assets/images/icons/chat/attach/cyan.svg')
                        ).attr({
                            'href': '#',
                            'data-to': id,
                            'for': 'chform-file-' + id
                        })
                    ).append(
                        $('<input>').attr({
                            id: 'chform-file-' + id,
                            type: 'file',
                            'data-id': id
                        }).addClass('chform-file')
                    ).append(
                        $('<input>').attr({
                            'type': 'text',
                            'id': 'chform-input-' + id,
                            'placeholder': 'Escribe un mensaje o pega una imagen aquí',
                            'data-to': id
                        })
                    ).append(
                        $('<button>').append(
                            $('<img>').addClass('chform-button-image').attr('src', '/assets/images/icons/chat/send/cyan.svg')
                        )
                    ).addClass('chform').attr('id','chform-' + id)
                ).addClass('dv-chat-footer')
            ).addClass('dv-chat');
            const h = $('#chat-' + id).parent().height() - 50;
            const w = $('#chform-' + id).width() - 160;
            $('#chform-input-' + id).width(w);
            $('#chat-' + id).height(h);
            $('#chform-' + id).attr({
                'data-to': id
            }).on('submit', sendMessage);
            $('#btn-add-' + id).on('click', AgregarContacto);
            $('#chform-file-' + id).on('change', AdjuntarArchivo);
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
    //verifica si es contacto
    for(var i in listaContactos) {
        if(id == listaContactos[i].codigo) {
            $('#btn-add-' + id).children('img').attr('src','/assets/images/icons/chat/user-contact/cyan.svg');
            $('#btn-add-' + id).attr('data-contact',1);
        }
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
            listaContactos = response.contactos;
            for(var i in listaContactos) {
                const iContacto = listaContactos[i];
                if(iContacto != null) {
                    contactosTree.insertNewChild(1, iContacto.codigo, iContacto.nombre, null, 'ic-user-online.png');
                }
            }
        }
    }, 'json');
}
ConectarSocketChat = () => {
    socket.on('message', function (data) {
        IniciarChat(data.from.id, data.from.name);
        const divId = '#chat-' + data.from.id;
        EscribeMensajeEntrante(divId, data.from.id, data.message);
    });
    socket.on('conectar', (data) => {
        if(data.result) {
            console.log('usuario', data.user, 'disponible');
        }
        else {
            console.log('el usuario', data.user, 'está desconectado');
        }
    });
    socket.on('iniciar', (data) => {
        const divId = '#chat-' + data.receptor;
        const mensajes = data.mensajes;
        $(divId).children('div').empty();
        for(var i in mensajes) {
            const iMensaje = mensajes[i];
            if(iMensaje.from == usrJson.codigo) {
                EscribeMensajeSaliente(divId, usrJson.codigo, iMensaje.message);
            }
            else {
                EscribeMensajeEntrante(divId, iMensaje.from, iMensaje.message);
            }
        }
    });
    CargarListaContactos();
}
AdjuntarArchivo = (event) => {
    const data = new FormData();
    const divId = '#chat-' + event.delegateTarget.dataset.id;
    $.each($('#chform-file-' + event.delegateTarget.dataset.id)[0].files, function(i, file) {
        data.append('attach', file);
    });
/*
emisor: {
    id: parseInt(usrJson.codigo),
    name: (usrJson.nombre ? usrJson.nombre : usrJson.fullname)
},
receptor: parseInt(dataset.to),
empresa: usrJson.empresa,
*/
    data.append('emisor', usrJson.codigo);
    data.append('empresa', usrJson.empresa);
    //
    const aid = 'id-' + new Date().getMilliseconds();
    const mensaje = '<a class="chform-link" href="javascript:void(0)" id="' + aid + '">Subiendo archivo...</a>';
    const msgdata = {
        emisor: {
            id: parseInt(usrJson.codigo),
            name: (usrJson.nombre ? usrJson.nombre : usrJson.fullname)
        },
        receptor: parseInt(event.delegateTarget.dataset.id),
        empresa: usrJson.empresa,
        mensaje: mensaje
    }
    EscribeMensajeSaliente(divId, usrJson.codigo, mensaje);
    //document.getElementById(inputId).value = '';
    $.ajax({
        url: '/files/message-attach',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        method: 'POST',
        type: 'POST',
        success: (response) => {
            if(response.state == 'success') {
                $('#' + aid).attr({
                    href: response.data.url,
                    download: response.data.name
                }).text(response.data.name);
                //actualiza los valores en el mongodb
                msgdata.mensaje = '<a class="chform-link" href="' + response.data.url + '" id="' + aid + '" download="' + response.data.name + '">' + response.data.name + '</a>';
                socket.emit('message', msgdata);
            }
        }
    });
}