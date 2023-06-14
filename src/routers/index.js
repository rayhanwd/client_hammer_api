const express = require('express');
const router = express.Router();

// Import route files
const productRoutes = require('./product');
const couponRoutes = require('./coupon');
const customerRoutes = require('./customer');
const addressRoutes = require('./address');
const orderRoutes = require('./order');
const bannerPRoutes = require('./banner');


// Use route files
router.use('/products', productRoutes);
router.use('/coupons', couponRoutes);
router.use('/customers', customerRoutes);
router.use('/address', addressRoutes);
router.use('/orders', orderRoutes);
router.use('/bannerp', bannerPRoutes);


module.exports = router;


