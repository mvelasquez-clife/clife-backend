var path = require('path');

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
            default: '';
        }
        res.sendFile(path.resolve('client/views/modulos/' + subcarpeta + '/' + modulo + '.html'));
    }
};

module.exports = intranetController;