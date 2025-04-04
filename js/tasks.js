// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Task Modal Elements
    const taskModal = document.getElementById('task-modal');
    const closeModal = document.querySelector('.close-modal');
    const addTaskBtn = document.querySelector('.add-task-btn');
    const taskForm = document.getElementById('task-form');
    
    // Task Filtering Elements
    const categoryLinks = document.querySelectorAll('.task-categories a');
    const timelineLinks = document.querySelectorAll('.task-timeline a');
    const taskFilter = document.querySelector('.task-filter select');
    const searchInput = document.querySelector('.task-search input');
    const searchButton = document.querySelector('.task-search button');
    
    // Task Items
    const taskItems = document.querySelectorAll('.task-item');
    const taskCheckboxes = document.querySelectorAll('.task-checkbox input');
    const editButtons = document.querySelectorAll('.edit-task');
    const deleteButtons = document.querySelectorAll('.delete-task');
    
    // Show Task Modal
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', function() {
            taskModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        });
    }
    
    // Close Task Modal
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            taskModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        });
    }
    
    // Close Modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === taskModal) {
            taskModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Task Form Submission
    if (taskForm) {
        taskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const taskName = document.getElementById('task-name').value;
            const taskCategory = document.getElementById('task-category').value;
            const taskDue = document.getElementById('task-due').value;
            const taskPriority = document.getElementById('task-priority').value;
            const taskNotes = document.getElementById('task-notes').value;
            
            // Create new task element
            const taskList = document.querySelector('.task-list');
            const newTask = document.createElement('div');
            newTask.className = 'task-item';
            newTask.dataset.category = taskCategory;
            
            // Format the due date
            const dueDate = new Date(taskDue);
            const formattedDate = dueDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
            
            // Set the timeline based on the due date
            const today = new Date();
            const diffTime = dueDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            let timeline = '';
            if (diffDays <= 0) {
                timeline = 'day';
            } else if (diffDays <= 7) {
                timeline = 'week';
            } else if (diffDays <= 30) {
                timeline = '1month';
            } else if (diffDays <= 90) {
                timeline = '3months';
            } else if (diffDays <= 180) {
                timeline = '6months';
            } else if (diffDays <= 270) {
                timeline = '9months';
            } else {
                timeline = '12months';
            }
            
            newTask.dataset.timeline = timeline;
            
            // Create task HTML
            newTask.innerHTML = `
                <div class="task-checkbox">
                    <input type="checkbox">
                </div>
                <div class="task-name">${taskName}</div>
                <div class="task-category">${document.getElementById('task-category').options[document.getElementById('task-category').selectedIndex].text}</div>
                <div class="task-due">${formattedDate}</div>
                <div class="task-priority ${taskPriority}">${taskPriority.charAt(0).toUpperCase() + taskPriority.slice(1)}</div>
                <div class="task-actions">
                    <button class="edit-task"><i class="fas fa-edit"></i></button>
                    <button class="delete-task"><i class="fas fa-trash"></i></button>
                </div>
            `;
            
            // Add the new task to the list
            taskList.insertBefore(newTask, taskList.firstChild);
            
            // Add event listeners to the new task
            const newCheckbox = newTask.querySelector('.task-checkbox input');
            const newEditButton = newTask.querySelector('.edit-task');
            const newDeleteButton = newTask.querySelector('.delete-task');
            
            newCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    newTask.style.opacity = '0.6';
                    newTask.querySelector('.task-name').style.textDecoration = 'line-through';
                } else {
                    newTask.style.opacity = '1';
                    newTask.querySelector('.task-name').style.textDecoration = 'none';
                }
            });
            
            newEditButton.addEventListener('click', function() {
                // In a real app, you would populate the form with this task's data
                alert('Edit functionality would be implemented here');
            });
            
            newDeleteButton.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this task?')) {
                    newTask.remove();
                }
            });
            
            // Reset form and close modal
            taskForm.reset();
            taskModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Task Checkbox Functionality
    taskCheckboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            const taskItem = this.closest('.task-item');
            
            if (this.checked) {
                taskItem.style.opacity = '0.6';
                taskItem.querySelector('.task-name').style.textDecoration = 'line-through';
            } else {
                taskItem.style.opacity = '1';
                taskItem.querySelector('.task-name').style.textDecoration = 'none';
            }
        });
    });
    
    // Edit Task Functionality
    editButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // In a real app, you would populate the form with this task's data
            alert('Edit functionality would be implemented here');
        });
    });
    
    // Delete Task Functionality
    deleteButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const taskItem = this.closest('.task-item');
            
            if (confirm('Are you sure you want to delete this task?')) {
                taskItem.remove();
            }
        });
    });
    
    // Category Filtering
    categoryLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            categoryLinks.forEach(link => link.parentElement.classList.remove('active'));
            
            // Add active class to clicked link
            this.parentElement.classList.add('active');
            
            const category = this.getAttribute('href').substring(1);
            
            // Show all tasks if "All Tasks" is selected
            if (category === 'all') {
                taskItems.forEach(item => {
                    item.style.display = 'flex';
                });
            } else {
                // Filter tasks by category
                taskItems.forEach(item => {
                    if (item.dataset.category === category) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }
        });
    });
    
    // Timeline Filtering
    timelineLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            timelineLinks.forEach(link => link.parentElement.classList.remove('active'));
            
            // Add active class to clicked link
            this.parentElement.classList.add('active');
            
            const timeline = this.getAttribute('href').substring(1);
            
            // Filter tasks by timeline
            taskItems.forEach(item => {
                if (item.dataset.timeline === timeline) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Task Status Filtering
    if (taskFilter) {
        taskFilter.addEventListener('change', function() {
            const status = this.value;
            
            taskItems.forEach(item => {
                const checkbox = item.querySelector('.task-checkbox input');
                
                if (status === 'all') {
                    item.style.display = 'flex';
                } else if (status === 'completed' && checkbox.checked) {
                    item.style.display = 'flex';
                } else if (status === 'pending' && !checkbox.checked) {
                    item.style.display = 'flex';
                } else if (status === 'overdue') {
                    // Check if task is overdue
                    const dueText = item.querySelector('.task-due').textContent;
                    const dueDate = new Date(dueText);
                    const today = new Date();
                    
                    if (dueDate < today && !checkbox.checked) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    // Task Search Functionality
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            searchTasks();
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchTasks();
            }
        });
    }
    
    function searchTasks() {
        const searchTerm = searchInput.value.toLowerCase();
        
        taskItems.forEach(item => {
            const taskName = item.querySelector('.task-name').textContent.toLowerCase();
            const taskCategory = item.querySelector('.task-category').textContent.toLowerCase();
            
            if (taskName.includes(searchTerm) || taskCategory.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // Set "All Tasks" as active by default
    document.querySelector('.task-categories li:first-child').classList.add('active');
});
