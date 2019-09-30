const express = require('express');
const router = express.Router();

const coordenadasController = require('./../controllers/coordenadas.controller');
    router.get('/', coordenadasController.main);
    router.get('/geocode', coordenadasController.geocode);
    router.get('/geocode/lista-paises', coordenadasController.ListaPaises);
    router.get('/geocode/lista-vendedores', coordenadasController.ListaVendedores);
    router.get('/geocode/lista-departamentos/:pais', coordenadasController.ListaDepartamentos);
    router.get('/geocode/lista-provincias/:pais/:departamento', coordenadasController.ListaProvincias);
    router.get('/geocode/lista-distritos/:pais/:departamento/:provincia', coordenadasController.ListaDistritos);
    router.get('/geocode/lista-direcciones/:ubigeo', coordenadasController.ListaDirecciones);
    router.get('/geocode/lista-direcciones-vendedor/:vendedor', coordenadasController.ListaDireccionesVendedor);
    router.post('/geocode/guardar-coordenadas-direccion', coordenadasController.GuardarCoordenadas);

    router.get('/carga-lista-clientes/:vendedor/:empresa', coordenadasController.CargaListaClientes);
    router.get('/carga-lista-direcciones/:cliente', coordenadasController.CargaListaDirecciones);
    router.post('/info-direccion', coordenadasController.InfoDireccion);
    router.post('/guardar-info-coordenadas', coordenadasController.GuardarInformacionCoordenadas);
    router.post('/observar-direccion', coordenadasController.ObservarDireccion);

module.exports = router;