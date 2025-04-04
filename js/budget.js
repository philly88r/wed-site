// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Modal Elements
    const expenseModal = document.getElementById('expense-modal');
    const closeModal = document.querySelector('.close-modal');
    const addExpenseBtn = document.querySelector('.add-expense-btn');
    const expenseForm = document.getElementById('expense-form');
    
    const categoryModal = document.getElementById('category-modal');
    const closeCategoryModal = document.querySelector('.close-category-modal');
    const addCategoryBtn = document.querySelector('.add-category-btn');
    const categoryForm = document.getElementById('category-form');
    
    const budgetModal = document.getElementById('budget-modal');
    const closeBudgetModal = document.querySelector('.close-budget-modal');
    const editBudgetBtn = document.querySelector('.edit-budget-btn');
    const budgetForm = document.getElementById('budget-form');
    
    // Tab Elements
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Expense Elements
    const categoryFilter = document.getElementById('category-filter');
    const expenseSort = document.getElementById('expense-sort');
    const searchInput = document.querySelector('.expense-search input');
    const searchButton = document.querySelector('.expense-search button');
    
    const expenseItems = document.querySelectorAll('.expense-item');
    const paidCheckboxes = document.querySelectorAll('.paid-checkbox');
    const editButtons = document.querySelectorAll('.edit-expense');
    const deleteButtons = document.querySelectorAll('.delete-expense');
    
    // Category Elements
    const editCategoryButtons = document.querySelectorAll('.edit-category');
    const deleteCategoryButtons = document.querySelectorAll('.delete-category');
    
    // Export Buttons
    const exportBtn = document.querySelector('.export-btn');
    const printBtn = document.querySelector('.print-btn');
    
    // Show Expense Modal
    if (addExpenseBtn) {
        addExpenseBtn.addEventListener('click', function() {
            expenseModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
            
            // Set default date to today
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('expense-date').value = today;
        });
    }
    
    // Close Expense Modal
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            expenseModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        });
    }
    
    // Show Category Modal
    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', function() {
            categoryModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Close Category Modal
    if (closeCategoryModal) {
        closeCategoryModal.addEventListener('click', function() {
            categoryModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Show Budget Modal
    if (editBudgetBtn) {
        editBudgetBtn.addEventListener('click', function() {
            // Set current budget value
            const currentBudget = document.getElementById('total-budget-amount').textContent.replace(/,/g, '');
            document.getElementById('total-budget-input').value = currentBudget;
            
            budgetModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Close Budget Modal
    if (closeBudgetModal) {
        closeBudgetModal.addEventListener('click', function() {
            budgetModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close Modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === expenseModal) {
            expenseModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (event.target === categoryModal) {
            categoryModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (event.target === budgetModal) {
            budgetModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Tab Switching
    tabButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => content.style.display = 'none');
            
            // Show the selected tab content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).style.display = 'block';
        });
    });
    
    // Expense Form Submission
    if (expenseForm) {
        expenseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const expenseName = document.getElementById('expense-name').value;
            const expenseCategory = document.getElementById('expense-category').value;
            const expenseAmount = document.getElementById('expense-amount').value;
            const expenseDate = document.getElementById('expense-date').value;
            const expensePaid = document.getElementById('expense-paid').checked;
            
            // Format date for display
            const formattedDate = formatDate(expenseDate);
            
            // Format amount for display
            const formattedAmount = formatCurrency(expenseAmount);
            
            // Get category display name
            const categoryDisplayName = document.getElementById('expense-category').options[document.getElementById('expense-category').selectedIndex].text;
            
            // Create new expense element
            const expenseList = document.querySelector('.expense-list');
            const newExpense = document.createElement('div');
            newExpense.className = 'expense-item';
            newExpense.dataset.category = expenseCategory;
            
            // Create expense HTML
            newExpense.innerHTML = `
                <div class="expense-date">${formattedDate}</div>
                <div class="expense-name">${expenseName}</div>
                <div class="expense-category">${categoryDisplayName}</div>
                <div class="expense-amount">${formattedAmount}</div>
                <div class="expense-paid">
                    <input type="checkbox" class="paid-checkbox" ${expensePaid ? 'checked' : ''}>
                </div>
                <div class="expense-actions">
                    <button class="edit-expense"><i class="fas fa-edit"></i></button>
                    <button class="delete-expense"><i class="fas fa-trash"></i></button>
                </div>
            `;
            
            // Add the new expense to the list
            expenseList.insertBefore(newExpense, expenseList.firstChild);
            
            // Add event listeners to the new expense
            const newPaidCheckbox = newExpense.querySelector('.paid-checkbox');
            const newEditButton = newExpense.querySelector('.edit-expense');
            const newDeleteButton = newExpense.querySelector('.delete-expense');
            
            newPaidCheckbox.addEventListener('change', function() {
                updateBudgetSummary();
            });
            
            newEditButton.addEventListener('click', function() {
                // In a real app, you would populate the form with this expense's data
                alert('Edit functionality would be implemented here');
            });
            
            newDeleteButton.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this expense?')) {
                    newExpense.remove();
                    updateBudgetSummary();
                    updateCategorySummary();
                }
            });
            
            // Reset form and close modal
            expenseForm.reset();
            expenseModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Update budget summary
            updateBudgetSummary();
            updateCategorySummary();
        });
    }
    
    // Category Form Submission
    if (categoryForm) {
        categoryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const categoryName = document.getElementById('category-name').value;
            const categoryBudget = document.getElementById('category-budget').value;
            
            // Format budget for display
            const formattedBudget = formatCurrency(categoryBudget);
            
            // Create new category element
            const categoryList = document.querySelector('.category-list');
            const newCategory = document.createElement('div');
            newCategory.className = 'category-item';
            
            // Create category HTML
            newCategory.innerHTML = `
                <div class="category-details">
                    <div class="category-name">${categoryName}</div>
                    <div class="category-budget">${formattedBudget}</div>
                </div>
                <div class="category-progress">
                    <div class="progress-bar">
                        <div class="progress" style="width: 0%"></div>
                    </div>
                    <div class="progress-stats">
                        <span>$0 / ${formattedBudget}</span>
                    </div>
                </div>
                <div class="category-actions">
                    <button class="edit-category"><i class="fas fa-edit"></i></button>
                    <button class="delete-category"><i class="fas fa-trash"></i></button>
                </div>
            `;
            
            // Add the new category to the list
            categoryList.appendChild(newCategory);
            
            // Add event listeners to the new category
            const newEditButton = newCategory.querySelector('.edit-category');
            const newDeleteButton = newCategory.querySelector('.delete-category');
            
            newEditButton.addEventListener('click', function() {
                // In a real app, you would populate the form with this category's data
                alert('Edit functionality would be implemented here');
            });
            
            newDeleteButton.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this category?')) {
                    newCategory.remove();
                }
            });
            
            // Reset form and close modal
            categoryForm.reset();
            categoryModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Budget Form Submission
    if (budgetForm) {
        budgetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form value
            const totalBudget = document.getElementById('total-budget-input').value;
            
            // Format budget for display
            const formattedBudget = formatNumber(totalBudget);
            
            // Update total budget display
            document.getElementById('total-budget-amount').textContent = formattedBudget;
            
            // Reset form and close modal
            budgetForm.reset();
            budgetModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Update budget summary
            updateBudgetSummary();
        });
    }
    
    // Paid Checkbox Change
    paidCheckboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            updateBudgetSummary();
        });
    });
    
    // Edit Expense Functionality
    editButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // In a real app, you would populate the form with this expense's data
            alert('Edit functionality would be implemented here');
        });
    });
    
    // Delete Expense Functionality
    deleteButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const expenseItem = this.closest('.expense-item');
            
            if (confirm('Are you sure you want to delete this expense?')) {
                expenseItem.remove();
                updateBudgetSummary();
                updateCategorySummary();
            }
        });
    });
    
    // Edit Category Functionality
    editCategoryButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // In a real app, you would populate the form with this category's data
            alert('Edit functionality would be implemented here');
        });
    });
    
    // Delete Category Functionality
    deleteCategoryButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const categoryItem = this.closest('.category-item');
            
            if (confirm('Are you sure you want to delete this category?')) {
                categoryItem.remove();
            }
        });
    });
    
    // Category Filtering
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            const category = this.value;
            
            expenseItems.forEach(item => {
                if (category === 'all') {
                    item.style.display = 'flex';
                } else if (item.dataset.category === category) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    // Expense Sorting
    if (expenseSort) {
        expenseSort.addEventListener('change', function() {
            const sortValue = this.value;
            const expenseList = document.querySelector('.expense-list');
            const expenses = Array.from(expenseItems);
            
            expenses.sort((a, b) => {
                if (sortValue === 'date-desc') {
                    const dateA = new Date(parseDate(a.querySelector('.expense-date').textContent));
                    const dateB = new Date(parseDate(b.querySelector('.expense-date').textContent));
                    return dateB - dateA;
                } else if (sortValue === 'date-asc') {
                    const dateA = new Date(parseDate(a.querySelector('.expense-date').textContent));
                    const dateB = new Date(parseDate(b.querySelector('.expense-date').textContent));
                    return dateA - dateB;
                } else if (sortValue === 'amount-desc') {
                    const amountA = parseFloat(a.querySelector('.expense-amount').textContent.replace(/[^0-9.-]+/g, ''));
                    const amountB = parseFloat(b.querySelector('.expense-amount').textContent.replace(/[^0-9.-]+/g, ''));
                    return amountB - amountA;
                } else if (sortValue === 'amount-asc') {
                    const amountA = parseFloat(a.querySelector('.expense-amount').textContent.replace(/[^0-9.-]+/g, ''));
                    const amountB = parseFloat(b.querySelector('.expense-amount').textContent.replace(/[^0-9.-]+/g, ''));
                    return amountA - amountB;
                }
            });
            
            // Clear the list
            expenseList.innerHTML = '';
            
            // Add sorted expenses back to the list
            expenses.forEach(expense => {
                expenseList.appendChild(expense);
            });
        });
    }
    
    // Expense Search Functionality
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            searchExpenses();
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchExpenses();
            }
        });
    }
    
    // Export to CSV Functionality
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportBudgetToCSV();
        });
    }
    
    // Print Budget Functionality
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            window.print();
        });
    }
    
    // Function to search expenses
    function searchExpenses() {
        const searchTerm = searchInput.value.toLowerCase();
        
        expenseItems.forEach(item => {
            const expenseName = item.querySelector('.expense-name').textContent.toLowerCase();
            const expenseCategory = item.querySelector('.expense-category').textContent.toLowerCase();
            
            if (expenseName.includes(searchTerm) || expenseCategory.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // Function to update budget summary
    function updateBudgetSummary() {
        let totalBudget = parseFloat(document.getElementById('total-budget-amount').textContent.replace(/,/g, ''));
        let totalSpent = 0;
        
        // Calculate total spent
        document.querySelectorAll('.expense-item').forEach(item => {
            const paidCheckbox = item.querySelector('.paid-checkbox');
            if (paidCheckbox.checked) {
                const amount = parseFloat(item.querySelector('.expense-amount').textContent.replace(/[^0-9.-]+/g, ''));
                totalSpent += amount;
            }
        });
        
        // Calculate remaining budget
        const remaining = totalBudget - totalSpent;
        
        // Calculate progress percentage
        const progressPercentage = (totalSpent / totalBudget) * 100;
        
        // Update the DOM
        document.getElementById('total-spent').textContent = formatCurrency(totalSpent);
        document.getElementById('total-remaining').textContent = formatCurrency(remaining);
        document.getElementById('budget-progress-bar').style.width = `${progressPercentage}%`;
        
        // Update the reports tab if it exists
        if (document.querySelector('.report-summary')) {
            document.querySelector('.report-summary .summary-stats .summary-stat:nth-child(1) .stat-value').textContent = formatCurrency(totalBudget);
            document.querySelector('.report-summary .summary-stats .summary-stat:nth-child(2) .stat-value').textContent = formatCurrency(totalSpent);
            document.querySelector('.report-summary .summary-stats .summary-stat:nth-child(3) .stat-value').textContent = formatCurrency(remaining);
            document.querySelector('.report-summary .summary-stats .summary-stat:nth-child(4) .stat-value').textContent = `${Math.round(progressPercentage)}%`;
        }
    }
    
    // Function to update category summary
    function updateCategorySummary() {
        // Get all categories
        const categories = {
            'venue': { budget: 10000, spent: 0 },
            'catering': { budget: 5000, spent: 0 },
            'attire': { budget: 3000, spent: 0 },
            'photo': { budget: 2500, spent: 0 },
            'decor': { budget: 2000, spent: 0 },
            'music': { budget: 1500, spent: 0 },
            'misc': { budget: 1000, spent: 0 }
        };
        
        // Calculate spent amount for each category
        document.querySelectorAll('.expense-item').forEach(item => {
            const paidCheckbox = item.querySelector('.paid-checkbox');
            if (paidCheckbox.checked) {
                const category = item.dataset.category;
                const amount = parseFloat(item.querySelector('.expense-amount').textContent.replace(/[^0-9.-]+/g, ''));
                
                if (categories[category]) {
                    categories[category].spent += amount;
                }
            }
        });
        
        // Update category summaries
        for (const [category, data] of Object.entries(categories)) {
            const categorySummary = document.getElementById(`${category}-summary`);
            if (categorySummary) {
                const progressBar = categorySummary.querySelector('.progress');
                const progressPercentage = (data.spent / data.budget) * 100;
                progressBar.style.width = `${progressPercentage}%`;
            }
        }
        
        // Update category items in the categories tab
        document.querySelectorAll('.category-item').forEach(item => {
            const categoryName = item.querySelector('.category-name').textContent;
            const categoryKey = getCategoryKey(categoryName);
            
            if (categories[categoryKey]) {
                const budget = categories[categoryKey].budget;
                const spent = categories[categoryKey].spent;
                const progressPercentage = (spent / budget) * 100;
                
                item.querySelector('.progress').style.width = `${progressPercentage}%`;
                item.querySelector('.progress-stats span').textContent = `${formatCurrency(spent)} / ${formatCurrency(budget)}`;
            }
        });
        
        // Update pie chart in reports tab if it exists
        updatePieChart(categories);
    }
    
    // Function to update pie chart
    function updatePieChart(categories) {
        const pieChart = document.querySelector('.pie-chart');
        if (!pieChart) return;
        
        // Calculate total spent
        let totalSpent = 0;
        for (const data of Object.values(categories)) {
            totalSpent += data.spent;
        }
        
        // Clear existing segments
        pieChart.innerHTML = '';
        
        // Create legend container
        const legendContainer = document.querySelector('.chart-legend');
        if (legendContainer) {
            legendContainer.innerHTML = '';
        }
        
        // Colors for categories
        const colors = {
            'venue': '#ff6b6b',
            'catering': '#4ecdc4',
            'attire': '#ffbe0b',
            'photo': '#8a2be2',
            'decor': '#3498db',
            'music': '#2ecc71',
            'misc': '#f39c12'
        };
        
        // Create pie segments
        let offset = 0;
        for (const [category, data] of Object.entries(categories)) {
            if (data.spent > 0) {
                const percentage = (data.spent / totalSpent) * 100;
                const categoryName = getCategoryDisplayName(category);
                
                // Create pie segment
                const segment = document.createElement('div');
                segment.className = 'pie-segment';
                segment.style.setProperty('--percentage', percentage);
                segment.style.setProperty('--color', colors[category]);
                segment.style.setProperty('--offset', offset);
                
                const label = document.createElement('span');
                label.className = 'pie-label';
                label.textContent = categoryName;
                
                segment.appendChild(label);
                pieChart.appendChild(segment);
                
                // Create legend item
                if (legendContainer) {
                    const legendItem = document.createElement('div');
                    legendItem.className = 'legend-item';
                    
                    const legendColor = document.createElement('div');
                    legendColor.className = 'legend-color';
                    legendColor.style.backgroundColor = colors[category];
                    
                    const legendLabel = document.createElement('div');
                    legendLabel.className = 'legend-label';
                    legendLabel.textContent = `${categoryName} - ${formatCurrency(data.spent)} (${Math.round(percentage)}%)`;
                    
                    legendItem.appendChild(legendColor);
                    legendItem.appendChild(legendLabel);
                    legendContainer.appendChild(legendItem);
                }
                
                offset += percentage;
            }
        }
    }
    
    // Helper function to get category key from display name
    function getCategoryKey(displayName) {
        const mapping = {
            'Venue & Rentals': 'venue',
            'Catering & Drinks': 'catering',
            'Attire & Beauty': 'attire',
            'Photography & Video': 'photo',
            'Decor & Flowers': 'decor',
            'Music & Entertainment': 'music',
            'Miscellaneous': 'misc'
        };
        
        return mapping[displayName] || 'misc';
    }
    
    // Helper function to get category display name from key
    function getCategoryDisplayName(key) {
        const mapping = {
            'venue': 'Venue',
            'catering': 'Catering',
            'attire': 'Attire',
            'photo': 'Photo',
            'decor': 'Decor',
            'music': 'Music',
            'misc': 'Misc'
        };
        
        return mapping[key] || key;
    }
    
    // Function to export budget to CSV
    function exportBudgetToCSV() {
        let csvContent = "data:text/csv;charset=utf-8,";
        
        // Add CSV header
        csvContent += "Date,Expense,Category,Amount,Paid\n";
        
        // Add expense data
        expenseItems.forEach(item => {
            const date = item.querySelector('.expense-date').textContent;
            const name = item.querySelector('.expense-name').textContent;
            const category = item.querySelector('.expense-category').textContent;
            const amount = item.querySelector('.expense-amount').textContent;
            const paid = item.querySelector('.paid-checkbox').checked ? "Yes" : "No";
            
            csvContent += `${date},${name},${category},${amount},${paid}\n`;
        });
        
        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "wedding_budget.csv");
        document.body.appendChild(link);
        
        // Trigger download
        link.click();
        
        // Clean up
        document.body.removeChild(link);
    }
    
    // Helper function to format currency
    function formatCurrency(amount) {
        return '$' + parseFloat(amount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
    
    // Helper function to format numbers with commas
    function formatNumber(number) {
        return parseFloat(number).toLocaleString('en-US');
    }
    
    // Helper function to format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        });
    }
    
    // Helper function to parse date
    function parseDate(dateString) {
        const parts = dateString.split('/');
        // MM/DD/YYYY format
        return `${parts[2]}-${parts[0]}-${parts[1]}`;
    }
    
    // Initialize budget summary
    updateBudgetSummary();
    updateCategorySummary();
});
