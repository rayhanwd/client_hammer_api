const jwt = require('jsonwebtoken');

function generateAccessToken(user) {
    const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1m',
    });
    return accessToken;
}

function generateResetToken(user) {
    const resetToken = jwt.sign({ userId: user._id }, process.env.RESET_TOKEN_SECRET, {
        expiresIn: '15m',
    });
    return resetToken;
}

function generateRefreshToken(user) {
    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '5m',
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
