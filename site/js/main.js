/**
 * G'Asset Co. - Main JavaScript
 * Handles core functionality: navigation, smooth scroll, form handling
 */

(function() {
  'use strict';

  // ============================================
  // DOM ELEMENTS
  // ============================================
  const header = document.querySelector('.header');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavClose = document.querySelector('.mobile-nav__close');
  const navOverlay = document.querySelector('.nav-overlay');
  const navLinks = document.querySelectorAll('.nav__link, .mobile-nav__link');

  // ============================================
  // MOBILE NAVIGATION
  // ============================================
  
  /**
   * Open mobile navigation
   */
  function openMobileNav() {
    if (mobileNav && navOverlay) {
      mobileNav.classList.add('mobile-nav--open');
      navOverlay.classList.add('nav-overlay--visible');
      document.body.style.overflow = 'hidden';
      
      // Update menu toggle state
      if (menuToggle) {
        menuToggle.classList.add('is-active');
        menuToggle.setAttribute('aria-expanded', 'true');
      }
      
      // Focus first link
      const firstLink = mobileNav.querySelector('.mobile-nav__link');
      if (firstLink) {
        firstLink.focus();
      }
    }
  }

  /**
   * Close mobile navigation
   */
  function closeMobileNav() {
    if (mobileNav && navOverlay) {
      mobileNav.classList.remove('mobile-nav--open');
      navOverlay.classList.remove('nav-overlay--visible');
      document.body.style.overflow = '';
      
      // Update menu toggle state
      if (menuToggle) {
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.focus();
      }
    }
  }

  /**
   * Toggle mobile navigation
   */
  function toggleMobileNav() {
    if (mobileNav && mobileNav.classList.contains('mobile-nav--open')) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  }

  /**
   * Initialize mobile navigation handlers
   */
  function initMobileNav() {
    if (menuToggle) {
      menuToggle.addEventListener('click', toggleMobileNav);
    }

    if (mobileNavClose) {
      mobileNavClose.addEventListener('click', closeMobileNav);
    }

    if (navOverlay) {
      navOverlay.addEventListener('click', closeMobileNav);
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('mobile-nav--open')) {
        closeMobileNav();
      }
    });

    // Close on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileNav && mobileNav.classList.contains('mobile-nav--open')) {
          closeMobileNav();
        }
      });
    });

    // Close on resize if becomes desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) {
        closeMobileNav();
      }
    });
  }

  // ============================================
  // HEADER SCROLL EFFECT
  // ============================================
  
  let lastScrollY = 0;
  let ticking = false;

  /**
   * Update header on scroll
   */
  function updateHeader() {
    const scrollY = window.scrollY;

    if (header) {
      // Add scrolled class when scrolled
      if (scrollY > 50) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }

      // Hide/show header on scroll direction (optional)
      // if (scrollY > lastScrollY && scrollY > 200) {
      //   header.classList.add('header--hidden');
      // } else {
      //   header.classList.remove('header--hidden');
      // }
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  /**
   * Initialize header scroll effect
   */
  function initHeaderScroll() {
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });

    // Initial check
    updateHeader();
  }

  // ============================================
  // SMOOTH SCROLL
  // ============================================
  
  /**
   * Smooth scroll to element
   */
  function smoothScrollTo(target, offset = 80) {
    const element = typeof target === 'string' 
      ? document.querySelector(target) 
      : target;

    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  /**
   * Initialize smooth scroll for anchor links
   */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip if just "#"
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          smoothScrollTo(target);
          
          // Update URL without scrolling
          history.pushState(null, '', href);
        }
      });
    });
  }

  // ============================================
  // ACTIVE NAVIGATION STATE
  // ============================================
  
  /**
   * Update active navigation link based on current page
   */
  function updateActiveNavLink() {
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const isDesktopNav = link.classList.contains('nav__link');
      const isMobileNav = link.classList.contains('mobile-nav__link');
      const activeClass = isDesktopNav ? 'nav__link--active' : 'mobile-nav__link--active';
      
      // Match current page
      if (href === pageName || 
          (pageName === '' && href === 'index.html') ||
          (pageName === 'index.html' && href === './')) {
        link.classList.add(activeClass);
      } else {
        link.classList.remove(activeClass);
      }
    });
  }

  // ============================================
  // FORM HANDLING
  // ============================================
  
  /**
   * Initialize contact form
   */
  function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const submitBtn = this.querySelector('[type="submit"]');
      const originalText = submitBtn.textContent;
      const formMessage = this.querySelector('.form-message');

      // Disable button and show loading
      submitBtn.disabled = true;
      submitBtn.classList.add('btn--loading');
      
      // Get form data
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);

      try {
        // Simulate form submission (replace with actual endpoint)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // For now, we'll just show success
        // In production, you would send to an API endpoint
        console.log('Form data:', data);

        // Show success message
        if (formMessage) {
          formMessage.className = 'form-message form-message--success';
          formMessage.textContent = window.i18n ? 
            window.i18n.t('contact.form.success') : 
            'Message sent successfully!';
          formMessage.style.display = 'block';
        }

        // Reset form
        this.reset();

      } catch (error) {
        console.error('Form submission error:', error);
        
        // Show error message
        if (formMessage) {
          formMessage.className = 'form-message form-message--error';
          formMessage.textContent = window.i18n ? 
            window.i18n.t('contact.form.error') : 
            'Something went wrong. Please try again.';
          formMessage.style.display = 'block';
        }
      } finally {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn--loading');
        submitBtn.textContent = originalText;

        // Hide message after 5 seconds
        setTimeout(() => {
          if (formMessage) {
            formMessage.style.display = 'none';
          }
        }, 5000);
      }
    });

    // Form validation
    const formInputs = contactForm.querySelectorAll('.form-input, .form-textarea');
    formInputs.forEach(input => {
      input.addEventListener('blur', function() {
        validateInput(this);
      });

      input.addEventListener('input', function() {
        if (this.classList.contains('form-input--error')) {
          validateInput(this);
        }
      });
    });
  }

  /**
   * Validate single input
   */
  function validateInput(input) {
    const value = input.value.trim();
    const type = input.type;
    const required = input.required;

    let isValid = true;

    // Required check
    if (required && !value) {
      isValid = false;
    }

    // Email check
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(value);
    }

    // Phone check (basic)
    if (type === 'tel' && value) {
      const phoneRegex = /^[\+]?[\d\s\-\(\)]{8,}$/;
      isValid = phoneRegex.test(value);
    }

    // Update UI
    if (isValid) {
      input.classList.remove('form-input--error');
    } else {
      input.classList.add('form-input--error');
    }

    return isValid;
  }

  // ============================================
  // WHATSAPP INTEGRATION
  // ============================================
  
  /**
   * Open WhatsApp with pre-filled message
   */
  function openWhatsApp(phoneNumber, message = '') {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  }

  /**
   * Initialize WhatsApp buttons
   */
  function initWhatsAppButtons() {
    document.querySelectorAll('[data-whatsapp]').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        const phone = button.getAttribute('data-whatsapp') || '237697654334';
        const assetName = button.getAttribute('data-asset-name');
        const lang = localStorage.getItem('gassetco_lang') || 'en';
        
        let message;
        if (assetName) {
          // Asset-specific message
          if (lang === 'fr') {
            message = `Bonjour, je suis intéressé(e) par ${assetName}. Veuillez me donner plus d'informations sur les prix et les options de paiement.`;
          } else {
            message = `Hello, I am interested in the ${assetName}. Please tell me more about pricing and payment options.`;
          }
        } else {
          // General message
          message = button.getAttribute('data-whatsapp-message') || 
            (lang === 'fr' ? 
              `Bonjour! Je suis intéressé(e) par les services de location-vente de G'Asset Co.` :
              `Hello! I'm interested in G'Asset Co.'s hire-purchase services.`
            );
        }
        
        openWhatsApp(phone, message);
      });
    });
  }

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================
  
  /**
   * Debounce function
   */
  function debounce(func, wait = 100) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  /**
   * Throttle function
   */
  function throttle(func, limit = 100) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Check if element is in viewport
   */
  function isInViewport(element, threshold = 0) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight - threshold) &&
      rect.bottom >= threshold
    );
  }

  // ============================================
  // ACCESSIBILITY
  // ============================================
  
  /**
   * Handle skip to content link
   */
  function initSkipLink() {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const mainContent = document.querySelector('#main-content, main');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  /**
   * Handle keyboard navigation
   */
  function initKeyboardNav() {
    // Tab trap for modal/mobile nav
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && mobileNav && mobileNav.classList.contains('mobile-nav--open')) {
        const focusableElements = mobileNav.querySelectorAll(
          'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
  }

  // ============================================
  // INITIALIZATION
  // ============================================
  
  /**
   * Initialize all functionality
   */
  function init() {
    // Core functionality
    initMobileNav();
    initHeaderScroll();
    initSmoothScroll();
    updateActiveNavLink();
    initContactForm();
    initWhatsAppButtons();
    
    // Accessibility
    initSkipLink();
    initKeyboardNav();

    // Listen for language changes
    document.addEventListener('languageChanged', (e) => {
      console.log('Language changed to:', e.detail.lang);
      // Re-initialize any language-dependent functionality here if needed
    });

    console.log('G\'Asset Co. main.js initialized');
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose utilities globally for other scripts
  window.GAsset = {
    smoothScrollTo,
    openWhatsApp,
    debounce,
    throttle,
    isInViewport
  };

})();
