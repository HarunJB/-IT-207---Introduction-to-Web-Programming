let Utils = {
    parseJwt: function(token) {
        if (!token) return null;
        try {
            const payload = token.split('.')[1];
            const decoded = atob(payload);
            return JSON.parse(decoded);
        } catch (e) {
            console.error("Invalid JWT token", e);
            return null;
        }
    },

    showAlert: function(type, message, containerId = 'alertContainer') {
        const alertContainer = document.getElementById(containerId);
        if (!alertContainer) return;

        const alertHtml = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        
        alertContainer.innerHTML = alertHtml;
        
        setTimeout(() => {
            const alert = alertContainer.querySelector('.alert');
            if (alert) {
                alert.remove();
            }
        }, 5000);
    },

    validateForm: function(formData, rules) {
        const errors = [];
        
        for (const field in rules) {
            const value = formData[field];
            const rule = rules[field];
            
            if (rule.required && (!value || value.trim() === '')) {
                errors.push(`${rule.label || field} is required`);
                continue;
            }
            
            if (value && rule.minLength && value.length < rule.minLength) {
                errors.push(`${rule.label || field} must be at least ${rule.minLength} characters long`);
            }
            
            if (value && rule.pattern && !rule.pattern.test(value)) {
                errors.push(`${rule.label || field} format is invalid`);
            }
        }
        
        return errors;
    },

    isAuthenticated: function() {
        const token = localStorage.getItem("user_token");
        if (!token) return false;
        
        try {
            const decoded = this.parseJwt(token);
            return decoded && decoded.exp > Date.now() / 1000;
        } catch (e) {
            return false;
        }
    },

    getCurrentUser: function() {
        const token = localStorage.getItem("user_token");
        if (!token) return null;
        
        try {
            const decoded = this.parseJwt(token);
            return decoded ? decoded.user : null;
        } catch (e) {
            return null;
        }
    },

    checkAuthAndRedirect: function() {
        if (this.isAuthenticated()) {
            window.location.href = 'index.html';
        }
    }
};