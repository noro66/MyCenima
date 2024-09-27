const express = require("express");
const router = express.Router();
const {register, login} = require("../controllers/authController");

router.post('/register',register);

router.post('/login', login);

// router.post('/logout', logout);
//
// router.post('/forget', forget);
//
// router.post('/reset', reset);

module.exports = router;