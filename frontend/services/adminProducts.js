var AdminProducts = {
  
  loadProductsManagement: function() {
    AdminService.showLoading();
    
    ProductService.getAllProducts()
      .then(function(response) {
        if (response.success) {
          AdminProducts.displayProductsTable(response.data);
        } else {
          $('#adminContent .container .row .col-12').html(`
            <div class="text-center py-5">
              <div class="alert alert-danger">
                Failed to load products: ${response.error || 'Unknown error'}
              </div>
            </div>
          `);
        }
      })
      .catch(function(error) {
        console.error('Error loading products:', error);
        $('#adminContent .container .row .col-12').html(`
          <div class="text-center py-5">
            <div class="alert alert-danger">
              Error loading products: ${error.error || error.message || 'Unknown error'}
            </div>
          </div>
        `);
      });
  },

  displayProductsTable: function(products) {
    if (!products || !Array.isArray(products)) {
        products = [];
    }

    console.log('Displaying products table with', products.length, 'products');

    const productsTableHtml = `
        <div class="admin-content-area">
            <h3><i class="fas fa-box me-2"></i>Product Management</h3>
            <p>Add, edit, and manage your product inventory. Total: ${products.length} products</p>
            
            <div class="admin-btn-group">
                <button class="btn btn-admin-primary" onclick="AdminProducts.showAddProductModal()">
                    <i class="fas fa-plus me-2"></i>Add New Product
                </button>
            </div>

            <div class="admin-table">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Product Name</th>
                            <th>SKU</th>
                            <th>Category</th>
                            <th>Brand</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="products-table-body">
                        ${products.length > 0 ? products.map(product => `
                            <tr id="product-row-${product.product_id}">
                                <td>#${product.product_id}</td>
                                <td>${product.name}</td>
                                <td>${product.sku || 'N/A'}</td>
                                <td><span class="badge bg-info">${product.category || 'N/A'}</span></td>
                                <td>${product.brand || 'N/A'}</td>
                                <td>$${parseFloat(product.price || 0).toFixed(2)}</td>
                                <td>
                                    <span class="badge ${product.stock > 10 ? 'bg-success' : product.stock > 0 ? 'bg-warning' : 'bg-danger'}">
                                        ${product.stock || 0} units
                                    </span>
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary me-1" onclick="AdminProducts.editProduct(${product.product_id})">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" onclick="AdminProducts.deleteProduct(${product.product_id})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('') : `
                            <tr>
                                <td colspan="8" class="text-center">No products found</td>
                            </tr>
                        `}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    $('#adminContent .container .row .col-12').html(productsTableHtml);
    console.log('Products table updated with', $('#products-table-body tr').length, 'rows');
  },

  deleteProduct: function(productId) {
    const productRow = $(`button[onclick="AdminProducts.deleteProduct(${productId})"]`).closest('tr');
    const productName = productRow.find('td:nth-child(2)').text();
    
    const confirmMessage = `Are you sure you want to delete product: ${productName}?`;
    
    if (confirm(confirmMessage)) {
        $(`button[onclick="AdminProducts.deleteProduct(${productId})"]`).prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i>');
        
        ProductService.deleteProduct(productId)
            .then(function(result) {
                alert('Product deleted successfully!');
                AdminProducts.loadProductsManagement();
            })
            .catch(function(error) {
                console.error('Error deleting product:', error);
                alert('Error deleting product: ' + error);
                $(`button[onclick="AdminProducts.deleteProduct(${productId})"]`).prop('disabled', false).html('<i class="fas fa-trash"></i>');
            });
    }
  },

  showAddProductModal: function() {
    const modalHtml = `
        <div class="modal fade" id="addProductModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add New Product</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="addProductForm">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Product Name*</label>
                                    <input type="text" name="name" class="form-control" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">SKU*</label>
                                    <input type="text" name="sku" class="form-control" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Type*</label>
                                    <select name="type" class="form-select" required>
                                        <option value="">Select Type...</option>
                                        <option value="component">Component</option>
                                        <option value="prebuilt">Pre-built PC</option>
                                        <option value="peripheral">Peripheral</option>
                                        <option value="accessory">Accessory</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Category</label>
                                    <input type="text" name="category" class="form-control" placeholder="e.g., GPU, CPU, Monitor">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Brand*</label>
                                    <input type="text" name="brand" class="form-control" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Price*</label>
                                    <input type="number" name="price" class="form-control" step="0.01" min="0" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Sale Price</label>
                                    <input type="number" name="sale_price" class="form-control" step="0.01" min="0">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Stock*</label>
                                    <input type="number" name="stock" class="form-control" min="0" required>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Description</label>
                                <textarea name="description" class="form-control" rows="3"></textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Specifications</label>
                                <textarea name="specs" class="form-control" rows="2" placeholder="JSON format or plain text"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="AdminProducts.submitAddProduct()">Add Product</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('#addProductModal').remove();
    $('body').append(modalHtml);
    $('#addProductModal').modal('show');
  },

  submitAddProduct: function() {
    const form = document.getElementById('addProductForm');
    const formData = new FormData(form);
    const productData = Object.fromEntries(formData.entries());
    
    productData.price = parseFloat(productData.price);
    productData.stock = parseInt(productData.stock);
    if (productData.sale_price) {
        productData.sale_price = parseFloat(productData.sale_price);
    } else {
        delete productData.sale_price;
    }
    
    if (!productData.description) delete productData.description;
    if (!productData.specs) delete productData.specs;
    if (!productData.category) delete productData.category;
    
    if (!productData.name || !productData.sku || !productData.type || !productData.brand || !productData.price || productData.stock === '') {
        alert('Please fill in all required fields');
        return;
    }
    
    console.log('Sending product data:', productData);
    
    $('button[onclick="AdminProducts.submitAddProduct()"]').prop('disabled', true).text('Adding...');
    
    $.ajax({
        url: Constants.PROJECT_BASE_URL + "products",
        type: "POST",
        data: JSON.stringify(productData),
        contentType: "application/json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("user_token"));
        },
        success: function (result) {
            console.log('Product created successfully:', result);
            alert('Product added successfully!');
            $('#addProductModal').modal('hide');
            AdminProducts.loadProductsManagement();
        },
        error: function (xhr, textStatus, errorThrown) {
            console.error('Error creating product:', xhr);
            console.log('Response text:', xhr.responseText);
            console.log('Status:', xhr.status);
            
            let errorMessage = 'Error creating product';
            
            if (xhr.responseJSON && xhr.responseJSON.error) {
                errorMessage = xhr.responseJSON.error;
            } else if (xhr.responseText) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    errorMessage = response.error || response.message || errorMessage;
                } catch (e) {
                    errorMessage = xhr.responseText;
                }
            }
            
            alert('Error: ' + errorMessage);
            $('button[onclick="AdminProducts.submitAddProduct()"]').prop('disabled', false).text('Add Product');
        }
    });
  },

  editProduct: function(productId) {
    ProductService.getProductById(productId)
        .then(function(product) {
            AdminProducts.showEditProductModal(product);
        })
        .catch(function(error) {
            alert('Error loading product data: ' + error);
        });
  },

  showEditProductModal: function(product) {
    const modalHtml = `
        <div class="modal fade" id="editProductModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Product: ${product.name}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editProductForm">
                            <input type="hidden" name="product_id" value="${product.product_id}">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Product Name*</label>
                                    <input type="text" name="name" class="form-control" value="${product.name}" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">SKU*</label>
                                    <input type="text" name="sku" class="form-control" value="${product.sku}" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Type*</label>
                                    <select name="type" class="form-select" required>
                                        <option value="">Select Type...</option>
                                        <option value="component" ${product.type === 'component' ? 'selected' : ''}>Component</option>
                                        <option value="prebuilt" ${product.type === 'prebuilt' ? 'selected' : ''}>Pre-built PC</option>
                                        <option value="peripheral" ${product.type === 'peripheral' ? 'selected' : ''}>Peripheral</option>
                                        <option value="accessory" ${product.type === 'accessory' ? 'selected' : ''}>Accessory</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Category</label>
                                    <input type="text" name="category" class="form-control" value="${product.category || ''}" placeholder="e.g., GPU, CPU, Monitor">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Brand*</label>
                                    <input type="text" name="brand" class="form-control" value="${product.brand}" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Price*</label>
                                    <input type="number" name="price" class="form-control" step="0.01" min="0" value="${product.price}" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Sale Price</label>
                                    <input type="number" name="sale_price" class="form-control" step="0.01" min="0" value="${product.sale_price || ''}">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Stock*</label>
                                    <input type="number" name="stock" class="form-control" min="0" value="${product.stock}" required>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Description</label>
                                <textarea name="description" class="form-control" rows="3">${product.description || ''}</textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Specifications</label>
                                <textarea name="specs" class="form-control" rows="2" placeholder="JSON format or plain text">${product.specs || ''}</textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="AdminProducts.submitEditProduct()">Update Product</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('#editProductModal').remove();
    $('body').append(modalHtml);
    $('#editProductModal').modal('show');
  },

  submitEditProduct: function() {
    const form = document.getElementById('editProductForm');
    const formData = new FormData(form);
    const productData = Object.fromEntries(formData.entries());
    
    const productId = productData.product_id;
    delete productData.product_id;
    
    productData.price = parseFloat(productData.price);
    productData.stock = parseInt(productData.stock);
    if (productData.sale_price) {
        productData.sale_price = parseFloat(productData.sale_price);
    } else {
        delete productData.sale_price;
    }
    
    if (!productData.name || !productData.sku || !productData.type || !productData.brand || !productData.price || productData.stock === '') {
        alert('Please fill in all required fields');
        return;
    }
    
    console.log('Updating product data:', productData);
    
    $('button[onclick="AdminProducts.submitEditProduct()"]').prop('disabled', true).text('Updating...');
    
    ProductService.updateProduct(productId, productData)
        .then(function(result) {
            alert('Product updated successfully!');
            $('#editProductModal').modal('hide');
            AdminProducts.loadProductsManagement();
        })
        .catch(function(error) {
            console.error('Error updating product:', error);
            alert('Error: ' + error);
            $('button[onclick="AdminProducts.submitEditProduct()"]').prop('disabled', false).text('Update Product');
        });
  }
};