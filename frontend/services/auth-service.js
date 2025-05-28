var AuthService = {
  init: function () {
    var token = localStorage.getItem("user_token");
    if (token && token !== undefined) {
      window.location.replace("index.html");
    }
    
    $("#loginForm").validate({
      submitHandler: function (form) {
        var entity = Object.fromEntries(new FormData(form).entries());
        AuthService.login(entity);
      },
    });
    
    $("#signupForm").validate({
      submitHandler: function (form) {
        var entity = Object.fromEntries(new FormData(form).entries());
        AuthService.register(entity);
      },
    });
  },

  login: function (entity) {
    $.ajax({
      url: Constants.PROJECT_BASE_URL + "auth/login",
      type: "POST",
      data: JSON.stringify(entity),
      contentType: "application/json",
      dataType: "json",
      success: function (result) {
        console.log(result);
        localStorage.setItem("user_token", result.data.token);
        window.location.replace("index.html");
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        alert(XMLHttpRequest?.responseText ? XMLHttpRequest.responseText : 'Login Error');
      },
    });
  },

  register: function (entity) {
    entity.name = entity.firstName + ' ' + entity.lastName;
    entity.first_name = entity.firstName;
    entity.last_name = entity.lastName;
    
    $.ajax({
      url: Constants.PROJECT_BASE_URL + "auth/register",
      type: "POST",
      data: JSON.stringify(entity),
      contentType: "application/json",
      dataType: "json",
      success: function (result) {
        console.log(result);
        alert('Account created successfully! Please login.');
        window.location.replace("login.html");
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        alert(XMLHttpRequest?.responseText ? XMLHttpRequest.responseText : 'Registration Error');
      },
    });
  },

  logout: function () {
    localStorage.clear();
    window.location.replace("login.html");
  },

  generateMenuItems: function(){
    const token = localStorage.getItem("user_token");
    const user = Utils.parseJwt(token).user;
    
    if (user && user.is_admin !== undefined) {
      let nav = "";
      let main = "";
      
      const commonNavItems = 
        '<li class="nav-item mx-0 mx-lg-1">' +
          '<a class="nav-link py-3 px-0 px-lg-3 rounded" href="#products">Products</a>' +
        '</li>' +
        '<li class="nav-item mx-0 mx-lg-1">' +
          '<a class="nav-link py-3 px-0 px-lg-3 rounded" href="#deals">Deals</a>' +
        '</li>' +
        '<li class="nav-item mx-0 mx-lg-1">' +
          '<a class="nav-link py-3 px-0 px-lg-3 rounded" href="#build-your-pc">Build Your PC</a>' +
        '</li>' +
        '<li class="nav-item mx-0 mx-lg-1">' +
          '<a class="nav-link py-3 px-0 px-lg-3 rounded" href="#support">Support</a>' +
        '</li>';

      const logoutButton = 
        '<li>' +
          '<button class="btn btn-primary" onclick="AuthService.logout()">Logout</button>' +
        '</li>';

      if (user.is_admin == 1) {
        nav = commonNavItems +
          '<li class="nav-item mx-0 mx-lg-1">' +
            '<a class="nav-link py-3 px-0 px-lg-3 rounded" href="#admin">Admin Panel</a>' +
          '</li>' +
          logoutButton;
          
        main = 
          '<section id="products" data-load="pages/products.html"></section>' +
          '<section id="deals" data-load="pages/deals.html"></section>' +
          '<section id="build-your-pc" data-load="pages/build-your-pc.html"></section>' +
          '<section id="support" data-load="pages/support.html"></section>' +
          '<section id="admin" data-load="pages/admin.html"></section>';
      } else {
        nav = commonNavItems + logoutButton;
        
        main = 
          '<section id="products" data-load="pages/products.html"></section>' +
          '<section id="deals" data-load="pages/deals.html"></section>' +
          '<section id="build-your-pc" data-load="pages/build-your-pc.html"></section>' +
          '<section id="support" data-load="pages/support.html"></section>';
      }

      $(".navbar-nav.mx-auto").html(nav);
      $("#spapp").html(main);
      
    } else {
      window.location.replace("login.html");
    }
  }
};