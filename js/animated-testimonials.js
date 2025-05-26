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
            name: "Nicole Risby",
            designation: "Day Of Coordinator",
            quote: "Based in New York, Nicole officially launched her wedding and event planning career in 2016. From the very beginning, she fell in love with the process, recognizing that it takes a dedicated team to orchestrate life's most memorable moments flawlessly. With a passion for creativity, a keen eye for detail, and an unwavering commitment to her craft, Nicole ensures that every event is seamless and stress-free.\n\nOn-site, she brings a calming presence and a welcoming energy, allowing you to relax and fully enjoy your celebration. With Nicole at the helm, all you have to do is show up and party!",
            src: "images/coordinators/nicolerisby.jpeg",
            calendlyLink: "https://calendly.com/nicole-altare"
        },
        {
            name: "Amberlyn Wemmer",
            designation: "Day Of Coordinator",
            quote: "Amberlyn is the Swiss army knife of ALTARE honing her skills in hospitality, art, and beyond. It all began in design in the catering world in 2012 that sharpened her eye for detail and creating experiences. From there, her friends saw something she didn't and each asked her to run their weddings. The rest is history, and her love for a good timeline began.\n\nAmberlyn believes in keeping the process stress free and fun, but not to worry she will be a step ahead making sure the day is seamless. She loves bringing a couple's dream come to life- ain't no mountain high enough! She approaches every detail with an empathetic, strategic and creative touch but watch out you might become best friends! She is usually to be found in a dance class if not at work, and her only weakness is that she can't say \"no\" to her cat Stanley.",
            src: "images/coordinators/amberlywemmer.jpeg",
            calendlyLink: "https://calendly.com/amberlyn-altare"
        },
        {
            name: "Krista Jakubiak",
            designation: "Day Of Coordinator",
            quote: "Krista Jakubiak is a Planner, problem-solver, and party-starter! She has planned everything from luxury destination weddings in Greece and Mexico to corporate galas high above NYC at One World Observatory. Serving clients across NY, NJ, and CT, Krista ensures every wedding runs seamlessly.\n\nWhen not planning weddings, Krista loves exploring Long Island or relaxing in the park with her Aussie Shepherd and Corgi. A passionate musician, she founded an A cappella group at FIT, competed at the ICCAs (real-life Pitch Perfect!), and hosts an annual live Christmas carol event with family.",
            src: "images/coordinators/KRISTA.png",
            calendlyLink: "https://calendly.com/krista-altare"
        }
    ];
    
    let activeIndex = 0;
    let autoplayTimer;
    let isPaused = false;
    
    // Create the HTML structure directly
    function renderTestimonials() {
        const html = `
            <div class="testimonial-carousel-container">
                <div class="testimonial-image-section">
                    <div class="testimonial-image-container">
                        ${testimonials.map((testimonial, index) => {
                            return `
                            <div class="testimonial-image-wrapper ${index === activeIndex ? 'active' : ''}" data-index="${index}">
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
                        <button class="testimonial-nav-button prev" aria-label="Previous testimonial">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button class="testimonial-nav-button pause-play" aria-label="Pause or play testimonial carousel">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="play-icon" style="display: none;">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="pause-icon">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                        <button class="testimonial-nav-button next" aria-label="Next testimonial">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
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
        testimonialContainer.querySelector('.pause-play').addEventListener('click', togglePausePlay);
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
    
    // Toggle pause/play functionality
    function togglePausePlay() {
        isPaused = !isPaused;
        
        // Update button appearance
        const pauseIcon = testimonialContainer.querySelector('.pause-icon');
        const playIcon = testimonialContainer.querySelector('.play-icon');
        
        if (isPaused) {
            pauseIcon.style.display = 'none';
            playIcon.style.display = 'block';
            stopAutoplay();
        } else {
            pauseIcon.style.display = 'block';
            playIcon.style.display = 'none';
            startAutoplay();
        }
    }
    
    // Autoplay functionality
    function startAutoplay() {
        if (!isPaused) {
            autoplayTimer = setInterval(handleNext, 5000);
        }
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
