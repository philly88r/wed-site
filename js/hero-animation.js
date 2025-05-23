// Hero animation script inspired by Shadcn UI and Framer Motion
document.addEventListener('DOMContentLoaded', function() {
    const titles = ["rebellious", "unique", "unforgettable", "authentic", "rule-breaking"];
    let currentTitleIndex = 0;
    const titleElement = document.getElementById('animated-title');
    
    if (!titleElement) return;
    
    // Initial setup
    updateTitle();
    
    // Set interval to change title every 2 seconds
    setInterval(() => {
        currentTitleIndex = (currentTitleIndex + 1) % titles.length;
        updateTitle();
    }, 2000);
    
    function updateTitle() {
        // Fade out current title
        titleElement.style.opacity = 0;
        titleElement.style.transform = 'translateY(-20px)';
        
        // After a short delay, change text and fade in
        setTimeout(() => {
            titleElement.textContent = titles[currentTitleIndex];
            titleElement.style.opacity = 1;
            titleElement.style.transform = 'translateY(0)';
        }, 300);
    }
});
