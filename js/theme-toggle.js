/**
 * Theme Toggle Functionality
 * Allows switching between light and dark themes
 */

document.addEventListener('DOMContentLoaded', function() {
  // Get theme buttons
  const lightButton = document.getElementById('light-theme-btn');
  const darkButton = document.getElementById('dark-theme-btn');
  const scrollTopButton = document.getElementById('scroll-top-btn');
  
  // Check for saved theme preference or use default
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('body-dark');
  }
  
  // Light theme button click handler
  lightButton.addEventListener('click', function() {
    document.documentElement.classList.remove('body-dark');
    localStorage.setItem('theme', 'light');
  });
  
  // Dark theme button click handler
  darkButton.addEventListener('click', function() {
    document.documentElement.classList.add('body-dark');
    localStorage.setItem('theme', 'dark');
  });
  
  // Scroll to top button click handler
  scrollTopButton.addEventListener('click', function() {
    window.scroll({
      top: 0,
      behavior: 'smooth'
    });
  });
});
