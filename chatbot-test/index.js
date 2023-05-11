var currentQuery = "";
var currentResponse = "";

async function gptQuery() {
  const query = document.getElementById('queryBox').value;
  askgpt(query);
}

function displayResult(result) {
  document.getElementById('container').innerHTML = `<p>${result}</p>`;
  currentResponse = result;
}

function setCurrentQuery(query) {
  currentQuery = query;
}

function askgpt(query) {
  document.getElementById('container').innerHTML = '<div class="center"><div class="lds-dual-ring"></div></div>';
  const req = fetch("https://askgpt-texhgputha-uc.a.run.app?" + new URLSearchParams({
    text: query
  }))
    .then((res) => res.json())
    .then((res) => {displayResult(res.result); setCurrentQuery(query);})
  
  return req;
}