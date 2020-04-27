const db = require('./../../server/libs/db-oracle');
const pwmanager = require('./../../server/libs/password-manager');
const tknmanager = require('./../../server/libs/token-manager');

const WsController = {
    RegistraUsuario: async (request, response) => {
        const { empresa, alias, clave } = request.query;
        let hash = await pwmanager.encriptar(clave);
        if (hash.error) {
            response.json({
                error: hash.error
            });
        }
        let params = [
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'alias', io: 'in', value: alias },
            { name: 'password', io: 'in', value: hash.result },
            { name: 'codigo', io: 'out', type: 'number' },
            { name: 'mensaje', io: 'out', type: 'string' }
        ];
        let result = await db.statement('call pack_web_service.sp_registra_usuario(:empresa, :alias, :password, :codigo, :mensaje)', params);
        if (result.error) {
            response.json({
                error: result.error
            });
            return;
        }
        if (result.out.codigo == 0) {
            response.json({
                error: result.out.mensaje
            });
            return;
        }
        response.json({
            success: true
        });
    },
    ObtenerToken: async (request, response) => {
        const { alias, empresa, clave } = request.query;
        let params = [
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'alias', io: 'in', value: alias },
            { name: 'codigo', io: 'out', type: 'number' },
            { name: 'mensaje', io: 'out', type: 'string' }
        ];
        let result = await db.statement('call pack_web_service.sp_autenticar (:empresa, :alias, :codigo, :mensaje)', params);
        if (result.error) {
            response.status(401).json({
                error: result.error
            });
            return;
        }
        if (result.out.codigo == 0) {
            response.status(401).json({
                error: result.out.mensaje
            });
            return;
        }
        let compare = await pwmanager.validar(clave, result.out.mensaje);
        if (compare.error) {
            response.status(401).json({
                error: compare.error
            });
            return;
        }
        if (!compare.result) {
            response.status(401).json({
                error: 'La contraseña es incorrecta'
            });
            return;
        }
        // devuelve el token pex
        let tokenData = {
            id: result.out.codigo,
            empresa: empresa,
            alias: alias
        };
        let token = tknmanager.GeneraToken(tokenData);
        response.json({
            token: token
        });
    },
    ListaPedidos: async (request, response) => {
        let token = request.headers['authorization'];
        if (!token) {
            response.status(401).send({
                error: 'Es necesario el token de autenticación'
            })
            return;
        }
        const { empresa, vendedor } = request.query;
        if (typeof empresa == 'undefined' || typeof vendedor == 'undefined') {
            response.status(401).json({
                error: 'Parámetros incorrectos'
            });
            return;
        }
        let params = [
            { name: 'empresa', io: 'in', value: empresa },
            { name: 'vendedor', io: 'in', value: vendedor },
            { name: 'rs', io: 'out', type: 'cursor' }
        ];
        let result = await db.resultSet('call pack_web_service.sp_lista_pedidos (:empresa, :vendedor, :rs)', params);
        if (result.error) {
            response.status(401).json({
                error: result.error
            });
            return;
        }
        response.json({
            data: result.rs
        });
    }
};

module.exports = WsController;