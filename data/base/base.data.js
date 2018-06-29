const {ObjectId} = require('mongodb');

class BaseData {
  constructor(db, ModelClass, validator) {
    this.db = db.db();
    this.ModelClass = ModelClass;
    this.validator = validator;
    this.collectionName = this.getCollectionName();
    this.collection = this.db.collection(this.collectionName);
  };

  pagination(page, limit) {
    if (limit === undefined) {
      limit = 5;
    }
    if (page === undefined || page < 1) {
      page = 1;
    }
    const skip = (page - 1) * limit;
    return {
      skip,
      limit,
    };
  }

  getAll(page, limit) {
    let pageLimits = this.pagination(page, limit);
    return this.collection.find({})
      .skip(+pageLimits.skip)
      .limit(+pageLimits.limit)
      .toArray();
  }

  getAllByCollection(page, limit, collection) {
    let pageLimits = this.pagination(page, limit);
    return this.db.collection(collection).find({})
      .skip(+pageLimits.skip)
      .limit(+pageLimits.limit)
      .toArray();
  }

  countAll() {
    return this.collection.count();
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

  findByKeyPaginated(key, payload, page, limit) {
    let pageLimits = this.pagination(page, limit);
    return this.collection.find({
      [key]: payload,
    })
    .skip(+pageLimits.skip)
    .limit(+pageLimits.limit)
    .toArray();
  }

  textQuery(key, payload, page, limit) {
    let pageLimits = this.pagination(page, limit);
    return this.collection.find({
      [key]: {$regex: new RegExp(payload, 'igm')},
    })
    .skip(+pageLimits.skip)
    .limit(+pageLimits.limit)
    .toArray();
  }

  findById(id) {
    if (!this.idValidator(id)) {
      return Promise.reject('Please provide a valid id');
    }
    return this.collection.find(ObjectId(id))
      .toArray();
  }

  validateUserId(id) {
    if (!this.idValidator(id)) {
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
    if (!this.idValidator(id)) {
      return Promise.reject('Please provide a valid id');
    }
    return this.collection.updateOne(
      {'_id': ObjectId(id)},
      {$set: payload}
    );
  }

  pushItem(id, payload, key) {
    if (!this.idValidator(id)) {
      return Promise.reject('Please provide a valid id');
    }
    return this.collection.update(
      {'_id': ObjectId(id)},
      {$push: {
        [key]: payload,
      }}
    );
  }

  getCollectionName() {
    return this.ModelClass.name.toLowerCase() + 's';
  }

  idValidator(id) {
    let checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');
    let isValid = checkForHexRegExp.test(id);
    if (!isValid) {
      return false;
    } else {
      return true;
    }
  }

  removeWhitespace(payload) {
    let removeSpaces = /^\s+|\s+$|\s+(?=\s)/g;
    for (let i in payload) {
      payload[i] = payload[i].replace(removeSpaces, '');
    };
    return payload;
  }
}

module.exports = BaseData;
