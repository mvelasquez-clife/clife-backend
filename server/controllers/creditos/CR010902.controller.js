const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');

const responseParams = {
    outFormat: oracledb.OBJECT
};

const cr010902Controller = {
    Grilla_detnegocio: async(req, res) => {
        let { emp, per, vend  } = req.params;  
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "SELECT DOCUMENTO,TO_CHAR(FEC_VENCIMIENTO,'DD-MM-YYYY') AS FECVENCI,CO_CLIENTE,DE_CLIENTE,IM_IMPORTE,IM_DEUDA,DE_TIPO_NEGOCIO  FROM table(CLIENTES_DEUDA_1.f_deuda_periodo(:p_empresa,:p_periodo,1)) WHERE CO_TIPO_NEGOCIO = :p_vendedor ORDER BY IM_DEUDA DESC";
            let params = {
                p_empresa: { val: emp },
                p_vendedor: { val: vend },
                p_periodo: { val: per }
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
    Grilla_deta: async(req, res) => {
        let { emp, per, vend  } = req.params;  
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "SELECT DOCUMENTO,TO_CHAR(FEC_VENCIMIENTO,'DD-MM-YYYY') AS FECVENCI,CO_CLIENTE,DE_CLIENTE,IM_IMPORTE,IM_DEUDA,DE_VENDEDOR  FROM table(CLIENTES_DEUDA_1.f_deuda_periodo(:p_empresa,:p_periodo,1)) WHERE CO_VENDEDOR = :p_vendedor ORDER BY IM_DEUDA DESC";
            let params = {
                p_empresa: { val: emp },
                p_vendedor: { val: vend },
                p_periodo: { val: per }
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

    Listadoper: (req, res) => {
        const { emp } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = " SELECT  co_periodo as value,de_nombre as text  FROM ma_peri_m WHERE CO_EMPRESA=:p_empresa AND CO_PERIODO > 201412 AND NU_MES > 0 order by CO_PERIODO DESC    ";
            const params = { p_empresa: emp };
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'text/xml');
                res.send(xmlParser.renderCombo(result.rows, 'Vigente'));
            });
        });
    },
    Datatotal: (req, res) => {
        const { emp, per } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            //const query = " SELECT (NV30 + NV60+NV90+NV30L+NV60L) AS NOVENCIDOS,(VE+VEM+VEL+VEML)  AS VENCIDOS,T2.DETOTAL AS DEUTOTAL FROM (Select SUM(T1.NOV_30DIAS) AS NV30,SUM(NOV_60DIAS) AS NV60,SUM(T1.NOV_90DIAS)AS NV90,SUM(VENCIDO) AS VE,SUM(VECMES) AS VEM,SUM(NOV_30DIAS_L) AS NV30L ,            SUM(NOV_60DIAS_L) AS NV60L,SUM(T1.VENCIDO_L) AS VEL,SUM(VECMES_L)AS VEML,SUM(DEUDA_TOTAL) AS DETOTAL,SUM(CUOTA_fAC),SUM(T1.CUOTA_LET),SUM(CUOTA_MENSUAL) From Table( Clientes_Deuda_1.F_Deuda_Tnegocio(:emp,:per,1)) T1) T2   ";
           // const query = "select T1.DE_TIPO_NEGOCIO AS NOMBRE  ,T1.CO_TIPO_NEGOCIO as COD,SUM(T1.DEUDA_TOTAL) as DEUDXTIPO  From Table( Clientes_Deuda_1.F_Deuda_Tnegocio(:emp,:per,1)) T1 GROUP BY T1.DE_TIPO_NEGOCIO,T1.CO_TIPO_NEGOCIO";
           const query ="select SUM(T1.NOV_30DIAS) + SUM(T1.NOV_30DIAS_L) AS NV30D,SUM(T1.NOV_60DIAS) +SUM(T1.NOV_60DIAS_L) AS NV60D ,SUM(T1.NOV_90DIAS) AS NV90D,SUM(VENCIDO) + SUM(VENCIDO_L) AS VENC ,SUM(VECMES)+SUM(VECMES_L) AS VMES FROM Table( Clientes_Deuda_1.F_Deuda_Tnegocio(:emp,:per,1)) T1";
           const params = { emp: emp, per: per };
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                let sum_total = 0, datares = [];
                res.set('Content-Type', 'application/json');
                sum_total =  result.rows[0].NV30D +result.rows[0].NV60D + result.rows[0].NV90D +result.rows[0].VENC + result.rows[0].VMES ; 
                datares.push({ 'name': 'NO VENCIDOS 30DIAS','y': result.rows[0].NV30D, 'drilldown': 'NV30D','key': 'NV30D' },
                {'name': 'NO VENCIDOS 60DIAS','y': result.rows[0].NV60D, 'drilldown': 'NV60D','key': 'NV60D'},
                {'name': 'NO VENCIDOS 90DIAS','y': result.rows[0].NV90D, 'drilldown': 'NV90D','key': 'NV90D'},
                {'name': 'VENCIDOS','y': result.rows[0].VENC, 'drilldown': 'VENC','key': 'VENC'},
                {'name': 'VENC.MES','y': result.rows[0].VMES, 'drilldown': 'VMES','key': 'VMES'}) ;
                res.send({ 'total': sum_total, 'data': datares });

               /* for (var i in result.rows) {
                    sum_total = sum_total + result.rows[i].DEUDXTIPO;
                    parseFloat(result.rows[i].DEUDXTIPO) > 0 ? datares.push({ 'name': result.rows[i].NOMBRE, 'y': result.rows[i].DEUDXTIPO, 'drilldown': result.rows[i].COD,'key': parseInt(result.rows[i].COD) }) : null;
                }
                res.set('Content-Type', 'application/json');
                res.send({ 'total': sum_total, 'data': datares });*/

            });
        });
    },
    DatatotalDeta: (req, res) => {
        const { emp, per } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
           const query ="SELECT T1.CO_VENDEDOR AS CODV,T1.DE_VENDEDOR AS NOMBRE,SUM(T1.NOV_30DIAS) + SUM(T1.NOV_30DIAS_L) AS NV30D,SUM(T1.NOV_60DIAS)+SUM(T1.NOV_60DIAS_L)  AS NV60D,SUM(T1.NOV_90DIAS) AS NV90D ,SUM(VENCIDO)  + SUM(VENCIDO_L) AS VENC ,SUM(VECMES)+SUM(VECMES_L) AS VMES  From Table( Clientes_Deuda_1.F_Deuda_Tnegocio(:emp,:per,1)) T1 GROUP BY T1.CO_VENDEDOR,T1.DE_VENDEDOR";
           const params = { emp: emp, per: per };
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                let data30 = [],  data60 = [],  data90 = [], datavenc = [], datavmes = [], TIPO_N = '', datatot = [];
                for (var i in result.rows) {
                  parseFloat ( result.rows[i].NV30D ) > 0 ?  data30.push([result.rows[i].NOMBRE,result.rows[i].NV30D, result.rows[i].CODV]) : null ;
                  parseFloat ( result.rows[i].NV60D ) > 0 ?   data60.push([result.rows[i].NOMBRE,result.rows[i].NV60D, result.rows[i].CODV ]) : null ;
                  parseFloat ( result.rows[i].NV90D ) > 0 ?   data90.push([result.rows[i].NOMBRE,result.rows[i].NV90D, result.rows[i].CODV ]) : null ;
                  parseFloat ( result.rows[i].VENC ) > 0 ?   datavenc.push([result.rows[i].NOMBRE,result.rows[i].VENC, result.rows[i].CODV ]) : null ;
                  parseFloat ( result.rows[i].VMES ) > 0 ?   datavmes.push([result.rows[i].NOMBRE,result.rows[i].VMES, result.rows[i].CODV ]) : null ;
                }
                datatot.push({'key' :'NV30D', 'id': 'NV30D', 'data': data30 } ,
                {'key' :'NV60D', 'id': 'NV60D', 'data': data60 },
                {'key' :'NV90D', 'id': 'NV90D', 'data': data90 },
                {'key' :'VENC', 'id': 'VENC', 'data': datavenc },
                {'key' :'VMES', 'id': 'VMES', 'data': datavmes }
                );
                res.set('Content-Type', 'application/json');
                res.send(datatot);
            });
        });
    },
    DatatotalNego: (req, res) => {
        const { emp, per } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
           const query ="SELECT T1.CO_TIPO_NEGOCIO AS CODV,T1.DE_TIPO_NEGOCIO AS NOMBRE,SUM(T1.NOV_30DIAS) + SUM(T1.NOV_30DIAS_L) AS NV30D,SUM(T1.NOV_60DIAS)+SUM(T1.NOV_60DIAS_L)  AS NV60D,SUM(T1.NOV_90DIAS) AS NV90D ,SUM(VENCIDO)  + SUM(VENCIDO_L) AS VENC ,SUM(VECMES)+SUM(VECMES_L) AS VMES  From Table( Clientes_Deuda_1.F_Deuda_Tnegocio(:emp,:per,1)) T1 GROUP BY T1.CO_TIPO_NEGOCIO ,T1.DE_TIPO_NEGOCIO";
           const params = { emp: emp, per: per };
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                let data30 = [],  data60 = [],  data90 = [], datavenc = [], datavmes = [], TIPO_N = '', datatot = [];
                for (var i in result.rows) {
                  parseFloat ( result.rows[i].NV30D ) > 0 ?  data30.push([result.rows[i].NOMBRE,result.rows[i].NV30D, result.rows[i].CODV]) : null ;
                  parseFloat ( result.rows[i].NV60D ) > 0 ?   data60.push([result.rows[i].NOMBRE,result.rows[i].NV60D, result.rows[i].CODV ]) : null ;
                  parseFloat ( result.rows[i].NV90D ) > 0 ?   data90.push([result.rows[i].NOMBRE,result.rows[i].NV90D, result.rows[i].CODV ]) : null ;
                  parseFloat ( result.rows[i].VENC ) > 0 ?   datavenc.push([result.rows[i].NOMBRE,result.rows[i].VENC, result.rows[i].CODV ]) : null ;
                  parseFloat ( result.rows[i].VMES ) > 0 ?   datavmes.push([result.rows[i].NOMBRE,result.rows[i].VMES, result.rows[i].CODV ]) : null ;
                }
                datatot.push({'key' :'NV30D', 'id': 'NV30D', 'data': data30 } ,
                {'key' :'NV60D', 'id': 'NV60D', 'data': data60 },
                {'key' :'NV90D', 'id': 'NV90D', 'data': data90 },
                {'key' :'VENC', 'id': 'VENC', 'data': datavenc },
                {'key' :'VMES', 'id': 'VMES', 'data': datavmes }
                );
                res.set('Content-Type', 'application/json');
                res.send(datatot);
            });
        });
    },
    /*Datafiltro: (req, res) => {
        const { emp, per, tipo, venc, doc } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            let qtipocolum = tipo === 'gtipnego' ? ' T1.CO_TIPO_NEGOCIO , T1.DE_TIPO_NEGOCIO AS DE_TIPO ' : ' T1.CO_VENDEDOR, T1.DE_VENDEDOR AS DE_TIPO';
            let qtipogroup = tipo === 'gtipnego' ? ' T1.CO_TIPO_NEGOCIO , T1.DE_TIPO_NEGOCIO   ' : ' T1.CO_VENDEDOR, T1.DE_VENDEDOR ';
            let titl_tip = tipo === 'gtipnego' ? ' TIPO DE NEGOCIO  : <br/>' : ' VENDEDOR  :<br/>';

            let title_ = venc === 'dnvenc' ? ' DEUDA NO VENCIDA  POR ' + titl_tip :
                venc === 'dvenc' ? ' DEUDA VENCIDA  POR ' + titl_tip : ' DEUDA TOTAL POR ' + titl_tip;

            let titlesub_ = doc === 'ddocall' ? ' FAC/BOL Y LETRAS' :
                doc === 'dfacbol' ? ' SOLO FACTURAS / BOLETAS ' :
                    doc === 'dletras' ? ' SOLO LETRAS ' : ' NO SE INGRESARON FILTROS  ';

            let qvec_filtro = venc === 'dnvenc' && doc === 'ddocall' ? ' SUM(T1.NOV_30DIAS) + SUM(NOV_30DIAS_L) + SUM(NOV_60DIAS) +SUM(NOV_60DIAS_L) + SUM(T1.NOV_90DIAS)  AS SUMAS ' :
                venc === 'dnvenc' && doc === 'dfacbol' ? ' SUM(T1.NOV_30DIAS) + SUM(NOV_60DIAS)   + SUM(T1.NOV_90DIAS) AS SUMAS ' :
                    venc === 'dnvenc' && doc === 'dletras' ? ' SUM(NOV_30DIAS_L)  + SUM(NOV_60DIAS_L) AS SUMAS ' :
                        venc === 'dvenc' && doc === 'ddocall' ? '  SUM(VENCIDO)  + SUM(VECMES) +SUM(VECMES_L) + SUM(T1.VENCIDO_L) AS SUMAS ' :
                            venc === 'dvenc' && doc === 'dfacbol' ? '  SUM(VENCIDO)  + SUM(VECMES) AS SUMAS ' : ' SUM(VECMES_L) + SUM(T1.VENCIDO_L)  AS SUMAS '
                ;


            const query = "SELECT " + qtipocolum + " ," + qvec_filtro + " FROM  TABLE( Clientes_Deuda_1.F_Deuda_Tnegocio(:emp,:per,1)) T1  group by " + qtipogroup;

            const params = { emp: emp, per: per };
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                let sum_total = 0, iRow;
                let datares = [];
                for (var i in result.rows) {
                    sum_total = sum_total + result.rows[i].SUMAS;
                    parseFloat(result.rows[i].SUMAS) > 0 ? datares.push({ 'name': result.rows[i].DE_TIPO, 'y': result.rows[i].SUMAS }) : null;
                }
                res.set('Content-Type', 'application/json');
                res.send({ 'title': title_, subtitle: titlesub_, 'total': sum_total, 'data': datares });
            });
        });
    },
    DatafiltroDeta: (req, res) => {
        const { emp, per } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = " SELECT (NV30+NV30L) AS NV30TOT, (NV60+NV60L) AS NV60TOT,(NV90) AS NV90TOT,(VE+VEL) AS VENC , (VEM+VEML) AS VENCMES FROM (Select SUM(T1.NOV_30DIAS) AS NV30,SUM(NOV_60DIAS) AS NV60,SUM(T1.NOV_90DIAS)AS NV90,SUM(VENCIDO) AS VE,SUM(VECMES) AS VEM,SUM(NOV_30DIAS_L) AS NV30L , SUM(NOV_60DIAS_L) AS NV60L,SUM(T1.VENCIDO_L) AS VEL,SUM(VECMES_L)AS VEML,SUM(DEUDA_TOTAL) AS DETOTAL,SUM(CUOTA_fAC),SUM(T1.CUOTA_LET),SUM(CUOTA_MENSUAL)From Table( Clientes_Deuda_1.F_Deuda_Tnegocio(:emp,:per,1)) T1) T2   ";
            const params = { emp: emp, per: per };
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'application/json');
                res.send([{
                    'name': 'NOVENCIDOS', 'id': 'NOVENCIDOS',
                    'data': [['NO VENCIDOS 30DIAS', result.rows[0].NV30TOT],
                    ['NO VENCIDOS 60DIAS', result.rows[0].NV60TOT],
                    ['NO VENCIDOS 90DIAS', result.rows[0].NV90TOT]
                    ]
                }, {
                    'name': 'VENCIDOS', 'id': 'VENCIDOS',
                    'data': [['VENCIDOS', result.rows[0].VENC],
                    ['VENCIDOS DEL MES', result.rows[0].VENCMES]
                    ]
                }]);
            });
        });
    },*/
};

module.exports = cr010902Controller;