document.addEventListener('DOMContentLoaded', function() {
    
    const fileInput = document.getElementById('profilePicInput');
    const avatarPreview = document.getElementById('avatarPreview');
    const avatarWrapper = document.getElementById('avatarWrapper');
    
    if (fileInput && avatarPreview) {
        fileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            
            if (file && file.type.startsWith('image/')) {
                                
                const reader = new FileReader();
                reader.onload = function(e) {
                    avatarPreview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    if (avatarWrapper && fileInput) {
        const uploadBtn = document.querySelector('.avatar-upload-btn');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    }
    
    const newPwdInput = document.getElementById('newPwd');
    const confirmPwdInput = document.getElementById('confirmPwd');
    
    if (newPwdInput && confirmPwdInput) {
        function checkPasswordMatch() {
            if (confirmPwdInput.value.length > 0) {
                if (newPwdInput.value !== confirmPwdInput.value) {
                    confirmPwdInput.style.borderColor = '#ff4444';
                } else {
                    confirmPwdInput.style.borderColor = '#4CAF50';
                }
            } else {
                confirmPwdInput.style.borderColor = '';
            }
        }
        
        newPwdInput.addEventListener('input', checkPasswordMatch);
        confirmPwdInput.addEventListener('input', checkPasswordMatch);
    }
    
});