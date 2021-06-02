const express = require('express');
const app = express();
const cookie = require('cookie-parser');
const oracledb = require('oracledb');
const dbParams = {
    user: 'desarrollo', // prod
    password: 'Sp343DanielaA',
    connectString: '(DESCRIPTION = (ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = 200.4.248.45)(PORT = 1521)))(CONNECT_DATA = (SID = orcl) (SERVER = DEDICATED)))' // VILLA
};
const responseParams = {
    outFormat: oracledb.OBJECT
};
//configuraciones
app.set('port', 3000);
app.use(express.json());
app.use(cookie());
//rutas cliente
app.use('/', (request, response) => {
    oracledb.getConnection(dbParams, (err, conn) => {
        if (err) {
            response.send(err);
        }
        conn.execute('select * from sg_usua_m', {}, responseParams, (error, result) => {
            if (error) {
                response.send(error);
                if (conn) conn.close();
                
                return;
            }
            conn.close();
            response.send(JSON.stringify(result.rows ? result.rows : []));
        });
    });
});
//arrancar el servidor
app.listen(app.get('port'), () => {
    console.log("Servidor escuchando en el puerto ", app.get('port'));
});