const mongoose = require("mongoose");
const Joi = require("joi");  // Corrected the import of Joi

// Reference to the Film and Salle models
const SeanceSchema = new mongoose.Schema({
    dateTime: {
        type: Date,  // Should be a Date instead of String
        required: [true, "Please add the date and time for the showing"],
    },
    price: {
        type: Number,
        required: [true, "Please specify the price for the showing"],
    },
    seats: [{
        number: {
            type: Number,
            required: [true, "Please specify the seat number"]
        },
        available: {
            type: Boolean,
            default: true  // Default value for seat availability
        }
    }],
    film: {
        type: mongoose.Schema.Types.ObjectId,  // Reference to Film model
        ref: "Film",
        required: [true, "Please add the film ID"]
    },
    Salle: {
        type: mongoose.Schema.Types.ObjectId,  // Reference to Salle model
        ref: "Salle",
        required: [true, "Please add the Salle ID"]
    }
}, { timestamps: true });


// Joi validation for creating a Seance
function validateCreatingSeance(data) {
    const schema = Joi.object({
        dateTime: Joi.date().required().messages({
            'any.required': 'Please add the date and time for the showing',
            'date.base': 'The date and time must be a valid date'
        }),
        price: Joi.number().required().messages({
            'any.required': 'Please specify the price for the showing',
            'number.base': 'Price must be a number'
        }),
        seats: Joi.array().items(
            Joi.object({
                number: Joi.number().required().messages({
                    'any.required': 'Please specify the seat number',
                    'number.base': 'Seat number must be a number'
                }),
                available: Joi.boolean().default(true)
            })
        ).min(1).required().messages({
            'array.min': 'There must be at least one seat',
            'any.required': 'Please add seats for the showing'
        }),
        film: Joi.string().required().messages({
            'any.required': 'Please add the film ID',
            'string.base': 'Film ID must be a valid string'
        }),
        Salle: Joi.string().required().messages({
            'any.required': 'Please add the Salle ID',
            'string.base': 'Salle ID must be a valid string'
        })
    });

    return schema.validate(data);
}

// Joi validation for updating a Seance
function validateUpdatingSeance(data) {
    const schema = Joi.object({
        dateTime: Joi.date().optional().messages({
            'date.base': 'The date and time must be a valid date'
        }),
        price: Joi.number().optional().messages({
            'number.base': 'Price must be a number'
        }),
        seats: Joi.array().items(
            Joi.object({
                number: Joi.number().optional().messages({
                    'number.base': 'Seat number must be a number'
                }),
                available: Joi.boolean().default(true)
            })
        ).optional(),
        film: Joi.string().optional().messages({
            'string.base': 'Film ID must be a valid string'
        }),
        Salle: Joi.string().optional().messages({
            'string.base': 'Salle ID must be a valid string'
        })
    });

    return schema.validate(data);
}

const Seance = mongoose.model("Seance", SeanceSchema);

module.exports = { Seance, validateCreatingSeance, validateUpdatingSeance };
