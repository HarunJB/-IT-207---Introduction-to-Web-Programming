var RegisterService = {

  init: function () {
    var token = localStorage.getItem("user_token");
    if (token && token !== undefined) {
      window.location.replace("index.html");
    }
    
    $("#register-form").validate({
      submitHandler: function (form) {
        var entity = Object.fromEntries(new FormData(form).entries());
        RegisterService.register(entity);
      },
    });
  },

  register: function (entity) {

    const errors = [];
    
    if (!entity.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(entity.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!entity.password || entity.password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }
    
    if (entity.password !== entity.confirmPassword) {
        errors.push('Passwords do not match');
    }
    
    if (!entity.firstName || entity.firstName.trim().length < 2) {
        errors.push('First name must be at least 2 characters');
    }
    
    if (!entity.lastName || entity.lastName.trim().length < 2) {
        errors.push('Last name must be at least 2 characters');
    }
    
    if (errors.length > 0) {
        this.showValidationErrors(errors);
        return;
    }

    if (entity.password !== entity.confirmPassword) {
      toastr.error('Passwords do not match');
      return;
    }
    
    if (!entity.termsAgree) {
      toastr.error('You must agree to the Terms of Service');
      return;
    }

    const snakeCaseEntity = {
        first_name: entity.firstName,
        last_name: entity.lastName,
        email: entity.email,
        phone: entity.phone,
        address: entity.address,
        password: entity.password
    };
    
    delete entity.confirmPassword;
    delete entity.termsAgree;
    delete entity.newsletterSignup;
    
    entity = snakeCaseEntity;

    $.ajax({
      url: Constants.PROJECT_BASE_URL + "auth/register",
      type: "POST",
      data: JSON.stringify(entity),
      contentType: "application/json",
      dataType: "json",
      success: function (result) {
        console.log(result);
        toastr.success('Account created successfully! Please login.');
        setTimeout(function() {
          window.location.replace("login.html");
        }, 2000);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        toastr.error(XMLHttpRequest?.responseText ? XMLHttpRequest.responseText : 'Registration Error');
      },
    });
  },

  showValidationErrors: function(errors) {
    const errorHtml = `
        <div class="alert alert-danger">
            <ul class="mb-0">
                ${errors.map(error => `<li>${error}</li>`).join('')}
            </ul>
        </div>
    `;
    $('.signup-form-container').prepend(errorHtml);
    setTimeout(() => $('.alert-danger').fadeOut(), 5000);
}
};