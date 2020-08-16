const { productItem } = require('./');

module.exports = {
  getProducts: () => productItem.find().sort([['index', 1]]),
  postProduct: (images, name, description, price) => productItem.create({ images, name, description, price }),
  putProduct: (request, _id) => productItem.findOneAndUpdate({ _id }, request),
  deleteProduct: (_id) => productItem.findOneAndDelete({ _id })
}
