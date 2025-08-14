let chats = JSON.parse(localStorage.getItem("chats")) || [];
let activeChat = chats.length ? chats[chats.length - 1].id : null;

const chatList = document.getElementById("chatList");
const chatMessages = document.getElementById("chatMessages");
const placeholder = document.getElementById("placeholder");
const newChatBtn = document.getElementById("newChatBtn");
const sendBtn = document.getElementById("sendBtn");
const chatInput = document.getElementById("chatInput");
const sidebar = document.getElementById("sidebar");
const hamburger = document.getElementById("hamburger");
const closeSidebar = document.getElementById("closeSidebar");

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
  chats.push({ id: chatId, messages: [] });
  activeChat = chatId;
  saveChats();
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

  setTimeout(() => {
    chat.messages.push({ sender: "bot", text: "This is a bot reply 😄" });
    saveChats();
    renderMessages();
  }, 500);

  saveChats();
}

function renderChatList() {
  chatList.innerHTML = "";
  chats.forEach((chat) => {
    const li = document.createElement("li");
    li.textContent = chat.messages[0]?.text || "New Conversation";
    li.classList.toggle("active", chat.id === activeChat);
    li.onclick = () => {
      activeChat = chat.id;
      renderChatList();
      renderMessages();
      sidebar.classList.remove("show"); // close on mobile
    };
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

function saveChats() {
  localStorage.setItem("chats", JSON.stringify(chats));
}

// 🆕 Auto-hide mobile sidebar when switching to desktop
window.addEventListener("resize", () => {
  if (window.innerWidth >= 769) {
    sidebar.classList.remove("show");
  }
});
