const express = require("express");
const {verifyToken} = require("../middlewares/verifyToken");
const {createReservation} = require("../controllers/reservationController");
const router = express.Router();

router.post('/', verifyToken, createReservation);

// createReservation

module.exports = router;