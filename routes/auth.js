const express = require("express");
const router = express.Router();
const {register, login, me, sendForgotPasswordLink, getForgotPassword, resetPassword} = require("../controllers/authController");
const {verifyToken} = require("../middlewares/verifyToken");

// Route for registration and login
router.route('/register')
    .post(register);  // POST request to /api/auth/register for user registration

router.route('/login')
    .post(login);  // POST request to /api/auth/login for user login

// Route for retrieving profile (requires token verification)
router.route('/me')
    .get(verifyToken, me);  // GET request to /api/auth/me to get current user's info

// Route for forgot password (sending reset link)
router.route('/forget-password')
    .post(sendForgotPasswordLink);  // POST request to /api/auth/forget-password

// Route for reset password (get the reset token)
router.route('/reset-password/:userId/:token')
    .get(getForgotPassword)  // GET request to verify the reset password token
    .post(resetPassword);

// router.post('/logout', logout);
module.exports = router;