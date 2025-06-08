var ValidationUtils = {
    sanitizeInput: function(input) {
        if (typeof input !== 'string') return input;
        return input
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .trim();
    },
    
    validateEmail: function(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    
    showFormErrors: function(errors, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const errorHtml = `
            <div class="alert alert-danger alert-dismissible fade show">
                <ul class="mb-0">
                    ${errors.map(error => `<li>${error}</li>`).join('')}
                </ul>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        container.innerHTML = errorHtml;
    }
};