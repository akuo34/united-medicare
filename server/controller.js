const model = require('../database/model');

module.exports = {
  getProducts: (req, res) => {
    model.getProducts()
      .then(response => res.status(200).send(response))
      .catch(err => res.status(404).send(err));
  },
  postProduct: (req, res) => {
    const { images, name, description, price } = req.body;

    model.postProduct(images, name, description, price, [], [])
      .then(() => res.status(201).send('posted to database'))
      .catch(err => res.status(400).send(err));
  },
  putProduct: (req, res) => {
    const request = req.body;
    const { _id } = req.params;

    model.putProduct(request, _id)
      .then(() => res.status(200).send('updated to database'))
      .catch(err => res.status(400).send(err));
  },
  deleteProduct: (req, res) => {
    const { _id } = req.params;

    model.deleteProduct(_id)
      .then(() => res.status(200).send('deleted from database'))
      .catch(err => res.status(400).send(err));
  }
}