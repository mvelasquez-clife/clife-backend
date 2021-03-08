const sftp = require('ssh2-sftp-client');
const ftpAccess = require('../config/ftp-config');
const fs = require('fs');

module.exports = {
    upload: async (localPath, remotePath) => {
        let data = fs.createReadStream(localPath);
        let client = new sftp();
        const vPath = remotePath.split('/');
        vPath.pop();
        const remoteFolder = vPath.join('/');
        try {
            // conectar
            await client.connect(ftpAccess.sftpClife);
            // crea la carpeta remota
            await client.mkdir(remoteFolder, true);
            // sube el archivo
            await client.put(data, remotePath);
            // fin
            client.end();
            return {
                success: true
            }
        }
        catch (err) {
            console.error(err);
            return {
                error: err.message
            };
        }
    },
    download: async (remotePath) => {
        const vPath = remotePath.split('/');
        const numDirs = vPath.length;
        const filename = vPath[numDirs - 1];
        const rutaLocal = fupload.tmppath + filename;
        try {
            // crea archivo local
            let archivoLocal = fs.createWriteStream(rutaLocal);
            // conectar
            await client.connect(ftpAccess.sftpClife);
            // escribe en el archivo local
            await client.get(remotePath, archivoLocal);
            // fin
            client.end();
            return {
                path: rutaLocal
            }
        }
        catch (err) {
            console.error(err);
            return {
                error: err
            };
        }
    }
}