const oracledb = require('oracledb');
const dbParams = require('../database');
const fs = require('fs');
const ftp = require('ftp');
const ftpViewer = require('../ftp-viewer');

const responseParams = {
    outFormat: oracledb.OBJECT
};

const viewerController = {

    main: async (req, res) => {
        let { empresa } = req.params;
        res.render('./../client/views/home/viewer.ejs', { empresa: empresa });
    },

    FiltrarDocumentos: async (req, res) => {
        let { modo, desde, hasta, documento, empresa } = req.body;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select documento \"documento\",tipodoc \"tipo\" from table(pack_new_cuenta_corriente.f_documentos_electronicos(:p_modo,:p_desde,:p_hasta,:p_documento,:p_empresa)) order by tipodoc";
            let params = {
                p_modo: { val: modo },
                p_desde: { val: desde },
                p_hasta: { val: hasta },
                p_documento: { val: documento },
                p_empresa: { val: empresa }
            };
            let result = await conn.execute(query, params, responseParams);
            res.json({
                state: 'success',
                data: {
                    documentos: result.rows
                }
            });
        }
        catch(err) {
            console.log(err);
            res.json({
                state: 'error',
                message: err
            });
        }
    },

    MuestraDocumento: async (req, res) => {
        let { empresa, documento } = req.params;
        let rutaFtp;
        let now = new Date();
        let rutaTmp = './tmp/' + now.getFullYear() + (now.getMonth() < 9 ? '0' : '') + (now.getMonth() + 1) + (now.getDate() < 10 ? '0' : '') + now.getDate() + (now.getHours() < 10 ? '0' : '') + now.getHours() + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + (now.getSeconds() < 10 ? '0' : '') + now.getSeconds() + (now.getMilliseconds() < 100 ? '0' : '') + (now.getMilliseconds() < 10 ? '0' : '') + now.getMilliseconds() + '.pdf';
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select pack_new_cuenta_corriente.f_ruta_documento(:p_empresa,:p_documento) \"ruta\" from dual";
            let params = {
                p_empresa: { val: empresa },
                p_documento: { val: documento }
            };
            let result = await conn.execute(query, params, responseParams);
            if(result.rows.length > 0) {
                let rutaBD = result.rows[0].ruta;
                rutaFtp = '/xml/sunat/' + empresa + '/CLIENTES/' + rutaBD;

            }
            else rutaFtp = '/xml/sunat/files/not_found.pdf';
            //res.send(rutaFtp);
        }
        catch(err) {
            console.log(err);
            res.json({
                state: 'error',
                message: err
            });
        }
        //descarga el archivo
        let c = new ftp();
        c.on('ready', () => {
            c.get(rutaFtp, (err, stream) => {
                if(err) throw err;
                stream.once('close', () => {
                    console.log('conexión cerrada!');
                    c.end();
                });
                stream.pipe(fs.createWriteStream(rutaTmp));
            });
        });
        c.on('close', () => {
            let stream = fs.ReadStream(rutaTmp);
            let FileName = encodeURIComponent(documento + '.pdf');
            res.setHeader('Content-disposition', 'inline; filename="' + FileName + '"');
            res.setHeader('Content-type', 'application/pdf');
            stream.pipe(res);
            fs.unlink(rutaTmp, (err) => {
                if(err) console.log('Error:', err);
            });
        });
        c.connect(ftpViewer);
    }
};

module.exports = viewerController;
