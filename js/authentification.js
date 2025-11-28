document.addEventListener("DOMContentLoaded", async () => {
  const path = window.location.pathname;
  console.log("Current path:", path);

  try {
    const response = await fetch("http://127.0.0.1:8000/api/auth/me", {
      method: "GET",
      credentials: "include"
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      console.warn("User not authenticated");

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

      return;
    }

    const data = await response.json();
    console.log("Data from backend:", data);
    
    // Handle both possible structures: {user: {...}} or directly {...}
    const loggedInUser = data.user || data;
    console.log("Logged in user:", loggedInUser);
    console.log("User role value:", loggedInUser.role);
    console.log("Role type:", typeof loggedInUser.role);

    // ADMIN PAGE CHECK
    if (path.endsWith("/pages/adminDashboard.html")||path.endsWith("/pages/adminUsers.html")) {
      console.log("Checking admin access...");
      console.log("Is user object present?", !!loggedInUser);
      console.log("Role comparison:", loggedInUser.role, "!==", "admin", "→", loggedInUser.role !== "admin");
      
      if (!loggedInUser || loggedInUser.role !== "admin") {
        console.log(" Access denied");
        alert("Access denied. Admins only.");
        window.location.replace("../pages/signin.html");
        return;
      }
      
      console.log("Admin access granted!");
    }

    if (
      loggedInUser &&
      (path.endsWith("/pages/signin.html") || path.endsWith("/pages/signup.html"))
    ) {
      window.location.replace("../pages/index.html");
    }

  } catch (error) {
    console.error("Error verifying user:", error);

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