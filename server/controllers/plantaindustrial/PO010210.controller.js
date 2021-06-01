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
        let query = 'select * from table(pack_new_proyecto.f_list_arte_producto_padre(:producto))';
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
    GuardarProyecto: async (request, response) => {
        const { empresa,usuario,alias,objetivo,nombre,descripcion,producto,arte, motivo,fe_ini,fe_fin} = request.body;
        console.log(empresa, usuario,objetivo,nombre,descripcion, producto,arte, motivo,fe_ini,fe_fin); 
        let query = "call pack_new_proyecto.sp_grabar_proyecto(:o_result,:o_deresult,:empresa,:usuario,:alias,:objetivo,:nombre,:descripcion,:producto,:motivo,:arte,:fe_inicio,:fe_fin)";
        let params = [
            { name: 'o_result', io: 'out', type: 'number' },
            { name: 'o_deresult', io: 'out', type: 'string' },
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'usuario', io: 'in', value: usuario },
            { name: 'alias', io: 'in', value: alias },
            { name: 'objetivo', io: 'in', value: objetivo },
            { name: 'nombre', io: 'in', value: nombre },
            { name: 'descripcion', io: 'in', value: descripcion },
            { name: 'producto', io: 'in', value: producto },
            { name: 'motivo', io: 'in', value: motivo },
            { name: 'arte', io: 'in', value: arte },
            { name: 'fe_inicio', io: 'in', value: fe_ini },
            { name: 'fe_fin', io: 'in', value: fe_fin },
        ];
        
        let result = await db.statement(query, params);
        if (result.out.o_result == 0) {
            response.json({
                error: result.out.o_deresult
            });
        }
        else {
            response.json({
                mensaje: result.out.o_deresult
            });
        }
    },
    ListarProyecto: async (request, response) => {
        let query = "select co_proyecto,proyecto,de_descripcion,de_objetivo,'ic-flecha.svg^Ver',co_catalogo_producto,producto,fe_vigencia_inicio,fe_vigencia_fin,es_vigencia,de_razon_social,fe_registra from table (pack_new_proyecto.f_list_proyectos_pendientes())";
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
    serieProyecto: async (request, response) => {
        const { empresa } = request.body;
        let query, params, result;
        query = "select de_serie||'-202104'||to_char(nu_cantidad) as serie from CO_SERI_NVO where co_empresa = :empresa and co_tipo_doc_administr = '662' and es_vigencia= 'Vigente'";
        params = [
            { name: 'empresa', value: empresa }
        ];
        result = await db.select(query, params);
        let serie = result.rows;
        return response.json({
            data: {
                serie: serie,
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
    ListarProdVinculados: async (request, response) => {
        const { producto } = request.params;
        let query = "select co_catalogo_producto,de_nombre,de_estado from table (pack_new_proyecto.f_list_dependencias(:producto))";
        let params = [
            { name: 'producto', value: producto }
        ];
        let result = await db.select(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderXml(result.rows));
    },
    ListarDocumentos: async (request, response) => {
        const { producto } = request.params; 
        let query = "select id_seq,de_archivo,de_fecha,de_estado,de_usuario_asig,de_observacione,de_cerrado from table ( pack_new_proyecto.F_LIST_SEGUIMIENTO(:producto))";
        let params = [
            { name: 'producto', value: producto }
        ];
        let result = await db.select(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderXml(result.rows));
    },
    ListarEntidad: async (request, response) => {
        const { codigo } = request.params;
        let query = "select co_catalogo_entidad,de_razon_social from table (pack_new_requ_prod.f_list_cata_enti(:codigo))";
        let params = [
            { name: 'codigo', value: codigo }
        ];
        let result = await db.select(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderXml(result.rows));
    },
    Guardarusuarios: async (request, response) => {
        const {empresa,co_proy,usuario,cant_filas} = request.body;
        console.log(empresa,co_proy,usuario,cant_filas); 
        let query = "call pack_new_proyecto.sp_grabar_usuario_proyecto(:o_result,:o_deresult,:empresa,:co_proy,:usuario,:cant_filas)";
        let params = [
            { name: 'o_result', io: 'out', type: 'number' },
            { name: 'o_deresult', io: 'out', type: 'string' },
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'co_proy', io: 'in', value: co_proy },
            { name: 'usuario', io: 'in', value: usuario },
            { name: 'cant_filas', io: 'in', value: cant_filas },
        ];
        
        let result = await db.statement(query, params);
        if (result.out.o_result == 0) {
            response.json({
                error: result.out.o_deresult
            });
        }
        else {
            response.json({
                mensaje: result.out.o_deresult
            });
        }
    },
    ListarUsuariosAsignado: async (request, response) => {
        const { proyecto } = request.params;
        let query = "select co_catalogo_entidad,de_razon_Social,de_estado from table(pack_new_proyecto.F_LIST_USUARIOS(:proyecto))";
        let params = [
            { name: 'proyecto', value: proyecto }
        ];
        let result = await db.select(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderXml(result.rows));
    },
    MostrardetalleProyecto: async (request, response) => {
        const { proyecto } = request.params;
        let query = "select co_proyecto,proyecto,de_descripcion,de_objetivo,co_catalogo_producto,producto,fe_vigencia_inicio,fe_vigencia_fin,es_vigencia,de_razon_social,fe_registra from table (pack_new_proyecto.f_list_proyectos_pendientes()) where co_proyecto =:proyecto";
        let params = [
            { name: 'proyecto', value: proyecto }
        ];
        let result = await db.select(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderXml(result.rows));
    },
    ComboUsuarios: async (request, response) => {
        const { proyecto } = request.params;
        console.log(proyecto);
        let query = "select co_catalogo_entidad as value,de_razon_Social as label from table(pack_new_proyecto.F_LIST_USUARIOS(:proyecto)) where de_estado = 'Vigente'";
        let params = [
            { name: 'proyecto', value: proyecto }
        ];
        let result = await db.select(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderComboGrid(result.rows,0));
    },
    Guardardocumento: async (request, response) => {
        const {empresa,co_proy,usuario,cadena_docu,cadena_asignada,cadena_observ,cadena_cerrado,cadena_reasignado,cant_filas,cadena_idseq} = request.body;
        console.log(empresa,co_proy,usuario,cant_filas); 
        let query = "call pack_new_proyecto.sp_grabar_documento(:o_result,:o_deresult,:empresa,:co_proy,:usuario,:cadena_docu,:cadena_asignada,:cadena_observ,:cadena_cerrado,:cadena_reasignado,:cant_filas,:cadena_idseq)";
        let params = [
            { name: 'o_result', io: 'out', type: 'number' },
            { name: 'o_deresult', io: 'out', type: 'string' },
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'co_proy', io: 'in', value: co_proy },
            { name: 'usuario', io: 'in', value: usuario },
            { name: 'cadena_docu', io: 'in', value: cadena_docu },
            { name: 'cadena_asignada', io: 'in', value: cadena_asignada },
            { name: 'cadena_observ', io: 'in', value: cadena_observ },
            { name: 'cadena_cerrado', io: 'in', value: cadena_cerrado },
            { name: 'cadena_reasignado', io: 'in', value: cadena_reasignado },
            { name: 'cant_filas', io: 'in', value: cant_filas },
            { name: 'cadena_idseq', io: 'in', value: cadena_idseq },
        ];
        
        let result = await db.statement(query, params);
        if (result.out.o_result == 0) {
            response.json({
                error: result.out.o_deresult
            });
        }
        else {
            response.json({
                mensaje: result.out.o_deresult
            });
        }
    },
};

module.exports = po010210Controller;