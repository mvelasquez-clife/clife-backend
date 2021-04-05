Inicio = () => {
    /*INFO https://api.migoperu.pe/ CONSULTA RUC - DNI
     * USUARIO : jtipismana@corporacionlife.com.pe
     * PASSWORD : Corporacion$321
     **** PROGRAMAS PARA LA CONFIGURACION DE LA IMPRESORA :
     *****QZ PRINT VER 2.0.11
     ***** JDK 8+
     * MODIFICAR EL NOMBRE DE LA IMPRESORA EN LA BBDD-SG_USUA_M (reemplazar ' ' con '+')
     * */

    /*var API_KEY = 'A3piMFPWxaLnui4YG5X7ghbkOpFqfzOx0tJM-K4NyN8';
     var optionsprintnode = {
     context: null, success: function (response, headers, xhrObject) {
     console.log("success", response, headers);
     }, error: function (response, headers, xhrObject) {
     console.log("error", response, headers);
     }, complete: function (response) {
     console.log("%d %s %s returned %db in %dms", response.xhr.status, response.reqMethod, response.reqUrl, response.xhr.responseText.length, response.getDuration());
     }, timeout: function (url, duration) {
     console.log("timeout", url, duration)
     }, timeoutDuration: 3000
     };
     
     var api = new PrintNode.HTTP(new PrintNode.HTTP.ApiKey(API_KEY), optionsprintnode);*/
    var ruc_ref = '', ver__ = ' 05082020.1', ST_DETRA_D, ST_DETRACCION, nu_uit, total_dir = "", CO_DIRECC, total_zona = "", total_ref = "", st_req = 'N', dhxGridesc1, plani_borrar, st_contingencia = 'N', plan_ss, num_carac_dni, periodo_s_pla = 0, parents = [], tipo_doc_selec, myLayoext, dhxW_ex, dhxGridext, myForm_detarq, serie_arqu_nvo, co_arqu_nvo, myForm_b_arqe, dhxWcaja, myLayoarq, dhxGridarqex, layoutdesc_arqex, myToolbar_arq, dhxGrid_arq, myForm_b_arq, layoutdesc_arq, dhxGridarq, myLayou__11, tabbar_rep, myLayou__12, myLayou__13, valuenro = 0, gridr12, printer, ruta_print, WSPrint, det_cata, form_nota_credito, st_icbper, s_icbper_, s_icbper, dhxGrid_Pagos, for_num = 0, myForm_c, _a = 0, _b = 0, _c = 0, num_rowpago = 0, cadena_gridpagos, dhxGridstock, pago_defecto, n_vende = '', suma_pagos, cod_prod_stock, form_sto, v_subtotal, co_vendedor_ini, myRibbon_mail, myLayoutpla, myform_regcli, dhxWins_OTRO, myLayoutstock, dhxWinstipent, dhxWin_OTR, layout_reg_clie, dhxWinsREGCLI, cod_promo_select, OTROCONTA, co_pto_vent, url_pdf = '', doc_iden, dhxWin3_mail, ruta_descarga, n_clien, tipo_doc_selec, alor_desctofinal = 0, devo_efectivo = 'N', dhxWin_mail2, cel_cliente, empresa, emp, co_hash = '', timerset_o, ruc_empresa, estado_c = '', num_itentos, nom_cli_selec, ruc_dni_selec, dhxLayout_mail, myform_mail, email_selec, confir_mail, env_conf_ema, Layoutmarca, DESC_LT = 0, signaturevalue, sub_impri, dire_ap_sunat = '', CO_TIP_PER, ref_doc = '', nom_ref = '', ref_monto = '', por_fnac, layoD, nom_desc, fecha_fn = '01-01-1900', nom_desc, tip_desc = '0', desc_fini, desc_ffin, por_pri_com, layout_reg_cli, INDIC, indica_tipo, total_n, continua, mes, anho, im_sub_igv, p_bonu, im_sub_total, OBS_NC, p_igv, valida, countclick = 0, cod_pedido_sele, OBSER, HASH, observ_venta, tipo_pago_copia, dhxGrid_selectbono, st_flete = 'N', res_g_fle = 0, subflete_ = 0, total_nota = '0', cant_efec_pagado = '0', cod_concepto, nu_ncredito = '0.00', arra_detalle_nota = "", arra_detalle_1 = "", ycotipodocadministr = '153', CO_VENDEDOR_NOTA = '0', FE_REG_NOTA = '0', DE_NOM_CLI_NOTA = '', st_nota = 'N', nota_cre = '', salotarjeta = '0.00', saldo_vuelto = '0.00', saldoefectivo = '0.00', IM_TARJET, cod_dni_promo, cod_nom_promo, subtotal_n, v_igv_no, SERIE_NOTA, NUM_CORR_NOTA, NUM_NOTA, dhxGridcuponera, filas, es_vigencia_planilla, dhxGridtepv, fecha1, mygridrepo, start_date, end_date, IM_DEPOSITO_TOTAL, myLayoutpla_r, im_depo_pla_liqui, im_total_pla_liq, co_planilla_liqui, co_doc_borrar = '0', dhxWinpla_l, cod_banco_liquida = '01', cta_cte_liquida = '194-1573143-0-32', nom_listaprecios, myform_addrow, myform_addrow_p, co_tipo_promo, sumador_promo = '0', co_priori, dhxGrid_pipe, dhxGridtipopromo, dhxGridtepv_d, myLayoutplav, st_igv, layoutP, myLayout_caja, myForm_b, myForm_a, myForm_c, myForm_d, RESPONSABLE, dhxWinsfadd2, myToolbar, dhxWinaddrows3, des_direcc, myLayout, period, st_cheq, valor_efectivo = '0', res_g, cadena_pago, cod_banco = '0', cta_cte = '.',
        stock, co_pto_venta = 0, cant_items_ = 0, flete_, cod_clie_copia = '0', direc = ".", t_d_admin, co_pto_fact, YDIR_SUNAT, igv, id_numrow, nom_proeliminar, length_cli, cod_cliente, cod_direcc = '0', tipo_cobro = '0', suma, v_igvs, sumt = '0.00', co_comprobante_doc, co_planilla_cobranza, listado_precios, serie_listado, num_filas, im_total_fila, igv_afecto_x_fila, im_dscto_x_producto, cadena_doc, detalle,
        value_radio = '0', v_credito_disponible = '0', st_che_cred = 'N', clase = '0', f_ven_doc, co_vendedor = '0', arra_detalle, arra_detalle_1, doc_manual, st_manual = 'N', tabbar, entreg_pago, alto, per = '0', b_plan, valor_pto_bonus, num_pedido, co_num_pedi_select, total = '0.00', saldo = '0.00', cod, im_entrega = 0, co_promo_prod,
        selec_afec_igv = 0, suma_g = 0, suma_desc = 0, suma_sin_desc = 0, tipoaf_igv = "", CO_CLI_NOTA, filtro_cc, suma_boni, frow_cant_desc, TIPO_DOC_ADM_NOTA, cod_clie_selec = 0, rg_co_zn = '1', usuario, rg_co_av = '1', rg_distrito = '177150102', id_numrow = '0', man_bol, man_fac, tipo_promo, precio_promo, cod_pedido_promo, cod_cata_promo, cod_producto_select;

    carga_empresa();
    myLayougen = new dhtmlXLayoutObject(document.body, '1C');
    myLayougen.cells("a").hideHeader();
    tabbar = myLayougen.cells("a").attachTabbar();
    tabbar.addTab("a11", "Venta", null, null, true);
    tabbar.addTab("a12", "Planilla ");
    tabbar.addTab("a16", "Promociones");
    tabbar.addTab("a17", "Reportes");
    tabbar.addTab("a18", "Notas de Cr\u00e9dito");
    tabbar.addTab("a19", "Stock Minimo");
    tabbar.addTab("a110", "Arqueo Caja");
    tabbar.addTab("a111", "Extracto");
    //tabbar.addTab("a112", "Contingencia");
    tabbar.attachEvent("onTabClick", function (id, lastId) {
        switch (id) {
            case 'a110':
                carga_arqueo();
                break;
            case 'a111':
                extractor_clob();
                break;
            case 'a16':
                cod_pedido_promo = '0';
                tab_promo(id);
                break;
            case 'a12':
                countclick = 0;
                tab_promo(id);
                break;
            case 'a19':
                tab_stock(id);
                break;

            case 'a17':
                tabbar_rep = (myLayoutpla_r.cells("b")).attachTabbar();
                tabbar_rep.addTab("r11", "Por Vendedor", null, null, true), tabbar_rep.addTab("r12", "Por Lista de Precios"), tabbar_rep.addTab("r13", "Por Marca"), tabbar_rep.addTab("r14", "Clientes");
                break;
        }
        return true;
    });
    myLayout = new dhtmlXLayoutObject(tabbar.tabs("a11"), '2U');
    myForm_a = myLayout.cells("a").attachForm(formData_a);
    autocomplete_off(myForm_a);
    myLayout.setSeparatorSize(0, 0), myLayout.setSeparatorSize(1, 0);
    myForm_a.setCalendarDateFormat("fec", "%d-%m-%Y", "%d-%m-%Y");
    myLayout.cells("b").hideHeader();
    $.ajax({
        type: "POST", url: BASE_URL + 'get/datapv0101/valida_responsa/', beforeSend: function () {
        }, success: function (response) {
            var json = eval(response);
            for (var i in json) {
                var LIS_PREC = json[i].LIS_PREC, SERIE_LIS = json[i].SERIE_LIS, PTO_VTA = json[i].PTO_VTA;
                RESPONSABLE = json[i].RESPONSABLE, co_vendedor = json[i].CO_VENDEDOR, co_pto_venta = PTO_VTA, co_vendedor_ini = co_vendedor, n_vende = json[i].NVENDE;
            }
            switch (RESPONSABLE) {
                case 'S':
                    if (co_pto_venta == '5' || co_pto_venta == '4' || co_pto_venta == '6' || co_pto_venta == '8') {
                        st_igv = '1';
                    } else {
                        st_igv = '0';
                        tabbar.tabs("a16").hide("a16"), tabbar.tabs("a17").hide("a17");
                    }
                    myForm_a.setItemLabel("de_vendedor", 'VENDEDOR : ' + n_vende);
                    carga_pto_venta('151', fecha_fn, st_contingencia);
                    myLayoutpla_r = new dhtmlXLayoutObject(tabbar.tabs("a17"), '2U');
                    myLayoutpla_r.cells("a").hideHeader(), myLayoutpla_r.cells("b").hideHeader(), myLayoutpla_r.cells("a").setWidth(250);
                    myForm_breporte = myLayoutpla_r.cells("a").attachForm(form_buscar_reportes);
                    fecha1 = new Date();
                    myForm_breporte.setItemValue('f_desde', fecha1), myForm_breporte.setItemValue('f_hasta', fecha1);
                    myForm_breporte.attachEvent("onButtonClick", function (name) {
                        switch (name) {
                            case 'b_bus_repor':
                                start_date = document.getElementsByName("f_desde")[0].value, end_date = document.getElementsByName("f_hasta")[0].value;
                                var id = tabbar_rep.getActiveTab();
                                tab_reportes(start_date, end_date, id), grid_mygrid_reportes_oculto(start_date, end_date, id);
                                break;
                            case 'b_expor_excel':
                                var id = tabbar_rep.getActiveTab();
                                switch (id) {
                                    case 'r11':
                                        gridr11.toExcel('http://dhtmlxgrid.appspot.com/export/excel');
                                        break;
                                    case 'r12':
                                        gridr12.toExcel('http://dhtmlxgrid.appspot.com/export/excel');
                                        break;
                                    case 'r13':
                                        gridr13.toExcel('http://dhtmlxgrid.appspot.com/export/excel');
                                        break;
                                    case 'r14':
                                        gridr14.toExcel('http://dhtmlxgrid.appspot.com/export/excel');
                                        break;
                                }
                                break;
                            case 'b_expor_pdf':
                                window.open(BASE_URL + 'xml/pv0101/repor.php?fini=' + start_date + '&ffin=' + end_date + '&ptovta=' + co_pto_venta, 'Voucher', 'width=800,height=700');
                                break;
                        }
                    });
                    myLayout_nota = new dhtmlXLayoutObject(tabbar.tabs("a18"), '2U');
                    myLayout_nota.cells("b").hideHeader(), myLayout_nota.cells("a").setWidth(250), myLayout_nota.cells("a").setText('Formulario de B\u00FAsqueda');
                    form_nota = myLayout_nota.cells("a").attachForm(form_buscar_nota);
                    form_nota_credito = myLayout_nota.cells("b").attachForm(form_not_cred);
                    var today = new Date(), dd = today.getDate(), mm = today.getMonth() + 1;
                    var yyyy = today.getFullYear();
                    // dd = (dd < 10) ? '0' + dd : dd,mm = (mm < 10) ? '0' + mm : mm;
                    if (dd < 10) {
                        dd = '0' + dd;
                    }
                    if (mm < 10) {
                        mm = '0' + mm;
                    }
                    FE_REG_NOTA = dd + '/' + mm + '/' + yyyy;
                    form_nota_credito.setItemValue('fec_nota', FE_REG_NOTA);
                    form_nota_credito.reloadOptions('_nota_anula', BASE_URL + 'get/datapv0101/selct_nc');
                    form_nota.attachEvent("onButtonClick", function (name) {
                        switch (name) {
                            case 'b_doc_nota':
                                form_nota_credito.setItemValue('nc_obser', ''), form_nota_credito.setItemValue('_nota_anula', '06');
                                form_nota.enableItem('b_not_genera');
                                var co_doc = form_nota.getItemValue('doc_buscar_nota');
                                dhxGrid_nota.clearAll();
                                $.ajax({
                                    type: "POST", url: BASE_URL + 'get/datapv0101/carga_datos_nota/' + co_doc + '/' + co_pto_venta + '/07',
                                    beforeSend: function () {
                                        myLayout_nota.cells("b").progressOn();
                                    }, success: function (response) {
                                        form_nota_credito.uncheckItem('chek_devo_efec');
                                        if (parseInt(response) !== 0) {
                                            var json = eval(response);
                                            for (var i in json) {
                                                var DOC = json[i].DOC, FE_REG = json[i].FE_REG;
                                                CO_CLI_NOTA = json[i].CO_CLI, TIPO_DOC_ADM_NOTA = json[i].TIPO_DOC_ADM;
                                                CO_VENDEDOR_NOTA = json[i].CO_VENDEDOR_NOTA, DE_NOM_CLI_NOTA = json[i].DE_NOMBRE, NUM_NOTA = json[i].NUM_NOTA, SERIE_NOTA = json[i].SERIE_NOTA;
                                            }
                                            form_nota_credito.setItemValue('nom_clie', DE_NOM_CLI_NOTA), form_nota_credito.setItemValue('num_doc_mod', DOC), form_nota_credito.setItemValue('fec_doc_mod', FE_REG);
                                            form_nota_credito.setItemValue('num_nota_cred', NUM_NOTA);
                                            loadGridData_nota(BASE_URL + 'get/datapv0101/grilla_deta_nota/' + co_doc, true, dhxGrid_nota, myLayout_nota.cells("b"), true);
                                        } else {
                                            form_nota_credito.setItemValue('nom_clie', ''), form_nota_credito.setItemValue('num_doc_mod', ''), form_nota_credito.setItemValue('fec_doc_mod', '');
                                            form_nota_credito.setItemValue('num_nota_cred', '');
                                            dhtmlx.message({ type: "alert-error", text: "MOTIVO DE ERROR :</br> 1.LA SERIE NO PERTENECE A ESTE PUNTO DE VENTA  </br> 2.EL DOCUMENTO ESTA ANULADO</br> 2.DEBE INGRESAR LA SERIE EN MAYUSCULA", expire: 7000 });
                                        }
                                        myLayout_nota.cells("b").progressOff();
                                    }
                                });
                                break;
                            case 'b_not_genera': //total_n,subtotal_n,v_igv_no4
                                if (form_nota_credito.getItemValue('nc_obser').length == 0) {
                                    dhtmlx.message({ type: "error", text: "Ingrese una descipcion corta del motivo, Por favor...", expire: 3000 });
                                } else {
                                    NUM_NOTA = form_nota_credito.getItemValue('num_nota_cred');
                                    porciones = NUM_NOTA.split("-");
                                    NUM_CORR_NOTA = porciones[1]; // porcion1
                                    form_nota.disableItem('b_not_genera');
                                    arra_detalle_nota = "";
                                    OBS_NC = form_nota_credito.getItemValue('nc_obser');
                                    value_radio = form_nota_credito.getItemValue('_nota_anula');
                                    $.ajax({
                                        type: "POST", url: BASE_URL + "get/datapv0101/valida_nt_creada/" + form_nota_credito.getItemValue('num_doc_mod'),
                                        beforeSend: function () {
                                        }, success: function (response) {
                                            if (response == 'si') {
                                                form_nota.enableItem('b_not_genera');
                                                if (value_radio == '0' || value_radio == undefined) {
                                                    dhtmlx.message({ type: "error", text: "Seleccione una Motivo, Por favor...", expire: 3000 });
                                                } else {
                                                    var nunm_concep = value_radio.split('@');
                                                    cod_concepto = nunm_concep[0];
                                                    let nom_concepto = nunm_concep[1];
                                                    var ST_dEVO = form_nota_credito.isItemChecked('chek_devo_efec') ? 'S' : 'N';
                                                    var cadena_cab = NUM_NOTA + '@*@' + CO_CLI_NOTA + '@*@' + form_nota_credito.getItemValue('num_doc_mod') + '@*@' + NUM_CORR_NOTA + '@*@' + SERIE_NOTA + '@*@' + subtotal_n + '@*@' + v_igv_no + '@*@' + total_n + '@*@' + co_pto_venta + '@*@' + cod_concepto + '@*@' + OBS_NC + '@*@' + ST_dEVO;
                                                    var example = dhxGrid_nota.getAllItemIds();
                                                    var numbers = example.split(','), i = 0;
                                                    filas = 0;
                                                    var cadena_d = '';
                                                    arra_detalle_1 = "";
                                                    while (i < numbers.length) {
                                                        if (parseFloat(dhxGrid_nota.cells(numbers[i], 5).getValue()) > 0) {
                                                            var ult_digint = dhxGrid_nota.cells(numbers[i], 1).getValue().length;
                                                            var rang_strinnt = ult_digint - 34;
                                                            var p_un = parseFloat(dhxGrid_nota.cells(numbers[i], 6).getValue()) / parseFloat(dhxGrid_nota.cells(numbers[i], 5).getValue());
                                                            cadena_d = cadena_d + dhxGrid_nota.cells(numbers[i], 0).getValue() + '@*@' + parseFloat(dhxGrid_nota.cells(numbers[i], 5).getValue()) + '@*@' + dhxGrid_nota.cells(numbers[i], 6).getValue() + '@-@';
                                                            arra_detalle_nota = arra_detalle_nota + (((dhxGrid_nota.cells(numbers[i], 1).getValue().replace("&amp;", "&").substring(rang_strinnt).replace("&", "%26")).replace("#", "%23")).replace("'", "%27")).replace("`", "%60") + ',' + parseFloat(dhxGrid_nota.cells(numbers[i], 5).getValue()) + ' x ' + parseFloat(p_un).toFixed(2) + '(DEVOL),' + parseFloat(dhxGrid_nota.cells(numbers[i], 6).getValue()) + ';';
                                                            filas++;
                                                        }
                                                        i++;
                                                    }
                                                    if (filas !== 0) {
                                                        form_nota.disableItem('b_not_genera');
                                                        dhtmlx.confirm("Confirme registrar la Nota de Cr\u00e9dito..." + NUM_NOTA, function (result) {
                                                            if (result === Boolean(true)) {
                                                                var formData = { cadena_det: cadena_d, cadena_cab: cadena_cab, num_filas: filas, usuario: usuario }; //Array 
                                                                $.ajax({
                                                                    type: "POST", data: formData, url: BASE_URL + "xml/pv0101/genera_nota.php",
                                                                    beforeSend: function () {
                                                                        myLayout_nota.cells("b").progressOn(), myLayout_nota.cells("a").progressOn();
                                                                    }, success: function (response) {
                                                                        var hashnc, val2, ressult, val1, ressult_sunat, signaturevalue = "";
                                                                        anho = period.substring(0, 4), mes = period.substring(4, 6);
                                                                        var xresul, x_deresult;
                                                                        var json = eval(response);
                                                                        for (var i in json) {
                                                                            xresul = json[i].X_RESULT, x_deresult = json[i].X_DE_RESULT;
                                                                        }
                                                                        if (xresul == '1') {
                                                                            firma_doc(emp, period, mes, anho, NUM_NOTA, '07', '0', nom_concepto, form_nota_credito.getItemValue('num_doc_mod'), TIPO_DOC_ADM_NOTA, filas);
                                                                        } else {
                                                                            dhtmlx.message({ type: "error", text: "Se ha producido un error, vuelva a intentarlo, Por favor...", expire: 3000 });
                                                                            registra_errores(' Fail genera_nota.php ajax() ' + x_deresult, "datapo010502:finis_pasos", 'SI', NUM_NOTA);
                                                                            myLayout_nota.cells("b").progressOff(), myLayout_nota.cells("a").progressOff();
                                                                        }
                                                                    }, error: function (err) {
                                                                        myLayout_nota.cells("b").progressOff(), myLayout_nota.cells("a").progressOff();
                                                                        dhtmlx.message({ type: "error", text: "Se ha producido un error, vuelva a intentarlo, Por favor...", expire: 3000 });
                                                                        registra_errores(' Fail genera_nota:ajax() ' + JSON.stringify(err, null, 2), "datapv0101:genera_nota", 'NO', NUM_NOTA);
                                                                    }
                                                                });
                                                            } else {
                                                                form_nota.enableItem('b_not_genera');
                                                            }
                                                        });
                                                    } else {
                                                        form_nota.enableItem('b_not_genera');
                                                        dhtmlx.message({ type: "error", text: "No ha ingresado la cantidad del producto...", expire: 5000 });
                                                    }
                                                }
                                            } else {
                                                form_nota.disableItem('b_not_genera');
                                                dhtmlx.message({ type: "error", text: "El Documento : " + form_nota_credito.getItemValue('num_doc_mod') + " ya registra  una NOTA DE CREDITO ", expire: 5000 });
                                            }
                                        }
                                    });
                                }
                                break;
                        }
                    });
                    dhxGrid_nota = new dhtmlXGridObject(form_nota_credito.getContainer("myGridNota"));
                    dhxGrid_nota.setImagePath(BASE_URL + 'dhtmlx/codebase/imgs/');
                    dhxGrid_nota.setHeader("COD. PRODUCTO,NOMBRE PRODUCTO,CANT. DOC,PRE.UNI,TOT. DOC S/,CANT. NOT CRE,TOT.NOT CRE S/.", null, ["text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;"]);
                    dhxGrid_nota.setColTypes("ro,ro,ron,ron,ron,edn,ron[=(c4/c2)*c5]");
                    dhxGrid_nota.setInitWidthsP("0,40,15,0,15,15,15"); //2
                    dhxGrid_nota.setColAlign("right,left,right,right,right,right,right");
                    dhxGrid_nota.setColSorting("str,str,int,int,int,int,int");
                    dhxGrid_nota.setColumnColor(",,,,,orange,");
                    dhxGrid_nota.setNumberFormat("0,000.00", 4);
                    dhxGrid_nota.setNumberFormat("0,000.00", 3);
                    dhxGrid_nota.setNumberFormat("0,000.00", 6);
                    dhxGrid_nota.setNumberFormat("0,000.00", 5);
                    dhxGrid_nota.setColumnHidden(0, true);
                    dhxGrid_nota.setColumnHidden(3, true);
                    dhxGrid_nota.attachFooter("<div>SUB TOTAL</div>,#cspan,#cspan,#cspan,#cspan,#cspan,<div style=\" text-align:right; font-weight: bold;\" id=\"v_subtotal_nota\"></div>,#cspan", ["text-align:right;", "text-align:right;", "text-align:right;", "text-align:right;", "text-align:right;"]);
                    dhxGrid_nota.attachFooter("<div>IGV</div>,#cspan,#cspan,#cspan,#cspan,#cspan,<div style=\"  text-align:right; font-weight: bold;\" id=\"v_igv_nota\"></div>,#cspan", ["text-align:right;", "text-align:right;", "text-align:right;", "text-align:right;", "text-align:right;"]);
                    dhxGrid_nota.attachFooter("<div>TOTAL</div>,#cspan,#cspan,#cspan,#cspan,#cspan,<div style=\" text-align:right; font-weight: bold;\" id=\"v_total_nota\"></div>,#cspan", ["text-align:right;", "text-align:right;", "text-align:right;", "text-align:right;", "text-align:right;"]);
                    dhxGrid_nota.enableEditEvents(true, false, true);
                    dhxGrid_nota.setCellTextStyle("row1", 0, "color:red;border:1px solid gray;");
                    dhxGrid_nota.init();
                    dhxGrid_nota.attachEvent("onEditCell", function (stage, rId, cInd, nValue, oValue) {
                        if (stage === 2) {
                            oValue = dhxGrid_nota.cells(rId, 2).getValue();
                            if (parseFloat(nValue) <= parseFloat(oValue)) {
                                calculateFooterValues_nota();
                                return true;
                            } else {
                                dhtmlx.message({ type: "error", text: "El valor ingresado debe ser menor o igual al valor comprado , Por favor", expire: 5000 });
                                return false;
                            }
                        }
                    });
                    myLayoutpla = new dhtmlXLayoutObject(tabbar.tabs("a12"), '2U');
                    myLayoutpla.cells("b").hideHeader(), myLayoutpla.cells("a").hideHeader();
                    myLayoutpla.cells("a").setWidth(220), myLayoutpla.cells("a").setText('Formulario de B\u00FAsqueda');

                    form_b_pla = myLayoutpla.cells("a").attachForm(form_buscar_pla);
                    fecha1 = new Date();
                    form_b_pla.setItemValue('fb_desde', fecha1), form_b_pla.setItemValue('fb_depo', fecha1);
                    form_b_pla.setItemValue('local', 'LoteVisanet:'), form_b_pla.setItemValue('fb_hasta', fecha1);
                    form_b_pla.setItemLabel("label", "<span style='color:black;'>NRO.OP:</span>"), form_b_pla.setItemLabel("label2", "<span style='color:black;'>MONTO:</span>");
                    form_b_pla.attachEvent("onFocus", function (name) {
                        switch (name) {
                            case 'plan_liqui':
                                ventana_planillas_cerradas();
                                break;
                        }
                    });
                    form_b_pla.attachEvent("onChange", function (name, value, is_checked) {
                        switch (name) {
                            case 'periodo':
                                per = value;
                                form_b_pla.reloadOptions('busca_planilla', BASE_URL + 'xml/pv0101/combo_planilla.php?periodo=' + per + '&docu=0');
                            case 'busca_planilla':
                                b_plan = value;
                                break;
                            case 'banco_liqui':
                                var elem = value.split(',');
                                cod_banco_liquida = elem[0], cta_cte_liquida = elem[1];
                                break;
                            case 'che_visa':
                                if (is_checked === Boolean(true)) {
                                    ycotipodocadministr = '308';
                                    form_b_pla.setItemLabel("label", "<span style='color:blue;'>LOTE:</span>"), form_b_pla.setItemLabel("label2", "<span style='color:blue;'>MONTO:</span>");
                                } else {
                                    ycotipodocadministr = '153';
                                    form_b_pla.setItemLabel("label", "<span style='color:black;'>NR.OP:</span>"), form_b_pla.setItemLabel("label2", "<span style='color:black;'>MONTO:</span>");
                                }
                                break;
                        }
                    });
                    form_b_pla.attachEvent("onButtonClick", function (name) {
                        switch (name) {
                            case 'b_photo':
                                dhxW12 = new dhtmlXWindows();
                                dhxW2t12 = dhxW12.createWindow("w_photo", 75, 5, 850, 450);
                                dhxW2t12.setText("Subir voucher de pago");
                                var layoutdesc12 = new dhtmlXLayoutObject(dhxW12.window("w_photo"), '2E');
                                layoutdesc12.cells("a").hideHeader(), layoutdesc12.cells("b").hideHeader();
                                layoutdesc12.cells("a").attachHTMLString('<div id="vaultObj"></div>');
                                var elem = (form_b_pla.getItemValue('banco_liqui')).split(',');
                                var CTA_DEPOS = elem[1];
                                var vault = new dhx.Vault("vaultObj", {
                                    uploader: {
                                        target: "<?php echo base_url() ?>xml/pv0101/uploader.php", singleRequest: true, params: {
                                            co_periodo: periodo_s_pla, cta_depo: CTA_DEPOS, nro_ope: form_b_pla.getItemValue('ref_doc_liquida')
                                        }
                                    }
                                });
                                break;
                            case 'fb_bus_fec':
                                start_date = document.getElementsByName("fb_desde")[0].value;
                                end_date = document.getElementsByName("fb_hasta")[0].value;
                                carga_lista_planilla_realizadas_f(start_date, end_date);
                                break;
                            case 'b_rep_detalla':
                                start_date = document.getElementsByName("fb_desde")[0].value;
                                end_date = document.getElementsByName("fb_hasta")[0].value;
                                window.open('<?php echo base_url() ?>xml/pv0101/export_excel.php?desde=' + start_date + "&hasta=" + end_date + "&ptoveta=" + co_pto_venta);
                                break;
                            case 'b_excel_plani':
                                mygrid.toExcel('http://dhtmlxgrid.appspot.com/export/excel');
                                break;
                            case 'b_doc_elimina':
                                break;
                            case 'b_pla_buscar':
                                if (parseInt(per) === 0) {
                                    dhtmlx.message({ type: "error", text: "Seleccione un Periodo, Por favor", expire: 3000 });
                                } else {
                                    carga_lista_planilla_realizadas(form_b_pla.getItemValue('busca_planilla'), per);
                                }
                                break;
                            case 'b_liquida_info':
                                dhxW1 = new dhtmlXWindows();
                                dhxW2t1 = dhxW1.createWindow("w_descto", 75, 5, 850, 450);
                                dhxW2t1.setText("Promociones de Punto de Venta");
                                layoutdesc1 = new dhtmlXLayoutObject(dhxW1.window("w_descto"), '2E');
                                layoutdesc1.cells("a").hideHeader(), layoutdesc1.cells("b").hideHeader();
                                dhxGridesc1 = layoutdesc1.cells("a").attachGrid();
                                dhxGridesc1.setImagePath(BASE_URL + 'dhtmlx/codebase/imgs/');
                                dhxGridesc1.setHeader("PLANILLA,COMPROBANTE,FE.REG.,BANCO,CANTIDAD,CTA.CTE,,");
                                dhxGridesc1.setColTypes("ro,ro,ro,ro,ro,ro,img,ro");
                                dhxGridesc1.setColAlign("left,right,left,right,left,right,center,left");
                                dhxGridesc1.setInitWidths("90,90,100,180,90,150,20,0");
                                dhxGridesc1.setColSorting("str,str,str,str,str,str,str,str");
                                dhxGridesc1.init();//form_b_pla.getItemValue('plan_liqui')
                                loadGridData(BASE_URL + 'get/datapv0101/lista_deposi_planilla/' + form_b_pla.getItemValue('plan_liqui'), true, dhxGridesc1, layoutdesc1.cells("a"), false, 'dhxGridesc1');
                                dhxGridesc1.attachEvent("onDataReady", function () {
                                    var ids = dhxGridesc1.getAllRowIds();
                                    let parte = ids.split(",");
                                    parents = [];
                                    for (var i = 0; i < parte.length; i++) {
                                        $.ajax({
                                            type: "GET", url: BASE_URL + 'xml/pv0101/valida_nrovoucher.php?cta=' + dhxGridesc1.cells(parte[i], 5).getValue() + '&planilla=' + dhxGridesc1.cells(parte[i], 0).getValue() + '&periodo=' + periodo_s_pla + '&nope=' + dhxGridesc1.cells(parte[i], 1).getValue(),
                                            beforeSend: function () {
                                            }, success: function (response) {
                                                if (response['MSAJE'] == 'S') {
                                                    parents.push({ 'ms': response['MSAJE'], 'bas': response['BASE'], 'id': response['OPE'] });
                                                    var ids2 = dhxGridesc1.getAllRowIds();
                                                    let parte2 = ids2.split(",");
                                                    for (var i = 0; i < parte2.length; i++) {
                                                        if (dhxGridesc1.cells(parte2[i], 1).getValue() === response['OPE']) {
                                                            dhxGridesc1.cells(parte2[i], 7).setValue(response['BASE']);
                                                            dhxGridesc1.cells(parte2[i], 6).setValue(BASE_URL + '/dhtmlx/codebase/imgs/green.gif');
                                                        }
                                                    }
                                                }
                                            }
                                        });
                                    }
                                });

                                dhxGridesc1.attachEvent("onRowSelect", function (id, ind) {
                                    if (ind === 6) {
                                        let srcimng = dhxGridesc1.cells(id, 7).getValue();
                                        let NOPE_S = dhxGridesc1.cells(id, 1).getValue();
                                        (parents).forEach(elem => {
                                            [elem].forEach(elem2 => {
                                                if (NOPE_S === elem2['id']) {
                                                    console.log(elem['bas']);
                                                }
                                            });
                                        });
                                        let dhxW1 = new dhtmlXWindows();
                                        let dhxW2t1 = dhxW1.createWindow("w_img", 75, 5, 400, 400);
                                        dhxW2t1.setText("Imagen asociada al deposito");
                                        let layoutimg = new dhtmlXLayoutObject(dhxW1.window("w_img"), '1C');
                                        layoutimg.cells("a").hideHeader();
                                        layoutimg.cells("a").attachHTMLString(' <img alt="img" style="width:100%; height:100%" src="' + srcimng + '"         > ');

                                    }
                                });
                                break;
                            case 'b_extracto':
                                b_ini_deposito();
                                break;
                            case 'b_liquida':
                                var fe_reg = document.getElementsByName("fb_depo")[0].value;
                                if (form_b_pla.validate() === Boolean(true)) {
                                    if (form_b_pla.getItemValue('ref_doc_liquida') != '.') {
                                        if (form_b_pla.getItemValue('impor_liquida') != '0') {
                                            $.ajax({
                                                type: "POST", url: BASE_URL + 'get/datapv0101/valida_nrovoucher/' + cta_cte_liquida + '/' + form_b_pla.getItemValue('ref_doc_liquida') + '/' + periodo_s_pla,
                                                beforeSend: function () {
                                                    myLayoutpla.cells("a").progressOn();
                                                }, success: function (response) {
                                                    if (response == 'OK') {
                                                        dhtmlx.confirm("Confirme LIQUIDAR PLANILLA " + form_b_pla.getItemValue('plan_liqui') + " por S/." + form_b_pla.getItemValue('impor_liquida'), function (result) {
                                                            if (result === Boolean(true)) {
                                                                $.ajax({
                                                                    type: "POST", url: BASE_URL + 'get/datapv0101/liquida_planilla/' + cta_cte_liquida + '/' + form_b_pla.getItemValue('plan_liqui') + '/' + form_b_pla.getItemValue('ref_doc_liquida') + '/' + form_b_pla.getItemValue('impor_liquida') + '/' + ycotipodocadministr + '/' + fe_reg + '/' + co_pto_venta,
                                                                    beforeSend: function () {
                                                                        myLayoutpla.cells("a").progressOn();
                                                                    }, success: function (response) {
                                                                        if (parseInt(response) == '1') {
                                                                            dhtmlx.message({ title: "Informativo", type: "alert-warning", text: "Se liquidó la planilla con S/." + form_b_pla.getItemValue('impor_liquida') });
                                                                            form_b_pla.setItemValue('impor_liquida', '0');
                                                                            form_b_pla.setItemValue('ref_doc_liquida', '.');
                                                                            carga_planilla();
                                                                        } else {
                                                                            dhtmlx.message({ type: "error", text: "Error al  liquidar la planilla.  Intente nuevamente , Por favor", expire: 3000 });
                                                                        }
                                                                        myLayoutpla.cells("a").progressOff();
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    } else {
                                                        dhtmlx.message({ type: "error", text: response, expire: 5000 });
                                                    }
                                                    myLayoutpla.cells("a").progressOff();
                                                }
                                            });
                                        } else {
                                            dhtmlx.message({ type: "error", text: "Ingrese MONTO diferente de CERO (0), Por favor", expire: 3000 });
                                        }
                                    } else {
                                        dhtmlx.message({ type: "error", text: "Ingrese la REFERENCIA del voucher del banco, Por favor", expire: 3000 });
                                    }
                                } else {
                                    dhtmlx.message({ type: "error", text: "Llene todos los campos con (*), Por favor", expire: 3000 });
                                }
                                break;
                            case 'b_visual':
                                break;
                        }
                    });
                    myLayout_caja = new dhtmlXLayoutObject(myLayout.cells("b"), '3E');
                    myLayout_caja.cells("a").hideHeader();
                    myLayout_caja.setSeparatorSize(0, 0), myLayout_caja.setSeparatorSize(1, 0);
                    myLayout_caja.cells("b").hideHeader(), myLayout_caja.cells("c").hideHeader(), myLayout_caja.cells("a").setHeight(50);
                    myLayout_caja.cells("b").setHeight(150);
                    myForm_b = myLayout_caja.cells("a").attachForm(formData_b);
                    myForm_b.reloadOptions('sel_planilla', BASE_URL + 'get/datapv0101/select_plan/' + co_pto_venta);
                    myForm_c = myLayout_caja.cells("b").attachForm(formData_c);
                    autocomplete_off(myForm_b), autocomplete_off(myForm_c);
                    myForm_d = myLayout_caja.cells("c").attachForm(formData_d);
                    myForm_d.setItemLabel('ver__', 'Version :' + ver__ + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Impresora : ' + (printer).replace(/[+]/g, " "));
                    myForm_c.setItemValue('fec_doc_emi', fecha);
                    myForm_c.setItemValue('fec_ref_man_doc_emi', fecha);
                    myForm_c.setItemValue('fec_vto_doc_emi', fecha);
                    myForm_c.reloadOptions('selec_afec_igv', BASE_URL + 'get/datapv0101/selec_afec_igv/');
                    myForm_d.attachEvent("onInputChange", function (name, value) {
                        switch (name) {
                            case 'valor_compro':
                                value > 0 ? myForm_d.showItem('myGridPagos') : myForm_d.hideItem('myGridPagos');
                                break;
                            case 'entreg_pago': //Efectivo
                                countclick = 0, cod_banco = '01', cta_cte = '194-1573143-0-32';//bcp
                                var vsuma = '0';
                                vsuma = st_nota == 'S' ? total_nota : suma;
                                myForm_d.setItemValue('vuelt_pago', (value - vsuma).toFixed(2));
                                var vuelto = myForm_d.getItemValue('vuelt_pago');
                                var total_a_pagar = parseFloat(myForm_d.getItemValue('total_doc_emi'));
                                valor_efectivo = value >= total_a_pagar ? total_a_pagar : value;
                                if (vuelto >= 0) {
                                    myForm_d.hideItem('myGridPagos');
                                    myForm_d.setItemValue('sald_pago', '0.00'), myForm_d.setItemValue('valor_compro', '0.00');
                                    myForm_d.disableItem('select_pago'), myForm_d.setItemValue('select_pago', '6');
                                    myForm_d.disableItem('banco_pago'), myForm_d.setItemValue('banco_pago', '01,194-1573143-0-32');
                                    myForm_d.disableItem('comproba_pago'), myForm_d.setItemValue('comproba_pago', '.');
                                    carga_referVISA();
                                } else {
                                    myForm_d.setItemValue('sald_pago', suma);
                                    myForm_d.setItemValue('vuelt_pago', '0.00');
                                    if (co_vendedor == '10000011') {
                                        valor_efectivo = '0', vuelto = 0;
                                        myForm_d.setItemValue('valor_compro', '0');
                                    } else {
                                        myForm_d.setItemValue('valor_compro', vuelto * -1);
                                    }
                                    myForm_d.enableItem('regventa');
                                    carga_referVISA();
                                    myForm_d.hideItem('myGridPagos'), myForm_d.enableItem('select_pago');
                                    myForm_d.setItemValue('select_pago', '6'), myForm_d.enableItem('banco_pago');
                                    myForm_d.setItemValue('banco_pago', '01,194-1573143-0-32'), myForm_d.enableItem('comproba_pago');
                                    myForm_d.setItemValue('comproba_pago', '.');
                                }
                                break;
                        }
                    });
                    myForm_c.attachEvent("onInfo", function (name, e) {
                        switch (name) {
                            case 'por_blogger':
                                dhtmlx.message({ title: "Informativo", text: 'Para aplicar este Dscto, tiene que estar activo segun el Rango de Fechas registrados por el ERP. El cliente tiene que estar registrado con su DNI y pertenecer a la Lista de Precio Consumidor Final', expire: 999999 });
                                break;
                        }
                    });
                    myForm_c.attachEvent("onFocus", function (name) {
                        switch (name) {
                            case 'ruc_dni_doc_emi':
                                ventana_pedidos_x_atender();
                                break;
                            case 'ruc_provee':
                                carga_proveedor();
                                break;
                            case 'num_pedido_atender':
                                ventana_pedidos_x_atender();
                                break;
                        }
                    });
                    myForm_d.attachEvent("onChange", function (name, value) {
                        switch (name) {
                            case 'select_pago':
                                myForm_d.reloadOptions('banco_pago', BASE_URL + 'xml/pv0101/combo_banco.php?tipo_pago=' + '6');
                                break;
                            case 'banco_pago':
                                var elem = value.split(',');
                                cod_banco = elem[0], cta_cte = elem[1];
                                break;
                        }
                    });
                    myForm_c.attachEvent("onChange", function (name, value, is_checked) {
                        switch (name) {
                            case 'chek_conti':
                                if (is_checked === Boolean(true)) {
                                    dhtmlx.confirm('¿ Desea activar el Modo CONTINGENCIA? permite registrar documentos fisicos<br/>**El acceso esta restringido por seguridad**', function (result) {
                                        if (result === Boolean(true)) {
                                            carga_permisos();
                                        } else {
                                            myForm_c.uncheckItem('chek_conti'), myForm_b.hideItem('lab_conti');
                                        }
                                    });
                                } else {
                                    st_contingencia = 'N', myForm_b.hideItem('lab_conti'), carga_pto_venta(cod_cliente, fecha_fn, st_contingencia), myForm_b.hideItem('sel_planilla'), myForm_b.showItem('nro_pla'), myForm_b.showItem('abrir_pla'), myForm_b.showItem('cerrar_pla');
                                }
                                break;
                            case 'chek_nota':
                                if (co_vendedor != '10000011') {
                                    if (is_checked === Boolean(true)) {
                                        $.ajax({
                                            async: true, url: BASE_URL + 'get/datapv0101/b_ult_nota/' + cod_cliente + '/' + t_d_admin, type: 'post', beforeSend: function () {
                                                myLayout_caja.cells("b").progressOn();
                                            }, success: function (response) {
                                                var im_total = myForm_d.getItemValue('total_doc_emi');
                                                if (response == '0') {
                                                    nu_ncredito = 0, st_nota = 'N';
                                                    myForm_c.uncheckItem('chek_nota');
                                                    dhtmlx.message({ type: "error", text: "No hay ninguna NOTA DE CR\u00c9DITO registrada con el CLIENTE " + det_cata, expire: 4000 });
                                                } else {
                                                    var json = eval(response);
                                                    for (var i in json) {
                                                        nota_cre = json[i].NOTA_CRE;
                                                        nu_ncredito = json[i].IM_FINAL;
                                                    }
                                                    if (parseFloat(im_total) > parseFloat(nu_ncredito)) {
                                                        total_nota = parseFloat(parseFloat(im_total) - parseFloat(nu_ncredito)).toFixed(2);
                                                        myForm_d.setItemLabel('regventa', 'PAGAR S/ ' + parseFloat(total_nota).toFixed(2));
                                                        myForm_c.setItemValue('doc_not_cre', nota_cre);
                                                        st_nota = 'S', valor_efectivo = '0';
                                                        myForm_d.setItemValue('entreg_pago', '0'), myForm_d.setItemValue('vuelt_pago', '0.00');
                                                        myForm_d.setItemValue('valor_compro', parseFloat(total_nota).toFixed(2));
                                                        myForm_d.showItem('nu_ncredito'), myForm_d.setItemValue('nu_ncredito', '-' + nu_ncredito);
                                                        calculateFooterValues();
                                                    } else {
                                                        if (parseFloat(im_total) < parseFloat(nu_ncredito)) {
                                                            dhtmlx.message({ type: "error", text: "La Nota de Cr\u00e9 dito es mayor que la venta. Su venta debe superar los S/ " + nu_ncredito + ", '" + nota_cre + "'", expire: 7000 });
                                                            valor_efectivo = '0';
                                                            myForm_d.setItemValue('entreg_pago', '0'), myForm_d.setItemValue('vuelt_pago', '0.00');
                                                            myForm_d.setItemValue('nu_ncredito', '0'), myForm_d.hideItem('nu_ncredito');
                                                            st_nota = 'N', nota_cre = '';
                                                            myForm_c.setItemValue('doc_not_cre', ''), myForm_d.setItemValue('vuelt_pago', '0.00');
                                                            myForm_c.uncheckItem('chek_nota'), nu_ncredito = '0';
                                                            myLayout_caja.cells("b").progressOff();
                                                        } else {
                                                            if (parseFloat(im_total) === parseFloat(nu_ncredito)) {
                                                                total_nota = parseFloat(parseFloat(im_total) - parseFloat(nu_ncredito)).toFixed(2);
                                                                myForm_d.setItemLabel('regventa', 'PAGAR S/ ' + parseFloat(total_nota));
                                                                myForm_c.setItemValue('doc_not_cre', nota_cre);
                                                                st_nota = 'S', valor_efectivo = '0';
                                                                myForm_d.hideItem('myGridPagos'), myForm_d.showItem('nu_ncredito');
                                                                myForm_d.setItemValue('entreg_pago', '0'), myForm_d.setItemValue('vuelt_pago', '0.00');
                                                                myForm_d.setItemValue('valor_compro', total_nota), myForm_d.setItemValue('nu_ncredito', '-' + nu_ncredito);
                                                                myForm_d.setItemValue('sald_pago', '0.00'), myForm_d.setItemValue('valor_compro', '0.00');
                                                                myForm_d.disableItem('select_pago'), myForm_d.setItemValue('select_pago', '6');
                                                                myForm_d.disableItem('banco_pago'), myForm_d.setItemValue('banco_pago', '01,194-1573143-0-32');
                                                                myForm_d.disableItem('comproba_pago'), myForm_d.setItemValue('comproba_pago', '.');
                                                                calculateFooterValues();
                                                            }
                                                        }
                                                    }
                                                    carga_referVISA();
                                                }
                                                myLayout_caja.cells("b").progressOff();
                                            },
                                            fail: function () {
                                                navigator.notification.alert('Error, concectar servidor...!');
                                            }
                                        });
                                    } else {
                                        nota_cre = '';
                                        myForm_d.hideItem('nu_ncredito'), myForm_d.setItemValue('entreg_pago', '0');
                                        myForm_d.setItemValue('vuelt_pago', '0.00'), myForm_d.setItemValue('nu_ncredito', '0');
                                        var im_total = myForm_d.getItemValue('total_doc_emi');
                                        st_nota = 'N', nota_cre = '';
                                        total_nota = parseFloat(parseFloat(im_total) + parseFloat(nu_ncredito)).toFixed(2);
                                        console.log(nu_ncredito, myForm_d.getItemValue('total_doc_emi'), total_nota);
                                        myForm_c.setItemValue('doc_not_cre', ''), myForm_d.setItemValue('valor_compro', total_nota);
                                        myForm_d.setItemValue('vuelt_pago', '0.00'), myForm_d.setItemValue('total_doc_emi', total_nota);
                                        myForm_d.setItemLabel('regventa', 'PAGAR S/ ' + parseFloat(total_nota).toFixed(2));
                                        nu_ncredito = '0', myLayout_caja.cells("b").progressOff();
                                        calculateFooterValues();
                                    }
                                } else {
                                    dhtmlx.message({ type: "error", text: "Cuponatic no est\u00e1 habilitado para NOTA DE CREDITO'", expire: 7000 });
                                    myForm_c.uncheckItem('chek_nota');
                                }
                                break;
                            case 'ch_gratuita':
                                valor_efectivo = suma;
                                if (parseFloat(suma) > 0) {
                                    is_checked === Boolean(true) ? activa_gratis() : desactiva_grati();
                                }
                                break;

                            case 'ch_aptreq':
                                st_req = myForm_c.isItemChecked('ch_aptreq') ? 'S' : 'N';
                                console.log(st_req);
                                break;
                            case 'chek_fle':
                                if (is_checked === Boolean(true)) {
                                    st_flete = 'S', co_vendedor = '90000999';
                                    myForm_a.setItemValue('selec_vendedor', co_vendedor), myForm_c.showItem('import_flete'), myForm_c.enableItem('import_flete');
                                    myForm_d.setItemValue('entreg_pago', '0'), myForm_d.setItemValue('vuelt_pago', '0');
                                } else {
                                    st_flete = 'N', valida_responsa1();
                                    myForm_a.setItemValue('selec_vendedor', co_vendedor), myForm_c.hideItem('import_flete'), myForm_c.disableItem('import_flete'), myForm_c.setItemValue('import_flete', '0');
                                    myForm_d.setItemValue('entreg_pago', '0'), myForm_d.setItemValue('vuelt_pago', '0');
                                }
                                f_selectvendedor();
                                calculateFooterValues();
                                break;
                        }
                    });
                    myForm_c.attachEvent("onButtonClick", function (name) {
                        switch (name) {
                            case 'b_actu_serie':
                                actualiza_serie(cod_cliente, t_d_admin, co_pto_venta);
                                break;
                        }
                    });
                    myForm_c.attachEvent("onInputChange", function (name, value) {
                        switch (name) {
                            case 'import_flete':
                                myForm_d.hideItem('nu_ncredito');
                                if (myForm_c.isItemChecked('chek_fle') === Boolean(true)) {
                                    st_flete = 'S', myForm_c.showItem('import_flete'), myForm_d.setItemValue('entreg_pago', '0');
                                    myForm_d.setItemValue('vuelt_pago', '0');
                                } else {
                                    st_flete = 'N';
                                    myForm_c.hideItem('import_flete'), myForm_c.setItemValue('import_flete', '0');
                                    myForm_d.setItemValue('entreg_pago', '0'), myForm_d.setItemValue('vuelt_pago', '0');
                                }
                                calculateFooterValues();
                                break;
                        }
                    });
                    myForm_d.attachEvent("onButtonClick", function (name) {
                        anho = period.substring(0, 4), mes = period.substring(4, 6);
                        switch (name) {
                            case 'new_pago':
                                suma_pagos = parseFloat(sumColumndecimal2(6, 'dhxGrid_Pagos', 2)) + parseFloat(myForm_d.getItemValue('entreg_pago'));
                                if (suma_pagos < suma) {
                                    dhxGrid_Pagos.addRow((new Date()).valueOf(), ['Tarjeta Visa', 6, '01', '177', pago_defecto, 'N', parseFloat(suma - suma_pagos).toFixed(2), cta_cte], parseFloat(dhxGrid_Pagos.getRowsNum()) + 1);
                                }
                                break;
                            case 'regventa':
                                myForm_d.disableItem('regventa');
                                countclick = countclick + 1, cadena_gridpagos = '', num_rowpago = 0;
                                if (countclick === 1) {
                                    filtro_cc = 0, continua = 0, cod_banco = '01', cta_cte = '194-1573143-0-32', num_filas = 0;
                                    $.ajax({
                                        type: "POST", url: BASE_URL + 'get/datapv0101/dentro_periodo/' + document.getElementsByName("fec")[0].value + '/' + period,
                                        beforeSend: function () {
                                        }, success: function (response) {
                                            response = st_contingencia === 'S' ? '1' : response;
                                            if (response == '1') {
                                                if (st_che_cred == 'S') {
                                                    guardar_con_credito_caetec();
                                                } else {
                                                    if (myForm_a.validate() === Boolean(true)) {
                                                        if (myForm_b.getItemValue('nro_pla') !== '0') {
                                                            if (myForm_c.validate() === Boolean(true)) {
                                                                if (myForm_d.validate() === Boolean(true)) {
                                                                    flete_ = myForm_c.getItemValue('import_flete');
                                                                    detalle = "", cadena_pago = "", arra_detalle = "";
                                                                    var i = 0;
                                                                    var example = mygridVN.getAllItemIds();
                                                                    var numbers = example.split(',');
                                                                    if (example.length == '0') {
                                                                        dhtmlx.message({ type: "error", text: "No hay productos para registrar la venta", expire: 3000 });
                                                                    } else {
                                                                        st_cheq = 'N', valida = 0;
                                                                        if (parseFloat(myForm_d.getItemValue('valor_compro'), 2) > 0) { //pago hibrido CREDITO Y EFECTIVO
                                                                            suma_pa = parseFloat(sumColumndecimal2(6, 'dhxGrid_Pagos', 2), 2) + parseFloat(myForm_d.getItemValue('entreg_pago'), 2);
                                                                            if (Math.round10(parseFloat(suma_pa, 2), -1) < Math.round10(parseFloat(suma, 2), -1) || Math.round10(parseFloat(sumColumndecimal2(6, 'dhxGrid_Pagos', 2)), -1) == 0) {//if (parseFloat(suma_pa, 2) < parseFloat(suma, 2) || parseFloat(sumColumndecimal2(6, 'dhxGrid_Pagos', 2)) == 0) {
                                                                                countclick = 0, myForm_d.enableItem('regventa');
                                                                                dhtmlx.message({ type: "error", text: "Agregue un Pago con Tarjeta mayor a Cero y que complete el TOTAL...", expire: 5000 });
                                                                            } else {
                                                                                if (Math.round10(suma_pa, -1) > Math.round10(suma, -1)) {
                                                                                    countclick = 0;
                                                                                    dhtmlx.message({ type: "error", text: "Se esta pagando más que el TOTAL...", expire: 5000 });
                                                                                } else {
                                                                                    _a = 0, _b = 0, _c = 0;
                                                                                    dhxGrid_Pagos.forEachRow(function (id) {
                                                                                        var serie_pago = dhxGrid_Pagos.cells(id, 4).getValue();
                                                                                        if (dhxGrid_Pagos.cells(id, 1).getValue() !== undefined) {
                                                                                            if (dhxGrid_Pagos.cells(id, 1).getValue() == 6)
                                                                                                _a++;
                                                                                            if (dhxGrid_Pagos.cells(id, 1).getValue() == 16)
                                                                                                _b++;
                                                                                            if (dhxGrid_Pagos.cells(id, 1).getValue() == 17)
                                                                                                _c++;
                                                                                            num_rowpago++;
                                                                                            cadena_gridpagos += dhxGrid_Pagos.cells(id, 1).getValue() + '@*@' + dhxGrid_Pagos.cells(id, 2).getValue() + '@*@' + '177' + '@*@' + serie_pago + '@*@' + 'N' + '@*@' + dhxGrid_Pagos.cells(id, 6).getValue() + '@*@' + dhxGrid_Pagos.cells(id, 7).getValue() + '@-@';
                                                                                        }
                                                                                    });

                                                                                    if (st_nota == 'S') {
                                                                                        if (parseFloat(valor_efectivo) == 0) {
                                                                                            cadena_pago = '11' + '@*@' + '0' + '@*@' + '177' + '@*@' + '.' + '@*@' + 'N' + '@*@' + nu_ncredito + '@*@' + '.' + '@*@' + nota_cre + '@-@' + cadena_gridpagos;
                                                                                            for_num = num_rowpago + 1;
                                                                                        } else {
                                                                                            cadena_pago = '1' + '@*@' + '0' + '@*@' + '177' + '@*@' + '.' + '@*@' + 'N' + '@*@' + valor_efectivo + '@*@' + '.' + '@-@' + '11' + '@*@' + '0' + '@*@' + '177' + '@*@' + '.' + '@*@' + 'N' + '@*@' + nu_ncredito + '@*@' + '.' + '@*@' + nota_cre + '@-@' + cadena_gridpagos;
                                                                                            for_num = num_rowpago + 2;
                                                                                        }
                                                                                    } else {
                                                                                        if (parseFloat(valor_efectivo) == 0) {
                                                                                            cadena_pago = cadena_gridpagos; // tipo_cobro + '@*@' + cod_banco + '@*@' + '177' + '@*@' + myForm_d.getItemValue('comproba_pago') + '@*@' + st_cheq + '@*@' + myForm_d.getItemValue('valor_compro') + '@*@' + cta_cte;
                                                                                            for_num = num_rowpago;
                                                                                        } else {
                                                                                            if (parseFloat(sumColumndecimal2(6, 'dhxGrid_Pagos', 2)) == suma) {
                                                                                                valor_efectivo = '0';
                                                                                                console.log('igual dhxGrid_Pagos', valor_efectivo);
                                                                                            }
                                                                                            cadena_pago = '1' + '@*@' + '0' + '@*@' + '177' + '@*@' + '.' + '@*@' + 'N' + '@*@' + valor_efectivo + '@*@' + '.' + '@-@' + cadena_gridpagos;
                                                                                            for_num = num_rowpago + 1;
                                                                                        }
                                                                                    }
                                                                                    valida = 1;
                                                                                }
                                                                            }
                                                                        } else {
                                                                            valida = 1; //solo efectivo
                                                                            if (co_vendedor == '10000011') {
                                                                                for_num = num_rowpago + 1;
                                                                                cadena_pago = '1' + '@*@' + '0' + '@*@' + '177' + '@*@' + '.' + '@*@' + 'N' + '@*@' + myForm_d.getItemValue('total_doc_emi') + '@*@' + '.@*@.@-@';
                                                                            } else {
                                                                                if (valor_efectivo >= 0) { //solo efectivo EFECVTO= 0 (CUANDO SE PAGA IGUAL CANTIDAD QUE LA NOTA DE CREDITO)
                                                                                    if (parseFloat(myForm_d.getItemValue('valor_compro')) === 0)
                                                                                        if (st_nota == 'S') {
                                                                                            if (parseFloat(valor_efectivo) == '0') {
                                                                                                cadena_pago = '11' + '@*@' + '0' + '@*@' + '177' + '@*@' + '.' + '@*@' + 'N' + '@*@' + nu_ncredito + '@*@' + '.' + '@*@' + nota_cre + '@-@';
                                                                                                for_num = num_rowpago + 1;
                                                                                            } else {
                                                                                                cadena_pago = '1' + '@*@' + '0' + '@*@' + '177' + '@*@' + '.' + '@*@' + 'N' + '@*@' + valor_efectivo + '@*@' + '.' + '@-@' + '11' + '@*@' + '0' + '@*@' + '177' + '@*@' + '.' + '@*@' + 'N' + '@*@' + nu_ncredito + '@*@' + '.' + '@*@' + nota_cre + '@-@';
                                                                                                for_num = num_rowpago + 2;
                                                                                            }
                                                                                        } else {
                                                                                            if (parseFloat(valor_efectivo) == '0') {
                                                                                                cadena_pago = '.';
                                                                                            } else {
                                                                                                if (st_flete == 'S') {
                                                                                                    cadena_pago = '1' + '@*@' + '0' + '@*@' + '177' + '@*@' + '.' + '@*@' + 'N' + '@*@' + suma + '@*@' + '.' + '@*@' + 'FLET' + '@-@';
                                                                                                } else {
                                                                                                    cadena_pago = '1' + '@*@' + '0' + '@*@' + '177' + '@*@' + '.' + '@*@' + 'N' + '@*@' + valor_efectivo + '@*@' + '.' + '@*@' + 'EFEC' + '@-@';
                                                                                                }
                                                                                                for_num = num_rowpago + 1;
                                                                                            }
                                                                                        }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                    num_filas = numbers.length, suma_boni = 0, tot_sub = 0, total_sub = 0;
                                                                    var st_t_vta = '.';
                                                                    while (i < numbers.length) {
                                                                        arra_detalle_1 = "", subflete_ = 0, igv_afecto_x_fila = '0.0';
                                                                        im_dscto_x_producto = parseFloat(mygridVN.cells(numbers[i], 10).getValue());
                                                                        var cant = mygridVN.cells(numbers[i], 3).getValue();
                                                                        st_t_vta = mygridVN.cells(numbers[i], 8).getValue();
                                                                        var st_descto = mygridVN.cells(numbers[i], 9).getValue();//                                                                                    console.log(st_descto + ' -' + parseFloat(st_t_vta));
                                                                        var st_desc2 = mygridVN.cells(numbers[i], 10).getValue();
                                                                        var st_desc1 = mygridVN.cells(numbers[i], 11).getValue();
                                                                        var ult_digi = mygridVN.cells(numbers[i], 1).getValue().length;
                                                                        var st_icbper_deta = mygridVN.cells(numbers[i], 13).getValue();
                                                                        var total_g = parseFloat(mygridVN.cells(numbers[i], 4).getValue()); //precio ventafinal incluido decto
                                                                        var rang_strin = ult_digi - 34, subtotal_g = 0, total_s = 0;
                                                                        p_bonu = '0.00';
                                                                        var p_uni_v = Math.round10(mygridVN.cells(numbers[i], 6).getValue(), -1);
                                                                        subtotal_g = parseFloat(mygridVN.cells(numbers[i], 5).getValue());
                                                                        res_g = total_g - subtotal_g;
                                                                        igv_sb = parseFloat(total_g / 1.18) * 0.18;
                                                                        t_d_admin == '01' ? im_total_fila = parseFloat(subtotal_g) - parseFloat(st_desc2) + parseFloat(res_g) : im_total_fila = parseFloat(subtotal_g) - parseFloat(st_desc2) + parseFloat(0);
                                                                        total_sub = parseFloat(total_g - igv_sb);
                                                                        total_s = total_sub + parseFloat(st_desc2);
                                                                        p_uni_v = total_s / parseFloat(cant);
                                                                        im_total_fila = total_s - parseFloat(st_desc2) + igv_sb
                                                                        detalle = detalle + mygridVN.cells(numbers[i], 0).getValue() + '@*@' + cant + '@*@' + (p_uni_v).toFixed(2) + '@*@' + parseFloat(total_s).toFixed(2) + '@*@' + parseFloat(st_desc2).toFixed(2) + '@*@' + parseFloat(igv_sb).toFixed(2) + '@*@' + parseFloat(im_total_fila).toFixed(2) + '@*@' + st_desc1 + '@*@' + co_pto_venta + '@*@' + '0' + '@*@' + cod_cliente + '@*@0.00@*@' + st_t_vta + '@-@';
                                                                        var tip_des = '';
                                                                        if (parseFloat(st_t_vta) > 0) {
                                                                            switch (parseInt(st_t_vta)) {
                                                                                case 7:
                                                                                    tip_des = ' (ONMAST)';
                                                                                    break;
                                                                                case 8:
                                                                                    tip_des = ' (PRICOM)';
                                                                                    break;
                                                                                case 9:
                                                                                    tip_des = ' (CIEPTA)';
                                                                                    break;
                                                                                case 10:
                                                                                    tip_des = ' (BLOGGER)';
                                                                                    break;
                                                                            }
                                                                            total_sub = parseFloat(total_g);
                                                                            total_s = total_sub;
                                                                            p_uni_v = total_s / parseFloat(cant);
                                                                            var dsctxp = parseFloat(im_dscto_x_producto / cant).toFixed(2);
                                                                            (im_dscto_x_producto > 0) ? p_uni_v = parseFloat(p_uni_v) + parseFloat(dsctxp) : null;
                                                                            im_total_fila = total_s;//- parseFloat(st_desc2);
                                                                            tot_sub = parseFloat(tot_sub) + im_total_fila;
                                                                            sub_impri = parseFloat(tot_sub);// console.log(sub_impri);
                                                                            arra_detalle_1 = (((mygridVN.cells(numbers[i], 1).getValue().replace("&amp;", "&").substring(rang_strin).replace("&", "%26")).replace("#", "%23")).replace("'", "%27")).replace("`", "%60") + ',' + cant + ' x ' + Math.round10(parseFloat(p_uni_v).toFixed(2), -1) + tip_des + st_desc1 + '%25,' + parseFloat(total_s).toFixed(2) + ';';
                                                                        } else {
                                                                            sub_impri = suma - v_igvs;
                                                                            if (st_descto == 'S') {
                                                                                p_uni_v = parseFloat((1 - (st_desc2 / 100)) * p_uni_v).toFixed(2);
                                                                                var dsctxp = parseFloat(im_dscto_x_producto / cant).toFixed(2);
                                                                                (im_dscto_x_producto > 0) ? p_uni_v = parseFloat(p_uni_v) + parseFloat(dsctxp) : null;
                                                                                arra_detalle_1 = (((mygridVN.cells(numbers[i], 1).getValue().replace("&amp;", "&").substring(rang_strin).replace("&", "%26")).replace("#", "%23")).replace("'", "%27")).replace("`", "%60") + ',' + cant + ' x ' + Math.round10(parseFloat(p_uni_v).toFixed(2), -1) + ' (CUP)' + st_desc2 + '%25,' + parseFloat(total_s).toFixed(2) + ';';
                                                                            } else {
                                                                                p_uni_v = (parseFloat(subtotal_g) / parseFloat(cant)).toFixed(2);
                                                                                if (st_descto == 'D') {                                                                                             //   console.log(st_desc2 + ' - ' + igv_sb + ' - ' + total_sub);
                                                                                    total_s = total_sub + igv_sb;
                                                                                    tot_sub = parseFloat(tot_sub) + im_total_fila;
                                                                                    sub_impri = parseFloat(tot_sub);//                                                                                                console.log(sub_impri);
                                                                                    p_uni_v = total_s / parseFloat(cant);
                                                                                    var dsctxp = parseFloat(im_dscto_x_producto / cant).toFixed(2);
                                                                                    (im_dscto_x_producto > 0) ? p_uni_v = parseFloat(p_uni_v) + parseFloat(dsctxp) : null;
                                                                                    arra_detalle_1 = (((mygridVN.cells(numbers[i], 1).getValue().replace("&amp;", "&").substring(rang_strin).replace("&", "%26")).replace("#", "%23")).replace("'", "%27")).replace("`", "%60") + ',' + cant + ' x ' + Math.round10(parseFloat(p_uni_v).toFixed(2), -1) + ' (DSCTO)' + st_desc1 + '%25,' + parseFloat(total_s).toFixed(2) + ';';
                                                                                } else { //'P'
                                                                                    if (st_t_vta == 'P') {
                                                                                        arra_detalle_1 = (((mygridVN.cells(numbers[i], 1).getValue().replace("&amp;", "&").substring(rang_strin).replace("&", "%26")).replace("#", "%23")).replace("'", "%27")).replace("`", "%60") + ',' + cant + ' x ' + Math.round10(parseFloat(p_uni_v).toFixed(2), -1) + ' (PROMO),' + parseFloat(total_s).toFixed(2) + ';';
                                                                                        suma_boni = suma_boni + total_s;
                                                                                    } else { //'L-N 
                                                                                        total_sub = parseFloat(total_g);
                                                                                        total_s = total_sub + parseFloat(st_desc2);
                                                                                        p_uni_v = total_s / parseFloat(cant);
                                                                                        var dsctxp = parseFloat(im_dscto_x_producto / cant).toFixed(2);
                                                                                        (im_dscto_x_producto > 0) ? p_uni_v = parseFloat(p_uni_v) + parseFloat(dsctxp) : null;
                                                                                        im_total_fila = total_s - parseFloat(st_desc2);
                                                                                        tot_sub = parseFloat(tot_sub) + im_total_fila;
                                                                                        sub_impri = parseFloat(tot_sub);
                                                                                        if (st_icbper_deta == 'S') {
                                                                                            suma_boni = suma_boni + total_g;
                                                                                            arra_detalle_1 = (((mygridVN.cells(numbers[i], 1).getValue().replace("&amp;", "&").substring(rang_strin).replace("&", "%26")).replace("#", "%23")).replace("'", "%27")).replace("`", "%60") + ',' + cant + ' x ' + '0.00' + '(ICBPER),' + '0.00' + ';';
                                                                                        } else {
                                                                                            arra_detalle_1 = (((mygridVN.cells(numbers[i], 1).getValue().replace("&amp;", "&").substring(rang_strin).replace("&", "%26")).replace("#", "%23")).replace("'", "%27")).replace("`", "%60") + ',' + cant + ' x ' + Math.round10(parseFloat(p_uni_v).toFixed(2), -1) + ',' + parseFloat(total_s).toFixed(2) + ';';
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                        i++;
                                                                        arra_detalle += arra_detalle_1;
                                                                    }
                                                                    if (st_flete == 'S') {
                                                                        num_filas++;
                                                                        subflete_ = parseFloat(flete_) / 1.18;
                                                                        res_g_fle = parseFloat(subflete_) * 0.18;
                                                                        arra_detalle += 'Delivery Kamill' + ',1 x ' + parseFloat(flete_).toFixed(2) + ',' + parseFloat(flete_).toFixed(2) + ';';
                                                                        detalle += 'OTOT3400179@*@1@*@' + parseFloat(subflete_).toFixed(2) + '@*@' + parseFloat(subflete_).toFixed(2) + '@*@0@*@' + parseFloat(res_g_fle).toFixed(2) + '@*@' + flete_ + '@*@0.00@*@' + co_pto_venta + '@*@' + '0' + '@*@' + cod_cliente + '@*@0.00@*@L@-@';
                                                                    } else {
                                                                        subflete_ = 0, res_g_fle = 0, flete_ = 0;
                                                                    }
                                                                    sub_impri = sub_impri + parseFloat(flete_);
                                                                    if (cod_cliente == '210' || cod_cliente == '220') {
                                                                        observ_venta = myForm_c.getItemValue('observ_venta');
                                                                    } else {
                                                                        observ_venta = (myForm_c.getItemValue('por_blogger')).length > 0 ? myForm_c.getItemValue('por_blogger') : '.';
                                                                    }
                                                                    if (co_pto_venta == '6') {
                                                                        var ruc_ref = myForm_c.getItemValue('ruc_provee');
                                                                        var ref_doc = myForm_c.getItemValue('ref_doc');
                                                                        var ref_monto = myForm_c.getItemValue('ref_mon');
                                                                    } else {
                                                                        ruc_ref = '0', ref_doc = '0', ref_monto = '0', nom_ref = '';
                                                                    }
                                                                    cadena_doc = "", plan_ss = "";
                                                                    if (st_contingencia === 'S') {
                                                                        st_manual = st_contingencia, plan_ss = myForm_b.getItemValue('sel_planilla');
                                                                    } else {
                                                                        st_manual = st_contingencia, plan_ss = co_planilla_cobranza;
                                                                    }

                                                                    cadena_doc = co_pto_venta + '@*@' + cod_cliente + '@*@' + cod_direcc + '@*@' + t_d_admin + '@*@' + st_manual + '@*@' + suma + '@*@' + observ_venta + '@*@' + suma + '@*@' + myForm_c.getItemValue('cambio_doc_emi') + '@*@' + plan_ss + '@*@' + co_vendedor + '@*@' + document.getElementsByName("fec")[0].value + '@*@' + document.getElementsByName("fec_vto_doc_emi")[0].value + '@*@' + myForm_c.getItemValue('doc_doc_emi') + '@*@' + observ_venta + '@*@' + st_flete + '@*@' + parseFloat(flete_) + '@*@' + selec_afec_igv + '@*@' + ruc_ref + "@*@" + ref_doc + "@*@" + ref_monto + '@*@' + st_req;
                                                                    cadena_no_efec = "0";
                                                                    if (cod_cliente.length > 6) {
                                                                        continua = 1;
                                                                    } else {
                                                                        if (parseFloat(suma) + parseFloat(myForm_d.getItemValue('nu_ncredito')) >= 700) {
                                                                            myForm_d.enableItem('regventa');
                                                                            dhtmlx.message({ type: "error", text: "Para ventas mayores a 700(incluido FLETE), debe ingresar un DNI correcto. (8 digitos)", expire: 7000 });
                                                                            continua = 0, countclick = 0;
                                                                        } else {
                                                                            continua = 1;
                                                                        }
                                                                    }
                                                                    if (continua == 1 && valida == 1) {
                                                                        if (selec_afec_igv == '10') {
                                                                            tipoaf_igv = st_contingencia === 'S' ? " DE CONTINGENCIA" : "  NORMAL ";
                                                                        } else {
                                                                            tipoaf_igv = " <font style=\" font-weight: bold;  font-size: 180%; \"> A TITULO GRATUITO </font>";
                                                                        }
                                                                        var msje = "";

                                                                        if (t_d_admin == '01') {
                                                                            msje = " <font style=\" font-weight: bold;  font-size: 180%; \"> FACTURA </font>"
                                                                        } else {
                                                                            msje = " BOLETA   "
                                                                        }

                                                                        console.log(cadena_doc + '|' + detalle + '|' + cadena_pago + '|' + num_filas + '|' + for_num);
                                                                        dhtmlx.confirm('Confirme registrar una ' + msje + tipoaf_igv, function (result) {
                                                                            if (result === Boolean(true)) {
                                                                                myLayout.cells("a").progressOn();
                                                                                myLayout.cells("b").progressOn();
                                                                                var formData = { emp: emp, co_cli: cod_cliente, tipo_doc: t_d_admin, cadena_det: detalle, cadena_doc: cadena_doc, num_filas: num_filas, cadena_pago: cadena_pago, num_pago: for_num, usuario: usuario, docu: myForm_c.getItemValue('doc_doc_emi') }; //Array 
                                                                                var sigue = 0;
                                                                                if (st_contingencia === 'N') {
                                                                                    if (t_d_admin == '01') {
                                                                                        var docc = myForm_c.getItemValue('doc_doc_emi').substring(0, 2);
                                                                                        docc == 'F0' ? (sigue = 1) : (sigue = 0);
                                                                                    } else {
                                                                                        var docc = myForm_c.getItemValue('doc_doc_emi').substring(0, 2);
                                                                                        docc == 'B0' ? (sigue = 1) : (sigue = 0);
                                                                                    }
                                                                                } else {
                                                                                    sigue = 1;
                                                                                }
                                                                                if (sigue == '1') {
                                                                                    $.ajax({
                                                                                        type: "POST", data: formData, url: BASE_URL + "xml/pv0101/paquete_venta.php", beforeSend: function () {
                                                                                        }, success: function (response) {
                                                                                            var st_tarjeta = '', xresul, x_deresult;
                                                                                            var json = eval(response);
                                                                                            for (var i in json) {
                                                                                                xresul = json[i].X_RESULT, x_deresult = json[i].X_DE_RESULT;
                                                                                            }
                                                                                            if (xresul == '1') {
                                                                                                st_tarjeta = parseFloat(myForm_d.getItemValue('valor_compro')) > 0 ? 'S' : 'N';
                                                                                                let rptapack = x_deresult.split("@");
                                                                                                if (st_contingencia == 'S') {
                                                                                                    dhtmlx.message({
                                                                                                        type: "alert-warning", title: "Resultado Venta", ok: "Conforme", text: "DOCUMENTO " + rptapack[1] + " REGISTRADO EN LA PLANILLA :" + plan_ss, callback: function (result) {
                                                                                                            myLayout.cells("a").progressOff(), myLayout.cells("b").progressOff();
                                                                                                            dhtmlx.confirm({
                                                                                                                title: "Informativo", ok: "Si de Contingencia", cancel: "No, Doc. Electronicos", text: "¿ Desea continuar registrando Documento de Contingencia ? ", callback: function (result) {
                                                                                                                    reiniciar_datos();
                                                                                                                    if (result === false) {
                                                                                                                        st_contingencia = 'N', carga_pto_venta(cod_cliente, fecha_fn, st_contingencia), myForm_b.hideItem('sel_planilla'), myForm_b.showItem('nro_pla'), myForm_b.showItem('abrir_pla'), myForm_b.showItem('cerrar_pla'), myForm_c.uncheckItem('chek_conti'), myForm_b.hideItem('lab_conti');
                                                                                                                    }
                                                                                                                }
                                                                                                            });
                                                                                                        }
                                                                                                    });
                                                                                                } else {
                                                                                                    firma_doc(emp, period, mes, anho, rptapack[1], t_d_admin, st_tarjeta, '0', '0', '0', num_filas);
                                                                                                }
                                                                                            } else {
                                                                                                myLayout.cells("a").progressOff(), myLayout.cells("b").progressOff(), countclick = 0;
                                                                                                if (xresul == -100) {
                                                                                                    registra_errores(' Fail paquete_venta.php ajax() ' + x_deresult, "datapo010502:finis_pasos", 'NO', co_comprobante_doc);
                                                                                                    dhtmlx.message({ title: "Informativo", type: "alert-warning", text: x_deresult });
                                                                                                } else {
                                                                                                    dhtmlx.message({ type: "error", text: "Se produjo un error al registrar..." + x_deresult, expire: 5000 });
                                                                                                    registra_errores(' Fail paquete_venta.php ajax() ' + x_deresult, "datapo010502:finis_pasos", 'SI', co_comprobante_doc);
                                                                                                }

                                                                                            }
                                                                                        }, error: function (err) {
                                                                                            myLayout.cells("a").progressOff();
                                                                                            myLayout.cells("b").progressOff();
                                                                                            dhtmlx.message({ type: "error", text: "Se produjo un error al registrar...", expire: 5000 });
                                                                                            registra_errores(' Fail paquete_venta:ajax() ' + JSON.stringify(err, null, 2), "datapv0101:paquete_venta", 'NO', co_comprobante_doc);
                                                                                        }
                                                                                    });
                                                                                } else {
                                                                                    countclick = 0;
                                                                                    dhtmlx.message({ type: "error", text: "Se podujo un error con la serie del documento.", expire: 5000 });
                                                                                }
                                                                            } else {
                                                                                countclick = 0;
                                                                                myForm_d.enableItem('regventa');
                                                                                myLayout.cells("a").progressOff();
                                                                                myLayout.cells("b").progressOff();
                                                                            }
                                                                        });
                                                                    }
                                                                } else {
                                                                    myForm_d.enableItem('regventa');
                                                                    dhtmlx.message({ type: "error", text: "Ingrese Cantidad en Efectivo. Falta ingresar el pago con POS  (REF. debe ser numeros)...", expire: 5000 });
                                                                    countclick = 0;
                                                                }
                                                            } else {
                                                                myForm_d.enableItem('regventa');
                                                                dhtmlx.message({ type: "error", text: "Falta ingresar el c\u00f3digo  de Carnet o Ticket del  Cliente (Hanna - Eventos).", expire: 5000 });
                                                                countclick = 0;
                                                            }
                                                        } else {
                                                            myForm_d.enableItem('regventa');
                                                            dhtmlx.message({ type: "error", text: "No hay niguna PLANILLA Abierta, Abrir una Nueva, para poder continuar...", expire: 5000 });
                                                            countclick = 0;
                                                        }
                                                    } else {
                                                        myForm_d.enableItem('regventa');
                                                        myForm_a.attachEvent("onValidateError", function (name, value, result) {
                                                        });
                                                        dhtmlx.message({ type: "error", text: "No se ingres\u00f3 ninguna OBSERVACI\u00d3N o  No ingres\u00d3 ning\u00fan CLIENTE...", expire: 5000 });
                                                        countclick = 0;
                                                    }
                                                }
                                            } else {
                                                myForm_d.enableItem('regventa');
                                                countclick = 0;
                                                dhtmlx.message({ type: "error", text: "La fecha no est\u00e1 dentro del Periodo Actual : " + period + " Cambie de FECHA, Por favor", expire: 5000 });
                                                countclick = 0;
                                            }
                                            myLayout_caja.cells("b").progressOff();
                                        }
                                    });
                                } else {
                                    dhtmlx.message({ type: "error", text: "Error, ya se envio esta serie...", expire: 3000 });
                                }
                                myLayout.cells("a").progressOff();
                                myLayout.cells("b").progressOff();
                                break;
                        }
                    });
                    myForm_b.attachEvent("onButtonClick", function (name) {
                        switch (name) {
                            case 'abrir_pla':
                                dhtmlx.confirm("Desea Abrir una Planilla...", function (result) {
                                    if (result === Boolean(true)) {
                                        $.ajax({
                                            type: "POST", url: BASE_URL + 'get/datapv0101/abrir_planilla/' + myForm_c.getSelect('moneda_doc_ami').value + '/541/' + co_pto_venta,
                                            beforeSend: function () {
                                                myLayout_caja.cells("b").progressOn();
                                            }, success: function (response) {
                                                if (response == '1') {
                                                    carga_planilla();
                                                } else {
                                                    dhtmlx.message({ type: "error", text: "Error al  generar la Planilla.  Intente nuevamente , Por favor", expire: 3000 });
                                                }
                                                myLayout_caja.cells("b").progressOff();
                                            }
                                        });
                                    }
                                });
                                break;
                            case 'cerrar_pla':
                                dhtmlx.confirm("Desea Cerrar la Planilla??..", function (result) {
                                    if (result === Boolean(true)) {
                                        $.ajax({
                                            type: "POST", url: BASE_URL + "get/datapv0101/cerrar_planilla", beforeSend: function () {
                                                myForm_b.clear();
                                            }, success: function (response) {
                                                if (response == '1') {
                                                    carga_planilla();
                                                    dhtmlx.message({
                                                        title: "Informativo", type: "alert-warning", text: "Planilla Cerrada  con Exito"
                                                    });
                                                    co_planilla_cobranza = '0';
                                                } else {
                                                    dhtmlx.message({ type: "error", text: "Seleccione un producto al generar el Documento... Por favor", expire: 3000 });
                                                }
                                            }
                                        });
                                    }
                                });
                                break;
                        }
                    });
                    break;
                case 'N':
                    tabbar.tabs("a12").hide("a12"), tabbar.tabs("a18").hide("a18");
                    carga_grilla_productos(SERIE_LIS, PTO_VTA, LIS_PREC, st_igv), carga_lista_ver_precios(SERIE_LIS, PTO_VTA, LIS_PREC, st_igv);
                    carga_promocion();
                    break;
                default:
                    dhtmlx.message({ type: "error", text: "Verifique que tenga Pto de Vta asignado, Precio de Lista y Serie Listado!...", expire: 5000 });
                    break;
            }
            myForm_a.reloadOptions('selec_vendedor', BASE_URL + 'get/datapv0101/selct_vendedor/' + PTO_VTA);
        }
    });
    myLayout.cells("a").hideHeader();
    myLayout.cells("a").setWidth(620);
    var fecha = new Date();
    myForm_a.setItemValue('fec', fecha);
    myForm_a.attachEvent("onFocus", function (name) {
        switch (name) {
            case 'ruc_dni':
                ventana_co_cata_padre('ruc_dni', '0');
                break;
            case 'num_pedido':
                ventana_pedidos_x_atender();
                break;
        }
    });
    myForm_a.attachEvent("onEnter", function (name) {
        agregar_productos(myForm_a.getItemValue('cod_barrasacn'));
    });
    myForm_a.attachEvent("onChange", function (name, value) {
        switch (name) {
            case 'selec_vendedor':
                f_selectvendedor();
                co_vendedor = value;
                salotarjeta = myForm_d.getItemValue('valor_compro'), saldo_vuelto = myForm_d.getItemValue('vuelt_pago');
                saldoefectivo = myForm_d.getItemValue('entreg_pago');
                if (co_vendedor == '10000011') {
                    valor_efectivo = '0';
                    st_nota = 'N', nota_cre = '';
                    var im_total = myForm_d.getItemValue('total_doc_emi');
                    st_nota = 'N', nota_cre = '';
                    var total_nota2 = parseFloat(parseFloat(im_total) + parseFloat(nu_ncredito)).toFixed(2);
                    myForm_d.setItemValue('total_doc_emi', total_nota2);
                    nu_ncredito = '0';
                    myForm_c.setItemValue('doc_not_cre', ''), myForm_d.setItemValue('nu_ncredito', '0'), myForm_c.uncheckItem('chek_nota'), myForm_d.setItemValue('comproba_pago', '.');
                    myForm_d.hideItem('myGridPagos'), myForm_d.disableItem('entreg_pago'), myForm_d.disableItem('sald_pago'), myForm_d.disableItem('vuelt_pago');
                    myForm_d.disableItem('valor_compro'), myForm_d.disableItem('select_pago'), myForm_d.disableItem('banco_pago'), myForm_d.disableItem('comproba_pago');
                    myForm_d.setItemValue('valor_compro', '0.00'), myForm_d.setItemValue('vuelt_pago', '0.00');
                    myForm_d.setItemValue('entreg_pago', '0');
                } else {
                    valor_efectivo = '0', st_nota = 'N', nota_cre = '', nu_ncredito = '0';
                    myForm_c.setItemValue('doc_not_cre', ''), myForm_d.setItemValue('nu_ncredito', '0');
                    myForm_c.uncheckItem('chek_nota'), myForm_d.enableItem('entreg_pago'), myForm_d.enableItem('sald_pago'), myForm_d.enableItem('vuelt_pago');
                    myForm_d.enableItem('valor_compro'), myForm_d.showItem('myGridPagos'), myForm_d.enableItem('select_pago'), myForm_d.enableItem('banco_pago');
                    myForm_d.enableItem('comproba_pago'), myForm_d.setItemValue('comproba_pago', '.'), myForm_d.setItemValue('valor_compro', myForm_d.getItemValue('total_doc_emi'));
                    myForm_d.setItemValue('vuelt_pago', '0'), myForm_d.setItemValue('entreg_pago', '0');
                }
                break;
        }
    });
    myForm_a.attachEvent("onButtonClick", function (name) {
        switch (name) {
            case 'new_de':
                if (co_pto_venta != 4) {
                    console.log('aqui');
                    agregar_productos('0');
                } else {
                    $.ajax({
                        type: "POST", url: BASE_URL + 'get/datapv0101/lista_remate_all/' + serie_listado + '/' + co_pto_venta + '/' + listado_precios + '/' + st_igv,
                        beforeSend: function () {
                        }, success: function (response) {
                            var json = eval(response);
                            for (var i in json) {
                                click_agrega_prod(parseInt(json[i].CANT), parseFloat(json[i].CANT) * parseFloat(Math.round10(parseFloat(json[i].PRECIO).toFixed(2), -1)), parseInt(json[i].DESC1), parseFloat(json[i].CANT), parseFloat(json[i].PRECIO), json[i].CATALOGO, json[i].NOMBRE, json[i].UNID);
                            }
                        }
                    });
                }
                break;
            case 'nuevo_cliente':
                regitra_cliente();
                break;
            case 'dele_det':
                borrar_producto(id_numrow);
                break;
            case 'guardar':
                var pedido = myForm_a.getItemValue('num_pedido');
                $.ajax({
                    type: "POST", url: BASE_URL + 'get/datapv0101/verifica_pedido/' + pedido,
                    beforeSend: function () {
                    }, success: function (response) {
                        if (response == '1') {
                            tabbar.tabs("a16").setActive();
                        } else {
                            num_filas = 0;
                            if (myForm_a.validate() === Boolean(true)) {
                                var example = mygridVN.getAllItemIds();
                                var numbers = example.split(',');
                                detalle = "";
                                if (example.length == '0') {
                                    detalle = "";
                                    cadena_doc = co_pto_venta + '@*@' + cod_cliente + '@*@' + cod_direcc + '@*@' + '0' + '@*@' + st_manual + '@*@' + '0' + '@*@' + '0' + '@*@0.00@*@' + '0' + '@*@' + '0' + '@*@' + myForm_a.getItemValue('observ') + '@*@0@*@77@*@' + myForm_a.getItemValue('num_pedido') + '@*@' + '0' + '@*@' + '0' + '@*@' + '0' + '@*@N@*@' + '0' + '@*@' + document.getElementsByName("fec")[0].value + '@*@' + document.getElementsByName("fec")[0].value + '@*@' + co_vendedor + '@*@' + '42@*@' + s_icbper;
                                } else {
                                    arra_detalle = "";
                                    var i = 0;
                                    num_filas = numbers.length;
                                    while (i < numbers.length) {
                                        arra_detalle_1 = "";
                                        im_dscto_x_producto = '0.00';
                                        igv_afecto_x_fila = '0.0';
                                        var cant = parseFloat(mygridVN.cells(numbers[i], 3).getValue()).toFixed(2);
                                        var subtotal_g = parseFloat(mygridVN.cells(numbers[i], 5).getValue());
                                        var total_g = parseFloat(mygridVN.cells(numbers[i], 4).getValue());
                                        var p_uni_v = parseFloat(mygridVN.cells(numbers[i], 6).getValue()).toFixed(2);
                                        var desc1 = parseFloat(mygridVN.cells(numbers[i], 11).getValue()).toFixed(2);
                                        var st_descto = (mygridVN.cells(numbers[i], 9).getValue());
                                        var sumg = total_g;
                                        var res_g = total_g - subtotal_g;
                                        im_total_fila = (sumg).toFixed(1) - im_dscto_x_producto; //1.18 => N + 0.18*N
                                        detalle = detalle + mygridVN.cells(numbers[i], 0).getValue() + '@*@' + mygridVN.cells(numbers[i], 3).getValue() + '@*@' + (parseFloat(p_uni_v) / 1.18).toFixed(2) + '@*@' + subtotal_g + '@*@' + im_dscto_x_producto + '@*@' + (res_g).toFixed(1) + '@*@' + im_total_fila + '@*@0.00@*@' + co_pto_venta + '@*@' + '0' + '@*@' + cod_cliente + '@*@0.000' + '@*@0@*@L@*@' + mygridVN.cells(numbers[i], 9).getValue() + '@*@' + desc1 + '@-@';
                                        var ult_digi = mygridVN.cells(numbers[i], 1).getValue().length;
                                        var rang_strin = ult_digi - 34;
                                        arra_detalle_1 = mygridVN.cells(numbers[i], 1).getValue().substring(rang_strin) + ',' + mygridVN.cells(numbers[i], 0).getValue() + ',' + Math.round10((mygridVN.cells(numbers[i], 5).getValue()), -1) + ';';
                                        i++;
                                        arra_detalle += arra_detalle_1;
                                    }
                                    cadena_doc = "";
                                    cadena_doc = co_pto_venta + '@*@' + cod_cliente + '@*@' + cod_direcc + '@*@' + '0' + '@*@' + st_manual + '@*@' + '0' + '@*@' + '0' + '@*@0.00@*@' + '0' + '@*@' + '0' + '@*@' + myForm_a.getItemValue('observ') + '@*@0@*@77@*@' + myForm_a.getItemValue('num_pedido') + '@*@' + '0' + '@*@' + '0' + '@*@' + '0' + '@*@N@*@' + '0' + '@*@' + document.getElementsByName("fec")[0].value + '@*@' + document.getElementsByName("fec")[0].value + '@*@' + co_vendedor + '@*@' + '42@*@' + s_icbper;
                                }
                                dhtmlx.confirm("Se cargar\u00e1 la lista de Promoci\u00f3n...", function (result) {
                                    if (result === Boolean(true)) {
                                        var formData = { cadena_det: detalle, cadena_doc: cadena_doc, num_filas: num_filas }; //Array 
                                        $.ajax({
                                            type: "POST", data: formData, url: BASE_URL + "xml/pv0101/paquete.php",
                                            beforeSend: function () {
                                            }, success: function (response) {
                                                if (response == '1') {
                                                    tabbar.tabs("a16").setActive(), sumt = '0.00', carga_promocion();
                                                    dhtmlx.message({
                                                        title: "Informativo", type: "alert-warning", text: "Promociones cargadas..: " + num_filas, callback: function () {
                                                            if (RESPONSABLE == 'S') {
                                                                dhxGridlista.clearAll();
                                                                loadGridData(BASE_URL + 'get/datapv0101/lista_producto_todo/' + serie_listado + '/' + listado_precios + '/' + co_pto_vent, true, dhxGridlista, dhxWinaddrows3, false);
                                                                mygridVN.clearAll();
                                                                carga_num_pedido();
                                                                myForm_c.setItemValue('import_doc_ami', '0.00'), myForm_d.setItemValue('total_doc_emi', '0.00'), myForm_c.setItemValue('igv_doc_ami', '0.00'), myForm_c.uncheckItem('chek_man');
                                                                myForm_d.setItemValue('entreg_pago', '0'), myForm_d.setItemValue('sald_pago', '0.00'), myForm_c.setItemValue('num_pedido_atender', '.'), myForm_c.uncheckItem('chek_cre'), myForm_c.disableItem('fec_vto_doc_emi'), v_subtotal.innerHTML = '0.0', v_igv.innerHTML = '0.0', v_total.innerHTML = '0.0';
                                                            } else {
                                                                dhxGridlista.clearAll();
                                                                loadGridData(BASE_URL + 'get/datapv0101/lista_producto_todo/' + serie_listado + '/' + listado_precios + '/' + co_pto_vent, true, dhxGridlista, dhxWinaddrows3, false);
                                                                mygridVN.clearAll();
                                                                myForm_a.setItemValue('ruc_dni', ''), myForm_a.setItemValue('razonsocial', ''), myForm_a.setItemValue('direccion_a', '');
                                                                mygridVN.clearAll();
                                                                v_subtotal.innerHTML = '0.0', v_igv.innerHTML = '0.0', v_total.innerHTML = '0.0';
                                                            }
                                                        }
                                                    });
                                                } else {
                                                    dhtmlx.message({ type: "error", text: "Error al registrar el Documento... Por favor", expire: 3000 });
                                                }
                                            }
                                        });
                                    }
                                });
                            } else {
                                dhtmlx.message({ type: "error", text: "Rellene los Campos con * (ASTERISCO)...", expire: 3000 });
                            }
                        }
                    }
                });
                break;
        }
    });
    mygridVN = new dhtmlXGridObject(myForm_a.getContainer("myGrid"));
    mygridVN.setHeader("CODIGO,PRODUCTO,UND,CANT,MONTO,S/IGV,PU,,,ST_DESCTO,DESC2,DESC1,,ICBPER,ST_DETRAC", null, ["text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;"]);
    mygridVN.setColAlign("left,left,right,right,center,right,left,right,right,right,right,right,center,center,center");
    mygridVN.setColTypes("ro,ro,ro,ron,ron,ron,ro,img,ro,ro,ro,ro,img,ro,ro");
    mygridVN.setColSorting("str,str,str,int,int,int,str,str,strs,str,str,str,str,str,str");
    mygridVN.setInitWidthsP("18,64,1,8,10,13,1,7,7,7,7,0,10,2,1");
    mygridVN.setColumnIds("cod,prod,unid,cant,monto,sigv,punita,valor1,valor2,descto,valor3,valor4,valor5,icbper,st_detrac");
    mygridVN.setNumberFormat("0,000.00", 4), mygridVN.setNumberFormat("0,000.00", 5);
    mygridVN.setColumnHidden(0, true), mygridVN.setColumnHidden(6, true), mygridVN.setColumnHidden(2, true), mygridVN.setColumnHidden(5, true);
    mygridVN.setColumnHidden(8, true), mygridVN.setColumnHidden(9, true), mygridVN.setColumnHidden(10, true), mygridVN.setColumnHidden(11, true), mygridVN.setColumnHidden(13, true), mygridVN.setColumnHidden(14, true);
    mygridVN.attachEvent("onRowSelect", function (id, ind) {
        id_numrow = id;
        nom_proeliminar = mygridVN.cells(id_numrow, 1).getValue();
        if (ind == 12) {
            borrar_producto(id_numrow);
            desactiva_grati();
        }
    });
    mygridVN.setNoHeader(true);
    mygridVN.init();

    function actualiza_serie(cod, adm, pto) {
        $.ajax({
            type: "POST", url: BASE_URL + 'get/datapv0101/actu_serie/' + cod + '/' + adm + '/' + pto + '/' + st_contingencia, beforeSend: function () {
            }, success: function (response) {
                myForm_c.setItemValue('doc_doc_emi', response);
            }
        });
    }
    function desactiva_nc(nu_ncredito) {
        nota_cre = '';
        myForm_d.hideItem('nu_ncredito');
        myForm_d.setItemValue('entreg_pago', '0'), myForm_d.setItemValue('vuelt_pago', '0.00'), myForm_d.setItemValue('nu_ncredito', '0');
        var im_total = myForm_d.getItemValue('total_doc_emi');
        total_nota = parseFloat(parseFloat(im_total) + parseFloat(nu_ncredito)).toFixed(2);
        st_nota = 'N', nota_cre = '';
        myForm_c.setItemValue('doc_not_cre', ''), myForm_d.setItemValue('valor_compro', total_nota), myForm_d.setItemValue('vuelt_pago', '0.00');
        myForm_d.setItemLabel('regventa', 'PAGAR S/ ' + parseFloat(total_nota).toFixed(2));
        nu_ncredito = 0;
        myLayout_caja.cells("b").progressOff();
        calculateFooterValues();
    }
    function autocomplete_off(myForm) {
        myForm.forEachItem(function (id) {
            if (myForm.getItemType(id) == "input") {
                myForm.getInput(id).autocomplete = "off";
            }
        });
    }
    function firma_doc(emp, period, mes, anho, doc, t_d_admin, st_tarjeta, nom_concepto, DOCANCESTRO, TIPO_DOC_ADM_NOTA, nrofilas) {
        $.ajax({
            type: "POST", url: BASE_URL + 'xml/ca010201/export_xml_clob.php?emp=' + emp + '&tip_mod_nc=' + TIPO_DOC_ADM_NOTA + '&periodo=' + period + '&mes=' + mes + '&anho=' + anho + '&doc=' + doc + '&t_d_admin=' + t_d_admin,
            beforeSend: function () {
            }, success: function (response) {
                var respond = "", hash = "", ressult = "", alertamsg = "", signaturevalue = "", codrptasunat = -1;
                if (t_d_admin == '01') {
                    var valuesign = response.split(";", 4);
                    if (valuesign.length == '1') {
                        respond = valuesign[0];
                    } else {
                        valuenro = (valuesign[0]).search(" HA SIDO ACEPTADO");//var value = valuesign[0].split(",", 2);
                        codrptasunat = valuesign[4];
                        respond = valuesign[1], hash = valuesign[2], signaturevalue = valuesign[3];
                        alertamsg = valuesign[0];
                    }
                } else {//03
                    var valuesign = response.split(";", 3);
                    respond = valuesign[0], hash = valuesign[1], signaturevalue = valuesign[2];
                    valuenro = respond === 'XML_regsitrado' ? 1 : 0;
                    codrptasunat = valuesign[3];
                    alertamsg = t_d_admin === '03' ? "BOLETA DE VENTA CORRECTA" : "NOTA DE CREDITO CORRECTA";
                }
                let sub_tt = parseFloat(sub_impri).toFixed(2);
                var url_pdf = BASE_URL + "xml/pv0101/ima_pdf417.php?icbper=" + s_icbper + "&st_detra=" + ST_DETRACCION + "&signaturevalue=" + signaturevalue + "&doc_ref=" + ref_doc + "&ruc_ref=" + ruc_ref + "&t_d_admin=" + t_d_admin + "&dscto=" + suma_desc + "&boni=" + parseFloat(suma_boni).toFixed(2) + "&direc=" + direc + "&hash=" + hash + "&can_tarjeta=" + myForm_d.getItemValue('valor_compro') + "&st_tarjeta=" + st_tarjeta + "&cant_nota=" + parseFloat(nu_ncredito).toFixed(2) + "&st_nota=" + st_nota + "&nota_cre=" + nota_cre + "&pto_vta=" + co_pto_venta + "&bodypro=" + arra_detalle + "&st_credito=" + st_che_cred + "&docu=" + doc + "&igv=" + parseFloat(v_igvs).toFixed(2) + "&sub=" + parseFloat(sub_tt).toFixed(2) + "&total=" + suma + "&vuelto=" + parseFloat(myForm_d.getItemValue('vuelt_pago')).toFixed(2) + "&efect=" + parseFloat(myForm_d.getItemValue('entreg_pago')).toFixed(2) + '&rucdni=' + cod_cliente + '&nom=' + myForm_a.getItemValue('razonsocial').substring(0, 20).replace("&", "%26") + "&filas=" + num_filas + '&copia=0' + '&vendedor=' + co_vendedor + '&fecha=' + document.getElementsByName("fec")[0].value + '&obser=' + observ_venta + '&st_flete=' + st_flete + '&imp_flete=' + flete_ + '&afectaigv=' + selec_afec_igv + '&accion=';
                if (valuenro > 0 || codrptasunat == 0) {
                    if (t_d_admin === '01' || t_d_admin === '03') {
                        $.ajax({
                            type: "POST", url: url_pdf + 'mail',
                            beforeSend: function () {
                            }, success: function (response) {
                                ruta_print = response, imprimir_remoto(response, t_d_admin, doc, nrofilas);
                            }
                        });
                        dhtmlx.message({
                            type: "alert-warning", title: "Resultado Venta", ok: "Conforme", text: "OSE-TELEFONICA : " + alertamsg, callback: function (result) {
                                myLayout.cells("a").progressOff(), myLayout.cells("b").progressOff(), reiniciar_datos();
                            }
                        });
                    } else { //NC
                        $.ajax({
                            type: "POST", url: BASE_URL + "xml/pv0101/ticket_nota.php?accion=mail&signaturevalue=" + signaturevalue + "&tipo_nc=" + cod_concepto + "&hash=" + hash + "&obs=" + OBS_NC + "&fancestro=" + document.getElementsByName("fec_doc_mod")[0].value + "&ancestro=" + DOCANCESTRO + "&concepto=" + nom_concepto + "&pto_vta=" + co_pto_venta + "&bodypro=" + arra_detalle_nota + "&st_credito=N" + "&docu=" + NUM_NOTA + "&igv=" + v_igv_no + "&sub=" + subtotal_n + "&total=" + total_n + "&vuelto=" + '0.0' + "&efect=" + '0.00' + '&rucdni=' + CO_CLI_NOTA + '&nom=' + DE_NOM_CLI_NOTA.substring(0, 20).replace("&", "%26") + "&filas=" + filas + '&copia=0' + '&vendedor=' + CO_VENDEDOR_NOTA + '&fecha=' + FE_REG_NOTA,
                            beforeSend: function () {
                            }, success: function (response) {
                                ruta_print = response, imprimir_remoto(response, t_d_admin, doc, nrofilas);
                            }
                        });
                        dhtmlx.confirm({
                            title: "Informativo", ok: "Volver a Imprimir", cancel: "Conforme", text: "Se Registr\u00f3 con Exito... item(s): " + filas, callback: function (result) {
                                result === true ? imprimir_remoto(ruta_print, t_d_admin, doc, nrofilas) : null;
                                form_nota_credito.setItemValue('nom_clie', ''), form_nota_credito.setItemValue('num_doc_mod', ''), form_nota_credito.setItemValue('fec_doc_mod', ''), form_nota_credito.setItemValue('num_nota_cred', ''), form_nota.setItemValue('doc_buscar_nota', '');
                                dhxGrid_nota.clearAll();
                                myLayout_nota.cells("b").progressOff(), myLayout_nota.cells("a").progressOff();
                            }
                        });
                    }
                } else {
                    dhtmlx.confirm({
                        title: "Resultado Venta", ok: "Ver Ticket", cancel: "Conforme", text: "OSE-TELEFONICA : " + respond, callback: function (result) {
                            result === true ? imprimir_ticket(url_pdf + '0', t_d_admin, doc, nrofilas) : null; // result === true ? imprimir_remoto(ruta_print, t_d_admin, doc, nrofilas) : null;
                            myLayout.cells("a").progressOff(), myLayout.cells("b").progressOff(), reiniciar_datos();
                        }
                    });
                    registra_errores(' Fail respond !== ressult ' + respond + ' response = ' + response, "datapv0101:export_xml_clob.php", 'NO', co_comprobante_doc);
                }
            }, error: function (err) {
                registra_errores(' Fail export_xml_clob:ajax() ' + JSON.stringify(err, null, 2), "datapv0101:regventa", 'SI', co_comprobante_doc);
            }
        });
    }
    function imprimir_ticket(urlpdf, t_d_admin, doc, nrofilas) { //20123487541-03-B012-15572
        window.open(urlpdf, 'Voucher', 'width=800,height=700').print({ bUI: true, bSilent: true, bShrinkToFit: true });
    }
    function b_ini_extractor() {
        dhxW_ex = new dhtmlXWindows();
        dhxW_ext = dhxW_ex.createWindow("w_extra", 75, 5, 1250, 550);
        dhxW_ext.setText("Extracto Bancario - Conciliación");
        layoutext = new dhtmlXLayoutObject(dhxW_ex.window("w_extra"), '2E');
        form_toll = [{ type: "settings", position: "label-left", labelWidth: "auto", offsetLeft: 0 },
        { type: "button", width: 600, offsetLeft: 80, offsetTop: 0, className: "button_pagofin", value: "SUBIR DATOS ", name: "b_xtract", disabled: false, hidden: false }
        ];
        layoutext.cells("b").hideHeader();
        layoutext.cells("a").hideHeader();
        layoutext.cells("a").setHeight(70);
        form_tool = layoutext.cells("a").attachForm(form_toll);

        layoutext.setSeparatorSize(0, 0);
        layoutext.setSeparatorSize(1, 0);
        layoutext.cells("b").attachHTMLString('<div id="spreadsheet_container"></div>');
        var spreadsheet = new dhx.Spreadsheet('spreadsheet_container', { importModulePath: "https://cdn.dhtmlx.com/libs/excel2json/1.0/worker.js", rowsCount: 200, colsCount: 50, autoFormat: false, readonly: false });
        spreadsheet.toolbar.data.add({ type: "button", id: "import-xlsx", value: "Import (.xlsx)" });
        spreadsheet.events.on("beforeEditStart", function () {
            return false;
        });

        form_tool.attachEvent("onButtonClick", function (name) {
            var colum = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "AA", "AB", "AC", "AD", "AE", "AF"];
            var CINI = "B";
            var FINI = 4;
            var fila = 0;
            var COLFIN = "";
            var COLNUM = 0;
            var FNUM = 4;
            while (spreadsheet.getValue(CINI + FNUM).length > 0) {
                layoutext.cells("b").progressOn();
                fila++, FNUM++;
                form_tool.setItemLabel('b_xtract', 'SUBIENDO... ' + fila + " FILA(S) ");
            }
            colum.forEach(function (elem) {
                var cid = elem + "3", val = spreadsheet.getValue(cid);
                if (val != null && val.length > 0) {
                    COLFIN = elem, COLNUM++;
                }
            });
            form_tool.setItemLabel('b_xtract', 'SE CARGARON ' + fila + " FILA(S) ");
            var data_total = "", numfilas;
            for (i = 0; i < FNUM; i++) {
                i === 0 ? dhxW_ex.window("w_extra").progressOn() : null;
                if (parseInt(i) >= parseInt(FINI)) {
                    var values = spreadsheet.getValue(CINI + i + ":" + COLFIN + i), valstring = (values.toString());
                    let data = (valstring).replace(/,/g, "@*@").replace(/\//g, "-").replace(/(@@)/g, "@0@").replace(/á/g, "a").replace(/é/g, "e").replace(/í/g, "i").replace(/ó/g, "o").replace(/ú/g, "u");
                    let leng = parseFloat(data.length) - 3;
                    data = data.substring(0, leng);
                    data_total += utf8_decode(data) + "@-@";
                }
            }
            carga_data_clob(data_total, fila, emp, 'extracto');
            layoutext.cells("b").progressOff();
        });
    }
    function b_ini_deposito() {
        dhxW_ex = new dhtmlXWindows();
        dhxW_ext = dhxW_ex.createWindow("w_extra", 75, 5, 1250, 550);
        dhxW_ext.setText("Deposito Bancario - Conciliación");
        layoutext = new dhtmlXLayoutObject(dhxW_ex.window("w_extra"), '2E');
        form_toll = [{ type: "settings", position: "label-left", labelWidth: "auto", offsetLeft: 0 },
        { type: "button", width: 600, offsetLeft: 80, offsetTop: 0, className: "button_pagofin", value: "SUBIR DATOS ", name: "b_xtract", disabled: false, hidden: false }
        ];
        layoutext.cells("b").hideHeader();
        layoutext.cells("a").hideHeader();
        layoutext.cells("a").setHeight(70);
        form_tool = layoutext.cells("a").attachForm(form_toll);

        layoutext.setSeparatorSize(0, 0);
        layoutext.setSeparatorSize(1, 0);
        layoutext.cells("b").attachHTMLString('<div id="spreadsheet_container"></div>');
        var spreadsheet = new dhx.Spreadsheet('spreadsheet_container', { importModulePath: "https://cdn.dhtmlx.com/libs/excel2json/1.0/worker.js", rowsCount: 200, colsCount: 50, autoFormat: false, readonly: false });
        spreadsheet.toolbar.data.add({ type: "button", id: "import-xlsx", value: "Import (.xlsx)" });
        spreadsheet.events.on("beforeEditStart", function () {
            return false;
        });

        form_tool.attachEvent("onButtonClick", function (name) {
            var colum = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "AA", "AB", "AC", "AD", "AE", "AF"];
            var CINI = "B", FINI = 4, fila = 0, COLFIN = "", COLNUM = 0, FNUM = 4;
            while (spreadsheet.getValue(CINI + FNUM).length > 0) {
                layoutext.cells("b").progressOn();
                fila++, FNUM++;
                form_tool.setItemLabel('b_xtract', 'SUBIENDO... ' + fila + " FILA(S) ");
            }
            colum.forEach(function (elem) {
                var cid = elem + "3", val = spreadsheet.getValue(cid);
                if (val != null && val.length > 0) {
                    COLFIN = elem, COLNUM++;
                }
            });
            form_tool.setItemLabel('b_xtract', 'SE CARGARON ' + fila + " FILA(S) ");
            var data_total = "", numfilas;
            for (i = 0; i < FNUM; i++) {
                i === 0 ? dhxW_ex.window("w_extra").progressOn() : null;
                if (parseInt(i) >= parseInt(FINI)) {
                    var values = spreadsheet.getValue(CINI + i + ":" + COLFIN + i), valstring = (values.toString());
                    let data = (valstring).replace(/,/g, "@*@").replace(/\//g, "-").replace(/(@@)/g, "@0@").replace(/á/g, "a").replace(/é/g, "e").replace(/í/g, "i").replace(/ó/g, "o").replace(/ú/g, "u");
                    let ulimstr = data.substring(data.length, data.length - 3);
                    if (ulimstr === '@*@') {
                        let leng = parseFloat(data.length) - 3;
                        data = data.substring(0, leng);
                    }
                    data_total += utf8_decode(data) + "@-@";
                }
            }
            carga_data_clob(data_total, fila, emp, 'deposito');
            layoutext.cells("b").progressOff();
        });
    }
    function carga_data_clob(xdata_total, fil, empr, xflat) {
        let formData = { data_total: xdata_total, numfilas: fil, emp: empr, flat: xflat };
        $.ajax({
            type: "POST", data: formData, url: BASE_URL + 'xml/pv0101/carga_extracto_bancario.php', beforeSend: function () {
            }, success: function (response) {
                console.log(response);
                if (response == 'OK') {
                    dhtmlx.message({ type: "alert-warning", text: "Datos subidos..., puede cerrar esta ventana..", expire: 0 });
                } else {
                    dhtmlx.message({ type: "alert-error", text: response, expire: 0 });
                }
                xflat === 'extracto' || xflat === 'deposito' ? dhxW_ex.window("w_extra").progressOff() : null;
                if (xflat !== 'deposito') {
                    start_date = document.getElementsByName("fb_des_ext")[0].value;
                    end_date = document.getElementsByName("fb_has_ext")[0].value;
                    dhxGridext.clearAll();
                    loadGridDataVen(BASE_URL + 'get/datapv0101/carga_grilla_extracto/' + '0' + '/' + start_date + '/' + end_date, true, dhxGridext, 'dhxGridext', myLayoext.cells("b"), false);
                }
            }, error: function (err) {
                dhtmlx.message({ type: "error", text: JSON.stringify(err, null, 2), expire: 5000 });
            }
        });
    }
    function reiniciar_datos() {
        var fecha = new Date();
        myForm_a.setItemValue('fec', fecha);
        dhxGridlista.clearAll();
        loadGridData(BASE_URL + 'get/datapv0101/lista_producto_todo/' + serie_listado + '/' + listado_precios + '/' + co_pto_vent, true, dhxGridlista, dhxWinaddrows3, false);
        sumt = '0', suma = '0', v_igvs = '0', nota_cre = '', st_flete = 'N', flete_ = 0, sub_flete_ = 0, countclick = 0, nu_ncredito = '0', valor_efectivo = '0', st_nota = 'N', entreg_pago = '0.00', vuelt_pago = '0.00', valor_compro = '0.00';
        myForm_c.setItemValue('doc_not_cre', ''), myForm_c.uncheckItem('chek_nota'),
            mygridVN.clearAll(), myForm_d.disableItem('regventa'), myForm_d.setItemValue('nu_ncredito', '0'), myForm_c.setItemValue('import_doc_ami', '0.00'), myForm_d.setItemValue('total_doc_emi', '0.00'), myForm_c.setItemValue('igv_doc_ami', '0.00'), myForm_c.uncheckItem('chek_man'),
            myForm_c.uncheckItem('chek_nota'), myForm_c.uncheckItem('chek_fle'), myForm_c.setItemValue('import_flete', '0'), myForm_d.setItemValue('vuelt_pago', '0'), myForm_d.setItemValue('entreg_pago', '0'), myForm_d.setItemValue('sald_pago', '0.00'),
            myForm_d.setItemValue('valor_compro', '0.00'), myForm_d.setItemValue('select_pago', '6'), myForm_d.setItemValue('banco_pago', '01,194-1573143-0-32'), myForm_c.setItemValue('ruc_provee', ''),
            myForm_c.setItemValue('ref_doc', ''), myForm_c.setItemValue('ref_mon', ''), myForm_d.setItemValue('comproba_pago', '.');
        myForm_a.reloadOptions('selec_vendedor', BASE_URL + 'get/datapv0101/selct_vendedor/' + co_pto_venta);
        co_vendedor = co_vendedor_ini;//if (co_pto_venta == 5){ co_vendedor == '90000999' ? co_vendedor  = co_vendedor_ini: '';}
        dhxGrid_Pagos.clearAll(), carga_referVISA(), valida_responsa1();
        myForm_c.uncheckItem('ch_aptreq');
        st_req = 'N';
        carga_pto_venta('151', '01-01-1990', st_contingencia);
        nom_ref = '', myForm_c.setItemValue('por_blogger', '0');
        cod_pedido_promo = '0', myForm_c.setItemValue('num_pedido_atender', '.');
        myForm_c.uncheckItem('chek_cre'), myForm_c.disableItem('fec_vto_doc_emi');
        st_manual = st_contingencia, carga_num_pedido(), myForm_c.setItemValue('ruc_provee', '0'), myForm_c.setItemValue('ref_doc', '0');
        myForm_c.setItemValue('ref_mon', '0'), myForm_c.reloadOptions('selec_afec_igv', BASE_URL + 'get/datapv0101/selec_afec_igv/');
        if (co_pto_venta == '6') {//C.CANJE
            selec_afec_igv = '21';
            myForm_c.setItemValue('selec_afec_igv', '21');
        } else {
            selec_afec_igv = '10';
            myForm_c.setItemValue('selec_afec_igv', '10');
        }
        myForm_d.setItemLabel('regventa', 'PAGAR S/');
    }
    function imprimir_remoto(ruta, t_d_admin, doc, nrofilas) { //20123487541-03-B012-15572
        let n_printer__s = (printer).replace(/[+]/g, " ");
        var config = qz.configs.create(n_printer__s, { rasterize: "false" });
        //console.log( "<?php echo base_url(); ?>xml/pv0101/public/"+co_pto_vent+"/20123487541-" + t_d_admin + "-" + doc + ".pdf");
        var data = [{ type: 'pdf', data: "<?php echo base_url(); ?>xml/pv0101/public/" + co_pto_vent + "/20123487541-" + t_d_admin + "-" + doc + ".pdf" }];
        qz.print(config, data).catch(function (e) {
            dhtmlx.message({ type: "alert-error", text: e });
        });
    }
    function activa_gratis() {
        selec_afec_igv = '21';
        myForm_c.checkItem('ch_gratuita'), myForm_d.setItemValue('entreg_pago', suma), myForm_d.hideItem('myGridPagos'), myForm_d.setItemValue('sald_pago', '0.00'),
            myForm_d.setItemValue('valor_compro', '0.00'), myForm_d.disableItem('select_pago'), myForm_d.setItemValue('select_pago', '6'),
            myForm_d.disableItem('banco_pago'), myForm_d.setItemValue('banco_pago', '01,194-1573143-0-32'),
            myForm_d.disableItem('comproba_pago'), myForm_d.setItemValue('comproba_pago', '.');
        valor_efectivo = suma, carga_referVISA();
    }
    function desactiva_grati() {
        valor_efectivo = 0, selec_afec_igv = '10';
        myForm_c.uncheckItem('ch_gratuita'), myForm_d.setItemValue('entreg_pago', '0.0'), myForm_d.setItemValue('valor_compro', suma);
        myForm_d.setItemValue('sald_pago', suma), myForm_d.setItemValue('vuelt_pago', '0.00');
        myForm_d.showItem('myGridPagos'), carga_referVISA(), myForm_d.enableItem('select_pago'), myForm_d.setItemValue('select_pago', '6');
        myForm_d.enableItem('banco_pago'), myForm_d.setItemValue('banco_pago', '01,194-1573143-0-32'), myForm_d.enableItem('comproba_pago');
        myForm_d.setItemValue('comproba_pago', '.');
    }
    function tab_promo(id) {
        switch (id) {
            case 'a12':
                RESPONSABLE == 'S' ? carga_lista_planilla_realizadas(co_planilla_cobranza) : null;
                break;
            case 'a16':
                carga_promocion();
                break;
        }
    }
    function tab_reportes(fecini, fecfinal, actvId) {
        switch (actvId) {
            case 'r11':
                myLayou__11 = tabbar_rep.tabs(actvId).attachLayout("2U");
                myLayou__11.cells("a").attachHTMLString('<div id="graph_rep" style="height:100%;width:100%;margin:0 auto;padding:30px 3px;box-sizing:border-box;float:left;"></div>'), myLayou__11.cells("b").hideHeader(), myLayou__11.cells("a").hideHeader();
                reporte_r11(fecini, fecfinal);
                break;
            case 'r12':
                myLayou__12 = tabbar_rep.tabs(actvId).attachLayout("2U");
                myLayou__12.cells("a").attachHTMLString('<div id="graph_rep2" style="height:100%;width:100%;margin:0 auto;padding:30px 3px;box-sizing:border-box;float:left;"></div>'), myLayou__12.cells("b").hideHeader(), myLayou__12.cells("a").hideHeader();
                reporte_r12(fecini, fecfinal);
                break;
            case 'r13':
                myLayou__13 = tabbar_rep.tabs(actvId).attachLayout("2U");
                myLayou__13.cells("a").attachHTMLString('<div id="graph_rep3" style="height:100%;width:100%;margin:0 auto;padding:30px 3px;box-sizing:border-box;float:left;"></div>'), myLayou__13.cells("b").hideHeader(), myLayou__13.cells("a").hideHeader();
                reporte_r13(fecini, fecfinal);
                break;
        }
    }
    function grid_mygrid_reportes_oculto(start_date, end_date, id) {
        switch (id) {
            case 'r14':
                gridr14 = tabbar_rep.cells(id).attachGrid(); /*CO_CLIENTE,DE_RAZON_SOCIAL,DE_EMAIL,DE_TELEFONOS,MAXFEREGISTRO,TIMES*/
                gridr14.setHeader(",DNI,NOMBRES,MAIL,CONTACTO,FEC.NAC,DIAS.HAPPY,ULT.COMP.,ULT.COMP.DIAS,F.REGISTRO", null, ["text-align:center;", "text-align:center;", "text-align:center", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;"]);
                gridr14.setColAlign("center,right,left,left,left,left,left,left,left,left");
                gridr14.setColTypes("img,ro,ro,ro,ro,ro,ron,ron,ron,ro");
                gridr14.setColSorting("str,str,str,str,str,srt,int,int,int,date");
                gridr14.setInitWidthsP("5,10,30,30,10,10,10,10,10,10");
                gridr14.attachHeader("&nbsp,#text_filter,#text_filter,#text_filter,#number_filter,#text_filter,#number_filter,#number_filter,#number_filter,#text_filter");
                myTabbar1 = tabbar_rep.tabs(id).attachStatusBar({ height: { dhx_skyblue: 30, dhx_web: 30, dhx_terrace: 30 }['<?php echo $sking ?>'], text: "<div id='paginggrila8' style=\" line-height: 14px;\"></div>" });
                gridr14.enablePaging(true, 250, 10, "paginggrila8", true);
                gridr14.setPagingSkin("bricks", '<?php echo $sking ?>');
                gridr14.init();

                loadGridDataVen(BASE_URL + 'get/datapv0101/grilla_reportecliente/' + start_date + "/" + end_date + '/' + co_pto_venta, true, gridr14, 'gridr14', tabbar_rep.cells(id), true);
                carga_select_grilla(gridr14);
                gridr14.attachEvent("onRowSelect", function (id, ind) {
                    var co_cliente_s = gridr14.cells(id, 1).getValue();
                    //console.log(co_cliente_s);
                    dhxWin3_doc = new dhtmlXWindows();
                    dhxWin3_doc1 = dhxWin3_doc.createWindow("w_docp", 0, 0, 950, 460);
                    dhxWin3_doc.window("w_docp").setModal(true);
                    dhxWin3_doc.window("w_docp").denyResize();
                    dhxWin3_doc.window("w_docp").center();
                    dhxWin3_doc1.setText("Documentos de Compra");
                    dhxLYDOC = new dhtmlXLayoutObject(dhxWin3_doc1, '2U');
                    dhxLYDOC.cells("a").hideHeader();
                    dhxLYDOC.cells("a").setWidth(400);
                    dhxLYDOC.cells("b").hideHeader();
                    gridrdoc_c = dhxLYDOC.cells('a').attachGrid(); /*CO_CLIENTE,DE_RAZON_SOCIAL,DE_EMAIL,DE_TELEFONOS,MAXFEREGISTRO,TIMES*/
                    gridrdoc_c.setHeader("DOCUMENTO,MONTO,FECHA", null, ["text-align:center;", "text-align:center;", "text-align:center", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;"]);
                    gridrdoc_c.setColAlign("center,right,center");
                    gridrdoc_c.setColTypes("ro,ron,ro");
                    gridrdoc_c.setColSorting("str,int,str");
                    gridrdoc_c.setInitWidthsP("50,25,25");
                    gridrdoc_c.attachHeader("#text_filter,#number_filter,#text_filter");
                    // myTabbarcc = tabbar_rep.tabs(id).attachStatusBar({height: {dhx_skyblue: 30, dhx_web: 30, dhx_terrace: 30}['<?php echo $sking ?>'], text: "<div id='paginggrila8' style=\" line-height: 14px;\"></div>"});
                    gridrdoc_c.enablePaging(true, 250, 10, "paginggrila8", true);
                    gridrdoc_c.setPagingSkin("bricks", '<?php echo $sking ?>');
                    gridrdoc_c.init();
                    gridrdoc_c.attachFooter("<div>TOTAL</div>,<div  style=\" font-weight: bold;\" id=\"sum_docpaga\"></div>", ["text-align:right;", "text-align:right;", "text-align:right;", "text-align:right;", "text-align:right;"]);
                    //ruta, firstLoad, grid, contenedor, footer
                    loadGridDataDocpagados(BASE_URL + 'get/datapv0101/grilla_list_doc_compra/' + co_pto_venta + '/' + co_cliente_s, true, gridrdoc_c, dhxLYDOC.cells("a"), true);
                    gridrdoc_c.attachEvent("onRowSelect", function (id, ind) {
                        gridrdoc_cD = dhxLYDOC.cells('b').attachGrid(); /*CO_CLIENTE,DE_RAZON_SOCIAL,DE_EMAIL,DE_TELEFONOS,MAXFEREGISTRO,TIMES*/
                        gridrdoc_cD.setHeader("PRODUCTO,MONTO,DSCTO", null, ["text-align:center;", "text-align:center;", "text-align:center", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;"]);
                        gridrdoc_cD.setColAlign("left,right,right");
                        gridrdoc_cD.setColTypes("ro,ron,ron");
                        gridrdoc_cD.setColSorting("str,int,int");
                        gridrdoc_cD.setInitWidthsP("70,15,15");
                        gridrdoc_cD.attachHeader("#text_filter,#number_filter,#number_filter");
                        // myTabbarcc = tabbar_rep.tabs(id).attachStatusBar({height: {dhx_skyblue: 30, dhx_web: 30, dhx_terrace: 30}['<?php echo $sking ?>'], text: "<div id='paginggrila8' style=\" line-height: 14px;\"></div>"});
                        gridrdoc_cD.enablePaging(true, 250, 10, "paginggrila8", true);
                        gridrdoc_cD.setPagingSkin("bricks", '<?php echo $sking ?>');
                        gridrdoc_cD.init();
                        loadGridData(BASE_URL + 'get/datapv0101/grilla_list_doc_compra_d/' + co_pto_venta + '/' + id, true, gridrdoc_cD, dhxLYDOC.cells("b"), false);

                    });
                });

                break;
            case 'r11':
                gridr11 = myLayou__11.cells("b").attachGrid();
                gridr11.setHeader("FE.REGISTRO,DOCUMENTO,TIPO COBRO,TOTAL,FLETE,ICBPER,COD.VEN,NOM.VENDEDOR", null, ["text-align:center;", "text-align:center;", "text-align:center", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;"]);
                gridr11.setColAlign("left,left,left,right,right,right,right,left  ");
                gridr11.setColTypes("ro,ro,ro,dyn,dyn,dyn,ro,ro ");
                gridr11.setColSorting("str,str,str,int,int,int,str,str ");
                gridr11.setInitWidthsP("18,17,23,15,15,15,18,40 ");
                gridr11.attachHeader("&nbsp,#text_filter,#select_filter,#number_filter,#number_filter,#number_filter,#select_filter,#text_filter");
                gridr11.attachFooter("<div>TOTAL</div>,#cspan,#cspan,<div style=\" text-align:right; font-weight: bold;\" id=\"ven_total\"></div>,<div style=\" text-align:right; font-weight: bold;\" id=\"ven_flete\"></div>,<div style=\" text-align:right; font-weight: bold;\" id=\"ven_bolsa\"></div>", ["text-align:right;", "text-align:right;", "text-align:right;", "text-align:right;", "text-align:right;"]);
                myTabbars1 = myLayou__11.cells("b").attachStatusBar({ height: { dhx_skyblue: 30, dhx_web: 30, dhx_terrace: 30 }['<?php echo $sking ?>'], text: "<div id='paginggrila8' style=\" line-height: 14px;\"></div>" });
                gridr11.setNumberFormat("0,000.00", 5);
                gridr11.setNumberFormat("0,000.00", 4);
                gridr11.setNumberFormat("0,000.00", 3);
                gridr11.init();
                gridr11.attachEvent("onFilterEnd", function () {
                    calculateFooterValuesven(gridr11, 'gridr11');
                });
                loadGridDataVen(BASE_URL + 'get/datapv0101/grilla_reportexvendedor/' + start_date + "/" + end_date + '/' + co_pto_venta, true, gridr11, 'gridr11', myLayou__11.cells("b"), true);
                carga_select_grilla(gridr11);
                break;
            case 'r12':
                gridr12 = myLayou__12.cells("b").attachGrid();
                gridr12.setHeader("LISTA NOMBRE,TOTAL S/.", null, ["text-align:center;", "text-align:center;", "text-align:center", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;"]);
                gridr12.setColAlign("left,right");
                gridr12.setColTypes("ro,ron");
                gridr12.setColSorting("str,int");
                gridr12.setInitWidthsP("77,20");
                gridr12.attachFooter("<div>TOTAL</div>,<div style=\" text-align:right; font-weight: bold;\" id=\"ven_total12\"></div>", ["text-align:right;", "text-align:right;", "text-align:right;", "text-align:right;", "text-align:right;"]);
                gridr12.init();
                loadGridDataVen(BASE_URL + 'get/datapv0101/grilla_reportexlista/' + start_date + "/" + end_date + '/' + co_pto_venta, true, gridr12, 'gridr12', myLayou__12.cells("b"), true);
                carga_select_grilla(gridr12);
                break;
            case 'r13':
                gridr13 = myLayou__13.cells("b").attachGrid();
                gridr13.setImagePath(BASE_URL + 'dhtmlx/codebase/imgs/');
                gridr13.setHeader("MARCA,SMARCA,TOTAL S/.", null, ["text-align:center;", "text-align:center;", "text-align:center", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;"]);
                gridr13.setColAlign("left,left,right");
                gridr13.setColTypes("ro,ro,ron");
                gridr13.setColSorting("str,str,int");
                gridr13.setInitWidthsP("40,40,20");
                gridr13.attachFooter("<div></div>,<div>TOTAL</div>,<div style=\" text-align:right; font-weight: bold;\" id=\"ven_total132\"></div>", ["text-align:right;", "text-align:right;", "text-align:right;", "text-align:right;", "text-align:right;"]);
                gridr13.setNumberFormat("0,000.0", 2);
                gridr13.init();
                loadGridDataVen(BASE_URL + 'get/datapv0101/grilla_reportexmarca/' + start_date + "/" + end_date + '/' + co_pto_venta, true, gridr13, 'gridr13', myLayou__13.cells("b"), true);
                carga_select_grilla(gridr13);
                break;
        }
    }
    function reporte_r11(fecini, fecfinal) {
        Highcharts.setOptions({ lang: { drillUpText: ' Atras a {series.name}' } });
        var brandsData = [];
        $.ajax({
            data: { ptoventa: co_pto_venta, fecini: fecini, fecfin: fecfinal, emp: emp }, dataType: "json", url: BASE_URL + 'xml/pv0101/data_de.php',
            beforeSend: function () {
                $("#graph_rep").html('<center><h3>Cargando datos..</h3></center>');
            }, success: function (data) {
                $.each(data, function (i, item) {
                    brandsData.push({ name: data[i].name, y: data[i].y, visible: true, variable: data[i].total, drilldown: data[i].name });
                });
                var options = {
                    chart: { type: 'pie', autowidth: true }, title: {
                        text: 'VENTAS  DEL ' + fecini + ' AL ' + fecfinal
                    }, subtitle: {
                        text: 'VENTAS POR VENDEDOR'
                    }, legend: {
                        layout: 'horizontal', backgroundColor: '#FFFFFF', floating: true, align: 'left', verticalAlign: 'top', x: 10, y: 45, Formatter: function () {
                            var point = this.point, s = point.name + '</br><b>S/. ' + (point.y).toFixed(2) + ' </b>';
                            return s;
                        }
                    }, plotOptions: {
                        pie: {
                            allowPointSelect: false, slicedOffset: 0, cursor: 'pointer', dataLabels: { enabled: false }
                        }, series: {
                            cursor: 'pointer', dataLabels: {
                                enabled: true, formatter: function () {
                                    var point = this.point;
                                    s = point.name + ' <br/>(' + ((point.y / point.total) * 100).toFixed(2) + '%) S/ ' + point.y + '<b>';
                                    return s;
                                }
                            }
                        }
                    }, tooltip: {
                        formatter: function () {
                            var point = this.point, s = point.name + ':<br/>S/ ' + point.y + ' (' + ((point.y / point.total) * 100).toFixed(2) + '%) <b>';
                            return s;
                        }
                    }, series: [{ name: 'V.General', colorByPoint: true, data: brandsData }]
                };
                options.chart.renderTo = 'graph_rep';
                options.chart.type = 'pie';
                var chart1 = new Highcharts.Chart(options);
            }
        });
    }
    function borrar_producto(id_numrow) {
        if (id_numrow != '0') {
            var example = mygridVN.getAllItemIds();
            var numbers = example.split(',');
            if (numbers.length > 0) {//var id_delete = mygridVN.cells(id_numrow, 0).getValue();
                mygridVN.deleteRow(id_numrow);
                id_numrow = '0', calculateFooterValues();
                if (RESPONSABLE == 'S') {
                    myForm_d.setItemValue('entreg_pago', '0'), myForm_d.setItemValue('vuelt_pago', '0.00');
                }
            } else {
                if (RESPONSABLE == 'S') {
                    myForm_d.setItemValue('entreg_pago', '0'), myForm_d.setItemValue('vuelt_pago', '0.00');
                }
                dhtmlx.message({ type: "error", text: "Seleccione el producto para eliminar ", expire: 3000 });
            }
        } else {
            dhtmlx.message({ type: "error", text: "Seleccione un producto... Por favor", expire: 3000 });
        }
    }
    function agregar_productos(id_barra) {
        console.log(id_barra);
        dhxWinsfadd = new dhtmlXWindows();
        dhxWinaddrows = dhxWinsfadd.createWindow("w_formadd", 285, 105, 420, 270);
        dhxWinaddrows.setText("Busqueda de Productos");
        dhxWinsfadd.window('w_formadd').button('minmax').hide();
        layout_reg_cli = new dhtmlXLayoutObject(dhxWinsfadd.window("w_formadd"), '1C');
        layout_reg_cli.cells("a").hideHeader();
        myform_addrow = layout_reg_cli.cells("a").attachForm(form_addrow);
        myform_addrow.setItemFocus('frow_cata');
        autocomplete_off(myform_addrow);
        form_add_row(id_barra);
        if (RESPONSABLE == 'S') {
            myForm_d.setItemValue('select_pago', 1);
            myForm_d.setItemValue('entreg_pago', '0');
            myForm_d.setItemValue('vuelt_pago', '0.00');
        }
    }
    function reporte_r12(fecini, fecfinal) {
        Highcharts.setOptions({ lang: { drillUpText: ' Atras a {series.name}' } });
        var brands = {}, brandsData = [], versions = {}, drilldownSeries = [];
        $.ajax({
            data: { ptoventa: co_pto_venta, fecini: fecini, fecfin: fecfinal, emp: emp }, dataType: "json", url: BASE_URL + 'xml/pv0101/data_de_lista.php',
            beforeSend: function () {
                $("#graph_rep").html('<center><h3>Cargando datos..</h3></center>');
            }, success: function (data) {
                $.each(data, function (i, item) {
                    brandsData.push({ name: data[i].name, y: data[i].y, visible: true, variable: data[i].total, drilldown: data[i].name });
                });
                var options = {
                    chart: {
                        type: 'pie', autowidth: true
                    }, title: { text: 'VENTAS  DEL ' + fecini + ' AL ' + fecfinal }, subtitle: { text: 'VENTAS POR LISTA DE PRECIOS' }, legend: {
                        layout: 'horizontal', backgroundColor: '#FFFFFF', floating: true, align: 'left', verticalAlign: 'top', x: 10, y: 45, Formatter: function () {
                            var point = this.point, s = point.name + '</br><b>S/. ' + (point.y).toFixed(2) + ' </b>';
                            return s;
                        }
                    }, plotOptions: {
                        pie: {
                            allowPointSelect: false, slicedOffset: 0,
                            cursor: 'pointer', dataLabels: { enabled: false }
                        }, series: {
                            cursor: 'pointer', point: { events: {} }, dataLabels: {
                                enabled: true, formatter: function () {
                                    var point = this.point;
                                    s = point.name + ' <br/>(' + ((point.y / point.total) * 100).toFixed(2) + '%) S/ ' + point.y + '  <b>';
                                    return s;
                                }
                            }
                        }
                    },
                    tooltip: {
                        formatter: function () {
                            var point = this.point, s = point.name + ':<br/>S/ ' + point.y + ' (' + ((point.y / point.total) * 100).toFixed(2) + '%) <b>';
                            return s;
                        }
                    }, series: [{ name: 'V.General', colorByPoint: true, data: brandsData }], drilldown: {
                        drillUpButton: {
                            relativeTo: 'spacingBox', position: { y: 0, x: 0 }, theme: {
                                fill: 'white', 'stroke-width': 1, stroke: 'silver', r: 0, states: {
                                    hover: { fill: '#bada55' }, select: { stroke: '#039', fill: '#bada55' }, click: function () {
                                        window.alert('valor');
                                    }
                                }
                            }, events: {
                                click: function () {
                                    window.alert('valor');
                                }
                            }
                        }, series: drilldownSeries
                    }
                };
                options.chart.renderTo = 'graph_rep2';
                options.chart.type = 'pie';
                var chart1 = new Highcharts.Chart(options);
            }
        });
    }
    function reporte_r13(fecini, fecfinal) {
        Highcharts.setOptions({ lang: { drillUpText: ' Atras a {series.name}' } });
        var brands = {}, brandsData = [], versions = {}, drilldownSeries = [];
        $.ajax({
            data: { ptoventa: co_pto_venta, fecini: fecini, fecfin: fecfinal },
            dataType: "json", url: BASE_URL + 'xml/pv0101/data_de_marca.php',
            beforeSend: function () {
                $("#graph_rep").html('<center><h3>Cargando datos..</h3></center>');
            }, success: function (data) {
                $.each(data, function (i, item) {
                    brandsData.push({
                        name: data[i].name, y: data[i].y, visible: true, variable: data[i].total, drilldown: data[i].name
                    });
                });
                $.ajax({
                    data: { ptoventa: co_pto_venta, fecini: fecini, fecfin: fecfinal }, dataType: "json", url: BASE_URL + 'xml/pv0101/data_mar_deta.php',
                    success: function (data2) {
                        $.each(data2, function (i, item) {
                            drilldownSeries.push({
                                name: data2[i].name, id: data2[i].id, data: data2[i].data
                            });
                        });
                        var options = {
                            chart: { type: 'pie', autowidth: true }, title: { text: 'VENTAS  DEL ' + fecini + ' AL ' + fecfinal }, subtitle: { text: 'VENTAS POR MARCA(click sobre una Porci\u00f3n para detallarlo)' }, legend: {
                                layout: 'horizontal', backgroundColor: '#FFFFFF', floating: true, align: 'left', verticalAlign: 'top', x: 10, y: 45, Formatter: function () {
                                    var point = this.point, s = point.name + '<br/><b>S/.:. ' + (point.y).toFixed(2) + ' </b>';
                                    return s;
                                }
                            }, plotOptions: {
                                pie: { allowPointSelect: false, slicedOffset: 0, cursor: 'pointer', dataLabels: { enabled: false } }, series: {
                                    cursor: 'pointer', point: {
                                        events: {
                                            click: function () {
                                                var valor = this.name;
                                            }
                                        }
                                    }, dataLabels: {
                                        enabled: true, formatter: function () {
                                            var point = this.point;
                                            s = point.name + '<br/><b>S/ :' + (point.y).toFixed(2) + ' ( ' + ((point.y / point.total) * 100).toFixed(2) + '%) </b>';
                                            return s;
                                        }
                                    }
                                }
                            }, tooltip: {
                                formatter: function () {
                                    var point = this.point, s = point.name + '<br/><b>S/ :' + (point.y).toFixed(2) + ' ( ' + ((point.y / point.total) * 100).toFixed(2) + '%) </b>';
                                    return s;
                                }
                            }, series: [{ name: 'V.General', colorByPoint: true, data: brandsData }], drilldown: {
                                drillUpButton: {
                                    relativeTo: 'spacingBox', position: { y: 0, x: 0 }, theme: {
                                        fill: 'white', 'stroke-width': 1, stroke: 'silver', r: 0, states: {
                                            hover: { fill: '#bada55' }, select: { stroke: '#039', fill: '#bada55' }, click: function () {
                                                window.alert('valor');
                                            }
                                        }
                                    }, events: {
                                        click: function () {
                                            window.alert('valor');
                                        }
                                    }
                                }, series: drilldownSeries
                            }
                        };
                        options.chart.renderTo = 'graph_rep3';
                        options.chart.type = 'pie';
                        var chart1 = new Highcharts.Chart(options);
                    }
                });
            }
        });
    }
    //carga RUC EMPRESA , IMPRESORA , UIT actual( UIT esta en ge_variables_globales)
    function carga_empresa() {
        let params = { co_emp: usrJson.empresa, alias: usrJson.alias };
        $.post(BASE_URL + 'PV0101/carga_empresa/', params, function (res) {
            emp = usrJson.empresa, ruc_empresa = res.data[0].RUCEMPRESA, printer = res.data[0].PRINTER, nu_uit = res.data[0].NU_UIT;
            if (printer == '0') {
                let dhxWinsfadd = new dhtmlXWindows();
                let dhxWinaddrows = dhxWinsfadd.createWindow("w_printer", 385, 105, 380, 150);
                dhxWinaddrows.setText("Ingrese Impresora");
                dhxWinsfadd.window('w_printer').button('minmax').hide();
                let layout_reg_cli = new dhtmlXLayoutObject(dhxWinsfadd.window("w_printer"), '1C');
                layout_reg_cli.cells("a").hideHeader();
                let myform_printer = layout_reg_cli.cells("a").attachForm(form_addprinter);
                myform_printer.attachEvent("onButtonClick", function (name) {
                    let n_print = (myform_printer.getItemValue('n_printer')).replace(/ /g, "+");
                    $.ajax({type: "POST", url: BASE_URL + "get/datapv0101/addprinter/" + n_print,
                        beforeSend: function () {
                        }, success: function (response) {
                            if (response == '1') {
                                dhxWinsfadd.window('w_printer').close(), printer = n_print;
                            } else {
                                myForm_d.setItemLabel('ver__', 'Version :' + ver__ + ' Impresora : Error');
                            }
                        }
                    });
                });
            }
            qz.websocket.connect().then(function () {
                console.log("Connected!");
            });
            qz.printers.find((printer).replace(/[+]/g, " ")).then(function (found) {
                console.log("Printer: " + found);
            });
        }, 'json');

        /*
                $.ajax({type: "POST", url: BASE_URL + 'get/datapv0101/carga_empresa/', beforeSend: function () {
                    }, success: function (response) {
                        var json = eval(response);
                        for (var i in json) {
                            emp = json[i].emp, ruc_empresa = json[i].ruc, printer = json[i].printer, nu_uit = json[i].uit;
                            if (printer == '0') {
                                let dhxWinsfadd = new dhtmlXWindows();
                                let dhxWinaddrows = dhxWinsfadd.createWindow("w_printer", 385, 105, 380, 150);
                                dhxWinaddrows.setText("Ingrese Impresora");
                                dhxWinsfadd.window('w_printer').button('minmax').hide();
                                let layout_reg_cli = new dhtmlXLayoutObject(dhxWinsfadd.window("w_printer"), '1C');
                                layout_reg_cli.cells("a").hideHeader();
                                let myform_printer = layout_reg_cli.cells("a").attachForm(form_addprinter);
                                myform_printer.attachEvent("onButtonClick", function (name) {
                                    let n_print = (myform_printer.getItemValue('n_printer')).replace(/ /g, "+");
                                    $.ajax({type: "POST", url: BASE_URL + "get/datapv0101/addprinter/" + n_print,
                                        beforeSend: function () {
                                        }, success: function (response) {
                                            if (response == '1') {
                                                dhxWinsfadd.window('w_printer').close(), printer = n_print;
                                            } else {
                                                myForm_d.setItemLabel('ver__', 'Version :' + ver__ + ' Impresora : Error');
                                            }
                                        }
                                    });
                                });
                            }
                            qz.websocket.connect().then(function () {
                                console.log("Connected!");
                            });
                            qz.printers.find((printer).replace(/[+]/g, " ")).then(function (found) {
                                console.log("Printer: " + found);
                            });
                        }
                    }, error: function (err) {
                        console.log('error : ' + JSON.stringify(err, null, 2));
                    }});*/
    }
    function tab_stock(id) {
        myLayoutstock = new dhtmlXLayoutObject(tabbar.tabs("a19"), '2U');
        myLayoutstock.cells("a").hideHeader();
        myLayoutstock.cells("b").hideHeader();
        myLayoutstock.cells("a").setWidth(250);
        form_sto = myLayoutstock.cells("a").attachForm(form_stock); //period
        form_sto.setItemValue('periodo_st', period);
        form_sto.attachEvent("onChange", function (name, value) {
            switch (name) {
                case 'periodo_st':
                    dhxGridstock.clearAll();
                    loadGridDatapromo(BASE_URL + 'get/datapv0101/stock_almacen/' + co_pto_venta + '/' + form_sto.getItemValue('periodo_st'), true, dhxGridstock, myLayoutstock.cells("b"), false);
                    break;
            }
        });
        form_sto.attachEvent("onButtonClick", function (name) {
            guardar_stock(0, 'valmaxstock', form_sto.getItemValue('valmaxstock'));
            guardar_stock(0, 'valminstock', form_sto.getItemValue('valminstock'));
        });

        dhxGridstock = myLayoutstock.cells("b").attachGrid();
        dhxGridstock.setImagePath(BASE_URL + 'dhtmlx/codebase/imgs/');
        dhxGridstock.setHeader("CODIGO,NOMBRE,ST. MINIMO, ST.MAXIMO");
        dhxGridstock.setColTypes("ro,ro,edn,edn");
        dhxGridstock.setColAlign("left,left,center,center");
        dhxGridstock.attachHeader("#text_filter,#text_filter,#number_filter,#number_filter");
        dhxGridstock.setInitWidthsP("14,50,18,18");
        dhxGridstock.setColSorting("str,str,int,int,str,str,str");
        dhxGridstock.enableEditEvents(true, false, false);
        dhxGridstock.attachEvent("onRowSelect", function () {
            cod_prod_stock = dhxGridstock.getSelectedRowId();
        });
        dhxGridstock.attachEvent("onEditCell", function (stage, rId, cInd, nValue, oValue) {
            if (stage === 2) {
                if (parseFloat(nValue) != parseFloat(oValue)) {
                    guardar_stock(cod_prod_stock, cInd, nValue);
                    return true;
                } else {
                    dhtmlx.message({ type: "error", text: "El valor ingresado debe ser menor o igual al valor comprado , Por favor", expire: 5000 });
                    return false;
                }
            }
        });
        dhxGridstock.init();
        loadGridDatapromo(BASE_URL + 'get/datapv0101/stock_almacen/' + co_pto_venta + '/' + period, true, dhxGridstock, myLayoutstock.cells("b"), false);
    }
    function guardar_stock(cod_prod_stock, cInd, nValue) {
        if (isNumber(nValue)) {
            $.ajax({
                type: "POST", url: BASE_URL + 'get/datapv0101/guardar_stock/' + cod_prod_stock + '/' + cInd + '/' + nValue + '/' + co_pto_venta + '/' + form_sto.getItemValue('periodo_st'),
                beforeSend: function () {
                }, success: function (response) {
                    if (response == '1') {
                        dhtmlx.message({ text: "Guardado!!", expire: 3000 });
                        dhxGridstock.clearAll();
                        loadGridDatapromo(BASE_URL + 'get/datapv0101/stock_almacen/' + co_pto_venta + '/' + form_sto.getItemValue('periodo_st'), true, dhxGridstock, myLayoutstock.cells("b"), false);
                    } else {
                        dhtmlx.message({ type: "error", text: response, expire: 7000 });
                    }
                }, error: function (err) {
                    console.log('error : ' + JSON.stringify(err, null, 2));
                }
            });
        }
    }
    function extractor_clob() {
        myLayoext = new dhtmlXLayoutObject(tabbar.tabs("a111"), '2U');
        myLayoext.cells("a").hideHeader(), myLayoext.cells("b").hideHeader(), myLayoext.cells("a").setWidth(230);
        let myForm_ext = myLayoext.cells("a").attachForm(form_buscar_EXT);
        myForm_ext.setItemValue('fb_des_ext', fecha1), myForm_ext.setItemValue('fb_has_ext', fecha1);
        myForm_ext.attachEvent("onButtonClick", function (name) {
            start_date = document.getElementsByName("fb_des_ext")[0].value;
            end_date = document.getElementsByName("fb_has_ext")[0].value;
            dhxGridext.clearAll();
            loadGridDataVen(BASE_URL + 'get/datapv0101/carga_grilla_extracto/' + '0' + '/' + start_date + '/' + end_date, true, dhxGridext, 'dhxGridext', myLayoext.cells("b"), false);
        });
        carga_grilla_extrac(myLayoext);
        var myToolbar_ext = myLayoext.cells("b").attachToolbar();
        myToolbar_ext.setIconSize(48);
        myToolbar_ext.setIconsPath("../../../dhtmlx/codebase/skins/dhx_skyblue/imgs/icons/");
        myToolbar_ext.addButton('subir_ext', null, 'Subir Extracto', 'upload_48.png', 'upload_48.png');
        myToolbar_ext.addSeparator(null, null);
        myToolbar_ext.addButton('act_ext', null, 'Actualizar', 'refresh_64.png', 'refresh_64.png');
        myToolbar_ext.addSeparator(null, null);
        myToolbar_ext.attachEvent("onClick", function (id) {
            switch (id) {
                case 'subir_ext':
                    b_ini_extractor();
                    break;
                case 'act_ext':
                    carga_data_clob('0', '0', emp, 'actualizar');
                    break;
            }
        });
    }
    function carga_arqueo() {
        myLayoarq = new dhtmlXLayoutObject(tabbar.tabs("a110"), '2U');
        myLayoarq.cells("a").hideHeader(), myLayoarq.cells("b").hideHeader(), myLayoarq.cells("a").setWidth(230);
        let myForm_arq = myLayoarq.cells("a").attachForm(form_buscar_ARQ);
        myForm_arq.setItemValue('fb_des_arq', fecha1), myForm_arq.setItemValue('fb_has_arq', fecha1);
        myForm_arq.attachEvent("onButtonClick", function (name) {
            start_date = document.getElementsByName("fb_des_arq")[0].value;
            end_date = document.getElementsByName("fb_has_arq")[0].value;
            dhxGridarq.clearAll();
            loadGridDataVen(BASE_URL + 'get/datapv0101/carga_grilla_arqueo/' + co_planilla_cobranza + '/' + start_date + '/' + end_date + '/' + co_pto_vent, true, dhxGridarq, 'dhxGridarq', myLayoarq.cells("b"), false);
        });
        carga_grilla_arqueo(myLayoarq);
        myToolbar_arq = myLayoarq.cells("b").attachToolbar();
        myToolbar_arq.setIconSize(48);
        myToolbar_arq.setIconsPath("../../../dhtmlx/codebase/skins/dhx_skyblue/imgs/icons/");
        myToolbar_arq.addButton('nuevo_arq', null, 'Nuevo Arqueo', 'pago_64.png', 'pago_64.png');
        myToolbar_arq.addSeparator(null, null);
        myToolbar_arq.addButton('edit_arq', null, 'Modificar', 'list_despeje64.png', 'list_despeje64.png');
        myToolbar_arq.addSeparator(null, null);
        myToolbar_arq.addButton('anula_arq', null, 'Anula Arqueo', 'clear_all_48.png', 'clear_all_48.png');
        myToolbar_arq.addSeparator(null, null);
        myToolbar_arq.addButton('pdf_arq', null, 'Imprimir', 'pdf_48.png', 'pdf_48.png');
        myToolbar_arq.attachEvent("onClick", function (id) {
            serie_arqu_nvo = '0', co_arqu_nvo = '0';
            switch (id) {
                case 'nuevo_arq'://generar
                    carga_formArq('Nuevo', '0', '0', '0');
                    break;
                default:
                    let selectedId = dhxGridarq.getSelectedRowId();
                    if (selectedId !== null) {
                        let seriearqueo = dhxGridarq.cells(selectedId, 7).getValue(), planselect = dhxGridarq.cells(selectedId, 8).getValue();
                        let co_arqueo_s = dhxGridarq.cells(selectedId, 5).getValue(), co_estado_s2 = dhxGridarq.cells(selectedId, 13).getValue();
                        let xflag = id === 'anula_arq' ? 'Delete' : id === 'edit_arq' ? 'Editar' : null;
                        if (co_estado_s2 === 'Abierta' && xflag === 'Editar') {
                            carga_formArq(xflag, seriearqueo, planselect, co_arqueo_s);
                        } else {
                            (xflag === 'Delete' && co_estado_s2 !== 'Cerrado') ? carga_formArq(xflag, seriearqueo, planselect, co_arqueo_s) : id === 'pdf_arq' ? reporte_arqueo(seriearqueo, planselect, co_arqueo_s) : dhtmlx.message({ type: "alert-error", text: "Sólo se Modifican/Anulan Arqueos Abiertos", expire: 6000 });
                        }
                    }
                    break;
            }
        });
    }
    function carga_permisos() {
        dhxW_prms = new dhtmlXWindows();
        dhxW_ps = dhxW_prms.createWindow("w_perms", 75, 5, 290, 140);
        dhxW_ps.setText("Acceso Resgtringido"), dhxW_prms.window("w_perms").hideHeader(), dhxW_prms.window('w_perms').center();
        form_miso = dhxW_prms.window("w_perms").attachForm(form_pemi);
        form_miso.attachEvent("onEnter", function () {
            valida_permisos();
        });
        form_miso.attachEvent("onButtonClick", function (name) {
            if (name === 'b_acppermiso') {
                valida_permisos();
            } else {
                myForm_c.uncheckItem('chek_conti'), myForm_b.hideItem('lab_conti'), dhxW_prms.window("w_perms").close();
            }

        });
    }

    function valida_permisos() {
        $.ajax({
            type: "POST", url: BASE_URL + 'get/datapv0101/valida_permisos/' + '230' + '/' + co_pto_vent + '/' + form_miso.getItemValue('usu_permi'), beforeSend: function () {
            }, success: function (response) {
                if (response === 'SI') {
                    myForm_b.showItem('lab_conti'), st_contingencia = 'S', carga_pto_venta(cod_cliente, fecha_fn, st_contingencia), dhxW_prms.window("w_perms").close(), myForm_c.setItemValue('doc_doc_emi', ''), myForm_b.showItem('sel_planilla'), myForm_b.hideItem('nro_pla'), myForm_b.hideItem('abrir_pla'), myForm_b.hideItem('cerrar_pla');
                } else {
                    dhtmlx.message({ type: "alert-error", text: "Contraseña incorrecta o no tiene permisos para esta operacion..", expire: 6000 });
                }
            }, error: function (err) {
                dhtmlx.message({ type: "alert-error", text: "Ocurrio un problema al valida_permisos...", expire: 6000 });
                registra_errores(' Fail ajax() ' + JSON.stringify(err, null, 2), "datapo010502:valida_permisos():carga_permisos", 'NO', null);
            }
        });
    }

    function carga_formArq(flag, serie_arq, plani, co_arqs) {
        if (flag === 'Nuevo' || flag === 'Editar') {
            dhxWcaja = new dhtmlXWindows();
            let dhxW2t_arq = dhxWcaja.createWindow("w_aqqr", 75, 5, 850, 460);
            dhxW2t_arq.setText("Arqueo de Caja");
            dhxWcaja.window('w_aqqr').center();
            layoutdesc_arq = new dhtmlXLayoutObject(dhxWcaja.window("w_aqqr"), '2U');
            layoutdesc_arq.cells("a").hideHeader(), layoutdesc_arq.cells("b").hideHeader();
            myForm_b_arq = layoutdesc_arq.cells("a").attachForm(form_CAB_ARQ);
            myForm_b_arq.reloadOptions('responsable', BASE_URL + 'get/datapv0101/selct_vendedor/' + co_pto_venta);
            let plan = flag === 'Nuevo' && plani === '0' ? co_planilla_cobranza : plani;
            flag === 'Editar' ? carga_ajax_arq('Editar', serie_arq, plan, 0) : null, flag === 'Editar' ? myForm_b_arq.hideItem('btn_nuevo_arq') : null, flag === 'Editar' ? myForm_b_arq.enableItem('btn_egotro_arq') : null, flag === 'Editar' ? myForm_b_arq.enableItem('btn_actu_arq') : null;
            myForm_b_arq.attachEvent("onButtonClick", function (name) {
                serie_arq = flag === 'Nuevo' ? serie_arqu_nvo : serie_arq;
                co_arqs = flag === 'Nuevo' ? co_arqu_nvo : co_arqs;
                switch (name) {
                    case 'btn_egotro_arq':
                        carga_ventana_extras(serie_arq, plan, co_arqs);
                        break;
                    case 'btn_nuevo_arq':
                        carga_ajax_arq(flag, serie_arq, plan, 0);
                        co_arqs = flag === 'Nuevo' ? co_arqu_nvo : co_arqs;
                        break;
                    case 'btn_actu_arq':
                        carga_ajax_arq('Actualiza', serie_arq, plan, 0);
                        break;
                    case 'btn_sald_ini':
                        carga_ajax_arq('Actu_inimonto', serie_arq, plan, myForm_b_arq.getItemValue('monto_ini_arq'));
                        break;
                    case 'btn_calc_arq':
                        $.ajax({
                            type: "POST", url: BASE_URL + 'get/datapv0101/save_valores_arq/' + '0' + '/' + co_arqs + '/' + serie_arq + '/' + plan + '/btncalcular', beforeSend: function () {
                            }, success: function (response) {
                                let partes1 = response.split('@');
                                let rptas = partes1[0], ysaldofinal = partes1[1], co_arqueoa = partes1[3], obsrpa = partes1[2];
                                if (rptas === 'OK') {
                                    myForm_b_arq.setItemValue('saldo_arq', ysaldofinal), myForm_b_arq.setItemValue('observ_arq', obsrpa);
                                    dhtmlx.message({ text: 'Grabado correctamente...', expire: 3000 });
                                } else {
                                    registra_errores(' Fail ajax() ' + response, "datapo010502:carga_formArq():btn_calc_arq", 'SI', '0' + '/' + co_arqs + '/' + serie_arq + '/' + plan + '/btncalcular');
                                }
                            }, error: function (err) {
                                dhtmlx.message({ type: "alert-error", text: "Ocurrio un problema al Cargar el Cliente, actualice el sistema y vuelva a intentarlo", expire: 6000 });
                                registra_errores(' Fail ajax() ' + JSON.stringify(err, null, 2), "datapo010502:carga_formArq():btn_calc_arq", 'SI', '0' + '/' + co_arqs + '/' + serie_arq + '/' + plan + '/btncalcular');
                            }
                        });
                        break;
                }
            });
        } else {
            dhtmlx.confirm("¿Desea eliminar el Arqueo Registrado " + serie_arq + " </br> No hay marcha atrás...? ", function (result) {
                if (result === Boolean(true)) {//serie_arq, plani, co_arqs
                    $.ajax({
                        type: "POST", url: BASE_URL + 'get/datapv0101/save_delete_arq/' + co_arqs + '/' + serie_arq + '/' + plani, beforeSend: function () {
                        }, success: function (response) {
                            if (response === 'OK') {
                                dhxGridarq.clearAll();
                                start_date = document.getElementsByName("fb_des_arq")[0].value;
                                end_date = document.getElementsByName("fb_has_arq")[0].value;
                                loadGridDataVen(BASE_URL + 'get/datapv0101/carga_grilla_arqueo/' + co_planilla_cobranza + '/' + start_date + '/' + end_date + '/' + co_pto_vent, true, dhxGridarq, 'dhxGridarq', myLayoarq.cells("b"), false);
                            } else {
                                dhtmlx.message({ type: "alert-error", text: response, expire: 6000 });
                            }
                        }, error: function (err) {
                            dhtmlx.message({ type: "alert-error", text: "Ocurrio un problema al Borrar un Arqueo, vuelva a intentarlo", expire: 6000 });
                            registra_errores(' Fail ajax() ' + JSON.stringify(err, null, 2), "datapo010502:save_delete_arq():anula_arq", 'SI', co_arqs + '/' + serie_arq + '/' + plani);
                        }
                    });
                }
            });
        }
    }
    function carga_ventana_extras(serie_arq, plan, co_arqs) {
        let dhxW = new dhtmlXWindows();
        let dhxW2t_arqe = dhxW.createWindow('w_aqqre', 75, 5, 650, 300);
        dhxW2t_arqe.setText("Ingresos, Egresos Extras");
        layoutdesc_arqex = new dhtmlXLayoutObject(dhxW.window('w_aqqre'), '2U');
        layoutdesc_arqex.cells("a").hideHeader(), layoutdesc_arqex.cells("b").hideHeader();
        myForm_b_arqe = layoutdesc_arqex.cells("a").attachForm(form_CAB_ARQE);
        dhxW.window('w_aqqre').setModal(true);
        dhxW.window('w_aqqre').center();
        carga_deta_extra(layoutdesc_arqex.cells("b"), serie_arq, plan, co_arqs);
        myForm_b_arqe.attachEvent("onButtonClick", function (name) {
            let flag, xtipo, xmonto, xconcepto, xobs, xtransac;
            switch (name) {
                case 'btn_nuevo_ext':
                    flag = 'Nuevo', xtransac = '0',
                        xtipo = myForm_b_arqe.getItemValue('ch_stado'), xmonto = myForm_b_arqe.getItemValue('nu_valor_aqre'), xconcepto = myForm_b_arqe.getItemValue('de_concepto'),
                        xobs = myForm_b_arqe.getItemValue('de_obs_aqre');
                    break;
                case 'btn_borra_ext':
                    flag = 'Borrar';
                    let selectedId = dhxGridarqex.getSelectedRowId();
                    xtransac = dhxGridarqex.cells(selectedId, 0).getValue();
                    xtipo = dhxGridarqex.cells(selectedId, 1).getValue();
                    xconcepto = dhxGridarqex.cells(selectedId, 2).getValue();
                    xmonto = dhxGridarqex.cells(selectedId, 3).getValue();
                    xobs = dhxGridarqex.cells(selectedId, 4).getValue();
                    break;
            }
            $.ajax({
                type: "POST", url: BASE_URL + 'get/datapv0101/save_mov_extras/' + flag + '/' + co_arqs + '/' + xtipo + '/' + xmonto + '/' + xconcepto + '/' + xtransac + '/' + xobs, beforeSend: function () {
                }, success: function (response) {
                    let partes = response.split('@');
                    let rpta = partes[0], im_final = partes[1];
                    if (rpta === 'OK') {
                        dhxGridarqex.clearAll(), myForm_b_arq.setItemValue('egreso_arq', im_final);
                        loadGridDataVen(BASE_URL + 'get/datapv0101/carga_grilla_extras/' + co_arqs, true, dhxGridarqex, 'dhxGridarqex', layoutdesc_arqex.cells("b"), true);
                    }
                }, error: function (err) {
                    dhtmlx.message({ type: "alert-error", text: "Ocurrio un problema al Cargar el Cliente, actualice el sistema y vuelva a intentarlo", expire: 6000 });
                    registra_errores(' Fail ajax() ' + JSON.stringify(err, null, 2), "datapo010502:save_mov_extras():carga_ventana_extras", 'SI', flag + '/' + co_arqs + '/' + xtipo + '/' + xmonto + '/' + xconcepto + '/' + xtransac + '/' + xobs);
                }
            });
        });
    }
    function carga_deta_extra(conten, serie_arq, plan, co_arqs) {
        dhxGridarqex = conten.attachGrid();
        dhxGridarqex.setImagePath(BASE_URL + 'dhtmlx/codebase/imgs/');
        dhxGridarqex.setHeader("ID,TIPO,CONCEPTO,MONTO,OBS");
        dhxGridarqex.setColTypes("ro,ro,ro,dyn,ro");
        dhxGridarqex.setInitWidthsP("0,20,60,20");
        dhxGridarqex.setColSorting("str,str,str,int,str");
        dhxGridarqex.attachFooter(" <div></div>,<div>TOTAL</div>,<div style=\" text-align:right; font-weight: bold;\" id=\"ven_ext\"></div>", ["text-align:right;", "text-align:right;", "text-align:right;", "text-align:right;", "text-align:right;"]);
        dhxGridarqex.init();
        dhxGridarqex.setColumnHidden(0, true);
        dhxGridarqex.setColumnHidden(4, true);
        loadGridDataVen(BASE_URL + 'get/datapv0101/carga_grilla_extras/' + co_arqs, true, dhxGridarqex, 'dhxGridarqex', conten, true);
    }
    function carga_ajax_arq(flag, serie_arq, planilla, im_ini) {
        $.ajax({
            type: "POST", url: BASE_URL + 'get/datapv0101/genera_arqueo/' + planilla + '/' + co_pto_venta + '/' + co_vendedor_ini + '/' + flag + '/' + serie_arq + '/' + im_ini,
            beforeSend: function () {
            }, success: function (response) {//Actuini@Monto Inicial registrado, conforme.@150@81@ARQ1-10@811.2
                let partes = response.split('@');
                let rpta = partes[0];
                if (rpta != 'Actuini') {
                    co_arqueo = partes[1], serie_arqu = partes[2], im_efectivo = partes[3], im_deposit = partes[4], totsaldo = partes[5], co_registar = partes[6], fec_reg = partes[7], plani = partes[8], im_inic = partes[9], im_sald_cierre = partes[10], im_saldextras = partes[11], yobserva = partes[12];
                    serie_arqu_nvo = serie_arqu, co_arqu_nvo = co_arqueo, carga_grilla(co_arqu_nvo, serie_arqu_nvo, planilla);
                } else {
                    co_arqueo = partes[2], serie_arqu = partes[3], serie_arqu_nvo = serie_arqu, co_arqu_nvo = co_arqueo, carga_grilla(co_arqu_nvo, serie_arqu_nvo, planilla);
                    myForm_b_arq.setItemValue('vta_dia_arq', partes[6]), myForm_b_arq.setItemValue('depo_dia_arq', partes[7]);
                }
                flag === 'Actualiza' ? carga_plantilla_aqr_data('0', co_arqueo, serie_arqu, planilla) : null;
                switch (rpta) {
                    case 'Conforme':
                        dhtmlx.message({ text: "Se creó el Arqueo Nro : " + serie_arqu, expire: 5000 });
                        myForm_detarq.enableItem('b_audit_arq'), myForm_b_arq.disableItem('btn_nuevo_arq'), myForm_b_arq.enableItem('btn_actu_arq'), myForm_b_arq.enableItem('btn_calc_arq'), myForm_b_arq.setItemValue('egreso_arq', im_saldextras), myForm_b_arq.setItemValue('saldo_arq', im_sald_cierre), myForm_b_arq.setItemValue('observ_arq', yobserva), myForm_b_arq.setItemValue('monto_ini_arq', im_inic), myForm_b_arq.setItemValue('co_pla_arq', plani), myForm_b_arq.setItemValue('fe_arq', fec_reg), myForm_b_arq.setItemValue('co_arq', co_arqueo), myForm_b_arq.setItemValue('serie_arq', serie_arqu), myForm_b_arq.setItemValue('responsable', co_registar), myForm_b_arq.setItemValue('vta_dia_arq', im_efectivo), myForm_b_arq.setItemValue('depo_dia_arq', im_deposit), myForm_b_arq.setItemValue('total_arq', totsaldo);
                        dhxGridarq.clearAll();
                        start_date = document.getElementsByName("fb_des_arq")[0].value;
                        end_date = document.getElementsByName("fb_has_arq")[0].value;
                        loadGridDataVen(BASE_URL + 'get/datapv0101/carga_grilla_arqueo/' + co_planilla_cobranza + '/' + start_date + '/' + end_date + '/' + co_pto_vent, true, dhxGridarq, 'dhxGridarq', myLayoarq.cells("b"), false);
                        carga_plantilla_aqr_data('0', co_arqueo, serie_arqu, planilla);
                        break;
                    case 'Existe1':
                        dhtmlx.message({ type: "alert-error", text: "Ya existe un Arqueo Abierto '" + serie_arqu + "' ,debe terminarlo para poder generar uno nuevo.", expire: 6000 });
                        break;
                    case 'Existe1edit':
                        carga_plantilla_aqr_data('0', co_arqueo, serie_arqu, planilla);
                        myForm_b_arq.setItemValue('egreso_arq', im_saldextras), myForm_b_arq.setItemValue('saldo_arq', im_sald_cierre), myForm_b_arq.setItemValue('observ_arq', yobserva), myForm_b_arq.setItemValue('monto_ini_arq', im_inic), myForm_b_arq.setItemValue('co_pla_arq', plani), myForm_b_arq.setItemValue('fe_arq', fec_reg), myForm_b_arq.setItemValue('co_arq', co_arqueo), myForm_b_arq.setItemValue('serie_arq', serie_arqu), myForm_b_arq.setItemValue('responsable', co_registar), myForm_b_arq.setItemValue('vta_dia_arq', im_efectivo), myForm_b_arq.setItemValue('depo_dia_arq', im_deposit), myForm_b_arq.setItemValue('total_arq', totsaldo);
                        break;
                    case 'Actu':
                        myForm_b_arq.setItemValue('egreso_arq', im_saldextras), myForm_b_arq.setItemValue('saldo_arq', im_sald_cierre), myForm_b_arq.setItemValue('observ_arq', yobserva), myForm_b_arq.setItemValue('monto_ini_arq', im_inic), myForm_b_arq.setItemValue('co_pla_arq', plani), myForm_b_arq.setItemValue('fe_arq', fec_reg), myForm_b_arq.setItemValue('co_arq', co_arqueo), myForm_b_arq.setItemValue('serie_arq', serie_arqu), myForm_b_arq.setItemValue('responsable', co_registar), myForm_b_arq.setItemValue('vta_dia_arq', im_efectivo), myForm_b_arq.setItemValue('depo_dia_arq', im_deposit), myForm_b_arq.setItemValue('total_arq', totsaldo);
                        break;
                    case 'Actuini':
                        let partes1 = response.split('@');
                        let rptas = partes1[5], ymontoinicial = partes1[1], co_arqueoa = partes1[2], seriq = partes1[3], salcalcu = partes1[4];
                        carga_plantilla_aqr_data('0', co_arqueoa, seriq, planilla), serie_arqu_nvo = seriq, co_arqu_nvo = co_arqueoa;
                        myForm_b_arq.setItemValue('monto_ini_arq', ymontoinicial), myForm_b_arq.setItemValue('total_arq', salcalcu);
                        dhtmlx.message({ text: rptas, expire: 3000 });
                        break;
                }
            }, error: function (err) {
                dhtmlx.message({ type: "alert-error", text: "Ocurrio un problema ...", expire: 6000 });
                registra_errores(' Fail error() ' + JSON.stringify(err, null, 2), "datapo010502:carga_ajax_arq()", 'NO', planilla + '/' + co_pto_venta + '/' + co_vendedor_ini + '/' + flag + '/' + serie_arq + '/' + im_ini);
            }
        });
    }
    function carga_grilla(COARQ, SERIE, PLANILLA) {
        console.log(COARQ, SERIE, PLANILLA);
        myForm_detarq = layoutdesc_arq.cells("b").attachForm(form_DET_ARQ);
        myForm_detarq.attachEvent("onButtonClick", function (name) {
            switch (name) {
                case 'b_audit_arq':
                    let dhxW = new dhtmlXWindows();
                    let dhxW2t_arqe = dhxW.createWindow('w_arqaudi', 75, 5, 350, 300);
                    dhxW2t_arqe.setText("Ingresos, Egresos Extras");
                    let layoutdesc_arqaudi = new dhtmlXLayoutObject(dhxW.window('w_arqaudi'), '1C');
                    layoutdesc_arqaudi.cells("a").hideHeader();
                    let myForm_b_audi = layoutdesc_arqaudi.cells("a").attachForm(form_AUDI_ARQE);
                    dhxW.window('w_arqaudi').setModal(true);
                    dhxW.window('w_arqaudi').center();
                    myForm_b_audi.reloadOptions('v_auditor', BASE_URL + 'get/datapv0101/selct_vendedor/' + co_pto_venta);
                    myForm_b_audi.attachEvent("onButtonClick", function (name) {
                        $.ajax({
                            type: "POST", url: BASE_URL + 'get/datapv0101/save_audit_arq/' + COARQ + '/' + SERIE + '/' + PLANILLA + '/' + myForm_b_audi.getItemValue('v_auditor'), beforeSend: function () {
                            }, success: function (response) {
                                if (response === 'OK') {
                                    dhtmlx.message({ text: 'Auditado correctamente...', expire: 3000 });
                                    carga_plantilla_aqr_data('0', COARQ, SERIE, PLANILLA);
                                    dhxW.window('w_arqaudi').close(), dhxWcaja.window('w_aqqr').close(), dhxGridarq.clearAll();
                                    start_date = document.getElementsByName("fb_des_arq")[0].value;
                                    end_date = document.getElementsByName("fb_has_arq")[0].value;
                                    loadGridDataVen(BASE_URL + 'get/datapv0101/carga_grilla_arqueo/' + co_planilla_cobranza + '/' + start_date + '/' + end_date + '/' + co_pto_vent, true, dhxGridarq, 'dhxGridarq', myLayoarq.cells("b"), false);
                                } else {
                                    registra_errores(' Fail ajax() ' + response, "datapo010502:carga_grilla():b_audit_arq", 'SI', COARQ + '/' + SERIE + '/' + PLANILLA);
                                }
                            }, error: function (err) {
                                dhtmlx.message({ type: "alert-error", text: "Ocurrio un problema al Cargar el Cliente, actualice el sistema y vuelva a intentarlo", expire: 6000 });
                                registra_errores(' Fail ajax() ' + JSON.stringify(err, null, 2), "datapo010502:carga_grilla():b_audit_arq", 'SI', COARQ + '/' + SERIE + '/' + PLANILLA);
                            }
                        });
                    });
                    break;
                case 'b_conteo_arq':
                    let txt_id = "";
                    dhxGrid_arq.forEachRow(function (id) {
                        txt_id += dhxGrid_arq.cells(id, 0).getValue() + '@*@' + dhxGrid_arq.cells(id, 2).getValue() + '@-@';
                    });
                    txt_id = txt_id.substring(0, txt_id.length - 3);
                    $.ajax({
                        type: "POST", url: BASE_URL + 'get/datapv0101/save_valores_arq/' + txt_id + '/' + COARQ + '/' + SERIE + '/' + PLANILLA + '/grabar_deta', beforeSend: function () {
                        }, success: function (response) {
                            response === 'OK' ? dhtmlx.message({ text: 'Grabado correctamente...', expire: 3000 }) : registra_errores(' Fail ajax() ' + response, "datapo010502:carga_grilla():b_conteo_arq", 'SI', txt_id + '/' + COARQ + '/' + SERIE + '/' + PLANILLA + '/grabar_deta');
                        }, error: function (err) {
                            dhtmlx.message({ type: "alert-error", text: "Ocurrio un problema al Cargar el Cliente, actualice el sistema y vuelva a intentarlo", expire: 6000 });
                            registra_errores(' Fail ajax() ' + JSON.stringify(err, null, 2), "datapo010502:carga_grilla():b_conteo_arq", 'SI', txt_id + '/' + COARQ + '/' + SERIE + '/' + PLANILLA + '/grabar_deta');
                        }
                    });
                    break;
            }
        });
        dhxGrid_arq = new dhtmlXGridObject(myForm_detarq.getContainer("myGridARQ"));
        dhxGrid_arq.setHeader("CO.DENOMINA,DENOMINACION,CANT,TOTAL,FACTOR");
        dhxGrid_arq.setColTypes("ro,ro,dyn,ron,ro");
        dhxGridarq.setColSorting("int,str,int,int,int");
        dhxGrid_arq.setInitWidthsP("0,50,25,25,0"); //2
        dhxGrid_arq.enableEditEvents(true, false, false);
        dhxGrid_arq.attachFooter("<div></div>,<div></div>,<div>TOTAL</div>,<div style=\" text-align:right; font-weight: bold;\" id=\"ven_arq\"></div>", ["text-align:right;", "text-align:right;", "text-align:right;", "text-align:right;", "text-align:right;"]);
        dhxGrid_arq.setNumberFormat("0,000.0", 3);
        dhxGrid_arq.init();
        dhxGrid_arq.setColumnHidden(0, true);
        dhxGrid_arq.setColumnHidden(4, true);
        dhxGrid_arq.attachEvent("onEditCell", function (stage, rId, cInd, nValue, oValue) {
            if (stage == 2 && cInd == 2) {
                let factor = dhxGrid_arq.cells(rId, 4).getValue();
                let value = parseFloat(nValue) * parseFloat(factor);
                dhxGrid_arq.cells(rId, 3).setValue(value);
                calculateFooterValuesven(dhxGrid_arq, 'dhxGrid_arq');
                return true;
            }
        });
    }
    function carga_plantilla_aqr_data(flag, COARQ, SERIE, PLANILLA) {
        console.log(flag, COARQ, SERIE, PLANILLA);
        dhxGrid_arq.clearAll();
        loadGridDataVen(BASE_URL + 'get/datapv0101/carga_plantilla_arqueo/' + COARQ + '/' + SERIE + '/' + PLANILLA, true, dhxGrid_arq, 'dhxGrid_arq', layoutdesc_arq.cells("b"), true);
    }
    function carga_grilla_extrac(layout) {
        start_date = document.getElementsByName("fb_des_ext")[0].value;
        end_date = document.getElementsByName("fb_has_ext")[0].value;
        dhxGridext = layout.cells("b").attachGrid();
        dhxGridext.setImagePath(BASE_URL + 'dhtmlx/codebase/imgs/');
        dhxGridext.setHeader("#,PLANILLA,REFERENCIA,DEPO,FECHAREG,CODUNICO,CODBANCO,ESTADO");
        dhxGridext.setColTypes("ro,ro,ed,dyn,dhxCalendar,ro,ro,ro");
        dhxGridext.setInitWidthsP("4,10,10,10,10,10,10,10");
        dhxGridext.setColSorting("int,str,str,int,str,str,str,str");
        dhxGridext.setDateFormat("%d-%m-%Y");
        dhxGridext.init();
        dhxGridext.attachEvent("onDataReady", function () {
            var ids = dhxGridext.getAllRowIds();
            let parte = ids.split(",");
            for (var i = 0; i < parte.length; i++) {
                dhxGridext.setCellTextStyle(parte[i], 2, "color:orange; font-weight:500;");
                dhxGridext.setCellTextStyle(parte[i], 4, "color:blue; font-weight:500;");
            }
        });
        dhxGridext.attachEvent("onEditCell", function (stage, rId, cInd, nValue, oValue) {
            if (stage == 2) {
                let planilla_sext = dhxGridext.cells(rId, 1).getValue(), refre_Selct = dhxGridext.cells(rId, 2).getValue(), campo;
                campo = cInd === 2 ? 'REFERENCIA' : 'FECHA';
                oValue_ = cInd === 2 ? oValue : refre_Selct;
                // nValue_ = cInd === 2 ? nValue : refre_Selct;
                $.ajax({
                    type: "POST", url: BASE_URL + 'get/datapv0101/actu_id_refpago/' + planilla_sext + '/' + oValue_ + '/' + nValue + '/' + campo,
                    beforeSend: function () {
                        layout.cells("b").progressOn();
                    }, success: function (response) {
                        response != 'Conforme' ? dhtmlx.message({ title: "Error : Referencia encontrada", type: 'alert-error', text: response, expire: 3000 }) : dhtmlx.message({ text: response, expire: 3000 });
                        response != 'Conforme' ? dhxGridext.cells(rId, 2).setValue(oValue) : null;
                        //dhxGrid_Pagos.cells(rId, 4).setValue(response), dhxGrid_Pagos.cells(rId, 1).setValue(nValue);  //myForm_d.setItemValue('comproba_pago', response);
                        layout.cells("b").progressOff();
                    }, error: function (err) {
                        dhtmlx.message({ type: "error", text: 'No se pudo registrar...', expire: 3000 });
                        registra_errores(' Fail ajax() ' + JSON.stringify(err, null, 2), "datapo010502:actu_id_refpago()", 'NO', '0' + '/' + co_arqs + '/' + serie_arq + '/' + plan + '/btncalcular');
                        layout.cells("b").progressOff();
                    }
                });
                return true;
            }
        });
        carga_select_grilla(dhxGridext);
        loadGridDataVen(BASE_URL + 'get/datapv0101/carga_grilla_extracto/' + '0' + '/' + start_date + '/' + end_date, true, dhxGridext, 'dhxGridext', layout.cells("b"), false);
    }
    function carga_grilla_arqueo(layout) {
        dhxGridarq = layout.cells("b").attachGrid();
        dhxGridarq.setImagePath(BASE_URL + 'dhtmlx/codebase/imgs/');
        dhxGridarq.setHeader("CO_FECHA,CO_LOCAL,CO_SALON,CO_EMPRESA,CO_PERIODO,CO_ARQUEO,NOMBRE LOCAL,NRO.ARQUEO,PLANILLA,VENTAS EFECTIVO,DEPO.PLANILLA,SALDO,REGISTRADO,ESTADO,OBS");
        dhxGridarq.setColTypes("ro,ro,ro,ro,ro,ro,ro,ro,ro,dyn,dyn,dyn,ro,ro,ro");
        dhxGridarq.setInitWidthsP("0,0,0,0,0,0,40,8,8,10,10,10,20,10,20");
        dhxGridarq.setColSorting("str,str,str,str,str,str,str,str,str,str,str,str,str,str,str");
        dhxGridarq.setColAlign("left,left,center,center,left,left,left,left,left,right,right,right,left,left,left");
        dhxGridarq.init();
        dhxGridarq.setColumnHidden(1, true);
        dhxGridarq.setColumnHidden(2, true);
        dhxGridarq.setColumnHidden(3, true);
        dhxGridarq.setColumnHidden(4, true);
        dhxGridarq.setColumnHidden(5, true);
        dhxGridarq.setColumnHidden(6, true);
        start_date = document.getElementsByName("fb_des_arq")[0].value;
        end_date = document.getElementsByName("fb_has_arq")[0].value;
        loadGridDataVen(BASE_URL + 'get/datapv0101/carga_grilla_arqueo/' + co_planilla_cobranza + '/' + start_date + '/' + end_date + '/' + co_pto_vent, true, dhxGridarq, 'dhxGridarq', layout.cells("b"), false);
    }
    function reporte_arqueo(serie_arq, plani, co_arqs) {
        let dhxWin3_otro = new dhtmlXWindows();
        let dhxWin_ot = dhxWin3_otro.createWindow("w_reportarq", 0, 0, 950, 550);
        dhxWin3_otro.window("w_reportarq").setModal(true), dhxWin3_otro.window("w_reportarq").denyResize(), dhxWin3_otro.window("w_reportarq").center(), dhxWin_ot.setText("Otras Opciones");
        var myLayout_otr = new dhtmlXLayoutObject(dhxWin_ot, '1C');
        myLayout_otr.cells("a").hideHeader();
        myLayout_otr.cells("a").attachURL("<?php echo base_url(); ?>xml/pv0101/report_arqueo.php?serie=" + serie_arq + "&plan=" + plani + "&co_arq=" + co_arqs + "&emp=" + emp);
        myLayout_otr.cells("a").attachEvent("onContentLoaded", function (id) {
            myLayout_otr.cells("a").cells(id).progressOff();
        });
    }
    function carga_promocion() {
        myLayoutplav = new dhtmlXLayoutObject(tabbar.tabs("a16"), '5S');
        myLayoutplav.cells("a").hideHeader(), myLayoutplav.cells("a").setWidth(562), myLayoutplav.cells("a").setHeight(130), myLayoutplav.cells("b").hideHeader(), myLayoutplav.cells("c").hideHeader(), myLayoutplav.cells("d").hideHeader(), myLayoutplav.cells("d").setHeight(220), myLayoutplav.cells("e").hideHeader(), myLayoutplav2e = new dhtmlXLayoutObject(myLayoutplav.cells("b"), '2E');
        myLayoutplav2e.cells("a").hideHeader(), myLayoutplav2e.cells("a").setHeight(294), myLayoutplav2e.cells("b").hideHeader();
        myForm_b_pedido = myLayoutplav2e.cells("b").attachForm(form_boton_pedido);
        myForm_b_pedido.attachEvent("onButtonClick", function (name) {
            switch (name) {
                case 'bpe_cle_all':
                    if (cod_producto_select != '0') {
                        $.ajax({
                            type: "POST", url: BASE_URL + 'get/datapv0101/borrar_all/' + cod_pedido_promo + '/' + cod_producto_select, beforeSend: function () {
                            }, success: function (response) {
                                if (response == '1') {
                                    dhxGridtipopromo.clearSelection();
                                    dhxGridtepv_d.clearAll();
                                    loadGridData(BASE_URL + 'get/datapv0101/grilla_detalle_promo/' + cod_pedido_promo, true, dhxGridtepv_d, myLayoutplav2e.cells("a"), false);
                                    dhxGridtepv.clearAll();
                                    loadGridData(BASE_URL + 'get/datapv0101/grilla_pedidos_atender/' + 0 + '/' + co_pto_venta, true, dhxGridtepv, myLayoutplav.cells("a"), false);
                                }
                                cod_producto_select = '0';
                            }
                        });
                    } else {
                        dhtmlx.message({ type: "error", text: "Seleccione un producto para borrar, Por favor", expire: 3000 });
                    }
                    break;
                case 'bpe_new_de':
                    carga_pto_venta(cod_dni_promo, '01-01-1990', st_contingencia);
                    form_add_row_promo();
                    break;
                case 'bpe_dele_det':
                    if (cod_producto_select != '0') {
                        $.ajax({
                            type: "POST", url: BASE_URL + 'get/datapv0101/borrar_promo/' + cod_pedido_promo + '/' + cod_producto_select + '/' + cod_promo_select, beforeSend: function () {
                            }, success: function (response) {
                                if (response == '1') {
                                    if (dhxGrid_selectbono)
                                        dhxGrid_selectbono.clearAll();
                                    dhxGridtepv_d.clearAll();
                                    loadGridData(BASE_URL + 'get/datapv0101/grilla_detalle_promo/' + cod_pedido_promo, true, dhxGridtepv_d, myLayoutplav2e.cells("a"), false);
                                    dhxGrid_pipe.clearAll();
                                    loadGridData(BASE_URL + 'get/datapv0101/grilla_pipe_promo/' + co_priori + '/' + cod_pedido_promo, true, dhxGrid_pipe, myLayoutipopromo.cells("b"), false);
                                }
                                cod_producto_select = '0';
                            }
                        });
                    } else {
                        dhtmlx.message({ type: "error", text: "Seleccione un producto para borrar, Por favor", expire: 3000 });
                    }
                    break;
            }
        });
        myForm_b_promo = myLayoutplav.cells("e").attachForm(form_boton_promo);
        myForm_b_promo.attachEvent("onButtonClick", function (name) {
            switch (name) {
                case 'bp_desct':
                    dhxW = new dhtmlXWindows();
                    dhxW2t = dhxW.createWindow("w_descto", 75, 5, 850, 450);
                    dhxW2t.setText("Promociones de Punto de Venta");
                    layoutdesc = new dhtmlXLayoutObject(dhxW.window("w_descto"), '2E');
                    layoutdesc.cells("a").hideHeader(), layoutdesc.cells("b").hideHeader();
                    dhxGridesc = layoutdesc.cells("a").attachGrid();
                    dhxGridesc.setImagePath(BASE_URL + 'dhtmlx/codebase/imgs/');
                    dhxGridesc.setHeader("COD,NOMBRE,F.INI,F.FIN,ESTADO,TIPO, - %");
                    dhxGridesc.setColTypes("ro,ro,ro,ro,ro,ro,ro");
                    dhxGridesc.setInitWidths("30,380,90,90,80,80,80");
                    dhxGridesc.setColSorting("str,str,str,str,str,str,str");
                    dhxGridesc.init();
                    dhxGridescdd = layoutdesc.cells("b").attachGrid();
                    dhxGridescdd.setImagePath(BASE_URL + 'dhtmlx/codebase/imgs/');
                    dhxGridescdd.setHeader("NOMBRE, - %");
                    dhxGridescdd.setColTypes("ro,ro");
                    dhxGridescdd.setInitWidths("330,80"); //2                     dhxGridtep.setColAlign("left,left,left,left,left,left,right,left");
                    dhxGridescdd.setColSorting("str,str");
                    dhxGridescdd.init();
                    loadGridDatapromo(BASE_URL + 'get/datapv0101/carga_descto/' + co_pto_venta, true, dhxGridesc, layoutdesc.cells("a"), false);
                    dhxGridesc.attachEvent("onRowSelect", function () {
                        var rowidpv = dhxGridesc.getSelectedRowId();
                        var st_detalle = dhxGridesc.cells(rowidpv, 5).getValue();
                        dhxGridescdd.clearAll();
                        loadGridDatapromo(BASE_URL + 'get/datapv0101/carga_descto_de/' + co_pto_venta + '/' + rowidpv + '/' + st_detalle, true, dhxGridescdd, layoutdesc.cells("b"), false);
                    });
                    break;
                case 'bp_carg_coup':
                    dhxWin_cupo = new dhtmlXWindows();
                    dhxWincuop = dhxWin_cupo.createWindow("w_cupo", 400, 175, 350, 150);
                    dhxWincuop.setText("Ingrese Cuponera");
                    myform_cupo = dhxWincuop.attachForm(form_cupo);
                    myform_cupo.attachEvent("onButtonClick", function (name) {
                        switch (name) {
                            case 'b_si_cupo':
                                var cupon = myform_cupo.getItemValue('num_cupo');
                                if (parseInt(cupon) >= 1001) {
                                    dhxGridcuponera = myLayoutplav.cells("d").attachGrid();
                                    dhxGridcuponera.setImagePath(BASE_URL + 'dhtmlx/codebase/imgs/');
                                    dhxGridcuponera.setHeader("NOMBRE,MARCA,SUBMARCA,%DSCTO");
                                    dhxGridcuponera.setColTypes("ro,ro,ro,ro");
                                    dhxGridcuponera.setInitWidths("350,70,70,70"); //2
                                    dhxGridcuponera.setColAlign("left,left,left,left");
                                    dhxGridcuponera.setColSorting("str,str,str,str");
                                    dhxGridcuponera.setColumnHidden(1, true);
                                    dhxGridcuponera.setColumnHidden(2, true);
                                    dhxGridcuponera.init();
                                    $.ajax({
                                        type: "POST", url: BASE_URL + 'get/datapv0101/carga_cuponera/' + cod_pedido_promo + '/' + cupon, beforeSend: function () {
                                        }, success: function (response) {
                                            if (response == 'no') {
                                                dhtmlx.message({ type: "error", text: "Ya esta registrado una cuponera, elimine con el boton para registrar de nuevo la cuponera...", expire: 5000 });
                                            } else {
                                                loadGridDatapromo(BASE_URL + 'get/datapv0101/carga_cuponera_datos/' + cod_pedido_promo + '/' + cupon, true, dhxGridcuponera, myLayoutplav.cells("d"), false);
                                            }
                                        }
                                    });
                                    myform_cupo.setItemValue('num_cupo', '')
                                    dhxWin_cupo.window('w_cupo').close();
                                } else {
                                    dhtmlx.message({
                                        title: "Informativo", type: "alert-warning", text: "Solo est\u00e1n permitos los cupones de 1001 a 1200..."
                                    });
                                }
                                break;
                            case 'b_no_cupo':
                                myform_cupo.setItemValue('num_cupo', '')
                                dhxWin_cupo.window('w_cupo').close();
                                break;
                        }
                    });

                    break;
                case 'bp_apli_coup':
                    $.ajax({
                        type: "POST", url: BASE_URL + 'get/datapv0101/aplicar_cuponera/' + cod_pedido_promo, beforeSend: function () {
                        }, success: function (response) {
                            if (response == '1') {
                                dhxGridtepv_d.clearAll();
                                dhxGridcuponera.clearAll();
                                loadGridData(BASE_URL + 'get/datapv0101/grilla_detalle_promo/' + cod_pedido_promo, true, dhxGridtepv_d, myLayoutplav2e.cells("a"), false);
                                dhxGrid_pipe.clearAll();
                                dhxGrid_selectbono.clearAll();
                            } else {
                                dhtmlx.message({ type: "error", text: "Ya esta registrado una cuponera, elimine con el boton para registrar de nuevo la cuponera...", expire: 5000 });
                            }
                        }
                    });
                    break;
                case 'bp_canc_cupo':
                    $.ajax({
                        type: "POST", url: BASE_URL + 'get/datapv0101/cancelar_cuponera/' + cod_pedido_promo, beforeSend: function () {
                        }, success: function (response) {
                            if (response == '1') {
                                dhxGridtepv_d.clearAll();
                                loadGridData(BASE_URL + 'get/datapv0101/grilla_detalle_promo/' + cod_pedido_promo, true, dhxGridtepv_d, myLayoutplav2e.cells("a"), false);
                                dhxGrid_pipe.clearAll();
                                dhxGrid_selectbono.clearAll();
                            }
                        }
                    });
                    break;
                case 'bp_new_de':
                    dhxGrid_selectbono.editStop();
                    var topepromo = dhxGrid_pipe.cells(co_tipo_promo, 1).getValue();
                    if (parseFloat(sumador_promo) <= parseFloat(topepromo)) {
                        myLayoutplav2e.cells("a").progressOn();
                        var ids = dhxGrid_selectbono.getAllRowIds(",");
                        var temp = new Array();
                        temp = ids.split(",");
                        var cadena_de = "";
                        var countf = 0;
                        for (a in temp) {
                            if (co_priori == '7') {
                                var id_maycero = myForm_b_promo.getItemValue('b_combo');
                            } else {
                                var id_maycero = dhxGrid_selectbono.cells(temp[a], 8).getValue();
                            }
                            var stock_uni = dhxGrid_selectbono.cells(temp[a], 9).getValue();
                            var no_prod = dhxGrid_selectbono.cells(temp[a], 1).getValue();
                            if ((parseInt(id_maycero) > 0)) {
                                if (parseInt(id_maycero) <= stock_uni) {
                                    nu_cant_prmo = id_maycero;
                                    tipo_promo = dhxGrid_selectbono.cells(temp[a], 3).getValue();
                                    precio_promo = parseFloat((dhxGrid_selectbono.cells(temp[a], 5).getValue()) * 1.18).toFixed(2);
                                    if (tipo_promo == 'P') {
                                        im_sub_igv = '0', p_igv = '0', im_sub_total = '0';
                                    } else {
                                        im_sub_igv = parseFloat((parseFloat(nu_cant_prmo) * parseFloat(precio_promo)) / 1.18).toFixed(2);
                                        im_sub_total = (parseFloat(nu_cant_prmo) * parseFloat(precio_promo)).toFixed(2);
                                        p_igv = parseFloat(im_sub_total - im_sub_igv).toFixed(2);
                                    }
                                    if (cadena_de.length == 0) {
                                        cadena_de = temp[a] + "@*@" + nu_cant_prmo + "@*@" + precio_promo + "@*@" + tipo_promo + "@*@" + im_sub_igv + "@*@" + p_igv + "@*@" + im_sub_total;
                                    } else {
                                        cadena_de = cadena_de + "@-@" + temp[a] + "@*@" + nu_cant_prmo + "@*@" + precio_promo + "@*@" + tipo_promo + "@*@" + im_sub_igv + "@*@" + p_igv + "@*@" + im_sub_total;
                                    }
                                    countf++;
                                } else {
                                    dhtmlx.message({ type: "error", text: "El producto : " + no_prod + " no suficiente stock...", expire: 5000 });
                                }
                            }
                        }
                        if (countf > 0) {
                            $.ajax({
                                type: "POST", url: BASE_URL + 'get/datapv0101/registrar_promo_cadena/' + cod_pedido_promo + '/' + cadena_de + '/' + countf + '/' + co_promo_prod, beforeSend: function () {
                                }, success: function (response) {
                                    if (response == 'OK') {
                                        dhxGrid_pipe.clearAll();
                                        loadGridData(BASE_URL + 'get/datapv0101/grilla_pipe_promo/' + co_priori + '/' + cod_pedido_promo, true, dhxGrid_pipe, myLayoutipopromo.cells("b"), false);
                                        dhxGridtepv_d.clearAll();
                                        dhtmlx.message({ text: "Se agregó la promoción", expire: 3000 });
                                        loadGridData(BASE_URL + 'get/datapv0101/grilla_detalle_promo/' + cod_pedido_promo, true, dhxGridtepv_d, myLayoutplav2e.cells("a"), false);
                                        dhxGrid_pipe.clearAll();
                                        dhxGrid_selectbono.clearAll();
                                    } else {
                                        dhtmlx.message({ type: "error", text: response, expire: 5000 });
                                    }
                                }
                            });
                        } else {
                            dhtmlx.message({ type: "error", text: "No a ingresado productos de promocion", expire: 5000 });
                        }
                        myLayoutplav2e.cells("a").progressOff();
                    } else {
                        dhtmlx.message({ type: "error", text: "Solo esta permitido regalar " + topepromo + " produto(s) de la lista...", expire: 5000 });
                    }
                    break;
                case 'bp_clos_ped':
                    myForm_c.reloadOptions('selec_afec_igv', BASE_URL + 'get/datapv0101/selec_afec_igv/');
                    if (co_pto_vent == '6') {
                        selec_afec_igv = 21;
                        myForm_c.setItemValue('selec_afec_igv', '21');
                    } else {
                        selec_afec_igv = 10;
                        myForm_c.setItemValue('selec_afec_igv', '10');
                    }
                    myForm_b_promo.setItemValue('b_combo', '0');
                    if (cod_pedido_promo == '0') {
                        dhtmlx.message({
                            type: "error",
                            text: "Seleccione un Pedido :<img style=\"width: 94%;margin: 2% 3% 3% 3%;\" src=\"http://webpedidos.corporacionlife.com.pe/web/dhtmlx/codebase/imgs/ayuda/num_pedido.png\" >",
                            expire: 6000
                        });
                    } else {
                        mygridVN.clearAll();
                        loadGridData(BASE_URL + 'get/datapv0101/grilla_detalle_pedido/' + cod_pedido_promo, true, mygridVN, myLayout.cells("a"), true);
                        tabbar.tabs("a11").setActive();
                        myForm_a.setItemValue('ruc_dni', cod_dni_promo);
                        myForm_a.setItemValue('razonsocial', cod_nom_promo.replace(/&amp;/g, "&"));
                        carga_pto_venta(cod_dni_promo, fecha_fn, st_contingencia);
                        myForm_a.setItemValue('num_pedido', cod_pedido_promo);
                        mygridVN.setColumnHidden(12, true), myForm_a.disableItem('guardar');//, myForm_a.disableItem('new_de'),myForm_a.disableItem('cod_barrasacn');
                    }
                    break;
            }
        });


        dhxGridtepv = myLayoutplav.cells("a").attachGrid();
        dhxGridtepv.setImagePath(BASE_URL + 'dhtmlx/codebase/imgs/');
        dhxGridtepv.setHeader(",PEDIDOS,C. VENDEDOR,NOM.  VENDEDOR,RUC/DNI,NOMBRE CLIENTE ,TOTAL,C. DIRECCION,DESC. DIRRECCION,NU_ICBPER");
        dhxGridtepv.setColTypes("img,ro,ro,ro,ro,ro,ron,ro,ro,ro");
        dhxGridtepv.setInitWidthsP("7,14,25,10,22,42,15,10,10,10"); //2
        dhxGridtepv.setColAlign("left,left,left,left,left,left,left,right,left,left");
        dhxGridtepv.setColSorting("str,str,str,str,str,str,int,str,str,int");
        dhxGridtepv.setNumberFormat("000.00", 6);
        dhxGridtepv.setColumnHidden(7, true);
        dhxGridtepv.setColumnHidden(8, true);
        dhxGridtepv.setColumnHidden(9, true);
        dhxGridtepv.setColumnHidden(2, true);
        dhxGridtepv.setColumnHidden(3, true);
        dhxGridtepv.init();
        dhxGridtepv.attachEvent("onRowSelect", function (id, ind) {
            //console.log('id :' + id + ' ind : ' + ind); /*FASE.CO_CORR_PASO||'@'||DMET.CO_PASO_DET||'@'||MEDIC.CO_CONCEPTO_MEDICION*/
            if (ind == '0') {
                dhtmlx.confirm("¿Desea aliminar la Promoción Registrada? ", function (result) {
                    if (result === Boolean(true)) {
                        $.ajax({
                            type: "POST",
                            url: BASE_URL + 'get/datapv0101/elimina_promo_regsistra/' + id,
                            beforeSend: function () {
                            },
                            success: function (response) {
                                dhxGridtepv.clearAll();
                                loadGridData(BASE_URL + 'get/datapv0101/grilla_pedidos_atender/' + co_vendedor + '/' + co_pto_venta, true, dhxGridtepv, myLayoutplav.cells("a"), false);
                            }, error: function (err) {
                                return false;
                            }
                        });
                    }
                });
            }
        });
        loadGridData(BASE_URL + 'get/datapv0101/grilla_pedidos_atender/' + co_vendedor + '/' + co_pto_venta, true, dhxGridtepv, myLayoutplav.cells("a"), false);

        dhxGridtepv.attachEvent("onRowSelect", function () {
            var rowidpv = dhxGridtepv.getSelectedRowId();
            cod_pedido_sele = rowidpv;
            cod_pedido_promo = dhxGridtepv.cells(rowidpv, 1).getValue();
            cod_dni_promo = dhxGridtepv.cells(rowidpv, 4).getValue();
            cod_nom_promo = dhxGridtepv.cells(rowidpv, 5).getValue();
            dhxGridtepv_d = myLayoutplav2e.cells("a").attachGrid();
            dhxGridtepv_d.setImagePath(BASE_URL + 'dhtmlx/codebase/imgs/');
            dhxGridtepv_d.setHeader("C. PROD,,DESCRIPCION,CANT,IM_PRE_V,PROMO");
            dhxGridtepv_d.attachHeader("#text_filter,&nbsp,#text_filter,&nbsp,&nbsp,&nbsp,&nbsp,&nbsp,&nbsp");
            dhxGridtepv_d.setColTypes("ro,img,ro,ro,ro,ro");
            dhxGridtepv_d.setInitWidths("120,30,360,50,70,10"); //2
            dhxGridtepv_d.setColAlign("left,center,left,left,left,left");
            dhxGridtepv_d.setColSorting("str,str,str,str,str,str");
            dhxGridtepv_d.setColumnHidden(4, true);
            dhxGridtepv_d.setColumnHidden(5, true);
            dhxGridtepv_d.init();
            loadGridData(BASE_URL + 'get/datapv0101/grilla_detalle_promo/' + cod_pedido_promo, true, dhxGridtepv_d, myLayoutplav2e.cells("a"), false);

            dhxGridtepv_d.attachEvent("onRowSelect", function () {
                console.log('pipe2');
                var id_grid = dhxGridtepv_d.getSelectedRowId();
                cod_producto_select = dhxGridtepv_d.cells(id_grid, 0).getValue(); //                            console.log(cod_producto_select);
                cod_promo_select = dhxGridtepv_d.cells(id_grid, 5).getValue();

            });

            carga_select_grilla(dhxGridtepv_d);
            if (dhxGrid_pipe) {
                dhxGrid_pipe.clearAll();
                dhxGrid_selectbono.clearAll();
                dhxGridcuponera.clearAll();
                loadGridData(BASE_URL + 'get/datapv0101/grilla_pipe_promo/' + co_priori + '/' + cod_pedido_promo, true, dhxGrid_pipe, myLayoutipopromo.cells("b"), false);
            }
        });
        myLayoutipopromo = new dhtmlXLayoutObject(myLayoutplav.cells("c"), '2U');
        myLayoutipopromo.cells("a").hideHeader();
        myLayoutipopromo.cells("a").setWidth(340);
        myLayoutipopromo.cells("a").setHeight(150);
        myLayoutipopromo.cells("b").hideHeader();
        dhxGridtipopromo = myLayoutipopromo.cells("a").attachGrid();
        dhxGridtipopromo.setImagePath(BASE_URL + 'dhtmlx/codebase/imgs/');
        dhxGridtipopromo.setHeader("COD,TIPO PROMOCION1");
        dhxGridtipopromo.setColTypes("ro,ro");
        dhxGridtipopromo.setInitWidths("70,250"); //2
        dhxGridtipopromo.setColAlign("left,left");
        dhxGridtipopromo.setColSorting("str,str");
        dhxGridtipopromo.setColumnHidden(0, true);
        dhxGridtipopromo.init();
        loadGridData(BASE_URL + 'get/datapv0101/grilla_tipo_promo/', true, dhxGridtipopromo, myLayoutipopromo.cells("a"), false);
        dhxGridtipopromo.attachEvent("onRowSelect", function () {
            console.log('pipe1');
            if (dhxGrid_selectbono) {
                dhxGrid_selectbono.clearAll();
            }
            co_priori = dhxGridtipopromo.getSelectedRowId();
            dhxGrid_pipe = myLayoutipopromo.cells("b").attachGrid();
            dhxGrid_pipe.setImagePath(BASE_URL + 'dhtmlx/codebase/imgs/');
            dhxGrid_pipe.setHeader("VENTA,BONO,S/.PROMO,COD, PROMOCION, CO_TIPO_PROMOCION, DE_TIPO_PROMOCION,ST_FLAG");
            dhxGrid_pipe.setColTypes("ro,ro,ron,ro,ro,ro,ro,ro");
            dhxGrid_pipe.setInitWidths("60,60,70,70,200,10,10,10"); //2
            dhxGrid_pipe.setColAlign("center,center,left,left,left,left,left,left");
            dhxGrid_pipe.setColSorting("str,str,int,str,str,str,str,str");
            dhxGrid_pipe.setNumberFormat("0000.00", 2);
            dhxGrid_pipe.setColumnHidden(5, true);
            dhxGrid_pipe.setColumnHidden(3, true);
            dhxGrid_pipe.setColumnHidden(6, true);
            dhxGrid_pipe.setColumnHidden(7, true);
            dhxGrid_pipe.init();
            loadGridData(BASE_URL + 'get/datapv0101/grilla_pipe_promo/' + co_priori + '/' + cod_pedido_promo, true, dhxGrid_pipe, myLayoutipopromo.cells("b"), false);
            dhxGrid_pipe.attachEvent("onRowSelect", function () {
                co_tipo_promo = dhxGrid_pipe.getSelectedRowId();
                co_promo_prod = dhxGrid_pipe.cells(co_tipo_promo, 3).getValue();
                dhxGrid_selectbono = myLayoutplav.cells("d").attachGrid();
                dhxGrid_selectbono.setImagePath(BASE_URL + 'dhtmlx/codebase/imgs/');
                dhxGrid_selectbono.setHeader("CODIGO,PRODUCTO, BONO,TIPO,P.REAL,S/.PRO,CO.PROMO,SALDO,CANT,STOCK");
                dhxGrid_selectbono.attachHeader("#text_filter,#text_filter,&nbsp,&nbsp,&nbsp,&nbsp,&nbsp,&nbsp,&nbsp");
                if (co_priori == '7') {
                    myForm_b_promo.enableItem('b_combo');
                    dhxGrid_selectbono.setColTypes("ro,ro,ro,ro,ro,ro,ro,ro,ro,ro");
                } else {
                    myForm_b_promo.disableItem('b_combo');
                    dhxGrid_selectbono.setColTypes("ro,ro,ro,ro,ro,ro,ro,ro,edn,ro");
                }
                dhxGrid_selectbono.setInitWidths("150,350,50,50,50,50,70,70,70,70"); //2
                dhxGrid_selectbono.setColAlign("left,left,left,left,left,left,left,left,left");
                dhxGrid_selectbono.setColSorting("str,str,str,str,str,str,str,str,int,int");
                dhxGrid_selectbono.setColumnHidden(2, true);
                dhxGrid_selectbono.setColumnHidden(3, true);
                dhxGrid_selectbono.setColumnHidden(4, true);
                dhxGrid_selectbono.setColumnHidden(6, true);
                dhxGrid_selectbono.setColumnHidden(7, true);
                if (co_priori == '7') {//  myForm_b_promo.disableItem('b_combo');
                    dhxGrid_selectbono.setColumnHidden(8, true);
                }
                dhxGrid_selectbono.enableEditEvents(true, false, false);
                dhxGrid_selectbono.init();
                dhxGrid_selectbono.attachEvent("onEditCell", function () {
                    calculateFooterValuespromo();
                    return true;
                });
                loadGridDatapromo(BASE_URL + 'get/datapv0101/grilla_selecbono/' + co_tipo_promo + '/' + co_pto_venta + '/' + cod_pedido_sele, true, dhxGrid_selectbono, myLayoutplav.cells("d"), false);
                dhxGrid_selectbono.attachEvent("onRowSelect", function () {
                    cod_cata_promo = dhxGrid_selectbono.getSelectedRowId();
                    precio_promo = parseFloat(dhxGrid_selectbono.cells(cod_cata_promo, 5).getValue()).toFixed(1);
                    tipo_promo = dhxGrid_selectbono.cells(cod_cata_promo, 3).getValue(); //N,P
                });
            });
        });
        dhxGrid_selectbono = myLayoutplav.cells("d").attachGrid();
        dhxGrid_selectbono.setImagePath(BASE_URL + 'dhtmlx/codebase/imgs/');
        dhxGrid_selectbono.setHeader("CODIGO,PRODUCTO, BONO,TIPO,P.REAL,S/.PRO,CO.PROMO,SALDO,CANT,STOCK");
        dhxGrid_selectbono.attachHeader("#text_filter,#text_filter,&nbsp,&nbsp,&nbsp,&nbsp,&nbsp,&nbsp,&nbsp");
        dhxGrid_selectbono.setColTypes("ro,ro,ro,ro,ro,ro,ro,ro,ro,ro");
        dhxGrid_selectbono.setInitWidths("150,350,50,50,50,50,70,70,70,70"); //2
        dhxGrid_selectbono.setColAlign("left,left,left,left,left,left,left,left,left");
        dhxGrid_selectbono.setColSorting("str,str,str,str,str,str,str,str,int,int");
        dhxGrid_selectbono.setColumnHidden(2, true);
        dhxGrid_selectbono.setColumnHidden(3, true);
        dhxGrid_selectbono.setColumnHidden(4, true);
        dhxGrid_selectbono.setColumnHidden(6, true);
        dhxGrid_selectbono.setColumnHidden(7, true);
        dhxGrid_selectbono.enableEditEvents(true, false, false);
        dhxGrid_selectbono.init();
    }
    function carga_proveedor() {
        dhxWinlispro = new dhtmlXWindows();
        dhxWinal3 = dhxWinlispro.createWindow("w_formadd2l", 85, 20, 850, 550);
        dhxWinal3.setText("Lista de Clientes");
        dhxWinlispro.window('w_formadd2l').button('close').hide();
        dhxWinlispro.window('w_formadd2l').addUserButton("dock", 5, "Dock Window", "dock");
        dhxWinlispro.window('w_formadd2l').button('dock').attachEvent("onClick", function (win, button) {
            dhxWinlispro.window('w_formadd2l').hide();
        });
        myToolbar = dhxWinlispro.window("w_formadd2l").attachToolbar();
        myToolbar.addText("label", 0, "RUC :");
        myToolbar.addInput("ruc_ref1", 1, "", 120);
        myToolbar.addButton("b_busca_ruc", 2, "Buscar", "", "");
        dhxGridlistap = dhxWinlispro.window("w_formadd2l").attachGrid();
        dhxGridlistap.setImagePath(BASE_URL + 'dhtmlx/codebase/imgs/');
        dhxGridlistap.setHeader("CODIGO,NOMBRE");
        dhxGridlistap.setColTypes("ro,ro");
        dhxGridlistap.setInitWidthsP("15,80"); //2
        dhxGridlistap.setColAlign("right,left");
        dhxGridlistap.setColSorting("str,str");
        dhxGridlistap.init();
        dhxGridlistap.setSkin("dhx_skyblue");
        myToolbar.attachEvent("onEnter", function (id, value) {
            loadGridData(BASE_URL + 'get/datapv0101/lista_provee/' + value, true, dhxGridlistap, dhxWinal3, false);
        });
        myToolbar.attachEvent("onClick", function (id) {
            loadGridData(BASE_URL + 'get/datapv0101/lista_provee/' + myToolbar.getValue("ruc_ref1"), true, dhxGridlistap, dhxWinal3, false);
        });
        dhxGridlistap.attachEvent("onRowDblClicked", function () {
            var ruc_ref = dhxGridlistap.getSelectedRowId();
            nom_ref = dhxGridlistap.cells(ruc_ref, 1).getValue();
            myForm_c.setItemValue('ruc_provee', ruc_ref);
            dhxWinlispro.window('w_formadd2l').hide();
        });
    }
    /*function actu_t_d_admin(cod_cli, fnac) {
     $.ajax({type: "POST", url: BASE_URL + "get/datapv0101/carga_pto_venta/" + cod_cli + '/' + fnac,
     beforeSend: function () {
     }, success: function (response) {
     var json = eval(response);
     cod_cliente = cod_cli;
     for (var i in json) {
     t_d_admin = json[i].T_D_ADMIN;
     }
     console.log(t_d_admin);
     }
     });
     }*/
    function carga_pto_venta(cod_cli, fnac, st_contingencia) {
        mygridVN.setColumnHidden(12, false), myForm_a.enableItem('guardar');//, myForm_a.enableItem('new_de'),myForm_a.enableItem('cod_barrasacn');
        var fecha = new Date();
        myForm_a.setItemValue('fec', fecha); //,myForm_b.unch
        $.ajax({
            type: "POST", url: BASE_URL + "get/datapv0101/carga_pto_venta/" + cod_cli + '/' + fnac + '/' + st_contingencia,
            beforeSend: function () {
                var example = mygridVN.getAllItemIds();
                var numbers = example.split(',');                            //carga_num_pedido();
                if (numbers.length > 0) {
                    mygridVN.clearAll();
                }
            }, success: function (response) {
                var json = eval(response);
                cod_cliente = cod_cli;
                for (var i in json) {
                    co_pto_fact = json[i].CO_PTO_FACTURACION;
                    co_pto_vent = json[i].CO_PTO_VENTA;
                    co_comprobante_doc = json[i].NUM_DOC;
                    listado_precios = json[i].LISTADO_PRECIOS;
                    serie_listado = json[i].SERIE_LISTADO;
                    myForm_c.setItemValue('doc_doc_emi', co_comprobante_doc);
                    t_d_admin = json[i].T_D_ADMIN;
                    igv = json[i].IGV;
                    nom_listaprecios = json[i].NOM_LISTADO;
                    period = json[i].PERIODO;
                    anho = period.substring(0, 4);
                    mes = period.substring(4, 6);
                    length_cli = json[i].LENGTH_CLIE;
                    usuario = json[i].USUARIO;
                    periodo_s_pla = period;
                    /*cliente_defecto*/
                    var CO_CATALOGO_ENTIDAD = json[i].CO_CATALOGO_ENTIDAD;
                    det_cata = json[i].DE_RAZON_SOCIAL; //var T_CAMBIO = json[i].T_CAMBIO;
                    cod_direcc = json[i].COD_DIRECC;
                    co_planilla_cobranza = json[i].CO_PLANILLA_COBRANZA;
                    num_pedido = json[i].NUMPEDIDO;
                    form_b_pla.setItemValue('plan_liqui', co_planilla_cobranza);
                }
                myForm_a.setItemValue('num_pedido', num_pedido);
                myForm_c.hideItem('import_flete'), myForm_c.uncheckItem('chek_fle'), myForm_c.uncheckItem('ch_gratuita'),
                    myForm_c.setItemValue('import_flete', '0'), st_flete = 'N', nota_cre = '', nu_ncredito = '0';
                if (cod_cliente == '210' || cod_cliente == '220') {
                    myForm_c.showItem('observ_venta');
                    myForm_c.setItemValue('observ_venta', '');
                } else {
                    myForm_c.hideItem('observ_venta');
                    myForm_c.setItemValue('observ_venta', '.');
                }
                if (co_pto_vent == '6') {
                    selec_afec_igv = 21;
                    myForm_c.setItemValue('selec_afec_igv', 21);
                    myForm_c.showItem('ruc_provee'), myForm_c.showItem('ref_doc'), myForm_c.showItem('ref_mon');
                } else {
                    selec_afec_igv = 10;
                    myForm_c.setItemValue('selec_afec_igv', 10);
                    myForm_c.hideItem('ruc_provee'), myForm_c.hideItem('ref_doc'), myForm_c.hideItem('ref_mon');
                }
                myForm_c.setItemValue('doc_not_cre', ''), myForm_d.setItemValue('nu_ncredito', '0');
                myForm_c.uncheckItem('chek_nota');
                if (co_pto_venta == '4') {
                    myForm_a.hideItem("guardar");
                    myForm_a.hideItem("num_pedido");
                }
                if (RESPONSABLE == 'S') {
                    ///myForm_d.setItemLabel('ver__', 'Version :' + ver__ + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Impresora : ' + (printer).replace(/[+]/g, " ") + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Estado :' + WSPrint.readyState);
                    myForm_b.setItemValue('nro_pla', co_planilla_cobranza);
                    form_b_pla.setItemValue('busca_planilla', co_planilla_cobranza);
                    myForm_c.setItemValue('nom_doc_emi', det_cata);
                    myForm_c.setItemValue('ruc_dni_doc_emi', CO_CATALOGO_ENTIDAD);
                    //myForm_c.setItemValue('direccion_c', DIRECCION);
                    myForm_a.setItemValue('ruc_dni', CO_CATALOGO_ENTIDAD);
                    myForm_a.setItemValue('razonsocial', det_cata);
                    //myForm_a.setItemValue('direccion_a', DIRECCION);
                    myForm_c.setItemValue('tipo_client', nom_listaprecios);
                    myForm_a.setItemLabel('lista_precios', 'L.PRECIOS : ' + nom_listaprecios);
                    myForm_a.setItemLabel('cant_items', 'Items : ' + cant_items_);
                    carga_grilla_productos(serie_listado, co_pto_venta, listado_precios, st_igv);
                }
                myForm_c.setItemValue('por_blogger', '0');
                if (parseFloat(length_cli) === 11.00) { //factura
                    myForm_c.uncheckItem('chek_man');
                    if (parseFloat(suma) > 0.00) { //ya agrego productos
                        calculateFooterValues();
                    }
                } else {
                    myForm_c.uncheckItem('chek_man');
                    if (parseFloat(suma) > 0.00) { //si ya agrego productos
                        calculateFooterValues();
                    }
                }
            }, error: function (err) {
                dhtmlx.message({ type: "alert-error", text: "Ocurrio un problema al Cargar el Cliente, actualice el sistema y vuelva a intentarlo", expire: 6000 });
                registra_errores(' Fail ajax() ' + JSON.stringify(err, null, 2), "datapo010502:finis_pasos", 'SI', co_comprobante_doc + ' dni:' + cod_cli + ' fnac:' + fnac);
            }
        });
    }
    function f_selectvendedor() {
        var opts = myForm_a.getOptions("selec_vendedor"), text = (opts[opts.selectedIndex].text);
        myForm_a.setItemLabel('de_vendedor', 'VENDEDOR : ' + text);
    }
    function form_add_row_promo() {
        dhxWinsfadd_p = new dhtmlXWindows();
        dhxWinaddrows_p = dhxWinsfadd_p.createWindow("w_formadd_p", 285, 80, 450, 250);
        dhxWinaddrows_p.setText("Busqueda de productos");
        myform_addrow_p = dhxWinaddrows_p.attachForm(form_addrow);
        dhxWinsfadd_p.window('w_formadd_p').button('minmax').hide();
        myform_addrow_p.attachEvent("onFocus", function (name) {
            switch (name) {
                case 'frow_cata':
                    dhxWinsfadd2.window('w_formadd2').show();
                    break;
            }
        });
        myform_addrow_p.attachEvent("onButtonClick", function (name) {
            switch (name) {
                case 'frows_badd':
                    var cant = parseInt(myform_addrow_p.getItemValue('frow_cant'));
                    var desc1_p = parseInt(myform_addrow_p.getItemValue('frow_cant_desc'));
                    if (clase == '6') {
                        console.log('clase 6');
                    } else {
                        if (cant <= stock) {
                            if (parseFloat(desc1_p) > 0) {
                                var precio1 = parseFloat(precio) - parseFloat((desc1_p / 100) * precio);
                            } else {
                                var precio1 = precio;
                            }
                            var canxprecioigv = (cant * precio1 / 1.18).toFixed(2);
                            var valor = (cant * precio1).toFixed(2);
                            var igv = (valor - canxprecioigv).toFixed(2);
                            $.ajax({
                                type: "POST",
                                url: BASE_URL + 'get/datapv0101/count_pedido/' + cod_cata + '/' + cod_pedido_promo + '/L',
                                beforeSend: function () {
                                },
                                success: function (response) {
                                    if (response == '0') {
                                        $.ajax({
                                            type: "POST", url: BASE_URL + 'get/datapv0101/insert_pedido/' + cod_cata + '/' + medida_uni + '/' + cant + '/' + valor + '/' + canxprecioigv + '/' + precio1 + '/' + '/L' + '/' + cod_pedido_promo + '/' + igv + '/' + desc1_p,
                                            beforeSend: function () {
                                            }, success: function (response) {
                                                dhxGridtepv_d.clearAll();
                                                loadGridData(BASE_URL + 'get/datapv0101/grilla_detalle_promo/' + cod_pedido_promo, true, dhxGridtepv_d, myLayoutplav2e.cells("a"), false);
                                                dhxGridtepv.clearAll();
                                                loadGridData(BASE_URL + 'get/datapv0101/grilla_pedidos_atender/' + 0 + '/' + co_pto_venta, true, dhxGridtepv, myLayoutplav.cells("a"), false);
                                            }
                                        });
                                        dhxWinsfadd_p.window('w_formadd_p').close();
                                    } else {
                                        dhtmlx.message({ type: "error", text: "El producto ya esta ingresado,  <img src=\"http://webpedidos.corporacionlife.com.pe/web/dhtmlx/codebase/imgs/shopping_cancel_48.png\" > (RETIRE) primero antes de agregarlo...", expire: 6000 });
                                    }
                                }
                            });
                        } else {
                            dhtmlx.message({ type: "error", text: "La cantidad ingresada no debe ser mayor que el stock...", expire: 3000 });
                        }
                    }
                    break;
            }
        });
    }
    function consulta_producto(serie_listado, co_pto_venta, listado_precios, st_igv, catalogo, fe_nac, clien, blogger) {
        $.ajax({
            type: "POST", url: BASE_URL + "get/datapv0101/consulta_producto/" + serie_listado + '/' + co_pto_venta + '/' + listado_precios + '/' + st_igv + '/' + catalogo + '/' + fe_nac + '/' + clien + '/' + blogger,
            beforeSend: function () {
                layout_reg_cli.cells("a").progressOn();
            }, success: function (response) {
                var json = eval(response);
                for (var i in json) {
                    nom_pro = json[i].NOMBRE, cod_cata = json[i].CO_CATALOGO_PROD, ST_DETRA_D = json[i].ST_DETRACCION;
                    medida_uni = json[i].UNID, stock = json[i].CANT, clase = json[i].CLASE, precio = json[i].PRECIO;
                    var BARRA = json[i].BARRA;
                    let nu_dscto = json[i].DESC;
                    nom_desc = json[i].NOM_DES, tip_desc = json[i].TIPO_DES, DESC_LT = json[i].DESC1, st_icbper = json[i].ICBPER;
                    myform_addrow.setItemValue('frow_cata', BARRA), myform_addrow.setItemValue('f_row_nombre', nom_pro), myform_addrow.setItemValue('frow_stock', stock);
                    tip_desc == '0' ? nu_dscto = DESC_LT : '';
                    myform_addrow.setItemValue('frow_precio', Math.round10(precio, -1));
                    myform_addrow.setItemValue('frow_cant_desc', nu_dscto), myform_addrow.setItemLabel('frow_nom_desc', nom_desc);
                    var val = precio * (1 - (nu_dscto / 100));
                    valor_desctofinal = Math.round10(parseFloat(val).toFixed(2), -1);
                    myform_addrow.setItemValue('frow_pre_desc', Math.round10(parseFloat(val).toFixed(2), -1));
                    myform_addrow.validate();
                }
                layout_reg_cli.cells("a").progressOff();
                if (cod_cata == '0') {
                    myform_addrow.setItemValue('frow_cata', ''), myform_addrow.setItemFocus('frow_cata'), dhxWinsfadd.window('w_formadd').close();
                    dhtmlx.message({ type: "error", text: "No se encontró nigun producto, vaya al boton para agregar manual", expire: 3000 });
                } else {
                    myform_addrow.setItemFocus('frow_cant');
                }
            }
        });
    }
    function form_add_row(c_bar) {
        if (c_bar != '0') {
            myform_addrow.setItemValue('frow_cata', c_bar);
            consulta_producto(serie_listado, co_pto_venta, listado_precios, st_igv, myform_addrow.getItemValue('frow_cata'), fecha_fn, cod_cliente, myForm_c.getItemValue('por_blogger'));
            myform_addrow.attachEvent("onEnter", function (name) {
                click_agrega_prod(parseInt(myform_addrow.getItemValue('frow_cant')), myform_addrow.getItemValue('frow_cant') * parseFloat(valor_desctofinal), parseInt(myform_addrow.getItemValue('frow_cant_desc')), stock, precio, cod_cata, nom_pro, medida_uni);
            });
        } else {
            if (co_pto_venta != '6') {
                myform_addrow.attachEvent("onEnter", function (name) {//console.log( myform_addrow.getItemValue('frow_cata').length);
                    if (myform_addrow.getItemValue('frow_cant') == '0' && myform_addrow.getItemValue('frow_cata').length > 0) {
                        consulta_producto(serie_listado, co_pto_venta, listado_precios, st_igv, myform_addrow.getItemValue('frow_cata'), fecha_fn, cod_cliente, myForm_c.getItemValue('por_blogger'));
                    } else {
                        click_agrega_prod(parseInt(myform_addrow.getItemValue('frow_cant')), myform_addrow.getItemValue('frow_cant') * parseFloat(valor_desctofinal), parseInt(myform_addrow.getItemValue('frow_cant_desc')), stock, precio, cod_cata, nom_pro, medida_uni);
                    }
                });
            }
        }

        myform_addrow.attachEvent("onKeyUp", function (inp, ev, name, value) {
            switch (name) {
                case 'frow_cata':
                    break;
                case 'frow_cant':      //console.log('cantidad  ' + ev.keyCode);
                    switch (ev.keyCode) {
                        case 107:
                            var val = myform_addrow.getItemValue('frow_cant').replace("+", "");
                            if (parseFloat(val) >= 0) {
                                myform_addrow.setItemValue('frow_cant', parseFloat(val) + 1);
                            } else {
                                myform_addrow.setItemValue('frow_cant', 0);
                            }
                            break;
                        case 109:
                            var val = myform_addrow.getItemValue('frow_cant').replace("-", "");
                            if (parseFloat(val) >= 1) {
                                myform_addrow.setItemValue('frow_cant', parseFloat(val) - 1);
                            } else {
                                myform_addrow.setItemValue('frow_cant', 0);
                            }
                            break;
                    }
                    break;
            }
        });
        myform_addrow.attachEvent("onButtonClick", function (name) {
            switch (name) {
                case 'frows_lista':
                    dhxWinsfadd2.window('w_formadd2').show();
                    break;
                case 'frows_badd':
                    click_agrega_prod(parseInt(myform_addrow.getItemValue('frow_cant')), myform_addrow.getItemValue('frow_cant') * parseFloat(valor_desctofinal), parseInt(myform_addrow.getItemValue('frow_cant_desc')), stock, precio, cod_cata, nom_pro, medida_uni);
                    break;
            }
        });
    }
    function click_agrega_prod(cant, val2, desc1, stock, precio, cod_cata, nom_pro, medida_uni) { //console.log(cant);
        var valor_totr = Math.round10(val2, -1);
        if (parseFloat(cant) == 0) {
            dhtmlx.message({ type: "error", text: "La cantidad ingresada no debe ser mayor a CERO", expire: 3000 });
        } else {
            if (clase == '6') {
                console.log('clase6');
            } else {
                if (cant <= stock) {
                    var valor_final = parseFloat(precio) - parseFloat((desc1 / 100) * precio);
                    var desc_x_p = (parseFloat(cant) * (parseFloat(precio) - parseFloat(valor_final))).toFixed(2);
                    var mon_pagar = (cant * valor_final).toFixed(2);
                    if (tip_desc == '0') {
                        var TIP_VTA = 'L';
                    } else {
                        var TIP_VTA = tip_desc;
                    }
                    if (mygridVN.getRowsNum() !== 0) {
                        if (parseFloat(desc1) > 0) {
                            mygridVN.addRow((new Date()).valueOf(), [cod_cata, nom_pro, medida_uni, cant, valor_totr, (cant * valor_final / 1.18).toFixed(2), valor_final.toFixed(2), BASE_URL + '/dhtmlx/codebase/imgs/porcent16.png', TIP_VTA, 'D', desc_x_p, desc1, BASE_URL + '/dhtmlx/codebase/imgs/clear_all_48.png', st_icbper, ST_DETRA_D], 1);
                        } else {
                            mygridVN.addRow((new Date()).valueOf(), [cod_cata, nom_pro, medida_uni, cant, valor_totr, (cant * valor_final / 1.18).toFixed(2), valor_final.toFixed(2), BASE_URL + '/dhtmlx/codebase/imgs/green.gif', TIP_VTA, 'N', desc_x_p, '0', BASE_URL + '/dhtmlx/codebase/imgs/clear_all_48.png', st_icbper, ST_DETRA_D], 1);
                        }
                    } else {
                        if (parseFloat(desc1) > 0) {
                            mygridVN.addRow(1, [cod_cata, nom_pro, medida_uni, cant, valor_totr, (cant * valor_final / 1.180).toFixed(2), valor_final.toFixed(2), BASE_URL + '/dhtmlx/codebase/imgs/porcent16.png', TIP_VTA, 'D', desc_x_p, desc1, BASE_URL + '/dhtmlx/codebase/imgs/clear_all_48.png', st_icbper, ST_DETRA_D], 1);
                        } else {
                            mygridVN.addRow(1, [cod_cata, nom_pro, medida_uni, cant, valor_totr, (cant * valor_final / 1.180).toFixed(2), valor_final.toFixed(2), BASE_URL + '/dhtmlx/codebase/imgs/green.gif', TIP_VTA, 'N', desc_x_p, '0', BASE_URL + '/dhtmlx/codebase/imgs/clear_all_48.png', st_icbper, ST_DETRA_D], 1);
                        }
                    }
                    myForm_d.hideItem('nu_ncredito');
                    if (co_pto_venta != 4)
                        dhxWinsfadd.window('w_formadd').close();
                    myForm_a.setItemValue('cod_barrasacn', '');
                    myForm_a.setItemFocus('cod_barrasacn');
                    calculateFooterValues();
                } else {
                    dhtmlx.message({ type: "error", text: "La cantidad ingresada no debe ser mayor que el stock...", expire: 3000 });
                }
            }
        }
    }
    function carga_grilla_productos(serie_listado, ptoventa, listado_pre, st_igv) {
        dhxWinsfadd2 = new dhtmlXWindows();
        dhxWinaddrows3 = dhxWinsfadd2.createWindow("w_formadd2", 85, 20, 1050, 550);
        dhxWinsfadd2.window('w_formadd2').button('close').hide();
        dhxWinsfadd2.window('w_formadd2').addUserButton("dock", 5, "Dock Window", "dock");
        dhxWinsfadd2.window('w_formadd2').button('dock').attachEvent("onClick", function (win, button) {
            dhxWinsfadd2.window('w_formadd2').hide();
        });
        dhxWinaddrows3.setText("Lista de Productos");
        dhxWinsfadd2.window('w_formadd2').hide();
        dhxGridlista = dhxWinsfadd2.window("w_formadd2").attachGrid();
        dhxGridlista.setImagePath(BASE_URL + 'dhtmlx/codebase/imgs/');
        dhxGridlista.setHeader("CATALOGO,COD. BARRA,NOMBRE,UNID,CANT,PRECIO,VALOR_CONV_PTOS,CLASE,DESC1");
        dhxGridlista.attachHeader("#text_filter,#text_filter,#text_filter,#number_filter,#number_filter,#number_filter,#number_filter,#number_filter,#number_filter");
        dhxGridlista.setColTypes("ro,ro,ro,ro,ro,ron,ron,ron,ron");
        dhxGridlista.setInitWidthsP("15,15,40,0,10,10,0,0,10"); //2
        dhxGridlista.setColumnHidden(3, true), dhxGridlista.setColumnHidden(6, true), dhxGridlista.setColumnHidden(7, true);
        dhxGridlista.setColAlign("left,left,left,left,center,center,center,center,center");
        dhxGridlista.setColSorting("str,str,str,str,str,int,int,int,int");
        dhxGridlista.init();
        loadGridData(BASE_URL + 'get/datapv0101/lista_producto_todo/' + serie_listado + '/' + listado_pre + '/' + co_pto_vent, true, dhxGridlista, dhxWinaddrows3, false);
        dhxGridlista.attachEvent("onRowDblClicked", function () {
            tabbar.tabs("a16").isActive() === Boolean(true) ? myform_addrow_p.setItemValue('frow_cant', '1') : myform_addrow.setItemValue('frow_cant', '1');
            cod_cata = dhxGridlista.getSelectedRowId();
            cod_barra = dhxGridlista.cells(cod_cata, 1).getValue();
            cod_barra == '1' ? cod_barra = cod_cata : null;
            clase = dhxGridlista.cells(cod_cata, 7).getValue();
            stock = clase == '6' ? '100' : parseInt(dhxGridlista.cells(cod_cata, 4).getValue());
            consulta_producto(serie_listado, ptoventa, listado_pre, st_igv, cod_barra, fecha_fn, cod_cliente, myForm_c.getItemValue('por_blogger'));
            dhxWinsfadd2.window('w_formadd2').hide();
            calculateFooterValues();
        });
        carga_select_grilla(dhxGridlista);
    }
    function carga_lista_ver_precios(serie_listado, ptoventa, listado_pre, st_igv) {
        var myToolbar_upd = myLayout.cells("b").attachToolbar();
        myToolbar_upd.setIconsPath("<?php echo base_url() . 'dhtmlx/codebase/skins/imgs/icons/' ?>");
        myToolbar_upd.addButton('b_actualizar', null, 'ACTUALIZAR LISTA DE PRECIOS', 'refresh_16.png');
        myToolbar_upd.addSeparator();
        myToolbar_upd.attachEvent("onClick", function (id) {
            switch (id) {
                case 'b_actualizar':
                    mygridVN.clearAll();
                    v_subtotal.innerHTML = '0.00', v_igv.innerHTML = '0.00', v_total.innerHTML = '0.00';
                    dhxGridlista_v.clearAll(), dhxGridlista.clearAll();
                    loadGridData(BASE_URL + 'get/datapv0101/lista_producto_todo/' + serie_listado + '/' + listado_pre + '/' + co_pto_vent, true, dhxGridlista_v, myLayout.cells("b"), false);
                    loadGridData(BASE_URL + 'get/datapv0101/lista_producto_todo/' + serie_listado + '/' + listado_pre + '/' + co_pto_vent, true, dhxGridlista, dhxWinaddrows3, false);
                    break;
            }
        });
        dhxGridlista_v = myLayout.cells("b").attachGrid();
        dhxGridlista_v.setImagePath(BASE_URL + 'dhtmlx/codebase/imgs/');
        dhxGridlista_v.setHeader("COD. PRODUCTO,CBARRA,NOMBRE PRODUCTO,UNID,STOCK,PRECIO,PTO_BONUS,CLASE");
        dhxGridlista_v.attachHeader("#text_filter,#text_filter,&nbsp,#number_filter,#number_filter");
        dhxGridlista_v.setColTypes("ro,ro,ro,ro,ro,ro,ro,ro");
        dhxGridlista_v.setInitWidthsP("10,15,60,10,10,10,10,10"); //2
        dhxGridlista_v.setColAlign("left,left,left,left,left,left,left,left");
        dhxGridlista_v.setColSorting("str,str,str,str,str,str,str,str");
        dhxGridlista_v.setColumnHidden(0, true), dhxGridlista_v.setColumnHidden(3, true), dhxGridlista_v.setColumnHidden(6, true), dhxGridlista_v.setColumnHidden(7, true);
        dhxGridlista_v.init();
        loadGridData(BASE_URL + 'get/datapv0101/lista_producto_todo/' + serie_listado + '/' + listado_pre + '/' + co_pto_vent, true, dhxGridlista_v, myLayout.cells("b"), false);
    }
    function carga_num_pedido() {
        $.ajax({
            type: "POST", url: BASE_URL + "get/datapv0101/carga_num_pedido/OTK1",
            beforeSend: function () {
                if (RESPONSABLE == 'S') {
                    if (myForm_b) {
                        myForm_c.setItemValue('import_doc_ami', '0.00'), myForm_d.setItemValue('total_doc_emi', '0.00'), myForm_c.setItemValue('igv_doc_ami', '0.00');
                    }
                    myLayout.cells("b").progressOn();
                }
            }, success: function (response) {
                num_pedido = response;
                if (cod_pedido_promo == '0')
                    myForm_a.setItemValue('num_pedido', num_pedido);
                else
                    if (cod_pedido_promo < num_pedido)
                        myForm_a.setItemValue('num_pedido', cod_pedido_promo);
                    else
                        myForm_a.setItemValue('num_pedido', num_pedido);
                myLayout.cells("b").progressOff();
            }
        });
    }
    function carga_planilla() {
        $.ajax({
            type: "POST", url: BASE_URL + "get/datapv0101/carga_planilla/Vigente", beforeSend: function () {
                myLayout.cells("b").progressOn();
            }, success: function (response) {
                if (response !== '0') {
                    myForm_b.disableItem('abrir_pla');
                    myForm_b.enableItem('cerrar_pla');
                    var json = eval(response);
                    for (var i in json) {
                        var PLANILLA = json[i].CO_PLANILLA_COBRANZA;
                        co_planilla_cobranza = PLANILLA;
                        myForm_b.setItemValue('nro_pla', PLANILLA);
                        form_b_pla.setItemValue('busca_planilla', PLANILLA);
                        var FE_CREACION_PLANILLA = json[i].FE_CREACION_PLANILLA;
                        myForm_b.setItemValue('fec_pla', FE_CREACION_PLANILLA);
                        var IM_TOTAL = json[i].IM_TOTAL;
                        myForm_b.setItemValue('impor_pla', IM_TOTAL);
                        var CAJA = json[i].CAJA;
                        var DE_NOMBRE = json[i].DE_NOMBRE;
                        IM_TARJET = json[i].IM_TARJET;
                        myForm_b.setItemValue('tar_pla', IM_TARJET);
                        IM_DEPOSITO_TOTAL = json[i].IM_DEPOSITO_TOTAL;
                        es_vigencia_planilla = json[i].ES_VIGENCIA;
                    }
                    form_b_pla.setItemValue('plan_liqui', co_planilla_cobranza);
                    myLayout.cells("b").progressOff();
                } else {
                    myForm_b.disableItem('cerrar_pla'), myForm_b.enableItem('abrir_pla'), myLayout.cells("b").progressOff();
                }
            }
        });
    }
    function guardar_con_credito_caetec() {
    }
    function f_desactiva_formu() {
        myform_regcli.disableItem('block1');
        myform_regcli.disableItem('block2');
        myform_regcli.disableItem('block3');
        myform_regcli.disableItem('block4');
        myform_regcli.disableItem('block5');
        myform_regcli.disableItem('block6');
    }
    function f_activar_fomu_cli() {
        myform_regcli.enableItem('block1');
        myform_regcli.enableItem('block2');
        myform_regcli.enableItem('block3');
        myform_regcli.enableItem('block4');
        myform_regcli.enableItem('block5');
        myform_regcli.enableItem('block6');
    }
    function f_ctiva_nombres() {
        myform_regcli.showItem('rg_rsocialp');
        myform_regcli.showItem('rg_rsocialm');
        myform_regcli.showItem('rg_rsocialnm');
        myform_regcli.enableItem('rg_rsocialp');
        myform_regcli.enableItem('rg_rsocialm');
        myform_regcli.enableItem('rg_rsocialnm');
        myform_regcli.disableItem('rg_rsocial_empresa');
        myform_regcli.hideItem('rg_rsocial_empresa');
    }
    function f_activa_rason() {
        myform_regcli.hideItem('rg_rsocialp');
        myform_regcli.hideItem('rg_rsocialm');
        myform_regcli.hideItem('rg_rsocialnm');
        myform_regcli.disableItem('rg_rsocialp');
        myform_regcli.disableItem('rg_rsocialm');
        myform_regcli.disableItem('rg_rsocialnm');
        myform_regcli.showItem('rg_rsocial_empresa');
        myform_regcli.enableItem('rg_rsocial_empresa');
    }
    function regitra_cliente() {
        dhxWinsREGCLI = new dhtmlXWindows();
        dhxWinstipent = dhxWinsREGCLI.createWindow("wco_regcli", 75, 5, 700, 550);
        dhxWinstipent.setText("Registro Cliente");
        myform_regcli = dhxWinsREGCLI.window("wco_regcli").attachForm(form_reg_cli);
        myform_regcli.attachEvent("onInputChange", function (name, value, form) {

            let opts32 = myform_regcli.getOptions("rg_distrito"), text32 = (opts32[opts32.selectedIndex].text);
            switch (name) {
                case 'rg_co_av':
                    let opts3 = myform_regcli.getOptions("rg_co_av"), text3 = (opts3[opts3.selectedIndex].text);
                    total_dir = text3 + ' ' + myform_regcli.getItemValue('rg_nom_av') + ' ' + myform_regcli.getItemValue('rg_num_av');
                    break;
                case 'rg_nom_av':
                    let opts = myform_regcli.getOptions("rg_co_av"), text = (opts[opts.selectedIndex].text);
                    total_dir = text + ' ' + value + ' ' + myform_regcli.getItemValue('rg_num_av');
                    break;
                case 'rg_num_av':
                    let opts1 = myform_regcli.getOptions("rg_co_av"), text1 = (opts1[opts1.selectedIndex].text);
                    total_dir = text1 + ' ' + myform_regcli.getItemValue('rg_nom_av') + ' ' + value;
                    break;
                case 'rg_de_zn':
                    let opts2 = myform_regcli.getOptions("rg_co_zn"), text2 = (opts2[opts2.selectedIndex].text);
                    total_zona = text2 + ' ' + value;
                    break;
                case 'rg_ref':
                    total_ref = ' Ref :' + ' ' + value;
                    break;
            }
            myform_regcli.setItemValue('rg_dirfinal', total_dir + ' ' + total_zona + ' ' + total_ref + ' ' + text32);
        });
        myform_regcli.attachEvent("onChange", function (name, value) { //                        console.log(name + '-' + value);
            switch (name) {
                case 'tipo_per':
                    if (value === 'chek_perso') {
                        myform_regcli.hideItem('rg_tipo_persona');
                        f_activar_fomu_cli();
                        indica_tipo = '1';
                        f_ctiva_nombres();
                    } else {
                        indica_tipo = '2';
                        myform_regcli.showItem('rg_tipo_persona');
                        f_desactiva_formu();
                    }
                    break;
                case 'rg_tipo_persona':
                    f_activar_fomu_cli();
                    switch (value) {
                        case '1':
                            f_ctiva_nombres();
                            break;
                        case '2':
                            f_activa_rason();
                            break;
                        default:
                            f_desactiva_formu();
                            break;
                    }
                    break;
            }
        });
        myform_regcli.attachEvent("onButtonClick", function (name, value) {
            switch (name) {
                case 'b_lista_contacto':
                    dhxWins_OTRO = new dhtmlXWindows();
                    dhxWin_OTR = dhxWins_OTRO.createWindow("w_otroscel", 750, 175, 200, 200);
                    dhxWin_OTR.setText("Otros contactos");
                    dhxWins_OTRO.window("w_otroscel").hideHeader();
                    layout_reg_cli = new dhtmlXLayoutObject(dhxWins_OTRO.window("w_otroscel"), '1C');
                    layout_reg_cli.cells("a").hideHeader();
                    layout_reg_cli.cells("a").attachHTMLString('<p>' + OTROCONTA + '</p>');
                    break;
                case 'rg_button':
                    if (myform_regcli.validate() === Boolean(true)) {
                        var whasap = myform_regcli.getItemValue('rg_tef');
                        var se_lstado = myform_regcli.getItemValue('rg_estado');
                        var dni_buscado = myform_regcli.getItemValue('rg_nro_docu');
                        if (dni_buscado.length > 0) {
                            if (doc_iden == dni_buscado) {
                                if (se_lstado !== '0') {
                                    if (isNumber(whasap)) {
                                        registrar_consumidor_final('0'); //0 = consumidor_final
                                    } else {
                                        dhtmlx.message({ type: "error", text: "Ingrese un Numero de Whatsaap correcto.. SÓLO NUMEROS..", expire: 4000 });
                                    }
                                } else {
                                    dhtmlx.message({ type: "error", text: "Seleccione un estado Vigente o Retirado...", expire: 4000 });
                                }
                            } else {
                                dhtmlx.message({ type: "error", text: "No Dni/Ruc buscado, no puede ser cambiado...", expire: 3000 });
                            }
                        } else {
                            dhtmlx.message({ type: "error", text: "Ingrese un DNI o RUC...", expire: 4000 });
                        }
                    } else {
                        dhtmlx.message({ type: "error", text: "Falta algun dato, (*) datos obligatorios", expire: 5000 });
                    }
                    break;
                case 'b_actu_data':                                //layout_reg_clie.cells("a").progressOn();
                    dhxWinsREGCLI.window("wco_regcli").progressOn();
                    var st = 0;
                    doc_iden = myform_regcli.getItemValue('rg_nro_docu');
                    num_carac_dni = myform_regcli.getItemValue('rg_nro_docu').length;
                    var check_selec = myform_regcli.getItemValue('tipo_per');
                    if (check_selec == 'chek_perso') {
                        if (num_carac_dni == '8') {
                            st = 1;
                        } else {
                            st = 0, dhtmlx.message({ type: "error", text: "Seleccionó DNI, debe ingresar un DNI correcto <b>(8 digitos)</b>", expire: 5000 });
                            dhxWinsREGCLI.window("wco_regcli").progressOff();
                        }
                    } else {//check_selec == 'chek_empre'
                        if (num_carac_dni == '11') {
                            st = 1;
                        } else {
                            st = 0, dhtmlx.message({ type: "error", text: "Seleccionó RUC , debe ingresar un RUC (11 digitos)", expire: 5000 });
                            dhxWinsREGCLI.window("wco_regcli").progressOff();
                        }
                    }
                    if (st === 1) {
                        $.ajax({
                            type: "POST", url: BASE_URL + "get/datapv0101/carga_datos_cliente/" + doc_iden,
                            beforeSend: function () {
                                myform_regcli.setItemValue('tipo_usu', '9'), myform_regcli.setItemValue('rg_de_sunat', '-'), myform_regcli.setItemValue('rg_ref', '-'), myform_regcli.setItemValue('rg_dirfinal', '-'), myform_regcli.setItemValue('rg_rsocial_empresa', '-'), myform_regcli.setItemValue('rg_rsocialp', '-'), myform_regcli.setItemValue('rg_rsocialm', '-'), myform_regcli.setItemValue('rg_rsocialnm', '-'), myform_regcli.setItemValue('fec_nac', '01-01-1900'), myform_regcli.enableItem('rg_rsocialp'), myform_regcli.enableItem('rg_rsocialm'), myform_regcli.enableItem('rg_rsocialnm'), myform_regcli.setItemValue('rg_mail', '-'), myform_regcli.setItemValue('rg_tef', '0'), myform_regcli.setItemValue('rg_distrito', '177150101'), myform_regcli.setItemValue('rg_num_av', '0'), myform_regcli.setItemValue('rg_nom_av', '-'), myform_regcli.setItemValue('rg_de_zn', '-'), myform_regcli.setItemValue('rg_de_zn', '-');
                            }, success: function (response) {
                                dhxWinsREGCLI.window("wco_regcli").progressOff();
                                var json = eval(response);
                                var NOMBREST = '', NOMBRESR = '', CO_TIP_PER = 0;
                                for (var i in json) {
                                    INDIC = json[i].INDIC, CO_TIP_PER = json[i].CO_TIP_PER, OTROCONTA = json[i].OTROCONTA, YDIR_SUNAT = json[i].DE_DIRSUNAT, CO_DIRECC = json[i].CO_DIRECC;
                                    var APE_PAT = json[i].APE_PAT, CO_TIPONEGO = json[i].CO_TIPONEGO, APE_MAT = json[i].APE_MAT, NOMBRES = json[i].NOMBRES, DE_PROCEDEN = json[i].DE_PROCEDEN, DE_NOM_COMER = json[i].DE_NOM_COMER, DE_RAZSOC = json[i].DE_RAZSOC, DE_ORIGEN = json[i].DE_ORIGEN, CO_TIPO_DOC_IDE = json[i].CO_TIPO_DOC_IDE, FE_NAC = json[i].FE_NAC, CO_CATALOGO = json[i].CO_CATALOGO, CO_ZONA = json[i].CO_ZONA, CO_VIA = json[i].CO_VIA, CO_UBIGEO = json[i].CO_UBIGEO, NOM_VIA = json[i].NOM_VIA, NOM_ZONA = json[i].NOM_ZONA, DE_INTERIOR = json[i].DE_INTERIOR, DE_REFERE = json[i].DE_REFERE, DE_MAIL = json[i].DE_MAIL, TELF = json[i].TELF, VIGENCIA = json[i].VIGENCIA;
                                }
                                console.log(INDIC);
                                switch (INDIC) {
                                    case '10':
                                        INDIC = '10';
                                        var tipo_person = 0;
                                        if (doc_iden.length == 8) {
                                            tipo_person = '1';
                                        } else {
                                            tipo_person = myform_regcli.getItemValue('rg_tipo_persona');
                                        }
                                        /*CONSULTA REST API*/
                                        dhtmlx.confirm("CLIENTE NUEVO, Se conectar\u00e1 a la SUNAT para verificar los datos...", function (result) {
                                            if (result === Boolean(true)) {
                                                var formData = new FormData();
                                                formData.append("token", "9c4d07ce-1bce-49d0-bc7d-f022532ec46c-f77ca176-cb0f-43e3-ad8a-7a157b777338");
                                                num_carac_dni == 8 ? formData.append("dni", doc_iden) : formData.append("ruc", doc_iden);
                                                var request = new XMLHttpRequest();
                                                request.open("POST", "https://api.migoperu.pe/api/v1/dni");
                                                request.setRequestHeader("Accept", "application/json");
                                                request.send(formData);
                                                request.onload = function () {
                                                    var data = JSON.parse(this.response);
                                                    if (data.success === Boolean(false)) {
                                                        dhtmlx.message({ title: "Plan :100 consultas gratis MIGO.PE", type: "alert-warning", text: data.message + ' Ingrese manualmente los datos.' });
                                                    }
                                                    console.log(data);
                                                    console.log(data.dni);
                                                    console.log(data.nombre);
                                                };
                                                dhxWinsREGCLI.window("wco_regcli").progressOff();
                                            }
                                        });
                                        if (dhxWins_OTRO)
                                            dhxWins_OTRO.window("w_otroscel").close();
                                        break;
                                    case '1120': //myform_regcli.disableItem('block0');  // myform_regcli.disableItem('rg_nro_docu');
                                        NOMBREST = APE_PAT + ' ' + APE_MAT + ' ' + NOMBRES;
                                        NOMBRESR = DE_RAZSOC + ' - ' + DE_NOM_COMER, myform_regcli.setItemValue('rg_de_sunat', YDIR_SUNAT), myform_regcli.setItemValue('tipo_usu', CO_TIPONEGO == 0 ? '9' : CO_TIPONEGO), myform_regcli.disableItem('rg_rsocialp'), myform_regcli.disableItem('rg_rsocialm'), myform_regcli.disableItem('rg_rsocialnm'), myform_regcli.disableItem('rg_rsocial_empresa'), myform_regcli.setItemValue('rg_distrito', CO_UBIGEO), myform_regcli.setItemValue('rg_co_av', CO_VIA), myform_regcli.setItemValue('rg_nom_av', NOM_VIA), myform_regcli.setItemValue('rg_co_zn', CO_ZONA), myform_regcli.setItemValue('rg_de_zn', NOM_ZONA), myform_regcli.setItemValue('fec_nac', FE_NAC), myform_regcli.setItemValue('rg_mail', DE_MAIL), myform_regcli.setItemValue('rg_tef', TELF), myform_regcli.setItemValue('rg_estado', VIGENCIA);
                                        if (CO_TIP_PER == '01') {
                                            indica_tipo = '2';
                                            myform_regcli.checkItem('tipo_per', 'chek_perso'), myform_regcli.setItemValue('rg_rsocialp', APE_PAT), myform_regcli.setItemValue('rg_ref', DE_REFERE), myform_regcli.setItemValue('rg_rsocialm', APE_MAT), myform_regcli.setItemValue('rg_rsocialnm', NOMBRES), myform_regcli.setItemValue('rg_rsocial_empresa', NOMBRESR), myform_regcli.showItem('rg_rsocialp'), myform_regcli.showItem('rg_rsocialm'), myform_regcli.showItem('rg_rsocialnm'), myform_regcli.hideItem('rg_rsocial_empresa'), myform_regcli.setItemValue('rg_estado', VIGENCIA);
                                        } else {
                                            indica_tipo = '1';
                                            myform_regcli.checkItem('tipo_per', 'chek_empre'), myform_regcli.setItemValue('rg_rsocialp', '-'), myform_regcli.setItemValue('rg_rsocialm', '-'), myform_regcli.setItemValue('rg_rsocialnm', '-'), myform_regcli.setItemValue('rg_rsocial_empresa', NOMBRESR), myform_regcli.showItem('rg_rsocial_empresa'), myform_regcli.hideItem('rg_rsocialp'), myform_regcli.hideItem('rg_rsocialm'), myform_regcli.hideItem('rg_rsocialnm'), myform_regcli.setItemValue('rg_estado', VIGENCIA);
                                        }
                                        dhtmlx.message({ title: "Informativo", type: "alert-warning", text: "Ya est\u00e1 registrado, sin embargo NO est\u00e1 asignado como CLIENTE. Pulse REGISTRAR para asignarlo como cliente..." });
                                        if (dhxWins_OTRO)
                                            dhxWins_OTRO.window("w_otroscel").close();
                                        carga_direccion();
                                        break;
                                    case '1121'://myform_regcli.disableItem('rg_nro_docu');  //myform_regcli.disableItem('block0');
                                        NOMBREST = APE_PAT + ' ' + APE_MAT + ' ' + NOMBRES;
                                        NOMBRESR = DE_RAZSOC + ' - ' + DE_NOM_COMER;
                                        myform_regcli.setItemValue('rg_de_sunat', YDIR_SUNAT), myform_regcli.disableItem('rg_rsocialp'), myform_regcli.setItemValue('tipo_usu', CO_TIPONEGO == 0 ? '9' : CO_TIPONEGO), myform_regcli.disableItem('rg_rsocialm'), myform_regcli.setItemValue('rg_ref', DE_REFERE), myform_regcli.disableItem('rg_rsocialnm'), myform_regcli.disableItem('rg_rsocial_empresa'), myform_regcli.setItemValue('rg_distrito', CO_UBIGEO), myform_regcli.setItemValue('rg_co_av', CO_VIA), myform_regcli.setItemValue('rg_nom_av', NOM_VIA), myform_regcli.setItemValue('rg_co_zn', CO_ZONA), myform_regcli.setItemValue('rg_de_zn', NOM_ZONA), myform_regcli.setItemValue('fec_nac', FE_NAC), myform_regcli.setItemValue('rg_mail', DE_MAIL), myform_regcli.setItemValue('rg_tef', TELF), myform_regcli.setItemValue('rg_estado', VIGENCIA), myform_regcli.setItemValue('rg_num_av', DE_INTERIOR);
                                        if (CO_TIP_PER == '01') {
                                            indica_tipo = '2';  //myform_regcli.checkItem('tipo_per', 'chek_perso');
                                            myform_regcli.setItemValue('rg_rsocialp', APE_PAT), myform_regcli.setItemValue('rg_rsocialm', APE_MAT), myform_regcli.setItemValue('rg_rsocialnm', NOMBRES), myform_regcli.setItemValue('rg_rsocial_empresa', NOMBRESR), myform_regcli.showItem('rg_rsocialp'), myform_regcli.showItem('rg_rsocialm'), myform_regcli.showItem('rg_rsocialnm'), myform_regcli.hideItem('rg_rsocial_empresa'), myform_regcli.setItemValue('rg_estado', VIGENCIA);
                                        } else {
                                            indica_tipo = '1';   // myform_regcli.checkItem('tipo_per', 'chek_empre');
                                            myform_regcli.setItemValue('rg_rsocialp', APE_PAT), myform_regcli.setItemValue('rg_rsocialm', APE_MAT), myform_regcli.setItemValue('rg_rsocialnm', NOMBRES), myform_regcli.setItemValue('rg_rsocial_empresa', NOMBRESR), myform_regcli.showItem('rg_rsocial_empresa'), myform_regcli.hideItem('rg_rsocialp'), myform_regcli.hideItem('rg_rsocialm'), myform_regcli.hideItem('rg_rsocialnm'), myform_regcli.setItemValue('rg_estado', VIGENCIA);
                                        }
                                        dhtmlx.message({ title: "Informativo", type: "alert-warning", text: "Ya est\u00e1 registrado como CLIENTE, puede modificar su FECHA DE NACIMIENTO y ESTADO , luego pulse bot\u00f3n REGISTRAR..." });
                                        /*if (dhxWinsREGCLI)
                                         dhxWinsREGCLI.window("wco_regcli").progressOff();*/
                                        if (dhxWins_OTRO)
                                            dhxWins_OTRO.window("w_otroscel").close();
                                        carga_direccion();
                                        break;
                                }
                            }
                        });

                    }
                    break;
            }
        });
    }
    function carga_direccion() {
        let opts32 = myform_regcli.getOptions("rg_distrito"), text32 = (opts32[opts32.selectedIndex].text);
        let opts1g = myform_regcli.getOptions("rg_co_av"), text1g = (opts1g[opts1g.selectedIndex].text);
        let total_dir2 = myform_regcli.getItemValue('rg_num_av') == 0 ? text1g + ' ' + myform_regcli.getItemValue('rg_nom_av') : text1g + ' ' + myform_regcli.getItemValue('rg_nom_av') + ' Int: ' + myform_regcli.getItemValue('rg_num_av');
        let opts2a = myform_regcli.getOptions("rg_co_zn"), text2a = (opts2a[opts2a.selectedIndex].text);
        total_zona = myform_regcli.getItemValue('rg_de_zn') === '-' ? '' : text2a + ' ' + myform_regcli.getItemValue('rg_de_zn');
        total_ref = ' Ref :' + ' ' + myform_regcli.getItemValue('rg_ref');
        myform_regcli.setItemValue('rg_dirfinal', total_dir2 + ' ' + total_zona + ' ' + total_ref + ' ' + text32);
    }
    function registrar_consumidor_final(ind) {
        console.log(INDIC);
        dhxWinsREGCLI.window("wco_regcli").progressOn();
        num_carac_dni = myform_regcli.getItemValue('rg_nro_docu').length;//                   
        if (myform_regcli.validate() === Boolean(true)) {
            if (num_carac_dni == '8' || num_carac_dni == '11') {
                switch (INDIC) {
                    case '10'://CLIENTE NUEVO
                        var rg_rsocialp, rg_rsocialm, rg_rsocialnm, rg_rsocial = '-', rg_nro_docu = myform_regcli.getItemValue('rg_nro_docu'), num_carac_dni = rg_nro_docu.length;
                        rg_rsocialp = myform_regcli.getItemValue('rg_rsocialp'), rg_rsocialm = myform_regcli.getItemValue('rg_rsocialm'), rg_rsocialnm = myform_regcli.getItemValue('rg_rsocialnm');
                        if (num_carac_dni == '8') {
                            rg_rsocial = rg_rsocialp + ' ' + rg_rsocialm + ' ' + rg_rsocialnm, indica_tipo = '01';
                        } else {
                            rg_rsocial = myform_regcli.getItemValue('rg_rsocial_empresa'), indica_tipo = '02';
                        }
                        rg_distrito = myform_regcli.getItemValue('rg_distrito'), rg_co_av = myform_regcli.getItemValue('rg_co_av'), rg_co_zn = myform_regcli.getItemValue('rg_co_zn');
                        var opts = myform_regcli.getOptions("rg_distrito"), de_distrito = (opts[opts.selectedIndex].text), rg_nom_av = ('0').replace(/\//g, "-"), rg_num_av = '0', rg_de_zn = '0', rg_ref = (myform_regcli.getItemValue('rg_ref')).replace(/\//g, "-"), rg_dirsunat = (myform_regcli.getItemValue('rg_de_sunat')).replace(/\//g, "-"), rg_tef = myform_regcli.getItemValue('rg_tef'), rg_mail = myform_regcli.getItemValue('rg_mail'), fec_nac_cli = document.getElementsByName("fec_nac")[0].value, estado = myform_regcli.getItemValue('rg_estado');
                        $.ajax({
                            type: "POST", url: BASE_URL + 'get/datapv0101/reg_cliente_nuevo_pack/' + rg_nro_docu + '/' + rg_rsocial + '/' + rg_distrito + '/' + '0' + '/' + '0' + '/' + '0' + '/' + '0' + '/' + '0' + '/' + rg_ref + '/' + rg_dirsunat + '/' + rg_mail + '/' + num_carac_dni + '/' + ind + '/' + de_distrito + '/' + fec_nac_cli + '/' + INDIC + '/' + indica_tipo + '/' + rg_tef.trim() + '/' + rg_rsocialp + '/' + rg_rsocialm + '/' + rg_rsocialnm + '/' + estado + '/' + myform_regcli.getItemValue('tipo_usu'),
                            beforeSend: function () {
                            }, success: function (response) {
                                if (response == 'hanna') {
                                    ventana_co_cata_padre('ruc_dni', rg_nro_docu);
                                    dhtmlx.message({
                                        title: "Informativo", type: "alert-warning", text: "Personal Hanna registrado correctamente..."
                                    });
                                } else if (response == 'alumno') {
                                    ventana_co_cata_padre('ruc_dni', rg_nro_docu);
                                    dhtmlx.message({
                                        title: "Informativo", type: "alert-warning", text: "Alumno Caetec registrado correctamente..."
                                    });
                                } else if (response == 'consumidor') {
                                    ventana_co_cata_padre('ruc_dni', rg_nro_docu);
                                    dhtmlx.message({
                                        title: "Informativo", type: "alert-warning", text: "Consumidor Final  registrado correctamente...!"
                                    });
                                    if (dhxWins_OTRO)
                                        dhxWins_OTRO.window("w_otroscel").close();
                                } else if (response == 'existe') {
                                    dhtmlx.message({ type: "error", text: "El cliente ya est\u00e1 registrado...", expire: 4000 });
                                } else {   //layout.cells("a").progressfOff();
                                    dhtmlx.message({ type: "error", text: "Error, ingrese nuevamente los datos. :: " + response, expire: 3000 });
                                }
                                // if (dhxWinsREGCLI)
                                dhxWinsREGCLI.window("wco_regcli").progressOff(), dhxWinsREGCLI.window("wco_regcli").close();
                            }
                        });
                        break;
                    case '1120'://NO ESTA COMO CLIENTE , pero si en CATA_ENTI
                        var fec_nac_cli = document.getElementsByName("fec_nac")[0].value, rg_distrito2 = myform_regcli.getItemValue('rg_distrito'), rg_ref2 = (myform_regcli.getItemValue('rg_ref')).replace(/\//g, "-"), rg_dirsunat2 = (myform_regcli.getItemValue('rg_de_sunat')).replace(/\//g, "-"), rg_nro_docu = myform_regcli.getItemValue('rg_nro_docu'), rg_mail = myform_regcli.getItemValue('rg_mail'), telf = myform_regcli.getItemValue('rg_tef'), estado2 = myform_regcli.getItemValue('rg_estado'), tipo_negocio = myform_regcli.getItemValue('tipo_usu');
                        var wsaap = telf.length > 2 ? telf.trim() : '0';
                        $.ajax({
                            type: "POST", url: BASE_URL + 'get/datapv0101/asig_cliente/' + rg_nro_docu + '/' + rg_mail + '/' + fec_nac_cli + '/' + wsaap + '/' + estado2 + '/' + tipo_negocio + '/' + rg_ref2 + '/' + rg_dirsunat2 + '/' + rg_distrito2,
                            beforeSend: function () {
                            }, success: function (response) {
                                response == 1 ? dhtmlx.message({ title: "Informativo", type: "alert-warning", text: "Datos grabados y Asignado correctamente..." }) : dhtmlx.message({ title: "Informativo", type: "error", text: "Error 1120 : " + response })
                                response == 1 ? ventana_co_cata_padre('ruc_dni', rg_nro_docu) : null;
                                dhxWinsREGCLI.window("wco_regcli").progressOff(), dhxWinsREGCLI.window("wco_regcli").close();
                                if (dhxWins_OTRO)
                                    dhxWins_OTRO.window("w_otroscel").close();
                            }
                        });
                        break;
                    case '1121': //SI CLIENTE, SI EN CATA_ENTI
                        var fec_nac_cli = document.getElementsByName("fec_nac")[0].value, rg_distrito3 = myform_regcli.getItemValue('rg_distrito'), rg_ref3 = (myform_regcli.getItemValue('rg_ref')).replace(/\//g, "-"), rg_dirsunat3 = (myform_regcli.getItemValue('rg_de_sunat')).replace(/\//g, "-"), rg_nro_docu = myform_regcli.getItemValue('rg_nro_docu'), rg_mail = myform_regcli.getItemValue('rg_mail'), telf = myform_regcli.getItemValue('rg_tef'), estado3 = myform_regcli.getItemValue('rg_estado'), tipo_negocio = myform_regcli.getItemValue('tipo_usu');
                        var wsaap = telf.length > 2 ? telf : 0;
                        $.ajax({
                            type: "POST", url: BASE_URL + 'get/datapv0101/actu_fecha_nac/' + fec_nac_cli + '/' + rg_nro_docu + '/' + rg_mail + '/' + String(wsaap).trim() + '/' + estado3 + '/' + tipo_negocio + '/' + rg_distrito3 + '/' + rg_ref3 + '/' + rg_dirsunat3 + '/' + CO_DIRECC,
                            beforeSend: function () {
                            }, success: function (response) {
                                response == 1 ? dhtmlx.message({ title: "Informativo", type: "alert-warning", text: "Datos grabados correctamente...." }) : dhtmlx.message({ title: "Informativo", type: "error", text: "Error 1121: " + response })
                                response == 1 ? ventana_co_cata_padre('ruc_dni', rg_nro_docu) : null;
                                dhxWinsREGCLI.window("wco_regcli").progressOff(), dhxWinsREGCLI.window("wco_regcli").close();
                                if (dhxWins_OTRO)
                                    dhxWins_OTRO.window("w_otroscel").close();
                            }
                        });
                        break;
                }
            } else {
                dhtmlx.message({ type: "error", text: "Error.  Mal ingresado en DNI o RUC . Verif\u00edquelo, Por favor", expire: 5000 });
            }
        } else {
            dhtmlx.message({ type: "error", text: "Rellene los datos que esten con (*), o verifique que el DNI solo debe ser solo N\u00famero", expire: 3000 });
        }
    }
    function carga_referVISA() {
        cadena_gridpagos = '';
        if (myForm_d.getItemValue('valor_compro') > 0) {
            myForm_d.showItem('mygrpagos');
            dhxGrid_Pagos = new dhtmlXGridObject(myForm_d.getContainer("mygrpagos"));
            dhxGrid_Pagos.setHeader("TipoPago,Tipopago,CodBco,CodPais,NroVoucher,Cheque,Monto,Cuenta");
            dhxGrid_Pagos.setColTypes("co,ro,ro,ro,ed,ro,ed,ro");
            dhxGrid_Pagos.setInitWidthsP("30,0,0,0,35,0,25,0"); //2
            dhxGrid_Pagos.enableEditEvents(true, false, false);
            var combobox = dhxGrid_Pagos.getCombo(0);
            dhxGrid_Pagos.init();
            dhxGrid_Pagos.setColumnHidden(1, true);
            dhxGrid_Pagos.setColumnHidden(2, true);
            dhxGrid_Pagos.setColumnHidden(3, true);
            dhxGrid_Pagos.setColumnHidden(5, true);
            dhxGrid_Pagos.setColumnHidden(7, true);
            dhxGrid_Pagos.attachEvent("onEditCell", function (stage, rId, cInd, nValue, oValue) {
                if (stage == 2 && cInd == 0) {
                    console.log('edit');
                    var valor_combo = nValue === 'Tarjeta Visa' ? 6 : nValue;
                    $.ajax({
                        type: "POST", url: BASE_URL + 'get/datapv0101/carga_referVISA/' + valor_combo + '/' + co_pto_venta,
                        beforeSend: function () {
                            myLayout_caja.cells("c").progressOn();
                        },
                        success: function (response) {
                            dhxGrid_Pagos.cells(rId, 4).setValue(response), dhxGrid_Pagos.cells(rId, 1).setValue(nValue);  //myForm_d.setItemValue('comproba_pago', response);
                            myLayout_caja.cells("c").progressOff();
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            myForm_d.setItemValue('comproba_pago', '.');
                            myLayout_caja.cells("c").progressOff();
                        }
                    });
                }
                return true;
            });

            $.ajax({
                type: "POST", url: BASE_URL + 'get/datapv0101/carga_referVISA/' + 6 + '/' + co_pto_venta, beforeSend: function () {
                }, success: function (response) {
                    pago_defecto = response;
                    $.ajax({
                        type: "POST", url: BASE_URL + 'get/datapv0101/tipo_pago', beforeSend: function () { },
                        success: function (res) {
                            var json = eval(res);
                            for (var i in json) {
                                combobox.put(json[i].CODTIPO, json[i].NOM_TIPO);
                            }
                        }
                    });
                    dhxGrid_Pagos.clearAll();
                    dhxGrid_Pagos.addRow((new Date()).valueOf(), ['Tarjeta Visa', 6, '01', '177', pago_defecto, 'N', myForm_d.getItemValue('valor_compro'), cta_cte], 0);
                }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                    dhxGrid_Pagos.clearAll();
                    dhxGrid_Pagos.addRow((new Date()).valueOf(), ['Tarjeta Visa', 6, '01', '177', '.', 'N', myForm_d.getItemValue('valor_compro'), cta_cte], 0);
                }
            });
        } else {
            myForm_d.hideItem('mygrpagos');
        }
    }

    function ventana_co_cata_padre(name, num) { //carga lista clientes
        dhxWins = new dhtmlXWindows();
        dhxWinstipent = dhxWins.createWindow("wco_cata", 75, 5, 750, 450);
        dhxWinstipent.setText("B\u00fasqueda de Razon Social / Nombre");
        myToolbar = dhxWins.window("wco_cata").attachToolbar();
        myToolbar.setIconsPath("<?php echo base_url() . 'dhtmlx/codebase/skins/imgs/icons/' ?>");
        myToolbar.addText('text_inputnom', 0, 'Nombre /RS :', 40);
        myToolbar.addInput('nomb_buscar', null, '', 180);
        myToolbar.addSeparator();
        myToolbar.addText('text_input', null, 'RUC / DNI:', 40);
        myToolbar.addInput('det_buscar', null, '', 180);
        myToolbar.addSeparator();
        myToolbar.addButton('b_buscar_cata', null, '', 'lupa_26.png');
        myToolbar.addSeparator();
        myToolbar.addButton('b_cerrar', null, '', 'close_24.png');
        myToolbar.addSeparator();
        if (num != '0') {
            myToolbar.setValue('det_buscar', num);
        }
        myToolbar.attachEvent("onEnter", function (id, value) {
            cod_pedido_promo = '0';
            switch (id) {
                case 'det_buscar':
                    buscar_cliente(name, '2');
                    break;
                case 'nomb_buscar':
                    buscar_cliente(name, '1');
                    break;
            }
        });
        myToolbar.attachEvent("onClick", function (id) {
            cod_pedido_promo = '0';
            switch (id) {
                case 'b_buscar_cata':
                    if (myToolbar.getValue('det_buscar') != '') {
                        buscar_cliente(name, '2');
                    }
                    if (myToolbar.getValue('nomb_buscar') != '') {
                        buscar_cliente(name, '1');
                    }
                    break;
                case 'b_cerrar':
                    dhxWins.window('wco_cata').close();
                    break;
            }
        });
    }
    function buscar_cliente(name, ind) {
        if (myToolbar.getValue('det_buscar').length !== 0 || myToolbar.getValue('nomb_buscar').length !== 0) {
            var layout = new dhtmlXLayoutObject(dhxWins.window("wco_cata"), '1C');
            layout.cells("a").hideHeader();
            dhxGridte = layout.cells("a").attachGrid();
            dhxGridte.setImagePath(BASE_URL + 'dhtmlx/codebase/imgs/');
            dhxGridte.setHeader("CODIGO CLIENTE,NOMBRE / RAZON SOCIAL,UBIGEO,FE_NAC");
            dhxGridte.setColTypes("ron,ro,ro,ro");
            dhxGridte.setInitWidthsP("20,55,10,15"); //2                         dhxGridte.setColAlign("left,left,left");
            dhxGridte.setColSorting("int,str,str,str");
            dhxGridte.init();
            if (ind == '1') {
                loadGridData(BASE_URL + 'get/datapv0101/grilla_cod_cata/' + 1 + '/' + myToolbar.getValue('nomb_buscar'), true, dhxGridte, layout.cells("a"), false);  ///tipo_entidad = 1 => nombre
            } else {
                loadGridData(BASE_URL + 'get/datapv0101/grilla_cod_cata/' + 2 + '/' + myToolbar.getValue('det_buscar'), true, dhxGridte, layout.cells("a"), false);  ///tipo_entidad = 2 => CLIENTE
            }
            dhxGridte.attachEvent("onRowSelect", function () {
                co_cliente = dhxGridte.getSelectedRowId();
                det_cata = dhxGridte.cells(co_cliente, 1).getValue();
                cod_direcc = dhxGridte.cells(co_cliente, 2).getValue();
                fecha_fn = dhxGridte.cells(co_cliente, 3).getValue();
                console.log(fecha_fn);
                myForm_a.setItemValue('direccion_a', '.');
                myForm_a.setItemValue('razonsocial', det_cata.replace(/&amp;/g, "&"));
                dhxWins.window('wco_cata').close();
                myForm_a.setItemValue(name, co_cliente);
                myForm_a.validate();
                if (RESPONSABLE == 'S') {
                    carga_pto_venta(co_cliente, fecha_fn, st_contingencia);
                    myForm_d.setItemValue('entreg_pago', '0');
                    myForm_c.uncheckItem('chek_cre');
                    myForm_c.setItemValue('ruc_dni_doc_emi', co_cliente);
                    myForm_c.setItemValue('nom_doc_emi', det_cata);
                    myForm_c.validate();
                } else {
                    cod_cliente = co_cliente;
                }
            });
        } else {
            dhtmlx.message({ type: "error", text: "Ingrese un DNI o un Nombre para Buscar...", expire: 3000 });
        }
    }
    function ventana_pedidos_x_atender() { //carga lista PEDIDOS
        co_num_pedi_select = '0';
        dhxWins1 = new dhtmlXWindows();
        dhxWinstipen2t = dhxWins1.createWindow("wco_pedido", 75, 5, 850, 450);
        dhxWinstipen2t.setText("B\u00fasqueda Pedidos");
        layoutP = new dhtmlXLayoutObject(dhxWins1.window("wco_pedido"), '1C');
        layoutP.cells("a").hideHeader();
        dhxGridtep = layoutP.cells("a").attachGrid();
        dhxGridtep.setImagePath(BASE_URL + 'dhtmlx/codebase/imgs/');
        dhxGridtep.setHeader("PEDIDO,C. VENDEDOR,NOM.  VENDEDOR,RUC/DNI,NOMBRE CLIENTE ,TOTAL,C. DIRECCION,DESC. DIRRECCION");
        dhxGridtep.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,&nbsp,&nbsp,&nbsp");
        dhxGridtep.setColTypes("ro,ro,ro,ro,ro,ro,ro,ro");
        dhxGridtep.setInitWidths("80,90,250,90,250,80,100,200"); //2                     dhxGridtep.setColAlign("left,left,left,left,left,left,right,left");
        dhxGridtep.setColSorting("str,str,str,str,str,str,str,str");
        dhxGridtep.init();
        if (RESPONSABLE == 'S') {
            loadGridData(BASE_URL + 'get/datapv0101/grilla_pedidos_atender/0', true, dhxGridtep, layoutP.cells("a"), false);
            dhxGridtep.attachEvent("onRowSelect", function (id) {
                co_num_pedi_select = id;
                var co_pedido = dhxGridtep.cells(co_num_pedi_select, 0).getValue();
                var co_dirr = dhxGridtep.cells(co_num_pedi_select, 6).getValue();
                var de_dirr = dhxGridtep.cells(co_num_pedi_select, 7).getValue();
                var nombre = dhxGridtep.cells(co_num_pedi_select, 4).getValue();
                var co_cli = dhxGridtep.cells(co_num_pedi_select, 3).getValue();
                var select_vendedor = dhxGridtep.cells(co_num_pedi_select, 1).getValue();
                co_vendedor = select_vendedor;
                carga_pto_venta(co_cli, '01-01-1990', st_contingencia);
                cod_direcc = co_dirr;
                myForm_c.setItemValue('direccion_c', de_dirr);
                myForm_c.setItemValue('nom_doc_emi', nombre);
                myForm_c.setItemValue('ruc_dni_doc_emi', co_cli);
                myForm_c.setItemValue('num_pedido_atender', co_pedido);
                myForm_a.setItemValue('direccion_a', de_dirr);
                myForm_a.setItemValue('selec_vendedor', select_vendedor);
                myForm_a.setItemValue('razonsocial', nombre);
                myForm_a.setItemValue('ruc_dni', co_cli);
                myForm_a.setItemValue('num_pedido', co_pedido);
                myForm_d.setItemValue('entreg_pago', '0');
                myForm_d.setItemValue('vuelt_pago', '0');
                llamar_cuerpo_doc();
                mygridVN.attachEvent("onRowSelect", function (id, ind) {
                    id_numrow = id;
                    nom_proeliminar = mygridVN.cells(id_numrow, 1).getValue();
                    if (ind == 12) {
                        borrar_producto(id_numrow);
                    }
                });
                mygridVN.init();
                loadGridData(BASE_URL + 'get/datapv0101/grilla_detalle_pedido/' + co_num_pedi_select, true, mygridVN, myLayout.cells("a"), false);
            });
        } else {
            var pedi_anular = '0';
            dhxGridtep.attachEvent("onRowSelect", function (id) {
                pedi_anular = id;
            });
            var myToolbarp = dhxWins1.window("wco_pedido").attachToolbar();
            // myToolbarp.setIconsPath(BASE_URL + "dhtmlx/codebase/imgs/");
            myToolbarp.setIconsPath("<?php echo base_url() . 'dhtmlx/codebase/skins/imgs/icons/' ?>");
            myToolbarp.addButton('b_anular_pedido', null, 'ANULAR', 'cancel_16.png');
            myToolbarp.addSeparator();
            myToolbarp.attachEvent("onClick", function (id) {
                switch (id) {
                    case 'b_anular_pedido':
                        anular_pedido(pedi_anular);
                        break;
                }
            });
            loadGridData(BASE_URL + 'get/datapv0101/grilla_pedidos_atender/' + co_vendedor, true, dhxGridtep, layoutP.cells("a"), false);
        }
    }
    function ventana_planillas_cerradas() {
        dhxWinpla_l = new dhtmlXWindows();
        dhxWinplaa = dhxWinpla_l.createWindow("wco_plani_cerra", 205, 25, 850, 500);
        dhxWinplaa.setText("PLanillas Cerradas");
        layoutPlani = new dhtmlXLayoutObject(dhxWinpla_l.window("wco_plani_cerra"), '1C');
        layoutPlani.cells("a").hideHeader();
        dhxGridpla_c = layoutPlani.cells("a").attachGrid();
        dhxGridpla_c.setImagePath(BASE_URL + 'dhtmlx/codebase/imgs/');
        dhxGridpla_c.setHeader("PLA. COBR.,T.EFECTIVO,T.TARJETAS,T.PLANILLA,T.DEPOSITOS,FE. INICIO,FE.CIERRE,PERIODO");
        dhxGridpla_c.setColTypes("ro,ro,ro,ro,ro,ro,ro,ro,ro");
        dhxGridpla_c.setInitWidths("120,100,100,100,100,150,150,10"); //2
        dhxGridpla_c.setColAlign("left,right,right,right,right,right,right,left");
        dhxGridpla_c.setColSorting("str,str,str,str,str,str,str,str,str");
        dhxGridpla_c.setColumnColor(",,,orange,,,");//periodo_s_pla = 0;
        dhxGridpla_c.init();
        if (RESPONSABLE == 'S') {
            loadGridData(BASE_URL + 'get/datapv0101/grilla_planillas_cerradas/' + co_pto_venta, true, dhxGridpla_c, layoutPlani.cells("a"), false);
            dhxGridpla_c.attachEvent("onRowSelect", function (id) {
                co_planilla_liqui = id;
                form_b_pla.setItemValue('plan_liqui', co_planilla_liqui);
                im_depo_pla_liqui = dhxGridpla_c.cells(id, 2).getValue();
                im_total_pla_liq = dhxGridpla_c.cells(id, 1).getValue();
                periodo_s_pla = dhxGridpla_c.cells(id, 7).getValue();//console.log(periodo_s_pla);
                dhxWinpla_l.window('wco_plani_cerra').hide();
            });
        }
    }
    function llamar_cuerpo_doc() {//ya no se usa 09-08-2019
        mygridVN.clearAll();
        mygridVN = new dhtmlXGridObject(myForm_a.getContainer("myGrid"));
        mygridVN.setHeader("CODIGO,PRODUCTO,UND,CAT,MONTO,S/IGV,PU,,,ST_DESCTO,,ICBPER,ST_DETRAC", null, ["text-align:center;", "text-align:center;", "text-align:center", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;"]);
        mygridVN.setColAlign("left,left,right,right,center,right,left,right,right,right,right,center,center,center");
        mygridVN.setColTypes("ro,ro,ron,ron,ro,ron,ro,img,ro,ro,ro,img,ro,ro");
        mygridVN.setColSorting("str,str,str,int,int,int,str,str,strs,str,str,str,str,str");
        mygridVN.setInitWidthsP("18,64,1,8,11,13,1,7,7,7,7,10,2,1");
        mygridVN.setColumnIds("cod,prod,unid,cant,monto,sigv,punita,valor1,valor2,descto,valor3,icbper,st_detrac");
        mygridVN.setNumberFormat("0,000.00", 4);
        mygridVN.setNumberFormat("0,000.00", 5);
        mygridVN.setColumnHidden(0, true);
        mygridVN.setColumnHidden(6, true);
        mygridVN.setColumnHidden(2, true);
        mygridVN.setColumnHidden(5, true);
        mygridVN.setColumnHidden(8, true);
        mygridVN.setColumnHidden(9, true);
        mygridVN.setColumnHidden(10, true);
        mygridVN.setColumnHidden(11, true);
        // mygridVN.setColumnHidden(11, true);
        mygridVN.setNoHeader(true);
    }
    function anular_pedido(pedi_anular) {
        if (pedi_anular == '0') {
            dhtmlx.message({ type: "error", text: "Seleccine un Pedido para ANULAR , Por favor", expire: 4000 });
        } else {
            dhtmlx.confirm("Confirme ANULAR  el pedido :" + pedi_anular, function (result) {
                if (result === Boolean(true)) {
                    layoutP.cells("a").progressOn();
                    $.ajax({
                        type: "POST", url: BASE_URL + "get/datapv0101/anular_pedido/" + pedi_anular, beforeSend: function () {
                        }, success: function (response) {
                            if (response == '1') {
                                dhxGridtep.clearAll();
                                loadGridData(BASE_URL + 'get/datapv0101/grilla_pedidos_atender/' + co_vendedor + '/' + co_pto_venta, true, dhxGridtep, layoutP.cells("a"), false);
                                layoutP.cells("a").progressOff();
                            }
                        }
                    });
                }
            });
        }
    }
    function loadGridData(ruta, firstLoad, grid, contenedor, footer, strgrid) {
        contenedor.progressOn();
        if (firstLoad == true) {
            grid.load(ruta, function doOnGridLoaded() {
                if (footer)
                    calculateFooterValues();
                contenedor.progressOff()
                if (strgrid === 'dhxGridesc1') {

                }
            });
        }
    }

    function loadGridDataDocpagados(ruta, firstLoad, grid, contenedor, footer) {
        contenedor.progressOn();
        if (firstLoad == true) {
            grid.load(ruta, function doOnGridLoaded() {
                if (footer)
                    calculateFooterDOcpagados();
                contenedor.progressOff()
            });
        }
    }

    function loadGridData_nota(ruta, firstLoad, grid, contenedor, footer) {
        contenedor.progressOn();
        if (firstLoad == true) {
            grid.load(ruta, function doOnGridLoaded() {
                if (footer)
                    calculateFooterValues_nota();
                contenedor.progressOff()
            });
        }
    }
    function loadGridDatapromo(ruta, firstLoad, grid, contenedor, footer) {
        contenedor.progressOn();
        if (firstLoad == true) {
            grid.load(ruta, function doOnGridLoaded() {
                if (footer)
                    calculateFooterValuespromo();
                contenedor.progressOff()
            }, 'xml');
        }
    }
    function loadGridDataventas(ruta, firstLoad, grid, contenedor, footer) {
        contenedor.progressOn();
        if (firstLoad == true) {
            grid.load(ruta, function doOnGridLoaded() {
                if (footer)
                    calculateFooterValuesventa();
                contenedor.progressOff();
            });
        }
    }
    function calculateFooterValues_nota() {
        subtotal_n = '0.0', v_igv_no = '0.0', total_n = '0.0';
        total_n = sumColumndecimal2(6, 'dhxGrid_nota', 2);//180 total
        subtotal_n = parseFloat(parseFloat(total_n) / 1.18).toFixed(2); //subtotal
        v_igv_no = parseFloat(total_n - subtotal_n).toFixed(2);
        var v_subtotal_nota = document.getElementById("v_subtotal_nota");
        v_subtotal_nota.innerHTML = subtotal_n;
        var v_igv_nota = document.getElementById("v_igv_nota");
        v_igv_nota.innerHTML = v_igv_no;
        var v_total_nota = document.getElementById("v_total_nota");
        v_total_nota.innerHTML = total_n;
        return true;
    }
    function calculateFooterValuespromo() {
        var sum_promo = document.getElementById("sum_promo");
        sumador_promo = sumColumndecimal(8, dhxGrid_selectbono, 2);
        return true;
    }
    function calculateFooterValuesventa() {
        var sum_ventas = document.getElementById("sum_ventas");
        sum_ventas.innerHTML = sumColumndecimal(9, mygridv, 2);
        return true;
    }
    function calculateFooterValues() {
        console.log('nu_ncredito :' + nu_ncredito);
        suma = '0.0', v_igvs = '0.0', sumt = '0.0', suma_g = 0, suma_desc = 0, suma_sin_desc = 0, s_icbper = 0, ST_DETRACCION = 'N';
        var example = mygridVN.getAllItemIds();
        var numbers = example.split(',');
        var ce = numbers[0].length == 0 ? 0 : numbers.length;
        myForm_a.setItemLabel('cant_items', 'Items : ' + ce);
        if (ce == '1')
            ce = 2;
        suma_g = parseFloat(sumColumndecimal2(4, 'mygridVN', 2)); //suma precio final de venta
        suma_desc = parseFloat(sumColumndecimal2(10, 'mygridVN', 2)); //suma descuentos
        suma_sin_desc = parseFloat(sumColumndecimal2(6, 'mygridVN', 2)); //suma precio final de venta sin desctos
        suma_g = Math.round10(suma_g, -1);
        suma_desc = Math.round10(suma_desc, -1);
        suma_sin_desc = Math.round10(suma_sin_desc, -1);
        var flete = st_flete === 'S' ? parseFloat(myForm_c.getItemValue('import_flete')) : 0;
        var suma_g_f = parseFloat(suma_g);
        var sum_igv = 0;
        suma = parseFloat(suma_g_f - (parseFloat(nu_ncredito)) + flete).toFixed(2);
        if (suma > 0) {
            for (i = 0; i < numbers.length; i++) {
                if (mygridVN.getRowData(numbers[i]).icbper === 'S') {
                    s_icbper = parseFloat(s_icbper) + parseFloat(mygridVN.getRowData(numbers[i]).monto);
                }
                if (mygridVN.getRowData(numbers[i]).st_detrac === 'S') {
                    ST_DETRACCION = 'S';
                }
            }
        }
        if (ST_DETRACCION == 'S' && suma > 0.5 * nu_uit && t_d_admin == '01') {
            dhtmlx.message({ title: "Informativo", type: "alert-warning", text: "CUIDADO!!!</br>PARA SUNAT EL ALCOHOL PURO ESTÁ SUJETO A DETRACCIÓN, POR LO QUE DEBE REGISTRARLO EN UNA FACTURA DIFERENTE" });
        }
        sumt = parseFloat(parseFloat(suma - s_icbper) / 1.18); //subtotal jhon 12082019 10:09
        v_igvs = parseFloat(suma - sumt - s_icbper).toFixed(2);
        if (length_cli != '11') {
            v_igvs = '0.00';
        }

        if (RESPONSABLE == 'S') {
            if (length_cli != '11') {
                myForm_c.setItemValue('import_doc_ami', suma_g); //SUB TOTL
            } else {
                myForm_c.setItemValue('import_doc_ami', parseFloat(sumt).toFixed(2)); //SUB TOTAL
            }
            myForm_c.setItemValue('igv_doc_ami', v_igvs); //ESTA HIDDEN
            myForm_d.setItemValue('total_doc_emi', suma);//EN EL CAMPO TOTAL VENTA
            myForm_d.setItemValue('sald_pago', suma); //esta hidden
            if (co_vendedor == '10000011') {
                myForm_d.setItemValue('valor_compro', '0'); //EN EL CAMPO POS
            } else {
                myForm_d.setItemValue('valor_compro', parseFloat(suma));//EN EL CAMPO VENTA POS
                if (parseFloat(suma) > 0) {
                    myForm_d.showItem('myGridPagos');
                    carga_referVISA();
                } else {
                    myForm_d.hideItem('myGridPagos');
                }
                myForm_d.setItemLabel('regventa', 'PAGAR S/ ' + parseFloat(suma));//myForm_c.setItemText('regventa', 'PAGAR S/ '+parseFloat(suma)); // myForm_c.setItemText
            }
            if (parseFloat(nu_ncredito) == 0) {
                myForm_d.setItemValue('nu_ncredito', '0'); //VALOR DE DESCTO DE LA NC
                myForm_c.setItemValue('doc_not_cre', ''); //SERIE DE LA NC
                nu_ncredito = '0';
                nota_cre = '';
                myForm_c.uncheckItem('chek_nota');
            }
        }
        if (suma == 0) {
            myForm_c.disableItem('ch_gratuita');
        } else {
            myForm_d.enableItem('regventa'), myForm_c.enableItem('ch_gratuita');// activa_gratis();
        }
        return true;
    }
    function sumColumndecimal2(ind, grid, dec) {
        if (grid == 'mygridVN') {
            var outd = 0;
            var example = mygridVN.getAllItemIds();
            var numbers = example.split(',');
            if (numbers == '') {
                myForm_d.setItemValue('comproba_pago', '.');
            } else {
                var i = 0;
                while (i < numbers.length) {
                    outd += parseFloat(mygridVN.cells(numbers[i], ind).getValue());
                    i++;
                }
            }
        } else if (grid == 'dhxGrid_nota') {
            var outd = 0;
            var example = dhxGrid_nota.getAllItemIds();
            var numbers = example.split(',');
            var i = 0;
            while (i < numbers.length) {
                outd += parseFloat(dhxGrid_nota.cells(numbers[i], ind).getValue());
                i++;
            }
        } else {
            var outd = 0;
            var example = dhxGrid_Pagos.getAllItemIds();
            var numbers = example.split(',');
            var i = 0;
            while (i < numbers.length) {
                outd += parseFloat(dhxGrid_Pagos.cells(numbers[i], ind).getValue());
                i++;
            }
        }
        return outd.toFixed(dec);
    }
    function carga_lista_amortizaciones() {
        total = '0';
        saldo = '0';
        cod_clie_selec = '0';
        mygridv_p = myLayout_amort.cells("a").attachGrid();
        mygridv_p.setHeader("DOCUMENTO,NOMBRE CLIENTE,TOTAL,SALDO,F. VENCE,CLIENTE", null, ["text-align:center;", "text-align:center;", "text-align:center", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;"]);
        mygridv_p.setColAlign("left,left,right,right,left,left");
        mygridv_p.setColTypes("ro,ro,ro,ro,ro,ro");
        mygridv_p.setColSorting("str,str,str,str,int,int,int,int,int,int"); //11
        mygridv_p.attachHeader("#text_search,#text_filter");
        mygridv_p.setInitWidthsP("8,50,10,10,12,10"); //15
        mygridv_p.enableBlockSelection();
        mygridv_p.attachEvent("onBeforeSelect", function () {
            return true;
        });
        mygridv_p.attachEvent("onRowSelect", function () {
            im_entrega = '0';
            cod = mygridv_p.getSelectedRowId();
            cod_clie_selec = mygridv_p.cells(cod, 5).getValue();
            f_ven_doc = mygridv_p.cells(cod, 4).getValue();

            total = mygridv_p.cells(cod, 2).getValue();
            saldo = mygridv_p.cells(cod, 3).getValue();
            form_amort.setItemValue('amort_doc', cod);
            form_amort.setItemValue('amort_deuda', total);
            form_amort.setItemValue('amort_entrega', '0.00');
            form_amort.setItemValue('amort_vuelto', '0.00');
            form_amort.setItemValue('amort_saldo', saldo);
        });
        mygridv_p.attachEvent("onKeyPress", function gridOnKeyPressed(code, ctrl, shift) {
            if (code == 67 && ctrl) {
                if (!mygridv_p._selectionArea)
                    return alert("Primero debes seleccionar un grupo de celdas.");
                mygridv_p.setCSVDelimiter("\t");
                mygridv_p.copyBlockToClipboard();
            }
            if (code == 86 && ctrl) {
                mygridv_p.setCSVDelimiter("\t");
                mygridv_p.pasteBlockFromClipboard();
            }
            return true;
        });
        mygridv_p.init();
        loadGridData(BASE_URL + 'get/datapv0101/lista_amort/' + co_pto_venta, true, mygridv_p, myLayout_amort.cells("a"), false);
    }
    function cerrar_pedido_atendido(pedido, fact_bole) {
        $.ajax({
            type: "POST", url: BASE_URL + 'get/datapv0101/cerrar_pedido_atendido/' + pedido + '/' + fact_bole,
            beforeSend: function () {
            }, success: function (response) {
                if (parseInt(response) === 1) {
                    console.log('pedido cerrado');
                } else {
                    console.log('error al  cerrado');
                }
            }
        });
    }
    function carga_lista_amort_pagadas() {
        mygridv = myLayout_amort.cells("c").attachGrid();
        mygridv.setHeader("CO_DOCUMENTO,TIPO_PAGO,CO_CLIE,RAZON_SOCIAL,CO_DOCUM_PAGO,EGRESO,COBRANZA,SALDO,F_VEN", null, ["text-align:center;", "text-align:center;", "text-align:center", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;"]);
        mygridv.setColAlign("left,left,left,left,left,left,left,left,left");
        mygridv.setColTypes("ro,ro,ro,ro,ro,ro,ro,ro,ro");
        mygridv.setColSorting("str,str,str,str,int,int,int,int,int"); //11
        mygridv.setInitWidthsP("8,10,10,10,12,10,10,10,10"); //15
        mygridv.attachFooter("<div></div>,<div></div>,<div ></div>,<div></div>,<div></div>,<div>TOTAL</div>,<div  style=\" font-weight: bold;\" id=\"sum_pagadas\"></div>,<div></div>,<div></div>", ["text-align:right;", "text-align:right;", "text-align:right;", "text-align:right;", "text-align:right;"]);
        carga_select_grilla(mygridv);
        mygridv.init();
        loadGridData_pagadas(BASE_URL + 'get/datapv0101/lista_amort_pagadas/' + co_pto_venta + '/' + co_planilla_cobranza, true, mygridv, myLayout_amort.cells("c"), true);
    }
    function carga_lista_planilla_realizadas_f(star, end) {
        if (RESPONSABLE == 'S') {
            mygrid = myLayoutpla.cells("b").attachGrid();
            grid_mygrid();
            mygrid.init();
            loadGridDatasum(BASE_URL + 'get/datapv0101/lista_planillas_realizadas_efec_f/' + co_pto_venta + "/" + star + '/' + end, true, mygrid, myLayoutpla.cells("b"), false);
        }
    }
    function carga_lista_planilla_realizadas(co_planilla) {
        if (RESPONSABLE == 'S') {
            mygrid = myLayoutpla.cells("b").attachGrid();
            grid_mygrid();
            mygrid.init();
            loadGridDatasum(BASE_URL + 'get/datapv0101/lista_planillas_realizadas_efec/' + co_pto_venta + "/" + co_planilla, true, mygrid, myLayoutpla.cells("b"), false);
        }
        //else {
        //  mygrid = tabbar.cells("a13").attachGrid();
        //  grid_mygrid();
        //  mygrid.init();
        //  loadGridDatasum(BASE_URL + 'get/datapv0101/lista_planillas_realizadas_efec/' + co_pto_venta + "/" + co_planilla, true, mygrid, tabbar.cells("a13"), false);
        //}
    }
    function grid_mygrid() {
        mygrid.setHeader(",AN,CO,IN,EN,EMA,DOCUMENTO,F. REGIST,HASH,TOTAL,CUPONATIC,VENDEDOR,NOMBRE VENDEDOR,RUC/DNI,NOMBRE CLIENTE,FORMA PAGO,DOC. REF,PLANILLA,CO_TIPO_DOC_ADMINISTR,EMAIL,CONFIRMAIL,ENV_MAIL_CONFI,TELEF", null, ["text-align:center;", "text-align:center;", "text-align:center", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;"]);
        mygrid.setColAlign("center,center,center,center,center,center,left,left,left,right,right,right,left,right,left,left,left,right,left,left,left");
        mygrid.setColTypes("img,img,img,img,img,img,ro,ro,ro,ron,ron,ro,ro,ro,ro,ron,ro,ro,ro,ro,ro,ro,ro,ro,ro");
        mygrid.setColSorting("str,str,str,str,str,str,str,str,str,int,int,str,str,str,str,int,str,str,int,str,str,str,str,str,str"); //1
        mygrid.setInitWidthsP("3,3,3,3,3,3,7,7,10,7,7,7,12,7,12,8,8,8,10,10,10,10,10,10"); //15
        mygrid.attachHeader("&nbsp,&nbsp,&nbsp,&nbsp,&nbsp,&nbsp,#text_filter,&nbsp,&nbsp,#number_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,&nbsp,&nbsp,&nbsp,&nbsp");
        mygrid.attachEvent("onMouseOver", mouseOverHandler);
        mygrid.setNumberFormat("000.00", 9);
        mygrid.setNumberFormat("000.00", 10);
        mygrid.setColumnHidden(15, true);
        mygrid.setColumnHidden(18, true);
        mygrid.setColumnHidden(19, true);
        mygrid.setColumnHidden(20, true);
        mygrid.setColumnHidden(21, true);
        mygrid.setColumnHidden(22, true);
        mygrid.setColumnHidden(11, true);
        // mygrid.attachFooter("<div></div>,<div></div>,<div></div>,<div></div>,<div  >SUB TOTALES S/.</div>,<div style=\" font-weight: bold;\" id=\"sum_cobranza\" ></div>,<div  style=\" font-weight: bold;\" id=\"sum_cuponatic\" ></div>,<div style=\" font-weight: bold;\"  >TOTAL S/.</div>,<div  style=\" font-weight: bold;\" id=\"sum_totalcupo\"></div>,<div></div>,<div  ></div>,<div></div>,<div></div>,<div></div>,<div ></div>", ["text-align:right;", "text-align:right;", "text-align:right;", "text-align:right;", "text-align:right;"]);
        carga_select_grilla(mygrid);
        mygrid.attachEvent("onRowSelect", function (id, ind) {
            co_doc_borrar = mygrid.cells(id, 6).getValue();
            let tipo_doc = mygrid.cells(id, 18).getValue();
            let val = tipo_doc.split("@");
            tipo_doc_selec = val[0];
            var tipo_ncr = val[1];
            co_hash = mygrid.cells(id, 8).getValue();
            email_selec = mygrid.cells(id, 19).getValue();
            ruc_dni_selec = mygrid.cells(id, 13).getValue();
            nom_cli_selec = mygrid.cells(id, 14).getValue();
            confir_mail = mygrid.cells(id, 20).getValue();
            env_conf_ema = mygrid.cells(id, 21).getValue();
            plani_borrar = st_contingencia === 'S' ? mygrid.cells(id, 17).getValue() : co_planilla_cobranza;
            cel_cliente = mygrid.cells(id, 22).getValue();
            selccion_opcion(ind, co_doc_borrar, tipo_doc_selec, tipo_ncr);
        });
    }
    function selccion_opcion(indicador, documento, t_d_admin_s, tipo_ncr) {
        switch (indicador) {
            case 1:
                if (documento == undefined || documento == '0') {
                    dhtmlx.message({ type: "error", text: "Seleccione un Documento para Eliminar , Por favor", expire: 3000 });
                } else {
                    //if (co_hash.length > 2) {
                    $.ajax({
                        type: "POST", url: BASE_URL + 'get/datapv0101/verifica_72hora_anula/' + co_pto_venta + '/' + plani_borrar + '/' + co_doc_borrar,
                        beforeSend: function () {
                            myLayoutpla.cells("b").progressOn();
                        }, success: function (response) {
                            var elem = response.split(','), tipo_docum = elem[0], horas_ = elem[1], perio_fac = elem[2], perio_pla = elem[3];
                            if (perio_fac == perio_pla) {
                                if (parseFloat(horas_) < 120) {
                                    dhxWinspassrrot = new dhtmlXWindows();
                                    dhxWinpassroot = dhxWinspassrrot.createWindow("w_passrrot", 485, 200, 450, 150);
                                    dhxWinpassroot.setText("Ingrese Motivo de Anulacion del Doc : " + documento);
                                    myform_root = dhxWinpassroot.attachForm(form_passroot);
                                    myform_root.attachEvent("onButtonClick", function (name) {
                                        switch (name) {
                                            case 'b_si_root':
                                                if (myform_root.validate() === Boolean(true)) {
                                                    var motivo = myform_root.getItemValue('motivo');
                                                    dhtmlx.confirm("Confirme Anular el Documento " + co_doc_borrar + " ...", function (result) {
                                                        if (result === Boolean(true)) {
                                                            $.ajax({
                                                                type: "POST",
                                                                url: BASE_URL + 'get/datapv0101/elminina_documento/' + co_pto_venta + '/' + plani_borrar + '/' + co_doc_borrar + '/' + motivo,
                                                                beforeSend: function () {
                                                                    myLayoutpla.cells("b").progressOn();
                                                                },
                                                                success: function (response) {
                                                                    if (response == 'OK') {
                                                                        myform_root.setItemValue('motivo', '')
                                                                        dhxWinspassrrot.window('w_passrrot').close();
                                                                        dhtmlx.message({ title: "Informativo", type: "alert-warning", text: "DOCUMENTO ANULADO" });
                                                                        carga_lista_planilla_realizadas(co_planilla_cobranza);
                                                                        co_doc_borrar = '0';
                                                                    } else {
                                                                        dhtmlx.message({ type: "error", text: "Comuniquese con Sistemas, no se puede anular el documento." + response, expire: 5000 });
                                                                        registra_errores(' Fail ajax() ' + response, "datapv0101:Anular el Documento()", 'NO', co_pto_venta + '/' + co_planilla_cobranza + '/' + co_doc_borrar + '/' + motivo);
                                                                    }
                                                                    myLayoutpla.cells("b").progressOff();
                                                                }, error: function (err) {
                                                                    dhtmlx.message({ type: "alert-error", text: "Ocurrio un problema al Cargar el Cliente, actualice el sistema y vuelva a intentarlo", expire: 6000 });
                                                                    registra_errores(' Fail ajax() ' + JSON.stringify(err, null, 2), "datapv0101:Anular el Documento()", 'NO', co_pto_venta + '/' + co_planilla_cobranza + '/' + co_doc_borrar + '/' + motivo);
                                                                }
                                                            });
                                                        } else {
                                                            myLayoutpla.cells("b").progressOff();
                                                        }
                                                    });
                                                } else {
                                                    dhtmlx.message({ type: "error", text: "Ingrese el motivo de anulaci\u00f3n, en una FRASE CORTA.", expire: 5000 });
                                                }
                                                break;
                                            case 'b_no_root':
                                                myform_root.setItemValue('motivo', '')
                                                dhxWinspassrrot.window('w_passrrot').close();
                                                myLayoutpla.cells("b").progressOff();
                                                break;
                                        }
                                    });
                                } else {
                                    dhtmlx.message({ title: "Informativo", type: "alert-warning", text: "DOCUMENTO NO PUEDE SER ANULADO, NO ESTA EN EL PLAZO DE 72 HORAS." });
                                    myLayoutpla.cells("b").progressOff();
                                }
                            } else {
                                dhtmlx.message({ title: "Informativo", type: "alert-warning", text: "El periodo de la Planilla es diferente al periodo del Documento.</br> La planilla del Documento debe estar Vigente. " });
                                myLayoutpla.cells("b").progressOff();
                            }
                        }
                    });
                    /* } else {
                     dhtmlx.message({type: "error", text: "El documento no está firmado, debe ser firmado y enviado a OSE-TELEFONICA, Por favor", expire: 3000});
                     }*/
                }
                break;
            case 2:
                if (documento == undefined || documento == '0') {
                    dhtmlx.message({ type: "error", text: "Seleccione un Documento , Por favor", expire: 3000 });
                } else {
                    levantar_pdf('mostrarpdf');
                    //co_pto_venta == 9 ? imprimir_remoto('0', t_d_admin_s, documento, 1) : levantar_pdf('mostrarpdf');
                    myLayoutpla.cells("b").progressOff();
                }
                break;
            case 3:
                switch (t_d_admin_s) {
                    case '01':
                        $.ajax({
                            type: "POST", url: BASE_URL + 'xml/ca010201/export_xml_envios_internos_clob.php?emp=' + emp + '&periodo=' + period + '&mes=' + mes + '&anho=' + anho + '&doc=' + documento + '&t_d_admin=' + t_d_admin_s + '&consulta=consulta',
                            beforeSend: function () {
                                myLayoutpla.cells("b").progressOn();
                            }, success: function (response) {
                                dhtmlx.message({ title: "Informativo", type: "alert-warning", text: response });
                                myLayoutpla.cells("b").progressOff();
                            }
                        });
                        break;
                    case '03':
                        dhtmlx.message({ title: "Informativo", type: "alert-warning", text: "Opci\u00f3n v\u00e1lida solo para Facturas." });
                        break;
                }
                break;
            case 4:
                dhtmlx.confirm("Se enviar\u00e1 el Documento :  " + co_doc_borrar + " a OSE-TELEFONICA... Est\u00e1 seguro?", function (result) {
                    if (result === Boolean(true)) {
                        $.ajax({
                            type: "POST", url: BASE_URL + 'xml/ca010201/export_xml_envios_internos_clob.php?emp=' + emp + '&tip_mod_nc=' + tipo_ncr + '&periodo=' + period + '&mes=' + mes + '&anho=' + anho + '&doc=' + documento + '&t_d_admin=' + t_d_admin_s + '&consulta=solo_firma',
                            beforeSend: function () {
                                myLayoutpla.cells("b").progressOn();
                            }, success: function (response) {
                                var respond = "", hash = "", ressult = "";
                                switch (t_d_admin_s) {
                                    case '01':
                                        var valuesign = response.split(";");
                                        if (valuesign.length == '1') {
                                            respond = valuesign[0];
                                        } else {
                                            valuenro = (valuesign[0]).search(" HA SIDO ACEPTADA");// var value = valuesign[0].split(",", 2);
                                            respond = valuesign[1], hash = valuesign[2];
                                            signaturevalue = valuesign[3];
                                            ressult = ' HA SIDO ACEPTADA';
                                            alertamsg = "FACTURA FIRMADA CORRECTAMENTE";
                                        }
                                        break;
                                    case '03':
                                        var valuesign = response.split(";");
                                        ressult = 'XML_regsitrado';
                                        respond = valuesign[0], hash = valuesign[1], signaturevalue = valuesign[2];
                                        valuenro = respond === 'XML_regsitrado' ? 1 : 0; //  console.log('respond : '+respond+ 'ressult : '+ressult);
                                        alertamsg = "BOLETA DE VENTA CORRECTA";
                                        break;
                                    case '07':
                                        var valuesign = response.split(";");
                                        ressult = 'XML_regsitrado';
                                        respond = valuesign[0], hash = valuesign[1];
                                        valuenro = respond === 'XML_regsitrado' ? 1 : 0;
                                        alertamsg = "N. CREDITO REGISTRADA";
                                        break;
                                }

                                if (valuenro > 0) {
                                    dhtmlx.message({ title: "Informativo", type: "alert-warning", text: "OSE-TELEFONICA : " + documento + ' , ' + alertamsg });
                                } else {
                                    dhtmlx.message({ title: "Informativo", type: "alert-warning", text: "OSE-TELEFONICA : " + respond });
                                }
                                mygrid.clearAll();
                                loadGridDatasum(BASE_URL + 'get/datapv0101/lista_planillas_realizadas_efec/' + co_pto_venta + "/" + co_planilla_cobranza, true, mygrid, myLayoutpla.cells("b"), false);
                                myLayoutpla.cells("b").progressOff();

                            }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                                mygrid.clearAll();
                                loadGridDatasum(BASE_URL + 'get/datapv0101/lista_planillas_realizadas_efec/' + co_pto_venta + "/" + co_planilla_cobranza, true, mygrid, myLayoutpla.cells("b"), false);
                                myLayoutpla.cells("b").progressOff();
                                dhtmlx.message({ title: "Informativo", type: "alert-warning", text: "Intente una vez m\u00e1s, Si el problema persiste,Comun\u00edquese con Sistemas." });
                            }
                        });
                    }
                });
                break;
            case 5:
                dhxWin3_mail = new dhtmlXWindows();
                dhxWin_mail2 = dhxWin3_mail.createWindow("w_mail", 0, 0, 450, 360);
                dhxWin3_mail.window("w_mail").setModal(true);
                dhxWin3_mail.window("w_mail").denyResize();
                dhxWin3_mail.window("w_mail").center();
                dhxWin_mail2.setText("Envio al correo");
                dhxLayout_mail = new dhtmlXLayoutObject(dhxWin_mail2, '1C');
                dhxLayout_mail.cells("a").hideHeader();
                myRibbon_mail = dhxLayout_mail.cells("a").attachRibbon(ribbon_mail);
                myRibbon_mail.attachEvent("onClick", function (itemId, bId) {
                    switch (itemId) {
                        case 'b_whasappt':
                            window.open(BASE_URL + 'xml/pv0101/download_pdf.php?name=' + ruc_empresa + '-' + tipo_doc_selec + '-' + co_doc_borrar + '.pdf&pto_vta=' + co_pto_venta);
                            window.open('https://wa.me/51' + myform_mail.getItemValue('telf_cli') + '?text=Buenas%20se%20adjunta%20comprobante%20de%20pago%20*' + co_doc_borrar + '*', 'Whasaapt');
                            break;
                        case 'b_descargar':
                            window.open(BASE_URL + 'xml/pv0101/download_pdf.php?name=' + ruc_empresa + '-' + tipo_doc_selec + '-' + co_doc_borrar + '.pdf&pto_vta=' + co_pto_venta);
                            break;
                        case 'b_salir_mail':
                            clearInterval(timerset_o);
                            myLayoutpla.cells("b").progressOff();
                            dhxWin3_mail.window('w_mail').close();
                            break;
                        case 'b_enviar':
                            $.ajax({
                                type: "POST",
                                url: BASE_URL + 'xml/pv0101/sendmail.php?nucliente=' + ruc_dni_selec + '&cliente=' + n_clien + '&ruc=' + ruc_empresa + '&doc=' + co_doc_borrar + '&tipo_doc=' + tipo_doc_selec + '&ptoventa=' + co_pto_venta + '&from=' + myform_mail.getItemValue('mail_cli'),
                                beforeSend: function () {
                                    dhxLayout_mail.cells("a").attachHTMLString('<div id="objId"><center><br><br><br><div class="loader" id="loader"></div><div class="loader" id="loader2"></div><div class="loader" id="loader3"></div><div class="loader" id="loader4"></div>	<span id="text">Enviando, un momento...</span><br></div>');
                                },
                                success: function (response) {
                                    if (response == 'OK') {
                                        dhtmlx.message({ text: "Se envió el correo, correctamente...." });
                                        dhxWin3_mail.window('w_mail').close();
                                    } else {
                                        dhxLayout_mail.cells("a").attachHTMLString(response);
                                    }
                                    myLayoutpla.cells("b").progressOff();
                                }
                            });
                            break;
                    }
                });
                dhxWin3_mail.attachEvent("onClose", function (win) { //                        
                    clearInterval(timerset_o);
                    myLayoutpla.cells("b").progressOff();
                    return true;
                });
                levantar_pdf('mail');
                break;
        }
    }
    function levantar_pdf(accion) {
        $.ajax({
            async: true, url: BASE_URL + 'get/datapv0101/lista_detalle_documento_c/' + co_doc_borrar + '/' + co_planilla_cobranza + '/' + co_pto_vent,
            type: 'post', beforeSend: function () {
                myLayoutpla.cells("b").progressOn();
            }, success: function (response) {
                var json = eval(response);
                for (var i in json) {
                    var DE_RAZON_SOCIAL = json[i].DE_RAZON_SOCIAL, IM_SUBTOTAL = json[i].IM_SUBTOTAL, IM_IGV = json[i].IM_IGV, ICBPER = json[i].ICBPER;
                    var IM_TOTAL = json[i].IM_TOTAL, CO_CLIENTE = json[i].CO_CLIENTE, nota_cred = json[i].NC, CAN_NC = json[i].CANT_NC, st_nc = json[i].ST_NC, CAN_TJ = json[i].CAN_TJ;
                    var CANT_EFE = json[i].CANT_EFE, VENDEDOR = json[i].VENDEDOR, freg = json[i].FREG, afecta_igv = json[i].AFECTA, SUM_BONI = json[i].SUM_BONI, FREG_REF = json[i].FREG_REF;
                    var RUC_MAYOR = json[i].RUC_MAYOR, DOC_MAYOR = json[i].DOC_MAYOR, DOC_REF = json[i].DOC_REF, DE_CONCEP = json[i].DE_CONCEP;
                    t_d_admin = json[i].CO_TIPO_DOC_ADMINISTR, ref_doc = DOC_MAYOR, ruc_ref = RUC_MAYOR, HASH = json[i].HASH, signaturevalue = json[i].signaturevalue, OBSER = json[i].OBSER, suma_desc = parseFloat(json[i].DESCTO).toFixed(2), IM_TOTAL = parseFloat(IM_TOTAL).toFixed(2);
                }
                SUB_TOTAL = IM_TOTAL, s_icbper_ = ICBPER;
                IM_TOTAL = IM_TOTAL - CAN_NC;
                IM_IGV = parseFloat(parseFloat(IM_TOTAL - s_icbper_) / 1.18) * 0.18.toFixed(2);
                var EFEC = CANT_EFE;
                cant_tajeta = CAN_TJ;
                var st_tarjeta = 'N', IM_IGV_copy = '0';
                if (VENDEDOR == '10000011') {
                    st_tarjeta = 'N', cant_tajeta = '0', EFEC = '0.00';
                } else {
                    st_tarjeta = parseFloat(cant_tajeta) > 0 ? 'S' : 'N';
                }

                $.ajax({
                    async: true, url: BASE_URL + 'get/datapv0101/lista_detalle_documento/' + co_doc_borrar + '/' + co_planilla_cobranza + '/' + t_d_admin, type: 'post',
                    beforeSend: function () {
                    }, success: function (response) {
                        var filas = '0', json = eval(response), detalle_copia = "";
                        for (var i in json) {
                            var nombre = json[i].nombre, cant = json[i].cant, p_uni = json[i].p_uni, sub_tot = json[i].sub_tot, final_tot = json[i].final_tot, ult_digi_d = nombre.length, st_desc1 = json[i].desc;
                            var st_tipoventa = json[i].st_tipoventa, st_icbperdeta = json[i].st_icbperdeta, rang_strin_d = ult_digi_d - 34, res = co_doc_borrar.slice(1, 4), p_uni_igv = final_tot / cant;
                            ST_DETRA_D = json[i].st_detracc;
                            if (ST_DETRA_D == 'S' && suma > 0.5 * nu_uit && t_d_admin == '01') {
                                ST_DETRACCION == 'S';
                            }
                            if (parseFloat(st_tipoventa) > 0) {
                                switch (parseInt(st_tipoventa)) {
                                    case 7:
                                        tip_des = ' (ONMAST)';
                                        break;
                                    case 8:
                                        tip_des = ' (PRICOM)';
                                        break;
                                    case 9:
                                        tip_des = ' (CIEPTA)';
                                        break;
                                    case 10:
                                        tip_des = ' (BLOGGER)';
                                        break;
                                }
                                (parseFloat(st_desc1) > 0) ? p_uni_igv = parseFloat(p_uni_igv / parseFloat((100 - st_desc1) / 100)) : null;
                                detalle_copia = detalle_copia + (((nombre.substring(rang_strin_d).replace("&", "%26")).replace("#", "%23")).replace("'", "%27")).replace("`", "%60") + ',' + cant + ' x ' + Math.round10(parseFloat(p_uni_igv).toFixed(2), -1) + tip_des + st_desc1 + '%25,' + parseFloat(final_tot).toFixed(2) + ';';
                            } else {
                                if (st_tipoventa == 'S') {
                                    p_uni_v = parseFloat((1 - (st_desc2 / 100)) * p_uni_v).toFixed(2);
                                    detalle_copia = detalle_copia + (((nombre.substring(rang_strin_d).replace("&", "%26")).replace("#", "%23")).replace("'", "%27")).replace("`", "%60") + ',' + cant + ' x ' + Math.round10(parseFloat(p_uni_v).toFixed(2), -1) + ' (CUP)' + st_desc2 + '%25,' + parseFloat(sub_tot).toFixed(2) + ';';
                                } else {//'N' -'D'
                                    (parseFloat(st_desc1) > 0) ? p_uni_igv = parseFloat(p_uni_igv / parseFloat((100 - st_desc1) / 100)) : null;
                                    if (st_tipoventa == 'D') {
                                        detalle_copia = detalle_copia + (((nombre.substring(rang_strin_d).replace("&", "%26")).replace("#", "%23")).replace("'", "%27")).replace("`", "%60") + ',' + cant + ' x ' + Math.round10(parseFloat(p_uni_igv).toFixed(2), -1) + ' (DSCTO)' + st_desc1 + '%25,' + parseFloat(sub_tot).toFixed(2) + ';';
                                    } else { //'N'
                                        if (st_tipoventa == 'P') {
                                            if (st_icbperdeta == 'S') {
                                                detalle_copia = detalle_copia + (((nombre.substring(rang_strin_d).replace("&", "%26")).replace("#", "%23")).replace("'", "%27")).replace("`", "%60") + ',' + cant + ' x ' + '0.00' + ' (ICBPER),' + '0.00' + ';';
                                            } else {
                                                detalle_copia = detalle_copia + (((nombre.substring(rang_strin_d).replace("&", "%26")).replace("#", "%23")).replace("'", "%27")).replace("`", "%60") + ',' + cant + ' x ' + Math.round10(parseFloat(p_uni_igv).toFixed(2), -1) + ' (PROMO),' + parseFloat(sub_tot).toFixed(2) + ';';
                                            }


                                        } else { //'L Y DESCTO KAMILL  NUEVOS 
                                            var tip_desc = parseFloat(st_desc1) > 0 ? '(DSCTO)' + st_desc1 + '%25' : '';
                                            detalle_copia = detalle_copia + (((nombre.substring(rang_strin_d).replace("&", "%26")).replace("#", "%23")).replace("'", "%27")).replace("`", "%60") + ',' + cant + ' x ' + Math.round10(parseFloat(p_uni_igv).toFixed(2), -1) + tip_desc + ',' + parseFloat(final_tot).toFixed(2) + ';';
                                        }
                                    }
                                }
                            }
                            filas++;
                        }
                        suma_boni = 0;
                        if (t_d_admin == '01' || t_d_admin == '03') {
                            url_pdf = BASE_URL + "xml/pv0101/ima_pdf417.php?accion=mail&icbper=" + s_icbper_ + "&st_detra=" + ST_DETRACCION + "&signaturevalue=" + signaturevalue + "&doc_ref=" + ref_doc + "&ruc_ref=" + ruc_ref + "&t_d_admin=" + t_d_admin + "&dscto=" + parseFloat(suma_desc).toFixed(2) + "&boni=" + SUM_BONI + "&direc=.&hash=" + HASH + "&can_tarjeta=" + parseFloat(cant_tajeta).toFixed(2) + "&st_tarjeta=" + st_tarjeta + "&cant_nota=" + parseFloat(CAN_NC).toFixed(2) + "&st_nota=" + st_nc + "&nota_cre=" + nota_cred + "&pto_vta=" + co_pto_venta + "&bodypro=" + detalle_copia + "&st_credito=N" + "&docu=" + co_doc_borrar + "&igv=" + IM_IGV + "&sub=" + parseFloat(SUB_TOTAL).toFixed(2) + "&total=" + IM_TOTAL + "&vuelto=" + '0.0' + "&efect=" + parseFloat(EFEC).toFixed(2) + '&rucdni=' + CO_CLIENTE + '&nom=' + DE_RAZON_SOCIAL.substring(0, 20).replace("&", "%26") + "&filas=" + filas + '&copia=2' + '&vendedor=' + VENDEDOR + '&fecha=' + freg + '&obser=' + OBSER + '&afectaigv=' + afecta_igv + '&accion=' + accion, 'COPIA DEL CLIENTE : ' + co_doc_borrar;
                        } else {
                            url_pdf = BASE_URL + "xml/pv0101/ticket_nota.php?accion=mail&signaturevalue=" + signaturevalue + "&tipo_nc=" + nota_cred + "&hash=" + HASH + "&obs=" + DE_CONCEP
                                + "&fancestro=" + FREG_REF + "&ancestro=" + DOC_REF
                                + "&concepto=" + DE_CONCEP + "&pto_vta=" + co_pto_venta + "&bodypro=" + detalle_copia + "&st_credito=N" + "&docu=" + co_doc_borrar + "&igv=" + IM_IGV
                                + "&sub=" + IM_SUBTOTAL + "&total=" + IM_TOTAL + "&vuelto=" + '0.0' + "&efect=" + '0.00' + '&rucdni=' + CO_CLIENTE + '&nom=' + DE_RAZON_SOCIAL.substring(0, 20).replace("&", "%26") + "&filas=" + filas + '&copia=2' + '&vendedor=' + VENDEDOR + '&fecha=' + freg + '&accion=' + accion;
                        }

                        if (accion == 'mostrarpdf') {
                            window.open(url_pdf, 'COPIA', 'width=800,height=700').print({ bUI: false, bSilent: true, bShrinkToFit: true });
                        } else {                                        //console.log(url_pdf);
                            dhxLayout_mail.cells("a").attachURL(url_pdf);
                            num_itentos = 0;
                            timerset_o = setInterval(function () {
                                $.ajax({
                                    type: "POST", url: BASE_URL + 'get/datapv0101/verifica_descarga/' + co_doc_borrar + '/' + tipo_doc_selec + '/' + co_pto_venta,
                                    beforeSend: function () {
                                        dhxLayout_mail.cells("a").attachHTMLString('<div id="objId"><center><br><br><br><div class="loader" id="loader"></div><div class="loader" id="loader2"></div><div class="loader" id="loader3"></div><div class="loader" id="loader4"></div>	<span id="text">VERIFICANDO PDF, un momento...</span><br></div>');
                                    }, success: function (response) {
                                        var elem = response.split('@'), rpta = elem[0], ruc = elem[1], ruta = elem[2];
                                        var elem2 = nom_cli_selec.split(' '), nom1 = elem2[2];
                                        n_clien = ruc_dni_selec.length > 8 ? nom_cli_selec : nom1;
                                        if (rpta == '1') {
                                            clearInterval(timerset_o);
                                            myform_mail = dhxLayout_mail.cells("a").attachForm(form_mail);
                                            myform_mail.setItemValue('mail_cli', email_selec);
                                            myform_mail.setItemValue('telf_cli', cel_cliente);
                                            myform_mail.setItemLabel('l_mail_pdf', ruc_empresa + '-' + tipo_doc_selec + '-' + co_doc_borrar + '.pdf');
                                            myform_mail.setItemLabel('l_mail_xml', ruc_empresa + '-' + tipo_doc_selec + '-' + co_doc_borrar + '.xml');

                                        } else {
                                            num_itentos++;
                                            if (num_itentos == 5)
                                                clearInterval(timerset_o);
                                            dhtmlx.message({ type: "error", text: "No se generaron los documentos electrónicos, intente mas tarde...." });
                                        }
                                    }
                                });
                            }, 1000);
                        }
                    },
                    fail: function () {
                        navigator.notification.alert('Error, concectar servidor...!');
                    }
                });
            },
            fail: function () {
                navigator.notification.alert('Error, concectar servidor...!');
            }
        });
    }



    function loadGridDataTREE(ruta, firstLoad, grid, contenedor, footer) {
        contenedor.progressOn();
        if (firstLoad == true) {
            grid.load(ruta, function doOnGridLoaded() {
                console.log(ruta);
                calculateDataTree();
                contenedor.progressOff();
            }, "js");
        }
    }
    function loadGridDataVen(ruta, firstLoad, grid, nom, contenedor, footer) {
        contenedor.progressOn();
        if (firstLoad == true) {
            grid.load(ruta, function doOnGridLoaded() {
                if (nom == 'gridr13')
                    grid.groupBy(0, ["#title", "#cspan", "#stat_total"]);
                if (footer)
                    calculateFooterValuesven(grid, nom);
                contenedor.progressOff();
            });
        }
    }
    function calculateFooterValuesven(grid, nom) {
        console.log(nom);
        switch (nom) {
            case 'gridr11':
                var ven_total = document.getElementById("ven_total");
                ven_total.innerHTML = sumColumndecimal(3, grid, 1);
                var ven_flete = document.getElementById("ven_flete");
                ven_flete.innerHTML = sumColumndecimal(4, grid, 1);

                var ven_bolsa = document.getElementById("ven_bolsa");
                ven_bolsa.innerHTML = sumColumndecimal(5, grid, 1);
                return true;
                break;
            case 'gridr12':
                var ven_total = document.getElementById("ven_total12");
                ven_total.innerHTML = sumColumndecimal(1, grid, 1);
                return true;
                break;
            case 'gridr13':
                var ven_total = document.getElementById("ven_total132");
                ven_total.innerHTML = sumColumndecimal(2, grid, 1);
                return true;
            case 'dhxGrid_arq':
                var ven_arq = document.getElementById("ven_arq");
                ven_arq.innerHTML = sumColumndecimal(3, grid, 1);
                if (parseFloat(sumColumndecimal(3, grid, 1)) > 0) {
                    myForm_detarq.enableItem('b_audit_arq'), myForm_b_arq.enableItem('btn_calc_arq');
                } else {
                    myForm_detarq.disableItem('b_audit_arq'), myForm_b_arq.disableItem('btn_calc_arq');
                }
                return true;
            case 'dhxGridarqex':
                var ven_ext = document.getElementById("ven_ext");
                ven_ext.innerHTML = sumColumndecimal(3, grid, 1);
                return true;

                break;
        }
    }
    function loadGridDatasum(ruta, firstLoad, grid, contenedor, footer) {
        contenedor.progressOn();
        if (firstLoad == true) {
            grid.load(ruta, function doOnGridLoaded() {
                grid.groupBy(15, ["#title", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#stat_total", "#stat_total"]);
                if (footer)
                    calculateFooterValuessum();
                contenedor.progressOff();
            });
        }
    }
    function loadGridData_pagadas(ruta, firstLoad, grid, contenedor, footer) {
        contenedor.progressOn();
        if (firstLoad == true) {
            grid.load(ruta, function doOnGridLoaded() {
                if (footer)
                    calculateFooterValuespagdas();
                contenedor.progressOff();
            });
        }
    }

    function calculatesum_formapagos() {
        var sum_form_pagos = sumColumndecimal2(6, 'dhxGrid_Pagos', 2);// sumColumndecimal(6, dhxGrid_Pagos, 2);
        console.log(sum_form_pagos);
        return true;
    }
    function calculateFooterDOcpagados() {
        var sum_docpaga = document.getElementById("sum_docpaga");
        sum_docpaga.innerHTML = sumColumndecimal(1, gridrdoc_c, 2);
        console.log(sumColumndecimal(1, gridrdoc_c, 2));
        return true;
    }
    function calculateFooterValuespagdas() {
        var sum_pagadas = document.getElementById("sum_pagadas");
        sum_pagadas.innerHTML = sumColumndecimal(6, mygridv, 2);
        return true;
    }
    function calculateDataTree() {
        var ven_total13 = document.getElementById("ven_total132");
        ven_total13.innerHTML = sumColumndecimal(3, gridr13, 2);
        console.log(sumColumndecimal(1, gridr13, 2));
        return true;
    }
    function calculateFooterValuessum() {
        var sum_cobranza = document.getElementById("sum_cobranza");
        sum_cobranza.innerHTML = sumColumndecimal(4, mygrid, 2);

        var sum_cuponatic = document.getElementById("sum_cuponatic");
        sum_cuponatic.innerHTML = sumColumndecimal(5, mygrid, 2);
        var sum_totalcupo = document.getElementById("sum_totalcupo");
        sum_totalcupo.innerHTML = sumColumndecimal(13, mygrid, 2);
        // console.log('sum_totalcupo : ' + sumColumndecimal(12, mygrid, 2));
        return true;
    }
    function mouseOverHandler(row, col) {
        var cellObj = mygrid.cells(row, col);
        if (col < 6) {
            cellObj.cell.style.cursor = "pointer";
        } else {
            cellObj.cell.style.cursor = "default";
        }
    }
    function valida_responsa1() {
        $.ajax({
            type: "POST", url: BASE_URL + 'get/datapv0101/get_cod_vendedor/',
            beforeSend: function () { },
            success: function (response) {
                co_vendedor = response, myForm_a.setItemValue('selec_vendedor', response);
                f_selectvendedor();
                console.log('  co_vendedor :' + response);
            }
        });
    }
    function sumColumndecimal(ind, grid, dec) {
        var outd = 0;
        for (var i = 0; i < grid.getRowsNum(); i++) {
            outd += parseFloat(grid.cells2(i, ind).getValue());
        }
        //return formato_numero(outd.toFixed(dec), dec, '.', ',');
        return outd.numberFormat(2, '.', ',');
        //  return outd.toFixed(dec);
    }
    function carga_select_grilla(grid) {
        grid.enableBlockSelection();
        grid.attachEvent("onBeforeSelect", function () {
            return true;
        });
        grid.attachEvent("onKeyPress", function gridOnKeyPressed(code, ctrl, shift) {
            if (code == 67 && ctrl) {
                if (!grid._selectionArea)
                    return alert("Primero debes seleccionar un grupo de celdas.");
                grid.setCSVDelimiter("\t");
                grid.copyBlockToClipboard();
            }
            if (code == 86 && ctrl) {
                grid.setCSVDelimiter("\t");
                grid.pasteBlockFromClipboard();
            }
            return true;
        });
    }
    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    function decimalAdjust(type, value, exp) {
        // Si el exp no esta definido o es cero...
        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // Si el valor no es un numero o el exp no es un entero...
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }
        // Shift
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }
    if (!Math.round10) {
        Math.round10 = function (value, exp) {
            return decimalAdjust('round', value, exp);
        };
    }

}
