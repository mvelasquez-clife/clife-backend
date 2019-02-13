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
    }
};

module.exports = chatController;