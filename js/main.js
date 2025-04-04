import { initDisplayCards } from './displayCard.js';
import { initHero } from './hero.js';

// Initialize countdown timer
document.addEventListener('DOMContentLoaded', function() {
    // Set the wedding date
    const weddingDateElement = document.getElementById('wedding-date');
    let weddingDateStr = weddingDateElement ? weddingDateElement.textContent : 'June 15, 2025';
    
    // Parse the wedding date
    const weddingDate = new Date(weddingDateStr);
    
    // Update countdown every second
    setInterval(function() {
        updateCountdown(weddingDate);
    }, 1000);
    
    // Initialize countdown immediately
    updateCountdown(weddingDate);
    
    // Initialize display cards for planning tools
    initDisplayCards('planning-cards-container', [
        {
            className: 'stack-card-1 grayscale',
            iconClass: 'fas fa-tasks',
            title: 'Task Manager',
            description: 'Organize and track all your wedding planning tasks',
            date: 'Updated daily with new features'
        },
        {
            className: 'stack-card-2 grayscale',
            iconClass: 'fas fa-users',
            title: 'Guest List',
            description: 'Manage RSVPs, seating arrangements, and dietary preferences',
            date: 'Last updated 2 days ago'
        },
        {
            className: 'stack-card-3',
            iconClass: 'fas fa-calendar-alt',
            title: 'Timeline',
            description: 'Create a detailed schedule for your perfect wedding day',
            date: 'Last updated 5 days ago'
        }
    ]);
    
    // Initialize hero section
    initHero();
});

// Function to update countdown
function updateCountdown(weddingDate) {
    const now = new Date();
    const diff = weddingDate - now;
    
    // Calculate days, hours, minutes, and seconds
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    // Update the countdown elements
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}
