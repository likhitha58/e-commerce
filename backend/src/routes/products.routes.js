const express = require('express');
const router = express.Router();
const productsHandler = require('../handlers/products.handler');

router.route('/')
  .get(productsHandler.getAllProducts)
  .post(productsHandler.createProduct);

router.route('/:id')
  .get(productsHandler.getProductById)
  .put(productsHandler.updateProduct)
  .delete(productsHandler.deleteProduct);

module.exports = router;
