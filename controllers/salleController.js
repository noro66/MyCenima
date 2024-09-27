const {Salle, validateCreatingSalle, validateUpdateSalle} =  require('../models/Salle')
const asyncHandler = require('express-async-handler')

/**
 * @desc Get all salles
 * @route /api/salles
 * @method GET
 * @access public
 */
const getAllSalles = asyncHandler(async (req, res)=>{
    const salles = await Salle.find();
    res.status(200).json(salles);
});

/**
 * @desc Get Salle by id
 * @route /api/salles/:id
 * @method GET
 * @access public
 */
const getSalleById = asyncHandler(async (req, res)=>{
    const salle = await  Salle.findById(req.params.id);
    if (salle){
        res.status(200).json(salle);
    }else {
        res.status(404).json({message: "salle not found"})
    }
})

/**
 * @desc Create new salle
 * @route /api/salles
 * @method POST
 * @access private
 */
const createSalle = asyncHandler(async (req, res) => {

    // Validate request body
    const { error } = validateCreatingSalle(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const salle = new Salle({
        name: req.body.name,
        seats: req.body.seats,
        type: req.body.type
    });


    // Save to the database
    const result = await salle.save();

    // Return the saved salle
    res.status(201).json(result); // 201 ==> created successfully
})

/**
 * @desc Update a salle
 * @route /api/salles/:id
 * @method PUT
 * @access private
 */
const updateSalle = asyncHandler( async (req, res)=>{
    const {error} = validateUpdateSalle(req.body);
    if (error){
        return res.status(400).json({message: error.details[0].message});
    }
    const updateSalle = await Salle.findByIdAndUpdate( req.params.id, {
        $set : {
            name: req.body.name,
            seats: req.body.seats,
            type: req.body.type
        }
    }, {new : true});
    if (updateSalle){
        res.status(200).json({message: "salle has been update !", salle : updateSalle});
    }else{
        res.status(400).json({message: "salle not found !"});
    }

})

/**
 * @desc Delete a salle
 * @route /api/salles/:id
 * @method DELETE
 * @access private
 */
const deleteSalle = asyncHandler( async (req, res)=>{
    const salle = await  Salle.findById(req.params.id);
    if (salle){
        await  Salle.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "salle has been deleted !"});
    }else{
        res.status(400).json({message: "salle not found !"});
    }
})

module.exports = {getAllSalles, getSalleById, createSalle, updateSalle, deleteSalle};