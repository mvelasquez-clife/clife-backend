IniciarComponentes = () => {
    Layout = new dhtmlXLayoutObject(document.body, '2U');
    Layout.cells("a").hideHeader(),Layout.cells("b").hideHeader(), Layout.cells("a").setWidth(250);
    Formfiltros = Layout.cells("a").attachForm(Formfilter); 
    Layout.cells("b").attachHTMLString('<div id="graph_cr010902t" style="height:100%;width:100%;margin:0 auto;padding:30px 3px;box-sizing:border-box;float:left;"></div>');
    Layout.attachEvent("onResizeFinish", function(){
        charttotal.reflow();
    });
    Formfiltros.attachEvent("onButtonClick", function (name) { Formfiltrosclic(name);});
}

function Formfiltrosclic(nam){
    let ch_ini =Formfiltros.getItemValue('ch_inicial'), ch_tipo = Formfiltros.getItemValue('rtipo'), ch_ven =Formfiltros.getItemValue('rvenc'), ch_doc =Formfiltros.getItemValue('rdoc');
    if(ch_ini === 'tot'){
        rep_totales(usrJson.empresa,Formfiltros.getItemValue('periodo_st'));
     }else{
        rep_filtros(usrJson.empresa,ch_tipo,ch_ven,ch_doc, Formfiltros.getItemValue('periodo_st'));
    }
}
function rep_filtros(emp,tipo,venc,doc, periodo) {
    let   brandsData = [],  drilldownSeries = [];
    $.ajax({dataType: "json", url: BASE_URL + 'CR010902/data_filtro/'+emp+'/'+periodo+'/'+tipo+'/'+venc+'/'+doc,
        beforeSend: function () {
            $("#graph_cr010902t").html('<center><h3>Cargando datos..</h3></center>');
        }, success: function (result) { 
            $.each(result.data, function (i) { 
                brandsData.push({name: result.data[i].name, y: result.data[i].y,   drilldown: result.data[i].name});
          });
          HighchartsGraf( 'graph_cr010902t',result.title + formatMoneda.format(result.total),result.subtitle ,'pie',brandsData,drilldownSeries) ;
           /* $.each(result.data, function (i) { 
                  brandsData.push({name: result.data[i].name, y: result.data[i].y,   drilldown: result.data[i].name});
            });
                 $.ajax({  dataType: "json", url: BASE_URL + 'CR010902/data_filtro_deta/'+emp+'/'+periodo+'/'+tipo+'/'+venc+'/'+doc,
                                success: function (resultd) { 
                                     $.each(resultd, function (i) { 
                                        drilldownSeries.push({name: resultd[i].name, id: resultd[i].id, data: resultd[i].data
                                        });
                                    }); 
                                    HighchartsDrill( 'graph_cr010902t',' DEUDA TOTAL :' + formatMoneda.format(result.total),'VENCIDOS / NO VENCIDOS','pie',brandsData,drilldownSeries) ;
                               }
                            });*/
        }
    });
}
function rep_totales(emp, periodo) {
    let   brandsData = [],  drilldownSeries = [];
    $.ajax({dataType: "json", url: BASE_URL + 'CR010902/data_total/'+emp+'/'+periodo,
        beforeSend: function () {
            $("#graph_cr010902t").html('<center><h3>Cargando datos..</h3></center>');
        }, success: function (result) { 
            $.each(result.data, function (i) { 
                  brandsData.push({name: result.data[i].name, y: result.data[i].y,   drilldown: result.data[i].name});
            });
                 $.ajax({  dataType: "json", url: BASE_URL + 'CR010902/data_tot_deta/'+emp+'/'+periodo,
                                success: function (resultd) { 
                                     $.each(resultd, function (i) { 
                                        drilldownSeries.push({name: resultd[i].name, id: resultd[i].id, data: resultd[i].data
                                        });
                                    }); 
                                    HighchartsDrill( 'graph_cr010902t',' DEUDA TOTAL :' + formatMoneda.format(result.total),'VENCIDOS / NO VENCIDOS','pie',brandsData,drilldownSeries) ;
                               }
                                
                            });
        }
    });
}