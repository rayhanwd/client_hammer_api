const userService = require('./user.services');
const Customer = require('../customer/customer.model');

exports.createUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { user, message, accessToken, refreshToken } = await userService.createUser(email, password);
        if (message) {
            return res.status(400).json({ message });
        }
        // Set the tokens as cookies in the response
        res.cookie('access_token', accessToken, { httpOnly: false });
        res.cookie('refresh_token', refreshToken, { httpOnly: false });

        const sanitizedUser = userService.sanitizeuser(user);
        res.status(201).json({ user: sanitizedUser });

    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
};

exports.loginuser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, message, accessToken, refreshToken } = await userService.loginuser(email, password);
        if (message) {
            return res.status(400).json({ message });
        }
        // Set the tokens as cookies in the response
        res.cookie('access_token', accessToken, { httpOnly: false });
        res.cookie('refresh_token', refreshToken, { httpOnly: false });

        // Respond with only the user information (excluding password and refresh_token)
        const sanitizeduser = userService.sanitizeuser(user);

        res.status(200).json({ user: sanitizeduser });

    } catch (error) {
        res.status(500).json({ error: 'Failed to login' });
    }
};

exports.updateMail = async (req, res) => {
    try {
        const { userId, currentEmail, newEmail } = req.body;

        const { accessToken, message, refreshToken } = await userService.updateMail(userId, currentEmail, newEmail);
        if (message) {
            return res.status(400).json({ message });
        }
        // Set the new access token in the response cookie
        res.cookie('access_token', accessToken, { httpOnly: false });

        // Check if the refresh token was regenerated
        if (refreshToken) {
            // Set the new refresh token in the response cookie
            res.cookie('refresh_token', refreshToken, { httpOnly: false });
        }
        return res.status(200).json({ message: 'user email updated successfully' });

    } catch (error) {
        console.error(error)
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;

        const { accessToken, message, refreshToken } = await userService.updatePassword(userId, currentPassword, newPassword);

        if (message) {
            return res.status(400).json({ message });
        }

        res.cookie('access_token', accessToken, { httpOnly: false });

        if (refreshToken) {
            res.cookie('refresh_token', refreshToken, { httpOnly: false });
        }
        return res.status(200).json({ message: "Password updated successfully!" });
    } catch (error) {
        console.error(error)
    }
}

exports.logoutuser = async (req, res) => {
    try {
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to logout user' });
    }
};

exports.refreshAccessToken = async (req, res) => {
    try {
        const { access_token: accessToken, refresh_token: refreshToken } = req.cookies;
        const { accessToken: newAccessToken, error } = await adminService.refreshAccessToken(accessToken, refreshToken, res);
        if (error) {
            return res.status(401).json({ error });
        }
        res.cookie('access_token', newAccessToken, { httpOnly: false });
        res.status(200).json({ message: 'Access token refreshed successfully' });

    } catch (error) {
        //console.log(error)
        res.status(500).json({ error: 'Failed to refresh access token' });
    }
};

exports.generateResetToken = async (req, res) => {
    try {
        await userService.generateResetToken(req, res);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to generate reset token' });
    }
};


exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const result = await userService.resetPassword(token, password);

        if (result.error) {
            return res.status(result.status).json({ error: result.error });
        }

        return res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to reset password' });
    }
};

