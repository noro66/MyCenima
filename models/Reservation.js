const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    seance: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seance',
        required: true
    },
    reservedSeat: {
        seatId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Seance.seats' // Reference to the seat in Seance's seats array
        }
    },
    reservedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        default: 'pending'
    }
}, { timestamps: true });

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;
