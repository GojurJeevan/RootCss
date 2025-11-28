/**
 * Future Gadget Expo 2025 - Form Validation
 * Handles client-side form validation for register and contact forms
 */

class FormValidator {
  constructor() {
    this.forms = [];
    this.init();
  }

  init() {
    this.setupFormValidation();
  }

  setupFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
      this.initializeForm(form);
    });
  }

  initializeForm(form) {
    const formData = {
      element: form,
      fields: new Map(),
      isValid: false
    };

    // Initialize form fields
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      this.initializeField(formData, input);
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit(formData);
    });

    this.forms.push(formData);
  }

  initializeField(formData, input) {
    const fieldData = {
      element: input,
      isValid: false,
      rules: this.getValidationRules(input),
      errorElement: this.createErrorElement(input),
      successElement: this.createSuccessElement(input)
    };

    // Add event listeners
    input.addEventListener('blur', () => this.validateField(fieldData));
    input.addEventListener('input', () => this.clearFieldState(fieldData));
    
    // Real-time validation for better UX
    if (input.type === 'email') {
      input.addEventListener('input', this.debounce(() => this.validateField(fieldData), 500));
    }

    formData.fields.set(input.name || input.id, fieldData);
  }

  getValidationRules(input) {
    const rules = [];

    // Required field
    if (input.hasAttribute('required')) {
      rules.push({
        type: 'required',
        message: this.getRequiredMessage(input)
      });
    }

    // Email validation
    if (input.type === 'email') {
      rules.push({
        type: 'email',
        message: 'Please enter a valid email address'
      });
    }

    // Minimum length
    if (input.hasAttribute('minlength')) {
      rules.push({
        type: 'minlength',
        value: parseInt(input.getAttribute('minlength')),
        message: `Minimum ${input.getAttribute('minlength')} characters required`
      });
    }

    // Pattern validation
    if (input.hasAttribute('pattern')) {
      rules.push({
        type: 'pattern',
        value: new RegExp(input.getAttribute('pattern')),
        message: input.getAttribute('data-pattern-message') || 'Please match the requested format'
      });
    }

    // Custom validation rules based on name/id
    const fieldName = input.name || input.id;
    if (fieldName === 'phone') {
      rules.push({
        type: 'phone',
        message: 'Please enter a valid phone number'
      });
    }

    return rules;
  }

  getRequiredMessage(input) {
    const fieldName = input.getAttribute('data-field-name') || 
                     input.labels?.[0]?.textContent?.replace('*', '').trim() || 
                     input.placeholder || 
                     'This field';
    
    return `${fieldName} is required`;
  }

  createErrorElement(input) {
    const existing = input.parentNode.querySelector('.form__error');
    if (existing) return existing;

    const errorElement = document.createElement('div');
    errorElement.className = 'form__error';
    input.parentNode.appendChild(errorElement);
    return errorElement;
  }

  createSuccessElement(input) {
    const existing = input.parentNode.querySelector('.form__success');
    if (existing) return existing;

    const successElement = document.createElement('div');
    successElement.className = 'form__success';
    successElement.textContent = '✓ Looks good';
    input.parentNode.appendChild(successElement);
    return successElement;
  }

  validateField(fieldData) {
    const { element, rules, errorElement, successElement } = fieldData;
    const value = element.value.trim();

    // Clear previous state
    this.clearFieldState(fieldData);

    // Run validation rules
    for (const rule of rules) {
      const result = this.runValidationRule(rule, value);
      if (!result.isValid) {
        this.setFieldError(fieldData, result.message);
        return false;
      }
    }

    // Field is valid
    this.setFieldSuccess(fieldData);
    return true;
  }

  runValidationRule(rule, value) {
    switch (rule.type) {
      case 'required':
        return {
          isValid: value.length > 0,
          message: rule.message
        };

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return {
          isValid: !value || emailRegex.test(value),
          message: rule.message
        };

      case 'minlength':
        return {
          isValid: !value || value.length >= rule.value,
          message: rule.message
        };

      case 'pattern':
        return {
          isValid: !value || rule.value.test(value),
          message: rule.message
        };

      case 'phone':
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return {
          isValid: !value || phoneRegex.test(value.replace(/[\s\-\(\)]/g, '')),
          message: rule.message
        };

      default:
        return { isValid: true };
    }
  }

  clearFieldState(fieldData) {
    const { element, errorElement, successElement } = fieldData;
    
    element.classList.remove('form__input--error', 'form__input--success');
    errorElement.style.display = 'none';
    successElement.style.display = 'none';
    
    fieldData.isValid = false;
  }

  setFieldError(fieldData, message) {
    const { element, errorElement } = fieldData;
    
    element.classList.add('form__input--error');
    element.classList.remove('form__input--success');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    fieldData.isValid = false;
  }

  setFieldSuccess(fieldData) {
    const { element, successElement } = fieldData;
    
    element.classList.add('form__input--success');
    element.classList.remove('form__input--error');
    successElement.style.display = 'block';
    
    fieldData.isValid = true;
  }

  validateForm(formData) {
    let isValid = true;

    formData.fields.forEach(fieldData => {
      if (!this.validateField(fieldData)) {
        isValid = false;
      }
    });

    return isValid;
  }

  handleSubmit(formData) {
    const isValid = this.validateForm(formData);

    if (isValid) {
      this.submitForm(formData);
    } else {
      // Focus first invalid field
      const firstInvalidField = Array.from(formData.fields.values())
        .find(field => !field.isValid);
      
      if (firstInvalidField) {
        firstInvalidField.element.focus();
      }
    }
  }

  submitForm(formData) {
    const form = formData.element;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Show loading state
    if (submitBtn) {
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;
    }

    // Simulate API call
    setTimeout(() => {
      // Show success message
      this.showSuccessMessage(form);
      
      // Reset form
      form.reset();
      formData.fields.forEach(fieldData => {
        this.clearFieldState(fieldData);
      });

      // Restore submit button
      if (submitBtn) {
        submitBtn.textContent = submitBtn.getAttribute('data-original-text') || 'Submit';
        submitBtn.disabled = false;
      }
    }, 2000);
  }

  showSuccessMessage(form) {
    // Create success modal or alert
    const successModal = this.createSuccessModal();
    document.body.appendChild(successModal);
    
    setTimeout(() => {
      successModal.classList.add('modal--active');
    }, 100);

    // Auto-close after 3 seconds
    setTimeout(() => {
      successModal.classList.remove('modal--active');
      setTimeout(() => {
        document.body.removeChild(successModal);
      }, 300);
    }, 3000);
  }

  createSuccessModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal__content" style="text-align: center; max-width: 400px;">
        <div style="font-size: 3rem; color: var(--color-success); margin-bottom: 1rem;">✓</div>
        <h3>Success!</h3>
        <p>Your form has been submitted successfully. We'll get back to you soon!</p>
        <button class="btn btn--primary" onclick="this.closest('.modal').classList.remove('modal--active')">
          Close
        </button>
      </div>
    `;

    return modal;
  }

  // Utility function
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

// Initialize form validation
document.addEventListener('DOMContentLoaded', () => {
  new FormValidator();
});