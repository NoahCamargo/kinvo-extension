function parseCurrency(currency) {
  return parseFloat(currency.replace("R$ ", "").replace(".", "").replace(",", "."))
}