import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
    seance: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seance',
        required: [true, "Please add the seance for this reservation"]
    },
    reservedSeats: [
        {
            number: {
                type: Number,
                required: true  // Assuming seat numbers must be provided
            }
        }
    ],
    status: {
        type: String,
        default: 'pending',
        required: [true, "Please specify the reservation status"]
    }
}, { timestamps: true });

const Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;
