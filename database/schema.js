const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  images: [{
    fireBaseUrl: String,
    filename: String
  }],
  name: String,
  prodId: String,
  description: String,
  price: Number,
  features: [String],
  specs: [String],
  index: Number
});

const aboutSchema = new mongoose.Schema({
  images: [{
    fireBaseUrl: String,
    filename: String
  }],
  about: String,
  phone: String,
  email: String
});

module.exports.productSchema = productSchema;
module.exports.aboutSchema = aboutSchema;