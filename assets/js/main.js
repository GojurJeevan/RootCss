/**
 * Future Gadget Expo 2025 - Main JavaScript
 * Handles navigation, smooth scrolling, and back-to-top functionality
 */

class MainApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupMobileNavigation();
    this.setupSmoothScrolling();
    this.setupBackToTop();
    this.setupActiveNavigation();
  }

  setupEventListeners() {
    // DOM loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.onDOMLoaded();
      });
    } else {
      this.onDOMLoaded();
    }

    // Window events
    window.addEventListener('scroll', this.throttle(this.onScroll.bind(this), 16));
    window.addEventListener('resize', this.debounce(this.onResize.bind(this), 250));
  }

  onDOMLoaded() {
    // Add fade-in animation to hero content
    const heroContent = document.querySelector('.hero__content');
    if (heroContent) {
      heroContent.classList.add('fade-in');
    }

    // Initialize components
    this.initializeComponents();
  }

  initializeComponents() {
    // Initialize any page-specific components
    this.initializeTabs();
    this.initializeModals();
    this.initializeLightbox();
    this.initializeLazyLoading();
  }

  setupMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const mobileNav = document.querySelector('.nav--mobile');
    const navLinks = document.querySelectorAll('.nav--mobile .nav__link');

    if (navToggle && mobileNav) {
      navToggle.addEventListener('click', () => {
        const isOpen = mobileNav.classList.contains('nav--open');
        
        if (isOpen) {
          this.closeMobileNav(mobileNav, navToggle);
        } else {
          this.openMobileNav(mobileNav, navToggle);
        }
      });

      // Close mobile nav when clicking on links
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          this.closeMobileNav(mobileNav, navToggle);
        });
      });

      // Close mobile nav when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.header') && mobileNav.classList.contains('nav--open')) {
          this.closeMobileNav(mobileNav, navToggle);
        }
      });

      // Handle escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('nav--open')) {
          this.closeMobileNav(mobileNav, navToggle);
        }
      });
    }
  }

  openMobileNav(mobileNav, navToggle) {
    mobileNav.classList.add('nav--open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.innerHTML = '✕';
    document.body.style.overflow = 'hidden';
  }

  closeMobileNav(mobileNav, navToggle) {
    mobileNav.classList.remove('nav--open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.innerHTML = '☰';
    document.body.style.overflow = '';
  }

  setupSmoothScrolling() {
    // Handle smooth scrolling for anchor links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  }

  setupBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.setAttribute('title', 'Back to top');
    document.body.appendChild(backToTopBtn);

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    this.backToTopBtn = backToTopBtn;
  }

  setupActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav__link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
      const linkHref = link.getAttribute('href');
      if (linkHref === currentPage || 
          (currentPage === '' && linkHref === 'index.html') ||
          (currentPage === 'index.html' && linkHref === '/')) {
        link.classList.add('nav__link--active');
      }
    });
  }

  initializeTabs() {
    const tabContainers = document.querySelectorAll('.tabs');
    
    tabContainers.forEach(container => {
      const tabButtons = container.querySelectorAll('.tabs__btn');
      const tabContents = container.querySelectorAll('.tabs__content');

      tabButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
          // Remove active class from all buttons and contents
          tabButtons.forEach(b => b.classList.remove('tabs__btn--active'));
          tabContents.forEach(c => c.classList.remove('tabs__content--active'));

          // Add active class to clicked button and corresponding content
          btn.classList.add('tabs__btn--active');
          if (tabContents[index]) {
            tabContents[index].classList.add('tabs__content--active');
          }
        });
      });
    });
  }

  initializeModals() {
    // Modal triggers
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-modal-trigger]');
      if (trigger) {
        e.preventDefault();
        const modalId = trigger.getAttribute('data-modal-trigger');
        this.openModal(modalId);
      }

      // Modal close
      const closeBtn = e.target.closest('.modal__close, [data-modal-close]');
      if (closeBtn) {
        this.closeModal();
      }
    });

    // Close modal on backdrop click
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        this.closeModal();
      }
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('modal--active');
      document.body.style.overflow = 'hidden';
      
      // Focus first focusable element
      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }

  closeModal() {
    const activeModal = document.querySelector('.modal--active');
    if (activeModal) {
      activeModal.classList.remove('modal--active');
      document.body.style.overflow = '';
    }
  }

  initializeLightbox() {
    // Create lightbox if it doesn't exist
    if (!document.querySelector('.lightbox')) {
      this.createLightbox();
    }

    // Handle lightbox triggers
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-lightbox]');
      if (trigger) {
        e.preventDefault();
        const imageSrc = trigger.getAttribute('data-lightbox') || trigger.src || trigger.href;
        this.openLightbox(imageSrc);
      }
    });
  }

  createLightbox() {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox__content">
        <img class="lightbox__image" src="" alt="">
        <button class="lightbox__close" aria-label="Close lightbox">×</button>
        <button class="lightbox__nav lightbox__nav--prev" aria-label="Previous image">‹</button>
        <button class="lightbox__nav lightbox__nav--next" aria-label="Next image">›</button>
      </div>
    `;

    document.body.appendChild(lightbox);

    // Event listeners
    const closeBtn = lightbox.querySelector('.lightbox__close');
    const prevBtn = lightbox.querySelector('.lightbox__nav--prev');
    const nextBtn = lightbox.querySelector('.lightbox__nav--next');

    closeBtn.addEventListener('click', () => this.closeLightbox());
    prevBtn.addEventListener('click', () => this.lightboxNav('prev'));
    nextBtn.addEventListener('click', () => this.lightboxNav('next'));

    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        this.closeLightbox();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('lightbox--active')) return;

      switch (e.key) {
        case 'Escape':
          this.closeLightbox();
          break;
        case 'ArrowLeft':
          this.lightboxNav('prev');
          break;
        case 'ArrowRight':
          this.lightboxNav('next');
          break;
      }
    });

    this.lightbox = lightbox;
  }

  openLightbox(imageSrc) {
    if (!this.lightbox) return;

    const image = this.lightbox.querySelector('.lightbox__image');
    image.src = imageSrc;
    this.lightbox.classList.add('lightbox--active');
    document.body.style.overflow = 'hidden';

    // Store current image for navigation
    this.currentLightboxImages = Array.from(document.querySelectorAll('[data-lightbox]'))
      .map(el => el.getAttribute('data-lightbox') || el.src || el.href);
    this.currentLightboxIndex = this.currentLightboxImages.indexOf(imageSrc);
  }

  closeLightbox() {
    if (this.lightbox) {
      this.lightbox.classList.remove('lightbox--active');
      document.body.style.overflow = '';
    }
  }

  lightboxNav(direction) {
    if (!this.currentLightboxImages || this.currentLightboxImages.length <= 1) return;

    if (direction === 'next') {
      this.currentLightboxIndex = (this.currentLightboxIndex + 1) % this.currentLightboxImages.length;
    } else {
      this.currentLightboxIndex = this.currentLightboxIndex === 0 
        ? this.currentLightboxImages.length - 1 
        : this.currentLightboxIndex - 1;
    }

    const newImageSrc = this.currentLightboxImages[this.currentLightboxIndex];
    const image = this.lightbox.querySelector('.lightbox__image');
    image.src = newImageSrc;
  }

  initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for browsers without IntersectionObserver
      images.forEach(img => {
        img.src = img.dataset.src;
        img.classList.remove('lazy');
      });
    }
  }

  onScroll() {
    // Back to top button visibility
    if (this.backToTopBtn) {
      if (window.pageYOffset > 200) {
        this.backToTopBtn.classList.add('back-to-top--visible');
      } else {
        this.backToTopBtn.classList.remove('back-to-top--visible');
      }
    }

    // Header background on scroll
    const header = document.querySelector('.header');
    if (header) {
      if (window.pageYOffset > 50) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        if (document.documentElement.classList.contains('theme--dark')) {
          header.style.backgroundColor = 'rgba(17, 24, 39, 0.98)';
        }
      } else {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        if (document.documentElement.classList.contains('theme--dark')) {
          header.style.backgroundColor = 'rgba(17, 24, 39, 0.95)';
        }
      }
    }
  }

  onResize() {
    // Close mobile nav on resize
    const mobileNav = document.querySelector('.nav--mobile');
    const navToggle = document.querySelector('.nav-toggle');
    
    if (mobileNav && navToggle && window.innerWidth >= 768) {
      this.closeMobileNav(mobileNav, navToggle);
    }
  }

  // Utility functions
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Initialize the app
const app = new MainApp();