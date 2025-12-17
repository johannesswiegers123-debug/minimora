/**
 * Eco Packaging Cart Module
 * Handles toggle state, persistence, and discount application for side cart
 * 
 * Features:
 * - localStorage + cart attribute persistence
 * - Automatic discount code application
 * - Debounced updates
 * - Real-time UI sync
 * - Eligibility checking
 */

class EcoPackaging {
  constructor() {
    this.config = this.loadConfig();
    this.updateDebounceTimer = null;
    this.applyDiscountDebounceTimer = null;
    this.isUpdating = false;
    this.lastAppliedChoice = null;
    
    this.selectors = {
      container: '[data-eco-packaging-container]',
      radioInputs: '[data-eco-packaging-choice]',
      badge: '[data-eco-packaging-badge]',
      loading: '[data-eco-packaging-loading]',
      status: '[data-eco-packaging-status]',
      statusText: '[data-eco-packaging-status-text]',
      cartDrawer: '[data-cart-drawer]', // Dawn theme
      cartSidebar: '.cart-drawer', // Fallback selectors
    };

    this.init();
  }

  /**
   * Load config from JSON in page (supports multiple sections)
   */
  loadConfig() {
    // Try new section-based config first
    const sectionConfigs = document.querySelectorAll('[id^="eco-packaging-config-"]');
    if (sectionConfigs.length > 0) {
      const configEl = sectionConfigs[0]; // Use first if multiple
      try {
        return JSON.parse(configEl.textContent);
      } catch (e) {
        console.warn('eco-packaging: Config parse error');
      }
    }

    // Fallback to legacy config
    const configEl = document.getElementById('eco-packaging-config');
    if (!configEl) {
      return {
        discountCode: 'ECO5',
        discountPercentage: 5,
        excludeProductTags: ['no_eco_discount'],
        excludeProductTypes: ['gift_card'],
        debug: false,
      };
    }

    return JSON.parse(configEl.textContent);
  }

  /**
   * Initialize module and attach event listeners
   */
  init() {
    const container = document.querySelector(this.selectors.container);
    if (!container) {
      console.warn('eco-packaging: Container not found');
      return;
    }

    // Check if this is product page or cart
    this.isProductPage = this.config.isProductPage || false;

    // Restore choice from localStorage
    this.restoreState();

    // Attach radio input listeners
    const radioInputs = container.querySelectorAll(this.selectors.radioInputs);
    radioInputs.forEach(radio => {
      radio.addEventListener('change', (e) => this.handleChoiceChange(e));
    });

    if (this.isProductPage) {
      // Product page: intercept add-to-cart to apply discount
      this.setupProductPageIntercept();
    } else {
      // Cart drawer: listen for cart updates
      document.addEventListener('cart:updated', () => this.onCartUpdated());
      document.addEventListener('shopify:cart:update', () => this.onCartUpdated());
      document.addEventListener('shopify:section:load', () => this.onCartUpdated());
      setInterval(() => this.syncStateWithCart(), 5000);
    }

    if (this.config.debug) console.log('eco-packaging initialized', this.config);
  }

  /**
   * Setup product page add-to-cart interception
   */
  setupProductPageIntercept() {
    // Listen for product add event
    document.addEventListener('shopify:product:add', async (e) => {
      const choice = localStorage.getItem('eco_packaging');
      if (choice === 'minimal') {
        await this.applyDiscount();
      }
    });

    // Fallback: intercept add button click
    const addButton = document.querySelector('[name="add"]');
    if (addButton) {
      const originalClick = addButton.onclick;
      addButton.addEventListener('click', async (e) => {
        const choice = localStorage.getItem('eco_packaging');
        if (choice === 'minimal') {
          e.preventDefault();
          e.stopPropagation();
          
          // Add to cart first
          const form = addButton.closest('form');
          if (form) {
            const formData = new FormData(form);
            await fetch('/cart/add.js', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(Object.fromEntries(formData))
            });
          }
          
          // Then apply discount
          await this.applyDiscount();
          
          // Redirect to cart
          setTimeout(() => window.location.href = '/cart', 500);
        }
      });
    }
  }

  /**
   * Load and apply persisted state
   */
  async restoreState() {
    try {
      if (this.isProductPage) {
        // Product page: just restore from localStorage
        const savedChoice = localStorage.getItem('eco_packaging');
        if (savedChoice) {
          this.setChoice(savedChoice, false);
        }
      } else {
        // Cart page: restore from cart or localStorage
        const cart = await this.fetchCart();
        const savedChoice = cart.attributes?.eco_packaging || localStorage.getItem('eco_packaging');
        
        if (savedChoice) {
          this.setChoice(savedChoice, false);
          this.updateUIState(savedChoice, cart);
        }
      }
    } catch (error) {
      console.error('eco-packaging: Error restoring state:', error);
    }
  }

  /**
   * Handle radio input change
   */
  async handleChoiceChange(e) {
    const choice = e.target.value;
    
    if (this.isProductPage) {
      // Product page: just save choice, don't apply discount yet
      this.setChoice(choice);
      return;
    }

    // Cart page: apply immediately
    if (this.isUpdating) {
      console.warn('eco-packaging: Update already in progress');
      return;
    }

    this.setChoice(choice);
    await this.applyChoice(choice);
  }

  /**
   * Set local choice (UI + localStorage)
   */
  setChoice(choice, saveLocal = true) {
    const container = document.querySelector(this.selectors.container);
    if (!container) return;

    // Update radio inputs
    container.querySelectorAll(this.selectors.radioInputs).forEach(radio => {
      radio.checked = radio.value === choice;
    });

    // Update badge visibility
    const badge = container.querySelector(this.selectors.badge);
    if (badge) {
      badge.style.display = choice === 'minimal' ? 'inline-block' : 'none';
    }

    if (saveLocal) {
      localStorage.setItem('eco_packaging', choice);
    }

    this.lastAppliedChoice = choice;
  }

  /**
   * Apply choice: update cart attribute + apply/remove discount
   */
  async applyChoice(choice) {
    if (this.isUpdating) return;
    
    this.isUpdating = true;
    this.showLoading(true);

    try {
      // Step 1: Update cart attribute
      await this.updateCartAttribute(choice);

      // Step 2: Apply or remove discount
      if (choice === 'minimal') {
        await this.applyDiscount();
      } else {
        await this.removeDiscount();
      }

      // Step 3: Refresh cart data
      const cart = await this.fetchCart();
      this.updateUIState(choice, cart);

      // Step 4: Trigger cart update event for theme to re-render
      this.emitCartUpdate();

      if (this.config.debug) console.log(`eco-packaging: Applied choice "${choice}"`);
    } catch (error) {
      console.error('eco-packaging: Error applying choice:', error);
      this.showStatus(`Error: ${error.message}`, 'error');
    } finally {
      this.isUpdating = false;
      this.showLoading(false);
    }
  }

  /**
   * Update cart attribute via /cart/update.js
   */
  async updateCartAttribute(choice) {
    const response = await fetch('/cart/update.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        attributes: {
          eco_packaging: choice,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Cart update failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Apply discount code via /discount endpoint
   */
  async applyDiscount() {
    const code = this.config.discountCode;

    // Debounce discount application
    clearTimeout(this.applyDiscountDebounceTimer);

    return new Promise((resolve) => {
      this.applyDiscountDebounceTimer = setTimeout(async () => {
        try {
          const response = await fetch(`/discount/${code}`, {
            method: 'POST',
          });

          if (!response.ok && response.status !== 404) {
            // 404 = code doesn't exist or already applied; that's OK
            console.warn(`eco-packaging: Could not apply discount "${code}"`);
          }

          // Refresh cart after discount
          await this.fetchCart();
          resolve();
        } catch (error) {
          console.warn(`eco-packaging: Discount application error:`, error);
          resolve(); // Don't fail the whole flow
        }
      }, 300);
    });
  }

  /**
   * Remove discount code
   */
  async removeDiscount() {
    const code = this.config.discountCode;

    return fetch('/cart/update.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        discount: '', // Remove discount
      }),
    })
      .then((res) => res.json())
      .catch((err) => {
        console.warn(`eco-packaging: Error removing discount:`, err);
      });
  }

  /**
   * Fetch cart data
   */
  async fetchCart() {
    const response = await fetch('/cart.js');
    if (!response.ok) throw new Error('Cart fetch failed');
    return response.json();
  }

  /**
   * Update UI based on cart state and choice
   */
  updateUIState(choice, cart = null) {
    const container = document.querySelector(this.selectors.container);
    if (!container) return;

    const status = container.querySelector(this.selectors.status);
    const statusText = container.querySelector(this.selectors.statusText);

    // Check eligibility
    const eligibility = this.checkEligibility(cart);

    if (!eligibility.isEligible && choice === 'minimal') {
      status.style.display = 'block';
      statusText.textContent = eligibility.reason;
    } else {
      status.style.display = 'none';
    }

    // Update badge
    const badge = container.querySelector(this.selectors.badge);
    if (badge) {
      badge.style.display = choice === 'minimal' ? 'inline-block' : 'none';
    }
  }

  /**
   * Check if cart is eligible for discount
   */
  checkEligibility(cart) {
    if (!cart || !cart.items || cart.items.length === 0) {
      return {
        isEligible: true, // Allow selection even with empty cart
        reason: '',
      };
    }

    const excludeTags = this.config.excludeProductTags || [];
    const excludeTypes = this.config.excludeProductTypes || [];

    const eligibleItems = cart.items.filter((item) => {
      // Exclude by type
      if (
        excludeTypes.some((type) =>
          item.product_type?.toLowerCase().includes(type.toLowerCase())
        )
      ) {
        return false;
      }

      // Exclude by tag
      if (
        item.properties?.some((tag) =>
          excludeTags.some((exclude) => tag.includes(exclude))
        ) ||
        item.variant_title?.includes('no_eco_discount')
      ) {
        return false;
      }

      return true;
    });

    if (eligibleItems.length === 0) {
      return {
        isEligible: false,
        reason: 'Discount not available for items in your cart',
      };
    }

    return { isEligible: true, reason: '' };
  }

  /**
   * Sync state when cart updates
   */
  async onCartUpdated() {
    try {
      const cart = await this.fetchCart();
      const savedChoice = cart.attributes?.eco_packaging || localStorage.getItem('eco_packaging');

      if (savedChoice && savedChoice !== this.lastAppliedChoice) {
        this.setChoice(savedChoice, false);
        this.updateUIState(savedChoice, cart);
      }
    } catch (error) {
      console.error('eco-packaging: Error syncing state:', error);
    }
  }

  /**
   * Sync state periodically
   */
  async syncStateWithCart() {
    try {
      const cart = await this.fetchCart();
      const cartChoice = cart.attributes?.eco_packaging;

      if (cartChoice && cartChoice !== this.lastAppliedChoice) {
        this.onCartUpdated();
      }
    } catch (error) {
      // Silently fail on periodic sync
    }
  }

  /**
   * Show/hide loading state
   */
  showLoading(show) {
    const container = document.querySelector(this.selectors.container);
    if (!container) return;

    const loading = container.querySelector(this.selectors.loading);
    if (loading) {
      loading.style.display = show ? 'block' : 'none';
    }
  }

  /**
   * Show status message
   */
  showStatus(message, type = 'info') {
    const container = document.querySelector(this.selectors.container);
    if (!container) return;

    const status = container.querySelector(this.selectors.status);
    const statusText = container.querySelector(this.selectors.statusText);

    if (status && statusText) {
      statusText.textContent = message;
      status.className = `eco-packaging-status eco-packaging-status--${type}`;
      status.style.display = 'block';

      if (type !== 'error') {
        setTimeout(() => {
          status.style.display = 'none';
        }, 4000);
      }
    }
  }

  /**
   * Emit cart update event for theme JS to listen to
   */
  emitCartUpdate() {
    // Trigger common Shopify theme events
    const events = [
      'cart:updated',
      'shopify:cart:update',
      'cart-drawer:updated',
    ];

    events.forEach((event) => {
      document.dispatchEvent(new CustomEvent(event, { detail: { source: 'eco-packaging' } }));
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.ecoPackaging = new EcoPackaging();
  });
} else {
  window.ecoPackaging = new EcoPackaging();
}

// Re-init on cart drawer open (for themes that clone/replace cart HTML)
document.addEventListener('cart-drawer:open', () => {
  if (!window.ecoPackaging) {
    window.ecoPackaging = new EcoPackaging();
  } else {
    window.ecoPackaging.restoreState();
  }
});
