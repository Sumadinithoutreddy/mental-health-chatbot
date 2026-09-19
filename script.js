// ===============================
// GET CURRENT TIME
// ===============================

function getCurrentTime() {
    return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}


// ===============================
// SEND MESSAGE
// ===============================

async function sendMessage() {

    const messageInput = document.getElementById("message");

    // Get actual text from input
    const message = messageInput.value.trim();

    if (message === "") {
        return;
    }

    const chatBox = document.getElementById("chat-box");

    const time = getCurrentTime();


    // ===============================
    // USER MESSAGE
    // ===============================

    const userMessage = document.createElement("div");

    userMessage.classList.add("message");
    userMessage.classList.add("user");

    userMessage.innerHTML =
        '<span class="user-avatar">👤</span>' +
        '<div>' +
        '<b>You</b><br>' +
        message +
        '<br><small class="message-time">' +
        time +
        '</small>' +
        '</div>';

    chatBox.appendChild(userMessage);


    // Clear input
    messageInput.value = "";


    // ===============================
    // TYPING INDICATOR
    // ===============================

    const typingMessage = document.createElement("div");

    typingMessage.classList.add("message");
    typingMessage.classList.add("bot");

    typingMessage.id = "typing-message";

    typingMessage.innerHTML =
        '<span class="bot-avatar">🤖</span>' +
        '<div>' +
        '<b>MindCare AI</b><br>' +
        'Thinking... ⏳' +
        '</div>';

    chatBox.appendChild(typingMessage);

    chatBox.scrollTop = chatBox.scrollHeight;


    // ===============================
    // SEND TO BACKEND
    // ===============================

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/chat/analyze",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization":
                        "Bearer " + localStorage.getItem("token")
                },

                body: JSON.stringify({
                    message: message
                })
            }
        );


        const data = await response.json();


        // Remove typing indicator

        const typing =
            document.getElementById("typing-message");

        if (typing) {
            typing.remove();
        }


        // ===============================
        // ERROR RESPONSE
        // ===============================

        if (!response.ok) {

            const errorMessage =
                document.createElement("div");

            errorMessage.classList.add("message");
            errorMessage.classList.add("bot");

            errorMessage.innerHTML =
                '<span class="bot-avatar">🤖</span>' +
                '<div>' +
                '<b>MindCare AI</b><br>' +
                'Sorry, I could not process your message.' +
                '<br><small class="message-time">' +
                getCurrentTime() +
                '</small>' +
                '</div>';

            chatBox.appendChild(errorMessage);

            chatBox.scrollTop =
                chatBox.scrollHeight;

            return;
        }


        // ===============================
        // AI RESPONSE
        // ===============================

        const botMessage =
            document.createElement("div");

        botMessage.classList.add("message");
        botMessage.classList.add("bot");

        botMessage.innerHTML =
            '<span class="bot-avatar">🤖</span>' +
            '<div>' +
            '<b>MindCare AI</b><br>' +
            '<small>Detected Emotion: ' +
            data.emotion +
            '</small><br>' +
            data.reply +
            '<br><small class="message-time">' +
            getCurrentTime() +
            '</small>' +
            '</div>';

        chatBox.appendChild(botMessage);

        chatBox.scrollTop =
            chatBox.scrollHeight;

    }


    catch (error) {

        // Remove typing indicator

        const typing =
            document.getElementById("typing-message");

        if (typing) {
            typing.remove();
        }


        // Show error message

        const botMessage =
            document.createElement("div");

        botMessage.classList.add("message");
        botMessage.classList.add("bot");

        botMessage.innerHTML =
            '<span class="bot-avatar">🤖</span>' +
            '<div>' +
            '<b>MindCare AI</b><br>' +
            'Sorry, something went wrong. Please try again.' +
            '<br><small class="message-time">' +
            getCurrentTime() +
            '</small>' +
            '</div>';

        chatBox.appendChild(botMessage);

        console.error("Chat error:", error);

        chatBox.scrollTop =
            chatBox.scrollHeight;
    }
}


// ===============================
// LOGOUT
// ===============================

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("name");

    window.location.href = "login.html";
}


// ===============================
// ENTER KEY
// ===============================

document.getElementById("message").addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {
            sendMessage();
        }

    }
);


// ===============================
// LOAD CHAT HISTORY
// ===============================

async function loadChatHistory() {

    const token =
        localStorage.getItem("token");

    if (!token) {
        return;
    }

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/chat/history",
            {
                method: "GET",

                headers: {
                    "Authorization":
                        "Bearer " + token
                }
            }
        );


        if (!response.ok) {

            console.log(
                "Unable to load chat history"
            );

            return;
        }


        const history =
            await response.json();


        const chatBox =
            document.getElementById("chat-box");


        history.reverse().forEach(function(chat) {

            // ===============================
            // OLD USER MESSAGE
            // ===============================

            const userMessage =
                document.createElement("div");

            userMessage.classList.add("message");
            userMessage.classList.add("user");

            userMessage.innerHTML =
                '<span class="user-avatar">👤</span>' +
                '<div>' +
                '<b>You</b><br>' +
                chat.message +
                '</div>';

            chatBox.appendChild(userMessage);


            // ===============================
            // OLD AI MESSAGE
            // ===============================

            const botMessage =
                document.createElement("div");

            botMessage.classList.add("message");
            botMessage.classList.add("bot");

            botMessage.innerHTML =
                '<span class="bot-avatar">🤖</span>' +
                '<div>' +
                '<b>MindCare AI</b><br>' +
                '<small>Detected Emotion: ' +
                chat.emotion +
                '</small><br>' +
                chat.reply +
                '</div>';

            chatBox.appendChild(botMessage);

        });


        chatBox.scrollTop =
            chatBox.scrollHeight;

    }


    catch (error) {

        console.error(
            "Chat history error:",
            error
        );
    }
}


// ===============================
// LOAD HISTORY WHEN PAGE OPENS
// ===============================

loadChatHistory();


// ===============================
// MOOD BUTTONS
// ===============================

function selectMood(mood) {

    const messageInput =
        document.getElementById("message");

    messageInput.value = mood;

    sendMessage();
}


// ===============================
// CLEAR CHAT FROM SCREEN
// ===============================

function clearChat() {

    const chatBox =
        document.getElementById("chat-box");

    const confirmClear =
        confirm(
            "Clear the conversations from the screen?"
        );

    if (!confirmClear) {
        return;
    }

    chatBox.innerHTML = `
        <div class="welcome-message">

            <h2>🧠 Welcome to MindCare AI</h2>

            <p>
                I'm here to listen. How are you feeling today?
            </p>

            <div class="mood-buttons">

                <button onclick="selectMood('I am feeling happy today.')">
                    😊 Happy
                </button>

                <button onclick="selectMood('I am feeling sad today.')">
                    😔 Sad
                </button>

                <button onclick="selectMood('I am feeling stressed today.')">
                    😰 Stressed
                </button>

                <button onclick="selectMood('I am feeling angry today.')">
                    😡 Angry
                </button>

            </div>

        </div>
    `;

}


// ===============================
// DELETE CHAT HISTORY
// ===============================

async function deleteHistory() {

    const confirmDelete =
        confirm(
            "Are you sure you want to permanently delete your chat history?"
        );

    if (!confirmDelete) {
        return;
    }


    const token =
        localStorage.getItem("token");


    try {

        const response = await fetch(
            "http://127.0.0.1:8000/chat/history",
            {
                method: "DELETE",

                headers: {
                    "Authorization":
                        "Bearer " + token
                }
            }
        );


        const data =
            await response.json();


        if (response.ok) {

            document.getElementById(
                "chat-box"
            ).innerHTML = "";

            alert(
                "Chat history deleted successfully 🗑️"
            );

        }
        else {

            alert(
                data.detail ||
                "Unable to delete chat history."
            );

        }

    }


    catch (error) {

        console.error(
            "Delete history error:",
            error
        );

        alert(
            "Unable to connect to the server."
        );
    }
}