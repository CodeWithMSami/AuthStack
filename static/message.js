// Auto-dismiss messages after 5 seconds
document.addEventListener('DOMContentLoaded', function() {
    const messages = document.querySelectorAll('.message-toast');
    
    messages.forEach(function(message) {
        // Auto remove after 5 seconds
        setTimeout(function() {
            if (message && message.parentElement) {
                message.classList.add('removing');
                setTimeout(function() {
                    if (message && message.parentElement) {
                        message.remove();
                    }
                }, 300);
            }
        }, 5000);
        
        // Add click close functionality
        const closeBtn = message.querySelector('.message-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                message.classList.add('removing');
                setTimeout(function() {
                    message.remove();
                }, 300);
            });
        }
    });
});