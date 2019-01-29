var path = require('path');
//const ejs = require('ejs');

const intranetController = {
    home: (req, res) => {
        res.sendFile(path.resolve('client/views/login/login.html'));
    },
    
    inicio: (req, res) => {
        res.sendFile(path.resolve('client/views/home/inicio.html'));
    },

    CargarModulo: (req, res) => {
        const modulo = req.params.id;
        var subcarpeta = '';
        const prefijo = modulo.substring(0,2);
        switch(prefijo) {
            case 'MA': subcarpeta = 'maestros';break;
            case 'AD': subcarpeta = 'administracion';break;
            case 'BA': subcarpeta = 'finanzas';break;
            default: '';
        }
        res.sendFile(path.resolve('client/views/modulos/' + subcarpeta + '/' + modulo + '.html'));
        /*
        ejs.render(path.resolve('client/views/modulos/' + subcarpeta + '/' + modulo + '.html'), data);*/
        const data = {
            path: '/modulos/' + subcarpeta + '/' + modulo + '/'
        };
        res.render(path.resolve('client/views/modulos/' + subcarpeta + '/' + modulo + '.ejs'), data);
    }
};

module.exports = intranetController;