document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signup-form");
    if (!signupForm) return; // Page not signup.html

    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        // FRONTEND VALIDATION
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        if (password.length < 6 || password.length > 12) {
            alert("Password must be between 6 and 12 characters.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/api/auth/signup", {
                method: "POST",
                credentials: "include", // Include cookies
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,

                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Signup failed.");
                return;
            }

            alert("Signup successful! Please sign in.");
            window.location.href = "signin.html";

        } catch (error) {
            console.error("Error during signup:", error);
            alert("Signup failed. Please try again.");
        }
    });
});

//signin 
document.addEventListener("DOMContentLoaded", () => {
    const signinForm = document.getElementById("signin-form");
    if (!signinForm) return; //Not signin page
    signinForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("http://localhost:8000/api/auth/signin", {
                method: "POST",
                credentials: "include",//Include cookies
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Sign-in failed.");
                return;
            }
            alert("Sign-in successful!");
            window.location.href = "/";
        } catch (error) {
            console.error("Error during sign-in:", error);
            alert("Sign-in failed. Please try again.");
        }

    })


})



//If user is logged in, redirect away from signin/signup pages


//Sign out logic






