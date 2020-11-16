
aprobarFormula = () => {
// mainLayout_aprform = mainLayout_inicio.attachLayout('1C');
mainLayoutform = mainLayout_inicio.cells('a').attachLayout('2E');
mainLayoutform.cells('a').hideHeader();
mainLayoutform.cells('a').setHeight(60);
myFormdformu = mainLayoutform.cells('a').attachForm(f_filtro_formula);
myToolbardatos_formula = mainLayoutform.cells('b').attachToolbar();
myToolbardatos_formula.setIconsPath('/assets/images/icons/');
myToolbardatos_formula.addButton('__comp',null,'Componentes',"ic-doc.png",null);
myToolbardatos_formula.addButton('__traz',null,'Trazabilidad',"ic-enfocar.png",null);
myToolbardatos_formula.addButton('__hist',null,'Historial',"ic-historial.png",null);
myToolbardatos_formula.addButton('__pass',null,'Aprobar',"ic-like.png",null);
myToolbardatos_formula.addButton('__fail',null,'Rechazar',"ic-dislike.png",null);
myToolbardatos_formula.addButton('__inactive',null,'Dar de baja',"ic-cancel-cd.png",null);
myToolbardatos_formula.setAlign("left");
myToolbardatos_formula.setIconSize(32);
myToolbardatos_formula.attachEvent('onClick', onClicktoolbarform);
tabbar_form = mainLayoutform.cells('b').attachTabbar();
tabbar_form.addTab('__fabri', 'Fabricación', null, null, true);
tabbar_form.addTab('__envasado', 'Envasado', null, null, false);
tabbar_form.addTab('__acondic', 'Acondicionado', null, null, false);
tabbar_form.attachEvent ( "onSelect" , formulaOnSelect);  
cargarformula('__fabri','-',1,'N'); 
myFormdformu.attachEvent("onChange", function (id_ind){ 
    myFormdformu.isItemChecked('_ch_todo') ? myFormdformu.disableItem('_ch_porap') : myFormdformu.enableItem('_ch_porap'); 
    myFormdformu.isItemChecked('_ch_porap') ? myFormdformu.disableItem('_ch_todo') : myFormdformu.enableItem('_ch_todo'); 
});
myFormdformu.attachEvent("onButtonClick", function (id_ind){
    buscar = myFormdformu.getItemValue('_fr_buscar').length>0 ? myFormdformu.getItemValue('_fr_buscar').toUpperCase() : '-';
    flag = myFormdformu.isItemChecked('_ch_todo')?'S':'N';
    console.log(flag);
    cargarformula('__fabri',buscar,1,flag);         
}); 
}   

formulaOnSelect= async (id) => {
    buscar = myFormdformu.getItemValue('_fr_buscar').length>0 ? myFormdformu.getItemValue('_fr_buscar').toUpperCase() : '-';
    flag = myFormdformu.isItemChecked('_ch_todo')?'S':'N';
    switch (id) {
        case '__fabri':     
            cargarformula('__fabri',buscar,1,flag);   
            break;
        case '__envasado':     
            cargarformula('__envasado',buscar,2,flag);  
            break;
        case '__acondic':     
            cargarformula('__acondic',buscar,3,flag); 
            break;            
        default:
            null;
            break;
    }
};

cargarformula = (nombre,buscar,tipo,flag) => {  
    mainLayoutFormula = tabbar_form.cells(nombre).attachLayout('1C');    
    myGrid_formula = mainLayoutFormula.cells('a').attachGrid();
    mainLayoutFormula.cells('a').hideHeader();
    myGrid_formula.setHeader('Cod.Fórmula,Cod.Producto,Descripción,Ver.,Cant.,UExCj.Emb.,Estado,F.Creación,Creado por,Fecha Aprob.,Aprobado por,Marca,Sub Marca');
    myGrid_formula.setInitWidths('0,100,400,80,80,80,100,100,200,100,200,150,150');
    myGrid_formula.setColAlign('center,left,left,center,center,center,left,left,left,left,left,left,left');
    myGrid_formula.setColTypes('ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro'); 
    myGrid_formula.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter");
    myGrid_formula.setColumnIds('coform,codprod,desc,ver,cant,unid,estado'); 
    myGrid_formula.init();      
    myGrid_formula.clearAll(); 
    mainLayoutFormula.cells('a').progressOn();
    myGrid_formula.load( BASE_URL + 'PO010208/mostrar-lista-formula/'+usrJson.empresa+'/'+buscar+'/'+tipo+'/'+flag).then(function (text) {
        mainLayoutFormula.cells('a').progressOff();
        num_fila = myGrid_formula.getRowsNum();
        let iRowId;
        for(let i=0;i<num_fila;i++){
            iRowId = myGrid_formula.getRowId(i);
            data = myGrid_formula.getRowData(iRowId);
            if(data.estado=='Vigente'){
                myGrid_formula.setRowColor(iRowId,"#90EE90");
            }else{
                if(data.estado=='Por Aprobar'||data.estado=='Revisada'){
                    myGrid_formula.setRowColor(iRowId,"#F7D358");
                }else{
                    myGrid_formula.setRowColor(iRowId,"red");
                }
            }
        }
    });
};


onClicktoolbarform= async (id) => {        
    seleccione  = myGrid_formula.getRowData(myGrid_formula.getSelectedRowId());
    switch (id) {
        case '__comp':     
            cargarventanaComp(seleccione.codprod,seleccione.codprod,seleccione.desc);              
            break;
        case '__traz':  
            cargarventanaTraz(seleccione.codprod,seleccione.codprod,seleccione.desc); 
            break;
        case '__hist':  
            cargarventanaHist(seleccione.codprod,seleccione.codprod,seleccione.desc,seleccione.ver); 
            break;            
        case '__fail':  
            aprobar(seleccione.coform,seleccione.codprod,'Observada');      
            break;
        case '__inactive':     
            aprobar(seleccione.coform,seleccione.codprod,'Obsoleta'); 
            break;
        case '__pass':   
            aprobar(seleccione.coform,seleccione.codprod,'Vigente'); 
            break;
        default:
            null;
            break;
    }
};

cargarventanaComp = async (formula,codigo,desc) => {
    Windc_ = new dhtmlXWindows();
    Winidc_ = Windc_.createWindow("wcomp", 0, 0, 800, 500);
    Winidc_.setText("Componentes - Producto: ("+codigo+") "+desc);
    Windc_.window("wcomp").setModal(true);
    Windc_.window("wcomp").denyResize();
    Windc_.window("wcomp").center();
    myGrid_componentes = Winidc_.attachGrid();
    myGrid_componentes.setHeader('Cod.Producto,Descripción,Cant.,UM,Cod.Integral,Estado');
    myGrid_componentes.setInitWidths('150,350,100,50,100,100');
    myGrid_componentes.setColAlign('left,left,right,right,left,left');
    myGrid_componentes.setColTypes('ro,ro,ro,ro,ro,ro'); 
    myGrid_componentes.setNumberFormat("0.00",2,".",",");  
    myGrid_componentes._in_header_stat_sum=function(tag,index,data){       
        var calck=function(){                              
            var sum=0;                                     
            this.forEachRow(function(id){                   
                sum+=this.cellById(id,index).getValue()*1;     
            })
        return this._aplNF(sum,0);
        }
        this._stat_in_header(tag,calck,index,data);            
    }
    myGrid_componentes.attachFooter(",TOTAL,#stat_sum,kg,,",["","","text-align:right;","text-align:right;","",""]);
    myGrid_componentes.init();     
    myGrid_componentes.clearAll(); 
    Windc_.window("wcomp").progressOn();
    myGrid_componentes.load( BASE_URL + 'PO010208/mostrar-detalle-form-componente/'+usrJson.empresa+'/'+formula).then(function (text) {
        Windc_.window('wcomp').progressOff();
    });   
};

cargarventanaTraz = async (formula,codigo,desc) => {
    Windt_ = new dhtmlXWindows();
    Winidt_ = Windt_.createWindow("wtraz", 0, 0, 800, 500);
    Winidt_.setText("Trazabilidad - Producto: ("+codigo+") "+desc);
    Windt_.window("wtraz").setModal(true);
    Windt_.window("wtraz").denyResize();
    Windt_.window("wtraz").center();
    myGrid_trazab = Winidt_.attachGrid();
    myGrid_trazab.setHeader(',Cod.Producto,Descripción,Tipo,');
    myGrid_trazab.setInitWidths('0,100,500,200,0');
    myGrid_trazab.setColumnHidden(0,true);
    myGrid_trazab.setColumnHidden(4,true);
    myGrid_trazab.setColAlign('left,left,left,left,left,left');
    myGrid_trazab.setColTypes('ro,ro,ro,ro,ro,ro');
    myGrid_trazab.init();     
    myGrid_trazab.clearAll(); 
    Windt_.window("wtraz").progressOn();
    myGrid_trazab.load( BASE_URL + 'PO010208/mostrar-detalle-form-trazab/'+usrJson.empresa+'/'+formula).then(function (text) {
        Windt_.window('wtraz').progressOff();
    });  
};

cargarventanaHist = async (formula,codigo,desc,version) => {
    Windh_ = new dhtmlXWindows();
    Winidh_ = Windh_.createWindow("whist", 0, 0, 800, 500);
    Winidh_.setText("Historial - Producto: ("+codigo+") "+desc);
    Windh_.window("whist").setModal(true);
    Windh_.window("whist").denyResize();
    Windh_.window("whist").center();
    myGrid_historial = Winidh_.attachGrid();
    myGrid_historial.setHeader('Fecha,Ver.,Descripción de los cambios,Usuarios');
    myGrid_historial.setInitWidths('100,100,300,100');
    myGrid_historial.setColAlign('left,left,left,left');
    myGrid_historial.setColTypes('ro,ro,ro,ro'); 
    myGrid_historial.init(); 
    myGrid_historial.clearAll(); 
    Windh_.window("whist").progressOn();
    myGrid_historial.load( BASE_URL + 'PO010208/mostrar-historial/'+usrJson.empresa+'/'+formula+'/'+version).then(function (text) {    
        Windh_.window('whist').progressOff();
    });  
};

aprobar = (formula,producto,vigencia) => {
    params = {
        empresa: usrJson.empresa,
        formula: formula,
        producto: producto,
        usuario: usrJson.codigo,
        alias: usrJson.alias,
        vigencia: vigencia
    };    
    dhtmlx.confirm("¿Está seguro?", function (result) {
        if (result === Boolean(true)) {
            $.post(BASE_URL + "PO010208/aprobar-formula", params, function (res) {
                if (res.state=='success'){
                    Swal.fire('Hecho!', res.message, 'success');
                    cargarformula('__fabri','-',1,'N'); 
                } else {
                    Swal.fire({ type: 'error', title: 'Algo salió mal...', text: 'No se guardo el registro :' + res.message });
                }
            }, "json");
        }
    });
}