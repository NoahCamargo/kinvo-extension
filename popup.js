var color = 'rgb(76, 48, 155)';

function drawChart() {
  chrome.storage.sync.get(['distributionProducts', 'lastUpdate'], (storage) => {
    distribution_products = storage.distributionProducts

    console.log("distribution received")

    distribution_products = Object.values(distribution_products).map((data) => [data.example, data.value])
    console.log(distribution_products)
    var data = google.visualization.arrayToDataTable([['Tipo', 'Valor total']].concat(distribution_products));

    var options = {
      title: 'Distribuição dos produtos',
      titleTextStyle: { color: color, bold: true, fontSize: 16, fontName: 'Roboto' },
      pieHole: 0.4,
      chartArea: { top: 40, width: '100%', height: '88.5%' }
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

    chart.draw(data, options);
    document.getElementById('last-update').textContent = storage.lastUpdate
  });
}

function groupBy(list, get_key) {
  return list.reduce((accumulator, currentValue) => {
    key = get_key(currentValue)

    if (accumulator[key])
      accumulator[key] = accumulator[key].concat([currentValue])
    else
      accumulator[key] = [currentValue]

    return accumulator
  }, {})
}

function drawStuff() {
  chrome.storage.sync.get(['dividendsStatementProducts', 'lastStatementUpdate'], (storage) => {
    distribution_products = storage.dividendsStatementProducts
    distribution_products = groupBy(distribution_products, (x) => x[0].replace(/[0-9]+/, ''))
    distribution_products = Object.entries(distribution_products).map((x) => [x[0], x[1].reduce((a, c) => a + c[1], 0)])
    distribution_products = distribution_products.reverse()

    total = distribution_products.reduce((a, c) => a + c[1], 0)

    console.log(distribution_products)
    var data = google.visualization.arrayToDataTable([['', '']].concat(distribution_products));

    var options = {
      legend: { position: 'none' },
      chart: {
        title: `Dividendos - Total (${Math.round(total * 100) / 100})`,
        subtitle: 'Últimos meses'
      },
      titleTextStyle: { color: color, bold: true },
    };

    var chart = new google.charts.Bar(document.getElementById('barchart'));

    chart.draw(data, google.charts.Bar.convertOptions(options));
    document.getElementById('last-update-bar').textContent = storage.lastStatementUpdate
  })
}

document.addEventListener('DOMContentLoaded', function () {
  google.charts.load('current', { 'packages': ['corechart'] });
  google.charts.setOnLoadCallback(drawChart);

  google.charts.load('current', { 'packages': ['bar'] });
  google.charts.setOnLoadCallback(drawStuff);

  document.getElementById("update-chart").addEventListener("click", () => {
    href = 'https://app.kinvo.com.br/meus-produtos'
    chrome.tabs.getSelected(null, function (tab) { chrome.tabs.update(tab.id, { url: href }); });
    window.close();
  });

  document.getElementById("update-chart-bar").addEventListener("click", () => {
    href = 'https://app.kinvo.com.br/resumo-da-carteira'
    chrome.tabs.getSelected(null, function (tab) { chrome.tabs.update(tab.id, { url: href }); });
    window.close();
  });
});


