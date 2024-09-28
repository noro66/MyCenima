const asyncHandler = require('express-async-handler')
const {Seance} = require("../models/Seance");
const Reservation = require("../models/Reservation");

/**
 * @desc Get all reservations
 * @route /api/reservations
 * @method GET
 * @access public
 */
const getAllReservations = asyncHandler(async (req, res)=>{
    const reservations = await Reservation.find();
    res.status(200).json(reservations);
});

/**
 * @desc Get Reservation by id
 * @route /api/reservations/:id
 * @method GET
 * @access public
 */
const getReservationById = asyncHandler(async (req, res)=>{
    const reservation = await  Reservation.findById(req.params.id);
    if (reservation){
        res.status(200).json(reservation);
    }else {
        res.status(404).json({message: "reservation not found"})
    }
})

/**
 * @desc Create new reservation
 * @route /api/reservations
 * @method POST
 * @access private
 */
const createReservation = asyncHandler(async (req, res) => {

    const seance = await Seance.findById(req.body.seanceId);
    if (!seance) {
        return res.status(400).json({ message: 'The selected seance is not found.' });
    }

    const {number} =  seance.seats.find(seat => seat._id.toString() === req.body.seatId);

// Verify that the seat is available
    const seatToBook = seance.seats.some(availableSeat =>
        availableSeat.available && availableSeat.number === number
    );
    console.log(seatToBook, number, seance.seats)
    if (!seatToBook) {
        return res.status(400).json({ message: 'The selected seat is not available.' });
    }

// Mark the seat as reserved
    seance.seats = seance.seats.map(seat =>
        seat.number === number ? { ...seat, available: false } : seat
    );

// Save the seance with the updated seat status
    await seance.save();
    console.log(req.body, req.user.id)
    const reservation = new Reservation ({
        seance: req.body.seanceId,
        reservedSeat: { seatId: req.body.seatId },
        reservedBy: req.user.id,
        status: 'pending'
    });
    const result = await reservation.save();
    res.status(200).json({ message: 'Seat reserved successfully.', result });
})

/**
 * @desc Update a reservation
 * @route /api/reservations/:id
 * @method PUT
 * @access private
 */
const updateReservation = asyncHandler( async (req, res)=>{
    const reservation = await  Reservation.findById(req.params.id);
    if (reservation && reservation.reservedBy.toString() !== req.user.id){
        return res.status(401).json({message : "you cant update this reservation"})
    }

    const seance = await Seance.findById(req.body.seanceId);

    if (!seance) {
        return res.status(400).json({ message: 'The selected seance is not found.' });
    }

    const {available} =  seance.seats.find(seat => seat._id.toString() === req.body.seatId);


    if (!available){
        return res.status(400).json({ message: 'The selected seat  is not available.' });
    }
    const oldSeance = await  Seance.findById(reservation.seance.id);

   oldSeance.seats =  oldSeance.seats.map( seat => seat.id === reservation.reservedSeat.seatId ?  { ...seat, available: true } : seat);
    // oldSeance.save();
    const updateReservation = await Reservation.findByIdAndUpdate( req.params.id, {
        $set : {
            seance: req.body.seanceId,
            reservedSeat: { seatId: req.body.seatId },
            reservedBy: req.user.id,
            status: 'pending'
        }
    }, {new : true});
    if (updateReservation){
        res.status(200).json({message: "reservation has been update !", reservation : updateReservation});
    }else{
        res.status(400).json({message: "reservation not found !"});
    }

})

/**
 * @desc Delete a reservation
 * @route /api/reservations/:id
 * @method DELETE
 * @access private
 */
const deleteReservation = asyncHandler( async (req, res)=>{
    const reservation = await  Reservation.findById(req.params.id);
    if (reservation && reservation.reservedBy.toString() !== req.user.id){
        return res.status(401).json({message : "you cant delete this reservation"})
    }
    if (reservation){
        await  Reservation.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "reservation has been deleted !"});
    }else{
        res.status(400).json({message: "reservation not found !"});
    }
})

module.exports = {getAllReservations, getReservationById, createReservation, updateReservation, deleteReservation};