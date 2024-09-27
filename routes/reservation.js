const express = require("express");
const {getAllReservations, getReservationById, createReservation, updateReservation, deleteReservation} = require("../controllers/reservationController");
const {verifyTokenAndAdmin, verifyToken} = require("../middlewares/verifyToken");
const router = express.Router();

router.route('/')
    .get(verifyTokenAndAdmin, getAllReservations)
    .post( verifyToken,  createReservation)

router.route('/:id')
    .get(verifyTokenAndAdmin, getReservationById)
    .put(verifyToken, updateReservation)
    .delete( verifyToken,  deleteReservation)

module.exports = router;