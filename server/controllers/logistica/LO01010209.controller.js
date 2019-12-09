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
            const query = "select case st_marcar when 'S' then 1 else 0 end,co_periodo,co_producto,initcap(de_producto),co_lote,nu_cant_programada,co_tipo_docu,initcap(de_tipo_docu),co_documento,to_char(fe_documento,'dd-mm-yyyy'),initcap(de_solicitante),initcap(de_tipo_docu_ancestro),initcap(de_documento_ancestro) from table(pack_new_frac_prod.f_lis_docu_frac_node(:p_empresa,:p_almacen,:p_desde,:p_hasta,:p_tinte))";
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
            const query = "select co_global_fracc ID,nu_documentos,de_tinte,initcap(de_almacen),co_periodo,es_estado,initcap(de_usuario_reg),to_char(fe_registro,'dd-mm-yyyy') from table(pack_new_frac_prod.f_lis_glob_frac_m(:p_empresa,:p_periodo))";
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
    },
    ListaDocumentosFraccionamiento: async (request, response) => {
        const { empresa, global } = request.params;
        try {
            const conn = await oracledb.getConnection(dbParams);
            const query = "select co_documento,initcap(de_tipo_doc_administr),to_char(fe_reg_docu,'dd-mm-yyyy'),st_reserva,st_picking,initcap(de_usu_picking),to_char(fe_ini_picking,'dd-mm-yyyy'),to_char(fe_fin_picking,'dd-mm-yyyy'),st_packing,to_char(fe_ini_packing,'dd-mm-yyyy'),to_char(fe_fin_packing,'dd-mm-yyyy'),initcap(de_usus_packing),to_char(fe_reg,'dd-mm-yyyy'),initcap(de_usuario_reg),to_char(fe_upd,'dd-mm-yyyy'),initcap(de_usuario_upd),st_entregado_prod,initcap(de_usu_recep_prod),to_char(fe_usu_recep_prod,'dd-mm-yyyy'),co_glob_fracc from table(pack_new_frac_prod.f_list_glob_frac_docu_m(:p_empresa,:p_global))";
            const params = {
                p_empresa: { val: empresa },
                p_global: { val: global }
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
    GeneraOrdenFraccionamiento: async (request, response) => {
        const { empresa, periodo, usuario, almacen, tinte, cantidad, documentos, tipos, picker } = request.body;
        try {
            const conn = await oracledb.getConnection(dbParams);
            const query = "call pack_new_frac_prod.sp_grabar_glob_frac_docus(:o_resultado,:o_mensaje,:p_empresa,:p_periodo,:p_usuario,:p_almacen,:p_tinte,:p_cantidad,:p_documentos,:p_tiposdoc,:p_picker)";
            const params = {
                o_resultado: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_mensaje: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                p_empresa: { val: empresa },
                p_periodo: { val: periodo },
                p_usuario: { val: usuario },
                p_almacen: { val: almacen },
                p_tinte: { val: tinte },
                p_cantidad: { val: cantidad },
                p_documentos: { val: documentos },
                p_tiposdoc: { val: tipos },
                p_picker: { val: picker }
            };
            const result = await conn.execute(query, params, responseParams);
            const { o_resultado, o_mensaje } = result.outBinds;
            response.json({
                data: {
                    codigo: o_resultado,
                    mensaje: o_mensaje
                }
            });
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