const express = require("express");
const router = express.Router();
const {register, login, me} = require("../controllers/authController");
const {verifyToken} = require("../middlewares/verifyToken");

router.post('/register',register);

router.post('/login', login);
router.get('/me',verifyToken,  me);

// router.post('/logout', logout);
//
// router.post('/forget', forget);
//
// router.post('/reset', reset);

module.exports = router;