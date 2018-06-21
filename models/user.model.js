class User {
  static isValid(payload) {
    const errors = {};
    let isFormValid = true;
    let message = '';
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // console.log(payload);
    let validEmail = re.test(String(payload.email).toLowerCase());
    if (!payload) {
      isFormValid = false;
      errors.message = 'Check the form for errors';
    }
    if (typeof payload.email !== 'string' || payload.email.length < 4 || validEmail) {
      isFormValid = false;
      errors.email = 'Please provide a valid email address';
    }
    if (typeof payload.username !== 'string' || payload.username.length < 4) {
      isFormValid = false;
      errors.username = 'The username should be at least 4 symbols';
    }
    if (payload.password.length < 4) {
      isFormValid = false;
      errors.password = 'The password should be at least 4 symbols';
    }

    if (!isFormValid) {
      message = 'Check the form for errors';
    }

    return {
      errors,
      isFormValid,
      message,
    };
  };
};

module.exports = User;