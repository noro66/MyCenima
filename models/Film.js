const mongoose = require("mongoose");
const Joi = require("joi");

const FilmSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please add the title of the film"],
        trim: true,
        minLength: 1,  // You can adjust the minimum length as needed
        maxLength: 250  // Maximum length for title
    },
    description: {
        type: String,
        required: [true, "Please add a description of the film"],
        trim: true,
        minLength: 5,  // Minimum length for description
        maxLength: 1000 // Maximum length for description
    },
    genre: {
        type: String,
        required: [true, "Please add the genre of the film"],
        trim: true,
        minLength: 3, // Minimum length for genre
        maxLength: 100 // Maximum length for genre
    },
    duration: {
        type: Number,
        required: [true, "Please specify the duration of the film"],
        min: 1 // Minimum duration in minutes
    },
    year: {
        type: Number,
        required: [true, "Please add the year of production"],
        min: 1888, // Assuming films started in 1888
        max: new Date().getFullYear() // Current year
    }
}, { timestamps: true });

const Film = mongoose.model("Film", FilmSchema);

// Joi validation for creating a film
function validateCreatingFilm(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().min(1).max(250).required(),
        description: Joi.string().min(5).max(1000).required(),
        genre: Joi.string().trim().min(3).max(100).required(),
        duration: Joi.number().min(1).required(),
        year: Joi.number().min(1888).max(new Date().getFullYear()).required(),
    });

    return schema.validate(obj);
}

// Joi validation for updating a film
function validateUpdateFilm(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().min(1).max(250),
        description: Joi.string().min(5).max(1000),
        genre: Joi.string().trim().min(3).max(100),
        duration: Joi.number().min(1),
        year: Joi.number().min(1888).max(new Date().getFullYear()),
    });

    return schema.validate(obj);
}

module.exports = { Film, validateCreatingFilm, validateUpdateFilm };
