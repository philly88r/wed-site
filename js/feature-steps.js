// Feature Steps Component
document.addEventListener('DOMContentLoaded', function() {
  const featureStepsContainer = document.querySelector('.feature-steps-section');
  if (!featureStepsContainer) return;

  // Feature data
  const features = [
    {
      title: "Our Curated Vendor Directory",
      price: "$49",
      content: "Learn more about our recommended vendors, local to NYC and the tri-state area.",
      image: "img/1.png"
    },
    {
      title: "Moodboard Generator",
      price: "$59",
      content: "You add the photos, answer questions, choose the colors, link your Pinterest board, and let our generator do the heavy lifting!",
      image: "img/2.png"
    },
    {
      title: "Hire Our Event Managers For Your Big Day",
      price: "$4,500",
      content: "Hire our professional wedding planners up to 6 weeks out from your special day so everything runs seamlessly (without the unnecessary headaches).",
      image: "img/3.png"
    }
  ];

  let currentFeature = 0;
  let progress = 0;
  const autoPlayInterval = 3000; // 3 seconds per feature
  let timer;

  // Initialize the component
  function initFeatureSteps() {
    renderFeatureSteps();
    startAutoplay();

    // Add event listeners for manual navigation
    document.querySelectorAll('.feature-step').forEach((step, index) => {
      step.addEventListener('click', () => {
        currentFeature = index;
        updateActiveFeature();
        resetProgress();
      });
    });
  }

  // Render the feature steps HTML
  function renderFeatureSteps() {
    const featureStepsList = featureStepsContainer.querySelector('.feature-steps-list');
    const featureStepsImageContainer = featureStepsContainer.querySelector('.feature-steps-image-container');

    // Render feature steps list
    let stepsHTML = '';
    features.forEach((feature, index) => {
      stepsHTML += `
        <div class="feature-step ${index === currentFeature ? 'active' : ''}" data-index="${index}">
          <div class="feature-step-indicator">
            ${index <= currentFeature ? '<span>✓</span>' : `<span>${index + 1}</span>`}
          </div>
          <div class="feature-step-content">
            <h3 class="feature-step-title">${feature.title}</h3>
            <p class="feature-step-price">${feature.price}</p>
            <p class="feature-step-description">${feature.content}</p>
          </div>
        </div>
      `;
    });
    featureStepsList.innerHTML = stepsHTML;

    // Render feature images
    let imagesHTML = '';
    features.forEach((feature, index) => {
      imagesHTML += `
        <div class="feature-step-image ${index === currentFeature ? 'active' : ''}" data-index="${index}">
          <img src="${feature.image}" alt="${feature.title}">
          <div class="image-gradient-overlay"></div>
        </div>
      `;
    });
    featureStepsImageContainer.innerHTML = imagesHTML;
  }

  // Update the active feature
  function updateActiveFeature() {
    // Update feature steps
    document.querySelectorAll('.feature-step').forEach((step, index) => {
      if (index === currentFeature) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
      
      // Update step indicators
      const indicator = step.querySelector('.feature-step-indicator');
      if (index <= currentFeature) {
        indicator.innerHTML = '<span>✓</span>';
      } else {
        indicator.innerHTML = `<span>${index + 1}</span>`;
      }
    });

    // Update feature images
    document.querySelectorAll('.feature-step-image').forEach((image, index) => {
      if (index === currentFeature) {
        image.classList.add('active');
      } else {
        image.classList.remove('active');
      }
    });
  }

  // Start autoplay
  function startAutoplay() {
    timer = setInterval(() => {
      if (progress < 100) {
        progress += 100 / (autoPlayInterval / 100);
        updateProgressBar();
      } else {
        nextFeature();
        resetProgress();
      }
    }, 100);
  }

  // Stop autoplay
  function stopAutoplay() {
    clearInterval(timer);
  }

  // Reset progress
  function resetProgress() {
    progress = 0;
    updateProgressBar();
  }

  // Update progress bar
  function updateProgressBar() {
    const progressBar = featureStepsContainer.querySelector('.feature-steps-progress-bar');
    progressBar.style.width = `${progress}%`;
  }

  // Go to next feature
  function nextFeature() {
    currentFeature = (currentFeature + 1) % features.length;
    updateActiveFeature();
  }

  // Initialize
  initFeatureSteps();

  // Pause autoplay on hover
  featureStepsContainer.addEventListener('mouseenter', stopAutoplay);
  featureStepsContainer.addEventListener('mouseleave', startAutoplay);
});
