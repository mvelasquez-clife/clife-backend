const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');
const formidable = require('formidable');
var fs = require('fs-extra');
const desiredMode = 0o2775;

const responseParams = {
    outFormat: oracledb.OBJECT
};

const ma010104Controller = {
    upload: (req, res) => {
        var __req = req;// console.log(req);
        var __src, __file;
        if (req.method.toLowerCase() == 'post') {
            var formu = new formidable.IncomingForm();
            formu.maxFileSize = 2 * 1024 * 1024;
            formu.on('fileBegin', function (name, file) {
                file.path = './public/assets/images/' + file.name;
            });
            formu.on('file', function (name, file) {
                __file = file;
            });
            formu.on('error', function (error) { // I thought this would handle the upload error
                if (error)
                    res.json({state: 'alert', message: error});
                res.resume();
                return false;
            });
            formu.parse(req, function (err, fields, files) {
                if (!err)
                    res.json({state: 'success', src: '/assets/images/ma010104/' + files.file_name.name});
                else
                    res.json({state: 'alert', message: err});
            });
            return;
        }
    },
    file_exist: (req, res) => {
        const {emp} = req.body;
        var path_ = './public', FolferLogo = '/assets/images/ma010104/' + emp;
        var folder = path_ + FolferLogo;
        fs.ensureDir(folder, desiredMode).then(() => {
            var files = [fs.readdirSync(folder)];
            __srclogo = (files[0].length > 0) ? FolferLogo + '/' + files[0] : '/assets/images/icons/iconsjhon/camera.png';
            res.json({state: 'readfile', srclogo: __srclogo});
        }).catch(err => {
            console.error(err);
        });
    },
    update_data: (req, res) => {
        const  {accion, emp, codigo, direc, dcorta, stpropio, ubigeo} = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({state: 'error', message: err.stack});
                return;
            }

            const params = {accio_: accion, emp_: emp, codigo_: codigo, direc: direc, dcort: dcorta, stpro: stpropio, ubige: ubigeo, o_resultado: {dir: oracledb.BIND_OUT, type: oracledb.STRING}};

            var query = 'call PW_MA010104.UPDATE_DATA(:accio_,:emp_,:codigo_,:direc,:dcort,:stpro,:ubige,:o_resultado)';
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({state: 'error', message: error.stack});
                    return;
                } else {
                    const {o_resultado} = result.outBinds;
                    res.json({
                        state: 'success',
                        message: o_resultado
                    });
                }
                // conn.commit();

            });
        });
    },
    c_list_estado: (req, res) => {
        res.set('Content-Type', 'application/xml');
        res.send('<?xml version="1.0" encoding="utf-8"?><complete>  <option value="Vigente" selected="true" css="color:green">Vigente</option>  <option value="Retirado" css="color:red">Retirado</option></complete>');
    },
    
    datos_empresa: (req, res) => {
        const  {emp} = req.body; 
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({state: 'error', error_conexion: err.stack});
                return;
            }//   RUC,DE_RAZ_SOCIAL,DE_NOMBRE,MONEDA,FE_REGIS,ES_VIGENCIA
            const query = '  SELECT   *   FROM TABLE(PW_MA010104.F_DATA_EMPRESA(:p_empresa) ) ';
            const params = {p_empresa: emp};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({'error_query': error.stack});

                    return;
                }
                res.set('Content-Type', 'application/json');
                res.send(result.rows); 
                conn.close();
            });
        });
    },
    
    cargardata: (req, res) => {
        const  {emp} = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({state: 'error', error_conexion: err.stack});
                return;
            }
            const query = '  SELECT        CO_DIRECCION_EMPRESA ,DE_DIRECCION,FE_SYS,CO_UBIGEO,ES_VIGENCIA,ST_PRINCIPAL,ST_PROPIO,DE_DIRECCION_CORTA,NPRINCIPAL,NUBIGEO  FROM TABLE(PW_MA010104.F_DATA_DIRECC(:p_empresa) ) ';
            const params = {p_empresa: emp};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({'error_query': error.stack});

                    return;
                }
                res.set('Content-Type', 'application/json');
                res.send(result.rows);
                conn.close();
            });
        });
    },

    cambiaestado: (req, res) => {
        const  {emp, codigo, vigencia, tipo} = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({state: 'error', message: err.stack});
                return;
            }
            var query = '  call PW_MA010104.UPDATE_ESTADO(:emp, :codigo, :vigencia,:o_resultado)';
            const params = {codigo: codigo, vigencia: vigencia, emp: emp, o_resultado: {dir: oracledb.BIND_OUT, type: oracledb.STRING}};
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    return  res.send({state: 'error', message: error.stack});
                } else {
                    const {o_resultado} = result.outBinds;
                    return  res.json({state: 'success', message: o_resultado});
                }

            });
        });
    }

};

module.exports = ma010104Controller;