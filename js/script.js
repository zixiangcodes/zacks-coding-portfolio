// script.js - Updated for modern portfolio
document.addEventListener("DOMContentLoaded", function () {
    // Project filtering functionality
    initializeProjectFilters();

    // Scroll reveal animations
    initializeScrollAnimations();

    // Add interaction effects to project cards
    initializeProjectCards();

    // Initialize mobile navigation
    initializeMobileNavigation();
});

// Function to initialize project filtering
function initializeProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (!filterButtons.length) return;

    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to current button
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            // Filter projects
            projectCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                } else {
                    const cardType = card.getAttribute('data-type');
                    if (cardType === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });

            // Trigger animation for visible cards
            setTimeout(() => {
                projectCards.forEach(card => {
                    if (card.style.display === 'block') {
                        card.classList.add('fadeIn');
                    }
                });
            }, 100);
        });
    });
}

// Function to initialize scroll animations
function initializeScrollAnimations() {
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });

    // Special handling for skill bars
    const skillBars = document.querySelectorAll('.progress');
    const skillsSection = document.querySelector('#skills');

    if (skillBars.length && skillsSection) {
        const skillsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                skillBars.forEach(bar => {
                    const value = bar.getAttribute('data-value') || bar.style.width;
                    setTimeout(() => {
                        bar.style.width = value;
                    }, 200);
                });
                skillsObserver.unobserve(skillsSection);
            }
        }, { threshold: 0.2 });

        skillsObserver.observe(skillsSection);
    }
}

// Function to initialize project cards
function initializeProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        // Add hover interaction
        card.addEventListener('mouseenter', () => {
            card.classList.add('hovering');
        });

        card.addEventListener('mouseleave', () => {
            card.classList.remove('hovering');
        });

        // Add click interaction for mobile
        card.addEventListener('click', (e) => {
            // Only activate if we're on mobile
            if (window.innerWidth <= 768) {
                // Don't activate if clicking on the link
                if (!e.target.classList.contains('project-link') &&
                    !e.target.closest('.project-link')) {

                    // Remove expanded class from all other cards
                    projectCards.forEach(c => {
                        if (c !== card) c.classList.remove('expanded');
                    });

                    // Toggle expanded class on this card
                    card.classList.toggle('expanded');
                }
            }
        });
    });
}

// Function to initialize mobile navigation
function initializeMobileNavigation() {
    const menuButton = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    if (!menuButton || !nav) return;

    menuButton.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuButton.classList.toggle('active');
    });

    // Close menu when clicking a nav link
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            menuButton.classList.remove('active');

            // Smooth scroll to section
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Add theme toggle functionality (light/dark mode)
function initializeThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;

    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', currentTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// Initialize any additional features that should run on load
function initializeAdditionalFeatures() {
    // Back to top button
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Call additional initializations
initializeThemeToggle();
initializeAdditionalFeatures();