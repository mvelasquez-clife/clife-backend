const oracledb = require('oracledb');//const db = require('./../../server/libs/db-oracle');
const dbParams = require('../../database');
const xmlParser = require('../../xml-parser');
const db = require('./../../libs/db-oracle');
const responseParams = {
    outFormat: oracledb.OBJECT
};

const vt010124Controller = {

    Gridctacte: (req, res) => {
        const { cocliente, empr } = req.params;
        oracledb.getConnection(dbParams, (err, conn) => {
            if (err) {
                res.send({ state: 'error', error_conexion: err.stack });
                return;
            }
            const query = "SELECT T1.*,'docgdevo.png','docblue.png','upload_24.png' FROM TABLE(PW_VT010124.F_DATACTACTE(:xcliente,:xemp)) T1 "; //'redo.gif','new.gif'
            const params = { xcliente: cocliente, xemp: empr };
            conn.execute(query, params, responseParams, (error, result) => {
                conn.close();
                if (error) {
                    res.send({ 'error_query': error.stack });
                    return;
                }
                if (result.rows[0].MA_FILE_FISI != 0){
                    res.set('Content-Type', 'text/xml');
                    res.send(xmlParser.renderXml(result.rows));
                }else{
                    res.set('Content-Type', 'application/json');
                    res.send({'nodata' : 'nodata'});
                }
            });
        });
    },
    Gridetalledvl: async (req, res) => {
        const { gdvl, empr } = req.params;
        let query = " SELECT * FROM TABLE(PACK_NEW_VENTAS_NOTA_CRDB.F_LIS_GUIA_DEVO_DET(:xemp,:gdvl))";
        let params = [
            { name: 'gdvl', io: 'in', value: gdvl }, { name: 'xemp', io: 'in', value: empr }
        ];
        let result = await db.select(query, params);
        res.set('Content-Type', 'text/xml');
        res.send(xmlParser.renderXml(result.rows));
    },
    Gridetalle: async (req, res) => {
        const { doc, empr } = req.params;
        let query = "SELECT MD.CO_CATALOGO_PRODUCTO AS CO_CATALOGO_PRODUCTO,MA.DE_NOMBRE AS DE_NOMBRE,PACK_PACKING2.Fc_ConjuntoLotePediFact(MD.co_empresa||'@*@'||MC.co_pedido||'@*@'||MC.co_pedido_facturado||'@*@'||MD.co_catalogo_producto) as lote,md.co_diferenciador,md.st_tipo_venta,MD.NU_CANTIDAD AS NU_CANTIDAD,MD.IM_PRECIO_UNITARIO AS IM_PRECIO_UNITARIO,MD.IM_FINAL AS IM_FINAL,'0' as C_NOTA             from MA_FILE_FISI_VENT_D MD         LEFT JOIN MA_FILE_FISI_VENT_C MC ON mc.co_file_fisico_venta_final = md.co_file_fisico_venta_final         left join  MA_CATA_PROD_M MA on MA.CO_CATALOGO_PRODUCTO = MD.CO_CATALOGO_PRODUCTO         where MD.CO_FILE_FISICO_VENTA_FINAL = :xdoc AND md.co_empresa=:xemp";
        let params = [
            { name: 'xdoc', io: 'in', value: doc }, { name: 'xemp', io: 'in', value: empr }
        ];
        let result = await db.select(query, params);
        res.set('Content-Type', 'text/xml');
        res.send(xmlParser.renderXml(result.rows));
    },
    Motiprenc: async (req, res) => {
        let query = "   SELECT DE_MOTIVO_RETORNO AS LABEL,CO_MOTIVO_RETORNO AS VALUE FROM TABLE(PACK_NEW_VENTAS_NOTA_CRDB.F_LIS_MOTI_BACK_PROD_M())";
        let params = [];
        let result = await db.select(query, params);
        res.set('Content-Type', 'text/xml');
        res.send(xmlParser.renderSelect(result.rows, 'Vigente'));
    },
    Concept_nc: async (req, res) => {
        const { xemp, xtipodoc,xstrelac } = req.params;
        let query = 'SELECT CO_CONCEPTO AS VALUE,DE_CONCEPTO  AS LABEL FROM TABLE(PACK_NEW_VENTAS_NOTA_CRDB.F_LIS_CONC_NOTA_CR_DE_VENT(:xemp,:xtipodoc,:xstrelac)) ';
        let params = [
            { name: 'xemp', io: 'in', value: xemp },
            { name: 'xtipodoc', io: 'in', value: xtipodoc }, 
            { name: 'xstrelac', io: 'in', value: xstrelac }
        ];
        let result = await db.select(query, params);
        res.set('Content-Type', 'text/xml');
        res.send(xmlParser.renderSelect(result.rows, 'Vigente'));
    },
    Motidevo: async (req, res) => {
        let query = '  SELECT DE_MOTI_DEVO AS LABEL,CO_MOTI_DEVO AS VALUE FROM TABLE(PACK_NEW_VENTAS_NOTA_CRDB.F_LIS_MOTI_DEVO)';
        let params = [];
        let result = await db.select(query, params);
        res.set('Content-Type', 'text/xml');
        res.send(xmlParser.renderSelect(result.rows, 'Vigente'));
    },
    ListAlm: async (req, res) => {
        let query = ' SELECT de_descripcion AS LABEL,co_codigo AS VALUE FROM  TABLE (PACK_NEW_SOURCES.F_LIST_LUPA_GENERAL(23,11,3))';
        let params = [];
        let result = await db.select(query, params);
        res.set('Content-Type', 'text/xml');
        res.send(xmlParser.renderSelect(result.rows, 'Vigente'));
    },
    DatosIniciales: async (request, response) => {
        const { xemp, xrucdni,xdoc } = request.body;
        let params = [
            { name: 'xemp', io: 'in', value: xemp },
            { name: 'xrucdni', io: 'in', value: xrucdni },
            { name: 'xdoc', io: 'in', value: xdoc },
            { name: 'coserie', io: 'out', type: 'number' },
            { name: 'deseriedevo', io: 'out', type: 'string' },
            { name: 'periodoact', io: 'out', type: 'string' },
            { name: 'fecha', io: 'out', type: 'string' },
            { name: 'st_relac', io: 'out', type: 'string' },
            { name: 'xtipodoc', io: 'out', type: 'string' }
        ];
        let result = await db.resultSet('call PW_VT010124.sp_datos_iniciales(:xemp,:xrucdni,:xdoc,:coserie, :deseriedevo , :periodoact  ,:fecha,:st_relac,:xtipodoc)', params);
        response.json({
            data: {
                coserie: result.coserie,
                seriedevo: result.deseriedevo,
                periodoact: result.periodoact,
                fecha: result.fecha,
                relacion :  result.st_relac,
                xtipodoc :  result.xtipodoc
            }
        });
    },
    Creaprenotac: async (request, response) => {
        const { x_empresa, x_usuario, x_periodo,  x_guia_devo, 
            x_serie_nc, x_concepto_nc  , x_nu_items, x_cad_co_prod,  x_cad_lote_cad,x_cad_cant,x_cad_tipo_vent  ,x_cad_moti_devo,
            y_cad_dif,x_pre_unit_cad,x_cad_sub_total } = request.body;
        let query = 'call PACK_NEW_VENTAS_NOTA_CRDB.SP_GENERAR_PRE_NOTA_CRED_DEVO(:x_result,:x_de_result,:x_empresa,:x_usuario,:x_periodo,:x_guia_devo,:x_serie_nc,:x_concepto_nc,:x_nu_items,:x_cad_co_prod,:x_cad_lote_cad,:x_cad_cant,:x_cad_tipo_vent,:x_cad_moti_devo,:y_cad_dif,:x_pre_unit_cad,:x_cad_sub_total)';
          let params = [
            { name: 'x_empresa', io: 'in', value: x_empresa },
            { name: 'x_usuario', io: 'in', value: x_usuario },
            { name: 'x_periodo', io: 'in', value: x_periodo },
            { name: 'x_guia_devo', io: 'in', value: x_guia_devo },
            { name: 'x_serie_nc', io: 'in', value: x_serie_nc },
            { name: 'x_concepto_nc', io: 'in', value: x_concepto_nc },
            { name: 'x_nu_items', io: 'in', value: x_nu_items },
            { name: 'x_cad_co_prod', io: 'in', value: x_cad_co_prod },
            { name: 'x_cad_lote_cad', io: 'in', value: x_cad_lote_cad },
            { name: 'x_cad_cant', io: 'in', value: x_cad_cant },
            { name: 'x_cad_tipo_vent', io: 'in', value: x_cad_tipo_vent },
            { name: 'x_cad_moti_devo', io: 'in', value: x_cad_moti_devo },
            { name: 'y_cad_dif', io: 'in', value: y_cad_dif },
            { name: 'x_pre_unit_cad', io: 'in', value: x_pre_unit_cad },
            { name: 'x_cad_sub_total', io: 'in', value: x_cad_sub_total },
            { name: 'x_result', io: 'out', type: 'number' },
            { name: 'x_de_result', io: 'out', type: 'string' }
        ];
        console.log(params);
        let out = []
        let result = await db.resultSet(query, params);
        out.push(result.x_result);
        out.push(result.x_de_result);
        response.json({
            result: out
        });
    },

    Creagdvl: async (request, response) => {
        const { x_empresa, x_usuario, x_periodo, x_co_serie,x_fe_venc,x_co_alma,x_cad_prod,x_cad_cant,x_cad_prec,x_cad_lote,x_cad_tipo,x_cant_items,x_nu_doc,x_moti_devo,x_cad_monto,x_cad_dif } = request.body;
        let query = 'call PACK_NEW_VENTAS_NOTA_CRDB.SP_GENERAR_NOTA_DEVO_V2(:x_result,:x_de_result,:x_empresa,:x_usuario,:x_periodo,:x_co_serie,:x_fe_venc,:x_co_alma,:x_cad_prod,:x_cad_cant,:x_cad_prec,:x_cad_lote,:x_cad_tipo,:x_cant_items,:x_nu_doc,:x_moti_devo,:x_cad_monto,:x_cad_dif)';
        /*                                PROCEDURE SP_GENERAR_NOTA_DEVO_V2 (x_result ,x_de_result ,x_empresa ,x_usuario ,x_periodo ,x_co_serie ,x_fe_venc ,x_co_alma ,x_cad_prod ,x_cad_cant ,x_cad_prec, x_cad_lote ,x_cad_tipo ,x_cant_items ,x_nu_doc ,x_moti_devo, x_cad_monto, x_cad_dif);*/
        let params = [
            { name: 'x_empresa', io: 'in', value: x_empresa },
            { name: 'x_usuario', io: 'in', value: x_usuario },
            { name: 'x_periodo', io: 'in', value: x_periodo },
            { name: 'x_co_serie', io: 'in', value: x_co_serie },
            { name: 'x_fe_venc', io: 'in', value: x_fe_venc,type: 'date' },
            { name: 'x_co_alma', io: 'in', value: x_co_alma },
            { name: 'x_cad_prod', io: 'in', value: x_cad_prod },
            { name: 'x_cad_cant', io: 'in', value: x_cad_cant },
            { name: 'x_cad_prec', io: 'in', value: x_cad_prec },
            { name: 'x_cad_lote', io: 'in', value: x_cad_lote },
            { name: 'x_cad_tipo', io: 'in', value: x_cad_tipo },
            { name: 'x_cant_items', io: 'in', value: x_cant_items },
            { name: 'x_nu_doc', io: 'in', value: x_nu_doc },
            { name: 'x_moti_devo', io: 'in', value: x_moti_devo },
            { name: 'x_cad_monto', io: 'in', value: x_cad_monto },
            { name: 'x_cad_dif', io: 'in', value: x_cad_dif },
            { name: 'x_result', io: 'out', type: 'number' },
            { name: 'x_de_result', io: 'out', type: 'string' }
        ];
        let out = []
        let result = await db.resultSet(query, params);
        out.push(result.x_result);
        out.push(result.x_de_result);
        response.json({
            result: out
        });
    },
    List_SerNC: async (request, response) => {
        const { xemp,xdoc } = request.body;
        let query = 'call PW_VT010124.sp_listncredito (:xemp, :xdoc,:o_num_lnc,:o_gncdto)';
        let params = [
            { name: 'xemp', io: 'in', value: xemp },
            { name: 'xdoc', io: 'in', value: xdoc },
            { name: 'o_num_lnc', io: 'out',  type: 'number' },
            { name: 'o_gncdto', io: 'out', type: 'cursor' }
        ];
        let out = [];
        let result = await db.resultSet(query, params);
        out.push(result.o_num_lnc);
        out.push(result.o_gncdto);
        response.json({
            result: out
        });
        //console.log(result);
    },
    Datadfevolu: async (request, response) => {
        const { xemp,xdoc } = request.body;
        let query = 'call PW_VT010124.sp_guiadevolucion (:xemp, :xdoc,:num_g,:datagdv)';
        let params = [
            { name: 'xemp', io: 'in', value: xemp },
            { name: 'xdoc', io: 'in', value: xdoc },
            { name: 'num_g', io: 'out',  type: 'number' },
            { name: 'datagdv', io: 'out', type: 'cursor' }
        ];
        let out = [];
        let result = await db.resultSet(query, params);
        out.push(result.num_g);
        out.push(result.datagdv);
        response.json({
            result: out
        });
       // console.log(result);
    },

};

module.exports = vt010124Controller;