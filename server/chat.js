var io;
const mClient = require('mongodb').MongoClient;
const mongodb = require('./mongodb');

module.exports = {
    ArrancarServidorChat: (http) => {
        io = require('socket.io')(http);
        io.set('origins', 'http://192.168.11.138:3000');
        io.on('connection', (socket) => {
            const user = socket.handshake.query;
            //verificar si el usuario está registrado
            mClient.connect(mongodb.uri, (err, db) => {
                if(err) throw(err);
                const dbo = db.db(mongodb.db);
                const query = { codigo: parseInt(user.codigo), empresa: parseInt(user.empresa) };
                dbo.collection(mongodb.collections.usuarios).find(query).toArray((err, result) => {
                    if(err) throw err;
                    if(result.length == 0) {
                        if(user.hasOwnProperty('alias')) {
                            dbo.collection(mongodb.collections.usuarios).insertOne({
                                codigo: parseInt(user.codigo),
                                nombre: user.nombre,
                                empresa: parseInt(user.empresa),
                                socketId: socket.id
                            });
                        }
                        else {
                            dbo.collection(mongodb.collections.usuarios).insertOne({
                                codigo: parseInt(user.codigo),
                                nombre: user.nombre,
                                empresa: parseInt(user.empresa),
                                alertsId: socket.id
                            });
                        }
                    }
                    else {
                        if(user.hasOwnProperty('alias')) {
                            dbo.collection(mongodb.collections.usuarios).updateOne(query, { $set: { socketId: socket.id } });
                        }
                        else {
                            dbo.collection(mongodb.collections.usuarios).updateOne(query, { $set: { alertsId: socket.id } });
                        }
                    }
                    db.close();
                });
            });
            //
            socket.on('disconnect', () => {
                mClient.connect(mongodb.uri, (err, db) => {
                    if(err) throw(err);
                    const dbo = db.db(mongodb.db);
                    const query = { socketId: socket.id };
                    if(user.hasOwnProperty('alias')) {
                        dbo.collection(mongodb.collections.usuarios).updateOne(query, { $set: { socketId: null } });
                    }
                    else {
                        dbo.collection(mongodb.collections.usuarios).updateOne(query, { $set: { alertsId: null } });
                    }
                });
            });
            //establecer una conexión
            socket.on('iniciar', (data) => {
                //verifica si el destinatario está conectado
                mClient.connect(mongodb.uri, (err, db) => {
                    if(err) throw(err);
                    const dbo = db.db(mongodb.db);
                    const queryDestinatario = { codigo: data.destino, empresa: data.empresa };
                    dbo.collection(mongodb.collections.usuarios).find(queryDestinatario).toArray((err, result) => {
                        const message = {
                            result: err || (result.length > 0 && result[0].socketId),
                            user: data.destino
                        }
                        socket.emit('conectar', message);
                    });
                    //busca mensajes anteriores
                    const queryMensajes = {
                        $or: [
                            { from: data.origen, to: data.destino },
                            { from: data.destino, to: data.origen }
                        ]
                    };
                    dbo.collection(mongodb.collections.mensajes).find(queryMensajes).sort({sent:1}).toArray((err, result) => {
                        const list = {
                            receptor: data.destino,
                            mensajes: result
                        };
                        socket.emit('iniciar', list);
                    });
                });
            });
            //recibir un mensaje
            socket.on('message', (data) => {
                mClient.connect(mongodb.uri, (err, db) => {
                    if(err) throw(err);
                    const dbo = db.db(mongodb.db);
                    const query = { codigo: parseInt(data.receptor), empresa: data.empresa };
                    dbo.collection(mongodb.collections.usuarios).find(query).toArray((err, result) => {
                        if(err) {
                            console.log(err);
                            return;
                        }
                        var online = false;
                        if(result.length > 0 && result[0].socketId) {
                            const destinatario = result[0];
                            //socket.emit('conectar', destinatario);
                            const message = {
                                from: data.emisor,
                                message: data.mensaje
                            };
                            socket.to(destinatario.socketId).emit('message', message);
                            if(destinatario.alertsId) {
                                socket.to(destinatario.alertsId).emit('message', message);
                            }
                            online = true;
                        }
                        const omensaje = {
                            from: data.emisor.id,
                            to: data.receptor,
                            checked: online,
                            message: data.mensaje,
                            sent: new Date()
                        };
                        dbo.collection(mongodb.collections.mensajes).insertOne(omensaje);
                    });
                });
            });
            //unirse a un grupo
            socket.on('unir', (data) => {
                socket.join(data.destino);
            });
            //solicita historial de mensajes del grupo
            socket.on('chatroom-historial', (data) => {
                mClient.connect(mongodb.uri, (err, db) => {
                    if(err) throw(err);
                    const dbo = db.db(mongodb.db);
                    //busca mensajes anteriores
                    const queryMensajes = { to: data.destino };
                    dbo.collection(mongodb.collections.mensajes).find(queryMensajes).sort({sent:1}).toArray((err, result) => {
                        const list = {
                            receptor: data.destino,
                            mensajes: result
                        };
                        io.to(data.destino).emit('chatroom-historial', list);
                    });
                });
            });
            //mensaje grupal
            socket.on('chatroom', (data) => {
                mClient.connect(mongodb.uri, (err, db) => {
                    if(err) throw(err);
                    const mensaje = {
                        from: data.grupo,
                        emisor: data.emisor,
                        message: data.mensaje
                    };
                    io.to(data.grupo).emit('chatroom', mensaje);
                    const dbo = db.db(mongodb.db);
                    //guarda el mensaje
                    const omensaje = {
                        from: data.emisor.id,
                        to: data.grupo,
                        checked: true,
                        message: data.mensaje,
                        sent: new Date()
                    };
                    dbo.collection(mongodb.collections.mensajes).insertOne(omensaje);
                });
            });
        });
        //go
        http.listen(3001, () => {
            console.log('chat iniciado');
        });
    }
}