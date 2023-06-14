const express = require('express');
const router = express.Router();

const customerController = require('../api/customer/customer.controllers');
const { verifyAccessToken, verifyResetToken } = require('../api/customer/customer.middlewares');

router.post('/registration', customerController.createCustomer);
router.post('/login', customerController.loginCustomer);
router.get('/:id', customerController.getCustomer);
router.patch('/update', customerController.updateName);
router.patch('/update_email', customerController.updateMail);
router.patch('/update_password', verifyAccessToken, customerController.updatePassword);
router.post('/request_reset_password', customerController.generateResetToken);
router.post('/reset_password/:token', customerController.resetPassword);
router.post('/logout', customerController.logoutCustomer);
router.post('/refresh', customerController.refreshAccessToken);

module.exports = router;
