const mainContent = document.querySelector("#main-content");
let questionNum = 0;
let score = 0;
const promptInitJSON = [
  { "role": "system", "content": "Your role is to provide questions with 4 possible options and only 1 correct answer. The answers should be a single letter and not contain any extra leadup or commentary. Do not include any extra text like 'the answer is', just a single character response." },
  { "role": "user", "content": "Print out a difficult multiple choice trivia question without the answer in a subject area of your choice." }
];
let ans = "";
let interval = undefined;


document
  .querySelector("#startButton")
  .addEventListener("click", () => checkForStartGame())

function checkForStartGame() {
  console.log(window.pyrepl.isActive)
  if (window.pyrepl && window.pyrepl.isActive) {
    console.log("Game Started!")
    waitForQuestion()
    return;
  }
  mainContent.innerHTML += "<p>Please connect SPIKE before starting the game!</p>"

  document
    .querySelector("#startButton")
    .addEventListener("click", () => checkForStartGame())

}

async function waitForQuestion() {
  mainContent.innerHTML = "<h3>Waiting for the next question...</h3>";
  const messagesJSONList = promptInitJSON;
  fetch("https://chatcompletion-texhgputha-uc.a.run.app", {
    method: "POST",
    body: JSON.stringify({
      messages: messagesJSONList
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
    .then((res) => res.json()).then((res) => displayQuestion(res.response))

}

async function displayQuestion(question) {
  questionNum += 1;
  const questionArr = question.split("\n");
  let questionHTML = `<h2>Question ${questionNum}</h2>`;
  for (let i = 0; i < questionArr.length; i++) {
    questionHTML += `<p>${questionArr[i]}</p>`;
  }
  questionHTML += "<h3>Answer on your SPIKE Prime</h3>"
  mainContent.innerHTML = questionHTML;

  getAnswer(question, (answer) => ans = answer);

  spikeSelectAnswer();
}


function spikeSelectAnswer() {
  window.pyrepl.write =
    `import hub, force_sensor
options = ['A', 'B', 'C', 'D']
currentOption = 0
def updateCurrentOption(currentOption):
    if (currentOption < 0):
        currentOption = len(options) - 1
    if (currentOption >= len(options)):
        currentOption = 0
    hub.light_matrix.write(options[currentOption])
    return currentOption
hub.speaker.beep(600)
updateCurrentOption(currentOption)
while (True):
    if (hub.button.pressed(hub.button.LEFT) > 0):
        currentOption -= 1
        while (hub.button.pressed(hub.button.LEFT) > 0):
            pass
        currentOption = updateCurrentOption(currentOption)
    elif (hub.button.pressed(hub.button.RIGHT) > 0):
        currentOption += 1
        while (hub.button.pressed(hub.button.RIGHT) > 0):
            pass
        currentOption = updateCurrentOption(currentOption)
    elif (hub.button.pressed(0) > 0):
        print(options[currentOption])
        break
`
  window.pyrepl.clearConsole
  const interval = setInterval(() => {
    const readVals = window.pyrepl.read;
    if (readVals.at(-1).includes(">>")) {
      clearInterval(interval);
      showResponse(readVals.at(-2));
    }
  }, 100);
}

function getAnswer(question, callback) {
  const getAnsJSONList = [...promptInitJSON, {role: "assistant", content: question}, {role: "user", content: "Give me the answer to the question as a single letter."}];
  fetch("https://chatcompletion-texhgputha-uc.a.run.app", {
    method: "POST",
    body: JSON.stringify({
      messages: getAnsJSONList
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
    .then((res) => res.json())
    .then((res) => callback(res.response))
}

function showResponse(userAnswer) {
  mainContent.innerHTML += `<p>Your Answer: ${userAnswer}</p>`;
  const interval = setInterval(() => {
    if (ans !== "") {
      checkAnswer(userAnswer);
      clearInterval(interval);
    }
  }, 100);
}

function checkAnswer(userAnswer) {
  if (ans.charAt(0) > 'D' || ans.charAt(0) < 'A') {
    console.log(ans);
    if (ans.includes(' A'))
      ans = 'A'
    else if (ans.includes(' B'))
      ans = 'B'
    else if (ans.includes(' C'))
      ans = 'C'
    else if (ans.includes(' D'))
      ans = 'D'
  }
  mainContent.innerHTML += `<p>Correct Answer: ${ans}</p>`;
  if (userAnswer.charAt(0).toUpperCase() === ans.charAt(0).toUpperCase()) {
    mainContent.innerHTML += `<p style="background-color: green">Your answer was correct!</p>`;
    score++;
    document.querySelector("#score").innerHTML = "Score: " + score;
  }
  else {
    mainContent.innerHTML += `<p style="background-color: red">Your answer was incorrect. :(</p>`;
  }

  setTimeout(() => {
    waitForQuestion();
  }, 4000);
}