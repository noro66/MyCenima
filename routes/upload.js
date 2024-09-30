const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload')
router.post("/",upload.single("image"), (req, res)=>{
    res.status(200).json({message : "file uploaded successfully"})
})
module.exports = router;