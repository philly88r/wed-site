/**
 * Accordion FAQ Component
 * A vanilla JavaScript implementation of accordion functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  // Find all accordion headers
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  // Add click event listener to each header
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      // Get the parent accordion item
      const accordionItem = this.parentElement;
      
      // Toggle active class on the accordion item
      accordionItem.classList.toggle('active');
      
      // If this item is now active, close all other items
      if (accordionItem.classList.contains('active')) {
        accordionHeaders.forEach(otherHeader => {
          const otherItem = otherHeader.parentElement;
          if (otherItem !== accordionItem && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
          }
        });
      }
    });
  });
});
