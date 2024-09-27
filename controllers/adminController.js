const asyncHandler = require("express-async-handler");
const {User, validateUserRegister} = require("../models/User");
const bcrypt = require('bcryptjs');



const createAdmin =  asyncHandler(async (req, res) => {
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
        isAdmin : true
    });

    // Save the user to the database
    const result = await user.save();

    // Generate a JWT token
    const token = user.generateToken();

    // Exclude the password from the response
    const { password, ...other } = result._doc;
    res.status(201).json({ ...other, token , message : "Admin created successfully"});
})

module.exports = {createAdmin}