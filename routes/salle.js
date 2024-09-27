const express = require("express");
const {getAllSalles, getSalleById, createSalle, updateSalle, deleteSalle} = require("../controllers/salleController");
const {verifyTokenAndAdmin} = require("../middlewares/verifyToken");
const router = express.Router();

router.route('/')
    .get(verifyTokenAndAdmin, getAllSalles)
    .post( verifyTokenAndAdmin,  createSalle)

router.route('/:id')
    .get(getSalleById)
    .put(verifyTokenAndAdmin, updateSalle)
    .delete( verifyTokenAndAdmin,  deleteSalle)

module.exports = router;