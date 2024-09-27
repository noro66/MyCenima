import mongoose from "mongoose";

// Reference to the Film model
const SeanceSchema = new mongoose.Schema({
    dateTime: {
        type: String,
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
        type: mongoose.Schema.Types.ObjectId, // Reference to Film model
        ref: "Film",
        required: [true, "Please add the film ID"]
    },
    Salle: {
        type: mongoose.Schema.Types.ObjectId, // Reference to Hall model
        ref: "Salle",
        required: [true, "Please add the Salle ID"]
    }
}, { timestamps: true });

const Seance = mongoose.model("Seance", SeanceSchema);

export default Seance;
