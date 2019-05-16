onBuscaMaestro = async (name) => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbusq", 0, 0, 820, 380);
    Wind_.window("wbusq").hideHeader();
    Wind_.window("wbusq").setModal(true);
    Wind_.window("wbusq").denyResize();
    Wind_.window("wbusq").center();
    myToolbar = Wind_.window("wbusq").attachToolbar();
    myToolbar.addText(null, null, 'Nombre a buscar : ');
    myToolbar.addInput('in_busq', null, '', 250);
    myToolbar.addSeparator(null, null);
    myToolbar.addButton('b_busq', null, '<i class="fas fa-search"></i> BUSCAR', null, null);
    myToolbar.addSeparator(null, null);
    myToolbar.addButton('b_close', null, '<i class="far fa-window-close txtred"></i> CERRAR ', null, null);
    myToolbar.attachEvent("onClick", (id) => {
        if (id === 'b_close') {
            Wind_.window("wbusq").close();
        } else {
            onbuscacliente(Wind_, myToolbar.getValue('in_busq'));
        }
    });
    myToolbar.attachEvent("onEnter", (id) => {
        onbuscacliente(Wind_, myToolbar.getValue('in_busq'));
    });
    myGrid = Winid_.attachGrid();
    myGrid.setHeader('Codigo,Nombre Comercial,Vigencia,N.Comer,Estado');
    myGrid.setInitWidthsP('20,60,10,10,10');
    myGrid.setColTypes('ron,ro,ro,ro,ro');
    myGrid.setColumnHidden(3, true);
    myGrid.setColumnIds("codigo,nom_comer,vigencia,nom-comer,asignado")
    myGrid.init();
    myGrid.attachEvent("onRowSelect", function (id, ind) {
        mySidebar.cells("s_datos").progressOn();
        data = myGrid.getRowData(myGrid.getSelectedRowId());
        Wind_.window("wbusq").close();
        cocliente = data.codigo; //console.log(cocliente);
        _async_form(cocliente, _item_sidebar, data);//  _selec_sidevar(cocliente,_item_sidebar);
        myForm.setItemValue('b_cliente', data.codigo + ' ' + data.nom_comer);
        myForm.setItemValue('b_estado', data.vigencia);
        myForm.setItemValue('b_asignado', data.asignado);


        //    beforechange(data);
    });
};
async function _async_form(cliente, item, data) {
    await _selec_sidevar(cliente, item);
    beforechange(data);
}

function _selec_sidevar(cliente, item) {
    if (cliente > 0) {
        return new Promise(resolve => {
            switch (item) {
                case 's_datos':
                    f_s_datos();
                    break;
                case 's_direccion': // console.log(cocliente);
                    f_s_direcc();
                    break;
                case 's_giro':
                    f_s_giro_ne();
                    break;
                case 's_garante':
                    f_s_garante();
                    break;
                case 's_contacto':
                    f_s_contactos();
                    break;
                case 's_cuentas':
                    f_s_ctaban();
                    break;
                default:
                    null;
                    break;
            }
            resolve('resolved');
        });
    }
}
function beforechange(data) {
    p = { emp: usrJson.empresa, codigo: data.codigo };
    $.post(BASE_URL + "MA010102/list_datos_cliente", p, function (res) {
        json_select = res[0], _item_sidebar === 's_datos' ? cargar_datos_clie(json_select) : null;
        mySidebar.cells("s_datos").progressOff();
    }, "json");
}

function cargar_datos_clie(data) {
    myToolbardatos.enableItem('__edit');
    if (data.CO_CLIENTE > 0) {
        myFormdatos.checkItem('st_cliente'), myFormdatos.checkItem('st_personales'), myFormdatos.enableItem('st_cliente'), myFormdatos.enableItem('st_personales'), myFormdatos.setReadonly('st_cliente', true), myFormdatos.setReadonly('st_personales', true);
    } else {
        //myFormdatos.uncheckItem('st_cliente'), myFormdatos.uncheckItem('st_personales');
        myFormdatos.uncheckItem('st_cliente'), myFormdatos.checkItem('st_personales'), myFormdatos.enableItem('st_cliente'), myFormdatos.enableItem('st_personales'), myFormdatos.setReadonly('st_cliente', true), myFormdatos.setReadonly('st_personales', true);
    }
    cocliente = data.CO_CLIENTE, co_cata_entidad = data.CO_CATALOGO_ENTIDAD, permiso_cataedit = data.ST_PERMISO_EDITAR_CATA_ENTI, co_listadopre = data.CO_LISTADO_PRECIOS, co_seri_listado = data.CO_SERIE_LISTADO;
    let fe_reg = data.FE_REGISTRO === null ? '' : (data.FE_REGISTRO.split("T")[0]).split("-");
    let fe_regcli = data.FE_REGISTRO_CLIENTE === null ? '' : (data.FE_REGISTRO_CLIENTE.split("T")[0]).split("-");
    let fe_retiro = data.FE_RETIRO_CLIENTE === null ? '' : (data.FE_RETIRO_CLIENTE.split("T")[0]).split("-");

    myForm.setItemValue('b_registro', fe_reg[2] + '/' + fe_reg[1] + '/' + fe_reg[0]);
    myFormdatos.setItemValue('_tipobanco', data.CO_BANCO);
    myFormdatos.setItemValue('_nudocumento', data.NU_DOCUMENTO);
    myFormdatos.setItemValue('_tipodoc', data.CO_TIPO_DOC_IDE);
    myFormdatos.setItemValue('_tipoper', data.CO_TIPO_PERSONA);
    myFormdatos.setItemValue('_apepat', data.DE_APE_PATERNO);
    myFormdatos.setItemValue('_apemat', data.DE_APE_MATERNO);
    myFormdatos.setItemValue('_nombres', data.DE_NOMBRE);
    myFormdatos.setItemValue('_origen', data.DE_ORIGEN);
    myFormdatos.setItemValue('_procedencia', data.DE_PROCEDENCIA);
    myFormdatos.setItemValue('_razsocial', data.DE_RAZON_SOCIAL);
    myFormdatos.setItemValue('_vigencia', data.ES_VIGENCIA);
    myFormdatos.setItemValue('_clvigencia', data.ES_VIGENCIA_CLIENTE);
    myFormdatos.setItemValue('_nomcomer', data.DE_NOMBRE_COMERCIAL);
    myFormdatos.setItemValue('_tipocliente', data.CO_TIPO_CLIENTE);
    myFormdatos.setItemValue('_tipo_negoc', data.CO_TIPO_NEGOCIO);
    myFormdatos.setItemValue('_creditototal', data.IM_CREDITO_TOTAL);
    myFormdatos.setItemValue('_deudatotal', data.IM_DEUDA_TOTAL);
    myFormdatos.setItemValue('_ingreso', data.CO_PERIODO_CLIEN_NVO);
    myFormdatos.setItemValue('_email', data.DE_EMAIL);
    myFormdatos.setItemValue('_webpage', data.DE_WEBPAGE);
    myFormdatos.setItemValue('_fredcata', fe_reg[2] + '/' + fe_reg[1] + '/' + fe_reg[0]);
    myFormdatos.setItemValue('_fregcliente', fe_regcli[0] ? fe_regcli[2] + '/' + fe_regcli[1] + '/' + fe_regcli[0] : '');
    myFormdatos.setItemValue('_fretiro', fe_retiro[0] ? fe_retiro[2] + '/' + fe_retiro[1] + '/' + fe_retiro[0] : '');
    data.ST_AGENTE_PERCEPCION === 'S' ? myFormdatos.checkItem('_ch_agentpercep') : myFormdatos.uncheckItem('_ch_agentpercep');
    data.ST_AGENTE_RETENEDOR === 'S' ? myFormdatos.checkItem('_ch_agenretenedor') : myFormdatos.uncheckItem('_ch_agenretenedor');
    data.ST_CLIENTE_NVO === 'S' ? myFormdatos.checkItem('_ch_clinuevo') : myFormdatos.uncheckItem('_ch_clinuevo');
    data.ST_RECAUDO === 'S' ? myFormdatos.checkItem('_ch_recaudo') : myFormdatos.uncheckItem('_ch_recaudo');
    if (data.ST_CLIENTE_CORPORATIVO === 'S') {
        cocliente_corpo = data.CO_CLIENTE_CORPORATIVO;
        myFormdatos.checkItem('_ch_clicorporativo'), myFormdatos.enableItem('_clientecorporativo'), myFormdatos.setItemValue('_clientecorporativo', data.CO_CLIENTE_CORPORATIVO + ' ' + data.DE_CLIENTE_CORPORATIVO), myFormdatos.enableItem('b_clientecorp');//myFormdatos.enableItem('b_creditolinea');
    } else {
        myFormdatos.uncheckItem('_ch_clicorporativo'), myFormdatos.disableItem('_clientecorporativo'), myFormdatos.setItemValue('_clientecorporativo', ''), myFormdatos.disableItem('b_clientecorp');//, myFormdatos.disableItem('b_creditolinea');
    }
    if (data.CO_LISTADO_PRECIOS > 0) {
        co_listadopre = data.CO_LISTADO_PRECIOS, co_seri_listado = data.CO_SERIE_LISTADO;
        myFormdatos.setItemValue('_listaprecios', data.CO_LISTADO_PRECIOS + ' ' + data.DE_LISTA_PRECIO), myFormdatos.checkItem('_ch_listaprecio'), myFormdatos.enableItem('_listaprecios'), myFormdatos.enableItem('b_busprecios');
    } else {
        myFormdatos.setItemValue('_listaprecios', ''), myFormdatos.uncheckItem('_ch_listaprecio'), myFormdatos.disableItem('_listaprecios'), myFormdatos.disableItem('b_busprecios');
    }
    form_edit_ini(true, 'D');
}

onbuscacliente = (win, value) => {
    if (value.length > 0) {
        win.window("wbusq").progressOn();
        myGrid.clearAll();
        myGrid.load(BASE_URL + 'MA010102/gridcliente/' + usrJson.empresa + '/2/' + value).then(function (text) {
            win.window("wbusq").progressOff();
        });
    } else {
        Swal.fire({ type: 'warning', text: 'Ingrese un texto para que la busqueda sea óptima', showConfirmButton: false, timer: 1500 });
    }
};

function style(name, value) {
    if (name === 'b_cliente')
        return "<div class='nomcliente'>" + value + "</div>";
    else
        return "<div class='s_estado'>" + value + "</div>";
}

onselect_sidebar = (id, lastId) => {
    _item_sidebar = id;
    switch (id) {
        case 's_datos':
            if (cocliente != 0) {
                typeof (myFormdatos) === 'undefined' ? _async_form(cocliente, id, data) : null;
            }
            break;
        case 's_direccion':  //console.log(typeof (myFormdatos));
            f_s_direcc();
            break;
        case 's_giro':
            f_s_giro_ne();
            break;
        case 's_garante':
            f_s_garante();
            break;
        case 's_contacto':
            f_s_contactos();
            break;
        case 's_cuentas':
            f_s_ctaban();
            break;
        default:
            null;
            break;
    }
    return true;
};

f_s_direcc = () => {
    if (cocliente > 0) {
        typeof (myLaouy_Direc) === undefined ? myLaouy_Direc.unload() : null;
        myLaouy_Direc = mySidebar.cells("s_direccion").attachLayout('2U');
        myLaouy_Direc.cells("a").hideHeader();
        myLaouy_Direc.cells("b").hideHeader();
        myLaouy_Direc.cells("a").setWidth(660);
        myToolbardirecc = myLaouy_Direc.cells("a").attachToolbar(base_tollbar);
        myToolbardirecc.setIconSize(48);
        myToolbardirecc.attachEvent("onClick", ontollbarclicdirec);
        myFormdirecc = myLaouy_Direc.cells("a").attachForm(f_direccion);
        myFormdirecc.attachEvent("onButtonClick", async (name) => {
            switch (name) {
                case '__buscarubigeo': console.log('hola');
                    output = await IniciarGridBusqueda(4, false, mainLayout);
                    if (output !== null) {
                        co_ubigeo = output.seleccion[0].ubigeo;
                    }
                    break;
                case '__fz_zn':
                    Wind_fz = new dhtmlXWindows();
                    Winid_fz = Wind_fz.createWindow("wfzvta", 0, 0, 1020, 380);
                    Wind_fz.window("wfzvta").hideHeader();
                    Wind_fz.window("wfzvta").setModal(true);
                    Wind_fz.window("wfzvta").denyResize();
                    Wind_fz.window("wfzvta").center();
                    myLaouy_fz = Wind_fz.window("wfzvta").attachLayout('2E');
                    myLaouy_fz.cells("a").hideHeader(), myLaouy_fz.cells("b").hideHeader();
                    myToolbarfz = myLaouy_fz.cells("a").attachToolbar(base_tollbar);
                    myToolbarfz.setIconSize(16);
                    myToolbarfz.attachEvent("onClick", ontollbarfz);
                    myToolbarfz.addButton("__exitfz", null, "Salir", "fas fa-edit txtrblue", "fas fa-edit disable");
                    myToolbarfz.disableItem('__edit');
                    myGridzco = myLaouy_fz.cells("a").attachGrid();
                    myGridzco.setImagePath('/assets/vendor/dhtmlx/codebase/imgs/dhxgrid_skyblue/');
                    myGridzco.setHeader(',CodZona,Estado,F.Registro,Usu. Ins.,F.Update,Usu. Update,Zona Comercial');
                    myGridzco.setInitWidthsP('5,10,10,10,10,15,10,35,10');
                    myGridzco.setColTypes('sub_row_grid,ro,ro,ro,ro,ro,ro,ro,ro');
                    myGridzco.setColumnHidden(1, true);
                    myGridzco.setColumnIds("cozona,codold,vigencia,f_reg,usu_regi,fe_upda,usu_upda,nom_zona");
                    myGridzco.setColumnHidden(0, true);
                    myGridzco.init();
                    myLaouy_fz.cells("a").progressOn();
                    myGridzco.load(BASE_URL + 'MA010102/gridfz/' + co_direccion + '/' + usrJson.empresa).then(function (a, b, c) {//console.log(a +'-' +b +'-'+c)
                        myGridzco.moveColumn(7, 1);
                        myLaouy_fz.cells("a").progressOff();
                    });
                    myGridzco.setStyle("", "", "", "font-style: oblique;color:black;font-weight:bold;");
                    _txtgrid(myGridzco, 2);
                    myGridzco.attachEvent("onRowSelect", function (rId, ind) {//
                        sel_zc = myGridzco.getRowData(rId), myToolbarfz.enableItem('__edit'), sel_zcid = rId, sel_fvID = undefined, sel_fv = undefined;// console.log(sel_zc);
                        subgrilla = myLaouy_fz.cells("b").attachGrid();
                        subgrilla.setHeader("Fuerza Venta,FVta,Dia.Visita,Dia.Cobranza,Dir.Entrega,Dir.Factura,Usua.Ins,F.Reg,Usua Update,Fec.Update,Id,Vigente");
                        subgrilla.setColTypes("ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro");
                        subgrilla.setInitWidths("200,150,90,90,77,77,100,100,100,100,100,100");
                        subgrilla.setColumnIds("nomcodfv,codfv,d_visita,d_cobranza,direntrega,dirfactura,usu_Reg,fe_Reg,usu_updat,fec_updat,id_,estado")
                        subgrilla.setColumnHidden(1, true);
                        subgrilla.init();
                        subgrilla.load(BASE_URL + 'MA010102/gridfz_fvta_d/' + co_direccion + '/' + usrJson.empresa + '/' + myGridzco.getRowData(rId).cozona).then(function (a, b, c) {//console.log(a +'-' +b +'-'+c)
                            myLaouy_fz.cells("a").progressOff();
                        });
                        _txtgrid(subgrilla, 11);
                        subgrilla.attachEvent("onRowSelect", function (id, ind) {
                            sel_fv = subgrilla.getRowData(id), sel_fvid = id;
                            var ids = myGridzco.getAllRowIds(); //console.log(sel_fv);
                            var parte = ids.split(",");
                            for (var i = 0; i < parte.length; i++) {
                                if (parte[i] !== rId) { myGridzco.cells(parte[i], 0).close(); }
                            }
                        });
                        subgrilla.setStyle("", "", "", "font-style: oblique;color:black;font-weight:bold;");// subgrilla.setStyle("background:#b2f3af;color:black;", "background:#f5ffb9;", "", " font-style: oblique;color:black;font-weight:bold;");
                    });
                    break;
                case '__zncomer':
                    break;
                default:
                    null;
                    break;
            }

        });
        myLaouy_Direc.cells("b").attachHTMLString('<div id="data_conten"></div>');
        myLaouy_Direc.setSeparatorSize(0, 0);
        myLaouy_Direc.setSeparatorSize(1, 0);
        myDataDirecc = new dhtmlXDataView({ container: "data_conten", drag: false, edit: false, select: true, type: { template: "<p style='margin-top: -5px;'  >#DE_PAIS#</p><span class='centrarpdiv'>#DE_DIRECCION#</span>", height: 60 }, autowidth: true });
        myLaouy_Direc.cells("a").progressOn();
        myDataDirecc.load(BASE_URL + 'MA010102/cargardirecc/' + cocliente, "json");
        myLaouy_Direc.cells("a").progressOff();
        myDataDirecc.attachEvent("onBeforeSelect", (id) => {
            _selecobject = myDataDirecc.get(id), co_direccion = myDataDirecc.get(id).CO_DIRECCION_ENTIDAD, __onSelectAntes(id, myDataDirecc, myToolbardirecc, estadook);
            return true;
        });
    } else {
        no_select_client(myLaouy_Direc, 's_direccion');
        /*   myLaouy_Direc = mySidebar.cells("s_direccion").attachLayout('1C');
           myLaouy_Direc.cells("a").attachHTMLString('<div class="nomcliente" style="text-align: center;         padding-bottom: 3%;"> SELECCIONE UN CLIENTE, POR FAVOR...</div><div  id="imgcargue" style="position: absolute;        top: 20; right: 10; bottom: 10; left: 10;              background: url(/assets/images/otros/icono-buscar-datos-nuevo.jpg)        no-repeat     center;         -webkit-background-size: cover;        -moz-background-size: cover;        -o-background-size: cover;         background-size: auto;"></div>');
           myLaouy_Direc.cells("a").hideHeader();*/

    }
};
function _txtgrid(grid, column) {
    grid.attachEvent("onDataReady", function () {
        var ids = grid.getAllRowIds();
        var parte = ids.split(",");
        for (var i = 0; i < parte.length; i++) {
            switch (grid.cells(parte[i], column).getValue()) {
                case 'Vigente':
                    grid.setCellTextStyle(parte[i], "text-decoration: none;");
                    break;
                case 'Retirado':
                    grid.setRowTextStyle(parte[i], "text-decoration: line-through;");
                    break;
                default:
                    grid.setRowTextStyle(parte[i], " text-decoration: red underline overline wavy;");
                    break;
            }
        }
    });


}
function __onSelectFZ(id, dataview, form, estadook) {   // console.log(dataview.get(id).DE_USUA_INS);
    if (dataview.get(id).ID > 0) {
        form.setItemValue('_fzvta', dataview.get(id).CO_FUERZA_VENTA);
        form.setItemValue('_diavista', dataview.get(id).DE_DIA_VISITA);
        form.setItemValue('_diacobranza', dataview.get(id).DE_DIA_COBRANZA);
        dataview.get(id).ST_DIRECCION_ENTREGA === 'S' ? form.checkItem('ch_direntrega') : form.uncheckItem('ch_direntrega');
        dataview.get(id).ST_DIRECCION_FACTURA === 'S' ? form.checkItem('ch_dirfactura') : form.uncheckItem('ch_dirfactura');
        form.setItemValue('usu_regis', dataview.get(id).DE_USUA_INS);
        form.setItemValue('f_sysfza', (dataview.get(id).FE_SYS).split('T')[0]);     // myFormdirecc.setItemValue('_fsys', (res[0].FE_SYS).split('T')[0]);
        form.setItemValue('usu_actua', dataview.get(id).DE_USUA_UPD);
        form.setItemValue('f_actualiza', dataview.get(id).FE_UPD);
        (dataview.get(id).ES_VIGENTE).toUpperCase() === 'VIGENTE' ? form.checkItem('ch_vigencia') : form.uncheckItem('ch_vigencia');
    }
}

function __onSelectAntes(id, dataview, tollbar, estadook) {
    var cod_direc = dataview.get(id).CO_DIRECCION_ENTIDAD;
    if (cod_direc > 0) {
        $.get(BASE_URL + "MA010102/datosdirecc/" + cod_direc, null, function (res) {
            myFormdirecc.setItemValue('cod_direc', res[0].CO_DIRECCION_ENTIDAD);
            co_ubigeo = res[0].CO_UBIGEO;
            myFormdirecc.setItemValue('_postal', (res[0].DE_CODIGO_POSTAL === null) ? '0' : res[0].DE_CODIGO_POSTAL);
            myFormdirecc.setItemValue('__debigeo', res[0].DE_UBIGEO);
            myFormdirecc.setItemValue('_via', res[0].CO_VIA);
            myFormdirecc.setItemValue('_zona', res[0].CO_ZONA);
            myFormdirecc.setItemValue('_altitud', ((res[0].DE_ALTITUD === null)) ? '0' : res[0].DE_ALTITUD);
            myFormdirecc.setItemValue('_latitud', (res[0].DE_LATITUD === null) ? '0' : res[0].DE_LATITUD);
            myFormdirecc.setItemValue('_finaten', res[0].DE_HORA_FIN_ATENCION === null ? '00:00' : ((res[0].DE_HORA_FIN_ATENCION).split('T')[1]).substring(0, 5));
            myFormdirecc.setItemValue('_iniaten', res[0].DE_HORA_INI_ATENCION === null ? '00:00' : ((res[0].DE_HORA_INI_ATENCION).split('T')[1]).substring(0, 5));
            myFormdirecc.setItemValue('_interior', (res[0].DE_INTERIOR === null) ? '0' : res[0].DE_INTERIOR);
            myFormdirecc.setItemValue('_nvia', (res[0].DE_NOMBRE_VIA === null) ? ' ' : res[0].DE_NOMBRE_VIA);
            myFormdirecc.setItemValue('_nzona', (res[0].DE_NOMBRE_ZONA === null) ? ' ' : res[0].DE_NOMBRE_ZONA);
            myFormdirecc.setItemValue('_referencias', (res[0].DE_REFERENCIAS === null) ? ' ' : res[0].DE_REFERENCIAS);
            myFormdirecc.setItemValue('_zoom', (res[0].DE_ZOOM === null) ? ' ' : res[0].DE_ZOOM);
            myFormdirecc.setItemValue('_estado', res[0].ES_REGISTRO);
            myFormdirecc.setItemValue('_fsys', (res[0].FE_SYS).split('T')[0]);
            res[0].NU_LOCAL_PRINCIPAL === 1 ? myFormdirecc.checkItem('ch_principal') : myFormdirecc.uncheckItem('ch_principal');
            myFormdirecc.setItemValue('_numero', (res[0].NU_NUMERO === null) ? '0' : res[0].NU_NUMERO);
            myFormdirecc.setItemValue('_usureg', res[0].DE_ALIAS);
            var p = { co_direccion: co_direccion, emp: usrJson.empresa };
            activa_form_direcc();
        });




        tollbar.enableItem('__edit');
        /*  if ((dataview.get(id).Vigencia).toUpperCase() === estadook.toUpperCase()) {
         tollbar.enableItem('__anula');
         tollbar.disableItem('__activar');
         } else {
         tollbar.disableItem('__anula');
         tollbar.enableItem('__activar');
         }*/
    } else {
        (['__anula', '__activar', '__edit']).forEach((elem) => {
            tollbar.disableItem(elem);
        });
    }
}


f_s_datos = () => {
    myLaouy_Dat = mySidebar.cells("s_datos").attachLayout('1C');
    if (cocliente > 0) {
        typeof (myLaouy_Dat) === undefined ? null : myLaouy_Dat.unload();
        myLaouy_Dat = mySidebar.cells("s_datos").attachLayout('1C');
        myLaouy_Dat.cells("a").hideHeader();
        myToolbardatos = myLaouy_Dat.cells("a").attachToolbar(base_tollbar);
        myToolbardatos.setIconSize(48);
        myToolbardatos.attachEvent("onClick", ontollbarclic);
        myFormdatos = myLaouy_Dat.cells("a").attachForm(f_datos_cliente);
        form_ini();
        myFormdatos.attachEvent("onButtonClick", async (name) => {
            var output;
            switch (name) {
                case 'b_dniservice':
                    mySidebar.cells("s_datos").progressOn(); // Wind_.window("wbusq").progressOn();
                    var p = { dni: myFormdatos.getItemValue('_nudocumento') };
                    $.post(BASE_URL + "home/buscadni", p, function (res) {
                        var value = res.value.split('|');
                        if (value[0].length > 0 || value[1].length > 0) {
                            myFormdatos.setItemValue('_apepat', ''), myFormdatos.setItemValue('_apemat', ''), myFormdatos.setItemValue('_nombres', ''), myFormdatos.setItemValue('_razsocial', ''), myFormdatos.setItemValue('_nomcomer', '');
                            myFormdatos.setItemValue('_apepat', value[0]), myFormdatos.setItemValue('_apemat', value[1]), myFormdatos.setItemValue('_nombres', value[2]), myFormdatos.setItemValue('_razsocial', value[0] + ' ' + value[1] + ' ' + value[2]), myFormdatos.setItemValue('_nomcomer', value[0] + ' ' + value[1] + ' ' + value[2]);
                        }
                    }, "json");
                    mySidebar.cells("s_datos").progressOff(); ///    Wind_.window("wbusq").progressOff();
                    break;
                case 'b_busprecios':
                    output = await IniciarGridBusqueda(6, false, mainLayout);
                    if (output !== null) {
                        co_listadopre = output.seleccion[0].colistado;
                        co_seri_listado = output.seleccion[0].serielistado;
                        myFormdatos.setItemValue('_listaprecios', output.seleccion[0].colistado + ' ' + output.seleccion[0].nombre);
                    }
                    break;
                case 'b_clientecorp':
                    output = await IniciarGridBusqueda(5, false, mainLayout);
                    if (output !== null) {
                        // console.log(output);
                        cocliente_corpo = output.seleccion[0].codigo;
                        nom_clien_corpo = output.seleccion[0].ncomercial;
                        myFormdatos.setItemValue('_clientecorporativo', cocliente_corpo + ' ' + nom_clien_corpo);
                        //                    co_seri_listado = output.seleccion[0].serielistado;
                        //                    myFormdatos.setItemValue('_listaprecios', output.seleccion[0].colistado + ' ' + output.seleccion[0].nombre);
                    }
                    break;
                default:
                    null;
                    break;
            }
        });
        myFormdatos.attachEvent("onChange", function (name, value, state) {
            switch (name) {
                case '_tipoper':
                    if (value === '02' || value === '04') {
                        myFormdatos.setItemValue('_apepat', ''), myFormdatos.setItemValue('_apemat', ''), myFormdatos.setItemValue('_nombres', ''), myFormdatos.disableItem('_apepat'), myFormdatos.disableItem('_apemat'), myFormdatos.disableItem('_nombres');
                    } else {
                        myFormdatos.enableItem('_apepat'), myFormdatos.enableItem('_apemat'), myFormdatos.enableItem('_nombres');
                    }
                    break;
                case '_ch_listaprecio':
                    if (state === false) {
                        co_listado = 0, myFormdatos.setItemValue('_listaprecios', ''), myFormdatos.disableItem('_listaprecios'), myFormdatos.disableItem('b_busprecios');
                    } else
                        myFormdatos.enableItem('_listaprecios'), myFormdatos.enableItem('b_busprecios');
                    break;
                case '_ch_clicorporativo':
                    if (state === false) {
                        myFormdatos.disableItem('_clientecorporativo'), myFormdatos.setItemValue('_clientecorporativo', ''), myFormdatos.disableItem('b_clientecorp'); //, myFormdatos.disableItem('b_creditolinea');
                    } else {
                        myFormdatos.enableItem('_clientecorporativo'), myFormdatos.enableItem('b_clientecorp'); //, myFormdatos.enableItem('b_creditolinea');
                    }
                    break;
                default:
                    if (name === '_ch_recaudo' || name === '_ch_excepcredito') {
                        if (state === false) {
                            myFormdatos.disableItem('_tipobanco'), myFormdatos.setItemValue('_tipobanco', "0");
                        } else
                            myFormdatos.enableItem('_tipobanco');
                    }
                    break;
            }
        });
        //beforechange(data);
    } else {
        no_select_client(myLaouy_Dat, 's_datos');
        /*myLaouy_Dat = mySidebar.cells("s_datos").attachLayout('1C');
        myLaouy_Dat.cells("a").attachHTMLString('<div class="nomcliente" style="text-align: center;         padding-bottom: 3%;"> SELECCIONE UN CLIENTE, POR FAVOR...</div><div  id="imgcargue"    style="position: absolute;     top: 20; right: 10; bottom: 10; left: 10;              background: url(/assets/images/otros/icono-buscar-datos-nuevo.jpg)        no-repeat     center;         -webkit-background-size: cover;        -moz-background-size: cover;        -o-background-size: cover;         background-size: auto;"></div>');
        myLaouy_Dat.cells("a").hideHeader();*/

    }
};

ontollbarclic = async (id) => {
    switch (id) {
        case '__lincredito':
            Windln_ = new dhtmlXWindows();
            Windln_.createWindow("wbusln", 0, 0, 700, 350);
            Windln_.window("wbusln").hideHeader();
            Windln_.window("wbusln").setModal(true);
            Windln_.window("wbusln").denyResize();
            Windln_.window("wbusln").center();
            myWindln = Windln_.window("wbusln").attachLayout('2U');
            myWindln.cells('a').hideHeader();
            myWindln.cells('b').hideHeader();
            myFormLC = myWindln.cells('a').attachForm(st_form_lcredito);
            myFormLC.attachEvent("onButtonClick", (name) => {
                switch (name) {
                    case 'bc_nuevo':
                        // myFormLC.enableItem('_fuerzavta');
                        break;
                    case 'b_cancel':
                        Windln_.window("wbusln").close();
                        break;
                    case '__edit':
                        console.log('a11');
                        break;
                    case 'bc_save':
                        let p = { ucliente: parseInt(cocliente), u_autoriza: parseInt(usrJson.codigo), emp: parseInt(usrJson.empresa), fv: parseInt(myFormLC.getItemValue('_fuerzavta')), cmone: parseInt(myFormLC.getItemValue('_clmoneda')), stper: myFormLC.isItemChecked('__stcredperm') ? 'S' : 'N', obs: myFormLC.getItemValue('__obscredito'), mont: parseFloat(myFormLC.getItemValue('__nucredito')) }
                        $.post(BASE_URL + "MA010102/savelinea", p, function (res) {
                            if (parseFloat(res.codigo) == '0') {
                                Swal.fire('Bien!', res.message, 'success');
                                myGridLineaC.clearAll();
                                myGridLineaC.load(BASE_URL + 'MA010102/grid_linea/' + usrJson.empresa + '/' + cocliente);
                                //Windln_.window("wbusln").close();
                            }
                        }, "json");
                        break;

                    default:
                        null;
                        break;
                }
            });

            myGridLineaC = myWindln.cells('b').attachGrid();
            myGridLineaC.setHeader('CMoneda,FzVta, Monto,Moneda,Estado,Fecha,STperma,Obs');
            myGridLineaC.setInitWidthsP('20,20,20,20,20,40,2,2');
            myGridLineaC.setColTypes('ro,ro,ro,ro,ro,ro,ro,ro');
            myGridLineaC.setColumnIds("_moneda,_cofrzvta,_monto,_nmoneda,_stado,_fecha,_permanente,_obsrv");
            myGridLineaC.setColumnHidden(1, true);
            myGridLineaC.setColumnHidden(0, true);
            myGridLineaC.setColumnHidden(6, true);
            myGridLineaC.setColumnHidden(7, true);
            myGridLineaC.setNumberFormat("0,000.00", 2);
            myGridLineaC.init();
            myGridLineaC.load(BASE_URL + 'MA010102/grid_linea/' + usrJson.empresa + '/' + cocliente);
            myGridLineaC.attachEvent("onRowSelect", function (id, ind) {
                let arr_out = [];
                arr_out.push(myGridLineaC.getRowData(id));
                const out = { seleccion: arr_out };                  //console.log(out);
                myFormLC.setItemValue('_fuerzavta', out.seleccion[0]._cofrzvta);
                myFormLC.setItemValue('__nucredito', out.seleccion[0]._monto);
                myFormLC.setItemValue('__obscredito', out.seleccion[0]._obsrv);
                myFormLC.setItemValue('_clmoneda', out.seleccion[0]._moneda);
                out.seleccion[0]._permanente === 'S' ? myFormLC.checkItem('__stcredperm') : myFormLC.uncheckItem('__stcredperm');
            });
            break;
        case '__cancel':
            codcliente = 0, permiso_cataedit = 'N';
            if (codcliente > 0) {
                cargar_datos_clie(json_select);
            } else {
                form_ini();//   form_edit_ini(false, 'D');
                myFormdatos.disableItem('st_personales'), myFormdatos.disableItem('st_cliente');
                myFormdatos.uncheckItem('st_personales'), myFormdatos.uncheckItem('st_cliente'), myToolbardatos.disableItem('__save'), myToolbardatos.disableItem('__cancel');
            }
            break;
        case '__nuevo':
            codcliente = 0, myToolbardatos.disableItem('__edit'), permiso_cataedit = 'S';
            myForm.setItemValue('b_cliente', ''), myForm.setItemValue('b_estado', ''), myForm.setItemValue('b_asignado', '');
            myFormdatos.checkItem('st_personales'), myFormdatos.enableItem('st_personales');
            myFormdatos.checkItem('st_cliente'), myFormdatos.enableItem('st_cliente'), myToolbardatos.disableItem('__lincredito');
            myToolbardatos.enableItem('__save'), myToolbardatos.enableItem('__cancel');
            myFormdatos.enableItem('b_dniservice');
            myFormdatos.setItemValue('_clvigencia', 'Vigente');
            form_ini();//// form_edit_ini(false, 'E');
            break;
        case '__save':
            let data = myFormdatos.getItemValue('_tipodoc');
            console.log(data);
            switch (data) {
                case '1':
                    myFormdatos.getItemValue('_nudocumento').length !== 8 ? Swal.fire({ type: 'error', title: 'Dni Incorrecto...', text: 'Debe tener 8 digitos' }) : grabar_datos();
                    break;
                case '6':
                    myFormdatos.getItemValue('_nudocumento').length !== 11 ? Swal.fire({ type: 'error', title: 'RUC Incorrecto...', text: 'Debe tener 11 digitos' }) : grabar_datos();
                    break;
                default:
                    null;
                    break;
            }
            break;
        case '__edit': //console.log('111');
            var output = await IniciarFormularioSeguridad(58, mainLayout);
            if (JSON.parse(output).result === 'S') {
                permiso_cataedit = 'S',
                    form_edit_ini(false, 'E'),
                    myToolbardatos.enableItem('__cancel');
                myToolbardatos.enableItem('__save'), myFormdatos.enableItem('b_dniservice');  // console.log('cocliente : '+ cocliente);
                if (cocliente === 0 || cocliente === null || cocliente === undefined) {
                    myFormdatos.setReadonly('st_cliente', false);
                }
            } else { console.log(JSON.parse(output).result) }
            break;
        default:
            null;
            break;
    }
};

ontollbarfz = async (id) => {
    switch (id) {
        case '__exitfz':
            sel_zc = undefined, sel_fv = undefined, sel_zcid = undefined, sel_fvid = undefined;
            Wind_fz.window("wfzvta").close();
            break;
        case '__edit':
            cargar_windo_editfz('edit');
            if (sel_zc !== undefined) {
                myFormzc.disableItem('_zncomer');
                myFormzc.setItemValue('_zncomer', sel_zc.cozona);
                myFormzc.setItemValue('_estado', sel_zc.vigencia);
                myFormzc.setItemValue('u_regis', sel_zc.usu_regi);
                let fe_regZ = (sel_zc.f_reg).length === 0 ? '' : sel_zc.f_reg;
                myFormzc.setItemValue('f_REGzcom', fe_regZ);
                myFormzc.setItemValue('u_actu', sel_zc.usu_upda);
                let fe_regZ1 = (sel_zc.fe_upda).length === 0 ? '' : sel_zc.fe_upda;
                myFormzc.setItemValue('f_act_zn', fe_regZ1);
            }
            if (sel_fv !== undefined) {
                myFormfz.setItemValue('_fzvta', sel_fv.codfv);
                myFormfz.setItemValue('_diavista', sel_fv.d_visita);
                myFormfz.setItemValue('_diacobranza', sel_fv.d_cobranza);
                let fe_reg = sel_fv.fe_Reg === null ? '' : sel_fv.fe_Reg;
                myFormfz.setItemValue('usu_regis', sel_fv.usu_Reg);
                myFormfz.setItemValue('f_sysfza', fe_reg);
                myFormfz.setItemValue('usu_actua', sel_fv.usu_updat);
                let fe_act = sel_fv.fec_updat === null ? '' : sel_fv.fec_updat;
                myFormfz.setItemValue('f_actualiza', fe_act);
                sel_fv.direntrega.toUpperCase() === 'S' ? myFormfz.checkItem('ch_direntrega') : myFormfz.uncheckItem('ch_direntrega');
                sel_fv.dirfactura.toUpperCase() === 'S' ? myFormfz.checkItem('ch_dirfactura') : myFormfz.uncheckItem('ch_dirfactura');
                sel_fv.estado.toUpperCase() === 'VIGENTE' ? myFormfz.checkItem('ch_vigencia') : myFormfz.uncheckItem('ch_vigencia');
            }
            break;
        case '__cancel':
            __onSelectAntes(_selecobject, myDataDirecc, myToolbardirecc, estadook);
            break;
        case '__nuevo':
            sel_fv = {}, sel_zc = {}, sel_fvid = 0, sel_zcid = 0, cargar_windo_editfz('nuevo');


            break;
        case '__save':
            grabar_direcc();
            break;

        default:
            null;
            break;
    }
};

cargar_windo_editfz = (stado) => { //console.log(sel_fv);
    Windedit_fz = new dhtmlXWindows();
    Winidedi_fz = Windedit_fz.createWindow("wfzvta_ed", 0, 0, 920, 380);
    Windedit_fz.window("wfzvta_ed").hideHeader();
    Windedit_fz.window("wfzvta_ed").setModal(true);
    Windedit_fz.window("wfzvta_ed").denyResize();
    Windedit_fz.window("wfzvta_ed").center();
    myLayouedit_fz = Windedit_fz.window("wfzvta_ed").attachLayout('2U');
    myLayouedit_fz.cells("a").hideHeader();
    myLayouedit_fz.cells("a").setWidth(440);
    myLayouedit_fz.cells("b").hideHeader();
    if (sel_zc !== undefined) {
        myFormzc = myLayouedit_fz.cells("a").attachForm(f_zcomer);
        botones_ventana(myFormzc);
    }
    if (sel_fv !== undefined) { //console.log(sel_fv);
        myFormfz = myLayouedit_fz.cells("b").attachForm(f_frzvta);
        botones_ventana(myFormfz);
    }
    if (stado === 'nuevo') { myFormzc.enableItem('_zncomer'); }
}
botones_ventana = (form) => {
    form.attachEvent("onButtonClick", async (name) => {
        switch (name) {
            case 'b_savefv':
                let st_direc = myFormfz.isItemChecked('ch_direntrega') === true ? 'S' : 'N';
                let st_fac = myFormfz.isItemChecked('ch_dirfactura') === true ? 'S' : 'N';
                let st_estado = myFormfz.isItemChecked('ch_vigencia') === true ? 'Vigente' : 'Retirado';
                let pa = {
                    x_empresa: usrJson.empresa, x_usuario: usrJson.codigo, x_co_direccion_entidad: co_direccion,
                    x_zona_comercial: myFormzc.getItemValue('_zncomer'),
                    x_cadena_zona_fv: myFormfz.getItemValue('_fzvta') + '@@@' + sel_fv.id_ + '@@@' + myFormfz.getItemValue('_diavista') + '@@@' + myFormfz.getItemValue('_diacobranza') + '@@@' + st_direc + '@@@' + st_fac + '@@@' + st_estado + "|||",
                    x_cant_filas: 1
                };
                $.post(BASE_URL + "MA010102/update_fv", pa, function (res) {
                    if (parseFloat(res.codigo) > 0) {                        //console.log(sel_fvid);
                        subgrilla.cells(sel_fvid, 4).setValue(myFormfz.isItemChecked('ch_direntrega') === true ? 'S' : 'N');
                        subgrilla.cells(sel_fvid, 5).setValue(myFormfz.isItemChecked('ch_dirfactura') === true ? 'S' : 'N');
                        subgrilla.cells(sel_fvid, 8).setValue(usrJson.alias);
                        subgrilla.cells(sel_fvid, 9).setValue(res.fe_upd);
                        subgrilla.cells(sel_fvid, 3).setValue(myFormfz.getItemValue('_diacobranza'));
                        subgrilla.cells(sel_fvid, 2).setValue(myFormfz.getItemValue('_diavista'));
                        var t = myFormfz.getSelect('_fzvta');
                        subgrilla.cells(sel_fvid, 0).setValue(t.options[t.selectedIndex].text);
                        subgrilla.cells(sel_fvid, 1).setValue(myFormfz.getItemValue('_fzvta'));
                        console.log(myFormfz.getItemValue('_fzvta') + '-' + t.options[t.selectedIndex].text);
                        if (myFormfz.isItemChecked('ch_vigencia') === true) {
                            subgrilla.cells(sel_fvid, 11).setValue("Vigente"), subgrilla.setRowTextStyle(sel_fvid, "text-decoration: none;"); //sel_fv.estado = 'Vigente';
                        } else {
                            subgrilla.cells(sel_fvid, 11).setValue("Retirado"), subgrilla.setRowTextStyle(sel_fvid, "text-decoration: line-through;");  // sel_fv.estado = 'Retirado',
                        }
                        subgrilla.clearSelection(), sel_fv = undefined, sel_fvid = undefined;
                        Windedit_fz.window("wfzvta_ed").close(), Swal.fire('Bien!', res.message, 'success');
                    } else {
                        Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se guardó sus cambios  :' + res.message });
                    }
                }, "json");
                break;
            case 'b_savezn': //console.log('hola');
                let zoncomold = myFormzc.getItemValue('_zncomer') === sel_zc.cozona ? sel_zc.cozona : myFormzc.getItemValue('_zncomer');
                let p = {
                    x_empresa: usrJson.empresa, x_usuario: usrJson.codigo, x_co_direccion_entidad: co_direccion, x_cadena_zona: myFormzc.getItemValue('_zncomer') + '@@@' + zoncomold + '@@@' + myFormzc.getItemValue('_estado') + "|||", x_cant_filas: 1
                };
                $.post(BASE_URL + "MA010102/updatezon_comer", p, function (res) {
                    if (parseFloat(res.codigo) > 0) {
                        if ((myFormzc.getItemValue('_estado')).toUpperCase() === 'VIGENTE') {
                            sel_zc.vigencia = 'Vigente', myGridzco.cells(sel_zcid, 3).setValue("Vigente"), myGridzco.setRowTextStyle(sel_zcid, "text-decoration: none;");
                        } else {
                            sel_zc.vigencia = 'Retirado', myGridzco.cells(sel_zcid, 3).setValue("Retirado"), myGridzco.setRowTextStyle(sel_zcid, "text-decoration: line-through;");
                        }
                        Windedit_fz.window("wfzvta_ed").close(), Swal.fire('Bien!', res.message, 'success');
                    } else {
                        Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se guardó sus cambios  :' + res.message });
                    }
                }, "json");

                break;
            case 'b_cancel':
                Windedit_fz.window("wfzvta_ed").close();
                break;
            case 'b_salir':
                Windedit_fz.window("wfzvta_ed").close();
                break;
        }
    });
}
ontollbarclicdirec = async (id) => {
    switch (id) {
        case '__edit': console.log(co_direccion);
            if (co_direccion > 0) {
                (['__nuevo', '__edit']).forEach((elem) => {
                    myToolbardirecc.disableItem(elem);
                });
                (['__save', '__cancel']).forEach((elem) => {
                    myToolbardirecc.enableItem(elem);
                });
            } else {
                Swal.fire('Alerta!', 'Debes seleccionar una dirección para poder editarla..', 'error');
            }
            break;
        case '__cancel':
            __onSelectAntes(_selecobject, myDataDirecc, myToolbardirecc, estadook);
            break;
        case '__nuevo':
            codcliente = 0, myToolbardatos.disableItem('__edit'), permiso_cataedit = 'S';
            myForm.setItemValue('b_cliente', ''), myForm.setItemValue('b_estado', ''), myForm.setItemValue('b_asignado', '');
            myFormdatos.checkItem('st_personales'), myFormdatos.enableItem('st_personales');
            myFormdatos.checkItem('st_cliente'), myFormdatos.enableItem('st_cliente'), myToolbardatos.disableItem('__lincredito');
            myToolbardatos.enableItem('__save'), myToolbardatos.enableItem('__cancel');
            myFormdatos.enableItem('b_dniservice');
            myFormdatos.setItemValue('_clvigencia', 'Vigente');
            form_ini();//// form_edit_ini(false, 'E');
            break;
        case '__save':
            grabar_direcc();
            break;

        default:
            null;
            break;
    }
};
grabar_direcc = () => {
    let p = {
        x_alias: usrJson.alias, x_co_usuario: usrJson.codigo, x_co_direccion_entidad: _selecobject.CO_DIRECCION_ENTIDAD, x_co_catalogo_entidad: '0',
        x_co_ubigeo: co_ubigeo, x_co_via: myFormdirecc.getItemValue('_via'), x_co_zona: myFormdirecc.getItemValue('_zona'),
        x_de_nombre_zona: myFormdirecc.getItemValue('_nzona').length === 0 ? ' ' : myFormdirecc.getItemValue('_nzona'),
        x_de_nombre_via: myFormdirecc.getItemValue('_nvia').length === 0 ? ' ' : myFormdirecc.getItemValue('_nvia'),
        x_nu_numero: myFormdirecc.getItemValue('_numero').length === 0 ? '0' : myFormdirecc.getItemValue('_numero'),
        x_de_interior: myFormdirecc.getItemValue('_interior').length === 0 ? '0' : myFormdirecc.getItemValue('_interior'),
        x_de_referencias: myFormdirecc.getItemValue('_referencias').length === 0 ? ' ' : myFormdirecc.getItemValue('_referencias'),
        x_nu_local_principal: myFormdirecc.isItemChecked('ch_principal') === true ? '1' : '0',
        x_de_codigo_postal: myFormdirecc.getItemValue('_postal').length === 0 ? '0' : myFormdirecc.getItemValue('_postal'),
        x_es_registro: _selecobject.ES_REGISTRO, x_de_altitud: myFormdirecc.getItemValue('_altitud').length === 0 ? '0' : myFormdirecc.getItemValue('_altitud'),
        x_de_latitud: myFormdirecc.getItemValue('_latitud').length === 0 ? '0' : myFormdirecc.getItemValue('_latitud'),
        x_de_zoom: myFormdirecc.getItemValue('_zoom').length === 0 ? '1' : myFormdirecc.getItemValue('_zoom'),
        x_de_hora_ini_atencion: myFormdirecc.getItemValue('_iniaten').length === 0 ? '00:00' : myFormdirecc.getItemValue('_iniaten'),
        x_de_hora_fin_atencion: myFormdirecc.getItemValue('_finaten').length === 0 ? '00:00' : myFormdirecc.getItemValue('_finaten'),
        x_st_erased: _selecobject.ST_ERASED, x_cadena: '', x_cant_filas: '0'
    };

    $.post(BASE_URL + "MA010102/grabadirec", p, function (res) {

        //        if (parseFloat(res.codigo) > 0) {
        //            permiso_cataedit = 'N';
        //            form_edit_ini(true, 'D');
        //            myToolbardatos.disableItem('__save'), myToolbardatos.enableItem('__edit'), myToolbardatos.disableItem('__cancel'), myForm.setItemValue('b_estado', res.estado), myForm.setItemValue('b_cliente', res.nombre), myFormdatos.setItemValue('_fredcata', res.fecha), myFormdatos.disableItem('b_dniservice');
        //            Swal.fire('Bien!', res.message, 'success');
        //        }

    }, "json");
};
grabar_datos = () => {
    let p = {
        st_permiso_editar_cata_enti: permiso_cataedit, x_empresa: usrJson.empresa, x_alias: usrJson.alias, x_co_catalogo_entidad: co_cata_entidad, x_de_razon_social: myFormdatos.getItemValue('_razsocial'), x_nu_documento: myFormdatos.getItemValue('_nudocumento'),
        x_co_tipo_persona: myFormdatos.getItemValue('_tipoper'), x_co_tipo_doc_ide: myFormdatos.getItemValue('_tipodoc'),
        x_de_procedencia: myFormdatos.getItemValue('_procedencia'), x_de_ape_paterno: myFormdatos.getItemValue('_apepat'), x_de_ape_materno: myFormdatos.getItemValue('_apemat'), x_de_nombre: myFormdatos.getItemValue('_nombres'),
        x_de_nombre_comercial: myFormdatos.getItemValue('_nomcomer'), x_de_origen: myFormdatos.getItemValue('_origen'), x_co_cliente: cocliente,
        x_co_tipo_cliente: myFormdatos.getItemValue('_tipocliente'), x_st_recaudo: myFormdatos.isItemChecked('_ch_recaudo') ? 'S' : 'N', x_co_banco: myFormdatos.getItemValue('_tipobanco'), x_co_tipo_negocio: myFormdatos.getItemValue('_tipo_negoc'),
        x_co_listado_precios: co_listadopre, x_co_serie_listado: co_seri_listado, x_st_agente_retenedor: myFormdatos.isItemChecked('_ch_agenretenedor') ? 'S' : 'N', x_st_agente_percepcion: myFormdatos.isItemChecked('_ch_agentpercep') ? 'S' : 'N',
        x_st_cliente_nvo: myFormdatos.isItemChecked('_ch_clinuevo') ? 'S' : 'N', x_co_periodo_clien_nvo: myFormdatos.getItemValue('_ingreso'), x_st_cliente_corporativo: myFormdatos.isItemChecked('_ch_clicorporativo') ? 'S' : 'N', x_co_cliente_corporativo: cocliente_corpo,
        x_im_credito_total: myFormdatos.getItemValue('_creditototal'), x_im_deuda_total: myFormdatos.getItemValue('_deudatotal'), x_de_email: myFormdatos.getItemValue('_email'), x_de_webpage: myFormdatos.getItemValue('_webpage'),
        x_es_vigencia_cliente: myFormdatos.getItemValue('_clvigencia'),
        x_fe_retiro_cliente: myFormdatos.getItemValue('_fretiro'), x_St_Excep_Cred: myFormdatos.isItemChecked('_ch_excepcredito') ? 'S' : 'N'
    };

    $.post(BASE_URL + "MA010102/update", p, function (res) {
        if (parseFloat(res.codigo) > 0) {
            permiso_cataedit = 'N';
            form_edit_ini(true, 'D');
            myFormdatos.setItemValue('_razsocial', myFormdatos.getItemValue('_apepat') + ' ' + myFormdatos.getItemValue('_apemat') + ' ' + myFormdatos.getItemValue('_nombres'));
            myToolbardatos.disableItem('__save'), myToolbardatos.enableItem('__edit'), myToolbardatos.disableItem('__cancel'), myForm.setItemValue('b_estado', res.estado), myForm.setItemValue('b_cliente', res.nombre), myFormdatos.setItemValue('_fredcata', res.fecha), myFormdatos.disableItem('b_dniservice');
            Swal.fire('Bien!', res.message, 'success');
        } else {
            Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se guardó sus cambios  :' + res.message });
        }

    }, "json");
};

function activa_form_direcc() {
    (['ch_borrado', 'ch_principal', '_nvia', '_via', '_zona', '_nzona', '_postal', '_numero', '_interior', '_referencias', '_altitud', '_latitud', '_zoom', '_iniaten', '_finaten']).forEach((elm) => {
        myFormdirecc.setReadonly(elm, false);
    });
    (['__buscarubigeo', '_via', '_zona', '__fz_zn']).forEach((elm) => {
        myFormdirecc.enableItem(elm);
    });
}

function form_edit_ini(bollean, stado) {
    (['_nudocumento', '_razsocial', '_nomcomer', '_apepat', '_apemat', '_nombres']).forEach((elm) => {
        (stado === 'E' && elm === '_razsocial' && bollean === false) ? myFormdatos.setReadonly(elm, true) : myFormdatos.setReadonly(elm, bollean);
    });
    (['_tipodoc', '_tipoper', '_procedencia', '_origen', '_clvigencia']).forEach((elm) => {
        stado === 'E' ? myFormdatos.enableItem(elm) : myFormdatos.disableItem(elm);
    });
    //   if (cocliente > 0) {
    (['_tipocliente', '_tipobanco', '_tipo_negoc', '_ch_listaprecio', '_ch_recaudo', '_ch_agenretenedor', '_ch_agentpercep', '_ch_clinuevo', '_ch_clicorporativo', '_ch_excepcredito']).forEach((elm) => {
        stado === 'E' ? myFormdatos.enableItem(elm) : myFormdatos.disableItem(elm);
    });
    (['_creditototal', '_deudatotal', '_ingreso', '_email', '_webpage', '_fregcliente', '_fretiro']).forEach((elm) => {
        myFormdatos.setReadonly(elm, bollean);
    });
}

function form_ini() {
    myFormdatos.setItemValue('_vigencia', 'Vigente');
    (['_ch_recaudo', '_ch_excepcredito', '_ch_agenretenedor', '_ch_agentpercep', '_ch_clinuevo', '_ch_clicorporativo']).forEach((elm) => {
        myFormdatos.uncheckItem(elm);
    });
    (['_nudocumento', '_razsocial', '_nomcomer', '_apepat', '_apemat', '_nombres', '_listaprecios', '_ingreso', '_clientecorporativo', '_creditototal', '_deudatotal', '_email', '_webpage', '_fregcliente', '_fvigencia', '_fretiro']).forEach((elm) => {
        myFormdatos.setReadonly(elm, false), myFormdatos.setItemValue(elm, '');
    });
    (['_tipodoc', '_tipoper', '_procedencia', '_origen', '_tipocliente', '_tipobanco', '_tipo_negoc', '_ch_listaprecio', '_ch_recaudo', '_ch_excepcredito', '_ch_agenretenedor', '_ch_agentpercep', '_ch_clinuevo', '_ch_clicorporativo', '_clvigencia']).forEach((elm) => {
        myFormdatos.enableItem(elm);
    });
    myFormdatos.setItemValue('_ingreso', '0'), myFormdatos.setItemValue('_creditototal', '0.00'), myFormdatos.setItemValue('_deudatotal', '0.00')
}

function valores_defecto() {
    if (codcliente > 0) {
        myFormdatos.setItemValue('_tipobanco', 0);
        myFormdatos.setItemValue('_vigencia', 'Vigente');
    }
}

f_s_giro_ne = () => {
    myLayou_giro = mySidebar.cells("s_giro").attachLayout('1C');
    let _option = '0';
    if (cocliente > 0) {
        myLayou_giro = mySidebar.cells("s_giro").attachLayout('2U');
        myLayou_giro.cells("a").hideHeader();
        myLayou_giro.cells("b").hideHeader();
        myLayou_giro.cells("a").setWidth(660);
        myLayou_giro.setSeparatorSize(0, 0);
        myForm_giro = myLayou_giro.cells("b").attachForm(f_giro);
        myForm_giro.attachEvent("onButtonClick", function (name) {
            switch (name) {
                case 'b_add': sel_giroid = undefined, _option = 'nuevo', sel_giro = {}, myGridgiro.clearSelection(), f_cleam_fgiro(sel_giro, 'nuevo'), myForm_giro.disableItem('b_add'), myForm_giro.disableItem('b_edit'), myForm_giro.enableItem('b_save'), myForm_giro.enableItem('b_cancel');
                    break;
                case 'b_edit':
                    _option = 'edit', f_cleam_fgiro(sel_giro, 'edit'), myForm_giro.disableItem('b_edit'), myForm_giro.disableItem('b_add'), myForm_giro.enableItem('b_save'), myForm_giro.enableItem('b_cancel'), myForm_giro.enableItem('_giro'), myForm_giro.setReadonly('giro_detalle', false);
                    myForm_giro.enableItem('giro_stado');
                    break;
                case 'b_save':
                    let p = {
                        xoption: _option, x_co_catalogo_entidad: cocliente, xcorubro: myForm_giro.getItemValue('_giro'), xdetalle: myForm_giro.getItemValue('giro_detalle'),
                        xvigencia: myForm_giro.getItemValue('giro_stado')
                    };
                    $.post(BASE_URL + "MA010102/grabagironego", p, function (res) {
                        if (parseFloat(res.codigo) > 0) {
                            let newId = (new Date()).valueOf();
                            let t = myForm_giro.getSelect('_giro');
                            if (_option === 'nuevo') {
                                myGridgiro.addRow(newId, myForm_giro.getItemValue('_giro') + ',' + t.options[t.selectedIndex].text + ',' + myForm_giro.getItemValue('giro_detalle') + ',' + res.fe_reg + ',' +
                                    myForm_giro.getItemValue('giro_stado') + ',,' + cocliente);
                            } else {
                                myGridgiro.cells(sel_giroid, 2).setValue(myForm_giro.getItemValue('giro_detalle'));
                                myGridgiro.cells(sel_giroid, 4).setValue(myForm_giro.getItemValue('giro_stado'));
                                myGridgiro.cells(sel_giroid, 5).setValue(myForm_giro.getItemValue('giro_stado') === 'Retirado' ? res.fe_reg : '');
                                myGridgiro.setRowTextStyle(sel_giroid, myForm_giro.getItemValue('giro_stado') === 'Retirado' ? "text-decoration: line-through;" : "text-decoration: none;");
                                myGridgiro.clearSelection(), sel_giroid = undefined, sel_giro = {};
                            }
                            f_cleam_fgiro({}, 'save'), myForm_giro.setItemValue('titleform', 'Seleccione Giro Negocio'), f_cleam_fcontac({}, 'save');
                            Swal.fire('Bien!', res.message, 'success');
                        } else {
                            Swal.fire({ type: 'error', title: 'Algo salió mal...', text: res.message });
                        }
                    }, "json");
                    break;
                case 'b_cancel': sel_giroid = undefined, _option = '0', myForm_giro.enableItem('b_add'), sel_giro = {}, myGridgiro.clearSelection(), f_cleam_fgiro(sel_giro, 'cancel'), myForm_giro.setReadonly('giro_detalle', true), myForm_giro.disableItem('b_edit'), myForm_giro.disableItem('b_save');
                    break;
            }
        });
        myGridgiro = myLayou_giro.cells("a").attachGrid();
        myGridgiro.setHeader("Rubro,Nombre,Detalles,F.Reg,Estado,F.Retiro,Cocliente");
        myGridgiro.setColTypes("ro,ro,ro,ro,ro,ro,ro");
        myGridgiro.setInitWidthsP("10,20,30,15,20,15,15");
        myGridgiro.setColAlign("left,left,left,center,center,center,center");
        myGridgiro.setColumnIds("co_giro,de_giro,giro_deta,giro_fereg,giro_stado,giro_fretiro,catalgo");
        myGridgiro.init();
        myGridgiro.setColumnHidden(0, true), myGridgiro.setColumnHidden(6, true);
        myLayou_giro.cells("a").progressOn();
        myGridgiro.load(BASE_URL + 'MA010102/giro_nego/' + cocliente);
        myLayou_giro.cells("a").progressOff();
        myGridgiro.attachEvent("onRowSelect", function (rId, ind) {
            sel_giro = myGridgiro.getRowData(rId); sel_giroid = rId;
            f_cleam_fgiro(sel_giro, 'select');
        });
        _txtgrid(myGridgiro, 4);
    } else {
        no_select_client(myLayou_giro, 's_giro');

    }
};

f_cleam_fgiro = (sel_giro, op) => {
    myForm_giro.setItemValue('_giro', sel_giro.co_giro);
    myForm_giro.setItemValue('giro_detalle', sel_giro.giro_deta);
    myForm_giro.setItemValue('giro_f_reg', sel_giro.giro_fereg);
    myForm_giro.setItemValue('giro_stado', sel_giro.giro_stado);
    myForm_giro.setItemValue('giro_f_retiro', sel_giro.giro_fretiro);
    switch (op) {
        case 'cancel':
            myForm_giro.disableItem('_giro'), myForm_giro.disableItem('giro_stado'), myForm_giro.setItemValue('titleform', 'Seleccione Giro Negocio ');
            break;
        case 'select':
            myForm_giro.disableItem('_giro'), myForm_giro.disableItem('giro_stado'), myForm_giro.setReadonly('giro_detalle', true), myForm_giro.enableItem('b_edit'), myForm_giro.setItemValue('titleform', 'Visualizando ' + sel_giro.de_giro);
            break;
        case 'edit':
            myForm_giro.setItemValue('titleform', 'Editando ' + sel_giro.de_giro);
            break;
        case 'nuevo':
            myForm_giro.enableItem('_giro'), myForm_giro.enableItem('giro_stado'), myForm_giro.setReadonly('giro_detalle', false), myForm_giro.setItemValue('titleform', 'Nuevo Giro Negocio');
            break;
        default:
            myForm_giro.disableItem('b_save'), myForm_giro.disableItem('b_cancel'), myForm_giro.enableItem('b_add');
            break;
    }
}

f_s_garante = () => {
    myLayou_gara = mySidebar.cells("s_garante").attachLayout('1C');
    let _option = '0';
    if (cocliente > 0) {
        myLayou_gara = mySidebar.cells("s_garante").attachLayout('2U');
        myLayou_gara.cells("a").hideHeader();
        myLayou_gara.cells("b").hideHeader();
        myLayou_gara.cells("a").setWidth(660);
        myLayou_gara.setSeparatorSize(0, 0);
        myForm_gara = myLayou_gara.cells("b").attachForm(f_garante);
        myForm_gara.attachEvent("onValidateError", function (name, value, result) {
            result ? '' : Swal.fire({ type: 'error', title: 'Alerta...', text: 'Debe ingresar solo numeros en los campos en rojo' });
        });
        myForm_gara.attachEvent("onButtonClick", function (name) {
            switch (name) {
                case 'b_add': sel_garaid = undefined, _option = 'nuevo', sel_gara = {}, myGridgara.clearSelection(), f_cleam_fgara(sel_gara, 'nuevo'), myForm_gara.disableItem('b_add'), myForm_gara.disableItem('b_edit'), myForm_gara.enableItem('b_save'), myForm_gara.enableItem('b_cancel');
                    break;
                case 'b_edit':
                    _option = 'edit', f_cleam_fgara(sel_gara, 'edit'), myForm_gara.disableItem('b_edit'), myForm_gara.disableItem('b_add');
                    break;
                case 'b_save':
                    if (myForm_gara.validate() === Boolean(true)) {
                        let p = {
                            xoption: _option, x_cogarante: myForm_gara.getItemValue('gar_idunico'), x_co_catalogo: cocliente, x_apellidos: myForm_gara.getItemValue('gar_apellido'), x_nombres: myForm_gara.getItemValue('gar_nombres'), x_direccion: myForm_gara.getItemValue('gar_direcc'), x_nudocumento: myForm_gara.getItemValue('gar_nudocumen'), x_telefono: myForm_gara.getItemValue('gara_telf'), x_aval_perma: myForm_gara.isItemChecked('ch_gar_perma') ? 'S' : 'N', x_vigencia: myForm_gara.getItemValue('gara_stado'), x_tipodoc: myForm_gara.getItemValue('gar_tipodoc'), x_capacidad: myForm_gara.getItemValue('gara_capacidad'), x_co_modogara: myForm_gara.getItemValue('gara_modoga')
                        };
                        $.post(BASE_URL + "MA010102/grabagarantes", p, function (res) {
                            if (parseFloat(res.cogarante) > 0) {
                                let newId = (new Date()).valueOf();
                                let st_avalper = myForm_gara.isItemChecked('ch_gar_perma') ? 'S' : 'N';
                                if (_option === 'nuevo') {
                                    myGridgara.addRow(newId, res.cogarante + ',' + cocliente + ',' + myForm_gara.getItemValue('gar_apellido') + ',' + myForm_gara.getItemValue('gar_nombres') + ',' + myForm_gara.getItemValue('gar_direcc') + ',' + myForm_gara.getItemValue('gar_nudocumen') + ',' + myForm_gara.getItemValue('gara_telf') + ',' + st_avalper + ',' + res.fe_reg + ',' + myForm_gara.getItemValue('gara_stado') + ',' + myForm_gara.getItemValue('gar_tipodoc') + ',' + myForm_gara.getItemValue('gara_capacidad') + ',' + myForm_gara.getItemValue('gara_modoga'));
                                } else {
                                    myGridgara.cells(sel_garaid, 2).setValue(myForm_gara.getItemValue('gar_apellido')), myGridgara.cells(sel_garaid, 3).setValue(myForm_gara.getItemValue('gar_nombres')), myGridgara.cells(sel_garaid, 4).setValue(myForm_gara.getItemValue('gar_direcc')), myGridgara.cells(sel_garaid, 5).setValue(myForm_gara.getItemValue('gar_nudocumen')), myGridgara.cells(sel_garaid, 6).setValue(myForm_gara.getItemValue('gara_telf')), myGridgara.cells(sel_garaid, 7).setValue(myForm_gara.isItemChecked('ch_gar_perma') ? 'S' : 'N'), myGridgara.cells(sel_garaid, 8).setValue(res.fe_reg), myGridgara.cells(sel_garaid, 9).setValue(myForm_gara.getItemValue('gara_stado')), myGridgara.cells(sel_garaid, 10).setValue(myForm_gara.getItemValue('gar_tipodoc')), myGridgara.cells(sel_garaid, 11).setValue(myForm_gara.getItemValue('gara_capacidad')), myGridgara.cells(sel_garaid, 12).setValue(myForm_gara.getItemValue('gara_modoga')), myGridgara.setRowTextStyle(sel_garaid, myForm_gara.getItemValue('gara_stado') === 'Retirado' ? "text-decoration: line-through;" : "text-decoration: none;"), myGridgara.clearSelection(), sel_garaid = undefined, sel_gara = {};
                                }
                                f_cleam_fgara({}, 'save'), myForm_gara.setItemValue('titleform', 'Seleccione Garante'), f_cleam_fcontac({}, 'save');
                                Swal.fire('Bien!', res.message, 'success');
                            } else {
                                Swal.fire({ type: 'error', title: 'Algo salió mal...', text: res.message });
                            }
                        }, "json");
                    }
                    break;
                case 'b_cancel': sel_garaid = undefined, _option = '0', myForm_gara.enableItem('b_add'), sel_gara = {}, myGridgara.clearSelection(), f_cleam_fgara(sel_gara, 'cancel'), myForm_gara.setReadonly('giro_detalle', true), myForm_gara.disableItem('b_edit'), myForm_gara.disableItem('b_save');
                    break;
            }
        });
        myGridgara = myLayou_gara.cells("a").attachGrid();
        myGridgara.setHeader("CoGarante,Cliente,Apellidos,Nombres,Direccion,Documento,Telefono,Aval Perman?,F.Reg,Estado,Tipo Docu,Capacidad,M.Garantia");
        myGridgara.setColTypes("ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro");
        myGridgara.setInitWidthsP("0,0,20,20,20,15,15,0,0,10,0,0,0");
        myGridgara.setColAlign("left,left,left,left,left,left,left,left,left,left,left,left,left");
        myGridgara.setColumnIds("codgarante,co_catalogo,apellidos,nombres,direcc,nudocu,telefono,staval,f_reg,estado,tipodoc,capacidad,modogaran");
        myGridgara.init();
        ([0, 1, 7, 8, 10, 11, 12]).forEach((elem) => {
            myGridgara.setColumnHidden(elem, true);
        })
        myLayou_gara.cells("a").progressOn();
        myGridgara.load(BASE_URL + 'MA010102/garante/' + cocliente);
        myLayou_gara.cells("a").progressOff();
        myGridgara.attachEvent("onRowSelect", function (rId, ind) {
            sel_gara = myGridgara.getRowData(rId); sel_garaid = rId;
            f_cleam_fgara(sel_gara, 'select');
        });
        _txtgrid(myGridgara, 9);
    } else {
        no_select_client(myLayou_gara, 's_garante');
    }
};

f_act_form_gara = (stado) => {
    switch (stado) {
        case 'disabled':
            (['gar_apellido', 'gar_nombres', 'gar_direcc', 'gara_capacidad', 'gar_nudocumen', 'gara_telf', 'ch_gar_perma']).forEach((elem) => {
                myForm_gara.setReadonly(elem, true);
            }), (['b_save', 'b_cancel', 'gara_modoga', 'gara_stado', 'gar_tipodoc']).forEach((elem) => {
                myForm_gara.disableItem(elem);
            });
            break;
        default:
            (['gar_apellido', 'gar_nombres', 'gar_direcc', 'gara_capacidad', 'gar_nudocumen', 'gara_telf', 'ch_gar_perma']).forEach((elem) => {
                myForm_gara.setReadonly(elem, false);
            }),
                (['b_save', 'b_cancel', 'gara_modoga', 'gara_stado', 'gar_tipodoc']).forEach((elem) => {
                    myForm_gara.enableItem(elem);
                });
            break;
    }

}

f_cleam_fgara = (sel_, op) => {
    myForm_gara.setItemValue('gar_nudocumen', sel_.nudocu), myForm_gara.setItemValue('gar_f_reg', sel_.f_reg), myForm_gara.setItemValue('gar_idunico', sel_.codgarante), myForm_gara.setItemValue('gar_apellido', sel_.apellidos), myForm_gara.setItemValue('gar_nombres', sel_.nombres), myForm_gara.setItemValue('gar_direcc', sel_.direcc), myForm_gara.setItemValue('gar_tipodoc', sel_.tipodoc),
        myForm_gara.setItemValue('gara_modoga', sel_.modogaran), myForm_gara.setItemValue('gara_capacidad', sel_.capacidad), myForm_gara.setItemValue('gara_stado', sel_.estado), myForm_gara.setItemValue('gara_telf', sel_.telefono);
    sel_.staval === 'S' ? myForm_gara.checkItem('ch_gar_perma') : myForm_gara.uncheckItem('ch_gar_perma');
    switch (op) {
        case 'cancel':
            myForm_gara.disableItem('gar_tipodoc'), myForm_gara.disableItem('gara_stado'), myForm_gara.setItemValue('titleform', 'Seleccione Giro Negocio ');
            break;
        case 'select':
            f_act_form_gara('disabled'), myForm_gara.disableItem('gar_tipodoc'), myForm_gara.disableItem('gara_stado'), myForm_gara.setReadonly('giro_detalle', true), myForm_gara.enableItem('b_edit'), myForm_gara.setItemValue('titleform', 'Visualizando ' + sel_.apellidos);
            break;
        case 'edit':
            f_act_form_gara(), myForm_gara.setItemValue('titleform', 'Editando ' + sel_.apellidos);
            break;
        case 'nuevo':
            myForm_gara.setItemValue('gar_idunico', '0'), f_act_form_gara(), myForm_gara.enableItem('gar_tipodoc'), myForm_gara.enableItem('gara_stado'), myForm_gara.setReadonly('giro_detalle', false), myForm_gara.setItemValue('titleform', 'Nuevo Giro Negocio');
            break;
        default:
            myForm_gara.disableItem('b_save'), myForm_gara.disableItem('b_cancel'), myForm_gara.enableItem('b_add');
            break;
    }
}


f_s_contactos = () => {
    myLayou_contac = mySidebar.cells("s_contacto").attachLayout('1C');
    if (cocliente > 0) {
        myLayou_contac = mySidebar.cells("s_contacto").attachLayout('2U');
        myLayou_contac.cells("a").hideHeader();
        myLayou_contac.cells("b").hideHeader();
        myLayou_contac.cells("a").setWidth(660);
        myLayou_contac.setSeparatorSize(0, 0);
        myForm_contac = myLayou_contac.cells("b").attachForm(f_contacto);
        myForm_contac.attachEvent("onValidateError", function (name, value, result) {
            result ? '' : Swal.fire({ type: 'error', title: 'Alerta...', text: 'Debe ingresar solo numeros en los campos en rojo' });
        });
        myForm_contac.attachEvent("onButtonClick", function (name) {
            switch (name) {
                case 'b_add': sel_contid = undefined, _option = 'nuevo', sel_cont = {}, myGridcontac.clearSelection(), f_cleam_fcontac(sel_cont, 'nuevo'), myForm_contac.disableItem('b_add'), myForm_contac.disableItem('b_edit'), myForm_contac.enableItem('b_save'), myForm_contac.enableItem('b_cancel');
                    break;
                case 'b_edit':
                    _option = 'edit', f_cleam_fcontac(sel_cont, 'edit'), myForm_contac.disableItem('b_edit'), myForm_contac.disableItem('b_add');
                    break;
                case 'b_save':
                    if (myForm_contac.validate() === Boolean(true)) {
                        let p = {
                            xoption: _option,
                            x_co_catalogo: cocliente,
                            x_cargo_repre: myForm_contac.getItemValue('cont_carg_repre'),
                            x_co_repre: myForm_contac.getItemValue('cont_co_repres'),
                            x_apellidos: myForm_contac.getItemValue('cont_apellido'),
                            x_nombres: myForm_contac.getItemValue('cont_nombres'),
                            x_mail: myForm_contac.getItemValue('cont_email'),
                            x_telefono: myForm_contac.getItemValue('cont_telf'),
                            x_estado: myForm_contac.getItemValue('cont_stado')

                        };
                        $.post(BASE_URL + "MA010102/grabacontacto", p, function (res) {
                            if (parseFloat(res.codigo) > 0) {
                                let newId = (new Date()).valueOf();
                                if (_option === 'nuevo') {
                                    myGridcontac.addRow(newId, myForm_contac.getItemValue('cont_co_repres') + ',' + myForm_contac.getItemValue('cont_apellido') + ',' + myForm_contac.getItemValue('cont_nombres') + ',' + myForm_contac.getItemValue('cont_email') + ',' + myForm_contac.getItemValue('cont_carg_repre') + ',' + cocliente + ',' + res.fe_reg + ',' + ',,' + myForm_contac.getItemValue('cont_telf'));
                                } else {
                                    myGridcontac.cells(sel_contid, 1).setValue(myForm_contac.getItemValue('cont_apellido')),
                                        myGridcontac.cells(sel_contid, 2).setValue(myForm_contac.getItemValue('cont_nombres')),
                                        myGridcontac.cells(sel_contid, 3).setValue(myForm_contac.getItemValue('cont_email')),
                                        myGridcontac.cells(sel_contid, 4).setValue(myForm_contac.getItemValue('cont_carg_repre')),
                                        myGridcontac.cells(sel_contid, 7).setValue(myForm_contac.getItemValue('cont_stado')),
                                        myGridcontac.cells(sel_contid, 9).setValue(myForm_contac.getItemValue('cont_telf')),
                                        myGridcontac.setRowTextStyle(sel_contid, myForm_contac.getItemValue('cont_stado') === 'Retirado' ? "text-decoration: line-through;" : "text-decoration: none;"),
                                        myGridcontac.clearSelection(), sel_contid = undefined, sel_cont = {};
                                }
                                myForm_contac.setItemValue('titleform', 'Seleccione Contacto'), f_cleam_fcontac({}, 'save');
                                Swal.fire('Bien!', res.message, 'success');
                            } else {
                                Swal.fire({ type: 'error', title: 'Algo salió mal...', text: res.message });
                            }
                        }, "json");
                    }
                    break;
                case 'b_cancel': sel_contid = undefined, _option = '0', myForm_contac.enableItem('b_add'), sel_cont = {}, myGridcontac.clearSelection(),
                    f_cleam_fcontac(sel_cont, 'cancel'), myForm_contac.disableItem('b_edit'), myForm_contac.disableItem('b_save');
                    break;
            }
        });

        myGridcontac = myLayou_contac.cells("a").attachGrid();
        myGridcontac.setHeader("CodRepresen,Apellidos,Nombres,Email,Cargo.Repre,Cliente,Fe.Reg,Estado,Fe.Retiro,Telefono");
        myGridcontac.setColTypes("ro,ro,ro,ro,ro,ro,ro,ro,ro,ro");
        myGridcontac.setInitWidthsP("0,20,20,20,0,0,10,10,10,10");
        myGridcontac.setColumnIds("co_repres,de_apell,de_nombre,de_mail,cargo_repre,co_catalogo,fe_reg,estado,fe_retiro,nu_telef");
        myGridcontac.init();
        ([0, 4, 5,]).forEach((elem) => {
            myGridcontac.setColumnHidden(elem, true);
        })
        myLayou_contac.cells("a").progressOn();
        myGridcontac.load(BASE_URL + 'MA010102/contactos/' + cocliente);
        myLayou_contac.cells("a").progressOff();
        myGridcontac.attachEvent("onRowSelect", function (rId, ind) {
            sel_cont = myGridcontac.getRowData(rId); sel_contid = rId;
            f_cleam_fcontac(sel_cont, 'select');
        });
        _txtgrid(myGridcontac, 7);
    } else {
        no_select_client(myLayou_contac, 's_contacto');
    }
};


f_cleam_fcontac = (sel_, op) => {
    myForm_contac.setItemValue('cont_carg_repre', sel_.cargo_repre),
        myForm_contac.setItemValue('cont_co_repres', sel_.co_repres),
        myForm_contac.setItemValue('cont_apellido', sel_.de_apell),
        myForm_contac.setItemValue('cont_nombres', sel_.de_nombre),
        myForm_contac.setItemValue('cont_email', sel_.de_mail),
        myForm_contac.setItemValue('cont_telf', sel_.nu_telef),
        myForm_contac.setItemValue('cont_f_reg', sel_.fe_reg),
        myForm_contac.setItemValue('cont_stado', sel_.estado),
        myForm_contac.setItemValue('cont_f_retiro', sel_.fe_retiro);
    switch (op) {
        case 'cancel':
            myForm_contac.disableItem('cont_stado'), myForm_contac.disableItem('cont_carg_repre'), myForm_contac.setItemValue('titleform', 'Seleccione Contacto ');
            break;
        case 'select':
            f_act_form_cont('disabled'), myForm_contac.disableItem('cont_carg_repre'), myForm_contac.disableItem('cont_co_repres'), myForm_contac.disableItem('cont_stado'), myForm_contac.enableItem('b_add'), myForm_contac.enableItem('b_edit'), myForm_contac.setItemValue('titleform', 'Visualizando ' + sel_.de_apell);
            break;
        case 'edit':
            f_act_form_cont(), myForm_contac.setItemValue('titleform', 'Editando ' + sel_.de_apell), myForm_contac.disableItem('cont_carg_repre'), myForm_contac.disableItem('cont_co_repres');
            break;
        case 'nuevo':
            f_act_form_cont(), myForm_contac.enableItem('cont_carg_repre'), myForm_contac.enableItem('cont_co_repres'), myForm_contac.enableItem('cont_stado'), myForm_contac.setItemValue('titleform', 'Nuevo Contacto');
            break;
        default:
            myForm_contac.disableItem('b_save'), myForm_contac.disableItem('b_cancel'), myForm_contac.enableItem('b_add');
            break;
    }
}


f_act_form_cont = (stado) => {
    switch (stado) {
        case 'disabled':
            (['cont_co_repres', 'cont_apellido', 'cont_nombres', 'cont_email', 'cont_telf', 'cont_f_reg', 'cont_f_retiro']).forEach((elem) => {
                myForm_contac.setReadonly(elem, true);
            }), (['b_save', 'b_cancel', 'cont_stado', 'cont_carg_repre']).forEach((elem) => {
                myForm_contac.disableItem(elem);
            });
            break;
        default:
            (['cont_co_repres', 'cont_apellido', 'cont_nombres', 'cont_email', 'cont_telf', 'cont_f_reg', 'cont_f_retiro']).forEach((elem) => {
                myForm_contac.setReadonly(elem, false);
            }),
                (['b_save', 'b_cancel', 'cont_stado', 'cont_carg_repre']).forEach((elem) => {
                    myForm_contac.enableItem(elem);
                });
            break;
    }

}


f_s_ctaban = () => {
    myLayou_cbanc = mySidebar.cells("s_cuentas").attachLayout('1C');
    if (cocliente > 0) {
        myLayou_cbanc = mySidebar.cells("s_cuentas").attachLayout('2U');
        myLayou_cbanc.cells("a").hideHeader();
        myLayou_cbanc.cells("b").hideHeader();
        myLayou_cbanc.cells("a").setWidth(660);
        myLayou_cbanc.setSeparatorSize(0, 0);
        myForm_cbanc = myLayou_cbanc.cells("b").attachForm(f_cuentas);
        myForm_cbanc.attachEvent("onValidateError", function (name, value, result) {
            result ? '' : Swal.fire({ type: 'error', title: 'Alerta...', text: 'Debe ingresar solo numeros en los campos en rojo' });
        });
        myForm_cbanc.attachEvent("onButtonClick", function (name) {
            switch (name) {
                case '_b_banco':
                    var output = await IniciarGridBusqueda(4, false, mainLayout);
                    if (output !== null) {
                        ubigeo = output.seleccion[0].ubigeo;
                        formu.setItemValue('__nubigeo', output.seleccion[0].descripcion);
                    }
                    break;
                case 'b_add': sel_cbancid = undefined, _option = 'nuevo', sel_cbanc = {}, myGridcbanc.clearSelection(), f_cleam_cbanc(sel_cbanc, 'nuevo'), myForm_cbanc.disableItem('b_add'), myForm_cbanc.disableItem('b_edit'), myForm_cbanc.enableItem('b_save'), myForm_cbanc.enableItem('b_cancel');
                    break;
                case 'b_edit':
                    _option = 'edit', f_cleam_cbanc(sel_cbanc, 'edit'), myForm_cbanc.disableItem('b_edit'), myForm_cbanc.disableItem('b_add');
                    break;
                case 'b_save':
                    if (myForm_cbanc.validate() === Boolean(true)) {
                        let p = {
                            xoption: _option
                        };
                        $.post(BASE_URL + "MA010102/grabacuentas", p, function (res) {
                            if (parseFloat(res.codigo) > 0) {
                                let newId = (new Date()).valueOf();
                                if (_option === 'nuevo') {
                                    myGridcbanc.addRow(newId, myForm_cbanc.getItemValue('cont_co_repres') + ',' + myForm_cbanc.getItemValue('cont_apellido') + ',' + myForm_cbanc.getItemValue('cont_nombres') + ',' + myForm_cbanc.getItemValue('cont_email') + ',' + myForm_cbanc.getItemValue('cont_carg_repre') + ',' + cocliente + ',' + res.fe_reg + ',' + ',,' + myForm_cbanc.getItemValue('cont_telf'));
                                } else {
                                    myGridcbanc.cells(sel_contid, 1).setValue(myForm_cbanc.getItemValue('cont_apellido')), myGridcbanc.cells(sel_cbancid, 2).setValue(myForm_cbanc.getItemValue('cont_nombres')), myGridcbanc.cells(sel_contid, 3).setValue(myForm_cbanc.getItemValue('cont_email')), myGridcbanc.cells(sel_cbancid, 4).setValue(myForm_cbanc.getItemValue('cont_carg_repre')), myGridcbanc.cells(sel_cbancid, 7).setValue(myForm_cbanc.getItemValue('cont_stado')), myGridcbanc.cells(sel_cbancid, 9).setValue(myForm_cbanc.getItemValue('cont_telf')), myGridcbanc.setRowTextStyle(sel_cbancid, myForm_cbanc.getItemValue('cont_stado') === 'Retirado' ? "text-decoration: line-through;" : "text-decoration: none;"),
                                        myGridcontac.clearSelection(), sel_contid = undefined, sel_cbanc = {};
                                }
                                myForm_cbanc.setItemValue('titleform', 'Seleccione Contacto'), f_cleam_cbanc({}, 'save');
                                Swal.fire('Bien!', res.message, 'success');
                            } else {
                                Swal.fire({ type: 'error', title: 'Algo salió mal...', text: res.message });
                            }
                        }, "json");
                    }
                    break;
                case 'b_cancel': sel_cbancid = undefined, _option = '0', myForm_cbanc.enableItem('b_add'), sel_cbanc = {}, myGridcbanc.clearSelection(),
                    f_cleam_cbanc(sel_cbanc, 'cancel'), myForm_cbanc.disableItem('b_edit'), myForm_contac.disableItem('b_save');
                    break;
            }
        });
        myGridcbanc = myLayou_cbanc.cells("a").attachGrid();
        myGridcbanc.setHeader("coCliente,Tipo_cta,Numero,Estado,Banco,Pais,Fe.Reg,Nom.Bnaco,Nom.Pais,Nom.Tipo");
        myGridcbanc.setColTypes("ro,ro,ro,ro,ro,ro,ro,ro,ro,ro");
        myGridcbanc.setInitWidthsP("10,20,20,20,10,10,10,10,10,10");
        myGridcbanc.setColumnIds("co_catalo,co_tipo,numero,estado,cobanco,copais,fereg,n_banco,n_pais,n_tipo");
        myGridcbanc.init();
        /*  ([0, 4, 5]).forEach((elem) => {
                myGridcbanc.setColumnHidden(elem, true);
            })*/
        myLayou_cbanc.cells("a").progressOn();
        myGridcbanc.load(BASE_URL + 'MA010102/cuentas/' + cocliente);
        myLayou_cbanc.cells("a").progressOff();
        myGridcbanc.attachEvent("onRowSelect", function (rId, ind) {
            sel_cbanc = myGridcbanc.getRowData(rId); sel_cbancid = rId;
            f_cleam_cbanc(sel_cbanc, 'select');
        });
        _txtgrid(myGridcbanc, 3);
    } else {
        no_select_client(myLayou_cbanc, 's_cuentas');
    }
};


f_cleam_cbanc = (sel_, op) => {
    myForm_cbanc.setItemValue('cont_carg_repre', sel_.cargo_repre),
        myForm_cbanc.setItemValue('cont_co_repres', sel_.co_repres),
        myForm_cbanc.setItemValue('cont_apellido', sel_.de_apell),
        myForm_cbanc.setItemValue('cont_nombres', sel_.de_nombre),
        myForm_cbanc.setItemValue('cont_email', sel_.de_mail),
        myForm_cbanc.setItemValue('cont_telf', sel_.nu_telef),
        myForm_cbanc.setItemValue('cont_f_reg', sel_.fe_reg);

    switch (op) {
        case 'cancel':
            myForm_cbanc.disableItem('cont_stado'), myForm_cbanc.disableItem('cont_carg_repre'), myForm_cbanc.setItemValue('titleform', 'Seleccione Contacto ');
            break;
        case 'select':
            f_act_form_cbanc('disabled'), myForm_cbanc.disableItem('cont_carg_repre'), myForm_cbanc.disableItem('cont_co_repres'), myForm_cbanc.disableItem('cont_stado'), myForm_cbanc.enableItem('b_add'), myForm_cbanc.enableItem('b_edit'), myForm_cbanc.setItemValue('titleform', 'Visualizando ' + sel_.de_apell);
            break;
        case 'edit':
            f_act_form_cbanc(), myForm_cbanc.setItemValue('titleform', 'Editando ' + sel_.de_apell), myForm_cbanc.disableItem('cont_carg_repre'), myForm_cbanc.disableItem('cont_co_repres');
            break;
        case 'nuevo':
            f_act_form_cbanc(), myForm_cbanc.enableItem('cont_carg_repre'), myForm_cbanc.enableItem('cont_co_repres'), myForm_cbanc.enableItem('cont_stado'), myForm_cbanc.setItemValue('titleform', 'Nuevo Contacto');
            break;
        default:
            myForm_cbanc.disableItem('b_save'), myForm_contac.disableItem('b_cancel'), myForm_contac.enableItem('b_add');
            break;
    }
}


f_act_form_cbanc = (stado) => {
    switch (stado) {
        case 'disabled':
            (['cont_co_repres', 'cont_apellido', 'cont_nombres', 'cont_email', 'cont_telf', 'cont_f_reg', 'cont_f_retiro']).forEach((elem) => {
                myForm_cbanc.setReadonly(elem, true);
            }), (['b_save', 'b_cancel', 'cont_stado', 'cont_carg_repre']).forEach((elem) => {
                myForm_cbanc.disableItem(elem);
            });
            break;
        default:
            (['cont_co_repres', 'cont_apellido', 'cont_nombres', 'cont_email', 'cont_telf', 'cont_f_reg', 'cont_f_retiro']).forEach((elem) => {
                myForm_cbanc.setReadonly(elem, false);
            }),
                (['b_save', 'b_cancel', 'cont_stado', 'cont_carg_repre']).forEach((elem) => {
                    myForm_cbanc.enableItem(elem);
                });
            break;
    }

}





no_select_client = (Layout, sidetab) => {
    Layout = mySidebar.cells(sidetab).attachLayout('1C');
    Layout.cells("a").attachHTMLString('<div class="nomcliente" style="text-align: center;         padding-bottom: 3%;"> SELECCIONE UN CLIENTE, POR FAVOR...</div><div  id="imgcargue"    style="position: absolute;     top: 20; right: 10; bottom: 10; left: 10;              background: url(/assets/images/otros/icono-buscar-datos-nuevo.jpg)        no-repeat     center;         -webkit-background-size: cover;        -moz-background-size: cover;        -o-background-size: cover;         background-size: auto;"></div>');
    Layout.cells("a").hideHeader();
}









//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

BeforeSelectDataview = (id) => {
    myToolBar.enableItem('__edit');
    var data = myDataView.get(id);
    if (data.CO_DIRECCION_EMPRESA > 0) {
        if ((data.ES_VIGENCIA).toUpperCase() === estadook) {
            myToolBar.enableItem('__anula');
            myToolBar.disableItem('__activar');
        } else {
            myToolBar.disableItem('__anula');
            myToolBar.enableItem('__activar');
        }
        (data.ST_PRINCIPAL).toUpperCase() === 'S' ? myToolBar.disableItem('__principal') : myToolBar.enableItem('__principal');
    } else {
        (['__anula', '__activar', '__edit', '__principal']).forEach((elem) => {
            myToolBar.disableItem(elem);
        });
    }
};


/*************** NUEVA DIRECCION **********/
f_post_new = () => {
    var Win_ = new dhtmlXWindows();
    var Winid_ = Win_.createWindow("w1", 0, 0, 520, 380);
    Win_.window("w1").hideHeader();
    Win_.window("w1").setModal(true);
    Win_.window("w1").denyResize();
    Win_.window("w1").center();
    form = Winid_.attachForm(st_form_edit);
    form.setSkin("material");
    form.hideItem('__cod');
    form.setItemValue('__cod', '0');
    nrpincipal = 'N';
    form.attachEvent("onButtonClick", (name) => {
        onbuttonclic('nuevo', name, Winid_, form, Win_.window("w1"));
    });
};
/*************** Cambia estado a los items ***********************************/
f_post_estado = (id, new_esta, dataview, tollbar) => {
    mainLayout.cells("b").progressOn();
    var p = { emp: usrJson.empresa, codigo: dataview.get(id).CO_DIRECCION_EMPRESA, vigencia: new_esta };
    $.post(BASE_URL + "MA010104/c_estado", p, function (res) {

        if (res.state !== 'error') {
            if (new_esta.toUpperCase() === 'PRINCIPAL') {
                myDataView.clearAll();
                myDataView.load(BASE_URL + 'MA010104/cargardata/' + usrJson.empresa, "json");
                myToolBar.disableItem('__principal');
            } else {
                dataview.set(id, {
                    $selected: true, id: id, CO_DIRECCION_EMPRESA: dataview.get(id).CO_DIRECCION_EMPRESA, DE_DIRECCION: dataview.get(id).DE_DIRECCION, NUBIGEO: dataview.get(id).NUBIGEO, DE_DIRECCION_CORTA: dataview.get(id).DE_DIRECCION_CORTA,
                    NPRINCIPAL: dataview.get(id).ST_PRINCIPAL === 'S' ? 'PRINCIPAL' : ' ', CO_UBIGEO: dataview.get(id).CO_UBIGEO, ST_PROPIO: dataview.get(id).ST_PROPIO, ES_VIGENCIA: new_esta, ST_PRINCIPAL: dataview.get(id).ST_PRINCIPAL
                });
                onSelectAntes(id, dataview, tollbar, estadook);
            }
            Swal.fire('Bien!', res.message, 'success');
        } else
            Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se pudoActualizar sus cambios  :' + res.message });
    }, "json");
    mainLayout.cells("b").progressOff();
};

createFormulario = () => {
    var W_b_orden = new dhtmlXWindows();
    var W_b_ordenid = W_b_orden.createWindow("w__", 250, 80, 520, 380);
    W_b_orden.window("w__").hideHeader();
    W_b_orden.window("w__").setModal(true);
    W_b_orden.window("w__").denyResize();
    //W_b_orden.window("w__").center();
    form = W_b_ordenid.attachForm(st_form_edit);
    form.setSkin("material");
    form.setItemValue('__cod', myDataView.get(myDataView.getSelected()).CO_DIRECCION_EMPRESA);
    form.setItemValue('__direcc', myDataView.get(myDataView.getSelected()).DE_DIRECCION);
    form.setItemValue('__nubigeo', myDataView.get(myDataView.getSelected()).NUBIGEO);
    form.setItemValue('__corta', myDataView.get(myDataView.getSelected()).DE_DIRECCION_CORTA);
    st_prin = myDataView.get(myDataView.getSelected()).ST_PRINCIPAL;
    nrpincipal = st_prin === 'S' ? 'PRINCIPAL' : ' ';
    myDataView.get(myDataView.getSelected()).ST_PROPIO === 'S' ? form.checkItem('__propio') : form.uncheckItem('__propio');
    ubigeo = myDataView.get(myDataView.getSelected()).CO_UBIGEO;
    form.attachEvent("onButtonClick", (name) => {
        onbuttonclic('update', name, W_b_ordenid, form, W_b_orden.window("w__"));
    });
};

onbuttonclic = async (accion, nam, wind, formu, winid) => {
    switch (nam) {
        case 'b_save':
            st_pro = form.isItemChecked('__propio') ? 'S' : 'N';
            winid.progressOn();
            f_post_updates(accion, formu.getItemValue('__cod'), formu.getItemValue('__direcc'), formu.getItemValue('__corta'), st_pro, ubigeo, formu.getItemValue('__nubigeo'), nrpincipal);
            winid.progressOff();
            wind.close();
            break;
        case '__buscar':            //var W_b_respo = new dhtmlXWindows();
            var output = await IniciarGridBusqueda(4, false, mainLayout);
            if (output !== null) {
                ubigeo = output.seleccion[0].ubigeo;
                formu.setItemValue('__nubigeo', output.seleccion[0].descripcion);
            }
            break;
        default:
            wind.close();
            break;
    }
};

f_post_updates = (acci, cod, dir, cor, tpro, ubi, nubi, nprin) => {
    var p = { accion: acci, emp: usrJson.empresa, codigo: cod, direc: dir, dcorta: cor, stpropio: tpro, ubigeo: ubi };
    $.post(BASE_URL + "MA010104/update", p, function (res) {
        if (acci === 'nuevo') {
            if (res.state === 'success') {
                myDataView.clearAll();
                myDataView.load(BASE_URL + 'MA010104/cargardata/' + usrJson.empresa, "json");
            }
        } else {
            if (res.state === 'success') {
                myDataView.set(myDataView.getSelected(), {
                    $selected: true, id: myDataView.getSelected(), CO_DIRECCION_EMPRESA: cod, DE_DIRECCION: dir, NUBIGEO: nubi, DE_DIRECCION_CORTA: cor,
                    NPRINCIPAL: nprin, CO_UBIGEO: ubi, ST_PROPIO: tpro, ES_VIGENCIA: myDataView.get(myDataView.getSelected()).ES_VIGENCIA, ST_PRINCIPAL: st_prin
                });
                onSelectAntes(myDataView.getSelected(), myDataView, myToolBar, estadook);
                Swal.fire('Bien!', res.message, 'success');
            }
        }
        if (res.state !== 'success')
            Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'Error :' + res.message });
    }, "json");
};

onSelectAntes = (id, dataview, tollbar, estadook) => {
    if (dataview.get(id).CO_DIRECCION_EMPRESA >= 0) {
        tollbar.enableItem('__edit');
        if ((dataview.get(id).ES_VIGENCIA).toUpperCase() === estadook.toUpperCase()) {
            tollbar.enableItem('__anula');
            tollbar.disableItem('__activar');
        } else {
            tollbar.disableItem('__anula');
            tollbar.enableItem('__activar');
        }
        (dataview.get(id).ST_PRINCIPAL).toUpperCase() === 'S' ? tollbar.disableItem('__principal') : tollbar.enableItem('__principal');
    } else {
        (['__anula', '__activar', '__edit', '__principal']).forEach((elem) => {
            tollbar.disableItem(elem);
        });
    }
};


function photo_usu(name, value) {
    switch (name) {
        case "up_imgperfil":
            return '<div class="photoup"><img id="emp_img_" /><form id="eventFormemp" action="" enctype="multipart/form-data" method="post"><input type="file" id="fileemp" name="upload" onchange="readURL(this);" ><p id="formp" class="classfont">Clic en la imagen o arrastre una nueva imagen</p><input id="fboton" type="submit" value="Cambiar Perfil"></form></div>';
            break;
        default:
            null;
            break;
    }
}
/******************** Funcion  readURL() se activa cuando onchange="readURL(this);" del form>input - file => verifica que la imagen subida sea type=imagen, ademas actualiza la imagen del fomulario    */
function readURL(input) { //funcion carga imagen al seleccionar
    var selector = input.id;
    var ext_file = $('#' + selector).val().split('.').pop().toLowerCase();
    if ($.inArray(ext_file, ['gif', 'png', 'jpg', 'jpeg']) == -1)
        Swal.fire({ type: 'error', title: 'Archivo Incorrecto...', text: 'Esto no es una imagen', footer: '<a href="#">*** Tipos permitidos [gif, png, jpg, jpeg]</a>' });
    else
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                //  var id_img = selector === 'fphoto' ? 'photocharge' : 'fondocharge';
                $('#emp_img_').attr('src', e.target.result);
            };
            reader.readAsDataURL(input.files[0]);
        }
}
doOnload = () => {
    var p = { emp: JSON.parse(localStorage.getItem('usrjson')).empresa };
    $.post(BASE_URL + "MA010104/datos_empresa", p, function (res) {
        //        console.log(res[0]);
        if (res.length > 0) {
            myForm.setItemValue('f_ruc', res[0].RUC);
            myForm.setItemValue('f_nombre', res[0].DE_NOMBRE);
            myForm.setItemValue('f_razsocial', res[0].DE_RAZ_SOCIAL);
            myForm.setItemValue('f_moneda', res[0].MONEDA);
            myForm.setItemValue('f_registro', res[0].FE_REGIS);
            myForm.setItemValue('f_estado', res[0].ES_VIGENCIA);
        }
    }, "json");

    $.post(BASE_URL + "MA010104/file_exist", p, function (res) {
        if (res.state !== 'error') {
            $("#emp_img_").attr("src", res.srclogo);
        } else
            Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se pudo cargar su imagen de Perfil Error :' + res.error, footer: '<a href="#">suba una nueva imagen, si el problema continua, comuníquese con el area de Sistemas</a>' });
    }, "json");
    var json = [{ 'id_form': '#eventFormemp', datos: { 'input_file': '#fileemp', 'div_content': 'file_name', 'ruta': 'ma010104/' + JSON.parse(localStorage.getItem('usrjson')).empresa + '/' + JSON.parse(localStorage.getItem('usrjson')).empresa + '_logo.png', 'img_id': '#emp_img_' } }];
    (json).forEach((elem) => {
        $(elem.id_form).submit(function (e) {
            e.preventDefault();
            Swal.fire({
                title: 'Subiendo Imagen!', html: '<h4>Un momento porfavor</h4>', timer: 0, allowOutsideClick: false, onBeforeOpen: () => {
                    Swal.showLoading();
                }
            });
            var fd = new FormData(); //objecto FormData para estrucutra los campos enviados en el formulario
            var file = $(elem.datos.input_file).get(0).files[0]; //console.log(file);
            fd.append(elem.datos.div_content, file, elem.datos.ruta);
            $.ajax({
                url: BASE_URL + 'MA010104/upload', data: fd, processData: false, cache: false, contentType: false, type: 'POST',
                success: function (data) { //console.log('data');
                    if (data.state !== 'success')
                        Swal.fire({ type: 'error', title: 'Algo paso...', text: data.error, footer: '<a href="#">El peso maximo es 2MB</a>' });//                    dhtmlx.message({                        title: "Close",                    type: "alert-warning",                    text: "You can't close this window!",                       callback: function () {                          dhtmlx.alert("Test alert");                     }                  });
                    else
                        Swal.fire({ title: 'Conforme!', text: 'Imagen subida.', type: 'success', allowOutsideClick: false, confirmButtonText: 'Ingresar al Sistema' });
                }
            }, 'json');
        });
    });
};

