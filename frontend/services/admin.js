var AdminService = {
    
    init: function() {
        console.log('Admin panel initialized');
        
        AdminService.loadUsersManagement();
    },

    loadUsersManagement: function() {
        if (typeof AdminUsers !== 'undefined') {
            AdminUsers.loadUsersManagement();
        } else {
            console.error('AdminUsers module not loaded');
        }
    },

    loadProductsManagement: function() {
        if (typeof AdminProducts !== 'undefined') {
            AdminProducts.loadProductsManagement();
        } else {
            console.error('AdminProducts module not loaded');
        }
    },

    loadOrdersManagement: function() {
        if (typeof AdminOrders !== 'undefined') {
            AdminOrders.loadOrdersManagement();
        } else {
            console.error('AdminOrders module not loaded');
        }
    },

    loadBuildsManagement: function() {
        $('#adminContent .container .row .col-12').html(`
            <div class="admin-content-area">
                <h3><i class="fas fa-tools me-2"></i>Custom Builds Management</h3>
                <p>Custom builds management functionality - connect to your CustomBuildService here</p>
                <div class="alert alert-info">
                    <strong>To implement:</strong> Create CustomBuildService.getAllCustomBuilds() similar to UserService
                </div>
            </div>
        `);
    },

    showLoading: function() {
        $('#adminContent .container .row .col-12').html(`
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `);
    },

    displayUsersTable: function(users) {
        if (typeof AdminUsers !== 'undefined') {
            AdminUsers.displayUsersTable(users);
        }
    },

    displayProductsTable: function(products) {
        if (typeof AdminProducts !== 'undefined') {
            AdminProducts.displayProductsTable(products);
        }
    },

    editUser: function(userId) {
        if (typeof AdminUsers !== 'undefined') {
            AdminUsers.editUser(userId);
        }
    },

    deleteUser: function(userId) {
        if (typeof AdminUsers !== 'undefined') {
            AdminUsers.deleteUser(userId);
        }
    },

    editProduct: function(productId) {
        if (typeof AdminProducts !== 'undefined') {
            AdminProducts.editProduct(productId);
        }
    },

    deleteProduct: function(productId) {
        if (typeof AdminProducts !== 'undefined') {
            AdminProducts.deleteProduct(productId);
        }
    },

    showAddUserModal: function() {
        if (typeof AdminUsers !== 'undefined') {
            AdminUsers.showAddUserModal();
        }
    },

    showAddProductModal: function() {
        if (typeof AdminProducts !== 'undefined') {
            AdminProducts.showAddProductModal();
        }
    }
};