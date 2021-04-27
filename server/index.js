const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookie = require('cookie-parser');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
/*const io = require('socket.io')(http);*/
const io = require('./chat');
const host = require('./local');
const chatHandler = require('./chat');
const dbParams = require('./database');

//configuraciones
app.set('port', process.env.port || 3000);

//middlewares
//app.use(morgan('dev'));
app.use(express.json());
app.use(cors({origin: host.address}));
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
app.set('view engine', 'ejs');
//app.use(jwt());
//servicio de archivos estáticos
app.use(express.static('public'));
app.use(cookie());
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
app.use('/api/BA010302', require('./routes/finanzas/BA010302.routes'));
app.use('/api/BA010304', require('./routes/finanzas/BA010304.routes'));
app.use('/api/BA010305', require('./routes/finanzas/BA010305.routes'));
app.use('/api/CO010401B', require('./routes/contabilidad/CO010401B.routes'));
app.use('/api/CR0100', require('./routes/creditos/CR0100.routes'));
app.use('/api/CR010902', require('./routes/creditos/CR010902.routes'));
app.use('/api/MA010104', require('./routes/maestros/MA010104.routes'));
app.use('/api/MA010102', require('./routes/maestros/MA010102.routes'));
app.use('/api/MA010202', require('./routes/maestros/MA010202.routes'));
app.use('/api/MA010201', require('./routes/maestros/MA010201.routes'));
app.use('/api/MA010301', require('./routes/maestros/MA010301.routes'));
app.use('/api/MA010601', require('./routes/maestros/MA010601.routes'));
app.use('/api/LO01020201', require('./routes/logistica/LO01020201.routes'));
app.use('/api/LO01010209', require('./routes/logistica/LO01010209.routes'));
app.use('/api/LO01010210', require('./routes/logistica/LO01010210.routes'));
app.use('/api/LO0107', require('./routes/logistica/LO0107.routes'));
app.use('/api/LO010301', require('./routes/logistica/LO010301.routes'));
app.use('/api/LO0101030401', require('./routes/logistica/LO0101030401.routes'));
app.use('/api/LO0101030402', require('./routes/logistica/LO0101030402.routes'));
app.use('/api/VT010101', require('./routes/ventas/VT010101.routes'));
app.use('/api/VT010102', require('./routes/ventas/VT010102.routes'));
app.use('/api/VT010108', require('./routes/ventas/VT010108.routes'));
app.use('/api/VT010123', require('./routes/ventas/VT010123.routes'));
app.use('/api/VT010124', require('./routes/ventas/VT010124.routes'));
app.use('/api/CO0201', require('./routes/contabilidad/CO0201.routes'));
app.use('/api/CO010401B', require('./routes/contabilidad/CO010401B.routes'));
app.use('/api/SG010101', require('./routes/seguridad/SG010101.routes'));
app.use('/api/SG010203', require('./routes/seguridad/SG010203.routes'));
app.use('/api/PO010208', require('./routes/plantaindustrial/PO010208.routes'));
app.use('/api/PO010210', require('./routes/plantaindustrial/PO010210.routes'));
app.use('/api/PO010411', require('./routes/plantaindustrial/PO010411.routes'));
app.use('/api/PO010410', require('./routes/plantaindustrial/PO010410.routes'));
app.use('/api/PO01020102', require('./routes/plantaindustrial/PO01020102.routes'));

//ruta del chat
app.use('/chat', require('./routes/chat.routes'));
//visor de documentos electronicos
app.use('/viewer', require('./routes/viewer.routes'));
//tablero avance de ventas
app.use('/avance-ventas', require('./routes/avancevtas.routes'));
//coordenadas de clientes
app.use('/coordenadas', require('./routes/coordenadas.routes'));
// extranet
app.use('/extranet', require('../client/routes/extranet.routes'));
// intranet corporacionl life
app.use('/intranet', require('../client/routes/intra-life.routes'));
// web service
app.use('/ws-life', require('./../client/routes/ws.routes'));
/*app.use('/ws-life', (request, response) => {
    response.status(503).json({
        error: 'Servidor en mantenimiento'
    });
});*/

//configura el chat
/*io.set('origins', host.address);
io.on('connection', chatHandler);*/
io.ArrancarServidorChat(http);
//arrancar el servidor
app.listen(app.get('port'), () => {
    console.log("Servidor escuchando en el puerto ", app.get('port'));
});