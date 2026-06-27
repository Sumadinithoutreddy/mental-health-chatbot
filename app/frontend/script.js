async function sendMessage() {

    const messageInput = document.getElementById("message");

    const message = messageInput.value.trim();

    if(message === ""){
        return;
    }

    const chatBox = document.getElementById("chat-box");

    // USER MESSAGE

    const userMessage = document.createElement("div");

    userMessage.classList.add("message");
    userMessage.classList.add("user");

    userMessage.innerHTML =
        `<b>You:</b> ${message}`;

    chatBox.appendChild(userMessage);

    messageInput.value = "";

    chatBox.scrollTop = chatBox.scrollHeight;

    try{

        const response = await fetch(
            "http://127.0.0.1:8000/chat/analyze",
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer " + localStorage.getItem("token")
                },

                body:JSON.stringify({
                    message:message
                })
            }
        );

        const data = await response.json();

        const botMessage = document.createElement("div");

        botMessage.classList.add("message");
        botMessage.classList.add("bot");

        botMessage.innerHTML =
            `<b>MindCare AI:</b> ${data.reply}`;

        chatBox.appendChild(botMessage);

    }
    catch(error){

        const botMessage = document.createElement("div");

        botMessage.classList.add("message");
        botMessage.classList.add("bot");

        botMessage.innerHTML =
            `<b>MindCare AI:</b> Sorry, something went wrong.`;

        chatBox.appendChild(botMessage);

        console.error(error);
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}

// LOGOUT

function logout(){

    localStorage.removeItem("token");
    localStorage.removeItem("email");

    window.location.href = "login.html";
}

// ENTER KEY

document.getElementById("message")
.addEventListener("keydown", function(event){

    if(event.key === "Enter"){
        sendMessage();
    }

});