// vendors.js - Handles vendor directory functionality
import { saveToLocalStorage, getFromLocalStorage } from './storage.js';

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const vendorsList = document.getElementById('vendors-list');
    const superVendorsList = document.getElementById('super-vendors-list');
    const categoryLinks = document.querySelectorAll('#category-list li');
    const searchInput = document.getElementById('vendor-search');
    const searchButton = document.getElementById('search-btn');
    const sortSelect = document.getElementById('sort-select');
    const vendorsLoading = document.getElementById('vendors-loading');
    const noVendors = document.getElementById('no-vendors');
    const vendorPagination = document.getElementById('vendor-pagination');
    const savedVendorsList = document.getElementById('saved-vendors-list');
    const locationFilter = document.getElementById('location-filter');
    const radiusSelect = document.getElementById('radius-select');
    const priceFilters = document.querySelectorAll('input[name="price"]');
    const vendorItemTemplate = document.getElementById('vendor-item-template');
    
    // State variables
    let vendors = [];
    let filteredVendors = [];
    let currentCategory = 'all';
    let currentPage = 1;
    const vendorsPerPage = 9;
    let savedVendors = getFromLocalStorage('savedVendors', []);
    
    // Initialize
    init();
    
    function init() {
        // Load vendors from localStorage or fetch from API
        loadVendors();
        
        // Add event listeners
        addEventListeners();
        
        // Initialize Google Maps Autocomplete for location filter
        if (window.google && window.google.maps) {
            initLocationAutocomplete();
        }
    }
    
    // Load vendors from localStorage or fetch from API
    function loadVendors() {
        showLoading();
        
        // Try to get vendors from localStorage first
        const storedVendors = getFromLocalStorage('vendors', null);
        
        if (storedVendors && storedVendors.length > 0) {
            vendors = storedVendors;
            processVendors();
        } else {
            // If no vendors in localStorage, use sample data for now
            // In a real app, this would be an API call
            vendors = getSampleVendors();
            saveToLocalStorage('vendors', vendors);
            processVendors();
        }
    }
    
    // Process vendors after loading
    function processVendors() {
        filterVendors();
        hideLoading();
    }
    
    // Show loading state
    function showLoading() {
        vendorsLoading.style.display = 'flex';
        vendorsList.style.display = 'none';
        noVendors.style.display = 'none';
    }
    
    // Hide loading state
    function hideLoading() {
        vendorsLoading.style.display = 'none';
        
        if (filteredVendors.length === 0) {
            noVendors.style.display = 'flex';
            vendorsList.style.display = 'none';
        } else {
            noVendors.style.display = 'none';
            vendorsList.style.display = 'grid';
        }
    }
    
    // Add all event listeners
    function addEventListeners() {
        // Category filter
        categoryLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all links
                categoryLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Update current category
                currentCategory = this.dataset.category;
                currentPage = 1;
                
                // Filter vendors
                filterVendors();
            });
        });
        
        // Search
        searchButton.addEventListener('click', function() {
            filterVendors();
        });
        
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                filterVendors();
            }
        });
        
        // Sort
        sortSelect.addEventListener('change', function() {
            filterVendors();
        });
        
        // Price filters
        priceFilters.forEach(filter => {
            filter.addEventListener('change', function() {
                filterVendors();
            });
        });
        
        // Location and radius filters
        locationFilter.addEventListener('change', function() {
            filterVendors();
        });
        
        radiusSelect.addEventListener('change', function() {
            if (locationFilter.value.trim() !== '') {
                filterVendors();
            }
        });
    }
    
    // Initialize Google Maps Autocomplete for location filter
    function initLocationAutocomplete() {
        const autocomplete = new google.maps.places.Autocomplete(locationFilter, {
            types: ['(cities)'],
            componentRestrictions: { country: 'us' }
        });
        
        autocomplete.addListener('place_changed', function() {
            filterVendors();
        });
    }
    
    // Filter vendors based on all criteria
    function filterVendors() {
        showLoading();
        
        // Start with all vendors
        filteredVendors = [...vendors];
        
        // Filter by category
        if (currentCategory !== 'all') {
            filteredVendors = filteredVendors.filter(vendor => vendor.category === currentCategory);
        }
        
        // Filter by search term
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm !== '') {
            filteredVendors = filteredVendors.filter(vendor => 
                vendor.name.toLowerCase().includes(searchTerm) ||
                vendor.description.toLowerCase().includes(searchTerm) ||
                vendor.location.toLowerCase().includes(searchTerm)
            );
        }
        
        // Filter by price
        const selectedPrices = Array.from(priceFilters)
            .filter(filter => filter.checked)
            .map(filter => filter.value);
            
        if (selectedPrices.length > 0) {
            filteredVendors = filteredVendors.filter(vendor => 
                selectedPrices.includes(vendor.price)
            );
        }
        
        // Filter by location (would require geocoding in a real app)
        // This is a simplified version
        const location = locationFilter.value.trim();
        if (location !== '') {
            // In a real app, this would use geocoding to calculate distances
            filteredVendors = filteredVendors.filter(vendor => 
                vendor.location.toLowerCase().includes(location.toLowerCase())
            );
        }
        
        // Sort vendors
        sortVendors();
        
        // Render vendors
        renderVendors();
        renderPagination();
        renderSuperVendors();
        
        hideLoading();
    }
    
    // Sort vendors based on selected sort option
    function sortVendors() {
        const sortBy = sortSelect.value;
        
        switch (sortBy) {
            case 'featured':
                // Sort by super vendor status first, then by name
                filteredVendors.sort((a, b) => {
                    if (a.superVendor && !b.superVendor) return -1;
                    if (!a.superVendor && b.superVendor) return 1;
                    return a.name.localeCompare(b.name);
                });
                break;
                
            case 'name-asc':
                filteredVendors.sort((a, b) => a.name.localeCompare(b.name));
                break;
                
            case 'name-desc':
                filteredVendors.sort((a, b) => b.name.localeCompare(a.name));
                break;
                
            case 'price-asc':
                filteredVendors.sort((a, b) => a.startingPrice - b.startingPrice);
                break;
                
            case 'price-desc':
                filteredVendors.sort((a, b) => b.startingPrice - a.startingPrice);
                break;
        }
    }
    
    // Render vendors with pagination
    function renderVendors() {
        // Clear vendors list
        while (vendorsList.firstChild && vendorsList.firstChild !== vendorsLoading && vendorsList.firstChild !== noVendors) {
            vendorsList.removeChild(vendorsList.firstChild);
        }
        
        // Calculate pagination
        const startIndex = (currentPage - 1) * vendorsPerPage;
        const endIndex = startIndex + vendorsPerPage;
        const vendorsToShow = filteredVendors.slice(startIndex, endIndex);
        
        // Render each vendor
        vendorsToShow.forEach(vendor => {
            const vendorItem = createVendorElement(vendor);
            vendorsList.appendChild(vendorItem);
        });
    }
    
    // Create vendor element from template
    function createVendorElement(vendor) {
        const template = vendorItemTemplate.content.cloneNode(true);
        const vendorItem = template.querySelector('.vendor-item');
        
        // Set vendor data
        vendorItem.dataset.id = vendor.id;
        vendorItem.dataset.category = vendor.category;
        
        // Super vendor badge
        const superBadge = vendorItem.querySelector('.vendor-super-badge');
        if (vendor.superVendor) {
            superBadge.style.display = 'block';
        } else {
            superBadge.style.display = 'none';
        }
        
        // Image
        const img = vendorItem.querySelector('.vendor-image img');
        img.src = vendor.image || 'images/vendors/placeholder.jpg';
        img.alt = vendor.name;
        
        // Save button
        const saveBtn = vendorItem.querySelector('.save-vendor-btn');
        const saveIcon = saveBtn.querySelector('i');
        
        if (isVendorSaved(vendor.id)) {
            saveIcon.classList.remove('far');
            saveIcon.classList.add('fas');
        } else {
            saveIcon.classList.remove('fas');
            saveIcon.classList.add('far');
        }
        
        saveBtn.addEventListener('click', function() {
            toggleSavedVendor(vendor.id);
            
            if (isVendorSaved(vendor.id)) {
                saveIcon.classList.remove('far');
                saveIcon.classList.add('fas');
            } else {
                saveIcon.classList.remove('fas');
                saveIcon.classList.add('far');
            }
        });
        
        // Name
        vendorItem.querySelector('.vendor-name').textContent = vendor.name;
        
        // Category and price
        vendorItem.querySelector('.vendor-category').textContent = formatCategory(vendor.category);
        vendorItem.querySelector('.vendor-price').textContent = vendor.price;
        
        // Location
        vendorItem.querySelector('.vendor-location span').textContent = vendor.location;
        
        // Description
        vendorItem.querySelector('.vendor-description').textContent = truncateText(vendor.description, 100);
        
        // Starting price
        vendorItem.querySelector('.vendor-starting-price span').textContent = vendor.startingPrice;
        
        // View profile button
        const profileBtn = vendorItem.querySelector('.view-profile-btn');
        profileBtn.href = `vendor-profile.html?id=${vendor.id}`;
        
        return vendorItem;
    }
    
    // Render pagination
    function renderPagination() {
        vendorPagination.innerHTML = '';
        
        if (filteredVendors.length <= vendorsPerPage) {
            return;
        }
        
        const totalPages = Math.ceil(filteredVendors.length / vendorsPerPage);
        
        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.classList.add('pagination-btn', 'prev-btn');
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                renderVendors();
                renderPagination();
                window.scrollTo(0, 0);
            }
        });
        vendorPagination.appendChild(prevBtn);
        
        // Page numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        // First page
        if (startPage > 1) {
            const firstBtn = document.createElement('button');
            firstBtn.classList.add('pagination-btn', 'page-btn');
            firstBtn.textContent = '1';
            firstBtn.addEventListener('click', function() {
                currentPage = 1;
                renderVendors();
                renderPagination();
                window.scrollTo(0, 0);
            });
            vendorPagination.appendChild(firstBtn);
            
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.classList.add('pagination-ellipsis');
                ellipsis.textContent = '...';
                vendorPagination.appendChild(ellipsis);
            }
        }
        
        // Page buttons
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.classList.add('pagination-btn', 'page-btn');
            if (i === currentPage) {
                pageBtn.classList.add('active');
            }
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', function() {
                currentPage = i;
                renderVendors();
                renderPagination();
                window.scrollTo(0, 0);
            });
            vendorPagination.appendChild(pageBtn);
        }
        
        // Last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.classList.add('pagination-ellipsis');
                ellipsis.textContent = '...';
                vendorPagination.appendChild(ellipsis);
            }
            
            const lastBtn = document.createElement('button');
            lastBtn.classList.add('pagination-btn', 'page-btn');
            lastBtn.textContent = totalPages;
            lastBtn.addEventListener('click', function() {
                currentPage = totalPages;
                renderVendors();
                renderPagination();
                window.scrollTo(0, 0);
            });
            vendorPagination.appendChild(lastBtn);
        }
        
        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.classList.add('pagination-btn', 'next-btn');
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', function() {
            if (currentPage < totalPages) {
                currentPage++;
                renderVendors();
                renderPagination();
                window.scrollTo(0, 0);
            }
        });
        vendorPagination.appendChild(nextBtn);
    }
    
    // Render super vendors section
    function renderSuperVendors() {
        // Clear super vendors list
        superVendorsList.innerHTML = '';
        
        // Get super vendors for current category
        let superVendors = vendors.filter(vendor => vendor.superVendor);
        
        // If category filter is active, only show super vendors for that category
        if (currentCategory !== 'all') {
            superVendors = superVendors.filter(vendor => vendor.category === currentCategory);
        }
        
        // Hide section if no super vendors
        const superVendorsSection = document.getElementById('super-vendors-section');
        if (superVendors.length === 0) {
            superVendorsSection.style.display = 'none';
            return;
        }
        
        // Show section
        superVendorsSection.style.display = 'block';
        
        // Render each super vendor
        superVendors.forEach(vendor => {
            const vendorItem = createVendorElement(vendor);
            superVendorsList.appendChild(vendorItem);
        });
    }
    
    // Render saved vendors list
    function renderSavedVendors() {
        // Clear saved vendors list
        savedVendorsList.innerHTML = '';
        
        // Show empty message if no saved vendors
        if (savedVendors.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.classList.add('empty-saved');
            emptyMessage.textContent = 'No vendors saved yet. Click the heart icon to save vendors you\'re interested in.';
            savedVendorsList.appendChild(emptyMessage);
            return;
        }
        
        // Render each saved vendor
        savedVendors.forEach(vendorId => {
            const vendor = vendors.find(v => v.id === vendorId);
            if (!vendor) return;
            
            const savedItem = document.createElement('div');
            savedItem.classList.add('saved-vendor-item');
            
            savedItem.innerHTML = `
                <div class="saved-vendor-info">
                    <h4>${vendor.name}</h4>
                    <span>${formatCategory(vendor.category)}</span>
                </div>
                <div class="saved-vendor-actions">
                    <a href="vendor-profile.html?id=${vendor.id}" class="view-saved-btn">
                        <i class="fas fa-eye"></i>
                    </a>
                    <button class="remove-saved-btn" data-id="${vendor.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            // Add remove button event listener
            savedItem.querySelector('.remove-saved-btn').addEventListener('click', function() {
                const vendorId = this.dataset.id;
                toggleSavedVendor(vendorId);
                renderSavedVendors();
                
                // Update save button in vendor list if visible
                const vendorItems = document.querySelectorAll(`.vendor-item[data-id="${vendorId}"]`);
                vendorItems.forEach(item => {
                    const saveIcon = item.querySelector('.save-vendor-btn i');
                    saveIcon.classList.remove('fas');
                    saveIcon.classList.add('far');
                });
            });
            
            savedVendorsList.appendChild(savedItem);
        });
    }
    
    // Toggle saved vendor
    function toggleSavedVendor(vendorId) {
        const index = savedVendors.indexOf(vendorId);
        
        if (index === -1) {
            // Add to saved vendors
            savedVendors.push(vendorId);
        } else {
            // Remove from saved vendors
            savedVendors.splice(index, 1);
        }
        
        // Save to localStorage
        saveToLocalStorage('savedVendors', savedVendors);
        
        // Update saved vendors list
        renderSavedVendors();
    }
    
    // Check if vendor is saved
    function isVendorSaved(vendorId) {
        return savedVendors.includes(vendorId);
    }
    
    // Format category name
    function formatCategory(category) {
        const categoryMap = {
            'venue': 'Venue',
            'catering': 'Catering',
            'photography': 'Photography',
            'videography': 'Videography',
            'florist': 'Florist',
            'music': 'Music & Entertainment',
            'cake': 'Cake & Desserts',
            'decor': 'Decor & Rentals',
            'beauty': 'Hair & Makeup',
            'officiant': 'Officiant',
            'planner': 'Wedding Planner',
            'transportation': 'Transportation',
            'jewelry': 'Jewelry',
            'attire': 'Wedding Attire',
            'invitations': 'Invitations',
            'favors': 'Favors & Gifts'
        };
        
        return categoryMap[category] || category;
    }
    
    // Truncate text with ellipsis
    function truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
    
    // Sample vendors data
    function getSampleVendors() {
        return [
            {
                id: '1',
                name: 'Grand Ballroom',
                category: 'venue',
                price: '$$$',
                location: 'New York, NY',
                description: 'A luxurious ballroom with stunning chandeliers and a capacity for up to 300 guests. Perfect for elegant weddings.',
                image: 'https://via.placeholder.com/400x300?text=Grand+Ballroom',
                startingPrice: 5000,
                superVendor: true
            },
            {
                id: '2',
                name: 'Delicious Catering',
                category: 'catering',
                price: '$$',
                location: 'Boston, MA',
                description: 'Specializing in gourmet cuisine with customizable menus to fit your taste and budget. Full-service catering available.',
                image: 'https://via.placeholder.com/400x300?text=Delicious+Catering',
                startingPrice: 2500,
                superVendor: false
            },
            {
                id: '3',
                name: 'Capture Moments',
                category: 'photography',
                price: '$$$',
                location: 'Los Angeles, CA',
                description: 'Award-winning wedding photography with a focus on candid moments and artistic compositions. Packages include engagement sessions.',
                image: 'https://via.placeholder.com/400x300?text=Capture+Moments',
                startingPrice: 3000,
                superVendor: true
            },
            {
                id: '4',
                name: 'Floral Fantasy',
                category: 'florist',
                price: '$$',
                location: 'Chicago, IL',
                description: 'Creating stunning floral arrangements for weddings and events. Specializing in seasonal blooms and unique designs.',
                image: 'https://via.placeholder.com/400x300?text=Floral+Fantasy',
                startingPrice: 1500,
                superVendor: false
            },
            {
                id: '5',
                name: 'Sweet Creations',
                category: 'cake',
                price: '$$',
                location: 'Miami, FL',
                description: 'Custom wedding cakes and desserts that taste as amazing as they look. Offering a variety of flavors and designs.',
                image: 'https://via.placeholder.com/400x300?text=Sweet+Creations',
                startingPrice: 800,
                superVendor: false
            },
            {
                id: '6',
                name: 'Harmony Wedding Band',
                category: 'music',
                price: '$$$',
                location: 'Nashville, TN',
                description: 'Professional wedding band with a diverse repertoire from classic to contemporary hits. Creating the perfect atmosphere for your special day.',
                image: 'https://via.placeholder.com/400x300?text=Harmony+Wedding+Band',
                startingPrice: 3500,
                superVendor: true
            },
            {
                id: '7',
                name: 'Elegant Decor',
                category: 'decor',
                price: '$$',
                location: 'Seattle, WA',
                description: 'Transform your venue with our stunning decor packages. From simple elegance to elaborate designs, we bring your vision to life.',
                image: 'https://via.placeholder.com/400x300?text=Elegant+Decor',
                startingPrice: 2000,
                superVendor: false
            },
            {
                id: '8',
                name: 'Beauty Bridal',
                category: 'beauty',
                price: '$$',
                location: 'San Francisco, CA',
                description: 'Professional hair and makeup services for brides and the entire wedding party. We come to you for a stress-free experience.',
                image: 'https://via.placeholder.com/400x300?text=Beauty+Bridal',
                startingPrice: 1200,
                superVendor: false
            },
            {
                id: '9',
                name: 'Reverent Ceremonies',
                category: 'officiant',
                price: '$',
                location: 'Denver, CO',
                description: 'Personalized wedding ceremonies that reflect your love story. Religious, non-denominational, and civil ceremonies available.',
                image: 'https://via.placeholder.com/400x300?text=Reverent+Ceremonies',
                startingPrice: 500,
                superVendor: false
            },
            {
                id: '10',
                name: 'Perfect Planning',
                category: 'planner',
                price: '$$$',
                location: 'Atlanta, GA',
                description: 'Full-service wedding planning from engagement to "I do". Let us handle the details so you can enjoy your special day.',
                image: 'https://via.placeholder.com/400x300?text=Perfect+Planning',
                startingPrice: 4000,
                superVendor: true
            },
            {
                id: '11',
                name: 'Luxury Limos',
                category: 'transportation',
                price: '$$',
                location: 'Las Vegas, NV',
                description: 'Arrive in style with our fleet of luxury vehicles. From classic cars to modern limousines, we have the perfect transportation for your wedding day.',
                image: 'https://via.placeholder.com/400x300?text=Luxury+Limos',
                startingPrice: 1000,
                superVendor: false
            },
            {
                id: '12',
                name: 'Forever Rings',
                category: 'jewelry',
                price: '$$$',
                location: 'Philadelphia, PA',
                description: 'Custom wedding bands and engagement rings crafted with the finest materials. Design the perfect symbol of your love.',
                image: 'https://via.placeholder.com/400x300?text=Forever+Rings',
                startingPrice: 3000,
                superVendor: false
            }
        ];
    }
});
