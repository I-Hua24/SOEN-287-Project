const signupForm = document.getElementById("signup-form");
const signinForm = document.getElementById("signin-form");

if (signupForm) {
    document.getElementById("signup-form").addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        } else if (password.length < 8 || password.length > 12) {
            alert("Password must be between 8 and 12 characters.");
            return;
        } else if (!/\d/.test(password)) {
            alert("Password must contain at least one number.");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        const users = JSON.parse(localStorage.getItem("users") || "[]");

        if (users.some(u => u.email === email)) {
            alert("Email already registered!");
            return;
        }

        users.push({ email, password });

        localStorage.setItem("users", JSON.stringify(users));

        alert("Sign up successful!");
        e.target.reset();
    });
}

//Sign in Logic
if (signinForm) {
    document.getElementById("signin-form").addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value.trim();

        const users = JSON.parse(localStorage.getItem("users") || "[]");

        const user = users.find(user => user.email === email && user.password === password);
        if (user) {
            alert("Sign in successful!");
            localStorage.setItem("loggedInUser", email); 
            window.location.href = "../index.html";
        }
        else {
            alert("Invalid email or password.");



        }
    });
}

//Keep user logged in after sign in
const loggedInUser = localStorage.getItem("loggedInUser");
if (loggedInUser) {
    window.location.href = "../index.html";
}

//Sign out logic
const signOutBtn = document.getElementById("sign-out-btn");
if (signOutBtn) {
    signOutBtn.addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        alert("You have been signed out.");
        window.location.href = "../pages/signin.html";
    });
}

