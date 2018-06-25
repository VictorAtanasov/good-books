class Book {
  static isValid(payload) {
    const errors = {};
    let isFormValid = true;
    let message = '';
    if (!payload) {
      isFormValid = false;
      errors.message = 'All inputs are required';
    }
    if (payload.title.length < 1) {
      isFormValid = false;
      errors.title = 'Title must be more than 1 symbols';
    }
    if (typeof payload.author !== 'string' || payload.author.length < 3) {
      isFormValid = false;
      errors.author = 'Author must be more than 2 symbols';
    }
    if (typeof payload.description !== 'string' || payload.description.length < 10) {
      isFormValid = false;
      errors.description = 'Description must be more than 10 symbols';
    }
    if (typeof payload.category !== 'string' || payload.category.length < 3) {
      isFormValid = false;
      errors.category = 'Category must be more than 2 symbols';
    }
    if (typeof payload.user !== 'string' || payload.user.length < 4) {
      isFormValid = false;
      errors.user = 'Plesee provide a valid username';
    }

    if (!isFormValid) {
      message = 'Check the form for errors';
    }
    return {
      errors,
      isFormValid,
      message,
    };
  }

  static isValidOnUpdate(payload) {
    const errors = {};
    let isFormValid = true;
    let message = '';
    if (!payload || Object.keys(payload).length < 1) {
      isFormValid = false;
      errors.message = 'Please provide at least one book field for update';
    }

    if (payload.author) {
      if (typeof payload.author !== 'string' || payload.author.length < 3) {
        isFormValid = false;
        errors.author = 'Author must be more than 2 symbols';
      }
    }

    if (payload.title) {
      if (payload.title.length < 1) {
        isFormValid = false;
        errors.title = 'Title must be more than 1 symbols';
      }
    }

    if (payload.description) {
      if (typeof payload.description !== 'string' || payload.description.length < 10) {
        isFormValid = false;
        errors.description = 'Description must be more than 10 symbols';
      }
    }

    if (payload.category) {
        if (typeof payload.category !== 'string' || payload.category.length < 3) {
          isFormValid = false;
          errors.category = 'Category must be more than 2 symbols';
        }
    }

    return {
        errors,
        isFormValid,
        message,
    };
  }
};

module.exports = Book;
