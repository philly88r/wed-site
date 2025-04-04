/**
 * Hero Component for Altare
 * 
 * This component creates an animated hero section with a video background
 * following the Altare brand guidelines
 */

// Create and append the necessary styles
const styleElement = document.createElement('style');
styleElement.textContent = `
  /* Hero animations */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .hero-title {
    opacity: 0;
    animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .hero-description {
    opacity: 0;
    animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
  }

  .hero-actions {
    opacity: 0;
    animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
  }

  /* Hero badge */
  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    color: white;
    margin-bottom: 1rem;
    transition: all 0.3s ease;
  }

  .hero-badge:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  /* Hero content container */
  .hero-content-container {
    display: flex;
    min-height: calc(100vh - 64px);
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 2rem 0;
    max-width: 42rem;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .hero-content-container {
      min-height: auto;
      padding-top: 4rem;
      padding-bottom: 4rem;
    }
  }
`;
document.head.appendChild(styleElement);

/**
 * Function to join class names conditionally
 * @param  {...string} classes - Class names to join
 * @returns {string} - Joined class names
 */
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Initialize the hero section with animations
 */
function initHero() {
  // Ensure the video is properly sized and positioned
  const heroVideo = document.getElementById('hero-video');
  
  if (heroVideo) {
    // Make sure video covers the entire hero section
    const resizeVideo = () => {
      const hero = document.querySelector('.hero');
      if (!hero) return;
      
      const heroWidth = hero.offsetWidth;
      const heroHeight = hero.offsetHeight;
      const videoRatio = 16 / 9; // Assuming 16:9 video
      
      if (heroWidth / heroHeight > videoRatio) {
        // Hero is wider than video aspect ratio
        heroVideo.style.width = '100%';
        heroVideo.style.height = 'auto';
      } else {
        // Hero is taller than video aspect ratio
        heroVideo.style.width = 'auto';
        heroVideo.style.height = '100%';
      }
    };
    
    // Initial resize and add event listener for window resize
    resizeVideo();
    window.addEventListener('resize', resizeVideo);
  }
}

// Export functions for use in other modules
export { initHero };
