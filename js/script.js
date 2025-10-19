const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.getElementById("sidebar");
const closebtn = document.getElementById("close-btn");
const darkModeTgl = document.getElementById("theme-toggle");

// DARK MODE LOGIC
if (darkModeTgl) {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "darkmode") {
    document.body.classList.add("darkmode");
  }

  darkModeTgl.addEventListener("click", () => {
    document.body.classList.toggle("darkmode");
    const mode = document.body.classList.contains("darkmode")
      ? "darkmode"
      : "lightmode";
    localStorage.setItem("theme", mode);
  });
}

// SIDEBAR LOGIC
if (menuToggle && sidebar) {
  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });
}

if (closebtn && sidebar) {
  closebtn.addEventListener("click", () => {
    sidebar.classList.remove("active");
  });
}

// PAGE NAVIGATION BUTTONS
const signInBtn = document.getElementById("sign-in");
const signUpBtn = document.getElementById("sign-up");
const browseBtn = document.getElementById("Browse-Btn");
const adminBtn = document.getElementById("admin-btn");
const ctaBtn = document.getElementById("cta-btn");

if (signInBtn) {
  signInBtn.addEventListener("click", () => {
    window.location.href = "pages/signin.html";
  });
}

if (signUpBtn) {
  signUpBtn.addEventListener("click", () => {
    window.location.href = "pages/signup.html";
  });
}

if (browseBtn) {
  browseBtn.addEventListener("click", () => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      alert("Please sign in to access resources.");
      window.location.href = "pages/signin.html";
      return;
    }
    window.location.href = "pages/booking.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const adminLinks = document.querySelectorAll(".admin-link");

  adminLinks.forEach(link => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const loggedInUser = localStorage.getItem("loggedInUser");
      const userRole = localStorage.getItem("userRole");

      if (!loggedInUser) {
        alert("Please sign in first.");
        window.location.href = "signin.html";
        return;
      }

      if (userRole !== "admin") {
        alert("Access denied. Admins only.");
        return;
      }

      // Admins only
      window.location.href = "pages/adminDashboard.html";
    });
  });
});






if (ctaBtn) {
  ctaBtn.addEventListener("click", () => {
    window.location.href = "pages/signup.html";
  });
}
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.endsWith("settings.html")) {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      alert("Please sign in to access settings.");
      window.location.href = "signin.html";
    }
  }
});

// SETTINGS PAGE LOGIC

//THIS IS JUST FOR NOW SINCE WE DONT HAVE BACKEND
// WILL BE REPLACED WITH ACTUAL USER DATA FETCHED FROM DATABASE
document.addEventListener("DOMContentLoaded", () => {
  const usernameField = document.getElementById("username");
  const saveSettingsBtn = document.getElementById("save-settings");
  const passwordField = document.getElementById("password");
  const confirmPasswordField = document.getElementById("confirmationPassword");
  const emailField = document.getElementById("email");
  const languageField = document.getElementById("language");
  const notificationsField = document.getElementById("notifications");


  const loggedInUser = localStorage.getItem("loggedInUser");
  if (!loggedInUser) return;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const currentUser = users.find((u) => u.email === loggedInUser);
  if (!currentUser) return;


  if (usernameField) usernameField.value = currentUser.email.split("@")[0];
  if (emailField) {
    emailField.value = currentUser.email;
    emailField.readOnly = true;
  }
  if (languageField) languageField.value = currentUser.language || "en";
  if (notificationsField)
    notificationsField.checked = currentUser.notifications || false;
  if (passwordField) passwordField.value = currentUser.password;
  if (confirmPasswordField)
    confirmPasswordField.value = currentUser.password;

  if (!saveSettingsBtn || !passwordField || !confirmPasswordField) return;

  saveSettingsBtn.addEventListener("click", (event) => {
    event.preventDefault();

    const newPassword = passwordField.value.trim();
    const confirmPassword = confirmPasswordField.value.trim();
    const languageValue = languageField?.value || "en";
    const notificationsValue = notificationsField?.checked || false;

    if (!newPassword || !confirmPassword) {
      alert("Please fill in both password fields.");
      return;
    }

    const hasNumber = /\d/.test(newPassword);
    const isLongEnough = newPassword.length >= 8 && newPassword.length <= 12;
    if (!hasNumber || !isLongEnough) {
      alert("Password must be 8–12 characters long and include at least one number.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const userAtIndex = users.findIndex((u) => u.email === loggedInUser);
    if (userAtIndex === -1) {
      alert("User not found.");
      return;
    }

    users[userAtIndex].password = newPassword;
    users[userAtIndex].language = languageValue;
    users[userAtIndex].notifications = notificationsValue;
    localStorage.setItem("users", JSON.stringify(users));

    alert("Password updated successfully! Please sign in again with your new credentials.");
    localStorage.removeItem("loggedInUser");
    window.location.href = "signin.html";
  });
});
