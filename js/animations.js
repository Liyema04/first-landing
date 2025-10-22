const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = document.querySelector("i"); /*not safe*/


menuBtn.addEventListener("click", (e) => {
    navLinks.classList.toggle("open")

    // Checks for 'open' class in nav-links 
    const isOpen = navLinks.classList.contains("open");
    
    // Changes menu-btn icon in open state
    menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
})

// When clicking on a nav-link: 
navLinks.addEventListener("click", (e) => {
    // Hides other nav-links & reverts to (close state)
    navLinks.classList.remove("open"); 

    // Changes menu-btn icon in close state
    menuBtnIcon.setAttribute("class", "ri-menu-line"); 
})