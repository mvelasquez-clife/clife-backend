const oracledb = require('oracledb');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');

const responseParams = {
    outFormat: oracledb.OBJECT
};

const vt010108Controller = {
    GridCVenta: (req, res) => {
    const {  emp  } = req.params; console.log('GridCVenta');
       oracledb.getConnection(dbParams, (err, conn) => {
           if (err) {
               res.send({ state: 'error', error_conexion: err.stack });
               return;
           }
           const query = "    SELECT VT_CANA_VENT_M.CO_CANAL_VENTA, VT_CANA_VENT_M.DE_NOMBRE, VT_CANA_VENT_M.ES_VIGENCIA,CASE ES_VIGENCIA WHEN 'Vigente' THEN '../distribute.png'  ELSE '../none.png' END AS TNEGO,CASE ES_VIGENCIA WHEN 'Vigente' THEN '../ic-edit.png'  ELSE '../none.png' END AS EDIT, CASE ES_VIGENCIA WHEN 'Vigente' THEN '../ic-delete.png'  ELSE '../ic-add.png' END AS DELET    FROM VT_CANA_VENT_M WHERE VT_CANA_VENT_M.CO_EMPRESA = :xempresa ";
           const params = {xempresa : {val : emp }  };
           conn.execute(query, params, responseParams, (error, result) => {
               conn.close();
               if (error) {
                   res.send({ 'error_query': error.stack });
                   return;
               }
               res.set('Content-Type', 'text/xml');
               res.send(xmlParser.renderXml(result.rows));
             });
       });
   },
   GuardarCVenta: async (req, res) => {
    let {emp,usuario, codigo, nombre, estado} = req.body;  // console.log(emp,usuario, codigo, nombre, estado);
        let conn = await oracledb.getConnection(dbParams);
        let query = "call PW_VT010108.SP_UPDATE_CVENTAS(:xemp,:xusuario,:tn_codigo,:tn_nombre, :tn_estado,:o_codigo,:o_mensaje)";
        let params = {
            xemp: { val: emp },
            xusuario: { val: usuario },
            tn_codigo: { val: codigo },
            tn_nombre: { val: nombre },
            tn_estado: { val: estado },
            o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
            o_mensaje: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
        }
        conn.execute(query,params, responseParams, (error, result) => {console.log(error,result);
            let { o_codigo, o_mensaje } = result.outBinds;
           if (error) {
                res.json({ state: 'error', codsend: 0, txtsend: error});
            }else{
                res.json({ state: 'success', codsend: o_codigo, txtsend: o_mensaje   });
            }
        });
},
   ////////////////////////////////////////////////////////////

    SaveCoutadata: async (req, res) => {
        let {empresa, usuario, codigo, mvenc, mvencm, mvenc30,mvenc60,mvenc90,mvsttn} = req.body;   //console.log(emp, codigo, nombre, descripcion, monto, estado);
            let conn = await oracledb.getConnection(dbParams);
            let query = "call PW_VT010102.SP_UPDATECUOTA_TNEGO(:xempresa,:xusuario,:codigo,:mvenc,:mvencm,:mvenc30,:mvenc60,:mvenc90,:mvsttn,:o_codigo,:o_mensaje)";
            let params = {
                xempresa: { val: empresa },
                xusuario: { val: usuario },
                codigo: { val: codigo },
                mvenc: { val: mvenc },
                mvencm: { val: mvencm },
                mvenc30: { val: mvenc30 },
                mvenc60: { val: mvenc60 },
                mvenc90 : {val: mvenc90 },
                mvsttn : { val : mvsttn },
                o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_mensaje: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            }
            conn.execute(query,params, responseParams, (error, result) => {console.log(error,result);
                let { o_codigo, o_mensaje } = result.outBinds;
                if (error) {
                    res.json({state: 'error', codsend: 0, txtsend: error});
                }else{
                    res.json({state: 'success', codsend: o_codigo, txtsend: o_mensaje });
                }
            });
    },
    FormCoutadata: (req, res) => {
        const  {emp,cod} = req.body; 
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({state: 'error', error_conexion: err.stack});
                return;
            }
            const query = ' SELECT CTN.*,tn.de_nombre FROM VT_CUOT_TIPO_NEGO_D CTN LEFT JOIN vt_tipo_nego_m TN ON tn.co_tipo_negocio = CTN.CO_TIPO_NEGOCIO WHERE  CTN.CO_EMPRESA=:co_emp and  CTN.CO_TIPO_NEGOCIO=:co_tipo ';
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

   

};

module.exports = vt010108Controller;