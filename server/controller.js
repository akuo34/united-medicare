const model = require('../database/model');

module.exports = {
  getProducts: (req, res) => {
    model.getProducts()
      .then(response => res.status(200).send(response.data))
      .catch(err => res.status(404).send(err));
  },
  postProduct: (req, res) => {
    const { fireBaseUrl, title, description, price, filename, index } = req.body;

    model.postProduct(fireBaseUrl, title, description, price, filename, index)
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