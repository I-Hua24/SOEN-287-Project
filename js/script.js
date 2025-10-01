const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.getElementById("sidebar");
const closeBtn = document.getElementById("close-btn");
const darkModeTgl=document.getElementById("theme-toggle");



darkModeTgl.addEventListener("click",()=>{
  document.body.classList.toggle("dark-mode")  
})



menuToggle.addEventListener("click", () => {
  sidebar.classList.add("active");
});

closeBtn.addEventListener("click", () => {
  sidebar.classList.remove("active");
});


