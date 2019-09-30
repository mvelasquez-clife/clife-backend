const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');

const responseParams = {
    outFormat: oracledb.OBJECT
};

const lo01010209Controller = {
    
    ListaAlmacenes: async (request, response) => {
        const { empresa } = request.params;
        try {
            const conn = await oracledb.getConnection(dbParams);
            const query = "select co_almacen \"value\",de_almacen \"text\" from table(pack_new_frac_prod.f_lis_frac_alma(:p_empresa))";
            const params = {
                p_empresa: { val: empresa }
            };
            const result = await conn.execute(query, params, responseParams);
            conn.close();
            response.json({
                options: result.rows
            });
        }
        catch (err) {
            console.error(err);
            response.json({
                error: err
            });
        }
    },
    BuscarDocumentosFraccionar: async (request, response) => {
        const { empresa,almacen,fdesde,fhasta,tintes } = request.params;
        let sdesde = fdesde.replace(/-/g,'');
        let shasta = fhasta.replace(/-/g,'');
        try {
            const conn = await oracledb.getConnection(dbParams);
            const query = "select case st_marcar when 'S' then 1 else 0 end,co_periodo,co_producto,de_producto,co_lote,nu_cant_programada,co_tipo_docu,de_tipo_docu,co_documento,to_char(fe_documento,'dd-mm-yyyy'),de_solicitante,de_tipo_docu_ancestro,de_documento_ancestro from table(pack_new_frac_prod.f_lis_docu_frac_node(:p_empresa,:p_almacen,:p_desde,:p_hasta,:p_tinte))";
            const params = {
                p_empresa: { val: empresa },
                p_almacen: { val: almacen },
                p_desde: { val: sdesde },
                p_hasta: { val: shasta },
                p_tinte: { val: tintes }
            };
            const result = await conn.execute(query, params, responseParams);
            conn.close();
            response.set('Content-Type', 'text/xml');
            response.send(xmlParser.renderXml(result.rows));
        }
        catch (err) {
            console.error(err);
            response.json({
                error: err
            });
        }
    },
    ListaPeriodos: async (request, response) => {
        const { empresa } = request.params;
        try {
            const conn = await oracledb.getConnection(dbParams);
            const query = "select co_periodo \"value\",de_periodo \"text\" from table(pack_new_frac_prod.f_lis_frac_peri(:p_empresa)) where fe_dia_ini < sysdate order by co_periodo desc";
            const params = {
                p_empresa: { val: empresa }
            };
            const result = await conn.execute(query, params, responseParams);
            conn.close();
            response.json({
                options: result.rows
            });
        }
        catch (err) {
            console.error(err);
            response.json({
                error: err
            });
        }
    },
    ListaGlobalFraccionamientos: async (request, response) => {
        const { empresa, periodo } = request.params;
        try {
            const conn = await oracledb.getConnection(dbParams);
            const query = "select co_global_fracc,nu_documentos,de_tinte,de_almacen,co_periodo,es_estado,de_usuario_reg,to_char(fe_registro,'dd-mm-yyyy') from table(pack_new_frac_prod.f_lis_glob_frac_m(:p_empresa,:p_periodo))";
            const params = {
                p_empresa: { val: empresa },
                p_periodo: { val: periodo }
            };
            const result = await conn.execute(query, params, responseParams);
            conn.close();
            response.set('Content-Type', 'text/xml');
            response.send(xmlParser.renderXml(result.rows));
        }
        catch (err) {
            console.error(err);
            response.json({
                error: err
            });
        }
    }
};

module.exports = lo01010209Controller;