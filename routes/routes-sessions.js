const express = require("express");
const router = express.Router();
const SessionsController = require("../controllers/sessions-controller");

router.post("/", SessionsController.friends);
router.post("/upload_session", SessionsController.upload_session);
router.post("/AllSessions", SessionsController.session_invites);
router.post("/AllSessions/comment", SessionsController.comments);
router.post("/MySessions/:id", SessionsController.close_session);


router.get("/AllSessions/:id", SessionsController.get_vote_on_invite);
router.get("/MySessions/:id", SessionsController.my_sessions);

router.patch("/AllSessions/:id", SessionsController.post_vote_on_invite);
router.patch("/MySessions/:id", SessionsController.schedule_session);

router.delete("/MySessions/:id", SessionsController.delete_session);

module.exports = router;
