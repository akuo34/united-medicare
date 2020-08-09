const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  fireBaseUrl: String,
  title: String,
  description: String,
  price: Number,
  filename: String,
  index: Number
});

module.exports.productSchema = productSchema;