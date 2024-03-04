const express = require('express')
const { registerUser, loginUser, updateUserDetails } = require('../controllers/user.controller');
const { verifyJWT } = require("../middlewares/auth.middleware.js");
const router = express.Router();

router.post('/register', registerUser);
router.post('/loginUser', loginUser);
router.post('/updateUserDetails',verifyJWT, updateUserDetails)

module.exports = { router }