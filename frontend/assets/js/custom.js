$(document).ready(function() {
  var app = $.spapp({
    defaultView: "home",
    templateDir: "./",
    pageNotFound: "error_404"
  });

  app.route({
    view: "home",
    load: "pages/home.html",
    onCreate: function() { 
      console.log("Home page created");
    },
    onReady: function() { 
      console.log("Home page ready");
    }
  });
  
  app.route({
    view: "products",
    load: "pages/products.html",
    onCreate: function() {
      console.log("Products page created");
    },
    onReady: function() {
      console.log("Product page ready");
    }
  });
  
  app.route({
    view: "deals",
    load: "pages/deals.html",
    onCreate: function() {
      console.log("Deals page created");
    },
    onReady: function() {
      console.log("Deals page ready");
    }
  });
  
  app.route({
    view: "build-your-pc",
    load: "pages/build-your-pc.html",
    onCreate: function() {
      console.log("Build your pc page created");
    },
    onReady: function() {
      console.log("Build your PC page ready");
    }
  });
  
  app.route({
    view: "support",
    load: "pages/support.html",
    onCreate: function() {
      console.log("Support page created");
    },
    onReady: function() {
      console.log("Support page ready");
    }
  });

  app.route({
    view: "signup",
    load: "pages/sign-up.html",
    onCreate: function() {
      console.log("Signup page created");
    },
    onReady: function() {
      console.log("Signup page ready");
    }
  });

  app.route({
    view: "login",
    load: "pages/login.html",
    onCreate: function() {
      console.log("Login page created");
    },
    onReady: function() {
      console.log("Login page ready");
    }
  });

  app.route({
    view: "cart",
    load: "pages/shopping-cart.html",
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
  
  app.run();
});
