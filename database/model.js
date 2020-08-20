const { productItem, aboutItem } = require('./');

module.exports = {
  getProducts: () => productItem.find().sort([['index', 1]]),
  postProduct: (images, name, prodId, description, price, features, specs, index, downloads) => productItem.create({ images, name, prodId, description, price, features, specs, index, downloads }),
  putProduct: (request, _id) => productItem.findOneAndUpdate({ _id }, request),
  deleteProduct: (_id) => productItem.findOneAndDelete({ _id }),
  getAbout: () => aboutItem.find(),
  postAbout: (images, about) => aboutItem.create({ images, about }),
  putAbout: (request, _id) => aboutItem.findOneAndUpdate({ _id }, request),
  deleteAbout: (_id) => aboutItem.findOneAndDelete({ _id })
}
