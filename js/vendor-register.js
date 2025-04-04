/**
 * Vendor Registration System
 * 
 * This script handles the vendor registration process for Altare wedding platform.
 * It includes form validation, map integration, and data storage.
 */

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initRegistrationForm();
    initMapPreview();
    initCategoryLinks();
    populateFormFromUrl();
});

/**
 * Initialize the registration form with event listeners
 */
function initRegistrationForm() {
    const form = document.getElementById('vendor-registration-form');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
        
        // Initialize address autocomplete
        const addressInput = document.getElementById('address');
        if (addressInput && window.google && window.google.maps) {
            const autocomplete = new google.maps.places.Autocomplete(addressInput);
            autocomplete.addListener('place_changed', function() {
                const place = autocomplete.getPlace();
                if (place.geometry) {
                    // Fill in address components
                    for (const component of place.address_components) {
                        const componentType = component.types[0];
                        
                        switch (componentType) {
                            case "locality":
                                document.getElementById('city').value = component.long_name;
                                break;
                            case "administrative_area_level_1":
                                document.getElementById('state').value = component.short_name;
                                break;
                            case "postal_code":
                                document.getElementById('zip').value = component.long_name;
                                break;
                        }
                    }
                    
                    // Update map
                    updateMapPreview(place.geometry.location.lat(), place.geometry.location.lng());
                }
            });
        }
    }
    
    // Initialize copy buttons for registration links
    const copyButtons = document.querySelectorAll('.copy-link-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const linkId = this.getAttribute('data-link');
            const linkInput = document.getElementById(linkId);
            
            if (linkInput) {
                linkInput.select();
                document.execCommand('copy');
                
                // Show copied message
                const originalIcon = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i>';
                this.classList.add('copied');
                
                setTimeout(() => {
                    this.innerHTML = originalIcon;
                    this.classList.remove('copied');
                }, 2000);
            }
        });
    });
}

/**
 * Initialize the map preview
 */
function initMapPreview() {
    if (!window.google || !window.google.maps) {
        console.warn('Google Maps API not loaded');
        return;
    }
    
    const mapElement = document.getElementById('map-preview');
    if (mapElement) {
        // Default to a central US location
        const defaultLocation = { lat: 39.8283, lng: -98.5795 };
        
        const map = new google.maps.Map(mapElement, {
            center: defaultLocation,
            zoom: 4,
            mapTypeControl: false,
            streetViewControl: false
        });
        
        // Store map in window for later access
        window.vendorMap = map;
        window.vendorMarker = new google.maps.Marker({
            position: defaultLocation,
            map: map,
            title: 'Your Business Location'
        });
    }
}

/**
 * Update the map preview with new coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 */
function updateMapPreview(lat, lng) {
    if (!window.vendorMap || !window.vendorMarker) return;
    
    const position = { lat, lng };
    window.vendorMap.setCenter(position);
    window.vendorMap.setZoom(15);
    window.vendorMarker.setPosition(position);
}

/**
 * Initialize category links
 */
function initCategoryLinks() {
    // Update links with actual domain
    const domain = window.location.origin;
    const linkInputs = document.querySelectorAll('.link-container input');
    
    linkInputs.forEach(input => {
        const currentValue = input.value;
        const updatedValue = currentValue.replace('https://altare.com', domain);
        input.value = updatedValue;
    });
}

/**
 * Populate form fields from URL parameters
 */
function populateFormFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category) {
        const categorySelect = document.getElementById('category');
        if (categorySelect) {
            // Find the option with matching value
            const options = categorySelect.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].value === category) {
                    categorySelect.selectedIndex = i;
                    break;
                }
            }
        }
    }
}

/**
 * Handle form submission
 * @param {Event} event - The form submission event
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // Get form data
    const form = event.target;
    const formData = new FormData(form);
    
    // Convert FormData to object
    const vendorData = {};
    for (const [key, value] of formData.entries()) {
        // Skip file inputs for now (would be handled differently in production)
        if (key === 'profile_image' || key === 'gallery_images') continue;
        vendorData[key] = value;
    }
    
    // Add timestamp
    vendorData.created_at = new Date().toISOString();
    vendorData.status = 'pending'; // Default status
    
    // In production, this would make an API call to save the data
    // For now, we'll save to localStorage
    saveVendorData(vendorData);
    
    // Show success message
    showRegistrationStatus('success', 'Your registration has been submitted successfully! We will review your information and contact you soon.');
    
    // Reset form after successful submission
    setTimeout(() => {
        form.reset();
    }, 2000);
}

/**
 * Validate the registration form
 * @returns {boolean} - Whether the form is valid
 */
function validateForm() {
    const form = document.getElementById('vendor-registration-form');
    
    // Check required fields
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            highlightInvalidField(field);
        } else {
            removeInvalidHighlight(field);
        }
    });
    
    // Check if price range is selected
    const priceRange = form.querySelector('input[name="price_range"]:checked');
    if (!priceRange) {
        isValid = false;
        highlightInvalidField(document.querySelector('.price-range-selector'));
    } else {
        removeInvalidHighlight(document.querySelector('.price-range-selector'));
    }
    
    // Check terms agreement
    const termsAgreement = document.getElementById('terms_agreement');
    if (!termsAgreement.checked) {
        isValid = false;
        highlightInvalidField(termsAgreement.parentElement);
    } else {
        removeInvalidHighlight(termsAgreement.parentElement);
    }
    
    if (!isValid) {
        showRegistrationStatus('error', 'Please fill in all required fields marked with *');
    }
    
    return isValid;
}

/**
 * Highlight an invalid form field
 * @param {HTMLElement} field - The field to highlight
 */
function highlightInvalidField(field) {
    field.classList.add('invalid');
    
    // Add shake animation
    field.classList.add('shake');
    setTimeout(() => {
        field.classList.remove('shake');
    }, 500);
    
    // Add event listener to remove invalid class on input
    field.addEventListener('input', function onInput() {
        field.classList.remove('invalid');
        field.removeEventListener('input', onInput);
    }, { once: true });
}

/**
 * Remove invalid highlight from a field
 * @param {HTMLElement} field - The field to update
 */
function removeInvalidHighlight(field) {
    field.classList.remove('invalid');
}

/**
 * Save vendor data to storage
 * @param {Object} data - The vendor data to save
 */
function saveVendorData(data) {
    // Get existing vendors or initialize empty array
    const vendors = JSON.parse(localStorage.getItem('altareVendors') || '[]');
    
    // Add unique ID
    data.id = generateUniqueId();
    
    // Add to vendors array
    vendors.push(data);
    
    // Save back to storage
    localStorage.setItem('altareVendors', JSON.stringify(vendors));
    
    // If super vendor is selected, save to super vendor requests
    if (data.super_vendor === 'on') {
        const superVendorRequests = JSON.parse(localStorage.getItem('altareSuperVendorRequests') || '[]');
        superVendorRequests.push({
            id: data.id,
            business_name: data.business_name,
            category: data.category,
            contact_email: data.contact_email,
            requested_at: data.created_at,
            status: 'pending'
        });
        localStorage.setItem('altareSuperVendorRequests', JSON.stringify(superVendorRequests));
    }
    
    console.log('Vendor data saved:', data);
}

/**
 * Generate a unique ID
 * @returns {string} - Unique ID
 */
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

/**
 * Show registration status message
 * @param {string} type - Message type ('success' or 'error')
 * @param {string} message - Message text
 */
function showRegistrationStatus(type, message) {
    const statusElement = document.getElementById('registration-status');
    
    if (statusElement) {
        statusElement.className = `registration-status ${type}`;
        statusElement.textContent = message;
        statusElement.style.display = 'block';
        
        // Scroll to status message
        statusElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Clear error message after 5 seconds
        if (type === 'error') {
            setTimeout(() => {
                statusElement.style.display = 'none';
            }, 5000);
        }
    }
}
