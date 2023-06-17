const User = require('./user.model');
const Customer = require('../customer/customer.model');
const { generateAccessToken, generateRefreshToken, isTokenExpired, clearTokensFromCookie, generateResetToken } = require('./user.helper');
const jwt = require('jsonwebtoken');
const { sendResetPasswordEmail } = require('./user.mailServices');
const bcrypt = require('bcrypt');


exports.createUser = async (email, password) => {
    try {
        const existingUser = await User.findOne({ email });
        let message;
        if (existingUser) {
            // User already exists
            return { message: 'You already have an account. Please log in.' };
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            email,
            password: hashedPassword,
        });

        // Create an empty customer associated with the user
        const customer = await Customer.create({ userId: user._id });

        // Generate an access token
        const accessToken = generateAccessToken(user);

        // Generate a refresh token
        const refreshToken = generateRefreshToken(user);

        // Save the refresh token in the user document
        user.refresh_token = refreshToken;

        const expiresInMinutes = 5;
        const expiryDate = new Date();
        expiryDate.setTime(expiryDate.getTime() + expiresInMinutes * 60 * 1000);

        user.refresh_token_expiry = expiryDate;

        await user.save();

        return { user, message, accessToken, refreshToken };
    } catch (error) {
        throw new Error('Failed to create user from services');
    }
};

exports.loginuser = async (email, password) => {
    try {
        const user = await User.findOne({ email });
        let message;
        if (!user) {
            return { message: 'Invalid email or password' };
        }
        // Compare the user's input password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return { message: 'Invalid email or password' };
        }

        const accessToken = generateAccessToken(user);

        let refreshToken = user.refresh_token;

        if (!refreshToken || user.refresh_token_expiry < Date.now()) {
            const expiresInMinutes = 5;
            const expiryDate = new Date();
            expiryDate.setTime(expiryDate.getTime() + expiresInMinutes * 60 * 1000);

            refreshToken = generateRefreshToken(user);
            user.refresh_token = refreshToken;
            user.refresh_token_expiry = expiryDate;
            await user.save();
        }

        return { user, message, accessToken, refreshToken };
    } catch (error) {
        throw new Error('Failed to login serv!');
    }
};

exports.getuser = async (id) => {
    try {
        const user = await user.findById({ _id: id });
        return { user };
    }
    catch (err) {
        console.error(err)
    }
}

exports.updateMail = async (userId, currentEmail, newEmail) => {
    try {
        const user = await User.findById(userId);
        let message;

        if (!user) {
            return { message: 'user not found' };
        }
        if (user.email !== currentEmail) {
            return { message: 'Invalid current email or password' };
        }
        if (newEmail && newEmail !== user.email) {
            const existinguser = await User.findOne({ email: newEmail });
            if (existinguser) {
                return { message: 'Email is already taken' };
            }
            user.email = newEmail;
        }
        const refreshToken = generateRefreshToken(user);
        const expiresInDays = 7;
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + expiresInDays);
        user.refresh_token = refreshToken;
        user.refresh_token_expiry = expiryDate;
        await user.save();

        await Customer.findOneAndUpdate({ userId }, { email: newEmail });

        const accessToken = generateAccessToken(user);

        return { user, message, accessToken, refreshToken };

    } catch (error) {
        throw error;
    }
};

exports.updatePassword = async (userId, currentPassword, newPassword) => {
    try {
        const user = await User.findById(userId);
        let message;

        if (!user) {
            return { message: 'user not found' };
        }

        const passwordMatch = await bcrypt.compare(currentPassword, user.password);

        if (!passwordMatch) {
            return { message: 'Invalid current password' };
        }

        if (newPassword) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            user.password = hashedPassword;
        }

        // Generate a new refresh token and set its expiry date
        const refreshToken = generateRefreshToken(user);
        const expiresInDays = 7;
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + expiresInDays);
        user.refresh_token = refreshToken;
        user.refresh_token_expiry = expiryDate;

        await user.save();

        const accessToken = generateAccessToken(user);

        return { message, accessToken, refreshToken };
    } catch (error) {
        throw error;
    }
};

exports.refreshAccessToken = async (accessToken, refreshToken, res) => {
    try {
        if (!accessToken || !refreshToken) {
            return { error: 'Session has been expired! Please log in' };
        }

        if (isTokenExpired(accessToken)) {
            //console.log("access expired")
            if (isTokenExpired(refreshToken)) {
                //console.log("refres wxpired");
                clearTokensFromCookie(res);
                return { error: 'Session has been expired! Please log in' };
            } else {
                try {

                    const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

                    const userId = decodedRefreshToken.userId;

                    const user = await User.findOne({ _id: userId, refresh_token: refreshToken });

                    if (!user) {
                        return { error: 'Session has been expired! Please log in' };
                    }

                    if (user.refresh_token_expiry < Date.now()) {
                        //console.log("refresh expire")
                        return { error: 'Session has expired. Please log in again' };
                    }
                    //console.log("access created again")
                    const newAccessToken = generateAccessToken(user);

                    return { user, accessToken: newAccessToken };

                } catch (error) {
                    //console.log(error)
                    return { error: 'Session has expired. Please log in again' };
                }
            }
        } else {
            return { accessToken };
        }
    } catch (error) {
        //console.log(error)
        throw new Error('Failed to refresh access token');
    }
};

exports.generateResetToken = async (req, res) => {

    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        const resetToken = generateResetToken(user);

        user.reset_token = resetToken;
        await user.save();

        // Call the function to send the reset password email with the reset token
        await sendResetPasswordEmail(user.email, resetToken);

        return res.status(200).json({ message: 'We have sent a verification link to your email' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to generate reset token' });
    }
};

exports.resetPassword = async (token, password) => {

    try {
        // Validate the token and check if it's valid and not expired
        try {
            const decodedToken = jwt.verify(token, process.env.RESET_TOKEN_SECRET);

            // Get the userId from the decoded token
            const { userId } = decodedToken;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            // Find the user by the userId and update the password
            const user = await User.findOneAndUpdate(
                { _id: userId, reset_token: token },
                { password: hashedPassword },
                { new: true }
            );

            if (!user) {
                return { error: 'Invalid or expired token', status: 404 };
            }

            // Clear the reset token from the user document
            user.reset_token = undefined;
            await user.save();

            return { message: 'Password reset successfully', status: 200 };
        } catch (error) {
            return { error: 'Invalid or expired token', status: 400 };
        }
    } catch (error) {
        console.error(error);
        return { error: 'Failed to reset password', status: 500 };
    }
};

exports.sanitizeuser = (user) => {
    // Exclude password and refresh_token fields
    const sanitizeduser = user.toObject();
    delete sanitizeduser.password;
    delete sanitizeduser.refresh_token;
    delete sanitizeduser.reset_token;
    delete sanitizeduser.refresh_token_expiry;

    return sanitizeduser;
};


