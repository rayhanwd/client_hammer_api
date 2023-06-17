const express = require('express');
const router = express.Router();

// Import route files
const productRoutes = require('./product');
const couponRoutes = require('./coupon');
const customerRoutes = require('./customer');
const userRoutes = require('./user');
const bannerPRoutes = require('./banner');
const orderRoutes = require('./order');

// Use route files
router.use('/products', productRoutes);
router.use('/coupons', couponRoutes);
router.use('/customer', customerRoutes);
router.use('/user', userRoutes);
router.use('/orders', orderRoutes);
router.use('/bannerp', bannerPRoutes);


module.exports = router;


