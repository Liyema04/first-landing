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

// Section selectors (~ Containers ~) :
const containers = document.querySelectorAll('.text-anim');
const centeredHolders = document.querySelectorAll('.centered-holder');
const serviceContainers = document.querySelectorAll('.service-anim');
const contactContainers = document.querySelectorAll('.contact-anim');

// Query selector for global(!= index.html) animation class:
const item = document.querySelectorAll('.anim-fade-up');

// Observer for animation on other templates:
const globalItemObserver = new IntersectionObserver (
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { 
                entry.target.classList.add('anim-visible');
            } else {
                // Not intersecting remove visible class
                entry.target.classList.remove('anim-visible');
            }    
        });
    }, 
    { threshold: 0.3 }
);

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

// Service Overview Labels -- Animation:
document.addEventListener('DOMContentLoaded', function() {
    const serviceOverviewSection = document.getElementById('serviceOverview');
    if (!serviceOverviewSection) return;

    const serviceSvg = serviceOverviewSection.querySelector('.service-overview__svg');
    const circles = serviceOverviewSection.querySelectorAll('.service-circle');
    const texts = serviceOverviewSection.querySelectorAll('.service-text');
    const numbers = serviceOverviewSection.querySelectorAll('.service-circle-number');
    const lineActivated = serviceOverviewSection.querySelector('#lineActivated');
    const lineDeactivated = serviceOverviewSection.querySelector('#lineDeactivated');

    if (!serviceSvg || !lineActivated || !lineDeactivated || circles.length === 0 || texts.length !== circles.length || numbers.length !== circles.length) return;

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const horizontalBreakpoint = 600;

    const verticalLayout = {
        viewBox: '0 0 360 560',
        line: { x1: 100, y1: 55, x2: 100, y2: 482 },
        circles: [
            { cx: 100, cy: 70 },
            { cx: 100, cy: 200 },
            { cx: 100, cy: 330 },
            { cx: 100, cy: 460 }
        ],
        texts: [
            { x: 170, y: 70 },
            { x: 170, y: 200 },
            { x: 170, y: 330 },
            { x: 170, y: 460 }
        ],
        textAnchor: 'start',
        dominantBaseline: 'middle',
        axis: 'y',
        activeStart: 55,
        circleRadius: 22,
        lineStrokeWidth: 5,
        numberFontSize: 16,
        labelFontSize: 20
    };

    const horizontalLayout = {
        viewBox: '0 0 520 220',
        line: { x1: 70, y1: 110, x2: 460, y2: 110 },
        circles: [
            { cx: 70, cy: 110 },
            { cx: 200, cy: 110 },
            { cx: 330, cy: 110 },
            { cx: 460, cy: 110 }
        ],
        texts: [
            { x: 70, y: 165 },
            { x: 200, y: 165 },
            { x: 330, y: 165 },
            { x: 460, y: 165 }
        ],
        textAnchor: 'middle',
        dominantBaseline: 'middle',
        axis: 'x',
        activeStart: 70,
        circleRadius: 15,
        lineStrokeWidth: 3,
        numberFontSize: 12,
        labelFontSize: 14
    };

    let circlePositions = [];
    let minY = 0;
    let maxY = 0;
    let range = 1;
    let pinDistance = 0;
    let activeAxis = 'y';
    let activeLayout = verticalLayout;

    const isHorizontalLayout = () => window.innerWidth >= horizontalBreakpoint;

    const applySvgLayout = () => {
        activeLayout = isHorizontalLayout() ? horizontalLayout : verticalLayout;
        activeAxis = activeLayout.axis;

        serviceOverviewSection.classList.toggle('service-overview--horizontal', activeAxis === 'x');
        serviceSvg.setAttribute('viewBox', activeLayout.viewBox);

        lineDeactivated.setAttribute('x1', String(activeLayout.line.x1));
        lineDeactivated.setAttribute('y1', String(activeLayout.line.y1));
        lineDeactivated.setAttribute('x2', String(activeLayout.line.x2));
        lineDeactivated.setAttribute('y2', String(activeLayout.line.y2));
        lineDeactivated.setAttribute('stroke-width', String(activeLayout.lineStrokeWidth));

        lineActivated.setAttribute('x1', String(activeLayout.line.x1));
        lineActivated.setAttribute('y1', String(activeLayout.line.y1));
        lineActivated.setAttribute('x2', String(activeLayout.axis === 'x' ? activeLayout.activeStart : activeLayout.line.x1));
        lineActivated.setAttribute('y2', String(activeLayout.axis === 'y' ? activeLayout.activeStart : activeLayout.line.y1));
        lineActivated.setAttribute('stroke-width', String(activeLayout.lineStrokeWidth));

        circles.forEach((circle, index) => {
            const position = activeLayout.circles[index];
            circle.setAttribute('cx', String(position.cx));
            circle.setAttribute('cy', String(position.cy));
            circle.setAttribute('r', String(activeLayout.circleRadius));
        });

        numbers.forEach((num, index) => {
            const position = activeLayout.circles[index];
            num.setAttribute('x', String(position.cx));
            num.setAttribute('y', String(position.cy));
            num.setAttribute('font-size', String(activeLayout.numberFontSize));
        });

        texts.forEach((text, index) => {
            const position = activeLayout.texts[index];
            text.setAttribute('x', String(position.x));
            text.setAttribute('y', String(position.y));
            text.setAttribute('text-anchor', activeLayout.textAnchor);
            text.setAttribute('dominant-baseline', activeLayout.dominantBaseline);
            text.setAttribute('font-size', String(activeLayout.labelFontSize));
        });
    };

    const getCirclePositions = () => {
        const positions = [];
        circles.forEach(circle => {
            const coordinate = activeAxis === 'x'
                ? parseFloat(circle.getAttribute('cx'))
                : parseFloat(circle.getAttribute('cy'));
            if (Number.isFinite(coordinate)) {
                positions.push(coordinate);
            }
        });
        return positions;
    };

    const recalculateTimelineGeometry = () => {
        circlePositions = getCirclePositions();
        if (circlePositions.length !== circles.length) return false;

        minY = circlePositions[0];
        maxY = circlePositions[circlePositions.length - 1];
        range = Math.max(1, maxY - minY);
        return true;
    };

    const setPinDistance = () => {
        const stepCount = Math.max(0, circles.length - 1);
        const stepDistance = Math.max(180, window.innerHeight * 0.28);
        pinDistance = (stepCount * stepDistance) + (window.innerHeight * 0.35);
        serviceOverviewSection.style.setProperty('--service-pin-distance', `${pinDistance}px`);
    };

    const applyProgress = (progress) => {
        const safeProgress = clamp(progress, 0, 1);
        const currentLineY = minY + (range * safeProgress);
        if (activeAxis === 'x') {
            lineActivated.setAttribute('x2', String(clamp(currentLineY, minY, maxY)));
            lineActivated.setAttribute('y2', String(activeLayout.line.y1));
        } else {
            lineActivated.setAttribute('y2', String(clamp(currentLineY, minY, maxY)));
            lineActivated.setAttribute('x2', String(activeLayout.line.x1));
        }

        circles.forEach((circle, index) => {
            const circleY = circlePositions[index];
            const circleProgress = (circleY - minY) / range;

            if (safeProgress >= circleProgress) {
                circle.setAttribute('fill', '#84dbff');
                texts[index].setAttribute('fill', '#84dbff');
                numbers[index].style.fill = '#ffffff';   // active number visible
            } else {
                circle.setAttribute('fill', '#ffffff00');
                texts[index].setAttribute('fill', '#ffffff00');
                numbers[index].style.fill = '#ffffff00'; // inactive number hidden
            }
        });
    };

    const updateServiceTimeline = () => {
        const pinStart = serviceOverviewSection.offsetTop;
        const pinEnd = pinStart + pinDistance;
        const scrollY = window.scrollY;
        const progress = pinDistance <= 0
            ? 1
            : clamp((scrollY - pinStart) / (pinEnd - pinStart), 0, 1);

        applyProgress(progress);
    };

    applySvgLayout();
    if (!recalculateTimelineGeometry()) return;

    if (prefersReducedMotion.matches) {
        serviceOverviewSection.style.setProperty('--service-pin-distance', '0px');
        applyProgress(1);
        window.addEventListener('resize', () => {
            applySvgLayout();
            recalculateTimelineGeometry();
            applyProgress(1);
        });
        return;
    }

    setPinDistance();
    updateServiceTimeline();

    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                updateServiceTimeline();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    let resizeTicking = false;
    window.addEventListener('resize', () => {
        if (!resizeTicking) {
            window.requestAnimationFrame(() => {
                applySvgLayout();
                recalculateTimelineGeometry();
                setPinDistance();
                updateServiceTimeline();
                resizeTicking = false;
            });
            resizeTicking = true;
        }
    });
});

// Solutions Overview Labels -- Animation: (Global)
/* document.addEventListener('DOMContentLoaded', function() {
    const solutionsOverviewSection = document.getElementById('solutionsOverview');
    if (!solutionsOverviewSection) return;

    const solutionsSvg = solutionsOverviewSection.querySelector('.solutions-overview__svg');
    const circles = solutionsOverviewSection.querySelectorAll('.solutions-circle');
    const texts = solutionsOverviewSection.querySelectorAll('.solutions-text');
    const numbers = solutionsOverviewSection.querySelectorAll('.solutions-circle-number');
    const lineActivated = solutionsOverviewSection.querySelector('#lineActivated');
    const lineDeactivated = solutionsOverviewSection.querySelector('#lineDeactivated');

    if (!solutionsSvg || !lineActivated || !lineDeactivated || circles.length === 0 || texts.length !== circles.length || numbers.length !== circles.length) return;


}); */

function setupAnimations() {
    // Observe all text animations
    containers.forEach(container => observer.observe(container));
    item.forEach((iO) => globalItemObserver.observe(iO));

    // Desktop & Mobile logic
    if (window.innerWidth >= 600) {
        // Desktop/Tablet: unobserve mobile cards, observe centred-holder
        serviceContainers.forEach(card => mobileCardsObserver.unobserve(card));
        contactContainers.forEach(card => mobileCardsObserver. unobserve(card));
        
        // Observe ALL centered-holders (services & contacts)
        centeredHolders.forEach(holder => {
            desktopCardsObserve.observe(holder);
        });
    } else {
        // Mobile: unobserve centered-holder, observe individual cards
        centeredHolders.forEach(holder => {
            desktopCardsObserve.unobserve(holder);
        });
        // Mobile: observe individual cards
        serviceContainers.forEach(card => {
            mobileCardsObserver.observe(card);
        });
        contactContainers.forEach(card => {
            mobileCardsObserver.observe(card)
        });
    }

    // Force trigger animation to check for already visible elements 
    setTimeout( () => {
        centeredHolders.forEach(holder => {
            const rect = holder.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                holder.classList.add('visible');
            }
        });
    }, 100);
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

// Progressive scroll animation for local-headline
const localHeadline = document.querySelector('.local-headline');
const headlineItems = document.querySelectorAll('.local-headline .hl');
const descriptionText = document.querySelector('.local-describe p.describe'); // Select description text
const hightlightText = document.querySelector('.local-highlights ul.hi-light-cont'); // Select Highlight text 

if (localHeadline && headlineItems.length > 0) {

    // Detect mobile vs desktop
    const isMobile = () => window.innerWidth <= 768;

    // Only create progress line element on desktop
    let progressLine;
    if (!isMobile()) { 
        progressLine = document.createElement('div');
        progressLine.classList.add('progress-line');
        localHeadline.appendChild(progressLine);
    }

    // Scroll handler with throttling for performance
    let ticking = false;

    function updateProgress() {
        const section = document.getElementById('localCont');
        if (!section) return;
        
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const scrollPos = window.scrollY + window.innerHeight / 2;

        // Calculate progress through the section (0 - 1)
        const progress = Math.max(0, Math.min(1,
            (scrollPos - sectionTop) / (sectionHeight * 0.3)
        ));

        // Activate items sequentially
        const itemThreshold = 1 / headlineItems.length;
        headlineItems.forEach((item, index) => {
            const itemProgress = (index + 1) * itemThreshold;
            if (progress >= itemProgress) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        /* Add this after the loop: solid line
        if (progress >= 1) {
            localHeadline.classList.add('active');
        } else {
            localHeadline.classList.remove('active');
        }
        */
       
        // Getting last child element using request method:
        const lastHeadlineItem =  document.querySelector('.local-headline .hl:last-of-type');
        const describeItem = descriptionText;

        // Check if lst:chld element exists & is active
        if (lastHeadlineItem && lastHeadlineItem.classList.contains('active')) {
            if (!descriptionText.classList.contains('visible')) {
                setTimeout(() => {
                    descriptionText.classList.add('visible');
                }, 300); // 300ms delay after the last title activates 
            }    
        } else {
            // Remove class if the user scrolls back 
            descriptionText.classList.remove('visible');
        }

        // Logic for local highlights animation: 
        // Check if descrption text exist & is visible 
        if (describeItem && describeItem.classList.contains('visible')) {
            if (!hightlightText.classList.contains('visible')) {
                setTimeout(() => {
                   hightlightText.classList.add('visible'); 
                }, 300); // 300ms delay after description text activates
            }
        } else {
            hightlightText.classList.remove('visible');
        }
        
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(updateProgress);
            ticking = true;
        }
    }

    // Recreate progress line on resize if switching from mobile to desktop
    function handleResize() {
        if (!isMobile() && !progressLine) {
            progressLine = document.createElement('div');
            progressLine.classList.add('progress-line');
            localHeadline.appendChild(progressLine);
        } else if (isMobile() && progressLine) {
            progressLine.remove();
            progressLine = null;
        }
        updateProgress();
    }

    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', handleResize);
    updateProgress(); // Initiate call
}

