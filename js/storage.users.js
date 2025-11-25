

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
            const response = await fetch("http://127.0.0.1:8000/api/auth/signup", {
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
            const response = await fetch("http://127.0.0.1:8000/api/auth/signin", {
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
// If user is logged in, redirect away from signin/signup pages
document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM loaded!");

    const signOutBtn = document.getElementById("sign-out-btn");
    const appTitle = document.querySelector(".logo");
    const signInBtn = document.getElementById("sign-in");
    const signUpBtn = document.getElementById("sign-up");
    const ctaBtn = document.getElementById("cta-btn");


    console.log("Found logo:", appTitle);

    let loggedInUser = null;

    try {
        const response = await fetch("http://127.0.0.1:8000/api/auth/me", {
            method: "GET",
            credentials: "include"
        });

        console.log("Response status:", response.status);

        const data = await response.json();
        console.log("Data from backend:", data);

        loggedInUser = data.user;
        console.log("Logged in user:", loggedInUser);

        if (loggedInUser && appTitle) {
            console.log("Adding username to logo...");

            appTitle.innerHTML =
                `ConcoHub <span style="margin-left: 8px; color:grey; font-weight:bold;">${loggedInUser.username}</span>`;
        }

        if (loggedInUser) {

            if (signInBtn) signInBtn.style.display = "none";
            if (signUpBtn) signUpBtn.style.display = "none";
            if(ctaBtn) ctaBtn.style.display="none"
        }

        if (loggedInUser && signOutBtn) {
            signOutBtn.style.display = "inline-block";
        }
        if (!loggedInUser && signOutBtn) {
            signOutBtn.style.display = "none";
        }

    } catch (error) {
        console.error("Error verifying user:", error);
    }
});


//Sign out logic
document.addEventListener("DOMContentLoaded", () => {
    const signOutBtn = document.getElementById("sign-out-btn");
    if (!signOutBtn) return;

    signOutBtn.addEventListener("click", async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("http://127.0.0.1:8000/api/auth/signout", {
                method: "POST",
                credentials: "include" // Send cookies
            });
            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Sign-out failed.");
                return;
            }

            alert("You have been logged out successfully!");

            // Replace current history entry to prevent back button
            window.history.replaceState(null, null, window.location.href);
            window.location.replace("../pages/signin.html");

        } catch (error) {
            console.error("Error during sign-out:", error);
            alert("Sign-out failed. Please try again.");
        }
    });
});

// Prevent browser from showing cached page after logout
window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
        window.location.reload();
    }
});

// Disable back button after logout
window.addEventListener('load', function () {
    window.history.pushState(null, null, window.location.href);
    window.addEventListener('popstate', function () {
        window.history.pushState(null, null, window.location.href);
    });
});

//Browse and admin buttons
document.addEventListener("DOMContentLoaded", async () => {
    const browseBtn = document.getElementById("Browse-Btn");
    const adminBtn = document.getElementById("admin-btn");
    const ctaBtn = document.getElementById("cta-btn");


    try {
        const response = await fetch("http://127.0.0.1:8000/api/auth/me", {
            method: "GET",
            credentials: "include"
        });
        const data = await response.json();
        const loggedInUser = data.user;

        if (browseBtn) {
            browseBtn.addEventListener("click", () => {
                if (!loggedInUser) {
                    alert("Please sign in to browse resources.");
                    window.location.href = "../pages/signin.html";
                    return;
                }
                window.location.href = "/booking";
            })
        }

        if (adminBtn) {
            adminBtn.addEventListener("click", (e) => {
                e.preventDefault();

                //if (!loggedInUser || loggedInUser.role !== "admin") {
                //    alert("Access denied. Admins only.");
                //window.location.href = "../pages/signin.html";
                //     return;
                // }
                window.location.href = "../pages/adminDashboard.html";



            })
        }




    } catch (error) {
        console.error("Error verifying user:", error);
    }


});
