const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');

const responseParams = {
    outFormat: oracledb.OBJECT
};

const ba010305Controller = {
    ComboPeriodos: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            const { empresa } = req.params;
            if(err) {
                console.error(err);
                return;
            }
            const query = "select co_periodo value,de_periodo text from table(pack_new_maestros.f_list_combo_periodos(:empresa))";
            const params = {
                empresa: { val: empresa }
            };
            conn.execute(query, params, responseParams, (error, result) => {
                if(error) {
                    console.error(error);
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderCombo(result.rows));
            });
        });
    }
};

module.exports = ba010305Controller;