const express = require('express');
const router = express.Router();
const ordersHandler = require('../handlers/orders.handler');

router.route('/')
  .get(ordersHandler.getAllOrders)
  .post(ordersHandler.createOrder);

router.route('/:id')
  .get(ordersHandler.getOrderById)
  .put(ordersHandler.updateOrder)
  .delete(ordersHandler.deleteOrder);

module.exports = router;
