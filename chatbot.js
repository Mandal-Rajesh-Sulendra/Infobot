// API Key
const GEMINI_API_KEY = "AIzaSyBCpbI-pnap85uSqEyToHjyv20QhnB4ufs";


const input = document.getElementById("userInput");
const chatbox = document.getElementById("chatbox");
const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", e => { if (e.key === "Enter") sendMessage(); });

// Sending messages to gemini api
async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  chatbox.innerHTML += `<div class="msg user"><b>You:</b> ${message}</div>`;
  input.value = "";
  chatbox.scrollTop = chatbox.scrollHeight;

  const typingDiv = document.createElement("div");
  typingDiv.className = "msg bot";
  typingDiv.innerHTML = `<b>Bot:</b> typing...`;
  chatbox.appendChild(typingDiv);
  chatbox.scrollTop = chatbox.scrollHeight;

  // Managing Responses from gemini api
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        })
      }
    );

    const data = await response.json();
    console.log("Gemini API Response:", data);

    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      typingDiv.innerHTML = `<b>Bot:</b> ${data.candidates[0].content.parts[0].text}`;
    } else if (data?.error?.message) {
      typingDiv.innerHTML = `<b>Bot:</b>  ${data.error.message}`;
    } else {
      typingDiv.innerHTML = `<b>Bot:</b>  No valid response`;
    }

    chatbox.scrollTop = chatbox.scrollHeight;

  } catch (err) {
    console.error(err);
    typingDiv.innerHTML = `<b>Bot:</b>  Network error`;
  }
}

