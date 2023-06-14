const express = require('express');
const router = express.Router();
const orderController = require('../api/order/order.controllers');
const { verifyAccessToken } = require('../api/customer/customer.middlewares');

router.post('/create', orderController.createOrder);
router.get('/:customerId',verifyAccessToken, orderController.getCustomerOrders);
router.get('/:customerId/:orderId',verifyAccessToken, orderController.getOneCustomerOneOrder);


module.exports = router;