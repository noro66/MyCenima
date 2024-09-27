const express = require("express");
const router = express.Router();
const {createAdmin, getAdminById, getAllAdmins, updateAdmin, deleteUser} = require('../controllers/adminController')
const {verifyTokenAndAdmin} = require("../middlewares/verifyToken");


router.post('/create', )

router.route('/')
    .get(getAllAdmins)
    .post( verifyTokenAndAdmin,  createAdmin)

router.route('/:id')
    .get(verifyTokenAndAdmin, getAdminById)
    .put(verifyTokenAndAdmin, updateAdmin)
    .delete( verifyTokenAndAdmin,  deleteUser)

module.exports = router;
