// Logo carousel animation inspired by the React component
document.addEventListener('DOMContentLoaded', function() {
    const logoContainers = document.querySelectorAll('.logo-container-animation');
    
    if (logoContainers.length === 0) return;
    
    // Initialize the logos with animation
    logoContainers.forEach((container, index) => {
        // Set initial state
        container.style.opacity = '0';
        container.style.transform = 'translateY(20px)';
        
        // Animate in with delay based on index
        setTimeout(() => {
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 200 * index);
        
        // Set up the hover animation
        container.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        container.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Set up periodic subtle animations
    setInterval(() => {
        const randomIndex = Math.floor(Math.random() * logoContainers.length);
        const randomLogo = logoContainers[randomIndex];
        
        // Add a subtle pulse animation
        randomLogo.classList.add('logo-pulse');
        
        // Remove the animation class after it completes
        setTimeout(() => {
            randomLogo.classList.remove('logo-pulse');
        }, 1000);
    }, 3000);
});
