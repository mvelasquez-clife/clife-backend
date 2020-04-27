const ftp = require('ftp');
const ftpAccess = require('../config/ftp-config');
const fupload = require('../fupload');
const fs = require('fs');

module.exports = {
    Descargar: (rutaServidor) => {
        const vPath = rutaServidor.split('/');
        const numDirs = vPath.length;
        const filename = vPath[numDirs - 1];
        const rutaLocal = fupload.tmppath + filename;
        return new Promise((resolve, reject) => {
            const c = new ftp();
            c.on('ready', () => {
                console.log('c ready');
                c.get(rutaServidor, (err, stream) => {
                    console.log('c get');
                    if (err) {
                        reject({
                            error: err
                        });
                        return;
                    }
                    stream.once('close', () => {
                        console.log('conexión cerrada!');
                        c.end();
                    });
                    stream.pipe(fs.createWriteStream(rutaLocal));
                });
            });
            c.on('close', () => {
                resolve({
                    path: rutaLocal
                });
            });
            c.connect(ftpAccess.srvclife);
        });
    },
    Subir: (rutaLocal, rutaServidor) => {
        const vPath = rutaServidor.split('/');
        vPath.pop();
        const remoteFolder = vPath.join('/');
        return new Promise((resolve, reject) => {
            const c = new ftp();
            c.on('ready', function () {
                c.mkdir(remoteFolder, true, err => {
                    if (err) reject({
                        error: err
                    });
                    c.put(rutaLocal, rutaServidor, function (error) {
                        if (error) reject({
                            error: error
                        });
                        c.end();
                    });
                });
            });
            c.on('close', () => {
                resolve({
                    success: true
                });
            });
            c.connect(ftpAccess.srvclife);
        });
    },
    SubirRegistro: (rutaLocal, rutaServidor) => {
        console.log('rutaLocal');
        console.log(rutaLocal);
        const vPath = rutaServidor.split('/');
        vPath.pop();
        const remoteFolder = vPath.join('/');
        return new Promise((resolve, reject) => {
            const c = new ftp();
            c.on('ready', function () {
                c.mkdir(remoteFolder, true, err => {
                    if (err) reject({
                        error: err
                    });
                    c.put(rutaLocal, rutaServidor, function (error) {
                        if (error) reject({
                            error: error
                        });
                        c.end();
                    });
                });
            });
            c.on('close', () => {
                resolve({
                    success: true
                });
            });
            c.connect(ftpAccess.srvdirtec);
        });
    },
    DescargarRegistro: (rutaServidor) => {
        console.log(rutaServidor);
        const vPath = rutaServidor.split('/');
        const numDirs = vPath.length;
        const filename = vPath[numDirs - 1];
        const rutaLocal = fupload.tmppath + filename;
        return new Promise((resolve, reject) => {
            const c = new ftp();
            c.on('ready', () => {
                console.log('c ready');
                c.get(rutaServidor, (err, stream) => {
                    console.log('c get');
                    if (err) {
                        reject({
                            error: err
                        });
                        return;
                    }
                    stream.once('close', () => {
                        console.log('conexión cerrada!');
                        c.end();
                    });
                    stream.pipe(fs.createWriteStream(rutaLocal));
                });
            });
            c.on('close', () => {
                resolve({
                    path: rutaLocal
                });
            });
            c.connect(ftpAccess.srvdirtec);
        });
    },
};
