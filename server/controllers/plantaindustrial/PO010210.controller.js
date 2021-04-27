const xmlParser = require('./../../xml-parser');
const db = require('./../../libs/db-oracle');
const { resultSet } = require('./../../libs/db-oracle');
const { response } = require('express');

const po010210Controller = {

    ListaProductos: async (request, response) => {
        const { buscar } = request.params;
        let query = "select co_producto,de_nombre,de_marca,de_submarca from table (pack_new_especificacion.f_list_prod_por_grupo_prod(5,:buscar))";
        let params = [
            { name: 'buscar', value: buscar },
        ];
        let result = await db.select(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderXml(result.rows));
    },
    FormularioProductohijo: async (request, response) => {
        const { producto } = request.body;
        let query, params, result;
        query = "select co_producto,de_nombre_producto,co_codigo_ean14,co_codigo_arte from table(pack_new_direccion_tecn.f_list_arte_producto_hijo(:producto))";
        params = [
            { name: 'producto', value: producto }
        ];
        result = await db.select(query, params);
        let detalleprod = result.rows;
        return response.json({
            data: {
                detalleprod: detalleprod,
            }
        });
    },
    ListaProductopadre: async (request, response) => {
        const { producto } = request.params;
        let query = 'select * from table(pack_new_direccion_tecn.f_list_arte_producto_padre(:producto))';
        let params = [
            { name: 'producto', value: producto },
        ];
        let result = await db.select(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderXml(result.rows));
    },
    SubirAdjunto: async (request, response) => {
        const { producto,usuario } = request.body;
        let query, params, result;
        query = "select pack_new_attached.f_get_url_updload_new_v2(11,19,20123487541,'601',:producto,'ESPECPROD',19,:usuario,'ETME-11_1') as URL from dual";
        params = [
            { name: 'producto', value: producto },
            { name: 'usuario', value: usuario }
        ];
        result = await db.select(query, params);
        let url = result.rows;
        return response.json({
            data: {
                url: url,
            }
        });
    },
    GuardarcambioArte: async (request, response) => {
        const { empresa, usuario, producto,arte, motivo,fe_ini,fe_fin} = request.body;
        console.log(empresa, usuario, producto,arte, motivo,fe_ini,fe_fin);
        let query = "call pack_new_direccion_tecn.sp_grabar_artes(:o_result,:o_deresult,:empresa,:usuario,:producto,:motivo,:arte,:fe_inicio,:fe_fin)";
        
        let params = [
            { name: 'o_result', io: 'out', type: 'number' },
            { name: 'o_deresult', io: 'out', type: 'string' },
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'usuario', io: 'in', value: usuario },
            { name: 'producto', io: 'in', value: producto },
            { name: 'arte', io: 'in', value: arte },
            { name: 'motivo', io: 'in', value: motivo },
            { name: 'fe_inicio', io: 'in', value: fe_ini },
            { name: 'fe_fin', io: 'in', value: fe_fin },
        ];
        let result = await db.statement(query, params);
        if (result.o_result == 0) {
            return response.json({
                state: 'error',
                error: result.o_deresult
            });
        }
        else return response.json({
            state: 'success',
            mensaje: result.o_deresult
        });
    },
    ListaArtespendiente: async (request, response) => {
        let query = "select * from table (pack_new_direccion_tecn.f_list_artes_pendientes())";
        let params = [
        ];
        let result = await db.select(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderXml(result.rows));
    },
    verimgProducto: async (request, response) => {
        const { producto } = request.body;
        let query, params, result;
        query = "select bl_imagen as URL from ma_cata_prod_m_img  where co_catalogo_producto = :producto and co_vista_imagen =2";
        params = [
            { name: 'producto', value: producto }
        ];
        result = await db.select(query, params);
        let url = result.rows;
        return response.json({
            data: {
                url: url,
            }
        });
    },
    ListarOrdencompra: async (request, response) => {
        const { producto } = request.params;
        let query = "select co_orden_compra, co_catalogo_producto,nu_cantidad,im_precio_total,im_precio_unitario,nu_entregado,co_codigo_arte from lo_orde_comp_d where co_catalogo_producto = :producto and co_empresa=11 and es_vigencia = 'Vigente'";
        let params = [
            { name: 'producto', value: producto }
        ];
        let result = await db.select(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderXml(result.rows));
    },
};

module.exports = po010210Controller;