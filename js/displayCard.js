/**
 * Display Card Component for Altare
 * 
 * This component creates stylized cards for the planning tools section
 * following the Altare brand guidelines
 */

// Create and append the necessary styles
const styleElement = document.createElement('style');
styleElement.textContent = `
  .display-card {
    position: relative;
    display: flex;
    height: 14rem;
    width: 32rem;
    transform: skew(0, -8deg);
    user-select: none;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 1rem;
    border: 3px solid rgba(150, 176, 215, 0.3);
    background-color: rgba(251, 251, 247, 0.7);
    backdrop-filter: blur(8px);
    padding: 2rem 2.5rem;
    transition: all 0.7s ease;
    box-shadow: 0 10px 30px rgba(10, 70, 151, 0.1);
  }

  .display-card::after {
    content: '';
    position: absolute;
    top: -5%;
    right: -1px;
    height: 110%;
    width: 28rem;
    background: linear-gradient(to left, var(--blanc), transparent);
  }

  .display-card:hover {
    border-color: rgba(255, 255, 255, 0.2);
    background-color: rgba(251, 251, 247, 0.8);
    box-shadow: 0 15px 40px rgba(10, 70, 151, 0.2);
    transform: skew(0, -8deg) translateY(-10px);
  }

  .display-card > div {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .icon-container {
    position: relative;
    display: inline-block;
    border-radius: 9999px;
    background-color: var(--bolden);
    padding: 0.75rem;
  }

  .card-title {
    font-size: 1.75rem;
    font-weight: 500;
  }

  .card-description {
    white-space: nowrap;
    font-size: 1.5rem;
    margin: 1rem 0;
  }

  .card-date {
    color: rgba(10, 70, 151, 0.6);
    font-size: 1.1rem;
  }

  /* Stack layout */
  .card-stack {
    display: grid;
    grid-template-areas: 'stack';
    place-items: center;
    opacity: 1;
    animation: fadeIn 0.7s ease-in-out;
    height: 600px;
  }

  .stack-card-1 {
    grid-area: stack;
    transition: transform 0.7s ease;
  }
  
  .stack-card-1:hover {
    transform: translateY(-15px);
  }

  .stack-card-2 {
    grid-area: stack;
    transform: translate(6rem, 4rem);
    transition: transform 0.7s ease;
  }
  
  .stack-card-2:hover {
    transform: translate(6rem, 0);
  }

  .stack-card-3 {
    grid-area: stack;
    transform: translate(12rem, 8rem);
    transition: transform 0.7s ease;
  }
  
  .stack-card-3:hover {
    transform: translate(12rem, 4rem);
  }

  .grayscale {
    filter: grayscale(100%);
    transition: filter 0.7s ease;
  }

  .grayscale:hover {
    filter: grayscale(0%);
  }

  .card-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 1rem;
    outline: 1px solid rgba(150, 176, 215, 0.3);
    background-blend-mode: overlay;
    background-color: rgba(251, 251, 247, 0.5);
    left: 0;
    top: 0;
    transition: opacity 0.7s ease;
  }

  .display-card:hover .card-overlay {
    opacity: 0;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @media (max-width: 768px) {
    .display-card {
      width: 24rem;
      height: 12rem;
      padding: 1.5rem 2rem;
    }
    
    .card-title {
      font-size: 1.5rem;
    }
    
    .card-description {
      font-size: 1.25rem;
    }
    
    .stack-card-2 {
      transform: translate(4rem, 3rem);
    }
    
    .stack-card-2:hover {
      transform: translate(4rem, 0);
    }
    
    .stack-card-3 {
      transform: translate(8rem, 6rem);
    }
    
    .stack-card-3:hover {
      transform: translate(8rem, 3rem);
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
 * Creates a display card element
 * @param {Object} props - Card properties
 * @returns {HTMLElement} - The card element
 */
function createDisplayCard({
  className = '',
  iconClass = 'fas fa-tasks',
  iconColor = 'text-white',
  title = 'Featured',
  description = 'Discover amazing content',
  date = 'Just now',
  titleColor = 'altare-text-primary'
}) {
  const card = document.createElement('div');
  card.className = cn('display-card', className);
  
  // Create card overlay for grayscale effect if needed
  if (className.includes('grayscale')) {
    const overlay = document.createElement('div');
    overlay.className = 'card-overlay';
    card.appendChild(overlay);
  }
  
  // Icon and title container
  const headerDiv = document.createElement('div');
  
  const iconContainer = document.createElement('span');
  iconContainer.className = 'icon-container';
  
  const icon = document.createElement('i');
  icon.className = cn(iconClass, iconColor);
  icon.style.fontSize = '1.5rem';
  
  const titleElem = document.createElement('p');
  titleElem.className = cn('card-title subheading', titleColor);
  titleElem.textContent = title;
  
  iconContainer.appendChild(icon);
  headerDiv.appendChild(iconContainer);
  headerDiv.appendChild(titleElem);
  
  // Description
  const descriptionElem = document.createElement('p');
  descriptionElem.className = 'card-description body-text';
  descriptionElem.textContent = description;
  
  // Date
  const dateElem = document.createElement('p');
  dateElem.className = 'card-date';
  dateElem.textContent = date;
  
  // Append all elements to card
  card.appendChild(headerDiv);
  card.appendChild(descriptionElem);
  card.appendChild(dateElem);
  
  return card;
}

/**
 * Creates a stack of display cards
 * @param {Array} cards - Array of card properties
 * @returns {HTMLElement} - The card stack container
 */
function createDisplayCards(cards) {
  const defaultCards = [
    {
      className: 'stack-card-1 grayscale',
      iconClass: 'fas fa-tasks',
      title: 'Task Manager',
      description: 'Keep track of all your wedding tasks',
      date: 'Updated daily'
    },
    {
      className: 'stack-card-2 grayscale',
      iconClass: 'fas fa-users',
      title: 'Guest List',
      description: 'Manage your guest list and RSVPs',
      date: 'Last updated 2 days ago'
    },
    {
      className: 'stack-card-3',
      iconClass: 'fas fa-calendar-alt',
      title: 'Timeline',
      description: 'Create a detailed wedding timeline',
      date: 'Last updated 5 days ago'
    }
  ];
  
  const displayCards = cards || defaultCards;
  
  const container = document.createElement('div');
  container.className = 'card-stack';
  
  displayCards.forEach(cardProps => {
    const card = createDisplayCard(cardProps);
    container.appendChild(card);
  });
  
  return container;
}

/**
 * Initialize display cards in the specified container
 * @param {string} containerId - ID of the container element
 * @param {Array} cards - Array of card properties (optional)
 */
function initDisplayCards(containerId, cards) {
  const container = document.getElementById(containerId);
  if (container) {
    const cardStack = createDisplayCards(cards);
    container.appendChild(cardStack);
  }
}

// Export functions for use in other modules
export { initDisplayCards };
