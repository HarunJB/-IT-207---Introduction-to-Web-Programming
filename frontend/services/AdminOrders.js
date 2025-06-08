var AdminOrders = {
  
  loadOrdersManagement: function() {
    AdminService.showLoading();
    
    $.ajax({
        url: Constants.PROJECT_BASE_URL + "orders",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("user_token"));
        },
        success: function (orders) {
            console.log('Orders loaded:', orders);
            AdminOrders.displayOrdersTable(orders);
        },
        error: function (xhr) {
            console.error('Error loading orders:', xhr);
            $('#adminContent .container .row .col-12').html(`
                <div class="text-center py-5">
                    <div class="alert alert-danger">
                        Error loading orders: ${xhr.responseJSON?.error || 'Unknown error'}
                    </div>
                </div>
            `);
        }
    });
  },

  displayOrdersTable: function(orders) {
    if (!orders || !Array.isArray(orders)) {
        orders = [];
    }

    console.log('Displaying orders table with', orders.length, 'orders');

    const ordersTableHtml = `
        <div class="admin-content-area">
            <h3><i class="fas fa-shopping-cart me-2"></i>Order Management</h3>
            <p>Manage customer orders and order statuses. Total: ${orders.length} orders</p>
            
            <div class="admin-btn-group">
                <button class="btn btn-admin-primary" onclick="AdminOrders.showAddOrderModal()">
                    <i class="fas fa-plus me-2"></i>Add New Order
                </button>
            </div>

            <div class="admin-table">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>User ID</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Payment</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="orders-table-body">
                        ${orders.length > 0 ? orders.map(order => `
                            <tr id="order-row-${order.order_id}">
                                <td>#${order.order_id}</td>
                                <td>#${order.user_id}</td>
                                <td>
                                    <span class="badge ${AdminOrders.getStatusBadgeClass(order.status)}">
                                        ${order.status.toUpperCase()}
                                    </span>
                                </td>
                                <td>${order.order_date}</td>
                                <td>$${parseFloat(order.total || 0).toFixed(2)}</td>
                                <td>${order.payment_method || 'N/A'}</td>
                                <td>
                                    <button class="btn btn-sm btn-outline-info me-1" onclick="AdminOrders.viewOrder(${order.order_id})" title="View Details">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-warning me-1" onclick="AdminOrders.updateStatus(${order.order_id})" title="Update Status">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" onclick="AdminOrders.deleteOrder(${order.order_id})" title="Delete Order">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('') : `
                            <tr>
                                <td colspan="7" class="text-center">No orders found</td>
                            </tr>
                        `}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    $('#adminContent .container .row .col-12').html(ordersTableHtml);
    console.log('Orders table updated with', $('#orders-table-body tr').length, 'rows');
  },

  getStatusBadgeClass: function(status) {
    switch(status.toLowerCase()) {
        case 'pending': return 'bg-warning text-dark';
        case 'processing': return 'bg-info';
        case 'shipped': return 'bg-primary';
        case 'delivered': return 'bg-success';
        case 'cancelled': return 'bg-danger';
        default: return 'bg-secondary';
    }
  },

  viewOrder: function(orderId) {
    $.ajax({
        url: Constants.PROJECT_BASE_URL + "orders/" + orderId,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("user_token"));
        },
        success: function (order) {
            AdminOrders.showOrderDetailsModal(order);
        },
        error: function (xhr) {
            alert('Error loading order details: ' + (xhr.responseJSON?.error || 'Unknown error'));
        }
    });
  },

  showOrderDetailsModal: function(order) {
    const modalHtml = `
        <div class="modal fade" id="viewOrderModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Order Details #${order.order_id}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <h6>Order Information</h6>
                                <p><strong>Order ID:</strong> #${order.order_id}</p>
                                <p><strong>User ID:</strong> #${order.user_id}</p>
                                <p><strong>Date:</strong> ${order.order_date}</p>
                                <p><strong>Status:</strong> 
                                    <span class="badge ${AdminOrders.getStatusBadgeClass(order.status)}">
                                        ${order.status.toUpperCase()}
                                    </span>
                                </p>
                            </div>
                            <div class="col-md-6">
                                <h6>Payment & Shipping</h6>
                                <p><strong>Payment:</strong> ${order.payment_method || 'N/A'}</p>
                                <p><strong>Subtotal:</strong> $${parseFloat(order.subtotal || 0).toFixed(2)}</p>
                                <p><strong>Shipping:</strong> $${parseFloat(order.shipping || 0).toFixed(2)}</p>
                                <p><strong>Tax:</strong> $${parseFloat(order.tax || 0).toFixed(2)}</p>
                                <p><strong>Total:</strong> <span class="h5 text-success">$${parseFloat(order.total || 0).toFixed(2)}</span></p>
                            </div>
                        </div>
                        ${order.shipping_address ? `
                            <hr>
                            <h6>Shipping Address</h6>
                            <p>${order.shipping_address}</p>
                        ` : ''}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-warning" onclick="AdminOrders.updateStatus(${order.order_id})">
                            <i class="fas fa-edit me-1"></i>Update Status
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('#viewOrderModal').remove();
    $('body').append(modalHtml);
    $('#viewOrderModal').modal('show');
  },

  deleteOrder: function(orderId) {
    if (confirm(`Are you sure you want to delete order #${orderId}?`)) {
        $(`button[onclick="AdminOrders.deleteOrder(${orderId})"]`).prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i>');
        
        $.ajax({
            url: Constants.PROJECT_BASE_URL + "orders/" + orderId,
            type: "DELETE",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("user_token"));
            },
            success: function (result) {
                alert('Order deleted successfully!');
                AdminOrders.loadOrdersManagement();
            },
            error: function (xhr) {
                alert('Error deleting order: ' + (xhr.responseJSON?.error || 'Unknown error'));
                $(`button[onclick="AdminOrders.deleteOrder(${orderId})"]`).prop('disabled', false).html('<i class="fas fa-trash"></i>');
            }
        });
    }
  },

  // ADD ORDER MODAL
  showAddOrderModal: function() {
    const modalHtml = `
        <div class="modal fade" id="addOrderModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add New Order</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="addOrderForm">
                            <div class="mb-3">
                                <label class="form-label">User ID*</label>
                                <input type="number" name="user_id" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Status*</label>
                                <select name="status" class="form-select" required>
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Subtotal*</label>
                                    <input type="number" name="subtotal" class="form-control" step="0.01" required>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Shipping*</label>
                                    <input type="number" name="shipping" class="form-control" step="0.01" value="25.00" required>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Tax*</label>
                                    <input type="number" name="tax" class="form-control" step="0.01" required>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Total*</label>
                                <input type="number" name="total" class="form-control" step="0.01" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Payment Method</label>
                                <input type="text" name="payment_method" class="form-control" placeholder="Credit Card, PayPal, etc.">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Shipping Address</label>
                                <textarea name="shipping_address" class="form-control" rows="2"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="AdminOrders.submitAddOrder()">Add Order</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('#addOrderModal').remove();
    $('body').append(modalHtml);
    $('#addOrderModal').modal('show');
  },

  submitAddOrder: function() {
    const form = document.getElementById('addOrderForm');
    const formData = new FormData(form);
    const orderData = Object.fromEntries(formData.entries());
    
    orderData.user_id = parseInt(orderData.user_id);
    orderData.subtotal = parseFloat(orderData.subtotal);
    orderData.shipping = parseFloat(orderData.shipping);
    orderData.tax = parseFloat(orderData.tax);
    orderData.total = parseFloat(orderData.total);
    
    if (!orderData.user_id || !orderData.status || !orderData.subtotal) {
        alert('Please fill in all required fields');
        return;
    }
    
    $('button[onclick="AdminOrders.submitAddOrder()"]').prop('disabled', true).text('Adding...');
    
    $.ajax({
        url: Constants.PROJECT_BASE_URL + "orders",
        type: "POST",
        data: JSON.stringify(orderData),
        contentType: "application/json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("user_token"));
        },
        success: function (result) {
            alert('Order added successfully!');
            $('#addOrderModal').modal('hide');
            AdminOrders.loadOrdersManagement();
        },
        error: function (xhr) {
            alert('Error: ' + (xhr.responseJSON?.error || 'Error adding order'));
            $('button[onclick="AdminOrders.submitAddOrder()"]').prop('disabled', false).text('Add Order');
        }
    });
  },

  // UPDATE ORDER STATUS
  updateStatus: function(orderId) {
    const modalHtml = `
        <div class="modal fade" id="updateStatusModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Update Order Status #${orderId}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="updateStatusForm">
                            <input type="hidden" name="order_id" value="${orderId}">
                            <div class="mb-3">
                                <label class="form-label">New Status*</label>
                                <select name="status" class="form-select" required>
                                    <option value="">Select Status...</option>
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-warning" onclick="AdminOrders.submitStatusUpdate()">Update Status</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('#updateStatusModal').remove();
    $('body').append(modalHtml);
    $('#updateStatusModal').modal('show');
  },

  submitStatusUpdate: function() {
    const form = document.getElementById('updateStatusForm');
    const formData = new FormData(form);
    const statusData = Object.fromEntries(formData.entries());
    
    if (!statusData.status) {
        alert('Please select a status');
        return;
    }
    
    const orderId = statusData.order_id;
    
    $('button[onclick="AdminOrders.submitStatusUpdate()"]').prop('disabled', true).text('Updating...');
    
    $.ajax({
        url: Constants.PROJECT_BASE_URL + "orders/" + orderId,
        type: "PUT",
        data: JSON.stringify({ status: statusData.status }),
        contentType: "application/json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("user_token"));
        },
        success: function (result) {
            alert('Order status updated successfully!');
            $('#updateStatusModal').modal('hide');
            $('#viewOrderModal').modal('hide');
            AdminOrders.loadOrdersManagement();
        },
        error: function (xhr) {
            alert('Error: ' + (xhr.responseJSON?.error || 'Error updating status'));
            $('button[onclick="AdminOrders.submitStatusUpdate()"]').prop('disabled', false).text('Update Status');
        }
    });
  }
};