class BaseData {
  constructor(db, ModelClass, validator) {
    this.db = db.db();
    this.ModelClass = ModelClass;
    this.validator = validator;
    this.collectionName = this.getCollectionName();
    this.collection = this.db.collection(this.collectionName);
  };

  getAll() {
    return this.collection.find({})
      .toArray();
  }

  create(payload) {
    let validation = this.validator.isValid(payload);
    if (!validation.isFormValid) {
      return Promise.reject(validation);
    }
    return this.collection.insert(payload);
  }

  register(payload) {
    let validation = this.validator.isValid(payload);
    if (!validation.isFormValid) {
      return Promise.reject(validation);
    }
    this.findByKey('email', payload.email)
      .then((isUsed) => {
        if (isUsed.length > 0) {
          return Promise.reject('This email is already used');
        }
          return this.collection.insert(payload);
      });
  }

  findByKey(key, data) {
    return this.collection.find({
      [key]: data,
    })
    .toArray();
  }

  getCollectionName() {
    return this.ModelClass.name.toLowerCase() + 's';
  }
}

module.exports = BaseData;
