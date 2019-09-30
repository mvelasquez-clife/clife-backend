CargarData = async (event) => {
    let punto = event.currentTarget;
    $('#ch-dias').empty();
    $('#modal-ch-volador').modal('show');
    //
    let result;
    try {
        result = await $.ajax({
            url: '/avance-ventas/cargar-datos-mes',
            method: 'post',
            data: {
                tipo: punto.series.name,
                codigo: punto.id,
                empresa: 11
            },
            dataType: 'json'
        });
        if(result.state == 'success') {
            let data = result.data.detalle;
            let MesesCategorias = [];
            let MesesData = [];
            for(let iDia of data) {
                let { dia, importe } = iDia;
                MesesCategorias.push(dia);
                MesesData.push(importe);
            }
            //grafico del modal
            $('#ch-dias').highcharts({
                chart: { type: 'column' },
                title: { text: 'Avance de ventas por día' },
                xAxis: {
                    categories: MesesCategorias
                },
                yAxis: {
                    min: 0,
                    title: { text: 'Soles (S/)' }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">Día {point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0"><b style="font-size:12px;">S/{point.y:,.2f}</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: { pointPadding: 0.2, borderWidth: 0 },
                    series: {
                        color: '#009688'
                    }
                },
                series: [{
                    name: result.data.label,
                    data: MesesData
                }],
                credits: {
                    enabled: false
                },
            });
            //otro grafico
            let dvendedores = result.data.vendedores;
            let VendedoresCategorias = [];
            let VendedoresData = [];
            for(iVendedor of dvendedores) {
                let { codigo, vendedor, importe } = iVendedor;
                VendedoresCategorias.push(vendedor.substring(0,25) + (vendedor.length > 25 ? '...' : ''));
                VendedoresData.push(importe);
            }
            $('#ch-vendedores').highcharts({
                chart: { type: 'bar' },
                title: { text: 'Avance de ventas por vendedor' },
                xAxis: {
                    categories: VendedoresCategorias,
                    title: { text: null }
                },
                yAxis: {
                    min: 0,
                    title: { text: 'Soles (S/)', align: 'high' },
                    labels: { overflow: 'justify' }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:#202020;padding:0"><b style="font-size:12px;">S/{point.y:,.2f}</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    bar: { dataLabels: { enabled: false } }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    x: -40,
                    y: 360,
                    floating: true,
                    borderWidth: 1,
                    backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                    shadow: true
                },
                credits: { enabled: false },
                series: [{
                    name: 'Vendedores',
                    data: VendedoresData,
                    color: '#1565c0'
                }]
            });
        }
    }
    catch(error) {
        console.log(error);
    }
    console.log('id:',punto.id,'- valor:',punto.y,'- serie:',punto.series.name);
}

const gaugeOptions = {
    chart: {
        type: 'solidgauge',
        spacingTop: -300,
        spacingBottom: -25
    },
    title: null,
    pane: {
        center: ['50%', '90%'],
        size: '100%',
        startAngle: -90,
        endAngle: 90,
        background: {
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#e8e8e8',
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc'
        }
    },
    tooltip: {
        enabled: false
    },
    // the value axis
    yAxis: {
        stops: [
            [0, '#f44336'],
            [0.25, '#ff9800'],
            [0.5, '#fdd835'],
            [0.75, '#4caf50']
        ],
        lineWidth: 0,
        minorTickInterval: null,
        tickPixelInterval: 400,
        tickWidth: 0,
        title: { y: -55 },
        labels: {
            enabled: false
        }
    },
    plotOptions: {
        solidgauge: {
            dataLabels: {
                y: 5,
                borderWidth: 0,
                useHTML: true
            },
            point: {
                events: {
                    click: CargarData
                }
            }
        }
    }
};

IniciarComponentes = async () => {
    console.log('%c*** Tablero de avance de ventas ***', 'background:#009688;color:#ffffff;font-size:13px;');
    let result;
    try {
        result = await $.ajax({
            url: '/avance-ventas/datos-tablero-control',
            method: 'post',
            data: { empresa: 11 },
            dataType: 'json'
        });
        let { inicio, fin } = result.data.periodos;
        ConstruyeGraficoPeriodos(result.data.ventas);
        ConstruyeGraficosSecundarios(result.data.data);
        ConstruyeGraficoAvancePeriodo(result.data.avance);
    }
    catch(error) {
        console.log(error);
    }
}

ConstruyeGraficoPeriodos = (dataVentas) => {
    $('#ventas-anio').empty();
    //highcharts
    let EtiquetasGraficoPeriodos = [];
    let ValoresGraficoPeriodos = [];
    for(let i in dataVentas) {
        let iPeriodo = dataVentas[i];
        EtiquetasGraficoPeriodos.push(iPeriodo.periodo);
        ValoresGraficoPeriodos.push(iPeriodo.importe);
    }
    $('#ventas-anio').highcharts({
        chart: { type: 'column' },
        title: false,
        xAxis: {
            categories: EtiquetasGraficoPeriodos,
            labels: {
                enabled: false
            }
        },
        yAxis: {
            min: 0,
            max: 7000000,
            title: null
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">Mes {point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b style="font-size:12px;">S/ {point.y:,.2f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: { pointPadding: 0.2, borderWidth: 0 },
            series: {
                color: '#f44336'
            }
        },
        series: [{
            name: 'Ventas por periodo',
            data: ValoresGraficoPeriodos
        }],
        credits: {
            enabled: false
        },
    });
}

ConstruyeGraficosSecundarios = (dataTotal) => {
    let MapCanales = new Map();
    let MapFventas = new Map();
    for(let iDato of dataTotal) {
        let { periodo, cfzavta, fzavta, ctpnegocio, tpnegocio, avance, proyeccion } = iDato;
        //datos por canal de distribucion
        if(MapCanales.has(ctpnegocio)) {
            let iTpnegocio = MapCanales.get(ctpnegocio);
                iTpnegocio.avance += avance;
                iTpnegocio.proyeccion += proyeccion;
            MapCanales.set(ctpnegocio, iTpnegocio);
        }
        else {
            MapCanales.set(ctpnegocio, {
                nombre: tpnegocio,
                avance: avance,
                proyeccion: proyeccion
            });
        }
        //datos por fuerza de venta
        if(MapFventas.has(cfzavta)) {
            let iCanal = MapFventas.get(cfzavta);
                iCanal.avance += avance;
                iCanal.proyeccion += proyeccion;
            MapFventas.set(cfzavta, iCanal);
        }
        else {
            MapFventas.set(cfzavta, {
                nombre: fzavta,
                avance: avance,
                proyeccion: proyeccion
            });
        }
    }
    //arma los graficos
    console.log('%cPor canal de distribución', 'background:#e8f5e9;color:#388e3c;');
    let ContainerTpnegocio = $('#row-tpnegocio');
    for([codigo,canal] of MapCanales) {
        ContainerTpnegocio.append(
            $('<div>').append(
                $('<div>').attr('id','tpnego-' + codigo).addClass('chart-div')
            ).addClass('col-2 p-0')
        );
        let iPorcentaje = Math.round(canal.avance * Math.random());
        $('#tpnego-' + codigo).highcharts(Highcharts.merge(gaugeOptions, {
            yAxis: {
                min: 0,
                max: canal.avance,
                title: {
                    text: canal.nombre
                }
            },
    
            credits: {
                enabled: false
            },
    
            series: [{
                name: 'tpnegocio',
                data: [
                    { y: iPorcentaje, id: codigo }
                ],
                dataLabels: {
                    format: '<div style="text-align:center"><span style="font-size:20px;color:' +
                        ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:,.0f}</span><br/>' +
                           '<span style="font-size:10px;color:silver;font-weight:300;">de ' + canal.avance.toLocaleString('en-us',{minimumFractionDigits:0,maximumFractionDigits:0}) + '</span></div>'
                },
                tooltip: {
                    valuePrefix: 'S/ '
                }
            }]
    
        }));
    }
    $('#row-tpnegocio').prev().html('Avance por canal de distribución');
    console.log('%cPor fuerza de venta', 'background:#e3f2fd;color:#1976d2;');
    let ContainerFventa = $('#row-fventa');
    for([codigo,fventa] of MapFventas) {
        //console.log(fventa.nombre,'| avance:',fventa.avance,'- proyectado:',fventa.proyeccion);
        ContainerFventa.append(
            $('<div>').append(
                $('<div>').attr('id','fventa-' + codigo).addClass('chart-div')
            ).addClass('col-2')
        );
        let iPorcentaje = Math.round(fventa.avance * Math.random());
        $('#fventa-' + codigo).highcharts(Highcharts.merge(gaugeOptions, {
            yAxis: {
                min: 0,
                max: fventa.avance,
                title: {
                    text: fventa.nombre
                }
            },
    
            credits: {
                enabled: false
            },
    
            series: [{
                name: 'fventa',
                data: [
                    { y: iPorcentaje, id: codigo }
                ],
                dataLabels: {
                    format: '<div style="text-align:center"><span style="font-size:20px;color:' +
                        ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:,.0f}</span><br/>' +
                           '<span style="font-size:10px;color:silver;font-weight:300;">de ' + fventa.avance.toLocaleString('en-us',{minimumFractionDigits:0,maximumFractionDigits:0}) + '</span></div>'
                },
                tooltip: {
                    valuePrefix: 'S/ '
                }
            }]
    
        }));
    }
    $('#row-fventa').prev().html('Avance por fuerza de venta');
}

ConstruyeGraficoAvancePeriodo = (avance) => {
    let gOpt = gaugeOptions;
    gOpt.chart.spacingTop = -200;
    gOpt.plotOptions.solidgauge.point = null;
    gOpt.pane.center = ['50%', '80%'];
    gOpt.pane.background.backgroundColor = '#f8f9fa';
    $('#ch-resumen').highcharts(Highcharts.merge(gOpt, {
        yAxis: {
            min: 0,
            max: avance.cuota,
            title: null
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'avance',
            data: [
                { y: avance.venta, id: 'avc' }
            ],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:20px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:,.0f}</span><br/>' +
                       '<span style="font-size:10px;color:#808080;font-weight:300;">de ' + avance.cuota.toLocaleString('en-us',{minimumFractionDigits:0,maximumFractionDigits:0}) + '</span></div>'
            },
            tooltip: {
                valuePrefix: 'S/ '
            }
        }]

    }));
}