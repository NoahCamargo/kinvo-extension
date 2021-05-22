class_dict = {
  "sc-bJTOcE hRzliK": "FIIs",
  "sc-bJTOcE csxPYb": "Ações",
  "sc-bJTOcE kvOurW": "Renda fixa",
  "sc-bJTOcE gqVRsE": "Fundo",
  "sc-bJTOcE kgOkQH": "BDRs"
}

function parseCurrency(currency) {
  return parseFloat(currency.replace("R$ ", "").replace(".", "").replace(",", "."))
}

function parsePercentage(percentage) {
  return parseFloat(percentage.replace("%", "").replace(",", "."))
}