const {ObjectId} = require('mongodb');

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

  findByKey(key, payload) {
    return this.collection.find({
      [key]: payload,
    })
    .toArray();
  }

  findById(id) {
    let idValidation = this.idValidator(id);
    if (!idValidation) {
      return Promise.reject('Please provide a valid id');
    }
    return this.collection.find(ObjectId(id))
      .toArray();
  }

  validateUserId(id) {
    let idValidation = this.idValidator(id);
    if (!idValidation) {
      return Promise.reject('Please provide a valid id');
    }
    return this.db.collection('users').find(ObjectId(id))
      .toArray()
      .then((dbItem) => {
        if (dbItem.length > 0) {
          return true;
        } else {
          return false;
        }
      })
      .catch((err) => {
        return Promise.reject('Error');
      });
  }

  updateItem(id, payload) {
    let idValidation = this.idValidator(id);
    if (!idValidation) {
      return Promise.reject('Please provide a valid id');
    }
    return this.collection.updateOne(
      {'_id': ObjectId(id)},
      {$set: payload}
    );
  }

  pushItem(id, payload, key) {
    return this.collection.update(
      {'_id': ObjectId(id)},
      {$push: {
        [key]: payload,
      }}
    );
  }

  pushComment(id, payload) {
    let idValidation = this.idValidator(id);
    if (!idValidation) {
      return Promise.reject('Please provide a valid id');
    }
    return this.collection.update(
      {'_id': ObjectId(id)},
      {$push: {
        'comments': payload,
      }}
    );
  }

  getCollectionName() {
    return this.ModelClass.name.toLowerCase() + 's';
  }

  idValidator(id) {
    if (id.length !== 24) {
      return false;
    } else {
      return true;
    }
  }
}

module.exports = BaseData;
