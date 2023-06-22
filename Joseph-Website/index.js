const textArea = document.querySelector("#promptBox");

textArea.addEventListener('input', function() {
  this.style.height = 'auto';
  this.style.height = this.scrollHeight + 'px';
});

window.onclick = function(e) {
  if (!e.target.closest("#moduleDropdownMenu") && !e.target.closest("#toggleModules")) {
    const dropdown = document.querySelector("#moduleDropdownMenu")
    if (getComputedStyle(dropdown).visibility == "visible") {
      toggleModules();
    };
  };
};

function toggleModules() {
  const dropdown = document.querySelector("#moduleDropdownMenu")

  if (getComputedStyle(dropdown).visibility == "hidden") {
    dropdown.style.visibility = "visible";
    dropdown.style.maxHeight = "300px"
    dropdown.style.zIndex = "999";
  } else {
    dropdown.style.maxHeight = "0px"
    setTimeout(() => {
      dropdown.style.visibility = "hidden";
      dropdown.style.zIndex = "1"
    }, 300);
  }
}

function runCode() {
  if (!(window.pyrepl && window.pyrepl.isActive)) {
    alert("SPIKE not connected, connect and try again");
    return;
  }
  code = document.querySelector("#code").innerText;
  console.log(code);
  window.pyrepl.write = code;
}

function clearCode() {
  if(window.confirm("Are you sure you want to clear the code? This cannot be undone.")) {
    document.querySelector("#code").innerHTML = "";
    document.querySelector("#assumptionsBox").innerText = "";
  };
}

function compileMessages (prompt) {
  let messages = messagesJSONList;
  // check each checkbox and concatenate appropriate messages
  if (document.querySelector("#motorCheckbox").checked) {
    messages = messages.concat(motorDoc);
  };
  if (document.querySelector("#distanceSensorCheckbox").checked) {
    messages = messages.concat(distanceSensorDoc);
  };
  if (document.querySelector("#hubCheckbox").checked) {
    messages = messages.concat(hubDoc);
  };
  if (document.querySelector("#portCheckbox").checked) {
    messages = messages.concat(portDoc);
  };
  
  // Add code to prompt if there is code in the box
  const code = document.querySelector("#code").textContent;
  if (code != "") {
    messages = messages.concat({role: "system", content: `Edit the following code to assist the user and don't add anything extra that isn't asked for:
\`\`\`python
${code}
\`\`\``})
  }
  messages = messages.concat({role: "user", content: prompt});

  return messages;
}

function sendCommandToGPT() {
  showLoad();

  const prompt = document.querySelector("#promptBox").value;

  let messages = compileMessages(prompt)
  
  console.log(messages);


  const apiKey = document.querySelector("#apiKeyInput").value.trim()

  fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    body: JSON.stringify({
      model: "gpt-4",
      messages: messages,
      temperature: 0,
      top_p: 0.1
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      "Authorization": `Bearer ${apiKey}`
    }
  })
    .then((res) => {
      console.log(res);
      console.log(res.status)
      return res.json();
    })
    .then((res) => {
      console.log(res.usage)
      const code = displayCode(res.choices[0].message.content);
      hideLoad();
    });

}

// Takes in a response, extracts code and displays it
// Returns extracted code
function displayCode(res) {
  const code = res.match(/```python\n([\s\S]*)\n```/);
  console.log(`\nGPT response:\n${res}\n\n`);
  if (!code) {
    console.log("code not located");
    return;
  } else {
    document.querySelector("#code").textContent = code[1].trim();
    Prism.highlightAll();
  };
  

  const assumptions = res.match(/<Assumptions>\n([\s\S]*)\n<\/Assumptions>/s);

  if (assumptions) {
    document.querySelector("#assumptionsBox").innerText = assumptions[1]
  } else {
    document.querySelector("#assumptionsBox").innerText = "No assumptions given"
  };

  return code[1];
}

// Shows a loading icon and disables the submit prompt button
function showLoad() {
  document.querySelector("#loading").innerHTML = '<div><div class="lds-dual-ring"></div></div>';
}

// Hides loading icon when execution has stopped
function hideLoad() {
  document.querySelector("#loading").innerHTML = '';
}