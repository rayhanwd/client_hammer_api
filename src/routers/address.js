const express = require('express');
const router = express.Router();
const addressController = require('../api/address/address.controllers');
const { verifyAccessToken } = require('../api/customer/customer.middlewares');


router.post('/create', addressController.createAddress);
router.patch('/update',addressController.updateAddress);
router.get('/:customerId', addressController.getCustomerAddress);

module.exports = router;