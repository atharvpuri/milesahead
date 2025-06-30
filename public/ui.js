document.addEventListener("DOMContentLoaded", () => {
  const spaceCards = document.querySelectorAll(".space-card");

  spaceCards.forEach((card) => {
    card.addEventListener("click", () => {
      const spaceName = card.querySelector("h3").innerText.trim();

      // Create chat UI dynamically
      document.body.innerHTML = `
        <div class="chat-wrapper">
          <h2 class="chat-title">🛰️ ${spaceName}</h2>
          <div class="chat-box" id="chat-box"></div>
          <div class="chat-input-box">
            <input type="text" id="msg-input" placeholder="Type your message..." autocomplete="off" />
            <button id="send-btn">Send</button>
          </div>
        </div>
      `;

      loadChat(spaceName);
    });
  });

  function loadChat(space) {
    const socket = io();

    socket.emit("join-space", space);

    const chatBox = document.getElementById("chat-box");
    const msgInput = document.getElementById("msg-input");
    const sendBtn = document.getElementById("send-btn");

    socket.on("chat-message", (msg) => {
      appendMsg(msg, "other");
    });

    socket.on("system-message", (msg) => {
      appendMsg(msg, "system");
    });

    sendBtn.addEventListener("click", () => {
  const msg = msgInput.value.trim();
  if (msg) {
    socket.emit("chat-message", { spaceId: space, msg });
    msgInput.value = "";
  }
});


    msgInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendBtn.click();
    });

    function appendMsg(msg, type) {
      const div = document.createElement("div");
      div.className = `msg ${type}`;
      div.innerText = msg;
      chatBox.appendChild(div);
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }
});
