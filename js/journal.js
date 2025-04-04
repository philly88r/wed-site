/**
 * Journal Entry Management
 * 
 * This module provides functionality for managing user journal entries
 * across the Altare wedding planning platform.
 */

/**
 * Save a journal entry to the user's profile
 * @param {string} category - The category of the journal entry (e.g., 'tutorial', 'planning')
 * @param {string} entryId - The specific ID for this entry
 * @param {Object} data - The journal entry data
 * @returns {Promise} - Promise resolving to the saved entry
 */
export function saveJournalEntry(category, entryId, data) {
    return new Promise((resolve, reject) => {
        try {
            // Get existing journal entries or initialize empty object
            const journalEntries = JSON.parse(localStorage.getItem('altareJournalEntries') || '{}');
            
            // Initialize category if it doesn't exist
            if (!journalEntries[category]) {
                journalEntries[category] = {};
            }
            
            // Add timestamp to entry
            data.timestamp = new Date().toISOString();
            
            // Save entry under category and ID
            journalEntries[category][entryId] = data;
            
            // Save back to storage
            localStorage.setItem('altareJournalEntries', JSON.stringify(journalEntries));
            
            // In a production environment, this would make an API call to save to the user's profile
            console.log(`Journal entry saved: ${category}/${entryId}`);
            
            resolve(data);
        } catch (error) {
            console.error('Error saving journal entry:', error);
            reject(error);
        }
    });
}

/**
 * Get a specific journal entry
 * @param {string} category - The category of the journal entry
 * @param {string} entryId - The specific ID for this entry
 * @returns {Promise} - Promise resolving to the journal entry data
 */
export function getJournalEntry(category, entryId) {
    return new Promise((resolve, reject) => {
        try {
            const journalEntries = JSON.parse(localStorage.getItem('altareJournalEntries') || '{}');
            
            if (!journalEntries[category] || !journalEntries[category][entryId]) {
                resolve(null); // Entry not found
                return;
            }
            
            resolve(journalEntries[category][entryId]);
        } catch (error) {
            console.error('Error retrieving journal entry:', error);
            reject(error);
        }
    });
}

/**
 * Get all journal entries for a category
 * @param {string} category - The category of journal entries to retrieve
 * @returns {Promise} - Promise resolving to an object of journal entries
 */
export function getJournalEntriesByCategory(category) {
    return new Promise((resolve, reject) => {
        try {
            const journalEntries = JSON.parse(localStorage.getItem('altareJournalEntries') || '{}');
            
            if (!journalEntries[category]) {
                resolve({}); // No entries for this category
                return;
            }
            
            resolve(journalEntries[category]);
        } catch (error) {
            console.error('Error retrieving journal entries:', error);
            reject(error);
        }
    });
}

/**
 * Delete a journal entry
 * @param {string} category - The category of the journal entry
 * @param {string} entryId - The specific ID for this entry
 * @returns {Promise} - Promise resolving when the entry is deleted
 */
export function deleteJournalEntry(category, entryId) {
    return new Promise((resolve, reject) => {
        try {
            const journalEntries = JSON.parse(localStorage.getItem('altareJournalEntries') || '{}');
            
            if (!journalEntries[category] || !journalEntries[category][entryId]) {
                resolve(false); // Entry not found
                return;
            }
            
            // Delete the entry
            delete journalEntries[category][entryId];
            
            // Save back to storage
            localStorage.setItem('altareJournalEntries', JSON.stringify(journalEntries));
            
            resolve(true);
        } catch (error) {
            console.error('Error deleting journal entry:', error);
            reject(error);
        }
    });
}

/**
 * Format a journal entry timestamp for display
 * @param {string} timestamp - ISO timestamp string
 * @returns {string} - Formatted date string
 */
export function formatJournalDate(timestamp) {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Create a notification for journal entry actions
 * @param {HTMLElement} container - Container to append notification to
 * @param {string} message - Notification message
 * @param {string} type - Notification type ('success', 'error', 'info')
 */
export function createJournalNotification(container, message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `journal-notification ${type}`;
    
    // Set icon based on type
    let icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'info') icon = 'info-circle';
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${icon}"></i>
            <p>${message}</p>
        </div>
    `;
    
    // Add styles
    notification.style.marginTop = '20px';
    notification.style.padding = '15px';
    notification.style.borderRadius = '8px';
    notification.style.animation = 'fadeIn 0.3s ease';
    
    if (type === 'success') {
        notification.style.backgroundColor = 'rgba(46, 204, 113, 0.1)';
        notification.style.borderLeft = '4px solid #2ecc71';
    } else if (type === 'error') {
        notification.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
        notification.style.borderLeft = '4px solid #e74c3c';
    } else {
        notification.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
        notification.style.borderLeft = '4px solid #3498db';
    }
    
    const content = notification.querySelector('.notification-content');
    content.style.display = 'flex';
    content.style.alignItems = 'center';
    content.style.gap = '10px';
    
    const icon_elem = notification.querySelector('i');
    if (type === 'success') icon_elem.style.color = '#2ecc71';
    else if (type === 'error') icon_elem.style.color = '#e74c3c';
    else icon_elem.style.color = '#3498db';
    icon_elem.style.fontSize = '1.5rem';
    
    // Add keyframes for animation
    if (!document.getElementById('notification-keyframes')) {
        const style = document.createElement('style');
        style.id = 'notification-keyframes';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Append to container
    container.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease forwards';
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
    
    return notification;
}
