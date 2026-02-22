// Ensures new tabs open for social links:
document.querySelectorAll('.social-icons a').forEach(link => {
    link.addEventListener('click', function(e) {
        window.open(this.href, '_blank');
    });
});

// Service card buttons from index.html (redirect):
function initManagedServiceResponsiveLinks() {
    const desktopOrTablet = window.matchMedia('(min-width: 769px)');
    // ID remap for duplicated desktop/tablet service blocks.
    const desktopHashMap = {
        serviceExp1: 'serviceExp1Desk',
        serviceExp3: 'serviceExp3Desk',
        serviceExp5: 'serviceExp5Desk'
    };

    const links = document.querySelectorAll(
        'a[href="/templates/services.html#serviceExp1"],' +
        'a[href="/templates/services.html#serviceExp3"],' +
        'a[href="/templates/services.html#serviceExp5"]'
    );

    links.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            const url = new URL(link.getAttribute('href'), window.location.origin);
            const sourceHash = url.hash.replace('#', '');

            const targetHash = desktopOrTablet.matches
                ? (desktopHashMap[sourceHash] || sourceHash)
                : sourceHash;

            window.location.assign(`${url.pathname}#${targetHash}`);
        });
    });
}

// DOM Handling:
document.addEventListener("DOMContentLoaded", () => {
    initManagedServiceResponsiveLinks();
});
