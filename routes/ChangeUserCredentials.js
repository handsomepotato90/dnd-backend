const express = require("express");
const router = express.Router();
const ChangeUserCredentials = require("../controllers/ChangeUserCredentials-controller");



router.post("/change_username", ChangeUserCredentials.change_username);
router.post("/change_password", ChangeUserCredentials.change_password);
router.post("/change_mail", ChangeUserCredentials.change_mail);





module.exports = router;