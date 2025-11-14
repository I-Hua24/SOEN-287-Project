
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
    window.location.href = "../pages/signin.html";
  });
}

if (signUpBtn) {
  signUpBtn.addEventListener("click", () => {
    window.location.href = "../pages/signup.html";
  });
}

//Browse and admin buttons
  


//Search bar logic(doing that during the week)