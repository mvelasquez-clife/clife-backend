const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');

const responseParams = {
    outFormat: oracledb.OBJECT
};

const cr010902Controller = {
    Listadoper: (req, res) => {
        const  {emp} = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = " SELECT  co_periodo as value,de_nombre as label  FROM ma_peri_m WHERE CO_EMPRESA=:p_empresa AND CO_PERIODO > 201412 AND NU_MES > 0 order by CO_PERIODO DESC    ";
            const params = {p_empresa: emp};
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
    Datatotal: (req, res) => {
        const  {emp,per} = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = " SELECT (NV30 + NV60+NV90+NV30L+NV60L) AS NOVENCIDOS,(VE+VEM+VEL+VEML)  AS VENCIDOS,T2.DETOTAL AS DEUTOTAL FROM (Select SUM(T1.NOV_30DIAS) AS NV30,SUM(NOV_60DIAS) AS NV60,SUM(T1.NOV_90DIAS)AS NV90,SUM(VENCIDO) AS VE,SUM(VECMES) AS VEM,SUM(NOV_30DIAS_L) AS NV30L ,            SUM(NOV_60DIAS_L) AS NV60L,SUM(T1.VENCIDO_L) AS VEL,SUM(VECMES_L)AS VEML,SUM(DEUDA_TOTAL) AS DETOTAL,SUM(CUOTA_fAC),SUM(T1.CUOTA_LET),SUM(CUOTA_MENSUAL) From Table( Clientes_Deuda_1.F_Deuda_Tnegocio(:emp,:per)) T1) T2   ";
            const params = {emp: emp, per:per};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'application/json');
                res.send({'total' : result.rows[0].DEUTOTAL,'data' : [{ 'name' :'VENCIDOS', 'y' :result.rows[0].VENCIDOS,'drilldown':'VENCIDOS' },
                     {'name' :'NOVENCIDOS', 'y' :result.rows[0].NOVENCIDOS,'drilldown':'NOVENCIDOS'}
                   ]
                }); 
            });
        });
    },
    DatatotalDeta: (req, res) => {
        const  {emp,per} = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = " SELECT (NV30+NV30L) AS NV30TOT, (NV60+NV60L) AS NV60TOT,(NV90) AS NV90TOT,(VE+VEL) AS VENC , (VEM+VEML) AS VENCMES FROM (Select SUM(T1.NOV_30DIAS) AS NV30,SUM(NOV_60DIAS) AS NV60,SUM(T1.NOV_90DIAS)AS NV90,SUM(VENCIDO) AS VE,SUM(VECMES) AS VEM,SUM(NOV_30DIAS_L) AS NV30L , SUM(NOV_60DIAS_L) AS NV60L,SUM(T1.VENCIDO_L) AS VEL,SUM(VECMES_L)AS VEML,SUM(DEUDA_TOTAL) AS DETOTAL,SUM(CUOTA_fAC),SUM(T1.CUOTA_LET),SUM(CUOTA_MENSUAL)From Table( Clientes_Deuda_1.F_Deuda_Tnegocio(:emp,:per)) T1) T2   ";
            const params = {emp: emp, per:per};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'application/json');
                res.send([{'name' : 'NOVENCIDOS','id' : 'NOVENCIDOS',
                'data' : [[   'NO VENCIDOS 30DIAS',  result.rows[0].NV30TOT ],
                          [   'NO VENCIDOS 60DIAS',  result.rows[0].NV60TOT ],
                          [ 'NO VENCIDOS 90DIAS',  result.rows[0].NV90TOT ]
                   ]
                },{'name' : 'VENCIDOS','id' : 'VENCIDOS',
                'data' : [[  'VENCIDOS',  result.rows[0].VENC ],
                          [  'VENCIDOS DEL MES', result.rows[0].VENCMES ]
                   ]
                }]); 
            });
        });
    },
    Datafiltro: (req, res) => {
        const  {emp,per,tipo,venc,doc} = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
          //  console.log(emp,per,tipo,venc,doc);
          let qtipocolum  =  tipo === 'gtipnego' ? ' T1.CO_TIPO_NEGOCIO , T1.DE_TIPO_NEGOCIO AS DE_TIPO ' : ' T1.CO_VENDEDOR, T1.DE_VENDEDOR AS DE_TIPO';
          let qtipogroup =  tipo === 'gtipnego' ? ' T1.CO_TIPO_NEGOCIO , T1.DE_TIPO_NEGOCIO   ' : ' T1.CO_VENDEDOR, T1.DE_VENDEDOR ';
          let titl_tip=  tipo === 'gtipnego' ? ' TIPO DE NEGOCIO  : <br/>' : ' VENDEDOR  :<br/>';

          let title_ = venc === 'dnvenc'   ? ' DEUDA NO VENCIDA  POR '+titl_tip : 
                            venc === 'dvenc'   ?  ' DEUDA VENCIDA  POR '+titl_tip  :  ' DEUDA TOTAL POR '+titl_tip                ;

          let titlesub_ =   doc === 'ddocall' ? ' FAC/BOL Y LETRAS': 
                doc === 'dfacbol' ? ' SOLO FACTURAS / BOLETAS ' : 
                doc === 'dletras' ?  ' SOLO LETRAS ' : ' NO SE INGRESARON FILTROS  '  ;

          let qvec_filtro = venc === 'dnvenc' && doc === 'ddocall' ? ' SUM(T1.NOV_30DIAS) + SUM(NOV_30DIAS_L) + SUM(NOV_60DIAS) +SUM(NOV_60DIAS_L) + SUM(T1.NOV_90DIAS)  AS SUMAS ': 
                            venc === 'dnvenc' && doc === 'dfacbol' ? ' SUM(T1.NOV_30DIAS) + SUM(NOV_60DIAS)   + SUM(T1.NOV_90DIAS) AS SUMAS ' : 
                            venc === 'dnvenc' && doc === 'dletras' ?  ' SUM(NOV_30DIAS_L)  + SUM(NOV_60DIAS_L) AS SUMAS ' : 
                            venc === 'dvenc' && doc === 'ddocall' ?  '  SUM(VENCIDO)  + SUM(VECMES) +SUM(VECMES_L) + SUM(T1.VENCIDO_L) AS SUMAS ' : 
                            venc === 'dvenc' && doc === 'dfacbol' ? '  SUM(VENCIDO)  + SUM(VECMES) AS SUMAS ' : ' SUM(VECMES_L) + SUM(T1.VENCIDO_L)  AS SUMAS '
               ;
          
          
          const query = "SELECT " + qtipocolum+ " ,"+ qvec_filtro + " FROM  TABLE( Clientes_Deuda_1.F_Deuda_Tnegocio(:emp,:per)) T1  group by " + qtipogroup;
          console.log(query);
            const params = {emp: emp, per:per};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                let sum_total = 0,iRow;
                 let datares = [];
                  //console.log(result.rows);
                for(var i in result.rows) {
                      //iRow = result.rows[i];
                      sum_total = sum_total + result.rows[i].SUMAS;
                     parseFloat(result.rows[i].SUMAS) > 0  ? datares.push({'name':result.rows[i].DE_TIPO ,'y' : result.rows[i].SUMAS }) : null ;
                }

               res.set('Content-Type', 'application/json');
                res.send({'title' : title_, subtitle : titlesub_ , 'total' : sum_total,'data' : datares }); 
 
            });
        });
    },
    DatafiltroDeta: (req, res) => {
        const  {emp,per} = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ 'error_conexion': err.stack });
                return;
            }
            const query = " SELECT (NV30+NV30L) AS NV30TOT, (NV60+NV60L) AS NV60TOT,(NV90) AS NV90TOT,(VE+VEL) AS VENC , (VEM+VEML) AS VENCMES FROM (Select SUM(T1.NOV_30DIAS) AS NV30,SUM(NOV_60DIAS) AS NV60,SUM(T1.NOV_90DIAS)AS NV90,SUM(VENCIDO) AS VE,SUM(VECMES) AS VEM,SUM(NOV_30DIAS_L) AS NV30L , SUM(NOV_60DIAS_L) AS NV60L,SUM(T1.VENCIDO_L) AS VEL,SUM(VECMES_L)AS VEML,SUM(DEUDA_TOTAL) AS DETOTAL,SUM(CUOTA_fAC),SUM(T1.CUOTA_LET),SUM(CUOTA_MENSUAL)From Table( Clientes_Deuda_1.F_Deuda_Tnegocio(:emp,:per)) T1) T2   ";
            const params = {emp: emp, per:per};
            conn.execute(query, params, responseParams, (error, result) => {
                if (error) {
                    res.send({ 'error_query': error.stack });
                    conn.close();
                    return;
                }
                res.set('Content-Type', 'application/json');
                res.send([{'name' : 'NOVENCIDOS','id' : 'NOVENCIDOS',
                'data' : [[   'NO VENCIDOS 30DIAS',  result.rows[0].NV30TOT ],
                          [   'NO VENCIDOS 60DIAS',  result.rows[0].NV60TOT ],
                          [ 'NO VENCIDOS 90DIAS',  result.rows[0].NV90TOT ]
                   ]
                },{'name' : 'VENCIDOS','id' : 'VENCIDOS',
                'data' : [[  'VENCIDOS',  result.rows[0].VENC ],
                          [  'VENCIDOS DEL MES', result.rows[0].VENCMES ]
                   ]
                }]); 
            });
        });
    },
};

module.exports = cr010902Controller;