// Only for the experience slider section, which is the last section of the website. 
// This is because the experience slider section has a lot of dynamic content that needs to be loaded after the page has loaded, 
// and it also has a lot of animations that need to be triggered after the page has loaded.
// Drag to scroll for Experience Slider
const experienceSlider = document.querySelector('.experience-slider');
let isDown = false;
let startX;
let scrollLeft;

experienceSlider.addEventListener('mousedown', (e) => {
    isDown = true;
    experienceSlider.classList.add('is-dragging');
    startX = e.pageX - experienceSlider.offsetLeft;
    scrollLeft = experienceSlider.scrollLeft;
});

experienceSlider.addEventListener('mouseleave', () => {
    isDown = false;
    experienceSlider.classList.remove('is-dragging');
});

experienceSlider.addEventListener('mouseup', () => {
    isDown = false;
    experienceSlider.classList.remove('is-dragging');
});

experienceSlider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - experienceSlider.offsetLeft;
    const walk = (x - startX) * 2; // * 2 controls scroll speed
    experienceSlider.scrollLeft = scrollLeft - walk;
});