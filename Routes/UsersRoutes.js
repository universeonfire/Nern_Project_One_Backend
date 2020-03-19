const express = require("express");
const { check } = require('express-validator');

const UsersControllers = require("../Controllers/UsersControllers");

const router = express.Router();

//list of all users
router.get("/",UsersControllers.getAllUsers);
//Sign up route
router.post("/signup",[
    check('name')
      .not()
      .isEmpty(),
    check('email')
      .normalizeEmail() // Test@test.com => test@test.com
      .isEmail(),
    check('password').isLength({ min: 6 })
  ],UsersControllers.signup);
//Sign in
router.post("/signin",UsersControllers.signin);

module.exports = router;
