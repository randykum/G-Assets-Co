/**
 * G'Asset Co. - Animations JavaScript
 * Scroll-based animations using Intersection Observer
 */

(function() {
  'use strict';

  // ============================================
  // CONFIGURATION
  // ============================================
  const CONFIG = {
    // Intersection Observer thresholds
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    
    // Animation classes
    animateClass: 'animate-on-scroll',
    visibleClass: 'is-visible',
    staggerClass: 'stagger-animation',
    
    // Counter animation
    counterDuration: 2000,
    counterEasing: 'easeOutQuart'
  };

  // ============================================
  // SCROLL ANIMATIONS (Intersection Observer)
  // ============================================
  
  /**
   * Create Intersection Observer for scroll animations
   */
  function createScrollObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(CONFIG.visibleClass);
          
          // Optionally unobserve after animation
          // observer.unobserve(entry.target);
        } else {
          // Remove class when out of view for re-animation
          // Comment this out if you want animations to only play once
          // entry.target.classList.remove(CONFIG.visibleClass);
        }
      });
    }, {
      threshold: CONFIG.threshold,
      rootMargin: CONFIG.rootMargin
    });

    return observer;
  }

  /**
   * Initialize scroll animations
   */
  function initScrollAnimations() {
    const observer = createScrollObserver();
    
    // Observe all elements with animation class
    document.querySelectorAll(`.${CONFIG.animateClass}`).forEach(element => {
      observer.observe(element);
    });

    // Observe staggered animation containers
    document.querySelectorAll(`.${CONFIG.staggerClass}`).forEach(element => {
      observer.observe(element);
    });
  }

  // ============================================
  // COUNTER ANIMATIONS
  // ============================================
  
  /**
   * Easing functions
   */
  const easings = {
    linear: t => t,
    easeOutQuart: t => 1 - Math.pow(1 - t, 4),
    easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
  };

  /**
   * Animate a counter from 0 to target value
   */
  function animateCounter(element, target, duration = CONFIG.counterDuration) {
    const start = 0;
    const startTime = performance.now();
    const easing = easings[CONFIG.counterEasing] || easings.linear;
    
    // Get suffix if any (e.g., "+", "%", "K")
    const suffix = element.getAttribute('data-counter-suffix') || '';
    const prefix = element.getAttribute('data-counter-prefix') || '';

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);
      const currentValue = Math.floor(start + (target - start) * easedProgress);

      element.textContent = prefix + currentValue.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  /**
   * Initialize counter animations
   */
  function initCounterAnimations() {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const target = parseInt(element.getAttribute('data-counter'), 10);
          const duration = parseInt(element.getAttribute('data-counter-duration'), 10) || CONFIG.counterDuration;
          
          if (!isNaN(target)) {
            animateCounter(element, target, duration);
            counterObserver.unobserve(element);
          }
        }
      });
    }, {
      threshold: 0.5
    });

    document.querySelectorAll('[data-counter]').forEach(element => {
      counterObserver.observe(element);
    });
  }

  // ============================================
  // PARALLAX EFFECTS
  // ============================================
  
  let parallaxElements = [];
  let ticking = false;

  /**
   * Update parallax positions
   */
  function updateParallax() {
    const scrollY = window.scrollY;

    parallaxElements.forEach(({ element, speed, offset }) => {
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + scrollY;
      const distance = scrollY - elementTop + offset;
      const translate = distance * speed;

      element.style.setProperty('--parallax-offset', `${translate}px`);
    });

    ticking = false;
  }

  /**
   * Request parallax update
   */
  function requestParallaxUpdate() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  /**
   * Initialize parallax effects
   */
  function initParallax() {
    document.querySelectorAll('[data-parallax]').forEach(element => {
      const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
      const offset = parseFloat(element.getAttribute('data-parallax-offset')) || 0;

      parallaxElements.push({ element, speed, offset });
    });

    if (parallaxElements.length > 0) {
      window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
      updateParallax();
    }
  }

  // ============================================
  // TYPEWRITER EFFECT
  // ============================================
  
  /**
   * Typewriter animation
   */
  function typeWriter(element, text, speed = 50, callback) {
    let index = 0;
    element.textContent = '';
    
    function type() {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        setTimeout(type, speed);
      } else if (callback) {
        callback();
      }
    }
    
    type();
  }

  /**
   * Initialize typewriter effects
   */
  function initTypewriter() {
    document.querySelectorAll('[data-typewriter]').forEach(element => {
      const text = element.getAttribute('data-typewriter') || element.textContent;
      const speed = parseInt(element.getAttribute('data-typewriter-speed'), 10) || 50;
      const delay = parseInt(element.getAttribute('data-typewriter-delay'), 10) || 0;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              typeWriter(element, text, speed);
            }, delay);
            observer.unobserve(element);
          }
        });
      }, { threshold: 0.5 });

      observer.observe(element);
    });
  }

  // ============================================
  // REVEAL ANIMATIONS
  // ============================================
  
  /**
   * Initialize reveal animations (for sections)
   */
  function initRevealAnimations() {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -10% 0px'
    });

    document.querySelectorAll('.reveal').forEach(element => {
      revealObserver.observe(element);
    });
  }

  // ============================================
  // LOADING ANIMATIONS
  // ============================================
  
  /**
   * Page load animation
   */
  function initLoadAnimation() {
    // Add loaded class to body when page is ready
    window.addEventListener('load', () => {
      document.body.classList.add('is-loaded');
      
      // Trigger hero animations
      const hero = document.querySelector('.hero');
      if (hero) {
        hero.classList.add('is-visible');
      }
    });
  }

  // ============================================
  // HOVER ANIMATIONS
  // ============================================
  
  /**
   * Initialize magnetic hover effect for buttons
   */
  function initMagneticButtons() {
    document.querySelectorAll('[data-magnetic]').forEach(button => {
      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const strength = parseFloat(button.getAttribute('data-magnetic')) || 0.3;
        
        button.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0)';
      });
    });
  }

  // ============================================
  // SCROLL PROGRESS
  // ============================================
  
  /**
   * Initialize scroll progress indicator
   */
  function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    
    if (!progressBar) return;

    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      
      progressBar.style.width = `${progress}%`;
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // ============================================
  // SMOOTH REVEAL FOR IMAGES
  // ============================================
  
  /**
   * Lazy load images with fade-in effect
   */
  function initImageReveal() {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // If it has data-src, load the image
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          
          // Add loaded class for fade-in
          img.addEventListener('load', () => {
            img.classList.add('is-loaded');
          });
          
          // If already loaded (cached)
          if (img.complete) {
            img.classList.add('is-loaded');
          }
          
          imageObserver.unobserve(img);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '100px'
    });

    document.querySelectorAll('img[data-src], .lazy-image').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // ============================================
  // INITIALIZATION
  // ============================================
  
  /**
   * Check for reduced motion preference
   */
  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Initialize all animations
   */
  function init() {
    // Skip most animations if user prefers reduced motion
    if (prefersReducedMotion()) {
      console.log('Animations: Reduced motion preferred, skipping animations');
      
      // Just show elements without animation
      document.querySelectorAll(`.${CONFIG.animateClass}`).forEach(el => {
        el.classList.add(CONFIG.visibleClass);
      });
      document.querySelectorAll(`.${CONFIG.staggerClass}`).forEach(el => {
        el.classList.add(CONFIG.visibleClass);
      });
      document.querySelectorAll('.reveal').forEach(el => {
        el.classList.add('is-revealed');
      });
      
      return;
    }

    // Initialize all animation types
    initScrollAnimations();
    initCounterAnimations();
    initParallax();
    initRevealAnimations();
    initLoadAnimation();
    initImageReveal();
    initScrollProgress();
    
    // Optional enhancements (can be disabled for performance)
    // initTypewriter();
    // initMagneticButtons();

    console.log('G\'Asset Co. animations.js initialized');
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose utilities for external use
  window.GAssetAnimations = {
    animateCounter,
    typeWriter,
    initScrollAnimations
  };

})();
