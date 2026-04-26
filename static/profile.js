// Profile image preview functionality - Fixed image system
(function() {
    'use strict';
    
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        
        // Get DOM elements
        const fileInput = document.getElementById('profilePicInput');
        const avatarPreview = document.getElementById('avatarPreview');
        const avatarWrapper = document.getElementById('avatarWrapper');
        
        // Function to display image preview
        function previewImage(file) {
            if (!file) return;
            
            // Check if file is an image
            if (!file.type.startsWith('image/')) {
                console.warn('Selected file is not an image');
                alert('Please select a valid image file (JPEG, PNG, GIF, or WEBP).');
                fileInput.value = ''; // Clear the input
                return;
            }
            
            // Check file size (limit to 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                alert('Image size should be less than 5MB. Please choose a smaller image.');
                fileInput.value = ''; // Clear the input
                return;
            }
            
            // Show loading state on wrapper
            if (avatarWrapper) {
                avatarWrapper.classList.add('loading');
            }
            
            // Create FileReader to read the image
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Set the preview image src to the loaded data URL
                avatarPreview.src = e.target.result;
                avatarPreview.classList.remove('error-load');
                
                // Remove loading state after image successfully loads
                avatarPreview.onload = function() {
                    if (avatarWrapper) {
                        avatarWrapper.classList.remove('loading');
                    }
                };
                
                // Handle any loading errors
                avatarPreview.onerror = function() {
                    if (avatarWrapper) {
                        avatarWrapper.classList.remove('loading');
                    }
                    console.error('Failed to load preview image');
                    alert('Failed to preview image. Please try another file.');
                };
            };
            
            reader.onerror = function() {
                if (avatarWrapper) {
                    avatarWrapper.classList.remove('loading');
                }
                console.error('Error reading file');
                alert('Error reading file. Please try again.');
            };
            
            // Read the file as a data URL
            reader.readAsDataURL(file);
        }
        
        // Event listener for file input change
        if (fileInput) {
            fileInput.addEventListener('change', function(event) {
                const file = event.target.files[0];
                if (file) {
                    previewImage(file);
                }
                // If no file selected, do nothing - keep current image
            });
        }
        
        // Optional: Add click handler to trigger file input when clicking avatar wrapper
        if (avatarWrapper && fileInput) {
            const uploadBtn = document.querySelector('.avatar-upload-btn');
            // The label already handles this, but ensure the wrapper doesn't interfere
            if (uploadBtn) {
                uploadBtn.addEventListener('click', function(e) {
                    // Let the label handle the click naturally
                    e.stopPropagation();
                });
            }
        }
        
        // Form validation before submit (optional enhancement)
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', function(e) {
                // Validate password fields if any password field is filled
                const currentPwd = document.getElementById('currentPwd');
                const newPwd = document.getElementById('newPwd');
                const confirmPwd = document.getElementById('confirmPwd');
                
                // Check if user is trying to change password
                if (newPwd && newPwd.value) {
                    // New password provided, check current password is also provided
                    if (!currentPwd || !currentPwd.value) {
                        e.preventDefault();
                        alert('Please enter your current password to set a new password.');
                        if (currentPwd) currentPwd.focus();
                        return;
                    }
                    
                    // Check if passwords match
                    if (newPwd.value !== confirmPwd.value) {
                        e.preventDefault();
                        alert('New password and confirm password do not match.');
                        newPwd.focus();
                        return;
                    }
                    
                    // Check password length
                    if (newPwd.value.length < 6) {
                        e.preventDefault();
                        alert('New password must be at least 6 characters long.');
                        newPwd.focus();
                        return;
                    }
                }
                
                // If only current password is provided but no new password, ignore (user not changing password)
                if (currentPwd && currentPwd.value && (!newPwd || !newPwd.value)) {
                    // User entered current password but no new password - clear current password field
                    currentPwd.value = '';
                }
            });
        }
        
        // Live password match indicator (optional enhancement)
        const newPwdInput = document.getElementById('newPwd');
        const confirmPwdInput = document.getElementById('confirmPwd');
        
        if (newPwdInput && confirmPwdInput) {
            function checkPasswordMatch() {
                if (confirmPwdInput.value.length > 0) {
                    if (newPwdInput.value !== confirmPwdInput.value) {
                        confirmPwdInput.style.borderColor = '#ff4444';
                        confirmPwdInput.style.boxShadow = '0 0 0 3px rgba(255, 68, 68, 0.2)';
                    } else {
                        confirmPwdInput.style.borderColor = 'var(--primary-light-color)';
                        confirmPwdInput.style.boxShadow = '0 0 0 3px rgba(6, 248, 6, 0.2)';
                    }
                } else {
                    confirmPwdInput.style.borderColor = '';
                    confirmPwdInput.style.boxShadow = '';
                }
            }
            
            newPwdInput.addEventListener('input', checkPasswordMatch);
            confirmPwdInput.addEventListener('input', checkPasswordMatch);
        }
        
        console.log('Profile image system initialized successfully');
    });
})();