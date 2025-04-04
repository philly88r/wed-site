// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Guest Modal Elements
    const guestModal = document.getElementById('guest-modal');
    const closeModal = document.querySelector('.close-modal');
    const addGuestBtn = document.querySelector('.add-guest-btn');
    const guestForm = document.getElementById('guest-form');
    
    // Group Modal Elements
    const groupModal = document.getElementById('group-modal');
    const closeGroupModal = document.querySelector('.close-group-modal');
    const addGroupBtn = document.querySelector('.add-group-btn');
    const groupForm = document.getElementById('group-form');
    
    // Guest Filtering Elements
    const groupLinks = document.querySelectorAll('.guest-groups a');
    const guestFilter = document.querySelector('.guest-filter select');
    const searchInput = document.querySelector('.guest-search input');
    const searchButton = document.querySelector('.guest-search button');
    
    // Guest Items
    const guestItems = document.querySelectorAll('.guest-item');
    const rsvpSelects = document.querySelectorAll('.rsvp-select');
    const mealSelects = document.querySelectorAll('.meal-select');
    const editButtons = document.querySelectorAll('.edit-guest');
    const deleteButtons = document.querySelectorAll('.delete-guest');
    
    // Export Buttons
    const exportBtn = document.querySelector('.export-btn');
    const printBtn = document.querySelector('.print-btn');
    
    // Show Guest Modal
    if (addGuestBtn) {
        addGuestBtn.addEventListener('click', function() {
            guestModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        });
    }
    
    // Close Guest Modal
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            guestModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        });
    }
    
    // Show Group Modal
    if (addGroupBtn) {
        addGroupBtn.addEventListener('click', function() {
            groupModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        });
    }
    
    // Close Group Modal
    if (closeGroupModal) {
        closeGroupModal.addEventListener('click', function() {
            groupModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        });
    }
    
    // Close Modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === guestModal) {
            guestModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (event.target === groupModal) {
            groupModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Guest Form Submission
    if (guestForm) {
        guestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const guestName = document.getElementById('guest-name').value;
            const guestEmail = document.getElementById('guest-email').value;
            const guestPhone = document.getElementById('guest-phone').value;
            const guestGroup = document.getElementById('guest-group').value;
            const guestRsvp = document.getElementById('guest-rsvp').value;
            const guestMeal = document.getElementById('guest-meal').value;
            
            // Create new guest element
            const guestList = document.querySelector('.guest-list');
            const newGuest = document.createElement('div');
            newGuest.className = 'guest-item';
            newGuest.dataset.group = guestGroup;
            
            // Create guest HTML
            newGuest.innerHTML = `
                <div class="guest-name">${guestName}</div>
                <div class="guest-email">${guestEmail}</div>
                <div class="guest-phone">${guestPhone}</div>
                <div class="guest-group">${document.getElementById('guest-group').options[document.getElementById('guest-group').selectedIndex].text}</div>
                <div class="guest-rsvp">
                    <select class="rsvp-select">
                        <option value="awaiting" ${guestRsvp === 'awaiting' ? 'selected' : ''}>Awaiting</option>
                        <option value="attending" ${guestRsvp === 'attending' ? 'selected' : ''}>Attending</option>
                        <option value="declined" ${guestRsvp === 'declined' ? 'selected' : ''}>Declined</option>
                    </select>
                </div>
                <div class="guest-meal">
                    <select class="meal-select">
                        <option value="" ${guestMeal === '' ? 'selected' : ''}>Not Selected</option>
                        <option value="beef" ${guestMeal === 'beef' ? 'selected' : ''}>Beef</option>
                        <option value="chicken" ${guestMeal === 'chicken' ? 'selected' : ''}>Chicken</option>
                        <option value="fish" ${guestMeal === 'fish' ? 'selected' : ''}>Fish</option>
                        <option value="vegetarian" ${guestMeal === 'vegetarian' ? 'selected' : ''}>Vegetarian</option>
                    </select>
                </div>
                <div class="guest-actions">
                    <button class="edit-guest"><i class="fas fa-edit"></i></button>
                    <button class="delete-guest"><i class="fas fa-trash"></i></button>
                </div>
            `;
            
            // Add the new guest to the list
            guestList.insertBefore(newGuest, guestList.firstChild);
            
            // Add event listeners to the new guest
            const newRsvpSelect = newGuest.querySelector('.rsvp-select');
            const newEditButton = newGuest.querySelector('.edit-guest');
            const newDeleteButton = newGuest.querySelector('.delete-guest');
            
            newRsvpSelect.addEventListener('change', function() {
                updateGuestSummary();
            });
            
            newEditButton.addEventListener('click', function() {
                // In a real app, you would populate the form with this guest's data
                alert('Edit functionality would be implemented here');
            });
            
            newDeleteButton.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this guest?')) {
                    newGuest.remove();
                    updateGuestSummary();
                }
            });
            
            // Reset form and close modal
            guestForm.reset();
            guestModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Update guest summary
            updateGuestSummary();
        });
    }
    
    // Group Form Submission
    if (groupForm) {
        groupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const groupName = document.getElementById('group-name').value;
            
            // Create new group element
            const groupList = document.querySelector('.guest-groups ul');
            const newGroup = document.createElement('li');
            
            // Create group HTML
            newGroup.innerHTML = `<a href="#${groupName.toLowerCase().replace(/\s+/g, '-')}">${groupName}</a>`;
            
            // Add the new group to the list
            groupList.appendChild(newGroup);
            
            // Add event listener to the new group
            const newGroupLink = newGroup.querySelector('a');
            newGroupLink.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all links
                groupLinks.forEach(link => link.parentElement.classList.remove('active'));
                
                // Add active class to clicked link
                this.parentElement.classList.add('active');
                
                const group = this.getAttribute('href').substring(1);
                
                // Filter guests by group
                filterGuestsByGroup(group);
            });
            
            // Reset form and close modal
            groupForm.reset();
            groupModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // RSVP Select Change
    rsvpSelects.forEach(function(select) {
        select.addEventListener('change', function() {
            updateGuestSummary();
        });
    });
    
    // Edit Guest Functionality
    editButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // In a real app, you would populate the form with this guest's data
            alert('Edit functionality would be implemented here');
        });
    });
    
    // Delete Guest Functionality
    deleteButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const guestItem = this.closest('.guest-item');
            
            if (confirm('Are you sure you want to delete this guest?')) {
                guestItem.remove();
                updateGuestSummary();
            }
        });
    });
    
    // Group Filtering
    groupLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            groupLinks.forEach(link => link.parentElement.classList.remove('active'));
            
            // Add active class to clicked link
            this.parentElement.classList.add('active');
            
            const group = this.getAttribute('href').substring(1);
            
            // Filter guests by group
            filterGuestsByGroup(group);
        });
    });
    
    // RSVP Status Filtering
    if (guestFilter) {
        guestFilter.addEventListener('change', function() {
            const status = this.value;
            
            guestItems.forEach(item => {
                const rsvpSelect = item.querySelector('.rsvp-select');
                
                if (status === 'all') {
                    item.style.display = 'flex';
                } else if (status === 'attending' && rsvpSelect.value === 'attending') {
                    item.style.display = 'flex';
                } else if (status === 'declined' && rsvpSelect.value === 'declined') {
                    item.style.display = 'flex';
                } else if (status === 'awaiting' && rsvpSelect.value === 'awaiting') {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    // Guest Search Functionality
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            searchGuests();
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchGuests();
            }
        });
    }
    
    // Export to CSV Functionality
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportGuestsToCSV();
        });
    }
    
    // Print Guest List Functionality
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            window.print();
        });
    }
    
    // Function to filter guests by group
    function filterGuestsByGroup(group) {
        // Show all guests if "All Guests" is selected
        if (group === 'all') {
            guestItems.forEach(item => {
                item.style.display = 'flex';
            });
        } else {
            // Filter guests by group
            guestItems.forEach(item => {
                if (item.dataset.group === group) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        }
    }
    
    // Function to search guests
    function searchGuests() {
        const searchTerm = searchInput.value.toLowerCase();
        
        guestItems.forEach(item => {
            const guestName = item.querySelector('.guest-name').textContent.toLowerCase();
            const guestEmail = item.querySelector('.guest-email').textContent.toLowerCase();
            const guestPhone = item.querySelector('.guest-phone').textContent.toLowerCase();
            
            if (guestName.includes(searchTerm) || guestEmail.includes(searchTerm) || guestPhone.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // Function to update guest summary
    function updateGuestSummary() {
        let totalInvited = document.querySelectorAll('.guest-item').length;
        let totalAttending = 0;
        let totalDeclined = 0;
        let totalAwaiting = 0;
        
        document.querySelectorAll('.rsvp-select').forEach(select => {
            if (select.value === 'attending') {
                totalAttending++;
            } else if (select.value === 'declined') {
                totalDeclined++;
            } else {
                totalAwaiting++;
            }
        });
        
        document.getElementById('total-invited').textContent = totalInvited;
        document.getElementById('total-attending').textContent = totalAttending;
        document.getElementById('total-declined').textContent = totalDeclined;
        document.getElementById('total-awaiting').textContent = totalAwaiting;
    }
    
    // Function to export guests to CSV
    function exportGuestsToCSV() {
        let csvContent = "data:text/csv;charset=utf-8,";
        
        // Add CSV header
        csvContent += "Name,Email,Phone,Group,RSVP Status,Meal Choice\n";
        
        // Add guest data
        guestItems.forEach(item => {
            const name = item.querySelector('.guest-name').textContent;
            const email = item.querySelector('.guest-email').textContent;
            const phone = item.querySelector('.guest-phone').textContent;
            const group = item.querySelector('.guest-group').textContent;
            const rsvp = item.querySelector('.rsvp-select').value;
            const meal = item.querySelector('.meal-select').value;
            
            csvContent += `${name},${email},${phone},${group},${rsvp},${meal}\n`;
        });
        
        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "wedding_guest_list.csv");
        document.body.appendChild(link);
        
        // Trigger download
        link.click();
        
        // Clean up
        document.body.removeChild(link);
    }
    
    // Initialize guest summary
    updateGuestSummary();
    
    // Set "All Guests" as active by default
    document.querySelector('.guest-groups li:first-child').classList.add('active');
});
