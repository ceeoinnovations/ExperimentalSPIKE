var currentQuery = "";
var currentResponse = "";

async function dalleQuery() {
  const query = document.getElementById('queryBox').value;
  generateimage(query);
}

function displayResult(result) {
  document.getElementById('container').innerHTML = 
    `<img src="${result}" alt="Generated Image by DALL-E">`;
  currentResponse = result;
}

function setCurrentQuery(query) {
  currentQuery = query;
}

function generateimage(prompt) {
  document.getElementById('container').innerHTML = '<div class="center"><div class="lds-dual-ring"></div></div>';
  const req = fetch("https://generateimage-texhgputha-uc.a.run.app", {
    method: "POST",
    body: JSON.stringify({
      prompt: prompt
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      "Access-Control-Allow-Origin": "*"
    }
  })
    .then((res) => res.text())
    .then((res) => {displayResult(res); setCurrentQuery(prompt);})
  
  return req;
}