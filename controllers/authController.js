const asyncHandler = require("express-async-handler");
const {validateUserRegister, User, validateUserLogin} = require("../models/User");
const Jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

/**
 * @desc Register New User
 * @route /api/auth/register
 * @method POST
 * @access public
 */
const register = asyncHandler(async (req, res) => {
    // Validate the request body
    const { error } = validateUserRegister(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // Check if the user is already registered
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({ message: "This user is already registered" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    user = new User({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
    });

    // Save the user to the database
    const result = await user.save();

    // Generate a JWT token
    const token = user.generateToken();

    // Exclude the password from the response
    const { password, ...other } = result._doc;
    res.status(201).json({ ...other, token });
})

/**
 * @desc Login to Account
 * @route /api/auth/login
 * @method POST
 * @access public
 */
const login = asyncHandler(async (req, res) => {
    // Validate the login request
    const { error } = validateUserLogin(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // Find the user by email
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if the password matches
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = user.generateToken();

    // Exclude the password from the response
    const { password, ...other } = user._doc;

    //Send response to the client
    res.status(200).json({ ...other, token });
})

/**
 * @desc show profile information
 * @route /api/auth/me
 * @method GET
 * @access public
 */
const me  = asyncHandler (async  (req ,res) => {
    let user = await User.findOne({ _id: req.user.id });
        const { password, ...other } = user._doc;
        res.status(200).json({other});
});
/**
 * @desc send forgot password link
 * @route /api/auth/forget-password
 * @method POST
 * @access public
 */
const sendForgotPasswordLink = asyncHandler(async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).json({ message: "Email not found!" });
    }

    const secret = process.env.JWT_SECRET_KEY + user.password;
    const token = Jwt.sign({ email: user.email, id: user.id }, secret, { expiresIn: '15m' });
    const link = `http://localhost:3000/api/auth/reset-password/${user.id}/${token}`;

    res.status(201).json({ message: "Password reset link sent!", link });
});

/**
 * @desc Validate reset password token
 * @route /api/auth/reset-password/:userId/:token
 * @method GET
 * @access public
 */
const getForgotPassword = asyncHandler(async (req, res) => {
    const { userId, token } = req.params;

    let user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found!" });
    }

    const secret = process.env.JWT_SECRET_KEY + user.password;
    try {
        Jwt.verify(token, secret);
        res.status(200).json({ message: "Token is valid.", email: user.email });
    } catch (error) {
        res.status(400).json({ message: "Invalid or expired token." });
    }
});

/**
 * @desc Reset password
 * @route /api/auth/reset-password/:userId/:token
 * @method POST
 * @access public
 */
const resetPassword =  asyncHandler(async (req, res) => {
    const { userId, token } = req.params;
    const newPassword = req.body.password;

    let user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found!" });
    }

    const secret = process.env.JWT_SECRET_KEY + user.password;
        Jwt.verify(token, secret);
        // Generate salt and hash the new password
        const salt = await bcrypt.genSalt(10);

        // Update the user's password and save
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        // Return success message
        res.status(200).json({ message: "Password changed successfully", password : req.body.newPassword} );
});

module.exports = {login, register, me, resetPassword, getForgotPassword, sendForgotPasswordLink}