var AdminUsers = {
  
  loadUsersManagement: function() {
    AdminService.showLoading();
    
    UserService.getAllUsers()
      .then(function(response) {
        if (response.success) {
          AdminUsers.displayUsersTable(response.data);
        } else {
          $('#adminContent .container .row .col-12').html(`
            <div class="text-center py-5">
              <div class="alert alert-danger">
                Failed to load users: ${response.error || 'Unknown error'}
              </div>
            </div>
          `);
        }
      })
      .catch(function(error) {
        console.error('Error loading users:', error);
        $('#adminContent .container .row .col-12').html(`
          <div class="text-center py-5">
            <div class="alert alert-danger">
              Error loading users: ${error.error || error.message || 'Unknown error'}
            </div>
          </div>
        `);
      });
  },

  displayUsersTable: function(users) {
    if (!users || !Array.isArray(users)) {
        users = [];
    }

    console.log('Displaying users table with', users.length, 'users');

    const usersTableHtml = `
        <div class="admin-content-area">
            <h3><i class="fas fa-users me-2"></i>User Management</h3>
            <p>Manage user accounts, roles, and permissions. Total: ${users.length} users</p>
            
            <div class="admin-btn-group">
                <button class="btn btn-admin-primary" onclick="AdminUsers.showAddUserModal()">
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
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="users-table-body">
                        ${users.length > 0 ? users.map(user => `
                            <tr id="user-row-${user.user_id}">
                                <td>#${user.user_id}</td>
                                <td>${user.first_name} ${user.last_name}</td>
                                <td>${user.email}</td>
                                <td>${user.phone || 'N/A'}</td>
                                <td>
                                    <span class="badge ${user.is_admin === 1 ? 'bg-danger' : 'bg-primary'}">
                                        ${user.is_admin === 1 ? 'Admin' : 'User'}
                                    </span>
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary me-1" onclick="AdminUsers.editUser(${user.user_id})">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" onclick="AdminUsers.deleteUser(${user.user_id})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('') : `
                            <tr>
                                <td colspan="6" class="text-center">No users found</td>
                            </tr>
                        `}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    $('#adminContent .container .row .col-12').html(usersTableHtml);
    console.log('Users table updated with', $('#users-table-body tr').length, 'rows');
  },

  deleteUser: function(userId) {
    const userRow = $(`button[onclick="AdminUsers.deleteUser(${userId})"]`).closest('tr');
    const userName = userRow.find('td:nth-child(2)').text();
    
    if (confirm(`Are you sure you want to delete user: ${userName}?`)) {
        $(`button[onclick="AdminUsers.deleteUser(${userId})"]`).prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i>');
        
        $.ajax({
            url: Constants.PROJECT_BASE_URL + "users/" + userId,
            type: "DELETE",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("user_token"));
            },
            success: function (result) {
                console.log('User deleted:', result);
                alert('User deleted successfully!');
                AdminUsers.loadUsersManagement();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.error('Error deleting user:', XMLHttpRequest.responseText);
                alert('Error deleting user: ' + (XMLHttpRequest.responseJSON?.error || 'Unknown error'));
                $(`button[onclick="AdminUsers.deleteUser(${userId})"]`).prop('disabled', false).html('<i class="fas fa-trash"></i>');
            }
        });
    }
  },

  showAddUserModal: function() {
    const modalHtml = `
        <div class="modal fade" id="addUserModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add New User</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="addUserForm">
                            <div class="mb-3">
                                <label class="form-label">First Name*</label>
                                <input type="text" name="first_name" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Last Name*</label>
                                <input type="text" name="last_name" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email*</label>
                                <input type="email" name="email" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Password*</label>
                                <input type="password" name="password" class="form-control" required minlength="6">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Phone</label>
                                <input type="tel" name="phone" class="form-control">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Address</label>
                                <textarea name="address" class="form-control" rows="2"></textarea>
                            </div>
                            <div class="form-check mb-3">
                                <input type="checkbox" name="is_admin" class="form-check-input" id="isAdminCheck">
                                <label class="form-check-label" for="isAdminCheck">
                                    Admin User
                                </label>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="AdminUsers.submitAddUser()">Add User</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('#addUserModal').remove();
    $('body').append(modalHtml);
    $('#addUserModal').modal('show');
  },

  submitAddUser: function() {
    const form = document.getElementById('addUserForm');
    const formData = new FormData(form);
    const userData = Object.fromEntries(formData.entries());
    
    userData.is_admin = userData.is_admin ? 1 : 0;
    
    if (!userData.phone) delete userData.phone;
    if (!userData.address) delete userData.address;
    
    if (!userData.first_name || !userData.last_name || !userData.email || !userData.password) {
        alert('Please fill in all required fields');
        return;
    }
    
    console.log('Sending user data:', userData);
    
    $('button[onclick="AdminUsers.submitAddUser()"]').prop('disabled', true).text('Adding...');
    
    $.ajax({
        url: Constants.PROJECT_BASE_URL + "users",
        type: "POST",
        data: JSON.stringify(userData),
        contentType: "application/json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("user_token"));
        },
        success: function (result) {
            console.log('User created successfully:', result);
            alert('User added successfully!');
            $('#addUserModal').modal('hide');
            AdminUsers.loadUsersManagement();
        },
        error: function (xhr) {
            console.error('Error creating user:', xhr);
            console.log('Response text:', xhr.responseText);
            console.log('Status:', xhr.status);
            
            let errorMessage = 'Error creating user';
            
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
            $('button[onclick="AdminUsers.submitAddUser()"]').prop('disabled', false).text('Add User');
        }
    });
  },

  editUser: function(userId) {
    $.ajax({
        url: Constants.PROJECT_BASE_URL + "users/" + userId,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("user_token"));
        },
        success: function (user) {
            AdminUsers.showEditUserModal(user);
        },
        error: function (xhr) {
            alert('Error loading user data: ' + (xhr.responseJSON?.error || 'Unknown error'));
        }
    });
  },

  showEditUserModal: function(user) {
    const modalHtml = `
        <div class="modal fade" id="editUserModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit User: ${user.first_name} ${user.last_name}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editUserForm">
                            <input type="hidden" name="user_id" value="${user.user_id}">
                            <div class="mb-3">
                                <label class="form-label">First Name*</label>
                                <input type="text" name="first_name" class="form-control" value="${user.first_name}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Last Name*</label>
                                <input type="text" name="last_name" class="form-control" value="${user.last_name}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email*</label>
                                <input type="email" name="email" class="form-control" value="${user.email}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Password (leave blank to keep current)</label>
                                <input type="password" name="password" class="form-control" minlength="6">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Phone</label>
                                <input type="tel" name="phone" class="form-control" value="${user.phone || ''}">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Address</label>
                                <textarea name="address" class="form-control" rows="2">${user.address || ''}</textarea>
                            </div>
                            <div class="form-check mb-3">
                                <input type="checkbox" name="is_admin" class="form-check-input" id="editIsAdminCheck" ${user.is_admin == 1 ? 'checked' : ''}>
                                <label class="form-check-label" for="editIsAdminCheck">
                                    Admin User
                                </label>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="AdminUsers.submitEditUser()">Update User</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('#editUserModal').remove();
    $('body').append(modalHtml);
    $('#editUserModal').modal('show');
  },

  submitEditUser: function() {
    const form = document.getElementById('editUserForm');
    const formData = new FormData(form);
    const userData = Object.fromEntries(formData.entries());
    
    const userId = userData.user_id;
    delete userData.user_id;
    
    userData.is_admin = userData.is_admin ? 1 : 0;
    
    if (!userData.password) {
        delete userData.password;
    }
    
    if (!userData.phone) delete userData.phone;
    if (!userData.address) delete userData.address;
    
    if (!userData.first_name || !userData.last_name || !userData.email) {
        alert('Please fill in all required fields');
        return;
    }
    
    console.log('Updating user data:', userData);
    
    $('button[onclick="AdminUsers.submitEditUser()"]').prop('disabled', true).text('Updating...');
    
    $.ajax({
        url: Constants.PROJECT_BASE_URL + "users/" + userId,
        type: "PUT",
        data: JSON.stringify(userData),
        contentType: "application/json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("user_token"));
        },
        success: function (result) {
            console.log('User updated successfully:', result);
            alert('User updated successfully!');
            $('#editUserModal').modal('hide');
            AdminUsers.loadUsersManagement();
        },
        error: function (xhr) {
            console.error('Error updating user:', xhr);
            console.log('Response text:', xhr.responseText);
            console.log('Status:', xhr.status);
            
            let errorMessage = 'Error updating user';
            
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
            $('button[onclick="AdminUsers.submitEditUser()"]').prop('disabled', false).text('Update User');
        }
    });
  }
};