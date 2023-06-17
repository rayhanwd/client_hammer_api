const jwt = require('jsonwebtoken');
const User = require('./user.model');
const { isTokenExpired, clearTokensFromCookie } = require('./user.helper');


const verifyAccessToken = async (req, res, next) => {
    try {

        const { access_token: accessToken, refresh_token: refreshToken } = req.cookies;

        if (!accessToken || !refreshToken) {
            res.status(401).json({ error: 'Session has been expired! please login' });
        }

        if (isTokenExpired(accessToken)) {
            if (isTokenExpired(refreshToken)) {
                clearTokensFromCookie(res);
                res.status(401).json({ error: 'Session has been expired! please login' });
            } else {
                try {
                    const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                    const userId = decodedRefreshToken.userId;

                    const user = await User.findOne({ _id: userId, refresh_token: refreshToken });

                    if (!user) {
                        return res.status(401).json({ error: 'Session has been expired! Please log in.' });
                    }

                    if (user.refresh_token_expiry < Date.now()) {
                        return res.status(401).json({ error: 'Session has expired. Please log in again.' });

                    }
                    const newAccessToken = generateAccessToken(user);
                    res.cookie('access_token', newAccessToken, { httpOnly: false });
                    req.userId = user._id;
                    return next();
                } catch (error) {
                    return res.status(401).json({ error: 'Session has expired. Please log in again' });
                }
            }
        }

        next();

    } catch (error) {
        //console.log(error)
        res.status(500).json({ error: 'Failed to refresh access token' });
    }
};

const verifyResetToken = (req, res, next) => {
    const { token } = req.params;
//email valid
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
