// Mobile NavBar: 
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i"); /*safe*/

// Touch behaviours - Mobile Drop-down Nav
function syncMobileNavEffects(isOpen) { 
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const shouldOpen = isMobile && isOpen;

    document.body.classList.toggle('mobile-nav__open', shouldOpen);

    let backdrop = document.querySelector('.mobile-nav__backdrop');
    if (!backdrop && shouldOpen) {
        backdrop = document.createElement('div');
        backdrop.className = 'mobile-nav__backdrop';
        document.body.appendChild(backdrop);
    }

    if (backdrop) {
        backdrop.classList.toggle('mobile-nav__backdrop-open', shouldOpen);
    }
}

function closeMobileDropdown() {
    navLinks.classList.remove("open");
    menuBtnIcon.setAttribute("class", "ri-menu-line");
    syncMobileNavEffects(false);
}


menuBtn.addEventListener("click", (e) => {
    navLinks.classList.toggle("open");

    // Checks for 'open' class in nav-links | Compute initial state first
    const isOpen = navLinks.classList.contains("open");

    // Then sync backdrop + scroll back
    syncMobileNavEffects(isOpen);

    // Changes menu-btn icon in open state
    menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
})

// When clicking on a nav-link: 
navLinks.addEventListener("click", (e) => {
    // Hides other nav-links & reverts to (close state)
    closeMobileDropdown();
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

// Interactive Timelines Engine:
function initOverviewTimeline(config) {
    // setup + guards
    const section = document.getElementById(config.sectionId);
    if (!section) return;

    const svg = section.querySelector(config.svgSelector);
    const markers = section.querySelectorAll(config.markerSelector);
    const numbers = section.querySelectorAll(config.numberSelector);
    const texts = section.querySelectorAll(config.textSelector);
    const lineBase = section.querySelector(config.lineBaseSelector);
    const lineActive = section.querySelector(config.lineActiveSelector);

    const isValid = svg && lineBase && lineActive && markers.length > 0 && texts.length === markers.length && numbers.length === markers.length;
    if (!isValid) {
        console.warn(`[timeline] Invalid config for #${config.sectionId}`);
        return;
    }

    const svgNs = 'http://www.w3.org/2000/svg';
    texts.forEach((textNode) => {
        if (!textNode.dataset.label) {
            textNode.dataset.label = textNode.textContent.trim();
        }
    });

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // per-instance state
    let markerPositions = [];
    let minPos = 0;
    let maxPos = 0;
    let range = 1;
    let pinDistance = 0;
    let activeAxis = "y"
    let activeLayout = config.layouts.vertical

    const isHorizontalLayout = () => window.innerWidth >= (config.horizontalBreakpoint ?? 600);
    
    const getTextLength = (textNode, sample, fontSize) => {
        textNode.setAttribute('font-size', String(fontSize));
        textNode.textContent = sample;
        try {
            const measured = textNode.getComputedTextLength();
            if (Number.isFinite(measured)) return measured;
        } catch (error) {
            // Use fallback estimate if browser cannot measure yet.
        }
        return sample.length * fontSize * 0.56;
    };

    const buildWrappedLines = (textNode, label, maxWidth, maxLines, fontSize) => {
        const words = label.split(/\s+/).filter(Boolean);
        if (words.length === 0) return [''];

        const lines = [];
        let current = words[0];

        for (let i = 1; i < words.length; i++) {
            const candidate = `${current} ${words[i]}`;
            if (getTextLength(textNode, candidate, fontSize) <= maxWidth) {
                current = candidate;
                continue;
            }

            lines.push(current);
            current = words[i];

            if (lines.length === maxLines - 1) {
                current = `${current} ${words.slice(i + 1).join(' ')}`.trim();
                break;
            }
        }

        lines.push(current);
        if (lines.length > maxLines) return null;
        if (lines.some((line) => getTextLength(textNode, line, fontSize) > maxWidth)) return null;
        return lines;
    };

    const getViewBoxMetrics = () => {
        const values = String(activeLayout.viewBox || '')
            .trim()
            .split(/\s+/)
            .map(Number);

        if (values.length !== 4 || values.some((value) => !Number.isFinite(value))) {
            return { minX: 0, minY: 0, width: 0, height: 0 };
        }

        return {
            minX: values[0],
            minY: values[1],
            width: values[2],
            height: values[3]
        };
    };

    const getBoundedLabelWidth = (position, preferredWidth) => {
        const { minX, width } = getViewBoxMetrics();
        if (width <= 0) return preferredWidth;

        const edgePadding = config.labelEdgePadding ?? 12;
        const maxX = minX + width;
        const anchor = activeLayout.textAnchor;

        let bounded = preferredWidth;
        if (anchor === 'middle') {
            const halfSpace = Math.max(
                0,
                Math.min(position.x - minX, maxX - position.x) - edgePadding
            );
            bounded = Math.min(preferredWidth, halfSpace * 2);
        } else if (anchor === 'start') {
            bounded = Math.min(preferredWidth, Math.max(0, (maxX - position.x) - edgePadding));
        } else if (anchor === 'end') {
            bounded = Math.min(preferredWidth, Math.max(0, (position.x - minX) - edgePadding));
        }

        return Math.max(80, bounded);
    };

    const setTimelineLabel = (textNode, label, position) => {
        const baseFontSize = activeLayout.labelFontSize;
        const minFontSize = config.minLabelFontSize ?? Math.max(10, baseFontSize - 4);
        const maxLines = config.labelMaxLines ?? 2;
        const lineHeightEm = config.labelLineHeightEm ?? 1.08;
        const preferredWidth = activeAxis === 'x'
            ? (activeLayout.labelMaxWidth ?? config.horizontalLabelMaxWidth ?? 190)
            : (activeLayout.labelMaxWidth ?? config.verticalLabelMaxWidth ?? 250);
        const maxWidth = getBoundedLabelWidth(position, preferredWidth);

        textNode.setAttribute('x', String(position.x));
        textNode.setAttribute('y', String(position.y));
        textNode.setAttribute('text-anchor', activeLayout.textAnchor);
        textNode.setAttribute('dominant-baseline', activeLayout.dominantBaseline);

        if (!config.wrapLabels) {
            textNode.textContent = label;
            textNode.setAttribute('font-size', String(baseFontSize));
            return;
        }

        let fontSize = baseFontSize;
        let lines = [label];

        for (let size = baseFontSize; size >= minFontSize; size--) {
            const wrapped = buildWrappedLines(textNode, label, maxWidth, maxLines, size);
            if (wrapped) {
                fontSize = size;
                lines = wrapped;
                break;
            }
        }

        textNode.textContent = '';
        textNode.setAttribute('font-size', String(fontSize));

        const firstDy = lines.length > 1 ? -((lines.length - 1) * lineHeightEm) / 2 : 0;
        lines.forEach((line, index) => {
            const tspan = document.createElementNS(svgNs, 'tspan');
            tspan.setAttribute('x', String(position.x));
            tspan.setAttribute('dy', `${index === 0 ? firstDy : lineHeightEm}em`);
            tspan.textContent = line;
            textNode.appendChild(tspan);
        });
    };

    // applyLayout()
    const applyLayout = () => {
        activeLayout = isHorizontalLayout() ? (config.layouts.horizontal) : (config.layouts.vertical);
        activeAxis = activeLayout.axis;

        section.classList.toggle(config.horizontalClass, activeAxis === 'x');
        svg.setAttribute("viewBox", activeLayout.viewBox);

        lineBase.setAttribute('x1', String(activeLayout.line.x1));
        lineBase.setAttribute('y1', String(activeLayout.line.y1));
        lineBase.setAttribute('x2', String(activeLayout.line.x2));
        lineBase.setAttribute('y2', String(activeLayout.line.y2));
        lineBase.setAttribute('stroke-width', String(activeLayout.lineStrokeWidth));

        lineActive.setAttribute('x1', String(activeLayout.line.x1));
        lineActive.setAttribute('y1', String(activeLayout.line.y1));
        lineActive.setAttribute('x2', String(activeLayout.axis === 'x' ? activeLayout.activeStart : activeLayout.line.x1));
        lineActive.setAttribute('y2', String(activeLayout.axis === 'y' ? activeLayout.activeStart : activeLayout.line.y1));
        lineActive.setAttribute('stroke-width', String(activeLayout.lineStrokeWidth));

        markers.forEach((marker, index) => {
            const center = activeLayout.markers[index];
            setMarkerGeometry(marker, center, activeLayout.markerRadius, config.markerShape);
        });

        numbers.forEach((num, index) => {
            const position = activeLayout.markers[index];
            num.setAttribute('x', String(position.cx));
            num.setAttribute('y', String(position.cy));
            num.setAttribute('font-size', String(activeLayout.numberFontSize)); 
        });

        texts.forEach((text, index) => {
            const position = activeLayout.texts[index];
            const rawLabel = text.dataset.label ?? '';
            setTimelineLabel(text, rawLabel, position);
        });
    };

    const setMarkerGeometry = (marker, center, radius, shape) => {
        const { cx, cy } = center;

        // Keep a single source of truth for position lookups
        marker.dataset.centerX = String(cx);
        marker.dataset.centerY = String(cy);

        if (shape === "diamond") {
            // A diamond is a square rotated 45deg around its center
            const side = radius * Math.SQRT2;
            marker.setAttribute("x", String(cx - side / 2));
            marker.setAttribute("y", String(cy - side / 2));
            marker.setAttribute("width", String(side));
            marker.setAttribute("height", String(side));
            marker.setAttribute("transform", `rotate(45 ${cx} ${cy})`);
        } else {
            marker.setAttribute("cx", String(cx));
            marker.setAttribute("cy", String(cy));
            marker.setAttribute("r", String(radius));
            marker.removeAttribute("transform");
        }
    };


    // Getting marker positions:
    const getMarkerPositions = () => {
        const positions = [];
        markers.forEach(marker => {
            const coordinate = activeAxis === 'x' 
            ? parseFloat(marker.dataset.centerX) 
            : parseFloat(marker.dataset.centerY);
            if (Number.isFinite(coordinate)) {
                positions.push(coordinate);
            }
        });
        return positions;
    };

    // recalculateTimelineGeometry()
    const recalculateTimelineGeometry = () => {
        markerPositions = getMarkerPositions();
        if (markerPositions.length !== markers.length) return false;

        minPos = markerPositions[0];
        maxPos = markerPositions[markerPositions.length - 1];
        range = Math.max(1, maxPos - minPos);
        return true;
    };

    const setPinDistance = () => {
        const stepCount = Math.max(0, markers.length - 1);
        const stepDistance = Math.max(180, window.innerHeight * 0.28);
        pinDistance = (stepCount * stepDistance) + (window.innerHeight * 0.35);
        section.style.setProperty(config.pinDistanceVar, `${pinDistance}px`);
    };

    // applyProgress()
    const applyProgress = (progress) => {
        const safeProgress = clamp(progress, 0, 1);
        const currentLinePos = minPos + (range * safeProgress);
        if (activeAxis === 'x') {
            lineActive.setAttribute('x2', String(clamp(currentLinePos, minPos, maxPos)));
            lineActive.setAttribute('y2', String(activeLayout.line.y1));
        } else {
            lineActive.setAttribute('y2', String(clamp(currentLinePos, minPos, maxPos)));
            lineActive.setAttribute('x2', String(activeLayout.line.x1));
        }

        markers.forEach((marker, index) => {
            const markerPos = markerPositions[index];
            const markerProgress = (markerPos - minPos) / range;

            if (safeProgress >= markerProgress) {
                marker.setAttribute('fill', '#84dbff');
                texts[index].setAttribute('fill', '#fff');
                numbers[index].style.fill = '#ffffff'; // active number visible
            } else {
                marker.setAttribute('fill', '#ffffff00');
                texts[index].setAttribute('fill', '#ffffff00');
                numbers[index].style.fill = '#ffffff00'; // inactive number visible
            }
        });
    };
    
    // scroll/resise/reduced-motion listeners
    const updateTimelineFromScroll = () => {
        const pinStart = section.offsetTop;
        const pinEnd = pinStart + pinDistance;
        const scrollPos = window.scrollY;
        const progress = pinDistance <= 0 
        ? 1 
        : clamp((scrollPos - pinStart) / (pinEnd - pinStart), 0, 1);

        applyProgress(progress);
    };

    applyLayout();
    if (!recalculateTimelineGeometry()) return;
    
    if (prefersReducedMotion.matches) {
        section.style.setProperty(config.pinDistanceVar, '0px');
        applyProgress(1);
        window.addEventListener('resize', () => {
            applyLayout();
            recalculateTimelineGeometry();
            applyProgress(1);
        });
        return;
    }

    setPinDistance();
    updateTimelineFromScroll();

    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if(!scrollTicking) {
            window.requestAnimationFrame(() => {
                updateTimelineFromScroll();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    let resizeTicking = false;
    window.addEventListener('resize', () => {
        if (!resizeTicking) {
            window.requestAnimationFrame(() => {
                applyLayout();
                recalculateTimelineGeometry();
                setPinDistance();
                updateTimelineFromScroll();
                resizeTicking = false;
            });
            resizeTicking = true;
        }
    });
}

const serviceOverviewConfig = {
    sectionId: 'serviceOverview',
    markerShape: 'circle',
    wrapLabels: false,
    // selectors:
    svgSelector: '.service-overview__svg',
    markerSelector: '.service-circle',
    textSelector: '.service-text',
    numberSelector: '.service-circle-number',
    lineBaseSelector: '.timeline-line--base',
    lineActiveSelector: '.timeline-line--active',
    // Layouts:

    // behavior/style hooks
    horizontalClass: 'service-overview--horizontal',
    pinDistanceVar: '--service-pin-distance',
    horizontalBreakpoint: 600,
    
    // geometry
    layouts: {
        // Vertical (Mobile):
        vertical: {
            viewBox: '0 0 360 560',
            line: { x1: 100, y1: 55, x2: 100, y2: 482 },
            markers: [
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
            markerRadius: 22,
            lineStrokeWidth: 5,
            numberFontSize: 16,
            labelFontSize: 20
        },
        // Horizontal (Destop & Tablet):
        horizontal: {
            viewBox: '0 0 520 220',
            line: { x1: 70, y1: 110, x2: 460, y2: 110 },
            markers: [
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
            markerRadius: 15,
            lineStrokeWidth: 3,
            numberFontSize: 12,
            labelFontSize: 14   
        },
    }
};

const solutionsOverviewConfig = {
    sectionId: 'solutionsOverview',
    markerShape: 'diamond',
    wrapLabels: true,
    labelMaxLines: 2,
    labelLineHeightEm: 1.08,
    verticalLabelMaxWidth: 196,
    horizontalLabelMaxWidth: 168,
    minLabelFontSize: 14,
    labelEdgePadding: 14,
    // selectors: 
    svgSelector: '.solutions-overview__svg',
    markerSelector: '.solutions-marker', // diamonds
    textSelector: '.solutions-text',
    numberSelector: '.solutions-circle-number',
    lineBaseSelector: '.timeline-line--base',
    lineActiveSelector: '.timeline-line--active',
    // Layouts:

    // behavior/style hooks
    horizontalClass: "solutions-overview--horizontal",
    pinDistanceVar: "--solutions-pin-distance",
    horizontalBreakpoint: 600,

    layouts: {
        // Vertical (Mobile):
        vertical: {
        viewBox: "0 0 360 430",
        line: { x1: 100, y1: 55, x2: 100, y2: 352 },
        markers: [
            { cx: 100, cy: 70 },
            { cx: 100, cy: 200 },
            { cx: 100, cy: 330 }
        ],
        texts: [
            { x: 150, y: 70 },
            { x: 150, y: 200 },
            { x: 150, y: 330 }
        ],
        textAnchor: "start",
        dominantBaseline: "middle",
        axis: "y",
        activeStart: 55,
        markerRadius: 20.1, // +15%
        lineStrokeWidth: 4,
        numberFontSize: 16.65, // +15%
        labelFontSize: 24.7, // +15%
        labelMaxWidth: 196
        },
        // Horizontal (Destop & Tablet):
        horizontal: {
        viewBox: "0 0 740 230",
        line: { x1: 90, y1: 95, x2: 650, y2: 95 },
        markers: [
            { cx: 90, cy: 95 },
            { cx: 370, cy: 95 },
            { cx: 650, cy: 95 }
        ],
        texts: [
            { x: 90, y: 158 },
            { x: 370, y: 158 },
            { x: 650, y: 158 }
        ],
        textAnchor: "middle",
        dominantBaseline: "middle",
        axis: "x",
        activeStart: 90,
        markerRadius: 16.1, // +10%
        lineStrokeWidth: 3,
        numberFontSize: 12.65, // +10%
        labelFontSize: 20.7, // +10%
        labelMaxWidth: 168
        }
    }    

};

// `init` event listeners
document.addEventListener('DOMContentLoaded', () => {
    initOverviewTimeline(serviceOverviewConfig);
    initOverviewTimeline(solutionsOverviewConfig);
    initDesktopStickyNav();
    initMobileDropdownNav();
    initOutsideTapClose();
});

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

// Desktop Sticky Navbar (Scroll-Direction Aware)
function initDesktopStickyNav() {
    const stickyHost =  document.querySelector('.site-header') || document.querySelector('nav');
    const navBar = document.querySelector('.nav-bar');
    const menuIcon = document.getElementById('menu-btn')?.querySelector('i');
    if (!stickyHost || !navBar) return; // Bails if mark-up isn't found

    const DESKTOP = window.matchMedia('(min-width: 769px)');
    const TOP_THRESHOLD = 80; // pixels below this wil restore pill nav
    const DELTA = 5; // ignores the tiny scroll jitter

    // Always start clean on non-desktop to avoid stale sticky classes.
    if (!DESKTOP.matches) {
        stickyHost.classList.remove('apex-nav--pinned', 'apex-nav--hidden');
    }

    let lastScrollY = window.scrollY;
    let rafPending = false;

    function handleScroll() {
        const current = window.scrollY;
        const direction = current - lastScrollY;
        
        if (Math.abs(direction) < DELTA) {
            rafPending = false;   
            return;// ignores micro-movements
        }    

        if (current <= TOP_THRESHOLD) {
            // Back at top? Then restore original pill nav
            stickyHost.classList.remove('apex-nav--pinned', 'apex-nav--hidden');
        } else if (direction > 0) {
            // Scrolling down? Pin it, then hide it
            stickyHost.classList.add('apex-nav--pinned', 'apex-nav--hidden');  
        } else {
            // Scrolling up? Keep it pinned and reveal
            stickyHost.classList.add('apex-nav--pinned');
            stickyHost.classList.remove('apex-nav--hidden');
        }

        lastScrollY = current;
        rafPending = false;
    }

    function onScroll() {
        if (!DESKTOP.matches || rafPending) return; // desktop + throttle
        rafPending = true;
        requestAnimationFrame(handleScroll);
    }

    function onResize() {
        if (!DESKTOP.matches) {
            // Perhaps crosses into mobile -- clear any stuck desktop classes
            stickyHost.classList.remove('apex-nav--pinned', 'apex-nav--hidden');
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
} 

// Moblie Sticky Drop-down Nav (Scroll-direction Aware): 
function initMobileDropdownNav() {
    const mobileStickyHost = document.querySelector('.site-header') || document.querySelector('nav');
    const mobileNav = document.querySelector('.nav-bar');
    if (!mobileStickyHost || !mobileNav) return;
    
    const MOBILE = window.matchMedia('(max-width: 768px)');
    const TOP_THRESHOLD = 60;
    const DELTA = 5;

    if (!MOBILE.matches) {
        mobileStickyHost.classList.remove('mobile-nav__active', 'mobile-nav__hidden');
        syncMobileNavEffects(false);
    }

    let lastScrollY = window.scrollY;
    let rafPending = false;

    function handleScroll() {
        const current = window.scrollY;
        const direction = current - lastScrollY;
        const isDropdownOpen = navLinks.classList.contains('open');

        // Ignores tiny jitter
        if (Math.abs(direction) < DELTA) {
            rafPending = false;
            return;
        }

        if (current <= TOP_THRESHOLD) {
            // Back at top/At the top? Then nav returns to normal state
            mobileStickyHost.classList.remove('mobile-nav__active', 'mobile-nav__hidden');
        } else if (direction > 0 && isDropdownOpen) {
            mobileStickyHost.classList.remove('mobile-nav__hidden');
            lastScrollY = current;  
        } else if (direction > 0) {
            // Scrolling down? Active but hidden
            mobileStickyHost.classList.add('mobile-nav__active', 'mobile-nav__hidden');
            closeMobileDropdown(); // closes dropdown and syncs effects
        } else {
            // Scrolling up? Keep active and reveal
            closeMobileDropdown(); // closes dropdown and syncs effects
            mobileStickyHost.classList.add('mobile-nav__active');
            mobileStickyHost.classList.remove('mobile-nav__hidden');
        }

        lastScrollY = current;
        rafPending = false;
    }

    function onResize() {
        if (!MOBILE.matches) {
            mobileStickyHost.classList.remove('mobile-nav__active', 'mobile-nav__hidden');
            closeMobileDropdown();
        }
    }
    
    function onScroll() {
        if (!MOBILE.matches || rafPending) return;
        rafPending = true;
        requestAnimationFrame(handleScroll);
    }

    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
}

function initOutsideTapClose() {
    document.addEventListener("pointerdown", (e) => {
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        const isOpen = navLinks.classList.contains("open");
        if (!isMobile || !isOpen) return;

        const insideMenu = navLinks.contains(e.target);
        const onMenuBtn = menuBtn.contains(e.target);
        if (insideMenu || onMenuBtn) return;

        closeMobileDropdown();
    });
}
