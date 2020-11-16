const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');
const responseParams = {
    outFormat: oracledb.OBJECT,
    autoCommit: true
};

const po01020102Controller = {

}

module.exports = po01020102Controller;