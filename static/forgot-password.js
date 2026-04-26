// Forgot Password Page Functionality
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        const form = document.getElementById('forgotPasswordForm');
        const emailInput = document.getElementById('email');
        const resetBtn = document.querySelector('.reset-btn');
        const modal = document.getElementById('successModal');
        const submittedEmailSpan = document.getElementById('submittedEmail');

        // Email validation function
        function validateEmail(email) {
            const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
            return emailRegex.test(email);
        }

        // Show error message
        function showError(input, message) {
            input.classList.add('error');
            let errorDiv = input.parentElement.querySelector('.error-message');
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                input.parentElement.appendChild(errorDiv);
            }
            errorDiv.textContent = message;
            errorDiv.classList.add('show');
        }

        // Remove error message
        function removeError(input) {
            input.classList.remove('error');
            const errorDiv = input.parentElement.querySelector('.error-message');
            if (errorDiv) {
                errorDiv.classList.remove('show');
            }
        }

        // Real-time email validation
        if (emailInput) {
            emailInput.addEventListener('input', function () {
                if (this.value.trim() === '') {
                    removeError(this);
                } else if (!validateEmail(this.value)) {
                    showError(this, 'Please enter a valid email address');
                } else {
                    removeError(this);
                }
            });

            emailInput.addEventListener('blur', function () {
                if (this.value.trim() !== '' && !validateEmail(this.value)) {
                    showError(this, 'Please enter a valid email address');
                }
            });
        }

        // Show modal function
        function showModal(email) {
            if (submittedEmailSpan) {
                submittedEmailSpan.textContent = email;
            }
            if (modal) {
                modal.classList.add('show');
            }
        }

        // Hide modal function
        window.hideModal = function () {
            if (modal) {
                modal.classList.remove('show');
            }
        };

        // Redirect to login
        window.redirectToLogin = function () {
            window.location.href = '/login';
        };

        // Form submission handler
        if (form) {
            form.addEventListener('submit', async function (e) {
                e.preventDefault();

                const email = emailInput.value.trim();

                // Validate email
                if (!email) {
                    showError(emailInput, 'Email is required');
                    emailInput.focus();
                    return;
                }

                if (!validateEmail(email)) {
                    showError(emailInput, 'Please enter a valid email address');
                    emailInput.focus();
                    return;
                }

                // Disable button during submission
                if (resetBtn) {
                    resetBtn.disabled = true;
                    resetBtn.innerHTML = '<span>⏳</span> Sending...';
                }

                // Simulate API call (replace with actual backend integration)
                try {
                    // For demo purposes - simulate network request
                    await simulatePasswordReset(email);

                    // Show success modal
                    showModal(email);

                    // Reset form
                    form.reset();

                } catch (error) {
                    console.error('Error:', error);
                    alert('An error occurred. Please try again later.');
                } finally {
                    // Re-enable button
                    if (resetBtn) {
                        resetBtn.disabled = false;
                        resetBtn.innerHTML = '<span>✉️</span> Send Reset Instructions';
                    }
                }
            });
        }

        // Simulate API call (replace with actual fetch/axios)
        function simulatePasswordReset(email) {
            return new Promise((resolve) => {
                // Log the request for debugging
                console.log(`Password reset requested for: ${email}`);

                // Simulate network delay
                setTimeout(() => {
                    // In production, this would be an actual API call:
                    // fetch('/api/password-reset/', {
                    //     method: 'POST',
                    //     headers: { 'Content-Type': 'application/json' },
                    //     body: JSON.stringify({ email: email })
                    // })
                    resolve();
                }, 1500);
            });
        }

        // Close modal when clicking outside
        if (modal) {
            modal.addEventListener('click', function (e) {
                if (e.target === modal) {
                    hideModal();
                }
            });
        }

        // Handle Enter key press
        if (emailInput) {
            emailInput.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (form) {
                        form.dispatchEvent(new Event('submit'));
                    }
                }
            });
        }
    });
})();