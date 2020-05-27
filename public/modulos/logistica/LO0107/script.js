var myGrid_dev,win_devol,codigo_producto,dhxCombo,codigo_requerimiento,mainGrid_prod,mainGrid_det,cod_reque,permiso_aprobar,almacen_rev,desde,hasta,pendiente,rech,atend,mainGrid_cab,myFormdatos_rev,layoutReq_prin,periodo_siste,periodo_fun,var_guardar,cod_centro_costo,cod_entidad,cod_solicita,cod_zona_come,cod_fza_venta,cad_prod_ubi_var,cad_cod_prod_var,cad_cant_soli_var,cad_lote_prod_var,cant_filas_l_total,cad_prod_ubi,cad_cod_prod,cad_cant_soli,cad_lote_prod,cant_filas_prod,reque_temporal,layoutRev,myToolbardatos_rev,mainLayout_rev,win_dire,myToolbar_a,co_cata_enti,prcantidad,prstock,myGrid_prod,myFormdatos,layoutReq,mainGrid_,val_co_ingreo,personal,ccosto,raz_soc_cata,mainToolbar,cod_almacen,codprod,nomprod,ubiprod,ume,saldprod,loteprod,cant_filas_l;
Inirequerimiento = () => {
    layoutReq_prin = tabbar.cells("s_nvoreque").attachLayout('1C');
    myToolbardatos = layoutReq_prin.cells('a').attachToolbar(base_tollbar_nvo);
    myToolbardatos.setAlign("left");
    myToolbardatos.setIconSize(48);
    myToolbardatos.attachEvent('onClick', mainToolbarOnClick_nvo);
    layoutReq = layoutReq_prin.cells('a').attachLayout('2U');
    layoutReq.cells('a').setText('Nuevo Requerimiento');
    layoutReq.cells('b').setText('Productos');
    myFormdatos = layoutReq.cells('a').attachForm(f_nuevo_reque);
    mainGrid_ = layoutReq.cells('b').attachGrid();
    layoutReq.cells('b').setWidth(400);
    layoutReq.cells('b').setHeight(400);
    layoutReq.cells('a').setHeight(400);
    layoutReq.cells('a').setWidth(565);
    mainToolbar = layoutReq.cells('b').attachToolbar();
    mainToolbar.setIconsPath('/assets/images/icons/');
    mainToolbar.addButton('agregar',null,'Agregar',"ic-add.png","")
    mainToolbar.addButton('eliminar',null,'Eliminar',"ic-delete.png","")
    mainToolbar.addButton('marcar',null,'Marcar',"ic-check.png","");
    mainToolbar.addButton('desmarcar',null,'Desmarcar',"ic-desck.png","");
    mainToolbar.setIconSize(400);
    mainToolbar.attachEvent('onClick', mainToolbarOnClick);
    mainGrid_.setHeader(',CODIGO, DESCRIPCION, U.M, LOTE, UBICACIÓN, STOCK, CANT.SOL');
    mainGrid_.setInitWidths('30,70,350,100,100,100,100,100');
    mainGrid_.setColAlign('left,left,left,left,left,left,left,left');
    mainGrid_.setColumnIds("elim,prco,prdes,prum,prlot,prubi,prstock,prcant");
    mainGrid_.setColTypes('ch,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,edn');
    mainGrid_.setNumberFormat("0,000.00",6,".",",");
    mainGrid_.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    mainGrid_.init();
    myFormdatos.attachEvent("onChange", function (id_ind){
        if (myFormdatos.getItemValue('_r_almacen').length>0){
            cargarSecuencia();
        };
        myFormdatos.isItemChecked('_r_pedido') ? myFormdatos.enableItem('__buscardirec') : myFormdatos.disableItem('__buscardirec');
    });
    mainGrid_.attachEvent("onEnter", (id) => {
        data = mainGrid_.getRowData(mainGrid_.getSelectedRowId())
        prcantidad = data.prcant;
        prstock = data.prstock;
        if (prcantidad>prstock){
            dhtmlx.confirm("La cantidad supera al máx. permitido", function (result) {
                var new_data = {"prcant":""};
                mainGrid_.setRowData(id,new_data);
        });
    }
    });
    myFormdatos.attachEvent("onButtonClick", async (name) => {
        switch (name) {
            case '__buscarsolicita':
                buscarSolicita();
                break;
            case '__buscarccosto':
                buscarCosto();
                break;
            case '__buscarentidad':
                buscarEntidad();
                break;
            case '__buscardirec':
                buscarDirecciones();
                break;
            default:
                null;
                break;
        }
    });
    myFormdatos.attachEvent("onChange", async (name) => {
        switch (name) {
            case '_r_motivo_1':
                cargarMotivo();
                break;
            case 'prcant' :
                break;
            default:
                null;
                break;
        }
    });
}

buscarSolicita = async (name) => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbusq", 0, 0, 450, 500);
    Wind_.window("wbusq").hideHeader();
    Wind_.window("wbusq").setModal(true);
    Wind_.window("wbusq").denyResize();
    Wind_.window("wbusq").center();
    myToolbar = Wind_.window("wbusq").attachToolbar();
    myToolbar.addButton('b_close', null, '<i class="far fa-window-close txtred"></i> CERRAR ', null, null);
    myToolbar.attachEvent("onClick", (id) => {
        (id === 'b_close') ? Wind_.window("wbusq").close() : console.log('hola');
    });
    myGrid = Winid_.attachGrid();
    myGrid.setHeader('Cod. Usuario,Razón Social');
    myGrid.setInitWidthsP('30,70');
    myGrid.setColTypes('ro,ro');
    myGrid.setColumnIds("cod_usuario,raz_social");
    myGrid.attachHeader("#text_filter,#text_filter");
    myGrid.clearAll();
    cargarListaPersonal(Wind_);
    myGrid.init();
    myGrid.attachEvent("onRowSelect", function (id, ind) {
        data = myGrid.getRowData(myGrid.getSelectedRowId())
        cod = data.cod_usuario;
        personal = data.raz_social;
        cod_solicita = cod;
        myFormdatos.setItemValue('_r_solicita',personal);
        Wind_.window("wbusq").close();
    });
};

buscarCosto = async (name) => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbusq", 0, 0, 500, 500);
    Wind_.window("wbusq").hideHeader();
    Wind_.window("wbusq").setModal(true);
    Wind_.window("wbusq").denyResize();
    Wind_.window("wbusq").center();
    myToolbar = Wind_.window("wbusq").attachToolbar();
    myToolbar.addButton('b_close', null, '<i class="far fa-window-close txtred"></i> CERRAR ', null, null);
    myToolbar.attachEvent("onClick", (id) => {
        (id === 'b_close') ? Wind_.window("wbusq").close() : console.log('hola');
    });
    myGrid = Winid_.attachGrid();
    myGrid.setHeader('Código,Descripción');
    myGrid.setInitWidthsP('30,100');
    myGrid.setColTypes('ro,ro');
    myGrid.setColumnIds("cod_costo,de_nombre");
    myGrid.attachHeader("#text_filter,#text_filter");
    myGrid.clearAll();
    cargarListaCosto(Wind_);
    myGrid.init();
    myGrid.attachEvent("onRowSelect", function (id, ind) {
        data = myGrid.getRowData(myGrid.getSelectedRowId())
        cod = data.cod_costo;
        ccosto = data.de_nombre;
        cod_centro_costo = cod;
        myFormdatos.setItemValue('_r_ccosto',ccosto);
        Wind_.window("wbusq").close();
    });
};

buscarEntidad = async (name) => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbusq", 0, 0, 800, 500);
    Wind_.window("wbusq").hideHeader();
    Wind_.window("wbusq").setModal(true);
    Wind_.window("wbusq").denyResize();
    Wind_.window("wbusq").center();
    myToolbar = Wind_.window("wbusq").attachToolbar();
    myToolbar.addText(null, null, 'ENTIDAD : ');
    myToolbar.addInput('in_busq', null, '', 200);
    myToolbar.addSeparator(null, null);
    myToolbar.addButton('b_busq', null, '<i class="fas fa-search"></i> BUSCAR', null, null);
    myToolbar.addSeparator(null, null);
    myToolbar.addButton('b_close', null, '<i class="far fa-window-close txtred"></i> CERRAR ', null, null);
    myToolbar.attachEvent("onClick", (id) => {
        (id === 'b_close') ? Wind_.window("wbusq").close() : cargarListaEntidad(Wind_, myToolbar.getValue('in_busq'));
    });
    myToolbar.attachEvent("onEnter", (id) => {
        cargarListaEntidad(Wind_, myToolbar.getValue('in_busq').toUpperCase());
    });
    myGrid = Winid_.attachGrid();
    myGrid.setHeader('Código,Razón Social');
    myGrid.setInitWidthsP('30,70');
    myGrid.setColTypes('ro,ro');
    myGrid.setColumnIds("cod_entidad,raz_social_cata");
    myGrid.attachHeader("#text_filter,#text_filter");
    myGrid.clearAll();
    myGrid.init();
    myGrid.attachEvent("onRowSelect", function (id, ind) {
        data = myGrid.getRowData(myGrid.getSelectedRowId())
        cod = data.cod_entidad;
        raz_soc_cata = data.raz_social_cata;
        cod_entidad = cod;
        myFormdatos.setItemValue('_r_entidad',raz_soc_cata);
        Wind_.window("wbusq").close();
        co_cata_enti = cod;
    });
};

buscarDirecciones = async (name) => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wdire", 0, 0, 800, 500);
    win_dire = Wind_.window("wdire").attachLayout('2E');
    Wind_.window("wdire").hideHeader();
    Wind_.window("wdire").setModal(true);
    Wind_.window("wdire").denyResize();
    Wind_.window("wdire").center();
    win_dire.cells("a").setText('Direcciones');
    win_dire.cells("b").setText('Fuerza de Ventas');
    myToolbar = Wind_.window("wdire").attachToolbar();
    myToolbar.addText(null, null, 'DIRECCIÓN : ');
    myToolbar.addButton('b_close', null, '<i class="far fa-window-close txtred"></i> CERRAR ', null, null);
    myToolbar.attachEvent("onClick", (id) => {
        (id === 'b_close') ? Wind_.window("wdire").close() : cargarDirecciones(Wind_);
    });
    myToolbar_a = win_dire.cells("a").attachToolbar();
    myToolbar_b = win_dire.cells("b").attachToolbar();
    myToolbar_a.addInput('in_busq', null, '', 200);
    myToolbar_a.addSeparator(null, null);
    myToolbar_a.addButton('b_busq', null, '<i class="fas fa-search"></i> BUSCAR', null, null);
    myToolbar_a.addSeparator(null, null);
    myGrid = win_dire.cells("a").attachGrid();
    myGrid.setHeader('Código,País,Dirección,Referencias');
    myGrid.setInitWidthsP('10,10,50,50');
    myGrid.setColTypes('ro,ro,ro,ro');
    myGrid.setColumnIds("co_catalogo,co_pais,co_direc,co_refer");
    myGrid.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter");
    myGrid.clearAll();
    cargarDirecciones(Wind_);
    myGrid.init();
    myGrid.attachEvent("onRowSelect", function (id, ind) {
        data = myGrid.getRowData(myGrid.getSelectedRowId())
        cod = data.co_catalogo;
        var dire = data.co_direc;
        myToolbar_b.addInput('in_busq', null, '', 200);
        myToolbar_b.addSeparator(null, null);
        myToolbar_b.addButton('b_busq', null, '<i class="fas fa-search"></i> BUSCAR', null, null);
        myToolbar_b.addSeparator(null, null);
        myGrid_b = win_dire.cells("b").attachGrid();
        myGrid_b.setHeader('Código,Zona Comercial,Cod. Fza Venta,Fza Venta');
        myGrid_b.setInitWidthsP('10,10,50,50');
        myGrid_b.setColTypes('ro,ro,ro,ro');
        myGrid_b.setColumnIds("co_zona,co_zonacome,fza_venta,fza_venta_desc");
        myGrid_b.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter");
        myGrid_b.clearAll();
        myFormdatos.setItemValue('_r_direccion',dire);
        cargarFzaventa(Wind_,cod);
        myGrid_b.init();
        myGrid_b.attachEvent("onRowSelect", function (id, ind) {
            data = myGrid_b.getRowData(myGrid_b.getSelectedRowId())
            var fza = data.co_zonacome;
            var cod_zona = data.co_zona;
            var cod_fza_ve = data.fza_venta ;
            cod_zona_come = cod_zona;
            cod_fza_venta = cod_fza_ve;
            myFormdatos.setItemValue('_r_vendedor',fza);
            Wind_.window("wdire").close();
        });

    });
};

mostrarlistaProductos = async (name) => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wprod", 0, 0, 1000, 500);
    Wind_.window("wprod").hideHeader();
    Wind_.window("wprod").setModal(true);
    Wind_.window("wprod").denyResize();
    Wind_.window("wprod").center();
    myToolbar = Wind_.window("wprod").attachToolbar();
    myToolbar.addButton('b_close', null, '<i class="far fa-window-close txtred"></i> CERRAR ', null, null);
    myToolbar.setIconsPath('/assets/images/icons/');
    myToolbar.addButton('agregarpro',null,'Agregar',"ic-add.png","");
    myToolbar.attachEvent('onClick', mainToolbarOnClickProd);
    myGrid_prod = Winid_.attachGrid();
    myGrid_prod.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    myGrid_prod.setHeader(',Código,Nombre,Ubicación,U.M,Saldo,Lote,Marca,SubMarca,Clase,Familia,SubFamilia');
    myGrid_prod.setInitWidthsP('5,20,30,10,10,10,10,10,10,10,10,10');
    myGrid_prod.setColAlign('left,left,left,left,left,left,left,left,left,left,left,left');
    myGrid_prod.setColTypes('ch,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt');
    myGrid_prod.setColumnIds("ci,cod_prod,nom_prod,ubi_prod,um_prod,saldo_prod,lote_prod,marca,sybmarc,clase,fam,subfam");
    myGrid_prod.attachHeader("&nbsp,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter");
    myGrid_prod.clearAll();
    cargarPeriodo(Wind_);
    myGrid_prod.init();
};

function addZero(i) {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
}


cargarSecuencia = () => {
    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth()+1;
    var yyyy = hoy.getFullYear();
    dd=addZero(dd);
    mm=addZero(mm);
    periodo_fun = dd+'/'+mm+'/'+yyyy;
    // myFormdatos.setItemValue('_r_fecreque',dd+'/'+mm+'/'+yyyy);
    val_almacen = myFormdatos.getItemValue('_r_almacen');
    const params = {
        almacen:  val_almacen,
        empresa:  usrJson.empresa
    };
    $.post(BASE_URL + 'LO0107/mostrar-secuencia/', params, function (res) {
        const valor = res.data.almacen;
        reque_temp = valor.DE_SERIE+'-'+valor.MAX_CANT;
        myFormdatos.setItemValue('_r_nroreque', 'N° '+valor.DE_SERIE+'-'+valor.MAX_CANT + ' Del ' +periodo_fun );
    } , 'json');
    myFormdatos.enableItem('_r_nroreque'), myFormdatos.enableItem('_r_fecreque');
    myFormdatos.setReadonly('_r_nroreque',true),myFormdatos.setReadonly('_r_fecreque',true);
};

cargarListaPersonal = (win) => {
    win.window("wbusq").progressOn();
    myGrid.clearAll();
    myGrid.load( BASE_URL + 'LO0107/seleccion-personal/'+ usrJson.empresa).then(function (text) {
        win.window("wbusq").progressOff();
    });
};

cargarListaCosto = (win) => {
    win.window("wbusq").progressOn();
    myGrid.clearAll();
    myGrid.load( BASE_URL + 'LO0107/seleccion-costos/'+ usrJson.empresa).then(function (text) {
        win.window("wbusq").progressOff();
    });
};

cargarListaEntidad = (win,valor) => {
    win.window("wbusq").progressOn();
    myGrid.clearAll();
    myGrid.load( BASE_URL + 'LO0107/seleccion-entidad/'+ valor).then(function (text) {
        win.window("wbusq").progressOff();
    });
};

cargarDirecciones = (win) =>{
    win.window("wdire").progressOn();
    myGrid.clearAll();
    myGrid.load( BASE_URL + 'LO0107/mostrar-direcciones/'+ co_cata_enti).then(function (text) {
        win.window("wdire").progressOff();
    });
}

cargarFzaventa = (win,value) =>{
    win.window("wdire").progressOn();
    myGrid_b.clearAll();
    myGrid_b.load( BASE_URL + 'LO0107/mostrar-fzaventa/'+ value +'/'+ usrJson.empresa).then(function (text) {
        win.window("wdire").progressOff();
    });
}

cargarMotivo = () => {
    val_co_ingreo = myFormdatos.getItemValue('_r_motivo_1');
    const params = {
        ingreso_gasto:  val_co_ingreo
    };
    $.post(BASE_URL + 'LO0107/mostrar-motivo/', params, function (res) {
        console.log(res);
        const valor = res.data.usuario;
        myFormdatos.reloadOptions('_r_motivo_2', valor);
    } , 'json');
}

cargarProductos = (win,periodo_siste) => {
    cod_almacen = myFormdatos.getItemValue('_r_almacen');
    check_ubicacion = myFormdatos.isItemChecked('_r_chubic') ? 'S' : 'N';
    win.window("wprod").progressOn();
    myGrid_prod.clearAll();
    myGrid_prod.load( BASE_URL + 'LO0107/mostrar-productos/'+ usrJson.empresa+'/'+periodo_siste+'/'+cod_almacen+'/'+check_ubicacion).then(function (text) {
        win.window("wprod").progressOff();
        cant_filas_l = myGrid_prod.getRowsNum();
    });
};

cargarPeriodo = () => {
    const params = {
        empresa: usrJson.empresa
    }
    $.post(BASE_URL + 'LO0107/mostrar-periodo/',params, function (res) {
        const valor = res.data.periodo;
        periodo_siste = valor.CO_PERIODO;
        cargarProductos(Wind_,periodo_siste);
    } , 'json');
}

guardarEstado = (almacen_rev,requerimiento,estado) => {
    const params = {
        empresa: usrJson.empresa,
        co_usuario: usrJson.codigo,
        co_almacen: almacen_rev,
        co_requerimiento: requerimiento,
        co_estado: estado,
        co_motivo: 'estado de prueba'
    };
    console.log(params);
    $.post(BASE_URL + 'LO0107/grabar-estado-requerimiento/', params, function (res) {
        if (res.state=='success'){
            Swal.fire('Hecho!', res.message, 'success');
            mainGrid_cab.clearAll(), mainGrid_det.clearAll(),mainGrid_prod.clearAll();
            cargarCabecerarequ(almacen_rev,desde,hasta,pendiente,rech,atend);

        } else {
            Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se guardó sus cambios  :' + res.message });
        }
    } , 'json');
}

mainToolbarOnClick = (id) => {
    switch (id) {
        case 'agregar':
            mostrarlistaProductos();
        break;
        case 'desmarcar':
            mainGrid_.setCheckedRows(0,0);
        break;
        case 'marcar':
            mainGrid_.setCheckedRows(0,1);
        break;
        case 'eliminar':
            var to_fila_data_num_gri = mainGrid_.getRowsNum();
            console.log(to_fila_data_num_gri);
            for(var i=1;i<to_fila_data_num_gri;i++){
                console.log('data');
                let iRowId_gri = mainGrid_.getRowId(i);
                console.log(iRowId_gri);
                data = mainGrid_.getRowData(iRowId_gri);
                if (data.elim == 1) {
                    mainGrid_.deleteRow(iRowId_gri);
                    i = i - 1;
                    to_fila_data_num_gri = to_fila_data_num_gri - 1;
                }
            }
        break;
        default:
        null;
        break;
    }
 };

 mainToolbarOnClickProd = (id) => {
    switch (id) {
        case 'agregarpro':
            var to_fila_data_num = cant_filas_l,num_filas_check = 0;
            to_fila_data_n = '';
            data = '';
            for(var i=0;i<to_fila_data_num;i++){
                data = myGrid_prod.getRowData(i);
                if (data.ci == 1) {
                    mainGrid_.addRow(mainGrid_.uid(),[0,data.cod_prod,data.nom_prod,data.um_prod,data.lote_prod,data.ubi_prod,data.saldo_prod],1);

                }
            }
        Wind_.window("wprod").close();
            break;
        case 'b_close':
             Wind_.window("wprod").close();
            break;
        default:
            null;
            break;
    }
};
mainToolbarOnClick_nvo = async (id) => {
    switch (id) {
        case '__nuevo':
            var_guardar = 'N';
            myToolbardatos.disableItem('__edit'),
            myToolbardatos.enableItem('__save'),
            myFormdatos.clear();
            mainGrid_.clearAll();
            myFormdatos.enableItem('_r_chcuare'),myFormdatos.enableItem('_r_chubic'),myFormdatos.enableItem('_r_almacen');
            myFormdatos.enableItem('__buscarsolicita');
            myFormdatos.enableItem('__buscarccosto'),myFormdatos.enableItem('_r_motivo_1'),myFormdatos.enableItem('_r_motivo_2');
            myFormdatos.enableItem('_r_fecreqq_de'),myFormdatos.enableItem('_r_referencia_1'),myFormdatos.enableItem('_r_referencia_2');
            myFormdatos.enableItem('_r_entidad'),myFormdatos.enableItem('__buscarentidad'),myFormdatos.enableItem('_r_pedido');
            myFormdatos.enableItem('_r_observaciones'),myFormdatos.enableItem('_r_vendedor'),myFormdatos.enableItem('_r_direccion');
            myFormdatos.setReadonly('_r_chcuare', false),myFormdatos.setReadonly('_r_chubic', false);
            myFormdatos.setReadonly('_r_fecreqq_de', false),myFormdatos.setReadonly('_r_observaciones', false);

        break;
        case'__edit':
            var_guardar = 'S';
            myToolbardatos.enableItem('__save'),
            myToolbardatos.disableItem('__edit');
            break;
        case'__save':
            //grabar-requerimiento
            var  cant_filas_l_total = 0;
            cant_filas_l_total  =mainGrid_.getRowsNum() ;
            if (cant_filas_l_total ==0){
                dhtmlx.confirm("Ingresa productos", function (result) {
                    if (result === Boolean(true)) {
                    }
                });
            }else{
                let numfilas = mainGrid_.getRowsNum();
                cad_cod_prod_var = '';
                cad_cant_soli_var = '';
                cad_lote_prod_var = '';
                cad_prod_ubi_var = '';
                for (let i = 1; i < numfilas; i++) {
                    let iRowId = mainGrid_.getRowId(i);
                    data_grabar = mainGrid_.getRowData(iRowId);
                    cad_cod_prod_var += data_grabar.prco +'@'
                    cad_cant_soli_var += data_grabar.prcant + '@'
                    cad_lote_prod_var += data_grabar.prlot + '@'
                    cad_prod_ubi_var += data_grabar.prubi + '@'
                }
                cad_cod_prod = cad_cod_prod_var;
                cad_cant_soli = cad_cant_soli_var;
                cad_lote_prod = cad_lote_prod_var;
                cad_prod_ubi = cad_prod_ubi_var;

                reque_temporal = reque_temp;

                if( cad_cant_soli.length<numfilas|| myFormdatos.getItemValue('_r_fecreqq_de')==''){
                    dhtmlx.confirm("Ingrese los campos solicitados y/o cantidad solicitada", function (result) {
                        if (result === Boolean(true)) {
                        }
                    });
                }
                else{
                    grabarRequerimiento(var_guardar,cad_cod_prod,cad_cant_soli,cad_lote_prod,cad_prod_ubi,numfilas,reque_temporal);
                }
            }

            break;
        case's_nvoreque2':
            Inirequerimiento();
            break;
        case 's_revreque':
            Inirevisionreque();
            break;
        case '__replicaremp':
            break;
        default:
            null;
            break;
    }
};
ontollbarclic_req= async (id) => {
    switch (id) {
        case '__nuevo':
            break;
        case'__edit':
            break;
        case'__save':
            break;
        case's_nvoreque2':
            Inirequerimiento();
            break;
        case 's_revreque':
            Inirevisionreque();
            break;
        case '__replicaremp':
            break;
        default:
            null;
            break;
    }
};

onClickdetalle= async (id) => {
    switch (id) {
        case 'rechazar':
            cargarPlantilla();
            break;
        default:
            null;
            break;
    }
};

onClickstatus= async (id) => {
    rRequerimiento = mainGrid_cab.getSelectedRowId();
    switch (id) {
        case '__pass':
            if(rRequerimiento) {
                dhtmlx.confirm("¿Está seguro de aprobar este requerimiento ?", function (result) {
                    if (result === Boolean(true)) {
                        guardarEstado(almacen_rev,codigo_requerimiento,'APROBADO');
                    }
                });
            }else{
                dhtmlx.confirm("Debe elegir un requerimiento", function (result) {
                });
            }
            break;
        case '__fail':
            if(rRequerimiento) {
                dhtmlx.confirm("¿Está seguro de rechazar este requerimiento ?", function (result) {
                    if (result === Boolean(true)) {
                        guardarEstado(almacen_rev,codigo_requerimiento,'RECHAZADO');
                    }
                });
            }else{
                dhtmlx.confirm("Debe elegir un requerimiento", function (result) {
                });
            }
            break;
        case '__dele':
            if(rRequerimiento) {
                dhtmlx.confirm("¿Está seguro de anular este requerimiento ?", function (result) {
                    if (result === Boolean(true)) {
                        guardarEstado(almacen_rev,codigo_requerimiento,'ANULADO');
                    }
                });
            }else{
                dhtmlx.confirm("Debe elegir un requerimiento", function (result) {
                });
            }
            break;
        case '__back':
            if(rRequerimiento) {
                dhtmlx.confirm("¿Está seguro de devolver los materiales de este requerimiento ?", function (result) {
                    if (result === Boolean(true)) {
                        
                        devolverRequerimiento(almacen_rev,codigo_requerimiento);
                    }
                });
            }else{
                dhtmlx.confirm("Debe elegir un requerimiento", function (result) {
                });
            }
            break;
        case '__segu':
            var output = await IniciarFormularioSeguridad(58, mainLayout);
            if (output.result === 'S') {
                permiso_aprobar = 'S';
            }else{
                permiso_aprobar = 'N';
            }
            break;
        default:
            null;
            break;
    }
};

grabarRequerimiento = (var_guardar,cad_cod_prod,cad_cant_soli,cad_lote_prod,cad_prod_ubi,numfilas) => {
    params = {
        action:var_guardar,
        empresa: usrJson.empresa,
        co_almacen: myFormdatos.getItemValue('_r_almacen'),
        reque_temp: reque_temp,
        fec_reque: myFormdatos.getItemValue('_r_fecreqq_de').toLocaleDateString(),
        co_entidad: cod_entidad,
        co_tipodoc: myFormdatos.getItemValue('_r_referencia_1'),
        co_nrodocref: myFormdatos.getItemValue('_r_referencia_2'),
        co_tiporeq: 80,
        co_estado: "PENDIENTE",
        de_observ: myFormdatos.getItemValue('_r_observaciones'),
        co_motivo: myFormdatos.getItemValue('_r_motivo_2'),
        solicita: cod_solicita,
        centro_costos: cod_centro_costo,
        check_cuarentena: myFormdatos.isItemChecked('_r_chcuare') ? 'S' : 'N',
        check_ubicacion: myFormdatos.isItemChecked('_r_chubic') ? 'S' : 'N',
        co_fza_venta : cod_fza_venta,
        co_zona_com : cod_zona_come,
        cadena_codigo_prod: cad_cod_prod,
        cadena_cant_solicitada: cad_cant_soli,
        cadena_lote: cad_lote_prod,
        cadena_ubicacion: cad_prod_ubi,
        cant_filas_prod: numfilas -1,

    };
    $.post(BASE_URL + "LO0107/grabar-requerimiento", params, function (res) {
        if (res.state=='success'){
            Swal.fire('Bien!', res.message, 'success');
            myFormdatos.setItemValue('_r_nroreque','N° '+res.message_co+ ' Del ' +periodo_fun);
            myFormdatos.setItemValue('_r_entrega','PENDIENTE' );
            myToolbardatos.enableItem('__edit');
            myToolbardatos.disableItem('__save');
        } else {
            Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se guardó sus cambios  :' + res.message });
        }
    }, "json");
}

Inirevisionreque = () => {
    mainLayout_rev = tabbar.cells('s_revreque').attachLayout('4J');
    mainLayout_rev.cells('a').hideHeader();
    mainLayout_rev.setSeparatorSize(0, 0);
    mainLayout_rev.cells('a').setHeight(110);
    mainLayout_rev.cells('a').setWidth(565);
    mainLayout_rev.cells('b').setText('Requerimiento');
    mainLayout_rev.cells('c').setText('Detalle Requerimiento');
    mainLayout_rev.cells('d').setText('');
    mainLayout_rev.cells('c').setWidth(1000);
    myFormdatos_rev = mainLayout_rev.cells('a').attachForm(f_rev_reque);
    myToolbardatos_rev = mainLayout_rev.cells('a').attachToolbar();
    myToolbardatos_rev.setIconsPath('/assets/images/icons/');
    myToolbardatos_rev.addButton('__pass',null,'Aprobar',"ic-like.png","ic-like-block.png")
    myToolbardatos_rev.addButton('__fail',null,'Rechazar',"ic-dislike.png","ic-dislike-block.png")
    myToolbardatos_rev.addButton('__dele',null,'Anular',"ic-cancel.png","ic-cancel.png");
    myToolbardatos_rev.addButton('__back',null,'Devolver a Almacen',"ic-giveback.png","ic-giveback.png");
    myToolbardatos_rev.addButton('__segu',null,'Seguridad',"unlock_64.png","unlock_64.png");
    myToolbardatos_rev.disableItem('__pass');
    myToolbardatos_rev.disableItem('__fail');
    myToolbardatos_rev.disableItem('__dele');
    myToolbardatos_rev.disableItem('__back');
    myToolbardatos_rev.setAlign("left");
    myToolbardatos_rev.setIconSize(48);
    myToolbardatos_rev.attachEvent('onClick', onClickstatus);
    mainGrid_cab = mainLayout_rev.cells('b').attachGrid();
    mainToolbar_cab = mainLayout_rev.cells('b').attachToolbar();
    mainToolbar_cab.setIconsPath('/assets/images/icons/');    
    mainToolbar_cab.addButton('Ver',null,'Ver',"lupa_26.png","");    
    mainToolbar_cab.attachEvent('onClick', onClickdetalle);
    mainGrid_cab.clearAll();
    mainGrid_cab.setHeader('Fecha, N°Req,Importe ,Doc.Ref,Entidad Solicita, Requerido para el, Motivo,Aprobación,Despacho,Recibido,Fec.Autoriza,Fec.Atención,Observaciones,Autorizado por, F.Registro,Entidad Ref.,Almacen Origen,Almacen Destino');
    mainGrid_cab.setInitWidths('70,100,120,250,100,200,100,100,100,100,100,100,100,100,100,250,250');
    mainGrid_cab.setColAlign('left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left');
    mainGrid_cab.setColumnIds("fec,nrequ,import,doc,ent_sol,req_fec,moti,aprob,desp,recib,fec_aut,fec_aten,obs,aut,fec_regi,ent_ref,ori_alm,des_alm");
    mainGrid_cab.init();
    mainGrid_cab.setColTypes('rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt');
    mainGrid_cab.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    mainGrid_det = mainLayout_rev.cells('c').attachGrid();
    mainGrid_det.clearAll();
    mainToolbar = mainLayout_rev.cells('c').attachToolbar();
    mainToolbar.setIconsPath('/assets/images/icons/');    
    mainToolbar.addButton('rechazar',null,'Rechazar',"ic-fail.png","");    
    mainToolbar.attachEvent('onClick', onClickdetalle);
    mainGrid_det.setHeader(',Código,Producto,Lote,Ubicación,Cant.Sol.,Cant.Ent,Cant.Pend.,Cant.Aprob.');
    mainGrid_det.setInitWidths('20,100,415,80,120,70,70,70,70');
    mainGrid_det.setColAlign('left,left,left,left,left,left,left,left,left');
    mainGrid_det.setColumnIds("cid,cod_prod,prod,lote,ubic,solc,entc,pendc,aprobc");
    mainGrid_det.init();
    mainGrid_det.setColTypes('ch,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt');
    mainGrid_prod = mainLayout_rev.cells('d').attachGrid();
    mainGrid_prod.clearAll();
    mainGrid_prod.setHeader('N°Guía Salida,Guía/Rem.,Recibido');
    mainGrid_prod.setInitWidths('100,180,100');
    mainGrid_prod.setColAlign('left,left,left');
    mainGrid_prod.setColumnIds("guia_sal,rem,recib");
    mainGrid_prod.init();
    mainGrid_prod.setColTypes('rotxt,rotxt,rotxt');
    myFormdatos_rev.attachEvent("onButtonClick", function (id_ind){
        mainGrid_cab.clearAll(), mainGrid_det.clearAll(),mainGrid_prod.clearAll();
        desde = myFormdatos_rev.getItemValue('_r_fech_ini').toLocaleDateString().replace('/', '-'),
        hasta = myFormdatos_rev.getItemValue('_r_fech_fin').toLocaleDateString().replace('/', '-'),
        desde = desde.replace('/', '-'),
        hasta = hasta.replace('/', '-'),
        dhxCombo = myFormdatos_rev.getCombo('_estado_rev');
        pendiente = dhxCombo.getOptionByIndex(0).checked ? 0 : 7,
        rech =  dhxCombo.getOptionByIndex(1).checked ? 3 : 7,
        atend =  dhxCombo.getOptionByIndex(2).checked ? 2 : 7,
        almacen_rev = myFormdatos_rev.getItemValue('_rev_almacen'),
        cargarCabecerarequ(almacen_rev,desde,hasta,pendiente,rech,atend);
        mainGrid_cab.attachEvent("onRowSelect", function (id, ind) {
            data = mainGrid_cab.getRowData(mainGrid_cab.getSelectedRowId())
            cod = data.nrequ;
            codigo_requerimiento = cod;
            despacho = data.desp;
            aprobacion = data.aprob;
            almacen_rev = myFormdatos_rev.getItemValue('_rev_almacen');      
            if(permiso_aprobar == 'S'){
                myToolbardatos_rev.disableItem('__pass'),myToolbardatos_rev.disableItem('__fail'),myToolbardatos_rev.disableItem('__dele'),myToolbardatos_rev.disableItem('__back');
                if((despacho == 'PENDIENTE') && (aprobacion == 'PENDIENTE')){
                    myToolbardatos_rev.enableItem('__pass'),myToolbardatos_rev.enableItem('__fail'), myToolbardatos_rev.enableItem('__dele');
                }
                if((despacho == 'PENDIENTE') && (aprobacion == 'APROBADO')){
                    myToolbardatos_rev.enableItem('__fail'),myToolbardatos_rev.enableItem('__dele');
                }
                if((despacho == 'ATE.TOTAL')){
                    myToolbardatos_rev.enableItem('__back');
                }
            }else{
                myToolbardatos_rev.disableItem('__pass'),myToolbardatos_rev.disableItem('__fail'),myToolbardatos_rev.disableItem('__dele'),myToolbardatos_rev.disableItem('__back');
            }

            cargarDetallerequ(almacen_rev,cod);
        });
    });

    mainGrid_det.attachEvent("onRowSelect", function (id, ind) {
        data = mainGrid_det.getRowData(mainGrid_det.getSelectedRowId())
        codigo_producto = data.cod_prod;
        cargarguiaProd(almacen_rev,codigo_requerimiento,codigo_producto);
    });
}

devolverRequerimiento = async (almacen_rev,codigo_requerimiento) => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wdev", 0, 0, 800, 500);
    win_devol = Wind_.window("wdev").attachLayout('1C');
    Wind_.window("wdev").hideHeader();
    Wind_.window("wdev").setModal(true);
    Wind_.window("wdev").denyResize();
    Wind_.window("wdev").center();
    win_devol.cells("a").setText('Indique las cantidades que desea devolver');
    myToolbar = Wind_.window("wdev").attachToolbar();
    myToolbar.addButton('b_aceptar', null, '<i class="fas fa-check txtrgreen"></i> ACEPTAR ', null, null);
    myToolbar.addButton('b_close', null, '<i class="far fa-window-close txtred"></i> CERRAR ', null, null);    
    myToolbar.setIconSize(48);
    myToolbar.setAlign("right");
    myToolbar.attachEvent("onClick", (id) => {
        (id === 'b_close') ? Wind_.window("wdev").close() : (id === 'b_aceptar') ? cargarDevolucion() : console.log('');
        
    });
    myGrid_dev = win_devol.cells("a").attachGrid();
    myGrid_dev.setHeader('Código,Producto,Cant.Aten.,Devolver,Lote,Ubicación,Motivo Dev.');
    myGrid_dev.setInitWidthsP('20,70,20,20,20,20,20');
    myGrid_dev.setColTypes('ro,ro,ro,edn,ro,ro,combo');
    myGrid_dev.setColumnIds("dev_prod,dev_nombre,dev_aten,cant_dev,dev_lote,ubi,motivo");
    myGrid_dev.clearAll();
    myGrid_dev.init();
    cargarDetalledev(Wind_,almacen_rev,codigo_requerimiento);
    myCombo = myGrid_dev.getColumnCombo(6);
    myCombo.load( BASE_URL + 'LO0107/mostrar-motivo-devolucion/');
    myCombo.readonly(true);
    myGrid_dev.attachEvent("onEnter", (id) => {
        data = myGrid_dev.getRowData(myGrid_dev.getSelectedRowId())
        prcantidad = data.dev_aten;
        prstock = data.cant_dev;
        if (prcantidad<prstock){
            dhtmlx.confirm("La cantidad supera al máx. permitido", function (result) {
                var new_data = {"cant_dev":"0"};
                myGrid_dev.setRowData(id,new_data);
        });
    }
    });
    myGrid_dev.attachEvent("onClick", (id) => {
        console.log('ssfsfsdf');
    });
    grid.attachEvent("onEditCell", function(stage,rId,cInd,nValue,oValue){
        // your code here
    });
};

Iniconsultareque = () => {
    mainLayout_cons = tabbar.cells('s_conreque').attachLayout('2E');
    mainLayout_cons.cells('a').hideHeader();
    mainLayout_cons.setSeparatorSize(0, 0);
    mainLayout_cons.cells('a').setHeight(110);
    mainLayout_cons.cells('a').setWidth(565);
    myFormdatos_cons = mainLayout_cons.cells('a').attachForm(f_consulta_reque); 
    mainGrid_cons = mainLayout_cons.cells('b').attachGrid();
    mainGrid_cons.clearAll();
    mainGrid_cons.setHeader('Fecha, N°Req, Importe, Doc.Ref,Entidad Solicita, Requerido para el, Motivo,Aprobación,Despacho,Fec.Autoriza,Fec.Atención,Observaciones,Autorizado por, Registrado por,F.Registro,Evaluación Requerimiento,Almacen Origen,Almacen Destino,Cod.Producto,Lote,Ubicación,Impdet');
    mainGrid_cons.setInitWidths('70,100,120,250,100,200,100,100,100,100,100,100,100,100,100,250,250,100,100,100,100,100');
    mainGrid_cons.setColAlign('left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left');
    mainGrid_cons.setColumnIds("fec,nrequ,doc,ent_sol,req_fec,moti,aprob,desp,recib,fec_aut,fec_aten,obs,aut,fec_regi,ent_ref,ori_alm,des_alm");
    mainGrid_cons.init();   

    myFormdatos_cons.attachEvent("onButtonClick", function (id_ind){
        mainGrid_cons.clearAll();
        desde = myFormdatos_cons.getItemValue('_r_fech_ini').toLocaleDateString().replace('/', '-'),
        hasta = myFormdatos_cons.getItemValue('_r_fech_fin').toLocaleDateString().replace('/', '-'),
        desde = desde.replace('/', '-'),
        hasta = hasta.replace('/', '-'),
        dhxCombo = myFormdatos_cons.getCombo('_estado_rev');
        pendiente = dhxCombo.getOptionByIndex(0).checked ? 0 : 7,
        rech =  dhxCombo.getOptionByIndex(1).checked ? 3 : 7,
        atend =  dhxCombo.getOptionByIndex(2).checked ? 2 : 7,
        almacen_rev = myFormdatos_cons.getItemValue('_rev_almacen'),
        cargarConsultarequ(almacen_rev,desde,hasta,pendiente,rech,atend);
    });


}

cargarCabecerarequ = (almacen_rev,desde,hasta,pendiente,rech,atend) =>{
    mainGrid_cab.clearAll();
    mainLayout_rev.cells('b').progressOn();
    mainGrid_cab.load( BASE_URL + 'LO0107/mostrar-cabecera-requerimiento/'+ usrJson.empresa+'/'+almacen_rev+'/'+desde+'/'+hasta+'/'+pendiente+'/'+rech+'/'+atend).then(function (text) {
        mainLayout_rev.cells('b').progressOff();
    });
}

cargarDetallerequ = (almacen_rev,cod) =>{
    mainGrid_det.clearAll();
    mainLayout_rev.cells('c').progressOn();
    mainGrid_det.load( BASE_URL + 'LO0107/mostrar-detalle-requerimiento/'+ usrJson.empresa+'/'+almacen_rev+'/'+cod).then(function (text) {
        mainLayout_rev.cells('c').progressOff();
    });
}

cargarDetalledev = (win,almacen_rev,codigo_requerimiento) =>{
    win.window("wdev").progressOn();
    myGrid_dev.clearAll();
    myGrid_dev.load( BASE_URL + 'LO0107/mostrar-detalle-requerimiento-devol/'+ usrJson.empresa+'/'+almacen_rev+'/'+codigo_requerimiento).then(function (text) {
        win.window("wdev").progressOff();
    });
}

cargarguiaProd = (almacen_rev,codigo_requerimiento,codigo_producto) =>{
    mainGrid_prod.clearAll();
    mainLayout_rev.cells('d').progressOn();
    mainGrid_prod.load( BASE_URL + 'LO0107/mostrar-guia-producto/'+ usrJson.empresa+'/'+almacen_rev+'/'+codigo_requerimiento+'/'+codigo_producto).then(function (text) {
        mainLayout_rev.cells('d').progressOff();
    });
}

cargarPlantilla = () => {
    const params = {
    };
    $.post(BASE_URL + 'LO0107/businesscard.pdf', params, function (res) {
    } , 'json');

}

cargarConsultarequ = (almacen_rev,desde,hasta,pendiente,rech,atend) =>{
    mainGrid_cons.clearAll();
    mainLayout_cons.cells('b').progressOn();
    mainGrid_cons.load( BASE_URL + 'LO0107/consulta-requerimiento/'+ usrJson.empresa+'/'+almacen_rev+'/'+desde+'/'+hasta+'/'+pendiente+'/'+rech+'/'+atend).then(function (text) {
        mainLayout_cons.cells('b').progressOff();
    });
}
cargarDevolucion =() =>{    
        let numfilas = myGrid_dev.getRowsNum();
        console.log(numfilas);
        cad_cod_prod_var = '';
        cad_cant_dev_var = '';
        cad_lote_prod_var = '';
        cad_prod_ubi_var = '';
        cad_moti_dev_var = '';
        for (let i = 0; i < numfilas; i++) {
            let iRowId = myGrid_dev.getRowId(i);
            data_grabar = myGrid_dev.getRowData(iRowId);
            console.log(data_grabar);
            console.log(data_grabar.cant_dev);
            console.log(data_grabar.motivo);
            if (data_grabar.cant_dev !='0' && data_grabar.motivo == '0'){
                console.log('aiu');
                dhtmlx.confirm("Ingrese motivo de devolución", function (result) {
                           return;
                        });
            }else{
                console.log('aiusda');
                if (data_grabar.cant_dev =='0' && data_grabar.motivo !='0'){
                    dhtmlx.confirm("Ingrese cantidad a devolver", function (result) {
                               return;
                            });
                }
            }
        }
        
    // myGrid_dev.setHeader('Código,Producto,Cant.Aten.,Devolver,Lote,Ubicación,Motivo Dev.');
    // myGrid_dev.setColumnIds("dev_prod,dev_nombre,dev_aten,cant_dev,dev_lote,ubi,motivo");
        
        // cad_cod_prod_var += data_grabar.prco +'@'
        // cad_cant_soli_var += data_grabar.prcant + '@'
        // cad_lote_prod_var += data_grabar.prlot + '@'
        // cad_prod_ubi_var += data_grabar.prubi + '@'

        // cad_cod_prod = cad_cod_prod_var;
        // cad_cant_soli = cad_cant_soli_var;
        // cad_lote_prod = cad_lote_prod_var;
        // cad_prod_ubi = cad_prod_ubi_var;

        // reque_temporal = reque_temp;

        // if( cad_cant_soli.length<numfilas|| myFormdatos.getItemValue('_r_fecreqq_de')==''){
        //     dhtmlx.confirm("Ingrese los campos solicitados y/o cantidad solicitada", function (result) {
        //         if (result === Boolean(true)) {
        //         }
        //     });
        // }
        // else{
        //     grabarRequerimiento(var_guardar,cad_cod_prod,cad_cant_soli,cad_lote_prod,cad_prod_ubi,numfilas,reque_temporal);
        // }
}


doOnSelect= async (id) => {
    switch (id) {
        case 's_revreque':
            Inirevisionreque();
            break;
        case 's_conreque':
            Iniconsultareque();
            break;
        case 's_revdevol':
            // Inirevisionreque();
            break;
        default:
            null;
            break;
    }
};


