const sftpManager = require('./server/libs/sftp-manager');

const localPath = '/home/node/files/wp.jpg';
const destPath = '/common/document/11/foto.jpg';

const obj = {
    upload: async _ => {
        let result = await sftpManager.upload(localPath, destPath);
        console.log('result', result);
    }
};

obj.upload();