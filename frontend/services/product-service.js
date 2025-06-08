var ProductService = {
  
  getAllProducts: function() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: Constants.PROJECT_BASE_URL + "products",
        type: "GET",
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("user_token"));
        },
        success: function (products) {
          console.log('Products loaded:', products);
          resolve({ success: true, data: products });
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          console.error('Error fetching products:', XMLHttpRequest.responseText);
          reject(XMLHttpRequest.responseJSON?.error || 'Error loading products');
        }
      });
    });
  },

  getProductById: function(productId) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: Constants.PROJECT_BASE_URL + "products/" + productId,
        type: "GET",
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("user_token"));
        },
        success: function (product) {
          console.log('Product loaded:', product);
          resolve(product);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          console.error('Error fetching product:', XMLHttpRequest.responseText);
          reject(XMLHttpRequest.responseJSON?.error || 'Error loading product');
        }
      });
    });
  },

  createProduct: function(productData) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: Constants.PROJECT_BASE_URL + "products",
        type: "POST",
        data: JSON.stringify(productData),
        contentType: "application/json",
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("user_token"));
        },
        success: function (result, textStatus, xhr) {
          console.log('Product created successfully:', result);
          console.log('Status code:', xhr.status);
          resolve(result);
        },
        error: function (xhr, textStatus, errorThrown) {
          console.error('AJAX Error details:', {
            status: xhr.status,
            statusText: xhr.statusText,
            responseText: xhr.responseText,
            textStatus: textStatus,
            errorThrown: errorThrown
          });
          
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
          
          reject(errorMessage);
        }
      });
    });
  },

  updateProduct: function(productId, productData) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: Constants.PROJECT_BASE_URL + "products/" + productId,
        type: "PUT",
        data: JSON.stringify(productData),
        contentType: "application/json",
        dataType: "json",
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("user_token"));
        },
        success: function (result) {
          console.log('Product updated:', result);
          resolve(result);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          console.error('Error updating product:', XMLHttpRequest.responseText);
          reject(XMLHttpRequest.responseJSON?.error || 'Error updating product');
        }
      });
    });
  },

  deleteProduct: function(productId) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: Constants.PROJECT_BASE_URL + "products/" + productId,
        type: "DELETE",
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("user_token"));
        },
        success: function (result) {
          console.log('Product deleted:', result);
          resolve(result);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          console.error('Error deleting product:', XMLHttpRequest.responseText);
          reject(XMLHttpRequest.responseJSON?.error || 'Error deleting product');
        }
      });
    });
  },

  searchProducts: function(searchTerm) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: Constants.PROJECT_BASE_URL + "products/search?q=" + encodeURIComponent(searchTerm),
        type: "GET",
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("user_token"));
        },
        success: function (products) {
          console.log('Search results:', products);
          resolve(products);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          console.error('Error searching products:', XMLHttpRequest.responseText);
          reject(XMLHttpRequest.responseJSON?.error || 'Error searching products');
        }
      });
    });
  }
};