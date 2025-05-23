// Scrolling Quotes Functionality
document.addEventListener('DOMContentLoaded', function() {
  console.log('Scrolling quotes script loaded');
  const quoteCarousel = document.querySelector('.quotes-carousel');
  if (!quoteCarousel) {
    console.error('Quote carousel not found');
    return;
  }
  
  console.log('Quote carousel found');
  const slides = quoteCarousel.querySelectorAll('.quote-slide');
  console.log('Found ' + slides.length + ' slides');
  
  const indicators = quoteCarousel.querySelectorAll('.quote-indicator');
  console.log('Found ' + indicators.length + ' indicators');
  
  let currentIndex = 0;
  let interval;
  
  // Initialize the carousel
  function initCarousel() {
    if (slides.length === 0) {
      console.error('No slides found');
      return;
    }
    
    // Make sure first slide is visible and active
    slides.forEach(slide => {
      slide.classList.remove('active');
      slide.style.display = 'none';
    });
    
    slides[0].classList.add('active');
    slides[0].style.display = 'block';
    
    if (indicators.length > 0) {
      indicators.forEach(ind => ind.classList.remove('active'));
      indicators[0].classList.add('active');
    }
    
    // Start auto-rotation
    startAutoRotation();
    
    // Add click events to indicators
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        console.log('Indicator clicked: ' + index);
        goToSlide(index);
        resetAutoRotation();
      });
    });
    
    // Pause rotation on hover
    quoteCarousel.addEventListener('mouseenter', stopAutoRotation);
    quoteCarousel.addEventListener('mouseleave', startAutoRotation);
  }
  
  // Go to a specific slide
  function goToSlide(index) {
    // Remove active class from all slides and indicators
    slides.forEach(slide => {
      slide.classList.remove('active');
      slide.style.display = 'none';
    });
    
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Add active class to current slide and indicator
    currentIndex = index;
    slides[currentIndex].classList.add('active');
    slides[currentIndex].style.display = 'block';
    
    if (indicators.length > 0) {
      indicators[currentIndex].classList.add('active');
    }
  }
  
  // Move to the next slide
  function nextSlide() {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= slides.length) {
      nextIndex = 0;
    }
    goToSlide(nextIndex);
  }
  
  // Start auto-rotation
  function startAutoRotation() {
    interval = setInterval(nextSlide, 6000); // Change slide every 6 seconds
  }
  
  // Stop auto-rotation
  function stopAutoRotation() {
    clearInterval(interval);
  }
  
  // Reset auto-rotation (after user interaction)
  function resetAutoRotation() {
    stopAutoRotation();
    startAutoRotation();
  }
  
  // Initialize the carousel
  initCarousel();
  console.log('Carousel initialized');
});
