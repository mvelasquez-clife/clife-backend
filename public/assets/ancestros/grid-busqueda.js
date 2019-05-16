/********************
 *  Modo de Uso :
 * en el "script.js" de cada modulo agregar :
 * agregar en EL Tag <BODY> del plantilla XXXXXX.ejs
 *  <script type="text/javascript"  src="/assets/ancestros/grid-busqueda.js"></script>
 * 
 * Luego agregar de acuerdo a su logica la sgte linea de codigo :
 * 
 *    var W_b_respo = new dhtmlXWindows();  
 *    var output = await IniciarGridBusqueda(2, false, W_b_respo);
 *    
 *    1. Se crea una estancia de dhtmlXWindows
 *    2. Se manda el objeto creado mediante la funcion  IniciarGridBusqueda();
 *    
 *===================================================
 *     RESPUESTA :
 *    { 
 *      alias: "MAlbornozC"
 *       ccosto: "Bazares y Farmacias"
 *       codigo: "10818653"
 *       nombre: "ALBORNOZ CHAGUA MAGALY"
 *       vigencia: "Vigente"
 *       }
 *       
 *    => para seleccionar datos : 
 *       
 *     output.seleccion[0].alias =>(String) devuelve el alias  
 *     output.seleccion[0].ccosto =>(String) devuelve el nombre centro de costos 
 *     output.seleccion[0].codigo =>(String) devuelve el codigo  
 *     output.seleccion[0].nombre =>(String) devuelve el nombre  
 *     output.seleccion[0].vigencia =>(String) devuelve el estado  
 *          
 *********************/
var gridBusqueda, winGridBusqueda, winGridLayout, winToolbar;
var multi, tpEnti;

IniciarGridBusqueda = (tipoEntidad, multiSelect, container, extraParam = '') => {
    return new Promise(resolve => {
        multi = multiSelect;
        tpEnti = tipoEntidad;
        if (container.dhxWins.isWindow('winGridBusqueda')) {
            winGridBusqueda.bringToTop();
        } else {
            winGridBusqueda = container.dhxWins.createWindow('winGridBusqueda', 0, 0, 720, 480);
            winGridBusqueda.center();
            winGridBusqueda.keepInViewport(true);
            winGridBusqueda.setModal(true);
            winGridBusqueda.setText('Búsqueda');
            winGridBusqueda.button('close').hide();
            winGridBusqueda.button('park').hide();
            winGridBusqueda.button('minmax').hide();
            //    winGridBusqueda.setPagingSkin("bricks", 'skyblue');
            winGridBusqueda.attachStatusBar({
                paging: true,
                text: "<div id='bsq-pager'></div>"
            });
            winToolbar = winGridBusqueda.attachToolbar();
            winToolbar.setIconsPath('/assets/images/icons/');
            winToolbar.addButton('btok', null, 'Confirmar selección', 'ic-add.png', '');
            winToolbar.addButton('btno', null, 'Cancelar', 'ic-delete.png', '');
            //winToolbar.disableItem('btok');
            winToolbar.attachEvent('onClick', (id) => {
                switch (id) {
                    case 'btok':
                        let arr_out = [];
                        var checked = gridBusqueda.getCheckedRows(0);
                        if (checked.length > 0) {
                            var array = checked.split(",");
                            if ((multi === true && array.length > 1) || (multi === false && array.length === 1)) {
                                array.forEach(function (valor) {
                                    arr_out.push(gridBusqueda.getRowData(valor));
                                });
                                const out = { seleccion: arr_out };
                                winGridBusqueda.close();
                                resolve(out);
                            } else
                                Swal.fire({ type: 'error', title: 'Debe eligir sólo UNO!' });
                        } else
                            Swal.fire({ type: 'error', title: 'Debe eligir almenos UNO!' });
                        break;
                    case 'btno':
                        winGridBusqueda.close();
                        resolve(null);
                        break;
                    default:
                        winGridBusqueda.close();
                        resolve(null);
                        break;
                }
            });
            gridBusqueda = winGridBusqueda.attachGrid();
            switch (tipoEntidad) {
                case 1://busqueda de productos
                    gridBusqueda.setHeader('#,Codigo,Descripción,Vigencia,Observaciones 1,Observaciones 2');
                    gridBusqueda.attachHeader('&nbsp,#numeric_filter,#text_filter,#select_filter,#text_filter,#text_filter');
                    gridBusqueda.setInitWidthsP('5,10,45,10,15,15');
                    gridBusqueda.setColTypes('ron,rotxt,rotxt,rotxt,rotxt');
                    gridBusqueda.setColumnIds("ch,codigo,descripcion,vigencia,observ1,observ2");
                    break;
                case 2://busqueda de vendedores
                    gridBusqueda.setHeader('#,Codigo,Nombre,Vigencia,C.Costo,Alias');
                    gridBusqueda.attachHeader('&nbsp,#numeric_filter,#text_filter,#select_filter,#select_filter,#text_filter');
                    gridBusqueda.setInitWidthsP('5,10,45,10,20,10');
                    gridBusqueda.setColTypes('ch,ron,rotxt,rotxt,rotxt,rotxt');
                    gridBusqueda.setColumnIds("ch,codigo,nombre,vigencia,ccosto,alias");
                    break;
                case 3://busqueda de usuarios erp
                    gridBusqueda.setHeader('#,Codigo,Nombre,Vigencia,Alias,Correo');
                    gridBusqueda.attachHeader('#rspan,#numeric_filter,#text_filter,#select_filter,#text_filter,#text_filter');
                    gridBusqueda.setInitWidthsP('5,10,45,10,15,15');
                    gridBusqueda.setColTypes('ch,ron,rotxt,rotxt,rotxt,rotxt');
                    gridBusqueda.setColumnIds("ch,codigo,nombre,vigencia,alias,correo");
                    break;
                case 4://busqueda ubigeo
                    gridBusqueda.setHeader('#,Codigo,Descripcion,Vigencia,Codigos,Detalle2');
                    gridBusqueda.attachHeader('&nbsp,#numeric_filter,#text_search,#text_filter,#text_filter,#text_filter');
                    gridBusqueda.setInitWidthsP('5,10,85');
                    gridBusqueda.setColumnIds("ch,ubigeo,descripcion,detalle1,detalle2");
                    //gridBusqueda.setColumnHidden(2, true);
                    ([3, 4, 5]).forEach((e) => {
                        gridBusqueda.setColumnHidden(e, true);
                    });
                    gridBusqueda.setColTypes('ch,ron,rotxt,rotxt,rotxt,rotxt');
                    break;
                case 5://busqueda de clientes
                    gridBusqueda.setHeader('#,RUC,Razón Social,,Nombre Comercial,');
                    gridBusqueda.attachHeader('#rspan,#text_filter,#text_filter,#rspan,#text_filter,#rspan');
                    gridBusqueda.setInitWidthsP('5,15,40,0,40,0');
                    gridBusqueda.setColTypes('ch,ron,rotxt,rotxt,rotxt,rotxt');
                    gridBusqueda.setColumnIds("ch,codigo,ncomercial,nose,rsocial,alias");
                    gridBusqueda.setColumnHidden(3, true);
                    gridBusqueda.setColumnHidden(5, true);
                    gridBusqueda.enableSmartRendering(true, 50);

                    break;
                case 6://lista de precios
                    gridBusqueda.setHeader('#,CodListado,Nombre,Moneda,Moneda,SerieListado');
                    gridBusqueda.attachHeader('#rspan,#text_filter,#text_filter,#rspan,#text_filter,#rspan');
                    gridBusqueda.setInitWidthsP('5,15,45,20,15,15');
                    gridBusqueda.setColTypes('ch,ron,rotxt,rotxt,rotxt,rotxt');
                    gridBusqueda.setColumnIds("ch,colistado,nombre,moneda,cmone,serielistado");
                    gridBusqueda.setColumnHidden(4, true);
                    gridBusqueda.enableSmartRendering(true);
                    break;
                case 11://lista de bancos
                    gridBusqueda.setHeader('#,CodBnaco,Nombre,Estado,Pais,NomPais');
                    gridBusqueda.attachHeader('#rspan,#text_filter,#text_filter,#rspan,#text_filter,#rspan');
                    gridBusqueda.setInitWidthsP('5,15,45,20,15,15');
                    gridBusqueda.setColTypes('ch,ron,rotxt,rotxt,rotxt,rotxt');
                    gridBusqueda.setColumnIds("ch,codbanco,n_banco,stado,copais,nompais");
                    gridBusqueda.setColumnHidden(4, true);
                    gridBusqueda.enableSmartRendering(true);
                    break;
                default:
                    break;
            }
            gridBusqueda.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/");
            gridBusqueda.enablePaging(true, 250, 5, "bsq-pager");
            gridBusqueda.setPagingSkin("toolbar");
            gridBusqueda.enableMultiselect(multiSelect);
            gridBusqueda.init();
            gridBusqueda.load('/api/ancestros/datos-modal-busqueda/' + tipoEntidad + '/' + usrJson.empresa + '/' + extraParam);
        }
    });
};

/*gridBusquedaDatosSuccess = () => {
 //gridBusqueda.insertColumn(0, '', multi ? 'ch' : 'ra', 5);
 //gridBusqueda.uncheckAll();
 gridBusqueda.attachEvent('onRowSelect', gridBusquedaRowSelect);
 };

 gridBusquedaRowSelect = (rowId, colId) => {
 winToolbar.enableItem('btok');
 //    const current = parseInt(gridBusqueda.cells(rowId, 0).getValue());
 //    const newValue = (current + 1) % 2;
 //    gridBusqueda.cells(rowId, 0).setValue(newValue);
 };*/

/*generaJsonFila = (rowId) => {
 switch (tpEnti) {
 case 1:
 return {
 codigo: gridBusqueda.cells(rowId, 1).getValue(),
 descripcion: gridBusqueda.cells(rowId, 2).getValue(),
 vigencia: gridBusqueda.cells(rowId, 3).getValue(),
 observ1: gridBusqueda.cells(rowId, 4).getValue(),
 observ2: gridBusqueda.cells(rowId, 5).getValue()
 };
 case 2:
 return {
 codigo: gridBusqueda.cells(rowId, 1).getValue(),
 nombre: gridBusqueda.cells(rowId, 2).getValue(),
 vigencia: gridBusqueda.cells(rowId, 3).getValue(),
 ccosto: gridBusqueda.cells(rowId, 4).getValue(),
 alias: gridBusqueda.cells(rowId, 5).getValue()
 };
 case 3:
 return {
 codigo: gridBusqueda.cells(rowId, 1).getValue(),
 nombre: gridBusqueda.cells(rowId, 2).getValue(),
 vigencia: gridBusqueda.cells(rowId, 3).getValue(),
 alias: gridBusqueda.cells(rowId, 4).getValue(),
 correo: gridBusqueda.cells(rowId, 5).getValue()
 };
 case 4:
 return {
 ubigeo: gridBusqueda.cells(rowId, 2).getValue(),
 descripcion: gridBusqueda.cells(rowId, 3).getValue(),
 detalle1: gridBusqueda.cells(rowId, 4).getValue(),
 detalle2: gridBusqueda.cells(rowId, 5).getValue()
 };
 default:
 return null;
 }
 };*/