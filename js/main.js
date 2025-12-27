/**
 * ASPEXA Website JavaScript
 * Handles mobile menu, accordion, and form validation
 */

(function() {
  'use strict';

  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initAccordion();
    initContactForm();
    initNewsletterForm();
    initSmoothScroll();
  });

  /**
   * Mobile Menu Toggle
   */
  function initMobileMenu() {
    const toggle = document.querySelector('.navbar-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!toggle || !mobileMenu) return;

    toggle.addEventListener('click', function() {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('active');

      // Prevent body scroll when menu is open
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu-link');
    mobileLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });
  }

  /**
   * FAQ Accordion
   */
  function initAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    if (!accordionHeaders.length) return;

    accordionHeaders.forEach(function(header) {
      header.addEventListener('click', function() {
        const accordionItem = header.parentElement;
        const isActive = accordionItem.classList.contains('active');
        const content = accordionItem.querySelector('.accordion-content');

        // Close all other accordion items
        const allItems = document.querySelectorAll('.accordion-item');
        allItems.forEach(function(item) {
          if (item !== accordionItem) {
            item.classList.remove('active');
            item.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current item
        accordionItem.classList.toggle('active');
        header.setAttribute('aria-expanded', !isActive);
      });

      // Keyboard navigation
      header.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          header.click();
        }
      });
    });
  }

  /**
   * Contact Form Validation
   */
  function initContactForm() {
    const form = document.getElementById('contact-form');

    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Clear previous errors
      clearFormErrors(form);

      // Validate fields
      let isValid = true;

      // Name validation
      const name = form.querySelector('#name');
      if (!name.value.trim()) {
        showError(name, 'name-error', 'Please enter your name');
        isValid = false;
      }

      // Email validation
      const email = form.querySelector('#email');
      if (!email.value.trim()) {
        showError(email, 'email-error', 'Please enter your email address');
        isValid = false;
      } else if (!isValidEmail(email.value)) {
        showError(email, 'email-error', 'Please enter a valid email address');
        isValid = false;
      }

      // Subject validation
      const subject = form.querySelector('#subject');
      if (!subject.value) {
        showError(subject, 'subject-error', 'Please select a subject');
        isValid = false;
      }

      // Message validation
      const message = form.querySelector('#message');
      if (!message.value.trim()) {
        showError(message, 'message-error', 'Please enter your message');
        isValid = false;
      }

      // Privacy checkbox validation
      const privacy = form.querySelector('#privacy');
      if (!privacy.checked) {
        showError(privacy, 'privacy-error', 'You must agree to the privacy policy');
        isValid = false;
      }

      if (isValid) {
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual submission logic)
        setTimeout(function() {
          // Reset form
          form.reset();
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;

          // Show success message
          showSuccessMessage(form, 'Thank you for your message. We will respond within 24 hours.');
        }, 1500);
      }
    });
  }

  /**
   * Newsletter Form
   */
  function initNewsletterForm() {
    const form = document.querySelector('.newsletter-form');

    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const emailInput = form.querySelector('.newsletter-input');
      const submitBtn = form.querySelector('button[type="submit"]');

      if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
        emailInput.style.borderColor = '#EC0000';
        return;
      }

      // Show loading state
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Subscribing...';
      submitBtn.disabled = true;

      // Simulate subscription (replace with actual logic)
      setTimeout(function() {
        emailInput.value = '';
        emailInput.style.borderColor = '';
        submitBtn.textContent = 'Subscribed!';

        setTimeout(function() {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 2000);
      }, 1000);
    });
  }

  /**
   * Smooth Scroll for anchor links
   */
  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function(link) {
      link.addEventListener('click', function(e) {
        const href = link.getAttribute('href');

        if (href === '#') return;

        const target = document.querySelector(href);

        if (target) {
          e.preventDefault();
          const navbarHeight = document.querySelector('.navbar').offsetHeight;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Update focus for accessibility
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    });
  }

  /**
   * Helper Functions
   */
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function showError(input, errorId, message) {
    input.style.borderColor = '#EC0000';
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.hidden = false;
    }
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', errorId);
  }

  function clearFormErrors(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(function(input) {
      input.style.borderColor = '';
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
    });

    const errors = form.querySelectorAll('.form-error');
    errors.forEach(function(error) {
      error.hidden = true;
    });

    // Remove any success messages
    const successMsg = form.querySelector('.form-success');
    if (successMsg) {
      successMsg.remove();
    }
  }

  function showSuccessMessage(form, message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    successDiv.style.cssText = 'background-color: #28a745; color: white; padding: 1rem; margin-top: 1rem; text-align: center;';
    successDiv.textContent = message;
    successDiv.setAttribute('role', 'alert');
    form.appendChild(successDiv);

    // Remove after 5 seconds
    setTimeout(function() {
      successDiv.remove();
    }, 5000);
  }

})();
