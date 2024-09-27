const asyncHandler = require("express-async-handler");
const {User, validateUserRegister, validateUserUpdate} = require("../models/User");
const bcrypt = require('bcryptjs');

/**
 * @desc Get all Admins
 * @route /api/books
 * @method GET
 * @access private
 */
const getAllAdmins = asyncHandler(async (req, res)=>{
    const adminUsers = await User.find({ isAdmin: true });
    res.status(200).json(adminUsers);
});

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


/**
 * @desc Get Admin by id
 * @route /api/admin/:id
 * @method GET
 * @access public
 */
const getAdminById = asyncHandler(async (req, res)=>{
    const admin = await  User.findById({_id : req.params.id, isAdmin : true});
    if (admin){
        res.status(200).json(admin);
    }else {
        res.status(404).json({message: "Admin not found"})
    }
})

/**
 * @desc Update User Admin
 * @route /api/Admin/:id
 * @method PUT
 * @access private
 */
const updateAdmin =   asyncHandler(async (req, res)=>{
    if (!req.user.isAdmin){
        return  res.status(403).json({message: "You are not allowed to update this profile, you can only update your profile"}) //forbidden
    }
    const {error} = validateUserUpdate(req.body);
    if (error){
        return  res.status(400).json({message: error.details[0].message});
    }
    if (req.body.password){
        const salt = await bcrypt.genSalt(10)
        req.body.password  = await bcrypt.hash(req.body.password, salt)
    }
    const updatedUSer = await  User.findByIdAndUpdate(req.params.id, {
        $set : {
            email: req.body.email,
            password : req.body.password,
            username : req.body.username
        }
    }, {new : true}).select("-password");
    res.status(200).json({updatedUSer});
})

/**
 * @desc Get User Admin and delete it
 * @route /api/admin/:id
 * @method DELETE
 * @access private (User or  ADMIN)
 */
const deleteUser = asyncHandler(async (req, res)=>{
    const user = await  User.findById(req.params.id).select('-password');
    if (user){
        await  User.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "user has been deleted successfully"});
    }else{
        res.status(400).json({message: "user not found"})
    }
})

module.exports = {createAdmin, getAllAdmins, updateAdmin, deleteUser, getAdminById}