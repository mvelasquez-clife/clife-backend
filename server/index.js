const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const host = require('./local');
const dbParams = require('./database');

//configuraciones
app.set('port', process.env.port || 3000);

//middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({origin:host.address}));
app.use(bodyParser.urlencoded({extended:false}));
//app.use(jwt());
//servicio de archivos estáticos
app.use(express.static('public'));

//rutas cliente
app.use('/', require('../client/routes/intranet.routes'));
//rutas servidor
app.use('/api/auth', require('./routes/login.routes'));
app.use('/api/home', require('./routes/home.routes'));
app.use('/api/cartera', require('./routes/cartera.routes'));
//rutas para modulos
app.use('/api/AD010102', require('./routes/AD010102.routes'));
app.use('/api/AD010201', require('./routes/AD010201.routes'));
app.use('/api/MA010202', require('./routes/maestros/MA010202.routes'));
app.use('/api/MA010201', require('./routes/maestros/MA010201.routes'));

//arrancar el servidor
app.listen(app.get('port'), () => {
    console.log("Servidor escuchando en el puerto ", app.get('port'));
});