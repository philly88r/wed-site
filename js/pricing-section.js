/**
 * Pricing Section Component
 * A vanilla JavaScript implementation of the pricing section
 */

document.addEventListener('DOMContentLoaded', function() {
  // Define the pricing tiers
  const TIERS = [
    {
      id: "basic",
      name: "Basic",
      price: {
        monthly: "Free",
        yearly: "Free",
      },
      description: "Perfect for getting started",
      features: [
        "Wedding Planning Video Tutorials",
        "Address Book",
        "Budget Calculator",
        "Vendor Directory",
        "Planning Timeline Calculator",
      ],
      cta: "Get Started",
    },
    {
      id: "premium",
      name: "Premium",
      price: {
        monthly: 90,
        yearly: 75,
      },
      description: "Great for engaged couples (Minimum 4 months)",
      features: [
        "Everything in Basic",
        "Floor Plan + Seating Chart Creator",
        "Quarterly Video Calls (60 mins)",
        "Assigned Altare Planner",
        "Unlimited Support",
      ],
      cta: "Get Started",
      popular: true,
    },
    {
      id: "day-of-coordination",
      name: "Day-of Coordination",
      price: {
        monthly: 3500,
        yearly: 3500,
      },
      description: "Let us handle the details on your big day",
      features: [
        "Professional Coordination",
        "Vendor Management",
        "Timeline Management",
        "Focus on creating memories",
        "Experienced coordinators",
      ],
      cta: "Learn More",
      link: "day-of-coordination.html",
    },
    {
      id: "professional",
      name: "Professional",
      price: {
        monthly: 120,
        yearly: 100,
      },
      description: "Complete wedding planning (Minimum 4 months)",
      features: [
        "Everything in Premium",
        "Moodboard Inspo Creation",
        "Assigned Month Of Coordinator",
        "8 Weeks Before Wedding Support",
        "Day-of Timeline Creation",
      ],
      cta: "Get Started",
    },
    {
      id: "enterprise",
      name: "Custom",
      price: {
        monthly: "Custom",
        yearly: "Custom",
      },
      description: "For destination weddings",
      features: [
        "Everything in Professional",
        "Destination Wedding Support",
        "Vendor Negotiations",
        "Travel Arrangements",
        "Custom Planning Solutions",
      ],
      cta: "Contact Us",
      highlighted: true,
    },
  ];

  // Define payment frequencies
  const PAYMENT_FREQUENCIES = ["monthly", "yearly"];

  // Initialize the pricing section
  initPricingSection({
    title: "Simple Pricing",
    subtitle: "Choose the best plan for your wedding planning needs",
    tiers: TIERS,
    frequencies: PAYMENT_FREQUENCIES
  });
});

/**
 * Initialize the pricing section
 * @param {Object} config - Configuration for the pricing section
 */
function initPricingSection(config) {
  const { title, subtitle, tiers, frequencies } = config;
  
  // Find the pricing section container
  const pricingSection = document.querySelector('.pricing-section');
  if (!pricingSection) return;
  
  // Create the pricing header
  const pricingHeader = document.createElement('div');
  pricingHeader.className = 'pricing-header';
  
  // Add title and subtitle
  pricingHeader.innerHTML = `
    <h2 class="pricing-title">${title}</h2>
    <p class="pricing-subtitle">${subtitle}</p>
  `;
  
  // Create pricing tabs
  const pricingTabs = document.createElement('div');
  pricingTabs.className = 'pricing-tabs';
  
  // Add tabs for each frequency
  frequencies.forEach((frequency, index) => {
    const tab = document.createElement('div');
    tab.className = `pricing-tab ${index === 0 ? 'active' : ''}`;
    tab.dataset.frequency = frequency;
    tab.textContent = frequency.charAt(0).toUpperCase() + frequency.slice(1);
    
    // Add discount badge for yearly
    if (frequency === 'yearly') {
      const discount = document.createElement('span');
      discount.className = 'pricing-tab-discount';
      discount.textContent = 'Save 20%';
      tab.appendChild(discount);
    }
    
    // Add click event
    tab.addEventListener('click', () => {
      // Update active tab
      document.querySelectorAll('.pricing-tab').forEach(t => {
        t.classList.remove('active');
      });
      tab.classList.add('active');
      
      // Update prices
      updatePrices(frequency);
    });
    
    pricingTabs.appendChild(tab);
  });
  
  pricingHeader.appendChild(pricingTabs);
  pricingSection.appendChild(pricingHeader);
  
  // Create pricing cards container
  const pricingCards = document.createElement('div');
  pricingCards.className = 'pricing-cards';
  
  // Create a card for each tier
  tiers.forEach(tier => {
    const card = createPricingCard(tier, frequencies[0]);
    pricingCards.appendChild(card);
  });
  
  pricingSection.appendChild(pricingCards);
}

/**
 * Create a pricing card
 * @param {Object} tier - The pricing tier
 * @param {string} frequency - The payment frequency
 * @returns {HTMLElement} - The pricing card element
 */
function createPricingCard(tier, frequency) {
  const card = document.createElement('div');
  card.className = `pricing-card ${tier.popular ? 'popular' : ''} ${tier.highlighted ? 'highlighted' : ''}`;
  card.dataset.tierId = tier.id;
  
  // Create card header
  const cardHeader = document.createElement('div');
  cardHeader.className = 'pricing-card-header';
  
  // Add tier name
  const tierName = document.createElement('h3');
  tierName.className = 'pricing-card-name';
  tierName.textContent = tier.name;
  cardHeader.appendChild(tierName);
  
  // Add price
  const priceContainer = document.createElement('div');
  priceContainer.className = 'pricing-card-price-container';
  
  const price = document.createElement('div');
  price.className = 'pricing-card-price';
  
  // Format price based on type
  const priceValue = tier.price[frequency];
  if (typeof priceValue === 'number') {
    price.innerHTML = `$${priceValue}<span class="pricing-card-price-period">/${frequency === 'monthly' ? 'mo' : 'yr'}</span>`;
  } else {
    price.textContent = priceValue;
  }
  
  priceContainer.appendChild(price);
  cardHeader.appendChild(priceContainer);
  
  // Add description
  const description = document.createElement('p');
  description.className = 'pricing-card-description';
  description.textContent = tier.description;
  cardHeader.appendChild(description);
  
  card.appendChild(cardHeader);
  
  // Add features
  const featuresList = document.createElement('ul');
  featuresList.className = 'pricing-card-features';
  
  tier.features.forEach(feature => {
    const featureItem = document.createElement('li');
    featureItem.className = 'pricing-card-feature';
    
    const icon = document.createElement('span');
    icon.className = 'pricing-card-feature-icon';
    icon.innerHTML = '<i class="fas fa-check"></i>';
    
    const text = document.createElement('span');
    text.textContent = feature;
    
    featureItem.appendChild(icon);
    featureItem.appendChild(text);
    featuresList.appendChild(featureItem);
  });
  
  card.appendChild(featuresList);
  
  // Add CTA button
  const cta = document.createElement('a');
  cta.className = 'pricing-card-cta';
  
  // Set the appropriate href based on tier
  if (tier.link) {
    cta.href = tier.link;
  } else if (tier.id === 'enterprise') {
    cta.href = 'contact.html';
  } else {
    cta.href = 'signup.html';
  }
  
  cta.textContent = tier.cta;
  
  card.appendChild(cta);
  
  return card;
}

/**
 * Update prices based on selected frequency
 * @param {string} frequency - The selected payment frequency
 */
function updatePrices(frequency) {
  const cards = document.querySelectorAll('.pricing-card');
  
  cards.forEach(card => {
    const tierId = card.dataset.tierId;
    const tier = TIERS.find(t => t.id === tierId);
    
    if (!tier) return;
    
    const priceElement = card.querySelector('.pricing-card-price');
    const priceValue = tier.price[frequency];
    
    if (typeof priceValue === 'number') {
      priceElement.innerHTML = `$${priceValue}<span class="pricing-card-price-period">/${frequency === 'monthly' ? 'mo' : 'yr'}</span>`;
    } else {
      priceElement.textContent = priceValue;
    }
  });
}
