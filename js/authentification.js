document.addEventListener("DOMContentLoaded", async () => {
  const path = window.location.pathname;

  try {
    // Call backend to verify authentication using cookies
    const response = await fetch("http://localhost:8000/api/users/me", {
      method: "GET",
      credentials: "include" // Send cookies
    });

    // If token invalid or missing → user is NOT logged in
    if (!response.ok) {
      console.warn("User not authenticated");

      // Pages that DO NOT require login
      const publicPages = [
        "/pages/index.html",
        "/pages/signin.html",
        "/pages/signup.html"
      ];

      const isPublicPage = publicPages.some(page => path.endsWith(page));

      if (!isPublicPage) {
        alert("Please sign in to access this page.");
        window.location.replace("../pages/signin.html");
      }

      return; // Stop execution
    }

    // If authenticated → extract user
    const data = await response.json();
    const loggedInUser = data.user;

    // ADMIN PAGE CHECK
    if (path.endsWith("/pages/adminDashboard.html")) {
      if (!loggedInUser || loggedInUser.role !== "admin") {
        alert("Access denied. Admins only.");
        window.location.replace("../pages/signin.html");
        return;
      }
    }

    // AUTHENTICATED USERS SHOULD NOT ACCESS SIGN-IN / SIGN-UP
    if (
      loggedInUser &&
      (path.endsWith("/pages/signin.html") || path.endsWith("/pages/signup.html"))
    ) {
      window.location.replace("../pages/index.html");
    }

  } catch (error) {
    console.error("Error verifying user:", error);

    // If fetch itself failed (server down) → treat as logged out
    const publicPages = [
      "/pages/index.html",
      "/pages/signin.html",
      "/pages/signup.html"
    ];

    const isPublicPage = publicPages.some(page => path.endsWith(page));

    if (!isPublicPage) {
      alert("Server unavailable. Please sign in again.");
      window.location.replace("../pages/signin.html");
    }
  }
});


