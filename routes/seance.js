const express = require("express");
const {getAllSeances, getSeanceById, createSeance, updateSeance, deleteSeance} = require("../controllers/seanceController");
const {verifyTokenAndAdmin} = require("../middlewares/verifyToken");
const router = express.Router();

router.route('/')
    .get(getAllSeances)
    .post( verifyTokenAndAdmin,  createSeance)

router.route('/:id')
    .get(getSeanceById)
    .put(verifyTokenAndAdmin, updateSeance)
    .delete( verifyTokenAndAdmin,  deleteSeance)

module.exports = router;