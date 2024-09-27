const mongoose = require("mongoose");
const Joi = require("joi");

const salleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add the name of the salle"],
        trim: true,
        minLength: 3,
        maxLength: 100
    },
    seats: {
        type: Number,
        required: [true, "Please specify the number of seats"],
        min: [1, "The number of seats must be at least 1"]
    },
    type: {
        type: String,
        enum: ['standard', 'VIP', 'IMAX'],
        required: [true, "Please specify the type of salle"]
    }
}, { timestamps: true });

const Salle = mongoose.model("Salle", salleSchema);

// Joi validation for creating a salle (salle)
function validateCreatingSalle(obj) {
    const schema = Joi.object({
        name: Joi.string().trim().min(3).max(100).required(),
        seats: Joi.number().min(1).required(),
        type: Joi.string().valid('standard', 'VIP', 'IMAX').required(),
    });

    return schema.validate(obj);
}

// Joi validation for updating a salle (salle)
function validateUpdateSalle(obj) {
    const schema = Joi.object({
        name: Joi.string().trim().min(3).max(100),
        seats: Joi.number().min(1),
        type: Joi.string().valid('standard', 'VIP', 'IMAX'),
    });

    return schema.validate(obj);
}

module.exports = { Salle, validateCreatingSalle, validateUpdateSalle };
