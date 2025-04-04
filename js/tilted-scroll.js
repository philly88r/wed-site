/**
 * TiltedScroll Component
 * A vanilla JavaScript implementation of a tilted scroll component
 */

class TiltedScroll {
  constructor(container, items, options = {}) {
    this.container = container;
    this.items = items;
    this.currentIndex = 0;
    this.autoRotate = options.autoRotate !== undefined ? options.autoRotate : true;
    this.rotationInterval = options.rotationInterval || 5000; // Default 5 seconds
    this.autoRotateTimer = null;
    this.isPaused = false;
    this.init();
  }

  init() {
    // Create the main container
    this.scrollContainer = document.createElement('div');
    this.scrollContainer.className = 'tilted-scroll-container';
    
    // Create the card stack
    this.cardStack = document.createElement('div');
    this.cardStack.className = 'tilted-card-stack';
    
    // Create cards for each item
    this.items.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = `tilted-card tilted-card-${index + 1}`;
      card.dataset.id = item.id;
      
      const overlay = document.createElement('div');
      overlay.className = 'tilted-card-overlay';
      card.appendChild(overlay);
      
      const content = document.createElement('div');
      content.className = 'tilted-card-content';
      
      // Add icon if available
      if (item.icon) {
        const iconContainer = document.createElement('span');
        iconContainer.className = 'tilted-icon-container';
        const icon = document.createElement('i');
        icon.className = item.icon;
        iconContainer.appendChild(icon);
        content.appendChild(iconContainer);
      }
      
      const titleContainer = document.createElement('div');
      titleContainer.className = 'tilted-title-container';
      
      const title = document.createElement('h3');
      title.className = 'tilted-card-title';
      title.textContent = item.text;
      titleContainer.appendChild(title);
      
      content.appendChild(titleContainer);
      
      if (item.description) {
        const description = document.createElement('p');
        description.className = 'tilted-card-description';
        description.textContent = item.description;
        content.appendChild(description);
      }
      
      card.appendChild(content);
      this.cardStack.appendChild(card);
      
      // Add hover event listeners to pause auto-rotation
      card.addEventListener('mouseenter', () => this.pauseAutoRotate());
      card.addEventListener('mouseleave', () => this.resumeAutoRotate());
    });
    
    // Add navigation controls
    const navControls = document.createElement('div');
    navControls.className = 'tilted-nav-controls';
    
    const prevButton = document.createElement('button');
    prevButton.className = 'tilted-nav-button prev';
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevButton.addEventListener('click', () => {
      this.prevCard();
      this.pauseAutoRotate(true); // Pause for longer when manually navigating
      setTimeout(() => this.resumeAutoRotate(), 10000); // Resume after 10 seconds
    });
    
    const nextButton = document.createElement('button');
    nextButton.className = 'tilted-nav-button next';
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextButton.addEventListener('click', () => {
      this.nextCard();
      this.pauseAutoRotate(true); // Pause for longer when manually navigating
      setTimeout(() => this.resumeAutoRotate(), 10000); // Resume after 10 seconds
    });
    
    // Add play/pause button
    const playPauseButton = document.createElement('button');
    playPauseButton.className = 'tilted-nav-button play-pause';
    playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
    playPauseButton.addEventListener('click', () => {
      if (this.isPaused) {
        this.resumeAutoRotate();
        playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
      } else {
        this.pauseAutoRotate(true);
        playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
      }
    });
    
    navControls.appendChild(prevButton);
    navControls.appendChild(playPauseButton);
    navControls.appendChild(nextButton);
    
    // Assemble the component
    this.scrollContainer.appendChild(this.cardStack);
    this.scrollContainer.appendChild(navControls);
    this.container.appendChild(this.scrollContainer);
    
    // Initialize the first card as active
    this.updateActiveCard();
    
    // Start auto-rotation if enabled
    if (this.autoRotate) {
      this.startAutoRotate();
    }
    
    // Add event listeners to pause rotation when the user interacts with the component
    this.scrollContainer.addEventListener('mouseenter', () => this.pauseAutoRotate());
    this.scrollContainer.addEventListener('mouseleave', () => this.resumeAutoRotate());
    
    // Add touch event listeners for mobile
    this.scrollContainer.addEventListener('touchstart', () => this.pauseAutoRotate());
    this.scrollContainer.addEventListener('touchend', () => this.resumeAutoRotate());
  }
  
  updateActiveCard() {
    const cards = this.cardStack.querySelectorAll('.tilted-card');
    cards.forEach((card, index) => {
      card.classList.remove('active', 'prev', 'next');
      
      if (index === this.currentIndex) {
        card.classList.add('active');
      } else if (index === this.currentIndex - 1 || 
                (this.currentIndex === 0 && index === cards.length - 1)) {
        card.classList.add('prev');
      } else if (index === this.currentIndex + 1 || 
                (this.currentIndex === cards.length - 1 && index === 0)) {
        card.classList.add('next');
      }
    });
  }
  
  nextCard() {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.updateActiveCard();
  }
  
  prevCard() {
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.updateActiveCard();
  }
  
  startAutoRotate() {
    if (this.autoRotateTimer) {
      clearInterval(this.autoRotateTimer);
    }
    
    this.autoRotateTimer = setInterval(() => {
      if (!this.isPaused) {
        this.nextCard();
      }
    }, this.rotationInterval);
  }
  
  pauseAutoRotate(manual = false) {
    this.isPaused = true;
    
    // If not manually paused, we'll resume after a short delay
    if (!manual) {
      if (this.resumeTimer) {
        clearTimeout(this.resumeTimer);
      }
      
      this.resumeTimer = setTimeout(() => {
        this.isPaused = false;
      }, 2000); // Resume after 2 seconds of inactivity
    }
  }
  
  resumeAutoRotate() {
    if (this.resumeTimer) {
      clearTimeout(this.resumeTimer);
    }
    
    this.isPaused = false;
    
    // Restart the interval if it's not running
    if (!this.autoRotateTimer) {
      this.startAutoRotate();
    }
  }
  
  // Clean up method to remove intervals when component is destroyed
  destroy() {
    if (this.autoRotateTimer) {
      clearInterval(this.autoRotateTimer);
    }
    
    if (this.resumeTimer) {
      clearTimeout(this.resumeTimer);
    }
  }
}

// Initialize the component when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Define the items for the planning tools
  const planningItems = [
    { 
      id: "1", 
      text: "Task Manager", 
      description: "Organize and track all your wedding planning tasks",
      icon: "fas fa-tasks",
      color: "primary"
    },
    { 
      id: "2", 
      text: "Guest List", 
      description: "Manage RSVPs, seating arrangements, and dietary preferences",
      icon: "fas fa-users",
      color: "accent-blush"
    },
    { 
      id: "3", 
      text: "Timeline", 
      description: "Create a detailed schedule for your perfect wedding day",
      icon: "fas fa-calendar-alt",
      color: "accent-nude"
    },
    { 
      id: "4", 
      text: "Budget Tracker", 
      description: "Keep your wedding finances under control",
      icon: "fas fa-dollar-sign",
      color: "primary-light"
    },
    { 
      id: "5", 
      text: "Vendor Management", 
      description: "Find and book the perfect vendors for your wedding",
      icon: "fas fa-store",
      color: "accent-pia"
    },
    { 
      id: "6", 
      text: "Web Automation", 
      description: "Automate repetitive wedding planning tasks",
      icon: "fas fa-robot",
      color: "accent-nude"
    }
  ];
  
  // Find the planning section container
  const planningSection = document.querySelector('.planning-section .container');
  
  if (planningSection) {
    // Clear existing content in the planning section
    const planningCards = planningSection.querySelector('.planning-cards');
    if (planningCards) {
      planningCards.innerHTML = '';
      
      // Initialize the TiltedScroll component with auto-rotation
      new TiltedScroll(planningCards, planningItems, {
        autoRotate: true,
        rotationInterval: 3000 // Rotate every 3 seconds (faster)
      });
    }
  }
});
