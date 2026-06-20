const express = require('express');
const router = express.Router();
const customerHandler = require('../handlers/customer.handler');

router.route('/')
  .get(customerHandler.getAllCustomers)
  .post(customerHandler.createCustomer);

router.route('/:id')
  .get(customerHandler.getCustomerById)
  .put(customerHandler.updateCustomer)
  .delete(customerHandler.deleteCustomer);

module.exports = router;
