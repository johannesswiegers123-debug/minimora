window.ecoPackaging = {
  handleToggle(isChecked, sectionId) {
    // Save to localStorage
    localStorage.setItem('eco_packaging', isChecked ? 'minimal' : 'standard');
    localStorage.setItem(`eco_packaging_${sectionId}`, isChecked ? 'minimal' : 'standard');

    // If minimal selected, apply discount on next add-to-cart
    if (isChecked) {
      localStorage.setItem('eco_packaging_apply_discount', 'true');
    } else {
      localStorage.removeItem('eco_packaging_apply_discount');
    }
  },

  // Initialize on page load
  init() {
    // Restore all saved toggle states
    const toggles = document.querySelectorAll('[data-eco-packaging-toggle]');
    toggles.forEach((toggle) => {
      const sectionId = toggle.id.split('-').pop(); // Extract section ID from element ID
      const saved = localStorage.getItem(`eco_packaging_${sectionId}`);

      if (saved === 'minimal') {
        toggle.checked = true;
      }
    });

    // Ensure all text elements are visible
    document.querySelectorAll('[data-eco-packaging-block]').forEach((block) => {
      block.style.display = 'block';
      block.style.visibility = 'visible';
      block.style.opacity = '1';
    });
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.ecoPackaging.init());
} else {
  window.ecoPackaging.init();
}

window.ecoPackaging.updateLanguage = function() {
    // Get language from localStorage (set by dashboard)
    const language = localStorage.getItem('eco_packaging_language') || 'en';

    // Show/hide language-specific text
    document.querySelectorAll('.eco-lang-en').forEach((el) => {
      el.style.display = language === 'en' ? 'block' : 'none';
    });
    document.querySelectorAll('.eco-lang-da').forEach((el) => {
      el.style.display = language === 'da' ? 'block' : 'none';
    });
  }

// Re-init on section reload
document.addEventListener('shopify:section:load', () => window.ecoPackaging.init());

// Update language when settings change
const updateLanguageListener = () => window.ecoPackaging.updateLanguage();
window.addEventListener('storage', updateLanguageListener);

// Also update on page load
window.ecoPackaging.updateLanguage();
