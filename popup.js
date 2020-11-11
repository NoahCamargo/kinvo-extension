function drawChart() {
  chrome.storage.sync.get(['distributionProducts', 'lastUpdate'], (storage) => {
    distribution_products = storage.distributionProducts

    console.log("distribution received")

    distribution_products = Object.values(distribution_products).map((data) => [data.example, data.value])
    console.log(distribution_products)
    var data = google.visualization.arrayToDataTable([['Tipo', 'Valor total']].concat(distribution_products));

    var options = {
      title: 'Distribuição dos produtos',
      pieHole: 0.4,
      chartArea: { top: 40, width: '100%', height: '88.5%' }
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

    chart.draw(data, options);
    document.getElementById('last-update').textContent = storage.lastUpdate
  });
}

document.addEventListener('DOMContentLoaded', function () {
  google.charts.load('current', { 'packages': ['corechart'] });
  google.charts.setOnLoadCallback(drawChart);

  document.getElementById("update-chart").addEventListener("click", () => {
    href = 'https://app.kinvo.com.br/meus-produtos'
    chrome.tabs.getSelected(null, function (tab) { chrome.tabs.update(tab.id, { url: href }); });
    window.close();
  });
});


