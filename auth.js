async function register() {

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    if (name === "" || email === "" || password === "") {
        alert("Please fill in all fields.");
        return;
    }

    try {

        const response = await fetch("http://127.0.0.1:8000/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {

            alert("Registration successful! 🎉");

            window.location.href = "login.html";

        } else {

            alert(data.detail || "Registration failed.");

        }

    } catch (error) {

        console.error("Registration error:", error);

        alert("Unable to connect to the server.");
    }
}