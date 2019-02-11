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
app.use(cors({origin: host.address}));
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'ejs');
//app.use(jwt());
//servicio de archivos estáticos
app.use(express.static('public'));

//rutas cliente
app.use('/', require('../client/routes/intranet.routes'));
//rutas para el manejador de archivos
app.use('/files', require('./routes/archivos.routes'));
//archivos amazon
app.use('/aws', require('./routes/aws.routes'));
//rutas servidor
app.use('/api/auth', require('./routes/login.routes'));
app.use('/api/home', require('./routes/home.routes'));
app.use('/api/cartera', require('./routes/cartera.routes'));
//rutas para funciones de ancestros
app.use('/api/ancestros', require('./routes/ancestros.routes'));
//rutas para modulos
app.use('/api/AD010102', require('./routes/administracion/AD010102.routes'));
app.use('/api/AD010201', require('./routes/administracion/AD010201.routes'));
app.use('/api/MA010202', require('./routes/maestros/MA010202.routes'));
app.use('/api/MA010201', require('./routes/maestros/MA010201.routes'));
app.use('/api/MA010301', require('./routes/maestros/MA010301.routes'));
app.use('/api/MA010601', require('./routes/maestros/MA010601.routes'));
app.use('/api/LO01020201', require('./routes/logistica/LO01020201.routes'));
app.use('/api/BA010304', require('./routes/finanzas/BA010304.routes'));
app.use('/api/BA010305', require('./routes/finanzas/BA010305.routes'));

//arrancar el servidor
app.listen(app.get('port'), () => {
    console.log("Servidor escuchando en el puerto ", app.get('port'));
});