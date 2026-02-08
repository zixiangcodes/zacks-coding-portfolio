// modern.js (new file)
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            window.scrollTo({
                top: targetElement.offsetTop - 70, // Adjust for header height
                behavior: 'smooth'
            });
        });
    });

    // Animate skill bars on scroll
    const skillsSection = document.querySelector('#skills');
    const progressBars = document.querySelectorAll('.progress');

    const animateProgressBars = () => {
        const sectionTop = skillsSection.getBoundingClientRect().top;
        const triggerPoint = window.innerHeight * 0.8;

        if (sectionTop < triggerPoint) {
            progressBars.forEach(bar => {
                const targetWidth = bar.dataset.width || bar.style.width;
                bar.style.width = targetWidth;
            });
            window.removeEventListener('scroll', animateProgressBars);
        }
    };

    // Initialize progress bars at 0 width
    progressBars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.dataset.width = targetWidth;
        bar.style.width = '0';
    });

    // Add scroll listener
    window.addEventListener('scroll', animateProgressBars);

    // Trigger once on load in case skills section is already in view
    animateProgressBars();

    // Add fade-in animation for project cards
    const projectCards = document.querySelectorAll('.project-card');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fadeIn');
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        fadeInObserver.observe(card);
    });
});