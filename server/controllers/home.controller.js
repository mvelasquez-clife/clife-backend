const oracledb = require('oracledb');
const dbParams = require('../database');
const o2x = require('object-to-xml');

const homeController = {
    getMenu: (req, res) => {
        const { id } = req.query;
        const { alias, empresa } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                console.error(err);
                return;
            }
            const responseParams = {
                outFormat: oracledb.OBJECT
            };
            const query1 = 'call pack_venta.sm_activar_empresa(:alias)';
            const params1 = { alias: { val: alias } };
            conn.execute(query1, params1, responseParams, (error, result) => {
                if(error) {
                    console.error(error);
                    conn.close();
                    return;
                }
            });
            const query2 = "select co_menu_sistema as \"id\",de_nombre as \"text\", case st_tipo when 'm' then 1 else 0 end as \"child\" from v_generar_menu where de_alias = :alias and co_empresa = :empresa and co_antecesor = :codigo order by st_tipo desc";
            const params2 = { alias: { val: alias }, empresa: { val: empresa }, codigo: { val: id } };
            conn.execute(query2, params2, responseParams, (error, result) => {
                if(error) {
                    console.error(error);
                    conn.close();
                    return;
                }
                /*return res.json({
                    id: id,
                    items: result.rows
                });*/
                var arr = [];
                for(var i in result.rows) {
                    arr.push({
                        '@': result.rows[i]
                    });
                }
                res.set('Content-Type', 'text/xml');
                res.send(o2x({
                    '?xml version="1.0" encoding="utf-8"?' : null,
                    tree: {
                        '@': { id: id == 'MAIN' ? 0 : id },
                        item: arr
                    }
                }));
            });
        });
    }
};

module.exports = homeController;