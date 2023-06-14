const express = require('express');
const router = express.Router();
const bannerController = require('../api/bannerPromo/bannerP.controllers');

// Create a new banner
router.post('/create', bannerController.createBanner);
// Get the banner
router.get('/read', bannerController.getBanner);
router.put('/:id/text', bannerController.updateBannerText);
router.put('/:id/photo', bannerController.updatePopupPhoto);
router.put('/:id/link', bannerController.updatePopupLink);
router.put('/:id/active', bannerController.updateIsActive);

module.exports = router;
