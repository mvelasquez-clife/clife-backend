const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');
const moment = require('moment');
var fs = require('fs-extra');
const Busboy = require('busboy');
const readChunk = require('read-chunk');
const fileType = require('file-type');
var Client = require('ftp');
var path = require('path');
const utf8 = require('utf8');
const responseParams = {
    outFormat: oracledb.OBJECT
};

const config = {
    host: '192.168.0.248',
    port: 21,
    user: 'admlife',
    password: 'L1f3$21',
    size: 500000000
};


const ma010102Controller = {
    add_filebbdd: (req, res) => {
        const { xoption, xemp, xcliente, xusuareg, xfile, xfilext } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error_conec', message: err.stack });
                return;
            }

            const params = {
                xoption: xoption, xemp: parseInt(xemp), xcliente: xcliente, xruta: path.join('x:', xemp, 'CLIENTES', xcliente + '/'), xusuareg: parseInt(xusuareg), xfile: xfile, xfilext: xfilext,
                o_codresult: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }, o_deresultado: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            };
            var query = 'call PW_MA010102.ADD_FILE_BBDD(:xoption,:xemp,:xcliente,:xruta,:xusuareg,:xfile,:xfilext,:o_codresult, :o_deresultado)';
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ state: 'error_query', message: error.stack });
                    return;
                } else {
                    const { o_codresult, o_deresultado } = result.outBinds;
                    diaActual = new Date();
                    res.json({
                        state: 'success', codigo: o_codresult, message: o_deresultado, fecha: diaActual.getDate() + '/' + (parseInt(diaActual.getMonth()) + parseInt(1)) + '/' + diaActual.getFullYear()
                    });
                }
            });
        });
    },
    docu_clear: (req, res) => {
        const { cliente, emp, file } = req.params;
        const pathserver = '/publico/document/' + emp + '/CLIENTES/' + cliente + '/' + file;
        const pathfs = 'public/assets/images/ma010102/' + cliente + '/' + file;
        var c = new Client();
        function remove() {
            return new Promise((resolve, reject) => {
                var c1 = new Client();
                c1.get(pathserver, false, function (err, stream) {
                    if (err) { console.log('no esta en el servidor o ocurrio un error..'); resolve(0); } else {
                        stream.once('close', function () {
                            c1.delete(pathserver, function (err) {
                                if (err) console.log('Error ' + err);
                                console.log('borrado del servidor OK');
                            });
                            c1.end();
                        });
                    }
                });
                c1.connect(config);
                fs.unlink(pathfs, (err) => {
                    if (err) {
                        resolve(0);
                        return
                    }
                    resolve(1);
                });
            });
        }

        c.on('ready', function () {
            var results = remove();
            results.then(data => {
                res.set('Content-Type', 'application/json');
                res.send(JSON.stringify({ 'codigo': data }));
            });
        });
        c.connect(config);
    },
    limpiar_files: (req, res) => {
        const directory = 'public/assets/images/ma010102/';
        fs.readdir(directory, (err, files) => {
            if (err) console.log(err);

            for (const file of files) {
                fs.unlink(path.join(directory, file), err => {
                    if (err) console.log(err);
                });
            }
        });
    },
    documentosup: (req, res) => {
        const { cliente, emp } = req.params;
        const busboy = new Busboy({ headers: req.headers });
        var steup = false;
        var filenm = '';
        var savenm = '';
        var c = new Client();
        function upserver(file) {
            return new Promise((resolve, reject) => {
                c.on('ready', function () {
                    c.put(savenm, file, function (err) {
                        if (err) { steup = false, console.log(err); } else {
                            resolve(true);
                        }
                        c.end();
                    });
                });
                c.connect(config);
            });
        }

        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            filenm = filename;
            var saveTo = path.join('public/assets/images/ma010102/' + cliente + '/', filename);
            savenm = saveTo;
            file.pipe(fs.createWriteStream(saveTo));
        });
        busboy.on('finish', function () {
            var searchserver = '/publico/document/' + emp + '/CLIENTES/' + cliente + '/' + filenm;
            results = upserver(searchserver);
            results.then(data => {
                res.set('Content-Type', 'application/json');
                res.send({ "state": data, "steup": data });
            });
        });
        return req.pipe(busboy);
    },
    documentos: (req, res) => {
        const { cliente, emp } = req.params;
        const pathfs = 'public/assets/images/ma010102/' + cliente;
        const pathserver = '/publico/document/' + emp + '/CLIENTES/' + cliente;
        const pathserver_p = '/publico/document/' + emp + '/CLIENTES/';
        const path_prev = path.join('/assets/images/ma010102/', cliente);
        var c = new Client();
        if (!fs.existsSync(pathfs)) {
            fs.mkdirSync(pathfs);
        }
        function filesasync(elem) {
            return new Promise((resolve, reject) => {
                var sarchPath = path.join(pathfs + '/' + utf8.decode(elem.name));
                var searchserver = pathserver + '/' + utf8.decode(elem.name);
                fs.exists(sarchPath, (exists) => {
                    if (!exists) {
                        var c1 = new Client();
                        c1.get(searchserver, false, function (err, stream) {//console.log('elem.name ' +utf8.decode(elem.name));
                            let saveTo = path.join(pathfs + '/', utf8.decode(elem.name));
                            if (err) { resolve(err); } else {
                                stream.once('close', function () {
                                    //console.log('close : '+ saveTo);
                                    resolve(stream);
                                    c1.end();
                                });
                                stream.pipe(fs.createWriteStream(saveTo), function () {
                                    console.log('saveTo : ' + saveTo);
                                });
                            }
                        });
                        c1.connect(config);
                    } else {
                        resolve('file exists ' + utf8.decode(elem.name));
                    }
                });
            });
        }
        function find(list) {
            var st = 0;
            for (var i = 0; i < list.length; i++) {
                if (list[i].name == String(cliente)) {
                    return new Promise((resolve, reject) => {
                        st = 1;
                        resolve(1);
                    });
                    break;
                }
            }
            if (st === 0) {
                return new Promise((resolve, reject) => {
                    resolve(0);
                });
            }
        }
        function server_folfer(path) {            //console.log(path);
            return new Promise((resolve, reject) => {
                var c2 = new Client();
                c2.on('ready', function () {
                    c2.list(path, false, function (err, list) {
                        if (err) console.log(err);
                        if (list.length > 0) {
                            var results = find(list);
                            results.then(data => {
                                if (data == 1) {
                                    resolve('createdold');
                                } else {
                                    c2.mkdir(path, false, function (err) {
                                        if (err) {
                                            resolve('fail' + err);
                                        } else {
                                            resolve('created');
                                        }
                                        c2.end();
                                    });
                                }
                            });
                        } else {
                            resolve('nolistLCIENTE');
                        }
                    });
                });
                c2.connect(config);
            });
        }

        c.on('ready', function () {
            c.list(pathserver, false, function (err, list) {
                if (err) console.log(' c.get :' + err);
                if (list.length === 0) {
                    var results = server_folfer(pathserver_p);
                    results.then(data => {
                        res.set('Content-Type', 'application/json');
                        res.send(JSON.stringify({ 'path_server': data, 'files': [] }));
                    });
                } else {
                    var actions = list.map(function (obj) {
                        return filesasync(obj);
                    });
                    var results = Promise.all(actions);
                    results.then(data => {
                        console.log(data);
                        var files_ = [];
                        fs.readdirSync(pathfs).forEach(file => { //console.log('file : ' + file);
                            var stats = fs.statSync(pathfs + '/' + file);
                            var fileSizeInBytes = stats["size"];
                            const buffer = readChunk.sync(pathfs + '/' + file, 0, fileType.minimumBytes);
                            var mimest = fileType(buffer), objtype = mimest.mime.split("/");
                            if (objtype[0] == 'image') {
                                files_.push({
                                    'id': file, 'name': file, 'size': fileSizeInBytes, 'link': path_prev + '/' + file, 'status': "uploaded",
                                    'preview': path_prev + '/' + file, 'type': mimest.mime
                                });
                            } else {
                                files_.push({
                                    'id': file, 'name': file, 'size': fileSizeInBytes, 'link': path_prev + '/' + file, 'status': "uploaded",
                                    'type': mimest.mime
                                });
                            }
                        });
                        res.set('Content-Type', 'application/json');
                        res.send(JSON.stringify({ 'path_server': 'createdold', 'files': files_ }));
                    });
                }
                c.end();
            });
        });
        c.connect(config);
    },
    list_moneda: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "SELECT CO_MONEDA  as value, DE_NOMBRE AS label    from MA_MONE_M    ";
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, '1'));
            });
        });
    },
    list_operador: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "SELECT CO_TIPO_COMUNICACION  as value, DE_NOMBRE AS label    from MA_TIPO_COMU_M    ";
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, '1'));
            });
        });
    },
    cargafzvta: (req, res) => {
        const { co_direccion, emp, zncomer } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "SELECT * FROM TABLE(PACK_NEW_MAESTROS.F_LISTAR_CATA_ENTI_FV_X_ZC_D(:x_co_direccion,:x_empresa,:x_zona_comercial))  ";
            const params = { x_co_direccion: co_direccion, x_empresa: emp, x_zona_comercial: zncomer };
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ state: 'error', 'message': error.stack });
                    return;
                }
                res.set('Content-Type', 'application/json');
                res.send(result.rows);
                conn.close();
            });
        });
    },
    savelinea: (req, res) => {
        const { ucliente, u_autoriza, emp, fv, cmone, stper, obs, mont } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error_conec', message: err.stack });
                return;
            }

            const params = {
                ucliente: parseInt(ucliente), u_autoriza: parseInt(u_autoriza), emp: parseInt(emp), fv: fv, cmone: cmone, stper: stper, obs: obs, mont: parseFloat(mont),
                o_codresult: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }, o_deresultado: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            };
            var query = 'call PW_MA010102.ASIGNA_LINEA_CREDITO(:ucliente,:u_autoriza,:emp,:fv,:cmone,:stper,:obs,:mont,:o_codresult, :o_deresultado)';
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ state: 'error_query', message: error.stack });
                    return;
                } else {
                    const { o_codresult, o_deresultado } = result.outBinds;
                    diaActual = new Date();
                    res.json({
                        state: 'success', codigo: o_codresult, message: o_deresultado, fecha: diaActual.getDate() + '/' + (parseInt(diaActual.getMonth()) + parseInt(1)) + '/' + diaActual.getFullYear()
                    });
                }
            });
        });
    },
    grid_linea: (req, res) => {
        const { emp, cliente } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "Select cl.co_moneda,cl.co_fuerza_venta,cl.IM_LINEA_CREDITO_FINAL,mone.DE_NOMBRE,cl.ES_VIGENCIA,to_char(cl.FE_APROBACION_CREDITO,'dd/mm/yyyy HH24:MI:SS'),cl.ST_PERMANENTE,cl.DE_OBSERVACION_AUTORIZA  from ba_line_cred_m cl  left join MA_MONE_M mone on mone.CO_MONEDA = cl.CO_MONEDA where CL.CO_EMPRESA=:emp AND CL.CO_CLIENTE = :cliente ";
            const params = { emp: emp, cliente: cliente };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderXml(result.rows));
            });
        });
    },
    combo_gridfz_nom: (req, res) => {
        const { empre } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "    SELECT VT_ZONA_COME_C.CO_ZONA_COMERCIAL, VT_ZONA_COME_C.DE_NOMBRE ,VT_ZONA_COME_C.ES_VIGENCIA FROM VT_ZONA_COME_C where VT_ZONA_COME_C.CO_EMPRESA =:xemp   ORDER BY VT_ZONA_COME_C.DE_NOMBRE ASC   ";
            const params = { xemp: empre };
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderComboAll(result.rows));
            });
        });
    },
    via: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "   SELECT MA_VIAS_M.CO_VIA AS value,            MA_VIAS_M.DE_NOMBRE  || '('|| MA_VIAS_M.DE_ABREVIATURA||')' AS label      FROM MA_VIAS_M     ";
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, '1'));
            });
        });
    },
    zncomercial: (req, res) => {
        const { emp } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "SELECT VT_ZONA_COME_C.CO_ZONA_COMERCIAL AS value,VT_ZONA_COME_C.DE_NOMBRE AS label  ,VT_ZONA_COME_C.ES_VIGENCIA FROM VT_ZONA_COME_C WHERE VT_ZONA_COME_C.CO_EMPRESA =:x_empresa             ORDER BY VT_ZONA_COME_C.DE_NOMBRE ASC ";
            const params = { x_empresa: emp };
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ state: 'error', 'message': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, '1'));
                conn.close();
            });
        });
    },
    fzvta: (req, res) => {
        const { emp } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = " SELECT VT_FUER_VENT_M.CO_FUERZA_VENTA  AS value,    VT_FUER_VENT_M.DE_NOMBRE AS label  , VT_FUER_VENT_M.ES_FUERZA    FROM VT_FUER_VENT_M WHERE  VT_FUER_VENT_M.CO_EMPRESA = :xemp  ORDER BY VT_FUER_VENT_M.DE_NOMBRE   ";
            const params = { xemp: emp };
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, '1'));
                conn.close();
            });
        });
    },
    dvisita: (req, res) => {
        res.set('Content-Type', 'text/xml');
        rows = [{ VALUE: 'Lunes 1', LABEL: 'Lunes 1' }, { VALUE: 'Martes 2', LABEL: 'Martes 2' }, { VALUE: 'Miercoles 3', LABEL: 'Miercoles 3' },
        { VALUE: 'Jueves 4', LABEL: 'Jueves 4' }, { VALUE: 'Viernes 5', LABEL: 'Viernes 5' }, { VALUE: 'Sabado 6', LABEL: 'Sabado 6' }, { VALUE: 'Domingo 1', LABEL: 'Domingo 1' }, { VALUE: 'Lunes 7', LABEL: 'Lunes 7' },
        { VALUE: 'Martes 8', LABEL: 'Martes 8' }, { VALUE: 'Miercoles 9', LABEL: 'Miercoles 9' }, { VALUE: 'Jueves 10', LABEL: 'Jueves 10' }, { VALUE: 'Viernes 11', LABEL: 'Viernes 11' }, { VALUE: 'Sabado 12', LABEL: 'Sabado 12' }, { VALUE: 'Domingo 2', LABEL: 'Domingo 2' }];
        res.send(xmlParser.renderSelect(rows, '1'));
    },
    dcobranza: (req, res) => {
        res.set('Content-Type', 'text/xml');
        rows = [{ VALUE: 'Lunes 1', LABEL: 'Lunes 1' }, { VALUE: 'Martes 2', LABEL: 'Martes 2' }, { VALUE: 'Miercoles 3', LABEL: 'Miercoles 3' },
        { VALUE: 'Jueves 4', LABEL: 'Jueves 4' }, { VALUE: 'Viernes 5', LABEL: 'Viernes 5' }, { VALUE: 'Sabado 6', LABEL: 'Sabado 6' }, { VALUE: 'Domingo 1', LABEL: 'Domingo 1' }, { VALUE: 'Lunes 7', LABEL: 'Lunes 7' },
        { VALUE: 'Martes 8', LABEL: 'Martes 8' }, { VALUE: 'Miercoles 9', LABEL: 'Miercoles 9' }, { VALUE: 'Jueves 10', LABEL: 'Jueves 10' }, { VALUE: 'Viernes 11', LABEL: 'Viernes 11' }, { VALUE: 'Sabado 12', LABEL: 'Sabado 12' }, { VALUE: 'Domingo 2', LABEL: 'Domingo 2' }];
        res.send(xmlParser.renderSelect(rows, '1'));
    },
    modogaran: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "    SELECT DE_NOMBRE  AS label,  CO_MODO_GARANTIA AS value      FROM MA_MODO_GTIA_M     ";
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, '1'));
            });
        });
    },
    zona: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "    SELECT MA_ZONA_M.DE_NOMBRE || '('|| MA_ZONA_M.DE_ABREVIATURA ||')' AS label,             MA_ZONA_M.CO_ZONA AS value      FROM MA_ZONA_M     ";
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, '1'));
            });
        });
    },
    list_lincredito: (req, res) => {
        const { emp } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "  SELECT VT_FUER_VENT_M.CO_FUERZA_VENTA as value,             VT_FUER_VENT_M.DE_NOMBRE AS label     FROM VT_FUER_VENT_M     WHERE ( VT_FUER_VENT_M.CO_EMPRESA =:empresa ) and           ( ( VT_FUER_VENT_M.ES_FUERZA = 'Vigente' ) )   ";
            const params = { empresa: emp };
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, '1'));
            });
        });
    },
    cargardirecc: (req, res) => {
        const { xcodigo } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', message: err.stack });
                return;
            }
            const query = ' SELECT * FROM TABLE(PACK_NEW_MAESTROS.F_LISTAR_CATA_ENTI_DIRE_GRID(:xcodigo)) ';
            const params = { xcodigo: xcodigo };
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ state: 'error', 'message': error.stack });
                    return;
                }
                res.set('Content-Type', 'application/json');
                res.send(result.rows.length > 0 ? result.rows : [{
                    DE_PAIS: '', DE_DIRECCION: 'No se encontraron datos', NU_LOCAL_PRINCIPAL: ' ',
                    DE_REFERENCIAS: ' ', FE_SYS: ' ', ES_REGISTRO: ' ', DE_ALTITUD: ' ', DE_LATITUD: ' ', CO_DIRECCION_ENTIDAD: -1, ST_MARCAR: ' ', ST_ERASED: ''
                }]);
                //res.send(result.rows);


                conn.close();
            });
        });
    },
    datosdirecc: (req, res) => {
        const { xdirecc } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', message: err.stack });
                return;
            }
            const query = ' SELECT * FROM TABLE(PACK_NEW_MAESTROS.F_LISTAR_CATA_ENTI_DIRE_FORM(:xdirecc)) ';
            const params = { xdirecc: xdirecc };
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ state: 'error', 'message': error.stack });
                    return;
                }
                res.set('Content-Type', 'application/json');
                res.send(result.rows); //console.log(req);
                conn.close();
            });
        });
    },
    data_fz_cc: (req, res) => {
        const { co_direccion, emp } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', message: err.stack });
                return;
            }
            const query = ' SELECT * FROM TABLE(PACK_NEW_MAESTROS.F_LISTAR_DIRE_ZC_FV_VIEW_GRID(:xco_direccion,:x_empresa))';
            const params = { x_empresa: emp, xco_direccion: co_direccion };
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ state: 'error', 'message': error.stack });
                    return;
                }
                res.set('Content-Type', 'application/json');
                res.send(result.rows);
                conn.close();
            });
        });
    },
    list_datos_cliente: (req, res) => {
        const { emp, codigo, tipo } = req.body;
        var query, params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', message: err.stack });
                return;
            }
            switch (tipo) {
                case '1':
                    query = ' SELECT * FROM TABLE(PACK_NEW_MAESTROS.F_LISTAR_PROVEEDOR(:x_empresa,:x_cod)) ';
                    params = { x_empresa: parseInt(emp), x_cod: parseInt(codigo) };
                    break;
                default:
                    query = ' SELECT * FROM TABLE(PACK_NEW_MAESTROS.F_LISTAR_CLIENTE_WEB(:x_empresa,:x_cod)) ';
                    params = { x_empresa: parseInt(emp), x_cod: parseInt(codigo) };
                    break;
            }            //console.log(emp, codigo, tipo);
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ state: 'error', 'message': error.stack, 'query': query });
                    return;
                }
                res.set('Content-Type', 'application/json');
                res.send(result.rows);
                conn.close();
            });
        });
    },
    gridfz_fvta_d: (req, res) => {
        const { coddirecc, empresa, cozona } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = 'SELECT * FROM TABLE(PACK_NEW_MAESTROS.F_FV_X_ZC_D_W(:xcoddirecc,:xemp,:xcozona)) ';
            const params = { xcoddirecc: coddirecc, xemp: empresa, xcozona: cozona };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderXml(result.rows));
            });
        });
    },
    gridfz: (req, res) => {
        const { coddirecc, empresa } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = '  SELECT * FROM TABLE(PACK_NEW_MAESTROS.F_ZC_WEB(:xcoddirecc,:xemp)) ';
            const params = { xcoddirecc: coddirecc, xemp: empresa };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderXml(result.rows));
            });
        });
    },
    data_comu: (req, res) => {
        const { cocliente, empr } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = '  SELECT * FROM TABLE(PACK_NEW_MAESTROS.F_L_COMUNI_WEB(:xcliente,:xemp)) ';
            const params = { xcliente: cocliente, xemp: empr };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderXml(result.rows));
            });
        });
    },
    data_antec: (req, res) => {
        const { cocliente, empr } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = '  SELECT * FROM TABLE(PACK_NEW_MAESTROS.F_L_ANTEC_WEB(:xcliente,:xemp)) ';
            const params = { xcliente: cocliente, xemp: empr };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderXml(result.rows));
            });
        });
    },
    giro_nego: (req, res) => {
        const { cocliente } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = '  SELECT * FROM TABLE(PACK_NEW_MAESTROS.F_L_LIST_GIRO_NEG_W_WEB(:xcliente)) ';
            const params = { xcliente: cocliente };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderXml(result.rows));
            });
        });
    },
    garante: (req, res) => {
        const { cocliente } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = '  SELECT * FROM TABLE(PACK_NEW_MAESTROS.F_L_GARANTE_WEB(:xcliente)) ';
            const params = { xcliente: cocliente };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                if (result.rows.length > 0) {
                    res.set('Content-Type', 'text/xml');
                    res.send(xmlParser.renderXml(result.rows));
                }
            });
        });
    },
    contactos: (req, res) => {
        const { cocliente } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = 'SELECT * FROM TABLE(PACK_NEW_MAESTROS.F_L_CONTACTO_WEB(:xcliente)) ';
            const params = { xcliente: cocliente };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                if (result.rows.length > 0) {
                    res.set('Content-Type', 'text/xml');
                    res.send(xmlParser.renderXml(result.rows));
                }
            });
        });
    },
    cuentas: (req, res) => {
        const { cocliente } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = 'SELECT * FROM TABLE(PACK_NEW_MAESTROS.F_L_CUENTAS_WEB(:xcliente)) ';
            const params = { xcliente: cocliente };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                if (result.rows.length > 0) {
                    res.set('Content-Type', 'text/xml');
                    res.send(xmlParser.renderXml(result.rows));
                }
            });
        });
    },
    gridcliente: (req, res) => {
        const { emp, tipo, busqueda } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = '   SELECT * FROM TABLE(PACK_NEW_MAESTROS.F_LISTAR_DATA_ENTI2(:xEmpresa,:xTipoEntidad,:xEstado,:xNom)) ';
            const params = { xEmpresa: emp, xTipoEntidad: tipo, xNom: '%' + busqueda.toUpperCase() + '%', xEstado: '%' };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_CATALOGO_ENTIDAD: '', DE_RAZON_SOCIAL: 'No se encontraron coincidencias', ES_VIGENCIA: '', DE_NOMBRE_COMERCIAL: 'No se encontraron coincidencias', SITUACION_ENTIDAD: '', NOM_VISTA: 'No se encontraron coincidencias' }]));
            });
        });
    },
    tipocta: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "  SELECT CO_TIPO_CUENTA AS value,  DE_NOMBRE AS label  FROM MA_TIPO_CUEN_M   ";
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, '1'));
            });
        });
    },
    rubro: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "  SELECT MA_RUBR_M.CO_RUBRO AS value,  MA_RUBR_M.DE_NOMBRE AS label  FROM MA_RUBR_M   ";
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, '1'));
            });
        });
    },
    list_tipopers: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "  SELECT MA_TIPO_PERS_M.CO_TIPO_PERSONA AS value,            MA_TIPO_PERS_M.DE_NOMBRE AS label,            MA_TIPO_PERS_M.DE_CLASE     FROM MA_TIPO_PERS_M   ";
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, '1'));
            });
        });
    },
    list_estadocleinte: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = " SELECT MA_ESTA_M.DE_NOMBRE  as LABEL,   MA_ESTA_M.DE_NOMBRE AS VALUE   FROM MA_ESTA_M     WHERE MA_ESTA_M.DE_TIPO_ESTADO = 'Clientes'    ";
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, 'Vigente'));
            });
        });
    },
    cargo_repre: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = " SELECT DE_NOMBRE   as LABEL,CO_CARGO_REPRESENTANTE  AS VALUE   FROM MA_CARG_REPR_M ";
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, '1'));
            });
        });
    },
    list_tiponego: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "      SELECT VT_TIPO_NEGO_M.CO_TIPO_NEGOCIO as VALUE,            VT_TIPO_NEGO_M.DE_NOMBRE AS LABEL,            VT_TIPO_NEGO_M.ES_TIPO_NEGOCIO,            VT_TIPO_NEGO_M.DE_DESCRIPCION,            VT_TIPO_NEGO_M.FE_REGISTRO      FROM VT_TIPO_NEGO_M  ORDER BY VT_TIPO_NEGO_M.DE_NOMBRE ASC         ";
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, '1'));
            });
        });
    },
    list_condpago: (req, res) => {
        const { co_formp } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = co_formp != 0 ?  "SELECT MA_COND_PAGO_M.CO_CONDICION_PAGO AS VALUE ,MA_COND_PAGO_M.DE_NOMBRE AS LABEL,MA_COND_PAGO_M.NU_DIAS_FIJOS FROM MA_COND_PAGO_M WHERE CO_FORMA_PAGO ="+co_formp :
            "SELECT MA_COND_PAGO_M.CO_CONDICION_PAGO AS VALUE ,MA_COND_PAGO_M.DE_NOMBRE AS LABEL,MA_COND_PAGO_M.NU_DIAS_FIJOS FROM MA_COND_PAGO_M";
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, '1'));
            });
        });
    },
    list_formpago: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "SELECT MA_FORM_PAGO_M.CO_FORMA_PAGO AS VALUE, MA_FORM_PAGO_M.DE_NOMBRE  AS LABEL FROM MA_FORM_PAGO_M";
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, '1'));
            });
        });
    },
    list_banco: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "    SELECT BA_BANC_M.CO_BANCO as VALUE,            BA_BANC_M.DE_NOMBRE AS LABEL,            BA_BANC_M.DE_ABREVIATURA      FROM BA_BANC_M     WHERE BA_BANC_M.ES_VIGENCIA = 'Vigente'         ";
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, '1'));
            });
        });
    },
    list_tipocliente: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = "    SELECT MA_TIPO_CLIE_M.CO_TIPO_CLIENTE as VALUE,            MA_TIPO_CLIE_M.DE_NOMBRE AS LABEL,            MA_TIPO_CLIE_M.DE_OBSERVACIONES      FROM MA_TIPO_CLIE_M      ";
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, '1'));
            });
        });
    },
    list_procedencia: (req, res) => {
        res.set('Content-Type', 'text/xml');
        rs = [{ VALUE: 'Interno', LABEL: 'Interno' }, { VALUE: 'Externo', LABEL: 'Externo' }];
        return res.send(xmlParser.renderSelect(rs, '1'));
    },
    list_origen: (req, res) => {
        res.set('Content-Type', 'text/xml');
        rs = [{ VALUE: 'Nacional', LABEL: 'Nacional' }, { VALUE: 'Extranjero', LABEL: 'Extranjero' }];
        return res.send(xmlParser.renderSelect(rs, '1'));
    },
    list_tiprove: (req, res) => {
        res.set('Content-Type', 'text/xml');
        rs = [{ VALUE: 'Normal', LABEL: 'Normal' }, { VALUE: 'Financiero', LABEL: 'Financiero' }];
        return res.send(xmlParser.renderSelect(rs, '1'));
    },

    update_fv: (req, res) => {
        const { x_empresa, x_usuario, x_co_direccion_entidad, x_zona_comercial, x_cadena_zona_fv, x_cant_filas } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error_conec', message: err.stack });
                return;
            }
            const params = {
                x_empresa: parseInt(x_empresa), x_usuario: parseInt(x_usuario), x_co_direccion_entidad: x_co_direccion_entidad,
                x_zona_comercial: parseInt(x_zona_comercial), x_cadena_zona_fv: x_cadena_zona_fv,
                x_cant_filas: parseInt(x_cant_filas), x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                x_de_result: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            };
            var query = 'call PACK_NEW_MAESTROS.sp_cata_enti_dire_zc_fv_grabar( :x_empresa,:x_usuario,:x_co_direccion_entidad,:x_zona_comercial,:x_cadena_zona_fv,:x_cant_filas, :x_result,:x_de_result)';
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ state: 'error_query', message: error.stack });
                    return;
                } else {
                    const { x_result, x_de_result } = result.outBinds;
                    diaActual = new Date();
                    res.json({ state: 'success', codigo: x_result, message: x_de_result, fe_upd: moment().format() });
                }
            });
        });
    },
    grabacontacto: (req, res) => {
        const { xoption, x_co_catalogo, x_cargo_repre, x_co_repre, x_apellidos, x_nombres, x_mail, x_telefono, x_estado } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error_conec', message: err.stack });
                return;
            }
            const params = {
                xoption: xoption, x_cargo_repre: parseInt(x_cargo_repre), x_co_repre: x_co_repre, x_co_catalogo: parseInt(x_co_catalogo), x_apellidos: x_apellidos,
                x_nombres: x_nombres, x_mail: x_mail, x_telefono: x_telefono, x_estado: x_estado,
                x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }, x_de_result: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            };
            var query = 'CALL PACK_NEW_MAESTROS.SP_SAVE_CONTACTO_WEB(:xoption,:x_cargo_repre,:x_co_catalogo,:x_co_repre,:x_apellidos,:x_nombres,:x_mail,:x_telefono,:x_estado,:x_result,:x_de_result)';
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ state: 'error_query', message: error.stack });
                    return;
                } else {
                    const { x_result, x_de_result } = result.outBinds;
                    diaActual = new Date();
                    res.json({ state: 'success', codigo: x_result, message: x_de_result, fe_reg: moment().format('DD-MM-YYYY HH:mm:ss') });
                }
            });
        });
    },
    grabagarantes: (req, res) => {
        const { xoption, x_cogarante, x_co_catalogo, x_apellidos, x_nombres, x_direccion, x_nudocumento, x_telefono, x_aval_perma, x_vigencia,
            x_tipodoc, x_capacidad, x_co_modogara } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error_conec', message: err.stack });
                return;
            }
            const params = {
                xoption: xoption, x_cogarante: parseInt(x_cogarante), x_co_catalogo: parseInt(x_co_catalogo), x_apellidos: x_apellidos, x_nombres: x_nombres, x_direccion: x_direccion,
                x_nudocumento: x_nudocumento, x_telefono: x_telefono, x_aval_perma: x_aval_perma, x_vigencia: x_vigencia, x_tipodoc: x_tipodoc, x_capacidad: parseInt(x_capacidad),
                x_co_modogara: x_co_modogara, x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }, x_de_result: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            };
            var query = 'CALL PACK_NEW_MAESTROS.SP_SAVE_GARANTE_WEB(:xoption,:x_cogarante, :x_co_catalogo, :x_apellidos, :x_nombres, :x_direccion, :x_nudocumento, :x_telefono, :x_aval_perma, :x_vigencia,:x_tipodoc, :x_capacidad, :x_co_modogara,:x_result,:x_de_result)';
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ state: 'error_query', message: error.stack });
                    return;
                } else {
                    const { x_result, x_de_result } = result.outBinds;
                    diaActual = new Date();
                    res.json({ state: 'success', cogarante: x_result, message: x_de_result, fe_reg: moment().format('DD-MM-YYYY HH:mm:ss') });
                }
            });
        });
    },
    grabacuentas: (req, res) => {
        const { xoption, x_co_catalogo, x_tipo_cta, x_numcta, x_estado, x_cobanco, x_copais, idseq } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error_conec', message: err.stack });
                return;
            }
            const params = {
                xoption: xoption, x_co_catalogo: parseInt(x_co_catalogo), x_tipo_cta: parseInt(x_tipo_cta), x_numcta: parseInt(x_numcta), x_estado: x_estado, x_cobanco: x_cobanco,
                x_copais: parseInt(x_copais),
                idseq: parseInt(idseq), x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }, x_de_result: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            };
            var query = 'CALL PACK_NEW_MAESTROS.SP_SAVE_CUENTAS_WEB(:xoption,:x_co_catalogo,:x_tipo_cta,:x_numcta,:x_estado,:x_cobanco,:x_copais,:idseq,:x_result,:x_de_result)';
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ state: 'error_query', message: error.stack });
                    return;
                } else {
                    const { x_result, x_de_result } = result.outBinds;
                    diaActual = new Date();
                    res.json({ state: 'success', codigo: x_result, message: x_de_result, fe_reg: moment().format('DD-MM-YYYY HH:mm:ss') });
                }
            });
        });
    },
    grabacomu: (req, res) => {
        const { xoption, x_cliente, xemp, xoperador, xnumero, xvigente, xdif } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error_conec', message: err.stack });
                return;
            }
            const params = {
                xoption: xoption, x_cliente: parseInt(x_cliente), xemp: parseInt(xemp),
                xoperador: parseInt(xoperador),
                xnumero: parseInt(xnumero), xvigente: xvigente,
                xdif: xdif == undefined ? 0 : parseInt(xdif),
                x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }, x_de_result: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            };
            var query = 'CALL PACK_NEW_MAESTROS.SP_SAVE_COMUNI_WEB(:xoption,:x_cliente,:xemp,:xoperador,:xnumero,:xvigente,:xdif,:x_result,:x_de_result)';
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ state: 'error_query', message: error.stack });
                    return;
                } else {
                    const { x_result, x_de_result } = result.outBinds;
                    diaActual = new Date();
                    res.json({ state: 'success', codigo: x_result, message: x_de_result, fecha: moment().format('DD-MM-YYYY HH:mm:ss') });
                }
            });
        });
    },
    grabantece: (req, res) => {
        const { xoption, x_cliente, xemp, xusureg, xant_detalle, xant_satisfa, xant_referencia, xgarante } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error_conec', message: err.stack });
                return;
            }
            const params = {
                xoption: xoption, x_cliente: parseInt(x_cliente), xemp: parseInt(xemp), xusureg: parseInt(xusureg),
                xant_detalle: xant_detalle, xant_satisfa: xant_satisfa.length == 0 ? null : parseInt(xant_satisfa),
                xant_referencia: xant_referencia.length == 0 ? null : parseInt(xant_referencia), cogarante: xgarante == undefined ? 0 : parseInt(xgarante),
                x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }, x_de_result: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            };
            var query = 'CALL PACK_NEW_MAESTROS.SP_SAVE_ANTECE_WEB(:xoption,:x_cliente,:xemp,:xusureg,:xant_detalle,:xant_satisfa,:xant_referencia,:cogarante,:x_result,:x_de_result)';
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ state: 'error_query', message: error.stack });
                    return;
                } else {
                    const { x_result, x_de_result } = result.outBinds;
                    diaActual = new Date();
                    res.json({ state: 'success', codigo: x_result, message: x_de_result, fecha: moment().format('DD-MM-YYYY HH:mm:ss') });
                }
            });
        });
    },
    grabagironego: (req, res) => {
        const { xoption, x_co_catalogo_entidad, xcorubro, xdetalle, xvigencia } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error_conec', message: err.stack });
                return;
            }
            const params = {
                xoption: xoption, x_co_catalogo_entidad: parseInt(x_co_catalogo_entidad), xcorubro: parseInt(xcorubro), xdetalle: xdetalle, xvigencia: xvigencia,
                x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }, x_de_result: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            };
            var query = 'CALL PACK_NEW_MAESTROS.SP_SAVE_RUBRO_WEB ( :xoption,:x_co_catalogo_entidad,:xcorubro,:xdetalle,:xvigencia,:x_result,:x_de_result)';
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ state: 'error_query', message: error.stack });
                    return;
                } else {
                    const { x_result, x_de_result } = result.outBinds;
                    diaActual = new Date();
                    res.json({ state: 'success', codigo: x_result, message: x_de_result, fe_reg: moment().format('DD-MM-YYYY HH:mm:ss') });
                }
            });
        });
    },
    updatezon_comer: (req, res) => {
        const { x_empresa, x_usuario, x_co_direccion_entidad, x_cadena_zona, x_cant_filas } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error_conec', message: err.stack });
                return;
            }
            const params = {
                x_empresa: parseInt(x_empresa), x_usuario: parseInt(x_usuario), x_co_direccion_entidad: x_co_direccion_entidad,
                x_cadena_zona: x_cadena_zona, x_cant_filas: parseInt(x_cant_filas), x_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                x_de_result: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            };
            var query = 'call PACK_NEW_MAESTROS.sp_cata_enti_dire_zc_grabar ( :x_empresa,:x_usuario,:x_co_direccion_entidad,:x_cadena_zona,:x_cant_filas, :x_result,:x_de_result)';
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ state: 'error_query', message: error.stack });
                    return;
                } else {
                    const { x_result, x_de_result } = result.outBinds;
                    diaActual = new Date();
                    res.json({ state: 'success', codigo: x_result, message: x_de_result });
                }
            });
        });
    },
    saveproveed: (req, res) => {
        const { st_permiso_editar_cata_enti, x_empresa, x_alias,xco_catalogo_entidad, x_nu_documento, x_de_razon_social, x_co_tipo_persona, x_co_tipo_doc_ide, x_de_procedencia,
            x_de_nombre_comercial, x_de_origen, x_st_asignaprovee, x_co_tipo_prov, x_estad_prov, x_form_pago, x_cond_pago, st_permanente, x_email,
            st_agent_reten, st_agent_percep, st_agent_detrac } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error_conec', message: err.stack });
                return;
            }
            const params = {
                st_permiso_editar_cata_enti: st_permiso_editar_cata_enti, x_empresa: parseInt(x_empresa), x_alias: x_alias, xco_catalogo_entidad : parseInt(xco_catalogo_entidad),
                x_nu_documento: x_nu_documento, x_de_razon_social: x_de_razon_social, x_co_tipo_persona: x_co_tipo_persona,
                x_co_tipo_doc_ide: x_co_tipo_doc_ide, x_de_procedencia: x_de_procedencia, x_de_nombre_comercial: x_de_nombre_comercial, x_de_origen: x_de_origen,
                x_st_asignaprovee: x_st_asignaprovee, x_co_tipo_prov: x_co_tipo_prov, x_estad_prov: x_estad_prov, x_form_pago: x_form_pago,
                x_cond_pago: x_cond_pago, st_permanente: st_permanente, x_email: x_email,st_agent_reten: st_agent_reten, st_agent_percep: st_agent_percep, st_agent_detrac: st_agent_detrac,
                o_xresultado: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }, o_deresultado: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            };
            console.log(params);
            var query = 'call PACK_NEW_MAESTROS.sp_prov_grabar(:st_permiso_editar_cata_enti, :x_empresa, :x_alias,:xco_catalogo_entidad, :x_nu_documento, :x_de_razon_social, :x_co_tipo_persona, :x_co_tipo_doc_ide, :x_de_procedencia,:x_de_nombre_comercial, :x_de_origen, :x_st_asignaprovee, :x_co_tipo_prov, :x_estad_prov, :x_form_pago, :x_cond_pago, :st_permanente, :x_email,:st_agent_reten, :st_agent_percep, :st_agent_detrac,:o_xresultado,:o_deresultado)';
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ state: 'error_query', message: error.stack });
                    return;
                } else {
                    const { o_xresultado, o_deresultado } = result.outBinds;
                    //diaActual = new Date();
                    objtype = o_deresultado.split("@");
                    res.json({ state: 'success', codigo: o_xresultado, message: objtype[0], nombre: x_nu_documento + ' ' + x_de_razon_social, estado: x_estad_prov, asignado: 'Asignado', 
                    fechaprov: objtype[1], fechacata :objtype[2],feretiro : objtype[3]}); //diaActual.getDate() + '/' + (parseInt(diaActual.getMonth()) + parseInt(1)) + '/' + diaActual.getFullYear() });
                }
            });
        });
    },
    savecliente: (req, res) => {
        const { st_permiso_editar_cata_enti, x_empresa, x_alias, x_co_catalogo_entidad, x_de_razon_social, x_nu_documento, x_co_tipo_persona,
            x_co_tipo_doc_ide, x_de_procedencia, x_de_ape_paterno, x_de_ape_materno, x_de_nombre, x_de_nombre_comercial, x_de_origen,
            x_co_cliente, x_co_tipo_cliente, x_st_recaudo, x_co_banco, x_co_tipo_negocio, x_co_listado_precios, x_co_serie_listado,
            x_st_agente_retenedor, x_st_agente_percepcion, x_st_cliente_nvo, x_co_periodo_clien_nvo, x_st_cliente_corporativo,
            x_co_cliente_corporativo, x_im_credito_total, x_im_deuda_total, x_de_email, x_de_webpage, x_es_vigencia_cliente, x_fe_retiro_cliente,
            x_St_Excep_Cred } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error_conec', message: err.stack });
                return;
            }

            const params = {
                st_permiso_editar_cata_enti: st_permiso_editar_cata_enti, x_empresa: parseInt(x_empresa), x_alias: x_alias, x_co_catalogo_entidad:  parseInt(x_co_catalogo_entidad), x_de_razon_social: x_de_razon_social, x_nu_documento: x_nu_documento, x_co_tipo_persona: x_co_tipo_persona,
                x_co_tipo_doc_ide: x_co_tipo_doc_ide, x_de_procedencia: x_de_procedencia, x_de_ape_paterno: x_de_ape_paterno, x_de_ape_materno: x_de_ape_materno, x_de_nombre: x_de_nombre, x_de_nombre_comercial: x_de_nombre_comercial, x_de_origen: x_de_origen,
                x_co_cliente:   parseInt(x_co_cliente), x_co_tipo_cliente:  parseInt(x_co_tipo_cliente), x_st_recaudo: x_st_recaudo, x_co_banco: x_co_banco, x_co_tipo_negocio: x_co_tipo_negocio, x_co_listado_precios:  parseInt(x_co_listado_precios) == 0 ? null :  parseInt(x_co_listado_precios), x_co_serie_listado:   parseInt(x_co_serie_listado) == 0 ? null :  parseInt(x_co_serie_listado),
                x_st_agente_retenedor: x_st_agente_retenedor, x_st_agente_percepcion: x_st_agente_percepcion, x_st_cliente_nvo: x_st_cliente_nvo, x_co_periodo_clien_nvo:   parseInt(x_co_periodo_clien_nvo), x_st_cliente_corporativo: x_st_cliente_corporativo,
                x_co_cliente_corporativo:   parseInt(x_co_cliente_corporativo), x_im_credito_total: parseFloat(x_im_credito_total), x_im_deuda_total: parseFloat(x_im_deuda_total), x_de_email: x_de_email, x_de_webpage: x_de_webpage, x_es_vigencia_cliente: x_es_vigencia_cliente, x_fe_retiro_cliente: x_fe_retiro_cliente.length === 0 ? null : x_fe_retiro_cliente,
                x_St_Excep_Cred: x_St_Excep_Cred, o_xresultado: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }, o_deresultado: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            };
            console.log(params);
            var query = 'call PACK_NEW_MAESTROS.sp_cata_enti_cliente_grabar(:st_permiso_editar_cata_enti,:x_empresa,:x_alias,:x_co_catalogo_entidad,:x_de_razon_social,:x_nu_documento,:x_co_tipo_persona,:x_co_tipo_doc_ide,:x_de_procedencia,:x_de_ape_paterno,:x_de_ape_materno,:x_de_nombre,:x_de_nombre_comercial,:x_de_origen,:x_co_cliente,:x_co_tipo_cliente,:x_st_recaudo,:x_co_banco,:x_co_tipo_negocio,:x_co_listado_precios,:x_co_serie_listado,:x_st_agente_retenedor,:x_st_agente_percepcion,:x_st_cliente_nvo,:x_co_periodo_clien_nvo,:x_st_cliente_corporativo,:x_co_cliente_corporativo,:x_im_credito_total,:x_im_deuda_total,:x_de_email,:x_de_webpage,:x_es_vigencia_cliente,:x_fe_retiro_cliente,:x_St_Excep_Cred,:o_xresultado,:o_deresultado)';


            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ state: 'error_query', message: error.stack });
                    return;
                } else {
                    const { o_xresultado, o_deresultado } = result.outBinds;
                    objtype = o_deresultado.split("@");
                    ///    diaActual = new Date();
                    res.json({ state: 'success', codigo: o_xresultado, message:  objtype[0], nombre: x_co_catalogo_entidad + ' ' + x_de_razon_social, estado: x_es_vigencia_cliente, asignado: 'Asignado', fechacata:  objtype[1] ,fechacli:  objtype[2],fechareti:  objtype[3] });
                }
            });
        });
    },
    grabadirec: (req, res) => {
        const { x_alias,
            x_co_usuario, x_co_direccion_entidad, x_co_catalogo_entidad,
            x_co_ubigeo, x_co_via, x_co_zona, x_de_nombre_zona, x_de_nombre_via, x_nu_numero, x_de_interior, x_de_referencias, x_nu_local_principal,
            x_de_codigo_postal, x_es_registro, x_de_altitud, x_de_latitud, x_de_zoom, x_de_hora_ini_atencion,
            x_de_hora_fin_atencion, x_st_erased, x_cadena, x_cant_filas } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error_conec', message: err.stack });
                return;
            }

            const params = {
                x_alias: x_alias,
                x_co_usuario: parseInt(x_co_usuario), x_co_direccion_entidad: x_co_direccion_entidad,
                x_co_catalogo_entidad: parseInt(x_co_catalogo_entidad), x_co_ubigeo: x_co_ubigeo, x_co_via: parseInt(x_co_via), x_co_zona: parseInt(x_co_zona),
                x_de_nombre_zona: x_de_nombre_zona, x_de_nombre_via: x_de_nombre_via, x_nu_numero: parseInt(x_nu_numero), x_de_interior: x_de_interior,
                x_de_referencias: x_de_referencias, x_nu_local_principal: parseInt(x_nu_local_principal), x_de_codigo_postal: x_de_codigo_postal, x_es_registro: x_es_registro, x_de_altitud: x_de_altitud,
                x_de_latitud: x_de_latitud, x_de_zoom: x_de_zoom, x_de_hora_ini_atencion: new Date(1970, 1, 1, (x_de_hora_ini_atencion).split(':')[0] - 5, (x_de_hora_ini_atencion).split(':')[1], 0),
                x_de_hora_fin_atencion: new Date(1970, 1, 1, (x_de_hora_fin_atencion).split(':')[0] - 5, (x_de_hora_fin_atencion).split(':')[1], 0), x_st_erased: x_st_erased, x_cadena: x_cadena, x_cant_filas: parseInt(x_cant_filas), o_xresultado: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }, o_deresultado: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            };
            var query = 'call PACK_NEW_MAESTROS.sp_cata_enti_dire_grabar (:x_alias,:x_co_usuario,:x_co_direccion_entidad,:x_co_catalogo_entidad, :x_co_ubigeo, :x_co_via, :x_co_zona, :x_de_nombre_zona, :x_de_nombre_via, :x_nu_numero, :x_de_interior, :x_de_referencias, :x_nu_local_principal, :x_de_codigo_postal, :x_es_registro, :x_de_altitud, :x_de_latitud, :x_de_zoom, :x_de_hora_ini_atencion, :x_de_hora_fin_atencion, :x_st_erased, :x_cadena, :x_cant_filas, :o_xresultado, :o_deresultado)';
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ state: 'error_query', message: error.stack });
                    return;
                } else {
                    const { o_xresultado, o_deresultado } = result.outBinds;
                    diaActual = new Date();
                    res.json({ state: 'success', codigo: o_xresultado, message: o_deresultado });
                }

            });
        });
    },
    c_list_estado: (req, res) => {
        res.set('Content-Type', 'application/xml');
        res.send('<?xml version="1.0" encoding="utf-8"?><data><item value="Vigente" label="Vigente" /><item value="Retirado" label="Retirado" /></data>');
    }
    ////////////////////////////////////////////////////////////////////////--------------------------------------------------------------------------------


};
module.exports = ma010102Controller;