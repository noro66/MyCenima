const asyncHandler = require("express-async-handler");
const {validateUserRegister, User, validateUserLogin} = require("../models/User");
const bcrypt = require("bcryptjs");

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

module.exports = {login, register}