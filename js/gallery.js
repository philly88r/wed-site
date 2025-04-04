// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Gallery elements
    const galleryGrid = document.getElementById('gallery-grid');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryEmpty = document.getElementById('gallery-empty');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('gallery-search-input');
    const searchButton = document.getElementById('gallery-search-btn');
    
    // Lightbox elements
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const lightboxDate = document.getElementById('lightbox-date');
    const lightboxClose = document.querySelector('.lightbox-close');
    const prevButton = document.querySelector('.lightbox-nav.prev');
    const nextButton = document.querySelector('.lightbox-nav.next');
    
    // Modal elements
    const uploadBtn = document.getElementById('upload-btn');
    const uploadModal = document.getElementById('upload-modal');
    const editModal = document.getElementById('edit-modal');
    const deleteModal = document.getElementById('delete-modal');
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    const uploadForm = document.getElementById('upload-form');
    const editForm = document.getElementById('edit-form');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    const photoFile = document.getElementById('photo-file');
    const photoPreview = document.getElementById('photo-preview');
    
    // Current item references
    let currentLightboxIndex = 0;
    let currentItemToDelete = null;
    let currentItemToEdit = null;
    
    // Filter gallery items by category
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const selectedCategory = this.getAttribute('data-filter');
            filterGallery(selectedCategory);
        });
    });
    
    function filterGallery(category) {
        let hasVisibleItems = false;
        
        galleryItems.forEach(item => {
            if (category === 'all' || item.getAttribute('data-category') === category) {
                item.style.display = 'block';
                hasVisibleItems = true;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Show or hide empty state
        galleryEmpty.style.display = hasVisibleItems ? 'none' : 'block';
    }
    
    // Search gallery items
    function searchGallery() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let hasVisibleItems = false;
        
        if (searchTerm === '') {
            // Reset filter to current active category
            const activeFilter = document.querySelector('.filter-btn.active');
            filterGallery(activeFilter.getAttribute('data-filter'));
            return;
        }
        
        galleryItems.forEach(item => {
            const title = item.querySelector('.gallery-info h3').textContent.toLowerCase();
            const description = item.querySelector('.gallery-info p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                item.style.display = 'block';
                hasVisibleItems = true;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Show or hide empty state
        galleryEmpty.style.display = hasVisibleItems ? 'none' : 'block';
    }
    
    searchButton.addEventListener('click', searchGallery);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchGallery();
        }
    });
    
    // Set up gallery item action buttons
    galleryItems.forEach((item, index) => {
        const viewBtn = item.querySelector('.view-btn');
        const editBtn = item.querySelector('.edit-btn');
        const deleteBtn = item.querySelector('.delete-btn');
        const image = item.querySelector('img');
        
        // View photo in lightbox
        viewBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            openLightbox(item, index);
        });
        
        // Also open lightbox when clicking on the image
        image.addEventListener('click', function() {
            openLightbox(item, index);
        });
        
        // Edit photo
        editBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            openEditModal(item);
        });
        
        // Delete photo
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            openDeleteModal(item);
        });
    });
    
    // Function to open lightbox
    function openLightbox(item, index) {
        currentLightboxIndex = index;
        
        const image = item.querySelector('img');
        const title = item.querySelector('.gallery-info h3').textContent;
        const description = item.querySelector('.gallery-info p').textContent;
        const date = item.querySelector('.gallery-date').textContent;
        
        lightboxImage.src = image.src;
        lightboxTitle.textContent = title;
        lightboxDescription.textContent = description;
        lightboxDate.textContent = date;
        
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    // Close lightbox
    lightboxClose.addEventListener('click', function() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto'; // Enable scrolling
    });
    
    // Close lightbox when clicking outside the content
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto'; // Enable scrolling
        }
    });
    
    // Navigate through lightbox images
    prevButton.addEventListener('click', function(e) {
        e.stopPropagation();
        navigateLightbox(-1);
    });
    
    nextButton.addEventListener('click', function(e) {
        e.stopPropagation();
        navigateLightbox(1);
    });
    
    // Keyboard navigation for lightbox
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'block') {
            if (e.key === 'ArrowLeft') {
                navigateLightbox(-1);
            } else if (e.key === 'ArrowRight') {
                navigateLightbox(1);
            } else if (e.key === 'Escape') {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto'; // Enable scrolling
            }
        }
    });
    
    // Function to navigate through lightbox images
    function navigateLightbox(direction) {
        const visibleItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
        
        if (visibleItems.length === 0) return;
        
        // Find the index in visible items
        const visibleIndex = visibleItems.findIndex(item => {
            return item.querySelector('img').src === lightboxImage.src;
        });
        
        let newIndex = visibleIndex + direction;
        
        // Loop around if out of bounds
        if (newIndex < 0) {
            newIndex = visibleItems.length - 1;
        } else if (newIndex >= visibleItems.length) {
            newIndex = 0;
        }
        
        const newItem = visibleItems[newIndex];
        const image = newItem.querySelector('img');
        const title = newItem.querySelector('.gallery-info h3').textContent;
        const description = newItem.querySelector('.gallery-info p').textContent;
        const date = newItem.querySelector('.gallery-date').textContent;
        
        lightboxImage.src = image.src;
        lightboxTitle.textContent = title;
        lightboxDescription.textContent = description;
        lightboxDate.textContent = date;
    }
    
    // Modal functions
    function openModal(modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Enable scrolling
    }
    
    // Close all modals when clicking on close button
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modals when clicking outside the content
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
    
    // Open upload modal
    uploadBtn.addEventListener('click', function() {
        // Reset form
        uploadForm.reset();
        photoPreview.innerHTML = '';
        
        openModal(uploadModal);
    });
    
    // Open edit modal
    function openEditModal(item) {
        currentItemToEdit = item;
        
        const title = item.querySelector('.gallery-info h3').textContent;
        const description = item.querySelector('.gallery-info p').textContent;
        const category = item.getAttribute('data-category');
        const date = item.querySelector('.gallery-date').textContent;
        
        // Format date for input (remove text and keep YYYY-MM-DD)
        const dateFormatted = formatDateForInput(date);
        
        // Populate form fields
        document.getElementById('edit-photo-title').value = title;
        document.getElementById('edit-photo-description').value = description;
        document.getElementById('edit-photo-category').value = category;
        document.getElementById('edit-photo-date').value = dateFormatted;
        
        openModal(editModal);
    }
    
    // Open delete modal
    function openDeleteModal(item) {
        currentItemToDelete = item;
        openModal(deleteModal);
    }
    
    // Helper function to format date for input
    function formatDateForInput(dateString) {
        // This is a simple implementation - in a real app, you'd use a more robust date parsing
        const months = {
            'January': '01', 'February': '02', 'March': '03', 'April': '04', 'May': '05', 'June': '06',
            'July': '07', 'August': '08', 'September': '09', 'October': '10', 'November': '11', 'December': '12'
        };
        
        // Extract parts from "Month DD, YYYY" format
        const parts = dateString.match(/(\w+)\s+(\d+),\s+(\d{4})/);
        
        if (parts) {
            const month = months[parts[1]];
            const day = parts[2].padStart(2, '0');
            const year = parts[3];
            
            return `${year}-${month}-${day}`;
        }
        
        // Fallback to today's date if parsing fails
        const today = new Date();
        return today.toISOString().split('T')[0];
    }
    
    // Preview uploaded image
    photoFile.addEventListener('change', function() {
        const file = this.files[0];
        
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                photoPreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    // Handle form submissions
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // In a real application, you would send this data to the server
        // For this demo, we'll just add a new item to the gallery
        
        const title = document.getElementById('photo-title').value;
        const description = document.getElementById('photo-description').value;
        const category = document.getElementById('photo-category').value;
        const date = document.getElementById('photo-date').value;
        const file = document.getElementById('photo-file').files[0];
        
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Create new gallery item
                addNewGalleryItem(title, description, category, date, e.target.result);
                
                // Close modal and reset form
                closeModal(uploadModal);
                uploadForm.reset();
                photoPreview.innerHTML = '';
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    // Handle edit form submission
    editForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!currentItemToEdit) return;
        
        // Get updated values
        const title = document.getElementById('edit-photo-title').value;
        const description = document.getElementById('edit-photo-description').value;
        const category = document.getElementById('edit-photo-category').value;
        const date = document.getElementById('edit-photo-date').value;
        
        // Format date for display
        const dateFormatted = formatDateForDisplay(date);
        
        // Update item
        currentItemToEdit.setAttribute('data-category', category);
        currentItemToEdit.querySelector('.gallery-info h3').textContent = title;
        currentItemToEdit.querySelector('.gallery-info p').textContent = description;
        currentItemToEdit.querySelector('.gallery-date').textContent = dateFormatted;
        
        // Close modal
        closeModal(editModal);
        currentItemToEdit = null;
    });
    
    // Handle delete confirmation
    confirmDeleteBtn.addEventListener('click', function() {
        if (currentItemToDelete) {
            // Remove the item from the DOM
            currentItemToDelete.remove();
            
            // Close modal
            closeModal(deleteModal);
            currentItemToDelete = null;
            
            // Check if we need to show empty state
            if (galleryGrid.children.length === 0) {
                galleryEmpty.style.display = 'block';
            }
        }
    });
    
    // Cancel delete
    cancelDeleteBtn.addEventListener('click', function() {
        closeModal(deleteModal);
        currentItemToDelete = null;
    });
    
    // Helper function to format date for display
    function formatDateForDisplay(inputDate) {
        const date = new Date(inputDate);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
    
    // Function to add a new gallery item
    function addNewGalleryItem(title, description, category, date, imageSrc) {
        // Format date for display
        const dateFormatted = formatDateForDisplay(date);
        
        // Create new gallery item
        const newItem = document.createElement('div');
        newItem.className = 'gallery-item';
        newItem.setAttribute('data-category', category);
        
        newItem.innerHTML = `
            <div class="gallery-image">
                <img src="${imageSrc}" alt="${title}">
                <div class="gallery-overlay">
                    <div class="gallery-info">
                        <h3 class="subheading">${title}</h3>
                        <p class="body-text">${description}</p>
                        <span class="gallery-date">${dateFormatted}</span>
                    </div>
                    <div class="gallery-actions">
                        <button class="gallery-action-btn view-btn"><i class="fas fa-eye"></i></button>
                        <button class="gallery-action-btn edit-btn"><i class="fas fa-edit"></i></button>
                        <button class="gallery-action-btn delete-btn"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners to the new item
        const viewBtn = newItem.querySelector('.view-btn');
        const editBtn = newItem.querySelector('.edit-btn');
        const deleteBtn = newItem.querySelector('.delete-btn');
        const image = newItem.querySelector('img');
        
        // View photo in lightbox
        viewBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            openLightbox(newItem, Array.from(galleryGrid.children).indexOf(newItem));
        });
        
        // Also open lightbox when clicking on the image
        image.addEventListener('click', function() {
            openLightbox(newItem, Array.from(galleryGrid.children).indexOf(newItem));
        });
        
        // Edit photo
        editBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            openEditModal(newItem);
        });
        
        // Delete photo
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            openDeleteModal(newItem);
        });
        
        // Add to gallery grid
        galleryGrid.appendChild(newItem);
        
        // Hide empty state if it was showing
        galleryEmpty.style.display = 'none';
    }
});
