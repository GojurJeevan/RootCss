/**
 * Future Gadget Expo 2025 - Theme Toggle
 * Handles dark/light theme switching with localStorage persistence
 */

class ThemeToggle {
  constructor() {
    this.currentTheme = this.getStoredTheme() || this.getPreferredTheme();
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.createToggleButton();
    this.setupEventListeners();
  }

  getStoredTheme() {
    return localStorage.getItem('theme');
  }

  getPreferredTheme() {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  setStoredTheme(theme) {
    localStorage.setItem('theme', theme);
  }

  applyTheme(theme) {
    const html = document.documentElement;
    
    if (theme === 'dark') {
      html.classList.add('theme--dark');
      html.classList.remove('theme--light');
    } else {
      html.classList.add('theme--light');
      html.classList.remove('theme--dark');
    }

    this.currentTheme = theme;
    this.updateToggleButton();
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
    this.setStoredTheme(newTheme);
  }

  createToggleButton() {
    const existingButton = document.querySelector('.theme-toggle');
    if (existingButton) return;

    const button = document.createElement('button');
    button.className = 'theme-toggle';
    button.setAttribute('aria-label', 'Toggle theme');
    button.setAttribute('title', 'Toggle dark/light theme');
    
    // Add to header
    const headerContainer = document.querySelector('.header__container');
    if (headerContainer) {
      headerContainer.appendChild(button);
    } else {
      // Fallback: add to body
      document.body.appendChild(button);
    }

    this.toggleButton = button;
    this.updateToggleButton();
  }

  updateToggleButton() {
    if (!this.toggleButton) return;

    const isDark = this.currentTheme === 'dark';
    this.toggleButton.innerHTML = isDark ? '☀️' : '🌙';
    this.toggleButton.setAttribute('aria-label', 
      isDark ? 'Switch to light theme' : 'Switch to dark theme'
    );
    this.toggleButton.setAttribute('title',
      isDark ? 'Switch to light theme' : 'Switch to dark theme'
    );
  }

  setupEventListeners() {
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!this.getStoredTheme()) {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });

    // Handle toggle button click
    document.addEventListener('click', (e) => {
      if (e.target.closest('.theme-toggle')) {
        this.toggleTheme();
      }
    });

    // Keyboard shortcut (Ctrl/Cmd + Shift + D)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        this.toggleTheme();
      }
    });
  }
}

// Initialize theme toggle
document.addEventListener('DOMContentLoaded', () => {
  new ThemeToggle();
});