const { productItem } = require('./');

module.exports = {
  getProducts: () => productItem.find().sort([['index', 1]]),
  postProduct: (images, name, prodId, description, price, features, specs) => productItem.create({ images, name, prodId, description, price, features, specs }),
  putProduct: (request, _id) => productItem.findOneAndUpdate({ _id }, request),
  deleteProduct: (_id) => productItem.findOneAndDelete({ _id })
}
