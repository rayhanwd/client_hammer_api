const customerModel = require('./customer.model');
const customerService = require('./customer.services');


exports.createCustomer = async (req, res) => {
    try {
        const { fname, lname, email, password } = req.body;
        const { customer, accessToken, refreshToken } = await customerService.createCustomer(fname, lname, email, password);
        // Set the tokens as cookies in the response
        res.cookie('access_token', accessToken, { httpOnly: false });
        res.cookie('refresh_token', refreshToken, { httpOnly: false });

        // Respond with only the customer information (excluding password and refresh_token)
        const sanitizedCustomer = customerService.sanitizeCustomer(customer);
        res.status(201).json({ customer: sanitizedCustomer });

    } catch (error) {
        res.status(500).json({ error: 'Failed to create customer' });
    }
};

exports.loginCustomer = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { customer, accessToken, refreshToken } = await customerService.loginCustomer(email, password);

        // Set the tokens as cookies in the response
        res.cookie('access_token', accessToken, { httpOnly: false });
        res.cookie('refresh_token', refreshToken, { httpOnly: false });

        // Respond with only the customer information (excluding password and refresh_token)
        const sanitizedCustomer = customerService.sanitizeCustomer(customer);

        res.status(200).json({ customer: sanitizedCustomer });

    } catch (error) {
        res.status(500).json({ error: 'Failed to login' });
    }
};
exports.getCustomer = async (req, res) => {

    const id = req.params.id;

    try {
        const { customer } = await customerService.getCustomer(id);
        const sanitizeCustomer = customerService.sanitizeCustomer(customer);
        res.status(200).json(sanitizeCustomer);
    }
    catch (err) {
        res.status(500).json(err);
    }
}
exports.updateName = async (req, res) => {
    try {
        const { fname, lname, customerId } = req.body;

        await customerModel.findByIdAndUpdate(customerId, { fname, lname }, { new: true });

        // Send a successful response
        res.status(200).json({ message: 'Customer name updated successfully' });
    } catch (error) {
        // Handle any errors that occur during the update process
        console.error('Error updating customer name:', error);
        res.status(500).json({ error: 'Failed to update customer name' });
    }
};

exports.updateMail = async (req, res) => {
    try {
        const { customerId, currentEmail, newEmail } = req.body;

        const { accessToken, refreshToken } = await customerService.updateMail(customerId, currentEmail, newEmail);

        // Set the new access token in the response cookie
        res.cookie('access_token', accessToken, { httpOnly: false });

        // Check if the refresh token was regenerated
        if (refreshToken) {
            // Set the new refresh token in the response cookie
            res.cookie('refresh_token', refreshToken, { httpOnly: false });
        }
        return res.status(200).json({ message: 'Customer email updated successfully' });

    } catch (error) {
        console.error(error)
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { customerId, currentPassword, newPassword } = req.body;

        const { accessToken, refreshToken } = await customerService.updatePassword(customerId, currentPassword, newPassword);

        // Set the new access token in the response cookie
        res.cookie('access_token', accessToken, { httpOnly: false });

        // Check if the refresh token was regenerated
        if (refreshToken) {
            // Set the new refresh token in the response cookie
            res.cookie('refresh_token', refreshToken, { httpOnly: false });
        }

        return res.status(200).json({ message: "Password updated successfully!" });
    } catch (error) {
        console.error(error)
    }
}

exports.logoutCustomer = async (req, res) => {
    try {
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to logout customer' });
    }
};

exports.refreshAccessToken = async (req, res) => {
    try {
        await customerService.refreshAccessToken(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Failed to refresh access token' });
    }
};


exports.generateResetToken = async (req, res) => {
    try {
        const { email } = req.body;

        const { message } = await customerService.generateResetToken(email);

        return res.status(200).json(message);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to generate reset token' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const result = await customerService.resetPassword(token, password);

        if (result.error) {
            return res.status(result.status).json({ error: result.error });
        }

        return res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to reset password' });
    }
};

