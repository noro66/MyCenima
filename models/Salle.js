import mongoose from "mongoose";

const salleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add the name of the hall"]
    },
    seats: {
        type: Number,
        required: [true, "Please specify the number of seats"],
        min: [1, "The number of seats must be at least 1"]
    },
    type: {
        type: String,
        enum: ['standard', 'VIP', 'IMAX'],
        required: [true, "Please specify the type of hall"]
    }
}, { timestamps: true });

const Salle = mongoose.model("Salle", salleSchema);

export default Salle;
