// Force page reload when using back/forward buttons
window.addEventListener('pageshow', function (event) {
  if (event.persisted || performance.getEntriesByType("navigation")[0].type === 'back_forward') {
    window.location.reload();
  }
});

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


//Search bar logic(doing that during the week)

const searchInput = document.getElementById("global-search");
const suggestionsBox = document.getElementById("search-suggestions");

const pageRoutes = {
    home: "/",
    settings: "/pages/settings.html",
    booking: "/booking",
    "my bookings": "/mybookings",
    admin: "/pages/adminDashboard.html",
    resources: "/booking",
    dashboard: "/pages/adminDashboard.html",
    help: "/pages/support.html"
};

// 🔥 Live suggestions while typing
searchInput.addEventListener("input", function () {
    const query = searchInput.value.trim().toLowerCase();
    showSuggestions(query);
});

// 🔥 Press Enter = pick first suggestion
searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        const firstSuggestion = suggestionsBox.querySelector(".suggestion-item");
        if (firstSuggestion) {
            window.location.href = firstSuggestion.dataset.link;
        }
    }
});

// Generate dropdown
function showSuggestions(query) {
    suggestionsBox.innerHTML = ""; // Clear previous

    if (!query) {
        suggestionsBox.style.display = "none";
        return;
    }

    // Match pages based on substring match
    const matches = Object.keys(pageRoutes)
        .filter(key => key.includes(query))
        .slice(0, 5); // show max 5 suggestions

    if (matches.length === 0) {
        suggestionsBox.style.display = "none";
        return;
    }

    matches.forEach(key => {
        const div = document.createElement("div");
        div.classList.add("suggestion-item");
        div.textContent = capitalizeFirstLetter(key);
        div.dataset.link = pageRoutes[key];

        // Click to go
        div.addEventListener("click", () => window.location.href = div.dataset.link);

        suggestionsBox.appendChild(div);
    });

    suggestionsBox.style.display = "block";
}

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

























// Get search input

/*
const searchInput = document.getElementById("global-search");
const suggestionsBox = document.getElementById("search-suggestions");

// Page mappings
const pageRoutes = {
    home: "/",
    settings: "/pages/settings.html",
    booking: "/booking",
    "my bookings": "/mybookings",
    admin: "/pages/adminDashboard.html",
    resources: "/booking",
    dashboard: "/pages/adminDashboard.html",
    help: "/pages/support.html"
};

if (searchInput) {
    searchInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            launchSearch();
        }
    });
}

// Search logic
function launchSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return; // prevent empty search

    // Find the matching page
    const matchedPage = Object.keys(pageRoutes).find((key) =>
        query.includes(key)
    );

    if (matchedPage) {
        window.location.href = pageRoutes[matchedPage];
    } else {
        alert(`No page matched "${query}"`);
    }
}
*/