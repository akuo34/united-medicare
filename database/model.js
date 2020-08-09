const { productItem } = require('./');

module.exports = {
  getProducts: () => productItem.find().sort([['index', 1]]),
  postProduct: (fireBaseUrl, title, description, price, filename, index) => productItem.create({ fireBaseUrl, title, description, price, filename, index }),
  putProduct: (request, _id) => productItem.findOneAndUpdate({ _id }, request),
  deleteProduct: (_id) => productItem.findOneAndDelete({ _id })
}
