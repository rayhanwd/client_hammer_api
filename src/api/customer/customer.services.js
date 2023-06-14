const Customer = require('./customer.model');
const { generateAccessToken, generateRefreshToken, isTokenExpired, clearTokensFromCookie, generateResetToken } = require('./customer.helper');
const jwt = require('jsonwebtoken');

const { sendResetPasswordEmail } = require('./customer.mailServices');

const bcrypt = require('bcrypt');

exports.createCustomer = async (fname, lname, email, password) => {
    try {
        // Generate a salt to use for password hashing
        const salt = await bcrypt.genSalt(10);

        // Hash the password using the generated salt
        const hashedPassword = await bcrypt.hash(password, salt);

        const customer = await Customer.create({
            fname,
            lname,
            email,
            password: hashedPassword, // Store the hashed password
        });

        // Generate an access token
        const accessToken = generateAccessToken(customer);

        // Generate a refresh token
        const refreshToken = generateRefreshToken(customer);

        // Save the refresh token in the customer document
        customer.refresh_token = refreshToken;

        const expiresInDays = 7;  // Set the expiration duration in days
        const expiryDate = new Date();  // Get the current date and time
        expiryDate.setDate(expiryDate.getDate() + expiresInDays);  // Add the expiration duration to the current date

        customer.refresh_token_expiry = expiryDate; // Set to current date and time

        await customer.save();

        return { customer, accessToken, refreshToken };
    } catch (error) {
        throw new Error('Failed to create customer from services');
    }
};

exports.loginCustomer = async (email, password) => {
    try {
        const customer = await Customer.findOne({ email });

        if (!customer) {
            throw new Error('Invalid email or password');
        }
        // Compare the user's input password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, customer.password);

        if (!passwordMatch) {
            throw new Error('Invalid email or password');
        }

        const accessToken = generateAccessToken(customer);

        let refreshToken = customer.refresh_token;

        if (!refreshToken || customer.refresh_token_expiry < Date.now()) {
            const expiresInDays = 7; // Set the expiration duration in days
            const expiryDate = new Date(); // Get the current date and time
            expiryDate.setDate(expiryDate.getDate() + expiresInDays); // Add the expiration duration to the current date
            refreshToken = generateRefreshToken(customer);
            customer.refresh_token = refreshToken;
            customer.refresh_token_expiry = expiryDate; // Set the expiration date to the future
            await customer.save();
        }

        return { customer, accessToken, refreshToken };
    } catch (error) {
        throw new Error('Failed to login serv!');
    }
};

exports.getCustomer = async (id) => {
    try {
        const customer = await Customer.findById({ _id: id });
        return { customer };
    }
    catch (err) {
        console.error(err)
    }
}

exports.updateMail = async (customerId, currentEmail, newEmail) => {
    try {
        const customer = await Customer.findById(customerId);
        if (!customer) {
            throw new Error('Customer not found');
        }
        if (customer.email !== currentEmail) {
            throw new Error('Invalid current email or password');
        }
        if (newEmail && newEmail !== customer.email) {
            const existingCustomer = await Customer.findOne({ email: newEmail });
            if (existingCustomer) {
                throw new Error('Email is already taken');
            }
            customer.email = newEmail;
        }
        const refreshToken = generateRefreshToken(customer);
        const expiresInDays = 7;
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + expiresInDays);
        customer.refresh_token = refreshToken;
        customer.refresh_token_expiry = expiryDate;
        await customer.save();

        const accessToken = generateAccessToken(customer);

        return { customer, accessToken, refreshToken };
    } catch (error) {
        throw error;
    }
};

exports.updatePassword = async (customerId, currentPassword, newPassword) => {
    try {
        const customer = await Customer.findById(customerId);

        if (!customer) {
            throw new Error('Customer not found');
        }

        const passwordMatch = await bcrypt.compare(currentPassword, customer.password);

        if (!passwordMatch) {
            throw new Error('Invalid current password');
        }

        if (newPassword) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            customer.password = hashedPassword;
        }

        // Generate a new refresh token and set its expiry date
        const refreshToken = generateRefreshToken(customer);
        const expiresInDays = 7;
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + expiresInDays);
        customer.refresh_token = refreshToken;
        customer.refresh_token_expiry = expiryDate;

        await customer.save();

        const accessToken = generateAccessToken(customer);

        return { accessToken, refreshToken };
    } catch (error) {
        throw error;
    }
};

exports.refreshAccessToken = async (req, res) => {
    try {

        const { access_token: accessToken, refresh_token: refreshToken } = req.cookies;

        if (!accessToken || !refreshToken) {
            res.status(401).json({ error: 'Access token or refresh token not found' });
            return;
        }

        const decodedToken = jwt.decode(accessToken);

        if (!decodedToken || !decodedToken.customerId) {
            res.status(401).json({ error: 'Invalid access token' });
            return;
        }

        if (isTokenExpired(accessToken)) {
            if (isTokenExpired(refreshToken)) {
                // If both access token and refresh token are expired, clear them from cookies
                clearTokensFromCookie(res);
                res.status(401).json({ error: 'Access token and refresh token expired, please login' });
                return;
            } else {
                // If only the access token is expired, generate a new access token
                const customerId = decodedToken.customerId;
                const newAccessToken = generateAccessToken({ customerId });
                res.cookie('access_token', newAccessToken, { httpOnly: false });
                res.status(200).json({ msg: 'New token has been created' });
                return;
            }
        }

        // Access token is valid, no need to refresh
        res.status(200).json({ msg: 'You are a valid user' });

    } catch (error) {
        res.status(500).json({ error: 'Failed to refresh access token' });
    }
};


exports.generateResetToken = async (email) => {
    try {
        const customer = await Customer.findOne({ email });

        if (!customer) {
            throw new Error('Customer not found');
        }

        const resetToken = generateResetToken(customer);

        customer.reset_token = resetToken;
        await customer.save();

        // Call the function to send the reset password email with the reset token
        await sendResetPasswordEmail(customer.email, resetToken);

        return { message: 'Reset token generated and sent successfully' };

    } catch (error) {
        console.error(error);
        throw new Error('Failed to generate reset token');
    }
};

exports.resetPassword = async (token, password) => {

    try {
        // Validate the token and check if it's valid and not expired
        try {
            const decodedToken = jwt.verify(token, process.env.RESET_TOKEN_SECRET);

            // Get the customerId from the decoded token
            const { customerId } = decodedToken;

            // Find the customer by the customerId and update the password
            const customer = await Customer.findOneAndUpdate(
                { _id: customerId, reset_token: token },
                { password },
                { new: true }
            );

            if (!customer) {
                return { error: 'Invalid or expired token', status: 404 };
            }

            // Clear the reset token from the customer document
            customer.reset_token = undefined;
            await customer.save();

            return { message: 'Password reset successfully', status: 200 };
        } catch (error) {
            return { error: 'Invalid or expired token', status: 400 };
        }
    } catch (error) {
        console.error(error);
        return { error: 'Failed to reset password', status: 500 };
    }
};


exports.sanitizeCustomer = (customer) => {
    // Exclude password and refresh_token fields
    const sanitizedCustomer = customer.toObject();
    delete sanitizedCustomer.password;
    delete sanitizedCustomer.refresh_token;
    delete sanitizedCustomer.reset_token;
    delete sanitizedCustomer.refresh_token_expiry;

    return sanitizedCustomer;
};


