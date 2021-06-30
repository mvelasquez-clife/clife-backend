const xmlParser = require('./../../xml-parser');
const db = require('./../../libs/db-oracle');
const { resultSet } = require('./../../libs/db-oracle');
const { response } = require('express');
const path = require('path');
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
        // response.send(xmlParser.renderXml(result.rows));
        response.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{ CO_CATALOGO_PRODUCTO: 'No se encontraron sustitutos' }]));
   
    },
    GuardarProyecto: async (request, response) => {
        const { empresa,usuario,alias,objetivo,nombre,descripcion,producto,arte, motivo,fe_ini,fe_fin} = request.body;
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
        let query = "select co_proyecto,proyecto,de_descripcion,de_actividad,de_responsable_actual,'ic-flecha.svg^Ver',de_objetivo,fe_vigencia_inicio,fe_vigencia_fin,es_vigencia,co_catalogo_producto,producto,de_razon_social,fe_registra from table (pack_new_proyecto.f_list_proyectos_pendientes()) where es_vigencia<>'Terminado'";
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
    serieActividad: async (request, response) => {
        const { proyecto } = request.body;
        let query, params, result;
        query = "select count(distinct co_actividad) as seriea from po_regi_proy_seg where CO_PROYECTO = :proyecto";
        params = [
            { name: 'proyecto', value: proyecto }
        ];
        result = await db.select(query, params);
        let seriea = result.rows;
        return response.json({
            data: {
                seriea: seriea,
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
        const { proyecto } = request.params; 
        let query = "select 0,id_seq,substrb(de_archivo,20,length(de_archivo)) de_nombre,de_fecha,de_usuario_reg from table(pack_new_proyecto.f_list_documentos(:proyecto))";
        let params = [
            { name: 'proyecto', value: proyecto }
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
        const {empresa,usuario,co_proy,cad_usuario,cant_filas,accion} = request.body;
        let query = "call pack_new_proyecto.sp_grabar_usuario_proyecto(:o_result,:o_deresult,:empresa,:usuario,:co_proy,:cad_usuario,:cant_filas,:accion)";
        let params = [
            { name: 'o_result', io: 'out', type: 'number' },
            { name: 'o_deresult', io: 'out', type: 'string' },
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'usuario', io: 'in', value: usuario },
            { name: 'co_proy', io: 'in', value: co_proy },
            { name: 'cad_usuario', io: 'in', value: cad_usuario },
            { name: 'cant_filas', io: 'in', value: cant_filas },
            { name: 'accion', io: 'in', value: accion },
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
        let query = "select co_proyecto,proyecto,de_descripcion,de_objetivo,co_catalogo_producto,producto,fe_vigencia_inicio,fe_vigencia_fin,es_vigencia,de_razon_social,fe_registra from table (pack_new_proyecto.f_list_proyectos_pendientes()) where co_proyecto =:proyecto and rownum=1";
        let params = [
            { name: 'proyecto', value: proyecto }
        ];
        let result = await db.select(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderXml(result.rows));
    },
    ComboUsuarios: async (request, response) => {
        const { proyecto } = request.body;
        let query = "select co_catalogo_entidad \"value\",de_razon_Social \"text\" from table(pack_new_proyecto.F_LIST_USUARIOS(:proyecto)) where de_estado = 'Vigente'";
        let params = [
            { name: 'proyecto', value: proyecto }
        ];
        let result = await db.select(query, params);
        if (result.rows.length > 0) {
            response.json({
                state: 'success',
                data: {
                    usuario: result.rows
                }   
            });     
        }
    },
    ComboEstado: async (request, response) => {
        const {} = request.params;
        let query = "select co_estado as value,de_estado as label from po_regi_proy_sta where es_vigencia = 'Vigente'";
        let params = [
        ];
        let result = await db.select(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderSelect(result.rows, '1'));
    },
    Guardardocumento: async (request, response) => {
        const {empresa,co_proy,usuario,cadena_docu,cadena_asignada,cadena_observ,cadena_cerrado,cadena_reasignado,cant_filas,cadena_idseq} = request.body;
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
    Subiradjunto: async (request, response) => {
        const {empresa,entidad,producto,tipo_doc,doc,usuario,proyecto} = request.body;
        let query = "select pack_new_attached.f_get_url_updload_new_v2(:empresa,:entidad,:producto,:tipo_doc,:producto,:doc,:entidad,:usuario,:proyecto) as URL from dual";
        let params = [
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'entidad', io: 'in', value: entidad },
            { name: 'producto', io: 'in', value: producto },
            { name: 'tipo_doc', io: 'in', value: tipo_doc },
            { name: 'doc', io: 'in', value: doc },
            { name: 'usuario', io: 'in', value: usuario },
            { name: 'proyecto', io: 'in', value: proyecto },
        ];
        
        let result = await db.select(query, params);      
        var url;
        for(var i in result.rows) {
            url = result.rows[i];                 
        } 
        
        if(url) {                   
            response.json({
                state: 'success',
                data: {
                    url_adj: url
                }                      
            
            });
        }
        else {
            response.json({
                state: 'error',
                message: 'Sin registro'
            });
        }
    },
    Guardactividad: async (request, response) => {
        const {empresa,proyecto,accion,actividad,usuario,asignado,estado,descripcion,nombre,var_actividad,actividad_ant,estado_ant,subtarea} = request.body;
        let query = "call pack_new_proyecto.sp_grabar_actividad(:o_result,:o_deresult,:empresa,:proyecto,:accion,:actividad,:usuario,:asignado,:estado,:descripcion,:nombre,:var_actividad,:actividad_ant,:estado_ant,:subtarea)";
        let params = [
            { name: 'o_result', io: 'out', type: 'number' },
            { name: 'o_deresult', io: 'out', type: 'string' },
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'proyecto', io: 'in', value: proyecto },
            { name: 'accion', io: 'in', value: accion },
            { name: 'actividad', io: 'in', value: actividad },
            { name: 'usuario', io: 'in', value: usuario },
            { name: 'asignado', io: 'in', value: asignado },
            { name: 'estado', io: 'in', value: estado },
            { name: 'descripcion', io: 'in', value: descripcion },
            { name: 'nombre', io: 'in', value: nombre },
            { name: 'var_actividad', io: 'in', value: var_actividad },
            { name: 'actividad_ant', io: 'in', value: actividad_ant },
            { name: 'estado_ant', io: 'in', value: estado_ant },
            { name: 'subtarea', io: 'in', value: subtarea },
        ];
        
        let result = await db.statement(query, params);
        if (result.out.o_result == 0) {
            response.json({
                state: 'error',
                error: result.out.o_deresult
            });
        }
        else {
            response.json({
                state: 'success',
                mensaje: result.out.o_deresult
            });
        }
    },    
    ListarActividades: async (request, response) => {
        const { proyecto } = request.params; 
        let query = "select co_actividad||'/:'||de_nombre asunto,co_proyecto,co_subtarea,co_actividad,de_nombre,de_observaciones,de_usuario_asig,de_estado,de_usuario_registra,de_fecha from table(pack_new_proyecto.f_list_seguimiento(:proyecto))";
        let params = [
            { name: 'proyecto', value: proyecto}
        ];
        let result = await db.select(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderXml(result.rows));
    },    
    ListarActdocumento: async (request, response) => {
        const { proyecto,actividad } = request.params; 
        let query = "select 'ic-report.png^Ver documento',id_seq,de_nombre,de_usuario_asig,de_estado,de_fecha,co_catalogo_entidad,de_nombre_fichero from table(pack_new_proyecto.f_list_seguimiento_documentos(:proyecto,:actividad))";
        let params = [
            { name: 'proyecto', value: proyecto },
            { name: 'actividad', value: actividad}
        ];
        let result = await db.select(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderXml(result.rows));
    },
    AvisopendRevisar: async (request, response) => {
        const { usuario } = request.body;
        let query, params, result;
        query = "select count(1) respuesta from po_regi_proy_seg where co_asignado = :usuario and de_estado = 'Pendiente'";
        params = [
            { name: 'usuario', value: usuario }
        ];
        result = await db.select(query, params);
        let respuesta = result.rows;
        return response.json({
            data: {
                respuesta: respuesta,
            }
        });
    }, 
    AvisonoUsuario: async (request, response) => {
        const { usuario,empresa,co_proy } = request.body;
        let query, params, result;
        query = "select count(1) respuesta from po_regi_proy_usua where co_proyecto =:co_proy  and co_empresa =:empresa and co_catalogo_entidad not in (:usuario) and de_estado ='Vigente'";
        params = [
            { name: 'co_proy', value: co_proy },
            { name: 'empresa', value: empresa },
            { name: 'usuario', value: usuario }
        ];
        result = await db.select(query, params);
        let respuesta = result.rows;
        return response.json({
            data: {
                respuesta: respuesta,
            }
        });
    }, 
    ListarFormula: async (request, response) => {
        const { empresa,producto } = request.params; 
        let query = "select co_tipo_proc_glob,co_producto,de_prodcucto,stock,co_tipo_prod,co_grupo_prod from table(pack_new_formulacion.f_list_form_det_traz_V2(:empresa,:producto))";
        let params = [
            { name: 'empresa', value: empresa },
            { name: 'producto', value: producto }
        ];
        let result = await db.select(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderXml(result.rows));
    },
    PruebaMail: async (request, response) => {
        const { asunto,nomproyecto,nombre,desc } = request.body;
        const nodemailer = require('nodemailer');
        const ejs = require('ejs');
        const transport = nodemailer.createTransport({            
                service: 'Gmail',
                auth: {
                    user: 'huayta.susy18@gmail.com',
                    pass: 'ioqulpjdzhsjxznd'
                }
        });
        const data = {
            nomproyecto: nomproyecto,
            nombre: nombre,
            desc: desc
        };
        const html = await ejs.renderFile(path.resolve('client/views/modulos/plantaindustrial/PO010210-mail.ejs'), data);
        const message = {
            from: 'bi_sistemas@corporacionlife.com.pe',
            to: 'analista.programador@corporacionlife.com.pe',
            subject: asunto,
            html: html
        };
        transport.sendMail(message, function(err, info) {
            if (err) {
                response.send('no se pudo enviar el mail');
                return;
            }
            response.send('Se envió el correo!');
        });
    },
    SetActividad: async (request, response) => {
        const {empresa,proyecto,accion,actividad,usuario,item} = request.body;   
        let query = "call pack_new_proyecto.sp_abrir_actividad(:o_result,:o_deresult,:empresa,:proyecto,:accion,:actividad,:usuario,:item)";
        let params = [
            { name: 'o_result', io: 'out', type: 'number' },
            { name: 'o_deresult', io: 'out', type: 'string' },
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'proyecto', io: 'in', value: proyecto },
            { name: 'accion', io: 'in', value: accion },
            { name: 'actividad', io: 'in', value: actividad },
            { name: 'usuario', io: 'in', value: usuario },
            { name: 'item', io: 'in', value: item },
        ];
        
        let result = await db.statement(query, params);
        if (result.out.o_result == 0) {
            response.json({
                state: 'error',
                error: result.out.o_deresult
            });
        }
        else {
            response.json({
                state: 'success',
                mensaje: result.out.o_deresult
            });
        }
    },   
    CerrarProyecto: async (request, response) => {
        const {empresa,proyecto,usuario} = request.body;   
        let query = "call pack_new_proyecto.sp_cerrar_proyecto(:o_result,:o_deresult,:empresa,:proyecto,:usuario)";
        let params = [
            { name: 'o_result', io: 'out', type: 'number' },
            { name: 'o_deresult', io: 'out', type: 'string' },
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'proyecto', io: 'in', value: proyecto },
            { name: 'usuario', io: 'in', value: usuario },
        ];
        
        let result = await db.statement(query, params);
        if (result.out.o_result == 0) {
            response.json({
                state: 'error',
                error: result.out.o_deresult
            });
        }
        else {
            response.json({
                state: 'success',
                mensaje: result.out.o_deresult
            });
        }
    },         
    ListarProyectoterminado: async (request, response) => {
        let query = "select co_proyecto,proyecto,de_descripcion,de_razon_social,'ic-flecha.svg^Ver',de_objetivo,fe_vigencia_inicio,fe_vigencia_fin,es_vigencia,co_catalogo_producto,producto,fe_registra from table (pack_new_proyecto.f_list_proyectos_terminado())";
        let params = [
        ];
        let result = await db.select(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderXml(result.rows));
    },
    ListarActividadesfin: async (request, response) => {
        const { proyecto } = request.params; 
        let query = "select co_actividad||'/:'||de_nombre asunto,co_proyecto,co_subtarea,co_actividad,de_nombre,de_observaciones,nu_dias,de_usuario_asig,de_estado,de_usuario_registra,de_fecha from table(pack_new_proyecto.f_list_seguimiento_terminado(:proyecto))";
        let params = [
            { name: 'proyecto', value: proyecto}
        ];
        let result = await db.select(query, params);
        response.set('Content-Type', 'text/xml');
        response.send(xmlParser.renderXml(result.rows));
    },   
};

module.exports = po010210Controller;