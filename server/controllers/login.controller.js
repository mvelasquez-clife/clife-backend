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

//var waterfall = require('async-waterfall');
const responseParams = {
    outFormat: oracledb.OBJECT
};
const loginCtrl = {
//    forgot: (req, res) => {
//        const {mail} = req.body;
//        let transporter = nodemailer.createTransport({host: email__.smtp.host, port: email__.smtp.port, secure: email__.smtp.secure, auth: {user: email__.credenciales.user, pass: email__.credenciales.pass}});
//        let mailOptions = {from: email__.message.from, to: mail, subject: email__.message.subject, text: email__.message.text, html: email__.message.html};
//        transporter.sendMail(mailOptions, function (error, info) {
//            if (error) {
//                res.send(500, {state: "error", message: error.message});
//            } else {
//                res.status(200).jsonp({state: "success", message: "Envio el Correo!.. verifique su bandeja de entrada...."});
//            }
//        });
//    },

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
                        res.send({state: 'error', 'message': err.stack});
                        return;
                    }

                    var query = ' SELECT DE_NOMBRE AS NAME FROM SG_USUA_M WHERE  DE_CORREO = :email ';

                    const params = {email: mailrecover};
                    conn.execute(query, params, responseParams, (error, result) => {
                        console.log('callback :' + result.rows);
//                        if (result.rows.CONTAR > 0) {
                        if (!error) {
                            if ((result.rows).length > 0) {
                                done(null,(result.rows).length, result.rows[0].NAME);
                            } else
                                 done(null,0,{state: 'error', 'message': 'No se encontraron datos', err: error});

                        }
//                        } else {
//                            done('Correo no Existe...');
//                        }

                        conn.close();
                    });
                });
//                User.findOne({
//                    email: req.body.mail
//                }).exec(function (err, user) {
//                    if (user) {
//                        done(err, user);
//                    } else {
//                        done('User not found.');
//                    }
//                });
            },
            function (nro,user, done) { console.log(nro + ' ' + user + ' '+done);
                // create the random token
                if (nro > 0)
                    crypto.randomBytes(20, function (err, buffer) {
                        console.log
                        var token = buffer.toString('hex');
                        done(null, user, token);
                    });
                else done(null, nro, user);
            },
//            function (token, done) {
//                User.findByIdAndUpdate({_id: user._id}, {reset_password_token: token, reset_password_expires: Date.now() + 86400000}, {upsert: true, new : true}).exec(function (err, new_user) {
//                    done(err, token, new_user);
//                });
//            },
            function (user, token, done) {      console.log(user + ' ' + token + ' '+done);

                var data = {
                    from: email__.message.from,
                    to: mailrecover,
                    template: 'forgot-password-email',
                    subject: email__.message.subject,
                    context: {
                        url: 'http://localhost:3000/auth/reset_password?token=' + token,
                        name: user //user.fullName.split(' ')[0]
                    }
                };

                smtpTransport.sendMail(data, function (err) {
                    if (!err) {
                        return res.json({state: 'success', message: 'Kindly check your email for further instructions'});
                    } else {
                        return done(token);
                    }
                });
            }
        ], function (err) { console.log(err);
            return res.status(200).json({state: 'error', message: err});
        });
    },
    doLogin: (req, res) => {
        const {usuario, clave} = req.body;
        oracledb.getConnection(
                dbParams,
                (err, connection) => {
            if (err) {
                console.log(err.message);
                return;
            }
            connection.execute(
                    "SELECT CO_PERSONA,DE_ALIAS,CO_EMPRESA_USUARIO,CO_USUARIO,CO_TIPO_DOC_IDE,DE_NOMBRES,DE_SEXO,FE_NACIMIENTO,ST_ADMIN,DE_APELLIDO_PATERNO,DE_APELLIDO_MATERNO,CO_CENTRO_COSTO,ST_ACCESO_WAP,DE_NOMBRE_COSTOS,FE_REGISTRO,DE_DOCUMENTO,DE_MAIL_CORPO,DE_TELEFONO_CORPO FROM TABLE(PW_DATOS_USUARIO_LOGIN.F_DATOS_USUARIO_LOGIN(:usuario,:clave))",
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

                const token = jwt.sign(user, jwtKey, {
                    expiresIn: 86400
                });
                return res.json({
                    state: "success",
                    data: {
                        token: token,
                        usuario: user
                    }
                });
            }
            );
        }
        );
    }
};

module.exports = loginCtrl;
