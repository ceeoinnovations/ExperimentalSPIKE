function sendCommandToGPT() {
  if (!(window.pyrepl && window.pyrepl.isActive)) {
    alert("SPIKE not connected, connect and try again");
    return;
  }

  showLoad();

  const prompt = document.querySelector("#promptBox").value;
  const messagesJSONList = [
    {role: "system", content: "Your role is to generate Python code to control the motors of a SPIKE 3 robot. At the top of every program that runs motors you need to import the 'motor' and 'port' modules. The port module is inside the 'hub' module."},
    {role: "system", content: "To run a motor in Port A, execute the function 'motor.run_for_time(port.A, time, speed)'. 'time' is an integer representing the milliseconds the motor will run, 'speed' controls the speed and has a range of 0 to 10000. A motor in Port B can be run by replacing port.A with port.B"},
    {role: "system", content: "There are motors connected on ports A and B. Port A and its corresponding motor is on the left and Port B and its corresponding motor is on the right."},
    {role: "system", content: `An example program that runs the robot forward for 1 second at 40% speed is: 
  \`\`\`python
import motor
from hub import port
motor.run_for_time(port.A, 1000, -4000)
motor.run_for_time(port.B, 1000, 4000)
\`\`\``},
    {role: "system", content: "There are other functions you can use like 'run_for_degrees', 'run_to_absolute_position', 'run_to_relative_position', and 'run'."},
    {role: "system", content: "It's important to note that all motor functions are asynchonous and need time.sleep between different actions to add a delay."},
    {role: "system", content: "If the user is requesting a song, sound, or music import the 'speaker' module from the 'hub' module. To play a beep, call the 'speaker.beep' function. The first paramter is an integer representing the frequency of the note in Hertz. The second parameter is an integer representing the number of milliseconds the note will be played for. Add a time.sleep_ms between each node where the parameter is the length (ms) of the previous note. Note that this is the only way to generate sounds on the SPIKE Prime."},
    {role: "system", content: `A sample program that plays two notes is: 
\`\`\`python
from hub import speaker
import time
speaker.beep(500, 1000)
time_ms.sleep(1000)
speaker.beep(600, 1000)
\`\`\``},
    {role: "system", content: "It's important to reinforce the concept that the pause should be equivalent in time to the time of the note preceding it."}
  ];

  messagesJSONList.push({role: "user", content: prompt})
  fetch("https://gpt4chatcompletion-texhgputha-uc.a.run.app", {
    method: "POST",
    body: JSON.stringify({
      messages: messagesJSONList
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
    .then((res) => res.json()).then((res) => {
      const code = displayCode(res.response);
      hideLoad();
      window.pyrepl.write = code;
    })

}

// Takes in a response, extracts code and displays it
// Returns extracted code
function displayCode(res) {
  const code = res.split('```python').pop().split('```')[0];
  console.log(code);
  if (!code) {
    return ("print('error')");
  }
  let codeHTML = "";
  code.split('\n').forEach(element => {
    codeHTML += `<p>${element}</p>`;
  });

  document.querySelector("#code").innerHTML = codeHTML;

  return code;
}

// Shows a loading icon and disables the submit prompt button
function showLoad() {
  document.querySelector("#loading").innerHTML = '<div><div class="lds-dual-ring"></div></div>';
}

// Hides loading icon when execution has stopped
function hideLoad() {
  document.querySelector("#loading").innerHTML = '';
}