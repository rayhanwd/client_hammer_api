const express = require('express');
const router = express.Router();
const CustomerController = require('../api/customer/customer.controllers');


router.get('/customer/:customerId',CustomerController.getCustomerById);

router.get('/:customerId/single', CustomerController.getOrdersById);

// Update customer information
router.put('/name', CustomerController.updateCustomerInfo);

// Update address information
router.put('/address', CustomerController.updateAddressInfo);

module.exports = router;
