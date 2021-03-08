tabbarOnSelect= async (id) => {
    switch (id) {
        case 'reqmark':          
            IniciarComponentes();
            break; 
        case 'autorizar':          
            RevisarReqtos();
            break;
        case 'agregar':          
            cargarProductos();
            break;     
        default:
            null;
            break;
    }
};

IniciarComponentes = () => {
    tabbarmark = tabbar.cells("reqmark").attachLayout('1C');
    mktLayout = tabbarmark.cells('a').attachLayout('3U');
    mktLayout.cells('a').hideHeader();
    mktLayout.cells('a').setM
    mktLayout.cells('b').hideHeader();
    mktLayout.cells('c').hideHeader();
    myformkt = mktLayout.cells('a').attachForm(form_rmto_mkt);
    myfordisp = mktLayout.cells('b').attachForm(form_disp);
    mktLayout.cells('a').setWidth(1162);
    mktLayout.cells('a').setHeight(225);
    myformkt.setFontSize("11px");
    myfordisp.setFontSize("11px");
    myformkt.setItemValue('_co_solicita',usrJson.codigo);    
    cargarSecuencia();
    calcularDisp();
    const parametros = {
        usuario:usrJson.codigo,
    };
    $.post(BASE_URL + 'VT01040103/mostrar-usuario-solicita/', parametros, function (res) {
        const usuario = res.data.usuario[0];
        myformkt.setItemValue('_solicita',usuario.DE_NOMBRE_COMERCIAL);
    } , 'json');  
    myformkt.attachEvent("onButtonClick", async (name) => {
        switch (name) {
            case '__buscarsolicita':
                buscarSolicita();
                break;
            case '__buscargasto':
                buscarGasto();
                break;
            case '__buscarentidad':
                buscarEntidad();
                break;
            case '__buscardirec':
                buscarDireccion();
                break;
            default:
                null;
                break;
        }
    });
    mainGrid = mktLayout.cells('c').attachGrid();
    mainToolbar = mktLayout.cells('c').attachToolbar();
    mainToolbar.setIconsPath('/assets/images/icons/');
    mainToolbar.addButton('agregar',null,'Agregar',"ic-add.png","")
    mainToolbar.addButton('eliminar',null,'Eliminar',"ic-delete.png","")
    mainToolbar.setIconSize(400);
    mainToolbar.attachEvent('onClick', tabbarOnSelect);
    mainGrid.setHeader(',Código, Nombre Producto,U.M,P.Venta,Stock,Cant.Sol.,Total,Lote,Ubicación');
    mainGrid.setInitWidths('40,250,350,100,100,100,100,100,100,100');
    mainGrid.setColAlign('left,left,left,center,right,right,right,right,center,center');
    mainGrid.setColumnIds("chec,cod,prdes,um,pventa,stock,cant,total,pun,iun");
    mainGrid.setColTypes('ch,rotxt,rotxt,rotxt,rotxt,rotxt,edn,rotxt,rotxt,rotxt');
    mainGrid.setColumnColor(",,,,,,#E6FF33,,,");
    mainGrid.setNumberFormat("0,000.00",7,".",",");
    mainGrid.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    mainGrid.init();
    mainGrid.setSizes("8px");  
    mainGrid.attachEvent("onEnter", (id) => {
        data = mainGrid.getRowData(mainGrid.getSelectedRowId())
        cantidad = data.cant;
        pventa = data.pventa;
        total = roundTo(cantidad*pventa,2);
        var new_total = {"total":total};
        mainGrid.setRowData(id,new_total);
        // calcularTotal();
    //     if (cuali.length>0&&(cuantiuno.length>0||cuantidos.length>0)){
    //         dhtmlx.confirm("El ensayo solo puede ser cuantitativa o cualitativa", function (result) {
                
    //             var new_data_ingles = {"total":""};
    //             mainGrid.setRowData(id,total);
    //             mainGrid.setRowData(id,new_data_ingles);
    //     });
    // }
    });
}

calcularTotal = () => {
    mainGrid._in_header_stat_sum=function(tag,index,data){       
        var calck=function(){                              
            var sum=0;                                     
            this.forEachRow(function(id){                   
                sum+=this.cellById(id,index).getValue()*1;     
            })
        return this._aplNF(sum,0);
        }
        this._stat_in_header(tag,calck,index,data);            
    }
    // mainGrid.detachFootekr(0);
    mainGrid.attachFooter(",,,,,,#stat_sum,Totales,#stat_sum,,",[,,,,,,,"text-align:right;","text-align:right;",,]);
    mainGrid.init();
}
RevisarReqtos = () => {
    tabbarrev = tabbar.cells("autorizar").attachLayout('1C');
    mkt_revLayout = tabbarrev.cells('a').attachLayout('3E');
    toolbarRev = mkt_revLayout.cells('a').attachToolbar();
    toolbarRev.setIconsPath('/assets/images/icons/');
    toolbarRev.addButton('__segu',null,'Seguridad',"unlock.png","unlock.png");
    toolbarRev.addButton('__pass',null,'Aprobar',"ic-like.png","ic-like-block.png");
    toolbarRev.addButton('__fail',null,'Rechazar',"ic-dislike.png","ic-dislike-block.png");
    toolbarRev.setIconSize(32);
    // toolbarRev.attachEvent('onClick', tabbarOnSelect);
    mkt_revLayout.cells('a').hideHeader();
    mkt_revLayout.cells('b').hideHeader();
    mkt_revLayout.cells('c').hideHeader();
    myform_rev = mkt_revLayout.cells('a').attachForm(f_rev_reque);
    myform_rev.attachEvent("onButtonClick", function (id_ind){  
        desde = myform_rev.getItemValue('_r_fech_ini').toLocaleDateString().replace('/', '-'),
        hasta = myform_rev.getItemValue('_r_fech_fin').toLocaleDateString().replace('/', '-'),
        desde = desde.replace('/', '-'),
        hasta = hasta.replace('/', '-'),
        dhxCombo = myform_rev.getCombo('_estado_rev');
        var_pend = dhxCombo.getOptionByIndex(0).checked ? 'S' : 'N',
        var_rech =  dhxCombo.getOptionByIndex(1).checked ? 'S' : 'N',
        var_atend =  dhxCombo.getOptionByIndex(2).checked ? 'S' : 'N',
        cargarRequ(desde,hasta,var_pend,var_rech,var_atend);
    });
    mkt_revLayout.cells('a').setHeight(100);
    mainGrid = mkt_revLayout.cells('b').attachGrid();    
    mainGrid.setHeader('Fecha, N°Req.,Dcto Ref,OBS,Fec.Atencion,Co_Motivo,Es_recep,Co_Autoriza,Fec.Autoriza,Fe_sys,Cod.Usuario,Fh.Espera Atencion,Fh.Confirma,Co_usu_confirma,Co_entidad,Estado,Importe,St.Gene_Pedido,De_sit_req,St_Trans,Co_Almacen,Entidad, Usuario Autoriza,Usuario Registra, Entidad Solicita, Motivo,Co_Pedido,St_Pedido_gen,Des_Almacen,Des_almacen_trans,Cod Presupuesto,Centro de Costo, Nombre Presupuesto,Nombre C.Costo,Importe Req, Importe Ate');
    mainGrid.setInitWidths('100,100,0,0,50,0,0,50,50,50,50,0,0,0,100,100,100,0,0,0,0,100,200,200,200,200,100,0,200,0,50,50,100,50,50,0  ');
    mainGrid.setColAlign('left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left,left');
    mainGrid.setColumnIds("fec,req,prdes,prum,prlot,prubi,prstock,prcant,pun,iun");
    mainGrid.init();
    mainGrid.attachEvent("onRowSelect",function(){
        data = mainGrid.getRowData(mainGrid.getSelectedRowId());
        requerimiento = data.req;
        consultaDetalle(requerimiento);
    });
}


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
    periodo = yyyy+''+mm;
    periodo_form = yyyy+'-'+mm+'-'+dd;
    val_almacen = 'APT01';
    const params = {
        almacen:  val_almacen,
        empresa:  usrJson.empresa
    };
    $.post(BASE_URL + 'LO0107/mostrar-secuencia/', params, function (res) {
        const valor = res.data.almacen;
        reque_temp = valor.DE_SERIE+'-'+valor.MAX_CANT;
        myformkt.setItemValue('_r_nroreque', 'N° '+valor.DE_SERIE+'-'+valor.MAX_CANT);
    } , 'json');
    myformkt.setItemValue('_f_registro',periodo_form);
    myformkt.setItemValue('_f_entrega',periodo_form);
    myformkt.setItemValue('_periodo',periodo);
};

function roundTo(value, places){
    var power = Math.pow(10, places);
    return Math.round(value * power) / power;
}

calcularDisp = () => {
    //cargar total venta anual,titulo gratuito,saldo periodo tg
    const parametros = {
        empresa:usrJson.empresa,
    };
    $.post(BASE_URL + 'VT01040103/calcular-total-anual/', parametros, function (res) {
        const vta_anual = res.data.vta_anual[0];
        var vta_anual_tot = roundTo((vta_anual.NU_CANT_SOLIC/12)*0.01,2);
        myfordisp.setItemValue('_vta_anual',vta_anual_tot);
        myfordisp.setItemValue('_dis_tit_grat',vta_anual_tot);
        calculartpedido();
        calculartreq();
    } , 'json'); 
};

function calculartreq() {
    const parametros = {
        empresa:usrJson.empresa,
        periodo: periodo
    };
    $.post(BASE_URL + 'VT01040103/calcular-total-requ/', parametros, function (res) {
        const tot_req = res.data.tot_req[0];
        valor_tot_req = tot_req.NU_CANT_SOLIC;
        cant = myfordisp.getItemValue('_per_tit_grat');
        myfordisp.setItemValue('_per_tit_grat',cant - valor_tot_req);
    } , 'json'); 
}

function calculartpedido() {
    const parametros = {
        empresa:usrJson.empresa,
        periodo: periodo
    };
    $.post(BASE_URL + 'VT01040103/calcular-total-pedido/', parametros, function (res) {
        const tot_pedido = res.data.tot_pedido[0];
        valor_tot_pedido = tot_pedido.NU_CANT_SOLIC;
        cant = myfordisp.getItemValue('_vta_anual');
        myfordisp.setItemValue('_per_tit_grat',cant - valor_tot_pedido);
        return valor_tot_pedido;
    } , 'json'); 
}

cargarProductos = async (name) => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wprod", 0, 0, 1000, 500);
    Winid_.setText("Busqueda del Catalogo de Productos");
    Wind_.window("wprod").setModal(true);
    Wind_.window("wprod").denyResize();
    Wind_.window("wprod").center();
    myToolbar = Wind_.window("wprod").attachToolbar();
    myToolbar.setIconsPath('/assets/images/icons/');
    myToolbar.addText(null, null, 'Producto a buscar : ');
    myToolbar.addInput('in_busq', null, '', 250);
    myToolbar.addSeparator(null, null);
    myToolbar.addButton('b_check',null,'Agregar',"ic-add.png","");
    myToolbar.attachEvent('onClick', productoToolbar);
    myGrid_prod = Winid_.attachGrid();
    myGrid_prod.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    myGrid_prod.setHeader(',Código,Producto,Estado,Detalle 1,Detalle 2');
    myGrid_prod.setInitWidthsP('5,10,40,10,30,30');
    myGrid_prod.setColAlign('left,left,left,center,left,left');
    myGrid_prod.setColTypes('ch,rotxt,rotxt,rotxt,rotxt,rotxt');
    myGrid_prod.setColumnIds('chec,cod,desc,estado,deta,deta2');      
    myToolbar.attachEvent("onEnter", () => {        
        if (myToolbar.getValue('in_busq').length>0){     
            myGrid_prod.clearAll();              
            myGrid_prod.load( BASE_URL + 'VT01040103/cargar-productos/'+2+'/'+usrJson.empresa+'/'+'APT01@202011'+'/'+myToolbar.getValue('in_busq').toUpperCase()).then(function (text) {
                Wind_.window('wprod').progressOff();
            }); 
        }else{
            dhtmlx.confirm("El campo esta vacío", function (result) {});
        }
    });
    myGrid_prod.init();  
};

productoToolbar = async (id) => {
    switch (id) {  
        case 'b_check':
            var cant_filas_l_total  = myGrid_prod.getRowsNum() ;
            var cant_filas_n = 0;
            var pventa = 0,um='',stock = 0;
            data = '';
            data_n = '';
            console.log(cant_filas_l_total);
            for(let i=0;i<cant_filas_l_total;i++){
                data = myGrid_prod.getRowData(i);
                console.log(data);
                if (data.chec == 1) {
                    stock = data.deta.split(":")[1];
                    pventa = roundTo(data.deta2.split(":")[1].split("-")[0],2);
        // console.log(vendedor.split("@")[0]);
                    mainGrid.addRow(mainGrid.uid(),[0,data.cod,data.desc,,pventa,stock,,,'S/L','S/U'],1);
                   
                }      
            }     

            cant_filas_n = mainGrid.getRowsNum();
            console.log(cant_filas_n);
            let iRowId_gri,iRowId;
            for(let n=1;n<cant_filas_n;n++){
                iRowId_gri = mainGrid.getRowId(n);
                console.log(iRowId_gri);
                data_n = mainGrid.getRowData(iRowId_gri);
                for(let i=1;i<cant_filas_n;i++){
                    console.log('oi:'+i);
                    iRowId = mainGrid.getRowId(i);
                    console.log('cod:'+data_n.cod);
                    console.log('data:'+data.cod);
                    data = mainGrid.getRowData(iRowId);
                    if(iRowId!=iRowId_gri){
                        if (data_n.cod==data.cod){
                            mainGrid.deleteRow(iRowId);
                            i = i - 1;
                            n = n - 1;
                            cant_filas_n = cant_filas_n - 1;
                        }
                    }
                }
            }    
            Wind_.window("wprod").close();
            break;        
        default:
        null;
        break;
    }
};
buscarGasto = async (name) => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbusq", 0, 0, 850, 500);
    Winid_.setText('Operaciones');
    win_ing = Wind_.window("wbusq").attachLayout('2E');
    Wind_.window("wbusq").setModal(true);
    Wind_.window("wbusq").denyResize();
    Wind_.window("wbusq").center();
    win_ing.cells("a").hideHeader();
    win_ing.cells("b").hideHeader();
    win_ing.cells("a").setHeight(55);
    form_cat = win_ing.cells("a").attachForm(form_cat_ing);  
    cargarCatalogo(3);   
    form_cat.attachEvent("onChange", async (name) => {
        switch (name) {
            case '_tipo_gasto':
                ingreso = form_cat.getItemValue('_tipo_gasto');
                cargarCatalogo(ingreso);
                break;
            default:
                null;
                break;
        }
    });
};

buscarDireccion= async (name) => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbusq", 0, 0, 700, 500);
    Winid_.setText('Entidad');
    win_ent = Wind_.window("wbusq").attachLayout('1C');
    Wind_.window("wbusq").setModal(true);
    Wind_.window("wbusq").denyResize();
    Wind_.window("wbusq").center();
    win_ent.cells("a").hideHeader();
    myGrid_dir = win_ent.cells("a").attachGrid();
    myGrid_dir.setHeader('Código,Descripción,Estado,Detalle 1,Detalle 2');
    myGrid_dir.setInitWidthsP('10,80,10,50,50');
    myGrid_dir.setColTypes('ro,ro,ro,ro,ro,ro');
    myGrid_dir.setColAlign('left,left,center,left,left');
    myGrid_dir.setColumnIds("cod,desc,estado,det1,det2");
    myGrid_dir.init(); 
    myGrid_dir.clearAll();      
    myGrid_dir.load( BASE_URL + 'VT01040103/mostrar-direccion/'+53+'/'+usrJson.empresa+'/'+entidad).then(function (text) {   
        Wind_.window('wbusq').progressOff();
    });
    myGrid_dir.attachEvent("onRowSelect", function (id, ind) {
        data = myGrid_dir.getRowData(myGrid_dir.getSelectedRowId());
        var vendedor = data.det1;
        var fzaventa = data.det2;
        console.log(vendedor.split("@")[0]);
        myformkt.setItemValue('_cod_dir',data.cod);
        myformkt.setItemValue('_desc_dir',data.desc);
        myformkt.setItemValue('_cod_vendedor',vendedor.split("@")[0]);
        myformkt.setItemValue('_desc_vendedor',vendedor.split("@")[1]);
        myformkt.setItemValue('_zona',fzaventa.split("@")[1]);
        myformkt.setItemValue('_fventa',fzaventa.split("@")[3]);
        Wind_.window("wbusq").close();
    });
};

buscarEntidad = async (name) => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbusq", 0, 0, 700, 500);
    Winid_.setText('Entidad');
    win_ent = Wind_.window("wbusq").attachLayout('1C');
    Wind_.window("wbusq").setModal(true);
    Wind_.window("wbusq").denyResize();
    Wind_.window("wbusq").center();
    win_ent.cells("a").hideHeader();
    myToolbar = Wind_.window("wbusq").attachToolbar();
    myToolbar.addText(null, null, 'Nombre: ');
    myToolbar.addInput('in_busq', null, '', 250);
    myToolbar.addSeparator(null, null);
    tipo_entidad =  myformkt.getItemValue('_entidad');
    console.log(tipo_entidad);
    myToolbar.attachEvent("onEnter", () => {        
        if (myToolbar.getValue('in_busq').length>0){  
            tipo_entidad =  myformkt.getItemValue('_entidad');
            myGrid_enti.clearAll();       
            myGrid_enti.load( BASE_URL + 'VT01040103/mostrar-entidad/'+tipo_entidad+'/'+usrJson.empresa+'/'+myToolbar.getValue('in_busq').toUpperCase()).then(function (text) {   
                Wind_.window('wbusq').progressOff();
            });   
        }else{
            dhtmlx.confirm("El campo esta vacío", function (result) {});
        }
    });
    myGrid_enti = win_ent.cells("a").attachGrid();
    myGrid_enti.setHeader('Código,Razón Social,Estado,Nombre Comercial');
    myGrid_enti.setInitWidthsP('20,40,10,40');
    myGrid_enti.setColTypes('ro,ro,ro,ro');
    myGrid_enti.setColumnIds("cod,desc");
    myGrid_enti.init(); 
    myGrid_enti.attachEvent("onRowSelect", function (id, ind) {
        data = myGrid_enti.getRowData(myGrid_enti.getSelectedRowId()); 
            myformkt.setItemValue('_enti_cod',data.cod);
            myformkt.setItemValue('_enti_desc',data.desc);
            entidad = data.cod;
            Wind_.window("wbusq").close();
    });
};

buscarSolicita = async (name) => {
    Wind_ = new dhtmlXWindows();
    Winid_ = Wind_.createWindow("wbusq", 0, 0, 1000, 500);
    Winid_.setText('Presupuesto Personal');
    win_psto = Wind_.window("wbusq").attachLayout('2E');
    Wind_.window("wbusq").setModal(true);
    Wind_.window("wbusq").denyResize();
    Wind_.window("wbusq").center();
    win_psto.cells("a").hideHeader();
    win_psto.cells("b").hideHeader();
    myToolbar = Wind_.window("wbusq").attachToolbar();
    myToolbar.addText(null, null, 'Nombre/DNI: ');
    myToolbar.addInput('in_busq', null, '', 250);
    myToolbar.addSeparator(null, null);
    myToolbar.attachEvent("onEnter", () => {        
        if (myToolbar.getValue('in_busq').length>0){     
            myGrid_usuario.clearAll();       
            myGrid_usuario.load( BASE_URL + 'VT01040103/mostrar-usuario-seleccion/'+usrJson.alias+'/'+myToolbar.getValue('in_busq').toUpperCase()).then(function (text) {                            
                Wind_.window('wbusq').progressOff();
            }); 
        }else{
            dhtmlx.confirm("El campo esta vacío", function (result) {});
        }
    });
    myGrid_usuario = win_psto.cells("a").attachGrid();
    myGrid_usuario.setHeader('Cod. Usuario,Usuario,Centro Costo,Cod.Centro Costo,Nomb.Unico,Fecha Sistema,Status');
    myGrid_usuario.setInitWidthsP('10,20,20,10,20,10,10');
    myGrid_usuario.setColTypes('ro,ro,ro,ro,ro,ro,ro');
    myGrid_usuario.setColumnIds("cod_usuario,raz_social,dcosto,ccosto");
    myGrid_usuario.init();
    myGrid_psto = win_psto.cells("b").attachGrid();
    myGrid_psto.setHeader('Nom.Presupuesto,Saldo,Efectivo,Reservado,Catal Presupuesto');
    myGrid_psto.setInitWidthsP('20,20,20,20,20');
    myGrid_psto.setColTypes('ro,ro,ro,ro,ro');
    myGrid_psto.setColumnIds("desc,saldo,efect,reserv,cod");
    myGrid_psto.init();
    myGrid_usuario.attachEvent("onRowSelect", function (id, ind) {
        data = myGrid_usuario.getRowData(myGrid_usuario.getSelectedRowId());
        myGrid_psto.clearAll();       
        myGrid_psto.load( BASE_URL + 'VT01040103/mostrar-usuario-presupuesto/'+usrJson.alias+'/'+data.cod_usuario+'/'+data.ccosto).then(function (text) {   
            myformkt.setItemValue('_ccosto',data.ccosto); 
            myformkt.setItemValue('_dcosto',data.dcosto);    
            myformkt.setItemValue('_co_solicita',data.cod_usuario);   
            myformkt.setItemValue('_solicita',data.raz_social);
            Wind_.window('wbusq').progressOff();
        });
    });
    myGrid_psto.attachEvent("onRowSelect", function (id, ind) {
        data = myGrid_psto.getRowData(myGrid_psto.getSelectedRowId());   
        console.log(data);   
        myformkt.setItemValue('_cod_psto',data.cod); 
        myformkt.setItemValue('_desc_psto',data.desc);  
        myformkt.setItemValue('_saldo_psto',data.saldo);    
        Wind_.window('wbusq').progressOff();
        Wind_.window("wbusq").close();
    });
};

cargarCatalogo = async (ingreso) => {
    myGrid_operaciones = win_ing.cells("b").attachGrid();
    myGrid_operaciones.setImagePath("/assets/vendor/dhtmlx/skins/skyblue/imgs/dhxgrid_skyblue/");
    myGrid_operaciones.setHeader(',Ingreso/Gasto,C.Costo,Cta.Gasto,Catálogo Presupuesto,Nombre Presupuesto, Descripción Cta Contable, Cod Ing.Gasto');
    myGrid_operaciones.setInitWidthsP('0,35,10,15,15,30,30,15');
    myGrid_operaciones.setColTypes('ro,ro,ch,ro,ro,ro,ro,ro,ro');
    myGrid_operaciones.setColAlign('left,left,center,left,left,left,left,left,left');
    myGrid_operaciones.setColumnIds("cod_gasto,desc_gasto,ccosto");
    myGrid_operaciones.init();
    myGrid_operaciones.clearAll();       
    myGrid_operaciones.load( BASE_URL + 'VT01040103/mostrar-catalogo-presupuesto/'+usrJson.empresa+'/'+ingreso).then(function (text) {           
        Wind_.window('wbusq').progressOff();
    });
    myGrid_operaciones.attachEvent("onRowSelect", function (id, ind) {
        data = myGrid_operaciones.getRowData(myGrid_operaciones.getSelectedRowId()); 
        console.log(data.desc_gasto);
            myformkt.setItemValue('_r_gasto',data.desc_gasto);
            Wind_.window("wbusq").close();
            console.log('ssss');
            cargarMotivo(ingreso);
    });
}

cargarMotivo = (ingreso) => {
    const params = {
        ingreso_gasto:  ingreso
    };
    $.post(BASE_URL + 'LO0107/mostrar-motivo/', params, function (res) {
        console.log('sssss');
        const valor = res.data.usuario;
        myformkt.reloadOptions('_r_motivo_1', valor);
    } , 'json');
}

cargarRequ = (fec_ini,fec_fin,flag_pend,flag_rech,flag_aten) => {
    mainGrid.clearAll();       
    mainGrid.load( BASE_URL + 'VT01040103/mostrar-requerimientos/'+usrJson.empresa+'/'+usrJson.codigo+'/'+fec_ini+'/'+fec_fin+'/'+flag_pend+'/'+flag_rech+'/'+flag_aten).then(function (text) {           
        mkt_revLayout.cells('b').progressOff();
    });
}

consultaDetalle = (requerimiento) =>{
    mainGridDet = mkt_revLayout.cells('c').attachGrid();    
    mainGridDet.setHeader('Código,Producto,Lote,Ubicación,Cant.Sol,Cant.Ent,Cant.Pend,Cant.Aprob,Im Precio Venta, SubTotal');
    mainGridDet.setInitWidths('110,580,80,80,80,80,80,80,80,80');
    mainGridDet.setColAlign('left,left,left,left,left,left,left,left,left,left');
    mainGridDet.clearAll();       
    mainGridDet.init();
    mainGridDet.load( BASE_URL + 'VT01040103/mostrar-requerimientos-detalle/'+usrJson.empresa+'/'+requerimiento).then(function (text) {           
        mkt_revLayout.cells('c').progressOff();
    });
    mainGridDet.attachFooter(",,,,,,,,#stat_total,#stat_total");
}
    
       