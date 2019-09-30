var periodosListo = false;

IniciarComponentes = () => {
    console.log('%c*** Tablero de avance de ventas ***', 'background:#009688;color:#ffffff;font-size:13px;');
    //prepara el layout
    LayoutContainer = new dhtmlXLayoutObject(document.body, '1C');
    TabbarPrincipal = LayoutContainer.cells('a').attachTabbar();
        TabbarPrincipal.addTab('avance','Avance de ventas',null,null,true);
        TabbarPrincipal.addTab('visitas','Visitas');
    LayoutAvance = TabbarPrincipal.tabs('avance').attachLayout('5S');
        LayoutAvance.cells('a').hideHeader();
        LayoutAvance.cells('a').setHeight(300);
        LayoutAvance.cells('b').setText('<img id="img-loader" src="/assets/images/web/loader-blank.svg" style="height:22px;margin-top:-3px;"> Últimos pedidos del día');
        LayoutAvance.cells('c').setWidth(320);
        LayoutAvance.cells('c').hideHeader();
        LayoutAvance.cells('d').hideHeader();
        LayoutAvance.cells('e').hideHeader();
        LayoutAvance.cells('a').attachHTMLString('<div class="dv-chart" id="div-polars"></div>');
        LayoutAvance.cells('c').attachHTMLString('<div class="dv-chart" id="ch-resumen"></div>');
        LayoutAvance.cells('d').attachHTMLString('<div class="dv-chart" id="div-periodos"></div>');
        LayoutAvance.cells('e').attachHTMLString('<div class="dv-chart" id="div-visitas"></div>');
    GridPedidos = LayoutAvance.cells('b').attachGrid();
        GridPedidos.setIconsPath('/assets/images/icons/grid/');
        GridPedidos.setHeader('Pedido,Apertura,Cierre,Fuerza venta,Tipo negocio,Vendedor,RUC,Cliente,Moneda,Importe,');
        GridPedidos.setInitWidths('80,60,60,120,120,250,90,250,60,90,0');
        GridPedidos.setColTypes('rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,rotxt,ron,rotxt');
        GridPedidos.setColAlign('left,right,right,left,left,left,right,left,left,right,left');
        GridPedidos.setNumberFormat('0,000.00',9);
        GridPedidos.init();
    LayoutVisitas = TabbarPrincipal.tabs('visitas').attachLayout('2U');
        LayoutVisitas.cells('a').hideHeader();
        LayoutVisitas.cells('a').attachHTMLString('<div id="map-canvas" class="dv-chart"></div>');
        LayoutVisitas.cells('b').hideHeader();
        LayoutVisitas.cells('b').setWidth(320);
        LayoutVisitas.cells('b').attachHTMLString('<div id="container-visitas" class="dv-chart"></div>');
    //carga la hora
    let ahora = new Date();
        cHora = ahora.getHours();
        cMinuto = ahora.getMinutes();
        cSegundo = ahora.getSeconds();
    //
    $('#div-polars').append(
        $('<div>').append(
            $('<div>').append(
                $('<div>').append(
                    $('<table>').append(
                        $('<tbody>').append(
                            $('<tr>').append(
                                $('<td>')
                            ).append(
                                $('<td>').append(
                                    $('<img>').attr('src','/assets/images/web/new-life.svg').addClass('img-header')
                                ).attr('width','5%')
                            ).append(
                                $('<td>').append(
                                    $('<p>').addClass('m-2 table-header text-dark').html('Corporacion Life S.A.C.').css({
                                        'font-size': '1rem',
                                        'font-family': 'Open Sans'
                                    })
                                )
                            )
                        )
                    ).addClass('table-header')
                ).append(
                    $('<hr>')
                ).append(
                    $('<p>').html('Hora actual').addClass('mt-4 mb-0').css('color','#4db6ac')
                ).append(
                    $('<h1>').append(
                        $('<span>').attr('id','c-hora').html((cHora < 10 ? '0' : '') + cHora)
                    ).append(
                        $('<span>').html(':')
                    ).append(
                        $('<span>').attr('id','c-minuto').html((cMinuto < 10 ? '0' : '') + cMinuto)
                    ).append(
                        $('<span>').html(':')
                    ).append(
                        $('<span>').attr('id','c-segundo').html((cSegundo < 10 ? '0' : '') + cSegundo)
                    ).addClass('mt-0 mb-2 text-center').css({
                        'color': '#1976d2',
                        'font-size': '48px',
                        'font-weight': '300'
                    })
                ).append(
                    $('<p>').append('Última actualización:<br>').append(
                        $('<b>').attr('id','sp-uactualiza')
                    ).addClass('text-secondary').css('font-size','12px')
                ).addClass('col-2 h-100 bg-light')
            ).append(
                $('<div>').attr('id','polar-tpnegocio').addClass('col-5 h-100')
            ).append(
                $('<div>').attr('id','polar-fventa').addClass('col-5 h-100')
            ).addClass('row h-100')
        ).addClass('container-fluid h-100')
    );
    //div de visitas
    $('#div-visitas').append(
        $('<div>').append(
            $('<div>').append(
                $('<div>').append(
                    $('<div>').append(
                        $('<h1>').attr('id','clientes-cartera').html('').addClass('text-center m-1').css('font-weight','300')
                    ).append(
                        $('<p>').html('clientes visitados').addClass('text-light text-center').css('font-size','12px')
                    ).addClass('alert bg-success text-light m-0 h-100')
                ).addClass('col p-1 h-100')
            ).append(
                $('<div>').append(
                    $('<div>').append(
                        $('<h1>').attr('id','clientes-nuevos').html('').addClass('text-center m-1').css('font-weight','300')
                    ).append(
                        $('<p>').html('nuevos clientes').addClass('text-light text-center').css('font-size','12px')
                    ).addClass('alert bg-primary text-light m-0 h-100')
                ).addClass('col p-1 h-100')
            ).addClass('row p-1 h-50')
        ).append(
            $('<div>').append(
                $('<div>').append(
                    $('<div>').append(
                        $('<h1>').append(
                            $('<span>').html('')
                        ).append(
                            $('<span>').html('').attr('id','sp-vendedores')
                        ).addClass('text-center m-1').css('font-weight','300')
                    ).append(
                        $('<p>').html('vendedores en ruta').addClass('text-light text-center').css('font-size','12px')
                    ).addClass('alert bg-danger text-light m-0 h-100')
                ).addClass('col pt-0 px-1 pb-1 mt-0 h-100')
            ).addClass('row pt-0 px-1 pb-1 h-50')
        ).addClass('container-fluid')
    );
    //alterna los tabs
    setInterval(CambiarTabs,300000);
    //carga la data
    CargarData();
    //arranca el reloj
    IniciaReloj();
    //programa las actualizaciones
    IniciaActualizaciones();
    //inicia el control de mapas
    $(function() {
        ConfiguraMapas();
    });
}

ConfiguraMapas = async () => {
    $("#map-canvas").empty();
    map = new google.maps.Map(document.getElementById("map-canvas"), {
        zoom: 6,
        center: {lat:-10.556860, lng:-75.521769}
    });
}

EscribirMarcadoresVisita = (marcaciones) => {
    let VisitasContainer = $('<div>').addClass('ct-visitas');
    LimpiarMapMarcadores();
    for(punto of marcaciones) {
        let marcador = new google.maps.Marker({
            position: new google.maps.LatLng(parseFloat(punto.lat), parseFloat(punto.lon)),
            title: punto.nombre,
            icon: {
                url: "http://webpedidos.corporacionlife.com.pe/ws-clife/images/markers/" + (punto.covis == 0 ? 'nuevo' : (punto.covis == 99 ? 'inicio' : 'normal')) + "/" + punto.ruc + ".png",
                scaledSize: new google.maps.Size(48, 48), // scaled size
                origin: new google.maps.Point(0,0), // origin
                anchor: new google.maps.Point(24, 24) // anchor
            },
            map: map,
            data: punto
        });
        marcador.addListener("click", function() {
            var thisMarker = this;
            var markerData = thisMarker.data;
            new google.maps.InfoWindow({
                content: 
                    "<table class=\"bg-table bg-" + (markerData.covis == 0 ? 'blue' : (markerData.covis == 99 ? 'green' : 'red')) + "\">" +
                        "<tbody>" +
                            "<tr>" +
                                "<td style=\"padding:10px;\">" +
                                    "<img src=\"http://webpedidos.corporacionlife.com.pe/ws-clife/images/markers/base/" + markerData.ruc + ".jpg\" />" +
                                "</td>" +
                                "<td style=\"padding:10px;\">" +
                                    "<h3>" + markerData.nombre + "</h3>" +
                                    "<p>" + markerData.resul + "</p>" +
                                    "<hr/>" +
                                    "<p><b>Hora:</b> " + markerData.hora + " hrs.</p>" +
                                    "<p><b>Dirección:</b> " + markerData.direc + "</p>" +
                                "</td>" +
                            "</tr>" +
                        "</tbody>" +
                    "</table>"
            }).open(map, thisMarker);
        });
        Markers.set(punto.ruc, marcador);
        //agrega al VisitasContainer
        let bgClase;
        switch(punto.covis) {
            case 0: bgClase = 'bg-primary';break;
            case 99: bgClase = 'bg-success';break;
            default: bgClase = 'bg-warning';break;
        }
        VisitasContainer.append(
            $('<a>').append(
                $('<div>').append(
                    $('<div>').append(
                        $('<img>').attr('src','http://webpedidos.corporacionlife.com.pe/ws-clife/images/markers/base/' + punto.ruc + '.jpg').addClass('w-100').css('border-radius','50%')
                    ).addClass('col-2 pr-0')
                ).append(
                    $('<div>').append(
                        $('<p>').html(punto.nombre).addClass('mb-0')
                    ).append(
                        $('<p>').html(punto.resul + ', a las <span style="font-weight:500;">' + punto.hora + '</span> hrs.').addClass('mb-0').css('font-weight','300')
                    ).addClass('col-10')
                ).addClass('row')
            ).addClass('p-2 m-2 d-block text-light ' + bgClase).attr({
                'data-marker': punto.ruc,
                'id': 'visita-' + punto.ruc
            }).on('click', UbicarMarcacion)
        );
    }
    $('#container-visitas').append(VisitasContainer);
}

UbicarMarcacion = (event) => {
    let codigo = parseInt(event.delegateTarget.dataset.marker);
    let marker = Markers.get(codigo);
    //marker.setPosition(new google.maps.LatLng(-12.091583, -77.027447));
    map.panTo(new google.maps.LatLng(marker.data.lat, marker.data.lon));
    smoothZoom(map, 17, map.getZoom());
}

smoothZoom = (map, max, cnt) => {
    if (cnt >= max) {
        return;
    }
    else {
        z = google.maps.event.addListener(map, 'zoom_changed', function(event){
            google.maps.event.removeListener(z);
            smoothZoom(map, max, cnt + 1);
        });
        setTimeout(function(){map.setZoom(cnt)}, 80); // 80ms is what I found to work well on my system -- it might not work well on all systems
    }
}

LimpiarMapMarcadores = () => {
    if(Markers) {
        for([vendedor, marker] of Markers) {
            marker.setMap(null);
        }
    }
    Markers = new Map();
}

CambiarTabs = () => {
    if(TabbarPrincipal.tabs('avance').isActive()) {
        TabbarPrincipal.tabs('visitas').setActive(true);
    }
    else {
        TabbarPrincipal.tabs('avance').setActive(true);
    }
}

RecargarData = async () => {
    $('#img-loader').attr('src','/assets/images/web/loader-anim.svg');
    let result;
    try {
        result = await $.ajax({
            url: '/avance-ventas/recarga-datos',
            method: 'post',
            data: { empresa: 11, dia: new Date().toJSON().slice(0,10), hora: UltimaActualizacion },
            dataType: 'json'
        });
        GeneraGraficosPolares(result.data.data);
        EscribeGaugeResumen(result.data.avance);
        EscribeInfoVisitas(result.data.visitas);
        ActualizarMarcadoresVisita(result.data.marcaciones);
        ActualizaRegistrosPedidos(result.data.pedidos);
        UltimaActualizacion = result.data.hora;
    }
    catch(error) {
        console.log(error);
    }
}

ActualizaRegistrosPedidos = async (pedidos) => {
    console.log(pedidos);
    for(pedido of pedidos) {
        let iRowId = pedido.pedido;
        if(GridPedidos.getRowIndex(iRowId) > -1) {
            //actualiza datos de la fila
            GridPedidos.cells(iRowId,2).setValue(pedido.cierre);
            GridPedidos.cells(iRowId,9).setValue(pedido.importe);
            GridPedidos.cells(iRowId,10).setValue(pedido.estado);
        }
        else {
            let row = [
                pedido.pedido,
                pedido.apertura,
                pedido.cierre,
                pedido.fventa,
                pedido.tpnegocio,
                pedido.vendedor,
                pedido.ruc,
                pedido.cliente,
                pedido.moneda,
                pedido.importe,
                pedido.estado
            ];
            GridPedidos.addRow(iRowId, row, 0);
        }
        if(pedido.estado == 'Pendiente') {
            GridPedidos.setRowColor(iRowId,'#ffecb3');
        }
        else {
            GridPedidos.setRowColor(iRowId,'#c8e6c9');
        }
    }
}

ActualizarMarcadoresVisita = async (marcaciones) => {
    //
    let VisitasContainer = $('.ct-visitas');
    for(punto of marcaciones) {
        //verifica si existe una marcacion para el vendedor
        if(Markers.has(punto.ruc)) {
            let iMarcador = Markers.get(punto.ruc);
            //verifica si la marcacion es diferente al registro existente
            if(punto.hora != iMarcador.data.hora) {
                Markers.get(punto.ruc).setPosition(new google.maps.LatLng(iMarcador.data.lat, iMarcador.data.lon));
                //quita el listener del marcador
                google.maps.event.clearInstanceListeners(Markers.get(punto.ruc));
                //agrega un nuevo listener
                Markers.get(punto.ruc).addListener("click", function() {
                    var thisMarker = this;
                    var markerData = thisMarker.data;
                    new google.maps.InfoWindow({
                        content: 
                            "<table class=\"bg-table bg-" + (markerData.covis == 0 ? 'blue' : (markerData.covis == 99 ? 'green' : 'red')) + "\">" +
                                "<tbody>" +
                                    "<tr>" +
                                        "<td style=\"padding:10px;\">" +
                                            "<img src=\"http://webpedidos.corporacionlife.com.pe/ws-clife/images/markers/base/" + markerData.ruc + ".jpg\" />" +
                                        "</td>" +
                                        "<td style=\"padding:10px;\">" +
                                            "<h3>" + markerData.nombre + "</h3>" +
                                            "<p>" + markerData.resul + "</p>" +
                                            "<hr/>" +
                                            "<p><b>Hora:</b> " + markerData.hora + " hrs.</p>" +
                                            "<p><b>Dirección:</b> " + markerData.direc + "</p>" +
                                        "</td>" +
                                    "</tr>" +
                                "</tbody>" +
                            "</table>"
                    }).open(map, thisMarker);
                });
                //actualiza el historial de visitas
                let bgClase;
                switch(punto.covis) {
                    case 0: bgClase = 'bg-primary';break;
                    case 99: bgClase = 'bg-success';break;
                    default: bgClase = 'bg-warning';break;
                }
                $('#visita-' + punto.ruc).remove();
                VisitasContainer.prepend(
                    $('<a>').append(
                        $('<div>').append(
                            $('<div>').append(
                                $('<img>').attr('src','http://webpedidos.corporacionlife.com.pe/ws-clife/images/markers/base/' + punto.ruc + '.jpg').addClass('w-100').css('border-radius','50%')
                            ).addClass('col-2 pr-0')
                        ).append(
                            $('<div>').append(
                                $('<p>').html(punto.nombre).addClass('mb-0')
                            ).append(
                                $('<p>').html(punto.resul + ', a las <span style="font-weight:500;">' + punto.hora + '</span> hrs.').addClass('mb-0').css('font-weight','300')
                            ).addClass('col-10')
                        ).addClass('row')
                    ).attr({
                        'data-marker': punto.ruc,
                        'id': 'visita-' + punto.ruc
                    }).addClass('p-2 m-2 d-block text-light ' + bgClase).on('click', UbicarMarcacion)
                );
            }
        }
        else {
            let marcador = new google.maps.Marker({
                position: new google.maps.LatLng(parseFloat(punto.lat), parseFloat(punto.lon)),
                title: punto.nombre,
                icon: {
                    url: "http://webpedidos.corporacionlife.com.pe/ws-clife/images/markers/" + (punto.covis == 0 ? 'nuevo' : (punto.covis == 99 ? 'inicio' : 'normal')) + "/" + punto.ruc + ".png",
                    scaledSize: new google.maps.Size(48, 48), // scaled size
                    origin: new google.maps.Point(0,0), // origin
                    anchor: new google.maps.Point(24, 24) // anchor
                },
                map: map,
                data: punto
            });
            marcador.addListener("click", function() {
                var thisMarker = this;
                var markerData = thisMarker.data;
                new google.maps.InfoWindow({
                    content: 
                        "<table class=\"bg-table bg-" + (markerData.covis == 0 ? 'blue' : (markerData.covis == 99 ? 'green' : 'red')) + "\">" +
                            "<tbody>" +
                                "<tr>" +
                                    "<td style=\"padding:10px;\">" +
                                        "<img src=\"http://webpedidos.corporacionlife.com.pe/ws-clife/images/markers/base/" + markerData.ruc + ".jpg\" />" +
                                    "</td>" +
                                    "<td style=\"padding:10px;\">" +
                                        "<h3>" + markerData.nombre + "</h3>" +
                                        "<p>" + markerData.resul + "</p>" +
                                        "<hr/>" +
                                        "<p><b>Hora:</b> " + markerData.hora + " hrs.</p>" +
                                        "<p><b>Dirección:</b> " + markerData.direc + "</p>" +
                                    "</td>" +
                                "</tr>" +
                            "</tbody>" +
                        "</table>"
                }).open(map, thisMarker);
            });
            Markers.set(punto.ruc, marcador);
            //agrega el marcador
            //agrega al VisitasContainer
            let bgClase;
            switch(punto.covis) {
                case 0: bgClase = 'bg-primary';break;
                case 99: bgClase = 'bg-success';break;
                default: bgClase = 'bg-warning';break;
            }
            VisitasContainer.prepend(
                $('<a>').append(
                    $('<div>').append(
                        $('<div>').append(
                            $('<img>').attr('src','http://webpedidos.corporacionlife.com.pe/ws-clife/images/markers/base/' + punto.ruc + '.jpg').addClass('w-100').css('border-radius','50%')
                        ).addClass('col-2 pr-0')
                    ).append(
                        $('<div>').append(
                            $('<p>').html(punto.nombre).addClass('mb-0')
                        ).append(
                            $('<p>').html(punto.resul + ', a las <span style="font-weight:500;">' + punto.hora + '</span> hrs.').addClass('mb-0').css('font-weight','300')
                        ).addClass('col-10')
                    ).addClass('row')
                ).addClass('p-2 m-2 d-block text-light ' + bgClase).attr('data-marker',punto.ruc).on('click', UbicarMarcacion)
            );
        }
    }
}

CargarData = async () => {
    $('#img-loader').attr('src','/assets/images/web/loader-anim.svg');
    let result;
    try {
        result = await $.ajax({
            url: '/avance-ventas/datos-tablero-control',
            method: 'post',
            data: { empresa: 11, dia: new Date().toJSON().slice(0,10) },
            dataType: 'json'
        });
        let { inicio, fin } = result.data.periodos;
        UltimaActualizacion = result.data.hora;
        GeneraGraficosPolares(result.data.data);
        GeneraGraficoPeriodos(result.data.ventas);
        EscribeGaugeResumen(result.data.avance);
        EscribeInfoVisitas(result.data.visitas);
        EscribirMarcadoresVisita(result.data.marcaciones);
        CargaDataGrid('C');
    }
    catch(error) {
        console.log(error);
    }
}

EscribeInfoVisitas = (info) => {
    let todos = info.todos;
    let nuevos = info.nuevos;
    let enruta = info.vendedores;
    document.getElementById('clientes-cartera').innerHTML = todos - nuevos;
    document.getElementById('clientes-nuevos').innerHTML = nuevos;
    document.getElementById('sp-vendedores').innerHTML = enruta;
}

EscribeGaugeResumen = (avance) => {
    $('#ch-resumen').empty().highcharts({
        chart: {
            type: 'solidgauge',
            spacingTop: 10,
            spacingBottom: -5
        },
        title: {
            text: 'Avance - Periodo actual'
        },
        pane: {
            center: ['50%', '55%'],
            size: '100%',
            startAngle: -135,
            endAngle: 135,
            background: {
                backgroundColor: '#ffffff',
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
            },
            min: 0,
            max: avance.cuota,
            title: null
        },
        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
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
                format: '<div style="text-align:center"><span style="font-size:20px;color:black;">S/ {y:,.0f}</span><br/>' +
                    //((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">S/ {y:,.0f}</span><br/>' +
                    '<span style="font-size:10px;color:#808080;font-weight:300;">de S/ ' + avance.cuota.toLocaleString('en-us',{minimumFractionDigits:0,maximumFractionDigits:0}) + '</span></div>'
            },
            tooltip: {
                valuePrefix: 'S/ '
            }
        }]

    });
}

GeneraGraficoPeriodos = (dataVentas) => {
    if(!periodosListo) {
        periodosListo = true;
        $('#div-periodos').empty();
        //highcharts
        let EtiquetasGraficoPeriodos = [];
        let ValoresGraficoPeriodos = [];
        for(let i in dataVentas) {
            let iPeriodo = dataVentas[i];
            EtiquetasGraficoPeriodos.push(iPeriodo.periodo);
            ValoresGraficoPeriodos.push(iPeriodo.importe);
        }
        $('#div-periodos').highcharts({
            chart: { type: 'column' },
            title: {
                text: 'Ventas - últimos 12 periodos'
            },
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
}

CargaDataGrid = (modo) => {
    let hoy = new Date().toJSON().slice(0,10).replace(/-/g,'');
    GridPedidos.clearAll();
    GridPedidos.load('/avance-ventas/carga-pedidos-dia/' + hoy + '/11/' + encodeURI(UltimaActualizacion) + '/' + modo, () => {
        let NumeroFilas = GridPedidos.getRowsNum();
        for(let i = 0; i < NumeroFilas; i++) {
            let iRowId = GridPedidos.getRowId(i);
            let estado = GridPedidos.cells(iRowId,10).getValue();
            if(estado == 'Pendiente') {
                GridPedidos.setRowColor(iRowId,'#ffecb3');
            }
        }
        $('#img-loader').attr('src','/assets/images/web/loader-blank.svg');
        $('#sp-uactualiza').html(sHoraActual);
    });
}

GeneraGraficosPolares = (dataTotal) => {
    let MapTpnegocio = new Map();
    let MapFventas = new Map();
    for(let iDato of dataTotal) {
        let { periodo, cfzavta, fzavta, ctpnegocio, tpnegocio, avance, proyeccion } = iDato;
        //datos por canal de distribucion
        if(MapTpnegocio.has(ctpnegocio)) {
            let iTpnegocio = MapTpnegocio.get(ctpnegocio);
                iTpnegocio.avance += avance;
                iTpnegocio.proyeccion += proyeccion;
            MapTpnegocio.set(ctpnegocio, iTpnegocio);
        }
        else {
            MapTpnegocio.set(ctpnegocio, {
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
    //insertar los pinches gráficos
    let TpnegocioCategorias = [], FventaCategorias = [];
    let TpnegocioAvance = [], FventaAvance = [];
    //canal de distribucion
    for([codigo,tpnegocio] of MapTpnegocio) {
        let iPorcentaje = 1 + 80 * Math.random();
        TpnegocioCategorias.push(tpnegocio.nombre);
        TpnegocioAvance.push({
            y: iPorcentaje,
            color: Colores[Math.ceil(iPorcentaje / 25)],
            avance: tpnegocio.avance,
            cuota: tpnegocio.proyeccion
        });
    }
    $('#polar-tpnegocio').highcharts({
        chart: {
            polar: true
        },
        credits: {
            enabled: false
        },
        title: { text: 'Avance por canal de distribución' },
        legend: {
            enabled: false
        },
        pane: {
            background: {
                backgroundColor: '#ffffff'
            },
            startAngle: 0,
            endAngle: 360
        },
        xAxis: {
            categories: TpnegocioCategorias,
            tickmarkPlacement: 'on',
            lineWidth: 0
        },
        yAxis: {
            min: 0,
            labels: {
                formatter: function () {
                    return this.value + '%';
                }
            }
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: false
                }
            },
            area: {
                color: '#f0f0f0',
                lineColor: '#1e88e5',
                lineWidth: 1,
                tooltip: {
                    pointFormat: 'Avance: <span style="color:{point.color}"><b>{point.y:.2f}%</span></b><br>' +
                        '<span style="color:#808080;">S/ {point.avance:,.2f} de S/ {point.proyeccion:,.2f}</span>'
                }
            }
        },
        series: [{
            type: 'area',
            name: 'Avance',
            data: TpnegocioAvance
        }]
    });
    //fuerza de venta
    for([codigo,fventa] of MapFventas) {
        let iPorcentaje = 1 + 80 * Math.random();
        FventaCategorias.push(fventa.nombre);
        FventaAvance.push({
            y: iPorcentaje,
            color: Colores[Math.ceil(iPorcentaje / 25)],
            avance: fventa.avance,
            cuota: fventa.proyeccion
        });
    }
    $('#polar-fventa').highcharts({
        chart: {
            polar: true
        },
        credits: {
            enabled: false
        },
        title: { text: 'Avance por fuerza de venta' },
        legend: {
            enabled: false
        },
        pane: {
            background: {
                backgroundColor: '#ffffff'
            },
            startAngle: 0,
            endAngle: 360
        },
        xAxis: {
            categories: FventaCategorias,
            tickmarkPlacement: 'on',
            lineWidth: 0
        },
        yAxis: {
            min: 0,
            labels: {
                formatter: function () {
                    return this.value + '%';
                }
            }
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: false
                }
            },
            area: {
                color: '#f0f0f0',
                lineColor: '#1e88e5',
                lineWidth: 1,
                tooltip: {
                    pointFormat: 'Avance: <span style="color:{point.color}"><b>{point.y:.2f}%</span></b><br>' +
                        '<span style="color:#808080;">S/ {point.avance:,.2f} de S/ {point.proyeccion:,.2f}</span>'
                }
            }
        },
        series: [{
            type: 'area',
            name: 'Avance',
            data: FventaAvance
        }]
    });
}

IniciaReloj = () => {
    console.log('Iniciando reloj a las ',cHora < 10 ? '0' : '',cHora,cMinuto < 10 ? '0' : '',cMinuto,cSegundo < 10 ? '0' : '',cSegundo);
    sHoraActual = (cHora < 10 ? '0' : '') + cHora + ':' + (cMinuto < 10 ? '0' : '') + cMinuto + ':' + (cSegundo < 10 ? '0' : '') + cSegundo;
    setInterval(() => {
        if(cSegundo < 59) cSegundo++;
        else {
            if(cMinuto < 59) cMinuto++;
            else {
                if(cHora < 23) cHora++;
                else cHora = 0;
                cMinuto = 0;
            }
            cSegundo = 0;
        }
        document.getElementById('c-hora').innerHTML = (cHora < 10 ? '0' : '') + cHora;
        document.getElementById('c-minuto').innerHTML = (cMinuto < 10 ? '0' : '') + cMinuto;
        document.getElementById('c-segundo').innerHTML = (cSegundo < 10 ? '0' : '') + cSegundo;
        sHoraActual = (cHora < 10 ? '0' : '') + cHora + ':' + (cMinuto < 10 ? '0' : '') + cMinuto + ':' + (cSegundo < 10 ? '0' : '') + cSegundo;
    }, 1000);
}

IniciaActualizaciones = () => {
    setInterval(RecargarData, 60000);
}