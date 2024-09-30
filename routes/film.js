const express = require("express");
const {getAllFilms, getFilmById, createFilm, updateFilm, deleteFilm} = require("../controllers/filmController");
const {verifyTokenAndAdmin} = require("../middlewares/verifyToken");
const upload = require("../middlewares/upload");
const router = express.Router();

router.route('/')
    .get(getAllFilms)
    .post( verifyTokenAndAdmin,upload.single("image"), createFilm)

router.route('/:id')
    .get(getFilmById)
    .put(verifyTokenAndAdmin, updateFilm)
    .delete( verifyTokenAndAdmin,  deleteFilm)

module.exports = router;