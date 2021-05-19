function getRoot() {
  root = document.evaluate('//h6[text()="Extrato"]', document, null, XPathResult.ANY_TYPE, null)
  root = root.iterateNext()

  if (!root) return

  return root.parentElement.parentElement.parentElement
}

function getStatementPaginator() {
  spans = getRoot().querySelectorAll('div section span')
  page = spans[spans.length - 1]

  first_page = parseInt(page.textContent.split("/")[0])
  last_page = parseInt(page.textContent.split("/")[1])

  return [first_page, last_page]
}

function getStatement() {
  statements = []

  buttons = getRoot().querySelectorAll('div section button')
  prev_button = buttons[buttons.length - 2]
  next_button = buttons[buttons.length - 1]

  first_page = getStatementPaginator()
  last_page = first_page[1]
  first_page = first_page[0]

  for (i = first_page; i <= last_page; i++) {
    getRoot().querySelectorAll('div div section').forEach((statement) => {
      type = statement.querySelectorAll('div div h6')[1]

      if (type) {
        values = statement.querySelectorAll('div div h5')
        statements = statements.concat([[type.textContent, [values[1], values[0]]]])
      }
    })

    next_button.click()
  }

  console.log('return to first page')

  for (i = last_page; i >= first_page; i--, prev_button.click());

  return statements
}

function getDividends() {
  dividends = getStatement().filter((x) => !(x[0] === 'Aplicação' || x[0] === 'Resgate'))
  console.log(dividends)
  return dividends.map((dividend) => [dividend[1][0].textContent, parseCurrency(dividend[1][1].textContent)])
}

window.onload = function () {
  let timerId = setInterval(() => {
    if (!(getRoot() && getStatementPaginator()[0])) return;

    console.log(getStatementPaginator())

    dividends = getDividends()
    chrome.storage.sync.set({ dividendsStatementProducts: dividends, lastStatementUpdate: (new Date()).toString() }, function () {
      console.log(dividends, (new Date()).toString());
    });

    clearInterval(timerId)
  }, 500);
};
