const express = require("express");
const router = express.Router();
const loginController = require("../controllers/login-controller");
const { check } = require("express-validator");

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  loginController.signup
);

router.post("/login", loginController.login);

module.exports = router;
