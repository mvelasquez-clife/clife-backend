const Client = require('ftp');
const fs = require('fs');
const fetcher = require('fetch-base64');
const formidable = require('formidable');

const ftpAccess = require('../ftp-access');

const archivosController = {
    
    descargarImagenVoucher: (req, res) => {
        const { cuenta, periodo, operacion } = req.params;
        const c = new Client();
        c.on('ready', function() {
            c.get('/publico/document/11/BANCOS/' + cuenta + '/' + periodo + '/' + operacion + '.JPG', (err, stream) => {
                const filename = './tmp/' + new Date().getTime() + '.JPG';
                if(err) {
                    res.send("El depósito seleccionado no posee una imagen registrada.");
                    return;
                }
                stream.on('close', () => {
                    c.end();
                    fetcher.local(filename).then((data) => {
                        res.send('<html><head><style>*{margin:0;padding:0;} body{background-color:\'#404040\';height:100%;width:100%;}</style></head><body><div style="height:100%;width:100%;"><img src="' + data[1] + '" style="max-height:100%;max-width:100%;"/></div></body></html>');
                        fs.unlink(filename);
                    }).catch((reason) => {});
                });
                stream.pipe(fs.createWriteStream(filename));
            });
        });
        // connect to localhost:21 as anonymous
        c.connect(ftpAccess);
    },
    AdjuntarArchivoMensaje: async (req, res) => {
        var form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
            const empresa = fields.empresa;
            const emisor = fields.emisor;
            const path = __dirname + '/../../public/files/' + empresa + '/' + emisor + '/' + files.attach.name;
            fs.rename(files.attach.path, path, function(err) {
                if (err) next(err);
                res.json({
                    state: 'success',
                    data: {
                        url: '/files/' + empresa + '/' + emisor + '/' + files.attach.name,
                        name: files.attach.name
                    }
                });
            });
        });
        /*form.on('fileBegin', function (name, file){
            file.path = __dirname + '/../../public/files/' + empresa + '/' + emisor + '/' + file.name;
        });
        form.on('file', function (name, file){
            console.log('Uploaded ' + file.name);
        });
        //
        form.on('field', (name, value) => {
            if(name == 'empresa') empresa = value;
            if(name == 'emisor') emisor = value;
        });
        form.on('fileBegin', function (name, file){
            file.path = __dirname + '/../../public/files/' + empresa + '/' + emisor + '/' + file.name;
        });
        form.on('file', function (name, file){
            console.log('Uploaded ' + file.name);
        });
        res.json({
            state: 'success'
        });*/
    }
}

module.exports = archivosController;