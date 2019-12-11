const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');

const responseParams = {
    outFormat: oracledb.OBJECT
};

const lo01010210Controller = {

    ListaGlobalesFraccionamiento: async (request, response) => {
        const { empresa, usuario, codigo } = request.params;
        try {
            const conn = await oracledb.getConnection(dbParams);
            const query = "select de_tipo_docu,co_producto,initcap(de_producto),co_documento,nu_restante,co_glob_fracc,co_tipo_docu from table(pack_new_frac_prod.f_lis_glob_frac_docu_pr(:p_empresa,:p_usuario,:p_codbarras))";
            const params = {
                p_empresa: { val: empresa },
                p_usuario: { val: usuario },
                p_codbarras: { val: codigo }
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
    ListaFraccionamientoLote: async (request, response) => {
        const { empresa, usuario, global, documento, tipodoc, producto } = request.params;
        try {
            const conn = await oracledb.getConnection(dbParams);
            const query = "select id_fr_dc_lt_ub ID,co_lote,de_ubicacion,de_unidad_medida,nu_cantidad from table(pack_new_frac_prod.f_list_glob_frac_dc_lt_ub(:p_empresa,:p_usuario,:p_global,:p_documento,:p_tpdoc,:p_producto))";
            const params = {
                p_empresa: { val: empresa },
                p_usuario: { val: usuario },
                p_global: { val: global },
                p_documento: { val: documento },
                p_tpdoc: { val: tipodoc },
                p_producto: { val: producto }
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
    ComboGlobales: async (request, response) => {
        const { empresa } = request.params;
        try {
            const conn = await oracledb.getConnection(dbParams);
            const query = "select co_global_fracc \"value\",co_global_fracc \"text\" from table(pack_new_frac_prod.f_lis_glob_frac_pend(:p_empresa))";
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
        //
    },
    ComboTaras: async (request, response) => {
        const { producto } = request.params;
        try {
            const conn = await oracledb.getConnection(dbParams);
            const query = "select co_tipo_unidad_carga \"value\",de_tipo_unidad_carga \"text\" from table(pack_new_frac_prod .f_lis_glob_frac_taras(:p_producto))";
            const params = {
                p_producto: { val: producto }
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
    CargaCodigoProducto: async (request, response) => {
        const { empresa, global, producto } = request.body;
        try {
            const conn = await oracledb.getConnection(dbParams);
            const query = "select pack_new_frac_prod.f_get_docu_prod_glob_fracc(:p_empresa,:p_global,:p_producto) \"codigo\" from dual";
            const params = {
                p_empresa: { val: empresa },
                p_global: { val: global },
                p_producto: { val: producto }
            };
            const result = await conn.execute(query, params, responseParams);
            conn.close();
            response.json({
                data: { codigo: parseFloat(result.rows[0].codigo) }
            });
        }
        catch (err) {
            console.error(err);
            response.json({
                error: err
            });
        }
    },
    PesoTara: async (request, response) => {
        const { tara } = request.body;
        try {
            const conn = await oracledb.getConnection(dbParams);
            const query = "select pack_new_frac_prod.f_get_peso_tara_kg(:p_tara) peso from dual";
            const params = {
                p_tara: { val: tara }
            };
            const result = await conn.execute(query, params, responseParams);
            conn.close();
            response.json({
                data: { peso: parseFloat(result.rows[0].PESO) }
            });
        }
        catch (err) {
            console.error(err);
            response.json({
                error: err
            });
        }
    },
    DetalleGridBultosProd: async (request, response) => {
        const { empresa, usuario, codigo } = request.params;
        try {
            const conn = await oracledb.getConnection(dbParams);
            const query = "select case st_marcar when 'S' then 1 else 0 end,de_tipo_docu,co_documento,nu_bulto,de_tara,co_producto,de_producto,co_lote,de_ubicacion,case st_completo when 'OK' then 1 else 0 end from table(pack_new_frac_prod.f_lis_glob_frac_blt_d_x_prod(:p_empresa,:p_usuario,:p_codigo))";
            const params = {
                p_empresa: { val: empresa },
                p_usuario: { val: usuario },
                p_codigo: { val: codigo }
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
    DetalleGridBultosSup: async (request, response) => {
        const { empresa, usuario, codigo } = request.params;
        try {
            const conn = await oracledb.getConnection(dbParams);
            const query = "select case st_marcar when 'S' then 1 else 0 end,de_tipo_docu,co_documento,case st_ok when 'S' then 'ic-checked.gif^' else 'ic-unchecked.gif^' end,case st_packing when 'S' then 'ic-checked.gif^' else 'ic-unchecked.gif^' end,fe_ini_packing,fe_fin_packing,de_usus_packing,case st_entregado_prod when 'S' then 'ic-checked.gif^' else 'ic-unchecked.gif^' end,de_usu_recep_prod,fe_usu_recep_prod,co_glob_fracc,co_tipo_docu from table(pack_new_frac_prod.f_lis_glob_frac_blt_d_x_sup(:p_empresa,:p_usuario,:p_codigo))";
            const params = {
                p_empresa: { val: empresa },
                p_usuario: { val: usuario },
                p_codigo: { val: codigo }
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
    RegistraPesoTaraProducto: async (request, response) => {
        const { empresa,usuario,global,documento,tipodoc,cotara,producto,pesotara,pesoinsumo,lote,ubicacion } = request.body;
        let pinsumo = pesoinsumo - pesotara;
        try {
            const conn = await oracledb.getConnection(dbParams);
            const query = "call pack_new_frac_prod.sp_grabar_peso_tara_prod(:o_codigo,:o_respuesta,:p_empresa,:p_usuario,:p_global,:p_documento,:p_tpdoc,:p_tara,:p_producto,:p_pesotara,:p_pesoinsumo,:p_lote,:p_ubicacion)";
            const params = {
                o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_respuesta: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                p_empresa: { val: empresa },
                p_usuario: { val: usuario },
                p_global: { val: global },
                p_documento: { val: documento },
                p_tpdoc: { val: tipodoc },
                p_tara: { val: cotara },
                p_producto: { val: producto },
                p_pesotara: { val: pesotara },
                p_pesoinsumo: { val: pinsumo },
                p_lote: { val: lote },
                p_ubicacion: { val: ubicacion }
            };
            const result = await conn.execute(query, params, responseParams);
            const { o_codigo, o_respuesta } = result.outBinds;
            response.json({
                data: {
                    codigo: o_codigo,
                    mensaje: o_respuesta
                }
            });
        }
        catch (err) {
            console.error(err);
            response.json({
                error: err
            });
        }
    },
    FraccionamientoCompleto: async (request, response) => {
        const { empresa, usuario, global, tipos, documentos, cantidad } = request.body;
        try {
            const conn = await oracledb.getConnection(dbParams);
            const query = "call pack_new_frac_prod.sp_frac_ok_x_docu(:o_codigo,:o_respuesta,:p_empresa,:p_usuario,:p_global,:p_tipos,:p_documentos,:p_cantidad)";
            const params = {
                o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_respuesta: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                p_empresa: { val: empresa },
                p_usuario: { val: usuario },
                p_global: { val: global },
                p_tipos: { val: tipos },
                p_documentos: { val: documentos },
                p_cantidad: { val: cantidad }
            };
            const result = await conn.execute(query, params, responseParams);
            const { o_codigo, o_respuesta } = result.outBinds;
            response.json({
                data: {
                    codigo: o_codigo,
                    mensaje: o_respuesta
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

module.exports = lo01010210Controller;