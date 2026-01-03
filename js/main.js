// Ensures new tabs open for social links:
document.querySelectorAll('.social-icons a').forEach(link => {
    link.addEventListener('click', function(e) {
        window.open(this.href, '_blank');
    });
});