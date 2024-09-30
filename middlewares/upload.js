const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, path.join(__dirname, "../images"));
    },
    filename: function (req,file, cb){
        let name =  new Date().toISOString() + file.originalname
        cb(null, name);
        req.image = { name }
    }
});

const upload = multer({storage});

module.exports = upload;