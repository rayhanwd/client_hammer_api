const express = require('express');
const router = express.Router();
const userController = require('../api/user/user.controllers');


router.post('/registration', userController.createUser);
router.post('/login', userController.loginuser);
router.post('/request_reset_password', userController.generateResetToken);
router.post('/reset_password/:token', userController.resetPassword);
router.post('/logout', userController.logoutuser);
router.post('/refresh', userController.refreshAccessToken);
router.put('/update_email', userController.updateMail);
router.put('/update_password', userController.updatePassword);

module.exports = router;
