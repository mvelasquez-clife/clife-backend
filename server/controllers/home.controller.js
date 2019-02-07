//const express = require('express');
const oracledb = require('oracledb');
//const app = express();
const dbParams = require('../database');
const o2x = require('object-to-xml');
const xmlparse = require('../xml-parser');
const formidable = require('formidable');
//const fs = require('fs');
var fs = require('fs');
var path = require('path');


const util = require('util');
const responseParams = {
    outFormat: oracledb.OBJECT
};
const homeController = {

    file_exist: (req, res) => {
        const {co_usu} = req.body,
        path_ = './public', Folderperfil = '/assets/photos/' + co_usu + '/img_perfil', Folderfondo = '/assets/photos/' + co_usu + '/img_fondo';
        var __srcperfil, __srcfondo;
        var folder = path_ + Folderperfil, folderf = path_ + Folderfondo;
        var files = [fs.readdirSync(folder), fs.readdirSync(folderf)];
        __srcperfil = (files[0].length > 0) ? Folderperfil + '/' + files[0] : '/assets/images/icons/iconsjhon/avatar_defecto.png';
        __srcfondo = (files[0].length > 0) ? Folderfondo + '/' + files[1] : '/assets/images/icons/home/background3.png';
        res.json({state: 'readfile', srcperfil: __srcperfil, srcfondo: __srcfondo});
    },
    upload: (req, res) => {
        var __req = req;
        var __src, __file;
        if (req.method.toLowerCase() == 'post') {
            var formu = new formidable.IncomingForm();
            formu.maxFileSize = 2 * 1024 * 1024;
            formu.on('fileBegin', function (name, file) {
                file.path = './public/assets/photos/' + file.name;
                __src = '/assets/photos/' + file.name;
            });
            formu.on('file', function (name, file) {
                __file = file;
            });
            formu.on('error', function (error) { // I thought this would handle the upload error
                if (error)
                    res.json({state: 'alert', error: error.message});
                res.resume();
                return false;
            });
            formu.parse(req, function (err, fields, files) {
                if (!err)
                    res.json({state: 'success', src: '/assets/photos/' + files.file_name.name});
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
    },
    list_tipodoc: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                 res.send({'error_conexion':err.stack});
               
                return;
            }
            const query = "select co_tipo_doc_ide as value ,de_abrevia as label from table(pack_new_pers.f_list_tipodoc)";
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({'error_query':error.stack});
                    conn.close();
                    return;
                }

                res.set('Content-Type', 'text/xml');
                res.send(xmlparse.renderSelect(result.rows,'1'));

                
            });
        });
    },
    update_datos: (req, res) => {

        const {empresa, codigo, copersona, u_tipo_doc, u_documento, u_apepat, u_apemat, u_nombres, u_sexo, u_fecnac, u_mail, u_mail_p, u_tef_c, u_tef_p} = req.body; //cuando las variables se envian por post
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                console.error(err);
                return;
            }
            const query = "call PW_DATOS_USUARIO_LOGIN.sp_grabar_data_persona(:empresa,:co_usuario,:co_persona,:co_tipo_doc,:co_documento,:apepat,:apemat,:nombres,:sexo,:fecnac,:mailcor,:mailper,:celcor,:celper,:o_co_pers,:o_result)";

            const params = {
                empresa: {val: empresa},
                co_usuario: {val: codigo},
                co_persona: {val: copersona},
                co_tipo_doc: {val: u_tipo_doc},
                co_documento: {val: u_documento},
                apepat: {val: u_apepat},
                apemat: {val: u_apemat},
                nombres: {val: u_nombres},
                sexo: {val: u_sexo},
                fecnac: {val: u_fecnac},
                mailcor: {val: u_mail},
                mailper: {val: u_mail_p},
                celcor: {val: u_tef_c},
                celper: {val: u_tef_p},

                //parametros de salida
                o_co_pers: {dir: oracledb.BIND_OUT, type: oracledb.NUMBER},
                o_result: {dir: oracledb.BIND_OUT, type: oracledb.STRING}
            };
            console.log(params);
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    conn.close();
                    res.json({
                        state: 'error',
                        message: error.Error
                    });
                    return;
                }
                const {o_co_pers, o_result} = result.outBinds;
                if (o_co_pers > 0)
                    res.json({
                        state: 'success',
                        message: o_result
                    });
                else
                    res.json({
                        state: 'error',
                        message: o_result
                    });
            });
        });
    }
};
module.exports = homeController;