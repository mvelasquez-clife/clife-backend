var permiso_cataedit,html_general,myFormdatos_nso_esp,mainLayout_especificacion,myGrid_nso,myToolbar_nso,myGrid_ver,Winid_,Wind_,myToolbar_ver,tipo_doc,mainLayout_formula,tabbar,myToolbardatos_detalle,maingrid_search,myFormdatos_search,mainLayout_load,myToolbardatos_search,mainLayout_search,myGrid_lista,Wind_,maingrid,myFormdatos_prod,mainLayout_product,myFormdatos,myToolbardatos_register,mainLayout,myForm,myToolbardatos,mainLayout_register;
//myGrid_dev,win_devol,codigo_producto,dhxCombo,codigo_requerimiento,mainGrid_prod,mainGrid_det,cod_reque,permiso_aprobar,almacen_rev,desde,hasta,pendiente,rech,atend,mainGrid_cab,myFormdatos_rev,layoutReq_prin,periodo_siste,periodo_fun,var_guardar,cod_centro_costo,cod_entidad,cod_solicita,cod_zona_come,cod_fza_venta,cad_prod_ubi_var,cad_cod_prod_var,cad_cant_soli_var,cad_lote_prod_var,cant_filas_l_total,cad_prod_ubi,cad_cod_prod,cad_cant_soli,cad_lote_prod,cant_filas_prod,reque_temporal,layoutRev,myToolbardatos_rev,mainLayout_rev,win_dire,myToolbar_a,co_cata_enti,prcantidad,prstock,myGrid_prod,myFormdatos,layoutReq,mainGrid_,val_co_ingreo,personal,ccosto,raz_soc_cata,mainToolbar,cod_almacen,codprod,nomprod,ubiprod,ume,saldprod,loteprod,cant_filas_l;
permiso_cataedit = 'E';
Inicio = () => {
    mainLayout = new dhtmlXLayoutObject(document.body, '1C'); 
    mainLayout.cells('a').hideHeader();
    // mainLayout.setSeparatorSize(0, 0);
    // myForm = mainLayout.cells('a').attachForm();
    myToolbardatos = mainLayout.cells('a').attachToolbar();
    myToolbardatos.setIconsPath('/assets/images/icons/');
    myToolbardatos.addButton('__register',null,'Registrar Notificación Sanitaria',"ic-register.png","ic-like-block.png")
    myToolbardatos.addButton('__search',null,'Consultar Notificación Sanitaria',"ic-buscar.png","ic-dislike-block.png")
    myToolbardatos.attachEvent('onClick', OnClickmenu);
    myToolbardatos.setIconSize(48);
    mainLayout_register = mainLayout.cells('a').attachLayout('2U');
    mainLayout_register.cells('a').setText('Nuevo registro');
    myToolbardatos_register = mainLayout_register.cells('a').attachToolbar(base_tollbar_nvo);
    myToolbardatos_register.attachEvent('onClick', OnClicktoolbar);
    myToolbardatos_register.setIconSize(48);
    myFormdatos = mainLayout_register.cells('a').attachForm(f_nuevo_registro);
    mainLayout_register.cells('a').setHeight(400);
    mainLayout_register.cells('a').setWidth(450);
    mainLayout_product = mainLayout_register.cells('b').attachLayout('3E');
    mainLayout_product.cells('a').setText('Buscar Producto');
    mainLayout_product.cells('b').setText('Resultado');
    mainLayout_product.cells('c').setText('Registrar Producto');
    myFormdatos_prod = mainLayout_product.cells('a').attachForm(f_buscar_prod);
    mainLayout_product.cells('a').setHeight(235);
    maingrid = mainLayout_product.cells('b').attachGrid(); 
    mainToolbar = mainLayout_product.cells('b').attachToolbar();
    mainToolbar.setIconsPath('/assets/images/icons/');
    maingrid.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    maingrid.setHeader(',CÓDIGO PRODUCTO,DESCRIPCIÓN,MARCA,SUBMARCA,CLASE,FAMILIA,SUBFAMILIA');
    maingrid.setInitWidths('30,150,400,100,100,100,100,100');
    maingrid.setColAlign('left,left,left,left,left,left,left,left');
    maingrid.setColTypes('ch,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,edn'); 
    maingrid.setColumnIds("che,cod_prod,desc,mar,sbmr,cla,fam,sbfa");   
    maingrid.attachHeader("&nbsp,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter");  
    mainToolbar.addButton('agregar',null,'<b>Agregar</b>',"ic-add2.png","")
    mainToolbar.addButton('marcar',null,'<b>Marcar</b>',"ic-marcar.png","");
    mainToolbar.addButton('desmarcar',null,'<b>Desmarcar</b>',"ic-desmarcar.png","");
    mainToolbar.addButton('ver',null,'<b>Ver lista</b>',"ic-look.png","");
    mainToolbar.attachEvent('onClick', mainToolbarOnClick);
    mainToolbar.setIconSize(30);
    maingrid.init();
    mainLayout_product.cells('c').collapse();
    myToolbarlista = mainLayout_product.cells('c').attachToolbar();
    myToolbarlista.setIconsPath('/assets/images/icons/');
    myToolbarlista.addButton('b_close', 'left', '<i class="far fa-window-close"></i>CERRAR ', null, null);
    myToolbarlista.addButton('eliminar',null,'Eliminar',"ic-delete.png","");
    myToolbarlista.addButton('desmarcar',null,'<b>Desmarcar</b>',"ic-desmarcar.png","");
    myToolbarlista.addButton('marcar',null,'<b>Marcar</b>',"ic-marcar.png","");
    myToolbarlista.attachEvent('onClick', OnclickLista);
    myGrid_lista = mainLayout_product.cells('c').attachGrid();
    myGrid_lista.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    myGrid_lista.setHeader(',CÓDIGO PRODUCTO,DESCRIPCIÓN,MARCA,SUBMARCA,CLASE,FAMILIA,SUBFAMILIA');
    myGrid_lista.setInitWidths('30,150,400,100,100,100,100,100');
    myGrid_lista.setColAlign('left,left,left,left,left,left,left,left');
    myGrid_lista.setColTypes('ch,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,edn'); 
    myGrid_lista.setColumnIds("chk,cod_list,desc_list,fom_list");   
    myGrid_lista.init();
    
    myFormdatos_prod.attachEvent("onButtonClick", function (id_ind){
        buscar = myFormdatos_prod.getItemValue('_drt_buscador').length>0 ? myFormdatos_prod.getItemValue('_drt_buscador') : 'lkjh';
        co_clase = myFormdatos_prod.getItemValue('_drt_clase') == '-' ? '-' : myFormdatos_prod.getItemValue('_drt_clase');
        co_familia = myFormdatos_prod.getItemValue('_drt_familia');
        co_subfamilia = myFormdatos_prod.getItemValue('_drt_subfamilia');
        co_marca = myFormdatos_prod.getItemValue('_drt_marca') == '0' ? '0' : myFormdatos_prod.getItemValue('_drt_marca');
        co_submarca = myFormdatos_prod.getItemValue('_drt_submarca');

        if(co_familia=='-'||co_familia=='-1'){
            co_familia = '-';
        }
        if(co_subfamilia=='-'||co_subfamilia=='-1'){
            co_subfamilia = '-';
        }
        if(co_submarca=='0'||co_submarca=='-1'){
            co_submarca = '0';
        }
        cargarProductos(buscar,co_clase,co_familia,co_subfamilia,co_marca,co_submarca);
    });

    myFormdatos_prod.attachEvent("onChange", async (name) => {
        switch (name) {
            case '_drt_clase':
                cargarFamilia();
                break;
            case '_drt_familia' :
                cargarSubfamilia();
                break;
            case '_drt_marca' :
                cargarSubmarca();
                break;
            default:
                null;
                break;
        }
    });
},

Buscar = () => {
    mainLayout_search = new dhtmlXLayoutObject(document.body, '1C'); 
    myToolbardatos_search = mainLayout_search.cells('a').attachToolbar();
    myToolbardatos_search.setIconsPath('/assets/images/icons/');
    myToolbardatos_search.addButton('__register',null,'Registrar Notificación Sanitaria',"ic-register.png","ic-like-block.png")
    myToolbardatos_search.addButton('__search',null,'Consultar Notificación Sanitaria',"ic-buscar.png","ic-dislike-block.png")
    myToolbardatos_search.setIconSize(48);
    myToolbardatos_search.attachEvent('onClick', OnClickmenusearch);
    mainLayout_load = mainLayout_search.cells('a').attachLayout('3J');
    mainLayout_detalle_sub = mainLayout_load.cells('b').attachLayout('2E');
    mainLayout_load.cells('a').setText('Ingresa NSO');
    mainLayout_load.cells('c').setText('Notificaciones registradas');
    mainLayout_detalle_sub.cells('a').setText('Detalle');
    myFormdatos_search = mainLayout_load.cells('a').attachForm(f_consulta_notif);
    mainLayout_load.cells('a').setHeight(100);
    mainLayout_load.cells('a').setWidth(600);
    maingrid_search = mainLayout_load.cells('c').attachGrid(); 
    maingrid_search.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    maingrid_search.setHeader('CÓDIGO NSO,NOMBRE PRODUCTO,ESTADO,FE_INICIO_VIGENCIA,FE_TERMINO_VIGENCIA,NRO REGISTRO');
    maingrid_search.setInitWidths('200,300,120,100,100,0,0');
    maingrid_search.setColAlign('left,left,left,left,left,left,left'); 
    maingrid_search.setColumnIds("cod_nso,desc,estado,fec_ini,fec_fin,nreg");   
    maingrid_search.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,#text_filter");
    maingrid_search.init();  
    myToolbardatos_detalle = mainLayout_detalle_sub.cells('a').attachToolbar();
    mainLayout_detalle_sub.cells('b').hideHeader();
    myToolbardatos_detalle.setIconsPath('/assets/images/icons/');
    myToolbardatos_detalle.addButton('ver',null,'<b>Ver lista</b>',"ic-look.png","");  
    myToolbardatos_detalle.addButton('file',null,'<b>Ver documentos</b>',"ic-file.png","");  
    myToolbardatos_detalle.attachEvent('onClick', detalleOnClick);  
    myFormdatos_search.attachEvent("onButtonClick", function (id_ind){
        buscar = myFormdatos_search.getItemValue('_drt_buscarnso').length>0 ? myFormdatos_search.getItemValue('_drt_buscarnso') : '|';
        cargarnso(buscar);
    });
    var html = "";  
    html+='    <div class="form-group row mb-2">'
    html+='        <div class="col-sm-10 offset-lg-2">'
    html+='        <br>&nbsp&nbsp<button type="button" id="btn-loadfile" class="btnver btnbtnver-labeled btn-loadfile"><span class="btnver-label"><i class="fas fa-eye"></i></span>Ver documento</button>'
    // html+='            <a id="btn-loadfile" href="#" class="btn btn-sm btn-primary disabled"><i class="fa fa-upload"></i>Ver documento</a>'
    html+='        </div>'
    html+='   <div class="form-group row mb-2">'
    html+='   <br><a style="font: 400 15px Arial;">&nbsp&nbsp<i>Adjunta un documento<i><a>'
    html+='   </div>'  
    html+='   <div class="form-group row mb-2">'
    html+='   <input id="form-tipodoc" style="display: none;" class="col-sm-2 col-form-label" value ="?">'
    html+='   </div>'  
    html+='   <div class="form-group row mb-2">'
    html+='   &nbsp<input id="form-nsoc" style="display: none;" class="col-sm-2 col-form-label" value ="nsoc|">'
    html+='   </div>' 
    html+=' <div class="form-group row mb-2"><label for="form-archivos" class="col-sm-2 subir"><span class="btn-label2"><i class="fas fa-hand-pointer txtrblack"></i></span>Seleccionar archivo</label>&nbsp&nbsp&nbsp&nbsp&nbsp'
    html+='        &nbsp<button type="button" id="btn-upload" class="btn btn-labeled btn-upload"><span class="btn-label"><i class="fas fa-cloud-upload-alt"></i></span> Subir archivo</button>'
    html+='        <div class="col-sm-10">'
    html+='            <div class="custom-file">'
    html+='                <input type="file" style="display: none;" class="subir" id="form-archivos" accept="application/pdf" >'
    // html+='                &nbsp<label class="custom-file-label" for="form-archivos" data-browse="Buscar">No ha seleccionado archivos para subir</label>'
    html+='            </div>'
    html+='        </div>'
    html+='    </div>'
    html+='    <div class="form-group row mb-0">'
    html+='        <div class="col-sm-10 offset-lg-2">'
    html+='            <div  id="doc-container"></div>'
    html+='        </div>'
    html+='   </div>'
    html+='    </div> <script>'
    html+='            $(_ => {'
    html+='            console.log("sss");'
    html+='            $("#btn-upload").on("click", SubirArchivos);'
    html+='            $("#btn-loadfile").on("click", VerArchivo);'
    html+='            $("#form-archivos").on("change", SeleccionarArchivos);'
    html+='        }); </script>'
    html_general = html;
    maingrid_search.attachEvent("onRowSelect", function (id, ind) {  
        mainLayout_detalle_sub.cells('b').setText("");
        mainLayout_detalle_sub.cells('b').collapse();
        data = maingrid_search.getRowData(maingrid_search.getSelectedRowId())   
        console.log(data);
        codigo = data.cod_nso;
        nombre = data.desc;
        estado = data.estado;
        fecha_inicio= data.fec_ini;
        fecha_fin= data.fec_fin;        
        nregistro = data.nreg;
        myFormdatos_nso = mainLayout_detalle_sub.cells("a").attachForm(f_rev_nso);
        myFormdatos_nso.setItemValue('_drt_nrosoc',codigo);
        myFormdatos_nso.setItemValue('_drt_nombre',nombre);
        myFormdatos_nso.setItemValue('_drt_estado',estado);
        myFormdatos_nso.setItemValue('_drt_fechadesde',fecha_inicio);
        myFormdatos_nso.setItemValue('_drt_fechahasta',fecha_fin);
        myFormdatos_nso.setItemValue('_drt_nroregistro',nregistro);
        tabbar = mainLayout_detalle_sub.cells('b').attachTabbar();
        tabbar.addTab('s_formula', 'FÓRMULA', null, null, true);
        tabbar.addTab('s_especificaciones', 'ESPECIFICACIONES', null, null, false);
        tabbar.addTab('s_conreque', 'DOCUMENTO 3', null, null, false);
        tabbar.addTab('s_revdevol', 'DOCUMENTO 4', null, null, false);  
        tabbar. attachEvent ( "onSelect" , doOnSelect ); 
        mainLayout_formula= tabbar.cells("s_formula").attachLayout('1C');
        mainLayout_especificacion= tabbar.cells("s_especificaciones").attachLayout('1C'); 
        var nso = myFormdatos_nso.getItemValue('_drt_nrosoc');
        // html = html.replace('?','FORMULA');
        // html = html.replace('nsoc|',nso).replace('?','FORMULA');
        myFormdatos_nso_det = mainLayout_formula.cells("a").attachHTMLString(html_general.replace('nsoc|',nso).replace('?','FORMULA'));
        mainLayout_formula.cells('a').setText('Archivos');
        myFormdatos_nso_esp = mainLayout_especificacion.cells("a").attachHTMLString(html_general.replace('nsoc|',nso).replace('?','ESPECIFICACIONES'));  
        mainLayout_especificacion.cells('a').setText('Archivos');
    });

},

doOnSelect= async (id) => {
    var nso = myFormdatos_nso.getItemValue('_drt_nrosoc');
    switch (id) {
        case 's_formula':      
                myFormdatos_nso_esp = mainLayout_especificacion.cells("a").attachHTMLString("");    
                mainLayout_formula= tabbar.cells("s_formula").attachLayout('1C'); 
                myFormdatos_nso_det = mainLayout_formula.cells("a").attachHTMLString(html_general.replace('nsoc|',nso).replace('?','FORMULA'));
                mainLayout_formula.cells('a').setText('Archivos');
            break;
        case 's_especificaciones':
                myFormdatos_nso_det = mainLayout_formula.cells("a").attachHTMLString("");
                mainLayout_especificacion= tabbar.cells("s_especificaciones").attachLayout('1C'); 
                myFormdatos_nso_esp = mainLayout_especificacion.cells("a").attachHTMLString(html_general.replace('nsoc|',nso).replace('?','ESPECIFICACIONES'));  
                mainLayout_especificacion.cells('a').setText('Archivos');
                // console.log(html.replace('nsoc|',nso).replace('?','ESPECIFICACIONES'));
            break;
        default:
            null;
            break;
    }
};

buscarnotificacion = async (name) => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbusq", 0, 0, 800, 500);
    Wind_.window("wbusq").hideHeader();
    Wind_.window("wbusq").setModal(true);
    Wind_.window("wbusq").denyResize();
    Wind_.window("wbusq").center();
    myToolbar_nso = Wind_.window("wbusq").attachToolbar();
    myToolbar_nso.addButton('b_close', null, '<i class="far fa-window-close txtred"></i> CERRAR ', null, null);
    myToolbar_nso.attachEvent("onClick", (id) => {
        (id === 'b_close') ? Wind_.window("wbusq").close() : console.log('hola');
    });
    myGrid_nso = Winid_.attachGrid();
    myGrid_nso.setHeader('Nro NSO,Descripción,Estado,Inicio Vigenia, Fin Vigencia,Forma Cosmética,Nro Registro');
    myGrid_nso.setInitWidthsP('30,30,20,20,20,30,0');
    myGrid_nso.setColTypes('ro,ro,ro,ro,ro,ro,ro');
    myGrid_nso.setColumnIds("nsoc,desc,estado,inicio,fin,fcos,nreg");
    myGrid_nso.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter");
    myGrid_nso.clearAll();
    cargarnsogeneral(Wind_,'|');
    myGrid_nso.init();
    myGrid_nso.attachEvent("onRowSelect", function (id, ind) {
        data = myGrid_nso.getRowData(myGrid_nso.getSelectedRowId())
        cod = data.nsoc;
        desc = data.desc;
        estado = data.estado;
        inicio = data.inicio;
        fin = data.fin;
        res = data.res;
        fcos = data.fcos
        nregistro = data.nreg;
        console.log(data);
        myFormdatos.setItemValue('_drt_nrosoc',cod);
        myFormdatos.setItemValue('_drt_nombre',desc);
        myFormdatos.setItemValue('_drt_fechadesde',inicio);
        myFormdatos.setItemValue('_drt_fechahasta',fin);
        myFormdatos.setItemValue('_drt_nroregistro',nregistro);
        myFormdatos.setItemValue('_drt_resumen',fcos);
        cargarProductosnsogeneral(nregistro);
        Wind_.window("wbusq").close();
    });
};

verProductosnso = async (name) => {
    var nso = myFormdatos_nso.getItemValue('_drt_nroregistro');
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbusq", 0, 0, 800, 500);
    Wind_.window("wbusq").hideHeader();
    Wind_.window("wbusq").setModal(true);
    Wind_.window("wbusq").denyResize();
    Wind_.window("wbusq").center();
    myToolbar_ver = Wind_.window("wbusq").attachToolbar();
    myToolbar_ver.addButton('b_close', null, '<i class="far fa-window-close txtred"></i> CERRAR ', null, null);
    myToolbar_ver.attachEvent("onClick", (id) => {
        (id === 'b_close') ? Wind_.window("wbusq").close() : cargarProductosnso(Wind_,nso);
    });
    // myToolbar_ver.attachEvent("onEnter", (id) => {
    //     cargarListaEntidad(Wind_, myToolbar_ver.getValue('in_busq').toUpperCase());
    // });
    myGrid_ver = Winid_.attachGrid();
    myGrid_ver.setHeader(',CÓDIGO PRODUCTO,DESCRIPCIÓN,MARCA,SUBMARCA,CLASE,FAMILIA,SUBFAMILIA');
    myGrid_ver.setInitWidths('0,150,400,100,100,100,100,100');
    myGrid_ver.setColAlign('left,left,left,left,left,left,left,left');
    myGrid_ver.setColTypes('rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,edn'); 
    myGrid_ver.setColumnIds("chh,cod_prod,desc,mar,sbmr,cla,fam,sbfa");   
    myGrid_ver.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter");
    myGrid_ver.clearAll();
    cargarProductosnso(Wind_,nso);
    myGrid_ver.init();
};

VerArchivo = async e => {
    var tipodoc = document.getElementById('form-tipodoc').value;
    var nsoc = myFormdatos_nso.getItemValue('_drt_nrosoc');
    console.log(tipodoc,nsoc);
    const params = {
        tipodoc :  tipodoc,
        nsoc : nsoc
    };
    $.post(BASE_URL + 'PO010208/ver-pdf/', params, function (res) {
        console.log(res);        
        if (res.state=='success'){
        } else {
            Swal.fire({ type: 'error', title: 'Error..', text: 'El archivo no existe :' + res.message });
        }
    } , 'json');

},

OnClicktoolbar= async (id) => {
    switch (id) {
        case '__save':
        var nsoc = myFormdatos.getItemValue('_drt_nrosoc');
        var fecha_ini = myFormdatos.getItemValue('_drt_fechadesde').toLocaleDateString().replace('/', '-');
        var fecha_fin = myFormdatos.getItemValue('_drt_fechahasta').toLocaleDateString().replace('/', '-');
        var nombre_nso = myFormdatos.getItemValue('_drt_nombre');
        fecha_ini = fecha_ini.replace('/', '-');
        fecha_fin = fecha_fin.replace('/', '-');        
            if(nsoc) {
                dhtmlx.confirm("¿Está seguro de guardar?", function (result) {
                    var cadena = ''
                    if (result === Boolean(true)) {
                        let  cant_filas_guardar = 0;
                        cant_filas_guardar  =myGrid_lista.getRowsNum() ;

                        if (cant_filas_guardar ==0){
                            dhtmlx.confirm("Ingresa productos", function (result) {
                                if (result === Boolean(true)) {
                                }
                            });
                        }else{
                            var cad_cod_prod = ''
                            for (let i = 1; i < cant_filas_guardar; i++) {
                                let iRowId = myGrid_lista.getRowId(i);
                                data_grabar = myGrid_lista.getRowData(iRowId);
                                cad_cod_prod += data_grabar.cod_list +'@';
                                cadena += data_grabar.cod_list+'-'+data_grabar.desc_list +'//'
                            }
                            console.log(cad_cod_prod);
                            console.log(cadena);

                            guardarnsoc(nsoc,cad_cod_prod,cadena,cant_filas_guardar-1,fecha_ini,fecha_fin,nombre_nso);
                        }

                    }
                });
            }else{
                dhtmlx.confirm("Debe llenar el formulario", function (result) {
                });
            }
            break;
        case '__edit':
            if  (permiso_cataedit != 'S'){
                var output = await IniciarFormularioSeguridad(58, mainLayout);
                if (output.result === 'S') {
                    permiso_cataedit = 'S';
                    buscarnotificacion();
                }else{
                    permiso_cataedit = 'E';
                }
           }else{
            buscarnotificacion();
           }
        break;
        default:
            null;
            break;
    }
};

guardarnsoc = (nsoc,cad_cod_prod,cadena,cant_filas_guardar,fecha_ini,fecha_fin,nombre_nso) => {
    params = {
        empresa: usrJson.empresa,
        num_registro: nsoc,
        cant_filas_prod: cant_filas_guardar,
        cadena_productos: cad_cod_prod,
        vigencia_ini:fecha_ini,
        vigencia_ter:fecha_fin,
        nombre: nombre_nso,
    };
    console.log(params);
    $.post(BASE_URL + "PO010208/grabar-nsoc", params, function (res) {
        console.log(res);
        if (res.state=='success'){
            Swal.fire('Bien!', res.message, 'success');
            // myFormdatos.setItemValue('_r_nroreque','N° '+res.message_co+ ' Del ' +periodo_fun);
            // myFormdatos.setItemValue('_drt_resumen',cadena);
        } else {
            Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se guardo el registro :' + res.message });
        }
    }, "json");
}

OnClickmenu= async (id) => {
    switch (id) {
        case '__register':
            Inicio();
            break;
        case '__search':
            Buscar();
            break;
        default:
            null;
            break;
    }
};

OnClickmenusearch= async (id) => {
    switch (id) {
        case '__register':
            Inicio();
            break;
        case '__search':
            Buscar();
            break;
        default:
            null;
            break;
    }
};
detalleOnClick= async (id) => {
    switch (id) {
        case 'ver':
        verProductosnso();
            break;
        case 'file':
        mainLayout_detalle_sub.cells('a').collapse();
        break;
        default:
            null;
            break;
    }
};

mainToolbarOnClick= async (id) => {
    switch (id) {
        case 'ver':
            mainLayout_product.cells('b').collapse();
            mainLayout_product.cells('c').expand();
            break;
        case 'agregar':
            var cant_filas_l_total  =maingrid.getRowsNum() ;
            console.log(cant_filas_l_total);
            data = '';
            for(let i=0;i<cant_filas_l_total;i++){
                data = maingrid.getRowData(i);
                console.log(data);
                if (data.che == 1) {
                    myGrid_lista.addRow(myGrid_lista.uid(),[0,data.cod_prod,data.desc,data.desc],1);
                }
            }
            break;        
        case 'desmarcar':
            maingrid.setCheckedRows(0,0);
        break;
        case 'marcar':
            maingrid.setCheckedRows(0,1);
        break;
        default:
            null;
            break;
    }
};

OnclickLista = (id) => {
    switch (id) {
        case 'b_close':
             Wind_.window("wprod").close();
            break;  
        case 'desmarcar':
            myGrid_lista.setCheckedRows(0,0);
        break;
        case 'marcar':
            myGrid_lista.setCheckedRows(0,1);
        break;        
        default:
            null;
            break;
    }
};

// guardarnsoc

cargarFamilia = () => {
    var val_co_clase = myFormdatos_prod.getItemValue('_drt_clase');
    const params = {
        co_clase :  val_co_clase
    };
    $.post(BASE_URL + 'PO010208/mostrar-familia/', params, function (res) {
        const valor = res.data.familia;
        myFormdatos_prod.reloadOptions('_drt_familia', valor);
        myFormdatos_prod.enableItem('_drt_familia');
    } , 'json');
}

cargarSubfamilia = () => {
    var val_co_familia = myFormdatos_prod.getItemValue('_drt_familia');
    var val_co_clase = myFormdatos_prod.getItemValue('_drt_clase');
    const params = {
        co_clase :  val_co_clase,
        co_familia :  val_co_familia
    };
    $.post(BASE_URL + 'PO010208/mostrar-subfamilia/', params, function (res) {
        const valor = res.data.subfamilia;
        myFormdatos_prod.reloadOptions('_drt_subfamilia', valor);
        myFormdatos_prod.enableItem('_drt_subfamilia');
    } , 'json');
}

cargarSubmarca = () => {
    var val_co_marca = myFormdatos_prod.getItemValue('_drt_marca');
    const params = {
        co_marca :  val_co_marca
    };
    $.post(BASE_URL + 'PO010208/mostrar-submarca/', params, function (res) {
        const valor = res.data.submarca;
        myFormdatos_prod.reloadOptions('_drt_submarca', valor);
        myFormdatos_prod.enableItem('_drt_submarca');
    } , 'json');
}

cargarProductos = (buscar,co_clase,co_familia,co_subfamilia,co_marca,co_submarca) => {    
    maingrid.clearAll(); 
    mainLayout_product.cells('b').progressOn();
    maingrid.load( BASE_URL + 'PO010208/mostrar-producto/'+ buscar+'/'+co_clase+'/'+co_familia+'/'+co_subfamilia+'/'+co_marca+'/'+co_submarca).then(function (text) {
    mainLayout_product.cells('b').progressOff();
        // cant_filas_l = maingrid.getRowsNum();
    });
};

cargarProductosnsogeneral = (nso) => {   
    myGrid_lista.clearAll(); 
    mainLayout_product.cells('c').progressOn();
    myGrid_lista.load( BASE_URL + 'PO010208/mostrar-productos-nso/'+nso).then(function (text) {
        mainLayout_product.cells('c').progressOff();
    });
    mainLayout_product.cells('a').collapse();
    mainLayout_product.cells('b').collapse();
};

cargarProductosnso = (win,nso) => {   
    win.window("wbusq").progressOn(); 
    myGrid_ver.clearAll(); 
    myGrid_ver.load( BASE_URL + 'PO010208/mostrar-productos-nso/'+nso ).then(function (text) {
        win.window("wbusq").progressOff();
    });    
};

cargarnsogeneral = (win,buscar) => {    
    win.window("wbusq").progressOn();
    myGrid_nso.clearAll(); 
    myGrid_nso.load( BASE_URL + 'PO010208/mostrar-nso/'+ buscar).then(function (text) {
        win.window("wbusq").progressOff();
    });
};

cargarnso = (buscar) => {    
    maingrid_search.clearAll(); 
    mainLayout_load.cells('c').progressOn();
    maingrid_search.load( BASE_URL + 'PO010208/mostrar-nso/'+ buscar).then(function (text) {
        mainLayout_load.cells('c').progressOff();
    });
};