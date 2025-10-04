const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.getElementById("sidebar");
const closebtn = document.getElementById("close-btn")
const darkModeTgl = document.getElementById("theme-toggle");

darkModeTgl.addEventListener("click", event => {
  document.body.classList.toggle("darkmode")  
})

//Method open side bar
menuToggle.addEventListener("click", event => {
  sidebar.classList.toggle("active");
})


//Method to remove side bar
closebtn.addEventListener("click", event => {
  sidebar.classList.remove("active")
})

//Adding the pages to the button

document.getElementById("sign-in").addEventListener("click", () => {
  window.location.href = "pages/signin.html";
})

document.getElementById("sign-up").addEventListener("click",()=>{
  window.location.href="pages/signup.html";
})

document.getElementById("Browse-Btn").addEventListener("click",()=>{
  window.location.href="pages/resources.html"
})

document.getElementById("Admin-btn").addEventListener("click",()=>{
  window.location.href="pages/adminDashboard.html"
})


document.getElementById("cta-btn").addEventListener("click",()=>{
  window.location.href="pages/signup.html";
})

