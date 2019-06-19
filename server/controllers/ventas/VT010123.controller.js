const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');
const responseParams = {
    outFormat: oracledb.OBJECT
};

const vt010123Controller = {
    CargaListaBonificaciones: async (req,res) => {
        let empresa = req.params.empresa;
        try {
            let conn = await oracledb.getConnection(dbParams);
            const query = "select codigo,promocion,to_char(registro,'yyyy-mm-dd') registro,cousuario,deusuario,vigencia,to_char(inicio,'yyyy-mm-dd') inicio,to_char(fin,'yyyy-mm-dd') fin from table(pack_new_clife_clientes.f_lista_bonificaciones(:p_empresa))";
            const params = {
                p_empresa: empresa
            };
            let result = await conn.execute(query, params, responseParams);
            await conn.close();
            res.set('Content-Type', 'text/xml');
            res.send(xmlParser.renderXml(result.rows));
        }
        catch(err) {
            console.log(err);
        }
    }
};

module.exports = vt010123Controller;