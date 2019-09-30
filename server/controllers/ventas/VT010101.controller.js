const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');

const responseParams = {
    outFormat: oracledb.OBJECT
};

const vt010101Controller = {
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

module.exports = vt010101Controller;