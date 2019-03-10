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
        f_s_datos();
        var data = myGrid.getRowData(myGrid.getSelectedRowId());
        Wind_.window("wbusq").close();
        myForm.setItemValue('b_cliente', data.codigo + ' ' + data.nom_comer);
        myForm.setItemValue('b_estado', data.vigencia);
        myForm.setItemValue('b_asignado', data.asignado);
        //codcliente = data.codigo;
        p = {emp: usrJson.empresa, codigo: data.codigo};
        $.post(BASE_URL + "MA010102/list_datos_cliente", p, function (res) {
            console.log(res[0]);
            json_select = res[0], cargar_datos_clie(json_select);
            mySidebar.cells("s_datos").progressOff();
        }, "json");

    });
};

function cargar_datos_clie(data) {
    myToolbardatos.enableItem('__edit');
    if (data.CO_CLIENTE > 0) {
        myFormdatos.checkItem('st_cliente'), myFormdatos.checkItem('st_personales'), myFormdatos.enableItem('st_cliente'), myFormdatos.enableItem('st_personales'), myFormdatos.setReadonly('st_cliente', true), myFormdatos.setReadonly('st_personales', true);
    } else {
        //myFormdatos.uncheckItem('st_cliente'), myFormdatos.uncheckItem('st_personales');
        myFormdatos.uncheckItem('st_cliente'), myFormdatos.checkItem('st_personales'), myFormdatos.enableItem('st_cliente'), myFormdatos.enableItem('st_personales'), myFormdatos.setReadonly('st_cliente', true), myFormdatos.setReadonly('st_personales', true);
    }
    cocliente = data.CO_CLIENTE;
    co_cata_entidad = data.CO_CATALOGO_ENTIDAD;
    permiso_cataedit = data.ST_PERMISO_EDITAR_CATA_ENTI;
    co_listadopre = data.CO_LISTADO_PRECIOS;
    co_seri_listado = data.CO_SERIE_LISTADO;

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
    myFormdatos.setItemValue('_fredcata', data.FE_REGISTRO);
    myFormdatos.setItemValue('_fregcliente', data.FE_REGISTRO_CLIENTE);
    myFormdatos.setItemValue('_fretiro', data.FE_RETIRO_CLIENTE);
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
        Swal.fire({type: 'warning', text: 'Ingrese un texto para que la busqueda sea óptima', showConfirmButton: false, timer: 1500});
    }
};

function style(name, value) {
    if (name === 'b_cliente')
        return "<div class='nomcliente'>" + value + "</div>";
    else
        return "<div class='s_estado'>" + value + "</div>";
}

onselect_sidebar = (id, lastId) => {

    switch (id) {
        case 's_datos':
            f_s_datos();
            break;
        case 's_direccion':
            null; //f_s_direccion();
            break;
        case 's_giro':
            null; //   f_s_giro();
            break;
        case 's_garante' :
            null; // f_s_garante();
            break;
        default:
            null;
            break;
    }

    return true;
};

f_s_datos = () => {
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
                var p = {dni: myFormdatos.getItemValue('_nudocumento')};
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
            case 'b_clientecorp' :
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

    }
    );



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
};

ontollbarclic = async (id) => {
    switch (id) {
        case  '__lincredito' :
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
                    case 'bc_save':
                        let p = {ucliente: parseInt(cocliente), u_autoriza: parseInt(usrJson.codigo), emp: parseInt(usrJson.empresa), fv: parseInt(myFormLC.getItemValue('_fuerzavta')), cmone: parseInt(myFormLC.getItemValue('_clmoneda')), stper: myFormdatos.isItemChecked('__stcredperm') ? 'S' : 'N', obs:myFormLC.getItemValue('__obscredito')   , mont: parseFloat(myFormLC.getItemValue('__nucredito'))}
                        $.post(BASE_URL + "MA010102/savelinea", p, function (res) {
                            if (parseFloat(res.codigo) == '0') {
                                Swal.fire('Bien!', res.message, 'success');
                                Windln_.window("wbusln").close();
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
                const out = {seleccion: arr_out};
                console.log(out);
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
            switch (data) {
                case '1':
                    myFormdatos.getItemValue('_nudocumento').length !== 8 ? Swal.fire({type: 'error', title: 'Dni Incorrecto...', text: 'Debe tener 8 digitos'}) : grabar_datos();
                    break;
                case '6':
                    myFormdatos.getItemValue('_nudocumento').length !== 11 ? Swal.fire({type: 'error', title: 'RUC Incorrecto...', text: 'Debe tener 11 digitos'}) : grabar_datos();
                    break;
                default:
                    null;
                    break;
            }

            break;
        case '__edit':

            var output = await IniciarFormularioSeguridad(58, mainLayout);
            if (JSON.parse(output).result === 'S') {
                permiso_cataedit = 'S', form_edit_ini(false, 'E'), myToolbardatos.enableItem('__cancel'), myToolbardatos.enableItem('__lincredito');
                myToolbardatos.enableItem('__save'), myFormdatos.enableItem('b_dniservice');
                if (codcliente === 0 || codcliente === null || codcliente === undefined) {
                    myFormdatos.setReadonly('st_cliente', false);
                }
            }

            break;
        default:
            null;
            break;
    }
};

grabar_datos = () => {
    let  p = {st_permiso_editar_cata_enti: permiso_cataedit, x_empresa: usrJson.empresa, x_alias: usrJson.alias, x_co_catalogo_entidad: co_cata_entidad, x_de_razon_social: myFormdatos.getItemValue('_razsocial'), x_nu_documento: myFormdatos.getItemValue('_nudocumento'),
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
            myToolbardatos.disableItem('__save'), myToolbardatos.enableItem('__edit'), myToolbardatos.disableItem('__cancel'), myForm.setItemValue('b_estado', res.estado), myForm.setItemValue('b_cliente', res.nombre), myFormdatos.setItemValue('_fredcata', res.fecha), myFormdatos.disableItem('b_dniservice');
            Swal.fire('Bien!', res.message, 'success');
        }

    }, "json");
};

function form_edit_ini(bollean, stado) {
    (['_nudocumento', '_razsocial', '_nomcomer', '_apepat', '_apemat', '_nombres']).forEach((elm) => {
        myFormdatos.setReadonly(elm, bollean);
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
    // }
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
    myFormdatos.setItemValue('_tipobanco', 0);
    myFormdatos.setItemValue('_vigencia', 'Vigente');

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
    var p = {emp: usrJson.empresa, codigo: dataview.get(id).CO_DIRECCION_EMPRESA, vigencia: new_esta};
    $.post(BASE_URL + "MA010104/c_estado", p, function (res) {

        if (res.state !== 'error') {
            if (new_esta.toUpperCase() === 'PRINCIPAL') {
                myDataView.clearAll();
                myDataView.load(BASE_URL + 'MA010104/cargardata/' + usrJson.empresa, "json");
                myToolBar.disableItem('__principal');
            } else {
                dataview.set(id, {$selected: true, id: id, CO_DIRECCION_EMPRESA: dataview.get(id).CO_DIRECCION_EMPRESA, DE_DIRECCION: dataview.get(id).DE_DIRECCION, NUBIGEO: dataview.get(id).NUBIGEO, DE_DIRECCION_CORTA: dataview.get(id).DE_DIRECCION_CORTA,
                    NPRINCIPAL: dataview.get(id).ST_PRINCIPAL === 'S' ? 'PRINCIPAL' : ' ', CO_UBIGEO: dataview.get(id).CO_UBIGEO, ST_PROPIO: dataview.get(id).ST_PROPIO, ES_VIGENCIA: new_esta, ST_PRINCIPAL: dataview.get(id).ST_PRINCIPAL
                });
                onSelectAntes(id, dataview, tollbar, estadook);
            }
            Swal.fire('Bien!', res.message, 'success');
        } else
            Swal.fire({type: 'error', title: 'Algo salió mal...', text: 'No se pudoActualizar sus cambios  :' + res.message});
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
        case '__buscar' :            //var W_b_respo = new dhtmlXWindows();
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
    var p = {accion: acci, emp: usrJson.empresa, codigo: cod, direc: dir, dcorta: cor, stpropio: tpro, ubigeo: ubi};
    $.post(BASE_URL + "MA010104/update", p, function (res) {
        if (acci === 'nuevo') {
            if (res.state === 'success') {
                myDataView.clearAll();
                myDataView.load(BASE_URL + 'MA010104/cargardata/' + usrJson.empresa, "json");
            }
        } else {
            if (res.state === 'success') {
                myDataView.set(myDataView.getSelected(), {$selected: true, id: myDataView.getSelected(), CO_DIRECCION_EMPRESA: cod, DE_DIRECCION: dir, NUBIGEO: nubi, DE_DIRECCION_CORTA: cor,
                    NPRINCIPAL: nprin, CO_UBIGEO: ubi, ST_PROPIO: tpro, ES_VIGENCIA: myDataView.get(myDataView.getSelected()).ES_VIGENCIA, ST_PRINCIPAL: st_prin
                });
                onSelectAntes(myDataView.getSelected(), myDataView, myToolBar, estadook);
                Swal.fire('Bien!', res.message, 'success');
            }
        }
        if (res.state !== 'success')
            Swal.fire({type: 'error', title: 'Algo salió mal...', text: 'Error :' + res.message});
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


function  photo_usu(name, value) {
    switch (name) {
        case "up_imgperfil" :
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
        Swal.fire({type: 'error', title: 'Archivo Incorrecto...', text: 'Esto no es una imagen', footer: '<a href="#">*** Tipos permitidos [gif, png, jpg, jpeg]</a>'});
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
    var p = {emp: JSON.parse(localStorage.getItem('usrjson')).empresa};
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
            Swal.fire({type: 'error', title: 'Algo salió mal...', text: 'No se pudo cargar su imagen de Perfil Error :' + res.error, footer: '<a href="#">suba una nueva imagen, si el problema continua, comuníquese con el area de Sistemas</a>'});
    }, "json");
    var json = [{'id_form': '#eventFormemp', datos: {'input_file': '#fileemp', 'div_content': 'file_name', 'ruta': 'ma010104/' + JSON.parse(localStorage.getItem('usrjson')).empresa + '/' + JSON.parse(localStorage.getItem('usrjson')).empresa + '_logo.png', 'img_id': '#emp_img_'}}];
    (json).forEach((elem) => {
        $(elem.id_form).submit(function (e) {
            e.preventDefault();
            Swal.fire({title: 'Subiendo Imagen!', html: '<h4>Un momento porfavor</h4>', timer: 0, allowOutsideClick: false, onBeforeOpen: () => {
                    Swal.showLoading();
                }});
            var fd = new FormData(); //objecto FormData para estrucutra los campos enviados en el formulario
            var file = $(elem.datos.input_file).get(0).files[0]; //console.log(file);
            fd.append(elem.datos.div_content, file, elem.datos.ruta);
            $.ajax({
                url: BASE_URL + 'MA010104/upload', data: fd, processData: false, cache: false, contentType: false, type: 'POST',
                success: function (data) { //console.log('data');
                    if (data.state !== 'success')
                        Swal.fire({type: 'error', title: 'Algo paso...', text: data.error, footer: '<a href="#">El peso maximo es 2MB</a>'});//                    dhtmlx.message({                        title: "Close",                    type: "alert-warning",                    text: "You can't close this window!",                       callback: function () {                          dhtmlx.alert("Test alert");                     }                  });
                    else
                        Swal.fire({title: 'Conforme!', text: 'Imagen subida.', type: 'success', allowOutsideClick: false, confirmButtonText: 'Ingresar al Sistema'});
                }
            }, 'json');
        });
    });
};

