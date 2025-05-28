var UserService = {
  
  checkAdminStatus: function() {
    var token = localStorage.getItem("user_token");
    if (!token) return;

    $.ajax({
      url: Constants.PROJECT_BASE_URL + "users/me",
      type: "GET",
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function(result) {
        if (result.success && result.data && (result.data.is_admin === 1)) {
          $('.admin-link').show();
          $('#admin').show();
          $('#admin').load('tpl/admin.html', function() {
            AdminService.init();
          });
        } else {
          $('.admin-link').hide();
          $('#admin').hide();
        }
      },
      error: function() {
        $('.admin-link').hide();
        $('#admin').hide();
      }
    });
  },

  getAllUsers: function() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: Constants.PROJECT_BASE_URL + "users",
        type: "GET",
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("user_token")
        },
        success: function(result) {
          resolve(result);
        },
        error: function(xhr, status, error) {
          reject({
            message: error,
            status: xhr.status,
            response: xhr.responseJSON
          });
        }
      });
    });
  },

  init: function() {
    var token = localStorage.getItem("user_token");
    if (token) {
      $("#logout-btn").show();
      
      $.ajax({
        url: Constants.PROJECT_BASE_URL + "users/me",
        type: "GET",
        headers: {
          'Authorization': 'Bearer ' + token
        },
        success: function(result) {
          if (result.success && result.data && (result.data.is_admin === 1)) {
            $('.admin-link').show();
            $('#admin').show();
            $('#admin').load('tpl/admin.html', function() {
              AdminService.init();
            });
          } else {
            $('.admin-link').hide();
            $('#admin').hide();
          }
        },
        error: function() {
          $('.admin-link').hide();
          $('#admin').hide();
        }
      });
    } else {
      // Hide logout button and admin menu if not logged in
      $("#logout-btn").hide();
      $('.admin-link').hide();
      $('#admin').hide();
    }

    // Add logout button click handler
    $("#logout-btn").off('click').on('click', function(e) {
      e.preventDefault();
      UserService.logout();
    });

    // Initialize login form if it exists
    if (document.getElementById('login-form')) {
      $("#login-form").validate({
        submitHandler: function (form) {
          var entity = Object.fromEntries(new FormData(form).entries());
          UserService.login(entity);
        },
      });
    }
  },

  logout: function() {
    localStorage.removeItem("user_token");
    $("#logout-btn").hide();
    $("#admin-menu").hide();
    window.location.href = "login.html";
  },

  login: function(entity) {
    $.ajax({
      url: Constants.PROJECT_BASE_URL + "auth/login",
      type: "POST",
      data: JSON.stringify({
        email: entity.email,
        password: entity.password
      }),
      contentType: "application/json",
      dataType: "json",
      success: function (result) {
        if (result.success) {
          localStorage.setItem("user_token", result.data.token);
          toastr.success('Login successful!');
          setTimeout(function() {
            window.location.replace("index.html");
          }, 2000);
        } else {
          toastr.error(result.error || 'Login failed');
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        toastr.error(XMLHttpRequest?.responseText ? XMLHttpRequest.responseText : 'Login Error');
      },
    });
  },

  getAllUsers: function() {
    $.ajax({
      url: Constants.PROJECT_BASE_URL + "users",
      type: "GET",
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", localStorage.getItem("user_token"));
      },
      success: function (users) {
        console.log(users);
        AdminService.displayUsersTable(users);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.error('Error fetching users:', XMLHttpRequest.responseText);
        alert('Error loading users');
      },
    });
  },

  getUserById: function(userId) {
    $.ajax({
      url: Constants.PROJECT_BASE_URL + "users/" + userId,
      type: "GET",
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", localStorage.getItem("user_token"));
      },
      success: function (user) {
        console.log('User loaded:', user);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.error('Error fetching user:', XMLHttpRequest.responseText);
        alert('Error loading user');
      },
    });
  },

  createUser: function(userData) {
    $.ajax({
      url: Constants.PROJECT_BASE_URL + "users",
      type: "POST",
      data: JSON.stringify(userData),
      contentType: "application/json",
      dataType: "json",
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", localStorage.getItem("user_token"));
      },
      success: function (result) {
        console.log('User created:', result);
        alert('User created successfully');
        UserService.getAllUsers(); 
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.error('Error creating user:', XMLHttpRequest.responseText);
        alert('Error creating user');
      },
    });
  },

  updateUser: function(userId, userData) {
    $.ajax({
      url: Constants.PROJECT_BASE_URL + "users/" + userId,
      type: "PUT",
      data: JSON.stringify(userData),
      contentType: "application/json",
      dataType: "json",
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", localStorage.getItem("user_token"));
      },
      success: function (result) {
        console.log('User updated:', result);
        alert('User updated successfully');
        UserService.getAllUsers(); 
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.error('Error updating user:', XMLHttpRequest.responseText);
        alert('Error updating user');
      },
    });
  },

  deleteUser: function(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
      $.ajax({
        url: Constants.PROJECT_BASE_URL + "users/" + userId,
        type: "DELETE",
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", localStorage.getItem("user_token"));
        },
        success: function (result) {
          console.log('User deleted:', result);
          alert('User deleted successfully');
          UserService.getAllUsers(); 
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          console.error('Error deleting user:', XMLHttpRequest.responseText);
          alert('Error deleting user');
        },
      });
    }
  }
};