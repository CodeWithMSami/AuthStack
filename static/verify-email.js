// Verify Email Page Functionality
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        // Get DOM elements
        const pendingState = document.getElementById('verificationPending');
        const successState = document.getElementById('verificationSuccess');
        const errorState = document.getElementById('verificationError');
        const userEmailSpan = document.getElementById('userEmail');
        const errorMessageSpan = document.getElementById('errorMessage');
        const resendBtn = document.getElementById('resendBtn');
        const errorResendBtn = document.getElementById('errorResendBtn');
        const changeEmailBtn = document.getElementById('changeEmailBtn');
        const continueBtn = document.getElementById('continueBtn');
        const resendTimer = document.getElementById('resendTimer');
        const timerSecondsSpan = document.getElementById('timerSeconds');
        const changeEmailModal = document.getElementById('changeEmailModal');
        const changeEmailForm = document.getElementById('changeEmailForm');

        let countdownInterval = null;
        let canResend = true;
        let resendCooldown = 60; // seconds

        // Get email from URL parameters or session storage
        function getUserEmail() {
            const urlParams = new URLSearchParams(window.location.search);
            let email = urlParams.get('email');

            if (!email) {
                email = sessionStorage.getItem('verificationEmail');
            }

            if (!email) {
                email = 'your registered email';
            }

            return email;
        }

        // Display user email
        if (userEmailSpan) {
            userEmailSpan.textContent = getUserEmail();
        }

        // Check verification status from URL
        function checkVerificationStatus() {
            const urlParams = new URLSearchParams(window.location.search);
            const status = urlParams.get('status');
            const token = urlParams.get('token');

            if (status === 'success' || token) {
                // If token present, verify it
                if (token) {
                    verifyEmailToken(token);
                } else if (status === 'success') {
                    showSuccessState();
                }
            } else {
                // Default to pending state
                showPendingState();
                startResendCooldown();
            }
        }

        // Verify email token with backend
        function verifyEmailToken(token) {
            // Simulate API call (replace with actual backend integration)
            console.log(`Verifying token: ${token}`);

            // For demo purposes, simulate verification
            setTimeout(() => {
                // In production, make actual API call:
                // fetch(`/api/verify-email/?token=${token}`)
                //     .then(response => response.json())
                //     .then(data => {
                //         if (data.success) {
                //             showSuccessState();
                //         } else {
                //             showErrorState(data.message);
                //         }
                //     })

                // Demo: Check if token is valid (simulate success)
                const isValid = token !== 'invalid' && token !== 'expired';

                if (isValid) {
                    showSuccessState();
                } else {
                    showErrorState('The verification link is invalid or has expired.');
                }
            }, 1000);
        }

        // Show pending state
        function showPendingState() {
            if (pendingState) pendingState.classList.add('active');
            if (successState) successState.classList.remove('active');
            if (errorState) errorState.classList.remove('active');
        }

        // Show success state
        function showSuccessState() {
            if (pendingState) pendingState.classList.remove('active');
            if (successState) successState.classList.add('active');
            if (errorState) errorState.classList.remove('active');

            // Clear cooldown timer
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
        }

        // Show error state
        function showErrorState(message) {
            if (pendingState) pendingState.classList.remove('active');
            if (successState) successState.classList.remove('active');
            if (errorState) errorState.classList.add('active');

            if (errorMessageSpan && message) {
                errorMessageSpan.textContent = message;
            }

            // Clear cooldown timer
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
        }

        // Start resend cooldown timer
        function startResendCooldown() {
            if (!canResend) return;

            canResend = false;
            let secondsLeft = resendCooldown;

            if (resendTimer) resendTimer.style.display = 'block';
            if (timerSecondsSpan) timerSecondsSpan.textContent = secondsLeft;

            // Disable resend buttons
            if (resendBtn) resendBtn.disabled = true;
            if (errorResendBtn) errorResendBtn.disabled = true;

            countdownInterval = setInterval(function () {
                secondsLeft--;

                if (timerSecondsSpan) {
                    timerSecondsSpan.textContent = secondsLeft;
                }

                if (secondsLeft <= 0) {
                    clearInterval(countdownInterval);
                    canResend = true;

                    if (resendTimer) resendTimer.style.display = 'none';
                    if (resendBtn) resendBtn.disabled = false;
                    if (errorResendBtn) errorResendBtn.disabled = false;
                }
            }, 1000);
        }

        // Resend verification email
        function resendVerificationEmail() {
            if (!canResend) {
                alert('Please wait before requesting another verification email.');
                return;
            }

            const email = getUserEmail();

            if (!email || email === 'your registered email') {
                alert('Unable to resend verification. Please contact support.');
                return;
            }

            // Disable button during request
            if (resendBtn) {
                resendBtn.disabled = true;
                resendBtn.innerHTML = '<span>⏳</span> Sending...';
            }
            if (errorResendBtn) {
                errorResendBtn.disabled = true;
                errorResendBtn.innerHTML = '<span>⏳</span> Sending...';
            }

            // Simulate API call (replace with actual backend integration)
            setTimeout(() => {
                console.log(`Resending verification email to: ${email}`);

                // In production:
                // fetch('/api/resend-verification/', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({ email: email })
                // })

                alert(`Verification email resent to ${email}. Please check your inbox.`);

                // Reset button states
                if (resendBtn) {
                    resendBtn.disabled = false;
                    resendBtn.innerHTML = '<span>🔄</span> Resend Verification Email';
                }
                if (errorResendBtn) {
                    errorResendBtn.disabled = false;
                    errorResendBtn.innerHTML = '<span>🔄</span> Request New Link';
                }

                // Start cooldown
                startResendCooldown();

            }, 1500);
        }

        // Show change email modal
        function showChangeEmailModal() {
            if (changeEmailModal) {
                changeEmailModal.classList.add('show');
            }
        }

        // Close change email modal
        window.closeChangeEmailModal = function () {
            if (changeEmailModal) {
                changeEmailModal.classList.remove('show');
            }
            if (changeEmailForm) {
                changeEmailForm.reset();
            }
        };

        // Handle email change
        function handleEmailChange(email) {
            // Validate email
            const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return false;
            }

            // Simulate API call to update email
            console.log(`Changing email to: ${email}`);

            // In production:
            // fetch('/api/change-email/', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ new_email: email })
            // })

            // Update displayed email
            if (userEmailSpan) {
                userEmailSpan.textContent = email;
            }

            // Save to session storage
            sessionStorage.setItem('verificationEmail', email);

            // Close modal
            closeChangeEmailModal();

            // Show success message
            alert(`Verification link sent to ${email}. Please check your inbox.`);

            // Reset cooldown
            canResend = true;
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
            if (resendTimer) resendTimer.style.display = 'none';

            return true;
        }

        // Continue to dashboard
        function continueToDashboard() {
            window.location.href = '/';
        }

        // Event listeners
        if (resendBtn) {
            resendBtn.addEventListener('click', resendVerificationEmail);
        }

        if (errorResendBtn) {
            errorResendBtn.addEventListener('click', resendVerificationEmail);
        }

        if (changeEmailBtn) {
            changeEmailBtn.addEventListener('click', showChangeEmailModal);
        }

        if (continueBtn) {
            continueBtn.addEventListener('click', continueToDashboard);
        }

        if (changeEmailForm) {
            changeEmailForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const newEmailInput = document.getElementById('newEmail');
                if (newEmailInput) {
                    handleEmailChange(newEmailInput.value.trim());
                }
            });
        }

        // Close modal when clicking outside
        if (changeEmailModal) {
            changeEmailModal.addEventListener('click', function (e) {
                if (e.target === changeEmailModal) {
                    closeChangeEmailModal();
                }
            });
        }

        // Initialize page
        checkVerificationStatus();
    });
})();