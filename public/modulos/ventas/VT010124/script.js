IniciarComponentes = () => {
    co_cliente = 0;
    let myLayougen = new dhtmlXLayoutObject(document.body, '1C');
    myLayougen.cells("a").hideHeader();
    let tabbar = myLayougen.cells("a").attachTabbar();
    tabbar.addTab("a11", "Cambio-Devolucion", null, null, true);
    tabbar.addTab("a12", "GDevolcuion-PreNC", null, null, false);

    //TABA11
    Layouta11 = new dhtmlXLayoutObject(tabbar.tabs("a11"), '2E');
    Layouta11.cells('a').hideHeader(), Layouta11.cells('b').hideHeader();
    Layouta11.setSeparatorSize(0, 0), Layouta11.cells("a").setHeight(50);
    Form_buscaa11 = Layouta11.cells("a").attachForm(form_buscar);
    Form_buscaa11.attachEvent("onButtonClick", async (name) => {
        switch (name) {
            case 'b_buscar':
                output = await BusquedaCliente(151, 'o10'); //IniciarGridBusqueda(5, false, Layouta11, co_cliente);
                console.log(output.arr_out[0], output.arr_out[1]);

                if (output !== null) {
                    co_cliente = output.arr_out[0];
                    let nom_clien = output.arr_out[1];
                    Form_buscaa11.setItemValue('nom_cliente', co_cliente + ' | ' + nom_clien);
                    myGrida11 = Layouta11.cells('b').attachGrid();
                    myGrida11.setHeader('Documento,Fe.Registro,Monto,Vend,NomVende,Tipo,Periodo,CoPtoVta,Pto.Venta,ESt.Pedido,Cambiar');
                    myGrida11.setInitWidthsP('7,7,10,7,20,8,8,8,10,8,5');
                    myGrida11.setColTypes('ro,ro,ron,ro,ro,ro,ro,ro,ro,ro,img');
                    myGrida11.setColAlign("left,left,left,left,left,left,left,left,left,left,center");
                    myGrida11.setColSorting("str,str,int,str,str,str,str,str,str,str,str");
                    myGrida11.setNumberFormat("000.0000", 2);
                    //myGrid.setNumberFormat("000.0000", 2), myGrid.setColumnHidden(7, true), myGrid.setColumnHidden(3, true);
                    myGrida11.setColumnIds("co_pedido,fe_reg,im_final,co_vendedor,nom_vend,de_docpago,periodo,coptovta,de_ptoventa,st_pedido,immg1");
                    myGrida11.setIconsPath("/assets/images/icons/iconsjhon/");
                    myGrida11.init();
                    Layouta11.cells('b').progressOn();
                    myGrida11.load(BASE_URL + 'VT010124/gridctactea11/' + co_cliente + '/' + usrJson.empresa, function () { Layouta11.cells('b').progressOff(); }).then(function (text) {
                        let n = text.search("nodata");
                        if (n > 0) {
                            let obj = JSON.parse(text);
                            obj.nodata == 'nodata' ? Swal.fire('Alerta!', 'No se encontraron pedidos dentro de los últimos 10 días..', 'error') : null;
                        }
                    });
                    myGrida11.attachEvent("onDataReady", function () {
                        let ids = myGrida11.getAllRowIds(), parte = ids.split(",");
                        for (var i = 0; i < parte.length; i++) {
                            if (myGrida11.cells(parte[i], 9).getValue() == 'Proceso') {
                                myGrida11.setRowTextStyle(parte[i], "color:red; font-weight:700;");
                            } /*else {
                                myGrida11.setRowTextStyle(parte[i], "color:red; font-weight:800;");
                              }*/
                        }
                    });
                    myGrida11.attachEvent("onRowSelect", function (id, ind) {
                        doc = myGrida11.cells(id, 0).getValue(); console.log(doc, id, ind);
                        
                       if (ind == 10) {  
                        dhtmlx.confirm("Se cambiará el estado del Pedido a PROCESO, mientras realiza los cambios de productos.", function(result){
                            if (result){
                                carga_cambio(doc) ;
                            }
                        });
                                 
                             
                    };


                    });
                }
                break;
            case 'b_actua':
                myGrida11.clearAll();
                Layouta11.cells('b').progressOn();
                myGrida11.load(BASE_URL + 'VT010124/gridctactea11/' + co_cliente + '/' + usrJson.empresa, function () { Layouta11.cells('b').progressOff(); }).then(function (text) {
                    let n = text.search("nodata");
                    if (n > 0) {
                        let obj = JSON.parse(text);
                        obj.nodata == 'nodata' ? Swal.fire('Alerta!', 'No se encontraron documentos dentro de los últimos 10 días..', 'error') : null;
                    }
                });
                break;
            default:
                Swal.fire('Alerta!', 'Esta opción no es valida..', 'error')
                break;
        }
    });



    ///FIN TAB11



    Layout = new dhtmlXLayoutObject(tabbar.tabs("a12"), '2E');
    Layout.cells('a').hideHeader(), Layout.cells('b').hideHeader();
    Layout.setSeparatorSize(0, 0), Layout.cells("a").setHeight(50);
    Form_busca = Layout.cells("a").attachForm(form_buscar);
    Form_busca.attachEvent("onButtonClick", async (name) => {
        output = await IniciarGridBusqueda(5, false, Layout, co_cliente);
        if (output !== null) {
            co_cliente = output.seleccion[0].codigo;
            let nom_clien = output.seleccion[0].ncomercial;
            Form_busca.setItemValue('nom_cliente', co_cliente + ' | ' + nom_clien);
            myGrid = Layout.cells('b').attachGrid();
            myGrid.setHeader('Documento,Fe.Registro,Monto,Tipo,Pedido,Pto.Venta,ESt.Pedido,DIF,G.DEVO,PR.NCRE,ADJUN');
            myGrid.setInitWidthsP('15,15,10,7,10,25,8,10,5,5,5');
            myGrid.setColTypes('ro,ro,ron,ro,ro,ro,ro,ron,img,img,img');
            myGrid.setColAlign("left,left,right,right,right,right,right,left,center,center,center");
            myGrid.setColSorting("str,str,int,str,str,str,str,int,str,str,str");
            myGrid.setNumberFormat("000.0000", 2), myGrid.setColumnHidden(7, true), myGrid.setColumnHidden(3, true);
            myGrid.setColumnIds("co_file_fisi,fe_reg,im_final,co_tipo_doc,pto_venta,st_pedido,day_dif,img1,img2,immg3");
            myGrid.setIconsPath("/assets/images/icons/iconsjhon/");
            myGrid.init();
            Layout.cells('b').progressOn();
            myGrid.load(BASE_URL + 'VT010124/gridctacte/' + co_cliente + '/' + usrJson.empresa, function () { Layout.cells('b').progressOff(); }).then(function (text) {
                let n = text.search("nodata");
                if (n > 0) {
                    let obj = JSON.parse(text);
                    obj.nodata == 'nodata' ? Swal.fire('Alerta!', 'No se encontraron documentos dentro de los últimos 30 días..', 'error') : null;
                }
            });
            myGrid.attachEvent("onDataReady", function () {
                let ids = myGrid.getAllRowIds(), parte = ids.split(",");
                for (var i = 0; i < parte.length; i++) {
                    if (parseFloat(myGrid.cells(parte[i], 7).getValue()) <= 10 && parseFloat(myGrid.cells(parte[i], 6).getValue()) != 'Cerrado') {
                        myGrid.setRowTextStyle(parte[i], "color:green; font-weight:800;");
                    } else {
                        myGrid.setRowTextStyle(parte[i], "color:red; font-weight:800;");
                    }
                }
            });
            myGrid.attachEvent("onRowSelect", function (id, ind) {
                doc = myGrid.cells(id, 0).getValue();
                ind == 8 ? carga_devolucion(doc) : ind == 9 ? carga_guiaprencredito(doc) : null;
            });
        }
    });
}
function onDatosIni(response) {
    let data = response.data;
    st_relaci = data.relacion, xtipodoc = data.xtipodoc, x_periodo = data.periodoact;
    dhxWncre = new dhtmlXWindows();
    let WindNCre = dhxWncre.createWindow('w_prencred', 0, 0, 800, 580);
    WindNCre.center(), WindNCre.setText('Generar PRE Nota Crédito ');
    WindNCre.setModal(true), WindNCre.keepInViewport(true);
    Layoutpnc = WindNCre.attachLayout("1C");
    form_NCrdto = Layoutpnc.cells("a").attachForm(form_not_cred);
    Layoutpnc.cells('a').hideHeader();
    cuerpo_prenc(st_relaci, xtipodoc);

}

async function cuerpo_prenc(st_relaci, xtipodoc) {
    form_NCrdto.reloadOptions('_moti_guiapnc', BASE_URL + 'VT010124/motiprenc/');
    form_NCrdto.reloadOptions('_moti_guia', BASE_URL + 'VT010124/motidevo/');
    form_NCrdto.reloadOptions('_concept_nc', BASE_URL + 'VT010124/concept_nc/' + usrJson.empresa + '/' + xtipodoc + '/' + st_relaci);
    let params = { xemp: usrJson.empresa, xdoc: doc };
    let result;
    result = await $.ajax({ url: '/api/VT010124/list-nc', method: 'post', data: params, dataType: 'json' });
    if (result.result[0] == 1) {
        cod_sernc = result.result[1][0].CO_CODIGO, de_sernc = result.result[1][0].DE_DESCRIPCION;
        form_NCrdto.setItemValue('de_serncredito', de_sernc);
    }

    result = await $.ajax({ url: '/api/VT010124/data-dgv', method: 'post', data: params, dataType: 'json' });
    if (result.result[0] == 1) {
        gdv_select = result.result[1][0].CO_GUIA_DEVO;
        form_NCrdto.setItemValue('de_serguia', gdv_select), form_NCrdto.setItemValue('num_doc_', result.result[1][0].CO_DOCUMENTO), form_NCrdto.setItemValue('fec_venc', result.result[1][0].FE_VENCIMIENTO), form_NCrdto.setItemValue('_moti_guia', result.result[1][0].CO_MOTI_DEVO), form_NCrdto.setItemValue('de_almac', (result.result[1][0].DE_ALMACEN).toUpperCase());

        dhxGrid_GNCdet = new dhtmlXGridObject(form_NCrdto.getContainer("myGridNota"));
        grillaDetalle(dhxGrid_GNCdet, Layoutpnc.cells('a'), gdv_select, 'gdvridet');
        dhxGrid_GNCdet.attachEvent("onRowSelect", function (rowId, colId) {
            cant_sel = dhxGrid_GNCdet.cells(rowId, 7).getValue();
            if (parseFloat(cant_sel) == 0) {
                form_NCrdto.disableItem('de_cantd'), form_NCrdto.disableItem('b_envpnc'), form_NCrdto.disableItem('_moti_guiapnc');
            } else {
                form_NCrdto.enableItem('b_envpnc'), form_NCrdto.enableItem('_moti_guiapnc');
            }
            form_NCrdto.setItemValue('de_cantd', cant_sel);
        });

        form_NCrdto.attachEvent("onButtonClick", async (name) => {
            if (name == 'b_envpnc') {
                let rowId = dhxGrid_GNCdet.getSelectedRowId();
                cant_sel = dhxGrid_GNCdet.cells(rowId, 7).getValue();
                if (parseFloat(form_NCrdto.getItemValue('de_cantd')) > 0) {
                    if (parseFloat(form_NCrdto.getItemValue('de_cantd')) <= parseFloat(cant_sel)) {
                        let difer = parseFloat(cant_sel) - parseFloat(form_NCrdto.getItemValue('de_cantd'));
                        dhxGrid_GNCdet.cells(rowId, 7).setValue(difer);
                        dhxGrid_PNCred.addRow((new Date()).valueOf(), ['idel.png', dhxGrid_GNCdet.cells(rowId, 0).getValue(), dhxGrid_GNCdet.cells(rowId, 1).getValue(), dhxGrid_GNCdet.cells(rowId, 2).getValue(), dhxGrid_GNCdet.cells(rowId, 3).getValue(), dhxGrid_GNCdet.cells(rowId, 4).getValue(), dhxGrid_GNCdet.cells(rowId, 5).getValue(), dhxGrid_GNCdet.cells(rowId, 6).getValue(), form_NCrdto.getItemValue('de_cantd'), dhxGrid_GNCdet.cells(rowId, 8).getValue(), dhxGrid_GNCdet.cells(rowId, 9).getValue(), dhxGrid_GNCdet.cells(rowId, 10).getValue(), form_NCrdto.getItemValue('_moti_guiapnc')], 1);
                        form_NCrdto.setItemValue('de_cantd', '0');
                    } else {
                        Swal.fire('Alerta!', 'Cantidad incorrecta, debe ser menor o igual a ' + cant_sel, 'error');
                    }
                } else {
                    Swal.fire('Alerta!', 'Cantidad incorrecta, debe ser mayor a CERO ', 'error');
                }
            }
            if (name == 'save_prenc') {
                let IDS = dhxGrid_PNCred.getAllItemIds();
                let id = IDS.split(',');
                let i = 0, x_guia_devo = form_NCrdto.getItemValue('de_serguia'), x_serie_nc = cod_sernc, x_concepto_nc = form_NCrdto.getItemValue('_concept_nc'),
                    x_nu_items = 0, x_cad_co_prod = "", x_cad_lote_cad = "", x_cad_cant = "", x_cad_tipo_vent = "", x_cad_moti_devo = "", y_cad_dif = "", x_pre_unit_cad = "", x_cad_sub_total = "";
                while (i < id.length) {
                    if (parseFloat(dhxGrid_PNCred.cells(id[i], 8).getValue()) > 0) {
                        x_cad_co_prod = x_cad_co_prod + dhxGrid_PNCred.cells(id[i], 3).getValue() + '@';
                        x_cad_lote_cad = x_cad_lote_cad + dhxGrid_PNCred.cells(id[i], 5).getValue() + '@';
                        x_cad_cant = x_cad_cant + parseInt(dhxGrid_PNCred.cells(id[i], 8).getValue()) + '@';
                        x_cad_tipo_vent = x_cad_tipo_vent + dhxGrid_PNCred.cells(id[i], 6).getValue() + '@';
                        x_cad_moti_devo = x_cad_moti_devo + dhxGrid_PNCred.cells(id[i], 12).getValue() + '@';
                        y_cad_dif = y_cad_dif + dhxGrid_PNCred.cells(id[i], 7).getValue() + '@';
                        x_pre_unit_cad = x_pre_unit_cad + Math.round10(dhxGrid_PNCred.cells(id[i], 9).getValue(), -4) + '@';
                        x_cad_sub_total = x_cad_sub_total + Math.round10(parseInt(dhxGrid_PNCred.cells(id[i], 8).getValue()) * dhxGrid_PNCred.cells(id[i], 9).getValue(), -4) + '@';
                        x_nu_items++;
                    }
                    i++;
                }
                let params = {
                    x_empresa: usrJson.empresa, x_usuario: usrJson.codigo, x_periodo: x_periodo, x_co_serie: x_co_serie, x_guia_devo: x_guia_devo,
                    x_serie_nc: x_serie_nc, x_concepto_nc: x_concepto_nc, x_nu_items: x_nu_items, x_cad_co_prod: x_cad_co_prod, x_cad_lote_cad: x_cad_lote_cad, x_cad_cant: x_cad_cant, x_cad_tipo_vent: x_cad_tipo_vent, x_cad_moti_devo: x_cad_moti_devo,
                    y_cad_dif: y_cad_dif, x_pre_unit_cad: x_pre_unit_cad, x_cad_sub_total: x_cad_sub_total
                };
                let result;
                try {
                    result = await $.ajax({ url: '/api/VT010124/save-prenc', method: 'post', data: params, dataType: 'json' });
                    result.result[0] == 1 ? Swal.fire('Bien!', result.result[1], 'success') : Swal.fire('Alerta!', 'Ocurrió un error', 'error');
                    dhxWncre.window("w_prencred").close(); //dhxWncre
                } catch (error) {
                    alert(JSON.stringify(error));
                }
            }
        });

        dhxGrid_PNCred = new dhtmlXGridObject(form_NCrdto.getContainer("myGridNotaCopy"));
        grillaDetalle(dhxGrid_PNCred, Layoutpnc.cells('a'), '0', 'gridprenc');
        dhxGrid_PNCred.attachEvent("onRowSelect", function (rowId, colId) {
            var n_gncrdtocp, n_gncrdto, cod_catalcp, cod_catal, cod_lote, cod_lotecp, cod_tipo, cod_tipocp, row_selcopy, sumarrow;
            if (colId == 0) {
                n_gncrdtocp = dhxGrid_PNCred.cells(rowId, 8).getValue();
                cod_catalcp = dhxGrid_PNCred.cells(rowId, 3).getValue();
                cod_lotecp = dhxGrid_PNCred.cells(rowId, 5).getValue();
                cod_tipocp = dhxGrid_PNCred.cells(rowId, 6).getValue();
                example = dhxGrid_GNCdet.getAllItemIds();
                let numbers = example.split(',');
                let i = 0;
                while (i < numbers.length) {
                    n_gncrdto = dhxGrid_GNCdet.cells(numbers[i], 7).getValue();
                    cod_catal = dhxGrid_GNCdet.cells(numbers[i], 2).getValue();
                    cod_lote = dhxGrid_GNCdet.cells(numbers[i], 4).getValue();
                    cod_tipo = dhxGrid_GNCdet.cells(numbers[i], 5).getValue();
                    if ((cod_catal === cod_catalcp) && (cod_lote === cod_lotecp) && (cod_tipo === cod_tipocp)) {
                        row_selcopy = numbers[i];
                        break;
                    }
                    i++;
                }
                sumarrow = parseFloat(n_gncrdto) + parseFloat(n_gncrdtocp);
                dhxGrid_GNCdet.cells(row_selcopy, 7).setValue(sumarrow);
                dhxGrid_PNCred.deleteRow(rowId);
                rowId = null;
            }
        });
    } else {
        Swal.fire('Alerta!', 'No encontramos ninguna GUIA DE DEVOLUCIÓN para ' + doc + ', ingrese una Guia de Devolución en el Icono :    <img  class="one" src="/assets/images/icons/iconsjhon/docgdevo.png">  ', 'error');
        dhxWncre.window("w_prencred").close();
    }


}

BusquedaCliente = (cliente, pedido, extraParam = '') => {
    return new Promise(resolve => {
        // multi = multiSelect;
        //  if (container.dhxWins.isWindow('winGridBusqueda')) {
        //      winGridBusqueda.bringToTop();
        //  }
        // else {

        dhxWncre = new dhtmlXWindows();
        winGridBusqueda = dhxWncre.createWindow('winGridBusqueda', 0, 0, 720, 480);
        //winGridBusqueda = container.dhxWins.createWindow('winGridBusqueda', 0, 0, 720, 480);
        winGridBusqueda.center();
        winGridBusqueda.keepInViewport(true);
        winGridBusqueda.setModal(true);
        winGridBusqueda.setText('Búsqueda');
        winGridBusqueda.button('close').hide();
        winGridBusqueda.button('park').hide();
        winGridBusqueda.button('minmax').hide();
        //    winGridBusqueda.setPagingSkin("bricks", 'skyblue');
        /* winGridBusqueda.attachStatusBar({
             paging: true,
             text: "<div id='bsq-pager'></div>"
         });*/
        winToolbar = winGridBusqueda.attachToolbar();
        winToolbar.setIconsPath('/assets/images/icons/');
        winToolbar.addText(null, null, 'Dni Cliente:');
        winToolbar.addInput('dni_cli', null, '', 80);
        winToolbar.addText(null, null, 'Ingrese Nro Pedido:');
        winToolbar.addInput('numpedido', null, '', 150);
        winToolbar.addButton('btok', null, 'Buscar', 'ic-add.png', '');
        winToolbar.addButton('btno', null, 'Salir', 'ic-delete.png', '');

        winToolbar.attachEvent('onClick', (id) => {
            client_b = winToolbar.getValue('dni_cli'), pedido_b = winToolbar.getValue('numpedido');
            // console.log(client_b,pedido_b);
            switch (id) {
                case 'btok':
                    winGridBusqueda.progressOn();
                    gridBusqueda.load(BASE_URL + 'VT010124/gridcliente/' + client_b + '/' + usrJson.empresa, function () { winGridBusqueda.progressOff(); });

                    break;
                default:
                    winGridBusqueda.close();
                    resolve(null);
                    break;
            }
        });
        gridBusqueda = winGridBusqueda.attachGrid();
        //busqueda de clientes
        gridBusqueda.setHeader('DNI/RUC,Razón Social');
        //gridBusqueda.attachHeader('#rspan,#text_filter,#text_filter,#rspan,#text_filter,#rspan');
        gridBusqueda.setInitWidthsP('20,80');
        //gridBusqueda.setColTypes('ch,ron,rotxt,rotxt,rotxt,rotxt');
        gridBusqueda.setColumnIds("codigo,ncomercial");

        gridBusqueda.init();
        gridBusqueda.attachEvent("onRowSelect", async function (rowId, colId) {
            let codclie = gridBusqueda.cells(rowId, 0).getValue();
            let nom = gridBusqueda.cells(rowId, 1).getValue();
            let arr_out = [];
            arr_out.push(codclie);
            arr_out.push(nom);
            const out = { arr_out };
            winGridBusqueda.close();
            resolve(out);
        });
        /*  winGridBusqueda.progressOn();
        gridBusqueda.load('/api/ancestros/datos-modal-busqueda/' + tipoEntidad + '/' + usrJson.empresa + '/' + extraParam).then(function (a, b, c) {//console.log(a +'-' +b +'-'+c)
             winGridBusqueda.progressOff();
         });*/
        //}
    });
};

function onDatosIniciales(response) {
    let data = response.data;
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        date = day + '-0' + month + '-' + year;
    } else {
        date = day + '-' + month + '-' + year;
    }
    x_periodo = data.periodoact, /*x_fe_venc = date,*/ x_co_serie = data.coserie;
    form_Dev.setItemValue('fec_venc', date);
    form_Dev.setItemValue('de_serguia', data.seriedevo);
    xtipodoc = data.xtipodoc;

}

function style(name, value) {
    if (name === 'nom_cliente')
        return "<div class='nomcliente'>" + value + "</div>";
    else
        return "<div class='s_estado'>" + value + "</div>";
}

async function carga_guiaprencredito(doc) {
    let paramst = { xemp: usrJson.empresa, xrucdni: co_cliente, xdoc: doc };
    $.post('/api/VT010124/ls-datos-iniciales', paramst, onDatosIni, 'json');

}

function carga_devolucion(doc) {
    dhxWcve = new dhtmlXWindows();
    WindowD1ventadev = dhxWcve.createWindow('w_dventa', 0, 0, 800, 520);
    WindowD1ventadev.center(), WindowD1ventadev.setText('Guía de Devolución del documento ' + doc);
    WindowD1ventadev.setModal(true), WindowD1ventadev.keepInViewport(true);
    let Layout1 = WindowD1ventadev.attachLayout("1C");
    form_Dev = Layout1.cells("a").attachForm(form_dev);
    Layout1.cells('a').hideHeader();
    form_Dev.setItemValue('num_doc_', doc), form_Dev.reloadOptions('_moti_guia', BASE_URL + 'VT010124/motidevo/'), form_Dev.reloadOptions('st_almac', BASE_URL + 'VT010124/list_almacen/' + usrJson.empresa);
    let paramst = { xemp: usrJson.empresa, xrucdni: co_cliente, xdoc: doc };
    $.post('/api/VT010124/ls-datos-iniciales', paramst, onDatosIniciales, 'json');
    form_Dev.attachEvent("onButtonClick", async function (name) {
        switch (name) {
           
            case 'b_savedev':
                let IDS = dhxGrid_Ddet.getAllItemIds();
                let id = IDS.split(',');
                let fecvenc = new Date(form_Dev.getItemValue('fec_venc'));
                let day = fecvenc.getDate();
                let month = fecvenc.getMonth();
                let year = fecvenc.getFullYear().toString().substr(-2);
                let monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                let monthName = monthNames[month];
                if (day < 10) {
                    day = '0' + day;
                }
                fecvenc = day + '-' + monthName + '-' + year;
                let i = 0, x_cad_prod = "", x_cad_dif = "", x_cad_cant = "", x_cad_monto = "", x_cant_items = 0, x_cad_prec = "", x_cad_lote = "", x_cad_tipo = "",
                    x_nu_doc = doc, x_moti_devo = form_Dev.getItemValue('_moti_guia'), x_co_alma = form_Dev.getItemValue('st_almac'), x_fe_venc = fecvenc;
                while (i < id.length) {
                    if (parseFloat(dhxGrid_Ddet.cells(id[i], 8).getValue()) > 0) {
                        x_cad_prod = x_cad_prod + dhxGrid_Ddet.cells(id[i], 0).getValue() + '@-@';
                        x_cad_cant = x_cad_cant + parseInt(dhxGrid_Ddet.cells(id[i], 8).getValue()) + '@-@';
                        x_cad_prec = x_cad_prec + Math.round10(parseFloat(dhxGrid_Ddet.cells(id[i], 7).getValue()) / parseFloat(dhxGrid_Ddet.cells(id[i], 5).getValue()), -4) + '@-@';
                        x_cad_lote = x_cad_lote + dhxGrid_Ddet.cells(id[i], 2).getValue() + '@-@';
                        x_cad_tipo = x_cad_tipo + dhxGrid_Ddet.cells(id[i], 4).getValue() + '@-@';
                        x_cad_monto = x_cad_monto + Math.round10(dhxGrid_Ddet.cells(id[i], 9).getValue(), -4) + '@-@';
                        x_cad_dif = x_cad_dif + dhxGrid_Ddet.cells(id[i], 3).getValue() + '@-@';
                        x_cant_items++;
                    }
                    i++;
                }
                let params = {
                    x_empresa: usrJson.empresa, x_usuario: usrJson.codigo, x_periodo: x_periodo, x_co_serie: x_co_serie, x_fe_venc: x_fe_venc, x_co_alma: x_co_alma,
                    x_cad_prod: x_cad_prod, x_cad_cant: x_cad_cant, x_cad_prec: x_cad_prec, x_cad_lote: x_cad_lote, x_cad_tipo: x_cad_tipo, x_cant_items: x_cant_items,
                    x_nu_doc: x_nu_doc, x_moti_devo: x_moti_devo, x_cad_monto: x_cad_monto, x_cad_dif: x_cad_dif
                };
                let result;
                try {
                    result = await $.ajax({ url: '/api/VT010124/save-gdvl', method: 'post', data: params, dataType: 'json' });
                    result.result[0] == 1 ? Swal.fire('Bien!', result.result[1], 'success') : Swal.fire('Alerta!', 'Ocurrió un error', 'error');
                    dhxWcve.window("w_dventa").close();
                } catch (error) {
                    alert(JSON.stringify(error));
                }
                break;
        }
    });
    dhxGrid_Ddet = new dhtmlXGridObject(form_Dev.getContainer("myGridNota"));//Layout1.cells("a").attachGrid();
    grillaDetalle(dhxGrid_Ddet, Layout1.cells('a'), doc, 'gridet');
}

function grillaDetalle(grid, layout, doc, router) {
    switch (router) {
        case 'gdvridet':
            grid.setHeader("DOC,GUIA,COD.PROD,PROD.GUIA.DEVOLUCION,LOTE,TIPO,DIFF,CANT,PREC.UNI,MONTO,FECHA,ALM", null, ["text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;"]);
            grid.setColTypes("ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro");
            grid.setInitWidthsP("10,10,10,80,10,10,10,20,10,12,12,12");
            grid.setColAlign("right,left,right,left,left,left,right,right,right,right,right,right");
            grid.setColSorting("str,str,str,str,str,str,str,str,str,str,str,str");
            grid.enableMultiline(true);
            grid.setColumnHidden(0, true), grid.setColumnHidden(1, true), grid.setColumnHidden(2, true), grid.setColumnHidden(4, true), grid.setColumnHidden(5, true), grid.setColumnHidden(6, true), grid.setColumnHidden(8, true), grid.setColumnHidden(9, true), grid.setColumnHidden(10, true), grid.setColumnHidden(11, true);
            grid.init();
            layout.progressOn();
            grid.load(BASE_URL + 'VT010124/' + router + '/' + doc + '/' + usrJson.empresa, function () { layout.progressOff(); });
            break;
        case 'gridet':
            grid.setHeader("COD.PRODUCTO,NOMBRE PRODUCTO,LOTE,DIFER,TPOVTA,CANT,PRE.UNI,TOT.DOC,CANT.PRENC,TOT.PRENC", null, ["text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;"]);
            grid.setColTypes("ro,ro,ro,ro,ro,ron,ron,ron,edn,ron[=(c7/c5)*c8]");
            grid.setInitWidthsP("10,55,10,10,10,10,10,12,12,12");
            grid.setColAlign("right,left,left,left,right,right,right,right,right,right");
            grid.setColSorting("str,str,str,str,str,int,int,int,int,int");
            grid.setColumnColor(",,,,,,,,orange,");
            grid.setNumberFormat("0,000.00", 7), grid.setNumberFormat("0,000.00", 9);
            grid.setColumnHidden(0, true), grid.setColumnHidden(2, true), grid.setColumnHidden(3, true), grid.setColumnHidden(4, true), grid.setColumnHidden(6, true);
            grid.attachFooter("<div>SUB TOTAL</div>,#cspan,#cspan,#cspan,#cspan,#cspan,#cspan,#cspan,<div style=\" text-align:left; font-weight: bold;\" id=\"v_subtotal_nota\"></div>,#cspan", ["text-align:right;", "text-align:right;", "text-align:right;", "text-align:right;", "text-align:right;"]);
            grid.attachFooter("<div>IGV</div>,#cspan,#cspan,#cspan,#cspan,#cspan,#cspan,#cspan,<div style=\"  text-align:left; font-weight: bold;\" id=\"v_igv_nota\"></div>,#cspan", ["text-align:right;", "text-align:right;", "text-align:right;", "text-align:right;", "text-align:right;"]);
            grid.attachFooter("<div>TOTAL</div>,#cspan,#cspan,#cspan,#cspan,#cspan,#cspan,#cspan,<div style=\" text-align:left; font-weight: bold;\" id=\"v_total_nota\"></div>,#cspan", ["text-align:right;", "text-align:right;", "text-align:right;", "text-align:right;", "text-align:right;"]);
            grid.enableEditEvents(true, false, true);
            grid.setCellTextStyle("row1", 0, "color:red;border:1px solid gray;");
            grid.init();
            layout.progressOn();
            grid.load(BASE_URL + 'VT010124/' + router + '/' + doc + '/' + usrJson.empresa, function () { layout.progressOff(); });
            grid.attachEvent("onEditCell", function (stage, rId, cInd, nValue, oValue) {
                if (stage === 2) {
                    oValue = grid.cells(rId, 5).getValue();
                    if (parseFloat(nValue) <= parseFloat(oValue)) {
                        calculateFooterValues_nota();
                        return true;
                    } else {
                        dhtmlx.message({ type: "error", text: "El valor ingresado debe ser menor o igual al valor comprado , Por favor", expire: 5000 });
                        return false;
                    }
                }
            });
            break;
        case 'gridprenc':
            grid.setHeader(",DOC,GUIA,COD.PROD,PROD. GUIA.DEVOLUCION,LOTE,TIPO,DIFF,CANT,PREC.UNI,MONTO,FECHA,ALM", null, ["text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;"]);
            grid.setColTypes("img,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro");
            grid.setInitWidthsP("10,10,10,10,80,10,10,10,10,10,12,12,12");
            grid.setColAlign("center,right,left,right,left,left,left,right,right,right,right,right,right");
            grid.setColSorting("str,str,str,str,str,str,str,str,str,str,str,str,str");
            grid.enableMultiline(true);
            grid.setIconsPath("/assets/images/icons/iconsjhon/");
            grid.setColumnHidden(1, true), grid.setColumnHidden(2, true), grid.setColumnHidden(3, true), grid.setColumnHidden(5, true), grid.setColumnHidden(6, true), grid.setColumnHidden(7, true), grid.setColumnHidden(9, true), grid.setColumnHidden(10, true), grid.setColumnHidden(11, true), grid.setColumnHidden(12, true);
            grid.init();
            break;

    }


}

function calculateFooterValues_nota() {
    subtotal_n = '0.0', v_igv_no = '0.0', total_n = '0.0';
    total_n = sumColumndecimal2(9, 'dhxGrid_Ddet', 2);//180 total
    subtotal_n = parseFloat(parseFloat(total_n) / 1.18).toFixed(2); //subtotal
    v_igv_no = parseFloat(total_n - subtotal_n).toFixed(2);
    var v_subtotal_nota = document.getElementById("v_subtotal_nota");
    v_subtotal_nota.innerHTML = subtotal_n;
    var v_igv_nota = document.getElementById("v_igv_nota");
    v_igv_nota.innerHTML = v_igv_no;
    var v_total_nota = document.getElementById("v_total_nota");
    v_total_nota.innerHTML = total_n;
    total_n > 0 ? form_Dev.enableItem('b_savedev') : form_Dev.disableItem('b_savedev');
    return true;
}

function carga_cambio(doc) {
   
            let dhxWcvedv = new dhtmlXWindows();
            WindowDventa = dhxWcvedv.createWindow('w_cambiodev', 0, 0, 800, 520);
            WindowDventa.center(), WindowDventa.setText('Cambio del Pedido NRO ' + doc);
            WindowDventa.setModal(true), WindowDventa.keepInViewport(true);
            Layout1 = WindowDventa.attachLayout("1C");
            form_Dev = Layout1.cells("a").attachForm(form_deva11);
            Layout1.cells('a').hideHeader();
            form_Dev.setItemValue('num_pedido', doc);//, form_Dev.reloadOptions('_moti_guia', BASE_URL + 'VT010124/motidevo/'), form_Dev.reloadOptions('st_almac', BASE_URL + 'VT010124/list_almacen/' + usrJson.empresa);
            form_Dev.attachEvent("onButtonClick", async function (name) {
                switch (name) {
                    case 'b_canceldev':
                        let params = { x_empresa: usrJson.empresa, x_pedido:doc };
                        Swal.fire({
                            title: 'Esta acción termina el proceso de Cambio, el pedido retorna a su estado anterior...',
                            showCancelButton: true, confirmButtonText: 'Terminar', cancelButtonText: 'Seguir cambiando',
                        }).then(async (result) => {/* Read more about isConfirmed, isDenied below */
                            if (result.dismiss != 'cancel') {
                                let resultado = await $.ajax({ url: '/api/VT010124/terminar-gdvl', method: 'post', data: params, dataType: 'json' });
                                console.log(resultado);
                                resultado.result[0] == 'OK' ? Swal.fire('Bien!', 'Cambios terminado.', 'success') : Swal.fire('Alerta!', 'Ocurrió un error', 'error');
                                dhxWcvedv.window("w_cambiodev").close();
                            }
                        });
                        break;
                    case 'b_cambio':
                        dhxWlprec = new dhtmlXWindows();
                        WindowLprec = dhxWlprec.createWindow('w_cambio1', 0, 0, 800, 520);
                        WindowLprec.center(), WindowLprec.setText('Lista de Precios');
                        WindowLprec.setModal(true), WindowLprec.keepInViewport(true);
                        Layoutlprecw = WindowLprec.attachLayout("1C");
                        Layoutlprecw.cells('a').hideHeader();
                        dhxGrid_lprec = Layoutlprecw.cells('a').attachGrid();
                        grillaDetalle(dhxGrid_lprec, Layoutlprecw.cells('a'), doc, 'g_listcamb');

                        break;
                }
            });
            dhxGrid_Cambio = new dhtmlXGridObject(form_Dev.getContainer("myGridcambio"));//Layout1.cells("a").attachGrid();
            grillaDetalle(dhxGrid_Cambio, Layout1.cells('a'), doc, 'gricambiodet');
      //  }
    //});

}

async function grillaDetalle(grid, layout, doc, router) {
    switch (router) {
        case 'g_listcamb':
            grid.setHeader(",COD,BARRAS,NOMBRE,UNID,CANTIDAD,PRECIO", null, ["text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;"]);
            grid.setColTypes("img,ro,ro,ro,ro,ro,ro");
            grid.setInitWidthsP("4,10,10,40,10,10,10");
            grid.setColAlign("center,center,left,left,left,left,left");
            grid.setColSorting("str,str,str,str,str,str,str");
            grid.init();
            grid.setIconsPath("/assets/images/icons/iconsjhon/");
            layout.progressOn();
            let params = { xemp: usrJson.empresa, xdoc: doc };
            let rs = await $.ajax({ url: '/api/VT010124/data-pedido', method: 'post', data: params, dataType: 'json' });
            grid.load(BASE_URL + 'VT010124/' + router + '/' + usrJson.empresa + '/' + doc + '/' + rs.result.x_ser_list + '/' + rs.result.x_list_prec + '/' + rs.result.x_periodo + '/' + rs.result.x_ptovta + '/' + prod_prec, function () { layout.progressOff(); });
            grid.attachEvent("onRowSelect", async function (rowId, colId) {

                if (colId == 0) {
                    nuevocambio = grid.cells(rowId, 3).getValue();
                    let cod_new = grid.cells(rowId, 1).getValue();
                    let cadenaold = cod_old + '@' + st_tip_vta_old + '@' + dif_old;
                    let cadenanew = cod_new + '@' + 'L' + '@' + '1';
                    let xobscambio = form_Dev.getItemValue('_obs_cambio');
                    Swal.fire({
                        title: '<font style=" font-size:15px;"> ¿ Desea cambiar : <font style="color:red ;">' + nomolprod + '</font>  por <font style="color:blue ;"> ' + nuevocambio + '</font> ?</font>',
                        showCancelButton: true, confirmButtonText: 'Aceptar', cancelButtonText: 'Cancelar',
                    }).then(async (result) => {/* Read more about isConfirmed, isDenied below */
                        if (result.dismiss != 'cancel') {
                            let params = { x_empresa: usrJson.empresa, xprodold: cadenaold, xprodnew: cadenanew, xpedido: doc, xmotivo: xobscambio };
                            let resultado;
                            resultado = await $.ajax({ url: '/api/VT010124/save-cambio', method: 'post', data: params, dataType: 'json' });
                            // console.log(result);
                            if (resultado.result.x_de_result == 'OK') {
                                Swal.fire('Cambio correcto!', '', 'Conforme')
                            } else {
                                Swal.fire('Cambio no registrado', '', resultado.result.x_de_result)
                            }
                            dhxWlprec.window('w_cambio').close();
                            Layout1.cells('a').progressOn();
                            dhxGrid_Cambio.clearAll();
                            dhxGrid_Cambio.load(BASE_URL + 'VT010124/' + 'gricambiodet' + '/' + doc + '/' + usrJson.empresa, function () { Layout1.cells('a').progressOff(); });
                            /// grillaDetalle(dhxGrid_Cambio, Layout1.cells('a'), doc, 'gricambiodet');
                        }  
                    });
                }

            });
            break;
        case 'gricambiodet':
            grid.setHeader("ITEM,CODIGO,NOMBRE,CANTIDAD,TIPOVTA,PRECIO,IGV,TOTAL,DIFE", null, ["text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;"]);
            grid.setColTypes("ro,ro,ro,ro,ro,ro,ro,ro,ro");
            grid.setInitWidthsP("8,15,40,10,10,10,10,10,10");
            grid.setColAlign("center,left,left,left,left,left,left,left,left");
            grid.setColSorting("str,str,str,str,str,str,str,str,str");
            grid.setColumnHidden(8, true); // grid.enableMultiline(true);
            //grid.setColumnHidden(0, true), grid.setColumnHidden(1, true), grid.setColumnHidden(2, true), grid.setColumnHidden(4, true), grid.setColumnHidden(5, true), grid.setColumnHidden(6, true), grid.setColumnHidden(8, true), grid.setColumnHidden(9, true), grid.setColumnHidden(10, true), grid.setColumnHidden(11, true);
            grid.init();
            layout.progressOn(), prod_prec = 0;
            grid.load(BASE_URL + 'VT010124/' + router + '/' + doc + '/' + usrJson.empresa, function () { layout.progressOff(); });
            grid.attachEvent("onRowSelect", function (rowId, colId) {
                prod_prec = grid.cells(rowId, 5).getValue(), nomolprod = grid.cells(rowId, 2).getValue(),
                    cod_old = grid.cells(rowId, 1).getValue(), st_tip_vta_old = grid.cells(rowId, 4).getValue(), dif_old = grid.cells(rowId, 8).getValue();
            });

            break;
        case 'gdvridet':
            grid.setHeader("DOC,GUIA,COD.PROD,PROD.GUIA.DEVOLUCION,LOTE,TIPO,DIFF,CANT,PREC.UNI,MONTO,FECHA,ALM", null, ["text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;"]);
            grid.setColTypes("ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro");
            grid.setInitWidthsP("10,10,10,80,10,10,10,20,10,12,12,12");
            grid.setColAlign("right,left,right,left,left,left,right,right,right,right,right,right");
            grid.setColSorting("str,str,str,str,str,str,str,str,str,str,str,str");
            grid.enableMultiline(true);
            grid.setColumnHidden(0, true), grid.setColumnHidden(1, true), grid.setColumnHidden(2, true), grid.setColumnHidden(4, true), grid.setColumnHidden(5, true), grid.setColumnHidden(6, true), grid.setColumnHidden(8, true), grid.setColumnHidden(9, true), grid.setColumnHidden(10, true), grid.setColumnHidden(11, true);
            grid.init();
            layout.progressOn();
            grid.load(BASE_URL + 'VT010124/' + router + '/' + doc + '/' + usrJson.empresa, function () { layout.progressOff(); });
            break;
        case 'gridet':
            grid.setHeader("COD.PRODUCTO,NOMBRE PRODUCTO,LOTE,DIFER,TPOVTA,CANT,PRE.UNI,TOT.DOC,CANT.PRENC,TOT.PRENC", null, ["text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;"]);
            grid.setColTypes("ro,ro,ro,ro,ro,ron,ron,ron,edn,ron[=(c7/c5)*c8]");
            grid.setInitWidthsP("10,55,10,10,10,10,10,12,12,12");
            grid.setColAlign("right,left,left,left,right,right,right,right,right,right");
            grid.setColSorting("str,str,str,str,str,int,int,int,int,int");
            grid.setColumnColor(",,,,,,,,orange,");
            grid.setNumberFormat("0,000.00", 7), grid.setNumberFormat("0,000.00", 9);
            grid.setColumnHidden(0, true), grid.setColumnHidden(2, true), grid.setColumnHidden(3, true), grid.setColumnHidden(4, true), grid.setColumnHidden(6, true);
            grid.attachFooter("<div>SUB TOTAL</div>,#cspan,#cspan,#cspan,#cspan,#cspan,#cspan,#cspan,<div style=\" text-align:left; font-weight: bold;\" id=\"v_subtotal_nota\"></div>,#cspan", ["text-align:right;", "text-align:right;", "text-align:right;", "text-align:right;", "text-align:right;"]);
            grid.attachFooter("<div>IGV</div>,#cspan,#cspan,#cspan,#cspan,#cspan,#cspan,#cspan,<div style=\"  text-align:left; font-weight: bold;\" id=\"v_igv_nota\"></div>,#cspan", ["text-align:right;", "text-align:right;", "text-align:right;", "text-align:right;", "text-align:right;"]);
            grid.attachFooter("<div>TOTAL</div>,#cspan,#cspan,#cspan,#cspan,#cspan,#cspan,#cspan,<div style=\" text-align:left; font-weight: bold;\" id=\"v_total_nota\"></div>,#cspan", ["text-align:right;", "text-align:right;", "text-align:right;", "text-align:right;", "text-align:right;"]);
            grid.enableEditEvents(true, false, true);
            grid.setCellTextStyle("row1", 0, "color:red;border:1px solid gray;");
            grid.init();
            layout.progressOn();
            grid.load(BASE_URL + 'VT010124/' + router + '/' + doc + '/' + usrJson.empresa, function () { layout.progressOff(); });
            grid.attachEvent("onEditCell", function (stage, rId, cInd, nValue, oValue) {
                if (stage === 2) {
                    oValue = grid.cells(rId, 5).getValue();
                    if (parseFloat(nValue) <= parseFloat(oValue)) {
                        calculateFooterValues_nota();
                        return true;
                    } else {
                        dhtmlx.message({ type: "error", text: "El valor ingresado debe ser menor o igual al valor comprado , Por favor", expire: 5000 });
                        return false;
                    }
                }
            });
            break;
        case 'gridprenc':
            grid.setHeader(",DOC,GUIA,COD.PROD,PROD. GUIA.DEVOLUCION,LOTE,TIPO,DIFF,CANT,PREC.UNI,MONTO,FECHA,ALM", null, ["text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;"]);
            grid.setColTypes("img,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro");
            grid.setInitWidthsP("10,10,10,10,80,10,10,10,10,10,12,12,12");
            grid.setColAlign("center,right,left,right,left,left,left,right,right,right,right,right,right");
            grid.setColSorting("str,str,str,str,str,str,str,str,str,str,str,str,str");
            grid.enableMultiline(true);
            grid.setIconsPath("/assets/images/icons/iconsjhon/");
            grid.setColumnHidden(1, true), grid.setColumnHidden(2, true), grid.setColumnHidden(3, true), grid.setColumnHidden(5, true), grid.setColumnHidden(6, true), grid.setColumnHidden(7, true), grid.setColumnHidden(9, true), grid.setColumnHidden(10, true), grid.setColumnHidden(11, true), grid.setColumnHidden(12, true);
            grid.init();
            break;

    }


}
function sumColumndecimal2(ind, grid, dec) {
    var outd = 0;
    var example = dhxGrid_Ddet.getAllItemIds();
    var numbers = example.split(',');
    var i = 0;
    while (i < numbers.length) {
        outd += parseFloat(dhxGrid_Ddet.cells(numbers[i], ind).getValue());
        i++;
    }
    return outd.toFixed(dec);
}
Math.round10 = function (value, exp) {
    return decimalAdjust('round', value, exp);
};
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







