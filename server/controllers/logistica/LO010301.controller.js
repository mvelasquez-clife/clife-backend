const xmlParser = require('./../../xml-parser');
const db = require('./../../libs/db-oracle');

const lo010301Controller = {
    DatosIniciales: async (request, response) => {
        // carga el combo de monedas
        let monedas = await db.select("select co_moneda \"value\", de_abreviatura || ' ' || de_nombre \"text\" from ma_mone_m", []);
            console.log(monedas);
        let tpentidades = await db.select("select co_tipo_entidad \"value\", de_nombre \"text\" from ma_tipo_enti_m order by co_tipo_entidad asc", []);
            console.log(tpentidades);
        response.json({
            data: {
                monedas: monedas.error ? [] : monedas.rows,
                tpentidades: tpentidades.error ? [] : tpentidades.rows
            }
        });
    },
    InfoProveedor: async (request, response) => {
        const { empresa, entidad, tipoenti, moneda } = request.body;
        let params = [
            { name: 'empresa', io: 'in', value: parseInt(empresa) },
            { name: 'entidad', io: 'in', value: parseInt(entidad) },
            { name: 'tipoenti', io: 'in', value: parseInt(tipoenti) },
            { name: 'moneda', io: 'in', value: parseInt(moneda) },
            { name: 'ocodigo', io: 'out', type: 'number' },
            { name: 'omensaje', io: 'out', type: 'string' },
            { name: 'omoneda', io: 'out', type: 'string' },
            { name: 'oingreso', io: 'out', type: 'number' },
            { name: 'oegreso', io: 'out', type: 'number' },
            { name: 'osaldo', io: 'out', type: 'number' }
        ];
        let result = await db.statement("call pack_new_ctacte_prov.sp_info_proveedor(:empresa, :entidad, :tipoenti, :moneda, :ocodigo, :omensaje, :omoneda, :oingreso, :oegreso, :osaldo)", params);
        //
        /*let s = await db.resultSet("call pack_new_ctacte_prov.sp_prueba(:empresa, :rs)", [
            { name: 'empresa', io: 'in', value: 11 },
            { name: 'rs', io: 'out', type: 'cursor' }
        ]);*/
        response.json({
            data: result.out
        });
    }
};

module.exports = lo010301Controller;