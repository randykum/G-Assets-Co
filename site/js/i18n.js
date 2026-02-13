/**
 * G'Asset - Internationalization (i18n) System
 * Handles bilingual content (English/French) with localStorage persistence
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    defaultLang: 'en',
    supportedLangs: ['en', 'fr'],
    storageKey: 'gasset_lang',
    langPath: 'lang/',
    dataAttribute: 'data-i18n',
    htmlAttribute: 'data-i18n-html'
  };

  // State
  let currentLang = CONFIG.defaultLang;
  let translations = {};
  let isLoaded = false;

  /**
   * Detect user's preferred language
   * Priority: localStorage > browser language > default
   */
  function detectLanguage() {
    // Check localStorage first
    const stored = localStorage.getItem(CONFIG.storageKey);
    if (stored && CONFIG.supportedLangs.includes(stored)) {
      return stored;
    }

    // Check browser language
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang) {
      const shortLang = browserLang.split('-')[0].toLowerCase();
      if (CONFIG.supportedLangs.includes(shortLang)) {
        return shortLang;
      }
    }

    // Check if we're in Cameroon (likely French)
    // This is a fallback heuristic
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone && timezone.includes('Africa/Douala')) {
      return 'fr';
    }

    return CONFIG.defaultLang;
  }

  /**
   * Load translation file
   */
  async function loadTranslations(lang) {
    try {
      const response = await fetch(`${CONFIG.langPath}${lang}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${lang} translations`);
      }
      return await response.json();
    } catch (error) {
      console.error('i18n: Error loading translations:', error);
      
      // Fallback to default language if not already trying it
      if (lang !== CONFIG.defaultLang) {
        console.log(`i18n: Falling back to ${CONFIG.defaultLang}`);
        return loadTranslations(CONFIG.defaultLang);
      }
      
      return {};
    }
  }

  /**
   * Get nested value from object using dot notation
   * e.g., getNestedValue(obj, 'hero.title') returns obj.hero.title
   */
  function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  /**
   * Translate a single key
   */
  function t(key, fallback = '') {
    const value = getNestedValue(translations, key);
    return value !== null ? value : fallback || key;
  }

  /**
   * Update all elements with data-i18n attribute
   */
  function updatePageTranslations() {
    // Update text content
    document.querySelectorAll(`[${CONFIG.dataAttribute}]`).forEach(element => {
      const key = element.getAttribute(CONFIG.dataAttribute);
      const translation = t(key);
      if (translation) {
        element.textContent = translation;
      }
    });

    // Update HTML content (for elements with markup like <span>)
    document.querySelectorAll(`[${CONFIG.htmlAttribute}]`).forEach(element => {
      const key = element.getAttribute(CONFIG.htmlAttribute);
      const translation = t(key);
      if (translation) {
        element.innerHTML = translation;
      }
    });

    // Update placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      const translation = t(key);
      if (translation) {
        element.placeholder = translation;
      }
    });

    // Update aria-label attributes
    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
      const key = element.getAttribute('data-i18n-aria');
      const translation = t(key);
      if (translation) {
        element.setAttribute('aria-label', translation);
      }
    });

    // Update title attributes
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      const translation = t(key);
      if (translation) {
        element.title = translation;
      }
    });

    // Update document title if specified
    const pageTitle = document.querySelector('[data-i18n-page-title]');
    if (pageTitle) {
      const key = pageTitle.getAttribute('data-i18n-page-title');
      const title = t(key);
      if (title) {
        document.title = `${title} | G'Asset`;
      }
    }

    // Update HTML lang attribute
    document.documentElement.lang = currentLang;

    // Update language toggle UI
    updateLanguageToggle();

    // Dispatch event for other scripts
    document.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { lang: currentLang, translations }
    }));
  }

  /**
   * Update language toggle button state
   */
  function updateLanguageToggle() {
    const toggleOptions = document.querySelectorAll('.lang-toggle__option');
    toggleOptions.forEach(option => {
      const lang = option.getAttribute('data-lang');
      option.classList.toggle('lang-toggle__option--active', lang === currentLang);
    });
  }

  /**
   * Switch to a different language
   */
  async function setLanguage(lang) {
    if (!CONFIG.supportedLangs.includes(lang)) {
      console.error(`i18n: Unsupported language: ${lang}`);
      return false;
    }

    if (lang === currentLang && isLoaded) {
      return true;
    }

    try {
      translations = await loadTranslations(lang);
      currentLang = lang;
      localStorage.setItem(CONFIG.storageKey, lang);
      updatePageTranslations();
      isLoaded = true;
      return true;
    } catch (error) {
      console.error('i18n: Error setting language:', error);
      return false;
    }
  }

  /**
   * Toggle between languages
   */
  function toggleLanguage() {
    const currentIndex = CONFIG.supportedLangs.indexOf(currentLang);
    const nextIndex = (currentIndex + 1) % CONFIG.supportedLangs.length;
    return setLanguage(CONFIG.supportedLangs[nextIndex]);
  }

  /**
   * Get current language
   */
  function getLanguage() {
    return currentLang;
  }

  /**
   * Check if translations are loaded
   */
  function isReady() {
    return isLoaded;
  }

  /**
   * Get all translations for current language
   */
  function getTranslations() {
    return translations;
  }

  /**
   * Initialize language toggle click handlers
   */
  function initializeToggleHandlers() {
    // Language toggle buttons
    document.querySelectorAll('.lang-toggle__option').forEach(option => {
      option.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = option.getAttribute('data-lang');
        if (lang) {
          setLanguage(lang);
        }
      });
    });

    // Any element with data-lang-switch
    document.querySelectorAll('[data-lang-switch]').forEach(element => {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = element.getAttribute('data-lang-switch');
        if (lang === 'toggle') {
          toggleLanguage();
        } else if (lang) {
          setLanguage(lang);
        }
      });
    });
  }

  /**
   * Initialize the i18n system
   */
  async function init() {
    // Detect preferred language
    const detectedLang = detectLanguage();
    
    // Load translations
    await setLanguage(detectedLang);
    
    // Set up toggle handlers
    initializeToggleHandlers();

    // Re-initialize handlers when DOM changes (for dynamic content)
    const observer = new MutationObserver((mutations) => {
      let shouldReinit = false;
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1 && (
              node.hasAttribute && (
                node.hasAttribute(CONFIG.dataAttribute) ||
                node.hasAttribute(CONFIG.htmlAttribute) ||
                node.querySelector(`[${CONFIG.dataAttribute}], [${CONFIG.htmlAttribute}]`)
              )
            )) {
              shouldReinit = true;
            }
          });
        }
      });
      
      if (shouldReinit) {
        updatePageTranslations();
        initializeToggleHandlers();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    console.log(`i18n: Initialized with language: ${currentLang}`);
  }

  // Public API
  window.i18n = {
    init,
    t,
    setLanguage,
    toggleLanguage,
    getLanguage,
    isReady,
    getTranslations,
    updatePageTranslations
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
