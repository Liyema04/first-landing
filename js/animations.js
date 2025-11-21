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


 
// On-Page load animations 
document.addEventListener("DOMContentLoaded", function() {
    const containers = document.querySelectorAll('.text-anim');
    const serviceContainers = document.querySelectorAll('.service-anim');

    // Observer for any text(or other) animation:
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); // if intersecting add .visible class
                // observer.unobserve(entry.target); // Not intersecting then stops observing .visible class or use:
            }else{
                // Not intersecting then remove .visible class
                entry.target.classList.remove('visible');
            }
        });
    }, { threshold: 0.3 });

    // Observer for service cards(responsive):
    const desktopCardsObserve = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            entries[0].target.classList.add("visible");
        }else{
            entries[0].target.classList.remove("visible");
        }
    }, 
    {
        threshold: 0.3 
    });

    const mobileCardsObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.classList.add("visible");
            }else{
                entry.classList.remove("visible");
            }
        });
    }, 
    {
        rootMargin: "0px 0px -400px 400px"
    });
    
    window.innerWidth < 600 ? (serviceContainers.forEach(serviceContainer => mobileCardsObserver.observe(serviceContainer))) : (desktopCardsObserve.observe(serviceContainers));

    containers.forEach(container => observer.observe(container)); // Observe each container seperately
});