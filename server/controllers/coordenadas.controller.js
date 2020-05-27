const oracledb = require('oracledb');
const dbParams = require('../database');
const xmlParser = require('../xml-parser');
const fetch = require("node-fetch");

const responseParams = {
    outFormat: oracledb.OBJECT
};

const CoordenadasController = {
    main: (req, res) => {
        res.render('./../client/views/home/coordenadas.ejs');
    },
    geocode: (request, response) => {
        response.render('./../client/views/home/geocode.ejs');
    },
    //
    CargaListaClientes: async (request,response) => {
        let { vendedor, empresa } = request.params;
        let result;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select ruc as \"ruc\", rzs as \"rzs\", ncm as \"ncm\" " +
                "from table(pack_new_ventas.f_list_dire_zc_cli_x_vend(:p_empresa,:p_vendedor)) " +
                "order by rzs";
            let params = {
                p_empresa: { val: empresa },
                p_vendedor: { val: vendedor }
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
    CargaListaDirecciones: async (request,response) => {
        let { cliente } = request.params;
        let result;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select case st_observar when 'S' then 'ic-alert.svg' else 'ic-blank.svg' end \"observar\",departamento || '-' || provincia || '-' || de_distrito,direccion,es_vigencia_direccion,nu_latitud,nu_longitud,co_direccion_entidad ID from v_dire_entidad where co_catalogo_entidad = :p_cliente and st_erased = 0";
            let params = {
                p_cliente: { val: cliente }
            };
            result = await conn.execute(query, params, responseParams);
            response.set('Content-Type', 'text/xml');
            response.send(xmlParser.renderXml(result.rows));
        }
        catch(error) {
            response.json({
                error: error
            });
            console.log(error);
        }
    },
    InfoDireccion: async (request,response) => {
        let { codireccion } = request.body;
        let result;
        try {
            const xPais = 177;
            let conn = await oracledb.getConnection(dbParams);
            // carga datos de la direccion
            let query = "call pack_new_direcciones.sp_datos_direccion(:p_codireccion, :o_departamento, :o_provincia, :o_ubigeo, :o_via, :o_nomvia, :o_zona, :o_nomzona, :o_numero, :o_interior, :o_referencias, :o_direccion, :o_latitud, :o_longitud, :o_cliente)";
            let params = {
                p_codireccion: { val: codireccion },
                o_departamento: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_provincia: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_ubigeo: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                o_via: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_nomvia: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                o_zona: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_nomzona: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                o_numero: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_interior: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                o_referencias: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                o_direccion: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                o_latitud: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_longitud: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_cliente: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
            };
            result = await conn.execute(query, params, responseParams);
            let { o_departamento, o_provincia, o_ubigeo, o_via, o_nomvia, o_zona, o_nomzona, o_numero, o_interior, o_referencias, o_direccion, o_latitud, o_longitud, o_cliente } = result.outBinds;
            // combo vias
            query = "select * from table(pack_new_direcciones.f_combo_vias)";
            params = {};
            result = await conn.execute(query, params, responseParams);
            const vias = result.rows;
            // combo zonas
            query = "select * from table(pack_new_direcciones.f_combo_zonas)";
            params = {};
            result = await conn.execute(query, params, responseParams);
            const zonas = result.rows;
            // combo departamentos
            query = "select * from table(pack_new_direcciones.f_combo_departamentos(:p_pais))";
            params = {
                p_pais: xPais
            };
            result = await conn.execute(query, params, responseParams);
            const departamentos = result.rows;
            // combo provincias
            query = "select * from table(pack_new_direcciones.f_combo_provincias(:p_pais, :p_departamento))";
            params = {
                p_pais: xPais,
                p_departamento: o_departamento
            };
            result = await conn.execute(query, params, responseParams);
            const provincias = result.rows;
            // combo distritos
            query = "select * from table(pack_new_direcciones.f_combo_distritos(:p_pais, :p_departamento, :p_provincia))";
            params = {
                p_pais: xPais,
                p_departamento: o_departamento,
                p_provincia: o_provincia
            };
            result = await conn.execute(query, params, responseParams);
            const distritos = result.rows;
            // listo
            response.json({
                data: {
                    direccion: {
                        departamento: o_departamento,
                        provincia: o_provincia,
                        ubigeo: o_ubigeo,
                        via: o_via,
                        nomvia: o_nomvia,
                        zona: o_zona,
                        nomzona: o_nomzona,
                        numero: o_numero,
                        interior: o_interior,
                        referencias: o_referencias,
                        direccion: o_direccion,
                        latitud: o_latitud,
                        longitud: o_longitud,
                        cliente: o_cliente
                    },
                    combos: {
                        vias: vias,
                        zonas: zonas,
                        departamentos: departamentos,
                        provincias: provincias,
                        distritos: distritos
                    }
                }
            });
        }
        catch(error) {
            response.json({
                error: error
            });
            console.log(error);
        }
    },
    GuardarInformacionCoordenadas: async (request,response) => {
        let { codire, ubigeo, via, nomvia, zona, nomzona, numero, interior, referencias, latitud, longitud } = request.body;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "call pack_new_direcciones.sp_actualiza_direccion (:o_codigo, :o_mensaje, :p_codireccion, :p_ubigeo, :p_via, :p_nomvia, :p_zona, :p_nomzona, :p_numero, :p_interior, :p_referencias, :p_latitud, :p_longitud)";
            let params = {
                o_codigo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                o_mensaje: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                p_codireccion: { val: codire },
                p_ubigeo: { val: ubigeo },
                p_via: { val: via },
                p_nomvia: { val: nomvia },
                p_zona: { val: zona },
                p_nomzona: { val: nomzona },
                p_numero: { val: numero },
                p_interior: { val: interior },
                p_referencias: { val: referencias },
                p_latitud: { val: latitud },
                p_longitud: { val: longitud }
            };
            const result = await conn.execute(query, params, responseParams);
            let { o_codigo, o_mensaje } = result.outBinds;
            if (o_codigo == 1) {
                response.json({
                    res: 'ok'
                });
            }
            else {
                response.json({
                    error: o_mensaje
                });
            }
        }
        catch(error) {
            response.json({
                error: error
            });
            console.log(error);
        }
    },
    ObservarDireccion: async (request,response) => {
        let { cliente, direccion } = request.body;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "update ma_dire_enti_m set st_observar = 'S' where co_catalogo_entidad = :p_cliente and co_direccion_entidad = :p_direccion";
            let params = {
                p_cliente: { val: cliente },
                p_direccion: { val: direccion }
            };
console.log(query,params);
            await conn.execute(query, params, { autoCommit: true });
            response.json({
                res: 'ok'
            });
        }
        catch(error) {
            response.json({
                error: error
            });
            console.log(error);
        }
    },
    //
    ListaPaises: async (request,response) => {
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select ds.co_pais \"value\",ps.de_nombre \"text\" " +
                "from vt_pedi_t pt join ma_dist_m ds on pt.co_ubigeo = ds.co_ubigeo join ma_pais_m ps on ps.co_pais = ds.co_pais " +
                "where pt.co_empresa = 11 " +
                "group by ds.co_pais,ps.de_nombre " +
                "order by count(1) desc";
            let params = {};
            let result = await conn.execute(query, params, responseParams);
            response.json({
                options: result.rows
            });
        }
        catch(err) {
            console.error(err);
            return response.json({
                error: err
            });
        }
    },
    ListaVendedores: async (request,response) => {
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select vvm.co_vendedor \"value\",sgum.de_nombre \"text\" " +
                "from vt_vend_m vvm " +
                "join sg_usua_m sgum on vvm.co_vendedor = sgum.co_usuario and vvm.co_empresa = sgum.co_empresa_usuario " +
                "where vvm.es_vigencia = 'Vigente' " +
                "and sgum.es_vigencia = 'Vigente' " +
                "and vvm.co_empresa = 11 " +
                "order by sgum.de_nombre asc";
            let params = {};
            let result = await conn.execute(query, params, responseParams);
            response.json({
                options: result.rows
            });
        }
        catch(err) {
            console.error(err);
            return response.json({
                error: err
            });
        }
    },
    ListaDepartamentos: async (request,response) => {
        let { pais } = request.params;
        let result;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select co_departamento \"value\",de_nombre \"text\" from ma_depa_m where co_pais = :p_pais order by de_nombre asc";
            let params = { p_pais: pais };
            result = await conn.execute(query, params, responseParams);
            response.json({
                options: result.rows
            });
        }
        catch(err) {
            console.error(err);
            return response.json({
                error: err
            });
        }
    },
    ListaProvincias: async (request,response) => {
        let { pais, departamento } = request.params;
        let result;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select co_provincia \"value\",de_nombre \"text\" from ma_pcia_m where co_pais = :p_pais and co_departamento = :p_departamento order by co_provincia asc";
            let params = {
                p_pais: pais,
                p_departamento: departamento
            };
            result = await conn.execute(query, params, responseParams);
            response.json({
                options: result.rows
            });
        }
        catch(err) {
            console.error(err);
            return response.json({
                error: err
            });
        }
    },
    ListaDistritos: async (request,response) => {
        let { pais, departamento, provincia } = request.params;
        let result;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select co_ubigeo \"value\",de_nombre \"text\" from ma_dist_m where co_pais = :p_pais and co_departamento = :p_departamento and co_provincia = :p_provincia order by co_distrito asc";
            let params = {
                p_pais: pais,
                p_departamento: departamento,
                p_provincia: provincia
            };
            result = await conn.execute(query, params, responseParams);
            response.json({
                options: result.rows
            });
        }
        catch(err) {
            console.error(err);
            return response.json({
                error: err
            });
        }
    },
    ListaDirecciones: async (request, response) => {
        let { ubigeo } = request.params;
        let result;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select vcm.co_cliente,mdem.co_direccion_entidad ID,'ic-blank.svg^','0' rcheck,vcm.de_razon_social,mdm.de_nombre,nvl(mdem.de_direccion_sunat,(select de_direccion from v_dire_entidad where co_direccion_entidad = mdem.co_direccion_entidad)) de_direccion " +
                "from ma_dire_enti_m mdem " +
                "join vt_clie_m vcm on mdem.co_catalogo_entidad = vcm.co_cliente " +
                "join ma_dist_m mdm on mdem.co_ubigeo = mdm.co_ubigeo " +
                "where mdem.co_ubigeo = :p_ubigeo and mdem.st_dupli_zc_fv = 'N' " +
                "and mdem.nu_latitud is null and mdem.nu_longitud is null " +
                "and mdem.st_dupli_zc_fv = 'N' and mdem.st_erased = '0' " +
                "and vcm.co_empresa = 11";
            let params = {
                p_ubigeo: ubigeo
            };
            result = await conn.execute(query, params, responseParams);
            response.set('Content-Type', 'text/xml');
            response.send(xmlParser.renderXml(result.rows));
        }
        catch(err) {
            console.error(err);
            return response.json({
                error: err
            });
        }
    },
    ListaDireccionesVendedor: async (request, response) => {
        let { vendedor } = request.params;
        let result;
        try {
            let conn = await oracledb.getConnection(dbParams);
            let query = "select ruc,dir ID,'ic-blank.svg^','0' rcheck,rzs,f_g_split(distrito,'-',1) distrito,sdr " +
                "from table (pack_new_ventas.f_list_dire_zc_cli_x_vend_v2(:p_empresa,:p_vendedor)) " +
                "where lat = 0 or lon = 0 " +
                "order by distrito";
            let params = {
                p_empresa: 11,
                p_vendedor: vendedor
            };
            result = await conn.execute(query, params, responseParams);
            response.set('Content-Type', 'text/xml');
            response.send(xmlParser.renderXml(result.rows));
        }
        catch(err) {
            console.error(err);
            return response.json({
                error: err
            });
        }
    },
    GuardarCoordenadas: async (request, response) => {
        let { direcciones } = request.body;
        direcciones = JSON.parse(direcciones);
        try {
            oracledb.autoCommit = true;
            let conn = await oracledb.getConnection(dbParams);
            let query = "update ma_dire_enti_m set nu_latitud = :p_latitud, nu_longitud = :p_longitud where co_direccion_entidad = :p_direccion";
            let params;
            for(let direccion of direcciones) {
                params = {
                    p_latitud: direccion.latitud,
                    p_longitud: direccion.longitud,
                    p_direccion: direccion.codigo
                };
                await conn.execute(query, params, responseParams);
            }
            response.json({
                data: 'ok'
            });
        }
        catch(err) {
            console.error(err);
            response.json({
                error: err
            });
        }
    }
};

module.exports = CoordenadasController;