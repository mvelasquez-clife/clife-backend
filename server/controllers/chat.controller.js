const mClient = require('mongodb').MongoClient;
const mongodb = require('./../mongodb');

const chatController = {
    MostrarInterfaz: (req, res) => {
        res.render('./../client/views/home/chat.ejs');
    },
    ListaContactos: (req, res) => {
        const usuario = parseInt(req.body.usuario);
        const empresa = parseInt(req.body.empresa);
        //carga la lista de contactos
        mClient.connect(mongodb.uri, async (err, db) => {
            if(err) throw(err);
            const dbo = db.db(mongodb.db);
            const query = { codigo: usuario, empresa: empresa };
            const contactos = await dbo.collection(mongodb.collections.contactos).find(query).toArray();
            const lista = contactos[0].contactos;
            const lcontactos = [];
            for(var i in lista) {
                const iLista = lista[i];
                var uQuery = { codigo: iLista, empresa: empresa };
                const iUsuario = await dbo.collection(mongodb.collections.usuarios).find(uQuery).toArray();
                if(iUsuario != undefined) lcontactos.push(iUsuario[0]);
            }
            res.json({
                state: 'success',
                contactos: lcontactos
            });
        });
    },
    AgregarContacto: (req, res) => {
        //const { usuario, contacto, empresa } = req.body;
        const usuario = parseInt(req.body.usuario);
        const contacto = parseInt(req.body.contacto);
        const empresa = parseInt(req.body.empresa);
        mClient.connect(mongodb.uri, (err, db) => {
            if(err) throw(err);
            const dbo = db.db(mongodb.db);
            const query = { codigo: usuario, empresa: empresa };
            dbo.collection(mongodb.collections.contactos).find(query).toArray((err, result) => {
                if(err) throw err;
                if(result.length == 0) {
                    dbo.collection(mongodb.collections.contactos).insertOne({
                        codigo: usuario,
                        empresa: empresa,
                        contactos: [contacto]
                    }, (e, r) => {
                        res.json({
                            state: 'success'
                        });
                    });
                }
                else {
                    dbo.collection(mongodb.collections.contactos).updateOne(query, { $push: { contactos: contacto } }, (e,r) => {
                        res.json({
                            state: 'success'
                        });
                    });
                }
                db.close();
            });
        });
    },
    ListaGrupos: (req, res) => {
        const usuario = parseInt(req.body.usuario);
        const empresa = parseInt(req.body.empresa);
        mClient.connect(mongodb.uri, async (err, db) => {
            if(err) throw(err);
            const dbo = db.db(mongodb.db);
            const query = { empresa: empresa, miembros: usuario };
            const grupos = await dbo.collection(mongodb.collections.grupos).find(query).toArray();
            const nGrupos = grupos.length;
            const lista = [];
            for(var i = 0; i < nGrupos; i++) {
                lista.push({
                    id: grupos[i].id,
                    nombre: grupos[i].grupo + ' (' + grupos[i].miembros.length + ' miembros)'
                });
            }
            res.json({
                state: 'success',
                grupos: lista
            });
        });
    },
    GuardarGrupo: (req, res) => {
        const id = req.body.id;
        const grupo = req.body.nombre;
        const empresa = parseInt(req.body.empresa);
        const miembros = JSON.parse(req.body.miembros);
        mClient.connect(mongodb.uri, (err, db) => {
            if(err) throw(err);
            const dbo = db.db(mongodb.db);
            dbo.collection(mongodb.collections.grupos).insertOne({
                id: id,
                grupo: grupo,
                empresa: empresa,
                miembros: miembros
            }, (error, result) => {
                db.close();
                res.json({
                    state: 'success'
                });
            });
        });
    },
    MiembrosGrupo: (req, res) => {
        const empresa = parseInt(req.body.empresa);
        const grupo = req.body.grupo;
        mClient.connect(mongodb.uri, async (err, db) => {
            if(err) throw(err);
            const dbo = db.db(mongodb.db);
            const query = { id: grupo, empresa: empresa };
            const iGrupo = await dbo.collection(mongodb.collections.grupos).find(query).toArray();
            if(iGrupo.length > 0) {
                const queryUsuarios = { codigo: { $in: iGrupo[0].miembros }, empresa: empresa };
                dbo.collection(mongodb.collections.usuarios).find(queryUsuarios).project({ codigo: 1, nombre: 1 }).toArray((err, result) => {
                    if(err) throw err;
                    db.close();
                    res.json({
                        state: 'success',
                        data: {
                            miembros: result,
                            grupo: iGrupo[0].grupo
                        }
                    });
                });
            }
            else {
                db.close();
                res.json({
                    state: 'error',
                    message: 'Grupo incorrecto'
                });
            }
        });
    }
};

module.exports = chatController;