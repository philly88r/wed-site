// Animation utilities for the elegant hero section

// Helper function to create animation with easing
function animate(element, keyframes, options) {
  return element.animate(keyframes, options);
}

// Create elegant shapes with animations
function createElegantShape(container, {
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "rgba(255, 255, 255, 0.08)",
  className = "",
  position = { left: "10%", top: "20%" }
}) {
  const shapeContainer = document.createElement('div');
  shapeContainer.className = `elegant-shape ${className}`;
  Object.assign(shapeContainer.style, {
    position: 'absolute',
    opacity: '0',
    transform: `translateY(-150px) rotate(${rotate - 15}deg)`,
    ...position
  });

  const shapeInner = document.createElement('div');
  shapeInner.className = 'elegant-shape-inner';
  Object.assign(shapeInner.style, {
    width: `${width}px`,
    height: `${height}px`,
    position: 'relative'
  });

  const shapeElement = document.createElement('div');
  shapeElement.className = 'elegant-shape-element';
  Object.assign(shapeElement.style, {
    position: 'absolute',
    inset: '0',
    borderRadius: '9999px',
    background: `linear-gradient(to right, ${gradient}, transparent)`,
    backdropFilter: 'blur(2px)',
    border: '2px solid rgba(255, 255, 255, 0.15)',
    boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.1)'
  });

  // Add the after pseudo-element effect
  const afterElement = document.createElement('div');
  afterElement.className = 'elegant-shape-after';
  Object.assign(afterElement.style, {
    position: 'absolute',
    inset: '0',
    borderRadius: '9999px',
    background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.2), transparent 70%)'
  });

  shapeElement.appendChild(afterElement);
  shapeInner.appendChild(shapeElement);
  shapeContainer.appendChild(shapeInner);
  container.appendChild(shapeContainer);

  // Initial animation
  setTimeout(() => {
    shapeContainer.style.transition = 'opacity 1.2s, transform 2.4s cubic-bezier(0.23, 0.86, 0.39, 0.96)';
    shapeContainer.style.opacity = '1';
    shapeContainer.style.transform = `translateY(0) rotate(${rotate}deg)`;

    // Floating animation
    setInterval(() => {
      shapeInner.style.transition = 'transform 12s ease-in-out';
      shapeInner.style.transform = 'translateY(15px)';
      
      setTimeout(() => {
        shapeInner.style.transform = 'translateY(0)';
      }, 6000);
    }, 12000);
    
    // Start the initial floating animation
    shapeInner.style.transition = 'transform 12s ease-in-out';
    shapeInner.style.transform = 'translateY(15px)';
    
    setTimeout(() => {
      shapeInner.style.transform = 'translateY(0)';
    }, 6000);
    
  }, delay * 1000);

  return shapeContainer;
}

// Create fade-up animation for text elements
function createFadeUpAnimation(element, delay = 0) {
  element.style.opacity = '0';
  element.style.transform = 'translateY(30px)';
  element.style.transition = `opacity 1s ease, transform 1s cubic-bezier(0.25, 0.4, 0.25, 1)`;
  element.style.transitionDelay = `${0.5 + delay * 0.2}s`;
  
  setTimeout(() => {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }, 100); // Small delay to ensure the transition works
}

// Initialize the hero animations
function initHeroAnimations() {
  const heroSection = document.getElementById('home');
  if (!heroSection) return;
  
  const shapesContainer = document.querySelector('.elegant-shapes-container');
  if (!shapesContainer) return;
  
  // Create elegant shapes
  createElegantShape(shapesContainer, {
    delay: 0.3,
    width: 600,
    height: 140,
    rotate: 12,
    gradient: "rgba(99, 102, 241, 0.15)",
    position: { left: '-10%', top: '15%' }
  });
  
  createElegantShape(shapesContainer, {
    delay: 0.5,
    width: 500,
    height: 120,
    rotate: -15,
    gradient: "rgba(244, 63, 94, 0.15)",
    position: { right: '-5%', top: '70%' }
  });
  
  createElegantShape(shapesContainer, {
    delay: 0.4,
    width: 300,
    height: 80,
    rotate: -8,
    gradient: "rgba(139, 92, 246, 0.15)",
    position: { left: '5%', bottom: '5%' }
  });
  
  createElegantShape(shapesContainer, {
    delay: 0.6,
    width: 200,
    height: 60,
    rotate: 20,
    gradient: "rgba(245, 158, 11, 0.15)",
    position: { right: '15%', top: '10%' }
  });
  
  createElegantShape(shapesContainer, {
    delay: 0.7,
    width: 150,
    height: 40,
    rotate: -25,
    gradient: "rgba(6, 182, 212, 0.15)",
    position: { left: '20%', top: '5%' }
  });
  
  // Animate text elements
  const badge = document.querySelector('.hero-badge');
  const title = document.querySelector('.hero-title');
  const subtitle = document.querySelector('.hero-subtitle');
  
  if (badge) createFadeUpAnimation(badge, 0);
  if (title) createFadeUpAnimation(title, 1);
  if (subtitle) createFadeUpAnimation(subtitle, 2);
}

// Run animations when DOM is loaded
document.addEventListener('DOMContentLoaded', initHeroAnimations);
