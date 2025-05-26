var AdminService = {
    
    init: function() {
        console.log('Admin panel initialized');
        
        // Load initial admin content
        AdminService.loadUsersManagement();
        AdminService.loadProductsManagement();
    },

    loadUsersManagement: function() {
        this.showLoading();
        UserService.getAllUsers(); 
    },

    displayUsersTable: function(users) {
        if (!users || !Array.isArray(users)) {
            users = [];
        }

        const usersTableHtml = `
            <div class="admin-content-area">
                <h3><i class="fas fa-users me-2"></i>User Management</h3>
                <p>Manage user accounts, roles, and permissions.</p>
                
                <div class="admin-btn-group">
                    <button class="btn btn-admin-primary" onclick="AdminService.showAddUserModal()">
                        <i class="fas fa-plus me-2"></i>Add New User
                    </button>
                </div>

                <div class="admin-table">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${users.length > 0 ? users.map(user => `
                                <tr>
                                    <td>#${user.user_id}</td>
                                    <td>${user.first_name} ${user.last_name}</td>
                                    <td>${user.email}</td>
                                    <td>
                                        <span class="badge ${user.is_admin === 1 ? 'bg-danger' : 'bg-primary'}">
                                            ${user.is_admin === 1 ? 'Admin' : 'User'}
                                        </span>
                                    </td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary me-1" onclick="AdminService.editUser(${user.user_id})">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn btn-sm btn-outline-danger" onclick="AdminService.deleteUser(${user.user_id})">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('') : `
                                <tr>
                                    <td colspan="5" class="text-center">No users found</td>
                                </tr>
                            `}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        $('#adminContent .container .row .col-12').html(usersTableHtml);
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

    loadUsersManagement: function() {
        this.showLoading();
        UserService.getAllUsers().then(function(response) {
            if (response.success) {
                AdminService.displayUsersTable(response.data);
            } else {
                $('#adminContent .container .row .col-12').html(`
                    <div class="text-center py-5">
                        <div class="alert alert-danger">
                            Failed to load users: ${response.error || 'Unknown error'}
                        </div>
                    </div>
                `);
            }
        }).catch(function(error) {
            $('#adminContent .container .row .col-12').html(`
                <div class="text-center py-5">
                    <div class="alert alert-danger">
                        Error loading users: ${error.message || 'Unknown error'}
                    </div>
                </div>
            `);
        });
    },

    loadProductsManagement: function() {
        this.showLoading();
        ProductService.getAllProducts(); 
    },

    displayProductsTable: function(products) {
        const productsTableHtml = `
            <div class="admin-content-area">
                <h3><i class="fas fa-box me-2"></i>Product Management</h3>
                <p>Add, edit, and manage your product inventory.</p>
                
                <div class="admin-btn-group">
                    <button class="btn btn-admin-primary" onclick="AdminService.showAddProductModal()">
                        <i class="fas fa-plus me-2"></i>Add New Product
                    </button>
                </div>

                <div class="admin-table">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${products.map(product => `
                                <tr>
                                    <td>#${product.product_id}</td>
                                    <td>${product.name}</td>
                                    <td><span class="badge bg-info">${product.category || 'N/A'}</span></td>
                                    <td>$${product.price}</td>
                                    <td>
                                        <span class="badge ${product.stock > 10 ? 'bg-success' : product.stock > 0 ? 'bg-warning' : 'bg-danger'}">
                                            ${product.stock} units
                                        </span>
                                    </td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary me-1" onclick="AdminService.editProduct(${product.product_id})">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn btn-sm btn-outline-danger" onclick="AdminService.deleteProduct(${product.product_id})">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        $('#adminContent .container .row .col-12').html(productsTableHtml);
    },

    loadOrdersManagement: function() {
        $('#adminContent .container .row .col-12').html(`
            <div class="admin-content-area">
                <h3><i class="fas fa-shopping-cart me-2"></i>Order Management</h3>
                <p>Order management functionality - connect to your OrderService here</p>
                <div class="alert alert-info">
                    <strong>To implement:</strong> Create OrderService.getAllOrders() similar to UserService
                </div>
            </div>
        `);
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
            <div class="admin-loading">
                <div class="admin-spinner"></div>
            </div>
        `);
    },

    editUser: function(userId) {
        alert(`Edit User ${userId} - implement UserService.updateUser() here`);
    },

    deleteUser: function(userId) {
        UserService.deleteUser(userId);
    },

    editProduct: function(productId) {
        alert(`Edit Product ${productId} - implement ProductService.updateProduct() here`);
    },

    deleteProduct: function(productId) {
        ProductService.deleteProduct(productId);
    },

    showAddUserModal: function() {
        alert('Add User Modal - implement form here');
    },

    showAddProductModal: function() {
        alert('Add Product Modal - implement form here');
    }
};