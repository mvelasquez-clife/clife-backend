//var BASE_URL = "http://localhost:3000/api/";
const BASE_URL = "/api/";
var usrtoken = localStorage.getItem('jwt') || '';
var usrJson = JSON.parse(localStorage.getItem('usrjson')) || '';
const formatMoneda = new Intl.NumberFormat('en', {
    notation: 'standard', // This is the implied default.
    style: 'currency',
     currency: 'PEN',
  });
  const formatNumber = new Intl.NumberFormat('en', {
    notation: 'standard'
  
  });
const HighchartsDrill = (container,titulo,subtitulo,tipgrafico,brandsData,drilldownSeries) => { 
var options = {chart: {type: tipgrafico, autowidth: true}, title: {text: titulo}, subtitle: {text: subtitulo}, legend: {layout: 'horizontal', backgroundColor: '#FFFFFF', floating: true, align: 'left', verticalAlign: 'top', x: 10, y: 45, Formatter: function () {
        var point = this.point, s = point.name + '</br><b>S/. ' + formatMoneda.format(point.y) + ' </b>';
        return s;
    }}, plotOptions: {pie: {allowPointSelect: false, slicedOffset: 0,
        cursor: 'pointer', dataLabels: {enabled: true}
    }, series: {cursor: 'pointer',  dataLabels: {enabled: true, formatter: function () {
                var point = this.point;
                s = point.name  + ' <br/>(' + ((point.y / point.total) * 100).toFixed(2) + '%) ' +  formatMoneda.format(point.y) + '  <b>';
                return s;
            }}
        }
        },
tooltip: {formatter: function () {
        var point = this.point, s = point.name + ':<br/> ' + formatMoneda.format(point.y) + ' (' + ((point.y / point.total) * 100).toFixed(2) + '%) <b>';
        return s;
    }}, series: [{name: 'V.General', colorByPoint: true, data: brandsData}],
     drilldown: {drillUpButton: {relativeTo: 'spacingBox', position: {y: 0, x: 0}, theme: {fill: 'white', 'stroke-width': 1, stroke: 'silver', r: 0, states: {hover: {fill: '#bada55'}, select: {stroke: '#039', fill: '#bada55'}, click: function () {
                    window.alert('valor');
                }}}, events: {click: function () {
                window.alert('valor');
            }}}, series: drilldownSeries
}
};
options.chart.renderTo = container;
options.chart.type = tipgrafico;
charttotal = new Highcharts.Chart(options);
};
const HighchartsGraf = (container,titulo,subtitulo,tipgrafico,brandsData,drilldownSeries) => { 
    var options = {
        chart: {type: tipgrafico, plotBackgroundColor: null,plotBorderWidth: null,   plotShadow: false,autowidth: true}, 
        title: {text: titulo}, 
        subtitle: {text: subtitulo}, legend: {}, 
        plotOptions: {
            pie: {allowPointSelect: false, slicedOffset: 0,
            cursor: 'pointer',
             dataLabels: {enabled: true , formatter: function () {
                var point = this.point;
                s = point.name  + ' <br/>(' + ((point.y / point.total) * 100).toFixed(2) + '%) ' +  formatMoneda.format(point.y) + '  <b>';
                return s;
            } }
            }, /*series: {cursor: 'pointer',  dataLabels: {enabled: true, formatter: function () {
                    var point = this.point;
                    s = point.name  + ' <br/>(' + ((point.y / point.total) * 100).toFixed(2) + '%) ' +  formatMoneda.format(point.y) + '  <b>';
                    return s;
                }}
            }*/
            },
    tooltip: {formatter: function () {
           var point = this.point;
                    s = point.name  + ' <br/>(' + ((point.y / point.total) * 100).toFixed(2) + '%) ' +  formatMoneda.format(point.y) + '  <b>';
                    return s;
        }}, 
        series: [{name: ' D.General', colorByPoint: true, data: brandsData}],
        
    };

    options.chart.renderTo = container;
    options.chart.type = tipgrafico;
    charttotal = new Highcharts.Chart(options);
    }