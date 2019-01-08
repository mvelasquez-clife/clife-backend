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
        res.sendFile(path.resolve('client/views/modulos/' + modulo + '.html'));
    }
};

module.exports = intranetController;