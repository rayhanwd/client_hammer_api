const express = require('express');
const router = express.Router();
const productController = require('../api/product/product.controllers');

// Product routes
router.get('/filters', productController.getFeatureProducts);
// router.get('/default', productController.insertDefaultData);
router.get('/collections', productController.getProductCollections);
router.get('/current_deals', productController.getCurrentDeals);
router.get('/search', productController.searchProducts);
router.get('/:productId', productController.getProductById);

// Add more product routes as needed

module.exports = router;