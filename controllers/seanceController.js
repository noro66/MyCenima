const {Seance, validateCreatingSeance, validateUpdatingSeance} =  require('../models/Seance')
const asyncHandler = require('express-async-handler')

/**
 * @desc Get all seances
 * @route /api/seances
 * @method GET
 * @access public
 */
const getAllSeances = asyncHandler(async (req, res)=>{
    const seances = await Seance.find();
    res.status(200).json(seances);
});

/**
 * @desc Get Seance by id
 * @route /api/seances/:id
 * @method GET
 * @access public
 */
const getSeanceById = asyncHandler(async (req, res)=>{
    const seance = await  Seance.findById(req.params.id);
    if (seance){
        res.status(200).json(seance);
    }else {
        res.status(404).json({message: "seance not found"})
    }
})

/**
 * @desc Create new seance
 * @route /api/seances
 * @method POST
 * @access private
 */
const createSeance = asyncHandler(async (req, res) => {

    // Validate request body
    const { error } = validateCreatingSeance(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const seance = new Seance({
        dateTime: req.body.dateTime,  // Date and time of the screening
        price: req.body.price,        // Price for the screening
        seats: req.body.seats,        // Seats array
        film: req.body.film,          // Film ID (referenced from Film model)
        Salle: req.body.Salle         // Salle ID (referenced from Salle model)
    });

    // Save to the database
    const result = await seance.save();

    // Return the saved seance
    res.status(201).json(result); // 201 ==> created successfully
})

/**
 * @desc Update a seance
 * @route /api/seances/:id
 * @method PUT
 * @access private
 */
const updateSeance = asyncHandler( async (req, res)=>{
    const {error} = validateUpdatingSeance(req.body);
    if (error){
        return res.status(400).json({message: error.details[0].message});
    }
    const updateSeance = await Seance.findByIdAndUpdate( req.params.id, {
        $set : {
            dateTime: req.body.dateTime,  // Date and time of the screening
            price: req.body.price,        // Price for the screening
            seats: req.body.seats,        // Seats array
            film: req.body.film,          // Film ID (referenced from Film model)
            Salle: req.body.Salle         // Salle ID (referenced from Salle model)
        }
    }, {new : true});
    if (updateSeance){
        res.status(200).json({message: "seance has been update !", seance : updateSeance});
    }else{
        res.status(400).json({message: "seance not found !"});
    }

})

/**
 * @desc Delete a seance
 * @route /api/seances/:id
 * @method DELETE
 * @access private
 */
const deleteSeance = asyncHandler( async (req, res)=>{
    const seance = await  Seance.findById(req.params.id);
    if (seance){
        await  Seance.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "seance has been deleted !"});
    }else{
        res.status(400).json({message: "seance not found !"});
    }
})

module.exports = {getAllSeances, getSeanceById, createSeance, updateSeance, deleteSeance};