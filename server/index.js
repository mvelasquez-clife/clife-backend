const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dbParams = require('./database');

//configuraciones
app.set('port', process.env.port || 3000);

//middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({origin:'http://192.168.11.156'}));
app.use(bodyParser.urlencoded({extended:false}));
//app-use(jwt());

//rutas
app.use('/api/auth', require('./routes/login.routes'));
app.use('/api/home', require('./routes/home.routes'));
app.use('/api/cartera', require('./routes/cartera.routes'));
//rutas para modulos
app.use('/api/AD010102', require('./routes/AD010102.routes'));

//arrancar el servidor
app.listen(app.get('port'), () => {
    console.log("Servidor escuchando en el puerto ", app.get('port'));
});