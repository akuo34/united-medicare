const router = require('express').Router();
const controller = require('./controller');

router
  .route('/products')
  .get(controller.getProducts)
  .post(controller.postProduct)

router
  .route('/products/:_id')
  .put(controller.putProduct)
  .delete(controller.deleteProduct)

module.exports = router;