const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    seance: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seance',
        required: [true, "Please add the seance for this reservation"]
    },
    reservedSeat: {
        seatId: {
            type: mongoose.Schema.Types.ObjectId, // Reference to the seat _id from Seance
            required: [true, "Please specify the seat being reserved"],
            ref: 'Seance'
        }
    },
    reservedBy: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User making the reservation
        ref: 'User',
        required: [true, "Please specify the user making the reservation"]
    },
    status: {
        type: String,
        default: 'pending'
    }
}, { timestamps: true });

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;
