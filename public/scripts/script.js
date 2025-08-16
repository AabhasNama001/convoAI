let chats = JSON.parse(localStorage.getItem("chats")) || [];
let activeChat = localStorage.getItem("activeChat")
  ? Number(localStorage.getItem("activeChat"))
  : null;

const chatList = document.getElementById("chatList");
const chatMessages = document.getElementById("chatMessages");
const placeholder = document.getElementById("placeholder");
const newChatBtn = document.getElementById("newChatBtn");
const sendBtn = document.getElementById("sendBtn");
const chatInput = document.getElementById("chatInput");
const sidebar = document.getElementById("sidebar");
const hamburger = document.getElementById("hamburger");
const closeSidebar = document.getElementById("closeSidebar");

// ✅ Create a new chat only if there are no chats
if (chats.length === 0) {
  startNewChat();
} else if (!activeChat) {
  // If there are chats but no active chat saved, pick the first one
  activeChat = chats[0].id;
}

renderChatList();
renderMessages();

// Sidebar toggle for mobile
hamburger.addEventListener("click", () => sidebar.classList.add("show"));
closeSidebar.addEventListener("click", () => sidebar.classList.remove("show"));

newChatBtn.addEventListener("click", () => {
  startNewChat();
});

sendBtn.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function startNewChat() {
  const chatId = Date.now();
  chats.unshift({ id: chatId, messages: [] });
  activeChat = chatId;
  saveChats();
  saveActiveChat();
  renderChatList();
  renderMessages();
}

function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  // Auto-create first chat if none exists
  if (activeChat === null) {
    startNewChat();
  }

  const chat = chats.find((c) => c.id === activeChat);
  chat.messages.push({ sender: "user", text });

  renderMessages();
  chatInput.value = "";

  // Send message to server via socket
  if (typeof socket !== "undefined") {
    socket.emit("ai-message", text);
  }

  saveChats();
}

// 🆕 Setup socket listener ONCE, outside sendMessage
if (typeof socket !== "undefined") {
  socket.on("ai-message-response", (message) => {
    const chat = chats.find((c) => c.id === activeChat);
    if (chat) {
      chat.messages.push({ sender: "bot", text: message });
      saveChats();
      renderMessages();
    }
  });
}

function renderChatList() {
  chatList.innerHTML = "";
  chats.forEach((chat) => {
    const li = document.createElement("li");

    // Chat title
    const titleSpan = document.createElement("span");
    titleSpan.textContent = chat.messages[0]?.text || "New Conversation";
    titleSpan.style.flex = "1";
    titleSpan.onclick = () => {
      activeChat = chat.id;
      saveActiveChat();
      renderChatList();
      renderMessages();
      sidebar.classList.remove("show"); // close on mobile
    };

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "✖";
    deleteBtn.className = "delete-chat-btn";
    deleteBtn.onclick = (e) => {
      e.stopPropagation(); // prevent triggering chat open
      deleteChat(chat.id);
    };

    li.classList.toggle("active", chat.id === activeChat);
    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.justifyContent = "space-between";

    li.appendChild(titleSpan);
    li.appendChild(deleteBtn);
    chatList.appendChild(li);
  });
}

function renderMessages() {
  chatMessages.innerHTML = "";
  const chat = chats.find((c) => c.id === activeChat);

  if (!chat || chat.messages.length === 0) {
    chatMessages.appendChild(placeholder);
    placeholder.style.display = "block";
    return;
  }

  placeholder.style.display = "none";

  chat.messages.forEach((msg) => {
    const div = document.createElement("div");
    div.className = `message ${msg.sender}`;
    div.textContent = msg.text;
    chatMessages.appendChild(div);
  });

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function deleteChat(chatId) {
  chats = chats.filter((c) => c.id !== chatId);

  // If deleting the active chat, update activeChat
  if (activeChat === chatId) {
    activeChat = chats.length > 0 ? chats[0].id : null;
    saveActiveChat();
  }

  if (chats.length === 0) {
    startNewChat();
  } else {
    saveChats();
    renderChatList();
    renderMessages();
  }
}

function saveChats() {
  localStorage.setItem("chats", JSON.stringify(chats));
}

function saveActiveChat() {
  localStorage.setItem("activeChat", activeChat);
}

// 🆕 Auto-hide mobile sidebar when switching to desktop
window.addEventListener("resize", () => {
  if (window.innerWidth >= 769) {
    sidebar.classList.remove("show");
  }
});
