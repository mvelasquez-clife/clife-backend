const oracledb = require('oracledb');
const dbParams = require('../database');
const o2x = require('object-to-xml');
const formidable = require('formidable');
//const http = require('http');
//const  util = require('util');
var path = require('path');
const fs = require('fs');
const homeController = {

    file_exist: (req, res) => {
        const {co_usu, tipo, name} = req.body;
        const path_ = './public';
        const testFolder = '/assets/perfil/' + co_usu + '/' + name;
        //  var p = {co_usu: usrJson.codigo, tipo: 'profile', name : usrJson.codigo+'_profile.png'};



        return new Promise(function (resolve, reject) {
            fs.exists(path_ + testFolder, function (exists) {
                if (exists) {
                    reject(res.json({
                        state: 'success',
                        'folder': testFolder
                    }));
                } else {
                    resolve(res.json({
                        state: 'default',
                        'folder': '/assets/images/icons/iconsjhon/avatar_defecto.png'
                    }));
                }
            });
        })

        /*
         fs.readdir(testFolder, (err, files) => {
         if (!err){
         var l_items = [];
         
         for (var i in files) {
         l_items.push(files[i]);
         }
         //comprobar si obtuve resultado
         if (l_items.length > 0) {
         res.json({
         state: 'success',
         data: {l_items
         }
         });
         }
         
         files.forEach(file => {
         console.log(file);
         });
         }else {
         res.json({
         state: 'error',
         error: err
         });
         }
         
         });
         */
    },
    upload: (req, res) => {
        if (req.method.toLowerCase() == 'post') {
            // parse a file upload
            var form = new formidable.IncomingForm();
            form.maxFileSize = 2 * 1024 * 1024;

            form.on('fileBegin', function (name, file) {
                file.path = __dirname + '/upload/' + file.name;
                //console.log(file.path);
            });

            var sizeLimitBytes = 2000;
            form.on('progress', function (bytesReceived, bytesExpected) {

            });
            form.on('error', function (error) { // I thought this would handle the upload error
                if (error)
                    res.json({
                        state: 'alert', error: error.message
                    });
                return false;
            })

            form.parse(req, function (err, fields, files) {

                if (!err)
                    res.json({
                        state: 'success'
                    });
            });
            return;
        }

    },

    getMenu: (req, res) => {
        const {id} = req.query;
        const {alias, empresa} = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                console.error(err);
                return;
            }
            const responseParams = {
                outFormat: oracledb.OBJECT
            };
            const query1 = 'call pack_venta.sm_activar_empresa(:alias)';
            const params1 = {alias: {val: alias}};
            conn.execute(query1, params1, responseParams, (error, result) => {
                if (error) {
                    //console.error(error);
                    conn.close();
                    return;
                }
            });
            const query2 = "select co_menu_sistema as \"id\",de_nombre as \"text\", case st_tipo when 'm' then 1 else 0 end as \"child\" from v_generar_menu where de_alias = :alias and co_empresa = :empresa and co_antecesor = :codigo order by st_tipo desc";
            const params2 = {alias: {val: alias}, empresa: {val: empresa}, codigo: {val: id}};
            conn.execute(query2, params2, responseParams, (error, result) => {
                if (error) {
                    console.error(error);
                    conn.close();
                    return;
                }
                /*return res.json({
                 id: id,
                 items: result.rows
                 });*/
                var arr = [];
                for (var i in result.rows) {
                    arr.push({
                        '@': result.rows[i]
                    });
                }
                res.set('Content-Type', 'text/xml');
                res.send(o2x({
                    '?xml version="1.0" encoding="utf-8"?': null,
                    tree: {
                        '@': {id: id == 'MAIN' ? 0 : id},
                        item: arr
                    }
                }));
            });
        });
    },

    getmenu_search: (req, res) => {
        const {id} = req.query;
        const {alias, empresa, txtsearch} = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                console.error(err);
                return;
            }
            const responseParams = {
                outFormat: oracledb.OBJECT
            };
            const query1 = 'call pack_venta.sm_activar_empresa(:alias)';
            const params1 = {alias: {val: alias}};
            conn.execute(query1, params1, responseParams, (error, result) => {
                if (error) {
                    console.error(error);
                    conn.close();
                    return;
                }
            });

            const query2 = "select gen.co_menu_sistema as \"id\",'>>' as \"flecha\" , '<div class=\"classfont\" >'||gen.de_nombre||'</div>' as \"name\", '<div class=\"classfont\" >'||sist.de_nombre||'</div>' as \"padre\" from v_generar_menu gen left join  sg_menu_sist_m sist on gen.co_antecesor = sist.co_menu_sistema   where gen.de_alias=:alias and gen.co_empresa =:empresa and gen.st_tipo='i' and gen.es_vigencia='Activo' and upper(gen.de_nombre) like upper(:text) order by gen.st_tipo desc ";
            const params2 = {alias: {val: alias}, empresa: {val: empresa}, text: {val: '%' + txtsearch + '%'}};
            conn.execute(query2, params2, responseParams, (error, result) => {
                if (error) {
                    console.error(error);
                    conn.close();
                    return;
                }
                var l_items = [];

                for (var i in result.rows) {
                    l_items.push(result.rows[i]);
                }
                //comprobar si obtuve resultado
                if (l_items.length > 0) {
                    res.json({
                        state: 'success',
                        data: {l_items
                        }
                    });
                } else {
                    res.json({
                        state: 'false',
                        data: {
                            l_items: [{'id': 0, 'name': 'No se encontraron concidencias...'}]
                        }
                    });
                }

                //  res.json({result.rows});
//                 res.
//                res.set('Content-Type', 'application/json');
//                res.send(o2x({arr}));


            });
        });
    }


};

module.exports = homeController;