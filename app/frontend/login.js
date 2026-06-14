async function login() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(
        "http://127.0.0.1:8000/auth/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }
    );

    const data = await response.json();

    if(response.ok){

        localStorage.setItem("user", email);

        alert("Login Successful");

        window.location.href = "index.html";
    }
    else{
        alert("Invalid Email or Password");
    }
}