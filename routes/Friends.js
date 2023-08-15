const express = require("express");
const router = express.Router();
const friendsController = require("../controllers/friends-controller");


router.post("/", friendsController.friends);
router.post("/search_users", friendsController.search_users);
router.post("/req_friend", friendsController.req_friend);
router.post("/res_friend", friendsController.res_friend);





module.exports = router;