/**
 * Vendor Profile System
 * 
 * This script handles the vendor profile page functionality for Altare wedding platform.
 * It includes profile data loading, tab navigation, and contact form.
 */

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initTabNavigation();
    loadVendorProfile();
    initContactModal();
});

/**
 * Initialize tab navigation
 */
function initTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding tab pane
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
}

/**
 * Load vendor profile data
 */
function loadVendorProfile() {
    // Get vendor ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const vendorId = urlParams.get('id');
    
    if (!vendorId) {
        showVendorNotFound();
        return;
    }
    
    // In production, this would make an API call to get vendor data
    // For now, we'll load from localStorage
    const vendors = JSON.parse(localStorage.getItem('altareVendors') || '[]');
    const vendor = vendors.find(v => v.id === vendorId);
    
    if (!vendor) {
        showVendorNotFound();
        return;
    }
    
    // Populate vendor profile
    populateVendorProfile(vendor);
    
    // Hide loading, show content
    document.getElementById('vendor-profile-loading').style.display = 'none';
    document.getElementById('vendor-profile-content').style.display = 'block';
}

/**
 * Show vendor not found message
 */
function showVendorNotFound() {
    document.getElementById('vendor-profile-loading').style.display = 'none';
    document.getElementById('vendor-not-found').style.display = 'block';
}

/**
 * Populate vendor profile with data
 * @param {Object} vendor - The vendor data
 */
function populateVendorProfile(vendor) {
    // Set page title
    document.title = `${vendor.business_name} - Altare Vendor`;
    
    // Basic info
    document.getElementById('vendor-name').textContent = vendor.business_name;
    document.getElementById('vendor-category-badge').textContent = getCategoryDisplayName(vendor.category);
    document.getElementById('vendor-price-range').textContent = vendor.price_range || '$';
    document.getElementById('vendor-starting-price').textContent = `Starting at $${vendor.starting_price}`;
    
    // Super vendor badge
    if (vendor.super_vendor === 'on') {
        document.getElementById('super-vendor-badge').style.display = 'inline-flex';
    }
    
    // Contact info
    document.getElementById('vendor-location').textContent = `${vendor.city}, ${vendor.state}`;
    document.getElementById('vendor-phone').textContent = vendor.contact_phone;
    document.getElementById('vendor-email').textContent = vendor.contact_email;
    
    // Website
    if (vendor.website) {
        const websiteLink = document.getElementById('vendor-website');
        websiteLink.href = ensureHttpPrefix(vendor.website);
        websiteLink.textContent = formatWebsiteUrl(vendor.website);
    } else {
        document.getElementById('vendor-website-container').style.display = 'none';
    }
    
    // Social links
    const socialLinksContainer = document.getElementById('vendor-social-links');
    let hasSocialLinks = false;
    
    if (vendor.instagram) {
        hasSocialLinks = true;
        const link = document.createElement('a');
        link.href = `https://instagram.com/${vendor.instagram}`;
        link.target = '_blank';
        link.innerHTML = '<i class="fab fa-instagram"></i>';
        link.title = 'Instagram';
        socialLinksContainer.appendChild(link);
    }
    
    if (vendor.facebook) {
        hasSocialLinks = true;
        const link = document.createElement('a');
        link.href = `https://facebook.com/${vendor.facebook}`;
        link.target = '_blank';
        link.innerHTML = '<i class="fab fa-facebook-f"></i>';
        link.title = 'Facebook';
        socialLinksContainer.appendChild(link);
    }
    
    if (vendor.pinterest) {
        hasSocialLinks = true;
        const link = document.createElement('a');
        link.href = `https://pinterest.com/${vendor.pinterest}`;
        link.target = '_blank';
        link.innerHTML = '<i class="fab fa-pinterest"></i>';
        link.title = 'Pinterest';
        socialLinksContainer.appendChild(link);
    }
    
    if (vendor.tiktok) {
        hasSocialLinks = true;
        const link = document.createElement('a');
        link.href = `https://tiktok.com/@${vendor.tiktok}`;
        link.target = '_blank';
        link.innerHTML = '<i class="fab fa-tiktok"></i>';
        link.title = 'TikTok';
        socialLinksContainer.appendChild(link);
    }
    
    if (!hasSocialLinks) {
        socialLinksContainer.style.display = 'none';
    }
    
    // About tab
    document.getElementById('vendor-description').textContent = vendor.description;
    document.getElementById('vendor-years').textContent = vendor.years_in_business || '0';
    document.getElementById('vendor-weddings').textContent = vendor.avg_weddings_per_year || '0';
    
    // Services tab
    const servicesList = document.getElementById('vendor-services-list');
    if (vendor.services) {
        const services = vendor.services.split(',');
        services.forEach(service => {
            const li = document.createElement('li');
            li.textContent = service.trim();
            servicesList.appendChild(li);
        });
    }
    
    // Location tab
    const fullAddress = document.getElementById('vendor-full-address');
    fullAddress.innerHTML = `
        <p>${vendor.address}</p>
        <p>${vendor.city}, ${vendor.state} ${vendor.zip}</p>
    `;
    
    if (vendor.travel_radius) {
        document.getElementById('vendor-travel-radius').textContent = vendor.travel_radius;
    } else {
        document.getElementById('vendor-travel-info').textContent = 'Travel information not provided.';
    }
    
    // Initialize map
    initVendorMap(vendor);
    
    // Set up contact modal
    document.getElementById('modal-vendor-name').textContent = vendor.business_name;
    document.getElementById('vendor-id-input').value = vendor.id;
    
    // Set up save button
    const saveButton = document.getElementById('save-vendor-btn');
    if (isVendorSaved(vendor.id)) {
        saveButton.innerHTML = '<i class="fas fa-heart"></i> Saved';
        saveButton.classList.add('saved');
    }
    
    saveButton.addEventListener('click', function() {
        toggleSaveVendor(vendor.id, vendor.business_name);
    });
}

/**
 * Initialize vendor map
 * @param {Object} vendor - The vendor data
 */
function initVendorMap(vendor) {
    if (!window.google || !window.google.maps) {
        console.warn('Google Maps API not loaded');
        return;
    }
    
    const mapElement = document.getElementById('vendor-map');
    if (!mapElement) return;
    
    // Geocode address if we don't have coordinates
    const address = `${vendor.address}, ${vendor.city}, ${vendor.state} ${vendor.zip}`;
    
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, function(results, status) {
        if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            
            const map = new google.maps.Map(mapElement, {
                center: location,
                zoom: 15,
                mapTypeControl: false
            });
            
            const marker = new google.maps.Marker({
                position: location,
                map: map,
                title: vendor.business_name
            });
            
            // Add circle for travel radius if provided
            if (vendor.travel_radius) {
                const radius = parseFloat(vendor.travel_radius) * 1609.34; // Convert miles to meters
                
                const circle = new google.maps.Circle({
                    map: map,
                    radius: radius,
                    fillColor: '#3498db',
                    fillOpacity: 0.1,
                    strokeColor: '#3498db',
                    strokeOpacity: 0.8,
                    strokeWeight: 2
                });
                
                circle.bindTo('center', marker, 'position');
            }
        } else {
            console.error('Geocode failed:', status);
            mapElement.innerHTML = '<p class="map-error">Map location could not be loaded</p>';
        }
    });
}

/**
 * Initialize contact modal
 */
function initContactModal() {
    const modal = document.getElementById('contact-modal');
    const contactBtn = document.getElementById('contact-vendor-btn');
    const closeBtn = document.querySelector('.close-modal');
    const form = document.getElementById('contact-vendor-form');
    
    // Open modal
    contactBtn.addEventListener('click', function() {
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
    });
    
    // Close modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    });
    
    // Close when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    });
    
    // Handle form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const contactData = {};
        
        for (const [key, value] of formData.entries()) {
            contactData[key] = value;
        }
        
        // Add timestamp
        contactData.timestamp = new Date().toISOString();
        
        // In production, this would send an email or save to a database
        // For now, we'll save to localStorage
        saveContactRequest(contactData);
        
        // Show success message
        const statusElement = document.getElementById('contact-status');
        statusElement.className = 'contact-status success';
        statusElement.textContent = 'Your message has been sent! The vendor will contact you soon.';
        
        // Reset form
        form.reset();
        
        // Close modal after delay
        setTimeout(function() {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
            statusElement.textContent = '';
        }, 3000);
    });
}

/**
 * Save contact request to storage
 * @param {Object} data - The contact request data
 */
function saveContactRequest(data) {
    // Get existing requests or initialize empty array
    const requests = JSON.parse(localStorage.getItem('altareContactRequests') || '[]');
    
    // Add to requests array
    requests.push(data);
    
    // Save back to storage
    localStorage.setItem('altareContactRequests', JSON.stringify(requests));
    
    console.log('Contact request saved:', data);
}

/**
 * Check if a vendor is saved
 * @param {string} vendorId - The vendor ID
 * @returns {boolean} - Whether the vendor is saved
 */
function isVendorSaved(vendorId) {
    const savedVendors = JSON.parse(localStorage.getItem('altareSavedVendors') || '[]');
    return savedVendors.includes(vendorId);
}

/**
 * Toggle save/unsave vendor
 * @param {string} vendorId - The vendor ID
 * @param {string} vendorName - The vendor name
 */
function toggleSaveVendor(vendorId, vendorName) {
    const savedVendors = JSON.parse(localStorage.getItem('altareSavedVendors') || '[]');
    const saveButton = document.getElementById('save-vendor-btn');
    
    if (isVendorSaved(vendorId)) {
        // Remove from saved vendors
        const index = savedVendors.indexOf(vendorId);
        if (index !== -1) {
            savedVendors.splice(index, 1);
        }
        
        // Update button
        saveButton.innerHTML = '<i class="far fa-heart"></i> Save';
        saveButton.classList.remove('saved');
        
        // Show message
        showToast(`${vendorName} removed from saved vendors`);
    } else {
        // Add to saved vendors
        savedVendors.push(vendorId);
        
        // Update button
        saveButton.innerHTML = '<i class="fas fa-heart"></i> Saved';
        saveButton.classList.add('saved');
        
        // Show message
        showToast(`${vendorName} added to saved vendors`);
    }
    
    // Save back to storage
    localStorage.setItem('altareSavedVendors', JSON.stringify(savedVendors));
}

/**
 * Show toast notification
 * @param {string} message - The message to show
 */
function showToast(message) {
    // Check if toast container exists
    let toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) {
        // Create toast container
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', function() {
            toast.remove();
        });
    }, 3000);
}

/**
 * Get display name for vendor category
 * @param {string} category - The category slug
 * @returns {string} - The display name
 */
function getCategoryDisplayName(category) {
    const categories = {
        'venue': 'Venue',
        'catering': 'Catering',
        'photography': 'Photography',
        'videography': 'Videography',
        'florist': 'Florist',
        'music': 'Music/Entertainment',
        'cake': 'Cake/Desserts',
        'decor': 'Decor/Rentals',
        'beauty': 'Hair/Makeup',
        'officiant': 'Officiant',
        'planner': 'Wedding Planner',
        'transportation': 'Transportation',
        'jewelry': 'Jewelry',
        'attire': 'Wedding Attire',
        'invitations': 'Invitations/Stationery',
        'favors': 'Favors/Gifts'
    };
    
    return categories[category] || category;
}

/**
 * Ensure URL has http/https prefix
 * @param {string} url - The URL to check
 * @returns {string} - URL with http/https prefix
 */
function ensureHttpPrefix(url) {
    if (!url) return '';
    return url.match(/^https?:\/\//) ? url : `https://${url}`;
}

/**
 * Format website URL for display
 * @param {string} url - The URL to format
 * @returns {string} - Formatted URL
 */
function formatWebsiteUrl(url) {
    if (!url) return '';
    return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}
