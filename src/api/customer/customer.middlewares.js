const jwt = require('jsonwebtoken');
const Customer = require('./customer.model');

const verifyAccessToken = async (req, res, next) => {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
        return res.status(401).json({ error: 'Access token is missing' });
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        // Check if the access token is expired
        if (decoded.exp < Date.now() / 1000) {
            // Access token has expired
            const refreshToken = req.cookies.refresh_token;
            if (!refreshToken) {
                return res.status(401).json({ error: 'Refresh token is missing' });
            }

            try {
                const customer = await Customer.findOne({ refresh_token: refreshToken });

                if (!customer) {
                    throw new Error('Invalid refresh token');
                }

                // Check if the refresh token is expired
                if (customer.refresh_token_expiry < Date.now()) {
                    return res.status(401).json({ error: 'Refresh token has expired' });
                }

                // Generate a new access token
                const newAccessToken = jwt.sign({ customerId: customer._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

                // Update the response with the new access token
                res.cookie('access_token', newAccessToken, { httpOnly: false });

                // Continue to the next middleware or route
                next();

            } catch (error) {
                return res.status(401).json({ error: 'Invalid refresh token' });
            }
        } else {
            // Access token is valid
            next();
        }
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: error });
    }
};

const verifyResetToken = (req, res, next) => {
    const { token } = req.params;

    try {
        const decodedToken = jwt.verify(token, process.env.RESET_TOKEN_SECRET);

        // Check if the reset token is expired
        if (decodedToken.exp < Date.now() / 1000) {
            return res.status(401).json({ error: 'Reset password has expired' });
        }

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid reset token' });
    }
};

module.exports = {
    verifyAccessToken,
    verifyResetToken
};
