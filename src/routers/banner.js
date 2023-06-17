const express = require('express');
const router = express.Router();
const bannerController = require('../api/bannerPromo/bannerP.controllers');


router.get('/read',bannerController.getBanner);

module.exports = router;



