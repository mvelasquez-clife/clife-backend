const oracledb = require('oracledb');
const dbParams = require('../database');
const o2x = require('object-to-xml');

const responseParams = {
    outFormat: oracledb.OBJECT
};

const ad010201Controller = {
    cargarDatos: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                console.error(err);
                return;
            }
            const query = "select ma_fabr_m.co_fabricante,ma_fabr_m.co_documento,ma_fabr_m.de_nombre,ma_fabr_m.es_vigencia,ma_fabr_m.co_catalogo_entidad,ma_pais_m.de_nombre,ma_cata_enti_m.de_razon_social,ma_fabr_m.co_pais from ma_fabr_m left outer join ma_cata_enti_m on ma_fabr_m.co_catalogo_entidad = ma_cata_enti_m.co_catalogo_entidad, ma_pais_m where (ma_fabr_m.co_pais = ma_pais_m.co_pais) and 1 = :numero";
            const params = { 
                numero: { val: 1 }
            };
            conn.execute(query, params, responseParams, (error, result) => {
                if(error) {
                    console.error(error);
                    conn.close();
                    return;
                }
                var arr = [];
                for(var i in result.rows) {
                    var iRow = result.rows[i];
                    var vCell = [];
                    for(var key in iRow) vCell.push(iRow[key]);
                    arr.push({
                        '@': { id: result.rows[i].CODIGO },
                        cell: vCell
                    });
                }
                res.set('Content-Type', 'text/xml');
                res.send(o2x({
                    '?xml version="1.0" encoding="utf-8"?' : null,
                    rows: {
                        row: arr
                    }
                }));
            });
        });
    }
};

module.exports = ad010201Controller;
