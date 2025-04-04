/**
 * Features Modal Functionality
 * Displays a modal with all available features when "View All Features" is clicked
 */

document.addEventListener('DOMContentLoaded', function() {
  // Feature data with titles, descriptions, and tier information
  const features = [
    {
      title: "Wedding Planning Video Tutorials",
      description: "Access our comprehensive library of wedding planning tutorials to guide you through every step of the process.",
      icon: "fa-video",
      tier: "basic"
    },
    {
      title: "Journal Prompts for Reflection",
      description: "Thoughtful prompts to help you document and reflect on your wedding planning journey.",
      icon: "fa-book",
      tier: "basic"
    },
    {
      title: "Address Book",
      description: "Keep track of your guests' contact information and easily manage your invitation list.",
      icon: "fa-address-book",
      tier: "basic"
    },
    {
      title: "Budget Calculator",
      description: "Plan and track your wedding expenses with our intuitive budget management tool.",
      icon: "fa-calculator",
      tier: "basic"
    },
    {
      title: "Vendor Directory",
      description: "Browse our curated list of trusted wedding vendors in your area.",
      icon: "fa-store",
      tier: "basic"
    },
    {
      title: "Planning Timeline Calculator",
      description: "Generate a personalized wedding planning timeline based on your wedding date.",
      icon: "fa-calendar-alt",
      tier: "basic"
    },
    {
      title: "AI Wedding Planner",
      description: "Get personalized recommendations and assistance from our AI-powered wedding planning assistant.",
      icon: "fa-robot",
      tier: "premium"
    },
    {
      title: "Floor Plan & Seating Chart Creator",
      description: "Design your venue layout and create seating arrangements with our drag-and-drop tool.",
      icon: "fa-chair",
      tier: "premium"
    },
    {
      title: "Video Calls with Altare Planner",
      description: "Schedule one-on-one video consultations with our professional wedding planners.",
      icon: "fa-video",
      tier: "premium"
    },
    {
      title: "Quarterly 60-min Calls",
      description: "Regular check-in calls with your dedicated planner to ensure your wedding plans are on track.",
      icon: "fa-phone",
      tier: "premium"
    },
    {
      title: "Moodboard Inspo Creation",
      description: "Create beautiful inspiration boards to visualize and share your wedding aesthetic.",
      icon: "fa-images",
      tier: "professional"
    },
    {
      title: "Day-of Timeline Creation",
      description: "Work with your planner to create a detailed timeline for your wedding day.",
      icon: "fa-clock",
      tier: "professional"
    }
  ];
  
  // Create modal HTML
  function createModal() {
    const modalHTML = `
      <div class="modal-overlay" id="features-modal-overlay">
        <div class="features-modal">
          <div class="modal-header">
            <h2 class="modal-title">All Altare Features</h2>
            <p class="modal-subtitle">Discover all the tools to make your wedding planning journey seamless</p>
            <button class="modal-close" id="modal-close-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="features-grid">
              ${features.map(feature => `
                <div class="feature-item">
                  <h3 class="feature-title">
                    <i class="fas ${feature.icon}"></i>
                    ${feature.title}
                    ${feature.tier === 'premium' ? '<span class="premium-badge">Premium</span>' : ''}
                    ${feature.tier === 'professional' ? '<span class="professional-badge">Pro</span>' : ''}
                  </h3>
                  <p class="feature-description">${feature.description}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Append modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listeners
    document.getElementById('modal-close-btn').addEventListener('click', closeModal);
    document.getElementById('features-modal-overlay').addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal();
      }
    });
  }
  
  // Open modal function
  function openModal() {
    const modal = document.getElementById('features-modal-overlay');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
  }
  
  // Close modal function
  function closeModal() {
    const modal = document.getElementById('features-modal-overlay');
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  }
  
  // Create the modal when page loads
  createModal();
  
  // Find all "View All Features" buttons and attach click event
  const viewAllButtons = document.querySelectorAll('.view-all-features-btn');
  viewAllButtons.forEach(button => {
    button.addEventListener('click', openModal);
  });
});
