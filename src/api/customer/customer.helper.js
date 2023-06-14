const jwt = require('jsonwebtoken');

function generateAccessToken(customer) {
    const accessToken = jwt.sign({ customerId: customer._id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1m',
    });
    return accessToken;
}

function generateResetToken(customer) {
    const resetToken = jwt.sign({ customerId: customer._id }, process.env.RESET_TOKEN_SECRET, {
        expiresIn: '15m',
    });
    return resetToken;
}

function generateRefreshToken(customer) {
    const refreshToken = jwt.sign({ customerId: customer._id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d',
    });
    return refreshToken;
}

function isTokenExpired(token) {
    const decodedToken = jwt.decode(token);
    const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds

    return decodedToken && decodedToken.exp && decodedToken.exp < currentTime;
}

function clearTokensFromCookie(res) {
    // Clear both access token and refresh token from cookies
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
}


module.exports = { generateAccessToken, generateResetToken, generateRefreshToken, isTokenExpired, clearTokensFromCookie };
