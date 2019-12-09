const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');

const responseParams = {
    outFormat: oracledb.OBJECT
};

const vt010102Controller = {
    SaveCoutadata: async (req, res) => {
        /*let p = {empresa : usrJson.empresa ,usuario : usrJson.alias, codigo: cod_s, mvenc  : Formcuotatp.getItemValue('__mvenc'),
              mvencm  : Formcuotatp.getItemValue('__mvencm'),  mvenc30  : Formcuotatp.getItemValue('__mvenc30'),
              mvenc60  : Formcuotatp.getItemValue('__mvenc60'),  mvenc90  : Formcuotatp.getItemValue('__mvenc90'),
              mvsttn : Formedittp.getItemValue('__mvsttn') }*/
        let {empresa, usuario, codigo, mvenc, mvencm, mvenc30,mvenc60,mvenc90,mvsttn} = req.body;   //console.log(emp, codigo, nombre, descripcion, monto, estado);
       //try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "call PW_VT010102.SP_UPDATECUOTA_TNEGO(:xusuario,:tn_codigo,:tn_nombre,:tn_descripcion,:tn_importe,:tn_estado,:o_codigo,:o_mensaje)";
            let params = {
                xusuario: { val: usuario },
                tn_codigo: { val: codigo },
                tn_nombre: { val: nombre },
                tn_descripcion: { val: descripcion },
                tn_importe: { val: monto },
                tn_estado: { val: estado },
             
                o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_mensaje: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            }
            conn.execute(query,params, responseParams, (error, result) => {console.log(error,result);
                let { o_codigo, o_mensaje } = result.outBinds;
               

                if (error) {
                    res.json({
                        state: 'error',
                       codsend: 0,
                         txtsend: error
                      
                    });
                }else{
                    res.json({
                        state: 'success',
                        codsend: o_codigo,
                        txtsend: o_mensaje
                        
                    });
                }
            });
    },
    FormCoutadata: (req, res) => {
        const  {emp,cod} = req.body; 
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({state: 'error', error_conexion: err.stack});
                return;
            }//   RUC,DE_RAZ_SOCIAL,DE_NOMBRE,MONEDA,FE_REGIS,ES_VIGENCIA
            const query = '  SELECT CTN.*,tn.de_nombre FROM VT_CUOT_TIPO_NEGO_D CTN LEFT JOIN vt_tipo_nego_m TN ON tn.co_tipo_negocio = CTN.CO_TIPO_NEGOCIO WHERE  CTN.CO_EMPRESA=:co_emp and  CTN.CO_TIPO_NEGOCIO=:co_tipo ';
            const params = {co_emp: emp,co_tipo:cod };
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({'error_query': error.stack});
                    return;
                }
                res.set('Content-Type', 'application/json');
                res.send(result.rows); 
                conn.close();
            });
        });
    },
    GridTipoNegocio: (req, res) => {
         const {    } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            //Codigo,Nombre,Descripcion,Imp.Minimo,Estado
            /*const query = '   SELECT * FROM TABLE(PACK_NEW_MAESTROS.F_LISTAR_DATA_ENTI2(:xEmpresa,:xTipoEntidad,:xEstado,:xNom)) ';*/
            const query = "  SELECT VT_TIPO_NEGO_M.CO_TIPO_NEGOCIO AS CO_TIPO_NEGOCIO, VT_TIPO_NEGO_M.DE_NOMBRE AS DE_NOMBRE, VT_TIPO_NEGO_M.DE_DESCRIPCION AS DE_DESCRIPCION,VT_TIPO_NEGO_M.IM_TOPE_MINIMO  AS IM_TOPE_MINIMO, VT_TIPO_NEGO_M.ES_TIPO_NEGOCIO AS ES_TIPO_NEGOCIO,case ES_TIPO_NEGOCIO when 'Retirado' then '../none.png' else '../cuota_tn.png' end  AS CUOTA,case ES_TIPO_NEGOCIO when 'Retirado' then '../none.png' else '../ic-edit.png' end AS EDIT,case ES_TIPO_NEGOCIO when 'Retirado' then '../ic-add.png' else '../ic-delete.png' end AS BORRAR  FROM VT_TIPO_NEGO_M  where CO_TIPO_NEGOCIO <> 0  ORDER BY CO_TIPO_NEGOCIO  ";
            const params = {   };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderXml(result.rows));
               // res.send(result.rows.length > 0 ? xmlParser.renderXml(result.rows) : xmlParser.renderXml([{CO_TIPO_NEGOCIO: 0,DE_NOMBRE:'Cerrado-Noxiste',DE_DESCRIPCION:'',IM_TOPE_MINIMO:2.0,ES_TIPO_NEGOCIO:'Vigente' }]));
            });
        });
    },
    Listadoestadotp: (req, res) => {
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = " SELECT MA_ESTA_M.DE_NOMBRE  as LABEL,   MA_ESTA_M.DE_NOMBRE AS VALUE   FROM MA_ESTA_M     WHERE MA_ESTA_M.DE_TIPO_ESTADO = 'Clientes'    ";
            const params = {};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderSelect(result.rows, 'Vigente'));
            });
        });
    },

    GuardarTipNego: async (req, res) => {
        let {usuario, codigo, nombre, descripcion, monto, estado} = req.body;   //console.log(emp, codigo, nombre, descripcion, monto, estado);
       //try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "call PW_VT010102.SP_UPDATE_TNEGO(:xusuario,:tn_codigo,:tn_nombre,:tn_descripcion,:tn_importe,:tn_estado,:o_codigo,:o_mensaje)";
            let params = {
                xusuario: { val: usuario },
                tn_codigo: { val: codigo },
                tn_nombre: { val: nombre },
                tn_descripcion: { val: descripcion },
                tn_importe: { val: monto },
                tn_estado: { val: estado },
             
                o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_mensaje: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            }
            conn.execute(query,params, responseParams, (error, result) => {console.log(error,result);
                let { o_codigo, o_mensaje } = result.outBinds;
               

                if (error) {
                    res.json({
                        state: 'error',
                       codsend: 0,
                         txtsend: error
                      
                    });
                }else{
                    res.json({
                        state: 'success',
                        codsend: o_codigo,
                        txtsend: o_mensaje
                        
                    });
                }
            });
    },
 


    ///////////////////////////////////////////////////////////////////
    CargaListaVendedoresFzavta: async (req, res) => {
        let { empresa, fzavta } = req.params;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select chbox,codigo id,vendedor,eslima,esprovincia,esextranjero,vigencia,vigenciaventas,to_char(fechalineacrd,'dd/mm/yyyy'),clientes,editar,eliminar from table(pack_new_ventas_fzavta.f_fzavta_vendedores(:p_empresa,:p_fzavta))";
            let params = {
                p_empresa: { val: empresa },
                p_fzavta: { val: fzavta }
            };
            let result = await conn.execute(query, params, responseParams);
            res.set('Content-Type', 'text/xml');
            res.send(xmlParser.renderXml(result.rows));
        }
        catch(err) {
            console.log(err);
            res.json({
                state: 'error',
                message: err
            });
        }
    },
    CargaListaClientesVendedorFzavta: async (req, res) => {
        let { empresa, vendedor, fzavta } = req.params;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select co_cliente,de_cliente,nvl(im_linea_credito_final,0),to_char(fe_asignacion,'dd/mm/yyyy'),'ic-credito.svg^Crédito' ic_credito,'" + vendedor + "' co_vendedor from table(pack_new_creditos.f_list_cart_vend_fuer(:p_empresa,:p_vendedor,:p_fzavta))";
            let params = {
                p_empresa: { val: empresa },
                p_vendedor: { val: vendedor },
                p_fzavta: { val: fzavta }
            };
            let result = await conn.execute(query, params, responseParams);
            res.set('Content-Type', 'text/xml');
            res.send(xmlParser.renderXml(result.rows));
        }
        catch(err) {
            console.log(err);
            res.json({
                state: 'error',
                message: err
            });
        }
    },
    CargaListaPagosPeriodos: async (req, res) => {
        let { empresa, cliente } = req.params;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select * from table(pack_new_ventas_fzavta.f_pagos_cliente_full(:p_empresa,:p_cliente))";
            let params = {
                p_empresa: { val: empresa },
                p_cliente: { val: cliente }
            };
            let result = await conn.execute(query, params, responseParams);
            res.set('Content-Type', 'text/xml');
            res.send(xmlParser.renderXml(result.rows));
        }
        catch(err) {
            console.log(err);
            res.json({
                state: 'error',
                message: err
            });
        }
    },
    CargaListaUltimosPagosPeriodos: async (req, res) => {
        let { alias, empresa, cliente, fzavta, vendedor } = req.params;
        try {
            let query, params, result;
            let conn = await oracledb.getConnection(dbParams);
            query = "call pack_new_ventas_fzavta.sp_recupera_periodo(:i_alias,:o_iperiodo,:o_fperiodo)";
            params = {
                i_alias: { val: alias },
                o_iperiodo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_fperiodo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
            };
            result = await conn.execute(query, params, responseParams);
            let { o_iperiodo, o_fperiodo } = result.outBinds;
            query = "select * from table(pack_new_ventas_fzavta.f_pagos_cliente_filtro(:p_empresa,:p_cliente,:p_fzavta,:p_vendedor,:p_periodoini,:p_periodofin))";
            params = {
                p_empresa: { val: empresa },
                p_cliente: { val: cliente },
                p_fzavta: { val: fzavta },
                p_vendedor: { val: vendedor },
                p_periodoini: { val: o_iperiodo },
                p_periodofin: { val: o_fperiodo }
            };
            result = await conn.execute(query, params, responseParams);
            res.set('Content-Type', 'text/xml');
            res.send(xmlParser.renderXml(result.rows));
        }
        catch(err) {
            console.log(err);
            res.json({
                state: 'error',
                message: err
            });
        }
    },
    //peticiones post
    AsignarLineaCreditoMasivo: async (req, res) => {
        let { empresa, alias, cadena, cantidad, fzavta, meses } = req.body;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "call pack_new_creditos.sp_calcular_linea_credito(:i_empresa,:i_alias,:i_cadena,:i_cantidad,:i_fzavta,:i_meses,:o_codigo,:o_mensaje)";
            let params = {
                i_empresa: { val: empresa },
                i_alias: { val: alias },
                i_cadena: { val: cadena },
                i_cantidad: { val: cantidad },
                i_fzavta: { val: fzavta },
                i_meses: { val: meses },
                o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_mensaje: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            };
            await conn.execute(query, params, responseParams);
            res.json({
                state: 'success'
            });
        }
        catch(err) {
            console.log(err);
            res.json({
                state: 'error',
                message: err
            });
        }
    },
    CargaDatosSolicitudCredito: async (req, res) => {
        let { alias, cliente, vendedor } = req.body;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "call pack_new_ventas_fzavta.sp_recupera_periodo(:i_alias,:o_iperiodo,:o_fperiodo)";
            let params = {
                i_alias: { val: alias },
                o_iperiodo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_fperiodo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
            };
            let result = await conn.execute(query, params, responseParams);
            let { o_iperiodo, o_fperiodo } = result.outBinds;
            //
            query = "select co_catalogo_entidad \"codigo\",de_razon_social \"nombre\" from ma_cata_enti_m where co_catalogo_entidad in (:p_cliente,:p_vendedor)";
            params = {
                p_cliente: { val: cliente },
                p_vendedor: { val: vendedor }
            };
            result = await conn.execute(query, params, responseParams);
            let entidades = result.rows;
            if(entidades[0].codigo == cliente) {
                sCliente = entidades[0].nombre;
                sVendedor = entidades[1].nombre;
            }
            else {
                sVendedor = entidades[0].nombre;
                sCliente = entidades[1].nombre;
            }
            res.json({
                state: 'success',
                data: {
                    iperiodo: o_iperiodo,
                    fperiodo: o_fperiodo,
                    cliente:  sCliente,
                    vendedor: sVendedor
                }
            });
        }
        catch(err) {
            res.json({
                state: 'error',
                message: err
            });
        }
    },
    AsignarLcredCliente: async (req, res) => {
        let { empresa, cliente, fzavta, lcredito, usuario, ccosto } = req.body;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "call pack_new_ventas_fzavta.sp_asigna_lcred_cliente(:p_empresa,:p_cliente,:p_fzavta,:p_lcredito,:p_usuario,:p_centrocosto)";
            let params = {
                p_empresa: { val: empresa },
                p_cliente: { val: cliente },
                p_fzavta: { val: fzavta },
                p_lcredito: { val: lcredito },
                p_usuario: { val: usuario },
                p_centrocosto: { val: ccosto }
            };
            //await conn.execute(query, params, responseParams);
            res.json({
                state: 'success'
            });
        }
        catch(err) {
            res.json({
                state: 'error',
                message: err
            });
        }
    }
};

module.exports = vt010102Controller;