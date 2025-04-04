/**
 * Tutorials and Journal Entries Management
 * 
 * This script handles the video tutorials and associated journal entries
 * for the Altare wedding planning platform.
 */

import { saveJournalEntry, getJournalEntriesByCategory, formatJournalDate, createJournalNotification } from './journal.js';

document.addEventListener('DOMContentLoaded', function() {
    initJournalForms();
    setupVideoTracking();
});

/**
 * Initialize all journal forms with event listeners
 */
function initJournalForms() {
    const journalForms = document.querySelectorAll('.journal-form');
    
    journalForms.forEach(form => {
        form.addEventListener('submit', handleJournalSubmit);
    });
    
    // Load any previously saved journal entries
    loadSavedJournalEntries();
}

/**
 * Handle journal form submission
 * @param {Event} event - The form submission event
 */
function handleJournalSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const tutorialId = form.getAttribute('data-tutorial-id');
    const formData = new FormData(form);
    const journalData = {};
    
    // Convert form data to object
    for (const [key, value] of formData.entries()) {
        journalData[key] = value;
    }
    
    // Save to user profile
    saveJournalEntry('tutorials', tutorialId, journalData)
        .then(() => {
            // Show success message
            createJournalNotification(form, 'Your journal entry has been saved!', 'success');
        })
        .catch(error => {
            console.error('Error saving journal entry:', error);
            createJournalNotification(form, 'There was an error saving your journal entry.', 'error');
        });
}

/**
 * Load saved journal entries from storage and populate forms
 */
function loadSavedJournalEntries() {
    getJournalEntriesByCategory('tutorials')
        .then(entries => {
            if (!entries || Object.keys(entries).length === 0) return;
            
            // For each saved entry, populate the corresponding form
            Object.keys(entries).forEach(tutorialId => {
                const form = document.querySelector(`.journal-form[data-tutorial-id="${tutorialId}"]`);
                if (!form) return;
                
                const data = entries[tutorialId];
                
                // Add last updated info if there's a timestamp
                if (data.timestamp) {
                    let lastUpdated = form.querySelector('.last-updated');
                    
                    if (!lastUpdated) {
                        lastUpdated = document.createElement('div');
                        lastUpdated.className = 'last-updated';
                        lastUpdated.style.fontSize = '0.85rem';
                        lastUpdated.style.color = '#666';
                        lastUpdated.style.marginTop = '10px';
                        lastUpdated.style.fontStyle = 'italic';
                        form.appendChild(lastUpdated);
                    }
                    
                    lastUpdated.textContent = `Last updated: ${formatJournalDate(data.timestamp)}`;
                }
                
                // Populate each form field
                Object.keys(data).forEach(key => {
                    if (key === 'timestamp') return; // Skip timestamp
                    
                    const field = form.elements[key];
                    if (!field) return;
                    
                    // Handle different field types
                    if (field.type === 'radio') {
                        const radio = form.querySelector(`input[name="${key}"][value="${data[key]}"]`);
                        if (radio) radio.checked = true;
                    } else {
                        field.value = data[key];
                    }
                });
            });
        })
        .catch(error => {
            console.error('Error loading journal entries:', error);
        });
}

/**
 * Handle video playback and tracking
 * This would be expanded in a production environment to track user progress
 */
function setupVideoTracking() {
    const videos = document.querySelectorAll('.tutorial-video');
    
    videos.forEach(video => {
        // Track when video is played
        video.addEventListener('play', function() {
            const tutorialItem = this.closest('.tutorial-item');
            const tutorialId = tutorialItem.id.replace('tutorial-', '');
            
            // In production, this would log to the user's profile
            console.log(`Tutorial ${tutorialId} video started playing`);
        });
        
        // Track when video is completed
        video.addEventListener('ended', function() {
            const tutorialItem = this.closest('.tutorial-item');
            const tutorialId = tutorialItem.id.replace('tutorial-', '');
            
            // In production, this would log to the user's profile
            console.log(`Tutorial ${tutorialId} video completed`);
            
            // Scroll to journal prompts
            const journalPrompt = tutorialItem.querySelector('.journal-prompt');
            if (journalPrompt) {
                journalPrompt.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}
