const express = require("express");
const router = express.Router();
const charControler = require("../controllers/charecterSheet-controller");

router.post("/Charecters", charControler.saving);
router.post("/Charecters/spell_search", charControler.search);
router.get("/:id", charControler.allUserPc);

module.exports = router;
