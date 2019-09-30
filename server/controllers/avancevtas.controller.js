const oracledb = require('oracledb');
const dbParams = require('../database');
const xmlParser = require('../xml-parser');
const fs = require('fs');

const responseParams = {
    outFormat: oracledb.OBJECT
};

const avancevtasController = {
    main: (req, res) => {
        //res.render('./../client/views/home/avance-ventas.ejs');
        res.render('./../client/views/home/avance-ventas-2.ejs');
    },

    CargarDatosTableroControl: async (req, res) => {
        let { empresa, dia } = req.body;
        let query, params, result;
        //conversion de la hora a gmt-5
        let ahora = new Date();
        ahora.setHours(ahora.getHours() - 5);
        let HoraActual = ahora.toISOString().replace(/T/, ' ').replace(/\..+/, '');
        try {
            let conn = await oracledb.getConnection(dbParams);
            //periodos
            query = "select to_char(sysdate,'yyyymm') \"periodo\",min(co_periodo) \"primero\",max(co_periodo) \"ultimo\" from ma_peri_m where nu_mes > 0 and co_empresa = :p_empresa and add_months(sysdate,-1) < add_months(fe_primer_dia,12) and add_months(sysdate,-1) > fe_primer_dia group by to_char(sysdate,'yyyymm')";
            params = { 
                p_empresa: { val: empresa }
             };
            result = await conn.execute(query, params, responseParams);
            let { periodo, primero, ultimo } = result.rows[0];
            //carga las ventas del ultimo año
            query = "select mffvc.co_periodo \"codigo\",mpm.de_nombre \"periodo\",sum(mffvc.im_total) \"importe\" from ma_file_fisi_vent_c mffvc join ma_peri_m mpm on mpm.co_empresa = mffvc.co_empresa and mpm.co_periodo = mffvc.co_periodo where mffvc.co_periodo between :p_inicio and :p_fin and mffvc.es_vigencia = 'Conforme' and mffvc.co_tipo_doc_administr not in ('07','08') and mffvc.co_punto_venta = 1 and mffvc.co_empresa = 11 group by mffvc.co_periodo,mpm.de_nombre order by mffvc.co_periodo asc";
            params = {
                p_inicio: { val: primero },
                p_fin: { val: ultimo }
            }
            result = await conn.execute(query, params, responseParams);
            let ventas = result.rows;
            //carga la data de la proyeccion
            query = "select pt.co_periodo \"periodo\",pt.co_fuerza_venta \"cfzavta\",fv.de_nombre \"fzavta\",pt.co_tipo_negocio \"ctpnegocio\",tn.de_nombre \"tpnegocio\",sum(pt.im_total) \"avance\",sum(0) \"proyeccion\" from vt_pedi_t pt join vt_tipo_nego_m tn on tn.co_tipo_negocio = pt.co_tipo_negocio join vt_fuer_vent_m fv on pt.co_empresa = fv.co_empresa and pt.co_fuerza_venta = fv.co_fuerza_venta where pt.co_empresa = 11 and pt.co_moneda = 1 and pt.co_periodo = :p_periodo group by pt.co_periodo,pt.co_fuerza_venta,fv.de_nombre,pt.co_tipo_negocio,tn.de_nombre order by pt.co_periodo asc,fv.de_nombre asc,tn.de_nombre asc";
            params = {
                p_periodo: { val: periodo }
            };
            result = await conn.execute(query, params, responseParams);
            let data = result.rows;
            //carga avance de ventas del ultimo periodo
            query = "select sum(im_total) \"suma\" " +
                "from vt_pedi_t where co_periodo = to_char(sysdate,'yyyymm') and es_vigencia = 'Cerrado' and co_empresa = :p_empresa";
            params = {
                p_empresa: { val: empresa }
            };
            result = await conn.execute(query, params, responseParams);
            let avance = result.rows[0].suma;
            //carga datos de visitas
            query = "select count(case co_visita when 0 then 1 else null end) \"nuevos\",count(1) \"todos\" from vt_visi_clie_c where to_char(fe_sys,'yyyy-mm-dd') = :p_dia and co_empresa = :p_empresa";
            params = {
                p_dia: { val: dia },
                p_empresa: { val: empresa }
            };
            result = await conn.execute(query, params, responseParams);
            let visitas = result.rows[0];
            //carga nro de vendedores en ruta
            query = "select count(distinct(co_vendedor)) \"vendedores\" from vt_visi_clie_t where to_char(fe_inicio,'yyyy-mm-dd') = :p_dia and co_empresa = :p_empresa";
            params = {
                p_dia: { val: dia },
                p_empresa: { val: empresa }
            };
            result = await conn.execute(query, params, responseParams);
            visitas.vendedores = result.rows[0].vendedores;
            //carga las marcaciones del dia
            conn = await oracledb.getConnection(dbParams);
            query = "select co_vendedor as \"ruc\", de_nombre as \"nombre\", co_visita as \"covis\", de_visita as \"resul\", to_char(fe_marca,'hh24:mi') as \"hora\", nu_latitud as \"lat\", nu_longitud as \"lon\", de_direccion as \"direc\" " +
                "from table(web_clifeapp.fv_marcadores_dia_notemp(to_char(sysdate,'dd/mm/yyyy'))) " +
                "order by fe_marca desc";
            params = {};
            result = await conn.execute(query, params, responseParams);
            let marcaciones = result.rows;
            //arma la salida
            res.json({
                state: 'success',
                data: {
                    periodos: { inicio: primero, fin: ultimo},
                    ventas: ventas,
                    data: data,
                    avance: {
                        venta: avance,
                        cuota: 5000000
                    },
                    visitas: visitas,
                    marcaciones: marcaciones,
                    hora: HoraActual
                }
            });
        }
        catch(error) {
            console.log(err);
            res.json({
                state: 'error',
                message: err
            });
        }
    },

    CargaNuevosDatos: async (request, response) => {
        let { empresa, dia, hora } = request.body;
        let query, params, result;
        //conversion de la hora a gmt-5
        let ahora = new Date();
        ahora.setHours(ahora.getHours() - 5);
        let HoraActual = ahora.toISOString().replace(/T/, ' ').replace(/\..+/, '');
        //listo
        let vFecha = dia.split('-');
        let periodo = vFecha[0] + '' + vFecha[1];
        try {
            let conn = await oracledb.getConnection(dbParams);
            //carga la data de la proyeccion
            query = "select pt.co_periodo \"periodo\",pt.co_fuerza_venta \"cfzavta\",fv.de_nombre \"fzavta\",pt.co_tipo_negocio \"ctpnegocio\",tn.de_nombre \"tpnegocio\",sum(pt.im_total) \"avance\",sum(0) \"proyeccion\" from vt_pedi_t pt join vt_tipo_nego_m tn on tn.co_tipo_negocio = pt.co_tipo_negocio join vt_fuer_vent_m fv on pt.co_empresa = fv.co_empresa and pt.co_fuerza_venta = fv.co_fuerza_venta where pt.co_empresa = 11 and pt.co_moneda = 1 and pt.co_periodo = :p_periodo group by pt.co_periodo,pt.co_fuerza_venta,fv.de_nombre,pt.co_tipo_negocio,tn.de_nombre order by pt.co_periodo asc,fv.de_nombre asc,tn.de_nombre asc";
            params = {
                p_periodo: { val: periodo }
            };
            result = await conn.execute(query, params, responseParams);
            let data = result.rows;
            //carga avance de ventas del ultimo periodo
            query = "select sum(im_total) \"suma\" " +
                "from vt_pedi_t where co_periodo = to_char(sysdate,'yyyymm') and es_vigencia = 'Cerrado' and co_empresa = :p_empresa";
            params = {
                p_empresa: { val: empresa }
            };
            result = await conn.execute(query, params, responseParams);
            let avance = result.rows[0].suma;
            //carga datos de visitas
            query = "select count(case co_visita when 0 then 1 else null end) \"nuevos\",count(1) \"todos\" from vt_visi_clie_c where to_char(fe_sys,'yyyy-mm-dd') = :p_dia and co_empresa = :p_empresa";
            params = {
                p_dia: { val: dia },
                p_empresa: { val: empresa }
            };
            result = await conn.execute(query, params, responseParams);
            let visitas = result.rows[0];
            //carga nro de vendedores en ruta
            query = "select count(distinct(co_vendedor)) \"vendedores\" from vt_visi_clie_t where to_char(fe_inicio,'yyyy-mm-dd') = :p_dia and co_empresa = :p_empresa";
            params = {
                p_dia: { val: dia },
                p_empresa: { val: empresa }
            };
            result = await conn.execute(query, params, responseParams);
            visitas.vendedores = result.rows[0].vendedores;
            //carga las marcaciones del dia
            conn = await oracledb.getConnection(dbParams);
            query = "select co_vendedor as \"ruc\", de_nombre as \"nombre\", co_visita as \"covis\", de_visita as \"resul\", to_char(fe_marca,'hh24:mi') as \"hora\", nu_latitud as \"lat\", nu_longitud as \"lon\", de_direccion as \"direc\" " +
                "from table(web_clifeapp.fv_marcadores_dia_notemp(to_char(sysdate,'dd/mm/yyyy'))) " +
                "order by fe_marca asc";
            params = {};
            result = await conn.execute(query, params, responseParams);
            let marcaciones = result.rows;
            //carga los ultimos pedidos
            query = "select pt.co_pedido \"pedido\",to_char(pt.fe_pedido,'hh24:mi') \"apertura\",to_char(pt.fe_cierre,'hh24:mi') \"cierre\",fv.de_nombre \"fventa\",tn.de_nombre \"tpnegocio\",vn.de_nombre \"vendedor\",pt.co_cliente \"ruc\",ci.de_razon_social \"cliente\",mon.de_nombre \"moneda\",pt.im_total \"importe\",pt.es_vigencia \"estado\" " +
                "from vt_pedi_t pt " + 
                    "join vt_fuer_vent_m fv on pt.co_empresa = fv.co_empresa and pt.co_fuerza_venta = fv.co_fuerza_venta " +
                    "join vt_tipo_nego_m tn on tn.co_tipo_negocio = pt.co_tipo_negocio " +
                    "join ma_mone_m mon on pt.co_moneda = mon.co_moneda " +
                    "join vt_clie_m ci on pt.co_cliente = ci.co_cliente and pt.co_empresa = ci.co_empresa " +
                    "join sg_usua_m vn on pt.co_vendedor = vn.co_usuario and pt.co_empresa = vn.co_empresa_usuario " +
                "where pt.co_empresa = :p_empresa and to_char(pt.fe_pedido,'yyyy-mm-dd') = :p_dia " +
                    "and (pt.fe_cierre > (to_date(:p_hora,'yyyy-mm-dd hh24:mi:ss') + interval '-15' second) or pt.fe_pedido > (to_date(:p_hora_x2,'yyyy-mm-dd hh24:mi:ss') + interval '-15' second)) " +
                "order by pt.fe_pedido desc";
            params = {
                p_empresa: { val: empresa },
                p_dia: { val: dia },
                p_hora: { val: hora },
                p_hora_x2: { val: hora }
            };
            result = await conn.execute(query, params, responseParams);
            let pedidos = result.rows;
            //arma la salida
            response.json({
                state: 'success',
                data: {
                    data: data,
                    avance: {
                        venta: avance,
                        cuota: 5000000
                    },
                    visitas: visitas,
                    marcaciones: marcaciones,
                    hora: HoraActual,
                    pedidos: pedidos
                }
            });
        }
        catch(error) {
            console.log(error);
            response.json({
                state: 'error',
                message: error
            });
        }
    },

    CargarDatosMes: async (req, res) => {
        let { tipo, codigo, empresa } = req.body;
        let query, params, result, periodos, vendedores, label;
        try {
            let conn = await oracledb.getConnection(dbParams);
            if(tipo == 'tpnegocio') {
                query = "select to_char(fe_pedido,'dd') \"dia\",sum(im_total) \"importe\" from vt_pedi_t where co_periodo = to_char(sysdate,'yyyymm') and co_tipo_negocio = :p_tpnegocio and co_empresa = :p_empresa group by to_char(fe_pedido,'dd') order by to_char(fe_pedido,'dd') asc";
                params = {
                    p_tpnegocio: { val: codigo },
                    p_empresa: { val: empresa }
                };
                result = await conn.execute(query, params, responseParams);
                periodos = result.rows;
                //carga vendedores
                query = "select pt.co_vendedor \"codigo\",sgum.de_nombre \"vendedor\",sum(pt.im_total) \"importe\" from vt_pedi_t pt join sg_usua_m sgum on pt.co_vendedor = sgum.co_usuario and pt.co_empresa = sgum.co_empresa_usuario where pt.co_periodo = to_char(sysdate,'yyyymm') and pt.co_tipo_negocio = :p_tpnegocio and pt.co_empresa = :p_empresa group by pt.co_vendedor,sgum.de_nombre order by sum(pt.im_total) desc";
                result = await conn.execute(query, params, responseParams);
                vendedores = result.rows;
                //carga labels
                query = "select de_nombre \"tpnegocio\" from vt_tipo_nego_m where co_tipo_negocio = :p_tpnegocio";
                params = {
                    p_tpnegocio: { val: codigo }
                };
                result = await conn.execute(query, params, responseParams);
                label = result.rows[0].tpnegocio;
            }
            else if(tipo == 'fventa') {
                query = "select to_char(fe_pedido,'dd') \"dia\",sum(im_total) \"importe\" from vt_pedi_t where co_periodo = to_char(sysdate,'yyyymm') and co_fuerza_venta = :p_fventa and co_empresa = :p_empresa group by to_char(fe_pedido,'dd') order by to_char(fe_pedido,'dd') asc";
                params = {
                    p_fventa: { val: codigo },
                    p_empresa: { val: empresa }
                };
                result = await conn.execute(query, params, responseParams);
                periodos = result.rows;
                //carga vendedores
                query = "select pt.co_vendedor \"codigo\",sgum.de_nombre \"vendedor\",sum(pt.im_total) \"importe\" from vt_pedi_t pt join sg_usua_m sgum on pt.co_vendedor = sgum.co_usuario and pt.co_empresa = sgum.co_empresa_usuario where pt.co_periodo = to_char(sysdate,'yyyymm') and pt.co_fuerza_venta = :p_fventa and pt.co_empresa = :p_empresa group by pt.co_vendedor,sgum.de_nombre order by sum(pt.im_total) desc";
                result = await conn.execute(query, params, responseParams);
                vendedores = result.rows;
                //carga labels
                query = "select de_nombre \"fventa\" from vt_fuer_vent_m where co_fuerza_venta = :p_fventa and co_empresa = :p_empresa";
                params = {
                    p_fventa: { val: codigo },
                    p_empresa: { val: empresa }
                };
                result = await conn.execute(query, params, responseParams);
                label = result.rows[0].fventa;
            }
            else {
                res.json({
                    state: 'error',
                    message: 'Parámetros inválidos'
                });
                return;
            }
            //arma la salida
            res.json({
                state: 'success',
                data: {
                    detalle: periodos,
                    vendedores: vendedores,
                    label: label
                }
            });
        }
        catch(error) {
            console.log(error);
            res.json({
                state: 'error',
                message: error
            });
        }
    },

    CargaPedidosDia: async (request, response) => {
        let { dia, empresa, uactualiza, modo } = request.params;
        let result;
        let comparador = modo == 'C' ? '<=' : '>';
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select pt.co_pedido \"ID\",to_char(pt.fe_pedido,'hh24:mi') \"apertura\",to_char(pt.fe_cierre,'hh24:mi') \"cierre\",fv.de_nombre \"fventa\",tn.de_nombre \"tpnegocio\",vn.de_nombre \"vendedor\",pt.co_cliente \"ruc\",ci.de_razon_social \"cliente\",mon.de_nombre \"moneda\",pt.im_total \"importe\",pt.es_vigencia \"estado\" " +
                "from vt_pedi_t pt " + 
                    "join vt_fuer_vent_m fv on pt.co_empresa = fv.co_empresa and pt.co_fuerza_venta = fv.co_fuerza_venta " +
                    "join vt_tipo_nego_m tn on tn.co_tipo_negocio = pt.co_tipo_negocio " +
                    "join ma_mone_m mon on pt.co_moneda = mon.co_moneda " +
                    "join vt_clie_m ci on pt.co_cliente = ci.co_cliente and pt.co_empresa = ci.co_empresa " +
                    "join sg_usua_m vn on pt.co_vendedor = vn.co_usuario and pt.co_empresa = vn.co_empresa_usuario " +
                "where pt.co_empresa = :p_empresa and to_char(pt.fe_pedido,'yyyymmdd') = :p_dia " +
                    "and (pt.fe_cierre " + comparador + " to_date(:p_hora,'yyyy-mm-dd hh24:mi:ss') or pt.fe_pedido " + comparador + " to_date(:p_hora,'yyyy-mm-dd hh24:mi:ss')) " +
                "order by pt.fe_pedido desc";
            let params = {
                p_empresa: { val: empresa },
                p_dia: { val: dia },
                p_hora: { val: uactualiza }
            };
            result = await conn.execute(query, params, responseParams);
            response.set('Content-Type', 'text/xml');
            response.send(xmlParser.renderXml(result.rows));
        }
        catch(error) {
            response.json({
                state: 'error',
                message: error
            });
            console.log(error);
        }
    },

    CargaMarcaciones: async (request, response) => {
        let result;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select co_vendedor as \"ruc\", de_nombre as \"nombre\", co_visita as \"covis\", de_visita as \"resul\", to_char(fe_marca,'hh24:mi') as \"hora\", nu_latitud as \"lat\", nu_longitud as \"lon\", de_direccion as \"direc\" " +
                "from table(web_clifeapp.fv_marcadores_dia_notemp(to_char(sysdate,'dd/mm/yyyy'))) " +
                "order by fe_marca desc";
            let params = {};
            result = await conn.execute(query, params, responseParams);
            response.json({
                state: 'success',
                data: {
                    marcaciones: result.rows
                }
            });
        }
        catch(error) {
            response.json({
                state: 'error',
                message: error
            });
            console.log(error);
        }
    }
};

module.exports = avancevtasController;
