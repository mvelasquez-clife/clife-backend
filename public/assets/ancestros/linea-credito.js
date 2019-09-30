let LcredWindow,LcredLayout,LcredGridTodo,LcredGridFiltro,LcredForm;
const FormCliente = [
    { type: 'settings', offsetLeft: 16, offsetTop: 6, position: 'label-top' },
    { type: 'hidden', name: 'formVendedor' },
    { type: 'label', label: '<span class="lbl-form-win-cliente">Parámetros de cálculo</span>', name: 'FormTitulo', offsetTop: 16 },
    { type: 'input', label: 'Factor', name: 'FormFactor', inputWidth: 60 },
    { type: 'input', label: 'Histórico de pagos', name: 'FormHistoricoPagos', inputWidth:120 },
    { type: 'input', label: 'Periodos', name: 'FormPeriodos', inputWidth:160 },
    { type: 'input', label: '<span style="color:#4caf50;">Línea de crédito estimada (S/ )</span>', name: 'FormCreditoEstimado', inputWidth:100 },
    { type: 'block', offsetLeft: 0, list: [
        { type: 'button', name: 'AsignarLcred', value: 'Asignar', offsetLeft: 0 },
        { type: 'newcolumn' },
        { type: 'button', name: 'CancelarLcred', value: 'Cancelar' }
    ] }
];

AsignarLineaCreditoCliente = (wContainer,cliente,vendedor,meses,fzavta) => {
    return new Promise(resolve => {
        if(wContainer.isWindow('LcredWindow')) {
            LcredWindow.bringToTop();
        }
        else {
            LcredWindow = wContainer.createWindow('LcredWindow',0,0,800,540);
                LcredWindow.center();
                LcredWindow.setText('Asignar línea de crédito');
                LcredWindow.setModal(true);
                LcredWindow.keepInViewport(true);
            LcredLayout = LcredWindow.attachLayout('3J');
                LcredLayout.cells('a').hideHeader();
                LcredLayout.cells('b').setText('Por favor, espere...');
                LcredLayout.cells('b').setWidth(250);
                LcredLayout.cells('c').hideHeader();
                LcredLayout.cells('c').setHeight(200);
            LcredGridTodo = LcredLayout.cells('a').attachGrid();
                LcredGridTodo.setIconsPath('/assets/images/icons/grid/');
                LcredGridTodo.setHeader('Fza.Vta.,Vendedor,#cspan,Periodo,Pagos,');
                LcredGridTodo.setInitWidths('50,80,240,60,80,0');
                LcredGridTodo.setColTypes('rotxt,rotxt,rotxt,rotxt,ron,rotxt');
                LcredGridTodo.setColAlign('left,right,left,left,right,center');
                LcredGridTodo.setNumberFormat('0,000.00',4);
                LcredGridTodo.init();
                LcredGridTodo.load('/api/VT010101/pagos-cliente-todos/' + usrJson.empresa + '/' + cliente);
            LcredGridFiltro = LcredLayout.cells('c').attachGrid();
                LcredGridFiltro.setIconsPath('/assets/images/icons/grid/');
                LcredGridFiltro.setHeader('Fza.Vta.,Vendedor,#cspan,Periodo,Pagos,');
                LcredGridFiltro.setInitWidths('50,80,240,60,80,0');
                LcredGridFiltro.setColTypes('rotxt,rotxt,rotxt,rotxt,ron,rotxt');
                LcredGridFiltro.setColAlign('leftleft,right,left,left,right,center');
                LcredGridFiltro.setNumberFormat('0,000.00',4);
                LcredGridFiltro.init();
                LcredGridFiltro.load('/api/VT010101/pagos-cliente-filtro/' + usrJson.alias + '/' + usrJson.empresa + '/' + cliente + '/' + fzavta + '/' + vendedor, () => {
                    let jsData = {
                        alias: usrJson.alias,
                        cliente: cliente,
                        vendedor: vendedor
                    }
                    $.post('/api/VT010101/datos-solicitud-credito', jsData, (result) => {
                        if(result.state == 'success') {
                            let data = result.data;
                            LcredWindow.setText('<marquee>Cliente: ' + data.cliente + ' - Vendedor: ' + data.vendedor + '</marquee>');
                            LcredLayout.cells('b').setText('Asignar línea de crédito');
                            LcredForm.setItemValue('FormPeriodos', data.iperiodo + ' - ' + data.fperiodo);
                            //calcula la linea de credito
                            let TotalFiltro = 0;
                            let MesesVariable = meses / 2;
                            let CantidadFilasFiltro = LcredGridFiltro.getRowsNum();
                            for(let i = 0; i < CantidadFilasFiltro; i++) {
                                let iRowId = LcredGridFiltro.getRowId(i);
                                TotalFiltro += parseFloat(LcredGridFiltro.cells(iRowId,4).getValue());
                            }
                            //fin calcula linea de credito
                            //LineaCredito = TotalFiltro * MesesVariable / meses;
                            LineaCredito = TotalFiltro * 2 / 3;
                            LcredForm.setItemValue('FormCreditoEstimado', LineaCredito.toLocaleString('en-us',{minimumFractionDigits:2,maximumFractionDigits:2}));
                            if(TotalFiltro < 0.01) {
                                LcredForm.disableItem('AsignarLcred');
                            }
                        }
                        else {
                            console.log(result.message);
                        }
                    }, 'json');
                });
            LcredForm = LcredLayout.cells('b').attachForm();
                LcredForm.loadStruct(FormCliente);
                LcredForm.setItemValue('FormFactor','3');
                LcredForm.setItemValue('FormHistoricoPagos','Últimos 6 meses');
                //LcredForm.setItemValue('FormPeriodos','3');
                //LcredForm.setItemValue('FormCreditoEstimado','3');
            LcredForm.attachEvent('onButtonClick', (id) => {
                switch(id) {
                    case 'AsignarLcred':
                        dhtmlx.confirm('¿Asignar la línea de crédito al cliente?', (result) => {
                            if(result) {
                                let LineaAsignada = LcredForm.getItemValue('FormCreditoEstimado').replace(',','');
                                let p = {
                                    empresa: usrJson.empresa,
                                    cliente: cliente,
                                    fzavta: fzavta,
                                    lcredito: LineaAsignada,
                                    usuario: usrJson.codigo,
                                    ccosto: usrJson.ccosto
                                };
                                $.post('/api/VT010101/asignar-linea-credito-cliente', p, (response) => {
                                    if(response.state == 'success') {
                                        LcredWindow.close();
                                        resolve({ result: 'S' });
                                    }
                                    else {
                                        alert('Ocurrió un error...');
                                        console.log(result.message);
                                        resolve({ result: 'N' });
                                    }
                                }, 'json');
                            }
                        });
                        break;
                    case 'CancelarLcred':
                        LcredWindow.close();
                        resolve({ result: 'N' });
                        break;
                    default:
                        resolve({ result: 'N' });
                        break;
                }
            });
        }
    });
}