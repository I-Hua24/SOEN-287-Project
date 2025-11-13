
//User Storage and Authentication Logic
document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signup-form");
    if (!signupForm) return; //

    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = (document.getElementById("email")?.value || "").trim().toLowerCase();
        const password = document.getElementById("password")?.value || "";
        const confirmPassword = document.getElementById("confirm-password")?.value || "";
        //const role = document.getElementById("role")?.value || "";

        // basic email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // use consistent strength rules (example: 8-12 chars and at least one digit)
        if (password.length < 8 || password.length > 12) {
            alert("Password must be between 8 and 12 characters.");
            return;
        }
        if (!/\d/.test(password)) {
            alert("Password must contain at least one number.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password})
            });
            const data = await response.json();
            if (response.ok) {
                alert("Sign up successful!");
                window.location.href = "../pages/signin.html";
            } else {
                alert(`Sign up failed: ${data.message || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error during sign up:", error);
            alert("An error occurred during sign up. Please try again later.");
        }
    });
});

//signin logic

document.addEventListener("DOMContentLoaded", () => {
    const signinForm = document.getElementById("signin-form");
signinForm.addEventListener("submit", async (e) => {
e.preventDefault();
const email = document.getElementById("email").value.trim().toLowerCase();
const password = document.getElementById("password").value;
if (!email || !password) {
    alert("Please enter both email and password.");
    return; 
}
try{
    const response=await fetch("http://localhost:8000/api/signin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
    }
    ,body: JSON.stringify({ email, password })
});
const data=await response.json();

if (response.ok) {
    alert("Sign in successful!");
    localStorage.setItem("loggedInUser", data.user.email);
    localStorage.setItem("userRole", data.user.role);
}
if (data.user.role === "admin") {
    window.location.href = "../pages/adminDashboard.html";
    return;
}
window.location.href = "../index.html";

}catch (error) {
    console.error("Error during sign in:", error);
    alert("An error occurred during sign in. Please try again later.");
}


})
});

//If user is logged in, redirect away from signin/signup pages
const loggedInUser = localStorage.getItem("loggedInUser");
const pathname = window.location.pathname;
if (loggedInUser && (pathname.endsWith("signin.html") || pathname.endsWith("signup.html"))) {
    window.location.href = "../index.html";
}

//Sign out logic
const signOutBtn = document.getElementById("sign-out-btn");
if (signOutBtn) {
    signOutBtn.addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        // alert("You have been signed out.");
        window.location.href = "../pages/signin.html";
    });
}
if (!loggedInUser && signOutBtn) {
    signOutBtn.style.display = "none";
} else if (loggedInUser && signOutBtn) {
    signOutBtn.style.display = "block";
}


if (loggedInUser) {
    document.querySelector(".logo").innerHTML = `ConcoHub | <span style="color:grey; font-weight:200">Welcome, ${loggedInUser.split('@')[0]}</span>`;
} else {
    document.querySelector(".logo").innerHTML = "ConcoHub";
}

//Restrict access to certain pages if not signed in




