const menuToggle=document.getElementById("menu-toggle");
const sidebar=document.getElementById("sidebar");
const closebtn=document.getElementById("close-btn")
const darkModeTgl=document.getElementById("theme-toggle");



darkModeTgl.addEventListener("click",event=>{
  document.body.classList.toggle("darkmode")  
})

//Method open side bar
menuToggle.addEventListener("click",event=>{
  sidebar.classList.toggle("active");
})


//Method to remove side bar
closebtn.addEventListener("click",event=>{
  sidebar.classList.remove("active")
})













































































/*const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.getElementById("sidebar");
const closeBtn = document.getElementById("close-btn");
const darkModeTgl=document.getElementById("theme-toggle");



darkModeTgl.addEventListener("click",()=>{
  document.body.classList.toggle("darkmode")  
})



menuToggle.addEventListener("click", () => {
  sidebar.classList.add("active");
});

closeBtn.addEventListener("click", () => {
  sidebar.classList.remove("active");
});
*/

