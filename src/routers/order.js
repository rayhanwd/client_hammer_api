const express = require('express');
const router = express.Router();
const orderController = require('../api/order/order.controllers');


router.post('/create', orderController.createOrder);

router.get('/:customerId/single', orderController.getOrdersById);

router.get('/:customerId/:orderId', orderController.getSingleOrder);


module.exports = router;