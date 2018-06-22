const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
const passwordReg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,}$/;

class User {
  static isValid(payload) {
    const errors = {};
    let isFormValid = true;
    let message = '';
    let validEmail = emailReg.test(String(payload.email).toLowerCase());
    let validPass = passwordReg.test(String(payload.password).toLowerCase());
    if (!payload) {
      isFormValid = false;
      errors.message = 'Check the form for errors';
    }
    if (typeof payload.email !== 'string' || payload.email.length < 4 || !validEmail) {
      isFormValid = false;
      errors.email = 'Please provide a valid email address';
    }
    if (typeof payload.username !== 'string' || payload.username.length < 4) {
      isFormValid = false;
      errors.username = 'The username should be at least 4 symbols';
    }
    if (!validPass) {
      isFormValid = false;
      errors.password = 'The password should be minimum six characters, at least one letter, one number and one special character';
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

  static isValidLogin(payload) {
    const errors = {};
    let isFormValid = true;
    let message = '';
    let validEmail = emailReg.test(String(payload.email).toLowerCase());
    let validPass = passwordReg.test(String(payload.password).toLowerCase());
    if (!payload) {
      isFormValid = false;
      errors.message = 'Check the form for errors';
    }
    if (typeof payload.email !== 'string' || payload.email.length < 4 || !validEmail) {
      isFormValid = false;
      errors.email = 'Please provide a valid email address';
    }
    if (!validPass) {
      isFormValid = false;
      errors.password = 'Check your password for errors';
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
