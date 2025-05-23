// Animated Testimonials Component - Complete rewrite
document.addEventListener('DOMContentLoaded', function() {
    const testimonialContainer = document.querySelector('.animated-testimonials');
    if (!testimonialContainer) return;
    
    // Using the new image files from Downloads folder with Calendly links
    const testimonials = [
        {
            name: "Christina Thavis",
            designation: "Day Of Coordinator",
            quote: "Christina has been bringing timelines and floor plans to life for over 5 years. She's a pro at keeping the day running smoothly while making sure everyone is having the time of their lives. Her background in hospitality means she knows how to handle any situation with grace and efficiency.",
            src: "images/coordinators/christinathavis.png",
            calendlyLink: "https://calendly.com/christina-altare"
        },
        {
            name: "Ani Grigorian",
            designation: "Day Of Coordinator",
            quote: "Ani has been coordinating weddings for 3 years and loves helping couples create their dream day. Her attention to detail and calm demeanor make her a favorite among couples and vendors alike. She's especially skilled at managing complex family dynamics with ease.",
            src: "images/coordinators/ANIch.png",
            calendlyLink: "https://calendly.com/ani-altare"
        },
        {
            name: "Krista Jakubiak",
            designation: "Day Of Coordinator",
            quote: "Krista Jakubiak is a Planner, problem-solver, and party-starter! She has planned everything from luxury destination weddings in Greece and Mexico to corporate galas high above NYC at One World Observatory. Serving clients across NY, NJ, and CT, Krista ensures every wedding runs seamlessly.\n\nWhen not planning weddings, Krista loves exploring Long Island or relaxing in the park with her Aussie Shepherd and Corgi. A passionate musician, she founded an A cappella group at FIT, competed at the ICCAs (real-life Pitch Perfect!), and hosts an annual live Christmas carol event with family.",
            src: "images/coordinators/KRISTA (1).png",
            calendlyLink: "https://calendly.com/krista-altare"
        }
    ];
    
    let activeIndex = 0;
    let autoplayTimer;
    
    // Create the HTML structure directly
    function renderTestimonials() {
        const html = `
            <div class="testimonial-carousel-container">
                <div class="testimonial-image-section">
                    <div class="testimonial-image-container">
                        ${testimonials.map((testimonial, index) => {
                            let additionalClass = '';
                            if (testimonial.name === "Ani Grigorian") {
                                additionalClass = ' ani-image-adjustment';
                            }
                            return `
                            <div class="testimonial-image-wrapper ${index === activeIndex ? 'active' : ''}${additionalClass}" data-index="${index}">
                                <img src="${testimonial.src}" alt="${testimonial.name}" class="testimonial-image">
                            </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                <div class="testimonial-content-section">
                    <h3 class="testimonial-name">${testimonials[activeIndex].name}</h3>
                    <p class="testimonial-designation">${testimonials[activeIndex].designation}</p>
                    <p class="testimonial-quote">${testimonials[activeIndex].quote}</p>
                    <a href="${testimonials[activeIndex].calendlyLink}" target="_blank" class="testimonial-schedule-button">Schedule</a>
                    <div class="testimonial-nav">
                        <button class="testimonial-nav-button prev">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        </button>
                        <button class="testimonial-nav-button next">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        testimonialContainer.innerHTML = html;
        
        // Apply initial fan effect
        applyFanEffect();
        
        // Add event listeners
        testimonialContainer.querySelector('.prev').addEventListener('click', handlePrev);
        testimonialContainer.querySelector('.next').addEventListener('click', handleNext);
    }
    
    // Apply fan effect to images
    function applyFanEffect() {
        const imageWrappers = testimonialContainer.querySelectorAll('.testimonial-image-wrapper');
        
        imageWrappers.forEach((wrapper, index) => {
            const position = (index - activeIndex + testimonials.length) % testimonials.length;
            
            if (index === activeIndex) {
                wrapper.style.transform = 'scale(1) rotate(0deg) translateX(0)';
                wrapper.style.zIndex = '10';
                wrapper.style.opacity = '1';
                wrapper.classList.add('active');
            } else if (position === 1) {
                wrapper.style.transform = 'scale(0.93) rotate(15deg) translateX(30px)';
                wrapper.style.zIndex = '2';
                wrapper.style.opacity = '0.7';
                wrapper.classList.remove('active');
            } else if (position === 2) {
                wrapper.style.transform = 'scale(0.88) rotate(25deg) translateX(50px)';
                wrapper.style.zIndex = '1';
                wrapper.style.opacity = '0.5';
                wrapper.classList.remove('active');
            } else {
                wrapper.style.transform = 'scale(0.93) rotate(-15deg) translateX(-30px)';
                wrapper.style.zIndex = '2';
                wrapper.style.opacity = '0.7';
                wrapper.classList.remove('active');
            }
        });
    }
    
    // Handle navigation
    function handleNext() {
        activeIndex = (activeIndex + 1) % testimonials.length;
        updateTestimonial();
    }
    
    function handlePrev() {
        activeIndex = (activeIndex - 1 + testimonials.length) % testimonials.length;
        updateTestimonial();
    }
    
    // Update testimonial content and images
    function updateTestimonial() {
        // Update content with animation
        const nameElement = testimonialContainer.querySelector('.testimonial-name');
        const designationElement = testimonialContainer.querySelector('.testimonial-designation');
        const quoteElement = testimonialContainer.querySelector('.testimonial-quote');
        const scheduleButton = testimonialContainer.querySelector('.testimonial-schedule-button');
        
        // Fade out content
        nameElement.style.opacity = '0';
        designationElement.style.opacity = '0';
        quoteElement.style.opacity = '0';
        scheduleButton.style.opacity = '0';
        
        // Apply fan effect to images
        applyFanEffect();
        
        // Update content after fade out
        setTimeout(() => {
            nameElement.textContent = testimonials[activeIndex].name;
            designationElement.textContent = testimonials[activeIndex].designation;
            quoteElement.textContent = testimonials[activeIndex].quote;
            scheduleButton.href = testimonials[activeIndex].calendlyLink;
            
            // Fade in content
            nameElement.style.opacity = '1';
            designationElement.style.opacity = '1';
            quoteElement.style.opacity = '1';
            scheduleButton.style.opacity = '1';
        }, 300);
    }
    
    // Autoplay functionality
    function startAutoplay() {
        autoplayTimer = setInterval(handleNext, 5000);
    }
    
    function stopAutoplay() {
        clearInterval(autoplayTimer);
    }
    
    // Initialize
    renderTestimonials();
    startAutoplay();
    
    // Pause autoplay on hover
    testimonialContainer.addEventListener('mouseenter', stopAutoplay);
    testimonialContainer.addEventListener('mouseleave', startAutoplay);
});
