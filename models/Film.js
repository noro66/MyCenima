import mongoose from "mongoose";

const FilmSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please add the title of the film"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please add a description of the film"],
        trim: true
    },
    genre: {
        type: String,
        required: [true, "Please add the genre of the film"],
        trim: true
    },
    duration: {
        type: Number,
        required: [true, "Please specify the duration of the film"],
    },
    year: {
        type: Number,
        required: [true, "Please add the year of production"],
    }
}, { timestamps: true });

const Film = mongoose.model("Film", FilmSchema);

export default Film;
