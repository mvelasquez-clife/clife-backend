var path = require('path');
var fs = require('fs');
//const ejs = require('ejs');
const intranetController = {
    home: (req, res) => {
        res.sendFile(path.resolve('client/views/login/login.html'));
    },
    resetpasword: (req, res) => {
        res.sendFile(path.resolve('client/views/login/reset_password.html'));
    },
    inicio: (req, res) => {
        res.sendFile(path.resolve('client/views/home/inicio.html'));
    },

    CargarModulo: (req, res) => {
        let modulo = req.params.id;
        let moduloOrigen = modulo;
        let ancestro = req.params.ancestro;
        var subcarpeta = '';
        if(ancestro != undefined) modulo = ancestro;
        const prefijo = modulo.substring(0, 2);
        switch (prefijo) {
            case 'MA':
                subcarpeta = 'maestros';
                break;
            case 'AD':
                subcarpeta = 'administracion';
                break;
            case 'LO':
                subcarpeta = 'logistica';
                break;
            case 'MA':
                subcarpeta = 'maestros';
                break;
            case 'AD':
                subcarpeta = 'administracion';
                break;
            case 'BA':
                subcarpeta = 'finanzas';
                break;
            case 'VT':
                subcarpeta = 'ventas';
                break;
            case 'CR':
                subcarpeta = 'creditos';
                break;
            case 'CO':
                subcarpeta = 'contabilidad';
                break;
            case 'SG':
                subcarpeta = 'seguridad';
                break;
            case 'PV':
                subcarpeta = 'puntodeventa';
                break;     
            case 'PO':
                subcarpeta = 'plantaindustrial';
                break;
            default:
                '';
        }
        const filePath = path.resolve('client/views/modulos/' + subcarpeta + '/' + modulo + '.ejs');
        fs.exists(filePath, (exists) => {
            if (exists) {
                const data = {
                    path: '/modulos/' + subcarpeta + '/' + modulo + '/',
                    modulo: moduloOrigen
                };
                res.render(filePath, data);
            } else {
                res.render(path.resolve('client/views/home/no-hallado.ejs'), {modulo: modulo});
            }
        });
    }
};

module.exports = intranetController;