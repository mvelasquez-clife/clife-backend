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
        (id === 'b_close') ? Wind_.window("wbusq").close() : onbuscacliente(Wind_, myToolbar.getValue('in_busq'));
    });
    myToolbar.attachEvent("onEnter", (id) => {
        onbuscacliente(Wind_, myToolbar.getValue('in_busq'));
    });
    myGrid = Winid_.attachGrid();
    myGrid.setHeader('Codigo,Nombre Comercial,Vigencia,N.Comer,Estado,Nom.Vista');
    myGrid.setInitWidthsP('20,10,10,10,10,60');
    myGrid.setColTypes('ro,ro,ro,ro,ro,ro');
    myGrid.setColumnHidden(3, true);
    myGrid.setColumnHidden(1, true);

    myGrid.setColumnIds("codigo,raz_social,vigencia,nom_comer,asignado,nom_vista");
    myGrid.init();
    myGrid.attachEvent("onRowSelect", function (id, ind) {
        data = myGrid.getRowData(myGrid.getSelectedRowId()), enti_tipo == 1 ? co_entidad = parseInt(data.codigo) : cocliente = parseInt(data.codigo);
        cod = enti_tipo == 1 ? co_entidad : cocliente;
        if (cod > 0) {
            mySidebar.cells("s_datos").progressOn();
            Wind_.window("wbusq").close();
            _async_form(cod, _item_sidebar, data);
            myForm.setItemValue('b_cliente', data.codigo + ' ' + data.raz_social);
            myForm.setItemValue('b_estado', data.vigencia);
            myForm.setItemValue('b_asignado', data.asignado);
        } else {
            Swal.fire({ type: 'warning', text: 'No puede seleccionar este item!!...', showConfirmButton: false, timer: 1500 });
        }
    });
    myGrid.attachEvent("onDataReady", function () {
        var ids = myGrid.getAllRowIds();
        var parte = ids.split(",");
        for (var i = 0; i < parte.length; i++) {
            myGrid.cells(parte[i], 4).getValue() === 'Asignado' ? myGrid.setRowTextStyle(parte[i], "color:green; font-weight:800;") : myGrid.setRowTextStyle(parte[i], "color:#FF9033; font-weight:800;");
        }
    });
};
async function _async_form(cod, item, data) {
    await _selec_sidevar(cod, item);
    beforechange(cod, data);
}

function limpiar_files() {
    $.post(BASE_URL + "MA010102/limpiar_files", {}, function (res) {
        console.log(res);
    }, "json");

}

function _selec_sidevar(cod, item) {
    if (cod > 0) {
        return new Promise(resolve => {
            switch (item) {
                case 's_datos':
                    f_s_datos(cod);
                    break;
                case 's_direccion':
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
                case 's_documento':
                    f_s_doc();
                    break;
                case 's_antecedente':
                    f_s_antecedentes();
                    break;
                case 's_comunicacion':
                    f_s_comunica();
                    break;
                default:
                    null;
                    break;
            }
            resolve('resolved');
        });
    }
}
function beforechange(cod, data) {
    p = { emp: usrJson.empresa, codigo: data.codigo, tipo: enti_tipo };
    $.post(BASE_URL + "MA010102/list_datos_cliente", p, function (res) {
        json_select = res[0]; if (_item_sidebar === 's_datos') cargar_datos_clie(json_select, data.asignado), form_edit_ini(true, 'D');
        mySidebar.cells("s_datos").progressOff();
    }, "json");
}

function cargar_datos_clie(data, stasigna) {
    switch (enti_tipo) {
        case 1:
            if (Object.keys(data).length > 0) {
                if (stasigna == 'Asignado') { myFormdatos.checkItem('st_provedor'), myFormdatos.enableItem('st_provedor') } else { myFormdatos.uncheckItem('st_provedor'), myFormdatos.disableItem('st_provedor') }
                co_entidad = data.ST_PROVEEDOR == 'S' ? data.CO_PROVEE : data.CO_CATALOGO, oculta_item(parseInt(data.CO_TIPO_DOC_IDE)), myFormdatos.checkItem('st_personales'), myFormdatos.setItemValue('_nudocumento', data.NU_DOCUMENTO), myFormdatos.setItemValue('_procedencia', data.DE_PROCEDENCIA), myFormdatos.setItemValue('_nomcomer', data.DE_NOMBRE_COMERCIAL), myFormdatos.setItemValue('_razsocial', data.DE_RAZON_SOCIAL), myFormdatos.setItemValue('_fredcata', data.FE_REGISTRO),
                    myFormdatos.setItemValue('_apepat', data.DE_APE_PATERNO), myFormdatos.setItemValue('_apemat', data.DE_APE_MATERNO), myFormdatos.setItemValue('_nombres', data.DE_NOMBRE),
                    myFormdatos.setItemValue('_vigencia', data.ES_VIGENCIA_CATA), myFormdatos.setItemValue('_origen', data.DE_ORIGEN), myFormdatos.setItemValue('_tipoper', data.CO_TIPO_PERSONA), myFormdatos.setItemValue('_tipodoc', data.CO_TIPO_DOC_IDE), myForm.setItemValue('b_estado', data.ES_VIGENCIA), myFormdatos.setItemValue('_provstado', data.ES_VIGENCIA), myFormdatos.setItemValue('_provfretiro', data.FE_RETIRO), myFormdatos.setItemValue('_provemail', data.DE_EMAIL), myFormdatos.setItemValue('_proformpago', data.CO_FORMA_PAGO), myFormdatos.setItemValue('_procondpago', data.CO_CONDICION_PAGO), myFormdatos.setItemValue('_provfsys', data.FE_SYS),
                    data.ST_FIJO === 'S' ? myFormdatos.checkItem('_provchperm') : myFormdatos.uncheckItem('_provchperm'), myForm.setItemValue('b_registro', data.FE_SYS), data.ST_AFECTO_DETRACCION === 'S' ? myFormdatos.checkItem('_provshdetrec') : myFormdatos.uncheckItem('_provshdetrec'), data.ST_PERCEPCION === 'S' ? myFormdatos.checkItem('_provshpercep') : myFormdatos.uncheckItem('_provshpercep'), data.ST_RETENCION === 'S' ? myFormdatos.checkItem('_provsharetenc') : myFormdatos.uncheckItem('_provsharetenc');
                if (data.ST_PROVEEDOR != 'S') {
                    dhtmlx.confirm("La entidad seleccionada no se encuentra como PROVEEDOR. ¿ Desea Asignarlo como PROVEEDOR ? :", function (result) {
                        if (result === Boolean(true)) {
                            myFormdatos.checkItem('st_provedor'), myFormdatos.enableItem('st_provedor'), myFormdatos.disableItem('_apemat'), myFormdatos.disableItem('_apepat'), myFormdatos.disableItem('_nudocumento'),
                                myFormdatos.disableItem('_nombres'), myFormdatos.disableItem('_nomcomer'), myFormdatos.disableItem('_razsocial');
                            (['_provtipo', '_provstado', '_proformpago', '_procondpago']).forEach((elm) => { myFormdatos.enableItem(elm) }), (['_provchperm', '_provemail', '_provsharetenc', '_provshpercep', '_provshdetrec']).forEach((elm) => { myFormdatos.setReadonly(elm, false) }), permiso_cataedit = 'N', myToolbardatos.enableItem('__cancel'), myToolbardatos.enableItem('__edit'), myToolbardatos.enableItem('__save');
                        }
                    });

                }


            } else { oculta_item(1); }
            break;
        default: console.log('a222o');
            if (Object.keys(data).length > 0) {
                if (stasigna == 'Asignado') {
                    myFormdatos.checkItem('st_cliente'), myFormdatos.checkItem('st_personales'), myFormdatos.enableItem('st_cliente'), myFormdatos.enableItem('st_personales'), myFormdatos.setReadonly('st_cliente', true), myFormdatos.setReadonly('st_personales', true);
                } else {
                    myFormdatos.uncheckItem('st_cliente'), myFormdatos.checkItem('st_personales'), myFormdatos.enableItem('st_cliente'), myFormdatos.enableItem('st_personales'), myFormdatos.setReadonly('st_cliente', true), myFormdatos.setReadonly('st_personales', true);
                }
                cocliente = data.ST_CLIENTE == 'S' ? data.CO_CLIENTE : data.CO_CATALOGO,
                    oculta_item(parseInt(data.CO_TIPO_DOC_IDE)), co_cata_entidad = data.CO_CATALOGO, permiso_cataedit = data.ST_PERMISO_EDITAR_CATA_ENTI, co_listadopre = data.CO_LISTADO_PRECIOS, co_seri_listado = data.CO_SERIE_LISTADO;
                myForm.setItemValue('b_registro', data.FE_REGISTRO_CLIENTE);
                myFormdatos.setItemValue('_tipobanco', data.CO_BANCO), myFormdatos.setItemValue('_nudocumento', data.NU_DOCUMENTO), myFormdatos.setItemValue('_tipodoc', data.CO_TIPO_DOC_IDE), myFormdatos.setItemValue('_tipoper', data.CO_TIPO_PERSONA), myFormdatos.setItemValue('_apepat', data.DE_APE_PATERNO), myFormdatos.setItemValue('_apemat', data.DE_APE_MATERNO), myFormdatos.setItemValue('_nombres', data.DE_NOMBRE), myFormdatos.setItemValue('_origen', data.DE_ORIGEN), myFormdatos.setItemValue('_procedencia', data.DE_PROCEDENCIA), myFormdatos.setItemValue('_razsocial', data.DE_RAZON_SOCIAL), myFormdatos.setItemValue('_vigencia', data.ES_VIGENCIA), myFormdatos.setItemValue('_clvigencia', data.ES_VIGENCIA_CLIENTE), myFormdatos.setItemValue('_nomcomer', data.DE_NOMBRE_COMERCIAL), myFormdatos.setItemValue('_tipocliente', data.CO_TIPO_CLIENTE), myFormdatos.setItemValue('_tipo_negoc', data.CO_TIPO_NEGOCIO), myFormdatos.setItemValue('_creditototal', data.IM_CREDITO_TOTAL), myFormdatos.setItemValue('_deudatotal', data.IM_DEUDA_TOTAL), myFormdatos.setItemValue('_ingreso', data.CO_PERIODO_CLIEN_NVO), myFormdatos.setItemValue('_email', data.DE_EMAIL), myFormdatos.setItemValue('_webpage', data.DE_WEBPAGE),
                    myFormdatos.setItemValue('_fredcata', data.FE_REGISTRO), myFormdatos.setItemValue('_fregcliente', data.FE_REGISTRO_CLIENTE), myFormdatos.setItemValue('_fretiro', data.FE_RETIRO_CLIENTE), data.ST_AGENTE_PERCEPCION === 'S' ? myFormdatos.checkItem('_ch_agentpercep') : myFormdatos.uncheckItem('_ch_agentpercep'), data.ST_AGENTE_RETENEDOR === 'S' ? myFormdatos.checkItem('_ch_agenretenedor') : myFormdatos.uncheckItem('_ch_agenretenedor'), data.ST_CLIENTE_NVO === 'S' ? myFormdatos.checkItem('_ch_clinuevo') : myFormdatos.uncheckItem('_ch_clinuevo'), data.ST_RECAUDO === 'S' ? myFormdatos.checkItem('_ch_recaudo') : myFormdatos.uncheckItem('_ch_recaudo');
                if (data.ST_CLIENTE_CORPORATIVO === 'S') {
                    cocliente_corpo = data.CO_CLIENTE_CORPORATIVO, myFormdatos.checkItem('_ch_clicorporativo'), myFormdatos.enableItem('_clientecorporativo'), myFormdatos.setItemValue('_clientecorporativo', data.CO_CLIENTE_CORPORATIVO + ' ' + data.DE_CLIENTE_CORPORATIVO), myFormdatos.enableItem('b_clientecorp');//myFormdatos.enableItem('b_creditolinea');
                } else {
                    myFormdatos.uncheckItem('_ch_clicorporativo'), myFormdatos.disableItem('_clientecorporativo'), myFormdatos.setItemValue('_clientecorporativo', ''), myFormdatos.disableItem('b_clientecorp');//, myFormdatos.disableItem('b_creditolinea');
                }
                if (data.CO_LISTADO_PRECIOS > 0) {
                    co_listadopre = data.CO_LISTADO_PRECIOS, co_seri_listado = data.CO_SERIE_LISTADO, myFormdatos.setItemValue('_listaprecios', data.CO_LISTADO_PRECIOS + ' ' + data.DE_LISTA_PRECIO), myFormdatos.checkItem('_ch_listaprecio'), myFormdatos.enableItem('_listaprecios'), myFormdatos.enableItem('b_busprecios');
                } else {
                    myFormdatos.setItemValue('_listaprecios', ''), myFormdatos.uncheckItem('_ch_listaprecio'), myFormdatos.disableItem('_listaprecios'), myFormdatos.disableItem('b_busprecios');
                }
                if (data.ST_CLIENTE != 'S') {
                    dhtmlx.confirm("La entidad seleccionada no se encuentra como CLIENTE. ¿ Desea Asignarlo como CLIENTE ? :", function (result) {
                        if (result === Boolean(true)) {
                            myFormdatos.checkItem('st_cliente'), myFormdatos.enableItem('st_cliente'), myFormdatos.disableItem('_apemat'), myFormdatos.disableItem('_apepat'), myFormdatos.disableItem('_nudocumento'),
                                myFormdatos.disableItem('_nombres'), myFormdatos.disableItem('_nomcomer'), myFormdatos.disableItem('_razsocial');
                            (['_tipocliente', '_tipobanco', '_tipo_negoc', '_ch_listaprecio', '_ch_recaudo', '_ch_agenretenedor', '_ch_agentpercep', '_ch_clinuevo', '_ch_clicorporativo', '_ch_excepcredito']).forEach((elm) => { myFormdatos.enableItem(elm) });
                            (['_creditototal', '_deudatotal', '_ingreso', '_email', '_webpage']).forEach((elm) => { myFormdatos.setReadonly(elm, false) });
                            permiso_cataedit = 'N', myToolbardatos.enableItem('__cancel'), myToolbardatos.enableItem('__edit'), myToolbardatos.enableItem('__save');
                        }
                    });

                }




            } else { oculta_item(1); }
            break;
    }
}

onbuscacliente = (win, value) => {
    if (value.length > 0) {
        win.window("wbusq").progressOn();
        myGrid.clearAll();
        myGrid.load(BASE_URL + 'MA010102/gridcliente/' + usrJson.empresa + '/' + enti_tipo + '/' + value).then(function (text) {
            win.window("wbusq").progressOff();
        });
    } else {
        Swal.fire({ type: 'warning', text: 'Ingrese correctamente un nombre o documento...', showConfirmButton: false, timer: 1500 });
    }
};

function style(name, value) {
    if (name === 'b_cliente' && value.length < 51)
        return "<div class='nomcliente'>" + value + "</div>";
    else
        return "<div class='s_estado'>" + value + "</div>";
}

onselect_sidebar = (id, lastId) => {
    _item_sidebar = id;
    switch (id) {
        case 's_datos':
            if (cocliente != 0) {
                console.log('aqui');
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
        case 's_documento':
            f_s_doc();
            break;
        case 's_antecedente':
            f_s_antecedentes();
            break;
        case 's_comunicacion':
            f_s_comunica();
            break;

        default:
            null;
            break;
    }
    return true;
};

f_s_direcc = () => {
    cod = enti_tipo == 1 ? co_entidad : cocliente;
    if (cod > 0) {
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
                case '__buscarubigeo': console.log('sw __buscarubigeo');
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
                            myLaouy_fz.cells("a").progressOff(); console.log(sel_zc);
                        });
                        _txtgrid(subgrilla, 11);
                        subgrilla.attachEvent("onRowSelect", function (id, ind) {
                            sel_fv = subgrilla.getRowData(id), sel_fvid = id;
                            var ids = myGridzco.getAllRowIds(); console.log(sel_fv);
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
        myDataDirecc.load(BASE_URL + 'MA010102/cargardirecc/' + cod, "json");
        myLaouy_Direc.cells("a").progressOff();
        myDataDirecc.attachEvent("onBeforeSelect", (id) => {
            myToolbardirecc.enableItem('__nuevo'), myToolbardirecc.disableItem('__save'), myToolbardirecc.disableItem('__cancel'), _selecobject = myDataDirecc.get(id), co_direccion = myDataDirecc.get(id).CO_DIRECCION_ENTIDAD, __onSelectAntes(id, myDataDirecc, myToolbardirecc, estadook, co_direccion);
            return true;
        });
    } else {
        no_select_client(myLaouy_Direc, 's_direccion');
    }
};
ontollbarclicdirec = async (id) => {
    switch (id) {
        case '__edit':
            if (co_direccion > 0) {
                (['__nuevo', '__edit']).forEach((elem) => { myToolbardirecc.disableItem(elem) });
                (['__save', '__cancel']).forEach((elem) => { myToolbardirecc.enableItem(elem) });
                activa_form_direcc('edit');
            } else {
                Swal.fire('Alerta!', 'Debes seleccionar una dirección para poder editarla..', 'error');
            }
            break;
        case '__cancel':
            __onSelectAntes(_selecobject, myDataDirecc, myToolbardirecc, estadook, codireccion);
            break;
        case '__nuevo':
            cocliente = 0, myToolbardatos.disableItem('__edit'), permiso_cataedit = 'S';
            myForm.setItemValue('b_cliente', ''), myForm.setItemValue('b_estado', ''), myForm.setItemValue('b_asignado', '');
            myFormdatos.checkItem('st_personales'), myFormdatos.enableItem('st_personales');
            myFormdatos.checkItem('st_cliente'), myFormdatos.enableItem('st_cliente'), myToolbardatos.disableItem('__lincredito');
            myToolbardatos.enableItem('__save'), myToolbardatos.enableItem('__cancel');
            myFormdatos.enableItem('b_dniservice');
            myFormdatos.setItemValue('_clvigencia', 'Vigente');
            form_ini(cocliente);
            break;
        case '__save':
            grabar_direcc();
            break;

        default:
            null;
            break;
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

function __onSelectAntes(id, dataview, tollbar, estadook, cod_direc) {
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
        (['__anula', '__activar', '__edit']).forEach((elem) => { tollbar.disableItem(elem) });
    }
}
function activa_form_direcc(stado) {
    switch (stado) {
        case 'edit':
            (['ch_borrado', 'ch_principal', '_nvia', '_nzona', '_postal', '_numero', '_interior', '_referencias', '_altitud', '_latitud', '_zoom', '_iniaten', '_finaten']).forEach((elm) => {
                myFormdirecc.setReadonly(elm, false);
            });
            (['__buscarubigeo', '_via', '_zona', '__fz_zn', '_estado']).forEach((elm) => {
                myFormdirecc.enableItem(elm);
            });
            break;
        default:
            (['ch_borrado', 'ch_principal', '_nvia', '_nzona', '_postal', '_numero', '_interior', '_referencias', '_altitud', '_latitud', '_zoom', '_iniaten', '_finaten']).forEach((elm) => {
                myFormdirecc.setReadonly(elm, true);
            });
            (['__buscarubigeo', '_via', '_zona', '__fz_zn']).forEach((elm) => {
                myFormdirecc.disableItem(elm);
            });
            break;
    }
    console.log('409');


}
f_s_datos = (cod) => {
    if (cod > 0) {
        carga_form_cliente(cod);
    } else {
        no_select_client(myLaouy_Dat, 's_datos');
    }
};

function carga_form_cliente(cod) {
    myLaouy_Dat = mySidebar.cells("s_datos").attachLayout('1C');
    myLaouy_Dat.cells("a").hideHeader();
    myToolbardatos = myLaouy_Dat.cells("a").attachToolbar(base_tollbar);
    myToolbardatos.setIconSize(48);
    myToolbardatos.attachEvent("onClick", ontollbarclic);
    switch (modulo) {
        case 'MA010103':
            myFormdatos = myLaouy_Dat.cells("a").attachForm(f_datos_proveedor);
            break;
        case 'MA010105':
            myFormdatos = myLaouy_Dat.cells("a").attachForm(f_datos_cliente);
            break;
        case 'MA010106':
            myFormdatos = myLaouy_Dat.cells("a").attachForm(f_datos_cliente);
            break;
        case 'MA010109':
            myFormdatos = myLaouy_Dat.cells("a").attachForm(f_datos_cliente);
            break;
        default:
            myFormdatos = myLaouy_Dat.cells("a").attachForm(f_datos_cliente);
            break;
    }

    form_ini(cod);
    myFormdatos.attachEvent("onButtonClick", async (name) => {
        var output;
        switch (name) {
            case 'b_dniservice':
                if ((myFormdatos.getItemValue('_nudocumento')).replace(/ /g, "").length > 0) {
                    myFormdatos.setItemValue('_nudocumento', (myFormdatos.getItemValue('_nudocumento')).replace(/ /g, ""));
                    mySidebar.cells("s_datos").progressOn(); // Wind_.window("wbusq").progressOn();
                    var p = { dni: myFormdatos.getItemValue('_nudocumento'), tipo: myFormdatos.getItemValue('_tipodoc') };
                    if (myFormdatos.validate()) {
                        enti_tipo == 1 ? co_entidad = parseInt(myFormdatos.getItemValue('_nudocumento')) : cocliente = parseInt(myFormdatos.getItemValue('_nudocumento'));
                        $.post(BASE_URL + "home/buscadni", p, function (res) {
                            var t = myFormdatos.getSelect("_tipodoc");
                            if (res.state !== 'error') {
                                switch (myFormdatos.getItemValue('_tipodoc')) {
                                    case '1':
                                        var value = res.value.split('|');
                                        if (value[0].length > 0 || value[1].length > 0) {
                                            myFormdatos.setItemValue('_apepat', ''), myFormdatos.setItemValue('_apemat', ''), myFormdatos.setItemValue('_nombres', ''), myFormdatos.setItemValue('_razsocial', ''), myFormdatos.setItemValue('_nomcomer', '');
                                            myFormdatos.setItemValue('_apepat', value[0]), myFormdatos.setItemValue('_apemat', value[1]), myFormdatos.setItemValue('_nombres', value[2]), myFormdatos.setItemValue('_razsocial', value[0] + ' ' + value[1] + ' ' + value[2]), myFormdatos.setItemValue('_nomcomer', value[0] + ' ' + value[1] + ' ' + value[2]);
                                        }
                                        break;
                                    case '6': //console.log(res.value);
                                        if (res.value.contribuyente_estado == "ACTIVO") {
                                            myFormdatos.setItemValue('_razsocial', res.value.razon_social), myFormdatos.setItemValue('_nomcomer', res.value.nombre_comercial);
                                        } else {
                                            dhtmlx.message({ type: "error", text: "El RUC se encuentra en estado :" + res.value.contribuyente_condicion, expire: 5000 });
                                        }
                                        break;
                                    default:
                                        dhtmlx.message({ text: "No se cuentra Información para este tipo de Entidad ", expire: 4000 });
                                        break;
                                }
                            } else {
                                var t = myFormdatos.getSelect("_tipodoc");
                                dhtmlx.message({ text: "Ups!.. No se encontraron datos para este " + t.options[t.selectedIndex].text + ", ingreselo manualmente, por favor", expire: 9000 });
                                myFormdatos.setItemValue('_apepat', ''), myFormdatos.setItemValue('_apemat', ''), myFormdatos.setItemValue('_nombres', ''), myFormdatos.setItemValue('_razsocial', ''), myFormdatos.setItemValue('_nomcomer', '');
                            }
                            mySidebar.cells("s_datos").progressOff();
                        }, "json");
                    } else {
                        mySidebar.cells("s_datos").progressOff();
                    }
                } else {
                    dhtmlx.message({ type: "error", text: "Tiene q ingresar un Numero de Documento correcto y sin espacios en blanco, por favor", expire: 5000 });
                }
                break;
            case 'b_busprecios':
                output = await IniciarGridBusqueda(6, false, mainLayout);
                if (output !== null) {
                    co_listadopre = output.seleccion[0].colistado;
                    co_seri_listado = output.seleccion[0].serielistado;
                    myFormdatos.setItemValue('_listaprecios', output.seleccion[0].colistado + ' ' + output.seleccion[0].nombre);
                }
                break;
            case 'b_clientecorp': console.log('cocliente : ' + cocliente);
                output = await IniciarGridBusqueda(5, false, mainLayout, cocliente);
                if (output !== null) {
                    cocliente_corpo = output.seleccion[0].codigo;
                    nom_clien_corpo = output.seleccion[0].ncomercial;
                    myFormdatos.setItemValue('_clientecorporativo', cocliente_corpo + ' ' + nom_clien_corpo);
                }
                break;
            default:
                null;
                break;
        }
    });
    myFormdatos.attachEvent("onChange", function (name, value, state) {
        switch (name) {
            case '_tipodoc':
                oculta_item(parseInt(value)); console.log('509');
                break;
            case '_proformpago':
                myFormdatos.reloadOptions('_procondpago', BASE_URL + 'MA010102/list_condpago/' + value);
                break;
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

}

function form_ini(cod) {
    permiso_cataedit = 'S', myForm.setItemValue('b_cliente', 'Busque un ' + label_tipo),
        myToolbardatos.disableItem('__save'), myToolbardatos.disableItem('__cancel'),
        myFormdatos.setItemValue('_vigencia', 'Vigente'),
        myFormdatos.enableItem('st_personales'), myFormdatos.checkItem('st_personales');
    switch (enti_tipo) {
        case 1: //console.log('activar st_provedor');
            myFormdatos.checkItem('st_provedor'), myFormdatos.enableItem('st_provedor'),
                (['_provsharetenc', '_provshpercep', '_provshdetrec', '_provchperm']).forEach((elm) => {
                    myFormdatos.uncheckItem(elm);
                });
            (['_provsharetenc', '_provshpercep', '_provshdetrec', '_provchperm', '_tipodoc', '_tipoper', '_procedencia', '_origen', '_provtipo', '_provstado', '_proformpago', '_procondpago']).forEach((elm) => {
                myFormdatos.enableItem(elm);
            });
            if (cod == 0) {
                console.log('573');
                json_select = {}, cargar_datos_clie(json_select, ''), myForm.setItemValue('b_estado', ''), myForm.setItemValue('b_asignado', ''), myForm.setItemValue('b_registro', ''),
                    myFormdatos.enableItem('b_dniservice'), form_edit_ini(false, 'E'), myToolbardatos.enableItem('__save'), myToolbardatos.disableItem('__edit'), myToolbardatos.enableItem('__cancel');
            } else {

            };
            break;
        default:
            myFormdatos.checkItem('st_cliente'), myFormdatos.enableItem('st_cliente'),
                (['_ch_recaudo', '_ch_excepcredito', '_ch_agenretenedor', '_ch_agentpercep', '_ch_clinuevo', '_ch_clicorporativo']).forEach((elm) => {
                    myFormdatos.uncheckItem(elm);
                });
            (['_nudocumento', '_razsocial', '_nomcomer', '_apepat', '_apemat', '_nombres', '_listaprecios', '_ingreso', '_creditototal', '_deudatotal', '_email', '_webpage', '_fvigencia']).forEach((elm) => {
                myFormdatos.setReadonly(elm, false), myFormdatos.setItemValue(elm, '');
            });
            (['_tipodoc', '_tipoper', '_procedencia', '_origen', '_tipocliente', '_tipobanco', '_tipo_negoc', '_ch_listaprecio', '_ch_recaudo', '_ch_excepcredito', '_ch_agenretenedor', '_ch_agentpercep', '_ch_clinuevo', '_ch_clicorporativo', '_clvigencia']).forEach((elm) => {
                myFormdatos.enableItem(elm);
            });
            if (cod == 0) {
                console.log('591');
                json_select = {}, cargar_datos_clie(json_select, ''), myForm.setItemValue('b_estado', ''), myForm.setItemValue('b_asignado', ''), myForm.setItemValue('b_registro', ''),
                    myFormdatos.setItemValue('_ingreso', '0'), myFormdatos.setItemValue('_creditototal', '0.00'), myFormdatos.setItemValue('_deudatotal', '0.00'), myFormdatos.enableItem('b_dniservice'), form_edit_ini(false, 'E'), myToolbardatos.enableItem('__save'), myToolbardatos.disableItem('__edit'), myToolbardatos.enableItem('__cancel');
            } else {

            };

            break;
    }



}

function oculta_item(value) {
    switch (value) {
        case 1://dni
            myFormdatos.hideItem('_nomcomer'), myFormdatos.hideItem('_razsocial'), myFormdatos.showItem('_apemat'), myFormdatos.showItem('_apepat'), myFormdatos.showItem('_nombres');
            break;
        case 6:
            myFormdatos.showItem('_nomcomer'), myFormdatos.showItem('_razsocial'), myFormdatos.hideItem('_apemat'), myFormdatos.hideItem('_apepat'), myFormdatos.hideItem('_nombres');
            break;
        default: console.log('nada');
            break;
    }

}
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
            cod = enti_tipo == 1 ? co_entidad : cocliente;
            if (cod > 0) {
                if (enti_tipo == 1) {
                    let st_sig = json_select.ST_PROVEEDOR == 'S' ? 'Asignado' : 'No Asignado';
                    cargar_datos_clie(json_select, st_sig);
                    json_select.ST_PROVEEDOR == 'N' ? myFormdatos.disableItem('st_provedor') : null;
                } else {
                    let st_sig = json_select.ST_CLIENTE == 'S' ? 'Asignado' : 'No Asignado';
                    cargar_datos_clie(json_select, st_sig);
                    json_select.ST_CLIENTE == 'N' ? myFormdatos.disableItem('st_cliente') : null;
                }
                console.log('693');
                form_edit_ini(true, 'E'), myToolbardatos.enableItem('__nuevo'), myToolbardatos.enableItem('__edit'), myToolbardatos.disableItem('__save'), myToolbardatos.disableItem('__cancel');
                (['_provtipo', '_provstado', '_proformpago', '_procondpago', '_tipo_negoc', '_tipobanco', '_tipocliente', '_tipodoc', '_tipoper', '_procedencia', '_origen', '_clvigencia', '_vigencia']).forEach((elm) => {
                    myFormdatos.disableItem(elm);
                });
            } else {
                cocliente = 0, permiso_cataedit = 'N', json_select = {}, no_select_client(myLaouy_Dat, 's_datos');
            }
            break;
        case '__nuevo':
            switch (enti_tipo) {
                case 1: console.log('__nuevo');
                    co_entidad = 0, cod = co_entidad,
                        myFormdatos.setItemValue('_provstado', 'Vigente');
                    break;
                default:
                    cocliente = 0, cod = cocliente,
                        // myFormdatos.checkItem('st_cliente'), myFormdatos.enableItem('st_cliente'), 
                        myFormdatos.setItemValue('_clvigencia', 'Vigente');
                    break;
            }
            form_ini(cod);
            break;
        case '__save': console.log('co-entidad 3 ' + co_entidad);
            let tipodoc__ = myFormdatos.getItemValue('_tipodoc'); console.log(permiso_cataedit);
            verifica_codig(tipodoc__, myFormdatos.getItemValue('_nudocumento'));
            break;
        case '__edit': console.log('co-entidad 3 1' + co_entidad);
            var output = await IniciarFormularioSeguridad(58, mainLayout);
            if (output.result === 'S') {
                console.log('722');
                form_edit_ini(false, 'E'), myToolbardatos.enableItem('__cancel'), myToolbardatos.disableItem('__edit'), myToolbardatos.enableItem('__save'), myFormdatos.disableItem('b_dniservice'), myToolbardatos.disableItem('__nuevo');
                switch (enti_tipo) {
                    case 1://provee
                        permiso_cataedit = 'S'; json_select.ST_PROVEEDOR == 'S' ? myFormdatos.setReadonly('st_provedor', true) : myFormdatos.setReadonly('st_provedor', false), myFormdatos.enableItem('st_provedor');
                        break;
                    default: //cliente 
                        permiso_cataedit = 'S'; json_select.ST_CLIENTE == 'S' ? myFormdatos.setReadonly('st_cliente', true) : myFormdatos.setReadonly('st_cliente', false), myFormdatos.enableItem('st_cliente');
                        break;
                }
            } else { console.log(output) }
            break;
        default:
            null;
            break;
    }
};

function verifica_codig(tipo, cod) {
    switch (tipo) {
        case '1':
            cod.length !== 8 ? Swal.fire({ type: 'error', title: 'Dni Incorrecto...', text: 'Debe tener 8 digitos' }) : grabar_datos();
            break;
        case '6':
            cod.length !== 11 ? Swal.fire({ type: 'error', title: 'RUC Incorrecto...', text: 'Debe tener 11 digitos' }) : grabar_datos();
            break;
        default:
            grabar_datos();
            break;
    }
}
grabar_datos = () => {
    let p;
    switch (enti_tipo) {
        case 1: myLaouy_Dat.cells("a").progressOn();
            p = {
                st_permiso_editar_cata_enti: permiso_cataedit, x_empresa: usrJson.empresa, x_alias: usrJson.alias, xco_catalogo_entidad: co_entidad, x_nu_documento: myFormdatos.getItemValue('_nudocumento'), x_de_razon_social: myFormdatos.getItemValue('_razsocial'), x_co_tipo_persona: myFormdatos.getItemValue('_tipoper'), x_co_tipo_doc_ide: myFormdatos.getItemValue('_tipodoc'),
                x_de_procedencia: myFormdatos.getItemValue('_procedencia'), x_de_nombre_comercial: myFormdatos.getItemValue('_nomcomer'), x_de_origen: myFormdatos.getItemValue('_origen'), x_st_asignaprovee: myFormdatos.isItemChecked('st_provedor') ? 'S' : 'N', x_co_tipo_prov: myFormdatos.getItemValue('_provtipo'), x_estad_prov: myFormdatos.getItemValue('_provstado'), x_form_pago: myFormdatos.getItemValue('_proformpago'), x_cond_pago: myFormdatos.getItemValue('_procondpago'), st_permanente: myFormdatos.isItemChecked('_provchperm') ? 'S' : 'N', x_email: myFormdatos.getItemValue('_provemail'),
                st_agent_reten: myFormdatos.isItemChecked('_provsharetenc') ? 'S' : 'N', st_agent_percep: myFormdatos.isItemChecked('_provshpercep') ? 'S' : 'N', st_agent_detrac: myFormdatos.isItemChecked('_provshdetrec') ? 'S' : 'N'
            };
            $.post(BASE_URL + "MA010102/saveproveed", p, function (res) {
                if (parseFloat(res.codigo) > 0) {
                    form_edit_ini(true, 'D'), actu_jselec(p), myForm.setItemValue('b_asignado', 'Asignado'), myForm.setItemValue('b_registro', res.fechaprov), myFormdatos.setItemValue('_provfsys', res.fechaprov), myFormdatos.setItemValue('_provfretiro', res.feretiro), myToolbardatos.disableItem('__save'), myToolbardatos.enableItem('__nuevo'), myToolbardatos.enableItem('__edit'), myToolbardatos.disableItem('__cancel'), myForm.setItemValue('b_estado', res.estado), myForm.setItemValue('b_cliente', res.nombre), myFormdatos.setItemValue('_fredcata', res.fechacata), myFormdatos.disableItem('b_dniservice');
                    Swal.fire('Bien!', res.message, 'success'), myLaouy_Dat.cells("a").progressOff();
                } else {
                    Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se guardó sus cambios  :' + res.message }), myLaouy_Dat.cells("a").progressOff();
                }
            }, "json");
            break;
        default:
            p = {
                st_permiso_editar_cata_enti: permiso_cataedit, x_empresa: usrJson.empresa, x_alias: usrJson.alias, x_co_catalogo_entidad: co_cata_entidad, x_de_razon_social: myFormdatos.getItemValue('_razsocial'), x_nu_documento: myFormdatos.getItemValue('_nudocumento'),
                x_co_tipo_persona: myFormdatos.getItemValue('_tipoper'), x_co_tipo_doc_ide: myFormdatos.getItemValue('_tipodoc'), x_de_procedencia: myFormdatos.getItemValue('_procedencia'), x_de_ape_paterno: myFormdatos.getItemValue('_apepat'), x_de_ape_materno: myFormdatos.getItemValue('_apemat'), x_de_nombre: myFormdatos.getItemValue('_nombres'), x_de_nombre_comercial: myFormdatos.getItemValue('_nomcomer'), x_de_origen: myFormdatos.getItemValue('_origen'), x_co_cliente: cocliente, x_co_tipo_cliente: myFormdatos.getItemValue('_tipocliente'), x_st_recaudo: myFormdatos.isItemChecked('_ch_recaudo') ? 'S' : 'N', x_co_banco: myFormdatos.getItemValue('_tipobanco'), x_co_tipo_negocio: myFormdatos.getItemValue('_tipo_negoc'),
                x_co_listado_precios: co_listadopre, x_co_serie_listado: co_seri_listado, x_st_agente_retenedor: myFormdatos.isItemChecked('_ch_agenretenedor') ? 'S' : 'N', x_st_agente_percepcion: myFormdatos.isItemChecked('_ch_agentpercep') ? 'S' : 'N', x_st_cliente_nvo: myFormdatos.isItemChecked('_ch_clinuevo') ? 'S' : 'N', x_co_periodo_clien_nvo: validation.isNumber(myFormdatos.getItemValue('_ingreso')) ? myFormdatos.getItemValue('_ingreso') : 0, x_st_cliente_corporativo: myFormdatos.isItemChecked('_ch_clicorporativo') ? 'S' : 'N', x_co_cliente_corporativo: cocliente_corpo,
                x_im_credito_total: myFormdatos.getItemValue('_creditototal'), x_im_deuda_total: myFormdatos.getItemValue('_deudatotal'), x_de_email: myFormdatos.getItemValue('_email'), x_de_webpage: myFormdatos.getItemValue('_webpage'), x_es_vigencia_cliente: myFormdatos.getItemValue('_clvigencia'), x_fe_retiro_cliente: null, x_St_Excep_Cred: myFormdatos.isItemChecked('_ch_excepcredito') ? 'S' : 'N'
            };
            $.post(BASE_URL + "MA010102/savecliente", p, function (res) {
                if (parseFloat(res.codigo) > 0) {
                    permiso_cataedit = 'N', actu_jselec(p), form_edit_ini(true, 'D'), myFormdatos.setItemValue('_razsocial', myFormdatos.getItemValue('_apepat') + ' ' + myFormdatos.getItemValue('_apemat') + ' ' + myFormdatos.getItemValue('_nombres')), myToolbardatos.disableItem('__save'), myToolbardatos.enableItem('__edit'), myToolbardatos.disableItem('__cancel'), myForm.setItemValue('b_estado', res.estado), myForm.setItemValue('b_cliente', res.nombre), myFormdatos.setItemValue('_fretiro', res.fechareti), myFormdatos.setItemValue('_fregcliente', res.fechacli), myFormdatos.setItemValue('_fredcata', res.fechacata), myFormdatos.disableItem('b_dniservice');
                    Swal.fire('Bien!', res.message, 'success'), myLaouy_Dat.cells("a").progressOff();
                } else {
                    Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se guardó sus cambios  :' + res.message }), myLaouy_Dat.cells("a").progressOff();
                }
            }, "json");
            break;
    }
};
function ValidaRUCDNI(data) {
    if (validation.isNumber(data)) {
        if (myFormdatos.getItemValue('_tipodoc') == '1') {
            if (data.length == 8) {
                return true;
            } else {
                dhtmlx.message({ type: "error", text: "Para DNI , debe ingresar [8 DIGITOS] ", expire: 5000 });
                return false;
            }
        } else {
            if (data.length == 11) {
                return true;
            } else {
                dhtmlx.message({ type: "error", text: "Para RUC , debe ingresar [11 DIGITOS] ", expire: 5000 });
                return false;
            }
        }
    } else {
        dhtmlx.message({ type: "error", text: "Debe ingresar sólo NUMEROS [ 0 - 9 ]", expire: 5000 });
        return false;
    }
}
var validation = {
    isEmailAddress: function (str) {
        var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return pattern.test(str);  // returns a boolean
    },
    isNotEmpty: function (str) {
        var pattern = /\S+/;
        return pattern.test(str);  // returns a boolean
    },
    isNumber: function (str) {
        var pattern = /^\d+$/;
        return pattern.test(str);  // returns a boolean
    },
    isSame: function (str1, str2) {
        return str1 === str2;
    }
};
ontollbarfz = async (id) => {
    switch (id) {
        case '__exitfz':
            //sel_zc = undefined, sel_fv = undefined, sel_zcid = undefined, sel_fvid = undefined;
            Wind_fz.window("wfzvta").close();
            break;
        case '__edit':
            cargar_windo_editfz('edit', sel_zc, sel_fv); console.log(sel_zc);
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
            __onSelectAntes(_selecobject, myDataDirecc, myToolbardirecc, estadook, co_direccion);
            break;
        case '__nuevo':
            cargar_windo_editfz('nuevo', { id_: 0 }, {});


            break;
        case '__save':
            grabar_direcc();
            break;

        default:
            null;
            break;
    }
};

cargar_windo_editfz = (stado, sel_zc, sel_fv) => {
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

    if (stado === 'nuevo') {
        myFormzc = myLayouedit_fz.cells("a").attachForm(f_zcomer);
        myFormfz = myLayouedit_fz.cells("b").attachForm(f_frzvta);
        myFormzc.enableItem('_zncomer');
        botones_ventana(stado, myFormzc, sel_zc, { id_: 0 });
        botones_ventana(stado, myFormfz, {}, sel_fv);
    } else {
        if (sel_zc !== undefined) {
            console.log(sel_zc);
            myFormzc = myLayouedit_fz.cells("a").attachForm(f_zcomer);
            botones_ventana(stado, myFormzc, sel_zc, { id_: 0 });
        }
        if (sel_fv !== undefined) {
            console.log(sel_fv);
            myFormfz = myLayouedit_fz.cells("b").attachForm(f_frzvta);
            botones_ventana(stado, myFormfz, {}, sel_fv);
        }
    }
}
botones_ventana = (stado, form, sel_zc, sel_fv) => {
    form.attachEvent("onButtonClick", async (name) => {
        switch (name) {
            case 'b_savefv': console.log(sel_fv);
                if (stado == 'nuevo') { sel_fv = { id_: 0 }, sel_zc = {}, sel_fvid = 0, sel_zcid = 0; }
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
                        //console.log(myFormfz.getItemValue('_fzvta') + '-' + t.options[t.selectedIndex].text);
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
                let zoncomold;
                if (stado == 'nuevo') { sel_fv = { id_: 0 }, sel_zc = {}, sel_fvid = 0, sel_zcid = 0, zoncomold = 0; } else {
                    zoncomold = myFormzc.getItemValue('_zncomer') === sel_zc.cozona ? sel_zc.cozona : myFormzc.getItemValue('_zncomer');
                }
                let p = {
                    x_empresa: usrJson.empresa, x_usuario: usrJson.codigo, x_co_direccion_entidad: co_direccion, x_cadena_zona: myFormzc.getItemValue('_zncomer') + '@@@' + zoncomold + '@@@' + myFormzc.getItemValue('_estado') + "|||", x_cant_filas: 1
                };
                $.post(BASE_URL + "MA010102/updatezon_comer", p, function (res) {
                    if (parseFloat(res.codigo) > 0) {
                        if (stado == 'nuevo') {
                            let newId = (new Date()).valueOf();
                            myGridzco.addRow(newId, myForm_giro.getItemValue('_giro') + ',' + t.options[t.selectedIndex].text + ',' + myForm_giro.getItemValue('giro_detalle') + ',' + res.fe_reg + ',' +myForm_giro.getItemValue('giro_stado') + ',,' + cocliente);
                            //myGridzco.clearAll();
                           //myGridzco.load(BASE_URL + 'MA010102/gridfz/' + co_direccion + '/' + usrJson.empresa);
                            _txtgrid(myGridzco, 2);//myGridzco.setRowTextStyle(sel_zcid, "text-decoration: none;");
                        } else {
                            if ((myFormzc.getItemValue('_estado')).toUpperCase() === 'VIGENTE') {
                                sel_zc.vigencia = 'Vigente', myGridzco.cells(sel_zcid, 3).setValue("Vigente"), myGridzco.setRowTextStyle(sel_zcid, "text-decoration: none;");
                            } else {
                                sel_zc.vigencia = 'Retirado', myGridzco.cells(sel_zcid, 3).setValue("Retirado"), myGridzco.setRowTextStyle(sel_zcid, "text-decoration: line-through;");
                            }
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
        x_st_erased: myFormdirecc.isItemChecked('ch_borrado') ? '1' : '0', x_cadena: '', x_cant_filas: '0' /*_selecobject.ST_ERASED*/
    };

    $.post(BASE_URL + "MA010102/grabadirec", p, function (res) {
        if (parseFloat(res.codigo) > 0) {
            permiso_cataedit = 'N';
            // form_edit_ini(true, 'D');
            myToolbardatos.disableItem('__save'), myToolbardatos.enableItem('__edit'), myToolbardatos.disableItem('__cancel'), myForm.setItemValue('b_estado', res.estado), myForm.setItemValue('b_cliente', res.nombre), myFormdatos.setItemValue('_fredcata', res.fecha), myFormdatos.disableItem('b_dniservice');
            Swal.fire('Bien!', res.message, 'success');
        }

    }, "json");
};


function actu_jselec(p) {
    switch (enti_tipo) {
        case 1:
            json_select.ST_AFECTO_DETRACCION = p.st_agent_detrac, json_select.ST_PERCEPCION = p.st_agent_percep, json_select.ST_RETENCION = p.st_agent_reten, json_select.ST_FIJO = p.st_permanente, json_select.CO_TIPO_DOC_IDE = p.x_co_tipo_doc_ide, json_select.CO_TIPO_PERSONA = p.x_co_tipo_persona, json_select.DE_TIPO_PROVEEDOR = p.x_co_tipo_prov, json_select.CO_CONDICION_PAGO = p.x_cond_pago, json_select.DE_NOMBRE_COMERCIAL = p.x_de_nombre_comercial, json_select.DE_ORIGEN = p.x_de_origen,
                json_select.DE_PROCEDENCIA = p.x_de_procedencia, json_select.DE_RAZON_SOCIAL = p.x_de_razon_social, json_select.DE_EMAIL = p.x_email, json_select.ES_VIGENCIA = p.x_estad_prov, json_select.CO_FORMA_PAGO = p.x_form_pago, json_select.NU_DOCUMENTO = p.x_nu_documento, json_select.CO_PROVEE = p.xco_catalogo_entidad;
            break;
        default://clientes
            json_select.ST_PERMISO_EDITAR_CATA_ENTI = p.st_permiso_editar_cata_enti, json_select.ST_EXCEP_CRED = p.x_St_Excep_Cred, json_select.CO_BANCO = p.x_co_banco, json_select.CO_CATALOGO_ENTIDAD = p.x_co_catalogo_entidad, json_select.CO_CLIENTE = p.x_co_cliente, json_select.CO_CLIENTE_CORPORATIVO = p.x_co_cliente_corporativo, json_select.CO_LISTADO_PRECIOS = p.x_co_listado_precios, json_select.CO_PERIODO_CLIEN_NVO = p.x_co_periodo_clien_nvo, json_select.CO_SERIE_LISTADO = p.x_co_serie_listado, json_select.CO_TIPO_CLIENTE = p.x_co_tipo_cliente, json_select.CO_TIPO_DOC_IDE = p.x_co_tipo_doc_ide,
                json_select.CO_TIPO_NEGOCIO = p.x_co_tipo_negocio, json_select.CO_TIPO_PERSONA = p.x_co_tipo_persona, json_select.DE_APE_MATERNO = p.x_de_ape_materno, json_select.DE_APE_PATERNO = p.x_de_ape_paterno, json_select.DE_EMAIL = p.x_de_email, json_select.DE_NOMBRE = p.x_de_nombre, json_select.DE_NOMBRE_COMERCIAL = p.x_de_nombre_comercial, json_select.DE_ORIGEN = p.x_de_origen, json_select.DE_PROCEDENCIA = p.x_de_procedencia, json_select.DE_RAZON_SOCIAL = p.x_co_tipo_doc_ide == '1' ? p.x_de_nombre_comercial : p.x_de_razon_social,
                json_select.DE_WEBPAGE = p.x_de_webpage, json_select.ES_VIGENCIA_CLIENTE = p.x_es_vigencia_cliente, json_select.FE_RETIRO_CLIENTE = p.x_fe_retiro_cliente, json_select.IM_CREDITO_TOTAL = p.x_im_credito_total, json_select.IM_DEUDA_TOTAL = p.x_im_deuda_total, json_select.NU_DOCUMENTO = p.x_nu_documento, json_select.ST_AGENTE_PERCEPCION = p.x_st_agente_percepcion,
                json_select.ST_AGENTE_RETENEDOR = p.x_st_agente_retenedor, json_select.ST_CLIENTE_CORPORATIVO = p.x_st_cliente_corporativo, json_select.ST_CLIENTE_NVO = p.x_st_cliente_nvo, json_select.ST_RECAUDO = p.x_st_recaudo;

            break;
    }
}


function form_edit_ini(bollean, stado) {
    //myFormdatos.enableItem('b_dniservice');
    (['_tipodoc', '_tipoper', '_procedencia', '_origen', '_clvigencia']).forEach((elm) => { (stado === 'E') ? myFormdatos.enableItem(elm) : myFormdatos.disableItem(elm) });
    (['_nudocumento', '_razsocial', '_nomcomer', '_apepat', '_apemat', '_nombres']).forEach((elm) => { (stado === 'E' && elm === '_razsocial' && enti_tipo === 2 && bollean === false) ? myFormdatos.setReadonly(elm, true) : myFormdatos.setReadonly(elm, bollean) });
    switch (enti_tipo) {
        case 1:
            (['_provtipo', '_provstado', '_proformpago', '_procondpago']).forEach((elm) => { stado === 'E' ? myFormdatos.enableItem(elm) : myFormdatos.disableItem(elm) }), (['_provchperm', '_provemail', '_provsharetenc', '_provshpercep', '_provshdetrec']).forEach((elm) => { myFormdatos.setReadonly(elm, bollean) });
            break;
        default:
            (['_tipocliente', '_tipobanco', '_tipo_negoc', '_ch_listaprecio', '_ch_recaudo', '_ch_agenretenedor', '_ch_agentpercep', '_ch_clinuevo', '_ch_clicorporativo', '_ch_excepcredito']).forEach((elm) => { stado === 'E' ? myFormdatos.enableItem(elm) : myFormdatos.disableItem(elm) }), (['_creditototal', '_deudatotal', '_ingreso', '_email', '_webpage']).forEach((elm) => { myFormdatos.setReadonly(elm, bollean) });
            break;
    }
}




function valores_defecto() {
    if (cocliente > 0) {
        myFormdatos.setItemValue('_tipobanco', 0);
        myFormdatos.setItemValue('_vigencia', 'Vigente');
    }
}

f_s_giro_ne = () => {
    //  myLayou_giro = mySidebar.cells("s_giro").attachLayout('1C');
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
    //  myLayou_gara = mySidebar.cells("s_garante").attachLayout('1C');
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
    //myLayou_contac = mySidebar.cells("s_contacto").attachLayout('1C');
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
                            xoption: _option, x_co_catalogo: cocliente, x_cargo_repre: myForm_contac.getItemValue('cont_carg_repre'), x_co_repre: myForm_contac.getItemValue('cont_co_repres'),
                            x_apellidos: myForm_contac.getItemValue('cont_apellido'), x_nombres: myForm_contac.getItemValue('cont_nombres'), x_mail: myForm_contac.getItemValue('cont_email'), x_telefono: myForm_contac.getItemValue('cont_telf'), x_estado: myForm_contac.getItemValue('cont_stado')
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
        myForm_cbanc.attachEvent("onButtonClick", async (name) => {
            switch (name) {
                case '_b_banco':
                    var output = await IniciarGridBusqueda(11, false, mainLayout);
                    if (output !== null) {
                        cobanco_s = output.seleccion[0].codbanco, copais_s = output.seleccion[0].copais;
                        myForm_cbanc.setItemValue('n_banco', output.seleccion[0].n_banco);
                        myForm_cbanc.setItemValue('pais_banco', output.seleccion[0].nompais);
                    }
                    break;
                case 'b_add': co_seq = 0, sel_cbancid = undefined, _option = 'nuevo', sel_cbanc = {}, myGridcbanc.clearSelection(), f_cleam_cbanc(sel_cbanc, 'nuevo'), myForm_cbanc.disableItem('b_add'), myForm_cbanc.disableItem('b_edit'), myForm_cbanc.enableItem('b_save'), myForm_cbanc.enableItem('b_cancel');
                    break;
                case 'b_edit':
                    _option = 'edit', f_cleam_cbanc(sel_cbanc, 'edit'), myForm_cbanc.disableItem('b_edit'), myForm_cbanc.disableItem('b_add');
                    break;
                case 'b_save':
                    if (myForm_cbanc.validate() === Boolean(true)) {
                        let p = {
                            /* xoption in varchar2,x_co_catalogo in number,x_tipo_cta in number,x_numcta in number,x_estado in varchar2,x_cobanco in varchar2,x_copais in number,idseq in number*/
                            xoption: _option, x_co_catalogo: cocliente, x_tipo_cta: myForm_cbanc.getItemValue('n_tipocta'), x_numcta: myForm_cbanc.getItemValue('nro_cta'), x_estado: myForm_cbanc.getItemValue('cta_stado'),
                            x_cobanco: cobanco_s, x_copais: copais_s, idseq: co_seq
                        };
                        $.post(BASE_URL + "MA010102/grabacuentas", p, function (res) {
                            if (parseFloat(res.codigo) > 0) {
                                let newId = (new Date()).valueOf();
                                let t = myForm_cbanc.getSelect('n_tipocta');
                                if (_option === 'nuevo') {
                                    myGridcbanc.addRow(newId, cocliente + ',' + myForm_cbanc.getItemValue('n_tipocta') + ',' + myForm_cbanc.getItemValue('nro_cta') + ',' +
                                        myForm_cbanc.getItemValue('cta_stado') + ',' + cobanco_s + ',' + copais_s + ',' + res.fe_reg + ',' + myForm_cbanc.getItemValue('n_banco') + ',' +
                                        myForm_cbanc.getItemValue('pais_banco') + ',' + t.options[t.selectedIndex].text + ',' + res.codigo);
                                } else {
                                    myGridcbanc.cells(sel_cbancid, 1).setValue(myForm_cbanc.getItemValue('n_tipocta')),
                                        myGridcbanc.cells(sel_cbancid, 2).setValue(myForm_cbanc.getItemValue('nro_cta')),
                                        myGridcbanc.cells(sel_cbancid, 3).setValue(myForm_cbanc.getItemValue('cta_stado')),
                                        myGridcbanc.cells(sel_cbancid, 4).setValue(cobanco_s),
                                        myGridcbanc.cells(sel_cbancid, 5).setValue(copais_s),
                                        myGridcbanc.cells(sel_cbancid, 7).setValue(myForm_cbanc.getItemValue('n_banco')),
                                        myGridcbanc.cells(sel_cbancid, 8).setValue(myForm_cbanc.getItemValue('pais_banco')),
                                        myGridcbanc.cells(sel_cbancid, 9).setValue(t.options[t.selectedIndex].text),
                                        myGridcbanc.setRowTextStyle(sel_cbancid, myForm_cbanc.getItemValue('cta_stado') === 'Retirado' ? "text-decoration: line-through;" : "text-decoration: none;"),
                                        myGridcbanc.clearSelection(), sel_cbancid = undefined, sel_cbanc = {};
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
                    f_cleam_cbanc(sel_cbanc, 'cancel'), myForm_cbanc.disableItem('b_edit'), myForm_cbanc.disableItem('b_save');
                    break;
            }
        });
        myGridcbanc = myLayou_cbanc.cells("a").attachGrid();
        myGridcbanc.setHeader("coCliente,Tipo_cta,Numero,Estado,Banco,Pais,Fe.Reg,Nom.Bnaco,Nom.Pais,Nom.Tipo,Coseq");
        myGridcbanc.setColTypes("ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro");
        myGridcbanc.setInitWidthsP("0,0,30,20,0,0,0,30,10,10,0");
        myGridcbanc.setColumnIds("co_catalo,co_tipo,numero,estado,cobanco,copais,fereg,n_banco,n_pais,n_tipo,coseq");
        myGridcbanc.init();
        ([0, 1, 4, 6, 5, 10]).forEach((elem) => {
            myGridcbanc.setColumnHidden(elem, true);
        });
        myLayou_cbanc.cells("a").progressOn();
        myGridcbanc.load(BASE_URL + 'MA010102/cuentas/' + cocliente);
        myLayou_cbanc.cells("a").progressOff();
        myGridcbanc.attachEvent("onRowSelect", function (rId, ind) {
            sel_cbanc = myGridcbanc.getRowData(rId); sel_cbancid = rId, co_seq = sel_cbanc.coseq,
                f_cleam_cbanc(sel_cbanc, 'select'); console.log(sel_cbanc);
        });
        _txtgrid(myGridcbanc, 3);
    } else {
        no_select_client(myLayou_cbanc, 's_cuentas');
    }
};

f_cleam_cbanc = (sel_, op) => {
    myForm_cbanc.setItemValue('n_banco', sel_.n_banco),
        myForm_cbanc.setItemValue('pais_banco', sel_.n_pais),
        myForm_cbanc.setItemValue('n_tipocta', sel_.co_tipo),
        myForm_cbanc.setItemValue('nro_cta', sel_.numero),
        myForm_cbanc.setItemValue('cta_freg', sel_.fereg),
        myForm_cbanc.setItemValue('cta_stado', sel_.estado);

    switch (op) {
        case 'cancel':
            myForm_cbanc.setItemValue('titleform', 'Seleccione una Cuenta '), myForm_cbanc.disableItem('_b_banco');
            break;
        case 'select':
            f_act_form_cbanc('disabled'), myForm_cbanc.disableItem('n_tipocta'), myForm_cbanc.enableItem('b_add'), myForm_cbanc.enableItem('b_edit'), myForm_cbanc.setItemValue('titleform', 'Visualizando ' + sel_.n_banco);
            break;
        case 'edit':
            f_act_form_cbanc(), myForm_cbanc.enableItem('_b_banco'), myForm_cbanc.setItemValue('titleform', 'Editando ' + sel_.n_banco);
            break;
        case 'nuevo':
            f_act_form_cbanc(), myForm_cbanc.setItemValue('titleform', 'Nueva Cuenta Bancaria');
            break;
        default:
            myForm_cbanc.disableItem('b_save'), myForm_cbanc.disableItem('b_cancel'), myForm_cbanc.enableItem('b_add');
            break;
    }
}

f_act_form_cbanc = (stado) => {
    switch (stado) {
        case 'disabled':
            (['n_banco', 'pais_banco', 'cta_freg']).forEach((elem) => {
                myForm_cbanc.setReadonly(elem, true);
            }), (['b_save', 'b_cancel', '_b_cta', 'cta_stado']).forEach((elem) => {
                myForm_cbanc.disableItem(elem);
            });
            break;
        default:
            (['nro_cta', 'cta_freg']).forEach((elem) => {
                myForm_cbanc.setReadonly(elem, false);
            }),
                (['b_save', 'n_tipocta', 'b_cancel', '_b_cta', '_b_banco', 'cta_stado']).forEach((elem) => {
                    myForm_cbanc.enableItem(elem);
                });
            break;
    }

}

f_s_doc = () => {
    var allfiles = [];
    myLayou_doc = mySidebar.cells("s_documento").attachLayout('1C'); console.log(cocliente);
    if (cocliente > 0) {
        myLayou_doc.cells("a").hideHeader();
        myLayou_doc.cells("a").attachHTMLString('<div id="vault"  style="width : 100%; height:100%;" ><div>');
        let conf = {
            scaleFactor: 4, uploader: {
                target: BASE_URL + "MA010102/documentosup/" + cocliente + '/' + usrJson.empresa
            }, mode: "grid", customScroll: true
        };
        var vault = new dhx.Vault("vault", conf);
        vault.toolbar.data.remove("remove-all", { icon: "far fa-trash-alt" });
        myLayou_doc.cells("a").progressOn();
        vault.events.on("BeforeRemove", function (file) {
            $.post(BASE_URL + "MA010102/docu_clear/" + cocliente + '/' + usrJson.empresa + '/' + file.name, {}, (res) => {
                if (parseFloat(res.codigo) > 0) {
                    var filtered = allfiles.filter(function (item) {
                        return item.name !== file.name;
                    });
                    allfiles = filtered;
                    f_add_remofilebbdd('remove', cocliente, file.name, '0');
                    Swal.fire('Bien!', 'Documento borrado OK!...', 'success');
                    return true;
                } else {
                    Swal.fire({ type: 'error', title: 'Error al borrar el archivo...', text: res.message });
                    return false;
                }

            });
        });

        vault.toolbar.data.add({ type: "iconButton", id: "carrousel", tooltip: "Visualizar todas las imagenes", icon: "fas fa-external-link-alt" }, 2);

        vault.toolbar.events.on("click", function (id) {
            if (id === "carrousel") {
                if (allfiles.length > 0) {
                    Windfiles = new dhtmlXWindows();
                    Windfiles_id = Windfiles.createWindow("wfiles", 0, 0, 1020, 580);
                    Windfiles.window("wfiles").setText("Visualización de Imagenes [jpg,png,bmp]");
                    Windfiles.window("wfiles").setModal(true);
                    Windfiles.window("wfiles").center();
                    myCarouselFile = Windfiles.window("wfiles").attachCarousel(); //{ offset_item: 20, item_width: 288, item_height: 338 }
                    (allfiles).forEach((file) => {
                        var ext_ = ((file.name).substr(-4)).split(".");
                        if (ext_[1] == 'jpg' || ext_[1] == 'png' || ext_[1] == 'bmp') {
                            var id = myCarouselFile.addCell();
                            myCarouselFile.cells(id).attachHTMLString("<div style='position: relative; left: 0px; top: 0px; overflow: auto; width: 100%; height: 100%;'>" +
                                "<img id='" + file.name + "' src='" + file.preview + "' style='max-width:100%; height:auto;'></div>");//ondragstart='return false;
                        }
                    });
                } else {
                    dhx.message({
                        text: "No hay documentos que mostrar", css: "dhx-error", expire: 4000
                    });
                }
            }
        });

        vault.events.on("beforeAdd", function (item) {
            var _cc = 0;
            for (var i = 0; i < allfiles.length; i++) {
                if (allfiles[i].name == item.file.name) { _cc = 1; break; }
            }
            var extension = item.file.name.substr(-3, 3);
            predicate = _cc == 1 ? false : extension === 'xls' ? false : true;
            if (!predicate) {
                dhx.message({
                    text: "Documento Invalido..<br/> (1) Solo se permiten Imagenes <br/>(2) Ya existe otro archico con el mismo nombre", css: "dhx-error", expire: 8000
                });
            }
            if (predicate) {
                var elem = {};
                elem.name = item.file.name;
                elem.preview = '/assets/images/ma010102/' + cocliente + '/' + item.file.name;
                let num = allfiles.length === undefined ? 1 : parseInt(allfiles.length);
                allfiles[num + ''] = elem;
                f_add_remofilebbdd('nuevo', cocliente, elem.name, extension);
            }
            return predicate;
        });

        $.get(BASE_URL + "MA010102/documentos/" + cocliente + '/' + usrJson.empresa, {}, (res) => {
            if (res.path_server === 'fail') {
                Swal.fire({ type: 'error', title: 'Error al crear la carpeta en el servidor de archivos 248...', text: res.message });
            } else {
                dhtmlx.message("Sincronizado completo!");
            }
            vault.data.parse(res.files), allfiles = res.files;
            myLayou_doc.cells("a").progressOff();
        });
    } else {
        no_select_client(myLayou_doc, 's_documento');
    }
}


f_add_remofilebbdd = (xoption, cocliente, xfile, xfilext) => {
    let p = { xoption: xoption, xemp: usrJson.empresa, xcliente: cocliente, xusuareg: usrJson.codigo, xfile: xfile, xfilext: xfilext };
    $.post(BASE_URL + "MA010102/add_filebbdd", p, function (res) {
        if (parseFloat(res.codigo) == 0) {
            Swal.fire({ type: 'error', title: 'Algo salió mal..', text: res.message });
        }
    }, "json");
}

f_s_antecedentes = () => {
    myLayou_antec = mySidebar.cells("s_antecedente").attachLayout('1C');
    let _option = '0';
    if (cocliente > 0) {
        myLayou_antec = mySidebar.cells("s_antecedente").attachLayout('2U');
        myLayou_antec.cells("a").hideHeader();
        myLayou_antec.cells("b").hideHeader();
        myLayou_antec.cells("a").setWidth(660);
        myLayou_antec.setSeparatorSize(0, 0);
        myForm_antc = myLayou_antec.cells("b").attachForm(f_antecedentes);
        myForm_antc.attachEvent("onValidateError", function (name, value, result) {
            result ? '' : Swal.fire({ type: 'error', title: 'Alerta...', text: 'Debe ingresar solo numeros en los campos en rojo' });
        });
        myForm_antc.attachEvent("onButtonClick", function (name) {
            switch (name) {
                case 'b_add': sel_antid = undefined, _option = 'nuevo', sel_ant = {}, myGridant.clearSelection(), f_cleam_fant(sel_ant, 'nuevo'),
                    myForm_antc.disableItem('b_add'), myForm_antc.disableItem('b_edit'), myForm_antc.enableItem('b_save'), myForm_antc.enableItem('b_cancel');
                    break;
                case 'b_edit':
                    _option = 'edit', f_cleam_fant(sel_ant, 'edit'), myForm_antc.disableItem('b_edit'), myForm_antc.disableItem('b_add'),
                        myForm_antc.enableItem('b_save'), myForm_antc.enableItem('b_cancel');
                    break;
                case 'b_save':
                    let p = {
                        xoption: _option, x_cliente: cocliente, xemp: usrJson.empresa, xusureg: usrJson.codigo, xgarante: sel_ant.cod_ant,
                        xant_detalle: myForm_antc.getItemValue('ant_detalle'), xant_satisfa: myForm_antc.getItemValue('ant_satisfa'),
                        xant_referencia: myForm_antc.getItemValue('ant_referencia')
                    };
                    $.post(BASE_URL + "MA010102/grabantece", p, function (res) {
                        if (parseFloat(res.codigo) > 0) {
                            let newId = (new Date()).valueOf();
                            if (_option === 'nuevo') {
                                myGridant.addRow(newId, res.codigo + ',' + myForm_antc.getItemValue('ant_detalle') + ',' + myForm_antc.getItemValue('ant_satisfa') + ',' + myForm_antc.getItemValue('ant_referencia') + ',' +
                                    usrJson.codigo + ',' + res.fecha + ',' + usrJson.empresa + ',' + cocliente + ',' + usrJson.alias);
                            } else {
                                myGridant.cells(sel_antid, 1).setValue(myForm_antc.getItemValue('ant_detalle'));
                                myGridant.cells(sel_antid, 2).setValue(myForm_antc.getItemValue('ant_satisfa'));
                                myGridant.cells(sel_antid, 3).setValue(myForm_antc.getItemValue('ant_referencia'));
                                myGridant.clearSelection(), sel_antid = undefined, sel_ant = {};
                            }
                            myForm_antc.setItemValue('titleform', 'Seleccione Giro Negocio'), f_cleam_fant({}, 'save');
                            Swal.fire('Bien!', res.message, 'success');
                        } else {
                            Swal.fire({ type: 'error', title: 'Algo salió mal...', text: res.message });
                        }
                    }, "json");
                    break;
                case 'b_cancel': sel_antid = undefined, _option = '0', myForm_antc.enableItem('b_add'), sel_ant = {},
                    myGridant.clearSelection(), f_cleam_fant(sel_ant, 'cancel'), myForm_antc.disableItem('b_edit'), myForm_antc.disableItem('b_save');
                    break;
            }
        });

        myGridant = myLayou_antec.cells("a").attachGrid();
        myGridant.setHeader("Codigoant,Observaciones,Rng Satisf.,Referencia,Usuario,F.Registro,empre,catalogo,U.Registra");
        myGridant.setColTypes("ro,ro,ro,ro,ro,ro,ro,ro,ro");
        myGridant.setInitWidthsP("10,70,30,15,20,15,10,10,10");
        myGridant.setColAlign("left,left,left,center,center,center,left,left,left,left");
        myGridant.setColumnIds("cod_ant,de_obser,rng_satisf,de_refere,co_usuario,fe_regis,ant_emp,ant_catalogo,usuareg");
        myGridant.init();
        myGridant.setColumnHidden(0, true), myGridant.setColumnHidden(4, true), myGridant.setColumnHidden(6, true), myGridant.setColumnHidden(7, true);// myGridant.setColumnHidden(6, true);
        myLayou_antec.cells("a").progressOn();
        myGridant.load(BASE_URL + 'MA010102/data_antec/' + cocliente + '/' + usrJson.empresa, function () { myLayou_antec.cells("a").progressOff(); });
        myGridant.attachEvent("onRowSelect", function (rId, ind) {
            sel_ant = myGridant.getRowData(rId); sel_antid = rId;
            f_cleam_fant(sel_ant, 'select');
        });
    } else {
        no_select_client(myLayou_antec, 's_antecedente');
    }
}
f_cleam_fant = (sel_ant, op) => {
    myForm_antc.setItemValue('ant_detalle', sel_ant.de_obser);
    myForm_antc.setItemValue('ant_satisfa', sel_ant.rng_satisf);
    myForm_antc.setItemValue('ant_referencia', sel_ant.de_refere);
    myForm_antc.setItemValue('ant_usua', sel_ant.usuareg);
    myForm_antc.setItemValue('ant_fesys', sel_ant.fe_regis);
    switch (op) {
        case 'cancel':
            myForm_antc.setReadonly('ant_detalle', true), myForm_antc.setReadonly('ant_satisfa', true), myForm_antc.setReadonly('ant_referencia', true),
                myForm_antc.setItemValue('titleform', 'Seleccione un Antecedente ');
            break;
        case 'select':
            myForm_antc.setReadonly('ant_satisfa', true), myForm_antc.setReadonly('ant_referencia', true),
                myForm_antc.setReadonly('ant_detalle', true), myForm_antc.setReadonly('ant_usua', true), myForm_antc.setReadonly('ant_fesys', true), myForm_antc.enableItem('b_edit'),
                myForm_antc.setItemValue('titleform', 'Visualizando');
            break;
        case 'edit':
            myForm_antc.setReadonly('ant_detalle', false),
                myForm_antc.setReadonly('ant_satisfa', false), myForm_antc.setReadonly('ant_referencia', false);
            myForm_antc.setItemValue('titleform', 'Editando ');
            break;
        case 'nuevo':
            myForm_antc.setReadonly('ant_detalle', false), myForm_antc.setReadonly('ant_satisfa', false), myForm_antc.setReadonly('ant_referencia', false),
                myForm_antc.setReadonly('ant_usua', true), myForm_antc.setReadonly('ant_fesys', true),
                myForm_antc.setItemValue('titleform', 'Nuevo Antecedente');
            break;
        default:
            myForm_antc.disableItem('b_save'), myForm_antc.disableItem('b_cancel'), myForm_antc.enableItem('b_add');
            break;
    }
}


f_s_comunica = () => {
    myLayou_comu = mySidebar.cells("s_comunicacion").attachLayout('1C');
    let _option = '0';
    if (cocliente > 0) {
        myLayou_comu = mySidebar.cells("s_comunicacion").attachLayout('2U');
        myLayou_comu.cells("a").hideHeader();
        myLayou_comu.cells("b").hideHeader();
        myLayou_comu.cells("a").setWidth(660);
        myLayou_comu.setSeparatorSize(0, 0);
        myForm_comu = myLayou_comu.cells("b").attachForm(f_comunicacion);
        myForm_comu.attachEvent("onValidateError", function (name, value, result) {
            result ? '' : Swal.fire({ type: 'error', title: 'Alerta...', text: 'Debe ingresar solo numeros en los campos en rojo' });
        });
        myForm_comu.attachEvent("onButtonClick", function (name) {
            switch (name) {
                case 'b_add': sel_comid = undefined, _option = 'nuevo', sel_com = {}, myGridcom.clearSelection(), f_cleam_comunica(sel_com, 'nuevo'),
                    myForm_comu.disableItem('b_add'), myForm_comu.disableItem('b_edit'), myForm_comu.enableItem('b_save'), myForm_comu.enableItem('b_cancel');
                    break;
                case 'b_edit':
                    _option = 'edit', f_cleam_comunica(sel_com, 'edit'), myForm_comu.disableItem('b_edit'), myForm_comu.disableItem('b_add'),
                        myForm_comu.enableItem('b_save'), myForm_comu.enableItem('b_cancel');
                    break;
                case 'b_save':
                    let p = {
                        xoption: _option, x_cliente: cocliente, xemp: usrJson.empresa,
                        xoperador: myForm_comu.getItemValue('selc_operador'), xnumero: myForm_comu.getItemValue('num_celular'),
                        xvigente: myForm_comu.getItemValue('num_stado'), xdif: sel_com.numdif
                    };
                    $.post(BASE_URL + "MA010102/grabacomu", p, function (res) {
                        if (parseFloat(res.codigo) > 0) {
                            let newId = (new Date()).valueOf();
                            let t = myForm_comu.getSelect('selc_operador');

                            if (_option === 'nuevo') {
                                myGridcom.addRow(newId, myForm_comu.getItemValue('selc_operador') + ',' + res.codigo + ',' + myForm_comu.getItemValue('num_celular')
                                    + ',' + myForm_comu.getItemValue('num_stado') + ',' + '1' + ',' + t.options[t.selectedIndex].text);
                            } else {
                                myGridcom.cells(sel_comid, 5).setValue(t.options[t.selectedIndex].text);
                                myGridcom.cells(sel_comid, 2).setValue(myForm_comu.getItemValue('num_celular'));
                                myGridcom.cells(sel_comid, 3).setValue(myForm_comu.getItemValue('num_stado'));
                                myGridcom.setRowTextStyle(sel_comid, myForm_comu.getItemValue('num_stado') === 'Retirado' ? "text-decoration: line-through;" : "text-decoration: none;"),
                                    myGridcom.clearSelection(), sel_comid = undefined, sel_com = {};
                            }
                            myForm_comu.setItemValue('titleform', 'Seleccione Giro Negocio'), f_cleam_comunica({}, 'save');
                            Swal.fire('Bien!', res.message, 'success');
                        } else {
                            Swal.fire({ type: 'error', title: 'Algo salió mal...', text: res.message });
                        }
                    }, "json");
                    break;
                case 'b_cancel': sel_comid = undefined, _option = '0', myForm_comu.enableItem('b_add'), sel_com = {},
                    myGridcom.clearSelection(), f_cleam_comunica(sel_com, 'cancel'), myForm_comu.disableItem('b_edit'), myForm_comu.disableItem('b_save');
                    break;
            }
        });

        myGridcom = myLayou_comu.cells("a").attachGrid();
        myGridcom.setHeader("Operador,Dif,Numero,E.stado,Proridad,NOpera");
        myGridcom.setColTypes("ro,ro,ro,ro,ro,ro");
        myGridcom.setInitWidthsP("0,40,40,40,0,20");
        myGridcom.setColAlign("left,left,left,left,left,left");
        myGridcom.setColumnIds("codope,numdif,num_cel,stado,nu_priori,copera");
        myGridcom.init();
        myGridcom.setColumnHidden(0, true), myGridcom.setColumnHidden(1, true), myGridcom.setColumnHidden(4, true); //, myGridcom.setColumnHidden(7, true);// myGridant.setColumnHidden(6, true);
        myLayou_comu.cells("a").progressOn();
        myGridcom.load(BASE_URL + 'MA010102/data_comu/' + cocliente + '/' + usrJson.empresa, function () { myLayou_comu.cells("a").progressOff(); });
        myGridcom.attachEvent("onRowSelect", function (rId, ind) {
            sel_com = myGridcom.getRowData(rId); sel_comid = rId; console.log(sel_com);
            f_cleam_comunica(sel_com, 'select');
        });
        _txtgrid(myGridcom, 3);
    } else {
        no_select_client(myLayou_comu, 's_comunicacion');
    }
}


f_cleam_comunica = (sel_com, op) => {
    myForm_comu.setItemValue('selc_operador', sel_com.codope);
    myForm_comu.setItemValue('num_celular', sel_com.num_cel);
    myForm_comu.setItemValue('num_stado', sel_com.stado);
    switch (op) {
        case 'cancel':
            myForm_comu.setReadonly('ant_detalle', true), myForm_comu.setReadonly('ant_satisfa', true), myForm_comu.setReadonly('ant_referencia', true),
                myForm_comu.setItemValue('titleform', 'Seleccione un Antecedente ');
            break;
        case 'select':
            myForm_comu.disableItem('selc_operador'), myForm_comu.disableItem('num_stado'),
                myForm_comu.setReadonly('num_celular', true),
                myForm_comu.enableItem('b_edit'),
                myForm_comu.setItemValue('titleform', 'Visualizando');
            break;
        case 'edit':
            myForm_comu.disableItem('selc_operador'), myForm_comu.enableItem('num_stado'),
                myForm_comu.setReadonly('num_celular', false),
                myForm_comu.setItemValue('titleform', 'Editando ');
            break;
        case 'nuevo':
            myForm_comu.disableItem('selc_operador'), myForm_comu.enableItem('num_stado'),
                myForm_comu.setReadonly('num_celular', false),
                myForm_comu.setItemValue('titleform', 'Nuevo Celular/Fijo');
            break;
        default:
            myForm_comu.disableItem('b_save'), myForm_comu.disableItem('b_cancel'), myForm_comu.enableItem('b_add');
            break;
    }
}


no_select_client = (Layout, sidetab) => {
    Layout = mySidebar.cells(sidetab).attachLayout('1C');
    if (sidetab == 's_datos') {
        Layout.cells("a").attachHTMLString('<div class="nomcliente" style="text-align: center;  text-align:center; padding-bottom: 3%;"> BUSQUE UN ' + label_tipo.toUpperCase() + ', POR FAVOR...</div><div id="b_nuewclie">Genere uno nuevo Aquí </div><div  id="imgcargue"    style="position: absolute;     top: 20; right: 10; bottom: 10; left: 10;              background: url(/assets/images/otros/icono-buscar-datos-nuevo.jpg)        no-repeat     center;         -webkit-background-size: cover;        -moz-background-size: cover;        -o-background-size: cover;         background-size: auto;"></div>');
        $("#b_nuewclie").click(function () {
            if (sidetab == 's_datos') {
                myLaouy_Dat = mySidebar.cells("s_datos").attachLayout('1C');
                myForm.setItemValue('b_cliente', 'Nuevo Registro'), carga_form_cliente(0);
            }
        });
    } else {
        Layout.cells("a").attachHTMLString('<div class="nomcliente" style="text-align: center;  text-align:center; padding-bottom: 3%;"> BUSQUE UN ' + label_tipo.toUpperCase() + ', POR FAVOR...</div><div  id="imgcargue"    style="position: absolute;     top: 20; right: 10; bottom: 10; left: 10;              background: url(/assets/images/otros/icono-buscar-datos-nuevo.jpg)        no-repeat     center;         -webkit-background-size: cover;        -moz-background-size: cover;        -o-background-size: cover;         background-size: auto;"></div>');
    }
    Layout.cells("a").hideHeader();
}

