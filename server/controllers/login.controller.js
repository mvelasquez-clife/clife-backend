const oracledb = require('oracledb');
const dbParams = require('../database');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const async = require("async");
const crypto = require('crypto');
const  bcrypt = require('bcrypt');
const path = require('path');
const  hbs = require('nodemailer-express-handlebars');
const jwtKey = require('../jwt');
const email__ = require('../mail');
const saltRounds = 10;
const responseParams = {
    outFormat: oracledb.OBJECT
};
const loginCtrl = {
    savepassword: (req, res) => {
        const {clave, emp, user, mail} = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({'error_conexion': err.stack});
                return;
            }
            connection.execute(
                    "select co_persona,de_alias,co_empresa_usuario,co_usuario,co_tipo_doc_ide,de_nombres,de_sexo,fe_nacimiento,st_admin,de_apellido_paterno,de_apellido_materno,co_centro_costo,st_acceso_wap,de_nombre_costos,fe_registro,de_documento,de_mail_corpo,de_telefono_corpo,de_fullname from table(pw_datos_usuario_login.f_datos_usuario_login(:usuario,:clave))",
                    {
                        usuario: {val: usuario},
                        clave: {val: clave}
                    },
                    {
                        outFormat: oracledb.OBJECT,
                        maxRows: 1
                    },
                    (error, result) => {
                connection.close();
                if (error) {
                    //console.error(error.message);
                    return res.json({
                        state: "error",
                        err: error.message
                    });
                }
                if (result.rows.length == 0) {
                    return res.json({
                        state: "error",
                        err: "Datos de autenticación incorrectos"
                    });
                }
                const user = {
                    copersona: result.rows[0].CO_PERSONA,
                    alias: result.rows[0].DE_ALIAS,
                    empresa: result.rows[0].CO_EMPRESA_USUARIO,
                    codigo: result.rows[0].CO_USUARIO,
                    tipodoc: result.rows[0].CO_TIPO_DOC_IDE,
                    nombre: result.rows[0].DE_NOMBRES,
                    sexo: result.rows[0].DE_SEXO,
                    fecnaci: result.rows[0].FE_NACIMIENTO,
                    stadmin: result.rows[0].ST_ADMIN,
                    apemat: result.rows[0].DE_APELLIDO_MATERNO,
                    apepat: result.rows[0].DE_APELLIDO_PATERNO,
                    ccosto: result.rows[0].CO_CENTRO_COSTO,
                    stwap: result.rows[0].ST_ACCESO_WAP,
                    ncosto: result.rows[0].NOM_CCOSTOS,
                    fregistro: result.rows[0].FE_REGISTRO,
                    documento: result.rows[0].DE_DOCUMENTO,
                    mailcorpo: result.rows[0].DE_MAIL_CORPO,
                    cellcorpo: result.rows[0].DE_TELEFONO_CORPO
                };
                const query = "update sg_usua_m set PASSWORD=:nclave where CO_EMPRESA_USUARIO=:emp and DE_ALIAS=:usua  and DE_CORREO = :email ";
                const params = {nclave: hash, emp: emp, usua: user, email: mail};
                conn.execute(query, params, responseParams, (error, result) => {
                    conn.commit();
                    conn.close();
                    if (error) {
                        return   res.json({'error_query': error.stack});
                    } else {
                        return   res.json({state: 'success', message: 'Se actualizó su contraseña...'});
                    }
                });
            });

        });
    },
    validatetoken: (req, res) => {
        const token = req.body.token;
        jwt.verify(token, jwtKey.jwtkeylogin, function (err, decoded) {
            if (err) {
                return res.json({state: 'error', message: 'Fallo la autenticidad del Token.'});
            } else {
                oracledb.getConnection(dbParams, (err, conn) => {
                    if (err) {
                        res.send({state: 'error', 'message': err.stack});
                        return;
                    }
                    var query = 'SELECT DE_ALIAS,CO_EMPRESA_USUARIO FROM table(PW_DATOS_USUARIO_LOGIN.F_VALIDA_MAIL(:email,:usua_))';
                    const params = {email: decoded.mail, usua_: '0'};
                    conn.execute(query, params, responseParams, (error, result) => {                         //console.log('callback :' + result.rows);
                        if (!error) {
                            return res.json({state: 'success', response: decoded, res: result.rows});
                        } else {
                            return res.json({state: 'error', message: error.stack});
                        }
                        conn.close();
                    });
                });
            }
        });
    },
    forgot: (req, res) => {
        const mailrecover = req.body.mail;
        var smtpTransport = nodemailer.createTransport({
            host: email__.smtp.host, port: email__.smtp.port, secure: email__.smtp.secure,
            auth: {
                user: email__.credenciales.user, pass: email__.credenciales.pass
            }
        });
        var handlebarsOptions = {
            viewEngine: 'handlebars',
            viewPath: path.resolve('public/assets/template/'),
            extName: '.html'
        };

        smtpTransport.use('compile', hbs(handlebarsOptions));
        async.waterfall([
            function (done) {
                oracledb.getConnection(dbParams, (err, conn) => {
                    if (err) {
                        res.json({state: 'error', 'message': err.stack});
                        return;
                    }

                    var query = 'SELECT DE_NOMBRE AS NAME FROM table(PW_DATOS_USUARIO_LOGIN.F_VALIDA_MAIL(:email,:usua_)) ';
                    const p = {email: mailrecover, usua_: '0'};
                    conn.execute(query, p, responseParams, (error, result) => {                      ///  console.log('callback :' + result.rows);
                        if (!error) {
                            if ((result.rows).length >= 1) {
                                done(null, result.rows[0].NAME);
                            } else
                                done(null, {state: 'nomail', 'message': '<div style="display: block;    padding: 5px;    line-height: 1.5;    font-size: 1.2em;">No hay usuario asociado a: <b>' + mailrecover + '</b></div>', err: error});
                        } else {
                            done(null, {err: error.stack});
                        }
                        conn.close();
                    });
                });

            },
            function (user, done) {
                if (user.length > 0) {
                    var token = jwt.sign({user: user, mail: mailrecover}, jwtKey.jwtkeylogin, {
                        expiresIn: jwtKey.jwtforgotexpire
                    });
                    done(null, user, token);
                } else
                    done(null, user, 0);
            },

            function (user, token, done) {// console.log(req.headers.host + '/resetpasword/token=' );
                if (user.length > 0) {
                    var data = {
                        from: email__.message.from,
                        to: mailrecover,
                        template: 'forgot-password-email',
                        subject: user + ' ' + email__.message.subject,
                        context: {
                            url: 'http:' + req.headers.host + '/resetpasword/token=' + token, // url: 'http://localhost:3000/resetpasword/token=' + token,
                            name: user //user.fullName.split(' ')[0]
                        }
                    };

                    smtpTransport.sendMail(data, function (err) {
                        if (!err) {
                            return res.json({state: 'success', message: '<div style="display: block;    padding: 5px;    line-height: 1.5;    font-size: 1.2em;">Correo enviado! Revise su bandeja y continue con los pasos...</div>'});
                        } else {
                            return done(user);
                        }
                    });
                } else {
                    return res.json(user);
                }
            }
        ], function (err) {
            return res.json({state: 'error', message: err});
        });
    },
    doLogin: (req, res) => {
        let {usuario, clave} = req.body;
        async.waterfall([
            function (done) {
                oracledb.getConnection(dbParams, (err, connection) => {
                    if (err) {
                        return   res.json({state: 'error', message: err.stack});
                    }
                    let p = {usua: usuario, email: '$'};
                    connection.execute("SELECT PASSWD  FROM table(PW_DATOS_USUARIO_LOGIN.F_VALIDA_MAIL(:email,:usua))  ", p, responseParams, (error, result) => {
                        connection.close();
                        if (!error)
                            bcrypt.compare(clave, result.rows[0].PASSWD, function (err, res) {
                                clave = result.rows[0].PASSWD;
                                done(null, res === true ? '1' : '0');
                            });
                        else
                            return res.json({state: 'error', message: error.stack});
                    });
                });
            }, function (state, done) {
                if (state === '1') {
                    oracledb.getConnection(dbParams, (err, connection) => {
                        if (err) {
                            return res.json({state: 'error', message: err.stack});
                        }
                        let responseParams = {outFormat: oracledb.OBJECT, maxRows: 1};
                        let p = {usuario: {val: usuario}, clave: {val: clave}};
                        connection.execute("SELECT CO_PERSONA,DE_ALIAS,CO_EMPRESA_USUARIO,CO_USUARIO,CO_TIPO_DOC_IDE,DE_NOMBRES,DE_SEXO,FE_NACIMIENTO,ST_ADMIN,DE_APELLIDO_PATERNO,DE_APELLIDO_MATERNO,CO_CENTRO_COSTO,ST_ACCESO_WAP,DE_NOMBRE_COSTOS,FE_REGISTRO,DE_DOCUMENTO,DE_MAIL_CORPO,DE_TELEFONO_CORPO FROM TABLE(PW_DATOS_USUARIO_LOGIN.F_DATOS_USUARIO_LOGIN(:usuario,:clave))",
                                p, responseParams, (error, result) => {
                            connection.close();
                            if (error) {
                                return res.json({state: "error", err: error.stack});
                            }

                            const user = {
                                copersona: result.rows[0].CO_PERSONA,
                                alias: result.rows[0].DE_ALIAS,
                                empresa: result.rows[0].CO_EMPRESA_USUARIO,
                                codigo: result.rows[0].CO_USUARIO,
                                tipodoc: result.rows[0].CO_TIPO_DOC_IDE,
                                nombre: result.rows[0].DE_NOMBRES,
                                sexo: result.rows[0].DE_SEXO,
                                fecnaci: result.rows[0].FE_NACIMIENTO,
                                stadmin: result.rows[0].ST_ADMIN,
                                apemat: result.rows[0].DE_APELLIDO_MATERNO,
                                apepat: result.rows[0].DE_APELLIDO_PATERNO,
                                ccosto: result.rows[0].CO_CENTRO_COSTO,
                                stwap: result.rows[0].ST_ACCESO_WAP,
                                ncosto: result.rows[0].NOM_CCOSTOS,
                                fregistro: result.rows[0].FE_REGISTRO,
                                documento: result.rows[0].DE_DOCUMENTO,
                                mailcorpo: result.rows[0].DE_MAIL_CORPO,
                                cellcorpo: result.rows[0].DE_TELEFONO_CORPO
                            };
                            const token = jwt.sign(user, jwtKey.jwtkeylogin, {
                                expiresIn: jwtKey.jwtloginexpire
                            });
                            return res.json({state: "success", data: {token: token, usuario: user}});
                        }
                        );
                    })
                } else
                    return res.json({state: "error", err: "No se encontraron coincidencias!"});

            }
        ], function (err) {
            return res.json({state: 'error', message: err});
        });


    }
};

module.exports = loginCtrl;
