function distributionProducts() {
  distribution_products = {}
  products = getRoot().parentElement.querySelectorAll('div div div div section')

  products.forEach((node) => {
    value = node.querySelectorAll('a div div h4')
    value = parseCurrency(value[0].textContent)

    if (value > 0) {
      distribution_products = buildDistributionProduct(distribution_products, node, value)
    }
  })

  return distribution_products
}

function getRoot() {
  return document.querySelector('input[placeholder="Busque por um produto"]')
}

function buildDistributionProduct(distribution_products, node, value) {
  distribution_product = distribution_products[node.className]

  example = class_dict[node.className]
  example = example ? example : node.querySelector('a div div h5').textContent

  distribution_products[node.className] = {
    example: example,
    value: (distribution_product ? distribution_product.value : 0.0) + value
  }

  if (!distribution_products[node.className].color) {
    color = window.getComputedStyle(node, ':before').backgroundColor
    distribution_products[node.className]["color"] = color
  }

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
