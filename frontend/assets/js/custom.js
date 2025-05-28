$(document).ready(function() {
  var app = $.spapp({
    defaultView: "home",
    templateDir: "./",
    pageNotFound: "error_404"
  });

  app.route({
    view: "home",
    load: "tpl/home.html",
    onCreate: function() { 
      console.log("Home page created");
    },
    onReady: function() { 
      console.log("Home page ready");
    }
  });
  
  app.route({
    view: "products",
    load: "tpl/products.html",
    onCreate: function() {
      console.log("Products page created");
    },
    onReady: function() {
      console.log("Product page ready");
    }
  });
  
  app.route({
    view: "deals",
    load: "tpl/deals.html",
    onCreate: function() {
      console.log("Deals page created");
    },
    onReady: function() {
      console.log("Deals page ready");
    }
  });
  
  app.route({
    view: "build-your-pc",
    load: "tpl/build-your-pc.html",
    onCreate: function() {
      console.log("Build your pc page created");
    },
    onReady: function() {
      console.log("Build your PC page ready");
    }
  });
  
  app.route({
    view: "support",
    load: "tpl/support.html",
    onCreate: function() {
      console.log("Support page created");
    },
    onReady: function() {
      console.log("Support page ready");
    }
  });

  app.route({
    view: "cart",
    load: "tpl/shopping-cart.html",
    onCreate: function() {
      console.log("Cart page created");
      if (typeof initializeCart === 'function') {
        initializeCart();
      }
    },
    onReady: function() {
      console.log("Cart page ready");
      if (typeof updateCartDisplay === 'function') {
        updateCartDisplay();
      }
    }
  });

  app.route({
    view: "admin",
    load: "tpl/admin.html",
    onCreate: function() {
      console.log("Admin page created");
      
      const user = Utils.getCurrentUser();
      if (!user || user.is_admin != 1) {
        window.location.hash = "home";
        Utils.showAlert('danger', 'Access denied. Admin privileges required.');
        return;
      }
    },
    onReady: function() {
      console.log("Admin page ready");
      if (typeof AdminService !== 'undefined') {
        AdminService.init();
      }
    }
  });
  
  app.run();
});
