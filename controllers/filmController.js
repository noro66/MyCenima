const {Film, validateCreatingFilm, validateUpdateFilm} =  require('../models/Film')
const asyncHandler = require('express-async-handler')

/**
 * @desc Get all films
 * @route /api/films
 * @method GET
 * @access public
 */
const getAllFilms = asyncHandler(async (req, res)=>{
    const films = await Film.find();
    res.status(200).json(films);
});

/**
 * @desc Get Film by id
 * @route /api/films/:id
 * @method GET
 * @access public
 */
const getFilmById = asyncHandler(async (req, res)=>{
    const film = await  Film.findById(req.params.id);
    if (film){
        res.status(200).json(film);
    }else {
        res.status(404).json({message: "film not found"})
    }
})

/**
 * @desc Create new film
 * @route /api/films
 * @method POST
 * @access private
 */
const createFilm = asyncHandler(async (req, res) => {

    // Validate request body
    const { error } = validateCreatingFilm(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const film = new Film({
        image: req.image.name,
        title: req.body.title,
        description: req.body.description,
        genre: req.body.genre,
        duration: req.body.duration,
        year: req.body.year
    });

    // Save to the database
    const result = await film.save();

    // Return the saved film
    res.status(201).json(result); // 201 ==> created successfully
})

/**
 * @desc Update a film
 * @route /api/films/:id
 * @method PUT
 * @access private
 */
const updateFilm = asyncHandler( async (req, res)=>{
    const {error} = validateUpdateFilm(req.body);
    if (error){
        return res.status(400).json({message: error.details[0].message});
    }
    const updateFilm = await Film.findByIdAndUpdate( req.params.id, {
        $set : {
            title: req.body.title,
            description: req.body.description,
            genre: req.body.genre,
            duration: req.body.duration,
            year: req.body.year
        }
    }, {new : true});
    if (updateFilm){
        res.status(200).json({message: "film has been update !", film : updateFilm});
    }else{
        res.status(400).json({message: "film not found !"});
    }

})

/**
 * @desc Delete a film
 * @route /api/films/:id
 * @method DELETE
 * @access private
 */
const deleteFilm = asyncHandler( async (req, res)=>{
    const film = await  Film.findById(req.params.id);
    if (film){
        await  Film.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "film has been deleted !"});
    }else{
        res.status(400).json({message: "film not found !"});
    }
})

module.exports = {getAllFilms, getFilmById, createFilm, updateFilm, deleteFilm};