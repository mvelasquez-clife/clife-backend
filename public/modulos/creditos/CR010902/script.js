IniciarComponentes = () => {
    LayoutT = new dhtmlXLayoutObject(document.body, '2E');
    LayoutT.cells("a").hideHeader(), LayoutT.cells("b").hideHeader(), LayoutT.cells('a').setHeight(31), LayoutT.setSeparatorSize(0, 0), LayoutT.setSeparatorSize(1, 0);
    dhxToolbar = LayoutT.cells("a").attachToolbar();
    dhxToolbar.addText('cb', 0, '<div id="combo" style="width:200px; height:30px; margin-top: -4px;">');
    dhxCombo = new dhtmlXCombo("combo", "cmb", 200);
    dhxCombo.load(BASE_URL + 'CR010902/list_periodo/' + usrJson.empresa);
    dhxToolbar.addSeparator(null, null);
    dhxToolbar.addButton('btn', null, 'Generar Gráfico', '', '');
    Dhxtabbar = LayoutT.cells("b").attachTabbar();
    Dhxtabbar.addTab("a1", "Deuda/Vendedor", null, null, true);
    Dhxtabbar.addTab("a2", "Deuda/Negocio");
    Dhxtabbar.addTab("a3", "Deuda/Provincias");
    //tabbar_ini();
    dhxToolbar.attachEvent("onClick", function (id) {
        let actvId = Dhxtabbar.getActiveTab();
        actvId === 'a1' ? rep_totales(usrJson.empresa, dhxCombo.getSelectedValue(), 'graph_cr010902a1', 'data_tot_deta', 'POR DIAS DE VENCIMIENTO / VENDEDORES') :
            actvId === 'a2' ? rep_totales(usrJson.empresa, dhxCombo.getSelectedValue(), 'graph_cr010902a2', 'data_tot_nego', 'POR DIAS DE VENCIMIENTO / TIPO DE NEGOCIO') :
                actvId === 'a3' ? rep_totales(usrJson.empresa, dhxCombo.getSelectedValue(), 'graph_cr010902a3', 'data_tot_deta') : null;

    });

    Layout1 = new dhtmlXLayoutObject(Dhxtabbar.tabs("a1"), '2U'), Layout2 = new dhtmlXLayoutObject(Dhxtabbar.tabs("a2"), '2U'), Layout3 = new dhtmlXLayoutObject(Dhxtabbar.tabs("a3"), '2U');
    Layout1.cells("a").hideHeader(), Layout1.cells('b').setText("Detalle por Factura"), Layout1.cells('b').collapse();
    Layout2.cells("a").hideHeader(), Layout2.cells('b').setText("Detalle por Factura"), Layout2.cells('b').collapse();
    Layout3.cells("a").hideHeader(), Layout3.cells('b').setText("Detalle por Factura"), Layout3.cells('b').collapse();
    Layout1.cells("a").attachHTMLString('<div id="graph_cr010902a1" style="height:100%;width:100%;margin:0 auto;padding:30px 3px;box-sizing:border-box;float:left;"></div>');
    Layout2.cells("a").attachHTMLString('<div id="graph_cr010902a2" style="height:100%;width:100%;margin:0 auto;padding:30px 3px;box-sizing:border-box;float:left;"></div>');
    Layout3.cells("a").attachHTMLString('<div id="graph_cr010902a3" style="height:100%;width:100%;margin:0 auto;padding:30px 3px;box-sizing:border-box;float:left;"></div>');
}

function rep_totales(emp, periodo, html, grilla, subtitle) {
    let brandsData = [], drilldownSeries = [];
    $.ajax({
        dataType: "json", url: BASE_URL + 'CR010902/data_total/' + emp + '/' + periodo,
        beforeSend: function () {
            $("#" + html).html('<center><h3>Cargando datos..</h3></center>');
        }, success: function (result) {
            brandsData = result.data;
            $.ajax({
                dataType: "json", url: BASE_URL + 'CR010902/' + grilla + '/' + emp + '/' + periodo,
                success: function (resultd) {
                    drilldownSeries = resultd,
                        HighchartsDrill(html, ' DEUDA TOTAL :' + formatMoneda.format(result.total), subtitle, 'pie', brandsData, drilldownSeries, 'Por dias Vencidos');
                }
            });
        }
    });
}

function clic_grafico(valor) {
    console.log(valor);
    actvId = Dhxtabbar.getActiveTab();
    let Layput_;
    v_tot_ = actvId === 'a1' ? 'v_total1' : actvId === 'a2' ? 'v_total2' : actvId === 'a3' ? 'v_total3' : null;
    Griddeta_ = actvId === 'a1' ? 'grilla_deta' : actvId === 'a2' ? 'grilla_detnego' : actvId === 'a3' ? 'grilla_depar' : null;
    Layput_ = actvId === 'a1' ? Layout1 : actvId === 'a2' ? Layout2 : actvId === 'a3' ? Layout3 : null;
    Gridt_ = actvId === 'a1' ? DhxGrid_1 : actvId === 'a2' ? DhxGrid_2 : actvId === 'a3' ? DhxGrid_3 : null;
    Layput_.cells('b').setText("Detalle total por Factura de " + valor[0]), dhxGrid_fac ? dhxGrid_fac.clearAll() : null, Layput_.cells('b').expand(), Layput_.cells("b").setWidth(550);
    Gridt_ = Layput_.cells("b").attachGrid();
    Gridt_.setHeader("DOCUM,F.VENC,C.CLIENTE,NOMBRE CLIENTE,MONTO.FAC,DEUDA,NOMBRE", null, ["text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;"]);
    Gridt_.setColTypes("ro,ro,ro,ro,ron,ron,ro,ro,ro");
    Gridt_.setInitWidthsP("18,20,17,30,15,15,15,10"); //2
    Gridt_.setColAlign("left,center,right,left,right,right,left,left");
    Gridt_.setColSorting("str,str,str,str,int,int,str,str");
    Gridt_.setNumberFormat("0,000,000.00", 4);
    Gridt_.setNumberFormat("0,000,000.00", 5);
    Gridt_.attachFooter("<div style=\" text-align:right; font-weight: bold;\">TOTAL</div>,#cspan,<div style=\" text-align:right; font-weight: bold;\" id=" + v_tot_ + "></div>,#cspan");
    Gridt_.init();
    loadGridData_nota(BASE_URL + 'CR010902/' + Griddeta_ + '/' + usrJson.empresa + '/' + dhxCombo.getSelectedValue() + '/' + valor[2], true, Gridt_, Layput_.cells('b'), true);
    charttotal.reflow()
}
function loadGridData_nota(ruta, firstLoad, grid, contenedor, footer) {
    contenedor.progressOn();
    if (firstLoad == true) {
        grid.load(ruta, function doOnGridLoaded() {
            if (footer)
                calculateFooterValues_nota(grid);
            contenedor.progressOff()
        });
    }
}
function calculateFooterValues_nota(grid) {
    total_n = sumColumndecimal2(5, grid, 2);//180 total
    var v_total = actvId === 'a1' ? document.getElementById("v_total1") : actvId === 'a2' ? document.getElementById("v_total2") : actvId === 'a3' ? document.getElementById("v_total3") : null;
    v_total.innerHTML = total_n;
    return true;
}

function sumColumndecimal2(ind, grid, dec) {
    var outd = 0;
    var example = grid.getAllItemIds();
    var numbers = example.split(',');
    var i = 0;
    while (i < numbers.length) {
        outd += parseFloat(grid.cells(numbers[i], ind).getValue());
        i++;
    }
    return formatMoneda.format(outd);// outd.toFixed(dec);
}