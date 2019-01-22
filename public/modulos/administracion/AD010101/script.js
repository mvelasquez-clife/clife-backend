eliminarMarcadores = () => {
    if(markers) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
    }
    markers = new Array();
    if(directionsDisplay) {
        directionsDisplay.setMap(null);
        directionsDisplay = null;
    }
}

trazarMarcadoresRuta = () => {
	eliminarMarcadores();
    var d = 0;
    var center = { lat:0, lon:0 };
    var waypts = [];
    var start, end;
    visitasGrid.clearAll();
    for(var z in ls_puntos) {
		var zpunto = ls_puntos[z];
		var latitud = parseFloat(zpunto.lat + "");
        var longitud = parseFloat(zpunto.lon + "");
		//
		const idx = parseInt(z) + 1;
		visitasGrid.addRow(idx, ['' + idx, zpunto.cliente, zpunto.resultado, zpunto.inicio, zpunto.fin, latitud, longitud]);
		//
        if(latitud != 0) {
        	visitasGrid.setCellTextStyle(idx, 0, "color:#1565c0;cursor:pointer;text-decoration:underline;");
            center.lat += latitud;
            center.lon += longitud;
            waypts.push({
                location: {lat:latitud, lng:longitud},
                stopover: false
            });
            if(!start) start = {lat:latitud, lng:longitud};
            end = {lat:latitud, lng:longitud};
            markers[d] = new google.maps.Marker({
                position: new google.maps.LatLng(latitud, longitud),
                label: (d + 1) + "",
                title: zpunto.cliente,
                map: map,
                data: {
                    title: zpunto.cliente,
                    resultado: zpunto.resultado,
                    inicio: zpunto.inicio,
                    fin: zpunto.fin
                }
            });
            markers[d].addListener("click", function() {
                var thisMarker = this;
                var markerData = thisMarker.data;
                new google.maps.InfoWindow({
                    content: 
                        "<table class=\"bg-table bg-blue\">" +
                            "<tbody>" +
                                "<tr>" +
                                    "<td style=\"padding:10px;\">" +
                                        "<img src=\"http://www.academiamexico.org/wp-content/uploads/2017/05/icono-exponegocios-02.png\" style=\"width:160px\" />" +
                                    "</td>" +
                                    "<td style=\"padding:10px;\">" +
                                        "<h3>" + markerData.title + "</h3>" +
                                        "<p><b>Resultado: </b>" + markerData.resultado + "</p>" +
                                        "<hr/>" +
                                        "<p><b>Hora:</b> " + markerData.inicio + "-" + markerData.fin + " hrs.</p>" +
                                    "</td>" +
                                "</tr>" +
                            "</tbody>" +
                        "</table>"
                }).open(map, thisMarker);
            });
            d++;
        }
        else {
        	visitasGrid.setCellTextStyle(idx, 0, "color:crimson;");
        	visitasGrid.setCellTextStyle(idx, 1, "color:crimson;");
        	visitasGrid.setCellTextStyle(idx, 2, "color:crimson;");
        	visitasGrid.setCellTextStyle(idx, 3, "color:crimson;");
        	visitasGrid.setCellTextStyle(idx, 4, "color:crimson;");
        }
	}
    if(d > 0) {
        center.lat = center.lat / d;
        center.lon = center.lon / d;
        map.panTo(new google.maps.LatLng(center.lat, center.lon));
        map.setZoom(15);
        if(d > 1) {
            directionsDisplay = new google.maps.DirectionsRenderer();
            var directionsService = new google.maps.DirectionsService();
            var request = {
                origin: start,
                destination: end,
                waypoints: waypts,
                optimizeWaypoints: false,
                travelMode: google.maps.TravelMode.WALKING
            };
            directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                }
            });
            directionsDisplay.setMap(map);
            directionsDisplay.setOptions({suppressMarkers:true});
        }
    }
}

iniciarMapa = () => {
    $("#map-canvas").empty();
    map = new google.maps.Map(document.getElementById("map-canvas"), {
        zoom: 12,
        center: {lat:-12.091583, lng:-77.027447}
    });
}

vendedoresGridOnRowSelect = (rowId, colId) => {
	switch(colId) {
		case 2:
			mainLayout.cells("b").progressOn();
			mainLayout.cells("c").progressOn();
			mainLayout.cells("c").setText("Detalle de visitas | " + vendedoresGrid.cells(rowId,1).getValue());
			mainLayout.cells("c").expand();
			var p = {
				token: usrtoken,
				vendedor: rowId,
				empresa: usrJson.empresa,
				dia: '2018-10-09'
			};
			$.post(BASE_URL + "cartera/ruta", p, function(response) {
				ls_puntos = response.puntos;
				trazarMarcadoresRuta();
				mainLayout.cells("b").progressOff();
				mainLayout.cells("c").progressOff();
			}, "json").fail((err) => {
				console.log(err);
				mainLayout.cells("b").progressOff();
				mainLayout.cells("c").progressOff();
			});
			break;
		default: break;
	}
}

visitasGridOnRowSelect = (rowId, colId) => {
	if(parseFloat(visitasGrid.cells(rowId,5).getValue()) != 0) {
		var center = new google.maps.LatLng(parseFloat(visitasGrid.cells(rowId,5).getValue()), parseFloat(visitasGrid.cells(rowId,6).getValue()));
	    map.setZoom(18);
	    map.panTo(center);
	}
}