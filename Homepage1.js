// Get the hamburger menu and nav links
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

// Toggle the 'active' class on the nav-links when the hamburger is clicked
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});
