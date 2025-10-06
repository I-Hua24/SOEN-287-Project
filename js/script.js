
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
const adminBtn = document.getElementById("Admin-btn");
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
    window.location.href = "pages/resources.html";
  });
}

if (adminBtn) {
  adminBtn.addEventListener("click", () => {
    window.location.href = "pages/adminDashboard.html";
  });
}

if (ctaBtn) {
  ctaBtn.addEventListener("click", () => {
    window.location.href = "pages/signup.html";
  });
}

// SETTINGS PAGE LOGIC

//THIS IS JUST FOR NOW SINCE WE DONT HAVE BACKEND
// WILL BE REPLACED WITH ACTUAL USER DATA FETCHED FROM DATABASE
document.addEventListener("DOMContentLoaded", () => {
  const saveBtn = document.querySelector("#save-settings");
  if (!saveBtn) return; // if not on settings page, stop here


  const username = document.querySelector("#username");
  const email = document.querySelector("#email");
  const password = document.querySelector("#password");
  const confirmPassword = document.querySelector("#confirmationPassword");
  const language = document.querySelector("#language");
  const notifications = document.querySelector("#notifications");

  // Load saved user data
  username.value = localStorage.getItem("username") || "";
  email.value = localStorage.getItem("email") || "";
  password.value = localStorage.getItem("password") || "";
  confirmPassword.value = localStorage.getItem("confirmationPassword") || "";
  language.value = localStorage.getItem("language") || "en";
  notifications.checked = localStorage.getItem("notifications") === "true";

  // Save data on click

  
  saveBtn.addEventListener("click", (event) => {
    if (!username.value.trim() || !email.value.trim() || !password.value.trim()) {
  alert("Please fill in all required fields.");
  return;
}

    event.preventDefault();

    const passwordValue = password.value.trim();
    const hasNumber = /\d/.test(passwordValue);
    const isLongEnough = passwordValue.length >= 8 && passwordValue.length <= 12;
    if (!hasNumber || !isLongEnough) {
      alert("Password must be 8-12 characters long and include at least one number.");
      return;
    }

    const confirmPasswordValue = confirmPassword.value.trim();
    if (passwordValue !== confirmPasswordValue) {
      alert("Passwords do not match.");
      return;
    }
    
    const emailValue = email.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailPattern.test(emailValue);
    if (!isValidEmail) {
      alert("Please enter a valid email address.");
      return;
    }
    
    
    localStorage.setItem("username", username.value);
    localStorage.setItem("email", email.value);
    localStorage.setItem("password", password.value);
    localStorage.setItem("language", language.value);
    localStorage.setItem("notifications", notifications.checked);


//REPLACE ALERT WITH A <P> TAG THAT SHOWS SUCCESS MESSAGE ONCE SAVED

    alert("Settings saved successfully!");
  });
});

