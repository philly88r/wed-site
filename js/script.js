// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a, .footer-links a, .hero a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Only apply smooth scroll for page anchors
            if (targetId.startsWith('#')) {
                e.preventDefault();
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Offset for fixed header
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Countdown Timer
    function updateCountdown() {
        const weddingDateElement = document.getElementById('wedding-date');
        const weddingDateText = weddingDateElement.textContent;
        const weddingDate = new Date(weddingDateText);
        const currentDate = new Date();
        
        // Calculate time difference in milliseconds
        const timeDifference = weddingDate - currentDate;
        
        // Check if the wedding date has passed
        if (timeDifference <= 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }
        
        // Calculate days, hours, minutes, and seconds
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
        
        // Update the countdown display
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    // Initialize countdown
    updateCountdown();
    
    // Update countdown every second
    setInterval(updateCountdown, 1000);
    
    // Allow users to set their own wedding date
    const weddingDateElement = document.getElementById('wedding-date');
    
    weddingDateElement.addEventListener('click', function() {
        const currentDate = this.textContent;
        const newDate = prompt('Enter your wedding date (e.g., June 15, 2025):', currentDate);
        
        if (newDate && newDate.trim() !== '') {
            this.textContent = newDate.trim();
            // Save to localStorage for persistence
            localStorage.setItem('weddingDate', newDate.trim());
            // Update countdown immediately
            updateCountdown();
        }
    });
    
    // Load saved wedding date from localStorage if available
    if (localStorage.getItem('weddingDate')) {
        weddingDateElement.textContent = localStorage.getItem('weddingDate');
        updateCountdown();
    }
    
    // Budget calculator functionality
    const budgetForm = document.getElementById('budget-form');
    const totalBudgetElement = document.getElementById('total-budget');
    const spentAmountElement = document.getElementById('spent-amount');
    const remainingAmountElement = document.getElementById('remaining-amount');
    
    // Sample budget data
    const budgetCategories = [
        { name: 'Venue', allocation: 10000, spent: 0 },
        { name: 'Catering', allocation: 5000, spent: 0 },
        { name: 'Photography', allocation: 3000, spent: 0 },
        { name: 'Attire', allocation: 2000, spent: 0 },
        { name: 'Music', allocation: 1500, spent: 0 }
    ];
    
    // Function to update budget display
    function updateBudgetDisplay() {
        // Calculate total budget
        const totalBudget = budgetCategories.reduce((total, category) => total + category.allocation, 0);
        
        // Calculate total spent
        const totalSpent = budgetCategories.reduce((total, category) => total + category.spent, 0);
        
        // Calculate remaining budget
        const remainingBudget = totalBudget - totalSpent;
        
        // Update display
        totalBudgetElement.textContent = totalBudget.toLocaleString();
        spentAmountElement.textContent = totalSpent.toLocaleString();
        remainingAmountElement.textContent = remainingBudget.toLocaleString();
        
        // Update progress bars
        const progressBars = document.querySelectorAll('.progress-bar');
        
        budgetCategories.forEach((category, index) => {
            if (progressBars[index]) {
                const percentSpent = (category.spent / category.allocation) * 100;
                progressBars[index].style.width = `${percentSpent}%`;
            }
        });
    }
    
    // Initialize budget display
    updateBudgetDisplay();
    
    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (name && email && message) {
                // In a real application, you would send this data to a server
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
            } else {
                alert('Please fill in all fields.');
            }
        });
    }
    
    // Add task functionality (simplified)
    const addTaskButton = document.querySelector('.add-task-btn');
    
    if (addTaskButton) {
        addTaskButton.addEventListener('click', function() {
            const taskInput = document.getElementById('new-task');
            const taskList = document.querySelector('.task-list');
            
            if (taskInput && taskInput.value.trim() !== '') {
                // Create new task element
                const taskItem = document.createElement('div');
                taskItem.className = 'task-item';
                
                // Add task content
                taskItem.innerHTML = `
                    <input type="checkbox">
                    <span>${taskInput.value}</span>
                    <button class="delete-task"><i class="fas fa-trash"></i></button>
                `;
                
                // Add to task list
                taskList.appendChild(taskItem);
                
                // Clear input
                taskInput.value = '';
                
                // Add event listener to delete button
                const deleteButton = taskItem.querySelector('.delete-task');
                deleteButton.addEventListener('click', function() {
                    taskList.removeChild(taskItem);
                });
            }
        });
    }
    
    // Mobile navigation toggle
    const mobileNavToggle = document.createElement('div');
    mobileNavToggle.className = 'mobile-nav-toggle';
    mobileNavToggle.innerHTML = '<i class="fas fa-bars"></i>';
    
    const header = document.querySelector('header .container');
    header.appendChild(mobileNavToggle);
    
    mobileNavToggle.addEventListener('click', function() {
        const nav = document.querySelector('nav ul');
        nav.classList.toggle('show');
    });
    
    // Add mobile navigation styles
    const style = document.createElement('style');
    style.textContent = `
        @media screen and (max-width: 768px) {
            .mobile-nav-toggle {
                display: block;
                font-size: 24px;
                cursor: pointer;
            }
            
            nav ul {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                background-color: #fff;
                flex-direction: column;
                padding: 20px;
                box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
            }
            
            nav ul.show {
                display: flex;
            }
            
            nav ul li {
                margin: 10px 0;
            }
        }
    `;
    
    document.head.appendChild(style);
});
