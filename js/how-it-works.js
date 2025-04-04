/**
 * How It Works Animation
 * Handles the animation and interaction for the How It Works section
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize the animation when the DOM is loaded
  initHowItWorksAnimation();
  
  // Add scroll event listener to trigger animations when scrolling
  window.addEventListener('scroll', function() {
    animateOnScroll();
  });
});

/**
 * Initialize the How It Works animation
 */
function initHowItWorksAnimation() {
  // Get all timeline steps
  const steps = document.querySelectorAll('.timeline-step');
  
  // Set initial delay for staggered animation
  let delay = 0;
  
  // Add animation delay to each step
  steps.forEach((step, index) => {
    step.style.transitionDelay = `${delay}s`;
    delay += 0.2; // Increment delay for each step
  });
  
  // Trigger initial animation if section is already in viewport
  animateOnScroll();
}

/**
 * Animate elements when they come into view while scrolling
 */
function animateOnScroll() {
  // Get the How It Works section
  const section = document.querySelector('.how-it-works');
  if (!section) return;
  
  // Get all timeline steps
  const steps = document.querySelectorAll('.timeline-step');
  
  // Check if section is in viewport
  if (isInViewport(section)) {
    // Add visible class to each step with a delay
    steps.forEach((step) => {
      step.classList.add('visible');
    });
  }
}

/**
 * Check if an element is in the viewport
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} - Whether the element is in the viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
    rect.bottom >= 0
  );
}

/**
 * Handle step hover interactions
 * @param {Event} event - The mouse event
 */
function handleStepHover(event) {
  const step = event.currentTarget;
  const number = step.querySelector('.step-number');
  
  // Add hover effect
  if (event.type === 'mouseenter') {
    number.style.transform = 'scale(1.1)';
  } else {
    number.style.transform = 'scale(1)';
  }
}

// Add event listeners to steps after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const steps = document.querySelectorAll('.timeline-step');
  
  steps.forEach(step => {
    step.addEventListener('mouseenter', handleStepHover);
    step.addEventListener('mouseleave', handleStepHover);
  });
});
