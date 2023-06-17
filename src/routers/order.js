const express = require('express');
const router = express.Router();
const orderController = require('../api/order/order.controllers');


router.post('/create', orderController.createOrder);
// router.get('/:customerId', orderController.getCustomerOrders);
// router.get('/:customerId/:orderId', orderController.getOneCustomerOneOrder);


module.exports = router;