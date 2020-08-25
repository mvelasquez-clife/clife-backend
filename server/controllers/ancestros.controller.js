const oracledb = require('oracledb');
const dbParams = require('../database');
const xmlParser = require('../xml-parser');

const responseParams = {
    outFormat: oracledb.OBJECT
};

const ancestroController = {
    cargaDatosVentanaSeguridad: (req, res) => {
        const { id, empresa, usuario } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                console.error(err);
                return;
            }
            const query = "call pack_new_seguridad.sp_tabla_sist_m_param_return(:p_tabla,:p_usuario,:p_empresa,:o_titulo,:o_distabla,:o_disusuario)";
            const params = {
                p_tabla: { val: id },
                p_usuario: { val: usuario },
                p_empresa: { val: empresa },
                o_titulo: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                o_distabla: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                o_disusuario: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            };
            conn.execute(query, params, responseParams, (error, result) => {
                if(error) {
                    conn.close();
                    res.json({
                        state: 'error',
                        message: error.Error
                    });
                    return;
                }
                const { o_titulo, o_distabla, o_disusuario } = result.outBinds;
                res.json({
                    state: 'success',
                    data: {
                        titulo: o_titulo,
                        distabla: o_distabla,
                        disusuario: o_disusuario
                    }
                });
            });
        });
    },

    getGridPruebaData: async (req, res) => {
        const { id, empresa, param } = req.params;
        let iparam = parseInt(id);
        if (iparam > 2000) { // usar el nuevo conector
            const db = require('./../libs/db-oracle');
            let params, result, split;
            switch (iparam) {
                case 2001:
                    params = [
                        { name: 'p_alias', io: 'in', value: param },
                        { name: 'rs', io: 'out', type: 'cursor' }
                    ];
                    result = await db.resultSet('call pack_new_conta_voucher.sp_busca_cuenta(:p_alias,:rs)', params);
                    res.set('Content-Type', 'text/xml');
                    res.send(xmlParser.renderXml(result.rs));
                    break;
                case 2002:
                    params = [
                        { name: 'empresa', io: 'in', value: empresa },
                        { name: 'tpentidad', io: 'in', value: param }
                    ];
                    result = await db.select('select 0,ma_cata_enti_m.co_catalogo_entidad,ma_cata_enti_m.de_razon_social,ma_cata_enti_m.de_nombre_comercial,ma_clas_enti_m.fe_sys,ma_clas_enti_m.es_vigencia,ma_tipo_enti_m.de_nombre,ma_clas_enti_m.co_clasificacion_entidad from ma_clas_enti_m join ma_tipo_enti_m on ma_tipo_enti_m.co_tipo_entidad = ma_clas_enti_m.co_tipo_entidad join ma_cata_enti_m on ma_cata_enti_m.co_catalogo_entidad = ma_clas_enti_m.co_catalogo_entidad where ma_clas_enti_m.co_empresa = :empresa and ma_clas_enti_m.co_tipo_entidad = :tpentidad', params);
                    res.set('Content-Type', 'text/xml');
                    res.send(xmlParser.renderXml(result.rows));
                    break;
                case 2003:
                case 2004:
                case 2005:
                case 2006:
                    split = param.split('|');
                    params = [
                        { name: 'opcion', io: 'in', value: split[0] },
                        { name: 'empresa', io: 'in', value: empresa },
                        { name: 'param', io: 'in', value: split[1] }
                    ];
                    result = await db.select('select * from table (pack_new_sources.f_list_lupa_general(:opcion,:empresa,:param))', params);
                    res.set('Content-Type', 'text/xml');
                    res.send(xmlParser.renderXml(result.rows));
                    break;
            }
        }
        else {
            oracledb.getConnection(dbParams, (err, conn) => {
                if (err) {
                    res.json({
                        state: 'error',
                        message: err.stack
                    });
                    return;
                }
                let query = "select * from table (pack_new_sources.f_list_lupa_general(:p_id, :p_empresa, :p_extra)) order by de_descripcion asc";
                let params = {
                    p_id: { val: id },
                    p_empresa: { val: empresa },
                    p_extra: { val: param ? param : '' }
                };
                if (iparam > 1000) {
                    switch (iparam) {
                        case 1001:
                            query = "select 0,co_operario,de_operario,de_tipo_operario,es_vigencia from table(pack_new_frac_prod.f_lis_frac_oper_picking(:p_empresa))";
                            params = {
                                p_empresa: { val: empresa }
                            };
                            break;
                    }
                }
                conn.execute(query, params, responseParams, (error, result) => {
                    if (error) {
                        conn.close();
                        res.json({
                            state: 'error',
                            message: error.stack
                        });
                        return;
                    }
                    res.set('Content-Type', 'text/xml');
                    res.send(xmlParser.renderXml(result.rows));
                });
            });
        }
    },

    validarClave: (req, res) => {
        const { alias, empresa, tabla, clave } = req.body;
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                console.error(err);
                return;
            }
            const query = "call PACK_NEW_SEGURIDAD.Sp_ValidarAutorizacion (:p_alias, :p_empresa, :p_tabla, :p_clave, :o_resultado)";
            const params = {
                p_alias: { val: alias },
                p_empresa: { val: empresa },
                p_tabla: { val: tabla },
                p_clave: { val: clave },
                o_resultado: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            };
            conn.execute(query, params, responseParams, (error, result) => {
                if(error) {
                    conn.close();
                    res.json({
                        state: 'error',
                        message: error
                    });
                    return;
                }
                const { o_resultado } = result.outBinds;
                if(o_resultado == 'S') {
                    res.json({
                        state: 'success'
                    });
                }
                else {
                    res.json({
                        state: 'error',
                        message: 'El usuario y/o clave son incorrectos'
                    });
                }
            });
        });
    },

    // visor de documentos
    listaArchivos: async (request, response) => {
        let { empresa, archivo, tpdocumento, codigo } = request.params;
        let result;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select de_nombre_fichero,nu_item,de_ruta_archivo from table(pack_new_attached.f_list_arch_digi_cab_det(:p_empresa,:p_archivo,:p_tpdocumento))";
            let params = {
                p_empresa: { val: empresa },
                p_archivo: { val: archivo },
                p_tpdocumento: { val: tpdocumento }
            };
            if (codigo != 'x') {
                query += " where de_nombre_fichero like :p_codigo";
                codigo = '%' + codigo + '%';
                params.p_codigo = { val: codigo };
            }
            result = await conn.execute(query, params, responseParams);
            response.set('Content-Type', 'text/xml');
            response.send(xmlParser.renderXml(result.rows));
        }
        catch (exception) {
            console.error(exception);
            response.json({
                state: 'error',
                message: 'No se pudo ejecutar la consulta'
            });
        }
    },

    cargaArchivo: (request, response) => {
        let { ruta } = request.body;
        const { Curl } = require('node-libcurl');
        const curl = new Curl()
        const url = 'http://192.168.0.248/uploader/download.php'
        const data = {
            'ruta': ruta
        }
        curl.setOpt(Curl.option.URL, url);
        curl.setOpt(Curl.option.POSTFIELDS, 'ruta=' + ruta);
        curl.setOpt(Curl.option.VERBOSE, true);
        curl.on('end', (statusCode, body) => {
            response.json(JSON.parse(body));
        });
        curl.on('error', curl.close.bind(curl));
        curl.perform();
    },
    
    datosAdjunto: async (request, response) => {
        let { tpdocumento, documento, archivo, tpcarpeta } = request.body;
        let result;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select de_nombre \"nombre\" from ma_tipo_docu_admi_m where co_tipo_doc_administr = :p_tipodoc";
            let params = {
                p_tipodoc: { val: tpdocumento }
            };
            result = await conn.execute(query, params, responseParams);
            let descripcion = result.rows[0].nombre + ': ' + documento + ' - Del ' + archivo;
            // obtener el tipo de archivo
            query = "select pack_new_attached.f_get_tipo_archivo(:p_source) \"out\" from dual";
            params = {
                p_source: { val: tpcarpeta }
            };
            result = await conn.execute(query, params, responseParams);
            let tipocarpeta = result.rows[0].out;
            // arma el nombre del fichero y la descripcion
            let nombre = tpdocumento + '_' + documento;
            response.json({
                data: {
                    nombre: nombre,
                    descripcion: descripcion,
                    tpcarpeta: tipocarpeta
                }
            });
        }
        catch (exception) {
            console.error(exception);
            response.json({
                state: 'error',
                message: 'No se pudo ejecutar la consulta'
            });
        }
    },

    guardarAdjunto: async (request, response) => {
        let { empresa,documento,ext,cousuario,tipoenti,catalenti,tipoarchivo,descripcion,tipodoc,tipocarpeta,periodo,base64 } = request.body;
        let result;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select f_obtener_ruta_imag_trim(:p_tipocarpeta,:p_empresa,:p_tpdocu,:p_catalenti,:p_periodo,'') \"dir\" from dual";
            let params = {
                p_tipocarpeta: { val: tipocarpeta },
                p_empresa: { val: empresa },
                p_tpdocu: { val: tipodoc },
                p_catalenti: { val: catalenti },
                p_periodo: { val: periodo }
            };
            result = await conn.execute(query, params, responseParams);
            let filename = tipodoc + '_' + documento + '.' + ext;
            let ruta_archivo = result.rows[0].dir;
            let path = ruta_archivo.substring(0,ruta_archivo.length - 1);
            ruta_archivo += filename;
            // subir el archivo
            const { Curl } = require('node-libcurl');
            const curl = new Curl();
            const url = 'http://192.168.0.248/uploader/index.php';
            curl.setOpt(Curl.option.URL, url);
            curl.setOpt(Curl.option.POSTFIELDS, 'path=' + path + '&filename=' + filename + '&b64=' + encodeURIComponent(base64.substring(base64.indexOf(',') + 1)));
            curl.setOpt(Curl.option.VERBOSE, true);
            curl.on('end', async (statusCode, body) => {
                // let resultado = JSON.parse(body);
console.log(body);
                // guardar en la bd
                ruta_archivo = ruta_archivo.replace('/publico/document','x:');
                ruta_archivo = ruta_archivo.replace('/','\\');
                query = "call pack_new_attached.sp_save_adjunto(:o_codigo,:o_resultado,:p_empresa,:p_usuario,:p_tipo_enti,:p_catalenti,:p_archivo,:p_tipoarchivo,:p_ruta,:p_fichero,:p_extension,:p_descripcion,:p_tpdocu,:p_tipocarpeta)";
                params = {
                    o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                    o_resultado: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                    p_empresa: { val: empresa },
                    p_usuario: { val: cousuario },
                    p_tipo_enti: { val: tipoenti },
                    p_catalenti: { val: catalenti },
                    p_archivo: { val: catalenti },
                    p_tipoarchivo: { val: tipoarchivo },
                    p_ruta: { val: ruta_archivo },
                    p_fichero: { val: filename },
                    p_extension: { val: ext },
                    p_descripcion: { val: descripcion },
                    p_tpdocu: { val: tipodoc },
                    p_tipocarpeta: { val: tipocarpeta }
                };
                result = await conn.execute(query, params, responseParams);
                const { o_codigo, o_resultado } = result.outBinds;
                response.json({
                    data: { codigo: o_codigo, resultado: o_resultado }
                });
            });
            curl.on('error', curl.close.bind(curl));
            curl.perform();
        }
        catch (exception) {
            console.error(exception);
            response.json({
                state: 'error',
                message: 'No se pudo ejecutar la consulta'
            });
        }
    }
};

module.exports = ancestroController;