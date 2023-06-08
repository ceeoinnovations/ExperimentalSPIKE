var currentQuery = "";
var currentResponse = "";

async function gptQuery() {
  const query = document.getElementById('queryBox').value;
  askgpt(query);
}

function displayResult(result) {
  document.getElementById('container').innerHTML = "";
  const lines = result.split('\n');
  console.log(lines);
  for (let i = 0; i < lines.length; i++) {
    document.getElementById('container').innerHTML += `<p>${lines[i].replaceAll("  ", "&nbsp;&nbsp;")}</p>`;
  }
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
    .then((res) => {
      displayResult(res.response);
      setCurrentQuery(query);
    })

  return req;
}