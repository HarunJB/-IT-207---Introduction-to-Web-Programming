var ProductService = {
  
  getAllProducts: function() {
    $.ajax({
      url: Constants.PROJECT_BASE_URL + "products",
      type: "GET",
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", localStorage.getItem("user_token"));
      },
      success: function (products) {
        console.log(products);
        if (typeof AdminService !== 'undefined' && AdminService.displayProductsTable) {
          AdminService.displayProductsTable(products);
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.error('Error fetching products:', XMLHttpRequest.responseText);
        alert('Error loading products');
      },
    });
  },

  getProductById: function(productId) {
    $.ajax({
      url: Constants.PROJECT_BASE_URL + "products/" + productId,
      type: "GET",
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", localStorage.getItem("user_token"));
      },
      success: function (product) {
        console.log('Product loaded:', product);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.error('Error fetching product:', XMLHttpRequest.responseText);
        alert('Error loading product');
      },
    });
  },

  createProduct: function(productData) {
    $.ajax({
      url: Constants.PROJECT_BASE_URL + "products",
      type: "POST",
      data: JSON.stringify(productData),
      contentType: "application/json",
      dataType: "json",
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", localStorage.getItem("user_token"));
      },
      success: function (result) {
        console.log('Product created:', result);
        alert('Product created successfully');
        ProductService.getAllProducts(); 
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.error('Error creating product:', XMLHttpRequest.responseText);
        alert('Error creating product');
      },
    });
  },

  updateProduct: function(productId, productData) {
    $.ajax({
      url: Constants.PROJECT_BASE_URL + "products/" + productId,
      type: "PUT",
      data: JSON.stringify(productData),
      contentType: "application/json",
      dataType: "json",
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", localStorage.getItem("user_token"));
      },
      success: function (result) {
        console.log('Product updated:', result);
        alert('Product updated successfully');
        ProductService.getAllProducts(); 
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.error('Error updating product:', XMLHttpRequest.responseText);
        alert('Error updating product');
      },
    });
  },

  deleteProduct: function(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
      $.ajax({
        url: Constants.PROJECT_BASE_URL + "products/" + productId,
        type: "DELETE",
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", localStorage.getItem("user_token"));
        },
        success: function (result) {
          console.log('Product deleted:', result);
          alert('Product deleted successfully');
          ProductService.getAllProducts(); 
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          console.error('Error deleting product:', XMLHttpRequest.responseText);
          alert('Error deleting product');
        },
      });
    }
  },

  searchProducts: function(searchTerm) {
    $.ajax({
      url: Constants.PROJECT_BASE_URL + "products/search?q=" + encodeURIComponent(searchTerm),
      type: "GET",
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", localStorage.getItem("user_token"));
      },
      success: function (products) {
        console.log('Search results:', products);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.error('Error searching products:', XMLHttpRequest.responseText);
        alert('Error searching products');
      },
    });
  }
};