const startChatBtn = document.getElementById("start-chat-btn");
const newChatBtn = document.getElementById("new-chat-btn");
const sidebar = document.getElementById("sidebar");
const chatInterface = document.getElementById("chat-interface");
const welcomeScreen = document.getElementById("welcome-screen");
const chatMessages = document.getElementById("chat-messages");
const chatList = document.getElementById("chat-list");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

let chatSessions = [];
let currentChatIndex = null;

// Start a new chat
startChatBtn.addEventListener("click", () => {
    welcomeScreen.style.display = "none";
    sidebar.style.display = "flex";
    chatInterface.style.display = "flex";
    createNewChat();
});

newChatBtn.addEventListener("click", createNewChat);

// Create a new chat
function createNewChat() {
    const newChatIndex = chatSessions.length;
    chatSessions.push([]);

    const chatSession = document.createElement("div");
    chatSession.textContent = `Chat ${newChatIndex + 1}`;
    chatSession.classList.add("chat-session"); // Ensure class is added
    chatSession.addEventListener("click", () => loadChat(newChatIndex));

    chatList.appendChild(chatSession);
    loadChat(newChatIndex);
}

// Load a chat
function loadChat(index) {
    currentChatIndex = index;
    chatMessages.innerHTML = ""; // Clear current messages

    // Remove 'active-chat' from all chat sessions
    document.querySelectorAll("#chat-list .chat-session").forEach((chat) => {
        chat.classList.remove("active-chat");
    });

    // Add 'active-chat' to the selected chat
    const selectedChat = chatList.children[index];
    selectedChat.classList.add("active-chat");

    // Load messages
    chatSessions[index].forEach((msg) => appendMessage(msg.text, msg.sender));
}

// Send a message
sendBtn.addEventListener("click", sendMessage);

// Send message with "Enter" key
userInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent form submission
        sendMessage(); // Call the sendMessage function
    }
});

function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
        appendMessage(`You: ${message}`, "user");
        saveMessage(`You: ${message}`, "user");

        // If it's the first message in this chat, update the chat name
        if (chatSessions[currentChatIndex].length === 1) { 
            const currentChatItem = chatList.children[currentChatIndex];
            currentChatItem.textContent = message; // Update chat name
        }

        userInput.value = "";

        setTimeout(() => {
            const botResponse = tokenizeMessage(message);
            appendMessage(`Bot: ${botResponse}`, "bot");
            saveMessage(`Bot: ${botResponse}`, "bot");
        }, 1000);
    }
}
function appendMessage(text, sender) {
    const messageElement = document.createElement("p");
    messageElement.textContent = text;
    messageElement.className = sender === "user" ? "user-message" : "bot-message";
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function saveMessage(text, sender) {
    chatSessions[currentChatIndex].push({ text, sender });
}

function tokenizeMessage(message) {
    return message.split(" ").join(" | "); // Placeholder processing
}
