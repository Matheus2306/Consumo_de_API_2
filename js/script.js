$(document).ready(function () {
  //ocultar a div erro
  $("#div-erro").hide();
  $("#Grafico-precos").hide();
  async function carregardados() {
    try {
      $("#Grafico-precos").show();
      $("#div-erro").hide();
      $("#Grafico-Volume").show();
      //carregar os dados
      const response = await fetch(
        "https://www.mercadobitcoin.net/api/BTC/trades/"
      );
      const dados = await response.json();
      // Filtrar os dados para mostrar apenas compra e venda
      const dadosFiltrados = dados.filter(
        (trade) => trade.type === "buy" || trade.type === "sell"
      );
      prepararMapas(dadosFiltrados);
    } catch (error) {
      //mostrar a mensagem de erro
      $("#div-erro").show();
      $("#div-erro").html("<h1>Erro ao carregar os dados</h1>");
    }
  }

  prepararMapas = (dados) => {
    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      var Array = [["Data", "Preço"]];
      $.each(dados, function (i, value) {
        Array.push([new Date(value.date * 1000), value.price]);
      });
      var data = google.visualization.arrayToDataTable(Array);

      var options = {
        title: "Variação do preço do Bitcoin",
        curveType: "function",
        legend: { position: "right" },
      };

      var chart = new google.visualization.LineChart(
        document.getElementById("Grafico-precos")
      );

      chart.draw(data, options);
    }

    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(drawPieChart);

    function drawPieChart() {
      var compra = 0;
      var venda = 0;
      $.each(dados, function (i, value) {
        if (value.type === "buy") {
          compra += value.amount;
        } else if (value.type === "sell") {
          venda += value.amount;
        }
      });
      var data = google.visualization.arrayToDataTable([
        ["Tipo", "Quantidade"],
        ["Compra", compra],
        ["Venda", venda],
      ]);

      var options = {
        title: "Compra e Venda de Bitcoin",
        legend: { position: "right" },
      };

      var chart = new google.visualization.PieChart(
        document.getElementById("Grafico-Volume")
      );

      chart.draw(data, options);
    }
  };
  // tornar a função acessível globalmente
  window.carregardados = carregardados;
});
