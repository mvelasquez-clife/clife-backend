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
            resolve({
                error: 'Servidor no encontrado'
            });
            return;
            const c = new ftp();
            c.on('ready', () => {
                console.log('c ready');
                c.get(rutaServidor, (err, stream) => {
                    console.log('c get');
                    if (err) {
                        resolve({
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
            resolve({
                error: 'Servidor no encontrado'
            });
            return;
            const c = new ftp();
            c.on('ready', function () {
                console.log('ready!');
                c.mkdir(remoteFolder, true, err => {
                    if (err) resolve({
                        error: err
                    });
                    console.log('mkdir');
                    c.put(rutaLocal, rutaServidor, function (error) {
                        console.log('put');
                        if (error) resolve({
                            error: error
                        });
                        c.end();
                    });
                });
            });
            c.on('close', () => {
                console.log('closed');
                resolve({
                    success: true
                });
            });
            console.log('conectando con las credenciales', ftpAccess.srvclife);
            c.connect(ftpAccess.srvclife);
        });
    },
    SubirRegistro: (rutaLocal, rutaServidor) => {
        console.log('rutaLocal', rutaLocal);
        const vPath = rutaServidor.split('/');
        vPath.pop();
        const remoteFolder = vPath.join('/');
        return new Promise((resolve, reject) => {
            resolve({
                error: 'Servidor no encontrado'
            });
            return;
            const c = new ftp();
            c.on('ready', function () {
                console.log('ready!');
                c.mkdir(remoteFolder, true, err => {
                    if (err) resolve({
                        error: err
                    });
                    c.put(rutaLocal, rutaServidor, function (error) {
                        console.log('put');
                        if (error) resolve({
                            error: error
                        });
                        c.end();
                    });
                });
            });
            c.on('close', () => {
                console.log('closed');
                resolve({
                    success: true
                });
            });
            console.log('conectando con las credenciales', ftpAccess.srvclife);
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
            resolve({
                error: 'Servidor no encontrado'
            });
            return;
            const c = new ftp();
            c.on('ready', () => {
                console.log('c ready');
                c.get(rutaServidor, (err, stream) => {
                    console.log('c get');
                    if (err) {
                        resolve({
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
    }
};
