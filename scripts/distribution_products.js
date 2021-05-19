function getRoot() {
  return document.querySelector('input[placeholder="Busque por um produto"]')
}

function distributionProducts() {
  distribution_products = {}
  products = getRoot().parentElement.querySelectorAll('div div div div section')

  products.forEach((node) => {
    value = node.querySelectorAll('a div div h4')
    value = parseCurrency(value[0].textContent)
    value = parseFloat(value)

    distribution_product = distribution_products[node.className]

    distribution_products[node.className] = {
      example: node.querySelector('a div div h5').textContent,
      value: (distribution_product ? distribution_product.value : 0.0) + value
    }
  })

  return distribution_products
}

window.onload = function () {
  let timerId = setInterval(() => {
    if (!getRoot()) return;

    distribution = distributionProducts()
    chrome.storage.sync.set({ distributionProducts: distribution, lastUpdate: (new Date()).toString() }, function () {
      console.log(distribution, (new Date()).toString());
    });

    clearInterval(timerId)
  }, 500);
};
