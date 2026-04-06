const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const username = document.getElementById("username");

togglePassword?.addEventListener("click", () => {
    password.type = password.type === "password" ? "text" : "password";
});

function showNotification(message, type="error", duration=3000) {
    const notification = document.getElementById("notification");
    notification.innerText = message;
    notification.className = "notification show";
    if(type === "success") notification.classList.add("success");
    else if(type === "info") notification.classList.add("info");

    setTimeout(() => notification.classList.remove("show"), duration);
}

async function handleLogin() {
    const user = username.value.trim();
    const pass = password.value.trim();

    if (!user || !pass) return showNotification("Enter username and password", "error");

    try {
        const res = await fetch("http://localhost:5229/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: user, password: pass })
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            return showNotification(err.error || "Invalid username or password", "error");
        }

        const data = await res.json();
        localStorage.setItem("role", data.role);
        showNotification("Login successful!", "success");

        setTimeout(() => window.location.href = "main.html", 800);

    } catch (err) {
        console.error(err);
        showNotification("Error connecting to server", "error");
    }
}

loginBtn.addEventListener("click", handleLogin);

[username, password].forEach(input => {
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleLogin();
    });
});