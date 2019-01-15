const oracledb = require('oracledb');
const dbParams = require('../database');
const o2x = require('object-to-xml');

const responseParams = {
    outFormat: oracledb.OBJECT
};

const carteraController = {
    listaVendedores: (req, res) => {
        const { empresa } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                console.error(err);
                return;
            }
            const query = "select vvm.co_vendedor as codigo, sgum.de_nombre as nombre from vt_vend_m vvm join sg_usua_m sgum on vvm.co_vendedor = sgum.co_usuario and vvm.co_empresa = sgum.co_empresa_usuario where vvm.co_empresa = :empresa and vvm.es_vigencia = 'Vigente' and (vvm.de_zona is not null or vvm.st_supervisor = 'S') order by sgum.de_nombre";
            const params = { empresa: { val: empresa } };
            conn.execute(query, params, responseParams, (error, result) => {
                if(error) {
                    console.error(error);
                    conn.close();
                    return;
                }
                //gg wp
                var arr = [];
                for(var i in result.rows) {
                    arr.push({
                        '@': { id: result.rows[i].CODIGO },
                        cell: [result.rows[i].CODIGO, result.rows[i].NOMBRE, 'btn_ruta.png^Ver ruta']
                    });
                }
                res.set('Content-Type', 'text/xml');
                res.send(o2x({
                    '?xml version="1.0" encoding="utf-8"?' : null,
                    rows: {
                        row: arr
                    }
                }));
            });
        });
    },
    rutaVendedor: (req, res) => {
        const { vendedor, empresa, dia } = req.body;
        const queryCabecera = "select to_char(fe_inicio,'hh24:mi') as \"inicio\", to_char(fe_fin,'hh24:mi') as \"fin\", nu_lat_inicio as \"ilat\", nu_lng_inicio as \"ilng\", nu_lat_fin as \"flat\", nu_lng_fin as \"flng\" from vt_visi_clie_t where co_vendedor = :vendedor and co_empresa = :empresa and to_char(fe_inicio,'yyyy-mm-dd') = :dia";
        const paramsCabecera = { vendedor: { val: vendedor }, empresa: { val: empresa }, dia: { val: dia } };
        const queryPuntos = "select nvl(ci.co_cliente,nc.co_rucdni) as \"codigo\", nvl(ci.de_razon_social,nc.de_nombre) as \"cliente\", to_char(vc.fe_registro,'hh24:mi') as \"inicio\", to_char(vc.fe_salida,'hh24:mi') as \"fin\", vc.de_altitud as \"lat\", vc.de_latitud as \"lon\", nvl(vc.de_obser,'(ninguna)') as \"obs\", nvl(nc.de_direccion,'(ninguna)') as \"extras\", vc.co_visita as \"estado\", cv.de_motivo_visita as \"resultado\", vc.co_nuevo_cliente as \"convocli\", nvl(pt.co_pedido,'-') as \"pedido\", nvl(pt.im_total,0) as \"total\", nvl(cd.co_planilla_cobranza,'-') as \"planilla\", nvl(cd.im_cobranza,0) as \"cobro\" from vt_visi_clie_c vc join vt_motivo_visita_m cv on vc.co_visita = cv.co_motivo_visita left join vt_clie_m ci on vc.co_empresa = ci.co_empresa and vc.co_cliente = ci.co_cliente left join vt_visi_nuevo_cliente nc on vc.co_nuevo_cliente = nc.co_nuevo_cli left join vt_pedi_t pt on pt.co_vendedor = vc.co_vendedor and pt.co_cliente = vc.co_cliente and pt.co_empresa = vc.co_empresa and to_char(pt.fe_pedido,'yymmdd') = to_char(vc.fe_registro,'yymmdd') left join ba_plan_cobr_d cd on cd.co_cliente = vc.co_cliente and to_char(cd.fe_sys,'yymmdd') = to_char(vc.fe_registro,'yymmdd') and cd.co_empresa = vc.co_empresa where vc.co_vendedor = :vendedor and to_char(vc.fe_registro,'yyyy-mm-dd') = :dia and vc.co_empresa = :empresa";
        const paramsPuntos = { vendedor: { val: vendedor }, dia: { val: dia }, empresa: { val: empresa } };
console.log(paramsCabecera);
        var arrCabecera = null, arrDetalle = null;
        oracledb.getConnection(dbParams, (err, conn) => {
            if(err) {
                console.error(err);
                return;
            }
            conn.execute(queryCabecera, paramsCabecera, responseParams, (error, result) => {
                if(error) {
                    console.error(error);
                    conn.close();
                    return;
                }
                arrCabecera = result.rows;
                if(arrDetalle) return res.json({
                    cabecera: arrCabecera,
                    puntos: arrDetalle
                });
            });
            conn.execute(queryPuntos, paramsPuntos, responseParams, (error, result) => {
                if(error) {
                    console.error(error);
                    conn.close();
                    return;
                }
                arrDetalle = result.rows;
                if(arrCabecera) return res.json({
                    cabecera: arrCabecera,
                    puntos: arrDetalle
                });
            });
        });
    },
    funcionPrueba = () => {
        console.log("hola");
    }
};

module.exports = carteraController;