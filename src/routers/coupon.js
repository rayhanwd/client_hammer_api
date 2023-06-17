const express = require('express');
const router = express.Router();
const couponController = require('../api/coupon/coupon.controllers');

router.post('/match', couponController.getCouponByCode);

module.exports = router;
