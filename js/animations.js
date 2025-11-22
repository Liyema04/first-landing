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


const containers = document.querySelectorAll('.text-anim');
const centeredHolder = document.querySelector('.centered-holder');
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
// Observer for desktop (centered-holder container)
const desktopCardsObserve = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }else{
            entry.target.classList.remove("visisble");
        }
    })
}, { rootMargin: "0px 0px -100px 100px" }); // Lower threshold for container or use: "

// Mobile screen observer (individual cards)
const mobileCardsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }else{
            entry.target.classList.remove("visible");
        }
    });
}, { rootMargin: "0px 0px -250px 250px" }); // Or use threshold


function setupAnimations() {
    // Observe all text animations
    containers.forEach(container => observer.observe(container));

    // Desktop & Mobile logic
    if (window.innerWidth >= 600) {
        // Desktop/Tablet: unobserve mobile cards, observe centred-holder
        serviceContainers.forEach(card => mobileCardsObserver.unobserve(card));
        if (centeredHolder) {
            desktopCardsObserve.observe(centeredHolder);
        }
    } else {
        // Mobile: unobserve centered-holder, observe individual cards
        if (centeredHolder) {
            desktopCardsObserve.unobserve(centeredHolder);
        }
        // Mobile: observe individual cards
        serviceContainers.forEach(card => {
            mobileCardsObserver.observe(card);
        });
    }
}
 
// On-Page load animations 
document.addEventListener("DOMContentLoaded", setupAnimations);

// Re-run setup on window resize (with debounce to avoid excessive calls)
let resizeTimeout;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(setupAnimations, 150);
    console.log(resizeTimeout);
});