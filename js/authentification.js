const path = window.location.pathname;
const loggedInUser = localStorage.getItem("loggedInUser");

if (
  !loggedInUser &&
  (
    path.endsWith("/pages/mybookings.html") ||
    path.endsWith("/pages/settings.html") ||
    path.endsWith("/pages/booking.html")
)
)
  
  {
  alert("Please sign in to access this page.");
  window.location.replace("../pages/signin.html");
}

if (path.endsWith("pages/adminDashboard.html")) {
   if(!loggedInUser){
        window.location.replace("../pages/signin.html");

   }
const userRole = localStorage.getItem("userRole");
  if (loggedInUser && userRole !== "admin") {
    alert("Access denied. Admins only.");

    window.location.replace("../pages/signin.html");
  }
}