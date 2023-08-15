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
router.post("/remember", loginController.remember);
router.post("/facebook", loginController.facebook);
router.post("/google", loginController.google);
router.post("/refresh-google-token", loginController.googleRefresh);





module.exports = router;
