const startChatBtn = document.getElementById("start-chat-btn");
const newChatBtn = document.getElementById("new-chat-btn");
const sidebar = document.getElementById("sidebar");
const chatInterface = document.getElementById("chat-interface");
const welcomeScreen = document.getElementById("welcome-screen");
const chatMessages = document.getElementById("chat-messages");
const chatList = document.getElementById("chat-list");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const themeToggleWelcome = document.getElementById("theme-toggle-welcome");
const themeToggleChat = document.getElementById("theme-toggle-chat");
const body = document.body;

let chatSessions = [];
let currentChatIndex = null;
sendBtn.textContent = "";

// Save chatSessions to localStorage
function saveChatsToLocalStorage() {
    localStorage.setItem("chatSessions", JSON.stringify(chatSessions));
}

// Load chatSessions from localStorage
function loadChatsFromLocalStorage() {
    const savedChats = localStorage.getItem("chatSessions");
    if (savedChats) {
        chatSessions = JSON.parse(savedChats);
    } else {
        chatSessions = []; // Default empty array if nothing is saved
    }
}

// On page load, load saved chats
window.addEventListener("DOMContentLoaded", () => {
    // Save the current theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light-mode") {
        body.classList.add("light-mode");
        themeToggleWelcome.textContent = "Dark Mode";
        themeToggleChat.textContent = "Dark Mode";
    }

    loadChatsFromLocalStorage();

    if (chatSessions.length > 0) {
        sidebar.style.display = "flex";
        chatInterface.style.display = "flex";
        welcomeScreen.style.display = "none";
        rebuildChatList();
        
        // Load the last active chat if saved, otherwise load the first chat
        const lastActiveChatIndex = localStorage.getItem("activeChatIndex");
        const indexToLoad = lastActiveChatIndex !== null ? parseInt(lastActiveChatIndex) : 0;
        loadChat(indexToLoad);
    }
});

// Toggle theme
function toggleTheme() {
    body.classList.toggle("light-mode");
    const isLightMode = body.classList.contains("light-mode");

    // Update button text
    themeToggleWelcome.textContent = isLightMode ? "Dark Mode" : "Light Mode";
    themeToggleChat.textContent = isLightMode ? "Dark Mode" : "Light Mode";

    // Save the theme to localStorage
    if (isLightMode) {
        localStorage.setItem("theme", "light-mode");
    } else {
        localStorage.removeItem("theme");
    }
}

// Add event listeners to both toggle buttons
themeToggleWelcome.addEventListener("click", toggleTheme);
themeToggleChat.addEventListener("click", toggleTheme);

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
    chatSessions.push([]); // Add a new empty chat session
    rebuildChatList(); // Rebuild the chat list to ensure proper indexing
    saveChatsToLocalStorage();
    loadChat(chatSessions.length - 1); // Load the newly created chat
}

// Rebuild the chat list after deletion
function rebuildChatList() {
    chatList.innerHTML = ""; // Clear the current chat list UI

    chatSessions.forEach((session, index) => {
        const chatSession = document.createElement("div");
        chatSession.classList.add("chat-session");

        // Determine chat name: first message or default name
        const chatName = document.createElement("span");
        if (session.length > 0) {
            // Truncate the first message to 22 characters with ellipsis if needed
            const firstMessage = session[0].text.replace(/^You: /, ""); // Remove "You: " prefix
            chatName.textContent = firstMessage.length > 22 
                ? firstMessage.substring(0, 22) + "..." 
                : firstMessage;
        } else {
            chatName.textContent = `Chat ${index + 1}`; // Default name if no messages
        }

        // Add delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "&#128465;"; // Trash bin icon
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            deleteChat(index);
        });

        // Append elements and add click event
        chatSession.appendChild(chatName);
        chatSession.appendChild(deleteBtn);
        chatSession.addEventListener("click", () => loadChat(index));

        chatList.appendChild(chatSession);
    });
}

// Load a chat
function loadChat(index) {
    currentChatIndex = index;
    chatMessages.innerHTML = ""; // Clear current messages
    localStorage.setItem("activeChatIndex", index); // Save active chat index

    // Remove 'active-chat' from all chat sessions
    document.querySelectorAll("#chat-list .chat-session").forEach((chat) => {
        chat.classList.remove("active-chat");
    });

    // Add 'active-chat' to the selected chat
    const selectedChat = chatList.children[index];
    selectedChat.classList.add("active-chat");

    // Load messages
    chatSessions[index].forEach((msg) => appendMessage(msg.text, msg.sender));

    // Set input position based on chat content
    setInputPosition();
}

// Delete a chat
function deleteChat(index) {
    const wasActiveChatDeleted = (currentChatIndex === index); // Check if the active chat is being deleted
    const previousChatIndex = currentChatIndex; // Save the active chat index before deletion

    chatSessions.splice(index, 1); // Remove chat session from array

    if (chatSessions.length === 0) {
        // Show welcome screen if all chats are deleted
        sidebar.style.display = "none";
        chatInterface.style.display = "none";
        welcomeScreen.style.display = "flex";
        localStorage.removeItem("activeChatIndex"); // Clear active chat index
    } else {
        rebuildChatList(); // Rebuild the chat list
        
        if (wasActiveChatDeleted) {
            // If the active chat was deleted, load the closest remaining chat
            const newIndex = previousChatIndex > 0 ? previousChatIndex - 1 : 0;
            loadChat(newIndex);
        } else {
            // Reload the previously active chat
            loadChat(previousChatIndex > index ? previousChatIndex - 1 : previousChatIndex);
        }
    }
    saveChatsToLocalStorage();
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

async function sendMessage() {
    const msg = userInput.value.trim();
    if (msg) {
        appendMessage(`You: ${msg}`, "user");
        saveMessage(`You: ${msg}`, "user");

        // If it's the first message in this chat, update the chat name
        if (chatSessions[currentChatIndex].length === 1) {
            rebuildChatList();
        }

        setInputPosition();

        userInput.value = "";

        try {
            const botResponse = await fetchBotResponse(msg); // Call Flask backend
            appendMessage(`Bot: ${botResponse}`, "bot");
            saveMessage(`Bot: ${botResponse}`, "bot");
            saveChatsToLocalStorage();
        } catch (error) {
            appendMessage("Bot: Sorry, I couldn't process your request.", "bot");
        }
    }
}

async function fetchBotResponse(userMessage) {
    try {
        const response = await fetch("/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: userMessage })
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        return data.answer; // Assumes Flask sends response in { answer: "response text" } format
    } catch (error) {
        console.error("Error fetching bot response:", error);
        throw error;
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

function setInputPosition() {
    const inputBar = document.querySelector(".chat-input");
    const currentChat = chatSessions[currentChatIndex];

    if (currentChat && currentChat.length > 0) {
        // If the chat has messages, move the bar to the bottom
        inputBar.style.top = "auto";
        inputBar.style.bottom = "10px";
    } else {
        // If no messages, place the bar in the middle
        inputBar.style.top = "50%";
        inputBar.style.bottom = "auto";
        inputBar.style.transform = "translate(-50%, -50%)";
    }
}
