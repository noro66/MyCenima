
const mongoose = require("mongoose");
const Joi = require('joi');
const jwt = require("jsonwebtoken");

//User Schema
const UserSchema = mongoose.Schema({
    email: {
        type : String,
        required : true,
        trim : true,
        minLength : 5,
        maxLength : 100,
        unique : true
    },
    username : {
        type : String,
        required : true,
        trim : true,
        minLength : 2,
        maxLength : 200,
        unique : true
    },
    password : {
        type : String,
        required : true,
        trim : true,
        minLength : 6,
    },
    isAdmin : {
        type : Boolean,
        default : false
    }
}, {timestamps : true});

//Generate Token
UserSchema.methods.generateToken  = function (){
    return jwt.sign(
        { id: this._id, isAdmin: this.isAdmin },
        process.env.JWT_SECRET_KEY
    )
}


//User login validation
function  validateUserLogin(obj){
    const schema = Joi.object({
        email : Joi.string().trim().min(5).max(100).required().email(),
        password : Joi.string().trim().min(6).required(),
    });
    return schema.validate(obj);
}

//User register validation
function  validateUserRegister(obj){
    const schema = Joi.object({
        email : Joi.string().trim().min(5).max(100).required().email(),
        username : Joi.string().trim().min(2).max(200).required(),
        password : Joi.string().trim().min(6).required(),
    });
    return schema.validate(obj);
}

//User update validation
function  validateUserUpdate(obj){
    const schema = Joi.object({
        email : Joi.string().trim().min(5).max(100).email(),
        username : Joi.string().trim().min(2).max(200),
        password : Joi.string().trim().min(6),
    });
    return schema.validate(obj);
}

const User = mongoose.model('User', UserSchema);

module.exports = {User, validateUserLogin, validateUserRegister, validateUserUpdate};