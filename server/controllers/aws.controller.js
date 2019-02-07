const fs = require('fs');
const aws = require('aws-sdk');
const fetcher = require('fetch-base64');
const s3 = require('../s3');
const aws3 = new aws.S3(s3.credenciales);

const awsController = {
    
    getImg: (req, res) => {
        const { key } = req.query;
        const localpath = './tmp/' + new Date().getTime() + '.tmp';;
        const params = {
            Bucket: s3.bucket,
            Key: key
        }
        aws3.getObject(params, (err, data) => {
            if (err) throw err;
            fs.writeFile(localpath, data.Body, 'binary', (err) => {
                if (err) throw err;
                console.log('Imagen grabada al disco');
                fetcher.local(localpath).then((data) => {
                    res.send('<html><head><style>*{margin:0;padding:0;} body{background-color:\'#404040\';height:100%;width:100%;}</style></head><body><div style="height:100%;width:100%;"><img src="' + data[1] + '" style="max-height:100%;max-width:100%;"/></div></body></html>');
                    fs.unlink(localpath);
                }).catch((reason) => {});
            })
        })
    }
}

module.exports = awsController;