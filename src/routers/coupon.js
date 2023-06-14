const express = require('express');
const router = express.Router();
const couponController = require('../api/coupon/coupon.controllers');

// Create a new coupon
// router.post('/create', couponController.createCoupon);
router.post('/match', couponController.getCouponByCode);

module.exports = router;

