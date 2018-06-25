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
    if (id.length !== 24) {
      return Promise.reject('Please provide a valid id');
    }
    return this.collection.find(ObjectId(id))
      .toArray();
  }

  updateItem(id, payload) {
    if (id.length !== 24) {
      return Promise.reject('Please provide a valid id');
    }
    return this.collection.updateOne(
      {'_id': ObjectId(id)},
      {$set: payload}
    );
  }

  pushItem(id, payload) {
    if (id.length !== 24) {
      return Promise.reject('Please provide a valid id');
    } // !!!!! method for id validation !!!!!
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
}

module.exports = BaseData;
