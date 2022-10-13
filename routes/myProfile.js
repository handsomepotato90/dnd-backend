const express = require("express");
const router = express.Router();
const Monster = require("../models/monsters");
const HttpError = require("../models/http-error");
const { default: mongoose } = require("mongoose");
router.post("/", async (req, res, next) => {
  try {
    monster = await Monster.find({creator: req.body.user });
  } catch (err) {
    const error = new HttpError(
      `Can't fetch all creatures. Try again later.`,
      500
    );
    return next(error);
  }
  res.status(201).json(monster);
});



router.delete("/:id", async (req, res, next) => {
    try {
      delEnc = await Monster.findById(req.params.id).populate('creator');
    } catch (err) {
      const error = new HttpError(
        `Delete failed.`,
        500
      );
      return next(error);
    }
    if(!delEnc){
      const error = new HttpError(
        `Can't find Creature.`,
        500
      );
      return next(error);
    }

    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await delEnc.remove({session:sess});
      delEnc.creator.monsters.pull(delEnc)
      await delEnc.creator.save({session:sess});
      await sess.commitTransaction();
    } catch (err) {
      const error = new HttpError(
        `Delete failed`,
        500
      );
      return next(error);
    }

  res.status(201).json({message:'Encounter deleted.'});
});

module.exports = router;
