/**
 * Tempero & Sabor - Animations Module
 * 
 * Centralized animation functions using GSAP
 * Organized by sections: header, search, categories, items, cart, modals
 */

// Register ScrollTrigger plugin
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Animation configuration
const ANIM_CONFIG = {
    duration: 0.6,
    ease: 'power2.out',
    stagger: 0.1,
    reducedMotion: prefersReducedMotion
};

// ============================================
// HEADER ANIMATIONS
// ============================================

/**
 * Animate header elements on page load
 */
function animateHeaderOnLoad() {
    if (ANIM_CONFIG.reducedMotion) return;

    const logo = document.querySelector('#logo-img, .logo-text');
    const title = document.querySelector('.restaurant-name');
    const buttons = document.querySelectorAll('.header-buttons button');

    // Logo: no animation
    // Animation removed per user request

    // Title: fade-in from left
    if (title) {
        gsap.from(title, {
            opacity: 0,
            x: -30,
            duration: 0.6,
            delay: 0.4,
            ease: 'power2.out'
        });
    }

    // Buttons: fade-in with stagger
    if (buttons.length > 0) {
        gsap.from(buttons, {
            opacity: 0,
            y: -20,
            duration: 0.5,
            delay: 0.6,
            stagger: 0.1,
            ease: 'power2.out'
        });
    }
}

/**
 * Animate cart count pulse when quantity changes
 */
function animateCartCountPulse() {
    const cartCount = document.getElementById('cart-count');
    if (!cartCount || ANIM_CONFIG.reducedMotion) return;

    gsap.to(cartCount, {
        scale: 1.3,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out'
    });
}

/**
 * Animate header shrink on scroll
 */
function initHeaderShrink() {
    const header = document.querySelector('.header');
    if (!header || ANIM_CONFIG.reducedMotion) return;

    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;

                if (currentScroll > 100 && lastScroll <= 100) {
                    // Scrolling down past threshold
                    gsap.to(header, {
                        padding: '12px 20px',
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                    gsap.to('.logo-placeholder', {
                        height: '80px',
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                } else if (currentScroll <= 100 && lastScroll > 100) {
                    // Scrolling back up
                    gsap.to(header, {
                        padding: '20px',
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                    gsap.to('.logo-placeholder', {
                        height: '117px',
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }

                lastScroll = currentScroll;
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ============================================
// OPENING HOURS ANIMATIONS
// ============================================

/**
 * Animate opening hours section on load
 */
function animateOpeningHours() {
    if (ANIM_CONFIG.reducedMotion) return;

    const hoursSection = document.querySelector('.opening-hours-section');
    if (hoursSection) {
        gsap.from(hoursSection, {
            opacity: 0,
            y: -20,
            duration: 0.5,
            delay: 0.3,
            ease: 'power2.out'
        });
    }
}

/**
 * Animate status badge pulse when open
 */
function animateStatusBadgePulse() {
    const statusBadge = document.querySelector('.opening-hours-status.status-open');
    if (!statusBadge || ANIM_CONFIG.reducedMotion) return;

    gsap.to(statusBadge, {
        scale: 1.05,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out'
    });
}

// ============================================
// SEARCH ANIMATIONS
// ============================================

/**
 * Animate search bar on load
 */
function animateSearchBar() {
    if (ANIM_CONFIG.reducedMotion) return;

    const searchSection = document.querySelector('.search-section');
    if (searchSection) {
        gsap.from(searchSection, {
            opacity: 0,
            y: -30,
            duration: 0.6,
            delay: 0.5,
            ease: 'power2.out'
        });
    }

    // Input focus animation
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('focus', () => {
            gsap.to(searchInput, {
                scale: 1.02,
                boxShadow: '0 0 0 3px rgba(238, 181, 52, 0.2)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        searchInput.addEventListener('blur', () => {
            gsap.to(searchInput, {
                scale: 1,
                boxShadow: '0 0 0 0px rgba(238, 181, 52, 0)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    }

    // Clear button animation
    const searchClear = document.getElementById('search-clear');
    if (searchClear) {
        const observer = new MutationObserver(() => {
            const isVisible = searchClear.style.display !== 'none';
            if (isVisible) {
                gsap.from(searchClear, {
                    opacity: 0,
                    scale: 0,
                    duration: 0.3,
                    ease: 'back.out(1.7)'
                });
            }
        });

        observer.observe(searchClear, {
            attributes: true,
            attributeFilter: ['style']
        });
    }
}

// ============================================
// CATEGORY ANIMATIONS
// ============================================

/**
 * Animate category buttons on load with stagger
 */
function animateCategoryButtons() {
    if (ANIM_CONFIG.reducedMotion) return;

    const categoryButtons = document.querySelectorAll('.category-btn');
    if (categoryButtons.length > 0) {
        gsap.from(categoryButtons, {
            opacity: 0,
            y: 20,
            duration: 0.5,
            stagger: 0.1,
            delay: 0.6,
            ease: 'power2.out'
        });
    }
}

/**
 * Add ripple effect to category buttons on click
 */
function initCategoryRipple() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (ANIM_CONFIG.reducedMotion) return;

            // Remove existing ripple
            const existingRipple = this.querySelector('.ripple');
            if (existingRipple) {
                existingRipple.remove();
            }

            // Create ripple
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            gsap.from(ripple, {
                scale: 0,
                opacity: 0.6,
                duration: 0.6,
                ease: 'power2.out',
                onComplete: () => ripple.remove()
            });
        });
    });
}

/**
 * Animate category button active state
 */
function animateCategoryActive(button) {
    if (ANIM_CONFIG.reducedMotion) return;

    gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out'
    });
}

// ============================================
// ITEM CARD ANIMATIONS
// ============================================

/**
 * Animate item cards on load with stagger
 */
function animateItemCardsOnLoad() {
    if (ANIM_CONFIG.reducedMotion) return;

    const itemCards = document.querySelectorAll('.item-card');
    if (itemCards.length > 0) {
        gsap.from(itemCards, {
            opacity: 0,
            y: 50,
            duration: 0.6,
            stagger: 0.1,
            delay: 0.8,
            ease: 'power2.out'
        });
    }
}

/**
 * Animate item cards when filtering
 */
function animateItemCardsFilter(visibleCards, hiddenCards) {
    if (ANIM_CONFIG.reducedMotion) return;

    // Fade out hidden cards
    if (hiddenCards.length > 0) {
        gsap.to(hiddenCards, {
            opacity: 0,
            y: -20,
            duration: 0.3,
            stagger: 0.05,
            ease: 'power2.in',
            onComplete: () => {
                hiddenCards.forEach(card => {
                    card.style.display = 'none';
                });
            }
        });
    }

    // Fade in visible cards
    if (visibleCards.length > 0) {
        visibleCards.forEach(card => {
            card.style.display = '';
            gsap.from(card, {
                opacity: 0,
                y: 20,
                duration: 0.4,
                ease: 'power2.out'
            });
        });
    }
}

/**
 * Animate card when adding to cart
 */
function animateCardAddToCart(card) {
    if (ANIM_CONFIG.reducedMotion) return;

    gsap.to(card, {
        scale: 0.95,
        rotationY: 180,
        duration: 0.4,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: 1
    });
}

/**
 * Initialize scroll animations for item cards
 */
function initItemCardsScroll() {
    if (ANIM_CONFIG.reducedMotion || typeof ScrollTrigger === 'undefined') return;

    const itemCards = document.querySelectorAll('.item-card');
    
    itemCards.forEach(card => {
        gsap.from(card, {
            opacity: 0,
            y: 50,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });
}

// ============================================
// CART ANIMATIONS
// ============================================

/**
 * Animate cart sidebar opening
 */
function animateCartOpen() {
    if (ANIM_CONFIG.reducedMotion) return;

    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');

    if (cartSidebar) {
        gsap.fromTo(cartSidebar, 
            { x: '100%' },
            { x: 0, duration: 0.4, ease: 'power2.out' }
        );
    }

    if (cartOverlay) {
        gsap.fromTo(cartOverlay,
            { opacity: 0 },
            { opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
    }
}

/**
 * Animate cart sidebar closing
 */
function animateCartClose() {
    if (ANIM_CONFIG.reducedMotion) return;

    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');

    if (cartSidebar) {
        gsap.to(cartSidebar, {
            x: '100%',
            duration: 0.3,
            ease: 'power2.in'
        });
    }

    if (cartOverlay) {
        gsap.to(cartOverlay, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in'
        });
    }
}

/**
 * Animate cart item addition
 */
function animateCartItemAdd(itemElement) {
    if (ANIM_CONFIG.reducedMotion || !itemElement) return;

    gsap.from(itemElement, {
        opacity: 0,
        x: 50,
        duration: 0.4,
        ease: 'power2.out'
    });
}

/**
 * Animate cart item removal
 */
function animateCartItemRemove(itemElement, callback) {
    if (ANIM_CONFIG.reducedMotion || !itemElement) {
        if (callback) callback();
        return;
    }

    gsap.to(itemElement, {
        opacity: 0,
        x: -50,
        height: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
            if (callback) callback();
        }
    });
}

/**
 * Animate cart step transitions
 */
function animateCartStepTransition(currentStep, nextStep) {
    if (ANIM_CONFIG.reducedMotion) return;

    if (currentStep) {
        gsap.to(currentStep, {
            opacity: 0,
            x: -20,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                currentStep.style.display = 'none';
            }
        });
    }

    if (nextStep) {
        nextStep.style.display = 'flex';
        gsap.from(nextStep, {
            opacity: 0,
            x: 20,
            duration: 0.4,
            ease: 'power2.out'
        });
    }
}

// ============================================
// MODAL ANIMATIONS
// ============================================

/**
 * Animate modal opening
 */
function animateModalOpen(modal, overlay) {
    if (ANIM_CONFIG.reducedMotion) return;

    if (overlay) {
        gsap.fromTo(overlay,
            { opacity: 0 },
            { opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
    }

    if (modal) {
        modal.style.display = 'block';
        gsap.fromTo(modal,
            { opacity: 0, scale: 0.9, y: 20 },
            { 
                opacity: 1, 
                scale: 1, 
                y: 0, 
                duration: 0.4, 
                ease: 'back.out(1.7)' 
            }
        );
    }
}

/**
 * Animate modal closing
 */
function animateModalClose(modal, overlay, callback) {
    if (ANIM_CONFIG.reducedMotion) {
        if (callback) callback();
        return;
    }

    if (modal) {
        gsap.to(modal, {
            opacity: 0,
            scale: 0.9,
            y: 20,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                if (modal) modal.style.display = 'none';
                if (callback) callback();
            }
        });
    }

    if (overlay) {
        gsap.to(overlay, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in'
        });
    }
}

/**
 * Animate hours sidebar opening
 */
function animateHoursSidebarOpen() {
    if (ANIM_CONFIG.reducedMotion) return;

    const hoursSidebar = document.getElementById('hours-sidebar');
    const hoursOverlay = document.getElementById('hours-overlay');

    if (hoursOverlay) {
        gsap.fromTo(hoursOverlay,
            { opacity: 0 },
            { opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
    }

    if (hoursSidebar) {
        gsap.fromTo(hoursSidebar,
            { x: '100%' },
            { x: 0, duration: 0.4, ease: 'power2.out' }
        );
    }
}

/**
 * Animate hours sidebar closing
 */
function animateHoursSidebarClose() {
    if (ANIM_CONFIG.reducedMotion) return;

    const hoursSidebar = document.getElementById('hours-sidebar');
    const hoursOverlay = document.getElementById('hours-overlay');

    if (hoursSidebar) {
        gsap.to(hoursSidebar, {
            x: '100%',
            duration: 0.3,
            ease: 'power2.in'
        });
    }

    if (hoursOverlay) {
        gsap.to(hoursOverlay, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in'
        });
    }
}

// ============================================
// BUTTON ANIMATIONS
// ============================================

/**
 * Add press effect to buttons
 */
function initButtonPressEffect() {
    const buttons = document.querySelectorAll('button, .btn-continue, .btn-checkout, .btn-buy-now, .btn-add-cart');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (ANIM_CONFIG.reducedMotion) return;

            gsap.to(this, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: 'power2.out'
            });
        });
    });
}

/**
 * Add hover glow effect to action buttons
 */
function initButtonHoverGlow() {
    if (ANIM_CONFIG.reducedMotion) return;

    const actionButtons = document.querySelectorAll('.btn-continue, .btn-checkout, .btn-buy-now, .btn-add-cart');
    
    actionButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.05,
                boxShadow: '0 4px 12px rgba(238, 181, 52, 0.4)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        button.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// ============================================
// MICRO-INTERACTIONS
// ============================================

/**
 * Animate quantity buttons
 */
function animateQuantityChange(element) {
    if (ANIM_CONFIG.reducedMotion || !element) return;

    gsap.to(element, {
        scale: 1.2,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out'
    });
}

/**
 * Animate checkbox/radio selection
 */
function initCheckboxRadioAnimations() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"], input[type="radio"]');
    
    checkboxes.forEach(input => {
        input.addEventListener('change', function() {
            if (ANIM_CONFIG.reducedMotion) return;

            const label = this.closest('label');
            if (label) {
                gsap.to(label, {
                    scale: 0.95,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.out'
                });
            }
        });
    });
}

/**
 * Animate input focus
 */
function initInputFocusAnimations() {
    const inputs = document.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            if (ANIM_CONFIG.reducedMotion) return;

            gsap.to(this, {
                scale: 1.02,
                duration: 0.2,
                ease: 'power2.out'
            });
        });

        input.addEventListener('blur', function() {
            if (ANIM_CONFIG.reducedMotion) return;

            gsap.to(this, {
                scale: 1,
                duration: 0.2,
                ease: 'power2.out'
            });
        });
    });
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize all animations on page load
 */
function initAnimations() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setupAnimations();
        });
    } else {
        setupAnimations();
    }
}

/**
 * Setup all animations
 */
function setupAnimations() {
    // Initial load animations
    animateHeaderOnLoad();
    animateOpeningHours();
    animateSearchBar();
    
    // Initialize interactive animations
    initHeaderShrink();
    initButtonPressEffect();
    initButtonHoverGlow();
    initCheckboxRadioAnimations();
    initInputFocusAnimations();
    
    // Category animations will be called after categories are rendered
    // Item card animations will be called after items are rendered
}

// Auto-initialize
initAnimations();

// Export functions for use in script.js
window.Animations = {
    animateHeaderOnLoad,
    animateCartCountPulse,
    animateOpeningHours,
    animateStatusBadgePulse,
    animateSearchBar,
    animateCategoryButtons,
    initCategoryRipple,
    animateCategoryActive,
    animateItemCardsOnLoad,
    animateItemCardsFilter,
    animateCardAddToCart,
    initItemCardsScroll,
    animateCartOpen,
    animateCartClose,
    animateCartItemAdd,
    animateCartItemRemove,
    animateCartStepTransition,
    animateModalOpen,
    animateModalClose,
    animateHoursSidebarOpen,
    animateHoursSidebarClose,
    animateQuantityChange
};

