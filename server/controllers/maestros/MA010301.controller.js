const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');

const responseParams = {
    outFormat: oracledb.OBJECT
};

const ma010301Controller = {

    cargarPaises: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                console.error(err);
                return;
            }
            const query = "select co_pais ID,de_nombre,co_pais_sunat,co_convenios from MA_PAIS_M";
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if(error) {
                    console.error(error);
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderXml(result.rows));
            });
        });
    },

    cargarDepartamentos: (req, res) => {
        const { pais } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                console.error(err);
                return;
            }
            const query = "select mdm.co_departamento,mdm.de_nombre de_departamento,mpm.de_nombre de_pais,mdm.co_pais from MA_DEPA_M mdm join MA_PAIS_M mpm on mdm.co_pais = mpm.co_pais where mdm.co_pais = :p_pais";
            const params = {
                p_pais: { val: pais }
            };
            conn.execute(query, params, responseParams, (error, result) => {
                if(error) {
                    console.error(error);
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderXml(result.rows));
            });
        });
    },

    cargarProvincias: (req, res) => {
        const { pais, departamento } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                console.error(err);
                return;
            }
            const query = "select mpcia.CO_PROVINCIA,mpcia.DE_NOMBRE de_provincia,mdep.DE_NOMBRE de_departamento,mpais.DE_NOMBRE de_Pais,mpcia.CO_DEPARTAMENTO,mpcia.CO_PAIS from MA_PCIA_M mpcia join MA_DEPA_M mdep on mpcia.CO_PAIS = mdep.CO_PAIS and mpcia.CO_DEPARTAMENTO = mdep.CO_DEPARTAMENTO join MA_PAIS_M mpais on mpais.CO_PAIS = mdep.CO_PAIS where mpcia.CO_PAIS = :p_pais and mpcia.CO_DEPARTAMENTO = :p_departamento";
            const params = {
                p_pais: { val: pais },
                p_departamento: { val: departamento }
            };
            conn.execute(query, params, responseParams, (error, result) => {
                if(error) {
                    console.error(error);
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderXml(result.rows));
            });
        });
    }
};

module.exports = ma010301Controller;